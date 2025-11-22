import { MongoClient, MongoClientOptions } from 'mongodb';

declare global {
  // avoid multiple connections in development
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI ?? '';
if (!uri) throw new Error('MONGODB_URI is not set in .env.local');

const options: MongoClientOptions = {}; // add options if needed
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise as Promise<MongoClient>;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  const dbName = process.env.MONGODB_DB ?? 'test';
  return client.db(dbName);
}