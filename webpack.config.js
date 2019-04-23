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
  mode: 'production',
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader']
    }]
  },
  resolve: {
    alias: {
      '@': __dirname
    }
  }
}