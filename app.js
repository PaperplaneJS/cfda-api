const restify = require('restify');
const mongodbClient = require('mongodb').MongoClient;
const session = require('express-session');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({ name: SERVER_NAME });

const cors = corsMiddleware({
  origins: [/.*/],
  credentials: true
});
server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const dbClient = new mongodbClient(MONGODB_HOST, { useNewUrlParser: true });

dbClient.connect().then(() => {
  const db = dbClient.db(DB_NAME);
  db.collection('config').findOne({}).then(config => {
    server.use(session({
      secret: config.key,
      resave: false,
      saveUninitialized: true,
      cookie: { httpOnly: false, domain: `.${SERVER_DOMAIN}` }
    }))

    server.use(function(req, res, next) {
      const freePath = ['/login', '/auth'];

      if (freePath.includes(req.path()) || req.session.staff) {
        return next()

      } else {
        res.status(401);
        res.send();
      }
    })

    const context = require.context('./api/', true, /\.js$/);
    context.keys().forEach(key => {
      console.log('api on:' + key);

      let s = context(key);
      s(server, db);
    })

    server.listen(SERVER_PORT, SERVER_DOMAIN, function() {
      console.log(`server[${server.name}] is open on [${SERVER_DOMAIN}:${SERVER_PORT}]`);
    })
  })
})