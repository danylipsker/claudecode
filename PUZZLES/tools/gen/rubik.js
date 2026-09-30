/* The Puzzle Cabinet · tools/gen/rubik.js
 *
 *   node tools/gen/rubik.js        writes data/rubik.js
 *
 * Named puzzles and patterns first, then scrambles of every depth. Every par
 * is the fewest quarter turns, proved by the solvers in js/lib/twisty.js
 * (IDA* with pattern tables for the 3×3, the full table for the 2×2).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/twisty.js'));
require(path.join(ROOT, 'engines/rubik.js'));
const T = C.Twisty, R = C.rubik;
T.ensure3(); T.ensure2();
const K3 = T.cube(3), K2 = T.cube(2);

function optimal(K, start, goal) {
  if (K.N === 2) return goal ? T.distance2(start, goal) : T.distance2(start);
  const r = T.solve(3, start, goal, { max: 14, nodes: 5e7 });
  return r.fail ? null : r.len;
}
function solutionOf(K, start) {
  const r = T.solve(K.N, start, null, { max: 14, nodes: 5e7 });
  if (r.fail) throw new Error('no solution found');
  return { len: r.len, text: K.fmt(r.moves) };
}

const puzzles = [];
// a named scramble: the par and the stored solution come from the solver
function solvePuzzle(o) {
  const K = o.n === 3 ? K3 : K2;
  const start = K.run(K.solved(), o.scramble);
  const sol = solutionOf(K, start);
  puzzles.push(Object.assign({}, o, { par: sol.len, data: { n: o.n, mode: 'solve', scramble: o.scramble, solution: sol.text } }, { n: undefined, scramble: undefined }));
}
function patternPuzzle(o) {
  const K = o.n === 3 ? K3 : K2;
  const g = K.run(K.solved(), o.pattern);
  const route = K.cost(K.parse(o.pattern));
  const opt = route <= 14 ? optimal(K, K.solved(), g) : null;
  if (opt != null && opt > route) throw new Error('solver disagrees on ' + o.id);
  puzzles.push(Object.assign({}, o, { par: opt == null ? undefined : opt, data: { n: o.n, mode: 'pattern', pattern: o.pattern } }, { n: undefined, pattern: undefined }));
  return { route, opt };
}

/* ---------- named puzzles ---------- */

solvePuzzle({
  id: 'rubik-one-turn', n: 3, scramble: 'R', title: 'One Turn', diff: 1,
  text: 'Somebody gave one face of this Rubik\'s cube a single quarter turn. Turn it back.\n\nDrag a sticker across the cube to turn its layer, or use the move pad. Drag the table around the cube to see the other sides.',
  hints: ['One face is still whole, but a band of wrong colours runs round it on four sides. Which face is it?'],
  explain: 'A quarter turn of the right face (R) made it; a quarter turn the other way (R′) undoes it. Every turn is undone by the same turn backwards.',
  concepts: ['rotation-3d'], tags: ['rubik', 'first']
});
solvePuzzle({
  id: 'pocket-one-turn', n: 2, scramble: "U'", title: 'Pocket Change', diff: 1,
  text: 'The pocket cube is a Rubik\'s cube with only corners: eight little cubes. One of its faces was given a quarter turn. Put it right.',
  hints: ['Look at the top: its four corners are fine, but the colours just below them are all one step round.'],
  explain: 'The top face was turned anticlockwise (U′), so a clockwise turn (U) brings it home.',
  concepts: ['rotation-3d'], tags: ['pocket', 'first']
});
patternPuzzle({
  id: 'rubik-humbugs', n: 3, pattern: "U D'", title: 'Humbugs', diff: 1,
  text: 'Starting from a solved cube, make every side face striped like a humbug: its own colour across the middle, and a neighbour\'s colour above and below, as in the picture. The top and the bottom stay whole.',
  hints: ['The middle stripe of every side keeps its own colour, so the middle layer does not move.', 'Turn the top and the bottom layers a quarter turn each, the same way round as seen from above.'],
  explain: 'U D′. Seen from above, U and D′ both turn clockwise, so the top and bottom layers move together and only the middle layer stays behind — almost a turn of the whole cube.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
patternPuzzle({
  id: 'rubik-flags', n: 3, pattern: 'U D', title: 'Tricolour Flags', diff: 1,
  text: 'Now make every side face a flag of three different colours in bands, as in the picture. The top and the bottom stay whole.',
  hints: ['Compare with [[rubik-humbugs]]: there the top and bottom rows came from the same neighbour.', 'Turn the top layer and the bottom layer a quarter turn each, opposite ways round as seen from above.'],
  explain: 'U D. Seen from above, U turns clockwise and D anticlockwise, so each side gets its top stripe from one neighbour and its bottom stripe from the other.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
patternPuzzle({
  id: 'rubik-sandwich', n: 3, pattern: 'U2 D2', title: 'The Sandwich', diff: 1,
  text: 'From a solved cube, make every side face a sandwich: its own colour in the middle, and the colour of the opposite side above and below, as in the picture.',
  hints: ['The colour of the opposite side arrives with half turns.', 'Half a turn of the top layer and half a turn of the bottom layer.'],
  explain: 'U2 D2: a half turn brings the opposite face\'s colours round to each side, top and bottom alike. Four quarter turns in all.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
patternPuzzle({
  id: 'pocket-stripes', n: 2, pattern: 'R2 F2', title: 'Stripes All Round', diff: 1,
  text: 'Starting from a solved pocket cube, make every face show two stripes of two colours, as in the picture.',
  hints: ['Half turns only: they swap colours between opposite faces.', 'Half a turn of one face, then half a turn of a face next to it.'],
  explain: 'R2 F2 — two half turns, four quarter turns. Every face ends with two colours in stripes.',
  concepts: ['rotation-3d'], tags: ['pattern', 'pocket']
});
solvePuzzle({
  id: 'rubik-famous-four', n: 3, scramble: "R U R' U'", title: 'The Famous Four', diff: 2,
  text: 'This cube had just four quarter turns: right up, top left, right down, top right — the little dance cubers do so often that they have a nickname for it (the "sexy move"). Undo it.',
  hints: ['Undo the last turn first: the last turn was the top face.', 'Reverse the whole dance: each turn backwards, in the opposite order.'],
  explain: 'The moves were R U R′ U′; undoing them means U R U′ R′ — the same turns backwards and in reverse order, like taking off socks and shoes. Here is a curiosity: do R U R′ U′ six times in a row and the cube is solved again. It moves only a few pieces, which is why cubers use it so much: it is a **commutator** ([[c:commutator|see the idea]]).',
  concepts: ['commutator', 'rotation-3d'], tags: ['classic', 'algorithm']
});
patternPuzzle({
  id: 'rubik-checkerboard', n: 3, pattern: 'U2 D2 F2 B2 L2 R2', title: 'Checkerboard', diff: 2,
  text: 'Make the checkerboard: every face a chequer of its own colour and the colour of the opposite face, as in the picture. Cubers have long called this pattern *pons asinorum*, the bridge of asses.',
  hints: ['Only half turns are needed.', 'Give every one of the six faces half a turn.'],
  explain: 'Half a turn of each face — U2 D2 F2 B2 L2 R2 — swaps every edge sticker with the opposite face\'s colour and leaves the corners and centres in place. Twelve quarter turns, and the solver confirms that nothing shorter makes it. (The middle-slice turns M2 E2 S2 make it too, as seen from a turned cube.)',
  concepts: ['symmetry', 'rotation-3d'], tags: ['pattern', 'classic']
});
patternPuzzle({
  id: 'rubik-half-checker', n: 3, pattern: 'R2 L2 U2 D2', title: 'Half a Checkerboard', diff: 2,
  text: 'A cousin of the checkerboard: chequered front and back, striped everywhere else. Make it from a solved cube.',
  hints: ['Half turns again — but not of every face.', 'Leave the front and the back faces alone.'],
  explain: 'R2 L2 U2 D2: four of the six half turns of the checkerboard. The front and back faces are never turned themselves, but their edge stickers are swapped by the other four half turns, so they become chequered.',
  concepts: ['symmetry'], tags: ['pattern']
});
patternPuzzle({
  id: 'pocket-checker-caps', n: 2, pattern: 'R2 U2 F2', title: 'Chequered Caps', diff: 2,
  text: 'Make the pocket cube\'s top and bottom into little chequerboards, as in the picture.',
  hints: ['Three half turns do it.', 'Right, top, front — each half a turn.'],
  explain: 'R2 U2 F2, six quarter turns. The top and the bottom become chequered because two half turns in different directions carry opposite corners across.',
  concepts: ['symmetry'], tags: ['pattern', 'pocket']
});
patternPuzzle({
  id: 'pocket-side-stripes', n: 2, pattern: 'R2 F2 R2', title: 'Belted Pocket', diff: 2,
  text: 'Make the pocket cube in the picture: top and bottom whole, and every side face striped up and down in two colours.',
  hints: ['A half turn of the right face, then of the front, then of the right again.'],
  explain: 'R2 F2 R2: six quarter turns. The top and bottom stay whole because every piece that leaves the top by one half turn is brought back up by the next.',
  concepts: ['symmetry'], tags: ['pattern', 'pocket']
});
patternPuzzle({
  id: 'rubik-six-spots', n: 3, pattern: "U D' R L' F B' U D'", title: 'Six Spots', diff: 3,
  text: 'Make six spots: every face all one colour except its centre, which shows another colour, as in the picture.',
  hints: ['The spots are the centres — but centres never move when you turn faces. So it is everything *around* the centres that must move.', 'Turn opposite faces in opposite senses: U D′, then R L′, then F B′, and finish with U D′ again.'],
  explain: 'U D′ R L′ F B′ U D′ — eight quarter turns, and the solver shows that no shorter way exists. A pair such as U D′ turns the top and bottom layers the same way round, so it acts like a turn of the whole cube in which one middle layer, centres and all, stays behind.',
  concepts: ['rotation-3d'], tags: ['pattern', 'classic']
});
patternPuzzle({
  id: 'rubik-tetris', n: 3, pattern: "L R F B U' D' L' R'", title: 'Tetris', diff: 3,
  text: 'Make the pattern in the picture: every face shows interlocking shapes like the blocks of a falling-block game.',
  hints: ['Only outer faces turn, each a quarter turn.', 'Turn left and right together, then front and back, then top and bottom (the other way), then left and right back again.'],
  explain: 'L R F B U′ D′ L′ R′ — eight quarter turns, and none fewer will do.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
patternPuzzle({
  id: 'rubik-four-spots', n: 3, pattern: "F2 B2 U D' R2 L2 U D'", title: 'Four Spots', diff: 3,
  text: 'Four side faces with a spot of another colour in the middle, the top and bottom untouched — as in the picture.',
  hints: ['The spots are again the centres staying behind while their neighbours move.', 'Half turns of front and back, then U D′, then half turns of right and left, then U D′ again.'],
  explain: 'F2 B2 U D′ R2 L2 U D′ — twelve quarter turns, the fewest possible.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
solvePuzzle({
  id: 'rubik-sune', n: 3, scramble: "R U R' U R U2 R'", title: 'Undo the Sune', diff: 4,
  text: 'Cubers learn a short sequence called the *Sune*, which twists three corners of the top layer and puts everything else back. It was done once to this cube. Undo it.',
  hints: ['Only the top layer is wrong — and within it only the corners are twisted.', 'Doing the Sune backwards works (every move undone in reverse order); the solver knows a way as short as that.'],
  explain: 'The Sune is R U R′ U R U2 R′. Its reverse, R U2 R′ U′ R U′ R′, undoes it in eight quarter turns, which is also the fewest possible.',
  concepts: ['commutator'], tags: ['algorithm']
});
patternPuzzle({
  id: 'rubik-snake', n: 3, pattern: "L U B' U' R L' B R' F B' D R D' F'", title: 'The Snake', diff: 5,
  text: 'Make the pattern in the picture: a band of each face\'s colour winds round the cube like a snake.',
  hints: ['This one takes fourteen quarter turns, no half turns needed.', 'Start with L U B′ U′ — and the hint button will show you each next turn.'],
  explain: 'One way: L U B′ U′ R L′ B R′ F B′ D R D′ F′, fourteen quarter turns; the solver shows that nothing shorter exists.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
patternPuzzle({
  id: 'rubik-cube-in-cube', n: 3, pattern: "F L F U' R U F2 L2 U' L' B D' B' L2 U", title: 'Cube in a Cube', diff: 5,
  text: 'The most famous cube pattern of all: a small 2×2×2 cube seems to sit in the corner of the big one, as in the picture.',
  hints: ['Three faces keep a 2×2 block of their own colour; the rest of the cube is turned round the corner they share.', 'A known route: F L F U′ R U F2 L2 U′ L′ B D′ B′ L2 U. The hint button walks you along it.'],
  explain: 'F L F U′ R U F2 L2 U′ L′ B D′ B′ L2 U (fifteen face turns, eighteen quarter turns). The pieces of a 2×2×2 corner block stay together and turn as one; the rest of the cube is recoloured around it.',
  concepts: ['rotation-3d'], tags: ['pattern', 'classic']
});
patternPuzzle({
  id: 'rubik-stripes', n: 3, pattern: "F U F R L2 B D' R D2 L D' B R2 L F U F", title: 'Rainbow Stripes', diff: 5,
  text: 'Make the four side faces into three upright stripes of three colours each, the top and bottom whole, as in the picture.',
  hints: ['The top and the bottom end whole, so plenty of turns must cancel their damage later.', 'A route: F U F R L2 B D′ R D2 L D′ B R2 L F U F — ask for hints to follow it.'],
  explain: 'One route: F U F R L2 B D′ R D2 L D′ B R2 L F U F — twenty quarter turns. It is not known to be the shortest.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
patternPuzzle({
  id: 'rubik-cube-cube-cube', n: 3, pattern: "U' L' U' F' R2 B' R F U B2 U B' L U' F U R F'", title: 'Cube in a Cube in a Cube', diff: 5,
  text: 'Go one better than the cube in a cube: a 1×1, inside a 2×2, inside the 3×3, all nested in the same corner, as in the picture.',
  hints: ['A route: U′ L′ U′ F′ R2 B′ R F U B2 U B′ L U′ F U R F′ — ask for hints to follow it.'],
  explain: 'One route: U′ L′ U′ F′ R2 B′ R F U B2 U B′ L U′ F U R F′ — eighteen face turns, twenty quarter turns.',
  concepts: ['rotation-3d'], tags: ['pattern']
});
patternPuzzle({
  id: 'rubik-superflip', n: 3, pattern: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2", title: 'Superflip', diff: 5, year: 1995,
  source: 'Michael Reid proved in 1995 that the superflip needs 20 face turns.',
  text: 'In the **superflip** every corner is home and every edge is home too — but each edge is flipped over, as in the picture. It was the first position proved to need 20 face turns, the most any position needs. Make it.',
  hints: ['No short cut: the known ways take twenty face turns.', 'A route: U R2 F B R B2 R U2 L B2 R U′ D′ R2 F R′ L B2 U2 F2 — ask for hints to follow it.'],
  explain: 'U R2 F B R B2 R U2 L B2 R U′ D′ R2 F R′ L B2 U2 F2 — twenty face turns (twenty-eight quarter turns; in quarter turns the superflip needs 24, with a cleverer route). In 2010 a large computer search showed that no position of the cube needs more than 20 face turns: "God\'s number" is 20.',
  concepts: ['parity', 'state-space'], tags: ['pattern', 'classic']
});

/* ---------- free play ---------- */

const frng = C.rng(1980);
puzzles.push({
  id: 'rubik-free', title: 'Against the Clock', diff: 4,
  text: 'A whole scrambled Rubik\'s cube. Solve it — any method you know — and the clock records your time. **New scramble** mixes it up again.',
  hints: ['Most people start with a cross on one face: the four edges around one centre, each matching the centres beside it.', 'Then the corners of that face, then the middle layer, then the last face: layer by layer. The hint button shows the next turn when the solver can see a short way.'],
  explain: 'Every scrambled cube can be solved in 20 face turns or fewer (proved in 2010), though finding such a solution needs a computer. People use methods: a layer at a time, with a handful of memorised sequences.',
  concepts: ['state-space', 'commutator'], tags: ['free', 'timer'],
  data: { n: 3, mode: 'free', scramble: R.scrambleText(frng, 3) }
});
puzzles.push({
  id: 'pocket-free', title: 'Pocket Sprint', diff: 3,
  text: 'A scrambled pocket cube to solve against the clock. **New scramble** makes another.',
  hints: ['Finish one face first — with its four side colours matching in pairs.', 'Then turn the cube over and sort out the last layer; the hint button always knows the shortest way.'],
  explain: 'The pocket cube has 3,674,160 positions (with one corner held still) and none of them is more than 14 quarter turns from solved — few enough for a computer to look at every one, which is exactly what the hint button does.',
  concepts: ['state-space'], tags: ['free', 'timer', 'pocket'],
  data: { n: 2, mode: 'free', scramble: R.scrambleText(frng, 2) }
});

/* ---------- scrambles of every depth ---------- */

const T3 = {
  1: ['A Single Slip'],
  2: ['Two Wrongs', 'Double Take', 'Cross Currents'],
  3: ['Three Winks', 'Triple Twist', 'Out of Step'],
  4: ['Four Corners Askew', 'The Square Dance', 'Crossed Wires', 'Four Seasons'],
  5: ['Five Finger Exercise', 'The Fifth Turn', 'Pentagram', 'A Handful of Turns'],
  6: ['Half a Dozen', 'Six Degrees', 'Sixth Sense', 'The Hexed Cube'],
  7: ['Seventh Heaven', 'Seven League Boots', 'The Seven Sisters', 'Lucky Seven']
};
const D3 = { 1: 1, 2: 1, 3: 2, 4: 2, 5: 3, 6: 4, 7: 5 };
const rng = C.rng(1974);
const seen = new Set();
let n3 = 0;
Object.keys(T3).forEach((dk) => {
  const d = +dk;
  T3[dk].forEach((title) => {
    for (;;) {
      const w = R.randomWalk(rng, d);
      const start = K3.run(K3.solved(), w.join(' '));
      const key = start.join('');
      if (seen.has(key)) continue;
      const r = T.solve(3, start, null, { max: d, nodes: 5e7 });
      if (r.fail || r.len !== d) continue;
      seen.add(key);
      n3++;
      const texts = [
        'This cube is ' + C.plural(d, 'quarter turn') + ' from solved. Find the way back.',
        'Someone gave this cube ' + d + ' quarter turns. Undo them, in as few turns as they took.',
        'Solve it in ' + C.plural(d, 'quarter turn') + ' — no more are needed.'
      ];
      puzzles.push({
        id: 'rubik-s' + String(n3).padStart(3, '0'), title, diff: D3[d], par: d,
        text: texts[n3 % 3],
        hints: d <= 3 ? ['Work backwards: the last turn made is the easiest to see. Look for a face that is nearly whole, with a band of wrong colours along one side.'] : undefined,
        concepts: ['state-space'], tags: ['scramble'],
        data: { n: 3, mode: 'solve', scramble: w.join(' '), solution: K3.fmt(r.moves) }
      });
      break;
    }
  });
});

const T2 = [
  [2, 'Pocket Money'], [3, 'Loose Change'], [3, 'Pocket Watch'], [4, 'Small Talk'], [4, 'Pocket Knife'],
  [5, 'Corner Shop'], [5, 'A Tight Corner'], [6, 'Pocket Book'], [6, 'Corner Stones'], [7, 'Pick Pocket'],
  [7, 'Pocket Square'], [8, 'Out of Pocket'], [8, 'Every Nook'], [9, 'Deep Pockets'], [10, 'The Corner Office'],
  [11, 'Round the Corner'], [12, 'Cornered'], [13, 'Pocket Universe'], [14, 'The Farthest Corner']
];
const D2 = (d) => (d <= 3 ? 1 : d <= 5 ? 2 : d <= 8 ? 3 : d <= 11 ? 4 : 5);
const COUNT2 = [1, 6, 27, 120, 534, 2256, 8969, 33058, 114149, 360508, 930588, 1350852, 782536, 90280, 276];
const rng2 = C.rng(1981);
const dist = T.S2.dist;
let n2 = 0;
T2.forEach(([d, title]) => {
  for (;;) {
    const idx = rng2.int(dist.length);
    if (dist[idx] !== d) continue;
    const start = R.state2FromIndex(K2, idx);
    const key = start.join('');
    if (seen.has(key)) continue;
    const r = T.solve(2, start);
    if (r.fail || r.len !== d) throw new Error('2x2 solve mismatch');
    seen.add(key);
    n2++;
    const sol = r.moves, scr = K2.inverse(sol);
    let text = 'This pocket cube is ' + C.plural(d, 'quarter turn') + ' from solved. Bring it home.';
    if (d >= 11) text += ' Only ' + COUNT2.slice(d).reduce((a, b) => a + b, 0).toLocaleString('en-GB') + ' of the 3,674,160 positions are this far away or farther.';
    if (d === 14) text = 'This pocket cube is one of only 276 positions that are 14 quarter turns from solved — as far as a pocket cube can get. Bring it home.';
    puzzles.push({
      id: 'pocket-s' + String(n2).padStart(3, '0'), title, diff: D2(d), par: d,
      text,
      hints: d <= 3 ? ['Work backwards: find the layer whose four corners belong together but sit one step out of line.'] : undefined,
      concepts: ['state-space'], tags: ['scramble', 'pocket'],
      data: { n: 2, mode: 'solve', scramble: K2.fmt(scr), solution: K2.fmt(sol) }
    });
    break;
  }
});

/* ---------- write ---------- */

puzzles.forEach((p, i) => { p._i = i; });
puzzles.sort((a, b) => a.diff - b.diff || a._i - b._i);
const titles = new Set();
puzzles.forEach((p) => { if (titles.has(p.title)) throw new Error('duplicate title ' + p.title); titles.add(p.title); delete p._i; delete p.n; delete p.scramble; delete p.pattern; });

const lines = [];
lines.push('/* The Puzzle Cabinet · data/rubik.js — made by tools/gen/rubik.js */');
lines.push('Cabinet.concepts([');
lines.push("  { id: 'commutator', name: 'Commutators', see: ['state-space', 'parity', 'rotation-3d'],");
lines.push("    text: 'Do a move X, then a move Y, then X backwards, then Y backwards: X Y X′ Y′. If X and Y touch nothing in common, you are simply back where you began. If they overlap a little, only that little overlap is disturbed and everything else is put back.\\n\\nThat is the trick behind most ways of solving twisty puzzles by hand: a **commutator** moves a few pieces and leaves the rest alone. Cubers call R U R′ U′ the sexy move; do it six times and the cube is solved again.' }");
lines.push(']);');
lines.push('Cabinet.history([');
lines.push("  { year: 1974, title: 'Rubik\\'s cube', text: 'Ernő Rubik, who teaches design in Budapest, makes the first working cube: 26 small cubes that turn about a hidden core. It goes on sale in Hungary in 1977 and around the world from 1980.', links: ['rubik'] },");
lines.push("  { year: 1995, title: 'The superflip needs twenty', text: 'Michael Reid proves that the superflip — every edge of Rubik\\'s cube flipped in place — needs 20 face turns: the first position known to need that many.', links: ['rubik-superflip'] },");
lines.push("  { year: 2010, title: 'God\\'s number is 20', text: 'Tomas Rokicki, Herbert Kociemba, Morley Davidson and John Dethridge show, with a huge computer search, that every position of Rubik\\'s cube can be solved in 20 face turns or fewer.', links: ['rubik'] }");
lines.push(']);');
lines.push('Cabinet.family({');
lines.push("  id: 'rubik', engine: 'rubik', cat: 'mechanical', name: 'Rubik\\'s cube', order: 11,");
lines.push("  blurb: 'Turn the faces of Rubik\\'s cube and its little brother, the 2×2×2 pocket cube: undo short scrambles in the fewest quarter turns, make famous patterns, or race the clock.',");
lines.push("  origin: { year: 1974, who: 'Ernő Rubik', note: 'Ernő Rubik made the first cube in Budapest in 1974. It was sold in Hungary from 1977 as the Magic Cube and around the world from 1980 as Rubik\\'s Cube. The pocket cube is its 2×2×2 version, all corners and no centres.' },");
lines.push("  concepts: ['rotation-3d', 'state-space', 'commutator', 'parity'],");
lines.push("  deps: ['js/lib/twisty.js']");
lines.push('}, [');
const emit = (p) => {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'par', 'text', 'hints', 'explain', 'concepts', 'tags', 'data'].filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
};
puzzles.forEach(emit);
lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/rubik.js'), lines.join('\n') + '\n');
const byDiff = [0, 0, 0, 0, 0, 0];
puzzles.forEach((p) => byDiff[p.diff]++);
console.log('rubik: ' + puzzles.length + ' puzzles (3×3 scrambles ' + n3 + ', 2×2 scrambles ' + n2 + '); by difficulty ' + byDiff.slice(1).join(' / '));
