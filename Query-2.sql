--Query 2
--This query selects event details for events organized by the user with the username 'premvora' using a subquery to find the userID.
SELECT eventName, eventDescription, date, time
FROM Events
WHERE userID = (
    SELECT userID
    FROM Users
    WHERE username = 'premvora'
);




