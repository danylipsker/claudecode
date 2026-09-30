/* The Puzzle Cabinet · tools/gen/mazes.js
 *
 *   node tools/gen/mazes.js      writes data/labyrinths.js, data/arrow-mazes.js,
 *                                data/rolling-die.js, data/chase-mazes.js, data/sliding-mazes.js
 *
 * Every maze is made by the same makers the Endless drawers use
 * (js/lib/mazes-logic.js), from fixed seeds, and checked by the engine's
 * verify(): the par is the fewest moves found by breadth-first search.
 * Labyrinths are stored as their seed and grown again when opened.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/mazes-logic.js'));
require(path.join(ROOT, 'engines/mazes.js'));
const M = C.MazeLogic, T = C.mazeText, E = C.engines.mazes;

function write(file, meta, puzzles, extra) {
  const lines = ['/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/mazes.js */'];
  if (extra) lines.push(extra);
  lines.push('Cabinet.family(' + JSON.stringify(meta, null, 2).replace(/\n/g, '\n') + ', [');
  puzzles.forEach((p, i) => {
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < puzzles.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, file), out);
  return out.length;
}

function check(p) {
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  return r;
}

const DIFF_ORDER = (a, b) => a.diff - b.diff; // stable: keeps the planned order (intros first) inside a level
const pad3 = (n) => String(n).padStart(3, '0');

/* ================= labyrinths ================= */

function labyrinths() {
  const rng = C.rng(20260930);
  // [grid, size, algo, diff, options]
  const plan = [
    ['square', [6, 6], 'backtrack', 1], ['square', [8, 6], 'prim', 1], ['hex', 3, 'backtrack', 1], ['theta', 4, 'backtrack', 1],
    ['square', [8, 7], 'kruskal', 1], ['square', [8, 8], 'eller', 1], ['hex', 3, 'wilson', 1], ['theta', 5, 'prim', 1],
    ['square', [9, 7], 'wilson', 1],
    ['square', [10, 8], 'backtrack', 2], ['hex', 4, 'prim', 2], ['theta', 6, 'backtrack', 2], ['square', [12, 9], 'kruskal', 2],
    ['hex', [10, 8], 'backtrack', 2, { shape: 'rect' }], ['square', [12, 10], 'eller', 2], ['theta', 7, 'wilson', 2], ['hex', 5, 'kruskal', 2],
    ['square', [12, 10], 'wilson', 2], ['square', [11, 11], 'backtrack', 2, { braid: 0.3 }], ['theta', 7, 'kruskal', 2], ['square', [13, 9], 'prim', 2],
    ['square', [15, 12], 'backtrack', 3], ['hex', 6, 'backtrack', 3], ['theta', 8, 'prim', 3], ['square', [16, 12], 'kruskal', 3],
    ['hex', [14, 10], 'wilson', 3, { shape: 'rect' }], ['square', [16, 13], 'eller', 3], ['theta', 9, 'backtrack', 3], ['hex', 7, 'prim', 3],
    ['square', [15, 15], 'backtrack', 3, { braid: 0.35 }], ['square', [16, 13], 'wilson', 3], ['theta', 9, 'kruskal', 3], ['hex', 7, 'wilson', 3],
    ['square', [18, 13], 'prim', 3],
    ['square', [20, 15], 'backtrack', 4], ['hex', 8, 'kruskal', 4], ['theta', 10, 'wilson', 4], ['square', [22, 16], 'eller', 4],
    ['hex', [18, 14], 'backtrack', 4, { shape: 'rect' }], ['theta', 11, 'backtrack', 4], ['square', [22, 17], 'kruskal', 4], ['hex', 9, 'backtrack', 4],
    ['square', [20, 20], 'wilson', 4, { braid: 0.35 }], ['theta', 12, 'prim', 4], ['square', [22, 17], 'wilson', 4], ['hex', 9, 'prim', 4, { braid: 0.3, goal: 'centre' }],
    ['square', [26, 20], 'backtrack', 5], ['hex', 11, 'wilson', 5], ['theta', 13, 'backtrack', 5], ['square', [30, 22], 'kruskal', 5],
    ['hex', 12, 'backtrack', 5], ['theta', 14, 'wilson', 5], ['square', [34, 24], 'backtrack', 5], ['square', [26, 26], 'backtrack', 5, { braid: 0.3 }],
    ['theta', 15, 'backtrack', 5], ['square', [30, 22], 'eller', 5]
  ];
  const NAMES = {
    square: ['First Steps', 'The Box Garden', 'Cloister Walk', 'Yew Alley', 'Chequerboard', 'The Old Rectory', 'Kitchen Garden', 'Privet Row',
      'The Long Gallery', 'Stone Court', 'Monastery Library', 'The Parterre', 'Brick Warren', 'Hedge School', 'Castle Keep', 'The Catacombs',
      'Mill Race', 'Tithe Barn', 'Orchard Rows', 'The Great Hall', 'Counting House', 'Archive Stacks', 'The Undercroft', 'Minotaur\'s Lodgings'],
    hex: ['Honeycomb', 'Beehive', 'Basalt Causeway', 'Wasps\' Nest', 'Snowflake', 'Tortoise Shell', 'Dragonfly Wing', 'Hexagon Hall', 'Queen\'s Chamber', 'Snakeskin', 'Paving Stones', 'Soap Bubbles', 'Chicken Wire', 'Pineapple'],
    theta: ['Round Tower', 'Rose Window', 'Tree Rings', 'Whirlpool', 'Ripples', 'Target Practice', 'Lighthouse', 'Gramophone', 'Spider\'s Web', 'Saturn', 'Onion', 'Maelstrom', 'Clock Tower', 'The Drum', 'Snail Shell'],
    braid: ['Island Garden', 'Hand on the Wall', 'Loops and Islands', 'The Folly', 'Forking Paths', 'The Bower', 'The Rotunda']
  };
  const used = { square: 0, hex: 0, theta: 0, braid: 0 };
  const out = [];
  plan.forEach((row, k) => {
    const [grid, size, algo, diff, opt] = row;
    const o = Object.assign({ grid, algo, size }, opt || {});
    if (o.braid == null) o.braid = 0;
    const r = M.genLabyrinth(rng, diff, o);
    const d = r.data;
    if (!d.braid) { delete d.braid; if (grid !== 'hex' || !opt || opt.goal !== 'centre') delete d.goal; }
    if (opt && opt.goal) d.goal = opt.goal;
    const key = d.braid ? 'braid' : grid;
    const title = NAMES[key][used[key]++];
    if (!title) throw new Error('out of names for ' + key);
    const p = { id: 'lab-' + pad3(k + 1), title, diff, text: T.statement(d), data: d, concepts: ['graph'], tags: [grid, algo].concat(d.braid ? ['loops'] : []) };
    const v = check(p);
    p.par = v.par;
    out.push(p);
  });
  // teaching touches for the first few
  out[0].text = 'Your first maze. Walk from the **green arrow** (the way in) to the **gold star** (the way out): use the arrow keys, or drag the glowing dot through the passages. Back-tracking rubs out your trail.';
  out[0].hints = ['Put your right hand on the wall and never let go: in a maze without loops that always gets you out, though not always by the shortest way.'];
  out[2].hints = ['Hexagons have six sides, so there are up to six ways out of every cell. The arrow keys pick the passage that points most nearly their way; dragging is easier here.'];
  out[3].hints = ['In a round maze the centre is the goal. Work from the inside out: which ring touches the centre, and where is its door?'];
  const firstBraid = out.find((p) => p.data.braid);
  firstBraid.hints = ['This maze has loops. The wall-follower still works if you set out from the outer wall — but a centre surrounded by an island of hedge can defeat it.', 'Mark junctions you have tried with the pen or the paint tool: that is Trémaux\'s old method of chalk marks, and it works in any maze.'];

  // the classical labyrinths (unicursal)
  const cretan = {
    id: 'lab-cretan', title: 'The Cretan Labyrinth', diff: 1,
    source: 'The classical seven-circuit design, as on silver coins of Knossos.',
    text: 'The seven-circuit labyrinth of the Minotaur legend, as it appears on ancient coins of Knossos in Crete. It is **unicursal**: one path, no choices, no dead ends. Walk it to the centre — and watch the order in which it visits the circuits (numbered 1 on the outside to 7 on the inside).',
    data: { kind: 'unicursal', seq: [3, 2, 1, 4, 7, 6, 5] },
    explain: 'The path visits the circuits in the order **3, 2, 1, 4, 7, 6, 5**, and then the centre. It swings to the outside, then deep inside, and only reaches the goal from circuit 5 — the longest possible road through the smallest possible space. Labyrinths of this pattern are found scratched, carved and laid in stone across Europe and beyond; the design can be drawn from a small "seed" of a cross, four corners and four dots.',
    concepts: ['graph'], tags: ['classic', 'unicursal', 'labyrinth']
  };
  const eleven = {
    id: 'lab-eleven', title: 'Eleven Circuits', diff: 1,
    text: 'The same idea, grown larger: a unicursal labyrinth of eleven circuits built on the Cretan plan. Walk it in to the centre. Can you predict the circuit order before you start?',
    data: { kind: 'unicursal', seq: [5, 4, 3, 2, 1, 6, 11, 10, 9, 8, 7] },
    explain: 'The order is **5, 4, 3, 2, 1, 6, 11, 10, 9, 8, 7**, then the centre: out from the middle of the outer half to the rim, a jump inward, then in to the middle of the inner half and out again. The Cretan labyrinth is the same pattern with 3 + 1 + 3 circuits; this one has 5 + 1 + 5.',
    concepts: ['graph'], tags: ['unicursal', 'labyrinth']
  };
  const meander = {
    id: 'lab-meander', title: 'A Meander of Our Own', diff: 2,
    text: 'A nine-circuit labyrinth drawn from a different circuit sequence, invented for this cabinet. Walk it in. The turns on each side of the axis nest like brackets — that is what makes any sequence drawable.',
    data: { kind: 'unicursal', seq: [1, 8, 3, 6, 5, 4, 7, 2, 9] },
    explain: 'The order is **1, 8, 3, 6, 5, 4, 7, 2, 9**: a pendulum. It swings from the rim almost to the middle and back in shorter and shorter swings until it reaches circuit 5, then out again in longer and longer ones, and drops into the centre from circuit 9. Write 0 for outside and 10 for the centre, join the circuits in order with arches drawn alternately above and below a line, and the arches never cross — the test for a labyrinth of this classical kind.',
    concepts: ['graph'], tags: ['unicursal', 'labyrinth']
  };
  meander.diff = 1;
  [cretan, eleven, meander].forEach(check);
  // a stable sort by difficulty keeps the planned order inside each level
  const all = [out[0], cretan].concat(out.slice(1), [eleven, meander]).sort((a, b) => a.diff - b.diff);
  const meta = {
    id: 'labyrinths', engine: 'mazes', cat: 'routes', name: 'Labyrinths', order: 8,
    blurb: 'Square, hexagonal and round mazes grown by five different algorithms — and the one-path labyrinth of Crete. Walk them with the keys or a glowing trail.',
    origin: { who: 'Crete, garden mazes and computer science', note: 'The seven-circuit labyrinth appears on coins of Knossos in Crete, the island of the Minotaur legend: one path, no choices. Mazes with real choices came later — the hedge maze at Hampton Court was planted in the 1690s. The mazes here are grown by algorithms from computer science, each with its own texture.' },
    concepts: ['graph', 'spanning-tree']
  };
  const extra = 'Cabinet.concepts([{ id: \'spanning-tree\', name: \'Perfect mazes are spanning trees\', see: [\'graph\'], text: \'Draw a dot in every cell of a maze and join two dots when there is a passage between their cells. A **perfect** maze — exactly one path between any two cells — gives a **tree**: connected, with no loops, and with exactly one line fewer than it has dots. Every maze algorithm is a way of choosing a random spanning tree of the grid: Prim and Kruskal borrowed theirs from the problem of the cheapest network (1956–57), and Wilson\\\'s (1996) picks every tree with equal chance. Add a few extra passages and you get loops — a braided maze.\' }]);';
  const size = write('data/labyrinths.js', meta, all, extra);
  return { n: all.length, size, diffs: count(all) };
}

/* ================= arrow, number, colour and one-way mazes ================= */

function arrows() {
  const rng = C.rng(1990);
  const plan = [];
  // [kind, diff, opts]
  [[1, { w: 4, band: [3, 4], lim: 2 }], [1], [1], [1], [2], [2], [2], [2], [3], [3], [3], [3], [4], [4], [4], [5], [5], [5]].forEach(([dv, o]) => plan.push(['arrow', dv, o]));
  [[1, { w: 4, band: [3, 4], lim: 2 }], [1], [1], [1], [2], [2], [2], [3], [3], [3], [4], [4], [4], [5], [5], [5]].forEach(([dv, o]) => plan.push(['number', dv, o]));
  [[1, { w: 4, h: 4, band: [4, 6], lim: 2 }], [1], [1], [2], [2], [2], [3], [3], [3], [4], [4], [5], [5]].forEach(([dv, o]) => plan.push(['colour', dv, o]));
  [[1, { w: 4, h: 4, band: [4, 6], lim: 2 }], [1], [1], [2], [2], [2], [3], [3, { noLeft: true }], [3], [4], [4, { noLeft: true }], [5], [5, { noLeft: true }]].forEach(([dv, o]) => plan.push(['streets', dv, o]));
  const NAMES = {
    arrow: ['First Arrows', 'Signposts', 'Weathervanes', 'Compass Rose', 'Pointing Fingers', 'Arrow Storm', 'Flight of Geese', 'Needle and North', 'Cupid\'s Quiver', 'The Archery', 'Wind Rose', 'Road Signs', 'Migrating Birds', 'The Quiver', 'Bowstring', 'Longbow', 'Crossbow', 'Robin Hood\'s Luck', 'Magnetic North'],
    number: ['First Jumps', 'Leapfrog', 'Hopscotch', 'Kangaroo Court', 'Springboards', 'Stepping Stones', 'Grasshopper', 'Pogo Stick', 'Trampoline', 'Flea Circus', 'Salmon Leap', 'Long Jump', 'Triple Jump', 'Frog Pond', 'Jack Be Nimble', 'Pole Vault'],
    colour: ['First Colours', 'Painted Streets', 'Two-Tone Town', 'Red Letter Day', 'Bunting', 'Barber\'s Pole', 'Candy Cane', 'Blue Moon', 'Harlequin', 'Traffic Lights', 'Union Street', 'Tartan', 'Stained Glass'],
    streets: ['First Drive', 'One-Way Town', 'Rush Hour', 'Sunday Driver', 'Traffic Warden', 'Market Day', 'School Run', 'Roundabout Way', 'Right Turns Only', 'Gridlock', 'The Ring Road', 'Night Bus', 'Left Out']
  };
  const used = { arrow: 0, number: 0, colour: 0, streets: 0 };
  const out = [];
  const seen = new Set();
  plan.forEach(([kind, diff, o]) => {
    let r = null;
    for (let t = 0; t < 30 && !r; t++) {
      r = M.GEN[kind](rng, diff, Object.assign({}, o || {}));
      if (r && seen.has(JSON.stringify(r.data))) r = null;
    }
    if (!r) throw new Error('could not make ' + kind + ' ' + diff);
    seen.add(JSON.stringify(r.data));
    const title = NAMES[kind][used[kind]++];
    const p = { id: 'amz-' + kind.slice(0, 3) + '-' + pad3(used[kind]), title, diff, text: T.statement(r.data), data: r.data, concepts: ['state-space', 'working-backwards'], tags: [kind] };
    p.par = check(p).par;
    out.push(p);
  });
  const first = (k) => out.find((p) => p.data.kind === k);
  first('arrow').text = 'Welcome to logic mazes, where the rules are the walls. Every square has an arrow; from the square you stand on you may move **any number of squares** in the direction of its arrow — no other way. Get from the glowing ring to the **star**.';
  first('arrow').hints = ['Work backwards: which squares have an arrow pointing straight at the star?', 'Now which squares point at one of *those*? Follow the chain back to where you stand.'];
  first('number').text = 'A jumping maze. Jump **exactly** the number of squares shown on the square you stand on, along its row or its column (never diagonally), landing inside the board. Reach the **star**.';
  first('number').hints = ['From the star, look for squares whose number would carry you onto it.'];
  first('colour').text = 'A town of painted streets. Walk from **S** to **G** along the streets, but the colours must alternate: red, blue, red, blue… You may start on either colour.';
  first('colour').hints = ['A crossing you reach by a red street is a different place from the same crossing reached by blue: the next step differs.'];
  first('streets').text = 'Drive from **S** to **G**. Streets with arrows are one-way; the others go both ways. And no U-turns — once you set off down a street, you cannot simply turn round.';
  first('streets').hints = ['Without U-turns, the only way to reverse is to drive round a block.'];
  out.sort(DIFF_ORDER);
  const meta = {
    id: 'arrow-mazes', engine: 'mazes', cat: 'routes', name: 'Arrow and number mazes', order: 9,
    blurb: 'Logic mazes where the rules are the walls: follow the arrows, jump the numbers, alternate the colours, obey the one-way streets.',
    origin: { year: 1990, who: 'Robert Abbott', note: 'Robert Abbott\'s book *Mad Mazes* (1990) popularised logic mazes: mazes whose walls are rules — arrows to obey, colours to alternate, streets that run one way. The mazes in this drawer are new, found by computer search and checked for a short, nearly unique solution.' },
    concepts: ['state-space', 'working-backwards', 'graph']
  };
  const extra = 'Cabinet.history([{ year: 1990, title: \'Mad Mazes\', text: \'Robert Abbott publishes *Mad Mazes*, a book of logic mazes in which the rules, not the walls, make the maze. Such mazes need a new kind of thinking: the same square can be a dead end or the way through, depending on how you arrived.\', links: [\'arrow-mazes\', \'chase-mazes\'] }]);';
  const size = write('data/arrow-mazes.js', meta, out, extra);
  return { n: out.length, size, diffs: count(out) };
}

/* ================= the rolling die ================= */

function dice() {
  const rng = C.rng(6);
  const plan = [[1, { w: 3, h: 4, band: [3, 5], lim: 2 }], [1, { w: 4, h: 4 }], [1], [1], [1], [1], [1], [1],
    [2], [2], [2], [2], [2], [2], [2], [2], [2],
    [3], [3], [3], [3], [3], [3], [3], [3], [3],
    [4], [4], [4], [4], [4], [4], [4], [4],
    [5], [5], [5], [5], [5], [5]];
  const NAMES = ['First Roll', 'Rolling Stone', 'Tumbling Cube', 'Snake Eyes', 'Six of One', 'Loaded Die', 'Box Cars', 'Knucklebones', 'Craps Table',
    'Pips and Squeaks', 'Roll Call', 'Barrel Roll', 'Cube Root', 'Dicey', 'Tumbleweed', 'Somersault', 'Cartwheel', 'Head over Heels', 'Rock and Roll',
    'The Gambler', 'Lucky Seven', 'Odds and Evens', 'Double Six', 'Cast of Thousands', 'Alea Iacta Est', 'Rolling Thunder', 'Spot the Difference',
    'The Cube Walks', 'Ivory Tower', 'Sugar Lump', 'Hexahedron', 'Fair and Square', 'Backgammon', 'Yahtzee Street', 'Dominoes Fall', 'Six Faces',
    'Heads and Tails', 'Twenty-Four Ways', 'Die Hard', 'The Last Roll'];
  const out = [];
  const seen = new Set();
  plan.forEach(([diff, o], k) => {
    let r = null;
    for (let t = 0; t < 30 && !r; t++) { r = M.genDie(rng, diff, Object.assign({}, o || {})); if (r && seen.has(JSON.stringify(r.data))) r = null; }
    if (!r) throw new Error('could not make a die maze, level ' + diff);
    seen.add(JSON.stringify(r.data));
    const p = { id: 'die-' + pad3(k + 1), title: NAMES[k], diff, text: T.statement(r.data), data: r.data, concepts: ['state-space'], tags: ['die'] };
    p.par = check(p).par;
    out.push(p);
  });
  out[0].text = 'The die starts with **1** on top, **2** facing north (up the screen) and **3** facing east. Roll it square by square — it tips over an edge each time — and you may only roll onto a square whose number is the face that comes up on top. Reach the gold-framed goal.';
  out[0].hints = ['Rolling north brings the south face (7 − 2 = 5) to the top; rolling east brings the west face (7 − 3 = 4) up. Opposite faces always add to 7.', 'The unfolded die in the panel shows every face as you go.'];
  out[1].hints = ['Rolling four times in the same direction brings you back to the same top face.'];
  out.sort(DIFF_ORDER);
  const meta = {
    id: 'rolling-die', engine: 'mazes', cat: 'routes', name: 'Rolling die mazes', order: 10,
    blurb: 'Tip a die across the board: every square you land on must show the number that comes up on top.',
    origin: { who: 'a modern logic-maze genre', note: 'Rolling-block and rolling-die mazes are a modern kind of logic maze: the solid itself is the key, and a square that is closed to one orientation is open to another. These were designed by computer search for a unique short solution.' },
    concepts: ['state-space']
  };
  const size = write('data/rolling-die.js', meta, out);
  return { n: out.length, size, diffs: count(out) };
}

/* ================= the chase ================= */

function chases() {
  const rng = C.rng(1000);
  const plan = [[1, { w: 3, h: 3, band: [3, 6], need: 1, lim: 2 }], [1, { w: 4, h: 3 }], [1], [1], [1], [1], [1], [1],
    [2], [2], [2], [2], [2], [2], [2], [2], [2],
    [3], [3], [3], [3], [3], [3], [3], [3], [3],
    [4], [4], [4], [4], [4], [4], [4], [4],
    [5], [5], [5], [5], [5], [5]];
  const NAMES = ['First Escape', 'Two Steps Behind', 'Horns in the Dark', 'Bull Run', 'Ariadne\'s Thread', 'The Lair', 'Red Rag', 'China Shop',
    'Daedalus\'s Workshop', 'Knossos by Night', 'Hide and Seek', 'The Waiting Game', 'Cat and Mouse', 'Sidestep', 'Matador', 'Stampede',
    'Stalemate', 'Pasiphaë\'s Son', 'The Seventh Youth', 'Sword and Ball of Twine', 'Black Sail', 'Minos\'s Palace', 'The Double Axe',
    'Labrys', 'Bull Leaping', 'Snort', 'Hoofbeats', 'Cornered', 'Dead Ringer', 'Brute Force', 'Slow Bull', 'Waiting Room', 'Lure',
    'Round the Pillar', 'Cul-de-sac', 'Checkmate', 'Last Door', 'Long Way Round', 'Great Escape', 'Out of the Labyrinth'];
  const out = [];
  const seen = new Set();
  plan.forEach(([diff, o], k) => {
    let r = null;
    for (let t = 0; t < 30 && !r; t++) { r = M.genChase(rng, diff, Object.assign({}, o || {})); if (r && seen.has(JSON.stringify(r.data))) r = null; }
    if (!r) throw new Error('could not make a chase, level ' + diff);
    seen.add(JSON.stringify(r.data));
    const p = { id: 'chase-' + pad3(k + 1), title: NAMES[k], diff, text: T.statement(r.data), data: r.data, concepts: ['state-space'], tags: ['chase', 'minotaur'] };
    p.par = check(p).par;
    p.plain = r.plain;
    out.push(p);
  });
  out[0].text = 'Theseus (blue) must leave by the exit. For every step he takes — or every turn he waits — the Minotaur takes **two** steps toward him: across first, if that brings him closer and no wall is in the way; otherwise up or down; otherwise he stands. If the Minotaur reaches Theseus, it is over.';
  out[0].hints = ['Walls are your friends: a Minotaur who wants to move across but has a wall in the way stays put.', 'Sometimes the right move is to wait (Space).'];
  out[1].hints = ['Try to get the Minotaur stuck behind a wall before you make a run for it.'];
  out.forEach((p) => { delete p.plain; });
  out.sort(DIFF_ORDER);
  const meta = {
    id: 'chase-mazes', engine: 'mazes', cat: 'routes', name: 'The chase', order: 11,
    blurb: 'Theseus against the Minotaur: for each step you take, he takes two toward you. Trap him behind a wall and slip out.',
    origin: { who: 'Robert Abbott', note: 'The maze with a pursuer who takes two steps for each of yours, always trying to close the gap across before up or down, was invented by Robert Abbott as "Theseus and the Minotaur". The mazes in this drawer are new, found by computer search.' },
    concepts: ['state-space']
  };
  const size = write('data/chase-mazes.js', meta, out);
  return { n: out.length, size, diffs: count(out) };
}

/* ================= ice and mirrors ================= */

function slides() {
  const rng = C.rng(273);
  const plan = [[1, { w: 5, h: 5, band: [3, 4], lim: 1 }], [1], [1], [1], [1], [1], [1], [1],
    [2], [2], [2], [2], [2], [2], [2], [2, { sand: true }], [2, { mirrors: true }],
    [3], [3], [3], [3], [3], [3], [3, { mirrors: true }], [3, { mirrors: true }], [3, { mirrors: true }],
    [4], [4], [4], [4], [4], [4], [4], [4, { mirrors: false }],
    [5], [5], [5], [5], [5], [5, { mirrors: false }]];
  const NAMES = ['First Slide', 'Frozen Lake', 'Skating Rink', 'Glacier', 'Black Ice', 'Cold Snap', 'Curling Stone', 'Hockey Puck', 'Ice Floe',
    'Snowdrift', 'Penguin Walk', 'Figure of Eight', 'Permafrost', 'Hailstones', 'Frost Fair', 'Snow Patch', 'First Mirror',
    'Winter Palace', 'Icicle', 'Sledge Run', 'Polar Night', 'Thin Ice', 'Iceberg', 'Periscope', 'Hall of Mirrors', 'Looking-Glass Lake',
    'Northern Lights', 'Ice Maze', 'Snow Queen', 'Crevasse', 'Kaleidoscope', 'Mirror Mirror', 'Deep Freeze', 'Tundra',
    'Aurora', 'Absolute Zero', 'Snowblind', 'Diamond Dust', 'Ice Palace', 'The Big Chill'];
  const out = [];
  const seen = new Set();
  plan.forEach(([diff, o], k) => {
    let r = null;
    for (let t = 0; t < 30 && !r; t++) { r = M.genIce(rng, diff, Object.assign({}, o || {})); if (r && seen.has(JSON.stringify(r.data))) r = null; }
    if (!r) throw new Error('could not make an ice maze, level ' + diff);
    seen.add(JSON.stringify(r.data));
    const p = { id: 'ice-' + pad3(k + 1), title: NAMES[k], diff, text: T.statement(r.data), data: r.data, concepts: ['state-space', 'graph'], tags: ['ice'] };
    if (/[/\\]/.test(r.data.rows.join(''))) p.tags.push('mirrors');
    p.par = check(p).par;
    out.push(p);
  });
  out[0].text = 'The floor is ice. Push off in any direction and you slide until a rock or the wall stops you — you cannot stop halfway. Come to rest on the **flag**.';
  out[0].hints = ['The flag only counts if you *stop* on it. What could stop you there?'];
  const fm = out.find((p) => p.tags.includes('mirrors'));
  fm.hints = ['A mirror turns you through a right angle as you pass over it: / sends you from east to north (and north to east), \\ from east to south.'];
  const fs2 = out.find((p) => p.data.rows.join('').indexOf(':') >= 0);
  if (fs2) fs2.hints = (fs2.hints || []).concat(['The pale squares are snow: you stop dead the moment you slide onto one.']);
  out.sort(DIFF_ORDER);
  const meta = {
    id: 'sliding-mazes', engine: 'mazes', cat: 'routes', name: 'Ice and mirrors', order: 12,
    blurb: 'Slide on ice until something stops you. Rocks, snow and mirrors decide where you can come to rest.',
    origin: { who: 'computer puzzle games', note: 'Sliding until something stops you is a favourite rule of computer puzzle games — ice caves, skating rinks, rolling balls. The maze is not the floor but the handful of places where you can stop. These mazes were found by computer search.' },
    concepts: ['state-space', 'graph']
  };
  const size = write('data/sliding-mazes.js', meta, out);
  return { n: out.length, size, diffs: count(out) };
}

function count(list) { const c = [0, 0, 0, 0, 0, 0]; list.forEach((p) => c[p.diff]++); return c.slice(1).join('/'); }

const which = process.argv[2];
const jobs = { labyrinths, arrows, dice, chases, slides };
Object.keys(jobs).forEach((k) => {
  if (which && which !== k) return;
  const t0 = Date.now();
  const r = jobs[k]();
  console.log(k.padEnd(11) + ' ' + String(r.n).padStart(3) + ' puzzles  (diff ' + r.diffs + ')  ' + Math.round(r.size / 1024) + ' KB  ' + (Date.now() - t0) + ' ms');
});
