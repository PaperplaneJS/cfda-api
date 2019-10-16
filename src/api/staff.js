import { getDb } from '../env/db.js'
import { GET, POST, PUT, DELETE } from '../lib/api.js'
import { sha256 } from '../lib/hash.js'
import { uuid } from '../lib/uuid.js'

const staffDB = getDb().collection('staff')
const depDB = getDb().collection('dep')

export default class {
  @GET('/staff')
  async getAllStaff(req, res, next) {
    let cond = {}
    if (req.query['dep']) {
      cond['dep'] = req.query['dep']
    }
    if (req.query['dep'] && req.query['under']) {
      let deps = await depDB.find({ _rel: req.query['dep'] }).toArray()
      deps = deps.map(t => t._id)

      res.send(await staffDB.find({ dep: { $in: deps } }, { projection: { pwd: 0 } }).toArray())
    } else {
      res.send(await staffDB.find(cond, { projection: { pwd: 0 } }).toArray())
    }

    return next()
  }

  @GET('/staff/:staffid')
  async getSingleStaff(req, res, next) {
    const result = await staffDB.findOne({ _id: req.params['staffid'] }, { projection: { pwd: 0 } })
    if (!result) {
      res.status(404)
    }
    res.send(result)

    return next()
  }

  @POST('/staff')
  async createStaff(req, res, next) {
    const postStaffInfo = req.body
    postStaffInfo._id = uuid()
    postStaffInfo.pwd = sha256(postStaffInfo.pwd)

    await staffDB.insertOne(postStaffInfo)
    res.status(201)
    res.send(postStaffInfo)

    return next()
  }

  @PUT('/staff/:staffid')
  async updateStaff(req, res, next) {
    const staff = req.body

    let current = await staffDB.findOne({ _id: req.params['staffid'] })
    current = Object.assign(current, staff)

    const result = await staffDB.findOneAndUpdate(
      { _id: req.params['staffid'] || '' },
      { $set: current }
    )
    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? staff : undefined)

    return next()
  }

  @DELETE('/staff/:staffid')
  async deleteStaff(req, res, next) {
    await staffDB.deleteOne({ _id: req.params['staffid'] || '' })
    res.status(204)
    res.send()

    return next()
  }
}
