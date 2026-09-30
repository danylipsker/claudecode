/* The Puzzle Cabinet · engines/mobiles.js
 *
 * Hanging mobiles: rods hung from strings, weights and smaller mobiles hung
 * from the rods. A rod balances when weight × distance is the same on both
 * sides (the whole of whatever hangs from a point counts, strings and rods
 * weigh nothing). Some weights are shown; fill in the blanks.
 *
 * data: {
 *   tree:  a rod = [[d, child], [d, child], …]   d = signed distance from the rod's string (−left, +right)
 *          a child = a number (a weight you are shown), 0 (a blank) or another rod
 *   tiles: [3, 5, 9, …]   optional: the numbers for the blanks, each used once
 *   total: 60             optional: the whole mobile weighs this much
 *   sol:   [values of the blanks, left to right]
 * }
 * Blanks take positive whole numbers (from the tiles, when there are tiles).
 * Every puzzle has exactly one answer.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ================= structure ================= */

  const isRod = (x) => Array.isArray(x);
  // leaves and rods in drawing order (hang points sorted left to right)
  function flatten(tree) {
    const leaves = [], rods = [];
    const walk = (node, parent, slot) => {
      const r = { id: rods.length, hangs: [], parent, slot };
      rods.push(r);
      node.slice().sort((a, b) => a[0] - b[0]).forEach(([d, ch]) => {
        if (isRod(ch)) { const h = { d, rod: null }; r.hangs.push(h); h.rod = walk(ch, r, h); }
        else { const h = { d, leaf: leaves.length }; r.hangs.push(h); leaves.push({ given: ch > 0 ? ch : null, rod: r, hang: h }); }
      });
      return r;
    };
    walk(tree, null, null);
    return { leaves, rods };
  }
  // the leaves below a hang point
  function leavesUnder(h) {
    if (h.leaf != null) return [h.leaf];
    const out = [];
    h.rod.hangs.forEach((x) => out.push.apply(out, leavesUnder(x)));
    return out;
  }
  // one row per rod: sum over leaves of coefficient × value = 0
  function equations(F) {
    return F.rods.map((r) => {
      const row = new Array(F.leaves.length).fill(0);
      r.hangs.forEach((h) => leavesUnder(h).forEach((j) => { row[j] += h.d; }));
      return row;
    });
  }

  /* ================= exact fractions ================= */

  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const fr = (n, d) => { if (d === undefined) d = 1; if (d < 0) { n = -n; d = -d; } const g = gcd(n, d); return [n / g, d / g]; };
  const fsub = (a, b) => fr(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const fmul = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const fdiv = (a, b) => fr(a[0] * b[1], a[1] * b[0]);
  const fzero = (a) => a[0] === 0;

  // reduced row echelon form of [A | b]; returns { pivots: [col…], rows, ok }
  function rref(A, b) {
    const m = A.length, n = A[0] ? A[0].length : 0;
    const M = A.map((row, i) => row.map((v) => fr(v)).concat([fr(b[i])]));
    const pivots = [];
    let r = 0;
    for (let c = 0; c < n && r < m; c++) {
      let p = -1;
      for (let i = r; i < m; i++) if (!fzero(M[i][c])) { p = i; break; }
      if (p < 0) continue;
      [M[r], M[p]] = [M[p], M[r]];
      const pv = M[r][c];
      M[r] = M[r].map((v) => fdiv(v, pv));
      for (let i = 0; i < m; i++) {
        if (i === r || fzero(M[i][c])) continue;
        const f = M[i][c];
        M[i] = M[i].map((v, k) => fsub(v, fmul(f, M[r][k])));
      }
      pivots.push(c);
      r++;
    }
    for (let i = r; i < m; i++) if (!fzero(M[i][n])) return { ok: false };
    return { ok: true, pivots, M: M.slice(0, r), n };
  }

  /* ================= solving ================= */

  // every answer (up to `limit`) for the blanks: { count, sols: [[v…]…] }
  // opts: { given: values per leaf (null = blank), tiles, total, maxV }
  function solve(F, opts, limit) {
    limit = limit || 2;
    const L = F.leaves.length;
    const given = opts.given;
    const blanks = [];
    for (let j = 0; j < L; j++) if (given[j] == null) blanks.push(j);
    const rows = equations(F);
    const A = [], b = [];
    rows.forEach((row) => {
      A.push(blanks.map((j) => row[j]));
      b.push(-row.reduce((s, c, j) => s + (given[j] != null ? c * given[j] : 0), 0));
    });
    if (opts.total != null) {
      A.push(blanks.map(() => 1));
      b.push(opts.total - given.reduce((s, v) => s + (v != null ? v : 0), 0));
    }
    const out = { count: 0, sols: [] };
    if (!blanks.length) {
      const ok = b.every((v) => v === 0);
      if (ok) { out.count = 1; out.sols.push([]); }
      return out;
    }
    const R = rref(A, b);
    if (!R.ok) return out;
    const nb = blanks.length;
    const isPivot = new Array(nb).fill(false);
    R.pivots.forEach((c) => { isPivot[c] = true; });
    const free = [];
    for (let c = 0; c < nb; c++) if (!isPivot[c]) free.push(c);
    const maxV = opts.maxV || 99;
    // what a tile set allows
    let pool = null;
    if (opts.tiles) { pool = new Map(); opts.tiles.forEach((v) => pool.set(v, (pool.get(v) || 0) + 1)); }
    const domain = pool ? Array.from(pool.keys()).sort((x, y) => x - y) : null;
    const seen = new Set();
    const vals = new Array(nb).fill(0);
    const finishPivots = () => {
      const use = pool ? new Map(pool) : null;
      for (const c of free) { if (use) { const k = use.get(vals[c]) || 0; if (!k) return; use.set(vals[c], k - 1); } }
      for (let i = 0; i < R.pivots.length; i++) {
        const row = R.M[i];
        let v = row[nb];
        for (const c of free) v = fsub(v, fmul(row[c], fr(vals[c])));
        if (v[1] !== 1 || v[0] < 1 || v[0] > maxV) return;
        if (use) { const k = use.get(v[0]) || 0; if (!k) return; use.set(v[0], k - 1); }
        vals[R.pivots[i]] = v[0];
      }
      if (opts.distinct) {
        const all = given.filter((v) => v != null).concat(vals);
        if (new Set(all).size !== all.length) return;
      }
      const key = vals.join(',');
      if (seen.has(key)) return;
      seen.add(key);
      out.count++;
      if (out.sols.length < limit) out.sols.push(vals.slice());
    };
    const rec = (k, use) => {
      if (out.count >= limit) return;
      if (k === free.length) { finishPivots(); return; }
      const c = free[k];
      if (pool) {
        for (const v of domain) {
          const left = use.get(v) || 0;
          if (!left) continue;
          use.set(v, left - 1); vals[c] = v; rec(k + 1, use); use.set(v, left);
          if (out.count >= limit) return;
        }
      } else {
        for (let v = 1; v <= maxV; v++) { vals[c] = v; rec(k + 1, use); if (out.count >= limit) return; }
      }
    };
    rec(0, pool ? new Map(pool) : null);
    return out;
  }
  function optsOf(d, F) {
    const given = F.leaves.map((l) => l.given);
    return { given, tiles: d.tiles || null, total: d.total == null ? null : d.total, distinct: !!d.distinct, maxV: d.tiles ? null : 99 };
  }

  function verify(p) {
    const d = p.data;
    if (!d || !isRod(d.tree) || d.tree.length < 2) return { ok: false, err: 'a tree with a rod is needed' };
    const F = flatten(d.tree);
    const blanks = F.leaves.filter((l) => l.given == null).length;
    if (!blanks) return { ok: false, err: 'no blanks' };
    if (d.tiles && d.tiles.length < blanks) return { ok: false, err: 'fewer tiles than blanks' };
    for (const r of F.rods) { if (r.hangs.every((h) => h.d > 0) || r.hangs.every((h) => h.d < 0)) return { ok: false, err: 'a rod hangs everything on one side' }; }
    const r = solve(F, optsOf(d, F), 2);
    if (r.count === 0) return { ok: false, err: 'no answer' };
    if (r.count > 1) return { ok: false, err: 'more than one answer: ' + r.sols.map((s) => s.join(',')).join(' / ') };
    if (d.sol && d.sol.join(',') !== r.sols[0].join(',')) return { ok: false, err: 'sol is not the answer (' + r.sols[0].join(',') + ')' };
    return { ok: true };
  }

  /* ================= making mobiles ================= */

  // a random shape: `leaves` weights, rods with 2 (sometimes 3) hang points
  function randomTree(rng, leaves, opts) {
    const maxArm = opts.maxArm || 4, three = opts.three || 0;
    const build = (n) => {
      if (n === 1) return 0;
      let k = n >= 3 && rng() < three ? 3 : 2;
      if (k > n) k = n;
      // split n leaves among k children
      const parts = new Array(k).fill(1);
      for (let i = k; i < n; i++) parts[rng.int(k)]++;
      const kids = parts.map((m) => build(m));
      let ds;
      if (k === 2) ds = [-rng.range(1, maxArm), rng.range(1, maxArm)];
      else {
        const a = rng.range(2, maxArm + 1), b = rng.range(1, a - 1), c = rng.range(1, maxArm);
        ds = rng() < 0.5 ? [-a, -b, c] : [-c, b, a];
      }
      return kids.map((ch, i) => [ds[i], ch]);
    };
    return build(leaves);
  }
  // some positive whole numbers that balance it, all ≤ maxV (found by search), or null
  function someWeights(rng, tree, maxV, distinct) {
    const F = flatten(tree);
    const L = F.leaves.length;
    const A = equations(F);
    const R = rref(A, A.map(() => 0));
    const isPivot = new Array(L).fill(false);
    R.pivots.forEach((c) => { isPivot[c] = true; });
    const free = [];
    for (let c = 0; c < L; c++) if (!isPivot[c]) free.push(c);
    for (let tries = 0; tries < 400; tries++) {
      const vals = new Array(L).fill(0);
      free.forEach((c) => { vals[c] = rng.range(1, Math.min(maxV, 12)); });
      let ok = true;
      for (let i = 0; i < R.pivots.length && ok; i++) {
        const row = R.M[i];
        let v = fr(0);
        for (const c of free) v = fsub(v, fmul(row[c], fr(vals[c])));
        if (v[1] !== 1 || v[0] < 1 || v[0] > maxV) ok = false;
        else vals[R.pivots[i]] = v[0];
      }
      if (!ok) continue;
      if (distinct && new Set(vals).size !== L) continue;
      return vals;
    }
    return null;
  }
  // put the values into the tree, blanking those not in `show`
  function fillTree(tree, vals, show) {
    let j = 0;
    const walk = (node) => node.slice().sort((a, b) => a[0] - b[0]).map(([dd, ch]) => {
      if (isRod(ch)) return [dd, walk(ch)];
      const k = j++;
      return [dd, show.has(k) ? vals[k] : 0];
    });
    // keep the author's order of hang points: sorting is fine, drawing sorts anyway
    return walk(tree);
  }
  function depthOf(tree) { return 1 + Math.max.apply(null, tree.map(([, ch]) => (isRod(ch) ? depthOf(ch) : 0))); }
  function hasThree(tree) { return tree.length > 2 || tree.some(([, ch]) => isRod(ch) && hasThree(ch)); }

  // grade: how many blanks, how they are tied down, how deep
  function gradeOf(d) {
    const F = flatten(d.tree);
    const blanks = F.leaves.filter((l) => l.given == null).length;
    let s = blanks + (depthOf(d.tree) - 1) * 1.2;
    if (d.tiles) s += 1.5 + (hasThree(d.tree) ? 1.5 : 0);
    if (d.total != null) s += 0.5;
    return s <= 3 ? 1 : s <= 5.5 ? 2 : s <= 8 ? 3 : s <= 10.5 ? 4 : 5;
  }
  const LEVEL = [null,
    { leaves: [2, 3], three: 0, tiles: 0 },
    { leaves: [3, 4], three: 0.1, tiles: 0.3 },
    { leaves: [4, 6], three: 0.25, tiles: 0.6 },
    { leaves: [5, 7], three: 0.35, tiles: 0.8 },
    { leaves: [6, 9], three: 0.45, tiles: 1 }];
  // one puzzle at a level, or null
  function makeMobile(rng, level) {
    const P = LEVEL[level];
    for (let tries = 0; tries < 50 + level * 30; tries++) {
      const L = rng.range(P.leaves[0], P.leaves[1]);
      const tree = randomTree(rng, L, { maxArm: 4, three: P.three });
      if (!isRod(tree)) continue;
      const useTiles = rng() < P.tiles;
      const perm = useTiles && rng() < 0.5;
      const vals = perm ? null : someWeights(rng, tree, useTiles ? 24 : 60, useTiles);
      let d = null;
      if (perm) {
        // the weights are 1 … L (or a little more), each once
        const top = L + (rng() < 0.5 ? 0 : rng.range(1, 3));
        const tiles = Array.from({ length: top }, (_, i) => i + 1);
        const F = flatten(fillTree(tree, [], new Set()));
        const r = solve(F, { given: F.leaves.map(() => null), tiles, maxV: top }, 40);
        if (!r.count) continue;
        const sol = r.sols[rng.int(r.sols.length)];
        d = revealUntilUnique(rng, tree, sol, { tiles: sol.slice().sort((a, b) => a - b), perm: true });
      } else {
        if (!vals) continue;
        if (Math.max.apply(null, vals) > (useTiles ? 24 : 60)) continue;
        d = revealUntilUnique(rng, tree, vals, useTiles ? { tiles: vals.slice().sort((a, b) => a - b) } : {});
      }
      if (!d) continue;
      if (gradeOf(d) !== level) continue;
      return d;
    }
    return null;
  }
  // show weights one at a time until the answer is unique, then hide any that are not needed
  function revealUntilUnique(rng, tree, vals, o) {
    const L = vals.length;
    const order = rng.shuffle(Array.from({ length: L }, (_, i) => i));
    const show = new Set();
    const attempt = () => {
      const t = fillTree(tree, vals, show);
      const d = { tree: t };
      if (o.tiles) { const F = flatten(t); const blanks = F.leaves.map((l, j) => (l.given == null ? vals[j] : null)).filter((v) => v != null); d.tiles = blanks.slice().sort((a, b) => a - b); }
      const F = flatten(t);
      if (!F.leaves.some((l) => l.given == null)) return { d, count: 0 };
      return { d, count: solve(F, optsOf(d, F), 2).count };
    };
    let res = attempt();
    for (let k = 0; res.count !== 1 && k < L - 1; k++) { show.add(order[k]); res = attempt(); }
    if (res.count !== 1) return null;
    Array.from(show).forEach((j) => { show.delete(j); const r2 = attempt(); if (r2.count === 1) res = r2; else show.add(j); });
    res = attempt();
    const F = flatten(res.d.tree);
    res.d.sol = F.leaves.map((l, j) => (l.given == null ? vals[j] : null)).filter((v) => v != null);
    if (!res.d.sol.length) return null;
    return res.d;
  }

  /* ================= drawing ================= */

  const R = 1.15, SL = 1.3, SR = 2.1, UMIN = 1.25, GAP = 0.55;
  const f2 = (v) => Math.round(v * 1000) / 1000;
  const HUES = [8, 38, 200, 150, 280, 330, 100, 180, 55, 240];
  // extents of everything below a rod at rest, and the unit length each rod uses
  function measure(r) {
    const ext = r.hangs.map((h) => {
      if (h.leaf != null) return { l: R, r: R, h: SL + 2 * R };
      const m = measure(h.rod);
      return { l: m.l, r: m.r, h: SR + m.h };
    });
    let u = UMIN;
    for (let i = 0; i + 1 < r.hangs.length; i++) {
      const need = ext[i].r + ext[i + 1].l + GAP;
      u = Math.max(u, need / (r.hangs[i + 1].d - r.hangs[i].d));
    }
    // keep children clear of the rod's own string on both sides
    r.hangs.forEach((h, i) => { if (Math.abs(h.d) * u < (h.d < 0 ? ext[i].r : ext[i].l) * 0.35) u = Math.max(u, (h.d < 0 ? ext[i].r : ext[i].l) * 0.35 / Math.abs(h.d)); });
    r.u = u;
    let L = 0, Rr = 0, H = 0;
    r.hangs.forEach((h, i) => { L = Math.max(L, -h.d * u + ext[i].l); Rr = Math.max(Rr, h.d * u + ext[i].r); H = Math.max(H, ext[i].h); });
    L = Math.max(L, -r.hangs[0].d * u + 0.4); Rr = Math.max(Rr, r.hangs[r.hangs.length - 1].d * u + 0.4);
    return { l: L, r: Rr, h: H };
  }

  function mountMobile(ctx, p, d) {
    const wb = ctx.wb, S = ctx.s;
    const F = flatten(d.tree);
    const L = F.leaves.length;
    const blankIdx = [];
    F.leaves.forEach((l, j) => { if (l.given == null) blankIdx.push(j); });
    const ext = measure(F.rods[0]);
    const TOP = 1.9;
    const board = wb.layer('board'), top = wb.layer('top');
    const g = S('g', { class: 'mb' }, board);
    S('path', { d: 'M-2.2 -.4H2.2', class: 'mb-ceiling' }, g);
    if (d.total != null) S('text', { x: 2.6, y: 0.25, class: 'mb-total', text: 'total ' + d.total }, g);
    const strings = S('path', { class: 'mb-string' }, g);
    const rodEls = F.rods.map((r) => {
      const rg = S('g', { class: 'mb-rod' }, g);
      const x0 = r.hangs[0].d * r.u - 0.35, x1 = r.hangs[r.hangs.length - 1].d * r.u + 0.35;
      S('path', { d: 'M' + f2(x0) + ' 0H' + f2(x1), class: 'mb-bar' }, rg);
      let ticks = '';
      for (let k = Math.ceil(r.hangs[0].d); k <= Math.floor(r.hangs[r.hangs.length - 1].d); k++) if (k) ticks += 'M' + f2(k * r.u) + ' -.16V.16';
      S('path', { d: ticks, class: 'mb-ticks' }, rg);
      r.hangs.forEach((h) => {
        S('circle', { cx: f2(h.d * r.u), cy: 0, r: 0.13, class: 'mb-hook' }, rg);
        S('text', { x: f2(h.d * r.u), y: -0.42, 'text-anchor': 'middle', class: 'mb-dist', text: String(Math.abs(h.d)) }, rg);
      });
      const knot = S('circle', { cx: 0, cy: 0, r: 0.3, class: 'mb-knot' }, rg);
      return { g: rg, knot };
    });
    const leafEls = F.leaves.map((l, j) => {
      const lg = S('g', { class: 'mb-leaf' + (l.given == null ? ' blank' : ' given'), 'data-j': j }, g);
      const hue = HUES[j % HUES.length];
      const disc = S('circle', { r: R, class: 'mb-disc', 'data-key': 'leaf' + j, style: l.given != null ? '--h:' + hue : null }, lg);
      const txt = S('text', { y: 0.38, 'text-anchor': 'middle', class: 'mb-num' }, lg);
      return { g: lg, disc, txt, x: 0, y: 0 };
    });
    // the tiles
    const tiles = d.tiles ? d.tiles.slice().sort((a, b) => a - b) : null;
    const TW = 1.9;
    const trayY = TOP + ext.h + 2.8;
    const tileX = (k) => (k - (tiles.length - 1) / 2) * (TW + 0.35);
    const tray = S('g', { class: 'mb-tray' }, g);
    if (tiles) S('rect', { x: tileX(0) - TW / 2 - 0.5, y: trayY - TW / 2 - 0.5, width: tiles.length * (TW + 0.35) + 0.65, height: TW + 1, rx: 0.6, class: 'mb-traybg' }, tray);
    const tileEls = tiles ? tiles.map((v, k) => {
      const tg = S('g', { class: 'mb-tile', transform: 'translate(' + f2(tileX(k)) + ' ' + f2(trayY) + ')' }, tray);
      S('rect', { x: -TW / 2, y: -TW / 2, width: TW, height: TW, rx: 0.4 }, tg);
      S('text', { y: 0.36, 'text-anchor': 'middle', text: String(v) }, tg);
      return tg;
    }) : [];
    const ghost = S('g', { class: 'mb-ghost' }, top);
    const hintG = S('g', { class: 'mb-hintg' }, top);
    const x0 = Math.min(-ext.l, tiles ? tileX(0) - TW : 0) - 1.2, x1 = Math.max(ext.r, tiles ? tileX(tiles.length - 1) + TW : 0) + 1.2;
    wb.setBounds({ x0: Math.min(x0, -4), y0: -1.4, x1: Math.max(x1, 4), y1: (tiles ? trayY + TW : TOP + ext.h) + 1.2 }, 0.05);

    let vals = new Array(L).fill(null);          // what the player has put in each blank
    let sel = -1, buf = '', bufT = 0;
    const theta = F.rods.map(() => 0), omega = F.rods.map(() => 0);
    let raf = 0, lastT = 0, timers = [];
    const valueOf = (j) => (F.leaves[j].given != null ? F.leaves[j].given : vals[j]);
    const weightUnder = (h) => leavesUnder(h).reduce((s, j) => s + (valueOf(j) || 0), 0);
    const complete = (h) => leavesUnder(h).every((j) => valueOf(j) != null);
    function target(r) {
      let tau = 0, tot = 0;
      r.hangs.forEach((h) => { const w = weightUnder(h); tau += h.d * w; tot += Math.abs(h.d) * w; });
      if (!tot || !tau) return 0;
      const x = tau / tot;
      return Math.sign(x) * (0.07 + 0.26 * Math.min(1, Math.abs(x)));
    }
    const balanced = (r) => r.hangs.every(complete) && r.hangs.reduce((s, h) => s + h.d * weightUnder(h), 0) === 0;
    // positions, from the top down
    function place() {
      let sd = 'M0 -.4V' + TOP;
      const walk = (r, px, py) => {
        const th = theta[r.id], c = Math.cos(th), s = Math.sin(th);
        rodEls[r.id].g.setAttribute('transform', 'translate(' + f2(px) + ' ' + f2(py) + ') rotate(' + f2(th * 180 / Math.PI) + ')');
        r.hangs.forEach((h) => {
          const hx = px + c * h.d * r.u, hy = py + s * h.d * r.u;
          if (h.leaf != null) {
            const E = leafEls[h.leaf];
            E.x = hx; E.y = hy + SL + R;
            E.g.setAttribute('transform', 'translate(' + f2(E.x) + ' ' + f2(E.y) + ')');
            sd += 'M' + f2(hx) + ' ' + f2(hy) + 'V' + f2(hy + SL);
          } else {
            sd += 'M' + f2(hx) + ' ' + f2(hy) + 'V' + f2(hy + SR);
            walk(h.rod, hx, hy + SR);
          }
        });
      };
      walk(F.rods[0], 0, TOP);
      strings.setAttribute('d', sd);
    }
    function physics(now) {
      raf = 0;
      const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016) / Math.max(0.05, C.animScale);
      lastT = now;
      let moving = false;
      F.rods.forEach((r) => {
        const tg = target(r);
        const steps = Math.max(1, Math.ceil(dt / 0.02));
        for (let k = 0; k < steps; k++) {
          const h = dt / steps;
          omega[r.id] += (-26 * (theta[r.id] - tg) - 3.2 * omega[r.id]) * h;
          theta[r.id] += omega[r.id] * h;
        }
        if (Math.abs(theta[r.id] - tg) > 0.0008 || Math.abs(omega[r.id]) > 0.0008) moving = true;
        else { theta[r.id] = tg; omega[r.id] = 0; }
      });
      place();
      if (moving) raf = requestAnimationFrame(physics);
      else lastT = 0;
    }
    function wake(kick) {
      if (kick) F.rods.forEach((r) => { omega[r.id] += kick * (r.id % 2 ? -1 : 1); });
      if (!raf) { lastT = 0; raf = requestAnimationFrame(physics); }
    }
    function draw() {
      F.leaves.forEach((l, j) => {
        const E = leafEls[j], v = valueOf(j);
        E.txt.textContent = v == null ? '?' : String(v);
        E.g.classList.toggle('filled', l.given == null && v != null);
        E.g.classList.toggle('sel', j === sel);
        if (l.given == null) E.disc.style.setProperty('--h', v == null ? '' : HUES[(v * 3) % HUES.length]);
      });
      F.rods.forEach((r) => rodEls[r.id].g.classList.toggle('ok', balanced(r)));
      if (tiles) {
        const used = new Map();
        vals.forEach((v) => { if (v != null) used.set(v, (used.get(v) || 0) + 1); });
        tileEls.forEach((tg, k) => {
          const v = tiles[k];
          const u = used.get(v) || 0;
          tg.classList.toggle('used', u > 0);
          if (u > 0) used.set(v, u - 1);
        });
      }
      const filled = blankIdx.filter((j) => vals[j] != null).length;
      ctx.stat('Filled', filled + ' / ' + blankIdx.length);
      ctx.stat('Rods level', F.rods.filter(balanced).length + ' / ' + F.rods.length);
      wb.applyPaints();
    }
    function setVal(j, v, why) {
      if (F.leaves[j].given != null) return;
      if (v != null && tiles) {
        // a tile can only be used once: take it from wherever it is
        const free = tiles.filter((x) => x === v).length - vals.filter((x, k) => x === v && k !== j).length;
        if (!tiles.includes(v)) { ctx.toast('There is no ' + v + ' among the tiles.'); return false; }
        if (free <= 0) { const k = vals.findIndex((x, i) => x === v && i !== j); if (k >= 0) vals[k] = vals[j]; }
      }
      if (v != null && d.distinct) { const k = vals.findIndex((x, i) => x === v && i !== j); if (k >= 0) vals[k] = null; }
      vals[j] = v;
      draw();
      wake(v == null ? 0 : 0.6);
      ctx.changed(why || 'value');
      return true;
    }
    const nextBlank = (from, dir) => {
      const list = blankIdx;
      if (!list.length) return -1;
      const i = list.indexOf(from);
      return list[(i + (dir || 1) + list.length) % list.length];
    };
    function typeDigit(ch) {
      if (sel < 0) sel = blankIdx.find((j) => vals[j] == null) ?? blankIdx[0];
      const now = Date.now();
      buf = (now - bufT < 1300 && buf.length < 3 ? buf : '') + ch;
      bufT = now;
      const v = parseInt(buf, 10);
      if (!(v > 0)) { draw(); return; }
      if (tiles && !tiles.includes(v)) {
        // perhaps more digits are coming (1 → 12); otherwise say so
        if (tiles.some((t) => String(t).startsWith(buf) && String(t) !== buf)) return;
        ctx.toast('There is no ' + v + ' among the tiles.');
        buf = '';
        return;
      }
      setVal(sel, v);
    }

    /* pointer: click a blank to pick it, drag tiles onto blanks */
    const leafAt = (pt) => { let best = -1, bd = (R + 0.35) * (R + 0.35); leafEls.forEach((E, j) => { const dd = (E.x - pt[0]) ** 2 + (E.y - pt[1]) ** 2; if (dd < bd) { bd = dd; best = j; } }); return best; };
    const tileAt = (pt) => { if (!tiles) return -1; for (let k = 0; k < tiles.length; k++) if (Math.abs(pt[0] - tileX(k)) <= TW / 2 + 0.1 && Math.abs(pt[1] - trayY) <= TW / 2 + 0.1) return k; return -1; };
    let drag = null;
    function showGhost(v, pt) {
      ghost.innerHTML = '';
      if (v == null) return;
      const tg = S('g', { class: 'mb-tile drag', transform: 'translate(' + f2(pt[0]) + ' ' + f2(pt[1]) + ')' }, ghost);
      S('rect', { x: -TW / 2, y: -TW / 2, width: TW, height: TW, rx: 0.4 }, tg);
      S('text', { y: 0.36, 'text-anchor': 'middle', text: String(v) }, tg);
    }
    wb.handlers.board = {
      down(pt) {
        const k = tileAt(pt);
        if (k >= 0 && !tileEls[k].classList.contains('used')) { drag = { v: tiles[k], from: -1, p0: pt, moved: false }; return true; }
        const j = leafAt(pt);
        if (j >= 0 && F.leaves[j].given == null) {
          drag = { v: tiles ? vals[j] : null, from: j, p0: pt, moved: false };
          return true;
        }
        if (sel >= 0) { sel = -1; draw(); }
        return false;
      },
      move(pt) {
        if (!drag || drag.v == null) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) < 0.4) return;
        drag.moved = true;
        showGhost(drag.v, pt);
        const j = leafAt(pt);
        leafEls.forEach((E, i) => E.g.classList.toggle('hot', i === j && F.leaves[i].given == null));
      },
      up(pt) {
        const dr = drag;
        drag = null;
        ghost.innerHTML = '';
        leafEls.forEach((E) => E.g.classList.remove('hot'));
        if (!dr) return;
        if (!dr.moved) {
          if (dr.from >= 0) { sel = dr.from; buf = ''; draw(); ctx.sfx('tap'); return; }
          // a tile clicked: into the selected blank (or the first empty one)
          const j = sel >= 0 ? sel : blankIdx.find((i) => vals[i] == null);
          if (j != null && j >= 0) { ctx.sfx('snap'); setVal(j, dr.v, 'tile'); sel = nextEmpty(j); draw(); }
          return;
        }
        const j = leafAt(pt);
        if (j >= 0 && F.leaves[j].given == null) {
          if (dr.from >= 0 && dr.from !== j) { const old = vals[j]; vals[dr.from] = old; }
          ctx.sfx('snap');
          vals[j] = null;
          setVal(j, dr.v, 'tile');
          return;
        }
        if (dr.from >= 0) { ctx.sfx('tap'); setVal(dr.from, null, 'tile'); }
      }
    };
    const nextEmpty = (j) => { const e = blankIdx.filter((i) => vals[i] == null); if (!e.length) return -1; const after = e.find((i) => i > j); return after != null ? after : e[0]; };

    // the number pad for fingers (no tiles)
    if (!tiles) {
      const pad = ctx.h('div.mb-pad');
      '1234567890'.split('').forEach((ch) => pad.appendChild(ctx.h('button.mb-key', { type: 'button', onclick: () => typeDigit(ch) }, ch)));
      pad.appendChild(ctx.h('button.mb-key.wide', { type: 'button', onclick: () => { if (sel >= 0) { buf = ''; setVal(sel, null); } } }, 'clear'));
      pad.appendChild(ctx.h('button.mb-key.wide', { type: 'button', onclick: () => { sel = nextBlank(sel, 1); buf = ''; draw(); } }, 'next ›'));
      ctx.panel.append(ctx.h('div.mb-ptitle', 'Click a ? weight, then type its number'), pad);
    } else {
      ctx.panel.append(ctx.h('div.mb-ptitle', { html: 'Drag the tiles onto the <b>?</b> weights — or click a weight, then a tile.' }));
    }

    const sol = d.sol;
    const solOf = (j) => sol[blankIdx.indexOf(j)];
    function rodName(r) {
      if (!r.parent) return 'the top rod';
      const side = r.slot.d < 0 ? 'left' : 'right';
      return 'the rod hanging ' + Math.abs(r.slot.d) + ' to the ' + side + ' of ' + rodName(r.parent).replace(/^the /, 'the ');
    }
    function flashRod(r) { const el = rodEls[r.id].g; el.classList.add('hint'); setTimeout(() => el.classList.remove('hint'), 2800); }
    function flashLeaf(j) { const el = leafEls[j].g; el.classList.add('hint'); setTimeout(() => el.classList.remove('hint'), 2800); }
    const sideSum = (r, sign, known) => r.hangs.filter((h) => Math.sign(h.d) === sign && known(h)).map((h) => Math.abs(h.d) + ' × ' + wKnown(h));
    let wKnown = () => 0;

    place();
    draw();
    wake(0.9);

    return {
      noMoves: true,
      check() {
        const empty = blankIdx.filter((j) => vals[j] == null).length;
        if (empty) return { solved: false, msg: C.plural(empty, 'weight') + ' still to fill.' };
        const bad = F.rods.filter((r) => !balanced(r));
        if (bad.length) return { solved: false, msg: C.plural(bad.length, 'rod') + ' still ' + (bad.length > 1 ? 'tilt' : 'tilts') + '.' };
        if (d.total != null) { const t = F.leaves.reduce((s, l, j) => s + valueOf(j), 0); if (t !== d.total) return { solved: false, msg: 'Every rod balances, but the whole mobile weighs ' + t + ', not ' + d.total + '.' }; }
        if (d.distinct) { const all = F.leaves.map((l, j) => valueOf(j)); if (new Set(all).size !== all.length) return { solved: false, msg: 'Two weights are the same, and they should all differ.' }; }
        return { solved: true, msg: 'Every rod hangs level.' };
      },
      hint() {
        const wrong = blankIdx.filter((j) => vals[j] != null && vals[j] !== solOf(j));
        if (wrong.length) {
          return { text: 'The glowing weight' + (wrong.length > 1 ? 's are' : ' is') + ' not right. Take ' + (wrong.length > 1 ? 'them' : 'it') + ' off and look at ' + (wrong.length > 1 ? 'their rods' : 'its rod') + ' again.', show() { wrong.forEach(flashLeaf); } };
        }
        const known = (h) => leavesUnder(h).every((j) => valueOf(j) != null);
        wKnown = (h) => weightUnder(h);
        // a rod where only one hanging thing is unknown
        for (let i = F.rods.length - 1; i >= 0; i--) {
          const r = F.rods[i];
          const unk = r.hangs.filter((h) => !known(h));
          if (unk.length !== 1) continue;
          const u = unk[0];
          const tauL = r.hangs.filter((h) => h.d < 0 && h !== u).reduce((s, h) => s + -h.d * weightUnder(h), 0);
          const tauR = r.hangs.filter((h) => h.d > 0 && h !== u).reduce((s, h) => s + h.d * weightUnder(h), 0);
          const need = (u.d > 0 ? tauL - tauR : tauR - tauL) / Math.abs(u.d);
          if (!(need > 0) || need !== Math.round(need)) continue;
          const lp = sideSum(r, -1, (h) => h !== u), rp = sideSum(r, 1, (h) => h !== u);
          const other = u.d > 0 ? 'left' : 'right';
          const txt = 'Look at ' + rodName(r) + ' (glowing). The ' + other + ' side turns ' + (u.d > 0 ? (lp.join(' + ') || '0') + ' = ' + tauL : (rp.join(' + ') || '0') + ' = ' + tauR) +
            ((u.d > 0 ? rp.length : lp.length) ? ', and the rest of its own side ' + (u.d > 0 ? rp.join(' + ') + ' = ' + tauR : lp.join(' + ') + ' = ' + tauL) : '') + '. So what hangs ' + Math.abs(u.d) + ' out on the ' + (u.d > 0 ? 'right' : 'left') + ' must weigh ' + need + (u.leaf != null ? '.' : ' in all.');
          return { text: txt, show() { flashRod(r); leavesUnder(u).forEach((j) => { if (F.leaves[j].given == null) flashLeaf(j); }); } };
        }
        // otherwise, give a weight away
        const j = blankIdx.find((i) => vals[i] == null);
        if (j == null) return 'All filled — check the rods that still tilt.';
        return { text: 'No rod can be settled on its own yet' + (tiles ? ' — the tiles must be tried together' : '') + '. The glowing weight is **' + solOf(j) + '**.', show() { flashLeaf(j); } };
      },
      solve() {
        timers.forEach(clearTimeout); timers = [];
        let k = 0;
        const next = () => {
          if (k >= blankIdx.length) { sel = -1; draw(); ctx.changed('solve'); return; }
          const j = blankIdx[k++];
          vals[j] = null;
          if (tiles) { const o = vals.findIndex((x) => x === solOf(j)); if (o >= 0 && solOf(o) !== solOf(j)) vals[o] = null; }
          vals[j] = solOf(j);
          draw(); wake(0.3);
          timers.push(setTimeout(next, C.anim(260)));
        };
        blankIdx.forEach((j) => { if (vals[j] != null && vals[j] !== solOf(j)) vals[j] = null; });
        draw();
        next();
      },
      explain() {
        const lines = F.rods.map((r) => {
          const side = (sign) => r.hangs.filter((h) => Math.sign(h.d) === sign).map((h) => Math.abs(h.d) + ' × ' + leavesUnder(h).reduce((s, j) => s + (F.leaves[j].given != null ? F.leaves[j].given : solOf(j)), 0));
          const tot = (sign) => r.hangs.filter((h) => Math.sign(h.d) === sign).reduce((s, h) => s + Math.abs(h.d) * leavesUnder(h).reduce((q, j) => q + (F.leaves[j].given != null ? F.leaves[j].given : solOf(j)), 0), 0);
          return cap1(rodName(r)) + ': ' + side(-1).join(' + ') + ' = ' + tot(-1) + ' = ' + side(1).join(' + ') + '.';
        });
        return 'The weights: ' + blankIdx.map((j) => solOf(j)).join(', ') + ' (left to right). Each rod balances — weight × distance the same on both sides, counting everything that hangs below a point: ' + lines.join(' ') + ' Work from the rods where only one thing is unknown, bottom up or top down.';
      },
      getState() { return { vals: vals.slice() }; },
      setState(s) { vals = (s.vals || vals).slice(); sel = -1; draw(); wake(0.2); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (/^[0-9]$/.test(ev.key)) { typeDigit(ev.key); return true; }
        if ((ev.key === 'Backspace' || ev.key === 'Delete') && sel >= 0) { buf = ''; setVal(sel, null); return true; }
        if (ev.key === 'Tab' || ev.key === 'ArrowRight') { sel = nextBlank(sel, ev.shiftKey ? -1 : 1); buf = ''; draw(); return true; }
        if (ev.key === 'ArrowLeft') { sel = nextBlank(sel, -1); buf = ''; draw(); return true; }
        if (ev.key === 'Escape' && sel >= 0) { sel = -1; draw(); return false; }
        return false;
      },
      destroy() { if (raf) cancelAnimationFrame(raf); timers.forEach(clearTimeout); }
    };
  }
  const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function thumbSVG(d) {
    const F = flatten(d.tree);
    const ext = measure(F.rods[0]);
    let s = '<path d="M0 -.4V1.9" stroke="var(--ink-2)" stroke-width=".1"/>';
    const walk = (r, px, py) => {
      const x0 = r.hangs[0].d * r.u - 0.35, x1 = r.hangs[r.hangs.length - 1].d * r.u + 0.35;
      s += '<path d="M' + f2(px + x0) + ' ' + f2(py) + 'H' + f2(px + x1) + '" stroke="#b07c4a" stroke-width=".32" stroke-linecap="round"/>';
      r.hangs.forEach((h) => {
        const hx = px + h.d * r.u;
        if (h.leaf != null) {
          const l = F.leaves[h.leaf];
          s += '<path d="M' + f2(hx) + ' ' + f2(py) + 'V' + f2(py + SL) + '" stroke="var(--ink-2)" stroke-width=".1"/>';
          s += '<circle cx="' + f2(hx) + '" cy="' + f2(py + SL + R) + '" r="' + R + '" fill="' + (l.given != null ? 'hsl(' + HUES[h.leaf % HUES.length] + ' 65% 62%)' : 'none') + '" stroke="var(--ink-2)" stroke-width=".12"' + (l.given == null ? ' stroke-dasharray=".3 .2"' : '') + '/>';
          s += '<text x="' + f2(hx) + '" y="' + f2(py + SL + R + 0.42) + '" text-anchor="middle" font-size="1.15" font-weight="800" fill="' + (l.given != null ? '#1b1f33' : 'var(--muted)') + '" font-family="Segoe UI, system-ui, sans-serif">' + (l.given != null ? l.given : '?') + '</text>';
        } else {
          s += '<path d="M' + f2(hx) + ' ' + f2(py) + 'V' + f2(py + SR) + '" stroke="var(--ink-2)" stroke-width=".1"/>';
          walk(h.rod, hx, py + SR);
        }
      });
    };
    walk(F.rods[0], 0, 1.9);
    const w = ext.l + ext.r + 2, h = ext.h + 3.5;
    return '<svg viewBox="' + f2(-ext.l - 1) + ' -1 ' + f2(w) + ' ' + f2(h) + '" preserveAspectRatio="xMidYMid meet">' + s + '</svg>';
  }

  /* ================= the engine ================= */

  C.engine({
    id: 'mobiles',
    name: 'Mobiles',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    noMoves: true,
    about: 'Every rod must hang level: on each side, add up **weight × distance** for everything hanging there (a hanging mobile counts with its whole weight; strings and rods weigh nothing). The small numbers on a rod are the distances from its string.\n\nClick a **?** weight and type its number (Tab moves on, Backspace clears), or use the number pad in the panel. When the puzzle gives **tiles**, drag a tile onto a weight — or click a weight, then a tile; drag it off again to take it back. Rods tilt while they are out of balance and swing level when they are right; their knots turn green.',
    verify,
    generate(rng, level) {
      const d = makeMobile(rng, level);
      if (!d) return null;
      const F = flatten(d.tree);
      return { title: d.tiles ? 'A Mobile and the Tiles ' + d.tiles.join(', ') : 'A Mobile of ' + F.leaves.length + ' Weights', text: textOf(d), goal: 'Every rod level.', diff: level, data: d };
    },
    mount(ctx, p) { return mountMobile(ctx, p, p.data); },
    thumb(p) { return thumbSVG(p.data); }
  });
  function textOf(d) {
    const F = flatten(d.tree);
    const blanks = d.sol.length;
    let t = 'Find the ' + (blanks > 1 ? blanks + ' missing weights' : 'missing weight') + ' so that every rod hangs level.';
    if (d.tiles) t += ' The missing weights are the tiles ' + d.tiles.join(', ') + ' — each used once.';
    else t += ' Every weight is a whole number.';
    if (d.total != null) t += ' The whole mobile weighs ' + d.total + '.';
    void F;
    return t;
  }

  C.mobileSolver = { flatten, solve, optsOf, randomTree, someWeights, fillTree, revealUntilUnique, makeMobile, gradeOf, textOf, depthOf, hasThree };

  C.css('mobiles', `
    .mb-ceiling { stroke: var(--wood-dark); stroke-width: .35; stroke-linecap: round; }
    .mb-total { font: 700 .8px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .mb-string { fill: none; stroke: var(--ink-2); stroke-width: .08; opacity: .8; }
    .mb-bar { stroke: #b07c4a; stroke-width: .3; stroke-linecap: round; }
    .mb-ticks { stroke: #6e4a2a; stroke-width: .07; }
    .mb-hook { fill: #6e4a2a; }
    .mb-dist { font: 700 .55px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .mb-knot { fill: var(--panel-2); stroke: var(--ink-2); stroke-width: .09; transition: fill .3s; }
    .mb-rod.ok .mb-knot { fill: var(--green); stroke: var(--green); }
    .mb-rod.hint .mb-bar { stroke: var(--gold); filter: drop-shadow(0 0 .25px var(--gold)); }
    .mb-leaf { cursor: default; }
    .mb-leaf.blank { cursor: pointer; }
    .mb-disc { fill: hsl(var(--h, 220) 65% 62%); stroke: rgba(0,0,0,.35); stroke-width: .08; }
    .mb-leaf.blank .mb-disc { fill: var(--cell); stroke: var(--ink-2); stroke-width: .1; stroke-dasharray: .3 .2; }
    .mb-leaf.blank.filled .mb-disc { fill: hsl(var(--h, 220) 55% 72%); stroke-dasharray: none; stroke: var(--accent); stroke-width: .12; }
    .mb-leaf.sel .mb-disc { stroke: var(--accent); stroke-width: .24; stroke-dasharray: none; }
    .mb-leaf.hot .mb-disc { stroke: var(--gold); stroke-width: .28; }
    .mb-leaf.hint .mb-disc { stroke: var(--gold); stroke-width: .3; filter: drop-shadow(0 0 .3px var(--gold)); }
    .mb-num { font: 800 1.05px "Segoe UI", system-ui, sans-serif; fill: #1b1f33; pointer-events: none; }
    .mb-leaf.blank .mb-num { fill: var(--muted); }
    .mb-leaf.blank.filled .mb-num { fill: #1b1f33; }
    .mb-traybg { fill: var(--board-2); stroke: var(--line); stroke-width: .06; }
    .mb-tile { cursor: grab; }
    .mb-tile rect { fill: #f4e3b5; stroke: #9a7a3a; stroke-width: .08; }
    .mb-tile text { font: 800 1px "Segoe UI", system-ui, sans-serif; fill: #3a2605; pointer-events: none; }
    .mb-tile.used { opacity: .22; cursor: default; }
    .mb-tile.drag rect { filter: drop-shadow(0 .15px .2px rgba(0,0,0,.5)); }
    .mb-ghost { pointer-events: none; }
    .mb-ptitle { font-size: .82rem; color: var(--muted); width: 100%; }
    .mb-pad { display: flex; flex-wrap: wrap; gap: 4px; width: 100%; }
    .mb-key { min-width: 2.2em; height: 2.1em; border-radius: 1.1em; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font-weight: 700; cursor: pointer; }
    .mb-key.wide { padding: 0 .8em; }
    .mb-key:hover { border-color: var(--accent); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
