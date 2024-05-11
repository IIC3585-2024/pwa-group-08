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

// if(window.Notification) {
//     if(Notification.permission === 'granted') {
//       send_notification();
//     } else if(Notification.permission !== 'denied') {
//       Notification.requestPermission(permission => {
//         if(permission === 'granted') {
//            send_notification();
//         }
//       })
//     }
//   }

//   function showNotification() {
//     let notificationOptions = {
//       body: 'Some Notification information',
//       icon: '<>'
//     }
//     let notif = new Notification('My New Notification', notificationOptions);
  
//     notif.onclick = () => {
//       console.log('Notification clicked');
//     }
//   }

  function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    });
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