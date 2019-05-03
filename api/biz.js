import uuid from '@/utils/uuid.js';

export default function(server, db) {
  const bizDB = db.collection('biz');

  server.get('/biz', async (req, res, next) => {
    const result = await bizDB.find({}).toArray();
    res.send(result);

    return next();
  });

  server.get(`/biz/:bizid`, async (req, res, next) => {
    const result = await bizDB.findOne({ _id: req.params['bizid'] });
    if (!result) {
      res.status(404);
    }
    res.send(result);

    return next();
  });

  server.post('/biz', async (req, res, next) => {
    const postBizInfo = req.body;
    postBizInfo._id = uuid();
    await bizDB.insertOne(postBizInfo);
    res.status(201);
    res.send(postBizInfo);

    return next();
  })

  server.put('/biz/:bizid', async (req, res, next) => {
    const postBizInfo = req.body;
    const result = await bizDB.findOneAndUpdate({ _id: req.params['bizid'] || '' }, { $set: postBizInfo });
    res.status(result.ok ? 201 : 404);
    res.send(result.ok ? postBizInfo : undefined);

    return next();
  })

  server.del('/biz/:bizid', async (req, res, next) => {
    await bizDB.deleteOne({ _id: req.params['bizid'] || '' });
    res.status(204);
    res.send();

    return next();
  })
}