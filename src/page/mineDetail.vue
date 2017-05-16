<template lang="html">
<ul class="mineDetail">
    <div class="uploadImgItem" v-on:click="chooseImg">
        <div class="left">
            <p class="p1">上传照片<!--<span>(本人清晰正脸照,不公开）</span>--></p>
           <p class="p2">上传头像享受人脸识别、无需排队等超级福利</p>
        </div>
        <div class=right  >
            <img   :src="imgSrc"/>
        </div>

    </div>
    <li class="item" style="height: 0.55rem;line-height: 0.55rem;">
        <span>头像</span>
        <img  :src="userData.obj.headimgurl " alt="">

    </li>
    <li class="item">
         <span>用户名</span>
        <span>{{userData.des}}</span>
    </li>
    <li class="item">
          <span>昵称</span>
        <span>{{userData.obj.nickname}}</span>
    </li>
    <li class="item">
          <span>性别</span>
        <span>{{userData.obj.sex==1 ? "男" :  "女"}}</span>
    </li>
    <!--<li class="item">
          <span>出生日期</span>
         <span>{{userData.createTime? userData.createTime : 820425600000 |date}}</span>
    </li>-->
    <div class="imgContent" v-show="isShowImg">
        <img  :src="imgSrc" alt="">
        <div class="upload_btn" v-on:click="upLoadImg" v-show="isShowBtn">上传图片</div>
        <!--<span>localIds:{{localIds}}</span>
        <span>serverId:{{serverId}}</span>
        <span>upLoadServerIdData:{{upLoadServerIdData}}</span>-->
    </div>
</ul>
</template>

<script>
    import axios from 'axios'
      import router from '../router/router'
    import { Indicator } from 'mint-ui';
    export default {
        data: function() {
            return {
                userData: "",
                responseData: "",
                imgSrc:"../../static/images/icon_camera.png",
                localIds: "",
                serverId: "",
                isShowBtn: false,
                upLoadServerIdData: "",
                isShowImg: false,
                isAndroid:"",
                isIOS:""
            }
        },

        created: function() {
            moveAction();
            this.deviceType();
            this.getFaceImgFromServer();
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });
            this.getInfo();
            
        },
        mounted:function(){
             $(".com-app").css("background","#f6f6f6")

        },
        methods: {
            getInfo: function() {
                var userInfo = JSON.parse(store.get("userInfo"));
                this.userData = userInfo;
            },
            chooseImg: function() {
                var _this = this;
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function(res) {

                        _this.localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        _this.imgSrc=res.localIds[0];
                        _this.isShowImg = true;
                        _this.isShowBtn = true;
                        if(_this.isIOS){
                          wx.getLocalImgData({
                             localId: res.localIds[0],
                             success: function (res) {
                                _this.imgSrc = res.localData.replace('jgp', 'jpeg');

                             }
                           });
                        }




                    }
                });
            },
            previewImg: function() {
                wx.previewImage({
                    current: '', // 当前显示图片的http链接
                    urls: [] // 需要预览的图片http链接列表
                });
            },
            upLoadImg: function() {

                var _this = this;
                Indicator.open({
                    text: '上传中...',
                    spinnerType: 'triple-bounce'
                    });
                wx.uploadImage({
                    localId: _this.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 0, // 默认为1，显示进度提示
                    success: function(res) {
                      
                        _this.serverId = res.serverId; // 返回图片的服务器端ID
                        _this.upLoadServerId(res.serverId)

                    },
                       fail:function(res){
                        // alert("fail:"+res.toString())
                         Indicator.open({
                            text: '上传失败...',
                            spinnerType: 'triple-bounce'
                            });
                            Indicator.close();
                    },
                    complete:function(res){
                        //  alert("com:"+res.toString())
                    }
                });
            },
            upLoadServerId: function(serverid) {
                var _this = this;
                axios.get('/member/uploadMemberIcon', {
                        params: {
                            serverId: serverid
                        }
                    })
                    .then(function(response) {
                        // console.log(response);
                        let responseData = JSON.parse(response.data)
                        _this.upLoadServerIdData = responseData
                        if (responseData.code == 1) {
                            Indicator.close();
                            _this.$store.commit('changeIndexConf', {
                                isToast: true,
                                toastTip: "上传成功"
                            });
                            _this.imgSrc = responseData.url;
                            _this.isShowBtn = false;
                            setTimeout(function() {
                                _this.$store.commit('changeIndexConf',   {                    
                                    isToast: false,
                                     toastTip:   ""                
                                });
                                _this.isShowImg = false;
                            }.bind(_this), 800)

                        } else {
                              Indicator.close();
                            _this.$store.commit('changeIndexConf', {
                                isToast: true,
                                toastTip: responseData.msg
                            });
                            setTimeout(function() {
                                _this.$store.commit('changeIndexConf',   {                    
                                    isToast: false,
                                     toastTip:   ""                
                                });
                            }.bind(_this), 800)
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            getFaceImgFromServer: function() {
                var _this = this;
                axios.get('/member/getFaceImg')
                    .then(function(response) {
                        let resData = JSON.parse(response.data)
                            // console.log(resData);
                        if (!resData.url) {
                            _this.imgSrc = "../../static/images/icon_camera.png";
                            _this.isShowImg = true;
                        } else {
                            _this.isShowImg = false;
                            _this.imgSrc = resData.url;
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            deviceType:function(){
              var u = navigator.userAgent, app = navigator.appVersion;
              this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
              this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            }

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/mineDetail.scss";
</style>
