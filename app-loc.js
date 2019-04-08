const path = require('path');
const fs = require('fs');
const restify = require('restify');
const mongodbClient = require('mongodb').MongoClient;
const sessions = require('client-sessions');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({ name: "cfda_ser" });

const cors = corsMiddleware({
  origins: ['http://127.0.0.1:8080', 'http://localhost:8080'],
  credentials: true
});
server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

const dbClient = new mongodbClient('mongodb://localhost:27017', { useNewUrlParser: true });

dbClient.connect().then(() => {
  const db = dbClient.db('cfda');

  db.collection('config').findOne({}).then(result => {
    server.use(sessions({
      cookieName: 'cfdaId',
      secret: result.key,
      duration: 20 * 60 * 1000,
      activeDuration: 20 * 60 * 1000,
      cookie: {
        httpOnly: false
      }
    }))

    server.use(function(req, res, next) {
      let freePath = ['/login', '/auth'];
      if (!freePath.includes(req.path()) && !req['cfdaId'].staff) {
        res.status(401);
        res.send();
      } else {
        return next()
      }
    })

    initPath('api');

    server.listen('9000', 'localhost', function() {
      console.log('%s begin.', server.name);
    })

    function initPath(dir) {
      fs.readdirSync(path.join(__dirname, dir)).forEach(item => {
        let isDir = fs.statSync(path.join(__dirname, dir, item)).isDirectory();
        if (isDir) {
          initPath(path.join(dir, item))
        } else if (!item.startsWith('_') && item.endsWith('.js')) {
          require(path.join(__dirname, dir, item))(server, db);
        }
      });
    }
  })
})