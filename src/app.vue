<template>
  <div class="com-app">
    <!--<transition :name="transitionName">-->
    <!-- <router-view class="child-view"></router-view>-->
      <router-view ></router-view>
      
   <!-- </transition>-->
    <!--<com-header v-show="isHeader"></com-header>-->
    <com-footer v-show="isFooter"></com-footer
    >
    <com-loading v-show="loading"></com-loading>
  <com-toast v-show="isToast"></com-toast>
  </div>
</template>
<script>
    // import Header from './components/header'
    import Footer from './components/footer'
    import Index from './page/index'
    import loading from './components/loading'
    import Toast from "./components/toast"

    export default {
        data: function() {
            return {
                transitionName: 'slide-left'
            }
        },
        created: function() {
            if (this.$route.name === undefined) {
                this.$router.push('/index')
            }
        },
        watch: {
            '$route' (to, from) {
                const toDepth = to.path.split('/').length
                const fromDepth = from.path.split('/').length
                this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
            }
        },
        computed: {
            isFooter: function() {
                return this.$store.state.comm.indexConf.isFooter
            },
            loading: function() {
                return this.$store.state.comm.loading
            },
            isHeader: function() {

                return this.$store.state.comm.indexConf.isHeader
            },
            title: function() {

                return this.$store.state.comm.indexConf.title;
            },
            isToast: function() {
                return this.$store.state.comm.indexConf.isToast;
            }

        },
        components: {
            // comHeader:Header,
            comFooter: Footer,
            comIndex: Index,
            comLoading: loading,
            comToast: Toast
        },
        methods: {}
    }
</script>
<style lang="scss">
    @import "../static/css/app.scss";
</style>