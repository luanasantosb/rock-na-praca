const CACHE_NAME = 'rock-na-praca-v1';
const assets = [
  '/',
  '/index.html',
  '/assets/CSS/estilo.css',
  '/assets/JS/script.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});