/* The Puzzle Cabinet · app.js — the router, the theme and the keyboard. */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  C.applyTheme = function () {
    let t = C.settings.theme || 'dark';
    if (t === 'auto') t = root.matchMedia && root.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    root.document.documentElement.dataset.theme = t;
    const meta = root.document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'light' ? '#f3efe6' : '#0f1220');
  };

  let view = null;

  async function route() {
    const hash = decodeURIComponent(root.location.hash.replace(/^#\/?/, ''));
    const parts = hash.split('/');
    const host = view;
    if (parts[0] !== 'p' && parts[0] !== 'x') C.closePuzzle();
    root.document.body.dataset.page = parts[0] === 'x' ? 'p' : (parts[0] || 'home');
    root.scrollTo(0, 0);
    switch (parts[0]) {
      case 'p': await C.openPuzzle(host, parts.slice(1).join('/')); break;
      case 'x': await C.openEndless(host, parts[1], parts[2], parts[3]); break;
      case 's': C.renderShelf(host, parts[1]); break;
      case 'f': await C.renderFamily(host, parts[1]); break;
      case 'e': C.renderEra(host, parts[1]); break;
      case 'c': C.renderConcept(host, parts[1]); break;
      case 'q': C.renderSearch(host, parts.slice(1).join('/')); break;
      case 'history': C.renderHistory(host); break;
      case 'about': C.renderAbout(host); break;
      case 'settings': C.renderSettings(host); break;
      default: C.renderHome(host);
    }
    const p = C.currentPlayer && C.currentPlayer();
    root.document.title = (parts[0] === 'p' || parts[0] === 'x') && p ? p.p.title + ' · The Puzzle Cabinet' : 'The Puzzle Cabinet';
  }

  root.addEventListener('keydown', (ev) => {
    const p = C.currentPlayer && C.currentPlayer();
    if (root.document.body.dataset.page === 'p' && p && p.key(ev)) { ev.preventDefault(); return; }
    if (ev.key === '/' && root.document.body.dataset.page !== 'p') {
      const s = root.document.querySelector('.search');
      if (s && root.document.activeElement !== s) { s.focus(); ev.preventDefault(); }
    }
  });
  root.addEventListener('keyup', (ev) => {
    const p = C.currentPlayer && C.currentPlayer();
    if (root.document.body.dataset.page === 'p' && p) p.key(ev);
  });
  root.addEventListener('beforeunload', () => { const p = C.currentPlayer && C.currentPlayer(); if (p) p.saveNow(); });
  root.document.addEventListener('visibilitychange', () => { const p = C.currentPlayer && C.currentPlayer(); if (p && root.document.hidden) p.saveNow(); });

  C.boot = function () {
    C.applyTheme();
    if (root.matchMedia) root.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (C.settings.theme === 'auto') C.applyTheme(); });
    C.initCatalog();
    view = root.document.getElementById('view');
    root.addEventListener('hashchange', route);
    route();
    if ('serviceWorker' in root.navigator && !/[?&]nosw\b/.test(root.location.search) && root.location.protocol !== 'file:') {
      root.navigator.serviceWorker.register('sw.js').catch(() => { /* offline play is a bonus */ });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
