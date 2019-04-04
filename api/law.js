module.exports = function(server, db) {
  const lawDB = db.collection('law');

  server.get('/law', (req, res, next) => {
    lawDB.find({}, { projection: { content: 0 } }).toArray().then(result => {
      res.send(result);
    });

    return next();
  });

  server.get(`/law/:lawid`, (req, res, next) => {
    lawDB.findOne({ _id: req.params['lawid'] || '' }).then(result => {
      if (result) {
        res.send(result);
      } else {
        res.status(404);
        res.send();
      }
    });

    return next();
  });

  server.post('/law', (req, res, next) => {
    const law = req.body;
    law._id = uuid();
    lawDB.insertOne(law).then(() => {
      res.status(201);
      res.send(law);
    })

    return next();
  })

  server.put('/law/:lawid', (req, res, next) => {
    const law = req.body;
    lawDB.findOneAndUpdate({ _id: law.params['lawid'] || '' }, { $set: law }).then(result => {
      res.status(result.ok ? 201 : 404);
      res.send(result.ok ? law : undefined);
    })

    return next();
  })

  server.del('/law/:lawid', (req, res, next) => {
    lawDB.deleteOne({ _id: req.params['lawid'] || '' }).then(() => {
      res.status(204);
      res.send();
    })

    return next();
  })
}