import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/common/Home.vue';

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
                    component: () => import('@/components/page/UserList.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/role',
                    component: () => import('@/components/page/RoleType.vue'),
                    children:[
                        {
                            path: '/role/list',
                            component: () => import('@/components/page/RoleList.vue'),
                            meta: { title: '角色列表' }
                        },
                        {
                            path: '/role/type',
                            component: () => import('@/components/page/RoleType.vue'),
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
            path: '/login',
            component: () => import('@/components/page/Login.vue')
        },
        {
            path: '/404',
            component: () => import('@/components/page/404.vue')
        },
        {
            path: '/403',
            component: () => import('@/components/page/403.vue')
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
