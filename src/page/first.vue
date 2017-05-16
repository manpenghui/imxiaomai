<template>
  <div id="page">
    <img src="/static/images/logo.png">
    <img class="animation_style" src="/static/images/loading.png">
    <div>定位中,请稍后...</div>
  </div>	

</template>
<script>
    import axios from 'axios'
    import router from '../router/router'
    export default {
        data: function() {
            return {
                "loading":false,
                "userinfo":false,
                "banner":false
            }
        },
        beforeCreate() {
             
        },
        created: function() {

            this.$store.commit('changeIndexConf', {
                isFooter: false
            });
            // store.clear();
             function getUrlValue() {
                var qs = (location.search.length > 0 ? location.search.substring(1) : ""),
                    args = {},
                    items = qs.length ? qs.split("&") : [],
                    item = null,
                    name = null,
                    value = null,
                    i = 0,
                    len = items.length;
                for (i = 0; i < len; i++) {
                    item = items[i].split("=");
                    name = decodeURIComponent(item[0]);
                    value = decodeURIComponent(item[1]);
                    if (name.length) {
                        args[name] = value;
                    }
                }
                return args;
            }
            var arg = getUrlValue();

           if (arg.code!=undefined) {
             store.set("code", arg.code);
             this.getCode();
           }
           // console.log("*****");
           //  console.log(arg);

         
        },
        mounted: function() {
            if(store.get("code")!=null){
               this.getBanner();
               this.getUserInfo();
            }
         

        },
        methods: {
            getCode:function(){
                 var _self = this;
            axios.get("getWxOpenId.do?code=" + store.get('code'))
                .then(function(response) {
                    //console.log(response);
                    if (response.data.code == 200) {
                        store.set("user", response.data.obj);
                        store.set("position", "");
                        store.set("shopName", "");
                        store.set("userInfo", "");
                        store.set("isReload","");
                        store.set("reload",false);
                        window.location.replace("/?#/index");  
                        
                    } else {
                        //o1PbJvu72_xfh1jpfzbttp-vm8bo
                        store.set("position", "XM0001");
                        store.set("shopName", "");
                        store.set("userInfo", "");
                        store.set("user", '{"id":null,"openid":" o1PbJviXkPFg7I5h8rFx9f8Rz8wg","nickname":"系统出错","sex":"1","province":"北京","city":"","country":"中国","headimgurl":"http://wx.qlogo.cn/mmopen/ubn08gu0guaWfOE4aBrsVvykicpNlSs3uwdtD07ll0SDR8JhphQXeicJIfNY4da3SrWAGPtaaMQI9K62wzVTNsEicAXBVCmb7j2/0","privilege":[],"unionid":null}');
                        var bannerArr = [{
                            "id": null,
                            "title": null,
                            "des": null,
                            "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/090695b41d3f31338979ed0ad7103701.jpg",
                            "linkPath": "http://www.163.com/"
                        }, {
                            "id": null,
                            "title": null,
                            "des": null,
                            "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/fd0eeb75643a2ab43c9644d7dbc832c1.jpg",
                            "linkPath": "http://www.jd.com/"
                        }, {
                            "id": null,
                            "title": null,
                            "des": null,
                            "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/535eb5c8439e3e61b93861d201fe1c59.jpg",
                            "linkPath": "http://www.sohu.com/"
                        }];
                        store.set("bannerList", JSON.stringify(bannerArr));

                       // window.location.replace("/#/first");
                    }
                })
                .catch(function(error) {

                });


            },
            getUserInfo:function(){
              var _self = this;
                axios.get("/autoLogin.do?openId=" + store.get('user'))
                    .then(function(response) {
                        if (response.data.code == 200) {

                            store.set("userInfo", JSON.stringify(response.data));
                            // 
                             _self.registered();  
                        } else {
                           _self.registered();  
                        }
                      
                        // window.location.replace("/?#/position");
                    })
                    .catch(function(error) {

                    });
            },
            getBanner: function() {
                var  _self=this;
                var succesFunc = function(res) {
                    if (res.rotationPics == null || res.rotationPics == "null") {
                        var bannerArr = [{
                            "id": null,
                            "title": null,
                            "des": null,
                            "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/090695b41d3f31338979ed0ad7103701.jpg",
                            "linkPath": "http://www.163.com/"
                        }, {
                            "id": null,
                            "title": null,
                            "des": null,
                            "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/fd0eeb75643a2ab43c9644d7dbc832c1.jpg",
                            "linkPath": "http://www.jd.com/"
                        }, {
                            "id": null,
                            "title": null,
                            "des": null,
                            "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/535eb5c8439e3e61b93861d201fe1c59.jpg",
                            "linkPath": "http://www.sohu.com/"
                        }];
                        store.set("bannerList", JSON.stringify(bannerArr));
                    } else {
                        store.set("bannerList", JSON.stringify(res.rotationPics));
                    }
                      
                  
                    //router.replace("/first");
                }
                var errorFunc = function(res) {
                    var bannerArr = [{
                        "id": null,
                        "title": null,
                        "des": null,
                        "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/090695b41d3f31338979ed0ad7103701.jpg",
                        "linkPath": "http://www.163.com/"
                    }, {
                        "id": null,
                        "title": null,
                        "des": null,
                        "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/fd0eeb75643a2ab43c9644d7dbc832c1.jpg",
                        "linkPath": "http://www.jd.com/"
                    }, {
                        "id": null,
                        "title": null,
                        "des": null,
                        "imgPath": "http://upload.imxiaomai.com/gaiaUpload/2017/3/7/535eb5c8439e3e61b93861d201fe1c59.jpg",
                        "linkPath": "http://www.sohu.com/"
                    }];
                    store.set("bannerList", JSON.stringify(bannerArr));
                    
                }
                $.ajax({
                    url: '/content.do',
                    type: "get",
                    dataType: "json",
                    success: succesFunc,
                    error: errorFunc
                });
            },registered: function() {
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
                    // _self.$store.commit('changeIndexConf',   {                    
                    //     isToast:  true,
                    //     toastTip:   "系统出现问题,请暂勿使用,谢谢配合"                
                    // });
                });
                var _self = this;
                wx.ready(function() {
                   _self.positionAction();
                });
            },positionAction:function(){
           
            var _self=this;
              wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
             success: function (res) {
             var latitude = res.latitude==undefined||res.latitude=="undefined"?res.latitude=0:res.latitude; // 纬度，浮点数，范围为90 ~ -90
             var longitude = res.longitude==undefined||res.longitude=="undefined"?res.longitude=0:res.longitude; // 
             var speed = res.speed; // 速度，以米/每秒计
             var accuracy = res.accuracy; // 位置精度
              axios.get('/shop/relateShop.do?longitude='+res.longitude+'&latitudes='+res.latitude)
             .then(function (response) {
             var schoolArr=new Array();
             schoolArr=response.data;
            
             store.set("position",schoolArr[0].shopCode);
            store.set("shopName", schoolArr[0].shopName);
             if (store.get('userInfo')=="") {
                if (schoolArr[0].shopType==1) {
                  router.replace("/unmannedLogin");
                }else{
                 router.replace("/login");
                  
                }
               
              }else{
                 router.replace("/first");
                   // window.location.replace("/?#/first");  
              }
            
            })
           .catch(function (error) {
             // console.log("失败");
            store.set("position","XM0001");
            store.set("shopName", "暂无法购买");
           // window.location.replace("/?#/first"); 
            router.replace("/first");

            });
          }
          });
            },
            turnAction:function(){
              if (this.banner&&this.loading&&this.userinfo) {
                 router.replace("/first");
              }

            }


        }

    }
</script>
<style lang="scss" scoped>
    @import "../../static/css/first.scss";
</style>
