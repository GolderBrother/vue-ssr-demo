vue-ssr

## 什么是是服务端渲染
放在服务器进行就是服务端渲染，放在浏览器进行就是浏览器渲染

优点：
- 客户端渲染不利于SEO搜索引擎优化
- 服务端渲染是可以被爬虫抓取到的，客户端异步渲染是很难被爬虫抓取到的 
- SSR直接将HTML字符串传递给浏览器，大大加快了首屏加载时间(spa白屏问题)

缺点：
- SSR占用了更多的CPU和内存资源
- 一些常用的浏览器API可能无法正常使用
- 在vue中只支持beforeCreate和created两个生命周期

![image](https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1295166702,4280703155&fm=26&gp=0.jpg)

使用到的技术栈
- koa
- webpack
- vue

客户端入口 
服务端入口
通过webpack打包成
clientBundle
serverBundle

安装依赖
```
yarn add koa koa-static koa-router
yarn add vue vue-router vuex vue-server-render
```

yarn add nodemon
监听文件代码变化，自动重启node服务

创建模板
模板的占位符(固定)，会自动把内容渲染到这里面
```
<!--vue-ssr-outlet-->
```

创建渲染函数
```
const render = VueServerRender.createRender({
    template // 渲染的模板，模板里必须要有 vue-ssr-outlet
})
```

打包的是主入口main.js文件

yarn add webpack webpack-cli webpack-dev-server babel-loader @babel/preset-env @babel/core vue-style-loader css-loader vue-loader vue-template-compiler html-webpack-plugin webpack-merge --dev

注：
vue-style-loader 支持vue的服务端渲染,类似style-loader

npm从5.2开始，增加了npx这个命令
npx 会执行node_modules中对应依赖包里面的命令行
npx想要解决的主要问题，就是调用项目每内部安装的模块

npx webpack-dev-server(依赖包)
会自动当前（根）目录下的webpack.config.js并执行

服务端不能加el元素，需要提供vue实例

如果是服务端渲染，每个人都应该有一个自己的vue实例

webpack配置
客户端和服务端分开打包
- client.bundle.js
- server.bundle.js

package.json文件中创建scripts命令，会去node_modules/bin目录去执行命令

h => h(App)
h就是createElement

服务端的入口
server.entry.js
服务端需要调用当前这个文件产生一个vue的实例

服务端配置好后，需要导出给node来使用
**target: 'node'**
声明要给node来使用，才能使用commonjs模块

```
比如:const fs = require('fs')

output: {
    // 把最终这个文件的导出结果放到 module.exports 上
    libraryTarget: 'commonjs2' 
}
```

server.bundle.js 只负责渲染成html
client.bundle.js(包含一些js事件挂载到 html

**excludeChunks: ['server']** // 排除某个模块，打包时不需要引入server的脚本
最终生成index.ssr.html，以public/index.ssr.html为模板的，本质是直接原封不动拷贝一份放进来的

nuxt是vue ssr的框架，能快速实现ssr

方法必须写成回调函数的形式
**await new promise((resolve, reject))**

客户端激活
```
App.vue
<div id="app"></div>
```

```
npm run server:build -- --watch
```

--: 表示要传参，这样会把后面的参数自动传入到script命令的最后面
--watch: 表示会监控文件的变动
只要文件有变动，就会自动打包

再次挂载不会闪烁
原理：第一次首屏渲染，已经有内容；然后再调用客户端脚本后，不会再重新渲染；
因为服务端首次渲染(首屏)后，页面上有一个标识(data-server-rendered="true"),来告知客户端不会重新渲染;这样子性能更好；这就是同构

根据client.bundle.js生成客户端映射
客户端渲染
```
const ClientRender = require("vue-server-renderer/client-plugin");
plugins: [
    new ClientRender();
]
```

根据server.bundle.js生成服务端映射
服务端渲染
```
const ServerRender = require("vue-server-rendered/server-plugin");
plugins: [
    new ServerPlugin()
]
```
	
重新打包
生成：
vue-ssr-client-manifest.json
里面对应配置的是client.bundle.js

vue-ssr-server-bundle.json
里面对应配置的是server.bundle.js

服务端打包需要用到客户端的vue-ssr-client-manifest.json
渲染的时候，可以找到客户端的js文件，自动引入到html中
vue-ssr-client-manifest.json这个文件会自动关联client.bundle.js，可以在html文件中自动引入bundle文件（不用手动引入）

ssr中集成路由系统
ssr中的路由跳转规则
面试会问，什么时候是服务端渲染，什么时候是前端路由实现

```
import Vue from 'vue'
import VurRouter from 'vue-router'

Vue.use(VueRouter)
export default () => {
    const router = new VueRouter({
	mode: "history",
  	routes: [{
	    
	  }]
    })
}
```

服务端需要知道当前客户端的路由地址
根据客户端的路由地址渲染对应的页面

如果匹配不到会执行此逻辑
如果服务器没有此路径，会渲染当前的app.vue
```
app.use(async ctx => {
    ctx.body = await new Promise((resolve, reject) => {
	
    })
});
```

涉及到异步组件的问题，返回一个Promise来解决

router.onReady(() => {
    // 获取当前跳转的匹配的路由
})

通过浏览器地址栏刷新才会再走服务端渲染，否则走的是前端路由

前端切换路由是通过H5的history API(mode="history"前提下)


集成 vuex系统

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default () => {
    const store = new Vuex({
  	state: {
	    name: ""
	},
	mutations: {
	    CHANME_NAME(state){
		state.name = "james";
	     }
	},
	actions: {
 	    // action跟mutation区别在于里面可以写异步逻辑
	    changeName({commit}){
		return new Promise((resolve, reject) => {
		    setTimeout(()=> {
  			commit("CHANME_NAME");
			resolve();
		    }, 1000);
		});
	    }
	}
    })
}
```

asyncData // Nuxt.js中的方法名，可以自己定义，这个方法只在服务端执行，并且只在页面组件中执行

服务端渲染使用vuex
asyncData是服务端调用后返回的

```
asyncData(store){
    // dispatch action
    return store.dispatch("changeName");
}
```

把vuex的状态挂载到window上
// context.state 是固定的写法
context.state = store.state;  

如果浏览器执行的时候，我需要将服务端设置的最新状态，替换客户端的状态

```
if(typeof window !== 'undefined' && window.__INITIAL_STATE__) {
   store.replaceState(window.__INITIAL_STATE__); 
}
```
客户端使用vuex
```this.$store.dispatch("changeName")```

接口请求时在客户端中调用好还是服务端中调用
答：如果是新闻列表，那就是需要请求最新的新闻，就需要在服务端中调用请求

vue多页面(MPA)可以用ssr来实现

SSR主要用来做SEO

SSR只能用node来实现

新闻、掘金等网站用的就是SSR，大型网站SSR就不适合，因为有性能瓶颈

webpack-cli:解析命令行参数

``` bash
npm install
npm run client:dev
npm run client:build
npm run server:build
```

### 总结
- 是否使用SSR就一定好？
这个也是不一定的，任何技术都有使用场景。SSR可以帮助你提升首页加载速度，优化搜索引擎SEO，但同时由于它需要在node中渲染整套Vue的模板，会占用服务器负载，同时只会执行beforeCreate和created两个生命周期，对于一些外部扩展库需要做一定处理才可以在SSR中运行等等。

### 参考链接
- [Vue.js 服务器端渲染指南](https://ssr.vuejs.org/zh/)
- [带你五步学会Vue SSR](https://segmentfault.com/a/1190000016637877#articleHeader6)
- [Nuxt.js 基础入门教程](https://segmentfault.com/a/11900000131391390)
- [Nuxt.js官网](https://zh.nuxtjs.org/)