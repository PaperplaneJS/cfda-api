import sha256 from '@/utils/sha256.js';
import { datetime } from '@/utils/date.js';

export default function(server, db) {
  const staffDB = db.collection('staff');

  server.post(`/login`, (req, res, next) => {
    const staffName = req.body['staff'] || '';
    const sha256Pwd = sha256(req.body['pwd'] || '');

    staffDB.findOne({ name: staffName, pwd: sha256Pwd }, { projection: { pwd: 0 } }).then(result => {
      if (result) {
        const staff = result;
        req.session.staff = staff._id;
        res.send(staff);

        staffDB.findOneAndUpdate({ _id: staff._id }, { $set: { lastLogin: datetime() } });

      } else {
        res.status(401);
        res.send();
      }
    })

    return next();
  });

  server.post(`/auth`, (req, res, next) => {
    const staffId = req.session.staff;
    if (!staffId) {

      res.status(401);
      res.send();

      return next();
    }

    staffDB.findOne({ _id: staffId }, { projection: { pwd: 0 } }).then(result => {
      if (result) {
        res.send(result);
        staffDB.findOneAndUpdate({ _id: result._id }, { $set: { lastLogin: datetime() } });
      } else {
        res.status(401);
        res.send();
      }
    })

    return next();
  });
}