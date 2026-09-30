/* The Puzzle Cabinet · tools/gen/chomp.js
 *
 *   node tools/gen/chomp.js     writes data/chomp.js
 *
 * A few classic positions first (two rows, the L, the square, the first
 * rectangles that need a search), then positions made by the engine's own
 * generator at each level. Every start is checked by engines/chomp.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/duel.js'));
require(path.join(ROOT, 'engines/chomp.js'));
const K = C.chompGame;
const E = C.engines.chomp;

const out = [];
const seen = new Set();
const titles = new Set();
function add(p) {
  const key = JSON.stringify(p.data.rows) + (p.data.first || '');
  if (seen.has(key)) return false;
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  seen.add(key);
  if (titles.has(p.title)) throw new Error('duplicate title ' + p.title);
  titles.add(p.title);
  out.push(p);
  return true;
}
const rect = (h, w) => new Array(h).fill(w);

add({ id: 'chomp-four', title: 'Four Squares', diff: 1,
  text: 'The smallest bar worth playing: two rows of two squares. The bottom-left square is poisoned. You bite first.',
  hints: ['After your bite, what would you like me to be facing?', 'Leave me the poison with exactly one square beside it and one above it.'],
  explain: 'Bite off the top-right square. I am left with an L of three: the poison and two single squares. Whichever of the two I eat, you eat the other — and I must eat the poison.',
  concepts: ['symmetry'], tags: ['2 × 2', 'classic'], data: { rows: [2, 2] } });
add({ id: 'chomp-long-row', title: 'One Long Row', diff: 1,
  text: 'A single row of seven squares, poison at the left end. You bite first.',
  hints: ['A bite takes a square and everything to its right.'],
  explain: 'Bite off the square next to the poison: that takes all six good squares at once, and I am left with the poison alone.',
  tags: ['row'], data: { rows: [7] } });
add({ id: 'chomp-two-by-four', title: 'Two Rows of Four', diff: 1,
  text: 'Two rows of four squares. You bite first.',
  hints: ['Try to leave me a bottom row that is exactly one square longer than the top row.', 'Bite off the top-right square: 4 and 3.'],
  explain: 'With two rows, the positions to leave your opponent are those where the bottom row is one square longer than the top: 2 and 1, 3 and 2, 4 and 3… If I bite the top row, you shorten the bottom row to match; if I bite the bottom row, you cut the top to one less. Start by biting the top-right square.',
  concepts: ['working-backwards'], tags: ['two rows'], data: { rows: [4, 4] } });
add({ id: 'chomp-l-shape', title: 'The Crooked L', diff: 1,
  text: 'Only an L is left: the poison, four squares to its right and two squares above it. You bite first.',
  hints: ['Think of the two arms as two rows of matches in Nim.', 'Make the arms equal.'],
  explain: 'Bite off the two right-most squares, leaving two arms of two. Then copy me: whatever I take from one arm, take from the other. The arms stay equal, so I am the one who runs out.',
  concepts: ['symmetry'], tags: ['L'], data: { rows: [5, 1, 1] } });
add({ id: 'chomp-three-square', title: 'The Little Square', diff: 1,
  text: 'A square bar, three by three. You bite first.',
  hints: ['A square board has a symmetry. Can you make it an L with equal arms?', 'Bite the square diagonally next to the poison.'],
  explain: 'Bite the square at column 2, row 2: it takes the whole top-right block of four and leaves an L with arms of two and two. Then copy my bites on the other arm. The same works on every square bar: the **L strategy**.',
  concepts: ['symmetry'], tags: ['square', 'classic'], data: { rows: [3, 3, 3] } });
add({ id: 'chomp-six-two', title: 'Six and Two', diff: 2,
  text: 'Two rows: six squares at the bottom and two above. You bite first.',
  hints: ['The formula for two rows: leave me a bottom row one longer than the top.', 'The top row has 2 — so the bottom should have 3.'],
  explain: 'Bite the bottom row at column 4 (taking three squares), leaving 3 and 2. From there every bite of mine can be answered by restoring “bottom one longer than top”.',
  concepts: ['working-backwards'], tags: ['two rows'], data: { rows: [6, 2] } });
add({ id: 'chomp-five-square', title: 'A Square of Twenty-Five', diff: 2,
  text: 'A square bar, five by five. You bite first.',
  hints: ['Does the trick of [[chomp-three-square]] still work?', 'Leave an L with two arms of four.'],
  explain: 'Bite at column 2, row 2, leaving an L with arms of four and four, then copy each of my bites on the other arm.',
  concepts: ['symmetry'], tags: ['square'], links: ['chomp-three-square'], data: { rows: [5, 5, 5, 5, 5] } });
add({ id: 'chomp-tall-pair', title: 'Two Tall Columns', diff: 2,
  text: 'Two columns, the left one six squares tall and the right one four. You bite first.',
  hints: ['This is the two-row game turned on its side.', 'Leave the left column one square taller than the right.'],
  explain: 'Turned on its side this is two rows of 6 and 4. Bite the left column at row 6 (just the top square), leaving 5 and 4.',
  concepts: ['working-backwards'], tags: ['two columns'], links: ['chomp-two-by-four'], data: { rows: [2, 2, 2, 2, 1, 1] } });
add({ id: 'chomp-three-by-four', title: 'Three Rows of Four', diff: 3,
  text: 'A bar of three rows of four. No formula helps now — but there is a winning first bite, and only one. You bite first.',
  hints: ['There are eleven possible bites; ten of them lose.', 'The winning bite takes four squares from the top two rows.'],
  explain: 'Bite at column 3, row 2: that leaves rows of 4, 2 and 2 — a position from which every bite of mine lets you back into a lost one for me. The search finds it; no pattern explains it.',
  concepts: ['working-backwards'], tags: ['rectangle'], data: { rows: [4, 4, 4] } });
add({ id: 'chomp-steal', title: 'The Stolen Strategy', diff: 3,
  text: 'Three rows of five. Before you play: can you prove, without finding it, that a winning first bite must exist? Then find it.',
  hints: ['Suppose biting only the top-right square lost. What would that tell you about my answer?', 'The winning bite is small: only two squares, from the top row.'],
  explain: 'If biting only the top-right square lost, I would have a winning reply to it. But any bite also takes the top-right square, so that reply was a legal first move for you — and it would win. So a winning first bite exists for every full rectangle (the **strategy-stealing** argument). Here it is at column 4, row 3: just the last two squares of the top row.',
  concepts: ['strategy-stealing', 'working-backwards'], tags: ['rectangle', 'proof'], data: { rows: [5, 5, 5] } });
add({ id: 'chomp-my-bite', title: 'After You, Please', diff: 3,
  text: 'This time I bite first, from a nibbled bar with rows of 5, 3 and 2 squares — a position I cannot win. Answer every bite correctly.',
  hints: ['After my bite, look for the answer that leaves me a lost position again.'],
  concepts: ['working-backwards'], tags: ['second player'], data: { rows: [5, 3, 2], first: 'cpu' } });

// the rest from the generator, level by level
const want = { 1: 7, 2: 7, 3: 6, 4: 5, 5: 5 };
const have = {};
out.forEach((p) => { have[p.diff] = (have[p.diff] || 0) + 1; });
let n = 0;
for (let lv = 1; lv <= 5; lv++) {
  for (let seed = 1; (have[lv] || 0) < want[lv] && seed < 4000; seed++) {
    const g = E.generate(C.rng(9100 + lv * 1000 + seed), lv);
    if (!g) continue;
    if (titles.has(g.title)) continue;
    const id = 'chomp-' + String(++n).padStart(3, '0');
    const p = { id, title: g.title, diff: lv, text: g.text, concepts: ['working-backwards'], tags: g.data.first ? ['second player'] : [], data: g.data };
    if (!add(p)) { n--; continue; }
    have[lv] = (have[lv] || 0) + 1;
  }
}
out.sort((a, b) => a.diff - b.diff);

const meta = {
  id: 'chomp', engine: 'chomp', cat: 'games', name: 'Chomp', order: 21,
  blurb: 'A bar of chocolate with a poisoned corner. Bite a square and everything above and to its right; whoever eats the poison loses.',
  origin: { year: 1974, who: 'David Gale', note: 'David Gale described the chocolate-bar game in 1974; an equivalent game about the divisors of a number had been studied earlier by the Dutch mathematician Frederik Schuh. The first player always wins a full rectangle — yet for most rectangles nobody knows a rule for the winning bite.' },
  concepts: ['working-backwards', 'symmetry', 'strategy-stealing']
};

const concept = { id: 'strategy-stealing', name: 'Strategy stealing', see: ['working-backwards'],
  text: 'A way to prove that the first player can win a game without saying how. Suppose the second player had a winning strategy. If the first player can make a “free” opening move that never hurts, and then pretend to be the second player, they could use that strategy themselves — so the second player cannot have one after all. It proves the first player wins Chomp on any full rectangle and Hex on any board, while the winning moves stay hidden.' };

let s = '/* The Puzzle Cabinet · data/chomp.js — made by tools/gen/chomp.js */\n';
s += 'Cabinet.concepts([' + JSON.stringify(concept) + ']);\n';
s += 'Cabinet.family(' + JSON.stringify(meta) + ', [\n';
s += out.map((p) => '  ' + JSON.stringify(p)).join(',\n');
s += '\n]);\n';
fs.writeFileSync(path.join(ROOT, 'data/chomp.js'), s);
const by = {};
out.forEach((p) => { by[p.diff] = (by[p.diff] || 0) + 1; });
console.log('data/chomp.js: ' + out.length + ' puzzles', JSON.stringify(by));
