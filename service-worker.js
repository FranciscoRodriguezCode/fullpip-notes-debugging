self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pip-notes-v1').then((cache) => {
            return cache.addAll([
                '/fullpip-notes-debugging/',
                '/fullpip-notes-debugging/index.html',
                '/fullpip-notes-debugging/styles/main.css',
                '/fullpip-notes-debugging/scripts/app.js',
                '/fullpip-notes-debugging/manifest.json',
                '/fullpip-notes-debugging/icons/icon-192x192.png',
                '/fullpip-notes-debugging/icons/icon-512x512.png'
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