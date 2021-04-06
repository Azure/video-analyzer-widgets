const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// .storybook/main.js

const custom = require('../webpack.config.js');
const path = require('path');
module.exports = {
    core: {
        builder: 'webpack5'
    },
    stories: ['../packages/web-components/src/**/*.stories.@(js|jsx|ts|tsx)', '../stories/**/*.stories.mdx'],
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-controls', '@storybook/addon-postcss']
    // webpackFinal: async (config) => {
    //     config.plugins.push(
    //         new CircularDependencyPlugin({
    //             exclude: /node_modules/,
    //             failOnError: process.env.NODE_ENV === 'production'
    //         }),
    //         new HtmlWebpackPlugin()
    //     );
    //     return {
    //         ...config,
    //         module: {
    //             ...config.module,
    //             rules: custom.module.rules
    //         }
    //     };
    //     config.module.rules.push(
    //         {
    //             test: /\.ts$/,
    //             use: [
    //                 {
    //                     loader: require.resolve('ts-loader')
    //                 }
    //             ]
    //         },
    //         {
    //             test: /\.(css|scss)$/,
    //             use: ['style-loader', 'css-loader', 'sass-loader'],
    //             include: path.resolve(__dirname, '../packages/styles/')
    //         },
    //         {
    //             test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    //             use: [
    //                 {
    //                     loader: require.resolve('url-loader')
    //                 }
    //             ],
    //             include: path.resolve(__dirname, '../packages/styles/')
    //         }
    //         // {
    //         //     test: /\.scss$/,
    //         //     use: ['style-loader', 'css-loader', 'sass-loader'],
    //         //     include: path.resolve(__dirname, '../')
    //         // }
    //     );
    //     config.resolve.extensions.push('.ts');
    //     config.resolve.extensions.push('.js');
    //     config.plugins.push(
    //         new CircularDependencyPlugin({
    //             exclude: /node_modules/,
    //             failOnError: process.env.NODE_ENV === 'production'
    //         }),
    //         new HtmlWebpackPlugin()
    //     );

    //     return config;
    // }
};
