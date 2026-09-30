/* The Puzzle Cabinet · tools/gen/polyomino.js
 *
 *   node tools/gen/polyomino.js     writes data/pentominoes.js and data/polyomino-packing.js
 *
 * Two kinds of boards:
 *   - curated classics (rectangles, the 8 × 8 with holes, Dudeney's broken
 *     chessboard, scaled pentominoes): exact cover (js/lib/dlx.js) finds a
 *     solution, which is stored;
 *   - grown boards: pieces are laid one after another, each touching the
 *     ones before, where they share the most edges (so the board is compact),
 *     and the union becomes the board. The way they were laid is the stored
 *     solution; the solver counts other solutions to judge the difficulty.
 * Everything is seeded, so a rerun writes the same puzzles.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'js/lib/polyo.js'));
require(path.join(ROOT, 'engines/polyomino.js'));
const Po = C.Polyo;
const LIB = Po.LIB;
const K = (x, y) => x + ',' + y;
const CH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PENT = ['F', 'I', 'L', 'N', 'P', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const TET = ['I4', 'O4', 'T4', 'L4', 'S4'];
const HEX = Object.keys(LIB).filter((n) => /^H\d+$/.test(n));

/* ---------- small helpers ---------- */

function rect(w, h, x0, y0) {
  const o = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) o.push([x + (x0 || 0), y + (y0 || 0)]);
  return o;
}
function minus(cells, holes) {
  const hs = new Set(holes.map((c) => K(c[0], c[1])));
  return cells.filter((c) => !hs.has(K(c[0], c[1])));
}
function scale(cells, s) {
  const o = [];
  cells.forEach((c) => { for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) o.push([c[0] * s + i, c[1] * s + j]); });
  return landscape(o);
}
// screens are wider than tall: lay a tall board on its side
function landscape(cells) {
  const b = Po.bbox(cells);
  return b.h > b.w ? Po.norm(cells.map((c) => [c[1], b.x1 - c[0]])) : cells;
}
function subsets(arr, k) {
  const out = [];
  (function r(s, i) {
    if (s.length === k) { out.push(s.slice()); return; }
    for (let j = i; j < arr.length; j++) { s.push(arr[j]); r(s, j + 1); s.pop(); }
  })([], 0);
  return out;
}

const solRows = (region, placements) => Po.solRows(region, placements);

function cellsOf(names) { return names.map((n) => LIB[n] ? LIB[n].cells : Po.norm(Po.parse(n))); }

// how many ways (up to cap), not counting swaps of identical pieces
function countSols(region, names, cap) {
  const mult = {};
  names.forEach((n) => { mult[n] = (mult[n] || 0) + 1; });
  const types = Object.keys(mult);
  if (types.length === names.length) {
    const r = Po.pack({ region, pieces: cellsOf(names), max: cap, nodeLimit: 3e6 });
    return { n: Math.max(1, r.sols.length), capped: r.sols.length >= cap || r.aborted };
  }
  // pieces repeat: tile with the shapes freely, then keep the tilings with the right number of each
  const col = new Map();
  region.forEach((c, i) => col.set(K(c[0], c[1]), i));
  const rows = [], type = [];
  types.forEach((t, ti) => {
    Po.orients(cellsOf([t])[0]).forEach((o) => {
      const a = o.cells[0];
      region.forEach((c) => {
        const r = [];
        for (const q of o.cells) {
          const cc = col.get(K(q[0] + c[0] - a[0], q[1] + c[1] - a[1]));
          if (cc == null) return;
          r.push(cc);
        }
        rows.push(r); type.push(ti);
      });
    });
  });
  const capAll = types.length === 1 ? cap : cap * 12;
  const res = C.DLX.solve({ primary: region.length, rows, max: capAll, nodeLimit: 3e6 });
  let n = 0;
  res.forEach((sol) => {
    const cnt = types.map(() => 0);
    sol.forEach((ri) => cnt[type[ri]]++);
    if (types.every((t, ti) => cnt[ti] === mult[t])) n++;
  });
  return { n: Math.max(1, n), capped: res.length >= capAll || !!res.aborted };
}

// pieces that repeat count for less: the second domino is no new idea
function effectiveCount(names) {
  const mult = {};
  names.forEach((n) => { mult[n] = (mult[n] || 0) + 1; });
  return Math.round(Object.values(mult).reduce((s, m) => s + 1 + (m - 1) * 0.5, 0));
}

function solve(region, names, seed, opts) {
  const r = Po.pack({ region, pieces: cellsOf(names), max: 1, nodeLimit: (opts && opts.nodeLimit) || 5e6, shuffle: C.rng(seed) });
  if (!r.sols.length) return null;
  return r.sols[0].sort((a, b) => a.piece - b.piece);
}

/* ---------- growing a compact board from pieces ---------- */

function grow(names, rng, opts) { return Po.grow(cellsOf(names), rng, opts); }

const seenBoards = new Set();
// a grown board that is new, has no holes, and meets opts (maxW, maxH)
function grownPuzzle(names, seed, opts) {
  opts = opts || {};
  const rng = C.rng(seed);
  for (let tries = 0; tries < 400; tries++) {
    const g = grow(names, rng, opts);
    if (!g) continue;
    if (Po.holes(g.region)) continue;
    const b = Po.bbox(g.region);
    if (opts.maxW && Math.max(b.w, b.h) > opts.maxW) continue;
    if (Math.min(b.w, b.h) < (opts.minSide || 2)) continue;
    const key = Po.canon(g.region);
    if (seenBoards.has(key)) continue;
    // a board that is just a rectangle is kept for the curated rectangles
    if (b.w * b.h === g.region.length && !opts.allowRect) continue;
    seenBoards.add(key);
    // landscape looks better on a screen
    let region = g.region, pls = g.placements;
    if (b.h > b.w) {
      region = region.map((c) => [c[1], c[0]]);
      pls = pls.map((pl) => ({ piece: pl.piece, cells: pl.cells.map((c) => [c[1], c[0]]) }));
    }
    const cnt = countSols(region, names, opts.cap || 400);
    return { region, placements: pls, sols: cnt };
  }
  throw new Error('could not grow a board for ' + names.join(' '));
}

/* ---------- words ---------- */

const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
const joinAnd = Po.joinAnd, describe = Po.describe;

const WORDS = C.polyominoWords;
function namer(list, seed) {
  const pool = C.rng(seed).shuffle(list.slice());
  let i = 0;
  const used = new Set();
  return (fallback) => {
    while (i < pool.length && used.has(pool[i])) i++;
    const w = i < pool.length ? pool[i++] : fallback;
    used.add(w);
    return 'The ' + w;
  };
}

// difficulty of a grown board from its pieces and number of solutions
function gradeGrown(k, sols) {
  const s = sols.n;
  let d;
  if (k <= 2) d = 1;
  else if (k === 3) d = s >= 2 ? 1 : 2;
  else if (k === 4) d = s >= 6 ? 1 : 2;
  else if (k === 5) d = s >= 8 ? 2 : 3;
  else if (k <= 7) d = s >= 30 ? 2 : 3;
  else if (k <= 9) d = s >= 60 ? 3 : 4;
  else d = s >= 40 ? 4 : 5;
  return d;
}

module.exports = { rect, minus, scale, subsets, solRows, cellsOf, countSols, solve, grow, grownPuzzle, describe, joinAnd, namer, gradeGrown, NUM, PENT, TET, HEX, WORDS, CH, K, Po, C };

/* ======================================================================
 * The families
 * ==================================================================== */

// one puzzle: board + pieces + (found or given) solution
function puzzle(meta, region, names, placements, extra) {
  const p = {};
  Object.keys(meta).forEach((k) => { if (meta[k] !== undefined) p[k] = meta[k]; });
  const data = { pieces: names, sol: solRows(region, placements) };
  Object.assign(data, extra || {});
  p.data = data;
  return p;
}
function solved(meta, region, names, seed, extra) {
  const pl = solve(region, names, seed);
  if (!pl) throw new Error('no solution for ' + meta.id);
  return puzzle(meta, region, names, pl, extra);
}

const TEMPL = [
  (d) => 'Fit ' + d + ' into the board.',
  (d) => 'Every square covered, every piece used: ' + d + '.',
  (d, n) => 'A board of ' + n + ' squares, and ' + d + ' to fill it.',
  (d) => 'Cover the board with ' + d + ' — no gaps, no overlaps.',
  (d) => 'Pack ' + d + ' into this shape.'
];

function grownSet(prefix, start, list, namerFn, opts) {
  // list: [{ names, seed, text?, tags, opts }]
  return list.map((it, k) => {
    const g = grownPuzzle(it.names, it.seed, it.opts || opts);
    const diff = it.diff || gradeGrown(effectiveCount(it.names), g.sols);
    const t = TEMPL[it.seed % TEMPL.length];
    const text = it.text || cap(t(describe(it.names), g.region.length));
    return puzzle({
      id: prefix + String(start + k).padStart(3, '0'), title: namerFn(), diff, text,
      tags: (it.tags || []).concat(['grown']),
      explain: it.explain
    }, g.region, it.names, g.placements);
  });
}
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// order by difficulty, keeping the sections' order within each level
function byDiff(out) {
  out.forEach((p, i) => { p._o = i; });
  out.sort((a, b) => a.diff - b.diff || a._o - b._o);
  out.forEach((p) => { delete p._o; });
  return out;
}

/* ---------- Pentominoes ---------- */

function pentominoes() {
  const out = [];
  const name = namer(WORDS.pento, 11);
  const rng = C.rng(1953);
  const pick = (k) => rng.shuffle(PENT.slice()).slice(0, k).sort();
  let gn = 1;
  const grown = (list) => { const g = grownSet('pento-g', gn, list, name); gn += list.length; out.push.apply(out, g); return g; };

  // 1. warm-ups: two and three pieces
  const warm = [];
  for (let i = 0; i < 9; i++) warm.push({ names: pick(2), seed: 100 + i });
  for (let i = 0; i < 9; i++) warm.push({ names: pick(3), seed: 200 + i });
  const w = grown(warm);
  w[0].text = 'Twelve shapes, each made of five squares and named after the letter it looks like: these are the **pentominoes**. Start small: fit these two into the board. Drag a piece onto the board, double-click it (or press R) to turn it, and press X to turn it over.';
  w[0].hints = ['Look at the corners and bumps of the board: which piece has a bump like that?'];

  // 2. small rectangles from a few pieces: [width, height, pieces, how many, base difficulty]
  const rects = [[5, 3, 3, 4, 1], [5, 4, 4, 4, 2], [5, 5, 5, 4, 2], [6, 5, 6, 3, 3], [10, 3, 6, 3, 3], [7, 5, 7, 3, 3], [8, 5, 8, 2, 3], [10, 4, 8, 2, 4], [9, 5, 9, 2, 4], [15, 3, 9, 2, 4], [10, 5, 10, 2, 4], [11, 5, 11, 1, 4]];
  rects.forEach(([W, H, k, many, dBase], ri) => {
    const r2 = C.rng(500 + ri);
    const cands = r2.shuffle(subsets(PENT, k));
    let got = 0;
    for (const s of cands) {
      if (got >= many) break;
      const region = rect(W, H);
      const pl = solve(region, s, 600 + ri * 7 + got);
      if (!pl) continue;
      const cnt = countSols(region, s, 60);
      // few ways = harder, many ways = easier
      const diff = Math.max(1, Math.min(5, dBase + (cnt.n <= 4 ? 1 : 0) - (cnt.n >= 40 && dBase > 1 ? 1 : 0)));
      const ways = cnt.capped ? '' : cnt.n === 1 ? ' There is only one way.' : ' There are ' + cnt.n + ' ways, counting turned and mirrored copies of the whole rectangle separately.';
      out.push(puzzle({
        id: 'pento-r' + W + 'x' + H + '-' + (got + 1), title: H + ' × ' + W + ': ' + s.join(' '), diff,
        text: (got === 0 && ri === 0 ? 'Rectangles are the classic pentomino challenge. Here is the smallest: ' : '') + cap(describe(s)) + ' make a ' + H + ' × ' + W + ' rectangle.' + ways,
        tags: ['rectangle', 'subset']
      }, region, s, pl));
      got++;
    }
  });

  // 3. doubled pentominoes: four pieces build a pentomino at twice the size
  PENT.forEach((n, i) => {
    const region = scale(LIB[n].cells, 2);
    const r = Po.pack({ region, pieces: cellsOf(PENT), max: 1, nodeLimit: 3e6, shuffle: C.rng(700 + i) });
    if (!r.sols.length) return;
    const names = r.sols[0].map((s) => PENT[s.piece]).sort();
    const pl = solve(region, names, 710 + i);
    const cnt = countSols(region, names, 50);
    out.push(puzzle({
      id: 'pento-double-' + n.toLowerCase(), title: 'The ' + n + ', Twice as Big', diff: cnt.n <= 2 ? 3 : 2,
      text: 'Build a copy of the **' + n + ' pentomino** with every length doubled — twenty squares, four times the area — from ' + describe(names) + '.',
      tags: ['scaled', 'duplication'], concepts: ['area'],
      explain: n === 'V' || n === 'X' ? undefined : (i === 0 ? 'Ten of the twelve pentominoes can be doubled like this from four pentominoes; the V and the X cannot (the solver tried every set of four).' : undefined)
    }, region, names, pl));
  });

  // 4. the famous 6 × 10, with some pieces already in place
  const full = rect(10, 6);
  const fullPl = solve(full, PENT, 1957);
  [[8, 2, 'Eight Pieces In'], [6, 3, 'Six Pieces In'], [4, 3, 'Four Pieces In'], [2, 4, 'Two Pieces In']].forEach(([g, diff, t], i) => {
    const r2 = C.rng(800 + i);
    const given = r2.shuffle(PENT.map((x, j) => j)).slice(0, g).sort((a, b) => a - b);
    out.push(puzzle({
      id: 'pento-6x10-given' + g, title: '6 × 10, ' + t, diff,
      text: 'The great pentomino rectangle, with ' + NUM[g] + ' pieces already pinned in place. Fit the other ' + NUM[12 - g] + ' around them.',
      tags: ['rectangle', 'given'], links: ['pento-6x10']
    }, full, PENT, fullPl, { given }));
  });

  // 5. tripled pentominoes: nine of the other eleven build a pentomino at three times the size
  PENT.forEach((n, i) => {
    const region = scale(LIB[n].cells, 3);
    const others = PENT.filter((q) => q !== n);
    const r = Po.pack({ region, pieces: cellsOf(others), max: 1, nodeLimit: 5e6, shuffle: C.rng(900 + i) });
    if (!r.sols.length) return;
    const names = r.sols[0].map((s) => others[s.piece]).sort();
    const pl = solve(region, names, 910 + i);
    const cnt = countSols(region, names, 40);
    const left = others.filter((q) => !names.includes(q));
    out.push(puzzle({
      id: 'pento-triple-' + n.toLowerCase(), title: 'The ' + n + ', Three Times Over', diff: cnt.n <= 3 ? 5 : 4,
      text: 'Build the **' + n + ' pentomino** at three times its size — 45 squares — from nine pentominoes: every one except the ' + n + ' itself, the ' + left[0] + ' and the ' + left[1] + '.',
      tags: ['scaled', 'triplication'], concepts: ['area'],
      explain: i === 0 ? 'Every one of the twelve pentominoes can be built at three times its size from nine of the other eleven — the cabinet\'s solver found a way for each, and they are all in this drawer.' : undefined
    }, region, names, pl));
  });

  // 6. grown boards of every size
  const mid = [];
  for (let i = 0; i < 6; i++) mid.push({ names: pick(4), seed: 300 + i });
  for (let i = 0; i < 6; i++) mid.push({ names: pick(5), seed: 320 + i });
  for (let i = 0; i < 7; i++) mid.push({ names: pick(6 + (i % 2)), seed: 340 + i });
  for (let i = 0; i < 7; i++) mid.push({ names: pick(8 + (i % 2)), seed: 360 + i, opts: { aspect: 1.4 } });
  for (let i = 0; i < 4; i++) mid.push({ names: pick(10 + (i % 2)), seed: 380 + i, opts: { aspect: 1.5 } });
  for (let i = 0; i < 6; i++) mid.push({ names: PENT.slice(), seed: 390 + i, opts: { aspect: 1.5 } });
  grown(mid);

  // 7. the classics with all twelve
  const classic = (id, title, diff, region, names, seed, meta) => {
    out.push(solved(Object.assign({ id, title, diff, tags: ['classic'] }, meta), region, names, seed, { classic: 1 }));
  };
  classic('pento-6x10', 'The 6 × 10 Rectangle', 4, full, PENT, 1957, {
    text: 'All twelve pentominoes — 60 squares — make one 6 × 10 rectangle. A computer count found **2339** different ways, not counting the turned and mirrored copies of each; even so, the first one takes most people a long evening.',
    hints: ['The X is the fussiest piece: it can never sit in a corner, and next to an edge it tends to leave pockets. Place it early.', 'Keep the P for the end: it slips into more awkward holes than any other piece.', 'Work from one short end of the rectangle towards the other, filling the corners first.'],
    explain: 'With 2339 solutions the 6 × 10 is the friendliest of the four pentomino rectangles: the 5 × 12 has 1010, the 4 × 15 has 368, and the long 3 × 20 only 2.',
    concepts: ['exact-cover'], links: ['pento-5x12', 'pento-4x15', 'pento-3x20']
  });
  classic('pento-5x12', 'The 5 × 12 Rectangle', 4, rect(12, 5), PENT, 1010, {
    text: 'The same twelve pieces, a longer box: 5 × 12. There are **1010** ways.',
    hints: ['In a board five squares high the I fits standing up — a neat way to close one end.', 'Place the X, F and W early; the P, L and Y are the friendly fillers.'],
    links: ['pento-6x10', 'pento-4x15', 'pento-3x20']
  });
  classic('pento-8x8-centre', 'The Square with a Hole', 4, minus(rect(8, 8), [[3, 3], [4, 3], [3, 4], [4, 4]]), PENT, 1958, {
    year: 1958, source: 'Dana Scott\'s computer search (1958) of the 8 × 8 board with a 2 × 2 hole.',
    text: 'A chessboard with the four middle squares cut out leaves exactly 60 squares — one for every square of the twelve pentominoes. Fill it.',
    hints: ['The squares around the hole behave like squares along an edge: think of the hole as a small wall.', 'Try the X beside the hole, or tucked near (never in) a corner.'],
    explain: 'In 1958 Dana Scott programmed the MANIAC computer at Los Alamos to find every way of filling this board: there are **65**, not counting turned and mirrored copies. It was one of the first computer searches of its kind — a backtracking program, the same idea as the exact-cover solver in this cabinet.',
    concepts: ['exact-cover'], links: ['pento-dudeney']
  });
  classic('pento-dudeney', 'The Broken Chessboard', 4, rect(8, 8), PENT.concat(['O4']), 1907, {
    year: 1907, source: 'Henry Ernest Dudeney, *The Canterbury Puzzles* (1907).',
    text: 'A chessboard broken into thirteen pieces: the twelve pentominoes and one 2 × 2 square. Put it back together.',
    hints: ['Decide where the 2 × 2 square goes first — in the middle, on an edge or in a corner. Each choice makes a different puzzle.', 'Put the square in the centre: then it is the board with a hole, and the X likes to sit beside it.'],
    explain: 'Dudeney printed this in *The Canterbury Puzzles* in 1907, nearly fifty years before Solomon Golomb gave the pieces their name. The square may go in many places, which gives this board far more solutions than its cousins with fixed holes.',
    links: ['pento-8x8-centre'], concepts: ['dissection']
  });
  const holes = [
    ['corners', 'Four Corners Off', [[0, 0], [7, 0], [0, 7], [7, 7]], 'A chessboard with its four corner squares removed.'],
    ['scatter', 'Four Scattered Holes', [[2, 2], [5, 5], [2, 5], [5, 2]], 'A chessboard with four single holes, set in a square.'],
    ['nibbled', 'The Nibbled Corner', [[0, 0], [1, 0], [0, 1], [1, 1]], 'A chessboard with a 2 × 2 bite out of one corner.'],
    ['slot', 'The Letter Slot', [[2, 3], [3, 3], [4, 3], [5, 3]], 'A chessboard with a slot four squares long cut across the middle.'],
    ['diagonal', 'Holes on the Diagonal', [[0, 0], [1, 1], [6, 6], [7, 7]], 'A chessboard with two holes at each end of one long diagonal.']
  ];
  holes.forEach(([slug, title, hs, text], i) => classic('pento-8x8-' + slug, title, 4, minus(rect(8, 8), hs), PENT, 1100 + i, {
    text: text + ' Sixty squares are left: fill them with the twelve pentominoes.',
    links: ['pento-8x8-centre']
  }));
  classic('pento-4x15', 'The 4 × 15 Rectangle', 5, rect(15, 4), PENT, 368, {
    text: 'Narrower still: a 4 × 15 box. There are **368** ways.',
    hints: ['Only four squares high: the I has to lie along the length.', 'Place the X early. It spans three of the four rows, so check that the row left beside it can still be filled.'],
    links: ['pento-6x10', 'pento-5x12', 'pento-3x20']
  });
  // 3 × 20: the hints come from the stored solution itself
  const strip = rect(20, 3);
  const sp = solve(strip, PENT, 20);
  const endL = sp.find((s) => s.cells.some((c) => c[0] === 0 && c[1] === 0));
  const endR = sp.find((s) => s.cells.some((c) => c[0] === 19 && c[1] === 0));
  const xs = sp.find((s) => PENT[s.piece] === 'X');
  const xcol = Math.min.apply(null, xs.cells.map((c) => c[0]));
  classic('pento-3x20', 'The 3 × 20 Strip', 5, strip, PENT, 20, {
    text: 'The hardest of the four rectangles: a strip only three squares high and twenty long. Of all the ways to lay down twelve pentominoes, just **two** fill it.',
    hints: ['Only three rows: the I, L, N and Y must lie along the strip, and the X touches both long edges.', 'In one of the two solutions the ' + PENT[endL.piece] + ' closes one end and the ' + PENT[endR.piece] + ' the other.', 'With the ' + PENT[endL.piece] + ' at the left end, the left arm of the X is in column ' + (xcol + 1) + ' of 20.'],
    links: ['pento-6x10', 'pento-5x12', 'pento-4x15']
  });
  classic('pento-two-5x6', 'Two Boxes of Six', 5, rect(6, 5).concat(rect(6, 5, 7, 0)), PENT, 56, {
    text: 'Split the twelve pentominoes into two teams of six, and let each team make a 5 × 6 rectangle.',
    hints: ['Each box holds 30 squares. Which box gets the X? The other one probably wants the I.', 'Put the X and the I in different boxes.'],
    explain: 'Other even splits of the set are impossible: the cabinet\'s solver tried every way to make two 3 × 10 rectangles or three 4 × 5 rectangles, and found none.',
    links: ['pento-6x10']
  });
  return byDiff(out);
}

/* ---------- Packing polyominoes ---------- */

function packing() {
  const out = [];
  const name = namer(WORDS.pack, 23);
  const rng = C.rng(1954);
  let gn = 1;
  const grown = (list) => { const g = grownSet('pack-g', gn, list, name); gn += list.length; out.push.apply(out, g); return g; };
  const rep = (n, k) => { const a = []; for (let i = 0; i < k; i++) a.push(n); return a; };
  const tryRect = (id, title, diff, W, H, names, seed, meta) => {
    const region = rect(W, H);
    const pl = solve(region, names, seed);
    if (!pl) { console.warn('  (no tiling: ' + id + ')'); return null; }
    const p = puzzle(Object.assign({ id, title, diff, tags: ['rectangle'] }, meta), region, names, pl);
    out.push(p);
    return p;
  };

  // 1. dominoes and trominoes
  grown([
    { names: rep('I2', 4), seed: 11, text: 'Four dominoes — pieces of two squares — and a board of eight squares. A gentle start.' },
    { names: rep('I2', 6), seed: 12 },
    { names: rep('I2', 8), seed: 13, opts: { aspect: 1.6 } }
  ]);
  const trom = [];
  for (let i = 0; i < 10; i++) {
    const k = 4 + (i % 5);
    const names = [];
    for (let j = 0; j < k; j++) names.push(rng() < 0.55 ? 'L3' : 'I3');
    if (!names.includes('I3')) names[0] = 'I3';
    if (!names.includes('L3')) names[1] = 'L3';
    trom.push({ names: names.sort(), seed: 30 + i });
  }
  grown(trom);

  // 2. Golomb's L-tromino boards: a square board with one square missing
  const golomb = (id, title, diff, n, hole, meta) => {
    const region = minus(rect(n, n), [hole]);
    const names = rep('L3', (n * n - 1) / 3);
    const pl = solve(region, names, n * 10 + hole[0] + hole[1]);
    if (!pl) { console.warn('  (no tiling: ' + id + ')'); return; }
    out.push(puzzle(Object.assign({ id, title, diff, tags: ['tromino', 'classic'], concepts: ['recursion'] }, meta), region, names, pl));
  };
  golomb('pack-golomb-4a', 'One Square Short', 1, 4, [0, 0], {
    text: 'A 4 × 4 board with one corner square missing, and five L-shaped trominoes to cover the rest.',
    hints: ['Split the board into four 2 × 2 quarters. The quarter with the missing square is one L already.']
  });
  golomb('pack-golomb-4b', 'The Hole Inside', 2, 4, [1, 2], {
    text: 'This time the missing square is inside the board. Five L-trominoes still fill it.',
    hints: ['Split the board into four 2 × 2 quarters. One L goes in the middle, one square in each of the three whole quarters.'],
    explain: 'Put one L in the middle so that it takes one square from each quarter without the hole. Now every quarter is a 2 × 2 with one square gone — which is exactly an L.',
    links: ['pack-golomb-8a']
  });
  golomb('pack-golomb-8a', 'Golomb\'s Chessboard', 3, 8, [0, 7], {
    year: 1954, source: 'Solomon W. Golomb, *Checker Boards and Polyominoes* (1954).',
    text: 'A chessboard with one corner square missing: 63 squares, 21 L-trominoes.',
    hints: ['Split the board into four 4 × 4 quarters. One quarter has the missing square; you have solved that one before.', 'An L in the very centre takes one square from each of the other three quarters. Now each of them is a 4 × 4 with one square missing.'],
    explain: 'Golomb proved in 1954 that a board of 2 × 2, 4 × 4, 8 × 8, 16 × 16 … squares with **any** one square removed can be covered by L-trominoes. Cut the board into four quarters; one of them has the hole; put one L in the centre so that it takes a square from each of the other three. Now all four quarters are smaller boards with one square missing — and the same trick works on each, down to 2 × 2, which is a single L. A proof by recursion.',
    links: ['pack-golomb-8b']
  });
  golomb('pack-golomb-8b', 'Any Square Will Do', 3, 8, [5, 2], {
    year: 1954, source: 'Solomon W. Golomb, *Checker Boards and Polyominoes* (1954).',
    text: 'The hole can be anywhere at all. Here it is well inside the board: 21 L-trominoes again.',
    hints: ['Quarters again: which 4 × 4 quarter has the hole? Put an L in the centre of the board covering one square of each of the other three quarters.'],
    links: ['pack-golomb-8a']
  });
  golomb('pack-golomb-5', 'Five by Five, Minus One', 3, 5, [2, 2], {
    text: 'A 5 × 5 board with the centre square missing: eight L-trominoes. The quarters trick does not work here — five is odd — so you are on your own.'
  });
  golomb('pack-golomb-7', 'Seven by Seven, Minus One', 3, 7, [3, 3], {
    text: 'A 7 × 7 board with its centre square gone: sixteen L-trominoes.'
  });

  // 3. the five tetrominoes: first two or three at a time, then one of each
  const tetFew = [];
  for (let i = 0; i < 6; i++) tetFew.push({ names: rng.shuffle(TET.slice()).slice(0, 2 + (i % 2)).sort(), seed: 50 + i });
  const t0 = grown(tetFew);
  t0[0].text = 'There are five **tetrominoes** — every way of joining four squares edge to edge, the falling blocks of Tetris. Here are ' + describe(tetFew[0].names) + ': fit them into the board.';
  const tetOnce = [];
  for (let i = 0; i < 16; i++) tetOnce.push({ names: TET.slice(), seed: 60 + i, opts: { aspect: 1 + (i % 3) * 0.3 } });
  const t1 = grown(tetOnce);
  t1[0].text = 'All five tetrominoes together: fit one of each into this board.';
  t1[0].explain = 'However hard you try, the five tetrominoes will never make a rectangle. Colour the squares of any rectangle like a chessboard: 20 squares means 10 dark and 10 light. Four of the pieces always cover two of each, but the T covers three of one colour and one of the other — so the totals can never balance.';
  t1[0].concepts = ['coloring-argument'];

  // 4. rectangles from copies of one tetromino
  tryRect('pack-t-4x4', 'Four T\'s', 1, 4, 4, rep('T4', 4), 70, { text: 'Four T-tetrominoes make a 4 × 4 square.' });
  tryRect('pack-l-4x4', 'Four L\'s', 1, 4, 4, rep('L4', 4), 71, { text: 'Four L-tetrominoes make a 4 × 4 square.' });
  tryRect('pack-l-4x6', 'Six L\'s', 2, 6, 4, rep('L4', 6), 72, { text: 'Six L-tetrominoes make a 4 × 6 rectangle.' });
  tryRect('pack-l-5x8', 'Ten L\'s', 3, 8, 5, rep('L4', 10), 73, { text: 'Ten L-tetrominoes make a 5 × 8 rectangle — an odd side, which takes some thought.' });
  tryRect('pack-t-8x8', 'Sixteen T\'s', 3, 8, 8, rep('T4', 16), 74, {
    text: 'Sixteen T-tetrominoes cover a chessboard.',
    explain: 'T-tetrominoes are choosy: they tile a rectangle only when both sides are multiples of 4 (D. W. Walkup proved it in 1965). So 4 × 4, 4 × 8 and 8 × 8 work, and 4 × 6 never does.',
    hints: ['Four T\'s make a 4 × 4 square. How many 4 × 4 squares fit on the board?']
  });

  // 5. two sets of tetrominoes
  tryRect('pack-tet2-5x8', 'Two Sets, 5 × 8', 4, 8, 5, TET.concat(TET), 80, {
    text: 'One set of tetrominoes cannot make a rectangle — but two sets can. Make a 5 × 8 rectangle from ten tetrominoes, two of each.',
    explain: 'The chessboard colouring that forbids a rectangle with one set is happy with two: each T covers three squares of one colour, so the two T\'s must point opposite ways — one covering three dark squares, the other three light.',
    concepts: ['coloring-argument'], links: ['pack-tet2-4x10']
  });
  tryRect('pack-tet2-4x10', 'Two Sets, 4 × 10', 4, 10, 4, TET.concat(TET), 81, {
    text: 'Two sets of tetrominoes again, now in a longer 4 × 10 box.',
    concepts: ['coloring-argument'], links: ['pack-tet2-5x8']
  });
  const tet2 = [];
  for (let i = 0; i < 6; i++) tet2.push({ names: TET.concat(TET).sort(), seed: 90 + i, opts: { aspect: 1.4 } });
  grown(tet2);

  // 6. every piece up to four squares
  const small = ['o1', 'I2', 'I3', 'L3'].concat(TET);
  const sm = [];
  for (let i = 0; i < 6; i++) sm.push({ names: small.slice(), seed: 100 + i, opts: { aspect: 1.3 } });
  const s1 = grown(sm);
  s1[0].text = 'Every polyomino with one, two, three or four squares — nine pieces, 29 squares in all. Fit them into the board.';

  // 7. mixed sets
  const mix = [];
  for (let i = 0; i < 8; i++) {
    const k3 = 1 + (i % 3), k4 = 2 + (i % 3);
    const names = [];
    for (let j = 0; j < k3; j++) names.push(rng.pick(['I3', 'L3']));
    rng.shuffle(TET.slice()).slice(0, k4).forEach((n) => names.push(n));
    mix.push({ names: names.sort(), seed: 120 + i });
  }
  for (let i = 0; i < 16; i++) {
    const k4 = 1 + (i % 3), k5 = 2 + (i % 4);
    const names = rng.shuffle(TET.slice()).slice(0, k4).concat(rng.shuffle(PENT.slice()).slice(0, k5));
    mix.push({ names: names.sort(), seed: 140 + i, opts: { aspect: 1.3 } });
  }
  grown(mix);

  // 8. hexominoes
  const hexR = [[6, 3, 3, 2, 2], [6, 4, 4, 2, 2], [6, 5, 5, 2, 3], [6, 6, 6, 2, 3], [7, 6, 7, 1, 4], [8, 6, 8, 1, 4], [10, 6, 10, 1, 5]];
  hexR.forEach(([W, H, k, many, diff], ri) => {
    const r2 = C.rng(200 + ri);
    let got = 0;
    for (let tries = 0; tries < 4000 && got < many; tries++) {
      const names = r2.shuffle(HEX.slice()).slice(0, k).sort((a, b) => +a.slice(1) - +b.slice(1));
      const region = rect(W, H);
      const pl = solve(region, names, 210 + ri * 5 + got, { nodeLimit: 2e5 });
      if (!pl) continue;
      got++;
      out.push(puzzle({
        id: 'pack-hex' + W + 'x' + H + '-' + got, title: 'Hexomino Box ' + H + ' × ' + W + (many > 1 ? ' (' + ['i', 'ii', 'iii'][got - 1] + ')' : ''), diff,
        text: (ri === 0 && got === 1 ? 'There are 35 **hexominoes** — shapes of six squares. ' : '') + cap(describe(names)) + ' make a ' + H + ' × ' + W + ' rectangle.',
        tags: ['rectangle', 'hexomino']
      }, region, names, pl));
    }
  });
  const hex = [];
  for (let i = 0; i < 24; i++) {
    const k = i < 20 ? 2 + (i % 5) : 7 + (i % 2);
    hex.push({ names: rng.shuffle(HEX.slice()).slice(0, k).sort((a, b) => +a.slice(1) - +b.slice(1)), seed: 230 + i, opts: { aspect: 1.2 + (i % 3) * 0.2 } });
  }
  grown(hex);

  // 9. the grand boxes: every pentomino and every tetromino
  const grand = PENT.concat(TET);
  tryRect('pack-grand-8x10', 'The Grand Box', 4, 10, 8, grand, 301, {
    text: 'All twelve pentominoes and all five tetrominoes — seventeen pieces, 80 squares — make an 8 × 10 rectangle.',
    hints: ['Seventeen pieces is a lot to juggle: build the rectangle in two halves, filling one end first.', 'Tetrominoes are handy for patching small gaps late on. Use the awkward pentominoes (X, F, W) early.'],
    links: ['pack-grand-5x16', 'pack-grand-4x20', 'pento-6x10']
  });
  tryRect('pack-grand-5x16', 'The Grand Box, Stretched', 5, 16, 5, grand, 302, {
    text: 'The same seventeen pieces in a longer box: 5 × 16.',
    links: ['pack-grand-8x10', 'pack-grand-4x20']
  });
  tryRect('pack-grand-4x20', 'The Grand Corridor', 5, 20, 4, grand, 303, {
    text: 'And the narrowest grand box of all: 4 × 20. Every pentomino and every tetromino.',
    hints: ['Four rows high: the I pentomino must lie along the corridor, and the X touches one of the long walls.'],
    links: ['pack-grand-8x10', 'pack-grand-5x16']
  });
  return byDiff(out);
}

module.exports.pentominoes = pentominoes;
module.exports.packing = packing;

/* ---------- writing the files ---------- */

function lit(v) { return JSON.stringify(v); }
function puzzleLines(p) {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags'];
  const head = [];
  keys.forEach((k) => { if (p[k] !== undefined) head.push(k + ': ' + lit(p[k])); });
  const d = p.data;
  const data = ['pieces: ' + lit(d.pieces), 'sol: ' + lit(d.sol)];
  if (d.given) data.push('given: ' + lit(d.given));
  if (d.classic) data.push('classic: 1');
  return '  { ' + head.join(',\n    ') + ',\n    data: { ' + data.join(', ') + ' } }';
}
function writeFamily(file, metaCode, list, after) {
  const src = '/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/polyomino.js */\n' +
    'Cabinet.family(' + metaCode + ', [\n' + list.map(puzzleLines).join(',\n') + '\n]);\n' + (after || '');
  fs.writeFileSync(path.join(ROOT, file), src);
  return src.length;
}

if (require.main === module) {
  const t0 = Date.now();
  const pent = pentominoes();
  const n1 = writeFamily('data/pentominoes.js', `{
  id: 'pentominoes', engine: 'polyomino', cat: 'shapes', name: 'Pentominoes', order: 3,
  blurb: 'Twelve shapes of five squares, named after the letters they resemble: fill rectangles, holed chessboards and giant pentominoes with them.',
  origin: { year: 1954, who: 'Solomon W. Golomb', note: 'Golomb named the polyominoes in a talk in 1953 and an article in 1954, and gave the twelve pentominoes their letters F I L N P T U V W X Y Z. Martin Gardner\\'s column in *Scientific American* made them famous; Dudeney had used the same pieces in 1907 without a name for them.' },
  concepts: ['exact-cover', 'area', 'symmetry'],
  deps: ['js/lib/dlx.js', 'js/lib/polyo.js']
}`, pent, `Cabinet.history([
  { year: 1954, title: 'Golomb names the polyominoes', text: 'Solomon W. Golomb, a student at Harvard, describes shapes made of squares joined edge to edge — dominoes, trominoes, tetrominoes, pentominoes — first in a talk (1953), then in the article *Checker Boards and Polyominoes* (1954).', links: ['pentominoes', 'polyomino-packing', 'pack-golomb-8a'] },
  { year: 1958, title: 'A computer fills the holed chessboard', text: 'Dana Scott programs the MANIAC computer at Los Alamos to find every way of filling an 8 × 8 board with a 2 × 2 hole in the middle using the twelve pentominoes: 65 of them.', links: ['pento-8x8-centre'] }
]);
`);
  const pack = packing();
  const n2 = writeFamily('data/polyomino-packing.js', `{
  id: 'polyomino-packing', engine: 'polyomino', cat: 'shapes', name: 'Packing polyominoes', order: 4,
  blurb: 'Dominoes, trominoes, tetrominoes and hexominoes: pack every piece into the board, square for square.',
  origin: { year: 1954, who: 'Solomon W. Golomb', note: 'Golomb\\'s 1954 article began with dominoes on a chessboard and L-shaped trominoes on a board with one square missing. The tetrominoes found a second life in 1984 as the falling blocks of Tetris.' },
  concepts: ['exact-cover', 'coloring-argument', 'area'],
  deps: ['js/lib/dlx.js', 'js/lib/polyo.js']
}`, pack);
  const dd = (l) => { const d = {}; l.forEach((p) => { d[p.diff] = (d[p.diff] || 0) + 1; }); return JSON.stringify(d); };
  console.log('pentominoes: ' + pent.length + ' puzzles ' + dd(pent) + ', ' + Math.round(n1 / 1024) + ' KB');
  console.log('polyomino-packing: ' + pack.length + ' puzzles ' + dd(pack) + ', ' + Math.round(n2 / 1024) + ' KB');
  console.log((Date.now() - t0) + ' ms');
}
