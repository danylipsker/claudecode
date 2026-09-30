/* The Puzzle Cabinet · engines/pencil3.js
 *
 * Pencil Puzzles III — five grid puzzles:
 *
 *   numpath   Number path: write 1 … n so that each number touches the next
 *             (king-wise, or side by side); drag a chain through the cells
 *             or type the numbers
 *   norinori  two shaded cells in every region, all of them in dominoes
 *   lits      a tetromino (L, I, T or S) in every region, all connected, no
 *             2×2, no two identical tetrominoes touching
 *   heyawake  room counts, shaded cells apart, white cells connected, no
 *             white line through three rooms
 *   yajilin   arrow counts, shaded cells apart, one loop through the rest
 *
 * The reasoning (solvers, graded steps, the hints' words, the makers) lives
 * in js/lib/pencil3-logic.js (Cabinet.pencil3Logic).
 *
 * data (see tools/gen/pencil3.js):
 *   { kind: 'numpath', w, h, adj: 8 | 4, given: [..], sol: [..] }      flat arrays; sol 0 = no cell (a hole)
 *   { kind: 'norinori', regions: ['aab…', …], sol: ['#..#', …] }
 *   { kind: 'lits', regions: [...], sol: [...] }
 *   { kind: 'heyawake', w, h, rooms: [[r, c, rows, cols, n], …], sol: [...] }   n -1 = no number
 *   { kind: 'yajilin', w, h, clues: [[cell, 'u'|'r'|'d'|'l', n], …], sol: [...] }  sol: '#' shaded, '*' clue, hex loop exits
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const LG = () => C.pencil3Logic;
  const S = 40;                        // world units per cell

  const KINDS = { numpath: 'Number path', norinori: 'Norinori', lits: 'LITS', heyawake: 'Heyawake', yajilin: 'Yajilin' };
  const FAMILY_KIND = { 'number-path': 'numpath', norinori: 'norinori', lits: 'lits', heyawake: 'heyawake', yajilin: 'yajilin' };
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

  const ABOUT = {
    numpath: 'Write the numbers **1 to n** in the cells, one in each, so that every number **touches the next one** — in the king-wise puzzles side by side *or* corner to corner, in the side-by-side puzzles only along a side. The printed numbers stay put.\n\n' +
      '**Drag** from a number to the cells next to it and the chain writes itself: 7, 8, 9 … (if the next number is already on the board, the drag counts down instead). Drag back to take numbers off again. **Click** a cell and **type** a number (two digits quickly for 12), or use the pad in the panel; **Backspace**, **right-click** or a **long press** rubs a number out. **Arrow keys** move the cursor.\n\n' +
      'The chain draws itself between neighbours; numbers that should touch but do not, and numbers written twice, turn red. The panel lists the numbers still missing.',
    norinori: '**Shade** exactly **two cells in every outlined region**. Every shaded cell touches **exactly one** other shaded cell along a side — the shading comes in dominoes, and a domino may cross a region border.\n\n' +
      '**Click** a cell to shade it, **right-click** to put a dot (a cell you know stays white); do it again to clear. **Drag** to shade or dot several cells in one stroke. On a touch screen switch the tap between *Shade* and *Dot* in the panel, or long-press for a dot. Lines of three, lonely shaded cells with no room for a partner and crowded regions turn red; finished regions fade. **Keys:** arrows, **Enter** = shade, **Space** = dot, **Backspace** clears.',
    lits: '**Shade** a **tetromino** — four cells joined along their sides — in **every outlined region**. Only the shapes **L, I, T and S** occur (a square of four would be a 2×2 block). All shaded cells form **one connected group**, **no 2×2 block** is ever shaded, and **two identical tetrominoes never touch** along a side (a turned or mirrored copy counts as identical).\n\n' +
      '**Click** a cell to shade it, **right-click** for a dot; **drag** for several. On a touch screen switch the tap between *Shade* and *Dot*, or long-press for a dot. A finished tetromino takes the colour of its letter, so twins stand out; 2×2 blocks, twins that touch and overfull regions turn red. **Keys:** arrows, **Enter**, **Space**, **Backspace**.',
    heyawake: '**Shade** some cells. A **number** in a room is how many of its cells are shaded (rooms without a number may have any). **Shaded cells never touch** side by side, **all white cells connect** into one area, and **no straight line of white cells crosses two room borders** — a white run may pass through two rooms, never three.\n\n' +
      '**Click** a cell to shade it, **right-click** for a dot (white for sure); **drag** for several. On a touch screen switch the tap between *Shade* and *Dot*, or long-press for a dot. Touching shaded cells, crowded rooms, white lines through three rooms (once they are dotted) and cut-off white cells turn red; satisfied numbers fade. **Keys:** arrows, **Enter**, **Space**, **Backspace**.',
    yajilin: '**Shade** some cells and draw **one loop** through **all the other cells** (not the grey clue cells). The loop runs through cell centres, up, down, left and right, never branching or crossing itself. **Shaded cells never touch** side by side. A **clue** such as 2→ says how many shaded cells lie in that direction, all the way to the edge.\n\n' +
      '**Drag** from cell to cell to draw the loop (drag back to take it up; drag along a line to rub it out). **Click** a cell to shade it, **right-click** to dot it (on the loop for sure); **right-click** between two cells to cross that step out. On a touch screen switch the tap between *Shade* and *Dot*, or long-press. Touching shaded cells, wrong counts, branches and stray small loops turn red. **Keys:** arrows move, **Shift+arrow** draws that way, **Enter** shades, **Space** dots.'
  };
  const ABOUT_ALL = 'Five pencil puzzles share this drawer: a chain of numbers (Number path), dominoes (Norinori), tetrominoes (LITS), rooms (Heyawake) and a loop with arrows (Yajilin). The *How to* tab of each puzzle tells its rules and gestures.';

  const GOALS = {
    numpath8: 'Every number from 1 to n, each touching the next — side by side or corner to corner.',
    numpath4: 'Every number from 1 to n, each side by side with the next (no diagonal steps).',
    norinori: 'Two shaded cells in every region; every shaded cell in a domino with exactly one other.',
    lits: 'One L, I, T or S in every region; all shaded cells connected; no 2×2; no twins touching.',
    heyawake: 'Room numbers right, shaded cells apart, white cells connected, no white line through three rooms.',
    yajilin: 'Arrow counts right, shaded cells apart, and one loop through every other cell.'
  };

  function textFor(d) {
    if (d.kind === 'numpath') {
      const n = d.sol.filter((x) => x > 0).length;
      return 'Write the numbers 1 to ' + n + ' in the cells so that each number touches the next one ' + (d.adj === 4 ? 'along a side (never only at a corner)' : 'along a side or at a corner, like a chess king stepping') + '. The printed numbers are fixed.';
    }
    if (d.kind === 'norinori') return 'Shade exactly two cells in every outlined region. Each shaded cell must touch exactly one other shaded cell along a side, so the shading comes in dominoes — and a domino may straddle two regions.';
    if (d.kind === 'lits') return 'Shade four connected cells — an L, I, T or S tetromino — in every outlined region. All the shaded cells must form one group, no 2×2 block may be shaded, and two identical tetrominoes (turned or mirrored counts as identical) may not touch along a side.';
    if (d.kind === 'heyawake') return 'Shade some cells. A number gives the count of shaded cells in its room. Shaded cells may not touch side by side, the white cells must all connect, and no straight line of white cells may run through more than two rooms.';
    return 'Shade some cells and draw one loop through all the others (except the grey clue cells). An arrow clue counts the shaded cells in its direction. Shaded cells never touch side by side, and the loop never branches or crosses itself.';
  }
  const goalFor = (d) => (d.kind === 'numpath' ? GOALS['numpath' + (d.adj === 4 ? 4 : 8)] : GOALS[d.kind]);

  /* ---------- verify (node) ---------- */

  const rowsToArr = (rows) => Int8Array.from([].concat(...rows.map((r) => r.split('').map((ch) => (ch === '#' ? 1 : 0)))));
  const sameArr = (a, b) => { for (let i = 0; i < a.length; i++) if ((a[i] === 1) !== (b[i] === 1)) return false; return true; };

  function regionsOk(regions) {
    const L = LG(), h = regions.length, w = regions[0] && regions[0].length;
    if (!h || !w || regions.some((r) => r.length !== w)) return 'regions must be ' + h + ' rows of the same length';
    const reg = L.regionsOf(regions);
    if (reg.some((k) => k < 0)) return 'a region letter is not a-z or A-Z';
    let R = 0;
    for (const k of reg) R = Math.max(R, k + 1);
    for (let k = 0; k < R; k++) {
      const cells = [];
      reg.forEach((x, i) => { if (x === k) cells.push(i); });
      if (!cells.length) return 'region ' + L.regLetter(k) + ' is missing';
      if (!L.connectedSet(cells, w)) return 'region ' + L.regLetter(k) + ' is in pieces';
    }
    return null;
  }

  function verify(p) {
    const d = p.data, L = LG();
    if (!L) return { ok: false, err: 'js/lib/pencil3-logic.js is not loaded' };
    if (!d || !KINDS[d.kind]) return { ok: false, err: 'unknown kind ' + (d && d.kind) };
    if (d.kind === 'numpath') {
      const N = d.w * d.h;
      if (!(d.w >= 3 && d.h >= 3) || !Array.isArray(d.sol) || d.sol.length !== N || !Array.isArray(d.given) || d.given.length !== N) return { ok: false, err: 'w, h, given and sol (w×h numbers) needed' };
      if (d.adj !== 4 && d.adj !== 8) return { ok: false, err: 'adj must be 4 or 8' };
      const P = L.npPrep(d);
      const seen = new Uint8Array(P.n + 1);
      for (const i of P.cells) { const k = d.sol[i]; if (!(k >= 1 && k <= P.n) || seen[k]) return { ok: false, err: 'sol must hold 1…' + P.n + ' once each' }; seen[k] = 1; }
      for (let i = 0; i < N; i++) if (d.given[i] && d.given[i] !== d.sol[i]) return { ok: false, err: 'a given number disagrees with the solution at cell ' + i };
      if (!L.npValid(P, P.sol)) return { ok: false, err: 'the stored chain has a break' };
      const c = L.npCount(P, P.given, 2, 200000);
      if (c.aborted) return { ok: false, err: 'the solution count gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      for (const i of P.cells) if (c.sol[i] !== P.sol[i]) return { ok: false, err: 'the solver found another chain' };
      return { ok: true };
    }
    if (d.kind === 'norinori' || d.kind === 'lits') {
      if (!Array.isArray(d.regions)) return { ok: false, err: 'regions needed' };
      const e = regionsOk(d.regions);
      if (e) return { ok: false, err: e };
      if (!Array.isArray(d.sol) || d.sol.length !== d.regions.length || d.sol.some((r) => r.length !== d.regions[0].length)) return { ok: false, err: 'sol must match the regions' };
      const sol = rowsToArr(d.sol);
      const NR = d.kind === 'norinori';
      const P = NR ? L.nrPrep(d.regions) : L.ltPrep(d.regions);
      if (!(NR ? L.nrValid(P, sol) : L.ltValid(P, sol))) return { ok: false, err: 'the stored solution breaks the rules' };
      const c = NR ? L.nrCount(P, null, 2) : L.ltCount(P, null, 2, 300000);
      if (c.aborted) return { ok: false, err: 'the solution count gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      if (!sameArr(c.sol, sol)) return { ok: false, err: 'the solver found another answer' };
      return { ok: true };
    }
    if (d.kind === 'heyawake') {
      const N = d.w * d.h;
      if (!(d.w >= 2 && d.h >= 2) || !Array.isArray(d.rooms) || !d.rooms.length) return { ok: false, err: 'w, h and rooms needed' };
      const cover = new Uint8Array(N);
      for (const rm of d.rooms) {
        if (rm.length !== 5 || rm[2] < 1 || rm[3] < 1 || rm[0] < 0 || rm[1] < 0 || rm[0] + rm[2] > d.h || rm[1] + rm[3] > d.w) return { ok: false, err: 'bad room ' + JSON.stringify(rm) };
        if (rm[4] > rm[2] * rm[3]) return { ok: false, err: 'room number too big ' + JSON.stringify(rm) };
        for (let r = rm[0]; r < rm[0] + rm[2]; r++) for (let c = rm[1]; c < rm[1] + rm[3]; c++) cover[r * d.w + c]++;
      }
      if (cover.some((x) => x !== 1)) return { ok: false, err: 'the rooms must cover the grid once' };
      if (!Array.isArray(d.sol) || d.sol.length !== d.h || d.sol.some((r) => r.length !== d.w)) return { ok: false, err: 'sol must be h rows of w' };
      const sol = rowsToArr(d.sol);
      const P = L.hyPrep(d);
      if (!L.hyValid(P, sol)) return { ok: false, err: 'the stored solution breaks the rules' };
      const c = L.hyCount(P, null, 2, 400000);
      if (c.aborted) return { ok: false, err: 'the solution count gave up' };
      if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
      if (!sameArr(c.sol, sol)) return { ok: false, err: 'the solver found another answer' };
      return { ok: true };
    }
    // yajilin
    const N = d.w * d.h;
    if (!(d.w >= 3 && d.h >= 3) || !Array.isArray(d.clues) || !Array.isArray(d.sol) || d.sol.length !== d.h || d.sol.some((r) => r.length !== d.w)) return { ok: false, err: 'w, h, clues and sol (h rows of w) needed' };
    for (const cl of d.clues) if (!(cl[0] >= 0 && cl[0] < N) || !('urdl'.includes(cl[1])) || !(cl[2] >= 0)) return { ok: false, err: 'bad clue ' + JSON.stringify(cl) };
    const P = L.yjPrep(d);
    for (let i = 0; i < N; i++) if ((d.sol[Math.floor(i / d.w)][i % d.w] === '*') !== !!P.isClue[i]) return { ok: false, err: 'the clue cells and the solution disagree at cell ' + i };
    const sol = L.yjSolParse(P, d.sol);
    if (!L.yjValid(P, sol.v, sol.e)) return { ok: false, err: 'the stored solution breaks the rules' };
    const c = L.yjCount(P, null, 2, 300000);
    if (c.aborted) return { ok: false, err: 'the solution count gave up' };
    if (c.count !== 1) return { ok: false, err: c.count ? 'more than one solution' : 'no solution' };
    for (const i of P.cells) if (c.sol.v[i] !== sol.v[i]) return { ok: false, err: 'the solver found another answer' };
    for (let x = 0; x < P.E; x++) if (c.sol.e[x] !== sol.e[x]) return { ok: false, err: 'the solver found another loop' };
    return { ok: true };
  }

  /* ---------- colours ---------- */

  // soft tints for regions, so that neighbours differ (greedy over the region graph)
  const REGION_HUES = [8, 200, 130, 45, 280, 170, 330, 95, 235, 20, 300, 60];
  function regionColours(reg, w, h, R) {
    const adj = Array.from({ length: R }, () => new Set());
    for (let i = 0; i < w * h; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (c + 1 < w && reg[i] !== reg[i + 1]) { adj[reg[i]].add(reg[i + 1]); adj[reg[i + 1]].add(reg[i]); }
      if (r + 1 < h && reg[i] !== reg[i + w]) { adj[reg[i]].add(reg[i + w]); adj[reg[i + w]].add(reg[i]); }
    }
    const col = new Array(R).fill(-1);
    for (let k = 0; k < R; k++) {
      const used = new Set(Array.from(adj[k]).map((j) => col[j]));
      let c = (k * 5) % 12;
      for (let t = 0; t < 12 && used.has(c); t++) c = (c + 1) % 12;
      col[k] = c;
    }
    return col;
  }
  // the colours of the four LITS letters
  const SHAPE_COL = { L: '#e58a2e', I: '#2aa7b8', T: '#9a62d8', S: '#e0508a' };

  /* ---------- family pictures ---------- */

  function thumb(p) {
    const d = p.data, L = LG();
    const w = d.w || (d.regions && d.regions[0].length), h = d.h || (d.regions && d.regions.length);
    const cs = Math.min(148 / w, 110 / h);
    const gx = (160 - w * cs) / 2, gy = (120 - h * cs) / 2;
    const f = (x) => C.fmtNum(x);
    const X = (c) => f(gx + c * cs), Y = (r) => f(gy + r * cs);
    let out = '<svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid meet">';
    const rect = (r, c, fill, extra) => '<rect x="' + X(c) + '" y="' + Y(r) + '" width="' + f(cs + 0.3) + '" height="' + f(cs + 0.3) + '" fill="' + fill + '"' + (extra || '') + '/>';
    const text = (r, c, t, size, fill, weight) => '<text x="' + f(gx + (c + 0.5) * cs) + '" y="' + f(gy + (r + 0.5) * cs) + '" text-anchor="middle" dominant-baseline="central" font-size="' + f(size) + '" font-weight="' + (weight || 700) + '" fill="' + fill + '" font-family="Segoe UI, system-ui, sans-serif">' + t + '</text>';
    const grid = (sw) => {
      let dd = '';
      for (let c = 1; c < w; c++) dd += 'M' + X(c) + ' ' + Y(0) + 'V' + Y(h);
      for (let r = 1; r < h; r++) dd += 'M' + X(0) + ' ' + Y(r) + 'H' + X(w);
      return '<path d="' + dd + '" stroke="var(--grid-2)" stroke-width="' + (sw || 0.6) + '" fill="none"/>';
    };
    const borders = (reg) => {
      let rb = '';
      for (let i = 0; i < w * h; i++) {
        const r = Math.floor(i / w), c = i % w;
        if (c + 1 < w && reg[i] !== reg[i + 1]) rb += 'M' + X(c + 1) + ' ' + Y(r) + 'V' + Y(r + 1);
        if (r + 1 < h && reg[i] !== reg[i + w]) rb += 'M' + X(c) + ' ' + Y(r + 1) + 'H' + X(c + 1);
      }
      return '<path d="' + rb + '" stroke="var(--ink)" stroke-width="' + f(Math.max(1.6, cs * 0.12)) + '" stroke-linecap="square" fill="none"/>';
    };
    const frame = '<rect x="' + X(0) + '" y="' + Y(0) + '" width="' + f(w * cs) + '" height="' + f(h * cs) + '" fill="none" stroke="var(--ink-2)" stroke-width="1.6"/>';
    if (d.kind === 'numpath') {
      // the cells and the printed numbers (links only between printed neighbours: no spoilers)
      for (let i = 0; i < w * h; i++) if (d.sol[i] > 0) out += rect(Math.floor(i / w), i % w, 'var(--cell)', ' stroke="var(--grid-2)" stroke-width="0.6"');
      const pos = {};
      d.given.forEach((k, i) => { if (k > 0) pos[k] = i; });
      let pts = '';
      for (const k in pos) {
        const a = pos[k], b = pos[+k + 1];
        if (b == null || Math.abs(Math.floor(a / w) - Math.floor(b / w)) > 1 || Math.abs(a % w - b % w) > 1) continue;
        pts += 'M' + f(gx + (a % w + 0.5) * cs) + ' ' + f(gy + (Math.floor(a / w) + 0.5) * cs) + 'L' + f(gx + (b % w + 0.5) * cs) + ' ' + f(gy + (Math.floor(b / w) + 0.5) * cs);
      }
      if (pts) out += '<path d="' + pts + '" stroke="var(--accent)" stroke-opacity=".3" stroke-width="' + f(cs * 0.3) + '" stroke-linecap="round" fill="none"/>';
      d.given.forEach((k, i) => { if (k > 0) out += text(Math.floor(i / w), i % w, String(k), cs * (k > 99 ? 0.42 : k > 9 ? 0.5 : 0.62), 'var(--ink)'); });
      return out + '</svg>';
    }
    if (d.kind === 'norinori' || d.kind === 'lits') {
      const reg = L.regionsOf(d.regions);
      let R = 0;
      for (const k of reg) R = Math.max(R, k + 1);
      const col = regionColours(reg, w, h, R);
      for (let i = 0; i < w * h; i++) out += rect(Math.floor(i / w), i % w, 'hsl(' + REGION_HUES[col[reg[i]]] + ' 55% 55% / .28)');
      return out + grid(0.5) + borders(reg) + frame + '</svg>';
    }
    if (d.kind === 'heyawake') {
      const reg = new Int32Array(w * h);
      d.rooms.forEach((rm, k) => { for (let r = rm[0]; r < rm[0] + rm[2]; r++) for (let c = rm[1]; c < rm[1] + rm[3]; c++) reg[r * w + c] = k; });
      for (let i = 0; i < w * h; i++) out += rect(Math.floor(i / w), i % w, 'var(--cell)');
      out += grid(0.5) + borders(reg) + frame;
      d.rooms.forEach((rm) => { if (rm[4] >= 0) out += '<text x="' + f(gx + rm[1] * cs + cs * 0.12) + '" y="' + f(gy + rm[0] * cs + cs * 0.4) + '" font-size="' + f(cs * 0.48) + '" font-weight="700" fill="var(--ink)" font-family="Segoe UI, system-ui, sans-serif">' + rm[4] + '</text>'; });
      return out + '</svg>';
    }
    // yajilin
    const clue = {};
    d.clues.forEach(([i, q, n]) => { clue[i] = [q, n]; });
    for (let i = 0; i < w * h; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (clue[i]) { out += rect(r, c, '#3a3f58'); out += text(r, c, clue[i][1] + L.yjArrow[L.YDIR[clue[i][0]]], cs * 0.42, '#fff'); }
      else out += rect(r, c, 'var(--cell)');
    }
    return out + grid(0.5) + frame + '</svg>';
  }

  /* ---------- Endless drawers ---------- */

  const now = () => (root.performance && root.performance.now ? root.performance.now() : Date.now());
  const ENDLESS_TITLE = { numpath: 'Chain', norinori: 'Dominoes', lits: 'Tetrominoes', heyawake: 'Rooms', yajilin: 'Arrows and a Loop' };
  // [w, h, logic level, extra option] per level 1..5
  const PLAN = {
    numpath: [null, [[5, 5, 8, 1], [6, 6, 4, 1]], [[6, 6, 8, 2], [7, 7, 4, 2]], [[7, 7, 8, 3], [8, 8, 4, 3]], [[8, 8, 8, 3], [9, 9, 4, 3]], [[9, 9, 8, 4], [10, 10, 4, 4]]],
    norinori: [null, [[6, 6, 2]], [[7, 7, 2], [8, 8, 2]], [[8, 8, 3]], [[9, 9, 3]], [[10, 10, 3]]],
    lits: [null, [[6, 6, 3]], [[7, 7, 3], [6, 6, 3]], [[8, 8, 3]], [[9, 9, 3]], [[10, 10, 3]]],
    heyawake: [null, [[6, 6, 2], [5, 5, 3]], [[6, 6, 3], [7, 7, 3]], [[8, 8, 3]], [[8, 8, 4], [9, 9, 3]], [[10, 10, 4]]],
    yajilin: [null, [[6, 6, 2]], [[7, 7, 2], [8, 8, 2]], [[10, 10, 2], [9, 9, 3]], [[10, 10, 3], [8, 8, 4]], [[10, 10, 4]]]
  };

  function makeOne(kind, rng, row, budget) {
    const L = LG(), [w, h, lv, extra] = row;
    if (kind === 'numpath') {
      const on = new Uint8Array(w * h).fill(1);
      const P = L.npBase(w, h, on, lv);
      const m = L.npMake(P, rng, extra, { ends: lv === 8, budget });
      return m && { diff: m.diff, data: { kind, w, h, adj: lv, given: m.given, sol: m.sol } };
    }
    if (kind === 'norinori') { const m = L.nrMake(w, h, rng, { level: lv, budget }); return m && { diff: m.diff, data: { kind, regions: m.regions, sol: m.sol } }; }
    if (kind === 'lits') { const m = L.ltMake(w, h, rng, { budget, harden: extra === 'hard' ? 150 : 0 }); return m && { diff: m.diff, data: { kind, regions: m.regions, sol: m.sol } }; }
    if (kind === 'heyawake') { const m = L.hyMake(w, h, rng, { level: lv, budget }); return m && { diff: m.diff, data: { kind, w, h, rooms: m.rooms, sol: m.sol } }; }
    const m = L.yjMake(w, h, rng, { level: lv, budget, cover: 0.85 });
    return m && { diff: m.diff, data: { kind, w, h, clues: m.clues, sol: m.sol } };
  }

  function generate(rng, level, fam) {
    const kind = FAMILY_KIND[fam && fam.id];
    if (!kind || !LG()) return null;
    const opts = PLAN[kind][level];
    const t0 = now(), budget = 950;
    let best = null;
    while (now() - t0 < budget) {
      const row = opts[rng.int(opts.length)];
      const r = makeOne(kind, rng, row, Math.max(50, budget - (now() - t0)));
      if (!r) continue;
      const dd = Math.abs(r.diff - level);
      if (!best || dd < best.dd) best = { r, row, dd };
      if (dd === 0) break;
    }
    if (!best || best.dd > 1) return null;
    const d = best.r.data, [w, h] = best.row;
    const sub = kind === 'numpath' ? (d.adj === 8 ? ' (king steps)' : ' (side steps)') : '';
    return { title: ENDLESS_TITLE[kind] + ' ' + w + '×' + h + sub, text: textFor(d), goal: goalFor(d), diff: best.r.diff, data: d };
  }

  /* ---------- the way through: the hints' steps from the start, counted ---------- */

  const TECH = {
    numpath: ['', 'next-door steps (a number with only one free neighbour, or one cell touching both its neighbours)', 'counting steps (how far a number can be from the printed ones)', 'room checks (a number needs free neighbours for the numbers either side)', '"suppose…" trials'],
    norinori: ['', 'plain-rule steps (finished dominoes, full regions, lonely shaded cells)', 'region cases (every way to shade a region)', 'region cases followed a step further', '"suppose…" trials'],
    lits: ['', 'overlaps (cells every tetromino of a region covers or misses) and 2×2 checks', 'shape clashes (no 2×2, no twins)', 'joining-up arguments', '"suppose…" trials'],
    heyawake: ['', 'plain-rule steps (neighbours of shaded cells, full rooms, lines through three rooms)', 'room cases (every way to shade a room)', 'connection arguments and deeper room cases', '"suppose…" trials'],
    yajilin: ['', 'plain-rule steps (neighbours of shaded cells, finished clues, cells with two exits, dead ends)', 'arrow cases and small-loop crossings', 'connection arguments', '"suppose…" trials']
  };
  function logicTour(d) {
    const L = LG(), lv = [0, 0, 0, 0, 0, 0];
    let steps = 0;
    const note = (st) => { lv[st.level]++; steps++; };
    if (d.kind === 'numpath') {
      const P = L.npPrep(d), g = Int16Array.from(P.given);
      for (let t = 0; t < 600; t++) { const st = L.npStep(P, g, 4); if (!st) break; note(st); st.set.forEach(([i, k]) => { g[i] = k; }); }
    } else if (d.kind === 'yajilin') {
      const P = L.yjPrep(d), v = new Int8Array(P.N).fill(-1), e = new Int8Array(P.E).fill(-1);
      for (let t = 0; t < 800; t++) { const st = L.yjStep(P, v, e, 4); if (!st) break; note(st); st.set.forEach(([i, x]) => { v[i] = x; }); st.eset.forEach(([x, y]) => { e[x] = y; }); L.yjImplied(P, v, e); }
    } else {
      const P = d.kind === 'norinori' ? L.nrPrep(d.regions) : d.kind === 'lits' ? L.ltPrep(d.regions) : L.hyPrep(d);
      const step = d.kind === 'norinori' ? L.nrStep : d.kind === 'lits' ? L.ltStep : L.hyStep;
      const v = new Int8Array(P.N).fill(-1);
      for (let t = 0; t < 800; t++) { const st = step(P, v, 4); if (!st) break; note(st); st.set.forEach(([i, x]) => { v[i] = x; }); }
    }
    const parts = [];
    for (let k = 1; k <= 4; k++) if (lv[k]) parts.push(lv[k] + ' ' + TECH[d.kind][k]);
    if (!steps) return '';
    return 'The hints can walk you through this one in ' + steps + ' steps: ' + (parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0]) + '. No guessing needed' + (lv[4] ? ' — though the "suppose…" steps come close to it.' : '.');
  }

  /* ---------- shared bits of the boards ---------- */

  function timersFor() {
    const ts = [];
    return { later(fn, ms) { const t = setTimeout(fn, ms); ts.push(t); return t; }, clear() { ts.forEach(clearTimeout); ts.length = 0; } };
  }
  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const cnt = (k, one, many) => (WORDS[k] || String(k)) + ' ' + (k === 1 ? one : (many || one + 's'));
  // a fast drag reports points far apart: visit the cells in between too
  function smoothDrag(wb, getDrag) {
    const mv = wb.handlers.board.move;
    wb.handlers.board.move = (pt, ev) => {
      const dg = getDrag();
      if (!dg || !dg.p0) return mv(pt, ev);
      const a = dg.lp || dg.p0;
      const n = Math.max(1, Math.min(60, Math.ceil(Math.hypot(pt[0] - a[0], pt[1] - a[1]) / (S * 0.2))));
      for (let k = 1; k <= n; k++) mv([a[0] + (pt[0] - a[0]) * k / n, a[1] + (pt[1] - a[1]) * k / n], ev);
      dg.lp = pt;
    };
  }
  function buzz() { try { if (root.navigator && root.navigator.vibrate) root.navigator.vibrate(12); } catch (e) { /* no buzz */ } }

  // the "click or tap" switch in the panel
  function tapPanel(ctx, labels, tip, onChange, extra) {
    const btns = labels.map((label, k) => ctx.h('button.p3-segb' + (k === 0 ? '.on' : ''), { type: 'button', onclick: () => set(k === 1) }, label));
    function set(on) { btns.forEach((b, k) => b.classList.toggle('on', (k === 1) === on)); onChange(on); }
    const box = ctx.h('div.p3-panel', ctx.h('div.p3-seg', ctx.h('span.p3-segl', 'Click or tap:'), btns[0], btns[1]), ctx.h('div.p3-tip', tip));
    if (extra) box.appendChild(extra);
    ctx.panel.appendChild(box);
    return set;
  }

  const SOLVED_MSG = {
    norinori: ['Every domino in its place.', 'Two by two, all present and correct.', 'A tidy row of dominoes — none of them toppled.'],
    lits: ['L, I, T and S, all in their rooms.', 'Every tetromino fits, and no twins touch.', 'A wall of tetrominoes, all in one piece.'],
    heyawake: ['Every room in order.', 'The rooms are divided, and the white paths all join up.', 'Neat rooms, open corridors.'],
    yajilin: ['One loop, every arrow honest.', 'The loop closes, and every arrow tells the truth.', 'Round the whole grid in one go.'],
    numpath: ['The chain is complete.', 'From one to the end without a break.', 'Every number found its neighbours.']
  };
  const solvedMsg = (kind, p) => { const a = SOLVED_MSG[kind]; return a[(C.hash(p.id || 'x') >>> 3) % a.length]; };

  /* =====================================================================
   *  SHADING BOARDS: Norinori, LITS, Heyawake
   *  st: 0 empty, 1 shaded, 2 dot
   * ===================================================================== */

  function mountShade(ctx, p) {
    const d = p.data, L = LG(), wb = ctx.wb, s = ctx.s;
    const kind = d.kind, NR = kind === 'norinori', LT = kind === 'lits', HY = kind === 'heyawake';
    const P = NR ? L.nrPrep(d.regions) : LT ? L.ltPrep(d.regions) : L.hyPrep(d);
    const w = P.w, h = P.h, N = P.N;
    const sol = rowsToArr(d.sol);
    const st = new Int8Array(N);
    const ui = { tapDot: false, implied: C.store ? C.store.get('p3-implied', true) !== false : true };
    const T = timersFor();
    let won = false, pending = null, shown = null, drag = null, hovI = -1;
    let imp = new Uint8Array(N);
    const cur = { r: Math.floor(h / 2), c: Math.floor(w / 2), on: false };
    let lastSet = null;

    ctx.setGoal(p.goal || goalFor(d));
    wb.setBounds({ x0: -S * 0.3, y0: -S * 0.3, x1: w * S + S * 0.3, y1: h * S + S * 0.3 }, 0.04);
    const cx = (i) => (i % w) * S, cy = (i) => Math.floor(i / w) * S;

    const G = s('g', { class: 'p3 p3-' + kind }, wb.layer('board'));
    const bgG = s('g', null, G), cellG = s('g', null, G);
    const tintG = s('g', { class: 'p3-nohit' }, G), badG = s('g', { class: 'p3-nohit' }, G);
    const fillG = s('g', { class: 'p3-nohit p3-fills' }, G), markG = s('g', { class: 'p3-nohit' }, G);
    const lineG = s('g', { class: 'p3-nohit' }, G), errG = s('g', { class: 'p3-nohit' }, G), textG = s('g', { class: 'p3-nohit' }, G);
    const topG = s('g', { class: 'p3-nohit' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const hovEl = s('rect', { width: S, height: S, rx: 3, class: 'p3-hov' }, topG);
    const curEl = s('rect', { width: S - 2, height: S - 2, rx: 4, class: 'p3-cursor' }, topG);
    hovEl.style.display = 'none';

    s('rect', { x: -S * 0.16, y: -S * 0.16, width: w * S + S * 0.32, height: h * S + S * 0.32, rx: 8, class: 'p3-boardbg' }, bgG);
    for (let i = 0; i < N; i++) s('rect', { x: cx(i), y: cy(i), width: S, height: S, class: 'p3-cell', 'data-key': 'c' + i }, cellG);
    const tintEls = [];
    if (!HY) {
      const col = regionColours(P.reg, w, h, P.R);
      for (let i = 0; i < N; i++) tintEls.push(s('rect', { x: cx(i), y: cy(i), width: S, height: S, class: 'p3-tint', style: 'fill: hsl(' + REGION_HUES[col[P.reg[i]]] + ' 60% 58% / .16)' }, tintG));
    }
    let thin = '', thick = '';
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (c + 1 < w) { const seg = 'M' + (c + 1) * S + ' ' + r * S + 'v' + S; if (P.reg[i] !== P.reg[i + 1]) thick += seg; else thin += seg; }
      if (r + 1 < h) { const seg = 'M' + c * S + ' ' + (r + 1) * S + 'h' + S; if (P.reg[i] !== P.reg[i + w]) thick += seg; else thin += seg; }
    }
    s('path', { d: thin, class: 'p3-grid' }, lineG);
    s('path', { d: thick, class: 'p3-region' }, lineG);
    s('rect', { x: 0, y: 0, width: w * S, height: h * S, rx: 2, class: 'p3-frame' }, lineG);
    const numEls = [];
    if (HY) P.rooms.forEach((rm, k) => { numEls[k] = rm[4] >= 0 ? s('text', { x: rm[1] * S + 5, y: rm[0] * S + 14, class: 'p3-rnum', text: String(rm[4]) }, textG) : null; });
    const markEls = [];
    for (let i = 0; i < N; i++) markEls.push(s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')' }, markG));
    const msig = new Array(N).fill('');

    /* ---------- what the marks say ---------- */

    const vals = () => { const v = new Int8Array(N); for (let i = 0; i < N; i++) v[i] = st[i] === 1 ? 1 : st[i] === 2 ? 0 : -1; return v; };
    const shadedArr = () => Int8Array.from(st, (x) => (x === 1 ? 1 : 0));
    let A = null;
    function analyse() {
      const err = new Uint8Array(N), badRegion = new Uint8Array(P.R), doneRegion = new Uint8Array(P.R), cut = new Uint8Array(N);
      const shape = new Array(P.R).fill(null), segBad = [];
      let doneCount = 0, placed = 0;
      for (let i = 0; i < N; i++) if (st[i] === 1) placed++;
      if (NR) {
        for (let i = 0; i < N; i++) {
          if (st[i] !== 1) continue;
          let sh = 0, room = 0;
          for (const j of P.nb[i]) { if (st[j] === 1) sh++; else if (st[j] === 0) room++; }
          if (sh >= 2) err[i] = 1;
          if (!sh && !room) err[i] = 1;
        }
        for (let k = 0; k < P.R; k++) {
          let sh = 0, open = 0;
          for (const i of P.units[k]) { if (st[i] === 1) sh++; else if (st[i] === 0) open++; }
          if (sh > 2 || sh + open < 2) badRegion[k] = 1;
          if (sh === 2 && P.units[k].every((i) => st[i] !== 1 || !err[i])) { doneRegion[k] = 1; doneCount++; }
        }
      } else if (LT) {
        for (const B of P.blocks) if (B.every((i) => st[i] === 1)) B.forEach((i) => { err[i] = 1; });
        for (let k = 0; k < P.R; k++) {
          const sh = P.units[k].filter((i) => st[i] === 1);
          if (sh.length > 4) badRegion[k] = 1;
          else if (sh.length === 4) { shape[k] = L.shapeOf(sh, w); if (!shape[k]) badRegion[k] = 1; }
          if (P.units[k].filter((i) => st[i] !== 2).length < 4) badRegion[k] = 1;
        }
        for (let i = 0; i < N; i++) {
          if (st[i] !== 1 || !shape[P.reg[i]]) continue;
          for (const j of P.nb[i]) if (st[j] === 1 && P.reg[j] !== P.reg[i] && shape[P.reg[j]] === shape[P.reg[i]]) { err[i] = 1; err[j] = 1; }
        }
        for (let k = 0; k < P.R; k++) if (shape[k] && !badRegion[k] && P.units[k].every((i) => st[i] !== 1 || !err[i])) { doneRegion[k] = 1; doneCount++; }
      } else {
        for (let i = 0; i < N; i++) if (st[i] === 1) for (const j of P.nb[i]) if (st[j] === 1) { err[i] = 1; err[j] = 1; }
        for (let k = 0; k < P.R; k++) {
          const n = P.clue[k];
          if (n < 0) continue;
          let sh = 0, open = 0;
          for (const i of P.units[k]) { if (st[i] === 1) sh++; else if (st[i] === 0) open++; }
          if (sh > n || sh + open < n) badRegion[k] = 1;
          else if (sh === n) { doneRegion[k] = 1; doneCount++; }
        }
        P.segs.forEach((sg, k) => { if (sg.every((i) => st[i] === 2)) segBad.push(k); });
        // white cells cut off by shaded cells
        const comp = new Int32Array(N).fill(-1), sizes = [];
        for (let i = 0; i < N; i++) {
          if (st[i] === 1 || comp[i] >= 0) continue;
          const stack = [i];
          comp[i] = sizes.length;
          let n = 0;
          while (stack.length) { const x = stack.pop(); n++; for (const j of P.nb[x]) if (st[j] !== 1 && comp[j] < 0) { comp[j] = sizes.length; stack.push(j); } }
          sizes.push(n);
        }
        if (sizes.length > 1) {
          let big = 0;
          sizes.forEach((n, k) => { if (n > sizes[big]) big = k; });
          for (let i = 0; i < N; i++) if (comp[i] >= 0 && comp[i] !== big) cut[i] = 1;
        }
      }
      for (let k = 0; k < P.R; k++) if (badRegion[k] && !HY) P.units[k].forEach((i) => { if (st[i] === 1) err[i] = 1; });
      A = { err, badRegion, doneRegion, shape, segBad, cut, doneCount, placed };
      return A;
    }

    function evaluate() {
      const v = shadedArr();
      const ok = NR ? L.nrValid(P, v) : LT ? L.ltValid(P, v) : L.hyValid(P, v);
      if (ok) return { solved: true, msg: solvedMsg(kind, p) };
      const a = A || analyse();
      if (!a.placed) return { solved: false, msg: 'Nothing is shaded yet.' };
      if (NR) {
        if (a.err.some((x) => x)) return { solved: false, msg: 'Some shaded cells are not in proper dominoes (shown in red).' };
        const left = P.R - a.doneCount;
        return { solved: false, msg: C.plural(left, 'region still needs', 'regions still need') + ' ' + (left === 1 ? 'its' : 'their') + ' two shaded cells.' };
      }
      if (LT) {
        if (P.blocks.some((B) => B.every((i) => st[i] === 1))) return { solved: false, msg: 'There is a solid 2×2 block of shaded cells.' };
        if (a.err.some((x) => x)) return { solved: false, msg: 'Something is red: a region with too much shading, or two identical tetrominoes touching.' };
        const left = P.R - a.doneCount;
        if (left) return { solved: false, msg: C.plural(left, 'region still needs its tetromino', 'regions still need their tetrominoes') + '.' };
        return { solved: false, msg: 'Every region has its tetromino, but the shaded cells are not all joined into one group.' };
      }
      if (a.err.some((x) => x)) return { solved: false, msg: 'Two shaded cells are touching.' };
      if (a.badRegion.some((x) => x)) return { solved: false, msg: 'A room has the wrong number of shaded cells.' };
      if (a.cut.some((x) => x)) return { solved: false, msg: 'Some white cells are cut off from the rest (tinted red).' };
      const numbered = P.clue.filter((x) => x >= 0).length;
      if (a.doneCount < numbered) return { solved: false, msg: C.plural(numbered - a.doneCount, 'room still needs', 'rooms still need') + ' more shading.' };
      const sg = P.segs.findIndex((x) => !x.some((i) => st[i] === 1));
      if (sg >= 0) { flashSeg(sg); return { solved: false, msg: 'A straight line of white cells runs through three rooms (flashing).' }; }
      return { solved: false, msg: 'Not quite: look over the rules again.' };
    }

    /* ---------- drawing ---------- */

    function glyph(g, i, x) {
      if (x === 2) s('circle', { cx: S / 2, cy: S / 2, r: 3.3, class: 'p3-dot' }, g);
      else if (!x && imp[i]) s('circle', { cx: S / 2, cy: S / 2, r: 2.4, class: 'p3-dot implied' }, g);
    }
    // the cells the shading already rules out (shown as faint dots, taken as white by the hints)
    function impliedCells() {
      const out = new Uint8Array(N);
      if (!ui.implied) return out;
      const mark = (i) => { if (st[i] === 0) out[i] = 1; };
      if (NR) {
        for (let i = 0; i < N; i++) {
          if (st[i] !== 1) continue;
          const sh = P.nb[i].filter((j) => st[j] === 1);
          if (sh.length === 1) { P.nb[i].forEach(mark); P.nb[sh[0]].forEach(mark); }
        }
        for (let k = 0; k < P.R; k++) if (P.units[k].filter((i) => st[i] === 1).length >= 2) P.units[k].forEach(mark);
      } else if (HY) {
        for (let i = 0; i < N; i++) if (st[i] === 1) P.nb[i].forEach(mark);
        for (let k = 0; k < P.R; k++) if (P.clue[k] >= 0 && P.units[k].filter((i) => st[i] === 1).length >= P.clue[k]) P.units[k].forEach(mark);
      } else {
        for (let k = 0; k < P.R; k++) if (P.units[k].filter((i) => st[i] === 1).length >= 4) P.units[k].forEach(mark);
        for (const B of P.blocks) if (B.filter((i) => st[i] === 1).length === 3) B.forEach(mark);
      }
      return out;
    }
    function drawFills(a) {
      while (fillG.firstChild) fillG.removeChild(fillG.firstChild);
      const done = new Uint8Array(N);
      for (let i = 0; i < N; i++) {
        if (st[i] !== 1 || done[i]) continue;
        const bad = a.err[i];
        let style = null;
        if (LT) { const sh = a.shape[P.reg[i]]; if (sh && !a.badRegion[P.reg[i]]) style = 'fill: ' + SHAPE_COL[sh]; }
        if (NR && !bad) {
          // a finished domino is drawn as one tile
          const mate = P.nb[i].filter((j) => st[j] === 1);
          if (mate.length === 1 && P.nb[mate[0]].filter((j) => st[j] === 1).length === 1 && !a.err[mate[0]]) {
            const j = mate[0];
            done[j] = 1;
            const x0 = Math.min(cx(i), cx(j)), y0 = Math.min(cy(i), cy(j));
            const horiz = cy(i) === cy(j);
            s('rect', { x: x0 + 3, y: y0 + 3, width: (horiz ? 2 * S : S) - 6, height: (horiz ? S : 2 * S) - 6, rx: 8, class: 'p3-fill domino' }, fillG);
            s('path', { d: horiz ? 'M' + (x0 + S) + ' ' + (y0 + 9) + 'v' + (S - 18) : 'M' + (x0 + 9) + ' ' + (y0 + S) + 'h' + (S - 18), class: 'p3-pip' }, fillG);
            continue;
          }
        }
        const el = s('rect', { x: cx(i) + 2, y: cy(i) + 2, width: S - 4, height: S - 4, rx: 5, class: 'p3-fill' + (bad ? ' err' : '') }, fillG);
        if (style && !bad) el.setAttribute('style', style);
      }
      // LITS: join the cells of a finished tetromino
      if (LT) {
        for (let i = 0; i < N; i++) {
          if (st[i] !== 1) continue;
          const sh = a.shape[P.reg[i]];
          if (!sh || a.badRegion[P.reg[i]] || a.err[i]) continue;
          for (const j of [i + 1, i + w]) {
            if ((j === i + 1 && (i % w) === w - 1) || j >= N || st[j] !== 1 || P.reg[j] !== P.reg[i]) continue;
            const horiz = j === i + 1;
            s('rect', { x: cx(i) + (horiz ? S - 4 : 6), y: cy(i) + (horiz ? 6 : S - 4), width: horiz ? 8 : S - 12, height: horiz ? S - 12 : 8, class: 'p3-fill', style: 'fill: ' + SHAPE_COL[sh] }, fillG);
          }
        }
      }
    }
    function refresh() {
      const a = analyse();
      imp = impliedCells();
      drawFills(a);
      for (let i = 0; i < N; i++) {
        const key = st[i] === 2 ? 'd' : !st[i] && imp[i] ? 'i' : '';
        if (msig[i] === key) continue;
        msig[i] = key;
        const g = markEls[i];
        while (g.firstChild) g.removeChild(g.firstChild);
        glyph(g, i, st[i]);
      }
      tintEls.forEach((el, i) => { const k = P.reg[i]; el.classList.toggle('done', !!a.doneRegion[k]); el.classList.toggle('bad', !!a.badRegion[k]); });
      while (badG.firstChild) badG.removeChild(badG.firstChild);
      if (HY) {
        for (let i = 0; i < N; i++) if (a.cut[i]) s('rect', { x: cx(i), y: cy(i), width: S, height: S, class: 'p3-cut' }, badG);
        numEls.forEach((el, k) => { if (!el) return; el.classList.toggle('done', !!a.doneRegion[k]); el.classList.toggle('bad', !!a.badRegion[k]); el.classList.toggle('inv', st[P.rooms[k][0] * w + P.rooms[k][1]] === 1); });
      }
      while (errG.firstChild) errG.removeChild(errG.firstChild);
      a.segBad.forEach((k) => segLine(P.segs[k], 'p3-segbad', errG));
      if (NR) ctx.stat('Regions done', a.doneCount + ' of ' + P.R);
      else if (LT) ctx.stat('Tetrominoes', a.doneCount + ' of ' + P.R);
      else ctx.stat('Shaded', a.placed);
      if (shown) pruneHint();
      if (won && !evaluate().solved) setWon(false);
    }
    function segLine(sg, cls, parent) {
      const a = sg[0], b = sg[sg.length - 1];
      return s('line', { x1: cx(a) + S / 2, y1: cy(a) + S / 2, x2: cx(b) + S / 2, y2: cy(b) + S / 2, class: cls }, parent);
    }
    function flashSeg(k) {
      const el = segLine(P.segs[k], 'p3-segflash', errG);
      T.later(() => el.remove(), 1800);
    }

    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
    }

    /* ---------- hints ---------- */

    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    function wrongMark(i) { return (st[i] === 1 && !sol[i]) || (st[i] === 2 && sol[i] === 1); }
    function showHint(hh) {
      clearHint();
      shown = { set: (hh.set || []).slice(), wrong: (hh.wrong || []).slice(), els: {} };
      (hh.focus || []).forEach((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: S - 2, height: S - 2, rx: 4, class: 'p3-hzone' }, hintG));
      (hh.zone || []).forEach((i) => s('rect', { x: cx(i) + 3, y: cy(i) + 3, width: S - 6, height: S - 6, rx: 5, class: 'p3-hzone2' }, hintG));
      shown.wrong.forEach((i) => { shown.els['w' + i] = s('rect', { x: cx(i) + 2.5, y: cy(i) + 2.5, width: S - 5, height: S - 5, rx: 5, class: 'p3-hwrong' }, hintG); });
      shown.set.forEach(([i, x]) => {
        const g = s('g', { transform: 'translate(' + cx(i) + ' ' + cy(i) + ')', class: 'p3-ghost' }, hintG);
        s('rect', { x: 2.5, y: 2.5, width: S - 5, height: S - 5, rx: 5, class: 'p3-hcell' }, g);
        if (x === 1) s('rect', { x: 5, y: 5, width: S - 10, height: S - 10, rx: 4, class: 'p3-fill' }, g); else glyph(g, i, 2);
        shown.els[i] = g;
      });
    }
    function pruneHint() {
      shown.set = shown.set.filter(([i, x]) => { if (st[i] !== x) return true; if (shown.els[i]) shown.els[i].remove(); return false; });
      shown.wrong = shown.wrong.filter((i) => { if (wrongMark(i)) return true; if (shown.els['w' + i]) shown.els['w' + i].remove(); return false; });
      if (!shown.set.length && !shown.wrong.length) clearHint();
    }
    function flash(cells) {
      const els = cells.map((i) => s('rect', { x: cx(i) + 1, y: cy(i) + 1, width: S - 2, height: S - 2, rx: 5, class: 'p3-flash' }, hintG));
      T.later(() => els.forEach((e) => e.remove()), 1400);
    }
    function describeSet(set) {
      const k1 = set.filter((x) => x[1] === 1).length, k2 = set.length - k1;
      return [k1 ? cnt(k1, 'shaded cell') : null, k2 ? cnt(k2, 'dot') : null].filter(Boolean).join(' and ');
    }
    function stepNow() {
      const v = vals();
      for (let i = 0; i < N; i++) if (imp[i] && v[i] < 0) v[i] = 0;
      const r = NR ? L.nrStep(P, v, 5, sol) : LT ? L.ltStep(P, v, 5, sol) : L.hyStep(P, v, 5, sol);
      return r && { text: r.text, set: r.set.map(([i, x]) => [i, x === 1 ? 1 : 2]), focus: r.focus || [], zone: r.zone || [] };
    }

    /* ---------- gestures ---------- */

    function cellAt(pt) {
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    }
    const nextState = (s0, dot) => (dot ? (s0 === 2 ? 0 : 2) : (s0 === 1 ? 0 : 1));
    function begin(dg, dot) {
      dg.to = nextState(dg.from, dot);
      st[dg.a] = dg.to;
      lastSet = dg.to;
      ctx.sfx('tap');
      refresh();
    }
    wb.handlers.board = {
      down(pt, ev) {
        const i = cellAt(pt);
        if (i < 0) return false;
        cur.on = false; cur.r = Math.floor(i / w); cur.c = i % w;
        drawCursor();
        const touch = ev.pointerType === 'touch';
        const dg = drag = { a: i, from: st[i], to: null, orig: Int8Array.from(st), last: i, touch, p0: pt, moved: false };
        if (!touch) begin(dg, ev.button === 2 || ui.tapDot);
        else T.later(() => { if (drag === dg && dg.to == null && !dg.moved) { buzz(); begin(dg, true); } }, 460);
        return true;
      },
      move(pt) {
        if (!drag) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > S * 0.2) drag.moved = true;
        if (drag.to == null) { if (drag.moved) begin(drag, ui.tapDot); else return; }
        const j = cellAt(pt);
        if (j < 0 || j === drag.last) return;
        drag.last = j;
        if (drag.orig[j] === drag.from && st[j] !== drag.to) { st[j] = drag.to; refresh(); }
      },
      up() {
        if (!drag) return;
        if (drag.to == null) begin(drag, ui.tapDot);
        const changed = st.some((x, i) => x !== drag.orig[i]);
        drag = null;
        if (changed) ctx.changed('cells');
      },
      hover(pt) { hover(pt); }
    };
    smoothDrag(wb, () => drag);
    function hover(pt) {
      const i = pt && !drag ? cellAt(pt) : -1;
      if (i === hovI) return;
      hovI = i;
      hovEl.style.display = i < 0 ? 'none' : '';
      if (i >= 0) { hovEl.setAttribute('x', cx(i)); hovEl.setAttribute('y', cy(i)); }
    }
    const onLeave = () => hover(null);
    wb.svg.addEventListener('pointerleave', onLeave);
    function drawCursor() {
      curEl.style.display = cur.on ? '' : 'none';
      curEl.setAttribute('x', cur.c * S + 1);
      curEl.setAttribute('y', cur.r * S + 1);
    }
    drawCursor();

    let legend = null;
    if (LT) {
      legend = ctx.h('div.p3-legend');
      [['L', [[0, 0], [1, 0], [2, 0], [2, 1]]], ['I', [[0, 0], [1, 0], [2, 0], [3, 0]]], ['T', [[0, 0], [0, 1], [0, 2], [1, 1]]], ['S', [[0, 1], [0, 2], [1, 0], [1, 1]]]].forEach(([k, cells]) => {
        const q = 7;
        let svg = '<svg viewBox="-1 -1 ' + (3 * q + 2) + ' ' + (4 * q + 2) + '" width="27" height="35">';
        cells.forEach(([r, c]) => { svg += '<rect x="' + c * q + '" y="' + r * q + '" width="' + (q - 1) + '" height="' + (q - 1) + '" rx="1.5" fill="' + SHAPE_COL[k] + '"/>'; });
        const item = ctx.h('span.p3-legi');
        item.innerHTML = svg + '<b>' + k + '</b>';
        legend.appendChild(item);
      });
    }
    const impBox = ctx.h('input', { type: 'checkbox', checked: ui.implied, onchange: () => { ui.implied = impBox.checked; if (C.store) C.store.set('p3-implied', ui.implied); refresh(); } });
    const extra = ctx.h('div', legend || '', ctx.h('label.p3-opt', impBox, ' Dot the cells my shading rules out'));
    tapPanel(ctx, ['Shade', 'Dot'], 'Right-click (or long-press) puts a dot: a cell that stays white. Drag to do several cells at once.', (on) => { ui.tapDot = on; }, extra);

    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() {
        const wrong = [];
        for (let i = 0; i < N; i++) if (wrongMark(i)) wrong.push(i);
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
          return { text: (wrong.length === 1 ? 'One of your marks is wrong' : wrong.length + ' of your marks are wrong') + ' (outlined in red). Look again — or ask for another hint and I will rub ' + (wrong.length === 1 ? 'it' : 'them') + ' out.', show() { showHint({ wrong }); } };
        }
        if (pending && pending.set) {
          const todo = pending.set.filter(([i, x]) => st[i] !== x);
          pending = null;
          if (todo.length) {
            todo.forEach(([i, x]) => { st[i] = x; });
            clearHint();
            refresh();
            ctx.changed('hint');
            return { text: 'Done: I put in ' + describeSet(todo) + ' from the last hint.', show() { flash(todo.map((x) => x[0])); } };
          }
        }
        const step = stepNow();
        if (!step) {
          const r = evaluate();
          return r.solved ? 'It is solved already!' : 'Every cell is decided — ' + (r.msg || 'look over your marks.');
        }
        pending = { set: step.set };
        return { text: step.text + ' *(Ask again and I will fill ' + (step.set.length === 1 ? 'it' : 'them') + ' in.)*', show() { showHint(step); } };
      },
      solve() {
        clearHint();
        pending = null;
        const order = [];
        for (let i = 0; i < N; i++) if ((st[i] === 1) !== (sol[i] === 1) || (st[i] === 2 && sol[i])) order.push(i);
        order.sort((a, b) => (Math.floor(a / w) + a % w) - (Math.floor(b / w) + b % w) || a - b);
        // a wave from the top left corner
        let k = 0;
        if (T.stopTween) T.stopTween();
        T.stopTween = C.tween(C.anim(Math.min(900, 250 + order.length * 12)), (t) => {
          const upto = Math.round(t * order.length);
          let ch = false;
          while (k < upto) { const i = order[k++]; st[i] = sol[i] ? 1 : 0; ch = true; }
          if (ch) refresh();
        }, () => {
          while (k < order.length) { const i = order[k++]; st[i] = sol[i] ? 1 : 0; }
          T.stopTween = null;
          refresh();
          ctx.changed('solve');
        }, 'linear');
      },
      explain() { return logicTour(d); },
      getState() { return { s: Array.from(st).join('') }; },
      setState(o) {
        if (!o || typeof o.s !== 'string' || o.s.length !== N) return;
        if (T.stopTween) { T.stopTween(); T.stopTween = null; }
        for (let i = 0; i < N; i++) st[i] = +o.s[i] || 0;
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
          if (ev.shiftKey && lastSet != null && st[i] !== lastSet) { st[i] = lastSet; refresh(); ctx.changed('cells'); }
          return true;
        }
        if (!cur.on) return false;
        const i = cur.r * w + cur.c;
        const set = (x) => { if (st[i] !== x) { st[i] = x; lastSet = x; ctx.sfx('tap'); refresh(); ctx.changed('cells'); } };
        if (k === 'Enter') { set(nextState(st[i], false)); return true; }
        if (k === ' ' || k === '.') { set(nextState(st[i], true)); return true; }
        if (k === 'Backspace' || k === 'Delete') { set(0); return true; }
        if (k === 'Escape') { cur.on = false; drawCursor(); }
        return false;
      },
      destroy() { T.clear(); if (T.stopTween) T.stopTween(); wb.svg.removeEventListener('pointerleave', onLeave); }
    };
  }

  /* =====================================================================
   *  YAJILIN BOARD
   *  st: cells 0 empty, 1 shaded, 2 dot;  es: edges 0 none, 1 line, 2 cross
   * ===================================================================== */

  function mountYaji(ctx, p) {
    const d = p.data, L = LG(), wb = ctx.wb, s = ctx.s;
    const P = L.yjPrep(d), w = P.w, h = P.h, N = P.N, E = P.E;
    const sol = L.yjSolParse(P, d.sol);
    const st = new Int8Array(N), es = new Int8Array(E);
    const ui = { tapDot: false, implied: C.store ? C.store.get('p3-implied', true) !== false : true };
    const T = timersFor();
    let won = false, pending = null, shown = null, drag = null, hovE = -1, tipShown = false, busy = false;
    let imp = new Uint8Array(N);
    const cur = { r: Math.floor(h / 2), c: Math.floor(w / 2), on: false };

    ctx.setGoal(p.goal || goalFor(d));
    wb.setBounds({ x0: -S * 0.3, y0: -S * 0.3, x1: w * S + S * 0.3, y1: h * S + S * 0.3 }, 0.04);
    const cx = (i) => (i % w) * S + S / 2, cy = (i) => Math.floor(i / w) * S + S / 2;

    const G = s('g', { class: 'p3 p3-yajilin' }, wb.layer('board'));
    const bgG = s('g', null, G), cellG = s('g', null, G);
    const fillG = s('g', { class: 'p3-nohit p3-fills' }, G), gridG = s('g', { class: 'p3-nohit' }, G);
    const crossG = s('g', { class: 'p3-nohit' }, G), lineG = s('g', { class: 'p3-nohit p3-lines' }, G);
    const dotG = s('g', { class: 'p3-nohit' }, G), errG = s('g', { class: 'p3-nohit' }, G), textG = s('g', { class: 'p3-nohit' }, G);
    const topG = s('g', { class: 'p3-nohit' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const hovEl = s('line', { class: 'p3-hovedge' }, topG);
    const curEl = s('rect', { width: S - 2, height: S - 2, rx: 4, class: 'p3-cursor' }, topG);
    hovEl.style.display = 'none';

    s('rect', { x: -S * 0.16, y: -S * 0.16, width: w * S + S * 0.32, height: h * S + S * 0.32, rx: 8, class: 'p3-boardbg' }, bgG);
    const clueEls = {};
    for (let i = 0; i < N; i++) {
      const x = (i % w) * S, y = Math.floor(i / w) * S;
      s('rect', { x, y, width: S, height: S, class: P.isClue[i] ? 'p3-cluecell' : 'p3-cell', 'data-key': 'c' + i }, cellG);
    }
    P.clues.forEach((cl, k) => {
      const x = cx(cl.c), y = cy(cl.c);
      const t = s('text', { x, y: y + 0.5, class: 'p3-yclue' }, textG);
      const a = s('tspan', { class: 'p3-yarrow' }, t);
      const n = s('tspan', null, t);
      n.textContent = String(cl.n);
      a.textContent = L.yjArrow[cl.dir];
      if (cl.dir === 1 || cl.dir === 2) t.appendChild(a); // number first, then → or ↓
      clueEls[k] = t;
    });
    let gl = '';
    for (let c = 1; c < w; c++) gl += 'M' + c * S + ' 0V' + h * S;
    for (let r = 1; r < h; r++) gl += 'M0 ' + r * S + 'H' + w * S;
    s('path', { d: gl, class: 'p3-grid' }, gridG);
    s('rect', { x: 0, y: 0, width: w * S, height: h * S, rx: 2, class: 'p3-frame' }, gridG);
    const lineEls = [], crossEls = [];
    for (let x = 0; x < E; x++) {
      const a = P.ea[x], b = P.eb[x];
      const ln = s('line', { x1: cx(a), y1: cy(a), x2: cx(b), y2: cy(b), class: 'p3-line' }, lineG);
      const mx = (cx(a) + cx(b)) / 2, my = (cy(a) + cy(b)) / 2, k = S * 0.09;
      const cr = s('path', { d: 'M' + (mx - k) + ' ' + (my - k) + 'L' + (mx + k) + ' ' + (my + k) + 'M' + (mx + k) + ' ' + (my - k) + 'L' + (mx - k) + ' ' + (my + k), class: 'p3-cross' }, crossG);
      ln.style.display = 'none'; cr.style.display = 'none';
      lineEls.push(ln); crossEls.push(cr);
    }
    const esig = new Array(E).fill(''), csig = new Array(N).fill('');
    const cellMark = [];
    for (let i = 0; i < N; i++) cellMark.push(null);

    /* ---------- what the marks say ---------- */

    const degOf = (i) => { let k = 0; for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && es[x] === 1) k++; } return k; };
    let A = null;
    function analyse() {
      const err = new Uint8Array(N), errE = new Uint8Array(E), clueBad = {}, clueDone = {};
      for (const i of P.cells) if (st[i] === 1) for (const j of P.nbc[i]) if (st[j] === 1) { err[i] = 1; err[j] = 1; }
      P.clues.forEach((cl, k) => {
        let sh = 0, room = 0;
        for (const i of cl.ray) { if (st[i] === 1) sh++; else if (st[i] === 0 && !degOf(i)) room++; }
        if (sh > cl.n || sh + room < cl.n) clueBad[k] = 1;
        else if (sh === cl.n && (cl.n > 0 || cl.ray.every((i) => st[i] === 2 || degOf(i)))) clueDone[k] = 1;
      });
      const deg = new Uint8Array(N);
      let lines = 0;
      for (let x = 0; x < E; x++) if (es[x] === 1) { deg[P.ea[x]]++; deg[P.eb[x]]++; lines++; }
      const nodeBad = new Uint8Array(N);
      for (const i of P.cells) {
        if (deg[i] > 2) nodeBad[i] = 1;
        else if (deg[i] === 1) {
          let more = 0;
          for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && es[x] === 0 && st[yjOther(P, x, i)] !== 1) more++; }
          if (!more) nodeBad[i] = 1;
        }
      }
      // pieces of line; a closed one among others is a stray loop
      const comp = new Int32Array(N).fill(-1), pieces = [];
      for (const i of P.cells) {
        if (!deg[i] || comp[i] >= 0) continue;
        const pc = { closed: true, cells: [] };
        const stack = [i];
        comp[i] = pieces.length;
        while (stack.length) {
          const x = stack.pop();
          pc.cells.push(x);
          if (deg[x] !== 2) pc.closed = false;
          for (let q = 0; q < 4; q++) { const ed = P.cellE[x * 4 + q]; if (ed < 0 || es[ed] !== 1) continue; const y = yjOther(P, ed, x); if (comp[y] < 0) { comp[y] = pieces.length; stack.push(y); } }
        }
        pieces.push(pc);
      }
      const whiteOff = P.cells.filter((i) => st[i] !== 1 && !deg[i]).length;
      if (pieces.length > 1 || (pieces.length === 1 && pieces[0].closed && whiteOff)) {
        for (let x = 0; x < E; x++) if (es[x] === 1 && pieces[comp[P.ea[x]]].closed && (pieces.length > 1 || whiteOff)) errE[x] = 1;
      }
      A = { err, errE, clueBad, clueDone, deg, nodeBad, pieces, lines, whiteOff };
      return A;
    }
    const cellVals = () => { const v = new Int8Array(N); for (let i = 0; i < N; i++) v[i] = P.isClue[i] ? 2 : st[i] === 1 ? 1 : st[i] === 2 || imp[i] ? 0 : -1; return v; };
    const edgeVals = () => Int8Array.from(es, (x) => (x === 1 ? 1 : x === 2 ? 0 : -1));
    function evaluate() {
      const v = new Int8Array(N), e = Int8Array.from(es, (x) => (x === 1 ? 1 : 0));
      for (let i = 0; i < N; i++) v[i] = P.isClue[i] ? 2 : st[i] === 1 ? 1 : 0;
      if (L.yjValid(P, v, e)) return { solved: true, msg: solvedMsg('yajilin', p) };
      const a = A || analyse();
      if (!a.lines && !st.some((x) => x === 1)) return { solved: false, msg: 'Nothing is drawn yet. A good place to start: a 0 clue, or a clue whose count only just fits.' };
      if (a.err.some((x) => x)) return { solved: false, msg: 'Two shaded cells are touching.' };
      if (Object.keys(a.clueBad).length) return { solved: false, msg: 'A clue has the wrong number of shaded cells (in red).' };
      if (a.nodeBad.some((x, i) => x && a.deg[i] > 2)) return { solved: false, msg: 'The loop may not branch.' };
      if (a.pieces.length > 1 && a.pieces.some((pc) => pc.closed)) return { solved: false, msg: 'There is more than one loop — the stray one is in red.' };
      if (a.whiteOff) return { solved: false, msg: C.plural(a.whiteOff, 'cell is', 'cells are') + ' neither shaded nor on the loop yet.' };
      if (a.pieces.length > 1) return { solved: false, msg: 'The line is still in ' + a.pieces.length + ' pieces.' };
      if (a.pieces.length === 1 && !a.pieces[0].closed) return { solved: false, msg: 'The loop is not closed yet.' };
      const bad = P.clues.findIndex((cl) => cl.ray.filter((i) => st[i] === 1).length !== cl.n);
      if (bad >= 0) return { solved: false, msg: 'A clue does not have its count yet.' };
      return { solved: false, msg: 'Not quite: look over the rules again.' };
    }

    /* ---------- drawing ---------- */

    function refresh() {
      const a = analyse();
      imp = new Uint8Array(N);
      if (ui.implied) for (const i of P.cells) if (st[i] === 1) for (const j of P.nbc[i]) if (!st[j]) imp[j] = 1;
      for (let x = 0; x < E; x++) {
        const key = es[x] + ':' + a.errE[x];
        if (esig[x] === key) continue;
        esig[x] = key;
        lineEls[x].style.display = es[x] === 1 ? '' : 'none';
        lineEls[x].setAttribute('class', 'p3-line' + (a.errE[x] ? ' err' : ''));
        crossEls[x].style.display = es[x] === 2 ? '' : 'none';
      }
      for (const i of P.cells) {
        const key = st[i] + ':' + a.err[i] + ':' + (a.deg[i] ? 1 : 0) + ':' + imp[i];
        if (csig[i] === key) continue;
        csig[i] = key;
        if (cellMark[i]) { cellMark[i].remove(); cellMark[i] = null; }
        if (st[i] === 1) cellMark[i] = s('rect', { x: cx(i) - S / 2 + 2, y: cy(i) - S / 2 + 2, width: S - 4, height: S - 4, rx: 5, class: 'p3-fill' + (a.err[i] ? ' err' : '') }, fillG);
        else if (st[i] === 2 && !a.deg[i]) cellMark[i] = s('circle', { cx: cx(i), cy: cy(i), r: 3.3, class: 'p3-dot' }, dotG);
        else if (!st[i] && imp[i] && !a.deg[i]) cellMark[i] = s('circle', { cx: cx(i), cy: cy(i), r: 2.4, class: 'p3-dot implied' }, dotG);
      }
      while (errG.firstChild) errG.removeChild(errG.firstChild);
      for (const i of P.cells) if (a.nodeBad[i]) s('circle', { cx: cx(i), cy: cy(i), r: S * 0.2, class: 'p3-errnode' }, errG);
      P.clues.forEach((cl, k) => { clueEls[k].classList.toggle('bad', !!a.clueBad[k]); clueEls[k].classList.toggle('done', !!a.clueDone[k]); });
      let onLoop = 0;
      for (const i of P.cells) if (a.deg[i]) onLoop++;
      ctx.stat('Cells to go', a.whiteOff);
      if (shown) pruneHint();
      if (won && !evaluate().solved) setWon(false);
    }

    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
    }

    /* ---------- hints ---------- */

    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    const wrongCell = (i) => (st[i] === 1 && sol.v[i] !== 1) || (st[i] === 2 && sol.v[i] === 1);
    const wrongEdge = (x) => (es[x] === 1 && sol.e[x] !== 1) || (es[x] === 2 && sol.e[x] === 1);
    function edgeLine(x, cls) { return s('line', { x1: cx(P.ea[x]), y1: cy(P.ea[x]), x2: cx(P.eb[x]), y2: cy(P.eb[x]), class: cls }, hintG); }
    function edgeCross(x, cls) {
      const mx = (cx(P.ea[x]) + cx(P.eb[x])) / 2, my = (cy(P.ea[x]) + cy(P.eb[x])) / 2, k = S * 0.12;
      return s('path', { d: 'M' + (mx - k) + ' ' + (my - k) + 'L' + (mx + k) + ' ' + (my + k) + 'M' + (mx + k) + ' ' + (my - k) + 'L' + (mx - k) + ' ' + (my + k), class: cls }, hintG);
    }
    function showHint(hh) {
      clearHint();
      shown = { set: (hh.set || []).slice(), eset: (hh.eset || []).slice(), wrong: (hh.wrong || []).slice(), wrongE: (hh.wrongE || []).slice(), els: {} };
      (hh.focus || []).forEach((i) => s('rect', { x: cx(i) - S / 2 + 1, y: cy(i) - S / 2 + 1, width: S - 2, height: S - 2, rx: 4, class: 'p3-hzone' }, hintG));
      (hh.zone || []).forEach((i) => s('rect', { x: cx(i) - S / 2 + 3, y: cy(i) - S / 2 + 3, width: S - 6, height: S - 6, rx: 5, class: 'p3-hzone2' }, hintG));
      shown.wrong.forEach((i) => { shown.els['w' + i] = s('rect', { x: cx(i) - S / 2 + 2.5, y: cy(i) - S / 2 + 2.5, width: S - 5, height: S - 5, rx: 5, class: 'p3-hwrong' }, hintG); });
      shown.wrongE.forEach((x) => { shown.els['we' + x] = edgeLine(x, 'p3-hwrongline'); });
      shown.set.forEach(([i, x]) => {
        const g = s('g', { class: 'p3-ghost' }, hintG);
        s('rect', { x: cx(i) - S / 2 + 2.5, y: cy(i) - S / 2 + 2.5, width: S - 5, height: S - 5, rx: 5, class: 'p3-hcell' }, g);
        if (x === 1) s('rect', { x: cx(i) - S / 2 + 6, y: cy(i) - S / 2 + 6, width: S - 12, height: S - 12, rx: 4, class: 'p3-fill' }, g);
        else s('circle', { cx: cx(i), cy: cy(i), r: 3.5, class: 'p3-dot' }, g);
        shown.els['c' + i] = g;
      });
      shown.eset.forEach(([x, y]) => { shown.els['e' + x] = y === 1 ? edgeLine(x, 'p3-gline') : edgeCross(x, 'p3-gcross'); });
    }
    function pruneHint() {
      shown.set = shown.set.filter(([i, x]) => { if (st[i] !== x && !(x === 2 && A && A.deg[i])) return true; if (shown.els['c' + i]) shown.els['c' + i].remove(); return false; });
      shown.eset = shown.eset.filter(([x, y]) => { if (es[x] !== y) return true; if (shown.els['e' + x]) shown.els['e' + x].remove(); return false; });
      shown.wrong = shown.wrong.filter((i) => { if (wrongCell(i)) return true; if (shown.els['w' + i]) shown.els['w' + i].remove(); return false; });
      shown.wrongE = shown.wrongE.filter((x) => { if (wrongEdge(x)) return true; if (shown.els['we' + x]) shown.els['we' + x].remove(); return false; });
      if (!shown.set.length && !shown.eset.length && !shown.wrong.length && !shown.wrongE.length) clearHint();
    }
    function flash(cells, edges) {
      const els = cells.map((i) => s('rect', { x: cx(i) - S / 2 + 1, y: cy(i) - S / 2 + 1, width: S - 2, height: S - 2, rx: 5, class: 'p3-flash' }, hintG))
        .concat(edges.map((x) => edgeLine(x, 'p3-flashline')));
      T.later(() => els.forEach((e) => e.remove()), 1400);
    }

    /* ---------- gestures ---------- */

    function cellAt(pt) {
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      return c >= 0 && c < w && r >= 0 && r < h ? r * w + c : -1;
    }
    function edgeAt(pt, tol) {
      let best = -1, bd = tol;
      for (let x = 0; x < E; x++) {
        const dd = Math.hypot(pt[0] - (cx(P.ea[x]) + cx(P.eb[x])) / 2, pt[1] - (cy(P.ea[x]) + cy(P.eb[x])) / 2);
        if (dd < bd) { bd = dd; best = x; }
      }
      return best;
    }
    const edgeBetween = (a, b) => { for (let q = 0; q < 4; q++) { const x = P.cellE[a * 4 + q]; if (x >= 0 && yjOther(P, x, a) === b) return x; } return -1; };
    // lines never run into shaded cells: shading a cell takes its lines away
    function setCell(i, x) {
      if (P.isClue[i] || st[i] === x) return false;
      st[i] = x;
      if (x === 1) for (let q = 0; q < 4; q++) { const e = P.cellE[i * 4 + q]; if (e >= 0 && es[e] === 1) es[e] = 0; }
      return true;
    }
    function setEdge(x, y) {
      if (es[x] === y) return false;
      if (y === 1 && (st[P.ea[x]] === 1 || st[P.eb[x]] === 1)) {
        if (!tipShown) { tipShown = true; ctx.toast('The loop cannot pass through a shaded cell.'); }
        return false;
      }
      es[x] = y;
      return true;
    }
    wb.handlers.board = {
      down(pt, ev) {
        if (busy) return false;
        const i = cellAt(pt);
        if (i < 0) return false;
        const right = ev.button === 2, touch = ev.pointerType === 'touch';
        cur.on = false; drawCursor(); hover(null);
        const dg = drag = { p0: pt, right, touch, orig: { st: Int8Array.from(st), es: Int8Array.from(es) }, nodes: [i], edges: [], mode: null, moved: false, done: false };
        if (right) {
          const x = edgeAt(pt, S * 0.24);
          if (x >= 0) setEdge(x, es[x] === 2 ? 0 : 2); else setCell(i, st[i] === 2 ? 0 : 2);
          ctx.sfx('tap');
          refresh();
          dg.done = true;
          return true;
        }
        if (touch) {
          T.later(() => {
            if (drag !== dg || dg.moved || dg.mode) return;
            buzz();
            const x = edgeAt(dg.p0, S * 0.24);
            if (x >= 0) setEdge(x, es[x] === 2 ? 0 : 2); else setCell(i, st[i] === 2 ? 0 : 2);
            dg.done = true;
            refresh();
          }, 460);
        }
        return true;
      },
      move(pt) {
        if (!drag || drag.done) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > S * 0.2) drag.moved = true;
        const n = cellAt(pt);
        if (n < 0 || Math.hypot(pt[0] - cx(n), pt[1] - cy(n)) > S * 0.46) return;
        const last = drag.nodes[drag.nodes.length - 1];
        if (n === last) return;
        if (drag.nodes.length >= 2 && n === drag.nodes[drag.nodes.length - 2] && drag.edges.length) {
          const x = drag.edges.pop();
          drag.nodes.pop();
          if (es[x] !== drag.orig.es[x]) { es[x] = drag.orig.es[x]; refresh(); }
          return;
        }
        const x = edgeBetween(last, n);
        if (x < 0) return;
        if (!drag.mode) drag.mode = { to: es[x] === 1 ? 0 : 1 };
        // drawing turns crosses into lines too; rubbing out only takes lines away
        if (drag.mode.to === 1 ? setEdge(x, 1) : (es[x] === 1 && setEdge(x, 0))) ctx.sfx('tap');
        drag.edges.push(x);
        drag.nodes.push(n);
        refresh();
      },
      up(pt) {
        if (!drag) return;
        const dg = drag;
        if (!dg.mode && !dg.done) {
          const x = edgeAt(pt, S * 0.2);
          if (x >= 0 && !dg.moved) setEdge(x, es[x] === 1 ? 0 : 1);
          else if (!dg.moved) { const i = dg.nodes[0]; setCell(i, ui.tapDot ? (st[i] === 2 ? 0 : 2) : (st[i] === 1 ? 0 : 1)); }
          ctx.sfx('tap');
          refresh();
        }
        drag = null;
        const changed = st.some((x, i) => x !== dg.orig.st[i]) || es.some((x, i) => x !== dg.orig.es[i]);
        if (changed) ctx.changed('marks');
      },
      hover(pt) { hover(pt); }
    };
    smoothDrag(wb, () => drag);
    function hover(pt) {
      const x = pt && !drag ? edgeAt(pt, S * 0.2) : -1;
      if (x === hovE) return;
      hovE = x;
      hovEl.style.display = x < 0 ? 'none' : '';
      if (x < 0) return;
      hovEl.setAttribute('x1', cx(P.ea[x])); hovEl.setAttribute('y1', cy(P.ea[x]));
      hovEl.setAttribute('x2', cx(P.eb[x])); hovEl.setAttribute('y2', cy(P.eb[x]));
    }
    const onLeave = () => hover(null);
    wb.svg.addEventListener('pointerleave', onLeave);
    function drawCursor() {
      curEl.style.display = cur.on ? '' : 'none';
      curEl.setAttribute('x', cur.c * S + 1);
      curEl.setAttribute('y', cur.r * S + 1);
    }
    drawCursor();

    const impBox = ctx.h('input', { type: 'checkbox', checked: ui.implied, onchange: () => { ui.implied = impBox.checked; if (C.store) C.store.set('p3-implied', ui.implied); refresh(); } });
    tapPanel(ctx, ['Shade', 'Dot'], 'Drag from cell to cell to draw the loop. Right-click (or long-press) a cell for a dot, or the gap between two cells to cross that step out.', (on) => { ui.tapDot = on; }, ctx.h('label.p3-opt', impBox, ' Dot the cells next to shaded ones'));

    refresh();

    // the loop of the answer in order, for the solving animation
    function loopOrder() {
      const out = [];
      let start = -1;
      for (let x = 0; x < E; x++) if (sol.e[x] === 1) { start = P.ea[x]; break; }
      if (start < 0) return out;
      let n = start, prev = -1;
      for (let guard = 0; guard <= E; guard++) {
        let via = -1;
        for (let q = 0; q < 4; q++) { const x = P.cellE[n * 4 + q]; if (x >= 0 && sol.e[x] === 1 && x !== prev) { via = x; break; } }
        if (via < 0) break;
        out.push(via);
        prev = via;
        n = yjOther(P, via, n);
        if (n === start) break;
      }
      return out;
    }

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() {
        if (busy) return null;
        const wrong = P.cells.filter(wrongCell), wrongE = [];
        for (let x = 0; x < E; x++) if (wrongEdge(x)) wrongE.push(x);
        const nw = wrong.length + wrongE.length;
        if (nw) {
          if (pending && pending.fix) {
            wrong.forEach((i) => { st[i] = 0; });
            wrongE.forEach((x) => { es[x] = 0; });
            pending = null;
            clearHint();
            refresh();
            ctx.changed('hint');
            return 'I rubbed out ' + (nw === 1 ? 'the wrong mark' : 'the ' + nw + ' wrong marks') + '. Carry on from here.';
          }
          pending = { fix: true };
          return { text: (nw === 1 ? 'One of your marks is wrong' : nw + ' of your marks are wrong') + ' (outlined in red). Look again — or ask for another hint and I will rub ' + (nw === 1 ? 'it' : 'them') + ' out.', show() { showHint({ wrong, wrongE }); } };
        }
        if (pending && pending.set) {
          const todo = pending.set.filter(([i, x]) => st[i] !== x), todoE = pending.eset.filter(([x, y]) => es[x] !== y);
          pending = null;
          if (todo.length || todoE.length) {
            todo.forEach(([i, x]) => { setCell(i, x); });
            todoE.forEach(([x, y]) => { es[x] = y; });
            clearHint();
            refresh();
            ctx.changed('hint');
            const k1 = todo.filter((x) => x[1] === 1).length, k2 = todo.length - k1, k3 = todoE.filter((x) => x[1] === 1).length, k4 = todoE.length - k3;
            const parts = [k1 ? cnt(k1, 'shaded cell') : null, k2 ? cnt(k2, 'dot') : null, k3 ? cnt(k3, 'line') : null, k4 ? cnt(k4, 'cross', 'crosses') : null].filter(Boolean);
            return { text: 'Done: I put in ' + parts.join(', ') + ' from the last hint.', show() { flash(todo.map((x) => x[0]), todoE.map((x) => x[0])); } };
          }
        }
        const r = L.yjStep(P, cellVals(), edgeVals(), 5, sol);
        if (!r) {
          const ev = evaluate();
          return ev.solved ? 'It is solved already!' : 'Everything follows from what is on the board — ' + (ev.msg || 'look over your marks.');
        }
        const set = r.set.map(([i, x]) => [i, x === 1 ? 1 : 2]), eset = r.eset.map(([x, y]) => [x, y === 1 ? 1 : 2]);
        pending = { set, eset };
        const k = set.length + eset.length;
        return { text: r.text + ' *(Ask again and I will fill ' + (k === 1 ? 'it' : 'them') + ' in.)*', show() { showHint({ set, eset, focus: r.focus, zone: r.zone }); } };
      },
      solve() {
        if (busy) return;
        clearHint();
        pending = null;
        busy = true;
        // shading first, then the loop drawn round
        for (const i of P.cells) st[i] = sol.v[i] === 1 ? 1 : 0;
        es.fill(0);
        refresh();
        const order = loopOrder();
        let k = 0;
        const stop = C.tween(C.anim(1300), (t) => {
          const upto = Math.round(t * order.length);
          let ch = false;
          while (k < upto) { es[order[k++]] = 1; ch = true; }
          if (ch) refresh();
        }, () => {
          while (k < order.length) es[order[k++]] = 1;
          busy = false;
          refresh();
          ctx.changed('solve');
        }, 'linear');
        T.stopTween = stop;
      },
      explain() { return logicTour(d); },
      getState() { return { s: Array.from(st).join(''), e: Array.from(es).join('') }; },
      setState(o) {
        if (!o || typeof o.s !== 'string' || o.s.length !== N) return;
        if (T.stopTween) { T.stopTween(); T.stopTween = null; busy = false; }
        for (let i = 0; i < N; i++) st[i] = P.isClue[i] ? 0 : +o.s[i] || 0;
        if (typeof o.e === 'string' && o.e.length === E) for (let x = 0; x < E; x++) es[x] = +o.e[x] || 0;
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
        if (ev.ctrlKey || ev.metaKey || ev.altKey || busy) return false;
        const dirs = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3 };
        if (dirs[k] != null) {
          if (!cur.on) { cur.on = true; drawCursor(); return true; }
          const q = dirs[k], i = cur.r * w + cur.c;
          const r2 = cur.r + [-1, 0, 1, 0][q], c2 = cur.c + [0, 1, 0, -1][q];
          if (r2 < 0 || r2 >= h || c2 < 0 || c2 >= w) return true;
          if (ev.shiftKey) {
            const x = P.cellE[i * 4 + q];
            if (x >= 0 && setEdge(x, es[x] === 1 ? 0 : 1)) { ctx.sfx('tap'); refresh(); ctx.changed('marks'); }
          }
          cur.r = r2; cur.c = c2;
          drawCursor();
          return true;
        }
        if (!cur.on) return false;
        const i = cur.r * w + cur.c;
        const set = (x) => { if (setCell(i, x)) { ctx.sfx('tap'); refresh(); ctx.changed('marks'); } };
        if (k === 'Enter') { set(st[i] === 1 ? 0 : 1); return true; }
        if (k === ' ' || k === '.') { set(st[i] === 2 ? 0 : 2); return true; }
        if (k === 'Backspace' || k === 'Delete') { set(0); return true; }
        if (k === 'Escape') { cur.on = false; drawCursor(); }
        return false;
      },
      destroy() { T.clear(); if (T.stopTween) T.stopTween(); wb.svg.removeEventListener('pointerleave', onLeave); }
    };
  }
  const yjOther = (P, x, i) => (P.ea[x] === i ? P.eb[x] : P.ea[x]);

  /* =====================================================================
   *  NUMBER PATH BOARD
   *  val: the player's numbers (0 empty); the printed ones are fixed
   * ===================================================================== */

  function mountPath(ctx, p) {
    const d = p.data, L = LG(), wb = ctx.wb, s = ctx.s, hh = ctx.h;
    const P = L.npPrep(d), w = P.w, h = P.h, N = P.N, n = P.n;
    const given = P.given, sol = P.sol;
    const val = new Int16Array(N);
    const T = timersFor();
    let won = false, pending = null, shown = null, drag = null, sel = -1, hovI = -1, busy = false;
    let typed = null;           // { cell, str, t } digits typed in a row

    ctx.setGoal(p.goal || goalFor(d));
    wb.setBounds({ x0: -S * 0.3, y0: -S * 0.3, x1: w * S + S * 0.3, y1: h * S + S * 0.3 }, 0.04);
    const cx = (i) => (i % w) * S + S / 2, cy = (i) => Math.floor(i / w) * S + S / 2;
    const grid = () => { const g = new Int16Array(N); for (let i = 0; i < N; i++) g[i] = given[i] || val[i]; return g; };

    const G = s('g', { class: 'p3 p3-numpath' }, wb.layer('board'));
    const bgG = s('g', null, G), cellG = s('g', null, G), selG = s('g', { class: 'p3-nohit' }, G);
    const snakeG = s('g', { class: 'p3-nohit p3-snake' }, G), lineG = s('g', { class: 'p3-nohit' }, G), textG = s('g', { class: 'p3-nohit' }, G);
    const topG = s('g', { class: 'p3-nohit' }, wb.layer('top'));
    const hintG = s('g', null, topG);
    const hovEl = s('rect', { width: S - 4, height: S - 4, rx: 7, class: 'p3-hov' }, topG);
    hovEl.style.display = 'none';

    // the board follows the shape: a soft plate under the cells
    for (const i of P.cells) s('rect', { x: cx(i) - S / 2 - 4, y: cy(i) - S / 2 - 4, width: S + 8, height: S + 8, rx: 10, class: 'p3-plate' }, bgG);
    for (const i of P.cells) s('rect', { x: cx(i) - S / 2 + 1.5, y: cy(i) - S / 2 + 1.5, width: S - 3, height: S - 3, rx: 7, class: 'p3-ncell' + (given[i] ? ' given' : ''), 'data-key': 'c' + i }, cellG);
    // the ends of the chain, ringed
    const ends = [];
    for (const i of P.cells) if (given[i] === 1 || given[i] === n) ends.push(s('circle', { cx: cx(i), cy: cy(i), r: S * 0.36, class: 'p3-endring' }, lineG));
    const selEl = s('rect', { width: S - 3, height: S - 3, rx: 7, class: 'p3-sel' }, selG);
    selEl.style.display = 'none';
    const fs = n > 99 ? 14.5 : n > 9 ? 17.5 : 20;
    const numEls = [];
    for (let i = 0; i < N; i++) numEls.push(P.on[i] ? s('text', { x: cx(i), y: cy(i) + 0.5, class: 'p3-num' + (given[i] ? ' given' : ''), 'font-size': fs }, textG) : null);
    for (const i of P.cells) if (given[i]) numEls[i].textContent = String(given[i]);
    const nsig = new Array(N).fill('');

    /* ---------- what the numbers say ---------- */

    let A = null;
    function analyse() {
      const g = grid(), pos = new Int32Array(n + 2).fill(-1), dup = new Uint8Array(N), gap = new Uint8Array(N);
      const where = {};
      for (const i of P.cells) { const k = g[i]; if (k > 0 && k <= n) (where[k] = where[k] || []).push(i); }
      for (const k in where) { if (where[k].length > 1) where[k].forEach((i) => { dup[i] = 1; }); pos[k] = where[k][0]; }
      const links = [];
      for (let k = 1; k < n; k++) {
        if (!where[k] || !where[k + 1] || where[k].length > 1 || where[k + 1].length > 1) continue;
        const a = pos[k], b = pos[k + 1];
        if (P.adjM[a * N + b]) links.push([k, a, b]); else { gap[a] = 1; gap[b] = 1; }
      }
      let placed = 0;
      for (let k = 1; k <= n; k++) if (where[k]) placed++;
      const missing = [];
      for (let k = 1; k <= n; k++) if (!where[k]) missing.push(k);
      A = { g, dup, gap, links, placed, missing };
      return A;
    }
    function evaluate() {
      const a = A || analyse();
      if (L.npValid(P, a.g)) return { solved: true, msg: solvedMsg('numpath', p) };
      if (a.dup.some((x) => x)) return { solved: false, msg: 'A number is written twice (in red).' };
      if (a.gap.some((x) => x)) return { solved: false, msg: 'Two numbers in a row do not touch (in red).' };
      return { solved: false, msg: C.plural(n - a.placed, 'number is', 'numbers are') + ' still missing.' };
    }

    /* ---------- drawing ---------- */

    const hue = (k) => 205 + 130 * (k - 1) / Math.max(1, n - 1);
    const missEl = hh('div.p3-missing');
    function refresh() {
      const a = analyse();
      while (snakeG.firstChild) snakeG.removeChild(snakeG.firstChild);
      a.links.forEach(([k, i, j]) => s('line', { x1: cx(i), y1: cy(i), x2: cx(j), y2: cy(j), class: 'p3-link', style: 'stroke: hsl(' + hue(k).toFixed(0) + ' 70% 58%)' }, snakeG));
      for (const i of P.cells) {
        const k = a.g[i];
        const cls = 'p3-num' + (given[i] ? ' given' : ' user') + (a.dup[i] || a.gap[i] ? ' err' : '');
        const key = k + ':' + cls;
        if (nsig[i] === key) continue;
        nsig[i] = key;
        numEls[i].textContent = k ? String(k) : '';
        numEls[i].setAttribute('class', cls);
      }
      // the missing numbers, in runs
      const miss = a.missing;
      missEl.textContent = '';
      if (!miss.length) missEl.appendChild(hh('span.p3-missok', 'Every number is on the board.'));
      else {
        const runs = [];
        for (let t = 0; t < miss.length;) { let u = t; while (u + 1 < miss.length && miss[u + 1] === miss[u] + 1) u++; runs.push(u > t ? miss[t] + '–' + miss[u] : String(miss[t])); t = u + 1; }
        missEl.appendChild(hh('b', 'Missing: '));
        missEl.appendChild(document.createTextNode(runs.join(', ')));
      }
      ctx.stat('Placed', a.placed + ' of ' + n);
      drawSel();
      if (shown) pruneHint();
      if (won && !evaluate().solved) setWon(false);
    }
    function drawSel() {
      selEl.style.display = sel >= 0 ? '' : 'none';
      if (sel >= 0) { selEl.setAttribute('x', cx(sel) - S / 2 + 1.5); selEl.setAttribute('y', cy(sel) - S / 2 + 1.5); }
    }
    function setWon(on, animate) {
      if (on === won) return;
      won = on;
      G.classList.toggle('won', on);
      G.classList.toggle('still', on && !animate);
    }

    /* ---------- hints ---------- */

    function clearHint() { shown = null; while (hintG.firstChild) hintG.removeChild(hintG.firstChild); }
    const wrongAt = (i) => val[i] > 0 && val[i] !== sol[i];
    function showHint(st) {
      clearHint();
      shown = { set: (st.set || []).slice(), wrong: (st.wrong || []).slice(), els: {} };
      (st.zone || []).forEach((i) => s('rect', { x: cx(i) - S / 2 + 3, y: cy(i) - S / 2 + 3, width: S - 6, height: S - 6, rx: 6, class: 'p3-hzone' }, hintG));
      (st.focus || []).forEach((i) => s('circle', { cx: cx(i), cy: cy(i), r: S * 0.42, class: 'p3-hring' }, hintG));
      shown.wrong.forEach((i) => { shown.els['w' + i] = s('rect', { x: cx(i) - S / 2 + 2.5, y: cy(i) - S / 2 + 2.5, width: S - 5, height: S - 5, rx: 7, class: 'p3-hwrong' }, hintG); });
      shown.set.forEach(([i, k]) => {
        const g = s('g', { class: 'p3-ghost' }, hintG);
        s('rect', { x: cx(i) - S / 2 + 2.5, y: cy(i) - S / 2 + 2.5, width: S - 5, height: S - 5, rx: 7, class: 'p3-hcell' }, g);
        s('text', { x: cx(i), y: cy(i) + 0.5, class: 'p3-num user', 'font-size': fs, text: String(k) }, g);
        shown.els[i] = g;
      });
    }
    function pruneHint() {
      shown.set = shown.set.filter(([i, k]) => { if (val[i] !== k) return true; if (shown.els[i]) shown.els[i].remove(); return false; });
      shown.wrong = shown.wrong.filter((i) => { if (wrongAt(i)) return true; if (shown.els['w' + i]) shown.els['w' + i].remove(); return false; });
      if (!shown.set.length && !shown.wrong.length) clearHint();
    }
    function flash(cells) {
      const els = cells.map((i) => s('rect', { x: cx(i) - S / 2 + 1, y: cy(i) - S / 2 + 1, width: S - 2, height: S - 2, rx: 7, class: 'p3-flash' }, hintG));
      T.later(() => els.forEach((e) => e.remove()), 1400);
    }

    /* ---------- gestures ---------- */

    function cellAt(pt) {
      const c = Math.floor(pt[0] / S), r = Math.floor(pt[1] / S);
      if (c < 0 || c >= w || r < 0 || r >= h) return -1;
      const i = r * w + c;
      return P.on[i] ? i : -1;
    }
    const placedAt = (k) => { for (const i of P.cells) if ((given[i] || val[i]) === k) return i; return -1; };
    function write(i, k) {
      if (given[i] || val[i] === k) return false;
      val[i] = k;
      return true;
    }
    wb.handlers.board = {
      down(pt, ev) {
        if (busy) return false;
        const i = cellAt(pt);
        const sk = strip && strip.at(pt);
        if (sk != null) { if (sk === 'clear') erase(); else typeDigit(sk); return true; }
        if (i < 0) { if (sel >= 0) { sel = -1; drawSel(); } return false; }
        typed = null;
        const g = grid(), right = ev.button === 2, touch = ev.pointerType === 'touch';
        if (right) {
          if (val[i]) { val[i] = 0; ctx.sfx('tap'); refresh(); ctx.changed('numbers'); }
          return true;
        }
        sel = i;
        drawSel();
        const k = g[i];
        let dir = 0;
        if (k) {
          if (k < n && placedAt(k + 1) < 0) dir = 1;
          else if (k > 1 && placedAt(k - 1) < 0) dir = -1;
          else if (k < n) dir = 1;
        }
        const dg = drag = { a: i, k, dir, path: [i], wrote: [], orig: Int16Array.from(val), p0: pt, moved: false, done: false };
        if (touch) {
          T.later(() => {
            if (drag !== dg || dg.moved || dg.wrote.length) return;
            if (val[i]) { buzz(); val[i] = 0; refresh(); dg.done = true; }
          }, 480);
        }
        return true;
      },
      move(pt) {
        if (!drag || drag.done) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) > S * 0.25) drag.moved = true;
        if (!drag.dir) return;
        const j = cellAt(pt);
        if (j < 0 || Math.hypot(pt[0] - cx(j), pt[1] - cy(j)) > S * 0.47) return;
        const path = drag.path, head = path[path.length - 1];
        if (j === head) return;
        // back over the last step: take its number off again
        if (path.length >= 2 && j === path[path.length - 2]) {
          path.pop();
          if (drag.wrote.length && drag.wrote[drag.wrote.length - 1] === head) { drag.wrote.pop(); val[head] = drag.orig[head]; }
          sel = j;
          refresh();
          return;
        }
        if (!P.adjM[head * N + j] || path.includes(j)) return;
        const g = grid(), next = g[head] + drag.dir;
        if (next < 1 || next > n) return;
        if (g[j] === next) { path.push(j); sel = j; drawSel(); return; }
        if (g[j] || placedAt(next) >= 0) return;
        write(j, next);
        drag.wrote.push(j);
        path.push(j);
        sel = j;
        ctx.sfx('tap');
        refresh();
      },
      up() {
        if (!drag) return;
        const changed = val.some((x, i) => x !== drag.orig[i]);
        drag = null;
        if (changed) ctx.changed('numbers');
      },
      hover(pt) { hover(pt); }
    };
    smoothDrag(wb, () => drag);
    function hover(pt) {
      const i = pt && !drag ? cellAt(pt) : -1;
      if (i === hovI) return;
      hovI = i;
      hovEl.style.display = i < 0 ? 'none' : '';
      if (i >= 0) { hovEl.setAttribute('x', cx(i) - S / 2 + 2); hovEl.setAttribute('y', cy(i) - S / 2 + 2); }
    }
    const onLeave = () => hover(null);
    wb.svg.addEventListener('pointerleave', onLeave);

    // typing: digits typed quickly one after another make one number
    function typeDigit(dg) {
      if (busy) return;
      if (sel < 0) { ctx.toast('Pick a cell first: click one, or use the arrow keys.'); return; }
      if (given[sel]) { ctx.say('That number is printed on the puzzle, so it stays.'); return; }
      const t = Date.now();
      let str = typed && typed.cell === sel && t - typed.t < 1300 ? typed.str + dg : String(dg);
      if (+str > n) str = String(dg);
      if (str === '0') { typed = null; return; }
      typed = { cell: sel, str, t };
      if (write(sel, +str)) { ctx.sfx('tap'); refresh(); ctx.changed('numbers'); }
    }
    function erase() {
      if (busy || sel < 0 || given[sel] || !val[sel]) return;
      val[sel] = 0;
      typed = null;
      refresh();
      ctx.changed('numbers');
    }
    const pad = C.numberPad({ keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'clear'], cols: 6, onKey(k) { if (k === 'clear') erase(); else typeDigit(k); } });
    // on a narrow screen the panel sits below the stage: a row of keys right under the grid
    const narrow = !!(root.matchMedia && root.matchMedia('(max-width: 980px)').matches);
    const strip = narrow ? (() => {
      const W = w * S, gap = 5, cols = 6, kw = (W - gap * (cols - 1)) / cols, kh = Math.min(46, kw * 0.85);
      const y0 = h * S + 14;
      const gS = s('g', { class: 'p3-strip' }, G);
      const keys = [];
      [1, 2, 3, 4, 5, 'clear', 6, 7, 8, 9, 0].forEach((k, t) => {
        const row = t < 6 ? 0 : 1, col = t < 6 ? t : t - 6 + 0.5;
        const x = col * (kw + gap), y = y0 + row * (kh + gap);
        const g = s('g', { class: 'p3-skey' }, gS);
        s('rect', { x, y, width: kw, height: kh, rx: 8 }, g);
        s('text', { x: x + kw / 2, y: y + kh / 2 + 0.5, 'font-size': Math.min(22, kh * 0.5), text: k === 'clear' ? '⌫' : String(k) }, g);
        keys.push({ k, x, y });
      });
      wb.setBounds({ x0: -S * 0.3, y0: -S * 0.3 - 40, x1: w * S + S * 0.3, y1: y0 + 2 * kh + gap + 8 }, 0.03);
      return { at(pt) { const q = keys.find((z) => pt[0] >= z.x && pt[0] <= z.x + kw && pt[1] >= z.y && pt[1] <= z.y + kh); return q ? q.k : null; } };
    })() : null;
    ctx.panel.appendChild(hh('div.p3-panel', missEl, pad, hh('div.p3-tip', 'Drag from a number into the cells beside it to write the next numbers. Or pick a cell and type (two digits quickly for 12); right-click rubs a number out.')));

    refresh();

    return {
      noMoves: true,
      check() {
        const r = evaluate();
        if (!r.solved) { if (won) setWon(false); return r; }
        if (!won) { setWon(true, true); clearHint(); }
        return r;
      },
      hint() {
        if (busy) return null;
        const wrong = P.cells.filter(wrongAt);
        if (wrong.length) {
          if (pending && pending.fix) {
            wrong.forEach((i) => { val[i] = 0; });
            pending = null;
            clearHint();
            refresh();
            ctx.changed('hint');
            return 'I rubbed out ' + (wrong.length === 1 ? 'the wrong number' : 'the ' + wrong.length + ' wrong numbers') + '. Carry on from here.';
          }
          pending = { fix: true };
          return { text: (wrong.length === 1 ? 'One of your numbers is wrong' : wrong.length + ' of your numbers are wrong') + ' (outlined in red). Look again — or ask for another hint and I will rub ' + (wrong.length === 1 ? 'it' : 'them') + ' out.', show() { showHint({ wrong }); } };
        }
        if (pending && pending.set) {
          const todo = pending.set.filter(([i, k]) => val[i] !== k && !given[i]);
          pending = null;
          if (todo.length) {
            todo.forEach(([i, k]) => { val[i] = k; });
            sel = todo[0][0];
            clearHint();
            refresh();
            ctx.changed('hint');
            return { text: 'Done: I wrote in **' + todo.map((x) => x[1]).join('**, **') + '**.', show() { flash(todo.map((x) => x[0])); } };
          }
        }
        const r = L.npStep(P, grid(), 5, sol);
        if (!r) {
          const ev = evaluate();
          return ev.solved ? 'It is solved already!' : 'Look over the board: ' + (ev.msg || '');
        }
        pending = { set: r.set };
        return { text: r.text + ' *(Ask again and I will write it in.)*', show() { showHint(r); } };
      },
      solve() {
        if (busy) return;
        clearHint();
        pending = null;
        busy = true;
        for (const i of P.cells) if (val[i] && val[i] !== sol[i]) val[i] = 0;
        const order = [];
        for (let k = 1; k <= n; k++) for (const i of P.cells) if (sol[i] === k && !given[i] && val[i] !== k) order.push(i);
        let k = 0;
        refresh();
        const stop = C.tween(C.anim(Math.min(2400, 300 + order.length * 30)), (t) => {
          const upto = Math.round(t * order.length);
          let ch = false;
          while (k < upto) { const i = order[k++]; val[i] = sol[i]; ch = true; }
          if (ch) refresh();
        }, () => {
          while (k < order.length) { const i = order[k++]; val[i] = sol[i]; }
          busy = false;
          refresh();
          ctx.changed('solve');
        }, 'linear');
        T.stopTween = stop;
      },
      explain() { return logicTour(d); },
      getState() { return { v: Array.from(val) }; },
      setState(o) {
        if (!o || !Array.isArray(o.v) || o.v.length !== N) return;
        if (T.stopTween) { T.stopTween(); T.stopTween = null; busy = false; }
        for (let i = 0; i < N; i++) val[i] = given[i] || !P.on[i] ? 0 : Math.max(0, Math.min(n, o.v[i] | 0));
        drag = null;
        typed = null;
        clearHint();
        refresh();
        const solved = evaluate().solved;
        if (solved !== won) setWon(solved, false);
      },
      reset() { pending = null; typed = null; clearHint(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey || busy) return false;
        const k = ev.key;
        const m = /^(?:Digit|Numpad)([0-9])$/.exec(ev.code || '');
        const dg = m ? +m[1] : /^[0-9]$/.test(k) ? +k : -1;
        if (dg >= 0) { typeDigit(dg); return true; }
        if (k === 'Backspace' || k === 'Delete') { erase(); return true; }
        const dirs = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
        if (dirs[k]) {
          typed = null;
          if (sel < 0) { sel = P.cells[Math.floor(P.cells.length / 2)]; drawSel(); return true; }
          let r = Math.floor(sel / w), c = sel % w;
          for (let t = 0; t < Math.max(w, h); t++) {
            r += dirs[k][0]; c += dirs[k][1];
            if (r < 0 || r >= h || c < 0 || c >= w) break;
            if (P.on[r * w + c]) { sel = r * w + c; break; }
          }
          drawSel();
          return true;
        }
        if (k === 'Escape' && sel >= 0) { sel = -1; drawSel(); return false; }
        return false;
      },
      destroy() { T.clear(); if (T.stopTween) T.stopTween(); wb.svg.removeEventListener('pointerleave', onLeave); }
    };
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'pencil3',
    get name() { return KINDS[currentKind()] || 'Pencil puzzles'; },
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/pencil3-logic.js'],
    noMoves: true,
    get about() { return ABOUT[currentKind()] || ABOUT_ALL; },
    verify,
    generate,
    generates: ['number-path', 'norinori', 'lits', 'heyawake', 'yajilin'],
    mount(ctx, p) {
      const k = p.data.kind;
      if (k === 'numpath') return mountPath(ctx, p);
      if (k === 'yajilin') return mountYaji(ctx, p);
      return mountShade(ctx, p);
    },
    thumb,
    textFor,
    goalFor,
    kinds: ABOUT
  });

  C.css('pencil3', `
    .p3-nohit, .p3 .p3-nohit * { pointer-events: none; }
    .p3-boardbg { fill: var(--board); stroke: var(--line); stroke-width: 1; }
    .p3-cell { fill: var(--cell); }
    .p3-tint { transition: fill-opacity .3s; }
    .p3-tint.done { fill-opacity: .35; }
    .p3-tint.bad { fill: var(--red) !important; fill-opacity: .22; }
    .p3-grid { fill: none; stroke: var(--grid-2); stroke-width: 1; }
    .p3-region { fill: none; stroke: var(--ink); stroke-width: 3.2; stroke-linecap: square; }
    .p3-frame { fill: none; stroke: var(--ink); stroke-width: 3.2; }
    .p3-fill { fill: var(--ink); opacity: .92; transition: fill .25s; }
    .p3-fill.err { fill: var(--red); opacity: 1; }
    .p3-fill.domino { opacity: .92; }
    .p3-pip { stroke: var(--cell); stroke-width: 2; stroke-linecap: round; opacity: .55; fill: none; }
    .p3-dot { fill: var(--muted); }
    .p3-dot.implied { fill: var(--faint); opacity: .8; }
    .p3-opt { color: var(--text); font-size: 13px; display: flex; align-items: center; gap: 6px; cursor: pointer; margin-top: 4px; }
    .p3-hov { fill: var(--accent); opacity: .08; }
    .p3-cursor { fill: none; stroke: var(--accent); stroke-width: 3; }
    .p3-rnum { font: 700 14px "Segoe UI", system-ui, sans-serif; fill: var(--ink); transition: opacity .2s, fill .2s; }
    .p3-rnum.done { opacity: .35; }
    .p3-rnum.bad { fill: var(--red); opacity: 1; }
    .p3-rnum.inv { fill: var(--cell); }
    .p3-rnum.inv.bad { fill: #ffb3b3; }
    .p3-cut { fill: var(--red); opacity: .16; }
    .p3-segbad { stroke: var(--red); stroke-width: 4; stroke-linecap: round; opacity: .75; }
    .p3-segflash { stroke: var(--red); stroke-width: 5; stroke-linecap: round; opacity: 0; animation: p3flash 1.8s ease-out; }
    /* yajilin */
    .p3-cluecell { fill: #3a3f58; }
    [data-theme="light"] .p3-cluecell { fill: #4a506e; }
    .p3-yclue { font: 700 15px "Segoe UI", system-ui, sans-serif; fill: #fff; text-anchor: middle; dominant-baseline: central; transition: opacity .2s; }
    .p3-yclue .p3-yarrow { font-weight: 600; font-size: 13px; }
    .p3-yclue.done { opacity: .45; }
    .p3-yclue.bad { fill: #ff8a8a; }
    .p3-line { stroke: var(--accent); stroke-width: 5.5; stroke-linecap: round; }
    .p3-line.err { stroke: var(--red); }
    .p3-cross { stroke: var(--muted); stroke-width: 2; stroke-linecap: round; fill: none; }
    .p3-errnode { fill: var(--red); opacity: .35; }
    .p3-hovedge { stroke: var(--accent); stroke-width: 7; stroke-linecap: round; opacity: .18; }
    .p3-gline { stroke: var(--gold); stroke-width: 5.5; stroke-linecap: round; opacity: .7; animation: p3pulse 1.3s ease-in-out infinite; }
    .p3-gcross { stroke: var(--gold); stroke-width: 2.6; stroke-linecap: round; fill: none; animation: p3pulse 1.3s ease-in-out infinite; }
    .p3-hwrongline { stroke: var(--red); stroke-width: 9; stroke-linecap: round; opacity: .45; }
    .p3-flashline { stroke: var(--gold); stroke-width: 9; stroke-linecap: round; opacity: 0; animation: p3flash 1.3s ease-out; }
    .p3-yajilin.won:not(.still) .p3-lines { animation: p3glow 1.2s ease-in-out 2; }
    /* number path */
    .p3-plate { fill: var(--board-2); }
    .p3-ncell { fill: var(--cell); stroke: var(--grid-2); stroke-width: 1; }
    .p3-ncell.given { fill: var(--board-2); }
    .p3-endring { fill: none; stroke: var(--gold); stroke-width: 2; opacity: .8; }
    .p3-sel { fill: var(--accent); fill-opacity: .2; stroke: var(--accent); stroke-width: 2.5; }
    .p3-link { stroke-width: 9; stroke-linecap: round; opacity: .38; }
    .p3-num { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 600; text-anchor: middle; dominant-baseline: central; fill: #7f8cff; }
    [data-theme="light"] .p3-num { fill: #3a4bd8; }
    .p3-num.given { font-weight: 800; fill: var(--ink); }
    .p3-num.err { fill: var(--red); }
    .p3-hring { fill: none; stroke: var(--gold); stroke-width: 2.5; stroke-dasharray: 4 3; }
    .p3-numpath.won:not(.still) .p3-snake { animation: p3glow 1.2s ease-in-out 2; }
    .p3-skey { cursor: pointer; }
    .p3-skey rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; }
    .p3-skey text { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--text); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .p3-missing { font-size: 13px; color: var(--text); line-height: 1.45; }
    .p3-missing b { color: var(--muted); font-weight: 600; }
    .p3-missok { color: var(--green); font-weight: 600; }
    /* hints */
    .p3-hzone { fill: var(--gold); opacity: .17; }
    .p3-hzone2 { fill: none; stroke: var(--gold); stroke-width: 2.2; stroke-dasharray: 5 4; }
    .p3-hwrong { fill: none; stroke: var(--red); stroke-width: 3.2; }
    .p3-hcell { fill: none; stroke: var(--gold); stroke-width: 2.5; }
    .p3-ghost { opacity: .6; animation: p3pulse 1.3s ease-in-out infinite; }
    .p3-flash { fill: var(--gold); opacity: 0; animation: p3flash 1.3s ease-out; }
    @keyframes p3pulse { 50% { opacity: .25; } }
    @keyframes p3flash { 15% { opacity: .45; } 100% { opacity: 0; } }
    @keyframes p3glow { 50% { opacity: .45; } }
    /* the finished look */
    .p3.won:not(.still) .p3-fills > * { transform-box: fill-box; transform-origin: center; animation: p3pop .6s ease-out; }
    @keyframes p3pop { 40% { transform: scale(1.12); } }
    /* the side panel */
    .p3-panel { display: grid; gap: 8px; margin: 10px 0; }
    .p3-seg { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
    .p3-segl { color: var(--muted); font-size: 13px; margin-right: 2px; }
    .p3-segb { border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: 8px; padding: 5px 12px; font: 600 13px "Segoe UI", system-ui, sans-serif; cursor: pointer; }
    .p3-segb.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .p3-tip { color: var(--muted); font-size: 12.5px; }
    .p3-legend { display: flex; gap: 12px; align-items: flex-end; }
    .p3-legi { display: inline-flex; align-items: flex-end; gap: 3px; font: 700 13px "Segoe UI", system-ui, sans-serif; color: var(--muted); }
    @media (prefers-reduced-motion: reduce) { .p3-ghost, .p3 .p3-fills > *, .p3-lines, .p3-snake { animation: none !important; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
