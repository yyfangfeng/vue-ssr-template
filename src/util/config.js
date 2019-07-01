let config = require('~config/index')
let api = ''

if (process.env.VUE_ENV === 'server' || process.env.BOM_BUILD_ENV === 'bom_prod') {
    api = config.http
} else {
    api = '/api'
}

export {
    api
}
