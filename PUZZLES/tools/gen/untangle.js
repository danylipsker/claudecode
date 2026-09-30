/* The Puzzle Cabinet · tools/gen/untangle.js
 *
 *   node tools/gen/untangle.js        writes data/untangle.js
 *
 * Every puzzle is a planar net whose dots start on a circle in a shuffled
 * order. Most nets come from k straight lines that all cross one another (the
 * dots are the crossings, the lines join neighbouring crossings — so the
 * lines themselves are one untangled drawing); some are random planar nets;
 * a few are the corner-and-edge nets of solids. Made by js/lib/graphgen.js
 * with fixed seeds.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/graphlib.js'));
require(path.join(ROOT, 'js/lib/graphgen.js'));
require(path.join(ROOT, 'engines/graphs.js'));
const GL = C.GraphLib, GG = C.GraphGen;
const eng = C.engines.graphs;
const r2 = (v) => Math.round(v * 100) / 100;

// Tutte's drawing: the outer face on a circle, every other dot at the average of its neighbours
function tutte(n, E, outer, iters) {
  const adj = GL.adjacency(n, E);
  const P = new Array(n).fill(null).map(() => [50, 50]);
  const fixed = new Set(outer);
  outer.forEach((v, i) => { const a = Math.PI * 2 * i / outer.length - Math.PI / 2; P[v] = [50 + 46 * Math.cos(a), 50 + 46 * Math.sin(a)]; });
  for (let it = 0; it < (iters || 2000); it++) {
    for (let v = 0; v < n; v++) {
      if (fixed.has(v)) continue;
      let x = 0, y = 0;
      adj[v].forEach((w) => { x += P[w][0]; y += P[w][1]; });
      P[v] = [x / adj[v].length, y / adj[v].length];
    }
  }
  return P.map((p) => [r2(p[0]), r2(p[1])]);
}
function fromCoords(pts, d2) {
  const E = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1], pts[i][2] - pts[j][2]);
    if (Math.abs(d - d2) < 1e-6) E.push([i, j]);
  }
  return E;
}
function findTriangle(n, E) {
  const adj = GL.adjacency(n, E);
  for (let a = 0; a < n; a++) for (const b of adj[a]) for (const c of adj[b]) if (c !== a && adj[c].includes(a)) return [a, b, c];
  return null;
}
const phi = (1 + Math.sqrt(5)) / 2;

function solids() {
  const out = [];
  // cube: outer square, inner square
  {
    const V = [], E = [];
    for (let i = 0; i < 4; i++) { const a = Math.PI / 2 * i - Math.PI / 4; V.push([50 + 46 * Math.cos(a), 50 + 46 * Math.sin(a)]); }
    for (let i = 0; i < 4; i++) { const a = Math.PI / 2 * i - Math.PI / 4; V.push([50 + 20 * Math.cos(a), 50 + 20 * Math.sin(a)]); }
    for (let i = 0; i < 4; i++) { E.push([i, (i + 1) % 4]); E.push([4 + i, 4 + (i + 1) % 4]); E.push([i, 4 + i]); }
    out.push({ key: 'cube', title: 'Flatten the Cube', v: V.map((p) => [r2(p[0]), r2(p[1])]), e: E, text: 'The eight dots and twelve lines are the corners and edges of a cube. Drag them into a flat picture with no crossings — as if you were looking into an open box from above.', explain: 'Looking into a box from above shows the answer: a small square (the bottom) inside a big one (the rim), with the four side edges joining corner to corner. Every convex solid can be flattened like this without crossings.' });
  }
  // octahedron: outer triangle, inner triangle turned half a turn
  {
    const V = [], E = [];
    for (let i = 0; i < 3; i++) { const a = Math.PI * 2 * i / 3 - Math.PI / 2; V.push([50 + 46 * Math.cos(a), 50 + 46 * Math.sin(a)]); }
    for (let i = 0; i < 3; i++) { const a = Math.PI * 2 * i / 3 + Math.PI / 2; V.push([50 + 16 * Math.cos(a), 50 + 16 * Math.sin(a)]); }
    for (let i = 0; i < 3; i++) { E.push([i, (i + 1) % 3]); E.push([3 + i, 3 + (i + 1) % 3]); }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { const a = Math.PI * 2 * i / 3 - Math.PI / 2, b = Math.PI * 2 * j / 3 + Math.PI / 2; if (Math.cos(a - b) < 0.9 && Math.abs(Math.cos(a - b) + 1) > 1e-6) E.push([i, 3 + j]); }
    out.push({ key: 'octahedron', title: 'Flatten the Octahedron', v: V.map((p) => [r2(p[0]), r2(p[1])]), e: E, text: 'Six dots, twelve lines: the corners and edges of an octahedron, two pyramids base to base. Untangle it.' });
  }
  // icosahedron and dodecahedron from 3D coordinates, drawn Tutte's way
  {
    const P3 = [];
    [-1, 1].forEach((a) => [-1, 1].forEach((b) => { P3.push([0, a, b * phi]); P3.push([a, b * phi, 0]); P3.push([b * phi, 0, a]); }));
    const E = fromCoords(P3, 2);
    const V = tutte(12, E, findTriangle(12, E));
    out.push({ key: 'icosahedron', title: 'Flatten the Icosahedron', v: V, e: E, text: 'Twelve dots and thirty lines: the corners and edges of an icosahedron, the twenty-faced solid. Every face is a triangle — and so is every gap in the untangled picture.' });
  }
  {
    // dodecahedron in its usual flat drawing: pentagon, ring of ten, pentagon
    const V = [], E = [];
    for (let i = 0; i < 5; i++) { const a = (-90 + 72 * i) * Math.PI / 180; V.push([50 + 47 * Math.cos(a), 50 + 47 * Math.sin(a)]); }
    for (let j = 0; j < 10; j++) { const a = (-90 + 36 * j) * Math.PI / 180, r = j % 2 ? 29 : 33; V.push([50 + r * Math.cos(a), 50 + r * Math.sin(a)]); }
    for (let i = 0; i < 5; i++) { const a = (-90 + 72 * i + 36) * Math.PI / 180; V.push([50 + 15 * Math.cos(a), 50 + 15 * Math.sin(a)]); }
    for (let i = 0; i < 5; i++) { E.push([i, (i + 1) % 5]); E.push([i, 5 + 2 * i]); E.push([5 + 2 * i + 1, 15 + i]); E.push([15 + i, 15 + (i + 1) % 5]); }
    for (let j = 0; j < 10; j++) E.push([5 + j, 5 + (j + 1) % 10]);
    out.push({ key: 'dodecahedron', title: 'Flatten the Dodecahedron', v: V.map((p) => [r2(p[0]), r2(p[1])]), e: E, text: 'Twenty dots, thirty lines: the corners and edges of a dodecahedron — the solid of Hamilton\'s Icosian game. Every gap in the untangled picture is a pentagon.' });
  }
  // a wheel and a grid
  {
    const V = [[50, 50]], E = [];
    for (let i = 0; i < 8; i++) { const a = Math.PI * 2 * i / 8 - Math.PI / 2; V.push([r2(50 + 46 * Math.cos(a)), r2(50 + 46 * Math.sin(a))]); E.push([0, 1 + i]); E.push([1 + i, 1 + (i + 1) % 8]); }
    out.push({ key: 'wheel', title: 'The Cartwheel', v: V, e: E, text: 'A hub, eight spokes and a rim — scrambled by a mischievous wheelwright. Put the wheel back together without a single crossing.' });
  }
  {
    const V = [], E = [];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) V.push([10 + j * 26.67, 10 + i * 26.67].map(r2));
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { if (j < 3) E.push([i * 4 + j, i * 4 + j + 1]); if (i < 3) E.push([i * 4 + j, (i + 1) * 4 + j]); }
    out.push({ key: 'grid', title: 'The Fishing Net', v: V, e: E, text: 'Sixteen knots of a square fishing net, pulled into a heap. Spread the net flat again so that no two strings cross.' });
  }
  return out;
}

const SPICE = [
  'Somebody knitted this in the dark.',
  'The cat got at it.',
  'It was tidy once, honestly.',
  'Every line is still attached to the same two dots — only the dots have wandered.',
  'Pull gently: no line may be cut.',
  'A net fresh from the washing machine.',
  'It can be done: this net was flat before it was muddled.',
  'Start with a triangle and grow outwards.',
  'Red lines are the ones in trouble.',
  'Patience untangles what cleverness cannot.',
  '',
  ''
];

function main() {
  const puzzles = [];
  const rngT = C.rng(2005);
  const titles = [];
  GG.TANGLE_A.forEach((a) => GG.TANGLE_N.forEach((b) => titles.push('The ' + a + ' ' + b)));
  rngT.shuffle(titles);
  let ti = 0;
  const add = (g, extra) => {
    const n = g.v.length;
    const p = {
      id: '', title: extra.title || titles[ti++], diff: GG.untangleDiff(n),
      text: extra.text || (C.plural(n, 'dot') + ' and ' + C.plural(g.e.length, 'line') + '. Drag the dots until no two lines cross. ' + rngT.pick(SPICE)).trim(),
      concepts: ['planarity'],
      data: { kind: 'untangle', v: g.v, e: g.e, emb: g.emb }
    };
    if (extra.explain) p.explain = extra.explain;
    if (extra.tags) p.tags = extra.tags;
    p._n = n;
    puzzles.push(p);
  };
  // nets of crossing lines
  const plan = [[4, 8], [5, 14], [6, 16], [7, 16], [8, 12], [9, 8], [10, 5]];
  let rng = C.rng(20050);
  plan.forEach(([k, count]) => {
    for (let c = 0; c < count; c++) {
      const g = GG.lines(rng, k);
      if (!g) throw new Error('no net of ' + k + ' lines');
      add(g, { explain: 'The dots are the points where ' + GG.NUM[k] + ' straight lines cross one another, and each line joins neighbouring crossings — so one untangled drawing is simply those ' + GG.NUM[k] + ' straight lines, each crossing every other once. Any drawing without a crossing counts.', tags: ['lines'] });
    }
  });
  // random planar nets
  rng = C.rng(20051);
  [[9, 3], [12, 4], [15, 4], [20, 3], [26, 3]].forEach(([n, count]) => {
    for (let c = 0; c < count; c++) {
      const g = GG.scatter(rng, n, 3.3 + (c % 3) * 0.35);
      if (!g) throw new Error('no net of ' + n);
      add(g, { explain: 'This net was made by scattering ' + n + ' dots and joining near neighbours without crossings. The drawing the cabinet shows is one untangled picture of many.', tags: ['random'] });
    }
  });
  // solids
  rng = C.rng(20052);
  solids().forEach((s) => {
    const v = GG.scramble(rng, s.v.length, s.e, s.v);
    if (!v) throw new Error('could not scramble ' + s.key);
    add({ v, e: s.e, emb: s.v }, { title: s.title, text: s.text, explain: s.explain || 'Every convex solid\'s corners and edges can be drawn flat without crossings: look at it from just outside one face, and that face becomes the outline with everything else inside.', tags: ['solid'] });
  });
  puzzles.sort((a, b) => a.diff - b.diff || a._n - b._n);
  puzzles.forEach((p, i) => {
    delete p._n;
    p.id = 'untangle-' + String(i + 1).padStart(3, '0');
    const r = eng.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
  });
  const meta = {
    id: 'untangle', engine: 'graphs', cat: 'routes', name: 'Untangle', order: 5,
    blurb: 'A net of dots and lines in a hopeless muddle. Drag the dots until no two lines cross.',
    origin: { year: 2005, who: 'John Tantalo', note: 'John Tantalo\'s game *Planarity* (2005) made untangling popular, and Simon Tatham\'s puzzle collection has its own *Untangle*. The mathematics is older: which nets can be drawn flat without crossings was settled by Kuratowski in 1930.' },
    concepts: ['planarity', 'graph']
  };
  const lines = puzzles.map((p) => '  ' + JSON.stringify(p));
  const out = '/* The Puzzle Cabinet · data/untangle.js — made by tools/gen/untangle.js */\nCabinet.family(' + JSON.stringify(meta, null, 2) + ', [\n' + lines.join(',\n') + '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data/untangle.js'), out);
  const cnt = {};
  puzzles.forEach((p) => { cnt[p.diff] = (cnt[p.diff] || 0) + 1; });
  console.log('untangle: ' + puzzles.length + ' puzzles ' + JSON.stringify(cnt) + ', ' + Math.round(out.length / 1024) + ' KB');
}

main();
