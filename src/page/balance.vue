<template lang="html">
  <div id="balancePage">
    <div class="header">
      <section class="left">
          <span class="font">余额：</span>
          <span class="money">{{balanceVal}}</span>
      </section>
      <section class="right">
          <router-link to="/rechargeCenter"  class="recharge">充值</router-link>
      </section>
    </div>
    <ul id="tabs">
      <li   v-bind:class="{ 'tab_active':tab1Active }" v-on:click="tabSwitch('tab1Active')">收入</li>
      <li   v-bind:class="{ 'tab_active':tab2Active }" v-on:click="tabSwitch('tab2Active')">支出</li>
    </ul>
    <div id="tab_con" >
      <div  id="income"  v-bind:class="{ 'tab_con_active':tab1Active}">
        <ul >
            <li class="item" v-for="(item,index) in incomeData">
                <!--1302充值-->
                <template v-if="item.logType=='1302'">
                    <section class="left leftSpeci">
                        <p class="leftP">充值{{item.payBalance}}元（充{{item.payBalance}}送{{item.give==null?'0': item.give}}元）</p>
                     
                    </section>
                    <section class="right">
                        <p>+{{item.balance }}元  支付成功</p>
                        <p>{{item.createTime | date }}</p>
                    </section>
                </template>
<!--1304存零钱-->
<template v-else-if="item.logType=='1304'">
                    <section class="left leftSpeci">
                        <p class="leftP">充值{{item.payBalance}}元（充{{item.payBalance}}送{{item.give==null?'0': item.give}}元）</p>
                     
                    </section>
                    <section class="right">
                        <p>+{{item.balance }}元  支付成功</p>
                        <p>{{item.createTime | date }}</p>
                    </section>
                </template>
<!--1305注册赠送-->
<template v-else-if="item.logType=='1305'">
                    <section class="left leftSpeci">
                        <p class="leftP">新用户注册送{{item.balance==null?'0': item.balance}}元</p>
                     
                    </section>
                    <section class="right">
                        <p>+{{item.balance }}元  赠送成功</p>
                        <p>{{item.createTime | date }}</p>
                    </section>
                </template>
</li>
</ul>
<div v-if="incomeData.length==0  " style="text-align:center;background: #f4f4f4;">
    <img src="../../static/images/icon_noData.png" alt="">
</div>
<div id="footer" v-bind:class="{ 'hidden':footerHidden1}" v-on:click="loadIncome">

    <p class="loadingTips">点击查看更多</p>
</div>


</div>
<div id="expenses" v-bind:class="{ 'tab_con_active':tab2Active}">
    <ul>

        <li class="item" v-for="(item,index) in expensesData">
            <!--1301  购物消费-->
            <template v-if="item.logType=='1301'">
                <section class="left">
                    <p>订单编号：{{item.orderCode}}</p>
                    <p>{{item.createTime | date}}</p>
                </section>
                <section class="right">
                    {{ item.balance}}元
                </section>
            </template>
            <!--1303 提现-->
            <template v-if="item.logType=='1303'">
                <section class="left">
                    <p>订单编号：{{item.orderCode}}</p>
                    <p>{{item.createTime | date}}</p>
                </section>
                <section class="right">
                    {{ item.balance}}元
                </section>
            </template>

        </li>
    </ul>
    <div v-if="expensesData.length==0  " style="text-align:center;background: #f4f4f4;">
        <img src="../../static/images/icon_noData.png" alt="">
    </div>
    <div id="footer" v-bind:class="{ 'hidden':footerHidden2}" v-on:click="loadExpense">

        <p class="loadingTips">点击查看更多 </p>
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
                tab1Active: true,
                tab2Active: false,
                footerHidden1: false,
                footerHidden2: false,
                balanceVal: "",
                incomeData: [],
                expensesData: [],
                currentPageIcome: 1,
                currentPageExpense: 1,
            }
        },
        created: function() {
            moveAction()
            this.getBalance();


            this.$store.commit('isLoading', true)
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });

            this.getIncome();
            this.getexpenses()
        },
       mounted:function(){
             $(".com-app").css("background","#f6f6f6")

        },
        methods: {
            tabSwitch: function(status) {
                if (status == "tab1Active") {
                    this.tab1Active = true;
                    this.tab2Active = false;
                } else if (status == "tab2Active") {
                    this.tab1Active = false;
                    this.tab2Active = true;
                }

            },
            getIncome: function() {
                this.$store.commit('isLoading', true)

                var _this = this;
                axios.get('/member/getBalanceLog.do', {
                        params: {
                            currentPage: _this.currentPageIcome,
                            pageSize: 10,
                            dir: 0
                        }
                    })
                    .then(function(response) {
                        // console.log(response);
                        if (response.data.result.length == 0 || response.data == "") {
                            _this.footerHidden1 = true;
                        }
                        for (var i = 0; i < response.data.result.length; i++) {
                            _this.incomeData.push(response.data.result[i])
                        }
                        if (_this.currentPageIcome == response.data.totalPage) {
                            _this.footerHidden1 = true;
                        }
                        _this.currentPageIcome++;

                        console.log("incomeData", _this.incomeData);
                        _this.$store.commit('isLoading', false)



                    })
                    .catch(function(error) {
                        // console.log(error);
                    });
            },
            getexpenses: function() {
                this.$store.commit('isLoading', true)

                var _this = this;
                axios.get('/member/getBalanceLog.do', {
                        params: {
                            currentPage: _this.currentPageExpense,
                            pageSize: 10,
                            dir: 1
                        }
                    })
                    .then(function(response) {
                        // console.log("expenses", response);
                        if (response.data.result.length == 0) {
                            _this.footerHidden2 = true;
                        }
                        for (var i = 0; i < response.data.result.length; i++) {
                            _this.expensesData.push(response.data.result[i])
                        }
                        if (_this.currentPageExpense == response.data.totalPage) {
                            _this.footerHidden2 = true;
                        }
                        _this.currentPageExpense++;
                        _this.$store.commit('isLoading', false)

                        // console.log("expensesData", _this.expensesData)

                    })
                    .catch(function(error) {
                        // console.log(error);
                    });

            },
            loadIncome: function() {
                this.getIncome()
            },
            loadExpense: function() {
                this.getexpenses()
            },
            getBalance: function() {
                var _this = this;
                axios.get('/member/getBalance.do')
                    .then(function(response) {
                        // console.log(response);
                        _this.balanceVal = response.data.balance;
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
    @import "../../static/css/balance.scss";
</style>