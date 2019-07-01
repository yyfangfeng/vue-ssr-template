import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export function createStore () {
    let store = new Vuex.Store({
        state: {
            cookies: '',    // cookies 存储
            items: []       // 模拟请求的数据存储
        },
        actions,
        mutations
    })

    return store
}