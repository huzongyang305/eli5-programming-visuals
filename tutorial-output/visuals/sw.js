// Service Worker for ELI5 Programming Visuals PWA
// Enables offline caching and faster loading

const CACHE_NAME = 'eli5-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './README.md',
  './manifest.json',
  './js/progress-tracker.js',
  './01-linked-list.html',
  './02-recursion.html',
  './03-oop.html',
  './04-memory-management.html',
  './05-exception-handling.html',
  './06-generics.html',
  './07-hash-table.html',
  './08-solid-principles.html',
  './09-sorting-algorithms.html'
];

// Install event - cache all assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell and assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Installation complete, activating...');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete, taking control');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached response immediately
          return cachedResponse;
        }

        // Fetch from network and cache the response
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response because it's a stream that can only be consumed once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);
            
            // For HTML requests, show offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync for progress data (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    console.log('[SW] Background sync triggered');
    event.waitUntil(syncProgressData());
  }
});

async function syncProgressData() {
  // Future: sync localStorage data to cloud
  console.log('[SW] Syncing progress data...');
}

// Push notifications for new content (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');
  
  const options = {
    body: 'ELI5编程可视化有新内容啦！',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: './index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification('新内容可用', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

console.log('[SW] Service Worker loaded');
