const CACHE_NAME = 'klusmaatje-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
  // Network-first strategie: altijd proberen van netwerk, anders cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache een kopie van succesvolle responses
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
