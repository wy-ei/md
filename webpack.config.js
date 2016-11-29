var webpack = require('webpack');

module.exports = {
    entry: {
        app: 'src/script/app.js'
    },
    output: {
        path: 'build/',
        filename: '[name].js'
    },
    resolve: {
        root: __dirname
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: true
            }
        })
    ]
}