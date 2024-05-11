document.addEventListener('DOMContentLoaded', function() {
    const addParticipantBtn = document.getElementById('addParticipant');
    const attendeesContainer = document.getElementById('attendeesContainer');
    const createEventBtn = document.getElementById('createEventBtn');
  
    addParticipantBtn.addEventListener('click', function() {
      const participantDiv = document.createElement('div');
      participantDiv.classList.add('participant');
  
      const input = document.createElement('input');
      input.type = 'text';
      input.classList.add('participantName');
      input.name = 'attendees[]';
      input.placeholder = 'Enter name';
      input.required = true;
  
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.classList.add('removeParticipant');
      removeBtn.textContent = 'x';
      removeBtn.addEventListener('click', function() {
        participantDiv.remove();
      });
  
      participantDiv.appendChild(input);
      participantDiv.appendChild(removeBtn);
      attendeesContainer.insertBefore(participantDiv, addParticipantBtn);
    });
  
    createEventBtn.addEventListener('click', function() {
      if (validateForm()) {
        submitEventForm();
      } else {
        console.log('Please fill in all required fields and add at least two participants.');
      }
    });
  
    function validateForm() {
      const eventName = document.getElementById('eventName').value;
      const participantNames = document.querySelectorAll('.participantName');
      return eventName.trim() !== '' && participantNames.length >= 2 && areParticipantsValid(participantNames);
    }
  
    function areParticipantsValid(participantNames) {
      let validParticipants = 0;
      participantNames.forEach(function(participant) {
        if (participant.value.trim() !== '') {
          validParticipants++;
        }
      });
      return validParticipants >= 2;
    }
  
    function submitEventForm() {
      const eventName = document.getElementById('eventName').value;
      const participantInputs = document.querySelectorAll('.participantName');
      const participants = [];
      participantInputs.forEach(function(input) {
        if (input.value.trim() !== '') {
          participants.push(input.value.trim());
        }
      });
      // Call the addEventToDB function from indexedDB.js
      addEventToDB(eventName, participants);
      console.log('Event created:', eventName, participants);
    }
  });
