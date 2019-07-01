const merge = require("webpack-merge")
const common = require("./webpack.common")
const path = require("path")
const webpack = require('webpack')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let isPro = process.env.NODE_ENV === 'production'

let config = merge(common, {
    mode: process.env.NODE_ENV,
    entry: {
        app: path.resolve(__dirname, "../entry/entry-client.js")
    },
    output: {
        filename: "[name].[hash:5].js",
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: isPro
                    ? [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader'
                    ]
                    : ['vue-style-loader?sourceMap', 'css-loader?sourceMap', 'sass-loader?sourceMap']
            },
            {
                test: /\.css$/,
                use: isPro
                    ? [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                    : ['vue-style-loader?sourceMap', 'css-loader?sourceMap']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VUE_ENV': '"client"'
        }),
        new MiniCssExtractPlugin({
            filename: 'public/css/[name].[hash:7].css'
        }),
        new VueSSRClientPlugin({
            filename: 'vue-ssr-client-manifest.json'
        })
    ]
})

if (!isPro) {
    config.devtool = 'source-map'
}

module.exports = config