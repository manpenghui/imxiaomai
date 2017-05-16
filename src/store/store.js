import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        reply: {
            isComment: false, //
            name: '',
            articleId: '',
            commentId: '',
            type: 'comment', // reply or comment
            content: null,
            comment: {}
        },
        // 公共
        comm: {
            loading: false,
            login: {
                memberId: '',
                userData: ''
            },
            indexConf: {
                isFooter: true, // 是否显示底部
                isSearch: true, // 是否显示搜索
                isBack: false, // 是否显示返回
                isShare: false, // 是否显示分享
                title: '', // 标题,
                isHeader: false,
                isToast: false,
                toastTip: ""

            },
            //充值中心的数据
            rechargeCenter: {
                rechargeMoney: "",
                isInvoice: false,
                isTip: true,
                tipText: ""
            },
            invoiceInfo: {
                invoiceTitle: "",
                invoiceContent: "",
                invoiceContact: "",
                invoicePhone: "",
            }
        }
    },
    mutations: {

        reply: (state, data) => {
            if (data.name === state.reply.name && state.reply.isComment && data.commentId === state.reply.commentId) {
                state.reply.isComment = false
            } else {
                state.reply.name = data.name
                state.reply.commentId = data.commentId
                state.reply.isComment = true
            }
        },
        /*
         * loading的显示
         * */
        isLoading: (state, status) => {
            state.comm.loading = status
        },
        /*
         * 修改header的信息
         *
         * */
        changeIndexConf: (state, data) => {
            Object.assign(state.comm.indexConf, data)
        },
        //充值中心
        saveRechargeCenter: (state, data) => {
            Object.assign(state.comm.rechargeCenter, data)
        },
        //发票信息
        selectInvoiceInfo: (state, data) => {
            Object.assign(state.comm.invoiceInfo, data)
        },
        isLogin: (state, data) => {
            localStorage.setItem('memberId', data.memberId)
            localStorage.setItem('userMsg', JSON.stringify(data))
            state.comm.login.memberId = localStorage.getItem('memberId')
            state.comm.login.userData = JSON.parse(localStorage.getItem('userMsg'))
        },
        logout: (state, data) => {
            localStorage.removeItem('memberId')
            localStorage.removeItem('userMsg')
            state.comm.login.memberId = ''
            state.comm.login.userData = ''
        }
    },
    actions: {
      isLoading:function(context,status){
        context.commit("isLoading",status)
      }

    },
    getter: {

    }
})
export default store
