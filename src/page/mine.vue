<template lang="html">
  <div id="minePage">
    <div class="header">
        <router-link to="/mineDetail" class="vip">
            <img class="avatar" :src=' userData.headimgurl'  alt="">
            <img class="level" :src="levelImg" alt="">
            <span class="nickname">{{userData.nickname}}</span>
        </router-link>
        <section class="qrcode">
            <p class="tip">出店请出示此二维码</p>
            <div class="qrcodeImg" id="qrcodeImg">

            </div>
            <!--<p class="account">NO.{{userData.barCode}}</p>-->
        </section>
    </div>
    <div class="orderContainer">
        <!--<router-link to="/orders/tab3Active">已完成</router-link>
            <span>我的订单</span>
            <img src="../../static/images/express.png" alt=""/>
        </router-link>
        <div class="payStatus">
            <router-link to="/orders/tab2Active" class="unpay">待付款</router-link>
            <router-link to="/orders/tab3Active">已完成</router-link>
        </div>-->
          <router-link to="/orders/tab2Active">
            <img src="../../static/images/icon_tobePaid.png" alt="">
            <div>
                <span class="redCircle" v-if="isShowCircle"></span>
                <span class="unpay">待付款</span>
            </div>

          </router-link>
          <router-link to="/orders/tab3Active">
            <img src="../../static/images/icon_endPaid.png" alt="">
            <span>已完成</span>
          </router-link>
          <router-link to="/orders/tab1Active" class="all">
            <div>
                <img src="../../static/images/icon_allPaid.png" alt="">
                <span>全部</span>
            </div>

            <img class="next" src="../../static/images/icon_next.png" alt="">
          </router-link>
    </div>
    <ul class="userDetail">
        <li class="item ">
            <router-link  to="/balance">
                <div class="item-left">
                    <img src="../../static/images/mine_balance.png">
                    <span>余额</span>
                </div>
                <div class="item-right">
                    <span class="first">{{valueData.balance }}元</span>
                    <img src="../../static/images/icon_next.png" alt="">
                </div>
            </router-link>
        </li>
        <li class="item ">
            <router-link  v-bind:to=" '/grow_up/ '+valueData.empirical ">
                <div class="item-left">
                    <img src="../../static/images/grow_up.png">
                    <span>成长值</span>
                </div>
                <div class="item-right">
                    <span class="sec">{{valueData.empirical }}</span>
                    <img src="../../static/images/icon_next.png">
                </div>
            </router-link>
        </li>
        <li class="item ">
            <router-link  to="/mineDetail ">
                <div class="item-left">
                    <img src="../../static/images/icon_face.png">
                    <span>人脸识别</span>
                </div>
                <div class="item-right">
                    <!--<span class="sec">{{valueData.empirical }}</span>-->
                    <img src="../../static/images/icon_next.png">
                </div>
            </router-link>
        </li>
        <!-- <li class="item ">
            <router-link  to="/unmannedUpload ">
                <div class="item-left">
                    <img src="../../static/images/icon_face.png">
                    <span>新版图片上传</span>
                </div>
                <div class="item-right">
                    <img src="../../static/images/icon_next.png">
                </div>
            </router-link>
        </li>-->

          

    </ul>

<div style="width:100%;height:50px;background:#f4f4f4;"></div>

  </div>
</template>
<script>
    import axios from 'axios'
    import { Indicator } from 'mint-ui';
    import router from '../router/router'


    export default {
        data: function() {
            return {
                valueData: "",
                imgUrl: "",
                userData: "",
                levelImg: "",
                isShowCircle: true,
                baseUrl: "/static/images/",
                // baseUrl: "../../static/images/",

            }
        },
        created: function() {
            Indicator.close()
            //判断用户是否登录
            if (store.get('userInfo') == "") {
                router.replace("/login");
            } else {
                moveAction()
                this.getPreOrders()
                var _this = this;
                this.$store.commit('isLoading', true)

                this.$store.commit('changeIndexConf', {
                    isFooter: true,
                    isToast: false,

                });

                //var openId = JSON.parse(store.get("user")).openid
                    //获取用户的级别/二维码等
                var userInfo = JSON.parse(store.get("userInfo"));
                // console.log(userInfo);
                this.userData = userInfo.obj;
                this.vipLevel(userInfo.obj.level);

                axios.get('/member/getBalance.do')
                    .then(function(response) {
                        // console.log(response);
                        _this.valueData = response.data;
                        _this.$store.commit('isLoading', false)
                        store.set("userBalance", response.data.balance.toFixed(2));

                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            }





        },
        mounted: function() {
            $(".com-app").css("background","#f6f6f6")
            // console.log($('#qrcodeImg'));
            if (store.get('userInfo') == "") {
                router.push("/login");
            } else {

                this.$store.commit('isLoading', true);
                this.createQrcode(this.userData.barCode)
            }





        },
        methods: {
            vipLevel: function(level) {
                switch (level) {
                    case "01":
                        this.levelImg = this.baseUrl + "iron_vip.png";
                        break;
                    case "02":
                        this.levelImg = this.baseUrl + "bronze_vip.png";
                        break;
                    case "03":
                        this.levelImg = this.baseUrl + "whiteSliver_vip.png";
                        break;
                    case "04":
                        this.levelImg = this.baseUrl + "gold_vip.png";
                        break;
                    case "05":
                        this.levelImg = this.baseUrl + "platina_vip.png";
                        break;
                    case "06":
                        this.levelImg = this.baseUrl + "diamond_vip.png";
                        break;
                    case "A1":
                        this.levelImg = this.baseUrl + "teach_vip.png";
                        break;
                    case "A2":
                        this.levelImg = this.baseUrl + "extreme_vip.png";
                        break;
                    case "A3":
                        this.levelImg = this.baseUrl + "community_vip.png";
                        break;

                    default:
                        this.levelImg = this.baseUrl + "new_vip.png";
                        break;
                }
                // console.log(this.levelImg)

            },
            createQrcode: function(barcode) {
                jQuery(function() {
                    jQuery('#qrcodeImg').qrcode({
                        render: "canvas",
                        text: barcode,
                        height: 168,
                        width: 168,
                        background: "#ffd01b",
                        foreground: "#000"
                    });
                });

            },
            getPreOrders: function() {
                var _this = this;
                axios.get('/order/getGoodsOrder.do', {
                        params: {
                            status: "PRE"
                        }
                    })
                    .then(function(response) {
                        if (response.data.obj == null || response.data.obj.length == 0) {
                            _this.isShowCircle = false;
                        } else {
                            _this.isShowCircle = true;
                        }
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
    @import "../../static/css/mine.scss";
</style>
