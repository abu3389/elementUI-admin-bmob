<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="$route.path" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" :unique-opened='false' :router='true'>
            <template v-for="item in items">
                <!-- 没有子菜单的情况 -->
                <!-- 直接打印菜单 -->
                <template v-if="!item.subs">
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
                <!-- 有子菜单的情况 -->
                <template v-else>
                    <!-- 打印父菜单 -->
                    <el-submenu :index="item.index" :key="item.index">
                        <!-- 父菜单自定义模板 -->
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <!-- 打印子菜单 -->
                        <el-menu-item v-for="subItem in item.subs" :key="subItem.index" :index="item.index+'/'+subItem.index">
                            <i :class="subItem.icon"></i><span slot="title">{{ subItem.title }}</span>
                        </el-menu-item>
                    </el-submenu>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '@/components/common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-news',
                        index: '/user',
                        title: '用户管理'
                    },
                    {
                        icon: 'el-icon-s-custom',
                        index: '/role',
                        title: '角色管理',
                        subs:[
                            {
                                icon: 'el-icon-news',
                                index: 'list',
                                title: '角色列表'
                            },
                            {
                                icon: 'el-icon-news',
                                index: 'type',
                                title: '角色分类'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-goods',
                        index: '/shop-list',
                        title: '商品分类'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: '/shop-info',
                        title: '商品详情'
                    },
                    {
                        icon: 'el-icon-tickets',
                        index: '/banner',
                        title: '图片列表'
                    }
                ]
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
