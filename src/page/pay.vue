<template lang="html">
<div class="pay">
    <ul class="pay_methods">
        <li class="item"  v-on:click="selectWechat()">
            <div class="left">
                <img src="../../static/images/icon_wechat.png" alt="">
                <div class="method">
                    <p>微信支付</p>
                    <p>无优惠</p>
                </div>
            </div>
            <div class="right" >
                <img   v-if="isWechat" src="../../static/images/pay_select.png"/>
                <img   v-else src="../../static/images/pay_unselect.png"/>
            </div>
        </li>
        <li class="item" v-on:click="selectAliPay()" style="display: none">
            <!--<span class="lineThrough"></span>-->
            <div class="left">
                <img src="../../static/images/icon_zhifu.png" alt="">
                <div class="method">
                    <p>支付宝支付</p>
                    <p>无优惠</p>
                </div>
            </div>
            <div class="right">
                <img   v-if="isAliPay" src="../../static/images/pay_select.png"/>
                <img  v-else src="../../static/images/pay_unselect.png"/>
            </div>
        </li>
        <li class="item"  v-on:click="selectBalance()">
            <div class="left">
                <img src="../../static/images/pay_balance.png" alt="">
                <div class="method balance">
                    <div>余额剩余：<span class="red">{{balance}}元</span></div>
                    <!--<p>金牌会员9.5折</p>-->
                </div>
            </div>
            <div class="right">
                <img   v-if="isBanance" src="../../static/images/pay_select.png"/>
                <img v-else src="../../static/images/pay_unselect.png"/>
            </div>
        </li>
    </ul>
    <div class="order">
        <p class="title">共计{{cartInfo.num}}件商品</p>
        <div class="detail">
            <img class="detailImg"  v-for="(item,index) in cartItems " v-if="item.imagePath==null" src="/static/images/xiaomai.jpg" alt="">
             <img class="detailImg"  v-for="(item,index) in cartItems " v-if="item.imagePath!=null" :src="item.imagePath" alt="">
            <img v-if="cartItemsLength>=3" src="../../static/images/icon_omit.png"alt="">
        </div>
        <div class="price">
            <span class="original_cost">原价：{{cartInfo.originalPrice}}元</span>
            <span class="benefit">优惠：{{cartInfo.discountPrice?cartInfo.discountPrice:cartInfo.savingPrice}}元</span>
            <span class="total">总计：<span class="red">{{cartInfo.nowPrice}}元</span></span>
        </div>
    </div>
    <div class="account">
        <span class="account_benefit">已优惠{{cartInfo.discountPrice?cartInfo.discountPrice:cartInfo.savingPrice}}元</span>
        <span class="toPay" v-on:click="toPay">确认</span>
        <span class="leave">还需要支付<span>{{cartInfo.nowPrice}}元</span></span>
       
    </div>

    
</div>
</template>

<script>
    import axios from 'axios'
    import router from '../router/router'

    export default {
        data: function() {
            return {
                isWechat: true, //微信支付
                isAliPay: false, //支付宝支付,暂不支持，所以将状态值设置为flase
                isBanance: false, //余额支付
                balance: "",
                cartInfo: {}, //商品信息
                cartItems: [], //商品列表
                cartItemsLength: "", //商品种类
                orderCode: "", //订单编号
            }
        },
        created: function() {
            moveAction()
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });

            //显示加载栏
            this.$store.commit('isLoading', true);
            this.getBalance()

            this.orderCode = this.$route.params.orderCode ? this.$route.params.orderCode : '21XM000113170220152323';

            //console.log("orderCode", this.orderCode)

            var shopCode = store.get('position');
            shopCode ? shopCode : "XM0001";
            //console.log('shopCode', shopCode);

            if (this.$route.params.orderCode == "shopMarket") {
                this.getListByShopMarket();
                this.orderCode = "";
            } else {
                this.orderCode = this.$route.params.orderCode;
                this.getListBycode();
            }


        },
        methods: {

            selectWechat: function() {
                // console.log(this.isSelect)
                return this.isWechat = !this.isWechat;
            },
            selectAliPay: function() {
                // alert("暂不支持支付宝支付！")
                // return this.isAliPay = !this.isAliPay;
                  
                this.$store.commit('changeIndexConf',   {                    
                    isToast:  true,
                     toastTip:   "暂不支持支付宝支付！"                
                });
                setTimeout(function() {
                    this.$store.commit('changeIndexConf',   {                    
                        isToast: false,
                         toastTip:   ""                
                    });
                }.bind(this), 800)

            },
            selectBalance: function() {
                return this.isBanance = !this.isBanance;
            },
            toCreateOeder: function() {
                var shopCode = store.get('position') ? store.get('position') : "XM0001";

                axios.get('/order/createGoodsOrder.do', {
                        params: {
                            shopCode: shopCode
                        }
                    })
                    .then(function(response) {

                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            },
            getBalance: function() {
                var _this = this;
                axios.get('/member/getBalance.do')
                    .then(function(response) {

                        _this.balance = parseFloat(response.data.balance).toFixed(2);


                        _this.$store.commit('isLoading', false)

                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            },
            getListBycode: function() {
                var _this = this;
                axios.get('/order/getOrderByOrderCode.do', {
                        params: {
                            orderCode: _this.orderCode
                        }
                    })
                    .then(function(response) {

                        // console.log(response);
                        _this.cartInfo = response.data.obj
                            //console.log("cartInfo", _this.cartInfo)
                        _this.cartItemsLength = response.data.obj.goodsList.length;
                        _this.cartItems = response.data.obj.goodsList.splice(0, 3); //如果商品种类过多，只显示3条，其余的用图片（带省略号）的代替
                        //console.log("cartItems", _this.cartItems)
                        //隐藏加载栏

                        _this.$store.commit('isLoading', false);
                    })
                    .catch(function(error) {
                        // console.log(error);
                    });

            },
            getListByShopMarket: function() {
                var _this = this;
                axios.get('/cart/getCart.do?shopCode=' + store.get('position'))
                    .then(function(response) {
                        _this.$store.commit('isLoading', false)

                        _this.cartInfo = response.data.obj;
                        // console.log("cartInfo", _this.cartInfo)
                        _this.cartItemsLength = response.data.obj.cartItems.length;

                        var imgArray = new Array();

                        for (var i = 0; i < response.data.obj.cartItems.length; i++) {
                            var goods = {};
                            goods.imagePath = response.data.obj.cartItems[i].goods.imgUrl
                            imgArray.push(goods);
                        }
                        // console.log("*****");

                        _this.cartItems = imgArray.splice(0, 3); //如果商品种类过多，只显示3条，其余的用图片（带省略号）的代替
                        _this.cartInfo.nowPrice = response.data.obj.promotionPrice;
                        // console.log("cartItems", _this.cartItems)
                        //隐藏加载栏
                        _this.$store.commit('isLoading', false);
                        //_this.getOrderCode();



                    })
                    .catch(function(error) {

                    });

            },
            getOrderCode: function() {
                var _this = this;
                axios.get('/order/createGoodsOrder.do?shopCode=' + store.get('position'))
                    .then(function(response) {
                        _this.orderCode = response.data.obj;
                    })
                    .catch(function(error) {
                        _this.orderCode = "";
                    });

            },

            weixinPay: function(res) {
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
                                router.replace("/mine");

                            } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                                var data = {
                                    "total": 0,
                                    "list": []
                                }
                                router.replace("/orders/tab2Active");

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
            toPay: function() {
                var _this = this;
                var payType = [];
                if (this.isWechat) {
                    payType.push("1");
                }
                if (this.isBanance) {
                    payType.push("4");
                }
                payType = payType.join(",")

                if (payType.length == 0) {
                    // alert("请至少选择一种支付方式")
                    this.$store.commit('changeIndexConf',   {                    
                        isToast:  true,
                         toastTip:   "请至少选择一种支付方式"                
                    });
                    setTimeout(function() {
                        this.$store.commit('changeIndexConf',   {                    
                            isToast: false,
                             toastTip:   ""                
                        });
                    }.bind(this), 800)
                    return;
                }
                this.$store.commit('isLoading', true);
                if (_this.orderCode == "") {
                    axios.get('/order/createGoodsOrder.do?shopCode=' + store.get('position'))
                        .then(function(response) {
                            _this.orderCode = response.data.obj;
                            axios.get('/pay/doPay.do', {
                                    params: {
                                        orderCode: _this.orderCode,
                                        payType: payType //代表选择了微信和账户余额两种方式
                                    }
                                })
                                .then(function(response) {
                                    _this.$store.commit('isLoading', false);

                                    if (response.data.code == 200) {
                                        if (response.data.obj.code == "1") {
                                            _this.weixinPay(response.data.obj);
                                        } else if (response.data.obj.code == "4") {
                                            router.push("/mine")
                                        }
                                        //_this.weixinPay(response.data.obj);
                                    } else if (response.data.code == 400) {
                                        // alert(response.data.obj.msg + "请选择微信支付");
                                        _this.$store.commit('changeIndexConf',   {                    
                                            isToast:  true,
                                             toastTip: response.data.obj.msg            
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
                                    // console.log(error);
                                });
                        })
                        .catch(function(error) {

                        });
                } else {

                    axios.get('/pay/doPay.do', {
                            params: {
                                orderCode: _this.orderCode,
                                payType: payType //代表选择了微信和账户余额两种方式
                            }
                        })
                        .then(function(response) {
                            _this.$store.commit('isLoading', false);

                            if (response.data.code == 200) {
                                if (response.data.obj.code == "1") {
                                    _this.weixinPay(response.data.obj);
                                } else if (response.data.obj.code == "4") {
                                    router.push("/orders/tab3Active")
                                }
                                //_this.weixinPay(response.data.obj);
                            } else if (response.data.code == 400) {
                                // alert(response.data.obj.msg + "请选择微信支付");
                                _this.$store.commit('changeIndexConf',   {                    
                                    isToast:  true,
                                     toastTip: response.data.obj.msg + "请选择微信支付"                
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
                            // console.log(error);
                        });

                }

                // window.location.href="/html5/pay.html?orderCode="+_this.orderCode+"&payType="+payType;



            }
        },
        computed: {

        },

    }
</script>
<style lang="scss" scoped>
    @import "../../static/css/pay.scss";
</style>