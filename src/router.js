import Vue from 'vue'
import VueRouter from 'vue-router'
import Foo from './components/Foo.vue'
Vue.use(VueRouter)

export default () => {
    const Router = new VueRouter({
        mode: 'history',
        routes: [{
            path: '/',
            component: Foo
        }, {
            path: '/bar',
            // 渲染异步组件
            component: () => import('./components/Bar.vue')
        }]
    });
    return Router

}