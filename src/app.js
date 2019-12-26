import { createServer, plugins } from 'restify'
import { readdirSync } from 'fs'
import session from 'express-session'
import corsMiddleware from 'restify-cors-middleware'
import { dbConnect, getDb } from './env/db.js'
import { config, $rootPath } from './env/env.js'
import { $getApiList } from './lib/api.js'
import nunjucks from 'nunjucks'

const { SERVER_NAME, SERVER_DOMAIN, SERVER_PORT, DEPLOY_HOST } = config

const server = createServer({ name: SERVER_NAME })
const { preflight, actual } = corsMiddleware({
  origins: [/.*/],
  credentials: true
})

server.pre(preflight)
server.use(actual)
server.use(plugins.queryParser())
server.use(plugins.bodyParser())

!(async () => {
  await dbConnect()
  const db = getDb()
  const { key } = await db.collection('config').findOne({})

  server.use(
    session({
      secret: key,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: false, domain: SERVER_DOMAIN }
    })
  )

  server.use((req, res, next) => {
    const freePath = ['/', '/login', '/auth']
    if (freePath.includes(req.path()) || req.session.staff) {
      return next()
    } else {
      res.status(401)
      res.send()
    }
  })

  for (const fileName of readdirSync($rootPath`api`)) {
    await import(`./api/${fileName}`)
    console.log(`接口[${fileName}]已加载.`)
  }

  const apiList = $getApiList()
  apiList.forEach(apiItem => {
    server[apiItem.method](apiItem.path, apiItem.func)
  })

  nunjucks.configure($rootPath`template`, { autoescape: true, noCache: true })
  server.get('/', (req, res, next) => {
    res.sendRaw(nunjucks.render(`home.njk`, { apiList: apiList }))
    return next()
  })

  server.listen(SERVER_PORT, DEPLOY_HOST, () => {
    console.log(`服务器[${server.name}]已经于[${DEPLOY_HOST}:${SERVER_PORT}]成功开启.`)
  })
})()
