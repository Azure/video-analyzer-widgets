const { join } = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config');

module.exports = [
    /**
     * npm build
     */
    merge(common, {
        entry: {
            index: [join(__dirname, './npm.export.ts')]
        },
        output: {
            libraryTarget: 'umd'
        }
    }),

    /**
     * CDN build
     */
    merge(common, {
        entry: {
            global: [join(__dirname, './global.export.ts')]
        },
        output: {
            library: {
                type: 'var',
                name: 'ava'
            }
        }
    })
];
