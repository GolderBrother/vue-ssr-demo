const merge = require('webpack-merge')
const base = require('./webpack.base')
const path = require('path')
// 用来生成服务端映射
const ServerRenderPlugin = require('vue-server-renderer/server-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const resolve = dir => path.resolve(__dirname, dir);
module.exports = merge(base, {
    mode: "production",
    entry: {
        server: resolve('../src/server-entry.js')
    },
    target: 'node',// 打包后给node使用，才支持 Cmomonjs 规范
    output: {
        //把最终这个文件的导出结果 放到module.exports上,commonjs规范
        // export default {} => mosule.exports = {}
        libraryTarget: 'commonjs2' 
    },
    plugins: [
        new ServerRenderPlugin(),
        new HTMLWebpackPlugin({
            filename: 'index.ssr.html',
            template: resolve('../public/index.ssr.html'),
            excludeChunks: ['server'] // 排除某个模块，打包时不需要引入server的脚本
        })
    ]
})