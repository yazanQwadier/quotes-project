const cacheName = "v1";

const cacheAssets = [
    '/dist/index.bundle.js',
    '/index.html',
    '/assets/waves.gif',
    '/assets/books.png',
    '/assets/fonts/Cairo/Cairo-Regular.ttf',
    '/assets/fonts/Harmattan/Harmattan-Regular.ttf',
];


self.addEventListener('install', function(e){
    console.log('service worker: installing');

    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(cacheAssets);
            })
            .then(() => {
                self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(e) {
    console.log('service worker: activate');

    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(e) {
    console.log('service worker: fetch');

    e.respondWith(
        fetch(e.request)
        .catch(() => caches.match(e.request))
    )
});