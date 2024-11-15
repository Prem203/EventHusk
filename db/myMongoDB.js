import { parseISO } from "date-fns";
import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

const uri = "mongodb://localhost:27017"; // MongoDB connection URI
const client = new MongoClient(uri);
const dbName = "EventHusk";
const db = client.db(dbName);
const eventsCollection = db.collection("events");
const venuesCollection = db.collection("venues");

export async function getReferences(query, page, pageSize) {
  console.log("getReferences", query);

  const offset = (page - 1) * pageSize;

  try {
    await client.connect();

    // Aggregation pipeline to join events with venues
    const references = await eventsCollection
      .aggregate([
        {
          $match: {
            event_name: { $regex: `^${query}`, $options: "i" }, // Case-insensitive partial match
          },
        },
        {
          $lookup: {
            from: "venues", // Collection to join
            localField: "venue_id", // Local field in events
            foreignField: "venue_id", // Foreign field in venues
            as: "venue_details", // Resulting field
          },
        },
        { $unwind: "$venue_details" }, // Flatten the array from $lookup
        { $sort: { rsvp_deadline: -1 } }, // Sort by RSVP deadline descending
        { $skip: offset }, // Pagination: Skip to the correct page
        { $limit: pageSize }, // Limit the number of results
      ])
      .toArray();

    return references;
  } catch (err) {
    console.error("Error fetching references:", err);
    throw err;
  } finally {
    await client.close();
  }
}


export async function getReferencesCount(query) {
  console.log("getReferencesCount query:", query);

  try {
    await client.connect();

    // Use MongoDB's countDocuments method with a regex filter
    const count = await eventsCollection.countDocuments({
      event_name: { $regex: `^${query}`, $options: "i" } // Case-insensitive, partial match
    });

    return count;
  } catch (err) {
    console.error("Error fetching reference count:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function getReferenceByID(reference_id) {
  console.log("getReferenceByID", reference_id);

  try {
    await client.connect();

    // Fetch the event by its ID
    const ref = await eventsCollection.findOne({ event_id: parseInt(reference_id) });

    if (!ref) {
      throw new Error(`Event with ID ${reference_id} not found`);
    }

    // Ensure fallback values for fields
    ref.event_name = ref.event_name || "Name not specified";
    ref.event_description = ref.event_description || "Description not specified";
    ref.date = ref.date || "Date not specified";
    ref.time = ref.time || "Time not specified";
    ref.rsvp_deadline = ref.rsvp_deadline || "RSVP Deadline not specified";

    return ref;
  } catch (err) {
    console.error("Error fetching reference by event_id:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function deleteReferenceByID(reference_id) {
  console.log("deleteReferenceByID", reference_id);

  try {
    await client.connect();

    // Delete the event by its ID
    const result = await eventsCollection.deleteOne({ event_id: parseInt(reference_id) });

    if (result.deletedCount === 0) {
      throw new Error(`Event with ID ${reference_id} not found`);
    }

    console.log(`Deleted ${result.deletedCount} document(s).`);
    return result;
  } catch (err) {
    console.error("Error deleting reference by ID:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function insertReference(ref) {
  console.log("insertReference", ref);

  try {
    await client.connect();

    // Prepare the reference object
    const newReference = {
      event_name: ref.event_name,
      event_description: ref.event_description,
      date: ref.date, // Assuming date is already in 'YYYY-MM-DD' format
      time: ref.time, // Assuming time is already in 'HH:mm' format
      rsvp_deadline: ref.rsvp_deadline ? new Date(ref.rsvp_deadline).toISOString() : null, // Convert RSVP deadline to ISO format
      user_id: ref.user_id, // Assuming userID is provided
    };

    // Insert the document into the collection
    const result = await eventsCollection.insertOne(newReference);

    console.log(`Inserted document with _id: ${result.insertedId}`);
    return result; // Return the result for further use
  } catch (err) {
    console.error("Error inserting reference:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function getAuthorsByReferenceID(reference_id) {
  console.log("getAuthorsByReferenceID", reference_id);

  try {
    await client.connect();

    // Aggregation pipeline to join events with venues
    const result = await eventsCollection
      .aggregate([
        { $match: { event_id: parseInt(reference_id) } }, // Match the specific event ID
        {
          $lookup: {
            from: "venues", // Join with the venues collection
            localField: "venue_id", // Field in events
            foreignField: "venue_id", // Field in venues
            as: "venue_details", // Output field
          },
        },
        { $unwind: "$venue_details" }, // Flatten the venue_details array
        { $project: { venue_details: 1 } }, // Only return venue details
      ])
      .toArray();

    if (result.length === 0) {
      throw new Error(`No venue found for event ID: ${reference_id}`);
    }

    return result[0].venue_details; // Return the venue details
  } catch (err) {
    console.error("Error fetching authors by reference ID:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function addAuthorIDToReferenceID(venueID, eventID) {
  console.log("addAuthorIDToReferenceID", venueID, eventID);

  try {
    await client.connect();

    // Update the event document to set the venue_id
    const result = await eventsCollection.updateOne(
      { event_id: parseInt(eventID) }, // Match the event by ID
      { $set: { venue_id: venueID } } // Set or update the venue_id field
    );

    if (result.matchedCount === 0) {
      throw new Error(`Event with ID ${eventID} not found`);
    }

    console.log(`Updated event with ID: ${eventID}, venueID: ${venueID}`);
    return result; // Return the result object for further use
  } catch (err) {
    console.error("Error updating venue ID for event:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function getAuthors(query, page, pageSize) {
  console.log("getAuthors query:", query);

  const offset = (page - 1) * pageSize;

  try {
    await client.connect();

    // Query to filter and paginate venues
    const venues = await venuesCollection
      .find({ venue_name: { $regex: `^${query}`, $options: "i" } }) // Case-insensitive partial match
      .sort({ capacity: -1 }) // Sort by capacity in descending order
      .skip(offset) // Skip documents for pagination
      .limit(pageSize) // Limit the number of results
      .toArray(); // Convert the cursor to an array

    return venues;
  } catch (err) {
    console.error("Error fetching authors (venues):", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function updateReferenceByID(reference_id, ref) {
  console.log("Inside update ref", ref);
  console.log("Inside update reference_id", reference_id);

  try {
    await client.connect();

    // Prepare the update fields
    const updateFields = {
      event_name: ref.eventName || "Name not specified",
      event_description: ref.eventDescription || "Description not specified",
      date: ref.date || "Date not specified",
      time: ref.time || "Time not specified",
      rsvp_deadline: ref.rsvpDeadline || "RSVP Deadline not specified",
    };

    // Update the event document by its ID
    const result = await eventsCollection.updateOne(
      { event_id: parseInt(reference_id) }, // Match the event by ID
      { $set: updateFields } // Set the fields with the updated values
    );

    if (result.matchedCount === 0) {
      throw new Error(`Event with ID ${reference_id} not found`);
    }

    console.log(`Updated event with ID: ${reference_id}`);
    return result; // Return the result object for further use
  } catch (err) {
    console.error("Error updating reference by ID:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function getAuthorsCount(query) {
  console.log("getAuthorsCount query:", query);

  try {
    await client.connect();

    // Use MongoDB's countDocuments with a regex filter
    const count = await venuesCollection.countDocuments({
      venue_name: { $regex: `^${query}`, $options: "i" } // Case-insensitive partial match
    });

    return count;
  } catch (err) {
    console.error("Error fetching authors count:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function updateEventVenueMapping(eventID, venueID) {
  console.log("Updating EventVenueMapping for eventID:", eventID, "venueID:", venueID);

  try {
    await client.connect();

    // Update the `venue_id` field of the specified event document
    const result = await eventsCollection.updateOne(
      { event_id: parseInt(eventID) }, // Match the event by ID
      { $set: { venue_id: venueID } }, // Set or update the venue_id field
      { upsert: true } // Insert a new document if it doesn’t exist
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      throw new Error(`Event with ID ${eventID} could not be updated or created`);
    }

    console.log(`Updated or inserted mapping for event ID: ${eventID}, venueID: ${venueID}`);
    return result; // Return the result object for further use
  } catch (err) {
    console.error("Error updating event-venue mapping:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function getEventsByVenueID(venueID) {
  console.log("Getting events for venueID:", venueID);

  try {
    await client.connect();

    // Use an aggregation pipeline to filter events by venueID
    const events = await eventsCollection
      .aggregate([
        { $match: { venue_id: venueID } }, // Filter by venue_id
        {
          $lookup: {
            from: "venues", // Join with the venues collection
            localField: "venue_id", // Field in events
            foreignField: "venue_id", // Field in venues
            as: "venue_details", // Output field
          },
        },
        { $unwind: "$venue_details" }, // Flatten the venue_details array
        { $project: { venue_details: 1, event_name: 1, date: 1, time: 1 } }, // Select specific fields to return
      ])
      .toArray();

    return events;
  } catch (err) {
    console.error("Error fetching events by venue ID:", err);
    throw err;
  } finally {
    await client.close();
  }
}

export async function deleteVenueByID(venueID) {
  console.log("deleteVenueByID", venueID);

  try {
    await client.connect();

    // Step 1: Delete events associated with the venue
    const deleteEventsResult = await eventsCollection.deleteMany({ venue_id: venueID });
    console.log(`Deleted ${deleteEventsResult.deletedCount} events associated with venueID:`, venueID);

    // Step 2: Delete the venue itself
    const deleteVenueResult = await venuesCollection.deleteOne({ venue_id: venueID });
    if (deleteVenueResult.deletedCount === 0) {
      throw new Error(`Venue with ID ${venueID} not found`);
    }

    console.log(`Deleted venue with venueID: ${venueID}`);
    return {
      eventsDeleted: deleteEventsResult.deletedCount,
      venueDeleted: deleteVenueResult.deletedCount,
    };
  } catch (err) {
    console.error("Error deleting venue:", err);
    throw err;
  } finally {
    await client.close();
  }
}
