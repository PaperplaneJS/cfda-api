const uuid = require('./_uuid');

module.exports = function(server, db) {
  const staffDB = db.collection('staff');

  server.get('/staff', (req, res, next) => {
    staffDB.find({}).toArray().then(result => {
      res.send(result);
    })

    return next();
  });

  server.get(`/staff/:staffid`, (req, res, next) => {
    staffDB.findOne({ _id: req.params['staffid'] }).then(result => {
      if (result) {
        res.send(result);
      } else {
        res.status(404);
        res.send();
      }
    })

    return next();
  });

  server.post('/staff', (req, res, next) => {
    const staff = req.body;
    staff._id = uuid();
    staffDB.insertOne(staff).then(() => {
      res.status(201);
      res.send(staff);
    })

    return next();
  })

  server.put('/staff/:staffid', (req, res, next) => {
    const staff = req.body;
    delete staff['_id'];
    staffDB.findOneAndUpdate({ _id: req.params['staffid'] || '' }, { $set: staff }).then(result => {
      res.status(result.ok ? 201 : 404);
      res.send(result.ok ? biz : undefined);
    })

    return next();
  })

  server.del('/staff/:staffid', (req, res, next) => {
    staffDB.deleteOne({ _id: req.params['staffid'] || '' }).then(() => {
      res.status(204);
      res.send();
    })

    return next();
  })
}