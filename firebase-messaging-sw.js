const firebaseConfig = {
  apiKey: "AIzaSyCRw_yBOx-6O7XvGNpn7PRNShAr8aW9wxM",
  authDomain: "lebron-money.firebaseapp.com",
  projectId: "lebron-money",
  storageBucket: "lebron-money.appspot.com",
  messagingSenderId: "1048795771472",
  appId: "1:1048795771472:web:1993246b4c0bae6ca49755",
  measurementId: "G-VE43M3YCT9",
};

importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
});

self.addEventListener("install", function (event) {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open("oppo-pwa-cache-v1");
        await cache.addAll([
          "",
          "index.html",
          "createEvent.html",
          "eventView.html",
          "images/icons/icon-72x72.png",
          "images/icons/icon-96x96.png",
          "images/icons/icon-128x128.png",
          "images/icons/icon-144x144.png",
          "images/icons/icon-152x152.png",
          "images/icons/icon-192x192.png",
          "images/icons/icon-384x384.png",
          "images/icons/icon-512x512.png",
          "images/god.jpg",
          "js/app.js",
          "js/indexedDB.js",
          "js/createEvent.js",
          "js/eventView.js",
          "js/index.js",
          "js/navBar.js",
          "js/firebaseConfig.js",
          "styles/index.css",
          "styles/sidebar.css",
          "styles/eventView.css",
          "styles/eventFormStyles.css",
        ]);
      } catch (error) {
        console.error("Cache installation failed:", error);
        throw error;
      }
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {

  const urlWithoutParams = new URL(request.url);
  urlWithoutParams.search = "";

  const cachedResponse = await caches.match(urlWithoutParams);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.error("Error fetching:", error);
    throw error;
  }
}
