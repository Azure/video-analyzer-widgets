const path = require('path');
const common = require('./webpack.common.config');
const { merge } = require('webpack-merge');

module.exports = [
    /**
     * npm build
     */
    merge(common, {
        entry: {
            'ava-widgets': [path.join(__dirname, './index.ts')]
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
            global: [path.join(__dirname, './global.export.ts')]
        },
        output: {
            library: {
                type: 'var',
                name: 'ava'
            }
        }
    })
];
