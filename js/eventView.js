

window.addEventListener('databaseOpened', function() {
    // Custom behavior for when the database is successfully opened
    console.log("aaaa")
    const eventId = getEventIdFromURL();
    getEventDetailsFromDB(eventId, function(event) {
        console.log(event)
        displayEventDetails(event);
    }
  );});

  function displayEventDetails(event) {
    document.getElementById('eventName').textContent = event.name;

    // Display participants
    const participantsContainer = document.getElementById('participants');
    participantsContainer.innerHTML = '<h2>Participants:</h2>';
    event.participants.forEach(participant => {
        participantsContainer.innerHTML += `<div>${participant}</div>`;
    });

    // Display balances (dummy data for now)
    // You'll need to replace this with actual balance calculation logic
    participantsContainer.innerHTML += '<h2>Balances:</h2>';
    event.participants.forEach(participant => {
        participantsContainer.innerHTML += `<div>${participant}: $100</div>`;
    });

    // Display transactions (dummy data for now)
    const transactionsContainer = document.getElementById('transactions');
    transactionsContainer.innerHTML = '<h2>Transactions:</h2>';
    event.transactions.forEach(transaction => {
        transactionsContainer.innerHTML += `<div>Description: ${transaction.description}</div>`;
        transactionsContainer.innerHTML += `<div>Amount: ${transaction.amount}</div>`;
        transactionsContainer.innerHTML += `<div>Paid By: ${transaction.paidBy}</div>`;
        transactionsContainer.innerHTML += `<div>Owes: ${transaction.owes.join(', ')}</div>`;
        transactionsContainer.innerHTML += '<hr>';
    });
}

// Dummy event data (replace with actual event data)
const dummyEvent = {
    name: 'Event 1',
    participants: ['Participant 1', 'Participant 2', 'Participant 3'],
    transactions: [
        { description: 'Transaction 1', amount: 50, paidBy: 'Participant 1', owes: ['Participant 2', 'Participant 3'] },
        { description: 'Transaction 2', amount: 30, paidBy: 'Participant 2', owes: ['Participant 1', 'Participant 3'] },
        { description: 'Transaction 3', amount: 20, paidBy: 'Participant 3', owes: ['Participant 1', 'Participant 2'] }
    ]
};

// Display event details
// displayEventDetails(dummyEvent);

// Function to add a new transaction
document.getElementById('addTransactionBtn').addEventListener('click', function() {
    // Implement functionality to add a new transaction
    console.log('Add Transaction button clicked');
});

function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdString = urlParams.get('id');
    // Parse the eventIdString to an integer
    const eventId = parseInt(eventIdString);
    // Check if parsing was successful
    if (!isNaN(eventId)) {
        return eventId;
    } else {
        // If parsing fails, return a default value or handle the error as needed
        return -1; // or any default value you prefer
    }
}