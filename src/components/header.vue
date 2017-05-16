<template>
  <div id="header">
    <div class="title">
     
      <p>{{title}}</p>
    </div>
  </div>
</template>

<script>
    export default {
        data: function() {
            return {}
        },
        computed: {
           
            title: function() {
                return this.$store.state.comm.indexConf.title
            }
        },
        methods: {
            goBack: function() {
                history.go(-1)
            },
            add: function() {
                console.log('ee')
            }
        },
        components: {

        }
    }
</script>
<style lang="scss" scoped>
    /*@import "../../static/css/header.scss";*/
</style>