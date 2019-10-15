import uuid from '@/utils/uuid.js'

export default function(server, db) {
  const recordDB = db.collection('record')
  const taskDB = db.collection('task')
  const planDB = db.collection('plan')

  server.get(`/task/:taskid/record`, async (req, res, next) => {
    const result = await recordDB.find({ _task: req.params['taskid'] || '' }).toArray()
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  })

  server.get(`/task/:taskid/record/:bizid`, async (req, res, next) => {
    const result = await recordDB.findOne({
      _task: req.params['taskid'] || '',
      _biz: req.params['bizid'] || ''
    })
    res.send(result)

    return next()
  })

  server.get(`/record/:recordid`, async (req, res, next) => {
    const result = await recordDB.find({ _biz: req.params['recordid'] || '' })
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  })

  server.post(`/record`, async (req, res, next) => {
    const postRecordInfo = req.body
    postRecordInfo._id = uuid()

    await recordDB.insertOne(postRecordInfo)
    await taskDB.findOneAndUpdate(
      { _id: postRecordInfo._task },
      {
        $push: {
          completebiz: postRecordInfo._biz
        },
        $inc: {
          'progress.0': 1
        },
        $set: {
          state: 2
        }
      }
    )
    let task = await taskDB.findOne({ _id: postRecordInfo._task })
    if (task.progress[0] >= task.progress[1]) {
      await taskDB.findOneAndUpdate(
        { _id: postRecordInfo._task },
        {
          $set: {
            state: 3
          }
        }
      )

      let tasks = await taskDB.find({ _plan: task._plan }).toArray()
      if (tasks.every(t => t.state === 3)) {
        await planDB.findOneAndUpdate(
          { _id: task._plan },
          {
            $set: {
              state: 4
            }
          }
        )
      }
    }

    res.status(201)
    res.send(postRecordInfo)

    return next()
  })
}
