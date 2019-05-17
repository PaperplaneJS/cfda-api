import uuid from '@/utils/uuid.js';
import ref from '@/utils/ref.js';

export default function(server, db) {
  const bizDB = db.collection('biz');

  server.get('/biz', async (req, res, next) => {
    let result = await bizDB.aggregate(ref(req)).toArray();
    if (req.query['kind']) {
      result = result.filter(t => t.kind === Number(req.query['kind']));
    }
    res.send(result);

    return next();
  });

  server.get(`/biz/:bizid`, async (req, res, next) => {
    const result = await bizDB.aggregate([{
      $match: { _id: req.params['bizid'] }
    }, ...ref(req)]).next();

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