const merge = require("webpack-merge")
const common = require("./webpack.common")
const path = require("path")
const webpack = require('webpack')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

let isPro = process.env.NODE_ENV === 'production'

let config = merge(common, {
    mode: process.env.NODE_ENV,
    target: "node",
    entry: path.resolve(__dirname, "../entry/entry-server.js"),
    output: {
        filename: "bundle-server.js",
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['vue-style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader']
            }
        ]
    },
    externals: Object.keys(require("../package.json").dependencies),
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VUE_ENV': '"server"'
        }),
        new VueSSRServerPlugin({
            filename: 'vue-ssr-server-bundle.json'
        })
    ]
})

if (!isPro) {
    config.devtool = 'source-map'
}

module.exports = config