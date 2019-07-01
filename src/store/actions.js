import { getItem } from '@/util/sendRequest'

export default {
    getItem ({ commit }) {
        return getItem().then((item) => {
            commit('setItem', item)
        })
    }
}