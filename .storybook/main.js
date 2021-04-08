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
    addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-controls'],
    webpackFinal: async (config) => {
        config.module.rules.push(
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: require.resolve('ts-loader')
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: require.resolve('style-loader')
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: require.resolve('css-loader')
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    {
                        loader: require.resolve('sass-loader')
                    }
                ]
            }
        );
        config.resolve.extensions.push('.ts');
        config.resolve.extensions.push('.js');
        config.plugins.push(
            new CircularDependencyPlugin({
                exclude: /node_modules/,
                failOnError: process.env.NODE_ENV === 'production'
            })
        );

        return config;
    }
};
