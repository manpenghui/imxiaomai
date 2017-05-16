<template>
  <div>
  <div id="clickMe" v-if="isFirst" @click="reloadAction()">
  <img src="/static/images/pin.png">
  
  </div>
	<div v-if="!isFirst" id="position">
		<div id="automatic">
          <label class="title">当前选择学校</label>
          <div  id="automatic_style">
            <div style="width:100%;height:10px;background:white;"></div>
          
          	<img v-if="isPoistion" class="animation_style"  src="/static/images/position.png">
          	<div class="msg">{{positionMsg}}</div>
          </div>
		</div>
		<div id="manual">
		  <label class="title">手动选择</label>
		  <div id="manual_style">
		  	<ul>
		  		<li v-for="school in schoolList" >
		  			<label @click="choose(school.shopCode,school.shopName)">{{school.shopName}}</label>
		  		</li>
		  	</ul>
		  </div>	
		</div>
	</div>
  </div>
</template>
<script type="text/javascript">
import axios from 'axios'
 import router from '../router/router'
export default {
       data: function() {
            return {
                isFirst:false,
                isPoistion: true,
                positionMsg:"定位中,请稍后...",
                schoolList:[
                ] 
            }
        },
	   created() {

            // head的修改
            this.$store.commit('changeIndexConf', {
                isFooter: false,
            })
           
          
            
        }, 
       
        mounted: function(){
        
           this.registered();
        
         
             
        },
        methods:{
          reloadAction:function(){
        
            
          },
        	positionAction:function(){
            
            this.isPoistion=true;    
            this.positionMsg="定位中,请稍后...";
            //console.log("开始时间"+Date.parse(new Date()));
           	var _self=this;
              wx.getLocation({
              type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
             success: function (res) {
              
             
             var latitude = res.latitude==undefined||res.latitude=="undefined"?res.latitude=0:res.latitude; // 纬度，浮点数，范围为90 ~ -90
             var longitude = res.longitude==undefined||res.longitude=="undefined"?res.longitude=0:res.longitude; // 
             var speed = res.speed; // 速度，以米/每秒计
             var accuracy = res.accuracy; // 位置精度
              axios.get('/shop/relateShop.do?longitude='+res.longitude+'&latitudes='+res.latitude)
             .then(function (response) {
             var schoolArr=new Array();
             schoolArr=response.data;
             _self.schoolList=schoolArr;
             _self.isPoistion=false;
             _self.positionMsg=schoolArr[0].shopName;
             store.set("position",schoolArr[0].shopCode);
            store.set("shopName", schoolArr[0].shopName);
             if (store.get('userInfo')=="") {
                if (schoolArr[0].shopType==1) {
                  router.push("/unmannedLogin");
                }else{
                   router.push("/login");
                  
                }
               
              }else{
                 if (store.get('isReload')=="") {
                  router.push("/first");
                 }   
              }
            
            })
           .catch(function (error) {
             // console.log("失败");
            store.set("position","XM0001");
            store.set("shopName", "暂无法购买");
           router.push("/first");
            });
          }
          });
        	},
            choose:function(code,name){
              this.positionMsg=name;
               store.set("position",code);
               store.set("shopName", name);
               router.go(-1);
            },registered: function() {
                var xmUrl = location.href.split('#')[0];
                axios.get('/auth/signature.do?url=' + xmUrl)
                    .then(function(response) {
                        var xmappId = response.data.appId;
                        var xmtimestamp = response.data.timestamp;
                        var xmnonceStr = response.data.nonceStr;
                        var xmsignature = response.data.signature;
                        wx.config({
                            debug: false,
                            appId: xmappId,
                            timestamp: xmtimestamp,
                            nonceStr: xmnonceStr,
                            signature: xmsignature,
                            jsApiList: [
                                'checkJsApi',
                                'onMenuShareTimeline',
                                'onMenuShareAppMessage',
                                'onMenuShareQQ',
                                'onMenuShareWeibo',
                                'hideMenuItems',
                                'showMenuItems',
                                'hideAllNonBaseMenuItem',
                                'showAllNonBaseMenuItem',
                                'translateVoice',
                                'startRecord',
                                'stopRecord',
                                'onRecordEnd',
                                'playVoice',
                                'pauseVoice',
                                'stopVoice',
                                'uploadVoice',
                                'downloadVoice',
                                'chooseImage',
                                'previewImage',
                                'uploadImage',
                                'downloadImage',
                                'getNetworkType',
                                'openLocation',
                                'getLocation',
                                'hideOptionMenu',
                                'showOptionMenu',
                                'closeWindow',
                                'scanQRCode',
                                'chooseWXPay',
                                'openProductSpecificView',
                                'addCard',
                                'chooseCard',
                                'openCard'
                            ]
                        });
                    })
                    .catch(function(error) {
                       
                    });

                wx.error(function(res) {
                    _self.$store.commit('changeIndexConf',   {                    
                        isToast:  true,
                        toastTip:   "系统出现问题,请暂勿使用,谢谢配合"                
                    });
                });
                var _self = this;
                wx.ready(function() {
                   _self.positionAction();
                });
            }
        }
}

</script>
<style lang="scss" scoped>
	@import "../../static/css/position.scss";
</style>