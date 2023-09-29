const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/client/index.js',
    mode: 'development',
    devtool: 'source-map',
    stats: 'verbose',
    resolve: {
      fallback: {
        async_hooks: false,
        net: false,
        zlib: false,
        querystring: false,
        crypto: false,
        fs: false,
        http: false,
        https: false,
        stream: false,
        os: false,
        url: false,
        assert: false,
        buffer: false
      },
    },
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                      },
                  },
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Write Logs to Console
            verbose: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
            new webpack.ContextReplacementPlugin(
              /express[\\/]lib/,
              new RegExp('^\\./.*$')
            ),
                new webpack.DefinePlugin({
                  'process.env': {
                    username: JSON.stringify('lilyp'),
                  },
                }),
    ]
}