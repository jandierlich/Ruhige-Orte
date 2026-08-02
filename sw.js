const CACHE = 'ruhige-orte-v12';
const CORE_ASSETS = [
  './',
  './index.html',
  './app.html',
  './anleitung.html',
  './manifest.json',
  './icon-32.png',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './impressum.html',
  './datenschutz.html',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())
  );
});

// Netzwerk zuerst (für App-Shell-Updates), Cache als Fallback offline.
// Externe Live-Dienste (Overpass, Nominatim, Open-Meteo, Kartenkacheln) laufen
// bewusst NICHT über den Cache-Fallback, damit dort immer frische Daten kommen
// bzw. offline korrekt ein Fehler auftritt statt veralteter Ergebnisse.
const NO_CACHE_HOSTS = ['overpass-api.de', 'nominatim.openstreetmap.org', 'api.open-meteo.com', 'basemaps.cartocdn.com'];

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (NO_CACHE_HOSTS.some(h => url.hostname === h)) return; // nicht abfangen, direkt ans Netz

  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(e.request, copy));
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
