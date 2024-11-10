# EventHusk - Campus Events and Facility Booking System

This project demonstrates various MongoDB queries on a sample event management dataset for the **EventHusk** application. The project includes multiple JavaScript files, each executing different types of MongoDB queries, such as aggregation, complex search criteria, counting documents, and updating document fields. 

## Project Structure

- `Query-1.js` - Aggregation query to count attendees for each event.
- `Query-2.js` - Complex search query to find events based on organizer or venue criteria.
- `Query-3.js` - Counts RSVP entries for a specific attendee.
- `Query-4.js` - Updates RSVP status based on specific conditions.
- `Query-5.js` - Finds available venues with specific resources and capacity.

## Prerequisites

1. **Node.js**: Install Node.js from [https://nodejs.org/](https://nodejs.org/) if you don't already have it.
2. **MongoDB**: Install MongoDB locally and start the MongoDB server on your machine. Refer to [MongoDB installation guide](https://docs.mongodb.com/manual/installation/).

## Setting Up the Project

1. **Clone the Repository**: Clone this GitHub repository to your local machine.
   ```bash
   git clone https://github.com/your-username/EventHusk.git
   cd EventHusk
   ```

2. **Install MongoDB Driver for Node.js**: This project uses MongoDB's native Node.js driver.
   ```bash
   npm install mongodb
   ```

3. **Data Import**: Import the JSON files (`EventHusk.events.json`, `EventHusk.users.json`, and `EventHusk.venues.json`) into the `EventHusk` database. You can use the following commands in your terminal:

   ```bash
   mongoimport --db EventHusk --collection events --file db/MongoDB/EventHusk.events.json --jsonArray
   mongoimport --db EventHusk --collection users --file db/MongoDB/EventHusk.users.json --jsonArray
   mongoimport --db EventHusk --collection venues --file db/MongoDB/EventHusk.venues.json --jsonArray
   ```
   These commands assume the JSON files are in the root directory of your project.


### Executing Each Query

1. **Run Query-1.js (Aggregation Query)**

   Aggregates the total number of attendees for each event and prints the event name and attendee count.
   ```bash
   node Query-1.js
   ```

2. **Run Query-2.js (Complex Search Query)**

   Finds events organized by a specific user or located in a particular venue, with optional RSVP deadline filtering.
   ```bash
   node Query-2.js
   ```

3. **Run Query-3.js (Counting Documents for a Specific User)**

   Counts the number of RSVP entries for a specific user.
   ```bash
   node Query-3.js
   ```

4. **Run Query-4.js (Update Query)**

   Updates the RSVP status of an attendee for a specific event, setting it to "Confirmed" if it is currently "Pending."
   ```bash
   node Query-4.js
   ```

5. **Run Query-5.js (Venue Availability and Resources Query)**

   Finds all available venues with a specific resource type and minimum capacity.
   ```bash
   node Query-5.js
   ```

## Explanation of Queries

Each query file performs a different type of MongoDB operation:
- **Query-1.js**: Uses MongoDB's aggregation framework to perform a lookup and count attendees per event.
- **Query-2.js**: Uses complex search criteria with `$or` operators to filter events based on organizer, venue, and RSVP deadlines.
- **Query-3.js**: Counts RSVP entries by projecting the size of the `rsvp` array for a specific user.
- **Query-4.js**: Updates a document using `$set` to change the RSVP status conditionally.
- **Query-5.js**: Filters venues based on availability, resource type, and capacity using a straightforward find query.

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running locally. The `uri` in each query file is set to `"mongodb://localhost:27017"`. If your MongoDB instance is configured differently, update this URI.
- **Data Not Returning**: If any query returns an empty result, double-check the criteria in the query to ensure it matches the values in your dataset. You can view the data directly in MongoDB to verify.

## License

This project is licensed under the MIT License.
