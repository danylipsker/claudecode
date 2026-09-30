/* The Puzzle Cabinet · engines/pulleys.js
 *
 * Pulleys, levers and winches. Everything is worked out exactly:
 *   levers    weight × distance on each side (Archimedes' law of the lever)
 *   ropes     a rope keeps its length: for every rope the lengths of its
 *             straight runs add up to the same total, which fixes how fast each
 *             block moves when you pull (or which way a free system runs);
 *             the force follows from the work done (force × distance pulled
 *             = weight × height raised)
 *   winches   the crank's circle against the drum's
 *
 * data (by kind):
 *   { k: 'lever', n: pegs each side, w: [[peg, kg], …], q: 'tip' | 'mass' | 'place', u: unknown weight, tray: [kg, …] }
 *   { k: 'crowbar', a: cm from rock to pivot, b: cm from pivot to hand, W: newtons }
 *   { k: 'rope', sys: { bodies, sheaves, ropes }, q: 'force' | 'dist' | 'n' | 'way' | 'mass', load: body, pull: cm, u: body }
 *   { k: 'winch', R: crank cm, r: drum cm, W: newtons, q: 'force' | 'rise', n: turns, circ: cm }
 *   ans: a choice index, or a fraction [n, d]
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const M = C.mech;
  const F = M.F;

  /* ================= levers ================= */

  // turning effect about the pivot: + turns the right side down
  function torque(w) { return w.reduce((s, [x, m]) => F.add(s, F.mul(F.fr(x), F.fr(m))), [0, 1]); }
  // every way to hang the tray weights on free pegs so that the beam balances
  function placements(d, limit) {
    const pegs = [];
    for (let x = -d.n; x <= d.n; x++) if (x !== 0) pegs.push(x);
    const out = [];
    const base = torque(d.w.filter((x) => x[1] != null));
    const rec = (k, T, used) => {
      if (out.length >= (limit || 50)) return;
      if (k === d.tray.length) { if (F.zero(T)) out.push(used.slice()); return; }
      for (const x of pegs) {
        used.push(x);
        rec(k + 1, F.add(T, F.fr(x * d.tray[k])), used);
        used.pop();
      }
    };
    rec(0, base, []);
    return out;
  }

  /* ================= rope systems ================= */

  // where each rope item touches the rope: [entry point, exit point]
  function itemPts(sys, it, disp) {
    const B = sys.bodies, S = sys.sheaves;
    const off = (b) => (b >= 0 ? [B[b].x, B[b].y + (disp ? disp[b] || 0 : 0)] : [0, 0]);
    if (it.s != null) {
      const s = S[it.s], o = off(s.b), c = [o[0] + s.x, o[1] + s.y];
      return [[c[0] - it.d * s.r, c[1]], [c[0] + it.d * s.r, c[1]], c];
    }
    if (it.h) { const p = [it.x, it.y + (disp ? disp.hand || 0 : 0)]; return [p, p]; }
    const o = off(it.a), p = [o[0] + it.x, o[1] + it.y];
    return [p, p];
  }
  const bodyOf = (sys, it) => (it.s != null ? sys.sheaves[it.s].b : it.h ? 'h' : it.a);

  // the velocity of every body (downward +) when the hand pulls at speed 1; or, with no hand, the one way the system can move
  function ropeKin(sys) {
    const B = sys.bodies;
    const mov = B.map((b, i) => i).filter((i) => B[i].t !== 'fix');
    const col = new Map(mov.map((b, k) => [b, k]));
    const rows = [];
    let hand = false;
    sys.ropes.forEach((rope) => {
      const row = new Array(mov.length).fill(null).map(() => [0, 1]);
      let rhs = [0, 1];
      for (let i = 0; i < rope.length - 1; i++) {
        const A = rope[i], Bq = rope[i + 1];
        const pa = itemPts(sys, A)[1], pb = itemPts(sys, Bq)[0];
        const aUp = pa[1] < pb[1];
        const up = aUp ? A : Bq, lo = aUp ? Bq : A;
        // length rate = v(lower) − v(upper)
        [[lo, 1], [up, -1]].forEach(([it, sg]) => {
          const b = bodyOf(sys, it);
          if (b === 'h') { hand = true; const hv = it === lo ? 1 : -1; rhs = F.sub(rhs, F.fr(sg * hv)); return; }
          if (b < 0 || B[b].t === 'fix') return;
          const k = col.get(b);
          row[k] = F.add(row[k], F.fr(sg));
        });
      }
      rows.push({ row, rhs });
    });
    // Gaussian elimination, exact
    const A = rows.map((r) => r.row.concat([r.rhs]));
    const n = mov.length, piv = [];
    let r = 0;
    for (let c = 0; c < n && r < A.length; c++) {
      let p = -1;
      for (let i = r; i < A.length; i++) if (!F.zero(A[i][c])) { p = i; break; }
      if (p < 0) continue;
      [A[r], A[p]] = [A[p], A[r]];
      const inv = F.div([1, 1], A[r][c]);
      A[r] = A[r].map((x) => F.mul(x, inv));
      for (let i = 0; i < A.length; i++) {
        if (i === r || F.zero(A[i][c])) continue;
        const f = A[i][c];
        A[i] = A[i].map((x, j) => F.sub(x, F.mul(f, A[r][j])));
      }
      piv.push(c);
      r++;
    }
    for (let i = r; i < A.length; i++) if (!F.zero(A[i][n])) return { err: 'the ropes contradict each other' };
    const free = [];
    for (let c = 0; c < n; c++) if (!piv.includes(c)) free.push(c);
    const v = B.map(() => [0, 1]);
    if (hand) {
      if (free.length) return { err: 'some block can move without the rope being pulled' };
      piv.forEach((c, i) => { v[mov[c]] = A[i][n]; });
      return { v, hand: true };
    }
    if (free.length !== 1) return { err: 'the system should have exactly one way to move (it has ' + free.length + ')' };
    // the one free direction: set the free body's speed to 1
    const fc = free[0];
    v[mov[fc]] = [1, 1];
    piv.forEach((c, i) => { v[mov[c]] = F.neg(A[i][fc]); });
    return { v, hand: false };
  }
  // the weights' downhill tendency along the motion: > 0 means the motion as found runs downhill
  function drive(sys, v) { return sys.bodies.reduce((s, b, i) => (b.W ? F.add(s, F.mul(F.fr(b.W), v[i])) : s), [0, 1]); }

  /* ---------- builders (coordinates in world units; ceiling at y = 0) ---------- */

  const SR = 8;           // sheave radius: two rope lanes are 16 apart
  // a block and tackle: k upper sheaves; the rope's fixed end on the upper block (anchorUp) or on the lower one
  function tackle(k, anchorUp, W, opt) {
    opt = opt || {};
    const yU = 30, yL = opt.yL || 108, x0 = opt.x0 || 0;
    const lane = (i) => x0 + i * 2 * SR;
    const kl = anchorUp ? k : k - 1;              // lower sheaves
    const bodies = [{ t: 'fix', x: 0, y: 0 }];
    const lowX = anchorUp ? (lane(0) + lane(2 * kl - 1)) / 2 : kl ? (lane(1) + lane(2 * kl)) / 2 : lane(0);
    bodies.push({ t: kl ? 'blk' : 'wt', x: lowX, y: yL, W, txt: opt.lbl || (W + ' N'), un: 'N', sh: opt.sh || 'crate' });
    const sheaves = [], rope = [];
    const up = [], lo = [];
    if (anchorUp) {
      rope.push({ a: -1, x: lane(0), y: yU - 4 });
      for (let i = 0; i < k; i++) {
        lo.push(sheaves.length); sheaves.push({ b: 1, x: (lane(2 * i) + lane(2 * i + 1)) / 2 - lowX, y: 0, r: SR });
        rope.push({ s: sheaves.length - 1, d: 1, o: 0 });
        up.push(sheaves.length); sheaves.push({ b: -1, x: (lane(2 * i + 1) + lane(2 * i + 2)) / 2, y: yU, r: SR });
        rope.push({ s: sheaves.length - 1, d: 1, o: 1 });
      }
      rope.push({ h: 1, x: lane(2 * k), y: yL + 50 });
    } else {
      rope.push({ a: 1, x: lane(0) - lowX, y: kl ? -SR - 4 : -2 });
      for (let i = 0; i < k; i++) {
        up.push(sheaves.length); sheaves.push({ b: -1, x: (lane(2 * i) + lane(2 * i + 1)) / 2, y: yU, r: SR });
        rope.push({ s: sheaves.length - 1, d: 1, o: 1 });
        if (i < kl) { lo.push(sheaves.length); sheaves.push({ b: 1, x: (lane(2 * i + 1) + lane(2 * i + 2)) / 2 - lowX, y: 0, r: SR }); rope.push({ s: sheaves.length - 1, d: 1, o: 0 }); }
      }
      rope.push({ h: 1, x: lane(2 * k - 1), y: yL + 50 });
    }
    return { bodies, sheaves, ropes: [rope], blocks: [{ b: -1, s: up }, { b: 1, s: lo }] };
  }
  // two (or three) movable pulleys in a chain: each halves the pull again
  function cascade(stages, W) {
    const bodies = [{ t: 'fix', x: 0, y: 0 }], sheaves = [], ropes = [], blocks = [];
    // each movable pulley hangs from the one above it: its left run goes to the hook of the one above
    const LUG = 12;         // each block's hook for the next rope sits on a lug to the right
    const xs = (i) => i * (SR + LUG);
    const ys = (i) => 64 + i * 46;
    for (let i = 0; i < stages; i++) {
      const last = i === stages - 1;
      bodies.push({ t: 'blk', x: xs(i), y: ys(i), W: last ? W : 0, txt: last ? W + ' N' : '', un: 'N', sh: last ? 'crate' : null });
      sheaves.push({ b: bodies.length - 1, x: 0, y: 0, r: SR });
      blocks.push({ b: bodies.length - 1, s: [sheaves.length - 1] });
    }
    // stage 0: ceiling anchor → under P0 → over a fixed pulley on the left → the hand
    sheaves.push({ b: -1, x: -2 * SR, y: 28, r: SR });
    blocks.push({ b: -1, s: [sheaves.length - 1] });
    ropes.push([{ a: -1, x: SR, y: 4 }, { s: 0, d: -1, o: 0 }, { s: sheaves.length - 1, d: -1, o: 1 }, { h: 1, x: -3 * SR, y: ys(stages - 1) + 56 }]);
    // stage i: anchor on the ceiling → under P_i → up to the hook of P_{i-1}
    for (let i = 1; i < stages; i++) {
      ropes.push([{ a: -1, x: xs(i) + SR, y: 4 }, { s: i, d: -1, o: 0 }, { a: i, x: LUG, y: SR + 1 }]);
    }
    return { bodies, sheaves, ropes, blocks };
  }
  // weights on both sides of a fixed pulley; either side may hang on a movable pulley (no hand: which way does it run?)
  function balance(WA, WB, movA, movB) {
    const bodies = [{ t: 'fix', x: 0, y: 0 }];
    const sheaves = [{ b: -1, x: 0, y: 30, r: SR * 1.5 }];
    const R = SR * 1.5;
    const blocks = [{ b: -1, s: [0] }];
    const rope = [];
    const side = (W, mov, sg, nm) => {
      // sg -1: the left side, +1: the right; W null = the unknown weight
      const body = { W, nm, txt: W == null ? '?' : W + ' kg', un: 'kg', m: W == null ? 4 : W, unk: W == null, sh: 'weight' };
      if (!mov) { bodies.push(Object.assign({ t: 'wt', x: sg * R, y: 104 }, body)); return [{ a: bodies.length - 1, x: 0, y: -2 }]; }
      const bx = sg * (R + SR);
      bodies.push(Object.assign({ t: 'blk', x: bx, y: 96 }, body));
      sheaves.push({ b: bodies.length - 1, x: 0, y: 0, r: SR });
      blocks.push({ b: bodies.length - 1, s: [sheaves.length - 1] });
      return [{ a: -1, x: bx + sg * SR, y: 4 }, { s: sheaves.length - 1, d: -sg, o: 0 }];
    };
    const Lp = side(WA, movA, -1, 'A');
    const Rp = side(WB, movB, 1, 'B');
    // left part runs from its end to the top pulley, then down the right part (reversed)
    rope.push(...Lp);
    rope.push({ s: 0, d: 1, o: 1 });
    rope.push(...Rp.reverse().map((it) => (it.s != null ? Object.assign({}, it, { d: -it.d }) : it)));
    return { bodies, sheaves, ropes: [rope], blocks };
  }

  /* ================= answers ================= */

  const TIPS = ['The left end goes down', 'The right end goes down', 'It stays level'];
  function wayChoices(d) { return ['A goes down', 'B goes down', 'It balances']; }
  // the answer worked out from the machine: { v, kind: 'num' | 'choice', unit }
  function solve(d) {
    if (d.k === 'lever') {
      const known = d.w.filter((x) => x[1] != null);
      const T = torque(known);
      if (d.q === 'tip') return { v: F.zero(T) ? 2 : F.sign(T) > 0 ? 1 : 0, kind: 'choice' };
      if (d.q === 'mass') {
        const x = d.w[d.u][0];
        if (!x) return { err: 'the unknown weight hangs on the pivot' };
        const m = F.div(F.neg(T), F.fr(x));
        if (F.sign(m) <= 0) return { err: 'no positive weight balances it' };
        return { v: m, kind: 'num', unit: 'kg' };
      }
      if (d.q === 'place') {
        const ps = placements(d, 200);
        if (!ps.length) return { err: 'no way to hang the weights so the beam balances' };
        return { v: 'place', kind: 'place', ways: ps };
      }
      return { err: 'unknown lever question' };
    }
    if (d.k === 'crowbar') return { v: F.fr(d.W * d.a, d.b), kind: 'num', unit: 'N' };
    if (d.k === 'winch') {
      if (d.q === 'force') return { v: F.fr(d.W * d.r, d.R), kind: 'num', unit: 'N' };
      return { v: F.fr(d.n * d.circ, 1), kind: 'num', unit: 'cm' };
    }
    if (d.k === 'rope') {
      const K = ropeKin(d.sys);
      if (K.err) return { err: K.err };
      const B = d.sys.bodies;
      if (K.hand) {
        if (d.q === 'force') {
          // work: force × rope pulled = Σ weight × height raised
          const Fh = B.reduce((s, b, i) => (b.W ? F.add(s, F.mul(F.fr(b.W), F.neg(K.v[i]))) : s), [0, 1]);
          if (F.sign(Fh) <= 0) return { err: 'pulling does not lift anything' };
          return { v: Fh, kind: 'num', unit: 'N', K };
        }
        if (d.q === 'dist') { const r = F.mul(F.neg(K.v[d.load]), F.fr(d.pull)); if (F.sign(r) <= 0) return { err: 'the load does not rise' }; return { v: r, kind: 'num', unit: 'cm', K }; }
        if (d.q === 'n') { const r = F.div([1, 1], F.neg(K.v[d.load])); if (!F.isInt(r)) return { err: 'not a whole number of ropes' }; return { v: r, kind: 'num', unit: 'ropes', K }; }
        if (d.q === 'pullfor') { const r = F.div(F.fr(d.rise), F.neg(K.v[d.load])); return { v: r, kind: 'num', unit: 'cm', K }; }
        return { err: 'unknown rope question' };
      }
      const A = bodyNamed(d.sys, 'A');
      if (d.q === 'way') {
        const dr = drive(d.sys, K.v);
        if (F.zero(dr)) return { v: 2, kind: 'choice', K };
        // the motion that happens: along v if dr > 0, else against it
        const vA = F.mul(K.v[A], [F.sign(dr), 1]);
        return { v: F.sign(vA) > 0 ? 0 : 1, kind: 'choice', K };
      }
      if (d.q === 'mass') {
        const u = d.u;
        const rest = B.reduce((s, b, i) => (i !== u && b.W ? F.add(s, F.mul(F.fr(b.W), K.v[i])) : s), [0, 1]);
        if (F.zero(K.v[u])) return { err: 'the unknown weight does not move' };
        const m = F.div(F.neg(rest), K.v[u]);
        if (F.sign(m) <= 0) return { err: 'no weight balances it' };
        return { v: m, kind: 'num', unit: B[u].un || 'kg', K };
      }
      return { err: 'unknown question' };
    }
    return { err: 'unknown kind ' + d.k };
  }
  function bodyNamed(sys, n) { return sys.bodies.findIndex((b) => b.lbl === n || b.nm === n); }

  /* ================= drawing ================= */

  const f3 = (v) => Math.round(v * 100) / 100;
  const pd = (pts) => 'M' + pts.map((p) => f3(p[0]) + ' ' + f3(p[1])).join('L');
  // an iron weight hanging from (0, 0), sized by its mass
  function weightSVG(label, size, fill, cls) {
    const w = 9 + size * 2.2, h = 10 + size * 1.6;
    return '<g class="' + (cls || '') + '"><path d="M0 0v3" class="pl-string"/><path d="M' + f3(-w / 2 + 2) + ' 3h' + f3(w - 4) + 'l2 ' + f3(h) + 'a1.6 1.6 0 0 1 -1.6 1.8h' + f3(-w + 3.2) + 'a1.6 1.6 0 0 1 -1.6 -1.8z" fill="' + fill('iron') + '" class="pl-iron"/>' +
      '<path d="M' + f3(-w / 4) + ' 3a' + f3(w / 4) + ' ' + f3(w / 4) + ' 0 0 1 ' + f3(w / 2) + ' 0" class="pl-iron-h"/>' +
      '<text y="' + f3(3 + h / 2 + 2.6) + '" class="pl-wl">' + C.esc(label) + '</text></g>';
  }
  function crateSVG(label, fill) {
    return '<path d="M0 0v4" class="pl-string"/><rect x="-15" y="4" width="30" height="24" rx="1.5" fill="' + fill('wood') + '" class="pl-crate"/>' +
      '<path d="M-15 4l30 24M15 4l-30 24" class="pl-crate-x"/><rect x="-15" y="4" width="30" height="24" rx="1.5" class="pl-crate-o"/>' +
      '<rect x="-13" y="11" width="26" height="10" rx="2" class="pl-tagbg"/><text y="18.6" class="pl-wl dark">' + C.esc(label) + '</text>';
  }
  function sheaveSVG(r, fill) {
    let s = '<circle r="' + f3(r + 1) + '" fill="' + fill('steel') + '" class="pl-sheave"/><circle r="' + f3(r - 1.6) + '" class="pl-groove"/>';
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; s += '<path d="M0 0L' + f3((r - 2) * Math.cos(a)) + ' ' + f3((r - 2) * Math.sin(a)) + '" class="pl-spoke"/>'; }
    return s + '<circle r="2" class="pl-hub"/>';
  }
  function handSVG(dirDown) {
    // a wooden handle at the rope's end and an arrow for the pull
    const s = dirDown ? 1 : -1;
    return '<rect x="-7" y="' + (s > 0 ? 0 : -4) + '" width="14" height="4" rx="2" class="pl-handle"/>' +
      '<path d="M11 ' + f3(s * 2) + 'v' + f3(s * 12) + '" class="pl-pull"/><path d="M7.6 ' + f3(s * 12) + 'L11 ' + f3(s * 18) + 'L14.4 ' + f3(s * 12) + 'Z" class="pl-pullh"/>';
  }

  /* ---------- the lever ---------- */

  const U = 20;       // world units between pegs
  // an iron block weight standing on (0, 0)
  function blockSVG(label, m, fill, cls) {
    const s = Math.sqrt(m || 4), w = 9 + s * 3.2, h = 8 + s * 2.6;
    return '<g class="' + (cls || '') + '"><path d="M' + f3(-w * 0.2) + ' ' + f3(-h) + 'a' + f3(w * 0.2) + ' ' + f3(w * 0.2) + ' 0 0 1 ' + f3(w * 0.4) + ' 0" class="pl-iron-h"/>' +
      '<path d="M' + f3(-w / 2) + ' 0L' + f3(-w / 2 + 1.5) + ' ' + f3(-h) + 'H' + f3(w / 2 - 1.5) + 'L' + f3(w / 2) + ' 0Z" fill="' + fill('iron') + '" class="pl-iron"/>' +
      '<text y="' + f3(-h / 2 + 2) + '" class="pl-wl">' + C.esc(label) + '</text></g>';
  }
  const blockH = (m) => 8 + Math.sqrt(m || 4) * 2.6;
  function mountLever(ctx, p, fill, rootG) {
    const d = p.data, wb = ctx.wb, n = d.n;
    const GY = 34, top = -4;           // the ground, and the top of the plank
    const place = d.q === 'place';
    let placed = place ? d.tray.map(() => null) : [];     // peg of each tray weight (null: still in the tray)
    const x0 = -(n + 1.1) * U, x1 = place ? (n + 1.3) * U + d.tray.length * 30 + 14 : (n + 1.1) * U;
    const maxStack = d.w.concat(place ? d.tray.map((m) => [0, m]) : []).reduce((s, w) => s + blockH(w[1]) + 1, 0);
    const y0 = -Math.min(92, Math.max(46, maxStack * 0.8)) - 18;
    wb.setBounds({ x0: x0 - 4, y0, x1: x1 + 4, y1: GY + 14 }, 0.05);
    ctx.s('rect', { x: x0 - 2, y: y0 + 2, width: x1 - x0 + 4, height: GY + 10 - y0, rx: 8, class: 'pl-wall' }, rootG);
    ctx.s('rect', { x: x0 - 2, y: GY, width: x1 - x0 + 4, height: 8, class: 'pl-ground' }, rootG);
    ctx.s('path', { d: 'M0 3L-16 ' + GY + 'H16Z', class: 'pl-fulcrum', fill: fill('iron') }, rootG);
    const props = ctx.s('g', { class: 'pl-props' }, rootG);
    [-1, 1].forEach((sg) => ctx.s('rect', { x: sg * (n + 0.3) * U - 4, y: 4, width: 8, height: GY - 4, rx: 1.5, class: 'pl-prop' }, props));
    const beam = ctx.s('g', { class: 'pl-beam' }, rootG);
    ctx.s('rect', { x: -(n + 0.6) * U, y: -4, width: (2 * n + 1.2) * U, height: 8, rx: 2, fill: fill('woodL'), class: 'pl-plank', 'data-key': 'beam' }, beam);
    for (let x = -n; x <= n; x++) {
      if (x === 0) continue;
      ctx.s('path', { d: 'M' + x * U + ' -4v3', class: 'pl-tick' }, beam);
      ctx.s('text', { x: x * U, y: 2.2, class: 'pl-num onplank', text: String(Math.abs(x)) }, beam);
    }
    ctx.s('circle', { cx: 0, cy: 0, r: 2.6, class: 'pl-pivot' }, beam);
    const wg = ctx.s('g', { class: 'pl-weights' }, beam);
    const trayG = ctx.s('g', null, rootG);
    let tilt = 0, tick = null;
    // the tipped plank's end rests on the ground
    const maxTilt = Math.asin(Math.min(0.5, (GY - 4) / ((n + 0.6) * U))) * 180 / Math.PI;
    // everything standing on the plank: [peg, kg, label, cls, trayIndex]
    function standing() {
      const L = d.w.map(([x, m]) => [x, m, m == null ? '?' : m + ' kg', m == null ? 'unk' : '', -1]);
      placed.forEach((x, i) => { if (x != null) L.push([x, d.tray[i], d.tray[i] + ' kg', 'loose', i]); });
      return L;
    }
    const trayPos = (i) => [(n + 1.3) * U + 14 + i * 30, GY - 1];
    function stackTop(x) { return standing().filter((w) => w[0] === x).reduce((s, w) => s - blockH(w[1]) - 0.6, top); }
    function draw() {
      wg.textContent = '';
      beam.setAttribute('transform', 'rotate(' + f3(tilt) + ')');
      const stack = {};
      standing().forEach(([x, m, lbl, cls, ti]) => {
        const y = stack[x] != null ? stack[x] : top;
        const g = ctx.s('g', { transform: 'translate(' + f3(x * U) + ' ' + f3(y) + ')', 'data-tray': ti }, wg);
        g.innerHTML = blockSVG(lbl, m, fill, cls);
        stack[x] = y - blockH(m) - 0.6;
      });
      trayG.textContent = '';
      if (place) {
        const [tx] = trayPos(0);
        ctx.s('rect', { x: tx - 16, y: GY - 2, width: d.tray.length * 30 + 2, height: 4, rx: 1.5, class: 'pl-tray' }, trayG);
        d.tray.forEach((m, i) => {
          if (placed[i] != null) return;
          const [px, py] = trayPos(i);
          const g = ctx.s('g', { transform: 'translate(' + f3(px) + ' ' + f3(py - 1) + ')', class: 'pl-loose', 'data-tray': i }, trayG);
          g.innerHTML = blockSVG(m + ' kg', m, fill, 'loose');
        });
      }
    }
    function T() { return torque(standing().filter((h) => h[1] != null).map((h) => [h[0], h[1]])); }
    function release(then) {
      if (tick) tick.stop();
      props.style.opacity = 0;
      const t0 = T(), target = F.zero(t0) ? 0 : F.sign(t0) * maxTilt;
      const start = tilt;
      tick = M.ticker((t) => {
        const u = Math.min(1, t / 1.1);
        if (target === 0) tilt = start * (1 - u) + 2.2 * Math.sin(t * 9) * Math.exp(-t * 2.4) * (1 - u * 0.2);
        else { const e = u < 1 ? 1 - Math.pow(1 - u, 3) : 1; tilt = start + (target - start) * e + (u >= 1 ? 0.8 * Math.sin((t - 1.1) * 12) * Math.exp(-(t - 1.1) * 5) : 0); }
        draw();
        if (t > 2) { tilt = target; draw(); tick = null; if (then) then(); return false; }
        return true;
      });
    }
    function hold() { if (tick) tick.stop(); tick = null; tilt = 0; props.style.opacity = 1; draw(); }
    draw();
    // dragging the loose weights onto pegs
    let drag = null;
    if (place) {
      ctx.setGoal('Stand the loose weight' + (d.tray.length > 1 ? 's' : '') + ' on the plank so that it stays level.');
      wb.handlers.board = {
        down(pt, ev, el) {
          const g = el && el.closest ? el.closest('[data-tray]') : null;
          if (!g || +g.getAttribute('data-tray') < 0) return false;
          const i = +g.getAttribute('data-tray');
          hold();
          drag = { i, from: placed[i], ghost: ctx.s('g', { class: 'pl-drag' }, wb.layer('top')) };
          placed[i] = null;
          draw();
          drag.ghost.innerHTML = blockSVG(d.tray[i] + ' kg', d.tray[i], fill, 'loose');
          this.move(pt);
          return true;
        },
        move(pt) {
          if (!drag) return;
          const x = Math.round(pt[0] / U);
          drag.peg = Math.abs(pt[0] - x * U) < U * 0.5 && Math.abs(x) <= n && x !== 0 && pt[1] < 22 && pt[1] > -90 ? x : null;
          const at = drag.peg != null ? [drag.peg * U, stackTop(drag.peg)] : [pt[0], pt[1] + blockH(d.tray[drag.i]) / 2];
          drag.ghost.setAttribute('transform', 'translate(' + f3(at[0]) + ' ' + f3(at[1]) + ')');
          drag.ghost.classList.toggle('snapped', drag.peg != null);
        },
        up() {
          if (!drag) return;
          placed[drag.i] = drag.peg != null ? drag.peg : null;
          drag.ghost.remove();
          const moved = drag.peg !== drag.from;
          drag = null;
          draw();
          if (placed.some((x) => x != null)) ctx.sfx('snap');
          if (moved) { ctx.move(); ctx.changed('hang'); }
        }
      };
    }
    return {
      T, draw, release, hold, props,
      get placed() { return placed; },
      set placed(v) { placed = v.slice(); draw(); },
      destroy() { if (tick) tick.stop(); if (place) wb.handlers.board = null; }
    };
  }

  /* ---------- the crowbar ---------- */

  function mountCrowbar(ctx, p, fill, rootG) {
    const d = p.data, wb = ctx.wb;
    // drawn to scale: the whole bar a + b across ~260 units
    const k = 250 / (d.a + d.b), A = d.a * k, Bl = d.b * k;
    const gy = 80, fx = 0, fy = gy - 12;
    wb.setBounds({ x0: -Bl - 30, y0: -40, x1: A + 70, y1: gy + 30 }, 0.05);
    ctx.s('rect', { x: -Bl - 28, y: -38, width: Bl + A + 96, height: gy + 66, rx: 8, class: 'pl-wall' }, rootG);
    ctx.s('rect', { x: -Bl - 28, y: gy, width: Bl + A + 96, height: 8, class: 'pl-ground' }, rootG);
    ctx.s('path', { d: 'M' + (fx - 11) + ' ' + gy + 'Q' + fx + ' ' + (fy - 6) + ' ' + (fx + 11) + ' ' + gy + 'Z', class: 'pl-stone' }, rootG);
    // the bar rests on the stone, its short end under the rock's edge, rising towards the hand
    const tilt0 = Math.asin(Math.min(0.45, 34 / Bl)) * 180 / Math.PI;
    const tipY = fy + (A + 8) * Math.sin(tilt0 * Math.PI / 180);
    const rock = ctx.s('g', null, rootG);
    rock.innerHTML = '<path d="M' + f3(A + 2) + ' ' + f3(tipY - 1.5) + 'L' + f3(A + 6) + ' ' + f3(fy - 36) + 'L' + f3(A + 34) + ' ' + f3(fy - 46) + 'L' + f3(A + 64) + ' ' + f3(fy - 24) + 'L' + f3(A + 64) + ' ' + gy + 'L' + f3(A + 24) + ' ' + gy + 'Z" class="pl-rock"/>' +
      '<text x="' + f3(A + 34) + '" y="' + f3(fy - 14) + '" class="pl-wl dark">' + d.W + ' N</text>';
    const bar = ctx.s('g', null, rootG);
    bar.innerHTML = '<path d="M' + f3(-Bl) + ' 0H' + f3(A + 8) + '" class="pl-bar"/><path d="M' + f3(A + 8) + ' 0q5 0 7 -4" class="pl-bar"/>';
    const dims = ctx.s('g', { class: 'pl-dims' }, rootG);
    dims.innerHTML = '<path d="M' + f3(-Bl) + ' ' + (gy + 18) + 'H0M' + f3(-Bl) + ' ' + (gy + 14) + 'v8M0 ' + (gy + 14) + 'v8M0 ' + (gy + 18) + 'H' + f3(A) + 'M' + f3(A) + ' ' + (gy + 14) + 'v8" class="pl-dim"/>' +
      '<text x="' + f3(-Bl / 2) + '" y="' + (gy + 15) + '" class="pl-num">' + d.b + ' cm</text><text x="' + f3(A / 2) + '" y="' + (gy + 15) + '" class="pl-num">' + d.a + ' cm</text>';
    const push = ctx.s('g', { class: 'pl-force' }, rootG);
    let ang = tilt0;
    function draw(lift) {
      bar.setAttribute('transform', 'translate(' + fx + ' ' + fy + ') rotate(' + f3(ang) + ')');
      const a = ang * Math.PI / 180;
      const hx = fx - Bl * Math.cos(a), hy = fy - Bl * Math.sin(a);
      push.innerHTML = '<path d="M' + f3(hx) + ' ' + f3(hy - 30) + 'V' + f3(hy - 6) + '" class="pl-pull"/><path d="M' + f3(hx - 4) + ' ' + f3(hy - 10) + 'L' + f3(hx) + ' ' + f3(hy - 3) + 'L' + f3(hx + 4) + ' ' + f3(hy - 10) + 'Z" class="pl-pullh"/><text x="' + f3(hx) + ' " y="' + f3(hy - 34) + '" class="pl-q">?</text>';
      rock.setAttribute('transform', 'rotate(' + f3(-(lift || 0)) + ' ' + f3(A + 64) + ' ' + gy + ')');
    }
    draw(0);
    let tick = null;
    return {
      release(then) {
        if (tick) tick.stop();
        tick = M.ticker((t) => {
          const u = M.ease(Math.min(1, t / 1.4));
          ang = tilt0 - 9 * u;
          draw(Math.asin(Math.min(0.5, (A + 8) * (Math.sin(tilt0 * Math.PI / 180) - Math.sin(ang * Math.PI / 180)) / 62)) * 180 / Math.PI);
          if (t > 1.5) { tick = null; if (then) then(); return false; }
          return true;
        });
      },
      destroy() { if (tick) tick.stop(); }
    };
  }

  /* ---------- the winch ---------- */

  function mountWinch(ctx, p, fill, rootG) {
    const d = p.data, wb = ctx.wb;
    const Rd = 44, rd = Math.max(7, Math.min(22, Rd * d.r / d.R));
    const cy = 0, L0 = 96;
    wb.setBounds({ x0: -Rd - 30, y0: -Rd - 26, x1: Rd + 50, y1: L0 + 44 }, 0.05);
    ctx.s('rect', { x: -Rd - 28, y: -Rd - 24, width: 2 * Rd + 76, height: Rd + L0 + 66, rx: 8, class: 'pl-wall' }, rootG);
    ctx.s('rect', { x: -Rd - 28, y: L0 + 34, width: 2 * Rd + 76, height: 8, class: 'pl-ground' }, rootG);
    // the frame
    ctx.s('path', { d: 'M-14 ' + (L0 + 34) + 'L-4 ' + cy + 'M14 ' + (L0 + 34) + 'L4 ' + cy, class: 'pl-post' }, rootG);
    const drum = ctx.s('g', null, rootG);
    drum.innerHTML = '<circle r="' + f3(rd + 2.5) + '" fill="' + fill('iron') + '" class="pl-flange"/><circle r="' + f3(rd) + '" class="pl-drumrope"/>' +
      [1, 2, 3].map((q) => '<circle r="' + f3(rd - q * rd / 4) + '" class="pl-drumline"/>').join('') + '<path d="M0 ' + f3(-rd) + 'V' + f3(rd) + '" class="pl-drumline"/>';
    const crank = ctx.s('g', null, rootG);
    crank.innerHTML = '<path d="M0 0L' + Rd + ' 0" class="pl-crank"/><circle cx="' + Rd + '" r="4.5" fill="' + fill('wood') + '" class="pl-knob"/><circle r="3.2" class="pl-hub"/>';
    ctx.s('circle', { r: Rd, class: 'pl-crank-path' }, rootG);
    const rope = ctx.s('path', { class: 'pl-rope' }, rootG);
    const load = ctx.s('g', null, rootG);
    load.innerHTML = crateSVG(d.W + ' N', fill);
    const lbl = ctx.s('g', { class: 'pl-dims' }, rootG);
    lbl.innerHTML = '<text x="6" y="' + f3(-Rd / 2) + '" class="pl-num" text-anchor="start" style="text-anchor:start">crank ' + d.R + ' cm</text><text x="' + f3(-rd - 6) + '" y="' + f3(rd + 12) + '" class="pl-num" style="text-anchor:end">drum ' + (d.q === 'rise' ? d.circ + ' cm round' : d.r + ' cm') + '</text>';
    let rot = -90, rise = 0;
    function draw() {
      crank.setAttribute('transform', 'rotate(' + f3(rot) + ')');
      drum.setAttribute('transform', 'rotate(' + f3(rot) + ')');
      const y = L0 - rise;
      rope.setAttribute('d', 'M' + f3(rd) + ' 0V' + f3(y));
      load.setAttribute('transform', 'translate(' + f3(rd) + ' ' + f3(y) + ')');
    }
    draw();
    let tick = null;
    return {
      release(then) {
        if (tick) tick.stop();
        const turns = d.q === 'rise' ? Math.min(d.n, 3) : 1;
        const riseTo = Math.min(56, turns * 2 * Math.PI * rd);
        tick = M.ticker((t) => {
          const u = M.ease(Math.min(1, t / (1.6 * turns)));
          rot = -90 - 360 * turns * u;
          rise = riseTo * u;
          draw();
          if (u >= 1) { tick = null; if (then) then(); return false; }
          return true;
        });
      },
      destroy() { if (tick) tick.stop(); }
    };
  }

  /* ---------- ropes and pulleys ---------- */

  // the straight runs of every rope, with the bodies at their ends
  function runs(sys, disp) {
    const out = [];
    sys.ropes.forEach((rope, ri) => {
      for (let i = 0; i < rope.length - 1; i++) {
        const a = itemPts(sys, rope[i], disp)[1], b = itemPts(sys, rope[i + 1], disp)[0];
        out.push({ ri, i, a, b, ba: bodyOf(sys, rope[i]), bb: bodyOf(sys, rope[i + 1]) });
      }
    });
    return out;
  }
  function ropePath(sys, rope, disp) {
    const pts = [];
    rope.forEach((it) => {
      const [en, , c] = itemPts(sys, it, disp);
      if (it.s == null) { pts.push(en); return; }
      const r = sys.sheaves[it.s].r;
      const a0 = it.d > 0 ? Math.PI : 0;
      const sweep = (it.o ? 1 : -1) * (it.d > 0 ? 1 : -1) * Math.PI;
      for (let k = 0; k <= 10; k++) { const a = a0 + sweep * k / 10; pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]); }
    });
    return pts;
  }
  function ropeExtent(sys) {
    const xs = [], ys = [0];
    sys.bodies.forEach((b) => { if (b.t !== 'fix') { xs.push(b.x - 18, b.x + 18); ys.push(b.y + (b.W ? 44 : 14)); } });
    sys.sheaves.forEach((s) => { const o = s.b >= 0 ? [sys.bodies[s.b].x, sys.bodies[s.b].y] : [0, 0]; xs.push(o[0] + s.x - s.r - 6, o[0] + s.x + s.r + 6); ys.push(o[1] + s.y + s.r + 6); });
    sys.ropes.forEach((r) => r.forEach((it) => { if (it.h) { xs.push(it.x - 12, it.x + 22); ys.push(it.y + 26); } }));
    return { x0: Math.min(...xs) - 10, x1: Math.max(...xs) + 10, y0: -18, y1: Math.max(...ys) + 8 };
  }

  function mountRope(ctx, p, fill, rootG) {
    const d = p.data, sys = d.sys, wb = ctx.wb;
    const K = ropeKin(sys);
    const e = ropeExtent(sys);
    wb.setBounds(e, 0.05);
    ctx.s('rect', { x: e.x0, y: e.y0, width: e.x1 - e.x0, height: e.y1 - e.y0, rx: 8, class: 'pl-wall' }, rootG);
    ctx.s('rect', { x: e.x0 + 4, y: -8, width: e.x1 - e.x0 - 8, height: 8, rx: 1.5, fill: fill('woodL'), class: 'pl-beamc' }, rootG);
    // fixed sheaves hang from straps; a group of them makes an upper block
    const fixedG = ctx.s('g', null, rootG);
    const ropeG = ctx.s('g', null, rootG);
    const movG = ctx.s('g', null, rootG);
    const topG = ctx.s('g', null, rootG);
    (sys.blocks || []).forEach((bl) => {
      if (bl.b >= 0 || !bl.s.length) return;
      const ss = bl.s.map((i) => sys.sheaves[i]);
      const x0 = Math.min(...ss.map((s) => s.x - s.r)) - 3, x1 = Math.max(...ss.map((s) => s.x + s.r)) + 3, y = ss[0].y;
      const mid = (x0 + x1) / 2;
      ctx.s('path', { d: 'M' + f3(mid) + ' 0V' + f3(y - ss[0].r - 4), class: 'pl-strap' }, fixedG);
      ctx.s('rect', { x: f3(x0), y: f3(y - ss[0].r - 4), width: f3(x1 - x0), height: f3(2 * ss[0].r + 8), rx: 4, class: 'pl-frame' }, fixedG);
    });
    // ceiling eye bolts for rope ends
    sys.ropes.forEach((r) => r.forEach((it) => { if (it.a === -1) ctx.s('circle', { cx: it.x, cy: it.y - 1.5, r: 2, class: 'pl-eye' }, topG); }));
    const sheaveEls = sys.sheaves.map((s) => {
      const g = ctx.s('g', null, s.b >= 0 ? movG : fixedG);
      g.innerHTML = sheaveSVG(s.r, fill);
      return g;
    });
    // movable bodies: a block frame, its hook and its load
    const bodyEls = sys.bodies.map((b, i) => {
      if (b.t === 'fix') return null;
      const g = ctx.s('g', { class: 'pl-body' }, movG);
      const ss = sys.sheaves.filter((s) => s.b === i);
      let s = '';
      let hookY = 0;
      if (ss.length) {
        const x0 = Math.min(...ss.map((q) => q.x - q.r)) - 3, x1 = Math.max(...ss.map((q) => q.x + q.r)) + 3, r = ss[0].r;
        const ax = sys.ropes.reduce((m, rp) => m.concat(rp.filter((it) => it.a === i).map((it) => it.x)), []);
        const fx0 = Math.min(x0, ...ax.map((x) => x - 3)), fx1 = Math.max(x1, ...ax.map((x) => x + 3));
        s += '<rect x="' + f3(fx0) + '" y="' + f3(-r - 4) + '" width="' + f3(fx1 - fx0) + '" height="' + f3(2 * r + 8) + '" rx="4" class="pl-frame"/>';
        hookY = r + 4;
        if (b.W || b.unk) { s += '<path d="M0 ' + f3(hookY) + 'v5" class="pl-hookline"/><path d="M0 ' + f3(hookY + 5) + 'a3 3 0 1 0 3 3" class="pl-hook"/>'; hookY += 11; }
      }
      g.setAttribute('data-body', i);
      g.innerHTML = s;
      if (b.W) {
        const lg = ctx.s('g', { transform: 'translate(0 ' + f3(hookY) + ')' }, g);
        const txt = b.txt || b.lbl || '';
        lg.innerHTML = b.sh === 'weight' ? weightSVG(txt, Math.sqrt(b.m || b.W / 10) * 1.6, fill, b.unk ? 'unk' : '') : crateSVG(txt, fill);
        if (b.nm) ctx.s('text', { x: -18, y: hookY + 16, class: 'pl-name', text: b.nm }, g);
      }
      return g;
    });
    const ropeEls = sys.ropes.map(() => ctx.s('path', { class: 'pl-rope' }, ropeG));
    const handEls = sys.ropes.map((r) => { const h = r.find((it) => it.h); if (!h) return null; const g = ctx.s('g', { class: 'pl-hand' }, topG); g.innerHTML = handSVG(true); return g; });
    const hintG = ctx.s('g', { class: 'pl-hints' }, wb.layer('top'));
    // pose: s = how far the hand has pulled (or how far the free system has run)
    function pose(s) {
      const disp = {};
      sys.bodies.forEach((b, i) => { disp[i] = K.err ? 0 : F.num(K.v[i]) * s; });
      disp.hand = s;
      sys.bodies.forEach((b, i) => { if (bodyEls[i]) bodyEls[i].setAttribute('transform', 'translate(' + f3(b.x) + ' ' + f3(b.y + disp[i]) + ')'); });
      // sheaves turn with the rope running over them
      sys.ropes.forEach((rope, ri) => {
        let pre = 0;
        rope.forEach((it, k) => {
          if (k > 0) {
            const a = itemPts(sys, rope[k - 1])[1], b = itemPts(sys, it)[0];
            const up = a[1] < b[1] ? rope[k - 1] : it, lo = up === it ? rope[k - 1] : it;
            const dv = (x) => { const bb = bodyOf(sys, x); return bb === 'h' ? (x === lo ? s : -s) : bb < 0 ? 0 : disp[bb]; };
            pre += dv(lo) - dv(up);
          }
          if (it.s != null) {
            const sh = sys.sheaves[it.s];
            const ang = (it.o ? 1 : -1) * it.d * (-pre) / sh.r * 180 / Math.PI;
            const o = sh.b >= 0 ? [sys.bodies[sh.b].x, sys.bodies[sh.b].y + disp[sh.b]] : [0, 0];
            sheaveEls[it.s].setAttribute('transform', 'translate(' + f3(o[0] + sh.x) + ' ' + f3(o[1] + sh.y) + ') rotate(' + f3(ang) + ')');
          }
        });
        ropeEls[ri].setAttribute('d', pd(ropePath(sys, rope, disp)));
        const h = rope.find((it) => it.h);
        if (h) handEls[ri].setAttribute('transform', 'translate(' + f3(h.x) + ' ' + f3(h.y + s) + ')');
      });
    }
    pose(0);
    let tick = null;
    return {
      K,
      release(then) {
        if (tick) tick.stop();
        let dir = 1, amp = 24;
        if (!K.hand && !K.err) {
          const dr = drive(sys, K.v);
          dir = F.zero(dr) ? 0 : F.sign(dr);
        }
        const vmax = Math.max(1, ...sys.bodies.map((b, i) => Math.abs(F.num(K.v[i]))));
        amp = (K.hand ? 30 : 22) / (K.hand ? 1 : vmax);
        tick = M.ticker((t) => {
          const u = Math.min(1, t / 1.8);
          if (dir === 0) pose(3 * Math.sin(t * 8) * Math.exp(-t * 2));
          else pose(dir * amp * M.ease(u));
          if (t > 2) { if (dir === 0) pose(0); tick = null; if (then) then(); return false; }
          return true;
        });
      },
      showRuns(filter, cls) {
        hintG.textContent = '';
        runs(sys).forEach((r) => { if (filter(r)) ctx.s('path', { d: pd([r.a, r.b]), class: cls || 'pl-hintrun' }, hintG); });
        setTimeout(() => { hintG.textContent = ''; }, 7000);
      },
      label(pt, text) { const g = ctx.s('g', { class: 'pl-hinttag' }, hintG); ctx.s('rect', { x: pt[0] - 14, y: pt[1] - 5, width: 28, height: 10, rx: 5 }, g); ctx.s('text', { x: pt[0], y: pt[1] + 2.2, text }, g); setTimeout(() => g.remove(), 8000); },
      destroy() { if (tick) tick.stop(); }
    };
  }

  /* ================= the puzzle page ================= */

  function ask(d) {
    if (d.k === 'lever') return d.q === 'tip' ? 'Take the props away. What happens?' : d.q === 'mass' ? 'How heavy must the **?** weight be?' : '';
    if (d.k === 'crowbar') return 'How hard must you push down?';
    if (d.k === 'winch') return d.q === 'force' ? 'How hard must you push on the handle?' : 'How far does the crate rise?';
    if (d.q === 'force') return 'How hard must you pull to hold the load?';
    if (d.q === 'dist') return 'How far does the load rise?';
    if (d.q === 'n') return 'How many times less than the load is the pull?';
    if (d.q === 'pullfor') return 'How much rope must you pull?';
    if (d.q === 'way') return 'Which way does it run?';
    if (d.q === 'mass') return 'How heavy must **B** be to balance?';
    return '';
  }
  function choicesOf(d) { return d.k === 'lever' ? TIPS.slice() : d.q === 'way' ? wayChoices(d) : null; }

  function mount(ctx, p) {
    const d = p.data, wb = ctx.wb;
    const uid = M.uid('pl');
    const rootG = ctx.s('g', { class: 'pl' }, wb.layer('board'));
    M.defs(rootG, uid);
    const fill = (m) => 'url(#' + uid + '-' + m + ')';
    const sol = solve(d);
    const V = d.k === 'lever' ? mountLever(ctx, p, fill, rootG) : d.k === 'crowbar' ? mountCrowbar(ctx, p, fill, rootG) : d.k === 'winch' ? mountWinch(ctx, p, fill, rootG) : mountRope(ctx, p, fill, rootG);
    let box = null, done = false;
    const again = ctx.button(d.k === 'lever' ? 'Let go again' : d.k === 'rope' && d.q !== 'way' && d.q !== 'mass' ? 'Pull again' : 'Run it again', () => { if (V.hold) V.hold(); setTimeout(() => V.release(), C.anim(120)); }, 'small');
    again.hidden = true;
    const finish = () => { done = true; again.hidden = false; setTimeout(() => V.release(), C.anim(200)); };
    if (sol.kind === 'choice' || sol.kind === 'num') {
      const choices = choicesOf(d);
      box = ctx.answer({
        kind: sol.kind === 'choice' ? 'choice' : 'number',
        choices, unit: sol.unit, label: ask(d), placeholder: 'e.g. 150 or 75/2',
        check(v) {
          if (sol.kind === 'choice') {
            if (v === sol.v) { finish(); return { ok: true, msg: 'Yes: **' + choices[v] + '**.' }; }
            return { ok: false, msg: wrongChoice(d, v) };
          }
          const x = M.readNum(v);
          if (isNaN(x)) return { ok: false, msg: 'That does not look like a number.' };
          if (M.matches(x, sol.v)) { if (d.k === 'lever' && d.q === 'mass') fillUnknown(); finish(); return { ok: true, msg: 'Yes: **' + M.fracText(sol.v) + ' ' + sol.unit + '**.' }; }
          return { ok: false, msg: wrongNum(d, x, sol) };
        }
      });
    }
    function fillUnknown() {
      d.w = d.w.map((w, i) => (i === d.u ? [w[0], F.num(sol.v)] : w));
      V.draw();
    }
    return {
      noMoves: !(d.k === 'lever' && d.q === 'place'),
      check: d.k === 'lever' && d.q === 'place' ? () => {
        const pl = V.placed;
        if (pl.some((x) => x == null)) return { solved: false, msg: 'Put ' + (d.tray.length > 1 ? 'every loose weight' : 'the loose weight') + ' on the plank first.' };
        const T = V.T();
        if (F.zero(T)) { if (!done) finish(); return { solved: true, msg: 'Weight × distance is the same on both sides: it balances.' }; }
        return { solved: false, msg: 'Not balanced yet: the ' + (F.sign(T) > 0 ? 'right' : 'left') + ' side would go down.' };
      } : undefined,
      hint(n) { return hintFor(d, sol, V, n); },
      solve() {
        if (d.k === 'lever' && d.q === 'place') { V.placed = sol.ways[0]; ctx.changed('solve'); return; }
        if (box) box.feedback('The answer: <b>' + C.esc(sol.kind === 'choice' ? choicesOf(d)[sol.v] : M.fracText(sol.v) + ' ' + sol.unit) + '</b>', 'good');
        if (d.k === 'lever' && d.q === 'mass') fillUnknown();
        finish();
      },
      explain() { return explainOf(d, sol); },
      getState() { return d.k === 'lever' && d.q === 'place' ? { placed: V.placed } : null; },
      setState(s) { if (s && s.placed && d.k === 'lever') V.placed = s.placed; },
      destroy() { V.destroy(); }
    };
  }

  function wrongChoice(d, v) {
    if (d.k === 'lever') return v === 2 ? 'Add up weight × distance on each side: are the two totals really equal?' : 'Weight alone does not decide it — distance from the pivot counts just as much.';
    return v === 2 ? 'Not quite balanced. Remember a movable pulley halves the pull of what hangs on it.' : 'The heavier weight does not always win: what does a movable pulley do to its weight\'s pull?';
  }
  function wrongNum(d, x, sol) {
    const t = F.num(sol.v);
    if (d.k === 'rope' && sol.K && sol.K.hand && d.q === 'force') {
      const W = d.sys.bodies.reduce((s, b) => s + (b.W || 0), 0);
      if (Math.abs(x - W) < 1e-6) return 'That is the whole weight — but the rope pulls on the load in several places at once.';
    }
    if (d.k === 'crowbar' && Math.abs(x - d.W * d.b / d.a) < 1e-6) return 'The distances are the wrong way round: the long arm is on your side.';
    if (d.k === 'winch' && d.q === 'force' && Math.abs(x - d.W * d.R / d.r) < 1e-6) return 'Upside down: the big circle is the crank\'s, so you push less than the weight.';
    if (Math.abs(x - t) < 0.1 * Math.abs(t)) return 'Close, but not exact.';
    return x > t ? 'Less than that.' : 'More than that.';
  }
  function hintFor(d, sol, V, n) {
    if (d.k === 'lever') {
      const known = d.w.filter((x) => x[1] != null);
      const L = known.filter((x) => x[0] < 0).reduce((s, [x, m]) => s + -x * m, 0), Rr = known.filter((x) => x[0] > 0).reduce((s, [x, m]) => s + x * m, 0);
      if (n === 0) return 'For each weight, multiply its kilograms by its distance from the pivot (the numbers on the beam). The side with the bigger total goes down; equal totals balance.';
      if (n === 1) return 'Left side: ' + known.filter((x) => x[0] < 0).map(([x, m]) => m + ' × ' + -x).join(' + ') + ' = **' + L + '**. Right side: ' + (known.filter((x) => x[0] > 0).map(([x, m]) => m + ' × ' + x).join(' + ') || '0') + ' = **' + Rr + '**.';
      if (n === 2 && d.q === 'mass') { const x = Math.abs(d.w[d.u][0]); return 'The ? weight stands ' + x + ' marks out; its side is short by ' + Math.abs(L - Rr) + '. So it must weigh ' + Math.abs(L - Rr) + ' ÷ ' + x + '.'; }
      if (n === 2 && d.q === 'place') return 'The difference is ' + Math.abs(L - Rr) + '. The loose weight' + (d.tray.length > 1 ? 's' : '') + ' must make up exactly that on the ' + (L > Rr ? 'right' : 'left') + ' side.';
      return null;
    }
    if (d.k === 'crowbar') {
      if (n === 0) return 'A lever trades distance for force: push × long arm = load × short arm.';
      if (n === 1) return 'Push × ' + d.b + ' = ' + d.W + ' × ' + d.a + '.';
      return null;
    }
    if (d.k === 'winch') {
      if (d.q === 'force') { if (n === 0) return 'In one turn your hand goes round the crank\'s big circle, while the rope winds in only the drum\'s small circle.'; if (n === 1) return 'Push × ' + d.R + ' = ' + d.W + ' × ' + d.r + ' (the circles are in proportion to their radii).'; return null; }
      if (n === 0) return 'Each turn of the drum winds in one drum\'s round of rope.'; return null;
    }
    const K = sol.K;
    if (K && K.hand) {
      const load = d.load != null ? d.load : d.sys.bodies.findIndex((b) => b.W);
      if (n === 0) return 'Count the rope runs that hold up the moving block (not the one you pull on, if it comes down from above). The rope pulls equally along its whole length.';
      if (n === 1) return { text: 'These are the runs that carry the load (glowing).', show() { V.showRuns((r) => (r.ba !== 'h' && r.bb !== 'h') && ((r.ba >= 0 && d.sys.bodies[r.ba].t !== 'fix') || (r.bb >= 0 && d.sys.bodies[r.bb].t !== 'fix'))); } };
      if (n === 2) { const f = F.neg(K.v[load]); return 'Pulling 1 cm of rope lifts the load ' + M.fracText(f) + ' cm.'; }
      return null;
    }
    if (n === 0) return 'A weight on a movable pulley hangs from two runs of the rope, so it pulls on the rope with only half its weight — and it moves only half as far.';
    if (n === 1) return 'Weigh each side by how far it moves: ' + moveWeights(d, K) + '. The bigger product goes down; equal products balance.';
    return null;
  }
  // "A: 3 × 1, B: 5 × ½" — each weight times how far it moves (the largest move counted as 1)
  function moveWeights(d, K) {
    const B = d.sys.bodies;
    let big = [0, 1];
    B.forEach((b, i) => { if (b.W != null && F.num(F.abs(K.v[i])) > F.num(big)) big = F.abs(K.v[i]); });
    return B.map((b, i) => (b.W != null && b.nm ? b.nm + ': ' + (b.unk ? '?' : b.W) + ' × ' + F.nice(F.div(F.abs(K.v[i]), big)) : null)).filter(Boolean).join(', ');
  }
  function explainOf(d, sol) {
    if (d.k === 'lever') {
      const all = d.w.map(([x, m]) => [x, m == null ? F.num(sol.v) : m]).concat(d.q === 'place' ? sol.ways[0].map((x, i) => [x, d.tray[i]]) : []);
      const side = (s) => all.filter((w) => Math.sign(w[0]) === s);
      const sum = (L) => L.reduce((t, [x, m]) => t + Math.abs(x) * m, 0);
      const txt = (L) => L.map(([x, m]) => m + ' × ' + Math.abs(x)).join(' + ') || '0';
      let s = 'Weight × distance on the left: ' + txt(side(-1)) + ' = **' + sum(side(-1)) + '**; on the right: ' + txt(side(1)) + ' = **' + sum(side(1)) + '**. ';
      if (d.q === 'tip') s += sol.v === 2 ? 'Equal turning effects: **it stays level**.' : 'The ' + (sol.v === 1 ? 'right' : 'left') + ' side turns harder, so **the ' + (sol.v === 1 ? 'right' : 'left') + ' end goes down**.';
      else if (d.q === 'mass') s += 'So the ? weight is **' + M.fracText(sol.v) + ' kg**.';
      else s += 'Equal: it balances.' + (sol.ways.length > 1 ? ' (That is one of ' + sol.ways.length + ' ways.)' : '');
      return s + ' This is Archimedes\' law of the lever.';
    }
    if (d.k === 'crowbar') return 'Push × ' + d.b + ' cm = ' + d.W + ' N × ' + d.a + ' cm, so the push is ' + d.W + ' × ' + d.a + ' ÷ ' + d.b + ' = **' + M.fracText(sol.v) + ' N**. The price: your end moves ' + M.fracText(F.fr(d.b, d.a)) + ' times as far as the rock.';
    if (d.k === 'winch') {
      if (d.q === 'force') return 'In one turn your hand travels round a circle ' + d.R + '/' + d.r + ' times as big as the drum\'s, so the push is ' + d.W + ' × ' + d.r + ' ÷ ' + d.R + ' = **' + M.fracText(sol.v) + ' N**.';
      return 'Each turn winds in ' + d.circ + ' cm of rope, so ' + d.n + ' turns lift the crate **' + (d.n * d.circ) + ' cm** — the crank\'s size does not matter for this.';
    }
    const K = sol.K;
    if (K.hand) {
      const load = d.load != null ? d.load : d.sys.bodies.findIndex((b) => b.W);
      const r = F.neg(K.v[load]);
      const n = F.div([1, 1], r);
      let s = 'For every centimetre of rope you pull, the load rises ' + M.fracText(r) + ' cm (the rope runs holding it up share the pull: ' + M.fracText(n) + ' of them in effect). ';
      if (d.q === 'force') s += 'Work in = work out, so the pull is the weight × ' + M.fracText(r) + ' = **' + M.fracText(sol.v) + ' N**.';
      if (d.q === 'dist') s += 'So ' + d.pull + ' cm of rope lifts it **' + M.fracText(sol.v) + ' cm**.';
      if (d.q === 'n') s += 'So the pull is **' + M.fracText(sol.v) + '** times less than the load.';
      if (d.q === 'pullfor') s += 'To lift it ' + d.rise + ' cm you must pull **' + M.fracText(sol.v) + ' cm** of rope.';
      return s + ' No pulley saves work: what you gain in force you pay in distance.';
    }
    const B = d.sys.bodies;
    if (d.q === 'way') {
      const dr = drive(d.sys, K.v);
      return 'Weigh each side by how far it would move (' + moveWeights(d, K) + '). ' + (F.zero(dr) ? 'The products are equal: **it balances**.' : 'The bigger product wins — the weights run the way that lowers them most: **' + wayChoices(d)[solve(d).v].toLowerCase() + '**.') + ' A movable pulley halves a weight\'s pull, but doubles how far everything else must move.';
    }
    return 'For a balance, weight × movement must be the same on both sides (' + moveWeights(d, K) + '), which makes B **' + M.fracText(sol.v) + ' ' + (B[d.u].un || 'kg') + '**.';
  }

  /* ================= making puzzles ================= */

  const LEVER_TEXT = {
    tip: 'A plank balances on a pivot and is held level by two props; weights stand on it at the numbered marks, which give their distances from the pivot (the plank itself weighs nothing). Take the props away — what happens?',
    mass: 'What must the weight marked **?** weigh for the plank to stay level when the props are taken away?',
    place: 'Stand the loose weight on the plank at one of the marks so that the plank stays level when the props are taken away.'
  };
  const MAKE = {
    lever(rng, lv, q) {
      q = q || (lv === 1 ? 'tip' : lv === 2 ? rng.pick(['tip', 'mass']) : lv === 3 ? rng.pick(['tip', 'mass', 'place']) : rng.pick(['mass', 'place', 'place']));
      const n = lv === 1 ? 3 : lv === 2 ? 4 : 5;
      for (let tries = 0; tries < 200; tries++) {
        const per = lv === 1 ? 1 : lv === 2 ? rng.range(1, 2) : rng.range(2, lv >= 4 ? 3 : 2);
        const w = [];
        const used = new Set();
        [-1, 1].forEach((sg) => {
          const k = sg < 0 ? per : Math.max(1, per - (rng() < 0.4 ? 1 : 0));
          for (let i = 0; i < k; i++) { let x; for (let a = 0; a < 10; a++) { x = sg * rng.range(1, n); if (!used.has(x)) break; } if (used.has(x)) continue; used.add(x); w.push([x, rng.range(1, lv <= 2 ? 6 : 9)]); }
        });
        const d = { k: 'lever', n, w, q };
        if (q === 'tip') {
          const T = torque(w);
          // the heavier side is not always the winner
          const L = w.filter((x) => x[0] < 0).reduce((s, x) => s + x[1], 0), Rr = w.filter((x) => x[0] > 0).reduce((s, x) => s + x[1], 0);
          if (lv >= 2 && Math.sign(Rr - L) === F.sign(T) && rng() < 0.75) continue;
          if (!F.zero(T) && rng() < 0.3 && lv >= 2) continue;
        } else if (q === 'mass') {
          const i = rng.int(w.length);
          d.u = i;
          const x = w[i][0];
          const T = torque(w.filter((_, j) => j !== i));
          const m = F.div(F.neg(T), F.fr(x));
          if (F.sign(m) <= 0 || !F.isInt(m) || m[0] > 20) continue;
          w[i] = [x, null];
        } else {
          const k = lv >= 5 ? 2 : 1;
          d.tray = [];
          for (let i = 0; i < k; i++) d.tray.push(rng.range(1, 8));
          const ps = placements(d, 60);
          if (!ps.length || (k === 1 && ps.length !== 1)) continue;
          if (k === 2 && ps.length > 6) continue;
        }
        const s = solve(d);
        if (s.err) continue;
        if (q !== 'place') d.ans = s.kind === 'choice' ? s.v : s.v;
        return { data: d, text: LEVER_TEXT[q] + (q === 'place' && d.tray.length > 1 ? ' (Two weights this time: place both.)' : '') };
      }
      return null;
    },
    crowbar(rng, lv) {
      for (let tries = 0; tries < 200; tries++) {
        const a = rng.pick([5, 8, 10, 12, 15, 20, 25]), b = rng.pick([60, 75, 80, 90, 100, 120, 125, 150]);
        const W = rng.pick([300, 400, 500, 600, 800, 900, 1000, 1200, 1500]);
        const v = F.fr(W * a, b);
        if (lv <= 2 && !F.isInt(v)) continue;
        if (v[1] > 4) continue;
        const d = { k: 'crowbar', a, b, W, ans: v };
        return { data: d, text: 'A rock weighing **' + W + ' N** rests on the end of a crowbar, ' + a + ' cm from the stone it pivots on. You push down on the other end, ' + b + ' cm from the stone. How hard must you push to lift the rock?' };
      }
      return null;
    },
    tackle(rng, lv) {
      const opts = lv === 1 ? [[1, false], [1, true]] : lv === 2 ? [[1, true], [2, false]] : lv === 3 ? [[2, false], [2, true]] : lv === 4 ? [[2, true], [3, false], [3, true]] : [[3, true], [3, false]];
      const [k, up] = rng.pick(opts);
      const MA = up ? 2 * k : 2 * k - 1;
      const q = lv === 1 ? 'force' : lv === 2 ? rng.pick(['force', 'dist']) : lv === 3 ? rng.pick(['force', 'dist', 'n']) : rng.pick(['force', 'pullfor', 'dist']);
      const W = MA * rng.pick(lv <= 2 ? [50, 100, 150, 200] : [40, 60, 75, 90, 120, 150]) * (lv >= 4 && rng() < 0.3 ? 1.5 : 1);
      const sys = tackle(k, up, Math.round(W));
      const d = { k: 'rope', sys, q, load: 1 };
      if (q === 'dist') d.pull = MA * rng.pick([5, 10, 15, 20, 30]);
      if (q === 'pullfor') d.rise = rng.pick([10, 15, 20, 25, 40, 50]);
      const s = solve(d);
      if (s.err) return null;
      if (lv <= 3 && !F.isInt(s.v)) return null;
      d.ans = s.v;
      const text = { force: 'The crate weighs **' + Math.round(W) + ' N**. Ignoring friction and the weight of the pulleys, how hard must you pull the rope to hold it up?', dist: 'You pull **' + d.pull + ' cm** of rope down through your hands. How far does the crate rise?', n: 'How many times less than the crate\'s weight is the pull you need to hold it?', pullfor: 'How much rope must you pull to raise the crate **' + d.rise + ' cm**?' }[q];
      return { data: d, text };
    },
    cascade(rng, lv) {
      const st = lv >= 5 ? rng.pick([2, 3]) : 2;
      const MA = Math.pow(2, st);
      const q = rng.pick(['force', 'pullfor', 'dist']);
      const W = MA * rng.pick([25, 50, 75, 100, 125]);
      const d = { k: 'rope', sys: cascade(st, W), q, load: st };
      if (q === 'dist') d.pull = MA * rng.pick([5, 10, 20]);
      if (q === 'pullfor') d.rise = rng.pick([10, 15, 20, 25]);
      const s = solve(d);
      if (s.err) return null;
      d.ans = s.v;
      const text = (st === 2 ? 'Two movable pulleys, one hanging from the other, lift the crate. ' : 'Three movable pulleys, each hanging from the one above, lift the crate. ') +
        { force: 'The crate weighs **' + W + ' N**. How hard must you pull to hold it?', dist: 'You pull **' + d.pull + ' cm** of rope. How far does the crate rise?', pullfor: 'How much rope must you pull to raise the crate **' + d.rise + ' cm**?' }[q];
      return { data: d, text };
    },
    balance(rng, lv, q) {
      q = q || (lv <= 3 ? 'way' : rng.pick(['way', 'mass', 'mass']));
      for (let tries = 0; tries < 100; tries++) {
        const movA = lv >= 2 && rng() < (lv >= 4 ? 0.5 : 0.25), movB = lv >= 2 && (lv === 2 || rng() < 0.7);
        const WA = rng.range(1, 9), WB = rng.range(1, 9);
        if (lv === 1 && (movA || movB)) continue;
        const d = { k: 'rope', q, sys: balance(WA, q === 'mass' ? null : WB, movA, movB) };
        if (q === 'mass') d.u = 2;
        const s = solve(d);
        if (s.err) continue;
        if (q === 'mass' && (!F.isInt(s.v) || s.v[0] > 30)) continue;
        if (q === 'way') {
          // the heavier weight should not always be the one that sinks
          if (lv >= 2 && WA !== WB && (s.v === (WA > WB ? 0 : 1)) && rng() < 0.7) continue;
          if (lv >= 3 && s.v !== 2 && rng() < 0.15) continue;
        }
        d.ans = s.v;
        const text = q === 'way'
          ? 'Two weights hang from one rope over a fixed pulley' + (movA || movB ? ' — ' + (movA && movB ? 'each of them' : 'one of them') + ' on a movable pulley of its own' : '') + '. The pulleys are free and weigh nothing. Let go: which way does it run?'
          : 'Weight A hangs from a rope over a fixed pulley' + (movA ? ' on a movable pulley of its own' : '') + ', and B ' + (movB ? 'on a movable pulley' : 'hangs from the other end') + '. What must B weigh so that nothing moves?';
        return { data: d, text };
      }
      return null;
    },
    winch(rng, lv) {
      const q = lv <= 1 ? 'rise' : lv === 2 ? rng.pick(['rise', 'force']) : 'force';
      for (let tries = 0; tries < 200; tries++) {
        const R = rng.pick([20, 25, 30, 36, 40, 45, 50, 60]), r = rng.pick([4, 5, 6, 8, 10, 12, 15]);
        if (r * 2 > R) continue;
        const W = rng.pick([100, 150, 200, 240, 300, 360, 400, 450, 500, 600, 800]);
        const d = { k: 'winch', R, r, W, q };
        if (q === 'rise') { d.n = rng.range(2, 6); d.circ = rng.pick([25, 30, 40, 50, 60]); }
        const s = solve(d);
        if (q === 'force' && lv <= 3 && !F.isInt(s.v)) continue;
        if (s.v[1] > 6) continue;
        d.ans = s.v;
        const text = q === 'force'
          ? 'A winch lifts a crate of **' + W + ' N**. Your hand on the crank goes round a circle of radius ' + R + ' cm; the rope winds onto a drum of radius ' + r + ' cm. Ignoring friction, how hard must you push on the handle?'
          : 'The winch\'s drum is **' + d.circ + ' cm** round. You turn the handle **' + d.n + ' times**. How far does the crate rise?';
        return { data: d, text };
      }
      return null;
    }
  };
  const KINDS = [null,
    ['lever', 'lever', 'crowbar', 'tackle', 'winch', 'balance'],
    ['lever', 'lever', 'crowbar', 'tackle', 'tackle', 'winch', 'balance'],
    ['lever', 'lever', 'crowbar', 'tackle', 'tackle', 'winch', 'balance'],
    ['lever', 'lever', 'tackle', 'cascade', 'winch', 'balance', 'balance'],
    ['lever', 'lever', 'tackle', 'cascade', 'balance', 'balance']
  ];
  const TITLE = { lever: 'The see-saw', crowbar: 'The crowbar', tackle: 'Block and tackle', cascade: 'Pulleys on pulleys', balance: 'Which way will it run?', winch: 'The winch' };
  function make(rng, lv, kind) {
    kind = kind || rng.pick(KINDS[lv]);
    for (let k = 0; k < 20; k++) {
      const r = MAKE[kind](rng, lv);
      if (r) { r.kind = kind; r.diff = lv; return r; }
    }
    return null;
  }

  /* ================= the engine ================= */

  C.engine({
    id: 'pulleys',
    name: 'Pulleys and levers',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'],
    deps: ['js/lib/mech.js'],
    about: 'Levers, see-saws, crowbars, winches and ropes over pulleys. Work out which way things move, how hard you must pull or how far the load rises, and answer in the panel — then the machine moves. Pulleys and plank weigh nothing and nothing rubs, unless the puzzle says so. In the puzzles with a loose weight, drag it onto the plank: it stands at the nearest mark.',

    verify(p) {
      const d = p.data;
      if (!d || !d.k) return { ok: false, err: 'data.k is needed' };
      let s;
      try { s = solve(d); } catch (e) { return { ok: false, err: 'solver threw ' + e.message }; }
      if (s.err) return { ok: false, err: s.err };
      if (s.kind === 'place') {
        if (d.tray.length === 1 && s.ways.length !== 1) return { ok: true, warn: s.ways.length + ' pegs balance it' };
        return { ok: true };
      }
      if (s.kind === 'choice') { if (d.ans !== s.v) return { ok: false, err: 'the answer is choice ' + s.v + ', the data says ' + d.ans }; return { ok: true }; }
      if (!Array.isArray(d.ans) || !F.eq(F.fr(d.ans[0], d.ans[1]), s.v)) return { ok: false, err: 'the answer is ' + F.str(s.v) + ', the data says ' + JSON.stringify(d.ans) };
      if (d.k === 'rope') {
        // every rope run must hang straight
        for (const r of runs(d.sys)) if (Math.abs(r.a[0] - r.b[0]) > 0.01) return { ok: false, err: 'a rope run is not vertical' };
      }
      return { ok: true };
    },

    answerKey(p) {
      const d = p.data;
      if (d.k === 'lever' && d.q === 'place') return null;
      return Array.isArray(d.ans) ? F.str(d.ans) : d.ans;
    },

    generate(rng, level) {
      const r = make(rng, level);
      if (!r) return null;
      return { title: TITLE[r.kind], text: r.text, diff: level, data: r.data };
    },

    mount,

    thumb(p) {
      const d = p.data;
      const wood = M.MATS.wood[1], iron = M.MATS.iron[1], steel = M.MATS.steel[1];
      if (d.k === 'lever') {
        const n = d.n, u = 20;
        let s = '<svg viewBox="' + (-(n + 1) * u) + ' -52 ' + (2 * (n + 1) * u) + ' 92"><path d="M0 2L-16 34H16Z" fill="' + iron + '"/><rect x="' + (-(n + 1) * u) + '" y="34" width="' + (2 * (n + 1) * u) + '" height="5" fill="' + M.MATS.wood[2] + '"/><rect x="' + (-(n + 0.6) * u) + '" y="-4" width="' + ((2 * n + 1.2) * u) + '" height="8" rx="2" fill="' + wood + '"/>';
        const stack = {};
        d.w.forEach(([x, m]) => { const h = blockH(m), w = 9 + Math.sqrt(m || 4) * 3.2, y = (stack[x] || -4) - h; stack[x] = y - 0.6; s += '<rect x="' + f3(x * u - w / 2) + '" y="' + f3(y) + '" width="' + f3(w) + '" height="' + f3(h) + '" rx="1.5" fill="' + (m == null ? 'var(--gold)' : iron) + '"/>'; });
        return s + '</svg>';
      }
      if (d.k === 'crowbar') return '<svg viewBox="0 0 160 90"><path d="M10 78H150" stroke="' + wood + '" stroke-width="4"/><path d="M92 60L104 26L130 20L150 40L150 78H96Z" fill="#8b8f9c"/><path d="M14 40L100 66" stroke="' + steel + '" stroke-width="5" stroke-linecap="round"/><path d="M76 78Q84 58 92 78Z" fill="#6b6f7b"/></svg>';
      if (d.k === 'winch') return '<svg viewBox="-50 -50 110 140"><circle r="40" fill="none" stroke="' + steel + '" stroke-width="1.5" stroke-dasharray="3 3"/><circle r="12" fill="' + iron + '"/><path d="M0 0L40 0" stroke="#3d4254" stroke-width="4" stroke-linecap="round"/><circle cx="40" r="5" fill="' + wood + '"/><path d="M12 0V58" stroke="#b8925a" stroke-width="2"/><rect x="0" y="58" width="24" height="20" fill="' + wood + '"/></svg>';
      const sys = d.sys, e = ropeExtent(sys);
      let s = '<svg viewBox="' + e.x0 + ' ' + e.y0 + ' ' + (e.x1 - e.x0) + ' ' + (e.y1 - e.y0) + '" preserveAspectRatio="xMidYMid meet"><rect x="' + e.x0 + '" y="-8" width="' + (e.x1 - e.x0) + '" height="8" fill="' + wood + '"/>';
      sys.ropes.forEach((r) => { s += '<path d="' + pd(ropePath(sys, r)) + '" fill="none" stroke="#c9a26b" stroke-width="2"/>'; });
      sys.sheaves.forEach((sh) => { const o = sh.b >= 0 ? [sys.bodies[sh.b].x, sys.bodies[sh.b].y] : [0, 0]; s += '<circle cx="' + (o[0] + sh.x) + '" cy="' + (o[1] + sh.y) + '" r="' + sh.r + '" fill="' + steel + '"/>'; });
      sys.bodies.forEach((b) => { if (b.W || b.unk) s += '<rect x="' + (b.x - 13) + '" y="' + (b.y + (b.t === 'blk' ? 16 : 2)) + '" width="26" height="22" rx="2" fill="' + (b.sh === 'weight' ? iron : wood) + '"/>'; });
      return s + '</svg>';
    }
  });

  C.pulleysLib = { solve, ropeKin, tackle, cascade, balance, make, MAKE, placements, torque, runs, KINDS, TITLE };

  C.css('pulleys', `
    .pl-wall { fill: var(--board-2); stroke: var(--line); stroke-width: .6; }
    .pl-ground { fill: var(--wood-dark); opacity: .55; }
    .pl-fulcrum { stroke: #20242f; stroke-width: .8; stroke-linejoin: round; }
    .pl-prop { fill: var(--muted); opacity: .55; transition: opacity .35s; }
    .pl-props { transition: opacity .35s; }
    .pl-plank { stroke: #6b4518; stroke-width: .7; }
    .pl-peg { fill: #5a3a14; }
    .pl-tick { stroke: #5a3a14; stroke-width: .8; }
    .pl-num.onplank { fill: #4a2c0c; font-size: 5px; }
    .pl-pivot { fill: #20242f; stroke: #c9cfdd; stroke-width: .8; }
    .pl-num { font: 700 6px "Segoe UI", system-ui, sans-serif; fill: var(--muted); text-anchor: middle; }
    .pl-q { font: 800 10px "Segoe UI", system-ui, sans-serif; fill: var(--gold); text-anchor: middle; }
    .pl-string { stroke: #8a8f9e; stroke-width: .8; fill: none; }
    .pl-iron { stroke: #1d2029; stroke-width: .7; }
    .pl-iron-h { fill: none; stroke: #1d2029; stroke-width: 1.4; }
    .pl-wl { font: 800 5.4px "Segoe UI", system-ui, sans-serif; fill: #eef1f8; text-anchor: middle; }
    .pl-wl.dark { fill: #2a1e0c; }
    .unk .pl-iron { stroke: var(--gold); stroke-width: 1.2; }
    .unk .pl-wl { fill: var(--gold); font-size: 7px; }
    .loose .pl-iron { stroke: var(--teal); stroke-width: 1; }
    .pl-loose { cursor: grab; }
    .pl-tray { fill: var(--panel-2); stroke: var(--line); stroke-dasharray: 3 2; stroke-width: .7; }
    .pl-drag { opacity: .8; pointer-events: none; }
    .pl-drag.snapped { opacity: 1; filter: drop-shadow(0 0 2px var(--green)); }
    .pl-crate { stroke: #6b4518; stroke-width: .6; }
    .pl-crate-x { stroke: #7a5020; stroke-width: 1.2; opacity: .6; }
    .pl-crate-o { fill: none; stroke: #5a3a14; stroke-width: 1; }
    .pl-tagbg { fill: rgba(255, 244, 220, .85); }
    .pl-sheave { stroke: #3d4556; stroke-width: .7; }
    .pl-groove { fill: none; stroke: #3d4556; stroke-width: .6; opacity: .7; }
    .pl-spoke { stroke: #4d586b; stroke-width: 1.2; }
    .pl-hub { fill: #20242f; }
    .pl-frame { fill: rgba(60, 66, 84, .35); stroke: #7c869a; stroke-width: 1; }
    .pl-strap { stroke: #7c869a; stroke-width: 2; }
    .pl-eye { fill: none; stroke: #9aa3b5; stroke-width: 1; }
    .pl-hookline { stroke: #7c869a; stroke-width: 1.4; }
    .pl-hook { fill: none; stroke: #9aa3b5; stroke-width: 1.4; stroke-linecap: round; }
    .pl-rope { fill: none; stroke: #c9a26b; stroke-width: 1.7; stroke-linejoin: round; }
    .pl-handle { fill: var(--wood); stroke: var(--wood-dark); stroke-width: .6; }
    .pl-pull { stroke: var(--green); stroke-width: 1.6; fill: none; }
    .pl-pullh { fill: var(--green); }
    .pl-name { font: 800 7px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; }
    .pl-hintrun { stroke: var(--teal); stroke-width: 3.4; opacity: .7; fill: none; stroke-linecap: round; animation: plpulse 1s ease-in-out infinite; }
    @keyframes plpulse { 50% { opacity: .25; } }
    .pl-hinttag rect { fill: var(--panel); stroke: var(--teal); stroke-width: .6; }
    .pl-hinttag text { font: 700 5px "Segoe UI", system-ui, sans-serif; fill: var(--teal); text-anchor: middle; }
    .pl-stone { fill: #6b6f7b; stroke: #3a3d46; stroke-width: .8; }
    .pl-rock { fill: #8b8f9c; stroke: #4a4d57; stroke-width: 1; stroke-linejoin: round; }
    .pl-bar { fill: none; stroke: #4d586b; stroke-width: 4.2; stroke-linecap: round; }
    .pl-dim { stroke: var(--muted); stroke-width: .6; fill: none; }
    .pl-post { stroke: var(--wood-dark); stroke-width: 4; stroke-linecap: round; }
    .pl-flange { stroke: #20242f; stroke-width: .7; }
    .pl-drumrope { fill: #c9a26b; stroke: #7a5a2c; stroke-width: .6; }
    .pl-drumline { fill: none; stroke: #8e6a36; stroke-width: .5; }
    .pl-crank { stroke: #3d4254; stroke-width: 3.2; stroke-linecap: round; }
    .pl-knob { stroke: #6b4518; stroke-width: .6; }
    .pl-crank-path { fill: none; stroke: var(--muted); stroke-width: .5; stroke-dasharray: 2 2.5; }
    .pl-beamc { stroke: #6b4518; stroke-width: .6; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
