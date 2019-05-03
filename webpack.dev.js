const DefinePlugin = require('webpack/lib/DefinePlugin');
const common = require('./webpack.common.js');
const merge = require('webpack-merge');

const props = {
  SERVER_NAME: 'CFDA-Server',
  SERVER_DOMAIN: 'localhost',
  DEPLOY_HOST: 'localhost',
  SERVER_PORT: '9000',
  MONGODB_HOST: 'mongodb://localhost:27017',
  DB_NAME: 'cfda'
}

Object.entries(props).forEach(([key, value]) => {
  props[key] = JSON.stringify(value);
})

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new DefinePlugin(props)
  ]
})