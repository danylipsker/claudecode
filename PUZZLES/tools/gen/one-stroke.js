/* The Puzzle Cabinet · tools/gen/one-stroke.js
 *
 *   node tools/gen/one-stroke.js        writes data/one-stroke.js
 *
 * The classic one-stroke figures first, then stars, rings and lattice
 * patterns made by js/lib/graphgen.js with fixed seeds, and "which of these
 * can be drawn?" cards. A figure can be drawn in one stroke when it is
 * connected and has no odd corners or exactly two; the stored stroke comes
 * from Hierholzer's method. Difficulty: the number of lines, nudged by how
 * often a careless random stroke gets stranded.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/graphlib.js'));
require(path.join(ROOT, 'js/lib/graphgen.js'));
require(path.join(ROOT, 'engines/graphs.js'));
const GL = C.GraphLib, GG = C.GraphGen;
const { build, analyse, strokeDiff, polyPts, closedSegs, chords, seg } = GG;
const eng = C.engines.graphs;

// how many different strokes draw a figure (small figures only)
function countTrails(fig, start) {
  const used = new Uint8Array(fig.e.length);
  let count = 0;
  const go = (v, k) => {
    if (k === fig.e.length) { count++; return; }
    fig.e.forEach((e, i) => {
      if (used[i] || (e[0] !== v && e[1] !== v)) return;
      used[i] = 1;
      go(e[0] === v ? e[1] : e[0], k + 1);
      used[i] = 0;
    });
  };
  go(start, 0);
  return count;
}

/* ---------- the classics ---------- */

const SQ = [[0, 100], [60, 100], [60, 40], [0, 40]];
const HOUSE = { segs: closedSegs(SQ).concat([seg(SQ[0], SQ[2]), seg(SQ[1], SQ[3]), seg(SQ[3], [30, 5]), seg([30, 5], SQ[2])]) };
const P5 = polyPts(5, 50, 50, 50), P6 = polyPts(6, 50, 50, 50), P7 = polyPts(7, 50, 50, 50);
function seedOfLife() { const c = [[50, 50, 20]]; for (let i = 0; i < 6; i++) c.push([50 + 20 * Math.cos(i * Math.PI / 3), 50 + 20 * Math.sin(i * Math.PI / 3), 20]); return c; }
function nested(levels) {
  const segs = [];
  let pts = [[0, 0], [100, 0], [100, 100], [0, 100]];
  for (let k = 0; k < levels; k++) {
    segs.push(...closedSegs(pts));
    pts = pts.map((p, i) => [(p[0] + pts[(i + 1) % 4][0]) / 2, (p[1] + pts[(i + 1) % 4][1]) / 2]);
  }
  return { segs };
}
function triGrid(k) {
  const h = Math.sqrt(3) / 2, segs = [];
  const P = (i, j) => [i * 20 + j * 10, -j * 20 * h];
  for (let j = 0; j < k; j++) {
    segs.push(seg(P(0, j), P(k - j, j)));
    segs.push(seg(P(j, 0), P(j, k - j)));
    segs.push(seg(P(j + 1, 0), P(0, j + 1)));
  }
  return { segs };
}
function grid(a, b) {
  const segs = [];
  for (let i = 0; i <= a; i++) segs.push([0, i * 20, b * 20, i * 20]);
  for (let j = 0; j <= b; j++) segs.push([j * 20, 0, j * 20, a * 20]);
  return { segs };
}

const houseFig = build(HOUSE, { cross: false });
const houseOdd = GL.odd(houseFig.v.length, houseFig.e);
const houseWays = countTrails(houseFig, houseOdd[0]);

const CLASSICS = [
  {
    id: 'stroke-nicholas', title: 'The House of Nicholas', diff: 1,
    source: 'A German children\'s drawing game, *Das Haus vom Nikolaus*.',
    shape: HOUSE, cross: false,
    text: 'German children draw this little house while chanting *Das ist das Haus vom Ni-ko-laus* — one syllable for each of the eight lines, and the pencil never leaves the paper. Can you?',
    hints: ['Starting at the top of the roof leaves you stuck sooner or later. Try a corner on the ground.', 'The two corners on the ground each meet three lines. Start at one of them — you will finish at the other.'],
    explain: 'The two bottom corners each meet **three** lines; every other corner meets an even number. A pen passing through a corner uses two lines, one in and one out, so a corner with an odd number of lines must be an end of the drawing. Start at one bottom corner and you finish at the other, whichever way you go. Starting from one given bottom corner there are ' + houseWays + ' different ways to draw it (the cabinet counted), and as many again from the other.',
    tags: ['classic', 'house'], concepts: ['euler-path']
  },
  {
    id: 'stroke-pentagram', title: 'The Pentagram', diff: 1,
    shape: { segs: chords(P5, 2) }, cross: false,
    source: 'An ancient figure; the Pythagoreans are said to have used it as a sign of recognition.',
    text: 'The five-pointed star has been drawn in one unbroken line for thousands of years. Draw it that way now: five lines, one stroke. Where lines cross, carry straight on — you may turn only at the points.',
    explain: 'Every point of the star meets two lines, so the stroke can start anywhere and closes up where it began — no wonder the pentagram became a sign of something without beginning or end.',
    tags: ['classic', 'star']
  },
  {
    id: 'stroke-two-rings', title: 'Two Rings', diff: 1,
    shape: { circles: [[35, 50, 25], [65, 50, 25]] },
    text: 'Two linked rings meet at two points. Trace all four arcs in one sweep of the pen.',
    tags: ['circles']
  },
  {
    id: 'stroke-bowtie', title: 'The Bow Tie', diff: 1,
    shape: { segs: closedSegs([[0, 10], [50, 50], [0, 90]]).concat(closedSegs([[100, 10], [50, 50], [100, 90]])) }, cross: false,
    text: 'Two triangles tied at one knot. Draw both without lifting the pen.',
    hints: ['Where the triangles touch, four lines meet: the place to change from one triangle to the other.'],
    tags: ['warm-up']
  },
  {
    id: 'stroke-square-circle', title: 'The Square in the Circle', diff: 1,
    shape: { circles: [[50, 50, 50]], segs: closedSegs(polyPts(4, 50, 50, 50, 45)) },
    text: 'A square set in a circle, touching it at four corners. Trace the square and the four arcs in a single stroke.',
    tags: ['circles']
  },
  {
    id: 'stroke-triforce', title: 'Triangle of Triangles', diff: 1,
    shape: triGrid(2),
    text: 'A triangle cut into four. Draw all the short lines in one go.',
    tags: ['triangles']
  },
  {
    id: 'stroke-pentacle', title: 'The Star in its Pentagon', diff: 2,
    shape: { segs: chords(P5, 1).concat(chords(P5, 2)) }, cross: false,
    text: 'A pentagon with every corner joined to every other: ten lines in all. The star inside may be crossed straight through — only the five corners are turning points.',
    explain: 'Each corner meets four lines, an even number, so the stroke can start at any corner and will close where it began. Mathematicians call this figure K₅, the complete graph on five points.',
    tags: ['star', 'complete-graph']
  },
  {
    id: 'stroke-star-ring', title: 'A Star in a Ring', diff: 2,
    shape: { circles: [[50, 50, 50]], segs: chords(P5, 2) }, cross: false,
    text: 'The pentagram inside its circle — the magician\'s seal of old storybooks. Draw the star and the ring together, pen on paper throughout.',
    tags: ['star', 'circles']
  },
  {
    id: 'stroke-venn', title: 'Three Circles', diff: 2,
    shape: { circles: [[38, 38, 26], [62, 38, 26], [50, 59, 26]] },
    text: 'Three overlapping circles, as in a Venn diagram. Twelve arcs; one stroke.',
    tags: ['circles', 'venn']
  },
  {
    id: 'stroke-nested', title: 'Squares within Squares', diff: 2,
    shape: nested(3),
    text: 'Each square\'s corners touch the middles of the sides of the square around it. Draw all three squares at once.',
    hints: ['At every touching point four lines meet — you can switch from one square to the next there.'],
    tags: ['squares']
  },
  {
    id: 'stroke-chain', title: 'A Chain of Four Rings', diff: 2,
    shape: { circles: [[20, 50, 16], [42, 50, 16], [64, 50, 16], [86, 50, 16]] },
    text: 'Four rings in a row, each hooked into the next. Draw the whole chain without lifting the pen.',
    tags: ['circles', 'chain']
  },
  {
    id: 'stroke-hexagram', title: 'The Six-Pointed Star', diff: 2,
    shape: { segs: chords(P6, 2) },
    text: 'Two triangles laid over each other. Two separate triangles can never be drawn in one stroke — but here they cross, and at a crossing you may turn.',
    explain: 'All twelve corners — the six points and the six crossings — are even, so one stroke does it, but only by changing from one triangle to the other at the crossings.',
    tags: ['star']
  },
  {
    id: 'stroke-rings', title: 'Five Linked Rings', diff: 3,
    shape: { circles: [[20, 34, 17], [39, 50, 17], [58, 34, 17], [77, 50, 17], [96, 34, 17]] },
    text: 'Five rings in two rows, each linked to its neighbours — a famous emblem. Every arc once, in one flowing line.',
    hints: ['Every meeting point has four arcs, so you can always get out again. The trap is leaving an end ring half drawn.'],
    tags: ['circles']
  },
  {
    id: 'stroke-hex-star', title: 'Hexagon and Star', diff: 3,
    shape: { segs: chords(P6, 1).concat(chords(P6, 2)) },
    text: 'A hexagon with a six-pointed star inside it, drawn on the same six points. Every short line once, in one stroke.',
    tags: ['star']
  },
  {
    id: 'stroke-heptagram', title: 'Seven Points, All Joined', diff: 3,
    shape: { segs: chords(P7, 1).concat(chords(P7, 2), chords(P7, 3)) }, cross: false,
    text: 'Seven points, each joined to all the others: twenty-one lines crossing everywhere. Turn only at the seven points.',
    explain: 'Each point meets six lines, so every corner is even and the stroke can start anywhere. With six or eight points every corner would meet an odd number of lines, and the web could not be drawn in one stroke at all.',
    tags: ['complete-graph']
  },
  {
    id: 'stroke-seed', title: 'The Seed of Life', diff: 4,
    shape: { circles: seedOfLife() },
    text: 'Seven equal circles: one in the middle, six around it, each passing through the centre. Draw every arc in one continuous line — a decorative figure found on old walls and floors.',
    hints: ['Twelve arcs meet at the centre point, so the pen passes through it six times. Do not use up the centre too early.'],
    tags: ['circles', 'rosette']
  }
];

/* figures for the "which can be drawn?" cards */
const NAMED = {
  envelope: { name: 'the sealed envelope', shape: { segs: closedSegs([[0, 20], [100, 20], [100, 80], [0, 80]]).concat([[0, 20, 100, 80], [100, 20, 0, 80]]) } },
  noughts: { name: 'a noughts-and-crosses grid', shape: { segs: [[33, 0, 33, 100], [67, 0, 67, 100], [0, 33, 100, 33], [0, 67, 100, 67]] } },
  grid2: { name: 'a 2 × 2 grid of squares', shape: grid(2, 2) },
  grid3: { name: 'a 3 × 3 grid of squares', shape: grid(3, 3) },
  grid12: { name: 'two squares side by side', shape: grid(1, 2) },
  cube: { name: 'a cube in perspective', shape: { segs: closedSegs([[0, 30], [70, 30], [70, 100], [0, 100]]).concat(closedSegs([[30, 0], [100, 0], [100, 70], [30, 70]]), [[0, 30, 30, 0], [70, 30, 100, 0], [70, 100, 100, 70], [0, 100, 30, 70]]) }, cross: false },
  hexdiam: { name: 'a hexagon with its three long diagonals', shape: { segs: chords(P6, 1).concat(chords(P6, 3)) } },
  medians: { name: 'a triangle with its three medians', shape: (() => { const t = polyPts(3, 50, 50, 50); const m = t.map((p, i) => [(t[(i + 1) % 3][0] + t[(i + 2) % 3][0]) / 2, (t[(i + 1) % 3][1] + t[(i + 2) % 3][1]) / 2]); return { segs: closedSegs(t).concat(t.map((p, i) => seg(p, m[i]))) }; })() },
  tetra: { name: 'a triangle with its centre joined to the corners', shape: (() => { const t = polyPts(3, 50, 50, 50); return { segs: closedSegs(t).concat(t.map((p) => seg(p, [50, 50]))) }; })() },
  terrace: { name: 'two houses of Nicholas side by side', shape: { segs: closedSegs([[0, 100], [60, 100], [60, 40], [0, 40]]).concat(closedSegs([[60, 100], [120, 100], [120, 40], [60, 40]]).slice(0, 3), [[0, 100, 60, 40], [60, 100, 0, 40], [60, 100, 120, 40], [120, 100, 60, 40], [0, 40, 30, 5], [30, 5, 60, 40], [60, 40, 90, 5], [90, 5, 120, 40]]) }, cross: false },
  k6: { name: 'a hexagon with every diagonal', shape: { segs: chords(P6, 1).concat(chords(P6, 2), chords(P6, 3)) }, cross: false },
  sqcircx: { name: 'a square in a circle, with both diagonals', shape: { circles: [[50, 50, 50]], segs: closedSegs(polyPts(4, 50, 50, 50, 45)).concat(chords(polyPts(4, 50, 50, 50, 45), 2)) }, cross: false },
  ladder1: { name: 'a ladder with one middle rung', shape: { segs: [[0, 0, 0, 100], [40, 0, 40, 100], [0, 0, 40, 0], [0, 50, 40, 50], [0, 100, 40, 100]] } },
  ladder2: { name: 'a ladder with two middle rungs', shape: { segs: [[0, 0, 0, 100], [40, 0, 40, 100], [0, 0, 40, 0], [0, 33, 40, 33], [0, 67, 40, 67], [0, 100, 40, 100]] } },
  house: { name: 'the house of Nicholas', shape: HOUSE, cross: false },
  pentagram: { name: 'a five-pointed star', shape: { segs: chords(P5, 2) }, cross: false },
  bowtie: { name: 'a bow tie', shape: { segs: closedSegs([[0, 10], [50, 50], [0, 90]]).concat(closedSegs([[100, 10], [50, 50], [100, 90]])) }, cross: false },
  rings2: { name: 'two linked rings', shape: { circles: [[35, 50, 25], [65, 50, 25]] } },
  sqcirc: { name: 'a square in a circle', shape: { circles: [[50, 50, 50]], segs: closedSegs(polyPts(4, 50, 50, 50, 45)) } },
  k5: { name: 'a pentagon with every diagonal', shape: { segs: chords(P5, 1).concat(chords(P5, 2)) }, cross: false },
  flag: { name: 'a flag on a pole', shape: { segs: [[0, 0, 0, 100], [0, 0, 60, 20], [60, 20, 0, 40]] } },
  kite: { name: 'a kite with its cross-sticks', shape: { segs: closedSegs([[50, 0], [85, 35], [50, 100], [15, 35]]).concat([[50, 0, 50, 100], [15, 35, 85, 35]]) } }
};
for (const k in NAMED) {
  const f = build(NAMED[k].shape, { cross: NAMED[k].cross });
  const a = analyse(f);
  NAMED[k].fig = { v: f.v, e: f.e, name: NAMED[k].name };
  if (a.drawable) { NAMED[k].fig.start = a.start; NAMED[k].fig.trail = a.trail; }
  NAMED[k].ok = a.drawable;
  NAMED[k].odd = a.odd;
}

/* ---------- generated figures ---------- */

const SQ_NAMES = ['Parquet', 'Window', 'Trellis', 'Kite Frame', 'Lantern', 'Rug', 'Quilt', 'Mosaic', 'Grille', 'Garden Gate', 'Fretwork', 'Tartan', 'Chequerboard', 'Weave', 'Pavement', 'Stained Glass', 'Crossroads', 'Town Plan', 'Screen', 'Cloister', 'Terrace', 'Knot Garden', 'Tapestry', 'Monogram', 'Hopscotch', 'Lattice Door', 'Tile Border', 'Cross-Stitch', 'Signal Flag', 'Railway Yard', 'Kitchen Floor', 'Chapel Window', 'Iron Railing', 'Tea Chest'];
const TRI_NAMES = ['Honeycomb', 'Pyramid', 'Snowflake', 'Beehive', 'Starburst', 'Prism', 'Tent', 'Trestle', 'Pinwheel', 'Crystal', 'Chevron', 'Arrowhead', 'Pennant', 'Sail', 'Geodesic Dome', 'Tiled Hexagon', 'Rooftops', 'Mountain Range', 'Circus Tent', 'Garden Obelisk'];
const ROMAN = ['', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

function signature(f) {
  const d = GL.degrees(f.v.length, f.e).slice().sort((a, b) => a - b).join('');
  return f.v.length + ':' + f.e.length + ':' + d;
}

function candidates() {
  const out = [];
  const seen = new Set(CLASSICS.map((c) => signature(build(c.shape, { cross: c.cross }))));
  const push = (made, kind) => {
    if (!made || !made.fig || made.fig.e.length > 72 || made.fig.e.length < 5) return;
    // lattice pictures should look designed: keep the symmetric ones
    if ((kind === 'square' || kind === 'tri') && made.sym === 'none') return;
    const a = analyse(made.fig);
    if (!a.drawable) return;
    const sg = signature(made.fig);
    if (seen.has(sg)) return;
    seen.add(sg);
    out.push({ made, a, kind, diff: strokeDiff(a) });
  };
  let rng = C.rng(1736);
  for (let n = 5; n <= 12; n++) {
    for (let t = 0; t < 7; t++) push(GG.star(rng, { n, k: 1 + (t % 3), path: t % 2 === 1 }), 'star');
  }
  rng = C.rng(1737);
  ['chain', 'necklace', 'grid', 'rosette', 'polygon'].forEach((kind) => {
    for (let t = 0; t < 12; t++) push(GG.rings(rng, { kind, path: t % 3 === 2 }), 'rings');
  });
  rng = C.rng(1738);
  for (let t = 0; t < 260; t++) {
    const N = 2 + (t % 4);
    push(GG.lattice(rng, { N, count: 2 + (t % 6), path: t % 3 === 1 }), 'square');
  }
  rng = C.rng(1739);
  for (let t = 0; t < 140; t++) {
    const N = 2 + (t % 4);
    push(GG.lattice(rng, { tri: true, N, count: 2 + (t % 5), path: t % 3 === 1 }), 'tri');
  }
  return out;
}

function pickDrawables() {
  const cand = candidates();
  // quotas per difficulty and kind (the classics add to difficulties 1–4)
  const want = { 1: 14, 2: 20, 3: 22, 4: 20, 5: 16 };
  const share = { star: 0.2, rings: 0.25, square: 0.35, tri: 0.2 };
  const got = [];
  for (let d = 1; d <= 5; d++) {
    const pool = cand.filter((c) => c.diff === d);
    const byKind = {};
    pool.forEach((c) => { (byKind[c.kind] = byKind[c.kind] || []).push(c); });
    const take = [];
    Object.keys(share).forEach((k) => { const n = Math.round(want[d] * share[k]); take.push(...(byKind[k] || []).slice(0, n)); });
    // fill up from whatever is left
    for (const c of pool) { if (take.length >= want[d]) break; if (!take.includes(c)) take.push(c); }
    got.push(...take.slice(0, want[d]));
  }
  return got;
}

const STAR_TEXT = [
  'Join the points of this {name} without lifting the pen or going over a line twice. Lines may cross — turn only at the points.',
  'A {name}. Draw every chord once, in a single stroke; where chords cross you simply carry straight on.',
  'An engraver\'s {name}: the burin may not leave the plate, and no groove may be cut twice.'
];
const RING_TEXT = [
  'A {name}. Trace every arc once without lifting the pen.',
  'Draw the {name} in one unbroken line. You may change from one circle to another only where they meet.',
  'A skater wants to carve this {name} into the ice in one glide, never going over the same curve twice.'
];
const SQ_TEXT = [
  'A pattern from a tiled floor. Trace every line once without lifting the pen — turn wherever lines meet.',
  'A lattice figure. Every line once, one stroke, no jumping.',
  'A snail wants to crawl along every line of this pattern exactly once, in a single outing, leaving its silver trail behind. Show it the way.',
  'A plotter pen must draw this design without lifting. Every line once.'
];
const TRI_TEXT = [
  'A pattern on a triangular grid. Draw every line once in a single stroke.',
  'Triangles and hexagons, one stroke, every line exactly once.',
  'Embroider this design with one long thread: every line stitched once, no cutting the thread.'
];

function main() {
  const puzzles = [];
  CLASSICS.forEach((c) => {
    const f = build(c.shape, { cross: c.cross });
    const a = analyse(f);
    if (!a.drawable) throw new Error(c.id + ' cannot be drawn');
    const p = { id: c.id, title: c.title, diff: c.diff };
    if (c.year) p.year = c.year;
    if (c.source) p.source = c.source;
    p.text = c.text;
    if (c.hints) p.hints = c.hints;
    if (c.explain) p.explain = c.explain;
    p.concepts = c.concepts || ['euler-path'];
    if (c.tags) p.tags = c.tags;
    p.data = { kind: 'stroke', v: f.v, e: f.e, start: a.start, trail: a.trail };
    p._m = f.e.length;
    puzzles.push(p);
  });
  const names = { square: 0, tri: 0 };
  const rng = C.rng(1740);
  const drawn = pickDrawables();

  drawn.forEach((c) => {
    const m = c.made;
    let title;
    if (c.kind === 'square' || c.kind === 'tri') {
      const list = c.kind === 'square' ? SQ_NAMES : TRI_NAMES;
      const i = names[c.kind]++;
      title = 'The ' + list[i % list.length] + (i >= list.length ? ' ' + ['II', 'III', 'IV'][Math.floor(i / list.length) - 1] : '');
    } else title = GG.titleCase(m.name);
    const tpl = rng.pick(c.kind === 'star' ? STAR_TEXT : c.kind === 'rings' ? RING_TEXT : c.kind === 'square' ? SQ_TEXT : TRI_TEXT);
    let text = tpl.replace('{name}', m.name);
    if (c.a.odd === 2) text += ' (Two corners are special. Which?)';
    puzzles.push({
      id: '', title, diff: c.diff, text, concepts: ['euler-path'], tags: [c.kind === 'square' || c.kind === 'tri' ? 'lattice' : c.kind],
      data: { kind: 'stroke', v: m.fig.v, e: m.fig.e, start: c.a.start, trail: c.a.trail }, _m: m.fig.e.length
    });
  });

  // cards: which can be drawn?
  const cards = [];
  const Q = [
    { t: 'The Sealed Envelope', one: 'envelope', d: 1, text: 'Can a sealed envelope — a rectangle with both diagonals — be drawn without lifting the pen or going over a line twice?', hints: ['Count the lines at each corner of the rectangle.'] },
    { t: 'Noughts and Crosses', one: 'noughts', d: 1, text: 'Before the game begins: can the noughts-and-crosses grid itself be drawn in one stroke?' },
    { t: 'The Kite', one: 'kite', d: 1, text: 'A kite with its two cross-sticks. Can it be drawn in one stroke, never going over a line twice?' },
    { t: 'Nicholas\'s Neighbour', one: 'terrace', d: 2, text: 'Next door to the house of Nicholas, his neighbour built an identical house sharing one wall. Can the pair still be drawn in one stroke?', hints: ['Count the lines at the foot and at the top of the shared wall.'] },
    { t: 'The Ladder', one: 'ladder2', d: 2, text: 'A ladder with a rung at the top, one at the bottom and two in between. One stroke?' },
    { t: 'Pen Test', figs: ['house', 'envelope', 'grid12', 'noughts'], d: 1, text: 'Which of these can be drawn without lifting the pen and without going over any line twice?' },
    { t: 'The Sign-Painter', figs: ['pentagram', 'grid2', 'bowtie'], d: 1, text: 'A sign-painter only takes a job if the design can be painted in one continuous stroke of the brush. Which of these will she accept?' },
    { t: 'Doodles on a Napkin', figs: ['cube', 'rings2', 'flag', 'medians'], d: 2, text: 'Four doodles on a café napkin. Which can be drawn in one stroke?' },
    { t: 'Stars and Grids', figs: ['k5', 'k6', 'grid3'], d: 2, text: 'Which of these can be drawn in one stroke?' },
    { t: 'Two Squares and a Circle', figs: ['sqcirc', 'sqcircx', 'ladder1', 'tetra'], d: 2, text: 'A laser engraver cannot switch off in the middle of a job, nor burn a line twice. Which of these designs can it engrave?' },
    { t: 'Odd Ones Out', figs: ['hexdiam', 'terrace', 'kite'], d: 2, text: 'Which of these can be drawn in one stroke? (Perhaps none — perhaps all.)' }
  ];
  Q.forEach((q) => {
    const keys = q.one ? [q.one] : q.figs;
    const figs = keys.map((k) => NAMED[k].fig);
    const answer = keys.map((k, i) => (NAMED[k].ok ? i : -1)).filter((i) => i >= 0);
    const p = { id: '', title: q.t, diff: q.d, text: q.text, concepts: ['euler-path', 'parity'], tags: ['which'], data: { kind: 'strokeq', figs, answer } };
    if (q.hints) p.hints = q.hints;
    cards.push(p);
  });
  // cards made of generated figures: some drawable, some not
  const rq = C.rng(1741);
  const CARD_T = ['Four Doodles', 'Tracing Paper', 'The Draughtsman\'s Test', 'Corners Count', 'Wheels and Webs', 'Tiles to Trace', 'A Sheet of Sketches', 'Lift or Not', 'The Embroiderer\'s Choice'];
  const CARD_X = [
    'Which of these can be drawn in one stroke?',
    'An embroiderer will only stitch designs she can sew with one unbroken thread, never stitching a line twice. Which of these can she do?',
    'A snail leaves a silver trail wherever it crawls, and it will not crawl along its own trail a second time. Which of these patterns could one snail have made in a single outing?',
    'Which of these figures can be drawn without lifting the pen or going over a line twice?'
  ];
  for (let i = 0; i < CARD_T.length; i++) {
    const nf = 3 + (i % 2);
    const figs = [], answer = [];
    const want = 1 + rq.int(nf - 1);
    let guard = 0;
    while (figs.length < nf && guard++ < 400) {
      const good = answer.length < want && (rq() < 0.5 || nf - figs.length <= want - answer.length);
      const tri = rq() < 0.35;
      const made = GG.lattice(rq, { tri, N: 2 + rq.int(2), count: 2 + rq.int(3), paths: good ? rq.int(2) : 1 + rq.int(3) });
      if (!made || !made.fig || made.fig.e.length > 28 || made.fig.e.length < 6) continue;
      const a = analyse(made.fig);
      if (!a.conn) continue;
      if (good !== a.drawable) continue;
      if (!good && a.odd < 4) continue;
      const f = { v: made.fig.v, e: made.fig.e };
      if (a.drawable) { f.start = a.start; f.trail = a.trail; answer.push(figs.length); }
      figs.push(f);
    }
    cards.push({ id: '', title: CARD_T[i], diff: i < 3 ? 2 : 3, text: rq.pick(CARD_X), concepts: ['euler-path', 'parity'], tags: ['which'], data: { kind: 'strokeq', figs, answer } });
  }

  // order: easiest first; a card after every few drawings of the same level
  const all = [];
  for (let d = 1; d <= 5; d++) {
    const dr = puzzles.filter((p) => p.diff === d).sort((a, b) => (a.id ? 0 : 1) - (b.id ? 0 : 1) || a._m - b._m);
    const cq = cards.filter((p) => p.diff === d);
    const step = cq.length ? Math.max(2, Math.floor(dr.length / (cq.length + 1))) : 0;
    let k = 0;
    dr.forEach((p, i) => { all.push(p); if (step && (i + 1) % step === 0 && k < cq.length) all.push(cq[k++]); });
    while (k < cq.length) all.push(cq[k++]);
  }
  let n = 0, nq = 0;
  const usedTitles = new Set();
  all.forEach((p) => {
    let t = p.title, k = 1;
    while (usedTitles.has(t)) t = p.title + ' ' + ROMAN[k++];
    usedTitles.add(t);
    p.title = t;
  });
  all.forEach((p) => {
    delete p._m;
    if (!p.id) p.id = p.data.kind === 'strokeq' ? 'stroke-q' + String(++nq).padStart(2, '0') : 'stroke-' + String(++n).padStart(3, '0');
    const r = eng.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
  });
  const meta = {
    id: 'one-stroke', engine: 'graphs', cat: 'routes', name: 'One stroke', order: 2,
    blurb: 'Draw every figure without lifting the pen or going over a line twice — or decide that it cannot be done.',
    origin: { year: 1736, who: 'Leonhard Euler', note: 'Children have always drawn figures in one stroke; Euler\'s 1736 paper on the bridges of Königsberg gave the rule that decides every case: count the corners where an odd number of lines meet.' },
    concepts: ['graph', 'euler-path', 'parity']
  };
  write('one-stroke', meta, all);
  const cnt = {};
  all.forEach((p) => { cnt[p.diff] = (cnt[p.diff] || 0) + 1; });
  console.log('one-stroke: ' + all.length + ' puzzles', JSON.stringify(cnt), cards.length + ' cards');
}

function write(fid, meta, list) {
  const lines = list.map((p) => '  ' + JSON.stringify(p));
  const out = '/* The Puzzle Cabinet · data/' + fid + '.js — made by tools/gen/one-stroke.js */\nCabinet.family(' + JSON.stringify(meta, null, 2) + ', [\n' + lines.join(',\n') + '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data', fid + '.js'), out);
  console.log('wrote data/' + fid + '.js (' + Math.round(out.length / 1024) + ' KB)');
}

main();
