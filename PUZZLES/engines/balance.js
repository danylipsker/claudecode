/* The Puzzle Cabinet · engines/balance.js
 *
 * Scales and weights. A two-pan balance that tilts, a spring scale that
 * reads grams, brass weights and golden coins.
 *
 * data.kind:
 *   'coins'   the false coin. { n, k, fake: 'heavy'|'light'|'either',
 *             dir: true (say heavier or lighter too; 'either' only),
 *             extra: 0 (coins known to be good), none: false (perhaps no false coin) }
 *             The scale is an adversary: it keeps every story (coin i heavy,
 *             coin i light) that fits the weighings so far and answers each
 *             weighing the way that leaves you worst off, so luck never helps.
 *   'bags'    a spring scale and bags of coins. { bags, coin: 10, fake: 9, many: false,
 *             per: 12 (coins in each bag), k: 1 }  many = any number of bags may be false.
 *   'design'  choose the weights. { count: 4, max: 40, pans: 2, step: 1, fixed: [], sol: [1,3,9,27] }
 *   'place'   balance a load. { load: 14, weights: [1,3,9,27], pans: 2, name: 'sack of flour' }
 *   'find'    how heavy is the parcel? { weights, pans, lo, hi, k }  (an adversary too)
 *   'ask'     a question: { answer: { num | nums | choice, choices }, traps, fig: {...} }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ================= the false coin: a game against the scale ================= */

  const P3 = [1, 3, 9, 27, 81, 243, 729, 2187, 6561];
  // a position, counted: u = could be heavy or light, h = only heavy, l = only light,
  // g = known good (including spare good coins), z = perhaps no false coin at all
  const hypsOf = (s) => 2 * s.u + s.h + s.l + (s.z ? 1 : 0);
  const needOf = (s, dir) => (dir ? hypsOf(s) : s.u + s.h + s.l + (s.z ? 1 : 0));

  // the three results of a weighing w = [u1,h1,l1,g1, u2,h2,l2,g2]: left rises, balance, left sinks
  function outcomes(s, w) {
    const u1 = w[0], h1 = w[1], l1 = w[2], u2 = w[4], h2 = w[5], l2 = w[6];
    const total = s.u + s.h + s.l + s.g;
    const on = u1 + h1 + l1 + u2 + h2 + l2;
    const up = { u: 0, h: u2 + h2, l: u1 + l1, z: false };
    up.g = total - up.h - up.l;
    const eq = { u: s.u - u1 - u2, h: s.h - h1 - h2, l: s.l - l1 - l2, g: s.g + on, z: s.z };
    const down = { u: 0, h: u1 + h1, l: u2 + l2, z: false };
    down.g = total - down.h - down.l;
    return [up, eq, down];
  }

  function eachWeighing(s, fn) {
    for (let u1 = 0; u1 <= s.u; u1++) for (let u2 = 0; u2 <= s.u - u1; u2++)
      for (let h1 = 0; h1 <= s.h; h1++) for (let h2 = 0; h2 <= s.h - h1; h2++)
        for (let l1 = 0; l1 <= s.l; l1++) for (let l2 = 0; l2 <= s.l - l1; l2++) {
          const a = u1 + h1 + l1, b = u2 + h2 + l2;
          if (a + b === 0) continue;
          // swapping the pans changes nothing: keep one of each mirror pair
          if (u1 < u2 || (u1 === u2 && (h1 < h2 || (h1 === h2 && l1 < l2)))) continue;
          const g1 = Math.max(0, b - a), g2 = Math.max(0, a - b);
          if (g1 + g2 > s.g) continue;
          if (fn([u1, h1, l1, g1, u2, h2, l2, g2])) return true;
        }
    return false;
  }

  const memo = new Map();
  function keyOf(s, k, dir) { return s.u + ',' + s.h + ',' + s.l + ',' + Math.min(s.g, s.u + s.h + s.l) + ',' + (s.z ? 1 : 0) + ',' + k + (dir ? 'd' : 'c'); }

  // can the false coin be caught from here with k weighings, whatever the scale says?
  function solvable(s, k, dir) {
    const need = needOf(s, dir);
    if (need <= 1) return true;
    if (k <= 0 || need > P3[k]) return false;
    const key = keyOf(s, k, dir);
    if (memo.has(key)) return memo.get(key);
    if (memo.size > 400000) memo.clear();
    const ok = eachWeighing(s, (w) => goodWeighing(s, w, k, dir));
    memo.set(key, ok);
    return ok;
  }
  function goodWeighing(s, w, k, dir) {
    const os = outcomes(s, w);
    for (const o of os) if (hypsOf(o) && needOf(o, dir) > P3[k - 1]) return false;
    for (const o of os) if (hypsOf(o) && !solvable(o, k - 1, dir)) return false;
    return true;
  }

  // the most even good weighing (fewest coins, fewest good coins used on ties)
  function bestWeighing(s, k, dir) {
    let best = null, bs = null;
    eachWeighing(s, (w) => {
      if (!goodWeighing(s, w, k, dir)) return false;
      const os = outcomes(s, w);
      const worst = Math.max.apply(null, os.map((o) => (hypsOf(o) ? needOf(o, dir) : 0)));
      const coins = w[0] + w[1] + w[2] + w[3] + w[4] + w[5] + w[6] + w[7];
      const sc = [worst, w[3] + w[7], coins];
      if (!bs || sc[0] < bs[0] || (sc[0] === bs[0] && (sc[1] < bs[1] || (sc[1] === bs[1] && sc[2] < bs[2])))) { bs = sc; best = w; }
      return false;
    });
    return best;
  }

  function coinStart(d) {
    const n = d.n, e = d.extra || 0, z = !!d.none;
    if (d.fake === 'heavy') return { u: 0, h: n, l: 0, g: e, z };
    if (d.fake === 'light') return { u: 0, h: 0, l: n, g: e, z };
    return { u: n, h: 0, l: 0, g: e, z };
  }
  const askDir = (d) => d.fake === 'either' && d.dir !== false;

  // the fewest weighings that always catch the coin
  function fewestWeighings(d) {
    const s = coinStart(d), dir = askDir(d);
    for (let k = 0; k <= 8; k++) if (solvable(s, k, dir)) return k;
    return Infinity;
  }

  /* ---------- concrete coins: which stories still fit ---------- */

  function freshStories(d) {
    const n = d.n, H = [], L = [];
    for (let i = 0; i < n; i++) { H.push(d.fake !== 'light'); L.push(d.fake !== 'heavy'); }
    return { H, L, z: !!d.none };
  }
  // apply a weighing's result; L and R are lists of coin indexes (spare good coins are >= n)
  function applyResult(st, left, right, out) {
    const n = st.H.length;
    const onL = new Set(left), onR = new Set(right);
    const H = st.H.slice(), L = st.L.slice();
    for (let i = 0; i < n; i++) {
      if (out === 0) { if (onL.has(i) || onR.has(i)) { H[i] = false; L[i] = false; } }
      else {
        const leftSinks = out > 0;
        if (onL.has(i)) { if (leftSinks) L[i] = false; else H[i] = false; }
        else if (onR.has(i)) { if (leftSinks) H[i] = false; else L[i] = false; }
        else { H[i] = false; L[i] = false; }
      }
    }
    return { H, L, z: out === 0 ? st.z : false };
  }
  function countsOf(st, extra) {
    let u = 0, h = 0, l = 0;
    const n = st.H.length;
    for (let i = 0; i < n; i++) { if (st.H[i] && st.L[i]) u++; else if (st.H[i]) h++; else if (st.L[i]) l++; }
    return { u, h, l, g: n - u - h - l + (extra || 0), z: st.z };
  }
  // what the scale says: prefer a result that leaves you unable to finish, then the most stories left
  function adversary(d, st, left, right, kLeft) {
    const dir = askDir(d);
    let best = null;
    [0, 1, -1].forEach((out) => {
      const ns = applyResult(st, left, right, out);
      const c = countsOf(ns, d.extra);
      const hy = hypsOf(c);
      if (!hy) return;
      const stuck = !solvable(c, kLeft, dir);
      const sc = (stuck ? 1000 : 0) + needOf(c, dir) * 3 + hy / 100;
      if (!best || sc > best.sc) best = { out, sc, st: ns };
    });
    return best;
  }
  function storiesLeft(st, dir) {
    const out = [];
    st.H.forEach((v, i) => { if (v) out.push({ coin: i, dir: 1 }); });
    st.L.forEach((v, i) => { if (v) out.push({ coin: i, dir: -1 }); });
    if (st.z) out.push({ coin: -1, dir: 0 });
    if (!dir) {
      const seen = new Set();
      return out.filter((x) => { if (seen.has(x.coin)) return false; seen.add(x.coin); return true; });
    }
    return out;
  }

  /* ================= bags on a spring scale ================= */

  function bagStories(d) {
    const out = [];
    if (d.many) { for (let m = 0; m < (1 << d.bags); m++) out.push(m); }
    else for (let b = 0; b < d.bags; b++) out.push(1 << b);
    return out;
  }
  function bagReading(d, taken, mask) {
    let total = 0, fakeN = 0;
    taken.forEach((t, b) => { total += t; if (mask & (1 << b)) fakeN += t; });
    return total * d.coin + fakeN * (d.fake - d.coin);
  }
  // counts that tell every story apart in one weighing, each at most `per`
  function bagPlan(d) {
    const n = d.bags, per = d.per == null ? 99 : d.per;
    if (!d.many) {
      if (per < n - 1) return null;
      return Array.from({ length: n }, (_, i) => i);
    }
    // distinct subset sums, searched with the largest count as small as possible
    let best = null;
    for (let top = n; top <= per && !best; top++) {
      const inner = (start, chosen) => {
        if (chosen.length === n - 1) {
          const c = chosen.concat([top]);
          const sums = new Set();
          for (let m = 0; m < (1 << n); m++) {
            let s = 0;
            for (let b = 0; b < n; b++) if (m & (1 << b)) s += c[b];
            if (sums.has(s)) return false;
            sums.add(s);
          }
          best = c;
          return true;
        }
        for (let v = start; v < top; v++) { chosen.push(v); if (inner(v + 1, chosen)) return true; chosen.pop(); }
        return false;
      };
      inner(1, []);
    }
    return best;
  }

  /* ================= weights ================= */

  // every signed sum the weights can make: pans 2 = on either pan, 1 = only opposite the load
  function reach(ws, pans) {
    let sums = new Set([0]);
    ws.forEach((w) => {
      if (!(w > 0)) return;
      const nx = new Set(sums);
      sums.forEach((s) => { nx.add(s + w); if (pans === 2) nx.add(s - w); });
      sums = nx;
    });
    return sums;
  }
  function coverage(ws, d) {
    const sums = reach(ws, d.pans || 2), step = d.step || 1;
    const out = [];
    for (let v = step; v <= d.max; v += step) out.push(sums.has(v));
    return out;
  }
  // how to weigh load v: for each weight -1 (with the load), 0 (off), +1 (against it)
  function arrangement(ws, pans, v) {
    const n = ws.length;
    const opts = pans === 2 ? [1, -1, 0] : [1, 0];
    let best = null;
    const rec = (i, sum, cur) => {
      if (i === n) {
        if (sum === v) {
          const used = cur.filter((x) => x !== 0).length;
          if (!best || used < best.used) best = { used, a: cur.slice() };
        }
        return;
      }
      for (const o of opts) { cur.push(o); rec(i + 1, sum + o * (ws[i] || 0), cur); cur.pop(); }
    };
    rec(0, 0, []);
    return best ? best.a : null;
  }
  // complete `given` to `count` weights that weigh every load; exhaustive up to `limit` nodes.
  // returns { sol: [...] | null, complete: true if the search finished }
  function designSearch(d, given, limit) {
    const step = d.step || 1, max = d.max, count = d.count;
    const cap = Math.min(d.cap || max, max);
    const base = (given || []).filter((v) => v > 0).slice(0, count);
    const covers = (ws) => {
      const sums = reach(ws, d.pans || 2);
      for (let v = step; v <= max; v += step) if (!sums.has(v)) return false;
      return true;
    };
    let sol = null, nodes = 0, cut = false;
    const rec = (ws, lo, sum) => {
      if (sol || cut) return;
      if (++nodes > (limit || 300000)) { cut = true; return; }
      const left = count - ws.length;
      if (sum + left * cap < max) return;
      if (!left) { if (covers(ws)) sol = ws.slice().sort((a, b) => a - b); return; }
      for (let v = lo; v <= cap && !sol && !cut; v += step) { ws.push(v); rec(ws, v, sum + v); ws.pop(); }
    };
    rec(base.slice(), step, base.reduce((a, b) => a + b, 0));
    return { sol, complete: !cut };
  }

  // the parcel weighs a whole number in [a, b]; a weighing against v says below, equal or above.
  function findPlanner(d) {
    const sums = reach(d.weights, d.pans || 2);
    const memoF = new Map();
    const solv = (a, b, k) => {
      if (a >= b) return true;
      if (k === 0 || b - a + 1 > Math.pow(2, k + 1) - 1) return false;
      const key = a + ',' + b + ',' + k;
      if (memoF.has(key)) return memoF.get(key);
      let ok = false;
      for (let v = a; v <= b && !ok; v++) if (sums.has(v) && solv(a, v - 1, k - 1) && solv(v + 1, b, k - 1)) ok = true;
      memoF.set(key, ok);
      return ok;
    };
    // the most even good comparison for [a, b] with k weighings left
    const step = (a, b, k) => {
      let best = null, bs = Infinity;
      for (let v = a; v <= b; v++) {
        if (!sums.has(v) || !solv(a, v - 1, k - 1) || !solv(v + 1, b, k - 1)) continue;
        const sc = Math.abs((v - a) - (b - v));
        if (sc < bs) { bs = sc; best = v; }
      }
      return best;
    };
    return { solv, step, sums };
  }
  function findSolvable(d) { return findPlanner(d).solv(d.lo, d.hi, d.k); }

  /* ================= answers typed in the panel ================= */

  function readNum(s) {
    s = String(s).trim().replace(/[−–]/g, '-').replace(/\s*(kg|g|grams?|pounds?|lb|weighings?|coins?|weights?)\.?$/i, '');
    if (/^-?\d+(\.\d+)?$/.test(s)) return +s;
    const m = /^(-?\d+)\/(\d+)$/.exec(s);
    if (m) return (+m[1]) / (+m[2]);
    return NaN;
  }
  function checkAsk(d, v) {
    const a = d.answer;
    const trap = (val) => {
      for (const t of d.traps || []) {
        const ms = Array.isArray(t.match) ? t.match : [t.match];
        if (ms.some((m) => (typeof m === 'number' && typeof val === 'number' ? m === val : String(m) === String(val)))) return t.msg;
      }
      return null;
    };
    if (a.num != null) {
      const x = readNum(v);
      if (isNaN(x)) return { ok: false, msg: 'A number, please.' };
      if (Math.abs(x - a.num) < 1e-9) return { ok: true, msg: 'Yes: **' + a.num + (a.unit ? ' ' + a.unit : '') + '**.' };
      return { ok: false, msg: trap(x) };
    }
    if (a.nums) {
      const got = String(v).split(/[\s,;+&]+|\band\b/).filter(Boolean).map(readNum);
      if (got.some(isNaN)) return { ok: false, msg: 'Write the numbers separated by commas.' };
      const want = a.nums.slice().sort((x, y) => x - y), g = got.slice().sort((x, y) => x - y);
      if (g.length === want.length && g.every((x, i) => x === want[i])) return { ok: true, msg: 'Yes: **' + a.nums.join(', ') + '**.' };
      return { ok: false, msg: trap(g.join(',')) || (g.length !== want.length ? 'I am expecting ' + want.length + ' numbers.' : null) };
    }
    if (a.choice != null) {
      if (v === a.choice) return { ok: true, msg: 'Yes: **' + a.choices[a.choice] + '**.' };
      return { ok: false, msg: trap(v) };
    }
    return { ok: false, msg: 'No answer key.' };
  }
  function askKey(d) {
    const a = d.answer;
    return a.num != null ? String(a.num) : a.nums ? a.nums.join(', ') : a.choice;
  }

  /* ================= verify ================= */

  function verify(p) {
    const d = p.data;
    if (!d || !d.kind) return { ok: false, err: 'data.kind is needed' };
    switch (d.kind) {
      case 'coins': {
        if (!(d.n >= 2 && d.n <= 45)) return { ok: false, err: 'n must be 2..45' };
        if (!(d.k >= 1 && d.k <= 5)) return { ok: false, err: 'k must be 1..5' };
        if (!['heavy', 'light', 'either'].includes(d.fake)) return { ok: false, err: 'fake must be heavy, light or either' };
        const f = fewestWeighings(d);
        if (f > d.k) return { ok: false, err: 'cannot be done in ' + d.k + ' weighings' };
        if (f < d.k) return { ok: true, warn: 'can be done in ' + f + ' weighings (k = ' + d.k + ')' };
        return { ok: true };
      }
      case 'bags': {
        if (!(d.bags >= 2 && d.bags <= 12)) return { ok: false, err: 'bags must be 2..12' };
        if ((d.k || 1) !== 1) return { ok: false, err: 'only one weighing is supported' };
        if (d.fake === d.coin) return { ok: false, err: 'the false coins weigh the same' };
        const plan = bagPlan(d);
        if (!plan) return { ok: false, err: 'no counts tell the bags apart' };
        const seen = new Set();
        for (const m of bagStories(d)) { const r = bagReading(d, plan, m); if (seen.has(r)) return { ok: false, err: 'plan does not separate the bags' }; seen.add(r); }
        return { ok: true };
      }
      case 'design': {
        if (!(d.count >= 1 && d.count <= 7) || !(d.max >= 1)) return { ok: false, err: 'count and max are needed' };
        if (!d.sol || d.sol.length !== d.count) return { ok: false, err: 'sol must list count weights' };
        const fixed = (d.fixed || []).slice();
        for (const f of fixed) { if (!d.sol.includes(f)) return { ok: false, err: 'sol does not contain the given weight ' + f }; }
        if (d.cap && d.sol.some((w) => w > d.cap)) return { ok: false, err: 'sol has a weight above the cap' };
        if (!coverage(d.sol, d).every(Boolean)) return { ok: false, err: 'sol does not weigh every load' };
        return { ok: true };
      }
      case 'place': {
        if (!(d.load > 0) || !d.weights || !d.weights.length) return { ok: false, err: 'load and weights are needed' };
        const a = arrangement(d.weights, d.pans || 2, d.load);
        if (!a) return { ok: false, err: 'the load cannot be balanced' };
        return { ok: true };
      }
      case 'find': {
        if (!d.weights || !(d.hi >= d.lo) || !(d.k >= 1)) return { ok: false, err: 'weights, lo, hi, k are needed' };
        if (!findSolvable(d)) return { ok: false, err: 'the parcel cannot be pinned down in ' + d.k + ' weighings' };
        return { ok: true };
      }
      case 'ask': {
        if (!d.answer) return { ok: false, err: 'no answer' };
        const r = checkAsk(d, askKey(d));
        if (!r.ok) return { ok: false, err: 'the answer key does not pass its own check' };
        return { ok: true };
      }
      default: return { ok: false, err: 'unknown kind ' + d.kind };
    }
  }

  /* ================= statements and Endless puzzles ================= */

  const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const W = (n) => WORDS[n] || String(n);
  function coinText(d) {
    let t = 'There are ' + W(d.n) + ' coins that look exactly alike, but one ';
    if (d.none) t = 'There are ' + W(d.n) + ' coins that look exactly alike. Perhaps one ';
    if (d.fake === 'heavy') t += 'is a forgery, a little **heavier** than a true coin.';
    else if (d.fake === 'light') t += 'is a forgery, a little **lighter** than a true coin.';
    else t += 'is a forgery — **heavier or lighter**, nobody knows which.';
    if (d.none) t += ' Or perhaps they are all good.';
    if (d.extra) t += ' You also have ' + (d.extra > 1 ? W(d.extra) + ' coins' : 'one more coin') + ' known to be good (silver, marked ✓), to use on the pans if it helps.';
    t += '\n\nWith a two-pan balance and no weights, used at most **' + W(d.k) + (d.k > 1 ? ' times' : ' time') + '**, find the false coin';
    if (d.fake === 'either' && d.dir !== false) t += ' and say whether it is heavier or lighter';
    if (d.fake === 'either' && d.dir === false) t += ' — you need only point to it, not say whether it is heavier or lighter';
    if (d.none) t += ', or show that there is none';
    return t + '.';
  }
  function coinGoal(d) {
    return 'Be **sure** of the false coin' + (d.fake === 'either' && d.dir !== false ? ' and its weight' : '') + (d.none ? ' (or that there is none)' : '') + ' after at most ' + d.k + ' weighing' + (d.k > 1 ? 's' : '') + ' — the scale will not help you guess.';
  }
  function bagText(d) {
    return W(d.bags).replace(/^./, (c) => c.toUpperCase()) + ' sacks of coins, ' + (d.per >= 99 ? 'plenty in each' : d.per + ' in each') + '. True coins weigh ' + d.coin + ' g; ' +
      (d.many ? '**any number** of the sacks — perhaps none, perhaps all — may be full of fakes weighing ' : 'one sack is full of fakes weighing ') + d.fake + ' g. A spring scale that shows grams may be used only **once**. Which sack' + (d.many ? 's are' : ' is') + ' false?';
  }
  function placeText(d) {
    return 'Balance the **' + d.load + ' kg** sack with the brass weights: ' + d.weights.join(', ') + ' kg' + (d.pans === 1 ? '. The weights may go **only on the other pan**.' : '. A weight may go on the pan opposite the sack or beside it.');
  }
  function findText(d) {
    return 'A parcel weighs a whole number of kilograms between ' + d.lo + ' and ' + d.hi + '. With the weights ' + d.weights.join(', ') + ' kg' + (d.pans === 1 ? ' (only on the pan opposite the parcel)' : ' (on either pan)') + ' and at most **' + W(d.k) + '** weighings, find out exactly what it weighs. The parcel is sly: its weight is whatever keeps you guessing longest.';
  }
  function placeLevel(d) {
    const a = arrangement(d.weights, d.pans || 2, d.load);
    if (!a) return 0;
    const one = arrangement(d.weights, 1, d.load), used = a.filter(Boolean).length;
    return one ? (used <= 2 ? 1 : 2) : (used <= 3 ? 2 : used <= 4 ? 3 : 4);
  }
  function genCoins(rng, level) {
    for (let tries = 0; tries < 60; tries++) {
      let d = null;
      const r = rng();
      if (level === 1) d = r < 0.5 ? { n: rng.range(2, 3), k: 1, fake: rng.pick(['heavy', 'light']) } : { n: rng.range(4, 5), k: 2, fake: rng.pick(['heavy', 'light']) };
      else if (level === 2) {
        if (r < 0.25) d = { kind: 'bags', bags: rng.range(4, 8), coin: 10, fake: rng.pick([9, 11]) };
        else d = r < 0.7 ? { n: rng.range(6, 9), k: 2, fake: rng.pick(['heavy', 'light']) } : { n: 3, k: 2, fake: 'either', extra: rng.int(2) };
      } else if (level === 3) {
        if (r < 0.2) { const b = rng.range(3, 5); d = { kind: 'bags', bags: b, coin: 10, fake: rng.pick([9, 11]), many: true }; d.per = (1 << (b - 1)) + rng.range(0, 4); }
        else if (r < 0.55) d = { n: rng.range(10, 27), k: 3, fake: rng.pick(['heavy', 'light']) };
        else d = rng() < 0.5 ? { n: rng.range(4, 6), k: 3, fake: 'either' } : { n: 4, k: 2, fake: 'either', extra: 1 };
      } else if (level === 4) {
        if (r < 0.15) { const b = rng.range(4, 5); d = { kind: 'bags', bags: b, coin: 10, fake: 9, many: true, per: b === 4 ? rng.range(7, 7) : rng.range(13, 15) }; }
        else {
          const v = rng.int(3);
          d = v === 0 ? { n: rng.range(7, 10), k: 3, fake: 'either' } : v === 1 ? { n: rng.range(7, 11), k: 3, fake: 'either', extra: 1 } : { n: rng.range(8, 11), k: 3, fake: 'either', dir: false };
        }
      } else {
        const v = rng.int(5);
        d = v === 0 ? { n: rng.range(11, 12), k: 3, fake: 'either', none: rng() < 0.4 } : v === 1 ? { n: 13, k: 3, fake: 'either', extra: 1 } : v === 2 ? { n: rng.range(12, 13), k: 3, fake: 'either', dir: false }
          : v === 3 ? { n: 14, k: 3, fake: 'either', dir: false, extra: 1 } : { n: rng.range(30, 39), k: 4, fake: 'either' };
      }
      if (d.kind === 'bags') {
        if (d.per == null) d.per = rng() < 0.5 ? 99 : d.bags - 1 + rng.range(0, 3);
        if (!bagPlan(d)) continue;
        return { title: (d.many ? 'Sacks, Any of Them False: ' : 'Sacks and a Spring Scale: ') + d.bags, text: bagText(d), goal: 'Take coins, weigh once, and name the false sack' + (d.many ? 's' : '') + ' for certain.', diff: level, data: d };
      }
      d.kind = 'coins';
      if (fewestWeighings(d) !== d.k) continue;
      const q = d.fake === 'heavy' ? 'One Heavy' : d.fake === 'light' ? 'One Light' : d.none ? 'or None' : d.dir === false ? 'Just Point' : d.extra ? 'and a Good One' : 'Heavy or Light';
      return { title: W(d.n).replace(/^./, (c) => c.toUpperCase()) + ' Coins, ' + q + ' (' + d.k + ' weighing' + (d.k > 1 ? 's' : '') + ')', text: coinText(d), goal: coinGoal(d), diff: level, data: d };
    }
    return null;
  }
  function genWeights(rng, level) {
    for (let tries = 0; tries < 200; tries++) {
      const r = rng();
      if (level >= 3 && r < 0.3) {
        // the sly parcel
        const sys = rng.pick([{ weights: [1, 2, 4, 8, 16, 32], pans: 1 }, { weights: [1, 3, 9, 27], pans: 2 }]);
        const k = level;   // 3, 4 or 5 weighings
        const cap = Math.pow(2, k + 1) - 1, hi = Math.min(rng.range(Math.pow(2, k), cap), sys.pans === 2 ? 40 : 63);
        const d = { kind: 'find', weights: sys.weights.filter((w) => w <= hi), pans: sys.pans, lo: 1, hi, k };
        if (!findSolvable(d) || findPlanner(d).solv(1, hi, k - 1)) continue;
        return { title: 'The Parcel: 1 to ' + hi + ', ' + W(k).replace(/^./, (c) => c.toUpperCase()) + ' Weighings', text: findText(d), goal: 'Name the parcel\'s weight for certain.', diff: level, data: d };
      }
      const nW = rng.range(level <= 2 ? 3 : 4, level <= 2 ? 4 : 5);
      let ws;
      const style = rng.int(3);
      if (style === 0) ws = [1, 2, 4, 8, 16, 32].slice(0, nW);
      else if (style === 1) ws = [1, 3, 9, 27, 81].slice(0, Math.min(nW, 4));
      else { const s = new Set(); while (s.size < nW) s.add(rng.range(2, 25)); ws = Array.from(s).sort((a, b) => a - b); }
      const pans = style === 0 ? 1 : 2;
      const sum = ws.reduce((a, b) => a + b, 0);
      const d = { kind: 'place', load: rng.range(1, Math.min(60, sum)), weights: ws, pans };
      if (placeLevel(d) !== level && !(level === 5 && placeLevel(d) === 4 && ws.length >= 5)) continue;
      return { title: 'Balance ' + d.load + ' with ' + ws.join(', '), text: placeText(d), goal: 'The beam level.', diff: level, data: d };
    }
    return null;
  }

  // exported for the generator and for anyone curious
  C.balanceSolver = { coinText, coinGoal, bagText, placeText, findText, placeLevel, genCoins, genWeights, solvable, bestWeighing, coinStart, askDir, fewestWeighings, outcomes, hypsOf, needOf, bagPlan, bagReading, bagStories, reach, coverage, arrangement, designSearch, findSolvable, findPlanner, freshStories, applyResult, countsOf, adversary };

  /* ================= drawing ================= */

  const BEAM = 10, STRING = 8, TILT = 0.23;
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const f2 = (v) => Math.round(v * 1000) / 1000;

  // "1–4, 7 and 9"
  function fmtList(nums) {
    const a = nums.slice().sort((x, y) => x - y);
    const parts = [];
    for (let i = 0; i < a.length;) {
      let j = i;
      while (j + 1 < a.length && a[j + 1] === a[j] + 1) j++;
      if (j - i >= 2) parts.push(a[i] + '–' + a[j]);
      else for (let k = i; k <= j; k++) parts.push(String(a[k]));
      i = j + 1;
    }
    return parts.length <= 1 ? parts.join('') : parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
  }

  // a brass weight's outline (a bell with a knob), centred on its middle
  function weightSize(v) { const s = 0.85 + 0.55 * Math.cbrt(Math.max(1, v)); return { w: 1.5 * s, h: 1.7 * s }; }
  function weightPath(v) {
    const z = weightSize(v), w = z.w / 2, h = z.h / 2;
    const k = Math.min(0.42, w * 0.34);
    return 'M' + f2(-w) + ' ' + f2(h) + 'L' + f2(w) + ' ' + f2(h) +
      'Q' + f2(w * 0.96) + ' ' + f2(-h * 0.3) + ' ' + f2(w * 0.52) + ' ' + f2(-h * 0.62) +
      'L' + f2(k) + ' ' + f2(-h * 0.62) + 'L' + f2(k) + ' ' + f2(-h * 0.8) +
      'A' + f2(k * 1.3) + ' ' + f2(k * 1.3) + ' 0 1 0 ' + f2(-k) + ' ' + f2(-h * 0.8) +
      'L' + f2(-k) + ' ' + f2(-h * 0.62) + 'L' + f2(-w * 0.52) + ' ' + f2(-h * 0.62) +
      'Q' + f2(-w * 0.96) + ' ' + f2(-h * 0.3) + ' ' + f2(-w) + ' ' + f2(h) + 'Z';
  }
  function circlePoly(r) { const out = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; out.push([Math.cos(a) * r, Math.sin(a) * r]); } return out; }

  // the static balance as markup (thumbnails and question figures)
  function balanceSVG(theta, leftItems, rightItems) {
    const c = Math.cos(theta), s = Math.sin(theta);
    let out = '<g class="bal-static">';
    out += '<rect x="-6.5" y="14" width="13" height="1.8" rx=".6" fill="var(--wood-dark)"/><rect x="-.45" y="1" width=".9" height="13.1" fill="#b08a3a"/>';
    out += '<path d="M-1.2 1.6L0 -.2L1.2 1.6Z" fill="#8a6a26"/>';
    out += '<g transform="rotate(' + f2(theta * 180 / Math.PI) + ')"><path d="M-10 -.3L10 -.3L10.5 0L10 .3L-10 .3L-10.5 0Z" fill="#c9a14a" stroke="#6d5320" stroke-width=".12"/><circle r=".55" fill="#e3c46e"/></g>';
    [[-1, leftItems], [1, rightItems]].forEach(([side, items]) => {
      const hx = side * BEAM * c, hy = side * BEAM * s, py = hy + STRING;
      out += '<path d="M' + f2(hx) + ' ' + f2(hy) + 'L' + f2(hx - 5.6) + ' ' + f2(py) + 'M' + f2(hx) + ' ' + f2(hy) + 'L' + f2(hx + 5.6) + ' ' + f2(py) + '" stroke="var(--ink-2)" stroke-width=".12" fill="none"/>';
      out += '<path d="M' + f2(hx - 6) + ' ' + f2(py) + 'Q' + f2(hx) + ' ' + f2(py + 2.6) + ' ' + f2(hx + 6) + ' ' + f2(py) + 'Z" fill="#c9a14a" stroke="#6d5320" stroke-width=".12"/>';
      (items || []).forEach((it, i) => {
        const pos = panSlot(i, items.length, hx, py);
        out += '<circle cx="' + f2(pos[0]) + '" cy="' + f2(pos[1]) + '" r="1" fill="' + (it === 'G' ? '#cfd6e4' : '#f2c14e') + '" stroke="#8a6414" stroke-width=".12"/>' +
          '<text x="' + f2(pos[0]) + '" y="' + f2(pos[1] + 0.36) + '" text-anchor="middle" font-size="1" font-weight="800" fill="#5a3d05">' + C.esc(it) + '</text>';
      });
    });
    return out + '</g>';
  }

  // where the i-th of n things sits on a pan whose rim centre is (px, py)
  function panSlot(i, n, px, py) {
    const caps = [];
    for (let left = n, r = 0; left > 0; r++) { const cp = n <= 15 ? Math.max(1, 5 - r) : 5; caps.push(Math.min(cp, left)); left -= cp; }
    let row = 0, idx = i;
    while (idx >= caps[row]) { idx -= caps[row]; row++; }
    const cnt = caps[row];
    return [px + (idx - (cnt - 1) / 2) * 2.05, py - 0.6 - row * 1.78];
  }

  // the live balance: beam, pointer, pans; setAngle(theta) redraws
  function makeBalance(ctx, parent) {
    const S = ctx.s;
    const g = S('g', { class: 'bal' }, parent);
    // the dial behind the pointer
    const dial = S('g', { class: 'bal-dial' }, g);
    let dd = '';
    for (let a = -24; a <= 24; a += 6) {
      const r1 = 5.2, r2 = a === 0 ? 6.3 : 5.8, t = (a - 90) * Math.PI / 180;
      dd += 'M' + f2(Math.cos(t) * r1) + ' ' + f2(Math.sin(t) * r1) + 'L' + f2(Math.cos(t) * r2) + ' ' + f2(Math.sin(t) * r2);
    }
    S('path', { d: 'M' + f2(Math.cos(-114 * Math.PI / 180) * 6.6) + ' ' + f2(Math.sin(-114 * Math.PI / 180) * 6.6) + 'A6.6 6.6 0 0 1 ' + f2(Math.cos(-66 * Math.PI / 180) * 6.6) + ' ' + f2(Math.sin(-66 * Math.PI / 180) * 6.6), class: 'bal-dial-arc' }, dial);
    S('path', { d: dd, class: 'bal-dial-ticks' }, dial);
    // the stand
    S('rect', { x: -6.5, y: 14, width: 13, height: 1.8, rx: 0.6, class: 'bal-base' }, g);
    S('rect', { x: -5.2, y: 13.4, width: 10.4, height: 0.8, rx: 0.3, class: 'bal-base2' }, g);
    S('rect', { x: -0.45, y: 1, width: 0.9, height: 13, class: 'bal-post' }, g);
    S('circle', { cx: 0, cy: 7.2, r: 0.75, class: 'bal-knob' }, g);
    const arrest = S('path', { d: 'M-3.4 1.15H3.4V1.75H-3.4Z', class: 'bal-arrest' }, g);
    S('path', { d: 'M-1.3 1.7L0 -0.25L1.3 1.7Z', class: 'bal-fulcrum' }, g);
    const strings = S('path', { class: 'bal-string' }, g);
    const pans = [-1, 1].map(() => S('path', { class: 'bal-pan' }, g));
    const beam = S('g', { class: 'bal-beam' }, g);
    g.pans = pans;
    S('line', { x1: 0, y1: 0, x2: 0, y2: -5.6, class: 'bal-needle' }, beam);
    S('path', { d: 'M-10 -.32L10 -.32L10.6 0L10 .32L-10 .32L-10.6 0Z', class: 'bal-bar' }, beam);
    S('circle', { cx: -BEAM, cy: 0, r: 0.42, class: 'bal-ring' }, beam);
    S('circle', { cx: BEAM, cy: 0, r: 0.42, class: 'bal-ring' }, beam);
    S('circle', { cx: 0, cy: 0, r: 0.62, class: 'bal-hub' }, beam);
    const self = {
      g, theta: 0, locked: true,
      pan(side, th) {
        const t = th == null ? self.theta : th;
        return [side * BEAM * Math.cos(t), side * BEAM * Math.sin(t) + STRING];
      },
      setAngle(t) {
        self.theta = t;
        beam.setAttribute('transform', 'rotate(' + f2(t * 180 / Math.PI) + ')');
        let sd = '';
        [-1, 1].forEach((side, i) => {
          const hx = side * BEAM * Math.cos(t), hy = side * BEAM * Math.sin(t), py = hy + STRING;
          sd += 'M' + f2(hx) + ' ' + f2(hy) + 'L' + f2(hx - 5.7) + ' ' + f2(py) + 'M' + f2(hx) + ' ' + f2(hy) + 'L' + f2(hx + 5.7) + ' ' + f2(py) + 'M' + f2(hx) + ' ' + f2(hy) + 'L' + f2(hx) + ' ' + f2(py - 0.2);
          pans[i].setAttribute('d', 'M' + f2(hx - 6.2) + ' ' + f2(py) + 'Q' + f2(hx) + ' ' + f2(py + 2.7) + ' ' + f2(hx + 6.2) + ' ' + f2(py) + 'Z');
        });
        strings.setAttribute('d', sd);
        if (self.onAngle) self.onAngle(t);
      },
      lock(on) { self.locked = on; arrest.setAttribute('transform', on ? '' : 'translate(0 1.3)'); g.classList.toggle('free', !on); },
      // swing to a new angle like a real beam: overshoot and settle
      anim: null,
      swingTo(target, ms, done, kick) {
        if (self.anim) cancelAnimationFrame(self.anim);
        const from = self.theta, t0 = performance.now(), dur = C.anim(ms);
        const amp = target - from;
        const step = (now) => {
          const t = Math.min(1, (now - t0) / dur);
          const e = t >= 1 ? 1 : 1 - Math.exp(-5.2 * t) * (Math.cos(11 * t) + 0.45 * Math.sin(11 * t));
          let th = from + amp * e;
          if (kick) th += kick * Math.exp(-4 * t) * Math.sin(14 * t);
          self.setAngle(t >= 1 ? target : th);
          if (t < 1) self.anim = requestAnimationFrame(step);
          else { self.anim = null; if (done) done(); }
        };
        self.anim = requestAnimationFrame(step);
      },
      stop() { if (self.anim) cancelAnimationFrame(self.anim); self.anim = null; }
    };
    self.setAngle(0);
    self.lock(true);
    return self;
  }

  // piece types on the workbench: coins and brass weights
  function registerTypes(wb) {
    wb.type('bcoin', {
      draw(g, o) {
        const good = o.data && o.data.good;
        const base = o.fill || (good ? '#d3d9e6' : '#f2c14e');
        C.s('circle', { r: 1, class: 'bal-coin', fill: base }, g);
        C.s('circle', { r: 0.8, class: 'bal-coin-rim' }, g);
        const t = C.s('text', { class: 'bal-coin-n', y: 0.36, 'font-size': String(o.label).length > 1 ? 0.9 : 1.05, 'text-anchor': 'middle' }, g);
        t.textContent = o.label;
      },
      poly() { return circlePoly(1); }
    });
    wb.type('bweight', {
      draw(g, o) {
        const v = o.data.v;
        C.s('path', { d: weightPath(v), class: 'bal-weight', fill: o.fill || '#c99a3c' }, g);
        const z = weightSize(v);
        const t = C.s('text', { class: 'bal-weight-n', y: f2(z.h * 0.2), 'font-size': f2(Math.min(1.1, 0.5 + z.w * 0.2)), 'text-anchor': 'middle' }, g);
        t.textContent = v + (o.data.unit ? '' : '');
      },
      poly(o) { const z = weightSize(o.data.v); return [[-z.w / 2, -z.h / 2], [z.w / 2, -z.h / 2], [z.w / 2, z.h / 2], [-z.w / 2, z.h / 2]]; }
    });
  }

  // timers and animation frames an instance owns, so undo and leaving the page can stop them
  function makeClock() {
    const timers = new Set(), frames = new Set();
    return {
      later(fn, ms) { const id = setTimeout(() => { timers.delete(id); fn(); }, C.anim(ms)); timers.add(id); return id; },
      frame(fn) { const id = requestAnimationFrame((t) => { frames.delete(id); fn(t); }); frames.add(id); return id; },
      stop() { timers.forEach(clearTimeout); frames.forEach(cancelAnimationFrame); timers.clear(); frames.clear(); }
    };
  }
  // move pieces smoothly from where they are to `to`
  function glide(wb, clock, list, to, ms, done) {
    const from = list.map((o) => [o.x, o.y]);
    const t0 = performance.now(), dur = C.anim(ms);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const lift = Math.sin(t * Math.PI) * 0.8;
      list.forEach((o, i) => wb.update(o, { x: from[i][0] + (to[i][0] - from[i][0]) * e, y: from[i][1] + (to[i][1] - from[i][1]) * e - lift }));
      if (t < 1) clock.frame(step);
      else if (done) done();
    };
    if (!list.length) { if (done) done(); return; }
    clock.frame(step);
  }
  function panelTitle(ctx, text) { return ctx.h('div.bal-ptitle', text); }

  /* ================= the false coin ================= */

  function mountCoins(ctx, p, d) {
    const wb = ctx.wb, S = ctx.s, n = d.n, extra = d.extra || 0, dir = askDir(d);
    const clock = makeClock();
    registerTypes(wb);
    const board = wb.layer('board'), top = wb.layer('top');
    const perRow = n <= 8 ? n : n <= 16 ? Math.ceil(n / 2) : 10;
    const rows = Math.ceil(n / perRow);
    const TY = 19.4, SP = 2.6;
    const home = (i) => {
      if (i >= n) return [-12.2 + (i - n) * 2.2, 13.4];
      const r = Math.floor(i / perRow), inRow = Math.min(perRow, n - r * perRow), c = i - r * perRow;
      return [(c - (inRow - 1) / 2) * SP, TY + r * SP];
    };
    const tableBottom = TY + (rows - 1) * SP + 1.8;
    S('rect', { x: -15.8, y: TY - 2.1, width: 31.6, height: tableBottom - TY + 3.2, rx: 1.3, class: 'bal-table' }, board);
    if (extra) {
      S('ellipse', { cx: -12.2 + (extra - 1) * 1.1, cy: 14.4, rx: 1.9 + extra * 1.1, ry: 0.75, class: 'bal-saucer' }, board);
      S('text', { x: -12.2 + (extra - 1) * 1.1, y: 16.5, class: 'bal-cap', 'text-anchor': 'middle', text: extra > 1 ? 'good coins' : 'a good coin' }, board);
    }
    const bal = makeBalance(ctx, board);
    const wbtn = S('g', { class: 'bal-btn' }, board);
    S('rect', { x: 8.3, y: 12.7, width: 7.2, height: 2.9, rx: 1.45 }, wbtn);
    S('text', { x: 11.9, y: 14.65, 'text-anchor': 'middle', text: 'Weigh' }, wbtn);
    wbtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); weigh(); });
    const leftTxt = S('text', { x: 0, y: -7.3, class: 'bal-left', 'text-anchor': 'middle' }, board);
    const mark = S('g', { class: 'bal-mark' }, top);
    wb.setBounds({ x0: -17, y0: -9, x1: 17, y1: tableBottom + 1.4 }, 0.05);

    for (let i = 0; i < n + extra; i++) {
      const hm = home(i);
      wb.add({ id: 'c' + i, type: 'bcoin', kind: 'bcoin', name: i < n ? 'Coin ' + (i + 1) : 'Good coin', label: i < n ? String(i + 1) : '✓',
        x: hm[0], y: hm[1], data: { i, good: i >= n, pan: null, po: 0, tx: hm[0], ty: hm[1] } });
    }

    let log = [], show = null, verdict = null, busy = false;
    let returnAfter = C.store.get('bal-return', true) !== false;
    let pick = { coin: null, dir: 0 };

    const coins = () => wb.all().filter((o) => o.type === 'bcoin');
    const onPan = (side) => coins().filter((o) => o.data.pan === side).sort((a, b) => a.data.po - b.data.po);
    const nextPo = () => 1 + coins().reduce((m, o) => Math.max(m, o.data.po || 0), 0);
    function layoutPans(th) {
      ['L', 'R'].forEach((side) => {
        const list = onPan(side), pc = bal.pan(side === 'L' ? -1 : 1, th);
        list.forEach((o, i) => { const q = panSlot(i, list.length, pc[0], pc[1]); wb.update(o, { x: q[0], y: q[1] }); });
      });
    }
    bal.onAngle = (t) => layoutPans(t);
    function zoneAt(x, y) {
      for (const side of ['L', 'R']) {
        const pc = bal.pan(side === 'L' ? -1 : 1);
        if (Math.abs(x - pc[0]) <= 7.3 && y >= pc[1] - 9.5 && y <= pc[1] + 3.3) return side;
      }
      return null;
    }
    function stories(upto) {
      let st = freshStories(d);
      (upto == null ? log : log.slice(0, upto)).forEach((w) => { st = applyResult(st, w.L, w.R, w.out); });
      return st;
    }
    function panChanged() {
      if (show == null) return;
      show = null;
      bal.swingTo(0, 700, () => bal.lock(true));
    }

    /* dragging coins */
    let dragStart = null;
    wb.handlers.pick = (o, objs) => {
      if (busy) { wb.cancelGesture(); return; }
      dragStart = new Map(objs.map((q) => [q.id, [q.x, q.y]]));
    };
    wb.handlers.dragging = (objs) => {
      const o = objs[0];
      const z = o ? zoneAt(o.x, o.y) : null;
      bal.g.pans.forEach((el, i) => el.classList.toggle('hot', z === (i ? 'R' : 'L')));
    };
    wb.handlers.settle = (objs, why) => {
      bal.g.pans.forEach((el) => el.classList.remove('hot'));
      if (why !== 'move') return;
      let changed = false;
      objs.forEach((o) => {
        if (o.type !== 'bcoin') return;
        const z = zoneAt(o.x, o.y);
        if (z) {
          if (o.data.pan !== z) {
            if (!o.data.pan) { const s0 = dragStart && dragStart.get(o.id); if (s0) { o.data.tx = s0[0]; o.data.ty = s0[1]; } }
            o.data.pan = z; o.data.po = nextPo(); changed = true;
          }
        } else {
          if (o.data.pan) changed = true;
          o.data.pan = null; o.data.tx = o.x; o.data.ty = o.y;
        }
      });
      if (changed) { panChanged(); ctx.sfx('tap'); }
      layoutPans(bal.theta);
    };
    function moveTo(list, side) {
      if (busy) return;
      let changed = false;
      list.forEach((o) => {
        if (o.type !== 'bcoin') return;
        if (side) {
          if (o.data.pan !== side) { if (!o.data.pan) { o.data.tx = o.x; o.data.ty = o.y; } o.data.pan = side; o.data.po = nextPo(); changed = true; }
        } else if (o.data.pan) { o.data.pan = null; wb.update(o, { x: o.data.tx, y: o.data.ty }); changed = true; }
      });
      if (!changed) return;
      panChanged();
      layoutPans(bal.theta);
      wb.select([]);
      ctx.sfx('tap');
      wb.emit('change', { why: 'move', objs: list });
    }
    const allCoins = (sel) => sel.length && sel.every((o) => o.type === 'bcoin');
    wb.ctxActions.push(
      { icon: 'prev', title: 'Put on the left pan', when: allCoins, run: (sel) => moveTo(sel, 'L') },
      { icon: 'next', title: 'Put on the right pan', when: allCoins, run: (sel) => moveTo(sel, 'R') },
      { icon: 'down', title: 'Back to the table', when: (sel) => allCoins(sel) && sel.some((o) => o.data.pan), run: (sel) => moveTo(sel, null) }
    );
    wb.on('dbltap', ({ obj }) => {
      if (!obj || obj.type !== 'bcoin' || busy) return;
      // double-click: table → left pan → right pan → table
      moveTo([obj], obj.data.pan == null ? 'L' : obj.data.pan === 'L' ? 'R' : null);
    });

    /* weighing */
    const warn = (m) => { ctx.say(m, 'warn'); };
    const resultWord = (out) => (out === 0 ? 'the pans balance' : out > 0 ? 'the left pan sinks' : 'the right pan sinks');
    function weigh(done) {
      if (busy) return false;
      if (verdict) { ctx.say('Solved already — the false coin is caught.', 'good'); return false; }
      const L = onPan('L'), R = onPan('R');
      if (!L.length || !R.length) { warn('Put coins on both pans first: drag them there, or select some and use the ◀ ▶ buttons.'); ctx.sfx('wrong'); return false; }
      if (L.length !== R.length) { warn('The left pan holds ' + L.length + ' coins and the right ' + R.length + '. Coins this alike make the fuller pan sink every time — weigh equal numbers.'); ctx.sfx('wrong'); return false; }
      if (log.length >= d.k) { warn('No weighings left. Name the false coin in the panel — or undo a weighing.'); ctx.sfx('wrong'); return false; }
      const li = L.map((o) => o.data.i), ri = R.map((o) => o.data.i);
      const res = adversary(d, stories(), li, ri, d.k - log.length - 1);
      log.push({ L: li, R: ri, out: res.out });
      show = res.out;
      busy = true;
      bal.lock(false);
      ctx.sfx('tap');
      drawAll();
      ctx.say('Weighing ' + log.length + ': …', 'info');
      bal.swingTo(-res.out * TILT, 1500, () => {
        ctx.sfx(res.out === 0 ? 'snap' : 'tap');
        const kl = d.k - log.length;
        ctx.say('Weighing ' + log.length + ': **' + resultWord(res.out) + '**. ' + (kl ? C.plural(kl, 'weighing') + ' left.' : 'That was the last weighing — now name the false coin.'), '');
        const fin = () => { busy = false; drawAll(); if (done) done(); else ctx.changed('weigh'); };
        if (returnAfter) clock.later(() => returnCoins(fin), 700);
        else fin();
      }, res.out === 0 ? 0.08 : 0);
      return true;
    }
    function returnCoins(fin) {
      const list = coins().filter((o) => o.data.pan);
      list.forEach((o) => { o.data.pan = null; });
      show = null;
      bal.swingTo(0, 800, () => bal.lock(true));
      glide(wb, clock, list, list.map((o) => [o.data.tx, o.data.ty]), 480, fin);
    }

    /* naming the coin */
    const coinName = (i) => (i >= n ? 'the good coin' : 'coin ' + (i + 1));
    const storyName = (coin, dv) => (coin < 0 ? 'no false coin at all' : coinName(coin) + (dv > 0 ? ' (heavy)' : dv < 0 ? ' (light)' : ''));
    function reasonFor(coin, dv) {
      for (let j = 0; j < log.length; j++) {
        const w = log[j], onL = w.L.includes(coin), onR = w.R.includes(coin), nm = 'weighing ' + (j + 1);
        if (coin < 0) { if (w.out !== 0) return { both: true, msg: 'In ' + nm + ' the pans did not balance — so there *is* a false coin.' }; continue; }
        if (!onL && !onR) { if (w.out !== 0) return { both: true, msg: cap1(coinName(coin)) + ' was off the scale in ' + nm + ', yet the pans did not balance: the culprit was on the scale, so ' + coinName(coin) + ' is good.' }; continue; }
        if (w.out === 0) return { both: true, msg: cap1(coinName(coin)) + ' was on the scale in ' + nm + ' and the pans balanced — so it is good.' };
        const sinks = (onL && w.out > 0) || (onR && w.out < 0);
        if (dv > 0 && !sinks) return { msg: 'in ' + nm + ' its pan went *up*, and a heavy coin would have pulled it down' };
        if (dv < 0 && sinks) return { msg: 'in ' + nm + ' its pan went *down*, and a light coin would have let it rise' };
      }
      if (dv > 0 && d.fake === 'light') return { msg: 'the false coin is known to be light' };
      if (dv < 0 && d.fake === 'heavy') return { msg: 'the false coin is known to be heavy' };
      return null;
    }
    function whyNot(coin, dv) {
      if (coin < 0 || dv) { const r = reasonFor(coin, dv); return r ? (r.both ? r.msg : cap1(storyName(coin, dv)) + ' does not fit: ' + r.msg + '.') : 'That does not fit the weighings.'; }
      const rh = reasonFor(coin, 1), rl = reasonFor(coin, -1);
      if (rh && rh.both) return rh.msg;
      if (rl && rl.both) return rl.msg;
      return cap1(coinName(coin)) + ' cannot be heavy — ' + (rh ? rh.msg : '') + '; and it cannot be light — ' + (rl ? rl.msg : '') + '.';
    }
    function accuse() {
      if (busy || verdict) return;
      const coin = pick.coin;
      if (coin == null) { warn('Pick a coin in the panel first.'); return; }
      const fixedDir = d.fake === 'heavy' ? 1 : d.fake === 'light' ? -1 : 0;
      if (dir && coin >= 0 && !pick.dir) { warn('Heavier or lighter? Pick one of those too.'); return; }
      const dv = coin < 0 ? 0 : fixedDir || (dir ? pick.dir : 0);
      const st = stories(), left = storiesLeft(st, dir);
      const same = (s) => s.coin === coin && (!dir || coin < 0 || s.dir === dv);
      if (!left.some(same)) {
        warn(whyNot(coin, dir ? dv : fixedDir));
        ctx.sfx('wrong');
        return;
      }
      if (left.length > 1) {
        const other = left.find((s) => !same(s));
        const kl = d.k - log.length;
        warn(cap1(storyName(coin, dir ? dv : 0)) + ' fits every weighing so far — but so does ' + storyName(other.coin, dir ? other.dir : 0) + '. ' +
          (kl ? 'Weigh again to tell them apart.' : 'And no weighings are left: undo one (Ctrl+Z) or start again.'));
        ctx.sfx('wrong');
        return;
      }
      verdict = { coin, dir: coin < 0 ? 0 : (fixedDir || dv) };
      ctx.sfx('snap');
      drawAll();
      ctx.changed('verdict');
    }
    const verdictText = () => (verdict.coin < 0 ? 'every coin is good.' : 'coin ' + (verdict.coin + 1) + ', ' + (verdict.dir > 0 ? 'heavier' : 'lighter') + ' than the rest.');

    /* the panel: the record of weighings and the verdict */
    const pan = ctx.panel;
    const logEl = ctx.h('div.bal-log');
    const vEl = ctx.h('div.bal-verdict');
    const optEl = ctx.h('label.bal-opt', ctx.h('input', { type: 'checkbox', checked: returnAfter ? true : null, onchange: (e) => { returnAfter = e.target.checked; C.store.set('bal-return', returnAfter); } }), ' Coins go back to the table after each weighing');
    const weighBtn = ctx.h('button.btn.primary', { type: 'button', onclick: () => weigh() }, '⚖ Weigh');
    pan.append(ctx.h('div.bal-row', weighBtn, optEl), logEl, vEl);
    function chipsFor(list, cur, onPick) {
      const row = ctx.h('div.bal-chips');
      list.forEach(([v, label, cls]) => row.appendChild(ctx.h('button.bal-chip' + (cls ? '.' + cls : '') + (cur === v ? '.on' : ''), { type: 'button', onclick: () => onPick(v) }, label)));
      return row;
    }
    function drawVerdictPanel() {
      vEl.innerHTML = '';
      vEl.appendChild(panelTitle(ctx, verdict ? 'Caught!' : 'Which coin is false?'));
      if (verdict) { vEl.appendChild(ctx.h('div.bal-note', { html: ctx.md('The false coin: **' + verdictText() + '**') })); return; }
      const list = [];
      for (let i = 0; i < n; i++) list.push([i, String(i + 1)]);
      if (d.none) list.push([-1, 'none', 'wide']);
      vEl.appendChild(chipsFor(list, pick.coin, (v) => { pick.coin = pick.coin === v ? null : v; drawVerdictPanel(); }));
      if (dir) vEl.appendChild(chipsFor([[1, 'heavier', 'wide'], [-1, 'lighter', 'wide']], pick.dir, (v) => { pick.dir = pick.dir === v ? 0 : v; drawVerdictPanel(); }));
      vEl.appendChild(ctx.h('button.btn.gold', { type: 'button', onclick: accuse }, 'That one is false'));
    }
    function drawLog() {
      logEl.innerHTML = '';
      logEl.appendChild(panelTitle(ctx, 'Weighings (' + log.length + ' of ' + d.k + ')'));
      if (!log.length) { logEl.appendChild(ctx.h('div.bal-note', 'None yet. Drag coins onto the pans (or select them and press ◀ / ▶), then Weigh.')); return; }
      log.forEach((w, j) => {
        const side = (arr) => ctx.h('span.bal-side', arr.map((i) => ctx.h('i.bal-mini' + (i >= n ? '.good' : ''), i >= n ? '✓' : String(i + 1))));
        logEl.appendChild(ctx.h('div.bal-entry', ctx.h('b', (j + 1) + '.'), side(w.L), ctx.h('span.bal-vs', w.out === 0 ? '=' : w.out > 0 ? '>' : '<'), side(w.R),
          ctx.h('small', w.out === 0 ? 'balance' : w.out > 0 ? 'left sinks' : 'right sinks')));
      });
    }
    function drawMark() {
      mark.innerHTML = '';
      coins().forEach((o) => o.el && o.el.classList.toggle('bal-false', !!verdict && verdict.coin === o.data.i));
      if (!verdict || verdict.coin < 0) return;
      const o = wb.get('c' + verdict.coin);
      if (!o) return;
      S('text', { x: o.x, y: o.y - 1.6, class: 'bal-tag', 'text-anchor': 'middle', text: verdict.dir > 0 ? 'heavy ▼' : 'light ▲' }, mark);
    }
    function drawAll() {
      const kl = d.k - log.length;
      leftTxt.textContent = verdict ? 'caught!' : kl > 0 ? C.plural(kl, 'weighing') + ' left' : 'no weighings left';
      wbtn.classList.toggle('off', kl <= 0 || !!verdict);
      weighBtn.disabled = kl <= 0 || !!verdict;
      ctx.stat('Weighings', log.length + ' / ' + d.k);
      drawLog();
      drawVerdictPanel();
      drawMark();
    }

    function knowledge(st) {
      const U = [], H = [], L = [], G = [];
      for (let i = 0; i < n; i++) { if (st.H[i] && st.L[i]) U.push(i + 1); else if (st.H[i]) H.push(i + 1); else if (st.L[i]) L.push(i + 1); else G.push(i + 1); }
      if (!log.length) {
        const hy = hypsOf(countsOf(st, extra));
        return 'Count the possibilities: ' + (d.fake === 'either' ? 'each of the ' + n + ' coins could be heavy or light' : 'any of the ' + n + ' coins could be the ' + d.fake + ' one') + (d.none ? ', or none at all' : '') +
          ' — ' + hy + ' in all. A weighing has three results, so ' + C.plural(d.k, 'weighing') + ' can tell apart at most ' + P3[d.k] + '.';
      }
      const parts = [];
      if (U.length) parts.push('coin' + (U.length > 1 ? 's ' : ' ') + fmtList(U) + ' could be heavy or light');
      if (H.length) parts.push('coin' + (H.length > 1 ? 's ' : ' ') + fmtList(H) + ' could only be heavy');
      if (L.length) parts.push('coin' + (L.length > 1 ? 's ' : ' ') + fmtList(L) + ' could only be light');
      if (G.length) parts.push(fmtList(G) + (G.length > 1 ? ' are' : ' is') + ' good');
      if (st.z) parts.push('perhaps every coin is good');
      return 'What the scale has told you: ' + parts.join('; ') + '. (The paint tool can mark these groups on the coins.)';
    }
    function concrete(w, st) {
      const U = [], H = [], L = [], G = [];
      for (let i = n; i < n + extra; i++) G.push(i);
      for (let i = 0; i < n; i++) { if (st.H[i] && st.L[i]) U.push(i); else if (st.H[i]) H.push(i); else if (st.L[i]) L.push(i); else G.push(i); }
      const Lp = U.splice(0, w[0]).concat(H.splice(0, w[1]), L.splice(0, w[2]), G.splice(0, w[3]));
      const Rp = U.splice(0, w[4]).concat(H.splice(0, w[5]), L.splice(0, w[6]), G.splice(0, w[7]));
      return { L: Lp, R: Rp };
    }
    const sideText = (arr) => {
      const st = stories();
      const sus = arr.filter((i) => i < n && (st.H[i] || st.L[i])).map((i) => i + 1);
      const good = arr.filter((i) => i < n && !st.H[i] && !st.L[i]).map((i) => i + 1), spare = arr.filter((i) => i >= n).length;
      const parts = [];
      if (sus.length) parts.push('coin' + (sus.length > 1 ? 's ' : ' ') + fmtList(sus));
      if (good.length) parts.push((sus.length ? 'good ' : 'good ') + 'coin' + (good.length > 1 ? 's ' : ' ') + fmtList(good));
      if (spare) parts.push(spare > 1 ? spare + ' spare good coins' : 'the spare good coin');
      return parts.join(' with ');
    };
    function flash(list, cls) {
      list.forEach((i) => { const o = wb.get('c' + i); if (o && o.el) { const el = o.el; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 2800); } });
    }

    wb.on('restore', () => layoutPans(bal.theta));
    drawAll();

    return {
      noMoves: true,
      check() {
        if (verdict) return { solved: true, msg: 'The false coin: ' + verdictText() + ' (' + C.plural(log.length, 'weighing') + '.)' };
        return { solved: false, msg: log.length < d.k ? 'Weigh, then name the false coin in the panel.' : 'Name the false coin in the panel.' };
      },
      hint() {
        if (verdict) return 'Solved — the false coin is caught.';
        const st = stories(), c = countsOf(st, extra), kl = d.k - log.length, left = storiesLeft(st, dir);
        const know = knowledge(st);
        if (left.length === 1) {
          const s = left[0];
          return { text: know + ' Only one possibility is left — ' + storyName(s.coin, dir ? s.dir : 0) + '. Name it in the panel.', show() { if (s.coin >= 0) flash([s.coin], 'bal-hintL'); } };
        }
        if (!solvable(c, kl, dir)) return know + ' From here even perfect weighings cannot be sure of it, because the scale will answer as unhelpfully as it can. Undo the last weighing (Ctrl+Z) and try a more even split.';
        const w = bestWeighing(c, kl, dir);
        const pl = concrete(w, st);
        const os = outcomes(c, w).map((o) => (hypsOf(o) ? needOf(o, dir) : 0));
        return {
          text: know + ' A good next weighing: **' + sideText(pl.L) + '** against **' + sideText(pl.R) + '**. Whatever it shows leaves at most ' + Math.max.apply(null, os) + ' possibilities, few enough for the ' + C.plural(kl - 1, 'weighing') + ' after it.',
          show() { flash(pl.L, 'bal-hintL'); flash(pl.R, 'bal-hintR'); }
        };
      },
      solve() {
        clock.stop(); bal.stop();
        log = []; show = null; verdict = null; pick = { coin: null, dir: 0 };
        coins().forEach((o) => { const hm = home(o.data.i); o.data.pan = null; o.data.tx = hm[0]; o.data.ty = hm[1]; wb.update(o, { x: hm[0], y: hm[1] }); });
        bal.setAngle(0); bal.lock(true); busy = false; drawAll();
        const keep = returnAfter;
        returnAfter = true;
        const step = () => {
          const st = stories(), c = countsOf(st, extra), kl = d.k - log.length, left = storiesLeft(st, dir);
          if (left.length <= 1 || kl <= 0) {
            returnAfter = keep;
            const s = left[0];
            verdict = { coin: s.coin, dir: s.coin < 0 ? 0 : (d.fake === 'heavy' ? 1 : d.fake === 'light' ? -1 : s.dir) };
            drawAll();
            ctx.say('Caught: ' + verdictText(), 'good');
            ctx.changed('solve');
            return;
          }
          const w = bestWeighing(c, kl, dir);
          const pl = concrete(w, st);
          const list = [], to = [];
          [['L', pl.L], ['R', pl.R]].forEach(([side, arr]) => {
            const pc = bal.pan(side === 'L' ? -1 : 1, 0);
            arr.forEach((i, k) => { const o = wb.get('c' + i); o.data.pan = side; o.data.po = k + 1; list.push(o); to.push(panSlot(k, arr.length, pc[0], pc[1])); });
          });
          busy = true;
          glide(wb, clock, list, to, 520, () => { busy = false; weigh(() => clock.later(step, 350)); });
        };
        clock.later(step, 300);
      },
      explain() {
        const s0 = coinStart(d), w = bestWeighing(s0, d.k, dir);
        const hy = needOf(s0, dir);
        let t = 'Count the possibilities: ' + (d.fake === 'either' ? (dir ? 'each coin heavy or light' : 'each coin') : 'each coin') + (d.none ? ', or none false' : '') + ' — ' + hy + ' in all' +
          (extra ? ' (the spare good coin adds none, but it lets a pan be filled up)' : '') + '. Each weighing ends one of three ways, so ' + C.plural(d.k, 'weighing') + ' can separate at most 3' + (d.k > 1 ? '<sup>' + d.k + '</sup> = ' + P3[d.k] : '') + '.';
        if (w) {
          const os = outcomes(s0, w).map((o) => (hypsOf(o) ? needOf(o, dir) : 0));
          const a = w[0] + w[1] + w[2], b = w[4] + w[5] + w[6];
          t += ' A good first weighing puts ' + a + ' coin' + (a > 1 ? 's' : '') + ' against ' + b + (w[7] || w[3] ? ' (plus ' + (w[3] + w[7]) + ' good)' : '') + ': left down, balance and right down leave ' + os[2] + ', ' + os[1] + ' and ' + os[0] + ' possibilities' +
            (d.k > 1 ? ', each no more than 3' + (d.k - 1 > 1 ? '<sup>' + (d.k - 1) + '</sup>' : '') + ' = ' + P3[d.k - 1] + ', what the remaining weighings can handle.' : '.');
          t += ' Then the same idea again: split what is left as evenly as the scale allows. The solution shown plays against the scale at its most awkward.';
        }
        return t;
      },
      getState() { return { log: C.clone(log), show, verdict: verdict ? Object.assign({}, verdict) : null }; },
      setState(s) {
        clock.stop(); bal.stop(); busy = false;
        log = C.clone(s.log || []); show = s.show == null ? null : s.show; verdict = s.verdict || null;
        bal.setAngle(show != null ? -show * TILT : 0);
        bal.lock(show == null);
        layoutPans(bal.theta);
        drawAll();
      },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.key === 'w' || ev.key === 'W') { weigh(); return true; }
        return false;
      },
      destroy() { clock.stop(); bal.stop(); }
    };
  }

  /* ================= bags on a spring scale ================= */

  const bagHue = (b, n) => Math.round((b * 360 / n + 18) % 360);
  function sackPath(cx, cy, w, h) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, nw = w * 0.22;
    return 'M' + f2(cx - nw) + ' ' + f2(y0 + h * 0.18) +
      'C' + f2(x0 - w * 0.05) + ' ' + f2(y0 + h * 0.35) + ' ' + f2(x0 - w * 0.12) + ' ' + f2(y1) + ' ' + f2(cx) + ' ' + f2(y1) +
      'C' + f2(x1 + w * 0.12) + ' ' + f2(y1) + ' ' + f2(x1 + w * 0.05) + ' ' + f2(y0 + h * 0.35) + ' ' + f2(cx + nw) + ' ' + f2(y0 + h * 0.18) +
      'L' + f2(cx + nw * 1.6) + ' ' + f2(y0) + 'L' + f2(cx - nw * 1.6) + ' ' + f2(y0) + 'Z';
  }

  function mountBags(ctx, p, d) {
    const wb = ctx.wb, S = ctx.s, n = d.bags, per = d.per == null ? 99 : d.per, k = d.k || 1;
    const clock = makeClock();
    const board = wb.layer('board');
    const plan = bagPlan(d);
    const SPX = 3.9;
    const bx = (b) => (b - (n - 1) / 2) * SPX;
    const W = Math.max(16, (n / 2) * SPX + 2.2);
    const maxLoad = Math.max(1, n * Math.min(per, 40)) * Math.max(d.coin, d.fake);
    const unit = d.unit || 'g';

    // the bracket, the spring scale, its pan
    S('rect', { x: -6, y: -13.2, width: 12, height: 1.2, rx: 0.4, class: 'bal-bracket' }, board);
    S('rect', { x: -2.4, y: -12, width: 4.8, height: 11, rx: 1, class: 'spr-plate' }, board);
    let ticks = '';
    for (let i = 0; i <= 10; i++) { const y = -10.6 + i * 0.8; ticks += 'M-2 ' + f2(y) + 'H' + (i % 5 === 0 ? '-0.9' : '-1.4'); }
    S('path', { d: ticks, class: 'spr-ticks' }, board);
    const spring = S('path', { class: 'spr-coil' }, board);
    const pointer = S('path', { class: 'spr-pointer' }, board);
    const rod = S('path', { class: 'bal-string' }, board);
    const panEl = S('path', { class: 'bal-pan' }, board);
    const pile = S('g', { class: 'spr-pile' }, board);
    const catchEl = S('path', { d: 'M-1.2 -0.6H1.2V0.2H-1.2Z', class: 'bal-arrest' }, board);
    const card = S('g', { class: 'spr-card' }, board);
    S('rect', { x: 3.4, y: -11.6, width: 8.8, height: 5, rx: 0.8 }, card);
    const readEl = S('text', { x: 7.8, y: -8.1, 'text-anchor': 'middle', class: 'spr-read' }, card);
    const subEl = S('text', { x: 7.8, y: -6.9, 'text-anchor': 'middle', class: 'bal-cap' }, card);
    const wbtn = S('g', { class: 'bal-btn' }, board);
    S('rect', { x: 8, y: 4.4, width: 7.2, height: 2.9, rx: 1.45 }, wbtn);
    S('text', { x: 11.6, y: 6.35, 'text-anchor': 'middle', text: 'Weigh' }, wbtn);
    wbtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); weigh(); });

    let taken = new Array(n).fill(0), log = [], verdict = null, stretch = 0, busy = false;
    let picked = new Set();

    const bags = [];
    for (let b = 0; b < n; b++) {
      const g = S('g', { class: 'spr-bag' }, board);
      const hue = bagHue(b, n);
      S('path', { d: sackPath(bx(b), 14.6, 3.1, 3.8), class: 'spr-sack', 'data-key': 'bag' + b }, g);
      S('path', { d: 'M' + f2(bx(b) - 0.75) + ' 13.25Q' + f2(bx(b)) + ' 13.7 ' + f2(bx(b) + 0.75) + ' 13.25', class: 'spr-tie' }, g);
      S('circle', { cx: bx(b), cy: 15.4, r: 0.95, fill: 'hsl(' + hue + ' 70% 62%)', class: 'spr-badge' }, g);
      S('text', { x: bx(b), y: 15.78, 'text-anchor': 'middle', class: 'spr-num', text: String(b + 1) }, g);
      const cnt = S('text', { x: bx(b), y: 18.5, 'text-anchor': 'middle', class: 'spr-count' }, g);
      const mk = (dx, label, fn) => {
        const bg = S('g', { class: 'spr-step' }, g);
        S('circle', { cx: bx(b) + dx, cy: 18.1, r: 0.72 }, bg);
        S('text', { x: bx(b) + dx, y: 18.5, 'text-anchor': 'middle', text: label }, bg);
        bg.addEventListener('pointerdown', (e) => { e.stopPropagation(); fn(); });
      };
      mk(-1.35, '−', () => change(b, -1));
      mk(1.35, '+', () => change(b, 1));
      g.addEventListener('pointerdown', (e) => { if (wb.mode !== 'select') return; e.stopPropagation(); change(b, 1); });
      bags.push({ g, cnt, hue });
    }
    wb.setBounds({ x0: -W, y0: -14, x1: W, y1: 20.2 }, 0.05);

    function change(b, dv) {
      if (busy || verdict) return;
      if (log.length >= k) { ctx.say('The scale has been used' + (k > 1 ? ' ' + k + ' times' : '') + '. Name the false bag' + (d.many ? 's' : '') + ' — or undo the weighing.', 'warn'); return; }
      const v = taken[b] + dv;
      if (v < 0) return;
      if (v > per) { ctx.say('Bag ' + (b + 1) + ' holds only ' + per + ' coins.', 'warn'); ctx.sfx('wrong'); return; }
      taken[b] = v;
      ctx.sfx('tap');
      draw();
      ctx.changed('take');
    }
    function drawPile() {
      pile.innerHTML = '';
      const list = [];
      taken.forEach((t, b) => { for (let i = 0; i < t; i++) list.push(b); });
      const py = 3.4 + stretch, perRowC = 13;
      list.forEach((b, i) => {
        const r = Math.floor(i / perRowC), c = i % perRowC, inRow = Math.min(perRowC, list.length - r * perRowC);
        S('circle', { cx: f2((c - (inRow - 1) / 2) * 0.9), cy: f2(py - 0.4 - r * 0.62), r: 0.44, fill: 'hsl(' + bags[b].hue + ' 70% 62%)', class: 'spr-coin' }, pile);
      });
    }
    function drawScale() {
      const top = -11.4, py = -10.4 + stretch;
      let dd = 'M0 ' + top;
      const coils = 9, len = py - top - 0.3;
      for (let i = 1; i <= coils; i++) dd += 'L' + (i % 2 ? 0.9 : -0.9) + ' ' + f2(top + 0.15 + len * (i - 0.5) / coils);
      dd += 'L0 ' + f2(py);
      spring.setAttribute('d', dd);
      pointer.setAttribute('d', 'M-2.1 ' + f2(py) + 'L-0.9 ' + f2(py - 0.45) + 'L-0.9 ' + f2(py + 0.45) + 'Z');
      rod.setAttribute('d', 'M0 ' + f2(py) + 'V' + f2(2.2 + stretch) + 'M0 ' + f2(2.2 + stretch) + 'L-5.8 ' + f2(3.4 + stretch) + 'M0 ' + f2(2.2 + stretch) + 'L5.8 ' + f2(3.4 + stretch));
      panEl.setAttribute('d', 'M-6.2 ' + f2(3.4 + stretch) + 'Q0 ' + f2(5.6 + stretch) + ' 6.2 ' + f2(3.4 + stretch) + 'Z');
      catchEl.setAttribute('transform', 'translate(0 ' + f2(stretch) + ')');
      catchEl.style.opacity = log.length ? 0 : 1;
      drawPile();
    }
    const stretchFor = (grams) => Math.min(6.2, 6.2 * grams / maxLoad);
    function draw() {
      bags.forEach((B, b) => {
        B.cnt.textContent = taken[b] ? '×' + taken[b] : '0';
        B.g.classList.toggle('hot', taken[b] > 0);
        B.g.classList.toggle('named', !!verdict && (verdict & (1 << b)) !== 0);
      });
      const last = log[log.length - 1];
      readEl.textContent = last ? last.reading + ' ' + unit : '— ' + unit;
      subEl.textContent = last ? 'reading ' + log.length + (k > 1 ? ' of ' + k : '') : 'press Weigh to read';
      wbtn.classList.toggle('off', log.length >= k || !!verdict);
      weighBtn.disabled = log.length >= k || !!verdict;
      ctx.stat('Coins on the scale', taken.reduce((a, b) => a + b, 0));
      drawScale();
      drawPanel();
    }
    function candidates() {
      let c = bagStories(d);
      log.forEach((w) => { c = c.filter((m) => bagReading(d, w.taken, m) === w.reading); });
      return c;
    }
    function weigh(done) {
      if (busy || verdict) return;
      const tot = taken.reduce((a, b) => a + b, 0);
      if (!tot) { ctx.say('Take some coins from the bags first: click a bag, or its + button.', 'warn'); ctx.sfx('wrong'); return; }
      if (log.length >= k) { ctx.say('No more weighings.', 'warn'); return; }
      // the adversary: the reading shared by the most stories
      const groups = new Map();
      candidates().forEach((m) => { const r = bagReading(d, taken, m); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(m); });
      let best = null;
      groups.forEach((list, r) => {
        const tie = C.hash(p.id + ':' + r);
        if (!best || list.length > best.n || (list.length === best.n && tie < best.tie)) best = { r, n: list.length, tie };
      });
      log.push({ taken: taken.slice(), reading: best.r });
      busy = true;
      ctx.sfx('tap');
      const from = stretch, to = stretchFor(best.r), t0 = performance.now(), dur = C.anim(1300);
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = t >= 1 ? 1 : 1 - Math.exp(-4.5 * t) * Math.cos(10 * t);
        stretch = from + (to - from) * e;
        drawScale();
        readEl.textContent = Math.round(best.r * Math.min(1, t * 1.6)) + ' ' + unit;
        if (t < 1) clock.frame(step);
        else { busy = false; stretch = to; draw(); ctx.say('The scale reads **' + best.r + ' ' + unit + '**.', ''); if (done) done(); else ctx.changed('weigh'); }
      };
      clock.frame(step);
    }
    function maskText(m) {
      const list = [];
      for (let b = 0; b < n; b++) if (m & (1 << b)) list.push(b + 1);
      if (!list.length) return 'no false bag at all';
      return (list.length > 1 ? 'bags ' : 'bag ') + fmtList(list);
    }
    function accuse() {
      if (busy || verdict) return;
      let m = 0;
      picked.forEach((b) => { m |= 1 << b; });
      if (!d.many && !m) { ctx.say('Pick the false bag in the panel first.', 'warn'); return; }
      const c = candidates();
      if (!c.includes(m)) {
        const last = log[log.length - 1];
        if (!last) { ctx.say('Weigh first — the scale has not said anything yet.', 'warn'); ctx.sfx('wrong'); return; }
        ctx.say('If it were ' + maskText(m) + ', the scale would have read ' + bagReading(d, last.taken, m) + ' ' + unit + ', not ' + last.reading + ' ' + unit + '.', 'warn');
        ctx.sfx('wrong');
        return;
      }
      if (c.length > 1) {
        const other = c.find((x) => x !== m);
        ctx.say(cap1(maskText(m)) + ' fits the reading — but so does ' + maskText(other) + '. ' + (log.length < k ? 'Weigh again.' : 'The scale cannot tell them apart: undo, and take the coins differently.'), 'warn');
        ctx.sfx('wrong');
        return;
      }
      verdict = m || -1;
      ctx.sfx('snap');
      draw();
      ctx.changed('verdict');
    }
    const vMask = () => (verdict === -1 ? 0 : verdict);

    const weighBtn = ctx.h('button.btn.primary', { type: 'button', onclick: () => weigh() }, '⚖ Weigh');
    const pEl = ctx.h('div.bal-verdict');
    ctx.panel.append(ctx.h('div.bal-row', weighBtn), pEl);
    function drawPanel() {
      pEl.innerHTML = '';
      pEl.appendChild(panelTitle(ctx, verdict ? 'Found!' : d.many ? 'Which bags are false?' : 'Which bag is false?'));
      if (verdict) { pEl.appendChild(ctx.h('div.bal-note', { html: ctx.md('The false coins are in **' + maskText(vMask()) + '**.') })); return; }
      const row = ctx.h('div.bal-chips');
      for (let b = 0; b < n; b++) {
        row.appendChild(ctx.h('button.bal-chip' + (picked.has(b) ? '.on' : ''), { type: 'button', style: { '--h': bags[b].hue }, onclick: () => {
          if (d.many) { if (picked.has(b)) picked.delete(b); else picked.add(b); } else { const was = picked.has(b); picked.clear(); if (!was) picked.add(b); }
          drawPanel();
        } }, String(b + 1)));
      }
      pEl.appendChild(row);
      if (d.many) pEl.appendChild(ctx.h('div.bal-note', 'Pick every false bag — or none, if you think all are good.'));
      pEl.appendChild(ctx.h('button.btn.gold', { type: 'button', onclick: accuse }, d.many ? (picked.size ? 'Those are false' : 'All bags are good') : 'That one is false'));
    }
    draw();

    return {
      noMoves: true,
      check() {
        if (verdict) return { solved: true, msg: 'The false coins are in ' + maskText(vMask()) + '.' };
        return { solved: false, msg: log.length ? 'Name the false bag in the panel.' : 'Take coins, weigh, and name the false bag.' };
      },
      hint() {
        if (verdict) return 'Solved.';
        const c = candidates();
        if (log.length) {
          const last = log[log.length - 1], tot = last.taken.reduce((a, b) => a + b, 0);
          const good = tot * d.coin, diff = good - last.reading;
          const base = 'All good, those ' + tot + ' coins would weigh ' + good + ' ' + unit + '; the scale read ' + last.reading + ' ' + unit + ' — ' + Math.abs(diff) + ' ' + unit + (diff > 0 ? ' short' : ' over') + '.';
          if (c.length === 1) return base + ' That can only be ' + maskText(c[0]) + '.';
          return base + ' That fits ' + maskText(c[0]) + ' and ' + maskText(c[1]) + ' alike. Undo the weighing and take the coins so that every possibility gives a different reading.';
        }
        if (!d.many) return 'Take a different number of coins from each bag — 0 from bag 1, 1 from bag 2, 2 from bag 3 and so on. Each false coin is ' + Math.abs(d.coin - d.fake) + ' ' + unit + ' ' + (d.fake < d.coin ? 'light' : 'heavy') + ', so how far the reading is off counts the false coins — and names their bag.';
        return 'Every group of false bags must give a different total. Counts that do it here: ' + plan.map((t, b) => t + ' from bag ' + (b + 1)).join(', ') + '. No two groups of those numbers add up to the same thing.';
      },
      solve() {
        clock.stop(); busy = false;
        taken = new Array(n).fill(0); log = []; verdict = null; picked = new Set(); stretch = 0;
        draw();
        let b = 0;
        const fill = () => {
          if (b >= n) { weigh(() => { const c = candidates(); verdict = c[0] || -1; if (verdict === 0) verdict = -1; draw(); ctx.say('Found: ' + maskText(vMask()) + '.', 'good'); ctx.changed('solve'); }); return; }
          taken[b] = plan[b]; b++;
          draw();
          clock.later(fill, 160);
        };
        clock.later(fill, 200);
      },
      explain() {
        if (!d.many) return 'Take 0, 1, 2, … coins from the bags in turn. If every coin were good the scale would read a round figure; each false coin shifts it by ' + Math.abs(d.coin - d.fake) + ' ' + unit + ', so the shift divided by ' + Math.abs(d.coin - d.fake) + ' is the number of coins taken from the false bag. (The bag you took nothing from is false when the reading is exactly right.)';
        return 'Any group of bags may be false, so each group must shift the reading by a different amount. With ' + plan.join(', ') + ' coins from the bags in turn, every group of them has its own total' + (plan.every((t, i) => t === 1 << i) ? ' — they are powers of two, and the shortfall written in binary lists the false bags.' : ' — no two groups add up alike, which is what matters when the bags are small.');
      },
      getState() { return { taken: taken.slice(), log: C.clone(log), verdict }; },
      setState(s) {
        clock.stop(); busy = false;
        taken = (s.taken || []).slice(); log = C.clone(s.log || []); verdict = s.verdict || null;
        const last = log[log.length - 1];
        stretch = last ? stretchFor(last.reading) : 0;
        draw();
      },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.key === 'w' || ev.key === 'W') { weigh(); return true; }
        const b = parseInt(ev.key, 10);
        if (b >= 1 && b <= Math.min(9, n)) { change(b - 1, ev.altKey ? -1 : 1); return true; }
        return false;
      },
      destroy() { clock.stop(); }
    };
  }

  /* ================= weights on the balance: place a load, find a parcel ================= */

  const LOAD = { w: 4.4, h: 3.5 };
  // lay things (each {w, h}) side by side on a pan, wrapping into rows
  function packPan(items, px, py) {
    const rows = [];
    let cur = [], cw = 0;
    items.forEach((it) => { if (cur.length && cw + it.w > 11.8) { rows.push(cur); cur = []; cw = 0; } cur.push(it); cw += it.w + 0.25; });
    if (cur.length) rows.push(cur);
    const pos = [];
    let base = py - 0.3;
    rows.forEach((row) => {
      const tw = row.reduce((s, it) => s + it.w, 0) + 0.25 * (row.length - 1);
      let x = px - tw / 2;
      const rh = Math.max.apply(null, row.map((it) => it.h));
      row.forEach((it) => { pos.push([x + it.w / 2, base - it.h / 2]); x += it.w + 0.25; });
      base -= rh + 0.12;
    });
    return pos;
  }
  function loadSVG(label, parcel) {
    if (parcel) {
      return '<rect x="-2" y="-1.6" width="4" height="3.2" rx=".35" class="bal-parcel"/><path d="M0 -1.6V1.6M-2 0H2" class="bal-cord"/>' +
        '<text y=".45" text-anchor="middle" class="bal-load-n">' + C.esc(label) + '</text>';
    }
    return '<path d="' + sackPath(0, 0.05, 3.9, 3.4) + '" class="bal-sack"/><text y=".75" text-anchor="middle" class="bal-load-n">' + C.esc(label) + '</text>';
  }

  function mountWeights(ctx, p, d) {
    const wb = ctx.wb, S = ctx.s, find = d.kind === 'find', pans = d.pans || 2, unit = d.unit || 'kg';
    const clock = makeClock();
    registerTypes(wb);
    wb.type('bload', {
      draw(g, o) { g.innerHTML = loadSVG(o.label, o.data.parcel); if (o.fill) { const f = g.firstChild; f.style.fill = o.fill; } },
      poly() { return [[-LOAD.w / 2, -LOAD.h / 2], [LOAD.w / 2, -LOAD.h / 2], [LOAD.w / 2, LOAD.h / 2], [-LOAD.w / 2, LOAD.h / 2]]; }
    });
    const board = wb.layer('board');
    const planner = find ? findPlanner(d) : null;
    const ws = d.weights.slice();
    // the shelf of weights, smallest first
    const order = ws.map((v, i) => i).sort((a, b) => ws[a] - ws[b] || a - b);
    const widths = order.map((i) => weightSize(ws[i]).w);
    const shelfW = widths.reduce((a, b) => a + b, 0) + 1.1 * (order.length - 1);
    const home = {};
    let x = -shelfW / 2;
    order.forEach((i, k) => { home[i] = [x + widths[k] / 2, 19.9 - weightSize(ws[i]).h / 2 + 0.9]; x += widths[k] + 1.1; });
    S('rect', { x: Math.min(-15.8, -shelfW / 2 - 1.2), y: 20.8, width: Math.max(31.6, shelfW + 2.4), height: 1, rx: 0.4, class: 'bal-shelf' }, board);
    const bal = makeBalance(ctx, board);
    let wbtn = null;
    if (find) {
      wbtn = S('g', { class: 'bal-btn' }, board);
      S('rect', { x: 8.3, y: 12.7, width: 7.2, height: 2.9, rx: 1.45 }, wbtn);
      S('text', { x: 11.9, y: 14.65, 'text-anchor': 'middle', text: 'Weigh' }, wbtn);
      wbtn.addEventListener('pointerdown', (e) => { e.stopPropagation(); weigh(); });
    }
    const leftTxt = S('text', { x: 0, y: -7.3, class: 'bal-left', 'text-anchor': 'middle' }, board);
    const W = Math.max(17, shelfW / 2 + 1.8);
    wb.setBounds({ x0: -W, y0: -9, x1: W, y1: 22.5 }, 0.05);

    const loadSide = d.side === 'R' ? 'R' : 'L';
    const load = wb.add({ id: 'load', type: 'bload', kind: 'bload', name: find ? 'The parcel' : 'The load', label: find ? '?' : d.load + ' ' + unit, move: false, data: { parcel: find } });
    ws.forEach((v, i) => wb.add({ id: 'w' + i, type: 'bweight', kind: 'bweight', name: v + ' ' + unit + ' weight', x: home[i][0], y: home[i][1], data: { v, pan: null, po: 0 } }));

    let log = [], show = null, verdict = null, busy = false;
    const weights = () => wb.all().filter((o) => o.type === 'bweight');
    const onPan = (side) => weights().filter((o) => o.data.pan === side).sort((a, b) => a.data.po - b.data.po);
    const nextPo = () => 1 + weights().reduce((m, o) => Math.max(m, o.data.po || 0), 0);
    const sum = (list) => list.reduce((s, o) => s + o.data.v, 0);
    // how much heavier the right pan is (the load counted on its side)
    function diff() {
      const l = sum(onPan('L')) + (loadSide === 'L' ? (d.load || 0) : 0), r = sum(onPan('R')) + (loadSide === 'R' ? (d.load || 0) : 0);
      return r - l;
    }
    function layoutPans(th) {
      ['L', 'R'].forEach((side) => {
        const list = (side === loadSide ? [load] : []).concat(onPan(side));
        const pc = bal.pan(side === 'L' ? -1 : 1, th);
        const pos = packPan(list.map((o) => (o === load ? LOAD : weightSize(o.data.v))), pc[0], pc[1]);
        list.forEach((o, i) => wb.update(o, { x: pos[i][0], y: pos[i][1] }));
      });
    }
    bal.onAngle = (t) => layoutPans(t);
    function zoneAt(xx, yy) {
      for (const side of ['L', 'R']) {
        const pc = bal.pan(side === 'L' ? -1 : 1);
        if (Math.abs(xx - pc[0]) <= 7.3 && yy >= pc[1] - 9.5 && yy <= pc[1] + 3.3) return side;
      }
      return null;
    }
    const liveAngle = () => { const df = diff(); return TILT * Math.tanh(df / Math.max(2, 0.12 * (d.load || 10))); };
    function retilt() {
      draw();
      if (find) { if (show != null) { show = null; bal.swingTo(0, 700, () => bal.lock(true)); } return; }
      bal.lock(false);
      bal.swingTo(liveAngle(), 1100);
    }
    function allowed(o, side) {
      if (pans === 1 && side === loadSide) {
        ctx.toast('In this puzzle the weights go only on the other pan.');
        return false;
      }
      return true;
    }
    wb.handlers.pick = (o) => { if (busy) wb.cancelGesture(); };
    wb.handlers.dragging = (objs) => {
      const o = objs[0], z = o ? zoneAt(o.x, o.y) : null;
      bal.g.pans.forEach((el, i) => el.classList.toggle('hot', z === (i ? 'R' : 'L')));
    };
    wb.handlers.settle = (objs, why) => {
      bal.g.pans.forEach((el) => el.classList.remove('hot'));
      if (why !== 'move') return;
      let changed = false;
      objs.forEach((o) => {
        if (o.type !== 'bweight') return;
        const z = zoneAt(o.x, o.y);
        if (z && allowed(o, z)) { if (o.data.pan !== z) { o.data.pan = z; o.data.po = nextPo(); changed = true; } }
        else {
          if (o.data.pan) changed = true;
          o.data.pan = null;
          const hm = home[+o.id.slice(1)];
          wb.update(o, { x: hm[0], y: hm[1] });
        }
      });
      layoutPans(bal.theta);
      if (changed) { ctx.sfx('tap'); retilt(); }
    };
    function moveTo(list, side) {
      if (busy) return;
      let changed = false;
      list.forEach((o) => {
        if (o.type !== 'bweight') return;
        if (side && !allowed(o, side)) return;
        if (side) { if (o.data.pan !== side) { o.data.pan = side; o.data.po = nextPo(); changed = true; } }
        else if (o.data.pan) { o.data.pan = null; const hm = home[+o.id.slice(1)]; wb.update(o, { x: hm[0], y: hm[1] }); changed = true; }
      });
      if (!changed) return;
      layoutPans(bal.theta);
      retilt();
      wb.select([]);
      ctx.sfx('tap');
      wb.emit('change', { why: 'move', objs: list });
    }
    const allW = (sel) => sel.length && sel.every((o) => o.type === 'bweight');
    wb.ctxActions.push(
      { icon: 'prev', title: 'Put on the left pan', when: (sel) => allW(sel) && !(pans === 1 && loadSide === 'L'), run: (sel) => moveTo(sel, 'L') },
      { icon: 'next', title: 'Put on the right pan', when: (sel) => allW(sel) && !(pans === 1 && loadSide === 'R'), run: (sel) => moveTo(sel, 'R') },
      { icon: 'down', title: 'Back to the shelf', when: (sel) => allW(sel) && sel.some((o) => o.data.pan), run: (sel) => moveTo(sel, null) }
    );
    wb.on('dbltap', ({ obj }) => {
      if (!obj || obj.type !== 'bweight' || busy) return;
      const other = loadSide === 'L' ? 'R' : 'L';
      const cyc = pans === 1 ? [null, other] : [null, other, loadSide];
      const next = cyc[(cyc.indexOf(obj.data.pan) + 1) % cyc.length];
      moveTo([obj], next);
    });

    /* the parcel: an adversary picks its weight as late as it can */
    const range = () => {
      let a = d.lo, b = d.hi;
      log.forEach((w) => { if (w.out === 0) { a = b = w.v; } else if (w.out > 0) a = Math.max(a, w.v + 1); else b = Math.min(b, w.v - 1); });
      return [a, b];
    };
    // the comparison the pans make: the parcel against v
    const compareValue = () => (loadSide === 'L' ? sum(onPan('R')) - sum(onPan('L')) : sum(onPan('L')) - sum(onPan('R')));
    function weigh(done) {
      if (!find || busy || verdict != null) return;
      if (log.length >= d.k) { ctx.say('No weighings left: say what the parcel weighs — or undo a weighing.', 'warn'); ctx.sfx('wrong'); return; }
      const v = compareValue();
      if (v <= 0) { ctx.say('Put weights on the other pan first — as it is, the parcel is bound to sink.', 'warn'); ctx.sfx('wrong'); return; }
      const [a, b] = range(), kl = d.k - log.length - 1;
      const groups = [];
      if (v >= a && v <= b) groups.push({ out: 0, a: v, b: v });
      if (b > v) groups.push({ out: 1, a: Math.max(a, v + 1), b });
      if (a < v) groups.push({ out: -1, a, b: Math.min(b, v - 1) });
      let best = null;
      groups.forEach((gr) => {
        const stuck = !planner.solv(gr.a, gr.b, kl);
        const sc = (stuck ? 1000 : 0) + (gr.b - gr.a + 1);
        if (!best || sc > best.sc) best = Object.assign({ sc }, gr);
      });
      log.push({ v, out: best.out, L: onPan('L').map((o) => o.data.v), R: onPan('R').map((o) => o.data.v) });
      const sinkL = loadSide === 'L' ? best.out : -best.out;   // the parcel's pan sinks when it is heavier
      show = sinkL;
      busy = true;
      bal.lock(false);
      ctx.sfx('tap');
      draw();
      bal.swingTo(-sinkL * TILT, 1500, () => {
        busy = false;
        ctx.say('The parcel is **' + (best.out === 0 ? 'exactly ' + v + ' ' + unit : best.out > 0 ? 'heavier than ' + v + ' ' + unit : 'lighter than ' + v + ' ' + unit) + '**.', '');
        draw();
        if (done) done(); else ctx.changed('weigh');
      }, best.out === 0 ? 0.08 : 0);
    }
    const guessIn = ctx.h('input.ans-in', { type: 'text', inputmode: 'numeric', placeholder: 'kg', autocomplete: 'off', style: { width: '6em' } });
    guessIn.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') declare(); });
    function declare(val) {
      if (busy || verdict != null) return;
      const v = val != null ? val : readNum(guessIn.value);
      if (isNaN(v)) { ctx.say('Type a whole number of ' + unit + '.', 'warn'); return; }
      const [a, b] = range();
      if (v < a || v > b) { ctx.say('That cannot be it: the weighings say the parcel is between ' + a + ' and ' + b + ' ' + unit + '.', 'warn'); ctx.sfx('wrong'); return; }
      if (a !== b) { ctx.say('It *could* be ' + v + ' ' + unit + ' — but anything from ' + a + ' to ' + b + ' still fits. ' + (log.length < d.k ? 'Weigh again.' : 'No weighings are left: undo one and split more evenly.'), 'warn'); ctx.sfx('wrong'); return; }
      verdict = v;
      ctx.sfx('snap');
      draw();
      ctx.changed('verdict');
    }
    const logEl = ctx.h('div.bal-log'), vEl = ctx.h('div.bal-verdict');
    if (find) {
      const weighBtn = ctx.h('button.btn.primary', { type: 'button', onclick: () => weigh() }, '⚖ Weigh');
      ctx.panel.append(ctx.h('div.bal-row', weighBtn), logEl, vEl);
    }
    function draw() {
      const df = diff();
      if (!find) {
        leftTxt.textContent = df === 0 ? 'balanced!' : '';
        ctx.stat('Weights used', weights().filter((o) => o.data.pan).length);
        return;
      }
      const kl = d.k - log.length, [a, b] = range();
      leftTxt.textContent = verdict != null ? verdict + ' ' + unit + '!' : kl > 0 ? C.plural(kl, 'weighing') + ' left' : 'no weighings left';
      if (wbtn) wbtn.classList.toggle('off', kl <= 0 || verdict != null);
      ctx.stat('Weighings', log.length + ' / ' + d.k);
      logEl.innerHTML = '';
      logEl.appendChild(panelTitle(ctx, 'Weighings (' + log.length + ' of ' + d.k + ')'));
      if (!log.length) logEl.appendChild(ctx.h('div.bal-note', 'The parcel weighs a whole number of ' + unit + ' from ' + d.lo + ' to ' + d.hi + '. Put weights on the pans and press Weigh.'));
      log.forEach((w, j) => {
        const side = (arr, withParcel) => ctx.h('span.bal-side', (withParcel ? [ctx.h('i.bal-mini.parcel', '?')] : []).concat(arr.map((v) => ctx.h('i.bal-mini.wt', String(v)))));
        logEl.appendChild(ctx.h('div.bal-entry', ctx.h('b', (j + 1) + '.'), side(w.L, loadSide === 'L'), ctx.h('span.bal-vs', '·'), side(w.R, loadSide === 'R'),
          ctx.h('small', w.out === 0 ? '= ' + w.v : w.out > 0 ? '> ' + w.v : '< ' + w.v)));
      });
      vEl.innerHTML = '';
      vEl.appendChild(panelTitle(ctx, verdict != null ? 'Weighed!' : 'What does the parcel weigh?'));
      if (verdict != null) { vEl.appendChild(ctx.h('div.bal-note', { html: ctx.md('The parcel weighs **' + verdict + ' ' + unit + '**.') })); return; }
      if (log.length) vEl.appendChild(ctx.h('div.bal-note', a === b ? 'Only one weight fits now.' : 'Still possible: ' + a + ' to ' + b + ' ' + unit + '.'));
      vEl.appendChild(ctx.h('div.bal-row', guessIn, ctx.h('span.muted', unit), ctx.h('button.btn.gold', { type: 'button', onclick: () => declare() }, 'That is its weight')));
    }

    // which pan each weight should be on to make v against the load
    function closest(v) {
      const cur = ws.map((val, i) => { const o = wb.get('w' + i); const pn = o.data.pan; return pn == null ? 0 : pn === loadSide ? -1 : 1; });
      const opts = pans === 2 ? [1, -1, 0] : [1, 0];
      let best = null;
      const rec = (i, s, a) => {
        if (i === ws.length) {
          if (s !== v) return;
          const ch = a.reduce((c, x, j) => c + (x !== cur[j] ? 1 : 0), 0), used = a.filter(Boolean).length;
          if (!best || ch < best.ch || (ch === best.ch && used < best.used)) best = { ch, used, a: a.slice() };
          return;
        }
        for (const o of opts) { a.push(o); rec(i + 1, s + o * ws[i], a); a.pop(); }
      };
      rec(0, 0, []);
      return best && { a: best.a, cur };
    }
    const sideOf = (x) => (x === 0 ? null : x > 0 ? (loadSide === 'L' ? 'R' : 'L') : loadSide);
    function applyPlan(a, done) {
      const list = [], to = [];
      ws.forEach((v, i) => { const o = wb.get('w' + i); const want = sideOf(a[i]); if (o.data.pan !== want) { o.data.pan = want; o.data.po = nextPo() + i; } });
      // targets: the packed places on the level pans, or home
      const th = find ? 0 : bal.theta;
      ['L', 'R'].forEach((side) => {
        const items = (side === loadSide ? [load] : []).concat(onPan(side));
        const pc = bal.pan(side === 'L' ? -1 : 1, th);
        const pos = packPan(items.map((o) => (o === load ? LOAD : weightSize(o.data.v))), pc[0], pc[1]);
        items.forEach((o, i) => { if (o !== load) { list.push(o); to.push(pos[i]); } });
      });
      weights().filter((o) => !o.data.pan).forEach((o) => { list.push(o); to.push(home[+o.id.slice(1)]); });
      busy = true;
      glide(wb, clock, list, to, 520, () => { busy = false; done(); });
    }
    const flashW = (idx) => idx.forEach((i) => { const o = wb.get('w' + i); if (o && o.el) { const el = o.el; el.classList.add('bal-hintL'); setTimeout(() => el.classList.remove('bal-hintL'), 2800); } });
    const planText = (a) => {
      const opp = [], same = [];
      a.forEach((x, i) => { if (x > 0) opp.push(ws[i]); if (x < 0) same.push(ws[i]); });
      return (opp.length ? opp.join(' + ') + ' ' + unit + ' against the ' + (find ? 'parcel' : 'load') : '') + (same.length ? (opp.length ? ', and ' : '') + same.join(' + ') + ' ' + unit + ' beside it' : '');
    };

    layoutPans(0);
    draw();
    if (!find) { bal.lock(false); bal.setAngle(liveAngle()); }

    return {
      noMoves: true,
      checkLabel: find ? null : 'Check',
      check() {
        if (find) return verdict != null ? { solved: true, msg: 'The parcel weighs ' + verdict + ' ' + unit + '.' } : { solved: false, msg: 'Weigh, then say what the parcel weighs.' };
        const df = diff();
        if (df === 0) return { solved: true, msg: 'Balanced: ' + planText(ws.map((v, i) => { const pn = wb.get('w' + i).data.pan; return pn == null ? 0 : pn === loadSide ? -1 : 1; })) + '.' };
        return { solved: false, msg: 'Not balanced yet: the ' + (df > 0 ? (loadSide === 'L' ? 'weights are' : 'load is') : (loadSide === 'L' ? 'load is' : 'weights are')) + ' ' + Math.abs(df) + ' ' + unit + ' too heavy.' };
      },
      hint() {
        if (find) {
          if (verdict != null) return 'Solved.';
          const [a, b] = range(), kl = d.k - log.length;
          if (a === b) return 'Only ' + a + ' ' + unit + ' fits every weighing. Say so in the panel.';
          if (!planner.solv(a, b, kl)) return 'The parcel is between ' + a + ' and ' + b + ' ' + unit + ', and with ' + C.plural(kl, 'weighing') + ' left that is too wide to be sure. Undo and split more evenly.';
          const v = planner.step(a, b, kl), pl = closest(v);
          return { text: 'The parcel is between ' + a + ' and ' + b + ' ' + unit + '. Compare it with **' + v + ' ' + unit + '**: ' + planText(pl.a) + '. Too light, too heavy or just right — each leaves few enough possibilities.', show() { flashW(pl.a.map((x, i) => (x ? i : -1)).filter((i) => i >= 0)); } };
        }
        const pl = closest(d.load);
        if (!pl) return 'This load cannot be balanced.';
        const i = pl.a.findIndex((x, j) => x !== pl.cur[j]);
        if (i < 0) return 'It already balances — press Check.';
        const want = pl.a[i], v = ws[i];
        const where = want === 0 ? 'Take the ' + v + ' ' + unit + ' weight off the scale.' : want > 0 ? 'The ' + v + ' ' + unit + ' weight goes on the pan *opposite* the load.' : 'The ' + v + ' ' + unit + ' weight goes on the pan *with* the load — a weight beside the load takes away.';
        return { text: where, show() { flashW([i]); } };
      },
      solve() {
        clock.stop(); bal.stop(); busy = false;
        if (!find) {
          const pl = closest(d.load);
          applyPlan(pl.a, () => { layoutPans(bal.theta); retilt(); clock.later(() => ctx.changed('solve'), 900); });
          return;
        }
        log = []; show = null; verdict = null;
        bal.setAngle(0); bal.lock(true);
        const step = () => {
          const [a, b] = range(), kl = d.k - log.length;
          if (a === b || kl <= 0) { verdict = a; draw(); ctx.say('The parcel weighs ' + a + ' ' + unit + '.', 'good'); ctx.changed('solve'); return; }
          const v = planner.step(a, b, kl), pl = closest(v);
          applyPlan(pl.a, () => { layoutPans(0); weigh(() => clock.later(() => { show = null; bal.setAngle(0); bal.lock(true); layoutPans(0); step(); }, 500)); });
        };
        draw();
        clock.later(step, 300);
      },
      explain() {
        if (find) return 'Each weighing splits the possible weights three ways: lighter than the weights, equal, heavier. The "equal" branch is a single weight, so with k weighings left you can handle 2 × (what k − 1 handle) + 1 weights: 1, 3, 7, 15, 31, 63 … Aim each comparison at the middle of what is still possible.';
        const pl = closest(d.load);
        return pl ? 'One way: ' + planText(pl.a) + '. A weight on the same pan as the load counts against the weights on the other pan — with both pans allowed, each weight can add, subtract or stay out.' : '';
      },
      getState() { return find ? { log: C.clone(log), show, verdict } : {}; },
      setState(s) {
        clock.stop(); bal.stop(); busy = false;
        if (find) {
          log = C.clone(s.log || []); show = s.show == null ? null : s.show; verdict = s.verdict == null ? null : s.verdict;
          bal.setAngle(show != null ? -show * TILT : 0); bal.lock(show == null);
        } else { bal.lock(false); bal.setAngle(liveAngle()); }
        layoutPans(bal.theta);
        draw();
      },
      key(ev) {
        if (ev.type !== 'keydown' || !find) return false;
        if (ev.key === 'w' || ev.key === 'W') { weigh(); return true; }
        return false;
      },
      destroy() { clock.stop(); bal.stop(); }
    };
  }

  /* ================= choose the weights (Bachet) ================= */

  function mountDesign(ctx, p, d) {
    const wb = ctx.wb, S = ctx.s, count = d.count, pans = d.pans || 2, step = d.step || 1, unit = d.unit || 'kg';
    const clock = makeClock();
    const board = wb.layer('board');
    const bal = makeBalance(ctx, board);
    const items = S('g', { class: 'bal-items' }, board);
    const fixed = (d.fixed || []).slice();
    let vals = new Array(count).fill(0);
    fixed.forEach((v, i) => { vals[i] = v; });
    const locked = (i) => i < fixed.length;
    let shown = step, sel = -1, buf = '', bufT = 0;

    // the weight slots
    const SLOT = 5.2;
    const sx = (i) => (i - (count - 1) / 2) * SLOT;
    const slots = [];
    for (let i = 0; i < count; i++) {
      const g = S('g', { class: 'dz-slot' + (locked(i) ? ' fixed' : '') }, board);
      S('rect', { x: sx(i) - 2.4, y: 17.9, width: 4.8, height: 5.6, rx: 0.7, class: 'dz-bg', 'data-key': 'slot' + i }, g);
      const body = S('g', null, g);
      const up = S('g', { class: 'spr-step' }, g);
      S('circle', { cx: sx(i), cy: 16.7, r: 0.8 }, up);
      S('text', { x: sx(i), y: 17.1, 'text-anchor': 'middle', text: '+' }, up);
      const dn = S('g', { class: 'spr-step' }, g);
      S('circle', { cx: sx(i), cy: 24.8, r: 0.8 }, dn);
      S('text', { x: sx(i), y: 25.2, 'text-anchor': 'middle', text: '−' }, dn);
      if (!locked(i)) {
        up.addEventListener('pointerdown', (e) => { e.stopPropagation(); bump(i, step); });
        dn.addEventListener('pointerdown', (e) => { e.stopPropagation(); bump(i, -step); });
        g.addEventListener('pointerdown', (e) => { if (wb.mode !== 'select') return; e.stopPropagation(); sel = i; buf = ''; drawSlots(); });
      } else { up.style.display = 'none'; dn.style.display = 'none'; }
      slots.push({ g, body });
    }
    // the loads to weigh
    const loads = [];
    for (let v = step; v <= d.max; v += step) loads.push(v);
    const perRow = loads.length <= 40 ? 10 : 20, CW = 1.75;
    const gx = (j) => ((j % perRow) - (perRow - 1) / 2) * CW, gy = (j) => 27.9 + Math.floor(j / perRow) * CW;
    S('text', { x: 0, y: 26.6, 'text-anchor': 'middle', class: 'bal-cap', text: 'Loads to weigh — lit when your weights can weigh them' }, board);
    const cells = loads.map((v, j) => {
      const g = S('g', { class: 'dz-cell' }, board);
      S('rect', { x: gx(j) - CW / 2 + 0.08, y: gy(j) - CW / 2 + 0.08, width: CW - 0.16, height: CW - 0.16, rx: 0.3 }, g);
      S('text', { x: gx(j), y: gy(j) + 0.3, 'text-anchor': 'middle', text: String(v), 'font-size': v >= 100 ? 0.62 : 0.78 }, g);
      g.addEventListener('pointerdown', (e) => { if (wb.mode !== 'select') return; e.stopPropagation(); showLoad(v); });
      return g;
    });
    const bottom = gy(loads.length - 1) + 1.4;
    const W = Math.max(17, count * SLOT / 2 + 1, perRow * CW / 2 + 1);
    wb.setBounds({ x0: -W, y0: -9, x1: W, y1: bottom }, 0.04);
    const caption = S('text', { x: 0, y: -7.3, class: 'bal-left', 'text-anchor': 'middle' }, board);

    function drawItems(th) {
      items.innerHTML = '';
      const ws = vals.filter((v) => v > 0);
      const a = arrangement(ws, pans, shown);
      const left = [{ load: true }], right = [];
      if (a) a.forEach((x, i) => { if (x > 0) right.push({ v: ws[i] }); else if (x < 0) left.push({ v: ws[i] }); });
      [[left, -1], [right, 1]].forEach(([list, side]) => {
        const pc = bal.pan(side, th);
        const pos = packPan(list.map((it) => (it.load ? LOAD : weightSize(it.v))), pc[0], pc[1]);
        list.forEach((it, i) => {
          const g = S('g', { transform: 'translate(' + f2(pos[i][0]) + ' ' + f2(pos[i][1]) + ')' }, items);
          if (it.load) g.innerHTML = loadSVG(shown + ' ' + unit, false);
          else { S('path', { d: weightPath(it.v), class: 'bal-weight', fill: '#c99a3c' }, g); S('text', { y: f2(weightSize(it.v).h * 0.2), 'font-size': f2(Math.min(1.1, 0.5 + weightSize(it.v).w * 0.2)), 'text-anchor': 'middle', class: 'bal-weight-n', text: String(it.v) }, g); }
        });
      });
      return a;
    }
    bal.onAngle = (t) => drawItems(t);
    function drawSlots() {
      slots.forEach((sl, i) => {
        sl.body.innerHTML = '';
        const v = vals[i];
        sl.g.classList.toggle('sel', sel === i);
        if (v > 0) {
          const z = weightSize(v), g = S('g', { transform: 'translate(' + sx(i) + ' ' + f2(23.1 - z.h / 2) + ')' }, sl.body);
          S('path', { d: weightPath(v), class: 'bal-weight', fill: '#c99a3c' }, g);
          S('text', { y: f2(z.h * 0.2), 'font-size': f2(Math.min(1.1, 0.5 + z.w * 0.2)), 'text-anchor': 'middle', class: 'bal-weight-n', text: String(v) }, g);
        } else {
          S('path', { d: 'M' + (sx(i) - 1.4) + ' 22.9h2.8l-.5-3.2h-1.8z', class: 'dz-empty' }, sl.body);
          S('text', { x: sx(i), y: 22.1, 'text-anchor': 'middle', class: 'dz-q', text: '?' }, sl.body);
        }
      });
    }
    function draw(swing) {
      drawSlots();
      const cov = coverage(vals.filter((v) => v > 0), d);
      cells.forEach((g, j) => { g.classList.toggle('ok', cov[j]); g.classList.toggle('cur', loads[j] === shown); });
      const got = cov.filter(Boolean).length;
      ctx.stat('Loads weighed', got + ' / ' + loads.length);
      const a = arrangement(vals.filter((v) => v > 0), pans, shown);
      caption.textContent = a ? shown + ' ' + unit + ': balanced' : shown + ' ' + unit + ': cannot be weighed';
      caption.classList.toggle('bad', !a);
      const target = a ? 0 : -TILT;
      if (swing) { bal.lock(false); bal.swingTo(target, 900); } else bal.setAngle(target);
    }
    function setVal(i, v, why) {
      if (locked(i)) { ctx.toast('That weight is given.'); return; }
      v = Math.max(0, Math.min(999, v | 0));
      if (v % step) v = Math.round(v / step) * step;
      if (d.cap && v > d.cap) { ctx.say('No weight may be heavier than ' + d.cap + ' ' + unit + ' in this puzzle.', 'warn'); v = d.cap; }
      if (vals[i] === v) return;
      vals[i] = v;
      draw(true);
      ctx.changed(why || 'value');
    }
    function bump(i, dv) { sel = i; buf = ''; setVal(i, Math.max(0, vals[i] + dv)); }
    function typeDigit(ch) {
      if (sel < 0) { sel = vals.findIndex((v, i) => !locked(i) && !v); if (sel < 0) sel = fixed.length < count ? fixed.length : -1; if (sel < 0) return; }
      const now = Date.now();
      buf = (now - bufT < 1500 && buf.length < 3 ? buf : '') + ch;
      bufT = now;
      setVal(sel, parseInt(buf, 10));
    }
    function backspace() { if (sel < 0) return; buf = String(vals[sel] || '').slice(0, -1); bufT = Date.now(); setVal(sel, parseInt(buf || '0', 10)); }
    function nextSlot(dir) { const free = []; for (let i = 0; i < count; i++) if (!locked(i)) free.push(i); if (!free.length) return; const j = free.indexOf(sel); sel = free[(j + (dir || 1) + free.length) % free.length]; buf = ''; drawSlots(); }
    function showLoad(v) { shown = v; draw(true); }

    // a number pad in the panel, for fingers
    const padEl = ctx.h('div.dz-pad');
    '1234567890'.split('').forEach((ch) => padEl.appendChild(ctx.h('button.bal-chip', { type: 'button', onclick: () => typeDigit(ch) }, ch)));
    padEl.appendChild(ctx.h('button.bal-chip.wide', { type: 'button', onclick: backspace }, '⌫'));
    padEl.appendChild(ctx.h('button.bal-chip.wide', { type: 'button', onclick: () => nextSlot(1) }, 'next ›'));
    ctx.panel.append(panelTitle(ctx, 'Set the selected weight'), padEl);

    draw(false);
    const firstMissing = () => { const cov = coverage(vals.filter((v) => v > 0), d); const j = cov.indexOf(false); return j < 0 ? null : loads[j]; };

    return {
      noMoves: true,
      check() {
        const cov = coverage(vals.filter((v) => v > 0), d);
        if (fixed.some((f) => !vals.includes(f))) return { solved: false, msg: 'The given weight must stay.' };
        if (cov.every(Boolean)) return { solved: true, msg: 'Weights ' + vals.slice().sort((a, b) => a - b).join(', ') + ' weigh every load' + (step > 1 ? ' in steps of ' + step : '') + ' up to ' + d.max + '.' };
        const m = firstMissing();
        return { solved: false, msg: cov.filter(Boolean).length + ' of ' + loads.length + ' loads can be weighed; ' + m + ' ' + unit + ' cannot.' };
      },
      hint() {
        const cur = vals.filter((v) => v > 0).sort((a, b) => a - b);
        const m = firstMissing();
        if (m == null) return 'Every load can be weighed already!';
        const minus = (all, part) => { const rest = all.slice(); for (const v of part) { const j = rest.indexOf(v); if (j < 0) return null; rest.splice(j, 1); } return rest; };
        let found = minus(d.sol, cur) ? d.sol.slice().sort((a, b) => a - b) : null;
        let complete = true;
        if (!found) { const r = designSearch(d, cur, 250000); found = r.sol; complete = r.complete; }
        if (found) {
          const rest = minus(found, cur).sort((a, b) => a - b);
          if (cur.length <= fixed.length) return 'Start small. The lightest load, ' + step + ' ' + unit + ', must be weighed too: a ' + rest[0] + ' ' + unit + ' weight is a good beginning' + (fixed.length ? ' beside the given one' : '') + '.';
          return 'Keep ' + cur.join(', ') + '. The first load you cannot weigh yet is ' + m + ' ' + unit + '. A weight that fits: **' + rest[0] + ' ' + unit + '** — can you see why?';
        }
        if (!complete) return 'The first load you cannot weigh yet is ' + m + ' ' + unit + '. Build up from the lightest weight: each new one as big as it can be without leaving a gap.';
        // which weight spoils it?
        for (let i = fixed.length; i < count; i++) {
          if (!vals[i]) continue;
          const without = vals.filter((v, j) => j !== i && v > 0);
          if (designSearch(d, without, 120000).sol) return 'The ' + vals[i] + ' ' + unit + ' weight spoils it: no set with it reaches every load up to ' + d.max + '. The first load you cannot weigh now is ' + m + ' ' + unit + '.';
        }
        return 'These weights cannot be completed. The first load you cannot weigh is ' + m + ' ' + unit + ' — start again from the lightest weight.';
      },
      solve() {
        clock.stop();
        const want = d.sol.slice();
        const free = [];
        vals = fixed.slice().concat(new Array(count - fixed.length).fill(0));
        fixed.forEach((f) => { const j = want.indexOf(f); if (j >= 0) want.splice(j, 1); });
        for (let i = fixed.length; i < count; i++) free.push(i);
        let k = 0;
        const put = () => {
          if (k >= free.length) { shown = d.max; draw(true); ctx.changed('solve'); return; }
          vals[free[k]] = want[k]; k++; sel = -1;
          draw(false);
          clock.later(put, 220);
        };
        draw(false);
        clock.later(put, 200);
      },
      explain() {
        const s = d.sol.slice().sort((a, b) => a - b);
        if (pans === 2) return 'With weights allowed on both pans, each weight can be *with* the load, *against* it, or *off* — three choices, so the weights ' + s.join(', ') + ' behave like the digits of balanced ternary (−1, 0, +1). Choosing each new weight as large as possible — twice everything so far, plus one — gives 1, 3, 9, 27 …, and n weights reach (3<sup>n</sup> − 1)/2.';
        return 'On one pan each weight is either used or not — a binary digit — so doubling gives 1, 2, 4, 8 …, and n weights reach 2<sup>n</sup> − 1. Here: ' + s.join(', ') + '.';
      },
      getState() { return { vals: vals.slice(), shown }; },
      setState(s) { clock.stop(); vals = (s.vals || vals).slice(); shown = s.shown || step; draw(false); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (/^[0-9]$/.test(ev.key)) { typeDigit(ev.key); return true; }
        if (ev.key === 'Backspace' && sel >= 0) { backspace(); return true; }
        if (ev.key === 'Tab') { nextSlot(ev.shiftKey ? -1 : 1); return true; }
        if (ev.key === 'ArrowUp' && sel >= 0) { bump(sel, step); return true; }
        if (ev.key === 'ArrowDown' && sel >= 0) { bump(sel, -step); return true; }
        if (ev.key === 'Escape' && sel >= 0) { sel = -1; drawSlots(); return false; }
        return false;
      },
      destroy() { clock.stop(); bal.stop(); }
    };
  }

  /* ================= questions ================= */

  function coinRowSVG(n, y, labels) {
    let s = '';
    const per = Math.min(n, 12), sp = 2.4;
    for (let i = 0; i < n; i++) {
      const r = Math.floor(i / per), c = i % per, inRow = Math.min(per, n - r * per);
      const cx = (c - (inRow - 1) / 2) * sp, cy = y + r * sp;
      s += '<circle cx="' + f2(cx) + '" cy="' + f2(cy) + '" r="1" fill="#f2c14e" stroke="#8a6414" stroke-width=".12"/>';
      if (labels !== false) s += '<text x="' + f2(cx) + '" y="' + f2(cy + 0.36) + '" text-anchor="middle" font-size="' + (i >= 9 ? 0.85 : 1) + '" font-weight="800" fill="#5a3d05">' + (i + 1) + '</text>';
    }
    return s;
  }
  function figureSVG(fig) {
    if (!fig) return { svg: balanceSVG(0, [], []), box: [-17, -3, 34, 19.5] };
    if (fig.svg) return { svg: fig.svg, box: [0, 0, fig.w || 40, fig.h || 24] };
    if (fig.bags) {
      let s = '';
      const n = fig.bags, sp = 3.9;
      for (let b = 0; b < n; b++) {
        const x = (b - (n - 1) / 2) * sp;
        s += '<path d="' + sackPath(x, 2, 3.1, 3.8) + '" fill="#c9a36a" stroke="#7a5a2a" stroke-width=".14"/><circle cx="' + f2(x) + '" cy="2.8" r=".95" fill="hsl(' + bagHue(b, n) + ' 70% 62%)"/><text x="' + f2(x) + '" y="3.18" text-anchor="middle" font-size="1.05" font-weight="800" fill="#2a1a05">' + (b + 1) + '</text>';
      }
      const w = n * sp / 2 + 1;
      return { svg: s, box: [-w, -1.5, 2 * w, 7] };
    }
    if (fig.weights) {
      let s = '', x = 0;
      const tot = fig.weights.reduce((a, v) => a + weightSize(v).w + 1, -1);
      x = -tot / 2;
      fig.weights.forEach((v) => {
        const z = weightSize(v);
        s += '<g transform="translate(' + f2(x + z.w / 2) + ' ' + f2(4 - z.h / 2) + ')"><path d="' + weightPath(v) + '" fill="#c99a3c" stroke="#6d5320" stroke-width=".12"/><text y="' + f2(z.h * 0.2) + '" text-anchor="middle" font-size="' + f2(Math.min(1.1, 0.5 + z.w * 0.2)) + '" font-weight="800" fill="#3a2605">' + (v === 0 ? '?' : v) + '</text></g>';
        x += z.w + 1;
      });
      return { svg: s, box: [-tot / 2 - 1.5, -1, tot + 3, 6.5] };
    }
    if (fig.coins) {
      const rows = Math.ceil(fig.coins / 12);
      return { svg: coinRowSVG(fig.coins, 1.5, fig.labels), box: [-15, -0.5, 30, rows * 2.4 + 2] };
    }
    const b = fig.balance || {};
    return { svg: balanceSVG(-(b.tilt || 0) * TILT, b.L || [], b.R || []), box: [-17, -3, 34, 19.5] };
  }

  function mountAsk(ctx, p, d) {
    const wb = ctx.wb;
    const fg = figureSVG(d.fig);
    const g = ctx.s('g', { class: 'bal-askfig' }, wb.layer('board'));
    const [x0, y0, w, h] = fg.box;
    ctx.s('rect', { x: x0 - 1, y: y0 - 1, width: w + 2, height: h + 2, rx: 1.2, class: 'bal-figbg' }, g);
    const inner = ctx.s('g', null, g);
    inner.innerHTML = fg.svg;
    wb.setBounds({ x0: x0 - 2, y0: y0 - 2, x1: x0 + w + 2, y1: y0 + h + 2 }, 0.06);
    const a = d.answer;
    const box = ctx.answer({
      kind: a.choice != null ? 'choice' : a.nums ? 'text' : 'number',
      choices: a.choices, unit: a.unit, label: d.ask || null,
      placeholder: a.nums ? 'Numbers, separated by commas' : 'A number',
      check: (v) => checkAsk(d, v)
    });
    return {
      noMoves: true,
      solve() { box.feedback('The answer: <b>' + C.esc(a.num != null ? a.num + (a.unit ? ' ' + a.unit : '') : a.nums ? a.nums.join(', ') : a.choices[a.choice]) + '</b>', 'good'); }
    };
  }

  /* ================= the engine ================= */

  C.engine({
    id: 'balance',
    name: 'Scales and weights',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    noMoves: true,
    about: '**Balance:** drag coins or weights onto a pan (or box-select several and press ◀ ▶; double-click a coin to move it along). **Weigh** (or W) releases the catch and the beam swings.\n\n' +
      '**False coins:** the scale is a sly opponent — it keeps every possibility that fits and answers the way that helps you least, so only a plan that covers every answer works. When sure, pick the coin in the panel and accuse it. The **paint** tool, with named colours ("maybe heavy", "maybe light", "good"), keeps track of what you have learned.\n\n' +
      '**Spring scale:** click a sack (or +) to put one of its coins on the scale. **Weights:** a weight beside the load counts against it; type into a selected weight, or use + and −.',
    verify,
    generate(rng, level, fam) {
      return fam && fam.id === 'weights' ? genWeights(rng, level) : genCoins(rng, level);
    },
    answerKey(p) { return p.data && p.data.kind === 'ask' ? askKey(p.data) : null; },
    mount(ctx, p) {
      const d = p.data;
      if (d.kind === 'coins') return mountCoins(ctx, p, d);
      if (d.kind === 'bags') return mountBags(ctx, p, d);
      if (d.kind === 'design') return mountDesign(ctx, p, d);
      if (d.kind === 'place' || d.kind === 'find') return mountWeights(ctx, p, d);
      return mountAsk(ctx, p, d);
    },
    thumb(p) {
      const d = p.data || {};
      const txt = (s, y, size, fill) => '<text x="0" y="' + y + '" text-anchor="middle" font-size="' + size + '" font-weight="800" fill="' + (fill || 'var(--gold)') + '" font-family="Segoe UI, system-ui, sans-serif">' + C.esc(s) + '</text>';
      if (d.kind === 'coins') {
        const nl = Math.min(4, Math.ceil(d.n / 3)), L = [], R = [];
        for (let i = 0; i < nl; i++) { L.push(String(i + 1)); R.push(String(i + 1 + nl)); }
        return '<svg viewBox="-17 -6 34 23.5" preserveAspectRatio="xMidYMid meet">' + balanceSVG(0.12, L, R) + txt(d.n + ' coins · ' + d.k + '×', -2.2, 3.4) + '</svg>';
      }
      if (d.kind === 'bags') {
        const f = figureSVG({ bags: Math.min(d.bags, 8) });
        return '<svg viewBox="' + [f.box[0] - 1, -7, f.box[2] + 2, 15].join(' ') + '" preserveAspectRatio="xMidYMid meet">' + f.svg + txt(d.many ? 'which bags?' : 'which bag?', -2.5, 2.6) + '</svg>';
      }
      if (d.kind === 'design') {
        const f = figureSVG({ weights: new Array(d.count).fill(0) });
        return '<svg viewBox="' + [Math.min(-12, f.box[0]), -8, Math.max(24, f.box[2]), 16].join(' ') + '" preserveAspectRatio="xMidYMid meet">' + f.svg + txt((d.step || 1) + '…' + d.max, -2.8, 3.6) + '</svg>';
      }
      if (d.kind === 'place' || d.kind === 'find') {
        const lab = d.kind === 'find' ? '?' : String(d.load);
        return '<svg viewBox="-17 -4 34 20.5" preserveAspectRatio="xMidYMid meet">' + balanceSVG(-0.18, [], []) +
          '<g transform="translate(' + f2(-BEAM * Math.cos(-0.18)) + ' ' + f2(-BEAM * Math.sin(-0.18) + STRING - 2) + ')">' + loadSVG(lab + (d.kind === 'find' ? '' : ' ' + (d.unit || 'kg')), d.kind === 'find') + '</g></svg>';
      }
      const f = figureSVG(d.fig);
      return '<svg viewBox="' + [f.box[0] - 1, f.box[1] - 1, f.box[2] + 2, f.box[3] + 2].join(' ') + '" preserveAspectRatio="xMidYMid meet">' + f.svg + '</svg>';
    }
  });

  C.css('balance', `
    .bal-dial-arc { fill: none; stroke: var(--ink-2); stroke-width: .12; opacity: .5; }
    .bal-dial-ticks { stroke: var(--ink-2); stroke-width: .14; opacity: .6; }
    .bal-base { fill: var(--wood-dark); }
    .bal-base2 { fill: var(--wood); opacity: .8; }
    .bal-post { fill: #b08a3a; }
    .bal-knob { fill: #e3c46e; stroke: #6d5320; stroke-width: .1; }
    .bal-fulcrum { fill: #8a6a26; }
    .bal-arrest { fill: #7d8597; transition: transform .35s; }
    .bal-bar { fill: #c9a14a; stroke: #6d5320; stroke-width: .12; stroke-linejoin: round; }
    .bal-ring { fill: #e3c46e; stroke: #6d5320; stroke-width: .1; }
    .bal-hub { fill: #e3c46e; stroke: #6d5320; stroke-width: .12; }
    .bal-needle { stroke: var(--red); stroke-width: .22; stroke-linecap: round; }
    .bal-string { stroke: var(--ink-2); stroke-width: .1; fill: none; opacity: .85; }
    .bal-pan { fill: #c9a14a; stroke: #6d5320; stroke-width: .12; transition: filter .2s; }
    .bal-pan.hot { fill: #e8c768; filter: drop-shadow(0 0 .5px var(--gold)); }
    .bal-table { fill: var(--board-2); stroke: var(--line); stroke-width: .08; }
    .bal-shelf { fill: var(--wood-dark); opacity: .7; }
    .bal-saucer { fill: var(--metal); opacity: .35; stroke: var(--ink-2); stroke-width: .08; }
    .bal-cap { font: 600 .8px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .bal-left { font: 700 1.2px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .02px; }
    .bal-left.bad { fill: var(--red); }
    .bal-btn { cursor: pointer; }
    .bal-btn rect { fill: var(--accent); stroke: rgba(0,0,0,.25); stroke-width: .08; }
    .bal-btn:hover rect { fill: var(--accent-2); }
    .bal-btn text { font: 700 1.2px "Segoe UI", system-ui, sans-serif; fill: #fff; pointer-events: none; }
    .bal-btn.off { opacity: .35; pointer-events: none; }
    .bal-coin { stroke: #8a6414; stroke-width: .12; }
    .bal-coin-rim { fill: none; stroke: rgba(90, 61, 5, .45); stroke-width: .09; stroke-dasharray: .12 .1; }
    .bal-coin-n { font-weight: 800; fill: #4a3204; font-family: "Segoe UI", system-ui, sans-serif; pointer-events: none; }
    .k-bcoin { cursor: grab; }
    .k-bcoin.bal-false .bal-coin { stroke: var(--red); stroke-width: .3; }
    .k-bcoin.bal-hintL .bal-coin, .k-bweight.bal-hintL .bal-weight { stroke: var(--teal); stroke-width: .35; filter: drop-shadow(0 0 .4px var(--teal)); }
    .k-bcoin.bal-hintR .bal-coin { stroke: var(--pink); stroke-width: .35; filter: drop-shadow(0 0 .4px var(--pink)); }
    .bal-tag { font: 800 .9px "Segoe UI", system-ui, sans-serif; fill: var(--red); }
    .bal-weight { stroke: #6d5320; stroke-width: .12; stroke-linejoin: round; }
    .bal-weight-n { font-weight: 800; fill: #3a2605; font-family: "Segoe UI", system-ui, sans-serif; pointer-events: none; }
    .bal-sack { fill: #c9a36a; stroke: #7a5a2a; stroke-width: .14; }
    .bal-parcel { fill: #b8865a; stroke: #6a4722; stroke-width: .14; }
    .bal-cord { stroke: #f1d9a6; stroke-width: .18; fill: none; }
    .bal-load-n { font: 800 1px "Segoe UI", system-ui, sans-serif; fill: #2a1a05; }
    .bal-figbg { fill: var(--board); stroke: var(--line); stroke-width: .08; }
    .bal-bracket { fill: var(--wood-dark); }
    .spr-plate { fill: #c9a14a; stroke: #6d5320; stroke-width: .12; }
    .spr-ticks { stroke: #5a4418; stroke-width: .1; }
    .spr-coil { fill: none; stroke: #6f7686; stroke-width: .2; stroke-linejoin: round; }
    .spr-pointer { fill: var(--red); }
    .spr-coin { stroke: rgba(0,0,0,.35); stroke-width: .06; }
    .spr-card rect { fill: var(--panel-2); stroke: var(--line); stroke-width: .08; }
    .spr-read { font: 800 2px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .spr-bag { cursor: pointer; }
    .spr-sack { fill: #c9a36a; stroke: #7a5a2a; stroke-width: .14; transition: filter .2s; }
    .spr-bag:hover .spr-sack { filter: brightness(1.08); }
    .spr-bag.named .spr-sack { stroke: var(--red); stroke-width: .3; }
    .spr-tie { fill: none; stroke: #7a5a2a; stroke-width: .2; }
    .spr-badge { stroke: rgba(0,0,0,.3); stroke-width: .08; }
    .spr-num { font: 800 1.05px "Segoe UI", system-ui, sans-serif; fill: #2a1a05; pointer-events: none; }
    .spr-count { font: 700 .95px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .spr-bag.hot .spr-count { fill: var(--gold); }
    .spr-step { cursor: pointer; }
    .spr-step circle { fill: var(--panel-2); stroke: var(--line); stroke-width: .08; }
    .spr-step:hover circle { stroke: var(--accent); }
    .spr-step text { font: 800 1.1px "Segoe UI", system-ui, sans-serif; fill: var(--text); pointer-events: none; }
    .dz-slot { cursor: pointer; }
    .dz-bg { fill: var(--board-2); stroke: var(--line); stroke-width: .08; }
    .dz-slot.sel .dz-bg { stroke: var(--accent); stroke-width: .22; }
    .dz-slot.fixed .dz-bg { stroke-dasharray: .3 .2; }
    .dz-empty { fill: none; stroke: var(--ink-2); stroke-width: .12; stroke-dasharray: .25 .18; }
    .dz-q { font: 800 1.2px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .dz-cell { cursor: pointer; }
    .dz-cell rect { fill: var(--cell); stroke: var(--line); stroke-width: .06; transition: fill .25s; }
    .dz-cell text { font-weight: 700; fill: var(--faint); font-family: "Segoe UI", system-ui, sans-serif; pointer-events: none; }
    .dz-cell.ok rect { fill: rgba(78, 203, 141, .28); stroke: var(--green); }
    .dz-cell.ok text { fill: var(--text); }
    .dz-cell.cur rect { stroke: var(--gold); stroke-width: .18; }
    .bal-ptitle { font-weight: 700; font-size: .85rem; margin: 6px 0 4px; width: 100%; }
    .bal-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; width: 100%; }
    .bal-opt { font-size: .78rem; color: var(--muted); display: flex; gap: 6px; align-items: center; }
    .bal-log, .bal-verdict { width: 100%; }
    .bal-note { font-size: .8rem; color: var(--muted); margin: 2px 0 6px; }
    .bal-entry { display: flex; flex-wrap: wrap; align-items: center; gap: 5px; font-size: .8rem; padding: 3px 0; border-bottom: 1px solid var(--line); }
    .bal-entry small { color: var(--muted); margin-left: auto; }
    .bal-side { display: inline-flex; flex-wrap: wrap; gap: 2px; }
    .bal-mini { font-style: normal; display: inline-grid; place-items: center; min-width: 1.35em; height: 1.35em; padding: 0 2px; border-radius: 1em; background: #f2c14e; color: #4a3204; font-weight: 800; font-size: .72rem; }
    .bal-mini.good { background: #d3d9e6; }
    .bal-mini.wt { background: #c99a3c; color: #2a1a05; border-radius: 4px; }
    .bal-mini.parcel { background: #b8865a; color: #fff; border-radius: 4px; }
    .bal-vs { font-weight: 800; color: var(--gold); }
    .bal-chips, .dz-pad { display: flex; flex-wrap: wrap; gap: 4px; margin: 4px 0 8px; width: 100%; }
    .bal-chip { min-width: 2.2em; height: 2.1em; border-radius: 1.1em; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font-weight: 700; cursor: pointer; }
    .bal-chip.wide { padding: 0 .8em; }
    .bal-chip:hover { border-color: var(--accent); }
    .bal-chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
