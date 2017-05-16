<!--充值中心-->
<template lang="html">
<div class="rechargeCenter">
 
        
   
    <div class="header">
        <img src="../../static/images/balance_icon.png" alt="">
        我的余额：<span class="money">{{userBalance}}元</span>
    </div>
    <ul class="types">
        <li class="item" v-for="(item,index) in rechargeArray" v-cloak  v-on:click="tabSwitch($event)" :data-money="item.rechargeAmount"    :data-donate="item.presentAmount" >
            <p>{{item.rechargeAmount}}元</p>
             <p>赠{{item.presentAmount}}元</p>
        </li>
    </ul>
    <div class="selfChoice">
        <div class="inputWrap">
            <input type="number" placeholder="请输入充值金额（元）" v-on:blur="checkRechargeMoney"   v-model="rechargeMoney" v-on:input="recharge">
        </div>
        
        <p class="tip" v-show="isTip">{{tipText}}</p>
    </div>
    <div class="pay">
        <p class="title">充值方式</p>
        <section class="action">
            <span>
            <img src="../../static/images/icon_wechat.png" alt="">
            微信支付
            </span>
            <img :src="[isWechatPay ? baseUrl+'pay_select.png' : baseUrl+'pay_unselect.png']"  v-on:click="WechatPay">
        </section>
    </div>
    <div class="invoiceInfo">
            <img :src="[isInvoice ? baseUrl+'invoice_select.png' : baseUrl+'invoice_unselect.png']"  v-on:click="invoiceSelect">
            <span>发票信息</span>
            <a v-on:click="toInvoiceInfo">
                <img src="../../static/images/invoice_express.png">
            </a>
    </div>
    <div class="toCharge" v-on:click=" toRecharge">
        我要充值
    </div>
    <div class="toast" v-show="isToastShow" v-on:click="toastClick">
       <div class="toastTip">
            {{toastTip}}
       </div>
    </div>
 
</div>

</template>


<script>
    import axios from 'axios'
    import router from "../router/router"

    export default {
        data: function() {
            return {
                userBalance: "",
                isWechatPay: true, //是否选择了微信支付
                isInvoice: false, //是否需要开发票
                rechargeMoney: "", //选择的充值金额
                isTip: true, //是否显示手动输入金额的赠送提示
                tipText: "", //金额的赠送额度或者手动输入金额的错误提示
                baseUrl: "/static/images/",
                //baseUrl: "../../static/images/",
                rechargeArray: [], //充值列表
                toastTip: "",
                isToastShow: false,
                isOrder: true
            }
        },
        created: function() {
            if (store.get('userInfo') == "") {
                router.replace("/login");
            } else {
                moveAction()

                this.$store.commit('isLoading', true)
                this.$store.commit('changeIndexConf', {
                    isFooter: false,
                    isToast: false,
                });
                this.getBalance()
                var info = this.$store.state.comm.rechargeCenter;
                this.rechargeMoney = info.rechargeMoney;
                this.isInvoice = info.isInvoice;
                this.isTip = info.isTip;
                this.tipText = info.tipText;
                var _this = this;
                axios.get('/recharge/getRechargePromotionList.do')
                    .then(function(response) {
                        // console.log("response", response);
                        _this.rechargeArray = response.data.obj;
                        // console.log("rechargeArray", _this.rechargeArray)



                        _this.$store.commit('isLoading', false)
                    })
                    .catch(function(error) {
                        // console.log(error);
                    });

            }
        },
        mounted: function() {
            if (store.get('userInfo') == "") {
                router.push("/login");
            } else {
                this.isSelect();
            }
        },
        methods: {
            //判断手动输入的金额是否与列表中保持了一致
            isSelect: function() {
                var items = document.getElementsByClassName("types")[0].getElementsByClassName("item");
                for (var i = 0; i < items.length; i++) {
                    var dataMoney = items[i].getAttribute('data-money');
                    // items[i].classList.remove('type_active');
                    if (dataMoney == this.rechargeMoney) {
                        items[i].classList.add("type_active");
                    } else {
                        items[i].classList.remove('type_active');
                    }
                };

            },
            tabSwitch: function(e) {
                // console.log(e.currentTarget)
                //手动点击充值金额时增加class:type_active高亮显示
                var target = e.currentTarget;
                var items = document.getElementsByClassName("types")[0].getElementsByClassName("item");
                // console.log(items)
                //获取充值金额和赠送金额
                var rechargeMoneys = target.getAttribute('data-money');
                var donateMoneys = target.getAttribute('data-donate');
                // console.log("rechargeMoneys", rechargeMoneys);
                // console.log("donateMoneys", donateMoneys);

                for (var i = 0; i < items.length; i++) {
                    items[i].classList.remove('type_active');
                }
                target.classList.add("type_active");
                this.isTip = true;
                this.rechargeMoney = rechargeMoneys;
                this.tipText = "赠送" + donateMoneys + "元";
            },
            WechatPay: function() {
                this.isWechatPay = !this.isWechatPay
            },
            invoiceSelect: function() {
                this.isInvoice = !this.isInvoice

            },
            recharge: function() {
                //去除充值列表的所有高亮显示
                var items = document.getElementsByClassName("types")[0].getElementsByClassName("item");
                for (var i = 0; i < items.length; i++) {
                    items[i].classList.remove('type_active');
                }
                var reg = /^(0|([1-9]\d*))$/;
                // var reg = /^([1-9]\d*)$/;
                var flag = reg.test(this.rechargeMoney);
                // console.log(flag);
                if (this.rechargeMoney <= 0 || !flag) {
                    this.isTip = true;
                    this.tipText = "请输入正确的金额（大于零的正整数）";
                    return;
                }
                var _this = this;
                if (flag && parseInt(this.rechargeMoney) > 0) {
                    axios.get('/recharge/getRechargePromotion.do', {
                            params: {
                                rechargeAmount: _this.rechargeMoney
                            }
                        })
                        .then(function(response) {
                            // console.log(response);
                            _this.tipText = "赠送" + response.data.obj.presentAmount + "元";

                            _this.isTip = true;
                        })
                        .catch(function(error) {
                            // console.log(error);
                        });
                }

                // if (flag || this.rechargeMoney == "") {
                //     this.isTip = false;
                // } else {
                //     this.isTip = true;
                //     this.tipText = "请输入正确的金额（大于零的正整数）";
                // }

            },
            checkRechargeMoney: function() {},
            toInvoiceInfo: function() {
                if (this.isInvoice) {
                    this.$store.commit('saveRechargeCenter', {
                        rechargeMoney: this.rechargeMoney,
                        isInvoice: this.isInvoice,
                        isTip: this.isTip,
                        tipText: this.tipText
                    });
                    router.push("/invoiceInfo")
                } else {
                    this.toastTip = "请先在发票信息前打✔噢！！"
                    this.isToastShow = true;
                    // alert("请先在发票信息前打✔噢！！")
                    setTimeout(function() {
                        this.isToastShow = false;
                    }.bind(this), 800)
                }

            },
            toRecharge: function() {
                //先判断如果选择了要发票，判断发票信息不能为空
                if (this.rechargeMoney <= 0) {
                    this.toastTip = "充值额度必须是大于零的正整数！"
                    this.isToastShow = true;
                    // alert("充值额度必须是大于零的正整数！");
                    setTimeout(function() {
                        this.isToastShow = false;
                    }.bind(this), 800)
                    return;
                }
                //判断是否勾选了支付方式
                if (!this.isWechatPay) {
                    this.toastTip = "请选择支付方式"
                    this.isToastShow = true;
                    setTimeout(function() {
                        this.isToastShow = false;
                    }.bind(this), 800)

                    // alert("请选择支付方式");
                    return;
                }
                if (this.isInvoice) {

                    var info = this.$store.state.comm.invoiceInfo;
                    // console.log(info);
                    if (info.invoiceTitle == "" || info.invoiceContent == "" || info.invoiceContact == "" || info.invoicePhone == "") {
                        this.toastTip = "请将发票信息填写完整"
                        this.isToastShow = true;
                        setTimeout(function() {
                                this.isToastShow = false;
                            }.bind(this), 800)
                            // alert("请将发票信息填写完整");
                        return;
                    } else {
                        //调用支付接口
                        this.axiosGetRechargeAmount(info);



                    }

                } else { //未勾选发票信息
                    //调用支付接口
                    this.axiosGetRechargeAmount()




                }
            },
            axiosGetRechargeAmount: function(info) {

                this.$store.commit('isLoading', true)
                this.isOrder = false;
                var shopCode = store.get('position');
                // shopCode ? shopCode : "XM0001";
                // console.log('shopCode', shopCode)
                var _this = this;
                var info = info || ""

                axios.get('/order/createRechargeOrder.do', {
                        params: {
                            rechargeAmount: parseFloat(_this.rechargeMoney),
                            payType: 1,
                            contentTitle: info.invoiceTitle || "", //发票头
                            invoiceContent: info.invoiceContent || "", //发票内容
                            storeCode: shopCode, //领取发票便利店编号
                            contactPhone: info.invoicePhone || '', //联系人电话
                            contact: info.invoiceContact || "", //联系人
                            shopCode: shopCode//便利店编号
                        }
                    })
                    .then(function(response) {
                        console.log(response);
                        _this.isOrder = true;
                        //充值成功
                        if (response.data.code == 200) {
                            //在此调用微信的支付接口
                            _this.weixinPay(response.data.obj)
                        } else {
                            _this.$store.commit('isLoading', false)
                            _this.toastTip = response.data.obj.msg;
                            _this.isToastShow = true;
                            setTimeout(function() {
                                _this.isToastShow = false;
                            }.bind(_this), 800)

                        }

                    })
                    .catch(function(error) {
                        _this.isOrder = true;
                        // console.log(error);
                    });

            },
            toastClick: function() {
                this.isToastShow = false;
            },
            weixinPay: function(res) {
                var _this = this;

                function onBridgeReady() {
                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": res.appid, //公众号名称，由商户传入     
                            "timeStamp": res.timeStamp, //时间戳，自1970年以来的秒数     
                            "nonceStr": res.nonceStr, //随机串     
                            "package": res.prepay_id,
                            "signType": res.signType, //微信签名方式：     
                            "paySign": res.paySign //微信签名 
                        },
                        function(res) {
                            //
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                var data = {
                                    "total": 0,
                                    "list": []
                                }
                                router.replace("/balance");
                                _this.$store.commit('isLoading', false)

                            } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                var data = {
                                        "total": 0,
                                        "list": []
                                    }
                                    // router.replace("/balance");
                                _this.$store.commit('isLoading', false)

                            }
                        }
                    );
                }
                if (typeof WeixinJSBridge == "undefined") {
                    if (document.addEventListener) {
                        document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                    } else if (document.attachEvent) {
                        document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                        document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                    }
                } else {
                    onBridgeReady();
                }
            },
            getBalance: function() {
                var _this = this;
                axios.get('/member/getBalance.do')
                    .then(function(response) {
                        // console.log(response);
                        _this.userBalance = response.data.balance;
                        // _this.$store.commit('isLoading', false)

                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            }

        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/rechargeCenter.scss";
</style>