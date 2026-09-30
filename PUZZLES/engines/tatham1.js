/* The Puzzle Cabinet · engines/tatham1.js
 *
 * Five pencil puzzles from the family of Simon Tatham's Portable Puzzle
 * Collection, played the way his versions are played:
 *
 *   tents      a tent beside every tree, one each, no two tents touching,
 *              row and column counts
 *   dominosa   a grid of numbers that is a full set of dominoes: find them
 *   hitori     Singles: black out repeats; black cells never touch, the
 *              white ones stay in one piece
 *   fillomino  Filling: every group of equal numbers has that many cells
 *   shikaku    Rectangles: cut the grid into rectangles, one number each,
 *              the number its area
 *
 * One board per kind (data.kind), with live error display, hints that give
 * the next forced step and say why, solve() with a little animation and
 * generate() for the Endless drawers. The reasoning (solvers, counters,
 * graded steps, the makers) lives in js/lib/tatham1-logic.js.
 *
 * data (see tools/gen/tatham1.js):
 *   { kind: 'tents', grid: ['.T..', …], rows: [1, …], cols: [1, …], sol: ['*...', …] }   'T' tree, '*' tent
 *   { kind: 'dominosa', n: 6, grid: ['01234…', …], sol: ['rlud…', …] }   n+1 rows of n+2 digits; sol: where each cell's partner is
 *   { kind: 'hitori', grid: ['1a23…', …], sol: ['#…', …] }   base-36 digits (a = 10); '#' black
 *   { kind: 'fillomino', grid: ['3..1', …], sol: ['3331', …] }   '.' empty
 *   { kind: 'shikaku', w, h, clues: [[row, col, n], …], sol: [[row, col, rows, cols], …] }   sol in clue order
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const S = 40;                        // world units per cell
  const LG = () => C.tatham1;
  const KINDS = { tents: 'Tents', dominosa: 'Dominosa', hitori: 'Singles', fillomino: 'Filling', shikaku: 'Rectangles' };

  const ABOUT = {
    tents: 'Every tree needs a **tent** of its own, pitched right beside it — above, below, left or right, never diagonally. Tents never touch each other, **not even at a corner**, and the numbers to the right and below say how many tents stand in each row and column. (A tent may sit next to two trees; it still belongs to only one.)\n\n' +
      '**Click** a cell for a tent, **right-click** for grass (a cell you know is empty); click again, with either button, to clear it. **Drag with the right button** along a row or column to grass over every empty cell on the way. On a touch screen, switch the tap between *Tent* and *Grass* in the panel. Touching tents, trees left without a tent and broken counts turn red; finished counts fade. **Keys:** arrows move a cursor, **Enter** = tent, **Space** = grass, **Backspace** clears, **Shift+arrows** carry the last mark along.',
    dominosa: 'The grid is a **full set of dominoes**, from 0–0 to the double of the highest number, laid face up with the lines between them rubbed out. Every domino of the set is there **exactly once**. Find where each one lies.\n\n' +
      '**Drag** from a number to its neighbour, or **click** on the line between two numbers, to lay a domino there (do it again to take it off). **Right-click** between two numbers to draw a line: they are *not* one domino; **drag with the right button** to draw several. On a touch screen, switch the tap between *Domino* and *Line* in the panel. A domino laid twice turns red, and so does a number left with no one to pair with. The set in the panel ticks off the dominoes you have found; **point at one to see every place it could still go**. **Keys:** arrows move a cursor, **Shift+arrow** lays a domino that way, **Space** then an arrow draws a line.',
    hitori: '**Black out** some cells so that no number appears twice in any row or column among the cells left white. Black cells may **never touch side by side** (corners are fine), and all the white cells must stay **joined in one piece**.\n\n' +
      '**Click** a cell to black it out, **right-click** to circle it (a cell you are sure stays white); click again to clear. **Drag with the right button** along a line to circle several. On a touch screen, switch the tap between *Black* and *Circle* in the panel. Touching black cells, repeated circled numbers and white cells cut off from the rest turn red; the bars beside the grid turn green when a line has no repeats left. **Keys:** arrows move a cursor, **Enter** = black, **Space** = circle, **Backspace** clears.',
    fillomino: 'Write a number in every empty cell so that the grid falls into **groups**: every group of equal numbers joined side by side has **exactly as many cells as its number** — a 3 in a group of three, a 1 on its own. (So two groups of the same size can never touch: they would be one group.) The printed numbers stay; groups without any printed number are allowed.\n\n' +
      '**Click** a cell and **type** a digit, or use the number pad in the panel. **Drag** across empty cells to select several and type once for all of them. **Drag from a number** to copy it into the cells you pass — the quickest way to grow a group. **Backspace** clears. Finished groups are tinted and walled in; groups that are too big, or shut in too small, turn red; a small count shows how far along an unfinished group is.',
    shikaku: 'Divide the grid into **rectangles** (squares count) so that every rectangle contains **exactly one number**, and that number is its **area** — how many cells it covers. Every cell belongs to one rectangle.\n\n' +
      '**Drag** from corner to corner to draw a rectangle; a badge shows its size as you go, green when it fits its number. Drawing over old rectangles replaces them. **Click** a rectangle to rub it out (click an empty cell for a 1-cell rectangle); **drag with the right button** to rub out everything you sweep. Rectangles with the wrong area, no number or two numbers are marked in red. **Keys:** arrows move a cursor, **Enter** or **Space** starts a rectangle and again finishes it, **Backspace** rubs out.'
  };
  const ABOUT_ALL = 'Five puzzles in the style of Simon Tatham\'s Portable Puzzle Collection share this board: Tents, Dominosa, Singles, Filling and Rectangles. **Click** to do the main thing, **right-click** to mark, **drag** to do a run in one go; arrows move a keyboard cursor. The *How to* tab of each puzzle tells its rules.';

  function currentKind() {
    try {
      const hash = root.location && root.location.hash || '';
      let m = /#\/p\/([\w-]+)/.exec(hash);
      const p = m && C.byId[m[1]];
      if (p && p.data && p.data.kind) return p.data.kind;
      m = /#\/[xf]\/([\w-]+)/.exec(hash);
      return m && KINDS[m[1]] ? m[1] : null;
    } catch (e) { return null; }
  }

  /* ---------- statements ---------- */

  function textFor(d) {
    if (d.kind === 'tents') return 'Pitch a tent beside every tree — above, below, left or right of it — so that each tree has a tent of its own. Tents never touch, not even at a corner, and the numbers say how many tents stand in each row and column.';
    if (d.kind === 'dominosa') return 'These numbers are a full set of dominoes, from 0–0 to ' + d.n + '–' + d.n + ', laid face up with the lines between them rubbed out. Find where each of the ' + (d.n + 1) * (d.n + 2) / 2 + ' dominoes lies: every one of them appears exactly once.';
    if (d.kind === 'hitori') return 'Black out some cells so that no number is repeated in any row or column. Black cells may not touch side by side, and the white cells must stay joined in one piece.';
    if (d.kind === 'fillomino') return 'Fill every empty cell with a number so that each group of equal numbers joined side by side has exactly that many cells.';
    return 'Divide the grid into rectangles, each holding exactly one number: the number of cells it covers.';
  }
  const GOALS = {
    tents: 'A tent beside every tree, one each; tents never touch, not even diagonally; every count right.',
    dominosa: 'Split the grid into dominoes so that every domino of the set appears exactly once.',
    hitori: 'No number twice in a line among white cells; black cells never side by side; white cells in one piece.',
    fillomino: 'Every group of equal numbers has exactly as many cells as its number.',
    shikaku: 'Rectangles that cover the grid, each holding one number equal to its area.'
  };

  /* ---------- verify (node) ---------- */

  const isGrid = (g) => Array.isArray(g) && g.length > 0 && g.every((r) => typeof r === 'string' && r.length === g[0].length);

  const VERIFY = {
    tents(d, L) {
      if (!isGrid(d.grid) || !/^[.T]+$/.test(d.grid.join(''))) return 'grid must be rows of . and T';
      const h = d.grid.length, w = d.grid[0].length;
      if (!isGrid(d.sol) || d.sol.length !== h || d.sol[0].length !== w || !/^[.*]+$/.test(d.sol.join(''))) return 'sol must be ' + h + ' rows of ' + w + ' . and *';
      if (!Array.isArray(d.rows) || d.rows.length !== h || !Array.isArray(d.cols) || d.cols.length !== w) return 'rows and cols counts needed';
      const P = L.tnPrep(d.grid, d.rows, d.cols);
      const tents = new Uint8Array(P.N);
      for (let i = 0; i < P.N; i++) tents[i] = d.sol[Math.floor(i / w)][i % w] === '*' ? 1 : 0;
      if (!L.tnValid(P, tents)) return 'the stored solution breaks the rules';
      const c = L.tnCount(P, null, 2, 400000);
      if (c.aborted) return 'the solution count gave up';
      if (c.count !== 1) return c.count ? 'more than one solution' : 'no solution';
      for (let i = 0; i < P.N; i++) if ((c.sol[i] === 1) !== !!tents[i]) return 'the solver found a different solution';
      return null;
    },
    dominosa(d, L) {
      const n = d.n;
      if (!(n >= 1 && n <= 9)) return 'n must be 1..9';
      if (!isGrid(d.grid) || d.grid.length !== n + 1 || d.grid[0].length !== n + 2) return 'grid must be ' + (n + 1) + ' rows of ' + (n + 2) + ' digits';
      if (d.grid.join('').split('').some((ch) => !(ch >= '0' && ch <= String(n)))) return 'digits must be 0..' + n;
      if (!isGrid(d.sol) || d.sol.length !== n + 1 || d.sol[0].length !== n + 2 || !/^[lrud]+$/.test(d.sol.join(''))) return 'sol must be letters l r u d';
      const P = L.dmPrep(d.grid), w = P.w;
      const back = { l: 'r', r: 'l', u: 'd', d: 'u' }, step = { l: -1, r: 1, u: -w, d: w };
      for (let i = 0; i < P.N; i++) {
        const ch = d.sol[Math.floor(i / w)][i % w], j = i + step[ch];
        if (j < 0 || j >= P.N || ((ch === 'l' || ch === 'r') && Math.floor(j / w) !== Math.floor(i / w)) || d.sol[Math.floor(j / w)][j % w] !== back[ch]) return 'sol pairs do not match at cell ' + i;
      }
      const edges = L.dmSolEdges(P, d.sol);
      if (!L.dmValid(P, edges)) return 'the stored layout does not use every domino exactly once';
      const c = L.dmCount(P, null, 2);
      if (c.aborted) return 'the solution count gave up';
      if (c.count !== 1) return c.count ? 'more than one layout fits' : 'no layout fits';
      const mine = new Set(edges);
      if (c.sols[0].some((e) => !mine.has(e))) return 'the solver found a different layout';
      return null;
    },
    hitori(d, L) {
      if (!isGrid(d.grid) || !/^[1-9a-z]+$/.test(d.grid.join(''))) return 'grid must be rows of base-36 digits';
      const h = d.grid.length, w = d.grid[0].length;
      if (!isGrid(d.sol) || d.sol.length !== h || d.sol[0].length !== w || !/^[.#]+$/.test(d.sol.join(''))) return 'sol must be ' + h + ' rows of . and #';
      const P = L.htPrep(d.grid);
      const black = new Uint8Array(P.N);
      for (let i = 0; i < P.N; i++) black[i] = d.sol[Math.floor(i / w)][i % w] === '#' ? 1 : 0;
      if (!L.htValid(P, black)) return 'the stored solution breaks the rules';
      const c = L.htCount(P, null, 2, 400000);
      if (c.aborted) return 'the solution count gave up';
      if (c.count !== 1) return c.count ? 'more than one solution' : 'no solution';
      for (let i = 0; i < P.N; i++) if ((c.sol[i] === 1) !== !!black[i]) return 'the solver found a different solution';
      return null;
    },
    fillomino(d, L) {
      if (!isGrid(d.grid) || !/^[.1-9]+$/.test(d.grid.join(''))) return 'grid must be rows of . and 1–9';
      const h = d.grid.length, w = d.grid[0].length;
      if (!isGrid(d.sol) || d.sol.length !== h || d.sol[0].length !== w || !/^[1-9]+$/.test(d.sol.join(''))) return 'sol must be ' + h + ' rows of digits';
      const P = L.flPrep(d.grid);
      const v = new Int8Array(P.N);
      for (let i = 0; i < P.N; i++) {
        v[i] = +d.sol[Math.floor(i / w)][i % w];
        if (P.given[i] && P.given[i] !== v[i]) return 'a given disagrees with the solution at cell ' + i;
      }
      if (!L.flValid(P, v)) return 'the stored solution breaks the rules';
      // rules that never guess and fill the whole grid prove the answer is the only one
      const s = L.flSolve(P, 3);
      if (!s.ok) return 'the rules find a contradiction';
      if (!s.done) return 'rules alone leave ' + s.open + ' cells open (not proved unique)';
      for (let i = 0; i < P.N; i++) if (s.v[i] !== v[i]) return 'the rules find a different solution';
      return null;
    },
    shikaku(d, L) {
      const w = d.w, h = d.h;
      if (!(w >= 2 && h >= 2 && w <= 30 && h <= 30)) return 'w and h needed';
      if (!Array.isArray(d.clues) || !d.clues.length || !Array.isArray(d.sol) || d.sol.length !== d.clues.length) return 'clues and sol (one rectangle per clue) needed';
      const seen = new Set();
      for (const q of d.clues) {
        if (!(q[0] >= 0 && q[0] < h && q[1] >= 0 && q[1] < w && q[2] >= 1)) return 'bad clue ' + JSON.stringify(q);
        if (seen.has(q[0] * w + q[1])) return 'two clues in one cell';
        seen.add(q[0] * w + q[1]);
      }
      if (d.clues.reduce((a, q) => a + q[2], 0) !== w * h) return 'the numbers do not add up to the area of the grid';
      const P = L.skPrep(w, h, d.clues);
      const pick = d.sol.map((q, k) => L.skFind(P, k, q[0], q[1], q[2], q[3]));
      const bad = pick.findIndex((j) => j < 0);
      if (bad >= 0) return 'rectangle ' + bad + ' does not fit its number';
      if (!L.skValid(P, pick)) return 'the stored rectangles overlap or leave gaps';
      const c = L.skCount(P, 2);
      if (c.aborted) return 'the solution count gave up';
      if (c.count !== 1) return c.count ? 'more than one solution' : 'no solution';
      if (c.sols[0].some((j, k) => j !== pick[k])) return 'the solver found a different solution';
      return null;
    }
  };

  function verify(p) {
    const d = p.data, L = LG();
    if (!L) return { ok: false, err: 'js/lib/tatham1-logic.js is not loaded' };
    if (!d || !VERIFY[d.kind]) return { ok: false, err: 'data.kind must be one of ' + Object.keys(KINDS).join(', ') };
    if ((d.kind === 'dominosa' || d.kind === 'shikaku') && !C.DLX) return { ok: false, err: 'js/lib/dlx.js is not loaded' };
    const e = VERIFY[d.kind](d, L);
    return e ? { ok: false, err: e } : { ok: true };
  }

  /* ---------- family pictures ---------- */

  const HUES = [205, 25, 140, 280, 50, 330, 175, 95, 245, 0, 115, 305];
  const FILL_HUE = [0, 210, 150, 45, 285, 18, 175, 330, 95, 250];

  function thumb(p) {
    const d = p.data, kind = d.kind, L = LG();
    const solved = !!(C.progress && C.progress.solved && C.progress.solved(p.id));
    const g = d.grid;
    const h = kind === 'shikaku' ? d.h : g.length, w = kind === 'shikaku' ? d.w : g[0].length;
    const padR = kind === 'tents' ? 0.9 : 0, padB = kind === 'tents' ? 0.9 : 0;
    const cs = Math.min(150 / (w + padR), 112 / (h + padB));
    const gx = (160 - (w + padR) * cs) / 2, gy = (120 - (h + padB) * cs) / 2;
    const f = C.fmtNum, X = (c) => f(gx + c * cs), Y = (r) => f(gy + r * cs);
    const txt = (r, c, t, size, fill, weight) => '<text x="' + f(gx + (c + 0.5) * cs) + '" y="' + f(gy + (r + 0.54) * cs) + '" text-anchor="middle" dominant-baseline="central" font-family="Segoe UI, system-ui, sans-serif" font-size="' + f(cs * (size || 0.6)) + '" font-weight="' + (weight || 700) + '" fill="' + fill + '">' + t + '</text>';
    const rect = (r, c, fill, extra) => '<rect x="' + X(c) + '" y="' + Y(r) + '" width="' + f(cs + 0.3) + '" height="' + f(cs + 0.3) + '" fill="' + fill + '"' + (extra || '') + '/>';
    let out = '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet">';
    out += '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="var(--cell)"/>';
    let lines = '';
    for (let c = 1; c < w; c++) lines += 'M' + X(c) + ' ' + Y(0) + 'V' + Y(h);
    for (let r = 1; r < h; r++) lines += 'M' + X(0) + ' ' + Y(r) + 'H' + X(w);
    const grid = '<path d="' + lines + '" stroke="var(--grid-2)" stroke-width="0.7" fill="none"/>';
    const frame = '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>';
    if (kind === 'tents') {
      out += grid;
      for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
        const cx = gx + (c + 0.5) * cs, cy = gy + (r + 0.5) * cs;
        if (g[r][c] === 'T') out += '<circle cx="' + f(cx) + '" cy="' + f(cy - cs * 0.06) + '" r="' + f(cs * 0.34) + '" fill="#3f9a4f"/><rect x="' + f(cx - cs * 0.06) + '" y="' + f(cy + cs * 0.18) + '" width="' + f(cs * 0.12) + '" height="' + f(cs * 0.22) + '" fill="#8a5a36"/>';
        else if (solved && d.sol[r][c] === '*') out += '<path d="M' + f(cx - cs * 0.34) + ' ' + f(cy + cs * 0.3) + 'L' + f(cx) + ' ' + f(cy - cs * 0.32) + 'L' + f(cx + cs * 0.34) + ' ' + f(cy + cs * 0.3) + 'Z" fill="#e8913a"/>';
      }
      d.rows.forEach((k, r) => { out += txt(r, w + 0.05, k, 0.55, 'var(--muted)', 600); });
      d.cols.forEach((k, c) => { out += txt(h + 0.05, c, k, 0.55, 'var(--muted)', 600); });
      return out + frame + '</svg>';
    }
    if (kind === 'dominosa') {
      if (solved && L) {
        const P = L.dmPrep(g);
        L.dmSolEdges(P, d.sol).forEach((e) => {
          const E = P.E[e], r = Math.floor(E.a / w), c = E.a % w, m = cs * 0.08;
          out += '<rect x="' + f(gx + c * cs + m) + '" y="' + f(gy + r * cs + m) + '" width="' + f((E.hz ? 2 : 1) * cs - 2 * m) + '" height="' + f((E.hz ? 1 : 2) * cs - 2 * m) + '" rx="' + f(cs * 0.2) + '" fill="var(--paper)" stroke="var(--ink-2)" stroke-width="0.8"/>';
        });
        for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) out += txt(r, c, g[r][c], 0.55, '#23263a');
        return out + '</svg>';
      }
      out += grid;
      for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) out += txt(r, c, g[r][c], 0.58, 'var(--ink)');
      return out + frame + '</svg>';
    }
    if (kind === 'hitori') {
      out += grid;
      for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
        const black = solved && d.sol[r][c] === '#';
        if (black) out += rect(r, c, '#141726');
        out += txt(r, c, parseInt(g[r][c], 36), w > 9 ? 0.5 : 0.58, black ? '#555a78' : 'var(--ink)');
      }
      return out + frame + '</svg>';
    }
    if (kind === 'fillomino') {
      if (solved) for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) out += rect(r, c, 'hsl(' + FILL_HUE[+d.sol[r][c]] + ' 60% 55% / .35)');
      out += grid;
      if (solved) {
        let thick = '';
        for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
          if (c + 1 < w && d.sol[r][c] !== d.sol[r][c + 1]) thick += 'M' + X(c + 1) + ' ' + Y(r) + 'V' + Y(r + 1);
          if (r + 1 < h && d.sol[r][c] !== d.sol[r + 1][c]) thick += 'M' + X(c) + ' ' + Y(r + 1) + 'H' + X(c + 1);
        }
        out += '<path d="' + thick + '" stroke="var(--ink)" stroke-width="1.6" stroke-linecap="square" fill="none"/>';
      }
      for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) if (g[r][c] !== '.') out += txt(r, c, g[r][c], 0.6, 'var(--ink)');
      return out + frame + '</svg>';
    }
    // rectangles
    out += '<path d="' + lines + '" stroke="var(--grid-2)" stroke-width="0.6" stroke-dasharray="1.5 1.5" fill="none"/>';
    if (solved) d.sol.forEach((q, k) => {
      const m = cs * 0.08;
      out += '<rect x="' + f(gx + q[1] * cs + m) + '" y="' + f(gy + q[0] * cs + m) + '" width="' + f(q[3] * cs - 2 * m) + '" height="' + f(q[2] * cs - 2 * m) + '" rx="' + f(cs * 0.18) + '" fill="hsl(' + HUES[(q[0] * 7 + q[1] * 3 + k) % HUES.length] + ' 60% 55% / .4)" stroke="var(--ink-2)" stroke-width="0.8"/>';
    });
    d.clues.forEach(([r, c, n]) => { out += txt(r, c, n, n > 9 ? 0.5 : 0.6, 'var(--ink)'); });
    return out + frame + '</svg>';
  }

  /* ---------- Endless drawers ---------- */

  const PLANS = {
    // [w, h, density, logic level allowed]
    tents: [null, [[6, 6, 0.2, 1], [7, 7, 0.2, 1]], [[8, 8, 0.2, 2], [7, 7, 0.21, 2]], [[10, 10, 0.2, 2], [9, 9, 0.2, 3]], [[12, 12, 0.2, 3], [10, 10, 0.2, 3]], [[15, 15, 0.2, 3], [14, 14, 0.2, 3]]],
    // [n, logic level allowed]
    dominosa: [null, [[3, 2], [4, 1]], [[4, 2], [5, 1], [5, 2]], [[5, 3], [6, 2]], [[6, 3], [7, 2], [7, 3]], [[8, 3], [9, 3]]],
    // [n, logic level allowed]
    hitori: [null, [[5, 2], [6, 2]], [[6, 2], [7, 2]], [[8, 2], [7, 3]], [[9, 3], [10, 2]], [[10, 3], [9, 3]]],
    // [w, h, logic level]
    fillomino: [null, [[5, 5, 1], [6, 6, 1]], [[7, 7, 2], [8, 8, 1]], [[8, 8, 2], [9, 9, 2]], [[9, 9, 3], [10, 10, 2]], [[10, 10, 3], [11, 9, 3]]],
    // [w, h, largest area, logic level allowed]
    shikaku: [null, [[5, 5, 6, 1], [6, 6, 7, 1]], [[7, 7, 8, 2], [8, 8, 9, 2]], [[11, 11, 14, 2], [12, 12, 16, 2], [10, 10, 12, 3]], [[13, 13, 18, 2], [14, 14, 20, 3], [12, 12, 16, 3]], [[15, 15, 22, 3], [17, 17, 26, 3], [16, 16, 24, 3]]]
  };

  function makeOne(kind, opt, rng, level, budget) {
    const L = LG();
    if (kind === 'tents') {
      const [w, h, dens, lv] = opt;
      const r = L.tnMake(w, h, rng, dens, lv);
      return r && { diff: r.diff, title: 'Tents ' + w + '×' + h, data: { kind, grid: r.grid, rows: r.rows, cols: r.cols, sol: r.sol } };
    }
    if (kind === 'dominosa') {
      const [n, lv] = opt;
      const r = L.dmMake(n, rng, lv, budget);
      return r && { diff: r.diff, title: 'Dominosa, double ' + n, data: { kind, n, grid: r.grid, sol: r.sol } };
    }
    if (kind === 'hitori') {
      const [n, lv] = opt;
      const r = L.htMake(n, rng, lv, budget);
      return r && { diff: r.diff, title: 'Singles ' + n + '×' + n, data: { kind, grid: r.grid, sol: r.sol } };
    }
    if (kind === 'fillomino') {
      const [w, h, lv] = opt;
      const r = L.flMake(w, h, rng, lv, budget);
      return r && { diff: r.diff, title: 'Filling ' + w + '×' + h, data: { kind, grid: r.grid, sol: r.sol } };
    }
    const [w, h, maxA, lv] = opt;
    const r = L.skMake(w, h, rng, maxA, lv, budget);
    return r && { diff: r.diff, title: 'Rectangles ' + w + '×' + h, data: { kind, w, h, clues: r.clues, sol: r.sol } };
  }

  function generate(rng, level, fam) {
    const L = LG();
    if (!L) return null;
    const kind = fam && KINDS[fam.id] ? fam.id : null;
    if (!kind) return null;
    const plan = PLANS[kind][level];
    const t0 = L.now(), budget = kind === 'fillomino' ? 1400 : 900;
    for (let k = 0; L.now() - t0 < budget; k++) {
      const left = budget - (L.now() - t0);
      const x = makeOne(kind, plan[k % plan.length], rng, level, Math.max(200, left));
      if (!x || x.diff !== level) continue;
      return { title: x.title, text: textFor(x.data), goal: GOALS[kind], diff: level, data: x.data };
    }
    return null;
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'tatham1',
    get name() { return KINDS[currentKind()] || 'Tatham favourites'; },
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/dlx.js', 'js/lib/tatham1-logic.js'],
    noMoves: true,
    get about() { return ABOUT[currentKind()] || ABOUT_ALL; },
    verify,
    generate,
    generates: Object.keys(KINDS),
    mount(ctx, p) { return MOUNT[p.data.kind](ctx, p); },
    thumb,
    textFor,
    goals: GOALS,
    kinds: ABOUT
  });

  const MOUNT = {};

  /* =====================================================================
   *  THE SHARED BOARD
   * ===================================================================== */

  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const cnt = (k) => WORDS[k] || String(k);
  const SOLVED = {
    tents: ['Every tree has its tent, and nobody is camping too close.', 'The campsite is full — and perfectly spaced.', 'Pegs in, guy ropes taut. Lovely.'],
    dominosa: ['A full set, every domino in its place.', 'All the bones are accounted for.', 'Double-checked, every double.'],
    hitori: ['No number is left repeating itself.', 'Each number stands alone — singles only.', 'Tidy: no twins, no touching, one white island.'],
    fillomino: ['Every group is exactly the right size.', 'All filled, all fitting.', 'Groups of every size, each one just so.'],
    shikaku: ['The grid is cut clean, one number per piece.', 'Every rectangle measures up.', 'Neatly parcelled out.']
  };

  function makeBoard(ctx, kind, w, h, pad) {
    const wb = ctx.wb, s = ctx.s;
    pad = Object.assign({ l: 0, t: 0, r: 0, b: 0 }, pad || {});
    const ox = pad.l, oy = pad.t, GW = w * S, GH = h * S, N = w * h;
    // a little room at the bottom: the zoom buttons sit in the bottom right corner
    wb.setBounds({ x0: -S * 0.3, y0: -S * 0.3, x1: ox + GW + pad.r + S * 0.3, y1: oy + GH + pad.b + S * 0.3 + (pad.b ? 0 : S * 0.5) }, 0.05);
    const G = s('g', { class: 't1 t1-' + kind }, wb.layer('board'));
    const B = { kind, wb, s, w, h, N, ox, oy, GW, GH, G, timers: [] };
    B.rowOf = (i) => Math.floor(i / w);
    B.colOf = (i) => i % w;
    B.cx = (i) => ox + (i % w) * S;
    B.cy = (i) => oy + Math.floor(i / w) * S;
    B.cellAt = (pt) => {
      const c = Math.floor((pt[0] - ox) / S), r = Math.floor((pt[1] - oy) / S);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    };
    B.clampCell = (pt) => {
      const c = Math.max(0, Math.min(w - 1, Math.floor((pt[0] - ox) / S))), r = Math.max(0, Math.min(h - 1, Math.floor((pt[1] - oy) / S)));
      return r * w + c;
    };
    B.bg = s('g', null, G);
    B.cellsG = s('g', null, G);
    B.under = s('g', { class: 't1-nohit' }, G);
    B.hov = s('g', { class: 't1-nohit' }, G);
    B.lines = s('g', { class: 't1-nohit' }, G);
    B.marks = s('g', { class: 't1-nohit' }, G);
    B.texts = s('g', { class: 't1-nohit' }, G);
    B.top = s('g', { class: 't1-nohit' }, wb.layer('top'));
    B.hintG = s('g', null, B.top);
    B.live = s('g', null, B.top);
    B.cursorEl = s('rect', { width: S, height: S, rx: 5, class: 't1-cursor' }, B.top);
    s('rect', { x: ox - 4, y: oy - 4, width: GW + 8, height: GH + 8, rx: 7, class: 't1-boardbg' }, B.bg);
    B.cellEls = [];
    for (let i = 0; i < N; i++) B.cellEls.push(s('rect', { x: B.cx(i), y: B.cy(i), width: S, height: S, class: 't1-cell', 'data-key': 'c' + i }, B.cellsG));
    B.gridLines = (cls, dash) => {
      let thin = '';
      for (let c = 1; c < w; c++) thin += 'M' + (ox + c * S) + ' ' + oy + 'V' + (oy + GH);
      for (let r = 1; r < h; r++) thin += 'M' + ox + ' ' + (oy + r * S) + 'H' + (ox + GW);
      const el = s('path', { d: thin, class: cls || 't1-grid' }, B.lines);
      if (dash) el.setAttribute('stroke-dasharray', dash);
      return el;
    };
    B.frame = () => s('rect', { x: ox, y: oy, width: GW, height: GH, rx: 2, class: 't1-frame' }, B.lines);
    B.later = (fn, ms) => { const t = setTimeout(fn, ms); B.timers.push(t); return t; };

    // the keyboard cursor
    B.cur = { r: 0, c: 0, on: false };
    B.drawCursor = () => {
      B.cursorEl.style.display = B.cur.on ? '' : 'none';
      B.cursorEl.setAttribute('x', ox + B.cur.c * S);
      B.cursorEl.setAttribute('y', oy + B.cur.r * S);
    };
    B.drawCursor();
    B.moveCursor = (dr, dc) => {
      if (!B.cur.on) { B.cur.on = true; B.drawCursor(); return false; }
      B.cur.r = Math.max(0, Math.min(h - 1, B.cur.r + dr));
      B.cur.c = Math.max(0, Math.min(w - 1, B.cur.c + dc));
      B.drawCursor();
      return true;
    };
    B.cursorAt = (i) => { B.cur.r = Math.floor(i / w); B.cur.c = i % w; B.drawCursor(); };

    // the row and column under the pointer
    const hovR = s('rect', { class: 't1-hovband', x: ox, width: GW, height: S }, B.hov);
    const hovC = s('rect', { class: 't1-hovband', y: oy, width: S, height: GH }, B.hov);
    hovR.style.display = hovC.style.display = 'none';
    let hovI = -1;
    B.hover = (pt) => {
      const i = pt ? B.cellAt(pt) : -1;
      if (i === hovI) return;
      hovI = i;
      hovR.style.display = hovC.style.display = i < 0 ? 'none' : '';
      if (i < 0) return;
      hovR.setAttribute('y', B.cy(i));
      hovC.setAttribute('x', B.cx(i));
    };
    B.noHover = () => { hovR.style.display = hovC.style.display = 'none'; hovI = -1; };

    // hint marks: gold zones, red outlines, pulsing ghosts, flashes
    B.ghosts = [];
    B.clearHint = () => {
      while (B.hintG.firstChild) B.hintG.removeChild(B.hintG.firstChild);
      B.ghosts = [];
    };
    B.zone = (cells, cls) => cells.forEach((i) => s('rect', { x: B.cx(i) + 1, y: B.cy(i) + 1, width: S - 2, height: S - 2, rx: 4, class: cls || 't1-hzone' }, B.hintG));
    B.band = (li) => {
      const isRow = li < h, k = isRow ? li : li - h;
      s('rect', isRow ? { x: ox - 2, y: oy + k * S - 2, width: GW + 4, height: S + 4, rx: 6, class: 't1-hline' } : { x: ox + k * S - 2, y: oy - 2, width: S + 4, height: GH + 4, rx: 6, class: 't1-hline' }, B.hintG);
    };
    B.wrongBox = (i) => s('rect', { x: B.cx(i) + 2.5, y: B.cy(i) + 2.5, width: S - 5, height: S - 5, rx: 5, class: 't1-hwrong' }, B.hintG);
    B.ghost = (key, draw) => {
      const g = s('g', { class: 't1-ghost' }, B.hintG);
      draw(g);
      B.ghosts.push({ key, g });
      return g;
    };
    // take away the ghosts that are now on the board (done(key) says so)
    B.prune = (done) => {
      B.ghosts = B.ghosts.filter((x) => { if (!done(x.key)) return true; x.g.remove(); return false; });
    };
    B.flash = (cells) => {
      const els = cells.map((i) => s('rect', { x: B.cx(i) + 1, y: B.cy(i) + 1, width: S - 2, height: S - 2, rx: 5, class: 't1-flash' }, B.hintG));
      B.later(() => els.forEach((e) => e.remove()), 1400);
    };
    B.destroy = () => { B.timers.forEach(clearTimeout); };
    return B;
  }

  /* The hint conversation, the same for every kind (after engines/shade.js):
   * wrong marks first (shown, then rubbed out on the next hint), then the
   * next forced step (shown, then filled in on the next hint). */
  function hintFlow(ctx, B, api) {
    let pending = null;
    return {
      reset() { pending = null; },
      clear() { pending = null; },
      hint() {
        const wrong = api.wrong();
        if (wrong.length) {
          if (pending && pending.fix) {
            api.rubOut(wrong);
            pending = null;
            B.clearHint();
            api.redraw();
            ctx.changed('hint');
            return 'I rubbed out ' + (wrong.length === 1 ? 'the wrong ' + api.markWord(1) : 'the ' + wrong.length + ' wrong ' + api.markWord(2)) + '. Carry on from here.';
          }
          pending = { fix: true };
          return {
            text: (wrong.length === 1 ? 'One of your ' + api.markWord(2) + ' is wrong' : wrong.length + ' of your ' + api.markWord(2) + ' are wrong') + ' (outlined in red). Look again — or ask for another hint and I will rub ' + (wrong.length === 1 ? 'it' : 'them') + ' out.',
            show() { B.clearHint(); api.showWrong(wrong); }
          };
        }
        if (pending && pending.set) {
          const todo = api.todo(pending.set);
          pending = null;
          if (todo.length) {
            api.apply(todo);
            B.clearHint();
            api.redraw();
            ctx.changed('hint');
            return { text: 'Done: I put in ' + api.describe(todo) + ' from the last hint.', show() { api.flash(todo); } };
          }
        }
        const st = api.step();
        if (!st) {
          const r = api.evaluate();
          return r.solved ? 'It is solved already!' : 'Nothing is left to deduce from here: ' + (r.msg || 'look over your marks.');
        }
        pending = { set: st.set };
        return { text: st.text + ' *(Another hint ' + (st.set.length === 1 ? 'puts it in' : 'puts them in') + '.)*', show() { B.clearHint(); api.showStep(st); } };
      }
    };
  }

  /* Cells with three states (0 empty, 1 the main mark, 2 the side mark),
   * played like Simon Tatham's puzzles and engines/shade.js: click for the
   * main mark, right-click for the side mark, drag along a line for a run
   * of side marks; a tap mode for touch screens; a keyboard cursor. */
  function cellMarker(ctx, B, cfg) {
    const s = ctx.s, wb = ctx.wb, st = cfg.st, fixed = cfg.fixed;
    const ui = { tapMark: false };
    let drag = null, lastSet = null;
    const badge = s('g', { class: 't1-badge' }, B.top);
    const badgeBg = s('rect', { rx: 9, width: 30, height: 24 }, badge);
    const badgeTx = s('text', { x: 15, y: 12.5 }, badge);
    badge.style.display = 'none';

    function start(i, back) {
      if (drag) end();
      B.cur.on = false;
      B.cursorAt(i);
      if (fixed[i]) { if (cfg.onFixed) cfg.onFixed(i); return; }
      const from = st[i], to = cfg.next(from, back);
      drag = { a: i, from, to, axis: null, orig: Int8Array.from(st), line: [i], one: cfg.one(to) };
      st[i] = to;
      lastSet = to;
      ctx.sfx('tap');
      cfg.refresh();
    }
    function move(pt) {
      if (!drag || drag.one) return;
      const w = B.w, ar = Math.floor(drag.a / w), ac = drag.a % w;
      const j0 = B.clampCell(pt), r = Math.floor(j0 / w), c = j0 % w;
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
      if (changed) cfg.refresh();
      if (line.length > 1) {
        const k = wb.px(1);
        badge.style.display = '';
        badge.setAttribute('transform', 'translate(' + (pt[0] + 16 * k) + ' ' + (pt[1] - 36 * k) + ') scale(' + k + ')');
        badgeTx.textContent = String(line.length);
        badgeBg.setAttribute('width', line.length > 9 ? 36 : 28);
        badgeTx.setAttribute('x', line.length > 9 ? 18 : 14);
      } else badge.style.display = 'none';
    }
    function end() {
      if (!drag) return;
      const changed = st.some((x, i) => x !== drag.orig[i]);
      drag = null;
      badge.style.display = 'none';
      if (changed) ctx.changed('cells');
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = B.cellAt(pt);
        if (i < 0) return false;
        start(i, (ev.button === 2) !== ui.tapMark);
        return true;
      },
      move(pt) { move(pt); },
      up() { end(); },
      hover(pt) { B.hover(pt); }
    };
    const leave = () => B.noHover();
    wb.svg.addEventListener('pointerleave', leave);

    // the tap switch for touch screens
    const segBtns = cfg.names.map((label, k) => ctx.h('button.t1-segb' + (k === 0 ? '.on' : ''), { type: 'button', onclick: () => setTap(k === 1) }, label));
    function setTap(mark) {
      ui.tapMark = mark;
      segBtns.forEach((b, k) => b.classList.toggle('on', (k === 1) === mark));
    }
    const box = ctx.h('div.t1-panel',
      ctx.h('div.t1-seg', ctx.h('span.t1-segl', 'Click or tap:'), segBtns[0], segBtns[1]),
      ctx.h('div.t1-tip', cfg.tip));
    ctx.panel.appendChild(box);

    return {
      box,
      cancel() { drag = null; badge.style.display = 'none'; },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return B.cur.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (dirs[k]) {
          if (!B.moveCursor(dirs[k][0], dirs[k][1])) return true;
          const i = B.cur.r * B.w + B.cur.c;
          if (ev.shiftKey && lastSet != null && !fixed[i] && st[i] !== lastSet) { st[i] = lastSet; cfg.refresh(); ctx.changed('cells'); }
          return true;
        }
        if (!B.cur.on) return false;
        const i = B.cur.r * B.w + B.cur.c;
        const set = (v) => { if (!fixed[i] && st[i] !== v) { st[i] = v; lastSet = v; ctx.sfx('tap'); cfg.refresh(); ctx.changed('cells'); } };
        if (k === 'Enter') { set(cfg.next(st[i], false)); return true; }
        if (k === ' ' || k === 'x' || k === '.') { set(cfg.next(st[i], true)); return true; }
        if (k === 'Backspace' || k === 'Delete') { set(0); return true; }
        if (k === 'Escape') { B.cur.on = false; B.drawCursor(); }
        return false;
      },
      destroy() { wb.svg.removeEventListener('pointerleave', leave); }
    };
  }

  // fill in a list of changes as a wave from the top left corner, then report
  function waveFill(B, items, keyOf, apply, redraw, done) {
    const order = items.slice().sort((a, b) => keyOf(a) - keyOf(b));
    const frames = 22, per = Math.max(1, Math.ceil(order.length / frames));
    let k = 0;
    const tick = () => {
      for (let t = 0; t < per && k < order.length; t++, k++) apply(order[k]);
      redraw();
      if (k < order.length) B.later(tick, C.anim(32));
      else done();
    };
    tick();
  }

  /* =====================================================================
   *  TENTS
   * ===================================================================== */

  function treeGlyph(s, g, x, y) {
    s('ellipse', { cx: x + S / 2, cy: y + S * 0.86, rx: S * 0.26, ry: S * 0.06, class: 't1-shadow' }, g);
    s('rect', { x: x + S / 2 - 2.6, y: y + S * 0.55, width: 5.2, height: S * 0.3, rx: 1.5, class: 't1-trunk' }, g);
    s('circle', { cx: x + S / 2, cy: y + S * 0.4, r: S * 0.29, class: 't1-canopy' }, g);
    s('circle', { cx: x + S / 2 - 4.5, cy: y + S * 0.33, r: S * 0.12, class: 't1-canopy-hi' }, g);
  }
  function tentGlyph(s, g, x, y, cls) {
    s('ellipse', { cx: x + S / 2, cy: y + S * 0.83, rx: S * 0.36, ry: S * 0.06, class: 't1-shadow' }, g);
    s('path', { d: 'M' + (x + 6) + ' ' + (y + 32) + 'L' + (x + 20) + ' ' + (y + 8) + 'L' + (x + 34) + ' ' + (y + 32) + 'Z', class: 't1-tent' + (cls || '') }, g);
    s('path', { d: 'M' + (x + 20) + ' ' + (y + 17) + 'L' + (x + 15.5) + ' ' + (y + 32) + 'L' + (x + 24.5) + ' ' + (y + 32) + 'Z', class: 't1-door' }, g);
    s('path', { d: 'M' + (x + 20) + ' ' + (y + 8) + 'l0 -3.5', class: 't1-pole' }, g);
  }
  function grassGlyph(s, g, x, y, faint) {
    if (faint) { s('circle', { cx: x + S / 2, cy: y + S / 2, r: 2.4, class: 't1-grassdot' }, g); return; }
    s('rect', { x: x + 1.5, y: y + 1.5, width: S - 3, height: S - 3, rx: 4, class: 't1-grass' }, g);
    s('path', { d: 'M' + (x + 14) + ' ' + (y + 27) + 'l2 -7M' + (x + 20) + ' ' + (y + 28) + 'l0 -9M' + (x + 26) + ' ' + (y + 27) + 'l-2 -7', class: 't1-tuft' }, g);
  }

  MOUNT.tents = function (ctx, p) {
    const d = p.data, L = LG(), s = ctx.s;
    const P = L.tnPrep(d.grid, d.rows, d.cols);
    const w = P.w, h = P.h, N = P.N;
    const B = makeBoard(ctx, 'tents', w, h, { r: S * 0.95, b: S * 0.95 });
    const sol = new Int8Array(N);
    for (let i = 0; i < N; i++) sol[i] = d.sol[Math.floor(i / w)][i % w] === '*' ? 1 : 0;
    const st = new Int8Array(N);        // 0 empty, 1 tent, 2 grass
    const fixed = Uint8Array.from(P.tree);
    const opt = { implied: true };
    let won = false;
    ctx.setGoal(p.goal || GOALS.tents);

    B.gridLines();
    B.frame();
    const treeG = s('g', { class: 't1-trees' }, B.marks);
    for (let i = 0; i < N; i++) {
      if (P.tree[i]) { B.cellEls[i].classList.add('t1-treecell'); treeGlyph(s, s('g', { class: 't1-treeg', 'data-i': i }, treeG), B.cx(i), B.cy(i)); }
      else if (!P.cand[i]) B.cellEls[i].classList.add('t1-meadow');
    }
    const treeEls = Array.from(treeG.children);
    const markEls = [], sig = new Array(N).fill('');
    for (let i = 0; i < N; i++) markEls.push(s('g', null, B.marks));
    const ropeG = s('g', { class: 't1-ropes' }, B.under);
    const countEls = [];
    for (let r = 0; r < h; r++) countEls.push(s('text', { x: B.ox + B.GW + S * 0.48, y: B.oy + r * S + S / 2, class: 't1-count', text: String(d.rows[r]) }, B.texts));
    for (let c = 0; c < w; c++) countEls.push(s('text', { x: B.ox + c * S + S / 2, y: B.oy + B.GH + S * 0.48, class: 't1-count', text: String(d.cols[c]) }, B.texts));

    const vals = () => { const v = new Int8Array(N); for (let i = 0; i < N; i++) v[i] = st[i] === 1 ? 1 : st[i] === 2 ? 0 : -1; for (let i = 0; i < N; i++) if (P.tree[i]) v[i] = 0; return v; };
    const tentsOf = () => Uint8Array.from(st, (x) => (x === 1 ? 1 : 0));

    function evaluate() {
      const t = tentsOf();
      if (L.tnValid(P, t)) return { solved: true, msg: SOLVED.tents[C.hash(p.id) % 3] };
      let touching = false, placed = 0, badLines = 0;
      for (let i = 0; i < N; i++) if (t[i]) { placed++; for (const j of P.n8[i]) if (t[j]) touching = true; }
      P.lines.forEach((cells, li) => { if (cells.reduce((a, i) => a + t[i], 0) !== P.need[li]) badLines++; });
      if (touching) return { solved: false, msg: 'Two tents are touching.' };
      if (placed < P.trees.length) return { solved: false, msg: C.plural(P.trees.length - placed, 'tree still needs', 'trees still need') + ' a tent.' };
      if (badLines) return { solved: false, msg: C.plural(badLines, 'row or column has', 'rows and columns have') + ' the wrong number of tents.' };
      return { solved: false, msg: 'Some tent is not beside a tree of its own.' };
    }

    const err = new Uint8Array(N), imp = new Uint8Array(N), treeErr = new Uint8Array(N);
    function refresh() {
      err.fill(0); imp.fill(0); treeErr.fill(0);
      const v = vals();
      let placed = 0;
      for (let i = 0; i < N; i++) {
        if (st[i] !== 1) continue;
        placed++;
        if (!P.cand[i]) err[i] = 1;
        for (const j of P.n8[i]) if (st[j] === 1) { err[i] = 1; err[j] = 1; }
      }
      // the lines
      P.lines.forEach((cells, li) => {
        let t = 0, room = 0;
        for (const i of cells) { if (st[i] === 1) t++; else if (st[i] === 0 && P.cand[i] && !P.n8[i].some((j) => st[j] === 1)) room++; }
        const need = P.need[li];
        countEls[li].classList.toggle('done', t === need);
        countEls[li].classList.toggle('bad', t > need || t + room < need);
        if (t >= need) for (const i of cells) if (st[i] === 0) imp[i] = 1;
      });
      for (let i = 0; i < N; i++) if (st[i] === 1) for (const j of P.n8[i]) if (st[j] === 0) imp[j] = 1;
      // trees with no room left, tents with no tree of their own
      P.trees.forEach((ti, t) => { if (P.treeNb[t].every((j) => st[j] === 2)) treeErr[ti] = 1; });
      const m = L.tnMatch(P, v);
      if (!m.ok) { if (m.t === 'tree') treeErr[m.at] = 1; else err[m.at] = 1; }
      treeEls.forEach((g) => g.classList.toggle('err', !!treeErr[+g.getAttribute('data-i')]));
      B.G.classList.toggle('imp', opt.implied);
      for (let i = 0; i < N; i++) {
        if (P.tree[i]) continue;
        const faint = st[i] === 0 && opt.implied && (imp[i] || !P.cand[i]) ? 1 : 0;
        const key = st[i] + ':' + err[i] + ':' + faint;
        if (sig[i] === key) continue;
        sig[i] = key;
        const g = markEls[i];
        while (g.firstChild) g.removeChild(g.firstChild);
        if (st[i] === 1) tentGlyph(s, g, B.cx(i), B.cy(i), err[i] ? ' err' : '');
        else if (st[i] === 2) grassGlyph(s, g, B.cx(i), B.cy(i));
        else if (faint && P.cand[i]) grassGlyph(s, g, B.cx(i), B.cy(i), true);
      }
      ctx.stat('Tents', placed + ' of ' + P.trees.length);
      B.prune((key) => st[key[0]] === key[1]);
      if (won && !evaluate().solved) setWon(false);
    }

    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      B.G.classList.toggle('won', on);
      B.G.classList.toggle('still', on && !animate);
      while (ropeG.firstChild) ropeG.removeChild(ropeG.firstChild);
      if (!on) return;
      // guy ropes: each tree to its own tent
      const m = L.tnMatch(P, vals());
      if (!m.ok) return;
      P.trees.forEach((ti, t) => {
        const x = m.mt[t];
        if (x < 0) return;
        s('path', { d: 'M' + (B.cx(ti) + S / 2) + ' ' + (B.cy(ti) + S / 2) + 'L' + (B.cx(x) + S / 2) + ' ' + (B.cy(x) + S / 2), class: 't1-rope' }, ropeG);
      });
    }

    const marker = cellMarker(ctx, B, {
      st, fixed,
      // Tatham's way: an empty cell takes a tent (left) or grass (right); a marked cell clears with either button
      next: (s0, back) => (s0 ? 0 : back ? 2 : 1),
      one: (to) => to === 1,
      refresh,
      names: ['Tent', 'Grass'],
      tip: 'Right-click puts grass. Drag with the right button along a line to grass a whole run.',
      onFixed: () => ctx.toast('That is a tree — pitch its tent beside it.')
    });
    const cb = ctx.h('input', { type: 'checkbox', checked: true, onchange: () => { opt.implied = cb.checked; sig.fill(''); refresh(); } });
    marker.box.appendChild(ctx.h('label.t1-opt', cb, ' Dot the cells that cannot hold a tent'));

    const flow = hintFlow(ctx, B, {
      markWord: (k) => (k === 1 ? 'mark' : 'marks'),
      wrong() { const out = []; for (let i = 0; i < N; i++) if ((st[i] === 1 && !sol[i]) || (st[i] === 2 && sol[i])) out.push(i); return out; },
      rubOut(list) { list.forEach((i) => { st[i] = 0; }); },
      showWrong(list) { list.forEach((i) => B.wrongBox(i)); },
      redraw: refresh,
      step() {
        const r = L.tnStep(P, vals(), 4);
        return r && { text: r.text, set: r.set.map(([i, x]) => [i, x === 1 ? 1 : 2]), focus: r.focus || [], line: r.line };
      },
      todo: (set) => set.filter(([i, x]) => st[i] !== x),
      apply(set) { set.forEach(([i, x]) => { st[i] = x; }); },
      describe(set) {
        const k1 = set.filter((x) => x[1] === 1).length, k2 = set.length - k1;
        return [k1 ? (k1 === 1 ? 'a tent' : cnt(k1) + ' tents') : null, k2 ? (k2 === 1 ? 'one patch of grass' : cnt(k2) + ' patches of grass') : null].filter(Boolean).join(' and ');
      },
      showStep(stp) {
        if (stp.line != null) B.band(stp.line); else B.zone(stp.focus);
        stp.set.forEach(([i, x]) => B.ghost([i, x], (g) => {
          s('rect', { x: B.cx(i) + 2.5, y: B.cy(i) + 2.5, width: S - 5, height: S - 5, rx: 5, class: 't1-hcell' }, g);
          if (x === 1) tentGlyph(s, g, B.cx(i), B.cy(i)); else grassGlyph(s, g, B.cx(i), B.cy(i));
        }));
      },
      flash(set) { B.flash(set.map((x) => x[0])); },
      evaluate
    });

    refresh();

    return {
      noMoves: true,
      check(manual) {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); B.clearHint(); }
        return r;
      },
      hint: () => flow.hint(),
      solve() {
        B.clearHint();
        flow.clear();
        const items = [];
        for (let i = 0; i < N; i++) {
          if (P.tree[i]) continue;
          const want = sol[i] ? 1 : P.cand[i] ? 2 : 0;
          if (st[i] !== want) items.push(i);
        }
        waveFill(B, items, (i) => B.rowOf(i) + B.colOf(i), (i) => { st[i] = sol[i] ? 1 : P.cand[i] ? 2 : 0; }, refresh, () => ctx.changed('solve'));
      },
      getState() { return { s: Array.from(st).join('') }; },
      setState(o) {
        if (!o || typeof o.s !== 'string' || o.s.length !== N) return;
        for (let i = 0; i < N; i++) st[i] = fixed[i] ? 0 : (+o.s[i] || 0);
        marker.cancel();
        B.clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { flow.reset(); B.clearHint(); },
      key: (ev) => marker.key(ev),
      destroy() { B.destroy(); marker.destroy(); }
    };
  };

  /* =====================================================================
   *  SINGLES (HITORI)
   * ===================================================================== */

  MOUNT.hitori = function (ctx, p) {
    const d = p.data, L = LG(), s = ctx.s;
    const P = L.htPrep(d.grid);
    const w = P.w, h = P.h, N = P.N;
    const B = makeBoard(ctx, 'hitori', w, h, { l: S * 0.34, t: S * 0.34 });
    const sol = new Int8Array(N);
    for (let i = 0; i < N; i++) sol[i] = d.sol[Math.floor(i / w)][i % w] === '#' ? 1 : 0;
    const st = new Int8Array(N);        // 0 empty, 1 black, 2 circled
    const fixed = new Uint8Array(N);
    const opt = { implied: true };
    let won = false;
    ctx.setGoal(p.goal || GOALS.hitori);

    B.gridLines();
    B.frame();
    const markEls = [], numEls = [], sig = new Array(N).fill('');
    for (let i = 0; i < N; i++) markEls.push(s('g', null, B.marks));
    for (let i = 0; i < N; i++) numEls.push(s('text', { x: B.cx(i) + S / 2, y: B.cy(i) + S / 2 + 0.5, class: 't1-hnum' + (P.num[i] > 9 ? ' small' : ''), text: String(P.num[i]) }, B.texts));
    const bars = [];
    for (let r = 0; r < h; r++) bars.push(s('rect', { x: B.ox - S * 0.27, y: B.oy + r * S + S * 0.14, width: S * 0.13, height: S * 0.72, rx: 2.5, class: 't1-bar' }, B.texts));
    for (let c = 0; c < w; c++) bars.push(s('rect', { x: B.ox + c * S + S * 0.14, y: B.oy - S * 0.27, width: S * 0.72, height: S * 0.13, rx: 2.5, class: 't1-bar' }, B.texts));

    const vals = () => Int8Array.from(st, (x) => (x === 1 ? 1 : x === 2 ? 0 : -1));
    const blackOf = () => Uint8Array.from(st, (x) => (x === 1 ? 1 : 0));

    function evaluate() {
      const bl = blackOf();
      if (L.htValid(P, bl)) return { solved: true, msg: SOLVED.hitori[C.hash(p.id) % 3] };
      for (let i = 0; i < N; i++) if (bl[i]) for (const j of P.n4[i]) if (bl[j]) return { solved: false, msg: 'Two black cells are touching.' };
      const v = Int8Array.from(bl, (x) => (x ? 1 : 0));
      if (L.htPieces(P, v).pieces.length > 1) return { solved: false, msg: 'The white cells are cut into separate parts.' };
      let rep = 0;
      P.lines.forEach((cells) => { const seen = {}; cells.forEach((i) => { if (!bl[i]) { if (seen[P.num[i]]) rep++; seen[P.num[i]] = 1; } }); });
      return { solved: false, msg: C.plural(rep, 'number still repeats', 'numbers still repeat') + ' in a row or column.' };
    }

    const err = new Uint8Array(N), imp = new Uint8Array(N), cut = new Uint8Array(N), dup = new Uint8Array(N);
    function refresh() {
      err.fill(0); imp.fill(0); cut.fill(0); dup.fill(0);
      for (let i = 0; i < N; i++) if (st[i] === 1) for (const j of P.n4[i]) { if (st[j] === 1) { err[i] = 1; err[j] = 1; } else imp[j] = 1; }
      // known white cells repeating a number
      const white = (i) => st[i] === 2 || (st[i] === 0 && imp[i]);
      for (let i = 0; i < N; i++) if (white(i)) for (const j of P.same[i]) if (white(j)) { dup[i] = 1; dup[j] = 1; }
      // white cells cut off from the main part
      const v = Int8Array.from(st, (x) => (x === 1 ? 1 : 0));
      const pc = L.htPieces(P, v);
      if (pc.pieces.length > 1) {
        let big = 0;
        pc.pieces.forEach((q, k) => { if (q.length > pc.pieces[big].length) big = k; });
        pc.pieces.forEach((q, k) => { if (k !== big) q.forEach((i) => { cut[i] = 1; }); });
      }
      // lines with no repeats left among the cells not blacked out
      let rep = 0;
      P.lines.forEach((cells, li) => {
        const seen = {};
        let clean = true;
        cells.forEach((i) => { if (st[i] !== 1) { if (seen[P.num[i]]) { clean = false; rep++; } seen[P.num[i]] = 1; } });
        bars[li].classList.toggle('ok', clean);
      });
      for (let i = 0; i < N; i++) {
        const faint = st[i] === 0 && imp[i] && opt.implied ? 1 : 0;
        const key = st[i] + ':' + err[i] + ':' + faint + ':' + dup[i] + ':' + cut[i];
        if (sig[i] === key) continue;
        sig[i] = key;
        const g = markEls[i], x = B.cx(i), y = B.cy(i);
        while (g.firstChild) g.removeChild(g.firstChild);
        if (cut[i]) s('rect', { x: x + 1, y: y + 1, width: S - 2, height: S - 2, rx: 3, class: 't1-cut' }, g);
        if (st[i] === 1) s('rect', { x: x + 1.5, y: y + 1.5, width: S - 3, height: S - 3, rx: 4, class: 't1-black' + (err[i] ? ' err' : '') }, g);
        else if (st[i] === 2) s('circle', { cx: x + S / 2, cy: y + S / 2, r: S * 0.36, class: 't1-ring' + (dup[i] ? ' err' : '') }, g);
        else if (faint) s('circle', { cx: x + S / 2, cy: y + S / 2, r: S * 0.36, class: 't1-ring implied' + (dup[i] ? ' err' : '') }, g);
        numEls[i].setAttribute('class', 't1-hnum' + (P.num[i] > 9 ? ' small' : '') + (st[i] === 1 ? ' onblack' : '') + (dup[i] ? ' bad' : ''));
      }
      ctx.stat('Repeats left', rep);
      B.prune((key) => st[key[0]] === key[1]);
      if (won && !evaluate().solved) setWon(false);
    }
    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      B.G.classList.toggle('won', on);
      B.G.classList.toggle('still', on && !animate);
    }

    const marker = cellMarker(ctx, B, {
      st, fixed,
      next: (s0, back) => (back ? (s0 === 2 ? 0 : 2) : (s0 === 1 ? 0 : 1)),
      one: (to) => to === 1,
      refresh,
      names: ['Black', 'Circle'],
      tip: 'Right-click circles a cell you know stays white. Drag with the right button to circle a run.'
    });
    const cb = ctx.h('input', { type: 'checkbox', checked: true, onchange: () => { opt.implied = cb.checked; sig.fill(''); refresh(); } });
    marker.box.appendChild(ctx.h('label.t1-opt', cb, ' Ring the cells next to black ones (they stay white)'));

    const flow = hintFlow(ctx, B, {
      markWord: (k) => (k === 1 ? 'mark' : 'marks'),
      wrong() { const out = []; for (let i = 0; i < N; i++) if ((st[i] === 1 && !sol[i]) || (st[i] === 2 && sol[i])) out.push(i); return out; },
      rubOut(list) { list.forEach((i) => { st[i] = 0; }); },
      showWrong(list) { list.forEach((i) => B.wrongBox(i)); },
      redraw: refresh,
      step() {
        const r = L.htStep(P, vals(), 4);
        return r && { text: r.text, set: r.set.map(([i, x]) => [i, x === 1 ? 1 : 2]), focus: r.focus || [] };
      },
      todo: (set) => set.filter(([i, x]) => st[i] !== x),
      apply(set) { set.forEach(([i, x]) => { st[i] = x; }); },
      describe(set) {
        const k1 = set.filter((x) => x[1] === 1).length, k2 = set.length - k1;
        return [k1 ? (k1 === 1 ? 'a black cell' : cnt(k1) + ' black cells') : null, k2 ? (k2 === 1 ? 'a circle' : cnt(k2) + ' circles') : null].filter(Boolean).join(' and ');
      },
      showStep(stp) {
        B.zone(stp.focus);
        stp.set.forEach(([i, x]) => B.ghost([i, x], (g) => {
          const cx = B.cx(i), cy = B.cy(i);
          s('rect', { x: cx + 2.5, y: cy + 2.5, width: S - 5, height: S - 5, rx: 5, class: 't1-hcell' }, g);
          if (x === 1) s('rect', { x: cx + 5, y: cy + 5, width: S - 10, height: S - 10, rx: 4, class: 't1-black' }, g);
          else s('circle', { cx: cx + S / 2, cy: cy + S / 2, r: S * 0.36, class: 't1-ring' }, g);
        }));
      },
      flash(set) { B.flash(set.map((x) => x[0])); },
      evaluate
    });

    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); B.clearHint(); }
        return r;
      },
      hint: () => flow.hint(),
      solve() {
        B.clearHint();
        flow.clear();
        const items = [];
        for (let i = 0; i < N; i++) if ((sol[i] && st[i] !== 1) || (!sol[i] && st[i] === 1)) items.push(i);
        waveFill(B, items, (i) => B.rowOf(i) + B.colOf(i), (i) => { st[i] = sol[i] ? 1 : 0; }, refresh, () => ctx.changed('solve'));
      },
      getState() { return { s: Array.from(st).join('') }; },
      setState(o) {
        if (!o || typeof o.s !== 'string' || o.s.length !== N) return;
        for (let i = 0; i < N; i++) st[i] = +o.s[i] || 0;
        marker.cancel();
        B.clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { flow.reset(); B.clearHint(); },
      key: (ev) => marker.key(ev),
      destroy() { B.destroy(); marker.destroy(); }
    };
  };

  /* =====================================================================
   *  DOMINOSA
   * ===================================================================== */

  MOUNT.dominosa = function (ctx, p) {
    const d = p.data, L = LG(), s = ctx.s, wb = ctx.wb;
    const P = L.dmPrep(d.grid);
    const w = P.w, h = P.h, N = P.N, nE = P.nE, n = P.n;
    const B = makeBoard(ctx, 'dominosa', w, h);
    const solE = new Set(L.dmSolEdges(P, d.sol));
    const es = new Int8Array(nE);       // 0 nothing, 1 a domino, 2 a line (not a domino)
    const ui = { tapLine: false, show: -1, sticky: -1 };
    let won = false, drag = null, arm = null;
    ctx.setGoal(p.goal || GOALS.dominosa);
    B.gridLines('t1-grid faint');
    B.frame();

    const candG = s('g', null, B.under);
    const domG = s('g', { class: 't1-doms' }, B.under);
    const wallEl = s('path', { class: 't1-wall' }, B.lines);
    const numEls = [];
    for (let i = 0; i < N; i++) numEls.push(s('text', { x: B.cx(i) + S / 2, y: B.cy(i) + S / 2 + 0.5, class: 't1-dnum', text: String(P.num[i]) }, B.texts));

    /* geometry */
    const edgeSeg = (e) => {
      const E = P.E[e], x = B.cx(E.a), y = B.cy(E.a);
      return E.hz ? [[x + S, y], [x + S, y + S]] : [[x, y + S], [x + S, y + S]];
    };
    const segDist = (pt, sg) => {
      const [a, b] = sg, dx = b[0] - a[0], dy = b[1] - a[1];
      const t = Math.max(0, Math.min(1, ((pt[0] - a[0]) * dx + (pt[1] - a[1]) * dy) / (dx * dx + dy * dy)));
      return Math.hypot(pt[0] - a[0] - t * dx, pt[1] - a[1] - t * dy);
    };
    function nearestEdge(pt, maxDist) {
      const i = B.cellAt(pt);
      if (i < 0) return -1;
      let best = -1, bd = 1e9;
      for (const e of P.cellEdges[i]) { const dd = segDist(pt, edgeSeg(e)); if (dd < bd) { bd = dd; best = e; } }
      return maxDist != null && bd > maxDist ? -1 : best;
    }
    const capsule = (e, cls, parent) => {
      const E = P.E[e], m = 3;
      return s('rect', { x: B.cx(E.a) + m, y: B.cy(E.a) + m, width: (E.hz ? 2 * S : S) - 2 * m, height: (E.hz ? S : 2 * S) - 2 * m, rx: 9, class: cls }, parent);
    };

    /* changing the board */
    function coverOf() {
      const cov = new Int32Array(N).fill(-1);
      for (let e = 0; e < nE; e++) if (es[e] === 1) { cov[P.E[e].a] = e; cov[P.E[e].b] = e; }
      return cov;
    }
    function place(e) {
      const E = P.E[e];
      P.cellEdges[E.a].concat(P.cellEdges[E.b]).forEach((f) => { if (es[f] === 1) es[f] = 0; });
      es[e] = 1;
    }
    function toggleDomino(e) { if (es[e] === 1) es[e] = 0; else place(e); ctx.sfx('snap'); }
    function toggleLine(e) { es[e] = es[e] === 2 ? 0 : 2; ctx.sfx('tap'); }

    /* what the board says */
    function counts() {
      const k = new Int32Array(P.nT);
      for (let e = 0; e < nE; e++) if (es[e] === 1) k[P.E[e].t]++;
      return k;
    }
    function evaluate() {
      const k = counts(), cov = coverOf();
      const twice = k.findIndex((x) => x > 1);
      let open = 0;
      for (let i = 0; i < N; i++) if (cov[i] < 0) open++;
      if (!open && twice < 0) return { solved: true, msg: SOLVED.dominosa[C.hash(p.id) % 3] };
      if (twice >= 0) return { solved: false, msg: 'The **' + L.dmTypeName(P, twice) + '** is laid twice.' };
      return { solved: false, msg: C.plural(open / 2, 'domino') + ' still to find.' };
    }

    function refresh() {
      const k = counts(), cov = coverOf();
      while (domG.firstChild) domG.removeChild(domG.firstChild);
      let order = 0, placed = 0;
      for (let e = 0; e < nE; e++) {
        if (es[e] !== 1) continue;
        placed++;
        const E = P.E[e];
        const g = s('g', { class: 't1-dom' + (k[E.t] > 1 ? ' dup' : '') }, domG);
        g.style.animationDelay = (0.04 * order++) + 's';
        capsule(e, 't1-dombody', g);
        const x = B.cx(E.a), y = B.cy(E.a);
        s('path', { d: E.hz ? 'M' + (x + S) + ' ' + (y + 9) + 'V' + (y + S - 9) : 'M' + (x + 9) + ' ' + (y + S) + 'H' + (x + S - 9), class: 't1-domline' }, g);
      }
      let walls = '';
      for (let e = 0; e < nE; e++) {
        if (es[e] !== 2) continue;
        const E = P.E[e], x = B.cx(E.a), y = B.cy(E.a);
        walls += E.hz ? 'M' + (x + S) + ' ' + (y + 5) + 'V' + (y + S - 5) : 'M' + (x + 5) + ' ' + (y + S) + 'H' + (x + S - 5);
      }
      wallEl.setAttribute('d', walls);
      for (let i = 0; i < N; i++) {
        let stuck = false;
        if (cov[i] < 0) stuck = P.cellEdges[i].every((e) => { const E = P.E[e], j = E.a === i ? E.b : E.a; return es[e] === 2 || cov[j] >= 0; });
        numEls[i].setAttribute('class', 't1-dnum' + (cov[i] >= 0 ? ' on' : '') + (stuck ? ' bad' : ''));
      }
      typeBtns.forEach((b, t) => { b.classList.toggle('found', k[t] === 1); b.classList.toggle('dup', k[t] > 1); });
      ctx.stat('Dominoes', placed + ' of ' + P.nT);
      drawCands();
      B.prune((key) => es[key[0]] === key[1]);
      if (won && !evaluate().solved) setWon(false);
    }

    // every place the domino of type t could still go
    function drawCands() {
      while (candG.firstChild) candG.removeChild(candG.firstChild);
      const t = ui.show;
      if (t < 0) return;
      const cov = coverOf();
      for (const e of P.typeEdges[t]) {
        const E = P.E[e];
        if (es[e] === 2) continue;
        if ((cov[E.a] >= 0 && cov[E.a] !== e) || (cov[E.b] >= 0 && cov[E.b] !== e)) continue;
        capsule(e, 't1-cand' + (es[e] === 1 ? ' here' : ''), candG);
      }
    }

    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      B.G.classList.toggle('won', on);
      B.G.classList.toggle('still', on && !animate);
    }

    /* gestures */
    const preview = (e) => {
      while (B.live.firstChild) B.live.removeChild(B.live.firstChild);
      if (e >= 0) capsule(e, 't1-preview' + (es[e] === 1 ? ' off' : ''), B.live);
    };
    function lineDragAt(pt) {
      const e = nearestEdge(pt, S * 0.3);
      if (e < 0 || drag.seen.has(e)) return;
      drag.seen.add(e);
      if (drag.add && es[e] === 0) { es[e] = 2; drag.changed = true; refresh(); }
      else if (!drag.add && es[e] === 2) { es[e] = 0; drag.changed = true; refresh(); }
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = B.cellAt(pt);
        if (i < 0) return false;
        B.cur.on = false; B.cursorAt(i);
        if (ev.button === 2 || ui.tapLine) {
          const e = nearestEdge(pt);
          if (e < 0) return true;
          if (es[e] === 1) es[e] = 2; else toggleLine(e);
          drag = { kind: 'line', add: es[e] === 2, seen: new Set([e]), changed: true };
          refresh();
          return true;
        }
        drag = { kind: 'dom', a: i, p0: pt, e: -1, far: false };
        return true;
      },
      move(pt) {
        if (!drag) return;
        if (drag.kind === 'line') { lineDragAt(pt); return; }
        const a = drag.a, cxA = B.cx(a) + S / 2, cyA = B.cy(a) + S / 2;
        const dx = pt[0] - cxA, dy = pt[1] - cyA;
        if (Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > S * 0.2) drag.far = true;
        let e = -1;
        if (Math.max(Math.abs(dx), Math.abs(dy)) > S * 0.55) {
          const r = Math.floor(a / w), c = a % w;
          const [rr, cc] = Math.abs(dx) >= Math.abs(dy) ? [r, c + Math.sign(dx)] : [r + Math.sign(dy), c];
          if (rr >= 0 && rr < h && cc >= 0 && cc < w) e = L.dmEdge(P, a, rr * w + cc);
        }
        if (e !== drag.e) { drag.e = e; preview(e); }
      },
      up(pt) {
        const g = drag;
        drag = null;
        preview(-1);
        if (!g) return;
        if (g.kind === 'line') { if (g.changed) ctx.changed('lines'); return; }
        if (g.e >= 0) { toggleDomino(g.e); refresh(); ctx.changed('domino'); return; }
        if (g.far) return;
        const e = nearestEdge(pt, S * 0.28);
        if (e >= 0) { toggleDomino(e); refresh(); ctx.changed('domino'); return; }
        const cov = coverOf();
        if (cov[g.a] >= 0) { es[cov[g.a]] = 0; ctx.sfx('tap'); refresh(); ctx.changed('domino'); }
      }
    };

    /* the panel: the tap switch and the set */
    const segBtns = ['Domino', 'Line'].map((label, k) => ctx.h('button.t1-segb' + (k === 0 ? '.on' : ''), { type: 'button', onclick: () => { ui.tapLine = k === 1; segBtns.forEach((b, j) => b.classList.toggle('on', j === k)); } }, label));
    const setEl = ctx.h('div.t1-set', { style: { gridTemplateColumns: 'repeat(' + (n + 1) + ', minmax(0, 1fr))' } });
    const typeBtns = [];
    for (let a = 0; a <= n; a++) {
      for (let b = 0; b <= n; b++) {
        if (b < a) { setEl.appendChild(ctx.h('span.t1-setgap')); continue; }
        const t = L.dmType(n, a, b);
        const btn = ctx.h('button.t1-setb', { type: 'button', title: 'The ' + a + '–' + b + ': point at it to see where it could go, click to keep it shown' }, ctx.h('span', String(a)), ctx.h('span', String(b)));
        btn.addEventListener('mouseenter', () => { ui.show = t; drawCands(); });
        btn.addEventListener('mouseleave', () => { ui.show = ui.sticky; drawCands(); });
        btn.addEventListener('click', () => {
          ui.sticky = ui.sticky === t ? -1 : t;
          ui.show = ui.sticky;
          typeBtns.forEach((x, k) => x.classList.toggle('pin', k === ui.sticky));
          drawCands();
        });
        typeBtns[t] = btn;
        setEl.appendChild(btn);
      }
    }
    ctx.panel.appendChild(ctx.h('div.t1-panel',
      ctx.h('div.t1-seg', ctx.h('span.t1-segl', 'Click or tap:'), segBtns[0], segBtns[1]),
      ctx.h('div.t1-tip', 'Drag between two numbers, or click the line between them, for a domino. Right-click (or drag with the right button) for lines.'),
      ctx.h('div.t1-setl', 'The set — found ones are ticked; point at one to see where it could go:'),
      setEl));

    /* hints */
    const vals = () => Int8Array.from(es, (x) => (x === 1 ? 1 : x === 2 ? 0 : -1));
    const edgeCells = (set) => { const out = []; set.forEach(([e]) => { out.push(P.E[e].a, P.E[e].b); }); return out; };
    const flow = hintFlow(ctx, B, {
      markWord: (k) => (k === 1 ? 'mark' : 'marks'),
      wrong() { const out = []; for (let e = 0; e < nE; e++) if ((es[e] === 1 && !solE.has(e)) || (es[e] === 2 && solE.has(e))) out.push(e); return out; },
      rubOut(list) { list.forEach((e) => { es[e] = 0; }); },
      showWrong(list) { list.forEach((e) => { if (es[e] === 1) capsule(e, 't1-hwrong', B.hintG); else { const [a, b] = edgeSeg(e); s('path', { d: 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], class: 't1-hwrongline' }, B.hintG); } }); },
      redraw: refresh,
      step() {
        const r = L.dmStep(P, vals(), 4);
        return r && { text: r.text, set: r.set.map(([e, x]) => [e, x === 1 ? 1 : 2]), focus: r.focus || [] };
      },
      todo: (set) => set.filter(([e, x]) => es[e] !== x),
      apply(set) { set.forEach(([e, x]) => { if (x === 1) place(e); else es[e] = 2; }); },
      describe(set) {
        const k1 = set.filter((x) => x[1] === 1).length, k2 = set.length - k1;
        return [k1 ? (k1 === 1 ? 'a domino' : cnt(k1) + ' dominoes') : null, k2 ? (k2 === 1 ? 'a line' : cnt(k2) + ' lines') : null].filter(Boolean).join(' and ');
      },
      showStep(stp) {
        B.zone(Array.from(new Set(stp.focus)));
        stp.set.forEach(([e, x]) => B.ghost([e, x], (g) => {
          if (x === 1) capsule(e, 't1-hdom', g);
          else { const [a, b] = edgeSeg(e); s('path', { d: 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1], class: 't1-hwall' }, g); }
        }));
      },
      flash(set) { B.flash(edgeCells(set)); },
      evaluate
    });

    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); B.clearHint(); }
        return r;
      },
      hint: () => flow.hint(),
      solve() {
        B.clearHint();
        flow.clear();
        for (let e = 0; e < nE; e++) if (es[e] === 2 || (es[e] === 1 && !solE.has(e))) es[e] = 0;
        const items = Array.from(solE).filter((e) => es[e] !== 1);
        waveFill(B, items, (e) => B.rowOf(P.E[e].a) + B.colOf(P.E[e].a), (e) => { es[e] = 1; }, refresh, () => ctx.changed('solve'));
      },
      getState() { return { e: Array.from(es).join('') }; },
      setState(o) {
        if (!o || typeof o.e !== 'string' || o.e.length !== nE) return;
        for (let e = 0; e < nE; e++) es[e] = +o.e[e] || 0;
        drag = null;
        preview(-1);
        B.clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { flow.reset(); B.clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return B.cur.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (dirs[k]) {
          const i = B.cur.r * w + B.cur.c;
          const rr = B.cur.r + dirs[k][0], cc = B.cur.c + dirs[k][1];
          const inside = rr >= 0 && rr < h && cc >= 0 && cc < w;
          if (B.cur.on && (arm || ev.shiftKey) && inside) {
            const e = L.dmEdge(P, i, rr * w + cc);
            if (arm === 'line') toggleLine(e); else toggleDomino(e);
            arm = null;
            B.cursorEl.classList.remove('armed');
            refresh();
            ctx.changed('keys');
            return true;
          }
          B.moveCursor(dirs[k][0], dirs[k][1]);
          return true;
        }
        if (!B.cur.on) return false;
        if (k === 'Enter' || k === ' ') {
          arm = k === ' ' ? 'line' : 'dom';
          B.cursorEl.classList.add('armed');
          ctx.toast(arm === 'line' ? 'Line: now press an arrow' : 'Domino: now press an arrow');
          return true;
        }
        if (k === 'Backspace' || k === 'Delete') {
          const cov = coverOf(), i = B.cur.r * w + B.cur.c;
          if (cov[i] >= 0) { es[cov[i]] = 0; refresh(); ctx.changed('keys'); }
          return true;
        }
        if (k === 'Escape') { arm = null; B.cursorEl.classList.remove('armed'); B.cur.on = false; B.drawCursor(); }
        return false;
      },
      destroy() { B.destroy(); }
    };
  };

  /* =====================================================================
   *  FILLING (FILLOMINO)
   * ===================================================================== */

  MOUNT.fillomino = function (ctx, p) {
    const d = p.data, L = LG(), s = ctx.s, wb = ctx.wb;
    const P = L.flPrep(d.grid);
    const w = P.w, h = P.h, N = P.N, given = P.given;
    const B = makeBoard(ctx, 'fillomino', w, h);
    const sol = new Int8Array(N);
    for (let i = 0; i < N; i++) sol[i] = +d.sol[Math.floor(i / w)][i % w];
    const vals = new Int8Array(N);      // the player's digits (the printed ones stay in given)
    const opt = { counts: true };
    let sel = [], drag = null, won = false;
    ctx.setGoal(p.goal || GOALS.fillomino);

    const tintG = s('g', null, B.under);
    const selG = s('g', null, B.under);
    B.gridLines();
    const edgeEl = s('path', { class: 't1-fedge' }, B.lines);
    const borderEl = s('path', { class: 't1-border' }, B.lines);
    B.frame();
    const tintEls = [], numEls = [];
    for (let i = 0; i < N; i++) tintEls.push(s('rect', { x: B.cx(i), y: B.cy(i), width: S, height: S, class: 't1-ftint' }, tintG));
    for (let i = 0; i < N; i++) numEls.push(s('text', { x: B.cx(i) + S / 2, y: B.cy(i) + S / 2 + 0.5, class: 't1-fnum' }, B.texts));
    const countG = s('g', null, B.texts);

    const grid = () => { const g = new Int8Array(N); for (let i = 0; i < N; i++) g[i] = given[i] || vals[i]; return g; };

    function problems(g) {
      const { regs } = L.flRegions(P, g);
      for (const R of regs) if (R.size > R.d) return 'A group of **' + R.d + '**s has ' + R.size + ' cells.';
      for (const R of regs) {
        if (R.size >= R.d) continue;
        if (!R.cells.some((c) => P.n4[c].some((x) => !g[x]))) return 'A group of **' + R.d + '**s is shut in with only ' + C.plural(R.size, 'cell') + '.';
      }
      return null;
    }
    function evaluate() {
      const g = grid();
      let empty = 0;
      for (let i = 0; i < N; i++) if (!g[i]) empty++;
      if (!empty && L.flValid(P, g)) return { solved: true, msg: SOLVED.fillomino[C.hash(p.id) % 3] };
      const bad = problems(g);
      if (bad) return { solved: false, msg: bad };
      return { solved: false, msg: C.plural(empty, 'cell is', 'cells are') + ' still empty.' };
    }

    function refresh() {
      const g = grid();
      const { id, regs } = L.flRegions(P, g);
      const status = regs.map((R) => {
        if (R.size > R.d) return 'bad';
        if (R.size === R.d) return 'done';
        return R.cells.some((c) => P.n4[c].some((x) => !g[x])) ? 'part' : 'bad';
      });
      let thick = '', soft = '', empty = 0;
      for (let i = 0; i < N; i++) {
        const r = Math.floor(i / w), c = i % w, x = B.cx(i), y = B.cy(i);
        if (!g[i]) empty++;
        const k = id[i], stt = k >= 0 ? status[k] : '';
        tintEls[i].setAttribute('class', 't1-ftint' + (stt === 'done' ? ' h' + g[i] : stt === 'bad' ? ' bad' : ''));
        numEls[i].textContent = g[i] ? String(g[i]) : '';
        numEls[i].setAttribute('class', 't1-fnum' + (given[i] ? ' given' : ' user') + (stt === 'bad' ? ' bad' : ''));
        if (c + 1 < w) {
          const j = i + 1, seg = 'M' + (x + S) + ' ' + y + 'v' + S;
          if (g[i] && g[j] && g[i] !== g[j]) thick += seg; else if (!!g[i] !== !!g[j]) soft += seg;
        }
        if (r + 1 < h) {
          const j = i + w, seg = 'M' + x + ' ' + (y + S) + 'h' + S;
          if (g[i] && g[j] && g[i] !== g[j]) thick += seg; else if (!!g[i] !== !!g[j]) soft += seg;
        }
      }
      borderEl.setAttribute('d', thick);
      edgeEl.setAttribute('d', soft);
      while (countG.firstChild) countG.removeChild(countG.firstChild);
      if (opt.counts) regs.forEach((R, k) => {
        if (status[k] !== 'part' || R.size < 2) return;
        const a = Math.min(...R.cells);
        s('text', { x: B.cx(a) + 3.5, y: B.cy(a) + 8.5, class: 't1-fcount', text: R.size + '/' + R.d }, countG);
      });
      while (selG.firstChild) selG.removeChild(selG.firstChild);
      sel.forEach((i) => s('rect', { x: B.cx(i) + 1, y: B.cy(i) + 1, width: S - 2, height: S - 2, rx: 3, class: 't1-fsel' }, selG));
      ctx.stat('Empty', empty);
      B.prune((key) => g[key[0]] === key[1]);
      if (won && !evaluate().solved) setWon(false);
    }
    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      B.G.classList.toggle('won', on);
      B.G.classList.toggle('still', on && !animate);
    }

    /* writing */
    function input(dg) {
      if (!sel.length) { ctx.toast('Pick a cell first: click one, or use the arrow keys.'); return; }
      const cells = sel.filter((i) => !given[i]);
      if (!cells.length) { ctx.say('The printed numbers stay as they are.'); return; }
      if (cells.length === 1 && dg && vals[cells[0]] === dg) vals[cells[0]] = 0;
      else cells.forEach((i) => { vals[i] = dg; });
      ctx.sfx('tap');
      refresh();
      ctx.changed(dg ? 'digit' : 'erase');
    }
    function pick(i, add) {
      if (add) { const at = sel.indexOf(i); if (at >= 0) sel.splice(at, 1); else sel.push(i); }
      else sel = [i];
      B.cur.on = true;
      B.cursorAt(i);
      refresh();
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = B.cellAt(pt);
        if (i < 0) { if (sel.length) { sel = []; B.cur.on = false; B.drawCursor(); refresh(); } return false; }
        if (ev.button === 2) {
          drag = { kind: 'erase', last: -1, changed: false };
          this.move(pt);
          return true;
        }
        if (ev.shiftKey || ev.ctrlKey || ev.metaKey) { pick(i, true); drag = { kind: 'sel' }; return true; }
        const g = grid();
        pick(i, false);
        drag = g[i] ? { kind: 'copy', dg: g[i], last: i, changed: false } : { kind: 'sel' };
        return true;
      },
      move(pt) {
        if (!drag) return;
        const i = B.cellAt(pt);
        if (i < 0) return;
        if (drag.kind === 'sel') { if (!sel.includes(i)) { sel.push(i); B.cursorAt(i); refresh(); } return; }
        if (i === drag.last) return;
        drag.last = i;
        if (drag.kind === 'erase') {
          if (!given[i] && vals[i]) { vals[i] = 0; drag.changed = true; ctx.sfx('tap'); refresh(); }
          return;
        }
        if (!given[i] && vals[i] !== drag.dg) { vals[i] = drag.dg; drag.changed = true; ctx.sfx('tap'); }
        sel = [i];
        B.cursorAt(i);
        refresh();
      },
      up() {
        const g0 = drag;
        drag = null;
        if (g0 && g0.changed) ctx.changed(g0.kind);
      },
      hover(pt) { B.hover(pt); }
    };
    const leave = () => B.noHover();
    wb.svg.addEventListener('pointerleave', leave);

    /* the panel */
    const pad = C.numberPad({ keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear'], cols: 5, onKey: (k) => input(k === 'clear' ? 0 : k) });
    const cb = ctx.h('input', { type: 'checkbox', checked: true, onchange: () => { opt.counts = cb.checked; refresh(); } });
    ctx.panel.appendChild(ctx.h('div.t1-panel', pad,
      ctx.h('div.t1-tip', 'Drag across empty cells to fill several at once; drag from a number to copy it along. Right-drag rubs out.'),
      ctx.h('label.t1-opt', cb, ' Show how far each unfinished group has got')));

    /* hints */
    const flow = hintFlow(ctx, B, {
      markWord: (k) => (k === 1 ? 'number' : 'numbers'),
      wrong() { const out = []; for (let i = 0; i < N; i++) if (!given[i] && vals[i] && vals[i] !== sol[i]) out.push(i); return out; },
      rubOut(list) { list.forEach((i) => { vals[i] = 0; }); },
      showWrong(list) { list.forEach((i) => B.wrongBox(i)); },
      redraw: refresh,
      step() {
        const r = L.flStep(P, grid(), 4, sol);
        return r && { text: r.text, set: r.set, focus: r.focus || [] };
      },
      todo: (set) => { const g = grid(); return set.filter(([i, x]) => g[i] !== x); },
      apply(set) { set.forEach(([i, x]) => { vals[i] = x; }); },
      describe(set) { return set.length === 1 ? 'the **' + set[0][1] + '**' : cnt(set.length) + ' numbers'; },
      showStep(stp) {
        B.zone(stp.focus);
        stp.set.forEach(([i, x]) => B.ghost([i, x], (g) => {
          s('rect', { x: B.cx(i) + 2.5, y: B.cy(i) + 2.5, width: S - 5, height: S - 5, rx: 5, class: 't1-hcell' }, g);
          s('text', { x: B.cx(i) + S / 2, y: B.cy(i) + S / 2 + 0.5, class: 't1-fnum user', text: String(x) }, g);
        }));
      },
      flash(set) { B.flash(set.map((x) => x[0])); },
      evaluate
    });

    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); B.clearHint(); }
        return r;
      },
      hint: () => flow.hint(),
      solve() {
        B.clearHint();
        flow.clear();
        sel = [];
        const items = [];
        for (let i = 0; i < N; i++) if (!given[i] && vals[i] !== sol[i]) items.push(i);
        waveFill(B, items, (i) => B.rowOf(i) + B.colOf(i), (i) => { vals[i] = sol[i]; }, refresh, () => ctx.changed('solve'));
      },
      getState() { return { v: Array.from(vals).join('') }; },
      setState(o) {
        if (!o || typeof o.v !== 'string' || o.v.length !== N) return;
        for (let i = 0; i < N; i++) vals[i] = given[i] ? 0 : (+o.v[i] || 0);
        drag = null;
        B.clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { flow.reset(); sel = []; B.clearHint(); refresh(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        const m = /^(?:Digit|Numpad)([0-9])$/.exec(ev.code || '');
        const dg = m ? +m[1] : /^[0-9]$/.test(k) ? +k : -1;
        if (dg >= 0) { input(dg); return true; }
        if (k === 'Backspace' || k === 'Delete') { input(0); return true; }
        const dir = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
        if (dir) {
          if (!B.cur.on) { B.cur.on = true; B.drawCursor(); pick(B.cur.r * w + B.cur.c, false); return true; }
          B.moveCursor(dir[0], dir[1]);
          const i = B.cur.r * w + B.cur.c;
          if (ev.shiftKey) { if (!sel.includes(i)) sel.push(i); refresh(); } else pick(i, false);
          return true;
        }
        if (k === 'Escape' && sel.length) { sel = []; B.cur.on = false; B.drawCursor(); refresh(); return false; }
        return false;
      },
      destroy() { B.destroy(); wb.svg.removeEventListener('pointerleave', leave); }
    };
  };

  /* =====================================================================
   *  RECTANGLES (SHIKAKU)
   * ===================================================================== */

  MOUNT.shikaku = function (ctx, p) {
    const d = p.data, L = LG(), s = ctx.s, wb = ctx.wb;
    const w = d.w, h = d.h, N = w * h;
    const P = L.skPrep(w, h, d.clues);
    const B = makeBoard(ctx, 'shikaku', w, h);
    const key = (q) => q.r + ',' + q.c + ',' + q.rh + ',' + q.rw;
    const solRects = d.sol.map((q) => ({ r: q[0], c: q[1], rh: q[2], rw: q[3] }));
    const solKey = new Set(solRects.map(key));
    const solPick = solRects.map((q, k) => L.skFind(P, k, q.r, q.c, q.rh, q.rw));
    let rects = [];                     // the player's rectangles
    let drag = null, anchor = -1, won = false, hovK = -1;
    ctx.setGoal(p.goal || GOALS.shikaku);

    B.gridLines('t1-grid dotted');
    B.frame();
    const rectG = s('g', { class: 't1-rects' }, B.under);
    const numEls = d.clues.map(([r, c, n]) => s('text', { x: B.ox + c * S + S / 2, y: B.oy + r * S + S / 2 + 0.5, class: 't1-snum' + (n > 9 ? ' small' : ''), text: String(n) }, B.texts));
    const badge = s('g', { class: 't1-rbadge' }, B.top);
    const badgeBg = s('rect', { rx: 9, height: 24 }, badge);
    const badgeTx = s('text', { y: 12.5 }, badge);
    badge.style.display = 'none';

    const cellsOf = (q) => { const out = []; for (let r = q.r; r < q.r + q.rh; r++) for (let c = q.c; c < q.c + q.rw; c++) out.push(r * w + c); return out; };
    const cluesIn = (q) => d.clues.map((x, k) => k).filter((k) => { const [r, c] = d.clues[k]; return r >= q.r && r < q.r + q.rh && c >= q.c && c < q.c + q.rw; });
    const good = (q) => { const ks = cluesIn(q); return ks.length === 1 && d.clues[ks[0]][2] === q.rh * q.rw; };
    const overlap = (a, b) => a.r < b.r + b.rh && b.r < a.r + a.rh && a.c < b.c + b.rw && b.c < a.c + a.rw;
    const rectOf = (a, b) => { const r0 = Math.min(B.rowOf(a), B.rowOf(b)), c0 = Math.min(B.colOf(a), B.colOf(b)); return { r: r0, c: c0, rh: Math.abs(B.rowOf(a) - B.rowOf(b)) + 1, rw: Math.abs(B.colOf(a) - B.colOf(b)) + 1 }; };
    const hueOf = (q) => HUES[(q.r * 7 + q.c * 3 + q.rh * 5 + q.rw) % HUES.length];
    function owner() {
      const o = new Int32Array(N).fill(-1);
      rects.forEach((q, k) => cellsOf(q).forEach((i) => { o[i] = k; }));
      return o;
    }
    function add(q) { rects = rects.filter((x) => !overlap(x, q)); rects.push(q); }

    function evaluate() {
      const o = owner();
      let open = 0;
      for (let i = 0; i < N; i++) if (o[i] < 0) open++;
      const bad = rects.filter((q) => !good(q)).length;
      if (!open && !bad) return { solved: true, msg: SOLVED.shikaku[C.hash(p.id) % 3] };
      if (bad) return { solved: false, msg: C.plural(bad, 'rectangle does', 'rectangles do') + ' not fit ' + (bad === 1 ? 'its number' : 'their numbers') + '.' };
      return { solved: false, msg: C.plural(open, 'cell is', 'cells are') + ' not in a rectangle yet.' };
    }

    function refresh() {
      while (rectG.firstChild) rectG.removeChild(rectG.firstChild);
      const badClue = new Uint8Array(d.clues.length);
      let covered = 0;
      rects.forEach((q, k) => {
        const ok = good(q);
        if (!ok) cluesIn(q).forEach((j) => { badClue[j] = 1; });
        covered += q.rh * q.rw;
        const hue = hueOf(q);
        const el = s('rect', { x: B.ox + q.c * S + 2.5, y: B.oy + q.r * S + 2.5, width: q.rw * S - 5, height: q.rh * S - 5, rx: 7, class: 't1-rect' + (ok ? '' : ' bad') + (k === hovK ? ' hov' : '') }, rectG);
        if (ok) { el.style.fill = 'hsl(' + hue + ' 62% 58% / .3)'; el.style.stroke = 'hsl(' + hue + ' 55% 48%)'; }
        el.style.animationDelay = (0.035 * k) + 's';
      });
      numEls.forEach((el, j) => el.classList.toggle('bad', !!badClue[j]));
      ctx.stat('Covered', covered + ' of ' + N);
      B.prune((kk) => rects.some((q) => key(q) === kk));
      if (won && !evaluate().solved) setWon(false);
    }
    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      B.G.classList.toggle('won', on);
      B.G.classList.toggle('still', on && !animate);
    }

    /* drawing a rectangle */
    function preview(q, erase, pt) {
      while (B.live.firstChild) B.live.removeChild(B.live.firstChild);
      if (!q) { badge.style.display = 'none'; return; }
      const ks = cluesIn(q), area = q.rh * q.rw;
      const fits = ks.length === 1 && d.clues[ks[0]][2] === area;
      s('rect', { x: B.ox + q.c * S + 1.5, y: B.oy + q.r * S + 1.5, width: q.rw * S - 3, height: q.rh * S - 3, rx: 7, class: erase ? 't1-rerase' : 't1-rpreview' + (fits ? ' ok' : '') }, B.live);
      if (erase || !pt) { badge.style.display = 'none'; return; }
      const k = wb.px(1), label = q.rw + ' × ' + q.rh + ' = ' + area;
      const bw = 12 + label.length * 7.4;
      badge.style.display = '';
      badge.setAttribute('class', 't1-rbadge' + (fits ? ' ok' : ks.length > 1 ? ' bad' : ''));
      badge.setAttribute('transform', 'translate(' + (pt[0] + 16 * k) + ' ' + (pt[1] - 36 * k) + ') scale(' + k + ')');
      badgeBg.setAttribute('width', bw);
      badgeTx.setAttribute('x', bw / 2);
      badgeTx.textContent = label;
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = B.cellAt(pt);
        if (i < 0) return false;
        B.cur.on = false; B.drawCursor();
        anchor = -1;
        drag = { kind: ev.button === 2 ? 'erase' : 'draw', a: i, b: i, p0: pt, moved: false };
        preview(rectOf(i, i), drag.kind === 'erase', null);
        return true;
      },
      move(pt) {
        if (!drag) return;
        if (Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > S * 0.3) drag.moved = true;
        drag.b = B.clampCell(pt);
        preview(rectOf(drag.a, drag.b), drag.kind === 'erase', drag.moved ? pt : null);
      },
      up() {
        const g = drag;
        drag = null;
        preview(null);
        if (!g) return;
        const q = rectOf(g.a, g.b), o = owner();
        if (g.kind === 'erase') {
          const n0 = rects.length;
          if (!g.moved && g.a === g.b) { if (o[g.a] >= 0) rects.splice(o[g.a], 1); }
          else rects = rects.filter((x) => !overlap(x, q));
          if (rects.length !== n0) { ctx.sfx('tap'); refresh(); ctx.changed('erase'); }
          return;
        }
        if (!g.moved && g.a === g.b) {
          if (o[g.a] >= 0) { rects.splice(o[g.a], 1); ctx.sfx('tap'); refresh(); ctx.changed('erase'); return; }
          const k = P.clueAt[g.a];
          if (k >= 0 && P.num[k] === 1) { add(q); ctx.sfx('snap'); refresh(); ctx.changed('rect'); return; }
          ctx.toast('Drag from corner to corner to draw a rectangle.');
          return;
        }
        add(q);
        ctx.sfx('snap');
        refresh();
        ctx.changed('rect');
      },
      hover(pt) {
        const i = B.cellAt(pt), o = i >= 0 ? owner() : null;
        const k = o ? o[i] : -1;
        if (k !== hovK) { hovK = k; refresh(); }
      }
    };

    ctx.panel.appendChild(ctx.h('div.t1-panel',
      ctx.h('div.t1-tip', 'Drag from corner to corner to draw a rectangle; the badge turns green when it fits its number. Click a rectangle to rub it out; drag with the right button to rub out an area.')));

    /* hints */
    const placedNow = () => {
      const placed = new Array(P.K).fill(-1);
      rects.forEach((q) => {
        if (!solKey.has(key(q))) return;
        const ks = cluesIn(q);
        if (ks.length === 1) placed[ks[0]] = L.skFind(P, ks[0], q.r, q.c, q.rh, q.rw);
      });
      return placed;
    };
    const candRect = (k, j) => { const c = P.cands[k][j]; return { r: c.r, c: c.c, rh: c.rh, rw: c.rw }; };
    const flow = hintFlow(ctx, B, {
      markWord: (k) => (k === 1 ? 'rectangle' : 'rectangles'),
      wrong() { return rects.filter((q) => !solKey.has(key(q))); },
      rubOut(list) { rects = rects.filter((q) => !list.includes(q)); },
      showWrong(list) { list.forEach((q) => s('rect', { x: B.ox + q.c * S + 2, y: B.oy + q.r * S + 2, width: q.rw * S - 4, height: q.rh * S - 4, rx: 7, class: 't1-hwrong' }, B.hintG)); },
      redraw: refresh,
      step() {
        const r = L.skStep(P, placedNow(), 4, solPick);
        return r && { text: r.text, set: r.set.map(([k, j]) => candRect(k, j)), focus: r.focus || [] };
      },
      todo: (set) => set.filter((q) => !rects.some((x) => key(x) === key(q))),
      apply(set) { set.forEach(add); },
      describe(set) { return set.length === 1 ? 'a ' + set[0].rw + ' × ' + set[0].rh + ' rectangle' : cnt(set.length) + ' rectangles'; },
      showStep(stp) {
        B.zone(stp.focus);
        stp.set.forEach((q) => B.ghost(key(q), (g) => s('rect', { x: B.ox + q.c * S + 2.5, y: B.oy + q.r * S + 2.5, width: q.rw * S - 5, height: q.rh * S - 5, rx: 7, class: 't1-hrect' }, g)));
      },
      flash(set) { B.flash([].concat(...set.map(cellsOf))); },
      evaluate
    });

    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); B.clearHint(); }
        return r;
      },
      hint: () => flow.hint(),
      solve() {
        B.clearHint();
        flow.clear();
        rects = rects.filter((q) => solKey.has(key(q)));
        const items = solRects.filter((q) => !rects.some((x) => key(x) === key(q)));
        waveFill(B, items, (q) => q.r + q.c, (q) => { add(q); }, refresh, () => ctx.changed('solve'));
      },
      getState() { return { r: rects.map((q) => [q.r, q.c, q.rh, q.rw]) }; },
      setState(o) {
        if (!o || !Array.isArray(o.r)) return;
        rects = o.r.filter((q) => Array.isArray(q) && q.length === 4).map((q) => ({ r: q[0], c: q[1], rh: q[2], rw: q[3] }));
        drag = null;
        anchor = -1;
        preview(null);
        B.clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { flow.reset(); B.clearHint(); },
      key(ev) {
        const k = ev.key;
        if (ev.type !== 'keydown') return B.cur.on && k === ' ';
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        const at = () => B.cur.r * w + B.cur.c;
        if (dirs[k]) {
          B.moveCursor(dirs[k][0], dirs[k][1]);
          if (anchor >= 0) preview(rectOf(anchor, at()), false, [B.ox + B.cur.c * S + S, B.oy + B.cur.r * S]);
          return true;
        }
        if (!B.cur.on) return false;
        if (k === 'Enter' || k === ' ') {
          if (anchor < 0) { anchor = at(); preview(rectOf(anchor, anchor), false, null); return true; }
          add(rectOf(anchor, at()));
          anchor = -1;
          preview(null);
          ctx.sfx('snap');
          refresh();
          ctx.changed('rect');
          return true;
        }
        if (k === 'Backspace' || k === 'Delete') {
          const o = owner();
          if (o[at()] >= 0) { rects.splice(o[at()], 1); refresh(); ctx.changed('erase'); }
          return true;
        }
        if (k === 'Escape') { if (anchor >= 0) { anchor = -1; preview(null); return true; } B.cur.on = false; B.drawCursor(); }
        return false;
      },
      destroy() { B.destroy(); }
    };
  };

  /* =====================================================================
   *  THE LOOK
   * ===================================================================== */

  const fillHues = FILL_HUE.map((hue, d) => (d ? '.t1-ftint.h' + d + ' { fill: hsl(' + hue + ' 62% 56% / .3); }' : '')).join('\n');

  C.css('tatham1', `
    .t1-nohit, .t1-nohit * { pointer-events: none; }
    .t1-boardbg { fill: var(--board); stroke: var(--line); stroke-width: 1; }
    .t1-cell { fill: var(--cell); transition: fill .6s; }
    .t1-grid { fill: none; stroke: var(--grid-2); stroke-width: 1; }
    .t1-grid.faint { stroke: var(--grid); }
    .t1-grid.dotted { stroke-dasharray: 2 4; stroke-linecap: round; stroke-width: 1.3; }
    .t1-frame { fill: none; stroke: var(--ink-2); stroke-width: 2.6; }
    .t1-cursor { fill: none; stroke: var(--accent); stroke-width: 3.2; }
    .t1-cursor.armed { stroke: var(--gold); stroke-dasharray: 6 4; }
    .t1-hovband { fill: var(--accent); opacity: .07; }
    .t1-hzone { fill: var(--gold); opacity: .17; }
    .t1-hline { fill: none; stroke: var(--gold); stroke-width: 3; stroke-dasharray: 8 5; }
    .t1-hwrong { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .t1-hwrongline { stroke: var(--red); stroke-width: 6; stroke-linecap: round; opacity: .8; }
    .t1-hcell { fill: none; stroke: var(--gold); stroke-width: 2.5; }
    .t1-ghost { opacity: .6; animation: t1pulse 1.3s ease-in-out infinite; }
    .t1-flash { fill: var(--gold); opacity: 0; animation: t1flash 1.3s ease-out; }
    @keyframes t1pulse { 50% { opacity: .25; } }
    @keyframes t1flash { 15% { opacity: .45; } 100% { opacity: 0; } }
    .t1-badge rect, .t1-rbadge rect { fill: var(--accent); }
    .t1-badge text, .t1-rbadge text { font: 700 14px "Segoe UI", system-ui, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; }
    .t1-rbadge.ok rect { fill: var(--green); }
    .t1-rbadge.bad rect { fill: var(--red); }

    /* tents */
    .t1-tents.imp .t1-meadow { fill: color-mix(in srgb, var(--cell) 84%, #5bb86a); }
    .t1-tents.won .t1-cell:not(.t1-treecell) { fill: hsl(110 40% 50% / .22); }
    .t1-shadow { fill: #000; opacity: .16; }
    .t1-trunk { fill: #8a5a36; }
    .t1-canopy { fill: #3f9a4f; stroke: #2a6e37; stroke-width: 1.5; }
    .t1-canopy-hi { fill: #7cc97f; opacity: .55; }
    .t1-treeg.err .t1-canopy { fill: var(--red); stroke: #8e1f1f; }
    .t1-tent { fill: #e8913a; stroke: #9c5a1c; stroke-width: 1.6; stroke-linejoin: round; }
    .t1-tent.err { fill: var(--red); stroke: #8e1f1f; }
    .t1-door { fill: #6b3c12; }
    .t1-pole { stroke: #6b3c12; stroke-width: 1.8; stroke-linecap: round; }
    .t1-grass { fill: #5bb86a; opacity: .26; }
    .t1-tuft { fill: none; stroke: #3f9a4f; stroke-width: 2; stroke-linecap: round; }
    .t1-grassdot { fill: #5bb86a; opacity: .55; }
    .t1-count { font: 700 18px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; dominant-baseline: central; transition: fill .2s, opacity .2s; }
    .t1-count.done { fill: var(--faint); opacity: .8; }
    .t1-count.bad { fill: var(--red); opacity: 1; }
    .t1-rope { stroke: #c9a46a; stroke-width: 2; stroke-dasharray: 3 3; stroke-linecap: round; animation: t1fade .8s ease-out both; }
    .t1-tents.still .t1-rope { animation: none; }
    .t1-tents.won:not(.still) .t1-tent { transform-box: fill-box; transform-origin: 50% 100%; animation: t1bounce .7s ease-out 2; }
    @keyframes t1bounce { 40% { transform: scaleY(1.12); } }
    @keyframes t1fade { from { opacity: 0; } }

    /* singles */
    .t1-hnum { font: 600 20px "Segoe UI", system-ui, sans-serif; fill: var(--ink); text-anchor: middle; dominant-baseline: central; transition: fill .15s; }
    .t1-hnum.small { font-size: 16px; }
    .t1-hnum.onblack { fill: #6b7094; font-weight: 500; }
    .t1-hnum.bad { fill: var(--red); }
    .t1-black { fill: #10121f; }
    [data-theme="light"] .t1-black { fill: #262a3f; }
    .t1-black.err { fill: #7a1f25; stroke: var(--red); stroke-width: 2; }
    .t1-ring { fill: none; stroke: var(--teal); stroke-width: 2.6; }
    .t1-ring.implied { stroke: var(--faint); stroke-width: 1.4; stroke-dasharray: 3 3; }
    .t1-ring.err { stroke: var(--red); }
    .t1-cut { fill: var(--red); opacity: .16; }
    .t1-bar { fill: var(--faint); opacity: .35; transition: fill .2s, opacity .2s; }
    .t1-bar.ok { fill: var(--green); opacity: .9; }
    .t1-hitori.won:not(.still) .t1-hnum:not(.onblack) { transform-box: fill-box; transform-origin: center; animation: t1pop .6s ease-out; }
    @keyframes t1pop { 40% { transform: scale(1.25); } }

    /* dominosa */
    .t1-dnum { font: 600 20px "Segoe UI", system-ui, sans-serif; fill: var(--ink); text-anchor: middle; dominant-baseline: central; }
    .t1-dnum.on { fill: #23263a; font-weight: 700; }
    .t1-dnum.bad { fill: var(--red); }
    .t1-dombody { fill: #f4efe1; stroke: #8d8570; stroke-width: 1.6; }
    .t1-domline { stroke: #b9b09a; stroke-width: 1.6; stroke-linecap: round; }
    .t1-dom.dup .t1-dombody { fill: #f6c8c8; stroke: var(--red); stroke-width: 2.4; }
    .t1-wall { fill: none; stroke: var(--ink-2); stroke-width: 4; stroke-linecap: round; }
    .t1-cand { fill: none; stroke: var(--gold); stroke-width: 2.4; stroke-dasharray: 6 4; }
    .t1-cand.here { stroke-dasharray: none; stroke-width: 3; }
    .t1-preview { fill: var(--accent); fill-opacity: .15; stroke: var(--accent); stroke-width: 2.5; }
    .t1-preview.off { fill: var(--red); fill-opacity: .12; stroke: var(--red); stroke-dasharray: 5 4; }
    .t1-hdom { fill: none; stroke: var(--gold); stroke-width: 3; }
    .t1-hwall { stroke: var(--gold); stroke-width: 5; stroke-linecap: round; }
    .t1-dominosa.won:not(.still) .t1-dom { transform-box: fill-box; transform-origin: center; animation: t1pop .5s ease-out both; }
    .t1-set { display: grid; gap: 3px; }
    .t1-setgap { display: block; }
    .t1-setb { display: flex; flex-direction: row; align-items: stretch; padding: 0; border: 1px solid var(--line); border-radius: 6px; background: var(--panel-2); color: var(--text); cursor: pointer; font: 700 .72rem "Segoe UI", system-ui, sans-serif; line-height: 1.25; min-width: 0; }
    .t1-setb span { display: block; flex: 1; text-align: center; padding: 3px 0; }
    .t1-setb span + span { border-left: 1px solid var(--line); }
    .t1-setb:hover { border-color: var(--gold); }
    .t1-setb.pin { border-color: var(--gold); box-shadow: 0 0 0 1.5px var(--gold) inset; }
    .t1-setb.found { background: var(--green); border-color: var(--green); color: #0b1a12; opacity: .55; }
    .t1-setb.dup { background: var(--red); border-color: var(--red); color: #fff; }
    .t1-setl { color: var(--muted); font-size: 12.5px; }

    /* filling */
    .t1-ftint { fill: transparent; transition: fill .25s; }
    ${fillHues}
    .t1-ftint.bad { fill: var(--red); fill-opacity: .16; }
    .t1-fsel { fill: var(--accent); fill-opacity: .25; }
    .t1-fedge { fill: none; stroke: var(--ink-2); stroke-width: 1.4; opacity: .35; }
    .t1-border { fill: none; stroke: var(--ink); stroke-width: 3.2; stroke-linecap: square; }
    .t1-fnum { font: 600 21px "Segoe UI", system-ui, sans-serif; text-anchor: middle; dominant-baseline: central; fill: #7f8cff; }
    [data-theme="light"] .t1-fnum { fill: #3a4bd8; }
    .t1-fnum.given { fill: var(--ink); font-weight: 800; }
    .t1-fnum.bad { fill: var(--red); }
    .t1-fcount { font: 700 9.5px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .t1-fillomino.won:not(.still) .t1-ftint { animation: t1glow 1.2s ease-in-out 2; }
    @keyframes t1glow { 50% { fill-opacity: .6; } }

    /* rectangles */
    .t1-rect { fill: var(--accent); fill-opacity: .12; stroke: var(--accent); stroke-width: 2.2; transition: fill .2s; }
    .t1-rect.bad { fill: var(--red); fill-opacity: .12; stroke: var(--red); stroke-dasharray: 6 4; }
    .t1-rect.hov { stroke-width: 3.4; }
    .t1-snum { font: 700 20px "Segoe UI", system-ui, sans-serif; fill: var(--ink); text-anchor: middle; dominant-baseline: central; }
    .t1-snum.small { font-size: 17px; }
    .t1-snum.bad { fill: var(--red); }
    .t1-rpreview { fill: var(--accent); fill-opacity: .12; stroke: var(--accent); stroke-width: 2.5; stroke-dasharray: 7 4; }
    .t1-rpreview.ok { fill: var(--green); stroke: var(--green); stroke-dasharray: none; }
    .t1-rerase { fill: var(--red); fill-opacity: .1; stroke: var(--red); stroke-width: 2; stroke-dasharray: 5 4; }
    .t1-hrect { fill: var(--gold); fill-opacity: .12; stroke: var(--gold); stroke-width: 3; stroke-dasharray: 7 4; }
    .t1-shikaku.won:not(.still) .t1-rect { transform-box: fill-box; transform-origin: center; animation: t1pop .5s ease-out both; }

    /* the side panel */
    .t1-panel { display: grid; gap: 8px; margin: 10px 0; }
    .t1-seg { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .t1-segl { color: var(--muted); font-size: 13px; margin-right: 2px; }
    .t1-segb { border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: 8px; padding: 5px 12px; font: 600 13px "Segoe UI", system-ui, sans-serif; cursor: pointer; }
    .t1-segb.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .t1-tip { color: var(--muted); font-size: 12.5px; }
    .t1-opt { color: var(--text); font-size: 13px; display: flex; align-items: center; gap: 6px; cursor: pointer; }
    @media (prefers-reduced-motion: reduce) { .t1-ghost, .t1 * { animation: none !important; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);

