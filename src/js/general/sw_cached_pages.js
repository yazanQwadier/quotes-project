const cacheName = "v1";

const cacheAssets = [
    '/quotes-project/dist/index.bundle.js',
    '/quotes-project/index.html',
    '/quotes-project/assets/waves.gif',
];

self.addEventListener('install', function(e){
    console.log('service worker: installing');

    e.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching Files');
                return cache.addAll(cacheAssets);
            })
            .then(() => {
                self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function(e) {
    console.log('activate');

    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key !== cacheName) {
                        console.log('clearing old cache');
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function(e){
    e.respondWith(
        fetch(e.request)
        .catch(() => caches.match(e.request))
    )
});