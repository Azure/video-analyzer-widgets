var path = require('path');
var isProduction = process.argv.indexOf('--env=production') > -1;

module.exports = {
  entry: {
    AVA_SDK: path.join(__dirname, './index.ts')
  },
  devtool: 'inline-source-map',
  output: {
    filename: isProduction ? `[name].min.js` : '[name].js',
    path: path.join(__dirname, './dist'),
    sourceMapFilename: '[name].js.map',
    publicPath: './dist'
  },
  optimization: {
    minimize: false
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        enforce: 'pre',
        use: [
          {
            loader: 'tslint-loader',
            options: {
              failOnHint: true
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(ts|js)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};
