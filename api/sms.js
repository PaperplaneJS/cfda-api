import uuid from '@/utils/uuid.js'
import { datetime } from '@/utils/date.js'

export default function(server, db) {
  const smsDB = db.collection('sms')
  const staffDB = db.collection('staff')

  server.get('/sms', async (req, res, next) => {
    const staffId = req.session.staff
    const result = await smsDB.find({ post: staffId }).toArray()
    res.send(result)

    return next()
  })

  server.get(`/sms/:smsid`, async (req, res, next) => {
    const staffId = req.session.staff
    const result = await smsDB.findOne({ _id: req.params['smsid'], post: staffId })
    if (!result) {
      res.status(404)
    } else {
      if (!result.recive.map(t => t.staff).includes(staffId)) {
        await smsDB.findOneAndUpdate(
          { _id: req.params['smsid'] },
          {
            $push: {
              recive: {
                staff: staffId,
                date: datetime()
              }
            }
          }
        )
      }
    }

    res.send(result)

    return next()
  })

  server.post('/sms', async (req, res, next) => {
    const postsmsInfo = req.body
    postsmsInfo._id = uuid()
    await smsDB.insertOne(postsmsInfo)
    res.status(201)
    res.send(postsmsInfo)

    return next()
  })
}
