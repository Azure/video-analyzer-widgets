const path = require('path');
const isProduction = process.argv.indexOf('--env=production') > -1;
const esLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    entry: {
        'ava-widgets-sdk': path.join(__dirname, './index.ts')
    },
    devtool: 'inline-source-map',
    output: {
        filename: isProduction ? `[name].min.js` : '[name].js',
        // path: path.join(__dirname, './dist'),
        sourceMapFilename: '[name].js.map',
        publicPath: './dist'
    },
    optimization: {
        minimize: false
    },
    plugins: [
        new esLintPlugin({
            failOnError: true
        })
    ],
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    }
};
