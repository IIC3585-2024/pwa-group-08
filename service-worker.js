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
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    // If the request method is not safe, simply fetch from the network without caching
    if (await fetch(request)) return fetch(request);
  }

  // Check if the requested resource is in the cache
  const cachedResponse = await caches.match(request);

  // If it's in the cache, return the cached response
  if (cachedResponse) {
    return cachedResponse;
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