/* The Puzzle Cabinet · tools/gen/mobiles.js
 *
 *   node tools/gen/mobiles.js     writes data/mobiles.js
 *
 * Three gentle introductions, then mobiles made by the engine's generator
 * with fixed seeds. Every one has exactly one answer (checked by the
 * engine's exact solver).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/mobiles.js'));
const M = C.mobileSolver;
const eng = C.engines.mobiles;

const intro = [
  {
    id: 'mb-first', title: 'The First Balance', diff: 1,
    text: 'A rod hangs from a string. A weight of **6** hangs 3 units to the right of the string. What must hang 2 units to the left for the rod to hang level?',
    data: { tree: [[-2, 0], [3, 6]] },
    hints: ['A weight far from the string turns the rod more than the same weight close in.', 'Weight × distance: 6 × 3 on the right.'],
    explain: '6 × 3 = 18 on the right, so the left needs 18 ÷ 2 = **9**. This is Archimedes\' law of the lever: a beam balances when weight × distance is the same on both sides.',
    concepts: ['torque']
  },
  {
    id: 'mb-two-levels', title: 'A Mobile Within a Mobile', diff: 1,
    text: 'A small mobile hangs from the end of a bigger one. Everything hanging from a point counts with its whole weight. Find the two missing weights.',
    data: { tree: [[-1, 0], [2, [[-1, 4], [1, 0]]]] },
    hints: ['Start at the bottom: the little rod has 4 on one side, at the same distance as the blank.', 'The little mobile then weighs 8 in all, hanging 2 units out.'],
    explain: 'The little rod: 4 × 1 = ? × 1, so the blank is **4** and the little mobile weighs 8. The top rod: ? × 1 = 8 × 2, so the other blank is **16**.',
    concepts: ['torque'], links: ['mb-first']
  },
  {
    id: 'mb-only-total', title: 'Only the Total', diff: 2,
    text: 'Not one weight is shown — only that the whole mobile weighs **36**. Every weight is a whole number. What are they?',
    data: { tree: [[-2, 0], [1, [[-1, 0], [2, 0]]]], total: 36 },
    hints: ['Call the smallest weight b and write the others in terms of it.', 'The little rod needs a = 2b; the top rod then needs 2x = 3b.'],
    explain: 'Little rod: a × 1 = b × 2, so a = 2b and the little mobile weighs 3b. Top rod: x × 2 = 3b × 1, so x = 1.5b. Altogether 1.5b + 3b = 4.5b = 36, so b = 8, a = 16 and x = 12.',
    concepts: ['torque']
  }
];

// names for the mobiles: things that hang, float or fly
const NOUNS = ['Kite', 'Lantern', 'Sparrow', 'Comet', 'Chime', 'Feather', 'Moth', 'Cloud', 'Planet', 'Moon', 'Star', 'Raindrop', 'Acorn', 'Pine Cone', 'Seashell', 'Minnow', 'Whale', 'Owl', 'Swallow', 'Leaf', 'Snowflake', 'Dragonfly', 'Balloon', 'Bell', 'Bubble', 'Heron', 'Orchard', 'Sail', 'Firefly', 'Tern', 'Pendulum', 'Galaxy', 'Nebula', 'Maple Seed', 'Paper Crane', 'Zeppelin', 'Weathervane', 'Dandelion', 'Rainbow', 'Hummingbird'];
const ADJS = ['Little', 'Golden', 'Quiet', 'Spinning', 'Crooked', 'Drifting', 'Silver', 'Sleepy', 'Windy', 'Humming', 'Tipsy', 'Patient', 'Stubborn', 'Dancing', 'Lopsided'];

function build() {
  const out = intro.map((p) => {
    const F = M.flatten(p.data.tree);
    const r = M.solve(F, M.optsOf(p.data, F), 2);
    p.data.sol = r.sols[0];
    p.goal = 'Every rod level.';
    const v = eng.verify(p);
    if (!v.ok) throw new Error(p.id + ': ' + v.err);
    return p;
  });
  const want = [0, 20, 28, 30, 24, 18];
  const seen = new Set();
  const titles = new Set(out.map((p) => p.title));
  const rng0 = C.rng(424242);
  const gen = [];
  for (let level = 1; level <= 5; level++) {
    let got = 0;
    for (let seed = 1; got < want[level] && seed < 5000; seed++) {
      const rng = C.rng(50000 + level * 1000 + seed);
      const v = eng.generate(rng, level, { id: 'mobiles' });
      if (!v) continue;
      const key = JSON.stringify(v.data.tree) + JSON.stringify(v.data.tiles || null);
      if (seen.has(key)) continue;
      seen.add(key);
      let title;
      for (let k = 0; k < 50; k++) { title = 'The ' + rng0.pick(ADJS) + ' ' + rng0.pick(NOUNS); if (!titles.has(title)) break; }
      if (titles.has(title)) continue;
      titles.add(title);
      gen.push({ title, diff: level, text: v.text, goal: v.goal, data: v.data, concepts: ['torque'] });
      got++;
    }
  }
  gen.forEach((p, i) => {
    p.id = 'mb-' + String(i + 1).padStart(3, '0');
    const v = eng.verify(p);
    if (!v.ok) throw new Error(p.id + ': ' + v.err);
  });
  return out.concat(gen.map((p) => Object.assign({ id: p.id }, p)));
}

const list = build();
const lines = ['/* The Puzzle Cabinet · data/mobiles.js — made by tools/gen/mobiles.js */', 'Cabinet.family(' + JSON.stringify({
  id: 'mobiles', engine: 'mobiles', cat: 'measure', name: 'Mobiles', order: 4,
  blurb: 'Hanging mobiles with missing weights: make every rod hang level.',
  origin: { year: -250, who: 'Archimedes', note: 'The rule behind every mobile — weight times distance, the same on both sides — is Archimedes\' law of the lever. Hanging mobiles as art are Alexander Calder\'s, from the 1930s; as puzzles they are a modern favourite.' },
  concepts: ['torque', 'working-backwards']
}, null, 1).replace(/\n\s*/g, ' ') + ', ['];
list.forEach((p, i) => {
  const keys = Object.keys(p).filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < list.length - 1 ? ',' : ''));
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/mobiles.js'), lines.join('\n') + '\n');
const spread = [1, 2, 3, 4, 5].map((d) => list.filter((p) => p.diff === d).length).join('/');
console.log('mobiles: ' + list.length + ' (' + spread + '), ' + Math.round(fs.statSync(path.join(ROOT, 'data/mobiles.js')).size / 1024) + ' KB');
