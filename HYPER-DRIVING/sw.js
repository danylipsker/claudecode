/* Hyper Driving · sw.js — offline support.
 * Network first (so a new build or pack is seen at once when online), the
 * cache when offline. Content updates do not depend on this: they are stored
 * in IndexedDB by js/update.js.
 *
 * The cache store belongs to the whole site (every app on it shares one), so
 * only caches with this app's prefix are ever cleared here.
 */
const PREFIX = 'hyper-driving-';
const CACHE = PREFIX + 'v1';
const SHELL = [
  './', 'index.html', 'pwa.json', 'icon.svg', 'css/drive.css',
  'js/config.js', 'js/core.js', 'js/i18n.js', 'js/content.js', 'js/icons.js', 'js/glyphs.js', 'js/signs.js',
  'js/dash.js', 'js/markup.js', 'js/widgets.js', 'js/quiz.js', 'js/update.js', 'js/check.js', 'js/views.js',
  'js/editor.js', 'js/app.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SHELL))
      // the bundled pack: every file its manifest lists
      .then(() => fetch('content/il/manifest.json').then((r) => r.json()).then((m) =>
        caches.open(CACHE).then((c) => c.addAll(['content/il/manifest.json'].concat(m.files.map((f) => 'content/il/' + f.path)))))
      ).catch(() => { /* a partial cache is still useful */ })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then((r) => r || caches.match('index.html')))
  );
});
