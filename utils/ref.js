export default function(req, ...moreFieldNames) {
  if (!req.query['ref']) {
    return [];
  }

  let aggregates = [];
  let fieldNames = ['biz', 'staff', 'dep', 'law', 'template', 'sms', 'plan', 'task', 'record', ...moreFieldNames];
  fieldNames.forEach(dbName => {
    if (req.query['ref'].includes(dbName)) {
      aggregates.push({
        $lookup: {
          from: dbName,
          localField: dbName,
          foreignField: '_id',
          as: `__${dbName}`
        }
      });

      aggregates.push({ "$unwind": `$__${dbName}` });
    }
  })

  return aggregates;
}