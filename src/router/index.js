import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('@/pages/Home' /*webpackChunkName: 'Home'*/)
const HelloWorld = () => import('@/pages/HelloWorld' /*webpackChunkName: 'HelloWorld'*/)

Vue.use(VueRouter)

export function createRouter () {
    let route = new VueRouter({
        mode: process.env.BOM_ENV === 'bom'
              ? 'hash'
              : 'history',
        routes: [
            {
                path: '/',
                component: Home,
                name: 'home',
                meta: {
                    title: '首页'
                }
            },
            {
                path: '/helloworld',
                component: HelloWorld,
                name: 'helloworld',
                meta: {
                    title: '欢迎'
                }
            }
        ]
    })

    return route
}