let webpack = require('webpack');
let path = require('path');

let env = 'pro'

let plugins = env !== 'dev' ? 
    [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ] : []

module.exports = {
    entry: './src/script/index.js',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: 'bundle.js'

    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"]
                    }
                }
            }
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        publicPath: '/build/',
        compress: false,
        port: 9000
    },
    plugins: plugins
}