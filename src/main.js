import Vue from 'vue'
import "mint-ui/lib/style.css"
import router from './router/router'
import store from './store/store'

//开启debug模式
Vue.config.debug = true
window.log = console.log
Vue.filter('date', function(input) {
    var oDate = new Date(input);
    return oDate.getFullYear() + '年' + ((oDate.getMonth() + 1) < 10 ? "0" + (oDate.getMonth() + 1) : (oDate.getMonth() + 1)) + '月' + (oDate.getDate() < 10 ? "0" + oDate.getDate() : oDate.getDate()) + '日 ';
});

let data = {
    el: '#app',
    router,
    store
}

// Vue.prototype.post = function(url, params, fn) {
//     var xhr = new XMLHttpRequest()
//     xhr.open("POST", url, true)
//     xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhr.onreadystatechange = function() {
//         var XMLHttpReq = xhr;
//         if (XMLHttpReq.readyState == 4) {
//             if (XMLHttpReq.status == 200) {
//                 var text = XMLHttpReq.responseText
//                 var res = JSON.parse(text)
//                 fn(res)
//             }
//         }
//     }
//     xhr.send(params)
// }

//创建一个app实例，并且挂载到选择符#app匹配的元素上
new Vue(data).$mount('#app')