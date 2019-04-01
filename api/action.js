const uuid = require('./_uuid');
const crypto = require('crypto');

function getSHA256(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}

module.exports = function(server, db) {
  const staffDB = db.collection('staff');

  server.post(`/login`, (req, res, next) => {
    const staff = req.body['staff'] || '';
    const pwd = req.body['pwd'] || '';
    const sha256Pwd = getSHA256(pwd);

    staffDB.findOne({ name: staff, pwd: sha256Pwd }).then(result => {
      if (result) {
        const staff = result;
        req['cfdaId'].staff = staff._id;
        res.send(staff);
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

    staffDB.findOne({ _id: cfdaId }).then(result => {
      if (result) {
        res.send(result);
      } else {
        res.status(401);
        res.send();
      }
    })

    return next();
  });
}