// eventView.js
window.addEventListener('databaseOpened', function() {
    const eventId = getEventIdFromURL();
    getEventDetailsFromDB(eventId, function(event) {
        displayEventDetails(event);
    });
});

let eventDetails;

function displayEventDetails(event) {
    eventDetails = event;
    document.getElementById('eventName').textContent = event.name;

    const balances = calculateBalances(event);
    const participantsContainer = document.getElementById('participants');
    participantsContainer.innerHTML = '<h2>Participants:</h2>';
    event.participants.forEach(participant => {
        participantsContainer.innerHTML += `<div>${participant}</div>`;
    });

    participantsContainer.innerHTML += '<h2>Balances:</h2>';
    event.participants.forEach(participant => {
        participantsContainer.innerHTML += `<div>${participant}: $${balances[participant]}</div>`;
    });

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

function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventIdString = urlParams.get('id');
    const eventId = parseInt(eventIdString);
    if (!isNaN(eventId)) {
        return eventId;
    } else {
        return -1;
    }
}

function updateTransactionForm(eventParticipants, paidByParticipant) {
    const paidBySelect = document.getElementById('paidBy');
    const owesCheckboxes = document.getElementById('owesCheckboxes');

    // Clear previous options and checkboxes
    paidBySelect.innerHTML = '';
    owesCheckboxes.innerHTML = '';

    // Add options for paidBy select element
    eventParticipants.forEach(participant => {
        const option = document.createElement('option');
        option.value = participant;
        option.textContent = participant;

        paidBySelect.appendChild(option);
    });

    // Add checkboxes for owes
    eventParticipants.forEach(participant => {
        // Exclude the paid participant
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'owes';
            checkbox.value = participant;
            checkbox.id = participant;
            const label = document.createElement('label');
            label.htmlFor = participant;
            label.textContent = participant;
            owesCheckboxes.appendChild(checkbox);
            owesCheckboxes.appendChild(label);
            owesCheckboxes.appendChild(document.createElement('br'));
            if (participant == paidByParticipant) { // Disable checkbox for paid participant
                checkbox.disabled = true;
            }
        
    });
}

document.getElementById('paidBy').addEventListener('change', function() {
    const paidByParticipant = this.value;
    const owesCheckboxes = document.querySelectorAll('input[name="owes"]');

    // Disable checkboxes for paid participant
    owesCheckboxes.forEach(checkbox => {
        if (checkbox.value === paidByParticipant) {
            checkbox.disabled = true;
        } else {
            checkbox.disabled = false;
        }
    });
});

// Event listener for adding transaction form
document.getElementById('addTransactionBtn').addEventListener('click', function() {
    // Retrieve event participants
    const eventParticipants = eventDetails.participants;

    // Get selected paidBy participant
    const paidByParticipant = eventDetails.participants[0];

    // Update transaction form with event participants and disable owed checkboxes for paid participant
    updateTransactionForm(eventParticipants, paidByParticipant);

    // Display the transaction form modal
    document.getElementById('transactionFormContainer').style.display = 'block';
});

// Function to handle form submission and add transaction to event
document.getElementById('transactionForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Retrieve form input values
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const paidBy = document.getElementById('paidBy').value;
    const owesCheckboxes = document.querySelectorAll('input[name="owes"]:checked');
    const owes = Array.from(owesCheckboxes).map(checkbox => checkbox.value);

    // Example usage:
    // Replace eventId with the actual ID of the event
    const eventId = getEventIdFromURL(); // Replace with the actual event ID
    const newTransactionData = {
        description: description,
        amount: amount,
        paidBy: paidBy,
        owes: owes
    };

    // Call the function to add transaction to event in IndexedDB
    addTransactionToEventInDB(eventId, newTransactionData, function(updatedEventDetails) {
        if (updatedEventDetails) {
            console.log('Transaction added successfully. Updated event:', updatedEventDetails);
            // Close the transaction form modal after successful addition of transaction
            document.getElementById('transactionFormContainer').style.display = 'none';
            displayEventDetails(updatedEventDetails);
        } else {
            console.error('Failed to add transaction to event.');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the close button element
    const closeButton = document.querySelector('.close');

    // Add event listener to the close button
    closeButton.addEventListener('click', function() {
        // Hide the modal when the close button is clicked
        closeModal();
    });
});

// Function to hide the modal
function closeModal() {
    const modal = document.querySelector('.modal');
    modal.style.display = 'none';
}

function calculateBalances(eventDetails) {
    const balances = {}; // Object to store participant balances

    // Initialize balances for all participants to 0
    eventDetails.participants.forEach(participant => {
        balances[participant] = 0;
    });

    // Iterate through each transaction and update balances accordingly
    eventDetails.transactions.forEach(transaction => {
        const paidBy = transaction.paidBy;
        const amount = transaction.amount;
        const numOwes = transaction.owes.length;

        // Add the total amount paid by the participant
        balances[paidBy] += amount - amount / (numOwes + 1);

        // Subtract the owed amount from each participant
        transaction.owes.forEach(participant => {
            balances[participant] -= amount / (numOwes + 1);
        });

        Object.keys(balances).forEach(participant => {
            balances[participant] = Math.round(balances[participant]);
        });

    });

    return balances;
}