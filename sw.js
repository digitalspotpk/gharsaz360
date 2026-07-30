/* ==========================================================================
   GharSaz 360 â€” Service Worker
   Strategy: Cache-First for the app shell (works 100% offline after the
   first successful load), with a network-falling-back-to-cache approach
   for anything not pre-cached, and automatic cleanup of old caches on
   activate. Bump CACHE_VERSION whenever you change any cached file so
   returning users get the update.
   ========================================================================== */

const CACHE_VERSION = 'gharsaz360-v1.9.0';
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './privacy-policy.html',
  './404.html',
  './icon-192.png',
  './icon-512.png',
  './maskable-icon-512.png',
  './apple-touch-icon.png',
  './favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET requests; let everything else pass through to the network.
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached; // Cache-First

      return fetch(req)
        .then((networkRes) => {
          // Only cache same-origin, successful responses.
          if (networkRes && networkRes.status === 200 && req.url.startsWith(self.location.origin)) {
            const clone = networkRes.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(req, clone));
          }
          return networkRes;
        })
        .catch(() => {
          // Offline and not cached: fall back to the app shell for navigations.
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('Offline â€” resource not cached.', { status: 503, statusText: 'Offline' });
        });
    })
  );
});
