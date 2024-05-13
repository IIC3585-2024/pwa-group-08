window.addEventListener("databaseOpened", function () {
  getEvents(renderEvents);
});

function renderEvents(events) {
  const eventList = document.getElementById("eventsList");
  eventList.innerHTML = "";

  events.forEach((event) => {
    const eventItem = document.createElement("div");
    eventItem.classList.add("event-item"); 
    eventItem.textContent = event.name; 
    eventItem.onclick = function () {
      
      location.href = `eventView.html?id=${encodeURIComponent(event.id)}`;
    };
    eventList.appendChild(eventItem); 
  });
}
