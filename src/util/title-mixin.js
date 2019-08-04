function getTitle(vm) {
    if (vm.$options.parent) {

        // 给每个组件提供一个 title，此 title 是在 router 路由配置里设置
        vm.$options.__proto__.title = function () {
            return vm.$options.parent.$route.meta.title
        }
        const { title } = vm.$options
        
        if (title) {
            return typeof title === 'function'
                ? title.call(vm)
                : title
        }
    }
}

const serverTitleMixin = {
    created() {
        const title = getTitle(this)
        if (title) {
            this.$ssrContext.title = title
        }
    }
}

const clientTitleMixin = {
    mounted() {
        const title = getTitle(this)
        if (title) {
            document.title = title
        }
    }
}

// 可以通过 `webpack.DefinePlugin` 注入 `VUE_ENV`
export default process.env.VUE_ENV === 'server'
    ? serverTitleMixin
    : clientTitleMixin