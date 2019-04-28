import uuid from '@/utils/uuid';
import sha256 from '@/utils/sha256';

export default function(server, db) {
  const staffDB = db.collection('staff');
  const depDB = db.collection('department');

  server.get('/staff', async (req, res, next) => {
    let cond = {};
    if (req.query['dep']) {
      cond['dep'] = req.query['dep'];
    }
    if (req.query['dep'] && req.query['under']) {
      let deps = await depDB.find({ _rel: req.query['dep'] }).toArray();
      deps = deps.map(t => t._id);

      let result = await staffDB.find({ dep: { $in: deps } }, { projection: { pwd: 0 } }).toArray();
      res.send(result);

    } else {
      const result = await staffDB.find(cond, { projection: { pwd: 0 } }).toArray();
      res.send(result);
    }

    return next();
  });

  server.get(`/staff/:staffid`, async (req, res, next) => {
    const result = await staffDB.findOne({ _id: req.params['staffid'] }, { projection: { pwd: 0 } });
    if (!result) {
      res.status(404);
    }
    res.send(result);

    return next();
  });

  server.post('/staff', async (req, res, next) => {
    const postStaffInfo = req.body;
    postStaffInfo._id = uuid();
    postStaffInfo.pwd = sha256(postStaffInfo.pwd);

    await staffDB.insertOne(postStaffInfo);
    res.status(201);
    res.send(postStaffInfo);

    return next();
  })

  server.put('/staff/:staffid', async (req, res, next) => {
    const staff = req.body;

    let current = await staffDB.findOne({ _id: req.params['staffid'] });
    current = Object.assign(current, staff);

    const result = await staffDB.findOneAndUpdate({ _id: req.params['staffid'] || '' }, { $set: current });
    res.status(result.ok ? 201 : 404);
    res.send(result.ok ? staff : undefined);

    return next();
  })

  server.del('/staff/:staffid', async (req, res, next) => {
    await staffDB.deleteOne({ _id: req.params['staffid'] || '' });
    res.status(204);
    res.send();

    return next();
  })
}