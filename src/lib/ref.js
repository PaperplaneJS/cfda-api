export const ref = (req, ...moreFieldNames) => {
  if (!req.query['ref']) {
    return []
  }

  const aggregates = []
  ;[
    'biz',
    'staff',
    'dep',
    'law',
    'template',
    'sms',
    'plan',
    'task',
    'record',
    ...moreFieldNames
  ].forEach(dbName => {
    if (req.query['ref'].includes(dbName)) {
      aggregates.push({
        $lookup: {
          from: dbName,
          localField: dbName,
          foreignField: '_id',
          as: `__${dbName}`
        }
      })

      aggregates.push({ $unwind: `$__${dbName}` })
    }
  })

  return aggregates
}

export default { ref }
