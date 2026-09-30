/* The Puzzle Cabinet · engines/knots.js
 *
 * Ropes on a table. A rope is held by both ends; where it crosses itself one
 * strand lies on top. The knotting tool (K) switches a crossing with a click
 * and reshapes the rope with a drag (it will not pass through itself); a rope
 * of your own can be drawn beside the puzzle (D) to experiment with. "Pull"
 * pulls the ends apart in a small rope simulation, flat or in 3D.
 *
 * data: {
 *   kind: 'knot'   knot or not?       answer: 1 knotted | 0 comes apart
 *       | 'name'   which knot is it?  answer: [id, mirror], choices: [[id, mirror] …]
 *       | 'untie'  switch at most k crossings so that it comes apart: k, sol
 *       | 'tie'    switch crossings to tie a given knot: target [id, mirror], sol
 *   c: [x0, y0, x1, y1 …]   control points of the closed curve (cut open at the top)
 *   per: 8                  spline samples per span
 *   bits: '0110…'           over/under at each crossing, in order along the rope
 * }
 * The maths is in js/lib/knot.js (crossings, Jones polynomial, the knot table,
 * the rope simulation, the diagram makers).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const KN = () => C.Knot;

  /* ---------- words ---------- */

  const NOUNS = ['Tangle', 'Snarl', 'Muddle', 'Coil', 'Skein', 'Bight', 'Kink', 'Ravel', 'Jumble', 'Twist', 'Loop', 'Hank', 'Fankle', 'Hitch', 'Knarl', 'Whorl'];
  const PLACES = ['on the Quay', 'in the Sail Loft', 'at the Well', 'in the Bell Tower', 'on the Washing Line', 'in the Hayloft', 'at the Harbour', 'on the Mast', 'in the Workshop', 'at the Fair', 'in the Attic', 'on the Towpath', 'at the Lighthouse', 'in the Circus Tent', 'by the Swing', 'at the Dock', 'in the Gym', 'on the Ferry', 'at the Stables', 'in the Belfry', 'on the Barge', 'in the Boathouse', 'at the Quarry', 'on the Stage', 'in the Crow\'s Nest', 'at the Maypole'];
  const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function titleFor(rng) { return 'The ' + rng.pick(NOUNS) + ' ' + rng.pick(PLACES); }

  function knotName(id, m) { return KN().nameOf(id, !!m); }
  function article(name) { return (/^[aeiou]/i.test(name) ? 'an ' : 'a ') + name; }

  // how the answer choices name a knot
  function choiceName(id, m) {
    const K = KN(), e = K.byId[id];
    if (id === '0_1') return 'No knot at all';
    if (id === '3_1' || id === 'granny') return cap(K.nameOf(id, m));
    const num = id.replace(/_([0-9])/, (m, k) => '₀₁₂₃₄₅₆₇₈₉'[+k]);
    return cap(e.name) + (e.c && e.name.indexOf(num) < 0 && /_/.test(id) ? ' (' + num + ')' : '');
  }

  /* ---------- building and checking a puzzle ---------- */

  function bitsOf(s) { return String(s || '').split('').map(Number); }
  function flip(bits, set) { const b = bits.slice(); set.forEach((i) => { b[i] = b[i] ? 0 : 1; }); return b; }
  function same(V, W) { return KN().poly.eq(V, W); }

  // the rope of a puzzle, with its crossings and a quick Jones calculator
  function ropeOf(d) {
    const K = KN();
    const r = K.fromData(d);
    return { pts: r.pts, cr: r.cr, bits: r.bits, prep: K.prepare(r.pts, r.cr) };
  }

  function targetV(t) { const e = KN().byId[t[0]]; return e ? (t[1] ? e.Vm : e.V) : null; }
  // does a polynomial answer "this knot"? (handedness only counts for the trefoil and the granny)
  function isKnot(V, id, m) {
    const e = KN().byId[id];
    if (!e) return false;
    if (id === '3_1' || id === 'granny') return same(V, m ? e.Vm : e.V);
    return same(V, e.V) || same(V, e.Vm);
  }

  function verifyData(p) {
    const K = KN();
    if (!K) return { ok: false, err: 'js/lib/knot.js is not loaded' };
    const d = p.data;
    if (!d || !d.c || !d.kind) return { ok: false, err: 'data.c and data.kind are needed' };
    const R = ropeOf(d);
    if (String(d.bits).length !== R.cr.length) return { ok: false, err: 'the rope has ' + R.cr.length + ' crossings but ' + String(d.bits).length + ' bits' };
    const cl = K.clean(R.pts, R.cr);
    if (!cl.ok) return { ok: false, err: 'the diagram is not clean: ' + cl.why };
    const J = R.prep.jones(R.bits);
    if (!J.ok) return { ok: false, err: 'the Jones polynomial came out with quarter powers' };
    const V = J.V;
    if (d.kind === 'knot') {
      const knotted = !K.isUnknot(V);
      if ((d.answer ? 1 : 0) !== (knotted ? 1 : 0)) return { ok: false, err: 'the answer says ' + (d.answer ? 'knotted' : 'no knot') + ' but the rope is ' + (knotted ? 'knotted' : 'not knotted') };
      return { ok: true };
    }
    if (d.kind === 'name') {
      const a = d.answer;
      if (!isKnot(V, a[0], a[1])) return { ok: false, err: 'the rope is not ' + knotName(a[0], a[1]) };
      const hits = d.choices.filter((c) => isKnot(V, c[0], c[1]));
      if (hits.length !== 1) return { ok: false, err: hits.length + ' choices fit the rope' };
      const keys = d.choices.map((c) => c[0] + (c[0] === '3_1' || c[0] === 'granny' ? (c[1] ? '*' : '') : ''));
      if (new Set(keys).size !== keys.length) return { ok: false, err: 'two choices are the same' };
      return { ok: true };
    }
    if (d.kind === 'untie' || d.kind === 'tie') {
      const goal = d.kind === 'untie' ? (W) => K.isUnknot(W) : (W) => isKnot(W, d.target[0], d.target[1]);
      if (goal(V)) return { ok: false, err: 'already done at the start' };
      if (!d.sol || !d.sol.length) return { ok: false, err: 'no stored solution' };
      if (!goal(R.prep.jones(flip(R.bits, d.sol)).V)) return { ok: false, err: 'the stored switches do not do it' };
      const fewer = K.fewestSwitches(R.prep, R.bits, goal, d.sol.length - 1);
      if (fewer) return { ok: false, err: 'it can be done with ' + fewer.k + ' switches' };
      if (d.kind === 'untie' && d.k !== d.sol.length) return { ok: false, err: 'k is ' + d.k + ' but the fewest is ' + d.sol.length };
      if (p.par != null && p.par !== d.sol.length) return { ok: false, err: 'par is ' + p.par + ' but the fewest switches is ' + d.sol.length };
      return { ok: true, par: d.sol.length };
    }
    return { ok: false, err: 'unknown kind ' + d.kind };
  }

  /* ---------- making puzzles (the Endless drawers and tools/gen/knots.js) ---------- */

  // a clean diagram with lo..hi crossings, from a random curve
  function freshDiagram(rng, lo, hi, kinds, extra) {
    const K = KN();
    for (let t = 0; t < 40; t++) {
      const kind = rng.pick(kinds || ['plat', 'plat', 'torus', 'pic']);
      const opts = Object.assign({}, extra || {});
      if (kind === 'plat') opts.n = rng.range(lo, hi + 1);
      if (kind === 'torus') {
        const fits = [[2, 3], [2, 5], [2, 7], [3, 2], [3, 4], [2, 9], [4, 3]].filter((pq) => (pq[0] - 1) * pq[1] >= lo && (pq[0] - 1) * pq[1] <= hi);
        if (!fits.length) continue;
        opts.pq = rng.pick(fits);
      }
      if (kind === 'pic' && !opts.id) {
        const ids = Object.keys(K.PICS).filter((id) => (K.PICS[id].c || K.PICS[id].compose) && id !== '0_1' && K.byId[id].c >= lo && K.byId[id].c <= hi);
        if (!ids.length) continue;
        opts.id = rng.pick(ids);
        opts.mirror = rng() < 0.5;
      }
      const curve = K.randomCurve(rng, kind, opts);
      const d = K.curveData(curve);
      const b = K.buildChecked(d, lo, hi);
      if (b) { b.kind = kind; b.src = opts.id || null; return b; }
    }
    return null;
  }

  function randomBits(rng, n) { const b = []; for (let i = 0; i < n; i++) b.push(rng() < 0.5 ? 1 : 0); return b; }

  const LEVELS = {
    knot: [null, [3, 4], [4, 5], [5, 7], [6, 8], [7, 10]],
    untie: [null, [3, 4], [4, 6], [5, 7], [6, 8], [7, 10]]
  };

  // force (for hand-made puzzles): { want: 0 | 1, pic: table id, mirror }
  function makeKnotOrNot(rng, level, force) {
    force = force || {};
    const K = KN();
    const band = LEVELS.knot[level];
    const want = force.want != null ? force.want : (rng() < 0.5 ? 1 : 0);
    for (let t = 0; t < 12; t++) {
      const D = force.pic ? freshDiagram(rng, K.byId[force.pic].c, K.byId[force.pic].c, ['pic'], { id: force.pic, mirror: !!force.mirror, warp: 0.04 }) : freshDiagram(rng, band[0], band[1]);
      if (!D) continue;
      const n = D.cr.length;
      // try crossings at random until one of the wanted sort turns up
      let pick = null;
      for (let s = 0; s < 48 && !pick; s++) {
        const bits = s === 0 ? K.alternating(D.cr, rng() < 0.5) : randomBits(rng, n);
        const V = D.prep.jones(bits).V;
        const knotted = K.isUnknot(V) ? 0 : 1;
        if (knotted !== want) continue;
        const red = K.reduce(D.cr, bits);
        // easy levels: loose loops really slide away; hard levels: the rope must not simply fall apart by easy moves
        if (!want && level <= 2 && red.left.length) continue;
        if (!want && level >= 4 && !red.left.length) continue;
        if (want && level >= 4 && red.left.length === n && rng() < 0.6) continue;
        pick = { bits, V, red };
      }
      if (!pick) continue;
      const id = K.identify(pick.V);
      const d = { kind: 'knot', c: D.d.c, per: D.d.per, bits: pick.bits.join(''), answer: want };
      if (id) { d.knot = id.id; d.m = id.mirror ? 1 : 0; }
      return {
        title: titleFor(rng), diff: level,
        text: rng.pick([
          'Someone holds this rope up by its two ends. If the ends are pulled apart, will the rope run out straight — or tighten into a knot?',
          'A rope lies on the table with both ends free. Pull the ends: knot or not?',
          'The ends of this rope are about to be pulled apart. Does a knot hold, or does it all slide loose?',
          'Look carefully at every crossing. When the two ends are pulled, is there a knot in it?'
        ]),
        goal: 'Decide: will it come apart, or is it knotted?',
        data: d
      };
    }
    return null;
  }

  // the table knots a level may ask for, and how many extra crossings the rope may have
  const NAME_LEVELS = [null,
    { ids: ['3_1', '4_1'], extra: 0 },
    { ids: ['3_1', '4_1', '5_1', '5_2'], extra: 1 },
    { ids: ['5_1', '5_2', '6_1', '6_2', '6_3', 'granny', 'square'], extra: 2 },
    { ids: ['6_1', '6_2', '6_3', '7_1', '7_2', '7_3', '7_4', 'granny', 'square'], extra: 2 },
    { ids: ['7_1', '7_2', '7_3', '7_4', '7_5', '7_6', '7_7', '6_2', '6_3'], extra: 3 }
  ];

  function choicesFor(rng, id, m) {
    const K = KN(), e = K.byId[id];
    const out = [[id, m]];
    if (id === '3_1' && rng() < 0.7) out.push(['3_1', m ? 0 : 1]);
    const pool = K.table.filter((x) => x.id !== id && x.id !== '0_1' && Math.abs(x.c - e.c) <= 2);
    rng.shuffle(pool);
    for (const x of pool) {
      if (out.length >= 4) break;
      if (x.id === '3_1' && out.some((o) => o[0] === '3_1')) continue;
      out.push([x.id, rng() < 0.5 ? 1 : 0]);
    }
    if (rng() < 0.25 && out.length >= 4) out[3] = ['0_1', 0];
    return rng.shuffle(out);
  }

  /* Bits on diagram D that tie the knot (id, m): the two alternating choices
   * first (a minimal drawing of a knot of the table is alternating), then
   * every pattern for a small diagram, or random tries for a big one. */
  function bitsFor(rng, D, id, m) {
    const K = KN(), n = D.cr.length;
    const good = (b) => isKnot(D.prep.jones(b).V, id, m);
    for (const b of [K.alternating(D.cr), K.alternating(D.cr, true)]) if (good(b)) return b;
    if (n <= 8) {
      const N = 1 << n, s0 = rng.int(N);
      for (let q = 0; q < N; q++) {
        const v = (s0 + q) % N, b = [];
        for (let i = 0; i < n; i++) b.push((v >> i) & 1);
        if (good(b)) return b;
      }
      return null;
    }
    for (let s = 0; s < 200; s++) { const b = randomBits(rng, n); if (good(b)) return b; }
    return null;
  }

  // a clean drawing that can tie knot e: its own picture, its 4-plat, or any shadow a little bigger
  function drawingFor(rng, e, m, src, extra) {
    const K = KN();
    if (src === 'pic') return K.PICS[e.id] && (K.PICS[e.id].c || K.PICS[e.id].compose) ? freshDiagram(rng, e.c, e.c, ['pic'], { id: e.id, mirror: !!m, warp: 0.05 }) : null;
    if (src === 'plat') return e.conway ? freshDiagram(rng, e.c, e.c, ['plat'], { seq: e.conway }) : null;
    return freshDiagram(rng, e.c, Math.min(10, e.c + (extra || 2)));
  }

  // force: { id, m, pic: true to use the knot's own picture }
  function makeName(rng, level, force) {
    force = force || {};
    const K = KN(), L = NAME_LEVELS[level];
    for (let t = 0; t < 30; t++) {
      const id = force.id || rng.pick(L.ids), e = K.byId[id], m = e.amph ? 0 : (force.m != null ? force.m : (rng() < 0.5 ? 1 : 0));
      const src = force.pic ? 'pic' : level <= 2 ? rng.pick(['pic', 'pic', 'plat']) : rng.pick(['pic', 'plat', 'plat', 'any']);
      const D = drawingFor(rng, e, m, src, L.extra);
      if (!D) continue;
      const bits = bitsFor(rng, D, id, m);
      if (!bits) continue;
      const choices = choicesFor(rng, id, m);
      const d = { kind: 'name', c: D.d.c, per: D.d.per, bits: bits.join(''), answer: [id, m], choices };
      return {
        title: titleFor(rng), diff: level,
        text: rng.pick([
          'Pull this rope tight in your mind. Which knot would you end up with?',
          'Follow the rope from one end to the other, over and under. Which knot is tied in it?',
          'The ends will be pulled apart and joined far away. Which knot does the rope hold?'
        ]),
        goal: 'Name the knot.',
        data: d
      };
    }
    return null;
  }

  function makeUntie(rng, level) {
    const K = KN(), band = LEVELS.untie[level];
    const wantK = level <= 2 ? 1 : level <= 4 ? 2 : (rng() < 0.4 ? 3 : 2);
    for (let t = 0; t < 14; t++) {
      const D = freshDiagram(rng, band[0], band[1]);
      if (!D) continue;
      const n = D.cr.length;
      for (let s = 0; s < 30; s++) {
        const bits = s < 2 ? K.alternating(D.cr, s === 1) : randomBits(rng, n);
        const V = D.prep.jones(bits).V;
        if (K.isUnknot(V)) continue;
        const f = K.fewestSwitches(D.prep, bits, (W) => K.isUnknot(W), wantK);
        if (!f || f.k !== wantK) continue;
        const id = K.identify(V);
        const d = { kind: 'untie', c: D.d.c, per: D.d.per, bits: bits.join(''), k: f.k, sol: f.set };
        if (id) { d.knot = id.id; d.m = id.mirror ? 1 : 0; }
        return {
          title: titleFor(rng), diff: level, par: f.k,
          text: 'This rope is knotted. Switch ' + (f.k === 1 ? '**one** crossing' : 'at most **' + WORD[f.k] + '** crossings') + ' — click a crossing to put the other strand on top — so that it comes apart when the ends are pulled.',
          goal: 'Untie it with at most ' + C.plural(f.k, 'switch', 'switches') + '.',
          data: d
        };
      }
    }
    return null;
  }

  const TIE_LEVELS = [null, ['3_1', '4_1'], ['3_1', '4_1', '5_1', '5_2'], ['4_1', '5_2', '6_1', '6_2', 'granny', 'square'], ['5_1', '6_1', '6_2', '6_3', '7_2', '7_4'], ['6_3', '7_1', '7_3', '7_5', '7_6', '7_7']];

  function makeTie(rng, level, force) {
    force = force || {};
    const K = KN();
    for (let t = 0; t < 20; t++) {
      const id = force.id || rng.pick(TIE_LEVELS[level]), e = K.byId[id], m = e.amph ? 0 : (force.m != null ? force.m : (rng() < 0.5 ? 1 : 0));
      const hand = id === '3_1' || id === 'granny';
      const goal = (W) => isKnot(W, id, m);
      // start from a clean diagram that can make the knot: its own picture, its 4-plat or a bigger shadow
      const D = drawingFor(rng, e, m, rng.pick(['pic', 'plat', 'any']), 2);
      if (!D) continue;
      const n = D.cr.length;
      const good = bitsFor(rng, D, id, m);
      if (!good) continue;
      // scramble a few and measure how far it is from the knot now
      const want = Math.min(3, level <= 1 ? 1 : level <= 3 ? 2 : rng.range(2, 3));
      const set = rng.shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, want);
      const start = flip(good, set);
      if (goal(D.prep.jones(start).V)) continue;
      const f = K.fewestSwitches(D.prep, start, goal, want);
      if (!f || f.k < Math.max(1, want - 1)) continue;
      const d = { kind: 'tie', c: D.d.c, per: D.d.per, bits: start.join(''), target: [id, m], sol: f.set };
      const nm = knotName(id, m);
      return {
        title: 'Tie ' + (hand || e.amph || !m ? cap(nm) : cap(e.name)), diff: level, par: f.k,
        text: 'Switch crossings of this rope — click a crossing to put the other strand on top — until it ties ' + article(hand ? nm : e.name) + '. The fewest switches wins.',
        goal: 'Make it ' + article(hand ? nm : e.name) + '.',
        data: d
      };
    }
    return null;
  }

  function generate(rng, level, meta) {
    const fid = meta && meta.id;
    level = Math.max(1, Math.min(5, level || 1));
    if (fid === 'knot-or-not') return makeKnotOrNot(rng, level);
    if (fid === 'unknotting') return makeUntie(rng, level);
    if (fid === 'knot-id') return rng() < 0.72 ? makeName(rng, level) : makeTie(rng, level);
    return null;
  }

  /* ---------- drawing a rope ---------- */

  const STYLES = {
    hemp: { body: '#c99a58', edge: '#523512', twist: 'rgba(92,56,18,.55)', twist2: 'rgba(255,236,196,.28)', shine: 'rgba(255,247,226,.5)', whip: '#2b4c73', dim: 'rgba(38,20,4,.42)' },
    red: { body: '#c9443a', edge: '#4c130e', twist: 'rgba(255,238,228,.42)', twist2: 'rgba(60,8,4,.3)', shine: 'rgba(255,226,214,.45)', whip: '#1e1e1e', dim: 'rgba(30,4,0,.42)' }
  };

  // an open Catmull-Rom through beads, for a smooth line
  function smoothOpen(pts, per) {
    const n = pts.length, out = [];
    if (n < 3) return pts.slice();
    for (let i = 0; i < n - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n - 1, i + 2)];
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        const q = [];
        for (let d = 0; d < p1.length; d++) q.push(0.5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3));
        out.push(q);
      }
    }
    out.push(pts[n - 1].slice());
    return out;
  }

  function RopeView(ctx, parent, style, w) {
    this.ctx = ctx;
    this.w = w;
    this.st = STYLES[style] || STYLES.hemp;
    this.g = ctx.s('g', { class: 'kn-rope kn-' + style }, parent);
    this.shadow = ctx.s('path', { class: 'kn-shadow', fill: 'none', stroke: 'rgba(0,0,0,.3)', 'stroke-width': (w * 1.02).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(' + (w * 0.3).toFixed(2) + ' ' + (w * 0.45).toFixed(2) + ')' }, this.g);
    this.pool = [];
  }

  // pieces: [{ pts, s0, s1 }] from K.pieces; L = the rope's length
  RopeView.prototype.draw = function (pieces, L) {
    const w = this.w, st = this.st, ctx = this.ctx, f = (v) => Math.round(v * 10) / 10;
    while (this.pool.length < pieces.length) {
      const g = ctx.s('g', { class: 'kn-piece' }, this.g);
      const mk = (cls, attrs) => ctx.s('path', Object.assign({ class: cls, fill: 'none' }, attrs), g);
      this.pool.push({
        g,
        edge: mk('kn-edge', { stroke: st.edge, 'stroke-width': w.toFixed(2), 'stroke-linejoin': 'round' }),
        body: mk('kn-body', { stroke: st.body, 'stroke-width': (w * 0.76).toFixed(2), 'stroke-linejoin': 'round' }),
        t2: mk('kn-twist2', { stroke: st.twist2, 'stroke-width': (w * 0.1).toFixed(2), 'stroke-linecap': 'round' }),
        tw: mk('kn-twist', { stroke: st.twist, 'stroke-width': (w * 0.13).toFixed(2), 'stroke-linecap': 'round' }),
        shine: mk('kn-shine', { stroke: st.shine, 'stroke-width': (w * 0.17).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(' + (-w * 0.13).toFixed(2) + ' ' + (-w * 0.17).toFixed(2) + ')' }),
        dim: mk('kn-dim', { stroke: st.dim, 'stroke-width': (w * 0.78).toFixed(2) }),
        whip: mk('kn-whip', { stroke: st.whip, 'stroke-width': (w * 0.15).toFixed(2) })
      });
    }
    this.pool.forEach((P, i) => { P.g.style.display = i < pieces.length ? '' : 'none'; });
    let shadowD = '';
    pieces.forEach((pc, i) => {
      const P = this.pool[i], pts = pc.pts;
      const d = KN().pathOf(pts);
      shadowD += d;
      P.edge.setAttribute('d', d);
      P.body.setAttribute('d', d);
      P.shine.setAttribute('d', d);
      // walk along: twist marks, the dark ends where it dives under, whipping at the tips
      const s = [0];
      for (let k = 1; k < pts.length; k++) s.push(s[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      const len = s[s.length - 1];
      let j = 0;
      const at = (v) => {
        while (j < s.length - 2 && s[j + 1] < v) j++;
        while (j > 0 && s[j] > v) j--;
        const a = pts[j], b = pts[j + 1] || a, seg = (s[j + 1] - s[j]) || 1, t = (v - s[j]) / seg;
        const dx = (b[0] - a[0]) / seg, dy = (b[1] - a[1]) / seg, l = Math.hypot(dx, dy) || 1;
        return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, tx: dx / l, ty: dy / l };
      };
      let tw = '', t2 = '', dim = '', whip = '';
      const pitch = w * 0.78, startTip = pc.s0 <= 0.01, endTip = pc.s1 >= L - 0.01;
      const phase = (pc.s0 % pitch);
      for (let v = pitch - phase; v < len; v += pitch) {
        if ((!startTip && v < w * 0.5) || (!endTip && v > len - w * 0.5)) continue;
        if ((startTip && v < w * 1.9) || (endTip && v > len - w * 1.9)) continue;
        const q = at(v), nx = -q.ty, ny = q.tx;
        tw += 'M' + f(q.x - nx * w * 0.34 - q.tx * w * 0.2) + ' ' + f(q.y - ny * w * 0.34 - q.ty * w * 0.2) + 'L' + f(q.x + nx * w * 0.34 + q.tx * w * 0.2) + ' ' + f(q.y + ny * w * 0.34 + q.ty * w * 0.2);
        const q2 = at(Math.min(len, v + pitch * 0.42));
        t2 += 'M' + f(q2.x - nx * w * 0.3 - q.tx * w * 0.18) + ' ' + f(q2.y - ny * w * 0.3 - q.ty * w * 0.18) + 'L' + f(q2.x + nx * w * 0.3 + q.tx * w * 0.18) + ' ' + f(q2.y + ny * w * 0.3 + q.ty * w * 0.18);
      }
      const shade = (v0, v1) => { const a = at(v0), b = at(v1); dim += 'M' + f(a.x) + ' ' + f(a.y) + 'L' + f(b.x) + ' ' + f(b.y); };
      if (!startTip && len > w) shade(0, w * 0.75);
      if (!endTip && len > w) shade(len - w * 0.75, len);
      const bands = (from, dir) => {
        for (let k = 0; k < 5; k++) {
          const q = at(from + dir * (w * 0.45 + k * w * 0.26)), nx = -q.ty, ny = q.tx;
          whip += 'M' + f(q.x - nx * w * 0.5) + ' ' + f(q.y - ny * w * 0.5) + 'L' + f(q.x + nx * w * 0.5) + ' ' + f(q.y + ny * w * 0.5);
        }
      };
      if (startTip && len > w * 3) bands(0, 1);
      if (endTip && len > w * 3) bands(len, -1);
      P.tw.setAttribute('d', tw);
      P.t2.setAttribute('d', t2);
      P.dim.setAttribute('d', dim);
      P.whip.setAttribute('d', whip);
    });
    this.shadow.setAttribute('d', shadowD);
  };

  RopeView.prototype.remove = function () { this.g.remove(); };

  // the gap left in the under-strand at a crossing (half its length along the rope)
  function gapFor(w) { return (c) => w * 0.5 / Math.max(0.42, Math.sin(c.ang * Math.PI / 180)) + w * 0.42; }

  let uidSeq = 0;

  /* ---------- the puzzle on the table ---------- */

  function mount(ctx, p) {
    const K = KN(), wb = ctx.wb, d = p.data, W = K.W, S = ctx.s;
    const kind = d.kind;
    const canSwitch = kind === 'untie' || kind === 'tie';
    const hand = (id) => id === '3_1' || id === 'granny';
    const base = ropeOf(d);
    const uid = 'kn' + (++uidSeq);

    function makeRope(pts, cr, bits, orig) {
      const prep = K.prepare(pts, cr);
      return { pts, cr, bits, orig, prep, V: prep.jones(bits).V, s: K.arc(pts), shaped: false };
    }
    let rope = makeRope(base.pts, base.cr, base.bits.slice(), base.bits.slice());
    let scratch = null;
    let pull = null, answered = false, busy = false, g = null, hover = null;

    /* ----- the table ----- */
    const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
    const bb = K.bbox(rope.pts);
    const B = { x0: bb.x0 - 70, y0: bb.y0 - 30, x1: bb.x1 + 70, y1: bb.y1 + 50 };
    const defs = S('defs', null, bg);
    defs.innerHTML = '<pattern id="' + uid + '-weave" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">' +
      '<path d="M0 2H9M0 6.5H9" stroke="rgba(255,255,255,.035)" stroke-width="2"/><path d="M2 0V9M6.5 0V9" stroke="rgba(0,0,0,.06)" stroke-width="1.6"/></pattern>';
    S('rect', { x: B.x0 - 40, y: B.y0 - 40, width: B.x1 - B.x0 + 80, height: B.y1 - B.y0 + 80, rx: 30, class: 'kn-mat' }, bg);
    S('rect', { x: B.x0 - 40, y: B.y0 - 40, width: B.x1 - B.x0 + 80, height: B.y1 - B.y0 + 80, rx: 30, fill: 'url(#' + uid + '-weave)', 'pointer-events': 'none' }, bg);
    wb.setBounds(B, 0.05);

    const view = new RopeView(ctx, board, 'hemp', W);
    let sview = null;
    const marks = S('g', { class: 'kn-marks' }, top);
    const fx = S('g', { class: 'kn-fx' }, top);
    const hoverRing = S('circle', { class: 'kn-hover', r: W * 1.3, cx: -9999, cy: -9999 }, top);
    const live = S('path', { class: 'kn-live' }, top);

    function drawRope(R, v) { v.draw(K.pieces(R.pts, R.cr, R.bits, gapFor(W), false), R.s[R.s.length - 1]); }
    function redraw() {
      if (!pull || pull.which !== 'rope') drawRope(rope, view);
      if (scratch) {
        if (!sview) sview = new RopeView(ctx, board, 'red', W);
        if (!pull || pull.which !== 'scratch') drawRope(scratch, sview);
      } else if (sview) { sview.remove(); sview = null; }
      drawMarks();
      info();
      if (wb.is3D) build3D(false);
    }
    function switchedCount() { let n = 0; rope.bits.forEach((b, k) => { if (b !== rope.orig[k]) n++; }); return n; }
    function drawMarks() {
      marks.innerHTML = '';
      if (!canSwitch || pull) return;
      rope.cr.forEach((c, k) => { if (rope.bits[k] !== rope.orig[k]) S('circle', { cx: c.x, cy: c.y, r: W * 0.22, class: 'kn-switched' }, marks); });
    }
    function ripple(c) {
      const el = S('circle', { cx: c.x, cy: c.y, r: W * 0.9, class: 'kn-ripple' }, fx);
      setTimeout(() => el.remove(), 700);
    }
    function flashCrossings(list, ms) {
      list.forEach((c) => {
        const el = S('circle', { cx: c.x, cy: c.y, r: W * 1.55, class: 'kn-hint' }, fx);
        setTimeout(() => el.remove(), ms || 4200);
      });
    }

    /* ----- the side panel ----- */
    const panel = ctx.panel;
    const infoEl = ctx.h('div.kn-info');
    panel.appendChild(infoEl);
    const row1 = ctx.h('div.kn-row'), row2 = ctx.h('div.kn-row');
    panel.appendChild(row1);
    panel.appendChild(row2);
    const btn = (host, label, fn, cls, title) => { const b = ctx.h('button.btn' + (cls ? '.' + cls : ''), { type: 'button', onclick: fn, title: title || null }, label); host.appendChild(b); return b; };
    const pullBtn = btn(row1, 'Pull the ends', () => (pull && pull.which === 'rope' ? letGo() : startPull('rope')), 'primary', 'Pull the two ends apart (U)');
    const view3Btn = btn(row1, 'Look in 3D', () => wb.set3D(!wb.is3D), 'ghost', 'The rope in 3D: drag to turn it (3)');
    const drawBtn = btn(row2, 'Draw your own rope', () => wb.setMode('rope'), 'ghost.small', 'Draw a red rope beside the puzzle to experiment with (D)');
    const pull2Btn = btn(row2, 'Pull yours', () => (pull && pull.which === 'scratch' ? letGo() : startPull('scratch')), 'ghost.small');
    const clearBtn = btn(row2, 'Throw yours away', () => { if (pull && pull.which === 'scratch') letGo(); scratch = null; redraw(); ctx.changed('scratch'); }, 'ghost.small');
    if (kind === 'tie') {
      const t = d.target;
      infoEl.appendChild(ctx.h('div.kn-target', { html: K.svg(K.picture(t[0], !!t[1]), { cls: 'kn-tpic' }) + '<span>Make: <b>' + C.esc(cap(hand(t[0]) ? knotName(t[0], t[1]) : K.byId[t[0]].name)) + '</b></span>' }));
    }
    const infoText = ctx.h('div.kn-lines');
    infoEl.appendChild(infoText);

    function pullAllowed() { return canSwitch || answered || ctx.isRevealed() || (C.progress && C.progress.solved(p.id)) || !!(C.store && (C.store.get('st:' + p.id) || {}).solved); }
    function info() {
      const lines = [];
      ctx.stat('Crossings', rope.cr.length);
      if (canSwitch) ctx.stat('Switched', switchedCount());
      if (kind === 'untie') lines.push('Switch at most <b>' + d.k + '</b> ' + (d.k === 1 ? 'crossing' : 'crossings') + '. Click one to put the other strand on top; switched ones get a gold dot.');
      if (kind === 'tie') lines.push('Click a crossing to put the other strand on top. Par: ' + C.plural(d.sol.length, 'switch', 'switches') + '.');
      if (kind === 'knot' || kind === 'name') lines.push(pullAllowed() ? 'You may pull it now and watch.' : 'Answer first — then you can pull the ends and watch.');
      if (scratch) lines.push('<span class="kn-red">Your red rope:</span> ' + describe(scratch.V) + '.');
      infoText.innerHTML = lines.map((l) => '<p>' + l + '</p>').join('');
      pullBtn.textContent = pull && pull.which === 'rope' ? 'Let go' : 'Pull the ends';
      pullBtn.disabled = !pullAllowed() && !(pull && pull.which === 'rope');
      pull2Btn.hidden = clearBtn.hidden = !scratch;
      pull2Btn.textContent = pull && pull.which === 'scratch' ? 'Let go' : 'Pull yours';
      view3Btn.textContent = wb.is3D ? 'Back to flat' : 'Look in 3D';
    }
    function describe(V) {
      if (K.isUnknot(V)) return 'no knot — pulled, it comes apart';
      const id = K.identify(V);
      if (id) return article(knotName(id.id, id.mirror));
      return 'a knot with more than seven crossings (Jones polynomial ' + K.poly.str(V) + ')';
    }

    /* ----- finding things under the pointer ----- */
    function nearestCrossing(pt, lim) {
      let best = null;
      const test = (R, which) => { if (R) R.cr.forEach((c, k) => { const dd = Math.hypot(c.x - pt[0], c.y - pt[1]); if (dd < lim && (!best || dd < best.d)) best = { which, k, d: dd, c }; }); };
      test(scratch, 'scratch');
      if (!best) test(rope, 'rope');
      return best;
    }
    function nearestPoint(pt, lim) {
      let best = null;
      const test = (R, which) => { if (R) for (let i = 0; i < R.pts.length; i += 2) { const q = R.pts[i], dd = Math.hypot(q[0] - pt[0], q[1] - pt[1]); if (dd < lim && (!best || dd < best.d)) best = { which, i, d: dd }; } };
      test(scratch, 'scratch');
      if (!best) test(rope, 'rope');
      return best;
    }
    const pickR = () => Math.max(W * 1.25, wb.px(15));

    /* ----- switching a crossing ----- */
    function doSwitch(which, k, silent) {
      const R = which === 'scratch' ? scratch : rope;
      if (!R) return false;
      if (which === 'rope' && !canSwitch) {
        ctx.toast(kind === 'knot' ? 'This rope stays as it is: read it. Draw your own (D) to experiment.' : 'This rope stays as it is. Draw your own (D) to experiment.');
        ctx.sfx('wrong');
        return false;
      }
      R.bits = R.bits.slice();
      R.bits[k] = R.bits[k] ? 0 : 1;
      R.V = R.prep.jones(R.bits).V;
      ripple(R.cr[k]);
      ctx.sfx('snap');
      if (which === 'rope') ctx.move();
      redraw();
      if (!silent) ctx.changed('switch');
      if (which === 'scratch') ctx.say('Your red rope: ' + describe(R.V) + '.', 'info');
      return true;
    }

    /* ----- reshaping by dragging (never through itself) ----- */
    function dragTo(pt) {
      const R = g.which === 'scratch' ? scratch : rope;
      const dx = pt[0] - g.last[0], dy = pt[1] - g.last[1];
      if (Math.hypot(dx, dy) < 0.4) return;
      const rad = W * 9, s0 = R.s[g.i];
      const np = R.pts.map((q, j) => {
        const u = Math.abs(R.s[j] - s0) / rad;
        if (u >= 1) return q;
        const f = (1 + Math.cos(Math.PI * u)) / 2;
        return [q[0] + dx * f, q[1] + dy * f];
      });
      const ncr = K.crossings(np);
      const bits = [], orig = [];
      ncr.forEach((c) => {
        let best = -1, bd = 12;
        R.cr.forEach((o, k) => { const dd = Math.abs(o.a - c.a) + Math.abs(o.b - c.b); if (dd < bd) { bd = dd; best = k; } });
        if (best >= 0) { bits.push(R.bits[best]); orig.push(R.orig[best]); }
        else { const b = Math.abs(c.a - g.i) <= Math.abs(c.b - g.i) ? 1 : 0; bits.push(b); orig.push(b); }
      });
      const prep = K.prepare(np, ncr);
      const V2 = prep.jones(bits).V;
      if (!same(V2, R.V)) {
        g.blocked++;
        if (g.blocked === 1 || g.blocked % 40 === 0) ctx.toast('The rope cannot pass through itself.');
        return;
      }
      const R2 = { pts: np, cr: ncr, bits, orig, prep, V: V2, s: K.arc(np), shaped: true };
      if (g.which === 'scratch') scratch = R2; else rope = R2;
      g.last = pt;
      g.moved = true;
      redraw();
    }
    // even out the points after a drag, keeping every crossing as it was
    function settle(which) {
      const R = which === 'scratch' ? scratch : rope;
      if (!R) return;
      const np = K.resample(R.pts, 3.5, false);
      const ncr = K.crossings(np);
      if (ncr.length !== R.cr.length) return;
      const bits = [], orig = [];
      ncr.forEach((c) => {
        let best = 0, bd = Infinity;
        R.cr.forEach((o, k) => { const dd = Math.hypot(o.x - c.x, o.y - c.y); if (dd < bd) { bd = dd; best = k; } });
        bits.push(R.bits[best]);
        orig.push(R.orig[best]);
      });
      const prep = K.prepare(np, ncr);
      const V2 = prep.jones(bits).V;
      if (!same(V2, R.V)) return;
      const R2 = { pts: np, cr: ncr, bits, orig, prep, V: V2, s: K.arc(np), shaped: true };
      if (which === 'scratch') scratch = R2; else rope = R2;
    }

    /* ----- the knotting tool and the table ----- */
    function knotDown(pt) {
      if (busy) return true;
      if (pull) { letGo(); return true; }
      const c = nearestCrossing(pt, pickR());
      if (c) { g = { type: 'switch', which: c.which, k: c.k, p0: pt, last: pt, blocked: 0 }; return true; }
      const q = nearestPoint(pt, Math.max(W * 1.1, wb.px(12)));
      if (q) { g = { type: 'drag', which: q.which, i: q.i, p0: pt, last: pt, blocked: 0, moved: false }; wb.host.classList.add('kn-grabbing'); return true; }
      return false;
    }
    function knotMove(pt) {
      if (!g) return;
      if (g.type === 'switch' && Math.hypot(pt[0] - g.p0[0], pt[1] - g.p0[1]) > wb.px(9)) {
        // dragging from a crossing: take hold of the strand on top there
        const R = g.which === 'scratch' ? scratch : rope, c = R.cr[g.k];
        g = { type: 'drag', which: g.which, i: Math.round(R.bits[g.k] ? c.a : c.b), p0: g.p0, last: g.p0, blocked: 0, moved: false };
      }
      if (g.type === 'drag') dragTo(pt);
    }
    function knotUp() {
      const G = g;
      g = null;
      wb.host.classList.remove('kn-grabbing');
      if (!G) return;
      if (G.type === 'switch') doSwitch(G.which, G.k);
      else if (G.type === 'drag' && G.moved) { settle(G.which); redraw(); ctx.changed('shape'); }
    }
    function knotHover(pt) {
      if (pull || busy) { hoverRing.setAttribute('cx', -9999); return; }
      const c = nearestCrossing(pt, pickR());
      hover = c;
      if (c) { hoverRing.setAttribute('cx', c.c.x); hoverRing.setAttribute('cy', c.c.y); hoverRing.classList.toggle('no', c.which === 'rope' && !canSwitch); }
      else hoverRing.setAttribute('cx', -9999);
      const q = c ? null : nearestPoint(pt, Math.max(W * 1.1, wb.px(12)));
      wb.host.classList.toggle('kn-onrope', !!q);
      wb.host.classList.toggle('kn-oncross', !!c);
    }
    wb.addMode({ id: 'knot', icon: 'knot', title: 'Knotting tool: click a crossing to switch it, drag the rope to reshape it', key: 'K', down: knotDown, move: knotMove, up: knotUp, hover: knotHover });
    wb.addMode({
      id: 'rope', icon: 'pen', title: 'Draw a rope of your own to experiment with', key: 'D',
      down(pt) { if (pull) letGo(); g = { type: 'draw', pts: [pt] }; live.setAttribute('d', ''); return true; },
      move(pt) {
        if (!g || g.type !== 'draw') return;
        const l = g.pts[g.pts.length - 1];
        if (Math.hypot(pt[0] - l[0], pt[1] - l[1]) < wb.px(3)) return;
        g.pts.push(pt);
        live.setAttribute('d', K.pathOf(g.pts));
        live.setAttribute('stroke-width', W * 0.8);
      },
      up() { const G = g; g = null; live.setAttribute('d', ''); if (G && G.type === 'draw') finishScratch(G.pts); }
    });
    wb.handlers.board = { down: knotDown, move: knotMove, up: knotUp };
    wb.setMode('knot');

    function finishScratch(raw) {
      if (raw.length < 3 || K.length(raw) < W * 10) { ctx.toast('Draw a longer rope.'); return; }
      let pts = K.resample(raw, 3.5, false);
      for (let pass = 0; pass < 3; pass++) {
        pts = pts.map((q, i) => {
          if (i < 2 || i > pts.length - 3) return q;
          let sx = 0, sy = 0;
          for (let k = -2; k <= 2; k++) { sx += pts[i + k][0]; sy += pts[i + k][1]; }
          return [sx / 5, sy / 5];
        });
      }
      pts = K.resample(pts, 3.5, false);
      const cr = K.crossings(pts);
      const bits = cr.map(() => 0); // what you draw later lies on top
      scratch = makeRope(pts, cr, bits, bits.slice());
      redraw();
      wb.setMode('knot');
      ctx.say('Your red rope: ' + describe(scratch.V) + '. Click its crossings to switch them, or pull it.', 'info');
      ctx.changed('scratch');
    }

    /* ----- timers that must not outlive the puzzle ----- */
    const timers = new Set();
    function later(fn, ms) { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; }

    /* ----- pulling the ends ----- */
    let raf = 0, viewRaf = 0;
    function startPull(which) {
      const R = which === 'scratch' ? scratch : rope;
      if (!R || busy) return;
      if (which === 'rope' && !pullAllowed()) { ctx.toast('Answer first — then pull and watch.'); return; }
      if (pull) stopPull();
      const r = W / 2;
      const sim = new K.Sim(K.beadsOf(R.pts, R.cr, R.bits, r), { r });
      pull = { which, sim, R, done: false };
      hoverRing.setAttribute('cx', -9999);
      drawMarks();
      info();
      ctx.sfx('tap');
      ctx.say('Pulling the ends apart…', 'info');
      raf = requestAnimationFrame(pullFrame);
    }
    function pullFrame() {
      raf = 0;
      const P = pull;
      if (!P || P.done) return;
      const n = Math.max(1, Math.round(7 / Math.max(0.02, C.animScale)));
      for (let i = 0; i < n && !P.sim.done; i++) P.sim.step();
      const p3 = smoothOpen(P.sim.points(), 3);
      const flat = p3.map((q) => [q[0], q[1]]);
      const cr = K.crossings(flat);
      const vis = K.visiblePieces(p3, W);
      (P.which === 'scratch' ? sview : view).draw(vis.pieces, vis.L);
      P.last = { p3, flat, cr };
      follow(flat, cr);
      if (wb.is3D) build3D(false);
      if (P.sim.done) { finishPull(P); return; }
      raf = requestAnimationFrame(pullFrame);
    }
    // keep the knot in the middle of the view while the rope slides through it
    function follow(flat, cr) {
      let cx = 0, cy = 0;
      if (cr.length) { cr.forEach((c) => { cx += c.x; cy += c.y; }); cx /= cr.length; cy /= cr.length; }
      else { const m = flat[Math.floor(flat.length / 2)]; cx = m[0]; cy = m[1]; }
      const sz = wb.size(), left = sz.w < 560 ? 0 : 56;
      const tx = left + (sz.w - left) / 2 - cx * wb.v.k, ty = sz.h / 2 - cy * wb.v.k;
      wb.v.x += (tx - wb.v.x) * 0.12;
      wb.v.y += (ty - wb.v.y) * 0.12;
      wb.applyView();
    }
    function zoomTo(b, ms) {
      if (pull) pull.zoom = b;
      const sz = wb.size(), left = sz.w < 560 ? 0 : 56;
      const bw = Math.max(1, b.x1 - b.x0), bh = Math.max(1, b.y1 - b.y0);
      const k = Math.min((sz.w - left) * 0.75 / bw, sz.h * 0.75 / bh, (wb.fitK || wb.v.k) * 3.2);
      const to = { k, x: left + (sz.w - left - bw * k) / 2 - b.x0 * k, y: (sz.h - bh * k) / 2 - b.y0 * k };
      if (viewRaf) cancelAnimationFrame(viewRaf);
      viewRaf = 0;
      if (ms === 0) { Object.assign(wb.v, to); wb.applyView(); return; }
      const from = Object.assign({}, wb.v), t0 = performance.now(), dur = C.anim(ms || 700);
      const stepV = (now) => {
        const t = Math.min(1, (now - t0) / Math.max(1, dur)), e = 0.5 - Math.cos(t * Math.PI) / 2;
        wb.v.k = from.k + (to.k - from.k) * e;
        wb.v.x = from.x + (to.x - from.x) * e;
        wb.v.y = from.y + (to.y - from.y) * e;
        wb.applyView();
        viewRaf = t < 1 ? requestAnimationFrame(stepV) : 0;
      };
      viewRaf = requestAnimationFrame(stepV);
    }
    function finishPull(P) {
      P.done = true;
      const knotted = !K.isUnknot(P.R.V);
      let msg;
      if (knotted) msg = 'Pulled tight: ' + describe(P.R.V) + '.';
      else msg = P.sim.result === 'straight' ? 'It comes apart: the rope runs out straight.' : 'No knot in it — the rope has only snagged on itself; give it a shake and it runs out straight.';
      ctx.say(msg, knotted ? 'info' : 'good');
      ctx.toast('Click the table (or Let go) to lay the rope down again.');
      info();
      // (after the page has settled: a new status line may resize the table)
      later(() => {
        if (pull !== P) return;
        if (knotted && P.last && P.last.cr.length) {
          const xs = P.last.cr.map((c) => c.x), ys = P.last.cr.map((c) => c.y);
          const m = W * 4.5;
          zoomTo({ x0: Math.min.apply(null, xs) - m, x1: Math.max.apply(null, xs) + m, y0: Math.min.apply(null, ys) - m, y1: Math.max.apply(null, ys) + m });
        } else if (P.last) {
          const mid = P.last.flat[Math.floor(P.last.flat.length / 2)], m = W * 14;
          zoomTo({ x0: mid[0] - m * 1.6, x1: mid[0] + m * 1.6, y0: mid[1] - m, y1: mid[1] + m });
        }
      }, 180);
    }
    // the table may change size (a longer status line …): keep the pulled knot in view
    const ro = root.ResizeObserver ? new root.ResizeObserver(() => { if (pull && pull.zoom && pull.done) zoomTo(pull.zoom, 0); }) : null;
    if (ro) ro.observe(wb.host);
    function stopPull() {
      if (raf) cancelAnimationFrame(raf);
      if (viewRaf) cancelAnimationFrame(viewRaf);
      raf = viewRaf = 0;
      pull = null;
    }
    function letGo() {
      stopPull();
      redraw();
      wb.fit();
      ctx.say('', '');
    }

    /* ----- 3D ----- */
    const COLS = { hemp: ['#c99a58', '#9f7439', '#ddb77c'], red: ['#c9443a', '#982d25', '#e46d61'] };
    const c3 = [(bb.x0 + bb.x1) / 2, (bb.y0 + bb.y1) / 2];
    const to3 = (q) => [(q[0] - c3[0]) / W, (q[2] || 0) / W, (q[1] - c3[1]) / W];
    function tubeMesh(pts3, cols, id, src) {
      const V3 = C.V3, M4 = C.M4, sides = 9, r = 0.5, n = pts3.length;
      const verts = [], faces = [], colors = [], faceSeg = [];
      const tan = [];
      for (let i = 0; i < n; i++) tan.push(V3.norm(V3.sub(pts3[Math.min(n - 1, i + 1)], pts3[Math.max(0, i - 1)])));
      let nrm = V3.norm(V3.cross(tan[0], Math.abs(tan[0][1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
      for (let i = 0; i < n; i++) {
        if (i > 0) {
          const b = V3.cross(tan[i - 1], tan[i]);
          if (V3.len(b) > 1e-6) nrm = V3.norm(M4.applyDir(M4.rotate(Math.acos(Math.max(-1, Math.min(1, V3.dot(tan[i - 1], tan[i])))) * 180 / Math.PI, b), nrm));
        }
        const bin = V3.cross(tan[i], nrm);
        for (let k = 0; k < sides; k++) {
          const a = k / sides * Math.PI * 2;
          verts.push(V3.add(pts3[i], V3.add(V3.mul(nrm, Math.cos(a) * r), V3.mul(bin, Math.sin(a) * r))));
        }
      }
      for (let i = 0; i + 1 < n; i++) {
        for (let k = 0; k < sides; k++) {
          const k2 = (k + 1) % sides;
          faces.push([i * sides + k, i * sides + k2, (i + 1) * sides + k2, (i + 1) * sides + k]);
          // three strands laid in a helix
          colors.push(cols[Math.floor(((k + i * 0.6) % sides + sides) % sides / 3)]);
          faceSeg.push(i);
        }
      }
      const cap0 = [], cap1 = [];
      for (let k = sides - 1; k >= 0; k--) cap0.push(k);
      for (let k = 0; k < sides; k++) cap1.push((n - 1) * sides + k);
      faces.push(cap0, cap1);
      colors.push('#2b4c73', '#2b4c73');
      faceSeg.push(0, n - 1);
      return { id, verts, faces, colors, stroke: false, smooth: true, faceSeg, src };
    }
    // a rope lying on the table: evenly spaced, over-strands lifted
    function lifted(R) {
      const pts = K.resample(R.pts, W * 0.5, false);
      const cr = K.crossings(pts);
      const bits = K.bitsByOver(cr, R.cr.map((c, k) => ({ x: c.x, y: c.y, over: R.bits[k] ? c.da : c.db })));
      const z = K.heights(pts, cr, bits, W * 0.64, W * 3.2);
      return pts.map((q, i) => [q[0], q[1], z[i]]);
    }
    const v3 = wb.use3D({ onPick: (hit) => pick3D(hit) });
    function build3D(fitCam) {
      v3.clear();
      const add = (R, style, which) => {
        if (!R) return;
        const p3 = pull && pull.which === which && pull.last ? pull.last.p3.filter((q, i) => i % 2 === 0) : lifted(R);
        v3.add(tubeMesh(p3.map(to3), COLS[style], which, p3));
      };
      add(rope, 'hemp', 'rope');
      add(scratch, 'red', 'scratch');
      if (fitCam) { v3.fit(0.95); v3.cam.pitch = 52; v3.cam.yaw = -14; }
      // a cloth on the table under it all (drawn first, whatever its depth)
      let cloth = '#20264a';
      try { cloth = root.getComputedStyle(wb.host).getPropertyValue('--board-2').trim() || cloth; } catch (e) { /* default */ }
      const X0 = (B.x0 - 30 - c3[0]) / W, X1 = (B.x1 + 30 - c3[0]) / W, Z0 = (B.y0 - 30 - c3[1]) / W, Z1 = (B.y1 + 30 - c3[1]) / W, Y = -1.35;
      v3.add({ verts: [[X0, Y, Z0], [X0, Y, Z1], [X1, Y, Z1], [X1, Y, Z0]], faces: [[0, 1, 2, 3]], color: cloth, stroke: false, smooth: true, pickable: false, doubleSided: true, bias: 1e6 });
      v3.render();
    }
    function pick3D(hit) {
      if (!hit || !hit.mesh || !hit.mesh.faceSeg || pull || busy) return;
      const q = hit.mesh.src[hit.mesh.faceSeg[hit.face]];
      const R = hit.mesh.id === 'scratch' ? scratch : rope;
      if (!R || !q) return;
      let best = -1, bd = W * 2.2;
      R.cr.forEach((c, k) => { const dd = Math.hypot(c.x - q[0], c.y - q[1]); if (dd < bd) { bd = dd; best = k; } });
      if (best >= 0) doSwitch(hit.mesh.id, best);
    }
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) build3D(true); info(); });

    /* ----- answers ----- */
    let box = null;
    const V0 = rope.V;
    if (kind === 'knot') {
      box = ctx.answer({
        kind: 'choice', label: 'When the two ends are pulled apart…',
        choices: ['It comes apart: **no knot**', 'It holds: **a knot**'],
        check: (v) => {
          answered = true;
          info();
          if (v === (d.answer ? 1 : 0)) {
            later(() => startPull('rope'), C.anim(700));
            return { ok: true, msg: d.answer ? 'Yes, it is knotted: ' + describe(V0) + '. Watch it pull tight.' : 'Yes: no knot at all. Watch it come apart.' };
          }
          return { ok: false, msg: 'Not so. Press **Pull the ends** and watch what happens.' };
        }
      });
    } else if (kind === 'name') {
      const pics = d.choices.map((c) => '<span class="kn-choice">' + K.svg(K.picture(c[0], !!c[1]), { cls: 'kn-cpic' }) + '<em>' + C.esc(choiceName(c[0], c[1])) + '</em></span>');
      box = ctx.answer({
        kind: 'choice', label: 'Which knot is tied in it?', choices: pics,
        check: (v) => {
          answered = true;
          info();
          const c = d.choices[v], a = d.answer;
          if (c[0] === a[0] && (!hand(a[0]) || c[1] === a[1])) {
            later(() => startPull('rope'), C.anim(700));
            return { ok: true, msg: 'Yes: ' + describe(V0) + '.' };
          }
          if (c[0] === a[0]) return { ok: false, msg: 'The right knot, but the wrong hand: look at which way its crossings twist.' };
          return { ok: false, msg: 'Not that one. You may pull the ends now and look.' };
        }
      });
    }

    /* ----- checking, hints, the solution ----- */
    const goal = kind === 'untie' ? (V) => K.isUnknot(V) : kind === 'tie' ? (V) => isKnot(V, d.target[0], d.target[1]) : null;
    let shown = false;
    function check() {
      if (kind === 'untie') {
        const s = switchedCount();
        if (K.isUnknot(rope.V)) {
          if (s <= d.k) { if (!shown) { shown = true; later(() => startPull('rope'), C.anim(900)); } return { solved: true, msg: 'It comes apart. Watch.' }; }
          return { solved: false, msg: 'It comes apart — but you switched ' + s + ' crossings, and ' + d.k + ' would do.' };
        }
        return { solved: false, msg: 'Still knotted: ' + describe(rope.V) + '.' };
      }
      if (kind === 'tie') {
        if (goal(rope.V)) { if (!shown) { shown = true; later(() => startPull('rope'), C.anim(900)); } return { solved: true, msg: 'Tied: ' + describe(rope.V) + '.' }; }
        return { solved: false, msg: 'Not yet: the rope now holds ' + describe(rope.V) + '.' };
      }
      return { solved: false };
    }

    const UNKNOTTING = { '3_1': 1, '4_1': 1, '5_1': 2, '5_2': 1, '6_1': 1, '6_2': 1, '6_3': 1, '7_1': 3, '7_2': 1, '7_3': 2, '7_4': 2, '7_5': 2, '7_6': 1, '7_7': 1, granny: 2, square: 2 };

    function hintKnot(n) {
      const red = K.reduce(rope.cr, rope.bits);
      if (n === 0) {
        if (red.moves.length) {
          const m = red.moves[0], cs = m.k.map((k) => rope.cr[k]);
          return { text: m.type === 1 ? 'The marked crossing is only a curl: pull the rope and it simply unwinds.' : 'At the two marked crossings the same strand lies on top both times: it can slide right off.', show() { flashCrossings(cs); } };
        }
        return 'No curl here, and no strand that simply slides off another: every crossing is held by the others.';
      }
      if (n === 1) {
        const left = red.left.map((k) => rope.cr[k]);
        return { text: 'Undo every curl and slide away every loose loop, one after another, and ' + (left.length ? C.plural(left.length, 'crossing') + ' remain (marked).' : 'no crossing is left at all.'), show() { flashCrossings(left); } };
      }
      if (n === 2) {
        if (K.isAlternating(rope.cr, rope.bits)) return 'Follow the rope from one end: over, under, over, under, all the way. A rope like that with no curl to undo is always knotted — Tait guessed it in the 1880s and it was proved a hundred years later.';
        return 'Follow the rope: somewhere it goes over twice, or under twice, in a row. Slack hides there — though sometimes a knot survives anyway.';
      }
      return null;
    }
    function hintName(n) {
      const a = d.answer, e = K.byId[a[0]];
      if (n === 0) return a[0] === '0_1' ? 'Tidy it up and see how few crossings are left.' : 'However you lay it out, this knot cannot be drawn with fewer than ' + e.c + ' crossings.';
      if (n === 1) {
        const red = K.reduce(rope.cr, rope.bits);
        if (red.moves.length) { const cs = [].concat.apply([], red.moves.map((m) => m.k.map((k) => rope.cr[k]))); return { text: 'The marked crossings can all be undone (curls and loops that slide off). Look at what is left.', show() { flashCrossings(cs); } }; }
        return 'Nothing slides off here: the drawing is as tidy as it gets. Count its crossings.';
      }
      if (n === 2) {
        if (hand(a[0])) return 'Its crossings all twist ' + (a[1] ? 'against' : 'like') + ' the thread of an ordinary screw: it is ' + (a[1] ? 'left' : 'right') + '-handed.';
        if (e.amph) return 'It is the same as its own mirror image.';
        return 'It is not the same as its mirror image. (For the curious: its determinant, a number worked out from the drawing, is ' + e.det + '.)';
      }
      return null;
    }
    function hintSwitch() {
      if (goal(rope.V)) return 'You are there: press Check.';
      if (kind === 'untie' && switchedCount() >= d.k) {
        const gold = rope.cr.filter((c, k) => rope.bits[k] !== rope.orig[k]);
        return { text: 'You have used up your switches without untying it. Switch the gold-dotted crossings back and think again.', show() { flashCrossings(gold); } };
      }
      const f = K.fewestSwitches(rope.prep, rope.bits, goal, 3, 1500);
      if (!f) return 'From here it is a long way: press Reset and start again.';
      if (kind === 'untie' && switchedCount() + f.k > d.k) {
        const gold = rope.cr.filter((c, k) => rope.bits[k] !== rope.orig[k]);
        return { text: 'This way it takes too many switches. Switch the gold-dotted crossings back first.', show() { flashCrossings(gold); } };
      }
      const c = rope.cr[f.set[0]];
      return { text: 'Switch the marked crossing' + (f.k > 1 ? ' — then ' + (f.k === 2 ? 'one more' : WORD[f.k - 1] + ' more') + '.' : '.'), show() { flashCrossings([c]); } };
    }

    function explainText() {
      const Vs = K.poly.str(V0), idn = K.identify(V0);
      if (kind === 'knot') {
        if (!d.answer) {
          const red = K.reduce(base.cr, base.bits);
          return 'There is no knot. ' + (red.left.length ? 'No strand simply slides off at first, yet the rope can be rearranged — a strand dragged across a crossing — until every crossing is gone.' : 'Every crossing can be undone in turn: ' + red.moves.map((m) => (m.type === 1 ? 'a curl unwinds' : 'a loop slides off')).join(', ') + '.') + ' Its Jones polynomial is 1, the same as a plain loop of rope.';
        }
        return 'It is knotted: it ties ' + describe(V0) + '. Its Jones polynomial is ' + Vs + '; a rope with no knot in it always has 1.' + (idn && K.byId[idn.id].nick ? ' (' + cap(K.byId[idn.id].nick) + '.)' : '');
      }
      if (kind === 'name') {
        const e = K.byId[d.answer[0]];
        return 'It is ' + describe(V0) + (e.nick ? ' — ' + e.nick : '') + '. The Jones polynomial of the rope is ' + Vs + ', the table\'s entry for ' + (e.c && /_/.test(e.id) ? e.id.replace('_', '').replace(/^(\d)(\d)$/, '$1<sub>$2</sub>') : e.name) + (hand(e.id) || e.amph ? '' : ' (or its mirror image)') + '.';
      }
      if (kind === 'untie') {
        const u = idn ? UNKNOTTING[idn.id] : null;
        return 'Switching ' + (d.k === 1 ? 'the right crossing' : 'the right ' + WORD[d.k] + ' crossings') + ' unties it. The rope held ' + describe(V0) + '.' + (u ? ' That knot\'s *unknotting number* — the fewest switches in the best of all its drawings — is ' + u + (u < d.k ? ', so this drawing is a wasteful one.' : '.') : '');
      }
      if (kind === 'tie') return 'Switching ' + C.plural(d.sol.length, 'crossing') + ' ties ' + article(knotName(d.target[0], d.target[1])) + '. At the start the rope held ' + describe(V0) + '.';
      return '';
    }

    const inst = {
      hint(n) {
        if (pull) letGo();
        if (kind === 'knot') return hintKnot(n);
        if (kind === 'name') return hintName(n);
        return hintSwitch();
      },
      solve() {
        if (kind === 'knot' || kind === 'name') {
          answered = true;
          info();
          if (box) box.feedback('<b>' + C.esc(kind === 'knot' ? (d.answer ? 'It is knotted: ' + describe(V0) + '.' : 'It comes apart: no knot.') : 'It is ' + describe(V0) + '.') + '</b>', 'good');
          later(() => startPull('rope'), C.anim(400));
          return;
        }
        if (pull) stopPull();
        rope = makeRope(base.pts, base.cr, base.bits.slice(), base.bits.slice());
        ctx.move(0);
        redraw();
        wb.fit();
        busy = true;
        const sol = d.sol.slice();
        const next = () => {
          if (!sol.length) { busy = false; ctx.changed('solve'); return; }
          doSwitch('rope', sol.shift(), true);
          later(next, C.anim(650));
        };
        later(next, C.anim(450));
      },
      explain: explainText,
      getState() {
        const fl = (R) => R.pts.map((q) => [Math.round(q[0] * 10) / 10, Math.round(q[1] * 10) / 10]);
        return { b: rope.bits.join(''), o: rope.orig.join(''), p: rope.shaped ? fl(rope) : null, sc: scratch ? { p: fl(scratch), b: scratch.bits.join(''), o: scratch.orig.join('') } : null };
      },
      setState(s) {
        if (!s) return;
        if (pull) stopPull();
        const fix = (arr, n) => { const b = arr.slice(0, n); while (b.length < n) b.push(0); return b; };
        const mk = (pts, b, o) => { const cr = K.crossings(pts); return makeRope(pts, cr, fix(bitsOf(b), cr.length), fix(bitsOf(o), cr.length)); };
        if (s.p) { rope = mk(s.p, s.b, s.o); rope.shaped = true; }
        else rope = makeRope(base.pts, base.cr, fix(bitsOf(s.b), base.cr.length), fix(bitsOf(s.o || s.b), base.cr.length));
        scratch = s.sc ? mk(s.sc.p, s.sc.b, s.sc.o) : null;
        redraw();
      },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey) return false;
        if (ev.key === 'u' || ev.key === 'U') { if (pull) letGo(); else startPull(scratch && ev.shiftKey ? 'scratch' : 'rope'); return true; }
        if (ev.key === 'Escape' && pull) { letGo(); return true; }
        return false;
      },
      destroy() {
        stopPull();
        if (ro) ro.disconnect();
        timers.forEach((t) => clearTimeout(t));
        timers.clear();
        wb.handlers.board = null;
      }
    };
    if (canSwitch) inst.check = check;
    else inst.noMoves = true;

    redraw();
    if (canSwitch) ctx.stat('Switched', 0);
    return inst;
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'knots',
    name: 'Ropes and knots',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/knot.js'],
    about: 'A rope lies on the table, held by its two ends. Where it crosses itself one strand lies on top; the gap shows which. **Click a crossing** with the knotting tool (**K**) to put the other strand on top (in the puzzles that let you). **Drag the rope** to reshape it: it slides over and under but never passes through itself. **Draw your own rope** (**D**) to experiment beside the puzzle — what you draw later lies on top. **Pull the ends** (**U**) to see what really happens, and **3** looks at it in 3D (drag to turn it; click a crossing there too). The two ends count as joined far away above the table, so a rope either holds a knot or comes apart.',
    answerKey(p) {
      const d = p.data;
      if (d.kind === 'knot') return d.answer ? 1 : 0;
      if (d.kind === 'name') return d.choices.findIndex((c) => c[0] === d.answer[0] && (!(c[0] === '3_1' || c[0] === 'granny') || c[1] === d.answer[1]));
      return null;
    },
    verify: verifyData,
    generate,
    mount,
    thumb(p) {
      const K = KN();
      if (!K) return '';
      const R = ropeOf(p.data);
      return K.svg({ pts: R.pts, cr: R.cr, bits: R.bits, closed: false }, { w: K.W * 1.3, pad: 0.03 });
    }
  });

  C.knotsEngine = { ropeOf, verifyData, makeKnotOrNot, makeName, makeUntie, makeTie, freshDiagram, titleFor, isKnot, choiceName };

  C.css('knots', `
    .kn-mat { fill: var(--board); stroke: var(--line); stroke-width: 2; }
    .kn-rope, .kn-rope * { pointer-events: none; }
    .kn-edge, .kn-body, .kn-dim, .kn-whip { stroke-linecap: butt; }
    .kn-hover { fill: none; stroke: var(--accent); stroke-width: 2.6; stroke-dasharray: 5 4; pointer-events: none; }
    .kn-hover.no { stroke: var(--faint); }
    .kn-switched { fill: var(--gold); stroke: rgba(0, 0, 0, .55); stroke-width: 1.2; pointer-events: none; }
    .kn-ripple { fill: none; stroke: var(--gold); stroke-width: 3; pointer-events: none; transform-box: fill-box; transform-origin: center; animation: knripple .6s ease-out forwards; }
    @keyframes knripple { from { opacity: .95; transform: scale(.35); } to { opacity: 0; transform: scale(1.9); } }
    .kn-hint { fill: rgba(255, 209, 102, .12); stroke: var(--gold); stroke-width: 3.2; stroke-dasharray: 7 5; pointer-events: none; animation: knpulse 1s ease-in-out infinite; }
    @keyframes knpulse { 50% { opacity: .35; } }
    .kn-live { fill: none; stroke: rgba(201, 68, 58, .6); stroke-linecap: round; stroke-linejoin: round; pointer-events: none; }
    .wb[data-mode="knot"].kn-oncross .wb-svg, .wb[data-mode="select"].kn-oncross .wb-svg { cursor: pointer; }
    .wb[data-mode="knot"].kn-onrope .wb-svg, .wb[data-mode="select"].kn-onrope .wb-svg { cursor: grab; }
    .wb.kn-grabbing .wb-svg { cursor: grabbing !important; }
    .wb[data-mode="rope"] .wb-svg { cursor: crosshair; }
    .kn-info p { margin: 0 0 6px; font-size: .86rem; color: var(--muted); line-height: 1.45; }
    .kn-info b { color: var(--text); }
    .kn-red { color: #e0685c; font-weight: 700; }
    .kn-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
    .kn-target { display: flex; align-items: center; gap: 10px; margin: 2px 0 8px; font-size: .92rem; }
    .kn-target svg { width: 70px; height: 60px; flex: none; }
    .ans-choices:has(.kn-choice) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .ans-choice:has(.kn-choice) { flex-direction: column; align-items: stretch; gap: 2px; }
    .kn-choice { display: flex; flex-direction: column; align-items: center; gap: 2px; width: 100%; }
    .kn-choice svg { width: 100%; height: 78px; }
    .kn-choice em { font-style: normal; font-size: .8rem; text-align: center; line-height: 1.25; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
