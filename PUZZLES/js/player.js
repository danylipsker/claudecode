/* The Puzzle Cabinet · player.js
 *
 * The page of one puzzle: the statement, the workbench with the engine's
 * pieces on it, and everything around them — hints, checking, undo and redo,
 * the notebook, the layers list, saving the game in progress, stars, and the
 * links to related puzzles.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  let current = null;

  C.openPuzzle = async function (host, id) {
    if (current) { current.destroy(); current = null; }
    const row = C.row(id);
    if (!row) { host.innerHTML = ''; host.appendChild(C.notFound('There is no puzzle called “' + id + '” in the cabinet.')); return; }
    host.innerHTML = '<div class="loading"><div class="spinner"></div>Opening the drawer…</div>';
    try {
      await C.loadFamily(row.family);
    } catch (e) {
      host.innerHTML = '';
      host.appendChild(C.notFound('This puzzle could not be loaded: ' + e.message));
      return;
    }
    const p = C.byId[id];
    const engine = p && C.engines[p.engine];
    if (!p || !engine) { host.innerHTML = ''; host.appendChild(C.notFound('This puzzle\'s engine is missing.')); return; }
    current = new Player(host, p, engine);
    C.store.set('last', id);
  };
  C.currentPlayer = () => current;
  C.closePuzzle = function () { if (current) { current.destroy(); current = null; } };

  /* ---------- endless: a new puzzle made (and checked) on the spot ---------- */

  C.endlessHref = (fid, level, seed) => '#/x/' + fid + '/' + level + (seed != null ? '/' + seed : '');
  C.newSeed = () => Math.floor(Math.random() * 1e9);

  // make the puzzle for (family, level, seed); a seed that yields nothing checkable moves on to the next one.
  // Async: the page breathes between attempts (the spinner turns, onTry(k) can report progress)
  C.makeEndless = async function (fid, level, seed, onTry) {
    const fam = C.families[fid];
    const eng = fam && C.engines[fam.meta.engine];
    if (!eng || !eng.generate) throw new Error('This drawer cannot make new puzzles.');
    const t0 = Date.now();
    let lastErr = null;
    const budget = eng.endlessMs || 6000; // a heavy maker may ask for more time
    for (let k = 0; k < 25 && Date.now() - t0 < budget; k++) {
      if (k) { if (onTry) onTry(k); await new Promise((r) => setTimeout(r, 0)); }
      const s = seed + k;
      let gen = null;
      try { gen = eng.generate(C.rng('x:' + fid + ':' + level + ':' + s), level, fam.meta); } catch (e) { lastErr = e; }
      if (!gen || !gen.data) continue;
      const p = Object.assign({ text: '' }, gen, {
        id: 'x-' + fid + '-' + level + '-' + s, family: fid, engine: fam.meta.engine,
        diff: gen.diff || level, endless: { level, seed: s }
      });
      p.title = gen.title || (fam.meta.name + ' · no. ' + s % 100000);
      let ok = true;
      if (eng.verify) { try { const r = eng.verify(p); ok = !!(r && r.ok); if (r && r.par != null && p.par == null) p.par = r.par; } catch (e) { ok = false; lastErr = e; } }
      if (ok) { C.byId[p.id] = p; return p; }
    }
    throw lastErr || new Error('No puzzle could be made just now — try another level.');
  };

  C.openEndless = async function (host, fid, level, seed) {
    if (current) { current.destroy(); current = null; }
    const info = C.famInfo(fid);
    if (!info || !info.endless) { host.innerHTML = ''; host.appendChild(C.notFound('This drawer has no endless mode.')); return; }
    level = Math.max(1, Math.min(5, parseInt(level, 10) || 2));
    if (seed == null || seed === '' || isNaN(+seed)) { root.location.replace(C.endlessHref(fid, level, C.newSeed())); return; }
    host.innerHTML = '<div class="loading"><div class="spinner"></div><span>Making a new puzzle and checking it…</span></div>';
    const msg = host.querySelector('.loading span');
    const route = root.location.hash;
    let p;
    try {
      await C.loadFamily(fid);
      await new Promise((r) => setTimeout(r, 20));
      p = await C.makeEndless(fid, level, +seed, (k) => { msg.textContent = 'Still looking for a good one — try ' + (k + 1) + '…'; });
    } catch (e) {
      if (root.location.hash !== route) return; // the player left while it was being made
      host.innerHTML = '';
      host.appendChild(C.notFound(e.message));
      return;
    }
    if (root.location.hash !== route) return;
    if (current) { current.destroy(); current = null; }
    current = new Player(host, p, C.engines[p.engine]);
  };

  C.endlessStats = function (fid) { return (C.store.get('xstat', {}) || {})[fid] || {}; };
  function recordEndless(p, stars, secs) {
    const all = C.store.get('xstat', {}) || {};
    const f = all[p.family] = all[p.family] || {};
    const l = f[p.endless.level] = f[p.endless.level] || { n: 0, stars: 0, best: null };
    l.n++; l.stars += stars;
    if (secs && (!l.best || secs < l.best)) l.best = secs;
    C.store.set('xstat', all);
  }

  function Player(host, p, engine) {
    this.host = host;
    this.p = p;
    this.engine = engine;
    this.fam = C.families[p.family];
    this.meta = this.fam.meta;
    this.row = C.row(p.id) || { id: p.id, title: p.title, family: p.family, diff: p.diff, cat: (C.famInfo(p.family) || this.meta).cat, tags: [], concepts: p.concepts || [], links: [] };
    this.saved = C.store.get('st:' + p.id, null);
    // a game saved by an older version of the engine is not restored (the notebook and hints are kept)
    if (this.saved && (this.saved.v || 0) !== (engine.stateVersion || 0)) {
      this.saved = { nb: this.saved.nb, hints: this.saved.hints, t: this.saved.t, revealed: this.saved.revealed, solved: this.saved.solved, ans: this.saved.ans };
    }
    this.hintsShown = this.saved && this.saved.hints ? this.saved.hints.slice() : [];
    this.revealed = !!(this.saved && this.saved.revealed);
    this.elapsed = this.saved && this.saved.t ? this.saved.t : 0;
    this.moves = this.saved && this.saved.moves ? this.saved.moves : 0;
    this.solvedNow = false;
    this.nb = (this.saved && this.saved.nb) || {};
    this.stack = [];
    this.at = -1;
    this.build();
    this.mount();
    this.startClock();
  }

  const proto = Player.prototype;

  /* ---------- the page ---------- */

  proto.build = function () {
    const p = this.p, meta = this.meta, cat = C.catById[this.row.cat] || C.categories[0];
    const h = C.h;
    this.host.innerHTML = '';
    const pg = this.el = h('div.pz', { style: { '--hue': cat.hue } });
    const famRows = C.familyRows(p.family);
    const idx = famRows.findIndex((r) => r.id === p.id);
    const year = p.year != null ? p.year : null;
    const best = C.progress.get(p.id);

    // header
    this.starsEl = h('span.pz-best');
    const top = h('header.pz-top',
      h('a.pz-back', { href: '#/f/' + p.family, title: 'Back to ' + meta.name, html: C.icon('prev') }),
      h('div.pz-titles',
        h('div.pz-crumbs',
          h('a.chip.cat', { href: '#/s/' + cat.id, style: { '--hue': cat.hue } }, cat.name),
          h('a.crumb', { href: '#/f/' + p.family }, meta.name),
          p.endless ? h('span.crumb.n.endless', 'Endless · ' + C.diffs[p.endless.level].name) : h('span.crumb.n', (idx + 1) + ' of ' + famRows.length)
        ),
        h('h1.pz-title', p.title)
      ),
      h('div.pz-meta',
        C.diffBadge(p.diff),
        year != null ? h('span.pz-year', { title: p.source || '' }, C.fmtYear(year)) : null,
        this.starsEl
      ),
      h('div.pz-nav',
        p.endless ? null : h('button.iconbtn', { type: 'button', title: 'Previous puzzle', html: C.icon('prev'), onclick: () => this.go(-1), disabled: idx <= 0 }),
        p.endless ? h('button.btn.small.gold', { type: 'button', title: 'Another new puzzle at this level', html: C.icon('shuffle') + '<span>New puzzle</span>', onclick: () => this.go(1) })
          : h('button.iconbtn', { type: 'button', title: 'Next puzzle', html: C.icon('next'), onclick: () => this.go(1), disabled: idx >= famRows.length - 1 })
      )
    );

    // the stage and the side panel
    this.stageEl = h('section.pz-stage');
    this.coverEl = h('div.pz-cover');
    const stageWrap = h('div.pz-stagewrap', this.stageEl, this.coverEl);

    this.tabs = {};
    const tabBar = h('div.pz-tabs', { role: 'tablist' });
    const tabBody = h('div.pz-tabbody');
    const addTab = (id, label, icon) => {
      const b = h('button.pz-tab', { type: 'button', role: 'tab', html: C.icon(icon) + '<span>' + label + '</span>', onclick: () => this.showTab(id) });
      const body = h('div.pz-pane', { role: 'tabpanel' });
      body.hidden = true;
      tabBar.appendChild(b);
      tabBody.appendChild(body);
      this.tabs[id] = { b, body };
      return body;
    };
    const puz = addTab('puzzle', 'Puzzle', 'book');
    const notes = addTab('notes', 'Notes', 'calc');
    const layers = addTab('layers', 'Layers', 'layers');
    const help = addTab('help', 'How to', 'help');

    this.textEl = h('div.pz-text', { html: C.md(p.text || '') });
    this.goalEl = h('div.pz-goal');
    if (p.goal) this.goalEl.innerHTML = C.icon('check') + '<span>' + C.md(p.goal) + '</span>';
    else this.goalEl.hidden = true;
    this.answerEl = h('div.pz-answer');
    this.enginePanel = h('div.pz-enginepanel');
    this.hintsEl = h('div.pz-hints');
    this.explainEl = h('div.pz-explain');
    this.explainEl.hidden = true;
    this.relatedEl = h('div.pz-related');
    const src = p.source || (meta.origin && meta.origin.note) || '';
    puz.append(...[
      this.textEl, this.goalEl, this.answerEl, this.enginePanel, this.hintsEl, this.explainEl,
      src ? h('div.pz-source', { html: C.icon('history') + '<span>' + C.md(src) + '</span>' }) : null,
      this.relatedEl
    ].filter(Boolean));

    this.nbHost = notes;
    this.layersEl = layers;
    help.innerHTML = C.helpHTML(this.engine, meta, p);

    this.side = h('aside.pz-side', tabBar, tabBody);

    // the bottom bar
    this.statusEl = h('div.pz-status', { 'aria-live': 'polite' });
    this.statsEl = h('div.pz-stats');
    this.clockEl = h('span.pz-clock');
    const act = (icon, label, fn, cls, title) => h('button.btn' + (cls ? '.' + cls : ''), { type: 'button', title: title || label, onclick: fn, html: C.icon(icon) + '<span>' + label + '</span>' });
    this.undoBtn = act('undo', 'Undo', () => this.undo(), 'ghost', 'Undo (Ctrl+Z)');
    this.redoBtn = act('redo', 'Redo', () => this.redo(), 'ghost', 'Redo (Ctrl+Y)');
    this.hintBtn = act('hint', 'Hint', () => this.hint(), 'gold', 'A hint (?) — hints cost stars');
    this.checkBtn = act('check', 'Check', () => this.check(true), 'primary', 'Check your answer (Enter)');
    this.solBtn = act('solution', 'Solution', () => this.reveal(), 'ghost', 'Show the solution');
    const bar = h('footer.pz-bar',
      h('div.pz-info', this.statusEl, h('div.pz-statline', this.statsEl, this.clockEl)),
      h('div.pz-actions',
        this.undoBtn, this.redoBtn,
        act('reset', 'Reset', () => this.reset(), 'ghost', 'Start this puzzle again'),
        this.hintBtn, this.checkBtn, this.solBtn
      )
    );

    pg.append(top, h('div.pz-body', h('div.pz-main', stageWrap, bar), this.side));
    this.host.appendChild(pg);
    this.showTab('puzzle');
    this.drawBest(best);
    this.drawHints();
    this.drawRelated();
  };

  proto.showTab = function (id) {
    for (const k in this.tabs) {
      const on = k === id;
      this.tabs[k].b.classList.toggle('on', on);
      this.tabs[k].b.setAttribute('aria-selected', on);
      this.tabs[k].body.hidden = !on;
    }
    this.tab = id;
    if (id === 'layers') this.drawLayers();
  };

  proto.drawBest = function (rec) {
    rec = rec || C.progress.get(this.p.id);
    this.starsEl.innerHTML = '';
    if (!rec) return;
    if (rec.seen) { this.starsEl.appendChild(C.h('span.seen', { title: 'You have seen the solution' }, 'seen')); return; }
    this.starsEl.appendChild(C.starRow(rec.s, 'Your best: ' + rec.s + ' of 3 stars' + (rec.t ? ', ' + C.fmtTime(rec.t) : '')));
  };

  /* ---------- the engine ---------- */

  proto.mount = function () {
    const p = this.p, engine = this.engine;
    const tools = (engine.tools || ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe']).slice();
    const wbOpts = Object.assign({ tools }, engine.workbench || {}, p.workbench || {});
    this.wb = new C.Workbench(this.stageEl, wbOpts);
    const self = this;
    this.statVals = {};
    const ctx = this.ctx = {
      p, puzzle: p, family: this.meta, wb: this.wb, C, G: C.geom,
      rng: C.rng(p.id),
      panel: this.enginePanel,
      answerHost: this.answerEl,
      say: (msg, kind) => this.say(msg, kind),
      stat: (label, value) => { this.statVals[label] = value; this.drawStats(); },
      move: (n) => { this.moves = n == null ? this.moves + 1 : n; this.statVals.Moves = this.moves; this.drawStats(); },
      // opts.undo === false: remember the change (save, check) without making an undo step
      changed: (why, opts) => this.changed(why, false, opts),
      solved: (r) => this.onSolved(r || {}),
      setGoal: (t) => { this.goalEl.hidden = !t; this.goalEl.innerHTML = C.icon('check') + '<span>' + C.md(t || '') + '</span>'; },
      sfx: (n) => C.sfx(n),
      // cls: 'small gold' or 'small.gold'
      button: (label, fn, cls) => { const b = C.h('button.btn' + (cls ? '.' + String(cls).trim().split(/[\s.]+/).join('.') : ''), { type: 'button', onclick: fn }, label); this.enginePanel.appendChild(b); return b; },
      answer: (spec) => C.answerBox(this, spec),
      hideText: () => { this.textEl.hidden = true; },
      undo: () => this.undo(),
      // ask for the next hint as if the Hint button were pressed (it counts as a hint)
      hint: () => this.hint(),
      // a small "thinking…" pill over the stage while the computer chooses its move
      thinking: (on, text) => {
        const wrap = this.el.querySelector('.pz-stagewrap');
        let pill = wrap.querySelector('.pz-thinking');
        if (!on) { if (pill) pill.remove(); return; }
        if (!pill) { pill = C.h('div.pz-thinking', C.h('span.dots', C.h('i'), C.h('i'), C.h('i')), C.h('span.t')); wrap.appendChild(pill); }
        pill.querySelector('.t').textContent = text || 'Thinking…';
      },
      // settings of the engine's tools (a wheel's turn, a typed keyword): kept across reloads, not part of undo
      keep: (k, v) => { this.toolState = this.toolState || {}; this.toolState[k] = v; this.save(); },
      kept: (k, dflt) => { const t = this.toolState || (this.saved && this.saved.tools) || {}; return t[k] === undefined ? dflt : t[k]; },
      lockUndo: (on) => { this.undoLocked = !!on; this.syncUndo(); },
      isRevealed: () => this.revealed,
      hintCount: () => this.hintsShown.length,
      showHelp: () => this.showTab('help'),
      toast: (m, k) => this.wb.toast(m, k),
      md: C.md,
      h: C.h,
      s: C.s
    };
    try {
      this.inst = engine.mount(ctx, p) || {};
    } catch (e) {
      console.error(e);
      this.say('This puzzle failed to start: ' + e.message, 'warn');
      this.inst = {};
    }
    if (this.inst.check == null) this.checkBtn.hidden = true;
    if (engine.autoCheck === false || p.autoCheck === false) this.autoCheck = false; else this.autoCheck = true;
    if (this.inst.checkLabel) this.checkBtn.querySelector('span').textContent = this.inst.checkLabel;
    if (!this.inst.solve) this.solBtn.hidden = true;
    this.wb.on('change', (e) => this.changed(e && e.why, true));
    this.wb.on('select', () => { if (this.tab === 'layers') this.drawLayers(); });
    // the starting position, then whatever was saved
    this.pushState(true);
    if (this.saved && this.saved.wb) {
      try {
        this.applyState({ wb: this.saved.wb, e: this.saved.e });
        this.pushState();
      } catch (e) { console.warn('saved state ignored', e); }
    }
    C.Notebook(this.nbHost, this.nb, () => this.save());
    // the instance may override the engine (one kind counts moves, another does not)
    const noMoves = this.inst.noMoves != null ? this.inst.noMoves : engine.noMoves;
    this.statVals.Moves = noMoves ? undefined : this.moves;
    if (noMoves) delete this.statVals.Moves;
    this.drawStats();
    this.syncUndo();
    if (this.saved && this.saved.solved) this.showExplain();
    // the first-time "how to play" card: once per family, or once per kind when a family mixes kinds
    this.helpKey = this.meta.id + (this.p.data && this.p.data.kind && !this.meta.about ? ':' + this.p.data.kind : '');
    if (!this.saved && C.helpSeen && !C.helpSeen(this.helpKey) && C.aboutOf(this.engine, this.meta, this.p)) this.firstHelp();
  };

  proto.firstHelp = function () {
    C.markHelpSeen(this.helpKey || this.meta.id);
    const card = C.h('div.pz-howto',
      C.h('div.pz-howto-card',
        C.h('h3', 'How to play: ' + (this.meta.about ? this.meta.name : (this.engine.name || this.meta.name))),
        C.h('div', { html: C.md(C.aboutOf(this.engine, this.meta, this.p)) }),
        C.h('button.btn.primary', { type: 'button', onclick: () => card.remove() }, 'Got it')
      )
    );
    this.el.querySelector('.pz-stagewrap').appendChild(card);
  };

  proto.destroy = function () {
    if (this.animBefore != null) C.animScale = this.animBefore;
    this.save();
    clearInterval(this.clockT);
    try { if (this.inst.destroy) this.inst.destroy(); } catch (e) { console.error(e); }
    this.wb.destroy();
  };

  /* ---------- state, undo, saving ---------- */

  proto.captureState = function () {
    let e = null;
    try { e = this.inst.getState ? this.inst.getState() : null; } catch (err) { console.error(err); }
    return { wb: this.wb.snapshot(), e: e == null ? null : C.clone(e), moves: this.moves };
  };
  proto.applyState = function (s) {
    this.applying = true;
    try {
      this.wb.restore(s.wb);
      if (this.inst.setState && s.e != null) this.inst.setState(C.clone(s.e));
    } finally { this.applying = false; }
    if (s.moves != null) { this.moves = s.moves; if (this.statVals.Moves != null) { this.statVals.Moves = this.moves; this.drawStats(); } }
  };
  proto.pushState = function (initial) {
    const s = this.captureState();
    this.stack = this.stack.slice(0, this.at + 1);
    this.stack.push(s);
    if (this.stack.length > 200) this.stack.shift();
    this.at = this.stack.length - 1;
    if (initial) this.initial = s;
    this.syncUndo();
  };
  proto.syncUndo = function () {
    this.undoBtn.disabled = this.at <= 0 || !!this.undoLocked;
    this.redoBtn.disabled = this.at >= this.stack.length - 1 || !!this.undoLocked;
  };
  proto.undo = function () {
    if (this.at <= 0 || this.undoLocked) return;
    this.at--;
    this.applyState(this.stack[this.at]);
    this.syncUndo();
    this.save();
    if (this.tab === 'layers') this.drawLayers();
  };
  proto.redo = function () {
    if (this.at >= this.stack.length - 1 || this.undoLocked) return;
    this.at++;
    this.applyState(this.stack[this.at]);
    this.syncUndo();
    this.save();
    this.autoCheckNow();
  };
  proto.reset = function () {
    if (!this.initial) return;
    this.applyState(this.initial);
    this.moves = 0;
    if (this.statVals.Moves != null) { this.statVals.Moves = 0; this.drawStats(); }
    if (this.inst.reset) this.inst.reset();
    this.pushState();
    this.coverEl.classList.remove('show');
    this.say('Back to the start.', '');
    this.save();
  };

  // fromTable: the change came from the workbench's own tools; ink, notes, colours and the like never solve a puzzle
  const COSMETIC = new Set(['ink', 'erase', 'note', 'paint', 'legend', 'colour', 'opacity', 'visible', 'lock', 'order', 'group']);
  proto.changed = function (why, fromTable, opts) {
    if (this.applying) return;
    if (opts && opts.undo === false) { this.stack[this.at] = this.captureState(); this.syncUndo(); }
    else this.pushState();
    this.save();
    if (this.tab === 'layers') this.drawLayers();
    if (fromTable && COSMETIC.has(why)) return;
    this.autoCheckNow();
  };

  proto.autoCheckNow = function () {
    if (!this.autoCheck || !C.settings.autocheck || !this.inst.check) return;
    clearTimeout(this.acT);
    this.acT = setTimeout(() => {
      let r = null;
      try { r = this.inst.check(false); } catch (e) { console.error(e); }
      if (r && r.solved) this.onSolved(r);
    }, 60);
  };

  proto.save = function () {
    clearTimeout(this.saveT);
    this.saveT = setTimeout(() => this.saveNow(), 250);
  };
  proto.saveNow = function () {
    const s = this.stack[this.at] || this.captureState();
    const rec = { v: this.engine.stateVersion || 0, wb: s.wb, e: s.e, moves: this.moves, t: Math.round(this.elapsed), hints: this.hintsShown, revealed: this.revealed, nb: this.nb, solved: this.solvedNow || (this.saved && this.saved.solved), ans: this.answered != null ? this.answered : (this.saved ? this.saved.ans : undefined), tools: this.toolState || (this.saved ? this.saved.tools : undefined), when: Date.now() };
    if (!C.store.set('st:' + this.p.id, rec)) {
      // storage full (it is shared with the other apps on this site): drop old saved games, try once more
      C.pruneSaves(60);
      C.store.set('st:' + this.p.id, rec);
    }
    C.noteSave(this.p.id);
  };

  /* ---------- clock and stats ---------- */

  proto.startClock = function () {
    let last = Date.now();
    this.clockT = setInterval(() => {
      const now = Date.now();
      if (!root.document.hidden && !this.solvedNow) this.elapsed += (now - last) / 1000;
      last = now;
      this.clockEl.textContent = C.settings.timer ? C.fmtTime(this.elapsed) : '';
      if (Math.round(this.elapsed) % 15 === 0) this.save();
    }, 1000);
    this.clockEl.textContent = C.settings.timer ? C.fmtTime(this.elapsed) : '';
  };

  proto.drawStats = function () {
    this.statsEl.innerHTML = '';
    for (const k in this.statVals) {
      const v = this.statVals[k];
      if (v == null) continue;
      const label = k === 'Moves' ? (this.engine.movesLabel || this.p.movesLabel || k) : k;
      this.statsEl.appendChild(C.h('span.stat', C.h('small', label), ' ', C.h('b', String(v))));
    }
    if (this.p.par != null && this.statVals.Moves != null) this.statsEl.appendChild(C.h('span.stat.par', C.h('small', 'Par'), ' ', C.h('b', String(this.p.par))));
  };

  proto.say = function (msg, kind) {
    this.statusEl.className = 'pz-status' + (kind ? ' ' + kind : '');
    this.statusEl.innerHTML = msg ? C.md(msg) : '';
  };

  /* ---------- checking, hints, the solution ---------- */

  proto.check = function (manual) {
    if (!this.inst.check) return;
    let r;
    try { r = this.inst.check(true); } catch (e) { console.error(e); r = { solved: false, msg: 'The checker tripped over something: ' + e.message }; }
    if (!r) return;
    if (r.solved) { this.onSolved(r); return; }
    if (manual) {
      C.sfx('wrong');
      const q = C.settings.quips ? C.quip('wrong') : '';
      this.say((r.msg ? r.msg + ' ' : '') + (q ? '<span class="quip">' + q + '</span>' : ''), 'warn');
      this.el.querySelector('.pz-stagewrap').classList.remove('shake');
      void this.el.offsetWidth;
      this.el.querySelector('.pz-stagewrap').classList.add('shake');
    }
  };

  proto.hint = function () {
    const data = this.p.hints || [];
    let text = null;
    const n = this.hintsShown.length;
    if (n < data.length) text = data[n];
    else if (this.inst.hint) {
      try { text = this.inst.hint(n - data.length); } catch (e) { console.error(e); }
    }
    if (!text) {
      this.say(C.quip('noHints'), 'warn');
      this.hintBtn.classList.add('spent');
      return;
    }
    if (typeof text === 'object') {
      // a hint drawn on the board should not sit under the floating action bar
      if (text.show) { this.wb.select([]); try { text.show(); } catch (e) { console.error(e); } }
      text = text.text;
    }
    this.hintsShown.push(text);
    C.sfx('hint');
    this.drawHints(true);
    this.showTab('puzzle');
    this.save();
  };

  proto.drawHints = function (fresh) {
    const el = this.hintsEl;
    el.innerHTML = '';
    this.hintsShown.forEach((t, i) => {
      const card = C.h('div.pz-hint' + (fresh && i === this.hintsShown.length - 1 ? '.fresh' : ''),
        C.h('span.pz-hint-n', 'Hint ' + (i + 1)),
        C.h('div', { html: (i === this.hintsShown.length - 1 && fresh && C.settings.quips ? '<span class="quip">' + C.quip('hint', i) + '</span> ' : '') + C.md(t) })
      );
      el.appendChild(card);
    });
    const left = (this.p.hints || []).length - this.hintsShown.length;
    const lbl = this.hintBtn.querySelector('span');
    lbl.textContent = left > 0 ? 'Hint (' + left + ')' : 'Hint';
    if (fresh && el.lastChild) el.lastChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  proto.reveal = function (sure) {
    if (!this.inst.solve) return;
    if (!sure && !this.revealed && !this.solvedNow && !C.autoConfirm) {
      C.confirmCard(this.el.querySelector('.pz-stagewrap'), {
        title: 'Show the solution?',
        text: 'The puzzle will be marked as seen rather than solved. You can still come back and solve it for stars.',
        ok: 'Show it', cancel: 'Keep trying'
      }).then((yes) => { if (yes) this.reveal(true); });
      return;
    }
    this.revealed = true;
    C.progress.reveal(this.p.id);
    try { this.inst.solve(); } catch (e) { console.error(e); }
    // a long solution can be hurried along
    if (!this.fastBtn && C.animScale >= 1) {
      this.fastBtn = C.h('button.btn.small.pz-fast', { type: 'button', title: 'Play the rest of the solution quickly', html: C.icon('next') + '<span>Faster</span>', onclick: () => {
        if (this.animBefore == null) this.animBefore = C.animScale;
        C.animScale = 0.08;
        this.fastBtn.remove();
      } });
      this.el.querySelector('.pz-stagewrap').appendChild(this.fastBtn);
      setTimeout(() => { if (this.fastBtn) this.fastBtn.remove(); }, 60000);
    }
    C.sfx('reveal');
    this.say(C.settings.quips ? C.quip('reveal') : 'The solution is shown.', 'info');
    this.showExplain();
    this.save();
    this.drawBest();
  };

  proto.showExplain = function () {
    const t = this.p.explain || (this.inst.explain && this.inst.explain());
    if (!t) return;
    this.explainEl.hidden = false;
    this.explainEl.innerHTML = '<h4>' + C.icon('info') + ' Why it works</h4>' + C.md(t);
  };

  proto.onSolved = function (r) {
    if (this.solvedNow) return;
    this.solvedNow = true;
    // tell the engine (unlock an almanac, play a flourish…)
    if (this.inst.onSolved) { try { this.inst.onSolved(r); } catch (e) { console.error(e); } }
    const hints = this.hintsShown.length;
    let stars = this.revealed ? 0 : hints === 0 ? 3 : hints <= 2 ? 2 : 1;
    if (r.stars != null && !this.revealed) stars = Math.min(stars, r.stars);
    let rec = null;
    if (this.p.endless) { if (!this.revealed) recordEndless(this.p, stars, Math.round(this.elapsed)); }
    else if (!this.revealed) rec = C.progress.record(this.p.id, { s: stars, t: Math.round(this.elapsed), h: hints, m: this.moves || null, d: Date.now() });
    this.save();
    this.drawBest();
    this.showExplain();
    C.sfx('solve');
    const perfect = !this.revealed && (r.perfect || (this.p.par != null && this.moves && this.moves <= this.p.par));
    const quip = C.settings.quips ? C.quip('solve') + (perfect ? ' ' + C.quip('perfect') : '') : '';
    this.say('**Solved!** ' + (r.msg || ''), 'good');
    const next = this.nextRow(1, true);
    const cov = this.coverEl;
    cov.innerHTML = '';
    const starEl = C.h('div.stars');
    for (let i = 0; i < 3; i++) starEl.appendChild(C.h('span' + (i < stars ? '.on' : ''), '★'));
    cov.append(
      C.h('div.pz-cover-card',
        C.h('h2', this.revealed ? 'There it is' : 'Solved!'),
        this.revealed ? C.h('div.detail', 'You looked at the solution, so no stars this time.') : starEl,
        C.h('div.detail', [
          'Time ' + C.fmtTime(this.elapsed),
          this.moves ? ' · ' + C.plural(this.moves, 'move') : '',
          this.p.par != null && this.moves ? ' (par ' + this.p.par + ')' : '',
          hints ? ' · ' + C.plural(hints, 'hint') : ' · no hints'
        ].join('')),
        r.msg ? C.h('div.detail', { html: C.md(r.msg) }) : null,
        quip ? C.h('div.quip', quip) : null,
        C.h('div.row',
          C.h('button.btn.ghost', { type: 'button', onclick: () => { cov.classList.remove('show'); } }, 'Look at the board'),
          this.p.endless ? C.h('a.btn.primary', { href: C.endlessHref(this.p.family, this.p.endless.level, C.newSeed()) }, 'Another one ›')
            : next ? C.h('a.btn.primary', { href: '#/p/' + next.id }, 'Next puzzle ›') : C.h('a.btn.primary', { href: '#/f/' + this.p.family }, 'Back to the drawer')
        )
      )
    );
    requestAnimationFrame(() => cov.classList.add('show'));
    if (rec && C.onProgress) C.onProgress();
    this.burst();
  };

  proto.burst = function () {
    if (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = this.el.querySelector('.pz-stagewrap');
    const b = C.h('div.burst');
    const hue = (C.catById[this.row.cat] || { hue: 230 }).hue;
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 170;
      b.appendChild(C.h('i', { style: { '--dx': Math.cos(a) * d + 'px', '--dy': Math.sin(a) * d + 'px', '--c': 'hsl(' + (hue + Math.random() * 120 - 60) + ' 90% 65%)', animationDelay: (Math.random() * 0.12) + 's' } }));
    }
    wrap.appendChild(b);
    setTimeout(() => b.remove(), 1500);
  };

  /* ---------- navigation ---------- */

  proto.nextRow = function (dir, unsolvedFirst) {
    if (this.p.endless) return null;
    const rows = C.familyRows(this.p.family);
    const i = rows.findIndex((r) => r.id === this.p.id);
    if (unsolvedFirst) {
      for (let k = i + 1; k < rows.length; k++) if (!C.progress.solved(rows[k].id)) return rows[k];
      for (let k = 0; k < i; k++) if (!C.progress.solved(rows[k].id)) return rows[k];
    }
    return rows[i + dir] || null;
  };
  proto.go = function (dir) {
    if (this.p.endless) { root.location.hash = C.endlessHref(this.p.family, this.p.endless.level, C.newSeed()); return; }
    const r = this.nextRow(dir);
    if (r) root.location.hash = '#/p/' + r.id;
  };

  proto.drawRelated = function () {
    const el = this.relatedEl, p = this.p;
    el.innerHTML = '';
    const ids = new Set();
    const links = [];
    (p.links || []).forEach((id) => { if (C.row(id) && !ids.has(id)) { ids.add(id); links.push(C.row(id)); } });
    const back = C.backlinks(p.id).filter((id) => !ids.has(id) && id !== p.id);
    back.forEach((id) => { ids.add(id); links.push(C.row(id)); });
    const concepts = (p.concepts || []).concat(this.meta.concepts || []).filter((c, i, a) => a.indexOf(c) === i && C.conceptById[c]);
    if (!links.length && !concepts.length) return;
    el.appendChild(C.h('h4', { html: C.icon('link') + ' Related' }));
    if (concepts.length) {
      const cc = C.h('div.chips');
      concepts.forEach((c) => cc.appendChild(C.h('a.chip.concept', { href: '#/c/' + c }, C.conceptById[c].name)));
      el.appendChild(cc);
    }
    if (links.length) {
      const ul = C.h('div.pz-links');
      links.slice(0, 12).forEach((r) => ul.appendChild(C.puzzleLink(r)));
      el.appendChild(ul);
    }
    // the same idea at work in other drawers: a few picks that stay the same for this puzzle
    if (concepts.length) {
      const pool = C.rows().filter((r) => r.family !== p.family && !ids.has(r.id) &&
        (r.concepts.some((c) => concepts.includes(c)) || ((C.famInfo(r.family) || {}).concepts || []).some((c) => concepts.includes(c))));
      const seen = new Set();
      const pick = [];
      const rng = C.rng(p.id + ':elsewhere');
      for (let k = 0; k < 40 && pick.length < 4 && pool.length; k++) {
        const r = pool[Math.floor(rng() * pool.length)];
        if (seen.has(r.family)) continue; // one per drawer
        seen.add(r.family);
        pick.push(r);
      }
      if (pick.length) {
        el.appendChild(C.h('h4', { html: C.icon('shuffle') + ' The same idea elsewhere' }));
        const ul = C.h('div.pz-links');
        pick.forEach((r) => ul.appendChild(C.puzzleLink(r)));
        el.appendChild(ul);
      }
    }
  };

  /* ---------- layers: every piece, with see-through, lock, hide ---------- */

  proto.drawLayers = function () {
    const el = this.layersEl, wb = this.wb;
    el.innerHTML = '';
    const objs = wb.all().slice().reverse();
    el.appendChild(C.h('div.nb-head', C.h('span', 'Pieces, top first'), C.h('small', objs.length ? objs.length + ' on the table' : '')));
    if (!objs.length) {
      el.appendChild(C.h('p.muted', 'This puzzle has no loose pieces. You can still colour cells (paint tool), name the colours to make groups, write on the board and pin notes.'));
    } else {
      const list = C.h('div.ly-list');
      objs.forEach((o, i) => {
        const selected = wb.sel.has(o.id);
        const row = C.h('div.ly-row' + (selected ? '.sel' : '') + (o.visible === false ? '.hid' : ''),
          C.h('i.ly-dot', { style: { background: o.fill || o.color || '#8f9bff' } }),
          C.h('span.ly-name', { onclick: () => { if (o.visible !== false && !o.locked) wb.select([o]); } }, o.name || C.nameOf(o, objs.length - i)),
          o.group ? C.h('span.ly-grp', { title: 'In a group' }, 'G') : null,
          C.h('input.ly-op', { type: 'range', min: 10, max: 100, value: Math.round((o.opacity == null ? 1 : o.opacity) * 100), title: 'See-through', oninput: (e) => { o.opacity = e.target.value / 100; wb.renderObj(o); }, onchange: () => wb.emit('change', { why: 'opacity' }) }),
          C.h('button.ly-btn', { type: 'button', title: o.visible === false ? 'Show' : 'Hide', html: C.icon(o.visible === false ? 'eyeoff' : 'eye'), onclick: () => wb.setVisible(o, o.visible === false) }),
          C.h('button.ly-btn', { type: 'button', title: o.locked ? 'Unlock' : 'Lock in place', html: C.icon(o.locked ? 'lock' : 'unlock'), onclick: () => wb.setLocked(o, !o.locked) }),
          C.h('button.ly-btn', { type: 'button', title: 'Up one layer', html: C.icon('up'), onclick: () => wb.zorder('forward', [o]) }),
          C.h('button.ly-btn', { type: 'button', title: 'Down one layer', html: C.icon('down'), onclick: () => wb.zorder('backward', [o]) })
        );
        list.appendChild(row);
      });
      el.appendChild(list);
    }
    const leg = Object.keys(wb.legend);
    el.appendChild(C.h('div.nb-head', C.h('span', 'Colour groups'), C.h('small', 'paint tool → name a colour')));
    if (!leg.length) el.appendChild(C.h('p.muted', 'Paint pieces or cells, then give the colour a name (for example “heavier” or “seen twice”). The named colours appear here and on the board.'));
    leg.forEach((c) => el.appendChild(C.h('div.ly-row', C.h('i.ly-dot', { style: { background: c } }), C.h('span.ly-name', { onclick: () => wb.flashColor(c) }, wb.legend[c]))));
    el.appendChild(C.h('div.nb-foot',
      C.h('button.btn.small', { type: 'button', onclick: () => wb.setXray(!wb.xray) }, 'X-ray on / off'),
      C.h('button.btn.small', { type: 'button', onclick: () => { wb.all().forEach((o) => { o.opacity = 1; o.visible = true; wb.renderObj(o); }); wb.emit('change', { why: 'visible' }); } }, 'Show everything'),
      C.h('button.btn.small', { type: 'button', onclick: () => { wb.marks = []; wb.redrawMarks(); wb.emit('change', { why: 'ink' }); } }, 'Rub out all ink')
    ));
  };

  /* ---------- keyboard ---------- */

  proto.key = function (ev) {
    const t = ev.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return false;
    const ctrl = ev.ctrlKey || ev.metaKey;
    if (ev.type === 'keydown') {
      if (ctrl && (ev.key === 'z' || ev.key === 'Z')) { if (ev.shiftKey) this.redo(); else this.undo(); return true; }
      if (ctrl && (ev.key === 'y' || ev.key === 'Y')) { this.redo(); return true; }
      // Alt + letter always reaches the tools, even on boards that take typed letters
      if (ev.altKey && ev.code && /^Key[A-Z]$/.test(ev.code)) {
        const e2 = { type: ev.type, key: ev.code.slice(3).toLowerCase(), shiftKey: ev.shiftKey, ctrlKey: false, metaKey: false, altKey: false, target: ev.target };
        if (this.wb.key(e2)) return true;
      }
      if (this.inst.key && this.inst.key(ev) === true) return true;
      if (this.wb.key(ev)) return true;
      if (ev.key === '?') { this.hint(); return true; }
      if (ev.key === 'Enter' && !this.checkBtn.hidden) { this.check(true); return true; }
      if (ev.key === 'PageDown' && !this.engine.noPageNav) { this.go(1); return true; }
      if (ev.key === 'PageUp' && !this.engine.noPageNav) { this.go(-1); return true; }
    } else if (ev.type === 'keyup') {
      if (this.inst.key && this.inst.key(ev) === true) return true;
      return this.wb.key(ev);
    }
    return false;
  };

  /* ---------- answers: typed or chosen ---------- */

  /* spec = {
   *   kind: 'number' | 'text' | 'choice' | 'multi' | 'fraction',
   *   choices: [...] (choice / multi), placeholder, unit, label,
   *   check(value) -> { ok, msg }     (the engine decides)
   * } */
  C.answerBox = function (player, spec) {
    const host = player.answerEl;
    host.innerHTML = '';
    const box = C.h('div.ans' + (spec.cls ? '.' + String(spec.cls).trim().split(/[\s.]+/).join('.') : ''));
    if (spec.label) box.appendChild(C.h('div.ans-label', { html: C.md(spec.label) }));
    let getValue, setValue;
    if (spec.kind === 'choice' || spec.kind === 'multi') {
      const multi = spec.kind === 'multi';
      const picked = new Set();
      const pics = spec.pictures || spec.choices.some((c) => /<svg/i.test(String(c)));
      const grid = C.h('div.ans-choices' + (pics ? '.pics' : spec.choices.some((c) => String(c).length > 28) ? '.long' : ''));
      spec.choices.forEach((c, i) => {
        const b = C.h('button.ans-choice', { type: 'button', html: '<b>' + String.fromCharCode(65 + i) + '</b><span>' + C.md(String(c)) + '</span>', onclick: () => {
          if (multi) { if (picked.has(i)) picked.delete(i); else picked.add(i); }
          else { picked.clear(); picked.add(i); }
          grid.querySelectorAll('.ans-choice').forEach((x, k) => x.classList.toggle('on', picked.has(k)));
          if (!multi && spec.instant !== false) submit();
        } });
        grid.appendChild(b);
      });
      box.appendChild(grid);
      getValue = () => (multi ? Array.from(picked).sort((a, b) => a - b) : (picked.size ? Array.from(picked)[0] : null));
      setValue = (v) => {
        picked.clear();
        (Array.isArray(v) ? v : [v]).forEach((i) => picked.add(i));
        grid.querySelectorAll('.ans-choice').forEach((x, k) => x.classList.toggle('on', picked.has(k)));
      };
      if (multi || spec.instant === false) box.appendChild(C.h('div.ans-gorow',
        C.h('button.btn.primary.ans-go', { type: 'button', onclick: () => submit() }, 'Answer'),
        multi && spec.allowNone ? C.h('button.btn.ghost.ans-go', { type: 'button', title: 'None of the choices', onclick: () => { picked.clear(); grid.querySelectorAll('.ans-choice').forEach((x) => x.classList.remove('on')); submit(); } }, 'None of them') : null));
    } else {
      const inp = C.h('input.ans-in', { type: 'text', inputmode: spec.kind === 'number' ? 'decimal' : 'text', placeholder: spec.placeholder || (spec.kind === 'number' ? 'Your answer (a number)' : 'Your answer'), autocomplete: 'off', spellcheck: 'false' });
      inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') submit(); });
      const row = C.h('div.ans-row', inp, spec.unit ? C.h('span.ans-unit', spec.unit) : null, C.h('button.btn.primary', { type: 'button', onclick: () => submit() }, 'Answer'));
      box.appendChild(row);
      getValue = () => inp.value;
      setValue = (v) => { inp.value = String(v); };
      box.focusInput = () => inp.focus();
    }
    const fb = C.h('div.ans-fb');
    box.appendChild(fb);
    host.appendChild(box);
    // a puzzle answered before shows its answer again when reopened
    if (player.saved && player.saved.solved && player.saved.ans != null) {
      try { setValue(player.saved.ans); } catch (e) { /* the choices changed */ }
      fb.className = 'ans-fb good';
      fb.textContent = 'You answered this one before.';
      box.classList.add('done');
      player.answered = player.saved.ans;
    }
    function submit() {
      const v = getValue();
      if (v == null || v === '' || (Array.isArray(v) && !v.length && !spec.allowNone)) { fb.textContent = 'Give an answer first.'; fb.className = 'ans-fb warn'; return; }
      const r = spec.check(v) || {};
      if (r.ok) {
        fb.className = 'ans-fb good';
        fb.innerHTML = C.md(r.msg || 'Right!');
        box.classList.add('done');
        player.answered = v;
        player.onSolved({ msg: r.msg, stars: r.stars, perfect: r.perfect });
      } else {
        fb.className = 'ans-fb warn';
        fb.innerHTML = C.md(r.msg || 'Not that.') + (C.settings.quips ? ' <span class="quip">' + C.quip('wrong') + '</span>' : '');
        C.sfx('wrong');
        box.classList.remove('shake'); void box.offsetWidth; box.classList.add('shake');
      }
    }
    return { el: box, submit, feedback: (html, kind) => { fb.className = 'ans-fb ' + (kind || ''); fb.innerHTML = html; } };
  };

  /* ---------- a confirm card on the page (the browser's dialog looks out of place) ---------- */
  C.confirmCard = function (host, o) {
    return new Promise((resolve) => {
      const card = C.h('div.pz-howto.pz-confirm',
        C.h('div.pz-howto-card',
          C.h('h3', o.title),
          o.text ? C.h('p.muted', o.text) : null,
          C.h('div.row', { style: { display: 'flex', gap: '8px', justifyContent: 'center' } },
            C.h('button.btn.ghost', { type: 'button', onclick: () => { card.remove(); resolve(false); } }, o.cancel || 'Cancel'),
            C.h('button.btn.primary', { type: 'button', onclick: () => { card.remove(); resolve(true); } }, o.ok || 'OK'))));
      (host || root.document.body).appendChild(card);
      const b = card.querySelector('.btn.primary');
      if (b) b.focus();
    });
  };

  /* ---------- a number pad for touch screens (and mice) ----------
   * C.numberPad({ keys: [1, 2, … 9, 0, 'clear'], onKey(k), cols: 5, label }) -> element
   * keys may be numbers, strings, or { k, label, cls } */
  C.numberPad = function (opts) {
    opts = opts || {};
    const keys = opts.keys || [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'clear'];
    const pad = C.h('div.numpad', { style: { gridTemplateColumns: 'repeat(' + (opts.cols || 6) + ', 1fr)' } });
    if (opts.label) pad.appendChild(C.h('div.numpad-label', { style: { gridColumn: '1 / -1' } }, opts.label));
    keys.forEach((k) => {
      const key = typeof k === 'object' ? k.k : k;
      const label = typeof k === 'object' ? k.label : (key === 'clear' ? '⌫' : String(key));
      const b = C.h('button.numpad-key' + (typeof k === 'object' && k.cls ? '.' + k.cls : '') + (key === 'clear' ? '.clear' : ''), { type: 'button', title: key === 'clear' ? 'Rub out' : String(label) }, label);
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); if (opts.onKey) opts.onKey(key); });
      pad.appendChild(b);
    });
    return pad;
  };

  /* ---------- small shared bits ---------- */

  C.nameOf = function (o, n) {
    const k = o.kind || o.type || 'piece';
    return k.charAt(0).toUpperCase() + k.slice(1) + ' ' + n;
  };

  /* Saved games: only the most recent MAX_SAVES are kept. A small index of save
   * times ('stidx') makes pruning cheap — the saved games themselves are never
   * read to find the old ones. Your solved/seen record ('done') is separate and
   * is never pruned. */
  const MAX_SAVES = 200;
  let saveIdx = null;
  function loadIdx() {
    if (saveIdx) return saveIdx;
    saveIdx = C.store.get('stidx', null);
    if (!saveIdx) { // first use, or older saves without an index: list them once
      saveIdx = {};
      C.store.keys().forEach((k) => { if (k.startsWith('st:')) saveIdx[k.slice(3)] = 0; });
    }
    return saveIdx;
  }
  C.noteSave = function (id) {
    const idx = loadIdx();
    idx[id] = Date.now();
    const ids = Object.keys(idx);
    if (ids.length > MAX_SAVES) {
      ids.sort((a, b) => idx[a] - idx[b]).slice(0, ids.length - Math.round(MAX_SAVES * 0.9)).forEach((old) => {
        if (old === id) return;
        C.store.del('st:' + old);
        delete idx[old];
      });
    }
    C.store.set('stidx', idx);
  };
  C.pruneSaves = function (n) {
    const idx = loadIdx();
    Object.keys(idx).sort((a, b) => idx[a] - idx[b]).slice(0, n).forEach((old) => { C.store.del('st:' + old); delete idx[old]; });
    C.store.set('stidx', idx);
  };

  // how to play: the family's own text, else the engine's (a string, or a function of the puzzle and family)
  C.aboutOf = function (engine, meta, p) {
    if (meta && meta.about) return meta.about;
    if (typeof engine.about === 'function') { try { return engine.about(p, meta); } catch (e) { return ''; } }
    return engine.about || '';
  };
  C.helpHTML = function (engine, meta, p) {
    let s = '';
    const about = C.aboutOf(engine, meta, p);
    if (about) s += '<h4>' + C.esc(meta.about ? meta.name : (engine.name || meta.name)) + '</h4><div class="howto">' + C.md(about) + '</div>';
    if (meta.origin && (meta.origin.note || meta.origin.who)) {
      s += '<h4>Where it comes from</h4><p>' + C.md((meta.origin.who ? '**' + meta.origin.who + '**' + (meta.origin.year != null ? ', ' + C.fmtYear(meta.origin.year) : '') + '. ' : '') + (meta.origin.note || '')) + '</p>';
    }
    s += '<h4>Your tools</h4><div class="keysheet">' + [
      ['Drag', 'move a piece; drag on the table to select several'],
      ['R / Shift+R', 'turn the selected pieces (or the round handle)'],
      ['X / Shift+F', 'turn a piece over'],
      ['[ ] / Shift', 'send back or bring forward (Shift: all the way)'],
      ['Ctrl+G', 'group the selected pieces; Ctrl+Shift+G to ungroup'],
      ['B', 'paint: colour pieces and cells, name a colour to make a group'],
      ['P / M / E', 'pen, highlighter, eraser'],
      ['N', 'a sticky note'],
      ['C / F', 'knife and fold (in puzzles that allow them)'],
      ['Shift+X / L', 'x-ray and the magnifying glass'],
      ['Wheel, + / − / 0', 'zoom, fit; drag with Space or the right button to pan'],
      ['Ctrl+Z / Ctrl+Y', 'undo and redo'],
      ['Alt + letter', 'the tool keys, on boards where you type letters'],
      ['?', 'a hint · Enter: check · PgUp / PgDn: previous / next']
    ].map((r) => '<kbd>' + r[0] + '</kbd><span>' + r[1] + '</span>').join('') + '</div>';
    return s;
  };
})(typeof window !== 'undefined' ? window : globalThis);
