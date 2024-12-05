import redis from "../../EventHusk/routes/redis.js";

// Fetch paginated references with a search query
export async function getReferences(query, page, pageSize) {
  console.log("getReferences query:", query);

  const offset = (page - 1) * pageSize;

  try {
    const allEventKeys = await redis.keys('event:*');
    const events = [];

    for (const eventKey of allEventKeys) {
      // Skip the counter key
      if (eventKey === 'event:id') {
        console.log(`[DEBUG] Skipping counter key: ${eventKey}`);
        continue;
      }

      const event = await redis.hgetall(eventKey);

      // Safely check and filter events
      if (event && event.event_name && event.event_name.toLowerCase().includes(query.toLowerCase())) {
        if (event.venue_id) {
          const venue = await redis.hgetall(`venue:${event.venue_id}`);
          event.venue_details = venue || { venue_name: "Unknown Venue" }; // Add default if missing
        }
        events.push(event);
      }
    }

    events.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
    return events.slice(offset, offset + pageSize); // Paginate results
  } catch (err) {
    console.error("Error fetching references:", err);
    throw err;
  }
}

export async function insertReference(ref) {
  console.log("insertReference", ref);

  try {
    let newEventId, eventKey, keyExists;

    // Find a unique event ID
    do {
      newEventId = await redis.incr('event:id');
      eventKey = `event:${newEventId}`;
      keyExists = await redis.exists(eventKey);
      if (keyExists) {
        console.warn(`[WARN] Key conflict detected for ${eventKey}. Skipping to next ID.`);
      }
    } while (keyExists);

    // Prepare the reference object
    const newReference = {
      event_id: newEventId,
      event_name: ref.event_name || `Event ${newEventId}`,
      event_description: ref.event_description || "No description provided",
      date: ref.date || null,
      time: ref.time || null,
      rsvp_deadline: ref.rsvp_deadline || null,
      user_id: ref.user_id || null,
      venue_id: ref.venue_id || null,
    };

    // Insert the event into Redis
    await redis.hmset(eventKey, newReference);

    console.log(`Inserted event with ID: ${newEventId}`);
    return newEventId;
  } catch (err) {
    console.error("Error inserting reference:", err);
    throw err;
  }
}

export async function getReferencesCount(query) {
  console.log("getReferencesCount query:", query);

  try {
    const allKeys = await redis.keys('event:*');
    let count = 0;

    for (const key of allKeys) {
      // Skip non-event keys, e.g., `event:id`
      if (key === 'event:id') {
        console.log(`[DEBUG] Skipping counter key: ${key}`);
        continue;
      }

      const event = await redis.hgetall(key);
      // Safely handle missing fields
      if (event && event.event_name && event.event_name.toLowerCase().includes(query.toLowerCase())) {
        count++;
      }
    }

    return count;
  } catch (err) {
    console.error("Error fetching reference count:", err);
    throw err;
  }
}
 
export async function deleteReferenceByID(reference_id) {
console.log("deleteReferenceByID", reference_id);
    
try {
const result = await redis.del(`event:${reference_id}`);
console.log(`Deleted event with ID: ${reference_id}`);
return result;
    } catch (err) {
console.error("Error deleting reference by ID:", err);
throw err;
}
}

export async function getAuthorsByReferenceID(reference_id) {
    console.log("getAuthorsByReferenceID", reference_id);
  
    try {
      // Fetch the event by reference ID
      const event = await redis.hgetall(`event:${reference_id}`);
      if (!event) throw new Error(`Event with ID ${reference_id} not found`);
  
      // Fetch the venue details
      const venueDetails = await redis.hgetall(`venue:${event.venue_id}`);
      if (!venueDetails) throw new Error(`Venue with ID ${event.venue_id} not found`);
  
      return venueDetails;
    } catch (err) {
      console.error("Error fetching authors by reference ID:", err);
      throw err;
    }
}
 
export async function addAuthorIDToReferenceID(reference_id, author_id) {
  console.log("addAuthorIDToReferenceID", reference_id, author_id);

  try {
    const eventKey = `event:${reference_id}`;
    const event = await redis.hgetall(eventKey);
    if (!event) throw new Error(`Event with ID ${reference_id} not found`);

    // Update venue_id
    await redis.hset(eventKey, "venue_id", author_id);
    console.log(`Updated event ${reference_id} with author_id ${author_id}`);
  } catch (err) {
    console.error("Error adding author to reference ID:", err);
    throw err;
  }
}

export async function updateReferenceByID(reference_id, ref) {
  console.log("updateReferenceByID", reference_id, ref);

  try {
    const eventKey = `event:${reference_id}`;
    const existingEvent = await redis.hgetall(eventKey);
    if (!existingEvent) throw new Error(`Event with ID ${reference_id} not found`);

    // Update fields
    const updatedEvent = {
      event_name: ref.event_name || existingEvent.event_name,
      event_description: ref.event_description || existingEvent.event_description,
      date: ref.date || existingEvent.date,
      time: ref.time || existingEvent.time,
      rsvp_deadline: ref.rsvp_deadline || existingEvent.rsvp_deadline,
      user_id: ref.user_id || existingEvent.user_id,
      venue_id: ref.venue_id || existingEvent.venue_id,
    };

    await redis.hmset(eventKey, updatedEvent);
    console.log(`Updated event with ID: ${reference_id}`);
    return updatedEvent;
  } catch (err) {
    console.error("Error updating reference by ID:", err);
    throw err;
  }
}

export async function getAuthors(query, page, pageSize) {
  console.log("getAuthors query:", query);

  const offset = (page - 1) * pageSize;

  try {
    const allKeys = await redis.keys('venue:*');
    const venues = [];

    for (const key of allKeys) {
      const venue = await redis.hgetall(key);

      // Safely handle undefined values
      if (venue && venue.venue_name && venue.venue_name.toLowerCase().includes(query.toLowerCase())) {
        venues.push(venue);
      }
    }

    // Sort by capacity descending (optional)
    venues.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));

    // Paginate results
    const paginatedVenues = venues.slice(offset, offset + pageSize);

    return paginatedVenues;
  } catch (err) {
    console.error("Error fetching venues:", err);
    throw err;
  }
}

export async function getAuthorsCount(query) {
  console.log("getAuthorsCount query:", query);

  try {
    const allKeys = await redis.keys('venue:*'); // Get all venue keys
    let count = 0;

    for (const key of allKeys) {
      const venue = await redis.hgetall(key);

      // Ensure venue and venue_name are defined
      if (venue && venue.venue_name && venue.venue_name.toLowerCase().includes(query.toLowerCase())) {
        count++;
      }
    }

    return count;
  } catch (err) {
    console.error("Error fetching venue count:", err);
    throw err;
  }
}

export async function updateEventVenueMapping(event_id, venue_id) {
  console.log("Updating venue for event ID:", event_id);

  try {
    const event = await redis.hgetall(`event:${event_id}`);
    if (!event) {
      throw new Error(`Event with ID ${event_id} not found`);
    }

    // Update the `venue_id` field in the event
    await redis.hset(`event:${event_id}`, "venue_id", venue_id);

    console.log(`Updated venue mapping for event ID: ${event_id}`);
  } catch (err) {
    console.error("Error updating venue mapping:", err);
    throw err;
  }
}

export async function deleteVenueByID(venue_id) {
    console.log("deleteVenueByID", venue_id);
  
    try {
      const allEventKeys = await redis.keys('event:*');
      for (const key of allEventKeys) {
        const event = await redis.hgetall(key);
        if (event.venue_id === venue_id) {
          await redis.del(key);
        }
      }
  
      const result = await redis.del(`venue:${venue_id}`);
      console.log(`Deleted venue with ID: ${venue_id}`);
      return result;
    } catch (err) {
      console.error("Error deleting venue:", err);
      throw err;
    }
}

export async function getVenueByID(venue_id) {
  console.log("getVenueByID", venue_id);

  try {
    const venue = await redis.hgetall(`venue:${venue_id}`);
    if (!venue || Object.keys(venue).length === 0) {
      console.warn(`Venue with ID ${venue_id} not found`);
      return null; // Return null if venue is not found
    }

    return venue;
  } catch (err) {
    console.error("Error fetching venue by ID:", err);
    throw err;
  }
}

