import moment from 'moment'
import { getDb } from '../env/db.js'
import { POST } from '../lib/api.js'
import { sha256 } from '../lib/hash.js'

const staffDB = getDb().collection('staff')

export default class {
  @POST('/login')
  async login(req, res, next) {
    const staffName = req.body['staff'] || ''
    const sha256Pwd = sha256(req.body['pwd'] || '')

    const result = await staffDB.findOne(
      { name: staffName, pwd: sha256Pwd },
      { projection: { pwd: 0 } }
    )

    if (result) {
      const staff = result
      req.session.staff = staff._id
      res.send(staff)

      staffDB.findOneAndUpdate(
        { _id: staff._id },
        { $set: { lastLogin: moment().format('YYYY-MM-DD HH:mm') } }
      )
    } else {
      res.status(401)
      res.send()
    }

    return next()
  }

  @POST('/auth')
  async auth(req, res, next) {
    const staffId = req.session.staff
    if (!staffId) {
      res.status(401)
      res.send()

      return next()
    }

    const result = await staffDB.findOne({ _id: staffId }, { projection: { pwd: 0 } })
    if (result) {
      res.send(result)
      staffDB.findOneAndUpdate(
        { _id: result._id },
        { $set: { lastLogin: moment().format('YYYY-MM-DD HH:mm') } }
      )
    } else {
      res.status(401)
      res.send()
    }

    return next()
  }
}
