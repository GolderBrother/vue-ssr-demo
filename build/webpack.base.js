const path = require('path');
const resolve = dir => path.resolve(__dirname, dir);
const VueLoader = require('vue-loader/lib/plugin');
module.exports = {
    // webpack 入口文件
    output: {
        // 根据 entry 中的 key 来的
        filename: '[name].bundle.js',
        path: resolve('../dist')
    },
    resolve: {
        // 配置查找文件的扩展名，引入的时候就不用加扩展名（从左到右）
        extensions: ['.js', '.vue']
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            },
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader']
        }, {
            test: /\.vue$/,
            use: 'vue-loader'
        }]
    },
    plugins: [
        new VueLoader()
    ]
}