// src/utils/mongo.ts
import { MongoClient, Db, GridFSBucket } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const MONGO_DB  = process.env.MONGO_DB  || 'social_demo_mongo';

let db: Db;
let bucket: GridFSBucket;

export async function connectMongo() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db     = client.db(MONGO_DB);
  bucket = new GridFSBucket(db, { bucketName: 'postImages' });
}

// getters so other modules can import
export function getBucket() { return bucket; }
