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

export async function getReferenceByID(venueID) {
  console.log("getReferenceByID", venueID);

  const db = await open({
    filename: "./db/EventHusk.db",
    driver: sqlite3.Database,
  });

  const stmt = await db.prepare(`
    SELECT * FROM Venue
    WHERE venueID = @venueID;
  `);

  const params = {
    "@venueID": venue_id,
  };

  try {
    return await stmt.get(params);
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
      title = @title,
      published_on = @published_on
    WHERE
      venueID = @reference_id;
  `);

  const params = {
    "@reference_id": reference_id,
    "@title": ref.title,
    "@published_on": ref.published_on,
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
    NATURAL JOIN Venues
    WHERE eventID @reference_id;
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
    Reference_Author(reference_id, author_id)
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
