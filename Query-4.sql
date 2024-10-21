--Query 4
--This query selects all events happening between November and December 2023 that either have 'Festival' in their name or 'network' in their description.
SELECT *
FROM Events
WHERE (date >= '2023-11-01' AND date <= '2023-12-31')
AND (eventName LIKE '%Festival%' OR eventDescription LIKE '%network%');

