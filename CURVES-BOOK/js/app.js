/* Curves Workshop · js/app.js
 *
 * The page: loads the catalog, the figure files and the section files, then routes
 *   #/                 home
 *   #/s/<section>      a section of the book
 *   #/f/<fig-id>       a figure, with its construction played step by step
 *   #/p/<fig-id>       the practice board for that figure (js/board.js)
 *   #/gallery          every figure
 *   #/tools            the classical tools and how to use them
 *   #/search/<text>    search
 */
(function () {
  'use strict';
  const C = window.Curves, H = window.Hyper;
  const $ = (s, el) => (el || document).querySelector(s);
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const main = $('#main');
  (function () { const st = document.createElement('style'); st.textContent = C.STYLE; document.head.appendChild(st); })();
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cw:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('cw:' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  C.store = store;

  /* ---- links inside markdown: [[section]] and [[fig-012]] */
  H.href = ref => /^fig-/.test(ref) ? '#/f/' + ref : '#/s/' + ref;
  H.exists = ref => /^fig-/.test(ref) ? C.figures.has(ref) : C.sections.has(ref) || !!C.manifest.sections.find(s => s.id === ref);
  H.titleOf = ref => {
    if (/^fig-/.test(ref)) { const f = C.figures.get(ref); return f ? f.caption : ref; }
    const m = C.manifest.sections.find(s => s.id === ref); return m ? m.title : ref;
  };
  const md = s => H.text(String(s || ''));
  const inline = s => H.inline(String(s || ''));
  const tex = (s, display) => H.texSafe(String(s || ''), !!display);

  /* ---- tool icons (inline SVG, 24×24) */
  const ICON = {
    given: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4v16"/></svg>',
    straightedge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 17 17 3l4 4L7 21z"/><path d="m8 12 2 2m1-5 2 2m1-5 2 2"/></svg>',
    compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v3M9.5 6h5M12 6 6 21M12 6l6 15"/><circle cx="12" cy="4" r="1.2"/><path d="M8.5 15.5c2 1.4 5 1.4 7 0"/></svg>',
    dividers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v3M12 6 6 21M12 6l6 15"/><circle cx="12" cy="4" r="1.2"/><path d="M5 21h2m10 0h2"/></svg>',
    ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="9" width="20" height="6" rx="1"/><path d="M6 9v3M10 9v2M14 9v3M18 9v2"/></svg>',
    square: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20V4l16 16z"/><path d="M8 16v-6l6 6z"/></svg>',
    protractor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 16a9 9 0 0 1 18 0z"/><path d="M12 16V9M7 16l1-3m9 3-1-3"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m4 20 1-4L16 5l3 3L8 19z"/><path d="m14 7 3 3"/></svg>',
    roll: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="12" r="5"/><path d="M3 19h18M9 7v5l3 2"/></svg>',
    fold: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6" stroke-dasharray="2 2"/></svg>',
    linkage: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="5" cy="18" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="19" cy="15" r="2"/><path d="M6.5 16.5 10.5 9M13.8 8.2l4 5.5"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 10v6M12 7v.5"/></svg>'
  };
  const icon = t => '<span class="toolicon" title="' + esc(C.TOOLS[t] ? C.TOOLS[t].name : t) + '">' + (ICON[t] || ICON.note) + '</span>';
  C.ICON = ICON; C.icon = icon;

  /* ---- loading: the catalog names the figure and section files */
  function loadScript(src) {
    return new Promise((ok, bad) => { const s = document.createElement('script'); s.src = src; s.async = false; s.onload = ok; s.onerror = () => bad(new Error(src)); document.head.appendChild(s); });
  }
  async function boot() {
    const cat = C.catalog;
    const failed = [];
    const all = cat.files.figures.map(f => 'figures/' + f).concat(cat.files.sections.map(f => 'data/sections/' + f));
    await Promise.all(all.map(src => loadScript(src).catch(e => failed.push(src))));
    if (failed.length) console.warn('could not load', failed);
    C.loaded = true;
    route();
  }

  /* ---- scenes, cached */
  const scenes = new Map();
  function scene(id) {
    if (!scenes.has(id)) { const f = C.figures.get(id); scenes.set(id, f ? safe(() => C.build(f)) : null); }
    return scenes.get(id);
  }
  function safe(fn) { try { return fn(); } catch (e) { console.error(e); return { error: e.message }; } }
  function svgOf(id, opts) {
    const sc = scene(id);
    if (!sc) return '<div class="missing">Not drawn yet: ' + esc(id) + '</div>';
    if (sc.error) return '<div class="missing">' + esc(id) + ' does not build: ' + esc(sc.error) + '</div>';
    return C.svg(sc, Object.assign({ noSize: true }, opts || {}));
  }
  C.scene = scene; C.svgOf = svgOf;

  const secOf = id => C.manifest.sections.find(s => s.id === id);
  const figsOfSection = id => C.catalog.figures.filter(f => f.section === id);
  const level = n => '<span class="pill lvl' + (n || 1) + '">level ' + (n || 1) + '</span>';

  /* ---- router */
  function route() {
    const h = location.hash || '#/';
    const parts = h.replace(/^#\/?/, '').split('/');
    const view = parts[0] || '';
    document.querySelectorAll('header.top nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + view || (view === '' && a.getAttribute('href') === '#/')));
    if (C.board && C.board.destroy) { C.board.destroy(); C.board = null; }
    window.scrollTo(0, 0);
    if (view === '') home();
    else if (view === 's') section(parts[1]);
    else if (view === 'f') figure(parts[1], Number(parts[2]));
    else if (view === 'p') practice(parts[1]);
    else if (view === 'gallery') gallery(parts.slice(1).join('/'));
    else if (view === 'tools') tools();
    else if (view === 'search') search(decodeURIComponent(parts.slice(1).join('/')));
    else home();
  }
  window.addEventListener('hashchange', route);

  /* ---- home */
  function home() {
    const cat = C.catalog;
    const groups = C.manifest.groups;
    const practiceCount = cat.figures.filter(f => f.practice).length;
    document.title = 'Curves Workshop';
    const heroId = ['fig-001a', 'fig-009'].find(id => C.figures.has(id)) || (cat.figures[0] && cat.figures[0].id);
    let html = '<div class="hero"><div>' +
      '<h1>Curves Workshop</h1>' +
      '<p class="lead">Every figure of Robert C. Yates’ <i>A Handbook on Curves and Their Properties</i> (1947), redrawn as a construction you can play step by step and then draw yourself — with a straightedge, a compass, dividers and a pencil, on the practice board or on paper.</p>' +
      '<div class="stats"><div><b>' + cat.figures.length + '</b> drawings</div><div><b>' + cat.sections.length + '</b> sections of the book</div><div><b>' + practiceCount + '</b> constructions to practise</div></div>' +
      '<div class="quick"><a class="btn primary" href="#/gallery">All the figures</a><a class="btn" href="#/tools">The tools</a>' + (heroId ? '<a class="btn" href="#/p/' + heroId + '">Try the practice board</a>' : '') + '</div>' +
      '</div>' + (heroId ? '<a class="figure" href="#/f/' + heroId + '" title="Open this figure">' + svgOf(heroId) + '</a>' : '') + '</div>';
    html += '<h2>Start here</h2><div class="cards">' + starters().map(cardOfFig).join('') + '</div>';
    for (const g of ['curves', 'analysis']) {
      html += '<h2>' + esc(groups[g]) + '</h2><div class="cards">' +
        cat.sections.filter(s => s.group === g).map(s => sectionCard(s)).join('') + '</div>';
    }
    html += '<h2>About</h2><div class="prose"><p>The book is an alphabetical reference on plane curves, with their history, equations, metrical properties and the ways to construct them. Here each of its sections is a page, each of its figures is a vector drawing built from the exact geometry, and each construction is a list of steps naming the tool for every stroke. The drawings are also provided as SVG files (<code>svg/</code>) and the whole thing works offline.</p>' +
      '<p>The preface of the book suggests reading the <b>analysis and systems</b> sections (caustics, curvature, envelopes, evolutes …) as a course and the <b>curves</b> as its examples; the two lists above follow that order.</p></div>';
    main.innerHTML = html;
  }
  function starters() {
    const want = ['fig-009', 'fig-062', 'fig-048a', 'fig-123b', 'fig-143b', 'fig-134b', 'fig-186', 'fig-001a'];
    const got = want.filter(id => C.figures.has(id)).map(id => C.catalog.figures.find(f => f.id === id)).filter(Boolean);
    if (got.length < 4) return C.catalog.figures.filter(f => f.practice).slice(0, 8);
    return got;
  }
  function sectionCard(s) {
    const first = s.figures[0];
    return '<a class="card" href="#/s/' + s.id + '"><div class="thumb">' + (first ? svgOf(first) : '<span class="muted">no drawing yet</span>') + '</div>' +
      '<h3>' + esc(s.title) + '</h3><div class="meta">pages ' + s.pages[0] + '–' + s.pages[1] + ' · ' + s.figures.length + ' drawing' + (s.figures.length === 1 ? '' : 's') + (s.constructions ? ' · ' + s.constructions + ' to practise' : '') + '</div>' +
      (s.short ? '<div class="small muted">' + esc(s.short) + '</div>' : '') + '</a>';
  }
  function cardOfFig(f) {
    const sec = secOf(f.section);
    return '<a class="card" href="#/f/' + f.id + '"><div class="thumb">' + svgOf(f.id) + '</div><h3>' + esc(f.caption) + ' · ' + esc(f.title) + '</h3>' +
      '<div class="meta">' + esc(sec ? sec.title : f.section) + ' · page ' + f.page + ' · ' + f.steps + ' steps</div>' +
      '<div>' + f.tools.filter(t => t !== 'given' && t !== 'note').map(t => '<span class="pill tool">' + icon(t) + esc(C.TOOLS[t].name) + '</span>').join('') + '</div></a>';
  }

  /* ---- a section */
  function section(id) {
    const m = secOf(id);
    if (!m) { main.innerHTML = '<p>No such section.</p>'; return; }
    const s = C.sections.get(id);
    const figs = figsOfSection(id);
    document.title = m.title + ' · Curves Workshop';
    let html = '<div class="section-head"><h1>' + esc(m.title) + '</h1><span class="pages">pages ' + m.pages[0] + '–' + m.pages[1] + ' of the book · ' + esc(C.manifest.groups[m.group]) + '</span></div>';
    html += '<div class="two"><div>';
    if (s) {
      html += '<div class="prose"><p class="muted"><b>History.</b> ' + inline(s.history) + '</p>' + md(s.description) + '</div>';
    } else html += '<div class="missing">The text of this section is not written yet; the drawings are below.</div>';
    html += '<h2>Figures</h2><div class="figrow">' + (figs.length ? figs.map(f => '<a class="card" href="#/f/' + f.id + '"><div class="thumb">' + svgOf(f.id) + '</div><h3>' + esc(f.caption) + '</h3><div class="meta">' + esc(f.title) + ' · page ' + f.page + '</div></a>').join('') : '<div class="missing">No drawings yet.</div>') + '</div>';
    if (s) {
      if (s.equations && s.equations.length) html += '<h2>Equations</h2>' + s.equations.map(e => '<div class="eq">' + tex(e.tex, false) + (e.note ? '<span class="note">' + inline(e.note) + '</span>' : '') + '</div>').join('');
      if (s.metrical && s.metrical.length) html += '<h2>Metrical properties</h2>' + s.metrical.map(e => '<div class="eq">' + tex(e.tex, false) + (e.note ? '<span class="note">' + inline(e.note) + '</span>' : '') + '</div>').join('');
      if (s.items && s.items.length) html += '<h2>General items</h2><ul class="items">' + s.items.map(it => '<li>' + (it.label ? '<span class="lab">(' + esc(it.label) + ')</span>' : '') + inline(it.text) + '</li>').join('') + '</ul>';
      if (s.tables && s.tables.length) s.tables.forEach(t => {
        html += '<h3>' + esc(t.title || '') + '</h3><div class="tablewrap"><table class="dtable"><thead><tr>' + (t.head || []).map(h => '<th>' + inline(h) + '</th>').join('') + '</tr></thead><tbody>' +
          (t.rows || []).map(r => '<tr>' + r.map(c => '<td>' + inline(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' + (t.note ? '<p class="small muted">' + inline(t.note) + '</p>' : '');
      });
      if (s.extra) html += '<div class="prose">' + md(s.extra) + '</div>';
      if (s.bibliography && s.bibliography.length) html += '<h2>Bibliography</h2><ul class="bib">' + s.bibliography.map(b => '<li>' + esc(b) + '</li>').join('') + '</ul>';
    }
    html += '</div><aside class="side">';
    if (s && s.constructions && s.constructions.length) {
      html += '<div class="card"><h3>Practise</h3>' + s.constructions.map(c => '<div style="margin:6px 0"><a href="#/p/' + c.fig + '">' + esc(c.title || c.fig) + '</a> ' + level(c.level) + '</div>').join('') + '</div>';
    }
    html += '<div class="card"><h3>Figures</h3><div class="toc">' + figs.map(f => '<a href="#/f/' + f.id + '">' + esc(f.caption) + ' — ' + esc(f.title) + '</a>').join('') + '</div></div>';
    if (s && s.seeAlso && s.seeAlso.length) html += '<div class="card"><h3>See also</h3><div class="toc">' + s.seeAlso.map(r => '<a href="#/s/' + r + '">' + esc(H.titleOf(r)) + '</a>').join('') + '</div></div>';
    const idx = C.manifest.sections.findIndex(x => x.id === id);
    const prev = C.manifest.sections[idx - 1], next = C.manifest.sections[idx + 1];
    html += '<div class="card"><h3>In the book</h3><div class="toc">' + (prev ? '<a href="#/s/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '') + (next ? '<a href="#/s/' + next.id + '">' + esc(next.title) + ' →</a>' : '') + '</div></div>';
    html += '</aside></div>';
    main.innerHTML = html;
  }

  /* ---- a figure with its step player */
  function figure(id, startStep) {
    const f = C.figures.get(id);
    if (!f) { main.innerHTML = '<p>No such figure: ' + esc(id) + '. <a href="#/gallery">Gallery</a></p>'; return; }
    const sc = scene(id);
    const m = secOf(f.section);
    document.title = f.caption + ' · ' + f.title + ' · Curves Workshop';
    const cat = C.catalog.figures, pos = cat.findIndex(x => x.id === id);
    const prev = cat[pos - 1], next = cat[pos + 1];
    const canPractise = sc && !sc.error && C.targets(sc).length > 0;
    let html = '<div class="section-head"><h1>' + esc(f.caption) + ' — ' + esc(f.title) + '</h1><span class="pages"><a href="#/s/' + f.section + '">' + esc(m ? m.title : f.section) + '</a> · page ' + f.page + '</span></div>';
    html += '<div class="figpage"><div>';
    if (!sc || sc.error) { html += '<div class="missing">This figure does not build: ' + esc(sc && sc.error) + '</div></div></div>'; main.innerHTML = html; return; }
    html += '<div class="stage" id="stage">' + C.svg(sc, { noSize: true }) + '<div class="steplabel" id="steplabel"></div></div>';
    html += '<div class="player"><button id="pfirst" title="First step">⏮</button><button id="pprev" title="Previous step">◀</button><button id="pplay" class="primary" title="Play">▶ Play</button><button id="pnext" title="Next step">▶</button><button id="plast" title="All steps">⏭</button>' +
      '<input type="range" id="prange" min="0" max="' + (sc.steps.length - 1) + '" value="0"><span id="pcount" class="small muted"></span></div>';
    html += '<div class="actions">' + (canPractise ? '<a class="btn primary" href="#/p/' + id + '">Practise this construction</a>' : '') +
      '<a class="btn" href="svg/' + id + '.svg" download="' + id + '.svg">Download SVG</a><button id="pprint">Print worksheet</button>' +
      '<button id="pcopy" title="Copy the SVG markup">Copy SVG</button></div>';
    if (f.note) html += '<div class="callout">' + inline(f.note) + '</div>';
    html += '<div class="bookref">Redrawn from Yates, <i>A Handbook on Curves and Their Properties</i>, ' + esc(f.caption) + ', page ' + f.page + '.' + (f.tags && f.tags.length ? ' Tags: ' + f.tags.map(esc).join(', ') + '.' : '') + '</div>';
    html += '</div><aside>';
    html += '<h3 style="margin-top:0">The construction, step by step</h3><ol class="steps" id="steps">' + sc.steps.map(st => '<li data-i="' + st.i + '"><span class="tool ' + st.tool + '">' + icon(st.tool) + esc(C.TOOLS[st.tool].name) + '</span>' + esc(st.text) + '</li>').join('') + '</ol>';
    html += '<div class="prevnext">' + (prev ? '<a class="btn" href="#/f/' + prev.id + '">← ' + esc(prev.caption) + '</a>' : '<span></span>') + (next ? '<a class="btn" href="#/f/' + next.id + '">' + esc(next.caption) + ' →</a>' : '') + '</div>';
    html += '</aside></div>';
    main.innerHTML = html;
    player(sc, isFinite(startStep) ? startStep : sc.steps.length - 1);
    $('#pprint').onclick = () => { showStep(sc, 0, false); setTimeout(() => window.print(), 100); };
    $('#pcopy').onclick = () => { navigator.clipboard && navigator.clipboard.writeText(C.svg(sc, { standalone: true })); $('#pcopy').textContent = 'Copied'; };
  }

  let timer = null;
  function showStep(sc, i, animate) {
    const svg = $('#stage svg'); if (!svg) return;
    i = Math.max(0, Math.min(sc.steps.length - 1, i));
    svg.querySelectorAll('g.step').forEach(g => {
      const k = Number(g.dataset.step);
      g.style.display = k <= i ? '' : 'none';
      g.style.opacity = k === i ? '1' : (k < i ? '0.92' : '0');
    });
    if (animate) animateGroup(svg.querySelector('g.step[data-step="' + i + '"]'));
    document.querySelectorAll('#steps li').forEach(li => { const k = Number(li.dataset.i); li.classList.toggle('on', k === i); li.classList.toggle('done', k < i); });
    const st = sc.steps[i];
    const lab = $('#steplabel'); if (lab) lab.innerHTML = icon(st.tool) + esc(C.TOOLS[st.tool].name) + ' · step ' + (i + 1) + ' of ' + sc.steps.length;
    const r = $('#prange'); if (r) r.value = i;
    const c = $('#pcount'); if (c) c.textContent = (i + 1) + ' / ' + sc.steps.length;
    const on = $('#steps li.on'); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
    sc._cur = i;
  }
  function animateGroup(g) {
    if (!g) return;
    let delay = 0;
    g.querySelectorAll('path, circle, line').forEach(el => {
      if (el.classList.contains('pt') || el.classList.contains('head') || el.classList.contains('fill')) { fade(el, delay); return; }
      let L = 0; try { L = el.getTotalLength ? el.getTotalLength() : 0; } catch (e) { L = 0; }
      if (!L) { fade(el, delay); return; }
      const dur = Math.min(1400, 250 + L * 1.2);
      el.style.strokeDasharray = L + ' ' + L; el.style.strokeDashoffset = L;
      const a = el.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: dur, delay, easing: 'ease-in-out', fill: 'forwards' });
      a.onfinish = () => { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; };
      delay += Math.min(dur * 0.5, 300);
    });
    g.querySelectorAll('text').forEach(el => fade(el, delay));
    return delay;
  }
  function fade(el, delay) { el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay, fill: 'backwards' }); }
  function player(sc, start) {
    const n = sc.steps.length;
    const go = (i, anim) => showStep(sc, i, anim);
    go(start, false);
    $('#pfirst').onclick = () => { stop(); go(0, false); };
    $('#plast').onclick = () => { stop(); go(n - 1, false); };
    $('#pprev').onclick = () => { stop(); go(sc._cur - 1, false); };
    $('#pnext').onclick = () => { stop(); go(sc._cur + 1, true); };
    $('#prange').oninput = e => { stop(); go(Number(e.target.value), false); };
    document.querySelectorAll('#steps li').forEach(li => li.onclick = () => { stop(); go(Number(li.dataset.i), true); });
    const play = $('#pplay');
    function stop() { if (timer) { clearTimeout(timer); timer = null; } play.textContent = '▶ Play'; }
    play.onclick = () => {
      if (timer) { stop(); return; }
      play.textContent = '⏸ Pause';
      let i = sc._cur >= n - 1 ? -1 : sc._cur;
      const tick = () => { i++; if (i >= n) { stop(); return; } go(i, true); timer = setTimeout(tick, 1800 + Math.min(2500, 200 * sc.steps[i].shapes.length)); };
      tick();
    };
    document.onkeydown = e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') { stop(); go(sc._cur + 1, true); }
      else if (e.key === 'ArrowLeft') { stop(); go(sc._cur - 1, false); }
      else if (e.key === ' ') { e.preventDefault(); play.click(); }
    };
  }

  /* ---- practice */
  function practice(id) {
    const f = C.figures.get(id);
    const sc = scene(id);
    if (!f || !sc || sc.error) { main.innerHTML = '<p>No such figure. <a href="#/gallery">Gallery</a></p>'; return; }
    document.title = 'Practise ' + f.caption + ' · Curves Workshop';
    const m = secOf(f.section);
    main.innerHTML = '<div class="section-head"><h1>Practise: ' + esc(f.caption) + ' — ' + esc(f.title) + '</h1><span class="pages"><a href="#/s/' + f.section + '">' + esc(m ? m.title : f.section) + '</a> · <a href="#/f/' + id + '">the worked figure</a></span></div><div id="board"></div>';
    C.board = C.Board.open($('#board'), sc);
  }

  /* ---- gallery */
  function gallery(q) {
    const cat = C.catalog;
    const params = new URLSearchParams(q || '');
    const sec = params.get('s') || '', tool = params.get('t') || '', only = params.get('p') === '1';
    document.title = 'Gallery · Curves Workshop';
    let list = cat.figures.filter(f => (!sec || f.section === sec) && (!tool || f.tools.includes(tool)) && (!only || f.practice));
    let html = '<h1>All the figures</h1><div class="filters">' +
      '<select id="gsec"><option value="">every section</option>' + C.manifest.sections.map(s => '<option value="' + s.id + '"' + (s.id === sec ? ' selected' : '') + '>' + esc(s.title) + '</option>').join('') + '</select>' +
      '<select id="gtool"><option value="">any tool</option>' + Object.keys(C.TOOLS).map(t => '<option value="' + t + '"' + (t === tool ? ' selected' : '') + '>' + esc(C.TOOLS[t].name) + '</option>').join('') + '</select>' +
      '<label><input type="checkbox" id="gonly"' + (only ? ' checked' : '') + '> constructions to practise only</label>' +
      '<span class="muted small">' + list.length + ' of ' + cat.figures.length + '</span></div>';
    html += '<div class="gallery">' + list.map(f => '<a class="card" href="#/f/' + f.id + '"><div class="thumb">' + svgOf(f.id) + '</div><h3>' + esc(f.caption) + '</h3><div class="meta small">' + esc(f.title) + '</div></a>').join('') + '</div>';
    main.innerHTML = html;
    const upd = () => { const p = new URLSearchParams(); if ($('#gsec').value) p.set('s', $('#gsec').value); if ($('#gtool').value) p.set('t', $('#gtool').value); if ($('#gonly').checked) p.set('p', '1'); location.hash = '#/gallery/' + p.toString(); };
    $('#gsec').onchange = upd; $('#gtool').onchange = upd; $('#gonly').onchange = upd;
  }

  /* ---- the tools */
  function tools() {
    document.title = 'The tools · Curves Workshop';
    const T = [
      ['straightedge', 'A ruler without marks. It draws the line through two points you already have. In classical geometry that is all it may do: no measuring, no sliding to fit.'],
      ['compass', 'Draws a circle, or a part of one, about a point you have, with a radius taken between two points you have. Euclid’s compass closes when lifted; the modern one keeps its opening, which is what the dividers formalise.'],
      ['dividers', 'Two points, no pencil. They carry a length from one place to another and step off equal parts along a line or a circle — the way a draughtsman divides a circle into twelve to draw a cycloid.'],
      ['pencil', 'Joins the points you constructed into the curve, with a French curve or a steady hand. The curve itself is never “constructed”: only its points and its tangents are.'],
      ['square', 'A set square (or a T-square) gives a perpendicular or a parallel through a point at once. Classically you would do it with the compass; in the drawing office you do not.'],
      ['ruler', 'A marked ruler measures and lays off a stated length. The book’s trisection of an angle by the conchoid needs a ruler with two marks — a “neusis”, outside Euclid’s rules.'],
      ['protractor', 'Lays off a stated angle. Used where the book says “at the angle θ” for a chosen θ.'],
      ['roll', 'Not a tool but a motion: a circle rolling on a line or a circle. The figure shows one position; the practice asks you for that position and the point it carries.'],
      ['fold', 'Paper folding: a crease that brings a point onto a line or a circle is a tangent of a conic. A crease is a line, so the practice board asks for the line.'],
      ['linkage', 'Bars and pivots. The book draws many mechanisms (Peaucellier, Hart, the crossed parallelograms); the drawings show them at one position.']
    ];
    let html = '<h1>The tools</h1><p class="prose">Every step of every construction names the tool it is made with. The classical rules allow only the first two; the others belong to the drawing office of 1947 and to the book, which uses them freely.</p>' +
      '<div class="toolgrid">' + T.map(([t, text]) => '<div class="card"><div style="color:var(--accent)"><span class="toolicon" style="width:40px;height:40px">' + ICON[t] + '</span></div><h3>' + esc(C.TOOLS[t].name) + '</h3><p class="small">' + esc(text) + '</p></div>').join('') + '</div>';
    html += '<h2>The practice board</h2><div class="prose">' +
      '<p>Open a construction, read the instruction for the current step, pick the tool it names and draw. The board snaps to the points you have, to the intersections of your lines and circles, and to the given curves. A drawn element turns <b style="color:var(--ok)">green</b> when it matches what the step asks for, and the next instruction appears. <b>Hint</b> shows the element to draw as a dashed ghost; <b>Show</b> draws it for you (it counts).</p>' +
      '<ul><li><b>Point:</b> click. <b>Straightedge:</b> click two points. <b>Compass:</b> click the centre, then a point at the radius (or a point whose distance you want). <b>Dividers:</b> click two points to take a length, then a centre to swing it (a circle of that radius). <b>Set square:</b> click a line, then a point: a perpendicular; with <kbd>Shift</kbd>, a parallel. <b>Pencil:</b> drag along the curve through your points.</li>' +
      '<li><kbd>Esc</kbd> cancels the current tool action, <kbd>Ctrl</kbd>+<kbd>Z</kbd> undoes, <kbd>Delete</kbd> removes the last element.</li>' +
      '<li>On paper: print the worksheet from the figure page (the first step only) and follow the same instructions with real tools.</li></ul></div>';
    main.innerHTML = html;
  }

  /* ---- search */
  function search(q) {
    q = (q || '').trim();
    document.title = 'Search · Curves Workshop';
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const hit = s => words.every(w => String(s).toLowerCase().includes(w));
    const figs = words.length ? C.catalog.figures.filter(f => hit(f.id + ' ' + f.caption + ' ' + f.title + ' ' + f.section + ' ' + f.tags.join(' '))) : [];
    const secs = words.length ? C.manifest.sections.filter(s => { const d = C.sections.get(s.id); return hit(s.id + ' ' + s.title + ' ' + (d ? H.plain(d.description) + ' ' + H.plain(d.history) + ' ' + (d.items || []).map(i => H.plain(i.text)).join(' ') : '')); }) : [];
    main.innerHTML = '<h1>Search</h1><p><input type="search" id="sq" value="' + esc(q) + '" placeholder="cardioid, tangent, Peaucellier …" style="width:min(100%,480px)"></p>' +
      (secs.length ? '<h2>Sections</h2><ul class="search-results">' + secs.map(s => '<li><a href="#/s/' + s.id + '">' + esc(s.title) + '</a> <span class="muted small">pages ' + s.pages[0] + '–' + s.pages[1] + '</span></li>').join('') + '</ul>' : '') +
      (figs.length ? '<h2>Figures</h2><div class="gallery">' + figs.map(f => '<a class="card" href="#/f/' + f.id + '"><div class="thumb">' + svgOf(f.id) + '</div><h3>' + esc(f.caption) + '</h3><div class="meta small">' + esc(f.title) + '</div></a>').join('') + '</div>' : '') +
      (words.length && !figs.length && !secs.length ? '<p class="muted">Nothing found.</p>' : '');
    const inp = $('#sq'); inp.focus(); inp.onchange = () => { location.hash = '#/search/' + encodeURIComponent(inp.value); };
  }
  $('#topsearch').addEventListener('change', e => { location.hash = '#/search/' + encodeURIComponent(e.target.value); });
  $('#theme').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next; store.set('theme', next);
  });
  const th = store.get('theme', null); if (th) document.documentElement.dataset.theme = th;

  boot();
})();
