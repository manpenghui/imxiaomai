<template lang="html">
  <div id="orderPage">
    <ul id="tabs">
      <li   v-bind:class="{ 'tab_active':tab1Active }" v-on:click="tabSwitch('tab1Active')">全部</li>
      <li v-bind:class="{ 'tab_active':tab2Active }" v-on:click="tabSwitch('tab2Active')">待付款</li>
      <li v-bind:class="{ 'tab_active':tab3Active }" v-on:click="tabSwitch('tab3Active')">已完成</li>
    </ul>
    <div id="tab_con">

      <div  v-bind:class="{ 'tab_con_active':tab1Active}">
        <ul class="orders">
          <li class="orderItem"  v-for="(order,index) in allOrders">
            <p class="orderNum"><span>订单编号：</span><span class="num">{{order.orderCode}}</span></p>
            <router-link v-bind:to=" '/orderDetail/'+order.orderCode" class="orderDetail">
                  <img v-for="(picPath,index) in order.goodsList.slice(0,3)" :src="picPath.imagePath ? picPath.imagePath :defaultImg " >
                   <img style="width: 36px;height: 8px;border: 0" v-if="order.goodsList.length>3" src="../../static/images/icon_omit.png"alt="">
           </router-link>
          <section class="orderStatus">
            <section class="unPay"  v-if="order.status==0">待付:<span class="money">￥{{order.nowPrice}}</span></section>
              <section class="unPay" v-else>实付:<span class="money">￥{{order.nowPrice}}</span></section>
            <section class="total">共计<span class="mount">{{order.num}}</span>件商品</section>
            <router-link v-bind:to=" '/pay/'+order.orderCode" class="goPay" v-if="order.status==0">待付款</router-link>
            <section v-else  class="goPay success">已完成</section>
          </section>
          </li>
            <div  v-if="allOrders==null  " class="tips"><img src="../../static/images/icon_noData.png" alt=""></div>
        </ul>
      </div>

      
      <div  v-bind:class="{ 'tab_con_active':tab2Active}">
        <ul class="orders">
          <li class="orderItem" v-for="(order,index) in preOrders">
            <p class="orderNum"><span>订单编号：</span><span class="num">{{order.orderCode}}</span></p>
            <router-link  v-bind:to=" '/orderDetail/'+order.orderCode" class="orderDetail">
                  <img v-for="(picPath,index) in order.goodsList.slice(0,3)" :src="picPath.imagePath ? picPath.imagePath :defaultImg " >
                     <img   style="width: 36px;height: 8px;border: 0"  v-if="order.goodsList.length>3" src="../../static/images/icon_omit.png"alt="">
           </router-link>
          <section class="orderStatus">
            <section class="unPay">待付:<span class="money">￥{{order.nowPrice}}</span></section>
            <section class="total">共计<span class="mount">{{order.num}}</span>件商品</section>
            <router-link v-bind:to=" '/pay/'+order.orderCode" class="goPay">待付款</router-link>
          </section>
          </li>
            <div  v-if="preOrders==null  " class="tips"><img src="../../static/images/icon_noData.png" alt=""></div>
        </ul>
      </div>



      <div  v-bind:class="{ 'tab_con_active':tab3Active}">
        <ul class="orders">
          <li class="orderItem" v-for="(order,index) in edOrdrs">
            <p class="orderNum"><span>订单编号：</span><span class="num">{{order.orderCode}}</span></p>
            <router-link  v-bind:to=" '/orderDetail/'+order.orderCode" class="orderDetail">
                  <img v-for="(picPath,index) in order.goodsList.slice(0,3)" :src="picPath.imagePath ? picPath.imagePath : defaultImg " >
                  <!--<img :src="picPath.imagePath ? picPath.imagePath : '../../static/images/1.jpg ' " >-->
                  <img   style="width: 36px;height: 8px;border: 0"  v-if="order.goodsList.length>3"  src="../../static/images/icon_omit.png"alt="">
           </router-link>
          <section class="orderStatus">
            <section class="unPay">实付:<span class="money">￥{{order.nowPrice}}</span></section>
            <section class="total">共计<span class="mount">{{order.num}}</span>件商品</section>
            <section  class="goPay success">已完成</section>
          </section>
          
          </li>
          <div  v-if="edOrdrs==null  " class="tips"><img src="../../static/images/icon_noData.png" alt=""></div>
        </ul>
        
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
                tab1Active: true,
                tab2Active: false,
                tab3Active: false,
                allOrders: [],
                preOrders: [],
                edOrdrs: [],
                isTab1: false, //防止多次请求，请求完成一次后，将isTab1设置为true
                isTab2: false,
                isTab3: false,
                // baseUrl: "/html5/static/images/",
                baseUrl: "../../static/images/",
                allCartItemsLength: "",
                preCartItemsLength: "",
                edCartItemsLength: "",
                defaultImg: "/static/images/xiaomai.jpg"


            }
        },
        created: function() {
            moveAction()

            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });
            // var activeType = this.$route.params.activeType;
            // console.log(activeType);
            // this.tabSwitch(activeType);

        },
        mounted: function() {
            var activeType = this.$route.params.activeType;
            // console.log(activeType);
            this.tabSwitch(activeType);
        },
        methods: {
            tabSwitch: function(tab) {
                // console.log(this.$route)
                // this.$route.push()

                // this.$route.params.activeType = tab;
                if (tab == "tab1Active") {
                    this.tab1Active = true;
                    this.tab2Active = false;
                    this.tab3Active = false;

                    this.getOrders("ALL");

                }
                if (tab == "tab2Active") {
                    this.tab1Active = false;
                    this.tab2Active = true;
                    this.tab3Active = false;

                    this.getOrders("PRE");

                }
                if (tab == "tab3Active") {
                    this.tab1Active = false;
                    this.tab2Active = false;
                    this.tab3Active = true;

                    this.getOrders("ED");

                }
                // this.$router.go({
                //     name: this.$route.name,
                //     params: {
                //         activeType: tab
                //     }
                // });
            },
            getOrders: function(orderType) {
                var _this = this;
                //判断是否进行过请求
                if (this.isTab1 && this.isTab2 && this.isTab3) {
                    return;
                }
                this.$store.commit('isLoading', true)
                axios.get('/order/getGoodsOrder.do', {
                        params: {
                            status: orderType
                        }
                    })
                    .then(function(response) {
                        // console.log(response);
                        // console.log(orderType);

                        if (orderType == "ALL") {
                            //将请求状态设置为已请求过
                            _this.isTab1 = true
                            _this.allOrders = response.data.obj;
                            // _this.allCartItemsLength=response.data.
                        }
                        if (orderType == "PRE") {
                            _this.isTab2 = true
                            _this.preOrders = response.data.obj;
                        }
                        if (orderType == "ED") {
                            _this.isTab3 = true
                            _this.edOrdrs = response.data.obj;
                            // console.log(_this.edOrdrs)
                        }
                        // location.reload()
                        // var isReload = store.get("orderReload");
                        // if (!isReload) {
                        //     store.set("orderReload", true);
                        //     location.reload()
                        // }
                        _this.$store.commit('isLoading', false)

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
    @import "../../static/css/orders.scss";
</style>