/**
 * Chamil Kalong Portfolio - Service Worker (Offline Support & Caching)
 */

const CACHE_NAME = 'chamil-portfolio-v1.0.3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './admin.html',
  './assets/css/style.css',
  './assets/js/data.js',
  './assets/js/main.js',
  './assets/js/admin.js',
  './assets/js/firebase-config.js',
  './manifest.json',
  './assets/images/profile-avatar.svg',
  './assets/images/project-iot.svg',
  './assets/images/project-network.svg',
  './assets/images/project-rfid.svg',
  './assets/images/project-web.svg'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('⚡ [SW] Caching app shell & static assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('🧹 [SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Network First with Cache Fallback
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Clone response to cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline fallback
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (e.request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        });
      })
  );
});
