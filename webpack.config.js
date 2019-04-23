const path = require('path');
const nodeExternals = require('webpack-node-externals');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const defineConfig = require('./server.config.js');

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
      exclude: /node_modules/,
      use: ['babel-loader']
    }]
  },
  resolve: {
    alias: {
      '@': __dirname
    }
  },
  plugins: [
    new DefinePlugin(defineConfig)
  ]
}