<template>
    <div class="toast" v-show="isToastShow" v-on:click="toastClick">
       <div class="toastTip">
            {{toastTip}}
       </div>
    </div>
</template>
<script>
    export default {
        data: function() {
            return {
                isToastShow: false
            }
        },
        computed: {
            toastTip: function() {
                return this.$store.state.comm.indexConf.toastTip
            }

        },
        methods: {
            toastClick: function() {
                this.$store.commit('changeIndexConf', {
                    isToast: false,
                    toastTip: ""
                });

            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../static/css/toast.scss";
</style>