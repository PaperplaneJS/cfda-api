import uuid from '@/utils/uuid.js';

export default function(server, db) {
  const taskDB = db.collection('task');
  const planDB = db.collection('plan');

  server.get(`/plan/:planid/task`, async (req, res, next) => {
    const result = await taskDB.find({ _plan: req.params['planid'] || '' }).toArray();
    res.send(result);

    return next();
  });

  server.get(`/task/:taskid`, async (req, res, next) => {
    const result = await taskDB.findOne({ _id: req.params['taskid'] });
    if (!result) {
      res.status(404);
    }
    res.send(result);

    return next();
  });

  server.post(`/plan/:planid/task`, async (req, res, next) => {
    const planid = req.params['planid'];
    const postTaskInfo = req.body;
    postTaskInfo._id = uuid();
    postTaskInfo._plan = planid;

    await taskDB.insertOne(postTaskInfo);
    let plan = await planDB.findOne({ _id: planid });
    if (plan.state === 4) {
      await planDB.findOneAndUpdate({ _id: planid }, {
        $set: {
          state: 3
        }
      });
    }

    res.status(201);
    res.send(postTaskInfo);

    return next();
  });

  server.put(`/task/:taskid`, async (req, res, next) => {
    const task = req.body;
    const result = await taskDB.findOneAndUpdate({ _id: req.params['taskid'] || '' }, { $set: task });
    res.status(result.ok ? 201 : 404);
    res.send(result.ok ? task : undefined);

    return next();
  });
}