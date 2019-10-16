import { MongoClient } from 'mongodb'
import { config } from './env.js'

const { MONGODB_HOST, DB_NAME } = config

let _dbClient = null
let _db = null

export const dbConnect = async () => {
  _dbClient = new MongoClient(MONGODB_HOST, { useNewUrlParser: true, useUnifiedTopology: true })
  await _dbClient.connect()
  _db = _dbClient.db(DB_NAME)
}

export const getDb = () => _db

export default { dbConnect, getDb }
