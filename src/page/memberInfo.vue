<template>
	<div >
	<div id="mes">
	    <img class="photo" :src="member.pic">
	    <label>
	    <span>{{member.num}}</span>
	    <img class="level_style" :src="member.level">
	    </label>
	   
	    <div id="score">消费总金额:{{member.scroe}}</div>
	    <div style="height:1px;"></div>
	</div>
	 <img class="showMes" src="/static/images/level-rules.png">
	</div>
</template>
<script type="text/javascript">
    import axios from 'axios'
    import router from '../router/router'
    export default {
        data: function() {
            return {
                "member": {
                    "pic": JSON.parse(store.get('userInfo')).obj.headimgurl,
                    "level": this.getLevel(JSON.parse(store.get('userInfo')).obj.level),
                    "num": JSON.parse(store.get('userInfo')).obj.barCode,
                    "scroe": 0

                }
            }
        },
        mounted: function() {
            var _self = this;
            axios.get("/member/getBalance.do")
                .then(function(response) {

                    _self.member.scroe = response.data.totalSpend;

                })
                .catch(function(error) {

                });

        },
        created() {
            // head的修改
            this.$store.commit('changeIndexConf', {
                isFooter: false,
                isToast: false,
            })
        },
        methods: {
            getLevel: function(num) {

                switch (num) {
                    case "01":
                        return "/static/images/level1.png";
                    case "02":
                        return "/static/images/level2.png";
                    case "03":
                        return "/static/images/level3.png";
                    case "04":
                        return "/static/images/level4.png";
                    case "05":
                        return "/static/images/level5.png";
                    case "06":
                        return "/static/images/level6.png";
                    case "A1":
                        return "/static/images/levelA1.png";
                    case "A2":
                        return "/static/images/levelA2.png";
                    case "A3":
                        return "/static/images/levelA3.png";

                }

            }

        }

    }
</script>
<style lang="scss" scoped>
    @import "../../static/css/memberInfo.scss";
</style>