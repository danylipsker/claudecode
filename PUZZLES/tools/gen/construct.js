/* The Puzzle Cabinet · tools/gen/construct.js
 *
 *   node tools/gen/construct.js            writes data/constructions.js
 *   node tools/gen/construct.js --search   also searches for shorter elementary solutions (slow)
 *
 * Compass and straightedge puzzles, written by hand in Euclid's order. Every
 * target is computed here from a formula of its own (not from the stored
 * solution); the engine's verify() then replays the stored solution with the
 * same geometry kernel the board uses and checks it builds every target.
 * The L par is the stored solution's count; the E par is the best of the
 * stored solutions (a basic-tools solution solE may beat the derived tools).
 * With --search, a brute-force search looks for anything shorter in E moves
 * (lines and circles only, every crossing a point, no free points).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/construct.js'));
const K = C.construct;
const eng = C.engines.construct;

/* ---------- plane helpers (y grows downward, as on the screen) ---------- */

const add = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const mul = (a, k) => [a[0] * k, a[1] * k];
const len = (a) => Math.hypot(a[0], a[1]);
const dist = (a, b) => len(sub(a, b));
const unit = (a) => mul(a, 1 / len(a));
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const crossZ = (a, b) => a[0] * b[1] - a[1] * b[0];
// turn a vector by deg: positive turns clockwise on the screen, negative anticlockwise ("upward" from a rightward vector)
const rot = (v, deg) => { const r = deg * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
const polar = (c, r, deg) => add(c, [r * Math.cos(deg * Math.PI / 180), r * Math.sin(deg * Math.PI / 180)]);
const up = (v) => [v[1], -v[0]];     // v turned a quarter anticlockwise on the screen
const down = (v) => [-v[1], v[0]];   // a quarter clockwise
function meetLines(a, b, c, d) {
  const r = sub(b, a), s = sub(d, c), den = crossZ(r, s);
  if (Math.abs(den) < 1e-14) throw new Error('parallel lines');
  return add(a, mul(r, crossZ(sub(c, a), s) / den));
}
function circum(a, b, c) {
  const o = meetLines(mid(a, b), add(mid(a, b), down(sub(b, a))), mid(b, c), add(mid(b, c), down(sub(c, b))));
  return { c: o, r: dist(o, a) };
}
function foot(p, a, b) { const u = unit(sub(b, a)); return add(a, mul(u, dot(sub(p, a), u))); }
function reflectPt(p, a, b) { const f = foot(p, a, b); return sub(mul(f, 2), p); }
function incircle(a, b, c) {
  const la = dist(b, c), lb = dist(c, a), lc = dist(a, b), s = la + lb + lc;
  const o = [(la * a[0] + lb * b[0] + lc * c[0]) / s, (la * a[1] + lb * b[1] + lc * c[1]) / s];
  return { c: o, r: dist(o, foot(o, a, b)) };
}
function circleCircle(c1, r1, c2, r2) {
  const d = dist(c1, c2), a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(r1 * r1 - a * a);
  const e = unit(sub(c2, c1)), b = add(c1, mul(e, a)), n = [-e[1], e[0]];
  return [add(b, mul(n, h)), sub(b, mul(n, h))];
}
const PHI = (1 + Math.sqrt(5)) / 2;

/* ---------- writing puzzles ---------- */

const r9 = (v) => Math.round(v * 1e9) / 1e9;
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const near = (p) => [r6(p[0]), r6(p[1])];
const T = {
  P: (p) => ['P', r9(p[0]), r9(p[1])],
  L: (a, b) => ['L', r9(a[0]), r9(a[1]), r9(b[0]), r9(b[1])],
  S: (a, b) => ['S', r9(a[0]), r9(a[1]), r9(b[0]), r9(b[1])],
  C: (c, r) => ['C', r9(c[0]), r9(c[1]), r9(r)],
  D: (d) => ['D', r9(d)],
  any: (...alts) => ['any'].concat(alts)
};
const G = {
  pt: (n, p, anchor) => (anchor ? ['pt', n, r6(p[0]), r6(p[1]), anchor] : ['pt', n, r6(p[0]), r6(p[1])]),
  seg: (a, b) => ['seg', a, b],
  line: (a, b) => ['line', a, b],
  ray: (a, b) => ['ray', a, b],
  circ: (o, a) => ['circ', o, a],
  circle: (n, c, r) => ['circle', n, r6(c[0]), r6(c[1]), r6(r)],
  lxy: (n, a, b) => ['lxy', n, r6(a[0]), r6(a[1]), r6(b[0]), r6(b[1])]
};
// the sides of a polygon (a list of corners) as segment targets
const sides = (pts, closed) => { const out = []; for (let i = 0; i + 1 < pts.length + (closed ? 1 : 0); i++) out.push(T.S(pts[i], pts[(i + 1) % pts.length])); return out; };
const tri = (A, B, Cc) => [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.seg('A', 'B'), G.seg('B', 'C'), G.seg('C', 'A')];

const main = [];   // the family 'constructions', in order
const only = [];   // the family 'compass-only'
const put = (p) => main.push(p);
const putC = (p) => only.push(p);

/* ---------- the search for shorter elementary solutions (--search) ---------- */

function keyObj(o) {
  if (o.k === 'C') return 'C' + o.c[0].toFixed(5) + ',' + o.c[1].toFixed(5) + ',' + o.r.toFixed(5);
  const u = K.lineDir(o); let n = [-u[1], u[0]];
  if (n[0] < -1e-9 || (Math.abs(n[0]) < 1e-9 && n[1] < 0)) n = [-n[0], -n[1]];
  return 'L' + n[0].toFixed(5) + ',' + n[1].toFixed(5) + ',' + (n[0] * o.a[0] + n[1] * o.a[1]).toFixed(5);
}
// fewest lines + circles (every crossing a point, no free points); null when none up to maxDepth
function searchE(d, maxDepth, opts) {
  opts = opts || {};
  const s0 = K.givenScene(d);
  const pts0 = s0.pts.map((p) => [p.x, p.y]);
  s0.crossings().forEach((q) => pts0.push([q.x, q.y]));
  const objs0 = s0.objs.slice();
  const seen = new Set();
  let found = null, nodes = 0, foundObjs = null;
  const noLines = (d.tools || []).indexOf('line') < 0;
  const goal = (objs, pts) => {
    const s = new K.Scene();
    pts.forEach((p) => s.addPt(null, p));
    objs.forEach((o, i) => s.addObj(null, Object.assign({}, o, { given: i < objs0.length })));
    return K.goalMet(s, d);
  };
  const addPoint = (pts, p) => { for (const q of pts) if (Math.abs(q[0] - p[0]) < 1e-6 && Math.abs(q[1] - p[1]) < 1e-6) return; pts.push(p); };
  function dfs(objs, pts, depth) {
    if (found || nodes > (opts.limit || 4e5)) return;
    nodes++;
    if (!depth) return;
    const keys = new Set(objs.map(keyObj));
    for (let i = 0; i < pts.length && !found; i++) {
      for (let j = 0; j < pts.length && !found; j++) {
        if (i === j) continue;
        const cands = [{ k: 'C', c: pts[i], r: dist(pts[i], pts[j]) }];
        if (!noLines && i < j) cands.push({ k: 'L', kind: 'line', a: pts[i], b: pts[j] });
        for (const o of cands) {
          const k = keyObj(o);
          if (keys.has(k)) continue;
          const all = Array.from(keys).concat([k]).sort().join('|');
          if (seen.has(all)) continue;
          seen.add(all);
          const np = pts.slice();
          objs.forEach((q) => K.meet(o, q).forEach((p) => addPoint(np, p)));
          const no = objs.concat([o]);
          if (goal(no, np)) { found = no.length - objs0.length; foundObjs = no.slice(objs0.length); return; }
          dfs(no, np, depth - 1);
          if (found) return;
        }
      }
    }
  }
  for (let D = 1; D <= maxDepth && !found; D++) { seen.clear(); dfs(objs0, pts0, D); }
  return { found, nodes, steps: foundObjs ? toSteps(d, foundObjs) : null };
}
// a found list of lines and circles as named steps (the crossings they need become 'x' steps)
function toSteps(d, objs) {
  const s = K.givenScene(d), steps = [];
  let n = 0;
  const pointAt = (p) => {
    const q = s.ptAt(p);
    if (q) return q.id;
    for (let i = 0; i < s.objs.length; i++) {
      for (let j = i + 1; j < s.objs.length; j++) {
        if (K.meet(s.objs[i], s.objs[j]).some((m) => dist(m, p) < 1e-6)) {
          const st = ['x', 'S' + (++n), s.objs[i].id, s.objs[j].id, near(p)];
          K.applyStep(s, st);
          steps.push(st);
          return st[1];
        }
      }
    }
    throw new Error('toSteps: no crossing at ' + p);
  };
  objs.forEach((o) => {
    let st;
    if (o.k === 'C') {
      const ring = s.pts.concat(s.crossings()).map((q) => [q.x, q.y]).find((q) => Math.abs(dist(q, o.c) - o.r) < 1e-6 && dist(q, o.c) > 1e-6);
      st = ['circle', 's' + (++n), pointAt(o.c), pointAt(ring)];
    } else st = ['line', 's' + (++n), pointAt(o.a), pointAt(o.b)];
    K.applyStep(s, st);
    steps.push(st);
  });
  return steps;
}

/* ---------- tools earned in Euclid's order ---------- */

const BASIC = ['point', 'line', 'circle'];
const UNLOCK = { perpbis: 'cs-perpbis', perp: 'cs-raise', bisect: 'cs-bisect', compass: 'cs-carry', parallel: 'cs-parallel' };

function finish(list, fam) {
  const idx = {};
  list.forEach((p, i) => { idx[p.id] = i; });
  const byId = {};
  list.forEach((p) => { byId[p.id] = p; });
  return list.map((p, i) => {
    const d = { given: p.given, targets: p.targets };
    let tools = p.tools;
    const proved = {};
    let newTool = null;
    if (!tools) {
      tools = BASIC.slice();
      K.TOOL_ORDER.forEach((t) => {
        const u = UNLOCK[t];
        if (u && idx[u] != null && idx[u] < i) { tools.push(t); proved[t] = u; if (idx[u] === i - 1) newTool = t; }
      });
    }
    d.tools = K.TOOL_ORDER.filter((t) => tools.indexOf(t) >= 0);
    if (p.free != null) d.free = p.free;
    if (p.lineKind) d.lineKind = p.lineKind;
    d.sol = p.sol;
    if (p.solE) d.solE = p.solE;
    const cs = K.costOf(p.sol), ce = p.solE ? K.costOf(p.solE) : cs;
    d.parL = cs.L;
    d.parE = Math.min(cs.E, ce.E);
    if (newTool) d.newTool = newTool;
    if (Object.keys(proved).length) d.proved = proved;
    const out = { id: p.id, title: p.title, diff: p.diff };
    ['year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags'].forEach((k) => { if (p[k] != null) out[k] = p[k]; });
    out.data = d;
    out.family = fam;
    const r = eng.verify(out);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
    if (r.warn) console.warn('  ! ' + p.id + ': ' + r.warn);
    delete out.family;
    return out;
  });
}

/* =====================================================================
 *  Chapter 1 · Euclid, Book I: the first moves
 * ===================================================================== */

const EUCLID = 'Euclid, *Elements*';

{ // I.1
  const A = [-2, 1], B = [2, 1], h = Math.sqrt(3) * 2;
  const Cu = [0, 1 - h], Cd = [0, 1 + h];
  put({
    id: 'cs-equilateral', title: 'Euclid\'s First Move', diff: 1, year: -300, source: EUCLID + ', Book I, Proposition 1 (about 300 BC).',
    text: 'The *Elements* opens with this. On the segment **AB**, build an equilateral triangle — all three sides equal — with nothing but a compass and a straightedge.',
    goal: 'Draw the two other sides of an equilateral triangle on AB.',
    hints: ['A circle about A through B holds every point that is exactly AB away from A.', 'Draw the circle about A through B and the circle about B through A. Where they cross is the third corner.'],
    explain: 'Every point on the circle about A is as far from A as B is, and every point on the circle about B is as far from B as A is. Where the circles cross, the point C is AB away from both, so all three sides are equal. This is the very first construction in what may be the most influential textbook ever written. (Euclid never proved that the two circles really do meet — later mathematicians added an axiom of continuity to cover it.)',
    concepts: ['construction', 'symmetry'], tags: ['book i', 'triangle', 'classic'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.any([T.S(A, Cu), T.S(B, Cu)], [T.S(A, Cd), T.S(B, Cd)])],
    sol: [['circle', 'cA', 'A', 'B'], ['circle', 'cB', 'B', 'A'], ['x', 'C', 'cA', 'cB', 'up'], ['line', null, 'A', 'C'], ['line', null, 'B', 'C']]
  });
}

{ // root 3
  const A = [-1.5, 1], B = [1.5, 1];
  put({
    id: 'cs-root3', title: 'The Root of Three', diff: 1,
    text: 'Take the segment **AB** as your unit of length. Make two points exactly √3 units apart (a circle of radius √3 also counts).',
    goal: 'Two points √3 × AB apart.',
    hints: ['Two circles of radius AB, each centred on an end of the other, cross twice.', 'Measure between the two crossings: each is the tip of an equilateral triangle on AB, one above and one below.'],
    explain: 'The two crossings are the tips of equilateral triangles on either side of AB. The height of an equilateral triangle of side 1 is √3/2, so the tips are √3 apart. Medieval builders called the lens between the circles the *vesica piscis*; it frames many a Gothic window.',
    concepts: ['construction'], tags: ['lengths', 'root'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.D(3 * Math.sqrt(3))],
    sol: [['circle', 'cA', 'A', 'B'], ['circle', 'cB', 'B', 'A'], ['x', 'X', 'cA', 'cB', 'up'], ['x', 'Y', 'cA', 'cB', 'down']]
  });
}

{ // reflect a point
  const A = [-3, 1.4], B = [3, 0.4], P = [0.4, -1.8];
  put({
    id: 'cs-reflect', title: 'Mirror, Mirror', diff: 1,
    text: 'The line through **A** and **B** is a mirror. Where does the point **P** appear in it? Mark its reflection.',
    goal: 'The reflection of P in the line AB.',
    hints: ['The reflection is exactly as far from A as P is — and exactly as far from B.', 'The circle about A through P and the circle about B through P meet at P and at its mirror image.'],
    explain: 'Every point of the mirror line is equally far from P and from its reflection P′. So P′ lies on the circle about A through P and on the circle about B through P, and those two circles meet only at P and P′. Two circles and no ruler: the *Only a compass* drawer is built on this trick.',
    concepts: ['symmetry', 'construction'], tags: ['book i', 'reflection'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('P', P), G.line('A', 'B')],
    targets: [T.P(reflectPt(P, A, B))],
    sol: [['circle', 'cA', 'A', 'P'], ['circle', 'cB', 'B', 'P'], ['x', 'Q', 'cA', 'cB', '!P']]
  });
}

{ // perpendicular bisector
  const A = [-1.8, 1.0], B = [1.9, -0.5], M = mid(A, B);
  put({
    id: 'cs-perpbis', title: 'Equal Distances', diff: 1, year: -300, source: 'The construction inside ' + EUCLID + ' I.10 and I.11.',
    text: 'Draw the line of all the points that are exactly as far from **A** as from **B**.',
    goal: 'The perpendicular bisector of A and B.',
    hints: ['Find two points that are each equally far from A and B; the line through them is the answer.', 'The two circles of Euclid\'s first move — about A through B and about B through A — cross at two such points.'],
    explain: 'Both crossings of the circles are AB away from A and from B, so each is equally far from both — and so is every point of the straight line through them, which cuts AB at right angles in its middle. From now on this is a tool of its own: the **perpendicular bisector** (1 L, 3 E).',
    concepts: ['construction', 'symmetry'], tags: ['book i', 'bisector', 'new tool'],
    given: [G.pt('A', A), G.pt('B', B)],
    targets: [T.L(M, add(M, down(sub(B, A))))],
    sol: [['circle', 'cA', 'A', 'B'], ['circle', 'cB', 'B', 'A'], ['x', 'X', 'cA', 'cB', 'up'], ['x', 'Y', 'cA', 'cB', 'down'], ['line', null, 'X', 'Y']]
  });
}

{ // I.10 midpoint
  const A = [-2.4, 0.9], B = [2.2, -0.1];
  put({
    id: 'cs-midpoint', title: 'Cut in Half', diff: 1, year: -300, source: EUCLID + ', Book I, Proposition 10.',
    text: 'Cut the segment **AB** exactly in half: mark its midpoint.',
    goal: 'The midpoint of AB.',
    hints: ['Try the tool you have just earned.', 'The perpendicular bisector crosses AB right at its middle.'],
    explain: 'The perpendicular bisector holds every point equally far from A and B; where it crosses AB is the one point of AB with that property. Euclid does it with an equilateral triangle and an angle bisector — the same idea in other clothes.',
    concepts: ['construction', 'symmetry'], tags: ['book i', 'midpoint'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.P(mid(A, B))],
    sol: [['perpbis', 'm', 'A', 'B']]
  });
}

{ // Thales' circle
  const A = [-2.2, 0.8], B = [2.4, 0.1];
  put({
    id: 'cs-thales', title: 'Thales\' Circle', diff: 1,
    text: 'Draw the circle that has the segment **AB** as a diameter.',
    goal: 'The circle with diameter AB.',
    hints: ['A diameter passes through the centre, halfway along it.', 'Find the midpoint of AB, then draw the circle about it through A.'],
    explain: 'Every point of this circle sees A and B at a right angle — the theorem credited to Thales of Miletus (about 600 BC), perhaps the oldest named theorem of all. It returns again and again in this drawer, wherever a right angle or a tangent is needed.',
    concepts: ['construction'], tags: ['book i', 'circle', 'right angle'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.C(mid(A, B), dist(A, B) / 2)],
    sol: [['perpbis', 'm', 'A', 'B'], ['x', 'M', 'm', 'AB'], ['circle', null, 'M', 'A']]
  });
}

{ // I.12 drop a perpendicular
  const A = [-3, 1.6], B = [3.2, 0.8], P = [0.2, -1.9];
  put({
    id: 'cs-drop', title: 'Straight Down', diff: 1, year: -300, source: EUCLID + ', Book I, Proposition 12.',
    text: 'From the point **P**, drop a perpendicular to the line **AB**: the line through P that meets AB at a right angle.',
    goal: 'The perpendicular from P to AB.',
    hints: ['A circle about P cuts the line AB twice, at two points equally far from P.', 'So P is on their perpendicular bisector. (With plain circles: reflect P in AB and join.)'],
    explain: 'Any circle about P that cuts AB gives two points of AB equally far from P; their perpendicular bisector passes through P and stands square on AB. With plain tools it takes 3 E: the circles about A and B through P meet again at P′, the mirror image of P, and PP′ is the perpendicular.',
    concepts: ['construction', 'symmetry'], tags: ['book i', 'perpendicular'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('P', P), G.line('A', 'B')],
    targets: [T.L(P, add(P, down(sub(B, A))))],
    sol: [['circle', 'cP', 'P', 'A'], ['x', 'A2', 'cP', 'AB', '!A'], ['perpbis', null, 'A', 'A2']],
    solE: [['circle', 'k1', 'A', 'P'], ['circle', 'k2', 'B', 'P'], ['x', 'P2', 'k1', 'k2', '!P'], ['line', null, 'P', 'P2']]
  });
}

{ // I.11 raise a perpendicular
  const A = [-3, 0.8], P = [0.5, 0.45];
  const u = unit(sub(P, A));
  const Z = add(P, [0.9, -1.9]);
  put({
    id: 'cs-raise', title: 'Stand Up Straight', diff: 2, year: -300, source: EUCLID + ', Book I, Proposition 11.',
    text: 'The point **P** lies on the line. Raise a perpendicular there: the line through P at right angles to the line **AP**.',
    goal: 'The perpendicular to the line at P.',
    hints: ['Make P the middle of a segment on the line: a circle about P does that.', 'The perpendicular bisector of that segment passes through P. (For fewer E moves: a circle through P about any free point, and Thales.)'],
    explain: 'A circle about P cuts the line at two points with P halfway between them, and their perpendicular bisector is the perpendicular at P. The 3-E route uses Thales: about any point Z off the line, draw the circle through P; it cuts the line again at Q; the line QZ meets the circle again at R, the far end of a diameter; PR stands square on the line because an angle in a semicircle is right. From now on: the **perpendicular** tool (1 L, 3 E).',
    concepts: ['construction'], tags: ['book i', 'perpendicular', 'new tool'],
    given: [G.pt('A', A), G.pt('P', P), G.line('A', 'P')],
    targets: [T.L(P, add(P, down(u)))],
    sol: [['circle', 'cP', 'P', 'A'], ['x', 'A2', 'cP', 'AP', '!A'], ['perpbis', null, 'A', 'A2']],
    solE: [['pt', 'Z', r6(Z[0]), r6(Z[1])], ['circle', 'cZ', 'Z', 'P'], ['x', 'Q', 'cZ', 'AP', '!P'], ['line', 'lQ', 'Q', 'Z'], ['x', 'R', 'lQ', 'cZ', '!Q'], ['line', null, 'P', 'R']]
  });
}

{ // sixty degrees
  const V = [-2.4, 1.4], A = [2.3, 0.7], u = unit(sub(A, V));
  put({
    id: 'cs-sixty', title: 'Sixty Degrees', diff: 1,
    text: 'Make an angle of exactly 60° at **V**, with the ray **VA** as one arm.',
    goal: 'A line through V at 60° to VA.',
    hints: ['Every angle of an equilateral triangle is 60°.', 'Build an equilateral triangle on VA and use its side through V.'],
    explain: 'The circles about V through A and about A through V meet at X with VX = VA = AX: an equilateral triangle, all of whose angles are 60°. Six such angles fill the full turn around V — which is why the radius steps exactly six times around a circle.',
    concepts: ['construction'], tags: ['angles'],
    given: [G.pt('V', V), G.pt('A', A), G.ray('V', 'A')],
    targets: [T.any([T.L(V, add(V, rot(u, -60)))], [T.L(V, add(V, rot(u, 60)))])],
    sol: [['circle', 'cV', 'V', 'A'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['line', null, 'V', 'X']]
  });
}

{ // quarter turn
  const O = [-0.8, 0.8], P = [2.2, -0.2];
  put({
    id: 'cs-quarter-turn', title: 'A Quarter Turn', diff: 1,
    text: 'Turn the point **P** a quarter of a full turn about **O**, either way round, and mark where it lands.',
    goal: 'P turned through 90° about O.',
    hints: ['The new point is as far from O as P is.', 'It lies on the circle about O through P, on the perpendicular to OP at O.'],
    explain: 'A turn about O keeps every distance from O and turns every direction through the same angle. A quarter turn needs a right angle; a sixth of a turn (60°) is even cheaper — two circles.',
    concepts: ['symmetry', 'construction'], tags: ['rotation'],
    given: [G.pt('O', O), G.pt('P', P)],
    targets: [T.any([T.P(add(O, up(sub(P, O))))], [T.P(add(O, down(sub(P, O))))])],
    sol: [['line', 'l', 'O', 'P'], ['perp', 'n', 'l', 'O'], ['circle', 'k', 'O', 'P']]
  });
}

{ // I.9 bisect an angle
  const V = [-2.6, 1.6], A = [2.6, 1.1], B = [0.3, -2.3];
  const d = add(unit(sub(A, V)), unit(sub(B, V)));
  put({
    id: 'cs-bisect', title: 'Split the Angle', diff: 2, year: -300, source: EUCLID + ', Book I, Proposition 9.',
    text: 'Halve the angle **AVB**: draw the line through **V** that splits it into two equal angles.',
    goal: 'The bisector of the angle at V.',
    hints: ['Find two points, one on each arm, equally far from V.', 'A circle about V gives them; the bisector is their perpendicular bisector — which passes through V.'],
    explain: 'Once B and B′ are equally far from V on the two arms, the triangle VBB′ is isosceles, and its axis of symmetry halves the angle at V. Halving works for every angle; *thirding* does not — in 1837 Pierre Wantzel proved that no construction of this game trisects every angle. From now on: the **angle bisector** tool (1 L, 4 E).',
    concepts: ['construction', 'symmetry'], tags: ['book i', 'angles', 'new tool'],
    given: [G.pt('V', V), G.pt('A', A), G.pt('B', B), G.ray('V', 'A'), G.ray('V', 'B')],
    targets: [T.L(V, add(V, d))],
    sol: [['circle', 'cV', 'V', 'B'], ['x', 'B2', 'cV', 'rayVA'], ['perpbis', null, 'B', 'B2']]
  });
}

{ // thirty degrees
  const V = [-2.5, 1.5], A = [2.5, 1.0], u = unit(sub(A, V));
  put({
    id: 'cs-thirty', title: 'Thirty Degrees', diff: 1,
    text: 'Make an angle of exactly 30° at **V**, with the ray **VA** as one arm.',
    goal: 'A line through V at 30° to VA.',
    hints: ['Thirty is half of sixty.', 'Build 60° as before, then halve it. (For the fewest E moves: carry VA on beyond A with a circle about A, and build an equilateral triangle on that new piece.)'],
    explain: 'Sixty degrees comes from an equilateral triangle and halving gives thirty — 3 L with the bisector. The 3-E trick: the circle about A through V meets the ray again at A′, and the equilateral triangle on AA′ has its tip X with AX = AV. The triangle VAX is isosceles with 120° at A, so its other two angles are 30° each.',
    concepts: ['construction'], tags: ['angles'],
    given: [G.pt('V', V), G.pt('A', A), G.ray('V', 'A')],
    targets: [T.any([T.L(V, add(V, rot(u, -30)))], [T.L(V, add(V, rot(u, 30)))])],
    sol: [['circle', 'cV', 'V', 'A'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['bisect', null, 'A', 'V', 'X']],
    solE: [['circle', 'cA', 'A', 'V'], ['x', 'A2', 'cA', 'rayVA', '!V'], ['circle', 'c2', 'A2', 'A'], ['x', 'X', 'cA', 'c2', 'up'], ['line', null, 'V', 'X']]
  });
}

{ // forty-five degrees
  const V = [-2.6, 1.6], A = [2.6, 1.0], u = unit(sub(A, V));
  put({
    id: 'cs-fortyfive', title: 'Forty-Five Degrees', diff: 1,
    text: 'Make an angle of exactly 45° at **V**, with the ray **VA** as one arm.',
    goal: 'A line through V at 45° to VA.',
    hints: ['Half a right angle.', 'Raise the perpendicular at V, mark VA\'s length along it, then halve the right angle.'],
    explain: 'The diagonal of a square makes 45° with its sides: stand a square corner at V with equal arms VA and VB, and the perpendicular bisector of AB runs through V along the diagonal. With plain tools that costs 7 E, but 5 will do: with X the 60° point, the line XA meets the circle about A through V again at X′; the triangle VAX′ has 120° at A, so VX′ is 30° from VA. The circle about X′ through V then cuts the line XA at Y beyond X′, and the triangle VX′Y has 150° at X′ — another 15° at V. Thirty and fifteen make forty-five.',
    concepts: ['construction'], tags: ['angles'],
    given: [G.pt('V', V), G.pt('A', A), G.ray('V', 'A')],
    targets: [T.any([T.L(V, add(V, rot(u, -45)))], [T.L(V, add(V, rot(u, 45)))])],
    sol: [['perp', 'n', 'rayVA', 'V'], ['circle', 'k', 'V', 'A'], ['x', 'B', 'n', 'k', 'up'], ['perpbis', null, 'A', 'B']],
    solE: [['circle', 'cV', 'V', 'A'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['line', 'l', 'A', 'X'], ['x', 'X2', 'l', 'cA', '!X'], ['circle', 'c3', 'X2', 'V'], ['x', 'Y', 'l', 'c3', '!A'], ['line', null, 'V', 'Y']]
  });
}

{ // I.2 carry a length
  const B = [-0.6, 1.9], Cc = [1.8, 0.8], A = [-2.4, -1.1];
  put({
    id: 'cs-carry', title: 'The Collapsing Compass', diff: 3, year: -300, source: EUCLID + ', Book I, Proposition 2.',
    text: 'Euclid\'s compass *collapses*: it draws a circle about a point through another point, but forgets its opening the moment it is lifted. With it, draw the circle about **A** whose radius is the length **BC**.',
    goal: 'A circle centred at A with radius BC.',
    hints: ['Look for a mirror line that swaps A and B.', 'The perpendicular bisector of AB swaps them. Reflect C in it (two circles about points of the mirror); the reflection is exactly BC away from A.'],
    explain: 'Euclid\'s second proposition shows that the collapsing compass can do all that a rigid one can, so nothing is lost by the strict rule. Here the mirror is the perpendicular bisector of AB, marked by the crossings X and Y; reflecting C in it gives C′ with AC′ = BC. Euclid\'s own route uses an equilateral triangle and two extended sides; this one takes 5 moves. From now on: the **rigid compass** carries lengths for you (1 L, 5 E).',
    concepts: ['construction', 'symmetry'], tags: ['book i', 'compass', 'new tool'],
    given: [G.pt('B', B), G.pt('C', Cc), G.pt('A', A), G.seg('B', 'C')],
    targets: [T.C(A, dist(B, Cc))],
    sol: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'B', 'A'], ['x', 'X', 'k1', 'k2', 'up'], ['x', 'Y', 'k1', 'k2', 'down'], ['circle', 'k3', 'X', 'C'], ['circle', 'k4', 'Y', 'C'], ['x', 'C2', 'k3', 'k4', '!C'], ['circle', null, 'A', 'C2']]
  });
}

{ // I.3 cut off
  const A = [-3, 1.3], B = [3, 0.6], Cc = [-1.6, -1.5], D = [0.6, -2.1];
  put({
    id: 'cs-cutoff', title: 'Cut Off the Excess', diff: 1, year: -300, source: EUCLID + ', Book I, Proposition 3.',
    text: '**AB** is the longer segment and **CD** the shorter. Mark the point **E** on AB with AE equal to CD.',
    goal: 'The point E on AB with AE = CD.',
    hints: ['Carry the length CD over to A.', 'The rigid compass about A with radius CD cuts AB at E.'],
    explain: 'Euclid\'s third proposition, done with the tool the second one earned. Measuring is not allowed in this game, but carrying a length is.',
    concepts: ['construction'], tags: ['book i', 'compass'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('A', 'B'), G.seg('C', 'D')],
    targets: [T.P(add(A, mul(unit(sub(B, A)), dist(Cc, D))))],
    sol: [['compass', 'k', 'C', 'D', 'A']]
  });
}

{ // I.22 triangle from three lengths
  const A = [-2.2, 1.6], B = [2.2, 1.6], Cc = [-3, 3.6], D = [0.1, 3.6], E = [-1.3, 4.5], F = [2.4, 4.5];
  const pts = circleCircle(A, dist(Cc, D), B, dist(E, F));
  const Tu = pts[0][1] < pts[1][1] ? pts[0] : pts[1], Td = Tu === pts[0] ? pts[1] : pts[0];
  put({
    id: 'cs-sticks', title: 'Three Sticks', diff: 2, year: -300, source: EUCLID + ', Book I, Proposition 22.',
    text: 'Build a triangle on the base **AB** whose other two sides are as long as the sticks: **CD** from A, and **EF** from B.',
    goal: 'A triangle on AB with sides CD (at A) and EF (at B).',
    hints: ['The third corner is CD away from A and EF away from B.', 'Carry both lengths with the rigid compass; the circles cross at the corner.'],
    explain: 'Euclid I.22 builds a triangle from three given lengths and warns that any two of them together must be longer than the third — otherwise the two circles fall short of each other and never meet.',
    concepts: ['construction'], tags: ['book i', 'triangle', 'compass'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.pt('E', E), G.pt('F', F), G.seg('A', 'B'), G.seg('C', 'D'), G.seg('E', 'F')],
    targets: [T.any([T.S(A, Tu), T.S(B, Tu)], [T.S(A, Td), T.S(B, Td)])],
    sol: [['compass', 'k1', 'C', 'D', 'A'], ['compass', 'k2', 'E', 'F', 'B'], ['x', 'T', 'k1', 'k2', 'up'], ['line', null, 'A', 'T'], ['line', null, 'B', 'T']]
  });
}

{ // I.23 copy an angle
  const V = [-3.4, 1.8], A = [-0.9, 1.8], B = [-1.6, 0.3], P = [0.3, 2.2], Q = [2.7, 2.9];
  const th = Math.atan2(B[1] - V[1], B[0] - V[0]) * 180 / Math.PI - Math.atan2(A[1] - V[1], A[0] - V[0]) * 180 / Math.PI;
  const u = unit(sub(Q, P));
  put({
    id: 'cs-copyangle', title: 'Copy an Angle', diff: 3, year: -300, source: EUCLID + ', Book I, Proposition 23.',
    text: 'Copy the angle **AVB** to the point **P**: draw a line through P that makes the same angle with the ray **PQ** as VB makes with VA. (PQ happens to be exactly as long as VA.)',
    goal: 'A line through P at the angle AVB to PQ.',
    hints: ['An angle is pinned down by a triangle: cut both arms at the same distance from the vertex, and the gap between the cuts fixes the angle.', 'Cut VB at the distance VA, then carry the gap from A to that cut over to Q.'],
    explain: 'Euclid copies an angle by copying a triangle. V, A and the point B′ on VB with VB′ = VA make one; P, Q and the new point T with PT = VA and QT = AB′ make another with the same three sides. Triangles with three equal sides are congruent (Euclid I.8), so the angles at V and P are equal.',
    concepts: ['construction'], tags: ['book i', 'angles', 'compass'],
    given: [G.pt('V', V), G.pt('A', A), G.pt('B', B), G.pt('P', P), G.pt('Q', Q), G.ray('V', 'A'), G.ray('V', 'B'), G.ray('P', 'Q')],
    targets: [T.any([T.L(P, add(P, rot(u, th)))], [T.L(P, add(P, rot(u, -th)))])],
    sol: [['circle', 'cV', 'V', 'A'], ['x', 'B2', 'cV', 'rayVB'], ['circle', 'cP', 'P', 'Q'], ['compass', 'k', 'A', 'B2', 'Q'], ['x', 'T', 'cP', 'k', 'up'], ['line', null, 'P', 'T']]
  });
}

{ // I.31 parallel
  const A = [-3, 1.4], B = [3, 0.6], P = [-0.3, -1.6];
  put({
    id: 'cs-parallel', title: 'Never Meeting', diff: 2, year: -300, source: EUCLID + ', Book I, Proposition 31.',
    text: 'Draw the line through **P** that never meets the line **AB**, however far both are drawn.',
    goal: 'The parallel to AB through P.',
    hints: ['Two perpendiculars make a parallel.', 'For fewer E moves: A, P and two more points can make a rhombus with one side along AB; the opposite side is parallel to it.'],
    explain: 'Euclid I.31 copies an angle to make alternate angles equal. That there is exactly one parallel through P is Euclid\'s fifth postulate in disguise; for two thousand years people tried to prove it from the others, until Lobachevsky and Bolyai (around 1830) built consistent geometries in which it fails. From now on: the **parallel** tool (1 L, 4 E).',
    concepts: ['construction'], tags: ['book i', 'parallel', 'new tool'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('P', P), G.line('A', 'B')],
    targets: [T.L(P, add(P, sub(B, A)))],
    sol: [['perp', 'n', 'AB', 'P'], ['perp', null, 'n', 'P']],
    solE: [['circle', 'k1', 'A', 'P'], ['x', 'C2', 'k1', 'AB', '~B'], ['circle', 'k2', 'C2', 'A'], ['circle', 'k3', 'P', 'A'], ['x', 'Q', 'k2', 'k3', '!A'], ['line', null, 'P', 'Q']]
  });
}

{ // parallelogram
  const A = [-2.6, 1.5], B = [1.3, 1.9], Cc = [2.7, -0.9], D = sub(add(A, Cc), B);
  put({
    id: 'cs-parallelogram', title: 'Complete the Parallelogram', diff: 1,
    text: '**AB** and **BC** are two sides of a parallelogram. Draw the other two.',
    goal: 'The sides CD and DA of the parallelogram ABCD.',
    hints: ['Opposite sides of a parallelogram are parallel.', 'Through C, the parallel to AB; through A, the parallel to BC.'],
    explain: 'A parallelogram is exactly a four-sided figure whose opposite sides are parallel, so the two parallels cross at the fourth corner D. (D is also C moved by the same slide that takes B to A.)',
    concepts: ['construction', 'symmetry'], tags: ['parallel', 'quadrilateral'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.seg('A', 'B'), G.seg('B', 'C')],
    targets: [T.S(Cc, D), T.S(A, D)],
    sol: [['parallel', 'p1', 'AB', 'C'], ['parallel', 'p2', 'BC', 'A']]
  });
}

{ // I.46 square on a side
  const A = [-1.6, 1.8], B = [1.8, 1.4], n = up(sub(B, A));
  const Du = add(A, n), Cu = add(B, n), Dd = sub(A, n), Cd = sub(B, n);
  put({
    id: 'cs-square', title: 'A Square on a Side', diff: 3, year: -300, source: EUCLID + ', Book I, Proposition 46.',
    text: 'Build the square that has **AB** as one of its sides.',
    goal: 'The other three sides of a square on AB.',
    hints: ['Stand a perpendicular on AB at A and mark AB\'s length along it.', 'The last corner is where the perpendicular at B meets the line through the new corner parallel to AB.'],
    explain: 'Euclid needs this square at once: the next proposition, I.47, is Pythagoras\' theorem, proved by comparing the squares on the three sides of a right triangle. The 8-E route leans on Thales: the circle about the tip X of the equilateral triangle on AB passes through A and B, and the far end of its diameter from A sees AB at a right angle from B.',
    concepts: ['construction'], tags: ['book i', 'square', 'quadrilateral'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.any([T.S(B, Cu), T.S(Cu, Du), T.S(Du, A)], [T.S(B, Cd), T.S(Cd, Dd), T.S(Dd, A)])],
    sol: [['perp', 'm1', 'AB', 'A'], ['circle', 'k', 'A', 'B'], ['x', 'D', 'm1', 'k', 'up'], ['perp', 'm2', 'AB', 'B'], ['perp', null, 'm1', 'D']],
    solE: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'B', 'A'], ['x', 'X', 'k1', 'k2', 'up'], ['circle', 'k3', 'X', 'A'], ['line', 'l1', 'A', 'X'], ['x', 'A3', 'l1', 'k3', '!A'], ['line', 'l2', 'B', 'A3'], ['x', 'C', 'l2', 'k2', 'up'], ['circle', 'k4', 'C', 'B'], ['x', 'D', 'k4', 'k1', '!B'], ['line', null, 'C', 'D'], ['line', null, 'A', 'D']]
  });
}

{ // trisect a right angle
  const V = [-2.1, 2.1], A = [2.5, 2.1], B = [-2.1, -2.0];
  const u = unit(sub(A, V));
  put({
    id: 'cs-trisect-right', title: 'Three Equal Angles', diff: 2,
    text: 'Trisect the right angle at **V**: draw the two lines that cut it into three equal angles.',
    goal: 'The two lines at 30° and 60° to VA.',
    hints: ['Each third is 30°, and 60° is the angle of an equilateral triangle.', 'An equilateral triangle on VA gives 60° from VA; one on the other arm gives 60° from that arm — which is 30° from VA.'],
    explain: 'A right angle can be trisected because 30° is constructible. The general angle cannot: Pierre Wantzel proved in 1837 that trisecting, say, 60° means solving a cubic equation that compass and straightedge cannot solve. Archimedes knew a trisection with a *marked* ruler — but that is a different game.',
    concepts: ['construction'], tags: ['angles', 'trisection'],
    given: [G.pt('V', V), G.pt('A', A), G.pt('B', B), G.ray('V', 'A'), G.ray('V', 'B')],
    targets: [T.L(V, add(V, rot(u, -30))), T.L(V, add(V, rot(u, -60)))],
    sol: [['circle', 'cV', 'V', 'A'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['line', null, 'V', 'X'], ['bisect', null, 'A', 'V', 'X']],
    solE: [['circle', 'cV', 'V', 'A'], ['x', 'B2', 'cV', 'rayVB'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['circle', 'cB', 'B2', 'V'], ['x', 'Y', 'cV', 'cB', '~A'], ['line', null, 'V', 'X'], ['line', null, 'V', 'Y']]
  });
}

{ // fifteen degrees
  const V = [-2.8, 1.3], A = [2.8, 0.6], u = unit(sub(A, V));
  put({
    id: 'cs-fifteen', title: 'Fifteen Degrees', diff: 2,
    text: 'Make an angle of exactly 15° at **V**, with the ray **VA** as one arm.',
    goal: 'A line through V at 15° to VA.',
    hints: ['Fifteen is half of thirty, which is half of sixty.', 'Halve twice (4 L). For the fewest E moves, look for an isosceles triangle with a 150° angle at A: its other two angles are 15°.'],
    explain: 'Sixty, thirty, fifteen: halving is always allowed. The 5-E route: with X the 60° point, the line XV meets the circle about V again at X′; the line X′A, carried on past A, meets the circle about A through V at W, and the angle VAW is 150°, so the isosceles triangle VAW has 15° at V. The angles this game can build are exactly those whose cosines can be written with whole numbers, the four operations and square roots — cos 15° = (√6 + √2)/4 qualifies; cos 20° does not, which is why 60° cannot be trisected.',
    concepts: ['construction'], tags: ['angles'],
    given: [G.pt('V', V), G.pt('A', A), G.ray('V', 'A')],
    targets: [T.any([T.L(V, add(V, rot(u, -15)))], [T.L(V, add(V, rot(u, 15)))])],
    sol: [['circle', 'cV', 'V', 'A'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['bisect', 'b', 'A', 'V', 'X'], ['x', 'Y', 'b', 'cV', '~A'], ['bisect', null, 'A', 'V', 'Y']],
    solE: [['circle', 'cV', 'V', 'A'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['line', 'l1', 'V', 'X'], ['x', 'X2', 'l1', 'cV', '!X'], ['line', 'l2', 'A', 'X2'], ['x', 'W', 'l2', 'cA', '!X2'], ['line', null, 'V', 'W']]
  });
}

{ // seventy-five degrees
  const V = [-2.4, 2.2], A = [2.8, 2.0], u = unit(sub(A, V));
  put({
    id: 'cs-seventyfive', title: 'Seventy-Five Degrees', diff: 3,
    text: 'Make an angle of exactly 75° at **V**, with the ray **VA** as one arm.',
    goal: 'A line through V at 75° to VA.',
    hints: ['75° is halfway between 60° and 90°.', 'Build a right angle and a 60° angle at V, then bisect the angle between them.'],
    explain: 'The average of two constructible angles is constructible, because halving is: 75° = (60° + 90°) ÷ 2. The elementary route needs only 5 moves: with X the 60° point, the line XV meets the circle about V again at X′, and the line from X′ to A cuts the circle about A through V at a point W between them. The triangle VAW is isosceles with 30° at A, so the angle at V is 75° (on the far side of VA).',
    concepts: ['construction'], tags: ['angles'],
    given: [G.pt('V', V), G.pt('A', A), G.ray('V', 'A')],
    targets: [T.any([T.L(V, add(V, rot(u, -75)))], [T.L(V, add(V, rot(u, 75)))])],
    sol: [['perp', 'm', 'rayVA', 'V'], ['circle', 'cV', 'V', 'A'], ['x', 'B', 'm', 'cV', 'up'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['bisect', null, 'X', 'V', 'B']],
    solE: [['circle', 'cV', 'V', 'A'], ['circle', 'cA', 'A', 'V'], ['x', 'X', 'cV', 'cA', 'up'], ['line', 'l1', 'V', 'X'], ['x', 'X2', 'l1', 'cV', '!X'], ['line', 'l2', 'A', 'X2'], ['x', 'W', 'l2', 'cA', '~X2'], ['line', null, 'V', 'W']]
  });
}

/* =====================================================================
 *  Chapter 2 · Triangles and their centres
 * ===================================================================== */

{ // IV.5 circumcircle
  const A = [-2.4, 1.6], B = [2.6, 1.9], Cc = [0.4, -2.1], k = circum(A, B, Cc);
  put({
    id: 'cs-circumcircle', title: 'Around the Triangle', diff: 2, year: -300, source: EUCLID + ', Book IV, Proposition 5.',
    text: 'Draw the circle that passes through all three corners of the triangle **ABC**.',
    goal: 'The circumcircle of ABC.',
    hints: ['Its centre is equally far from A, B and C.', 'Equally far from A and B: a perpendicular bisector. Two of them meet at the centre.'],
    explain: 'The perpendicular bisectors of AB and BC meet at a point equally far from all three corners — so the bisector of CA must pass through it too: the three always meet. For a triangle with an obtuse angle the centre lies outside it.',
    concepts: ['construction', 'symmetry'], tags: ['triangle', 'circle', 'centre'],
    given: tri(A, B, Cc),
    targets: [T.C(k.c, k.r)],
    sol: [['perpbis', 'm1', 'A', 'B'], ['perpbis', 'm2', 'B', 'C'], ['x', 'O', 'm1', 'm2'], ['circle', null, 'O', 'A']]
  });
}

{ // centroid
  const A = [-2.8, 1.8], B = [2.4, 1.2], Cc = [-0.2, -2.4];
  put({
    id: 'cs-centroid', title: 'The Balancing Point', diff: 2,
    text: 'Mark the point where the triangle **ABC** would balance on a pin: its centroid, where the lines from each corner to the middle of the opposite side meet.',
    goal: 'The centroid of ABC.',
    hints: ['You need the midpoints of two sides.', 'Join each midpoint to the opposite corner; two of these medians are enough.'],
    explain: 'The three medians always meet, two-thirds of the way down each from its corner. Archimedes located the balancing point of a triangle on its medians in *On the Equilibrium of Planes* (about 250 BC).',
    concepts: ['construction'], tags: ['triangle', 'centre'],
    given: tri(A, B, Cc),
    targets: [T.P(mul(add(add(A, B), Cc), 1 / 3))],
    sol: [['perpbis', 'm1', 'A', 'B'], ['x', 'Mc', 'm1', 'AB'], ['perpbis', 'm2', 'B', 'C'], ['x', 'Ma', 'm2', 'BC'], ['line', null, 'C', 'Mc'], ['line', null, 'A', 'Ma']]
  });
}

{ // halve the triangle
  const A = [-0.4, -2.2], B = [-2.8, 1.6], Cc = [2.4, 1.2];
  put({
    id: 'cs-halve-triangle', title: 'Halve the Triangle', diff: 1,
    text: 'Draw the line through **A** that cuts the triangle **ABC** into two parts of equal area.',
    goal: 'The line through A that halves the area of ABC.',
    hints: ['Triangles with equal bases and the same height have equal areas.', 'Aim at the midpoint of BC.'],
    explain: 'The median from A splits BC into two equal bases under the same height, so the two halves have equal areas (Euclid I.38).',
    concepts: ['construction'], tags: ['triangle', 'area'],
    given: tri(A, B, Cc),
    targets: [T.L(A, mid(B, Cc))],
    sol: [['perpbis', 'm', 'B', 'C'], ['x', 'M', 'm', 'BC'], ['line', null, 'A', 'M']]
  });
}

{ // orthocentre
  const A = [-2.6, 1.6], B = [2.4, 2.0], Cc = [-0.4, -2.3];
  const H = meetLines(A, add(A, down(sub(Cc, B))), B, add(B, down(sub(A, Cc))));
  put({
    id: 'cs-orthocentre', title: 'Where the Heights Meet', diff: 2,
    text: 'Mark the orthocentre of **ABC**: the point where the three heights meet. (A height drops from a corner square onto the opposite side.)',
    goal: 'The orthocentre of ABC.',
    hints: ['A height is a perpendicular from a corner to the line of the opposite side.', 'Two heights are enough — the third passes through the same point.'],
    explain: 'That the three heights always meet is not in Euclid. A neat proof, often credited to Gauss: draw through each corner the parallel to the opposite side. The heights of ABC are then the perpendicular bisectors of the big triangle, and those always meet.',
    concepts: ['construction'], tags: ['triangle', 'centre'],
    given: tri(A, B, Cc),
    targets: [T.P(H)],
    sol: [['perp', 'h1', 'BC', 'A'], ['perp', 'h2', 'CA', 'B']]
  });
}

{ // IV.4 incircle
  const A = [-2.8, 1.8], B = [2.6, 1.6], Cc = [0.2, -2.4], k = incircle(A, B, Cc);
  put({
    id: 'cs-incircle', title: 'Inside the Triangle', diff: 3, year: -300, source: EUCLID + ', Book IV, Proposition 4.',
    text: 'Draw the circle inside **ABC** that touches all three sides.',
    goal: 'The incircle of ABC.',
    hints: ['Its centre is equally far from all three sides, so it lies on the bisectors of the angles.', 'Two angle bisectors meet at the centre. The radius is the distance from there to a side: drop a perpendicular.'],
    explain: 'Points on an angle bisector are equally far from the two arms; where two bisectors meet, the point is equally far from all three sides, so the third bisector passes there too. The circle touches each side at the foot of the perpendicular.',
    concepts: ['construction', 'symmetry'], tags: ['triangle', 'circle', 'centre'],
    given: tri(A, B, Cc),
    targets: [T.C(k.c, k.r)],
    sol: [['bisect', 'b1', 'B', 'A', 'C'], ['bisect', 'b2', 'A', 'B', 'C'], ['x', 'I', 'b1', 'b2'], ['perp', 'f', 'AB', 'I'], ['x', 'F', 'f', 'AB'], ['circle', null, 'I', 'F']]
  });
}

{ // a circle of given radius through two points
  const A = [-1.4, 0.8], B = [1.6, 0.2], Cc = [-2.6, -2.4], D = [0.4, -2.4], r = dist(Cc, D);
  const cs = circleCircle(A, r, B, r);
  put({
    id: 'cs-radius-two', title: 'A Circle of Given Size', diff: 2,
    text: 'Draw a circle whose radius is as long as the stick **CD** and that passes through both **A** and **B**.',
    goal: 'A circle of radius CD through A and B.',
    hints: ['Its centre is CD away from A and CD away from B.', 'Carry CD to A and to B: the two circles cross at the centre.'],
    explain: 'There are two such circles, mirror images of each other in AB — and none at all if CD is shorter than half of AB, because then the two carried circles miss each other.',
    concepts: ['construction', 'symmetry'], tags: ['circle', 'compass'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('C', 'D')],
    targets: [T.any([T.C(cs[0], r)], [T.C(cs[1], r)])],
    sol: [['compass', 'k1', 'C', 'D', 'A'], ['compass', 'k2', 'C', 'D', 'B'], ['x', 'O', 'k1', 'k2', 'up'], ['circle', null, 'O', 'A']]
  });
}

{ // right triangle from hypotenuse and leg
  const A = [-2.6, 1.3], B = [2.6, 0.9], Cc = [-2.4, 3.3], D = [-0.2, 3.3];
  const M = mid(A, B), cs = circleCircle(A, dist(Cc, D), M, dist(A, B) / 2);
  put({
    id: 'cs-hypleg', title: 'Hypotenuse and Leg', diff: 2,
    text: '**AB** is the longest side of a right triangle, and its side from **A** is as long as the stick **CD**. Draw the triangle.',
    goal: 'A right triangle with hypotenuse AB and side AT = CD.',
    hints: ['The corner with the right angle sits on the circle with diameter AB (Thales).', 'Carry CD to A: that circle meets Thales\' circle at the right-angled corner.'],
    explain: 'Two facts pin the corner T: it lies on the circle with diameter AB, because the angle there is right, and it lies CD away from A. It works whenever CD is shorter than AB.',
    concepts: ['construction'], tags: ['triangle', 'right angle', 'compass'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('A', 'B'), G.seg('C', 'D')],
    targets: [T.any([T.S(A, cs[0]), T.S(B, cs[0])], [T.S(A, cs[1]), T.S(B, cs[1])])],
    sol: [['perpbis', 'm', 'A', 'B'], ['x', 'M', 'm', 'AB'], ['circle', 'th', 'M', 'A'], ['compass', 'k', 'C', 'D', 'A'], ['x', 'T', 'th', 'k', 'up'], ['line', null, 'A', 'T'], ['line', null, 'B', 'T']]
  });
}

{ // excircle
  const A = [-2.2, 1.4], B = [1.6, 1.8], Cc = [-0.3, -1.6];
  const a = dist(B, Cc), b = dist(Cc, A), c = dist(A, B), s = a + b - c;
  const J = [(a * A[0] + b * B[0] - c * Cc[0]) / s, (a * A[1] + b * B[1] - c * Cc[1]) / s];
  put({
    id: 'cs-excircle', title: 'The Circle Outside', diff: 3,
    text: 'Draw the circle *outside* the triangle **ABC** that touches the side **AB** and the other two sides carried on beyond A and B.',
    goal: 'The excircle of ABC opposite C.',
    hints: ['Its centre lies on the bisector of the angle at C.', 'It also lies on the bisector of the *outside* angle at A, which is square to the inside bisector there.'],
    explain: 'Every triangle has four circles touching all three of its side lines: the incircle and three excircles. The inside and outside bisectors at a corner are always at right angles, so one perpendicular turns the one into the other.',
    concepts: ['construction', 'symmetry'], tags: ['triangle', 'circle', 'centre'],
    given: tri(A, B, Cc),
    targets: [T.C(J, dist(J, foot(J, A, B)))],
    sol: [['bisect', 'b1', 'A', 'C', 'B'], ['bisect', 'b2', 'C', 'A', 'B'], ['perp', 'e', 'b2', 'A'], ['x', 'J', 'b1', 'e'], ['perp', 'f', 'AB', 'J'], ['x', 'F', 'f', 'AB'], ['circle', null, 'J', 'F']]
  });
}

{ // Euler line
  const A = [-3, 1.8], B = [2.8, 1.4], Cc = [-0.9, -2.2];
  const O = circum(A, B, Cc).c, G3 = mul(add(add(A, B), Cc), 1 / 3);
  put({
    id: 'cs-euler', title: 'Euler\'s Line', diff: 3, year: 1765, source: 'Leonhard Euler (1765).',
    text: 'Draw the line through the circumcentre (where the perpendicular bisectors of the sides meet) and the orthocentre (where the heights meet) of **ABC**.',
    goal: 'The Euler line of ABC.',
    hints: ['Two perpendicular bisectors give the circumcentre; two heights give the orthocentre.', 'Join them. (The centroid is on this line too — any two of the three centres will do.)'],
    explain: 'Leonhard Euler showed in 1765 that the circumcentre, the centroid and the orthocentre of every triangle lie on one line, with the centroid a third of the way from the circumcentre to the orthocentre. The centre of the nine-point circle lies on it too, halfway between them.',
    concepts: ['construction'], tags: ['triangle', 'centre', 'line'],
    given: tri(A, B, Cc),
    targets: [T.L(O, G3)],
    sol: [['perpbis', 'm1', 'A', 'B'], ['perpbis', 'm2', 'B', 'C'], ['x', 'O', 'm1', 'm2'], ['perp', 'h1', 'BC', 'A'], ['perp', 'h2', 'CA', 'B'], ['x', 'H', 'h1', 'h2'], ['line', null, 'O', 'H']]
  });
}

{ // Fermat–Torricelli point
  const A = [-2.8, 1.4], B = [2.8, 1.6], Cc = [0.3, -2.0];
  const far = (p, q, from) => { const cs = circleCircle(p, dist(p, q), q, dist(p, q)); return dist(cs[0], from) > dist(cs[1], from) ? cs[0] : cs[1]; };
  const A1 = far(B, Cc, A), B1 = far(Cc, A, B); // the classic construction, for the target
  const F = meetLines(A, A1, B, B1);
  const ang = (p, q) => Math.acos(dot(unit(sub(p, F)), unit(sub(q, F)))) * 180 / Math.PI;
  [ang(A, B), ang(B, Cc), ang(Cc, A)].forEach((x) => { if (Math.abs(x - 120) > 1e-6) throw new Error('Fermat point angles ' + x); });
  put({
    id: 'cs-fermat', title: 'Torricelli\'s Point', diff: 3, year: 1640, source: 'Posed by Pierre de Fermat and solved by Evangelista Torricelli, 1640s.',
    text: 'Find the point **F** from which the three corners of **ABC** can be reached by the shortest total walk: FA + FB + FC as small as possible.',
    goal: 'The Fermat–Torricelli point of ABC.',
    hints: ['At the best point the three roads to the corners meet at 120° to each other.', 'Build equilateral triangles outward on two sides; join each new tip to the opposite corner of ABC. The two joins cross at F.'],
    explain: 'Pierre de Fermat set the problem to Evangelista Torricelli, who solved it: when every angle of the triangle is under 120°, the point sees each side at 120°, and the lines from the tips of the outward equilateral triangles to the opposite corners all pass through it. One such line costs 3 moves; the second can be had for 2: on the first line, beyond C, mark S with AS = AB (the circle about A through B). F sees AB and AS both at 120°, so B and S are mirror images in the line AF — and the circles about B and about S through A meet again on that line. The centres of the three equilateral triangles make yet another equilateral triangle — Napoleon\'s theorem, first printed in 1825.',
    concepts: ['construction', 'symmetry'], tags: ['triangle', 'centre', 'optimisation'],
    given: tri(A, B, Cc),
    targets: [T.P(F)],
    sol: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'B', 'A'], ['x', 'C1', 'k1', 'k2', near(far(A, B, Cc))], ['line', 'l', 'C', 'C1'], ['x', 'S', 'k1', 'l', '!C1'], ['circle', 'k3', 'S', 'A'], ['x', 'T', 'k2', 'k3', '!A'], ['line', null, 'A', 'T']]
  });
}

{ // equilateral triangle in a square
  const A = [-2, 2], B = [2, 2], Cc = [2, -2], D = [-2, -2], t = 4 * Math.tan(Math.PI / 12);
  const E = [2, 2 - t], F = [-2 + t, -2];
  put({
    id: 'cs-square-triangle', title: 'Triangle in a Square', diff: 3,
    text: 'Inside the square **ABCD**, draw an equilateral triangle with one corner at **A** and the other two on the sides **BC** and **CD**.',
    goal: 'The equilateral triangle AEF with E on BC and F on CD.',
    hints: ['By symmetry about the diagonal AC, the triangle\'s sides from A make 15° with the square\'s sides.', 'Build both equilateral triangles on BC, inside and outside the square: each tip lies on one of the two lines you need from A.'],
    explain: 'The triangle is symmetric about the diagonal AC, so its two sides from A make (90° − 60°) ÷ 2 = 15° with AB and with AD. Both tips of the equilateral triangles on BC lie on those lines: the inner tip W makes the isosceles triangle ABW (AB = BW) with 30° at B, so AW is 75° from AB; the outer tip W′ makes ABW′ isosceles with 150° at B, so AW′ is 15° from AB. Two circles and three lines.',
    concepts: ['construction', 'symmetry'], tags: ['triangle', 'square'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('A', 'B'), G.seg('B', 'C'), G.seg('C', 'D'), G.seg('D', 'A')],
    targets: [T.S(A, E), T.S(E, F), T.S(F, A)],
    sol: [['circle', 'k1', 'B', 'A'], ['circle', 'k2', 'C', 'B'], ['x', 'W', 'k1', 'k2', 'left'], ['x', 'W2', 'k1', 'k2', 'right'], ['line', 'l1', 'A', 'W2'], ['x', 'E', 'l1', 'BC'], ['line', 'l2', 'A', 'W'], ['x', 'F', 'l2', 'CD'], ['line', null, 'E', 'F']]
  });
}

{ // nine-point circle
  const A = [-3, 1.8], B = [2.6, 1.6], Cc = [-0.6, -2.4];
  const k = circum(mid(A, B), mid(B, Cc), mid(Cc, A));
  put({
    id: 'cs-ninepoint', title: 'The Nine-Point Circle', diff: 4, year: 1821, source: 'Charles Brianchon and Jean-Victor Poncelet (1821); Karl Feuerbach (1822).',
    text: 'Draw the circle through the midpoints of the three sides of **ABC**. It passes through six more remarkable points — hence its name.',
    goal: 'The nine-point circle of ABC.',
    hints: ['It also passes through the feet of the three heights.', 'Any three of its points fix it: two midpoints and the foot of a height will do, and two perpendicular bisectors between them find the centre.'],
    explain: 'The nine points: the midpoints of the three sides, the feet of the three heights, and the midpoints between the orthocentre and the corners. Brianchon and Poncelet published it in 1821; Karl Feuerbach added in 1822 that it touches the incircle and all three excircles. Its radius is half the circumradius, and its centre lies on the Euler line.',
    concepts: ['construction'], tags: ['triangle', 'circle'],
    links: ['cs-euler'],
    given: tri(A, B, Cc),
    targets: [T.C(k.c, k.r)],
    sol: [['perpbis', 'm1', 'A', 'B'], ['x', 'Mc', 'm1', 'AB'], ['perpbis', 'm2', 'B', 'C'], ['x', 'Ma', 'm2', 'BC'], ['perp', 'h1', 'BC', 'A'], ['x', 'Da', 'h1', 'BC'], ['perpbis', 'p1', 'Ma', 'Da'], ['perpbis', 'p2', 'Ma', 'Mc'], ['x', 'N', 'p1', 'p2'], ['circle', null, 'N', 'Ma']]
  });
}

/* =====================================================================
 *  Chapter 3 · Circles and tangents
 * ===================================================================== */

{ // III.30 halve an arc
  const O = [0, 0.4], A = add(O, [-2.4, -1.8]), B = add(O, [1.8, -2.4]);
  const M = add(O, mul(unit(sub(mid(A, B), O)), 3));
  put({
    id: 'cs-arc', title: 'Halve an Arc', diff: 1, year: -300, source: EUCLID + ', Book III, Proposition 30.',
    text: 'Mark the point halfway along the shorter arc of the circle from **A** to **B**.',
    goal: 'The midpoint of the arc AB.',
    hints: ['Equal arcs have equal chords.', 'The perpendicular bisector of the chord AB halves the arc too.'],
    explain: 'The perpendicular bisector of a chord passes through the centre and is a mirror line of the whole figure, so it cuts both arcs exactly in half.',
    concepts: ['construction', 'symmetry'], tags: ['circle', 'arc'],
    given: [G.pt('O', O), G.pt('A', A), G.pt('B', B), G.circ('O', 'A')],
    targets: [T.P(M)],
    sol: [['perpbis', null, 'A', 'B']]
  });
}

{ // III.1 find the centre
  const c = [0.3, 0.2], A = add(c, [-2.4, 1.8]), B = add(c, [1.8, -2.4]), Cc = add(c, [3, 0]);
  put({
    id: 'cs-centre', title: 'Where Is the Centre?', diff: 2, year: -300, source: EUCLID + ', Book III, Proposition 1.',
    text: 'A carpenter has a round table top with three nails, **A**, **B** and **C**, on its rim — but the centre mark has been planed away. Find the centre.',
    goal: 'The centre of the circle.',
    hints: ['The centre is equally far from all three nails.', 'The perpendicular bisector of any chord passes through the centre; two of them meet there.'],
    explain: 'Euclid III.1: the perpendicular bisector of any chord is a line of symmetry of the circle, so it passes through the centre. Two chords, two bisectors, one crossing — 6 elementary moves. Five will do, with only two nails: the circle about A through B cuts the rim again at B′, the mirror image of B in the diameter through A. The circles about B and B′ through A are mirror images too, so they meet again on that diameter — and the diameter crosses the bisector of AB at the centre.',
    concepts: ['construction', 'symmetry'], tags: ['circle', 'centre'],
    given: [G.circle('k', c, 3), G.pt('A', A, 'sw'), G.pt('B', B, 'ne'), G.pt('C', Cc, 'e')],
    targets: [T.P(c)],
    sol: [['perpbis', 'm1', 'A', 'B'], ['perpbis', 'm2', 'B', 'C']],
    solE: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'B', 'A'], ['x', 'X', 'k1', 'k2', 'up'], ['x', 'Y', 'k1', 'k2', 'down'], ['x', 'B2', 'k', 'k1', '!B'], ['circle', 'k3', 'B2', 'A'], ['x', 'T', 'k2', 'k3', '!A'], ['line', null, 'A', 'T'], ['line', null, 'X', 'Y']]
  });
}

{ // circle through two points centred on a line
  const la = [-3.4, 2.2], lb = [3.4, 1.5], A = [-1.4, -1.6], B = [1.6, -0.8];
  const O = meetLines(mid(A, B), add(mid(A, B), down(sub(B, A))), la, lb);
  put({
    id: 'cs-centreline', title: 'Centred on a Line', diff: 1,
    text: 'Draw a circle through **A** and **B** whose centre lies on the long line below them.',
    goal: 'A circle through A and B centred on the line.',
    hints: ['The centre is equally far from A and B.', 'So it is on their perpendicular bisector — and on the line: where the two cross.'],
    explain: 'The centres of all the circles through A and B fill the perpendicular bisector of AB. Exactly one of them lies on the given line (unless the line is parallel to the bisector, when none does).',
    concepts: ['construction'], tags: ['circle'],
    given: [G.lxy('l', la, lb), G.pt('A', A), G.pt('B', B)],
    targets: [T.C(O, dist(O, A))],
    sol: [['perpbis', 'm', 'A', 'B'], ['x', 'O', 'm', 'l'], ['circle', null, 'O', 'A']]
  });
}

{ // III.16 tangent at a point
  const O = [-0.2, 0.6], P = add(O, [1.8, -2.4]);
  put({
    id: 'cs-tangent-at', title: 'Touching at a Point', diff: 2, year: -300, source: EUCLID + ', Book III, Proposition 16.',
    text: 'Draw the tangent to the circle at **P**: the line that touches the circle there without crossing it.',
    goal: 'The tangent at P.',
    hints: ['A tangent stands square to the radius at the point where it touches.', 'Draw the line OP, then the perpendicular to it at P. (Or, for elementary moves: Thales again.)'],
    explain: 'Euclid III.16: the line at right angles to a radius at its end touches the circle, and no straight line can squeeze in between it and the circle. The 4-E route: the circle about P through O cuts the given circle at X; the circle about X through O passes through P too, and the line OX meets it again at T, the far end of a diameter. The angle OPT is in a semicircle, so PT is the tangent.',
    concepts: ['construction'], tags: ['circle', 'tangent'],
    given: [G.pt('O', O), G.pt('P', P), G.circ('O', 'P')],
    targets: [T.L(P, add(P, down(sub(P, O))))],
    sol: [['line', 'l', 'O', 'P'], ['perp', null, 'l', 'P']],
    solE: [['circle', 'k1', 'P', 'O'], ['x', 'X', 'k1', 'cOP', 'up'], ['circle', 'k2', 'X', 'O'], ['line', 'l2', 'O', 'X'], ['x', 'T', 'l2', 'k2', '!O'], ['line', null, 'P', 'T']]
  });
}

{ // shortest chord through a point
  const c = [-0.4, 0.3], P = [1.1, -0.6];
  put({
    id: 'cs-chord', title: 'The Shortest Chord', diff: 2, year: -300, source: 'The idea is ' + EUCLID + ' III.3.',
    text: 'Through the point **P** inside the circle, draw the chord that P cuts exactly in half. (It is also the shortest chord through P.)',
    goal: 'The chord through P that P bisects.',
    hints: ['A line from the centre that bisects a chord stands square to it.', 'So the chord is the perpendicular to OP at P.'],
    explain: 'Euclid III.3: a line through the centre bisects a chord exactly when it is perpendicular to it. Chords farther from the centre are shorter, and of all the chords through P this one is the farthest from O — at the full distance OP.',
    concepts: ['construction', 'symmetry'], tags: ['circle', 'chord'],
    given: [G.pt('O', c), G.pt('P', P), G.circle('k', c, 3)],
    targets: [T.L(P, add(P, down(sub(P, c))))],
    sol: [['line', 'l', 'O', 'P'], ['perp', null, 'l', 'P']]
  });
}

{ // tangents parallel to a line
  const c = [-0.6, 0.2], r = 2.3, la = [-3.8, 3.3], lb = [3.4, 2.1];
  const n = unit(down(sub(lb, la))), T1 = add(c, mul(n, r)), T2 = sub(c, mul(n, r)), dv = sub(lb, la);
  put({
    id: 'cs-tangent-parallel', title: 'Tangents Parallel to a Line', diff: 2,
    text: 'Draw both tangents to the circle that run parallel to the line below it.',
    goal: 'The two tangents parallel to the line.',
    hints: ['The points of contact are the two ends of the diameter square to the line.', 'Drop the perpendicular from O to the line; where it meets the circle, raise perpendiculars to it.'],
    explain: 'A tangent is square to the radius at its point of contact, and a line parallel to the given one is square to the perpendicular from O. So the radii to the points of contact lie along that perpendicular.',
    concepts: ['construction', 'symmetry'], tags: ['circle', 'tangent', 'parallel'],
    given: [G.pt('O', c), G.circle('k', c, r), G.lxy('l', la, lb)],
    targets: [T.L(T1, add(T1, dv)), T.L(T2, add(T2, dv))],
    sol: [['perp', 'n', 'l', 'O'], ['x', 'T1', 'n', 'k', near(T1)], ['x', 'T2', 'n', 'k', near(T2)], ['perp', null, 'n', 'T1'], ['perp', null, 'n', 'T2']]
  });
}

{ // circle tangent to a line at T through P
  const la = [-3.2, 2.2], lb = [3.2, 1.4], Tp = mid(la, lb), P = [1.4, -1.2];
  const O = meetLines(Tp, add(Tp, down(sub(lb, la))), mid(Tp, P), add(mid(Tp, P), down(sub(P, Tp))));
  put({
    id: 'cs-kiss-line', title: 'Kissing a Line', diff: 3,
    text: 'Draw the circle that touches the line at **T** and passes through **P**.',
    goal: 'The circle through P tangent to the line at T.',
    hints: ['The centre lies on the perpendicular to the line at T.', 'It is also equally far from T and P.'],
    explain: 'A circle touches a line exactly when its radius to the point of contact is square to the line; being equally far from T and P then pins the centre to one point.',
    concepts: ['construction'], tags: ['circle', 'tangent'],
    given: [G.lxy('l', la, lb), G.pt('T', Tp, 's'), G.pt('P', P)],
    targets: [T.C(O, dist(O, Tp))],
    sol: [['perp', 'n', 'l', 'T'], ['perpbis', 'm', 'T', 'P'], ['x', 'O', 'n', 'm'], ['circle', null, 'O', 'T']]
  });
}

{ // circle tangent to a circle at T through P
  const O = [-1.4, 0.8], Tp = add(O, [1.8, -2.4]), P = [3.0, 0.8];
  const X = meetLines(O, Tp, mid(Tp, P), add(mid(Tp, P), down(sub(P, Tp))));
  put({
    id: 'cs-kiss-circle', title: 'Kissing a Circle', diff: 2,
    text: 'Draw a circle through **P** that touches the given circle at **T**.',
    goal: 'The circle through P tangent to the circle at T.',
    hints: ['Two circles touch at T when both centres lie on one line through T.', 'So the new centre is on the line OT, and equally far from T and P.'],
    explain: 'Circles that touch share their tangent line at the point of contact, so both radii there lie along one line — the line through the two centres.',
    concepts: ['construction'], tags: ['circle', 'tangent'],
    given: [G.pt('O', O), G.pt('T', Tp), G.pt('P', P), G.circ('O', 'T')],
    targets: [T.C(X, dist(X, Tp))],
    sol: [['line', 'l', 'O', 'T'], ['perpbis', 'm', 'T', 'P'], ['x', 'X', 'l', 'm'], ['circle', null, 'X', 'T']]
  });
}

{ // III.17 two tangents from a point
  const O = [-1.0, 0.4], r = 2.5, P = [3.4, 1.2], M = mid(O, P);
  const Ts = circleCircle(O, r, M, dist(O, P) / 2);
  put({
    id: 'cs-two-tangents', title: 'Two Tangents', diff: 2, year: -300, source: EUCLID + ', Book III, Proposition 17.',
    text: 'From the point **P** outside the circle, draw both tangents to it.',
    goal: 'The two tangents from P.',
    hints: ['At a point of contact the tangent is square to the radius — so O and P are seen from there at a right angle.', 'Thales: the points of contact lie on the circle with diameter OP.'],
    explain: 'Euclid III.17 uses a bigger circle about O; Thales\' circle is quicker. The two tangents are equally long, and OP bisects the angle between them.',
    concepts: ['construction', 'symmetry'], tags: ['circle', 'tangent'],
    given: [G.pt('O', O), G.pt('P', P), G.circle('k', O, r)],
    targets: [T.L(P, Ts[0]), T.L(P, Ts[1])],
    sol: [['line', 'l', 'O', 'P'], ['perpbis', 'm', 'O', 'P'], ['x', 'M', 'l', 'm'], ['circle', 'th', 'M', 'O'], ['x', 'T1', 'th', 'k', near(Ts[0])], ['x', 'T2', 'th', 'k', near(Ts[1])], ['line', null, 'P', 'T1'], ['line', null, 'P', 'T2']]
  });
}

{ // reflect a circle
  const E = [-3.2, 1.8], F = [3.4, 1.0], O = [-0.8, -1.4], A = add(O, [0.9, -1.2]);
  put({
    id: 'cs-mirror-circle', title: 'A Circle in the Mirror', diff: 2,
    text: 'The line **EF** is a mirror. Draw the reflection of the circle about **O**.',
    goal: 'The mirror image of the circle in EF.',
    hints: ['The image of a circle is a circle of the same size about the image of its centre.', 'Reflect O (two circles), then carry the radius — or reflect A as well and draw through it.'],
    explain: 'Reflection keeps every length, so the image of a circle is a circle of the same radius about the reflected centre. With the rigid compass it is 3 L. With plain circles 4 will do: the circle about F through O meets the given circle at a point S; a circle about a point of the mirror through S also passes through S′, the mirror image of S, so the circle about E through S finds S′ on the circle about F — and S′ lies on the reflected circle.',
    concepts: ['symmetry', 'construction'], tags: ['circle', 'reflection'],
    given: [G.pt('E', E), G.pt('F', F), G.pt('O', O), G.pt('A', A), G.line('E', 'F'), G.circ('O', 'A')],
    targets: [T.C(reflectPt(O, E, F), dist(O, A))],
    sol: [['circle', 'k1', 'E', 'O'], ['circle', 'k2', 'F', 'O'], ['x', 'O2', 'k1', 'k2', '!O'], ['compass', null, 'O', 'A', 'O2']],
    solE: [['circle', 'k1', 'E', 'O'], ['circle', 'k2', 'F', 'O'], ['x', 'O2', 'k1', 'k2', '!O'], ['x', 'S', 'cOA', 'k2', 'up'], ['circle', 'k3', 'E', 'S'], ['x', 'S2', 'k2', 'k3', '!S'], ['circle', null, 'O2', 'S2']]
  });
}

{ // Hippocrates' lune
  const A = [-2.6, 1.4], B = [2.6, 1.4], M = mid(A, B), R = 2.6, Cu = [0, 1.4 - R], Cd = [0, 1.4 + R];
  const lune = (X, Cx) => [T.C(M, R), T.C(mid(X, Cx), dist(X, Cx) / 2)];
  put({
    id: 'cs-lune', title: 'Hippocrates\' Lune', diff: 3, year: -440, source: 'Hippocrates of Chios, about 440 BC (reported by Simplicius).',
    text: 'Draw the two circles of Hippocrates\' first lune: the circle with diameter **AB**, and the circle whose diameter is the chord from A to the point **C** of the first circle straight above (or below) the middle of AB.',
    goal: 'The circle on AB and the circle on the chord AC.',
    hints: ['The first circle is Thales\' circle on AB; C is where the perpendicular bisector of AB meets it.', 'The second circle has AC as a diameter: find the midpoint of AC.'],
    explain: 'The lune is the crescent inside the small circle and outside the big one. Hippocrates showed that its area equals exactly the area of the right triangle AMC (M the middle of AB) — the first curved figure ever proved equal in area to a straight-sided one. It raised hopes of squaring the circle itself, but in 1882 Ferdinand von Lindemann proved π transcendental, which makes that impossible.',
    concepts: ['construction'], tags: ['circle', 'area', 'lune'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.any(lune(A, Cu), lune(B, Cu), lune(A, Cd), lune(B, Cd))],
    sol: [['perpbis', 'm', 'A', 'B'], ['x', 'M', 'm', 'AB'], ['circle', 'k', 'M', 'A'], ['x', 'C', 'm', 'k', 'up'], ['line', 'l', 'A', 'C'], ['perpbis', 'n', 'A', 'C'], ['x', 'N', 'n', 'l'], ['circle', null, 'N', 'A']]
  });
}

{ // radical axis
  const O = [-2.5, 0.5], r1 = 1.8, Q = [2.3, 0.1], r2 = 1.2, d = dist(O, Q);
  const x = (d * d + r1 * r1 - r2 * r2) / (2 * d), X = add(O, mul(unit(sub(Q, O)), x));
  const Z = circleCircle(O, d, Q, d).sort((p, q) => p[1] - q[1])[0];
  const as = circleCircle(Z, d, O, r1), bs = circleCircle(Z, d, Q, r2);
  put({
    id: 'cs-radical', title: 'The Radical Axis', diff: 4,
    text: 'Draw the line of points from which the tangents to the two circles are equally long: their *radical axis*.',
    goal: 'The radical axis of the two circles.',
    hints: ['For two circles that cross, it is simply the line through their crossings. These two do not cross.', 'Draw a helper circle that crosses both. Its common chord with each circle lies on a radical axis; the two chords meet at a point of the line you want, which stands square to OQ.'],
    explain: 'The square of the tangent length from a point (its *power*) is the same for two circles all along their common chord. So where the helper\'s two common chords meet, the power is the same for all three circles: that point lies on the radical axis of the given two, which is always perpendicular to the line of centres. The idea belongs to early 19th-century French geometry.',
    concepts: ['construction'], tags: ['circle', 'power'],
    given: [G.pt('O', O), G.pt('Q', Q), G.circle('k1', O, r1), G.circle('k2', Q, r2)],
    targets: [T.L(X, add(X, down(sub(Q, O))))],
    sol: [['circle', 'k3', 'O', 'Q'], ['circle', 'k4', 'Q', 'O'], ['x', 'Z', 'k3', 'k4', 'up'], ['circle', 'k5', 'Z', 'O'], ['x', 'A1', 'k5', 'k1', near(as[0])], ['x', 'A2', 'k5', 'k1', near(as[1])], ['x', 'B1', 'k5', 'k2', near(bs[0])], ['x', 'B2', 'k5', 'k2', near(bs[1])], ['line', 'la', 'A1', 'A2'], ['line', 'lb', 'B1', 'B2'], ['x', 'R', 'la', 'lb'], ['line', 'l', 'O', 'Q'], ['perp', null, 'l', 'R']]
  });
}

{ // outer common tangent
  const O = [-2.2, 0.9], r1 = 2.2, Q = [2.4, 0.3], r2 = 1.1;
  const D = sub(O, Q), dd = len(D), al = (r1 - r2) / dd, be = Math.sqrt(1 - al * al);
  const tangents = [1, -1].map((s) => {
    const n = add(mul(D, al / dd), mul(down(D), s * be / dd));
    return [sub(O, mul(n, r1)), sub(Q, mul(n, r2))];
  });
  const lOQ = unit(sub(Q, O)), U1 = add(O, mul(up(lOQ), r1)), U2 = add(Q, mul(up(lOQ), r2));
  const H = meetLines(U1, U2, O, Q), Mh = mid(O, H);
  const Tt = circleCircle(O, r1, Mh, dist(O, H) / 2);
  put({
    id: 'cs-common-tangent', title: 'The Belt', diff: 5,
    text: 'A belt runs around two wheels without crossing itself. Draw one straight run of the belt: a line that touches both circles on the same side.',
    goal: 'An outer common tangent of the two circles.',
    hints: ['Seen from one special point on the line of centres, beyond the small wheel, the two circles look exactly alike: the outer tangents pass through it.', 'Parallel radii pointing the same way (say, both square to OQ) have their ends on a line through that point. From there it is a tangent from a point, as in Two Tangents.'],
    explain: 'Any two circles are scaled copies of each other from a *centre of similitude* on the line of centres; a line through it that touches one circle touches the other. The ends of two parallel radii line up with it, and Thales\' circle does the rest. The textbook alternative: shrink both circles by the small radius, so the small one becomes a point, draw the tangent from that point, and move it back out.',
    concepts: ['construction', 'symmetry'], tags: ['circle', 'tangent', 'similarity'],
    links: ['cs-two-tangents'],
    given: [G.pt('O', O), G.pt('Q', Q), G.circle('k1', O, r1), G.circle('k2', Q, r2)],
    targets: [T.any([T.L(tangents[0][0], tangents[0][1])], [T.L(tangents[1][0], tangents[1][1])])],
    sol: [['line', 'l', 'O', 'Q'], ['perp', 'p1', 'l', 'O'], ['x', 'U1', 'p1', 'k1', near(U1)], ['perp', 'p2', 'l', 'Q'], ['x', 'U2', 'p2', 'k2', near(U2)], ['line', 'l2', 'U1', 'U2'], ['x', 'H', 'l2', 'l'], ['perpbis', 'm', 'O', 'H'], ['x', 'Mh', 'm', 'l'], ['circle', 'th', 'Mh', 'O'], ['x', 'T', 'th', 'k1', near(Tt[0])], ['line', null, 'H', 'T']]
  });
}

{ // Apollonius: through two points, touching a line
  const la = [-3.8, 2.4], lb = [3.8, 1.9], P = [-0.4, -0.6], Q = [0.8, -2.4];
  const X = meetLines(P, Q, la, lb), t = Math.sqrt(dist(X, P) * dist(X, Q)), u = unit(sub(lb, la));
  const pb = [mid(P, Q), add(mid(P, Q), down(sub(Q, P)))];
  const answers = [add(X, mul(u, t)), sub(X, mul(u, t))].map((Tp) => { const Oc = meetLines(Tp, add(Tp, down(u)), pb[0], pb[1]); return [T.C(Oc, dist(Oc, Tp))]; });
  const M = mid(P, Q), N = mid(X, M), S = circleCircle(M, dist(P, Q) / 2, N, dist(X, M) / 2);
  put({
    id: 'cs-apollonius', title: 'Through Two Points, Touching a Line', diff: 5, year: -200, source: 'One of the tangency problems of Apollonius of Perga (about 200 BC).',
    text: 'Draw a circle that passes through **P** and **Q** and just touches the line below them.',
    goal: 'A circle through P and Q tangent to the line.',
    hints: ['Let the line PQ meet the given line at X. If the circle touches it at T, then XT² = XP · XQ — the power of the point X.', 'That length is the tangent from X to *any* circle through P and Q — the one with diameter PQ will do. Swing it onto the line from X, and the centre is above T on the perpendicular bisector of PQ.'],
    explain: 'Apollonius of Perga (about 200 BC) asked for circles through given points and touching given lines or circles; this is one of his ten cases. The power of the point X turns it into a length to carry: every circle through P and Q has the same tangent length √(XP · XQ) from X. There are two answers, one on each side of X.',
    concepts: ['construction'], tags: ['circle', 'tangent', 'power', 'apollonius'],
    links: ['cs-two-tangents', 'cs-radical'],
    given: [G.lxy('l', la, lb), G.pt('P', P), G.pt('Q', Q)],
    targets: [T.any(answers[0], answers[1])],
    sol: [['line', 'lPQ', 'P', 'Q'], ['x', 'X', 'lPQ', 'l'], ['perpbis', 'm', 'P', 'Q'], ['x', 'M', 'm', 'lPQ'], ['circle', 'k', 'M', 'P'], ['perpbis', 'm2', 'X', 'M'], ['x', 'N', 'm2', 'lPQ'], ['circle', 'k2', 'N', 'X'], ['x', 'S', 'k2', 'k', near(S[0])], ['circle', 'k3', 'X', 'S'], ['x', 'T', 'k3', 'l', near(add(X, mul(u, t)))], ['perp', 'n', 'l', 'T'], ['x', 'O', 'n', 'm'], ['circle', null, 'O', 'T']]
  });
}

/* =====================================================================
 *  Chapter 4 · Regular polygons and the golden section
 * ===================================================================== */

const ring = (O, r, a0, n) => Array.from({ length: n }, (_, k) => polar(O, r, a0 + k * 360 / n));
const angOf = (O, P) => Math.atan2(P[1] - O[1], P[0] - O[0]) * 180 / Math.PI;

{ // IV.8 circle in a square
  const A = [-2.1, 1.9], B = [1.9, 2.3], Cc = [2.3, -1.7], D = [-1.7, -2.1];
  put({
    id: 'cs-circle-in-square', title: 'A Circle in a Square', diff: 1, year: -300, source: EUCLID + ', Book IV, Proposition 8.',
    text: 'Draw the circle inside the square **ABCD** that touches all four sides.',
    goal: 'The circle inscribed in the square.',
    hints: ['The centre is the middle of the square, where its mirror lines and diagonals cross.', 'The perpendicular bisector of AB meets AB at the point of contact and the diagonal AC at the centre.'],
    explain: 'By symmetry the centre is where the square\'s mirror lines and diagonals cross, and the circle touches each side at its midpoint.',
    concepts: ['construction', 'symmetry'], tags: ['square', 'circle', 'polygon'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('A', 'B'), G.seg('B', 'C'), G.seg('C', 'D'), G.seg('D', 'A')],
    targets: [T.C(mid(A, Cc), dist(A, B) / 2)],
    sol: [['perpbis', 'm1', 'A', 'B'], ['x', 'M', 'm1', 'AB'], ['line', 'd', 'A', 'C'], ['x', 'O', 'm1', 'd'], ['circle', null, 'O', 'M']]
  });
}

{ // equilateral triangle in a circle
  const O = [0, 0.3], A = add(O, [0, -3]), V = ring(O, 3, -90, 3);
  put({
    id: 'cs-tri-in-circle', title: 'A Triangle in a Circle', diff: 2, year: -300, source: 'After ' + EUCLID + ', Book IV, Proposition 2.',
    text: 'Inscribe an equilateral triangle in the circle, with one corner at **A**.',
    goal: 'The three sides of the equilateral triangle with a corner at A.',
    hints: ['Its other corners are a third of the way round in each direction.', 'From the far end of the diameter through A, the radius steps exactly onto them.'],
    explain: 'The corners of the regular hexagon on the circle alternate: take every second one and you have the triangle. The two corners next to the point D opposite A are 60° from D, so 120° from A.',
    concepts: ['construction', 'symmetry'], tags: ['triangle', 'polygon', 'circle'],
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: sides(V, true),
    sol: [['line', 'l', 'A', 'O'], ['x', 'D', 'l', 'cOA', '!A'], ['circle', 'k', 'D', 'O'], ['x', 'B', 'k', 'cOA', near(V[1])], ['x', 'C', 'k', 'cOA', near(V[2])], ['line', null, 'A', 'B'], ['line', null, 'B', 'C'], ['line', null, 'C', 'A']]
  });
}

{ // IV.15 hexagon in a circle
  const O = [0, 0.2], A = add(O, [1.8, -2.4]), V = ring(O, 3, angOf(O, A), 6);
  put({
    id: 'cs-hexagon', title: 'Six Around One', diff: 2, year: -300, source: EUCLID + ', Book IV, Proposition 15.',
    text: 'Inscribe a regular hexagon in the circle, with one corner at **A**.',
    goal: 'The six sides of the regular hexagon with a corner at A.',
    hints: ['The side of the regular hexagon is exactly the radius.', 'The circle about A through O gives both neighbours of A; the corner opposite A ends the diameter through A, and the radius steps from there too.'],
    explain: 'Six equilateral triangles meet at the centre, so the side equals the radius and the compass never needs a new opening. Bees reached the hexagon without one.',
    concepts: ['construction', 'symmetry'], tags: ['hexagon', 'polygon', 'circle'],
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: sides(V, true),
    sol: [['circle', 'kA', 'A', 'O'], ['x', 'B', 'kA', 'cOA', near(V[1])], ['x', 'F', 'kA', 'cOA', near(V[5])], ['line', 'l', 'A', 'O'], ['x', 'D', 'l', 'cOA', '!A'], ['circle', 'kD', 'D', 'O'], ['x', 'C', 'kD', 'cOA', near(V[2])], ['x', 'E', 'kD', 'cOA', near(V[4])],
      ['line', null, 'A', 'B'], ['line', null, 'B', 'C'], ['line', null, 'C', 'D'], ['line', null, 'D', 'E'], ['line', null, 'E', 'F'], ['line', null, 'F', 'A']]
  });
}

{ // IV.6 square in a circle
  const O = [0.2, 0.2], A = add(O, [2.4, -1.8]), V = ring(O, 3, angOf(O, A), 4);
  put({
    id: 'cs-square-in-circle', title: 'A Square in a Circle', diff: 2, year: -300, source: EUCLID + ', Book IV, Proposition 6.',
    text: 'Inscribe a square in the circle, with one corner at **A**.',
    goal: 'The four sides of the square inscribed in the circle with a corner at A.',
    hints: ['The diagonals of a square are equal, halve each other and cross at right angles.', 'One diagonal is the diameter through A; the other is the diameter square to it.'],
    explain: 'Two perpendicular diameters, and their four ends are the corners of the square.',
    concepts: ['construction', 'symmetry'], tags: ['square', 'polygon', 'circle'],
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: sides(V, true),
    sol: [['line', 'l', 'A', 'O'], ['x', 'C', 'l', 'cOA', '!A'], ['perpbis', 'm', 'A', 'C'], ['x', 'B', 'm', 'cOA', near(V[1])], ['x', 'D', 'm', 'cOA', near(V[3])], ['line', null, 'A', 'B'], ['line', null, 'B', 'C'], ['line', null, 'C', 'D'], ['line', null, 'D', 'A']]
  });
}

{ // IV.7 square around a circle
  const O = [0.2, 0.3], r = 3, A = add(O, [1.8, -2.4]), u = unit(sub(A, O)), v = down(u);
  const K = [add(O, mul(add(u, v), r)), add(O, mul(sub(u, v), r)), sub(O, mul(add(u, v), r)), add(O, mul(sub(v, u), r))];
  put({
    id: 'cs-square-around', title: 'A Square Around a Circle', diff: 2, year: -300, source: EUCLID + ', Book IV, Proposition 7.',
    text: 'Draw the square that fits around the circle, touching it at **A** and at three other points.',
    goal: 'The four sides of the square around the circle, touching it at A.',
    hints: ['Each side is a tangent, square to a radius.', 'Take two perpendicular diameters; the tangents at their four ends make the square.'],
    explain: 'The tangents at the ends of two perpendicular diameters are parallel in pairs and square in pairs, and each is one radius from the centre: a square of side twice the radius.',
    concepts: ['construction', 'symmetry'], tags: ['square', 'polygon', 'circle', 'tangent'],
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: sides(K, true),
    sol: [['line', 'l', 'A', 'O'], ['x', 'C', 'l', 'cOA', '!A'], ['perp', null, 'l', 'A'], ['perp', null, 'l', 'C'], ['perpbis', 'm', 'A', 'C'], ['x', 'B', 'm', 'cOA', near(add(O, mul(v, r)))], ['x', 'D', 'm', 'cOA', near(sub(O, mul(v, r)))], ['perp', null, 'm', 'B'], ['perp', null, 'm', 'D']]
  });
}

{ // hexagon on a side
  const A = [-1.6, 2.0], B = [1.4, 2.3], s = dist(A, B);
  const hex = (Oc) => { const a0 = angOf(Oc, A), st = ((angOf(Oc, B) - a0 + 540) % 360) - 180; return Array.from({ length: 6 }, (_, k) => polar(Oc, s, a0 + k * st)); };
  const Os = circleCircle(A, s, B, s).sort((p, q) => p[1] - q[1]);
  const Hu = hex(Os[0]), Hd = hex(Os[1]);
  const five = (H) => [T.S(H[1], H[2]), T.S(H[2], H[3]), T.S(H[3], H[4]), T.S(H[4], H[5]), T.S(H[5], H[0])];
  put({
    id: 'cs-hexagon-side', title: 'A Hexagon on a Side', diff: 3,
    text: 'Build a regular hexagon on the side **AB**.',
    goal: 'The other five sides of a regular hexagon on AB.',
    hints: ['The centre of the hexagon makes an equilateral triangle with A and B.', 'Draw the circle about that centre through A: every corner lies on it, one radius from the next.'],
    explain: 'A regular hexagon is six equilateral triangles around its centre. Once the centre is found, the circles already drawn about A and B pick out the neighbours C and F, and diameters through A and B finish the job.',
    concepts: ['construction', 'symmetry'], tags: ['hexagon', 'polygon'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.any(five(Hu), five(Hd))],
    sol: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'B', 'A'], ['x', 'O', 'k1', 'k2', 'up'], ['circle', 'k3', 'O', 'A'], ['x', 'F', 'k1', 'k3', '!B'], ['x', 'C', 'k2', 'k3', '!A'], ['line', 'l1', 'A', 'O'], ['x', 'D', 'l1', 'k3', '!A'], ['line', 'l2', 'B', 'O'], ['x', 'E', 'l2', 'k3', '!B'],
      ['line', null, 'B', 'C'], ['line', null, 'C', 'D'], ['line', null, 'D', 'E'], ['line', null, 'E', 'F'], ['line', null, 'F', 'A']]
  });
}

{ // octagon in a circle
  const O = [0, 0.3], A = add(O, [0, -3]), V = ring(O, 3, -90, 8);
  put({
    id: 'cs-octagon', title: 'Eight Sides', diff: 3,
    text: 'Inscribe a regular octagon in the circle, with one corner at **A**.',
    goal: 'The eight sides of the regular octagon with a corner at A.',
    hints: ['Start with the inscribed square.', 'Halve the right angles at the centre: the bisectors meet the circle at the other four corners.'],
    explain: 'From any regular polygon you get one with twice as many sides by halving the angles at the centre: square, octagon, sixteen sides… Euclid could build the 3-, 4-, 5- and 15-gons and their doublings; the next new one, the 17-gon, waited for Gauss in 1796.',
    concepts: ['construction', 'symmetry'], tags: ['octagon', 'polygon', 'circle'],
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: sides(V, true),
    sol: [['line', 'l', 'A', 'O'], ['x', 'E', 'l', 'cOA', '!A'], ['perpbis', 'm', 'A', 'E'], ['x', 'C', 'm', 'cOA', near(V[2])], ['x', 'G', 'm', 'cOA', near(V[6])],
      ['bisect', 'b1', 'A', 'O', 'C'], ['x', 'B', 'b1', 'cOA', near(V[1])], ['x', 'F', 'b1', 'cOA', near(V[5])], ['bisect', 'b2', 'C', 'O', 'E'], ['x', 'D', 'b2', 'cOA', near(V[3])], ['x', 'H', 'b2', 'cOA', near(V[7])],
      ['line', null, 'A', 'B'], ['line', null, 'B', 'C'], ['line', null, 'C', 'D'], ['line', null, 'D', 'E'], ['line', null, 'E', 'F'], ['line', null, 'F', 'G'], ['line', null, 'G', 'H'], ['line', null, 'H', 'A']]
  });
}

{ // doubling the square (Meno)
  const A = [-1.6, 1.6], B = [1.6, 1.6], Cc = [1.6, -1.6], D = [-1.6, -1.6];
  const onDiag = (P, Q, dir) => { const Pq = add(P, dir), Qq = add(Q, dir); return [T.S(P, Q), T.S(Q, Qq), T.S(Qq, Pq), T.S(Pq, P)]; };
  put({
    id: 'cs-double-square', title: 'Socrates Doubles the Square', diff: 2, year: -385, source: 'Plato, *Meno* (about 385 BC).',
    text: 'In Plato\'s *Meno*, Socrates draws a square in the sand and asks a boy who has never learned geometry for a square twice as large. Draw it: the square whose side is the diagonal **AC** (or BD) of **ABCD**.',
    goal: 'A square built on a diagonal of ABCD.',
    hints: ['Doubling the side makes the area four times as big — the boy\'s first guess. The diagonal is the right side.', 'The line AC, the perpendiculars to it at A and at C, and one more side parallel to AC.'],
    explain: 'The square on the diagonal is made of four half-squares, each half the original, so its area is exactly double. Doubling a *cube* is another matter: its edge would have to be ∛2 times as long, and Pierre Wantzel proved in 1837 that ∛2 cannot be constructed. The Delians, told by an oracle to double Apollo\'s cubic altar, had been set an impossible task.',
    concepts: ['construction', 'symmetry'], tags: ['square', 'area', 'classic'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('A', 'B'), G.seg('B', 'C'), G.seg('C', 'D'), G.seg('D', 'A')],
    targets: [T.any(onDiag(A, Cc, sub(D, B)), onDiag(A, Cc, sub(B, D)), onDiag(B, D, sub(A, Cc)), onDiag(B, D, sub(Cc, A)))],
    sol: [['line', 'l', 'A', 'C'], ['perp', 'p1', 'l', 'A'], ['perp', null, 'l', 'C'], ['circle', 'k', 'A', 'C'], ['x', 'E', 'p1', 'k', near(add(A, sub(D, B)))], ['perp', null, 'p1', 'E']]
  });
}

{ // II.11 golden section
  const A = [-2.6, 1.3], B = [2.6, 0.9];
  put({
    id: 'cs-golden-section', title: 'The Golden Cut', diff: 3, year: -300, source: EUCLID + ', Book II, Proposition 11 (and VI.30).',
    text: 'Cut **AB** at a point **G** so that the whole is to the larger part as the larger part is to the smaller: AB : AG = AG : GB.',
    goal: 'The point G of AB with AB : AG = AG : GB (AG the larger part).',
    hints: ['If AB = 1, then AG = (√5 − 1)/2 — and √5/2 is the diagonal of a rectangle 1 by ½.', 'Stand BT = ½ AB square on AB at B. The circle about T through B cuts the line AT at P; AP is the length you want.'],
    explain: 'With AB = 1, AT = √5/2; take away TP = ½ and AP = (√5 − 1)/2 ≈ 0.618, so AB/AG = (1 + √5)/2 = φ, the golden ratio. Euclid calls it cutting a line in *extreme and mean ratio*; the name \'golden section\' is from the 19th century.',
    concepts: ['construction'], tags: ['golden ratio', 'lengths'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.P(add(A, mul(sub(B, A), 1 / PHI)))],
    sol: [['perp', 'n', 'AB', 'B'], ['perpbis', 'm', 'A', 'B'], ['x', 'M', 'm', 'AB'], ['circle', 'k1', 'B', 'M'], ['x', 'T', 'k1', 'n', 'up'], ['line', 'l', 'A', 'T'], ['circle', 'k2', 'T', 'B'], ['x', 'P', 'k2', 'l', '~A'], ['circle', null, 'A', 'P']]
  });
}

{ // golden rectangle
  const A = [-2, 2], B = [2, 2], Cc = [2, -2], D = [-2, -2], g = 4 * PHI;
  const rect = (P, Q, dir) => { const E = add(P, mul(dir, g)), F = add(Q, mul(dir, g)); return [T.S(add(P, mul(dir, 4)), E), T.S(E, F), T.S(F, add(Q, mul(dir, 4)))]; };
  put({
    id: 'cs-golden-rect', title: 'The Golden Rectangle', diff: 2,
    text: 'Extend the square **ABCD** to a golden rectangle: one whose long side is φ ≈ 1.618 times its short side, with the square inside it at one end.',
    goal: 'The three new sides of a golden rectangle built on the square.',
    hints: ['From the midpoint of a side, the far corner is √5/2 sides away.', 'Swing that distance down onto the extended side from the midpoint M of AB.'],
    explain: 'For a unit square, MC = √(1 + ¼) = √5/2, so the swing lands at ½ + √5/2 = φ from A. Cut the square off a golden rectangle and what is left is golden again — and so on for ever, which is where the famous spiral comes from.',
    concepts: ['construction'], tags: ['golden ratio', 'rectangle'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('A', 'B'), G.seg('B', 'C'), G.seg('C', 'D'), G.seg('D', 'A')],
    targets: [T.any(rect(A, D, [1, 0]), rect(B, Cc, [-1, 0]), rect(B, A, [0, -1]), rect(Cc, D, [0, 1]))],
    sol: [['perpbis', 'm', 'A', 'B'], ['x', 'M', 'm', 'AB'], ['line', 'l1', 'A', 'B'], ['circle', 'k', 'M', 'C'], ['x', 'E', 'k', 'l1', 'right'], ['perp', 'p', 'l1', 'E'], ['line', 'l2', 'D', 'C']]
  });
}

{ // Ptolemy: the pentagon's side
  const O = [0, 0.3], A = add(O, [0, -3]), V = ring(O, 3, -90, 5);
  put({
    id: 'cs-golden-chord', title: 'The Golden Chord', diff: 3, year: 150, source: 'Ptolemy, *Almagest*, Book I (about AD 150).',
    text: 'Mark the two corners next to **A** of the regular pentagon inscribed in the circle.',
    goal: 'The two corners of the regular pentagon next to A.',
    hints: ['The side of the pentagon is the chord you need; Ptolemy found it with one circle.', 'Take M, the midpoint of a radius square to OA. The circle about M through A cuts that diameter at W, and AW is the side.'],
    explain: 'Ptolemy needed chords to build his table of sines, and this is his construction: OW is the side of the regular decagon and AW that of the pentagon, because the square on the pentagon\'s side equals the squares on the hexagon\'s and the decagon\'s sides together (Euclid XIII.10) — and the hexagon\'s side is the radius.',
    concepts: ['construction'], tags: ['pentagon', 'golden ratio', 'circle'],
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: [T.P(V[1]), T.P(V[4])],
    sol: [['line', 'l', 'A', 'O'], ['x', 'A2', 'l', 'cOA', '!A'], ['perpbis', 'p', 'A', 'A2'], ['x', 'B1', 'p', 'cOA', 'right'], ['perpbis', 'q', 'O', 'B1'], ['x', 'M', 'q', 'p'], ['circle', 'k1', 'M', 'A'], ['x', 'W', 'k1', 'p', 'left'], ['circle', null, 'A', 'W']]
  });
}

{ // IV.10 golden triangle
  const A = [-2.4, 2.0], B = [2.0, 1.6], v = sub(B, A);
  const Du = add(A, rot(v, -36)), Dd = add(A, rot(v, 36));
  put({
    id: 'cs-golden-triangle', title: 'Euclid\'s Golden Triangle', diff: 4, year: -300, source: EUCLID + ', Book IV, Proposition 10.',
    text: 'On the ray from **A** through **B**, build the isosceles triangle **ABD** with AB = AD whose angles at B and at D are each double the angle at A.',
    goal: 'The golden triangle ABD (36°, 72°, 72°) with AB = AD.',
    hints: ['The angle at A must be 36°, so BD is the side of the regular decagon in the circle about A through B.', 'Ptolemy\'s circle again: with M the midpoint of AB and U the end of the radius square to AB at A, the circle about M through U reaches a point W on the ray with BW the decagon\'s side.'],
    explain: 'Euclid needs this triangle for his pentagon: halve a base angle and you cut off a smaller copy of the same triangle — the golden ratio in its self-similar form. Ten of them around a point make the regular decagon.',
    concepts: ['construction'], tags: ['golden ratio', 'triangle'],
    links: ['cs-golden-chord'],
    given: [G.pt('A', A), G.pt('B', B), G.ray('A', 'B')],
    targets: [T.any([T.S(A, Du), T.S(B, Du)], [T.S(A, Dd), T.S(B, Dd)])],
    sol: [['circle', 'k', 'A', 'B'], ['perp', 'n', 'rayAB', 'A'], ['x', 'U', 'n', 'k', 'up'], ['perpbis', 'm', 'A', 'B'], ['x', 'M', 'm', 'rayAB'], ['circle', 'k2', 'M', 'U'], ['x', 'W', 'k2', 'rayAB'], ['circle', 'k3', 'B', 'W'], ['x', 'D', 'k3', 'k', 'up'], ['line', null, 'A', 'D'], ['line', null, 'B', 'D']]
  });
}

{ // IV.11 pentagon in a circle
  const O = [0, 0.3], A = add(O, [0, -3]), V = ring(O, 3, -90, 5);
  put({
    id: 'cs-pentagon', title: 'The Regular Pentagon', diff: 4, year: -300, source: EUCLID + ', Book IV, Proposition 11; the side by Ptolemy\'s method.',
    text: 'Inscribe a regular pentagon in the circle, with one corner at **A**.',
    goal: 'The five sides of the regular pentagon with a corner at A.',
    hints: ['First find the side, as in the golden chord.', 'Step the side round from the two new corners to find the last two.'],
    explain: 'Euclid inscribes the pentagon with the help of his golden triangle; the diagonal of a regular pentagon is φ times its side, which is why the golden ratio keeps turning up. Gauss built the 17-gon in 1796 and showed (1801) that a regular polygon can be constructed when its number of sides is a power of two times distinct Fermat primes (3, 5, 17, 257, 65537); Wantzel (1837) proved that no others can — no heptagon, no nonagon.',
    concepts: ['construction', 'symmetry'], tags: ['pentagon', 'polygon', 'golden ratio'],
    links: ['cs-golden-chord'],
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: sides(V, true),
    sol: [['line', 'l', 'A', 'O'], ['x', 'A2', 'l', 'cOA', '!A'], ['perpbis', 'p', 'A', 'A2'], ['x', 'B1', 'p', 'cOA', 'right'], ['perpbis', 'q', 'O', 'B1'], ['x', 'M', 'q', 'p'], ['circle', 'k1', 'M', 'A'], ['x', 'W', 'k1', 'p', 'left'], ['circle', 'k2', 'A', 'W'],
      ['x', 'P1', 'k2', 'cOA', near(V[1])], ['x', 'P4', 'k2', 'cOA', near(V[4])], ['circle', 'k3', 'P1', 'A'], ['x', 'P2', 'k3', 'cOA', '!A'], ['circle', 'k4', 'P4', 'A'], ['x', 'P3', 'k4', 'cOA', '!A'],
      ['line', null, 'A', 'P1'], ['line', null, 'P1', 'P2'], ['line', null, 'P2', 'P3'], ['line', null, 'P3', 'P4'], ['line', null, 'P4', 'A']]
  });
}

{ // pentagon on a side
  const A = [-1.5, 2.4], B = [1.6, 2.2], s = dist(A, B), dgl = s * PHI;
  const pent = (sg) => { const e0 = sub(B, A); const Cp = add(B, rot(e0, sg * 72)); const Dp = add(Cp, rot(e0, sg * 144)); const Ep = add(Dp, rot(e0, sg * 216)); return [Cp, Dp, Ep]; };
  const Pu = pent(-1), Pd = pent(1);
  const four = (P) => [T.S(B, P[0]), T.S(P[0], P[1]), T.S(P[1], P[2]), T.S(P[2], A)];
  const u = unit(sub(B, A)), M = mid(A, B);
  const W1 = add(M, mul(u, s * Math.sqrt(5) / 2)), W2 = sub(M, mul(u, s * Math.sqrt(5) / 2));
  if (Math.abs(dist(A, W1) - dgl) > 1e-9) throw new Error('pentagon diagonal');
  put({
    id: 'cs-pentagon-side', title: 'A Pentagon on a Side', diff: 5,
    text: 'Build a regular pentagon on the side **AB**.',
    goal: 'The other four sides of a regular pentagon on AB.',
    hints: ['Every diagonal of the pentagon is φ times the side. Get a length φ·AB first.', 'With M the midpoint of AB and BT = AB standing square at B, the circle about M through T reaches φ·AB from A along the line AB. Then each corner is where circles about A and B, with radii AB and φ·AB, cross.'],
    explain: 'In a regular pentagon each corner is a side or a diagonal away from A and from B, so once both lengths are to hand, C, D and E are crossings of circles about A and B (D is also on the perpendicular bisector of AB). The diagonal φ·AB = AB(1 + √5)/2 comes from MT = AB·√5/2.',
    concepts: ['construction', 'symmetry'], tags: ['pentagon', 'polygon', 'golden ratio'],
    links: ['cs-golden-section', 'cs-pentagon'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.any(four(Pu), four(Pd))],
    sol: [['perp', 'n', 'AB', 'B'], ['circle', 'k1', 'B', 'A'], ['x', 'T', 'n', 'k1', 'up'], ['perpbis', 'm', 'A', 'B'], ['x', 'M', 'm', 'AB'], ['circle', 'k2', 'M', 'T'], ['line', 'l', 'A', 'B'], ['x', 'W1', 'k2', 'l', near(W1)], ['x', 'W2', 'k2', 'l', near(W2)],
      ['circle', 'k3', 'A', 'W1'], ['x', 'D', 'k3', 'm', 'up'], ['x', 'C', 'k3', 'k1', 'up'], ['circle', 'k4', 'A', 'B'], ['circle', 'k5', 'B', 'W2'], ['x', 'E', 'k4', 'k5', 'up'],
      ['line', null, 'B', 'C'], ['line', null, 'C', 'D'], ['line', null, 'D', 'E'], ['line', null, 'E', 'A']]
  });
}

/* =====================================================================
 *  Chapter 5 · Lengths and numbers
 * ===================================================================== */

{ // root 2
  const A = [-2.2, 1.5], B = [0.6, 1.5];
  put({
    id: 'cs-root2', title: 'The Root of Two', diff: 1,
    text: 'With **AB** as the unit of length, make two points exactly √2 units apart (a circle of radius √2 also counts).',
    goal: 'Two points √2 × AB apart.',
    hints: ['√2 is the diagonal of the unit square.', 'A perpendicular at A, with AB\'s length marked along it.'],
    explain: 'Pythagoras: 1² + 1² = 2. That √2 is no fraction was the Pythagoreans\' famous shock — the side and the diagonal of a square have no common measure, however fine a ruler you make.',
    concepts: ['construction'], tags: ['lengths', 'root'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.D(dist(A, B) * Math.SQRT2)],
    sol: [['perp', 'n', 'AB', 'A'], ['circle', 'k', 'A', 'B'], ['x', 'C', 'n', 'k', 'up']]
  });
}

{ // VI.13 mean proportional
  const A = [-3.0, 1.2], B = [0.6, 1.2], Cc = [2.4, 1.2], h = Math.sqrt(dist(A, B) * dist(B, Cc));
  put({
    id: 'cs-mean', title: 'The Mean Proportional', diff: 2, year: -300, source: EUCLID + ', Book VI, Proposition 13.',
    text: 'Mark a point **H** straight above (or below) **B** with BH² = AB × BC.',
    goal: 'H on the perpendicular at B with BH² = AB · BC.',
    hints: ['Draw the semicircle on AC as diameter.', 'The perpendicular at B meets it at H: the triangle AHC has a right angle at H.'],
    explain: 'The height BH splits the right triangle AHC into two triangles similar to it, so AB : BH = BH : BC. This is how square roots are drawn: make BC the unit, and BH = √AB.',
    concepts: ['construction'], tags: ['lengths', 'root', 'similarity'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.seg('A', 'B'), G.seg('B', 'C')],
    targets: [T.any([T.P([B[0], B[1] - h])], [T.P([B[0], B[1] + h])])],
    sol: [['perpbis', 'm', 'A', 'C'], ['x', 'M', 'm', 'AB'], ['circle', 'k', 'M', 'A'], ['perp', null, 'BC', 'B']]
  });
}

{ // Descartes: multiplication
  const O = [-3.2, 1.8], U = [-1.7, 1.8], A = [0.4, 1.8], B = [-1.706, 0.547];
  const P = add(O, mul(unit(sub(B, O)), dist(O, A) * dist(O, B) / dist(O, U)));
  put({
    id: 'cs-multiply', title: 'Multiply with a Ruler', diff: 2, year: 1637, source: 'René Descartes, *La Géométrie* (1637).',
    text: 'Take **OU** as the unit of length. On the ray from **O** through **B**, mark the point **P** with OP = OA × OB.',
    goal: 'OP = OA × OB, measured in units of OU.',
    hints: ['Similar triangles: OU is to OB as OA is to OP.', 'Join U to B, and draw the parallel to UB through A.'],
    explain: 'Descartes opens *La Géométrie* with exactly this: lengths can be multiplied, divided and square-rooted with ruler and compass, so geometry can do algebra — and algebra, geometry. The parallel makes the triangles OUB and OAP similar, so OP/OB = OA/OU = OA.',
    concepts: ['construction'], tags: ['lengths', 'algebra', 'similarity'],
    given: [G.pt('O', O), G.pt('U', U, 's'), G.pt('A', A, 's'), G.pt('B', B), G.ray('O', 'A'), G.ray('O', 'B')],
    targets: [T.P(P)],
    sol: [['line', 'l', 'U', 'B'], ['parallel', null, 'l', 'A']]
  });
}

{ // reciprocal
  const O = [-3.2, 1.8], U = [-1.7, 1.8], A = [-0.497, -0.093];
  const R = add(O, mul(unit(sub(U, O)), dist(O, U) * dist(O, U) / dist(O, A)));
  put({
    id: 'cs-reciprocal', title: 'One Over', diff: 2, year: 1637, source: 'After René Descartes, *La Géométrie* (1637).',
    text: '**OU** is the unit of length. On the ray **OU**, mark the point **R** with OR = 1 ÷ OA.',
    goal: 'OR = 1/OA, measured in units of OU.',
    hints: ['Put a unit on the other ray as well.', 'Similar triangles once more: join A to U, and draw a parallel through the unit mark on OA\'s ray.'],
    explain: 'Dividing is multiplying turned round. With the unit carried to OA\'s ray at U′, the parallel to AU through U′ makes OR : OU = OU′ : OA, so OR = 1/OA. With circles alone it is 4 E: swing OA onto the ray OU at S; R is the inverse of S in the unit circle about O (see the *Only a compass* drawer), found by the circle about S through O and one more circle.',
    concepts: ['construction'], tags: ['lengths', 'algebra', 'similarity'],
    links: ['cs-multiply'],
    given: [G.pt('O', O), G.pt('U', U, 's'), G.pt('A', A), G.ray('O', 'U'), G.ray('O', 'A')],
    targets: [T.P(R)],
    sol: [['circle', 'k', 'O', 'U'], ['x', 'U2', 'k', 'rayOA'], ['line', 'l', 'A', 'U'], ['parallel', null, 'l', 'U2']],
    solE: [['circle', 'k1', 'O', 'U'], ['circle', 'k2', 'O', 'A'], ['x', 'S', 'rayOU', 'k2'], ['circle', 'k3', 'S', 'O'], ['x', 'X', 'k1', 'k3', 'up'], ['circle', null, 'X', 'O']]
  });
}

{ // VI.9 three equal parts
  const A = [-2.4, 1.2], B = [2.4, 0.8];
  put({
    id: 'cs-thirds', title: 'Three Equal Parts', diff: 3, year: -300, source: 'The task of ' + EUCLID + ', Book VI, Proposition 9.',
    text: 'Divide the segment **AB** into three equal parts: mark both points of division.',
    goal: 'The two points that divide AB into thirds.',
    hints: ['Euclid uses a helper line through A and parallels — but the tips of equilateral triangles can do it too.', 'Let X and Y be the tips of the equilateral triangles on AB, and Z the point with Y halfway between A and Z. The line XZ crosses AB two-thirds of the way along.'],
    explain: 'X is one triangle-height to one side of AB and Z two heights to the other, so the line XZ crosses AB a third of the way from X\'s foot (the middle of AB) to Z\'s foot (B): at ½ + ⅙ = ⅔. A circle about that point through B marks ⅓. Euclid VI.9 cuts off any fraction with parallels; these lattice tricks are cheaper.',
    concepts: ['construction'], tags: ['lengths', 'division'],
    given: [G.pt('A', A), G.pt('B', B), G.seg('A', 'B')],
    targets: [T.P(add(A, mul(sub(B, A), 1 / 3))), T.P(add(A, mul(sub(B, A), 2 / 3)))],
    sol: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'B', 'A'], ['x', 'X', 'k1', 'k2', 'up'], ['x', 'Y', 'k1', 'k2', 'down'], ['line', 'l1', 'A', 'Y'], ['circle', 'k3', 'Y', 'A'], ['x', 'Z', 'k3', 'l1', '!A'], ['line', 'l2', 'X', 'Z'], ['x', 'Q', 'l2', 'AB'], ['circle', null, 'Q', 'B']]
  });
}

{ // II.14 square the rectangle
  const A = [-2.6, 1.4], B = [1.2, 1.4], Cc = [1.2, -0.4], D = [-2.6, -0.4];
  put({
    id: 'cs-square-rect', title: 'Square the Rectangle', diff: 3, year: -300, source: EUCLID + ', Book II, Proposition 14.',
    text: 'Find the side of a square with the same area as the rectangle **ABCD**: make two points whose distance, squared, equals the rectangle\'s area.',
    goal: 'A length whose square equals the area of ABCD.',
    hints: ['The side you want is the mean proportional of AB and BC. Euclid lays BC along AB and draws a semicircle — 5 moves. Three will do.', 'Mark S on AB with AS = BC (a circle about A through D). Where the circle about S through C meets the circle about A through B, you are exactly the right distance from B.'],
    explain: 'Euclid II.14 lays BC along AB, draws the semicircle on the whole length and stands a perpendicular at B. The 3-move shortcut: with AB = a and BC = b, the crossing X of the circle about A through B with the circle about S through C sits above the point F of AB with AF = a − b/2, so XB² = XF² + FB² = a² − (a − b/2)² + (b/2)² = ab. Euclid squares any straight-sided figure this way. The circle resisted every attempt for two thousand years; in 1882 Ferdinand von Lindemann proved π transcendental — squaring the circle with compass and straightedge is impossible.',
    concepts: ['construction'], tags: ['area', 'root', 'classic'],
    links: ['cs-mean'],
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc), G.pt('D', D), G.seg('A', 'B'), G.seg('B', 'C'), G.seg('C', 'D'), G.seg('D', 'A')],
    targets: [T.D(Math.sqrt(dist(A, B) * dist(B, Cc)))],
    sol: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'A', 'D'], ['x', 'S', 'k2', 'AB'], ['circle', 'k3', 'S', 'C'], ['x', 'X', 'k3', 'k1', 'up']]
  });
}

/* =====================================================================
 *  Only a compass (Mohr 1672, Mascheroni 1797)
 * ===================================================================== */

const CO = ['point', 'circle'];

{ // apex
  const A = [-1.6, 1.0], B = [1.8, 0.6], cs = circleCircle(A, dist(A, B), B, dist(A, B));
  putC({
    id: 'co-apex', title: 'The Third Corner', diff: 1,
    text: 'The ruler is gone for good. Mark a point **C** that makes an equilateral triangle with **A** and **B** — no sides needed, just the corner.',
    goal: 'The third corner of an equilateral triangle on A and B.',
    hints: ['Euclid\'s first move never used the ruler for the corner itself.', 'Circle about A through B, circle about B through A.'],
    explain: 'Only the sides of Euclid\'s triangle needed the ruler; the corner came from two circles. In this drawer a line is known by two of its points and is never drawn — and, as Mohr and Mascheroni proved, nothing is lost.',
    concepts: ['construction'], tags: ['compass only'],
    tools: CO,
    given: [G.pt('A', A), G.pt('B', B)],
    targets: [T.any([T.P(cs[0])], [T.P(cs[1])])],
    sol: [['circle', 'k1', 'A', 'B'], ['circle', 'k2', 'B', 'A']]
  });
}

{ // reflect a point in the line AB, compass only
  const A = [-2.6, 1.2], B = [2.4, 0.4], P = [0.3, -1.6];
  putC({
    id: 'co-reflect', title: 'Mirror Without a Ruler', diff: 1,
    text: 'The mirror is the (undrawn) line through **A** and **B**. Mark the reflection of **P** in it.',
    goal: 'The reflection of P in the line AB.',
    hints: ['Every point of the mirror is as far from P as from its reflection.', 'Two such points are enough: A and B.'],
    explain: 'The circles about A and about B through P meet at P and at its mirror image. Reflection is the workhorse of compass-only geometry: it lets you move points across lines you are not allowed to draw.',
    concepts: ['symmetry', 'construction'], tags: ['compass only', 'reflection'],
    tools: CO,
    given: [G.pt('A', A), G.pt('B', B), G.pt('P', P)],
    targets: [T.P(reflectPt(P, A, B))],
    sol: [['circle', 'k1', 'A', 'P'], ['circle', 'k2', 'B', 'P']]
  });
}

{ // hexagon corners, compass only
  const O = [0, 0.2], A = add(O, [2.4, -1.8]), V = ring(O, 3, angOf(O, A), 6);
  putC({
    id: 'co-hexagon', title: 'Six Points on a Ring', diff: 1,
    text: 'Mark the other five corners of the regular hexagon inscribed in the circle with a corner at **A**.',
    goal: 'The five other corners of the regular hexagon.',
    hints: ['The radius steps six times round the circle.', 'Three circles are enough if you step from both neighbours of A at once — a circle can reach two corners away, not just one.'],
    explain: 'The side of the hexagon is the radius, so circles of radius OA step round the rim. The shortcut: the corner opposite A is √3 radii from each neighbour of A, so the circle about one neighbour through the other lands on it.',
    concepts: ['construction', 'symmetry'], tags: ['compass only', 'hexagon'],
    tools: CO,
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: V.slice(1).map((p) => T.P(p)),
    sol: [['circle', 'k1', 'A', 'O'], ['x', 'B', 'k1', 'cOA', near(V[1])], ['x', 'F', 'k1', 'cOA', near(V[5])], ['circle', 'k2', 'B', 'F'], ['x', 'D', 'k2', 'cOA', '!F'], ['circle', null, 'D', 'O']]
  });
}

{ // double a segment
  const A = [-2.2, 1.0], B = [0.2, 0.4];
  putC({
    id: 'co-double', title: 'Straight On', diff: 1,
    text: 'Mark the point **C** on the line AB, beyond **B**, with BC = AB — continuing the line without drawing it.',
    goal: 'C with B the midpoint of AC.',
    hints: ['C is on the circle about B through A, straight across from A.', 'The two equilateral triangles on AB have tips X and Y; the circle about X through Y is just the right size.'],
    explain: 'With AB = 1, the tips X and Y are √3 apart, and C is √3 from X too (look at the triangle XBC: sides 1, 1 and 120° between them). So the circle about X through Y passes through C. Mascheroni doubles a segment by stepping the radius three times around the circle about B; this is one circle quicker.',
    concepts: ['construction', 'symmetry'], tags: ['compass only'],
    tools: CO,
    given: [G.pt('A', A), G.pt('B', B)],
    targets: [T.P(sub(mul(B, 2), A))],
    sol: [['circle', 'k1', 'B', 'A'], ['circle', 'k2', 'A', 'B'], ['x', 'X', 'k1', 'k2', 'up'], ['x', 'Y', 'k1', 'k2', 'down'], ['circle', null, 'X', 'Y']]
  });
}

{ // inverse point
  const O = [-1.2, 0.6], A = add(O, [1.2, -1.6]), r = 2, P = [2.4, -0.4];
  const Pi = add(O, mul(sub(P, O), r * r / Math.pow(dist(O, P), 2)));
  putC({
    id: 'co-inverse', title: 'The Inverse Point', diff: 2,
    text: 'Mark the *inverse* of **P** in the circle: the point **P′** on the ray OP with OP · OP′ equal to the square of the radius.',
    goal: 'The inverse of P in the circle.',
    hints: ['The circle about P through O cuts the given circle in two points.', 'Circles about those two points, through O, meet again at the inverse.'],
    explain: 'Call the crossings X and Y. The triangles OXP and OP′X are both isosceles with the same angle at O, so they are similar and OP′/OX = OX/OP — exactly OP · OP′ = r². Inversion turns circles through O into lines and back, which is the key to Mohr and Mascheroni\'s theorem.',
    concepts: ['construction', 'symmetry'], tags: ['compass only', 'inversion'],
    tools: CO,
    given: [G.pt('O', O), G.pt('A', A), G.pt('P', P), G.circ('O', 'A')],
    targets: [T.P(Pi)],
    sol: [['circle', 'k1', 'P', 'O'], ['x', 'X', 'k1', 'cOA', 'up'], ['x', 'Y', 'k1', 'cOA', 'down'], ['circle', 'k2', 'X', 'O'], ['circle', 'k3', 'Y', 'O']]
  });
}

{ // triple
  const A = [-2.8, 1.2], B = [-1.2, 0.8];
  putC({
    id: 'co-triple', title: 'Three Times as Far', diff: 2,
    text: 'Mark the point **D** on the line AB, beyond **B**, with AD = 3 × AB.',
    goal: 'D on the line AB with AD = 3·AB.',
    hints: ['First get C with AC = 2·AB, as in [[co-double|Straight On]].', 'Then do it again, from B across C.'],
    explain: 'Doubling twice from different starting points: B across to C, then C across to D. Each doubling costs the same three circles — but the second can reuse the circle about B you already have, which has the right radius.',
    concepts: ['construction'], tags: ['compass only'],
    links: ['co-double'],
    tools: CO,
    given: [G.pt('A', A), G.pt('B', B)],
    targets: [T.P(add(A, mul(sub(B, A), 3)))],
    sol: [['circle', 'k1', 'B', 'A'], ['circle', 'k2', 'A', 'B'], ['x', 'X', 'k1', 'k2', 'up'], ['x', 'Y', 'k1', 'k2', 'down'], ['circle', 'k3', 'X', 'Y'], ['x', 'C', 'k3', 'k1', '!Y'], ['circle', 'k4', 'C', 'B'], ['x', 'X2', 'k4', 'k1', 'up'], ['x', 'Y2', 'k4', 'k1', 'down'], ['circle', null, 'X2', 'Y2']]
  });
}

{ // where a line meets a circle
  const O = [-0.4, 0.6], P = add(O, [1.8, -1.2]), r = dist(O, P), A = [-3.2, -1.4], B = [3.0, 0.2];
  const u = unit(sub(B, A)), f = foot(O, A, B), hh = Math.sqrt(r * r - Math.pow(dist(O, f), 2));
  putC({
    id: 'co-line-circle', title: 'Where a Line Meets a Circle', diff: 3,
    text: 'The line through **A** and **B** is not drawn — this is the compass drawer. Mark the two points where it would cross the circle.',
    goal: 'Both crossings of the line AB with the circle.',
    hints: ['Reflect the whole circle in the line AB. The two circles cross exactly on the mirror.', 'Reflect O (two circles about A and B). For a point of the reflected circle, reflect any point S where the circle about B through O meets the given circle — that circle already contains the image of S.'],
    explain: 'A point on the mirror is its own reflection, so where the line meets the circle, it also meets the reflected circle — and two different circles meet in at most two points. Reflecting O and P costs four circles; four in all will do, because the circle about B through O passes through both S and its image S′, so one circle about A through S finds S′. This is one of the two lemmas behind the Mohr–Mascheroni theorem; the other finds where two undrawn lines cross.',
    concepts: ['construction', 'symmetry'], tags: ['compass only', 'reflection'],
    tools: CO,
    given: [G.pt('O', O), G.pt('P', P), G.pt('A', A), G.pt('B', B), G.circ('O', 'P')],
    targets: [T.P(add(f, mul(u, hh))), T.P(sub(f, mul(u, hh)))],
    sol: [['circle', 'k1', 'A', 'O'], ['circle', 'k2', 'B', 'O'], ['x', 'O2', 'k1', 'k2', '!O'], ['x', 'S', 'cOP', 'k2', 'up'], ['circle', 'k3', 'A', 'S'], ['x', 'S2', 'k2', 'k3', '!S'], ['circle', null, 'O2', 'S2']]
  });
}

{ // parallelogram corner
  const A = [-2.4, 1.4], B = [0.8, 1.9], Cc = [2.2, -0.8], D = sub(add(A, Cc), B);
  putC({
    id: 'co-parallelogram', title: 'The Fourth Corner', diff: 3,
    text: 'Mark the point **D** that completes the parallelogram **ABCD**.',
    goal: 'The fourth corner D of the parallelogram ABCD.',
    hints: ['D is BC away from A and AB away from C — but the compass cannot carry lengths.', 'Reflect B in the perpendicular bisector of AC: the image B′ is also BC from A and AB from C. The two circles about A and C through B′ meet again at D.'],
    explain: 'The circle about A with radius BC and the circle about C with radius AB meet in two points: one is B reflected in the perpendicular bisector of AC, the other is D. Finding the reflection first lets the collapsing compass draw both circles.',
    concepts: ['construction', 'symmetry'], tags: ['compass only', 'parallelogram'],
    tools: CO,
    given: [G.pt('A', A), G.pt('B', B), G.pt('C', Cc)],
    targets: [T.P(D)],
    sol: [['circle', 'k1', 'A', 'C'], ['circle', 'k2', 'C', 'A'], ['x', 'U', 'k1', 'k2', 'up'], ['x', 'V', 'k1', 'k2', 'down'], ['circle', 'k3', 'U', 'B'], ['circle', 'k4', 'V', 'B'], ['x', 'B2', 'k3', 'k4', '!B'], ['circle', 'k5', 'A', 'B2'], ['circle', 'k6', 'C', 'B2']]
  });
}

{ // Mascheroni's midpoint
  const A = [-1.8, 1.0], B = [0.6, 0.6];
  putC({
    id: 'co-midpoint', title: 'Mascheroni\'s Midpoint', diff: 3, year: 1797, source: 'Lorenzo Mascheroni, *Geometria del compasso* (1797).',
    text: 'Mark the midpoint of **A** and **B** with the compass alone.',
    goal: 'The midpoint of AB.',
    hints: ['First double AB to C (see [[co-double|Straight On]]). The midpoint M is the inverse of C in the circle about A through B.', 'Invert as in [[co-inverse|The Inverse Point]]: the circle about C through A cuts the circle about A in two points; circles about them through A meet again at M.'],
    explain: 'If AC = 2·AB, the inverse of C in the circle of radius AB about A lies on the same ray at AB²/AC = AB/2: the midpoint. Without a ruler, halving a segment is surprisingly hard — the classic solution takes six circles.',
    concepts: ['construction', 'symmetry'], tags: ['compass only', 'midpoint', 'inversion'],
    links: ['co-double', 'co-inverse'],
    tools: CO,
    given: [G.pt('A', A), G.pt('B', B)],
    targets: [T.P(mid(A, B))],
    sol: [['circle', 'k1', 'B', 'A'], ['circle', 'k2', 'A', 'B'], ['x', 'X', 'k1', 'k2', 'up'], ['x', 'Y', 'k1', 'k2', 'down'], ['circle', 'k3', 'X', 'Y'], ['x', 'C', 'k3', 'k1', '!Y'], ['circle', 'k4', 'C', 'A'], ['x', 'P', 'k4', 'k2', 'up'], ['x', 'Q', 'k4', 'k2', 'down'], ['circle', 'k5', 'P', 'A'], ['circle', 'k6', 'Q', 'A']]
  });
}

{ // Napoleon's problem: the centre
  const c = [0.2, 0.3], R = 2.8, A = add(c, [0, -R]), B = [1.4, -0.8];
  putC({
    id: 'co-centre', title: 'Napoleon\'s Problem', diff: 4, year: 1797, source: 'Traditionally said to have been set by Napoleon Bonaparte; solved in Mascheroni\'s *Geometria del compasso* (1797).',
    text: 'The centre of this circle is lost and there is no ruler. With the compass alone, find the centre. **A** is on the circle; **B** is a handy extra point.',
    goal: 'The centre of the circle.',
    hints: ['The circle about A through B cuts the circle at two points; circles about them through A meet again at a point E.', 'Do the same trick once more with the circle about E through A crossing the circle about A: the new meeting point is the centre.'],
    explain: 'The trick twice over is inversion in the circle about A: E is the inverse of the centre\'s mirror image, and the second step inverts back to the centre itself. Legend says Napoleon, an able amateur geometer, set the problem to the mathematicians of Paris; Mascheroni dedicated his book to him.',
    concepts: ['construction', 'symmetry'], tags: ['compass only', 'centre', 'inversion', 'classic'],
    links: ['co-inverse', 'cs-centre'],
    tools: CO,
    given: [G.circle('k', c, R), G.pt('A', A), G.pt('B', B)],
    targets: [T.P(c)],
    sol: [['circle', 'k1', 'A', 'B'], ['x', 'X', 'k1', 'k', 'left'], ['x', 'Y', 'k1', 'k', 'right'], ['circle', 'k2', 'X', 'A'], ['circle', 'k3', 'Y', 'A'], ['x', 'E', 'k2', 'k3', '!A'], ['circle', 'k4', 'E', 'A'], ['x', 'F', 'k4', 'k1', 'left'], ['x', 'G', 'k4', 'k1', 'right'], ['circle', 'k5', 'F', 'A'], ['circle', 'k6', 'G', 'A']]
  });
}

{ // Napoleon's square
  const O = [0, 0.3], A = add(O, [3, 0]), V = ring(O, 3, 0, 4);
  const B = polar(O, 3, -60), Bp = polar(O, 3, 60), Cc = polar(O, 3, -120), D = polar(O, 3, 180);
  const X = circleCircle(A, dist(A, Cc), D, dist(D, B)).sort((p, q) => p[1] - q[1])[0];
  putC({
    id: 'co-square', title: 'Napoleon\'s Square', diff: 4, year: 1797, source: 'A classic of Mascheroni\'s *Geometria del compasso* (1797), often called Napoleon\'s other problem.',
    text: 'Divide the circle into four equal arcs with the compass alone: mark the other three corners of the square inscribed in it with a corner at **A**.',
    goal: 'The other three corners of the inscribed square.',
    hints: ['Step the radius round to the point D opposite A. The circles about A and about D with radius √3 (the hexagon\'s long chord) meet at X, with OX = √2 — the square\'s side.', 'A collapsing compass cannot carry OX to A, but a reflection can: reflect X in the perpendicular bisector of OA (the line through the two neighbours of A on the hexagon).'],
    explain: 'OX = √2 when the radius is 1, and a circle of radius √2 about A cuts the circle exactly at the two corners at 90°. With Mascheroni\'s rigid compass that is one more circle; with Euclid\'s collapsing one, a reflection carries the length first.',
    concepts: ['construction', 'symmetry'], tags: ['compass only', 'square', 'classic'],
    tools: CO,
    given: [G.pt('O', O), G.pt('A', A), G.circ('O', 'A')],
    targets: V.slice(1).map((p) => T.P(p)),
    sol: [['circle', 'k1', 'A', 'O'], ['x', 'B', 'k1', 'cOA', near(B)], ['x', 'B2', 'k1', 'cOA', near(Bp)], ['circle', 'k2', 'B', 'O'], ['x', 'C', 'k2', 'cOA', near(Cc)], ['circle', 'k3', 'C', 'O'], ['x', 'D', 'k3', 'cOA', near(D)], ['circle', 'k4', 'A', 'C'], ['circle', 'k5', 'D', 'B'], ['x', 'X', 'k4', 'k5', near(X)], ['circle', 'k6', 'B', 'X'], ['circle', 'k7', 'B2', 'X'], ['x', 'X2', 'k6', 'k7', '!X'], ['circle', null, 'A', 'X2']]
  });
}


/* =====================================================================
 *  Output
 * ===================================================================== */

const FAMILIES = [
  {
    meta: {
      id: 'constructions', engine: 'construct', cat: 'compass', name: 'Compass and straightedge', order: 1,
      blurb: 'Euclid\'s game: lines through two points, circles about a point through a point, and nothing else. Build triangles, tangents, polygons and square roots in as few moves as you can.',
      origin: { year: -300, who: 'Euclid of Alexandria', note: 'The *Elements* (about 300 BC) builds all of its plane geometry with two instruments: a straightedge with no marks and a compass that collapses when lifted. Its opening propositions are the first puzzles here, in Euclid\'s own order; each tool you earn is a proposition proved.' },
      concepts: ['construction', 'symmetry']
    },
    list: main
  },
  {
    meta: {
      id: 'compass-only', engine: 'construct', cat: 'compass', name: 'Only a compass', order: 2,
      blurb: 'Put the ruler away. Every point a compass and straightedge can reach, a compass alone can reach too — if you know how.',
      origin: { year: 1797, who: 'Lorenzo Mascheroni; Georg Mohr (1672)', note: 'Mascheroni\'s *Geometria del compasso* (1797) showed that every compass-and-straightedge construction of points can be done with the compass alone. The same result had appeared in Georg Mohr\'s *Euclides Danicus* (1672), which was forgotten until a copy turned up in 1928.' },
      concepts: ['construction', 'symmetry']
    },
    list: only
  }
];

if (require.main === module) {
  const argv = process.argv.slice(2), argOf = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
  const doSearch = argv.includes('--search') || argOf('--only') != null;
  const only = argOf('--only') ? argOf('--only').split(',') : null, limit = +(argOf('--limit') || 4e5);
  const out = [];
  out.push('/* The Puzzle Cabinet · data/constructions.js — made by tools/gen/construct.js, do not edit by hand */');
  let total = 0;
  const diffs = [0, 0, 0, 0, 0, 0];
  FAMILIES.forEach((F) => {
    if (!F.list.length) return;
    const done = finish(F.list, F.meta.id);
    const m = F.meta;
    out.push('Cabinet.family({');
    out.push('  id: ' + JSON.stringify(m.id) + ', engine: ' + JSON.stringify(m.engine) + ', cat: ' + JSON.stringify(m.cat) + ', name: ' + JSON.stringify(m.name) + ', order: ' + m.order + ',');
    out.push('  blurb: ' + JSON.stringify(m.blurb) + ',');
    out.push('  origin: ' + JSON.stringify(m.origin) + ',');
    out.push('  concepts: ' + JSON.stringify(m.concepts));
    out.push('}, [');
    done.forEach((p, i) => {
      const keys = Object.keys(p).filter((k) => k !== 'data');
      out.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ',\n    data: ' + JSON.stringify(p.data) + ' }' + (i < done.length - 1 ? ',' : ''));
      total++;
      diffs[p.diff]++;
      if (doSearch && (only ? only.includes(p.id) : p.data.parE <= 7)) {
        const t0 = Date.now();
        const r = searchE(p.data, p.data.parE - 1, { limit });
        const msg = p.id + ': par ' + p.data.parE + ' E; search to ' + (p.data.parE - 1) + ' → ' + (r.found ? 'FOUND ' + r.found + ' E' : r.nodes > limit ? 'nothing shorter so far (stopped at the node limit)' : 'nothing shorter') + ' (' + r.nodes + ' nodes, ' + (Date.now() - t0) + ' ms)';
        console.log((r.found ? '  !! ' : '     ') + msg);
        if (r.steps) console.log('        solE: ' + JSON.stringify(r.steps));
      }
    });
    out.push(']);');
  });
  fs.writeFileSync(path.join(ROOT, 'data/constructions.js'), out.join('\n') + '\n');
  console.log('constructions: ' + total + ' puzzles; by difficulty ' + diffs.slice(1).join(' / '));
}
