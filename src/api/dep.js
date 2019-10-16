import { getDb } from '../env/db.js'
import { GET, POST, PUT, DELETE } from '../lib/api.js'
import { uuid } from '../lib/uuid.js'
import { cascade } from '../lib/cascade.js'

const depDB = getDb().collection('dep')

export default class {
  @GET('/dep')
  async getAllDep(req, res, next) {
    const result = await depDB.find({}).toArray()
    const isCascade = req.query['cascade']
    res.send(isCascade ? cascade(result) : result)

    return next()
  }

  @GET('/dep/:depid')
  async getSingleDep(req, res, next) {
    const isCascade = req.query['cascade']
    const isUnder = req.query['under']

    const method = isUnder ? 'find' : 'findOne'
    const cond = isUnder ? '_rel' : '_id'

    let queryResult = depDB[method]({
      [cond]: req.params['depid']
    })

    if (isUnder) {
      queryResult = queryResult.toArray()
    }

    const result = await queryResult
    res.send(isCascade && isUnder ? cascade(result) : result)

    return next()
  }

  @POST('/dep')
  async createDep(req, res, next) {
    const postDepInfo = req.body
    postDepInfo._id = uuid()
    postDepInfo._rel.push(postDepInfo._id)

    await depDB.insertOne(postDepInfo)
    res.status(201)
    res.send(postDepInfo)

    return next()
  }

  @PUT('/dep/:depid')
  async updateDep(req, res, next) {
    const dep = req.body
    const result = await depDB.findOneAndUpdate({ _id: req.params['depid'] || '' }, { $set: dep })
    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? dep : undefined)

    return next()
  }

  @DELETE('/dep/:depid')
  async deleteDep(req, res, next) {
    await depDB.deleteOne({ _id: req.params['depid'] || '' })
    res.status(204)
    res.send()

    return next()
  }
}
