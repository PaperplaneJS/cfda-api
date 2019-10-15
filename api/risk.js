import uuid from '@/utils/uuid.js'

export default function(server, db) {
  const riskDB = db.collection('risk')

  server.get(`/risk`, async (req, res, next) => {
    let cond = {}
    if (req.query['year']) {
      cond['year'] = Number(req.query['year'])
    }
    const result = await riskDB.find(cond).toArray()
    res.send(result)

    return next()
  })

  server.get(`/risk/:bizid`, async (req, res, next) => {
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
  })

  server.post(`/risk`, async (req, res, next) => {
    const postRiskInfo = req.body
    postRiskInfo._id = uuid()

    await riskDB.insertOne(postRiskInfo)
    res.send(postRiskInfo)

    return next()
  })
}
