let webpack = require('webpack');
let path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const PROD = 'production';
const DEV = 'development';

// let mode = DEV;
let mode = PROD;

let plugins = [
    new ExtractTextPlugin("style.css")
];


if(mode == 'production'){
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
}

module.exports = {
    entry: {
        md: './src/script/md.js'
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: '[name].js'

    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"],
                        cacheDirectory: false
                    }
                }
            },
            {   
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: mode == DEV ? false : true
                        }
                    }]
                })
            },
        ]
    },
    devtool: 'inline-source-map',
    devServer: {
        compress: false,
        publicPath: "/build/",
        port: 9000
    },
    plugins: plugins
}