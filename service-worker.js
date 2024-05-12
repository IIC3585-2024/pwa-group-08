self.addEventListener("install", function (event) {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open("oppo-pwa-cache-v1");
        await cache.addAll([
          "",
          "/",
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

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Respond with network request first, fallback to cache if network fails
  event.respondWith(networkFirst(request));
});

async function networkFirst(request) {
  try {
    // Try fetching from network
    const response = await fetch(request);
    // If successful, clone the response and cache it
    const clonedResponse = response.clone();
    caches.open("oppo-pwa-cache-v1").then((cache) => {
      cache.put(request, clonedResponse);
    });
    return response;
  } catch (error) {
    // If network fetch fails, try to return from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // If not cached, throw the error
    throw error;
  }
}
