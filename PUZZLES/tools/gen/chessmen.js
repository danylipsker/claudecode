/* The Puzzle Cabinet · tools/gen/chessmen.js
 *
 *   node tools/gen/chessmen.js        writes data/knight-swaps.js, data/knights-tour.js, data/queens.js
 *
 * Knight swaps: Guarini's classic and boards found at random, each with its
 * fewest moves by breadth-first search. Knight's tours: open and closed tours
 * on many boards (found with Warnsdorff's rule and backtracking), boards where
 * no tour exists (proved by exhaustive search), and numbered tours whose clues
 * allow exactly one route. Queens and guards: non-attacking placements (made
 * unique with fixed pieces or forbidden squares), the most pieces that fit
 * (proved by groups of mutually attacking squares) and the fewest that guard
 * every square (proved by search).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/graphlib.js'));
require(path.join(ROOT, 'engines/chessmen.js'));
const K = C.chessKit;
const eng = C.engines.chessmen;
const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function write(fid, meta, list) {
  list.forEach((p) => { const r = eng.verify(p); if (!r.ok) throw new Error(p.id + ': ' + r.err); });
  const lines = list.map((p) => '  ' + JSON.stringify(p));
  const out = '/* The Puzzle Cabinet · data/' + fid + '.js — made by tools/gen/chessmen.js */\nCabinet.family(' + JSON.stringify(meta, null, 2) + ', [\n' + lines.join(',\n') + '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data', fid + '.js'), out);
  const cnt = {};
  list.forEach((p) => { cnt[p.diff] = (cnt[p.diff] || 0) + 1; });
  console.log(fid + ': ' + list.length + ' puzzles ' + JSON.stringify(cnt) + ', ' + Math.round(out.length / 1024) + ' KB');
}
const sq = (d, r, c) => r * d.cols + c;

/* ---------- knights changing places ---------- */

function swapPar(d) { const r = K.swapSolve(d, K.swapStart(d), 'w', 600000); return r.path ? r.path.length : -1; }
function swapDiff(par) { return par <= 6 ? 1 : par <= 10 ? 2 : par <= 15 ? 3 : par <= 22 ? 4 : 5; }

function knightSwaps() {
  const P = [];
  const gu = { kind: 'swap', rows: 3, cols: 3, start: { w: [0, 2], b: [6, 8] }, goal: { w: [6, 8], b: [0, 2] } };
  P.push({
    id: 'swap-guarini', title: 'Guarini\'s Knights', diff: 3, year: 1512,
    source: 'Paolo Guarini, 1512.',
    text: 'Two white knights stand in the top corners of a little 3 × 3 board and two black knights in the bottom corners. Make them change places — whites to the bottom, blacks to the top — using only knight\'s moves, one knight at a time, never two on a square.',
    hints: ['The centre square is useless: no knight can ever reach it.', 'Follow the knight\'s jumps around the board: the eight outer squares form a single ring. Knights on a ring cannot pass one another.', 'So every knight must travel round the ring the same way, all together, until each has gone halfway round.'],
    explain: 'Draw a line for every knight\'s jump: the eight outer squares form one closed ring, and the centre is left out. Unfold the ring into a circle (Dudeney called this the method of "buttons and string") and the puzzle becomes easy: the knights sit on a circle of eight places and cannot jump over each other, so each must go four places round, all in the same direction. Four knights times four steps: sixteen moves.',
    concepts: ['state-space', 'graph'], tags: ['classic'],
    par: swapPar(gu), data: gu
  });
  const gu2 = { kind: 'swap', rows: 3, cols: 3, start: { w: [0, 2], b: [6, 8] }, goal: { w: [2, 8], b: [0, 6] } };
  P.push({ id: 'swap-quarter', title: 'A Quarter Turn', diff: 2, text: 'The same four knights as in Guarini\'s problem, but this time give the board a quarter turn: the whites must end in the two right-hand corners and the blacks in the two left-hand corners.', hints: ['Unfold the ring of eight squares, as in Guarini\'s problem: the knights can only go round it, never past each other.'], concepts: ['state-space'], par: swapPar(gu2), data: gu2 });
  const gua = Object.assign({}, gu, { alt: true });
  P.push({ id: 'swap-guarini-turns', title: 'Guarini, Taking Turns', diff: 3, text: 'Guarini\'s problem as a polite game: white and black must move alternately, white first. Can the knights still change places in the fewest moves?', explain: 'Yes: the sixteen-move solution can be arranged so that the colours alternate — each colour only ever needs its own knights to move round the ring.', concepts: ['state-space'], par: swapPar(gua), data: gua });
  const s34 = { kind: 'swap', rows: 3, cols: 4, start: { w: [0, 1, 2, 3], b: [8, 9, 10, 11] }, goal: { w: [8, 9, 10, 11], b: [0, 1, 2, 3] } };
  P.push({ id: 'swap-3x4-full', title: 'Eight Knights on Twelve Squares', diff: 3, text: 'Four white knights along the top of a 3 × 4 board, four black along the bottom, and only the middle row empty. Swap them.', concepts: ['state-space'], par: swapPar(s34), data: s34 });

  const NAMES = ['The Stable Yard', 'The Tilting Ground', 'The Paddock', 'The Horse Fair', 'The Jousting Lists', 'The Mews', 'The Coaching Inn', 'The Hippodrome', 'The Riding School', 'The Changing of the Guard', 'The Cavalry Drill', 'The Carousel', 'The Farrier\'s Queue', 'The Two Stables', 'The Narrow Pass', 'The Crossroads Inn', 'The Castle Gate', 'The Drawbridge', 'The Border Ford', 'The Night Patrol', 'The Grand Parade', 'The Rival Troops', 'The Chequered Field', 'The Tournament', 'The Garrison', 'The Relief Column', 'The Knightly Quadrille', 'The Ambush', 'The Watchtowers', 'The Cloister Garth', 'The Siege Lines', 'The Moat', 'The Market Square', 'The Long Stable', 'The Round Table', 'The Hunting Party', 'The Barracks', 'The Orchard', 'The Village Green', 'The Last Charge'];
  const rng = C.rng(1512);
  const seen = new Set();
  const want = { 1: 7, 2: 9, 3: 10, 4: 8, 5: 6 };
  const got = { 1: 0, 2: 1, 3: 3, 4: 0, 5: 0 };
  const extra = [];
  let guard = 0;
  while (Object.keys(want).some((k) => got[k] < want[k]) && guard++ < 40000) {
    const rows = rng.range(2, 4), cols = rng.range(3, 5);
    if (rows * cols < 8) continue;
    const d = { kind: 'swap', rows, cols, holes: [], start: { w: [], b: [] }, goal: { w: [], b: [] } };
    const N = rows * cols;
    const nh = rng.int(Math.min(4, N - 6));
    const cells = rng.shuffle(Array.from({ length: N }, (x, i) => i));
    d.holes = cells.slice(0, nh).sort((a, b) => a - b);
    const free = cells.slice(nh);
    const k = rng.range(1, Math.min(3, Math.floor((free.length - 1) / 2)));
    const mode = rng.int(3);
    if (mode === 0) {
      // swap two groups
      d.start.w = free.slice(0, k); d.start.b = free.slice(k, 2 * k);
      d.goal.w = d.start.b.slice(); d.goal.b = d.start.w.slice();
    } else if (mode === 1) {
      // mirror left-right
      d.start.w = free.slice(0, k); d.start.b = free.slice(k, 2 * k);
      const mir = (s) => { const r = Math.floor(s / cols), c = s % cols; return r * cols + (cols - 1 - c); };
      d.goal.w = d.start.w.map(mir); d.goal.b = d.start.b.map(mir);
      const all = d.goal.w.concat(d.goal.b);
      if (all.some((s) => d.holes.includes(s))) continue;
    } else {
      d.start.w = free.slice(0, k); d.start.b = free.slice(k, 2 * k);
      const rest = rng.shuffle(free.slice());
      d.goal.w = rest.slice(0, k); d.goal.b = rest.slice(k, 2 * k);
    }
    d.start.w.sort((a, b) => a - b); d.start.b.sort((a, b) => a - b); d.goal.w.sort((a, b) => a - b); d.goal.b.sort((a, b) => a - b);
    if (!d.holes.length) delete d.holes;
    if (rng() < 0.15 && k >= 2) d.alt = true;
    const key = JSON.stringify(d);
    if (seen.has(key)) continue;
    const r = K.swapSolve(d, K.swapStart(d), 'w', 70000);
    if (!r.path || r.aborted || r.path.length < 3) continue;
    const par = r.path.length, df = swapDiff(par);
    if (got[df] >= want[df]) continue;
    seen.add(key);
    got[df]++;
    extra.push({ d, par, df, k });
  }
  extra.sort((a, b) => a.par - b.par);
  extra.forEach((x, i) => {
    const d = x.d, k = x.k;
    const holes = (d.holes || []).length;
    const who = k === 1 ? 'one white knight and one black' : NUM[k] + ' white knights and ' + NUM[k] + ' black';
    let text = 'A ' + d.rows + ' × ' + d.cols + ' board' + (holes ? ' with ' + (holes === 1 ? 'one square' : NUM[holes] + ' squares') + ' missing' : '') + ', and ' + who + '. ';
    const same = (a, b) => a.join() === b.join();
    if (same(d.goal.w, d.start.b) && same(d.goal.b, d.start.w)) text += 'Make them change places.';
    else text += 'Bring each knight to a square of its own colour\'s tab — any knight of the right colour will do.';
    if (d.alt) text += ' White and black move in turn, white first.';
    P.push({ id: 'swap-' + String(i + 1).padStart(2, '0'), title: NAMES[i], diff: x.df, text, concepts: ['state-space'], tags: d.alt ? ['turns'] : [], par: x.par, data: d });
  });
  P.sort((a, b) => a.diff - b.diff || a.par - b.par);
  P.forEach((p) => { if (p.tags && !p.tags.length) delete p.tags; });
  write('knight-swaps', {
    id: 'knight-swaps', engine: 'chessmen', cat: 'routes', name: 'Knights changing places', order: 6,
    blurb: 'White and black knights must change places on small boards, one L-shaped jump at a time. Fewest moves earn the par.',
    origin: { year: 1512, who: 'Paolo Guarini', note: 'Guarini\'s problem of 1512 — two white and two black knights swapping corners on a 3 × 3 board — is among the oldest chess puzzles. Dudeney later showed how to solve such puzzles by "unfolding" the board into the ring of knight\'s jumps.' },
    concepts: ['state-space', 'graph']
  }, P);
}

/* ---------- knight's tours ---------- */

function tourOf(d, rng, limit) {
  const r = K.tourSearch(d, { rng, limit: limit || 2e6 });
  return r.sols[0] || null;
}
function knightsTours() {
  const P = [];
  const rng = C.rng(1759);
  const add = (id, title, diff, d, text, extra) => {
    const dd = Object.assign({ kind: 'tour' }, d);
    if (!dd.none) {
      const t = tourOf(dd, rng, 6e6);
      if (!t) throw new Error(id + ': no tour');
      dd.sol = t;
    }
    const p = { id, title, diff, text, concepts: ['hamilton'], data: dd };
    Object.assign(p, extra || {});
    P.push(p);
  };
  const B = (rows, cols) => ({ rows, cols });
  add('tour-3x4', 'Twelve Squares', 1, B(3, 4), 'A knight on a board of three rows and four columns. Visit every square exactly once — the first click puts the knight down, then click each square it jumps to.', { hints: ['Start in a corner.'] });
  add('tour-ring', 'The Ring of Eight', 1, Object.assign(B(3, 3), { holes: [4], closed: true }), 'On a 3 × 3 board without its centre, take the knight round all eight squares and end one jump from where it began.', { explain: 'The knight\'s jumps join the eight outer squares in a single ring — the same ring that solves Guarini\'s knights. Going round it is a closed tour.' });
  add('tour-3x7', 'The Long Corridor', 2, B(3, 7), 'Three rows, seven columns: a knight\'s tour through all twenty-one squares.');
  add('tour-4x5', 'Twenty Squares', 2, B(4, 5), 'A board of four rows and five columns. Visit every square once.');
  add('tour-5x5-corner', 'From the Corner', 2, Object.assign(B(5, 5), { start: 0 }), 'On a 5 × 5 board, start in the top-left corner and visit all twenty-five squares.', { hints: ['Warnsdorff\'s rule: always jump to the square from which the knight will have the fewest onward moves.'] });
  add('tour-5x5-centre', 'From the Centre', 3, Object.assign(B(5, 5), { start: 12 }), 'Now start in the centre of the 5 × 5 board. Every square once.');
  add('tour-5x5-closed', 'Home Again on Five by Five', 2, Object.assign(B(5, 5), { closed: true, none: true, ask: true }), 'On the 5 × 5 board, can the knight visit every square and finish one jump away from its starting square, closing the tour?', {
    hints: ['A knight always jumps from a light square to a dark one, or back.', 'A closed tour alternates colours all the way round. How many squares of each colour must it have?'],
    explain: 'A knight always changes colour. Going round a closed tour, light and dark squares alternate, so there must be as many of each. A 5 × 5 board has 25 squares — 13 of one colour, 12 of the other. No closed tour, on this or any board with an odd number of squares.',
    concepts: ['hamilton', 'coloring-argument', 'parity']
  });
  add('tour-5x5-b1', 'The Wrong Colour', 3, Object.assign(B(5, 5), { start: 1, none: true, ask: true }), 'On the 5 × 5 board, start on the square next to the top-left corner. Can the knight still visit every square once (no need to close)?', {
    hints: ['Colour the board like a chessboard. The corners are the colour with 13 squares.', 'A 25-square tour alternates colours: which colour must the 1st, 3rd, 5th … 25th squares be?'],
    explain: 'The 25 squares split 13 (the corner colour) and 12. A tour alternates colours, so its 1st, 3rd, …, 25th squares — thirteen of them — share one colour, and it must be the colour with 13 squares. The square next to the corner is the other colour, so no tour can start there.',
    concepts: ['hamilton', 'coloring-argument', 'parity']
  });
  add('tour-4x4', 'Sixteen Squares', 3, Object.assign(B(4, 4), { none: true, ask: true }), 'Can a knight visit every square of a 4 × 4 board exactly once, starting wherever you like?', {
    hints: ['Look at the corners: each has only two jumps in or out.', 'Try from several starts: where does it jam every time?'],
    explain: 'It cannot be done: the cabinet tried every start and every route, and none reaches all sixteen squares. The four corners are the trouble — each has only two jumps in or out, and those jumps crowd onto the same few squares.',
    concepts: ['hamilton']
  });
  add('tour-3x8-closed', 'Closing the Corridor?', 3, Object.assign(B(3, 8), { closed: true, none: true, ask: true }), 'Three rows by eight: a closed tour, ending one jump from the start?', { explain: 'No closed tour exists on 3 × 8 — the cabinet checked every route. On boards three squares high, closed tours first appear at ten columns.', concepts: ['hamilton'] });
  add('tour-3x10-closed', 'Round the Long Board', 4, Object.assign(B(3, 10), { closed: true }), 'Three rows by ten columns — the smallest three-row board with a closed tour. Find one.');
  add('tour-4x5-closed', 'A Closed Tour on Four Rows?', 4, Object.assign(B(4, 5), { closed: true, none: true, ask: true }), 'On a board four squares high and five wide, can the knight make a closed tour?', {
    hints: ['Colour the two outer rows red and the two middle rows blue. Where can a knight on a red square jump?', 'A knight on an outer row always lands on a middle row. Now combine that with the ordinary chessboard colours.'],
    explain: 'A knight on one of the two outer rows can only jump to a middle row, and outer and middle rows have the same number of squares. So in a closed tour every outer square is followed by a middle one, and — the numbers being equal — every middle square by an outer one: the tour alternates outer, middle, outer … But it also alternates light, dark, light … So all the outer squares it visits would be the same chessboard colour — yet the outer rows hold squares of both colours. No closed tour exists on any board four squares high.',
    concepts: ['hamilton', 'coloring-argument', 'parity']
  });
  add('tour-5x6-closed', 'Thirty Squares, Round Trip', 3, Object.assign(B(5, 6), { closed: true }), 'A 5 × 6 board: a closed tour through all thirty squares.');
  add('tour-6x6', 'Thirty-Six Squares', 3, B(6, 6), 'A 6 × 6 board. Visit every square once.');
  add('tour-6x6-closed', 'Round the 6 × 6', 4, Object.assign(B(6, 6), { closed: true }), 'A closed tour of the 6 × 6 board: the last jump must bring the knight back within one jump of its first square.');
  add('tour-7x7', 'Forty-Nine Squares', 4, B(7, 7), 'A 7 × 7 board: every square once.');
  add('tour-8x8', 'The Whole Chessboard', 4, B(8, 8), 'The full 8 × 8 board: sixty-four squares, each visited once. Euler studied this in 1759; Warnsdorff\'s rule of 1823 makes it almost easy.', { year: 1759, source: 'Leonhard Euler, 1759; H. C. von Warnsdorf, 1823.', hints: ['Warnsdorff\'s rule: from the squares you can jump to, choose the one with the fewest onward jumps.'], concepts: ['hamilton', 'graph'] });
  add('tour-8x8-closed', 'The Closed Grand Tour', 5, Object.assign(B(8, 8), { closed: true }), 'The full board again, but now a closed tour: the 64th square must be a knight\'s jump from the 1st.', { hints: ['Keep the starting square\'s neighbours free for the end.'] });
  add('tour-a1-h8', 'Corner to Opposite Corner', 3, Object.assign(B(8, 8), { start: 56, end: 7, none: true, ask: true }), 'On the full board, can the knight start in the bottom-left corner (a1), visit every square once, and finish in the top-right corner (h8)?', {
    hints: ['What colour are a1 and h8?', 'A tour of 64 squares alternates colours: the 1st square and the 64th have different colours.'],
    explain: 'a1 and h8 are the same colour. The 64 squares of a tour alternate light and dark, so the 1st and the 64th are always different colours. No such tour.',
    concepts: ['hamilton', 'coloring-argument', 'parity']
  });
  add('tour-a1-h1', 'Corner to Corner, Same Rank', 4, Object.assign(B(8, 8), { start: 56, end: 63 }), 'Start on a1, visit every square once, and finish on h1 — the corner at the other end of the same row.', { explain: 'a1 and h1 are different colours, so the colour argument does not forbid it — and indeed a tour exists.' });
  add('tour-6x6-holes', 'The Four Pillars', 3, Object.assign(B(6, 6), { holes: [7, 10, 25, 28] }), 'A 6 × 6 hall with four pillars (missing squares). Tour the remaining thirty-two squares.');
  add('tour-ring-8x8', 'Round the Moat', 5, Object.assign(B(8, 8), { holes: [27, 28, 35, 36], closed: true }), 'The four centre squares of the board are a pond. Make a closed tour of the other sixty.');
  add('tour-cross', 'The Clipped Board', 4, Object.assign(B(8, 8), { holes: [0, 7, 56, 63] }), 'A chessboard with its four corners sawn off. Tour the sixty squares that are left.');
  add('tour-5x8', 'Five by Eight', 3, B(5, 8), 'A board of five rows and eight columns. Every square once.');
  add('tour-4x6', 'Four by Six', 2, B(4, 6), 'Four rows, six columns: visit all twenty-four squares.');
  add('tour-3x9', 'Three by Nine', 2, B(3, 9), 'A long thin board, three by nine. Every square once.');
  add('tour-4x7', 'Four by Seven', 2, B(4, 7), 'Four rows, seven columns: every square once.');
  add('tour-5x7', 'Five by Seven', 3, B(5, 7), 'A 5 × 7 board: thirty-five squares, each visited once.');
  add('tour-6x8-closed', 'Six by Eight, Round Trip', 4, Object.assign(B(6, 8), { closed: true }), 'A closed tour of a 6 × 8 board.');
  add('tour-7x8', 'Seven by Eight', 4, B(7, 8), 'Seven rows of eight: fifty-six squares, each visited once.');
  add('tour-6x6-corners', 'The Corner Posts', 3, Object.assign(B(6, 6), { holes: [0, 5, 30, 35] }), 'A 6 × 6 board with its four corners missing. Visit the other thirty-two squares.');
  add('tour-5x5-start-centre-end', 'Centre Start, Corner Finish', 3, Object.assign(B(5, 5), { start: 12, end: 24 }), 'On the 5 × 5 board, start in the centre and finish in the bottom-right corner, visiting every square once.');
  add('tour-7x7-closed', 'Round the 7 × 7?', 3, Object.assign(B(7, 7), { closed: true, none: true, ask: true }), 'A closed tour of the 7 × 7 board?', { hints: ['Count the squares.'], explain: 'Forty-nine squares is an odd number, and a closed tour must alternate colours with as many of each — impossible.', concepts: ['hamilton', 'parity', 'coloring-argument'] });

  // numbered tours: some squares carry their number; exactly one tour fits
  const NUMT = [['The Numbered Five', 5, 5], ['Clues on a Small Board', 5, 5], ['Stepping Stones', 5, 6], ['Milestones', 5, 6], ['The Numbered Six', 6, 6], ['Signposts', 6, 6], ['Breadcrumbs', 6, 6], ['The Numbered Seven', 7, 7], ['Waymarks', 6, 7], ['The Numbered Eight', 8, 8]];
  NUMT.forEach(([title, R, W], idx) => {
    const d = { kind: 'tour', rows: R, cols: W };
    let made = null;
    for (let t = 0; t < 12 && !made; t++) {
      const b = K.board(d), n = b.squares.length;
      const tour = K.tourSearch(d, { rng, start: rng.pick(b.squares), limit: 2e6 }).sols[0];
      if (!tour) continue;
      const given = {};
      given[tour[0]] = 1;
      given[tour[n - 1]] = n;
      let ok = false;
      for (let it = 0; it < 60; it++) {
        const r = K.tourSearch(Object.assign({}, d, { given }), { max: 2, limit: 1.5e6 });
        if (r.sols.length === 1 && !r.aborted) { ok = true; break; }
        // add a clue where a rival tour differs
        const other = r.sols.find((s) => s.join() !== tour.join()) || null;
        let i;
        if (other) { const diffs = []; for (let j = 1; j < n - 1; j++) if (other[j] !== tour[j]) diffs.push(j); i = rng.pick(diffs); }
        else i = 1 + rng.int(n - 2);
        given[tour[i]] = i + 1;
      }
      if (!ok) continue;
      // try to take clues away again
      const keys = rng.shuffle(Object.keys(given).filter((k) => given[k] !== 1));
      for (const k of keys) {
        const v = given[k];
        delete given[k];
        const t0 = Date.now();
        const r = K.tourSearch(Object.assign({}, d, { given }), { max: 2, limit: 1.5e6 });
        // keep the clue if the tour is no longer unique, or if proving it would be slow
        if (r.sols.length !== 1 || r.aborted || Date.now() - t0 > 180) given[k] = v;
      }
      made = { given, tour };
    }
    if (!made) { console.warn('skipped ' + title); return; }
    const nc = Object.keys(made.given).length;
    const b = K.board(d), n = b.squares.length;
    const dd = Object.assign({}, d, { given: made.given, sol: made.tour, unique: true });
    const diff = n <= 25 ? 3 : n <= 36 ? 4 : 5;
    P.push({ id: 'tour-numbered-' + String(idx + 1).padStart(2, '0'), title, diff, text: 'Some squares already carry their number in the knight\'s tour (' + nc + ' clues). Complete the tour: square 1 first, then 2, 3 … up to ' + n + ', each a knight\'s jump from the one before. Exactly one tour fits the clues.', concepts: ['hamilton', 'deduction'], tags: ['numbered'], data: dd });
  });

  P.sort((a, b) => a.diff - b.diff);
  write('knights-tour', {
    id: 'knights-tour', engine: 'chessmen', cat: 'routes', name: 'Knight\'s tours', order: 7,
    blurb: 'Take a knight to every square of the board exactly once — sometimes back to where it began, sometimes along numbered stepping stones, and sometimes the answer is that it cannot be done.',
    origin: { year: 1759, who: 'Leonhard Euler', note: 'Knight\'s tours were admired long before Euler, who wrote a paper about them in 1759. In 1823 H. C. von Warnsdorf gave the rule of thumb that finds tours almost every time: jump to the square with the fewest onward moves.' },
    concepts: ['hamilton', 'coloring-argument']
  }, P);
}

/* ---------- queens and guards ---------- */

function allIndep(d, max) { return K.indepSearch(d, { max: max || 100000, limit: 2e7 }).sols; }
function queens() {
  const P = [];
  const rng = C.rng(1848);
  const base = (rows, cols, piece, need, goal) => ({ kind: 'place', rows, cols, piece, need, goal });
  const push = (p) => { if (!p.data.sol) { const r = p.data.goal === 'indep' ? K.indepSearch(p.data, { limit: 5e6 }) : K.domSearch(p.data, p.data.need, { indep: p.data.goal === 'both', limit: 5e6 }); p.data.sol = fill(p.data, r.sols[0]); } P.push(p); };
  // pad a guarding with fewer pieces up to the number wanted
  function fill(d, sol) {
    if (!sol) throw new Error('no solution for ' + JSON.stringify(d));
    sol = sol.slice();
    const I = K.placeInfo(d);
    for (const s of I.b.squares) { if (sol.length >= d.need) break; if (!sol.includes(s) && !I.b.pawn[s] && !(d.forbid || []).includes(s)) sol.push(s); }
    return sol.sort((a, b) => a - b);
  }

  push({ id: 'queens-4', title: 'Four Queens', diff: 1, text: 'Place four queens on a 4 × 4 board so that no queen attacks another — no two in the same row, column or diagonal.', hints: ['No queen can stand in a corner.'], explain: 'There are just two solutions, mirror images of each other.', concepts: ['deduction'], data: base(4, 4, 'Q', 4, 'indep') });
  push({ id: 'queens-rooks-8', title: 'Eight Peaceful Rooks', diff: 1, text: 'Place eight rooks on the chessboard so that none attacks another.', explain: 'One rook in each row and each column: any such arrangement works — there are 8 × 7 × 6 × … × 1 = 40,320 of them.', concepts: ['combinatorics'], data: base(8, 8, 'R', 8, 'indep') });
  push({ id: 'queens-5', title: 'Five Queens', diff: 1, text: 'Five queens on a 5 × 5 board, none attacking another.', concepts: ['deduction'], data: base(5, 5, 'Q', 5, 'indep') });
  push({ id: 'queens-6', title: 'Six Queens', diff: 2, text: 'Six queens on a 6 × 6 board, none attacking another. Harder than it looks: there are only four ways.', concepts: ['deduction'], data: base(6, 6, 'Q', 6, 'indep') });
  push({ id: 'queens-7', title: 'Seven Queens', diff: 2, text: 'Seven queens on a 7 × 7 board, none attacking another.', data: base(7, 7, 'Q', 7, 'indep') });
  push({
    id: 'queens-8', title: 'The Eight Queens', diff: 3, year: 1848,
    source: 'Max Bezzel, in the *Schachzeitung* (1848).',
    text: 'Place eight queens on the chessboard so that no queen attacks another. The chess composer Max Bezzel asked this in 1848; Gauss took an interest, and the question of how many solutions there are occupied several people for years.',
    hints: ['One queen in every row and every column.', 'Place them row by row; when a row has no safe square left, go back and move the queen in the row above.'],
    explain: 'There are 92 solutions (12 if mirror images and turns of the board count as one) — the cabinet counts them in a blink by trying the rows one after another and backing up at every dead end, which is how the puzzle has been attacked ever since.',
    concepts: ['deduction', 'state-space'], tags: ['classic'], data: base(8, 8, 'Q', 8, 'indep')
  });

  // unique eight-queens problems: some queens given, or some squares forbidden
  const eight = allIndep(base(8, 8, 'Q', 8, 'indep'));
  const allOf = { 8: eight };
  const uniqTitles = new Set();
  const uniq = (n, kindOf, idx, rows, maxN) => {
    const R = rows || 8;
    const d0 = base(R, R, 'Q', R, 'indep');
    const all = allOf[R] || (allOf[R] = allIndep(d0));
    for (let t = 0; t < 600; t++) {
      const sol = rng.pick(all);
      const d = Object.assign({}, d0);
      if (kindOf === 'fixed') {
        const order = rng.shuffle(sol.slice());
        const fixed = [];
        for (const s of order) {
          fixed.push(s);
          const left = all.filter((x) => fixed.every((f) => x.includes(f)));
          if (left.length === 1) break;
        }
        // drop givens that are not needed
        for (let i = fixed.length - 1; i >= 0; i--) { const f = fixed.splice(i, 1)[0]; if (all.filter((x) => fixed.every((q) => x.includes(q))).length !== 1) fixed.splice(i, 0, f); }
        if (fixed.length < n || fixed.length > (maxN || n)) continue;
        d.fixed = fixed.sort((a, b) => a - b);
      } else {
        const others = all.filter((x) => x.join() !== sol.join());
        const forbid = [];
        let live = others;
        let guard = 0;
        while (live.length && guard++ < 60) {
          // forbid a square used by many rival solutions but not by ours
          const cnt = {};
          live.forEach((x) => x.forEach((s) => { if (!sol.includes(s)) cnt[s] = (cnt[s] || 0) + 1; }));
          const keys = Object.keys(cnt).map(Number);
          if (!keys.length) break;
          keys.sort((a, b) => cnt[b] - cnt[a]);
          const pick = rng() < 0.7 ? keys[0] : rng.pick(keys.slice(0, 5));
          forbid.push(pick);
          live = live.filter((x) => !x.includes(pick));
        }
        if (live.length || forbid.length < n || forbid.length > (maxN || n)) continue;
        // drop bans that are not needed
        for (let i = forbid.length - 1; i >= 0; i--) { const f = forbid.splice(i, 1)[0]; if (others.some((x) => !x.some((s) => forbid.includes(s)))) forbid.splice(i, 0, f); }
        if (forbid.length < n) continue;
        d.forbid = forbid.sort((a, b) => a - b);
      }
      d.sol = sol.slice().sort((a, b) => a - b);
      d.unique = true;
      const key = JSON.stringify([d.fixed, d.forbid, d.rows]);
      if (P.some((p) => JSON.stringify([p.data.fixed, p.data.forbid, p.data.rows]) === key)) continue;
      const nq = d.rows, cnt = (d.fixed || d.forbid).length;
      const txt = kindOf === 'fixed'
        ? cap(NUM[cnt]) + (cnt === 1 ? ' queen is' : ' queens are') + ' already standing (blue pins) and may not move. Add the rest so that ' + NUM[nq] + ' queens stand on the ' + nq + ' × ' + nq + ' board, none attacking another. Only one way works.'
        : 'Place ' + NUM[nq] + ' queens on the ' + nq + ' × ' + nq + ' board, none attacking another — but no queen may stand on a crossed square. Only one way works.';
      // fewer clues make a harder puzzle
      const diff = kindOf === 'fixed' ? Math.min(5, Math.max(1, (nq >= 9 ? 5 : nq === 8 ? 4 : nq - 4) - (cnt >= 3 ? 1 : 0))) : Math.min(5, Math.max(1, (nq >= 9 ? 5 : nq === 8 ? 4 : nq - 4) - (cnt >= 8 ? 1 : 0)));
      let title = kindOf === 'fixed' ? cap(NUM[cnt]) + (cnt === 1 ? ' Queen' : ' Queens') + ' Given' : cap(NUM[cnt] || String(cnt)) + ' Forbidden Squares';
      if (nq !== 8) title += ' on ' + nq + ' × ' + nq;
      let t2 = title, rn = 1;
      while (uniqTitles.has(t2)) t2 = title + ' ' + ['', 'II', 'III', 'IV', 'V'][rn++];
      uniqTitles.add(t2);
      P.push({ id: 'queens-u' + String(idx).padStart(2, '0'), title: t2, diff, text: txt, concepts: ['deduction'], tags: [kindOf === 'fixed' ? 'given' : 'forbidden'], data: d });
      return;
    }
    console.warn('no unique puzzle ' + kindOf + ' ' + n + ' on ' + R);
  };
  let ui = 1;
  // [fewest clues, kind, board, most clues]
  [[3, 'fixed', 8, 3], [3, 'fixed', 8, 3], [2, 'fixed', 8, 2], [2, 'fixed', 8, 2], [3, 'fixed', 8, 4],
    [6, 'forbid', 8, 9], [8, 'forbid', 8, 12], [5, 'forbid', 8, 7], [8, 'forbid', 8, 12],
    [2, 'fixed', 6, 2], [1, 'fixed', 6, 1], [2, 'fixed', 7, 3], [3, 'forbid', 6, 6], [4, 'forbid', 7, 8],
    [3, 'fixed', 9, 3], [3, 'fixed', 10, 4], [8, 'forbid', 9, 14], [10, 'forbid', 10, 16]
  ].forEach(([n, k, R, mx]) => uniq(n, k, ui++, R, mx));

  // rooks on forbidden squares (a permutation with holes)
  [['Rooks and Rubble', 5, 3], ['The Rook Tower', 6, 3], ['A Crowded Rook Yard', 7, 4]].forEach(([title, n, diff], i) => {
    const d0 = base(n, n, 'R', n, 'indep');
    for (let t = 0; t < 300; t++) {
      const perm = rng.shuffle(Array.from({ length: n }, (x, j) => j));
      const sol = perm.map((c, r) => r * n + c).sort((a, b) => a - b);
      const forbid = [];
      const all = () => allIndep(Object.assign({}, d0, { forbid }), 50000);
      let live = all();
      let guard = 0;
      while (live.length > 1 && guard++ < 60) {
        const cnt = {};
        live.forEach((x) => x.forEach((s) => { if (!sol.includes(s)) cnt[s] = (cnt[s] || 0) + 1; }));
        const keys = Object.keys(cnt).map(Number).sort((a, b) => cnt[b] - cnt[a]);
        forbid.push(rng() < 0.6 ? keys[0] : rng.pick(keys.slice(0, 4)));
        live = all();
      }
      if (live.length !== 1) continue;
      P.push({ id: 'queens-rooks-' + (i + 1), title, diff, text: 'Place ' + NUM[n] + ' rooks on the ' + n + ' × ' + n + ' board, none attacking another, and none on a crossed square. There is exactly one way.', concepts: ['deduction'], tags: ['rooks'], data: Object.assign({}, d0, { forbid: forbid.sort((a, b) => a - b), sol, unique: true }) });
      return;
    }
  });

  // the most pieces that fit
  const blocks = (R, W, h, w) => { const out = []; for (let r = 0; r < R; r += h) for (let c = 0; c < W; c += w) { const g = []; for (let i = r; i < Math.min(R, r + h); i++) for (let j = c; j < Math.min(W, c + w); j++) g.push(i * W + j); out.push(g); } return out; };
  const diagCover = (n) => {
    // one group per diagonal running up to the right, with the two single corners joined along the other diagonal
    const groups = [];
    for (let k = 0; k < 2 * n - 1; k++) { const g = []; for (let r = 0; r < n; r++) { const c = k - (n - 1 - r); if (c >= 0 && c < n) g.push(r * n + c); } groups.push(g); }
    const singles = groups.filter((g) => g.length === 1);
    const rest = groups.filter((g) => g.length > 1);
    return rest.concat([[].concat(...singles)]);
  };
  const knightCover = (d) => {
    // pairs along a knight's tour (plus one single square on an odd board)
    const t = K.tourSearch(d, { limit: 2e6 }).sols[0];
    const out = [];
    for (let i = 0; i + 1 < t.length; i += 2) out.push([t[i], t[i + 1]]);
    if (t.length % 2) out.push([t[t.length - 1]]);
    return out;
  };
  push({ id: 'queens-bishops-4', title: 'Six Bishops', diff: 1, text: 'Place six bishops on a 4 × 4 board so that no bishop attacks another. (Six is the most that will fit.)', concepts: ['coloring-argument'], data: Object.assign(base(4, 4, 'B', 6, 'indep'), { most: diagCover(4) }), explain: 'Bishops stay on their diagonals. There are seven diagonals running up to the right, and the two single-square corners at their ends lie on one diagonal the other way, so at most six bishops fit — one per group.' });
  push({ id: 'queens-kings-5', title: 'Nine Kings at Peace', diff: 1, text: 'Place nine kings on a 5 × 5 board so that no two stand next to each other, even diagonally.', data: Object.assign(base(5, 5, 'K', 9, 'indep'), { most: blocks(5, 5, 2, 2) }), explain: 'Cut the board into nine blocks of at most 2 × 2 squares: two kings in the same block would touch, so nine is the most.' });
  push({ id: 'queens-bishops-8', title: 'Fourteen Bishops', diff: 2, text: 'Place fourteen bishops on the chessboard so that none attacks another — the most that will fit.', hints: ['Put them on the edges of the board.', 'Fill the top row and the bottom row, but leave out two squares.'], data: Object.assign(base(8, 8, 'B', 14, 'indep'), { most: diagCover(8) }), explain: 'A bishop never leaves its diagonal. There are fifteen diagonals running up to the right; the two single corner squares at their ends (a8 and h1) sit on one long diagonal the other way, so they cannot both hold a bishop. That leaves room for at most fourteen — and a full top row with six bishops on the bottom row gives exactly that.' });
  push({ id: 'queens-knights-8', title: 'Thirty-Two Knights', diff: 2, text: 'Place thirty-two knights on the chessboard so that no knight attacks another. (That is the most possible.)', hints: ['A knight always attacks squares of the other colour.'], data: Object.assign(base(8, 8, 'N', 32, 'indep'), { most: knightCover(base(8, 8, 'N', 32, 'indep')) }), explain: 'Put a knight on every white square: a knight only ever attacks the other colour, so none attacks another. No more fit: a knight\'s tour pairs up all 64 squares into 32 knight\'s-jump pairs, and each pair can hold at most one knight.', concepts: ['coloring-argument'] });
  push({ id: 'queens-kings-8', title: 'Sixteen Kings', diff: 2, text: 'Place sixteen kings on the chessboard, no two touching — the most that will fit.', data: Object.assign(base(8, 8, 'K', 16, 'indep'), { most: blocks(8, 8, 2, 2) }), explain: 'Cut the board into sixteen 2 × 2 blocks: each can hold only one king.' });
  push({ id: 'queens-knights-5', title: 'Thirteen Knights', diff: 2, text: 'Place thirteen knights on a 5 × 5 board, none attacking another.', data: Object.assign(base(5, 5, 'N', 13, 'indep'), { most: knightCover(base(5, 5, 'N', 13, 'indep')) }), explain: 'The thirteen squares of the corner colour: knights on one colour never attack each other. A knight\'s tour of the board splits the squares into twelve jump-pairs and one square left over, so thirteen is the most.', concepts: ['coloring-argument'] });
  push({ id: 'queens-bishops-6', title: 'Ten Bishops', diff: 2, text: 'Place ten bishops on a 6 × 6 board so that none attacks another.', data: Object.assign(base(6, 6, 'B', 10, 'indep'), { most: diagCover(6) }) });
  push({ id: 'queens-bishops-5', title: 'Eight Bishops on Five by Five', diff: 1, text: 'Place eight bishops on a 5 × 5 board so that none attacks another — the most that fit.', data: Object.assign(base(5, 5, 'B', 8, 'indep'), { most: diagCover(5) }) });
  push({ id: 'queens-bishops-7', title: 'Twelve Bishops', diff: 2, text: 'Twelve bishops on a 7 × 7 board, none attacking another.', data: Object.assign(base(7, 7, 'B', 12, 'indep'), { most: diagCover(7) }) });
  push({ id: 'queens-knights-6', title: 'Eighteen Knights', diff: 2, text: 'Place eighteen knights on a 6 × 6 board so that none attacks another.', data: Object.assign(base(6, 6, 'N', 18, 'indep'), { most: knightCover(base(6, 6, 'N', 18, 'indep')) }), concepts: ['coloring-argument'] });
  push({ id: 'queens-kings-6', title: 'Nine Kings on Six by Six', diff: 1, text: 'Nine kings on a 6 × 6 board, no two touching.', data: Object.assign(base(6, 6, 'K', 9, 'indep'), { most: blocks(6, 6, 2, 2) }) });
  push({ id: 'queens-9', title: 'Nine Queens', diff: 3, text: 'Nine queens on a 9 × 9 board, none attacking another.', data: base(9, 9, 'Q', 9, 'indep') });
  push({ id: 'queens-10', title: 'Ten Queens', diff: 4, text: 'Ten queens on a 10 × 10 board, none attacking another.', data: base(10, 10, 'Q', 10, 'indep') });

  // queens with pawns in the way
  [['Nine Queens and a Pawn', 8, 1, 4], ['Seven Queens, One Pawn', 6, 1, 3], ['Eight Queens, One Pawn', 7, 1, 4], ['Ten Queens and Two Pawns', 8, 2, 5]].forEach(([title, n, np, diff], i) => {
    for (let t = 0; t < 2000; t++) {
      const pawns = [];
      while (pawns.length < np) { const s = rng.int(n * n); if (!pawns.includes(s)) pawns.push(s); }
      const d = Object.assign(base(n, n, 'Q', n + np, 'indep'), { pawns: pawns.sort((a, b) => a - b) });
      const r = K.indepSearch(d, { limit: 2e6 });
      if (!r.sols.length) continue;
      d.sol = r.sols[0];
      P.push({ id: 'queens-pawn-' + (i + 1), title, diff, text: 'A pawn blocks lines like a wall: queens on either side of it do not attack each other through it. With ' + (np === 1 ? 'the pawn' : 'the pawns') + ' where ' + (np === 1 ? 'it stands' : 'they stand') + ', place ' + NUM[n + np] + ' queens on the ' + n + ' × ' + n + ' board, none attacking another — ' + NUM[np] + ' more than would fit on an empty board.', hints: ['Some row must hold two queens — one on each side of a pawn. Some column too.'], concepts: ['deduction'], tags: ['pawn'], data: d });
      return;
    }
    console.warn('no pawn puzzle ' + title);
  });

  // guarding every square with the fewest pieces
  const dom = (id, title, diff, R, piece, need, text, extra) => {
    const d = Object.assign(base(R, R, piece, need, extra && extra.both ? 'both' : 'dom'), extra && extra.data);
    push(Object.assign({ id, title, diff, text, concepts: ['deduction'], tags: ['guard'], data: d }, extra && extra.p));
  };
  dom('queens-guard-4', 'Two Queens Guard Four by Four', 1, 4, 'Q', 2, 'Place two queens on a 4 × 4 board so that every square is occupied or attacked. (One queen is not enough.)', { data: { fewest: true } });
  dom('queens-guard-5', 'Three Queens on Five by Five', 2, 5, 'Q', 3, 'Guard every square of a 5 × 5 board with three queens. Two will not do.', { data: { fewest: true } });
  dom('queens-guard-6', 'Three Queens on Six by Six', 3, 6, 'Q', 3, 'Guard every square of a 6 × 6 board with only three queens.', { data: { fewest: true } });
  dom('queens-guard-7', 'Four Queens on Seven by Seven', 3, 7, 'Q', 4, 'Guard every square of a 7 × 7 board with four queens.', { data: { fewest: true } });
  dom('queens-guard-8', 'Five Queens Guard the Board', 4, 8, 'Q', 5, 'Place five queens so that every square of the chessboard is occupied or attacked. Four queens can never manage it.', {
    data: { fewest: true },
    p: { hints: ['Put some queens near the centre, where they see the most.', 'The corners are the hardest squares to guard.'], explain: 'Five queens can guard all 64 squares in thousands of ways; four never can — the cabinet tried every placement of four. Guarding puzzles like this have been studied since the 19th century, and the fewest queens needed on bigger boards is still not known for every size.' }
  });
  dom('queens-guard-8b', 'Five Queens at Peace', 5, 8, 'Q', 5, 'Now guard every square with five queens that do not attack one another.', { both: true, data: { fewest: true } });
  dom('queens-kings-guard', 'Nine Kings Guard the Board', 3, 8, 'K', 9, 'Place nine kings so that every square is occupied or next to a king. No fewer can do it.', { data: { far: [9, 12, 15, 33, 36, 39, 57, 60, 63] }, p: { explain: 'Each king guards at most a 3 × 3 block. The nine squares b2, e2, h2, b5, e5, h5, b8, e8, h8 are so far apart that no block contains two of them — so at least nine kings are needed, and nine in a 3 × 3 pattern of blocks suffice.' } });
  dom('queens-bishops-guard', 'Eight Bishops on Guard', 3, 8, 'B', 8, 'Place eight bishops so that every square of the chessboard is occupied or attacked.', { data: { sol: [3, 11, 19, 27, 35, 43, 51, 59] } });
  dom('queens-rooks-guard', 'Five Rooks Guard Five by Five', 1, 5, 'R', 5, 'Guard every square of a 5 × 5 board with five rooks.', { p: { explain: 'With fewer than five rooks some row and some column would be empty, and the square where they cross would be unguarded. Five in a line — or on a diagonal — do it.' } });
  dom('queens-knights-guard-4', 'Four Knights on Four by Four', 2, 4, 'N', 4, 'Guard every square of a 4 × 4 board with four knights.', { data: { fewest: true } });
  dom('queens-knights-guard-5', 'Five Knights on Five by Five', 3, 5, 'N', 5, 'Guard every square of a 5 × 5 board with five knights.', { data: { fewest: true } });
  dom('queens-knights-guard-6', 'Eight Knights on Six by Six', 4, 6, 'N', 8, 'Guard every square of a 6 × 6 board with eight knights.', { data: { fewest: true } });
  dom('queens-kings-guard-5', 'Four Kings on Five by Five', 1, 5, 'K', 4, 'Guard every square of a 5 × 5 board with four kings.', { data: { far: [0, 3, 15, 18] }, p: { explain: 'The squares in the corners of a 4 × 4 block — a5, d5, a2, d2 — are three apart, so no king guards two of them: four kings are needed, and four suffice.' } });
  dom('queens-kings-guard-6', 'Four Kings on Six by Six', 2, 6, 'K', 4, 'Guard every square of a 6 × 6 board with four kings.', { data: { far: [0, 3, 18, 21] } });
  dom('queens-kings-both-8', 'Nine Kings, Not Touching', 4, 8, 'K', 9, 'Guard every square of the chessboard with nine kings, no two of them next to each other.', { both: true, data: { far: [9, 12, 15, 33, 36, 39, 57, 60, 63] } });
  dom('queens-guard-4b', 'Three Queens at Peace on Four by Four', 2, 4, 'Q', 3, 'On a 4 × 4 board, place three queens that guard every square without attacking one another.', { both: true });
  dom('queens-guard-6b', 'Four Queens at Peace on Six by Six', 3, 6, 'Q', 4, 'On a 6 × 6 board, place four queens that guard every square without attacking one another.', { both: true });
  // twelve knights: found by searching arrangements with quarter-turn symmetry
  {
    const d = base(8, 8, 'N', 12, 'dom');
    const I = K.placeInfo(d);
    const rot = (s) => { const r = Math.floor(s / 8), c = s % 8; return c * 8 + (7 - r); };
    const orbit = (s) => { const o = [s]; for (let i = 0; i < 3; i++) o.push(rot(o[o.length - 1])); return o; };
    let sol = null;
    const quad = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) quad.push(r * 8 + c);
    for (let a = 0; a < 16 && !sol; a++) for (let b2 = a + 1; b2 < 16 && !sol; b2++) for (let c2 = b2 + 1; c2 < 16 && !sol; c2++) {
      const pcs = [].concat(orbit(quad[a]), orbit(quad[b2]), orbit(quad[c2]));
      if (new Set(pcs).size !== 12) continue;
      const g = new Uint8Array(64);
      pcs.forEach((s) => { g[s] = 1; I.cov[s].forEach((t) => { g[t] = 1; }); });
      if (g.every((x) => x)) sol = pcs.sort((x, y) => x - y);
    }
    if (!sol) throw new Error('no symmetric twelve knights');
    d.sol = sol;
    P.push({ id: 'queens-knights-12', title: 'Twelve Knights', diff: 5, text: 'Twelve knights can guard every square of the chessboard. Find how. (A clue: the answer can look the same after a quarter turn of the board.)', explain: 'Twelve is known to be the fewest knights that can guard the whole board. The arrangement here repeats after every quarter turn.', hints: ['Three knights in each quarter of the board, placed the same way after each quarter turn.'], concepts: ['symmetry'], tags: ['guard'], data: d });
  }




  const order = ['queens-4', 'queens-rooks-8', 'queens-5'];
  P.sort((a, b) => a.diff - b.diff || (order.indexOf(b.id) >= 0) - (order.indexOf(a.id) >= 0));
  write('queens', {
    id: 'queens', engine: 'chessmen', cat: 'logic', name: 'Queens and guards', order: 5,
    blurb: 'Eight queens that do not attack each other, five that guard the whole board, the most bishops that fit — the chessboard puzzles of Bezzel, Gauss and their heirs.',
    origin: { year: 1848, who: 'Max Bezzel', note: 'Bezzel\'s eight-queens problem of 1848 started a long line of chessboard puzzles about placing pieces: none attacking, all guarding, as many or as few as possible.' },
    concepts: ['deduction', 'coloring-argument']
  }, P);
}

knightSwaps();
knightsTours();
queens();
