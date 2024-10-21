--Query 3
--This query retrieves venue names and the count of events held at each venue, showing only those venues that hosted more than one event.
SELECT v.venueName, COUNT(e.eventID) AS eventCount
FROM Venue v
JOIN EventVenueMapping evm ON v.venueID = evm.venueID
JOIN Events e ON evm.eventID = e.eventID
GROUP BY v.venueName
HAVING COUNT(e.eventID) > 1;

