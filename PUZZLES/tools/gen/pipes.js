/* The Puzzle Cabinet · tools/gen/pipes.js
 *
 *   node tools/gen/pipes.js     writes data/which-cup.js
 *
 * Networks of cups and pipes made by the engine's own generator
 * (engines/pipes.js), easiest first. Every answer comes from the engine's
 * flow simulation, and verify() checks that the first cup wins clearly.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/mech.js'));
require(path.join(ROOT, 'engines/pipes.js'));
const L = C.pipesLib, E = C.engines.pipes;

const ADJ = ['Leaky', 'Thirsty', 'Garden', 'Kitchen', 'Cellar', 'Attic', 'Rainy', 'Busy', 'Crooked', 'Copper', 'Dripping', 'Gurgling', 'Plumber\'s', 'Brewer\'s', 'Gardener\'s', 'Chemist\'s', 'Sunday', 'Morning', 'Midnight', 'Village', 'Tangled', 'Sly', 'Patient', 'Greedy', 'Lazy', 'Noisy', 'Secret', 'Crystal', 'Muddy', 'Grand'];
const NOUN = ['Fountain', 'Cascade', 'Tea Party', 'Waterworks', 'Laboratory', 'Dairy', 'Brewery', 'Greenhouse', 'Bath House', 'Mill Race', 'Aqueduct', 'Gutter', 'Scullery', 'Sluice', 'Rain Barrel', 'Still', 'Wash House', 'Water Tower', 'Well', 'Cistern', 'Pump Room', 'Spring', 'Conservatory', 'Canal', 'Drainpipe', 'Font', 'Trough', 'Kettle Line', 'Siphon', 'Weir'];
const trng = C.rng(8801);
const used = new Set();
function title() {
  for (;;) {
    const t = 'The ' + trng.pick(ADJ) + ' ' + trng.pick(NOUN);
    if (!used.has(t)) { used.add(t); return t; }
  }
}

const TEXT = [null,
  'Water pours from the tap into the top cup. Which cup is the first to be full to the brim?',
  'Water pours from the tap. Watch out for the plugs. Which cup fills first?',
  'Water pours from the tap and runs down through the pipes. Which cup is full first?',
  'A bigger network: pipes split, some are plugged and some drain away. Which cup fills first?',
  'The waterworks of a very determined plumber. Which cup is the first to fill?'
];
const HINTS = [null,
  ['Water leaves the top cup through its lowest pipe that is not plugged.'],
  ['A plugged pipe does nothing: the water rises past its hole.', 'Follow the water: it always takes the lowest open pipe of each cup.'],
  null, null, null
];

const PLAN = [[1, 12], [2, 18], [3, 20], [4, 16], [5, 14]];
const out = [];
let n = 0;
PLAN.forEach(([lv, count]) => {
  const rng = C.rng(5200 + lv * 101);
  for (let k = 0; k < count; k++) {
    let d = null;
    for (let a = 0; a < 20 && !d; a++) d = L.make(rng, lv);
    if (!d) { console.warn('could not make L' + lv); continue; }
    n++;
    const p = { id: 'wc-' + String(n).padStart(3, '0'), title: title(), diff: lv, text: TEXT[lv], data: d };
    if (HINTS[lv]) p.hints = HINTS[lv];
    const r = E.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
    out.push(p);
  }
});

const meta = {
  id: 'which-cup', engine: 'pipes', cat: 'physics', name: 'Which cup fills first?', order: 2,
  blurb: 'Water pours into a tangle of cups and pipes, some of them plugged. Pick the cup that fills first — then turn on the tap.',
  origin: { who: 'Picture puzzles', note: 'A modern favourite of puzzle books and the internet: the picture looks like a race, but the plugged pipes and the heights of the holes decide everything. Here the water really runs — each cup, pipe and plug is simulated.' },
  concepts: ['rates']
};
const body = '/* The Puzzle Cabinet · data/which-cup.js — made by tools/gen/pipes.js */\nCabinet.family(' + JSON.stringify(meta) + ', [\n' +
  out.map((p) => JSON.stringify(p)).join(',\n') + '\n]);\n';
fs.writeFileSync(path.join(ROOT, 'data/which-cup.js'), body);
const by = [0, 0, 0, 0, 0, 0];
out.forEach((p) => by[p.diff]++);
console.log('which-cup: ' + out.length + ' puzzles, by level ' + by.slice(1).join('/') + ', ' + Math.round(body.length / 1024) + ' KB');
