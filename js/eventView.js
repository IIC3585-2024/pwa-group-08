import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-analytics.js";
import {
  getMessaging,
  getToken,
  onMessage,
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCRw_yBOx-6O7XvGNpn7PRNShAr8aW9wxM",
  authDomain: "lebron-money.firebaseapp.com",
  projectId: "lebron-money",
  storageBucket: "lebron-money.appspot.com",
  messagingSenderId: "1048795771472",
  appId: "1:1048795771472:web:1993246b4c0bae6ca49755",
  measurementId: "G-VE43M3YCT9",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

const dbName = "my-database";
const dbVersion = 1;
let db;
const request = indexedDB.open(dbName, dbVersion);

request.onsuccess = function (event) {
  db = event.target.result;
  const eventId = getEventIdFromURL();
  getEventDetailsFromDB(eventId, async function (event) {
    try {
      await displayEventDetails(event);
    } catch (error) {
      console.error("Error displaying event details:", error);
    }
  });
};

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
      event.transactions.forEach((transaction, index) => {
        const paidStatus = transaction.paid ? "Pagado" : "No pagado";
        transactionsContainer.innerHTML += `
          <div class="transaction-card" data-paid=${transaction.paid}>
              <div class="transaction-details">
                  <div><i class="fas fa-user"></i> <span class="bold">${
                    transaction.paidBy
                  }</span> pagó</div>
                  <div><i class="fas fa-users"></i> Deuda de: <span class="bold">${transaction.owes.join(
                    ", "
                  )}</span></div>
                  <div>${transaction.description}</div>
                  <div>${paidStatus}</div>
              </div>
              <div class="transaction-amount">$${transaction.amount.toFixed(
                2
              )}</div>
              <button class="payTransactionBtn" data-index="${index}" ${
          transaction.paid ? "disabled" : ""
        }>${!transaction.paid ? "marcar como pagado" : "pagado"}</button>
              </div>`;
      });

      document.querySelectorAll(".payTransactionBtn").forEach((button) => {
        button.addEventListener("click", function () {
          const transactionIndex = parseInt(this.getAttribute("data-index"));
          markTransactionAsPaidInDB(
            event.id,
            transactionIndex,
            function (updatedEvent) {
              if (updatedEvent) {
                displayEventDetails(updatedEvent);
              } else {
                console.error("Failed to mark transaction as paid.");
              }
            }
          );
        });
      });

      resolve();
    } catch (error) {
      reject(error);
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

  paidBySelect.innerHTML = "";
  owesCheckboxes.innerHTML = "";

  eventParticipants.forEach((participant) => {
    const option = document.createElement("option");
    option.value = participant;
    option.textContent = participant;

    paidBySelect.appendChild(option);
  });

  eventParticipants.forEach((participant) => {
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
      checkbox.disabled = true;
    }
  });
}

document.getElementById("paidBy").addEventListener("change", function () {
  const paidByParticipant = this.value;
  const owesCheckboxes = document.querySelectorAll('input[name="owes"]');

  owesCheckboxes.forEach((checkbox) => {
    if (checkbox.value === paidByParticipant) {
      checkbox.disabled = true;
    } else {
      checkbox.disabled = false;
    }
  });
});

document
  .getElementById("addTransactionBtn")
  .addEventListener("click", function () {
    const eventParticipants = eventDetails.participants;
    const paidByParticipant = eventDetails.participants[0];
    updateTransactionForm(eventParticipants, paidByParticipant);
    document.getElementById("transactionFormContainer").style.display = "block";
  });

document
  .getElementById("transactionForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const paidBy = document.getElementById("paidBy").value;
    const owesCheckboxes = document.querySelectorAll(
      'input[name="owes"]:checked'
    );
    const owes = Array.from(owesCheckboxes).map((checkbox) => checkbox.value);

    const eventId = getEventIdFromURL();
    const newTransactionData = {
      description: description,
      amount: amount,
      paidBy: paidBy,
      owes: owes,
      paid: false,
    };

    addTransactionToEventInDB(
      eventId,
      newTransactionData,
      function (updatedEventDetails) {
        if (updatedEventDetails) {
          console.log(
            "Transaction added successfully. Updated event:",
            updatedEventDetails
          );
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
          const url = "https://fcm.googleapis.com/fcm/send";
          const headers = new Headers({
            Authorization:
              "key=AAAA9DEZclA:APA91bEwQn-MNERilpnGNjHGWDg_lT816lweoiLXNF0jWQbczEcCk_TlRJL6sSvtiTN2amZrIkMpnQMTU6kOr7HSQDeyL15sO0g-rdfT6TCJZN7TGHkcToQKMBj8dxKKBcsVMPfhELGb",
            "Content-Type": "application/json",
          });
          
          const payload = JSON.stringify({
            to: `${currentToken}`,
            notification: {
              title: "Transacciones",
              body: "Haz creado una nueva transacción",
            },
          });
      
          fetch(url, {
            method: "POST",
            headers: headers,
            body: payload,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Successfully sent message:", data);
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
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const closeButton = document.querySelector(".close");

  closeButton.addEventListener("click", function () {
    closeModal();
  });
});

function closeModal() {
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
}

function calculateBalances(eventDetails) {
  const balances = {};

  eventDetails.participants.forEach((participant) => {
    balances[participant] = 0;
  });

  eventDetails.transactions.forEach((transaction) => {
    console.log(transaction.paid);
    if (transaction.paid) {
      return;
    }
    const paidBy = transaction.paidBy;
    const amount = transaction.amount;
    const numOwes = transaction.owes.length;

    balances[paidBy] += amount - amount / (numOwes + 1);

    transaction.owes.forEach((participant) => {
      balances[participant] -= amount / (numOwes + 1);
    });

    Object.keys(balances).forEach((participant) => {
      balances[participant] = Math.round(balances[participant]);
    });
  });

  return balances;
}
