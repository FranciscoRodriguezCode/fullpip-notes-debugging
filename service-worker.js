self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pip-notes-v1').then((cache) => {
            return cache.addAll([
                '/fullpip-notes/',
                '/fullpip-notes/index.html',
                '/fullpip-notes/styles/main.css',
                '/fullpip-notes/scripts/app.js',
                '/fullpip-notes/manifest.json',
                '/fullpip-notes/icons/icon-192x192.png',
                '/fullpip-notes/icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});