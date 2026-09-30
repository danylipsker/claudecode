/* The Puzzle Cabinet · engines/pipes.js
 *
 * "Which cup fills first?" Water pours from a tap into a network of cups and
 * pipes. A cup fills until the water reaches its lowest open pipe; from then on
 * everything that comes in runs out through that pipe, and the level stays
 * put. A plugged pipe (or one that leads only to plugs) does not count. Where
 * a pipe splits in two, each branch that is open takes half. A cup with no
 * open pipe below its rim fills to the top and then spills over. The engine
 * runs this as a real simulation in time (exact, event by event) and shows it.
 *
 * data: {
 *   cups:  [[x, y, w, h], …]         left, rim, width, height (y grows downward)
 *   holes: [[cup, side, hgt, pipe], …] side -1 left wall, 1 right wall, 0 bottom; hgt above the cup's floor
 *   pipes: [{ p: [[x, y], …], to: cup | -1 (a drain) | [pipe, pipe] (a split), k: plugged segment }]
 *   tap:   [x, y, to]                 the tap pours straight down into cup `to`, or into pipe -1-to through a funnel
 *   ans:   the cup that fills first
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const M = C.mech;
  const EPS = 1e-7;

  /* ================= the network ================= */

  function tapPipe(d) { return d.tap[2] < 0 ? -1 - d.tap[2] : null; }
  function isOpen(d, j, noPlugs, memo) {
    memo = memo || {};
    if (memo[j] != null) return memo[j];
    const p = d.pipes[j];
    let v;
    if (!noPlugs && p.k != null && p.k >= 0) v = false;
    else if (Array.isArray(p.to)) v = p.to.some((c) => isOpen(d, c, noPlugs, memo));
    else v = true;
    return (memo[j] = v);
  }
  // the cups a pipe finally delivers to
  function pipeCups(d, j, out) {
    out = out || [];
    const to = d.pipes[j].to;
    if (Array.isArray(to)) to.forEach((c) => pipeCups(d, c, out));
    else if (to >= 0) out.push(to);
    return out;
  }
  // cups in an order where water only ever runs forward (null if some pipe runs uphill or in a circle)
  function topo(d) {
    const n = d.cups.length, adj = Array.from({ length: n }, () => new Set());
    d.holes.forEach(([c, , , p]) => pipeCups(d, p).forEach((t) => adj[c].add(t)));
    const seen = new Array(n).fill(0), order = [];
    let bad = false;
    const visit = (u) => { if (seen[u] === 1) { bad = true; return; } if (seen[u]) return; seen[u] = 1; adj[u].forEach(visit); seen[u] = 2; order.push(u); };
    for (let i = 0; i < n; i++) visit(i);
    return bad ? null : order.reverse();
  }

  /* ================= the simulation ================= */

  // exact, event by event: levels are straight lines in time between events
  function simulate(d, opts) {
    opts = opts || {};
    const nc = d.cups.length, np = d.pipes.length;
    const order = topo(d);
    if (!order) return { err: 'water would have to run uphill or round in a circle' };
    const memo = {};
    const open = (j) => isOpen(d, j, opts.noPlugs, memo);
    const holesOf = d.cups.map(() => []);
    d.holes.forEach(([c, side, h, p]) => holesOf[c].push({ h, p, side }));
    holesOf.forEach((hs) => hs.sort((a, b) => a.h - b.h));
    const H = d.cups.map((c) => c[3]), Wd = d.cups.map((c) => c[2]);
    const L = d.cups.map((c) => c[4] || 0);
    const full = new Array(nc).fill(false);
    const fills = [], segs = [];
    let t = 0;
    const lowOpen = (c) => { const h = holesOf[c].find((x) => open(x.p)); return h ? h.h : Infinity; };
    for (let step = 0; step < 400; step++) {
      // where the water goes now
      const Q = new Array(nc).fill(0), PQ = new Array(np).fill(0), spill = [];
      const route = (j, q) => {
        PQ[j] += q;
        const to = d.pipes[j].to;
        if (Array.isArray(to)) { const kids = to.filter(open); kids.forEach((k) => route(k, q / kids.length)); }
        else if (to >= 0) Q[to] += q;
      };
      if (tapPipe(d) != null) route(tapPipe(d), 1); else Q[d.tap[2]] += 1;
      const passing = new Array(nc).fill(false);
      for (const c of order) {
        if (Q[c] <= EPS) continue;
        const hm = lowOpen(c);
        if (L[c] >= hm - EPS) {
          passing[c] = true;
          const at = holesOf[c].filter((x) => Math.abs(x.h - hm) < EPS && open(x.p));
          at.forEach((x) => route(x.p, Q[c] / at.length));
        } else if (L[c] >= H[c] - EPS) spill.push(c);
      }
      // the next thing to happen
      let dt = Infinity;
      for (let c = 0; c < nc; c++) {
        if (Q[c] <= EPS || passing[c] || L[c] >= H[c] - EPS) continue;
        const target = Math.min(lowOpen(c), H[c]);
        dt = Math.min(dt, (target - L[c]) * Wd[c] / Q[c]);
      }
      const L0 = L.slice();
      if (!isFinite(dt)) { segs.push({ t0: t, t1: Infinity, L0, L1: L0, Q, PQ, spill }); break; }
      for (let c = 0; c < nc; c++) {
        if (Q[c] <= EPS || passing[c] || L[c] >= H[c] - EPS) continue;
        const target = Math.min(lowOpen(c), H[c]);
        L[c] = Math.min(target, L[c] + Q[c] * dt / Wd[c]);
        if (target - L[c] < 1e-9 * Math.max(1, target)) L[c] = target;
      }
      segs.push({ t0: t, t1: t + dt, L0, L1: L.slice(), Q, PQ, spill });
      t += dt;
      for (let c = 0; c < nc; c++) if (!full[c] && L[c] >= H[c] - EPS) { full[c] = true; fills.push({ c, t }); }
    }
    return { fills, segs, end: t };
  }

  // the answer and how clear-cut it is
  function judge(d, opts) {
    const s = simulate(d, opts);
    if (s.err) return { err: s.err };
    if (!s.fills.length) return { err: 'no cup ever fills' };
    const a = s.fills[0];
    const b = s.fills[1];
    const margin = b ? (b.t - a.t) / a.t : Infinity;
    return { first: a.c, t: a.t, margin, sim: s };
  }

  /* ================= words ================= */

  const L_ = (i) => M.letter(i);
  function explainOf(d) {
    const s = simulate(d);
    const bits = [];
    const holesOf = d.cups.map(() => []);
    d.holes.forEach(([c, side, h, p]) => holesOf[c].push({ h, p, side }));
    const memo = {};
    const first = s.fills[0];
    // tell the story until the first cup is full
    const seen = new Set();
    const tapTo = tapPipe(d) != null ? pipeCups(d, tapPipe(d)) : [d.tap[2]];
    bits.push('The tap pours into ' + (tapTo.length > 1 ? 'a pipe that shares the water between ' + tapTo.map(L_).join(' and ') : '**' + L_(tapTo[0]) + '**') + '.');
    for (const sg of s.segs) {
      if (sg.t0 >= first.t) break;
      for (let c = 0; c < d.cups.length; c++) {
        if (seen.has(c) || sg.Q[c] <= EPS) continue;
        seen.add(c);
        const hs = holesOf[c].slice().sort((a, b) => a.h - b.h);
        const closed = hs.filter((x) => !isOpen(d, x.p, false, memo));
        const op = hs.find((x) => isOpen(d, x.p, false, memo));
        const below = op ? closed.filter((x) => x.h < op.h) : closed;
        let tx = '**' + L_(c) + '**';
        if (op) {
          // the cups this pipe really feeds (through any open branches)
          const feeds = [];
          const walk = (j) => { const to = d.pipes[j].to; if (Array.isArray(to)) to.filter((k) => isOpen(d, k, false, memo)).forEach(walk); else if (to >= 0) feeds.push(to); };
          walk(op.p);
          tx += op.side === 0 ? ' has an open pipe in its floor, so it never holds water' : ' fills only up to its open pipe';
          if (below.length) tx += ' (the ' + (below.length > 1 ? 'pipes below it are' : 'one below it is') + ' blocked)';
          tx += ' and passes everything on ' + (feeds.length ? 'to ' + feeds.map(L_).join(' and ') + (feeds.length > 1 ? ', half each' : '') : 'down the drain');
        } else {
          tx += closed.length ? '\'s pipes are all blocked, so it fills to the brim' : ' has no way out, so it fills to the brim';
        }
        bits.push(tx + '.');
      }
    }
    const others = s.fills.slice(1).map((f) => L_(f.c));
    bits.push('**' + L_(first.c) + '** is full first' + (others.length ? '; then ' + others.join(', then ') : '') + '.');
    const never = d.cups.map((c, i) => i).filter((i) => !s.fills.some((f) => f.c === i));
    if (never.length) bits.push(never.map(L_).join(', ') + (never.length > 1 ? ' never fill.' : ' never fills.'));
    return bits.join(' ');
  }

  /* ================= drawing ================= */

  const f3 = (v) => Math.round(v * 100) / 100;
  const pd = (pts) => 'M' + pts.map((p) => f3(p[0]) + ' ' + f3(p[1])).join('L');
  function cupPath(c) {
    const [x, y, w, h] = c, r = Math.min(6, w * 0.18);
    return 'M' + f3(x - 2) + ' ' + f3(y - 1.5) + 'Q' + f3(x) + ' ' + f3(y - 1) + ' ' + f3(x) + ' ' + f3(y + 2) +
      'V' + f3(y + h - r) + 'Q' + f3(x) + ' ' + f3(y + h) + ' ' + f3(x + r) + ' ' + f3(y + h) + 'H' + f3(x + w - r) +
      'Q' + f3(x + w) + ' ' + f3(y + h) + ' ' + f3(x + w) + ' ' + f3(y + h - r) + 'V' + f3(y + 2) + 'Q' + f3(x + w) + ' ' + f3(y - 1) + ' ' + f3(x + w + 2) + ' ' + f3(y - 1.5);
  }
  function extent(d) {
    const xs = [], ys = [];
    d.cups.forEach(([x, y, w, h]) => { xs.push(x - 8, x + w + 8); ys.push(y - 8, y + h + 24); });
    d.pipes.forEach((p) => p.p.forEach(([x, y]) => { xs.push(x - 6, x + 6); ys.push(y - 4, y + 6); }));
    xs.push(d.tap[0] - 26, d.tap[0] + 16); ys.push(d.tap[1] - 14);
    return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
  }
  // the point in the middle of a pipe's plugged segment, and the direction
  function plugAt(p) {
    const a = p.p[p.k], b = p.p[p.k + 1] || a;
    return { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI };
  }
  function floorY(d) { return Math.max(...d.cups.map((c) => c[1] + c[3])) + 26; }

  // the static picture as a string (used by the board and by the thumbnail)
  function pictureSVG(d, uid, thumb) {
    let s = '';
    const fy = Math.max(floorY(d), ...d.pipes.map((p) => p.p[p.p.length - 1][1]));
    const e = extent(d);
    s += '<rect x="' + f3(e.x0 - 4) + '" y="' + f3(fy) + '" width="' + f3(e.x1 - e.x0 + 8) + '" height="7" rx="2" class="pp-floor"/>';
    // the tap
    const [tx, ty] = d.tap;
    s += '<path d="M' + f3(tx - 24) + ' ' + f3(ty - 12) + 'H' + f3(tx - 4) + 'Q' + f3(tx + 4) + ' ' + f3(ty - 12) + ' ' + f3(tx + 4) + ' ' + f3(ty - 4) + 'V' + f3(ty) + '" class="pp-tap"/>';
    s += '<path d="M' + f3(tx - 16) + ' ' + f3(ty - 18) + 'V' + f3(ty - 12) + 'M' + f3(tx - 21) + ' ' + f3(ty - 19) + 'H' + f3(tx - 11) + '" class="pp-taph"/>';
    // pipes (outline, body, shine)
    d.pipes.forEach((p, j) => {
      const dd = pd(p.p);
      s += '<path d="' + dd + '" class="pp-pipe-o"/><path d="' + dd + '" class="pp-pipe"/>' + (thumb ? '' : '<path d="' + dd + '" class="pp-pipe-s"/>');
      if (Array.isArray(p.to)) { const q = p.p[p.p.length - 1]; s += '<circle cx="' + f3(q[0]) + '" cy="' + f3(q[1]) + '" r="3.6" class="pp-joint"/>'; }
      if (p.to === -1) { const q = p.p[p.p.length - 1]; s += '<path d="M' + f3(q[0] - 7) + ' ' + f3(q[1]) + 'h14v4h-14z" class="pp-drain"/><path d="M' + f3(q[0] - 5) + ' ' + f3(q[1] + 1) + 'v2m3 -2v2m3 -2v2m3 -2v2m3 -2v2" class="pp-grate"/>'; }
      if (p.k != null && p.k >= 0) { const g = plugAt(p); s += '<g transform="translate(' + f3(g.x) + ' ' + f3(g.y) + ') rotate(' + f3(g.ang) + ')"><rect x="-3.2" y="-5.2" width="6.4" height="10.4" rx="1.6" class="pp-plug"/><path d="M-1.6 -4v8" class="pp-plug-s"/></g>'; }
      if (!Array.isArray(p.to) && p.to >= 0) { const q = p.p[p.p.length - 1]; s += '<path d="M' + f3(q[0] - 3.3) + ' ' + f3(q[1]) + 'h6.6" class="pp-mouth"/>'; }
    });
    const tp = tapPipe(d);
    if (tp != null) { const q = d.pipes[tp].p[0]; s += '<path d="M' + f3(q[0] - 9) + ' ' + f3(q[1] - 9) + 'L' + f3(q[0] - 2.4) + ' ' + f3(q[1] + 1) + 'H' + f3(q[0] + 2.4) + 'L' + f3(q[0] + 9) + ' ' + f3(q[1] - 9) + 'Z" class="pp-funnel"/>'; }
    // cups on their stands
    d.cups.forEach((c, i) => {
      const [x, y, w, h] = c;
      s += '<rect x="' + f3(x - 3) + '" y="' + f3(y + h + 0.8) + '" width="' + f3(w + 6) + '" height="3.4" rx="1.2" class="pp-stand"/>';
      if (thumb) s += '<path d="' + cupPath(c) + '" class="pp-glass" data-cup="' + i + '"/>';
    });
    // holes in the walls
    d.holes.forEach(([c, side, hh]) => {
      const [x, y, w, h] = d.cups[c];
      const px = side < 0 ? x : side > 0 ? x + w : x + w / 2, py = y + h - hh;
      s += '<circle cx="' + f3(px) + '" cy="' + f3(side === 0 ? y + h : py) + '" r="2.6" class="pp-hole"/>';
    });
    return s;
  }

  /* ================= the board ================= */

  function mount(ctx, p) {
    const wb = ctx.wb, d = p.data;
    const uid = M.uid('pp');
    const g = ctx.s('g', { class: 'pp' }, wb.layer('board'));
    M.defs(g, uid);
    const e = extent(d);
    const fy = Math.max(floorY(d), ...d.pipes.map((q) => q.p[q.p.length - 1][1]));
    wb.setBounds({ x0: e.x0 - 6, y0: e.y0 - 6, x1: e.x1 + 6, y1: Math.max(e.y1, fy + 10) + 4 }, 0.04);
    const LS = Math.max(1, Math.min(1.6, Math.max(e.x1 - e.x0, e.y1 - e.y0) / 300));
    ctx.s('rect', { x: e.x0 - 3, y: e.y0 - 3, width: e.x1 - e.x0 + 6, height: Math.max(e.y1, fy + 10) - e.y0 + 5, rx: 8, class: 'pp-wall' }, g);
    const pic = ctx.s('g', null, g);
    pic.innerHTML = pictureSVG(d, uid, false);
    // water in the pipes (drawn over them), streams, cups (over the water), labels
    const pipeW = d.pipes.map((q, j) => ctx.s('path', { d: pd(q.p), class: 'pp-pwater', 'data-pipe': j }, g));
    const wetW = d.pipes.map((q) => (q.k != null && q.k >= 0 ? ctx.s('path', { d: pd(q.p.slice(0, q.k + 1).concat([[plugAt(q).x, plugAt(q).y]])), class: 'pp-wet' }, g) : null));
    const streams = ctx.s('g', { class: 'pp-streams' }, g);
    const tapStream = ctx.s('path', { class: 'pp-stream' }, streams);
    const endStreams = d.pipes.map(() => ctx.s('path', { class: 'pp-stream' }, streams));
    const spills = d.cups.map(() => ctx.s('path', { class: 'pp-spill' }, streams));
    const cupG = d.cups.map((c, i) => {
      const [x, y, w, h] = c;
      const cg = ctx.s('g', { class: 'pp-cup', 'data-cup': i }, g);
      const clip = 'ppc-' + uid + '-' + i;
      ctx.s('clipPath', { id: clip }, cg).appendChild(C.s('path', { d: cupPath(c) + 'Z' }));
      ctx.s('path', { d: cupPath(c) + 'Z', class: 'pp-back' }, cg);
      const water = ctx.s('rect', { x: x - 2, width: w + 4, y: y + h, height: 0, class: 'pp-water', fill: 'url(#' + uid + '-waterL)', 'clip-path': 'url(#' + clip + ')' }, cg);
      const surf = ctx.s('rect', { x: x - 2, width: w + 4, y: y + h, height: 1.3, class: 'pp-surf', 'clip-path': 'url(#' + clip + ')' }, cg);
      ctx.s('path', { d: cupPath(c), class: 'pp-glass', 'data-key': 'cup' + i }, cg);
      ctx.s('path', { d: 'M' + f3(x + 3.2) + ' ' + f3(y + 5) + 'V' + f3(y + h - 5), class: 'pp-shine' }, cg);
      const lg = ctx.s('g', { class: 'pp-label', transform: 'translate(' + f3(x + w / 2) + ' ' + f3(y + h + 17) + ') scale(' + f3(LS) + ')' }, cg);
      ctx.s('circle', { r: 5.6 }, lg);
      ctx.s('text', { y: 2.3, text: L_(i) }, lg);
      const badge = ctx.s('g', { class: 'pp-badge', transform: 'translate(' + f3(x + w / 2) + ' ' + f3(y - 9 * LS) + ') scale(' + f3(LS) + ')' }, cg);
      ctx.s('rect', { x: -9, y: -5.2, width: 18, height: 10.4, rx: 5.2 }, badge);
      const bt = ctx.s('text', { y: 2.2, text: '' }, badge);
      ctx.s('rect', { x: x - 6, y: y - 6, width: w + 12, height: h + 30, class: 'pp-hit' }, cg);
      return { cg, water, surf, badge, bt };
    });
    const hintG = ctx.s('g', { class: 'pp-hints' }, wb.layer('top'));

    const J = judge(d);
    const sim = J.sim;
    let tick = null, shown = false;
    // pose the water at sim time t
    const parentOf = {};
    d.pipes.forEach((q, j) => { if (Array.isArray(q.to)) q.to.forEach((k) => { parentOf[k] = j; }); });
    const holeOf = {};
    d.holes.forEach(([c, side, hh, pj]) => { holeOf[pj] = { c, h: hh }; });
    function segAt(t) { for (const sg of sim.segs) if (t <= sg.t1 + 1e-9) return sg; return sim.segs[sim.segs.length - 1]; }
    function pose(t, done) {
      const sg = segAt(t);
      const u = !isFinite(sg.t1) || sg.t1 === sg.t0 ? 1 : Math.max(0, Math.min(1, (t - sg.t0) / (sg.t1 - sg.t0)));
      const L = sg.L0.map((v, i) => v + (sg.L1[i] - v) * u);
      d.cups.forEach((c, i) => {
        const [x, y, w, h] = c, lv = Math.min(h, L[i]);
        cupG[i].water.setAttribute('y', f3(y + h - lv)); cupG[i].water.setAttribute('height', f3(lv + 2));
        cupG[i].surf.setAttribute('y', f3(y + h - lv)); cupG[i].surf.style.opacity = lv > 0.2 ? 1 : 0;
      });
      const flowing = (j) => sg.PQ[j] > 1e-9;
      pipeW.forEach((el, j) => el.classList.toggle('on', flowing(j)));
      // plugged pipes hold still water up to the plug once water reaches them
      wetW.forEach((el, j) => {
        if (!el) return;
        let wet = false;
        if (holeOf[j]) wet = L[holeOf[j].c] >= holeOf[j].h - 0.01 && holeOf[j].h < d.cups[holeOf[j].c][3];
        else if (parentOf[j] != null) wet = flowing(parentOf[j]) || pipeW[parentOf[j]].classList.contains('on');
        else if (tapPipe(d) === j) wet = true;
        el.classList.toggle('on', wet);
      });
      // the tap's stream falls to the water (or the funnel)
      const tp = tapPipe(d);
      const [tx, ty] = d.tap;
      let tyEnd;
      if (tp != null) tyEnd = d.pipes[tp].p[0][1] - 2;
      else { const c = d.cups[d.tap[2]]; tyEnd = c[1] + c[3] - Math.min(c[3], L[d.tap[2]]); }
      tapStream.setAttribute('d', 'M' + f3(tx) + ' ' + f3(ty) + 'V' + f3(tyEnd));
      d.pipes.forEach((q, j) => {
        const el = endStreams[j];
        if (Array.isArray(q.to) || q.to < 0 || !flowing(j)) { el.setAttribute('d', ''); return; }
        const a = q.p[q.p.length - 1], c = d.cups[q.to];
        el.setAttribute('d', 'M' + f3(a[0]) + ' ' + f3(a[1]) + 'V' + f3(c[1] + c[3] - Math.min(c[3], L[q.to])));
      });
      d.cups.forEach((c, i) => {
        const sp = sg.spill.includes(i) && (t > sg.t0 || done);
        const [x, y, w, h] = c;
        spills[i].setAttribute('d', sp ? 'M' + f3(x + w + 1.5) + ' ' + f3(y - 1) + 'q2.5 0 2.5 4V' + f3(y + h + 1) : '');
      });
      // fill order badges
      sim.fills.forEach((f, k) => {
        const on = f.t <= t + 1e-9;
        const B = cupG[f.c];
        if (on && !B.badge.classList.contains('on')) { B.badge.classList.add('on'); B.bt.textContent = ORD[k] || (k + 1) + 'th'; if (tick && shown) ctx.sfx(k === 0 ? 'solve' : 'snap'); }
        if (!on) B.badge.classList.remove('on');
        B.cg.classList.toggle('first', on && k === 0);
      });
    }
    const ORD = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
    // play the whole thing: the sim time up to a little after the last cup fills
    function run() {
      if (tick) tick.stop();
      const last = sim.fills.length ? sim.fills[sim.fills.length - 1].t : sim.end;
      const T = Math.max(last, sim.segs.filter((s) => isFinite(s.t1)).reduce((m, s) => Math.max(m, s.t1), 0)) * 1.08 || 1;
      const D = Math.max(6, Math.min(13, 4 + 1.2 * sim.fills.length));
      shown = true;
      runBtn.textContent = 'Stop';
      tick = M.ticker((s) => {
        const u = Math.min(1, s / D);
        pose(u * T, u >= 1);
        if (u >= 1) { tick = null; runBtn.textContent = 'Pour again'; ctx.say(summary(), 'info'); return false; }
        return true;
      });
    }
    function summary() {
      const f = sim.fills.map((x) => L_(x.c));
      const never = d.cups.map((c, i) => i).filter((i) => !sim.fills.some((x) => x.c === i)).map(L_);
      return 'Order of filling: **' + f.join(' → ') + '**' + (never.length ? '. ' + never.join(', ') + (never.length > 1 ? ' never fill.' : ' never fills.') : '.');
    }
    const runBtn = ctx.button('Pour the water', () => { if (tick) { tick.stop(); tick = null; runBtn.textContent = 'Pour again'; } else run(); }, 'small');
    runBtn.hidden = true;
    pose(0);
    // before anything runs, show only the tap's first trickle
    pipeW.forEach((el) => el.classList.remove('on'));
    wetW.forEach((el) => el && el.classList.remove('on'));
    endStreams.forEach((el) => el.setAttribute('d', ''));

    const choices = d.cups.map((c, i) => 'Cup ' + L_(i));
    const box = ctx.answer({
      kind: 'choice', choices, label: 'Which cup fills first?',
      check(v) {
        if (v === d.ans) { runBtn.hidden = false; setTimeout(run, C.anim(200)); return { ok: true, msg: 'Yes: **cup ' + L_(v) + '** fills first.' }; }
        return { ok: false, msg: wrongMsg(v) };
      }
    });
    function wrongMsg(v) {
      const got = sim.segs.some((s) => s.Q[v] > 1e-9);
      if (!got) return 'Cup ' + L_(v) + ' never gets a drop — follow the pipes that lead to it.';
      if (!sim.fills.some((f) => f.c === v)) return 'Cup ' + L_(v) + ' never fills: its water runs straight out through an open pipe.';
      return 'Cup ' + L_(v) + ' does fill — but not first.';
    }
    // clicking a cup answers too
    wb.handlers.board = {
      down(pt, ev, el) { return !!(el && el.closest && el.closest('.pp-cup')); },
      tap(pt, ev, el) {
        const cg = el && el.closest ? el.closest('.pp-cup') : null;
        if (!cg) return;
        const i = +cg.getAttribute('data-cup');
        const btn = box.el.querySelectorAll('.ans-choice')[i];
        if (btn && !box.el.classList.contains('done')) btn.click();
      },
      up(pt, ev) {
        const el = root.document.elementFromPoint(ev.clientX, ev.clientY);
        const cg = el && el.closest ? el.closest('.pp-cup') : null;
        if (!cg) return;
        const i = +cg.getAttribute('data-cup');
        const btn = box.el.querySelectorAll('.ans-choice')[i];
        if (btn && !box.el.classList.contains('done')) btn.click();
      }
    };

    function flash(els, cls, ms) { els.forEach((x) => x && x.classList.add(cls)); setTimeout(() => els.forEach((x) => x && x.classList.remove(cls)), ms || 6000); }
    return {
      noMoves: true,
      hint(n) {
        const memo = {};
        if (n === 0) return 'Water leaves a cup only through its lowest *open* pipe, and then the level stops rising. A cup fills to the brim only if no open pipe lets the water out.';
        if (n === 1) {
          return {
            text: 'The blocked pipes are glowing, and the holes they make useless are crossed out.',
            show() {
              hintG.textContent = '';
              d.holes.forEach(([c, side, hh, pj]) => {
                if (isOpen(d, pj, false, memo)) return;
                const [x, y, w, h] = d.cups[c];
                const px = side < 0 ? x : side > 0 ? x + w : x + w / 2, py = side === 0 ? y + h : y + h - hh;
                ctx.s('path', { d: 'M' + f3(px - 3.5) + ' ' + f3(py - 3.5) + 'l7 7m0 -7l-7 7', class: 'pp-x' }, hintG);
              });
              const plugs = [];
              d.pipes.forEach((q, j) => { if (q.k != null && q.k >= 0) { const gg = plugAt(q); plugs.push(ctx.s('circle', { cx: f3(gg.x), cy: f3(gg.y), r: 8, class: 'pp-hint-ring' }, hintG)); } });
              setTimeout(() => { hintG.textContent = ''; }, 7000);
            }
          };
        }
        if (n === 2) {
          const upto = sim.fills[0].t;
          const used = new Set();
          sim.segs.forEach((s) => { if (s.t0 < upto) s.PQ.forEach((q, j) => { if (q > 1e-9) used.add(j); }); });
          return { text: 'The pipes the water runs through before the first cup is full are marked.', show() { flash([...used].map((j) => pipeW[j]), 'hint'); } };
        }
        if (n === 3) {
          const fillers = sim.fills.map((f) => L_(f.c));
          return 'Only ' + (fillers.length > 1 ? 'these cups ever fill: ' + fillers.join(', ') + '. Where the water splits, each branch gets half — so a big cup on a half share is slow.' : 'one cup ever fills.');
        }
        return null;
      },
      solve() {
        box.feedback('The answer: <b>cup ' + L_(d.ans) + '</b>', 'good');
        runBtn.hidden = false;
        setTimeout(run, C.anim(250));
      },
      explain() { return explainOf(d); },
      destroy() { if (tick) tick.stop(); wb.handlers.board = null; }
    };
  }

  /* ================= making networks ================= */

  const LEV = [null,
    { rows: [2, 3], per: [[1, 1], [2, 2], [1, 2]], holes: [1, 2], plugs: [1, 1], split: 0, bottom: 0, drain: 0, tapSplit: 0, margin: 0.25, last: 0 },
    { rows: [2, 3], per: [[1, 1], [2, 2], [2, 2]], holes: [1, 2], plugs: [1, 2], split: 0, bottom: 0.1, drain: 0, tapSplit: 0, margin: 0.2, last: 0.3 },
    { rows: [3, 3], per: [[1, 2], [2, 3], [2, 3]], holes: [1, 2], plugs: [1, 2], split: 0.3, bottom: 0.15, drain: 0.1, tapSplit: 0.25, margin: 0.15, last: 0.4 },
    { rows: [3, 4], per: [[1, 2], [2, 3], [3, 3], [3, 3]], holes: [1, 2], plugs: [2, 3], split: 0.4, bottom: 0.2, drain: 0.15, tapSplit: 0.4, margin: 0.1, last: 0.5 },
    { rows: [4, 4], per: [[2, 2], [3, 3], [3, 4], [3, 4]], holes: [1, 2], plugs: [3, 4], split: 0.5, bottom: 0.2, drain: 0.2, tapSplit: 0.5, margin: 0.08, last: 0.5 }
  ];
  const WS = [24, 28, 32, 36, 40, 46], HS = [28, 32, 36, 40, 46, 52];
  const GAP = 40, LANE = 7;

  function build(rng, sp, why) {
    const R = rng.range(sp.rows[0], sp.rows[1]);
    const rows = [];
    for (let r = 0; r < R; r++) {
      const pr = sp.per[Math.min(r, sp.per.length - 1)];
      const n = rng.range(pr[0], pr[1]);
      const cups = [];
      for (let k = 0; k < n; k++) cups.push({ w: rng.pick(WS), h: rng.pick(HS), r });
      const width = cups.reduce((s, c) => s + c.w, 0) + GAP * (n - 1);
      let x = -width / 2 + rng.range(-10, 10);
      cups.forEach((c) => { c.x = x; x += c.w + GAP; });
      rows.push(cups);
    }
    const all = [].concat(...rows);
    all.forEach((c, i) => { c.i = i; c.inc = 0; });
    const minX = Math.min(...all.map((c) => c.x)) - 26, maxX = Math.max(...all.map((c) => c.x + c.w)) + 26;
    // links: from a hole to a cup below, a split, or a drain
    const links = [];
    // the cup a pipe should feed: near, on its own side if possible, and one that has no supply yet
    const nearest = (row, x, side) => {
      if (!row.length) return null;
      const cost = (c) => { const cx = c.x + c.w / 2; return Math.abs(cx - x) + (side && Math.sign(cx - x) !== side && Math.abs(cx - x) > 26 ? 45 : 0) + 70 * c.inc; };
      return row.reduce((b, c) => (cost(c) < cost(b) ? c : b), row[0]);
    };
    let dl = 0, dr = 0;
    const tapSplit = rows[0].length >= 2 && rng() < sp.tapSplit;
    const tapCup = tapSplit ? null : rng.pick(rows[0]);
    if (tapCup) tapCup.inc++;
    else rows[0].slice(0, 2).forEach((c) => c.inc++);
    for (let r = 0; r < R; r++) {
      const next = rows[r + 1];
      rows[r].forEach((c) => {
        if (!next && rng() >= sp.last) return;
        const nh = next ? rng.range(sp.holes[0], sp.holes[1]) : 1;
        const sides = nh === 2 ? [-1, 1] : [rng() < 0.5 ? -1 : 1];
        if (rng() < sp.bottom) sides.push(0);
        const hts = new Set();
        sides.forEach((side) => {
          let hh = 0;
          if (side !== 0) { for (let k = 0; k < 8; k++) { hh = Math.round(c.h * (0.18 + 0.62 * rng()) / 2) * 2; if (!hts.has(hh)) break; } if (hts.has(hh)) return; hts.add(hh); }
          const x0 = side < 0 ? c.x - 12 : side > 0 ? c.x + c.w + 12 : c.x + c.w / 2 + rng.range(-4, 4);
          const L = { c, side, h: hh, x0 };
          const drainAt = (left) => (left ? minX - 7 * dl++ : maxX + 7 * dr++);
          if (!next || rng() < sp.drain) { L.drain = drainAt(x0 < (minX + maxX) / 2); links.push(L); return; }
          if (rng() < sp.split) {
            const lft = nearest(next.filter((t) => t.x + t.w / 2 < x0 - 6), x0, 0), rgt = nearest(next.filter((t) => t.x + t.w / 2 > x0 + 6), x0, 0);
            if (lft && rgt) { L.split = [lft, rgt]; lft.inc++; rgt.inc++; links.push(L); return; }
          }
          const t = nearest(next, x0, side);
          if (!t) { L.drain = drainAt(side < 0); links.push(L); return; }
          L.to = t; t.inc++;
          links.push(L);
        });
      });
    }
    if (all.some((c) => c.r > 0 && c.inc === 0) && rng() < 0.8) { if (why) why.r = 'inc'; return null; }
    // heights: rows, channels, lanes
    let Y = 70;
    const pipes = [], holes = [];
    const tapX = tapCup ? tapCup.x + tapCup.w / 2 + rng.range(-3, 3) : (rows[0][0].x + rows[0][0].w + rows[0][1].x) / 2;
    const tap = [Math.round(tapX), 18, 0];
    for (let r = 0; r < R; r++) {
      rows[r].forEach((c) => { c.y = Y; });
      const maxB = Math.max(...rows[r].map((c) => c.y + c.h));
      const mine = links.filter((L) => L.c.r === r);
      const lanes = mine.length;
      const Yn = maxB + 16 + lanes * LANE + 18;
      if (rows[r + 1]) rows[r + 1].forEach((c) => { c.y = Yn; });
      mine.forEach((L, k) => { L.yl = maxB + 16 + k * LANE; });
      Y = Yn;
    }
    const floor = Math.max(...all.map((c) => c.y + c.h)) + 30 + links.filter((L) => L.drain != null && L.c.r === R - 1).length * 0;
    // target x on a cup's mouth, spread so pipes do not share a spot
    // where a pipe drops into a cup: as far as possible from every other vertical pipe near it
    const verticals = links.map((L) => ({ x: L.x0, r: L.c.r }));
    const into = (t) => {
      let best = t.x + t.w / 2, bd = -1;
      for (let x = t.x + 5; x <= t.x + t.w - 5; x += 1) {
        const dd = verticals.filter((v) => v.r === t.r - 1 || v.r === t.r).reduce((m, v) => Math.min(m, Math.abs(v.x - x)), 99) + 0.01 * Math.abs(x - (t.x + t.w / 2)) * -1;
        if (dd > bd) { bd = dd; best = x; }
      }
      verticals.push({ x: best, r: t.r - 1 });
      return Math.round(best);
    };
    // routes
    links.forEach((L) => {
      const c = L.c, yh = c.y + c.h - L.h;
      const start = L.side === 0 ? [L.x0, c.y + c.h] : [L.side < 0 ? c.x : c.x + c.w, yh];
      const head = L.side === 0 ? [start, [L.x0, L.yl]] : [start, [L.x0, yh], [L.x0, L.yl]];
      const j = pipes.length;
      if (L.drain != null) {
        pipes.push({ p: head.concat([[L.drain, L.yl], [L.drain, floor]]), to: -1 });
      } else if (L.split) {
        pipes.push({ p: head, to: [j + 1, j + 2] });
        L.split.forEach((t) => { const xt = into(t); pipes.push({ p: [[L.x0, L.yl], [xt, L.yl], [xt, t.y - 5]], to: t.i }); });
      } else {
        const xt = into(L.to);
        pipes.push({ p: head.concat(Math.abs(xt - L.x0) > 0.5 ? [[xt, L.yl]] : []).concat([[xt, L.to.y - 5]]), to: L.to.i });
      }
      holes.push([c.i, L.side, L.h, j]);
    });
    if (tapCup) tap[2] = tapCup.i;
    else {
      const j = pipes.length, yt = rows[0][0].y - 18;
      pipes.push({ p: [[tap[0], 40], [tap[0], yt]], to: [j + 1, j + 2] });
      rows[0].slice(0, 2).forEach((t) => { const xt = into(t); pipes.push({ p: [[tap[0], yt], [xt, yt], [xt, t.y - 5]], to: t.i }); });
      tap[2] = -1 - j;
    }
    // plugs, on a vertical run where they are easy to see
    const np = rng.range(sp.plugs[0], sp.plugs[1]);
    const cand = pipes.map((q, j) => j).filter((j) => !(tapPipe({ tap }) === j));
    rng.shuffle(cand);
    let placed = 0;
    for (const j of cand) {
      if (placed >= np) break;
      const q = pipes[j];
      const segs = [];
      for (let k = 0; k < q.p.length - 1; k++) { const a = q.p[k], b = q.p[k + 1]; if (Math.hypot(b[0] - a[0], b[1] - a[1]) > 14) segs.push(k); }
      if (!segs.length) continue;
      q.k = rng.pick(segs);
      placed++;
    }
    const cups = all.map((c) => [Math.round(c.x), Math.round(c.y), c.w, c.h]);
    // round the pipes onto the rounded cups
    pipes.forEach((q) => { q.p = q.p.map(([x, y]) => [Math.round(x), Math.round(y)]); });
    const d = { cups, holes, pipes, tap };
    if (overlaps(d)) { if (why) why.r = 'overlap'; return null; }
    return d;
  }
  // two pipes running along each other (not a split and its branch) would be unreadable
  function overlaps(d) {
    const segs = [];
    const fam = {};
    d.pipes.forEach((q, j) => { if (Array.isArray(q.to)) q.to.forEach((k) => { fam[k] = j; }); });
    d.pipes.forEach((q, j) => { for (let k = 0; k < q.p.length - 1; k++) segs.push({ j, a: q.p[k], b: q.p[k + 1] }); });
    const rel = (i, j) => i === j || fam[i] === j || fam[j] === i || (fam[i] != null && fam[i] === fam[j]);
    for (let u = 0; u < segs.length; u++) {
      for (let v = u + 1; v < segs.length; v++) {
        const A = segs[u], B = segs[v];
        if (rel(A.j, B.j)) continue;
        const av = A.a[0] === A.b[0], bv = B.a[0] === B.b[0];
        if (av && bv && Math.abs(A.a[0] - B.a[0]) < 5) {
          const lo = Math.max(Math.min(A.a[1], A.b[1]), Math.min(B.a[1], B.b[1])), hi = Math.min(Math.max(A.a[1], A.b[1]), Math.max(B.a[1], B.b[1]));
          if (hi - lo > -2) return true;
        }
        const ah = A.a[1] === A.b[1], bh = B.a[1] === B.b[1];
        if (ah && bh && Math.abs(A.a[1] - B.a[1]) < 4) {
          const lo = Math.max(Math.min(A.a[0], A.b[0]), Math.min(B.a[0], B.b[0])), hi = Math.min(Math.max(A.a[0], A.b[0]), Math.max(B.a[0], B.b[0]));
          if (hi - lo > -2) return true;
        }
      }
    }
    // no pipe may pass through a cup
    for (const s of segs) {
      for (const c of d.cups) {
        const [x, y, w, h] = c;
        const x0 = Math.min(s.a[0], s.b[0]), x1 = Math.max(s.a[0], s.b[0]), y0 = Math.min(s.a[1], s.b[1]), y1 = Math.max(s.a[1], s.b[1]);
        if (x1 > x + 1 && x0 < x + w - 1 && y1 > y + 1 && y0 < y + h - 1) return true;
      }
    }
    return false;
  }

  // a network of the asked level, whose first cup is clear-cut and not the obvious one
  function make(rng, lv) {
    const sp = LEV[lv];
    for (let tries = 0; tries < 160; tries++) {
      const d = build(rng, sp);
      if (!d) continue;
      const J = judge(d);
      if (J.err || J.margin < sp.margin) continue;
      const tapCup = tapPipe(d) == null ? d.tap[2] : null;
      if (J.first === tapCup) continue;
      if (lv >= 2) {
        const J2 = judge(d, { noPlugs: true });
        if (!J2.err && J2.first === J.first && rng() < 0.8) continue;
      }
      // several cups should be in play before the first one fills
      const wet = new Set();
      J.sim.segs.forEach((s) => { if (s.t0 < J.t) s.Q.forEach((q, i) => { if (q > 1e-9) wet.add(i); }); });
      if (wet.size < Math.min(lv + 1, 4)) continue;
      // from the middle levels on, usually a real race: more than one cup fills in the end
      if (lv >= 3 && J.sim.fills.length < 2 && rng() < 0.75) continue;
      if (lv >= 4) {
        const fillers = J.sim.fills.map((f) => f.c);
        const vol = (i) => d.cups[i][2] * d.cups[i][3];
        const smallest = fillers.reduce((b, i) => (vol(i) < vol(b) ? i : b), fillers[0]);
        if (fillers.length > 1 && smallest === J.first && rng() < 0.6) continue;
      }
      d.ans = J.first;
      return d;
    }
    return null;
  }

  /* ================= the engine ================= */

  C.engine({
    id: 'pipes',
    name: 'Which cup fills first?',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'],
    deps: ['js/lib/mech.js'],
    noMoves: true,
    about: 'Water pours from the tap. A cup fills until the water reaches its lowest **open** pipe; after that everything that comes in runs out through the pipe and the level stays put. A red plug blocks a pipe — and a pipe that leads only to plugs is as good as blocked. Where a pipe splits, each open branch gets half. A cup with no open pipe fills to the brim. **Click the cup** that fills first (or pick it in the panel); then watch the water run.',

    verify(p) {
      const d = p.data;
      if (!d || !d.cups || !d.holes || !d.pipes || !d.tap) return { ok: false, err: 'cups, holes, pipes and tap are needed' };
      for (const [c, side, h, j] of d.holes) {
        if (!d.cups[c] || !d.pipes[j]) return { ok: false, err: 'a hole refers to a missing cup or pipe' };
        if (h < 0 || h >= d.cups[c][3]) return { ok: false, err: 'a hole is not in its cup\'s wall' };
      }
      // pipes run downhill into the cups they feed
      for (const q of d.pipes) {
        if (!Array.isArray(q.to) && q.to >= 0) { const c = d.cups[q.to], e = q.p[q.p.length - 1]; if (!c || e[1] > c[1] || e[0] < c[0] || e[0] > c[0] + c[2]) return { ok: false, err: 'a pipe does not end over the mouth of its cup' }; }
      }
      const J = judge(d);
      if (J.err) return { ok: false, err: J.err };
      if (J.margin < 0.05) return { ok: false, err: 'two cups fill almost together (' + (J.margin * 100).toFixed(1) + '% apart)' };
      if (J.first !== d.ans) return { ok: false, err: 'cup ' + L_(J.first) + ' fills first, not ' + L_(d.ans) };
      return { ok: true };
    },

    answerKey(p) { return p.data.ans; },

    generate(rng, level) {
      const d = make(rng, level);
      if (!d) return null;
      return { title: 'Which cup fills first?', text: 'Water pours from the tap. Which cup is the first to fill to the brim?', diff: level, data: d };
    },

    mount,

    thumb(p) {
      // a bold little picture: fat pipes, cups with a hint of water, red plugs
      const d = p.data, e = extent(d), fy = floorY(d);
      let s = '<svg viewBox="' + f3(e.x0 - 4) + ' ' + f3(e.y0 - 4) + ' ' + f3(e.x1 - e.x0 + 8) + ' ' + f3(Math.max(e.y1, fy + 8) - e.y0 + 8) + '" preserveAspectRatio="xMidYMid meet">';
      s += '<path d="M' + f3(d.tap[0] - 22) + ' ' + f3(d.tap[1] - 12) + 'H' + f3(d.tap[0]) + 'V' + f3(d.tap[1]) + '" fill="none" stroke="#9aa3b5" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
      d.pipes.forEach((q) => { s += '<path d="' + pd(q.p) + '" fill="none" stroke="#c27a45" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>'; });
      d.pipes.forEach((q) => { if (q.k != null && q.k >= 0) { const g = plugAt(q); s += '<circle cx="' + f3(g.x) + '" cy="' + f3(g.y) + '" r="5.5" fill="#d8443f"/>'; } });
      d.cups.forEach((c) => { s += '<path d="' + cupPath(c) + 'Z" fill="rgba(120, 180, 255, .22)" stroke="var(--ink-2)" stroke-width="3" stroke-linejoin="round"/>'; });
      return s + '</svg>';
    }
  });

  C.pipesLib = { simulate, judge, make, build, isOpen, explainOf, LEV };

  C.css('pipes', `
    .pp-wall { fill: var(--board-2); stroke: var(--line); stroke-width: .6; }
    .pp-floor { fill: var(--wood-dark); opacity: .6; }
    .pp-tap { fill: none; stroke: #9aa3b5; stroke-width: 6; stroke-linecap: round; stroke-linejoin: round; }
    .pp-taph { fill: none; stroke: #c9cfdd; stroke-width: 2.2; stroke-linecap: round; }
    .pp-pipe-o { fill: none; stroke: #4a2610; stroke-width: 6.2; stroke-linejoin: round; stroke-linecap: round; }
    .pp-pipe { fill: none; stroke: #c27a45; stroke-width: 4.4; stroke-linejoin: round; stroke-linecap: round; }
    .pp-pipe-s { fill: none; stroke: #f0b889; stroke-width: 1; stroke-linejoin: round; stroke-linecap: round; opacity: .55; }
    .pp-joint { fill: #a8653a; stroke: #4a2610; stroke-width: 1; }
    .pp-drain { fill: #2b2f3b; stroke: #151821; stroke-width: .6; }
    .pp-grate { stroke: #6b7080; stroke-width: .8; fill: none; }
    .pp-plug { fill: #d8443f; stroke: #7a1714; stroke-width: .9; }
    .pp-plug-s { stroke: #ff9c95; stroke-width: 1; opacity: .7; }
    .pp-mouth { stroke: #4a2610; stroke-width: 1.4; }
    .pp-funnel { fill: #b8763f; stroke: #4a2610; stroke-width: 1; stroke-linejoin: round; }
    .pp-stand { fill: var(--wood); stroke: var(--wood-dark); stroke-width: .5; }
    .pp-post { stroke: var(--wood-dark); stroke-width: 2.2; }
    .pp-hole { fill: #10131d; stroke: #4a2610; stroke-width: .8; }
    .pp-back { fill: rgba(170, 210, 255, .07); }
    .pp-glass { fill: none; stroke: var(--ink-2); stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
    .pp-thumb .pp-glass { stroke-width: 2.2; }
    .pp-shine { stroke: rgba(255, 255, 255, .22); stroke-width: 1.6; stroke-linecap: round; }
    .pp-water { opacity: .88; }
    .pp-surf { fill: #bfe6ff; opacity: .9; }
    .pp-pwater { fill: none; stroke: #3aa7ef; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 3 2.2; opacity: 0; }
    .pp-pwater.on { opacity: 1; animation: ppflow .45s linear infinite; }
    .pp-pwater.hint { opacity: 1; stroke: var(--teal); stroke-width: 3; }
    .pp-wet { fill: none; stroke: #3aa7ef; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; opacity: 0; }
    .pp-wet.on { opacity: .85; }
    @keyframes ppflow { to { stroke-dashoffset: -5.2; } }
    .pp-stream { fill: none; stroke: #4db3f5; stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 4 1.5; animation: ppflow .3s linear infinite; }
    .pp-spill { fill: none; stroke: #4db3f5; stroke-width: 1.6; stroke-linecap: round; stroke-dasharray: 3 1.5; animation: ppflow .3s linear infinite; }
    .pp-cup { cursor: pointer; }
    .pp-cup:hover .pp-glass { stroke: var(--accent); }
    .pp-cup.first .pp-glass { stroke: var(--gold); stroke-width: 2.2; }
    .pp-hit { fill: transparent; }
    .pp-label circle { fill: var(--panel); stroke: var(--ink-2); stroke-width: .6; }
    .pp-label text { font: 800 6.4px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; }
    .pp-badge { opacity: 0; transition: opacity .25s; pointer-events: none; }
    .pp-badge.on { opacity: 1; }
    .pp-badge rect { fill: var(--gold); }
    .pp-badge text { font: 800 6px "Segoe UI", system-ui, sans-serif; fill: #2a1e00; text-anchor: middle; }
    .pp-x { stroke: var(--red); stroke-width: 1.6; stroke-linecap: round; fill: none; }
    .pp-hint-ring { fill: none; stroke: var(--gold); stroke-width: 1.4; stroke-dasharray: 2.5 1.8; animation: pppulse 1s ease-in-out infinite; }
    @keyframes pppulse { 50% { opacity: .35; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
