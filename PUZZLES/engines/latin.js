/* The Puzzle Cabinet · engines/latin.js
 *
 * Number-in-cell pencil puzzles on a Latin square: Sudoku (with boxes, jigsaw
 * regions or diagonals), KenKen, Futoshiki and Skyscrapers. One grid, one way
 * of playing: pick a cell, type a digit; Space switches to pencil marks.
 *
 * The rules, the solution counter and the human-style solver behind the
 * hints live in js/lib/latin-logic.js (Cabinet.Latin); see it for p.data.
 *
 * The engine state: { v: the player's digits ('.' = none), m: pencil marks
 * (bit v = digit v), t: skyscraper clues ticked off }.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const CELL = 60;
  const KINDS = { sudoku: 'Sudoku', kenken: 'KenKen', futoshiki: 'Futoshiki', skyscrapers: 'Skyscrapers' };

  /* ---------- geometry (shared by the board and the thumbnails) ---------- */

  function geom(d) {
    const n = d.n, gap = d.kind === 'futoshiki' ? 26 : 0, pitch = CELL + gap;
    return { n, gap, pitch, size: n * CELL + (n - 1) * gap, margin: d.kind === 'skyscrapers' ? CELL * 0.9 : 0 };
  }
  const cellX = (G, i) => (i % G.n) * G.pitch;
  const cellY = (G, i) => Math.floor(i / G.n) * G.pitch;

  function regionOf(d) {
    const n = d.n, N = n * n, reg = new Array(N);
    if (d.regions) { for (let i = 0; i < N; i++) reg[i] = d.regions.charCodeAt(i) - 97; return reg; }
    if (d.box) { const perRow = n / d.box[1]; for (let i = 0; i < N; i++) reg[i] = Math.floor(Math.floor(i / n) / d.box[0]) * perRow + Math.floor((i % n) / d.box[1]); return reg; }
    return reg.fill(0);
  }
  function cageMap(d) {
    const m = new Array(d.n * d.n).fill(-1);
    (d.cages || []).forEach((cg, k) => cg.slice(2).forEach((i) => { m[i] = k; }));
    return m;
  }

  // the lines between cells: thin inside a group (box, cage), thick between groups
  function edgePaths(G, groupOf) {
    let thin = '', thick = '';
    const n = G.n, S = CELL;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const i = r * n + c;
        if (c < n - 1) { const seg = 'M' + (c + 1) * S + ' ' + r * S + 'v' + S; if (groupOf[i] !== groupOf[i + 1]) thick += seg; else thin += seg; }
        if (r < n - 1) { const seg = 'M' + c * S + ' ' + (r + 1) * S + 'h' + S; if (groupOf[i] !== groupOf[i + n]) thick += seg; else thin += seg; }
      }
    }
    return { thin, thick };
  }

  // a Futoshiki sign between cells a and b (a < b): its point faces a
  function signPath(G, a, b) {
    const s = 7.5, w = s * 0.62;
    const ax = cellX(G, a), ay = cellY(G, a), bx = cellX(G, b), by = cellY(G, b);
    if (ay === by) {
      const cx = (Math.min(ax, bx) + CELL + Math.max(ax, bx)) / 2, cy = ay + CELL / 2, dir = ax < bx ? -1 : 1;
      return 'M' + (cx - dir * w) + ' ' + (cy - s) + 'L' + (cx + dir * w) + ' ' + cy + 'L' + (cx - dir * w) + ' ' + (cy + s);
    }
    const cy = (Math.min(ay, by) + CELL + Math.max(ay, by)) / 2, cx = ax + CELL / 2, dir = ay < by ? -1 : 1;
    return 'M' + (cx - s) + ' ' + (cy - dir * w) + 'L' + cx + ' ' + (cy + dir * w) + 'L' + (cx + s) + ' ' + (cy - dir * w);
  }

  function cluePos(G, side, k) {
    const m = G.margin / 2 + 3, S = CELL;
    if (side === 't') return [k * S + S / 2, -m];
    if (side === 'b') return [k * S + S / 2, G.size + m];
    if (side === 'l') return [-m, k * S + S / 2];
    return [G.size + m, k * S + S / 2];
  }

  // where pencil mark v sits in a cell (KenKen leaves the top for the cage label)
  function markPos(n, v, kenken) {
    const cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols);
    const top = kenken ? 0.3 : 0.07, bot = 0.95, left = 0.08, right = 0.92;
    const sw = CELL * (right - left) / cols, sh = CELL * (bot - top) / rows;
    const k = v - 1;
    return { x: CELL * left + sw * (k % cols + 0.5), y: CELL * top + sh * (Math.floor(k / cols) + 0.5), fs: Math.min(sh * 0.8, sw * 0.86, 17) };
  }

  function numSize(d) { return d.n >= 9 ? 36 : d.n >= 7 ? 35 : 36; }

  // colour jigsaw regions with four soft tints so that neighbours differ
  function regionColours(n, reg) {
    const N = n * n, adj = Array.from({ length: n }, () => new Set());
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / n), c = i % n;
      if (c < n - 1 && reg[i] !== reg[i + 1]) { adj[reg[i]].add(reg[i + 1]); adj[reg[i + 1]].add(reg[i]); }
      if (r < n - 1 && reg[i] !== reg[i + n]) { adj[reg[i]].add(reg[i + n]); adj[reg[i + n]].add(reg[i]); }
    }
    const col = new Array(n).fill(-1);
    for (let k = 0; k < n; k++) {
      const used = new Set(Array.from(adj[k]).map((j) => col[j]));
      let c = 0;
      while (used.has(c)) c++;
      col[k] = c % 5;
    }
    return col;
  }

  function goalOf(d) {
    const n = d.n;
    if (d.kind === 'sudoku') return 'Every row, column and ' + (d.regions ? 'region' : 'box') + (d.diag ? ' — and both diagonals —' : '') + ' holds 1 to ' + n + ' once each.';
    if (d.kind === 'kenken') return 'Rows and columns hold 1 to ' + n + ' once each, and every cage makes its number.';
    if (d.kind === 'futoshiki') return 'Rows and columns hold 1 to ' + n + ' once each, and every sign is true.';
    return 'Rows and columns hold 1 to ' + n + ' once each, and every edge clue sees the right number of buildings.';
  }

  /* ---------- checking a puzzle file ---------- */

  function shapeErr(d) {
    const n = d.n, N = n * n;
    if (!KINDS[d.kind]) return 'unknown kind ' + d.kind;
    if (!(n >= 3 && n <= 9)) return 'n must be 3..9';
    if (!d.sol || d.sol.length !== N || !/^[1-9]+$/.test(d.sol)) return 'a full solution (sol) is needed';
    if (d.givens && (d.givens.length !== N || !/^[.1-9]+$/.test(d.givens))) return 'givens must have ' + N + ' characters';
    if (d.kind === 'sudoku') {
      if (d.regions) {
        if (d.regions.length !== N) return 'regions must have ' + N + ' letters';
        const reg = regionOf(d), size = {};
        reg.forEach((k) => { size[k] = (size[k] || 0) + 1; });
        if (Object.keys(size).length !== n || Object.values(size).some((s) => s !== n)) return 'there must be ' + n + ' regions of ' + n + ' cells';
        for (const k of Object.keys(size)) if (!connectedCells(n, reg.map((x, i) => (String(x) === k ? i : -1)).filter((i) => i >= 0))) return 'region ' + k + ' is in pieces';
      } else if (!d.box || d.box[0] * d.box[1] !== n || n % d.box[0] || n % d.box[1]) return 'box must be [h, w] with h × w = n';
    }
    if (d.kind === 'kenken') {
      if (!Array.isArray(d.cages) || !d.cages.length) return 'cages are needed';
      const seen = new Array(N).fill(0);
      for (const cg of d.cages) {
        const cells = cg.slice(2);
        if (!('+-*/='.includes(cg[1])) || !(cg[0] > 0)) return 'bad cage ' + JSON.stringify(cg);
        if ((cg[1] === '-' || cg[1] === '/') && cells.length !== 2) return 'a − or ÷ cage needs two cells';
        if (cg[1] === '=' && cells.length !== 1) return 'a cage without a sign has one cell';
        cells.forEach((i) => { seen[i]++; });
        if (!connectedCells(n, cells)) return 'cage ' + JSON.stringify(cg) + ' is in pieces';
      }
      if (seen.some((x) => x !== 1)) return 'every cell must be in exactly one cage';
    }
    if (d.kind === 'futoshiki') {
      for (const pr of d.lt || []) {
        const a = pr[0], b = pr[1];
        if (!(a >= 0 && a < N && b >= 0 && b < N) || !(Math.abs(a - b) === n || (Math.abs(a - b) === 1 && Math.floor(a / n) === Math.floor(b / n)))) return 'sign between cells that do not touch: ' + pr;
      }
    }
    if (d.kind === 'skyscrapers') {
      const cl = d.clues;
      if (!cl || ['t', 'b', 'l', 'r'].some((s) => !Array.isArray(cl[s]) || cl[s].length !== n || cl[s].some((v) => !(v >= 0 && v <= n)))) return 'clues t, b, l, r must be ' + n + ' numbers 0..' + n;
    }
    return null;
  }

  function connectedCells(n, cells) {
    if (!cells.length) return false;
    const set = new Set(cells), seen = new Set([cells[0]]), stack = [cells[0]];
    while (stack.length) {
      const i = stack.pop(), r = Math.floor(i / n), c = i % n;
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([rr, cc]) => {
        const j = rr * n + cc;
        if (rr >= 0 && rr < n && cc >= 0 && cc < n && set.has(j) && !seen.has(j)) { seen.add(j); stack.push(j); }
      });
    }
    return seen.size === cells.length;
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'latin',
    name: 'Number grids',
    deps: ['js/lib/dlx.js', 'js/lib/latin-logic.js', 'js/lib/latin-make.js'],
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Click a cell (or move with the **arrow keys**) and type a digit. Type the same digit again, or press **Backspace**, to rub it out.\n\n' +
      '**Pencil marks**: press **Space** (or the ✎ button) to switch between big digits and small candidates, or hold **Shift** while you type a digit. Drag across cells, or Ctrl-click them, to mark several at once. *Fill notes* writes every candidate that is not ruled out by a digit in plain sight.\n\n' +
      'Clashes show in red, and the digit you are on lights up everywhere, pencil marks too (switch these off in the panel). Tap a Skyscrapers clue to tick it off. The number pad in the panel does everything by touch.\n\n' +
      '**Hints** point to a cell that can be worked out from here and say why; ask again and the digit is written in. Every puzzle has exactly one answer, reachable without guessing.',

    // Endless: a brand-new grid of the asked difficulty (js/lib/latin-make.js; the stored puzzles come from the same maker)
    generate(rng, level, meta) {
      const M = C.Latin && C.Latin.make;
      if (!M) return null;
      const kind = meta && KINDS[meta.id] ? meta.id : 'sudoku';
      const x = M.endless(rng, level, kind);
      if (!x) return null;
      const w = M.words(x.d, x.diff);
      return { title: w.title, text: w.text, diff: x.diff, tags: w.tags.concat(M.techTags(x.r)), data: x.d };
    },

    verify(p) {
      const Lt = C.Latin;
      if (!Lt) return { ok: false, err: 'js/lib/latin-logic.js is not loaded' };
      const d = p.data;
      if (!d) return { ok: false, err: 'no data' };
      const e = shapeErr(d);
      if (e) return { ok: false, err: e };
      const P = Lt.build(d);
      const bad = Lt.problems(P, P.sol);
      if (bad.length) return { ok: false, err: 'the stored solution breaks a rule (' + bad[0].type + ')' };
      for (let i = 0; i < P.N; i++) if (P.givens[i] && P.givens[i] !== P.sol[i]) return { ok: false, err: 'a given disagrees with the solution at cell ' + i };
      const c = Lt.count(P, P.givens, 2, 400000);
      if (c.aborted) return { ok: false, err: 'the solution count gave up' };
      if (c.n !== 1) return { ok: false, err: c.n ? 'more than one solution' : 'no solution' };
      if (c.first.join('') !== d.sol) return { ok: false, err: 'the one solution is not the stored one' };
      if (d.kind === 'sudoku' && C.DLX) {
        const x = Lt.dlxCount(P, 2);
        if (x && (x.aborted || x.n !== 1)) return { ok: false, err: 'dancing links count ' + x.n + ' solutions' };
      }
      const r = Lt.logic(P, P.givens);
      if (!r.solved) return { ok: false, err: 'cannot be finished without guessing' };
      const want = Lt.diffOf(P, r);
      if (p.diff !== want) return { ok: true, warn: 'diff ' + p.diff + ' but the grid grades as ' + want };
      return { ok: true };
    },

    thumb(p) {
      const d = p.data, n = d.n, G = geom(d), S = CELL;
      const pad = G.margin + 6, W = G.size + 2 * pad;
      let s = '<svg viewBox="' + (-pad) + ' ' + (-pad) + ' ' + W + ' ' + W + '" preserveAspectRatio="xMidYMid meet">';
      const font = ' font-family="Segoe UI, system-ui, sans-serif" text-anchor="middle"';
      if (d.kind === 'futoshiki') {
        for (let i = 0; i < n * n; i++) s += '<rect x="' + cellX(G, i) + '" y="' + cellY(G, i) + '" width="' + S + '" height="' + S + '" rx="7" fill="var(--cell)" stroke="var(--ink-2)" stroke-width="2.5"/>';
        (d.lt || []).forEach((pr) => { s += '<path d="' + signPath(G, pr[0], pr[1]) + '" fill="none" stroke="var(--gold)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>'; });
      } else {
        const groups = d.kind === 'sudoku' ? regionOf(d) : d.kind === 'kenken' ? cageMap(d) : new Array(n * n).fill(0);
        const e = edgePaths(G, groups);
        s += '<rect x="0" y="0" width="' + G.size + '" height="' + G.size + '" fill="var(--cell)"/>';
        if (d.diag) for (let k = 0; k < n; k++) s += '<rect x="' + k * S + '" y="' + k * S + '" width="' + S + '" height="' + S + '" fill="var(--accent)" opacity=".16"/><rect x="' + (n - 1 - k) * S + '" y="' + k * S + '" width="' + S + '" height="' + S + '" fill="var(--accent)" opacity=".16"/>';
        s += '<path d="' + e.thin + '" stroke="var(--ink-2)" stroke-opacity=".35" stroke-width="2"/>';
        s += '<path d="' + e.thick + '" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>';
        s += '<rect x="0" y="0" width="' + G.size + '" height="' + G.size + '" fill="none" stroke="var(--ink)" stroke-width="6"/>';
      }
      if (d.kind === 'kenken') {
        d.cages.forEach((cg) => {
          const a = Math.min.apply(null, cg.slice(2));
          s += '<text x="' + (cellX(G, a) + 5) + '" y="' + (cellY(G, a) + 19) + '" font-size="17" font-weight="700" fill="var(--ink)" font-family="Segoe UI, system-ui, sans-serif">' + cg[0] + ({ '+': '+', '-': '−', '*': '×', '/': '÷', '=': '' }[cg[1]]) + '</text>';
        });
      }
      if (d.clues) {
        ['t', 'b', 'l', 'r'].forEach((side) => d.clues[side].forEach((v, k) => {
          if (!v) return;
          const q = cluePos(G, side, k);
          s += '<text x="' + q[0] + '" y="' + (q[1] + 12) + '" font-size="34" font-weight="700" fill="var(--gold)"' + font + '>' + v + '</text>';
        }));
      }
      if (d.givens) {
        for (let i = 0; i < n * n; i++) {
          const ch = d.givens.charAt(i);
          if (ch === '.') continue;
          s += '<text x="' + (cellX(G, i) + S / 2) + '" y="' + (cellY(G, i) + S / 2 + 13) + '" font-size="38" font-weight="700" fill="var(--ink)"' + font + '>' + ch + '</text>';
        }
      }
      return s + '</svg>';
    },

    mount(ctx, p) {
      return mountGrid(ctx, p);
    }
  });

  /* ---------- playing ---------- */

  const SOLVED = ['Not a digit out of place.', 'Every line checks out.', 'Neat as a pin.', 'Euler would approve.', 'All present and correct.'];

  function mountGrid(ctx, p) {
    const Lt = C.Latin, d = p.data, wb = ctx.wb, s = ctx.s, h = ctx.h;
    const P = Lt.build(d);
    const n = P.n, N = P.N, G = geom(d), S = CELL, B = Lt.B;
    const given = P.givens, kenken = d.kind === 'kenken';
    let vals = new Int8Array(N), marks = new Int32Array(N), ticks = {};
    let sel = [], cur = -1, pencil = false, busy = false, dead = false;
    let lastHint = null, hintEls = [], dragging = false, timer = null;
    const opts = Object.assign({ conflicts: true, tidy: true, light: true }, C.store.get('latin-opts', {}) || {});

    ctx.setGoal(goalOf(d));

    /* the board */
    const board = wb.layer('board'), topL = wb.layer('top');
    const pad = G.margin + 10;
    // a little room at the bottom so the zoom buttons (bottom right) do not sit on a cell
    wb.setBounds({ x0: -pad, y0: -pad, x1: G.size + pad, y1: G.size + pad + 38 }, 0.04);
    const g0 = s('g', { class: 'lt lt-' + d.kind }, board);
    if (!G.gap) s('rect', { x: -1, y: -1, width: G.size + 2, height: G.size + 2, class: 'lt-under' }, g0);
    const gCells = s('g', null, g0);
    const gTint = s('g', { class: 'lt-nohit' }, g0);
    const gHl = s('g', { class: 'lt-nohit' }, g0);
    const gLines = s('g', { class: 'lt-nohit' }, g0);
    const gDeco = s('g', null, g0);
    const gText = s('g', { class: 'lt-nohit' }, g0);
    const cursorEl = s('rect', { class: 'lt-cursor', width: S - 5, height: S - 5, rx: G.gap ? 6 : 3 }, g0);

    const rx = G.gap ? 7 : 0, fsNum = numSize(d);
    const E = [];
    for (let i = 0; i < N; i++) {
      const x = cellX(G, i), y = cellY(G, i);
      const rect = s('rect', { x, y, width: S, height: S, rx, class: 'lt-cell' + (given[i] ? ' given' : ''), 'data-key': 'c' + i }, gCells);
      const hl = s('rect', { x, y, width: S, height: S, rx, class: 'lt-hl' }, gHl);
      const num = s('text', { x: x + S / 2, y: y + S * (kenken ? 0.59 : 0.53), 'font-size': fsNum, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'lt-num' }, gText);
      const mk = [];
      for (let v = 1; v <= n; v++) {
        const q = markPos(n, v, kenken);
        const t = s('text', { x: (x + q.x).toFixed(1), y: (y + q.y).toFixed(1), 'font-size': q.fs.toFixed(1), 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'lt-mark', text: String(v) }, gText);
        t.style.display = 'none';
        mk.push(t);
      }
      E.push({ rect, hl, num, mk });
    }

    // lines, regions, cages, signs, clues
    let cageEls = [], signEls = [], clueEls = {};
    if (d.kind === 'futoshiki') {
      signEls = P.lt.map((pr) => s('path', { d: signPath(G, pr[0], pr[1]), class: 'lt-sign' }, gDeco));
    } else {
      const groups = d.kind === 'sudoku' ? Array.from(P.region) : kenken ? Array.from(P.cageOf) : new Array(N).fill(0);
      const e = edgePaths(G, groups);
      s('path', { d: e.thin, class: 'lt-thin' }, gLines);
      if (e.thick) s('path', { d: e.thick, class: kenken ? 'lt-cage' : 'lt-thick' }, gLines);
      s('rect', { x: 0, y: 0, width: G.size, height: G.size, class: 'lt-frame' }, gLines);
    }
    if (d.kind === 'sudoku' && d.regions) {
      const col = regionColours(n, P.region);
      for (let i = 0; i < N; i++) s('rect', { x: cellX(G, i), y: cellY(G, i), width: S, height: S, class: 'lt-tint t' + col[P.region[i]] }, gTint);
    }
    if (d.diag) {
      for (let k = 0; k < n; k++) {
        [k * n + k, k * n + (n - 1 - k)].forEach((i) => s('rect', { x: cellX(G, i), y: cellY(G, i), width: S, height: S, class: 'lt-tint diag' }, gTint));
      }
      s('path', { d: 'M0 0L' + G.size + ' ' + G.size + 'M' + G.size + ' 0L0 ' + G.size, class: 'lt-diagline' }, gTint);
    }
    if (kenken) {
      cageEls = P.cages.map((cg) => s('text', { x: cellX(G, cg.anchor) + 5, y: cellY(G, cg.anchor) + 15.5, class: 'lt-cagelbl', text: Lt.cageLabel(cg) }, gDeco));
    }
    if (d.clues) {
      ['t', 'b', 'l', 'r'].forEach((side) => d.clues[side].forEach((v, k) => {
        if (!v) return;
        const q = cluePos(G, side, k);
        const hit = s('rect', { x: q[0] - S * 0.38, y: q[1] - S * 0.38, width: S * 0.76, height: S * 0.76, rx: 10, class: 'lt-cluehit' }, gDeco);
        const t = s('text', { x: q[0], y: q[1], 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'lt-clue', text: String(v) }, gDeco);
        clueEls[side + k] = { hit, t, q };
      }));
    }

    /* on a narrow screen the panel sits below the stage, so a row of keys goes right under the grid */
    const narrow = !!(root.matchMedia && root.matchMedia('(max-width: 980px)').matches);
    const strip = narrow ? (() => {
      const x0 = -G.margin, W = G.size + 2 * G.margin, count = n + 2, gap = 6;
      const kw = (W - gap * (count - 1)) / count, kh = Math.min(64, kw * 1.1);
      const y0 = G.size + G.margin + 16;
      const gS = s('g', { class: 'lt-strip' }, g0);
      const keys = [];
      for (let k = 0; k < count; k++) {
        const x = x0 + k * (kw + gap);
        const g = s('g', { class: 'lt-skey' }, gS);
        s('rect', { x, y: y0, width: kw, height: kh, rx: 10 }, g);
        const label = k < n ? String(k + 1) : k === n ? '✎' : '⌫';
        s('text', { x: x + kw / 2, y: y0 + kh / 2, 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': Math.min(30, kh * 0.52), text: label }, g);
        keys.push({ g, x, act: k < n ? k + 1 : k === n ? 'pen' : 'erase' });
      }
      // room at the top too: the zoom buttons float over the top right corner of a phone's stage
      wb.setBounds({ x0: -pad, y0: -pad - 46, x1: G.size + pad, y1: y0 + kh + 10 }, 0.03);
      return { keys, y0, kh, kw, at(pt) { if (pt[1] < y0 || pt[1] > y0 + kh) return null; const k = keys.find((q) => pt[0] >= q.x && pt[0] <= q.x + kw); return k ? k.act : null; } };
    })() : null;

    /* the panel: a number pad, pencil and notes, and three switches */
    const btn = (label, title, fn, cls) => {
      const b = h('button.lt-b' + (cls ? '.' + cls : ''), { type: 'button', tabindex: '-1', title, 'aria-label': title });
      if (typeof label === 'string') b.innerHTML = label; else b.appendChild(label);
      b.addEventListener('mousedown', (e) => e.preventDefault());
      b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
      return b;
    };
    const keysEl = h('div.lt-keys', { style: { gridTemplateColumns: 'repeat(' + n + ', minmax(0, 1fr))' } });
    const keys = [];
    for (let v = 1; v <= n; v++) {
      const b = btn('<b>' + v + '</b><small></small>', 'Digit ' + v + ' (type ' + v + '; Shift+' + v + ' for a pencil mark)', () => input(v, false), 'lt-key');
      keys.push(b);
      keysEl.appendChild(b);
    }
    const penBtn = btn(C.icon('pen') + '<span>Pencil</span>', 'Pencil marks on / off (Space)', () => togglePencil(), 'lt-pen');
    const row2 = h('div.lt-row',
      penBtn,
      btn(C.icon('eraser') + '<span>Erase</span>', 'Rub out the selected cells (Backspace)', () => erase()),
      btn('<span>Fill notes</span>', 'Pencil in every candidate not ruled out by a digit in plain sight', () => fillNotes()),
      btn('<span>Clear notes</span>', 'Rub out the pencil marks (of the selected cells, or all of them)', () => clearNotes())
    );
    const optBtns = {};
    const opt = (key, label, title) => { optBtns[key] = btn('<i></i><span>' + label + '</span>', title, () => { opts[key] = !opts[key]; C.store.set('latin-opts', opts); draw(); }, 'lt-opt'); return optBtns[key]; };
    const row3 = h('div.lt-row.lt-opts',
      opt('conflicts', 'Clashes', 'Show digits that break a rule in red'),
      opt('light', 'Highlight', 'Light up the row, column and box of the cell you are on, and every copy of its digit'),
      opt('tidy', 'Tidy notes', 'When you write a digit, rub it out of the pencil marks it sees')
    );
    ctx.panel.appendChild(h('div.lt-panel', keysEl, row2, row3));

    /* drawing the state */
    function grid() {
      const g = new Int8Array(N);
      for (let i = 0; i < N; i++) g[i] = given[i] || vals[i];
      return g;
    }

    function draw() {
      const g = grid();
      const bad = new Uint8Array(N), soft = new Uint8Array(N), badCage = {}, badLt = {}, badClue = {};
      if (opts.conflicts) {
        Lt.problems(P, g).forEach((q) => {
          if (q.type === 'dup') q.cells.forEach((i) => { bad[i] = 1; });
          else if (q.type === 'cage') { badCage[q.cage] = 1; q.cells.forEach((i) => { soft[i] = 1; }); }
          else if (q.type === 'lt') { badLt[q.k] = 1; q.cells.forEach((i) => { soft[i] = 1; }); }
          else if (q.type === 'clue') badClue[q.side + q.idx] = 1;
        });
      }
      const selSet = new Set(sel);
      const curV = cur >= 0 ? g[cur] : 0;
      const near = new Uint8Array(N);
      if (opts.light && cur >= 0) P.unitsOf[cur].forEach((k) => P.units[k].cells.forEach((j) => { near[j] = 1; }));
      const counts = new Array(n + 1).fill(0);
      for (let i = 0; i < N; i++) {
        const e = E[i], v = g[i];
        if (v) counts[v]++;
        const on = selSet.has(i);
        const hc = 'lt-hl' + (on ? (pencil ? ' sel pen' : ' sel') : '') + (!on && opts.light && curV && v === curV ? ' same' : '') +
          (!on && near[i] ? ' near' : '') + (bad[i] ? ' bad' : soft[i] ? ' soft' : '');
        if (e.hc !== hc) { e.hl.setAttribute('class', hc); e.hc = hc; }
        const txt = v ? String(v) : '';
        if (e.txt !== txt) { e.num.textContent = txt; e.txt = txt; }
        const nc = 'lt-num' + (given[i] ? ' given' : ' user') + (bad[i] ? ' bad' : '');
        if (e.nc !== nc) { e.num.setAttribute('class', nc); e.nc = nc; }
        const mm = v ? 0 : marks[i], hiV = opts.light ? curV : 0;
        const mkey = mm * 16 + hiV;
        if (e.mkey !== mkey) {
          e.mkey = mkey;
          for (let k = 1; k <= n; k++) {
            const t = e.mk[k - 1], show = !!(mm & (1 << k));
            t.style.display = show ? '' : 'none';
            if (show) t.setAttribute('class', 'lt-mark' + (hiV === k ? ' hi' : ''));
          }
        }
      }
      if (cur >= 0) {
        cursorEl.style.display = '';
        cursorEl.setAttribute('x', cellX(G, cur) + 2.5);
        cursorEl.setAttribute('y', cellY(G, cur) + 2.5);
        cursorEl.setAttribute('class', 'lt-cursor' + (pencil ? ' pen' : ''));
      } else cursorEl.style.display = 'none';
      cageEls.forEach((el, k) => el.setAttribute('class', 'lt-cagelbl' + (badCage[k] ? ' bad' : '')));
      signEls.forEach((el, k) => el.setAttribute('class', 'lt-sign' + (badLt[k] ? ' bad' : '')));
      for (const k in clueEls) clueEls[k].t.setAttribute('class', 'lt-clue' + (badClue[k] ? ' bad' : '') + (ticks[k] ? ' done' : ''));
      keys.forEach((b, k) => {
        const left = n - counts[k + 1];
        b.classList.toggle('full', left <= 0);
        b.classList.toggle('on', !!curV && curV === k + 1);
        b.querySelector('small').textContent = left > 0 ? String(left) : '✓';
      });
      penBtn.classList.toggle('on', pencil);
      for (const k in optBtns) optBtns[k].classList.toggle('on', !!opts[k]);
      if (strip) {
        strip.keys.forEach((q) => {
          const full = typeof q.act === 'number' && counts[q.act] >= n;
          q.g.setAttribute('class', 'lt-skey' + (full ? ' full' : '') + (q.act === 'pen' && pencil ? ' on' : '') + (typeof q.act === 'number' && curV === q.act ? ' cur' : ''));
        });
      }
    }

    /* choosing cells */
    function cellAt(pt) {
      const c = Math.floor(pt[0] / G.pitch), r = Math.floor(pt[1] / G.pitch);
      if (c < 0 || r < 0 || c >= n || r >= n) return -1;
      if (pt[0] - c * G.pitch > S || pt[1] - r * G.pitch > S) return -1;
      return r * n + c;
    }
    function clueAt(pt) {
      for (const k in clueEls) {
        const q = clueEls[k].q;
        if (Math.abs(pt[0] - q[0]) < S * 0.42 && Math.abs(pt[1] - q[1]) < S * 0.42) return k;
      }
      return null;
    }
    function pick(i, add) {
      if (add) {
        const at = sel.indexOf(i);
        if (at >= 0 && sel.length > 1) { sel.splice(at, 1); cur = sel[sel.length - 1]; }
        else if (at < 0) { sel.push(i); cur = i; }
      } else { sel = [i]; cur = i; }
      clearHint();
      draw();
    }
    wb.handlers.board = {
      down(pt, ev) {
        const sk = strip && strip.at(pt);
        if (sk) {
          if (sk === 'pen') togglePencil(); else if (sk === 'erase') erase(); else input(sk, false);
          return true;
        }
        const ck = clueAt(pt);
        if (ck) {
          if (ticks[ck]) delete ticks[ck]; else ticks[ck] = 1;
          draw();
          ctx.changed('tick');
          return true;
        }
        const i = cellAt(pt);
        if (i < 0) {
          if (sel.length) { sel = []; cur = -1; draw(); }
          return false;
        }
        pick(i, ev.shiftKey || ev.ctrlKey || ev.metaKey);
        dragging = true;
        return true;
      },
      move(pt) {
        if (!dragging) return;
        const i = cellAt(pt);
        if (i >= 0 && sel.indexOf(i) < 0) { sel.push(i); cur = i; draw(); }
      },
      up() { dragging = false; }
    };

    function moveCursor(dr, dc, extend) {
      if (cur < 0) { pick(Math.floor(n / 2) * n + Math.floor(n / 2), false); return; }
      const r = (Math.floor(cur / n) + dr + n) % n, c = (cur % n + dc + n) % n, t = r * n + c;
      if (!extend) { pick(t, false); return; }
      if (sel.indexOf(t) < 0) sel.push(t);
      cur = t;
      clearHint();
      draw();
    }

    /* writing (a pending hint survives: asking again still writes its digit, which is forced) */
    function commit(why) {
      clearHint();
      draw();
      ctx.changed(why);
    }
    function tidyAround(i, v) {
      if (!opts.tidy) return;
      P.peers[i].forEach((j) => { marks[j] &= ~B(v); });
    }
    function input(v, asMark) {
      if (busy) return;
      if (!sel.length) { ctx.toast('Pick a cell first: click one, or use the arrow keys.'); return; }
      const cells = sel.filter((i) => !given[i]);
      if (!cells.length) { ctx.say('That digit is printed on the puzzle, so it stays.'); return; }
      if (asMark || pencil || cells.length > 1) {
        const open = cells.filter((i) => !vals[i]);
        if (!open.length) { ctx.say('Pencil marks go in empty cells: rub out the digit first.'); return; }
        const all = open.every((i) => marks[i] & B(v));
        open.forEach((i) => { if (all) marks[i] &= ~B(v); else marks[i] |= B(v); });
        commit('pencil');
        return;
      }
      const i = cells[0];
      if (vals[i] === v) vals[i] = 0;
      else { vals[i] = v; tidyAround(i, v); }
      commit('digit');
    }
    function erase() {
      if (busy || !sel.length) return;
      const cells = sel.filter((i) => !given[i]);
      if (!cells.length) return;
      if (cells.some((i) => vals[i])) cells.forEach((i) => { vals[i] = 0; });
      else if (cells.some((i) => marks[i])) cells.forEach((i) => { marks[i] = 0; });
      else return;
      commit('erase');
    }
    function fillNotes() {
      if (busy) return;
      const g = grid();
      let any = false;
      for (let i = 0; i < N; i++) {
        if (g[i]) continue;
        let m = P.full;
        P.peers[i].forEach((j) => { if (g[j]) m &= ~B(g[j]); });
        if (kenken) { const cg = P.cages[P.cageOf[i]]; if (cg.op === '=') m &= B(cg.t); }
        if (marks[i] !== m) { marks[i] = m; any = true; }
      }
      if (any) commit('notes'); else ctx.say('Your notes already hold every candidate.');
    }
    function clearNotes() {
      if (busy) return;
      const cells = sel.length > 1 ? sel : Array.from({ length: N }, (_, i) => i);
      if (!cells.some((i) => marks[i])) return;
      cells.forEach((i) => { marks[i] = 0; });
      commit('notes');
    }
    function togglePencil() {
      pencil = !pencil;
      ctx.toast(pencil ? 'Pencil marks: small digits' : 'Big digits');
      draw();
    }

    /* hints */
    function clearHint() {
      hintEls.forEach((el) => el.remove());
      hintEls = [];
    }
    function mark(cells, cls) {
      cells.forEach((i) => {
        hintEls.push(s('rect', { x: cellX(G, i) + 2, y: cellY(G, i) + 2, width: S - 4, height: S - 4, rx: G.gap ? 6 : 3, class: 'lt-hint ' + cls }, topL));
      });
    }
    function showMarks(target, unit, witnesses, involved) {
      clearHint();
      mark(unit, 'area');
      mark(involved, 'why');
      mark(witnesses, 'wit');
      if (target != null) mark([target], 'target');
    }
    function stepCells(st) {
      const out = new Set();
      (st.cells || []).forEach((i) => out.add(i));
      (st.elims || []).forEach((e) => out.add(e[0]));
      if (st.cage != null && P.cages) P.cages[st.cage].cells.forEach((i) => out.add(i));
      if (st.cell != null) { out.add(st.cell); out.add(st.other); }
      if (st.line != null && P.lines) P.lines[st.line].cells.forEach((i) => out.add(i));
      if (st.pivot != null) { out.add(st.pivot); st.wings.forEach((i) => out.add(i)); }
      return Array.from(out);
    }
    function problemText(q) {
      if (q.type === 'dup') {
        const u = P.units[q.unit];
        const many = ['', '', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'][q.cells.length];
        return many + ' **' + q.v + '**s in ' + u.name + ' — one of them is an impostor.';
      }
      if (q.type === 'cage') {
        const cg = P.cages[q.cage];
        return 'The **' + Lt.cageLabel(cg) + '** cage at ' + Lt.cn(P, cg.anchor) + (cg.op === '=' ? ' holds just ' + cg.t + '.' : ' does not come to ' + cg.t + '.');
      }
      if (q.type === 'lt') return 'The sign between ' + Lt.cn(P, q.cells[0]) + ' and ' + Lt.cn(P, q.cells[1]) + ' is not true.';
      if (q.type === 'clue') {
        const k = q.side + q.idx;
        const v = d.clues[q.side][q.idx];
        return 'The clue **' + v + '** ' + ({ l: 'left of row ', r: 'right of row ', t: 'above column ', b: 'below column ' }[q.side]) + (q.idx + 1) + ' sees ' + (clueEls[k] ? 'the wrong number of buildings.' : 'too many buildings.');
      }
      return 'Something breaks a rule.';
    }
    function hintText(res) {
      const S0 = res.S, st = res.step, i = st.place[0], v = st.place[1];
      const rs = res.reasons.steps.map((k) => S0.steps[k]);
      const again = ' *Ask again and I will write it in.*';
      // a one-cell cage is a given in disguise
      if (kenken && st.tech === 'single' && rs.length === 1 && rs[0].tech === 'cage' && P.cages[rs[0].cage].op === '=' && P.cageOf[i] === rs[0].cage) {
        return 'The one-cell cage at **' + Lt.cn(P, i) + '** gives it away: it is **' + v + '**.' + again;
      }
      let t = Lt.say(S0, st);
      if (!rs.length) {
        t += st.tech === 'hidden' ? ' Every other empty cell there already sees ' + Lt.an(v) + ' ' + v + '.' : ' Every other digit is already in its ' + Lt.kindUnits(P) + '.';
      } else {
        t += ' To see it: ' + rs.slice(0, 3).map((r) => Lt.say(S0, r)).join(' ');
        if (rs.length > 3) t += rs.length === 4 ? ' (And one more step like these.)' : ' (And ' + (rs.length - 3) + ' more steps like these.)';
        if (res.reasons.plain) t += st.tech === 'hidden' ? ' The ' + v + 's already on the board rule out the rest.' : ' The other digits are already in its ' + Lt.kindUnits(P) + '.';
      }
      return t + again;
    }

    function hint() {
      if (busy) return null;
      const g = grid();
      const probs = Lt.problems(P, g);
      if (probs.length) {
        const q = probs[0];
        return { text: problemText(q) + ' Sort that out first — undo is on Ctrl+Z.', show() { showMarks(null, [], q.cells, []); } };
      }
      const sol = P.sol;
      const wrong = [];
      for (let i = 0; i < N; i++) if (vals[i] && vals[i] !== sol[i]) wrong.push(i);
      if (wrong.length) {
        const i = wrong[0];
        return { text: 'No clash yet, but the **' + vals[i] + '** at ' + Lt.cn(P, i) + ' is not right' + (wrong.length > 1 ? ' (and ' + C.plural(wrong.length - 1, 'other digit') + ' too)' : '') + '. Rub it out and look again.', show() { pick(i, false); showMarks(i, [], [], []); } };
      }
      for (let i = 0; i < N; i++) {
        if (!g[i] && marks[i] && !(marks[i] & B(sol[i]))) {
          return { text: 'Careful with your pencil marks at ' + Lt.cn(P, i) + ': the digit that belongs there is not among them.', show() { pick(i, false); showMarks(i, [], [], []); } };
        }
      }
      if (lastHint && !g[lastHint.i]) {
        const i = lastHint.i, v = lastHint.v;
        vals[i] = v;
        tidyAround(i, v);
        sel = [i]; cur = i;
        commit('hint');
        return { text: 'Written in: **' + v + '** at ' + Lt.cn(P, i) + '.', show() { showMarks(i, [], [], []); } };
      }
      let empty = 0;
      for (let i = 0; i < N; i++) if (!g[i]) empty++;
      if (!empty) return 'Every cell is filled and nothing clashes. Press Check!';
      const res = Lt.hintStep(P, g);
      if (res.step) {
        const st = res.step, i = st.place[0], v = st.place[1], S0 = res.S;
        lastHint = { i, v };
        const unit = st.unit != null ? P.units[st.unit].cells.filter((j) => j !== i) : P.unitsOf[i].reduce((a, k) => a.concat(P.units[k].cells), []).filter((j) => j !== i);
        const wit = new Set();
        if (st.tech === 'hidden') {
          P.units[st.unit].cells.forEach((j) => {
            if (j === i || S0.g[j] || S0.why[j * 16 + v] !== -1) return;
            const k = P.peers[j].find((x) => S0.g[x] === v);
            if (k != null) wit.add(k);
          });
        } else {
          for (let u = 1; u <= n; u++) {
            if (u === v || S0.why[i * 16 + u] !== -1) continue;
            const k = P.peers[i].find((x) => S0.g[x] === u);
            if (k != null) wit.add(k);
          }
        }
        const inv = new Set();
        res.reasons.steps.forEach((k) => stepCells(S0.steps[k]).forEach((j) => inv.add(j)));
        return { text: hintText(res), show() { sel = [i]; cur = i; draw(); showMarks(i, unit, Array.from(wit), Array.from(inv).filter((j) => j !== i)); } };
      }
      // should not happen for a verified puzzle: fall back on the stored answer
      const i = Array.from(g).findIndex((v) => !v);
      lastHint = null;
      vals[i] = sol[i];
      sel = [i]; cur = i;
      commit('hint');
      return { text: 'My pencil is stuck here, so I have simply written in the **' + sol[i] + '** at ' + Lt.cn(P, i) + '.', show() { showMarks(i, [], [], []); } };
    }

    /* the solution, filled in as a wave from the top-left corner */
    function solve() {
      if (busy) return;
      const sol = P.sol;
      const todo = [];
      for (let i = 0; i < N; i++) if (!given[i] && vals[i] !== sol[i]) todo.push(i);
      clearHint();
      lastHint = null;
      if (!todo.length) { ctx.changed('solve'); return; }
      busy = true;
      const waves = {};
      todo.forEach((i) => { const w = Math.floor(i / n) + (i % n); (waves[w] = waves[w] || []).push(i); });
      const order = Object.keys(waves).map(Number).sort((a, b) => a - b);
      let k = 0;
      const step = () => {
        if (dead) return;
        waves[order[k++]].forEach((i) => { vals[i] = sol[i]; });
        draw();
        if (k < order.length) timer = setTimeout(step, C.anim(55));
        else { busy = false; timer = null; ctx.changed('solve'); }
      };
      step();
    }

    draw();

    return {
      noMoves: true,
      check(manual) {
        const g = grid();
        const probs = Lt.problems(P, g);
        let empty = 0;
        for (let i = 0; i < N; i++) if (!g[i]) empty++;
        if (!probs.length && !empty) return { solved: true, msg: SOLVED[(C.hash(p.id) >>> 3) % SOLVED.length] };
        if (probs.length) return { solved: false, msg: problemText(probs[0]) };
        return { solved: false, msg: empty === 1 ? 'One cell is still empty.' : empty + ' cells are still empty.' };
      },
      hint,
      solve,
      explain() {
        const r = Lt.logic(P, P.givens);
        const names = { pointing: 'pointing (a digit stuck in one line of a box)', naked2: 'naked pairs', hidden2: 'hidden pairs', naked3: 'naked triples', hidden3: 'hidden triples', naked4: 'quads', hidden4: 'hidden quads', fish2: 'X-wings', fish3: 'swordfish', xywing: 'XY-wings', cagemust: 'digits a cage must hold', lt: 'the signs', edge: 'the edge clues', cage: 'cage arithmetic', line: 'whole-line arrangements', hidden: 'hidden singles', single: 'naked singles' };
        const used = Object.keys(r.counts).map((k) => names[k]).filter(Boolean);
        return 'This grid can be finished by reasoning alone, in ' + C.plural(r.S.steps.length, 'step') + '. The tools it needs: ' + Lt.andList(Array.from(new Set(used))) + '.';
      },
      getState() {
        const m = Array.from(marks);
        while (m.length && !m[m.length - 1]) m.pop();
        return { v: Lt.gridStr(vals), m, t: Object.keys(ticks) };
      },
      setState(st) {
        if (!st) return;
        if (timer) { clearTimeout(timer); timer = null; busy = false; }
        vals = st.v ? Lt.parseGrid(st.v, N) : new Int8Array(N);
        marks = new Int32Array(N);
        (st.m || []).forEach((m, i) => { if (i < N) marks[i] = m; });
        ticks = {};
        (st.t || []).forEach((k) => { ticks[k] = 1; });
        lastHint = null;
        clearHint();
        draw();
      },
      reset() { sel = []; cur = -1; pencil = false; lastHint = null; clearHint(); draw(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        // digits by key position, so Shift+digit works on every layout; a Shift that
        // itself makes the digit (AZERTY) writes a digit, any other Shift a pencil mark
        const m = /^(?:Digit|Numpad)([0-9])$/.exec(ev.code || '');
        const dg = m ? +m[1] : /^[0-9]$/.test(k) ? +k : 0;
        if (dg >= 1 && dg <= n) { input(dg, ev.shiftKey && !/^[0-9]$/.test(k)); return true; }
        if (k === ' ' || k === 'Spacebar') { togglePencil(); return true; }
        if (k === 'Backspace' || k === 'Delete') { erase(); return true; }
        const dir = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
        if (dir) { moveCursor(dir[0], dir[1], ev.shiftKey); return true; }
        if (k === 'Escape' && sel.length) { sel = []; cur = -1; clearHint(); draw(); return false; }
        return false;
      },
      destroy() { dead = true; if (timer) clearTimeout(timer); }
    };
  }

  C.css('latin', `
    .lt .lt-nohit, .lt-hint { pointer-events: none; }
    .lt-under { fill: var(--cell); }
    .lt-cell { fill: var(--cell); }
    .lt-futoshiki .lt-cell { stroke: var(--ink-2); stroke-width: 2.2; }
    .lt-hl { fill: transparent; }
    .lt-hl.near { fill: var(--accent); fill-opacity: .07; }
    .lt-hl.same { fill: var(--accent); fill-opacity: .2; }
    .lt-hl.sel { fill: var(--accent); fill-opacity: .3; }
    .lt-hl.sel.pen { fill: var(--teal); fill-opacity: .26; }
    .lt-hl.soft { fill: var(--red); fill-opacity: .12; }
    .lt-hl.bad { fill: var(--red); fill-opacity: .2; }
    .lt-tint.t0 { fill: var(--accent); fill-opacity: .1; }
    .lt-tint.t1 { fill: var(--teal); fill-opacity: .1; }
    .lt-tint.t2 { fill: var(--gold); fill-opacity: .1; }
    .lt-tint.t3 { fill: var(--pink); fill-opacity: .1; }
    .lt-tint.t4 { fill: var(--green); fill-opacity: .1; }
    .lt-tint.diag { fill: var(--purple); fill-opacity: .1; }
    .lt-diagline { stroke: var(--purple); stroke-opacity: .35; stroke-width: 1.5; stroke-dasharray: 3 6; fill: none; }
    .lt-thin { stroke: var(--ink-2); stroke-opacity: .32; stroke-width: 1.3; fill: none; }
    .lt-thick { stroke: var(--ink); stroke-width: 3.4; stroke-linecap: round; fill: none; }
    .lt-cage { stroke: var(--ink); stroke-width: 2.8; stroke-linecap: round; fill: none; }
    .lt-frame { stroke: var(--ink); stroke-width: 4.5; fill: none; }
    .lt-num { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 500; fill: #7f8cff; }
    [data-theme="light"] .lt-num { fill: #3a4bd8; }
    .lt-num.given { font-weight: 700; fill: var(--ink); }
    .lt-num.bad { fill: var(--red); }
    .lt-mark { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 600; fill: var(--ink-2); }
    .lt-mark.hi { fill: var(--accent); font-weight: 800; }
    [data-theme="dark"] .lt-mark.hi { fill: #a3adff; }
    .lt-cursor { fill: none; stroke: var(--accent); stroke-width: 3.2; pointer-events: none; }
    .lt-cursor.pen { stroke: var(--teal); stroke-dasharray: 7 4; }
    .lt-cagelbl { font: 700 13px "Segoe UI", system-ui, sans-serif; fill: var(--ink); pointer-events: none; }
    .lt-cagelbl.bad { fill: var(--red); }
    .lt-sign { fill: none; stroke: var(--gold); stroke-width: 3.6; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
    .lt-sign.bad { stroke: var(--red); }
    .lt-clue { font: 700 27px "Segoe UI", system-ui, sans-serif; fill: var(--gold); pointer-events: none; transition: opacity .2s; }
    .lt-clue.done { opacity: .3; }
    .lt-clue.bad { fill: var(--red); opacity: 1; }
    .lt-cluehit { fill: transparent; cursor: pointer; }
    .lt-cluehit:hover { fill: var(--gold); fill-opacity: .08; }
    .lt-hint { fill: none; }
    .lt-hint.area { fill: var(--gold); fill-opacity: .13; }
    .lt-hint.why { fill: var(--teal); fill-opacity: .16; }
    .lt-hint.wit { stroke: var(--gold); stroke-width: 2.5; stroke-dasharray: 5 4; }
    .lt-hint.target { stroke: var(--gold); stroke-width: 4; animation: ltpulse 1.1s ease-in-out infinite; }
    @keyframes ltpulse { 50% { stroke-opacity: .35; } }
    .lt-skey { cursor: pointer; }
    .lt-skey rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; }
    .lt-skey text { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--text); pointer-events: none; }
    .lt-skey.cur rect { fill: var(--accent); fill-opacity: .25; }
    .lt-skey.on rect { fill: var(--teal); stroke: var(--teal); }
    .lt-skey.on text { fill: #0b1a1a; }
    .lt-skey.full text { opacity: .35; }
    .lt-panel { width: 100%; display: flex; flex-direction: column; gap: 8px; }
    .lt-keys { display: grid; gap: 6px; }
    .lt-b { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 10px; border-radius: 10px;
      border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font: 600 .82rem "Segoe UI", system-ui, sans-serif;
      cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: manipulation; }
    .lt-b:hover { border-color: var(--accent); }
    .lt-b:active { transform: translateY(1px); }
    .lt-b .ico { width: 17px; height: 17px; }
    .lt-b.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .lt-key { position: relative; flex-direction: column; gap: 0; padding: 6px 0 4px; min-height: 48px; }
    .lt-key b { font-size: 1.35rem; line-height: 1.1; font-weight: 700; }
    .lt-key small { font-size: .62rem; color: var(--muted); font-weight: 600; }
    .lt-key.on { background: rgba(108, 123, 255, .22); color: var(--text); }
    .lt-key.full b { opacity: .35; }
    .lt-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .lt-row .lt-b { flex: 1 1 auto; }
    .lt-pen.on { background: var(--teal); border-color: var(--teal); color: #0b1a1a; }
    .lt-opts .lt-b { background: transparent; font-weight: 500; font-size: .76rem; padding: 5px 8px; color: var(--muted); }
    .lt-opts .lt-b i { width: 10px; height: 10px; border-radius: 3px; border: 1.5px solid var(--muted); }
    .lt-opts .lt-b.on { background: transparent; color: var(--text); border-color: var(--line); }
    .lt-opts .lt-b.on i { background: var(--accent); border-color: var(--accent); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
