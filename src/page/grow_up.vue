<template lang="html">
<div class="growupPage">
    <div class="header">
        <div class="data">
            成长值：<span class="mount">{{expierVal}}</span>
        </div>
    </div>
    <p class="title">成长值明细</p>
    <ul class="container"> 
       <li class="item" v-for="(item,index) in expireData">
           <div class="left">
               <p>购物花费{{item.orderFee}}元获得成长值{{item.empirical}}</p>
               <p>{{item.createTime | date}}</p>
               
           </div>
           <div class="right">
               <p>+{{item.empirical}}</p>
           </div>
        </li>  
    </ul>
    <div v-if="expireData.length==0  " style="text-align:center">
        <img src="../../static/images/icon_noData.png" alt="">
    </div>

    <div id="footer"    v-bind:class="{ 'hidden':footerHidden}" v-on:click="load">
			<!--<img src="../../static/images/load.png" class="loading"/>-->
			<p class="loadingTips">点击查看更多</p>
		</div>
</div>
</template>

<script>
    import axios from 'axios'
    // import router from '../router/router'


    export default {
        data: function() {
            return {
                footerHidden: false,
                expireData: [],
                currentPage: 1,
                expierVal: "",

            }
        },
        created: function() {
            moveAction()
            this.$store.commit('isLoading', true)
            this.expierVal = this.$route.params.id;
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });
            this.load()
        },
        mounted:function(){
             $(".com-app").css("background","#f6f6f6")

        },
        methods: {

            load: function() {
                var _this = this;
                axios.get('/member/getEmpiricalLog.do', {
                        params: {
                            currentPage: _this.currentPage,
                            pageSize: 10
                        }
                    })
                    .then(function(response) {
                        // console.log(response);
                        if (response.data.result.length == 0) {
                            _this.footerHidden = true;
                        }
                        for (var i = 0; i < response.data.result.length; i++) {
                            _this.expireData.push(response.data.result[i])
                        };
                        // console.log("expireData", _this.expireData);
                        // console.log("expireData", _this.expireData.length);
                        if (_this.currentPage == response.data.totalPage) {
                            _this.footerHidden = true;
                        }
                        _this.currentPage++;
                        _this.$store.commit('isLoading', false)
                    })
                    .catch(function(error) {
                        // console.log(error);
                    });




            },


        },
        computed: {}
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/growup.scss";
</style>