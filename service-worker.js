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

// Se supone que estas funciones deberia hacer que se acctualice sola la pagina cuando haya conexion, pero no estan funcionando
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (url.origin === location.origin) {
    event.respondWith(cacheData(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheData(request) {
  const cachedResponse = await caches.match(request);
  return cachedResponse || fetch(request);
}
