import ajax from './ajax'

/**
 * 真实请求可使用 ajax 封装函数调用方式，请求参数为 json
 * let name = (json) => ajax('get', '/api', json)
 * 
 * 需要传 cookies 的请求，比如登录状态权限请求
 * let name = (json, cookies) => ajax('get', '/api', json, cookies)
 */

// 模拟 ajax 请求
let getItem = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(['asdas', 'asd', 'asd'])
        }, 500)
    })
}

export {
    getItem
}