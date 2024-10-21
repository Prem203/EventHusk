--Query 1
--This query retrieves event names, venue names, and organizer names by joining the Events, EventVenueMapping, Venue, and Users tables.
SELECT e.eventName, v.venueName, u.name AS organizerName
FROM Events e
JOIN EventVenueMapping evm ON e.eventID = evm.eventID
JOIN Venue v ON evm.venueID = v.venueID
JOIN Users u ON e.userID = u.userID
WHERE u.userType = 'Organizer';

