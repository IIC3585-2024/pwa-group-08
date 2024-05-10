// Define the database name and version
const dbName = 'my-database';
const dbVersion = 1;
let db;
// Open or create the IndexedDB database
const request = indexedDB.open(dbName, dbVersion);

request.onsuccess = function(event) {
    console.log('Database opened successfully');
    db = event.target.result;

    // Render events after the database is opened
    getAndRenderEvents();
};

// Handle database upgrade (called when the version changes)
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    
    // Create an object store for events
    if (!db.objectStoreNames.contains('events')) {
        db.createObjectStore('events', { keyPath: 'id', autoIncrement: true });
    }
    
    // Create an object store for transactions
    if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
    }
    
    // Create an object store for people
    if (!db.objectStoreNames.contains('people')) {
        db.createObjectStore('people', { keyPath: 'id', autoIncrement: true });
    }
};

// Handle successful database opening
function getAndRenderEvents() {
    const transaction = db.transaction('events', 'readonly');
    const store = transaction.objectStore('events');

    const request = store.getAll();

    request.onsuccess = function(event) {
        const events = event.target.result;
        console.log('Events retrieved successfully:', events);

        // Render the events on the page
        renderEvents(events);
    };

    request.onerror = function(event) {
        console.error('Error getting events:', event.target.error);
    };
}
// Handle errors
request.onerror = (event) => {
    console.error('IndexedDB error:', event.target.error);
};


// Function to render events on the page
function renderEvents(events) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';

    events.forEach((event) => {
        const eventItem = document.createElement('div');
        eventItem.textContent = event.name;
        eventList.appendChild(eventItem);
    });
}

async function addDummyData() {
    const transaction = db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');

    // Clear existing events
    const clearRequest = store.clear();

    clearRequest.onsuccess = function() {
        console.log('Previous events cleared successfully');
        
        // Add new events
        const dummyEvents = [
            {
                name: 'Event 1',
                people: ['Person A', 'Person B', 'Person C'],
                transactions: [
                    {
                        amount: 50,
                        paidBy: 'Person A',
                        owes: ['Person B', 'Person C']
                    },
                    {
                        amount: 30,
                        paidBy: 'Person B',
                        owes: ['Person A', 'Person C']
                    }
                ]
            },
            {
                name: 'Event 2',
                people: ['Person B', 'Person C', 'Person D'],
                transactions: [
                    {
                        amount: 60,
                        paidBy: 'Person C',
                        owes: ['Person B', 'Person D']
                    },
                    {
                        amount: 40,
                        paidBy: 'Person D',
                        owes: ['Person B', 'Person C']
                    }
                ]
            }
        ];

        dummyEvents.forEach(event => {
            const request = store.add(event);

            request.onsuccess = function() {
                console.log('Event added successfully:', event);
            };

            request.onerror = function(event) {
                console.error('Error adding event:', event.target.error);
            };
        });
        getAndRenderEvents();
    };

    clearRequest.onerror = function(event) {
        console.error('Error clearing events:', event.target.error);
    };
}

// Call addDummyData when the button is clicked
document.getElementById('init-dummy-data').addEventListener('click', addDummyData);