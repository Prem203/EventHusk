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

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "event_id",
          foreignField: "rsvp.event_id",
          as: "attendees"
        }
      },
      {
        $project: {
          event_name: 1,
          total_attendees: { $size: "$attendees" }
        }
      }
    ];

    const result = await collection.aggregate(pipeline).toArray();
    console.log("Total attendees for each event:", result);
  } finally {
    await client.close();
  }
}

main().catch(console.error);
