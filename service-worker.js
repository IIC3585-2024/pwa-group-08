
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('oppo-pwa-cache-v1')
            .then(function(cache) {
                return cache.addAll([
                    '/',
                    '/index.html',
                    '/eventos.html',
                    '/images/icons/icon-72x72.png',
                    '/images/icons/icon-96x96.png',
                    '/images/icons/icon-128x128.png',
                    '/images/icons/icon-144x144.png',
                    '/images/icons/icon-152x152.png',
                    '/images/icons/icon-192x192.png',
                    '/images/icons/icon-384x384.png',
                    '/images/icons/icon-512x512.png',
                    '/images/god.jpg',
                    '/app.js',
                    '/indexedDB.js',
                    '/firebaseConfig.js',
                    '/styles.css',
                ]);
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    );
});

// Se supone que estas funciones deberia hacer que se acctualice sola la pagina cuando haya conexion, pero no estan funcionando
self.addEventListener('fetch', event => {
    const {request} = event;
    const url = new URL(request.url);
    if(url.origin === location.origin) {
        event.respondWith(cacheData(request));
    } else {
        event.respondWith(networkFirst(request));
    }

});

async function cacheData(request) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || fetch(request);
}

