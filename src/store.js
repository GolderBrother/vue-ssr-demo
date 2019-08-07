import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default () => {
    // 客户端和服务端都需要用到store
    const store = new Vuex.Store({
        state: {
            name: ""
        },
        mutations: {
            CHANGE_NAME(state){
                state.name = "james"
            }
        },
        actions: {
            changeName({commit}){
                // commit与mutation的不用在于里面可以写异步逻辑
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        commit("CHANGE_NAME");
                        resolve();
                    }, 1000);
                })
            }
        }
    });

    if(typeof window !== 'undefined' && window.__INITIAL_STATE__) {
        store.replaceState(window.__INITIAL_STATE__)
    }
    // 如果客户端执行的时候，我需要将服务端设置的替换客户端的
    return store;
}