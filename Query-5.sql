--Query 5
--This query retrieves user details along with a role description that varies based on the user type using a CASE/WHEN statement. 
SELECT u.userID, u.name, 
    CASE WHEN u.userType = 'Organizer' THEN 'Can book venues'
         WHEN u.userType = 'Attendee' THEN 'Can RSVP to events'
         ELSE 'Unknown role'
    END AS roleDescription
FROM Users u;