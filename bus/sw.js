const CACHE_NAME = 'simple-pwa-cache-v1';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Theme.css',
  './cal.gif',
  './endpoint.gif',
  './actions.js',
  './weekA.html',
  './weekB.html',
  './zetbus_N_A.html',
  './zetbus_N_B.html',
  './zetbus_RD_A.html',
  './zetbus_RD_B.html',
  './zetbus_S_A.html',
  './zetbus_S_B.html',
  './favicon.png',
  './favicon-512.png',
  './favicon-maskable.png'
];

// Install event: saves files to the device
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA Caching assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// IMPROVEMENT: Activate event cleans up old caches when you update CACHE_NAME
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch event: serves saved files instantly when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return the cached file if we have it, otherwise fetch from the internet
      return cachedResponse || fetch(event.request);
    })
  );
});
