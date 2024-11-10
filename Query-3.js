import { MongoClient } from 'mongodb';

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

async function main() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const collection = client.db('EventHusk').collection('users');

    const filter = { user_id: 2 };
    const project = { rsvp_count: { $size: "$rsvp" } };

    const result = await collection.findOne(filter, { projection: project });
    console.log("RSVP count for user with user_id 2:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
