const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    output: {
        path: path.resolve(__dirname, '../output/')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['env'],
                    plugins: ['syntax-dynamic-import']
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(jpg|png|svg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'public/image/[name].[ext]'
                }
            },
            {
              test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
              loader: 'url-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            "vue$": "vue/dist/vue.esm.js",
            "@": path.resolve(__dirname, "../src"),
            "~config": path.resolve(__dirname, "../config")
        }
    },
    plugins: [
        new VueLoaderPlugin()
    ]
}
