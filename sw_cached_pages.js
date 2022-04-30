const cacheName = "v1";

const cacheAssets = [
    '/index.html',
    '/assets/waves.gif',
    '/assets/books.png',
    '/dist/index.bundle.js',
    '/dist/assets/Cairo-Regular.ttf',
    '/dist/assets/Harmattan-Regular.ttf',
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

    e.respondWith(async function() {
        console.log(e.request.url);

        let url = new URL(e.request.url);
        url = (url.pathname == '/')? url + 'index.html' : url;
        return fetch(e.request).catch((err) => caches.match(url));
      }());
});