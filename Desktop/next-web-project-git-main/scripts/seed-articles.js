require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set');
    process.exit(1);
  }
  const client = new MongoClient(uri, {});
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB || 'test');
    const col = db.collection('articles');

    const docs = [
      {
        type: 'dog',
        category: '🐕 สุขภาพและการป้องกันโรค',
        title: 'ภัยเงียบจากพยาธิหนอนหัวใจ',
        snippet: 'ป้องกันพยาธิหนอนหัวใจก่อนสายเกินไป...',
        image: '/assets/dog1.png',
        date: new Date()
      },
      {
        type: 'dog',
        category: '💊 โภชนาการอาหาร',
        title: 'อาหารที่เหมาะกับลูกสุนัข',
        snippet: 'เคล็ดลับการเลือกอาหาร...',
        image: '/assets/dog2.png',
        date: new Date()
      }
    ];

    const res = await col.insertMany(docs);
    console.log('Inserted docs:', res.insertedCount);
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.close();
  }
}

seed();