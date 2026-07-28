// Minimal service worker — required by browsers to consider this app "installable".
// It caches the app shell so the app still opens (to the home/setup screen) if you're
// briefly offline. Live game data always needs a real connection to sync moves.
const CACHE_NAME = 'glass-chess-v1';
const APP_SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything (so you always get the latest game code/data),
  // falling back to the cached app shell only if the network request fails.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
