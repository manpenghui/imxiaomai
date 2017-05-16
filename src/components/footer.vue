<template>
  <div class="footer">
       <router-link to="/first"  id="index"><div class="img_style"><div class="tab_style"></div></div>
       </router-link>
       <router-link to="/scan/nomal" id="home"><div class="img_style"><div class="tab_style"></div></div>
       </router-link>
       <router-link to="/mine" id="mine"><div class="img_style"><div class="tab_style"></div></div>
      </router-link>
   
  </div>
</template>
<script>
    export default {
        data: function() {
            return {

            }
        },
        methods: {

        }


    }
</script>
<style lang="scss" scoped>
    @import "../../static/css/footer.scss";
</style>