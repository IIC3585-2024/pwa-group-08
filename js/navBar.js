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
  console.log("Requesting permission...");
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
    }
  });
}

function openNav() {
  document.getElementById("sideMenu").style.width = "300px";
  document.getElementById("contentArea").style.marginLeft = "300px";
}

function closeNav() {
  document.getElementById("sideMenu").style.width = "0";
  document.getElementById("contentArea").style.marginLeft = "0";
}
