const uuid = require('./_uuid');

module.exports = function(server, db) {
  const bizDB = db.collection('biz');

  server.get('/biz', (req, res, next) => {
    bizDB.find({}).toArray().then(result => {
      res.send(result);
    })

    return next();
  });

  server.get(`/biz/:bizid`, (req, res, next) => {
    bizDB.findOne({ _id: req.params['bizid'] }).then(result => {
      if (result) {
        res.send(result);
      } else {
        res.status(404);
        res.send();
      }
    })

    return next();
  });

  server.post('/biz', (req, res, next) => {
    const biz = req.body;
    biz._id = uuid();
    bizDB.insertOne(biz).then(() => {
      res.status(201);
      res.send(biz);
    })

    return next();
  })

  server.put('/biz/:bizid', (req, res, next) => {
    const biz = req.body;
    delete biz['_id'];
    bizDB.findOneAndUpdate({ _id: req.params['bizid'] || '' }, { $set: biz }).then(result => {
      res.status(result.ok ? 201 : 404);
      res.send(result.ok ? biz : undefined);
    })

    return next();
  })

  server.del('/biz/:bizid', (req, res, next) => {
    bizDB.deleteOne({ _id: req.params['bizid'] || '' }).then(() => {
      res.status(204);
      res.send();
    })

    return next();
  })
}