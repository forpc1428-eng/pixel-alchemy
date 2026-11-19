// Offline-first service worker. Bump VERSION on every deploy that changes files.
const VERSION = 'ultra-v1';
const CORE = ['./', 'index.html', 'config.js', 'css/style.css', 'js/engine.js', 'js/main.js',
  'fonts/bodoni-moda-latin-400-normal.woff2', 'fonts/montserrat-latin-400-normal.woff2', 'fonts/montserrat-latin-500-normal.woff2',
  'manifest.webmanifest', 'icons/favicon.svg', 'icons/icon-192.png'];
self.addEventListener('install', e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  // network-first for HTML (fresh content), cache-first for everything else (instant)
  if (r.mode === 'navigate') { e.respondWith(fetch(r).then(res => { caches.open(VERSION).then(c => c.put(r, res.clone())); return res; }).catch(() => caches.match(r).then(m => m || caches.match('index.html')))); return; }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { if (res.ok) { const cl = res.clone(); caches.open(VERSION).then(c => c.put(r, cl)); } return res; })));
});
