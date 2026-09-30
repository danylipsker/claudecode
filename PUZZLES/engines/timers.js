/* The Puzzle Cabinet · engines/timers.js
 *
 * Measuring time with things that were never meant for it.
 *
 * Burning ropes: each rope takes a known time to burn from end to end, but
 * it burns unevenly, so half the rope is not half the time. You may light an
 * end (or both) only at the start or at a moment you can recognise: when
 * something burns out or runs dry. Lit at both ends, a rope burns out in
 * half the time it has left. Some puzzles let you blow a rope out and light
 * what is left later.
 *
 * Hourglasses: a- and b-minute glasses, turned over whenever one runs out.
 *
 * The clock runs from one such moment to the next; in between you act.
 *
 * data: {
 *   ropes: [60, 60]        minutes each rope takes to burn from one end (or none)
 *   glasses: [4, 7]        minutes each hourglass holds (or none)
 *   target: 45             measure exactly this many minutes
 *   from: 'start' | 'any'  the interval starts at the beginning, or at any moment you choose (Start measuring)
 *   snuff: true            ropes may be blown out (and lit again later)
 *   seed: 7                how unevenly each rope burns (drawing only)
 * }
 * p.par = the fewest actions (a lit end, a turn, a blown-out rope), found by search.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the rules (moments when you can act) ---------- */

  const EPS = 1e-9;
  // search state: { t, t0, R: [[left, lit ends]], G: [sand on top] }
  function begin(d) { return { t: 0, t0: 0, R: (d.ropes || []).map((T) => [T, 0]), G: (d.glasses || []).map(() => 0) }; }
  function nextDt(s) {
    let dt = Infinity;
    s.R.forEach((r) => { if (r[1] && r[0] > EPS) dt = Math.min(dt, r[0] / r[1]); });
    s.G.forEach((top) => { if (top > EPS) dt = Math.min(dt, top); });
    return dt;
  }
  function advance(s, dt) {
    return {
      t: s.t + dt, t0: s.t0,
      R: s.R.map((r) => { if (!r[1]) return r.slice(); const left = r[0] - r[1] * dt; return left <= EPS ? [0, 0] : [left, r[1]]; }),
      G: s.G.map((top) => Math.max(0, top - dt))
    };
  }
  const keyOf = (s) => s.t + '|' + s.t0 + '|' + s.R.map((r) => r[0] + ':' + r[1]).join(',') + '|' + s.G.join(',');
  const goalAt = (d, s) => s.t > s.t0 + EPS && Math.abs(s.t - s.t0 - d.target) < EPS;

  // what can be done at a moment: every combination, with its cost (one per lit end, turn or blow-out)
  function choices(d, s) {
    const per = s.R.map((r) => {
      const o = [{ c: 0, lit: r[1], a: null }];
      if (r[0] > EPS) {
        if (r[1] === 0) { o.push({ c: 1, lit: 1, a: 'one' }); o.push({ c: 2, lit: 2, a: 'both' }); }
        else if (r[1] === 1) o.push({ c: 1, lit: 2, a: 'other' });
        if (r[1] > 0 && d.snuff) o.push({ c: 1, lit: 0, a: 'snuff' });
      }
      return o;
    });
    const glass = s.G.map(() => [false, true]);
    const marks = d.from === 'any' && s.t > 0 ? [false, true] : [false];
    const out = [];
    const rec = (i, acc) => {
      if (i < per.length) { per[i].forEach((o) => rec(i + 1, acc.concat([o]))); return; }
      const j = i - per.length;
      if (j < glass.length) { glass[j].forEach((g) => rec(i + 1, acc.concat([g]))); return; }
      marks.forEach((m) => {
        const ro = acc.slice(0, per.length), gl = acc.slice(per.length);
        let cost = 0;
        const acts = [];
        ro.forEach((o, k) => { cost += o.c; if (o.a) acts.push({ k: o.a === 'snuff' ? 'snuff' : 'light', i: k, a: o.a }); });
        gl.forEach((g, k) => { if (g) { cost++; acts.push({ k: 'turn', i: k }); } });
        if (m) acts.push({ k: 'mark' });
        out.push({ cost, acts, R: s.R.map((r, k) => [r[0], ro[k].lit]), G: s.G.map((top, k) => (gl[k] ? (d.glasses[k] - top) : top)), mark: m });
      });
    };
    rec(0, []);
    return out;
  }

  function horizon(d) {
    const units = (d.ropes || []).concat(d.glasses || []);
    return d.from === 'any' ? d.target + 2 * Math.max.apply(null, units.concat([30])) + 30 : d.target;
  }

  /* The fewest actions from state s0 to a moment exactly `target` minutes
   * after the measuring started (ties: the earliest finish). Returns
   * { cost, steps: [{ acts, t }], finish } or null. */
  function solve(d, s0, limit) {
    s0 = s0 || begin(d);
    if (goalAt(d, s0)) return { cost: 0, steps: [], finish: s0.t };
    const tMax = horizon(d) + EPS;
    const best = new Map([[keyOf(s0), { cost: 0, t: s0.t }]]);
    const prev = new Map();
    const heap = [];
    const push = (e) => { heap.push(e); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (less(heap[i], heap[p])) { const x = heap[i]; heap[i] = heap[p]; heap[p] = x; i = p; } else break; } };
    const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && less(heap[l], heap[m])) m = l; if (r < heap.length && less(heap[r], heap[m])) m = r; if (m === i) break; const x = heap[i]; heap[i] = heap[m]; heap[m] = x; i = m; } } return top; };
    const less = (a, b) => a.cost < b.cost || (a.cost === b.cost && a.s.t < b.s.t);
    push({ cost: 0, s: s0, k: keyOf(s0) });
    let pops = 0;
    while (heap.length) {
      const e = pop();
      const b0 = best.get(e.k);
      if (b0 && (b0.cost < e.cost || (b0.cost === e.cost && b0.t < e.s.t))) continue;
      if (goalAt(d, e.s)) {
        const steps = [];
        let k = e.k;
        while (prev.has(k)) { const p = prev.get(k); steps.unshift({ acts: p.acts, t: p.t }); k = p.from; }
        return { cost: e.cost, steps, finish: e.s.t };
      }
      if (++pops > (limit || 60000)) break;
      for (const ch of choices(d, e.s)) {
        const s1 = { t: e.s.t, t0: ch.mark ? e.s.t : e.s.t0, R: ch.R, G: ch.G };
        const dt = nextDt(s1);
        if (!isFinite(dt)) continue;
        const s2 = advance(s1, dt);
        if (s2.t > tMax || s2.t0 > tMax) continue;
        const c2 = e.cost + ch.cost, k2 = keyOf(s2);
        const b = best.get(k2);
        if (b && (b.cost < c2 || (b.cost === c2 && b.t <= s2.t))) continue;
        best.set(k2, { cost: c2, t: s2.t });
        prev.set(k2, { from: e.k, acts: ch.acts, t: e.s.t });
        push({ cost: c2, s: s2, k: k2 });
      }
    }
    return null;
  }

  /* ---------- words ---------- */

  const LETTER = 'ABCD';
  function fmtMin(m) {
    const w = Math.floor(m + EPS), f = m - w;
    const fr = Math.abs(f) < EPS ? '' : Math.abs(f - 0.5) < EPS ? '½' : Math.abs(f - 0.25) < EPS ? '¼' : Math.abs(f - 0.75) < EPS ? '¾' : Math.abs(f - 0.125) < EPS ? '⅛' : Math.abs(f - 0.375) < EPS ? '⅜' : Math.abs(f - 0.625) < EPS ? '⅝' : Math.abs(f - 0.875) < EPS ? '⅞' : ('.' + String(Math.round(f * 1000) / 1000).slice(2));
    return (w || !fr ? String(w) : '') + fr;
  }
  const minutes = (m) => fmtMin(m) + (Math.abs(m - 1) < EPS ? ' minute' : ' minutes');
  function clock(m) {
    const secs = Math.round(m * 60), h = Math.floor(secs / 3600), mm = Math.floor(secs / 60) % 60, ss = secs % 60;
    return h + ':' + String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
  }
  function ropeName(d, i) { return (d.ropes.length > 1 ? 'rope ' + LETTER[i] : 'the rope'); }
  function glassName(d, i) { return 'the ' + d.glasses[i] + '-minute glass'; }
  function describeActs(d, acts) {
    const words = acts.map((a) => {
      if (a.k === 'light') return a.a === 'both' ? 'light both ends of ' + ropeName(d, a.i) : a.a === 'other' ? 'light the other end of ' + ropeName(d, a.i) : 'light one end of ' + ropeName(d, a.i);
      if (a.k === 'snuff') return 'blow out ' + ropeName(d, a.i);
      if (a.k === 'turn') return 'turn ' + glassName(d, a.i) + ' over';
      if (a.k === 'mark') return 'start measuring';
      return '';
    });
    if (!words.length) return 'Do nothing yet: let time run.';
    const s = words.length === 1 ? words[0] : words.slice(0, -1).join(', ') + ' and ' + words[words.length - 1];
    return s.charAt(0).toUpperCase() + s.slice(1) + '.';
  }
  function planText(d, plan) {
    return plan.steps.map((st, i) => (i ? 'at ' : 'At ') + (st.t ? minutes(st.t) : 'the start') + ': ' + describeActs(d, st.acts).replace(/\.$/, '').replace(/^./, (c) => c.toLowerCase())).join('; ') + '; at ' + minutes(plan.finish) + ' exactly ' + minutes(d.target) + ' have passed' + (plan.steps.some((s) => s.acts.some((a) => a.k === 'mark')) ? ' since you started measuring' : '') + '.';
  }

  function statement(d) {
    if (d.ropes && d.ropes.length) {
      const n = d.ropes.length, same = d.ropes.every((T) => T === d.ropes[0]);
      const intro = n === 1 ? 'You have a rope (a fuse, really) that takes exactly ' + minutes(d.ropes[0]) + ' to burn from end to end'
        : same ? 'You have ' + ['', '', 'two', 'three', 'four'][n] + ' ropes, each of which takes exactly ' + minutes(d.ropes[0]) + ' to burn from end to end'
          : 'You have ropes that take ' + d.ropes.map((T, i) => minutes(T) + ' (' + LETTER[i] + ')').join(' and ') + ' to burn from end to end';
      return intro + ' — but unevenly, so half a rope is not half the time. You may light an end, or both ends, only at the start or at the moment something burns out.' + (d.snuff ? ' You may also blow a rope out and light what is left later.' : '') + '\n\n' +
        (d.from === 'any' ? 'Measure exactly **' + minutes(d.target) + '** — you may start timing at any moment you can recognise.' : 'Measure exactly **' + minutes(d.target) + '**, starting now.');
    }
    const g = d.glasses;
    return 'You have hourglasses of ' + g.slice(0, -1).map((x) => x + '').join(', ') + (g.length > 1 ? ' and ' : '') + g[g.length - 1] + ' minutes, all run down. Turn any of them over at the start, or at the moment one runs out.\n\n' +
      (d.from === 'any' ? 'Time exactly **' + minutes(d.target) + '** — you may start timing whenever one runs out.' : 'Time exactly **' + minutes(d.target) + '**, starting now.');
  }
  function goalText(d) { return 'Reach a moment exactly ' + minutes(d.target) + ' after you started measuring.'; }

  /* ---------- making puzzles ---------- */

  const ROPE_SETS = [[60], [60, 60], [60, 60], [60, 30], [30, 30], [60, 60, 60], [60, 60, 30], [60, 30, 30], [60, 45], [90, 60], [120, 60]];
  const GLASS_SETS = [[4, 7], [7, 11], [5, 9], [3, 5], [4, 9], [5, 7], [6, 11], [3, 8], [7, 13], [5, 8], [9, 13], [4, 11], [5, 13], [3, 7], [2, 5], [7, 9], [3, 5, 8], [4, 7, 9], [5, 6, 9], [3, 7, 10], [4, 9, 11], [6, 10, 15]];

  // how hard: the fewest actions, how many moments, a late start, blowing out
  function gradeOf(d, plan) {
    let g = plan.cost + plan.steps.length * 0.6;
    if (plan.steps.some((s) => s.acts.some((a) => a.k === 'mark'))) g += 1.5;
    if (plan.steps.some((s) => s.acts.some((a) => a.k === 'snuff'))) g += 1.5;
    if ((d.glasses || []).length + (d.ropes || []).length >= 3) g += 1;
    return g;
  }
  const BANDS = { ropes: [null, [0, 3.7], [3.7, 4.9], [4.9, 6.2], [6.2, 7.8], [7.8, 99]], glasses: [null, [0, 4.8], [4.8, 6.3], [6.3, 7.9], [7.9, 9.6], [9.6, 99]] };

  function titleOf(d) {
    const t = minutes(d.target).replace(' minutes', '').replace(' minute', '');
    const W = { 1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five', 6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten', 11: 'Eleven', 12: 'Twelve', 13: 'Thirteen', 14: 'Fourteen', 15: 'Fifteen', 16: 'Sixteen', 17: 'Seventeen', 18: 'Eighteen', 19: 'Nineteen', 20: 'Twenty', 30: 'Thirty', 45: 'Forty-Five', 60: 'Sixty', 90: 'Ninety' };
    const tw = t; void W;
    const late = d.from === 'any' ? ', Any Start' : '';
    if (d.ropes && d.ropes.length) {
      const n = d.ropes.length, same = d.ropes.every((x) => x === d.ropes[0]);
      return tw + ' Minutes, ' + ['', 'One Fuse', 'Two Fuses', 'Three Fuses', 'Four Fuses'][n] + (n > 1 && !same ? ' of ' + d.ropes.join(', ') : '') + (d.snuff ? ', Blown Out' : '') + late;
    }
    return tw + ' Minutes by the ' + d.glasses.join(' and the ') + late;
  }

  function make(rng, kind, level) {
    for (let tries = 0; tries < 60; tries++) {
      let d;
      if (kind === 'ropes') {
        const set = rng.pick(ROPE_SETS).slice();
        const snuff = level >= 3 && rng() < 0.4;
        const from = rng() < (level <= 1 ? 0.2 : 0.45) ? 'any' : 'start';
        const unit = 7.5 / (rng() < 0.3 && level >= 3 ? 2 : 1);
        const max = Math.max.apply(null, set) * (from === 'any' ? 1 : set.length);
        const target = unit * rng.range(1, Math.floor(max / unit));
        d = { ropes: set, target, from, seed: rng.range(1, 999) };
        if (snuff) d.snuff = true;
      } else {
        const set = rng.pick(GLASS_SETS).slice();
        const from = rng() < 0.35 ? 'any' : 'start';
        const target = rng.range(1, Math.max.apply(null, set) * 3);
        d = { glasses: set, target, from };
      }
      if ((d.glasses || []).includes(d.target) || (d.ropes || []).includes(d.target)) continue;
      const plan = solve(d, null, 30000);
      if (!plan || plan.cost < 1) continue;
      // no shortcut through a feature the puzzle offers but does not need
      if (d.snuff && solve(Object.assign({}, d, { snuff: false }), null, 30000)) delete d.snuff;
      if (d.from === 'any') { const p2 = solve(Object.assign({}, d, { from: 'start' }), null, 30000); if (p2 && p2.cost <= plan.cost) d.from = 'start'; }
      const plan2 = solve(d, null, 30000);
      const g = gradeOf(d, plan2), band = BANDS[kind][level];
      if (g < band[0] || g >= band[1]) continue;
      return { title: titleOf(d), text: statement(d), goal: goalText(d), par: plan2.cost, diff: level, data: d };
    }
    return null;
  }

  function verify(p) {
    const d = p.data;
    if (!d || !(d.target > 0)) return { ok: false, err: 'data.target is needed' };
    if (!(d.ropes && d.ropes.length) && !(d.glasses && d.glasses.length)) return { ok: false, err: 'no ropes and no glasses' };
    if (d.ropes && d.ropes.length && d.glasses && d.glasses.length) return { ok: false, err: 'ropes and glasses together are not supported' };
    const plan = solve(d);
    if (!plan) return { ok: false, err: 'it cannot be measured' };
    if (plan.cost === 0) return { ok: false, err: 'nothing to do' };
    if (p.par != null && p.par !== plan.cost) return { ok: false, err: 'par is ' + p.par + ' but the fewest actions is ' + plan.cost };
    return { ok: true, par: plan.cost };
  }

  /* ---------- on the table ---------- */

  let uidSeq = 0;

  function mount(ctx, p) {
    const d = p.data, wb = ctx.wb, S = ctx.s;
    const nR = (d.ropes || []).length, nG = (d.glasses || []).length;
    const uid = 'tm' + (++uidSeq);
    const rowY = (i) => (nR === 1 ? 150 : nR === 2 ? 110 + i * 140 : 95 + i * 112);
    const TLy = nR ? Math.max(380, rowY(nR - 1) + 150) : 470;
    const WW = 940, HH = TLy + 60;
    let st = fresh();
    let busy = false, raf = 0, hover = null;
    const timers = new Set();
    const later = (fn, ms) => { const t = setTimeout(() => { timers.delete(t); fn(); }, ms); timers.add(t); return t; };

    function fresh() {
      return {
        t: 0, t0: 0,
        R: (d.ropes || []).map((T) => ({ T, cl: 0, cr: 0, l: 0, r: 0 })),
        G: (d.glasses || []).map((cap) => ({ cap, top: 0 })),
        ev: [], log: []
      };
    }
    const rem = (r) => r.T - r.cl - r.cr;
    const searchState = () => ({ t: st.t, t0: st.t0, R: st.R.map((r) => [rem(r) > EPS ? rem(r) : 0, rem(r) > EPS ? r.l + r.r : 0]), G: st.G.map((g) => g.top) });

    /* ----- layout ----- */
    const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
    wb.setBounds({ x0: 0, y0: 0, x1: WW, y1: HH }, 0.04);
    const defs = S('defs', null, bg);
    defs.innerHTML =
      '<radialGradient id="' + uid + '-glow"><stop offset="0" stop-color="#ffcf6b" stop-opacity=".85"/><stop offset=".45" stop-color="#ff8a2a" stop-opacity=".35"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="' + uid + '-sand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f2d38a"/><stop offset="1" stop-color="#d4a650"/></linearGradient>' +
      '<linearGradient id="' + uid + '-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a6a37"/><stop offset="1" stop-color="#6b4420"/></linearGradient>';
    S('rect', { x: -10, y: -10, width: WW + 20, height: HH + 20, rx: 26, class: 'tm-table' }, bg);

    // ropes: a wavy line each, and how unevenly it burns
    const ropes = (d.ropes || []).map((T, i) => {
      const rng = C.rng((d.seed || 1) * 7919 + i * 104729);
      const y = rowY(i), x0 = 80, x1 = 590, ph = rng() * 6, amp = 6 + rng() * 5, fq = 1 + rng() * 1.2;
      const a1 = 0.35 + rng() * 0.3, f1 = 0.7 + rng() * 1.1, p1 = rng(), a2 = 0.12 + rng() * 0.2, f2 = 2 + rng() * 2.5, p2 = rng();
      const N = 240, cum = [0];
      for (let k = 1; k <= N; k++) {
        const u = (k - 0.5) / N;
        const rho = Math.max(0.12, 1 + a1 * Math.sin(2 * Math.PI * (f1 * u + p1)) + a2 * Math.sin(2 * Math.PI * (f2 * u + p2)));
        cum.push(cum[k - 1] + rho);
      }
      const tot = cum[N];
      for (let k = 0; k <= N; k++) cum[k] = cum[k] / tot * T;
      const P = (u) => [x0 + (x1 - x0) * u, y + amp * Math.sin(2 * Math.PI * (fq * u) + ph)];
      const uOf = (c) => { // where along the rope `c` minutes of burning from the left end reach
        if (c <= 0) return 0;
        if (c >= T) return 1;
        let lo = 0, hi = N;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] < c) lo = m; else hi = m; }
        return (lo + (c - cum[lo]) / ((cum[hi] - cum[lo]) || 1)) / N;
      };
      const g = S('g', { class: 'tm-rope' }, board);
      const ash = S('path', { class: 'tm-ash' }, g);
      const edge = S('path', { class: 'tm-redge' }, g);
      const body = S('path', { class: 'tm-rbody' }, g);
      const lay = S('path', { class: 'tm-rlay' }, g);
      const ends = S('g', null, g);
      S('text', { x: x0 - 34, y: y + 6, class: 'tm-rlabel', text: nR > 1 ? LETTER[i] : '' }, g);
      S('text', { x: x1 + 18, y: y + 6, class: 'tm-rmin', text: minutes(T) }, g);
      return { T, y, x0, x1, P, uOf, g, ash, edge, body, lay, ends };
    });

    // hourglasses
    const glasses = (d.glasses || []).map((cap, j) => {
      const cx = nG === 1 ? 330 : nG === 2 ? 210 + j * 250 : 130 + j * 205, cy = 250;
      const g = S('g', { class: 'tm-glass', transform: 'translate(' + cx + ' ' + cy + ')' }, board);
      const inner = S('g', null, g);
      const bulb = 'M-40 -96C-40 -44-7 -20-7 0C-7 20-40 44-40 96L40 96C40 44 7 20 7 0C7 -20 40 -44 40 -96Z';
      const cp = S('clipPath', { id: uid + '-cl' + j }, S('defs', null, inner));
      S('path', { d: bulb }, cp);
      S('path', { d: bulb, class: 'tm-bulb' }, inner);
      const sandTop = S('rect', { x: -44, width: 88, class: 'tm-sand', fill: 'url(#' + uid + '-sand)', 'clip-path': 'url(#' + uid + '-cl' + j + ')' }, inner);
      const sandBot = S('path', { class: 'tm-sand', fill: 'url(#' + uid + '-sand)', 'clip-path': 'url(#' + uid + '-cl' + j + ')' }, inner);
      const stream = S('path', { class: 'tm-stream', d: 'M0 0V90' }, inner);
      S('path', { d: bulb, class: 'tm-glassline' }, inner);
      S('path', { d: 'M-27 -84C-27 -52-12 -34-10 -20', class: 'tm-shine' }, inner);
      S('rect', { x: -56, y: -112, width: 112, height: 15, rx: 5, fill: 'url(#' + uid + '-wood)', class: 'tm-plate' }, inner);
      S('rect', { x: -56, y: 97, width: 112, height: 15, rx: 5, fill: 'url(#' + uid + '-wood)', class: 'tm-plate' }, inner);
      [-49, 49].forEach((x) => S('rect', { x: x - 3, y: -98, width: 6, height: 196, rx: 3, fill: 'url(#' + uid + '-wood)' }, inner));
      S('text', { x: 0, y: 142, class: 'tm-gmin', text: minutes(cap) }, g);
      const hit = S('rect', { x: -62, y: -118, width: 124, height: 240, class: 'tm-hit' }, g);
      return { cap, cx, cy, g, inner, sandTop, sandBot, stream, hit };
    });

    // the clock
    const CK = { x: 810, y: 128, r: 92 };
    const clockG = S('g', { class: 'tm-clock', transform: 'translate(' + CK.x + ' ' + CK.y + ')' }, board);
    S('circle', { r: CK.r, class: 'tm-face' }, clockG);
    const arc = S('path', { class: 'tm-arc' }, clockG);
    for (let k = 0; k < 60; k++) {
      const a = k / 60 * 2 * Math.PI, r1 = k % 5 ? CK.r - 7 : CK.r - 13;
      S('line', { x1: Math.sin(a) * r1, y1: -Math.cos(a) * r1, x2: Math.sin(a) * (CK.r - 3), y2: -Math.cos(a) * (CK.r - 3), class: k % 5 ? 'tm-tick' : 'tm-tick5' }, clockG);
    }
    [0, 15, 30, 45].forEach((m) => { const a = m / 60 * 2 * Math.PI; S('text', { x: Math.sin(a) * (CK.r - 27), y: -Math.cos(a) * (CK.r - 27) + 6, class: 'tm-num', text: String(m) }, clockG); });
    const aim = S('circle', { r: 6, class: 'tm-aim' }, clockG);
    const hours = S('text', { x: 0, y: 34, class: 'tm-hours' }, clockG);
    const hand = S('line', { x1: 0, y1: 10, x2: 0, y2: -(CK.r - 16), class: 'tm-hand' }, clockG);
    S('circle', { r: 6, class: 'tm-pin' }, clockG);
    const digital = S('text', { x: CK.x, y: CK.y + CK.r + 30, class: 'tm-digital' }, board);
    const measured = S('text', { x: CK.x, y: CK.y + CK.r + 54, class: 'tm-measured' }, board);

    // the timeline
    const TL = { x0: 70, x1: 880, y: TLy };
    const tline = S('g', { class: 'tm-timeline' }, board);
    const fx = S('g', null, top);

    const span = () => {
      const want = Math.max(d.target + st.t0, st.t, ...st.ev) * 1.12 + 2;
      const step = want <= 24 ? 2 : want <= 50 ? 5 : want <= 130 ? 15 : 30;
      return { max: Math.ceil(want / step) * step, step };
    };
    const tx = (t, sp) => TL.x0 + (TL.x1 - TL.x0) * t / sp.max;

    /* ----- drawing ----- */
    function drawRope(k, R, stt) {
      const r = stt.R[k], left = rem(r);
      const uL = R.uOf(r.cl), uR = R.uOf(r.T - r.cr);
      const path = (a, b) => { if (b - a < 1e-4) return ''; let s = ''; const n = Math.max(2, Math.ceil((b - a) * 120)); for (let q = 0; q <= n; q++) { const pt = R.P(a + (b - a) * q / n); s += (q ? 'L' : 'M') + pt[0].toFixed(1) + ' ' + pt[1].toFixed(1); } return s; };
      const alive = left > EPS ? path(uL, uR) : '';
      R.edge.setAttribute('d', alive);
      R.body.setAttribute('d', alive);
      R.lay.setAttribute('d', alive);
      R.ash.setAttribute('d', path(0, left > EPS ? uL : 1) + path(left > EPS ? uR : 1, 1));
      R.ends.innerHTML = '';
      if (left <= EPS) return;
      const flame = (u, side) => {
        const pt = R.P(u);
        const f = S('g', { class: 'tm-flame', transform: 'translate(' + pt[0].toFixed(1) + ' ' + (pt[1] - 2).toFixed(1) + ')' }, R.ends);
        S('circle', { r: 22, fill: 'url(#' + uid + '-glow)' }, f);
        const fl = S('g', { class: 'tm-fl' }, f);
        S('path', { d: 'M0 2C-10 -6-8 -20 0 -34C8 -20 10 -6 0 2Z', class: 'tm-f1' }, fl);
        S('path', { d: 'M0 1C-5 -4-4 -12 0 -21C4 -12 5 -4 0 1Z', class: 'tm-f2' }, fl);
        S('circle', { r: 4.5, class: 'tm-ember' }, f);
        f.dataset.side = side;
      };
      if (r.l) flame(uL, 'l');
      if (r.r) flame(uR, 'r');
    }
    function drawGlass(k, G, stt) {
      const gg = stt.G[k], f = gg.top / gg.cap;
      const ht = f * 92, hb = (1 - f) * 92;
      G.sandTop.setAttribute('y', (-ht).toFixed(1));
      G.sandTop.setAttribute('height', (ht + 0.5).toFixed(1));
      G.sandBot.setAttribute('d', hb > 0.5 ? 'M-46 97V' + (97 - hb * 0.72).toFixed(1) + 'Q0 ' + (97 - hb * 1.28).toFixed(1) + ' 46 ' + (97 - hb * 0.72).toFixed(1) + 'V97Z' : '');
      G.stream.style.opacity = gg.top > EPS ? 1 : 0;
      G.g.classList.toggle('running', gg.top > EPS);
    }
    function drawClock(stt) {
      const t = stt.t, a = (t % 60) / 60 * 360;
      hand.setAttribute('transform', 'rotate(' + a.toFixed(2) + ')');
      hours.textContent = t >= 60 - EPS ? Math.floor(t / 60 + EPS) + ' h' : '';
      const m = t - stt.t0;
      if (m >= 60 - EPS) arc.setAttribute('d', 'M0 ' + (-CK.r + 4) + 'A' + (CK.r - 4) + ' ' + (CK.r - 4) + ' 0 1 1 -0.01 ' + (-CK.r + 4) + 'Z');
      else if (m > EPS) {
        const a0 = (stt.t0 % 60) / 60 * 2 * Math.PI, a1 = a0 + m / 60 * 2 * Math.PI, rr = CK.r - 4;
        arc.setAttribute('d', 'M0 0L' + (Math.sin(a0) * rr).toFixed(2) + ' ' + (-Math.cos(a0) * rr).toFixed(2) + 'A' + rr + ' ' + rr + ' 0 ' + (m > 30 ? 1 : 0) + ' 1 ' + (Math.sin(a1) * rr).toFixed(2) + ' ' + (-Math.cos(a1) * rr).toFixed(2) + 'Z');
      } else arc.setAttribute('d', '');
      const ag = ((stt.t0 + d.target) % 60) / 60 * 2 * Math.PI;
      aim.setAttribute('cx', (Math.sin(ag) * (CK.r - 3)).toFixed(1));
      aim.setAttribute('cy', (-Math.cos(ag) * (CK.r - 3)).toFixed(1));
      digital.textContent = clock(t);
      measured.textContent = (d.from === 'any' ? 'measured since ' + clock(stt.t0) + ': ' : 'measured: ') + fmtMin(m) + ' of ' + fmtMin(d.target) + ' min';
    }
    function drawTimeline(stt) {
      tline.innerHTML = '';
      const sp = span();
      S('line', { x1: TL.x0, y1: TL.y, x2: TL.x1, y2: TL.y, class: 'tm-axis' }, tline);
      for (let m = 0; m <= sp.max + EPS; m += sp.step) {
        const x = tx(m, sp);
        S('line', { x1: x, y1: TL.y - 5, x2: x, y2: TL.y + 5, class: 'tm-axis' }, tline);
        S('text', { x, y: TL.y + 22, class: 'tm-tl', text: String(m) }, tline);
      }
      // the goal: a bracket from the start of measuring
      const g0 = tx(stt.t0, sp), g1 = tx(stt.t0 + d.target, sp);
      S('path', { d: 'M' + g0 + ' ' + (TL.y - 20) + 'V' + (TL.y - 28) + 'H' + g1 + 'V' + (TL.y - 20), class: 'tm-goal' }, tline);
      S('text', { x: (g0 + g1) / 2, y: TL.y - 34, class: 'tm-goalt', text: minutes(d.target) }, tline);
      // the time gone by, and every moment you could act
      S('line', { x1: TL.x0, y1: TL.y, x2: tx(stt.t, sp), y2: TL.y, class: 'tm-past' }, tline);
      stt.ev.forEach((t) => S('circle', { cx: tx(t, sp), cy: TL.y, r: 5, class: 'tm-ev' }, tline));
      S('path', { d: 'M' + tx(stt.t, sp) + ' ' + (TL.y - 9) + 'l-7 -12h14z', class: 'tm-now' }, tline);
    }
    function draw(stt) {
      stt = stt || st;
      ropes.forEach((R, k) => drawRope(k, R, stt));
      glasses.forEach((G, k) => drawGlass(k, G, stt));
      drawClock(stt);
      drawTimeline(stt);
      sync();
    }

    /* ----- the side panel ----- */
    const panel = ctx.panel;
    const row = ctx.h('div.tm-row');
    panel.appendChild(row);
    const runBtn = ctx.h('button.btn.primary', { type: 'button', onclick: () => runTime(), title: 'Let the clock run to the next moment something burns out or runs dry (T)' }, '▶ Let time run');
    row.appendChild(runBtn);
    const markBtn = ctx.h('button.btn', { type: 'button', onclick: () => mark(), title: 'Start measuring from this moment (S)' }, 'Start measuring now');
    if (d.from === 'any') row.appendChild(markBtn);
    const helpEl = ctx.h('div.tm-help', { html: ctx.md(nR ? 'Click an **end** of a rope to light it' + (d.snuff ? '; click a **flame** to blow the rope out' : '') + '.' : 'Click an **hourglass** to turn it over.') });
    panel.appendChild(helpEl);
    const logEl = ctx.h('ol.tm-log');
    panel.appendChild(logEl);

    function running(stt) {
      stt = stt || st;
      return stt.R.some((r) => (r.l || r.r) && rem(r) > EPS) || stt.G.some((g) => g.top > EPS);
    }
    function sync() {
      runBtn.disabled = busy || !running();
      markBtn.disabled = busy || st.t0 === st.t;
      logEl.innerHTML = st.log.map((l) => '<li><b>' + clock(l.t) + '</b> ' + C.esc(l.what) + '</li>').join('');
      logEl.scrollTop = logEl.scrollHeight;
    }
    function note(what) { st.log.push({ t: st.t, what }); }

    /* ----- acting ----- */
    function lightEnd(i, side) {
      const r = st.R[i];
      if (busy || rem(r) <= EPS) return;
      if (r[side]) {
        if (!d.snuff) { ctx.toast('It is already burning at that end.'); return; }
        r.l = r.r = 0;
        note('Blew out ' + ropeName(d, i) + ' (' + minutes(rem(r)) + ' of burning left in it).');
        ctx.sfx('tap');
      } else {
        r[side] = 1;
        note('Lit the ' + (side === 'l' ? 'left' : 'right') + ' end of ' + ropeName(d, i) + '.');
        ctx.sfx('snap');
      }
      ctx.move();
      draw();
      ctx.changed('light');
    }
    function turnGlass(j, done) {
      if (busy) return;
      const G = glasses[j];
      busy = true;
      sync();
      ctx.sfx('tap');
      const t0 = performance.now(), dur = C.anim(420);
      const step = (now) => {
        const k = Math.min(1, (now - t0) / Math.max(1, dur)), e = 0.5 - Math.cos(k * Math.PI) / 2;
        G.inner.setAttribute('transform', 'rotate(' + (180 * e).toFixed(1) + ')');
        if (k < 1) { raf = requestAnimationFrame(step); return; }
        raf = 0;
        G.inner.removeAttribute('transform');
        st.G[j].top = st.G[j].cap - st.G[j].top;
        note('Turned ' + glassName(d, j) + ' over.');
        busy = false;
        ctx.move();
        draw();
        ctx.changed('turn');
        if (done) done();
      };
      raf = requestAnimationFrame(step);
    }
    function mark() {
      if (busy || d.from !== 'any' || st.t0 === st.t) return;
      st.t0 = st.t;
      note('Started measuring.');
      ctx.sfx('tap');
      draw();
      ctx.changed('mark');
    }
    // run the clock to the next moment
    function runTime(done) {
      if (busy) return;
      const s = searchState(), dt = nextDt(s);
      if (!isFinite(dt)) { ctx.toast(nR ? 'Nothing is burning: light an end first.' : 'No glass is running: turn one over first.'); return; }
      const from = JSON.parse(JSON.stringify(st));
      const to = JSON.parse(JSON.stringify(st));
      to.t = st.t + dt;
      to.R.forEach((r) => {
        if (!(r.l || r.r) || rem(r) <= EPS) return;
        if (r.l && r.r) { r.cl += dt; r.cr += dt; } else if (r.l) r.cl += dt; else r.cr += dt;
        if (rem(r) <= EPS) { if (r.l && r.r) r.cr = r.T - r.cl; else if (r.l) r.cl = r.T - r.cr; else r.cr = r.T - r.cl; r.l = r.r = 0; }
      });
      to.G.forEach((g) => { g.top = Math.max(0, g.top - dt); });
      busy = true;
      sync();
      const t0 = performance.now(), dur = C.anim(Math.min(2600, 700 + dt * 45));
      const step = (now) => {
        const k = Math.min(1, (now - t0) / Math.max(1, dur));
        const cur = JSON.parse(JSON.stringify(from));
        const tt = dt * k;
        cur.t = from.t + tt;
        cur.R.forEach((r, i) => {
          const r0 = from.R[i];
          if (!(r0.l || r0.r) || rem(r0) <= EPS) return;
          if (r0.l && r0.r) { r.cl = r0.cl + tt; r.cr = r0.cr + tt; } else if (r0.l) r.cl = r0.cl + tt; else r.cr = r0.cr + tt;
          if (k >= 1) Object.assign(r, to.R[i]);
        });
        cur.G.forEach((g, i) => { g.top = Math.max(0, from.G[i].top - tt); });
        draw(cur);
        if (k < 1) { raf = requestAnimationFrame(step); return; }
        raf = 0;
        st = to;
        st.ev = st.ev.concat([st.t]);
        const what = [];
        from.R.forEach((r, i) => { if ((r.l || r.r) && rem(r) > EPS && rem(st.R[i]) <= EPS) what.push(cap1(ropeName(d, i)) + ' has burnt out'); });
        from.G.forEach((g, i) => { if (g.top > EPS && st.G[i].top <= EPS) what.push(cap1(glassName(d, i)) + ' has run out'); });
        note(what.join('; ') + '.');
        busy = false;
        draw();
        ctx.say('**' + clock(st.t) + '** — ' + what.join('; ') + '. You may act now.', 'info');
        ctx.sfx(nG ? 'pour' : 'tap');
        ctx.changed('run');
        if (done) done();
      };
      raf = requestAnimationFrame(step);
    }
    const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    /* ----- the pointer ----- */
    function endAt(pt) {
      let best = null;
      ropes.forEach((R, i) => {
        const r = st.R[i];
        if (rem(r) <= EPS) return;
        [['l', R.uOf(r.cl)], ['r', R.uOf(r.T - r.cr)]].forEach(([side, u]) => {
          const q = R.P(u), dd = Math.hypot(q[0] - pt[0], q[1] - pt[1]);
          if (dd < Math.max(26, wb.px(18)) && (!best || dd < best.d)) best = { i, side, d: dd, q };
        });
      });
      return best;
    }
    function glassAt(pt) {
      return glasses.findIndex((G) => Math.abs(pt[0] - G.cx) < 64 && pt[1] > G.cy - 120 && pt[1] < G.cy + 150);
    }
    const ghost = S('g', { class: 'tm-ghost' }, top);
    wb.handlers.board = {
      down(pt) {
        if (busy) return true;
        const e = endAt(pt);
        if (e) { lightEnd(e.i, e.side); return true; }
        const j = glassAt(pt);
        if (j >= 0) { turnGlass(j); return true; }
        return false;
      }
    };
    wb.addMode({
      id: 'act', icon: 'clock', title: 'Light an end, blow out a flame, turn a glass', key: 'A',
      down: (pt) => wb.handlers.board.down(pt),
      hover(pt) {
        ghost.innerHTML = '';
        const e = busy ? null : endAt(pt);
        wb.host.classList.toggle('tm-over', !!e || (!busy && glassAt(pt) >= 0));
        if (e) S('circle', { cx: e.q[0], cy: e.q[1], r: 16, class: st.R[e.i][e.side] ? 'tm-ring snuff' : 'tm-ring' }, ghost);
      }
    });
    wb.setMode('act');

    /* ----- hints and the solution ----- */
    function flashRope(i, side) {
      const R = ropes[i], r = st.R[i];
      const q = R.P(side === 'l' ? R.uOf(r.cl) : R.uOf(r.T - r.cr));
      const el = S('circle', { cx: q[0], cy: q[1], r: 24, class: 'tm-hint' }, fx);
      later(() => el.remove(), 4200);
    }
    function flashGlass(j) {
      const G = glasses[j];
      const el = S('rect', { x: G.cx - 66, y: G.cy - 122, width: 132, height: 250, rx: 14, class: 'tm-hint' }, fx);
      later(() => el.remove(), 4200);
    }
    function flashEl(el) { el.classList.add('tm-pulse'); later(() => el.classList.remove('tm-pulse'), 3000); }
    function sideFor(i, a) { const r = st.R[i]; if (a === 'other') return r.l ? 'r' : 'l'; return r.l ? 'r' : 'l'; }
    function applyActs(acts, each, done) {
      const list = acts.slice();
      const next = () => {
        if (!list.length) { done(); return; }
        const a = list.shift();
        if (a.k === 'light') {
          if (a.a === 'both') { const r = st.R[a.i]; if (!r.l) lightEnd(a.i, 'l'); if (!st.R[a.i].r) lightEnd(a.i, 'r'); }
          else lightEnd(a.i, sideFor(a.i, a.a));
          later(next, each);
        } else if (a.k === 'snuff') { const r = st.R[a.i]; lightEnd(a.i, r.l ? 'l' : 'r'); later(next, each); }
        else if (a.k === 'turn') turnGlass(a.i, () => later(next, each / 2));
        else if (a.k === 'mark') { mark(); later(next, each); }
      };
      next();
    }

    function check() {
      if (st.t > st.t0 + EPS && Math.abs(st.t - st.t0 - d.target) < EPS) return { solved: true, msg: 'Exactly ' + minutes(d.target) + '.' };
      const m = st.t - st.t0;
      return { solved: false, msg: m > EPS ? 'So far ' + minutes(m) + ' measured; you need ' + minutes(d.target) + '.' : 'Nothing measured yet.' };
    }

    const inst = {
      check,
      checkLabel: 'That’s ' + fmtMin(d.target) + ' min!',
      hint() {
        if (busy) return 'Wait for the clock to stop.';
        const plan = solve(d, searchState());
        if (!plan) return 'From here it cannot be done: undo a step or two, or start again.';
        if (!plan.steps.length) return 'You are there!';
        const acts = plan.steps[0].acts;
        return {
          text: describeActs(d, acts) + (acts.length ? ' Then let time run.' : '') + ' (' + (plan.cost ? C.plural(plan.cost, 'more action') + ' from here' : 'no more actions needed') + '.)',
          show() {
            acts.forEach((a) => {
              if (a.k === 'light') { if (a.a === 'both') { flashRope(a.i, 'l'); flashRope(a.i, 'r'); } else flashRope(a.i, sideFor(a.i, a.a)); }
              if (a.k === 'snuff') flashRope(a.i, st.R[a.i].l ? 'l' : 'r');
              if (a.k === 'turn') flashGlass(a.i);
              if (a.k === 'mark') flashEl(markBtn);
            });
            if (!acts.length) flashEl(runBtn);
          }
        };
      },
      solve() {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        busy = false;
        let plan = solve(d, searchState());
        if (!plan) { st = fresh(); ctx.move(0); draw(); plan = solve(d); }
        if (!plan) return;
        const steps = plan.steps.slice();
        const next = () => {
          if (!steps.length) { ctx.changed('solve'); return; }
          const s = steps.shift();
          applyActs(s.acts, C.anim(380), () => runTime(() => later(next, C.anim(300))));
        };
        next();
      },
      explain() { const plan = solve(d); return plan ? 'With the fewest actions (' + plan.cost + '): ' + planText(d, plan) : ''; },
      getState() { return JSON.parse(JSON.stringify(st)); },
      setState(s) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        busy = false;
        glasses.forEach((G) => G.inner.removeAttribute('transform'));
        if (s && s.R) st = JSON.parse(JSON.stringify(s));
        draw();
      },
      reset() { st = fresh(); draw(); },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey) return false;
        if (ev.key === 't' || ev.key === 'T') { runTime(); return true; }
        if ((ev.key === 's' || ev.key === 'S') && d.from === 'any') { mark(); return true; }
        return false;
      },
      destroy() {
        if (raf) cancelAnimationFrame(raf);
        timers.forEach((t) => clearTimeout(t));
        wb.handlers.board = null;
      }
    };
    draw();
    ctx.setGoal(goalText(d));
    return inst;
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'timers',
    name: 'Burning ropes and hourglasses',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Time runs only from one recognisable moment to the next — when a rope burns out or a glass runs dry. At such a moment (and at the start) you act: **click an end of a rope** to light it (a rope lit at both ends burns out in half the time it has left), **click a flame** to blow the rope out where that is allowed, **click an hourglass** to turn it over. Then **▶ Let time run** (**T**). Where the puzzle allows a late start, **Start measuring now** (**S**) begins the interval at the current moment. The ropes burn unevenly: how far a flame has got tells you nothing. The puzzle is solved the moment exactly the time asked for has passed since you started measuring.',
    verify,
    generate(rng, level, meta) {
      level = Math.max(1, Math.min(5, level || 1));
      return make(rng, meta && meta.id === 'hourglasses' ? 'glasses' : 'ropes', level);
    },
    mount,
    thumb(p) {
      const d = p.data;
      let s = '<svg viewBox="0 0 200 130" preserveAspectRatio="xMidYMid meet">';
      if (d.ropes && d.ropes.length) {
        d.ropes.slice(0, 3).forEach((T, i) => {
          const y = 30 + i * 32 + (3 - Math.min(3, d.ropes.length)) * 14;
          s += '<path d="M18 ' + y + 'Q60 ' + (y - 8) + ' 100 ' + y + 'T178 ' + y + '" stroke="#5a3b17" stroke-width="10" fill="none" stroke-linecap="round"/>';
          s += '<path d="M18 ' + y + 'Q60 ' + (y - 8) + ' 100 ' + y + 'T178 ' + y + '" stroke="#c99a58" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="3 3"/>';
          s += '<path d="M178 ' + (y + 2) + 'c-8 -6-6 -16 0 -24c6 8 8 18 0 24z" fill="#ff8a2a"/>';
          if (i === 0 && d.ropes.length > 1) s += '<path d="M18 ' + (y + 2) + 'c-8 -6-6 -16 0 -24c6 8 8 18 0 24z" fill="#ff8a2a"/>';
        });
      } else {
        d.glasses.slice(0, 3).forEach((c, j) => {
          const n = Math.min(3, d.glasses.length), x = 100 + (j - (n - 1) / 2) * 56;
          s += '<g transform="translate(' + x + ' 62)"><path d="M-18 -44C-18 -20-3 -9-3 0C-3 9-18 20-18 44H18C18 20 3 9 3 0C3 -9 18 -20 18 -44Z" fill="rgba(200,225,255,.15)" stroke="var(--ink-2)" stroke-width="3"/>';
          s += '<path d="M-15 44C-12 30 12 30 15 44Z" fill="#e3b866"/><rect x="-24" y="-52" width="48" height="8" rx="3" fill="#8a5a26"/><rect x="-24" y="44" width="48" height="8" rx="3" fill="#8a5a26"/>';
          s += '<text x="0" y="-60" text-anchor="middle" font-size="16" font-weight="700" fill="var(--muted)">' + c + '</text></g>';
        });
      }
      return s + '<text x="192" y="124" text-anchor="end" font-size="22" font-weight="800" fill="var(--gold)">' + fmtMin(d.target) + '′</text></svg>';
    }
  });

  C.timersSolver = { solve, begin, nextDt, advance, make, statement, titleOf, planText, describeActs, minutes, fmtMin, gradeOf };

  C.css('timers', `
    .tm-table { fill: var(--board); stroke: var(--line); stroke-width: 2; }
    .tm-redge { fill: none; stroke: #523512; stroke-width: 13; stroke-linecap: round; stroke-linejoin: round; }
    .tm-rbody { fill: none; stroke: #c99a58; stroke-width: 10; stroke-linecap: round; stroke-linejoin: round; }
    .tm-rlay { fill: none; stroke: rgba(92, 56, 18, .55); stroke-width: 10; stroke-dasharray: 1.8 5.2; }
    .tm-ash { fill: none; stroke: rgba(150, 150, 150, .55); stroke-width: 5; stroke-dasharray: 2 4 6 3; stroke-linecap: round; }
    [data-theme="light"] .tm-ash { stroke: rgba(90, 90, 90, .45); }
    .tm-rlabel { font: 800 22px "Segoe UI", system-ui, sans-serif; fill: var(--ink-2); text-anchor: middle; }
    .tm-rmin { font: 600 15px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .tm-flame { pointer-events: none; }
    .tm-fl { transform-box: fill-box; transform-origin: 50% 100%; animation: tmflick .22s ease-in-out infinite alternate; }
    @keyframes tmflick { from { transform: scale(1, .92) skewX(-3deg); } to { transform: scale(.93, 1.08) skewX(4deg); } }
    .tm-f1 { fill: #ff8a2a; }
    .tm-f2 { fill: #ffe07a; }
    .tm-ember { fill: #ff5a2a; }
    .tm-glass { cursor: pointer; }
    .tm-bulb { fill: rgba(190, 220, 255, .10); }
    .tm-glassline { fill: none; stroke: var(--ink-2); stroke-width: 3; stroke-linejoin: round; }
    .tm-shine { fill: none; stroke: rgba(255, 255, 255, .28); stroke-width: 4; stroke-linecap: round; }
    .tm-stream { stroke: #e3b866; stroke-width: 2.4; stroke-dasharray: 3 3; animation: tmflow .3s linear infinite; transition: opacity .2s; }
    @keyframes tmflow { to { stroke-dashoffset: -6; } }
    .tm-gmin { font: 700 18px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; }
    .tm-hit { fill: transparent; }
    .tm-face { fill: var(--paper); stroke: var(--ink-2); stroke-width: 4; }
    .tm-arc { fill: rgba(255, 209, 102, .35); }
    .tm-tick { stroke: #7a7160; stroke-width: 1.4; }
    .tm-tick5 { stroke: #3c3526; stroke-width: 3; }
    .tm-num { font: 700 17px Georgia, serif; fill: #3c3526; text-anchor: middle; }
    .tm-hours { font: 700 15px "Segoe UI", system-ui, sans-serif; fill: #7a5a14; text-anchor: middle; }
    .tm-hand { stroke: #1b2140; stroke-width: 5; stroke-linecap: round; }
    .tm-pin { fill: #1b2140; }
    .tm-aim { fill: var(--red); stroke: #fff; stroke-width: 2; }
    .tm-digital { font: 800 26px "Segoe UI", system-ui, sans-serif; fill: var(--text); text-anchor: middle; font-variant-numeric: tabular-nums; }
    .tm-measured { font: 600 14px "Segoe UI", system-ui, sans-serif; fill: var(--gold); text-anchor: middle; }
    .tm-axis { stroke: var(--ink-2); stroke-width: 2; }
    .tm-tl { font: 600 13px "Segoe UI", system-ui, sans-serif; fill: var(--muted); text-anchor: middle; }
    .tm-past { stroke: var(--accent); stroke-width: 5; stroke-linecap: round; }
    .tm-ev { fill: var(--accent); stroke: var(--board); stroke-width: 2; }
    .tm-now { fill: var(--accent); }
    .tm-goal { fill: none; stroke: var(--gold); stroke-width: 3; stroke-dasharray: 6 4; }
    .tm-goalt { font: 700 13px "Segoe UI", system-ui, sans-serif; fill: var(--gold); text-anchor: middle; }
    .tm-ring { fill: rgba(255, 176, 87, .18); stroke: var(--warn); stroke-width: 2.5; pointer-events: none; }
    .tm-ring.snuff { fill: rgba(140, 180, 255, .15); stroke: var(--accent); }
    .tm-hint { fill: rgba(255, 209, 102, .1); stroke: var(--gold); stroke-width: 3.5; stroke-dasharray: 7 5; pointer-events: none; animation: tmpulse 1s ease-in-out infinite; }
    @keyframes tmpulse { 50% { opacity: .35; } }
    .wb.tm-over .wb-svg { cursor: pointer; }
    .tm-row { display: flex; flex-wrap: wrap; gap: 6px; margin: 4px 0 8px; }
    .tm-help { font-size: .85rem; color: var(--muted); margin-bottom: 6px; }
    .tm-log { margin: 0; padding: 0 0 0 18px; max-height: 170px; overflow: auto; font-size: .82rem; color: var(--muted); line-height: 1.45; }
    .tm-log b { color: var(--text); font-variant-numeric: tabular-nums; margin-right: 4px; }
    .btn.tm-pulse { box-shadow: 0 0 0 3px var(--gold); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
