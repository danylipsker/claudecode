/* The Puzzle Cabinet · engines/gears.js
 *
 * Gear trains, belts and chains. Gears are drawn as real involute spur gears
 * (module 2: a gear of t teeth has a pitch radius of t world units, so tooth
 * counts and sizes agree and meshing teeth interleave). Which gears mesh is
 * worked out from the drawing itself: two gears in the same plane whose
 * centres are exactly the sum of their pitch radii apart. The kinematics are
 * computed exactly (fractions), and a closed loop that cannot turn — an odd
 * loop of gears, or a loop whose ratios disagree — jams the whole train.
 *
 * data: {
 *   shafts: [[x, y], …],
 *   parts: [ { k: 'g', s, t, z }          gear: shaft, teeth, plane (0 back, 1 front)
 *          | { k: 'p', s, r, z }          belt pulley of radius r
 *          | { k: 'sp', s, t, z }         chain sprocket
 *          | { k: 'drum', s, r, z, side: 1 | -1, w: '20 kg', L: 70 }   rope drum; the rope hangs on the right (1) or left (-1)
 *          | { k: 'w', s, r }             a road wheel (bicycle), drawn behind everything
 *          ],
 *   belts: [{ a, b, x: 1 (crossed), ch: 1 (chain) }],
 *   racks: [{ g: part, a: angle to the rack (deg), n: teeth each side }],
 *   drive: { s, dir: 1 (clockwise) | -1, rpm, m: 'crank' | 'motor' },
 *   q: { k: 'dir' | 'speed' | 'turns' | 'jam' | 'weight' | 'rack' | 'rackd' | 'wdist' | 'fastest' | 'idler' | 'choose' | 'orbit', p: part, n: handle turns, … },
 *   ans: a choice index, or a fraction [n, d] for numbers
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const M = C.mech;
  const F = M.F;

  const MOD = 2;              // the module: pitch radius = MOD × teeth / 2
  const TOL = 0.05;           // centre distance tolerance for meshing
  const PA = 20 * Math.PI / 180;
  const MATS = ['brass', 'steel', 'copper', 'bronze'];
  const DIRS = ['Clockwise ↻', 'Anticlockwise ↺', 'It does not turn'];

  /* ================= geometry ================= */

  const R = (p) => (p.k === 'g' || p.k === 'sp' ? p.t * MOD / 2 : p.r);
  function Ro(p) {
    if (p.k === 'g') return R(p) + MOD;
    if (p.k === 'sp') return R(p) + MOD * 0.9;
    if (p.k === 'p') return p.r + 2;
    if (p.k === 'drum') return p.r + 3.5;
    return p.r + 3;
  }
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]);
  function segDist(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2));
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }
  function segCross(a, b, c, e) {
    const d1 = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
    const d2 = (b[0] - a[0]) * (e[1] - a[1]) - (b[1] - a[1]) * (e[0] - a[0]);
    const d3 = (e[0] - c[0]) * (a[1] - c[1]) - (e[1] - c[1]) * (a[0] - c[0]);
    const d4 = (e[0] - c[0]) * (b[1] - c[1]) - (e[1] - c[1]) * (b[0] - c[0]);
    return d1 * d2 < 0 && d3 * d4 < 0;
  }

  // the straight runs of a belt: [[p, q], [p, q]] (tangent points), plus the angles for drawing
  function beltRuns(d, b) {
    const A = d.parts[b.a], B = d.parts[b.b];
    const ca = d.shafts[A.s], cb = d.shafts[B.s];
    const ra = R(A), rb = R(B), D = dist(ca, cb), phi = ang(ca, cb);
    const cr = b.x ? (ra + rb) / D : (ra - rb) / D;
    if (Math.abs(cr) >= 1) return null;
    const be = Math.acos(cr);
    const P = (c, r, a) => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)];
    if (!b.x) {
      return { runs: [[P(ca, ra, phi + be), P(cb, rb, phi + be)], [P(cb, rb, phi - be), P(ca, ra, phi - be)]], phi, be, crossed: false };
    }
    return { runs: [[P(ca, ra, phi + be), P(cb, rb, phi + be + Math.PI)], [P(cb, rb, phi - be + Math.PI), P(ca, ra, phi - be)]], phi, be, crossed: true };
  }

  // where a rack sits: T = the pitch point, e = the direction a clockwise turn pushes it, n = outward from the gear
  function rackFrame(d, rk) {
    const g = d.parts[rk.g], c = d.shafts[g.s], r = R(g), psi = rk.a * Math.PI / 180;
    const n = [Math.cos(psi), Math.sin(psi)], e = [-Math.sin(psi), Math.cos(psi)];
    return { T: [c[0] + n[0] * r, c[1] + n[1] * r], n, e, psi, r, len: (rk.n || 6) * Math.PI * MOD };
  }

  // which gears mesh, and what is wrong with the layout
  function analyse(d) {
    const P = d.parts, S = d.shafts, errs = [], meshes = [];
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const a = P[i], b = P[j];
        if (a.s === b.s) { if ((a.z || 0) === (b.z || 0) && a.k !== 'w' && b.k !== 'w') errs.push('parts ' + i + ' and ' + j + ' share a shaft and a plane'); continue; }
        if (a.k === 'w' || b.k === 'w') continue;
        if ((a.z || 0) !== (b.z || 0)) continue;
        const dd = dist(S[a.s], S[b.s]);
        if (a.k === 'g' && b.k === 'g' && Math.abs(dd - R(a) - R(b)) < TOL) { meshes.push([i, j]); continue; }
        if (dd < Ro(a) + Ro(b) + 1.5) errs.push('parts ' + i + ' and ' + j + ' collide');
      }
    }
    // no part may cover another part's shaft (shafts run through every plane)
    P.forEach((p, i) => {
      if (p.k === 'w') return;
      S.forEach((s, k) => { if (k !== p.s && dist(s, S[p.s]) < Ro(p) + 2.5) errs.push('part ' + i + ' covers shaft ' + k); });
    });
    (d.belts || []).forEach((b, bi) => {
      const A = P[b.a], B = P[b.b];
      if (!A || !B) { errs.push('belt ' + bi + ' has a missing pulley'); return; }
      if ((A.z || 0) !== (B.z || 0)) errs.push('belt ' + bi + ' joins two planes');
      const ok = b.ch ? (A.k === 'sp' && B.k === 'sp') : (A.k === 'p' && B.k === 'p');
      if (!ok) errs.push('belt ' + bi + ' joins the wrong kinds of wheel');
      if (b.ch && b.x) errs.push('a chain cannot cross');
      const g = beltRuns(d, b);
      if (!g) { errs.push('belt ' + bi + ': pulleys too close'); return; }
      g.runs.forEach(([p, q]) => {
        P.forEach((o, k) => {
          if (k === b.a || k === b.b || o.k === 'w') return;
          if ((o.z || 0) === (A.z || 0) && segDist(S[o.s], p, q) < Ro(o) + 1.5) errs.push('belt ' + bi + ' runs through part ' + k);
        });
        S.forEach((s, k) => { if (k !== A.s && k !== B.s && segDist(s, p, q) < 4) errs.push('belt ' + bi + ' runs over shaft ' + k); });
        (d.belts || []).forEach((b2, bj) => {
          if (bj <= bi) return;
          const g2 = beltRuns(d, b2);
          if (!g2 || (P[b2.a].z || 0) !== (A.z || 0)) return;
          g2.runs.forEach(([p2, q2]) => { if (segCross(p, q, p2, q2)) errs.push('belts ' + bi + ' and ' + bj + ' cross'); });
        });
      });
      if (g.crossed && !segCross(g.runs[0][0], g.runs[0][1], g.runs[1][0], g.runs[1][1])) errs.push('crossed belt does not cross');
    });
    (d.racks || []).forEach((rk, ri) => {
      const g = P[rk.g];
      if (!g || g.k !== 'g') { errs.push('rack ' + ri + ' needs a gear'); return; }
      const f = rackFrame(d, rk);
      // the whole stretch the rack sweeps while it runs (a quarter of its length each way)
      const L2 = f.len / 2 + f.len / 4 + 4;
      const back = [f.T[0] + f.n[0] * 4.5 * MOD, f.T[1] + f.n[1] * 4.5 * MOD], tip = [f.T[0] - f.n[0] * MOD, f.T[1] - f.n[1] * MOD];
      const a = [back[0] - f.e[0] * L2, back[1] - f.e[1] * L2], b = [back[0] + f.e[0] * L2, back[1] + f.e[1] * L2];
      const a2 = [tip[0] - f.e[0] * L2, tip[1] - f.e[1] * L2], b2 = [tip[0] + f.e[0] * L2, tip[1] + f.e[1] * L2];
      P.forEach((o, k) => {
        if (k === rk.g || o.k === 'w' || (o.z || 0) !== (g.z || 0)) return;
        if (Math.min(segDist(S[o.s], a, b), segDist(S[o.s], a2, b2)) < Ro(o) + 3) errs.push('rack ' + ri + ' hits part ' + k);
      });
      S.forEach((s, k) => { if (k !== g.s && Math.min(segDist(s, a, b), segDist(s, a2, b2)) < 4) errs.push('rack ' + ri + ' runs over shaft ' + k); });
    });
    P.forEach((p, i) => {
      if (p.k !== 'drum') return;
      const c = S[p.s], x = c[0] + (p.side || 1) * p.r, y0 = c[1], y1 = c[1] + (p.L || 70) + 24;
      // the rope hangs in the drum's plane: it may pass in front of parts further back
      P.forEach((o, k) => { if (k !== i && o.k !== 'w' && (o.z || 0) >= (p.z || 0) && segDist(S[o.s], [x, y0], [x, y1]) < Ro(o) + 1) errs.push('the rope of drum ' + i + ' hits part ' + k); });
      S.forEach((s, k) => { if (k !== p.s && segDist(s, [x, y0], [x, y1]) < 9) errs.push('the rope of drum ' + i + ' passes a shaft'); });
    });
    return { meshes, errs };
  }

  /* ================= kinematics (exact) ================= */

  // ω of every shaft as a signed fraction of turns per minute (+ = clockwise on screen); null = not driven
  function kin(d, A) {
    A = A || analyse(d);
    const P = d.parts, ns = d.shafts.length;
    const adj = Array.from({ length: ns }, () => []);
    const link = (sa, sb, f, why) => { adj[sa].push({ to: sb, f, why }); adj[sb].push({ to: sa, f: F.div([1, 1], f), why }); };
    A.meshes.forEach(([i, j]) => link(P[i].s, P[j].s, F.fr(-P[i].t, P[j].t), { k: 'mesh', a: i, b: j }));
    (d.belts || []).forEach((b, bi) => {
      const pa = P[b.a], pb = P[b.b];
      const ra = pa.k === 'sp' ? pa.t : pa.r, rb = pb.k === 'sp' ? pb.t : pb.r;
      link(pa.s, pb.s, F.fr((b.x ? -1 : 1) * ra, rb), { k: b.ch ? 'chain' : 'belt', a: b.a, b: b.b, x: !!b.x, bi });
    });
    const w = new Array(ns).fill(null), from = new Array(ns).fill(null), depth = new Array(ns).fill(0);
    const s0 = d.drive.s;
    w[s0] = F.fr(d.drive.dir * d.drive.rpm, 1);
    const order = [s0];
    let conflict = null;
    for (let qi = 0; qi < order.length; qi++) {
      const s = order[qi];
      for (const e of adj[s]) {
        const v = F.mul(w[s], e.f);
        if (w[e.to] == null) { w[e.to] = v; from[e.to] = { s, e }; depth[e.to] = depth[s] + 1; order.push(e.to); }
        else if (!F.eq(w[e.to], v) && !conflict) conflict = { a: s, b: e.to, e };
      }
    }
    const jam = !!conflict;
    const out = { w, jam, conflict, from, order, depth, driven: order.slice() };
    if (jam) out.loop = loopOf(from, conflict);
    return out;
  }
  // the shafts of the loop closed by the conflicting link
  function loopOf(from, cf) {
    const up = (s) => { const L = [s]; while (from[s]) { s = from[s].s; L.push(s); } return L; };
    const A = up(cf.a), B = up(cf.b);
    const inB = new Set(B);
    const meet = A.find((s) => inB.has(s));
    return A.slice(0, A.indexOf(meet) + 1).concat(B.slice(0, B.indexOf(meet)).reverse());
  }
  const shaftW = (K, s) => (K.jam ? (K.w[s] == null ? null : [0, 1]) : K.w[s]);

  // the direction and speed of a rack (+ = along e) and of a drum's weight (+ = down)
  function rackV(d, K, rk) { const g = d.parts[rk.g], w = shaftW(K, g.s); return w == null ? [0, 1] : F.mul(w, [R(g), 1]); }
  function weightV(d, K, p) { const w = shaftW(K, p.s); return w == null ? [0, 1] : F.mul(w, [p.side || 1, 1]); }
  // which way a rack goes, in words
  function rackWord(rk, sign) {
    if (!sign) return 'does not move';
    const a = ((rk.a % 360) + 360) % 360;
    const e = [-Math.sin(a * Math.PI / 180) * sign, Math.cos(a * Math.PI / 180) * sign];
    return Math.abs(e[0]) > Math.abs(e[1]) ? (e[0] > 0 ? 'right' : 'left') : (e[1] > 0 ? 'down' : 'up');
  }
  function rackChoices(rk) {
    const a = ((rk.a % 360) + 360) % 360;
    const horiz = Math.abs(Math.cos(a * Math.PI / 180)) > 0.7; // rack beside the gear: it moves up and down
    return horiz ? ['Up', 'Down', 'It does not move'] : ['Left', 'Right', 'It does not move'];
  }

  /* ================= teeth phases (so the drawing meshes) ================= */

  const frac1 = (x) => x - Math.floor(x);
  function phases(d, A) {
    A = A || analyse(d);
    const P = d.parts, S = d.shafts;
    const ph = P.map(() => null);
    const nb = P.map(() => []);
    A.meshes.forEach(([i, j]) => { nb[i].push(j); nb[j].push(i); });
    let worst = 0;
    const uOf = (i, psi, th) => frac1((psi - th) / (2 * Math.PI / P[i].t));
    for (let st = 0; st < P.length; st++) {
      if (ph[st] != null || (P[st].k !== 'g' && P[st].k !== 'sp')) continue;
      ph[st] = (st * 0.37) % 1 * (2 * Math.PI / (P[st].t || 12));
      const q = [st];
      while (q.length) {
        const i = q.shift();
        for (const j of nb[i]) {
          const psi = ang(S[P[i].s], S[P[j].s]);
          const ui = uOf(i, psi, ph[i]);
          if (ph[j] == null) {
            const uj = frac1(0.5 - ui);
            ph[j] = psi + Math.PI - uj * 2 * Math.PI / P[j].t;
            q.push(j);
          } else {
            const uj = uOf(j, psi + Math.PI, ph[j]);
            const m = Math.abs(frac1(ui + uj - 0.5 + 0.5) - 0.5);
            worst = Math.max(worst, m);
          }
        }
      }
    }
    P.forEach((p, i) => { if (ph[i] == null) ph[i] = 0; });
    return { ph, worst };
  }

  /* ================= answers ================= */

  const ONE = [1, 1];
  // the choices offered for a question
  function choicesOf(d) {
    const q = d.q;
    if (q.k === 'dir') return DIRS.slice();
    if (q.k === 'jam') return ['It turns', 'It jams'];
    if (q.k === 'weight') return ['Up', 'Down', 'It does not move'];
    if (q.k === 'rack') return rackChoices(d.racks[q.r]);
    if (q.k === 'fastest') return q.among.map((i) => 'Gear ' + labelOf(d, i));
    if (q.k === 'choose') return q.opts.map((o) => optText(d, o));
    return null;
  }
  function optText(d, o) {
    const q = d.q;
    if (q.v === 'pair') return o[0] + ' and ' + o[1] + ' teeth';
    if (q.v === 'sprocket') return o + ' teeth';
    return 'Ø ' + (2 * o) + ' cm';
  }
  function labelOf(d, i) {
    const p = d.parts[i];
    if (p.ix) return 'the loose gear';
    if (p.n) return p.n;
    // letters in part order, skipping drums and wheels
    let k = 0;
    for (let j = 0; j < i; j++) if (d.parts[j].k === 'g' || d.parts[j].k === 'p' || d.parts[j].k === 'sp') k++;
    return M.letter(k);
  }

  // the answer worked out from the machine itself: a choice index or a fraction
  function solveQ(d) {
    const q = d.q;
    if (q.k === 'orbit') return orbitTurns(d.orbit);
    const A = analyse(d);
    if (A.errs.length) return { err: A.errs[0] };
    if (q.k === 'idler') return idlerCheck(d, A);
    if (q.k === 'choose') return chooseCheck(d);
    const K = kin(d, A);
    const wOf = (i) => shaftW(K, d.parts[i].s);
    switch (q.k) {
      case 'dir': { const w = wOf(q.p); return { v: w == null || F.zero(w) ? 2 : (F.sign(w) > 0 ? 0 : 1), K }; }
      case 'jam': return { v: K.jam ? 1 : 0, K };
      case 'speed': { const w = wOf(q.p); if (w == null || K.jam) return { err: 'the gear asked about does not turn' }; return { v: F.abs(w), K }; }
      case 'turns': { const w = wOf(q.p); if (w == null || K.jam) return { err: 'the gear asked about does not turn' }; return { v: F.mul(F.abs(F.div(w, K.w[d.drive.s])), [q.n || 1, 1]), K }; }
      case 'weight': { const v = weightV(d, K, d.parts[q.p]); return { v: F.zero(v) ? 2 : (F.sign(v) < 0 ? 0 : 1), K }; }
      case 'wdist': {
        const p = d.parts[q.p], w = wOf(q.p);
        if (w == null || K.jam) return { err: 'the drum does not turn' };
        return { v: F.mul(F.mul(F.abs(F.div(w, K.w[d.drive.s])), [q.n || 1, 1]), [q.circ, 1]), K };
      }
      case 'rack': {
        const rk = d.racks[q.r], v = rackV(d, K, rk);
        if (F.zero(v)) return { v: 2, K };
        const word = rackWord(rk, F.sign(v));
        return { v: rackChoices(rk).map((c) => c.toLowerCase()).indexOf(word), K };
      }
      case 'rackd': {
        const rk = d.racks[q.r], g = d.parts[rk.g], w = wOf(rk.g);
        if (w == null || K.jam) return { err: 'the rack does not move' };
        return { v: F.mul(F.mul(F.abs(F.div(w, K.w[d.drive.s])), [q.n || 1, 1]), [g.t, 1]), K };
      }
      case 'fastest': {
        if (K.jam) return { err: 'jammed' };
        let best = -1, bv = -1, second = -1;
        q.among.forEach((i, k) => { const w = wOf(i); const v = w ? Math.abs(F.num(w)) : 0; if (v > bv) { second = bv; bv = v; best = k; } else if (v > second) second = v; });
        if (second >= bv - 1e-9) return { err: 'two gears share the top speed' };
        return { v: best, K };
      }
      default: return { err: 'unknown question ' + q.k };
    }
  }

  /* ---------- a gear rolling round another (the coin paradox) ---------- */

  function orbitTurns(o) {
    if (!o || !o.sun || !o.planet) return { err: 'orbit needs sun and planet' };
    // turns of the planet, as you see it, for one turn of the arm
    const v = o.ring ? F.sub(F.fr(o.sun, o.planet), ONE) : F.add(F.fr(o.sun, o.planet), ONE);
    return { v: F.mul(v, [o.n || 1, 1]) };
  }

  /* ---------- "add one idler gear" ---------- */

  function withIdler(d, pt, t) {
    const d2 = Object.assign({}, d);
    d2.shafts = d.shafts.concat([[pt[0], pt[1]]]);
    d2.parts = d.parts.concat([{ k: 'g', s: d.shafts.length, t: t || d.q.t, z: d.q.z || 0, ix: 1, c: 'brass' }]);
    return d2;
  }
  // every place the loose gear fits meshing two (or three) gears at once, and what happens there
  function idlerSpots(d) {
    const P = d.parts, S = d.shafts, q = d.q, z = q.z || 0;
    const sizes = q.ts || [q.t];
    const spots = [];
    sizes.forEach((t) => {
      const r = t * MOD / 2;
      const gs = [];
      P.forEach((p, i) => { if (p.k === 'g' && (p.z || 0) === z) gs.push(i); });
      for (let a = 0; a < gs.length; a++) {
        for (let b = a + 1; b < gs.length; b++) {
          const A = P[gs[a]], B = P[gs[b]], ca = S[A.s], cb = S[B.s];
          const ra = R(A) + r, rb = R(B) + r, D = dist(ca, cb);
          if (D > ra + rb - 1e-6 || D < Math.abs(ra - rb) + 1e-6) continue;
          const x = (D * D + ra * ra - rb * rb) / (2 * D), h = Math.sqrt(Math.max(0, ra * ra - x * x));
          const ux = (cb[0] - ca[0]) / D, uy = (cb[1] - ca[1]) / D;
          [1, -1].forEach((sg) => {
            const pt = [ca[0] + ux * x - uy * h * sg, ca[1] + uy * x + ux * h * sg];
            if (spots.some((s) => s.t === t && dist(s.pt, pt) < 0.5)) return;
            const d2 = withIdler(d, pt, t), A2 = analyse(d2);
            if (A2.errs.length) return;
            const K2 = kin(d2, A2);
            const w = shaftW(K2, P[q.out].s);
            const nI = P.length;
            const meshWith = A2.meshes.filter((m) => m[0] === nI || m[1] === nI).map((m) => (m[0] === nI ? m[1] : m[0]));
            spots.push({ pt: [pt[0], pt[1]], t, ok: !!w && !K2.jam && F.sign(w) === q.want, jam: K2.jam, w, meshWith });
          });
        }
      }
    });
    return spots;
  }
  function idlerCheck(d, A) {
    const K = kin(d, A);
    const w0 = shaftW(K, d.parts[d.q.out].s);
    if (w0 != null && !F.zero(w0)) return { err: 'the output already turns without the idler' };
    const spots = idlerSpots(d);
    const good = spots.filter((s) => s.ok);
    if (!good.length) return { err: 'no place for the idler works' };
    const res = { v: 'idler', spots, good };
    if (!spots.some((s) => !s.ok)) res.warn = 'every spot works — no trap';
    return res;
  }

  /* ---------- "choose the gear" ---------- */

  function applyOpt(d, o) {
    const d2 = C.clone(d), q = d.q;
    if (q.v === 'pair') { d2.parts[q.p[0]].t = o[0]; d2.parts[q.p[1]].t = o[1]; }
    else if (q.v === 'sprocket') d2.parts[q.p[0]].t = o;
    else d2.parts[q.p[0]].r = o;
    return d2;
  }
  function chooseCheck(d) {
    const q = d.q;
    const res = q.opts.map((o) => {
      const d2 = applyOpt(d, o), A2 = analyse(d2);
      if (A2.errs.length) return { bad: A2.errs[0], w: null };
      const K2 = kin(d2, A2), w = shaftW(K2, d2.parts[q.out].s);
      return { w: w && !K2.jam ? F.abs(w) : null };
    });
    const hits = [];
    res.forEach((r, i) => { if (r.w && F.eq(r.w, F.fr(q.want))) hits.push(i); });
    if (hits.length !== 1) return { err: hits.length + ' options give the speed asked for' };
    if (res[hits[0]].bad) return { err: 'the right option does not fit: ' + res[hits[0]].bad };
    return { v: hits[0], res };
  }

  /* ================= drawing (SVG strings) ================= */

  const f3 = M.r3;
  const outlines = {};
  // a spur gear's outline, tooth centred on angle 0 (involute flanks, a little backlash);
  // internal: the inside of a ring gear (its spaces are the teeth of an ordinary gear)
  function gearOutline(t, internal) {
    const key = t + (internal ? 'i' : 'e');
    if (outlines[key]) return outlines[key];
    const m = MOD, r = t * m / 2, rb = r * Math.cos(PA);
    const ad = internal ? 1.25 * m : m, de = internal ? m : 1.25 * m;
    const ra = r + ad, rf = r - de;
    const back = 0.04 * Math.PI / t;
    const half = Math.PI / (2 * t) + (internal ? back : -back);
    const invPA = Math.tan(PA) - PA;
    const fl = (rr) => { if (rr <= rb) return half + invPA; const a = Math.acos(rb / rr); return half + invPA - (Math.tan(a) - a); };
    const pitch = 2 * Math.PI / t, r0 = Math.max(rf, rb), N = 5;
    const pts = [];
    const P = (rr, a) => pts.push([rr * Math.cos(a), rr * Math.sin(a)]);
    for (let k = 0; k < t; k++) {
      const c = k * pitch;
      const a0 = c - pitch / 2, aL = c - fl(r0);
      for (let i = 0; i <= 2; i++) P(rf, a0 + (aL - a0) * i / 2);
      if (rf < r0) P(r0, aL);
      for (let i = 1; i <= N; i++) { const rr = r0 + (ra - r0) * i / N; P(rr, c - fl(rr)); }
      P(ra, c);
      for (let i = N; i >= 1; i--) { const rr = r0 + (ra - r0) * i / N; P(rr, c + fl(rr)); }
      if (rf < r0) P(r0, c + fl(r0));
      const aR = c + fl(r0), a1 = c + pitch / 2;
      for (let i = 0; i < 2; i++) P(rf, aR + (a1 - aR) * i / 2);
    }
    return (outlines[key] = 'M' + pts.map((p) => f3(p[0]) + ' ' + f3(p[1])).join('L') + 'Z');
  }
  // a chain sprocket: round seats for the rollers
  function sprocketOutline(t) {
    const key = 's' + t;
    if (outlines[key]) return outlines[key];
    const r = t * MOD / 2, ro = r + 1.8, rho = 1.35, P = Math.PI * MOD, pitch = 2 * Math.PI / t;
    const pts = [];
    for (let k = 0; k < t; k++) {
      const c = k * pitch;
      for (let i = 0; i < 14; i++) {
        const s = -P / 2 + P * i / 14;            // arc length from the seat centre
        let rr;
        if (Math.abs(s) < rho) rr = r - Math.sqrt(rho * rho - s * s);
        else rr = r + (ro - r) * Math.sin(Math.PI / 2 * (Math.abs(s) - rho) / (P / 2 - rho));
        const a = c + Math.PI / t + s / r;
        pts.push([rr * Math.cos(a), rr * Math.sin(a)]);
      }
    }
    return (outlines[key] = 'M' + pts.map((p) => f3(p[0]) + ' ' + f3(p[1])).join('L') + 'Z');
  }
  function sector(r0, r1, a0, a1) {
    const p = (r, a) => f3(r * Math.cos(a)) + ' ' + f3(r * Math.sin(a));
    const lg = a1 - a0 > Math.PI ? 1 : 0;
    return 'M' + p(r1, a0) + 'A' + f3(r1) + ' ' + f3(r1) + ' 0 ' + lg + ' 1 ' + p(r1, a1) + 'L' + p(r0, a1) + 'A' + f3(r0) + ' ' + f3(r0) + ' 0 ' + lg + ' 0 ' + p(r0, a0) + 'Z';
  }
  const hubR = (r) => Math.max(3.4, Math.min(8, r * 0.2));
  // lightening holes between spokes
  function webHoles(rIn, rOut, n) {
    let s = '';
    const sp = Math.min(0.45, 3.2 / ((rIn + rOut) / 2));
    for (let i = 0; i < n; i++) {
      const a0 = i * 2 * Math.PI / n + sp, a1 = (i + 1) * 2 * Math.PI / n - sp;
      s += sector(rIn, rOut, a0 - Math.PI / 2, a1 - Math.PI / 2);
    }
    return s;
  }

  // the turning body of a part, in its own coordinates; fill(mat) gives the paint ('url(#…)' or a colour)
  function partSVG(p, mat, fill) {
    const ed = M.edge(mat);
    const r = R(p);
    let s = '';
    if (p.k === 'g' || p.k === 'sp') {
      s += '<path d="' + (p.k === 'g' ? gearOutline(p.t) : sprocketOutline(p.t)) + '" fill="' + fill(mat) + '" stroke="' + ed + '" stroke-width="0.55" stroke-linejoin="round"/>';
      const rf = p.k === 'g' ? r - 1.25 * MOD : r - 1.4, h = hubR(r);
      if (r >= 16) {
        s += '<circle r="' + f3(rf - 1.6) + '" fill="none" stroke="' + ed + '" stroke-opacity=".55" stroke-width="0.5"/>';
        s += '<path d="' + webHoles(h + 2.4, rf - 3.2, r < 24 ? 4 : r < 36 ? 5 : 6) + '" fill="rgba(10,12,24,.55)" stroke="' + ed + '" stroke-width="0.5"/>';
      } else {
        s += '<circle r="' + f3(Math.max(h + 1.4, rf * 0.72)) + '" fill="none" stroke="' + ed + '" stroke-opacity=".6" stroke-width="0.5"/>';
      }
      s += '<circle r="' + f3(h) + '" fill="' + fill(mat) + '" stroke="' + ed + '" stroke-width="0.55"/>';
      s += '<circle r="1.7" fill="#1a1d2b"/><rect x="-0.5" y="-2.4" width="1" height="1" fill="#1a1d2b"/>';
    } else if (p.k === 'p') {
      s += '<circle r="' + f3(r + 1.2) + '" fill="' + fill(mat) + '" stroke="' + ed + '" stroke-width="0.55"/>';
      s += '<circle r="' + f3(r - 1.2) + '" fill="none" stroke="' + ed + '" stroke-width="0.45" stroke-opacity=".7"/>';
      const h = hubR(r), n = r < 14 ? 3 : 5;
      if (r > 9) s += '<path d="' + webHoles(h + 1.6, r - 2.6, n) + '" fill="rgba(10,12,24,.55)" stroke="' + ed + '" stroke-width="0.45"/>';
      s += '<circle r="' + f3(h) + '" fill="' + fill(mat) + '" stroke="' + ed + '" stroke-width="0.5"/><circle r="1.6" fill="#1a1d2b"/>';
    } else if (p.k === 'drum') {
      s += '<circle r="' + f3(r + 3.5) + '" fill="' + fill('iron') + '" stroke="' + M.edge('iron') + '" stroke-width="0.6"/>';
      s += '<circle r="' + f3(r) + '" fill="#c9a26b" stroke="#7a5a2c" stroke-width="0.6"/>';
      for (let k = 1; k <= 3; k++) s += '<circle r="' + f3(r - k * r / 4.5) + '" fill="none" stroke="#8e6a36" stroke-width="0.5" stroke-dasharray="1.2 0.9"/>';
      s += '<path d="M' + f3(-r * 0.2) + ' ' + f3(-r) + 'L' + f3(r * 0.2) + ' ' + f3(r) + '" stroke="#8e6a36" stroke-width="0.4"/>';
      s += '<circle r="' + f3(hubR(r)) + '" fill="' + fill('iron') + '" stroke="' + M.edge('iron') + '" stroke-width="0.5"/><circle r="1.6" fill="#1a1d2b"/>';
    } else if (p.k === 'w') {
      s += '<circle r="' + f3(r) + '" fill="none" stroke="#2a2d38" stroke-width="5.5"/><circle r="' + f3(r) + '" fill="none" stroke="#4a4f60" stroke-width="1.2" stroke-dasharray="1.5 2"/>';
      s += '<circle r="' + f3(r - 3.6) + '" fill="none" stroke="' + fill('steel') + '" stroke-width="1.6"/>';
      const n = 24;
      for (let i = 0; i < n; i++) {
        const a = i * 2 * Math.PI / n, b = a + (i % 2 ? 0.35 : -0.35);
        s += '<path d="M' + f3(4 * Math.cos(b)) + ' ' + f3(4 * Math.sin(b)) + 'L' + f3((r - 4.2) * Math.cos(a)) + ' ' + f3((r - 4.2) * Math.sin(a)) + '" stroke="#9aa3b5" stroke-width="0.35"/>';
      }
      s += '<circle r="4.5" fill="' + fill('steel') + '" stroke="' + M.edge('steel') + '" stroke-width="0.5"/>';
    }
    return s;
  }

  // the belt or chain as a closed loop of points (for the path and its moving texture)
  function beltLoop(d, b) {
    const g = beltRuns(d, b);
    if (!g) return null;
    const A = d.parts[b.a], B = d.parts[b.b];
    const ca = d.shafts[A.s], cb = d.shafts[B.s], ra = R(A), rb = R(B);
    const pts = [];
    const arc = (c, r, a0, a1) => { const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) * r / 3)); for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); } };
    const { phi, be } = g;
    if (!g.crossed) {
      arc(cb, rb, phi + be, phi - be);
      arc(ca, ra, phi - be, phi + be - 2 * Math.PI);
    } else {
      arc(cb, rb, phi + be + Math.PI, phi - be + 3 * Math.PI);
      arc(ca, ra, phi - be, phi + be - 2 * Math.PI);
    }
    return pts;
  }
  const polyD = (pts, close) => 'M' + pts.map((p) => f3(p[0]) + ' ' + f3(p[1])).join('L') + (close ? 'Z' : '');
  function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += dist(pts[i - 1], pts[i]); return L + dist(pts[pts.length - 1], pts[0]); }

  // a rack in its own frame: x along its length, y towards the gear (teeth reach y = +m)
  function rackSVG(n, fill, mat) {
    const m = MOD, p = Math.PI * m, tn = Math.tan(PA), bk = 0.1;
    const wt = p / 2 - 2 * m * tn - bk, wr = p / 2 + 2 * 1.25 * m * tn - bk;
    const L = (n + 0.5) * p;
    let d = 'M' + f3(-L) + ' ' + f3(-1.25 * m - 3.2 * m) + 'L' + f3(-L) + ' ' + f3(-1.25 * m);
    for (let j = -n; j <= n; j++) {
      const x = j * p;
      d += 'L' + f3(x - wr / 2) + ' ' + f3(-1.25 * m) + 'L' + f3(x - wt / 2) + ' ' + f3(m) + 'L' + f3(x + wt / 2) + ' ' + f3(m) + 'L' + f3(x + wr / 2) + ' ' + f3(-1.25 * m);
    }
    d += 'L' + f3(L) + ' ' + f3(-1.25 * m) + 'L' + f3(L) + ' ' + f3(-1.25 * m - 3.2 * m) + 'Z';
    return '<path d="' + d + '" fill="' + fill(mat) + '" stroke="' + M.edge(mat) + '" stroke-width="0.55" stroke-linejoin="round"/>' +
      '<path d="M' + f3(-L + 2) + ' ' + f3(-1.25 * m - 1.6 * m) + 'H' + f3(L - 2) + '" stroke="' + M.edge(mat) + '" stroke-opacity=".5" stroke-width="0.5"/>';
  }
  // a hanging iron weight, its hook at (0, 0)
  function weightSVG(label, fill) {
    return '<path d="M0 -1v4.5" stroke="#6b7080" stroke-width="1"/>' +
      '<path d="M-7 5.5h14l3 15a2 2 0 0 1-2 2.3h-16a2 2 0 0 1-2-2.3z" fill="' + fill('iron') + '" stroke="' + M.edge('iron') + '" stroke-width="0.6"/>' +
      '<path d="M-4 5.5a4 4 0 0 1 8 0" fill="none" stroke="' + M.edge('iron') + '" stroke-width="1.4"/>' +
      '<text y="17.6" text-anchor="middle" class="gr-wlabel">' + C.esc(label || '') + '</text>';
  }

  const matOf = (p, i) => p.c || (p.k === 'p' ? ['steel', 'bronze', 'steel', 'copper'][i % 4] : p.k === 'sp' ? 'steel' : MATS[(i * 3 + 1) % 4]);
  // parts that carry a letter
  const lettered = (p) => p.k === 'g' || p.k === 'p' || p.k === 'sp';
  const showSizes = (d) => ['speed', 'turns', 'fastest', 'wdist', 'rackd', 'choose'].includes(d.q.k) || d.q.sizes;

  // the extent of everything drawn
  function extent(d) {
    const xs = [], ys = [];
    const add = (x, y, r) => { xs.push(x - r, x + r); ys.push(y - r, y + r); };
    d.parts.forEach((p) => { const c = d.shafts[p.s]; add(c[0], c[1], Ro(p) + (p.k === 'w' ? 0 : 6)); if (p.k === 'drum') add(c[0] + (p.side || 1) * p.r, c[1] + (p.L || 70) + 16, 12); });
    (d.racks || []).forEach((rk) => {
      const f = rackFrame(d, rk);
      [-1, 1].forEach((sg) => add(f.T[0] + f.e[0] * sg * (f.len / 2 + 6), f.T[1] + f.e[1] * sg * (f.len / 2 + 6), 10));
    });
    if (!xs.length) return { x0: -50, y0: -50, x1: 50, y1: 50 };
    return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  }

  // a clear place just outside a part for its tag (the angle, in degrees)
  function freeAngle(d, i, taken) {
    const p = d.parts[i], c = d.shafts[p.s], rr = Ro(p) + 8;
    let best = -90, bs = -1e9;
    for (let k = 0; k < 16; k++) {
      const a = -90 + k * 22.5, pt = M.pt(c, rr, a);
      let sc = 1e9;
      d.parts.forEach((o, j) => { if (j === i || o.k === 'w') return; sc = Math.min(sc, dist(pt, d.shafts[o.s]) - Ro(o)); });
      (taken || []).forEach((t) => { sc = Math.min(sc, dist(pt, t) - 10); });
      (d.belts || []).forEach((b) => { const g = beltRuns(d, b); if (g) g.runs.forEach(([u, v]) => { sc = Math.min(sc, segDist(pt, u, v) - 3); }); });
      sc -= Math.abs(Math.sin(a * Math.PI / 180) + 1) * 0.8; // a slight liking for the top
      if (sc > bs + 0.01) { bs = sc; best = a; }
    }
    return best;
  }

  /* ================= words ================= */

  const DIRW = (w) => (w == null || F.zero(w) ? 'does not turn' : F.sign(w) > 0 ? 'clockwise' : 'anticlockwise');
  function nameOf(d, i) {
    const p = d.parts[i];
    if (p.ix) return 'the loose gear';
    const kind = p.k === 'p' ? 'pulley' : p.k === 'sp' ? 'sprocket' : p.k === 'drum' ? 'drum' : 'gear';
    return kind + ' **' + labelOf(d, i) + '**';
  }
  // the chain of reasoning from the driver to a shaft
  function pathSteps(d, K, s) {
    const steps = [];
    while (K.from[s]) { steps.unshift({ s, e: K.from[s].e, prev: K.from[s].s }); s = K.from[s].s; }
    return steps;
  }
  function stepText(d, K, st, withSpeed) {
    const e = st.e.why, P = d.parts;
    const a = P[e.a].s === st.prev ? e.a : e.b, b = a === e.a ? e.b : e.a;
    const w = K.w[st.s];
    let t;
    if (e.k === 'mesh') t = cap(nameOf(d, b)) + ' meshes with ' + labelOf(d, a) + ': it turns the other way';
    else if (e.k === 'chain') t = 'The chain carries the turn to ' + nameOf(d, b) + ': same way';
    else t = (e.x ? 'The crossed belt' : 'The belt') + ' carries the turn to ' + nameOf(d, b) + ': ' + (e.x ? 'the other way' : 'same way');
    t += ' (' + DIRW(w) + ')';
    if (withSpeed) {
      const pa = P[a], pb = P[b];
      const sa = pa.k === 'p' ? pa.r : pa.t, sb = pb.k === 'p' ? pb.r : pb.t;
      t += ', ' + fracW(F.abs(K.w[st.prev])) + ' × ' + sa + ' ÷ ' + sb + ' = **' + fracW(F.abs(w)) + ' rpm**';
    }
    // other parts riding on the same shaft
    const riders = P.map((o, k) => k).filter((k) => k !== b && P[k].s === st.s && lettered(P[k]));
    if (riders.length) t += '; ' + riders.map((k) => labelOf(d, k)).join(', ') + ' on the same shaft turns with it';
    return t + '.';
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const fracW = (a) => (a[1] === 1 ? String(a[0]) : F.nice(a));

  function explainOf(d) {
    const q = d.q;
    if (q.k === 'orbit') return orbitExplain(d.orbit);
    const A = analyse(d), K = kin(d, A);
    const drv = d.parts.findIndex((p) => p.s === d.drive.s && lettered(p));
    let s = cap(nameOf(d, drv)) + ' is driven ' + (d.drive.dir > 0 ? 'clockwise' : 'anticlockwise') + (['speed', 'turns', 'fastest', 'wdist', 'rackd', 'choose'].includes(q.k) ? ' at ' + d.drive.rpm + ' rpm' : '') + '. ';
    if (K.jam) {
      const loop = K.loop || [];
      const names = loop.map((sh) => { const k = d.parts.findIndex((p) => p.s === sh && lettered(p)); return k >= 0 ? labelOf(d, k) : '?'; });
      const meshN = loop.length;
      const odd = loopReversals(d, A, loop) % 2 === 1;
      s += 'The shafts ' + names.join(', ') + ' close a loop. ';
      s += odd
        ? 'Going round it the direction flips ' + (meshN === loopReversals(d, A, loop) ? meshN + ' times' : 'an odd number of times') + ' — an odd number — so each gear in the loop would have to turn both ways at once. Nothing can move: **the train jams**.'
        : 'The directions agree round the loop, but the speeds do not: one shaft would have to turn at two speeds at once. **The train jams.**';
      return s;
    }
    const target = q.k === 'rack' || q.k === 'rackd' ? d.racks[q.r].g : q.k === 'jam' ? null : q.k === 'idler' || q.k === 'choose' ? q.out : q.p;
    if (target == null) {
      return s + 'There is no closed loop that fights itself, so every gear can turn: **it turns**.';
    }
    if (q.k === 'fastest') {
      const list = q.among.map((i) => labelOf(d, i) + ' ' + fracW(F.abs(K.w[d.parts[i].s])) + ' rpm').join(', ');
      return s + 'Working out every speed (speed × teeth is the same on both sides of a mesh): ' + list + '. The fastest is **' + labelOf(d, q.among[solveQ(d).v]) + '**.';
    }
    const steps = pathSteps(d, K, d.parts[target].s);
    const speed = ['speed', 'turns', 'wdist', 'rackd', 'choose'].includes(q.k);
    s += steps.map((st) => stepText(d, K, st, speed)).join(' ');
    const w = K.w[d.parts[target].s];
    if (q.k === 'choose') s += ' That is the **' + fracW(F.abs(w)) + ' rpm** wanted.';
    if (q.k === 'turns') s += ' So for ' + C.plural(q.n || 1, 'turn') + ' of the handle it makes **' + fracW(solveQ(d).v) + '** turns.';
    if (q.k === 'weight') { const p = d.parts[q.p]; const up = F.sign(F.mul(w, [p.side || 1, 1])) < 0; s += ' The rope leaves the ' + ((p.side || 1) > 0 ? 'right' : 'left') + ' side of the drum, which moves ' + (up ? 'up' : 'down') + ' as the drum turns ' + DIRW(w) + ': the weight goes **' + (up ? 'up' : 'down') + '**.'; }
    if (q.k === 'wdist') s += ' Each turn of the drum winds ' + q.circ + ' cm of rope, so ' + C.plural(q.n || 1, 'turn') + ' of the handle lift the weight **' + fracW(solveQ(d).v) + ' cm**.';
    if (q.k === 'rack') { const v = rackV(d, K, d.racks[q.r]); s += ' The teeth of ' + labelOf(d, target) + ' push the rack: it moves **' + rackWord(d.racks[q.r], F.sign(v)) + '**.'; }
    if (q.k === 'rackd') s += ' Every turn of ' + labelOf(d, target) + ' pushes ' + d.parts[target].t + ' rack teeth past, so the rack moves **' + fracW(solveQ(d).v) + ' teeth**.';
    return s;
  }
  function loopReversals(d, A, loop) {
    let n = 0;
    for (let i = 0; i < loop.length; i++) {
      const sa = loop[i], sb = loop[(i + 1) % loop.length];
      const m = A.meshes.find(([a, b]) => (d.parts[a].s === sa && d.parts[b].s === sb) || (d.parts[a].s === sb && d.parts[b].s === sa));
      if (m) { n++; continue; }
      const bl = (d.belts || []).find((b) => (d.parts[b.a].s === sa && d.parts[b.b].s === sb) || (d.parts[b.a].s === sb && d.parts[b.b].s === sa));
      if (bl && bl.x) n++;
    }
    return n;
  }
  function orbitExplain(o) {
    const one = orbitTurns(Object.assign({}, o, { n: 1 })).v, all = orbitTurns(o).v;
    const trips = (o.n || 1) > 1 ? ' for each trip round, so **' + fracW(all) + '** for ' + o.n + ' trips' : '';
    if (o.ring) return 'Rolling round the inside of the ring, the gear passes ' + o.sun + ' ring teeth, which on its own would turn it ' + o.sun + ' ÷ ' + o.planet + ' = ' + fracW(F.fr(o.sun, o.planet)) + ' times — but going once round the centre carries it one turn the *other* way. So it turns ' + fracW(F.fr(o.sun, o.planet)) + ' − 1 = **' + fracW(one) + '** times' + trips + ' (and backwards, against the arm). This is how a Spirograph works.';
    return 'Counting teeth alone, the planet rolls over ' + o.sun + ' teeth, which is ' + o.sun + ' ÷ ' + o.planet + ' = ' + fracW(F.fr(o.sun, o.planet)) + ' of its own turns. But the arm also carries it once round the centre, and that adds one more turn: **' + fracW(one) + '**' + trips + '. It is the *coin rotation paradox*: a coin rolled once round an equal coin turns twice, not once.';
  }

  function askOf(d) {
    const q = d.q, nm = typeof q.p === 'number' ? nameOf(d, q.p) : '';
    switch (q.k) {
      case 'dir': return 'Which way does ' + nm + ' turn?';
      case 'jam': return 'Will the machine turn?';
      case 'speed': return 'How fast does ' + nm + ' turn?';
      case 'turns': return 'How many times does ' + nm + ' turn?';
      case 'weight': return 'Which way does the weight move?';
      case 'wdist': return 'How far does the weight rise?';
      case 'rack': return 'Which way does the rack move?';
      case 'rackd': return 'How many teeth does the rack move along?';
      case 'fastest': return 'Which gear turns fastest?';
      case 'choose': return 'Which will do it?';
      case 'orbit': return 'How many turns does the planet make?';
      default: return '';
    }
  }
  const UNIT = { speed: 'rpm', turns: 'turns', wdist: 'cm', rackd: 'teeth', orbit: 'turns' };

  /* ================= the board ================= */

  function mountTrain(ctx, p) {
    const wb = ctx.wb, d0 = p.data, q = d0.q;
    const uid = M.uid('gr');
    const rootG = ctx.s('g', { class: 'gr' }, wb.layer('board'));
    M.defs(rootG, uid);
    const fill = (mat) => 'url(#' + uid + '-' + mat + ')';
    const scene = ctx.s('g', { class: 'gr-scene' }, rootG);
    const over = ctx.s('g', { class: 'gr-over' }, wb.layer('top'));
    const st = { placed: -1, chosen: -1, answered: false };
    const spots = q.k === 'idler' ? idlerSpots(d0) : null;
    let cur = null, tick = null, turning = false;

    // the frame: the machine, and a tray for a loose gear
    const ex = extent(d0);
    let tray = null;
    if (q.k === 'idler') {
      const sizes = q.ts || [q.t];
      const rr = Math.max(...sizes) * MOD / 2 + MOD;
      const below = (ex.x1 - ex.x0) > (ex.y1 - ex.y0) * 1.25;
      const n = sizes.length;
      const w = below ? n * (2 * rr + 12) + 16 : 2 * rr + 24, h = below ? 2 * rr + 30 : n * (2 * rr + 12) + 30;
      const x = below ? (ex.x0 + ex.x1) / 2 - w / 2 : ex.x1 + 14, y = below ? ex.y1 + 12 : (ex.y0 + ex.y1) / 2 - h / 2;
      tray = { x, y, w, h, items: sizes.map((t, k) => ({ t, x: below ? x + 8 + rr + 6 + k * (2 * rr + 12) : x + w / 2, y: below ? y + 18 + rr : y + 20 + rr + k * (2 * rr + 12) })) };
      ex.x0 = Math.min(ex.x0, x); ex.x1 = Math.max(ex.x1, x + w); ex.y0 = Math.min(ex.y0, y); ex.y1 = Math.max(ex.y1, y + h);
    }
    const pad = 4 + 8 * Math.max(1, Math.min(1.8, Math.max(ex.x1 - ex.x0, ex.y1 - ex.y0) / 280));
    ex.x0 -= pad; ex.y0 -= pad; ex.x1 += pad; ex.y1 += pad;
    wb.setBounds({ x0: ex.x0 - 4, y0: ex.y0 - 4, x1: ex.x1 + 4, y1: ex.y1 + 4 }, 0.04);
    // labels grow with big machines, so they stay readable when the view is fitted
    const LS = Math.max(1, Math.min(1.8, Math.max(ex.x1 - ex.x0, ex.y1 - ex.y0) / 280));

    function currentData() {
      if (q.k === 'idler' && st.placed >= 0) { const s = spots[st.placed]; return withIdler(d0, s.pt, s.t); }
      if (q.k === 'choose' && st.chosen >= 0) return applyOpt(d0, q.opts[st.chosen]);
      return d0;
    }

    /* ---------- building the picture ---------- */

    function build() {
      stopTurn(true);
      const d = currentData(), A = analyse(d), K = kin(d, A), PH = phases(d, A).ph;
      scene.textContent = '';
      const els = { parts: [], belts: [], racks: [], drums: [], arrows: [] };
      const ghost = q.k === 'choose' && st.chosen < 0 ? new Set(q.p) : new Set();
      const S = d.shafts;
      // the back plate
      ctx.s('rect', { x: ex.x0 - 4, y: ex.y0 - 4, width: ex.x1 - ex.x0 + 8, height: ex.y1 - ex.y0 + 8, rx: 10, class: 'gr-plate' }, scene);
      const back = ctx.s('g', { class: 'gr-back' }, scene);
      const zs = [...new Set(d.parts.filter((o) => o.k !== 'w').map((o) => o.z || 0))].sort();
      const planes = {};
      zs.forEach((z, k) => {
        if (k > 0) ctx.s('rect', { x: ex.x0 - 4, y: ex.y0 - 4, width: ex.x1 - ex.x0 + 8, height: ex.y1 - ex.y0 + 8, rx: 10, class: 'gr-depth' }, scene);
        planes[z] = ctx.s('g', { class: 'gr-plane' }, scene);
      });
      // shafts show where nothing covers them
      const drvPart = frontPart(d, d.drive.s);
      d.parts.forEach((o, i) => {
        const c = S[o.s];
        const host = o.k === 'w' ? back : planes[o.z || 0];
        if (ghost.has(i)) {
          const gg = ctx.s('g', { class: 'gr-ghost', transform: 'translate(' + f3(c[0]) + ' ' + f3(c[1]) + ')' }, host);
          ctx.s('circle', { r: f3(R(o)), class: 'gr-ghost-c' }, gg);
          ctx.s('circle', { r: 2.2, class: 'gr-shaft' }, gg);
          els.parts[i] = null;
          return;
        }
        const g = ctx.s('g', { class: 'gr-part' + (o.ix ? ' gr-idler' : ''), 'data-part': i }, host);
        g.innerHTML = partSVG(o, matOf(o, i), fill);
        if (g.firstChild && lettered(o)) g.firstChild.setAttribute('data-key', 'gr-part-' + i);
        if (i === drvPart && d.drive.m !== 'motor') {
          // a crank handle on the driving shaft
          const Lc = Math.max(9, R(o) * 0.72);
          g.insertAdjacentHTML('beforeend', '<path d="M0 0L' + f3(Lc) + ' 0" stroke="#3d4254" stroke-width="3.4" stroke-linecap="round"/><path d="M0 0L' + f3(Lc) + ' 0" stroke="#8f98ab" stroke-width="1.6" stroke-linecap="round"/><circle cx="' + f3(Lc) + '" r="3.3" fill="' + fill('wood') + '" stroke="#6b4518" stroke-width="0.6"/>');
        }
        els.parts[i] = g;
      });
      // belts and chains, in their plane
      (d.belts || []).forEach((b, bi) => {
        const pts = beltLoop(d, b);
        if (!pts || ghost.has(b.a) || ghost.has(b.b)) {
          if (pts) ctx.s('path', { d: polyD(pts, true), class: 'gr-belt-ghost' }, planes[d.parts[b.a].z || 0]);
          els.belts[bi] = null;
          return;
        }
        const host = planes[d.parts[b.a].z || 0], dd = polyD(pts, true);
        const g = ctx.s('g', { class: b.ch ? 'gr-chain' : 'gr-belt' + (b.x ? ' crossed' : '') }, host);
        ctx.s('path', { d: dd, class: 'gr-belt-base' }, g);
        const tex = ctx.s('path', { d: dd, class: 'gr-belt-tex' }, g);
        let tex2 = null;
        if (b.ch) tex2 = ctx.s('path', { d: dd, class: 'gr-chain-roll' }, g);
        els.belts[bi] = { tex, tex2, b };
      });
      // racks
      (d.racks || []).forEach((rk, ri) => {
        const f = rackFrame(d, rk), g0 = d.parts[rk.g];
        const host = planes[g0.z || 0];
        const outer = ctx.s('g', { transform: 'translate(' + f3(f.T[0]) + ' ' + f3(f.T[1]) + ') rotate(' + f3(rk.a + 90) + ')' }, host);
        ctx.s('rect', { x: -f.len / 2 - 7, y: -1.25 * MOD - 3.2 * MOD - 3, width: f.len + 14, height: 3, rx: 1.2, class: 'gr-guide' }, outer);
        const mv = ctx.s('g', { class: 'gr-rack' }, outer);
        mv.innerHTML = rackSVG(rk.n || 6, fill, 'steel');
        const pp = Math.PI * MOD;
        const x0 = ((f.r * (PH[rk.g] - f.psi) - pp / 2) % pp + pp) % pp - pp;
        els.racks[ri] = { mv, x0, rk, f };
      });
      // ropes and weights
      const ropes = ctx.s('g', { class: 'gr-ropes' }, scene);
      d.parts.forEach((o, i) => {
        if (o.k !== 'drum') return;
        const c = S[o.s], x = c[0] + (o.side || 1) * o.r;
        const rope = ctx.s('path', { class: 'gr-rope', d: 'M' + f3(x) + ' ' + f3(c[1]) + 'V' + f3(c[1] + (o.L || 70)) }, ropes);
        const wg = ctx.s('g', { transform: 'translate(' + f3(x) + ' ' + f3(c[1] + (o.L || 70)) + ')', class: 'gr-weight' }, ropes);
        wg.innerHTML = weightSVG(o.w || '', fill);
        els.drums.push({ i, rope, wg, x, y0: c[1], L: o.L || 70 });
      });
      // labels, the driver's arrow, the question mark
      const labels = ctx.s('g', { class: 'gr-labels' }, scene);
      const arrows = ctx.s('g', { class: 'gr-arrows' + (st.answered || turning ? ' on' : '') }, scene);
      const taken = [];
      const sizes = showSizes(d);
      const target = q.k === 'rack' || q.k === 'rackd' ? d.racks[q.r].g : q.k === 'idler' ? q.out : q.k === 'choose' ? q.out : q.p;
      d.parts.forEach((o, i) => {
        const c = S[o.s];
        const a = freeAngle(d, i, taken);
        if (lettered(o) && !ghost.has(i)) {
          const h = hubR(R(o));
          // the badge grows with the machine (so it stays readable) but never beyond the gear's web
          let bs = Math.min(LS, Math.max(1, (R(o) - 2.5) / 6.5));
          let at = c;
          // a part behind a smaller one on the same shaft: its badge sits on the ring that shows
          const front = d.parts.find((f, j) => j !== i && f.s === o.s && f.k !== 'w' && (f.z || 0) > (o.z || 0));
          if (front) {
            const inner = Ro(front), outer = (o.k === 'g' ? R(o) - 2.5 : R(o) - 1);
            const ang2 = (a + 180) * Math.PI / 180;
            if (outer - inner > 6) { bs = Math.min(bs, (outer - inner) / 9.5); at = [c[0] + Math.cos(ang2) * (inner + outer) / 2, c[1] + Math.sin(ang2) * (inner + outer) / 2]; }
            else { bs = Math.min(LS, 1.1); at = M.pt(c, Ro(o) + 6 * bs, a + 150); taken.push(at); }
          }
          const lg = ctx.s('g', { class: 'gr-badge' + (i === target ? ' target' : '') + (front ? ' back' : ''), transform: 'translate(' + f3(at[0]) + ' ' + f3(at[1]) + ') scale(' + f3(bs) + ')' }, labels);
          ctx.s('circle', { r: f3(front ? 4.2 : Math.max(4.4, h / bs + 0.6)) }, lg);
          ctx.s('text', { y: 1.9, text: o.ix ? '' : labelOf(d, i) }, lg);
          if (sizes && !o.ix && front) {
            const txt = o.k === 'p' ? 'Ø' + (2 * o.r) : String(o.t);
            ctx.s('text', { y: 9.4, class: 'gr-size small', text: txt }, lg);
          } else if (sizes && !o.ix) {
            const txt = o.k === 'p' ? 'Ø' + (2 * o.r) : String(o.t);
            ctx.s('text', { y: f3(Math.max(4.4, h / bs + 0.6) + (R(o) < 15 ? 3.9 : 4.9)), class: 'gr-size' + (R(o) < 15 ? ' small' : ''), text: txt }, lg);
          }
        } else if (ghost.has(i)) {
          ctx.s('text', { x: f3(c[0]), y: f3(c[1] + 3.5 * LS), class: 'gr-q', style: 'font-size:' + f3(9 * LS) + 'px', text: '?' }, labels);
        }
        // direction arrows (the driver's always shows)
        const w = K.jam ? null : K.w[o.s];
        if ((lettered(o) || o.k === 'drum') && w && !F.zero(w) && !ghost.has(i)) {
          const arr = M.arcArrow(c, Ro(o) + 3.2 * LS, a - F.sign(w) * 32, F.sign(w) * 64, 3.4 * LS);
          const ag = ctx.s('g', { class: 'gr-arrow' + (i === drvPart ? ' drv' : '') + (i === target ? ' tgt' : ''), 'data-part': i, style: 'stroke-width:' + f3(1.5 * LS) }, i === drvPart ? labels : arrows);
          ctx.s('path', { d: arr.arc, class: 'gr-arrow-arc', style: 'stroke-width:' + f3(1.5 * LS) }, ag);
          ctx.s('path', { d: arr.head, class: 'gr-arrow-head' }, ag);
          els.arrows[i] = ag;
        }
        if (i === drvPart) {
          const pt = M.pt(c, Ro(o) + 11 * LS, a);
          taken.push(pt);
          const txt = (d.drive.m === 'motor' ? 'motor ' : '') + (sizes || q.k === 'wdist' ? d.drive.rpm + ' rpm' : (d.drive.m === 'motor' ? '' : 'turn'));
          if (txt.trim()) pill(labels, pt, txt.trim(), 'drv');
        }
        if (i === target && q.k !== 'rack' && q.k !== 'rackd') {
          ctx.s('circle', { cx: f3(c[0]), cy: f3(c[1]), r: f3(Ro(o) + 2.2), class: 'gr-target' }, labels);
          if (i !== drvPart) { const pt = M.pt(c, Ro(o) + 10 * LS, a); taken.push(pt); pill(labels, pt, q.k === 'idler' ? (q.want > 0 ? 'wants ↻' : 'wants ↺') : '?', 'tgt'); }
        }
      });
      (d.racks || []).forEach((rk, ri) => {
        const f = rackFrame(d, rk);
        const pt = [f.T[0] + f.n[0] * (10 + 7 * LS) + f.e[0] * (f.len / 2 - 4), f.T[1] + f.n[1] * (10 + 7 * LS) + f.e[1] * (f.len / 2 - 4)];
        pill(labels, pt, q.r === ri && (q.k === 'rack' || q.k === 'rackd') ? 'rack ?' : 'rack', q.r === ri ? 'tgt' : '');
      });
      // the tray with the loose gear
      if (tray) {
        ctx.s('rect', { x: tray.x, y: tray.y, width: tray.w, height: tray.h, rx: 8, class: 'gr-tray' }, scene);
        ctx.s('text', { x: tray.x + tray.w / 2, y: tray.y + 11, class: 'gr-tray-t', text: 'loose gear' }, scene);
        tray.items.forEach((it, k) => {
          if (st.placed >= 0 && spots[st.placed].t === it.t) return;
          const g = ctx.s('g', { class: 'gr-part gr-idler gr-loose', transform: 'translate(' + f3(it.x) + ' ' + f3(it.y) + ')', 'data-tray': k }, scene);
          g.innerHTML = partSVG({ k: 'g', t: it.t }, 'brass', fill);
          ctx.s('text', { x: f3(it.x), y: f3(it.y + 1.9), class: 'gr-size', text: String(it.t) }, scene);
        });
      }
      cur = { d, A, K, PH, els, drvPart, target };
      pose(0);
    }
    function pill(parent, pt, text, cls) {
      const w = Math.max(9, text.length * 3.4 + 5);
      const g = ctx.s('g', { class: 'gr-pill ' + (cls || ''), transform: 'translate(' + f3(pt[0]) + ' ' + f3(pt[1]) + ') scale(' + f3(LS) + ')' }, parent);
      ctx.s('rect', { x: f3(-w / 2), y: -4.6, width: f3(w), height: 9.2, rx: 4.6 }, g);
      ctx.s('text', { y: 2.1, text }, g);
      return g;
    }

    /* ---------- motion ---------- */

    // k = shaft turns per rpm of speed (seconds × speed factor)
    function pose(k) {
      const { d, K, PH, els } = cur;
      const turnsOf = (s) => { const w = K.jam ? null : K.w[s]; return w ? F.num(w) * k : 0; };
      d.parts.forEach((o, i) => {
        const el = els.parts[i];
        if (!el) return;
        const c = d.shafts[o.s];
        el.setAttribute('transform', 'translate(' + f3(c[0]) + ' ' + f3(c[1]) + ') rotate(' + f3((PH[i] + 2 * Math.PI * turnsOf(o.s)) * 180 / Math.PI) + ')');
      });
      els.belts.forEach((B) => {
        if (!B) return;
        const pa = d.parts[B.b.a];
        const off = R(pa) * 2 * Math.PI * turnsOf(pa.s);
        B.tex.style.strokeDashoffset = f3(off);
        if (B.tex2) B.tex2.style.strokeDashoffset = f3(off);
      });
      els.racks.forEach((E) => {
        const g = d.parts[E.rk.g];
        E.mv.setAttribute('transform', 'translate(' + f3(E.x0 + R(g) * 2 * Math.PI * turnsOf(g.s)) + ' 0)');
      });
      els.drums.forEach((E) => {
        const o = d.parts[E.i];
        const dy = (o.side || 1) * o.r * 2 * Math.PI * turnsOf(o.s);
        E.rope.setAttribute('d', 'M' + f3(E.x) + ' ' + f3(E.y0) + 'V' + f3(E.y0 + E.L + dy));
        E.wg.setAttribute('transform', 'translate(' + f3(E.x) + ' ' + f3(E.y0 + E.L + dy) + ')');
      });
    }
    function stopTurn(quiet) {
      if (tick) { tick.stop(); tick = null; }
      turning = false;
      if (!quiet) syncBtn();
      over.querySelectorAll('.gr-jamstamp').forEach((e) => e.remove());
    }
    function startTurn() {
      stopTurn(true);
      const { d, K } = cur;
      turning = true;
      scene.querySelector('.gr-arrows').classList.add('on');
      syncBtn();
      if (K.jam) { jamShow(); return; }
      const wd = Math.abs(F.num(K.w[d.drive.s]));
      let wmax = wd;
      K.driven.forEach((s) => { wmax = Math.max(wmax, Math.abs(F.num(K.w[s]))); });
      const kap = Math.min(0.22 / wd, 1.0 / wmax);
      let tEnd = Infinity;
      (d.racks || []).forEach((rk) => {
        const g = d.parts[rk.g], w = K.w[g.s];
        if (!w || F.zero(w)) return;
        const v = R(g) * 2 * Math.PI * Math.abs(F.num(w)) * kap;
        tEnd = Math.min(tEnd, (rackFrame(d, rk).len / 4) / v);
      });
      d.parts.forEach((o) => {
        if (o.k !== 'drum') return;
        const w = K.w[o.s];
        if (!w || F.zero(w)) return;
        const v = o.r * 2 * Math.PI * Math.abs(F.num(w)) * kap;
        const up = F.sign(w) * (o.side || 1) < 0;
        tEnd = Math.min(tEnd, (up ? (o.L || 70) - 22 : 40) / v);
      });
      const finite = isFinite(tEnd);
      tick = M.ticker((t) => {
        const tt = finite ? Math.min(t, tEnd) : t;
        pose(tt * kap);
        if (finite && t >= tEnd) { turning = false; tick = null; syncBtn(); return false; }
        return true;
      });
    }
    // the train jams: the handle judders and the loop glows red
    function jamShow() {
      const { d, K } = cur;
      const loop = new Set(K.loop || []);
      const parts = d.parts.map((o, i) => i).filter((i) => loop.has(d.parts[i].s));
      parts.forEach((i) => cur.els.parts[i] && cur.els.parts[i].classList.add('gr-jam'));
      const cs = (K.loop || []).map((s) => d.shafts[s]);
      const cx = cs.reduce((a, c) => a + c[0], 0) / Math.max(1, cs.length), cy = cs.reduce((a, c) => a + c[1], 0) / Math.max(1, cs.length);
      const stamp = ctx.s('g', { class: 'gr-jamstamp', transform: 'translate(' + f3(cx) + ' ' + f3(cy) + ')' }, over);
      ctx.s('rect', { x: -19, y: -7, width: 38, height: 14, rx: 3 }, stamp);
      ctx.s('text', { y: 3.4, text: 'JAMMED' }, stamp);
      ctx.sfx('wrong');
      const el = cur.els.parts[cur.drvPart], c = d.shafts[d.parts[cur.drvPart].s], ph = cur.PH[cur.drvPart];
      tick = M.ticker((t) => {
        const a = ph + 0.05 * Math.sin(t * 38) * Math.exp(-t * 2.2) * d.drive.dir;
        if (el) el.setAttribute('transform', 'translate(' + f3(c[0]) + ' ' + f3(c[1]) + ') rotate(' + f3(a * 180 / Math.PI) + ')');
        if (t > 1.6) { turning = false; tick = null; syncBtn(); return false; }
        return true;
      });
    }

    /* ---------- the panel ---------- */

    const turnBtn = ctx.button('Turn it', () => { if (turning) stopTurn(); else startTurn(); }, 'small');
    function syncBtn() {
      const may = st.answered || q.k === 'idler' || ctx.isRevealed();
      turnBtn.hidden = !may;
      turnBtn.textContent = turning ? 'Stop' : (d0.drive.m === 'motor' ? 'Start the motor' : 'Turn the handle');
    }
    let box = null;
    const kind = q.k === 'idler' ? null : ['speed', 'turns', 'wdist', 'rackd'].includes(q.k) ? 'number' : 'choice';
    const answer = solveQ(d0);
    if (kind) {
      box = ctx.answer({
        kind,
        choices: kind === 'choice' ? choicesOf(d0) : null,
        unit: UNIT[q.k],
        label: askOf(d0),
        placeholder: 'e.g. 45 or 45/2',
        check: (v) => checkAns(v)
      });
    }
    function right() {
      st.answered = true;
      if (q.k === 'choose') { st.chosen = answer.v; build(); }
      scene.querySelector('.gr-arrows').classList.add('on');
      setTimeout(() => startTurn(), C.anim(250));
    }
    function checkAns(v) {
      if (kind === 'number') {
        const x = M.readNum(v);
        if (isNaN(x)) return { ok: false, msg: 'That does not look like a number. Fractions like 45/2 are fine.' };
        if (M.matches(x, answer.v)) { right(); return { ok: true, msg: 'Yes: **' + M.fracText(answer.v) + ' ' + UNIT[q.k] + '**.' }; }
        if (q.k === 'speed') {
          const inv = F.div(F.fr(d0.drive.rpm * d0.drive.rpm, 1), answer.v);
          if (M.matches(x, inv)) return { ok: false, msg: 'That is the ratio turned upside down. The gear with *fewer* teeth turns *faster*.' };
        }
        if (Math.abs(x - F.num(answer.v)) < 0.1 * F.num(answer.v)) return { ok: false, msg: 'Close, but not exact.' };
        return { ok: false, msg: x > F.num(answer.v) ? 'Too fast.' : 'Too slow.' };
      }
      if (v === answer.v) { right(); return { ok: true, msg: 'Yes: **' + choicesOf(d0)[v] + '**.' }; }
      if (q.k === 'choose') {
        const r = chooseCheck(d0).res[v];
        return { ok: false, msg: r && r.w ? 'With those, ' + nameOf(d0, q.out) + ' turns at ' + fracW(r.w) + ' rpm.' : 'Those do not fit.' };
      }
      const K = kin(d0, analyse(d0));
      if (q.k === 'jam' || (K.jam && v !== 2)) return { ok: false, msg: K.jam ? 'Look for a closed loop of gears, and count them.' : 'Is there a loop? And if there is, does it fight itself?' };
      if ((q.k === 'dir' || q.k === 'weight' || q.k === 'rack') && v === 2) return { ok: false, msg: 'It does move — nothing here locks the train.' };
      if (q.k === 'fastest') return { ok: false, msg: 'Not the fastest. The fewer teeth a gear has, the faster it must spin to keep up.' };
      return { ok: false, msg: 'Count again: every mesh (and every crossed belt) flips the direction.' };
    }

    /* ---------- dragging the loose gear ---------- */

    let drag = null;
    if (q.k === 'idler') {
      ctx.setGoal('Make ' + nameOf(d0, q.out) + ' turn **' + (q.want > 0 ? 'clockwise ↻' : 'anticlockwise ↺') + '**.');
      wb.handlers.board = {
        down(pt) {
          // the gear in the tray, or the one already placed
          let t = null, from = null;
          if (st.placed >= 0 && dist(pt, spots[st.placed].pt) < spots[st.placed].t * MOD / 2 + 2) { t = spots[st.placed].t; from = spots[st.placed].pt; }
          else tray.items.forEach((it) => { if (dist(pt, [it.x, it.y]) < it.t * MOD / 2 + 3 && !(st.placed >= 0 && spots[st.placed].t === it.t)) { t = it.t; from = [it.x, it.y]; } });
          if (t == null) return false;
          const was = st.placed;
          if (was >= 0 && spots[was].t === t) { st.placed = -1; build(); }
          scene.querySelectorAll('.gr-loose').forEach((e) => { if (Math.abs(e.getBBox().width / 2 - (t * MOD / 2 + MOD)) < 1) e.style.opacity = 0.25; });
          drag = { t, off: [pt[0] - from[0], pt[1] - from[1]], was, snap: -1, g: ctx.s('g', { class: 'gr-dragging' }, over) };
          drag.g.innerHTML = partSVG({ k: 'g', t }, 'brass', fill);
          moveDrag(pt);
          return true;
        },
        move(pt) { if (drag) moveDrag(pt); },
        up() {
          if (!drag) return;
          const sn = drag.snap;
          drag.g.remove();
          over.querySelectorAll('.gr-spot').forEach((e) => e.remove());
          drag = null;
          if (sn >= 0) {
            st.placed = sn;
            ctx.sfx('snap');
            build();
            ctx.move();
            ctx.changed('place');
            const s = spots[sn];
            ctx.say(s.jam ? 'It meshes with ' + s.meshWith.length + ' gears at once…' : 'It meshes with ' + s.meshWith.map((i) => labelOf(d0, i)).join(' and ') + '.');
          } else {
            build();
            ctx.say('The loose gear has to mesh with two gears at once — drop it where it snaps into place.', 'warn');
            if (st.placed !== -1) ctx.changed('place');
          }
        }
      };
    }
    function moveDrag(pt) {
      const p0 = [pt[0] - drag.off[0], pt[1] - drag.off[1]];
      let best = -1, bd = drag.t * MOD / 2 * 0.9 + wb.px(10);
      spots.forEach((s, k) => { if (s.t !== drag.t) return; const dd = dist(p0, s.pt); if (dd < bd) { bd = dd; best = k; } });
      drag.snap = best;
      const at = best >= 0 ? spots[best].pt : p0;
      drag.g.setAttribute('transform', 'translate(' + f3(at[0]) + ' ' + f3(at[1]) + ')');
      drag.g.classList.toggle('snapped', best >= 0);
      over.querySelectorAll('.gr-spot').forEach((e) => e.remove());
      spots.forEach((s, k) => { if (s.t === drag.t && k !== best) ctx.s('circle', { cx: f3(s.pt[0]), cy: f3(s.pt[1]), r: 2.4, class: 'gr-spot' }, over); });
    }

    /* ---------- hints ---------- */

    function flashArrows(list) {
      list.forEach((i) => { const a = cur.els.arrows[i]; if (a) a.classList.add('hint'); });
      setTimeout(() => list.forEach((i) => { const a = cur.els.arrows[i]; if (a) a.classList.remove('hint'); }), 6000);
    }
    function speedTags(shafts) {
      const g = ctx.s('g', { class: 'gr-hinttags' }, over);
      shafts.forEach((s) => {
        const i = cur.d.parts.findIndex((o) => o.s === s && lettered(o));
        if (i < 0) return;
        const c = cur.d.shafts[s];
        pill(g, [c[0], c[1] - Ro(cur.d.parts[i]) - 9], fracW(F.abs(cur.K.w[s])) + ' rpm', 'hint');
      });
      setTimeout(() => g.remove(), 8000);
    }

    build();
    syncBtn();
    if (q.k === 'jam') ctx.setGoal('Decide whether the machine can turn at all.');

    return {
      noMoves: q.k !== 'idler',
      check() {
        if (q.k !== 'idler') return { solved: false };
        if (st.placed < 0) return { solved: false, msg: 'Drag the loose gear from the tray into the machine.' };
        const s = spots[st.placed];
        if (s.ok) { if (!turning) setTimeout(() => startTurn(), C.anim(200)); return { solved: true, msg: cap(nameOf(d0, q.out)) + ' now turns ' + (q.want > 0 ? 'clockwise' : 'anticlockwise') + '.' }; }
        if (s.jam) return { solved: false, msg: 'Now some gears form a loop that fights itself — it jams.' };
        return { solved: false, msg: cap(nameOf(d0, q.out)) + ' turns the wrong way from there.' };
      },
      hint(n) {
        const d = cur.d, K = cur.K;
        if (q.k === 'idler') {
          if (n === 0) return 'The loose gear must touch two gears at once. Of the gears it could bridge to, which turn the right way for ' + labelOf(d0, q.out) + '? Remember an idler does not change the direction between the two it joins… it flips it twice.';
          if (n === 1) return { text: 'Every place it can go is marked. Try one and press the button to turn the machine.', show() { spots.forEach((s) => ctx.s('circle', { cx: f3(s.pt[0]), cy: f3(s.pt[1]), r: f3(s.t * MOD / 2), class: 'gr-spot-hint' }, over)); setTimeout(() => over.querySelectorAll('.gr-spot-hint').forEach((e) => e.remove()), 7000); } };
          if (n === 2) { const g = spots.find((s) => s.ok); return { text: 'It works when it bridges ' + g.meshWith.map((i) => labelOf(d0, i)).join(' and ') + '.', show() { ctx.s('circle', { cx: f3(g.pt[0]), cy: f3(g.pt[1]), r: f3(g.t * MOD / 2), class: 'gr-spot-hint good' }, over); setTimeout(() => over.querySelectorAll('.gr-spot-hint').forEach((e) => e.remove()), 7000); } }; }
          return null;
        }
        if (q.k === 'orbit') return null;
        if (q.k === 'choose') {
          if (n === 0) return 'Work out the speed of the shaft just before the gap, then the ratio the gap must make: wanted speed ÷ that speed.';
          return null;
        }
        const tgt = cur.target;
        const tShaft = tgt != null ? d.parts[tgt].s : null;
        const path = tShaft != null && !K.jam ? pathSteps(d, K, tShaft).map((s) => s.s) : [];
        const speedQ = ['speed', 'turns', 'wdist', 'rackd', 'fastest'].includes(q.k);
        if (n === 0) {
          if (q.k === 'jam') return 'Look for a closed loop — gears that go round in a ring back to where they started. Each mesh flips the direction; what happens if a ring has an odd number of gears?';
          if (speedQ) return 'Where two gears mesh, their teeth pass at the same rate: speed × teeth is the same for both. A belt does the same with the sizes of the pulleys. Gears on one shaft share its speed.';
          return 'Each time two gears mesh the direction flips. A belt keeps the direction — unless it is crossed — and a chain keeps it too. Gears on the same shaft turn together.';
        }
        if (n === 1) {
          if (q.k === 'jam') {
            if (!K.jam) return 'Check each loop: does the direction come back the same when you go round it?';
            const loop = new Set(K.loop);
            return { text: 'Here is a loop (glowing). Count the reversals round it.', show() { d.parts.forEach((o, i) => { if (loop.has(o.s) && cur.els.parts[i]) { cur.els.parts[i].classList.add('gr-hintglow'); setTimeout(() => cur.els.parts[i] && cur.els.parts[i].classList.remove('gr-hintglow'), 6000); } }); } };
          }
          if (K.jam) return 'Before following the train, look for a loop of gears that goes round and meets itself.';
          const half = path.slice(0, Math.max(1, Math.floor(path.length / 2)));
          if (speedQ) return { text: 'The first few speeds are shown over the gears.', show() { speedTags([d.drive.s].concat(half)); } };
          const partsOn = d.parts.map((o, i) => i).filter((i) => half.includes(d.parts[i].s));
          return { text: 'The first few directions are marked.', show() { flashArrows(partsOn); } };
        }
        if (n === 2 && !K.jam && path.length > 1) {
          const prev = path.slice(0, -1);
          if (speedQ) return { text: 'Every speed up to the last step is shown.', show() { speedTags([d.drive.s].concat(prev)); } };
          const partsOn = d.parts.map((o, i) => i).filter((i) => prev.includes(d.parts[i].s));
          return { text: 'Every direction up to the last step is marked.', show() { flashArrows(partsOn); } };
        }
        return null;
      },
      solve() {
        if (q.k === 'idler') {
          st.placed = spots.findIndex((s) => s.ok);
          build();
          ctx.changed('solve');
          return;
        }
        st.answered = true;
        if (box) box.feedback('The answer: <b>' + C.esc(kind === 'number' ? M.fracText(answer.v) + ' ' + UNIT[q.k] : choicesOf(d0)[answer.v]) + '</b>', 'good');
        if (q.k === 'choose') { st.chosen = answer.v; build(); }
        syncBtn();
        setTimeout(() => startTurn(), C.anim(300));
      },
      explain() {
        if (q.k === 'idler') {
          const s = st.placed >= 0 && spots[st.placed].ok ? spots[st.placed] : spots.find((x) => x.ok);
          return explainOf(withIdler(d0, s.pt, s.t)) + ' ' + idlerExplain(d0, spots);
        }
        return explainOf(q.k === 'choose' ? applyOpt(d0, q.opts[answer.v]) : d0);
      },
      getState() { return { placed: st.placed, chosen: st.chosen }; },
      setState(s) { st.placed = s && s.placed != null ? s.placed : -1; st.chosen = s && s.chosen != null ? s.chosen : -1; build(); syncBtn(); },
      destroy() { stopTurn(true); wb.handlers.board = null; }
    };
  }
  function frontPart(d, s) {
    let best = -1;
    d.parts.forEach((o, i) => { if (o.s === s && o.k !== 'w' && (best < 0 || (o.z || 0) > (d.parts[best].z || 0))) best = i; });
    return best;
  }
  /* ---------- a gear carried round another by an arm ---------- */

  function orbitGeo(o) {
    const Rs = o.sun * MOD / 2, Rp = o.planet * MOD / 2;
    return { Rs, Rp, arm: o.ring ? Rs - Rp : Rs + Rp, th0: o.ring ? 0 : Math.PI - Math.PI / o.planet, k: o.ring ? -(o.sun / o.planet - 1) : 1 + o.sun / o.planet };
  }
  function ringSVG(t, fill) {
    const Rr = t * MOD / 2, out = Rr + 1.25 * MOD + 6;
    const d = 'M' + out + ' 0A' + out + ' ' + out + ' 0 1 1 ' + (-out) + ' 0A' + out + ' ' + out + ' 0 1 1 ' + out + ' 0Z' + gearOutline(t, true);
    return '<path d="' + d + '" fill="' + fill('steel') + '" fill-rule="evenodd" stroke="' + M.edge('steel') + '" stroke-width="0.6"/>' +
      [0, 1, 2, 3, 4, 5].map((k) => { const a = k * Math.PI / 3 + 0.5, rr = out - 3; return '<circle cx="' + f3(rr * Math.cos(a)) + '" cy="' + f3(rr * Math.sin(a)) + '" r="1.3" fill="#2b2f3d"/>'; }).join('');
  }
  function mountOrbit(ctx, p) {
    const wb = ctx.wb, o = p.data.orbit, geo = orbitGeo(o);
    const uid = M.uid('gr');
    const rootG = ctx.s('g', { class: 'gr' }, wb.layer('board'));
    M.defs(rootG, uid);
    const fill = (mat) => 'url(#' + uid + '-' + mat + ')';
    const ext = o.ring ? geo.Rs + 1.25 * MOD + 8 : geo.Rs + 2 * geo.Rp + 15;
    wb.setBounds({ x0: -ext - 6, y0: -ext - 6, x1: ext + 6, y1: ext + 22 }, 0.05);
    ctx.s('rect', { x: -ext - 4, y: -ext - 4, width: 2 * ext + 8, height: 2 * ext + 26, rx: 10, class: 'gr-plate' }, rootG);
    const trail = ctx.s('path', { class: 'gr-trail' }, rootG);
    const fixed = ctx.s('g', { class: 'gr-part' }, rootG);
    if (o.ring) fixed.innerHTML = ringSVG(o.sun, fill);
    else {
      fixed.innerHTML = partSVG({ k: 'g', t: o.sun }, 'steel', fill) + [0, 1, 2].map((k) => { const a = k * 2 * Math.PI / 3 - Math.PI / 2, rr = hubR(geo.Rs) + 2.8; return '<circle cx="' + f3(rr * Math.cos(a)) + '" cy="' + f3(rr * Math.sin(a)) + '" r="1.1" fill="#2b2f3d"/>'; }).join('');
    }
    ctx.s('text', { x: 0, y: ext + 6, class: 'gr-orbit-lbl small', text: (o.ring ? 'ring gear, ' : 'fixed gear, ') + o.sun + ' teeth' }, rootG);
    const arm = ctx.s('g', { class: 'gr-arm' }, rootG);
    arm.innerHTML = '<path d="M0 0L' + f3(geo.arm) + ' 0" stroke="#3d4254" stroke-width="5" stroke-linecap="round"/><path d="M0 0L' + f3(geo.arm) + ' 0" stroke="' + M.MATS.wood[1] + '" stroke-width="3" stroke-linecap="round"/><circle r="2.6" fill="#2b2f3d"/>';
    const planet = ctx.s('g', { class: 'gr-part' }, rootG);
    const mark = -geo.th0 - Math.PI / 2;
    const tipR = geo.Rp * 0.78;
    planet.innerHTML = partSVG({ k: 'g', t: o.planet }, 'brass', fill) +
      '<path d="M0 0L' + f3(tipR * Math.cos(mark)) + ' ' + f3(tipR * Math.sin(mark)) + '" stroke="#e0443e" stroke-width="1.8" stroke-linecap="round"/>' +
      '<circle cx="' + f3(tipR * Math.cos(mark)) + '" cy="' + f3(tipR * Math.sin(mark)) + '" r="1.6" fill="#e0443e"/>';
    const plbl = ctx.s('text', { class: 'gr-orbit-lbl small', text: o.planet + ' teeth' }, rootG);
    const counter = ctx.s('text', { x: 0, y: ext + 15, class: 'gr-counter', text: '' }, rootG);
    let tick = null, done = false, pts = [];
    function pose(phi) {
      const c = [geo.arm * Math.cos(phi), geo.arm * Math.sin(phi)];
      arm.setAttribute('transform', 'rotate(' + f3(phi * 180 / Math.PI) + ')');
      const th = geo.th0 + geo.k * phi;
      planet.setAttribute('transform', 'translate(' + f3(c[0]) + ' ' + f3(c[1]) + ') rotate(' + f3(th * 180 / Math.PI) + ')');
      const out = o.ring ? -1 : 1, lr = geo.arm + out * (geo.Rp + MOD + 7);
      plbl.setAttribute('x', f3(lr * Math.cos(phi))); plbl.setAttribute('y', f3(lr * Math.sin(phi) + 2));
      const tip = [c[0] + tipR * Math.cos(th + mark), c[1] + tipR * Math.sin(th + mark)];
      return tip;
    }
    function run() {
      if (tick) tick.stop();
      const trips = o.n || 1, T = 5 * trips, NP = 240 * trips;
      // the whole path of the red mark (an epicycloid, or a hypocycloid inside a ring)
      pts = [];
      for (let k = 0; k <= NP; k++) pts.push(pose(-Math.PI / 2 + 2 * Math.PI * trips * k / NP));
      tick = M.ticker((t) => {
        const u = Math.min(1, t / T), phi = -Math.PI / 2 + 2 * Math.PI * trips * u;
        pose(phi);
        trail.setAttribute('d', polyD(pts.slice(0, Math.max(2, Math.round(u * NP) + 1)), false));
        const turns = Math.abs(geo.k * 2 * Math.PI * trips * u) / (2 * Math.PI);
        counter.textContent = 'arm ' + (trips * u).toFixed(2) + ' turns  ·  small gear ' + turns.toFixed(2) + ' turns' + (geo.k < 0 ? ' (backwards)' : '');
        if (u >= 1) { tick = null; done = true; btn.textContent = 'Go round again'; return false; }
        return true;
      });
    }
    pose(-Math.PI / 2);
    const ans = orbitTurns(o).v;
    const box = ctx.answer({
      kind: 'number', unit: 'turns', label: askOf(p.data), placeholder: 'e.g. 3 or 5/2',
      check(v) {
        const x = M.readNum(v);
        if (isNaN(x)) return { ok: false, msg: 'That does not look like a number.' };
        if (M.matches(x, ans)) { setTimeout(run, C.anim(200)); btn.hidden = false; return { ok: true, msg: 'Yes: **' + M.fracText(ans) + '** turns.' }; }
        const teeth = F.mul(F.fr(o.sun, o.planet), [o.n || 1, 1]);
        if (M.matches(x, teeth)) return { ok: false, msg: 'That counts the teeth it rolls over — but the trip round the centre ' + (o.ring ? 'takes away' : 'adds') + ' a turn of its own' + ((o.n || 1) > 1 ? ' each time' : '') + '.' };
        return { ok: false, msg: 'Not that many. Watch the red mark in your mind as the arm goes round.' };
      }
    });
    const btn = ctx.button('Go round', () => run(), 'small');
    btn.hidden = true;
    return {
      noMoves: true,
      hint(n) {
        if (n === 0) return 'Count the teeth it rolls over first: ' + o.sun + ' of the fixed gear\'s teeth pass ' + o.planet + ' of its own each turn.';
        if (n === 1) return 'Now imagine the small gear glued to the big one so it cannot roll at all. Carried once round by the arm, does it still turn? (Watch which way its mark points.)';
        return null;
      },
      solve() { box.feedback('The answer: <b>' + M.fracText(ans) + ' turns</b>', 'good'); btn.hidden = false; setTimeout(run, C.anim(250)); },
      explain() { return orbitExplain(o); },
      destroy() { if (tick) tick.stop(); }
    };
  }

  /* ================= making machines ================= */

  const TEETH = [10, 12, 14, 15, 16, 18, 20, 24, 25, 28, 30, 32, 36, 40, 45, 48];
  const EASY_T = [10, 12, 15, 20, 24, 30, 36, 40, 45, 48];
  const PULLEY_R = [8, 10, 12, 15, 16, 20, 24, 25, 30];
  const SPROCKET_T = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48];
  const RPMS = [10, 12, 15, 20, 24, 30, 36, 40, 45, 48, 60, 72, 90, 120];
  const rnd = (v) => Math.round(v * 1000) / 1000;

  function boxOK(d, W, H) { const e = extent(d); return e.x1 - e.x0 <= W && e.y1 - e.y0 <= H; }
  function snap(d) { return [d.shafts.length, d.parts.length, d.belts.length, d.racks.length]; }
  function undo(d, s) { d.shafts.length = s[0]; d.parts.length = s[1]; d.belts.length = s[2]; d.racks.length = s[3]; }
  function valid(d, W, H) { return analyse(d).errs.length === 0 && boxOK(d, W, H); }
  const needKind = (c) => (c === 'mesh' ? 'g' : c === 'chain' ? 'sp' : 'p');
  function sizeOf(rng, k, pool) { return k === 'g' ? rng.pick(pool || TEETH) : k === 'sp' ? rng.pick(SPROCKET_T) : rng.pick(PULLEY_R); }
  function mkPart(k, s, size, z) { return k === 'p' ? { k, s, r: size, z } : { k, s, t: size, z }; }
  const partsOnShaft = (d, s) => d.parts.filter((o) => o.s === s && o.k !== 'w');

  // a random train: spec { n, belt, cross, chain, comp, branch, W, H, pool }
  function grow(rng, spec) {
    const d = { shafts: [[0, 0]], parts: [], belts: [], racks: [], drive: { s: 0, dir: rng() < 0.55 ? 1 : -1, rpm: rng.pick(RPMS), m: rng() < 0.5 ? 'crank' : 'motor' } };
    const conns = [];
    for (let i = 0; i < spec.n; i++) {
      const u = rng();
      conns.push(u < (spec.chain || 0) ? 'chain' : u < (spec.chain || 0) + (spec.cross || 0) ? 'cross' : u < (spec.chain || 0) + (spec.cross || 0) + (spec.belt || 0) ? 'belt' : 'mesh');
    }
    const k0 = needKind(conns[0]);
    d.parts.push(mkPart(k0, 0, sizeOf(rng, k0, spec.pool), 0));
    let tip = 0, heading = rng.range(-40, 40);
    for (let ci = 0; ci < conns.length; ci++) {
      const c = conns[ci], need = needKind(c);
      let placed = false;
      for (let attempt = 0; attempt < 30 && !placed; attempt++) {
        const s0 = snap(d);
        let base = tip;
        if (spec.branch && rng() < spec.branch && d.parts.length > 2) base = rng.int(d.parts.length);
        if (d.parts[base].k === 'w' || d.parts[base].k === 'drum') continue;
        const bz = d.parts[base].z || 0;
        const wantComp = d.parts[base].k !== need || (spec.comp && rng() < spec.comp && ci > 0);
        if (wantComp) {
          if (partsOnShaft(d, d.parts[base].s).length > 1) continue;
          // the part in front must be the smaller one, so both can be seen
          const Bp = d.parts[base];
          let size = null;
          for (let k = 0; k < 12 && size == null; k++) {
            const sz = sizeOf(rng, need, spec.pool), np = mkPart(need, 0, sz, 0);
            if (bz === 0 ? Ro(np) < R(Bp) - 3.5 : R(np) > Ro(Bp) + 3.5) size = sz;
          }
          if (size == null) continue;
          d.parts.push(mkPart(need, Bp.s, size, 1 - bz));
          base = d.parts.length - 1;
        }
        const B = d.parts[base], cb = d.shafts[B.s], z = B.z || 0;
        const size = sizeOf(rng, need, spec.pool);
        const np = mkPart(need, d.shafts.length, size, z);
        const th = (heading + rng.range(-75, 75)) * Math.PI / 180;
        const D = c === 'mesh' ? R(B) + R(np) : R(B) + R(np) + rng.range(22, 60);
        d.shafts.push([rnd(cb[0] + D * Math.cos(th)), rnd(cb[1] + D * Math.sin(th))]);
        d.parts.push(np);
        if (c !== 'mesh') d.belts.push({ a: base, b: d.parts.length - 1, x: c === 'cross' ? 1 : 0, ch: c === 'chain' ? 1 : 0 });
        // no accidental meshes: the new gear may touch only its partner
        const A = analyse(d);
        const nI = d.parts.length - 1;
        const extra = A.meshes.filter((m) => (m[0] === nI || m[1] === nI) && !(c === 'mesh' && (m[0] === base || m[1] === base)));
        if (A.errs.length || extra.length || !boxOK(d, spec.W, spec.H)) { undo(d, s0); continue; }
        placed = true;
        tip = nI;
        heading = Math.max(-80, Math.min(80, heading + rng.range(-30, 30)));
      }
      if (!placed) return null;
    }
    const drv = frontPart(d, 0);
    if (d.drive.m === 'crank' && d.parts[drv].k !== 'g' && d.parts[drv].k !== 'p' && d.parts[drv].k !== 'sp') d.drive.m = 'motor';
    d.tip = tip;
    return d;
  }

  // close a loop with one more gear meshing two gears already there; want: 'jam' | 'turn' | null
  function addLoop(rng, d, want, W, H) {
    const gs = d.parts.map((o, i) => i).filter((i) => d.parts[i].k === 'g');
    for (let tries = 0; tries < 80; tries++) {
      const a = rng.pick(gs), b = rng.pick(gs);
      if (a === b || d.parts[a].s === d.parts[b].s || (d.parts[a].z || 0) !== (d.parts[b].z || 0)) continue;
      const t = rng.pick(TEETH);
      const fake = Object.assign({}, d, { q: { t, z: d.parts[a].z || 0, out: a, want: 1 } });
      const r = t * MOD / 2, A = d.parts[a], B = d.parts[b], ca = d.shafts[A.s], cb = d.shafts[B.s];
      const ra = R(A) + r, rb = R(B) + r, D = dist(ca, cb);
      if (D > ra + rb - 0.5 || D < Math.abs(ra - rb) + 0.5) continue;
      const x = (D * D + ra * ra - rb * rb) / (2 * D), h = Math.sqrt(ra * ra - x * x);
      const ux = (cb[0] - ca[0]) / D, uy = (cb[1] - ca[1]) / D, sg = rng() < 0.5 ? 1 : -1;
      const pt = [rnd(ca[0] + ux * x - uy * h * sg), rnd(ca[1] + uy * x + ux * h * sg)];
      const d2 = withIdler(fake, pt, t);
      d2.parts[d2.parts.length - 1] = { k: 'g', s: d2.shafts.length - 1, t, z: d.parts[a].z || 0 };
      delete d2.q;
      const A2 = analyse(d2);
      if (A2.errs.length || !boxOK(d2, W, H)) continue;
      if (phases(d2, A2).worst > 0.07) continue;
      const K2 = kin(d2, A2);
      if (want === 'jam' && !K2.jam) continue;
      if (want === 'turn' && K2.jam) continue;
      d.shafts = d2.shafts; d.parts = d2.parts;
      return true;
    }
    return false;
  }

  function deepest(d, K, filter) {
    let best = -1, bd = -1;
    d.parts.forEach((o, i) => { if (!(filter || lettered)(o) || K.w[o.s] == null) return; const dp = K.depth[o.s] * 10 + (o.z || 0); if (dp > bd) { bd = dp; best = i; } });
    return best;
  }
  const lvlSpec = {
    dir: [null, { n: [2, 3] }, { n: [4, 5], belt: 0.15, cross: 0.1 }, { n: [6, 7], belt: 0.15, cross: 0.12, comp: 0.2 }, { n: [7, 9], belt: 0.12, cross: 0.12, chain: 0.06, comp: 0.2, branch: 0.25 }, { n: [9, 11], belt: 0.12, cross: 0.14, chain: 0.06, comp: 0.25, branch: 0.3 }],
    speed: [null, { n: [1, 1], pool: EASY_T }, { n: [2, 3], pool: EASY_T }, { n: [3, 4], comp: 0.5, belt: 0.15, pool: EASY_T }, { n: [4, 6], comp: 0.5, belt: 0.15, cross: 0.1 }, { n: [5, 8], comp: 0.55, belt: 0.15, cross: 0.1, chain: 0.08 }]
  };
  const box = (lv) => ({ W: 250 + lv * 55, H: 180 + lv * 40 });

  // letters follow the train outwards from the driver: A is the driver
  function letter(d) {
    const K = kin(d);
    const rank = new Map(K.order.map((s, i) => [s, i]));
    const idx = d.parts.map((o, i) => i).filter((i) => lettered(d.parts[i]) && !d.parts[i].ix);
    idx.sort((a, b) => (rank.has(d.parts[a].s) ? rank.get(d.parts[a].s) : 999) - (rank.has(d.parts[b].s) ? rank.get(d.parts[b].s) : 999) || (a === frontPart(d, d.drive.s) ? -1 : b === frontPart(d, d.drive.s) ? 1 : 0) || (d.parts[a].z || 0) - (d.parts[b].z || 0) || a - b);
    idx.forEach((i, k) => { d.parts[i].n = M.letter(k); });
    return d;
  }
  function finish(d, q, level, extra) {
    d.q = q;
    delete d.tip;
    letter(d);
    const r = solveQ(d);
    if (r.err) return null;
    d.ans = r.v;
    const ex = Object.assign({}, extra || {});
    if (typeof ex.text === 'function') ex.text = ex.text();
    return Object.assign({ data: d, diff: level }, ex);
  }
  function drvWord(d) { return d.drive.m === 'motor' ? 'A motor turns' : 'The handle turns'; }
  function drvName(d) { return nameOf(d, frontPart(d, d.drive.s)); }
  function dirWord(d) { return d.drive.dir > 0 ? 'clockwise' : 'anticlockwise'; }

  const MAKERS = {
    dir(rng, lv) {
      const sp = lvlSpec.dir[lv], bx = box(lv);
      const d = grow(rng, Object.assign({}, sp, { n: rng.range(sp.n[0], sp.n[1]), W: bx.W, H: bx.H }));
      if (!d) return null;
      if (lv >= 4 && rng() < 0.45) addLoop(rng, d, rng() < 0.5 ? 'jam' : 'turn', bx.W, bx.H);
      const K = kin(d);
      const t = deepest(d, K);
      if (t < 0 || K.depth[d.parts[t].s] < Math.min(lv + 1, 3)) return null;
      return finish(d, { k: 'dir', p: t }, lv, { text: () => drvWord(d) + ' ' + drvName(d) + ' **' + dirWord(d) + '**. Which way does ' + nameOf(d, t) + ' turn?' });
    },
    speed(rng, lv, turns) {
      const sp = lvlSpec.speed[lv], bx = box(lv);
      const d = grow(rng, Object.assign({}, sp, { n: rng.range(sp.n[0], sp.n[1]), W: bx.W, H: bx.H }));
      if (!d) return null;
      const K = kin(d);
      if (K.jam) return null;
      const t = deepest(d, K);
      if (t < 0 || t === frontPart(d, 0)) return null;
      const w = F.abs(K.w[d.parts[t].s]);
      const ratio = F.div(w, [d.drive.rpm, 1]);
      if (F.eq(ratio, [1, 1]) && lv > 2) return null;
      if (turns) {
        // pick a number of handle turns that makes a whole answer at low levels
        const n = lv <= 3 ? ratio[1] * rng.range(1, 2) : rng.range(1, 5);
        if (n > 12) return null;
        const v = F.mul(ratio, [n, 1]);
        if (lv <= 3 && !F.isInt(v)) return null;
        if (lv >= 4 && v[1] > 12) return null;
        d.drive.m = 'crank';
        return finish(d, { k: 'turns', p: t, n }, lv, { text: () => 'The handle turns ' + drvName(d) + ' round **' + C.plural(n, 'time') + '**. How many turns does ' + nameOf(d, t) + ' make?' });
      }
      if (lv <= 2 && !F.isInt(w)) return null;
      if (lv === 3 && w[1] > 4) return null;
      if (lv >= 4 && w[1] > 12) return null;
      if (F.num(w) > 2000) return null;
      return finish(d, { k: 'speed', p: t }, lv, { text: () => drvWord(d) + ' ' + drvName(d) + ' at **' + d.drive.rpm + ' turns a minute** (rpm). How fast does ' + nameOf(d, t) + ' turn?' });
    },
    turns(rng, lv) { return MAKERS.speed(rng, lv, true); },
    jam(rng, lv) {
      const bx = box(lv);
      let d;
      const wantJam = rng() < 0.6;
      if (lv <= 2) {
        // a plain ring of 3 to 6 gears
        const n = lv === 1 ? rng.pick([3, 4]) : rng.range(3, 6);
        d = ring(rng, n);
        if (!d) return null;
      } else {
        const sp = { n: rng.range(lv, lv + 3), belt: 0.12, cross: 0.1, comp: lv >= 5 ? 0.3 : 0.12, branch: 0.25, W: bx.W, H: bx.H };
        d = grow(rng, sp);
        if (!d || !addLoop(rng, d, wantJam ? 'jam' : 'turn', bx.W, bx.H)) return null;
        if (lv >= 4 && rng() < 0.5) addLoop(rng, d, null, bx.W, bx.H);
      }
      d.drive.m = 'crank';
      return finish(d, { k: 'jam' }, lv, { text: () => 'The handle is on ' + drvName(d) + '. Will the machine turn — or jam?' });
    },
    weight(rng, lv, far) {
      const sp = lvlSpec.dir[Math.min(5, lv)], bx = box(lv);
      const d = grow(rng, Object.assign({}, sp, { n: rng.range(Math.max(1, sp.n[0] - 1), sp.n[1] - 1), W: bx.W, H: bx.H - 60, pool: far ? EASY_T : null }));
      if (!d) return null;
      const K = kin(d);
      if (K.jam) return null;
      const t = deepest(d, K);
      if (t < 0 || (d.parts[t].z || 0) === 1) return null;
      const sh = d.parts[t].s;
      if (partsOnShaft(d, sh).length > 1) return null;
      const s0 = snap(d);
      const circ = rng.pick([20, 25, 30, 40, 50]);
      const dr = Math.min(rng.range(7, 10), Math.floor(R(d.parts[t]) - 6));
      if (dr < 5) return null;
      const drum = { k: 'drum', s: sh, r: dr, z: 1, side: rng() < 0.5 ? 1 : -1, w: rng.pick(['5 kg', '10 kg', '20 kg', '50 kg', '2 kg']), L: rng.range(60, 85) };
      d.parts.push(drum);
      if (!valid(d, bx.W, bx.H)) { undo(d, s0); return null; }
      const di = d.parts.length - 1;
      if (far) {
        const ratio = F.abs(F.div(K.w[sh], [d.drive.rpm, 1]));
        const n = lv <= 3 ? ratio[1] : rng.range(1, 4);
        const v = F.mul(F.mul(ratio, [n, 1]), [circ, 1]);
        if (n > 10 || (lv <= 3 && !F.isInt(v)) || v[1] > 8) return null;
        d.drive.m = 'crank';
        return finish(d, { k: 'wdist', p: di, n, circ, sizes: 1 }, lv, { text: () => 'The handle turns ' + drvName(d) + ' **' + C.plural(n, 'time') + '**. The drum winds up **' + circ + ' cm** of rope for each of its own turns. How far does the weight rise?' });
      }
      return finish(d, { k: 'weight', p: di }, lv, { text: () => drvWord(d) + ' ' + drvName(d) + ' **' + dirWord(d) + '**. Does the weight go up or down?' });
    },
    wdist(rng, lv) { return MAKERS.weight(rng, lv, true); },
    rack(rng, lv, far) {
      const sp = lvlSpec.dir[Math.max(1, lv - 1)], bx = box(lv);
      const d = grow(rng, Object.assign({}, sp, { n: rng.range(sp.n[0], sp.n[1]), W: bx.W, H: bx.H, pool: far ? EASY_T : null }));
      if (!d) return null;
      const K = kin(d);
      if (K.jam) return null;
      const t = deepest(d, K, (o) => o.k === 'g');
      if (t < 0) return null;
      for (let k = 0; k < 16; k++) {
        const s0 = snap(d);
        d.racks.push({ g: t, a: rng.pick([90, -90, 0, 180, 90, -90]), n: rng.range(5, 7) });
        if (valid(d, bx.W + 40, bx.H + 30)) {
          if (far) {
            const ratio = F.abs(F.div(K.w[d.parts[t].s], [d.drive.rpm, 1]));
            const n = ratio[1] * rng.range(1, 2);
            if (n > 8) return null;
            d.drive.m = 'crank';
            return finish(d, { k: 'rackd', r: 0, n, sizes: 1 }, lv, { text: () => 'The handle turns ' + drvName(d) + ' **' + C.plural(n, 'time') + '**. How many teeth does the rack move along?' });
          }
          return finish(d, { k: 'rack', r: 0 }, lv, { text: () => drvWord(d) + ' ' + drvName(d) + ' **' + dirWord(d) + '**. Which way does the rack go?' });
        }
        undo(d, s0);
      }
      return null;
    },
    rackd(rng, lv) { return MAKERS.rack(rng, lv, true); },
    fastest(rng, lv) {
      const bx = box(lv);
      const d = grow(rng, { n: rng.range(lv + 1, lv + 4), comp: lv >= 4 ? 0.4 : 0.2, belt: 0.15, W: bx.W, H: bx.H });
      if (!d) return null;
      const K = kin(d);
      if (K.jam) return null;
      const among = d.parts.map((o, i) => i).filter((i) => d.parts[i].k === 'g' || d.parts[i].k === 'p');
      if (among.length < 4 || among.length > 10) return null;
      const r = finish(d, { k: 'fastest', among }, lv, { text: () => drvWord(d) + ' ' + drvName(d) + ' at ' + d.drive.rpm + ' rpm. Which gear or pulley spins the fastest?' });
      if (!r) return null;
      // not simply the smallest one
      const small = among.reduce((b, i) => (R(d.parts[i]) < R(d.parts[b]) ? i : b), among[0]);
      if (lv >= 4 && among[d.ans] === small) return null;
      return r;
    },
    idler(rng, lv) {
      const bx = box(lv);
      const d = grow(rng, { n: rng.range(lv, lv + 2), belt: lv >= 4 ? 0.12 : 0, cross: lv >= 4 ? 0.1 : 0, comp: lv >= 5 ? 0.2 : 0, W: bx.W - 20, H: bx.H - 20 });
      if (!d) return null;
      const K = kin(d);
      if (K.jam) return null;
      // pairs of meshing gears in the back plane: they turn opposite ways
      const A0 = analyse(d);
      const pairs = A0.meshes.filter(([a, b]) => (d.parts[a].z || 0) === 0 && (d.parts[b].z || 0) === 0);
      if (!pairs.length) return null;
      for (let tries = 0; tries < 80; tries++) {
        const [a, b] = rng.pick(pairs), tq = rng.pick(TEETH), ti = rng.pick([12, 14, 15, 16, 18, 20, 24]);
        const s0 = snap(d);
        const ca = d.shafts[d.parts[a].s], cb = d.shafts[d.parts[b].s];
        // somewhere the idler could reach from either gear of the pair
        const mid = [(ca[0] + cb[0]) / 2, (ca[1] + cb[1]) / 2], th = rng() * 2 * Math.PI;
        const reach = Math.min(R(d.parts[a]), R(d.parts[b])) + ti * MOD + tq * MOD / 2;
        const D = reach * (0.55 + 0.4 * rng());
        const O = [rnd(mid[0] + D * Math.cos(th)), rnd(mid[1] + D * Math.sin(th))];
        d.shafts.push(O);
        d.parts.push({ k: 'g', s: d.shafts.length - 1, t: tq, z: 0 });
        const out = d.parts.length - 1;
        if (!valid(d, bx.W, bx.H) || analyse(d).meshes.some((m) => m.includes(out))) { undo(d, s0); continue; }
        const q = { k: 'idler', out, t: ti, want: 1 };
        d.q = q;
        const sp = idlerSpots(d).filter((s) => s.meshWith.includes(out));
        // where the idler reaches the output: both directions possible, or a jam as the trap
        const cw = sp.filter((s) => s.w && !s.jam && F.sign(s.w) > 0), ccw = sp.filter((s) => s.w && !s.jam && F.sign(s.w) < 0), jams = sp.filter((s) => s.jam);
        if (!cw.length && !ccw.length) { undo(d, s0); delete d.q; continue; }
        q.want = cw.length && ccw.length ? (cw.length <= ccw.length ? 1 : -1) : (cw.length ? 1 : -1);
        if (!(cw.length && ccw.length) && !(lv >= 4 && jams.length)) { undo(d, s0); delete d.q; continue; }
        const r = finish(d, q, lv, { text: () => cap(nameOf(d, out)) + ' must turn **' + (q.want > 0 ? 'clockwise' : 'anticlockwise') + '** when ' + drvName(d) + ' turns ' + dirWord(d) + ', but it is not connected. Drag the loose ' + ti + '-tooth gear into the machine so that it meshes with two gears at once.' });
        if (r) { r.data.ans = null; return r; }
        undo(d, s0); delete d.q;
      }
      return null;
    },
    choose(rng, lv) {
      const v = lv <= 3 ? rng.pick(['pulley', 'sprocket']) : rng.pick(['pair', 'pulley', 'sprocket', 'pair']);
      if (v === 'sprocket') return bike(rng, lv);
      if (v === 'pulley') return beltChoice(rng, lv);
      return pairChoice(rng, lv);
    },
    orbit(rng, lv) {
      const ring = lv >= 4 && rng() < 0.5;
      for (let k = 0; k < 40; k++) {
        const planet = rng.pick(lv <= 2 ? [10, 12, 15, 20] : [10, 12, 14, 15, 16, 18, 20, 24]);
        const mult = lv <= 2 ? rng.pick([1, 2, 3]) : rng.pick([1, 1.5, 2, 2.5, 3, 4, 4 / 3, 5 / 3]);
        const sun = Math.round(planet * mult * (ring ? 1.6 : 1));
        if (sun < 12 || sun > 60 || (ring && sun < planet + 8)) continue;
        const o = { sun, planet, ring };
        if (lv >= 3 && rng() < 0.3) o.n = rng.range(2, 3);
        const v = orbitTurns(o).v;
        if (lv <= 2 && !F.isInt(v)) continue;
        if (v[1] > 6) continue;
        const d = { orbit: o, q: { k: 'orbit' }, ans: v };
        const text = ring
          ? 'A ring gear with ' + sun + ' teeth is fixed. An arm carries a ' + planet + '-tooth gear round the inside of the ring' + (o.n > 1 ? ', **' + o.n + ' times**' : ' **once**') + '. How many times does the small gear turn round its own centre?'
          : 'A ' + sun + '-tooth gear is fixed. An arm carries a ' + planet + '-tooth gear round the outside of it' + (o.n > 1 ? ', **' + o.n + ' times**' : ' **once**') + '. How many times does the small gear turn round its own centre (as you see it)?';
        return { data: d, diff: lv, text };
      }
      return null;
    }
  };

  // a plain ring of n gears (odd rings jam)
  function ring(rng, n) {
    for (let tries = 0; tries < 60; tries++) {
      const ts = Array.from({ length: n }, () => rng.pick([14, 15, 16, 18, 20, 24, 25, 28, 30]));
      const d = { shafts: [[0, 0]], parts: [{ k: 'g', s: 0, t: ts[0], z: 0 }], belts: [], racks: [], drive: { s: 0, dir: rng() < 0.5 ? 1 : -1, rpm: 30, m: 'crank' } };
      let th = rng.range(-20, 20);
      let ok = true;
      for (let i = 1; i < n - 1 && ok; i++) {
        const c = d.shafts[i - 1], D = (ts[i - 1] + ts[i]) * MOD / 2;
        d.shafts.push([rnd(c[0] + D * Math.cos(th * Math.PI / 180)), rnd(c[1] + D * Math.sin(th * Math.PI / 180))]);
        d.parts.push({ k: 'g', s: i, t: ts[i], z: 0 });
        th += 360 / n + rng.range(-12, 12);
      }
      // the last gear closes the ring
      d.q = { t: ts[n - 1], z: 0, out: 0, want: 1 };
      const A = d.parts[0], B = d.parts[n - 2], ca = d.shafts[0], cb = d.shafts[n - 2];
      const r = ts[n - 1] * MOD / 2, ra = R(A) + r, rb = R(B) + r, D = dist(ca, cb);
      delete d.q;
      if (D > ra + rb - 0.5 || D < Math.abs(ra - rb) + 0.5) continue;
      const x = (D * D + ra * ra - rb * rb) / (2 * D), h = Math.sqrt(ra * ra - x * x);
      const ux = (cb[0] - ca[0]) / D, uy = (cb[1] - ca[1]) / D;
      for (const sg of [1, -1]) {
        const d2 = C.clone(d);
        d2.shafts.push([rnd(ca[0] + ux * x - uy * h * sg), rnd(ca[1] + uy * x + ux * h * sg)]);
        d2.parts.push({ k: 'g', s: n - 1, t: ts[n - 1], z: 0 });
        const A2 = analyse(d2);
        if (A2.errs.length || A2.meshes.length !== n) continue;
        if (phases(d2, A2).worst > 0.07) continue;
        return d2;
      }
    }
    return null;
  }
  function bike(rng, lv) {
    const ring = rng.pick([36, 40, 42, 44, 48, 52]);
    const opts0 = [12, 14, 16, 18, 21, 24, 28, 32];
    const right = rng.pick(opts0);
    const pedal = rng.pick([40, 45, 48, 50, 60, 63, 70, 72, 84, 90]);
    const want = F.fr(pedal * ring, right);
    if (lv <= 3 && !F.isInt(want)) return null;
    const others = rng.shuffle(opts0.filter((x) => x !== right)).slice(0, 3);
    const opts = rng.shuffle([right].concat(others));
    const D = rng.range(135, 150);
    const d = {
      shafts: [[0, 0], [-D, 8]],
      parts: [{ k: 'sp', s: 0, t: ring, z: 1 }, { k: 'sp', s: 1, t: 20, z: 1 }, { k: 'w', s: 1, r: 62 }],
      belts: [{ a: 0, b: 1, ch: 1 }], racks: [],
      drive: { s: 0, dir: 1, rpm: pedal, m: 'crank' }
    };
    const q = { k: 'choose', v: 'sprocket', p: [1], opts, want, out: 1 };
    d.q = q;
    letter(d);
    const r = chooseCheck(d);
    if (r.err) return null;
    d.ans = r.v;
    return { data: d, diff: lv, text: 'A cyclist pedals at **' + pedal + ' turns a minute** on a ' + ring + '-tooth chainring. Which sprocket on the back wheel makes the wheel turn at **' + fracW(want) + ' turns a minute**?' };
  }
  function beltChoice(rng, lv) {
    const bx = box(lv);
    for (let k = 0; k < 20; k++) {
      const d = lv <= 3 ? { shafts: [[0, 0]], parts: [{ k: 'p', s: 0, r: rng.pick(PULLEY_R), z: 0 }], belts: [], racks: [], drive: { s: 0, dir: 1, rpm: rng.pick(RPMS), m: 'motor' } }
        : grow(rng, { n: rng.range(1, 3), comp: 0.4, W: bx.W - 100, H: bx.H });
      if (!d) continue;
      const K = kin(d);
      if (K.jam) continue;
      // the last shaft gets a pulley (in the free plane) with a belt to the output
      const t = lv <= 3 ? 0 : deepest(d, K);
      const sh = d.parts[t].s;
      if (partsOnShaft(d, sh).length > 1 && d.parts[t].k !== 'p') continue;
      const s0 = snap(d);
      let pa = t;
      if (d.parts[t].k !== 'p') { d.parts.push({ k: 'p', s: sh, r: rng.pick(PULLEY_R), z: 1 - (d.parts[t].z || 0) }); pa = d.parts.length - 1; }
      const opts = rng.shuffle(PULLEY_R.slice()).slice(0, 4);
      const rMax = Math.max(...opts);
      const c = d.shafts[sh], th = rng.range(-35, 35) * Math.PI / 180, D = R(d.parts[pa]) + rMax + rng.range(20, 40);
      d.shafts.push([rnd(c[0] + D * Math.cos(th)), rnd(c[1] + D * Math.sin(th))]);
      const mid = [...opts].sort((a, b) => a - b)[1];
      d.parts.push({ k: 'p', s: d.shafts.length - 1, r: mid, z: d.parts[pa].z || 0, n: 'out' });
      const out = d.parts.length - 1;
      d.belts.push({ a: pa, b: out, x: lv >= 4 && rng() < 0.3 ? 1 : 0 });
      const right = rng.pick(opts);
      // the speed that option gives
      const d2 = applyOpt(Object.assign({}, d, { q: { v: 'pulley', p: [out] } }), right);
      const A2 = analyse(d2);
      if (A2.errs.length) { undo(d, s0); continue; }
      const w = F.abs(kin(d2, A2).w[d.shafts.length - 1]);
      if (lv <= 3 && !F.isInt(w)) { undo(d, s0); continue; }
      if (w[1] > 6 || F.eq(w, F.abs(kin(d2, A2).w[d.drive.s]))) { undo(d, s0); continue; }
      d.q = { k: 'choose', v: 'pulley', p: [out], opts, want: w, out };
      const r = chooseCheck(d);
      if (r.err || r.res.some((x) => x.bad)) { undo(d, s0); delete d.q; continue; }
      d.ans = r.v;
      delete d.tip;
      letter(d);
      return { data: d, diff: lv, text: drvWord(d) + ' ' + drvName(d) + ' at ' + d.drive.rpm + ' rpm. Which pulley, fitted in place of **' + labelOf(d, out) + '**, will turn at **' + fracW(w) + ' rpm**?' };
    }
    return null;
  }
  function pairChoice(rng, lv) {
    const bx = box(lv);
    for (let k = 0; k < 20; k++) {
      const d = grow(rng, { n: rng.range(1, 3), comp: 0.3, W: bx.W - 110, H: bx.H - 20, pool: EASY_T });
      if (!d) continue;
      const K = kin(d);
      if (K.jam) continue;
      const t = deepest(d, K, (o) => o.k === 'g');
      if (t < 0 || partsOnShaft(d, d.parts[t].s).length > 1) continue;
      const N = rng.pick([48, 50, 54, 60, 64, 72]);
      const cands = [];
      for (let a = 12; a <= N - 12; a++) if (TEETH.includes(a) && TEETH.includes(N - a)) cands.push([a, N - a]);
      if (cands.length < 4) continue;
      const opts = rng.shuffle(cands).slice(0, 4);
      const s0 = snap(d);
      const sh = d.parts[t].s, c = d.shafts[sh], z = 1 - (d.parts[t].z || 0);
      const th = rng.range(-50, 50) * Math.PI / 180;
      d.parts.push({ k: 'g', s: sh, t: N / 2, z });
      const pa = d.parts.length - 1;
      d.shafts.push([rnd(c[0] + N * Math.cos(th)), rnd(c[1] + N * Math.sin(th))]);
      d.parts.push({ k: 'g', s: d.shafts.length - 1, t: N / 2, z, n: 'out' });
      const out = d.parts.length - 1;
      d.q = { k: 'choose', v: 'pair', p: [pa, out], opts, out };
      const res = opts.map((o) => { const d2 = applyOpt(d, o), A2 = analyse(d2); return A2.errs.length ? null : F.abs(kin(d2, A2).w[d2.shafts.length - 1]); });
      if (res.some((x) => !x)) { undo(d, s0); delete d.q; continue; }
      const i = rng.int(opts.length);
      if ((lv <= 3 && !F.isInt(res[i])) || res[i][1] > 8 || res.filter((x) => F.eq(x, res[i])).length > 1) { undo(d, s0); delete d.q; continue; }
      d.q.want = res[i];
      const r = chooseCheck(d);
      if (r.err) { undo(d, s0); delete d.q; continue; }
      d.ans = r.v;
      delete d.tip;
      letter(d);
      return { data: d, diff: lv, text: drvWord(d) + ' ' + drvName(d) + ' at ' + d.drive.rpm + ' rpm. Two change gears go in the gap marked **?** — one on the shaft of ' + labelOf(d, t) + ', one on the output shaft. To fit the shafts they must have ' + N + ' teeth between them. Which pair makes the output turn at **' + fracW(res[i]) + ' rpm**?' };
    }
    return null;
  }

  // which kinds each level draws from
  const KINDS = [null,
    ['dir', 'dir', 'speed', 'jam', 'weight', 'orbit'],
    ['dir', 'dir', 'speed', 'jam', 'weight', 'rack', 'orbit', 'turns'],
    ['dir', 'speed', 'turns', 'jam', 'weight', 'rack', 'fastest', 'idler', 'choose', 'wdist', 'rackd', 'orbit'],
    ['dir', 'speed', 'turns', 'jam', 'weight', 'fastest', 'idler', 'choose', 'wdist', 'orbit'],
    ['dir', 'dir', 'speed', 'turns', 'jam', 'fastest', 'idler', 'choose', 'weight']
  ];
  function make(rng, lv, kind) {
    kind = kind || rng.pick(KINDS[lv]);
    for (let k = 0; k < 30; k++) {
      const r = MAKERS[kind](rng, lv);
      if (r && r.data && (r.data.q.k === 'orbit' || r.data.q.k === 'idler' || analyse(r.data).errs.length === 0)) {
        if (r.data.q.k !== 'orbit' && r.data.q.k !== 'idler' && r.data.q.k !== 'choose' && phases(r.data).worst > 0.12) continue;
        return r;
      }
    }
    return null;
  }
  const TITLES = { dir: 'Which way?', speed: 'How fast?', turns: 'How many turns?', jam: 'Turn or jam?', weight: 'Up or down?', wdist: 'How high?', rack: 'Which way does the rack go?', rackd: 'How far does the rack go?', fastest: 'The fastest wheel', idler: 'One more gear', choose: 'Pick the gear', orbit: 'Round and round' };

  function idlerExplain(d, spots) {
    const good = spots.filter((s) => s.ok).map((s) => s.meshWith.map((i) => labelOf(d, i)).join('–'));
    const bad = spots.filter((s) => !s.ok && s.meshWith.includes(d.q.out));
    return 'An idler flips the direction twice, so the gear it drives turns the same way as the gear that drives it. It works where it bridges ' + [...new Set(good)].join(' or ') + '. ' +
      (bad.some((s) => s.jam) ? 'Where it touches three gears at once it closes a loop that fights itself, and the train jams.' : '');
  }

  /* ================= the engine ================= */

  C.engine({
    id: 'gears',
    name: 'Gears and belts',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'],
    deps: ['js/lib/mech.js'],
    about: 'A machine of gears, belts, chains, racks and drums. Two gears mesh when their teeth touch; gears drawn over one another sit on different planes and only turn together when they share a shaft. Answer in the panel — then the machine runs, with an arrow on every wheel. In *one more gear* puzzles, drag the loose gear from the tray: it snaps wherever it meshes with two gears at once. The pen, highlighter and notes are there for marking directions as you work.',

    verify(p) {
      const d = p.data;
      if (!d || !d.q) return { ok: false, err: 'data.q is needed' };
      if (d.q.k !== 'orbit' && (!d.shafts || !d.parts || !d.drive)) return { ok: false, err: 'shafts, parts and drive are needed' };
      let r;
      try { r = solveQ(d); } catch (e) { return { ok: false, err: 'solver threw ' + e.message }; }
      if (r.err) return { ok: false, err: r.err };
      if (d.q.k === 'idler') return r.warn ? { ok: true, warn: r.warn } : { ok: true };
      if (Array.isArray(r.v)) {
        if (!Array.isArray(d.ans) || !F.eq(F.fr(d.ans[0], d.ans[1]), r.v)) return { ok: false, err: 'the answer is ' + F.str(r.v) + ' but the data says ' + JSON.stringify(d.ans) };
      } else if (d.ans !== r.v) return { ok: false, err: 'the answer is choice ' + r.v + ' but the data says ' + d.ans };
      if (d.q.k !== 'orbit' && d.q.k !== 'choose') {
        const w = phases(d).worst;
        if (w > 0.12) return { ok: true, warn: 'teeth out of step in a loop (' + w.toFixed(2) + ' of a tooth)' };
      }
      return { ok: true };
    },

    answerKey(p) {
      const d = p.data;
      if (d.q.k === 'idler') return null;
      return Array.isArray(d.ans) ? F.str(d.ans) : d.ans;
    },

    generate(rng, level) {
      const r = make(rng, level);
      if (!r) return null;
      return { title: TITLES[r.data.q.k], text: r.text, diff: level, data: r.data };
    },

    mount(ctx, p) {
      const inst = p.data.q.k === 'orbit' ? mountOrbit(ctx, p) : mountTrain(ctx, p);
      if (p.data.q.k !== 'idler') delete inst.check;
      return inst;
    },

    thumb(p) {
      const d = p.data;
      const flat = (m) => (M.MATS[m] || M.MATS.steel)[1];
      const toothy = (cx, cy, t, mat) => {
        const r = t * MOD / 2, per = 2 * Math.PI * (r + MOD / 2) / t;
        return '<circle cx="' + f3(cx) + '" cy="' + f3(cy) + '" r="' + f3(r + MOD / 2) + '" fill="none" stroke="' + flat(mat) + '" stroke-width="' + (2 * MOD) + '" stroke-dasharray="' + f3(per * 0.46) + ' ' + f3(per * 0.54) + '"/>' +
          '<circle cx="' + f3(cx) + '" cy="' + f3(cy) + '" r="' + f3(r - MOD * 0.4) + '" fill="' + flat(mat) + '"/><circle cx="' + f3(cx) + '" cy="' + f3(cy) + '" r="' + f3(Math.max(2, r * 0.25)) + '" fill="rgba(0,0,0,.35)"/>';
      };
      if (d.q.k === 'orbit') {
        const o = d.orbit, g = orbitGeo(o), e = o.ring ? g.Rs + 8 : g.Rs + 2 * g.Rp + 6;
        let s = '<svg viewBox="' + (-e) + ' ' + (-e) + ' ' + (2 * e) + ' ' + (2 * e) + '" preserveAspectRatio="xMidYMid meet">';
        if (o.ring) s += '<circle r="' + f3(g.Rs + 3) + '" fill="none" stroke="' + flat('steel') + '" stroke-width="6"/>';
        else s += toothy(0, 0, o.sun, 'steel');
        s += toothy(0, -g.arm, o.planet, 'brass') + '<path d="M0 0V' + f3(-g.arm) + '" stroke="' + M.MATS.wood[1] + '" stroke-width="3" stroke-linecap="round"/>';
        return s + '</svg>';
      }
      const e = extent(d), pad = 4;
      let s = '<svg viewBox="' + f3(e.x0 - pad) + ' ' + f3(e.y0 - pad) + ' ' + f3(e.x1 - e.x0 + 2 * pad) + ' ' + f3(e.y1 - e.y0 + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">';
      d.parts.forEach((o) => { if (o.k === 'w') { const c = d.shafts[o.s]; s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + o.r + '" fill="none" stroke="#3a3f4f" stroke-width="5"/>'; } });
      [0, 1].forEach((z) => {
        d.parts.forEach((o, i) => {
          if (o.k === 'w' || (o.z || 0) !== z) return;
          const c = d.shafts[o.s];
          if (o.k === 'g' || o.k === 'sp') s += toothy(c[0], c[1], o.t, matOf(o, i));
          else s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + f3(Ro(o)) + '" fill="' + flat(o.k === 'drum' ? 'iron' : matOf(o, i)) + '"/>';
        });
        (d.belts || []).forEach((b) => { if ((d.parts[b.a].z || 0) !== z) return; const pts = beltLoop(d, b); if (pts) s += '<path d="' + polyD(pts, true) + '" fill="none" stroke="#2e3240" stroke-width="2.6"/>'; });
      });
      (d.racks || []).forEach((rk) => { const f = rackFrame(d, rk); s += '<path d="M' + f3(f.T[0] - f.e[0] * f.len / 2 + f.n[0] * 3) + ' ' + f3(f.T[1] - f.e[1] * f.len / 2 + f.n[1] * 3) + 'L' + f3(f.T[0] + f.e[0] * f.len / 2 + f.n[0] * 3) + ' ' + f3(f.T[1] + f.e[1] * f.len / 2 + f.n[1] * 3) + '" stroke="' + flat('steel') + '" stroke-width="7"/>'; });
      if (d.q.p != null && d.parts[d.q.p]) { const o = d.parts[d.q.p], c = d.shafts[o.s]; s += '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="' + f3(Ro(o) + 3) + '" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-dasharray="4 3"/>'; }
      return s + '</svg>';
    }
  });

  C.gearsLib = { analyse, kin, solveQ, phases, idlerSpots, make, MAKERS, grow, addLoop, ring, extent, R, Ro, orbitTurns, TITLES, explainOf, labelOf };

  C.css('gears', `
    .gr-plate { fill: var(--board-2); stroke: var(--line); stroke-width: .6; }
    .gr-depth { fill: rgba(8, 10, 22, .28); pointer-events: none; }
    .gr-part { transition: filter .2s; }
    .gr-part.gr-jam path:first-child { stroke: var(--red); stroke-width: 1.6; }
    .gr-part.gr-jam { filter: drop-shadow(0 0 3px rgba(255, 80, 80, .8)); }
    .gr-part.gr-hintglow { filter: drop-shadow(0 0 4px var(--gold)); }
    .gr-ghost-c { fill: rgba(255, 209, 102, .06); stroke: var(--gold); stroke-width: .9; stroke-dasharray: 3 2.2; }
    .gr-shaft { fill: #1a1d2b; }
    .gr-belt-base { fill: none; stroke: #6b4526; stroke-width: 3; stroke-linejoin: round; }
    .gr-belt-tex { fill: none; stroke: #a8794a; stroke-width: 1.4; stroke-dasharray: 1.2 2.6; }
    .gr-chain .gr-belt-base { stroke: #23262f; stroke-width: 3.4; }
    .gr-chain .gr-belt-tex { stroke: #6a7185; stroke-width: 2.6; stroke-dasharray: 4.2 2.08; }
    .gr-chain-roll { fill: none; stroke: #c9d0dd; stroke-width: 1.5; stroke-linecap: round; stroke-dasharray: 0.01 6.2832; }
    .gr-belt-ghost { fill: none; stroke: var(--gold); stroke-width: 1; stroke-dasharray: 3 2.5; opacity: .6; }
    .gr-guide { fill: var(--wood-dark); opacity: .5; }
    .gr-rope { fill: none; stroke: #b8925a; stroke-width: 1.4; }
    .gr-wlabel { font: 700 5px "Segoe UI", system-ui, sans-serif; fill: #e9ecf5; }
    .gr-badge circle { fill: var(--panel); stroke: var(--ink-2); stroke-width: .6; }
    .gr-badge text { font: 800 5.6px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; pointer-events: none; }
    .gr-badge.target circle { stroke: var(--gold); stroke-width: 1; }
    .gr-size { font: 700 4.6px "Segoe UI", system-ui, sans-serif; fill: #1b1e2b; text-anchor: middle; paint-order: stroke; stroke: rgba(255, 255, 255, .55); stroke-width: .8px; pointer-events: none; }
    .gr-size.small { font-size: 3.8px; }
    .gr-q { font: 800 9px "Segoe UI", system-ui, sans-serif; fill: var(--gold); text-anchor: middle; }
    .gr-arrows .gr-arrow { opacity: 0; transition: opacity .35s; }
    .gr-arrows.on .gr-arrow, .gr-arrows .gr-arrow.hint { opacity: 1; }
    .gr-arrow-arc { fill: none; stroke: var(--gold); stroke-width: 1.5; stroke-linecap: round; }
    .gr-arrow-head { fill: var(--gold); }
    .gr-arrow.drv .gr-arrow-arc { stroke: var(--green); }
    .gr-arrow.drv .gr-arrow-head { fill: var(--green); }
    .gr-arrow.hint .gr-arrow-arc { stroke: var(--teal); }
    .gr-arrow.hint .gr-arrow-head { fill: var(--teal); }
    .gr-target { fill: none; stroke: var(--gold); stroke-width: .9; stroke-dasharray: 2.4 1.8; opacity: .85; pointer-events: none; }
    .gr-pill rect { fill: var(--panel); stroke: var(--line); stroke-width: .5; }
    .gr-pill text { font: 700 5px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; }
    .gr-pill.drv rect { stroke: var(--green); }
    .gr-pill.drv text { fill: var(--green); }
    .gr-pill.tgt rect { stroke: var(--gold); }
    .gr-pill.tgt text { fill: var(--gold); }
    .gr-pill.hint rect { stroke: var(--teal); fill: var(--panel-2); }
    .gr-pill.hint text { fill: var(--teal); }
    .gr-tray { fill: var(--panel-2); stroke: var(--line); stroke-width: .7; stroke-dasharray: 3 2; }
    .gr-tray-t { font: 600 5px "Segoe UI", system-ui, sans-serif; fill: var(--muted); text-anchor: middle; }
    .gr-loose { cursor: grab; }
    .gr-dragging { opacity: .75; pointer-events: none; filter: drop-shadow(0 2px 3px rgba(0,0,0,.5)); }
    .gr-dragging.snapped { opacity: 1; filter: drop-shadow(0 0 3px var(--green)); }
    .gr-spot { fill: var(--green); opacity: .7; pointer-events: none; }
    .gr-spot-hint { fill: rgba(56, 217, 211, .1); stroke: var(--teal); stroke-width: .8; stroke-dasharray: 2 1.6; pointer-events: none; animation: grpulse 1.1s ease-in-out infinite; }
    .gr-spot-hint.good { stroke: var(--gold); fill: rgba(255, 209, 102, .15); }
    @keyframes grpulse { 50% { opacity: .35; } }
    .gr-jamstamp rect { fill: rgba(255, 90, 90, .15); stroke: var(--red); stroke-width: 1.2; }
    .gr-jamstamp text { font: 900 7px "Segoe UI", system-ui, sans-serif; fill: var(--red); text-anchor: middle; letter-spacing: .6px; }
    .gr-jamstamp { animation: grstamp .35s ease-out; }
    @keyframes grstamp { from { opacity: 0; } to { opacity: 1; } }
    .gr-trail { fill: none; stroke: #e0443e; stroke-width: .7; stroke-opacity: .7; }
    .gr-orbit-lbl { font: 700 4.8px "Segoe UI", system-ui, sans-serif; fill: #1b1e2b; text-anchor: middle; paint-order: stroke; stroke: rgba(255,255,255,.5); stroke-width: .8px; }
    .gr-orbit-lbl.small { fill: var(--text); stroke: none; }
    .gr-counter { font: 700 5.5px "Segoe UI", system-ui, sans-serif; fill: var(--gold); text-anchor: middle; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
