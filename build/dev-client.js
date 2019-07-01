// 客户端热加载
const express = require('express')
const app = express()
const webpack = require('webpack')
const path = require('path')
const chalk = require('chalk')

const devConfig = require('./webpack.bom')
const compiler = webpack(devConfig)

const WebpackHotMiddleware = require('webpack-hot-middleware')
const WebpackDevMiddleware = require('webpack-dev-middleware')

const proxy = require('http-proxy-middleware')
const config = require('../config/index')

// 设置静态资源目录
app.use('/static', express.static(path.resolve(__dirname, '../static')))

// 请求代理
app.use(proxy('/api', {
    target: config.http,
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
}))

app.use(WebpackHotMiddleware(compiler))
app.use(WebpackDevMiddleware(compiler))

const port = 8080
app.listen(port, () => {
    console.log(chalk.green(`client started at http://localhost:${port}`))
})
