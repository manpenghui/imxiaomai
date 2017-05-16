import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../app'
import First from '../page/index'
import Index from '../page/first'
import Home from '../page/home'
import Mine from "../page/mine"
import Detail from "../page/detail"
import Orders from "../page/orders"
import Balance from "../page/balance"
import Growup from "../page/grow_up"
import OrderDetail from "../page/orderDetail"
import Pay from "../page/pay"
import mineDetail from "../page/mineDetail"
import RechargeCenter from "../page/rechargeCenter"
import InvoiceInfo from "../page/invoiceInfo"
import Scan from "../page/scan"
import Login from "../page/login"
import Position from "../page/position"
import MemberInfo from "../page/memberInfo"
import UnmannedLogin from "../page/unmannedLogin"
import UnmannedUpload from "../page/unmannedUpload"

Vue.use(VueRouter)

const routes = [{

    path: '/',
    component: App,

    children: [{
            path: '/first',
            name: 'first',
            component: First

        }, {
            path: '/index',
            name: 'index',
            component: Index

        }, {
            path: '/home',
            name: 'home',
            component: Home
        }, {
            path: '/mine',
            name: 'mine',
            component: Mine
        }, {
            path: '/detail',
            name: 'detail',
            component: Detail
        }, {
            path: '/orders/:activeType',
            name: 'orders',
            component: Orders
        }, {
            path: '/balance',
            name: 'balbace',
            component: Balance
        }, {
            path: '/grow_up/:id',
            name: 'grow_up',
            component: Growup
        }, {
            path: '/orderDetail/:orderCode',
            name: 'orderDetail',
            component: OrderDetail
        }, {
            path: '/pay/:orderCode',
            name: 'pay',
            component: Pay
        }, {
            path: '/mineDetail',
            name: 'mineDetail',
            component: mineDetail
        }, {
            path: '/rechargeCenter',
            name: 'rechargeCenter',
            component: RechargeCenter
        }, {
            path: '/invoiceInfo',
            name: 'invoiceInfo',
            component: InvoiceInfo
        }, {
            path: '/scan/:type',
            name: 'scan',
            component: Scan
        }, {
            path: '/login',
            name: 'login',
            component: Login
        }, {
            path: '/position',
            name: 'position',
            component: Position
        }, {
            path: '/memberInfo',
            name: 'memberInfo',
            component: MemberInfo
        }, {
            path: "/unmannedLogin",
            name: 'unmannedLogin',
            component:UnmannedLogin
        }, {
            path: "/unmannedUpload",
            name: "unmannedUpload",
            component:UnmannedUpload
        }



        // { path: '/article/:id', name: 'article', component: Article },

    ]
}]
const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        // savedPosition is only available for popstate navigations.
        return savedPosition
    } else {
        const position = {}
            // new navigation.
            // scroll to anchor by returning the selector
        if (to.hash) {
            position.selector = to.hash
        }
        // check if any matched route config has meta that requires scrolling to top
        if (to.matched.some(m => m.meta.scrollToTop)) {
            // cords will be used if no selector is provided,
            // or if the selector didn't match any element.
            position.x = 0
            position.y = 0
        }
        // if the returned position is falsy or an empty object,
        // will retain current scroll position.
        return position
    }
}
const router = new VueRouter({
        routes: routes, // short for routes: routes
        linkActiveClass: 'active', // router-link的选中状态的class，也有一个默认的值
        // base: "/",
        // mode: "history",
        //scrollBehavior,
        //hashbang: false,
        //history: false
        //saveScrollPosition: false,
        // transitionOnLoad: true



    })
    // router.beforeEach(function(to, from, next) {
    //     var userMsg = localStorage.getItem('userMsg')
    //     if (to.path === '/home') {
    //         if (!userMsg) {
    //             next({
    //                 path: '/login'
    //             })
    //         }
    //     }
    //     next()
    // })
export default router