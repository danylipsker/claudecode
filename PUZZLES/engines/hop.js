/* The Puzzle Cabinet · engines/hop.js
 *
 * One-row counter puzzles.
 *
 *   frogs  Frogs face right, toads face left. A counter slides forward into
 *          the empty square in front of it, or jumps forward over one counter
 *          (up to `jump` counters for leapers) into an empty square. Only
 *          forward. Swap the two sides.
 *   pairs  Coins, heads and tails, in a row with spare room. A move lifts `k`
 *          neighbouring coins together (two, for P. G. Tait's puzzle), keeping
 *          their order, and puts them down in `k` neighbouring empty places.
 *   piles  A row of single coins. A move jumps one single coin, left or right,
 *          over exactly `over` coins (a pile counts all its coins) onto the
 *          next single coin, making a pile of two. Piles never move again.
 *
 * data: {
 *   kind: 'frogs' | 'pairs' | 'piles'
 *   row:  'FFF_TTT'           frogs: F frog, T toad, _ empty
 *       | '__HTHTHT'          pairs: H heads, T tails, _ empty
 *   jump: 1                   frogs: how many counters a jump may clear
 *   goal: 'TTT_FFF'           frogs: the row to reach (default: the start reversed)
 *       | ['HHHTTT', ...]      pairs: the coins must stand together, with no gaps, in one of these orders
 *   k:    2                   pairs: how many coins move at once
 *   n: 8, over: 2             piles: how many coins; how many coins to jump over
 * }
 * p.par = the fewest moves (breadth-first search).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- the rules ---------- */

  function startOf(d) {
    if (d.kind === 'piles') return '1'.repeat(d.n);
    return d.row;
  }
  // every move from a position: [{ from, to, s }]
  function moves(d, s) {
    const out = [], L = s.length;
    if (d.kind === 'frogs') {
      const J = d.jump || 1;
      for (let i = 0; i < L; i++) {
        const c = s[i];
        if (c !== 'F' && c !== 'T') continue;
        const dir = c === 'F' ? 1 : -1;
        for (let k = 0; k <= J; k++) {
          const t = i + dir * (k + 1);
          if (t < 0 || t >= L) break;
          if (s[t] === '_') { out.push({ from: i, to: t, s: put(put(s, i, '_'), t, c) }); break; }
          // squares between must all be counters: keep going over this one
        }
      }
      return out;
    }
    if (d.kind === 'pairs') {
      const k = d.k || 2;
      for (let i = 0; i + k <= L; i++) {
        let full = true;
        for (let j = i; j < i + k; j++) if (s[j] === '_') { full = false; break; }
        if (!full) continue;
        const blk = s.slice(i, i + k), rest = s.slice(0, i) + '_'.repeat(k) + s.slice(i + k);
        for (let t = 0; t + k <= L; t++) {
          if (t + k > i && t < i + k) continue;      // not onto itself
          let empty = true;
          for (let j = t; j < t + k; j++) if (s[j] !== '_') { empty = false; break; }
          if (empty) out.push({ from: i, to: t, s: rest.slice(0, t) + blk + rest.slice(t + k) });
        }
      }
      return out;
    }
    // piles: heights as digits
    const over = d.over || 2;
    for (let i = 0; i < L; i++) {
      if (s[i] !== '1') continue;
      for (const dir of [-1, 1]) {
        let cnt = 0;
        for (let j = i + dir; j >= 0 && j < L; j += dir) {
          const h = +s[j];
          if (!h) continue;
          if (cnt === over) { if (h === 1) out.push({ from: i, to: j, s: put(put(s, i, '0'), j, '2') }); break; }
          cnt += h;
          if (cnt > over) break;
        }
      }
    }
    return out;
  }
  function put(s, i, c) { return s.slice(0, i) + c + s.slice(i + 1); }

  function goalRows(d) {
    if (d.kind === 'frogs') return [d.goal || d.row.split('').reverse().join('')];
    if (d.kind === 'pairs') return d.goal;
    return null;
  }
  function isGoal(d, s) {
    if (d.kind === 'frogs') return s === goalRows(d)[0];
    if (d.kind === 'pairs') {
      const a = s.indexOf(s.replace(/_/g, '').charAt(0) || 'x');
      const core = s.replace(/^_+|_+$/g, '');
      if (core.includes('_')) return false;
      return d.goal.includes(core) && a >= 0;
    }
    for (let i = 0; i < s.length; i++) if (s[i] === '1') return false;
    return true;
  }

  // breadth-first search: the fewest moves [{ from, to, s }] from s0 to the goal, or null
  function solve(d, s0, cap) {
    s0 = s0 || startOf(d);
    if (isGoal(d, s0)) return [];
    const prev = new Map([[s0, null]]);
    let frontier = [s0];
    while (frontier.length) {
      const next = [];
      for (const s of frontier) {
        for (const m of moves(d, s)) {
          if (prev.has(m.s)) continue;
          prev.set(m.s, { from: s, m });
          if (isGoal(d, m.s)) {
            const path = [];
            let cur = m.s;
            while (prev.get(cur)) { const e = prev.get(cur); path.unshift(e.m); cur = e.from; }
            return path;
          }
          next.push(m.s);
        }
      }
      frontier = next;
      if (cap && prev.size > cap) return undefined;
    }
    return null;
  }

  // how many positions the search may meet (an upper bound), to keep verify quick
  function sizeOf(d) {
    const s = startOf(d);
    if (d.kind === 'piles') return Math.pow(3, Math.min(20, s.length));
    const cnt = {};
    for (const c of s) cnt[c] = (cnt[c] || 0) + 1;
    let lg = lf(s.length);
    for (const c in cnt) lg -= lf(cnt[c]);
    return Math.exp(lg);
  }
  function lf(n) { let s = 0; for (let i = 2; i <= n; i++) s += Math.log(i); return s; }

  // replay [from, to, from, to, ...]; returns the final position or an error
  function replay(d, sol) {
    let s = startOf(d);
    for (let k = 0; k + 1 < sol.length; k += 2) {
      const m = moves(d, s).find((x) => x.from === sol[k] && x.to === sol[k + 1]);
      if (!m) return { ok: false, err: 'move ' + (k / 2 + 1) + ' (' + sol[k] + '→' + sol[k + 1] + ') is not legal' };
      s = m.s;
    }
    return { ok: true, s };
  }

  C.hopLogic = { startOf, moves, isGoal, solve, goalRows, sizeOf, replay };

  /* ---------- making puzzles (Endless, and tools/gen/hop.js) ---------- */

  const BANDS = {
    frogs: [null, [3, 9], [10, 16], [17, 24], [25, 35], [36, 60]],
    pairs: [null, [2, 3], [4, 4], [5, 5], [6, 6], [7, 8]]
  };
  function makeFrogs(rng, level) {
    const band = BANDS.frogs[level];
    for (let t = 0; t < 60; t++) {
      const n = rng.range(1, level + 2), m = rng.range(Math.max(1, n - 1), level + 2);
      const gaps = rng() < 0.7 ? 1 : 2, jump = rng() < 0.25 ? 2 : 1;
      let row = 'F'.repeat(n) + '_'.repeat(gaps) + 'T'.repeat(m);
      if (rng() < 0.3 && n + m >= 4) {
        // an extra empty square inside one of the groups
        const arr = row.split(''), i = rng.int(arr.length + 1);
        arr.splice(i, 0, '_');
        row = arr.join('');
      }
      const d = { kind: 'frogs', row };
      if (jump > 1) d.jump = jump;
      const path = solve(d, null, 200000);
      if (!path || path.length < band[0] || path.length > band[1]) continue;
      d.sol = [].concat.apply([], path.map((x) => [x.from, x.to]));
      return { d, par: path.length };
    }
    return null;
  }
  function perms(a) { if (a.length <= 1) return [a]; const out = []; a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach((q) => out.push([x].concat(q)))); return out; }
  // every way of standing the kinds in groups: HHHTTT, TTTHHH …
  function groupedAll(kinds, per) { return perms(kinds).map((q) => q.map((c) => c.repeat(per)).join('')); }
  function makePairs(rng, level) {
    const band = BANDS.pairs[level];
    for (let t = 0; t < 40; t++) {
      let d;
      if (rng() < 0.2) {
        const over = level >= 3 && rng() < 0.5 ? 4 : 2;
        const n = 2 * rng.range(over === 2 ? 4 : 6, 8);
        if (n / 2 < band[0] || n / 2 > band[1]) continue;
        d = { kind: 'piles', n, over };
      } else {
        const metal = rng() < 0.25, k = rng() < 0.3 ? 3 : 2;
        const kinds = metal ? ['G', 'S', 'C'] : ['H', 'T'];
        const per = metal ? rng.range(2, 3) : rng.range(3, 6);
        let coins;
        if (rng() < 0.5) { coins = ''; for (let i = 0; i < per; i++) coins += kinds.join(''); }
        else { const a = []; kinds.forEach((c) => { for (let i = 0; i < per; i++) a.push(c); }); rng.shuffle(a); coins = a.join(''); }
        const toAlt = !metal && rng() < 0.3;
        const goal = toAlt ? ['HT'.repeat(per), 'TH'.repeat(per)] : groupedAll(kinds, per);
        if (goal.includes(coins)) continue;
        const spare = '_'.repeat(k + (rng() < 0.2 ? 1 : 0));
        d = { kind: 'pairs', row: rng() < 0.5 ? spare + coins : coins + spare, k, goal };
        if (sizeOf(d) > 200000) continue;
      }
      const path = solve(d, null, 250000);
      if (!path || path.length < band[0] || path.length > band[1]) continue;
      d.sol = [].concat.apply([], path.map((x) => [x.from, x.to]));
      return { d, par: path.length };
    }
    return null;
  }

  /* ---------- words ---------- */

  const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
  const num = (n) => NUM[n] || String(n);
  const NAMES = { F: 'frog', T: 'toad' };
  const COINS = { H: 'heads', T: 'tails', G: 'gold', S: 'silver', C: 'copper' };
  function goalText(d) {
    if (d.kind === 'frogs') return 'Swap the frogs and the toads: finish as **' + pretty(goalRows(d)[0]) + '**.';
    if (d.kind === 'pairs') {
      const g = d.goal;
      if (g.every((x) => /^(HT)+$|^(TH)+$/.test(x))) return 'Make the coins **alternate**, heads and tails, in one unbroken row.';
      return 'Bring all the ' + kindsOf(g[0]) + ' together, in one unbroken row' + (g.length === 1 ? ' — **' + pretty(g[0]) + '**' : '') + '.';
    }
    return 'Make **' + num(d.n / 2) + ' piles of two**, every coin jumping over exactly ' + num(d.over || 2) + ' coins.';
  }
  function kindsOf(s) {
    const ks = [];
    for (const c of s) if (!ks.includes(c)) ks.push(c);
    return ks.map((c) => COINS[c] || c).join(' and ').replace(/^(.*) and (.*) and /, '$1, $2 and ');
  }
  const pretty = (s) => s.replace(/_/g, '·');

  function describe(d, m, s) {
    if (d.kind === 'frogs') {
      const c = s[m.from], jumpd = Math.abs(m.to - m.from) > 1;
      return 'Move the ' + NAMES[c] + ' on square ' + (m.from + 1) + (jumpd ? ' — jumping' + (Math.abs(m.to - m.from) > 2 ? ' two' : '') + ' —' : '') + ' to square ' + (m.to + 1) + '.';
    }
    if (d.kind === 'pairs') {
      const k = d.k || 2;
      return 'Move the ' + (k === 2 ? 'pair' : 'group of ' + num(k)) + ' on places ' + (m.from + 1) + '–' + (m.from + k) + ' to places ' + (m.to + 1) + '–' + (m.to + k) + '.';
    }
    return 'Jump the coin on place ' + (m.from + 1) + ' ' + (m.to < m.from ? 'left' : 'right') + ' onto the coin on place ' + (m.to + 1) + '.';
  }

  /* ---------- drawing ---------- */

  function frogPath(g, c, S) {
    const toad = c === 'T';
    const body = toad ? '#a88442' : '#56b848', dark = toad ? '#6f5424' : '#2f7a2a', belly = toad ? '#d8c07a' : '#a6e38a';
    const f = S('g', { transform: toad ? 'scale(-1 1)' : null }, g);
    // legs
    S('path', { d: 'M-.18 -.2Q-.42 -.36 -.36 -.08M-.18 .2Q-.42 .36 -.36 .08', fill: 'none', stroke: dark, 'stroke-width': 0.08, 'stroke-linecap': 'round' }, f);
    S('path', { d: 'M.12 -.22L.2 -.33M.12 .22L.2 .33', fill: 'none', stroke: dark, 'stroke-width': 0.06, 'stroke-linecap': 'round' }, f);
    S('ellipse', { cx: 0, cy: 0, rx: 0.3, ry: 0.25, fill: body, stroke: dark, 'stroke-width': 0.025 }, f);
    S('ellipse', { cx: -0.03, cy: 0, rx: 0.17, ry: 0.13, fill: belly, opacity: 0.55 }, f);
    if (toad) [[-0.12, -0.12], [0.02, 0.14], [-0.16, 0.08], [0.08, -0.08]].forEach(([x, y]) => S('circle', { cx: x, cy: y, r: 0.03, fill: dark, opacity: 0.6 }, f));
    [[-1], [1]].forEach(([sg]) => {
      S('circle', { cx: 0.2, cy: sg * 0.12, r: 0.085, fill: '#fff', stroke: dark, 'stroke-width': 0.02 }, f);
      S('circle', { cx: 0.23, cy: sg * 0.12, r: 0.042, fill: '#111' }, f);
    });
    S('path', { d: 'M.29 -.06Q.34 0 .29 .06', fill: 'none', stroke: dark, 'stroke-width': 0.025, 'stroke-linecap': 'round' }, f);
  }
  const FACE = {
    H: { rim: ['#fff1b0', '#e8b33f', '#946508'], face: 'M-.02 -.2C.09 -.21 .15 -.12 .14 -.03L.19 .03L.13 .06C.13 .12 .08 .15 .02 .14L.02 .2H-.16C-.13 .12 -.17 .04 -.15 -.04C-.14 -.14 -.09 -.2 -.02 -.2Z' },
    T: { rim: ['#f3cf7e', '#bd8423', '#5e3d04'], face: 'M0 -.2L.055 -.07L.19 -.065L.085 .025L.12 .16L0 .085L-.12 .16L-.085 .025L-.19 -.065L-.055 -.07Z' },
    G: { rim: ['#fff4bd', '#f0bf45', '#9c6a0c'], face: 'M-.18 .08L-.2 -.1L-.1 -.02L0 -.16L.1 -.02L.2 -.1L.18 .08Z' },
    S: { rim: ['#ffffff', '#d3d9e3', '#788191'], face: 'M0 -.18L.05 -.08L.17 -.09L.1 0L.17 .09L.05 .08L0 .18L-.05 .08L-.17 .09L-.1 0L-.17 -.09L-.05 -.08Z' },
    C: { rim: ['#ffd6b8', '#d88550', '#6f3313'], face: 'M0 -.2C.14 -.1 .14 .08 0 .18C-.14 .08 -.14 -.1 0 -.2Z' },
    '1': { rim: ['#fff4bd', '#f0bf45', '#9c6a0c'], face: 'M-.18 .08L-.2 -.1L-.1 -.02L0 -.16L.1 -.02L.2 -.1L.18 .08Z' }
  };
  function coinG(g, c, pre, S) {
    const F = FACE[c] || FACE.G, id = pre + '-' + (c === '1' ? 'P' : c);
    S('ellipse', { cx: 0.04, cy: 0.07, rx: 0.4, ry: 0.39, class: 'hop-shadow' }, g);
    S('circle', { cy: 0.05, r: 0.4, fill: F.rim[2] }, g);
    S('circle', { r: 0.4, fill: 'url(#' + id + ')', stroke: F.rim[2], 'stroke-width': 0.02 }, g);
    S('circle', { r: 0.33, fill: 'none', stroke: F.rim[2], 'stroke-opacity': 0.55, 'stroke-width': 0.016 }, g);
    S('path', { d: F.face, fill: 'rgba(255,255,255,.55)', transform: 'translate(-.012 -.012)' }, g);
    S('path', { d: F.face, fill: F.rim[2], 'fill-opacity': 0.55 }, g);
    if (c === 'H') S('circle', { cx: 0.06, cy: -0.07, r: 0.022, fill: F.rim[0] }, g);
  }

  let uid = 0;

  C.engine({
    id: 'hop',
    name: 'Counters in a row',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: '**Frogs and toads:** click a frog or a toad and it makes its only possible move — a hop forward into the empty square in front of it, or a jump forward over one counter (two, for leapers) into an empty square. You can also drag it. Nobody ever goes backwards.\n\n**Coins in pairs:** press on a coin and drag: the coin and its neighbour on the side you pressed (the right or left half of the coin) lift together and keep their order; drop them on two empty places side by side. Or click the pair, then click an empty place.\n\n**Coins into piles:** drag a single coin — or click it, then its landing coin — to jump it over exactly the number of coins the puzzle says, left or right, onto a single coin. A pile counts as two coins when you jump over it.\n\nUndo freely. A hint shows the next move of a shortest way from where you are.',

    generate(rng, level, fam) {
      const r = fam && fam.id === 'coin-pairs' ? makePairs(rng, level) : makeFrogs(rng, level);
      if (!r) return null;
      const d = r.d;
      if (d.kind === 'frogs') {
        const n = (d.row.match(/F/g) || []).length, m = (d.row.match(/T/g) || []).length;
        return { title: num(n).replace(/^./, (c) => c.toUpperCase()) + ' frogs, ' + num(m) + ' toad' + (m === 1 ? '' : 's') + (d.jump ? ', leaping' : ''), text: 'Frogs hop and jump to the right, toads to the left, never backwards' + (d.jump ? '; here a jump may clear two counters' : '') + '. Swap them over.', par: r.par, diff: level, data: d };
      }
      const cap1 = (w) => w.charAt(0).toUpperCase() + w.slice(1);
      if (d.kind === 'piles') return { title: cap1(num(d.n)) + ' coins, jumping ' + num(d.over), text: 'A row of ' + num(d.n) + ' coins. Make ' + num(d.n / 2) + ' piles of two: each move jumps a single coin, left or right, over exactly ' + num(d.over) + ' coins (a pile counts as two) onto a single coin.', par: r.par, diff: level, data: d };
      const k = d.k || 2, metal = /[GSC]/.test(d.row), coins = d.row.replace(/_/g, '').length;
      return { title: (metal ? 'Three metals' : 'Heads and tails') + ', ' + num(coins) + ' coins, ' + num(k) + ' at a time', text: 'Move ' + num(k) + ' neighbouring coins at a time, keeping their order, into ' + num(k) + ' empty places side by side.', par: r.par, diff: level, data: d };
    },

    verify(p) {
      const d = p.data;
      if (!d || !d.kind) return { ok: false, err: 'no kind' };
      if (d.kind === 'frogs' && !/^[FT_]+$/.test(d.row || '')) return { ok: false, err: 'frogs: row of F, T and _' };
      if (d.kind === 'frogs' && d.goal && (d.goal.length !== d.row.length || d.goal.split('').sort().join() !== d.row.split('').sort().join())) return { ok: false, err: 'the goal must use the same counters' };
      if (d.kind === 'pairs' && (!/^[A-Z_]+$/.test(d.row || '') || !Array.isArray(d.goal) || !d.goal.length)) return { ok: false, err: 'pairs: a row and a list of goal rows' };
      if (d.kind === 'piles' && !(d.n >= 2 && d.n <= 20)) return { ok: false, err: 'piles: n from 2 to 20' };
      if (!['frogs', 'pairs', 'piles'].includes(d.kind)) return { ok: false, err: 'unknown kind ' + d.kind };
      if (isGoal(d, startOf(d))) return { ok: false, err: 'already solved at the start' };
      let len = null;
      if (d.sol) {
        const r = replay(d, d.sol);
        if (!r.ok) return { ok: false, err: r.err };
        if (!isGoal(d, r.s)) return { ok: false, err: 'the stored solution does not reach the goal' };
        len = d.sol.length / 2;
      }
      if (sizeOf(d) <= 150000 || !d.sol) {
        const path = solve(d, null, 600000);
        if (path === undefined) return d.sol ? { ok: true } : { ok: false, err: 'search too big' };
        if (!path) return { ok: false, err: 'no solution' };
        if (p.par != null && p.par !== path.length) return { ok: false, err: 'par is ' + p.par + ' but the fewest moves is ' + path.length };
      } else if (p.par != null && len != null && p.par !== len) return { ok: false, err: 'par is ' + p.par + ' but the stored solution takes ' + len };
      return { ok: true };
    },

    mount(ctx, p) {
      const d = p.data, wb = ctx.wb;
      const S = (tag, attrs, parent) => ctx.s(tag, attrs, parent);
      let s = startOf(d), hist = [], busy = false, sel = null, drag = null, anims = [], timers = [], hintT = null;
      const L = s.length, k = d.k || 2;
      const pre = 'hop' + (++uid);
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      ctx.setGoal(goalText(d));

      /* the scene */
      const defs = S('defs', null, bg);
      let dd = '<linearGradient id="' + pre + '-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f8fc8"/><stop offset="1" stop-color="#23648f"/></linearGradient>' +
        '<linearGradient id="' + pre + '-wood" x1="0" y1="0" x2=".2" y2="1"><stop offset="0" stop-color="#d9a263"/><stop offset="1" stop-color="#9a6630"/></linearGradient>';
      for (const c in FACE) {
        const F = FACE[c];
        dd += '<linearGradient id="' + pre + '-' + (c === '1' ? 'P' : c) + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + F.rim[0] + '"/><stop offset=".5" stop-color="' + F.rim[1] + '"/><stop offset="1" stop-color="' + F.rim[2] + '"/></linearGradient>';
      }
      defs.innerHTML = dd;
      const scene = S('g', { class: 'hop-scene' }, bg);
      if (d.kind === 'frogs') {
        S('rect', { x: -0.75, y: -0.72, width: L + 0.5, height: 1.44, rx: 0.7, fill: 'url(#' + pre + '-water)', class: 'hop-pond' }, scene);
        for (let i = 0; i < 3; i++) S('path', { d: 'M' + (-0.3 + i * 1.7) + ' ' + (0.52 - i * 0.02) + 'q.25 -.1 .5 0t.5 0', class: 'hop-wave' }, scene);
        for (let i = 0; i < L; i++) {
          // a lily pad: an ellipse round the square's centre with a notch cut out on one side
          const nx = (i + 0.413).toFixed(3), a = (i % 2 ? -1 : 1) * 0.127;
          S('path', { d: 'M' + i + ' 0L' + nx + ' ' + (-a) + 'A.44 .37 0 1 ' + (a > 0 ? 0 : 1) + ' ' + nx + ' ' + a + 'Z', class: 'hop-pad', 'data-key': 's' + i, transform: 'rotate(' + [30, -40, 60, -20, 45, -55, 15][i % 7] + ' ' + i + ' 0)' }, scene);
        }
      } else {
        S('rect', { x: -0.72 + 0.06, y: -0.66 + 0.1, width: L + 0.44, height: 1.32, rx: 0.3, class: 'hop-tableshadow' }, scene);
        S('rect', { x: -0.72, y: -0.66, width: L + 0.44, height: 1.32, rx: 0.3, fill: 'url(#' + pre + '-wood)', stroke: '#6e4219', 'stroke-width': 0.05 }, scene);
        for (let i = 0; i < L; i++) S('circle', { cx: i, cy: 0, r: 0.43, class: 'hop-slot', 'data-key': 's' + i }, scene);
      }
      for (let i = 0; i < L; i++) S('text', { x: i, y: 1.05, 'text-anchor': 'middle', class: 'hop-num', text: String(i + 1) }, scene);
      const markG = S('g', { class: 'hop-marks' }, board);
      const pieceG = S('g', { class: 'hop-pieces' }, board);
      const liveG = S('g', { class: 'hop-live' }, top);
      const hintG = S('g', { class: 'hop-hint' }, top);
      wb.setBounds({ x0: -1, y0: -2, x1: L, y1: 1.35 }, 0.05);
      wb.applyPaints();

      function pieceEl(c, x, y, parent, h) {
        const g = S('g', { class: 'hop-piece', transform: 'translate(' + x + ' ' + y + ')' }, parent);
        if (d.kind === 'frogs') frogPath(g, c, S);
        else if (d.kind === 'piles') { for (let j = 0; j < (h || 1); j++) { const cg = S('g', { transform: 'translate(' + (-0.03 * j) + ' ' + (-0.09 * j) + ')' }, g); coinG(cg, '1', pre, S); } }
        else coinG(g, c, pre, S);
        return g;
      }
      const els = new Array(L).fill(null);
      function draw() {
        pieceG.innerHTML = '';
        els.fill(null);
        for (let i = 0; i < L; i++) {
          const c = s[i];
          if (c === '_' || c === '0') continue;
          if (drag && drag.moved && drag.idx.includes(i)) continue;
          els[i] = pieceEl(c, i, 0, pieceG, d.kind === 'piles' ? +c : 1);
        }
        drawMarks();
      }
      function drawMarks() {
        markG.innerHTML = '';
        if (sel) sel.idx.forEach((i) => S('circle', { cx: i, cy: 0, r: 0.47, class: 'hop-sel' }, markG));
        if (sel && sel.targets) sel.targets.forEach((t) => {
          if (d.kind === 'pairs') S('rect', { x: t - 0.46, y: -0.46, width: k - 1 + 0.92, height: 0.92, rx: 0.46, class: 'hop-target' + (drag && drag.over === t ? ' on' : '') }, markG);
          else S('circle', { cx: t, cy: 0, r: 0.45, class: 'hop-target' + (drag && drag.over === t ? ' on' : '') }, markG);
        });
      }
      function status() {
        if (isGoal(d, s)) { ctx.say(''); return; }
        if (!moves(d, s).length) ctx.say('No moves left from here. Undo, or ask for a hint.', 'warn');
        else ctx.say('');
      }

      /* animation */
      // an animation that always finishes: frames when the page is shown, a timer otherwise
      function tween(ms, step, done) {
        const t0 = performance.now(), a = { raf: 0, to: 0, over: false };
        a.end = () => {
          if (a.over) return;
          a.over = true;
          cancelAnimationFrame(a.raf); clearTimeout(a.to);
          step(1);
          anims = anims.filter((x) => x !== a);
          if (done) done();
        };
        const f = (now) => {
          if (a.over) return;
          const q = Math.min(1, (now - t0) / ms);
          if (q < 1) { step(q); a.raf = requestAnimationFrame(f); } else a.end();
        };
        a.raf = requestAnimationFrame(f);
        a.to = setTimeout(a.end, ms + 150);
        anims.push(a);
      }
      function flush() { anims.slice().forEach((a) => a.end()); }
      function stopAnims() { anims.forEach((a) => { a.over = true; cancelAnimationFrame(a.raf); clearTimeout(a.to); }); anims = []; timers.forEach(clearTimeout); timers = []; liveG.innerHTML = ''; busy = false; }
      // fly pieces from their old places (or a dropped spot) to their new ones
      function fly(list, done) {
        busy = true;
        const ms = C.anim(list.some((x) => Math.abs(x.to - x.from) > 1) ? 340 : 230);
        const flying = list.map((x) => {
          const g = pieceEl(x.c, x.x0 != null ? x.x0 : x.from, x.y0 || 0, liveG, 1);
          return Object.assign({ g }, x);
        });
        tween(ms, (q) => {
          const e = 0.5 - Math.cos(q * Math.PI) / 2;
          flying.forEach((x) => {
            const a = x.x0 != null ? x.x0 : x.from, ay = x.y0 || 0;
            const dist = Math.abs(x.to - a), lift = (dist > 1.05 || d.kind !== 'frogs' ? 0.35 + 0.22 * Math.sqrt(dist) : 0.12) * Math.sin(q * Math.PI);
            x.g.setAttribute('transform', 'translate(' + (a + (x.to - a) * e) + ' ' + (ay + (0 - ay) * e - lift) + ') scale(' + (1 + 0.1 * Math.sin(q * Math.PI)) + ')');
          });
        }, () => { flying.forEach((x) => x.g.remove()); busy = false; ctx.sfx('tap'); if (done) done(); });
      }

      function apply(m, from, silent) {
        const before = s;
        s = m.s;
        hist.push(m.from, m.to);
        sel = null; drag = null;
        clearHint();
        const list = [];
        if (d.kind === 'pairs') for (let j = 0; j < k; j++) list.push({ c: before[m.from + j], from: m.from + j, to: m.to + j, x0: from != null ? from + j : null, y0: from != null ? -0.25 : 0 });
        else list.push({ c: before[m.from], from: m.from, to: m.to, x0: from, y0: from != null ? -0.25 : 0 });
        draw();
        const hide = d.kind === 'piles' ? [] : list.map((x) => x.to);
        hide.forEach((i) => { if (els[i]) els[i].style.visibility = 'hidden'; });
        if (d.kind === 'piles' && els[m.to]) { els[m.to].remove(); els[m.to] = pieceEl('1', m.to, 0, pieceG, 1); }
        fly(list, () => { hide.forEach((i) => { if (els[i]) els[i].style.visibility = ''; }); if (d.kind === 'piles') draw(); });
        if (!silent) { ctx.move(); status(); ctx.changed('move'); }
      }

      /* choosing what to move */
      function slotAt(pt) { const i = Math.round(pt[0]); return i >= 0 && i < L && Math.abs(pt[0] - i) < 0.5 && Math.abs(pt[1]) < 0.75 ? i : -1; }
      const filled = (i) => i >= 0 && i < L && s[i] !== '_' && s[i] !== '0';
      function blockAt(i, fx) {
        // the k coins to lift when pressing coin i at fraction fx (0 left edge .. 1 right edge)
        const starts = [];
        for (let a = i - k + 1; a <= i; a++) { let ok = a >= 0 && a + k <= L; for (let j = a; ok && j < a + k; j++) if (!filled(j)) ok = false; if (ok) starts.push(a); }
        if (!starts.length) return null;
        const want = i - Math.min(k - 1, Math.floor((1 - fx) * k));   // right half -> block starting at i (for pairs)
        starts.sort((a, b) => Math.abs(a - want) - Math.abs(b - want));
        return starts[0];
      }
      function movesFrom(idx) { return moves(d, s).filter((m) => m.from === idx); }

      let solving = false;
      wb.handlers.board = {
        down(pt) {
          if (solving) return true;
          if (busy) flush();
          const i = slotAt(pt);
          if (i < 0) { if (sel) { sel = null; drawMarks(); } return false; }
          clearHint();
          // a second click on a target finishes a move
          if (sel && sel.targets.includes(i) && !(d.kind === 'pairs' && filled(i))) {
            const m = movesFrom(sel.from).find((x) => x.to === i);
            if (m) { apply(m); return true; }
          }
          if (sel && d.kind === 'pairs' && !filled(i)) {
            // an empty place: put the pair there (starting here, or ending here)
            const ms = movesFrom(sel.from);
            const m = ms.find((x) => x.to === i) || ms.find((x) => x.to === i - k + 1);
            if (m) { apply(m); return true; }
            ctx.toast('The ' + (k === 2 ? 'pair' : 'coins') + ' need' + (k === 2 ? 's' : '') + ' ' + num(k) + ' empty places side by side.');
            return true;
          }
          if (!filled(i)) { sel = null; drawMarks(); return true; }
          if (d.kind === 'piles' && s[i] !== '1') { ctx.toast('Piles stay where they are.'); return true; }
          let from = i, idx = [i];
          if (d.kind === 'pairs') {
            from = blockAt(i, pt[0] - i + 0.5);
            if (from == null) { ctx.toast('Coins move ' + (k === 2 ? 'in pairs' : num(k) + ' at a time') + ': this one has no neighbour to go with.'); return true; }
            idx = []; for (let j = 0; j < k; j++) idx.push(from + j);
          }
          const targets = movesFrom(from).map((m) => m.to);
          sel = { from, idx, targets };
          drag = { from, idx, p0: pt, grab: pt[0] - from, moved: false, over: -1, el: null };
          drawMarks();
          return true;
        },
        move(pt) {
          if (!drag) return;
          if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) < 0.15) return;
          if (!drag.moved) {
            drag.moved = true;
            draw();
            drag.el = S('g', null, liveG);
            drag.idx.forEach((i, j) => { const g = pieceEl(s[i], j, 0, drag.el, d.kind === 'piles' ? 1 : 1); g.setAttribute('transform', 'translate(' + j + ' 0) scale(1.1)'); });
          }
          const x = pt[0] - drag.grab;
          drag.el.setAttribute('transform', 'translate(' + x + ' ' + (pt[1] - drag.p0[1] - 0.2) + ')');
          const t = Math.round(x);
          const ov = sel.targets.includes(t) ? t : -1;
          if (ov !== drag.over) { drag.over = ov; drawMarks(); }
        },
        up(pt) {
          if (!drag) return;
          const dg = drag;
          drag = null;
          if (dg.el) dg.el.remove();
          if (dg.moved) {
            const x = pt[0] - dg.grab, t = Math.round(x);
            const m = movesFrom(dg.from).find((mm) => mm.to === t);
            if (m) { apply(m, x); return; }
            sel = null;
            draw();
            ctx.toast(d.kind === 'frogs' ? (s[dg.from] === 'F' ? 'Frogs only go forwards — to the right.' : 'Toads only go forwards — to the left.') : 'Not a legal place for ' + (d.kind === 'pairs' ? 'them' : 'it') + '.');
            return;
          }
          // a click
          const ms = movesFrom(dg.from);
          if (d.kind === 'frogs') {
            if (ms.length === 1) { apply(ms[0]); return; }
            sel = null; draw();
            ctx.toast('This ' + NAMES[s[dg.from]] + ' has nowhere to go just now.');
            ctx.sfx('wrong');
            return;
          }
          if (!ms.length) { sel = null; draw(); ctx.toast('No legal move for ' + (d.kind === 'pairs' ? 'these coins' : 'this coin') + ' just now.'); return; }
          ctx.say(d.kind === 'pairs' ? 'Now click an empty place for them.' : 'Now click the coin to land on.', 'info');
          drawMarks();
        }
      };

      /* hints and the solution */
      function clearHint() { clearTimeout(hintT); hintG.innerHTML = ''; }
      function showMove(m) {
        clearHint();
        const kk = d.kind === 'pairs' ? k : 1;
        for (let j = 0; j < kk; j++) {
          S('circle', { cx: m.from + j, cy: 0, r: 0.5, class: 'hop-hintring' }, hintG);
          S('circle', { cx: m.to + j, cy: 0, r: 0.46, class: 'hop-hintspot' }, hintG);
        }
        const a = m.from + (kk - 1) / 2, b = m.to + (kk - 1) / 2, h = 0.6 + 0.2 * Math.sqrt(Math.abs(b - a));
        S('path', { d: 'M' + a + ' -.5Q' + (a + b) / 2 + ' ' + (-0.5 - 2 * h) + ' ' + b + ' -.5', class: 'hop-hintarc' }, hintG);
        hintT = setTimeout(clearHint, 6000);
      }
      function stateAfter(j) { let t = startOf(d); for (let q = 0; q < j; q++) { const m = moves(d, t).find((x) => x.from === hist[2 * q] && x.to === hist[2 * q + 1]); if (!m) break; t = m.s; } return t; }
      const CAP = 120000;
      function solveFrom(t) {
        // the stored solution, if we are on its path
        if (d.sol) {
          let u = startOf(d);
          for (let q = 0; q <= d.sol.length / 2; q++) {
            if (u === t) { const out = []; let v = u; for (let r = q; r < d.sol.length / 2; r++) { const m = moves(d, v).find((x) => x.from === d.sol[2 * r] && x.to === d.sol[2 * r + 1]); out.push(m); v = m.s; } return out; }
            if (q === d.sol.length / 2) break;
            u = moves(d, u).find((x) => x.from === d.sol[2 * q] && x.to === d.sol[2 * q + 1]).s;
          }
        }
        return solve(d, t, CAP);
      }
      function solveAll() {
        stopAnims();
        clearHint();
        sel = null; drag = null;
        let path = solveFrom(s), restart = false;
        if (!path) { restart = true; s = startOf(d); hist = []; ctx.move(0); path = solveFrom(s); ctx.say('Starting again from the beginning…', 'info'); }
        draw();
        let j = 0;
        const step = () => {
          flush();
          if (!path || j >= path.length) { solving = false; busy = false; draw(); status(); ctx.changed('solve'); return; }
          const m = moves(d, s).find((x) => x.from === path[j].from && x.to === path[j].to);
          j++;
          if (!m) { solving = false; busy = false; ctx.changed('solve'); return; }
          apply(m, null, true);
          ctx.move();
          timers.push(setTimeout(step, C.anim(430)));
        };
        solving = true;
        timers.push(setTimeout(step, C.anim(restart ? 500 : 120)));
      }

      draw();
      status();

      return {
        check() {
          if (isGoal(d, s)) return { solved: true, msg: d.kind === 'frogs' ? 'Everyone is across.' : d.kind === 'piles' ? 'Every coin is in a pile of two.' : 'All together now.' };
          return { solved: false, msg: moves(d, s).length ? 'Not there yet.' : 'No moves left from here.' };
        },
        hint() {
          if (isGoal(d, s)) return 'Solved already!';
          const path = solveFrom(s);
          if (path && path.length) {
            const m = path[0];
            return { text: describe(d, m, s) + ' (' + C.plural(path.length, 'move') + ' to go from here.)', show: () => showMove(m) };
          }
          if (path === null) {
            const n = hist.length / 2;
            for (let j = n - 1; j >= 0; j--) {
              const t = stateAfter(j), pp = solve(d, t, CAP);
              if (pp && pp.length) return { text: 'This position is a dead end. Undo ' + C.plural(n - j, 'move') + ' — from there it takes ' + C.plural(pp.length, 'move') + '.' };
            }
          }
          return 'Undo a few moves and try another way.';
        },
        solve: solveAll,
        getState() { return { s, h: hist.slice() }; },
        setState(st) {
          stopAnims();
          solving = false;
          clearHint();
          if (st && st.s) { s = st.s; hist = (st.h || []).slice(); }
          sel = null; drag = null;
          draw();
          status();
        },
        destroy() { stopAnims(); solving = false; clearHint(); }
      };
    },

    thumb(p) {
      const d = p.data, s = startOf(d), L = s.length;
      let out = '<svg viewBox="-0.62 -0.62 ' + (L + 0.24) + ' 1.24" preserveAspectRatio="xMidYMid meet">';
      if (d.kind === 'frogs') out += '<rect x="-.6" y="-.55" width="' + (L + 0.2) + '" height="1.1" rx=".55" fill="var(--water)" opacity=".55"/>';
      for (let i = 0; i < L; i++) {
        const c = s[i];
        if (c === '_' || c === '0') { out += '<circle cx="' + i + '" cy="0" r=".1" fill="var(--ink-2)" opacity=".5"/>'; continue; }
        const fill = c === 'F' ? '#56b848' : c === 'T' && d.kind === 'frogs' ? '#a88442' : c === 'T' ? '#c9922e' : '#f0bf45';
        out += '<circle cx="' + i + '" cy="0" r=".4" fill="' + fill + '" stroke="rgba(0,0,0,.35)" stroke-width=".05"/>';
        if (d.kind === 'pairs') out += '<text x="' + i + '" y=".15" text-anchor="middle" font-size=".42" font-weight="800" fill="#5a3b05">' + c + '</text>';
        if (d.kind === 'frogs') out += '<circle cx="' + (i + (c === 'F' ? 0.18 : -0.18)) + '" cy="-.12" r=".07" fill="#fff"/><circle cx="' + (i + (c === 'F' ? 0.18 : -0.18)) + '" cy=".12" r=".07" fill="#fff"/>';
      }
      return out + '</svg>';
    }
  });

  C.css('hop', `
    .hop-pond { stroke: rgba(0, 0, 0, .25); stroke-width: .04; }
    .hop-wave { fill: none; stroke: rgba(255, 255, 255, .25); stroke-width: .04; stroke-linecap: round; }
    .hop-pad { fill: #3f8f3a; stroke: #2a6a26; stroke-width: .03; }
    .hop-tableshadow { fill: rgba(0, 0, 0, .3); }
    .hop-slot { fill: rgba(60, 30, 5, .28); stroke: rgba(255, 230, 190, .2); stroke-width: .03; }
    .hop-num { font: 700 .24px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .hop-shadow { fill: rgba(30, 15, 0, .35); }
    .hop-piece { cursor: grab; }
    .hop-live .hop-piece { pointer-events: none; }
    .hop-sel { fill: none; stroke: var(--accent); stroke-width: .06; }
    .hop-target { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: .05; stroke-dasharray: .12 .08; animation: hoppulse 1.1s ease-in-out infinite; }
    .hop-target.on { fill: rgba(255, 209, 102, .42); stroke-dasharray: none; animation: none; }
    .hop-hintring { fill: none; stroke: var(--gold); stroke-width: .07; animation: hoppulse 1s ease-in-out infinite; }
    .hop-hintspot { fill: rgba(255, 209, 102, .2); stroke: var(--gold); stroke-width: .05; stroke-dasharray: .12 .09; }
    .hop-hintarc { fill: none; stroke: var(--gold); stroke-width: .06; stroke-dasharray: .14 .1; }
    @keyframes hoppulse { 50% { opacity: .45; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
