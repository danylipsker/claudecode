/* Hyper Driving · core.js — the small toolkit everything else stands on:
 * DOM helpers, safe storage (localStorage for settings and progress, IndexedDB
 * for content packs), an event bus, the hash router, settings and number /
 * date formatting per language.
 */
(function (D) {
  'use strict';

  // ---------- small helpers ----------
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === 'string' || typeof kid === 'number' ? document.createTextNode(String(kid)) : kid);
    }
    return el;
  }

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const shuffle = (arr, rnd = Math.random) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  // a seeded generator, so "sign of the day" and exam builds can be repeated
  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  }
  const hash = (str) => { let x = 2166136261; for (let i = 0; i < str.length; i++) { x ^= str.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; };
  const today = () => new Date().toISOString().slice(0, 10);

  D.util = { esc, h, clamp, shuffle, rng, hash, today };

  // ---------- storage ----------
  // localStorage may be missing or throw (private windows, blocked site data):
  // every read falls back to the default and every write is best effort.
  const P = () => (D.config && D.config.storagePrefix) || 'drive:';
  D.store = {
    get(key, dflt) {
      try { const v = localStorage.getItem(P() + key); return v == null ? dflt : JSON.parse(v); }
      catch (e) { return dflt; }
    },
    set(key, val) {
      try { localStorage.setItem(P() + key, JSON.stringify(val)); return true; }
      catch (e) { return false; }
    },
    del(key) { try { localStorage.removeItem(P() + key); } catch (e) { /* nothing to do */ } }
  };

  // IndexedDB, for content packs (too large and too important for localStorage)
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((resolve) => {
      try {
        if (typeof indexedDB === 'undefined') return resolve(null);
        const rq = indexedDB.open('hyper-driving', 1);
        rq.onupgradeneeded = () => {
          const d = rq.result;
          if (!d.objectStoreNames.contains('kv')) d.createObjectStore('kv');
        };
        rq.onsuccess = () => resolve(rq.result);
        rq.onerror = () => resolve(null);
        rq.onblocked = () => resolve(null);
      } catch (e) { resolve(null); }
    });
    return dbp;
  }
  D.idb = {
    async get(key) {
      const d = await db(); if (!d) return undefined;
      return new Promise((res) => {
        try {
          const rq = d.transaction('kv').objectStore('kv').get(key);
          rq.onsuccess = () => res(rq.result); rq.onerror = () => res(undefined);
        } catch (e) { res(undefined); }
      });
    },
    async set(key, val) {
      const d = await db(); if (!d) return false;
      return new Promise((res) => {
        try {
          const tx = d.transaction('kv', 'readwrite'); tx.objectStore('kv').put(val, key);
          tx.oncomplete = () => res(true); tx.onerror = () => res(false);
        } catch (e) { res(false); }
      });
    },
    async del(key) {
      const d = await db(); if (!d) return false;
      return new Promise((res) => {
        try {
          const tx = d.transaction('kv', 'readwrite'); tx.objectStore('kv').delete(key);
          tx.oncomplete = () => res(true); tx.onerror = () => res(false);
        } catch (e) { res(false); }
      });
    }
  };

  // ---------- event bus ----------
  const subs = {};
  D.on = (ev, fn) => { (subs[ev] = subs[ev] || []).push(fn); return () => { subs[ev] = subs[ev].filter((f) => f !== fn); }; };
  D.emit = (ev, data) => { (subs[ev] || []).slice().forEach((fn) => { try { fn(data); } catch (e) { console.error(e); } }); };

  // ---------- settings ----------
  const SETTINGS_DEFAULT = {
    lang: null,                 // null = the jurisdiction's default language
    jurisdiction: null,
    licence: 'B',               // the licence class the reader studies for
    theme: 'auto',              // auto | light | dark
    fontScale: 1,               // 0.9 … 1.4
    showEnglishTerms: true,     // in Hebrew text, show the English term beside a term chip
    niqqud: false,              // show glossary terms with vowel points
    examTimer: true,
    autoUpdate: true,
    editor: false               // content-editor mode (for authority staff)
  };
  D.settings = Object.assign({}, SETTINGS_DEFAULT, D.store.get('settings', {}));
  D.setSetting = (k, v) => {
    D.settings[k] = v;
    D.store.set('settings', D.settings);
    D.emit('settings', { key: k, value: v });
  };
  D.settingsDefault = SETTINGS_DEFAULT;

  // ---------- router ----------
  // routes: '#/learn/speed-distance?x=1' → { path: ['learn','speed-distance'], query: {x:'1'} }
  const routes = [];
  D.route = (pattern, fn) => routes.push({ parts: pattern.split('/').filter(Boolean), fn });
  D.parseHash = (hashStr) => {
    const raw = (hashStr || '').replace(/^#\/?/, '');
    const [p, q] = raw.split('?');
    const query = {};
    if (q) q.split('&').forEach((kv) => { const [k, v] = kv.split('='); if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
    return { path: p.split('/').filter(Boolean).map(decodeURIComponent), query };
  };
  D.resolveRoute = (hashStr) => {
    const { path, query } = D.parseHash(hashStr);
    for (const r of routes) {
      if (r.parts.length !== path.length && !(r.parts.length && r.parts[r.parts.length - 1] === '*')) continue;
      const params = {};
      let ok = true;
      for (let i = 0; i < r.parts.length; i++) {
        const rp = r.parts[i];
        if (rp === '*') { params.rest = path.slice(i).join('/'); break; }
        if (rp.startsWith(':')) { if (path[i] == null) { ok = false; break; } params[rp.slice(1)] = path[i]; }
        else if (rp !== path[i]) { ok = false; break; }
      }
      if (ok) return { fn: r.fn, params, query, path };
    }
    return null;
  };
  D.go = (hashStr) => { if (location.hash === hashStr) D.emit('route'); else location.hash = hashStr; };

  // ---------- language & formatting ----------
  D.lang = () => D.settings.lang || (D.data && D.data.manifest && D.data.manifest.defaultLanguage) || 'he';
  D.dir = () => ((D.config.languages[D.lang()] || {}).dir || 'ltr');
  D.locale = () => ((D.config.languages[D.lang()] || {}).locale || 'en');

  // pick the reader's language from a {he:…, en:…} object, falling back to the
  // pack's default language and then to anything there is
  D.tr = (obj, lang) => {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    const l = lang || D.lang();
    if (obj[l] != null && obj[l] !== '') return obj[l];
    const dl = (D.data && D.data.manifest && D.data.manifest.defaultLanguage) || 'he';
    if (obj[dl] != null) return obj[dl];
    for (const k in obj) if (obj[k]) return obj[k];
    return '';
  };

  D.fmtNum = (x, opts) => {
    if (typeof x !== 'number' || !isFinite(x)) return String(x);
    try { return new Intl.NumberFormat(D.locale(), Object.assign({ maximumFractionDigits: 2 }, opts || {})).format(x); }
    catch (e) { return String(x); }
  };
  D.fmtDate = (iso, opts) => {
    if (!iso) return '';
    try {
      const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso);
      return new Intl.DateTimeFormat(D.locale(), opts || { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
    } catch (e) { return iso; }
  };
})(globalThis.Drive = globalThis.Drive || {});
