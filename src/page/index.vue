<template>
<div style="width:100%;height:100%;">
<div id="shopMarket">
<label @click="turnScan()"></label>
<img  src="/static/images/shopMarket.png">

</div>

  <div id="wrapper">
        <ul id="goods">
        <div class="index" >
         <div id="top">
           <div class="icon"><img  @click="position()" src="/static/images/icon.png"></div>
           <div v-if="!isLoad" class="logo_in" @click="logoinAction()"><label>登陆</label></div>
           <div v-if="isLoad" class="member_info"><label>{{userNum}}</label></div>
         </div>

        <div id="banner">

        <div id="focus" class="focus">
        <div class="hd">
          <ul>
          </ul>
        </div>
        <div class="bd">
          <ul>
            <li v-for="bannerInfo in bannerInfos"><a :href=bannerInfo.linkPath><img class="banner_img" :_src="bannerInfo.imgPath" :src="bannerInfo.imgPath" /></a></li>
          </ul>
        </div>

      </div>
      </div>

      <div id="entrance">
          <div class="entrance_style" @click="turnPage('scan')">
               <img src="/static/images/scan.png">
              <label>扫码自购</label>

          </div>
           <div class="entrance_style" @click="turnPage('rechargeCenter')">
              <img src="/static/images/top-up.png">
              <label>会员充值</label>

          </div>
           <div @click="turnPage('callMe')" class="entrance_style">
              <img src="/static/images/member.png">
              <label>会员专区</label>
          </div>
      </div>
      <!-- <div id="member">
          <div class="logo_style">
          </div>
          <img src="../../static/images/member_logo.png">
          <div class="member_style">
              <img src="../../static/images/new_mem.png">
              <label>铁牌会员9.5折</label>
          </div>
          <div class="member_style">
              <img src="../../static/images/t_mem.png">
              <label>青铜会员9.0折</label>
          </div>
          <div class="member_style">
              <img src="../../static/images/y_mem.png">
              <label>白银会员8.5折</label>
          </div>
          <div class="member_style">
              <img src="../../static/images/j_mem.png">
              <label>黄金会员8.0折</label>
          </div>
          <div class="member_style">
              <img src="../../static/images/b_mem.png">
              <label>白金会员7.5折</label>
          </div>
          <div class="member_style">
              <img src="../../static/images/z-mem.png">
              <label>钻石会员7.0折</label>
          </div>
          <div class="more_info" @click="memberMsg()">了解会员特权</div>
      </div> -->
        <div style="width:100%;height:8px;background:#eee;"></div>
        <div id="msg_title">扫码专享特价商品</div>
  </div>
            <li  class="goods_style" v-for="goods in goodsList">
            <img class="goodImg" v-if="goods.imgUrl==null" src="/static/images/xiaomai.jpg">
            <img class="goodImg" v-if="goods.imgUrl!=null" :src="goods.imgUrl">
            <label class="name">{{goods.goodsName}}</label>
            <label class="note">{{goods.des}}</label>
            <label v-if="goods.price==0" class="money">暂无价格</label>
            <label v-if="goods.price!=0" class="money">¥{{goods.price}}<span>¥{{goods.originalPrice}}</span></label>
            <label v-if="goods.discountTag!=null&goods.price!=0" class="type"><span>{{goods.discountTag*10}}折</span>
            <img @click="addAction(goods.goodsGbk,goods.imgUrl)" class="add_style" src="/static/images/fadd.png">
            </label>
            </li>
            <li v-if="!goodsList||goodsList.length==0" style="width:100%;"><img class="replace_style" src="/static/images/replacePic.png"></li>
             <div class="no-msg" v-if="!isReload">已经没有了,更多商品,请进店选购</div>
          <!--    <div v-if="isShow" class="more"><img  src="../../static/images/position.png"></div>
             <div class="no-msg" v-if="!isReload">已经没有了,更多商品,请进店选购</div>
            <div style="width:100%;height:60px;"></div> -->
        </ul>

  </div>

</div>

</template>

<script>
    import router from '../router/router'
    import axios from 'axios'
    var bannerArr = new Array();
    var goodsArr = new Array();
    var shopCode = "";
    export default {
        beforeCreate() {
            bannerArr = JSON.parse(store.get('bannerList'));
        },
        data: function() {
            return {
                "pageNum": 1,
                "isShow": false,
                "isReload": true,
                "isLoad": false,
                "userNum": "",
                "bannerInfos": bannerArr,
                "goodsList": []

            }
        },
        created() {
            // head的修改
            //this.getGoodsList(); //
            this.registered();
            this.shareFriend();
            this.$store.commit('changeIndexConf', {
                isFooter: true,
                isToast: false,
            })
        var ua = navigator.userAgent.toLowerCase();        
        var isAndroid = ua.indexOf('android') != -1;
        var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);
            if (store.get('isReload')==""&&isIos) {
              store.set("isReload","xxx");
             window.location.reload();
           }
           if(isAndroid){
            store.set("isReload","xxx");
           }
        },
        components: {

        },
        beforeDestroy() {

        },
        computed: {},
        mounted: function() {

            // if (store.get('position') == "") {
            //     router.push("/position");
            // } else {
            //     shopCode = store.get('position');
            //     if (store.get('userInfo') == "") {
            //         this.getUserInfo();
            //     } else {
            //         this.userNum = store.get('shopName');
            //         this.isLoad = true;
            //         this.getGoodsList();
            //     }
            // }

            this.initAction();
        },
        methods: {
            shareFriend: function() {
                var _self = this;
                
                wx.onMenuShareAppMessage({
                    title: '扫码自购', // 分享标题
                    desc: '小麦公社自助收银，省钱省时又省力', // 分享描述
                    link: location.host+'/auth.do', // 分享链接
                    imgUrl: 'http://upload.imxiaomai.com/gaiaUpload/2017/3/1/500f580124513c93bfd1e207ce23e542.jpg', // 分享图标
                    type: 'link', // 分享类型,music、video或link，不填默认为link
                    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                    success: function() {
                        // 用户确认分享后执行的回调函数

                        _self.$store.commit('changeIndexConf',   {  
                            isToast:  true,
                            toastTip:   "分享成功"                
                        });
                    },
                    cancel: function() {
                        // 用户取消分享后执行的回调函数
                        _self.$store.commit('changeIndexConf',   {      
                            isToast:  true,
                            toastTip:   "分享失败"                
                        });
                    }
                });
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
                        store.set("position", "XM0001");
                        router.push("/first");

                        _self.$store.commit('changeIndexConf',   {                    
                            isToast:  true,
                             toastTip:   "系统出现问题,请暂勿使用,谢谢配合"                
                        });

                    });

                wx.error(function(res) {
                    store.set("position", "XM0001");
                    router.push("/first");
                    _self.$store.commit('changeIndexConf',   {                    
                        isToast:  true,
                        toastTip:   "系统出现问题,请暂勿使用,谢谢配合"                
                    });
                });
                var _self = this;
                wx.ready(function() {
                   _self.judgeAcion();
                });
            },
            judgeAcion:function(){
                var _self = this;
                if (store.get('position') == "") {
                        router.push("/position");
                        //window.location.href="/?#/position";
                    } else {
                        shopCode = store.get('position');
                        if (store.get('userInfo') == "" & shopCode != "") {
                            _self.getUserInfo();
                        } else {
                            _self.isLoad = true;
                            _self.userNum = store.get('shopName');
                            _self.getUserInfo();
                            //_self.getGoodsList();
                        }


                    }
            },
            initAction: function() {
                var _self = this;
                TouchSlide({
                    slideCell: "#focus",
                    titCell: ".hd ul", //开启自动分页 autoPage:true ，此时设置 titCell
                    mainCell: ".bd ul",
                    effect: "left",
                    autoPlay: true, //自动播放
                    autoPage: true, //自动分页
                    switchLoad: "_src" //切换加载，真实图片路径为"_src"
                });

                refresher.init({
                    id: "wrapper",
                    pullDownAction: Refresh,
                    pullUpAction: Load
                });

                Refresh();

                function Refresh() {
                    setTimeout(function() {
                        wrapper.refresh();
                    }, 500);

                }

                function Load() {
                    setTimeout(function() {
                        wrapper.refresh();
                        _self.addMore();
                    }, 500);
                }
                //this.registered();
            },
            logoinAction: function() {
                router.push("/login")
            },
            position: function() {
                router.push("/position")

            },
            turnScan: function() {
                router.push("/scan/shopMarket")
            },
            memberInfo: function() {
                router.push("/mineDetail")
            },
            turnPage: function(msg) {
                if (this.isLoad) {
                    switch (msg) {
                        case "callMe":
                            router.push("/memberInfo")
                            break;
                        case "scan":
                            router.push("/scan/nomal");
                            break;
                        case "rechargeCenter":
                            router.push("/rechargeCenter")
                            break;
                    }


                } else {
                    router.push("/login");
                }


            },
            addAction: function(gbk, imgurl) {
                if (imgurl == null || imgurl == undefined) {
                    imgurl = "/static/images/xiaomai.jpg";
                }
                this.fly(event, imgurl);
                var _self = this;
                axios.get('/cart/addGoods.do?gbk=' + gbk + '&shopCode=' + store.get('position'))
                    .then(function(response) {


                        // $("#shopMarket label").animate({fontSize:"26px"}, 100);
                        // $("#shopMarket label").animate({fontSize:"14px"}, 100);
                        $("#shopMarket label").text(response.data.obj.num);


                    })
                    .catch(function(error) {

                    });


            },
            fly: function(event, imgurl) {
                //设置开始点
                var _this = $(event.target);
                var s_l = 10;
                var s_t = _this.offset().top;
                //落点位置
                var e_l = $("#shopMarket").offset().left + 30;
                var e_t = $("#shopMarket").offset().top + 30;
                //抛物线的图片
                //创建对象
                var flyer = $("<img src='" + imgurl + "' width='50' height='50' style='border-radius:50%;z-index:9999' >")
                flyer.fly({
                    start: {
                        left: s_l,
                        top: s_t
                    },
                    end: {
                        left: e_l,
                        top: e_t,
                        width: 0,
                        height: 0
                    },
                    onEnd: function() {
                        flyer.fadeOut("300", function() {
                            $(this).remove();
                        });
                    }

                })

            },
            getShopList: function() {
                axios.get('/cart/getCart.do?shopCode=' + store.get('position'))
                    .then(function(response) {
                        $("#shopMarket label").text(response.data.obj.num);
                    })
                    .catch(function(error) {

                    });

            },
            getGoodsList: function() {
                var _self = this;
                _self.$store.commit('isLoading', true);
                var urlString = "/goods/getIndexSpecialGoods.do?shopCode=" + shopCode + "&currentPage=1";
                axios.get(urlString)
                    .then(function(response) {
                        _self.$store.commit('isLoading', false);
                        var linshiArr = new Array();
                        linshiArr = response.data.result;
                        _self.goodsList = linshiArr;
                        _self.pageNum = response.data.currentPage + 1;
                        _self.getShopList();
                    })
                    .catch(function(error) {});
            },
            getUserInfo: function() {
                var _self = this;
                axios.get("/autoLogin.do?openId=" + store.get('user'))
                    .then(function(response) {
                        if (response.data.code == 200) {
                            _self.isLoad = true;
                            _self.userNum = store.get('shopName');
                            _self.getGoodsList();
                            store.set("userInfo", JSON.stringify(response.data));
                        } else {
                            _self.isLoad = false;
                            //_self.logoinAction();
                            _self.getGoodsList();

                        }
                    })
                    .catch(function(error) {

                    });
            },
            memberMsg: function() {
                router.push("/memberInfo");
            },
            addMore: function() {
                var _self = this;
                var url = "/goods/getIndexSpecialGoods.do?shopCode=" + store.get('position') + "&currentPage=" + _self.pageNum;
                if (_self.isReload & _self.pageNum > 1) {
                    axios.get(url)
                        .then(function(response) {
                            _self.isShow = false;
                            var linshiArr = new Array();
                            linshiArr = response.data.result;
                            for (var i = 0; i < linshiArr.length; i++) {
                                _self.goodsList.push(linshiArr[i]);
                            }
                            if (linshiArr.length == 5) {
                                _self.pageNum += 1;
                            } else {
                                _self.isReload = false;
                                _self.isShow = false;
                            }
                        })
                        .catch(function(error) {

                        });
                }
            }

        }
    }
</script>
<style lang="scss" >
    @import "../../static/css/index.scss";
</style>
