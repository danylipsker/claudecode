/* HYPER-CORE · ui/app.js
 *
 * The application shell: saved progress, theme, top bar, contents tree, search,
 * link previews, the router, the home page and keyboard shortcuts.
 *
 * Views live in the other ui/ files and register themselves in Hyper.views;
 * the discipline's index.html ends with Hyper.start({ discipline: 'physics' }).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const U = H.util;
  const esc = U.esc;

  /* ================================================================ icons */
  const P = {
    map: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="9" cy="18" r="2.5"/><path d="M8.4 6.4 15.6 7.6M6.6 8.4l1.7 7.2M16.4 10l-5.6 6.4"/>',
    formulas: '<path d="M18 4H6l6 8-6 8h12"/>',
    practice: '<circle cx="12" cy="12" r="9"/><path d="m8 12.2 2.8 2.8L16 9.4"/>',
    tools: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15h.01M12 15h.01M15.5 15v3.5M8.5 18.5h.01M12 18.5h.01"/>',
    progress: '<path d="M5 20v-8M11 20V5M17 20v-5M3 20.5h18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    theme: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="currentColor"/>',
    menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8L3.5 9.7l5.9-.9z"/>',
    route: '<circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="5.5" r="2"/><path d="M7.5 18.5h7a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7h7"/>',
    book: '<path d="M2.5 5.5c3-1.4 6.6-1.3 9.5 1 2.9-2.3 6.5-2.4 9.5-1v13.5c-3-1.4-6.6-1.3-9.5 1-2.9-2.3-6.5-2.4-9.5-1z"/><path d="M12 6.5v13.5"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="m10 8.3 5.5 3.7-5.5 3.7z" fill="currentColor"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    graph: '<path d="M3.5 3.5v17h17"/><path d="M6.5 16c2.5-8 5.5-8 7.5-4s4 3 6-5"/>',
    shuffle: '<path d="M16 3.5h4.5V8M4 20 20.5 3.5M20.5 16v4.5H16M14.5 14.5l6 6M4 4l5 5"/>',
    cards: '<rect x="3" y="7" width="13" height="14" rx="2"/><path d="M7 3.5h11.5A2.5 2.5 0 0 1 21 6v11.5"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4.5A1.5 1.5 0 0 1 3 13.5v-9A1.5 1.5 0 0 1 4.5 3h9A1.5 1.5 0 0 1 15 4.5V5"/>',
    right: '<path d="m9 6 6 6-6 6"/>',
    left: '<path d="m15 6-6 6 6 6"/>',
    refresh: '<path d="M20 11.5a8 8 0 1 0-2.3 5.6M20 4v7.5h-7.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>',
    home: '<path d="m3 11 9-7.5 9 7.5M5.5 9v11.5h13V9"/>',
    calc: '<path d="M5 12h14M12 5v14"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    zap: '<path d="M13 2.5 4.5 14H11l-1.5 7.5L18 10h-6.5z"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    mechanics: '<circle cx="17.5" cy="6.5" r="2.8"/><path d="M3 20c2.5-7.5 6.5-12 11.3-13.2" stroke-dasharray="2.2 2.4"/><path d="M2.5 20.5h19"/>',
    em: '<path d="M13 2.5 4.5 14H11l-1.5 7.5L18 10h-6.5z"/>',
    light: '<path d="M12 4 3.5 19h17z"/><path d="M1 13.5 8 11.5M16.5 10.5l6-2.5M17 12.5h6M16.5 14.5l6 2.5"/>',
    heat: '<path d="M12 21.5c3.9 0 6.5-2.8 6.5-6.5 0-4.5-4.5-6.8-4.9-12-2.9 2-4.8 4.8-4.8 7.8-1-.8-1.8-2-2-3.6-1.8 2-2.3 4.6-2.3 7.8 0 3.7 3.5 6.5 7.5 6.5z"/>',
    sound: '<path d="M4 9.5v5h3.5L12.5 19V5L7.5 9.5z"/><path d="M16 9a4.2 4.2 0 0 1 0 6M18.8 6.2a8.2 8.2 0 0 1 0 11.6"/>',
    relativity: '<circle cx="12" cy="12" r="9"/><path d="M12 6.5V12l3.5 2.2"/><path d="M3 12h2M19 12h2"/>',
    quantum: '<circle cx="12" cy="12" r="1.7" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="3.8"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)"/>',
    nuclear: '<circle cx="12" cy="12" r="1.8"/><path d="M10.6 10.2 7.3 4.6a8.6 8.6 0 0 1 9.4 0l-3.3 5.6M13.9 12.9l6.4.3a8.6 8.6 0 0 1-4.7 8.1L12.4 15.6M10.1 12.9l-6.4.3a8.6 8.6 0 0 0 4.7 8.1l3.2-5.7"/>',
    condensed: '<circle cx="5" cy="5" r="1.7"/><circle cx="12" cy="5" r="1.7"/><circle cx="19" cy="5" r="1.7"/><circle cx="5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="19" cy="12" r="1.7"/><circle cx="5" cy="19" r="1.7"/><circle cx="12" cy="19" r="1.7"/><circle cx="19" cy="19" r="1.7"/><path d="M6.7 5h3.6M13.7 5h3.6M6.7 12h3.6M13.7 12h3.6M6.7 19h3.6M13.7 19h3.6M5 6.7v3.6M5 13.7v3.6M12 6.7v3.6M12 13.7v3.6M19 6.7v3.6M19 13.7v3.6"/>',
    astro: '<circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10.5" ry="3.6" transform="rotate(-20 12 12)"/>',
    fluids: '<path d="M12 3s7 7.3 7 11.8a7 7 0 0 1-14 0C5 10.3 12 3 12 3z"/><path d="M9 15.5a3 3 0 0 0 3 2.5"/>',
    waves: '<path d="M2 12c2.4-6 4.8-6 7.2 0s4.8 6 7.2 0 3.6-4.5 5.6-3"/>',
    atom: '<circle cx="12" cy="12" r="1.7" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="3.8"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" transform="rotate(120 12 12)"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M4.5 20h15"/>',
    upload: '<path d="M12 16V5M7 9.5l5-5 5 5M4.5 20h15"/>',
    trash: '<path d="M4 7h16M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    keyboard: '<rect x="2.5" y="6" width="19" height="12" rx="2"/><path d="M6 10h.01M9.5 10h.01M13 10h.01M16.5 10h.01M7.5 14h9"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'
  };
  H.icon = function (name, size, extra) {
    const p = P[name];
    if (!p) return '';
    size = size || 18;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + p + '</svg>';
  };
  H.hasIcon = n => !!P[n];

  /* a branch's badge: a drawn icon, or the glyph the content gives (∫, Σ, x²) */
  H.badge = function (node, size) {
    const ic = node.icon;
    if (ic && P[ic]) return H.icon(ic, size || 22);
    if (ic) return '<span class="glyph">' + esc(ic) + '</span>';
    return '<span>' + esc((node.title || '?').charAt(0)) + '</span>';
  };

  /* ================================================================ small helpers */
  const ui = H.ui = {};
  ui.$ = (s, el) => (el || document).querySelector(s);
  ui.$$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  ui.el = function (html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  ui.toast = function (msg) {
    let t = ui.$('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(ui._toast);
    ui._toast = setTimeout(() => t.classList.remove('on'), 1800);
  };
  ui.copy = function (text) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      () => ui.toast('Copied'),
      () => ui.toast('Could not copy'));
  };
  /* theme colours for canvases */
  ui.colors = function () {
    if (ui._colors && ui._colors.theme === document.documentElement.dataset.theme) return ui._colors;
    const cs = getComputedStyle(document.documentElement);
    const g = n => cs.getPropertyValue(n).trim();
    ui._colors = {
      theme: document.documentElement.dataset.theme,
      bg: g('--bg'), bg2: g('--bg2'), surface: g('--surface'), surface2: g('--surface2'), border: g('--border'), border2: g('--border2'),
      text: g('--text'), text2: g('--text2'), muted: g('--muted'), faint: g('--faint'), accent: g('--accent'),
      ok: g('--ok'), bad: g('--bad'), warn: g('--warn'), grid: g('--grid'), axis: g('--axis'),
      dark: document.documentElement.dataset.theme !== 'light'
    };
    // a palette for series: accent first, then well separated hues
    const L = ui._colors.dark ? '68%' : '46%';
    ui._colors.series = [ui._colors.accent, 'hsl(28 90% ' + L + ')', 'hsl(160 70% ' + L + ')', 'hsl(330 75% ' + L + ')', 'hsl(48 95% ' + L + ')', 'hsl(265 75% ' + L + ')', 'hsl(190 80% ' + L + ')'];
    ui._colors.hue = (h, a) => 'hsl(' + h + ' 75% ' + L + (a != null ? ' / ' + a : '') + ')';
    return ui._colors;
  };
  ui.leave = [];                          // cleanups run when the route changes
  ui.onLeave = fn => ui.leave.push(fn);
  ui.levelChip = function (lv) {
    const names = { 1: 'Introductory', 2: 'Intermediate', 3: 'Advanced' };
    return '<span class="chip lv' + lv + '" title="Level ' + lv + ' of 3"><span class="lvbar"><i class="on"></i><i' + (lv >= 2 ? ' class="on"' : '') + '></i><i' + (lv >= 3 ? ' class="on"' : '') + '></i></span>' + names[lv] + '</span>';
  };

  /* ================================================================ saved progress */
  const store = H.store = {
    data: null,
    key() { return 'hyper:' + H.discipline.id; },
    load() {
      let d = null;
      try { d = JSON.parse(localStorage.getItem(this.key()) || 'null'); } catch (e) { d = null; }
      this.data = Object.assign({ v: 1, visited: {}, stats: {}, understood: {}, bookmarks: [], recent: [], open: {}, cards: {} }, d || {});
    },
    save: U.debounce(function () {
      try { localStorage.setItem(store.key(), JSON.stringify(store.data)); } catch (e) { /* private mode */ }
    }, 250),
    visit(id) {
      const d = this.data;
      d.visited[id] = Date.now();
      d.recent = [id].concat(d.recent.filter(x => x !== id)).slice(0, 40);
      this.save();
    },
    record(id, correct) {
      const s = this.data.stats[id] || (this.data.stats[id] = { n: 0, c: 0, h: '' });
      s.n++; if (correct) s.c++;
      s.h = (s.h + (correct ? '1' : '0')).slice(-10);
      s.last = Date.now();
      if (!this.data.visited[id]) this.data.visited[id] = Date.now();
      this.save();
      ui.refreshDots && ui.refreshDots(id);
    },
    accuracy(id) {
      const s = this.data.stats[id];
      if (!s || !s.h) return null;
      return s.h.split('').filter(x => x === '1').length / s.h.length;
    },
    /* 0 unseen · 1 visited · 2 practised · 3 mastered */
    mastery(id) {
      const d = this.data;
      const s = d.stats[id];
      if (s && s.c >= 4 && this.accuracy(id) >= 0.8) return 3;
      if (s && s.c >= 1) return d.understood[id] && s.c >= 2 && this.accuracy(id) >= 0.75 ? 3 : 2;
      if (d.visited[id]) return 1;
      return 0;
    },
    toggleBookmark(id) {
      const b = this.data.bookmarks;
      const i = b.indexOf(id);
      if (i >= 0) b.splice(i, 1); else b.unshift(id);
      this.save();
      return i < 0;
    }
  };
  const settings = H.settings = {
    data: {},
    load() { try { this.data = JSON.parse(localStorage.getItem('hyper:settings') || '{}'); } catch (e) { this.data = {}; } },
    set(k, v) { this.data[k] = v; try { localStorage.setItem('hyper:settings', JSON.stringify(this.data)); } catch (e) {} }
  };

  /* concepts under a node (itself included when it is a concept) */
  H.conceptsUnder = function (id) {
    const out = [];
    (function walk(x) {
      const n = H.nodes.get(x);
      if (!n) return;
      if (n.kind === 'concept') out.push(x);
      n.children.forEach(walk);
    })(id);
    return out;
  };
  H.progressOf = function (id) {
    const c = H.conceptsUnder(id);
    let v = 0, m = 0, p = 0;
    for (const x of c) { const k = store.mastery(x); if (k >= 1) v++; if (k >= 2) p++; if (k >= 3) m++; }
    return { total: c.length, visited: v, practised: p, mastered: m };
  };

  /* ================================================================ theme */
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  function applyTheme() {
    const pref = settings.data.theme || 'auto';
    const t = pref === 'auto' ? (mq && mq.matches ? 'light' : 'dark') : pref;
    document.documentElement.dataset.theme = t;
    ui._colors = null;
    const b = ui.$('#themeBtn');
    if (b) b.title = 'Theme: ' + pref + ' (click to change)';
    document.dispatchEvent(new CustomEvent('hyper:theme'));
  }
  if (mq && mq.addEventListener) mq.addEventListener('change', applyTheme);
  function cycleTheme() {
    const order = ['auto', 'light', 'dark'];
    const cur = settings.data.theme || 'auto';
    const next = order[(order.indexOf(cur) + 1) % 3];
    settings.set('theme', next);
    applyTheme();
    ui.toast('Theme: ' + next);
  }

  /* ================================================================ shell */
  function shell() {
    const d = H.discipline;
    const discs = Object.values(H.DISCIPLINES).map(x => {
      const on = x.id === d.id;
      if (!x.ready) return '<a class="soon" style="--x:' + x.hue + '" title="' + esc(x.title) + ' is coming later" aria-disabled="true">' + esc(x.short) + '</a>';
      return '<a class="' + (on ? 'on' : '') + '" style="--x:' + x.hue + '" href="' + (on ? '#/' : '../' + x.folder + '/index.html') + '">' + esc(x.short) + '</a>';
    }).join('');
    const nav = [['map', 'Map'], ['formulas', 'Formulas'], ['practice', 'Practice'], ['tools', 'Tools'], ['progress', 'Progress']];
    document.body.innerHTML =
      '<div id="app" style="--dh:' + d.hue + '">' +
        '<header id="top">' +
          '<button class="icon-btn" id="navBtn" aria-label="Contents" title="Contents">' + H.icon('menu', 20) + '</button>' +
          '<a class="brand" href="#/" title="Home">' + logo(d) + '<span>Hyper <b>' + esc(d.short) + '</b></span></a>' +
          '<nav class="discs" aria-label="Disciplines">' + discs + '</nav>' +
          '<div class="search" role="search">' + '<span class="sicon">' + H.icon('search', 16) + '</span>' +
            '<input id="q" type="search" autocomplete="off" spellcheck="false" placeholder="Search concepts, formulas, symbols…" aria-label="Search">' +
            '<kbd>Ctrl K</kbd><div class="qres" id="qres" role="listbox"></div></div>' +
          '<nav class="views" aria-label="Views">' + nav.map(([k, t]) => '<a href="#/' + k + '" data-v="' + k + '" title="' + t + '">' + H.icon(k, 18) + '<span>' + t + '</span></a>').join('') + '</nav>' +
          '<button class="icon-btn" id="themeBtn" aria-label="Theme">' + H.icon('theme', 18) + '</button>' +
        '</header>' +
        '<aside id="side" aria-label="Contents"></aside>' +
        '<main id="view" tabindex="-1"></main>' +
        '<nav class="mobnav">' + [['', 'Home', 'home']].concat(nav.map(([k, t]) => [k, t, k])).map(([k, t, ic]) => '<a href="#/' + k + '" data-v="' + (k || 'home') + '">' + H.icon(ic, 19) + t + '</a>').join('') + '</nav>' +
      '</div>' +
      '<div class="pop" id="pop"></div><div class="toast" id="toast"></div>';
    ui.$('#navBtn').onclick = () => document.body.classList.toggle('navopen');
    ui.$('#themeBtn').onclick = cycleTheme;
    document.addEventListener('click', e => {
      if (document.body.classList.contains('navopen') && !e.target.closest('#side') && !e.target.closest('#navBtn')) document.body.classList.remove('navopen');
    });
  }

  function logo(d) {
    // three linked nodes: the idea of the concept map
    return '<svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true"><path d="M9 22 16 9l8 12z" fill="none" stroke="hsl(' + d.hue + ' 80% 65%)" stroke-width="1.6" opacity=".6"/>' +
      '<circle cx="16" cy="9" r="5" fill="hsl(' + d.hue + ' 85% 66%)"/><circle cx="8.5" cy="22.5" r="4" fill="hsl(' + ((d.hue + 120) % 360) + ' 75% 62%)"/><circle cx="24" cy="21.5" r="4" fill="hsl(' + ((d.hue + 240) % 360) + ' 75% 64%)"/></svg>';
  }

  /* ================================================================ contents tree */
  function sideTree() {
    const side = ui.$('#side');
    const open = store.data.open;
    const item = (id, depth) => {
      const n = H.nodes.get(id);
      const kids = n.children;
      const isB = n.kind === 'branch';
      const cnt = isB ? H.conceptsUnder(id).length : 0;
      const tw = '<span class="tw' + (kids.length ? '' : ' none') + '" data-tw="' + id + '">' + H.icon('right', 12) + '</span>';
      const dot = isB ? '<span class="bdot"></span>' : '<span class="mdot m' + store.mastery(id) + '" data-md="' + id + '"></span>';
      return '<li class="' + (open[id] ? 'open' : '') + '" data-li="' + id + '"><a class="ti' + (isB ? ' branch' : '') + '" href="#/c/' + id + '" data-id="' + id + '" style="--h:' + n.hue + '">' +
        tw + dot + '<span class="tl">' + esc(n.title) + '</span>' + (isB ? '<span class="cnt">' + cnt + '</span>' : '') + '</a>' +
        (kids.length ? '<ul>' + kids.map(k => item(k, depth + 1)).join('') + '</ul>' : '') + '</li>';
    };
    const roots = H.root ? H.root.children : [];
    side.innerHTML = '<div class="side-h"><span>Contents</span><button id="collapseAll" title="Collapse everything">Collapse</button></div>' +
      '<ul class="tree">' + roots.map(id => item(id, 0)).join('') + '</ul>';
    side.addEventListener('click', e => {
      const tw = e.target.closest('[data-tw]');
      if (tw) {
        e.preventDefault(); e.stopPropagation();
        const li = tw.closest('li');
        li.classList.toggle('open');
        const id = tw.dataset.tw;
        if (li.classList.contains('open')) open[id] = 1; else delete open[id];
        store.save();
        return;
      }
      if (e.target.closest('a.ti') && window.innerWidth <= 900) document.body.classList.remove('navopen');
    });
    ui.$('#collapseAll').onclick = () => {
      ui.$$('#side li.open').forEach(li => li.classList.remove('open'));
      store.data.open = {};
      store.save();
    };
  }

  function sideMark(id) {
    ui.$$('#side .ti.cur').forEach(a => a.classList.remove('cur'));
    if (!id) return;
    const n = H.nodes.get(id);
    if (!n) return;
    for (const a of n.path.slice(0, -1)) {
      const li = ui.$('#side li[data-li="' + a + '"]');
      if (li) { li.classList.add('open'); store.data.open[a] = 1; }
    }
    const cur = ui.$('#side a.ti[data-id="' + id + '"]');
    if (cur) {
      cur.classList.add('cur');
      const r = cur.getBoundingClientRect(), sr = ui.$('#side').getBoundingClientRect();
      if (r.top < sr.top + 30 || r.bottom > sr.bottom - 30) cur.scrollIntoView({ block: 'center' });
    }
  }
  ui.refreshDots = function (id) {
    ui.$$('[data-md="' + id + '"]').forEach(d => { d.className = 'mdot m' + store.mastery(id); });
  };

  /* ================================================================ search */
  let index = null;
  const GREEK_NAMES = { 'α': 'alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta', 'ε': 'epsilon', 'ϵ': 'epsilon', 'ζ': 'zeta', 'η': 'eta', 'θ': 'theta', 'ι': 'iota', 'κ': 'kappa',
    'λ': 'lambda', 'μ': 'mu', 'ν': 'nu', 'ξ': 'xi', 'π': 'pi', 'ρ': 'rho', 'σ': 'sigma', 'τ': 'tau', 'υ': 'upsilon', 'φ': 'phi', 'ϕ': 'phi', 'χ': 'chi', 'ψ': 'psi', 'ω': 'omega',
    'Γ': 'Gamma', 'Δ': 'Delta', 'Θ': 'Theta', 'Λ': 'Lambda', 'Π': 'Pi', 'Σ': 'Sigma', 'Φ': 'Phi', 'Ψ': 'Psi', 'Ω': 'Omega' };
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function buildIndex() {
    index = [];
    for (const n of H.list) {
      if (n.kind === 'root') continue;
      const br = n.branch && n.branch !== n.id ? H.nodes.get(n.branch).title : '';
      index.push({ k: 'c', id: n.id, t: n.title, tl: norm(n.title), kw: norm(n.keywords.join(' ')), s: n.short || '', sl: norm(n.short),
                   b: br, h: n.hue, body: norm(H.plain(n.body || '').slice(0, 3000) + ' ' + n.ideas.join(' ')) });
      (n.formulas || []).forEach((f, i) => {
        const vars = f.vars ? Object.entries(f.vars).map(([k, v]) => k + ' ' + (v.name || '') + ' ' + (v.tex || '') + ' ' + (v.const || '')).join(' ') : '';
        index.push({ k: 'f', id: n.id, i, t: f.name || 'Formula', tl: norm(f.name), tex: f.tex, expr: f.expr, kw: norm(vars + ' ' + f.expr), b: n.title, h: n.hue });
      });
    }
    for (const [disc, cat] of Object.entries(H.catalogs)) {
      const d = H.DISCIPLINES[disc];
      for (const e of cat.values()) index.push({ k: 'x', disc, id: e.id, t: e.title, tl: norm(e.title), s: e.short, sl: norm(e.short), kw: '', b: (d ? d.short : disc) + (e.branch ? ' · ' + e.branch : ''), h: d ? d.hue : 0 });
    }
  }
  function search(q) {
    if (!index) buildIndex();
    let raw = q.trim();
    if (!raw) return [];
    // a Greek letter typed directly finds the symbol
    raw = raw.replace(/[α-ωΑ-Ωϵϕ]/g, c => ' ' + (GREEK_NAMES[c] || c) + ' ');
    const toks = norm(raw).split(/\s+/).filter(Boolean);
    const whole = toks.join(' ');
    const res = [];
    for (const e of index) {
      let score = 0, all = true;
      for (const t of toks) {
        let s = 0;
        if (e.tl === t) s = 60;
        else if (e.tl.startsWith(t)) s = 42;
        else if (new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).test(e.tl)) s = 32;
        else if (e.tl.includes(t)) s = 18;
        else if (e.kw && e.kw.includes(t)) s = 14;
        else if (e.sl && e.sl.includes(t)) s = 8;
        else if (e.body && e.body.includes(t)) s = 3;
        if (!s) { all = false; break; }
        score += s;
      }
      if (!all) continue;
      if (e.tl === whole) score += 80;
      else if (e.tl.startsWith(whole)) score += 30;
      if (e.k === 'f') score -= 4;
      if (e.k === 'x') score -= 10;
      res.push([score, e]);
    }
    res.sort((a, b) => b[0] - a[0] || a[1].t.length - b[1].t.length);
    return res.slice(0, 14).map(r => r[1]);
  }
  function mark(text, q) {
    const toks = norm(q).split(/\s+/).filter(t => t.length > 1);
    let h = esc(text);
    for (const t of toks) {
      const i = norm(text).indexOf(t);
      if (i >= 0) { h = esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + t.length)) + '</mark>' + esc(text.slice(i + t.length)); break; }
    }
    return h;
  }
  function searchUI() {
    const inp = ui.$('#q'), box = ui.$('#qres');
    let sel = -1, items = [];
    const hrefOf = e => e.k === 'x' ? H.href(e.disc + ':' + e.id) : '#/c/' + e.id + (e.k === 'f' ? '?f=' + e.i : '');
    const render = () => {
      const q = inp.value;
      items = search(q);
      sel = items.length ? 0 : -1;
      if (!q.trim()) { box.classList.remove('on'); return; }
      if (!items.length) { box.innerHTML = '<div class="empty">Nothing matches “' + esc(q) + '”.</div>'; box.classList.add('on'); return; }
      let h = '', last = '';
      items.forEach((e, i) => {
        const g = e.k === 'c' ? 'Concepts' : e.k === 'f' ? 'Formulas' : 'In other disciplines';
        if (g !== last) { h += '<div class="grp">' + g + '</div>'; last = g; }
        let math = '';
        if (e.k === 'f') { try { math = e.tex ? H.tex(e.tex, false) : H.tex(H.formulasOf(H.nodes.get(e.id))[e.i].displayTex, false); } catch (x) { math = ''; } }
        h += '<a href="' + hrefOf(e) + '" data-i="' + i + '" style="--h:' + e.h + '" class="' + (i === sel ? 'sel' : '') + '">' +
             '<div><div class="qt">' + mark(e.t, q) + '</div>' + (e.b ? '<div class="qb">' + esc(e.b) + '</div>' : '') +
             (e.s ? '<div class="qs">' + H.inline(e.s) + '</div>' : '') + '</div>' + (math ? '<div class="qm">' + math + '</div>' : '') + '</a>';
      });
      box.innerHTML = h;
      box.classList.add('on');
    };
    const move = d => {
      if (!items.length) return;
      sel = (sel + d + items.length) % items.length;
      ui.$$('a', box).forEach(a => a.classList.toggle('sel', +a.dataset.i === sel));
      const a = ui.$('a.sel', box);
      if (a) a.scrollIntoView({ block: 'nearest' });
    };
    inp.addEventListener('input', render);
    inp.addEventListener('focus', () => { if (inp.value.trim()) render(); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        if (sel >= 0 && items[sel]) { const href = hrefOf(items[sel]); close(); if (href.startsWith('#')) location.hash = href; else location.href = href; }
      } else if (e.key === 'Escape') { close(); inp.blur(); }
    });
    box.addEventListener('mousedown', e => e.preventDefault());
    box.addEventListener('click', e => { if (e.target.closest('a')) close(); });
    inp.addEventListener('blur', () => setTimeout(() => box.classList.remove('on'), 120));
    function close() { box.classList.remove('on'); inp.value = ''; inp.blur(); }
  }
  H.search = search;

  /* ================================================================ link previews */
  function previews() {
    const pop = ui.$('#pop');
    let timer = 0, cur = null;
    const hide = () => { clearTimeout(timer); pop.classList.remove('on'); cur = null; };
    document.addEventListener('mouseover', e => {
      const a = e.target.closest('[data-ref]');
      if (!a || a === cur) return;
      if (!matchMedia('(hover: hover)').matches) return;
      cur = a;
      clearTimeout(timer);
      timer = setTimeout(() => {
        const ref = a.dataset.ref;
        if (!ref) return;
        const r = H.ref(ref);
        let html = '';
        if (r.local) {
          const n = H.nodes.get(r.id);
          if (!n) return;
          const br = n.branch && n.branch !== n.id ? H.nodes.get(n.branch).title : H.discipline.short;
          let f = '';
          const fs = H.formulasOf(n);
          if (fs[0]) { try { f = '<div class="pf">' + H.tex(fs[0].displayTex, false) + '</div>'; } catch (x) { f = ''; } }
          html = '<div style="--h:' + n.hue + '"><div class="pb">' + esc(br) + '</div><div class="ptt">' + esc(n.title) + '</div><div class="psm">' + H.inline(n.short || '') + '</div>' + f + '</div>';
        } else {
          const d = H.DISCIPLINES[r.disc];
          const c = H.catalogs[r.disc] && H.catalogs[r.disc].get(r.id);
          html = '<div style="--h:' + (d ? d.hue : 0) + '"><div class="pb">' + esc(d ? d.title : r.disc) + (c && c.branch ? ' · ' + esc(c.branch) : '') + '</div><div class="ptt">' + esc(H.titleOf(ref)) + '</div><div class="psm">' + (c ? H.inline(c.short) : 'Opens in ' + esc(d ? d.title : r.disc)) + '</div></div>';
        }
        pop.innerHTML = html;
        const b = a.getBoundingClientRect();
        const W = 330;
        let x = Math.min(window.innerWidth - W - 12, Math.max(12, b.left));
        let y = b.bottom + 8;
        pop.style.left = x + 'px';
        pop.style.top = y + 'px';
        pop.classList.add('on');
        const ph = pop.getBoundingClientRect().height;
        if (y + ph > window.innerHeight - 10) pop.style.top = (b.top - ph - 8) + 'px';
      }, 380);
    });
    document.addEventListener('mouseout', e => {
      if (cur && !cur.contains(e.relatedTarget)) hide();
    });
    document.addEventListener('scroll', hide, true);
    window.addEventListener('hashchange', hide);
  }

  /* ================================================================ router */
  H.views = H.views || {};
  let lastPath = null;
  function route() {
    const hash = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = hash.split('?');
    const params = new URLSearchParams(qs || '');
    const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
    for (const f of ui.leave.splice(0)) { try { f(); } catch (e) { console.error(e); } }
    const view = ui.$('#view');
    const samePage = path === lastPath;
    lastPath = path;
    const name = parts[0] || 'home';
    ui.$$('#top .views a, .mobnav a').forEach(a => a.classList.toggle('on', a.dataset.v === name || (name === 'home' && a.dataset.v === 'home')));
    document.body.classList.toggle('noside', name === 'map');
    let curId = null;
    try {
      if (name === 'c' && parts[1]) { curId = parts[1]; H.views.concept(parts[1], params, samePage); }
      else if (H.views[name]) H.views[name](parts.slice(1), params, samePage);
      else H.views.home();
    } catch (e) {
      console.error(e);
      view.innerHTML = '<div class="page"><h1>Something went wrong</h1><pre>' + esc(e.stack || e.message) + '</pre></div>';
    }
    sideMark(curId);
    if (!samePage || !params.toString()) { if (!params.get('s') && !params.get('f')) view.scrollTop = 0; }
  }
  H.go = function (hash) { if (location.hash === hash) route(); else location.hash = hash; };
  ui.page = function (html, cls) {
    const v = ui.$('#view');
    v.innerHTML = '<div class="page ' + (cls || '') + '">' + html + '</div>';
    return v.firstElementChild;
  };
  ui.setTitle = t => { document.title = (t ? t + ' · ' : '') + H.discipline.title; };

  /* ================================================================ home */
  H.views.home = function () {
    ui.setTitle('');
    const d = H.discipline;
    const root = H.root;
    const concepts = H.list.filter(n => n.kind === 'concept');
    const nForm = H.list.reduce((a, n) => a + n.formulas.length, 0);
    const nSims = Object.keys(H.sims).length;
    const pr = H.progressOf(root.id);
    const recent = store.data.recent.filter(id => H.nodes.has(id)).slice(0, 6);
    const last = recent[0] ? H.nodes.get(recent[0]) : null;
    const next = suggestions(8);
    const due = H.practice ? H.practice.dueCount() : 0;
    const bcards = H.branches.map(b => {
      const p = H.progressOf(b.id);
      const tops = b.children.slice(0, 7).map(id => '<span>' + esc(H.nodes.get(id).title) + '</span>').join('');
      return '<a class="bcard" href="#/c/' + b.id + '" style="--h:' + b.hue + '" data-ref="' + b.id + '">' +
        '<div class="bh"><div class="bi">' + H.badge(b) + '</div><div><div class="bt">' + esc(b.title) + '</div><div class="bn">' + p.total + ' concepts' +
        (p.visited ? ' · ' + p.visited + ' visited' : '') + '</div></div></div>' +
        '<div class="bs">' + H.inline(b.short || '') + '</div><div class="btops">' + tops + '</div>' +
        '<div class="bar" title="' + p.mastered + ' mastered, ' + p.visited + ' visited"><i class="ok" style="width:' + (p.total ? 100 * p.mastered / p.total : 0) + '%"></i><i style="width:' + (p.total ? 100 * (p.visited - p.mastered) / p.total : 0) + '%;opacity:.5"></i></div></a>';
    }).join('');
    const listCard = id => {
      const n = H.nodes.get(id);
      return '<a class="lcard" href="#/c/' + id + '" style="--h:' + n.hue + '" data-ref="' + id + '"><span class="mdot m' + store.mastery(id) + '"></span><div><div class="lt">' + esc(n.title) + '</div><div class="ls">' + H.inline(n.short || '') + '</div></div></a>';
    };
    ui.page(
      '<section class="hero"><div>' +
        '<h1>Hyper <b>' + esc(d.short) + '</b></h1>' +
        '<p>' + H.inline(root.short || '') + '</p>' +
        '<div class="btnrow">' +
          (last ? '<a class="btn pri lg" href="#/c/' + last.id + '">' + H.icon('play', 18) + 'Continue: ' + esc(last.title) + '</a>'
                : '<a class="btn pri lg" href="#/c/' + (H.branches[0] ? H.branches[0].id : root.id) + '">' + H.icon('play', 18) + 'Start with ' + esc(H.branches[0] ? H.branches[0].title : '') + '</a>') +
          '<a class="btn lg" href="#/map">' + H.icon('map', 18) + 'Explore the map</a>' +
          (due ? '<a class="btn lg" href="#/practice/review">' + H.icon('refresh', 18) + 'Review (' + due + ')</a>' : '') +
        '</div>' +
        '<div class="stats">' +
          '<div class="stat"><b>' + concepts.length + '</b><span>concepts</span></div>' +
          '<div class="stat"><b>' + nForm + '</b><span>live formulas</span></div>' +
          '<div class="stat"><b>' + nSims + '</b><span>simulations</span></div>' +
          '<div class="stat"><b>' + (pr.total ? Math.round(100 * pr.visited / pr.total) : 0) + '%</b><span>explored · ' + pr.mastered + ' mastered</span></div>' +
        '</div></div>' +
        '<div class="hero-art">' + heroArt() + '</div></section>' +
      (root.body ? '<div class="prose mt">' + H.text(root.body) + '</div>' : '') +
      '<h2 class="h2">Branches</h2><div class="branches">' + bcards + '</div>' +
      (next.length ? '<h2 class="h2">Suggested next</h2><p class="muted small" style="margin-top:-6px">Concepts whose prerequisites you have already visited.</p><div class="hlist">' + next.map(listCard).join('') + '</div>' : '') +
      (recent.length ? '<h2 class="h2">Recently visited</h2><div class="hlist">' + recent.map(listCard).join('') + '</div>' : '') +
      howTo()
    );
  };

  function howTo() {
    return '<h2 class="h2">How to use it</h2><div class="pgrid">' +
      [['map', 'Follow the map', 'Every page opens with its neighbourhood: what it builds on, what it leads to. Click any bubble.'],
       ['formulas', 'Solve for anything', 'Each formula is a calculator. Click a symbol to make it the unknown; drag sliders and watch the graph.'],
       ['play', 'Play with it', 'Simulations let you change the physics and see what happens before you calculate it.'],
       ['practice', 'Practise', 'Quick checks, problems generated from the formulas with worked solutions, flashcards and a daily review.'],
       ['route', 'Plan a path', 'Pick a concept and get the prerequisites in the order to learn them.'],
       ['keyboard', 'Shortcuts', '<kbd>Ctrl K</kbd> or <kbd>/</kbd> search · <kbd>M</kbd> map · <kbd>[</kbd> <kbd>]</kbd> previous / next · <kbd>?</kbd> all shortcuts']]
        .map(([ic, t, s]) => '<div class="pcard"><div class="pt">' + H.icon(ic, 18) + esc(t) + '</div><div class="pd">' + s + '</div></div>').join('') + '</div>';
  }

  /* the home picture: this discipline's branches around it, drawn as the concept map */
  function heroArt() {
    const bs = H.branches;
    const W = 420, Hh = 365, cx = W / 2, cy = Hh / 2;
    const R = 132;
    let edges = '', nodes = '';
    bs.forEach((b, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / bs.length;
      const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a) * 0.95;
      edges += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" stroke="hsl(' + b.hue + ' 70% 60% / .45)" stroke-width="1.5"/>';
      // a few children as satellites
      b.children.slice(0, 4).forEach((k, j) => {
        const a2 = a + (j - 1.5) * 0.19;
        const x2 = cx + (R + 44 + (j % 2) * 10) * Math.cos(a2), y2 = cy + (R + 44 + (j % 2) * 10) * Math.sin(a2) * 0.95;
        edges += '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="hsl(' + b.hue + ' 70% 60% / .3)"/>';
        nodes += '<circle cx="' + x2.toFixed(1) + '" cy="' + y2.toFixed(1) + '" r="3.5" fill="hsl(' + b.hue + ' 75% 64%)" opacity=".8"/>';
      });
      nodes += '<a href="#/c/' + b.id + '"><g style="--h:' + b.hue + '"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="21" fill="hsl(' + b.hue + ' 70% 60% / .18)" stroke="hsl(' + b.hue + ' 75% 64%)" stroke-width="1.6"/>' +
        '<g transform="translate(' + (x - 10).toFixed(1) + ' ' + (y - 10).toFixed(1) + ')" color="hsl(' + b.hue + ' 80% 70%)">' + (b.icon && H.hasIcon(b.icon) ? H.icon(b.icon, 20) : '<text x="10" y="15" text-anchor="middle" font-size="15" fill="currentColor" font-family="Cambria Math, serif">' + esc(b.icon || b.title[0]) + '</text>') + '</g>' +
        '<title>' + esc(b.title) + '</title></g></a>';
    });
    const d = H.discipline;
    return '<svg viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="The branches of ' + esc(d.title) + '">' + edges +
      '<circle cx="' + cx + '" cy="' + cy + '" r="40" fill="hsl(' + d.hue + ' 80% 62% / .2)" stroke="hsl(' + d.hue + ' 85% 66%)" stroke-width="2"/>' +
      '<text x="' + cx + '" y="' + (cy + 5) + '" text-anchor="middle" font-size="15" font-weight="700" fill="hsl(' + d.hue + ' 85% 70%)" font-family="Segoe UI, sans-serif">' + esc(d.short) + '</text>' + nodes + '</svg>';
  }

  /* concepts not yet visited whose local prerequisites all are */
  function suggestions(k) {
    const v = store.data.visited;
    const out = [];
    for (const id of H.order) {
      const n = H.nodes.get(id);
      if (n.kind !== 'concept' || v[id]) continue;
      const pre = n.prereq.map(H.ref).filter(r => r.local && H.nodes.has(r.id));
      if (!pre.length) continue;
      if (pre.every(r => v[r.id])) out.push(id);
      if (out.length >= k) break;
    }
    if (out.length < 3) {
      for (const id of H.order) {
        const n = H.nodes.get(id);
        if (n.kind === 'concept' && !v[id] && !out.includes(id) && !n.prereq.some(p => H.ref(p).local)) out.push(id);
        if (out.length >= Math.min(k, 6)) break;
      }
    }
    return out;
  }
  H.suggestions = suggestions;

  /* ================================================================ keyboard */
  function keys() {
    document.addEventListener('keydown', e => {
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ui.$('#q').focus(); ui.$('#q').select(); return; }
      if (typing || e.ctrlKey || e.metaKey || e.altKey) {
        if (e.altKey && e.key === 'ArrowLeft') history.back();
        if (e.altKey && e.key === 'ArrowRight') history.forward();
        return;
      }
      if (e.key === '/') { e.preventDefault(); ui.$('#q').focus(); }
      else if (e.key === 'm' || e.key === 'M') H.go('#/map');
      else if (e.key === 'h' || e.key === 'H') H.go('#/');
      else if (e.key === 'f' || e.key === 'F') H.go('#/formulas');
      else if (e.key === 'p' || e.key === 'P') H.go('#/practice');
      else if (e.key === 't' || e.key === 'T') H.go('#/tools');
      else if (e.key === '[' || e.key === ']') {
        const m = /^#\/c\/([^?]+)/.exec(location.hash);
        if (!m) return;
        const i = H.order.indexOf(m[1]);
        const j = i + (e.key === ']' ? 1 : -1);
        if (i >= 0 && j >= 0 && j < H.order.length) H.go('#/c/' + H.order[j]);
      } else if (e.key === '?') help();
      else if (e.key === 'Escape') document.body.classList.remove('navopen');
    });
  }
  function help() {
    let d = ui.$('#helpDlg');
    if (!d) {
      d = ui.el('<dialog class="modal" id="helpDlg"><h2>Keyboard shortcuts</h2><div class="kbdhelp">' +
        [['Ctrl K  or  /', 'Search'], ['M', 'Concept map'], ['F', 'Formula sheet'], ['P', 'Practice'], ['T', 'Tools'], ['H', 'Home'],
         ['[  ]', 'Previous / next concept in reading order'], ['Alt ← →', 'Back / forward'], ['↑ ↓ Enter', 'Move through search results'],
         ['1 – 4', 'Answer a multiple-choice question'], ['Enter', 'Check an answer, then go on'], ['?', 'This help']]
          .map(([k, v]) => '<div>' + k.split('  ').map(x => '<kbd>' + esc(x) + '</kbd>').join(' ') + '</div><div>' + esc(v) + '</div>').join('') +
        '</div><div class="qfoot"><button class="btn" onclick="this.closest(\'dialog\').close()">Close</button></div></dialog>');
      document.body.appendChild(d);
    }
    d.showModal();
  }
  H.help = help;

  /* ================================================================ start */
  H.start = function (cfg) {
    H.use(cfg.discipline);
    H.build();
    if (H.errors.length) console.warn('Hyper content problems:\n' + H.errors.join('\n'));
    settings.load();
    store.load();
    applyTheme();
    shell();
    sideTree();
    searchUI();
    previews();
    keys();
    window.addEventListener('hashchange', route);
    route();
  };
})();
