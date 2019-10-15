const DefinePlugin = require('webpack/lib/DefinePlugin')
const common = require('./webpack.common.js')
const merge = require('webpack-merge')

const props = {
  SERVER_NAME: 'CFDA-Server',
  SERVER_DOMAIN: 'tx.a-c.fun',
  // DEPLOY_HOST: '10.105.116.11',
  DEPLOY_HOST: '0.0.0.0',
  SERVER_PORT: '9000',
  MONGODB_HOST: 'mongodb://localhost:27017',
  DB_NAME: 'cfda'
}

Object.entries(props).forEach(([key, value]) => {
  props[key] = JSON.stringify(value)
})

module.exports = merge(common, {
  mode: 'production',
  plugins: [new DefinePlugin(props)]
})
