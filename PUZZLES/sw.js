/* The Puzzle Cabinet · sw.js — offline support.
 * Network first (a new version is seen at once when online), the cache when
 * offline. The page shell is cached on install; every engine and puzzle file
 * is cached the first time it is opened (Settings → "Keep every puzzle for
 * offline play" fetches them all at once).
 *
 * The cache store is shared by every app on this site, so only caches with
 * this app's prefix are ever cleared here.
 */
const PREFIX = 'puzzle-cabinet-';
const CACHE = PREFIX + 'v1';
const SHELL = [
  'index.html', 'css/app.css', 'pwa.json', 'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  'js/cabinet.js', 'js/geom.js', 'js/paper.js', 'js/view3d.js', 'js/icons.js', 'js/quips.js',
  'js/workbench.js', 'js/notebook.js', 'js/player.js', 'js/library.js', 'js/app.js',
  'data/concepts.js', 'data/history.js', 'data/catalog.js'
];

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
