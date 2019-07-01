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
    })
}