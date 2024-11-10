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
    const collection = client.db('EventHusk').collection('venues');

    const filter = {
      availability_status: "Available",
      capacity: { $gte: 100 },  // Adjusted to include capacity of 100 or more
      "venue_resources.resource_type": "Projector"
    };

    const result = await collection.find(filter).toArray();
    console.log("Available venues with specified resource:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
