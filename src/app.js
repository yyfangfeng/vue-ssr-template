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

    return { app, router, store }
}
