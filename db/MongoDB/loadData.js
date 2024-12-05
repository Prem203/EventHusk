import fs from 'fs';
import Redis from 'ioredis';

// Initialize Redis connection
const redis = new Redis();

// Load JSON data
const events = JSON.parse(fs.readFileSync('./db/MongoDB/EventHusk.events.json', 'utf-8'));
const users = JSON.parse(fs.readFileSync('./db/MongoDB/EventHusk.users.json', 'utf-8'));
const venues = JSON.parse(fs.readFileSync('./db/MongoDB/EventHusk.venues.json', 'utf-8'));

// Function to load events
async function loadEvents() {
  for (const event of events) {
    const eventKey = `event:${event.event_id}`;
    await redis.hmset(eventKey, {
      event_id: event.event_id,
      event_name: event.event_name,
      event_description: event.event_description,
      date: event.date,
      time: event.time,
      rsvp_deadline: event.rsvp_deadline,
      user_id: event.user_id,
      venue_id: event.venue_id,
    });
    console.log(`Loaded event: ${event.event_name}`);
  }
}

// Function to load users
async function loadUsers() {
  for (const user of users) {
    const userKey = `user:${user.user_id}`;
    await redis.hmset(userKey, {
      user_id: user.user_id,
      user_name: user.user_name,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      email: user.email,
      contact: user.contact,
      type: user.type,
    });

    // Add RSVP data
    if (user.rsvp) {
      for (const rsvp of user.rsvp) {
        const rsvpKey = `rsvp:${rsvp.rsvp_id}`;
        await redis.hmset(rsvpKey, {
          rsvp_id: rsvp.rsvp_id,
          status: rsvp.status,
          date: rsvp.date,
          time: rsvp.time,
          event_id: rsvp.event_id,
          user_id: user.user_id,
        });
      }
    }

    // Add Feedback data
    if (user.feedback) {
      for (const feedback of user.feedback) {
        const feedbackKey = `feedback:${feedback.feedback_id}`;
        await redis.hmset(feedbackKey, {
          feedback_id: feedback.feedback_id,
          status: feedback.status,
          date: feedback.date,
          time: feedback.time,
          event_id: feedback.event_id,
          user_id: user.user_id,
        });
      }
    }

    console.log(`Loaded user: ${user.user_name}`);
  }
}

// Function to load venues
async function loadVenues() {
  for (const venue of venues) {
    const venueKey = `venue:${venue.venue_id}`;
    await redis.hmset(venueKey, {
      venue_id: venue.venue_id,
      venue_name: venue.venue_name,
      venue_location: venue.venue_location,
      capacity: venue.capacity,
      policies: venue.policies,
      availability_status: venue.availability_status,
      venue_supervisor: venue.venue_supervisor,
    });

    // Add resources
    if (venue.venue_resources) {
      for (const resource of venue.venue_resources) {
        const resourceKey = `venue:${venue.venue_id}:resource:${resource.resource_id}`;
        await redis.hmset(resourceKey, {
          resource_id: resource.resource_id,
          resource_type: resource.resource_type,
          contact_name: resource.contact_name,
          contact_details: resource.contact_details,
        });
      }
    }

    console.log(`Loaded venue: ${venue.venue_name}`);
  }
}

// Main function to load all data
async function loadData() {
  try {
    console.log('Loading events...');
    await loadEvents();

    console.log('Loading users...');
    await loadUsers();

    console.log('Loading venues...');
    await loadVenues();

    console.log('All data loaded successfully!');
  } catch (err) {
    console.error('Error loading data:', err);
  } finally {
    redis.quit();
  }
}

// Run the loader
loadData();
