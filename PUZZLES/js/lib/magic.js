/* The Puzzle Cabinet · js/lib/magic.js
 *
 * Cabinet.Magic: magic squares, triangles, stars, hexagons, wheels and rings.
 *
 *   figure(d)          the slots, lines and drawing hints of p.data
 *   count(F, opts)     exact solver: { n, first, nodes } (n counted up to opts.limit)
 *   hintStep(F, placed) the next number that reasoning forces, with the reason
 *   make(rng, level, kind)  a new puzzle for the endless drawers
 *
 * p.data:
 *   fig:    'square' (n) | 'triangle' (k per side) | 'polygon' (sides, k per side) | 'star' (points)
 *           | 'hexagon' (order 3) | 'wheel' (spokes: lines through a hub) | 'graph' (slots, edges, lines given)
 *   n, k, sides, points, spokes   the figure's size
 *   slots, lines, edges, rings    explicit figures (fig 'graph')
 *   nums:   the numbers in the tray (default 1 … number of slots)
 *   rule:   'sum' (every line makes target) | 'prod' (every line's product is target)
 *           | 'hetero' (every line sum different) | 'anti' (the line sums are consecutive numbers, all different)
 *           | 'apart' (no two numbers joined by an edge are consecutive)
 *   target: the magic sum or product (for 'sum' and 'prod')
 *   givens: [[slot, number], …] printed at the start
 *   sol:    one full arrangement (number per slot)
 *   any:    true when every arrangement that keeps the rule is accepted (otherwise the answer is unique)
 *   lines by name: a square's rows, columns and two diagonals; a figure's sides; a star's lines
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  /* ---------- figures ---------- */

  // an n × n square: rows, columns and the two diagonals; Franklin's squares swap the
  // diagonals for his "bent diagonals" (down half a column's worth and back again)
  function square(n, franklin) {
    const slots = [], lines = [], names = [], badge = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) slots.push([c + 0.5, r + 0.5]);
    for (let r = 0; r < n; r++) { lines.push(Array.from({ length: n }, (_, c) => r * n + c)); names.push('row ' + (r + 1)); badge.push([n + 0.55, r + 0.5]); }
    for (let c = 0; c < n; c++) { lines.push(Array.from({ length: n }, (_, r) => r * n + c)); names.push('column ' + (c + 1)); badge.push([c + 0.5, n + 0.5]); }
    if (franklin) {
      const h = n / 2;
      for (let c = 0; c < n; c++) {
        const l = [];
        for (let r = 0; r < h; r++) l.push(r * n + (c + r) % n);
        for (let r = h; r < n; r++) l.push(r * n + (c + n - 1 - r) % n);
        lines.push(l); names.push('the bent diagonal from column ' + (c + 1)); badge.push([c + 0.5, -0.5]);
      }
      return { kind: 'square', n, franklin: true, slots, lines, names, badge, cell: true, box: [-0.3, -0.95, n + 1.1, n + 0.95] };
    }
    lines.push(Array.from({ length: n }, (_, i) => i * n + i)); names.push('the diagonal ↘'); badge.push([n + 0.55, n + 0.5]);
    lines.push(Array.from({ length: n }, (_, i) => i * n + (n - 1 - i))); names.push('the diagonal ↙'); badge.push([-0.55, n + 0.5]);
    return { kind: 'square', n, slots, lines, names, badge, cell: true, box: [-1.1, -0.35, n + 1.1, n + 0.95] };
  }

  // a triangle with k circles on each side (corners shared)
  function triangle(k) { return polygon(3, k); }

  // a regular polygon with k circles on each side (corners shared)
  function polygon(sides, k) {
    const R = sides === 3 ? 1.25 : 1.1;
    const corner = [];
    for (let i = 0; i < sides; i++) {
      const a = -Math.PI / 2 + i * 2 * Math.PI / sides + (sides === 4 ? Math.PI / 4 : 0);
      corner.push([Math.cos(a) * R, Math.sin(a) * R + (sides === 3 ? 0.3 : 0)]);
    }
    const slots = corner.map((p) => p.slice());
    const lines = [], names = [], badge = [];
    const sideName = sides === 3 ? ['the right side', 'the bottom', 'the left side'] : null;
    for (let i = 0; i < sides; i++) {
      const a = corner[i], b = corner[(i + 1) % sides];
      const line = [i];
      for (let j = 1; j < k - 1; j++) {
        const t = j / (k - 1);
        slots.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
        line.push(slots.length - 1);
      }
      line.push((i + 1) % sides);
      lines.push(line);
      names.push(sideName ? sideName[i] : 'side ' + (i + 1));
      // the badge sits outside the middle of the side
      const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], cx = 0, cy = sides === 3 ? 0.3 : 0;
      const d = Math.hypot(m[0] - cx, m[1] - cy) || 1;
      badge.push([m[0] + (m[0] - cx) / d * 0.42, m[1] + (m[1] - cy) / d * 0.42]);
    }
    const bb = bbox(slots, 0.62);
    return { kind: 'polygon', sides, k, slots, lines, names, badge, edgesFromLines: true, box: bb };
  }

  // an n-pointed star {n/2}: n points and n crossings, n lines of four
  function star(n) {
    const R = 1.2, P = [];
    for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / n; P.push([Math.cos(a) * R, Math.sin(a) * R]); }
    const L = (i) => [P[i % n], P[(i + 2) % n]];
    const I = [];
    for (let i = 0; i < n; i++) I.push(cross(L(i), L(i + 1)));    // I[i] = line i meets line i+1
    const slots = P.concat(I);
    const lines = [], names = [], badge = [];
    for (let i = 0; i < n; i++) {
      // along line i: P[i], I[i-1], I[i], P[i+2]
      lines.push([i, n + ((i - 1 + n) % n), n + i, (i + 2) % n]);
      names.push('line ' + (i + 1));
      const a = P[i], b = P[(i + 2) % n];
      const dir = [b[0] - a[0], b[1] - a[1]], len = Math.hypot(dir[0], dir[1]);
      badge.push([a[0] - dir[0] / len * 0.46, a[1] - dir[1] / len * 0.46]);
    }
    return { kind: 'star', points: n, slots, lines, names, badge, edgesFromLines: true, box: bbox(slots.concat(badge), 0.3) };
  }

  // the order-3 magic hexagon: 19 cells, 15 rows in three directions
  function hexagon() {
    const cells = [], idx = {};
    for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) {
      const s = -q - r;
      if (Math.abs(s) > 2) continue;
      idx[q + ',' + r] = cells.length;
      cells.push([q, r]);
    }
    const W = 0.5;
    const slots = cells.map(([q, r]) => [W * Math.sqrt(3) * (q + r / 2), W * 1.5 * r]);
    const lines = [], names = [], badge = [];
    const dirs = [[[1, 0], 'r'], [[0, 1], 'q'], [[1, -1], 's']];
    const byKey = {};
    cells.forEach(([q, r], i) => {
      const s = -q - r;
      (byKey['r' + r] = byKey['r' + r] || []).push(i);
      (byKey['q' + q] = byKey['q' + q] || []).push(i);
      (byKey['s' + s] = byKey['s' + s] || []).push(i);
    });
    void dirs;
    ['r', 'q', 's'].forEach((ax, ai) => {
      for (let v = -2; v <= 2; v++) {
        const line = byKey[ax + v].slice();
        // order along the line
        line.sort((a, b) => ax === 'r' ? cells[a][0] - cells[b][0] : ax === 'q' ? cells[a][1] - cells[b][1] : cells[a][0] - cells[b][0]);
        lines.push(line);
        names.push(['row ', 'the ↘ line ', 'the ↗ line '][ai] + (ax === 's' ? 3 - v : v + 3));
        // badges on three different sides: rows at the left, ↘ lines below, ↗ lines above
        const e0 = ax === 'r' ? line[0] : line[line.length - 1], e1 = ax === 'r' ? line[1] : line[line.length - 2];
        const end = slots[e0], next = slots[e1];
        const d = [end[0] - next[0], end[1] - next[1]], len = Math.hypot(d[0], d[1]);
        badge.push([end[0] + d[0] / len * 0.74, end[1] + d[1] / len * 0.74]);
      }
    });
    return { kind: 'hexagon', slots, lines, names, badge, hex: true, box: bbox(slots.concat(badge), 0.35) };
  }

  // a wheel: a hub and spokes; every line runs rim – hub – rim
  function wheel(spokes) {
    const slots = [[0, 0]], lines = [], names = [], badge = [];
    const m = spokes * 2, R = 1.15;
    for (let i = 0; i < m; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / m; slots.push([Math.cos(a) * R, Math.sin(a) * R]); }
    for (let i = 0; i < spokes; i++) {
      lines.push([1 + i, 0, 1 + i + spokes]);
      names.push('spoke ' + (i + 1));
      const a = slots[1 + i];
      badge.push([a[0] * 1.42, a[1] * 1.42]);
    }
    return { kind: 'wheel', spokes, slots, lines, names, badge, edgesFromLines: true, rim: R, box: bbox(slots.concat(badge), 0.35) };
  }

  function graph(d) {
    const slots = d.slots.map((p) => p.slice());
    const lines = (d.lines || []).map((l) => l.slice());
    const names = (d.names || lines.map((_, i) => 'line ' + (i + 1)));
    const badge = d.badge || lines.map((l) => {
      const c = centroid(l.map((i) => slots[i]));
      return [c[0], c[1] - 0.2];
    });
    const out = { kind: 'graph', slots, lines, names, badge, edges: d.edges || null, rings: d.rings || null, box: bbox(slots.concat(badge), 0.4) };
    if (!d.edges && !d.rings) out.edgesFromLines = true;
    if (d.rings) out.box = bbox(slots.concat(badge).concat(d.rings.map((r) => [r[0] - r[2], r[1] - r[2]])).concat(d.rings.map((r) => [r[0] + r[2], r[1] + r[2]])), 0.3);
    return out;
  }

  function figure(d) {
    let F;
    if (d.fig === 'square') F = square(d.n, d.franklin);
    else if (d.fig === 'triangle') F = triangle(d.k);
    else if (d.fig === 'polygon') F = polygon(d.sides, d.k);
    else if (d.fig === 'star') F = star(d.points);
    else if (d.fig === 'hexagon') F = hexagon();
    else if (d.fig === 'wheel') F = wheel(d.spokes);
    else F = graph(d);
    const N = F.slots.length;
    F.nums = (d.nums || Array.from({ length: N }, (_, i) => i + 1)).slice().sort((a, b) => a - b);
    F.rule = d.rule || 'sum';
    F.target = d.target;
    F.givens = {};
    (d.givens || []).forEach(([s, v]) => { F.givens[s] = v; });
    F.any = !!d.any;
    if (!F.edges && F.edgesFromLines) {
      F.edges = [];
      F.lines.forEach((l) => { for (let i = 0; i + 1 < l.length; i++) F.edges.push([l[i], l[i + 1]]); });
    }
    if (d.edges) F.edges = d.edges.map((e) => e.slice());
    F.slotLines = Array.from({ length: N }, () => []);
    F.lines.forEach((l, li) => l.forEach((s) => F.slotLines[s].push(li)));
    F.nbr = Array.from({ length: N }, () => []);
    if (F.rule === 'apart') (F.edges || []).forEach(([a, b]) => { F.nbr[a].push(b); F.nbr[b].push(a); });
    F.N = N;
    F.d = d;
    return F;
  }

  function bbox(pts, pad) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    pts.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); });
    return [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
  }
  function centroid(pts) { let x = 0, y = 0; pts.forEach((p) => { x += p[0]; y += p[1]; }); return [x / pts.length, y / pts.length]; }
  function cross(s, t) {
    const r = [s[1][0] - s[0][0], s[1][1] - s[0][1]], q = [t[1][0] - t[0][0], t[1][1] - t[0][1]];
    const den = r[0] * q[1] - r[1] * q[0];
    const w = [t[0][0] - s[0][0], t[0][1] - s[0][1]];
    const a = (w[0] * q[1] - w[1] * q[0]) / den;
    return [s[0][0] + r[0] * a, s[0][1] + r[1] * a];
  }

  /* ---------- checking an arrangement ---------- */

  function lineVal(F, a, l) {
    let s = F.rule === 'prod' ? 1 : 0;
    for (const i of F.lines[l]) { if (!a[i]) return null; s = F.rule === 'prod' ? s * a[i] : s + a[i]; }
    return s;
  }

  // what is wrong with a full (or partial) arrangement: { ok, bad: [line…], badEdges: [[a,b]…], dup: [slot…] }
  function problems(F, a) {
    const out = { bad: [], badEdges: [], dup: [], full: true };
    const seen = {};
    for (let i = 0; i < F.N; i++) {
      if (!a[i]) { out.full = false; continue; }
      (seen[a[i]] = seen[a[i]] || []).push(i);
    }
    for (const v in seen) if (seen[v].length > 1) out.dup.push.apply(out.dup, seen[v]);
    const sums = F.lines.map((_, l) => lineVal(F, a, l));
    if (F.rule === 'sum' || F.rule === 'prod') sums.forEach((s, l) => { if (s != null && F.target != null && s !== F.target) out.bad.push(l); });
    if (F.rule === 'hetero' || F.rule === 'anti') {
      const by = {};
      sums.forEach((s, l) => { if (s != null) (by[s] = by[s] || []).push(l); });
      for (const s in by) if (by[s].length > 1) out.bad.push.apply(out.bad, by[s]);
      if (F.rule === 'anti' && sums.every((s) => s != null) && !out.bad.length) {
        const mn = Math.min.apply(null, sums), mx = Math.max.apply(null, sums);
        if (mx - mn !== sums.length - 1) out.spread = [mn, mx];
      }
    }
    if (F.rule === 'apart') (F.edges || []).forEach(([x, y]) => { if (a[x] && a[y] && Math.abs(a[x] - a[y]) === 1) out.badEdges.push([x, y]); });
    out.sums = sums;
    out.ok = out.full && !out.dup.length && !out.bad.length && !out.badEdges.length && !out.spread;
    return out;
  }

  /* ---------- the exact solver ----------
   * Numbers go into slots one at a time. A line with one gap left must be
   * closed by exactly the number it lacks; a line with several gaps must still
   * be reachable with the smallest and largest numbers left. */

  function count(F, opts) {
    opts = opts || {};
    const limit = opts.limit || 2, nodeLimit = opts.nodeLimit || 2e6;
    const N = F.N, nums = F.nums, M = nums.length;
    const idxOf = {};
    nums.forEach((v, i) => { idxOf[v] = i; });
    const a = new Array(N).fill(0), used = new Uint8Array(M);
    const fixed = Object.assign({}, F.givens, opts.fix || {});
    for (const s in fixed) {
      const v = fixed[s];
      if (idxOf[v] == null || used[idxOf[v]]) return { n: 0, first: null, nodes: 0 };
      a[s] = v; used[idxOf[v]] = 1;
    }
    let n = 0, nodes = 0, stop = false, aborted = false, first = null;
    const isSum = F.rule === 'sum' || F.rule === 'hetero' || F.rule === 'anti' || F.rule === 'apart';
    const lineSum = new Array(F.lines.length).fill(0), lineEmpty = F.lines.map((l) => l.length);
    const lineProd = new Array(F.lines.length).fill(1);
    F.lines.forEach((l, li) => l.forEach((s) => { if (a[s]) { lineSum[li] += a[s]; lineProd[li] *= a[s]; lineEmpty[li]--; } }));
    // a static order: fill the slots that close lines soonest
    const order = [];
    {
      const le = lineEmpty.slice(), done = new Uint8Array(N);
      for (let s = 0; s < N; s++) if (a[s]) done[s] = 1;
      while (order.length + Object.keys(fixed).length < N) {
        let best = -1, bw = Infinity;
        for (let s = 0; s < N; s++) {
          if (done[s]) continue;
          let w = 100;
          F.slotLines[s].forEach((li) => { w = Math.min(w, le[li]); });
          w = w * 10 - F.slotLines[s].length - (F.nbr[s] ? F.nbr[s].length * 0.1 : 0);
          if (w < bw) { bw = w; best = s; }
        }
        if (best < 0) break;
        done[best] = 1;
        order.push(best);
        F.slotLines[best].forEach((li) => { le[li]--; });
      }
    }
    const targets = F.rule === 'sum' || F.rule === 'prod' ? (F.target != null ? [F.target] : possibleTargets(F)) : [null];
    let T = null;
    // the smallest and largest k numbers still free
    const minK = (k, skip) => { let s = 0, c = 0; for (let i = 0; i < M && c < k; i++) if (!used[i] && i !== skip) { s += nums[i]; c++; } return c < k ? Infinity : s; };
    const maxK = (k, skip) => { let s = 0, c = 0; for (let i = M - 1; i >= 0 && c < k; i--) if (!used[i] && i !== skip) { s += nums[i]; c++; } return c < k ? -Infinity : s; };
    function fits(s, v, vi) {
      for (const li of F.slotLines[s]) {
        const e = lineEmpty[li] - 1;
        if (F.rule === 'sum') {
          const rest = T - lineSum[li] - v;
          if (e === 0) { if (rest !== 0) return false; }
          else if (e === 1) { const j = idxOf[rest]; if (j == null || used[j] || j === vi) return false; }
          else if (rest < minK(e, vi) || rest > maxK(e, vi)) return false;
        } else if (F.rule === 'prod') {
          const p = lineProd[li] * v;
          if (e === 0) { if (p !== T) return false; }
          else { if (T % p) return false; if (e === 1) { const j = idxOf[T / p]; if (j == null || used[j] || j === vi) return false; } }
        }
      }
      if (F.rule === 'apart') for (const t of F.nbr[s]) if (a[t] && Math.abs(a[t] - v) === 1) return false;
      return true;
    }
    function linesDone() {
      if (F.rule !== 'hetero' && F.rule !== 'anti') return true;
      const seen = new Set();
      let mn = Infinity, mx = -Infinity;
      for (let li = 0; li < F.lines.length; li++) {
        if (lineEmpty[li]) continue;
        const s = lineSum[li];
        if (seen.has(s)) return false;
        seen.add(s);
        mn = Math.min(mn, s); mx = Math.max(mx, s);
      }
      if (F.rule === 'anti' && mx - mn > F.lines.length - 1) return false;
      return true;
    }
    function go(k) {
      if (stop) return;
      if (++nodes > nodeLimit) { stop = true; aborted = true; return; }
      if (k === order.length) {
        n++;
        if (!first) first = a.slice();
        if (opts.onFound) opts.onFound(a);
        if (n >= limit) stop = true;
        return;
      }
      const s = order[k];
      const vals = opts.shuffle ? opts.shuffle(Array.from({ length: M }, (_, i) => i)) : null;
      for (let q = 0; q < M && !stop; q++) {
        const vi = vals ? vals[q] : q;
        if (used[vi]) continue;
        const v = nums[vi];
        if (!fits(s, v, vi)) continue;
        a[s] = v; used[vi] = 1;
        F.slotLines[s].forEach((li) => { lineSum[li] += v; lineProd[li] *= v; lineEmpty[li]--; });
        if (linesDone()) go(k + 1);
        F.slotLines[s].forEach((li) => { lineSum[li] -= v; lineProd[li] /= v; lineEmpty[li]++; });
        a[s] = 0; used[vi] = 0;
      }
    }
    for (const t of targets) {
      if (stop) break;
      T = t;
      // the givens must not already break a full line
      let ok = true;
      F.lines.forEach((l, li) => { if (!lineEmpty[li] && (F.rule === 'sum' ? lineSum[li] !== T : F.rule === 'prod' ? lineProd[li] !== T : false)) ok = false; });
      if (ok && linesDone()) go(0);
    }
    return { n, first, nodes, aborted, target: T };
  }

  // for 'sum' puzzles without a stated target: every total a line could have
  function possibleTargets(F) {
    const L = F.lines[0].length, nums = F.nums;
    let lo = 0, hi = 0;
    for (let i = 0; i < L; i++) { lo += nums[i]; hi += nums[nums.length - 1 - i]; }
    const out = [];
    for (let t = lo; t <= hi; t++) out.push(t);
    return out;
  }

  /* ---------- reasoning like a person ----------
   *   last    a line with one gap: the gap is what the line still lacks
   *   only    a gap where only one number left can go (every other one leaves some line unfinishable)
   *   place   a number that fits in only one gap
   *   trial   suppose a number and watch a line fail
   */

  // can `need` be made from exactly e of the free numbers (those in avail, a list), all different?
  function reachable(need, e, avail, start) {
    if (e === 0) return need === 0;
    if (e === 1) { for (let i = start || 0; i < avail.length; i++) if (avail[i] === need) return true; return false; }
    let lo = 0, hi = 0;
    for (let i = 0; i < e; i++) { lo += avail[(start || 0) + i]; hi += avail[avail.length - 1 - i]; }
    if ((start || 0) + e > avail.length || need < lo || need > hi) return false;
    if (e > 3) return true;       // bounds are enough for long lines
    for (let i = start || 0; i < avail.length; i++) {
      if (avail[i] * e > need + 0) break;
      if (reachable(need - avail[i], e - 1, avail, i + 1)) return true;
    }
    return false;
  }
  function reachableProd(need, e, avail) {
    if (e === 0) return need === 1;
    if (e === 1) return avail.indexOf(need) >= 0;
    for (let i = 0; i < avail.length; i++) if (need % avail[i] === 0 && reachableProd(need / avail[i], e - 1, avail.slice(i + 1))) return true;
    return false;
  }

  // the numbers each gap may still take, given the numbers placed (a) and the target T
  function candidates(F, a, T) {
    const free = F.nums.filter((v) => a.indexOf(v) < 0);
    const cand = new Array(F.N).fill(null);
    for (let s = 0; s < F.N; s++) {
      if (a[s]) continue;
      cand[s] = free.filter((v) => fitsHere(F, a, T, s, v, free));
    }
    return { cand, free };
  }
  function fitsHere(F, a, T, s, v, free) {
    if (F.rule === 'apart') { for (const t of F.nbr[s]) if (a[t] && Math.abs(a[t] - v) === 1) return false; return true; }
    if (T == null) return true;
    const rest = free.filter((x) => x !== v);
    for (const li of F.slotLines[s]) {
      let sum = F.rule === 'prod' ? 1 : 0, e = 0;
      for (const t of F.lines[li]) { if (t === s) continue; if (a[t]) sum = F.rule === 'prod' ? sum * a[t] : sum + a[t]; else e++; }
      if (F.rule === 'prod') { const p = sum * v; if (T % p || !reachableProd(T / p, e, rest)) return false; }
      else if (F.rule === 'sum' && !reachable(T - sum - v, e, rest)) return false;
    }
    return true;
  }

  // one step from the arrangement a (changed in place); null when stuck
  function nextStep(F, a, T, noTrial) {
    if (F.rule === 'sum' || F.rule === 'prod') {
      for (let li = 0; li < F.lines.length; li++) {
        const gaps = F.lines[li].filter((s) => !a[s]);
        if (gaps.length !== 1) continue;
        const have = F.lines[li].filter((s) => a[s]).map((s) => a[s]);
        const need = F.rule === 'prod' ? T / have.reduce((x, y) => x * y, 1) : T - have.reduce((x, y) => x + y, 0);
        if (need !== Math.round(need) || F.nums.indexOf(need) < 0 || a.indexOf(need) >= 0) return { kind: 'fail', li, need };
        a[gaps[0]] = need;
        return { kind: 'last', li, s: gaps[0], v: need, have };
      }
    }
    const { cand, free } = candidates(F, a, T);
    for (let s = 0; s < F.N; s++) if (cand[s] && !cand[s].length) return { kind: 'fail', s };
    for (let s = 0; s < F.N; s++) {
      if (cand[s] && cand[s].length === 1) { a[s] = cand[s][0]; return { kind: 'only', s, v: a[s], lines: F.slotLines[s] }; }
    }
    for (const v of free) {
      const where = [];
      for (let s = 0; s < F.N; s++) if (cand[s] && cand[s].indexOf(v) >= 0) where.push(s);
      if (!where.length && F.nums.length === F.N) return { kind: 'fail', v };
      if (where.length === 1 && F.nums.length === F.N) { a[where[0]] = v; return { kind: 'place', s: where[0], v }; }
    }
    if (noTrial) return null;
    // what-if: a gap with few choices; every choice but one breaks
    const gaps = [];
    for (let s = 0; s < F.N; s++) if (cand[s]) gaps.push(s);
    gaps.sort((x, y) => cand[x].length - cand[y].length || x - y);
    for (const s of gaps) {
      if (cand[s].length > 4) break;
      const keep = [], outs = [];
      for (const v of cand[s]) {
        const b = a.slice();
        b[s] = v;
        let fail = null;
        for (let k = 0; k < F.N && !fail; k++) {
          const st = nextStep(F, b, T, true);
          if (!st) break;
          if (st.kind === 'fail') fail = st;
        }
        if (fail) outs.push({ v, fail }); else keep.push(v);
      }
      if (keep.length === 1 && outs.length) { a[s] = keep[0]; return { kind: 'trial', s, v: keep[0], outs }; }
    }
    return null;
  }

  // run the reasoning to the end: how far it gets and with what
  function reason(F, fromA) {
    const T = F.target;
    const a = fromA ? fromA.slice() : new Array(F.N).fill(0);
    if (!fromA) for (const s in F.givens) a[s] = F.givens[s];
    const steps = [];
    for (let k = 0; k < F.N + 5; k++) {
      if (a.every((v) => v)) break;
      const st = nextStep(F, a, T, false);
      if (!st || st.kind === 'fail') break;
      steps.push(st);
    }
    const counts = {};
    steps.forEach((s) => { counts[s.kind] = (counts[s.kind] || 0) + 1; });
    return { solved: a.every((v) => v), steps, counts, a };
  }

  function sayStep(F, st) {
    const nm = (li) => F.names[li];
    if (st.kind === 'last') {
      const T = F.target;
      if (F.rule === 'prod') return 'Only one gap is left in ' + nm(st.li) + ': ' + st.have.join(' × ') + ' = ' + st.have.reduce((x, y) => x * y, 1) + ', and ' + T + ' ÷ ' + st.have.reduce((x, y) => x * y, 1) + ' = **' + st.v + '**.';
      const sum = st.have.reduce((x, y) => x + y, 0);
      return 'Only one gap is left in ' + nm(st.li) + ': ' + st.have.join(' + ') + ' = ' + sum + ', and it must make ' + T + ', so the gap is ' + T + ' − ' + sum + ' = **' + st.v + '**.';
    }
    if (st.kind === 'only') {
      const ls = st.lines.map(nm);
      return 'Only **' + st.v + '** can go in the gold ' + (F.kind === 'square' ? 'cell' : 'circle') + ': with any other number left, ' + (ls.length === 1 ? ls[0] : 'one of ' + ls.slice(0, -1).join(', ') + ' or ' + ls[ls.length - 1]) + ' could no longer be finished from the numbers that remain.';
    }
    if (st.kind === 'place') return 'Where can the **' + st.v + '** go? Try it in each gap: everywhere else some line could no longer be finished. It goes in the gold ' + (F.kind === 'square' ? 'cell' : 'circle') + '.';
    if (st.kind === 'trial') {
      const bits = st.outs.slice(0, 3).map((o) => 'with ' + o.v + ' there, ' + failWords(F, o.fail));
      return 'Suppose each possibility in the gold ' + (F.kind === 'square' ? 'cell' : 'circle') + ' in turn: ' + bits.join('; ') + '. Only **' + st.v + '** survives.';
    }
    return '';
  }
  function failWords(F, f) {
    if (f.li != null) return F.names[f.li] + ' would need ' + (f.need > 0 && f.need === Math.round(f.need) ? f.need : 'a number that is not there') + (F.nums.indexOf(f.need) >= 0 ? ', which is already used' : '');
    if (f.v != null) return 'the ' + f.v + ' would have nowhere to go';
    if (f.s != null && F.kind === 'square') return 'the cell in row ' + (Math.floor(f.s / F.n) + 1) + ', column ' + (f.s % F.n + 1) + ' would have no number left that fits';
    if (f.s != null && F.slotLines[f.s].length) return 'a ' + (F.kind === 'hexagon' ? 'cell' : 'circle') + ' on ' + F.names[F.slotLines[f.s][0]] + ' would have no number left that fits';
    return 'some gap would have no number left that fits';
  }

  // the next number that reasoning places from the arrangement a (only correct numbers in it)
  function hintStep(F, a) {
    const b = a.slice();
    const st = nextStep(F, b, F.target, false);
    if (!st || st.kind === 'fail') return st && st.kind === 'fail' ? { fail: st } : null;
    st.text = sayStep(F, st);
    return st;
  }

  /* ---------- grading and making ---------- */

  function grade(F) {
    const r = reason(F);
    const c = r.counts;
    const blanks = F.N - Object.keys(F.givens).length;
    let score = (c.last || 0) * 0.5 + (c.only || 0) * 2 + (c.place || 0) * 2.5 + (c.trial || 0) * 6 + blanks * 0.3;
    if (!r.solved) score += 25 + (F.N - r.a.filter((v) => v).length) * 1.5;
    const lv = score < 6 ? 1 : score < 12 ? 2 : score < 20 ? 3 : score < 32 ? 4 : 5;
    return { level: lv, score: Math.round(score * 10) / 10, counts: c, solved: r.solved };
  }

  // a random full arrangement of a figure (null if the search runs long)
  function randomFill(F, rng, nodeLimit) {
    const r = count(F, { limit: 1, nodeLimit: nodeLimit || 3e5, shuffle: (arr) => rng.shuffle(arr) });
    return r.n ? r.first : null;
  }

  // givens for a full arrangement: added until the answer is unique, then thinned out
  function chooseGivens(F0, sol, rng, extra) {
    const d = Object.assign({}, F0.d, { givens: [] });
    const slots = rng.shuffle(Array.from({ length: F0.N }, (_, i) => i));
    const gv = [];
    const uniq = () => {
      const F = figure(Object.assign({}, d, { givens: gv.map((s) => [s, sol[s]]) }));
      const r = count(F, { limit: 2, nodeLimit: 1.5e6 });
      return r.aborted ? -1 : r.n;
    };
    for (const s of slots) {
      const n = uniq();
      if (n === 1) break;
      if (n < 0 && gv.length > F0.N * 0.7) return null;
      gv.push(s);
    }
    if (uniq() !== 1) return null;
    for (let i = gv.length - 1; i >= 0; i--) {
      const s = gv[i];
      gv.splice(i, 1);
      if (uniq() !== 1) gv.splice(i, 0, s);
    }
    // easier puzzles: a few more numbers printed
    let added = 0;
    for (const s of slots) {
      if (added >= (extra || 0)) break;
      if (gv.indexOf(s) < 0) { gv.push(s); added++; }
    }
    return gv.sort((x, y) => x - y).map((s) => [s, sol[s]]);
  }

  // one new puzzle for the endless drawers (kind: 'squares' or 'figures')
  function make(rng, level, kind) {
    const pickSq = [null, [3], [3, 4], [4], [4, 5], [5]][level];
    const pickFig = [null, ['tri3', 'wheel3', 'tri4'], ['tri4', 'pent', 'wheel4'], ['tri4', 'tri5', 'star6', 'pent'], ['star6', 'tri5', 'star7', 'hex'], ['star6', 'star7', 'hex', 'tri5']][level];
    for (let attempt = 0; attempt < 6; attempt++) {
      let d;
      if (kind === 'squares') {
        const n = rng.pick(pickSq);
        if (n === 3 && rng() < 0.5) {
          // an arithmetic run of nine numbers
          const a0 = rng.range(1, 12), step = rng.pick([1, 2, 3, 5]);
          const nums = Array.from({ length: 9 }, (_, i) => a0 + i * step);
          d = { fig: 'square', n: 3, nums, target: 3 * nums[4] };
        } else d = { fig: 'square', n, target: n * (n * n + 1) / 2 };
      } else {
        const f = rng.pick(pickFig);
        if (f === 'tri3') d = { fig: 'triangle', k: 3, target: rng.pick([9, 10, 11, 12]) };
        else if (f === 'tri4') d = { fig: 'triangle', k: 4, target: rng.pick([17, 19, 20, 21, 23]) };
        else if (f === 'tri5') d = { fig: 'triangle', k: 5, target: rng.range(26, 32) };
        else if (f === 'pent') d = { fig: 'polygon', sides: 5, k: 3, target: rng.range(14, 19) };
        else if (f === 'wheel3') d = { fig: 'wheel', spokes: 3, target: rng.pick([10, 12, 14]) };
        else if (f === 'wheel4') d = { fig: 'wheel', spokes: 4, target: rng.pick([12, 15, 18]) };
        else if (f === 'star6') d = { fig: 'star', points: 6, target: 26 };
        else if (f === 'star7') d = { fig: 'star', points: 7, target: 30 };
        else d = { fig: 'hexagon', target: 38 };
      }
      const F0 = figure(d);
      const sol = randomFill(F0, rng, d.fig === 'square' && d.n === 5 ? 4e5 : 3e5);
      if (!sol) continue;
      const extra = [0, 2, 1, 0, 0, 0][level];
      const gv = chooseGivens(F0, sol, rng, extra);
      if (!gv) continue;
      const dd = Object.assign({}, d, { givens: gv, sol });
      const g = solvable(dd, sol, rng);
      if (g && Math.abs(g.level - level) <= 1) return { d: dd, grade: g };
    }
    return null;
  }

  // print more numbers until reasoning alone finishes the puzzle (so every hint has a reason); dd.givens grows
  function solvable(dd, sol, rng) {
    let F = figure(dd), g = grade(F);
    const N = F.N;
    for (let k = 0; k < N && !g.solved; k++) {
      // add the given that lets reasoning go furthest
      const r = reason(F);
      const open = [];
      for (let s = 0; s < N; s++) if (!r.a[s]) open.push(s);
      if (!open.length || dd.givens.length > N * 0.7) return null;
      let best = null, bestGot = -1;
      for (const s of rng.shuffle(open).slice(0, 8)) {
        const F2 = figure(Object.assign({}, dd, { givens: dd.givens.concat([[s, sol[s]]]) }));
        const got = reason(F2).a.filter((v) => v).length;
        if (got > bestGot) { bestGot = got; best = s; }
      }
      dd.givens = dd.givens.concat([[best, sol[best]]]).sort((x, y) => x[0] - y[0]);
      F = figure(dd);
      g = grade(F);
    }
    return g.solved ? g : null;
  }

  /* ---------- exports (more below) ---------- */
  const Magic = C.Magic = C.Magic || {};
  Object.assign(Magic, { candidates, nextStep, reason, sayStep, hintStep, grade, randomFill, chooseGivens, make, solvable });
  Object.assign(Magic, { figure, square, triangle, polygon, star, hexagon, wheel, graph, bbox, problems, lineVal, count, possibleTargets });
})(typeof window !== 'undefined' ? window : globalThis);
