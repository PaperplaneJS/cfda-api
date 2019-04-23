const uuid = require('./_uuid');
const sha256 = require('./_sha256');

module.exports = function(server, db) {
  const staffDB = db.collection('staff');

  server.post(`/login`, (req, res, next) => {
    const staff = req.body['staff'] || '';
    const pwd = req.body['pwd'] || '';
    const sha256Pwd = sha256(pwd);

    staffDB.findOne({ name: staff, pwd: sha256Pwd }, { projection: { pwd: 0 } }).then(result => {
      if (result) {
        const staff = result;
        req['cfdaId'].staff = staff._id;
        res.
        res.send(staff);
        staffDB.findOneAndUpdate({ _id: staff._id }, { $set: { lastLogin: new Date().toLocaleString() } });

      } else {
        res.status(401);
        res.send();
      }
    })

    return next();
  });

  server.post(`/auth`, (req, res, next) => {
    const cfdaId = req['cfdaId'].staff;
    if (!cfdaId) {
      res.status(401);
      res.send();
      return next();
    }

    staffDB.findOne({ _id: cfdaId }, { projection: { pwd: 0 } }).then(result => {
      if (result) {
        res.send(result);
        staffDB.findOneAndUpdate({ _id: result._id }, { $set: { lastLogin: new Date().toLocaleString() } });
      } else {
        res.status(401);
        res.send();
      }
    })

    return next();
  });
}