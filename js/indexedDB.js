const dbName = "my-database";
const dbVersion = 1;
let db;
const request = indexedDB.open(dbName, dbVersion);

const databaseOpenedEvent = new Event("databaseOpened");

request.onsuccess = function (event) {
  console.log("Database opened successfully");
  db = event.target.result;
  window.dispatchEvent(databaseOpenedEvent);
};

request.onupgradeneeded = (event) => {
  const db = event.target.result;

  if (!db.objectStoreNames.contains("events")) {
    db.createObjectStore("events", { keyPath: "id", autoIncrement: true });
  }

  if (!db.objectStoreNames.contains("transactions")) {
    db.createObjectStore("transactions", {
      keyPath: "id",
      autoIncrement: true,
    });
  }

  if (!db.objectStoreNames.contains("people")) {
    db.createObjectStore("people", { keyPath: "id", autoIncrement: true });
  }
};

function getEvents(callback) {
  const transaction = db.transaction("events", "readonly");
  const store = transaction.objectStore("events");

  const request = store.getAll();

  request.onsuccess = function (event) {
    const events = event.target.result;
    console.log("Events retrieved successfully:", events);
    callback(events);
  };

  request.onerror = function (event) {
    console.error("Error getting events:", event.target.error);
  };
}
request.onerror = (event) => {
  console.error("IndexedDB error:", event.target.error);
};

function getEventDetailsFromDB(eventId, callback) {

  const transaction = db.transaction("events", "readonly");
  const store = transaction.objectStore("events");

  const request = store.get(eventId);

  request.onsuccess = function (event) {
    const eventData = event.target.result;
    if (eventData) {
      const eventDetails = {
        id: eventData.id,
        name: eventData.name,
        participants: eventData.participants,
        transactions: eventData.transactions || [],
      };
      callback(eventDetails); 
    } else {
      console.error("Event not found for ID:", eventId);
      callback(null);
    }
  };

  request.onerror = function (event) {
    console.error("Error fetching event details:", event.target.error);
    callback(null);
  };
}

function addEventToDB(eventName, participantNames) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("events", "readwrite");
    const store = transaction.objectStore("events");

    const event = {
      name: eventName,
      participants: participantNames,
      transactions: [],
    };

    const request = store.add(event);

    request.onsuccess = function (event) {
      const eventId = event.target.result;
      console.log("Event created and added successfully:", eventId);
      resolve(eventId);
    };

    request.onerror = function (event) {
      console.error("Error creating event:", event.target.error);
      reject(event.target.error);
    };
  });
}

function addTransactionToEventInDB(eventId, newTransactionData, callback) {
  const transaction = db.transaction("events", "readwrite");
  const store = transaction.objectStore("events");
  const getRequest = store.get(eventId);

  getRequest.onsuccess = function (event) {
    const eventRecord = event.target.result;
    if (eventRecord) {
      eventRecord.transactions.push(newTransactionData);
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

  const getRequest = store.get(eventId);

  getRequest.onsuccess = function (event) {
    const eventRecord = event.target.result;
    if (eventRecord) {
      if (transactionIndex >= 0 && transactionIndex < eventRecord.transactions.length) {
        eventRecord.transactions[transactionIndex].paid = true;      
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