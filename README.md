# EventHusk - Campus Events and Facility Booking System

This project demonstrates various MongoDB queries on a sample event management dataset for the **EventHusk** application. The project includes multiple JavaScript files, each executing different types of MongoDB queries, such as aggregation, complex search criteria, counting documents, and updating document fields. Additionally, it contains an application with routes and functionality for managing events, venues, and RSVPs.

---

## Project Structure

- `Query-1.js` - Aggregation query to count attendees for each event.
- `Query-2.js` - Complex search query to find events based on organizer or venue criteria.
- `Query-3.js` - Counts RSVP entries for a specific attendee.
- `Query-4.js` - Updates RSVP status based on specific conditions.
- `Query-5.js` - Finds available venues with specific resources and capacity.
- `routes/` - Contains route files for the Express.js application.
- `views/` - Contains EJS template files for rendering the UI.
- `app.js` - Entry point for the Node.js application.

---

## Prerequisites

1. **Node.js**: Install Node.js from [https://nodejs.org/](https://nodejs.org/) if you don't already have it.
2. **MongoDB**: Install MongoDB locally and start the MongoDB server on your machine. Refer to [MongoDB installation guide](https://docs.mongodb.com/manual/installation/).

---

## Setting Up the Project

1. **Clone the Repository**: Clone this GitHub repository to your local machine.
   ```bash
   git clone https://github.com/your-username/EventHusk.git
   cd EventHusk
   ```

2. **Install Dependencies**: Install all required Node.js modules.
   ```bash
   npm install
   ```

3. **Data Import**: Import the JSON files (`EventHusk.events.json`, `EventHusk.users.json`, and `EventHusk.venues.json`) into the `EventHusk` database. You can use the following commands in your terminal:
   ```bash
   mongoimport --db EventHusk --collection events --file db/MongoDB/EventHusk.events.json --jsonArray
   mongoimport --db EventHusk --collection users --file db/MongoDB/EventHusk.users.json --jsonArray
   mongoimport --db EventHusk --collection venues --file db/MongoDB/EventHusk.venues.json --jsonArray
   ```
   These commands assume the JSON files are in the `db/MongoDB/` directory.

4. **Run the Application**:
   Start the application using the following command:
   ```bash
   npm start
   ```
   This will start the server on `http://localhost:3000`.

---

## Running the Application

1. **Access the Web Application**:
   - Open your browser and navigate to `http://localhost:3000`.
   - The home page allows you to manage events and venues through a user-friendly interface.

2. **Features**:
   - **List Events**: View all events in the system.
   - **Edit Events**: Update event details such as name, description, date, time, RSVP deadlines, and venue.
   - **Delete Events**: Remove an event from the system.
   - **Venue Management**: View, add, edit, or delete venues along with their resources and availability.

---

## Executing Queries

The project also includes several standalone MongoDB queries for specific use cases. Each query is located in its own file. Below are instructions to run them:

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

---

## Troubleshooting

- **MongoDB Connection Issues**:
  Ensure MongoDB is running locally. The `uri` in each query file is set to `"mongodb://localhost:27017"`. If your MongoDB instance is configured differently, update this URI in the application and query files.

- **Data Not Returning**:
  If any query returns an empty result, double-check the criteria in the query to ensure it matches the values in your dataset. You can view the data directly in MongoDB to verify.

- **Application Errors**:
  If the application throws errors, ensure all dependencies are installed and the MongoDB database is correctly populated with the required collections (`events`, `venues`, `users`).

---

## License

This project is licensed under the MIT License.
