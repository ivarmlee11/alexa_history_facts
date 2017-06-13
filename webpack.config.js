const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = ({
  entry: './index.js',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [
      {
        test: /\.js/,
        use: ['babel-loader?cacheDirectory'],
        exclude: /node_modules/
      },
    ],
  }
});