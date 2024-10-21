CREATE TABLE "Users" (
	"userID"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL,
	"name"	TEXT,
	"email"	TEXT,
	"contact"	TEXT,
	"userType"	TEXT,
	PRIMARY KEY("userID" AUTOINCREMENT)
);

CREATE TABLE "Events" (
	"eventID"	INTEGER NOT NULL,
	"userID"	INTEGER NOT NULL,
	"eventName"	TEXT,
	"eventDescription"	TEXT,
	"date"	TEXT,
	"time"	TEXT,
	"rsvpDeadline"	TEXT,
	PRIMARY KEY("eventID" AUTOINCREMENT),
	FOREIGN KEY("userID") REFERENCES "Users"("userID")
);

CREATE TABLE "EventVenueMapping" (
	"eventID"	INTEGER NOT NULL,
	"venueID"	INTEGER NOT NULL,
	PRIMARY KEY("eventID","venueID"),
	FOREIGN KEY("eventID") REFERENCES "Events"("eventID"),
	FOREIGN KEY("venueID") REFERENCES "Users"("userID")
);

CREATE TABLE "Venue" (
	"venueID"	INTEGER NOT NULL,
	"venueName"	TEXT,
	"location"	TEXT,
	"capacity"	INTEGER,
	"policies"	TEXT,
	"availabilityStatus"	TEXT,
	"personResponsible"	TEXT,
	PRIMARY KEY("venueID" AUTOINCREMENT)
);

CREATE TABLE "VenueResources" (
	"resourceID"	INTEGER NOT NULL,
	"resourceType"	TEXT NOT NULL,
	"handler"	TEXT,
	"contactDetails"	TEXT,
	PRIMARY KEY("resourceID" AUTOINCREMENT)
);

CREATE TABLE "RSVP" (
	"rsvpID"	INTEGER NOT NULL,
	"userID"	INTEGER NOT NULL,
	"status"	TEXT,
	"link"	TEXT,
	"date"	TEXT,
	"time"	TEXT,
	PRIMARY KEY("rsvpID" AUTOINCREMENT),
	FOREIGN KEY("userID") REFERENCES "Users"("userID")
);

CREATE TABLE "EventFeedback" (
	"feedbackID"	INTEGER NOT NULL,
	"userID"	INTEGER NOT NULL,
	"comments"	TEXT,
	"date"	TEXT,
	"time"	TEXT,
	PRIMARY KEY("feedbackID" AUTOINCREMENT),
	FOREIGN KEY("userID") REFERENCES "Users"("userID")
);

CREATE TABLE "VenueResourcesMapping" (
	"venueID"	INTEGER NOT NULL,
	"resourceID"	INTEGER NOT NULL,
	PRIMARY KEY("venueID","resourceID"),
	FOREIGN KEY("resourceID") REFERENCES "VenueResources"("resourceID"),
	FOREIGN KEY("venueID") REFERENCES "Venue"("venueID")
);

CREATE TABLE "RSVPFeedbackValidation" (
	"rsvpID"	INTEGER NOT NULL,
	"userID"	INTEGER NOT NULL,
	"feedbackID"	INTEGER,
	"eventID"	INTEGER NOT NULL,
	PRIMARY KEY("rsvpID"),
	FOREIGN KEY("eventID") REFERENCES "Events"("eventID"),
	FOREIGN KEY("feedbackID") REFERENCES "EventFeedback"("feedbackID"),
	FOREIGN KEY("rsvpID") REFERENCES "RSVP"("rsvpID"),
	FOREIGN KEY("userID") REFERENCES "Users"("userID")
);