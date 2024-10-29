import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function getReferences(query, page, pageSize) {
  console.log("getReferences", query);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Venue
    WHERE venueName LIKE @query
    ORDER BY capacity DESC
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
  console.log("getvenues", query);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT COUNT(*) AS count
    FROM Venue
    WHERE venueName LIKE @query;
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
    SELECT * FROM Venue
    WHERE venueID = @reference_id;
  `);

  const params = {
    "@reference_id": reference_id,
  };

  try {
    let ref = await stmt.get(params);

    ref.location = ref.location || "Location not specified";
    ref.capacity = ref.capacity || "Capacity not specified";
    ref.policies = ref.policies || "Policies not available";
    ref.availabilityStatus = ref.availabilityStatus || "Status unknown";
    ref.personResponsible = ref.personResponsible || "Not Assigned";

    return ref;

  } finally {
    await stmt.finalize();
    db.close();
  }
}

export async function updatevenueByID(venueID, ref) {
  console.log("updatevenueByID", venueID, ref);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE Venue
    SET
      venueName = @venueName,
      location = @location,
      capacity = @capacity,
      policies = @policies
      availabilityStatus = @availabilityStatus
      personResponsible = @personResponsible
    WHERE
      venueID = @reference_id;
  `);

  const params = {
    "@reference_id": reference_id,
    "@venueName": ref.venueName,
    "@location": ref.location,
    "@capacity": ref.capacity,
    "@policies": ref.policies,
    "@availabilityStatus": ref.availabilityStatus,
    "@personResponsible": ref.personResponsible
  };

  try {
    return await stmt.run(params);
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
    DELETE FROM Venue
    WHERE
      venueID = @reference_id;
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

  const stmt = await db.prepare(`INSERT INTO
    Venue(venueName, location, capacity, policies, availabilityStatus, personResponsible)
    VALUES (@venueName, @location, @capacity, @policies, 'Available', @personResponsible);`);

  try {
    return await stmt.run({
      "@venueName": ref.venueName,
      "@location": ref.location,
      "@capacity": ref.capacity,
      "@policies": ref.policies,
      "@personResponsible": ref.personResponsible
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
    SELECT * FROM Events
    NATURAL JOIN EventVenueMapping
    WHERE venueID = @reference_id;
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

export async function addAuthorIDToReferenceID(reference_id, author_id) {
  console.log("addAuthorIDToReferenceID", reference_id, author_id);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    INSERT INTO
    EventVenueMapping(venueID, eventID)
    VALUES (@reference_id, @author_id);
  `);

  const params = {
    "@reference_id": reference_id,
    "@author_id": author_id,
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
    SELECT * FROM Events
    WHERE eventName LIKE @query
    ORDER BY date DESC
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

export async function updateReferenceByID(reference_id, ref) {
  console.log("Inside update ref", ref);
  console.log("Inside update reference_id", reference_id);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    UPDATE Venue
    SET
      venueName = @venueName,
      location = @location,
      capacity = @capacity,
      policies = @policies,
      availabilityStatus = @availabilityStatus,
      personResponsible = @personResponsible
    WHERE
      venueID = @reference_id
  `);
  

  const params = {
    "@reference_id": reference_id,
    "@venueName": ref.venueName || "Name not specified",
    "@location": ref.location || "Location not specified",
    "@capacity": ref.capacity || "Capacity not specified",
    "@policies": ref.policies || "Policies not available",
    "@availabilityStatus": ref.availabilityStatus || "Status unknown",
    "@personResponsible": ref.personResponsible || "Not Assigned",
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
    FROM Events
    WHERE 
      eventID LIKE @query OR 
      userID LIKE @query;
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
