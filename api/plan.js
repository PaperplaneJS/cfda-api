import uuid from '@/utils/uuid.js'
import ref from '@/utils/ref.js'

export default function(server, db) {
  const planDB = db.collection('plan')

  server.get('/plan', async (req, res, next) => {
    let cond = {}
    if (req.query['kind']) {
      cond['kind'] = req.query['kind']
    }

    let result = await planDB.find(cond).toArray()
    if (req.query['recive']) {
      const depId = req.query['recive']
      result = result.filter(
        plan =>
          plan.state < 4 &&
          plan.post.includes(depId) &&
          !plan.recive.map(t => t.dep).includes(depId)
      )
    }

    if (req.query['posttask']) {
      const depId = req.query['posttask']
      result = result.filter(
        plan => plan.post.includes(depId) && plan.recive.map(t => t.dep).includes(depId)
      )
      if (req.query['action'] === 'post') {
        result = result.filter(plan => plan.state < 4)
      }
    }

    res.send(result)

    return next()
  })

  server.get(`/plan/:planid`, async (req, res, next) => {
    let cond = {}
    cond['_id'] = req.params['planid'] || ''
    if (req.query['kind']) {
      cond['kind'] = req.query['kind']
    }

    const result = await planDB.aggregate([{ $match: cond }, ...ref(req)]).next()
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  })

  server.post('/plan', async (req, res, next) => {
    const plan = req.body
    plan._id = uuid()

    await planDB.insertOne(plan)
    res.status(201)
    res.send(plan)

    return next()
  })

  server.put('/plan/:planid', async (req, res, next) => {
    const plan = req.body
    const result = await planDB.findOneAndUpdate(
      { _id: req.params['planid'] || '' },
      { $set: plan }
    )
    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? plan : undefined)

    return next()
  })

  server.del('/plan/:planid', async (req, res, next) => {
    await planDB.deleteOne({ _id: req.params['planid'] || '' })
    res.status(204)
    res.send()

    return next()
  })
}
