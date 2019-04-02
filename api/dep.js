const uuid = require('./_uuid');

function cascadeDepList(deps) {
  function handleCascade(parent, deep = 0) {
    const children = deps.filter(dep =>
      dep._rel.length === parent._rel.length + 1 && dep._rel[deep] === parent._id
    );
    if (children.length > 0) {
      parent.children = children;
      parent.children.forEach(t => handleCascade(t, deep + 1));
    }
  };

  const cascade = deps.filter(dep => dep._rel.length <= 1);
  deps.forEach(t => handleCascade(t));

  return cascade;
}

module.exports = function(server, db) {
  const depDB = db.collection('department');

  server.get('/dep', (req, res, next) => {
    depDB.find({}).toArray().then(result => {
      const isCascade = req.query['type'] && req.query['type'] === 'cascade'
      res.send(isCascade ? cascadeDepList(result) : result);
    })

    return next();
  });

  server.get(`/dep/:depid`, (req, res, next) => {
    depDB.findOne({ _id: req.params['depid'] || '' }).then(result => {
      if (result) {
        res.send(result);
      } else {
        res.status(404);
        res.send();
      }
    });

    return next();
  });

  server.post('/dep', (req, res, next) => {
    const dep = req.body;
    dep._id = uuid();
    dep._rel.push(dep._id);
    depDB.insertOne(dep).then(() => {
      res.status(201);
      res.send(dep);
    })

    return next();
  })

  server.put('/dep/:depid', (req, res, next) => {
    const dep = req.body;
    depDB.findOneAndUpdate({ _id: req.params['depid'] || '' }, { $set: dep }).then(result => {
      res.status(result.ok ? 201 : 404);
      res.send(result.ok ? dep : undefined);
    })

    return next();
  })

  server.del('/dep/:depid', (req, res, next) => {
    depDB.deleteOne({ _id: req.params['depid'] || '' }).then(() => {
      res.status(204);
      res.send();
    })

    return next();
  })
}