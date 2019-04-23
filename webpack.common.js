const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './app.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, './dist')
  },
  target: 'node',
  externals: [
    nodeExternals()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    }]
  },
  resolve: {
    alias: {
      '@': __dirname
    }
  }
}