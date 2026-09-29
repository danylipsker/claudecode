/* Sliding Blocks · sw.js — offline support.
 * Network first (so a new version of the game is seen at once when online),
 * the cache when offline. Every puzzle is in puzzles.js, so once the page
 * has been opened it plays with no connection at all.
 *
 * The cache store is shared by every app on this site, so only caches with
 * this app's prefix are ever cleared here.
 */
const PREFIX = 'sliding-blocks-';
const CACHE = PREFIX + 'v1';
const SHELL = ['index.html', 'sb-core.js', 'sb-app.js', 'puzzles.js', 'pwa.json', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => { /* a partial cache is still useful */ })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true })
      .then((r) => r || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())))
  );
});
