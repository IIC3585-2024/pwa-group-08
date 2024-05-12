window.addEventListener("databaseOpened", function () {
  // Custom behavior for when the database is successfully opened
  getEvents(renderEvents);
});

function renderEvents(events) {
  const eventList = document.getElementById("eventsList");
  eventList.innerHTML = ""; // Limpia el contenido existente

  events.forEach((event) => {
    console.log(`event.name: ${event.name}`); // Log para depuración
    const eventItem = document.createElement("div");
    eventItem.classList.add("event-item"); // Añade la clase para estilos
    eventItem.textContent = event.name; // Establece el nombre del evento
    eventItem.onclick = function () {
      // Agrega un manejador de clic
      // Redirige al usuario a la página del evento con el nombre del evento como parámetro
      location.href = `eventView.html?id=${encodeURIComponent(event.id)}`;
    };
    eventList.appendChild(eventItem); // Añade el evento al contenedor
  });
}
