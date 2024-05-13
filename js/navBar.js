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
