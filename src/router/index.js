import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/common/Home.vue';
import pageIndex from '@/components/page/pageIndex.vue';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/user'
        },
        {
            path: '/',
            component: Home,
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/user',
                    component: () => import('@/components/page/User/UserList.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/role',
                    component: pageIndex,
                    children:[
                        {
                            path: 'list',
                            component: () => import('@/components/page/Role/RoleList.vue'),
                            meta: { title: '角色列表' }
                        },
                        {
                            path: 'type',
                            component: () => import('@/components/page/Role/RoleType.vue'),
                            meta: { title: '角色分类' }
                        },
                    ],
                    meta: { title: '角色管理' }
                },
                {
                    path: '/shop-info',
                    component: () => import('@/components/page/ShopInfo.vue'),
                    meta: { title: '商品详情' }
                },
                {
                    path: '/shop-list',
                    component: () => import('@/components/page/ShopList.vue'),
                    meta: { title: '商品分类' }
                },
                {
                    path: '/banner',
                    component: () => import('@/components/page/Banner.vue'),
                    meta: { title: '商品分类' }
                }
            ]
        },
        {
            path: '/login',//登录
            component: () => import('@/components/page/Login.vue')
        },
        {
            path: '/404',//找不到页面
            component: () => import('@/components/page//Error/404.vue')
        },
        {
            path: '/403',//无权限
            component: () => import('@/components/page/Error/403.vue')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
