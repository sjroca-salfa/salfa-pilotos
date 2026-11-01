/**
 * Portales Salfa - Hub Service Worker V1
 * Ecosistema: Portales Salfa Pilotos · Salfa Montajes
 */

const CACHE_NAME = 'salfa-hub-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icon-192.png',
  './assets/apple-touch-icon.png',
  './assets/logo-salfa-montajes-claro.svg',
  './assets/logo-salfa-montajes-oscuro.svg',
  './assets/logo-salfa-montajes-mono-blanco.svg',
  './assets/logo-salfa-montajes-mono-rojo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (request.url.includes('script.google.com') || request.url.includes('accounts.google.com')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse.clone()));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(request).catch(() => {
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
