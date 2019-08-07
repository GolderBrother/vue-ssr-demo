const Koa = require('koa');
const Router = require('koa-router');
const Static = require('koa-static');
const fs = require('fs');
const app = new Koa();
const router = new Router();
const path = require('path');
const VueServerRenderer = require('vue-server-renderer');

// 获取服务端打包后的bundle
// const ServerBundle = fs.readFileSync('./dist/server.bundle.js', 'utf8');
const ServerBundle = require('./dist/vue-ssr-server-bundle.json');

// 客户端代码映射文件
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

// 创建服务端渲染模板
const template = fs.readFileSync('./dist/index.ssr.html', 'utf8');
// 创建一个渲染器
// 渲染打包后的结果
const render = VueServerRenderer.createBundleRenderer(ServerBundle, {
    template,
    // 设置服务端和客户端关联（服务端打包需要客户端文件）
    // 渲染的时候，可以找到客户端的js文件，自动引入到html中
    clientManifest
});

router.get('/', async ctx => {
    ctx.body = await new Promise((resolve, reject) => {
        // 方法 必须要写成回调函数的形式，否则样式不生效
        // 这边需要挂载客户端代码，js事件才能生效
        render.renderToString({url: "/"}, (err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    });
});

app.use(router.routes());
// koa 静态服务中间件
app.use(Static(path.resolve(__dirname, "dist")));
// 如果路径匹配不到会执行此逻辑
// 如果服务器没有此路径 会渲染当前的组件
app.use(async ctx => {
    try {
        ctx.body = await new Promise((resolve, reject) => {
            // 方法 必须要写成回调函数的形式，否则样式不生效
            // 这边需要挂载客户端代码，js事件才能生效
            render.renderToString({url: ctx.url}, (err, data) => {
                if (err) reject(err);
                resolve(data);
            })
        });
    } catch (error) {
        ctx.body = error && error.msg;
    }
});
app.listen(3000);


