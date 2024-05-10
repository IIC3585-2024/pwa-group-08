if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js')
            .then(function(registration) {
                console.log('Service Worker registered with scope:', registration.scope);
            }, function(err) {
                console.log('Service Worker registration failed:', err);
            });
    });
}

let counter = 0;

function incrementCounter() {
    counter++;
    updateCounterDisplay();
}

function decrementCounter() {
    if (counter > 0) {
        counter--;
        updateCounterDisplay();
    }
}

function updateCounterDisplay() {
    const counterElement = document.getElementById('counter');
    counterElement.textContent = counter;
}

function openNav() {
    document.getElementById("sideMenu")
        .style.width = "300px";
    document.getElementById("contentArea")
        .style.marginLeft = "300px";
}
 
function closeNav() {
    document.getElementById("sideMenu")
        .style.width = "0";
    document.getElementById("contentArea")
        .style.marginLeft = "0";
}
 
function showContent(content) {
    document.getElementById("contentTitle")
        .textContent = content + " page";
         
    closeNav();
}