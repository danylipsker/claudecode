/* The Puzzle Cabinet · tools/gen/logicgrid.js
 *
 *   node tools/gen/logicgrid.js        writes data/logic-grids.js
 *
 * A first grid to learn on, the famous Zebra Puzzle retold, then puzzles made
 * by the engine's generator (engines/logicgrid.js, makePuzzle) with a fixed
 * seed: a random answer, true clues added until only one answer is left,
 * clues that add nothing taken away again, graded by how a careful solver
 * (the same rules the hints use) gets through it.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/logicgrid.js'));
const LG = C.logicgrid;
const eng = C.engines.logicgrid;

const STREET = LG.THEMES.street;

const classics = [
  {
    id: 'grid-first', title: 'A First Grid', diff: 1,
    text: 'Ada, Bram and Clara each keep one pet and each have a favourite drink — no two the same.\n\n**How the grid works.** Each small square pairs one thing with another: the square where the *Ada* row meets the *cat* column asks “does Ada keep the cat?”. Click it once for ✗ (no), twice for ✓ (yes). Every row and every column of a block ends with exactly one ✓. Clue 1 gives you a ✓ straight away — and with **Auto ✗** on, the rest of that row and column cross themselves out.\n\nThe clues are on the card beside the grid. Click a clue to strike it through once you have used it.',
    hints: ['Start with clue 1: tick the cell where Ada meets the cat.', 'Clue 2 crosses out Bram and the dog. Look at the dog column now: who is left?'],
    data: {
      theme: 'pets',
      cats: [
        { n: 'Friend', items: ['Ada', 'Bram', 'Clara'], s: '{x}', p: 'is {x}', np: 'is not {x}' },
        { n: 'Pet', items: ['cat', 'dog', 'parrot'], s: 'the {x} owner', p: 'keeps the {x}', np: 'does not keep the {x}' },
        { n: 'Drink', items: ['tea', 'coffee', 'cocoa'], s: 'the {x} drinker', p: 'drinks {x}', np: 'does not drink {x}' }
      ],
      sol: [[0, 1, 2], [0, 2, 1], [2, 0, 1]],
      clues: [['same', [0, 0], [1, 0]], ['not', [0, 1], [1, 1]], ['same', [1, 1], [2, 1]], ['not', [0, 0], [2, 0]]]
    }
  },
  {
    id: 'grid-zebra', title: 'Who Owns the Zebra?', diff: 5, year: 1962,
    source: 'The “Zebra Puzzle”, printed in *Life International* in December 1962. It is often said to be by Albert Einstein (or by Lewis Carroll), but there is no evidence for either. Retold here in our own words, with musical instruments in place of the original brands of cigarette.',
    text: 'Five houses stand in a row, numbered 1 to 5 from left to right, each painted a different colour. In each lives a man of a different nationality, with his own favourite drink, his own instrument and his own pet.\n\nThe fifteen clues of the original become fourteen here (the first just told you there are five houses). Two things are never mentioned at all: somebody drinks **water**, and somebody keeps a **zebra**.\n\nWho drinks water? Who owns the zebra?',
    hints: [
      'Start with the fixed points: the Norwegian is in house 1 and milk is drunk in house 3.',
      'The Norwegian’s neighbour — house 2 — must be blue. Where can the ivory and green pair go now?',
      'Ivory and green must be houses 4 and 5 (green is not in house 3, where milk is drunk, since green-house people drink coffee).'
    ],
    explain: 'The Norwegian is in house 1, so house 2 is blue. The ivory–green pair cannot use houses 1–3 (house 3 drinks milk, the green house coffee), so they are houses 4 and 5: green is 5, ivory 4, and the Englishman’s red house is 3. House 1 is then yellow, so its owner plays the drum, and his neighbour in house 2 keeps the horse. Working through the drinks and instruments puts the Ukrainian (tea) in house 2, the Spaniard (orange juice, harp, dog) in 4 and the Japanese (coffee, cello) in 5. What is left over answers the question: the **Norwegian drinks water** and the **Japanese owns the zebra**.',
    data: {
      theme: 'zebra', ask: 'Who drinks water, and who owns the zebra?',
      cats: [
        { n: 'House', items: ['1', '2', '3', '4', '5'], ord: 1, s: STREET.key.s, p: STREET.key.p, np: STREET.key.np },
        { n: 'Nationality', items: ['Englishman', 'Spaniard', 'Ukrainian', 'Norwegian', 'Japanese'], s: 'the {x}', p: 'is the {x}', np: 'is not the {x}' },
        { n: 'Colour', items: ['red', 'green', 'ivory', 'yellow', 'blue'], s: 'the owner of the {x} house', p: 'lives in the {x} house', np: 'does not live in the {x} house' },
        { n: 'Drink', items: ['coffee', 'tea', 'milk', 'orange juice', 'water'], s: 'the {x} drinker', p: 'drinks {x}', np: 'does not drink {x}' },
        { n: 'Instrument', items: ['violin', 'drum', 'flute', 'harp', 'cello'], s: 'the {x} player', p: 'plays the {x}', np: 'does not play the {x}' },
        { n: 'Pet', items: ['dog', 'snails', 'fox', 'horse', 'zebra'], s: 'the owner of the {x}', p: 'keeps the {x}', np: 'does not keep the {x}' }
      ],
      pos: Object.assign({}, STREET.pos),
      sol: [[0, 1, 2, 3, 4], [3, 2, 0, 1, 4], [3, 4, 0, 2, 1], [4, 1, 2, 3, 0], [1, 2, 0, 3, 4], [2, 3, 1, 0, 4]],
      clues: [
        ['same', [1, 0], [2, 0]], ['same', [1, 1], [5, 0]], ['same', [3, 0], [2, 1]], ['same', [1, 2], [3, 1]], ['imm', [2, 2], [2, 1]],
        ['same', [4, 0], [5, 1]], ['same', [4, 1], [2, 3]], ['same', [3, 2], [0, 2]], ['same', [1, 3], [0, 0]], ['next', [4, 2], [5, 2]],
        ['next', [4, 1], [5, 3]], ['same', [4, 3], [3, 3]], ['same', [1, 4], [4, 4]], ['next', [1, 3], [2, 4]]
      ],
      words: [
        'The Englishman’s house is the red one.', 'A dog lives with the Spaniard.', 'Whoever lives in the green house drinks coffee.', 'Tea is the Ukrainian’s drink.',
        'Going from left to right, the ivory house comes immediately before the green one.', 'The snails belong to the violinist.', 'The yellow house is home to the drummer.',
        'In the middle house they drink milk.', 'The Norwegian’s house is the first on the left.', 'The flautist and the owner of the fox are next-door neighbours.',
        'The horse is kept next door to the drummer.', 'Orange juice is what the harpist drinks.', 'The Japanese is the cellist.', 'The blue house is next door to the Norwegian.'
      ]
    }
  }
];

// how many generated puzzles at each level
const QUOTA = { 1: 16, 2: 18, 3: 18, 4: 14, 5: 12 };
const rng = C.rng(19621217);
const themeIds = Object.keys(LG.THEMES);
const usedTitles = new Set(classics.map((c) => c.title));
const titleAt = {};
themeIds.forEach((t) => { titleAt[t] = 0; });
function nextTitle(tid) {
  const list = LG.THEMES[tid].titles;
  while (titleAt[tid] < list.length) { const t = list[titleAt[tid]++]; if (!usedTitles.has(t)) { usedTitles.add(t); return t; } }
  return null;
}
const gen = [];
const seen = new Set();
let turn = 0;
for (let level = 1; level <= 5; level++) {
  let got = 0, guard = 0;
  while (got < QUOTA[level] && guard++ < 300) {
    // take the themes in turn, skipping any that has run out of titles
    let tid = null;
    for (let k = 0; k < themeIds.length && !tid; k++) { const t = themeIds[(turn + k) % themeIds.length]; if (titleAt[t] < LG.THEMES[t].titles.length) tid = t; }
    if (!tid) throw new Error('out of titles');
    const r = LG.makePuzzle(rng, level, tid, 'x');
    if (!r) continue;
    const key = JSON.stringify(r.data.clues) + JSON.stringify(r.data.cats.map((c) => c.items));
    if (seen.has(key)) continue;
    seen.add(key);
    r.title = nextTitle(tid);
    turn++;
    gen.push(r);
    got++;
  }
  if (got < QUOTA[level]) console.warn('only ' + got + ' of ' + QUOTA[level] + ' at level ' + level);
}
gen.sort((a, b) => a.diff - b.diff || a.cost - b.cost);

const lines = [];
lines.push('/* The Puzzle Cabinet · data/logic-grids.js — made by tools/gen/logicgrid.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'logic-grids', engine: 'logicgrid', cat: 'logic', name: 'Logic grids', order: 2,");
lines.push("  blurb: 'Who lives where, keeps what and drinks which? Cross out and tick the cells of the classic triangular grid until only one answer is left — the Zebra Puzzle and many more.',");
lines.push("  origin: { year: 1962, who: 'The Zebra Puzzle and its descendants', note: 'The best-known of these puzzles appeared in *Life International* in 1962 and is still (without evidence) credited to Einstein. Puzzle magazines of the 1970s and 80s — Dell and Penny Press above all — made the triangular answer grid famous. Every puzzle here has exactly one answer, checked by a solver, and was graded by working it the way the hints do.' },");
lines.push("  concepts: ['deduction']");
lines.push('}, [');
const emit = (p) => {
  const keys = Object.keys(p).filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
};
const all = [];
classics.forEach((c) => all.push(Object.assign({ concepts: ['deduction'], tags: ['classic'] }, c)));
gen.forEach((r, i) => all.push({ id: 'grid-' + String(i + 1).padStart(3, '0'), title: r.title, diff: r.diff, text: r.text, data: r.data, tags: [r.theme], _cost: r.cost }));
all.sort((a, b) => a.diff - b.diff || (a._cost == null ? -1 : 0) - (b._cost == null ? -1 : 0) || (a._cost || 0) - (b._cost || 0));
let bad = 0;
all.forEach((p) => {
  const v = eng.verify(p);
  if (!v.ok) { bad++; console.error('FAILS ' + p.id + ': ' + v.err); }
  delete p._cost;
  emit(p);
});
lines.push(']);');
const out = lines.join('\n') + '\n';
fs.writeFileSync(path.join(ROOT, 'data/logic-grids.js'), out);
const byDiff = [1, 2, 3, 4, 5].map((d) => all.filter((p) => p.diff === d).length);
console.log('logic-grids: ' + classics.length + ' classics + ' + gen.length + ' generated = ' + all.length + '; by difficulty ' + byDiff.join('/') + '; ' + Math.round(out.length / 1024) + ' KB' + (bad ? '; ' + bad + ' FAIL' : ''));
// how the classics grade
classics.forEach((c) => { const g = LG.grade(c.data, { maxTrials: 8, budget: 60 }); console.log('  ' + c.id + ': ' + (g ? 'cost ' + g.cost.toFixed(1) + ', trials ' + g.trials : 'the rules alone do not finish it')); });
