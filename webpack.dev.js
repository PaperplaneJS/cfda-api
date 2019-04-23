const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new DefinePlugin({
      SERVER_NAME: JSON.stringify('CFDA-Server'),
      SERVER_DOMAIN: JSON.stringify('localhost'),
      DEPLOY_HOST: JSON.stringify('localhost'),
      SERVER_PORT: JSON.stringify('9000'),
      MONGODB_HOST: JSON.stringify('mongodb://localhost:27017'),
      DB_NAME: JSON.stringify('cfda')
    })
  ]
})