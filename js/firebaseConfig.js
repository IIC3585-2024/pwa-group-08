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
navigator.serviceWorker.getRegistration().then((registration) => {
  getToken(messaging, {
    serviceWorkerRegistration: registration,
    vapidKey:
      "BJsfJzSe96EAIRsfhMLjGwG-trA9Q_DhUwVoeS5iHOUoG4CSU0wVzds6_7Biipzms1KvLm3OhK-T0x1baVHjrys",
  })
    .then((currentToken) => {
      if (currentToken) {
        console.log("Token", currentToken);
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);

    });
});
