/* The Puzzle Cabinet · tools/gen/matchsticks.js
 *
 *   node tools/gen/matchsticks.js        writes data/matchstick-classics.js and data/matchstick-shapes.js
 *
 * Classics: each figure and goal below is solved by search (engines/matchsticks.js);
 * the generator checks that the goal cannot be reached with fewer matches and
 * stores one solution (the one that keeps the table smallest).
 *
 * Squares and triangles: every figure of the engine's list (and a few random
 * ones, seeded) with every rule (take away, move, add k) and every count that
 * works, graded by the engine's own measure; a spread of them is kept, easiest
 * first. The Endless drawer uses the same code (engine.generate).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/matches.js'));
require(path.join(ROOT, 'engines/matchsticks.js'));
const MS = C.matchsticks;
const ENG = C.engines.matchsticks;
const R3 = MS.R3;
const r3 = (v) => Math.round(v * 1000) / 1000;

/* ---------- figures of the classics ---------- */

const { gridSegs, cellSegs, triSegs, bigTriangle, HEX } = MS;
function spiral(lens) {
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  let p = [0, 0];
  const out = [];
  lens.forEach((L, i) => {
    const d = dirs[i % 4];
    for (let k = 0; k < L; k++) { const q = [p[0] + d[0], p[1] + d[1]]; out.push([p[0], p[1], q[0], q[1]]); p = q; }
  });
  return out;
}
const mirTri = (s) => [-s[0] - s[1], s[1], -s[2] - s[3], s[3]];     // x -> -x on the 'tri' lattice
const mirTrv = (s) => [s[0] + s[1], -s[1], s[2] + s[3], -s[3]];     // x -> -x on the 'trv' lattice
const mirX = (s) => [-s[0], s[1], -s[2], s[3]];

const KEY = [[0, 0, 1, 0], [1, 0, 2, 0], [0, 2, 1, 2], [1, 2, 2, 2], [0, 0, 0, 1], [0, 1, 0, 2], [2, 0, 2, 1], [2, 1, 2, 2],
  [2, 1, 3, 1], [3, 1, 4, 1], [4, 1, 5, 1], [4, 1, 4, 2], [5, 1, 5, 2]];
const AXE = cellSegs([[0, 0], [0, 1]]).concat([[1, 1, 2, 1], [2, 1, 3, 1], [3, 1, 4, 1]]);
const FISH_BODY = [[0, 0, -1, 1], [-1, 1, -1, 2], [-1, 2, 0, 1], [0, 1, 0, 0]];
const FISH_TAIL = [[-1, 2, -2, 3], [-1, 2, -1, 3], [-2, 3, -1, 3]];
const FISH7 = FISH_BODY.concat(FISH_TAIL);
const FISH8 = FISH_BODY.concat([[-1, 1, 0, 1]], FISH_TAIL);
const GLASS = [[-0.5, -1, -0.5, 0], [0.5, -1, 0.5, 0], [-0.5, 0, 0.5, 0], [0, 0, 0, 1]];
const H = r3(-R3);
const HOUSE = [[0, 0, 1, 0], [0, 1, 1, 1], [0, 0, 0, 1], [1, 0, 1, 1], [0, 0, 0.5, H], [0.5, H, 1, 0], [1, 0, 2, 0], [1, 1, 2, 1], [2, 0, 2, 1], [0.5, H, 1.5, H], [1.5, H, 2, 0]];
const HOUSE_POLE = HOUSE.concat([[0.5, H, 0.5, r3(H - 1)]]);
const ARROW = [[0, 0, 1, 0], [1, 0, 2, 0], [2, 0, 3, 0], [3, 0, 3, -1], [3, 0, 2, 1], [0, 0, 0, -1], [0, 0, -1, 1]];
const SPIRAL = spiral([1, 1, 2, 2, 3, 3, 4, 4, 4]);
const CROSS = cellSegs([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);

const TRAD = 'A traditional matchstick puzzle.';
const sq = (n, extra) => Object.assign({ squares: n, noLoose: n > 0 }, extra || {});
const tr = (n, extra) => Object.assign({ triangles: n, noLoose: n > 0 }, extra || {});

/* ---------- the classics ---------- */

const CLASSICS = [
  {
    id: 'match-picture-frame', title: 'The Picture Frame', diff: 1, fig: 'window', segs: gridSegs(2, 2), g: sq(1), op: 'remove', k: 4,
    text: 'Twelve matches make a window of four panes. Take away four of them so that just one square is left, with no loose matches.',
    explain: 'Take away the cross in the middle and the frame is all that is left: one big square. It is worth remembering that the full window held **five** squares — the four panes and the frame round them — because the next puzzles count every size.',
    source: TRAD, tags: ['remove', 'window'], links: ['match-four-into-three']
  },
  {
    id: 'match-half-the-panes', title: 'Half the Panes', diff: 1, fig: 'window', segs: gridSegs(2, 2), g: sq(2), op: 'remove', k: 2,
    text: 'From the window of four panes, take away two matches so that exactly two squares remain — every match left must be part of one.',
    hints: ['One of the two squares can be the big one.'],
    explain: 'Take away two matches of the cross that meet at the centre, for example the upper and the left arm. The frame survives as the big square, one small pane survives in the opposite corner, and every match left belongs to one of them.',
    source: TRAD, tags: ['remove', 'window']
  },
  {
    id: 'match-four-into-three', title: 'Four Squares into Three', diff: 2, fig: 'window', segs: gridSegs(2, 2), g: sq(3), op: 'move', k: 3,
    text: 'Twelve matches make a window of four panes. Move three matches so that the twelve form exactly three squares, with no match left over.',
    hints: ['Twelve matches and three squares with none to spare: the three squares cannot share a single side.', 'Keep the two panes on one diagonal. The third square is built outside the window.'],
    explain: 'Three squares of four matches each use up twelve only if no side is shared, so the answer is three separate squares touching at their corners, like a little staircase. Keep the two panes on one diagonal; take the two outside matches of a third pane and one outside match of the fourth, and build a new square against the outside of the window.',
    source: TRAD, tags: ['move', 'window', 'classic'], links: ['match-picture-frame']
  },
  {
    id: 'match-row-plus-one', title: 'One More Square', diff: 1, fig: 'row3', segs: gridSegs(3, 1), g: sq(4), op: 'add', k: 3,
    text: 'Ten matches make a row of three squares. Add three matches to make four squares, with no loose matches.',
    explain: 'Three new matches and one old side make a new square anywhere around the row — on top, underneath or at either end. Easy, but it shows the trick of the harder puzzles: a match already on the table can serve two squares at once.',
    source: TRAD, tags: ['add']
  },
  {
    id: 'match-nine-to-two', title: 'Nine Squares, Two Left', diff: 3, fig: 'noughts', segs: gridSegs(3, 3), g: sq(2), op: 'remove', k: 8,
    text: 'Twenty-four matches make a board of nine squares, like a noughts-and-crosses grid. Take away eight matches so that only two squares are left, with no loose matches.',
    hints: ['Count all the squares first: there are fourteen, big ones included.', 'The outside of the board is a square too. Keep it.', 'A small square can float in the middle of the big one without touching it.'],
    explain: 'Keep the outer frame (twelve matches) and the little square in the centre (four more): sixteen matches, two squares, and nothing loose. There are a few other ways too — the frame with a square of side 2 tucked into one of its corners also leaves two squares — but the little square floating in the middle of the frame is the famous one.',
    source: 'A traditional puzzle on the board of twenty-four matches.', tags: ['remove', 'noughts', 'classic'], links: ['match-no-square-left', 'match-five-small']
  },
  {
    id: 'match-five-small', title: 'Five Small Squares', diff: 3, fig: 'noughts', segs: gridSegs(3, 3), g: sq(5, { sizes: 'unit' }), op: 'remove', k: 4,
    text: 'From the board of nine squares (twenty-four matches), take away four matches so that exactly five small squares are left and every remaining match is a side of one of them.',
    hints: ['Four small squares must go, and each match you take away can break two of them at most.', 'Think of the pattern of a chessboard: keep the four corners and the centre.'],
    explain: 'Take away the middle match of each side of the frame. Each breaks one edge square, so the four edge squares go and the four corners and the centre stay — five small squares in a chequered cross. The inner matches that remain are all sides of the centre or of a corner, so nothing is loose. It is the only way.',
    source: TRAD, tags: ['remove', 'noughts']
  },
  {
    id: 'match-no-square-left', title: 'Not a Square Left', diff: 3, fig: 'noughts', segs: gridSegs(3, 3), g: sq(0), op: 'remove', k: 6,
    text: 'The board of nine squares holds fourteen squares in all: nine small, four of side 2 and the big one. Take away six matches so that not a single square of any size is left.',
    hints: ['Every square must lose at least one side. The big one and the four middle-sized ones can only lose a side on the edge of the board.', 'The middle match of a side of the frame is a side of four squares at once: a small one, two of side 2 and the big one.'],
    explain: 'The big square and the four squares of side 2 can only be broken on the outside of the board, where a single match may be a side of three or four squares at once; the small squares in the middle can only be broken from inside. So a good answer mixes a few outside matches, chosen to spoil all five large squares, with inside matches that each spoil two small ones. There are hundreds of ways with six matches — and none at all with five: the cabinet tried every set of five.',
    source: 'A traditional puzzle; the question of the fewest matches that break every square of a larger board has been taken up by puzzle writers ever since.', tags: ['remove', 'noughts', 'classic'], concepts: ['pigeonhole'], links: ['match-nine-to-two']
  },
  {
    id: 'match-six-to-three', title: 'Six Panes, Three Squares', diff: 2, fig: 'six', segs: gridSegs(3, 2), g: sq(3), op: 'remove', k: 5,
    text: 'Seventeen matches make a window of six panes, three by two. Take away five matches to leave exactly three squares, with no loose matches.',
    hints: ['The two squares of side 2 must go, and so must three of the small ones.'],
    explain: 'Keep the middle pane of one row and the two outer panes of the other: take away the two outer matches of the corner panes on one side and the middle match on the other long side, and three squares are left in a V, every match part of one.',
    source: TRAD, tags: ['remove']
  },
  {
    id: 'match-two-big-squares', title: 'Two Big Squares', diff: 3, fig: 'six', segs: gridSegs(3, 2), g: sq(2), op: 'remove', k: 3,
    text: 'The window of six panes (seventeen matches) holds eight squares: six small ones and two of side 2. Take away only three matches so that exactly two squares are left, with no loose matches.',
    hints: ['Three matches cannot break six small squares one by one. Look for matches that are sides of two small squares.', 'The two squares of side 2 overlap. Keep them both.'],
    explain: 'Take away the three matches of the middle line. Every small square loses a side, but the two big squares — which overlap in the middle — are untouched, and every match left is a side of one of them. It is the only way.',
    source: TRAD, tags: ['remove']
  },
  {
    id: 'match-cross-to-four', title: 'The Cross Becomes Four', diff: 2, fig: 'cross', segs: CROSS, g: sq(4), op: 'move', k: 2,
    text: 'Sixteen matches make a cross of five squares. Move two matches so that there are exactly four squares, with no loose matches.',
    hints: ['A square of side 2 counts as one square.', 'Close off a corner of the cross with matches taken from the inside of the top arm.'],
    explain: 'Take the match between the top arm and the centre, and the top arm\'s inner wall, and use them to close the corner beside the top arm. The top arm, that corner, the left arm and the centre now make one square of side 2 (with the left arm still a square inside it), while the right and bottom arms stay squares: four in all. The other answers are the same move turned or mirrored.',
    source: TRAD, tags: ['move']
  },
  {
    id: 'match-the-key', title: 'The Key', diff: 3, fig: 'key', segs: KEY, g: sq(3), op: 'move', k: 4,
    text: 'Thirteen matches make a key: a square bow, a shaft and two teeth. Move four matches to make exactly three squares, with no loose matches.',
    hints: ['The teeth and the end of the shaft have to go into the squares.', 'The bow is a square of side 2 — it can have a small square in one corner.'],
    explain: 'Take the two teeth and the two far matches of the shaft. Two of them divide off a corner of the bow as a small square; the other two close a new square beside the bow, on top of the first match of the shaft. The bow (a square of side 2), the small square in its corner and the new one make three, with no match wasted.',
    source: 'A traditional theme; this key is the Cabinet\'s own.', tags: ['move', 'figure']
  },
  {
    id: 'match-the-axe', title: 'The Axe', diff: 2, fig: 'axe', segs: AXE, g: sq(3), op: 'move', k: 2,
    text: 'Ten matches make an axe: a head of two squares and a long handle. Move two matches to make three squares, with no loose matches.',
    hints: ['The end of the handle is no use as it is.'],
    explain: 'Take the two matches at the end of the handle and use them, with the match nearest the head, to close a third square against the head. The axe becomes three small squares in an L.',
    source: 'A traditional theme; this axe is the Cabinet\'s own.', tags: ['move', 'figure']
  },
  {
    id: 'match-the-spiral', title: 'The Spiral', diff: 4, fig: 'spiral', segs: SPIRAL, g: sq(3), op: 'move', k: 3,
    text: 'Twenty-four matches make a square spiral. Move three matches to make exactly three squares, with no loose matches.',
    hints: ['The squares do not have to be small. The outside of the spiral is nearly a square already.', 'Close the outer square, then look for one of side 3 inside it.', 'The last square is a small one near the middle.'],
    explain: 'The outer turn of the spiral lacks one match to be a square of side 4, and the second turn lacks one to be a square of side 3. Take the three innermost matches: one closes the outer square, one closes the square of side 3, and the last one, beside it, closes a small square in that square\'s corner. Three squares — of sides 4, 3 and 1 — and all twenty-four matches are used. It is the only way.',
    source: 'A traditional theme; this spiral is the Cabinet\'s own, checked by computer to have one answer.', tags: ['move', 'figure'], links: ['match-spiral-two']
  },
  {
    id: 'match-spiral-two', title: 'The Spiral Unwound', diff: 3, fig: 'spiral', segs: SPIRAL, g: sq(2), op: 'move', k: 2,
    text: 'The square spiral of twenty-four matches again. This time move only two matches to make exactly two squares, with no loose matches.',
    hints: ['Close the outside first.'],
    explain: 'Move the innermost match to close the outer square of side 4, and the end of the second turn to close a square of side 2 in the middle. Two squares, every match used, and only one way to do it.',
    source: 'A traditional theme; this spiral is the Cabinet\'s own.', tags: ['move', 'figure'], links: ['match-the-spiral']
  },
  {
    id: 'match-two-keys', title: 'The Flat Key', diff: 4, fig: 'key12', segs: cellSegs([[0, 0], [0, 1]]).concat([[1, 1, 2, 1], [2, 1, 3, 1], [3, 1, 4, 1], [3, 1, 3, 2], [4, 1, 4, 2]]), g: sq(2), op: 'move', k: 4,
    text: 'Twelve matches make a key with a bow of two squares. Move four matches so that exactly two squares are left, with no loose matches.',
    hints: ['One of the two squares is bigger than a square of the bow.', 'The first tooth can be one side of a square of side 2.'],
    explain: 'The answer is a square of side 2 hanging from the shaft, with the first tooth as part of one side, and the top square of the bow as the one small square left. The lower square of the bow gives up two matches, the shaft and the teeth two more. Only one arrangement works.',
    source: 'A traditional theme; this key is the Cabinet\'s own.', tags: ['move', 'figure']
  },
  {
    id: 'match-hexagon-three', title: 'The Hexagon into Three', diff: 4, fig: 'hexagon', lattice: 'tri', segs: triSegs(HEX), g: tr(3), op: 'move', k: 4,
    text: 'Twelve matches make a hexagon cut into six triangles, like a wheel with six spokes. Move four matches to make exactly three triangles, with no loose matches.',
    hints: ['Twelve matches, three triangles, nothing spare: can the triangles all be small?', 'One of the triangles is bigger than the others.'],
    explain: 'Three small triangles would use only nine of the twelve matches, so one of the three must be a big triangle of side 2 (six matches), and two small ones take the other six. Keep two triangles of the wheel that touch only at the centre; the two spokes pointing the other way become the upper sides of a big triangle, which the four moved matches complete. The six answers are the same answer turned round the hexagon.',
    source: TRAD, tags: ['move', 'triangles', 'classic']
  },
  {
    id: 'match-hexagon-three-left', title: 'Three Spokes Out', diff: 2, fig: 'hexagon', lattice: 'tri', segs: triSegs(HEX), g: tr(3), op: 'remove', k: 3,
    text: 'From the hexagon of six triangles (twelve matches), take away three matches to leave exactly three triangles, with no loose matches.',
    hints: ['A spoke is a side of two triangles, a match of the rim of only one.'],
    explain: 'Take away every other match of the rim. Three triangles lose their outer sides; the other three — every other triangle of the wheel — keep all theirs, and each spoke is still a side of one of them. Taking spokes instead would break two triangles at a time and leave too few. It works in two ways, one a turn of the other.',
    source: TRAD, tags: ['remove', 'triangles']
  },
  {
    id: 'match-hollow-pyramid', title: 'The Hollow Pyramid', diff: 1, fig: 'pyramid', lattice: 'tri', segs: triSegs(bigTriangle(2)), g: tr(1), op: 'remove', k: 3,
    text: 'Nine matches make a triangle of four small triangles (five triangles in all, counting the big one). Take away three matches to leave exactly one triangle.',
    explain: 'Take away the three matches of the upside-down triangle in the middle. What is left is the outline: one big triangle.',
    source: TRAD, tags: ['remove', 'triangles'], links: ['match-pyramid-four']
  },
  {
    id: 'match-pyramid-four', title: 'Four from the Pyramid', diff: 2, fig: 'pyramid', lattice: 'tri', segs: triSegs(bigTriangle(2)), g: tr(4), op: 'move', k: 2,
    text: 'Nine matches make a pyramid: four small triangles and the big one they form, five in all. Move two matches so that there are exactly four triangles, with no loose matches.',
    hints: ['Take the two matches at one corner of the big triangle.', 'Put them where they make a new small triangle against the side of the pyramid.'],
    explain: 'Take away a corner triangle\'s two outside matches: the big triangle is broken. Lay them against an outside side of the pyramid to close a new small triangle there. Four small triangles again, but the big one is gone.',
    source: TRAD, tags: ['move', 'triangles'], links: ['match-hollow-pyramid']
  },
  {
    id: 'match-six-small-triangles', title: 'Six Small Triangles', diff: 3, fig: 'great', lattice: 'tri', segs: triSegs(bigTriangle(3)), g: tr(6, { sizes: 'unit' }), op: 'remove', k: 6,
    text: 'Eighteen matches make a large triangle of nine small ones (thirteen triangles in all). Take away six matches so that exactly six small triangles are left, and every match left is a side of one.',
    hints: ['Three small triangles must go, and which three matters.', 'Take away whole corners.'],
    explain: 'Take away the two outside matches at each corner of the big triangle. The three corner triangles vanish, and with them every triangle bigger than one match; the six small triangles left make a hexagon in the middle, and every match is a side of one of them. The search finds only this one way.',
    source: TRAD, tags: ['remove', 'triangles']
  },
  {
    id: 'match-ribbon-three', title: 'The Ribbon', diff: 1, fig: 'ribbon5', lattice: 'tri', segs: triSegs([[0, 0, 1], [0, 0, 0], [1, 0, 1], [1, 0, 0], [2, 0, 1]]), g: tr(3), op: 'remove', k: 2,
    text: 'Eleven matches make a ribbon of five triangles. Take away two matches to leave exactly three triangles, with no loose matches.',
    explain: 'Take away the two matches along the bottom edge. The two triangles that stood on them lose their bases; the other three keep every side, and every slanting match is a side of one of them. Only this choice works.',
    source: TRAD, tags: ['remove', 'triangles']
  },
  {
    id: 'match-cherry-glass', title: 'The Cherry in the Glass', diff: 2, fig: 'glass', lattice: 'sq2', segs: GLASS, g: { shape: GLASS, motions: 'any', outside: [0, -0.5] }, op: 'move', k: 2,
    deco: [{ t: 'cherry', at: [0, -0.5] }],
    goal: 'Move exactly **2 matches** so that the glass has the same shape again — turned or mirrored is fine — with the cherry outside it. The cherry stays where it is.',
    text: 'Four matches make a glass with a stem, and a cherry sits in the glass. Move two matches so that the glass is the same shape as before and the cherry is outside it. You may not touch the cherry.',
    hints: ['The glass can end up upside down.', 'Slide the bottom of the glass half a match sideways.', 'Then move one side of the glass down, so that the old stem becomes a side and the other old side becomes the stem.'],
    explain: 'Slide the bottom match half its length to one side, and move one wall of the glass down to the far end of it. The glass is now upside down: the old stem and the moved wall are its sides, the old other wall is its stem — and the cherry is left outside, above it. In some tellings the glass is a cocktail and the cherry an olive.',
    source: 'A traditional puzzle; much reprinted in the twentieth century.', tags: ['move', 'figure', 'classic'], concepts: ['lateral']
  },
  {
    id: 'match-fish-turns', title: 'The Fish Turns Round', diff: 3, fig: 'fish7', lattice: 'trv', segs: FISH7, g: { shape: FISH7.map(mirTrv), motions: 'translate' }, op: 'move', k: 3,
    goal: 'Move exactly **3 matches** so that the fish swims the other way, like the picture beside the table.',
    text: 'Seven matches make a fish swimming to the left: a diamond for the body and a triangle for the tail. Move three matches so that the fish swims to the right.',
    hints: ['The fish does not have to stay where it is.', 'The old tail can become part of the new body.'],
    explain: 'There are two answers, both of three moves. Carry the whole tail round to the nose — the diamond body looks the same from either end. Or keep four matches where they are: the back half of the body becomes the new tail and the old tail fins become the front of the new body, with three matches closing the gaps. Two moves cannot do it.',
    source: TRAD, tags: ['move', 'figure', 'classic'], concepts: ['symmetry'], links: ['match-fish-eight']
  },
  {
    id: 'match-fish-eight', title: 'The Fat Fish', diff: 2, fig: 'fish8', lattice: 'trv', segs: FISH8, g: { shape: FISH8.map(mirTrv), motions: 'translate' }, op: 'move', k: 2,
    goal: 'Move exactly **2 matches** so that the fish swims the other way, like the picture beside the table.',
    text: 'This fish has eaten well: its body is a diamond with a line down the middle, eight matches in all. Move just two matches to make it swim to the right.',
    hints: ['The middle line and the back of the body make a triangle already.'],
    explain: 'Take the two matches at the fish\'s nose and put them at the back, beyond the tail. The old tail becomes the front half of the new body, its end line now the middle line; the back half of the old body becomes the new tail, with the old middle line as its end. With the fat fish, two moves are enough.',
    source: 'A variation of the traditional fish.', tags: ['move', 'figure'], concepts: ['symmetry'], links: ['match-fish-turns']
  },
  {
    id: 'match-house-turns', title: 'The Cottage', diff: 1, fig: 'house', lattice: 'roof', segs: HOUSE, g: { shape: HOUSE.map(mirX), motions: 'translate' }, op: 'move', k: 1,
    goal: 'Move exactly **1 match** so that the house faces the other way, like the picture beside the table.',
    text: 'Eleven matches make a cottage seen from the corner: a gable end on the left, with the long side and the roof going off to the right. Move one match so that the cottage faces the other way.',
    hints: ['Look at the gable: which of its two slopes could belong to the other end?'],
    explain: 'The walls of the cottage are two squares side by side, the same from either end; only the roof tells which way it faces. Move the gable\'s inner slope to the other end of the ridge: with the old back slope it makes the new gable, and the old outer slope becomes the far end of the roof.',
    source: 'A traditional theme; this cottage is the Cabinet\'s own.', tags: ['move', 'figure'], links: ['match-house-flag']
  },
  {
    id: 'match-house-flag', title: 'The Cottage with a Flagpole', diff: 2, fig: 'house+', lattice: 'roof', segs: HOUSE_POLE, g: { shape: HOUSE_POLE.map(mirX), motions: 'translate' }, op: 'move', k: 2,
    goal: 'Move exactly **2 matches** so that the house, flag and all, faces the other way, like the picture beside the table.',
    text: 'The cottage again, now with a flagpole on its gable: twelve matches. Move two matches so that the whole house faces the other way.',
    hints: ['The flagpole has to stay on the gable.'],
    explain: 'Turn the house round as before by moving the gable\'s inner slope to the far end of the ridge — and move the flagpole along with the gable.',
    source: 'A variation on the cottage.', tags: ['move', 'figure'], links: ['match-house-turns']
  },
  {
    id: 'match-cross-seven', title: 'Seven from the Cross', diff: 2, fig: 'cross', segs: CROSS, g: sq(7), op: 'add', k: 2,
    text: 'The cross of five squares (sixteen matches) again. Add two matches so that there are exactly seven squares, with no loose matches.',
    hints: ['Fill in one corner of the cross.'],
    explain: 'Two matches fill a corner between two arms of the cross. That makes a new small square, and the new square with its three neighbours makes a square of side 2: five plus two is seven.',
    source: TRAD, tags: ['add']
  },
  {
    id: 'match-three-rows', title: 'Two into Three', diff: 2, fig: 'six', segs: gridSegs(3, 2), g: sq(3), op: 'move', k: 3,
    text: 'Seventeen matches make a window of six panes. Move three matches so that exactly three squares are left, with no loose matches.',
    hints: ['The two big squares of side 2 can stay.', 'The third square is a small one, outside the window.'],
    explain: 'Take the three matches of the middle line — which breaks every small pane but leaves both squares of side 2 — and use them, with one side of the window, to build a small square outside. Two big squares and one small: three.',
    source: TRAD, tags: ['move'], links: ['match-two-big-squares']
  }
];

/* ---------- solving a classic ---------- */

function solveClassic(c) {
  const d = { lattice: c.lattice || 'sq', start: c.segs, goal: c.g };
  d[c.op] = c.k;
  if (c.deco) d.deco = c.deco;
  const M = MS.build(Object.assign({}, d, { margin: 2 }));
  if (M.err) throw new Error(c.id + ': ' + M.err);
  const res = MS.solveAll(M, M.start, c.g, c.op, c.k, { cap: 5e6 });
  if (!res.sols.length) throw new Error(c.id + ': no solution with ' + c.k);
  if (res.capped) console.warn('  ' + c.id + ': search capped');
  if (c.op !== 'remove' || c.g.squares === 0 || c.g.triangles === 0) {
    for (let j = 1; j < c.k; j++) {
      const s = MS.solveAll(M, M.start, c.g, c.op, j, { cap: 5e6, max: 1 });
      if (s.sols.length) throw new Error(c.id + ': can be done with ' + j);
    }
  }
  let best = null, bestA = Infinity;
  res.sols.forEach((s) => {
    const pts = [];
    M.start.concat(s.on).forEach((e) => pts.push(M.edges[e].a, M.edges[e].b));
    const b = C.geom.bbox([pts]);
    const a = (b.w + 1) * (b.h + 1);
    if (a < bestA - 1e-9) { bestA = a; best = s; }
  });
  const lat = d.lattice;
  d.sol = {
    off: best.off.map((e) => M.start.indexOf(e)),
    on: best.on.map((e) => MS.toData(lat, M.edges[e].a).concat(MS.toData(lat, M.edges[e].b)))
  };
  if (lat === 'sq') delete d.lattice;
  return { d, count: res.sols.length, syms: MS.symmetries(M, M.start).length };
}

// heads: seeded coin flips, so the matches do not all point one way
function heads(segs, seed) {
  const rng = C.rng(seed);
  return segs.map((s) => (rng() < 0.5 ? s.slice() : [s[2], s[3], s[0], s[1]]));
}

/* ---------- writing ---------- */

function emitter(lines) {
  return (p) => {
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
  };
}

function writeClassics() {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/matchstick-classics.js — made by tools/gen/matchsticks.js */');
  lines.push("Cabinet.history([{ year: 1826, title: 'The friction match', text: 'John Walker, a chemist in Stockton-on-Tees, makes the first matches that light when struck. Within a generation a box of matches is in every pocket — and the puzzles made from them follow.', links: ['matchstick-classics', 'matchstick-shapes'] }]);");
  lines.push('Cabinet.family({');
  lines.push("  id: 'matchstick-classics', engine: 'matchsticks', cat: 'matches', name: 'Matchstick classics', order: 1,");
  lines.push("  blurb: 'The famous ones: four squares into three, the cherry in the glass, the fish that turns round, the spiral, the key and the board of twenty-four matches.',");
  lines.push("  origin: { who: 'Traditional', note: 'Match puzzles spread with the matches themselves. The friction match was invented in 1826 and the safety match in the 1840s and 1850s, and puzzles made of matches soon turned up in books of parlour amusements. Most have no known author: they have passed from one puzzle book to the next ever since. Every answer here was checked by computer, including that fewer matches will not do.' },");
  lines.push("  concepts: ['combinatorics', 'symmetry']");
  lines.push('}, [');
  const emit = emitter(lines);
  const report = [];
  CLASSICS.forEach((c) => {
    const r = solveClassic(c);
    r.d.start = heads(r.d.start, C.hash(c.id));
    if (c.deco) r.d.deco = c.deco;
    const p = { id: c.id, title: c.title, diff: c.diff, year: c.year, source: c.source, text: c.text, goal: c.goal, hints: c.hints, explain: c.explain, links: c.links, concepts: c.concepts, tags: c.tags, data: r.d };
    const v = ENG.verify(p);
    if (!v.ok) throw new Error(c.id + ': verify: ' + v.err);
    report.push(c.id + ' ' + r.count + ' answers (' + r.syms + ' symmetries)');
    emit(p);
  });
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, 'data/matchstick-classics.js'), lines.join('\n') + '\n');
  console.log('matchstick-classics: ' + CLASSICS.length + ' puzzles');
  if (process.argv.includes('-v')) report.forEach((l) => console.log('  ' + l));
}

/* ---------- squares and triangles: the generated drawer ---------- */

const goalKey = (fig, op, k, g) => [fig, op, k, g.squares != null ? 's' + g.squares : 't' + g.triangles, g.sizes === 'unit' ? 'u' : 'a'].join('|');

function candidatesOf(fig, seen) {
  const out = [];
  const kind = fig.lattice === 'sq' ? 'squares' : 'triangles';
  const M = MS.build({ lattice: fig.lattice, start: fig.segs, goal: { [kind]: 0 } });
  const occ = MS.occOf(M, M.start);
  const n0 = MS.evalState(M, occ, { [kind]: 0 }).n, u0 = MS.evalState(M, occ, { [kind]: 0, sizes: 'unit' }).n;
  const N = fig.segs.length;
  const kmaxR = N > 26 ? 8 : 10;
  for (const op of ['remove', 'move', 'add']) {
    const ks = op === 'remove' ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((k) => k <= kmaxR && k < N - 2) : (N > 26 ? [1, 2, 3] : N > 18 && op === 'move' ? [1, 2, 3] : [1, 2, 3, 4]);
    for (const k of ks) {
      const ns = op === 'remove' ? [...Array(n0).keys()] : op === 'add' ? [1, 2, 3, 4, 5, 6].map((i) => n0 + i) : [...Array(n0 + 3).keys()].map((i) => i + 1);
      for (const n of ns) {
        for (const sizes of (n0 > u0 && n > 0 ? ['any', 'unit'] : ['any'])) {
          const g = { [kind]: n };
          if (n > 0) { g.noLoose = true; if (sizes === 'unit') g.sizes = 'unit'; }
          const key = goalKey(fig.id, op, k, g);
          if (seen.has(key)) continue;
          const a = MS.assess(fig, op, k, g, { cap: 400000 });
          if (!a) continue;
          seen.add(key);
          out.push({ fig, op, k, g, a, key, elegance: a.sols / Math.max(1, MS.symmetries(a.M, a.M.start).length) });
        }
      }
    }
  }
  return out;
}

function writeShapes() {
  const t0 = Date.now();
  const seen = new Set();
  // the classics keep their own figures and goals
  CLASSICS.forEach((c) => { if (MS.FIGS[c.fig] && c.g && !c.g.shape) seen.add(goalKey(c.fig, c.op, c.k, c.g)); });
  const figs = Object.keys(MS.FIGS).filter((id) => id !== 'sixteen').map((id) => MS.figure(id, null));
  // a few random figures of small squares and small triangles, seeded
  const rng = C.rng(20260930);
  const shapesSeen = new Set(figs.map((f) => JSON.stringify(f.segs.map((s) => s.join(',')).sort())));
  const names = {};
  for (let i = 0; figs.length < Object.keys(MS.FIGS).length - 1 + 10 && i < 200; i++) {
    const id = i % 2 ? 'iamond' + rng.range(5, 7) : 'poly' + rng.range(5, 7);
    const f = MS.figure(id, rng);
    const key = JSON.stringify(f.segs.map((s) => s.join(',')).sort());
    if (shapesSeen.has(key)) continue;
    shapesSeen.add(key);
    names[f.name] = (names[f.name] || 0) + 1;
    if (names[f.name] > 1) f.name += ' No. ' + names[f.name];
    f.id = id + '-' + i;
    figs.push(f);
  }
  let cands = [];
  figs.forEach((f) => {
    const t = Date.now();
    const c = candidatesOf(f, seen);
    cands = cands.concat(c);
    if (process.argv.includes('-v')) console.log('  ' + f.id + ': ' + c.length + ' candidates, ' + (Date.now() - t) + ' ms');
  });
  if (process.argv.includes('-v')) {
    const t = {};
    cands.forEach((c) => { const k = c.a.diff + c.op; t[k] = (t[k] || 0) + 1; });
    console.log('  candidates by level and rule: ' + JSON.stringify(t));
  }
  // pick a spread: quotas per level, round-robin over figures, the most elegant (fewest answers) first
  const quota = [0, 24, 38, 44, 36, 18];
  const chosen = [];
  const share = { move: 0.4, add: 0.18, remove: 0.42 };
  for (let lv = 1; lv <= 5; lv++) {
    const pool = cands.filter((c) => c.a.diff === lv).sort((x, y) => x.elegance - y.elegance || x.a.score - y.a.score);
    // how many of each rule: its share of the level, as far as there are candidates; the rest goes to taking away
    const avail = { move: 0, add: 0, remove: 0 };
    pool.forEach((c) => { avail[c.op]++; });
    const want = {};
    let left = quota[lv];
    ['move', 'add'].forEach((op) => { want[op] = Math.min(avail[op], Math.round(quota[lv] * share[op])); left -= want[op]; });
    want.remove = Math.min(avail.remove, left);
    ['move', 'add'].forEach((op) => { const more = Math.min(avail[op] - want[op], quota[lv] - want.move - want.add - want.remove); if (more > 0) want[op] += more; });
    ['remove', 'move', 'add'].forEach((op) => {
      const byFig = new Map();
      pool.filter((c) => c.op === op).forEach((c) => { if (!byFig.has(c.fig.id)) byFig.set(c.fig.id, []); byFig.get(c.fig.id).push(c); });
      let got = 0;
      while (got < want[op]) {
        let any = false;
        for (const list of byFig.values()) {
          if (got >= want[op] || !list.length) continue;
          chosen.push(list.shift()); got++; any = true;
        }
        if (!any) break;
      }
    });
  }
  chosen.sort((x, y) => x.a.diff - y.a.diff || x.a.score - y.a.score);
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/matchstick-shapes.js — made by tools/gen/matchsticks.js */');
  lines.push('Cabinet.family({');
  lines.push("  id: 'matchstick-shapes', engine: 'matchsticks', cat: 'matches', name: 'Squares and triangles', order: 2,");
  lines.push("  blurb: 'Take away, move or add matches until exactly the squares or triangles asked for are left — and remember that the big ones count too.',");
  lines.push("  origin: { who: 'Traditional puzzles, computer-made variants', note: 'Boards of matches that must lose, gain or rearrange a few sticks to leave so many squares are among the oldest match puzzles. These are made by the Cabinet: every figure was searched completely, each puzzle has a known answer, and fewer matches never do it.' },");
  lines.push("  concepts: ['combinatorics', 'invariant']");
  lines.push('}, [');
  const emit = emitter(lines);
  const titles = new Set();
  const hist = [0, 0, 0, 0, 0, 0];
  const opsN = { remove: 0, move: 0, add: 0 };
  chosen.forEach((c, i) => {
    const p = MS.puzzleFrom(c.fig, c.op, c.k, c.g, c.a, C.rng(C.hash(c.key)), c.a.diff);
    let title = p.title;
    if (titles.has(title)) throw new Error('duplicate title ' + title);
    titles.add(title);
    const q = Object.assign({ id: 'match-shape-' + String(i + 1).padStart(3, '0') }, p, { tags: [c.op, c.fig.lattice === 'sq' ? 'squares' : 'triangles'] });
    const v = ENG.verify(q);
    if (!v.ok) throw new Error(q.id + ' ' + q.title + ': ' + v.err);
    hist[q.diff]++; opsN[c.op]++;
    emit({ id: q.id, title: q.title, diff: q.diff, text: q.text, hints: q.hints, tags: q.tags, data: q.data });
  });
  lines.push(']);');
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'data/matchstick-shapes.js'), out);
  console.log('matchstick-shapes: ' + chosen.length + ' puzzles from ' + cands.length + ' candidates (' + figs.length + ' figures); levels ' + hist.slice(1).join('/') +
    '; ' + opsN.remove + ' take away, ' + opsN.move + ' move, ' + opsN.add + ' add; ' + Math.round(out.length / 1024) + ' KB, ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
}

module.exports = { CLASSICS, solveClassic };
if (require.main === module) {
  if (!process.argv.includes('--shapes')) writeClassics();
  if (!process.argv.includes('--classics')) writeShapes();
}
