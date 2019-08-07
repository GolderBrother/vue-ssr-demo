const merge = require('webpack-merge')
const base = require('./webpack.base')
const path = require('path');
// 用来生成客户端映射
const ClientRenderPlugin = require('vue-server-renderer/client-plugin');
const resolve = dir => path.resolve(__dirname, dir);
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = merge(base, {
    entry: {
        client: resolve('../src/client-entry.js')
    },
    plugins: [
        new ClientRenderPlugin(),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: resolve('../public/index.html')
        })
    ]
})