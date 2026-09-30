/* The Puzzle Cabinet · tools/gen/hackenbush.js
 *
 *   node tools/gen/hackenbush.js     writes data/hackenbush.js
 *
 * Lessons first (cut from the top, a stalk worth a half, Nim in green, the
 * colon principle), then the pictures — a flower, a girl, a house, a dog —
 * coloured so that exactly one cut (or very few) wins, then positions from
 * the engine's own generator at each level. Every start is checked by
 * engines/hackenbush.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/duel.js'));
require(path.join(ROOT, 'engines/hackenbush.js'));
const H = C.hackenbushLogic;
const E = C.engines.hackenbush;
const S = H.SHAPES;

const out = [];
const titles = new Set();
const keys = new Set();
function add(p) {
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (titles.has(p.title)) throw new Error('duplicate title ' + p.title);
  const k = JSON.stringify([p.data.v, p.data.e, p.data.first]);
  if (keys.has(k)) return false;
  keys.add(k);
  titles.add(p.title);
  out.push(p);
  return true;
}
// colour a list of shapes from strings of b/r, one per shape
const paint = (kind, list, cols) => H.compose(kind, list, (k, j) => cols[k][j]);

// the best colouring of some shapes: a win for you with as few winning cuts as possible, and a small value
function bestColouring(list, seed, opts) {
  opts = opts || {};
  const rng = C.rng(seed);
  let best = null, bs = Infinity;
  for (let t = 0; t < (opts.tries || 1500); t++) {
    const pb = opts.pBlue || 0.35 + 0.3 * rng();
    const d = H.compose('br', list, () => (rng() < pb ? 'b' : 'r'));
    if (opts.first) d.first = opts.first;
    if (H.checkData(d)) continue;
    const G = H.graphOf(d), s0 = H.prune(G, G.all), T = H.total(G, s0);
    if (d.first === 'cpu' ? T !== 0 : T <= 0) continue;
    const q = H.quality(d);
    if (!q.W || q.M < 3) continue;
    const sc = (q.W / q.M) * 30 + Math.abs(q.T) * 4 - q.M * 0.5;
    if (sc < bs) { bs = sc; best = d; }
  }
  return best;
}

/* ---------- lessons ---------- */

add({ id: 'hb-from-the-top', title: 'Cut from the Top', diff: 1,
  text: 'A blue stalk of two edges and a red stalk of one. You are **Blue**: cut one blue edge in each turn; I cut red ones. Whatever is no longer joined to the ground falls. Whoever has nothing of their own colour left to cut loses. You cut first.',
  hints: ['Cutting a blue edge near the ground wastes the blue edges above it.', 'Cut the top blue edge. Then we each have one edge, and it is my turn.'],
  explain: 'Cut the **top** blue edge. Now each of us has one edge and it is my turn: I cut mine, you cut yours, and I have nothing left. Cutting the bottom blue edge instead would throw away both of yours at once. In Blue-Red Hackenbush a blue edge standing on the ground is worth +1 and a red one −1: this position is worth 2 − 1 = +1, a win for Blue.',
  concepts: ['game-values'], tags: ['blue-red', 'stalks'],
  data: paint('br', [S.stalk(2), S.stalk(1)], ['bb', 'r']) });
add({ id: 'hb-half', title: 'Half a Move', diff: 1,
  text: 'Two stalks, each a blue edge with a red edge on top, and one red edge on its own. You are Blue. This time **I** cut first.',
  hints: ['A blue edge carrying a red one is worth half a move to Blue: +½.', 'Two halves and a whole red edge make exactly 0 — and in a position worth 0, whoever moves first loses.'],
  explain: 'Each blue-under-red stalk is worth **+½**: Blue can kill it at once by cutting the base, but Red can only shorten it to a single blue edge (+1). Two of them are worth +1, the red edge −1: the total is **0**, and a zero position is lost for whoever moves first. Answer each of my cuts by keeping the total at 0 or above.',
  concepts: ['game-values'], tags: ['blue-red', 'second player'],
  data: Object.assign(paint('br', [S.stalk(2), S.stalk(2), S.stalk(1)], ['br', 'br', 'r']), { first: 'cpu' }) });
add({ id: 'hb-sign-expansion', title: 'Reading a Stalk', diff: 2,
  text: 'A tall stalk coloured blue, blue, red, blue from the ground up, beside two red stalks. You are Blue and cut first.',
  hints: ['Read the tall stalk from the ground up: 1 + 1, then −½ once the colour changes, then +¼. It is worth 1¾.', 'The red stalk is worth −1, and the red-then-blue one −1 + ½ = −½. The total is ¼ — only just above zero.', 'Keep the total at 0 or more: cut the top blue edge, which costs you exactly ¼.'],
  explain: 'The tall stalk is worth 1 + 1 − ½ + ¼ = **1¾** (each edge after the first change of colour counts half as much as the one below). The red stalks are worth −1 and −½ (red then blue: −1 + ½). The total is **+¼**, so Blue wins — but only by cutting the top blue edge, which lowers the total by exactly ¼ to 0. Any other blue cut costs more and leaves the total below zero.',
  concepts: ['game-values'], tags: ['blue-red', 'stalks'],
  data: paint('br', [S.stalk(4), S.stalk(1), S.stalk(2)], ['bbrb', 'r', 'rb']) });
add({ id: 'hb-green-nim', title: 'Nim in Green', diff: 1,
  text: 'Three green stalks of 2, 3 and 4 edges. Either of us may cut **any** edge; whatever loses touch with the ground falls. Whoever has nothing left to cut loses. You cut first.',
  hints: ['Cutting the k-th edge of a stalk leaves k − 1 edges: a green stalk is a heap of Nim.', 'Nim-sum: 2 ⊕ 3 ⊕ 4 = 5. Make it 0: the stalk of 4 should become 1.'],
  explain: 'A green stalk of n edges behaves exactly like a Nim heap of n: cutting its k-th edge leaves k − 1. So this is Nim with heaps 2, 3 and 4. Their nim-sum is 2 ⊕ 3 ⊕ 4 = 5; cut the **second** edge of the tallest stalk, leaving 2, 3 and 1, whose nim-sum is 0.',
  concepts: ['nim-sum'], links: ['nim-three-four-five'], tags: ['green', 'nim'],
  data: paint('green', [S.stalk(2), S.stalk(3), S.stalk(4)], ['gg', 'ggg', 'gggg']) });
add({ id: 'hb-colon', title: 'The Colon Principle', diff: 2,
  text: 'A green tree — a trunk that forks into a short branch and a long one — beside a green stalk of three. Either of us may cut any edge. You cut first.',
  hints: ['At a fork, the branches above combine like Nim heaps: 1 ⊕ 2 = 3. With the trunk below, the tree is worth a stalk of 1 + 3 = 4.', 'Tree 4, stalk 3: nim-sum 7. Make the tree worth 3: cut off the short branch.'],
  explain: 'The **colon principle**: branches meeting at a fork may be replaced by a single stalk as long as their nim-sum. The branches 1 and 2 become a stalk of 3, which stands on the trunk: the tree is worth a stalk of 4. With the stalk of 3 the nim-sum is 4 ⊕ 3 = 7. Cut off the short branch: the tree becomes a stalk of 1 + 2 = 3, and 3 ⊕ 3 = 0.',
  concepts: ['nim-sum', 'game-values'], tags: ['green', 'tree'],
  data: paint('green', [S.fork(1, 1, 2), S.stalk(3)], ['gggg', 'ggg']) });

/* ---------- pictures ---------- */

const pics = [
  ['hb-flower', 'The Flower', 3, [S.flower(2, 4, 1), S.stalk(2)], 'A flower of blue and red — a stem, a leaf and four petals (the loops) — beside a garden cane. Cutting a loop brings down nothing else; cutting the stem brings down the whole head.', 11, ['the flower', 'the cane']],
  ['hb-girl', 'The Girl', 3, [S.stalk(2), S.girl()], 'A little girl stands beside a lamp post: two legs, a body, two arms, a neck and a round head.', 12, ['the lamp post', 'the girl']],
  ['hb-windmill', 'The Windmill', 3, [S.windmill(), S.stalk(2)], 'A windmill with four sails, and a tall fence post beside it.', 13, ['the windmill', 'the fence post']],
  ['hb-house', 'The House', 4, [S.house(true)], 'A house with a door and a chimney. It stands on four feet — the walls and the door posts — so it takes more than one cut to bring anything down.', 14],
  ['hb-dog', 'The Dog', 4, [S.dog()], 'A dog: four legs, a back, a tail and a head.', 15],
  ['hb-cactus', 'The Cactus', 4, [S.cactus(), S.stalk(2)], 'A cactus with two arms, beside a young one.', 16, ['the cactus', 'the young cactus']],
  ['hb-garden', 'The Garden', 5, [S.flower(2, 3, 1), S.tree2(), S.girl()], 'A garden: a flower, a tree and a girl.', 17]
];
pics.forEach(([id, title, diff, list, what, seed, names]) => {
  const d = bestColouring(list, 700 + seed);
  d.names = names || (list.length === 1 ? ['the ' + list[0].name] : d.names);
  const G = H.graphOf(d), s0 = H.prune(G, G.all);
  const q = H.quality(d);
  add({ id, title, diff,
    text: what + ' You are **Blue**: cut one blue edge in each turn; I cut red ones. Everything no longer joined to the ground falls away. Whoever has nothing left to cut loses. You cut first.',
    hints: ['Hackenbush positions are worth numbers that add up. Is this drawing worth more than 0 to you?', 'Only ' + (q.W === 1 ? 'one of your ' + q.M + ' possible cuts wins' : q.W + ' of your ' + q.M + ' possible cuts win') + '. Keep the total value at 0 or more after your cut.'],
    concepts: ['game-values'], tags: ['blue-red', 'picture'],
    data: d });
});
{
  const list = [S.girl(), S.house(false)];
  const d = H.compose('green', list, () => 'g');
  add({ id: 'hb-green-house', title: 'The Green House', diff: 4,
    text: 'A girl and her house, all in green: either of us may cut any edge. Cycles make these pictures harder to value — but every one of them is still worth a Nim heap. You cut first.',
    hints: ['Value each picture as a Nim heap, then make the nim-sum 0.', 'The fusion principle: the girl\'s legs and the ground make a cycle, and the house walls another.'],
    concepts: ['nim-sum', 'game-values'], tags: ['green', 'picture'], data: d });
}
{
  // the two posts that leave the fewest winning cuts
  let d = null, bs = Infinity;
  for (let a = 1; a <= 4; a++) for (let b = a; b <= 4; b++) {
    const t = H.compose('green', [S.dog(), S.stalk(a), S.stalk(b)], () => 'g');
    const G = H.graphOf(t);
    if (!H.wins(G, H.prune(G, G.all), 'you')) continue;
    const q = H.quality(t);
    if (q.W / q.M < bs) { bs = q.W / q.M; d = t; }
  }
  add({ id: 'hb-green-dog', title: 'The Green Dog', diff: 4,
    text: 'A green dog and two green posts. Either of us may cut any edge. ' + (d.first === 'cpu' ? 'I cut first.' : 'You cut first.'),
    hints: ['Value the dog as a Nim heap: its four legs and back form cycles with the ground.', 'Then play Nim with the dog and the two posts.'],
    concepts: ['nim-sum', 'game-values'], tags: ['green', 'picture'], data: d });
}

/* ---------- from the generator ---------- */

const want = { 1: 8, 2: 8, 3: 8, 4: 8, 5: 8 };
const have = {};
out.forEach((p) => { have[p.diff] = (have[p.diff] || 0) + 1; });
let n = 0;
for (let lv = 1; lv <= 5; lv++) {
  for (let seed = 1; (have[lv] || 0) < want[lv] && seed < 3000; seed++) {
    const green = seed % 5 < 2;
    const g = H.generate(C.rng(31000 + lv * 1000 + seed), lv, green);
    if (!g) continue;
    let title = g.title;
    for (let k = 2; titles.has(title); k++) title = g.title + ' ' + ['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][k];
    const p = { id: 'hb-' + String(n + 1).padStart(3, '0'), title, diff: lv, text: g.text, concepts: [g.d.kind === 'green' ? 'nim-sum' : 'game-values'], tags: [g.d.kind === 'green' ? 'green' : 'blue-red'].concat(g.d.first ? ['second player'] : []), data: g.d };
    if (!add(p)) continue;
    n++;
    have[lv] = (have[lv] || 0) + 1;
  }
}
out.sort((a, b) => a.diff - b.diff);

const meta = {
  id: 'hackenbush', engine: 'hackenbush', cat: 'games', name: 'Hackenbush', order: 20,
  blurb: 'Drawings of coloured edges on the ground. Cut an edge and whatever hangs from it falls. Blue against red, or green for anyone — find the cut that wins.',
  origin: { year: 1976, who: 'John H. Conway', note: 'Conway\'s game of cutting down drawings is the showcase of his theory of games as numbers, set out in *On Numbers and Games* (1976) and in *Winning Ways for your Mathematical Plays* (1982), written with Elwyn Berlekamp and Richard Guy.' },
  concepts: ['game-values', 'nim-sum']
};
const concept = { id: 'game-values', name: 'Games as numbers', see: ['nim-sum', 'working-backwards'],
  text: 'In some games every position has a **value** that tells who wins: positive, Left (Blue) wins whoever starts; negative, Right (Red) wins; zero, whoever moves second wins. Better still, when a position is made of separate parts, their values simply add. A blue edge on the ground is worth +1, a red one −1; a blue edge with a red one on top is worth +½, because Blue can remove it in one move while Red needs two to get rid of the blue. John Conway built the whole theory of “surreal numbers” from games like these. In games where both players have the same moves, the values are Nim heaps instead, added by nim-sum.' };

let s = '/* The Puzzle Cabinet · data/hackenbush.js — made by tools/gen/hackenbush.js */\n';
s += 'Cabinet.concepts([' + JSON.stringify(concept) + ']);\n';
s += 'Cabinet.family(' + JSON.stringify(meta) + ', [\n';
s += out.map((p) => '  ' + JSON.stringify(p)).join(',\n');
s += '\n]);\n';
fs.writeFileSync(path.join(ROOT, 'data/hackenbush.js'), s);
const by = {}, kinds = {};
out.forEach((p) => { by[p.diff] = (by[p.diff] || 0) + 1; kinds[p.data.kind] = (kinds[p.data.kind] || 0) + 1; });
console.log('data/hackenbush.js: ' + out.length + ' puzzles', JSON.stringify(by), JSON.stringify(kinds), (s.length / 1024).toFixed(0) + ' KB');
