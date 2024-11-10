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
    const collection = client.db('EventHusk').collection('events');

    const filter = {
      $or: [
        { user_id: 1 },  // Check if user_id 1 (Organizer) has any events
        { venue_id: 1 }  // Check if venue_id 1 (Community Hall A) is assigned to any events
      ]
    };

    const result = await collection.find(filter).toArray();
    console.log("Events matching complex criteria:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
