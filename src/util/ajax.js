import { api } from './config'
import axios from 'axios'
import qs from 'qs'

const isServer = process.env.VUE_ENV === 'server'

axios.defaults.withCredentials = true

export default (methods, url, json, cookies) => {
    let Json = json

    let header
    let headers = {}

    if (isServer) {
        headers.cookie = qs.stringify(cookies).replace(/&/g, ';')
    }

    if (methods === 'get' || methods === 'GET') {
        Json = {
            params: json,
            headers
        }
    } else if (methods === 'post' || methods === 'POST') {
        Json = json
        header = {
            headers
        }
    }

    return new Promise((resolve, reject) => {
        axios[methods](api + url, Json, header).then((res) => {
            resolve(res.data)
        }).catch((err) => {
            reject(err)
        })
    })
}