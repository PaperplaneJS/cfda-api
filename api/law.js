import uuid from '@/utils/uuid';

export default function(server, db) {
  const lawDB = db.collection('law');

  server.get('/law', async (req, res, next) => {
    const result = await lawDB.find({}, { projection: { content: 0 } }).toArray();
    res.send(result);

    return next();
  });

  server.get(`/law/:lawid`, async (req, res, next) => {
    const result = await lawDB.findOne({ _id: req.params['lawid'] || '' });
    if (!result) {
      res.status(404);
    }
    res.send(result);

    return next();
  });

  server.post('/law', async (req, res, next) => {
    const postLawInfo = req.body;
    postLawInfo._id = uuid();

    await lawDB.insertOne(postLawInfo);
    res.status(201);
    res.send(postLawInfo);

    return next();
  })

  server.put('/law/:lawid', async (req, res, next) => {
    const postLawInfo = req.body;
    const result = await lawDB.findOneAndUpdate({ _id: req.params['lawid'] || '' }, { $set: postLawInfo });
    res.status(result.ok ? 201 : 404);
    res.send(result.ok ? postLawInfo : undefined);

    return next();
  })

  server.del('/law/:lawid', async (req, res, next) => {
    await lawDB.deleteOne({ _id: req.params['lawid'] || '' });
    res.status(204);
    res.send();
    
    return next();
  })
}