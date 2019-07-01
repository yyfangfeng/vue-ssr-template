import Vue from 'vue'
import { createApp } from "@/app"

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

const { app, router, store } = createApp()

if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
}

Vue.mixin({

    // 2、跳转路由后，再获取数据：

    beforeMount () {
        // 浏览器渲染的时候才使用，因为在 ssr 渲染下首屏会二次触发请求
        if (process.env.BOM_ENV === 'bom') {
            const { asyncData } = this.$options
            if (asyncData) {
                // 将获取数据操作分配给 promise
                // 以便在组件中，我们可以在数据准备就绪后
                // 通过运行 `this.dataPromise.then(...)` 来执行其他任务
                this.dataPromise = asyncData({
                    store: this.$store,
                    route: this.$route
                })
            }
        }
    },
    // 用于处理，例如，从 user/1 到 user/2 的路由时，也应该调用 asyncData 函数
    beforeRouteUpdate (to, from, next) {
        const { asyncData } = this.$options
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next)
        } else {
            next()
        }
    }
})

// router.beforeEach((to, from, next) => {
//     console.log(to)
//     if (to.meta.isLogin) {
//         if (store.state.cookies.token) {
//             next()
//         } else {
//             next('/container')
//         }
//     }else{
//         next()
//     }
// })

router.onReady(() => {
    
    // 1、解析完数据再跳转路由：

    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。

    if (process.env.BOM_ENV !== 'bom') {
        router.beforeResolve((to, from, next) => {
            const matched = router.getMatchedComponents(to)
            const prevMatched = router.getMatchedComponents(from)
        
            // 我们只关心非预渲染的组件
            // 所以我们对比它们，找出两个匹配列表的差异组件
            let diffed = false
            const activated = matched.filter((c, i) => {
              return diffed || (diffed = (prevMatched[i] !== c))
            })
        
            if (!activated.length) {
              return next()
            }
        
            // 这里如果有加载指示器 (loading indicator)，就触发
            NProgress.start()

            Promise.all(activated.map((c) => {
                if (c.asyncData) {
                    return c.asyncData({ store, route: to })
                }
            })).then(() => {
    
                // 停止加载指示器(loading indicator)
                NProgress.done()
                next()
            }).catch(next)
        })
    }

    app.$mount("#app")
})