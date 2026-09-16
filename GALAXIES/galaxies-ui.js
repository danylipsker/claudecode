/*  GALAXIES — user interface
 *  Board rendering, input, generator worker, hints, timer, statistics,
 *  dialogs and persistence.  Depends on galaxies-core.js.
 */
(function () {
  'use strict';

  const core = GalaxiesCore();
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const LS_GAME = 'galaxies.v1.game';
  const LS_SETTINGS = 'galaxies.v1.settings';
  const LS_STATS = 'galaxies.v1.stats';
  const DIFF_LABEL = { easy: 'Easy', normal: 'Normal', hard: 'Hard', unreasonable: 'Unreasonable' };
  const HUES = [212, 28, 150, 285, 52, 335, 185, 100, 245, 12];
  const DAILY = { W: 10, H: 10, difficulty: 'normal' };

  function loadJSON(key) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch (e) { return null; } }
  function saveJSON(key, obj) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { /* storage unavailable */ } }

  const settings = Object.assign({
    theme: 'auto', prefillCores: false, autoCheck: false, showTimer: true, hoverMirror: true,
    tool: 'paint', size: '10x10', customW: 12, customH: 12, difficulty: 'normal'
  }, loadJSON(LS_SETTINGS) || {});
  const stats = Object.assign({ byKey: {}, daily: {}, total: 0 }, loadJSON(LS_STATS) || {});

  /* ------------------------------------------------------------------ */
  /*  DOM                                                                 */
  /* ------------------------------------------------------------------ */

  const canvas = $('#board');
  const ctx = canvas.getContext('2d');
  const stage = $('#stage');
  const toastEl = $('#toast');
  const ui = {
    undo: $('#btnUndo'), redo: $('#btnRedo'), hint: $('#btnHint'), check: $('#btnCheck'),
    timer: $('#stTimer'), size: $('#stSize'), rating: $('#stRating'), progText: $('#stProgressText'),
    progBar: $('#stProgressBar'), source: $('#stSource'),
    genOverlay: $('#genOverlay'), genTitle: $('#genTitle'), genSub: $('#genSub'), genBar: $('#genBar'),
    pauseOverlay: $('#pauseOverlay'), menu: $('#menu')
  };

  /* ------------------------------------------------------------------ */
  /*  Game state                                                          */
  /* ------------------------------------------------------------------ */

  const game = {
    p: null, solution: null, colors: null, rating: 'normal', id: '', origin: { kind: 'random' },
    owner: null, fixed: null, walls: new Set(),
    history: [], future: [],
    elapsed: 0, lastTick: 0, running: false, solved: false, revealed: false, paused: false,
    brush: -1, analysis: null, mistakes: null, hint: null, invalidFlash: null,
    anim: new Map(), particles: null
  };
  let geo = { cell: 40, ox: 20, oy: 20, cw: 0, ch: 0 };
  let hover = null;          // { cell, edge, dot }
  let stroke = null;
  let theme = { s: 62, l: 84, ss: 66, ls: 74 };
  let rafPending = false;

  /* ------------------------------------------------------------------ */
  /*  Theme & colours                                                     */
  /* ------------------------------------------------------------------ */

  function applyTheme() {
    if (settings.theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', settings.theme);
    const cs = getComputedStyle(document.documentElement);
    const pct = (name, dflt) => { const v = parseFloat(cs.getPropertyValue(name)); return isNaN(v) ? dflt : v; };
    theme = { s: pct('--gal-s', 62), l: pct('--gal-l', 84), ss: pct('--gal-s-settled', 66), ls: pct('--gal-l-settled', 74) };
    requestDraw();
  }
  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
  function galaxyColor(g, settled) {
    const h = HUES[game.colors[g] % HUES.length];
    return settled ? `hsl(${h} ${theme.ss}% ${theme.ls}%)` : `hsl(${h} ${theme.s}% ${theme.l}%)`;
  }
  function galaxyInk(g) {
    const h = HUES[game.colors[g] % HUES.length];
    const dark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') && matchMedia('(prefers-color-scheme: dark)').matches);
    return dark ? `hsl(${h} 70% 68%)` : `hsl(${h} 60% 38%)`;
  }

  /* ------------------------------------------------------------------ */
  /*  Puzzle set-up                                                       */
  /* ------------------------------------------------------------------ */

  function setPuzzle(spec, saved) {
    const p = core.makePuzzle(spec.W, spec.H, spec.dots);
    let solution = spec.solution;
    let ambiguous = false;
    if (!solution) {
      const res = core.solve(p, { limit: 2 });
      if (res.count === 0) throw new Error('This puzzle has no solution');
      ambiguous = res.count > 1;
      solution = Array.from(res.solutions[0]);
    }
    game.p = p; game.solution = solution;
    game.colors = core.assignColors(p, HUES.length);
    game.rating = spec.rating || (ambiguous ? 'ambiguous' : core.rate(p));
    game.id = spec.id || core.encodeId(spec.W, spec.H, spec.dots);
    game.origin = spec.origin || { kind: 'code' };
    game.owner = new Int16Array(p.N).fill(-1);
    game.fixed = new Uint8Array(p.N);
    if (saved) {
      saved.owner.forEach((v, i) => { game.owner[i] = v; });
      saved.fixed.forEach((v, i) => { game.fixed[i] = v; });
      game.walls = new Set(saved.walls);
      game.elapsed = saved.elapsed || 0;
      game.solved = !!saved.solved; game.revealed = !!saved.revealed;
    } else {
      game.walls = new Set();
      if (settings.prefillCores) for (let g = 0; g < p.G; g++) for (const c of p.cores[g]) { game.owner[c] = g; game.fixed[c] = 1; }
      game.elapsed = 0; game.solved = false; game.revealed = false;
    }
    game.history = []; game.future = [];
    game.brush = -1; game.hint = null; game.mistakes = null; game.anim.clear(); game.particles = null;
    game.paused = false; ui.pauseOverlay.classList.remove('show');
    hideToast();
    const dlg = document.getElementById('dlgSolved'); if (dlg.open) dlg.close();
    game.running = !game.solved;
    game.lastTick = performance.now();
    refreshAnalysis(false);
    if (ambiguous) toast('Heads-up: this puzzle has more than one solution. Any valid division will be accepted.', { timeout: 6000 });
    fitBoard();
    updateStatus();
    updateHash();
    save();
  }

  function refreshAnalysis(checkSolved) {
    game.analysis = core.analyze(game.p, game.owner, game.walls);
    if (settings.autoCheck) game.mistakes = core.findMistakes(game.p, game.solution, game.owner, game.walls);
    else if (game.mistakes && !stroke) game.mistakes = null;
    updateStatus();
    if (checkSolved && game.analysis.solved && !game.solved) onSolved();
  }

  function save() {
    if (!game.p) return;
    saveJSON(LS_GAME, {
      id: game.id, rating: game.rating, origin: game.origin, solution: game.solution,
      owner: Array.from(game.owner), fixed: Array.from(game.fixed), walls: Array.from(game.walls),
      elapsed: Math.round(game.elapsed), solved: game.solved, revealed: game.revealed, savedAt: Date.now()
    });
  }
  function saveSettings() { saveJSON(LS_SETTINGS, settings); }
  function saveStats() { saveJSON(LS_STATS, stats); }

  function restoreSaved() {
    const s = loadJSON(LS_GAME);
    if (!s || !s.id) return false;
    try {
      const d = core.decodeId(s.id);
      if (!s.solution || s.solution.length !== d.W * d.H || s.owner.length !== d.W * d.H) return false;
      setPuzzle({ W: d.W, H: d.H, dots: d.dots, solution: s.solution, rating: s.rating, id: s.id, origin: s.origin }, s);
      return true;
    } catch (e) { return false; }
  }

  function updateHash() {
    const h = game.origin.kind === 'daily' ? '#daily=' + game.origin.date : '#id=' + game.id;
    if (location.hash !== h) history.replaceState(null, '', h);
  }

  /* ------------------------------------------------------------------ */
  /*  Generation (worker with synchronous fallback)                       */
  /* ------------------------------------------------------------------ */

  let worker = null, genReq = 0, genActive = null, workerUsable = true;

  function buildWorker() {
    const src = `const core = (${GalaxiesCore.toString()})();
self.onmessage = (e) => {
  const m = e.data; if (m.type !== 'generate') return;
  let last = 0;
  const result = core.generate({ W: m.W, H: m.H, difficulty: m.difficulty, seed: m.seed,
    onProgress: (a, n) => { const t = Date.now(); if (t - last > 100) { last = t; self.postMessage({ type: 'progress', req: m.req, attempt: a, of: n }); } } });
  self.postMessage({ type: 'done', req: m.req, result });
};`;
    const w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    return w;
  }

  function generateAsync(W, H, difficulty, seed, onProgress) {
    const req = ++genReq;
    return new Promise((resolve, reject) => {
      // Generating on the page freezes it, so it runs in a worker. Workers are
      // blocked when the page is opened straight from disk (file://), so fall
      // back to generating here and let the overlay sit still for a moment.
      const onPage = () => setTimeout(() => {
        try { resolve(core.generate({ W, H, difficulty, seed, onProgress })); } catch (e) { reject(e); }
      }, 40);
      let w = null;
      if (workerUsable) { try { w = worker || (worker = buildWorker()); } catch (e) { w = null; workerUsable = false; } }
      if (!w) { onPage(); return; }
      let settled = false;
      const handler = (e) => {
        const m = e.data; if (m.req !== req) return;
        if (m.type === 'progress') { onProgress && onProgress(m.attempt, m.of); return; }
        settled = true;
        w.removeEventListener('message', handler);
        if (genActive && genActive.req === req) genActive = null;
        resolve(m.result);
      };
      w.addEventListener('message', handler);
      w.addEventListener('error', () => {
        if (settled) return;
        settled = true;
        workerUsable = false;
        try { w.terminate(); } catch (e) { /* already gone */ }
        worker = null;
        if (genActive && genActive.req === req) genActive = null;
        if (genReq === req) onPage();
      }, { once: true });
      genActive = { req, worker: w };
      w.postMessage({ type: 'generate', req, W, H, difficulty, seed });
    });
  }

  function cancelGeneration() {
    if (genActive) { try { genActive.worker.terminate(); } catch (e) { /* ignore */ } worker = null; genActive = null; }
    genReq++;
    ui.genOverlay.classList.remove('show');
  }

  async function newPuzzle(W, H, difficulty, origin, seed) {
    const req = genReq + 1;
    ui.genTitle.textContent = `Generating ${W}×${H} · ${DIFF_LABEL[difficulty]}`;
    ui.genSub.textContent = origin.kind === 'daily' ? `Daily puzzle for ${origin.date}` : 'Searching for a puzzle with a single solution…';
    ui.genBar.style.width = '4%';
    ui.genOverlay.classList.add('show');
    const t0 = performance.now();
    try {
      const res = await generateAsync(W, H, difficulty, seed, (a, n) => {
        ui.genBar.style.width = Math.max(4, Math.min(96, 100 * a / n)) + '%';
        ui.genSub.textContent = `Attempt ${a} of up to ${n}…`;
      });
      if (genReq !== req) return;              // cancelled or superseded
      if (!res) throw new Error('Could not build a puzzle of that size. Try a smaller grid.');
      ui.genOverlay.classList.remove('show');
      setPuzzle({ W: res.W, H: res.H, dots: res.dots, solution: res.solution, rating: res.rating, id: res.id, origin: Object.assign({ seed: res.seed, wanted: difficulty }, origin) });
      const elapsed = performance.now() - t0;
      if (res.rating !== difficulty) toast(`Closest match found: this one rates ${DIFF_LABEL[res.rating]}.`, { timeout: 4500 });
      else if (elapsed > 1500) toast(`Ready: ${W}×${H} ${DIFF_LABEL[res.rating]}.`, { timeout: 2000 });
    } catch (e) {
      ui.genOverlay.classList.remove('show');
      toast('Generation failed: ' + (e.message || e), { timeout: 5000 });
    }
  }

  function dateKey(d) {
    const dt = d || new Date();
    return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0');
  }
  function loadDaily(date) {
    const key = date || dateKey();
    if (game.p && game.origin.kind === 'daily' && game.origin.date === key) { toast("You're already on today's puzzle."); return; }
    newPuzzle(DAILY.W, DAILY.H, DAILY.difficulty, { kind: 'daily', date: key }, 'galaxies-daily-' + key);
  }

  /* ------------------------------------------------------------------ */
  /*  Layout & drawing                                                    */
  /* ------------------------------------------------------------------ */

  function fitBoard() {
    if (!game.p) return;
    const r = stage.getBoundingClientRect();
    const availW = Math.max(120, r.width - 28), availH = Math.max(120, r.height - 28);
    const { W, H } = game.p;
    const pad = 0.55;
    const cell = Math.max(12, Math.floor(Math.min(availW / (W + 2 * pad), availH / (H + 2 * pad))));
    geo = { cell, ox: Math.round(cell * pad), oy: Math.round(cell * pad), cw: Math.round(cell * (W + 2 * pad)), ch: Math.round(cell * (H + 2 * pad)) };
    canvas.style.width = geo.cw + 'px'; canvas.style.height = geo.ch + 'px';
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(geo.cw * dpr); canvas.height = Math.round(geo.ch * dpr);
    requestDraw();
  }

  function requestDraw() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame((t) => { rafPending = false; draw(t); });
  }

  function cellRect(c) {
    const { W } = game.p;
    return { x: geo.ox + (c % W) * geo.cell, y: geo.oy + ((c / W) | 0) * geo.cell, s: geo.cell };
  }

  function drawStar(x, y, r, color) {
    ctx.save(); ctx.translate(x, y); ctx.fillStyle = color; ctx.beginPath();
    for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = (i % 2 === 0) ? r : r * 0.42; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.fill(); ctx.restore();
  }

  function draw(now) {
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, geo.cw, geo.ch);
    if (!game.p) return;
    const p = game.p, { W, H, N } = p, cell = geo.cell, a = game.analysis;
    const ink = cssVar('--wall') || '#1d2233', gridCol = cssVar('--grid') || '#ccc', accent = cssVar('--accent') || '#3b5bdb';
    const danger = cssVar('--danger') || '#d6455d', bgBoard = cssVar('--bg-board') || '#fff';
    let animating = false;

    if (game.paused && !game.solved) {
      ctx.fillStyle = gridCol; ctx.globalAlpha = 0.25;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if ((x + y) & 1) ctx.fillRect(geo.ox + x * cell, geo.oy + y * cell, cell, cell);
      ctx.globalAlpha = 1;
      return;
    }

    // cells
    for (let c = 0; c < N; c++) {
      const r = a.regionOf[c], settled = !!a.valid[r];
      const g = settled ? a.regionDot[r] : game.owner[c];
      if (g < 0) continue;
      const rc = cellRect(c);
      let scale = 1;
      const t0 = game.anim.get(c);
      if (t0 !== undefined) {
        const k = (now - t0) / 180;
        if (k >= 1) game.anim.delete(c); else { scale = 0.55 + 0.45 * (1 - Math.pow(1 - k, 3)); animating = true; }
      }
      ctx.fillStyle = galaxyColor(g, settled);
      if (scale < 1) { const s = rc.s * scale, o = (rc.s - s) / 2; ctx.fillRect(rc.x + o, rc.y + o, s, s); }
      else ctx.fillRect(rc.x, rc.y, rc.s, rc.s);
      if (game.fixed[c] && !settled) {
        ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(rc.x, rc.y, rc.s, rc.s);
      }
    }

    // mistakes
    if (game.mistakes && game.mistakes.cells.size) {
      ctx.save(); ctx.strokeStyle = danger; ctx.lineWidth = Math.max(1.5, cell * 0.06); ctx.globalAlpha = 0.85;
      for (const c of game.mistakes.cells) {
        const rc = cellRect(c);
        ctx.fillStyle = danger; ctx.globalAlpha = 0.18; ctx.fillRect(rc.x, rc.y, rc.s, rc.s); ctx.globalAlpha = 0.85;
        const m = rc.s * 0.3;
        ctx.beginPath(); ctx.moveTo(rc.x + m, rc.y + m); ctx.lineTo(rc.x + rc.s - m, rc.y + rc.s - m);
        ctx.moveTo(rc.x + rc.s - m, rc.y + m); ctx.lineTo(rc.x + m, rc.y + rc.s - m); ctx.stroke();
      }
      ctx.restore();
    }

    // hover preview
    if (hover && !stroke && !game.solved) {
      if (hover.cell >= 0 && game.tool === 'paint' && game.brush >= 0 && settings.hoverMirror) {
        const m = p.mirror[game.brush * N + hover.cell];
        const rc = cellRect(hover.cell);
        ctx.save(); ctx.lineWidth = Math.max(2, cell * 0.07);
        if (m >= 0 && !(game.fixed[hover.cell] && game.owner[hover.cell] !== game.brush)) {
          ctx.strokeStyle = galaxyInk(game.brush); ctx.globalAlpha = 0.9;
          ctx.strokeRect(rc.x + 2, rc.y + 2, rc.s - 4, rc.s - 4);
          if (m !== hover.cell) { const rm = cellRect(m); ctx.setLineDash([cell * 0.12, cell * 0.1]); ctx.strokeRect(rm.x + 2, rm.y + 2, rm.s - 4, rm.s - 4); }
        } else {
          ctx.strokeStyle = danger; ctx.globalAlpha = 0.8; ctx.strokeRect(rc.x + 2, rc.y + 2, rc.s - 4, rc.s - 4);
          ctx.beginPath(); ctx.arc(rc.x + rc.s / 2, rc.y + rc.s / 2, rc.s * 0.22, 0, Math.PI * 2); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(rc.x + rc.s * 0.35, rc.y + rc.s * 0.65); ctx.lineTo(rc.x + rc.s * 0.65, rc.y + rc.s * 0.35); ctx.stroke();
        }
        ctx.restore();
      } else if (hover.edge >= 0 && (game.tool === 'wall' || game.tool === 'erase')) {
        ctx.save(); ctx.strokeStyle = accent; ctx.globalAlpha = 0.55; ctx.lineWidth = Math.max(3, cell * 0.12); ctx.lineCap = 'round';
        edgePath(hover.edge); ctx.stroke(); ctx.restore();
      } else if (hover.cell >= 0 && game.tool === 'erase' && game.owner[hover.cell] >= 0 && !game.fixed[hover.cell]) {
        const rc = cellRect(hover.cell);
        ctx.save(); ctx.strokeStyle = danger; ctx.globalAlpha = 0.7; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.strokeRect(rc.x + 2, rc.y + 2, rc.s - 4, rc.s - 4); ctx.restore();
      }
    }
    if (game.invalidFlash && now - game.invalidFlash.t < 350) {
      const rc = cellRect(game.invalidFlash.cell); const k = (now - game.invalidFlash.t) / 350;
      ctx.save(); ctx.globalAlpha = 0.5 * (1 - k); ctx.fillStyle = danger; ctx.fillRect(rc.x, rc.y, rc.s, rc.s); ctx.restore();
      animating = true;
    }

    // grid
    ctx.save(); ctx.strokeStyle = gridCol; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0; x <= W; x++) { const px = geo.ox + x * cell + 0.5; ctx.moveTo(px, geo.oy); ctx.lineTo(px, geo.oy + H * cell); }
    for (let y = 0; y <= H; y++) { const py = geo.oy + y * cell + 0.5; ctx.moveTo(geo.ox, py); ctx.lineTo(geo.ox + W * cell, py); }
    ctx.stroke(); ctx.restore();

    // walls (user + paint boundaries)
    const wallW = Math.max(3, cell * 0.11);
    ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = wallW;
    const bad = game.mistakes ? game.mistakes.walls : null;
    ctx.beginPath(); ctx.strokeStyle = ink;
    const badEdges = [];
    for (let c = 0; c < N; c++) {
      const x = c % W, y = (c / W) | 0;
      for (let k = 0; k < 2; k++) {
        const e = 2 * c + k;
        const nb = k === 0 ? (x + 1 < W ? c + 1 : -1) : (y + 1 < H ? c + W : -1);
        if (nb < 0) continue;
        const user = game.walls.has(e);
        const painted = game.owner[c] >= 0 && game.owner[nb] >= 0 && game.owner[c] !== game.owner[nb];
        const regionEdge = a.regionOf[c] !== a.regionOf[nb];
        if (!user && !painted && !regionEdge) continue;
        if ((bad && bad.has(e)) || a.innerWalls.has(e)) { badEdges.push(e); continue; }
        edgePath(e);
      }
    }
    ctx.stroke();
    if (badEdges.length) { ctx.beginPath(); ctx.strokeStyle = danger; for (const e of badEdges) edgePath(e); ctx.stroke(); }
    // outer border
    ctx.strokeStyle = ink; ctx.lineJoin = 'round';
    ctx.strokeRect(geo.ox, geo.oy, W * cell, H * cell);
    ctx.restore();

    // hint highlight
    if (game.hint) {
      const h = game.hint, k = (Math.sin(now / 260) + 1) / 2;
      ctx.save(); ctx.lineWidth = Math.max(2.5, cell * 0.09); ctx.strokeStyle = accent; ctx.globalAlpha = 0.55 + 0.45 * k;
      if (h.edge != null && h.edge >= 0) { ctx.strokeStyle = danger; ctx.lineCap = 'round'; edgePath(h.edge); ctx.stroke(); }
      if (h.cell != null && h.cell >= 0) {
        if (h.kind === 'wrongCell') ctx.strokeStyle = danger;
        const rc = cellRect(h.cell); ctx.strokeRect(rc.x + 3, rc.y + 3, rc.s - 6, rc.s - 6);
        if (h.mirror != null && h.mirror >= 0 && h.mirror !== h.cell) { const rm = cellRect(h.mirror); ctx.setLineDash([cell * 0.12, cell * 0.1]); ctx.strokeRect(rm.x + 3, rm.y + 3, rm.s - 6, rm.s - 6); ctx.setLineDash([]); }
        if (h.target != null && h.target >= 0) { const rt = cellRect(h.target); ctx.setLineDash([2, 3]); ctx.strokeRect(rt.x + 5, rt.y + 5, rt.s - 10, rt.s - 10); ctx.setLineDash([]); }
      }
      ctx.restore();
      animating = true;
    }

    // dots
    const rDot = Math.max(3.5, cell * 0.17);
    for (let g = 0; g < p.G; g++) {
      const d = p.dots[g];
      const px = geo.ox + d.x * cell / 2, py = geo.oy + d.y * cell / 2;
      const cut = a.cutDots[g];
      const settledG = a.valid[a.regionOf[p.cores[g][0]]] && a.regionDot[a.regionOf[p.cores[g][0]]] === g;
      ctx.beginPath(); ctx.arc(px, py, rDot + Math.max(1.5, cell * 0.05), 0, Math.PI * 2);
      ctx.fillStyle = bgBoard; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(px, py, rDot, 0, Math.PI * 2);
      ctx.fillStyle = cut ? danger : (settledG ? galaxyInk(g) : ink); ctx.fill();
      if (settledG) { ctx.beginPath(); ctx.arc(px, py, rDot * 0.42, 0, Math.PI * 2); ctx.fillStyle = bgBoard; ctx.fill(); }
      if (g === game.brush && !game.solved) {
        const k = (Math.sin(now / 220) + 1) / 2;
        ctx.beginPath(); ctx.arc(px, py, rDot + Math.max(3, cell * 0.12) + k * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = galaxyInk(g); ctx.lineWidth = Math.max(2, cell * 0.06); ctx.stroke();
        animating = true;
      }
      if (game.hint && game.hint.galaxy === g) {
        ctx.beginPath(); ctx.arc(px, py, rDot + Math.max(4, cell * 0.16), 0, Math.PI * 2);
        ctx.strokeStyle = accent; ctx.lineWidth = Math.max(2, cell * 0.05); ctx.setLineDash([3, 3]); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    // celebration
    if (game.particles) {
      const ps = game.particles, dt = now - ps.t0;
      if (dt < 2600) {
        for (const q of ps.list) {
          const t = Math.max(0, dt - q.delay) / 1000; if (t <= 0) continue;
          const x = q.x + q.vx * t, y = q.y + q.vy * t + 160 * t * t;
          const life = Math.max(0, 1 - t / q.life);
          if (life <= 0) continue;
          ctx.globalAlpha = life;
          drawStar(x, y, q.r * (0.6 + 0.4 * life), q.color);
        }
        ctx.globalAlpha = 1; animating = true;
      } else game.particles = null;
    }

    if (animating) requestDraw();
  }

  function edgePath(e) {
    const { W } = game.p, c = e >> 1, x = c % W, y = (c / W) | 0, cell = geo.cell;
    if (e & 1) { const py = geo.oy + (y + 1) * cell; ctx.moveTo(geo.ox + x * cell, py); ctx.lineTo(geo.ox + (x + 1) * cell, py); }
    else { const px = geo.ox + (x + 1) * cell; ctx.moveTo(px, geo.oy + y * cell); ctx.lineTo(px, geo.oy + (y + 1) * cell); }
  }

  /* ------------------------------------------------------------------ */
  /*  Hit testing                                                         */
  /* ------------------------------------------------------------------ */

  function boardPos(ev) {
    const r = canvas.getBoundingClientRect();
    return { fx: (ev.clientX - r.left - geo.ox) / geo.cell, fy: (ev.clientY - r.top - geo.oy) / geo.cell };
  }
  function hitDot(fx, fy, coarse) {
    const p = game.p, rr = coarse ? 0.5 : 0.34; let best = -1, bd = rr * rr;
    for (let g = 0; g < p.G; g++) {
      const dx = fx - p.dots[g].x / 2, dy = fy - p.dots[g].y / 2, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = g; }
    }
    return best;
  }
  function hitCell(fx, fy) {
    const { W, H } = game.p, x = Math.floor(fx), y = Math.floor(fy);
    return (x >= 0 && x < W && y >= 0 && y < H) ? y * W + x : -1;
  }
  /**
   * Nearest grid line to a point. `prefer` biases the choice while dragging:
   * 'v' for a vertical line (a sideways boundary), 'h' for a horizontal one,
   * so a long straight drag keeps following the line it started on.
   */
  function hitEdge(fx, fy, band, prefer) {
    const { W, H } = game.p, b = band || 0.22;
    const rx = Math.round(fx), ry = Math.round(fy);
    const dv = Math.abs(fx - rx), dh = Math.abs(fy - ry);
    const x = Math.floor(fx), y = Math.floor(fy);
    const vEdge = (dv < b && rx >= 1 && rx <= W - 1 && y >= 0 && y < H) ? 2 * (y * W + rx - 1) : -1;
    const hEdge = (dh < b && ry >= 1 && ry <= H - 1 && x >= 0 && x < W) ? 2 * ((ry - 1) * W + x) + 1 : -1;
    if (prefer === 'v' && vEdge >= 0) return vEdge;
    if (prefer === 'h' && hEdge >= 0) return hEdge;
    if (vEdge >= 0 && (hEdge < 0 || dv <= dh)) return vEdge;
    return hEdge;
  }

  /* ------------------------------------------------------------------ */
  /*  Moves                                                               */
  /* ------------------------------------------------------------------ */

  function snapshot() { return { owner: game.owner.slice(), walls: Array.from(game.walls) }; }
  function restore(s) { game.owner = s.owner.slice(); game.walls = new Set(s.walls); }

  function beginStroke(kind, g) {
    stroke = { kind, g, touched: new Set(), changed: false, before: snapshot(), last: null, start: null };
    canvas.classList.add('dragging');
  }
  function endStroke() {
    if (!stroke) return;
    const s = stroke; stroke = null;
    canvas.classList.remove('dragging');
    if (s.changed) commit(s.before);
    else if (s.fromDot && s.wasBrush) { selectBrush(-1, true); toast('Brush dropped. Click any dot to pick a galaxy again.', { timeout: 1600 }); }
    requestDraw();
  }

  function syncDuringStroke() {
    game.analysis = core.analyze(game.p, game.owner, game.walls);
    if (settings.autoCheck) game.mistakes = core.findMistakes(game.p, game.solution, game.owner, game.walls);
  }
  function commit(before) {
    game.history.push(before); if (game.history.length > 400) game.history.shift();
    game.future.length = 0;
    game.hint = null; hideToast();
    if (!settings.autoCheck) game.mistakes = null;
    if (!game.running && !game.solved) { game.running = true; game.lastTick = performance.now(); }
    refreshAnalysis(true);
    save(); updateButtons(); requestDraw();
  }

  function clearPartner(c, h) {
    const p = game.p, m = p.mirror[h * p.N + c];
    if (m >= 0 && m !== c && game.owner[m] === h && !game.fixed[m]) game.owner[m] = -1;
  }
  function paintCell(c, g, now) {
    const p = game.p;
    if (game.fixed[c] && game.owner[c] !== g) return false;
    const m = p.mirror[g * p.N + c];
    if (m < 0) { game.invalidFlash = { cell: c, t: now }; return false; }
    if (game.fixed[m] && game.owner[m] !== g) { game.invalidFlash = { cell: c, t: now }; return false; }
    if (game.owner[c] === g && game.owner[m] === g) return false;
    for (const k of [c, m]) {
      const h = game.owner[k];
      if (h === g) continue;
      if (h >= 0) clearPartner(k, h);
      game.owner[k] = g; game.anim.set(k, now);
    }
    return true;
  }
  function eraseCell(c) {
    if (game.fixed[c]) return false;
    const h = game.owner[c];
    if (h < 0) return false;
    game.owner[c] = -1; clearPartner(c, h);
    return true;
  }

  function applyAt(fx, fy, now) {
    if (!stroke) return;
    const s = stroke;
    if (s.kind === 'paint' || s.kind === 'erase') {
      const c = hitCell(fx, fy);
      if (c < 0 || s.touched.has(c)) return;
      s.touched.add(c);
      const ok = s.kind === 'paint' ? paintCell(c, s.g, now) : eraseCell(c);
      if (ok) { s.changed = true; syncDuringStroke(); }
      requestDraw();
    } else {
      let prefer = null;
      if (s.start) {
        const dx = fx - s.start.fx, dy = fy - s.start.fy;
        if (Math.abs(dx) > 0.35 || Math.abs(dy) > 0.35) prefer = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      const e = hitEdge(fx, fy, s.touched.size ? 0.3 : 0.24, prefer);
      if (e < 0 || s.touched.has(e)) return;
      s.touched.add(e);
      if (s.kind === 'wallAdd' && !game.walls.has(e)) { game.walls.add(e); s.changed = true; }
      if (s.kind === 'wallRemove' && game.walls.has(e)) { game.walls.delete(e); s.changed = true; }
      if (s.changed) syncDuringStroke();
      requestDraw();
    }
  }

  function selectBrush(g, quiet) {
    game.brush = g; requestDraw();
    if (!quiet && g >= 0 && !settings._brushTipShown) { settings._brushTipShown = true; saveSettings(); toast('Galaxy picked. Click or drag over cells to claim them; the mirror cell fills itself.', { timeout: 3500 }); }
  }

  function onPointerDown(ev) {
    if (!game.p || game.solved || game.paused) return;
    if (ev.button !== 0 && ev.button !== 2) return;
    ev.preventDefault();
    closeMenu();
    try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* synthetic or already-captured pointer */ }
    const now = performance.now();
    const { fx, fy } = boardPos(ev);
    const right = ev.button === 2;
    const tool = right ? 'erase' : game.tool;
    const dot = hitDot(fx, fy, ev.pointerType !== 'mouse');
    if (dot >= 0 && !right && game.tool === 'paint') {
      // Clicking a dot picks its galaxy and claims the cells it touches (those
      // always belong to it). Dragging on from the dot keeps painting. Clicking
      // a dot that is already the brush, and changing nothing, drops the brush.
      const wasBrush = game.brush === dot;
      selectBrush(dot);
      beginStroke('paint', dot);
      stroke.fromDot = true; stroke.wasBrush = wasBrush; stroke.last = { fx, fy }; stroke.start = { fx, fy };
      for (const c of game.p.cores[dot]) { stroke.touched.add(c); if (paintCell(c, dot, now)) stroke.changed = true; }
      if (stroke.changed) syncDuringStroke();
      requestDraw();
      return;
    }
    if (tool === 'paint') {
      const c = hitCell(fx, fy); if (c < 0) return;
      if (game.brush < 0) {
        if (game.owner[c] >= 0) { selectBrush(game.owner[c]); }
        else toast('Pick a galaxy first: click one of the dots, or drag from a dot into the grid.', { timeout: 3000 });
        return;
      }
      if (game.owner[c] === game.brush && !game.fixed[c]) beginStroke('erase');
      else beginStroke('paint', game.brush);
    } else if (tool === 'wall') {
      const e = hitEdge(fx, fy);
      if (e < 0) { const c = hitCell(fx, fy); if (c >= 0 && game.owner[c] >= 0) selectBrush(game.owner[c]); return; }
      beginStroke(game.walls.has(e) ? 'wallRemove' : 'wallAdd');
    } else {
      const e = hitEdge(fx, fy, 0.18);
      if (e >= 0 && game.walls.has(e)) beginStroke('wallRemove');
      else { const c = hitCell(fx, fy); if (c < 0) return; beginStroke('erase'); }
    }
    stroke.last = { fx, fy }; stroke.start = { fx, fy };
    applyAt(fx, fy, now);
  }

  function onPointerMove(ev) {
    if (!game.p) return;
    const { fx, fy } = boardPos(ev);
    if (!stroke) {
      const h = { cell: hitCell(fx, fy), edge: hitEdge(fx, fy), dot: hitDot(fx, fy, false) };
      if (!hover || h.cell !== hover.cell || h.edge !== hover.edge || h.dot !== hover.dot) { hover = h; requestDraw(); }
      return;
    }
    const now = performance.now();
    const last = stroke.last || { fx, fy };
    const dist = Math.hypot(fx - last.fx, fy - last.fy);
    const steps = Math.max(1, Math.ceil(dist / 0.2));
    for (let i = 1; i <= steps; i++) {
      const k = i / steps;
      applyAt(last.fx + (fx - last.fx) * k, last.fy + (fy - last.fy) * k, now);
    }
    stroke.last = { fx, fy };
  }

  function onPointerUp(ev) {
    if (stroke) { try { canvas.releasePointerCapture(ev.pointerId); } catch (e) { /* ignore */ } endStroke(); }
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('pointerleave', () => { if (!stroke && hover) { hover = null; requestDraw(); } });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  /* ------------------------------------------------------------------ */
  /*  Undo / redo / restart / solve                                       */
  /* ------------------------------------------------------------------ */

  function undo() {
    if (!game.history.length || game.solved) return;
    game.future.push(snapshot()); restore(game.history.pop());
    game.hint = null; hideToast(); refreshAnalysis(false); save(); updateButtons(); requestDraw();
  }
  function redo() {
    if (!game.future.length || game.solved) return;
    game.history.push(snapshot()); restore(game.future.pop());
    game.hint = null; hideToast(); refreshAnalysis(true); save(); updateButtons(); requestDraw();
  }
  function restart() {
    if (!game.p) return;
    if (game.history.length && !confirm('Clear the board and restart this puzzle?')) return;
    const before = snapshot();
    game.owner.fill(-1); game.walls = new Set();
    for (let c = 0; c < game.p.N; c++) if (game.fixed[c]) game.owner[c] = game.p.coreOf[c];
    game.history = [before]; game.future = [];
    game.solved = false; game.revealed = false; game.elapsed = 0; game.running = true; game.lastTick = performance.now();
    game.brush = -1; game.hint = null; game.mistakes = null; game.particles = null; hideToast();
    refreshAnalysis(false); save(); updateButtons(); requestDraw();
  }
  function showSolution() {
    if (!game.p || game.solved) return;
    if (!confirm('Reveal the solution? This puzzle will not count towards your statistics.')) return;
    game.history.push(snapshot()); game.future.length = 0;
    for (let c = 0; c < game.p.N; c++) game.owner[c] = game.solution[c];
    game.walls = new Set();
    game.revealed = true; game.solved = true; game.running = false; game.brush = -1; game.hint = null; game.mistakes = null; hideToast();
    refreshAnalysis(false); save(); updateButtons(); requestDraw();
    toast('Solution revealed.', { timeout: 2500 });
  }

  /* ------------------------------------------------------------------ */
  /*  Hints & checking                                                    */
  /* ------------------------------------------------------------------ */

  function showHint() {
    if (!game.p || game.solved || game.paused) return;
    const h = core.findHint(game.p, game.solution, game.owner, game.walls);
    if (!h) { toast('Nothing to suggest right now.'); return; }
    game.hint = h;
    let msg = '', action = null;
    const apply = (fn) => ({ label: 'Apply', fn: () => { const before = snapshot(); const now = performance.now(); if (fn(now)) commit(before); game.hint = null; hideToast(); requestDraw(); } });
    switch (h.kind) {
      case 'wrongCell': msg = 'This cell is painted with the wrong galaxy.'; action = { label: 'Clear it', fn: () => { const before = snapshot(); game.fixed[h.cell] = 0; if (eraseCell(h.cell)) commit(before); game.hint = null; hideToast(); requestDraw(); } }; break;
      case 'wrongWall': msg = 'This wall does not belong here: both sides are in the same galaxy.'; action = { label: 'Remove it', fn: () => { const before = snapshot(); game.walls.delete(h.edge); commit(before); game.hint = null; hideToast(); requestDraw(); } }; break;
      case 'core': msg = 'A cell that touches a dot always belongs to that dot\'s galaxy.'; action = apply((now) => paintCell(h.cell, h.galaxy, now)); break;
      case 'only': msg = 'Only the highlighted galaxy can hold this cell: for every other dot its mirror image would fall outside the grid or outside that galaxy\'s reach.'; action = apply((now) => paintCell(h.cell, h.galaxy, now)); break;
      case 'connect': msg = 'The highlighted galaxy must pass through this cell to reach a cell it already owns; there is no other route.'; action = apply((now) => paintCell(h.cell, h.galaxy, now)); break;
      case 'contradiction': msg = 'Suppose this cell went to another galaxy: that galaxy could then never be completed. So it belongs to the highlighted one.'; action = apply((now) => paintCell(h.cell, h.galaxy, now)); break;
      default: msg = 'No short deduction here. In the solution this cell belongs to the highlighted galaxy.'; action = apply((now) => paintCell(h.cell, h.galaxy, now)); break;
    }
    if (h.galaxy != null && h.galaxy >= 0 && h.kind !== 'wrongCell' && h.kind !== 'wrongWall') selectBrush(h.galaxy, true);
    toast(msg, { action, timeout: 0 });
    requestDraw();
  }

  function checkMistakes() {
    if (!game.p || game.solved) return;
    const m = core.findMistakes(game.p, game.solution, game.owner, game.walls);
    game.mistakes = m;
    const n = m.cells.size, w = m.walls.size;
    if (!n && !w) toast('No mistakes so far.', { timeout: 2000 });
    else toast(`${n ? n + (n === 1 ? ' cell' : ' cells') : ''}${n && w ? ' and ' : ''}${w ? w + (w === 1 ? ' wall' : ' walls') : ''} disagree with the solution.`, { timeout: 4000 });
    requestDraw();
  }

  /* ------------------------------------------------------------------ */
  /*  Solved                                                              */
  /* ------------------------------------------------------------------ */

  function onSolved() {
    game.solved = true; game.running = false; game.brush = -1; game.hint = null; game.mistakes = null; hideToast();
    const p = game.p, a = game.analysis;
    for (let c = 0; c < p.N; c++) if (game.owner[c] < 0) game.owner[c] = a.regionDot[a.regionOf[c]];
    // celebration
    const list = [], cx = geo.ox + p.W * geo.cell / 2, cy = geo.oy + p.H * geo.cell / 2;
    for (let i = 0; i < 90; i++) {
      const ang = Math.random() * Math.PI * 2, sp = 120 + Math.random() * 260;
      list.push({ x: cx, y: cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 120, r: 4 + Math.random() * 7, life: 1.2 + Math.random() * 1.2, delay: Math.random() * 250, color: galaxyInk(Math.floor(Math.random() * p.G)) });
    }
    game.particles = { t0: performance.now(), list };
    if (!game.revealed) recordSolve();
    save(); updateButtons(); updateStatus(); requestDraw();
    setTimeout(openSolvedDialog, 900);
  }

  function statKey() { return `${game.p.W}x${game.p.H}:${game.rating}`; }
  function recordSolve() {
    const key = statKey(), ms = Math.round(game.elapsed);
    const e = stats.byKey[key] || (stats.byKey[key] = { solved: 0, best: null, total: 0 });
    e.solved++; e.total += ms; if (e.best == null || ms < e.best) e.best = ms;
    stats.total = (stats.total || 0) + 1;
    if (game.origin.kind === 'daily') stats.daily[game.origin.date] = ms;
    saveStats();
  }
  function dailyStreak() {
    let n = 0; const d = new Date();
    if (!stats.daily[dateKey(d)]) d.setDate(d.getDate() - 1);
    while (stats.daily[dateKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function openSolvedDialog() {
    const e = stats.byKey[statKey()] || { solved: 0, best: null, total: 0 };
    $('#solvedTitle').textContent = game.revealed ? 'Solution shown' : (game.origin.kind === 'daily' ? 'Daily solved!' : 'Solved!');
    $('#solvedSub').textContent = `${game.p.W}×${game.p.H} · ${DIFF_LABEL[game.rating] || game.rating}` + (game.origin.kind === 'daily' ? ` · ${game.origin.date}` : '');
    const cells = [
      ['Time', fmtTime(game.elapsed)],
      ['Best', e.best != null ? fmtTime(e.best) : '—'],
      ['Solved', String(e.solved)]
    ];
    if (game.origin.kind === 'daily') cells[2] = ['Daily streak', String(dailyStreak())];
    $('#solvedStats').innerHTML = cells.map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join('');
    openDialog($('#dlgSolved'));
  }

  /* ------------------------------------------------------------------ */
  /*  Timer & status                                                      */
  /* ------------------------------------------------------------------ */

  function fmtTime(ms) {
    const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ':' + String(m).padStart(2, '0') : String(m)).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }
  setInterval(() => {
    const now = performance.now();
    if (game.running && !game.paused && !game.solved && document.visibilityState === 'visible') game.elapsed += now - game.lastTick;
    game.lastTick = now;
    if (settings.showTimer) ui.timer.textContent = fmtTime(game.elapsed);
  }, 250);
  setInterval(() => { if (game.p && game.running && !game.solved) save(); }, 15000);
  document.addEventListener('visibilitychange', () => { game.lastTick = performance.now(); });

  function updateStatus() {
    if (!game.p) return;
    const a = game.analysis;
    ui.size.textContent = `${game.p.W}×${game.p.H}`;
    ui.rating.textContent = DIFF_LABEL[game.rating] || 'Custom';
    ui.rating.className = 'pill rating-' + game.rating;
    let claimed = 0;
    for (let c = 0; c < game.p.N; c++) if (game.owner[c] >= 0 || a.valid[a.regionOf[c]]) claimed++;
    ui.progText.textContent = `${a.settled} / ${game.p.G} galaxies · ${claimed} / ${game.p.N} cells`;
    ui.progBar.style.width = (100 * claimed / game.p.N) + '%';
    ui.timer.style.display = settings.showTimer ? '' : 'none';
    ui.timer.classList.toggle('paused', game.paused);
    const o = game.origin;
    ui.source.textContent = o.kind === 'daily' ? `Daily · ${o.date}` : o.kind === 'code' ? 'From code' : '';
    if (game.solved) ui.progText.textContent = game.revealed ? 'Solution shown' : 'Solved ✓';
  }
  function updateButtons() {
    ui.undo.disabled = !game.history.length || game.solved;
    ui.redo.disabled = !game.future.length || game.solved;
    ui.hint.disabled = game.solved; ui.check.disabled = game.solved;
  }

  /* ------------------------------------------------------------------ */
  /*  Toast, dialogs, menu                                                */
  /* ------------------------------------------------------------------ */

  let toastTimer = 0;
  function toast(msg, opts) {
    const o = opts || {};
    clearTimeout(toastTimer);
    toastEl.innerHTML = '';
    const span = document.createElement('span'); span.textContent = msg; toastEl.appendChild(span);
    if (o.action) { const b = document.createElement('button'); b.textContent = o.action.label; b.onclick = o.action.fn; toastEl.appendChild(b); }
    const x = document.createElement('button'); x.textContent = '×'; x.setAttribute('aria-label', 'Dismiss'); x.onclick = () => { hideToast(); if (game.hint) { game.hint = null; requestDraw(); } }; toastEl.appendChild(x);
    toastEl.classList.add('show');
    const t = o.timeout == null ? 3000 : o.timeout;
    if (t > 0) toastTimer = setTimeout(hideToast, t);
  }
  function hideToast() { toastEl.classList.remove('show'); }

  function openDialog(d) { if (!d.open) d.showModal(); }
  $$('dialog').forEach((d) => {
    d.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', () => d.close()));
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); });
  });
  function anyDialogOpen() { return $$('dialog').some((d) => d.open); }

  function closeMenu() { ui.menu.classList.remove('open'); }
  $('#btnMore').addEventListener('click', (e) => { e.stopPropagation(); ui.menu.classList.toggle('open'); });
  document.addEventListener('click', (e) => { if (!ui.menu.contains(e.target)) closeMenu(); });
  ui.menu.addEventListener('click', () => closeMenu());

  /* ---- new puzzle dialog ---- */
  const dlgNew = $('#dlgNew');
  function syncNewDialog() {
    $$('#sizeChips .chip').forEach((b) => b.classList.toggle('active', b.dataset.size === settings.size));
    $$('#diffChips .chip').forEach((b) => b.classList.toggle('active', b.dataset.diff === settings.difficulty));
    $('#customSize').style.display = settings.size === 'custom' ? '' : 'none';
    $('#inW').value = settings.customW; $('#inH').value = settings.customH;
  }
  $('#sizeChips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; settings.size = b.dataset.size; syncNewDialog(); });
  $('#diffChips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; settings.difficulty = b.dataset.diff; syncNewDialog(); });
  $('#btnNew').addEventListener('click', () => { syncNewDialog(); openDialog(dlgNew); });
  $('#btnGenerate').addEventListener('click', () => {
    let W, H;
    if (settings.size === 'custom') {
      W = Math.max(5, Math.min(30, parseInt($('#inW').value, 10) || 10));
      H = Math.max(5, Math.min(30, parseInt($('#inH').value, 10) || 10));
      settings.customW = W; settings.customH = H;
    } else { const m = /^(\d+)x(\d+)$/.exec(settings.size); W = +m[1]; H = +m[2]; }
    saveSettings(); dlgNew.close();
    newPuzzle(W, H, settings.difficulty, { kind: 'random' }, core.randomSeed());
  });
  $('#btnSolvedNext').addEventListener('click', () => { $('#dlgSolved').close(); syncNewDialog(); openDialog(dlgNew); });
  $('#btnSolvedShare').addEventListener('click', () => copyLink());

  /* ---- code dialog ---- */
  const dlgCode = $('#dlgCode');
  $('#mEnterCode').addEventListener('click', () => {
    $('#codeError').textContent = ''; $('#inCode').value = '';
    openDialog(dlgCode);
    const box = $('#inCode'); box.focus(); box.select();
  });
  function loadCodeFromInput() {
    try {
      const d = core.decodeId($('#inCode').value.trim());
      const p = core.makePuzzle(d.W, d.H, d.dots);
      const res = core.solve(p, { limit: 2 });
      if (res.count === 0) throw new Error('This puzzle has no solution.');
      dlgCode.close();
      setPuzzle({ W: d.W, H: d.H, dots: d.dots, solution: res.count === 1 ? Array.from(res.solutions[0]) : null, origin: { kind: 'code' } });
    } catch (e) { $('#codeError').textContent = e.message || String(e); }
  }
  $('#btnLoadCode').addEventListener('click', loadCodeFromInput);
  $('#inCode').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); loadCodeFromInput(); } });

  async function copyText(text, what) {
    try { await navigator.clipboard.writeText(text); toast(`${what} copied: ${text.length > 48 ? text.slice(0, 45) + '…' : text}`, { timeout: 3500 }); }
    catch (e) { prompt(`Copy this ${what.toLowerCase()}:`, text); }
  }
  function shareLink() { return location.href.split('#')[0] + '#id=' + game.id; }
  function copyLink() { if (game.p) copyText(shareLink(), 'Link'); }
  $('#mCopyCode').addEventListener('click', () => game.p && copyText(game.id, 'Puzzle code'));
  $('#mCopyLink').addEventListener('click', copyLink);
  $('#mRestart').addEventListener('click', restart);
  $('#mSolve').addEventListener('click', showSolution);
  $('#mPause').addEventListener('click', () => togglePause());
  $('#btnResume').addEventListener('click', () => togglePause(false));
  $('#genCancel').addEventListener('click', cancelGeneration);

  function togglePause(force) {
    if (!game.p || game.solved) return;
    const want = force == null ? !game.paused : force;
    game.paused = want; game.lastTick = performance.now();
    ui.pauseOverlay.classList.toggle('show', want);
    $('#mPause').textContent = want ? 'Resume' : 'Pause';
    updateStatus(); requestDraw();
  }

  /* ---- stats dialog ---- */
  $('#mStats').addEventListener('click', () => {
    const rows = Object.entries(stats.byKey).sort();
    const streak = dailyStreak();
    let html = `<div class="solved-stats"><div><b>${stats.total || 0}</b><span>Puzzles solved</span></div><div><b>${Object.keys(stats.daily).length}</b><span>Dailies solved</span></div><div><b>${streak}</b><span>Daily streak</span></div></div>`;
    if (rows.length) {
      html += '<table style="width:100%;border-collapse:collapse;margin-top:14px;font-size:14px">' +
        '<tr style="color:var(--ink-soft);text-align:left"><th style="padding:6px 4px">Puzzle</th><th>Solved</th><th>Best</th><th>Average</th></tr>' +
        rows.map(([k, e]) => { const [sz, d] = k.split(':'); return `<tr style="border-top:1px solid var(--line)"><td style="padding:6px 4px">${sz.replace('x', '×')} ${DIFF_LABEL[d] || d}</td><td>${e.solved}</td><td>${e.best != null ? fmtTime(e.best) : '—'}</td><td>${e.solved ? fmtTime(e.total / e.solved) : '—'}</td></tr>`; }).join('') + '</table>';
    } else html += '<p class="help">Solve a puzzle to start your record.</p>';
    $('#statsBody').innerHTML = html;
    openDialog($('#dlgStats'));
  });
  $('#btnResetStats').addEventListener('click', () => { if (confirm('Erase all statistics?')) { stats.byKey = {}; stats.daily = {}; stats.total = 0; saveStats(); $('#dlgStats').close(); } });

  /* ---- settings dialog ---- */
  const dlgSettings = $('#dlgSettings');
  $('#btnSettings').addEventListener('click', () => {
    $('#selTheme').value = settings.theme;
    $('#chkPrefill').checked = settings.prefillCores;
    $('#chkAutoCheck').checked = settings.autoCheck;
    $('#chkHover').checked = settings.hoverMirror;
    $('#chkTimer').checked = settings.showTimer;
    openDialog(dlgSettings);
  });
  $('#selTheme').addEventListener('change', (e) => { settings.theme = e.target.value; saveSettings(); applyTheme(); });
  $('#chkPrefill').addEventListener('change', (e) => { settings.prefillCores = e.target.checked; saveSettings(); });
  $('#chkAutoCheck').addEventListener('change', (e) => { settings.autoCheck = e.target.checked; saveSettings(); if (game.p) { game.mistakes = settings.autoCheck ? core.findMistakes(game.p, game.solution, game.owner, game.walls) : null; requestDraw(); } });
  $('#chkHover').addEventListener('change', (e) => { settings.hoverMirror = e.target.checked; saveSettings(); requestDraw(); });
  $('#chkTimer').addEventListener('change', (e) => { settings.showTimer = e.target.checked; saveSettings(); updateStatus(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  $('#btnHelp').addEventListener('click', () => openDialog($('#dlgHelp')));
  $('#btnDaily').addEventListener('click', () => loadDaily());
  $('#btnUndo').addEventListener('click', undo);
  $('#btnRedo').addEventListener('click', redo);
  $('#btnHint').addEventListener('click', showHint);
  $('#btnCheck').addEventListener('click', checkMistakes);

  /* ---- tools ---- */
  function setTool(t) {
    game.tool = t; settings.tool = t; saveSettings();
    $$('#toolSeg button').forEach((b) => b.classList.toggle('active', b.dataset.tool === t));
    canvas.className = 'tool-' + t;
    requestDraw();
  }
  $('#toolSeg').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) setTool(b.dataset.tool); });

  /* ---- keyboard ---- */
  window.addEventListener('keydown', (e) => {
    if (anyDialogOpen()) return;
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); return; }
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    switch (k) {
      case '1': case 'p': setTool('paint'); break;
      case '2': case 'w': setTool('wall'); break;
      case '3': case 'e': setTool('erase'); break;
      case 'escape': closeMenu(); if (game.hint) { game.hint = null; hideToast(); } else selectBrush(-1, true); requestDraw(); break;
      case 'h': showHint(); break;
      case 'c': checkMistakes(); break;
      case 'n': syncNewDialog(); openDialog(dlgNew); break;
      case 'd': loadDaily(); break;
      case 'r': restart(); break;
      case ' ': e.preventDefault(); togglePause(); break;
      default: return;
    }
  });

  window.addEventListener('resize', fitBoard);
  window.addEventListener('hashchange', () => handleHash(true));

  /* ------------------------------------------------------------------ */
  /*  Boot                                                                */
  /* ------------------------------------------------------------------ */

  function handleHash(fromChange) {
    const h = location.hash || '';
    let m = /^#id=(.+)$/.exec(h);
    if (m) {
      const id = decodeURIComponent(m[1]);
      if (game.p && game.id === id) return true;
      try {
        const d = core.decodeId(id);
        const p = core.makePuzzle(d.W, d.H, d.dots);
        const res = core.solve(p, { limit: 2 });
        if (res.count === 0) throw new Error('no solution');
        setPuzzle({ W: d.W, H: d.H, dots: d.dots, solution: res.count === 1 ? Array.from(res.solutions[0]) : null, id, origin: { kind: 'code' } });
        return true;
      } catch (e) { if (fromChange) toast('That puzzle link is not valid.'); return false; }
    }
    m = /^#daily(?:=(\d{4}-\d{2}-\d{2}))?$/.exec(h);
    if (m) { const date = m[1] || dateKey(); if (game.p && game.origin.kind === 'daily' && game.origin.date === date) return true; loadDaily(date); return true; }
    return false;
  }

  function firstRunTip() {
    if (settings._seenTip) return;
    settings._seenTip = true; saveSettings();
    setTimeout(() => toast('Click a dot to pick its galaxy, then drag over cells to claim them. The mirror cell fills itself.', { timeout: 8000 }), 900);
  }

  applyTheme();
  setTool(['paint', 'wall', 'erase'].includes(settings.tool) ? settings.tool : 'paint');
  if (!handleHash(false) && !restoreSaved()) newPuzzle(10, 10, 'normal', { kind: 'random' }, core.randomSeed());
  updateButtons();
  firstRunTip();
})();
