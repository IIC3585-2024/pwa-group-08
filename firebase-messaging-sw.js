// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
const firebaseConfig = {
  apiKey: "AIzaSyCRw_yBOx-6O7XvGNpn7PRNShAr8aW9wxM",
  authDomain: "lebron-money.firebaseapp.com",
  projectId: "lebron-money",
  storageBucket: "lebron-money.appspot.com",
  messagingSenderId: "1048795771472",
  appId: "1:1048795771472:web:1993246b4c0bae6ca49755",
  measurementId: "G-VE43M3YCT9"
};

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  /* const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };*/

  // self.registration.showNotification(notificationTitle, notificationOptions);
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
        throw error; // Rethrow the error to indicate installation failure
      }
    })()
  );
});

// Se supone que estas funciones deberia hacer que se acctualice sola la pagina cuando haya conexion, pero no estan funcionando
self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Respond with cached resources if available, otherwise fetch from network
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  // Check if the request method is safe (GET or HEAD)


  // Check if the requested resource is in the cache
  const cachedResponse = await caches.match(request);

  // If it's in the cache, return the cached response
  if (cachedResponse) {
    return cachedResponse;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // If the request method is not safe, simply fetch from the network without caching
    return await fetch(request) ;
  }
  
  // If it's not in the cache, fetch from the network
  try {
    const response = await fetch(request);
    // Clone the response because it can be consumed only once
    const clonedResponse = response.clone();
    // Open the cache and add the fetched response for future use
    caches.open("oppo-pwa-cache-v1").then((cache) => {
      cache.put(request, clonedResponse);
    });
    return response;
  } catch (error) {
    // Handle fetch errors
    console.error("Error fetching:", error);
    throw error;
  }
}
