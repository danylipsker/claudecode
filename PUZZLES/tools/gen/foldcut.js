/* The Puzzle Cabinet · tools/gen/foldcut.js
 *
 *   node tools/gen/foldcut.js            writes data/fold-and-cut.js
 *   node tools/gen/foldcut.js --preview  also writes a picture sheet (tools/gen/foldcut-preview.html is NOT kept: pass a path)
 *
 * The classic figures are folded here by hand (lines through the centre of
 * the sheet at the angles the figure needs); the rest are found by folding a
 * square at random 1–4 times along lines a player can find with the snapping
 * fold tool, then cutting along a line through two snap points, and keeping
 * the shapes that are neither tiny, nor thin, nor ones a straight cut of the
 * flat sheet would give. Every target is exactly what its stored folds and
 * cut make with js/paper.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/foldcut.js'));
const G = C.geom, F = C.foldcut, M = G.M;

const S = [10, 10], O = [5, 5];
const rad = (d) => d * Math.PI / 180;
const ray = (deg, r, o) => [(o || O)[0] + Math.cos(rad(deg)) * r, (o || O)[1] + Math.sin(rad(deg)) * r];
const r5 = F.r5;

/* ---------- building blocks ---------- */

// a fold along the line through P at deg (screen degrees, y down), moving the part that holds Q
function foldAt(P, deg, Q) {
  const d = [Math.cos(rad(deg)), Math.sin(rad(deg))];
  const a = G.add(P, G.mul(d, -12)), b = G.add(P, G.mul(d, 12));
  return [a[0], a[1], b[0], b[1], G.side(Q, a, b) > 0 ? 1 : -1];
}
function foldThrough(P, Q, R) { // the line P-Q, moving the part holding R
  const d = G.norm(G.sub(Q, P));
  const a = G.add(P, G.mul(d, -12)), b = G.add(P, G.mul(d, 12));
  return [a[0], a[1], b[0], b[1], G.side(R, a, b) > 0 ? 1 : -1];
}
function foldOnto(P, Q) { // bring P onto Q
  const m = G.mid(P, Q), d = G.perp(G.norm(G.sub(Q, P)));
  const a = G.add(m, G.mul(d, -12)), b = G.add(m, G.mul(d, 12));
  return [a[0], a[1], b[0], b[1], G.side(P, a, b) > 0 ? 1 : -1];
}
function cutThrough(P, Q) { return [P[0], P[1], Q[0], Q[1]]; }

/* ---------- the classics ---------- */

const HALF_V = foldAt(O, 90, [2, 5]);    // the left half onto the right
const HALF_H = foldAt(O, 0, [5, 2]);     // the top half onto the bottom
// after HALF_H then HALF_V the packet is the quarter [5,10]², with the centre at its corner
const QUARTERS = [HALF_H, foldAt(O, 90, [2, 7])];
const DIAG = foldAt(O, 45, [6, 8]);      // the quarter along its diagonal, keeping the wedge between 0° and 45°
// five-fold: after HALF_V the paper is the half-disc of angles [-90, 90] about O
function fiveFold() {
  const a = -90;
  return [HALF_V, foldAt(O, a + 72, ray(a + 30, 2)), foldAt(O, a + 144, ray(a + 160, 2)), foldAt(O, a + 108, ray(a + 90, 2))];
}
function sixFold() {
  const a = -90;
  return [HALF_V, foldAt(O, a + 60, ray(a + 30, 2)), foldAt(O, a + 120, ray(a + 150, 2)), foldAt(O, a + 90, ray(a + 75, 2))];
}
function eightFold() { return QUARTERS.concat([DIAG, foldAt(O, 22.5, ray(35, 2))]); }

const R5 = 4.4;
const STAR5_r = R5 * Math.cos(rad(72)) / Math.cos(rad(36));
const classics = [];
function classic(o) { classics.push(o); }

classic({
  slug: 'tent', title: 'The Tent', diff: 1,
  text: 'Fold the square in half, make one straight cut, and open it: out comes a tall triangle, as even as a tent. Where must the cut go?',
  hints: ['A shape with a mirror line down its middle: fold along that line first.', 'With the paper folded in half, the fold is the middle of the tent. Cut from a point on the fold down to the bottom edge.'],
  explain: 'Folding in half lays the left half of the triangle on the right half, so one cut makes both slanting sides at once. That is the whole idea of fold and cut: **each fold is a mirror**, and a cut through the folded layers appears once in every layer, reflected.',
  folds: [HALF_V], cut: cutThrough([5, 2.5], [7.5, 10]), keep: [5.3, 8],
  tags: ['classic', 'triangle'], concepts: ['symmetry']
});
classic({
  slug: 'diamond', title: 'A Diamond from the Middle', diff: 1,
  text: 'Cut a diamond out of the very middle of the square — with one straight cut. (You may fold first, of course.)',
  hints: ['The diamond has two mirror lines, across and down. Fold along both.', 'Folded in quarters, the middle of the sheet is one corner of the little square. Snip that corner off.'],
  explain: 'Two folds make four layers, all meeting at the centre of the sheet. Cutting off that corner cuts a small triangle from each layer; opened, the four triangles make the diamond.',
  folds: QUARTERS, cut: cutThrough([7.5, 5], [5, 7.5]), keep: [5.2, 5.1],
  tags: ['classic', 'diamond'], concepts: ['symmetry']
});
classic({
  slug: 'square-hole', title: 'The Square Window', diff: 2,
  text: 'Cut a square hole in the middle of the sheet, its sides parallel to the edges, with one straight cut. The picture shows the sheet with its window.',
  hints: ['A diamond hole is easy (fold in quarters, snip the corner). A square one needs the sides of the hole to line up — which one more fold does.', 'Fold in quarters, then fold along the diagonal through the centre corner. Now one side of the hole is a single short line across the folded paper.'],
  explain: 'The square hole has four mirror lines: across, down and both diagonals. Folding along all of them (quarters, then a diagonal) leaves eight layers in a thin triangle, and in each layer the edge of the hole is the same short line. One cut along it, and the window opens.',
  folds: QUARTERS.concat([DIAG]), cut: cutThrough([7.5, 5], [7.5, 10]), keep: [9.5, 9.8],
  tags: ['classic', 'hole', 'square'], concepts: ['symmetry']
});
classic({
  slug: 'four-star', title: 'The Compass Star', diff: 2,
  text: 'A star with four points, pointing north, south, east and west, like the star on an old map. One cut.',
  hints: ['The star has four mirror lines. Fold along all of them.', 'Folded in quarters and then along the diagonal, the paper is a thin triangle with the centre at its point. Cut from a point on one edge to a point on the other.'],
  explain: 'The star\'s eight edges are all copies of one edge, mirrored in the star\'s four mirror lines. Fold along those lines and the eight copies lie on top of each other: one cut makes them all.',
  folds: QUARTERS.concat([DIAG]), cut: cutThrough([8.75, 5], [6.25, 6.25]), keep: [5.2, 5.1],
  tags: ['classic', 'star'], concepts: ['symmetry']
});
classic({
  slug: 'octagon', title: 'The Stop Sign', diff: 2,
  text: 'A regular octagon, standing on one corner, cut from the middle of the square with a single straight cut.',
  hints: ['An octagon standing on a corner has corners along both midlines and both diagonals — the same lines as the compass star.', 'Fold in quarters, then along the diagonal. Now cut straight across the thin triangle, from one edge to the other, the same distance from the point on both.'],
  explain: 'The eight edges of the octagon are copies of one edge, reflected in its four mirror lines. After the three folds that bring those lines together, one straight cut across the folded triangle is all eight edges.',
  folds: QUARTERS.concat([DIAG]), cut: cutThrough([8.75, 5], ray(45, 3.75)), keep: [5.2, 5.1],
  tags: ['classic', 'octagon'], concepts: ['symmetry']
});
classic({
  slug: 'star-5', title: 'Betsy Ross\'s Star', diff: 3,
  source: 'An American legend; the fold is described in Harry Houdini\'s *Paper Magic* (1922).',
  text: 'The story goes that in 1776, when the committee for the new American flag wanted six-pointed stars, the seamstress Betsy Ross folded a sheet of paper and, with one snip of her scissors, produced a perfect five-pointed star — and the stars on the flag had five points from then on.\n\nThe story was first told in public by her grandson almost a hundred years later, and historians treat it as legend. The trick, though, is real. Cut this star out of the square with one straight cut.',
  hints: ['A five-pointed star has five mirror lines, 36° apart. First fold the square in half along the one that runs straight up and down.', 'Now the paper is a half-disc around the centre. Fold it like a fan into five equal 36° wedges: crease through the centre at 72°, 144° and 108° from the top edge.', 'In the final thin wedge, cut from a point far out on one edge (a tip of the star) to a point close in on the other (the notch between two tips).'],
  explain: 'The star\'s ten edges are copies of one edge, reflected in its five mirror lines. Folding the paper in half and then zig-zag into five 36° wedges stacks ten layers, and in every layer the star\'s edge is the same line. Houdini printed the method in *Paper Magic* (1922); for a regular star the notch lies at 0.382 of the distance to the tip — a number related to the golden ratio.',
  folds: fiveFold(), cut: cutThrough(ray(-90 + 144, R5), ray(-90 + 108, STAR5_r)), keep: [5.1, 5.2],
  tags: ['classic', 'star', 'golden ratio'], concepts: ['symmetry'], links: ['fold-cut-pentagon', 'fold-cut-star-6']
});
classic({
  slug: 'pentagon', title: 'The Pentagon', diff: 3,
  text: 'A regular pentagon, point upwards. It needs the same folds as the five-pointed star — only the cut is different.',
  hints: ['Fold as for the five-pointed star: in half, then into five 36° wedges.', 'A pentagon\'s corner is a star\'s tip; the middle of its edge is where the star had a notch, but much farther out: at 0.81 of the corner\'s distance. Cut straight across the wedge, square to its edge.'],
  explain: 'The pentagon has the same five mirror lines as the star, so the same folds stack its ten half-edges. The cut runs from a corner to the middle of the next edge, and meets that edge\'s mirror line at a right angle.',
  folds: fiveFold(), cut: cutThrough(ray(-90 + 144, R5), ray(-90 + 108, R5 * Math.cos(rad(36)))), keep: [5.1, 5.2],
  tags: ['classic', 'pentagon'], concepts: ['symmetry'], links: ['fold-cut-star-5']
});
classic({
  slug: 'hexagon', title: 'The Honeycomb Cell', diff: 3,
  text: 'A regular hexagon with a point at the top, like a cell of a honeycomb stood on end. One cut.',
  hints: ['Fold the square in half down the middle; the centre of the sheet is now in the middle of the folded edge.', 'Fold the half-disc around the centre into three equal 60° wedges, like a letter in thirds. Then cut straight across.'],
  explain: 'A hexagon standing on a point has six mirror lines, but three folds are enough here: in half, then in thirds. The six edges of the hexagon are then one line across the folded 60° wedge.',
  folds: [HALF_V, foldAt(O, -30, ray(-60, 2)), foldAt(O, 30, ray(60, 2))], cut: cutThrough(ray(-30, 4.2), ray(30, 4.2)), keep: [5.1, 5.2],
  tags: ['classic', 'hexagon'], concepts: ['symmetry'], links: ['fold-cut-star-6']
});
classic({
  slug: 'star-6', title: 'The Six-Pointed Star', diff: 4,
  text: 'Two triangles woven into a six-pointed star. The flag committee in the story above wanted this one; cut it with a single stroke anyway.',
  hints: ['Six-fold symmetry: fold in half, then in thirds (60° wedges) as for the hexagon.', 'One more fold: halve the 60° wedge to 30°. Then cut from far out on one edge (a tip) to close in on the other (a notch).', 'For a star of two equilateral triangles the notch is at 1/√3 ≈ 0.58 of the tip\'s distance.'],
  explain: 'A six-pointed star has six mirror lines, 30° apart. In half, in thirds and in half again stacks twelve 30° wedges, and the star\'s twelve edges become one line in the folded paper.',
  folds: sixFold(), cut: cutThrough(ray(30, 4.3), ray(0, 4.3 / Math.sqrt(3))), keep: [5.1, 5.2],
  tags: ['classic', 'star', 'hexagram'], concepts: ['symmetry'], links: ['fold-cut-star-5', 'fold-cut-hexagon']
});
classic({
  slug: 'square-frame', title: 'The Picture Frame', diff: 3,
  text: 'A square frame: the middle falls out and so does the border, and what is left is a square ring. One straight cut.',
  hints: ['Start as for the square window: quarters, then the diagonal.', 'Now the inner and the outer edge of the frame are two parallel lines across the folded triangle. Fold one onto the other.', 'Bring the outer edge onto the inner edge — the crease runs halfway between them — and cut along the inner edge.'],
  explain: 'Two parallel edges can be cut at once if a fold halfway between them lays one on the other. After the eight-layer triangle of the square window, one more fold does exactly that, and one cut frees both the middle and the border.',
  folds: QUARTERS.concat([DIAG, foldAt([7.5, 5], 90, [9.5, 6])]), cut: cutThrough([6.25, 5], [6.25, 10]), keep: [7.0, 5.3],
  tags: ['classic', 'frame', 'hole'], concepts: ['symmetry'], links: ['fold-cut-square-hole', 'fold-cut-diamond-frame', 'fold-cut-frame-two-cuts']
});
classic({
  slug: 'frame-two-cuts', title: 'A Frame in Two Snips', diff: 2,
  text: 'This time you may cut **twice** (both cuts before you unfold). Make a square frame: the middle falls out, and so does a border all round.',
  hints: ['Fold in quarters, then along the diagonal through the centre corner: the inner and the outer edge of the frame are now two short parallel lines.', 'Cut along both lines, then unfold (U).'],
  explain: 'With two cuts allowed, the eight-layer triangle of the square window is enough: one cut for the inside edge of the frame, one for the outside. The puzzle called [[fold-cut-square-frame]] does it with a single cut — at the price of one more fold.',
  folds: QUARTERS.concat([DIAG]), cut: [cutThrough([6.25, 5], [6.25, 10]), cutThrough([8.75, 5], [8.75, 10])], keep: [7.5, 5.3],
  tags: ['classic', 'frame', 'hole', 'two cuts'], concepts: ['symmetry'], links: ['fold-cut-square-frame']
});
classic({
  slug: 'diamond-frame', title: 'The Diamond Frame', diff: 3,
  text: 'A diamond-shaped ring standing on its point. The middle and the corners of the sheet fall away; one cut.',
  hints: ['Its mirror lines are the same four as the square frame\'s: fold in quarters and along the diagonal.', 'The two edges of the frame now cross the thin triangle square to its long edge. Lay one on the other with a fold halfway between.'],
  explain: 'As with the square frame: three folds stack the eight copies of each edge of the ring, a fourth lays the outer edge on the inner one, and one cut does the rest.',
  folds: QUARTERS.concat([DIAG, foldOnto(ray(45, 3.4), ray(45, 1.6))]), cut: cutThrough(ray(0, 1.6 * Math.SQRT2), ray(45, 1.6)), keep: ray(20, 2.8),
  tags: ['classic', 'frame', 'hole', 'diamond'], concepts: ['symmetry'], links: ['fold-cut-square-frame']
});
classic({
  slug: 'eight-star', title: 'The Eight-Pointed Star', diff: 3,
  text: 'An eight-pointed star, points along the edges and the diagonals of the sheet.',
  hints: ['Eight points, eight mirror lines… well, four mirror lines through each pair of opposite points and four more between them: 22.5° apart.', 'Quarters, the diagonal, then halve the thin triangle once more. Cut from a tip to a notch.'],
  explain: 'Four folds stack sixteen 22.5° wedges. The star\'s sixteen edges are copies of one, so the cut from a tip on one edge of the wedge to a notch on the other makes them all.',
  folds: eightFold(), cut: cutThrough(ray(0, 4.5), ray(22.5, 2.0)), keep: [5.1, 5.05],
  tags: ['classic', 'star'], concepts: ['symmetry'], links: ['fold-cut-four-star']
});
classic({
  slug: 'cross', title: 'The Red Cross', diff: 4,
  text: 'A cross with four equal arms. Its outline has twelve edges and turns eight corners outward and four inward — and still one straight cut will do.',
  hints: ['The cross has the four mirror lines of a square: fold in quarters and along the diagonal. Look at what is left of the outline: two edges meeting at a corner.', 'To lay two edges that meet at a corner on one line, fold along the line that splits the corner\'s angle in half.', 'The corner at the end of an arm is a right angle; its half-way line runs at 45°. Fold there, then cut along the side of the arm.'],
  explain: 'After the three folds of the square, one arm-end and one arm-side remain, meeting at a right angle. A fold along the bisector of that angle lays the arm-end on the line of the arm-side — the same trick that Demaine, Demaine and Lubiw use for every corner of every shape.',
  folds: QUARTERS.concat([DIAG, foldAt([8.75, 6.25], 45, [9.6, 5.2])]), cut: cutThrough([5, 6.25], [10, 6.25]), keep: [5.3, 5.1],
  color: '#d9483b', tags: ['classic', 'cross'], concepts: ['symmetry']
});
classic({
  slug: 'house', title: 'The House', diff: 4,
  text: 'A little house with a pitched roof: a square body and a triangle on top. It has only one mirror line — so after the first fold, the corners have to be dealt with one by one.',
  hints: ['Fold in half down the middle of the house first.', 'Half a house has three edges: the ground, the wall and the roof. Lay the wall on the ground by folding along the line that halves the corner between them.', 'Now the roof meets the ground line at a corner: halve that corner too, and cut along the ground.'],
  explain: 'For shapes without enough symmetry the recipe is the one from the proof of the fold-and-cut theorem: fold along the lines that halve the corners (the "straight skeleton"), and the edges come to lie on one line. Here two such folds follow the first, mirror, fold.',
  folds: null, cut: null, keep: [5, 5],
  tags: ['classic', 'house'], concepts: ['symmetry']
});

/* The house, built by halving corners on the folded paper:
 * body 6 wide from y = 4.4 to 8.6, roof apex at y = 1.4 (45° slopes). */
(function () {
  const eaveY = 4.4, groundY = 8.6, half = 3;
  const apex = [5, eaveY - half];
  const f1 = HALF_V;                                   // left half onto the right
  // corner at the ground (8, 8.6): wall up, ground to the left; halve it
  const g = [5 + half, groundY];
  const f2 = foldAt(g, -135, [9, 6]);                  // the line through g at 45° (up-left); the wall side moves
  // the wall now lies along the ground line; the roof edge (from the eave) has turned too.
  // find where the roof's image meets the ground line and halve that corner
  const pp = F.build(S, [f1, f2], []).pp;
  const eave = [5 + half, eaveY];
  const land = F.landMap(pp, [eave, apex]);
  const e2 = land[0], a2 = land[1];
  const ground = [[5, groundY], [10, groundY]];
  const hit = G.lineCross(e2, a2, ground[0], ground[1]);
  const u1 = G.norm(G.sub(a2, hit)), u2 = G.norm(G.sub([5, groundY], hit));
  const bis = G.norm(G.add(u1, u2));
  const deg = Math.atan2(bis[1], bis[0]) * 180 / Math.PI;
  const f3 = foldAt(hit, deg, G.add(hit, G.mul(u1, 1.5)));
  const h = classics.find((x) => x.slug === 'house');
  h.folds = [f1, f2, f3];
  h.cut = cutThrough([0, groundY], [10, groundY]);
  h.keep = [5.2, 6];
})();

/* ---------- the random shapes (made by the engine's own generator) ---------- */

// a key that is the same for a shape and its turned or mirrored copies
function shapeKey(loops) {
  let best = null;
  F.symmetries(S).forEach((m) => {
    const moved = loops.map((l) => l.map((q) => M.apply(m, q)));
    const k = Array.prototype.join.call(F.targetMaskOf(moved, S, 20), '');
    if (best == null || k < best) best = k;
  });
  return best;
}
function roman(n) { return ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n] || String(n); }

function main() {
  const out = [];
  const seen = new Set();
  const titles = new Set();
  const report = [];

  classics.forEach((c) => {
    const r = F.makeData(S, c.folds, c.cut, c.keep);
    if (!r) throw new Error('classic ' + c.slug + ' does not build');
    seen.add(shapeKey(r.loops));
    titles.add(c.title);
    const p = {
      id: 'fold-cut-' + c.slug, title: c.title, diff: c.diff,
      text: c.text, hints: c.hints, explain: c.explain + ' (Unfolded, ' + (Array.isArray(c.cut[0]) ? 'the two cuts show' : 'the one cut shows') + ' as ' + r.snips + ' straight edges.)',
      concepts: c.concepts, tags: c.tags, data: r.data, classic: true
    };
    if (c.source) p.source = c.source;
    if (c.year) p.year = c.year;
    if (c.links) p.links = c.links;
    if (c.color) p.data.color = c.color;
    out.push(p);
    report.push({ id: p.id, loops: r.loops, folds: r.data.sol.length, title: p.title, diff: p.diff });
  });

  const rng = C.rng(20260930);
  const want = { 1: 12, 2: 32, 3: 40, 4: 34, 5: 20 };
  const got = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const gen = [];
  const names = {};
  let tries = 0;
  while (tries++ < 40000 && Object.keys(want).some((k) => got[k] < want[k])) {
    // lean towards the levels still short
    const short = Object.keys(want).filter((k) => got[k] < want[k]).map(Number);
    const lv = rng.pick(short);
    const c = F.candidate(rng, S, rng.pick(F.FOLDS_FOR[lv]));
    if (!c) continue;
    const diff = F.grade(c);
    if (got[diff] >= want[diff]) continue;
    const key = shapeKey(c.md.loops);
    if (seen.has(key)) continue;
    const nm = F.shapeName(c.md.loops);
    if ((names[nm] || 0) >= 3) continue;
    names[nm] = (names[nm] || 0) + 1;
    seen.add(key);
    got[diff]++;
    gen.push({ c, diff });
  }

  // easiest first; within a level, fewer corners first
  gen.sort((a, b) => a.diff - b.diff || a.c.ft.verts - b.c.ft.verts || a.c.nf - b.c.nf);
  gen.forEach((g, i) => {
    const ds = F.describe(g.c, S);
    let title = 'The ' + ds.name;
    if (titles.has(title)) {
      const box = G.bbox(g.c.md.loops);
      const cands = [];
      if (box.h > box.w * 1.6) cands.push('Tall');
      if (box.w > box.h * 1.6) cands.push('Wide');
      if (g.c.ft.area < 16) cands.push('Tiny');
      if (g.c.ft.area > 45) cands.push('Great');
      if (!g.c.sy.any) cands.push('Lopsided');
      cands.push(...F.ADJ.slice((i * 7) % F.ADJ.length), ...F.ADJ);
      title = null;
      for (const a of cands) { const t = 'The ' + a + ' ' + ds.name; if (!titles.has(t)) { title = t; break; } }
      if (!title) { let n = 2; while (titles.has('The ' + ds.name + ' ' + roman(n))) n++; title = 'The ' + ds.name + ' ' + roman(n); }
    }
    titles.add(title);
    const id = 'fold-cut-' + String(i + 1).padStart(3, '0');
    out.push({
      id, title, diff: g.diff, text: ds.text, hints: ds.hints, explain: ds.explain,
      concepts: ['folding', 'symmetry'], tags: ['generated'].concat(ds.holes ? ['hole'] : []).concat(g.c.odd ? ['angle fold'] : []),
      data: g.c.md.data
    });
    report.push({ id, loops: g.c.md.loops, folds: g.c.nf, title, diff: g.diff });
  });

  // easiest first; the classics sit at the front of their level
  out.sort((a, b) => a.diff - b.diff || (b.classic ? 1 : 0) - (a.classic ? 1 : 0));
  out.forEach((p, i) => { p.data.color = p.data.color || F.COLORS[i % F.COLORS.length]; });

  write(out);
  const pv = process.argv.indexOf('--preview');
  if (pv >= 0 && process.argv[pv + 1]) preview(report, process.argv[pv + 1]);
  console.log('fold-and-cut: ' + out.length + ' puzzles (' + classics.length + ' classics); by difficulty ' + JSON.stringify(out.reduce((a, p) => { a[p.diff] = (a[p.diff] || 0) + 1; return a; }, {})) + ' after ' + tries + ' tries');
}

function write(list) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/fold-and-cut.js — made by tools/gen/foldcut.js */');
  lines.push('Cabinet.family({');
  lines.push("  id: 'fold-and-cut', engine: 'foldcut', cat: 'paper', name: 'Fold and cut', order: 1,");
  lines.push("  blurb: 'Fold a square of paper flat, make one straight cut, unfold: stars, crosses, frames and stranger things fall out.',");
  lines.push("  origin: { year: 1721, who: 'Japanese puzzle books, Houdini, Martin Gardner', note: " + JSON.stringify('The oldest known fold-and-cut puzzle is in the Japanese book *Wakoku Chiyekurabe* (1721). Harry Houdini\'s *Paper Magic* (1922) shows how to fold a five-pointed star for a single cut. Martin Gardner asked in his *Scientific American* column in 1960 which shapes one straight cut can make; in 1998 Erik Demaine, Martin Demaine and Anna Lubiw proved the answer: every figure drawn with straight lines — any polygon, several at once, with holes — can be cut out of a sheet folded flat with one complete straight cut. Marshall Bern, Erik Demaine, David Eppstein and Barry Hayes gave a second method the same year.') + ' },');
  lines.push("  concepts: ['folding', 'symmetry']");
  lines.push('}, [');
  list.forEach((p) => {
    const q = Object.assign({}, p);
    delete q.classic;
    const parts = [];
    parts.push('id: ' + JSON.stringify(q.id) + ', title: ' + JSON.stringify(q.title) + ', diff: ' + q.diff + (q.year != null ? ', year: ' + q.year : ''));
    if (q.source) parts.push('source: ' + JSON.stringify(q.source));
    parts.push('text: ' + JSON.stringify(q.text));
    if (q.hints && q.hints.length) parts.push('hints: ' + JSON.stringify(q.hints));
    if (q.explain) parts.push('explain: ' + JSON.stringify(q.explain));
    if (q.links) parts.push('links: ' + JSON.stringify(q.links));
    parts.push('concepts: ' + JSON.stringify(q.concepts) + ', tags: ' + JSON.stringify(q.tags));
    parts.push('data: ' + JSON.stringify(q.data));
    lines.push('  { ' + parts.join(',\n    ') + ' },');
  });
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, 'data/fold-and-cut.js'), lines.join('\n') + '\n');
}

function preview(report, file) {
  let h = '<!doctype html><meta charset="utf-8"><title>fold-and-cut preview</title><style>body{font:12px system-ui;background:#223;color:#dde;display:flex;flex-wrap:wrap;gap:8px}div{width:150px}svg{width:150px;height:150px;background:#fff}</style>';
  report.forEach((r) => {
    h += '<div><svg viewBox="-0.5 -0.5 11 11"><rect width="10" height="10" fill="none" stroke="#999" stroke-width=".05"/><path fill-rule="evenodd" fill="#d9483b" stroke="#000" stroke-width=".04" d="' + r.loops.map((l) => C.pathOf(l)).join('') + '"/></svg><br>' + r.id + ' d' + (r.diff || '') + ' f' + r.folds + '<br>' + r.title + '</div>';
  });
  fs.writeFileSync(file, h);
}

main();
