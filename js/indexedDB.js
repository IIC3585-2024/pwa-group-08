// Define the database name and version
const dbName = "my-database";
const dbVersion = 1;
let db;
// Open or create the IndexedDB database
const request = indexedDB.open(dbName, dbVersion);

const databaseOpenedEvent = new Event("databaseOpened");

request.onsuccess = function (event) {
  console.log("Database opened successfully");
  db = event.target.result;
  window.dispatchEvent(databaseOpenedEvent); // Dispatch the custom event
};

// Handle database upgrade (called when the version changes)
request.onupgradeneeded = (event) => {
  const db = event.target.result;

  // Create an object store for events
  if (!db.objectStoreNames.contains("events")) {
    db.createObjectStore("events", { keyPath: "id", autoIncrement: true });
  }

  // Create an object store for transactions
  if (!db.objectStoreNames.contains("transactions")) {
    db.createObjectStore("transactions", {
      keyPath: "id",
      autoIncrement: true,
    });
  }

  // Create an object store for people
  if (!db.objectStoreNames.contains("people")) {
    db.createObjectStore("people", { keyPath: "id", autoIncrement: true });
  }
};

// Handle successful database opening
function getEvents(callback) {
  const transaction = db.transaction("events", "readonly");
  const store = transaction.objectStore("events");

  const request = store.getAll();

  request.onsuccess = function (event) {
    const events = event.target.result;
    console.log("Events retrieved successfully:", events);

    // Call the callback function passing the retrieved events
    callback(events);
  };

  request.onerror = function (event) {
    console.error("Error getting events:", event.target.error);
  };
}
// Handle errors
request.onerror = (event) => {
  console.error("IndexedDB error:", event.target.error);
};

// Function to render events on the page

async function addDummyData() {
  const transaction = db.transaction("events", "readwrite");
  const store = transaction.objectStore("events");

  // Clear existing events
  const clearRequest = store.clear();

  clearRequest.onsuccess = function () {
    console.log("Previous events cleared successfully");

    // Add new events
    const dummyEvents = [
      {
        name: "Event 1aa",
        people: ["Person A", "Person B", "Person C"],
        transactions: [
          {
            amount: 50,
            paidBy: "Person A",
            owes: ["Person B", "Person C"],
          },
          {
            amount: 30,
            paidBy: "Person B",
            owes: ["Person A", "Person C"],
          },
        ],
      },
      {
        name: "Event 2",
        people: ["Person B", "Person C", "Person D"],
        transactions: [
          {
            amount: 60,
            paidBy: "Person C",
            owes: ["Person B", "Person D"],
          },
          {
            amount: 40,
            paidBy: "Person D",
            owes: ["Person B", "Person C"],
          },
        ],
      },
    ];

    dummyEvents.forEach((event) => {
      const request = store.add(event);

      request.onsuccess = function () {
        console.log("Event added successfully:", event);
      };

      request.onerror = function (event) {
        console.error("Error adding event:", event.target.error);
      };
    });
  };

  clearRequest.onerror = function (event) {
    console.error("Error clearing events:", event.target.error);
  };
}

function getEventDetailsFromDB(eventId, callback) {
  // Assuming db is already initialized and accessible globally

  console.log(eventId, "eventId");
  const transaction = db.transaction("events", "readonly");
  const store = transaction.objectStore("events");

  const request = store.get(eventId);

  request.onsuccess = function (event) {
    const eventData = event.target.result;
    console.log("eventData", eventData, event);
    if (eventData) {
      // Extract event details
      const eventDetails = {
        id: eventData.id,
        name: eventData.name,
        participants: eventData.participants,
        transactions: eventData.transactions || [], // Handle case where transactions array might be missing
      };
      callback(eventDetails); // Call the callback function passing the event details
    } else {
      console.error("Event not found for ID:", eventId);
      // Call the callback function with null or undefined if event not found
      callback(null);
    }
  };

  request.onerror = function (event) {
    console.error("Error fetching event details:", event.target.error);
    // Call the callback function with null or undefined in case of error
    callback(null);
  };
}

function addEventToDB(eventName, participantNames) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("events", "readwrite");
    const store = transaction.objectStore("events");

    // Define the event object
    const event = {
      name: eventName,
      participants: participantNames,
      transactions: [],
    };

    // Add the event object to the object store
    const request = store.add(event);

    request.onsuccess = function (event) {
      const eventId = event.target.result;
      console.log("Event created and added successfully:", eventId);
      // Resolve the promise with the ID of the newly created event
      resolve(eventId);
    };

    request.onerror = function (event) {
      console.error("Error creating event:", event.target.error);
      // Reject the promise with the error
      reject(event.target.error);
    };
  });
}

function addTransactionToEventInDB(eventId, newTransactionData, callback) {
  const transaction = db.transaction("events", "readwrite");
  const store = transaction.objectStore("events");

  // Retrieve the event from the database
  const getRequest = store.get(eventId);

  getRequest.onsuccess = function (event) {
    const eventRecord = event.target.result;
    console.log(eventRecord, "eventRecord");
    if (eventRecord) {
      // Append the new transaction to the event's transactions array
      eventRecord.transactions.push(newTransactionData);
      // Update the event in the database
      const updateRequest = store.put(eventRecord);
      updateRequest.onsuccess = function () {
        console.log("Transaction added to event:", eventId);
        callback(eventRecord);
      };
      updateRequest.onerror = function (event) {
        console.error("Error adding transaction to event:", event.target.error);
        callback(null);
      };
    } else {
      console.error("Event not found for ID:", eventId);
      callback(null);
    }
  };

  getRequest.onerror = function (event) {
    console.error("Error fetching event record:", event.target.error);
    callback(null);
  };
}

function markTransactionAsPaidInDB(eventId, transactionIndex, callback) {
  const transaction = db.transaction("events", "readwrite");
  const store = transaction.objectStore("events");

  // Retrieve the event from the database
  const getRequest = store.get(eventId);

  getRequest.onsuccess = function (event) {
    const eventRecord = event.target.result;
    console.log(eventRecord, "eventRecord");
    if (eventRecord) {
      // Check if the transaction index is valid
      if (transactionIndex >= 0 && transactionIndex < eventRecord.transactions.length) {
        // Mark the transaction as paid
        eventRecord.transactions[transactionIndex].paid = true;
        
        // Update the event in the database
        const updateRequest = store.put(eventRecord);
        updateRequest.onsuccess = function () {
          console.log("Transaction marked as paid in event:", eventId);
          callback(eventRecord);
        };
        updateRequest.onerror = function (event) {
          console.error("Error marking transaction as paid in event:", event.target.error);
          callback(null);
        };
      } else {
        console.error("Invalid transaction index:", transactionIndex);
        callback(null);
      }
    } else {
      console.error("Event not found for ID:", eventId);
      callback(null);
    }
  };

  getRequest.onerror = function (event) {
    console.error("Error fetching event record:", event.target.error);
    callback(null);
  };
}