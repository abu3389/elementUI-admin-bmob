import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import "babel-polyfill";
import 'default-passive-events'

Vue.use(ElementUI, { size: 'small' });
Vue.prototype.$axios = axios;

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    //获取用户信息
    const role = localStorage.getItem('ms_username');
    console.log("6666",role,to.path)
    //是否是符合浏览器要求
    if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
        Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
            confirmButtonText: '确定'
        });
        next(false)
    }else if(!role && to.path !== '/login'){ 
        //未登录且前往的是不是登录页的情况
        next('/login');//跳转登录页
    }else if (role && to.path === '/login') {
        // 已登录且前往的是登录页的情况
        next('/');//跳转用户首页
    }else{
        // 未登录且前往的是登录页的情况或已登录且前往的不是登录页的情况
        next();
    }
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
