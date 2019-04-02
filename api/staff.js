const uuid = require('./_uuid');
const sha256 = require('./_sha256');

module.exports = function(server, db) {
  const staffDB = db.collection('staff');

  server.get('/staff', (req, res, next) => {
    let cond = {};
    if (req.query['dep']) {
      cond['dep'] = req.query['dep'];
    }

    staffDB.find(cond, { projection: { pwd: 0 } }).toArray().then(result => {
      res.send(result);
    })

    return next();
  });

  server.get(`/staff/:staffid`, (req, res, next) => {
    staffDB.findOne({ _id: req.params['staffid'] }, { projection: { pwd: 0 } }).then(result => {
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
    staff.pwd = sha256(staff.pwd);
    staffDB.insertOne(staff).then(() => {
      res.status(201);
      res.send(staff);
    })

    return next();
  })

  server.put('/staff/:staffid', (req, res, next) => {
    const staff = req.body;
    if (staff.pwd) {
      staff.pwd = sha256(staff.pwd);
    }
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