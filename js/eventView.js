// import { messaging } from "./firebaseConfig.js";
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRw_yBOx-6O7XvGNpn7PRNShAr8aW9wxM",
  authDomain: "lebron-money.firebaseapp.com",
  projectId: "lebron-money",
  storageBucket: "lebron-money.appspot.com",
  messagingSenderId: "1048795771472",
  appId: "1:1048795771472:web:1993246b4c0bae6ca49755",
  measurementId: "G-VE43M3YCT9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

const dbName = "my-database";
const dbVersion = 1;
let db;
// Open or create the IndexedDB database
const request = indexedDB.open(dbName, dbVersion);

request.onsuccess = function (event) {
  console.log("Database opened successfully 2");
  db = event.target.result;
  const eventId = getEventIdFromURL();
  console.log("Event ID:", eventId);
  getEventDetailsFromDB(eventId, async function (event) {
    try {
      await displayEventDetails(event);
    } catch (error) {
      console.error("Error displaying event details:", error);
    }
  });
};

// eventView.js

let eventDetails;

function displayEventDetails(event) {
  return new Promise((resolve, reject) => {
    try {
      eventDetails = event;
      document.getElementById("eventName").textContent = event.name;

      const balances = calculateBalances(event);
      const participantsContainer = document.getElementById("participants");
      participantsContainer.innerHTML = "<h2>Participantes y Balances</h2>";
      participantsContainer.innerHTML += '<div class="participants-list">';

      event.participants.forEach((participant) => {
        const balanceClass =
          balances[participant] >= 0 ? "positive" : "negative";
        participantsContainer.innerHTML += `
          <div class="participant-row">
              <div class="participant-name">${participant}</div>
              <div class="participant-balance ${balanceClass}">$${balances[
          participant
        ].toFixed(2)}</div>
          </div>`;
      });

      participantsContainer.innerHTML += "</div>";

      const transactionsContainer = document.getElementById("transactions");
      transactionsContainer.innerHTML = "<h2>Transacciones</h2>";
      event.transactions.forEach((transaction) => {
        transactionsContainer.innerHTML += `
          <div class="transaction-card">
              <div class="transaction-details">
                  <div><i class="fas fa-user"></i> <span class="bold">${
                    transaction.paidBy
                  }</span> pagó</div>
                  <div><i class="fas fa-users"></i> Deuda de: <span class="bold">${transaction.owes.join(
                    ", "
                  )}</span></div>
                  <div>${transaction.description}</div>
              </div>
              <div class="transaction-amount">$${transaction.amount.toFixed(
                2
              )}</div>
          </div>`;
      });

      resolve(); // Resolve the promise when the event details are successfully displayed
    } catch (error) {
      reject(error); // Reject the promise with the error if something goes wrong
    }
  });
}

function getEventIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const eventIdString = urlParams.get("id");
  const eventId = parseInt(eventIdString);
  if (!isNaN(eventId)) {
    return eventId;
  } else {
    return -1;
  }
}

function updateTransactionForm(eventParticipants, paidByParticipant) {
  const paidBySelect = document.getElementById("paidBy");
  const owesCheckboxes = document.getElementById("owesCheckboxes");

  // Clear previous options and checkboxes
  paidBySelect.innerHTML = "";
  owesCheckboxes.innerHTML = "";

  // Add options for paidBy select element
  eventParticipants.forEach((participant) => {
    const option = document.createElement("option");
    option.value = participant;
    option.textContent = participant;

    paidBySelect.appendChild(option);
  });

  // Add checkboxes for owes
  eventParticipants.forEach((participant) => {
    // Exclude the paid participant
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "owes";
    checkbox.value = participant;
    checkbox.id = participant;
    const label = document.createElement("label");
    label.htmlFor = participant;
    label.textContent = participant;
    owesCheckboxes.appendChild(checkbox);
    owesCheckboxes.appendChild(label);
    owesCheckboxes.appendChild(document.createElement("br"));
    if (participant == paidByParticipant) {
      // Disable checkbox for paid participant
      checkbox.disabled = true;
    }
  });
}

document.getElementById("paidBy").addEventListener("change", function () {
  const paidByParticipant = this.value;
  const owesCheckboxes = document.querySelectorAll('input[name="owes"]');

  // Disable checkboxes for paid participant
  owesCheckboxes.forEach((checkbox) => {
    if (checkbox.value === paidByParticipant) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
});

// Event listener for adding transaction form
document
  .getElementById("addTransactionBtn")
  .addEventListener("click", function () {
    // Retrieve event participants
    const eventParticipants = eventDetails.participants;

    // Get selected paidBy participant
    const paidByParticipant = eventDetails.participants[0];

    // Update transaction form with event participants and disable owed checkboxes for paid participant
    updateTransactionForm(eventParticipants, paidByParticipant);

    // Display the transaction form modal
    document.getElementById("transactionFormContainer").style.display = "block";
  });

// Function to handle form submission and add transaction to event
document
  .getElementById("transactionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Retrieve form input values
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const paidBy = document.getElementById("paidBy").value;
    const owesCheckboxes = document.querySelectorAll(
      'input[name="owes"]:checked'
    );
    const owes = Array.from(owesCheckboxes).map((checkbox) => checkbox.value);

    // Example usage:
    // Replace eventId with the actual ID of the event
    const eventId = getEventIdFromURL(); // Replace with the actual event ID
    const newTransactionData = {
      description: description,
      amount: amount,
      paidBy: paidBy,
      owes: owes,
    };

    // Call the function to add transaction to event in IndexedDB
    addTransactionToEventInDB(
      eventId,
      newTransactionData,
      function (updatedEventDetails) {
        if (updatedEventDetails) {
          console.log(
            "Transaction added successfully. Updated event:",
            updatedEventDetails
          );
          // Close the transaction form modal after successful addition of transaction
          document.getElementById("transactionFormContainer").style.display =
            "none";
          displayEventDetails(updatedEventDetails);
        } else {
          console.error("Failed to add transaction to event.");
        }
      }
    );

    getToken(messaging, {
      vapidKey:
        "BJsfJzSe96EAIRsfhMLjGwG-trA9Q_DhUwVoeS5iHOUoG4CSU0wVzds6_7Biipzms1KvLm3OhK-T0x1baVHjrys",
    })
      .then((currentToken) => {
        if (currentToken) {
          console.log("Puedo hacer el post con el token:", currentToken);
          // Post request can go here or any other operation that requires messaging
          const url = "https://fcm.googleapis.com/fcm/send";
          const headers = new Headers({
            Authorization:
              "key=AAAA9DEZclA:APA91bEwQn-MNERilpnGNjHGWDg_lT816lweoiLXNF0jWQbczEcCk_TlRJL6sSvtiTN2amZrIkMpnQMTU6kOr7HSQDeyL15sO0g-rdfT6TCJZN7TGHkcToQKMBj8dxKKBcsVMPfhELGb",
            "Content-Type": "application/json",
          });
          // Define the payload
          const payload = JSON.stringify({
            to: `${currentToken}`,
            notification: {
              title: "Transacciones",
              body: "Haz creado una nueva transacción",
            },
          });
          // Make the fetch request
          fetch(url, {
            method: "POST",
            headers: headers,
            body: payload,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Successfully sent message:", data);
              // Insert notification for user 2 seconds after the message is sent
              // showNotification();
            })
            .catch((error) => {
              console.error("Error sending message:", error);
            });
        } else {
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token.", err);
      });
  });

  onMessage(messaging, (payload) => {
    console.log("Message received. ", payload.notification.body);
    showNotification(payload.notification.body);
  });

function showNotification(body) {
  const notification = document.getElementById("notification");
  notification.innerHTML = body;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000); // La notificación desaparece después de 3 segundos
}

document.addEventListener("DOMContentLoaded", function () {
  // Get the close button element
  const closeButton = document.querySelector(".close");

  // Add event listener to the close button
  closeButton.addEventListener("click", function () {
    // Hide the modal when the close button is clicked
    closeModal();
  });
});

// Function to hide the modal
function closeModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
}

function calculateBalances(eventDetails) {
  const balances = {}; // Object to store participant balances

  // Initialize balances for all participants to 0
  eventDetails.participants.forEach((participant) => {
    balances[participant] = 0;
  });

  // Iterate through each transaction and update balances accordingly
  eventDetails.transactions.forEach((transaction) => {
    const paidBy = transaction.paidBy;
    const amount = transaction.amount;
    const numOwes = transaction.owes.length;

    // Add the total amount paid by the participant
    balances[paidBy] += amount - amount / (numOwes + 1);

    // Subtract the owed amount from each participant
    transaction.owes.forEach((participant) => {
      balances[participant] -= amount / (numOwes + 1);
    });

    Object.keys(balances).forEach((participant) => {
      balances[participant] = Math.round(balances[participant]);
    });
  });

  return balances;
}
