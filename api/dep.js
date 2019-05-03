import uuid from '@/utils/uuid.js';
import cascadeDepList from '@/utils/cascade';

export default function(server, db) {
  const depDB = db.collection('department');

  server.get('/dep', async (req, res, next) => {
    const result = await depDB.find({}).toArray();
    const isCascade = req.query['cascade'];
    res.send(isCascade ? cascadeDepList(result) : result);

    return next();
  });

  server.get(`/dep/:depid`, async (req, res, next) => {
    const isCascade = req.query['cascade'];
    const isUnder = req.query['under'];

    const method = isUnder ? 'find' : 'findOne';
    const cond = isUnder ? '_rel' : '_id';

    let queryResult = depDB[method]({
      [cond]: req.params['depid']
    });

    if (isUnder) {
      queryResult = queryResult.toArray();
    }

    let result = await queryResult;
    res.send(isCascade && isUnder ? cascadeDepList(result) : result);

    return next();
  });

  server.post('/dep', async (req, res, next) => {
    const postDepInfo = req.body;
    postDepInfo._id = uuid();
    postDepInfo._rel.push(postDepInfo._id);
    await depDB.insertOne(postDepInfo);

    res.status(201);
    res.send(postDepInfo);

    return next();
  })

  server.put('/dep/:depid', async (req, res, next) => {
    const dep = req.body;
    const result = await depDB.findOneAndUpdate({ _id: req.params['depid'] || '' }, { $set: dep });
    res.status(result.ok ? 201 : 404);
    res.send(result.ok ? dep : undefined);

    return next();
  })

  server.del('/dep/:depid', async (req, res, next) => {
    await depDB.deleteOne({ _id: req.params['depid'] || '' });
    res.status(204);
    res.send();

    return next();
  })
}