import { getDb } from '../env/db.js'
import { GET, POST } from '../lib/api.js'
import { uuid } from '../lib/uuid.js'

const riskDB = getDb().collection('risk')

export default class {
  @GET('/risk')
  async getAllRisk(req, res, next) {
    let cond = {}
    if (req.query['year']) {
      cond['year'] = Number(req.query['year'])
    }
    const result = await riskDB.find(cond).toArray()
    res.send(result)

    return next()
  }

  @GET('/risk/:bizid')
  async getSingleRisk(req, res, next) {
    let cond = { _biz: req.params['bizid'] }
    if (req.query['year']) {
      cond['year'] = Number(req.query['year'])
    }
    if (req.query['plan']) {
      cond['_plan'] = req.query['plan']
    }
    const result = await riskDB.findOne(cond)
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  }

  @POST('/risk')
  async createRisk(req, res, next) {
    const postRiskInfo = req.body
    postRiskInfo._id = uuid()

    await riskDB.insertOne(postRiskInfo)
    res.send(postRiskInfo)

    return next()
  }
}
