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

    const filter = { user_id: 3, "rsvp.event_id": 4, "rsvp.status": "Pending" };
    const update = { $set: { "rsvp.$.status": "Confirmed" } };

    const result = await collection.updateOne(filter, update);
    console.log("Update result:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
