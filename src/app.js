import Vue from 'vue'
import App from './App.vue'

import { createRouter } from './router/index'
import { createStore } from './store/index'
import { sync } from 'vuex-router-sync'

import titleMixin from './util/title-mixin'

Vue.mixin(titleMixin)

export function createApp() {
    const router = createRouter()
    const store = createStore()

    // 同步路由状态(route state)到 store
    sync(store, router)

    const app = new Vue({
        router,
        store,
        render: h => h(App)
    })

    // 路由导航守卫
    router.beforeResolve((to, from, next) => {

        // 如需使用 window 对象，必须先判断
        if (typeof window !== 'undefined') {

            // 回到顶部
            window.scrollTo(0, 0)
        }

        // 判断登陆状态
        // if (to.meta.is_login) {
        //     if (store.state.cookies.token) {
        //         next()
        //     } else {
        //         next('/')
        //     }
        // } else {
        //     next()
        // }
        next()
    })

    return { app, router, store }
}
