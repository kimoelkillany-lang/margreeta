/* Margreeta POS service worker: keeps the app files on the device so the POS still opens without Wi-Fi.
   Orders are NOT handled here. Firestore keeps its own offline copy and syncs when the connection is back.
   App files: network first (so updates show up right away), cached copy if the network is down or slow.
   Google Fonts: cached copy first, refreshed in the background. */
var CACHE = 'margreeta-pos-v2';
var SHELL = [
  './', 'index.html', 'pos.css', 'components.js', 'app.js', 'firebase-config.js', 'manifest.webmanifest',
  'vendor/react.production.min.js', 'vendor/react-dom.production.min.js',
  'vendor/firebase-app-compat.js', 'vendor/firebase-auth-compat.js', 'vendor/firebase-firestore-compat.js',
  'img/logo.png', 'img/margherita.jpg', 'img/diavola.jpg', 'img/veggi.jpg', 'img/funghi.jpg', 'img/marinara.jpg',
  'img/hot-honey-pepperoni.jpg', 'img/cheese-lovers.jpg', 'img/pastrami.jpg', 'img/nutella-star.jpg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/favicon-64.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('margreeta-pos-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function networkFirst(req) {
  return caches.open(CACHE).then(function (cache) {
    var net = fetch(req).then(function (res) { if (res && res.ok) cache.put(req, res.clone()); return res; });
    var fallback = function () {
      return cache.match(req, { ignoreSearch: true }).then(function (hit) {
        return hit || (req.mode === 'navigate' ? cache.match('./') : undefined);
      });
    };
    // Flaky Wi-Fi: if the network hasn't answered in 4 seconds, use the cached copy.
    var slow = new Promise(function (resolve) { setTimeout(function () { fallback().then(function (hit) { if (hit) resolve(hit); }); }, 4000); });
    return Promise.race([net.catch(function () { return fallback().then(function (hit) { return hit || Promise.reject(new Error('offline')); }); }), slow]);
  });
}
function cacheFirst(req) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) { if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone()); return res; });
      return hit || net;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin === self.location.origin) { e.respondWith(networkFirst(req)); return; }
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') { e.respondWith(cacheFirst(req)); return; }
  // Everything else (Firebase sign-in and Firestore) goes straight to the network.
});
