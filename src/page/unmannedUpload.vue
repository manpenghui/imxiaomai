<template lang="html">
    <div class="unmanedUploadPage">
        <div class="tips">
            <img src="/static/images/image_text.png"/>
        </div>
        <div class="uploadCon" v-on:click="chooseImg()">
            <!--<img :src="imgSrc" /><br/>
            <p>一张清晰自拍（不对外展示）</p>-->
            <img  class="imgLeve1" :src="imgSrc"/>
            <img  v-show="isShowImg"  class="imgLeve2" :src="imgSrc"/>
            <img  v-show="isShowDefault"  class=" default" :src="imgDefault" />

            <div class="tipContent">
                <p class="text">本人清晰正脸照</p>
                <p class="toChoose">点击选择照片</p>
            </div>
           
           
           
        </div>
        <div  class="toJump">
           
            <p class="uploadImg" v-on:click="upLoadImg()" >上传并注册</p>
             <p class="ignore" v-on:click="toIndexPage()">跳过此步骤 在我的-人脸识别中寻找</p>
             <!--<p>serverId:{{serverId}}</p>
             <p>upLoadServerIdData:{{upLoadServerIdData}}</p>-->
        
        </div>

    
    
    
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '../router/router'
    import { Indicator,Toast } from 'mint-ui';

    export default {
        data: function() {
            return {
                userData: "",
                responseData: "",
                imgSrc:"static/images/image_bg.png",
                imgDefault:"static/images/icon_camera-.png",
                localIds: "",
                serverId: "",
                isShowBtn: true,
                upLoadServerIdData: "",
                isShowImg: false,
                isShowDefault:true,
                isAndroid:"",
                isIOS:""
            }
        },

        created: function() {
            moveAction();
            this.deviceType();
            // this.getFaceImgFromServer();
            this.$store.commit('isLoading', true)
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });
            this.registered();
        },
        mounted:function(){
             if(store.get("reload")=="false"){
                store.set("reload",true)

                location.reload();
                return;
            }
            this.$store.commit('isLoading', false)

        },
        methods: {
            getInfo: function() {
                var userInfo = JSON.parse(store.get("userInfo"));
                this.userData = userInfo;
            },
            chooseImg: function() {
                var _this = this;
                // alert(1);
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function(res) {

                        _this.localIds = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        _this.imgSrc=res.localIds[0];
                        _this.isShowImg = true;
                        _this.isShowBtn = true;
                        _this.isShowDefault=false;
                        if(_this.isIOS){
                          wx.getLocalImgData({
                             localId: res.localIds[0],
                             success: function (res) {
                                _this.imgSrc = res.localData.replace('jgp', 'jpeg');
                             }
                           });
                        }
                        // alert( _this.imgSrc);
                    },
                    fail:function(){
                          Toast({
                            message: '微信接口调用失败',
                            position: 'middle',
                            duration: 1000
                            });
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
                if(this.localIds==""){
                    Toast({
                        message: '您尚未选择图片',
                        position: 'middle',
                        duration: 1000
                        });
                        return;
                }
                var _this = this;
                Indicator.open({
                    text: '上传中...',
                    spinnerType: 'triple-bounce'
                    });
             
                wx.uploadImage({
                    localId: _this.localIds, // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 0, // 默认为1，显示进度提示
                    success: function(res) {
                        // alert(res)
                        // alert("uploadImage；serverId",res.serverId);
                        _this.serverId = res.serverId; // 返回图片的服务器端ID
                        _this.upLoadServerId(res.serverId)

                    },
                    fail:function(res){
                        Indicator.close();
                          Toast({
                            message: '图片上传失败',
                            position: 'middle',
                            duration: 1000
                            });
                        return;
                       
                       
                    },
                    complete:function(res){
                        
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
                    //    alert("upLoadServerId:",response.data);
                        let responseData = JSON.parse(response.data)
                        _this.upLoadServerIdData = responseData
                        if (responseData.code == 1) {
                            Indicator.close();
                            Toast({
                                message: '图片上传成功',
                                position: 'middle',
                                duration: 1000
                                });
            
                            _this.imgSrc = responseData.url;
                            _this.isShowBtn = false;
                             _this.isShowImg = false;
                             router.push("/first");


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
            },
            toIndexPage:function(){
                    router.push("/first");
                    return;
            },
            registered: function() {
                var xmUrl = location.href.split('#')[0];
                axios.get('/auth/signature.do?url=' + xmUrl)
                    .then(function(response) {
                        var xmappId = response.data.appId;
                        var xmtimestamp = response.data.timestamp;
                        var xmnonceStr = response.data.nonceStr;
                        var xmsignature = response.data.signature;
                        wx.config({
                            debug: false,
                            appId: xmappId,
                            timestamp: xmtimestamp,
                            nonceStr: xmnonceStr,
                            signature: xmsignature,
                            jsApiList: [
                                'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideAllNonBaseMenuItem',
                                'showAllNonBaseMenuItem',
                                'translateVoice',
                                'startRecord',
                                'stopRecord',
                                'onRecordEnd',
                                'playVoice',
                                'pauseVoice',
                                'stopVoice',
                                'uploadVoice',
                                'downloadVoice',
                                'chooseImage',
                                'previewImage',
                                'uploadImage',
                                'downloadImage',
                                'getNetworkType',
                                'openLocation',
                                'getLocation',
                                'hideOptionMenu',
                                'showOptionMenu',
                                'closeWindow',
                                'scanQRCode',
                                'chooseWXPay',
                                'openProductSpecificView',
                                'addCard',
                                'chooseCard',
                                'openCard'
                            ]
                        });
                    })
                    .catch(function(error) {
                       
                    });

                wx.error(function(res) {
                   
                    _self.$store.commit('changeIndexConf',   {                    
                        isToast:  true,
                        toastTip:   "系统出现问题,请暂勿使用,谢谢配合"                
                    });
                });
                var _self = this;
                wx.ready(function() {
                //    _self.chooseImg();
                });
            }

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/unmannedUpload.scss";
</style>
