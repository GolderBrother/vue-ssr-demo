// 服务端的入口
import createApp from './main'

// 服务端需要调用这个函数，产生一个新的vue实例,渲染结果
export default (context) => {
    return new Promise((resolve, reject) => {
        const {
            app,
            router,
            store
        } = createApp();
        // 返回的实例，应该根据路由做对应的跳转
        router.push(context.url);
        // 涉及到异步组件的问题
        router.onReady(() => {
            // 获取到跳转到的匹配到的组件
            const matchs = router.getMatchedComponents();
            if(matchs && matchs.length === 0) {
                // 匹配不到任何组件,返回404
                reject({
                    code: 404,
                    msg: 404
                });
            }
            // matchs匹配到所有的，整个都在服务端执行的
            Promise.all(matchs.map(component => {
                if(component.asyncData) {
                    // 返回的是Promise asyncData是在服务端调用的
                    return component.asyncData(store)
                }
            })).then(() => {
                // 以上all中的方法，会改变store中的state
                // 会将状态挂载到window上, 当使用 template 时，context.state 将作为 window.__INITIAL_STATE__ 状态，自动嵌入到最终的 HTML 中
                context.state = store.state;
                // 等所有组件都执行完才返回
                resolve(app);
            });
        }, reject);
    });
}

// 获取数据的操作，在服务端获取

// 服务端配置好后，需要导出给node使用,变成如下形式
// (() => {
//     export default () => {
//         const {
//             app
//         } = createApp();
//         return app;
//     }
// })();