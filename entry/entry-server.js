import { createApp } from '@/app'

export default (context) => {
    return new Promise((resolve, reject) => {
        const { cookies } = context
        const { app, router, store } = createApp()

        router.push(context.url)

        router.onReady(() => {
            const matchedComponents = router.getMatchedComponents()
    
            if (!matchedComponents.length) {
                return reject("没有此页面")
            }

            // 存储 token
            store.commit('initToken', cookies)

            Promise.all(matchedComponents.map((Component) => {
                if (Component.asyncData) {
                    return Component.asyncData({
                        store,
                        route: router.currentRoute,
                        cookies: cookies
                    })
                }
            })).then(() => {
                context.state = store.state
                resolve(app)
            }).catch(reject)
    
        }, reject)


        // 路由导航守卫
        // router.beforeResolve((to, from, next) => {

        //     // 判断登陆状态
        //     if (to.meta.is_login) {
        //         if (store.state.cookies.token) {
        //             next()
        //         } else {
        //             next('/')
        //         }
        //     } else {
        //         next()
        //     }
        // })
    })
}