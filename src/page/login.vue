<template lang="html">
  <!--登陆页面-->
  <div id="loginPage">
  	<div class="scroller">
  		<div class="content">
  			<img class="avatorImg" src="/static/images/login_send.png"/>
  			<form action="" method="post">
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
  				</table>
  			</form>

  			<div class="login" v-on:click="toLogin()" v-bind:class="{ 'loginOn':login }">
  				登  &nbsp;&nbsp;&nbsp;&nbsp;录
  			</div>

  		</div>
  	</div>
  </div>

</template>

<script>
    import axios from 'axios'
    import router from '../router/router'

    export default {
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
            
            }
        },
        created: function() {
            moveAction()

        },
        mounted: function() {

            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });
            $('#loginPage').height($(window).height());
        },
        methods: {
            //登录
            toLogin: function() {
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
                                router.push("/first")
                                return;
                            }
                            // if (response.data.code == 500) {
                            //     // alert("服务器繁忙，请稍后重试！")
                            //     _this.$store.commit('changeIndexConf', {
                            //         isToast: true,
                            //         toastTip: response.data.des
                            //     });
                            //     setTimeout(function() {
                            //         _this.$store.commit('changeIndexConf',   {                    
                            //             isToast: false,
                            //              toastTip:   ""                
                            //         });
                            //     }.bind(_this), 800)
                            //     return;
                            // }
                            // if (response.data.code == 400) {
                            //     // alert("验证码错误，请重新输入！")
                            //     _this.$store.commit('changeIndexConf', {
                            //         isToast: true,
                            //         toastTip: response.data.des
                            //     });
                            //     setTimeout(function() {
                            //         _this.$store.commit('changeIndexConf',   {                    
                            //             isToast: false,
                            //              toastTip:   ""                
                            //         });
                            //     }.bind(_this), 800)
                            //     return;
                            // }
                            else{
                             
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
            }
        },
        computed: {

        }
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/login.scss";
</style>