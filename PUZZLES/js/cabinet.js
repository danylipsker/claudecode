/* The Puzzle Cabinet · cabinet.js
 *
 * The registry every other file talks to. Engines (the code that makes one
 * kind of puzzle playable) register with Cabinet.engine(); puzzle files add
 * their puzzles with Cabinet.family(). Nothing here touches the page when it
 * loads, so the same files load in node for the checking tools.
 */
(function (root) {
  'use strict';

  const C = root.Cabinet = root.Cabinet || {};

  C.engines = {};     // engine id -> engine definition
  C.families = {};    // family id -> { meta, puzzles: [] }
  C.byId = {};        // puzzle id -> puzzle
  C.figures = {};     // figure id -> { draw, ... } used by question puzzles
  C.conceptList = []; // [{ id, name, text }]
  C.conceptById = {};
  C.historyList = []; // timeline events
  C.catalogData = null;

  /* ---------- shelves, eras, difficulty ---------- */

  C.categories = [
    { id: 'matches', name: 'Matches & Sticks', hue: 38, blurb: 'Move, take away or add matchsticks to change a shape or mend an equation.' },
    { id: 'coins', name: 'Coins, Pegs & Counters', hue: 176, blurb: 'Slide, jump, flip and stack coins, pegs and counters.' },
    { id: 'shapes', name: 'Shapes & Dissections', hue: 232, blurb: 'Tangrams, polyominoes and dissections: cut a shape and build another.' },
    { id: 'paper', name: 'Paper: Fold & Cut', hue: 48, blurb: 'Fold a sheet, a strip or a net of stamps, then cut it with one stroke.' },
    { id: 'ropes', name: 'Ropes & Knots', hue: 22, blurb: 'Knots, tangles and ropes that burn in strange ways.' },
    { id: 'measure', name: 'Pour, Weigh & Time', hue: 200, blurb: 'Jugs without marks, scales without weights, timers that do not agree.' },
    { id: 'routes', name: 'Crossings & Routes', hue: 140, blurb: 'Rivers to cross, bridges to walk, graphs to draw in one stroke.' },
    { id: 'numbers', name: 'Numbers & Letters', hue: 268, blurb: 'Alphametics, magic figures and the arithmetic riddles of every age.' },
    { id: 'logic', name: 'Logic & Deduction', hue: 330, blurb: 'Knights who never lie, knaves who always do, and who owns the zebra.' },
    { id: 'pencil', name: 'Pencil Puzzles', hue: 214, blurb: 'Grid puzzles solved by pure reasoning: Sudoku, KenKen, Nonograms and more.' },
    { id: 'space', name: 'Space & 3D', hue: 190, blurb: 'Count the cubes, fold the net, build the figure: turn it around in 3D.' },
    { id: 'physics', name: 'Physics & Phenomena', hue: 8, blurb: 'Gears, pulleys, levers, pipes and the paradoxes of the moving world.' },
    { id: 'chance', name: 'Chance & Paradox', hue: 90, blurb: 'Probability puzzles where the obvious answer is wrong. Run them and see.' },
    { id: 'cards', name: 'Cards, Dice & Clocks', hue: 352, blurb: 'Deal, arrange and turn: puzzles with a deck, a die and a clock face.' },
    { id: 'compass', name: 'Compass & Straightedge', hue: 56, blurb: 'Euclid\'s game: construct with nothing but a compass and a ruler without marks.' },
    { id: 'riddles', name: 'Riddles & Wordplay', hue: 28, blurb: 'The oldest puzzles of all, from the Sphinx to the lateral thinkers.' },
    { id: 'games', name: 'Games to Win', hue: 160, blurb: 'You move first. Find the move that wins, whatever the other side does.' },
    { id: 'mechanical', name: 'Mechanical Classics', hue: 250, blurb: 'Towers, rings and circles: the classic puzzles made of wood and wire.' }
  ];
  C.catById = {};
  C.categories.forEach((c) => { C.catById[c.id] = c; });

  C.eras = [
    { id: 'ancient', name: 'Ancient world', from: -4000, to: -500, blurb: 'Babylonian tablets, Egyptian papyri and the riddles of myth.' },
    { id: 'classical', name: 'Classical antiquity', from: -500, to: 500, blurb: 'Greek, Roman, Chinese and Indian puzzle-makers.' },
    { id: 'medieval', name: 'Middle Ages', from: 500, to: 1400, blurb: 'Alcuin\'s problems to sharpen the young, Fibonacci, Bhaskara, the riddle books.' },
    { id: 'renaissance', name: 'Renaissance', from: 1400, to: 1650, blurb: 'Printed puzzle books: Pacioli, Tartaglia, Bachet and Guarini.' },
    { id: 'reason', name: 'Age of Reason', from: 1650, to: 1800, blurb: 'Euler walks the bridges of Königsberg and tours the board with a knight.' },
    { id: 'c19', name: 'The 19th century', from: 1800, to: 1900, blurb: 'The tangram craze, Hamilton\'s game, Kirkman\'s schoolgirls, Lucas\'s tower.' },
    { id: 'golden', name: 'The golden age', from: 1900, to: 1950, blurb: 'Sam Loyd and Henry Dudeney fill the newspapers with puzzles.' },
    { id: 'modern', name: 'Recreational mathematics', from: 1950, to: 2000, blurb: 'The Scientific American years: Gardner, Golomb, Conway, Smullyan, Rubik.' },
    { id: 'today', name: 'Today', from: 2000, to: 9999, blurb: 'New puzzles and computer-made variants of the old ones.' }
  ];
  C.eraOf = function (year) {
    if (year == null || isNaN(year)) return null;
    for (const e of C.eras) if (year >= e.from && year < e.to) return e;
    return C.eras[C.eras.length - 1];
  };
  C.fmtYear = function (y) {
    if (y == null) return '';
    if (y < 0) return (-y) + ' BC';
    if (y < 1000) return 'AD ' + y;
    return String(y);
  };

  C.diffs = [
    null,
    { n: 1, name: 'Easy', word: 'a warm-up' },
    { n: 2, name: 'Fair', word: 'a fair test' },
    { n: 3, name: 'Tricky', word: 'tricky' },
    { n: 4, name: 'Hard', word: 'hard' },
    { n: 5, name: 'Fiendish', word: 'fit for the Sphinx' }
  ];

  /* ---------- registration ---------- */

  C.engine = function (def) {
    if (!def || !def.id) throw new Error('Cabinet.engine: an id is required');
    if (typeof def.mount !== 'function') throw new Error('Cabinet.engine ' + def.id + ': mount() is required');
    C.engines[def.id] = def;
    return def;
  };

  C.family = function (meta, list) {
    if (!meta || !meta.id || !meta.engine) throw new Error('Cabinet.family: id and engine are required');
    let f = C.families[meta.id];
    if (!f) {
      f = C.families[meta.id] = { meta: Object.assign({}, meta), puzzles: [] };
    } else {
      // a family split over several files: the first file's meta wins, later ones may add keys
      for (const k in meta) if (f.meta[k] == null) f.meta[k] = meta[k];
    }
    (list || []).forEach((p) => {
      p.family = meta.id;
      p.engine = p.engine || meta.engine;
      if (C.byId[p.id] && C.byId[p.id] !== p) {
        const msg = 'Cabinet.family: duplicate puzzle id ' + p.id;
        if (root.console) root.console.warn(msg);
        (C.problems = C.problems || []).push(msg);
      }
      C.byId[p.id] = p;
      f.puzzles.push(p);
    });
    return f;
  };

  C.figure = function (id, def) { C.figures[id] = def; return def; };

  C.concepts = function (list) {
    list.forEach((c) => {
      if (!C.conceptById[c.id]) C.conceptList.push(c);
      C.conceptById[c.id] = c;
    });
  };

  C.history = function (list) {
    (list || []).forEach((e) => {
      if (!C.historyList.some((x) => x.year === e.year && x.title === e.title)) C.historyList.push(e);
    });
  };

  C.catalog = function (data) { C.catalogData = data; };

  /* ---------- small helpers ---------- */

  // mulberry32: a small, fast seeded generator (the same numbers in node and the browser)
  C.rng = function (seed) {
    let a = (typeof seed === 'string' ? C.hash(seed) : seed) >>> 0;
    const r = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    r.int = (n) => Math.floor(r() * n);
    r.range = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.pick = (arr) => arr[Math.floor(r() * arr.length)];
    r.shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
      }
      return arr;
    };
    return r;
  };

  C.hash = function (s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  // animation time: every engine passes its durations through this, so tests can run fast
  C.animScale = 1;
  C.anim = (ms) => ms * C.animScale;

  /* C.tween(ms, fn(t), done): calls fn with t from 0 to 1 (eased), then done.
   * Uses animation frames, with a timer as a fallback, so it always finishes —
   * even in a hidden tab where frames are paused. Returns a function that stops it. */
  C.tween = function (ms, fn, done, ease) {
    const t0 = Date.now();
    let stopped = false, ended = false, raf = null, tmr = null;
    const easeFn = ease === 'linear' ? (t) => t : (t) => 0.5 - Math.cos(t * Math.PI) / 2;
    const step = () => {
      if (stopped || ended) return;
      const t = ms > 0 ? Math.min(1, (Date.now() - t0) / ms) : 1;
      try { fn(easeFn(t)); } catch (e) { if (root.console) root.console.error(e); }
      if (t >= 1) { ended = true; if (raf && root.cancelAnimationFrame) root.cancelAnimationFrame(raf); clearTimeout(tmr); if (done) done(); return; }
      if (root.requestAnimationFrame) raf = root.requestAnimationFrame(step);
      clearTimeout(tmr);
      tmr = setTimeout(step, 40);
    };
    step();
    return () => { stopped = true; clearTimeout(tmr); if (raf && root.cancelAnimationFrame) root.cancelAnimationFrame(raf); };
  };

  C.clone = function (o) { return o == null ? o : JSON.parse(JSON.stringify(o)); };

  C.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  };

  C.plural = function (n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); };

  C.fmtTime = function (sec) {
    sec = Math.max(0, Math.round(sec || 0));
    const h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60, s = sec % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s).padStart(2, '0');
  };

  /* The text markup used in puzzle statements, hints and explanations.
   * Content is our own, so plain HTML tags (b, i, sup, sub, br, span) pass
   * through untouched. On top of that:
   *   **bold**  *italic*
   *   [[puzzle-id]] or [[puzzle-id|label]]      link to a puzzle
   *   [[c:concept|label]]                        link to a concept page
   *   [[f:family|label]]                         link to a family
   *   a blank line starts a new paragraph
   */
  C.md = function (text) {
    if (text == null) return '';
    let t = String(text);
    t = t.replace(/\[\[([cf]):([\w-]+)(?:\|([^\]]+))?\]\]/g, (m, kind, id, label) => {
      if (kind === 'c') {
        const c = C.conceptById[id];
        return '<a class="lnk concept" href="#/c/' + id + '">' + (label || (c ? c.name : id)) + '</a>';
      }
      const f = C.families[id] || (C.catalogData && C.catalogData.families[id]);
      const name = label || (f ? (f.meta ? f.meta.name : f.name) : id);
      return '<a class="lnk family" href="#/f/' + id + '">' + name + '</a>';
    });
    t = t.replace(/\[\[([\w-]+)(?:\|([^\]]+))?\]\]/g, (m, id, label) => {
      const row = C.row ? C.row(id) : null;
      const name = label || (row ? row.title : (C.byId[id] ? C.byId[id].title : id));
      return '<a class="lnk puzzle" href="#/p/' + id + '">' + name + '</a>';
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    t = t.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1<i>$2</i>');
    // a blank line starts a paragraph; a single line break stays a line break (speakers, lists)
    const paras = t.split(/\n\s*\n/).map((p) => p.trim().replace(/\n/g, '<br>'));
    if (paras.length === 1) return paras[0];
    return paras.map((p) => '<p>' + p + '</p>').join('');
  };

  /* ---------- storage (localStorage, guarded: it can be missing) ---------- */

  const PREFIX = 'pc:';
  C.store = {
    get(key, dflt) {
      try {
        const v = root.localStorage && root.localStorage.getItem(PREFIX + key);
        return v == null ? dflt : JSON.parse(v);
      } catch (e) { return dflt; }
    },
    set(key, val) {
      try {
        if (!root.localStorage) return false;
        if (val === undefined) root.localStorage.removeItem(PREFIX + key);
        else root.localStorage.setItem(PREFIX + key, JSON.stringify(val));
        return true;
      } catch (e) { return false; }
    },
    del(key) { try { root.localStorage && root.localStorage.removeItem(PREFIX + key); } catch (e) { /* ignore */ } },
    keys() {
      const out = [];
      try {
        const ls = root.localStorage;
        for (let i = 0; ls && i < ls.length; i++) {
          const k = ls.key(i);
          if (k && k.startsWith(PREFIX)) out.push(k.slice(PREFIX.length));
        }
      } catch (e) { /* ignore */ }
      return out;
    }
  };

  /* Progress: one map { puzzleId: { s: stars 0-3, t: best seconds, h: hints,
   * m: best moves, r: 1 if the solution was shown, d: date solved } } */
  let progressCache = null;
  C.progress = {
    all() {
      if (!progressCache) progressCache = C.store.get('done', {}) || {};
      return progressCache;
    },
    get(id) { return C.progress.all()[id] || null; },
    record(id, rec) {
      const all = C.progress.all();
      const old = all[id];
      const merged = old ? {
        s: Math.max(old.s || 0, rec.s || 0),
        t: old.t && rec.t ? Math.min(old.t, rec.t) : (old.t || rec.t),
        h: Math.min(old.h == null ? 99 : old.h, rec.h == null ? 99 : rec.h),
        m: old.m && rec.m ? Math.min(old.m, rec.m) : (old.m || rec.m),
        r: old.r && rec.r ? 1 : 0,
        d: old.d || rec.d
      } : rec;
      all[id] = merged;
      C.store.set('done', all);
      return merged;
    },
    reveal(id) {
      const all = C.progress.all();
      if (!all[id]) { all[id] = { s: 0, r: 1, d: Date.now(), seen: 1 }; C.store.set('done', all); }
    },
    solved(id) { const r = C.progress.all()[id]; return !!(r && !r.seen); },
    reset() { progressCache = {}; C.store.set('done', {}); },
    reload() { progressCache = null; }
  };

  C.settings = Object.assign({
    theme: 'dark',
    sound: true,
    quips: true,
    timer: true,
    autocheck: true
  }, C.store.get('settings', {}) || {});
  C.saveSettings = function () { C.store.set('settings', C.settings); };

  /* ---------- script loading (browser) ---------- */

  const loading = {};
  C.load = function (src) {
    if (loading[src]) return loading[src];
    loading[src] = new Promise((resolve, reject) => {
      const s = root.document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve(src);
      s.onerror = () => { delete loading[src]; reject(new Error('Could not load ' + src)); };
      root.document.head.appendChild(s);
    });
    return loading[src];
  };

  /* ---------- engine styles: each engine keeps its CSS beside its code ---------- */

  C.css = function (id, text) {
    if (!root.document) return;
    if (root.document.getElementById('css-' + id)) return;
    const st = root.document.createElement('style');
    st.id = 'css-' + id;
    st.textContent = text;
    root.document.head.appendChild(st);
  };

  /* ---------- DOM helpers (browser only) ---------- */

  // h('div.card#main', { onclick: fn, title: 'x' }, child, 'text', [more])
  C.h = function (sel, attrs) {
    const m = /^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i.exec(sel) || [];
    const el = root.document.createElement(m[1] || 'div');
    (m[2] || '').replace(/([.#])([\w-]+)/g, (x, k, v) => {
      if (k === '.') el.classList.add(v); else el.id = v;
    });
    let kids = Array.prototype.slice.call(arguments, 2);
    if (attrs && (typeof attrs !== 'object' || attrs.nodeType || Array.isArray(attrs))) {
      kids.unshift(attrs);
      attrs = null;
    }
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else if (k === 'html') el.innerHTML = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'style' && typeof v === 'object') {
          // custom properties (--hue) need setProperty; plain ones can be assigned
          for (const sk in v) { if (v[sk] == null) continue; if (sk.startsWith('--')) el.style.setProperty(sk, v[sk]); else el.style[sk] = v[sk]; }
        }
        else if (k === 'dataset') Object.assign(el.dataset, v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    const add = (k) => {
      if (k == null || k === false) return;
      if (Array.isArray(k)) k.forEach(add);
      else if (k.nodeType) el.appendChild(k);
      else el.appendChild(root.document.createTextNode(String(k)));
    };
    kids.forEach(add);
    return el;
  };

  C.SVGNS = 'http://www.w3.org/2000/svg';
  // s('circle', { cx: 1, cy: 2, r: 3 }, parent)
  C.s = function (tag, attrs, parent) {
    const el = root.document.createElementNS(C.SVGNS, tag);
    if (attrs) {
      for (const k in attrs) {
        const v = attrs[k];
        if (v == null || v === false) continue;
        if (k === 'text') el.textContent = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v);
      }
    }
    if (parent) parent.appendChild(el);
    return el;
  };

  // a polygon's points as an SVG path
  C.pathOf = function (poly, closed) {
    if (!poly || !poly.length) return '';
    let d = 'M' + fmt(poly[0][0]) + ' ' + fmt(poly[0][1]);
    for (let i = 1; i < poly.length; i++) d += 'L' + fmt(poly[i][0]) + ' ' + fmt(poly[i][1]);
    return closed === false ? d : d + 'Z';
  };
  function fmt(v) { return Math.round(v * 1000) / 1000; }
  C.fmtNum = fmt;
})(typeof window !== 'undefined' ? window : globalThis);
