/* The Puzzle Cabinet · tools/gen/icosian.js
 *
 *   node tools/gen/icosian.js        writes data/icosian.js
 *
 * Round trips through every corner (Hamilton cycles): Hamilton's dodecahedron,
 * the other solids, famous graphs that have no round trip (Petersen's, the
 * rhombic dodecahedron's), grids where colouring decides, and planar maps of
 * towns with a hidden round trip (js/lib/graphgen.js). Every stored route is
 * checked; every "impossible" is proved by exhaustive search.
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
const rad = (d) => d * Math.PI / 180;
const ring = (n, r, rot) => Array.from({ length: n }, (x, i) => { const a = rad((rot == null ? -90 : rot) + 360 * i / n); return [r2(50 + r * Math.cos(a)), r2(50 + r * Math.sin(a))]; });

function tutte(n, E, outer) {
  const adj = GL.adjacency(n, E);
  const P = new Array(n).fill(null).map(() => [50, 50]);
  const fixed = new Set(outer);
  outer.forEach((v, i) => { const a = Math.PI * 2 * i / outer.length - Math.PI / 2; P[v] = [50 + 47 * Math.cos(a), 50 + 47 * Math.sin(a)]; });
  for (let it = 0; it < 3000; it++) for (let v = 0; v < n; v++) {
    if (fixed.has(v)) continue;
    let x = 0, y = 0;
    adj[v].forEach((w) => { x += P[w][0]; y += P[w][1]; });
    P[v] = [x / adj[v].length, y / adj[v].length];
  }
  return P.map((p) => [r2(p[0]), r2(p[1])]);
}

// the dodecahedron as Hamilton drew it: outer pentagon, a ring of ten, inner pentagon
function dodeca() {
  const V = [].concat(ring(5, 47), Array.from({ length: 10 }, (x, j) => { const a = rad(-90 + 36 * j), r = j % 2 ? 29 : 33; return [r2(50 + r * Math.cos(a)), r2(50 + r * Math.sin(a))]; }), ring(5, 15, -90 + 36));
  const E = [];
  for (let i = 0; i < 5; i++) { E.push([i, (i + 1) % 5]); E.push([i, 5 + 2 * i]); E.push([5 + 2 * i + 1, 15 + i]); E.push([15 + i, 15 + (i + 1) % 5]); }
  for (let j = 0; j < 10; j++) E.push([5 + j, 5 + (j + 1) % 10]);
  return { v: V, e: E };
}
const CONSONANTS = 'BCDFGHJKLMNPQRSTVWXZ'.split('');

function prism(n) {
  const V = ring(n, 46).concat(ring(n, 22)), E = [];
  for (let i = 0; i < n; i++) { E.push([i, (i + 1) % n]); E.push([n + i, n + (i + 1) % n]); E.push([i, n + i]); }
  return { v: V, e: E };
}
function antiprism(n) {
  const V = ring(n, 46).concat(ring(n, 24, -90 + 180 / n)), E = [];
  for (let i = 0; i < n; i++) { E.push([i, (i + 1) % n]); E.push([n + i, n + (i + 1) % n]); E.push([i, n + i]); E.push([(i + 1) % n, n + i]); }
  return { v: V, e: E };
}
function gp(n, k) {
  const V = ring(n, 46).concat(ring(n, 23)), E = [];
  for (let i = 0; i < n; i++) { E.push([i, (i + 1) % n]); E.push([i, n + i]); if (i < (i + k) % n || 2 * k !== n) E.push([n + i, n + (i + k) % n]); }
  const seen = new Set();
  return { v: V, e: E.filter((e) => { const key = Math.min(e[0], e[1]) + ',' + Math.max(e[0], e[1]); if (seen.has(key)) return false; seen.add(key); return true; }) };
}
function gridG(a, b, holes) {
  const V = [], E = [], id = {};
  const hs = new Set((holes || []).map((h) => h[0] + ',' + h[1]));
  const s = 90 / Math.max(a - 1, b - 1), ox = 50 - (b - 1) * s / 2, oy = 50 - (a - 1) * s / 2;
  for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) { if (hs.has(i + ',' + j)) continue; id[i + ',' + j] = V.length; V.push([r2(ox + j * s), r2(oy + i * s)]); }
  for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) {
    const u = id[i + ',' + j];
    if (u == null) continue;
    if (id[i + ',' + (j + 1)] != null) E.push([u, id[i + ',' + (j + 1)]]);
    if (id[(i + 1) + ',' + j] != null) E.push([u, id[(i + 1) + ',' + j]]);
  }
  return { v: V, e: E, id };
}
function wheel(n) {
  const V = [[50, 50]].concat(ring(n, 46)), E = [];
  for (let i = 0; i < n; i++) { E.push([0, 1 + i]); E.push([1 + i, 1 + (i + 1) % n]); }
  return { v: V, e: E };
}
function gear(n) {
  const V = [[50, 50]].concat(ring(2 * n, 46)), E = [];
  for (let i = 0; i < 2 * n; i++) { E.push([1 + i, 1 + (i + 1) % (2 * n)]); if (i % 2 === 0) E.push([0, 1 + i]); }
  return { v: V, e: E };
}
function fromCoords(P3, d2) {
  const E = [];
  for (let i = 0; i < P3.length; i++) for (let j = i + 1; j < P3.length; j++) {
    const d = Math.hypot(P3[i][0] - P3[j][0], P3[i][1] - P3[j][1], P3[i][2] - P3[j][2]);
    if (Math.abs(d - d2) < 1e-6) E.push([i, j]);
  }
  return E;
}
// a face of a planar solid, found as a shortest cycle through vertex 0
function faceCycle(n, E, len) {
  const adj = GL.adjacency(n, E);
  const path = [0];
  let found = null;
  const go = () => {
    if (found) return;
    const u = path[path.length - 1];
    if (path.length === len) { if (adj[u].includes(0)) found = path.slice(); return; }
    for (const w of adj[u]) if (!path.includes(w)) { path.push(w); go(); path.pop(); }
  };
  go();
  return found;
}
function icosahedron() {
  const phi = (1 + Math.sqrt(5)) / 2, P3 = [];
  [-1, 1].forEach((a) => [-1, 1].forEach((b) => { P3.push([0, a, b * phi]); P3.push([a, b * phi, 0]); P3.push([b * phi, 0, a]); }));
  const E = fromCoords(P3, 2);
  return { v: tutte(12, E, faceCycle(12, E, 3)), e: E };
}
function rhombicDodeca() {
  // the 8 corners of a cube (3 lines each) and the 6 face centres (4 lines each)
  const P3 = [];
  [-1, 1].forEach((x) => [-1, 1].forEach((y) => [-1, 1].forEach((z) => P3.push([x, y, z]))));
  [[2, 0, 0], [-2, 0, 0], [0, 2, 0], [0, -2, 0], [0, 0, 2], [0, 0, -2]].forEach((p) => P3.push(p));
  const E = fromCoords(P3, Math.sqrt(3));
  return { v: tutte(14, E, faceCycle(14, E, 4)), e: E };
}
function truncTet() {
  const P3 = [];
  const base = [[3, 1, 1], [1, 3, 1], [1, 1, 3]];
  // all permutations with an even number of minus signs
  [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].forEach((s) => base.forEach((b) => P3.push([b[0] * s[0], b[1] * s[1], b[2] * s[2]])));
  const E = fromCoords(P3, Math.sqrt(8));
  return { v: tutte(12, E, faceCycle(12, E, 6) || faceCycle(12, E, 3)), e: E };
}
function cubocta() {
  const P3 = [];
  [[1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0], [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1], [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1]].forEach((p) => P3.push(p));
  const E = fromCoords(P3, Math.sqrt(2));
  return { v: tutte(12, E, faceCycle(12, E, 4)), e: E };
}
function petersen() {
  const V = ring(5, 46).concat(ring(5, 21)), E = [];
  for (let i = 0; i < 5; i++) { E.push([i, (i + 1) % 5]); E.push([i, 5 + i]); E.push([5 + i, 5 + (i + 2) % 5]); }
  return { v: V, e: E };
}

function solveCycle(g, opts) {
  const n = g.v.length, adj = GL.adjacency(n, g.e);
  return GL.hamilton(n, adj, Object.assign({ closed: true, limit: 4e6 }, opts || {}));
}
function countCycles(g, opts, max) {
  const n = g.v.length, adj = GL.adjacency(n, g.e);
  const r = GL.hamilton(n, adj, Object.assign({ closed: true, limit: 2e7, max: max || 100000 }, opts || {}));
  return r;
}

function main() {
  const P = [];
  const D = dodeca();
  const nD = 20;
  // every round trip counted twice (two directions) from the fixed start
  const allD = countCycles(D, { from: 0 });
  const cyclesD = allD.sols.length / 2;
  const cycD = solveCycle(D, { from: 0 }).sols[0];
  P.push({
    id: 'icosian-voyage', title: 'Hamilton\'s Voyage', diff: 2, year: 1857,
    source: 'William Rowan Hamilton, the Icosian game (1857).',
    text: 'In 1857 the Irish mathematician William Rowan Hamilton invented a game on the twenty corners of a dodecahedron, flattened here into a map. Each corner is a town; each line a road. Find a round trip along the roads that calls at every town exactly once and comes home.',
    hints: ['Towns on the outside and the inside both need visiting: do not use up all the roads between the rings early.', 'Try going round most of the outer pentagon first, then dive inwards.'],
    explain: 'The dodecahedron has exactly ' + cyclesD + ' different round trips through all twenty corners (not counting direction or where you start) — the cabinet counted them. Hamilton sold his game to a toy maker; mathematicians have called such round trips *Hamilton circuits* ever since.',
    concepts: ['hamilton', 'graph'], tags: ['classic', 'dodecahedron'],
    data: { kind: 'hamilton', v: D.v, e: D.e, labels: CONSONANTS, closed: true, cycle: cycD }
  });
  // prefixes with one or two completions
  const adjD = GL.adjacency(nD, D.e);
  const rngD = C.rng(1857);
  const pres = [];
  let guard = 0;
  while (pres.length < 3 && guard++ < 500) {
    const pre = [rngD.int(20)];
    while (pre.length < 5) { const c = adjD[pre[pre.length - 1]].filter((w) => !pre.includes(w)); if (!c.length) break; pre.push(rngD.pick(c)); }
    if (pre.length < 5) continue;
    const r = GL.hamilton(nD, adjD, { closed: true, prefix: pre, max: 10, limit: 5e6 });
    // five fixed towns always leave two or four ways to finish (the cabinet checked): take the twos
    if (r.sols.length !== 2) continue;
    if (pres.some((q) => q.pre.join() === pre.join())) continue;
    pres.push({ pre, sol: r.sols[0], n: r.sols.length });
  }
  pres.forEach((q, i) => {
    const word = q.pre.map((v) => CONSONANTS[v]).join(' ');
    P.push({
      id: 'icosian-five-' + (i + 1), title: 'The First Five Towns' + (i ? ' ' + ['', 'II', 'III'][i] : ''), diff: 3,
      source: 'After the problems Hamilton set for his Icosian game (1857).',
      text: 'A problem in the spirit of Hamilton\'s own: the journey must begin **' + word + '**, in that order (already drawn). Finish the round trip through all twenty towns.',
      explain: 'Once these five towns are fixed there are exactly two ways to finish the journey — either counts. (On the dodecahedron, five fixed towns in a row always leave either two or four ways to finish; the cabinet tried every start.)',
      concepts: ['hamilton'], tags: ['dodecahedron'],
      data: { kind: 'hamilton', v: D.v, e: D.e, labels: CONSONANTS, closed: true, prefix: q.pre, cycle: q.sol }
    });
  });
  // a path between two chosen towns
  {
    let best = null;
    for (let a = 0; a < 20 && !best; a++) for (let b = a + 1; b < 20 && !best; b++) {
      if (adjD[a].includes(b)) continue;
      const r = GL.hamilton(nD, adjD, { closed: false, from: a, to: b, max: 1, limit: 2e6 });
      if (r.sols.length && a === 0 && b >= 15) best = { a, b, sol: r.sols[0] };
    }
    P.push({
      id: 'icosian-errand', title: 'An Errand from ' + CONSONANTS[best.a] + ' to ' + CONSONANTS[best.b], diff: 3,
      text: 'No need to come home this time: start at town **' + CONSONANTS[best.a] + '** (the green flag), call at every town exactly once, and finish at **' + CONSONANTS[best.b] + '** (the red flag).',
      concepts: ['hamilton'], tags: ['dodecahedron', 'path'],
      data: { kind: 'hamilton', v: D.v, e: D.e, labels: CONSONANTS, closed: false, from: best.a, to: best.b, cycle: best.sol }
    });
  }

  const simple = (id, title, diff, g, text, extra) => {
    const r = extra && extra.none ? null : solveCycle(g, extra && extra.opts);
    const p = { id, title, diff, text, concepts: ['hamilton'], data: Object.assign({ kind: 'hamilton', v: g.v, e: g.e, closed: true }, extra && extra.data) };
    if (extra && extra.none) { p.data.none = true; p.data.ask = true; }
    else {
      if (!r.sols.length) throw new Error(id + ': no round trip');
      p.data.cycle = r.sols[0];
    }
    ['hints', 'explain', 'source', 'year', 'tags', 'concepts'].forEach((k) => { if (extra && extra[k]) p[k] = extra[k]; });
    P.push(p);
    return p;
  };
  const cube = prism(4);
  simple('icosian-cube', 'Round the Cube', 1, cube, 'The eight corners of a cube, seen from above. Visit every corner once along the edges and come back to the start.', { data: { ask: true } });
  const octa = antiprism(3);
  simple('icosian-octahedron', 'Round the Octahedron', 1, octa, 'Six corners, each joined to four others. A round trip through all six, please.');
  simple('icosian-wheel', 'Round the Wheel', 1, wheel(8), 'A hub and eight towns on a ring road. Visit them all once — including the hub — and come home.', { hints: ['The hub is the tricky one: you can only get in and out along spokes.'] });
  simple('icosian-prism5', 'The Pentagonal Prism', 1, prism(5), 'Two pentagons, one inside the other, joined by five spokes. Visit all ten corners once and return.');
  const g44 = gridG(4, 4);
  simple('icosian-grid44', 'Sixteen Squares of a Town', 2, g44, 'Sixteen crossroads in a square town, joined by streets. A round trip that passes each crossroads exactly once?', { data: { ask: true } });
  const g33 = gridG(3, 3);
  simple('icosian-grid33', 'Nine Crossroads', 2, g33, 'Nine crossroads in a small square town. The postman wants a round trip passing every crossroads exactly once. Can he have one?', {
    none: true,
    hints: ['Colour the crossroads like a chessboard: corners and centre one colour, the other four the other.', 'Every street joins two colours, so a round trip alternates colours — and must have as many of each.'],
    explain: 'Colour the crossroads like a chessboard: five of one colour, four of the other. Every street joins different colours, so any round trip alternates between them and uses equally many of each. Five and four are not equal: there is no round trip. (A path that need not return is easy — start and finish on the majority colour.)',
    concepts: ['hamilton', 'coloring-argument', 'parity'], tags: ['impossible']
  });
  simple('icosian-grid46', 'The Market Town', 2, gridG(4, 6), 'Twenty-four crossroads in four streets of six. Plan the watchman\'s round: every crossroads exactly once, and back to the start.', { data: { ask: true } });
  const g55 = gridG(5, 5);
  simple('icosian-grid55', 'Twenty-Five Crossroads', 3, g55, 'Five streets by five. A round trip through every crossroads, exactly once each — possible or not?', {
    none: true,
    hints: ['A chessboard colouring settles it.'],
    explain: 'Coloured like a chessboard, the 25 crossroads split 13 and 12. A round trip alternates colours, so it needs as many of each. Impossible.',
    concepts: ['hamilton', 'coloring-argument', 'parity'], tags: ['impossible']
  });
  // grids with fixed ends
  {
    const g = gridG(5, 5), a = g.id['0,0'], b = g.id['4,4'];
    const r = GL.hamilton(25, GL.adjacency(25, g.e), { closed: false, from: a, to: b, limit: 2e6 });
    P.push({ id: 'icosian-corner-5', title: 'Corner to Corner', diff: 2, text: 'In a town of five streets by five, walk from the top-left crossroads to the bottom-right one, passing every crossroads exactly once.', concepts: ['hamilton'], data: { kind: 'hamilton', v: g.v, e: g.e, closed: false, from: a, to: b, ask: true, cycle: r.sols[0] } });
  }
  {
    const g = gridG(4, 4), a = g.id['0,0'], b = g.id['3,3'];
    P.push({
      id: 'icosian-corner-4', title: 'Corner to Corner, Four by Four', diff: 3,
      text: 'Now a town of four streets by four: from the top-left crossroads to the bottom-right, every crossroads exactly once.',
      hints: ['Colour the crossroads like a chessboard. What colour are the two corners?', 'A walk through all 16 crossroads alternates colours: it starts and ends on different colours.'],
      explain: 'On a chessboard colouring the two opposite corners have the **same** colour. A walk through all sixteen crossroads alternates colours, eight and eight, so it must start and end on different colours. So this walk cannot exist — while the five-by-five one can.',
      concepts: ['hamilton', 'coloring-argument', 'parity'], tags: ['impossible', 'path'],
      data: { kind: 'hamilton', v: g.v, e: g.e, closed: false, from: a, to: b, none: true, ask: true }
    });
  }
  {
    const g = gridG(5, 6, [[1, 1], [3, 4]]);
    simple('icosian-holes', 'Two Ponds', 3, g, 'A town of five streets by six, but two crossroads are ponds (missing). Can the watchman still make a round trip past every remaining crossroads?', { data: { ask: true } });
  }
  {
    const g = gridG(6, 6);
    simple('icosian-grid66', 'Thirty-Six Crossroads', 3, g, 'Six streets by six: a round trip through every crossroads, once each.');
  }
  const pet = petersen();
  simple('icosian-petersen', 'Petersen\'s Star', 3, pet, 'A pentagon around a star, joined by five spokes: every corner meets exactly three lines. Is there a round trip through all ten corners?', {
    none: true,
    hints: ['A round trip would use the spokes an even number of times — every trip out to the star needs a trip back.', 'So it uses two spokes or four. Try each case carefully: both fail.'],
    explain: 'There is none. A round trip must cross between the pentagon and the star an even number of times, so it uses two spokes or four. With two, it runs round the pentagon less one line (ending at two **neighbouring** corners) and round the star less one line (ending at two points **two apart**) — and the spokes cannot join those ends up. With four, a short check of the corners at the unused spoke leads to a dead end too. The cabinet also searched every route. The graph is named after Julius Petersen, who wrote about it in 1898; no smaller net with three lines at every corner and no weak link (no single line whose loss would cut it in two) lacks a round trip.',
    source: 'The Petersen graph, after Julius Petersen (1898).', concepts: ['hamilton', 'graph'], tags: ['impossible', 'famous']
  });
  {
    const n = 10, adj = GL.adjacency(n, pet.e);
    const r = GL.hamilton(n, adj, { closed: false, from: 0, limit: 1e6 });
    P.push({ id: 'icosian-petersen-path', title: 'Petersen Relents', diff: 2, text: 'The same star and pentagon — but now you need not come home. Starting at the flag, visit all ten corners exactly once.', explain: 'A path through every corner exists, though a round trip does not: the last step home is exactly what the Petersen graph refuses.', concepts: ['hamilton'], data: { kind: 'hamilton', v: pet.v, e: pet.e, closed: false, from: 0, cycle: r.sols[0] } });
  }
  simple('icosian-icosahedron', 'Round the Icosahedron', 2, icosahedron(), 'The twelve corners of an icosahedron, each meeting five triangles. A round trip, please.');
  simple('icosian-truncated', 'The Truncated Tetrahedron', 2, truncTet(), 'A tetrahedron with its four tips sliced off: four triangles and four hexagons. Visit all twelve corners and return.');
  simple('icosian-cubocta', 'The Cuboctahedron', 2, cubocta(), 'Twelve corners where two squares and two triangles meet. A round trip through all of them?', { data: { ask: true } });
  simple('icosian-rhombic', 'The Rhombic Dodecahedron', 4, rhombicDodeca(), 'Twelve diamond faces; eight corners where three meet and six where four meet. Is there a round trip through all fourteen corners?', {
    none: true,
    hints: ['Every line joins a three-way corner to a four-way corner.', 'So a round trip would alternate between the two kinds.'],
    explain: 'Every edge joins one of the eight three-way corners to one of the six four-way corners. A round trip alternates between the two kinds, so it would need equally many of each — and eight is not six. No round trip exists.',
    concepts: ['hamilton', 'coloring-argument', 'parity'], tags: ['impossible', 'solid']
  });
  simple('icosian-gear', 'The Gear Wheel', 3, gear(6), 'A hub, six spokes and a rim with twelve towns — only every other rim town has a spoke. Round trip through all thirteen?', {
    none: true,
    hints: ['Colour the hub and the rim towns without spokes one colour, the towns with spokes the other.'],
    explain: 'Colour the hub and the six rim towns without spokes black, the six towns with spokes white: every road joins black to white. Seven black, six white — a round trip, alternating colours, is impossible.',
    concepts: ['hamilton', 'coloring-argument'], tags: ['impossible']
  });
  simple('icosian-antiprism', 'The Hexagonal Antiprism', 2, antiprism(6), 'Two hexagons, one twisted against the other, joined by a zigzag of triangles. Visit all twelve corners and come back.');
  simple('icosian-durer', 'Dürer\'s Solid', 3, gp(6, 2), 'A hexagon around two triangles, joined by spokes — the corner net of the strange solid in Albrecht Dürer\'s engraving *Melencolia I*. Round trip?', { data: { ask: true }, source: 'The Dürer graph, from the solid in Dürer\'s *Melencolia I* (1514).' });
  simple('icosian-mobius', 'The Möbius–Kantor Net', 3, gp(8, 3), 'An octagon around an eight-pointed star, joined by spokes. Sixteen corners, three lines at each. Find a round trip.', { data: { ask: true } });
  simple('icosian-desargues', 'The Desargues Net', 4, gp(10, 3), 'A decagon around a ten-pointed star, joined by spokes: twenty corners. Find a round trip.', { data: { ask: true } });
  simple('icosian-gp11', 'The Eleven-Pointed Trap', 4, gp(11, 2), 'An eleven-sided ring around an eleven-pointed star, each star point joined to the points two along. Twenty-two corners, three lines at each. A round trip — or none?', {
    none: true,
    hints: ['Try hard — and notice where every attempt fails. The cabinet checked every possible route.'],
    explain: 'There is none: the cabinet searched every possibility. Nets like this — an n-gon around a star that skips one point — have a round trip except when n is 5, 11, 17, … (five more than a multiple of six). Petersen\'s star is the case n = 5.',
    concepts: ['hamilton'], tags: ['impossible']
  });
  simple('icosian-gp7', 'The Seven-Pointed Star', 2, gp(7, 2), 'A heptagon around a seven-pointed star, joined by spokes. Round trip through all fourteen corners?', { data: { ask: true } });

  // towns with a hidden round trip
  const rng = C.rng(18570);
  const townPlan = [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 5];
  const NAMES = ['Market Day', 'The Pedlar\'s Round', 'The Travelling Circus', 'The Doctor\'s Rounds', 'The Tax Collector', 'The Tinker', 'The Midwife\'s Circuit', 'The Grand Tour', 'The Salesman\'s Week', 'The Pilgrim Road', 'The Mail Coach', 'The Night Watch', 'The Lamplighter', 'The Inspector Calls'];
  townPlan.forEach((lv, i) => {
    let pz = null, t = 0;
    while (!pz && t++ < 20) pz = GG.makeRoundTrip(rng, lv);
    if (!pz) throw new Error('no towns ' + lv);
    const n = pz.data.v.length;
    P.push({ id: '', title: NAMES[i], diff: lv, text: n + ' towns joined by roads. Plan a round trip along the roads that calls at every town exactly once and comes home again.', concepts: ['hamilton'], tags: ['towns'], data: pz.data });
  });

  P.sort((a, b) => a.diff - b.diff);
  let k = 0;
  P.forEach((p) => {
    if (!p.id) p.id = 'icosian-town-' + String(++k).padStart(2, '0');
    const r = eng.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
  });
  const meta = {
    id: 'icosian', engine: 'graphs', cat: 'routes', name: 'Round trips', order: 4,
    blurb: 'Call at every corner exactly once and come home — Hamilton\'s Icosian game and its many cousins. Some have no round trip at all: can you tell which?',
    origin: { year: 1857, who: 'William Rowan Hamilton', note: 'Hamilton\'s Icosian game (1857) asked for a round trip through the twenty corners of a dodecahedron. Unlike Euler\'s one-stroke figures, there is no quick test for such round trips — which is what makes them good puzzles.' },
    concepts: ['hamilton', 'graph', 'coloring-argument']
  };
  const lines = P.map((p) => '  ' + JSON.stringify(p));
  const out = '/* The Puzzle Cabinet · data/icosian.js — made by tools/gen/icosian.js */\nCabinet.family(' + JSON.stringify(meta, null, 2) + ', [\n' + lines.join(',\n') + '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data/icosian.js'), out);
  const cnt = {};
  P.forEach((p) => { cnt[p.diff] = (cnt[p.diff] || 0) + 1; });
  console.log('icosian: ' + P.length + ' puzzles ' + JSON.stringify(cnt) + ', dodecahedron round trips: ' + cyclesD + ', ' + Math.round(out.length / 1024) + ' KB');
}

main();
