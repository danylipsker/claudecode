/* The Puzzle Cabinet · tools/gen/gears.js
 *
 *   node tools/gen/gears.js     writes data/gear-trains.js
 *
 * A few hand-made classics first (the idler, the triangle that jams, the
 * crossed belt, the coin paradox …), then machines made by the engine's own
 * generator (engines/gears.js), level by level. Every answer is worked out by
 * the engine's kinematics and checked by its verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/mech.js'));
require(path.join(ROOT, 'engines/gears.js'));
const L = C.gearsLib, E = C.engines.gears, F = C.mech.F;

const ADJ = ['Brass', 'Busy', 'Stubborn', 'Patient', 'Humming', 'Tangled', 'Lazy', 'Restless', 'Crooked', 'Rusty', 'Nimble', 'Grand', 'Tiny', 'Noisy', 'Silent', 'Clever', 'Wobbly', 'Ancient', 'Polished', 'Midnight', 'Sunday', 'Village', 'Harbour', 'Attic', 'Workshop', 'Clockmaker\'s', 'Miller\'s', 'Tinker\'s', 'Baker\'s', 'Blacksmith\'s', 'Inventor\'s', 'Travelling', 'Creaking', 'Whirring', 'Gleaming'];
const NOUN = ['Mill', 'Winch', 'Clock', 'Loom', 'Press', 'Crane', 'Lathe', 'Orrery', 'Capstan', 'Hoist', 'Gearbox', 'Mangle', 'Treadmill', 'Engine', 'Pump', 'Windmill', 'Music Box', 'Automaton', 'Hand Drill', 'Egg Beater', 'Sawmill', 'Jack', 'Roasting Spit', 'Carousel', 'Barrel Organ', 'Water Wheel', 'Cider Press', 'Kitchen Timer', 'Toy Robot', 'Drawbridge', 'Portcullis', 'Lift', 'Seed Drill', 'Sewing Machine', 'Typewriter', 'Cuckoo Clock', 'Tower Clock', 'Metronome', 'Pepper Mill', 'Mincer', 'Spinning Wheel', 'Knife Grinder', 'Butter Churn', 'Paddle Steamer', 'Mixer', 'Clockwork Mouse', 'Planetarium', 'Well Winder'];
const trng = C.rng(7001);
const usedTitles = new Set();
function title() {
  for (;;) {
    const t = 'The ' + trng.pick(ADJ) + ' ' + trng.pick(NOUN);
    if (!usedTitles.has(t)) { usedTitles.add(t); return t; }
  }
}

const out = [];
function push(p) {
  const r = E.verify(Object.assign({ id: p.id }, p));
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (r.warn) console.warn('  ! ' + p.id + ': ' + r.warn);
  usedTitles.add(p.title);
  out.push(p);
}

/* ---------- the classics, built by hand ---------- */

const rnd = (v) => Math.round(v * 1000) / 1000;
// a chain of gears: [[teeth, angle to the next (deg)], …]; returns shafts and parts
function chain(list, z) {
  const shafts = [[0, 0]], parts = [{ k: 'g', s: 0, t: list[0][0], z: z || 0 }];
  for (let i = 1; i < list.length; i++) {
    const c = shafts[i - 1], D = (list[i - 1][0] + list[i][0]), a = list[i - 1][1] * Math.PI / 180;
    shafts.push([rnd(c[0] + D * Math.cos(a)), rnd(c[1] + D * Math.sin(a))]);
    parts.push({ k: 'g', s: i, t: list[i][0], z: z || 0 });
  }
  return { shafts, parts, belts: [], racks: [] };
}
function answer(d) { const r = L.solveQ(d); if (r.err) throw new Error(r.err); d.ans = r.v; return d; }

{
  const d = chain([[24, 0], [16, 0]]);
  d.drive = { s: 0, dir: 1, rpm: 30, m: 'crank' };
  d.q = { k: 'dir', p: 1 };
  push({ id: 'gt-two-gears', title: 'Two Gears', diff: 1, text: 'You turn the handle on gear A **clockwise**. Which way does gear B turn?', data: answer(d),
    hints: ['Look where the teeth touch: as A\'s teeth move one way there, B\'s teeth are pushed the same way — on the opposite side of B\'s centre.'],
    explain: 'Where two gears mesh, their teeth move together — so the gears themselves turn in **opposite** directions. A clockwise, B anticlockwise.', concepts: ['gear-ratio'], tags: ['classic'] });
}
{
  const d = chain([[20, 0], [14, -10], [20, 0]]);
  d.drive = { s: 0, dir: 1, rpm: 30, m: 'crank' };
  d.q = { k: 'dir', p: 2 };
  push({ id: 'gt-idler', title: 'The Idler', diff: 1, text: 'Three gears in a row. The handle turns A **clockwise**. Which way does C turn?', data: answer(d),
    hints: ['B turns the opposite way to A. And C turns the opposite way to B…'],
    explain: 'Each mesh flips the direction: A clockwise, B anticlockwise, C clockwise again. The middle gear is an **idler**: it lets the outer two turn the same way, and whatever its size it changes nothing else.', concepts: ['gear-ratio', 'parity'], tags: ['classic', 'idler'] });
}
{
  const d = chain([[30, 0], [15, 0]]);
  d.drive = { s: 0, dir: 1, rpm: 20, m: 'motor' };
  d.q = { k: 'speed', p: 1 };
  push({ id: 'gt-half-size', title: 'Half the Teeth', diff: 1, text: 'A motor turns gear A, with 30 teeth, at **20 turns a minute**. Gear B has 15 teeth. How fast does B turn?', data: answer(d),
    hints: ['Each turn of A pushes 30 teeth past the meeting point. How many turns of B is that?'],
    explain: 'In a minute A pushes 20 × 30 = 600 teeth past the point where they meet, and B must take all 600: that is 600 ÷ 15 = **40 turns**. Speed × teeth is the same for both — the small gear runs faster.', concepts: ['gear-ratio', 'rates'], tags: ['classic', 'ratio'] });
}
{
  const d = chain([[36, 0], [12, -30], [30, 20]]);
  d.drive = { s: 0, dir: -1, rpm: 10, m: 'motor' };
  d.q = { k: 'speed', p: 2 };
  push({ id: 'gt-idler-speed', title: 'Does the Middle One Matter?', diff: 2, text: 'Gear A (36 teeth) turns at **10 rpm**. Between it and gear C (30 teeth) sits a small 12-tooth gear. How fast does C turn?', data: answer(d),
    hints: ['Work out B\'s speed first: 10 × 36 ÷ 12.', 'Then C: B\'s speed × 12 ÷ 30. Notice what happens to the 12.'],
    explain: 'B turns at 10 × 36 ÷ 12 = 30 rpm, and C at 30 × 12 ÷ 30 = **12 rpm**. The 12s cancel: an idler never changes the speed, so C turns just as if it meshed with A directly — 10 × 36 ÷ 30 = 12.', concepts: ['gear-ratio', 'rates'], tags: ['classic', 'idler'] });
}
{
  // three gears in a triangle
  const d = L.ring(C.rng('triangle-classic'), 3);
  d.drive = { s: 0, dir: 1, rpm: 30, m: 'crank' };
  d.q = { k: 'jam' };
  push({ id: 'gt-triangle', title: 'The Triangle', diff: 1, text: 'Three gears, each meshing with the other two. The handle is on gear A. Will it turn?', data: answer(d),
    hints: ['If A turns clockwise, which way must B turn? And C? Now check the pair B and C.'],
    explain: 'A clockwise forces B anticlockwise and C anticlockwise — but B and C mesh, so they must turn opposite ways to each other. They cannot both be anticlockwise: **the triangle jams**. Any closed ring of an odd number of gears locks solid.', concepts: ['parity', 'gear-ratio'], tags: ['classic', 'jam'] });
}
{
  const d = L.ring(C.rng('square-classic-2'), 4);
  d.drive = { s: 0, dir: 1, rpm: 30, m: 'crank' };
  d.q = { k: 'jam' };
  push({ id: 'gt-square', title: 'Four in a Ring', diff: 2, text: 'Four gears in a ring, each meshing with its two neighbours. Will it turn?', data: answer(d), links: ['gt-triangle'],
    hints: ['Go round the ring: clockwise, anticlockwise, clockwise, anticlockwise… and back to the start.'],
    explain: 'Round a ring the directions alternate. With four gears they alternate evenly and come back to where they started: **it turns**. Only odd rings jam.', concepts: ['parity'], tags: ['classic', 'jam'] });
}
{
  const d = { shafts: [[0, 0], [110, 10]], parts: [{ k: 'p', s: 0, r: 20, z: 0 }, { k: 'p', s: 1, r: 20, z: 0 }], belts: [{ a: 0, b: 1, x: 1 }], racks: [], drive: { s: 0, dir: 1, rpm: 30, m: 'crank' }, q: { k: 'dir', p: 1 } };
  push({ id: 'gt-crossed-belt', title: 'The Crossed Belt', diff: 1, text: 'Two pulleys joined by a belt that crosses over in the middle. Pulley A turns **clockwise**. Which way does B turn?', data: answer(d),
    hints: ['Follow the top of pulley A: which way is the belt pulled there? Follow that piece of belt across to B.'],
    explain: 'An open belt makes both pulleys turn the same way; crossing it makes them turn **opposite** ways, just like meshing gears. Old workshops used crossed belts to run a machine backwards.', concepts: ['gear-ratio'], tags: ['classic', 'belt'] });
}
{
  const d = { orbit: { sun: 20, planet: 20 }, q: { k: 'orbit' } };
  d.ans = L.orbitTurns(d.orbit).v;
  push({ id: 'gt-coin-paradox', title: 'The Coin Paradox', diff: 2, text: 'Two gears of the same size, 20 teeth each. One is fixed. An arm carries the other once all the way round it, the teeth rolling on the teeth. How many times does the moving gear turn round its own centre?', data: d,
    hints: ['Watch the red mark: where does it point when the gear is at the top, and when it has rolled half way round, to the bottom?'],
    explain: 'It turns **twice**. Rolling over 20 teeth would give one turn, but going round the fixed gear adds another: halfway round, the gear is already upright again. The same happens with two coins — the *coin rotation paradox*. A famous US college entrance test of 1982 asked a question like this and no choice it offered was right.', concepts: ['gear-ratio'], tags: ['classic', 'paradox'] });
}
{
  const d = { orbit: { sun: 30, planet: 10 }, q: { k: 'orbit' } };
  d.ans = L.orbitTurns(d.orbit).v;
  push({ id: 'gt-three-to-one', title: 'Three Times Round?', diff: 3, text: 'A fixed gear of 30 teeth, and a 10-tooth gear carried once round it on an arm. How many turns does the small gear make?', data: d, links: ['gt-coin-paradox'],
    hints: ['30 ÷ 10 = 3 — but that is only the rolling. What does the trip round add?'],
    explain: 'Rolling over 30 teeth turns it 3 times, and the trip round adds 1: **4 turns**. This was the 1982 test question: its radii were 1 to 3 and the expected answer 3 — which is wrong.', concepts: ['gear-ratio'], tags: ['classic', 'paradox'] });
}
{
  const d = { orbit: { sun: 48, planet: 16, ring: true }, q: { k: 'orbit' } };
  d.ans = L.orbitTurns(d.orbit).v;
  push({ id: 'gt-ring-inside', title: 'Inside the Ring', diff: 3, text: 'Now the fixed gear is a ring with 48 teeth on the inside, and the 16-tooth gear rolls round inside it once. How many times does the small gear turn?', data: d, links: ['gt-three-to-one'],
    hints: ['Rolling over 48 teeth gives 3 turns — but going round inside the ring works against the rolling.'],
    explain: 'Inside a ring the trip round takes a turn away: 48 ÷ 16 − 1 = **2 turns** (backwards compared with the arm). A Spirograph pen traces exactly this motion.', concepts: ['gear-ratio'], tags: ['paradox', 'spirograph'] });
}

// a gear placed at a distance and angle from another shaft (module 2: centre distance = sum of teeth)
function at(shafts, from, teeth, ang) {
  const c = shafts[from], a = ang * Math.PI / 180;
  shafts.push([rnd(c[0] + teeth * Math.cos(a)), rnd(c[1] + teeth * Math.sin(a))]);
  return shafts.length - 1;
}
{
  // rack and pinion
  const d = { shafts: [[0, 0]], parts: [{ k: 'g', s: 0, t: 20, z: 0 }], belts: [], racks: [{ g: 0, a: 90, n: 7 }], drive: { s: 0, dir: 1, rpm: 30, m: 'crank' }, q: { k: 'rack', r: 0 } };
  push({ id: 'gt-rack-pinion', title: 'Rack and Pinion', diff: 1, text: 'A gear sits on a toothed bar — a *rack*. You turn the handle **clockwise**. Which way does the rack slide?', data: answer(d),
    hints: ['Look only at the bottom of the gear, where its teeth touch the rack. Which way do those teeth move when the gear turns clockwise?'],
    explain: 'The top of a clockwise gear moves right, so its bottom moves **left** — and carries the rack with it. Rack and pinion steering in cars works this way.', concepts: ['gear-ratio'], tags: ['classic', 'rack'] });
}
{
  // compound reduction: 12 → 36, and on the same shaft 12 → 48
  const shafts = [[0, 0]];
  const s1 = at(shafts, 0, 12 + 36, 0);
  const s2 = at(shafts, s1, 12 + 48, 60);
  const d = { shafts, parts: [{ k: 'g', s: 0, t: 12, z: 0 }, { k: 'g', s: s1, t: 36, z: 0 }, { k: 'g', s: s1, t: 12, z: 1 }, { k: 'g', s: s2, t: 48, z: 1 }], belts: [], racks: [], drive: { s: 0, dir: 1, rpm: 120, m: 'motor' }, q: { k: 'speed', p: 3 } };
  push({ id: 'gt-compound', title: 'Two Gears on One Shaft', diff: 2, text: 'A motor turns the small gear **A** (12 teeth) at **120 rpm**. It drives B (36 teeth); fixed to B\'s shaft, in front, is a second small gear C (12 teeth), which drives D (48 teeth). How fast does D turn?', data: answer(d),
    hints: ['B turns at 120 × 12 ÷ 36. C is on the same shaft, so it turns just as fast.', 'Then D: C\'s speed × 12 ÷ 48.'],
    explain: 'B: 120 × 12 ÷ 36 = 40 rpm. C turns with B at 40 rpm. D: 40 × 12 ÷ 48 = **10 rpm**. Stacking two stages multiplies the reductions: 3 × 4 = 12 times slower. This is a *compound* train, and every gearbox is one.', concepts: ['gear-ratio', 'rates'], tags: ['classic', 'compound'] });
}
{
  // a clock's motion work: 12 to 1 in two steps (3 × 4)
  const shafts = [[0, 0]];
  const s1 = at(shafts, 0, 10 + 30, 0);
  const s2 = at(shafts, s1, 8 + 32, 125);
  const d = { shafts, parts: [{ k: 'g', s: 0, t: 10, z: 0 }, { k: 'g', s: s1, t: 30, z: 0 }, { k: 'g', s: s1, t: 8, z: 1 }, { k: 'g', s: s2, t: 32, z: 1 }], belts: [], racks: [], drive: { s: 0, dir: 1, rpm: 1, m: 'crank' }, q: { k: 'turns', p: 3, n: 12 } };
  push({ id: 'gt-motion-work', title: 'The Clock\'s Hour Wheel', diff: 3, text: 'Inside a clock, the minute hand\'s pinion **A** (10 teeth) drives a 30-tooth wheel; on the same shaft an 8-tooth pinion drives the 32-tooth **hour wheel D**. The minute hand goes round **12 times** in twelve hours. How many times does the hour wheel turn?', data: answer(d),
    hints: ['Each stage slows things down: 30 ÷ 10, then 32 ÷ 8.', 'Together: 3 × 4 = 12 times slower.'],
    explain: 'The first pair slows the turning 3 times, the second 4 times: 12 in all, so 12 turns of the minute hand give **1 turn** of the hour wheel — exactly what an hour hand needs. Clockmakers call this gearing the *motion work*.', concepts: ['gear-ratio', 'rates'], tags: ['classic', 'clock'] });
}
{
  // the bicycle
  const d = { shafts: [[0, 0], [-140, 8]], parts: [{ k: 'sp', s: 0, t: 48, z: 1 }, { k: 'sp', s: 1, t: 16, z: 1 }, { k: 'w', s: 1, r: 62 }], belts: [{ a: 0, b: 1, ch: 1 }], racks: [], drive: { s: 0, dir: 1, rpm: 60, m: 'crank' }, q: { k: 'speed', p: 1 } };
  push({ id: 'gt-bicycle', title: 'The Bicycle', diff: 2, text: 'A cyclist pedals at **60 turns a minute**. The chainring **A** has 48 teeth, the sprocket on the back wheel **B** has 16. How fast does the back wheel turn?', data: answer(d),
    hints: ['The chain moves 48 links for every turn of the pedals. How many turns of the 16-tooth sprocket is that?'],
    explain: 'Each turn of the pedals pulls 48 links of chain, which turns the 16-tooth sprocket 3 times. So the wheel turns at 60 × 3 = **180 rpm**. A chain, like an open belt, keeps the direction: both turn the same way.', concepts: ['gear-ratio', 'rates'], tags: ['classic', 'chain'] });
}

/* ---------- made by the engine, easiest first ---------- */

// [level, kind, how many]
const PLAN = [
  [1, 'dir', 5], [1, 'speed', 3], [1, 'jam', 1], [1, 'weight', 2], [1, 'rack', 1],
  [2, 'dir', 6], [2, 'speed', 4], [2, 'turns', 2], [2, 'jam', 3], [2, 'weight', 3], [2, 'rack', 2], [2, 'orbit', 1],
  [3, 'dir', 6], [3, 'speed', 4], [3, 'turns', 2], [3, 'jam', 3], [3, 'weight', 2], [3, 'wdist', 2], [3, 'rackd', 1], [3, 'fastest', 2], [3, 'idler', 3], [3, 'choose', 3], [3, 'orbit', 1],
  [4, 'dir', 5], [4, 'speed', 3], [4, 'turns', 2], [4, 'jam', 3], [4, 'weight', 2], [4, 'wdist', 1], [4, 'fastest', 2], [4, 'idler', 3], [4, 'choose', 3], [4, 'orbit', 1],
  [5, 'dir', 4], [5, 'speed', 3], [5, 'turns', 1], [5, 'jam', 3], [5, 'fastest', 2], [5, 'idler', 2], [5, 'choose', 2]
];
let n = 0;
PLAN.forEach(([lv, kind, count], pi) => {
  const rng = C.rng(9100 + pi * 37);
  for (let k = 0; k < count; k++) {
    const r = L.make(rng, lv, kind);
    if (!r) { console.warn('could not make ' + kind + ' L' + lv); continue; }
    n++;
    const id = 'gt-' + String(n).padStart(3, '0');
    const p = { id, title: title(), diff: lv, text: r.text, data: r.data };
    push(p);
  }
});

const meta = {
  id: 'gear-trains', engine: 'gears', cat: 'physics', name: 'Gears and belts', order: 1,
  blurb: 'Which way does the last gear turn, how fast, and will the whole train jam? Answer, then watch the machine run.',
  origin: { year: -100, who: 'The Antikythera mechanism', note: 'Geared machines are more than two thousand years old: the bronze Antikythera mechanism, found in a Greek shipwreck, used dozens of gears to model the sky. "Which way does the last gear turn?" has been a favourite of puzzle books and mechanical aptitude tests ever since there were both.' },
  concepts: ['gear-ratio', 'parity', 'rates']
};
const body = '/* The Puzzle Cabinet · data/gear-trains.js — made by tools/gen/gears.js */\nCabinet.family(' + JSON.stringify(meta) + ', [\n' +
  out.map((p) => JSON.stringify(p)).join(',\n') + '\n]);\n';
fs.writeFileSync(path.join(ROOT, 'data/gear-trains.js'), body);
const byDiff = [0, 0, 0, 0, 0, 0];
out.forEach((p) => byDiff[p.diff]++);
console.log('gear-trains: ' + out.length + ' puzzles, by level ' + byDiff.slice(1).join('/') + ', ' + Math.round(body.length / 1024) + ' KB');
