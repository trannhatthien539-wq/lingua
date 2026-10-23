const CACHE_NAME = 'lingua-static-v6';
const APP_SHELL = ['./', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/tree.svg'];
/** Chỉ đệm tài nguyên tĩnh cùng origin; API/Firebase và luồng media luôn đi mạng. */
const CACHEABLE_DESTINATIONS = new Set(['script', 'style', 'image', 'font', 'manifest']);

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

const putSafely = (request, response) => {
  if (!response || !response.ok) return;
  const copy = response.clone();
  caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  // Range request (video/audio tua) không nên chèn cache.
  if (request.headers.has('range')) return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = request.mode === 'navigate' || request.destination === 'document';
  if (isNavigation) {
    // Network-first để bản mới lên ngay; mất mạng thì dùng bản đệm gần nhất.
    event.respondWith(
      fetch(request)
        .then((response) => {
          putSafely(request, response);
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./'))),
    );
    return;
  }

  if (!CACHEABLE_DESTINATIONS.has(request.destination)) return;

  // File build có hash: cache-first. Tài nguyên khác: trả bản đệm rồi cập nhật ngầm.
  const immutable = url.pathname.includes('/assets/');
  if (immutable) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((response) => {
        putSafely(request, response);
        return response;
      })),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request).then((response) => {
        putSafely(request, response);
        return response;
      });
      // Giữ worker sống đủ lâu để cập nhật bản đệm ngầm, kể cả khi đã trả bản cũ.
      event.waitUntil(network.catch(() => {}));
      return cached || network;
    }),
  );
});
