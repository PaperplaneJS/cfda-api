import { resolve } from 'path'
import { str } from '../lib/str.js'

const rootPath = (...args) => resolve(__dirname, `../`, str(...args))
rootPath[Symbol.toPrimitive] = () => resolve(__dirname, `../`)

export const $rootPath = rootPath

export const globalConfig = {}

export const devConfig = {
  SERVER_NAME: 'CFDA-Server',
  SERVER_DOMAIN: 'localhost',
  DEPLOY_HOST: 'localhost',
  SERVER_PORT: '9000',
  MONGODB_HOST: 'mongodb://localhost:27017',
  DB_NAME: 'cfda'
}

export const prodConfig = {
  SERVER_NAME: 'CFDA-Server',
  SERVER_DOMAIN: 'tx.a-c.fun',
  // DEPLOY_HOST: '10.105.116.11',
  DEPLOY_HOST: '0.0.0.0',
  SERVER_PORT: '9000',
  MONGODB_HOST: 'mongodb://localhost:27017',
  DB_NAME: 'cfda'
}

export const isProd = process.env.NODE_ENV === 'production'

export const config = Object.assign({}, globalConfig, isProd ? prodConfig : devConfig)

export default { globalConfig, devConfig, prodConfig, isProd, config, $rootPath }
