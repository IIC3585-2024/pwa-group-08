
window.addEventListener('databaseOpened', function() {
    // Custom behavior for when the database is successfully opened
    getEvents(renderEvents);
  });


function renderEvents(events) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = '';

    events.forEach((event) => {
        const eventItem = document.createElement('div');
        eventItem.textContent = event.name;
        eventList.appendChild(eventItem);
    });
}

// Call addDummyData when the button is clicked
document.getElementById('init-dummy-data').addEventListener('click', addDummyData);
