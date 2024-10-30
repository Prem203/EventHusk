import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { format } from 'date-fns';

export async function getReferences(query, page, pageSize) {
  console.log("getReferences", query);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT Events.*, Venue.venueName
    FROM Events
    LEFT JOIN EventVenueMapping ON Events.eventID = EventVenueMapping.eventID
    LEFT JOIN Venue ON EventVenueMapping.venueID = Venue.venueID
    WHERE eventName LIKE @query
    ORDER BY rsvpDeadline DESC
    LIMIT @pageSize
    OFFSET @offset;
  `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getReferencesCount(query) {
  console.log("getevents", query);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Events
    WHERE eventName LIKE @query;
  `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getReferenceByID(reference_id) {
  console.log("getReferenceByID", reference_id);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Events
    WHERE eventID = @reference_id;
  `);

  const params = {
    "@reference_id": reference_id,
  };

  try {
    let ref = await stmt.get(params);

    ref.eventName = ref.eventName || "Name not specified";
    ref.eventDescription = ref.eventDescription || "Description not specified";
    ref.date = ref.date || "Date not specified";
    ref.time = ref.policies || "Time not specified";
    ref.rsvpDeadline = ref.rsvpDeadline || "RSVP Deadline not specified";
    return ref;

  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function deleteReferenceByID(reference_id) {
  console.log("deleteReferenceByID", reference_id);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    DELETE FROM Events
    WHERE
      eventID = @reference_id;
  `);

  const params = {
    "@reference_id": reference_id,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function insertReference(ref) {
  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const formattedDate = ref.date; // Assuming date is already in 'YYYY-MM-DD' format
  const formattedTime = ref.time; // Assuming time is already in 'HH:MM' format
  const formattedRsvpDeadline = ref.rsvpDeadline ? format(new Date(ref.rsvpDeadline), 'yyyy-MM-dd HH:mm') : null; 

  const stmt = await db.prepare(`INSERT INTO
    Events(eventName, eventDescription, date, time, rsvpDeadline, userID)
    VALUES (@eventName, @eventDescription, @date, @time, @rsvpDeadline, @userID);`);

  try {
    return await stmt.run({
      "@eventName": ref.eventName,
      "@eventDescription": ref.eventDescription,
      "@date": formattedDate,
      "@time": formattedTime,
      "@rsvpDeadline": formattedRsvpDeadline,
      "@userID": ref.userID,
    });
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getAuthorsByReferenceID(reference_id) {
  console.log("getAuthorsByReferenceID", reference_id);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Venue
    NATURAL JOIN EventVenueMapping
    WHERE eventID = @reference_id;
  `);

  const params = {
    "@reference_id": reference_id,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function addAuthorIDToReferenceID(venueID, eventID) {
  console.log("addAuthorIDToReferenceID", venueID, eventID);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    INSERT INTO
    EventVenueMapping(venueID, eventID)
    VALUES (@venueID, @eventID);
  `);

  const params = {
    "@eventID": eventID,
    "@venueID": venueID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getAuthors(query, page, pageSize) {
  console.log("getAuthors query", query);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT *
    FROM Venue
    WHERE venueName LIKE @query
    ORDER BY capacity DESC
    LIMIT @pageSize
    OFFSET @offset;;
  `);

  const params = {
    "@query": query + "%",
    "@pageSize": pageSize,
    "@offset": (page - 1) * pageSize,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function updateReferenceByID(reference_id, ref) {
  console.log("Inside update ref", ref);
  console.log("Inside update reference_id", reference_id);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE Events
    SET
      eventName = @eventName,
      eventDescription = @eventDescription,
      date = @date,
      time = @time,
      rsvpDeadline = @rsvpDeadline
    WHERE
      eventID = @reference_id;
  `);
  

  const params = {
    "@reference_id": reference_id,
    "@eventName": ref.eventName || "Name not specified",
    "@eventDescription": ref.eventDescription || "Description not specified",
    "@date": ref.date || "Date not specified",
    "@time": ref.time || "Time not specified",
    "@rsvpDeadline": ref.rsvpDeadline || "RSVP Deadline not specified",
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getAuthorsCount(query) {
  console.log("getAuthorsCount query", query);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Venue
    WHERE 
      venueID LIKE @query;
  `);

  const params = {
    "@query": query + "%",
  };

  try {
    return (await stmt.get(params)).count;
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function updateEventVenueMapping(eventID, venueID) {
  console.log("Updating EventVenueMapping for eventID:", eventID, "venueID:", venueID);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  // Check if a mapping already exists for this event
  const existingMapping = await db.get(`
    SELECT * FROM EventVenueMapping WHERE eventID = @eventID
  `, {
    "@eventID": eventID,
  });

  let stmt;

  if (existingMapping) {
    // Update existing mapping
    stmt = await db.prepare(`
      UPDATE EventVenueMapping
      SET venueID = @venueID
      WHERE eventID = @eventID
    `);
  } else {
    // Insert new mapping
    stmt = await db.prepare(`
      INSERT INTO EventVenueMapping (eventID, venueID)
      VALUES (@eventID, @venueID)
    `);
  }

  const params = {
    "@eventID": eventID,
    "@venueID": venueID,
  };

  try {
    return await stmt.run(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function getEventsByVenueID(venueID) {
  console.log("Getting events for venueID:", venueID);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT Events.*
    FROM Events
    INNER JOIN EventVenueMapping ON Events.eventID = EventVenueMapping.eventID
    WHERE EventVenueMapping.venueID = @venueID;
  `);

  const params = {
    "@venueID": venueID,
  };

  try {
    return await stmt.all(params);
  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function deleteVenueByID(venueID) {
  console.log("deleteVenueByID", venueID);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  try {
    // Step 1: Delete events associated with the venue
    const deleteEventsStmt = await db.prepare(`
      DELETE FROM Events
      WHERE eventID IN (
        SELECT eventID
        FROM EventVenueMapping
        WHERE venueID = @venueID
      );
    `);
    await deleteEventsStmt.run({ "@venueID": venueID });
    await deleteEventsStmt.finalize();
    console.log("Deleted Events associated with venueID:", venueID);

    // Step 2: Delete entries from EventVenueMapping
    const deleteMappingStmt = await db.prepare(`
      DELETE FROM EventVenueMapping
      WHERE venueID = @venueID;
    `);
    await deleteMappingStmt.run({ "@venueID": venueID });
    await deleteMappingStmt.finalize();
    console.log("Deleted EventVenueMapping entries for venueID:", venueID);

    // Step 3: Delete the venue itself
    const deleteVenueStmt = await db.prepare(`
      DELETE FROM Venue
      WHERE venueID = @venueID;
    `);
    const result = await deleteVenueStmt.run({ "@venueID": venueID });
    await deleteVenueStmt.finalize();
    console.log("Deleted venue with venueID:", venueID);

    return result;
  } catch (err) {
    console.error("Error deleting venue:", err);
    throw err;
  } finally {
    db.close();
  }
}


