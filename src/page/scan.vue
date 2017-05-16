<template>
  <div id="scan">
   <div class="home_top">
  <!--  <div class="img_style" @click="scanAction()"><img src="../../static/images/scan_logo.png"></div> -->
       <input id="goodsId" type="number" name="" placeholder="手动输入条码">
       <label @click='addAction()'>提交</label>
       <div class="img_style" @click="scanAction()">点我扫描商品条码</div> 
   </div>
   <div style="width:100%;height:10px;background:#eee;"></div>
   <div v-if="!isEmpty" class="note">
       <label class="editor" @click="editor()">{{type}}</label> <label class="del" v-if="isCanChoose" @click="delAction()">一键清空</label>
   </div>
   <div id="goods">
        <ul>
          <li  class="goods_style" v-for="goodsInfo in goodsList">
            <div v-if="isCanChoose" class="select_style" @click="selectAction(goodsInfo.goods.goodsGbk)">
                <img v-if="goodsInfo.isSelect" class="is_select" src="/static/images/pay_select.png">
                <img v-if="!goodsInfo.isSelect" class="is_select" src="/static/images/pay_unselect.png">
            </div>
            <div class="good_msg">
                 <img v-if="goodsInfo.goods.imgUrl==null" src="/static/images/xiaomai.jpg">
                 <img v-if="goodsInfo.goods.imgUrl!=null" :src="goodsInfo.goods.imgUrl">
                 <label class="name">{{goodsInfo.goods.goodsName}}</label>
                 <label class="money">¥{{goodsInfo.goods.price}}</label>
                 <div class="add_sub_style">
                     <label @click="sub(goodsInfo.goods.goodsGbk)"><img src="/static/images/sub.png"></label>
                     <label>{{goodsInfo.num}}</label>
                     <label @click="add(goodsInfo.goods.goodsGbk)"><img src="/static/images/add.png"></label>
                 </div>
            </div>
          </li>
        </ul>
          <div style="width:100%;height:60px;background:#f2f2f2;"></div>
      </div>
     <div id="footer">
         <div v-if="isCanChoose" class="select_style" @click="allSelectAction()">
                <img v-if="!isEmpty&allSelect" class="is_select" src="/static/images/pay_select.png">
                <img v-if="!isEmpty&!allSelect" class="is_select" src="/static/images/pay_unselect.png">
         </div>
         <label v-if="!isEmpty&isCanChoose" @click="allSelectAction()">全选</label>
         <div v-if="!isEmpty&!isCanChoose" id="submit" @click="payAction(1)">结算({{goodsList.length}})</div>
          <div v-if="isEmpty&!isCanChoose" id="submit" @click="payAction(0)">结算(0)</div>
         <div id="money" v-if="!isEmpty&!isCanChoose"><label>合计:¥{{promotionPrice}}</label><span>已立减:¥{{savingPrice}}</span></div>
         
     </div> 
  </div>
</template>
<script>
    import axios from 'axios'
    import router from '../router/router'

    export default {
        data: function() {
            return {
                "isCanChoose": false,
                "isEmpty": true,
                "allSelect": false,
                "type": "编辑",
                "type_note": "全选",
                "goodsList": [],
                "promotionPrice": "",
                "savingPrice": ""
            }
        },
        beforeCreate() {
            moveAction();
            
        },
        created: function() {
            this.$store.commit('changeIndexConf', {
                isFooter: false
            })
           
        },
        mounted: function() {
            if (store.get("userInfo") == "") {
                router.replace("/login");
            }
            if (this.$route.params.type=="nomal") {
                this.scanAction();
            }
            
            
            var _self = this;
            axios.get('/cart/getCart.do?shopCode=' + store.get('position'))
                .then(function(response) {
                    // console.log(response);
                    var goodArr = new Array();
                    goodArr = response.data.obj.cartItems;
                    for (var i = 0; i < goodArr.length; i++) {
                        goodArr[i].isSelect = false;
                    }
                    _self.goodsList = goodArr;
                    if (_self.goodsList.length == 0) {
                        _self.isEmpty = true;
                    } else {
                        _self.isEmpty = false;
                    }

                    _self.allSelect = false;
                    _self.promotionPrice = parseFloat(response.data.obj.promotionPrice).toFixed(2);

                    _self.savingPrice = parseFloat(response.data.obj.savingPrice).toFixed(2);


                })
                .catch(function(error) {

                });

        },
        methods: {

            addAction: function() {
                this.isCanChoose = false;
                var _self = this;
                var goodGbk = $("#goodsId").val(); //2501000008150
                if (goodGbk == "") {

                      
                    this.$store.commit('changeIndexConf',   {                    
                        isToast:true,
                        toastTip:"请输入条码"                
                    });
                } else {
                    var _self = this;
                    axios.get('/cart/addGoods.do?gbk=' + goodGbk + '&shopCode=' + store.get('position'))
                        .then(function(response) {
                            
                            if (response.data.obj.lastGoodsisNull) {
                                _self.$store.commit('changeIndexConf',   {                    
                                    isToast:  true,
                                    toastTip:   "条码错误没有该商品"                
                                });
                            }
                            var goodArr = response.data.obj.cartItems;
                            for (var i = 0; i < goodArr.length; i++) {
                                goodArr[i].isSelect = false;
                            }
                            _self.goodsList = goodArr;
                            _self.allSelect = false;
                            _self.promotionPrice = parseFloat(response.data.obj.promotionPrice).toFixed(2);
                            _self.savingPrice = parseFloat(response.data.obj.savingPrice).toFixed(2);

                            if (_self.goodsList.length == 0) {
                                _self.isEmpty = true;
                            } else {
                                _self.isEmpty = false;
                            }


                        })
                        .catch(function(error) {
                         
                        });

                }


            },
            scanAction: function() {

                this.isCanChoose = false;
                var _self = this;
                wx.scanQRCode({
                    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                    scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                    success: function(res) {
                        var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                        var arr=result.split(",");
                        if (arr.length==1) {
                           _self.add(res.resultStr);
                        }if(arr.length==2){
                           _self.add(res.resultStr.split(",")[1]); 
                        }

                        // if (res.resultStr.split(",")[1]==undefined||res.resultStr.split(",")[1]=="undefined") {
                        //     _self.$store.commit('changeIndexConf',   {                    
                        //             isToast:  true,
                        //             toastTip:   "扫码失败,请手动输入或者重新扫描"                
                        //         });  

                        // }else{
                        //    _self.add(res.resultStr.split(",")[1]); 
                        // }  
                    },
                    fail:function(){
                        // window.location.reload();
                        // setTimeout(function(){window.location.href("/?#/first")},1000);


                    },cancel:function(){
                       
                    }
                });
            },
            editor() {
                this.isCanChoose = !this.isCanChoose;
                if (this.isCanChoose) {
                    // $(".is_select").show();
                    this.type = "完成";

                } else {
                    //$(".is_select").hide();
                    this.type = "编辑";
                }


            },
            delAction: function() {
                var delArr = new Array();
                var arrSrt = "";
                for (var i = this.goodsList.length - 1; i >= 0; i--) {
                    if (this.goodsList[i].isSelect) {
                        delArr.push(this.goodsList[i].goods.goodsGbk);
                        arrSrt += (this.goodsList[i].goods.goodsGbk + ",");
                    }
                }
                arrSrt = arrSrt.substring(0, arrSrt.length - 1);
                var _self = this;
                var urlString = "/cart/clear.do?gbks=" + arrSrt + "&shopCode=" + store.get('position');
                if (arrSrt.length == 0) {
                    return;
                }
                axios.get(urlString)
                    .then(function(response) {
                        var goodArr = new Array();
                        if (response.data.obj.cartItems.length == 0) {
                            _self.goodsList = goodArr;
                            _self.promotionPrice = 0;
                            _self.savingPrice = 0;
                            _self.isEmpty = true;

                        } else {
                            goodArr = response.data.obj.cartItems;
                            _self.promotionPrice = parseFloat(response.data.obj.promotionPrice).toFixed(2);
                            _self.savingPrice = parseFloat(response.data.obj.savingPrice).toFixed(2);

                        }

                        for (var i = 0; i < goodArr.length; i++) {
                            goodArr[i].isSelect = false;

                        }
                        _self.goodsList = goodArr;
                        _self.allSelect = false;


                    })
                    .catch(function(error) {

                    });

            },
            add: function(id) {
                this.isCanChoose = false;
                var _self = this;
                axios.get('/cart/addGoods.do?gbk=' + id + '&shopCode=' + store.get('position') + '&num=1')
                    .then(function(response) {
                        if (response.data.obj.lastGoodsisNull) {

                            _self.$store.commit('changeIndexConf',   {                    
                                isToast:  true,
                                                    toastTip:   "条码错误没有该商品"                
                            });
                        }
                        var goodArr = response.data.obj.cartItems;
                        for (var i = 0; i < goodArr.length; i++) {
                            goodArr[i].isSelect = false;
                        }
                        _self.goodsList = goodArr;
                        _self.allSelect = false;
                        _self.promotionPrice = parseFloat(response.data.obj.promotionPrice).toFixed(2);
                        _self.savingPrice = parseFloat(response.data.obj.savingPrice).toFixed(2);

                        if (_self.goodsList.length == 0) {
                            _self.isEmpty = true;
                        } else {
                            _self.isEmpty = false;
                        }

                    })
                    .catch(function(error) {

                    });

            },
            sub: function(id) {
                this.isCanChoose = false;
                var _self = this;
                axios.get('/cart/addGoods.do?gbk=' + id + '&shopCode=' + store.get('position') + '&num=-1')
                    .then(function(response) {
                        if (response.data.obj.cartItems.length == 0) {
                            _self.goodsList = new Array();
                            _self.isEmpty = true;
                        } else {
                            var goodArr = response.data.obj.cartItems;
                            for (var i = 0; i < goodArr.length; i++) {
                                goodArr[i].isSelect = false;
                            }
                            _self.goodsList = goodArr;
                            _self.allSelect = false;
                            _self.promotionPrice = parseFloat(response.data.obj.promotionPrice).toFixed(2);
                            _self.savingPrice = parseFloat(response.data.obj.savingPrice).toFixed(2);

                        }
                    })
                    .catch(function(error) {

                    });


            },
            selectAction: function(id) {

                for (var i = 0; i < this.goodsList.length; i++) {
                    if (this.goodsList[i].goods.goodsGbk == id) {
                        this.goodsList[i].isSelect = !this.goodsList[i].isSelect;
                    }
                }
                this.isAllselect();

            },
            allSelectAction: function() {
                this.allSelect = !this.allSelect;
                if (this.allSelect) {
                    for (var i = 0; i < this.goodsList.length; i++) {
                        this.goodsList[i].isSelect = true;
                    }
                } else {
                    for (var i = 0; i < this.goodsList.length; i++) {
                        this.goodsList[i].isSelect = false;
                    }
                }

            },
            isAllselect: function() {
                this.allSelect = true;

                for (var i = 0; i < this.goodsList.length; i++) {
                    if (!this.goodsList[i].isSelect) {
                        this.allSelect = false;
                    }

                }

            },
            payAction: function(oid) {
                if (oid == "0") { 
                    this.$store.commit('changeIndexConf',   {                    
                        isToast:  true,
                                            toastTip:   "没有商品"                
                    });
                } else {
                    router.push("/pay/shopMarket");
                }

            }


        },
        computed: {


        }
    }
</script>
<style lang="scss" scoped>
    @import "../../static/css/scan.scss";
</style>