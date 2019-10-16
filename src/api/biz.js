import { getDb } from '../env/db.js'
import { GET, POST, PUT, DELETE } from '../lib/api.js'
import { ref } from '../lib/ref.js'
import { uuid } from '../lib/uuid.js'

const bizDB = getDb().collection('biz')

export default class {
  @GET('/biz')
  async getAllBiz(req, res, next) {
    let result = await bizDB.aggregate(ref(req)).toArray()
    if (req.query['kind']) {
      result = result.filter(t => t.kind === Number(req.query['kind']))
    }
    res.send(result)

    return next()
  }

  @GET('/biz/:bizid')
  async getSingleBiz(req, res, next) {
    const result = await bizDB
      .aggregate([{ $match: { _id: req.params['bizid'] } }, ...ref(req)])
      .next()
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  }

  @POST('/biz')
  async createBiz(req, res, next) {
    const postBizInfo = req.body
    postBizInfo._id = uuid()

    await bizDB.insertOne(postBizInfo)
    res.status(201)
    res.send(postBizInfo)

    return next()
  }

  @PUT('/biz/:bizid')
  async updateBiz(req, res, next) {
    const postBizInfo = req.body
    const result = await bizDB.findOneAndUpdate(
      { _id: req.params['bizid'] || '' },
      { $set: postBizInfo }
    )
    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? postBizInfo : undefined)

    return next()
  }

  @DELETE('/biz/:bizid')
  async deleteBiz(req, res, next) {
    await bizDB.deleteOne({ _id: req.params['bizid'] || '' })
    res.status(204)
    res.send()

    return next()
  }
}
