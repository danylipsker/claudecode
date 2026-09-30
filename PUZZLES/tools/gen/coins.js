/* The Puzzle Cabinet · tools/gen/coins.js
 *
 *   node tools/gen/coins.js           writes data/coin-moves.js
 *   node tools/gen/coins.js --show    also prints every puzzle and its solution
 *
 * The curated coin puzzles. Figures are drawn below as little pictures:
 * on the honeycomb ('hex') a row is offset by half a coin from the next;
 * on the square lattice each character is one place. Solutions of lattice
 * puzzles are found here (fewest moves: by the best placement of the target
 * figure, or by breadth-first search when coins must slide); rows, squares
 * and loops carry a hand-made arrangement. Every puzzle is checked with the
 * engine's own verify() before it is written.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/coins.js'));
const L = C.coinsLogic;
const E = C.engines.coins;
const SHOW = process.argv.includes('--show');

/* ---------- pictures ---------- */

// honeycomb picture: 'o' marks a coin; rows alternate by half a coin, so the
// characters of one picture must sit on a consistent chequer
function hex(lines) {
  let par = null;
  const out = [];
  lines.forEach((ln, r) => {
    for (let i = 0; i < ln.length; i++) {
      if (ln[i] !== 'o') continue;
      if (par === null) par = ((i - r) % 2 + 2) % 2;
      const q = (i - r - par) / 2;
      if (!Number.isInteger(q)) throw new Error('bad honeycomb picture: ' + JSON.stringify(lines));
      out.push([q, r]);
    }
  });
  return out;
}
function sq(lines) {
  const out = [];
  lines.forEach((ln, r) => { for (let i = 0; i < ln.length; i++) if (ln[i] === 'o') out.push([i, r]); });
  return out;
}
const flipV = (pts) => pts.map((p) => [p[0], -p[1]]);
const flipH = (pts) => pts.map((p) => [-p[0], p[1]]);
const turnHex = (pts) => pts.map((p) => [-p[0], -p[1]]);   // half a turn on the honeycomb
function triangle(n) { const out = []; for (let r = 0; r < n; r++) for (let k = 0; k <= r; k++) out.push([k - r, r]); return out; }
function draw(d, pts) {
  const w = L.Wall(d, pts);
  const ys = [...new Set(w.map((p) => p[1].toFixed(2)))].sort((a, b) => a - b);
  const x0 = Math.min(...w.map((p) => p[0]));
  return ys.map((y) => {
    let line = '';
    w.filter((p) => p[1].toFixed(2) === y).map((p) => p[0]).sort((a, b) => a - b).forEach((x) => {
      const col = Math.round((x - x0) * 2);
      line = line.padEnd(col, ' ') + 'o';
    });
    return '      ' + line;
  }).join('\n');
}

/* ---------- solving ---------- */

// lifting coins on a lattice: the engine keeps the best placement of the target and moves the rest
const liftSolution = (d) => L.liftPlan(d);

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];

/* ---------- the puzzles ---------- */
// kind: 'lift' | 'slide' | 'fin' | 'sol'
const P = [];
const add = (o) => P.push(o);

/* ---- honeycomb: turn a figure upside down (lifting coins) ---- */
[[2, 'coin-tri-3', 'A Turn of Three', 1], [3, 'coin-tri-6', 'Six Upside Down', 1], [4, 'coin-tri-10', 'The Upside-Down Triangle', 2], [5, 'coin-tri-15', 'Fifteen Upside Down', 3], [6, 'coin-tri-21', 'The Great Inversion', 4]].forEach(([n, id, title, diff]) => {
  const t = triangle(n);
  add({ id, title, diff, kind: 'lift', data: { coins: t, grid: 'hex', goal: { shape: turnHex(t), turn: 'translate' } } });
});
add({ id: 'coin-rhombus', title: 'Lean the Other Way', diff: 2, kind: 'lift', data: { coins: hex(['o o o', ' o o o', '  o o o']), grid: 'hex', goal: { shape: hex(['  o o o', ' o o o', 'o o o']), turn: 'translate' } } });
add({ id: 'coin-trapezoid', title: 'The Upturned Table', diff: 2, kind: 'lift', data: { coins: hex(['  o o', ' o o o', 'o o o o']), grid: 'hex', goal: { shape: turnHex(hex(['  o o', ' o o o', 'o o o o'])), turn: 'translate' } } });
add({ id: 'coin-chevron', title: 'Flight of Geese', diff: 3, kind: 'lift', data: { coins: hex(['o       o', ' o     o', '  o   o', '   o o']), grid: 'hex', goal: { shape: turnHex(hex(['o       o', ' o     o', '  o   o', '   o o'])), turn: 'translate' } } });
add({ id: 'coin-row-flower', title: 'A Row into a Flower', diff: 2, kind: 'lift', data: { coins: hex(['o o o o o o o']), grid: 'hex', goal: { shape: hex([' o o', 'o o o', ' o o']), turn: 'rigid' } } });
add({ id: 'coin-tri-hexagon', title: 'Triangle to Hexagon', diff: 2, kind: 'lift', data: { coins: triangle(4), grid: 'hex', goal: { shape: hex([' o o o', 'o o o o', ' o o o']), turn: 'rigid' } } });

/* ---- square lattice ---- */
add({ id: 'coin-h-to-o', title: 'H into O', diff: 3, kind: 'lift', data: { coins: sq(['o..o', 'oooo', 'o..o']), grid: 'square', goal: { shape: sq(['ooo', 'o.o', 'ooo']), turn: 'rigid' } } });
add({ id: 'coin-tall-h', title: 'The Tall H', diff: 2, kind: 'lift', data: { coins: sq(['o..o', 'o..o', 'oooo', 'o..o']), grid: 'square', goal: { shape: sq(['ooo', 'o.o', 'o.o', 'ooo']), turn: 'rigid' } } });
add({ id: 'coin-t-turn', title: 'Upside-Down T', diff: 1, kind: 'lift', data: { coins: sq(['ooooo', '..o..', '..o..']), grid: 'square', goal: { shape: flipV(sq(['ooooo', '..o..', '..o..'])), turn: 'translate' } } });
add({ id: 'coin-plus-x', title: 'Plus into Times', diff: 1, kind: 'lift', data: { coins: sq(['.o.', 'ooo', '.o.']), grid: 'square', goal: { shape: sq(['o.o', '.o.', 'o.o']), turn: 'rigid' } } });
add({ id: 'coin-arrow', title: 'Turn the Arrow', diff: 2, kind: 'lift', data: { coins: sq(['..o..', '.ooo.', 'o.o.o', '..o..', '..o..']), grid: 'square', goal: { shape: flipV(sq(['..o..', '.ooo.', 'o.o.o', '..o..', '..o..'])), turn: 'translate' } } });
add({ id: 'coin-l-j', title: 'L into J', diff: 2, kind: 'lift', data: { coins: sq(['o..', 'o..', 'o..', 'ooo']), grid: 'square', goal: { shape: flipH(sq(['o..', 'o..', 'o..', 'ooo'])), turn: 'translate' } } });
add({ id: 'coin-pyramid-9', title: 'The Pyramid Stands on Its Head', diff: 2, kind: 'lift', data: { coins: sq(['..o..', '.ooo.', 'ooooo']), grid: 'square', goal: { shape: sq(['ooooo', '.ooo.', '..o..']), turn: 'translate' } } });
add({ id: 'coin-pyramid-16', title: 'The Great Pyramid Stands on Its Head', diff: 4, kind: 'lift', data: { coins: sq(['...o...', '..ooo..', '.ooooo.', 'ooooooo']), grid: 'square', goal: { shape: sq(['ooooooo', '.ooooo.', '..ooo..', '...o...']), turn: 'translate' } } });
add({ id: 'coin-stairs', title: 'Down the Stairs', diff: 3, kind: 'lift', data: { coins: sq(['o...', 'oo..', 'ooo.', 'oooo']), grid: 'square', goal: { shape: sq(['oooo', 'ooo.', 'oo..', 'o...']), turn: 'translate' } } });

/* ---- sliding on the honeycomb, each moved coin touching two ---- */
const RING = hex([' o o', 'o . o', ' o o']);
const PARA = hex([' o o o', 'o o o']);
const SLIDE = { slide: true, touch2: true };
add({ id: 'coin-ring-triangle', title: 'The Ring Closes In', diff: 2, kind: 'slide', data: { coins: RING, grid: 'hex', goal: { shape: triangle(3), turn: 'rigid' }, rules: SLIDE } });
add({ id: 'coin-ring-para', title: 'Ring to Rhombus', diff: 2, kind: 'slide', data: { coins: RING, grid: 'hex', goal: { shape: PARA, turn: 'mirror' }, rules: SLIDE } });
add({ id: 'coin-para-ring', title: 'Six Pennies in a Ring', diff: 3, kind: 'slide', data: { coins: PARA, grid: 'hex', goal: { shape: RING, turn: 'rigid' }, rules: SLIDE } });
add({ id: 'coin-row-triangle', title: 'From a Row to a Triangle', diff: 3, kind: 'slide', data: { coins: hex(['o o o o o o']), grid: 'hex', goal: { shape: triangle(3), turn: 'rigid' }, rules: SLIDE } });
add({ id: 'coin-tri10-slide', title: 'The Triangle, Sliding', diff: 3, kind: 'slide', data: { coins: triangle(4), grid: 'hex', goal: { shape: turnHex(triangle(4)), turn: 'translate' }, rules: SLIDE } });
add({ id: 'coin-triangle-ring', title: 'Triangle into Ring', diff: 4, kind: 'slide', data: { coins: triangle(3), grid: 'hex', goal: { shape: RING, turn: 'rigid' }, rules: SLIDE } });
add({ id: 'coin-row-flower-slide', title: 'The Flower, Sliding', diff: 4, kind: 'slide', data: { coins: hex(['o o o o o o o']), grid: 'hex', goal: { shape: hex([' o o', 'o o o', ' o o']), turn: 'rigid' }, rules: SLIDE } });
add({ id: 'coin-row-ring', title: 'The Long Way Round', diff: 5, kind: 'slide', data: { coins: hex(['o o o o o o']), grid: 'hex', goal: { shape: RING, turn: 'rigid' }, rules: SLIDE } });

/* ---- rows (free placement; coins snap onto lines through two others) ---- */
const r2 = (v) => Math.round(v * 1000) / 1000;
const R2 = (pts) => pts.map((p) => [r2(p[0]), r2(p[1])]);
function lineUp(n) {   // the coins as they come out of the purse: one or two tidy rows
  if (n <= 7) return R2(Array.from({ length: n }, (_, i) => [i * 1.25, 0]));
  const a = Math.ceil(n / 2), out = [];
  for (let i = 0; i < a; i++) out.push([i * 1.25, 0]);
  for (let i = 0; i < n - a; i++) out.push([0.625 + i * 1.25, 1.2]);
  return R2(out);
}
function centreOn(pts, on) {   // move a figure so its centre sits on the centre of another
  const c = (q) => { let x = 0, y = 0; q.forEach((p) => { x += p[0]; y += p[1]; }); return [x / q.length, y / q.length]; };
  const a = c(pts), b = c(on);
  return R2(pts.map((p) => [p[0] - a[0] + b[0], p[1] - a[1] + b[1]]));
}
function polar(n, R, a0) { return Array.from({ length: n }, (_, k) => { const a = (a0 + k * 360 / n) * Math.PI / 180; return [R * Math.cos(a), R * Math.sin(a)]; }); }
// the ten crossings of a regular five-pointed star
function pentagram(R) {
  const tips = polar(5, R, -90);
  const inner = polar(5, R * Math.cos(72 * Math.PI / 180) / Math.cos(36 * Math.PI / 180), 90);
  return tips.concat(inner);
}
// the twelve points of the six-pointed star (two triangles)
function hexagram(s) {
  const R = s * Math.sqrt(3);            // tips: triangle side 3s
  return polar(6, R, -90).concat(polar(6, s, -60));
}
{
  const V = [[0, 0], [0, 1.25], [0, 2.5], [0, 3.75], [-1.25, 1.25], [1.25, 1.25]];
  add({ id: 'coin-cross-rows', kind: 'sol', title: 'The Cross That Counts Twice', diff: 1, data: { coins: V, snap: 'rows', stack: true, goal: { rows: 2, perRow: 4 }, rules: { moves: 1 }, sol: [[[0, 3.75], [0, 1.25]]] } });
  const V8 = [[0, 0], [0, 1.25], [0, 2.5], [0, 3.75], [0, 5], [-1.25, 2.5], [1.25, 2.5], [2.5, 2.5]];
  add({ id: 'coin-eight-rows', kind: 'sol', title: 'Two Rows of Five', diff: 1, data: { coins: V8, snap: 'rows', stack: true, goal: { rows: 2, perRow: 5 }, rules: { moves: 1 }, sol: [[[0, 0], [0, 2.5]]] } });
  const s = 1.3, h = s * Math.sqrt(3) / 2;
  add({ id: 'coin-three-rows', kind: 'fin', title: 'Three Rows of Three', diff: 1, data: { coins: [[0, 0], [1.3, 0], [2.6, 0], [0, 1.4], [1.3, 1.4], [2.6, 1.4]], snap: 'rows', stack: false, goal: { rows: 3, perRow: 3 }, fin: R2([[0, 0], [s, 0], [2 * s, 0], [s / 2, -h], [1.5 * s, -h], [s, -2 * h]]) } });
  add({ id: 'coin-nine-eight', kind: 'fin', title: 'Eight Rows from Nine', diff: 1, data: { coins: lineUp(9), snap: 'rows', stack: false, goal: { rows: 8, perRow: 3 }, fin: centreOn(sq(['ooo', 'ooo', 'ooo']).map((p) => [p[0] * 1.4, p[1] * 1.4]), lineUp(9)) } });
  const t9 = [];
  const A = [0, 0], B = [3.9, 0], Cc = [1.95, -3.9 * Math.sqrt(3) / 2];
  [[A, B], [B, Cc], [Cc, A]].forEach(([p, q]) => { for (let k = 0; k < 3; k++) t9.push([p[0] + (q[0] - p[0]) * k / 3, p[1] + (q[1] - p[1]) * k / 3]); });
  add({ id: 'coin-nine-triangle', kind: 'fin', title: 'Four to a Side', diff: 1, data: { coins: lineUp(9), snap: 'rows', stack: false, goal: { rows: 3, perRow: 4 }, fin: centreOn(t9, lineUp(9)) } });
  const S = 4.2, Hh = S * Math.sqrt(3) / 2;
  const tri7 = [[0, 0], [S, 0], [S / 2, -Hh], [S / 2, 0], [S / 4, -Hh / 2], [3 * S / 4, -Hh / 2], [S / 2, -Hh / 3]];
  add({ id: 'coin-seven-six', kind: 'fin', title: 'Seven Coins, Six Rows', diff: 3, data: { coins: lineUp(7), snap: 'rows', stack: false, goal: { rows: 6, perRow: 3 }, fin: centreOn(tri7, lineUp(7)) } });
  const quad = [[0, 0], [4, 0], [6, 0], [0, -4], [0, -3], [2, -2]].map((p) => [p[0] * 1.2, p[1] * 1.2]);
  add({ id: 'coin-six-four', kind: 'fin', title: 'Six Coins, Four Rows', diff: 3, data: { coins: lineUp(6), snap: 'rows', stack: false, goal: { rows: 4, perRow: 3 }, fin: centreOn(quad, lineUp(6)) } });
  add({ id: 'coin-star', kind: 'fin', title: 'The Five-Pointed Star', diff: 3, data: { coins: lineUp(10), snap: 'rows', stack: false, goal: { rows: 5, perRow: 4 }, fin: centreOn(pentagram(3), lineUp(10)) } });
  add({ id: 'coin-hexagram', kind: 'fin', title: 'The Six-Pointed Star', diff: 3, data: { coins: lineUp(12), snap: 'rows', stack: false, goal: { rows: 6, perRow: 4 }, fin: centreOn(hexagram(1.25), lineUp(12)) } });
  const orchard = [[0, 0], [1, 0], [2, 0], [0.5, 1], [1, 1], [1.5, 1], [0, 2], [1, 2], [2, 2]].map((p) => [p[0] * 2.4, p[1] * 2.4]);
  add({ id: 'coin-orchard', kind: 'fin', title: 'The Orchard of Nine Trees', diff: 5, data: { coins: lineUp(9), snap: 'rows', stack: false, goal: { rows: 10, perRow: 3 }, fin: centreOn(orchard, lineUp(9)) } });
}

/* ---- squares with stacks ---- */
{
  const k = 1.3, E = 3 * k;
  const sq12 = [[0, 0], [k, 0], [2 * k, 0], [E, 0], [E, k], [E, 2 * k], [E, E], [2 * k, E], [k, E], [0, E], [0, 2 * k], [0, k]].map((p) => [r2(p[0]), r2(p[1])]);
  add({ id: 'coin-square-five', kind: 'sol', title: 'Five a Side', diff: 2, data: { coins: sq12, snap: 'rows', stack: true, goal: { square: 5 }, rules: { moves: 4 }, sol: [[[k, 0], [0, 0]], [[E, k], [E, 0]], [[2 * k, E], [E, E]], [[0, 2 * k], [0, E]]].map((m) => R2(m)) }, par: 4 });
  add({ id: 'coin-square-six', kind: 'sol', title: 'Six a Side', diff: 2, data: { coins: sq12, snap: 'rows', stack: true, goal: { square: 6 }, rules: { moves: 8 }, sol: [[[k, 0], [0, 0]], [[2 * k, 0], [E, 0]], [[E, k], [E, 0]], [[E, 2 * k], [E, E]], [[2 * k, E], [E, E]], [[k, E], [0, E]], [[0, 2 * k], [0, E]], [[0, k], [0, 0]]].map((m) => R2(m)) }, par: 8 });
}

/* ---- touching ---- */
add({ id: 'coin-touch-four', kind: 'sol', title: 'Four Friends', diff: 1, data: { coins: [[0, 0], [1, 0], [2, 0], [3, 0]], snap: 'contact', stack: false, goal: { touch: 2 }, rules: { moves: 2 }, sol: [[[0, 0], [1, 1]], [[3, 0], [2, 1]]] }, par: 2 });
add({ id: 'coin-touch-ring', kind: 'touch', title: 'Round Table for Six', diff: 2, data: { coins: triangle(3), grid: 'hex', stack: false, goal: { touch: 2 } } });
add({ id: 'coin-touch-pairs', kind: 'touch', title: 'Pairs Apart', diff: 2, data: { coins: triangle(3), grid: 'hex', stack: false, goal: { touch: 1 } } });
add({ id: 'coin-touch-loop8', kind: 'touch', title: 'Eight in a Loop', diff: 3, data: { coins: hex([' o o o o', 'o o o o']), grid: 'hex', stack: false, goal: { touch: 2 } } });

/* ---------- solving the loops and pairs: every final arrangement is tried ---------- */
const KEY = (p) => p[0] + ',' + p[1];
function connectedSets(n, nb) {   // all lattice sets of n connected points, up to translation
  const canon = (set) => { let mq = Infinity, mr = Infinity; set.forEach((p) => { if (p[1] < mr || (p[1] === mr && p[0] < mq)) { mr = p[1]; mq = p[0]; } }); return set.map((p) => [p[0] - mq, p[1] - mr]).map(KEY).sort().join(';'); };
  let level = new Map([[canon([[0, 0]]), [[0, 0]]]]);
  for (let s = 1; s < n; s++) {
    const next = new Map();
    level.forEach((set) => {
      const ks = new Set(set.map(KEY));
      set.forEach((p) => nb.forEach((v) => {
        const q = [p[0] + v[0], p[1] + v[1]];
        if (ks.has(KEY(q))) return;
        const ns = set.concat([q]), c = canon(ns);
        if (!next.has(c)) next.set(c, ns);
      }));
    });
    level = next;
  }
  return Array.from(level.values());
}
function touchSolve(d) {
  const N = d.coins.length, nb = L.NB[d.grid], k = d.goal.touch;
  let best = null;
  const consider = (F) => {
    if (!L.testGoal(d, L.Wall(d, F)).ok) return;
    const bp = L.bestPlacement(d.coins, F, d.grid, 'translate');
    if (!best || bp.n > best.n) best = { n: bp.n, shape: F };
  };
  if (k >= 2) connectedSets(N, nb).forEach(consider);
  else {
    // pairs: keep as many coins as possible, try every way to add the rest nearby
    const bb = { q0: Infinity, q1: -Infinity, r0: Infinity, r1: -Infinity };
    d.coins.forEach((p) => { bb.q0 = Math.min(bb.q0, p[0]); bb.q1 = Math.max(bb.q1, p[0]); bb.r0 = Math.min(bb.r0, p[1]); bb.r1 = Math.max(bb.r1, p[1]); });
    const region = [];
    for (let q = bb.q0 - 3; q <= bb.q1 + 3; q++) for (let r = bb.r0 - 2; r <= bb.r1 + 2; r++) region.push([q, r]);
    const cw = L.Wall(d, d.coins).reduce((s, p) => [s[0] + p[0] / N, s[1] + p[1] / N], [0, 0]);
    region.sort((a, b) => Math.hypot(L.W(d, a)[0] - cw[0], L.W(d, a)[1] - cw[1]) - Math.hypot(L.W(d, b)[0] - cw[0], L.W(d, b)[1] - cw[1]));
    const combos = (arr, m, start, cur, out) => { if (cur.length === m) { out(cur.slice()); return; } for (let i = start; i < arr.length; i++) { cur.push(arr[i]); combos(arr, m, i + 1, cur, out); cur.pop(); } };
    for (let mv = 1; mv <= 3 && !best; mv++) {
      combos(d.coins.map((p, i) => i), N - mv, 0, [], (keepIdx) => {
        if (best) return;
        const keep = keepIdx.map((i) => d.coins[i]);
        const ks = new Set(keep.map(KEY));
        const cand = region.filter((p) => !ks.has(KEY(p)));
        combos(cand, mv, 0, [], (add) => { if (best) return; const F = keep.concat(add); if (L.testGoal(d, L.Wall(d, F)).ok) best = { n: N - mv, shape: F }; });
      });
    }
  }
  const dd = Object.assign({}, d, { goal: { shape: best.shape, turn: 'translate' } });
  return liftSolution(dd);
}

/* ---------- words: statements, hints, explanations ---------- */
const TEXT = require('./coins-text.js');

/* ---------- build ---------- */
const out = [];
const problems = [];
P.forEach((p) => {
  const d = p.data;
  let par = p.par;
  if (p.kind === 'lift') { d.sol = liftSolution(d); par = d.sol.length; d.rules = Object.assign({}, d.rules, { moves: par }); }
  else if (p.kind === 'slide') {
    const t0 = Date.now();
    const path = L.latticeSolve(d, d.coins, { depth: 7, cap: 800000 });
    if (!path) { problems.push(p.id + ': no sliding solution'); return; }
    d.sol = path; par = path.length; d.rules = Object.assign({}, d.rules, { moves: par });
    if (SHOW) console.log('  (' + p.id + ' searched in ' + (Date.now() - t0) + ' ms)');
  } else if (p.kind === 'touch') { d.sol = touchSolve(d); par = d.sol.length; d.rules = Object.assign({}, d.rules, { moves: par }); }
  else if (p.kind === 'sol' && d.rules && d.rules.moves && par == null) par = d.rules.moves;
  const t = TEXT[p.id] || {};
  const puzzle = { id: p.id, title: p.title, diff: p.diff };
  if (t.year) puzzle.year = t.year;
  if (t.source) puzzle.source = t.source;
  puzzle.text = t.text || ('TODO ' + p.id);
  if (t.hints) puzzle.hints = t.hints;
  if (t.explain) puzzle.explain = t.explain;
  if (t.links) puzzle.links = t.links;
  puzzle.concepts = t.concepts || (d.rules && d.rules.slide ? ['state-space'] : d.goal.rows ? ['combinatorics'] : d.goal.shape ? ['symmetry'] : []);
  if (!puzzle.concepts.length) delete puzzle.concepts;
  if (t.tags) puzzle.tags = t.tags;
  if (par != null) puzzle.par = par;
  // compact numbers
  const round = (v) => (Array.isArray(v) ? v.map(round) : typeof v === 'number' ? Math.round(v * 1000) / 1000 : v);
  ['coins', 'sol', 'fin'].forEach((k) => { if (d[k]) d[k] = round(d[k]); });
  if (d.goal.shape) d.goal.shape = round(d.goal.shape);
  puzzle.data = d;
  const r = E.verify(puzzle);
  if (!r.ok) problems.push(p.id + ': ' + r.err);
  if (r.warn) problems.push(p.id + ' (warning): ' + r.warn);
  if (SHOW) {
    console.log('\n' + p.id + ' — ' + p.title + ' (diff ' + p.diff + (par != null ? ', par ' + par : '') + ')');
    console.log('    start:\n' + draw(d, d.coins));
    if (d.goal.shape) console.log('    target:\n' + draw(d, d.goal.shape));
    if (d.sol) console.log('    moves: ' + d.sol.map((m) => JSON.stringify(m[0]) + '→' + JSON.stringify(m[1])).join('  '));
    const fin = L.finalOf(d);
    if (fin && d.grid) console.log('    end:\n' + draw({}, fin));
  }
  out.push(puzzle);
});
if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); }

const order = TEXT._order || out.map((p) => p.id);
out.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
const lines = [];
lines.push('/* The Puzzle Cabinet · data/coin-moves.js — made by tools/gen/coins.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'coin-moves', engine: 'coins', cat: 'coins', name: 'Coins on the table', order: 1,");
lines.push('  blurb: ' + JSON.stringify(TEXT._family.blurb) + ',');
lines.push('  origin: ' + JSON.stringify(TEXT._family.origin) + ',');
lines.push("  concepts: ['symmetry', 'combinatorics']");
lines.push('}, [');
out.forEach((p, i) => {
  const keys = Object.keys(p);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < out.length - 1 ? ',' : ''));
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/coin-moves.js'), lines.join('\n') + '\n');
console.log('coin-moves: ' + out.length + ' puzzles written; by difficulty ' + [1, 2, 3, 4, 5].map((k) => out.filter((p) => p.diff === k).length).join('/'));
if (problems.length) process.exitCode = 1;
