<template lang="html">
  <!--盒子登陆页面-->
  <div id="unmannedLoginPage">
  
  		<div class="content">
  			<!--<mt-swipe :auto="2000" :prevent="false" :stopPropagation="false">
                <mt-swipe-item> <img v-on:load="complete($event)" src="/static/images/unmannedPic1.png"/> </mt-swipe-item>
                <mt-swipe-item>  <img src="/static/images/unmannedPic2.png"/></mt-swipe-item>
                <mt-swipe-item>  <img src="/static/images/unmannedPic3.png"/></mt-swipe-item>
            </mt-swipe>-->
            <carousel :indicators="true" :auto="2000" :responsive="107" :delta="500">
                <div v-for="(item ,index) in imgData ">
                     <img class="carouselImg" :src="item"  />
                </div>
               
                
            </carousel>
  			<form>
  				<table border="0" width="100%" cellpadding="0" cellspacing="0">
  					<tr>
                        <td class="hasMargin">手机号码</td>
                         <td>
                          <input v-model="phoneNumber" class="numInput" type="tel" placeholder="请输入11位手机号码"  />
                        </td>
                    </tr>
  					<tr>
                          <td class="hasMargin">验 证 码</td>
                          <td class="send">
                              <input v-model="vaildCode" class="vaildInpit" type="text"  v-on:input="activeLogin()"/><span class="sendMsg" v-on:click="isClick && sendMsg()" v-bind:class="{'sendMsgOff':isSend}" >{{text}}</span>
                            </td>
                    </tr>
                     <!--<tr><td class="tips"  colspan="3">验证手机号领取3元现金</td></tr>-->
                    <!--<tr><td class="loginTd"  colspan="3"><div class="login" v-on:click="toLogin()" v-bind:class="{ 'loginOn':login }">
  				登  &nbsp;&nbsp;&nbsp;&nbsp;录</div></td>-->
                     </tr>
  				</table>
  			</form>
              <p class="reward">验证手机号领取3元现金</p>
  			<div class="login" v-on:click="toLogin()" v-bind:class="{ 'loginOn':login }">
  				登  &nbsp;&nbsp;&nbsp;&nbsp;录</div>

  		</div>
  
  </div>

</template>

<script>
    import axios from 'axios'
    import Carousel from 'vue-m-carousel'
    import router from '../router/router'


    export default {
        components:{
            Carousel
        },
        data: function() {
            return {
                isSend: false, //是否发送了手机号获取验证码
                login: false,
                phoneNumber: "", //手机号
                vaildCode: "", //验证码
                countdown: 60,
                text: "获取验证码",
                isPhoneNumberValid: false, //手机号码是否可用
                isClick: true,
                imgData:[
                    "static/images/unmannedPic1.png",
                   "static/images/unmannedPic2.png",
                   "static/images/unmannedPic3.png"
                ]
             
            }
        },
        created: function() {
            moveAction();
           

        },
        mounted: function() {
              this.deviceType();   
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });
           $('#loginPage').height($(window).height());
           $(".carousel-dot").text("")
            
          
           
        },
        methods: {
            //登录
            toLogin: function() {
                //   router.push("/unmannedUpload");
                //                 return;
                var _this = this;
                var userInfo = store.get('user');
                // console.log("user", userInfo)
                // console.log(userInfo.openid, _this.phoneNumber, _this.vaildCode);

                function removeAllSpace(str) {
                    return str.replace(/\s+/g, "");
                }
                if (_this.phoneNumber == "") {

                    this.$store.commit('changeIndexConf', {
                        isToast: true,
                        toastTip: "手机号码格式不正确！！"
                    });
                    setTimeout(function() {
                        this.$store.commit('changeIndexConf',   {                    
                            isToast: false,
                             toastTip:   ""                
                        });
                    }.bind(this), 800)

                    return;
                }

                if (_this.vaildCode == "") {
                    // alert("验证码不能为空！")
                    this.$store.commit('changeIndexConf', {
                        isToast: true,
                        toastTip: "验证码不能为空！"
                    });
                    setTimeout(function() {
                        this.$store.commit('changeIndexConf',   {                    
                            isToast: false,
                             toastTip:   ""                
                        });
                    }.bind(this), 800)

                    return;
                }

                if (this.login) {
                    axios.get('/login.do', {
                            params: {
                                openId: userInfo,
                                mobile: _this.phoneNumber,
                                vc: removeAllSpace(_this.vaildCode),
                                shopCode: store.get("position")
                            }
                        })
                        .then(function(response) {
                            // console.log("login", response);
                            if (response.data.code == 200) {
                                router.push("/unmannedUpload")
                                return;
                            }
                            if (response.data.code == 500) {
                                // alert("服务器繁忙，请稍后重试！")
                                _this.$store.commit('changeIndexConf', {
                                    isToast: true,
                                    toastTip: response.data.des
                                });
                                setTimeout(function() {
                                    _this.$store.commit('changeIndexConf',   {                    
                                        isToast: false,
                                         toastTip:   ""                
                                    });
                                }.bind(_this), 800)
                                return;
                            }
                            if (response.data.code == 400) {
                                // alert("验证码错误，请重新输入！")
                                _this.$store.commit('changeIndexConf', {
                                    isToast: true,
                                    toastTip: response.data.des
                                });
                                setTimeout(function() {
                                    _this.$store.commit('changeIndexConf',   {                    
                                        isToast: false,
                                         toastTip:   ""                
                                    });
                                }.bind(_this), 800)
                                return;
                            }else{
                                  _this.$store.commit('changeIndexConf', {
                                    isToast: true,
                                    toastTip: response.data.des
                                });
                                setTimeout(function() {
                                    _this.$store.commit('changeIndexConf',   {                    
                                        isToast: false,
                                         toastTip:   ""                
                                    });
                                }.bind(_this), 800)
                                return;
                            }
                        })
                        .catch(function(error) {
                            // console.log(error);
                        });
                }
            },
            //获取验证码
            acquireCode: function() {
                var _this = this;
                // console.log(111)
                axios.get('/verify/code.do', {
                        params: {
                            mobile: _this.phoneNumber
                        }
                    })
                    .then(function(response) {
                        // console.log(response);
                        _this.isPhoneNumberValid = true;

                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            },
            sendMsg: function() {
                var myreg = /^1[0-9]{10}$/;
                var _this = this;
                var t = null;
                if (myreg.test(this.phoneNumber)) {
                    clearInterval(t)
                    t = setInterval(function() {
                        if (_this.countdown > 0) {
                            _this.countdown--;
                            _this.isSend = true;
                            _this.text = "重新获取" + (_this.countdown) + "s";
                            _this.isClick = false;
                            // console.log(_this.$data)
                            // _this.$off("click", function() {
                            //     console.log("已经移除click事件")
                            // })

                        } else {
                            _this.isClick = true;
                            _this.countdown = 60;
                            _this.isSend = false;
                            _this.text = "获取验证码";
                            clearInterval(t)
                            return;
                        }
                    }, 1000);
                    //此处进行ajax请求 ，在请求中 this.isPhoneNumberValid标记为true ，
                    //当isPhoneNumberValid为true时，在activeLogin登录按钮变为黄色
                    if (!_this.isSend) {
                        _this.acquireCode()
                    }
                } else {
                    // alert("手机号码格式不正确");
                    this.$store.commit('changeIndexConf', {
                        isToast: true,
                        toastTip: "手机号码格式不正确！"
                    });
                    setTimeout(function() {
                        this.$store.commit('changeIndexConf',   {                    
                            isToast: false,
                             toastTip:   ""                
                        });
                    }.bind(this), 800)
                }
            },
            activeLogin: function() {
                if (this.isPhoneNumberValid) {
                    this.login = true
                }
            },
            deviceType:function(){
              var u = navigator.userAgent, app = navigator.appVersion;
              this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
              this.isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
            },
            complete:function(e){
                var targetHeight=$(e.currentTarget).height()
                // console.log(targetHeight);
               
                $(".mint-swipe-item").height(targetHeight);
                $(".mint-swipe-items-wrap").height(targetHeight);
                $(".mint-swipe").height(targetHeight);
            }
        },
        computed: {

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/unmannedLogin.scss";
</style>