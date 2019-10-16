import { getDb } from '../env/db.js'
import { GET, POST, PUT, DELETE } from '../lib/api.js'
import { uuid } from '../lib/uuid.js'

const lawDB = getDb().collection('law')

export default class {
  @GET('/law')
  async getAllLaw(req, res, next) {
    const result = await lawDB.find({}, { projection: { content: 0 } }).toArray()
    res.send(result)

    return next()
  }

  @GET('/law/:lawid')
  async getSingleLaw(req, res, next) {
    const result = await lawDB.findOne({ _id: req.params['lawid'] || '' })
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  }

  @POST('/law')
  async createLaw(req, res, next) {
    const postLawInfo = req.body
    postLawInfo._id = uuid()

    await lawDB.insertOne(postLawInfo)
    res.status(201)
    res.send(postLawInfo)

    return next()
  }

  @PUT('/law/:lawid')
  async updateLaw(req, res, next) {
    const postLawInfo = req.body
    const result = await lawDB.findOneAndUpdate(
      { _id: req.params['lawid'] || '' },
      { $set: postLawInfo }
    )
    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? postLawInfo : undefined)

    return next()
  }

  @DELETE('/law/:lawid')
  async deleteLaw(req, res, next) {
    await lawDB.deleteOne({ _id: req.params['lawid'] || '' })
    res.status(204)
    res.send()

    return next()
  }
}
