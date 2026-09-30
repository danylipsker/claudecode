/* The Puzzle Cabinet · tools/gen/cubes.js
 *
 *   node tools/gen/cubes.js
 *
 * writes data/count-cubes.js, data/painted-cubes.js, data/views.js and
 * data/mental-rotation.js: a few named puzzles, then puzzles made by the
 * engine's own makers (engines/cubes.js) with fixed seeds. Every puzzle is
 * checked by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/space3d.js'));
require(path.join(ROOT, 'engines/cubes.js'));
const L = C.cubesLib, E = C.engines.cubes;

function namer(adjs, nouns, seed) {
  const rng = C.rng(seed);
  const all = [];
  adjs.forEach((a) => nouns.forEach((n) => all.push('The ' + a + ' ' + n)));
  rng.shuffle(all);
  let i = 0;
  return () => all[i++];
}
function writeFamily(file, meta, list) {
  const byDiff = {};
  list.forEach((p) => { (byDiff[p.diff] = byDiff[p.diff] || []).push(p); });
  const final = [];
  Object.keys(byDiff).sort().forEach((dv) => {
    const items = byDiff[dv];
    const named = items.filter((p) => p.tags && p.tags.includes('classic'));
    const rest = items.filter((p) => !named.includes(p));
    const groups = {};
    rest.forEach((p) => { const k = p.data.kind + (typeof p.data.ask === 'string' ? p.data.ask : '') + (p.data.goal || ''); (groups[k] = groups[k] || []).push(p); });
    const keys = Object.keys(groups);
    final.push(...named);
    for (let i = 0; keys.some((k) => groups[k][i]); i++) keys.forEach((k) => { if (groups[k][i]) final.push(groups[k][i]); });
  });
  const titles = new Set();
  final.forEach((p) => {
    const r = E.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
    if (titles.has(p.title)) throw new Error('title twice: ' + p.title);
    titles.add(p.title);
  });
  const lines = ['/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/cubes.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 2) + ', ['];
  final.forEach((p) => lines.push('  ' + JSON.stringify(p) + ','));
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, file), lines.join('\n') + '\n');
  const spread = {};
  final.forEach((p) => { spread[p.diff] = (spread[p.diff] || 0) + 1; });
  console.log(meta.id + ': ' + final.length + ' puzzles ' + JSON.stringify(spread) + ' ' + (fs.statSync(path.join(ROOT, file)).size / 1024).toFixed(0) + ' KB');
}
function makeMany(list, make, counts, prefix, title, used) {
  let serial = list.filter((p) => p.id.startsWith(prefix)).length;
  Object.keys(counts).forEach((lv) => {
    let made = 0, seed = 1;
    while (made < counts[lv] && seed < 6000) {
      const p = make(C.rng(prefix + ':' + lv + ':' + seed++), +lv);
      if (!p) continue;
      const key = JSON.stringify(p.data);
      if (used.has(key)) continue;
      used.add(key);
      made++;
      const q = { id: prefix + String(++serial).padStart(3, '0'), title: title(p), diff: +lv, text: p.text, goal: p.goal, data: p.data };
      list.push(q);
    }
    if (made < counts[lv]) throw new Error(prefix + ' L' + lv + ': only ' + made);
  });
}

/* ---------- count the cubes ---------- */
{
  const list = [], used = new Set();
  const named = (id, title, diff, H, view, ask, extra) => {
    // the first view from which the count is settled (a cube could otherwise hide behind the top)
    const tries = [view, [-30, 34], [-60, 34], [-25, 40], [-65, 40], [-35, 44], [-20, 38], [-70, 38], [-30, 50], [-60, 50]];
    let a = null;
    for (const v of tries) { a = L.analyseCount(H, v, 0); view = v; if (ask === 'least' || (a.exact && !a.ambiguous)) break; }
    const d = { kind: 'count', H, view, ask };
    d.answer = ask === 'total' ? a.total : ask === 'hidden' ? a.hiddenCount : a.min;
    if (ask !== 'least' && !a.exact) throw new Error(id + ' is not exact from any view tried');
    list.push(Object.assign({ id, title, diff, text: L.countText(ask), goal: L.countGoal(ask), data: d, tags: ['classic'] }, extra || {}));
    used.add(JSON.stringify(d));
  };
  named('count-stairs', 'Three Steps Up', 1, [[3, 3], [2, 2], [1, 1]], [-40, 30], 'total',
    { hints: ['The back step is three cubes tall — all the way down to the board.'], explain: 'Two columns of 3, two of 2 and two of 1: **12** cubes. The cubes under the top steps are there, holding them up.' });
  named('count-pyramid', 'The Little Pyramid', 2, [[1, 1, 1], [1, 2, 1], [1, 1, 1]], [-45, 34], 'total',
    { hints: ['The top cube sits on a cube in the middle of the bottom layer.'], explain: 'Nine cubes in the bottom layer and one on top: **10**. The one in the middle of the bottom layer cannot be seen, but the top cube needs it.' });
  named('count-ziggurat', 'The Ziggurat', 3, [[1, 1, 1, 1, 1], [1, 2, 2, 2, 1], [1, 2, 3, 2, 1], [1, 2, 2, 2, 1], [1, 1, 1, 1, 1]], [-45, 50], 'total',
    { hints: ['Count layer by layer: a 5 × 5 layer, then 3 × 3, then 1.'], explain: '25 + 9 + 1 = **35** cubes, in layers of 5 × 5, 3 × 3 and 1 — like the stepped temples of Mesopotamia.', concepts: ['combinatorics'] });
  named('count-ziggurat-hidden', 'Under the Ziggurat', 4, [[1, 1, 1, 1, 1], [1, 2, 2, 2, 1], [1, 2, 3, 2, 1], [1, 2, 2, 2, 1], [1, 1, 1, 1, 1]], [-45, 50], 'hidden',
    { hints: ['A cube is hidden when a cube sits on it and it is not on the outside of its layer.'], explain: 'In the bottom layer, the 3 × 3 square under the second layer is covered, and in the second layer the cube under the top: 9 + 1 = **10** hidden cubes.' });
  const NOUN = ['Tower', 'Steps', 'Block', 'Heap', 'Terrace', 'Castle', 'Stack', 'Pile', 'Wall', 'Quarry', 'Fortress', 'Chimney', 'Bastion', 'Warehouse', 'Granary', 'Temple', 'Staircase', 'Plaza', 'Keep', 'Harbour'];
  const ADJ = ['Quiet', 'Crooked', 'Tall', 'Hidden', 'Wooden', 'Little', 'Old', 'Lost', 'Secret', 'Sunny', 'Stubborn', 'Leaning', 'Silent', 'Hollow', 'Proud', 'Busy', 'Lonely', 'Tidy', 'Jumbled', 'Sleepy'];
  const next = namer(ADJ, NOUN, 11);
  makeMany(list, (rng, lv) => L.makeCount(rng, lv), { 1: 14, 2: 16, 3: 16, 4: 14, 5: 16 }, 'count-', () => next(), used);
  writeFamily('data/count-cubes.js', {
    id: 'count-cubes', engine: 'cubes', cat: 'space', name: 'Count the cubes', order: 2,
    blurb: 'How many cubes are in the stack — including the ones you cannot see? Answer from the picture, then turn the stack round and take it apart.',
    origin: { who: 'Traditional', note: 'Counting the cubes in a drawn stack is an old favourite of puzzle books and intelligence tests. The trick is always the same: the cubes you cannot see, holding up the ones you can.' },
    concepts: ['projection', 'combinatorics']
  }, list);
}

/* ---------- painted cubes ---------- */
{
  const list = [], used = new Set();
  const named = (id, title, diff, d, extra) => {
    d.kind = 'paint';
    const t = L.paintTally(d);
    if (d.ask === 'table') { d.answer = {}; L.tableKs(d).forEach((k) => { d.answer[k] = t.tally[k] || 0; }); }
    else if (d.ask === 'reverse') { d.given.count = t.tally[d.given.k] || 0; d.answer = t.n; }
    else d.answer = t.tally[d.ask.k] || 0;
    list.push(Object.assign({ id, title, diff, text: L.paintText(d), goal: d.ask === 'table' ? 'Fill in how many little cubes have paint on each number of faces.' : 'Type the number of little cubes.', data: d }, extra || {}));
    used.add(JSON.stringify(d));
  };
  named('paint-2', 'Eight Corners', 1, { dims: [2, 2, 2], rule: 'all', ask: 'table' }, { explain: 'Every one of the 8 little cubes is a corner, so each has **3** painted faces.', tags: ['classic'] });
  named('paint-3', 'The Classic Painted Cube', 1, { dims: [3, 3, 3], rule: 'all', ask: 'table' },
    { hints: ['The corners have three painted faces. How many corners has a cube?', 'Each of the 12 edges has one cube between its corners.'], explain: '8 corners with **3**, 12 edge cubes with **2**, 6 face centres with **1**, and **1** cube in the very middle with none: 8 + 12 + 6 + 1 = 27.', tags: ['classic'], concepts: ['combinatorics'] });
  named('paint-4', 'Four Along Each Edge', 2, { dims: [4, 4, 4], rule: 'all', ask: 'table' }, { hints: ['Each edge now has 2 cubes between its corners; each face has a 2 × 2 middle.'], explain: '8 with 3, 12 × 2 = 24 with 2, 6 × 4 = 24 with 1, and a 2 × 2 × 2 core of 8 with none: 8 + 24 + 24 + 8 = 64.', tags: ['classic'] });
  named('paint-10-one', 'The Thousand Cubes', 3, { dims: [10, 10, 10], rule: 'all', ask: { k: 1 } }, { hints: ['Only the cubes in the middle of a face — not on an edge — have exactly one painted face.', 'Each face has an 8 × 8 middle.'], explain: 'Each of the 6 faces has an 8 × 8 middle: 6 × 64 = **384**. (And 8³ = 512 cubes have no paint at all.)', tags: ['classic'], concepts: ['combinatorics'] });
  named('paint-10-none', 'The Clean Core', 3, { dims: [10, 10, 10], rule: 'all', ask: { k: 0 } }, { hints: ['Peel away the outer layer: what is left is a smaller cube.'], explain: 'Take away the painted skin, one cube thick, and an 8 × 8 × 8 cube is left: **512** unpainted cubes — more than half!' });
  named('paint-table', 'On the Table', 2, { dims: [3, 3, 3], rule: 'nobottom', ask: 'table' }, { hints: ['The bottom layer now has one fewer painted face per cube.'], explain: 'Without paint on the bottom, the 4 bottom corners have only 2 painted faces and the bottom edges only 1…' });
  named('paint-reverse-27', 'Twenty-Seven Clean Cubes', 4, { dims: [5, 5, 5], rule: 'all', ask: 'reverse', given: { k: 0 } }, { hints: ['The clean cubes make a cube of their own inside.', '27 = 3 × 3 × 3.'], explain: 'The clean core is 3 × 3 × 3, so the big cube is 5 along each edge: **125** little cubes.' });
  named('paint-reverse-96', 'Ninety-Six Single Coats', 4, { dims: [6, 6, 6], rule: 'all', ask: 'reverse', given: { k: 1 } }, { hints: ['The one-face cubes are the middles of the six faces.', '96 ÷ 6 = 16 = 4 × 4.'], explain: 'Each face has 96 ÷ 6 = 16 = 4 × 4 middle cubes, so the edge is 6 long: **216** little cubes.' });
  named('paint-slab', 'The Chocolate Slab', 4, { dims: [1, 4, 5], rule: 'all', ask: 'table' }, { hints: ['A slab one cube thick: every little cube has paint on its front and its back.'], explain: 'Every cube is painted front and back; the corners get two more sides, the edge cubes one more: 4 with **4**, 10 with **3**, 6 with **2**.' });
  const next = (() => {
    const names = ['The Sawn Block', 'Red All Over', 'Paint and Saw', 'The Carpenter\'s Offcuts', 'Dipped and Diced', 'The Painter\'s Block', 'Sugar Lumps', 'The Brick Kiln', 'Chopped Up', 'Wet Paint', 'The Varnished Box', 'Building Blocks', 'The Dyer\'s Cube', 'Coat of Many Colours', 'Toy Bricks', 'The Glued Stack', 'Dip and Drip', 'The Sprayed Stack', 'Painted Stairs', 'Spilt Paint', 'Red Handed', 'The Timber Yard', 'Cut Along the Lines', 'The Signwriter\'s Block', 'Freshly Painted', 'Primer Coat', 'Undercoat', 'Gloss Finish'];
    let i = 0;
    return () => names[i++];
  })();
  makeMany(list, (rng, lv) => L.makePaint(rng, lv), { 2: 2, 3: 5, 4: 6, 5: 8 }, 'paint-g', () => next(), used);
  writeFamily('data/painted-cubes.js', {
    id: 'painted-cubes', engine: 'cubes', cat: 'space', name: 'Painted cubes', order: 3,
    blurb: 'A painted block is sawn into little cubes: how many have paint on three faces, on two, on one — and how many none? Then take it apart and see.',
    origin: { who: 'Traditional', note: 'The painted cube is a classic of school mathematics and puzzle books alike: corners, edges, faces and a hidden core, counted without sawing anything.' },
    concepts: ['combinatorics', 'symmetry']
  }, list);
}

/* ---------- front, top and side ---------- */
{
  const list = [], used = new Set();
  const ADJ = ['First', 'Second', 'Careful', 'Rough', 'Hasty', 'Neat', 'Faded', 'Pencil', 'Ink', 'Chalk', 'Draughtsman\'s', 'Surveyor\'s', 'Mason\'s', 'Builder\'s', 'Engineer\'s'];
  const NOUN = ['Plan', 'Elevation', 'Sketch', 'Blueprint', 'Drawing', 'Study', 'Survey', 'Draft'];
  const next = namer(ADJ, NOUN, 21);
  const mk = (rng, lv) => { const r = rng(); return lv <= 2 ? (r < 0.35 ? L.makeWhichView(rng, lv) : r < 0.55 ? L.makeViewPick(rng, lv) : L.makeViews(rng, lv)) : (r < 0.2 ? L.makeWhichView(rng, lv) : r < 0.45 ? L.makeViewPick(rng, lv) : L.makeViews(rng, lv)); };
  makeMany(list, mk, { 1: 12, 2: 12, 3: 12, 4: 12, 5: 12 }, 'views-', () => next(), used);
  writeFamily('data/views.js', {
    id: 'views', engine: 'cubes', cat: 'space', name: 'Front, top and side', order: 4,
    blurb: 'Three flat drawings of a stack of cubes — from the front, the top and the side. Build the stack, find it, or pick the right drawing; sometimes with the fewest or the most cubes.',
    origin: { year: 1799, who: 'Gaspard Monge', note: 'Monge\'s *Géométrie descriptive* (1799) set out how to show a solid by its views from the front, from above and from the side — the method behind every engineering drawing since.' },
    concepts: ['projection']
  }, list);
}

/* ---------- same or mirror ---------- */
{
  const list = [], used = new Set();
  const ADJ = ['Left', 'Right', 'Double', 'Lazy', 'Nervous', 'Sly', 'Twisted', 'Folded', 'Bent', 'Tricky', 'Wandering', 'Crafty', 'Stiff', 'Restless', 'Proud'];
  const NOUN = ['Twist', 'Crank', 'Zigzag', 'Hook', 'Kink', 'Snake', 'Branch', 'Elbow', 'Spiral', 'Crook', 'Knuckle', 'Periscope'];
  const next = namer(ADJ, NOUN, 31);
  const mk = (rng, lv) => (lv >= 3 && rng() < 0.3 ? L.makeRotPick(rng, lv) : L.makeRot(rng, lv));
  makeMany(list, mk, { 1: 16, 2: 16, 3: 16, 4: 16, 5: 16 }, 'mrot-', () => next(), used);
  writeFamily('data/mental-rotation.js', {
    id: 'mental-rotation', engine: 'cubes', cat: 'space', name: 'Same or mirror?', order: 5,
    blurb: 'Two shapes made of cubes, seen from different angles: the same shape turned round, or its mirror image? Decide in your head — then watch one turn onto the other.',
    origin: { year: 1971, who: 'Roger Shepard and Jacqueline Metzler', note: 'In 1971 Shepard and Metzler timed people deciding whether two drawings of block shapes showed the same object. The time grew steadily with the angle between the two views — as if the mind turned the shape at a steady speed.' },
    concepts: ['rotation-3d', 'symmetry']
  }, list);
}
