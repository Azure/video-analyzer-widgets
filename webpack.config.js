const path = require('path');
const isProduction = process.argv.indexOf('--mode=production') > -1;
const esLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    mode: isProduction ? 'production' : 'development',
    entry: {
        'ava-widgets': [path.join(__dirname, './index.ts')]
    },
    devtool: isProduction ? false : 'inline-source-map',
    output: {
        filename: isProduction ? '[name].min.js' : '[name].js',
        path: path.join(__dirname, './dist'),
        sourceMapFilename: '[name].js.map',
        publicPath: './dist',
        libraryTarget: 'umd'
    },
    optimization: {
        minimize: isProduction
    },
    plugins: [
        new esLintPlugin({
            failOnError: true
        })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['packages', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(css|scss)$/,
                loader: 'style-loader'
            },
            {
                test: /\.(css|scss)$/,
                loader: 'css-loader'
            },
            {
                test: /\.(css|scss)$/,
                loader: 'sass-loader'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }
        ]
    }
};
