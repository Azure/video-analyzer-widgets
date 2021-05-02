const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    stories: [
        '../packages/web-components/src/**/*.stories.@(js|jsx|ts|tsx)',
        '../stories/**/*.stories.mdx',
        '../packages/widgets/src/**/*.stories.@(js|jsx|ts|tsx)'
    ],
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
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: require.resolve('url-loader'),
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
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
