/* The Puzzle Cabinet · tools/gen/polyform.js
 *
 *   node tools/gen/polyform.js     writes data/polyiamonds.js and data/polyhexes.js
 *
 * Two kinds of boards, as for the polyominoes:
 *   - curated classics (the hexiamond rhombus and trefoil, sphinx rep-tiles,
 *     doubled and tripled hexiamonds, the tetrahex parallelogram, the
 *     trihex-and-tetrahex hexagon …): exact cover (js/lib/dlx.js) finds a
 *     solution, which is stored; the solver also counts the solutions;
 *   - grown boards: pieces are laid one after another, each touching the
 *     ones before (js/lib/polyform.js grow), and the union becomes the board.
 *     The way they were laid is the stored solution; the solver counts other
 *     solutions to judge the difficulty.
 * Everything is seeded, so a rerun writes the same puzzles.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'js/lib/polyform.js'));
require(path.join(ROOT, 'engines/polyform.js'));
const PF = C.Polyform;
const H = PF.H;
const T = PF.G.tri, X = PF.G.hex;
const LT = PF.LIB.tri, LH = PF.LIB.hex;
const K = (x, y) => x + ',' + y;
const NUM = PF.NUMW;
const HEXI = PF.HEXIAMONDS, TETRA = PF.TETRAHEXES, HEPTA = PF.HEPTA, PENTA = PF.PENTAHEX;
const TETRI = PF.SETS.tri.tetri, PENTI = PF.SETS.tri.penti, TRIHEX = PF.SETS.hex.tri;

/* ---------- regions ---------- */

// point in a convex polygon (either winding)
function inside(poly, p) {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const cr = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
    if (Math.abs(cr) < 1e-9) continue;
    const sg = Math.sign(cr);
    if (s && sg !== s) return false;
    s = sg;
  }
  return true;
}
// the triangles whose centres lie in any of these convex polygons
function triIn(polys) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  polys.forEach((pl) => pl.forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }));
  const out = [];
  for (let y = Math.floor(y0 / H) - 1; y <= Math.ceil(y1 / H) + 1; y++) {
    for (let x = Math.floor(x0 * 2) - 2; x <= Math.ceil(x1 * 2) + 2; x++) {
      const q = T.centre([x, y]);
      if (polys.some((pl) => inside(pl, q))) out.push([x, y]);
    }
  }
  return PF.norm('tri', out);
}
const hexagonPoly = (cx, cy, n) => [0, 1, 2, 3, 4, 5].map((k) => [cx + n * Math.cos(k * Math.PI / 3), cy + n * Math.sin(k * Math.PI / 3)]);
// a hexagon of side n made of triangles, centred on a lattice point
const triHexagon = (n) => triIn([hexagonPoly(0, 0, n)]);
// a triangle of side n pointing up
const triTriangle = (n) => triIn([[[0, 0], [n / 2, -n * H], [n, 0]]]);
// a parallelogram of a × b rhombi (2ab triangles), sloping to the right
function triPara(a, b) {
  const out = [];
  for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) {
    const px = x + y / 2, py = y * H;
    out.push(T.at([px + 0.5, py + H / 3]));
    out.push(T.at([px + 1, py + 2 * H / 3]));
  }
  return PF.norm('tri', out);
}
// the six-pointed star: two triangles of side n on one centre
function triStar(n) {
  const h = n * H;
  return triIn([[[-n / 2, h / 3], [n / 2, h / 3], [0, -2 * h / 3]], [[-n / 2, -h / 3], [n / 2, -h / 3], [0, 2 * h / 3]]]);
}
// three hexagons of side 2 around one corner
function triTrefoil() { return triIn([hexagonPoly(0, 0, 2), hexagonPoly(0, 4 * H, 2), hexagonPoly(3, 2 * H, 2)]); }
// a shape of triangles scaled up k times
function triScale(cells, k) { return triIn(cells.map((c) => T.vi(c).map((v) => { const p = T.vr(v); return [p[0] * k, p[1] * k]; }))); }
// hexagons: a parallelogram (a wide, b rows), a hexagon of side n, a triangle of side n
function hexPara(a, b) { const o = []; for (let y = 0; y < b; y++) for (let x = 0; x < a; x++) o.push([2 * x + y, y]); return PF.norm('hex', o); }
function hexHexagon(n) { const o = []; for (let q = -n + 1; q < n; q++) for (let r = -n + 1; r < n; r++) if (Math.abs(q + r) < n) o.push([2 * q + r, r]); return PF.norm('hex', o); }
function hexTriangle(n) { const o = []; for (let q = 0; q < n; q++) for (let r = 0; q + r < n; r++) o.push([2 * q + r, r]); return PF.norm('hex', o); }
function minus(cells, holes) { const hs = new Set(holes.map((c) => K(c[0], c[1]))); return cells.filter((c) => !hs.has(K(c[0], c[1]))); }
function centreOf(g, cells) {
  let sx = 0, sy = 0;
  cells.forEach((c) => { const q = PF.G[g].centre(c); sx += q[0]; sy += q[1]; });
  return PF.G[g].at([sx / cells.length, sy / cells.length]);
}

/* ---------- solving and counting ---------- */

const libOrder = { tri: Object.keys(LT), hex: Object.keys(LH) };
const sortNames = (g, names) => names.slice().sort((a, b) => libOrder[g].indexOf(a) - libOrder[g].indexOf(b));
const cellsOf = (g, names) => names.map((n) => PF.piece(g, n).cells);

function solve(g, region, names, seed, lim) {
  const r = PF.pack({ grid: g, region, pieces: cellsOf(g, names), max: 1, nodeLimit: lim || 2e7, shuffle: C.rng(seed) });
  if (!r.sols.length) return null;
  return r.sols[0].sort((a, b) => a.piece - b.piece);
}
// which pieces of a set fill the region (the set may have more than enough)
function choose(g, region, names, seed, lim) {
  const r = PF.pack({ grid: g, region, pieces: cellsOf(g, names), max: 1, nodeLimit: lim || 2e7, shuffle: C.rng(seed) });
  if (!r.sols.length) return null;
  return sortNames(g, r.sols[0].map((s) => names[s.piece]));
}
// how many ways (up to cap), not counting swaps of identical pieces
function countSols(g, region, names, cap, lim) { return PF.count(g, region, cellsOf(g, names), cap || 300, lim || 5e6); }
// the number of different solutions, turned and mirrored copies of the whole board counted once
// (for sets of different pieces: no solution can then be symmetric itself)
function distinct(g, region, n) { return Math.round(n / PF.symmetryOrder(g, region)); }
// the same, done properly for sets with repeated pieces: every tiling is listed, labelled by shape,
// and tilings that are turned or mirrored copies of each other are counted once
function distinctTilings(g, region, names, cap) {
  const G = PF.G[g];
  const types = Array.from(new Set(names));
  const want = types.map((n) => names.filter((q) => q === n).length);
  const col = new Map();
  region.forEach((c, i) => col.set(K(c[0], c[1]), i));
  const rows = [], meta = [];
  types.forEach((n, ti) => PF.orients(g, PF.piece(g, n).cells).forEach((o) => {
    const a = o.cells[0];
    region.forEach((c) => {
      const dx = c[0] - a[0], dy = c[1] - a[1];
      if (((dx + dy) & 1) !== 0) return;
      const r = [];
      for (const q of o.cells) { const cc = col.get(K(q[0] + dx, q[1] + dy)); if (cc == null) return; r.push(cc); }
      rows.push(r); meta.push({ ti, cells: o.cells.map((q) => [q[0] + dx, q[1] + dy]) });
    });
  }));
  const res = C.DLX.solve({ primary: region.length, rows, max: cap || 1e6, nodeLimit: 5e8 });
  // the board's own symmetries, as maps of cells
  const syms = [];
  for (let t = 0; t < 12; t++) {
    const f = (c) => G.at(PF.tpoint(G.centre(c), t));
    const moved = region.map(f), s = PF.shiftOf(moved);
    const mapped = moved.map((c) => [c[0] + s[0], c[1] + s[1]]);
    if (PF.key(g, mapped) !== PF.key(g, region)) continue;
    const sr = PF.shiftOf(region);
    syms.push((c) => { const q = f(c); return [q[0] + s[0] - sr[0], q[1] + s[1] - sr[1]]; });
  }
  const seen = new Set();
  let n = 0;
  res.forEach((sol) => {
    const cnt = types.map(() => 0);
    sol.forEach((ri) => cnt[meta[ri].ti]++);
    if (!cnt.every((v, i) => v === want[i])) return;
    n++;
    let best = null;
    syms.forEach((f) => {
      const lab = [];
      sol.forEach((ri) => meta[ri].cells.forEach((c) => { const q = f(c); lab.push(q[0] + ',' + q[1] + ':' + meta[ri].ti); }));
      const s = lab.sort().join(' ');
      if (best === null || s < best) best = s;
    });
    seen.add(best);
  });
  return { tilings: n, distinct: seen.size, capped: !!res.aborted || res.length >= (cap || 1e6) };
}

/* ---------- puzzles ---------- */

function puzzle(meta, g, region, names, placements, extra) {
  const p = {};
  Object.keys(meta).forEach((k) => { if (meta[k] !== undefined) p[k] = meta[k]; });
  p.data = Object.assign({ grid: g, pieces: names, sol: PF.solRows(g, region, placements) }, extra || {});
  return p;
}
function solved(meta, g, region, names, seed, extra) {
  names = sortNames(g, names);
  const pl = solve(g, region, names, seed);
  if (!pl) throw new Error('no solution for ' + meta.id);
  return puzzle(meta, g, region, names, pl, extra);
}
// a board laid flat for the screen, then solved
function flat(g, region) { return PF.landscape(g, region, []).region; }

function namer(list, seed) {
  const pool = C.rng(seed).shuffle(list.slice());
  let i = 0;
  const used = new Set();
  return () => {
    while (i < pool.length && used.has(pool[i])) i++;
    const w = i < pool.length ? pool[i++] : 'Board ' + i;
    used.add(w);
    return 'The ' + w;
  };
}

// pieces that repeat count for less: the second triamond is no new idea
function effectiveCount(names) {
  const mult = {};
  names.forEach((n) => { mult[n] = (mult[n] || 0) + 1; });
  return Math.round(Object.values(mult).reduce((s, m) => s + 1 + (m - 1) * 0.5, 0));
}
// difficulty of a grown board from its pieces, their size and the number of solutions
function gradeGrown(g, names, sols) {
  const k = effectiveCount(names);
  const area = cellsOf(g, names).reduce((s, c) => s + c.length, 0);
  const big = area / names.length >= (g === 'tri' ? 6 : 5);
  const s = sols.n;
  let d;
  if (k <= 2) d = 1;
  else if (k === 3) d = s >= 3 || !big ? 1 : 2;
  else if (k === 4) d = s >= 8 ? 1 : 2;
  else if (k === 5) d = s >= 10 ? 2 : 3;
  else if (k <= 7) d = s >= 40 ? 2 : 3;
  else if (k <= 9) d = s >= 80 ? 3 : 4;
  else d = s >= 60 ? 4 : 5;
  if (big && k >= 5 && d < 5 && s <= 4) d++;
  return d;
}

const seenBoards = new Set();
// a grown board that is new and has no holes
function grownPuzzle(g, names, seed, opts) {
  opts = opts || {};
  const rng = C.rng(seed);
  for (let tries = 0; tries < 400; tries++) {
    const gr = PF.grow(g, cellsOf(g, names), rng, opts);
    if (!gr || PF.holes(g, gr.region)) continue;
    const L = PF.landscape(g, gr.region, gr.placements);
    const b = PF.bbox(g, L.region);
    if (b.h < (opts.minH || 1.6)) continue;
    const key = g + PF.canon(g, L.region);
    if (seenBoards.has(key)) continue;
    seenBoards.add(key);
    const cnt = countSols(g, L.region, names, opts.cap || 300);
    return { region: L.region, placements: L.placements, sols: cnt };
  }
  throw new Error('could not grow a board for ' + names.join(' '));
}

const TEMPL = C.polyformTexts;
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function grownSet(g, prefix, start, list, name) {
  return list.map((it, k) => {
    const names = sortNames(g, it.names);
    const gr = grownPuzzle(g, names, it.seed, it.opts);
    const diff = it.diff || gradeGrown(g, names, gr.sols);
    const area = gr.region.length;
    const text = it.text || cap(TEMPL[it.seed % TEMPL.length](PF.describe(g, names), area, PF.G[g]));
    return puzzle({
      id: prefix + String(start + k).padStart(3, '0'), title: name(), diff, text,
      hints: it.hints, explain: it.explain, concepts: it.concepts,
      tags: (it.tags || []).concat(['grown'])
    }, g, gr.region, names, gr.placements, it.extra);
  });
}

// order by difficulty, keeping the sections' order within each level
function byDiff(out) {
  out.forEach((p, i) => { p._o = i; });
  out.sort((a, b) => a.diff - b.diff || a._o - b._o);
  out.forEach((p) => { delete p._o; });
  return out;
}

module.exports = { triIn, triHexagon, triTriangle, triPara, triStar, triTrefoil, triScale, hexPara, hexHexagon, hexTriangle, minus, solve, choose, countSols, distinct, puzzle, grownPuzzle, gradeGrown, PF, C };

/* ---------- facts for hints, from every solution ---------- */

// every solution (up to cap) of a set of distinct pieces
function allSols(g, region, names, cap) {
  const r = PF.pack({ grid: g, region, pieces: cellsOf(g, names), max: cap || 5000, nodeLimit: 5e7 });
  return r.sols;
}
// the tightest cells of a region (fewest neighbours inside it)
function tightCells(g, region) {
  const set = new Set(region.map((c) => K(c[0], c[1])));
  const nn = (c) => PF.G[g].nb(c).filter((q) => set.has(K(q[0], q[1]))).length;
  const least = Math.min.apply(null, region.map(nn));
  return region.filter((c) => nn(c) === least);
}
// which pieces ever fill any of these cells, over all solutions
function piecesAt(sols, names, cells) {
  const ks = new Set(cells.map((c) => K(c[0], c[1])));
  const found = new Set();
  sols.forEach((s) => s.forEach((pl) => { if (pl.cells.some((c) => ks.has(K(c[0], c[1])))) found.add(names[pl.piece]); }));
  return found;
}
const fullOf = (g, n) => PF.LIB[g][n].full;
const theList = (g, list) => PF.joinAnd(list.map((n) => 'the ' + fullOf(g, n)));

/* ======================================================================
 * Polyiamonds
 * ==================================================================== */

function polyiamonds() {
  const g = 'tri';
  const out = [];
  const name = namer(C.polyformWords.tri, 31);
  let gn = 1;
  const grown = (list) => { const r = grownSet(g, 'tri-g', gn, list, name); gn += list.length; out.push.apply(out, r); return r; };
  const rng = C.rng(1961);
  const pick = (list, k) => rng.shuffle(list.slice()).slice(0, k);

  // 1. warm-ups: two or three small pieces
  const warm = grown([
    { names: ['I3', 'T4'], seed: 101 },
    { names: ['D2', 'C4'], seed: 102 },
    { names: ['I4', 'T4'], seed: 103 },
    { names: ['C4', 'C4'], seed: 104 },
    { names: ['I3', 'I3', 'D2'], seed: 105 },
    { names: ['T4', 'T4', 'I4'], seed: 106 },
    { names: ['I4', 'C4', 'D2'], seed: 107 },
    { names: ['C4', 'T4', 'I3'], seed: 108 },
    { names: ['D2', 'D2', 'I3', 'T4'], seed: 109 }
  ]);
  warm[0].text = 'Squares are not the only tiles. These pieces are made of equilateral triangles — **polyiamonds**, named after the *diamond*, two triangles joined. Fit these two into the board: drag a piece on, double-click it (or press R) to turn it by 60°, press X to turn it over.';
  warm[0].hints = ['A piece turned by 60° has all its triangles pointing the other way. If it will not sit, turn it once more.', 'Look at the sharpest corner of the board: which piece has a point like that?'];

  // 2. the three tetriamonds, and why one set is lopsided
  const tone = grown([{ names: TETRI.slice(), seed: 201, concepts: ['coloring-argument'], tags: ['tetriamond'] }])[0];
  tone.text = 'There are three **tetriamonds**, the shapes of four triangles: the straight one, the bent one and the triangle. Fit one of each into this board.';
  tone.explain = 'Why such a crooked board, and not a tidy parallelogram? Press **Two colours**: the triangles of the grid point up and down in turn, and every parallelogram has exactly as many of each. The straight and the bent tetriamond always cover two of each kind, however they lie. The triangle tetriamond covers three of one kind and one of the other. So the three together can never balance — no parallelogram, ever.';
  out.push(solved({
    id: 'tri-tetri-triangle', title: 'Four Triangles Make a Triangle', diff: 1,
    text: 'Four triangle tetriamonds make one big triangle, twice as tall. Where does the fourth one go?',
    hints: ['Three of them sit in the three corners.', 'The last one fills the middle — upside down.'],
    explain: 'A shape that can be cut into smaller copies of itself is a **rep-tile**. The triangle is the simplest: four copies make one twice the size, and each of those can be cut again, for ever. The [[f:rep-tiles|rep-tiles]] drawer has more.',
    concepts: ['recursion'], tags: ['rep-tile'], links: ['tri-sphinx-4']
  }, g, triTriangle(4), ['T4', 'T4', 'T4', 'T4'], 1));
  const two = TETRI.concat(TETRI);
  const hx2 = triHexagon(2), c1 = distinctTilings(g, hx2, two);
  out.push(solved({
    id: 'tri-tetri-hexagon', title: 'Two Sets, One Hexagon', diff: c1.distinct <= 2 ? 3 : 2,
    text: 'One set of tetriamonds is lopsided, but two sets can balance. Make a hexagon from six pieces: two of each tetriamond.',
    hints: ['Press **Two colours**: the hexagon has 12 triangles pointing up and 12 pointing down.', 'The two triangle tetriamonds must point opposite ways — one covering three up-triangles, the other three down-triangles.'],
    explain: (c1.distinct === 1 ? 'There is only one way, not counting turned and mirrored copies of the whole hexagon. In it' : 'There are ' + c1.distinct + ' ways, not counting turned and mirrored copies of the whole hexagon. In every one of them') + ' the two triangle tetriamonds point opposite ways, so that their lopsidedness cancels.',
    concepts: ['coloring-argument', 'symmetry'], links: ['tri-tetri-3x4']
  }, g, hx2, two, 3));
  const p34 = triPara(4, 3), c2 = distinctTilings(g, p34, two);
  out.push(solved({
    id: 'tri-tetri-3x4', title: 'Two Sets, One Parallelogram', diff: 2,
    text: 'Two sets of tetriamonds again, now in a parallelogram three rows high and four rhombi long.',
    hints: ['The two triangle tetriamonds point opposite ways here too.', 'The sharp corners take a point of the triangle or the tip of the straight tetriamond.'],
    explain: 'There are ' + c2.distinct + ' ways. The flatter 2 × 6 parallelogram has the same 24 triangles, half up and half down — and the solver finds no way at all to fill it. Balance is necessary, not sufficient.',
    concepts: ['coloring-argument'], links: ['tri-tetri-hexagon']
  }, g, p34, two, 4));

  // 3. the four pentiamonds, alone and with the tetriamonds
  const pg = grown([
    { names: PENTI.slice(), seed: 301, tags: ['pentiamond'] },
    { names: PENTI.slice(), seed: 302, tags: ['pentiamond'] },
    { names: ['I5', 'L5', 'T4'], seed: 303 },
    { names: ['C5', 'P5', 'C4', 'I3'], seed: 304 }
  ]);
  pg[0].text = 'There are four **pentiamonds**, the shapes of five triangles. Every one of them is lopsided: three triangles point one way and two the other. Fit all four into the board.';
  const seven = TETRI.concat(PENTI);
  const r44 = triPara(4, 4), c3 = countSols(g, r44, seven, 5000);
  out.push(solved({
    id: 'tri-seven-4x4', title: 'Seven Pieces, One Rhombus', diff: 3,
    text: 'All three tetriamonds and all four pentiamonds — 32 triangles — make a rhombus with sides of four.',
    hints: ['In most solutions the triangle tetriamond fills one of the two sharp corners.', 'The bent tetriamond and the C pentiamond never fill a sharp corner, and the straight pentiamond always touches the edge.'],
    explain: 'The solver counts ' + distinct(g, r44, c3.n) + ' ways, turned and mirrored copies of the whole rhombus counted once. The lopsided pieces have to cancel: the triangle tetriamond (two extra of one kind) and the four pentiamonds (one extra each) must point so that the extras add up to nothing.',
    concepts: ['coloring-argument'], links: ['tri-seven-2x8']
  }, g, r44, seven, 5));
  const s28 = triPara(8, 2), c4 = countSols(g, s28, seven, 100);
  out.push(solved({
    id: 'tri-seven-2x8', title: 'The Narrow Road', diff: 4,
    text: 'The same seven pieces, now in a strip only two rows high and eight rhombi long. There are just **' + NUM[distinct(g, s28, c4.n)] + '** ways.',
    hints: ['In both solutions the triangle tetriamond fills one of the two sharp corners.', 'The other sharp corner takes the L pentiamond in one solution and the P pentiamond in the other.'],
    links: ['tri-seven-4x4']
  }, g, s28, seven, 6));
  const pp = PENTI.concat(PENTI), r45 = triPara(5, 4), c5 = distinctTilings(g, r45, pp);
  out.push(solved({
    id: 'tri-penti-4x5', title: 'Two Sets of Pentiamonds', diff: 3,
    text: 'Two of each pentiamond — eight pieces, 40 triangles — make a parallelogram four rows high and five rhombi long.',
    explain: 'A single set cannot even make the little 2 × 5 parallelogram — the solver tried — but two sets fill this one in ' + c5.distinct + ' ways.',
    concepts: ['exact-cover']
  }, g, r45, pp, 7));
  grown([
    { names: seven.slice(), seed: 311, opts: { aspect: 1.5 } },
    { names: seven.slice(), seed: 312, opts: { aspect: 1.3 } }
  ]);

  // 4. the sphinx
  const sph2 = triScale(LT.P6.cells, 2);
  const pl2 = solve(g, sph2, ['P6', 'P6', 'P6', 'P6'], 11);
  // (the tiling is unique: the head faces the big sphinx's way, the other three are mirror images)
  if (pl2.filter((s) => s.t >= 6).length !== 3) throw new Error('the sphinx hints no longer match the tiling');
  out.push(puzzle({
    id: 'tri-sphinx-4', title: 'The Sphinx Rep-tile', diff: 2,
    text: 'This hexiamond is the **sphinx** — it does look like one, lying down with its head up. Four sphinxes make a sphinx twice the size. Some of them will have to be turned over.',
    hints: ['One small sphinx makes the big sphinx\'s head, facing the same way as the big one.', 'The other three are all turned over. Two lie along the bottom edge, the same way up; the third fits between them, upside down.'],
    explain: 'The sphinx is a **rep-tile**: it can be cut into 4, 9, 16 — any square number — smaller copies of itself, some of them mirror images. It is the only pentagon known to do this with copies all the same size. Repeat the cutting for ever and the pieces tile the whole plane, never repeating.',
    concepts: ['recursion', 'symmetry'], tags: ['rep-tile', 'sphinx'], links: ['tri-sphinx-9', 'tri-tetri-triangle']
  }, g, sph2, ['P6', 'P6', 'P6', 'P6'], pl2));
  const sph3 = triScale(LT.P6.cells, 3), c6 = countSols(g, sph3, Array(9).fill('P6'), 100);
  out.push(solved({
    id: 'tri-sphinx-9', title: 'Nine Sphinxes', diff: 3,
    text: 'Nine sphinxes make a sphinx three times the size. The solver finds exactly **' + NUM[c6.n] + '** ways.',
    hints: ['Start with the three sharp corners — the tip of the head and the two ends of the base. Each is the sharp point of one small sphinx.', 'Some of the nine are turned over: two, three or four of them, depending on which of the four solutions you are heading for.'],
    explain: 'A sphinx three times the size has 54 triangles: 30 pointing one way and 24 the other. That is why the twelve different hexiamonds can never build it, although they build most other hexiamonds at three times the size: of the twelve, only the sphinx and the yacht are lopsided, each by two triangles, so together they can make up a difference of four — never six.',
    concepts: ['recursion', 'coloring-argument'], tags: ['rep-tile', 'sphinx'], links: ['tri-sphinx-4', 'tri-sphinx-16']
  }, g, sph3, Array(9).fill('P6'), 12));
  const sph4 = triScale(LT.P6.cells, 4);
  out.push(solved({
    id: 'tri-sphinx-16', title: 'Sixteen Sphinxes', diff: 4,
    text: 'Sixteen sphinxes, one sphinx four times the size.',
    hints: ['A sphinx four times the size is four sphinxes twice the size, put together the way four small sphinxes make one.', 'So build four double sphinxes (four small ones each) and arrange them like [[tri-sphinx-4|the first puzzle]].'],
    explain: 'Rep-tiles nest: the big sphinx splits into four sphinxes of twice the size, and each of those into four small ones. Six sphinxes, by the way, cover 36 triangles — exactly a triangle with sides of six — but the solver finds no way to arrange them into one.',
    concepts: ['recursion'], tags: ['rep-tile', 'sphinx'], links: ['tri-sphinx-9']
  }, g, sph4, Array(16).fill('P6'), 13));
  const dsN = choose(g, sph2, HEXI, 14);
  out.push(solved({
    id: 'tri-sphinx-hexi', title: 'A Sphinx of Strangers', diff: 3,
    text: 'The double sphinx again, but this time from four *different* hexiamonds: ' + theList(g, dsN) + '.',
    hints: ['Press **Two colours**: the big sphinx has 14 triangles pointing one way and 10 the other.', 'Only the sphinx and the yacht are lopsided (four of one kind, two of the other). Both must point so their extras add up.'],
    explain: 'Doubling a shape doubles its lopsidedness: the sphinx has two more triangles one way than the other, the double sphinx four more. Among the twelve hexiamonds only the sphinx and the yacht are lopsided, two each — so every way of building the double sphinx from different hexiamonds uses both, pointing the same way.',
    concepts: ['coloring-argument'], tags: ['sphinx'], links: ['tri-sphinx-4']
  }, g, sph2, dsN, 15));

  // 5. doubled and tripled hexiamonds
  let first = true;
  // every set of four that builds the double; the pieces used least so far are preferred, for variety
  const use = new Map(HEXI.map((n) => [n, 0]));
  const subsets = (arr, k) => { const o = []; (function r(s, j) { if (s.length === k) { o.push(s.slice()); return; } for (let q = j; q < arr.length; q++) { s.push(arr[q]); r(s, q + 1); s.pop(); } })([], 0); return o; };
  const vr = C.rng(404);
  HEXI.forEach((n, i) => {
    if (n === 'P6') return;
    const reg = flat(g, triScale(LT[n].cells, 2));
    const works = (s) => !!solve(g, reg, s, 1, 2e5);
    let cands = subsets(HEXI.filter((q) => q !== n), 4).filter(works);
    if (!cands.length) cands = subsets(HEXI, 4).filter((s) => s.includes(n) && works(s));
    if (!cands.length) return;
    const score = (s) => s.reduce((a, q) => a + use.get(q), 0);
    const low = Math.min.apply(null, cands.map(score));
    const names = sortNames(g, vr.pick(cands.filter((s) => score(s) === low)));
    names.forEach((q) => use.set(q, use.get(q) + 1));
    const cnt = countSols(g, reg, names, 50);
    const full = LT[n].full;
    out.push(solved({
      id: 'tri-double-' + full, title: 'The ' + cap(full) + ', Twice as Big', diff: cnt.n <= 2 ? 3 : 2,
      text: (first ? 'Every length doubled, the area four times as big: 24 triangles, the room of four hexiamonds. ' : '') + 'Build the **' + full + '** at twice its size from ' + theList(g, names) + (cands.length === 1 ? ' — the only four hexiamonds that can do it.' : '.'),
      explain: n === 'F6' ? 'The yacht is lopsided, like the sphinx: four triangles one way, two the other. Doubled, it is lopsided by four, and only the yacht and the sphinx together can supply that — so this one needs the yacht itself.' : (n === 'C6' ? 'Leaving aside the lopsided sphinx and yacht, the chevron is the only hexiamond whose double cannot be built from four of the *other* eleven — the solver tried every way — so here it helps to build itself.' : (first ? 'Curiously, the bar, the crook, the butterfly and the hook can each be doubled by just one set of four other hexiamonds — and it is the same set every time: the sphinx, the lobster, the chevron and the yacht. The solver tried all 330 sets of four for each.' : undefined)),
      concepts: n === 'F6' ? ['coloring-argument'] : undefined,
      tags: ['scaled', 'duplication']
    }, g, reg, names, 420 + i));
    first = false;
  });
  first = true;
  HEXI.forEach((n, i) => {
    if (n === 'P6' || n === 'F6') return;
    const reg = flat(g, triScale(LT[n].cells, 3));
    const names = choose(g, reg, HEXI.filter((q) => q !== n), 500 + i);
    if (!names) return;
    const cnt = countSols(g, reg, names, 30);
    const left = HEXI.filter((q) => q !== n && !names.includes(q));
    const full = LT[n].full;
    out.push(solved({
      id: 'tri-triple-' + full, title: 'The ' + cap(full) + ', Three Times Over', diff: cnt.n <= 3 ? 5 : 4,
      text: 'Build the **' + full + '** at three times its size — 54 triangles — from nine hexiamonds: all of them except the ' + full + ' itself, the ' + LT[left[0]].full + ' and the ' + LT[left[1]].full + '.',
      explain: first ? 'Of the twelve hexiamonds, nine can be built at three times their size from nine of the other eleven — the cabinet\'s solver found a way for each, and they are all in this drawer. The butterfly cannot, and the sphinx and the yacht are too lopsided even to try.' : undefined,
      tags: ['scaled', 'triplication']
    }, g, reg, names, 520 + i));
    first = false;
  });

  // 6. the twelve hexiamonds together
  const rh = triPara(6, 6);
  const rhSols = allSols(g, rh, HEXI, 2000);
  const corners = tightCells(g, rh);
  const atCorner = HEXI.filter((n) => piecesAt(rhSols, HEXI, corners).has(n));
  const never = HEXI.filter((n) => !atCorner.includes(n));
  const classic = (meta, region, names, seed, extra) => out.push(solved(Object.assign({ tags: ['classic'] }, meta), g, region, names, seed, Object.assign({ classic: 1 }, extra || {})));
  classic({
    id: 'tri-hexi-6x6', title: 'The Hexiamond Rhombus', diff: 4,
    text: 'The twelve **hexiamonds** — every shape of six triangles: bar, crook, crown, sphinx, snake, yacht, chevron, signpost, lobster, hook, hexagon and butterfly. Together they cover 72 triangles, and they fill this rhombus with sides of six in **' + distinct(g, rh, rhSols.length) + '** ways.',
    hints: ['The two sharp corners are the hardest spots. In no solution at all is a sharp corner filled by ' + theList(g, never) + '.', 'The sphinx and the yacht are the usual corner pieces: each of them fills a sharp corner in six solutions out of seven.', 'The bar lies against the edge in almost every solution.'],
    explain: 'The solver finds ' + rhSols.length + ' fillings, which are ' + distinct(g, rh, rhSols.length) + ' different solutions, each turned and mirrored four ways. Its long cousin, the 3 × 12 parallelogram, has the same 72 triangles with the same balance of ups and downs — and not a single solution.',
    concepts: ['exact-cover', 'symmetry'], links: ['tri-hexi-4x9', 'tri-hexi-trefoil']
  }, rh, HEXI, 1961);
  const p49 = triPara(9, 4), c49 = countSols(g, p49, HEXI, 2000, 5e7);
  classic({
    id: 'tri-hexi-4x9', title: 'The Long Parallelogram', diff: 5,
    text: 'The twelve hexiamonds in a parallelogram four rows high and nine rhombi long. The solver finds **' + distinct(g, p49, c49.n) + '** ways.',
    hints: ['The sphinx fills one of the two sharp corners in nine solutions out of ten.', 'The butterfly touches the edge in every solution, and the bar and the chevron nearly always do.'],
    links: ['tri-hexi-6x6']
  }, p49, HEXI, 49);
  const tre = flat(g, triTrefoil()), ctr = countSols(g, tre, HEXI, 5000, 5e7);
  classic({
    id: 'tri-hexi-trefoil', title: 'The Trefoil', diff: 4,
    text: 'Three hexagons with sides of two, each touching the other two, make a trefoil of 72 triangles. Fill it with the twelve hexiamonds: there are **' + distinct(g, tre, ctr.n) + '** ways.',
    hints: ['The hexagon piece sits wholly inside one lobe in more than nine solutions out of ten.', 'The bar nearly always bridges two of the lobes, across the place where they meet.'],
    explain: 'By way of contrast, the ring you get from a hexagon of side four with a hexagon of side two cut from its middle also has 72 triangles, perfectly balanced — and no solution at all.',
    concepts: ['exact-cover', 'symmetry'], links: ['tri-hexi-6x6']
  }, tre, HEXI, 72);
  // the rhombus with pieces already in place
  const full = solve(g, rh, HEXI, 1961);
  [[8, 2, 'Eight Pieces In'], [6, 3, 'Six Pieces In'], [4, 3, 'Four Pieces In'], [2, 4, 'Two Pieces In']].forEach(([k, diff, t], i) => {
    const given = C.rng(800 + i).shuffle(HEXI.map((x, j) => j)).slice(0, k).sort((a, b) => a - b);
    out.push(puzzle({
      id: 'tri-hexi-6x6-given' + k, title: 'Rhombus, ' + t, diff,
      text: 'The hexiamond rhombus with ' + NUM[k] + ' pieces already pinned in place. Fit the other ' + NUM[12 - k] + ' around them.',
      tags: ['given'], links: ['tri-hexi-6x6']
    }, g, rh, HEXI, full, { given }));
  });
  const st = flat(g, triStar(6)), stN = choose(g, st, HEXI, 81), stS = allSols(g, st, stN, 5000);
  const stInner = stN.filter((n) => !piecesAt(stS, stN, tightCells(g, st)).has(n));
  const stD = distinct(g, st, stS.length);
  out.push(solved({
    id: 'tri-hexi-star', title: 'The Six-Pointed Star', diff: stD <= 2 ? 4 : 3,
    text: 'Two big triangles laid across each other make a six-pointed star of 48 triangles. Fill it with eight hexiamonds: ' + theList(g, stN) + '.' + (stD === 1 ? ' There is exactly one way.' : ''),
    hints: ['The star has six sharp points, and a point can only be filled by a piece with a sharp tip of its own.', stInner.length ? cap(theList(g, stInner)) + ' never reach a point: ' + (stInner.length === 1 ? 'it stays' : 'they stay') + ' in the middle.' : 'The middle of the star is a hexagon with sides of two.'],
    explain: stD === 1 ? 'The solver finds ' + stS.length + ' fillings, and they are all one solution, turned and mirrored the twelve ways the star allows.' : 'The solver finds ' + stD + ' ways with these eight, turned and mirrored stars counted once.',
    concepts: ['symmetry'], tags: ['star']
  }, g, st, stN, 82));
  const h3 = triHexagon(3), h3N = choose(g, h3, HEXI, 91), ch3 = countSols(g, h3, h3N, 5000);
  out.push(solved({
    id: 'tri-hexi-hexagon', title: 'A Hexagon of Nine', diff: ch3.n <= 24 ? 4 : 3,
    text: 'A hexagon with sides of three holds 54 triangles — nine hexiamonds. Fill it with ' + theList(g, h3N) + '.',
    hints: ['The bar lies along the edge of the big hexagon in every solution; the butterfly and the hexagon piece in almost every one.'],
    explain: 'The solver finds ' + distinct(g, h3, ch3.n) + ' ways with these nine, the twelve turns and mirror images of the whole hexagon counted once.',
    concepts: ['symmetry']
  }, g, h3, h3N, 92));

  // 7. grown boards of hexiamonds
  const hx = [];
  for (let i = 0; i < 3; i++) hx.push({ names: pick(HEXI, 2), seed: 600 + i });
  for (let i = 0; i < 3; i++) hx.push({ names: pick(HEXI, 3), seed: 610 + i });
  for (let i = 0; i < 3; i++) hx.push({ names: pick(HEXI, 4), seed: 620 + i });
  for (let i = 0; i < 3; i++) hx.push({ names: pick(HEXI, 5), seed: 630 + i, opts: { aspect: 1.4 } });
  for (let i = 0; i < 3; i++) hx.push({ names: pick(HEXI, 6 + (i % 2)), seed: 640 + i, opts: { aspect: 1.5 } });
  for (let i = 0; i < 3; i++) hx.push({ names: pick(HEXI, 8 + (i % 2)), seed: 650 + i, opts: { aspect: 1.6 } });
  for (let i = 0; i < 2; i++) hx.push({ names: HEXI.slice(), seed: 660 + i, opts: { aspect: 1.6 } });
  const hg = grown(hx);
  hg[0].text = 'Twelve shapes can be made from six triangles: the **hexiamonds**. They have names — this drawer uses the traditional ones, from the bar to the butterfly. Start with two: ' + PF.describe(g, hx[0].names) + '.';

  // 8. heptiamonds
  const hp = [
    ['tri-hepta-2x7', 'Four Heptiamonds', 3, triPara(7, 2), 701],
    ['tri-hepta-3x7', 'Six Heptiamonds', 4, triPara(7, 3), 702],
    ['tri-hepta-4x7', 'Eight Heptiamonds', 5, triPara(7, 4), 703]
  ];
  hp.forEach(([id, title, diff, reg, seed], i) => {
    const names = choose(g, reg, HEPTA, seed);
    const b = PF.cbox(reg);
    out.push(solved({
      id, title, diff,
      text: (i === 0 ? 'Seven triangles can be joined in 24 different ways: the **heptiamonds**. ' : '') + cap(PF.describe(g, names)) + ' make a parallelogram ' + NUM[b.y1 + 1] + ' rows high and seven rhombi long.',
      tags: ['heptiamond']
    }, g, reg, names, seed + 20));
  });
  grown([
    { names: pick(HEPTA, 3), seed: 710 },
    { names: pick(HEPTA, 4), seed: 711, opts: { aspect: 1.4 } },
    { names: pick(HEPTA, 5), seed: 712, opts: { aspect: 1.5 } },
    { names: pick(HEPTA, 6), seed: 713, opts: { aspect: 1.5 } }
  ]);
  return byDiff(out);
}
module.exports.polyiamonds = polyiamonds;

/* ======================================================================
 * Polyhexes
 * ==================================================================== */

function polyhexes() {
  const g = 'hex';
  const out = [];
  const name = namer(C.polyformWords.hex, 41);
  let gn = 1;
  const grown = (list) => { const r = grownSet(g, 'hex-g', gn, list, name); gn += list.length; out.push.apply(out, r); return r; };
  const rng = C.rng(1967);
  const pick = (list, k) => rng.shuffle(list.slice()).slice(0, k);
  const classic = (meta, region, names, seed, extra) => out.push(solved(Object.assign({ tags: ['classic'] }, meta), g, region, names, seed, Object.assign({ classic: 1 }, extra || {})));

  // 1. warm-ups: dihexes and trihexes
  const warm = grown([
    { names: ['I2', 'I2'], seed: 101 },
    { names: ['I2', 'I3'], seed: 102 },
    { names: ['V3', 'A3'], seed: 103 },
    { names: ['I3', 'V3'], seed: 104 },
    { names: ['I2', 'I2', 'A3'], seed: 105 },
    { names: ['V3', 'V3', 'I2'], seed: 106 },
    { names: ['I3', 'I3', 'A3'], seed: 107 }
  ]);
  warm[0].text = 'Now the cells are hexagons, as in a honeycomb, and the pieces made of them are **polyhexes**. Two dihexes to start: drag a piece onto the board, double-click it (or press R) to turn it by 60°, press X to turn it over.';

  // 2. the three trihexes
  const t3 = grown([{ names: TRIHEX.slice(), seed: 201, tags: ['trihex'] }, { names: TRIHEX.concat(['I2']), seed: 202 }]);
  t3[0].text = 'There are three **trihexes**, the shapes of three hexagons: the straight one, the bent one and the triangle. Fit one of each into this board.';
  t3[0].explain = 'Why not a neat parallelogram, three by three? Press **Three colours**: the honeycomb can be coloured so that neighbours always differ, and the 3 × 3 parallelogram has three cells of each colour. The straight and the triangle trihex cover one cell of each colour wherever they lie; the bent trihex always covers two of one colour and one of another. So the three pieces together cover four, three and two of the colours — never three of each.';
  t3[0].concepts = ['coloring-argument'];
  const hole = minus(hexHexagon(3), [[4, 2]]), two3 = TRIHEX.concat(TRIHEX), ch = distinctTilings(g, hole, two3);
  out.push(solved({
    id: 'hex-tri-hole', title: 'The Honeycomb with a Hole', diff: 2,
    text: 'Two sets of trihexes — six pieces, 18 hexagons — fill a hexagon with sides of three whose middle cell is missing.',
    hints: ['The six corner cells of the hexagon touch only three others in the board: start there.', 'In every solution each bent trihex covers one of the corners.', 'Press **Three colours**: the board has six cells of each colour. Only the bent trihexes are unbalanced, so the two of them must make up for each other.'],
    explain: 'The solver counts ' + ch.distinct + ' ways, not counting turned and mirrored copies of the whole honeycomb. In every one, the two bent trihexes cover the colours in opposite measure: where one has two cells of a colour, the other has none.',
    concepts: ['coloring-argument', 'symmetry'], tags: ['trihex'], links: [t3[0].id]
  }, g, hole, two3, 3));

  // 3. the seven tetrahexes
  const t4 = [];
  for (let i = 0; i < 3; i++) t4.push({ names: pick(TETRA, 2), seed: 300 + i });
  for (let i = 0; i < 3; i++) t4.push({ names: pick(TETRA, 3), seed: 310 + i });
  for (let i = 0; i < 3; i++) t4.push({ names: pick(TETRA, 4), seed: 320 + i });
  for (let i = 0; i < 3; i++) t4.push({ names: pick(TETRA, 5), seed: 330 + i, opts: { aspect: 1.4 } });
  for (let i = 0; i < 4; i++) t4.push({ names: TETRA.slice(), seed: 340 + i, opts: { aspect: 1.2 + (i % 3) * 0.2 } });
  const tg = grown(t4);
  tg[0].text = 'Four hexagons join in seven ways, the **tetrahexes**, known as the bar, the worm, the pistol, the propeller, the arch, the bee and the wave. Here are two of them: ' + PF.describe(g, t4[0].names) + '.';
  const p47 = hexPara(7, 4), s47 = allSols(g, p47, TETRA, 1000);
  const neverC = TETRA.filter((n) => !piecesAt(s47, TETRA, tightCells(g, p47)).has(n));
  classic({
    id: 'hex-tetra-4x7', title: 'The Tetrahex Parallelogram', diff: 4,
    text: 'The seven tetrahexes cover 28 hexagons: a parallelogram four rows high and seven cells long. The solver finds only **' + NUM[distinct(g, p47, s47.length)] + '** ways.',
    hints: ['The two sharp corners of the parallelogram are the places to start. ' + cap(theList(g, neverC)) + (neverC.length === 1 ? ' never fills' : ' never fill') + ' one of them.', 'The bee fills a sharp corner in eight solutions out of nine.'],
    explain: 'Twenty-eight is also a triangle number, but the triangle with sides of seven cannot be made from the seven tetrahexes, and nor can the long two-row strip: the solver tried every arrangement of both.',
    concepts: ['exact-cover'], links: ['hex-tetra2-7x8']
  }, p47, TETRA, 47);
  const tt = TETRA.concat(TETRA);
  out.push(solved({
    id: 'hex-tetra2-7x8', title: 'Two Sets, Seven by Eight', diff: 4,
    text: 'Two of each tetrahex — fourteen pieces, 56 hexagons — make a parallelogram seven rows high and eight cells long.',
    hints: ['Seven rows by eight is two parallelograms of seven rows by four, side by side.', 'A parallelogram of seven rows by four is [[hex-tetra-4x7|the tetrahex parallelogram]] turned over — and each set of seven can fill one.'],
    links: ['hex-tetra-4x7', 'hex-tetra2-4x14']
  }, g, hexPara(8, 7), tt, 78));
  out.push(solved({
    id: 'hex-tetra2-4x14', title: 'Two Sets, Four by Fourteen', diff: 5,
    text: 'The same fourteen pieces, now in a long parallelogram four rows high and fourteen cells long.',
    hints: ['Two tetrahex parallelograms of 4 × 7 side by side make this board.', 'So solve [[hex-tetra-4x7|the 4 × 7]] twice, once with each set.'],
    links: ['hex-tetra-4x7', 'hex-tetra2-7x8']
  }, g, hexPara(14, 4), tt, 414));

  // 4. trihexes and tetrahexes together
  const all10 = TRIHEX.concat(TETRA), h4 = hexHexagon(4), c10 = countSols(g, h4, all10, 200000, 5e7);
  classic({
    id: 'hex-hexagon-4', title: 'The Big Honeycomb', diff: 3,
    text: 'The three trihexes and the seven tetrahexes cover 37 hexagons — exactly a hexagon with sides of four. Fill it.',
    hints: ['Start with the six corners: each corner cell touches only three others. The bar covers one of them in nine solutions out of ten.', 'The propeller is the odd one out: in half of all solutions it keeps clear of the edge altogether, and it covers the very middle cell more often than any other piece.'],
    explain: 'The solver counts ' + c10.n + ' fillings: ' + distinct(g, h4, c10.n) + ' different solutions, each turned and mirrored twelve ways. Plenty of room to find one.',
    concepts: ['exact-cover', 'symmetry']
  }, h4, all10, 37);
  grown([
    { names: all10.slice(), seed: 401, opts: { aspect: 1.4 } },
    { names: all10.slice(), seed: 402, opts: { aspect: 1.6 } }
  ]);
  const small = ['H1', 'I2'].concat(TRIHEX, TETRA);
  out.push(solved({
    id: 'hex-small-4x10', title: 'Every Piece up to Four', diff: 3,
    text: 'Every polyhex with one, two, three or four cells — twelve pieces, 40 hexagons — in a parallelogram four rows high and ten long.',
    hints: ['Keep the monohex for the very end: it fills whatever single hole is left.'],
    links: ['hex-small-5x8']
  }, g, hexPara(10, 4), small, 410));
  out.push(solved({
    id: 'hex-small-5x8', title: 'Every Piece up to Four, Squarer', diff: 3,
    text: 'The same twelve pieces in a parallelogram five rows high and eight long.',
    links: ['hex-small-4x10']
  }, g, hexPara(8, 5), small, 411));

  // 5. pentahexes
  const pbox = [
    ['hex-penta-4x5', 'Four Pentahexes', 2, hexPara(5, 4), 501],
    ['hex-penta-5x6', 'Six Pentahexes', 3, hexPara(6, 5), 502],
    ['hex-penta-5x8', 'Eight Pentahexes', 4, hexPara(8, 5), 503],
    ['hex-penta-5x10', 'Ten Pentahexes', 4, hexPara(10, 5), 504],
    ['hex-penta-6x10', 'Twelve Pentahexes', 5, hexPara(10, 6), 505]
  ];
  pbox.forEach(([id, title, diff, reg, seed], i) => {
    const names = choose(g, reg, PENTA, seed);
    const b = PF.cbox(reg);
    out.push(solved({
      id, title, diff,
      text: (i === 0 ? 'Five hexagons join in 22 ways, the **pentahexes**; the cabinet numbers them 1 to 22. ' : '') + cap(PF.describe(g, names)) + ' make a parallelogram ' + NUM[b.y1 + 1] + ' rows high and ' + NUM[reg.length / (b.y1 + 1)] + ' cells long.',
      tags: ['pentahex']
    }, g, reg, names, seed + 20));
  });
  const ptri = hexTriangle(10), ptN = choose(g, ptri, PENTA, 511);
  out.push(solved({
    id: 'hex-penta-triangle', title: 'A Triangle of Eleven', diff: 5,
    text: 'A triangle with sides of ten holds 55 hexagons: room for eleven of the 22 pentahexes. Fill it with the eleven in the tray.',
    hints: ['Each corner cell of the triangle has only two neighbours: begin with the three corners.'],
    tags: ['pentahex']
  }, g, ptri, ptN, 512));
  const pring = minus(hexHexagon(5), [centreOf(g, hexHexagon(5))]), prN = choose(g, pring, PENTA, 521);
  out.push(solved({
    id: 'hex-penta-ring', title: 'Honeycomb of Sixty', diff: 5,
    text: 'A hexagon with sides of five has 61 cells. Take out the middle one, and the twelve pentahexes in the tray can fill the rest.',
    tags: ['pentahex'], links: ['hex-tri-hole']
  }, g, pring, prN, 522));
  out.push(solved({
    id: 'hex-penta-all', title: 'All Twenty-Two', diff: 5,
    text: 'Every one of the 22 pentahexes — 110 hexagons — in one parallelogram, ten rows high and eleven cells long. A long evening, and a proud one.',
    hints: ['Work from one sharp corner along the bottom edge, filling it row by row; keep a few compact pieces for the far corner.'],
    tags: ['pentahex', 'grand']
  }, g, hexPara(11, 10), PENTA.slice(), 530));
  const pg = [];
  for (let i = 0; i < 2; i++) pg.push({ names: pick(PENTA, 2), seed: 540 + i });
  for (let i = 0; i < 3; i++) pg.push({ names: pick(PENTA, 3), seed: 550 + i });
  for (let i = 0; i < 3; i++) pg.push({ names: pick(PENTA, 4), seed: 560 + i, opts: { aspect: 1.4 } });
  for (let i = 0; i < 2; i++) pg.push({ names: pick(PENTA, 6), seed: 570 + i, opts: { aspect: 1.5 } });
  for (let i = 0; i < 4; i++) pg.push({ names: pick(TETRA, 2 + (i % 2)).concat(pick(PENTA, 2 + (i % 3))), seed: 580 + i, opts: { aspect: 1.4 } });
  grown(pg);
  return byDiff(out);
}
module.exports.polyhexes = polyhexes;

/* ---------- writing the files ---------- */

function lit(v) { return JSON.stringify(v); }
function puzzleLines(p) {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags'];
  const head = [];
  keys.forEach((k) => { if (p[k] !== undefined) head.push(k + ': ' + lit(p[k])); });
  const d = p.data;
  const data = ['grid: ' + lit(d.grid), 'pieces: ' + lit(d.pieces), 'sol: ' + lit(d.sol)];
  if (d.given) data.push('given: ' + lit(d.given));
  if (d.classic) data.push('classic: 1');
  if (d.tone) data.push('tone: 1');
  return '  { ' + head.join(',\n    ') + ',\n    data: { ' + data.join(', ') + ' } }';
}
function writeFamily(file, metaCode, list, after) {
  const src = '/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/polyform.js */\n' +
    'Cabinet.family(' + metaCode + ', [\n' + list.map(puzzleLines).join(',\n') + '\n]);\n' + (after || '');
  fs.writeFileSync(path.join(ROOT, file), src);
  return src.length;
}

if (require.main === module) {
  const t0 = Date.now();
  const tri = polyiamonds();
  const n1 = writeFamily('data/polyiamonds.js', `{
  id: 'polyiamonds', engine: 'polyform', cat: 'shapes', name: 'Triangles: polyiamonds', order: 4.3,
  blurb: 'Pieces made of equilateral triangles: the sphinx that builds bigger sphinxes, the twelve hexiamonds in their rhombus and trefoil, and boards of every size.',
  origin: { year: 1961, who: 'Thomas H. O\\'Beirne', note: 'O\\'Beirne suggested the name *polyiamond* — after the diamond, two triangles joined — in *New Scientist* in 1961, where he set puzzles with the twelve hexiamonds. Martin Gardner took them up in his *Scientific American* column later in the 1960s.' },
  concepts: ['exact-cover', 'coloring-argument', 'symmetry'],
  deps: ['js/lib/dlx.js', 'js/lib/polyform.js']
}`, tri, `Cabinet.history([
  { year: 1961, title: 'O\\'Beirne names the polyiamonds', text: 'Thomas H. O\\'Beirne suggests the word *polyiamond* in *New Scientist* for shapes made of equilateral triangles joined edge to edge, and sets his readers puzzles with the twelve hexiamonds.', links: ['polyiamonds', 'tri-hexi-6x6'] }
]);
`);
  const hex = polyhexes();
  const n2 = writeFamily('data/polyhexes.js', `{
  id: 'polyhexes', engine: 'polyform', cat: 'shapes', name: 'Hexagons: polyhexes', order: 4.6,
  blurb: 'Pieces made of hexagons, like bits of honeycomb: the trihexes, the seven tetrahexes from the bar to the bee, and the 22 pentahexes.',
  origin: { who: 'David A. Klarner', note: 'The polyhexes were named by David Klarner, who investigated them. The seven tetrahexes carry traditional names — bar, worm, pistol, propeller, arch, bee and wave.' },
  concepts: ['exact-cover', 'coloring-argument', 'symmetry'],
  deps: ['js/lib/dlx.js', 'js/lib/polyform.js']
}`, hex);
  const dd = (l) => { const d = {}; l.forEach((p) => { d[p.diff] = (d[p.diff] || 0) + 1; }); return JSON.stringify(d); };
  console.log('polyiamonds: ' + tri.length + ' puzzles ' + dd(tri) + ', ' + Math.round(n1 / 1024) + ' KB');
  console.log('polyhexes: ' + hex.length + ' puzzles ' + dd(hex) + ', ' + Math.round(n2 / 1024) + ' KB');
  console.log((Date.now() - t0) + ' ms');
}
