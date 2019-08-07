import Vue from 'vue';
import App from './App';
import createRouter from './router';
import createStore from './store';

// 入口文件，他需要提供 vue 实例
// 如果是服务端渲染，每个人都应该有自己的一个实例
export default () => {
    const router = createRouter();
    const store = createStore();
    const app = new Vue({
        router,
        store,
        // 服务端不需要
        // el: '#app',
        // 渲染函数 h -> createElement
        render: h => h(App)
    });

    return {
        app,
        router,
        store
    }
}