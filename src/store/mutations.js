import Vue from 'vue'

export default {
    // 存储 token
    initToken (state, cookies) {
        Vue.set(state, 'cookies', cookies)
    },
    setItem (state, item) {
        Vue.set(state, 'items', item)
    }
}