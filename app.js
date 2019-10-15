import restify from 'restify'
import mongodb from 'mongodb'
import session from 'express-session'
import corsMiddleware from 'restify-cors-middleware'

const mongodbClient = mongodb.MongoClient
const server = restify.createServer({ name: SERVER_NAME })

const cors = corsMiddleware({
  origins: [/.*/],
  credentials: true
})
server.pre(cors.preflight)
server.use(cors.actual)

server.use(restify.plugins.queryParser())
server.use(restify.plugins.bodyParser())

const dbClient = new mongodbClient(MONGODB_HOST, { useNewUrlParser: true })

dbClient.connect().then(async () => {
  const db = dbClient.db(DB_NAME)
  const config = await db.collection('config').findOne({})

  server.use(
    session({
      secret: config.key,
      resave: false,
      saveUninitialized: false,
      cookie: { httpOnly: false, domain: SERVER_DOMAIN }
    })
  )

  server.use(function(req, res, next) {
    const freePath = ['/login', '/auth']

    if (freePath.includes(req.path()) || req.session.staff) {
      return next()
    } else {
      res.status(401)
      res.send()
    }
  })

  const context = require.context('./api/', true, /\.js$/)
  context.keys().forEach(key => {
    console.log('api on:' + key)

    let serverAPI = context(key)
    serverAPI.default(server, db)
  })

  server.listen(SERVER_PORT, DEPLOY_HOST, function() {
    console.log(`server[${server.name}] is open on [${DEPLOY_HOST}:${SERVER_PORT}]`)
  })
})
