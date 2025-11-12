const CACHE_NAME = 'attribution-service-v1';
const urlsToCache = [
  '/AttributionServiceFrontend/',
  '/AttributionServiceFrontend/index.html',
  '/AttributionServiceFrontend/static/js/bundle.js',
  '/AttributionServiceFrontend/static/css/main.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Для SPA - все запросы возвращаем index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/AttributionServiceFrontend/index.html')
        .then((response) => {
          return response || fetch(event.request);
        })
    );
    return;
  }

  // Для остальных запросов - стандартная логика
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});