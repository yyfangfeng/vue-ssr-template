const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

let isPro = process.env.NODE_ENV === 'production'

let config = {
    mode: process.env.NODE_ENV,
    devtool: !isPro && 'source-map',
    entry: [],
    output: {
        path: path.resolve(__dirname, '../dist/'),
        filename: '[name].[hash:5].js'
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
            'process.env.BOM_ENV': '"bom"'
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../template/index.html')
        })
    ]
}

if (isPro) {
    config.entry.push(
        path.resolve(__dirname, '../entry/entry-client.js')
    )
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.BOM_BUILD_ENV': '"bom_prod"'
        }),
        new MiniCssExtractPlugin({
            filename: 'public/css/[name].[hash:5].css'
        }),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, '../static'),
            to: path.resolve(__dirname, '../dist/static')
        }])
    )
} else {
    config.entry.push(
        path.resolve(__dirname, '../entry/entry-client.js'),
        'webpack-hot-middleware/client?reload=true'
    )
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.BOM_BUILD_ENV': '"bom_dev"'
        })
    )
}

module.exports = merge(common, config)