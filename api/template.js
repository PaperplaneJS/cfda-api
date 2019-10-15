import uuid from '@/utils/uuid.js'

export default function(server, db) {
  const templateDB = db.collection('template')

  server.get('/template', async (req, res, next) => {
    const result = await templateDB.find({}, { projection: { content: 0 } }).toArray()
    res.send(result)

    return next()
  })

  server.get(`/template/:templateid`, async (req, res, next) => {
    const result = await templateDB.findOne({ _id: req.params['templateid'] })
    res.send(result)

    return next()
  })

  server.post('/template', async (req, res, next) => {
    const postTemplateInfo = req.body
    postTemplateInfo._id = uuid()

    await templateDB.insertOne(postTemplateInfo)
    res.status(201)
    res.send(postTemplateInfo)

    return next()
  })

  server.put('/template/:templateid', async (req, res, next) => {
    const template = req.body
    const result = await templateDB.findOneAndUpdate(
      { _id: req.params['templateid'] || '' },
      { $set: template }
    )
    res.status(result.ok ? 201 : 404)
    res.send(result.ok ? template : undefined)

    return next()
  })

  server.del('/template/:templateid', async (req, res, next) => {
    await templateDB.deleteOne({ _id: req.params['templateid'] || '' })
    res.status(204)
    res.send()

    return next()
  })
}
