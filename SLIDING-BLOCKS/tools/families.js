/*  The puzzle families, as random samplers.
 *
 *  Each sampler draws a random position, lets the solver explore everything
 *  that can be reached from it, and keeps the position that lies farthest
 *  from the goal: that is the puzzle, and the distance is its par. Returns
 *  null when a draw is no good (no goal reachable, too large to search).
 *
 *  A candidate is { fam, line, par, size, kind } where size is the number of
 *  positions the solver saw and kind names the board it was drawn on.
 */
const SB = require('../sb-core.js');

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const int = (r, lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
const pick = (r, list) => list[Math.floor(r() * list.length)];
function weighted(r, table) {
  let sum = 0;
  for (const [, w] of table) sum += w;
  let x = r() * sum;
  for (const [v, w] of table) if ((x -= w) < 0) return v;
  return table[table.length - 1][0];
}

const LETTERS = 'BCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// A grid of characters, row-major.
function blank(w, h, c) { return { w, h, g: new Array(w * h).fill(c || '.') }; }
const rowsOf = (grid) => {
  const rows = [];
  for (let y = 0; y < grid.h; y++) rows.push(grid.g.slice(y * grid.w, (y + 1) * grid.w).join(''));
  return rows;
};

// Pieces renamed in reading order (A, the goal piece, keeps its name).
function reletter(rows) {
  const map = new Map([['A', 'A'], ['#', '#'], ['.', '.']]);
  let k = 0;
  return rows.map((row) => [...row].map((c) => {
    if (!map.has(c)) map.set(c, LETTERS[k++]);
    return map.get(c);
  }).join(''));
}

// The rows of the board with the pieces where state `st` puts them.
function stateRows(model, st) {
  const { puz, W, H } = model;
  const g = Array.from(puz.wall, (w) => (w ? '#' : '.'));
  model.order.forEach((pi, s) => {
    for (const o of model.slots[s].offs) g[st[s] + o] = puz.pieces[pi].ch;
  });
  const rows = [];
  for (let y = 0; y < H; y++) rows.push(g.slice(y * W, (y + 1) * W).join(''));
  return rows;
}

function startOf(model) {
  const p = model.puz;
  return model.fromPieces(p.pieces.map((q) => q.y * p.w + q.x));
}

// Explore from the drawn position, then find the farthest from the goal.
// Returns { key, par, size } or null.
// With `extras`, also that many positions at random lesser distances, as
// [key, distance]: easier puzzles from the same board.
function farthest(model, r, limit, extras) {
  const comp = SB.component(model, startOf(model), limit);
  if (!comp) return null;
  const dist = SB.distances(model, comp);
  if (!dist.size) return null;
  let best = -1, keys = [];
  for (const [k, d] of dist) {
    if (d > best) { best = d; keys = [k]; } else if (d === best) keys.push(k);
  }
  const extra = [];
  if (extras && best > 2) {
    const want = [];
    for (let i = 0; i < extras; i++) want.push(int(r, 1, best - 1));
    const found = want.map(() => []);
    for (const [k, d] of dist) {
      want.forEach((w, i) => { if (d === w && found[i].length < 50) found[i].push(k); });
    }
    want.forEach((w, i) => { if (found[i].length) extra.push([pick(r, found[i]), w]); });
  }
  return { key: pick(r, keys), par: best, size: comp.length, extra };
}

const line = (fam, name, rows, goal, par, opts) =>
  [fam, name || '', rows.join('/'), goal, par, opts || ''].join('|');

/* ---------- Gridlock: cars and trucks that run along their length ---------- */

const GRIDLOCK_BOARDS = [
  { kind: 'g5', w: 5, h: 5, row: 2, cars: [3, 8], trucks: 0.15, walls: 0.0, weight: 1 },
  { kind: 'g6', w: 6, h: 6, row: 2, cars: [6, 13], trucks: 0.28, walls: 0.12, weight: 6 },
  { kind: 'g7', w: 7, h: 7, row: 3, cars: [9, 17], trucks: 0.3, walls: 0.2, weight: 1 }
];

function sampleGridlock(r, board) {
  const b = board || weighted(r, GRIDLOCK_BOARDS.map((x) => [x, x.weight]));
  const { w: W, h: H, row } = b;
  const grid = blank(W, H);
  const put = (x, y, len, vert, c) => {
    for (let i = 0; i < len; i++) grid.g[(y + (vert ? i : 0)) * W + x + (vert ? 0 : i)] = c;
  };
  const free = (x, y, len, vert) => {
    for (let i = 0; i < len; i++) {
      const xx = x + (vert ? 0 : i), yy = y + (vert ? i : 0);
      if (xx >= W || yy >= H || grid.g[yy * W + xx] !== '.') return false;
    }
    return true;
  };
  const hx = int(r, 0, W - 3);
  put(hx, row, 2, false, 'A');

  if (r() < b.walls) {
    for (let n = int(r, 1, 2); n > 0; n--) {
      const x = int(r, 0, W - 1), y = int(r, 0, H - 1);
      if (y === row) continue; // a wall in the exit lane would shut it for good
      if (grid.g[y * W + x] === '.') grid.g[y * W + x] = '#';
    }
  }

  const want = int(r, b.cars[0], b.cars[1]);
  let k = 0;
  for (let tries = 0; k < want && tries < 200; tries++) {
    const len = r() < b.trucks ? 3 : 2;
    const vert = r() < 0.55;
    const x = int(r, 0, vert ? W - 1 : W - len), y = int(r, 0, vert ? H - len : H - 1);
    // A car lying in the exit lane can never leave it.
    if (!vert && y === row) continue;
    if (!free(x, y, len, vert)) continue;
    put(x, y, len, vert, LETTERS[k++]);
  }

  const text = line('G', '', rowsOf(grid), `A@${W - 2},${row}`, 0, `x:r${row}`);
  const model = SB.Model(SB.parse(text));
  const far = farthest(model, r, 400000);
  if (!far || far.par < 1) return null;
  const rows = reletter(stateRows(model, model.unkey(far.key)));
  return { fam: 'G', kind: b.kind, par: far.par, size: far.size, line: line('G', '', rows, `A@${W - 2},${row}`, far.par, `x:r${row}`) };
}

/* ---------- Klotski: rectangles in a box, the big one out through the gate ---------- */

const KLOTSKI_BOARDS = [
  { kind: 'k44', w: 4, h: 4, empties: 2, weight: 1 },
  { kind: 'k45', w: 4, h: 5, empties: 2, weight: 6 },
  { kind: 'k54', w: 5, h: 4, empties: 2, weight: 1.5 },
  { kind: 'k46', w: 4, h: 6, empties: 2, weight: 1.5 },
  { kind: 'k55', w: 5, h: 5, empties: 3, weight: 1.5, long: 0.08 },
  { kind: 'k56', w: 5, h: 6, empties: 3, weight: 0.8, long: 0.1 }
];

// Fills every uncovered cell of `grid` (null there) with rectangles.
function tileRects(r, grid, mix) {
  const { w: W, h: H, g } = grid;
  let k = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (g[y * W + x] !== null) continue;
      const open = (xx, yy) => xx < W && yy < H && g[yy * W + xx] === null;
      const options = [[[1, 1], mix.single]];
      if (open(x + 1, y)) options.push([[2, 1], mix.wide]);
      if (open(x, y + 1)) options.push([[1, 2], mix.tall]);
      if (mix.long && open(x + 1, y) && open(x + 2, y)) options.push([[3, 1], mix.long]);
      if (mix.long && open(x, y + 1) && open(x, y + 2)) options.push([[1, 3], mix.long]);
      if (mix.square && open(x + 1, y) && open(x, y + 1) && open(x + 1, y + 1)) options.push([[2, 2], mix.square]);
      const [pw, ph] = weighted(r, options);
      const c = LETTERS[k++];
      for (let j = 0; j < ph; j++) for (let i = 0; i < pw; i++) g[(y + j) * W + x + i] = c;
    }
  }
}

function sampleKlotski(r, board) {
  const b = board || weighted(r, KLOTSKI_BOARDS.map((x) => [x, x.weight]));
  const { w: W, h: H } = b;
  const grid = { w: W, h: H, g: new Array(W * H).fill(null) };
  const hx = int(r, 0, W - 2), hy = int(r, 0, H - 2);
  for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) grid.g[(hy + j) * W + hx + i] = 'A';
  let e = 0;
  while (e < b.empties) {
    const c = int(r, 0, W * H - 1);
    if (grid.g[c] === null) { grid.g[c] = '.'; e++; }
  }
  const single = 0.5 + r();
  tileRects(r, grid, { single, wide: 0.6 + r() * 0.8, tall: 1 + r(), long: b.long || 0, square: r() < 0.15 ? 0.3 : 0 });

  const gx = W === 4 ? 1 : int(r, 1, W - 3);
  const goal = `A@${gx},${H - 2}`;
  const text = line('K', '', rowsOf(grid), goal, 0, `x:b${gx}`);
  const model = SB.Model(SB.parse(text));
  const far = farthest(model, r, 400000, 2);
  if (!far || far.par < 1) return null;
  return [[far.key, far.par]].concat(far.extra).map(([k, d]) => {
    const rows = reletter(stateRows(model, model.unkey(k)));
    return { fam: 'K', kind: b.kind, par: d, size: far.size, line: line('K', '', rows, goal, d, `x:b${gx}`) };
  });
}

/* ---------- Release: odd shapes on odd boards, the key piece to its mark ---------- */

// Polyominoes as cell lists, every orientation listed.
const POLY = (() => {
  const base = {
    mono: [[0, 0]],
    domino: [[0, 0], [1, 0]],
    bar3: [[0, 0], [1, 0], [2, 0]],
    L3: [[0, 0], [0, 1], [1, 1]],
    O4: [[0, 0], [1, 0], [0, 1], [1, 1]],
    T4: [[0, 0], [1, 0], [2, 0], [1, 1]],
    L4: [[0, 0], [0, 1], [0, 2], [1, 2]],
    S4: [[1, 0], [2, 0], [0, 1], [1, 1]],
    P5: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]]
  };
  const norm = (cells) => {
    const mx = Math.min(...cells.map((c) => c[0])), my = Math.min(...cells.map((c) => c[1]));
    return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  };
  const out = {};
  for (const [name, cells] of Object.entries(base)) {
    const seen = new Map();
    let cur = cells;
    for (let flip = 0; flip < 2; flip++) {
      for (let rot = 0; rot < 4; rot++) {
        const n = norm(cur);
        seen.set(JSON.stringify(n), n);
        cur = cur.map(([x, y]) => [-y, x]);
      }
      cur = cells.map(([x, y]) => [-x, y]);
    }
    out[name] = [...seen.values()];
  }
  return out;
})();

const RELEASE_BOARDS = [
  { kind: 'r44', w: 4, h: 4, walls: [0, 2], empties: [2, 3], weight: 1 },
  { kind: 'r54', w: 5, h: 4, walls: [0, 3], empties: [2, 3], weight: 2 },
  { kind: 'r45', w: 4, h: 5, walls: [0, 3], empties: [2, 3], weight: 2 },
  { kind: 'r55', w: 5, h: 5, walls: [1, 4], empties: [2, 4], weight: 3 },
  { kind: 'r65', w: 6, h: 5, walls: [1, 5], empties: [3, 4], weight: 2 },
  { kind: 'r66', w: 6, h: 6, walls: [2, 6], empties: [3, 5], weight: 1.2 }
];

const HERO_SHAPES = ['L3', 'T4', 'L4', 'S4', 'O4', 'P5', 'L3', 'domino'];
const FILL_SHAPES = [['mono', 3], ['domino', 5], ['bar3', 1.2], ['L3', 2], ['O4', 0.6], ['T4', 0.7], ['L4', 0.7], ['S4', 0.4]];

// Every open cell reachable from every other (ignoring pieces)?
function connected(W, H, g) {
  const open = [];
  for (let i = 0; i < W * H; i++) if (g[i] !== '#') open.push(i);
  if (!open.length) return false;
  const seen = new Set([open[0]]);
  const stack = [open[0]];
  while (stack.length) {
    const c = stack.pop(), x = c % W, y = (c - x) / W;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, n = ny * W + nx;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || g[n] === '#' || seen.has(n)) continue;
      seen.add(n);
      stack.push(n);
    }
  }
  return seen.size === open.length;
}

// Places polyominoes over every null cell, anchored at the first free one.
function tilePolys(r, grid, shapes, startLetter) {
  const { w: W, h: H, g } = grid;
  let k = startLetter || 0;
  for (let c = 0; c < W * H; c++) {
    if (g[c] !== null) continue;
    const x = c % W, y = (c - x) / W;
    const options = [];
    for (const [name, wgt] of shapes) {
      for (const cells of POLY[name]) {
        // The shape's first cell (reading order) goes on (x, y).
        const [fx, fy] = cells[0];
        const placed = cells.map(([cx, cy]) => [x + cx - fx, y + cy - fy]);
        if (placed.every(([px, py]) => px >= 0 && py >= 0 && px < W && py < H && g[py * W + px] === null)) {
          options.push([placed, wgt / POLY[name].length]);
        }
      }
    }
    const placed = weighted(r, options);
    const ch = LETTERS[k++];
    for (const [px, py] of placed) g[py * W + px] = ch;
  }
  return k;
}

function sampleRelease(r, board) {
  const b = board || weighted(r, RELEASE_BOARDS.map((x) => [x, x.weight]));
  const { w: W, h: H } = b;
  const g = new Array(W * H).fill(null);
  // Walls: bites out of the edges and the odd pillar inside.
  const nw = int(r, b.walls[0], b.walls[1]);
  for (let i = 0; i < nw; i++) {
    const x = int(r, 0, W - 1), y = int(r, 0, H - 1);
    const edge = x === 0 || y === 0 || x === W - 1 || y === H - 1;
    if (!edge && r() < 0.6) continue;
    g[y * W + x] = '#';
  }
  if (!connected(W, H, g.map((c) => c || '.'))) return null;

  // The key piece.
  const heroCells = pick(r, POLY[pick(r, HERO_SHAPES)]);
  let placedHero = false;
  for (let t = 0; t < 30 && !placedHero; t++) {
    const x = int(r, 0, W - 1), y = int(r, 0, H - 1);
    const cells = heroCells.map(([cx, cy]) => [x + cx, y + cy]);
    if (cells.every(([px, py]) => px < W && py < H && g[py * W + px] === null)) {
      for (const [px, py] of cells) g[py * W + px] = 'A';
      placedHero = true;
    }
  }
  if (!placedHero) return null;

  const ne = int(r, b.empties[0], b.empties[1]);
  for (let e = 0, t = 0; e < ne && t < 100; t++) {
    const c = int(r, 0, W * H - 1);
    if (g[c] === null) { g[c] = '.'; e++; }
  }
  tilePolys(r, { w: W, h: H, g }, FILL_SHAPES);

  const text = line('R', '', rowsOf({ w: W, h: H, g }), 'A@0,0', 0, '');
  const puz = SB.parse(text);
  const hero = puz.pieces.find((p) => p.ch === 'A');
  const model0 = SB.Model(puz);
  const comp = SB.component(model0, startOf(model0), 150000);
  if (!comp || comp.length < 8) return null;

  // Where can the key piece go? Try a few of its places as the target and
  // keep the one whose farthest position is farthest.
  const heroSlot = model0.order.indexOf(puz.pieces.indexOf(hero));
  const anchors = [...new Set(comp.map((k) => k.charCodeAt(heroSlot)))];
  if (anchors.length < 2) return null;
  const trials = anchors.sort(() => r() - 0.5).slice(0, 6);
  let best = null;
  for (const a of trials) {
    const gx = a % W, gy = (a - gx) / W;
    const goal = `A@${gx},${gy}`;
    const model = SB.Model(SB.parse(line('R', '', rowsOf({ w: W, h: H, g }), goal, 0, '')));
    const dist = SB.distances(model, comp);
    let far = -1, keys = [];
    for (const [k, d] of dist) {
      if (d > far) { far = d; keys = [k]; } else if (d === far) keys.push(k);
    }
    if (!best || far > best.par) best = { par: far, key: pick(r, keys), goal, model, gx, gy, dist };
  }
  if (!best || best.par < 1) return null;

  // Also one position at a lesser distance, for the easier stages.
  const starts = [[best.key, best.par]];
  if (best.par > 2) {
    const d = int(r, 1, best.par - 1);
    for (const [k, dd] of best.dist) if (dd === d) { starts.push([k, d]); break; }
  }
  // A gate when the key piece, at its mark, lies flat against the rim.
  let opts = '';
  const hc = hero.shape.map(([x, y]) => [best.gx + x, best.gy + y]);
  const flat = (side) => {
    if (side === 'r') return best.gx + hero.w === W && hero.shape.filter(([x]) => x === hero.w - 1).length === hero.h;
    if (side === 'l') return best.gx === 0 && hero.shape.filter(([x]) => x === 0).length === hero.h;
    if (side === 'b') return best.gy + hero.h === H && hero.shape.filter(([, y]) => y === hero.h - 1).length === hero.w;
    return best.gy === 0 && hero.shape.filter(([, y]) => y === 0).length === hero.w;
  };
  for (const side of ['r', 'b', 'l', 't']) {
    if (flat(side) && hc.length) {
      opts = 'x:' + side + (side === 'r' || side === 'l' ? best.gy : best.gx);
      break;
    }
  }
  return starts.map(([k, d]) => {
    const rows = reletter(stateRows(best.model, best.model.unkey(k)));
    return { fam: 'R', kind: b.kind, par: d, size: comp.length, line: line('R', '', rows, best.goal, d, opts) };
  });
}

/* ---------- Order: put the pieces in order ---------- */

// Numbered tiles on a small tray: the pieces in reading order, gaps last.
// (Trays with more positions than a page can search for a hint are left out.)
const NUMBER_BOARDS = [
  { kind: 'n23', w: 3, h: 2, weight: 1 },
  { kind: 'n33', w: 3, h: 3, weight: 3 },
  { kind: 'n24', w: 4, h: 2, weight: 2 },
  { kind: 'n33b', w: 3, h: 3, blanks: 2, weight: 1 },
  { kind: 'n33d', w: 3, h: 3, blanks: 2, dominoes: 1, weight: 1 },
  { kind: 'n34d', w: 4, h: 3, blanks: 2, dominoes: 3, weight: 2 },
  { kind: 'n43d', w: 3, h: 4, blanks: 2, dominoes: 3, weight: 1.5 },
  { kind: 'n44d', w: 4, h: 4, blanks: 2, dominoes: 6, weight: 1.5 }
];

// The solved tray of a numbered board, as rows (labels 1-9 then A-Z).
function numberedGoal(r, b) {
  const { w: W, h: H } = b;
  const g = new Array(W * H).fill(null);
  const blanks = b.blanks || 1;
  for (let i = 0; i < blanks; i++) g[W * H - 1 - i] = '.';
  const labels = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let k = 0, dom = b.dominoes || 0;
  for (let c = 0; c < W * H; c++) {
    if (g[c] !== null) continue;
    const x = c % W;
    const ch = labels[k++];
    g[c] = ch;
    if (dom > 0 && r() < 0.5) {
      if (x + 1 < W && g[c + 1] === null && r() < 0.5) { g[c + 1] = ch; dom--; } else if (c + W < W * H && g[c + W] === null) { g[c + W] = ch; dom--; }
    }
  }
  return rowsOf({ w: W, h: H, g });
}

// Every position of a numbered board and its distance from the solved tray,
// kept per board, since the tray is fixed and many puzzles come from it.
const numberSpaces = new Map();

function sampleNumbers(r, board) {
  const b = board || weighted(r, NUMBER_BOARDS.map((x) => [x, x.weight]));
  const goalRows = numberedGoal(r, b);
  const spaceKey = goalRows.join('/');
  let space = numberSpaces.get(spaceKey);
  if (space === false) return null;
  if (!space) {
    const pattern = goalRows.map((row) => row.replace(/\./g, '?')).join('/');
    const model = SB.Model(SB.parse(line('O', '', goalRows, pattern, 0, 'n')));
    const comp = SB.component(model, startOf(model), 250000);
    if (!comp) { numberSpaces.set(spaceKey, false); return null; }
    const dist = SB.distances(model, comp);
    const byD = [];
    for (const [k, d] of dist) (byD[d] = byD[d] || []).push(k);
    space = { model, byD, pattern, size: comp.length };
    numberSpaces.set(spaceKey, space);
  }
  // Any distance: the far end is rare, so lean on it.
  const maxD = space.byD.length - 1;
  const d = Math.max(1, Math.round(maxD * Math.pow(r(), 0.6)));
  const k = pick(r, space.byD[d]);
  const rows = stateRows(space.model, space.model.unkey(k));
  return { fam: 'O', kind: b.kind, par: d, size: space.size, line: line('O', '', rows, space.pattern, d, 'n') };
}

// Two colours trade places: the board starts with each colour on its own
// side and ends with the sides swapped.
const SWAP_BOARDS = [
  { kind: 's42', w: 4, h: 2, empties: [1, 2], weight: 1 },
  { kind: 's43', w: 4, h: 3, empties: [2, 3], weight: 2 },
  { kind: 's53', w: 5, h: 3, empties: [2, 4], weight: 2 },
  { kind: 's44', w: 4, h: 4, empties: [2, 4], weight: 2 },
  { kind: 's54', w: 5, h: 4, empties: [3, 5], weight: 2 },
  { kind: 's64', w: 6, h: 4, empties: [4, 6], weight: 1.5 },
  { kind: 's55', w: 5, h: 5, empties: [3, 5], weight: 1.5, corners: true }
];
const SWAP_SHAPES = [['mono', 4], ['domino', 5], ['bar3', 0.8], ['O4', 0.4]];

function sampleSwap(r, board) {
  const b = board || weighted(r, SWAP_BOARDS.map((x) => [x, x.weight]));
  const { w: W, h: H } = b;
  const g = new Array(W * H).fill(null);
  if (b.corners) for (const c of [0, W - 1, (H - 1) * W, H * W - 1]) g[c] = '#';
  const half = Math.floor(W / 2);
  // The middle column of an odd board is neutral ground: wood and gaps.
  const ne = int(r, b.empties[0], b.empties[1]);
  if (W % 2) {
    for (let y = 0; y < H; y++) if (g[y * W + half] === null) g[y * W + half] = 'm';
  }
  // Tile the left side, then mirror it to the right side.
  const left = { w: half, h: H, g: new Array(half * H).fill(null) };
  for (let y = 0; y < H; y++) for (let x = 0; x < half; x++) if (g[y * W + x] === '#') left.g[y * half + x] = '#';
  tilePolys(r, left, SWAP_SHAPES);
  const leftChars = new Set(left.g.filter((c) => c && c !== '#'));
  const rename = new Map();
  let k = 0;
  const RED = 'ABCDEFGHIJKLM', BLUE = 'NOPQRSTUVWXYZ';
  for (const c of leftChars) rename.set(c, k++);
  if (k > RED.length) return null;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < half; x++) {
      const c = left.g[y * half + x];
      if (c === '#') continue;
      g[y * W + x] = RED[rename.get(c)];
      g[y * W + (W - 1 - x)] = BLUE[rename.get(c)];
    }
  }
  // Gaps: pairs of mirror pieces are taken away (both, or the colours could
  // no longer trade sides), and cells of the middle column are left open.
  let gaps = 0;
  const middle = [];
  for (let c = 0; c < W * H; c++) if (g[c] === 'm') middle.push(c);
  for (const c of middle) {
    if (gaps < ne && r() < 0.6) { g[c] = '.'; gaps++; }
  }
  for (let tries = 0; gaps < ne && tries < 40; tries++) {
    const i = int(r, 0, k - 1);
    const n = g.filter((c) => c === RED[i]).length;
    if (!n || gaps + 2 * n > ne + 2) continue;
    for (let c = 0; c < W * H; c++) if (g[c] === RED[i] || g[c] === BLUE[i]) g[c] = '.';
    gaps += 2 * n;
  }
  if (gaps < ne) return null;
  // Remaining middle cells become wooden blocks (their own pieces).
  let wood = 0;
  for (let c = 0; c < W * H; c++) if (g[c] === 'm') g[c] = 'abcdefgh'[wood++];

  const red = [...new Set(g.filter((c) => RED.includes(c)))];
  const blue = [...new Set(g.filter((c) => BLUE.includes(c)))];
  if (!red.length || !blue.length) return null;
  const rows = rowsOf({ w: W, h: H, g });
  // Goal: every cell held by red at the start is blue at the end, and back.
  const goalRows = rows.map((row) => [...row].map((c) => RED.includes(c) ? 'b' : BLUE.includes(c) ? 'r' : '?').join(''));
  const opts = 'c:' + red.join('') + '=r;' + blue.join('') + '=b';
  const text = line('O', '', rows, goalRows.join('/'), 0, opts);
  const model = SB.Model(SB.parse(text));
  const sol = SB.solve(model, startOf(model), 200000);
  if (!sol || sol.dist < 2) return null;
  return { fam: 'O', kind: b.kind, par: sol.dist, size: sol.explored, line: line('O', '', rows, goalRows.join('/'), sol.dist, opts) };
}

// Colours to sort: the goal is a tidy tray (each colour in its own band of
// rows or columns); the puzzle is the position farthest from it.
const SORT_BOARDS = [
  { kind: 'c33', w: 3, h: 3, colors: 3, bands: 'rows', empties: 1, weight: 1 },
  { kind: 'c43', w: 4, h: 3, colors: 3, bands: 'rows', empties: 2, weight: 2 },
  { kind: 'c34', w: 3, h: 4, colors: 3, bands: 'cols', empties: 2, weight: 1 },
  { kind: 'c44', w: 4, h: 4, colors: 2, bands: 'rows', empties: 2, weight: 2 },
  { kind: 'c44c', w: 4, h: 4, colors: 4, bands: 'cols', empties: 2, weight: 1.5 },
  { kind: 'c54', w: 5, h: 4, colors: 2, bands: 'cols', empties: 3, weight: 1.5 },
  { kind: 'c55', w: 5, h: 5, colors: 3, bands: 'rows', empties: 3, weight: 1.5, corners: true }
];
const SORT_SHAPES = [['mono', 4], ['domino', 4], ['bar3', 0.7], ['O4', 0.3]];
const CLASS_CHARS = 'rbgy';

function sampleSort(r, board) {
  const b = board || weighted(r, SORT_BOARDS.map((x) => [x, x.weight]));
  const { w: W, h: H } = b;
  const g = new Array(W * H).fill(null);
  if (b.corners) for (const c of [0, W - 1, (H - 1) * W, H * W - 1]) g[c] = '#';
  for (let e = 0, t = 0; e < b.empties && t < 100; t++) {
    const c = int(r, 0, W * H - 1);
    if (g[c] === null) { g[c] = '.'; e++; }
  }
  const across = b.bands === 'rows' ? H : W;
  const bandOf = (c) => {
    const x = c % W, y = (c - x) / W;
    return Math.min(b.colors - 1, Math.floor((b.bands === 'rows' ? y : x) * b.colors / across));
  };
  // Tile each band on its own, so no piece straddles two colours.
  const classes = {};
  let k = 0;
  for (let band = 0; band < b.colors; band++) {
    const sub = { w: W, h: H, g: g.map((c, i) => (c === null && bandOf(i) === band ? null : '#')) };
    const before = k;
    k = tilePolys(r, sub, SORT_SHAPES, k);
    for (let i = 0; i < W * H; i++) if (g[i] === null && bandOf(i) === band) g[i] = sub.g[i];
    for (let j = before; j < k; j++) classes[LETTERS[j]] = CLASS_CHARS[band];
  }
  const goalRows = rowsOf({ w: W, h: H, g: g.map((c) => (c === '.' || c === '#' ? '?' : classes[c])) });
  const byClass = {};
  for (const [ch, cls] of Object.entries(classes)) byClass[cls] = (byClass[cls] || '') + ch;
  const opts = 'c:' + Object.entries(byClass).map(([cls, chars]) => chars + '=' + cls).join(';');
  const text = line('O', '', rowsOf({ w: W, h: H, g }), goalRows.join('/'), 0, opts);
  const model = SB.Model(SB.parse(text));
  const far = farthest(model, r, 250000);
  if (!far || far.par < 2) return null;
  const rows = stateRows(model, model.unkey(far.key));
  return { fam: 'O', kind: b.kind, par: far.par, size: far.size, line: line('O', '', rows, goalRows.join('/'), far.par, opts) };
}

/* ---------- harder Gridlock by small changes ---------- *
 * Random Gridlock boards are mostly easy. Starting from one, change a single
 * vehicle at a time (add, drop, move, turn) and keep the change whenever the
 * puzzle does not get easier: the long-solution boards are found this way.
 * Calls emit(candidate) for every board it measures.
 */
function evolveGridlock(r, board, steps, emit) {
  const { w: W, h: H, row } = board;
  const measure = (vs, walls) => {
    const grid = blank(W, H);
    for (const c of walls) grid.g[c] = '#';
    let k = 0;
    for (const v of vs) {
      for (let i = 0; i < v.len; i++) {
        const c = (v.y + (v.vert ? i : 0)) * W + v.x + (v.vert ? 0 : i);
        if (grid.g[c] !== '.') return null;
        grid.g[c] = v.hero ? 'A' : LETTERS[k];
      }
      if (!v.hero) k++;
    }
    const text = line('G', '', rowsOf(grid), `A@${W - 2},${row}`, 0, `x:r${row}`);
    const model = SB.Model(SB.parse(text));
    const far = farthest(model, r, 300000);
    if (!far || far.par < 1) return null;
    const rows = reletter(stateRows(model, model.unkey(far.key)));
    return { fam: 'G', kind: board.kind, par: far.par, size: far.size, line: line('G', '', rows, `A@${W - 2},${row}`, far.par, `x:r${row}`) };
  };
  const randomVehicle = () => {
    const len = r() < board.trucks ? 3 : 2;
    const vert = r() < 0.55;
    const x = int(r, 0, vert ? W - 1 : W - len), y = int(r, 0, vert ? H - len : H - 1);
    if (!vert && y === row) return null;
    return { x, y, len, vert };
  };

  let vs = [{ x: int(r, 0, W - 3), y: row, len: 2, vert: false, hero: true }];
  let walls = [];
  for (let i = 0; i < board.cars[0]; i++) {
    const v = randomVehicle();
    if (v) vs.push(v);
  }
  let cur = measure(vs, walls);
  for (let tries = 0; !cur && tries < 50; tries++) {
    vs = vs.slice(0, 1).concat(vs.slice(1).filter(() => r() < 0.7));
    cur = measure(vs, walls);
  }
  if (!cur) return;
  emit(cur);
  for (let step = 0; step < steps; step++) {
    const nv = vs.map((v) => ({ ...v }));
    let nw = walls.slice();
    const op = r();
    if (op < 0.3 && nv.length < board.cars[1] + 1) {
      const v = randomVehicle();
      if (!v) continue;
      nv.push(v);
    } else if (op < 0.45 && nv.length > 3) {
      nv.splice(int(r, 1, nv.length - 1), 1);
    } else if (op < 0.85) {
      const i = int(r, 0, nv.length - 1);
      if (nv[i].hero) nv[i].x = int(r, 0, W - 3);
      else {
        const v = randomVehicle();
        if (!v) continue;
        nv[i] = v;
      }
    } else if (op < 0.93 && board.walls > 0) {
      const x = int(r, 0, W - 1), y = int(r, 0, H - 1);
      if (y === row) continue;
      if (nw.includes(y * W + x)) nw = nw.filter((c) => c !== y * W + x);
      else if (nw.length < 2) nw.push(y * W + x);
    } else {
      const i = int(r, 1, Math.max(1, nv.length - 1));
      if (!nv[i]) continue;
      nv[i].len = 5 - nv[i].len;
      if (nv[i].vert ? nv[i].y + nv[i].len > H : nv[i].x + nv[i].len > W) continue;
    }
    const got = measure(nv, nw);
    if (!got) continue;
    emit(got);
    if (got.par >= cur.par || r() < 0.02) { vs = nv; walls = nw; cur = got; }
  }
}

// Towers: bars of widths 1, 2, 3 ... stacked in stepped wells, where a bar
// can go only as deep as it is narrow, so the widest always sits on top.
// Move the tower from the left well to the right one.
function towerBoard(bars, wells) {
  const ww = bars;                 // a well is as wide as the widest bar
  const W = wells * ww + (wells - 1);
  const H = 1 + bars;
  const g = new Array(W * H).fill('.');
  for (let wi = 0; wi < wells; wi++) {
    const x0 = wi * (ww + 1);
    for (let d = 1; d <= bars; d++) {
      // Row d of a well is open for widths up to bars - d + 1.
      const open = bars - d + 1;
      for (let x = x0 + open; x < x0 + ww; x++) g[d * W + x] = '#';
    }
    if (wi < wells - 1) for (let d = 1; d <= bars; d++) g[d * W + x0 + ww] = '#';
  }
  return { W, H, g };
}

// Move one tower to the last well, or (swap) trade two towers end for end.
function towerPuzzles() {
  const out = [];
  for (const bars of [2, 3, 4, 5]) {
    for (const wells of [2, 3, 4]) {
      for (const swap of [false, true]) {
        const { W, H, g } = towerBoard(bars, wells);
        if (W > 16) continue;
        const start = g.slice(), goal = g.map((c) => (c === '#' ? '#' : '?'));
        const lastX = (wells - 1) * (bars + 1);
        const RED = '123456789', BLUE = 'abcdefghi';
        for (let d = 1; d <= bars; d++) {
          const width = bars - d + 1;
          for (let x = 0; x < width; x++) {
            start[d * W + x] = RED[width - 1];
            goal[d * W + lastX + x] = swap ? 'r' : RED[width - 1];
            if (swap) {
              start[d * W + lastX + x] = BLUE[width - 1];
              goal[d * W + x] = 'b';
            }
          }
        }
        const rows = rowsOf({ w: W, h: H, g: start });
        const goalRows = rowsOf({ w: W, h: H, g: goal });
        const opts = swap ? 'c:' + RED.slice(0, bars) + '=r;' + BLUE.slice(0, bars) + '=b' : 'n';
        const text = line('O', '', rows, goalRows.join('/'), 0, opts);
        const model = SB.Model(SB.parse(text));
        const sol = SB.solve(model, startOf(model), 1500000);
        if (!sol) continue;
        out.push({ fam: 'O', kind: 't' + bars + wells + (swap ? 's' : ''), par: sol.dist, size: sol.explored, line: line('O', '', rows, goalRows.join('/'), sol.dist, opts) });
      }
    }
  }
  return out;
}

// More towers: for each board, every position the bars can reach, and
// starts at a spread of distances from the goal (the tower, or the two
// towers traded, in the far wells), up to the farthest of all.
function towerSpread(r) {
  const out = [];
  const RED = '123456789', BLUE = 'abcdefghi';
  const configs = [
    { bars: 3, wells: 3, swap: false, n: 7 }, { bars: 3, wells: 4, swap: false, n: 7 },
    { bars: 4, wells: 3, swap: false, n: 9 }, { bars: 2, wells: 3, swap: true, n: 7 },
    { bars: 2, wells: 4, swap: true, n: 7 }, { bars: 2, wells: 2, swap: true, n: 4 },
    { bars: 3, wells: 2, swap: false, n: 4 }
  ];
  for (const cfg of configs) {
    const { bars, wells, swap } = cfg;
    const { W, H, g } = towerBoard(bars, wells);
    const board = g.slice(), goal = g.map((c) => (c === '#' ? '#' : '?'));
    const lastX = (wells - 1) * (bars + 1);
    for (let d = 1; d <= bars; d++) {
      const width = bars - d + 1;
      for (let x = 0; x < width; x++) {
        board[d * W + lastX + x] = RED[width - 1];
        goal[d * W + lastX + x] = swap ? 'r' : RED[width - 1];
        if (swap) {
          board[d * W + x] = BLUE[width - 1];
          goal[d * W + x] = 'b';
        }
      }
    }
    const goalRows = rowsOf({ w: W, h: H, g: goal }).join('/');
    const opts = swap ? 'c:' + RED.slice(0, bars) + '=r;' + BLUE.slice(0, bars) + '=b' : 'n';
    const model = SB.Model(SB.parse(line('O', '', rowsOf({ w: W, h: H, g: board }), goalRows, 0, opts)));
    const comp = SB.component(model, startOf(model), 250000);
    if (!comp) continue;
    const dist = SB.distances(model, comp);
    const byD = [];
    for (const [k, d] of dist) (byD[d] = byD[d] || []).push(k);
    const maxD = byD.length - 1;
    const wanted = new Set([maxD]);
    for (let i = 1; wanted.size < cfg.n && i < 40; i++) wanted.add(Math.max(3, Math.round(maxD * (0.35 + 0.65 * r()))));
    for (const d of wanted) {
      if (!byD[d]) continue;
      const rows = stateRows(model, model.unkey(pick(r, byD[d])));
      out.push({ fam: 'O', kind: 't' + bars + wells + (swap ? 's' : '') + 'f', par: d, size: comp.length, line: line('O', '', rows, goalRows, d, opts) });
    }
  }
  return out;
}

// Towers after Panex and the Towers of Hanoi: one-cell disks in walled
// columns under a channel, where disk k may go only k levels deep, so the
// small disks always stand above the large. Move the tower to the right-hand
// column, or trade two towers. Each board gives its classic start (the whole
// tower on the left) and starts at a spread of distances up to the farthest.
function panexBoard(n, cols, swap) {
  const W = 2 * cols - 1, H = n + 1;
  const g = [], goal = [], zone = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const wall = y > 0 && x % 2 === 1;
      g.push(wall ? '#' : '.');
      goal.push(wall ? '#' : '?');
      zone.push(y === 0 || wall ? 0 : y);
    }
  }
  const RED = '123456789', BLUE = 'abcdefghi';
  for (let k = 1; k <= n; k++) {
    g[k * W] = RED[k - 1];
    goal[k * W + W - 1] = swap ? 'r' : RED[k - 1];
    if (swap) {
      g[k * W + W - 1] = BLUE[k - 1];
      goal[k * W] = 'b';
    }
  }
  const opts = (swap ? 'c:' + RED.slice(0, n) + '=r;' + BLUE.slice(0, n) + '=b' : 'n') +
    ' z:' + rowsOf({ w: W, h: H, g: zone }).join('/');
  return { W, H, rows: rowsOf({ w: W, h: H, g }), goal: rowsOf({ w: W, h: H, g: goal }).join('/'), opts };
}

function panexPuzzles(r) {
  const out = [];
  const configs = [
    { n: 2, cols: 3, swap: false, spread: 0 }, { n: 3, cols: 3, swap: false, spread: 5 },
    { n: 4, cols: 3, swap: false, spread: 7 }, { n: 5, cols: 3, swap: false, spread: 7 },
    { n: 2, cols: 3, swap: true, spread: 4 }, { n: 3, cols: 3, swap: true, spread: 8 },
    { n: 3, cols: 4, swap: false, spread: 4 }, { n: 2, cols: 4, swap: true, spread: 4 }
  ];
  for (const cfg of configs) {
    const b = panexBoard(cfg.n, cfg.cols, cfg.swap);
    const kind = 'p' + cfg.n + cfg.cols + (cfg.swap ? 's' : '');
    const text = line('O', '', b.rows, b.goal, 0, b.opts);
    const model = SB.Model(SB.parse(text));
    const start = startOf(model);
    const comp = SB.component(model, start, 250000);
    if (!comp) continue;
    const dist = SB.distances(model, comp);
    const classic = dist.get(model.key(start));
    out.push({ fam: 'O', kind, par: classic, size: comp.length, line: line('O', '', b.rows, b.goal, classic, b.opts) });
    if (!cfg.spread) continue;
    const byD = [];
    for (const [k, d] of dist) (byD[d] = byD[d] || []).push(k);
    const maxD = byD.length - 1;
    const wanted = new Set([maxD]);
    for (let i = 0; wanted.size < cfg.spread && i < 60; i++) wanted.add(Math.max(3, Math.round(maxD * (0.4 + 0.6 * r()))));
    wanted.delete(classic);
    for (const d of wanted) {
      if (!byD[d]) continue;
      const rows = stateRows(model, model.unkey(pick(r, byD[d])));
      out.push({ fam: 'O', kind: kind + 'f', par: d, size: comp.length, line: line('O', '', rows, b.goal, d, b.opts) });
    }
  }
  return out;
}

module.exports = {
  towerSpread, panexPuzzles,
  rng, SB, stateRows, reletter, line, startOf, POLY,
  sampleGridlock, sampleKlotski, sampleRelease, sampleNumbers, sampleSwap, sampleSort, towerPuzzles, evolveGridlock,
  GRIDLOCK_BOARDS, KLOTSKI_BOARDS, RELEASE_BOARDS, NUMBER_BOARDS, SWAP_BOARDS, SORT_BOARDS
};
