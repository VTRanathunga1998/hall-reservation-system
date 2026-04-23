const CACHE_NAME = "app-cache-v2"; // 🔥 change version when you update icons

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // 🔥 delete old caches
          }
        }),
      ),
    ),
  );
  self.clients.claim();
});
