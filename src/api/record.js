import { getDb } from '../env/db.js'
import { GET, POST } from '../lib/api.js'
import { uuid } from '../lib/uuid.js'

const recordDB = getDb().collection('record')
const taskDB = getDb().collection('task')
const planDB = getDb().collection('plan')

export default class {
  @GET('/task/:taskid/record')
  async getRecordByTask(req, res, next) {
    const result = await recordDB.find({ _task: req.params['taskid'] || '' }).toArray()
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  }

  @GET('/task/:taskid/record/:bizid')
  async getBizInRecord(req, res, next) {
    const result = await recordDB.findOne({
      _task: req.params['taskid'] || '',
      _biz: req.params['bizid'] || ''
    })
    res.send(result)

    return next()
  }

  @GET('/record/:recordid')
  async getSingleRecord(req, res, next) {
    const result = await recordDB.find({ _biz: req.params['recordid'] || '' })
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  }

  @POST('/record')
  async createRecord(req, res, next) {
    const postRecordInfo = req.body
    postRecordInfo._id = uuid()

    await recordDB.insertOne(postRecordInfo)
    await taskDB.findOneAndUpdate(
      { _id: postRecordInfo._task },
      {
        $push: { completebiz: postRecordInfo._biz },
        $inc: { 'progress.0': 1 },
        $set: { state: 2 }
      }
    )

    const task = await taskDB.findOne({ _id: postRecordInfo._task })
    if (task.progress[0] >= task.progress[1]) {
      await taskDB.findOneAndUpdate({ _id: postRecordInfo._task }, { $set: { state: 3 } })

      let tasks = await taskDB.find({ _plan: task._plan }).toArray()
      if (tasks.every(t => t.state === 3)) {
        await planDB.findOneAndUpdate({ _id: task._plan }, { $set: { state: 4 } })
      }
    }

    res.status(201)
    res.send(postRecordInfo)

    return next()
  }
}
