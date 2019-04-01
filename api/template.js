module.exports = function(server, db) {
  const templateDB = db.collection('template');

  server.get('/template', (req, res, next) => {
    templateDB.find({}).toArray().then(result => {
      res.send(result);
    });

    return next();
  });

  server.get(`/template/:templateid`, (req, res, next) => {
    templateDB.findOne({ _id: req.params['templateid'] }).then(result => {
      res.send(result);
    });

    return next();
  });

  server.post('/template', (req, res, next) => {
    const template = req.body;
    template._id = uuid();
    templateDB.insertOne(template).then(() => {
      res.status(201);
      res.send(template);
    })

    return next();
  })

  server.put('/template/:templateid', (req, res, next) => {
    const template = req.body;
    delete template['_id'];
    templateDB.findOneAndUpdate({ _id: req.params['templateid'] || '' }, { $set: template }).then(result => {
      res.status(result.ok ? 201 : 404);
      res.send(result.ok ? template : undefined);
    })

    return next();
  })

  server.del('/template/:templateid', (req, res, next) => {
    templateDB.deleteOne({ _id: req.params['templateid'] || '' }).then(() => {
      res.status(204);
      res.send();
    })

    return next();
  })
}