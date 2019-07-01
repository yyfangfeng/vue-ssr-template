const express = require('express')
const server = express()
const fs = require('fs')
const proxy = require('http-proxy-middleware')
const LRU = require('lru-cache')
const path = require('path')
const chalk = require('chalk')
const cookieParser = require('cookie-parser')
const { createBundleRenderer } = require('vue-server-renderer')
const config = require('./config/index')

let isPro = process.env.NODE_ENV === 'production'

const resolve = file => path.resolve(__dirname, file)

server.use(cookieParser())

// 设置静态资源目录
server.use(express.static(__dirname + '/output'))
server.use(express.static(path.resolve(__dirname, './static')))

// 请求代理
server.use(proxy('/api', {
    target: config.http,
    changeOrigin: true,
    pathRewrite: {
        '^/api': ''
    }
}))

// 实例化配置缓存对象
const microCache = new LRU({
    max: 100,                   // 最大存储100条
    maxAge: 1000 * 60 * 15      // 存储在 15 分钟后过期
})

let renderer
let readyPromise

const template = fs.readFileSync('./template/index.template.html', 'utf-8')
const templatePath = resolve('./template/index.template.html')

if (isPro) {

    // createBundleRenderer 配置
    const bundle = require('./output/vue-ssr-server-bundle.json')                 // 服务端的 json 文件
    const clientManifest = require('./output/vue-ssr-client-manifest.json')       // 客户端的 json 文件

    renderer = createBundleRenderer(bundle, {
        template,
        cache: microCache,                                                      // 提供组件缓存具体实现
        runInNewContext: false,
        clientManifest                                                          // bundle renderer 自动推导需要在 HTML 模板中注入的内容
    })

} else {

    // createBundleRenderer 配置
    function createRenderer(bundle, options) {
        return createBundleRenderer(bundle, Object.assign(options, {
            cache: microCache,
            basedir: resolve('./output'),
            runInNewContext: false
        }))
    }
    
    // 使用热加载
    readyPromise = require('./build/setup-dev-server')(
        server,
        templatePath,
        (bundle, options) => {
            // 每次热加载后赋值到 renderer
            renderer = createRenderer(bundle, options)
        }
    )
}

// 渲染函数
function render (req, res) {

    if (isPro) {

        // 根据url获取缓存页面，如果有缓存就直接返回缓存页面
        // 针对用户点击多次刷新
        const hit = microCache.get(req.url)
        if (hit) return res.send(hit)
        
    }

    // 错误返回
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url)
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found')
        } else {
            res.status(500).send('500 | Internal Server Error')
            console.error(`error during render : ${req.url}`)
        }
    }

    const context = {
        url: req.url,
        cookies: req.cookies
    }
    Object.assign(context, config.template_context)

    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.log(err)
            return handleError(err)
        }
        res.send(html)
    })
}

server.get('*', (req, res) => {
    isPro ? render(req, res)
          : readyPromise.then(() => render(req, res))
})

const port = 8081
server.listen(port, () => {
    console.log(chalk.green(`server started at http://localhost:${port}`))
})