## vue-ssr-template

> 用于开发时快速创建 [**vue-ssr**](https://ssr.vuejs.org/zh/) 项目开发脚手架


* [从零搭建 **vue-ssr** 脚手架](https://github.com/yyfangfeng/Notes/blob/master/%E4%BB%8E%E9%9B%B6%E6%90%AD%E5%BB%BAvue-ssr.md)

<br/>

### Node 版本

```
v10.15.3
```

<br/>

``` bash
# 安装依赖
npm install

# 浏览器渲染开发模式 localhost:8080
npm run dev

# SSR 服务端渲染开发模式 localhost:8081
npm run dev-ssr

# 打包服务端渲染项目，运行项目 localhost:8081
# 与 npm run start-dist 对比查找某些问题
npm run build-ssr
npm start

# 测试打包的 dist 是否能运行 localhost:8081
npm run start-dist

# 打包服务端渲染的客户端文件
npm run build-client

# 打包服务端渲染的服务端文件
npm run build-server

# 打包浏览器端渲染项目
npm run build

# 删除 dist 文件夹
npm run del

# 使用 pm2 运行项目，需要本地已安装 pm2，localhost:8081
npm run pm2
```

<br/>

### 项目目录说明

```
-- vue-ssr

   -- build     // webpack 配置代码

   -- config    // api 设置、静态资源引入

   -- dist      // 打包文件

   -- entry     // 入口文件

   -- src       // 项目代码

        -- assets     // 这里放直接在 vue 文件里引入的文件

        -- router     // 路由文件

        -- store      // vuex 存储

        -- util       // 工具

   -- static    // 静态资源

   -- template  // html 模板

   server.js    // 服务端入口文件
```


<br/>

### 上线部署

**1、** 先使用以下命令，打包出一个 **dist** 文件夹

```bash
$ npm run build
```

<br/>

**2、** 然后可以直接把 **dist** 文件夹放入服务器

<br/>

**3、** 放入服务器后先安装依赖

```bash
$ npm install
```

<br/>

**4、** 安装完后，有两种方法运行，使用 [**pm2**](https://www.npmjs.com/package/pm2)，或者 `node` 启动，（建议使用 [**pm2**](https://www.npmjs.com/package/pm2) 运行）


> 注意：如果需要设置 `pm2` 服务进程名，可以在 **processes.json** 里的 `app` 数组下的 `name` 字段设置

<br/>

* **1、pm2** 启动，要确保本身下载了 **pm2**

> 会出现两个文件夹，**log** 是打印日志，**pids** 是自定义应用程序的 **pid** 文件

```bash
$ npm run pm2
```

* 如果出现 cross-env: command not found

* 说明服务器没有 cross-env 模块，所以需要安装一下 `npm install -g cross-env`

<br/>

* **2、node** 启动
```bash
$ npm start
```

<br/>


### 修改 api 地址

* 在 **config/index.js** 里的 `http` 配置

> `**注意`：修改了 `api` 地址，需要重新编译项目

```javascript
let config = {
    http: 'http://localhost:3001'
    ....
}

module.exports = config
```

<br/>

### 服务端渲染如何引入静态资源

* 因已设置了静态资源目录

```javascript
app.use(express.static(path.resolve(__dirname, '../static')))
```

<br/>

* 再者因为在 **index.template.html** 里写了不转义插值 `{{{ meta }}}`，然后可以 **config/index** 里配置需要引入的静态文件

> 引入静态文件的时候 `href` 里不需要写 `static`

```javascript
// config/index.js

let config = {

    // 修改了 api 地址，需要重新编译项目
    http: 'http://demo.fffsilly.top',

    // html 模板配置，需要引入的静态文件、 title 的配置
    template_context: {
        title: 'vue-ssr-template',
        meta: `<link rel="stylesheet" href="/css/bootstrap.min.css">`
    }
}

```

<br/>



### 浏览器渲染如何引入静态资源

* 因浏览器端渲染打包出来的 **dist** 目录不同于服务端渲染的打包目录，所以设置了如下静态资源目录

```javascript
app.use('/static', express.static(path.resolve(__dirname, '../static')))
```

* 然后需要到 **template/index.html** 里设置引用静态资源

> `** 注意`：引用的 `href` 里需要写成 `./static`

> 因为打包之后的 **dist** 目录下，会有 **static** 静态资源文件夹，所以这样写的话，开发模式和生产模式都可以正确引用静态资源

```html
// template/index.html

<!DOCTYPE html>
<html lang="en">
<head>
    ....

    <link rel="stylesheet" href="./static/css/bootstrap.min.css">

</head>
<body>
    <div id="app"></div>
</body>
</html>
```


<br/>

### 保存用户登录状态步骤

> 用户登录状态需要保存在 `cookie`，后端设置 `cookie`

> 可先在 `store` 里定义 `initToken` 方法，用来保存后端传来的 `cookies`

> `cookies` 只是一个形参，在下面会传进来

```javascript
// store/mutations.js

export default {
    initToken (state, cookies) {

        // 这里是把服务端传来的 cookies 保存到 store 里，方便后续使用
        Vue.set(state, 'cookies', cookies)
    }
    ....
}
```

<br/>

1、首先需要安装引入 **cookie-parser** 模块，用来获取后端传来的 `cookie`

> 因为在服务端渲染的过程中，是先在服务器渲染 `html`，所以会先经过服务器，需要在 `vue-ssr` 入口文件 `server.js` 里加入以下代码来获取后端传来的 `cookies`

```bash
$ npm install cookie-parser --save
```

```javascript
// server.js

const cookieParser = require('cookie-parser')

server.use(cookieParser())
```

2、然后传入 `cookie` 到 `context`，后续使用

```javascript
// server.js
server.get('*', (req, res) => {
    ....
    const context = {
        url: req.url,
        cookies: req.cookies    // 传入 cookies
    }

    renderer.renderToString(context, (err, html) => {
        if (err) {
            console.log(err)
            return handleError(err)
        }
        res.send(html)
    })
    ....
})
```

3、接着到 **entry-server.js** 文件拿到上面传入的 `cookie`

```javascript
// entry-server.js

export default (context) => {
    return new Promise((resolve, reject) => {

        // 获取到传入到 context 的 cookie
        const { cookies } = context
        ....

        // 调用上面写的 initToken 方法，传入 cookies 在方法里存储
        store.commit('initToken', cookies)

        Promise.all(matchedComponents.map((Component) => {
            if (Component.asyncData) {
                return Component.asyncData({
                    store,
                    route: router.currentRoute,
                    cookies: cookies        // 把 cookie 传到每个组件里使用
                })
            }
        })).then(() => {
            ....
        })
    })
}
```

4、然后传入的 `cookies` 可以在 `vue` 组件里的 `asyncData` 预渲染函数里使用

```html
<template>
    <div>
        ....
    </div>
</template>
<script>
export default {
    ....

    // cookie 传进来了
    asyncData ({ store, route, cookies }) {

        // 这里就可以使用传进来的 cookie 来发送请求了

        return store.dispatch('isLogin', cookies)
    },

    ....
}
</script>
<style>
    ....

</style>
```

<br/>

5、然后是客户端发送 `cookie` 的问题

> 客户端设置发送 `cookie` 请求头会报错，所以只需要服务端设置即可

* 因为 `axios` 在客户端环境的时候，默认会自动传 `cookie` 到后端，所以不用作客户端判断操作

* 服务端传 `cookie` 的时候需要模拟客户端的传送格式，`token=123;aaa=xxx` 此类格式，所以使用 `qs` 模块加正则替换字符，来模拟格式，方便后端获取

* 如果不用正则的话，传到后端的格式将会变成 `token=123&aaa=xxx` ，**qs** 模块会把 ; 转义成 &

```javascript
// src/util/ajax.js

....

// 设置允许 axios 设置请求头
axios.defaults.withCredentials = true

const isServer = process.env.VUE_ENV === 'server'

export default (methods, url, json, cookies) => {
    ....

    let headers = {}

    // 服务端渲染的时候，才设置 cookie
    if (isServer) {
        headers.cookie = qs.stringify(cookies).replace(/&/g, ';')
    }

    ....
}

```

> 这样就实现了保存用户登录状态的操作

<br/>

6、实现客户端判断登陆状态

> 主要是在导航守卫代码里添加对登陆状态的判断


* 先在 **router/index.js** 里添加 `is_login` 设置判断登陆状态

```javascript
// router/index.js

....

export function createRouter () {
    let route = new VueRouter({
        ....

        routes: [
            {
                path: '/',
                component: () => import('@/pages/Home'),
                name: 'Home',
                meta: {
                    title: '主页'
                }
            },
            {
                path: '/chat',
                component: () => import('@/pages/Chat'),
                name: 'Chat',
                meta: {
                    title: '聊天',
                    is_login: true      // 设置此页面登录状态判断
                }
            },

            ....
        ]
    })

    return route
}
```

* 然后到 **app.js** 文件里，添加导航守卫代码

> `注意：`如果需要在导航守卫里使用 `window` 对象，必须先判断 `window` 对象是否存在

```javascript
// app.js

....

export function createApp() {
    const router = createRouter()

    ....
    
    // 路由导航守卫
    router.beforeResolve((to, from, next) => {

        // 如需使用 window 对象，必须先判断
        if (typeof window !== 'undefined') {

            // 回到顶部
            window.scrollTo(0, 0)
        }

        // 判断登陆状态
        if (to.meta.is_login) {
            if (store.state.cookies.token) {
                next()
            } else {
                next('/')
            }
        } else {
            next()
        }
    })

    return { app, router, store }
}

....

```

> 现在便实现了客户端切换路由时的登陆状态判断问题

<br/>


### 解决用浏览器端渲染，打包后出现接口请求跨域问题

> 浏览器端渲染指的是用 `npm run build` 打包后直接上传的代码


* 出现跨域问题，需要后端人员去设置 `cors` 白名单和 `cookie` 允许

* `cors` 白名单，例如你想给某个网站设置允许跨域，你就需要输入此网站的域名

```javascript
// 此为 node 后台代码演示

app.all('*', function (req, res, next) {
    ....

    // 允许 cors，但是不可以设置为 *，必须设置你想开放请求权限的指定域名
    res.header('Access-Control-Allow-Origin', 'http://域名')

    // 允许设置 cookie
    res.header("Access-Control-Allow-Credentials", true)
})
```

* 然后把打包出来的 **dist** 项目文件放入服务器，浏览器访问即可


<br/>


### 浏览器端渲染的时候，数据请求返回后如果需要执行某些操作

* 在组件里使用以下方法来获取请求是否已返回

```javascript
// App.vue

....
mounted () {

    // 数据返回后需要执行的操作

    this.dataPromise.then(() => {
        console.log('请求已返回')
    })
}
....

```