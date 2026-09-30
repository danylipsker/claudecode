/* The Puzzle Cabinet · engines/shade.js
 *
 * Pencil puzzles where every cell is filled, marked or left empty:
 *
 *   nonogram    paint by numbers: row and column clues give the runs of
 *               filled cells; a picture appears when it is done
 *   akari       Light Up: bulbs light their row and column up to a wall;
 *               light every cell, no bulb may see another, numbers count
 *               the bulbs next to a black cell
 *   takuzu      Binairo: 0s and 1s, no three alike in a line, as many of
 *               each in every row and column, no two lines the same
 *   starbattle  one (or two) stars in every row, column and region, no two
 *               stars touching, not even at a corner
 *
 * One grid, one set of gestures: click, right-click, drag along a line to
 * paint a run, keyboard cursor. The reasoning (solvers, graded steps, the
 * hints' explanations) lives in js/lib/shade-logic.js.
 *
 * data (see tools/gen/shade.js):
 *   { kind: 'nonogram', w, h, rows: [[3, 1], …], cols: [[…], …], sol: ['..RR..', …], name: 'a teacup' }
 *       sol letters are the picture's colours ('.' empty); only filled/empty matters for play
 *   { kind: 'akari', grid: ['..1.', '#...', …], sol: ['*...', …] }   '.' white, '#' black, 0-4 numbered black; '*' a bulb
 *   { kind: 'takuzu', n: 8, grid: ['1..0....', …], sol: ['10100110', …] }
 *   { kind: 'starbattle', stars: 1, regions: ['aabb…', …], sol: ['.*..', …] }
 *
 * Cell states on the board: 0 empty, 1 filled / bulb / star / the digit 0,
 * 2 cross / dot / the digit 1.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const S = 40;                       // world units per cell
  const LG = () => C.shadeLogic;

  // the colours of revealed pictures (letters in data.sol)
  const PAL = {
    K: '#2b2d42', R: '#e63946', O: '#f08a3c', Y: '#ffc93c', G: '#5bb86a', D: '#2f7a4a', B: '#3d6fb6', L: '#8fcdf0',
    N: '#8a5a36', T: '#d9b27c', P: '#f28fb1', V: '#8e5ccf', W: '#ffffff', E: '#9aa0ab', A: '#5d6475', S: '#f3c9a1',
    M: '#b3202e', C: '#2bb3b1', F: '#c9e36b', H: '#6e4424', I: '#ff6f59', U: '#1f3b73', X: '#f7f0d8'
  };
  C.shadePalette = PAL;

  const ABOUT = {
    nonogram: 'Shade cells so that every row and column matches its clue. The numbers are the lengths of the runs of filled cells, in order, with at least one empty cell between two runs. **Click** a cell to fill it, **right-click** to cross it out (a cell you know is empty); do it again to clear. **Drag** along a row or column to fill or cross a whole run in one go: a badge shows how long the run is. On a touch screen switch the tap between *Fill* and *Cross* in the panel. Clue numbers grey out when their run is finished and turn red when a line cannot work any more. **Keys:** arrows move a cursor, **Enter** fills, **Space** crosses, **Shift+arrows** carry the last mark along. When the last cell is right, the picture shows itself.',
    akari: 'Put **light bulbs** in white cells until every white cell is lit. A bulb lights its own cell and shines along its row and column until a black cell stops it. **No bulb may shine on another bulb.** A number on a black cell says how many bulbs sit next to it (above, below, left, right). **Click** a cell for a bulb, **right-click** for a dot (a cell that stays bulb-free); do it again to clear. Drag with the right button to dot a run of cells. Clashing bulbs and impossible numbers turn red; satisfied numbers fade. **Keys:** arrows, **Enter** = bulb, **Space** = dot.',
    takuzu: 'Fill every cell with a **0** or a **1**: never three of the same next to each other in a row or column, as many 0s as 1s in every row and column, and no two rows (or two columns) exactly alike. **Click** a cell to cycle empty → 0 → 1 → empty, **right-click** to go the other way, **drag** to paint several. The grey cells are given. Three in a row, too many of one digit and twin lines turn red. **Keys:** arrows, **0** and **1**, **Backspace** to clear, **Enter**/**Space** to cycle.',
    starbattle: 'Place **stars** so that every row, every column and every outlined region holds exactly one star (two in the ★★ puzzles). Stars may not touch each other, **not even at a corner**. **Click** a cell for a star, **right-click** for a dot (no star here); do it again to clear. Drag with the right button to dot a run of cells. The cells your stars rule out are greyed for you (switch that off in the panel). **Keys:** arrows, **Enter** = star, **Space** = dot.'
  };
  const ABOUT_ALL = 'Four kinds of shading puzzle share this grid. **Click** a cell to fill it (a filled square, a bulb, a star, a digit), **right-click** to mark it (a cross or a dot), and **drag** along a row or column to paint a run. Keys: arrows move a cursor, **Enter** and **Space** act like the two buttons. The *How to* tab of each puzzle tells its rules.';

  const FAMILY_KIND = { nonograms: 'nonogram', akari: 'akari', takuzu: 'takuzu', 'star-battle': 'starbattle' };
  function currentKind() {
    try {
      const hash = root.location && root.location.hash || '';
      let m = /#\/p\/([\w-]+)/.exec(hash);
      const p = m && C.byId[m[1]];
      if (p && p.data && p.data.kind) return p.data.kind;
      m = /#\/[xf]\/([\w-]+)/.exec(hash);
      return m ? FAMILY_KIND[m[1]] : null;
    } catch (e) { return null; }
  }

  /* ---------- the puzzle as numbers ---------- */

  function model(d) {
    const m = { kind: d.kind };
    if (d.kind === 'nonogram') {
      m.w = d.w; m.h = d.h; m.rows = d.rows; m.cols = d.cols;
      m.sol = new Int8Array(d.w * d.h);
      m.color = [];
      for (let r = 0; r < d.h; r++) for (let c = 0; c < d.w; c++) {
        const ch = d.sol[r][c];
        m.sol[r * d.w + c] = ch === '.' ? 0 : 1;
        m.color.push(ch === '.' ? null : (PAL[ch] || PAL.K));
      }
    } else if (d.kind === 'akari') {
      m.P = LG().akPrep(d.grid);
      m.w = m.P.w; m.h = m.P.h;
      m.sol = new Int8Array(m.w * m.h);
      for (let r = 0; r < m.h; r++) for (let c = 0; c < m.w; c++) m.sol[r * m.w + c] = d.sol[r][c] === '*' ? 1 : 0;
    } else if (d.kind === 'takuzu') {
      m.w = m.h = m.n = d.n;
      m.given = new Int8Array(d.n * d.n).fill(-1);
      m.sol = new Int8Array(d.n * d.n);
      for (let r = 0; r < d.n; r++) for (let c = 0; c < d.n; c++) {
        const g = d.grid[r][c];
        if (g === '0' || g === '1') m.given[r * d.n + c] = +g;
        m.sol[r * d.n + c] = +d.sol[r][c];
      }
    } else if (d.kind === 'starbattle') {
      m.P = LG().sbPrep(d.regions, d.stars || 1);
      m.w = m.h = m.n = m.P.n;
      m.sol = new Int8Array(m.w * m.h);
      for (let r = 0; r < m.h; r++) for (let c = 0; c < m.w; c++) m.sol[r * m.w + c] = d.sol[r][c] === '*' ? 1 : 0;
    }
    m.N = m.w * m.h;
    return m;
  }

  // board state -> solver values (-1 unknown, 0, 1)
  function toVals(m, st) {
    const v = new Int8Array(m.N);
    for (let i = 0; i < m.N; i++) {
      const s = st[i];
      if (m.kind === 'takuzu') v[i] = s === 0 ? -1 : s === 1 ? 0 : 1;
      else v[i] = s === 0 ? -1 : s === 1 ? 1 : 0;
    }
    if (m.kind === 'akari') for (let i = 0; i < m.N; i++) if (m.P.black[i]) v[i] = 0;
    return v;
  }
  // the solution as board states
  function solState(m, i) {
    if (m.kind === 'takuzu') return m.sol[i] === 0 ? 1 : 2;
    return m.sol[i] ? 1 : 0;
  }
  // is this mark wrong (against the one solution)?
  function wrongMark(m, st, i) {
    const s = st[i];
    if (!s) return false;
    if (m.kind === 'takuzu') return s !== solState(m, i);
    if (m.kind === 'akari' && m.P.black[i]) return false;
    return s === 1 ? !m.sol[i] : !!m.sol[i];
  }

  /* ---------- verify (node) ---------- */

  function verify(p) {
    const d = p.data, L = LG();
    if (!L) return { ok: false, err: 'js/lib/shade-logic.js is not loaded' };
    if (!d || !d.kind) return { ok: false, err: 'data.kind is missing' };
    if (d.kind === 'nonogram') {
      if (!d.sol || d.sol.length !== d.h || d.sol.some((r) => r.length !== d.w)) return { ok: false, err: 'sol does not match w × h' };
      const cl = L.nonoClues(d.sol);
      if (JSON.stringify(cl.rows) !== JSON.stringify(d.rows) || JSON.stringify(cl.cols) !== JSON.stringify(d.cols)) return { ok: false, err: 'the clues do not match the picture' };
      const r = L.nonoSolve(d.w, d.h, d.rows, d.cols);
      if (!r.ok) return { ok: false, err: 'the clues contradict each other' };
      if (!r.done) return { ok: false, err: 'line logic leaves ' + r.unknown + ' cells open (not unique, or needs guessing)' };
      for (let i = 0; i < d.w * d.h; i++) if (r.g[i] !== (d.sol[Math.floor(i / d.w)][i % d.w] === '.' ? 0 : 1)) return { ok: false, err: 'the solver found another picture' };
      return { ok: true };
    }
    if (d.kind === 'akari') {
      if (!d.grid || !d.sol || d.grid.length !== d.sol.length) return { ok: false, err: 'grid and sol needed' };
      const P = L.akPrep(d.grid);
      const bulbs = new Uint8Array(P.N);
      for (let i = 0; i < P.N; i++) bulbs[i] = d.sol[Math.floor(i / P.w)][i % P.w] === '*' ? 1 : 0;
      for (let i = 0; i < P.N; i++) if (bulbs[i] && P.black[i]) return { ok: false, err: 'a bulb on a black cell' };
      if (!L.akValid(P, bulbs)) return { ok: false, err: 'the stored solution breaks the rules' };
      const c = L.akCount(P, null, 2);
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      for (let i = 0; i < P.N; i++) if (!P.black[i] && (c.sol[i] === 1) !== !!bulbs[i]) return { ok: false, err: 'the solver found a different solution' };
      return { ok: true };
    }
    if (d.kind === 'takuzu') {
      const n = d.n;
      if (!n || n % 2 || !d.grid || !d.sol || d.grid.length !== n || d.sol.length !== n) return { ok: false, err: 'n (even), grid and sol needed' };
      const sol = new Int8Array(n * n), giv = new Int8Array(n * n).fill(-1);
      for (let i = 0; i < n * n; i++) {
        const r = Math.floor(i / n), c = i % n;
        sol[i] = +d.sol[r][c];
        const g = d.grid[r][c];
        if (g === '0' || g === '1') { giv[i] = +g; if (giv[i] !== sol[i]) return { ok: false, err: 'a given disagrees with the solution' }; }
      }
      if (!L.tkValid(n, sol)) return { ok: false, err: 'the stored solution breaks the rules' };
      // logic that never guesses and finishes the grid proves the solution is the only one
      const byLogic = L.tkSolveTo(n, giv, 4);
      if (byLogic.open === 0) {
        for (let i = 0; i < n * n; i++) if (byLogic.v[i] !== sol[i]) return { ok: false, err: 'logic finds a different solution' };
        return { ok: true };
      }
      const c = L.tkCount(n, giv, 2);
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      for (let i = 0; i < n * n; i++) if (c.sol[i] !== sol[i]) return { ok: false, err: 'the solver found a different solution' };
      return { ok: true };
    }
    if (d.kind === 'starbattle') {
      const n = d.regions && d.regions.length;
      if (!n || !d.sol || d.sol.length !== n) return { ok: false, err: 'regions and sol needed' };
      const P = L.sbPrep(d.regions, d.stars || 1);
      for (let k = 0; k < n; k++) if (!P.units[2 * n + k].length) return { ok: false, err: 'region ' + String.fromCharCode(97 + k) + ' is empty' };
      if (P.units.slice(2 * n).reduce((a, u) => a + u.length, 0) !== n * n) return { ok: false, err: 'a region letter is out of range' };
      const stars = new Int8Array(P.N);
      for (let i = 0; i < P.N; i++) stars[i] = d.sol[Math.floor(i / n)][i % n] === '*' ? 1 : 0;
      if (!L.sbValid(P, stars)) return { ok: false, err: 'the stored solution breaks the rules' };
      const c = L.sbCount(P, null, 2);
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      for (let i = 0; i < P.N; i++) if (c.sol[i] !== stars[i]) return { ok: false, err: 'the solver found a different solution' };
      return { ok: true };
    }
    return { ok: false, err: 'unknown kind ' + d.kind };
  }

  /* ---------- small drawing helpers ---------- */

  function starPath(cx, cy, R, r) {
    let d = '';
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r : R;
      d += (k ? 'L' : 'M') + C.fmtNum(cx + rr * Math.cos(a)) + ' ' + C.fmtNum(cy + rr * Math.sin(a));
    }
    return d + 'Z';
  }
  // a soft tint per region (star battle), by index
  const REGION_HUES = [8, 200, 130, 45, 280, 170, 330, 95, 235, 20, 300, 60];

  // colour regions so that neighbours differ (greedy over the region graph)
  function regionColours(P) {
    const n = P.n, adj = Array.from({ length: n }, () => new Set());
    for (let i = 0; i < P.N; i++) {
      const r = Math.floor(i / n), c = i % n;
      if (c + 1 < n && P.reg[i] !== P.reg[i + 1]) { adj[P.reg[i]].add(P.reg[i + 1]); adj[P.reg[i + 1]].add(P.reg[i]); }
      if (r + 1 < n && P.reg[i] !== P.reg[i + n]) { adj[P.reg[i]].add(P.reg[i + n]); adj[P.reg[i + n]].add(P.reg[i]); }
    }
    const col = new Array(n).fill(-1);
    for (let k = 0; k < n; k++) {
      const used = new Set(Array.from(adj[k]).map((j) => col[j]));
      let c = k % 6;
      for (let t = 0; t < 12 && used.has(c); t++) c = (c + 1) % 12;
      col[k] = c;
    }
    return col;
  }

  // the statement of a puzzle (shared by the generator and the Endless drawers)
  function textFor(d) {
    if (d.kind === 'nonogram') return 'Shade cells so that every row and column shows its clue: the lengths of its runs of filled cells, in order. Something is hiding in this ' + d.w + '×' + d.h + ' grid.';
    if (d.kind === 'akari') return 'Put bulbs in the white cells so that every white cell is lit. A bulb shines along its row and column up to the nearest black cell, and no bulb may shine on another. A number tells how many bulbs touch that black cell.';
    if (d.kind === 'takuzu') return 'Fill the ' + d.n + '×' + d.n + ' grid with 0s and 1s: no three alike side by side, ' + d.n / 2 + ' of each digit in every row and column, and no two rows or two columns the same.';
    const n = d.regions.length;
    return (d.stars || 1) === 1
      ? 'Place ' + n + ' stars: one in every row, one in every column and one in every outlined region. No two stars may touch, not even at a corner.'
      : 'Two stars in every row, every column and every outlined region, ' + 2 * n + ' in all. No two stars may touch, not even at a corner.';
  }

  const GOALS = {
    nonogram: 'Fill exactly the cells the clues ask for — a picture will appear.',
    akari: 'Light every white cell. No bulb may shine on another; numbers count the bulbs beside them.',
    takuzu: 'Fill the grid with 0s and 1s: no three alike in a line, half of each in every row and column, no twin lines.',
    starbattle: 'One star in every row, column and region; stars never touch, not even diagonally.'
  };

  /* ---------- the board (browser) ---------- */

  function mount(ctx, p) {
    const d = p.data, wb = ctx.wb, L = LG();
    const m = model(d);
    const kind = m.kind, w = m.w, h = m.h, N = m.N;
    const NONO = kind === 'nonogram', AK = kind === 'akari', TK = kind === 'takuzu', SB = kind === 'starbattle';
    const s = ctx.s;
    const nStars = SB ? m.P.s : 1;

    let st = new Int8Array(N);
    const fixed = new Uint8Array(N);
    if (AK) for (let i = 0; i < N; i++) if (m.P.black[i]) fixed[i] = 1;
    if (TK) for (let i = 0; i < N; i++) if (m.given[i] >= 0) { fixed[i] = 1; st[i] = m.given[i] === 0 ? 1 : 2; }
    const start = Int8Array.from(st);
    const ui = { tapMark: false, implied: true };
    let won = false, wonTimer = 0;
    let pending = null;            // what the next hint fills in
    let shown = null;              // hint marks on the board
    const cur = { r: 0, c: 0, on: false };
    let lastSet = null;            // the last state put in by the keyboard (Shift+arrows carry it)
    let drag = null, rightId = null, hovI = -1;
    const timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

    ctx.setGoal(p.goal || (SB && nStars === 2 ? 'Two stars in every row, column and region; stars never touch, not even diagonally.' : GOALS[kind]));

    /* layout */
    const CW = S * 0.62;
    let ox = 0, oy = 0;
    if (NONO) {
      ox = Math.max(1, ...m.rows.map((c) => c.length)) * CW + S * 0.35;
      oy = Math.max(1, ...m.cols.map((c) => c.length)) * CW + S * 0.35;
    } else if (TK || SB) { ox = S * 0.34; oy = S * 0.34; }
    const GW = w * S, GH = h * S;
    wb.setBounds({ x0: -S * 0.25, y0: -S * 0.25, x1: ox + GW + S * 0.25, y1: oy + GH + S * 0.25 }, 0.05);
    const rowOf = (i) => Math.floor(i / w), colOf = (i) => i % w;
    const cx = (i) => ox + colOf(i) * S, cy = (i) => oy + rowOf(i) * S;

    /* layers */
    const G = s('g', { class: 'sh sh-' + kind }, wb.layer('board'));
    const bgG = s('g', null, G);
    const cellG = s('g', null, G);
    const litG = s('g', { class: 'sh-lits' }, G);
    const hovG = s('g', { class: 'sh-hov' }, G);
    const markG = s('g', { class: 'sh-marks' }, G);
    const picG = s('g', { class: 'sh-pic' }, G);
    const lineG = s('g', { class: 'sh-lines' }, G);
    const textG = s('g', { class: 'sh-texts' }, G);
    const topG = s('g', { class: 'sh-top' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const curEl = s('rect', { width: S, height: S, rx: 4, class: 'sh-cursor' }, topG);
    const badge = s('g', { class: 'sh-badge' }, topG);
    const badgeBg = s('rect', { rx: 9, width: 34, height: 24 }, badge);
    const badgeTx = s('text', { x: 17, y: 12.5 }, badge);
    badge.style.display = 'none';

    s('rect', { x: ox - 4, y: oy - 4, width: GW + 8, height: GH + 8, rx: 7, class: 'sh-boardbg' }, bgG);

    /* cells */
    const regCol = SB ? regionColours(m.P) : null;
    const cellEls = [], markEls = [], litEls = [], sig = new Array(N).fill('');
    for (let i = 0; i < N; i++) {
      let cls = 'sh-cell';
      if (AK && m.P.black[i]) cls += ' sh-black';
      if (TK && fixed[i]) cls += ' sh-given';
      if (SB) cls += ' rg' + regCol[m.P.reg[i]];
      cellEls.push(s('rect', { x: cx(i), y: cy(i), width: S, height: S, class: cls, 'data-key': 'c' + i }, cellG));
      if (AK && !m.P.black[i]) litEls[i] = s('rect', { x: cx(i) + 0.75, y: cy(i) + 0.75, width: S - 1.5, height: S - 1.5, class: 'sh-lit' }, litG);
      markEls.push(s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')' }, markG));
    }

    /* grid lines, region borders, the frame */
    let thin = '', thick = '';
    for (let c = 1; c < w; c++) { const seg = 'M' + (ox + c * S) + ' ' + oy + 'V' + (oy + GH); if (NONO && c % 5 === 0) thick += seg; else thin += seg; }
    for (let r = 1; r < h; r++) { const seg = 'M' + ox + ' ' + (oy + r * S) + 'H' + (ox + GW); if (NONO && r % 5 === 0) thick += seg; else thin += seg; }
    s('path', { d: thin, class: 'sh-grid' }, lineG);
    if (thick) s('path', { d: thick, class: 'sh-grid5' }, lineG);
    if (SB) {
      let rb = '';
      for (let i = 0; i < N; i++) {
        const r = rowOf(i), c = colOf(i);
        if (c + 1 < w && m.P.reg[i] !== m.P.reg[i + 1]) rb += 'M' + (ox + (c + 1) * S) + ' ' + (oy + r * S) + 'v' + S;
        if (r + 1 < h && m.P.reg[i] !== m.P.reg[i + w]) rb += 'M' + (ox + c * S) + ' ' + (oy + (r + 1) * S) + 'h' + S;
      }
      s('path', { d: rb, class: 'sh-region' }, lineG);
    }
    s('rect', { x: ox, y: oy, width: GW, height: GH, rx: 2, class: 'sh-frame' }, lineG);

    /* clues (nonogram), numbers (akari), error bars (takuzu, star battle) */
    const clueEls = [], bandEls = [], numEls = {}, barEls = [];
    const lines = NONO ? L.nonoLines(w, h) : null;
    const clues = NONO ? m.rows.concat(m.cols) : null;
    if (NONO) {
      for (let r = 0; r < h; r++) bandEls.push(s('rect', { x: 0, y: oy + r * S, width: ox - S * 0.18, height: S, rx: 4, class: 'sh-band' + (Math.floor(r / 5) % 2 ? ' alt' : '') }, bgG));
      for (let c = 0; c < w; c++) bandEls.push(s('rect', { x: ox + c * S, y: 0, width: S, height: oy - S * 0.18, rx: 4, class: 'sh-band' + (Math.floor(c / 5) % 2 ? ' alt' : '') }, bgG));
      clues.forEach((cl0, li) => {
        const cl = cl0.length ? cl0 : [0];
        const isRow = li < h, k = isRow ? li : li - h;
        clueEls.push(cl.map((v, j) => {
          const off = S * 0.24 + CW / 2 + (cl.length - 1 - j) * CW;
          return s('text', isRow ? { x: ox - off, y: oy + k * S + S / 2, class: 'sh-clue', text: String(v) }
            : { x: ox + k * S + S / 2, y: oy - off, class: 'sh-clue', text: String(v) }, textG);
        }));
      });
    }
    if (AK) m.P.nums.forEach((b) => { numEls[b] = s('text', { x: cx(b) + S / 2, y: cy(b) + S / 2, class: 'sh-num', text: String(m.P.num[b]) }, textG); });
    if (TK || SB) {
      for (let r = 0; r < h; r++) barEls.push(s('rect', { x: ox - S * 0.27, y: oy + r * S + S * 0.14, width: S * 0.13, height: S * 0.72, rx: 2.5, class: 'sh-bar' }, textG));
      for (let c = 0; c < w; c++) barEls.push(s('rect', { x: ox + c * S + S * 0.14, y: oy - S * 0.27, width: S * 0.72, height: S * 0.13, rx: 2.5, class: 'sh-bar' }, textG));
    }

    /* ---------- what the marks mean ---------- */

    const err = new Uint8Array(N), imp = new Uint8Array(N);
    let litNow = null;

    // nonogram: which clue numbers are finished, and is the line broken?
    function lineStatus(li) {
      const cells = lines[li], clue = clues[li], n = cells.length;
      const known = new Int8Array(n);
      for (let t = 0; t < n; t++) { const v = st[cells[t]]; known[t] = v === 1 ? 1 : v === 2 ? 0 : -1; }
      const done = new Array(Math.max(1, clue.length)).fill(false);
      const bad = !L.nonoLine(clue, known);
      const runs = L.runsOf(Array.from(known, (x) => (x === 1 ? 1 : 0)));
      if (!bad && runs.join() === clue.join()) return { done: done.map(() => true), bad };
      if (bad) return { done, bad };
      // finished runs counted in from each end
      const walk = (dir) => {
        let pos = dir > 0 ? 0 : n - 1, j = dir > 0 ? 0 : clue.length - 1;
        while (pos >= 0 && pos < n && j >= 0 && j < clue.length) {
          if (known[pos] === 0) { pos += dir; continue; }
          if (known[pos] < 0) return;
          let e = pos;
          while (e >= 0 && e < n && known[e] === 1) e += dir;
          if (e >= 0 && e < n && known[e] < 0) return;
          if (Math.abs(e - pos) !== clue[j]) return;
          done[j] = true;
          j += dir;
          pos = e;
        }
      };
      walk(1); walk(-1);
      return { done, bad };
    }

    function evaluate() {
      const v = toVals(m, st);
      if (NONO) {
        let br = 0, bc = 0;
        for (let li = 0; li < lines.length; li++) {
          const runs = L.runsOf(lines[li].map((i) => (st[i] === 1 ? 1 : 0)));
          if (runs.join() !== clues[li].join()) { if (li < h) br++; else bc++; }
        }
        if (!br && !bc) return { solved: true, msg: d.name ? 'It is **' + d.name + '**!' : 'Every line matches its clue.' };
        const parts = [];
        if (br) parts.push(C.plural(br, 'row'));
        if (bc) parts.push(C.plural(bc, 'column'));
        return { solved: false, msg: 'Not yet: ' + parts.join(' and ') + ' do' + (br + bc === 1 ? 'es' : '') + ' not match ' + (br + bc === 1 ? 'its clue' : 'their clues') + '.' };
      }
      if (AK) {
        const P = m.P, lit = L.akLit(P, v);
        let dark = 0, clash = false, wrong = 0;
        const sb = new Int32Array(P.segs.length);
        for (const i of P.whites) if (v[i] === 1) { sb[P.hseg[i]]++; sb[P.vseg[i]]++; }
        for (let k = 0; k < sb.length; k++) if (sb[k] > 1) clash = true;
        for (const i of P.whites) if (!lit[i]) dark++;
        for (const b of P.nums) { let nb = 0; for (const i of P.nbr[b]) if (v[i] === 1) nb++; if (nb !== P.num[b]) wrong++; }
        if (!dark && !clash && !wrong) return { solved: true, msg: 'Every corner is lit, and not a bulb too many.' };
        return { solved: false, msg: clash ? 'Two bulbs are shining on each other.' : wrong && !dark ? 'Everything is lit, but ' + (wrong === 1 ? 'a number has' : wrong + ' numbers have') + ' the wrong count of bulbs.' : C.plural(dark, 'cell is', 'cells are') + ' still dark' + (wrong ? ', and ' + (wrong === 1 ? 'a number wants' : wrong + ' numbers want') + ' a different count' : '') + '.' };
      }
      if (TK) {
        let empty = 0;
        for (let i = 0; i < N; i++) if (v[i] < 0) empty++;
        const bad = tkBroken(v);
        if (!empty && !bad) return { solved: true, msg: 'Perfectly balanced, as all things should be.' };
        if (bad) return { solved: false, msg: bad };
        return { solved: false, msg: C.plural(empty, 'cell is', 'cells are') + ' still empty.' };
      }
      // star battle
      const P = m.P;
      let placed = 0, touching = false, over = false, under = 0;
      for (let i = 0; i < N; i++) if (v[i] === 1) { placed++; for (const j of P.nb8[i]) if (v[j] === 1) touching = true; }
      for (const u of P.units) { let k = 0; for (const i of u) if (v[i] === 1) k++; if (k > nStars) over = true; if (k < nStars) under++; }
      if (!touching && !over && !under) return { solved: true, msg: 'The stars are aligned.' };
      return { solved: false, msg: touching ? 'Two stars are touching.' : over ? 'A row, column or region has too many stars.' : C.plural(nStars * w - placed, 'star') + ' still to place.' };
    }

    // takuzu: the first broken rule, in words (or null)
    function tkBroken(v) {
      const n = w, half = n / 2, all = L.tkLines(n);
      for (let li = 0; li < all.length; li++) {
        const cells = all[li];
        let c0 = 0, c1 = 0;
        for (const i of cells) { if (v[i] === 0) c0++; else if (v[i] === 1) c1++; }
        const nm = (li < n ? 'Row ' : 'Column ') + ((li < n ? li : li - n) + 1);
        if (c0 > half || c1 > half) return nm + ' has more than ' + half + ' ' + (c0 > half ? '0' : '1') + 's.';
        for (let t = 0; t + 2 < n; t++) { const a = v[cells[t]]; if (a >= 0 && a === v[cells[t + 1]] && a === v[cells[t + 2]]) return nm + ' has three ' + a + 's in a row.'; }
      }
      for (let pass = 0; pass < 2; pass++) {
        const seen = new Map();
        for (let k = 0; k < n; k++) {
          const cells = all[pass * n + k];
          if (cells.some((i) => v[i] < 0)) continue;
          const key = cells.map((i) => v[i]).join('');
          if (seen.has(key)) return (pass ? 'Columns ' : 'Rows ') + (seen.get(key) + 1) + ' and ' + (k + 1) + ' are the same.';
          seen.set(key, k);
        }
      }
      return null;
    }

    /* ---------- drawing the marks ---------- */

    function glyph(g, i, v) {
      const c = S / 2;
      if (NONO) {
        if (v === 1) s('rect', { x: 1.5, y: 1.5, width: S - 3, height: S - 3, rx: 3.5, class: 'sh-fill' }, g);
        else if (v === 2) s('path', { d: 'M14.5 14.5L25.5 25.5M25.5 14.5L14.5 25.5', class: 'sh-x' }, g);
      } else if (AK) {
        if (v === 1) {
          s('circle', { cx: c, cy: c, r: S * 0.43, class: 'sh-halo' }, g);
          s('circle', { cx: c, cy: c - 1.5, r: S * 0.24, class: 'sh-bulb' + (err[i] ? ' err' : '') }, g);
          s('path', { d: 'M' + (c - 4.5) + ' ' + (c + 8) + 'h9v4.5a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2z', class: 'sh-bulbbase' }, g);
          s('path', { d: 'M' + (c - 4) + ' ' + (c - 6) + 'a6 6 0 0 1 5-3', class: 'sh-shine' }, g);
        } else if (v === 2) s('circle', { cx: c, cy: c, r: 3.2, class: 'sh-dot' }, g);
      } else if (TK) {
        if (!v) return;
        const cls = 'd' + (v - 1) + (fixed[i] ? ' given' : '') + (err[i] ? ' err' : '');
        s('circle', { cx: c, cy: c, r: S * 0.37, class: 'sh-disc ' + cls }, g);
        s('text', { x: c, y: c + 0.5, class: 'sh-digit ' + cls, text: String(v - 1) }, g);
      } else if (v === 1) s('path', { d: starPath(c, c + 1.3, S * 0.39, S * 0.165), class: 'sh-star' + (err[i] ? ' err' : '') }, g);
      else if (v === 2) s('circle', { cx: c, cy: c, r: 3.2, class: 'sh-dot' }, g);
      else if (imp[i] && ui.implied) s('circle', { cx: c, cy: c, r: 2.4, class: 'sh-dot implied' }, g);
    }
    function drawMark(i) {
      const key = st[i] + ':' + err[i] + ':' + (imp[i] && ui.implied ? 1 : 0);
      if (sig[i] === key) return;
      sig[i] = key;
      const g = markEls[i];
      while (g.firstChild) g.removeChild(g.firstChild);
      glyph(g, i, st[i]);
    }

    function refresh() {
      err.fill(0);
      imp.fill(0);
      const v = toVals(m, st);
      if (NONO) {
        for (let li = 0; li < lines.length; li++) {
          const ls = lineStatus(li);
          clueEls[li].forEach((el, j) => { el.classList.toggle('done', !!ls.done[j] && !ls.bad); el.classList.toggle('bad', ls.bad); });
        }
        let filled = 0, want = 0;
        for (let i = 0; i < N; i++) { if (st[i] === 1) filled++; if (m.sol[i]) want++; }
        ctx.stat('Filled', filled + ' of ' + want);
      } else if (AK) {
        const P = m.P;
        litNow = L.akLit(P, v);
        const sb = new Int32Array(P.segs.length);
        for (const i of P.whites) if (v[i] === 1) { sb[P.hseg[i]]++; sb[P.vseg[i]]++; }
        let dark = 0;
        for (const i of P.whites) {
          litEls[i].classList.toggle('on', !!litNow[i]);
          if (!litNow[i]) dark++;
          if (v[i] === 1 && (sb[P.hseg[i]] > 1 || sb[P.vseg[i]] > 1)) err[i] = 1;
        }
        for (const b of P.nums) {
          let nb = 0, room = 0;
          for (const i of P.nbr[b]) { if (v[i] === 1) nb++; else if (st[i] === 0 && !litNow[i]) room++; }
          const want = P.num[b];
          numEls[b].classList.toggle('ok', nb === want);
          numEls[b].classList.toggle('bad', nb > want || nb + room < want);
        }
        ctx.stat('Dark cells', dark);
      } else if (TK) {
        const n = w, half = n / 2, all = L.tkLines(n);
        const bad = new Uint8Array(2 * n);
        all.forEach((cells, li) => {
          let c0 = 0, c1 = 0;
          for (const i of cells) { if (v[i] === 0) c0++; else if (v[i] === 1) c1++; }
          if (c0 > half || c1 > half) bad[li] = 1;
          for (let t = 0; t + 2 < n; t++) {
            const a = v[cells[t]];
            if (a >= 0 && a === v[cells[t + 1]] && a === v[cells[t + 2]]) err[cells[t]] = err[cells[t + 1]] = err[cells[t + 2]] = 1;
          }
        });
        for (let pass = 0; pass < 2; pass++) {
          const seen = new Map();
          for (let k = 0; k < n; k++) {
            const li = pass * n + k, cells = all[li];
            if (cells.some((i) => v[i] < 0)) continue;
            const key = cells.map((i) => v[i]).join('');
            if (seen.has(key)) { bad[li] = 1; bad[seen.get(key)] = 1; } else seen.set(key, li);
          }
        }
        barEls.forEach((el, li) => el.classList.toggle('on', !!bad[li]));
        let empty = 0;
        for (let i = 0; i < N; i++) if (v[i] < 0) empty++;
        ctx.stat('Empty', empty);
      } else {
        const P = m.P;
        for (let i = 0; i < N; i++) if (v[i] === 1) for (const j of P.nb8[i]) if (v[j] === 1) { err[i] = 1; err[j] = 1; }
        const bad = new Uint8Array(2 * w);
        P.units.forEach((u, k) => {
          let c = 0;
          for (const i of u) if (v[i] === 1) c++;
          if (c <= nStars) return;
          if (k < 2 * w) bad[k] = 1;
          else for (const i of u) if (v[i] === 1) err[i] = 1;
        });
        barEls.forEach((el, li) => el.classList.toggle('on', !!bad[li]));
        const im = L.sbImplied(P, v);
        let placed = 0;
        for (let i = 0; i < N; i++) { if (st[i] === 0 && im[i]) imp[i] = 1; if (v[i] === 1) placed++; }
        ctx.stat('Stars', placed + ' of ' + nStars * w);
      }
      for (let i = 0; i < N; i++) drawMark(i);
      if (shown) pruneHint();
      if (won && !evaluate().solved) setWon(false);
    }

    /* ---------- the finished look: the picture, the glow ---------- */

    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
      while (picG.firstChild) picG.removeChild(picG.firstChild);
      if (!on || !NONO) return;
      s('rect', { x: ox, y: oy, width: GW, height: GH, class: 'sh-paper' }, picG);
      const mx = (w - 1) / 2, my = (h - 1) / 2, far = Math.hypot(mx, my) || 1;
      for (let i = 0; i < N; i++) {
        if (!m.sol[i]) continue;
        const r = rowOf(i), c = colOf(i);
        const el = s('rect', { x: cx(i), y: cy(i), width: S + 0.6, height: S + 0.6, fill: m.color[i], class: 'sh-px' }, picG);
        el.style.animationDelay = (0.15 + 0.85 * Math.hypot(r - my, c - mx) / far).toFixed(3) + 's';
      }
    }

    /* ---------- hints on the board ---------- */

    function clearHint() {
      shown = null;
      while (hintG.firstChild) hintG.removeChild(hintG.firstChild);
      bandEls.forEach((b) => b.classList.remove('hint'));
    }
    function showHint(hh) {
      clearHint();
      shown = { set: (hh.set || []).slice(), wrong: (hh.wrong || []).slice(), els: {} };
      if (hh.band != null) {
        const li = hh.band, isRow = li < h, k = isRow ? li : li - h;
        s('rect', isRow ? { x: ox - 2, y: oy + k * S - 2, width: GW + 4, height: S + 4, rx: 6, class: 'sh-hline' } : { x: ox + k * S - 2, y: oy - 2, width: S + 4, height: GH + 4, rx: 6, class: 'sh-hline' }, hintG);
        if (bandEls[li]) bandEls[li].classList.add('hint');
      } else (hh.focus || []).forEach((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: S - 2, height: S - 2, rx: 4, class: 'sh-hzone' }, hintG));
      shown.wrong.forEach((i) => { shown.els['w' + i] = s('rect', { x: cx(i) + 2.5, y: cy(i) + 2.5, width: S - 5, height: S - 5, rx: 5, class: 'sh-hwrong' }, hintG); });
      shown.set.forEach(([i, v]) => {
        const g = s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')', class: 'sh-ghost' }, hintG);
        s('rect', { x: 2.5, y: 2.5, width: S - 5, height: S - 5, rx: 5, class: 'sh-hcell' }, g);
        glyph(g, i, v);
        shown.els[i] = g;
      });
    }
    function pruneHint() {
      shown.set = shown.set.filter(([i, v]) => { if (st[i] !== v) return true; if (shown.els[i]) shown.els[i].remove(); return false; });
      shown.wrong = shown.wrong.filter((i) => { if (wrongMark(m, st, i)) return true; if (shown.els['w' + i]) shown.els['w' + i].remove(); return false; });
      if (!shown.set.length && !shown.wrong.length) clearHint();
    }
    function flash(cells) {
      const els = cells.map((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: S - 2, height: S - 2, rx: 5, class: 'sh-flash' }, hintG));
      later(() => els.forEach((e) => e.remove()), 1400);
    }
    const NAMES = {
      nonogram: ['', 'filled cell', 'cross'], akari: ['', 'bulb', 'dot'], takuzu: ['', '0', '1'], starbattle: ['', 'star', 'dot']
    };
    function describeSet(set) {
      const k1 = set.filter((x) => x[1] === 1).length, k2 = set.length - k1;
      const nm = NAMES[kind];
      const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
      const cnt = (k) => WORDS[k] || String(k);
      const one = (k, i) => (TK ? (k === 1 ? 'a **' + nm[i] + '**' : cnt(k) + ' **' + nm[i] + '**s')
        : k === 1 ? (i === 1 && !NONO ? 'a ' : 'one ') + nm[i] : cnt(k) + ' ' + (nm[i] === 'cross' ? 'crosses' : nm[i] + 's'));
      return [k1 ? one(k1, 1) : null, k2 ? one(k2, 2) : null].filter(Boolean).join(' and ');
    }
    function stepNow() {
      const v = toVals(m, st);
      if (NONO) {
        const hh = L.nonoHint(w, h, m.rows, m.cols, v);
        return hh && { text: hh.text, set: hh.fill.map((i) => [i, 1]).concat(hh.empty.map((i) => [i, 2])), band: hh.li };
      }
      const r = AK ? L.akStep(m.P, v, 3) : TK ? L.tkStep(w, v, 5) : L.sbStep(m.P, v, 5);
      return r && { text: r.text, set: r.set.map(([i, x]) => [i, TK ? (x === 0 ? 1 : 2) : (x === 1 ? 1 : 2)]), focus: r.focus || [] };
    }

    /* ---------- gestures ---------- */

    function cellAt(pt) {
      const c = Math.floor((pt[0] - ox) / S), r = Math.floor((pt[1] - oy) / S);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    }
    // left: fill (again: clear); right: mark (again: clear). Takuzu cycles.
    function nextState(s0, back) {
      if (TK) return back ? (s0 + 2) % 3 : (s0 + 1) % 3;
      if (back) return s0 === 2 ? 0 : 2;
      return s0 === 1 ? 0 : 1;
    }
    function startDrag(i, back) {
      if (drag) endDrag();
      cur.on = false; cur.r = rowOf(i); cur.c = colOf(i);
      drawCursor();
      if (fixed[i]) return;
      const from = st[i], to = nextState(from, back);
      drag = { a: i, from, to, axis: null, orig: Int8Array.from(st), line: [i], one: (AK || SB) && to === 1 };
      st[i] = to;
      lastSet = to;
      ctx.sfx('tap');
      refresh();
    }
    function moveDrag(pt) {
      if (!drag || drag.one) return;
      const ar = rowOf(drag.a), ac = colOf(drag.a);
      const c = Math.max(0, Math.min(w - 1, Math.floor((pt[0] - ox) / S)));
      const r = Math.max(0, Math.min(h - 1, Math.floor((pt[1] - oy) / S)));
      if (r === ar && c === ac) drag.axis = null;
      else if (!drag.axis) drag.axis = Math.abs(c - ac) >= Math.abs(r - ar) ? 'h' : 'v';
      const line = [];
      if (!drag.axis) line.push(drag.a);
      else if (drag.axis === 'h') for (let k = Math.min(ac, c); k <= Math.max(ac, c); k++) line.push(ar * w + k);
      else for (let k = Math.min(ar, r); k <= Math.max(ar, r); k++) line.push(k * w + ac);
      let changed = false;
      drag.line.forEach((j) => { if (!line.includes(j) && st[j] !== drag.orig[j]) { st[j] = drag.orig[j]; changed = true; } });
      line.forEach((j) => { if (!fixed[j] && drag.orig[j] === drag.from && st[j] !== drag.to) { st[j] = drag.to; changed = true; } });
      drag.line = line;
      if (changed) refresh();
      if (line.length > 1) {
        const k = wb.px(1);
        badge.style.display = '';
        badge.setAttribute('transform', 'translate(' + (pt[0] + 16 * k) + ' ' + (pt[1] - 36 * k) + ') scale(' + k + ')');
        badgeTx.textContent = String(line.length);
        badgeBg.setAttribute('width', line.length > 9 ? 40 : 30);
        badgeTx.setAttribute('x', line.length > 9 ? 20 : 15);
      } else badge.style.display = 'none';
    }
    function endDrag() {
      if (!drag) return;
      const changed = st.some((x, i) => x !== drag.orig[i]);
      drag = null;
      badge.style.display = 'none';
      if (changed) ctx.changed('cells');
    }

    wb.handlers.board = {
      down(pt, ev) {
        const i = cellAt(pt);
        if (i < 0) return false;
        startDrag(i, ui.tapMark);
        return true;
      },
      move(pt) { moveDrag(pt); },
      up() { endDrag(); }
    };

    // the right button: the workbench pans with it elsewhere, but on the grid it marks
    const svg = wb.svg;
    const onDown = (ev) => {
      if (ev.button !== 2 || wb.mode !== 'select' || wb.is3D) return;
      const i = cellAt(wb.toWorld(ev.clientX, ev.clientY));
      if (i < 0) return;
      ev.stopImmediatePropagation();
      ev.preventDefault();
      rightId = ev.pointerId;
      try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
      startDrag(i, !ui.tapMark);
    };
    const onMove = (ev) => {
      const pt = wb.toWorld(ev.clientX, ev.clientY);
      if (rightId === ev.pointerId) moveDrag(pt);
      hover(pt);
    };
    const onUp = (ev) => {
      if (rightId == null || ev.pointerId !== rightId) return;
      rightId = null;
      ev.stopImmediatePropagation();
      endDrag();
    };
    const onLeave = () => hover(null);
    svg.addEventListener('pointerdown', onDown, true);
    svg.addEventListener('pointermove', onMove);
    svg.addEventListener('pointerup', onUp, true);
    svg.addEventListener('pointercancel', onUp, true);
    svg.addEventListener('pointerleave', onLeave);

    // the row and column under the pointer
    const hovR = s('rect', { class: 'sh-hovband', height: S, width: GW + (NONO ? ox : 0), x: NONO ? 0 : ox }, hovG);
    const hovC = s('rect', { class: 'sh-hovband', width: S, height: GH + (NONO ? oy : 0), y: NONO ? 0 : oy }, hovG);
    hovR.style.display = hovC.style.display = 'none';
    function hover(pt) {
      const i = pt && !AK ? cellAt(pt) : -1;
      if (i === hovI) return;
      hovI = i;
      hovR.style.display = hovC.style.display = i < 0 ? 'none' : '';
      if (i < 0) return;
      hovR.setAttribute('y', cy(i));
      hovC.setAttribute('x', cx(i));
    }

    function drawCursor() {
      curEl.style.display = cur.on ? '' : 'none';
      curEl.setAttribute('x', ox + cur.c * S);
      curEl.setAttribute('y', oy + cur.r * S);
    }
    drawCursor();

    /* ---------- the panel ---------- */

    const TAP = { nonogram: ['Fill', 'Cross'], akari: ['Bulb', 'Dot'], takuzu: ['0 first', '1 first'], starbattle: ['Star', 'Dot'] }[kind];
    const segBtns = TAP.map((label, k) => ctx.h('button.sh-segb' + (k === 0 ? '.on' : ''), { type: 'button', onclick: () => setTap(k === 1) }, label));
    function setTap(mark) {
      ui.tapMark = mark;
      segBtns.forEach((b, k) => b.classList.toggle('on', (k === 1) === mark));
    }
    const box = ctx.h('div.sh-panel',
      ctx.h('div.sh-seg', ctx.h('span.sh-segl', 'Click or tap:'), segBtns[0], segBtns[1]),
      ctx.h('div.sh-tip', TK ? 'Right-click cycles the other way.' : 'Right-click puts a ' + TAP[1].toLowerCase() + '. Drag along a line to do a whole run.')
    );
    if (SB) {
      const cb = ctx.h('input', { type: 'checkbox', checked: true, onchange: () => { ui.implied = cb.checked; refresh(); } });
      box.appendChild(ctx.h('label.sh-opt', cb, ' Grey out the cells my stars rule out'));
    }
    ctx.panel.appendChild(box);

    refresh();

    /* ---------- the instance ---------- */

    return {
      noMoves: true,
      check(manual) {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (NONO && !manual && !won) {
          // let the picture bloom before the applause
          setWon(true, true);
          clearHint();
          clearTimeout(wonTimer);
          wonTimer = later(() => { if (won) ctx.solved({ msg: r.msg }); }, C.anim(1500));
          return { solved: false, msg: '' };
        }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() {
        const wrong = [];
        for (let i = 0; i < N; i++) if (!fixed[i] && wrongMark(m, st, i)) wrong.push(i);
        if (wrong.length) {
          if (pending && pending.fix) {
            wrong.forEach((i) => { st[i] = 0; });
            pending = null;
            clearHint();
            refresh();
            ctx.changed('hint');
            return 'I rubbed out ' + (wrong.length === 1 ? 'the wrong mark' : 'the ' + wrong.length + ' wrong marks') + '. Carry on from here.';
          }
          pending = { fix: true };
          return {
            text: (wrong.length === 1 ? 'One of your marks is wrong' : wrong.length + ' of your marks are wrong') + ' (outlined in red). Look again — or ask for another hint and I will rub ' + (wrong.length === 1 ? 'it' : 'them') + ' out.',
            show() { showHint({ wrong }); }
          };
        }
        if (pending && pending.set) {
          const todo = pending.set.filter(([i, v]) => st[i] !== v);
          pending = null;
          if (todo.length) {
            todo.forEach(([i, v]) => { st[i] = v; });
            clearHint();
            refresh();
            ctx.changed('hint');
            return { text: 'Done: I put in ' + describeSet(todo) + ' from the last hint.', show() { flash(todo.map((x) => x[0])); } };
          }
        }
        const step = stepNow();
        if (!step) {
          const r = evaluate();
          return r.solved ? 'It is solved already!' : 'Nothing is left to deduce: ' + (r.msg || 'look over your marks.');
        }
        pending = { set: step.set };
        return { text: step.text + ' *(Another hint fills ' + (step.set.length === 1 ? 'it' : 'them') + ' in.)*', show() { showHint(step); } };
      },
      solve() {
        clearHint();
        pending = null;
        const order = [];
        for (let i = 0; i < N; i++) if (!fixed[i]) order.push(i);
        order.sort((a, b) => (rowOf(a) + colOf(a)) - (rowOf(b) + colOf(b)) || a - b);
        const frames = 22, per = Math.max(1, Math.ceil(order.length / frames));
        let k = 0;
        const tick = () => {
          for (let t = 0; t < per && k < order.length; t++, k++) st[order[k]] = solState(m, order[k]);
          refresh();
          if (k < order.length) later(tick, C.anim(32));
          else ctx.changed('solve');
        };
        tick();
      },
      explain() {
        if (NONO) return d.name ? 'The picture is **' + d.name + '**.' : '';
        return '';
      },
      getState() { return { s: Array.from(st).join('') }; },
      setState(o) {
        if (!o || typeof o.s !== 'string' || o.s.length !== N) return;
        for (let i = 0; i < N; i++) st[i] = fixed[i] ? start[i] : +o.s[i] || 0;
        drag = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { pending = null; clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return cur.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (dirs[k]) {
          if (!cur.on) { cur.on = true; drawCursor(); return true; }
          cur.r = Math.max(0, Math.min(h - 1, cur.r + dirs[k][0]));
          cur.c = Math.max(0, Math.min(w - 1, cur.c + dirs[k][1]));
          drawCursor();
          const i = cur.r * w + cur.c;
          if (ev.shiftKey && lastSet != null && !fixed[i] && st[i] !== lastSet) { st[i] = lastSet; refresh(); ctx.changed('cells'); }
          return true;
        }
        if (!cur.on) return false;
        const i = cur.r * w + cur.c;
        const set = (v) => { if (!fixed[i] && st[i] !== v) { st[i] = v; lastSet = v; ctx.sfx('tap'); refresh(); ctx.changed('cells'); } };
        if (k === 'Enter') { set(nextState(st[i], false)); return true; }
        if (k === ' ' || k === 'x' || k === '.') { set(nextState(st[i], true)); return true; }
        if (k === 'Backspace' || k === 'Delete') { set(0); return true; }
        if (TK && (k === '0' || k === '1')) { set(k === '0' ? 1 : 2); return true; }
        if (k === 'Escape') { cur.on = false; drawCursor(); }
        return false;
      },
      destroy() {
        timers.forEach(clearTimeout);
        svg.removeEventListener('pointerdown', onDown, true);
        svg.removeEventListener('pointermove', onMove);
        svg.removeEventListener('pointerup', onUp, true);
        svg.removeEventListener('pointercancel', onUp, true);
        svg.removeEventListener('pointerleave', onLeave);
      }
    };
  }

  /* ---------- family pictures ---------- */

  function thumb(p) {
    const d = p.data, kind = d.kind;
    const m = model(d);
    const w = m.w, h = m.h;
    let clL = 0, clT = 0;
    if (kind === 'nonogram') {
      clL = Math.max(...d.rows.map((c) => c.length || 1));
      clT = Math.max(...d.cols.map((c) => c.length || 1));
    }
    const k = kind === 'nonogram' ? 0.55 : 0;
    const cs = Math.min(148 / (w + clL * k), 110 / (h + clT * k));
    const gx = (160 - (w + clL * k) * cs) / 2 + clL * k * cs, gy = (120 - (h + clT * k) * cs) / 2 + clT * k * cs;
    const X = (c) => C.fmtNum(gx + c * cs), Y = (r) => C.fmtNum(gy + r * cs);
    let out = '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet">';
    const cells = (fn) => { for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) { const t = fn(r * w + c, r, c); if (t) out += t; } };
    const rect = (r, c, fill, extra) => '<rect x="' + X(c) + '" y="' + Y(r) + '" width="' + C.fmtNum(cs + 0.3) + '" height="' + C.fmtNum(cs + 0.3) + '" fill="' + fill + '"' + (extra || '') + '/>';
    const gridLines = (every, stroke, sw) => {
      let dd = '';
      for (let c = every; c < w; c += every) dd += 'M' + X(c) + ' ' + Y(0) + 'V' + Y(h);
      for (let r = every; r < h; r += every) dd += 'M' + X(0) + ' ' + Y(r) + 'H' + X(w);
      return dd ? '<path d="' + dd + '" stroke="' + stroke + '" stroke-width="' + sw + '" fill="none"/>' : '';
    };
    const frame = '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + C.fmtNum(w * cs) + '" height="' + C.fmtNum(h * cs) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>';
    if (kind === 'nonogram') {
      const solved = C.progress && C.progress.solved && C.progress.solved(p.id);
      if (solved) {
        out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + C.fmtNum(w * cs) + '" height="' + C.fmtNum(h * cs) + '" fill="#f6f1e4"/>';
        cells((i, r, c) => (m.sol[i] ? rect(r, c, m.color[i]) : ''));
        return out + '</svg>';
      }
      out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + C.fmtNum(w * cs) + '" height="' + C.fmtNum(h * cs) + '" fill="var(--cell)"/>';
      out += gridLines(w > 10 ? 5 : 1, 'var(--grid-2)', 0.8);
      // the clue numbers, as dots
      const dot = (x, y) => '<circle cx="' + C.fmtNum(x) + '" cy="' + C.fmtNum(y) + '" r="' + C.fmtNum(Math.max(0.9, cs * 0.16)) + '" fill="var(--muted)"/>';
      d.rows.forEach((cl, r) => (cl.length ? cl : [0]).forEach((_, j, a) => { out += dot(gx - (a.length - j - 0.5) * k * cs - cs * 0.15, gy + (r + 0.5) * cs); }));
      d.cols.forEach((cl, c) => (cl.length ? cl : [0]).forEach((_, j, a) => { out += dot(gx + (c + 0.5) * cs, gy - (a.length - j - 0.5) * k * cs - cs * 0.15); }));
      out += frame;
      out += '<text x="' + C.fmtNum(gx + w * cs / 2) + '" y="' + C.fmtNum(gy + h * cs / 2) + '" text-anchor="middle" dominant-baseline="central" font-size="' + C.fmtNum(Math.min(w, h) * cs * 0.55) + '" font-weight="800" fill="var(--faint)" opacity=".7">?</text>';
      return out + '</svg>';
    }
    if (kind === 'akari') {
      cells((i, r, c) => {
        if (!m.P.black[i]) return rect(r, c, 'var(--cell)');
        let t = rect(r, c, '#10121f');
        if (m.P.num[i] >= 0) t += '<text x="' + C.fmtNum(gx + (c + 0.5) * cs) + '" y="' + C.fmtNum(gy + (r + 0.5) * cs) + '" text-anchor="middle" dominant-baseline="central" font-size="' + C.fmtNum(cs * 0.7) + '" font-weight="700" fill="#fff">' + m.P.num[i] + '</text>';
        return t;
      });
      out += gridLines(1, 'var(--grid-2)', 0.6) + frame;
      // one bulb, lighting its lines, for the look of it
      return out + '</svg>';
    }
    if (kind === 'takuzu') {
      cells((i, r, c) => {
        let t = rect(r, c, m.given[i] >= 0 ? 'var(--board-2)' : 'var(--cell)');
        if (m.given[i] >= 0) t += '<circle cx="' + C.fmtNum(gx + (c + 0.5) * cs) + '" cy="' + C.fmtNum(gy + (r + 0.5) * cs) + '" r="' + C.fmtNum(cs * 0.36) + '" fill="' + (m.given[i] ? '#f08a3c' : '#3d8fd1') + '"/>';
        return t;
      });
      return out + gridLines(1, 'var(--grid-2)', 0.6) + frame + '</svg>';
    }
    // star battle
    const col = regionColours(m.P);
    cells((i, r, c) => rect(r, c, 'hsl(' + REGION_HUES[col[m.P.reg[i]]] + ' 55% 55% / .28)'));
    out += gridLines(1, 'var(--grid-2)', 0.5);
    let rb = '';
    for (let i = 0; i < m.N; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (c + 1 < w && m.P.reg[i] !== m.P.reg[i + 1]) rb += 'M' + X(c + 1) + ' ' + Y(r) + 'V' + Y(r + 1);
      if (r + 1 < h && m.P.reg[i] !== m.P.reg[i + w]) rb += 'M' + X(c) + ' ' + Y(r + 1) + 'H' + X(c + 1);
    }
    out += '<path d="' + rb + '" stroke="var(--ink)" stroke-width="2.2" stroke-linecap="square" fill="none"/>' + frame;
    if (m.P.s === 2) out += '<text x="152" y="14" text-anchor="end" font-size="13" fill="var(--gold)">★★</text>';
    return out + '</svg>';
  }

  /* ---------- Endless drawers: a fresh puzzle of a given level ---------- */

  const now = () => (root.performance && root.performance.now ? root.performance.now() : Date.now());
  const BLOT_COLOURS = [['B', 'U'], ['V', 'U'], ['R', 'M'], ['G', 'D'], ['O', 'N'], ['C', 'U'], ['P', 'V'], ['L', 'B'], ['I', 'M'], ['F', 'D'], ['T', 'N'], ['A', 'K']];

  function generate(rng, level, fam) {
    const L = LG(), id = fam && fam.id;
    const t0 = now(), budget = 700;
    const within = () => now() - t0 < budget;
    if (id === 'takuzu') {
      const [n, lv] = [null, [6, 1], [8, 2], [10, 2], [10, 4], [12, 4]][level];
      while (within()) {
        const t = L.tkMake(n, lv, rng);
        if (!t || t.diff !== level) continue;
        const data = { kind: 'takuzu', n, grid: t.grid, sol: t.sol };
        return { title: 'Takuzu ' + n + '×' + n, text: textFor(data), diff: level, data };
      }
      return null;
    }
    if (id === 'akari') {
      const opts = [null, [[7, 1, 0.2]], [[8, 1, 0.2], [7, 2, 0.18]], [[10, 2, 0.17]], [[12, 2, 0.16], [10, 2, 0.17]], [[12, 2, 0.16]]][level];
      while (within()) {
        const [s, lv, dens] = opts[rng.int(opts.length)];
        const a = L.akMake(s, s, rng, dens, lv);
        if (!a || a.diff !== level) continue;
        const data = { kind: 'akari', grid: a.grid, sol: a.sol };
        return { title: 'Light Up ' + s + '×' + s, text: textFor(data), diff: level, data };
      }
      return null;
    }
    if (id === 'star-battle') {
      const opts = [null, [[5, 1], [6, 1]], [[7, 1], [6, 1]], [[8, 1], [7, 1]], [[8, 1], [9, 2]], [[9, 2]]][level];
      while (within()) {
        const [n, s] = opts[rng.int(opts.length)];
        const t = L.sbMake(n, s, rng, s === 2 ? 700 : 900);
        if (!t || t.diff !== level) continue;
        const data = { kind: 'starbattle', stars: s, regions: t.regions, sol: t.sol };
        return { title: 'Star Battle ' + n + '×' + n + (s === 2 ? ' ★★' : ''), text: textFor(data), diff: level, data };
      }
      return null;
    }
    if (id === 'nonograms') {
      // inkblots: random noise, smoothed and mirrored, nudged until line logic finishes them
      const sizes = [null, [[5, 5], [6, 5]], [[10, 10], [10, 8]], [[12, 12], [15, 10]], [[15, 15], [16, 14]], [[20, 20], [20, 18]]][level];
      while (within()) {
        const [w, h] = sizes[rng.int(sizes.length)];
        const bits = L.nonoBlot(w, h, rng, 0.52);
        let filled = 0;
        for (const b of bits) filled += b;
        if (filled < w * h * 0.35 || filled > w * h * 0.72) continue;
        const fix = L.nonoFix(bits, w, h, 6, 36, rng);
        if (!fix) continue;
        const cl = L.nonoCluesOf(fix.bits, w, h);
        const e = L.nonoEffort(w, h, cl.rows, cl.cols);
        if (!e || L.nonoDiff(w, h, e) !== level) continue;
        const [edge, inner] = BLOT_COLOURS[rng.int(BLOT_COLOURS.length)];
        const data = { kind: 'nonogram', w, h, rows: cl.rows, cols: cl.cols, sol: L.nonoPaint(fix.bits, w, h, edge, inner), name: 'an inkblot (what do you see in it?)' };
        return { title: 'Inkblot ' + w + '×' + h, text: textFor(data), diff: level, data };
      }
      return null;
    }
    return null;
  }

  /* ---------- the engine ---------- */

  const KIND_NAMES = { nonogram: 'Nonograms', akari: 'Light Up', takuzu: 'Takuzu', starbattle: 'Star Battle' };

  C.engine({
    id: 'shade',
    get name() { return KIND_NAMES[currentKind()] || 'Shading puzzles'; },
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/shade-logic.js'],
    noMoves: true,
    get about() { return ABOUT[currentKind()] || ABOUT_ALL; },
    verify,
    generate,
    generates: ['nonograms', 'akari', 'takuzu', 'star-battle'],
    mount,
    thumb,
    textFor,
    kinds: ABOUT
  });

  const regionCss = REGION_HUES.map((hue, k) => '.sh-starbattle .rg' + k + ' { fill: hsl(' + hue + ' 60% 58% / .15); }').join('\n');

  C.css('shade', `
    .sh-lits, .sh-hov, .sh-marks, .sh-pic, .sh-lines, .sh-texts, .sh-top { pointer-events: none; }
    .sh-boardbg { fill: var(--board); stroke: var(--line); stroke-width: 1; }
    .sh-cell { fill: var(--cell); }
    .sh-cell.sh-given { fill: var(--board-2); }
    .sh-black { fill: #0b0d18; }
    [data-theme="light"] .sh-black { fill: #262a3f; }
    .sh-grid { fill: none; stroke: var(--grid-2); stroke-width: 1; }
    .sh-grid5 { fill: none; stroke: var(--ink-2); stroke-width: 1.8; opacity: .75; }
    .sh-frame { fill: none; stroke: var(--ink-2); stroke-width: 2.6; }
    .sh-region { fill: none; stroke: var(--ink); stroke-width: 3.4; stroke-linecap: square; }
    ${regionCss}
    .sh-band { fill: var(--board); opacity: .55; transition: fill .15s; }
    .sh-band.alt { fill: var(--board-2); opacity: .9; }
    .sh-band.hint { fill: var(--gold); opacity: .22; }
    .sh-hovband { fill: var(--accent); opacity: .07; }
    .sh-clue { font: 600 17px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; dominant-baseline: central; transition: fill .2s, opacity .2s; }
    .sh-clue.done { fill: var(--faint); opacity: .75; }
    .sh-clue.bad { fill: var(--red); }
    .sh-fill { fill: var(--ink); opacity: .93; }
    .sh-x { stroke: var(--muted); stroke-width: 2.4; stroke-linecap: round; fill: none; }
    .sh-dot { fill: var(--muted); }
    .sh-dot.implied { fill: var(--faint); opacity: .75; }
    .sh-lit { fill: #ffd36b; opacity: 0; transition: opacity .25s; }
    .sh-lit.on { opacity: .7; }
    [data-theme="light"] .sh-lit { fill: #ffcf5c; }
    [data-theme="light"] .sh-lit.on { opacity: .45; }
    .sh-halo { fill: #ffd166; opacity: .28; }
    .sh-bulb { fill: #ffd166; stroke: #c28a12; stroke-width: 1.5; }
    .sh-bulb.err { fill: var(--red); stroke: #8e1f1f; }
    .sh-bulbbase { fill: #8d93b0; }
    .sh-shine { fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; opacity: .85; }
    .sh-num { font: 700 20px "Segoe UI", system-ui, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; transition: opacity .2s; }
    .sh-num.ok { opacity: .4; }
    .sh-num.bad { fill: #ff7b7b; opacity: 1; }
    .sh-disc { stroke-width: 0; }
    .sh-disc.d0 { fill: #3d8fd1; }
    .sh-disc.d1 { fill: #f08a3c; }
    .sh-disc.given { stroke: rgba(0,0,0,.4); stroke-width: 3; }
    .sh-disc.err { stroke: var(--red); stroke-width: 3.5; }
    .sh-digit { font: 700 17px "Segoe UI", system-ui, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; }
    .sh-digit.given { font-weight: 900; }
    .sh-star { fill: #ffd166; stroke: #b07a00; stroke-width: 1.3; stroke-linejoin: round; }
    .sh-star.err { fill: var(--red); stroke: #8e1f1f; }
    .sh-bar { fill: var(--red); opacity: 0; transition: opacity .2s; }
    .sh-bar.on { opacity: 1; }
    .sh-cursor { fill: none; stroke: var(--accent); stroke-width: 3.2; }
    .sh-badge rect { fill: var(--accent); }
    .sh-badge text { font: 700 14px "Segoe UI", system-ui, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; }
    .sh-hline { fill: none; stroke: var(--gold); stroke-width: 3; stroke-dasharray: 8 5; }
    .sh-hzone { fill: var(--gold); opacity: .17; }
    .sh-hwrong { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .sh-hcell { fill: none; stroke: var(--gold); stroke-width: 2.5; }
    .sh-ghost { opacity: .6; animation: shpulse 1.3s ease-in-out infinite; }
    .sh-flash { fill: var(--gold); opacity: 0; animation: shflash 1.3s ease-out; }
    @keyframes shpulse { 50% { opacity: .25; } }
    @keyframes shflash { 15% { opacity: .45; } 100% { opacity: 0; } }
    /* the finished look */
    .sh .sh-lines, .sh .sh-marks, .sh .sh-texts { transition: opacity .9s; }
    .sh-nonogram.won .sh-lines { opacity: .12; }
    .sh-nonogram.won .sh-texts { opacity: .45; }
    .sh-paper { fill: #f6f1e4; animation: shfade .5s ease-out both; }
    .sh-px { stroke: rgba(0,0,0,.12); stroke-width: .8; transform-box: fill-box; transform-origin: center; animation: shpx .55s cubic-bezier(.3,1.5,.5,1) both; }
    .sh.still .sh-px, .sh.still .sh-paper { animation: none; }
    @keyframes shfade { from { opacity: 0; } }
    @keyframes shpx { from { opacity: 0; transform: scale(.2); } }
    .sh-akari.won:not(.still) .sh-halo { animation: shglow 1.4s ease-in-out 2; }
    @keyframes shglow { 50% { opacity: .7; } }
    .sh-starbattle.won:not(.still) .sh-star { transform-box: fill-box; transform-origin: center; animation: shtwinkle .8s ease-in-out 2; }
    @keyframes shtwinkle { 50% { transform: scale(1.25) rotate(18deg); } }
    .sh-takuzu.won:not(.still) .sh-disc { transform-box: fill-box; transform-origin: center; animation: shpop .6s ease-out; }
    @keyframes shpop { 40% { transform: scale(1.15); } }
    /* the side panel */
    .sh-panel { display: grid; gap: 8px; margin: 10px 0; }
    .sh-seg { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .sh-segl { color: var(--muted); font-size: 13px; margin-right: 2px; }
    .sh-segb { border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: 8px; padding: 5px 12px; font: 600 13px "Segoe UI", system-ui, sans-serif; cursor: pointer; }
    .sh-segb.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .sh-tip { color: var(--muted); font-size: 12.5px; }
    .sh-opt { color: var(--text); font-size: 13px; display: flex; align-items: center; gap: 6px; cursor: pointer; }
    @media (prefers-reduced-motion: reduce) { .sh-px, .sh-paper, .sh-ghost { animation: none !important; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
