module.exports = function(server, db) {
  const taskDB = db.collection('task');

  server.get(`/plan/:planid/task`, (req, res, next) => {
    taskDB.find({ _plan: req.params['planid'] || '' }).toArray().then(result => {
      res.send(result);
    });

    return next();
  });

  server.get(`/plan/:planid/task/:taskid`, (req, res, next) => {
    taskDB.findOne({ _id: req.params['taskid'], _plan: req.params['planid'] }).then(result => {
      if (result) {
        res.send(result);
      } else {
        res.status(404);
        res.send();
      }
    });

    return next();
  });

  server.post(`/plan/:planid/task`, (req, res, next) => {
    const planid = req.params['planid'];
    const task = req.body;
    task._id = uuid();
    task._plan = planid;

    taskDB.insertOne(task).then(() => {
      res.status(201);
      res.send(task);
    })

    return next();
  });

  server.put(`/plan/:planid/task/:taskid`, (req, res, next) => {
    const task = req.body;
    taskDB.findOneAndUpdate({ _id: req.params['taskid'] || '', _plan: req.params['taskid'] || '' }, { $set: task }).then(result => {
      res.status(result.ok ? 201 : 404);
      res.send(result.ok ? task : undefined);
    })

    return next();
  });

  server.del(`/plan/:planid/task/:taskid`, (req, res, next) => {
    taskDB.deleteOne({ _id: req.params['taskid'] || '', _plan: req.params['taskid'] || '' }).then(() => {
      res.status(204);
      res.send();
    })

    return next();
  });

}