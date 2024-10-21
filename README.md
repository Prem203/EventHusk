# EventHusk - Campus Events and Facility Booking System

EventHusk is a relational database project designed to manage campus events and facility bookings efficiently. This project uses SQLite3 to create tables for managing events, venues, users, and related features like RSVPs and feedback. EventHusk aims to help students, clubs, and campus organizations book spaces and manage events effectively.

## Features
- User management with two roles: Organizer and Attendee
- Venue booking for events
- RSVP for events and attendee feedback
- Advanced queries for analytics and data insights

## Prerequisites
- SQLite3 installed on your system

## How to Execute the Project

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Prem203/EventHusk
   cd EventHusk
   ```

2. **Download and Install sqllite extensions**
   - SQLite
   - SQLite Viewer
   - SQLTools

3 . **Run Queries**
   You can run the provided queries using the SQLite3 command line or any SQLite client tool.
   ```sh
   sqlite3 EventHusk.db
   ```

   Once inside the SQLite prompt, you can paste the queries directly or load a query script.

## Queries Explained
Below are the five advanced queries provided in the project:

### 1. Query with a Join of Three Tables
```sql
SELECT e.eventName, v.venueName, u.name AS organizerName
FROM Events e
JOIN EventVenueMapping evm ON e.eventID = evm.eventID
JOIN Venue v ON evm.venueID = v.venueID
JOIN Users u ON e.userID = u.userID
WHERE u.userType = 'Organizer';
```
**Explanation:** This query retrieves the names of events, the corresponding venues, and the organizer names by joining the `Events`, `EventVenueMapping`, `Venue`, and `Users` tables.

### 2. Query with a Subquery
```sql
SELECT eventName, eventDescription, date, time
FROM Events
WHERE userID = (
    SELECT userID
    FROM Users
    WHERE username = 'premvora'
);
```
**Explanation:** This query selects details of events organized by the user with the username 'premvora' by using a subquery to obtain the `userID` of that user.

### 3. Query with GROUP BY and HAVING Clause
```sql
SELECT v.venueName, COUNT(e.eventID) AS eventCount
FROM Venue v
JOIN EventVenueMapping evm ON v.venueID = evm.venueID
JOIN Events e ON evm.eventID = e.eventID
GROUP BY v.venueName
HAVING COUNT(e.eventID) > 1;
```
**Explanation:** This query retrieves venue names and the count of events held at each venue, but only includes those venues that have hosted more than one event. This is achieved by grouping by venue and using the `HAVING` clause.

### 4. Query with a Complex Search Criterion
```sql
SELECT *
FROM Events
WHERE (date >= '2023-11-01' AND date <= '2023-12-31')
AND (eventName LIKE '%Festival%' OR eventDescription LIKE '%network%');
```
**Explanation:** This query selects all events that are happening between November and December 2023 and either have 'Festival' in their name or 'network' in their description.

### 5. Query Using Advanced Query Mechanisms (SELECT CASE/WHEN)
```sql
SELECT u.userID, u.name, 
    CASE WHEN u.userType = 'Organizer' THEN 'Can book venues'
         WHEN u.userType = 'Attendee' THEN 'Can RSVP to events'
         ELSE 'Unknown role'
    END AS roleDescription
FROM Users u;
```
**Explanation:** This query retrieves user details and provides a role description based on the user type using a `CASE/WHEN` statement. It helps in understanding the permissions associated with each user role.


## License
This project is licensed under the MIT License.

