<template lang="html">
  <div id="invoicePage">
      <ul class="lists">
        <li class="item">
            <label for="">发票抬头：</label>
            <input type="text"  v-model="invoiceTitle"  v-on:input="isRequire('title')">
            <img src="../../static/images/delete.png" alt="" @click="clearContent('title')">
        </li>
        <div class="inputTips" v-if="titleError">{{titleErrorText}}</div>
        <li class="item">
            <label for="">发票内容：</label>
            <input type="text" disabled value="" v-model="invoiceContent">
            <!--<img src="../../static/images/pull_down.png" alt="" v-on:click="showContent">-->
             <img :src="[isShowContent ? baseUrl+'pull_up.png' : baseUrl+'pull_down.png']"  v-on:click="showContent">
             <div class="content"v-show="isShowContent">
                 <p v-on:click="selectContent('日用百货')">日用百货</p>
                 <p v-on:click="selectContent('3C产品')">3C产品</p>
             </div>
        </li>
        <li class="item">
            <label for="">联 系 人：</label>
            <input type="text"  v-model="invoiceContact"  v-on:input="isRequire('contact')">
              <img src="../../static/images/delete.png" alt="" v-on:click="clearContent('contact')">
        </li>
        <li class="item">
            <label for="">手 机 号：</label>
            <input type="number"  v-model="invoicePhone" maxlength="11"  v-on:input="isRequire('phone')" >
              <img src="../../static/images/delete.png" alt=""  v-on:click="clearContent('phoneNumber')">
        </li>
         <div class="inputTips"  v-if="phoneError">{{phoneErrorText}}</div>
      </ul>
     <div class="submit">
         <p><img src="../../static/images/warn_tip.png" alt="">充值成功一周后请到门店领取发票哦</p>
         <button :class="isSubmit ? ' buttonActive' : ' ' "  type="button" v-on:click="saveInfo">确认</button>
     </div>
  </div>

</template>
<script>
    import axios from 'axios'

    export default {
        data: function() {
            return {
                invoiceTitle: "",
                invoiceContent: "",
                invoiceContact: "",
                invoicePhone: "",
                isShowContent: false,
                isSubmit: false,
                // baseUrl: "/html5/static/images/",
                baseUrl: "../../static/images/",
                titleError: false,
                phoneError: false,
                titleErrorText: "限制50个字符",
                phoneErrorText: "请输入正确的手机号码格式"



            }
        },
        created: function() {
            moveAction()
            var info = this.$store.state.comm.invoiceInfo;
            this.invoiceTitle = info.invoiceTitle;
            this.invoiceContent = info.invoiceContent;
            this.invoiceContact = info.invoiceContact;
            this.invoicePhone = info.invoicePhone;
            if (this.invoiceTitle != "" && this.invoiceContent != "" && this.invoiceContac != "" && this.invoicePhone != "") {
                this.isSubmit = true;
            }


        },
        mounted: function() {
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            });

        },
        methods: {
            showContent: function() {
                this.isShowContent = !this.isShowContent;
            },
            selectContent: function(con) {
                this.invoiceContent = con;
                this.isShowContent = !this.isShowContent;
            },
            isRequire: function(b) {
                // console.log(1);
                var myreg = /^1[0-9]{10}$/;
                myreg.test(this.phoneNumber)
                switch (b) {
                    case "title":
                        if (this.invoiceTitle.length > 50) {
                            this.titleError = true;
                        } else {
                            this.titleError = false;
                        }

                        break;

                    case "phone":
                        if (!myreg.test(this.invoicePhone)) {
                            this.phoneError = true;
                        } else {
                            this.phoneError = false;
                        }
                        break;
                }

                if (this.invoiceTitle && !this.titleError && this.invoiceContent && this.invoiceContact && this.invoicePhone && !this.phoneError) {
                    this.isSubmit = true;
                }
            },
            clearContent: function(a) {
                // console.log(a);
                switch (a) {
                    case "title":
                        this.invoiceTitle = "";
                        break;
                    case "contact":
                        this.invoiceContact = "";
                        break;
                    case "phoneNumber":
                        this.invoicePhone = "";
                        break;
                }
            },
            saveInfo: function() {
                if (this.isSubmit) {
                    this.$store.commit('selectInvoiceInfo', {
                        invoiceTitle: this.invoiceTitle,
                        invoiceContent: this.invoiceContent,
                        invoiceContact: this.invoiceContact,
                        invoicePhone: this.invoicePhone
                    });
                    this.$router.go(-1);
                }
            }


        },


        computed: {}
    }
</script>

<style lang="scss" scoped>
    @import "../../static/css/invoiceInfo.scss";
</style>