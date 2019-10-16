import { getDb } from '../env/db.js'
import { GET, POST, PUT, DELETE } from '../lib/api.js'
import { uuid } from '../lib/uuid.js'

const templateDB = getDb().collection('template')

export default class {
  @GET('/template')
  async getAllTemplate(req, res, next) {
    const result = await templateDB.find({}, { projection: { content: 0 } }).toArray()
    res.send(result)

    return next()
  }

  @GET('/template/:templateid')
  async getSingleTemplate(req, res, next) {
    const result = await templateDB.findOne({ _id: req.params['templateid'] })
    res.send(result)

    return next()
  }

  @POST('/template')
  async createTemplate(req, res, next) {
    const postTemplateInfo = req.body
    postTemplateInfo._id = uuid()

    await templateDB.insertOne(postTemplateInfo)
    res.status(201)
    res.send(postTemplateInfo)

    return next()
  }

  @PUT('/template/:templateid')
  async updateTemplate(req, res, next) {
    const template = req.body
    const result = await templateDB.findOneAndUpdate(
      { _id: req.params['templateid'] || '' },
      { $set: template }
    )
    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? template : undefined)

    return next()
  }

  @DELETE('/template/:templateid')
  async deleteTemplate(req, res, next) {
    await templateDB.deleteOne({ _id: req.params['templateid'] || '' })
    res.status(204)
    res.send()

    return next()
  }
}
