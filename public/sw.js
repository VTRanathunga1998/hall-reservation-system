// public/sw.js
// This is the smallest possible service worker that makes PWA installable

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Optional: leave fetch empty → still counts as valid SW
// self.addEventListener('fetch', () => {});