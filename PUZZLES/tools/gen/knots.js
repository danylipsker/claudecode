/* The Puzzle Cabinet · tools/gen/knots.js
 *
 *   node tools/gen/knots.js --pics     relax every knot of the table in 3D and print its picture
 *                                      (paste the output into K.PICS in js/lib/knot.js)
 *   node tools/gen/knots.js            writes data/knot-or-not.js, data/knot-id.js, data/unknotting.js
 *
 * Pictures: each knot starts as a 4-plat, is lifted into 3D and relaxed with a
 * repulsive energy (strands push each other apart, every link keeps its
 * length), the way KnotPlot does it. Then the view with the fewest crossings
 * and the cleanest angles is chosen and turned upright.
 *
 * Puzzles: closed curves (smoothed random polygons, Lissajous and torus
 * curves, the table's own pictures bent about), cut open at the top, with
 * crossings chosen at random or on purpose. Everything is seeded.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/knot.js'));
const K = C.Knot, P = K.poly;

const args = process.argv.slice(2);

/* ---------- relaxing a knot in 3D ---------- */

const RELAX = { iters: +(process.env.RELAX_IT || 12000), cap: +(process.env.RELAX_CAP || 0.05) };

// the Jones polynomial of a closed 3D curve seen from +z
function jones3Closed(p) {
  const flat = p.map((q) => [q[0], -q[1]]);
  const inf = closedInfo(flat, p.map((q) => q[2]));
  return K.jones(inf.pts, inf.cr, inf.bits).V;
}

function relax(pts3, iters) {
  const n = pts3.length;
  let p = pts3.map((q) => q.slice());
  let L = 0;
  for (let i = 0; i < n; i++) { const a = p[i], b = p[(i + 1) % n]; L += Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]); }
  const rest = L / n;
  const F = p.map(() => [0, 0, 0]);
  const V0 = jones3Closed(p);
  let good = p.map((q) => q.slice()), cap = RELAX.cap, rollbacks = 0;
  for (let it = 0; it < iters; it++) {
    if (it % 50 === 49) {
      if (P.eq(jones3Closed(p), V0)) { good = p.map((q) => q.slice()); cap = Math.min(RELAX.cap, cap * 1.1); }
      else { p = good.map((q) => q.slice()); cap *= 0.5; rollbacks++; }
    }
    F.forEach((f) => { f[0] = f[1] = f[2] = 0; });
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dd = Math.min(j - i, n - (j - i));
        if (dd < 3) continue;
        const dx = p[j][0] - p[i][0], dy = p[j][1] - p[i][1], dz = p[j][2] - p[i][2];
        const r2 = dx * dx + dy * dy + dz * dz + 1e-9;
        const f = 1 / (r2 * r2);
        F[i][0] -= dx * f; F[i][1] -= dy * f; F[i][2] -= dz * f;
        F[j][0] += dx * f; F[j][1] += dy * f; F[j][2] += dz * f;
      }
    }
    let mx = 0;
    F.forEach((f) => { mx = Math.max(mx, Math.hypot(f[0], f[1], f[2])); });
    const k = Math.min(cap * rest / (mx || 1), 5 * rest * rest * rest * rest);
    for (let i = 0; i < n; i++) for (let d = 0; d < 3; d++) p[i][d] += F[i][d] * k;
    // smooth a little
    const q = p.map((a, i) => {
      const b = p[(i + n - 1) % n], c = p[(i + 1) % n];
      return [a[0] + 0.04 * ((b[0] + c[0]) / 2 - a[0]), a[1] + 0.04 * ((b[1] + c[1]) / 2 - a[1]), a[2] + 0.04 * ((b[2] + c[2]) / 2 - a[2])];
    });
    for (let i = 0; i < n; i++) p[i] = q[i];
    // keep every link its length
    for (let s = 0; s < 6; s++) {
      for (let i = 0; i < n; i++) {
        const a = p[i], b = p[(i + 1) % n];
        const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
        const d = Math.hypot(dx, dy, dz) || 1e-9, f = (d - rest) / d / 2;
        a[0] += dx * f; a[1] += dy * f; a[2] += dz * f;
        b[0] -= dx * f; b[1] -= dy * f; b[2] -= dz * f;
      }
    }
  }
  return P.eq(jones3Closed(p), V0) ? p : good;
}

// look at a 3D closed curve along u: the flat curve, its crossings and bits
function view(p3, u, spin) {
  const nz = Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let e1 = cross(nz, u); e1 = nrm(e1);
  let e2 = cross(u, e1);
  const cs = Math.cos(spin), sn = Math.sin(spin);
  const f1 = [e1[0] * cs + e2[0] * sn, e1[1] * cs + e2[1] * sn, e1[2] * cs + e2[2] * sn];
  const f2 = cross(u, f1);
  const flat = p3.map((q) => [dot(q, f1), -dot(q, f2)]);
  const depth = p3.map((q) => dot(q, u));
  return { flat, depth };
}
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function nrm(a) { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }

// crossings and bits of a flat closed curve with depths
function closedInfo(flat, depth) {
  const pts = flat.concat([flat[0]]);
  const dep = depth.concat([depth[0]]);
  const cr = K.crossings(pts);
  const zAt = (u) => { const i = Math.min(pts.length - 2, Math.floor(u)), t = u - i; return dep[i] + (dep[i + 1] - dep[i]) * t; };
  const bits = cr.map((c) => (zAt(c.a) >= zAt(c.b) ? 1 : 0));
  return { pts, cr, bits };
}

// how clean is a flat diagram? (bigger is better; 0 = unusable)
function quality(pts, cr) {
  if (!cr.length) return 1;
  const s = K.arc(pts), L = s[s.length - 1];
  let md = Infinity, ma = 90;
  for (let i = 0; i < cr.length; i++) {
    ma = Math.min(ma, cr[i].ang);
    for (let j = i + 1; j < cr.length; j++) md = Math.min(md, Math.hypot(cr[i].x - cr[j].x, cr[i].y - cr[j].y));
  }
  // strands that come close without crossing
  let near = Infinity;
  const n = pts.length - 1;
  for (let i = 0; i < n; i += 2) {
    for (let j = i + 6; j < n; j += 2) {
      if (n - (j - i) < 6) continue;
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (d >= near) continue;
      // near a crossing it is fine
      const cx = cr.some((c) => Math.hypot(c.x - pts[i][0], c.y - pts[i][1]) < L * 0.035 && Math.hypot(c.x - pts[j][0], c.y - pts[j][1]) < L * 0.035);
      if (!cx) near = d;
    }
  }
  if (ma < 25) return 0;
  const bb = K.bbox(pts), size = Math.hypot(bb.w, bb.h);
  return Math.min(md / size * 3.2, near / size * 8, 1) * (0.5 + ma / 180) * Math.min(1, Math.min(bb.w, bb.h) / Math.max(bb.w, bb.h) * 1.6);
}

function symmetryScore(flat) {
  // how well the curve matches its reflection in the vertical line through its centre
  let cx = 0;
  flat.forEach((q) => { cx += q[0]; });
  cx /= flat.length;
  let tot = 0;
  const step = Math.max(1, Math.floor(flat.length / 60));
  for (let i = 0; i < flat.length; i += step) {
    const r = [2 * cx - flat[i][0], flat[i][1]];
    let best = Infinity;
    for (const q of flat) best = Math.min(best, Math.hypot(q[0] - r[0], q[1] - r[1]));
    tot += best;
  }
  return tot;
}

function fib(nPts) {
  const out = [], ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < nPts; i++) {
    const y = 1 - (i + 0.5) / nPts * 2, r = Math.sqrt(1 - y * y), th = ga * i;
    if (y < 0) continue; // a view and its opposite give mirror pictures of the same diagram
    out.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  return out;
}

// the (2, n) torus knots as the classic stars
function starView(e) {
  const n = e.c, N = 60 * n, R = 1, a = { 3: 0.5, 5: 0.42, 7: 0.36 }[n] || 0.4;
  const ring = [];
  for (let i = 0; i < N; i++) {
    const th = i / N * 4 * Math.PI, r = R + a * Math.cos(n * th / 2), t2 = th - Math.PI / 2;
    ring.push([r * Math.cos(t2), r * Math.sin(t2)]);
  }
  const ringC = ring.concat([ring[0]]);
  const rcr = K.crossings(ringC);
  const rbits = K.alternating(rcr);
  const z = K.heights(ringC, rcr, rbits, 0.2, 0.3);
  return { flat: ring, depth: Array.from(z).slice(0, N), V0: K.jones(ringC, rcr, rbits).V, star: true };
}

function picture(e) {
  if (e.conway.length === 1) return finish(e, starView(e), 1);
  const pl = K.plat(e.conway);
  const closed = pl.pts.slice(0, -1);
  const N = 30 + 16 * e.c;
  const L = K.length(closed, true);
  const ring = K.resample(closed, L / N, true);
  const ringC = ring.concat([ring[0]]);
  const rcr = K.crossings(ringC);
  const rbits = K.alternating(rcr);
  const V0 = K.jones(ringC, rcr, rbits).V;
  const z = K.heights(ringC, rcr, rbits, 0.45, 0.9);
  let p3 = ring.map((q, i) => [q[0], -q[1], z[i]]); // right-handed: y up, z toward the viewer
  p3 = relax(p3, RELAX.iters);
  // the best view
  let best = null;
  for (const u of fib(900)) {
    const v = view(p3, u, 0);
    const inf = closedInfo(v.flat, v.depth);
    if (inf.cr.length !== e.c) continue;
    // strands must be well apart in depth where they cross
    const dep = v.depth.concat([v.depth[0]]);
    const zAt = (u) => { const i = Math.min(dep.length - 2, Math.floor(u)), t = u - i; return dep[i] + (dep[i + 1] - dep[i]) * t; };
    const gap = Math.min.apply(null, inf.cr.map((c) => Math.abs(zAt(c.a) - zAt(c.b))));
    const size = K.length(v.flat, true);
    const q = quality(inf.pts, inf.cr) * (0.6 + 0.4 * Math.min(1, gap / (size * 0.01)));
    if (!best || q > best.q) best = { q, u };
  }
  if (!best) throw new Error(e.id + ': no view with ' + e.c + ' crossings');
  // turn it upright: the most symmetric spin
  let bs = null;
  for (let k = 0; k < 72; k++) {
    const spin = k * Math.PI / 36;
    const v = view(p3, best.u, spin);
    const sc = symmetryScore(v.flat);
    // prefer wide over tall a little
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    v.flat.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    const score = sc / (x1 - x0) + (y1 - y0 > (x1 - x0) * 1.15 ? 0.05 : 0);
    if (!bs || score < bs.score) bs = { score, spin };
  }
  const v = view(p3, best.u, bs.spin);
  v.V0 = V0;
  return finish(e, v, best.q);
}

function finish(e, v, q) {
  const V0 = v.V0;
  // normalise into a 100-wide box
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  v.flat.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
  const sc = 100 / Math.max(x1 - x0, y1 - y0);
  let flat = v.flat.map((q) => [(q[0] - x0) * sc, (q[1] - y0) * sc]);
  let inf = closedInfo(flat, v.depth);
  let V = K.jones(inf.pts, inf.cr, inf.bits).V;
  if (!P.eq(V, V0)) throw new Error(e.id + ': the relaxed knot changed (' + P.str(V) + ' vs ' + P.str(V0) + ')');
  // make it the table's own hand (the mirror image is the reflection)
  let mirrored = false;
  if (!P.eq(V, e.V)) {
    flat = flat.map((q) => [(x1 - x0) * sc - q[0], q[1]]);
    mirrored = true;
  }
  // control points for the spline
  const M = 10 + 9 * e.c;
  const ctrl = K.resample(flat.concat([flat[0]]).slice(0, -1), K.length(flat, true) / M, true).map((q) => [Math.round(q[0] * 10) / 10, Math.round(q[1] * 10) / 10]);
  const flatCtrl = [].concat.apply([], ctrl);
  // check the spline gives the same diagram
  const sp = K.spline(flatCtrl, 8);
  const spC = sp.concat([sp[0]]);
  const scr = K.crossings(spC);
  if (scr.length !== e.c) throw new Error(e.id + ': the spline has ' + scr.length + ' crossings');
  // bits: carry the depths along the curve (the spline runs through the same places in the same order)
  const ringS = K.arc(flat.concat([flat[0]])), Ltot = ringS[ringS.length - 1];
  const depC = v.depth.concat([v.depth[0]]);
  const depthAt = (f) => {
    const want = f * Ltot;
    let j = 0;
    while (j < ringS.length - 2 && ringS[j + 1] < want) j++;
    const t = (want - ringS[j]) / ((ringS[j + 1] - ringS[j]) || 1);
    return depC[j] + (depC[j + 1] - depC[j]) * t;
  };
  // near the same fraction of the way round, take the nearest point of the original curve
  const nR = flat.length;
  const spDepth = sp.map((q, k) => {
    const j0 = Math.round(k / sp.length * nR);
    let bz = 0, bd = Infinity;
    for (let dj = -Math.ceil(nR * 0.06); dj <= Math.ceil(nR * 0.06); dj++) {
      const j = ((j0 + dj) % nR + nR) % nR, j2 = (j + 1) % nR;
      const a = flat[j], b = flat[j2];
      const ex = b[0] - a[0], ey = b[1] - a[1], l2 = ex * ex + ey * ey || 1;
      const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * ex + (q[1] - a[1]) * ey) / l2));
      const d = Math.hypot(a[0] + ex * t - q[0], a[1] + ey * t - q[1]);
      if (d < bd) { bd = d; bz = v.depth[j] + (v.depth[j2] - v.depth[j]) * t; }
    }
    return bz;
  });
  void depthAt;
  const srcI = closedInfo(flat, v.depth);
  const sbits = K.bitsByOver(scr, srcI.cr.map((c, j) => ({ x: c.x, y: c.y, over: srcI.bits[j] ? c.da : c.db })));
  void spDepth;
  const V2 = K.jones(spC, scr, sbits).V;
  if (!P.eq(V2, e.V)) {
    const src = closedInfo(flat, v.depth);
    const diag = scr.map((c, k) => {
      let bi = 0, bd = Infinity;
      src.cr.forEach((c0, j) => { const d = Math.hypot(c0.x - c.x, c0.y - c.y); if (d < bd) { bd = d; bi = j; } });
      const c0 = src.cr[bi], over = src.bits[bi] ? c0.da : c0.db;
      const byOver = Math.abs(over[0] * c.da[0] + over[1] * c.da[1]) >= Math.abs(over[0] * c.db[0] + over[1] * c.db[1]) ? 1 : 0;
      return k + ': d=' + bd.toFixed(2) + ' bit=' + sbits[k] + ' byOver=' + byOver;
    });
    throw new Error(e.id + ': the spline picture is ' + P.str(V2) + ' | src V ' + P.str(K.jones(src.pts, src.cr, src.bits).V) + ' | ' + diag.join('; '));
  }
  return { c: flatCtrl, bits: sbits.join(''), q: +q.toFixed(3), mirrored };
}

if (args.includes('--pics')) {
  const out = {};
  const only = args[args.indexOf('--pics') + 1];
  K.table.forEach((e) => {
    if (!e.conway) return;
    if (only && !only.startsWith('-') && !only.split(',').includes(e.id)) return;
    const t0 = Date.now();
    const pic = picture(e);
    console.error(e.id, 'quality', pic.q, pic.mirrored ? 'mirrored' : '', (Date.now() - t0) + ' ms');
    out[e.id] = { c: pic.c, bits: pic.bits };
  });
  console.log(JSON.stringify(out));
  process.exit(0);
}

module.exports = { relax, view, closedInfo, quality, picture, finish, starView };
if (require.main !== module) return;

/* ---------- the stored families ---------- */

require(path.join(ROOT, 'engines/knots.js'));
const E = C.engines.knots, X = C.knotsEngine;

// the pull in the browser must show what the answer says: run it here once
function pullOK(p) {
  const R = X.ropeOf(p.data);
  const V = R.prep.jones(R.bits).V;
  const sim = new K.Sim(K.beadsOf(R.pts, R.cr, R.bits, K.W / 2), { r: K.W / 2 });
  while (!sim.done) sim.step();
  if (K.isUnknot(V)) return sim.result === 'straight';
  return sim.result === 'tight' && P.eq(K.jones3D(sim.points()).V, V);
}

function keyOf(p) { return p.data.c.join(',') + '|' + p.data.bits; }

function fill(fid, prefix, plan, curated, make) {
  const out = [], seen = new Set(), titles = new Set();
  let seed = C.hash(fid) % 100000, rejected = 0;
  const take = (p, level) => {
    if (!p || seen.has(keyOf(p))) return false;
    const v = E.verify(p);
    if (!v.ok) { rejected++; return false; }
    if (p.data.kind === 'knot' && !pullOK(p)) { rejected++; return false; }
    let t = p.title;
    for (let k = 0; titles.has(t); k++) t = X.titleFor(C.rng(seed * 31 + k));
    p.title = t;
    titles.add(t);
    seen.add(keyOf(p));
    p.diff = p.diff || level;
    out.push(p);
    return true;
  };
  (curated || []).forEach((cu) => {
    for (let k = 0; k < 400; k++) {
      const p = cu.make(C.rng(seed++));
      if (p && (!cu.ok || cu.ok(p))) { Object.assign(p, cu.over(p)); if (take(p, p.diff)) break; }
    }
  });
  plan.forEach(([level, count, maker]) => {
    let made = 0;
    for (let guard = 0; made < count && guard < count * 60; guard++) {
      const p = (maker || make)(C.rng(seed++), level);
      if (take(p, level)) made++;
    }
    if (made < count) console.warn(fid + ': level ' + level + ' only ' + made + ' of ' + count);
  });
  // easiest first, keeping the hand-made ones at the front of their level
  out.forEach((p, i) => { p._i = i; });
  out.sort((a, b) => a.diff - b.diff || a._i - b._i);
  out.forEach((p, i) => { delete p._i; p.id = prefix + '-' + String(i + 1).padStart(3, '0'); });
  console.log(fid + ': ' + out.length + ' puzzles (' + [1, 2, 3, 4, 5].map((l) => out.filter((p) => p.diff === l).length).join('/') + '), ' + rejected + ' rejected');
  return out;
}

function write(file, meta, list) {
  const order = ['id', 'title', 'diff', 'year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags', 'par', 'data'];
  let s = '/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/knots.js */\nCabinet.family(' + JSON.stringify(meta, null, 2).replace(/\n\s*/g, ' ') + ', [\n';
  s += list.map((p) => '  { ' + order.filter((k) => p[k] != null).map((k) => JSON.stringify(k).replace(/"/g, '') + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }').join(',\n');
  s += '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), s);
  console.log('  wrote data/' + file + ' (' + Math.round(s.length / 1024) + ' KB)');
}

const CONCEPTS = ['knot-theory', 'topology'];

// ---- Knot or not? ----
const knotOrNot = fill('knot-or-not', 'knot-or', [[1, 16], [2, 18], [3, 18], [4, 16], [5, 12]], [
  {
    make: (rng) => X.makeKnotOrNot(rng, 1, { want: 1, pic: '3_1' }),
    over: () => ({ title: 'The Overhand Knot', diff: 1, text: 'Tie a loose overhand knot in a rope and look down on it from above: this is what you see. Knot or not? (A warm-up: every rope puzzle starts here.)', tags: ['overhand', 'trefoil'] })
  },
  {
    make: (rng) => X.makeKnotOrNot(rng, 2, { want: 0, pic: '3_1' }),
    ok: (p) => p.data.bits.length === 3,
    over: () => ({ title: 'The Conjurer\'s Knot', diff: 2, text: 'Stage magicians love a knot that is not one: it looks like a perfectly good overhand knot, until someone pulls. Is this the real thing, or the conjurer\'s kind?', tags: ['magic', 'trefoil'] })
  },
  {
    make: (rng) => X.makeKnotOrNot(rng, 2, { want: 1, pic: '4_1' }),
    over: () => ({ title: 'The Sailor\'s Stopper', diff: 2, text: 'Sailors tie a figure-eight in the end of a line so it cannot run out through a block. Here is one, drawn from above, with its ends pulled out of the picture. Knot or not?', tags: ['figure-eight', 'sailors'] })
  },
  {
    make: (rng) => X.makeKnotOrNot(rng, 3, { want: 0, pic: '4_1' }),
    over: () => ({ title: 'A Figure-Eight Gone Wrong', diff: 3, text: 'Someone tried to tie a figure-eight knot and got one crossing the wrong way round. Or did they? Knot or not?', tags: ['figure-eight'] })
  }
], X.makeKnotOrNot);
write('knot-or-not.js', {
  id: 'knot-or-not', engine: 'knots', cat: 'ropes', name: 'Knot or not?', order: 1,
  blurb: 'A rope held by its two ends. Pull them apart: does it run out straight, or tighten into a knot? Then pull and watch.',
  origin: { year: 1877, who: 'Peter Guthrie Tait', note: 'Tait began drawing tables of knots in 1876–77, hoping (with Kelvin) that atoms were knotted vortices in the ether. The atoms were not; the question of telling a real knot from a tangle that falls apart has been at the heart of knot theory ever since.' },
  concepts: CONCEPTS
}, knotOrNot);

// ---- Name that knot ----
const nameCurated = [
  {
    make: (rng) => X.makeName(rng, 1, { id: '3_1', m: 0, pic: true }),
    over: (p) => ({ title: 'Left or Right?', diff: 1, text: 'The trefoil comes in two kinds that are mirror images of each other, and no amount of pulling turns one into the other. Which trefoil is this?', data: Object.assign(p.data, { choices: [['3_1', 0], ['3_1', 1], ['4_1', 0], ['0_1', 0]] }), tags: ['trefoil', 'chirality'] })
  },
  {
    make: (rng) => X.makeName(rng, 3, { id: 'square', pic: true }),
    over: (p) => ({ title: 'Granny or Reef?', diff: 3, text: 'Two overhand knots tied one after the other make a *reef knot* (square knot) if the second is the mirror image of the first, and a *granny knot* if both have the same hand. Sailors trust one and scorn the other. Which is this?', data: Object.assign(p.data, { choices: [['square', 0], ['granny', 0], ['granny', 1], ['6_1', 0]] }), tags: ['reef', 'granny', 'sailors'] })
  },
  {
    make: (rng) => X.makeName(rng, 2, { id: '5_1', m: 0, pic: true }),
    over: () => ({ title: 'The Five-Leaved Star', diff: 2, text: 'Five petals, five crossings, over and under in turn. Which knot is it?', tags: ['torus knot'] })
  }
];
const knotId = fill('knot-id', 'knot-id', [
  [1, 5, X.makeName], [1, 2, X.makeTie], [2, 7, X.makeName], [2, 3, X.makeTie], [3, 7, X.makeName], [3, 3, X.makeTie],
  [4, 6, X.makeName], [4, 2, X.makeTie], [5, 4, X.makeName], [5, 2, X.makeTie]
], nameCurated, X.makeName);
write('knot-id.js', {
  id: 'knot-id', engine: 'knots', cat: 'ropes', name: 'Name that knot', order: 2,
  blurb: 'Which knot is tied in this rope — trefoil, figure-eight, cinquefoil …? And some the other way round: switch crossings to tie the knot asked for.',
  origin: { year: 1976, who: 'Tait, Kirkman, Little and Rolfsen', note: 'The first tables of knots were drawn by hand by Tait, Kirkman and Little between 1876 and 1899. The names used here — 3₁, 4₁, 5₁, 5₂ … — are the numbers in the table Dale Rolfsen printed in 1976. The Jones polynomial (1984) tells every one of them apart.' },
  concepts: CONCEPTS
}, knotId);

// ---- Untie it ----
const unknotting = fill('unknotting', 'untie', [[1, 12], [2, 14], [3, 14], [4, 12], [5, 8]], [], X.makeUntie);
write('unknotting.js', {
  id: 'unknotting', engine: 'knots', cat: 'ropes', name: 'Untie it', order: 3,
  blurb: 'Switch as few crossings as you can — put the other strand on top — so that the knotted rope comes apart when pulled.',
  origin: { year: 1993, who: 'The unknotting number', note: 'How many crossings must be switched to untie a knot? The question is easy to ask and hard to answer: that the seven-crossing star 7₁ needs three switches, and no drawing of it does with fewer, was only proved in 1993, by Kronheimer and Mrowka.' },
  concepts: CONCEPTS
}, unknotting);
