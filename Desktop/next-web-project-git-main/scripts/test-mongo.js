// ติดตั้ง dotenv: npm i dotenv mongodb
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function test() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in .env.local');
    process.exit(1);
  }
  const client = new MongoClient(uri, {});

  try {
    await client.connect();
    const dbName = process.env.MONGODB_DB || 'test';
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('Connected. Collections:', collections.map(c => c.name));
  } catch (err) {
    console.error('Connection failed:', err.message || err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

test();