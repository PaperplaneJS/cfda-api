import { getDb } from '../env/db.js'
import { GET, POST, PUT, DELETE } from '../lib/api.js'
import { uuid } from '../lib/uuid.js'
import { ref } from '../lib/ref.js'

const planDB = getDb().collection('plan')

export default class {
  @GET('/plan')
  async getAllPlan(req, res, next) {
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
  }

  @GET('/plan/:planid')
  async getSinglePlan(req, res, next) {
    const cond = {}
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
  }

  @POST('/plan')
  async createPlan(req, res, next) {
    const plan = req.body
    plan._id = uuid()

    await planDB.insertOne(plan)
    res.status(201)
    res.send(plan)

    return next()
  }

  @PUT('/plan/:planid')
  async updatePlan(req, res, next) {
    const plan = req.body
    const result = await planDB.findOneAndUpdate(
      { _id: req.params['planid'] || '' },
      { $set: plan }
    )

    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? plan : undefined)

    return next()
  }

  @DELETE('/plan/:planid')
  async deletePlan(req, res, next) {
    await planDB.deleteOne({ _id: req.params['planid'] || '' })

    res.status(204)
    res.send()

    return next()
  }
}
