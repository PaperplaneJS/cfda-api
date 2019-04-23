const uuid = require('@/utils/uuid');

module.exports =  function(server, db) {
  const planDB = db.collection('plan');

  server.get('/plan', (req, res, next) => {
    let cond = {};
    if (req.query['kind']) {
      cond['kind'] = req.query['kind'];
    }

    planDB.find(cond).toArray().then(result => {
      res.send(result);
    });

    return next();
  });

  server.get(`/plan/:planid`, (req, res, next) => {
    let cond = {};
    cond['_id'] = req.params['planid'] || '';
    if (req.query['kind']) {
      cond['kind'] = req.query['kind'];
    }

    planDB.findOne(cond).then(result => {
      if (result) {
        res.send(result);
      } else {
        res.status(404);
        res.send();
      }
    });

    return next();
  });

  server.post('/plan', (req, res, next) => {
    const plan = req.body;
    plan._id = uuid();
    planDB.insertOne(plan).then(() => {
      res.status(201);
      res.send(plan);
    })

    return next();
  })

  server.put('/plan/:planid', (req, res, next) => {
    const plan = req.body;
    planDB.findOneAndUpdate({ _id: req.params['planid'] || '' }, { $set: plan }).then(result => {
      res.status(result.ok ? 201 : 404);
      res.send(result.ok ? plan : undefined);
    })

    return next();
  })

  server.del('/plan/:planid', (req, res, next) => {
    planDB.deleteOne({ _id: req.params['planid'] || '' }).then(() => {
      res.status(204);
      res.send();
    })

    return next();
  })
}