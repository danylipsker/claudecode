/* The Puzzle Cabinet · tools/gen/pulleys.js
 *
 *   node tools/gen/pulleys.js     writes data/pulleys.js
 *
 * A handful of classics (Archimedes' lever, his pulleys, the see-saw, the
 * movable-pulley trap), then levers, crowbars, tackles, balances and winches
 * made by the engine's generator (engines/pulleys.js), easiest first. Every
 * answer is computed by the engine and checked by its verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/mech.js'));
require(path.join(ROOT, 'engines/pulleys.js'));
const L = C.pulleysLib, E = C.engines.pulleys;

const out = [];
const titles = new Set();
function push(p) {
  const s = L.solve(p.data);
  if (s.err) throw new Error(p.id + ': ' + s.err);
  if (p.data.ans === undefined && s.kind !== 'place') p.data.ans = s.v;
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (r.warn) console.warn('  ! ' + p.id + ': ' + r.warn);
  titles.add(p.title);
  out.push(p);
}

/* ---------- classics ---------- */

push({ id: 'pl-seesaw', title: 'The See-saw', diff: 1,
  text: 'On a see-saw a child of 30 kg sits 2 m from the middle; her little brother, 20 kg, sits 3 m out on the other side. (The marks are a metre apart.) Take the props away: what happens?',
  data: { k: 'lever', n: 4, w: [[-2, 30], [3, 20]], q: 'tip' },
  hints: ['The heavier child is closer to the middle. Multiply each weight by its distance.'],
  explain: '30 × 2 = 60 on the left, 20 × 3 = 60 on the right: **it stays level**. A lighter child can balance a heavier one by sitting further out — which every playground knows.', concepts: ['torque'], tags: ['classic'] });
push({ id: 'pl-archimedes-lever', title: 'Archimedes\' Lever', diff: 2,
  text: 'A 6 kg weight stands 1 mark to the left of the pivot and a 2 kg weight 4 marks to the right. Which way does the plank tip when the props are removed?',
  data: { k: 'lever', n: 4, w: [[-1, 6], [4, 2]], q: 'tip' },
  hints: ['The heavy weight is three times heavier — but is it three times closer?'],
  explain: 'Left: 6 × 1 = 6. Right: 2 × 4 = 8. The light weight wins: **the right end goes down**. Archimedes proved that weights balance at distances inversely proportional to them — the law of the lever.', concepts: ['torque'], tags: ['classic'], source: 'Archimedes, *On the Equilibrium of Planes* (3rd century BC), states the law of the lever.' });
push({ id: 'pl-place-to-stand', title: 'Give Me a Place to Stand', diff: 2,
  text: 'A boulder weighing **1200 N** rests on the tip of a crowbar, 10 cm from the stone it pivots on. You push down on the far end, 150 cm from the stone. How hard must you push?',
  data: { k: 'crowbar', a: 10, b: 150, W: 1200 },
  hints: ['Your side of the bar is 15 times longer.'],
  explain: 'Push × 150 = 1200 × 10, so the push is **80 N** — about what it takes to hold up an 8 kg bag. "Give me a place to stand and I will move the earth" is the boast tradition puts in Archimedes\' mouth; with a long enough lever, it is only a matter of distance.', concepts: ['torque'], tags: ['classic'] });
push({ id: 'pl-fixed-pulley', title: 'The Single Pulley', diff: 1,
  text: 'A crate of **300 N** hangs from a rope over one pulley fixed to the beam. How hard must you pull the free end to hold the crate up?',
  data: { k: 'rope', sys: L.tackle(1, false, 300), q: 'force', load: 1 },
  hints: ['The rope pulls with the same force all along its length.'],
  explain: 'One rope, one pull: the rope carries the crate\'s whole weight, so you pull **300 N**. A fixed pulley changes the direction of the pull — down is easier than up, because you can hang your weight on it — but not its size.', concepts: ['torque'], tags: ['classic'] });
push({ id: 'pl-movable-pulley', title: 'The Movable Pulley', diff: 1,
  text: 'Now the crate (**300 N**) hangs from a pulley that rides on the rope: one end is tied to the beam, the other goes over a fixed pulley to your hand. How hard must you pull?',
  data: { k: 'rope', sys: L.tackle(1, true, 300), q: 'force', load: 1 }, links: ['pl-fixed-pulley'],
  hints: ['How many runs of rope hold up the moving pulley?'],
  explain: 'Two runs of the rope hold the moving pulley, and each carries the same pull, so each carries half: **150 N**. But to lift the crate 1 cm you must pull 2 cm of rope — the work is the same.', concepts: ['torque'], tags: ['classic'] });
push({ id: 'pl-half-trap', title: 'The Heavier Loses', diff: 2,
  text: 'Weight A (3 kg) hangs straight from one end of a rope over a fixed pulley. Weight B (5 kg) hangs on a movable pulley in the other loop of the rope. Let go: which way does it run?',
  data: { k: 'rope', sys: L.balance(3, 5, false, true), q: 'way' },
  hints: ['B hangs from two runs of rope, so it pulls on the rope with only half its weight.'],
  explain: 'B pulls on the rope with half its weight, 2½ kg — less than A\'s 3 kg. So **A goes down** and B rises, though B is heavier. (Seen the other way: when A drops 1 cm, B rises only ½ cm; 3 × 1 is more than 5 × ½.)', concepts: ['torque'], tags: ['classic', 'trap'] });
push({ id: 'pl-hieros-ship', title: 'King Hiero\'s Ship', diff: 3,
  text: 'Plutarch tells how Archimedes, sitting far off, drew a fully laden ship smoothly towards him with a set of pulleys. Suppose his tackle lifts a load of **1200 N** with three movable pulleys, each hanging from the one above. How hard must he pull?',
  data: { k: 'rope', sys: L.cascade(3, 1200), q: 'force', load: 3 },
  hints: ['Each movable pulley halves the pull. Three of them…'],
  explain: 'Each stage halves the pull: 1200 → 600 → 300 → **150 N**. The price: to raise the load 1 cm the hand must draw in 8 cm of rope.', source: 'Plutarch, *Life of Marcellus*, tells the story of Archimedes and King Hiero\'s ship.', concepts: ['torque'], tags: ['classic'] });
push({ id: 'pl-well', title: 'Down the Well', diff: 1,
  text: 'A well\'s winch has a drum **40 cm** round. You turn the handle **5 times**. How far does the bucket rise?',
  data: { k: 'winch', R: 40, r: 6, W: 150, q: 'rise', n: 5, circ: 40 },
  hints: ['Each turn of the drum winds on one round of rope.'],
  explain: 'Each turn winds 40 cm of rope, so 5 turns lift the bucket **200 cm**. The long crank does not change the distance — only how hard you must push.', concepts: ['rates'], tags: ['classic'] });

/* ---------- made by the engine, easiest first ---------- */

const ADJ = ['Harbour', 'Quarry', 'Barn', 'Mill', 'Castle', 'Shipyard', 'Builder\'s', 'Farmer\'s', 'Sailor\'s', 'Mason\'s', 'Circus', 'Theatre', 'Market', 'Village', 'Cathedral', 'Workshop', 'Orchard', 'Station', 'Warehouse', 'Garden'];
const NOUN = { lever: ['See-saw', 'Balance', 'Beam', 'Steelyard', 'Plank'], crowbar: ['Crowbar', 'Pry Bar', 'Lever'], tackle: ['Tackle', 'Hoist', 'Block', 'Pulleys'], cascade: ['Hoist', 'Pulley Train', 'Tackle'], balance: ['Balance', 'Counterweight', 'Seesaw of Ropes', 'Tug of Weights'], winch: ['Winch', 'Windlass', 'Capstan'] };
const trng = C.rng(4410);
function title(kind) {
  for (;;) {
    const t = 'The ' + trng.pick(ADJ) + ' ' + trng.pick(NOUN[kind]);
    if (!titles.has(t)) { titles.add(t); return t; }
  }
}
const PLAN = [
  [1, ['lever', 'lever', 'tackle', 'crowbar', 'winch', 'balance', 'lever', 'tackle']],
  [2, ['lever', 'lever', 'lever', 'tackle', 'tackle', 'crowbar', 'winch', 'winch', 'balance', 'balance', 'tackle', 'lever']],
  [3, ['lever', 'lever', 'lever', 'tackle', 'tackle', 'tackle', 'crowbar', 'winch', 'balance', 'balance', 'lever', 'tackle']],
  [4, ['lever', 'lever', 'tackle', 'tackle', 'cascade', 'winch', 'balance', 'balance', 'lever', 'cascade', 'balance']],
  [5, ['lever', 'lever', 'tackle', 'cascade', 'cascade', 'balance', 'balance', 'lever', 'balance']]
];
let n = 0;
PLAN.forEach(([lv, kinds]) => {
  const rng = C.rng(6600 + lv * 17);
  kinds.forEach((kind) => {
    const r = L.make(rng, lv, kind);
    if (!r) { console.warn('could not make ' + kind + ' L' + lv); return; }
    n++;
    push({ id: 'pl-' + String(n).padStart(3, '0'), title: title(kind), diff: lv, text: r.text, data: r.data });
  });
});

const meta = {
  id: 'pulleys', engine: 'pulleys', cat: 'physics', name: 'Pulleys and levers', order: 3,
  blurb: 'See-saws, crowbars, winches and ropes over pulleys: which way, how hard, how far? Then let go and watch.',
  origin: { year: -250, who: 'Archimedes of Syracuse', note: 'Archimedes set out the law of the lever — weights balance at distances in inverse proportion to them — and is said to have moved a laden ship single-handed with compound pulleys. Levers and pulleys are far older still.' },
  concepts: ['torque', 'rates']
};
const body = '/* The Puzzle Cabinet · data/pulleys.js — made by tools/gen/pulleys.js */\nCabinet.family(' + JSON.stringify(meta) + ', [\n' + out.map((p) => JSON.stringify(p)).join(',\n') + '\n]);\n';
fs.writeFileSync(path.join(ROOT, 'data/pulleys.js'), body);
const by = [0, 0, 0, 0, 0, 0];
out.forEach((p) => by[p.diff]++);
console.log('pulleys: ' + out.length + ' puzzles, by level ' + by.slice(1).join('/') + ', ' + Math.round(body.length / 1024) + ' KB');
