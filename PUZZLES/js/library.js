/* The Puzzle Cabinet · library.js
 *
 * Finding a puzzle: the home page, the shelves (categories), the drawers
 * (families), the eras, the concept pages, search, and the catalog helpers
 * the rest of the app uses to look puzzles up without loading them.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const h = (...a) => C.h(...a);

  /* ---------- the catalog ---------- */

  let rows = [], rowById = {}, famRows = {}, backIdx = null;

  C.initCatalog = function () {
    const cd = C.catalogData || { families: {}, rows: [] };
    // timeline events and ideas that puzzle files declare, known before those files are opened
    if (cd.history) C.history(cd.history);
    if (cd.concepts) C.concepts(cd.concepts.filter((c) => !C.conceptById[c.id]));
    rows = cd.rows.map((r, i) => {
      const fam = cd.families[r[2]] || {};
      return {
        id: r[0], title: r[1], family: r[2], diff: r[3] || 0, year: r[4] == null ? null : r[4],
        tags: r[5] ? r[5].split(' ') : [], concepts: r[6] ? r[6].split(' ') : [], links: r[7] ? r[7].split(' ') : [],
        cat: fam.cat, i
      };
    });
    rowById = {};
    famRows = {};
    rows.forEach((r) => {
      rowById[r.id] = r;
      (famRows[r.family] = famRows[r.family] || []).push(r);
    });
    backIdx = null;
  };
  C.row = (id) => rowById[id] || null;
  C.rows = () => rows;
  C.familyRows = (fid) => famRows[fid] || [];
  C.famInfo = (fid) => (C.catalogData && C.catalogData.families[fid]) || null;
  C.backlinks = function (id) {
    if (!backIdx) {
      backIdx = {};
      rows.forEach((r) => r.links.forEach((t) => { (backIdx[t] = backIdx[t] || []).push(r.id); }));
    }
    return backIdx[id] || [];
  };
  C.familiesOf = function (cat) {
    const fams = (C.catalogData && C.catalogData.families) || {};
    return Object.keys(fams).filter((k) => fams[k].cat === cat).map((k) => Object.assign({ id: k }, fams[k])).sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name));
  };

  C.loadFamily = async function (fid) {
    const f = C.famInfo(fid);
    if (!f) throw new Error('unknown family ' + fid);
    for (const d of f.deps || []) await C.load(d);
    await C.load('engines/' + f.engine + '.js');
    for (const file of f.files) await C.load(file);
    return C.families[fid];
  };

  /* ---------- small shared widgets ---------- */

  C.diffBadge = function (d) {
    const el = h('span.diff', { title: 'Difficulty: ' + (C.diffs[d] ? C.diffs[d].name : '?') });
    for (let i = 1; i <= 5; i++) el.appendChild(h('i' + (i <= d ? '.on' : '')));
    return el;
  };
  C.starRow = function (n, title) {
    const el = h('span.starrow', { title: title || (n + ' of 3 stars') });
    for (let i = 0; i < 3; i++) el.appendChild(h('span' + (i < n ? '.on' : ''), '★'));
    return el;
  };
  C.puzzleLink = function (r) {
    const rec = C.progress.get(r.id);
    const cat = C.catById[r.cat] || {};
    return h('a.plink' + (rec && !rec.seen ? '.done' : ''), { href: '#/p/' + r.id, style: { '--hue': cat.hue } },
      h('i.plink-dot'), h('span.plink-t', r.title), h('small', (C.famInfo(r.family) || {}).name || ''));
  };
  C.notFound = function (msg) {
    return h('div.empty', h('div.empty-art', { html: C.sphinxArt() }), h('p', msg), h('a.btn.primary', { href: '#/' }, 'Back to the cabinet'));
  };

  const helpSeen = C.store.get('helpseen', {}) || {};
  C.helpSeen = (fid) => !!helpSeen[fid];
  C.markHelpSeen = (fid) => { helpSeen[fid] = 1; C.store.set('helpseen', helpSeen); };

  function stats(list) {
    let done = 0, stars = 0;
    list.forEach((r) => { const rec = C.progress.get(r.id); if (rec && !rec.seen) { done++; stars += rec.s || 0; } });
    return { done, stars, total: list.length };
  }
  C.statsOf = stats;

  function meter(st) {
    const pct = st.total ? Math.round(100 * st.done / st.total) : 0;
    return h('div.meter', { title: st.done + ' of ' + st.total + ' solved' }, h('i', { style: { width: pct + '%' } }));
  }

  // a category's picture: a few simple shapes in its colour
  const ART = {
    matches: '<g stroke-linecap="round"><path d="M14 44L40 18" stroke="#e0b070" stroke-width="5"/><path d="M40 18l4-4" stroke="#e8554e" stroke-width="7"/><path d="M22 50h30" stroke="#e0b070" stroke-width="5"/><path d="M52 50h5" stroke="#e8554e" stroke-width="7"/><path d="M18 14v26" stroke="#e0b070" stroke-width="5"/><path d="M18 14v-5" stroke="#e8554e" stroke-width="7"/></g>',
    coins: '<circle cx="24" cy="36" r="13" fill="#e8c35a" stroke="#9c7a1e" stroke-width="3"/><circle cx="42" cy="26" r="13" fill="#d9dde8" stroke="#8b93a8" stroke-width="3"/><circle cx="24" cy="36" r="7" fill="none" stroke="#9c7a1e" stroke-width="2"/>',
    shapes: '<path d="M10 50L32 28L54 50z" fill="currentColor" opacity=".9"/><path d="M32 28L10 6h22z" fill="currentColor" opacity=".55"/><path d="M32 6h22v22z" fill="currentColor" opacity=".35"/>',
    paper: '<path d="M12 10h40v40H12z" fill="#f4efe1"/><path d="M52 10L12 50" stroke="#b9ad8e" stroke-width="2" stroke-dasharray="4 3"/><path d="M52 10v40H12z" fill="#d9cfb6"/>',
    ropes: '<path d="M8 40c10-28 30-28 26-4s-26 12-8-6 30-6 30 12" fill="none" stroke="#ffb057" stroke-width="5" stroke-linecap="round"/>',
    measure: '<path d="M14 18h14v30H14z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M16 34h10v12H16z" fill="#38d9d3"/><path d="M36 10h16v38H36z" fill="none" stroke="currentColor" stroke-width="3"/><path d="M38 22h12v24H38z" fill="#38d9d3"/>',
    routes: '<g fill="currentColor"><circle cx="12" cy="44" r="5"/><circle cx="32" cy="14" r="5"/><circle cx="52" cy="44" r="5"/><circle cx="32" cy="36" r="5"/></g><path d="M12 44L32 14L52 44L32 36L12 44M32 14v22" fill="none" stroke="currentColor" stroke-width="3"/>',
    numbers: '<text x="32" y="44" text-anchor="middle" font-size="34" font-weight="800" fill="currentColor" font-family="Georgia,serif">7+</text>',
    logic: '<path d="M14 18h36M14 32h36M14 46h36M22 10v44M36 10v44" stroke="currentColor" stroke-width="3" opacity=".6"/><path d="M40 22l4 4 7-8" stroke="#4ecb8d" stroke-width="4" fill="none"/>',
    pencil: '<path d="M10 10h44v44H10zM10 24.7h44M10 39.3h44M24.7 10v44M39.3 10v44" fill="none" stroke="currentColor" stroke-width="2.5"/><text x="17.3" y="21" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">3</text><text x="46.6" y="50" text-anchor="middle" font-size="10" font-weight="700" fill="currentColor">1</text>',
    space: '<path d="M32 8l20 11v22L32 52 12 41V19z" fill="currentColor" opacity=".35"/><path d="M32 30l20-11M32 30L12 19M32 30v22" stroke="currentColor" stroke-width="3" fill="none"/>',
    physics: '<circle cx="24" cy="30" r="13" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="4 3"/><circle cx="44" cy="40" r="9" fill="none" stroke="currentColor" stroke-width="5" stroke-dasharray="3.5 3"/>',
    chance: '<rect x="12" y="16" width="28" height="28" rx="6" fill="#f4f1e8" transform="rotate(-12 26 30)"/><g fill="#1b2140"><circle cx="20" cy="26" r="2.5"/><circle cx="27" cy="31" r="2.5"/><circle cx="33" cy="36" r="2.5"/></g><text x="47" y="52" font-size="22" font-weight="800" fill="currentColor">?</text>',
    cards: '<rect x="12" y="12" width="24" height="34" rx="4" fill="#f4f1e8" transform="rotate(-10 24 29)"/><rect x="28" y="16" width="24" height="34" rx="4" fill="#f4f1e8" transform="rotate(8 40 33)"/><text x="40" y="38" text-anchor="middle" font-size="16" fill="#e8554e" transform="rotate(8 40 33)">♥</text>',
    compass: '<path d="M32 8L18 52M32 8l14 44" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="10" r="4" fill="currentColor"/><path d="M12 44a24 24 0 0040 0" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/>',
    riddles: '<path d="M22 22a10 10 0 1114 9c-3 1.5-4 3.5-4 7" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="32" cy="48" r="3.5" fill="currentColor"/>',
    games: '<g fill="currentColor"><circle cx="16" cy="20" r="5"/><circle cx="28" cy="20" r="5"/><circle cx="40" cy="20" r="5"/><circle cx="22" cy="34" r="5"/><circle cx="34" cy="34" r="5"/><circle cx="28" cy="48" r="5" opacity=".35"/></g>',
    mechanical: '<path d="M8 50h48M16 50V16M32 50V16M48 50V16" stroke="currentColor" stroke-width="3"/><rect x="8" y="42" width="16" height="7" rx="2" fill="currentColor"/><rect x="10" y="35" width="12" height="7" rx="2" fill="currentColor" opacity=".7"/><rect x="12" y="28" width="8" height="7" rx="2" fill="currentColor" opacity=".45"/>'
  };
  // the Sphinx, lying on her plinth, who asks the questions here
  C.sphinxArt = function (cls) {
    return '<svg class="sphinx' + (cls ? ' ' + cls : '') + '" viewBox="0 0 120 84" aria-hidden="true">' +
      '<defs><linearGradient id="sphx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe29a"/><stop offset="1" stop-color="#d9a441"/></linearGradient></defs>' +
      '<path d="M3 74h114v7H3z" fill="#8a6a2e" opacity=".55"/>' +
      '<path d="M12 72c-7-1-9-8-5-12 2-2 5-1 5 1M14 72c-2-10 3-17 13-19l33-2c3-6 7-10 11-12v-8c0-9 6-15 14-15s12 6 12 13l2 6-3 2 1 4-2 1c0 3-3 5-6 6v4c4 2 6 6 6 10h16c5 0 6 8 0 8z" fill="url(#sphx)" stroke="#8a6a2e" stroke-width="1.6" stroke-linejoin="round"/>' +
      '<path d="M72 31l-7 20h14l5-17z" fill="#f0c86a" stroke="#8a6a2e" stroke-width="1.4" stroke-linejoin="round"/>' +
      '<path d="M73 36l-3 9M77 35l-3 11" stroke="#b58a35" stroke-width="1.2"/>' +
      '<path d="M74 22c3-6 9-8 15-6" fill="none" stroke="#8a6a2e" stroke-width="1.4"/>' +
      '<circle cx="92" cy="26" r="1.6" fill="#3a2a0e"/>' +
      '<path d="M30 60c8 2 18 2 26 0M96 66h16" stroke="#b58a35" stroke-width="1.3" fill="none"/>' +
      '</svg>';
  };

  C.catArt = (id) => '<svg viewBox="0 0 64 64" class="catart" aria-hidden="true">' + (ART[id] || ART.riddles) + '</svg>';

  /* ---------- pages ---------- */

  function pageHead(title, sub, back, extra) {
    return h('header.lib-head',
      back ? h('a.pz-back', { href: back, title: 'Back', html: C.icon('prev') }) : null,
      h('div.lib-titles', h('h1', title), sub ? h('p', { html: sub }) : null),
      extra || null
    );
  }

  C.renderHome = function (host) {
    host.innerHTML = '';
    const all = rows;
    const st = stats(all);
    const last = C.store.get('last', null);
    const lastRow = last && C.row(last);
    const daily = dailyRow();
    const search = h('input.search', { type: 'search', placeholder: 'Search ' + all.length.toLocaleString() + ' puzzles: “matches”, “Dudeney”, “river”, “knot”…', 'aria-label': 'Search puzzles' });
    search.addEventListener('keydown', (e) => { if (e.key === 'Enter' && search.value.trim()) root.location.hash = '#/q/' + encodeURIComponent(search.value.trim()); });
    const page = h('div.lib',
      h('section.hero',
        h('div.hero-art', { html: C.sphinxArt() }),
        h('div.hero-text',
          h('h1', 'The Puzzle Cabinet'),
          h('p.hero-sub', all.length.toLocaleString() + ' puzzles from three thousand years of human curiosity, to move, turn, cut, fold, knot and solve on the screen.'),
          h('p.quip', C.settings.quips ? C.quip('welcome') : '')
        ),
        h('div.hero-stats',
          h('div.hs', h('b', st.done.toLocaleString()), h('small', 'solved')),
          h('div.hs', h('b', st.stars.toLocaleString()), h('small', 'stars')),
          h('div.hs', h('b', Math.round(100 * st.done / Math.max(1, st.total)) + '%'), h('small', 'of the cabinet'))
        )
      ),
      h('div.hero-bar', search,
        lastRow ? h('a.btn.primary', { href: '#/p/' + lastRow.id, html: C.icon('next') + '<span>Continue: ' + C.esc(lastRow.title) + '</span>' }) : null,
        daily ? h('a.btn.gold', { href: '#/p/' + daily.id, html: C.icon('star') + '<span>Puzzle of the day</span>', title: daily.title }) : null,
        h('button.btn', { type: 'button', onclick: surprise, html: C.icon('shuffle') + '<span>Surprise me</span>' })
      ),
      h('h2.lib-h', 'The shelves'),
      shelfGrid(),
      endlessStrip(),
      h('h2.lib-h', 'Through the ages'),
      eraStrip(),
      conceptCloud(),
      h('h2.lib-h', 'Next door'),
      h('div.fams',
        h('a.famcard', { href: '../GALAXIES/index.html', style: { '--hue': 214 } }, h('h3', 'Galaxies'), h('p', 'Nikoli\'s Tentai Show: divide the grid into symmetric galaxies. Made on the spot, one solution each.')),
        h('a.famcard', { href: '../sokoban/sokoban.html', style: { '--hue': 176 } }, h('h3', 'Sokoban'), h('p', 'Push every crate onto a pad — a library of one and a half million levels.')),
        h('a.famcard', { href: '../SLIDING-BLOCKS/index.html', style: { '--hue': 38 } }, h('h3', 'Sliding Blocks'), h('p', 'Klotski, Rush-Hour-style Gridlock, Release and Order puzzles, every par the proven fewest moves.'))
      ),
      h('footer.lib-foot',
        h('a', { href: '#/history' }, 'A short history of puzzles'), ' · ',
        h('a', { href: '#/about' }, 'About the cabinet'), ' · ',
        h('a', { href: '#/settings' }, 'Settings'), ' · ',
        h('a', { href: '../index.html' }, 'All apps')
      )
    );
    host.appendChild(page);
  };

  function shelfGrid() {
    const grid = h('div.shelves');
    C.categories.forEach((cat) => {
      const list = rows.filter((r) => r.cat === cat.id);
      if (!list.length) return;
      const st = stats(list);
      const fams = C.familiesOf(cat.id);
      grid.appendChild(h('a.shelf', { href: '#/s/' + cat.id, style: { '--hue': cat.hue } },
        h('div.shelf-art', { html: C.catArt(cat.id) }),
        h('div.shelf-body',
          h('h3', cat.name),
          h('p', cat.blurb),
          h('div.shelf-fams', fams.slice(0, 5).map((f) => f.name).join(' · ') + (fams.length > 5 ? ' …' : '')),
          h('div.shelf-foot', h('span', list.length.toLocaleString() + ' puzzles'), h('span', st.done ? st.done + ' solved' : '')),
          meter(st)
        )
      ));
    });
    return grid;
  }

  function endlessStrip() {
    const fams = (C.catalogData && C.catalogData.families) || {};
    const ids = Object.keys(fams).filter((k) => fams[k].endless);
    if (!ids.length) return null;
    const box = h('div.chips.cloud');
    ids.forEach((k) => {
      const cat = C.catById[fams[k].cat] || {};
      box.appendChild(h('a.chip.endless-chip', { href: C.endlessHref(k, 2, C.newSeed()), style: { '--hue': cat.hue }, title: 'A new ' + fams[k].name + ' puzzle, made now' }, fams[k].name));
    });
    return h('div', h('h2.lib-h', { html: C.icon('shuffle') + ' Endless drawers <small class="muted">— a new puzzle every time you open one</small>' }), box);
  }

  function yearOf(r) {
    if (r.year != null) return r.year;
    const f = C.famInfo(r.family);
    return f && f.origin && f.origin.year != null ? f.origin.year : null;
  }
  C.yearOf = yearOf;

  function eraStrip() {
    const strip = h('div.eras');
    C.eras.forEach((e) => {
      const n = rows.filter((r) => { const y = yearOf(r); return y != null && y >= e.from && y < e.to; }).length;
      if (!n) return;
      strip.appendChild(h('a.era', { href: '#/e/' + e.id },
        h('b', e.name), h('small', e.from < -3000 ? 'before 500 BC' : (C.fmtYear(e.from) + (e.to < 9000 ? ' – ' + C.fmtYear(e.to) : ' on'))), h('span', n.toLocaleString() + ' puzzles')));
    });
    return strip;
  }

  function conceptCloud() {
    if (!C.conceptList.length) return null;
    const counts = {};
    rows.forEach((r) => r.concepts.forEach((c) => { counts[c] = (counts[c] || 0) + 1; }));
    const fams = (C.catalogData && C.catalogData.families) || {};
    for (const k in fams) (fams[k].concepts || []).forEach((c) => { counts[c] = (counts[c] || 0) + (fams[k].count || 0); });
    const box = h('div.chips.cloud');
    C.conceptList.slice().sort((a, b) => a.name.localeCompare(b.name)).forEach((c) => {
      if (!counts[c.id]) return;
      box.appendChild(h('a.chip.concept', { href: '#/c/' + c.id }, c.name, h('small', ' ' + counts[c.id])));
    });
    return h('div', h('h2.lib-h', 'Ideas that open many locks'), box);
  }

  function dailyRow() {
    if (!rows.length) return null;
    const d = new Date();
    const r = C.rng(d.getFullYear() * 1000 + d.getMonth() * 40 + d.getDate());
    const pool = rows.filter((x) => x.diff >= 2 && x.diff <= 4);
    return (pool.length ? pool : rows)[Math.floor(r() * (pool.length || rows.length))];
  }
  function surprise() {
    const pool = rows.filter((r) => !C.progress.solved(r.id));
    const list = pool.length ? pool : rows;
    root.location.hash = '#/p/' + list[Math.floor(Math.random() * list.length)].id;
  }
  C.surprise = surprise;

  C.renderShelf = function (host, catId) {
    const cat = C.catById[catId];
    if (!cat) { host.innerHTML = ''; host.appendChild(C.notFound('No such shelf.')); return; }
    host.innerHTML = '';
    const fams = C.familiesOf(catId);
    const list = rows.filter((r) => r.cat === catId);
    const st = stats(list);
    const grid = h('div.fams');
    fams.forEach((f) => {
      const fr = C.familyRows(f.id);
      const fs = stats(fr);
      grid.appendChild(h('a.famcard', { href: '#/f/' + f.id },
        h('h3', f.name),
        h('p', f.blurb || ''),
        f.origin && (f.origin.who || f.origin.year != null) ? h('div.fam-origin', { html: C.icon('history') + '<span>' + C.esc([f.origin.who, f.origin.year != null ? C.fmtYear(f.origin.year) : ''].filter(Boolean).join(', ')) + '</span>' }) : null,
        h('div.shelf-foot', h('span', fr.length + ' puzzles'), h('span', fs.done ? fs.done + ' solved · ' + fs.stars + '★' : '')),
        meter(fs)
      ));
    });
    host.appendChild(h('div.lib', { style: { '--hue': cat.hue } },
      pageHead(cat.name, C.esc(cat.blurb) + ' <span class="muted">' + list.length + ' puzzles · ' + st.done + ' solved</span>', '#/', h('div.lib-art', { html: C.catArt(cat.id) })),
      grid
    ));
  };

  // endless: five buttons, one per level, with what you have solved so far
  function endlessPanel(fid) {
    const stats = C.endlessStats(fid);
    const btns = h('div.endless-levels');
    for (let lv = 1; lv <= 5; lv++) {
      const s = stats[lv];
      btns.appendChild(h('a.endless-lv', { href: C.endlessHref(fid, lv, C.newSeed()), title: 'A new ' + C.diffs[lv].name.toLowerCase() + ' puzzle' },
        h('b', C.diffs[lv].name),
        C.diffBadge(lv),
        h('small', s ? s.n + ' solved' + (s.best ? ' · best ' + C.fmtTime(s.best) : '') : 'none yet')));
    }
    return h('div.endless',
      h('div.endless-head', h('span', { html: C.icon('shuffle') }), h('div', h('b', 'Endless'), h('small', 'A brand-new puzzle every time, made on the spot and checked by the solver before you see it.'))),
      btns);
  }

  let thumbGen = 0;
  C.renderFamily = async function (host, fid) {
    const f = C.famInfo(fid);
    if (!f) { host.innerHTML = ''; host.appendChild(C.notFound('No such drawer.')); return; }
    const cat = C.catById[f.cat] || C.categories[0];
    const list = C.familyRows(fid);
    host.innerHTML = '';
    const state = { filter: C.store.get('ff:' + fid, 'all') };
    const tiles = h('div.tiles');
    const chips = h('div.chips');
    const head = pageHead(f.name, C.esc(f.blurb || '') + (f.origin && f.origin.note ? '<br><span class="muted">' + C.md(f.origin.note) + '</span>' : ''), '#/s/' + f.cat);
    const st = stats(list);
    const next = list.find((r) => !C.progress.solved(r.id));
    const bar = h('div.fam-bar',
      next ? h('a.btn.primary', { href: '#/p/' + next.id, html: C.icon('next') + '<span>' + (st.done ? 'Next unsolved' : 'Start') + ': ' + C.esc(next.title) + '</span>' }) : h('span.muted', 'Every puzzle here is solved. Bravo.'),
      h('span.muted', list.length + ' puzzles · ' + st.done + ' solved · ' + st.stars + ' ★')
    );
    const page = h('div.lib', { style: { '--hue': cat.hue } }, head, bar, meter(st), f.endless ? endlessPanel(fid) : null, chips, tiles);
    // drawers that share an idea with this one
    const mine = f.concepts || [];
    const fams = (C.catalogData && C.catalogData.families) || {};
    const kin = Object.keys(fams).filter((k) => k !== fid && (fams[k].concepts || []).some((c) => mine.includes(c)))
      .sort((a, b) => (fams[b].concepts || []).filter((c) => mine.includes(c)).length - (fams[a].concepts || []).filter((c) => mine.includes(c)).length)
      .slice(0, 6);
    if (kin.length || mine.length) {
      page.appendChild(h('h2.lib-h', 'Related drawers and ideas'));
      if (mine.length) page.appendChild(h('div.chips', mine.filter((c) => C.conceptById[c]).map((c) => h('a.chip.concept', { href: '#/c/' + c }, C.conceptById[c].name))));
      if (kin.length) {
        const g = h('div.fams');
        kin.forEach((k) => {
          const kf = fams[k], kc = C.catById[kf.cat] || {};
          g.appendChild(h('a.famcard', { href: '#/f/' + k, style: { '--hue': kc.hue } }, h('h3', kf.name), h('p', kf.blurb || ''), h('div.shelf-foot', h('span', kc.name), h('span', kf.count + ' puzzles'))));
        });
        page.appendChild(g);
      }
    }
    host.appendChild(page);
    const filters = [['all', 'All'], ['todo', 'Unsolved'], ['1', 'Easy'], ['2', 'Fair'], ['3', 'Tricky'], ['4', 'Hard'], ['5', 'Fiendish']];
    const draw = () => {
      chips.innerHTML = '';
      filters.forEach(([k, label]) => {
        const n = k === 'all' ? list.length : k === 'todo' ? list.filter((r) => !C.progress.solved(r.id)).length : list.filter((r) => String(r.diff) === k).length;
        if (!n && k !== 'all') return;
        chips.appendChild(h('button.chip' + (state.filter === k ? '.active' : ''), { type: 'button', onclick: () => { state.filter = k; C.store.set('ff:' + fid, k); draw(); } }, label, h('small', ' ' + n)));
      });
      tiles.innerHTML = '';
      const shown = list.filter((r) => state.filter === 'all' || (state.filter === 'todo' ? !C.progress.solved(r.id) : String(r.diff) === state.filter));
      shown.forEach((r) => tiles.appendChild(tile(r, list.indexOf(r) + 1)));
      if (!shown.length) tiles.appendChild(h('p.muted', 'Nothing here with this filter.'));
      thumbs();
    };
    // pictures come from the engine, so load the drawer then draw them as they scroll in
    let loaded = null;
    const thumbs = () => {
      if (!loaded) return;
      const eng = C.engines[f.engine];
      if (!eng || !eng.thumb) return;
      // a few at a time, so a long drawer stays responsive
      const els = Array.from(tiles.querySelectorAll('.tile-pic'));
      const gen = ++thumbGen;
      let i = 0;
      const step = () => {
        if (gen !== thumbGen) return;
        const t0 = performance.now();
        while (i < els.length && performance.now() - t0 < 12) {
          const el = els[i++];
          const p = C.byId[el.dataset.id];
          try { const svg = p && eng.thumb(p); if (svg) el.innerHTML = svg + '<span class="tile-n">' + el.querySelector('.tile-n').textContent + '</span>'; } catch (e) { /* no picture */ }
        }
        if (i < els.length) setTimeout(step, 0);
      };
      step();
    };
    draw();
    C.loadFamily(fid).then(() => { loaded = true; thumbs(); }).catch(() => {});
  };

  function tile(r, n) {
    const rec = C.progress.get(r.id);
    return h('a.tile' + (rec && !rec.seen ? '.done' : '') + (rec && rec.seen ? '.seen' : ''), { href: '#/p/' + r.id, title: r.title },
      h('div.tile-pic', { dataset: { id: r.id } }, h('span.tile-n', String(n))),
      h('div.tile-t', r.title),
      h('div.tile-f', C.diffBadge(r.diff), rec && !rec.seen ? C.starRow(rec.s) : (rec && rec.seen ? h('small.seen', 'seen') : h('span')))
    );
  }

  C.renderEra = function (host, eid) {
    const e = C.eras.find((x) => x.id === eid);
    if (!e) { host.innerHTML = ''; host.appendChild(C.notFound('No such era.')); return; }
    host.innerHTML = '';
    const list = rows.filter((r) => { const y = yearOf(r); return y != null && y >= e.from && y < e.to; });
    const own = list.filter((r) => r.year != null).sort((a, b) => a.year - b.year);
    const fams = {};
    list.filter((r) => r.year == null).forEach((r) => { fams[r.family] = (fams[r.family] || 0) + 1; });
    const events = C.historyList.filter((ev) => ev.year >= e.from && ev.year < e.to).sort((a, b) => a.year - b.year);
    const page = h('div.lib', pageHead(e.name, C.esc(e.blurb), '#/'));
    if (events.length) {
      const tl = h('div.timeline');
      events.forEach((ev) => tl.appendChild(histItem(ev)));
      page.appendChild(tl);
    }
    if (own.length) {
      page.appendChild(h('h2.lib-h', 'Puzzles first set in this age'));
      const box = h('div.pz-links.wide');
      own.forEach((r) => { const a = C.puzzleLink(r); a.insertBefore(h('span.yr', C.fmtYear(r.year)), a.firstChild); box.appendChild(a); });
      page.appendChild(box);
    }
    const fk = Object.keys(fams);
    if (fk.length) {
      page.appendChild(h('h2.lib-h', 'Kinds of puzzle born in this age'));
      const g = h('div.fams');
      fk.forEach((fid) => { const f = C.famInfo(fid); g.appendChild(h('a.famcard', { href: '#/f/' + fid }, h('h3', f.name), h('p', f.blurb || ''), f.origin ? h('div.fam-origin', { html: C.icon('history') + '<span>' + C.esc([f.origin.who, C.fmtYear(f.origin.year)].filter(Boolean).join(', ')) + '</span>' }) : null, h('div.shelf-foot', h('span', fams[fid] + ' puzzles')))); });
      page.appendChild(g);
    }
    host.appendChild(page);
  };

  function histItem(ev) {
    return h('div.tl-item',
      h('div.tl-year', C.fmtYear(ev.year)),
      h('div.tl-body',
        h('h4', ev.title),
        h('div', { html: C.md(ev.text || '') }),
        ev.links && ev.links.length ? h('div.chips', ev.links.filter((id) => C.row(id) || C.famInfo(id)).map((id) => C.row(id) ? h('a.chip', { href: '#/p/' + id }, C.row(id).title) : h('a.chip', { href: '#/f/' + id }, C.famInfo(id).name))) : null
      )
    );
  }

  C.renderHistory = function (host) {
    host.innerHTML = '';
    const page = h('div.lib', pageHead('A short history of puzzles', 'From clay tablets to computer-made variants: where the puzzles in this cabinet come from.', '#/'));
    C.eras.forEach((e) => {
      const events = C.historyList.filter((ev) => ev.year >= e.from && ev.year < e.to).sort((a, b) => a.year - b.year);
      if (!events.length) return;
      page.appendChild(h('h2.lib-h', h('a', { href: '#/e/' + e.id }, e.name)));
      const tl = h('div.timeline');
      events.forEach((ev) => tl.appendChild(histItem(ev)));
      page.appendChild(tl);
    });
    if (!C.historyList.length) page.appendChild(h('p.muted', 'The timeline is still being written.'));
    host.appendChild(page);
  };

  C.renderConcept = function (host, cid) {
    const c = C.conceptById[cid];
    if (!c) { host.innerHTML = ''; host.appendChild(C.notFound('No such idea.')); return; }
    host.innerHTML = '';
    const list = rows.filter((r) => r.concepts.includes(cid));
    const fams = Object.keys((C.catalogData && C.catalogData.families) || {}).filter((k) => (C.famInfo(k).concepts || []).includes(cid));
    const page = h('div.lib', pageHead(c.name, '', '#/'), h('div.concept-text', { html: C.md(c.text || '') }));
    if (fams.length) {
      page.appendChild(h('h2.lib-h', 'Whole drawers built on it'));
      const g = h('div.fams');
      fams.forEach((fid) => { const f = C.famInfo(fid); g.appendChild(h('a.famcard', { href: '#/f/' + fid }, h('h3', f.name), h('p', f.blurb || ''), h('div.shelf-foot', h('span', f.count + ' puzzles')))); });
      page.appendChild(g);
    }
    if (list.length) {
      page.appendChild(h('h2.lib-h', 'Puzzles that use it'));
      const box = h('div.pz-links.wide');
      list.slice(0, 300).forEach((r) => box.appendChild(C.puzzleLink(r)));
      page.appendChild(box);
    }
    if (c.see && c.see.length) {
      page.appendChild(h('div.chips', c.see.filter((x) => C.conceptById[x]).map((x) => h('a.chip.concept', { href: '#/c/' + x }, C.conceptById[x].name))));
    }
    host.appendChild(page);
  };

  C.renderSearch = function (host, q) {
    host.innerHTML = '';
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const fams = (C.catalogData && C.catalogData.families) || {};
    const hay = (r) => {
      const f = fams[r.family] || {};
      return (r.title + ' ' + r.tags.join(' ') + ' ' + (f.name || '') + ' ' + (f.origin && f.origin.who || '') + ' ' + (C.catById[r.cat] || {}).name + ' ' + (r.year != null ? C.fmtYear(r.year) : '')).toLowerCase();
    };
    const found = rows.filter((r) => { const s = hay(r); return words.every((w) => s.includes(w)); });
    const input = h('input.search', { type: 'search', value: q, 'aria-label': 'Search' });
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') root.location.hash = '#/q/' + encodeURIComponent(input.value.trim()); });
    const page = h('div.lib', pageHead('Search', found.length + ' puzzles match “' + C.esc(q) + '”', '#/'), h('div.hero-bar', input));
    const box = h('div.pz-links.wide');
    found.slice(0, 400).forEach((r) => box.appendChild(C.puzzleLink(r)));
    if (found.length > 400) box.appendChild(h('p.muted', 'and ' + (found.length - 400) + ' more — add a word to narrow it down.'));
    page.appendChild(box);
    host.appendChild(page);
    setTimeout(() => input.focus(), 30);
  };

  C.renderAbout = function (host) {
    host.innerHTML = '';
    const fams = (C.catalogData && C.catalogData.families) || {};
    const srcs = {};
    Object.keys(fams).forEach((k) => { const o = fams[k].origin; if (o && o.who) srcs[o.who] = (srcs[o.who] || 0) + 1; });
    host.appendChild(h('div.lib', pageHead('About the cabinet', '', '#/'),
      h('div.concept-text', { html: C.md([
        'The Puzzle Cabinet gathers puzzles of every kind people have played with for three thousand years — sticks and matches, coins, cards, glasses of water, rope, paper, compass and ruler, scales and weights — and makes each one something you can pick up and play with on the screen.',
        'Every puzzle comes with the tools a real table would give you: move, turn and turn over the pieces, colour them to keep track, group them, make them see-through, stack them, cut them with a knife, fold the paper, knot the rope, look at it in 3D, zoom in with a magnifying glass, and keep notes and sums in the notebook beside it.',
        '**Where the puzzles come from.** The classics are retold in our own words from their oldest sources we know — the Rhind papyrus, the Greek Anthology, Alcuin of York, Fibonacci, Bachet, Euler, Lucas, Lewis Carroll, Sam Loyd and Henry Dudeney among them — and credited on each puzzle. Many drawers also hold new variants made by computer: every one of those was checked by a solver before it went in, so each has an answer (and where it matters, exactly one).',
        '**A word about Martin Gardner**, whose Mathematical Games column in *Scientific American* (1956–1981) taught a generation to love puzzles. Many of the puzzles here are ones he wrote about; where that is so, the puzzle says so, and his books are the best place to go next.',
        '**Stars.** Solve a puzzle without hints for three stars, with one or two hints for two, with more for one. Looking at the solution marks a puzzle as seen; you can come back and solve it properly later.'
      ].join('\n\n')) }),
      Object.keys(srcs).length ? h('div', h('h2.lib-h', 'Puzzle-makers in the cabinet'), h('div.chips', Object.keys(srcs).sort().map((w) => h('a.chip', { href: '#/q/' + encodeURIComponent(w) }, w)))) : null
    ));
  };

  C.renderSettings = function (host) {
    host.innerHTML = '';
    const s = C.settings;
    const row = (key, label, desc) => {
      const inp = h('input', { type: 'checkbox' });
      inp.checked = !!s[key];
      inp.addEventListener('change', () => { s[key] = inp.checked; C.saveSettings(); if (key === 'theme') C.applyTheme(); });
      return h('label.setrow', inp, h('span', h('b', label), h('small', desc)));
    };
    const theme = h('select.sel', { onchange: (e) => { s.theme = e.target.value; C.saveSettings(); C.applyTheme(); } },
      h('option', { value: 'dark' }, 'Night (dark)'), h('option', { value: 'light' }, 'Day (light)'), h('option', { value: 'auto' }, 'Follow the system'));
    theme.value = s.theme || 'dark';
    const st = stats(rows);
    host.appendChild(h('div.lib', pageHead('Settings', '', '#/'),
      h('div.settings',
        h('label.setrow', h('span', h('b', 'Colours'), h('small', 'Night or day')), theme),
        row('sound', 'Sounds', 'Small clicks and chimes'),
        row('quips', 'The Sphinx\'s remarks', 'A little humour when you solve, miss or ask for a hint'),
        row('timer', 'Show the clock', 'Time is always kept for your records'),
        row('autocheck', 'Notice a solution at once', 'Otherwise press Check'),
        h('div.setrow.col',
          h('span', h('b', 'Play offline'), h('small', 'Every drawer you open is kept for offline play. This keeps all of them at once (a few megabytes).')),
          h('div.row', offlineBtn())
        ),
        h('div.setrow.col',
          h('span', h('b', 'Your progress'), h('small', st.done + ' puzzles solved, ' + st.stars + ' stars. Kept in this browser only.')),
          h('div.row',
            h('button.btn', { type: 'button', onclick: exportProgress }, 'Save to a file'),
            h('label.btn', 'Load from a file', h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: importProgress })),
            h('button.btn.danger', { type: 'button', onclick: () => { C.confirmCard(null, { title: 'Start afresh?', text: 'This forgets every solved puzzle, every star and every saved game in this browser.', ok: 'Forget it all', cancel: 'Keep them' }).then((yes) => { if (!yes) return; C.progress.reset(); C.store.keys().filter((k) => k.startsWith('st:') || k === 'xstat' || k === 'stidx').forEach((k) => C.store.del(k)); C.renderSettings(host); }); } }, 'Start afresh')
          )
        )
      )
    ));
  };

  // fetch every engine and puzzle file once, so the service worker keeps them
  function offlineBtn() {
    const b = h('button.btn', { type: 'button' }, 'Keep every puzzle for offline play');
    b.addEventListener('click', async () => {
      const fams = (C.catalogData && C.catalogData.families) || {};
      const files = new Set();
      Object.keys(fams).forEach((k) => {
        const f = fams[k];
        (f.deps || []).forEach((d) => files.add(d));
        files.add('engines/' + f.engine + '.js');
        (f.files || []).forEach((d) => files.add(d));
      });
      const list = Array.from(files);
      b.disabled = true;
      let n = 0;
      for (const f of list) {
        try { await fetch(f, { cache: 'reload' }); } catch (e) { /* offline already */ }
        n++;
        b.textContent = 'Keeping… ' + n + ' of ' + list.length;
      }
      b.textContent = root.navigator.serviceWorker && root.navigator.serviceWorker.controller ? 'Done: all ' + list.length + ' files are kept' : 'Fetched ' + list.length + ' files (offline play needs the page served over http)';
    });
    return b;
  }

  function exportProgress() {
    const data = { app: 'puzzle-cabinet', when: new Date().toISOString(), done: C.progress.all(), saves: {} };
    C.store.keys().filter((k) => k.startsWith('st:')).forEach((k) => { data.saves[k] = C.store.get(k); });
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'puzzle-cabinet-progress.json' });
    root.document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function importProgress(e) {
    const f = e.target.files[0];
    if (!f) return;
    f.text().then((t) => {
      const d = JSON.parse(t);
      if (d.app !== 'puzzle-cabinet') throw new Error('not a Puzzle Cabinet file');
      Object.keys(d.done || {}).forEach((id) => C.progress.record(id, d.done[id]));
      Object.keys(d.saves || {}).forEach((k) => C.store.set(k, d.saves[k]));
      root.alert('Progress loaded.');
      root.location.reload();
    }).catch((err) => root.alert('Could not read that file: ' + err.message));
  }
})(typeof window !== 'undefined' ? window : globalThis);
