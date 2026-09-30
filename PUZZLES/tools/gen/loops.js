/* The Puzzle Cabinet · tools/gen/loops.js
 *
 *   node tools/gen/loops.js                        writes all five data files
 *   node tools/gen/loops.js slitherlink kakuro     only these families
 *   (slitherlink, masyu, bridges-hashi, nurikabe, kakuro)
 *
 * The making itself is in js/lib/loops-logic.js (the Endless drawers use the
 * same code); here it runs with fixed seeds and a plan per difficulty:
 *
 * data/slitherlink.js    a random loop (the outline of a random region), every
 *                        clue written in, then clues taken away while logic of
 *                        the wanted level still finishes the grid
 * data/masyu.js          a random loop through cell centres with every pearl it
 *                        allows, reshaped square by square until logic pins it
 *                        down, then pearls taken away the same way
 * data/bridges-hashi.js  islands dropped one by one and joined by random
 *                        bridges (plus a few extra ones), kept if logic finishes it
 * data/nurikabe.js       random islands in a connected sea, reshaped (numbers
 *                        moved, cells added and taken away) until logic finishes it
 * data/kakuro.js         a symmetric pattern, random digits, digits changed one at
 *                        a time until logic finishes it
 * Every puzzle is graded by the logic it needs, and checked by verify() — which
 * proves the solution is the only one.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/loops-logic.js'));
require(path.join(ROOT, 'engines/loops.js'));
const L = C.loopsLogic;
const E = C.engines.loops;

const want = process.argv.slice(2);
const doIt = (k) => !want.length || want.includes(k);
const pad3 = (k) => String(k).padStart(3, '0');

function writeFamily(file, meta, puzzles, history) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/loops.js */');
  lines.push('Cabinet.family({');
  Object.keys(meta).forEach((k, i, a) => lines.push('  ' + k + ': ' + JSON.stringify(meta[k]) + (i < a.length - 1 ? ',' : '')));
  lines.push('}, [');
  puzzles.forEach((p, i) => {
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(', ') + ' }' + (i < puzzles.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  if (history && history.length) {
    lines.push('Cabinet.history([');
    history.forEach((ev, i) => lines.push('  ' + JSON.stringify(ev) + (i < history.length - 1 ? ',' : '')));
    lines.push(']);');
  }
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), out);
  let bad = 0, slow = 0, worst = 0;
  const t0 = Date.now();
  puzzles.forEach((p) => {
    const s = Date.now();
    const r = E.verify(Object.assign({ family: meta.id }, p));
    const dt = Date.now() - s;
    worst = Math.max(worst, dt);
    if (dt > 300) slow++;
    if (!r.ok) { bad++; console.log('  VERIFY FAILED ' + p.id + ': ' + r.err); } else if (r.warn) console.log('  warn ' + p.id + ': ' + r.warn);
  });
  console.log(file + ': ' + puzzles.length + ' puzzles, ' + Math.round(out.length / 1024) + ' KB, verify ' + (Date.now() - t0) + ' ms (worst ' + worst + ' ms)' + (slow ? ' (' + slow + ' slow)' : '') + (bad ? ', ' + bad + ' FAILED' : ''));
  const byDiff = [0, 0, 0, 0, 0, 0];
  puzzles.forEach((p) => byDiff[p.diff]++);
  console.log('  difficulty 1..5: ' + byDiff.slice(1).join(' / '));
}

/* fill a quota per difficulty from a plan of makers per difficulty */
function collect(label, seed, quota, plan, make) {
  const rng = C.rng(seed);
  const out = [], seen = new Set();
  for (let d = 1; d <= 5; d++) {
    const need = quota[d] || 0;
    let got = 0, tries = 0, k = 0;
    const t0 = Date.now();
    while (got < need && tries < need * 60) {
      tries++;
      const cfg = plan[d][k++ % plan[d].length];
      const r = make(cfg, rng);
      if (!r || r.diff !== d) continue;
      const key = JSON.stringify(r.data);
      if (seen.has(key)) continue;
      seen.add(key);
      r.cfg = cfg;
      out.push(r);
      got++;
    }
    console.log('  ' + label + ' diff ' + d + ': ' + got + '/' + need + ' in ' + tries + ' tries, ' + (Date.now() - t0) + ' ms');
  }
  return out;
}

const area = (r) => r.data.w * r.data.h;

/* ---------- slitherlink ---------- */

function genSlitherlink() {
  const plan = [null,
    [[5, 5, 1], [6, 6, 1], [6, 6, 1]],
    [[7, 7, 1], [6, 6, 2], [7, 7, 2]],
    [[8, 8, 2], [10, 10, 2], [6, 6, 3]],
    [[7, 7, 3], [8, 8, 3]],
    [[10, 10, 3]]];
  const list = collect('slitherlink', 20260930 + 101, { 1: 12, 2: 13, 3: 13, 4: 12, 5: 10 }, plan, ([w, h, lv], rng) => {
    const r = L.slMake(w, h, rng, lv);
    return r && { diff: r.diff, grade: r.grade, data: { kind: 'slither', w, h, clues: r.clues, sol: r.sol } };
  });
  list.sort((a, b) => a.diff - b.diff || area(a) - area(b) || a.grade.l3 - b.grade.l3 || a.grade.l2 - b.grade.l2);
  const TITLES = ['First Fence', 'Garden Path', 'Picket Line', 'Paddock', 'Sheepfold', 'Hula Hoop', 'Skipping Rope', 'Rubber Band', 'Lasso', 'Duck Pond',
    'Picture Frame', 'Ring Road', 'Moat', 'Hedgerow', 'Corral', 'Cattle Grid', 'Round Trip', 'Racetrack', 'Orbit', 'Halo', 'Horseshoe', 'Necklace', 'Coastline',
    'Dry-Stone Wall', 'Boundary Stone', 'Beating the Bounds', 'Parish Line', 'Perimeter', 'Border Patrol', 'Contour Line', 'Silhouette', 'Chalk Outline',
    'Tracing Paper', 'Lariat', 'Slalom', 'Serpentine', 'Castle Keep', 'Rampart', 'Palisade', 'Stockade', 'Cordon', 'Tripwire', 'Treasure Map', 'Lake Shore',
    'Tidemark', 'Isobar', 'Watershed', 'County Line', 'The Long Way Round', 'Ley Line', 'Maze Wall', 'Hedge Maze', 'Snake Pit', 'Ouroboros', 'Circumnavigation',
    'Full Circle', 'Closed Circuit', 'Loop the Loop', 'Round the Houses', 'Grand Tour', 'Enclosure Act', 'No Loose Ends'];
  const puzzles = list.map((r, k) => ({
    id: 'slither-' + pad3(k + 1),
    title: TITLES[k] || 'Loop ' + (k + 1),
    diff: r.diff,
    text: E.textFor(r.data),
    concepts: ['deduction', 'parity', 'graph'],
    tags: [r.data.w + 'x' + r.data.h, 'loopy', 'slitherlink', 'loop'],
    data: r.data
  }));
  writeFamily('slitherlink.js', {
    id: 'slitherlink', engine: 'loops', cat: 'pencil', name: 'Slitherlink', order: 30,
    blurb: 'Draw one loop along the dotted lines; every number counts the sides of its square that the loop uses.',
    origin: { year: 1989, who: 'Nikoli', note: 'The Japanese puzzle publisher Nikoli introduced Slitherlink in 1989. Simon Tatham\'s portable puzzle collection plays it as *Loopy*.' },
    concepts: ['deduction', 'parity', 'graph']
  }, puzzles, [{ year: 1989, title: 'Slitherlink', text: 'The Japanese publisher Nikoli prints Slitherlink: one closed loop drawn round a grid of little numbers, each counting the sides of its square the loop uses.', links: ['slitherlink'] }]);
}

/* ---------- masyu ---------- */

function genMasyu() {
  const plan = [null,
    [[6, 6, 1], [7, 7, 1]],
    [[8, 8, 1], [10, 10, 1], [8, 8, 2]],
    [[6, 6, 3], [7, 7, 3]],
    [[8, 8, 3]],
    [[10, 10, 3]]];
  const list = collect('masyu', 20260930 + 202, { 1: 8, 2: 9, 3: 9, 4: 8, 5: 6 }, plan, ([w, h, lv], rng) => {
    const r = L.maMake(w, h, rng, lv);
    return r && { diff: r.diff, grade: r.grade, data: { kind: 'masyu', w, h, grid: r.grid, sol: r.sol } };
  });
  list.sort((a, b) => a.diff - b.diff || area(a) - area(b) || a.grade.l3 - b.grade.l3);
  const TITLES = ['String of Pearls', 'Oyster Bed', 'Worry Beads', 'Marbles', 'Polka Dots', 'Dewdrops', 'Humbugs', 'Salt and Pepper',
    'Moonstone', 'Mother of Pearl', 'Clam Shell', 'Choker', 'Charm Bracelet', 'Abacus', 'Go Stones', 'Magpie', 'Piano Keys',
    'Black Pearl', 'Nacre', 'Pearl Diver', 'Rosary', 'Jewel Box', 'Button Box', 'Domino', 'Penguin Parade', 'Liquorice Allsorts',
    'Night and Day', 'Yin and Yang', 'Tuxedo', 'Zebra Crossing', 'Frogspawn', 'Hailstones', 'Peppercorns', 'Caviar', 'Backgammon',
    'Draughts', 'Othello', 'Panda', 'Bubble Wrap', 'Mint Imperials', 'Tapioca', 'Snowballs', 'Pearl Barley', 'Mala'];
  const puzzles = list.map((r, k) => ({
    id: 'masyu-' + pad3(k + 1),
    title: TITLES[k] || 'Pearls ' + (k + 1),
    diff: r.diff,
    text: E.textFor(r.data),
    concepts: ['deduction', 'graph', 'parity'],
    tags: [r.data.w + 'x' + r.data.h, 'pearl', 'masyu', 'loop'],
    data: r.data
  }));
  writeFamily('masyu.js', {
    id: 'masyu', engine: 'loops', cat: 'pencil', name: 'Masyu', order: 31,
    blurb: 'One loop through every pearl: it turns on the black ones and runs straight through the white.',
    origin: { who: 'Nikoli', note: 'A loop puzzle from the Japanese puzzle publisher Nikoli. Simon Tatham\'s portable puzzle collection plays it as *Pearl*.' },
    concepts: ['deduction', 'graph', 'parity']
  }, puzzles);
}

/* ---------- bridges ---------- */

function genBridges() {
  const hard = { extra: 0.7, doubles: 0.18 };
  const plan = [null,
    [[7, 7, 1, {}], [8, 8, 1, {}]],
    [[9, 9, 1, {}], [10, 10, 2, {}], [9, 9, 2, {}]],
    [[10, 10, 3, hard], [13, 13, 2, {}]],
    [[13, 13, 3, hard], [10, 10, 3, hard]],
    [[13, 13, 3, hard], [15, 15, 3, hard]]];
  const list = collect('bridges', 20260930 + 303, { 1: 10, 2: 11, 3: 11, 4: 10, 5: 8 }, plan, ([w, h, lv, o], rng) => {
    const r = L.hsMake(w, h, rng, lv, o);
    return r && { diff: r.diff, grade: r.grade, K: r.P.K, data: { kind: 'hashi', w, h, grid: r.grid, sol: r.sol } };
  });
  list.sort((a, b) => a.diff - b.diff || a.K - b.K || a.grade.l3 - b.grade.l3);
  const TITLES = ['Stepping Stones', 'Footbridge', 'Island Hopping', 'Jetty', 'Pontoon', 'Ferry Crossing', 'Causeway', 'Rope Bridge', 'Stone Arch', 'Humpback Bridge',
    'Drawbridge', 'Swing Bridge', 'Harbour Lights', 'Quayside', 'Marina', 'Canal Locks', 'Gondola', 'Punt', 'Toll Bridge', 'Keystone', 'Viaduct', 'Aqueduct',
    'Archipelago', 'Skerries', 'Thousand Islands', 'Coral Keys', 'Atoll Hop', 'Fjord', 'Lighthouse Row', 'Castaways', 'Venetian Evening', 'Lagoon City',
    'Frisian Isles', 'Hebridean Hop', 'Orkney Crossing', 'Faroe Winds', 'Stockholm Skerries', 'Double Span', 'Two by Two', 'Tightrope', 'Zip Line',
    'Suspension', 'Bascule', 'Pontifex', 'Bridge Club', 'Crossing Guard', 'Wharf', 'Pier Review', 'Span of Attention', 'Burning Bridges', 'Troll Country', 'Ferry Tale'];
  const puzzles = list.map((r, k) => ({
    id: 'hashi-' + pad3(k + 1),
    title: TITLES[k] || 'Bridges ' + (k + 1),
    diff: r.diff,
    text: E.textFor(r.data),
    concepts: ['deduction', 'graph'],
    tags: [r.data.w + 'x' + r.data.h, r.K + ' islands', 'hashiwokakero', 'bridges'],
    data: r.data
  }));
  writeFamily('bridges-hashi.js', {
    id: 'bridges-hashi', engine: 'loops', cat: 'pencil', name: 'Bridges', order: 32,
    blurb: 'Join every island with single and double bridges — no crossings, and all in one connected piece.',
    origin: { year: 1990, who: 'Nikoli', note: 'The Japanese publisher Nikoli introduced Hashiwokakero ("build bridges!") in 1990. Simon Tatham\'s portable puzzle collection calls it simply *Bridges*.' },
    concepts: ['deduction', 'graph']
  }, puzzles, [{ year: 1990, title: 'Hashiwokakero', text: 'Nikoli publishes Hashiwokakero, "build bridges!": islands to be joined by one or two bridges at a time, with no crossings, into one connected whole.', links: ['bridges-hashi'] }]);
}

/* ---------- nurikabe ---------- */

function genNurikabe() {
  const plan = [null,
    [[5, 5, 1], [6, 6, 1], [7, 7, 1]],
    [[6, 6, 2], [7, 7, 2], [8, 8, 2]],
    [[7, 7, 3], [8, 8, 2], [8, 8, 3]],
    [[8, 8, 3], [9, 9, 3]],
    [[10, 10, 3], [9, 9, 3]]];
  const list = collect('nurikabe', 20260930 + 404, { 1: 8, 2: 9, 3: 9, 4: 8, 5: 6 }, plan, ([w, h, lv], rng) => {
    const r = L.nkMake(w, h, rng, lv);
    return r && { diff: r.diff, grade: r.grade, data: { kind: 'nurikabe', w, h, grid: r.grid, sol: r.sol } };
  });
  list.sort((a, b) => a.diff - b.diff || area(a) - area(b) || a.grade.l3 - b.grade.l3 || a.grade.l2 - b.grade.l2);
  const TITLES = ['Desert Island', 'Tide Pools', 'Sandbar', 'Castaway', 'Low Tide', 'Cove', 'Islet', 'Lagoon', 'Atoll', 'Shoals', 'Reef',
    'Treasure Island', 'Coral Sea', 'Salt Marsh', 'High Tide', 'Spring Tide', 'Neap Tide', 'Ebb and Flow', 'Sea Wall', 'Breakwater', 'Estuary',
    'Delta', 'Isthmus', 'Peninsula', 'Headland', 'Inlet', 'Strait', 'Firth', 'Sea Stack', 'Mudflats', 'Kelp Forest', 'Seal Colony', 'Puffin Rock',
    'Gull Island', 'Crab Pots', 'Driftwood', 'Message in a Bottle', 'Walls of Water', 'Holm and Eyot', 'Cays and Keys', 'Motu', 'The Wall Spirit'];
  const puzzles = list.map((r, k) => ({
    id: 'nurikabe-' + pad3(k + 1),
    title: TITLES[k] || 'Islands ' + (k + 1),
    diff: r.diff,
    text: E.textFor(r.data),
    concepts: ['deduction', 'graph'],
    tags: [r.data.w + 'x' + r.data.h, 'nurikabe', 'islands', 'sea'],
    data: r.data
  }));
  writeFamily('nurikabe.js', {
    id: 'nurikabe', engine: 'loops', cat: 'pencil', name: 'Nurikabe', order: 33,
    blurb: 'Shade a sea around numbered islands: one connected sea, no 2×2 pools, and every island the size of its number.',
    origin: { year: 1991, who: 'Nikoli', note: 'Nikoli introduced Nurikabe in 1991. The name comes from Japanese folklore: an invisible wall that blocks the way of travellers at night.' },
    concepts: ['deduction', 'graph']
  }, puzzles, [{ year: 1991, title: 'Nurikabe', text: 'Nikoli introduces Nurikabe: shade a sea around numbered islands so that the sea stays in one piece and never forms a 2×2 pool.', links: ['nurikabe'] }]);
}

/* ---------- kakuro ---------- */

function genKakuro() {
  const plan = [null,
    [[5, 5, 1], [6, 6, 1], [7, 7, 1]],
    [[6, 6, 2], [7, 7, 2]],
    [[8, 8, 2], [9, 9, 2]],
    [[10, 10, 2], [9, 9, 3]],
    [[12, 12, 2], [11, 11, 2]]];
  const list = collect('kakuro', 20260930 + 505, { 1: 10, 2: 11, 3: 11, 4: 10, 5: 8 }, plan, ([w, h, lv], rng) => {
    const r = L.kkMake(w, h, rng, lv);
    return r && { diff: r.diff, grade: r.grade, data: { kind: 'kakuro', w, h, grid: r.grid, clues: r.clues, sol: r.sol } };
  });
  list.sort((a, b) => a.diff - b.diff || area(a) - area(b) || a.grade.l2 - b.grade.l2);
  const TITLES = ['First Sums', 'Two\'s Company', 'Three\'s a Crowd', 'Tally Sticks', 'Petty Cash', 'Piggy Bank', 'Adding Up', 'Sum Fun', 'In Sum', 'All Told',
    'Cross Totals', 'Carry the One', 'Running Total', 'Counting House', 'Ledger', 'Till Roll', 'Receipt', 'Rounding Up', 'Change, Please', 'Nest Egg',
    'Four Square', 'Five and Dime', 'Six of One', 'Seventh Heaven', 'Pieces of Eight', 'Nine Lives', 'Dozen', 'Baker\'s Dozen', 'Score', 'Gross',
    'Balance Sheet', 'Bottom Line', 'Double Entry', 'Audit', 'Books Balanced', 'Checksum', 'Column Inches', 'Odds and Evens', 'Magic Numbers',
    'Number Crunch', 'Digit Dance', 'Cash Register', 'Abacus Lane', 'Grand Total', 'Sum Total', 'Summit', 'The Accountant\'s Holiday',
    'Crossword Without Words', 'Sums and Crosses', 'Tax Return', 'Year End', 'Compound Interest'];
  const puzzles = list.map((r, k) => ({
    id: 'kakuro-' + pad3(k + 1),
    title: TITLES[k] || 'Cross Sums ' + (k + 1),
    diff: r.diff,
    text: E.textFor(r.data),
    concepts: ['deduction', 'combinatorics'],
    tags: [r.data.w + 'x' + r.data.h, 'kakuro', 'cross sums', 'sums'],
    data: r.data
  }));
  writeFamily('kakuro.js', {
    id: 'kakuro', engine: 'loops', cat: 'pencil', name: 'Kakuro', order: 34,
    blurb: 'Cross sums: fill runs of white cells with different digits that add up to the totals beside them.',
    origin: { who: 'Dell Magazines and Nikoli', note: 'American puzzle magazines from Dell printed these as *Cross Sums*. In Japan Nikoli called them Kakuro, short for *kasan kurosu*, "addition cross".' },
    concepts: ['deduction', 'combinatorics']
  }, puzzles);
}

if (doIt('slitherlink')) genSlitherlink();
if (doIt('masyu')) genMasyu();
if (doIt('bridges-hashi')) genBridges();
if (doIt('nurikabe')) genNurikabe();
if (doIt('kakuro')) genKakuro();
