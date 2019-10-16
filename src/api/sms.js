import moment from 'moment'
import { getDb } from '../env/db.js'
import { GET, POST } from '../lib/api.js'
import { uuid } from '../lib/uuid.js'

const smsDB = getDb().collection('sms')

export default class {
  @GET('/sms')
  async getAllSms(req, res, next) {
    const staffId = req.session.staff
    const result = await smsDB.find({ post: staffId }).toArray()
    res.send(result)

    return next()
  }

  @GET('/sms/:smsid')
  async getSingleSms(req, res, next) {
    const staffId = req.session.staff

    const result = await smsDB.findOne({ _id: req.params['smsid'], post: staffId })
    if (!result) {
      res.status(404)

      return next()
    }

    if (!result.recive.map(t => t.staff).includes(staffId)) {
      await smsDB.findOneAndUpdate(
        { _id: req.params['smsid'] },
        { $push: { recive: { staff: staffId, date: moment().format('YYYY-MM-DD HH:mm') } } }
      )
    }

    res.send(result)

    return next()
  }

  @POST('/sms')
  async createSms(req, res, next) {
    const postsmsInfo = req.body
    postsmsInfo._id = uuid()

    await smsDB.insertOne(postsmsInfo)
    res.status(201)
    res.send(postsmsInfo)

    return next()
  }
}
