<template>
    <div class="wrapper">
        <!-- 头部 -->
        <v-head></v-head>
        <!-- 左侧菜单 -->
        <left-sidebar></left-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <!-- 路由打开标签 -->
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive>
                        <!-- 路由展示容器 -->
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import vHead from '@/components/common/Header.vue';
    import leftSidebar from '@/components/common/Menu/LeftMenu.vue';
    import vTags from '@/components/common/Tags.vue';
    import bus from '@/components/common/bus';
    export default {
        data(){
            return {
                collapse: false
            }
        },
        components:{
            vHead,
            leftSidebar,
            vTags
        },
        created(){
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>
