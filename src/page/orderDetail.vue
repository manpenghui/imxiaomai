<template lang="html">
<ul class="orderDetailPage">
    <li class="item" v-for="(item,index) in orderDetail.goodsList">
        <img :src="item.imagePath? item.imagePath :defaultImg " alt="">
        <section class="right">
            <p class="title">{{item.goodsName}}</p>
            <div class="right_spec">
                <span class="mount">￥{{item.price}} * {{item.num}}</span>
                <span class="price">￥{{(item.price*item.num).toFixed(2)}}</span>
            </div>

        </section>
    </li>
</ul>
</template>

<script>
    import axios from 'axios'
    import router from '../router/router'

    export default {
        data() {
            return {
                orderDetail: "",
                // baseUrl: "/html5/static/images/",
                baseUrl: "../../static/images/",
                defaultImg: "/static/images/xiaomai.jpg"
            }
        },
        created() {
            //  this.expierVal = this.$route.params.id;
            moveAction()
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });
            var orderCode = this.$route.params.orderCode;
            // console.log(orderCode)
            this.getOrder(orderCode)
        },
        mounted() {
            $(".com-app").css("background","#f6f6f6")
        },
        methods: {
            getOrder: function(orderCode) {
                var _this = this;
                axios.get('/order/getOrderByOrderCode.do', {
                        params: {
                            orderCode: orderCode
                        }
                    })
                    .then(function(response) {
                        // console.log(response);
                        _this.orderDetail = response.data.obj;
                        // console.log("orderDetail", _this.orderDetail)
                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            }
        }



    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/orderDetail.scss"
</style>