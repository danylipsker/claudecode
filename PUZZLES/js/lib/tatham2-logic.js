/* The Puzzle Cabinet · js/lib/tatham2-logic.js
 *
 * The reasoning behind engines/tatham2.js (Net, Magnets, Tracks, Signpost,
 * Range), node-safe so that verify(), the generator (tools/gen/tatham2.js),
 * the Endless drawers and the live hints all use the same code.
 *
 * Every kind has the same parts:
 *   prep      the puzzle as arrays
 *   prop      rule propagation by levels (1 the plain rules … 3 the clever ones);
 *             returns null or the contradiction it met
 *   count     solutions by propagation and branching (verify: exactly one)
 *   grade     how far logic of each level gets from the start; top level used
 *   step      the next deduction from a player's position, explained in words
 *   make      a random puzzle, adjusted until logic of a chosen level solves it
 * All deterministic for a given rng.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const L = {};
  C.tatham2Logic = L;

  /* ---------- words and small helpers ---------- */

  const ORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const word = (n) => ORD[n] || String(n);
  const cellName = (i, w) => 'row ' + (Math.floor(i / w) + 1) + ', column ' + (i % w + 1);
  const plural = (n, one, many) => word(n) + ' ' + (n === 1 ? one : (many || one + 's'));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const now = () => (root.performance && root.performance.now ? root.performance.now() : Date.now());
  function listAnd(a) { return a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }
  function listOr(a) { return a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]; }
  function toRows(arr, w, f) {
    const rows = [];
    for (let r = 0; r < arr.length / w; r++) { let s = ''; for (let c = 0; c < w; c++) s += f(arr[r * w + c], r * w + c); rows.push(s); }
    return rows;
  }
  L.word = word; L.cellName = cellName; L.listAnd = listAnd; L.toRows = toRows; L.now = now;

  function dsu(n) {
    const p = new Int32Array(n);
    for (let i = 0; i < n; i++) p[i] = i;
    const find = (x) => { while (p[x] !== x) { p[x] = p[p[x]]; x = p[x]; } return x; };
    return { p, find, union(a, b) { a = find(a); b = find(b); if (a === b) return false; p[a] = b; return true; } };
  }
  const POP16 = new Uint8Array(1 << 16);
  for (let i = 1; i < 1 << 16; i++) POP16[i] = POP16[i >> 1] + (i & 1);
  const lowBit = (x) => 31 - Math.clz32(x & -x);

  /* =====================================================================
   *  NET
   *  Tiles carry pipes towards some of their four sides (bits 1 up,
   *  2 right, 4 down, 8 left). Turn them so that all pipes join into one
   *  tree: every pipe meets a pipe, no loops, everything connected.
   * ===================================================================== */

  const NDR = [-1, 0, 1, 0], NDC = [0, 1, 0, -1];
  const SIDE = ['up', 'right', 'down', 'left'];
  const SIDE_OF = ['above', 'to the right of', 'below', 'to the left of'];
  const EDGE_NAME = ['top', 'right', 'bottom', 'left'];
  const BITS = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];
  const rot1 = (m) => ((m << 1) | (m >> 3)) & 15;               // a quarter turn clockwise
  function orients(m) { const out = []; let x = m; for (let k = 0; k < 4; k++) { if (out.indexOf(x) < 0) out.push(x); x = rot1(x); } return out; }
  function netType(m) { const b = BITS[m]; return b === 1 ? 'end' : b === 3 ? 'tee' : b === 4 ? 'cross' : b === 0 ? 'blank' : (m === 5 || m === 10) ? 'straight' : 'bend'; }
  const NET_NAME = { end: 'end piece', straight: 'straight', bend: 'bend', tee: 'T-piece', cross: 'cross', blank: 'blank tile' };
  function armsText(m) {
    if (m === 5) return 'up and down';
    if (m === 10) return 'left and right';
    const a = [];
    for (let d = 0; d < 4; d++) if (m & (1 << d)) a.push(SIDE[d]);
    return listAnd(a);
  }
  L.netRot = rot1; L.netOrients = orients; L.netType = netType; L.NET_NAME = NET_NAME; L.netArms = armsText; L.BITS = BITS;

  L.netPrep = function (w, h, wrap, tiles, src) {
    const N = w * h;
    const nb = new Int32Array(4 * N).fill(-1), eid = new Int32Array(4 * N).fill(-1);
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w;
      for (let d = 0; d < 4; d++) {
        let rr = r + NDR[d], cc = c + NDC[d];
        if (wrap) { rr = (rr + h) % h; cc = (cc + w) % w; } else if (rr < 0 || rr >= h || cc < 0 || cc >= w) continue;
        nb[4 * i + d] = rr * w + cc;
      }
    }
    // edge 2i is the right side of cell i, 2i+1 its bottom side
    const ea = new Int32Array(2 * N).fill(-1), eb = new Int32Array(2 * N).fill(-1);
    for (let i = 0; i < N; i++) {
      const j = nb[4 * i + 1], k = nb[4 * i + 2];
      if (j >= 0) { eid[4 * i + 1] = 2 * i; eid[4 * j + 3] = 2 * i; ea[2 * i] = i; eb[2 * i] = j; }
      if (k >= 0) { eid[4 * i + 2] = 2 * i + 1; eid[4 * k] = 2 * i + 1; ea[2 * i + 1] = i; eb[2 * i + 1] = k; }
    }
    const opts = new Uint16Array(N), list = [];
    for (let i = 0; i < N; i++) { const o = orients(tiles[i]); list.push(o); for (const m of o) opts[i] |= 1 << m; }
    return { w, h, N, wrap: !!wrap, nb, eid, ea, eb, tiles: Array.from(tiles), opts, list, src: src || 0 };
  };

  // the starting knowledge: every turn allowed (or the locked one), two end pieces never face each other
  function netStart(P, locked) {
    const al = new Uint16Array(P.N), ed = new Int8Array(2 * P.N).fill(-1);
    for (let i = 0; i < P.N; i++) al[i] = locked && locked[i] >= 0 ? 1 << locked[i] : P.opts[i];
    for (let e = 0; e < 2 * P.N; e++) {
      if (P.ea[e] < 0) { ed[e] = 0; continue; }
      if (P.N > 2 && BITS[P.tiles[P.ea[e]]] === 1 && BITS[P.tiles[P.eb[e]]] === 1) ed[e] = 0;
    }
    return { al, ed };
  }
  L.netStart = netStart;
  const netClone = (S) => ({ al: Uint16Array.from(S.al), ed: Int8Array.from(S.ed) });

  /* Rules until nothing changes. Level 1: every tile against its known sides;
   * 2: no loops; 3: no group of tiles shut off from the rest. */
  function netProp(P, S, level) {
    const { N, eid, ea, eb } = P, al = S.al, ed = S.ed, E = 2 * N;
    for (let guard = 0; guard < 4 * N + 50; guard++) {
      let changed = false;
      for (let i = 0; i < N; i++) {
        let must = 0, not = 0;
        for (let d = 0; d < 4; d++) {
          const e = eid[4 * i + d];
          if (e < 0 || ed[e] === 0) not |= 1 << d; else if (ed[e] === 1) must |= 1 << d;
        }
        let a = al[i], and = 15, or = 0;
        for (const m of P.list[i]) {
          if (!(a & (1 << m))) continue;
          if ((m & must) !== must || (m & not)) { a &= ~(1 << m); continue; }
          and &= m; or |= m;
        }
        if (!a) return { t: 'tile', i };
        if (a !== al[i]) { al[i] = a; changed = true; }
        for (let d = 0; d < 4; d++) {
          const e = eid[4 * i + d];
          if (e < 0 || ed[e] >= 0) continue;
          if (and & (1 << d)) { ed[e] = 1; changed = true; } else if (!(or & (1 << d))) { ed[e] = 0; changed = true; }
        }
      }
      if (changed) continue;
      if (level < 2) return null;
      const U = dsu(N);
      for (let e = 0; e < E; e++) if (ed[e] === 1 && !U.union(ea[e], eb[e])) return { t: 'loop', e };
      for (let e = 0; e < E; e++) if (ed[e] < 0 && U.find(ea[e]) === U.find(eb[e])) { ed[e] = 0; changed = true; }
      if (changed) continue;
      if (level < 3) return null;
      const out = new Int32Array(N), size = new Int32Array(N);
      for (let i = 0; i < N; i++) size[U.find(i)]++;
      for (let e = 0; e < E; e++) if (ed[e] < 0) { out[U.find(ea[e])]++; out[U.find(eb[e])]++; }
      for (let i = 0; i < N; i++) if (U.p[i] === i && size[i] < N && out[i] === 0) return { t: 'shut', i };
      for (let e = 0; e < E; e++) {
        if (ed[e] >= 0) continue;
        const a = U.find(ea[e]), b = U.find(eb[e]);
        if ((out[a] === 1 && size[a] < N) || (out[b] === 1 && size[b] < N)) { ed[e] = 1; changed = true; }
      }
      if (changed) continue;
      const pair = new Map();
      for (let e = 0; e < E; e++) {
        if (ed[e] >= 0) continue;
        const a = U.find(ea[e]), b = U.find(eb[e]), key = a < b ? a * N + b : b * N + a;
        pair.set(key, (pair.get(key) || 0) + 1);
      }
      for (let e = 0; e < E; e++) {
        if (ed[e] >= 0) continue;
        const a = U.find(ea[e]), b = U.find(eb[e]), key = a < b ? a * N + b : b * N + a;
        if (out[a] + out[b] - 2 * pair.get(key) === 0 && size[a] + size[b] < N) { ed[e] = 0; changed = true; }
      }
      if (!changed) return null;
    }
    return null;
  }
  L.netProp = netProp;

  const netOpen = (P, S) => { let k = 0; for (let i = 0; i < P.N; i++) if (POP16[S.al[i]] > 1) k++; return k; };
  const netMeasure = (P, S) => { let k = 0; for (let i = 0; i < P.N; i++) k += POP16[S.al[i]]; for (let e = 0; e < 2 * P.N; e++) if (S.ed[e] < 0) k++; return k; };

  // solutions: up to `limit`, each as an array of masks
  L.netCount = function (P, locked, limit, nodeCap) {
    limit = limit || 2;
    const cap = nodeCap || 60000;
    let count = 0, nodes = 0;
    const sols = [];
    const rec = (S) => {
      if (count >= limit || nodes > cap) return;
      nodes++;
      if (netProp(P, S, 3)) return;
      let best = -1, bc = 99;
      for (let i = 0; i < P.N; i++) { const k = POP16[S.al[i]]; if (k > 1 && k < bc) { bc = k; best = i; if (k === 2) break; } }
      if (best < 0) {
        const m = Array.from(S.al, lowBit), U = dsu(P.N);
        let joins = 0;
        for (let e = 0; e < 2 * P.N; e++) if (S.ed[e] === 1 && U.union(P.ea[e], P.eb[e])) joins++;
        if (joins !== P.N - 1) return;
        count++; sols.push(m);
        return;
      }
      for (const m of P.list[best]) {
        if (!(S.al[best] & (1 << m))) continue;
        const S2 = netClone(S);
        S2.al[best] = 1 << m;
        rec(S2);
        if (count >= limit) return;
      }
    };
    rec(netStart(P, locked));
    return { count, sols, nodes, capped: nodes > cap };
  };

  /* How far logic gets: level 1 rules, then 2, then 3, then (maxLevel 4) one
   * turn tried at a time. used[k] = how often level k was needed. */
  L.netGrade = function (P, maxLevel, S0) {
    const S = S0 ? netClone(S0) : netStart(P, null);
    const used = [0, 0, 0, 0, 0];
    for (let guard = 0; guard < 4 * P.N; guard++) {
      if (netProp(P, S, 1)) return { ok: false, open: -1, used, top: 0 };
      if (!netOpen(P, S)) break;
      let progressed = false;
      for (let lv = 2; lv <= Math.min(3, maxLevel) && !progressed; lv++) {
        const before = netMeasure(P, S);
        if (netProp(P, S, lv)) return { ok: false, open: -1, used, top: 0 };
        if (netMeasure(P, S) < before) { used[lv]++; progressed = true; }
      }
      if (!progressed && maxLevel >= 4) {
        for (let i = 0; i < P.N; i++) {
          if (POP16[S.al[i]] < 2) continue;
          for (const m of P.list[i]) {
            if (!(S.al[i] & (1 << m))) continue;
            const S2 = netClone(S);
            S2.al[i] = 1 << m;
            if (netProp(P, S2, 3)) { S.al[i] &= ~(1 << m); progressed = true; }
          }
          if (progressed) break;
        }
        if (progressed) used[4]++;
      }
      if (!progressed) break;
    }
    let top = 1;
    for (let k = 4; k >= 2; k--) if (used[k]) { top = k; break; }
    return { ok: true, open: netOpen(P, S), used, top, S };
  };

  /* The next tile a person can settle, from the tiles they have locked
   * (locked[i] = mask or -1; every lock right). Returns
   * { level, set: [[cell, mask]], focus: [cells], text } or null. */
  L.netStep = function (P, locked, maxLevel, sol) {
    maxLevel = maxLevel || 5;
    const { N, w, nb } = P;
    const isLocked = (j) => locked[j] >= 0;
    const tname = (i) => (i === P.src ? 'source' : NET_NAME[netType(P.tiles[i])]);
    // groups of locked tiles joined by their pipes
    const U = dsu(N);
    for (let i = 0; i < N; i++) {
      if (!isLocked(i)) continue;
      for (let d = 1; d <= 2; d++) {
        const j = nb[4 * i + d];
        if (j >= 0 && isLocked(j) && (locked[i] >> d & 1) && (locked[j] >> ((d + 2) & 3) & 1)) U.union(i, j);
      }
    }
    const gsize = new Int32Array(N), gopen = new Int32Array(N);
    for (let i = 0; i < N; i++) {
      if (!isLocked(i)) continue;
      const r = U.find(i);
      gsize[r]++;
      for (let d = 0; d < 4; d++) if ((locked[i] >> d & 1) && nb[4 * i + d] >= 0 && !isLocked(nb[4 * i + d])) gopen[r]++;
    }
    function why(i, m, lvl) {
      const t = P.tiles[i];
      for (let d = 0; d < 4; d++) {
        const bit = m >> d & 1, j = nb[4 * i + d];
        if (j < 0) { if (bit) return { k: 'edge', d }; continue; }
        if (isLocked(j)) {
          const back = locked[j] >> ((d + 2) & 3) & 1;
          if (back && !bit) return { k: 'miss', d, j };
          if (!back && bit) return { k: 'into', d, j };
        } else if (bit && N > 2 && BITS[t] === 1 && BITS[P.tiles[j]] === 1) return { k: 'ends', d, j };
      }
      if (lvl < 2) return null;
      const seen = [];
      let open = 0, size = 1;
      for (let d = 0; d < 4; d++) {
        if (!(m >> d & 1)) continue;
        const j = nb[4 * i + d];
        if (j < 0) continue;
        if (!isLocked(j)) { open++; continue; }
        const r = U.find(j);
        if (seen.indexOf(r) >= 0) return { k: 'loop', d, j };
        seen.push(r);
      }
      for (const r of seen) { size += gsize[r]; open += gopen[r] - 1; }
      if (open === 0 && size < N) return { k: 'shut', size };
      return null;
    }
    function reasonText(i, rs) {
      const parts = [], kinds = {};
      rs.forEach((r) => { (kinds[r.k] = kinds[r.k] || []).push(r); });
      if (kinds.edge) {
        const sides = [];
        for (let d = 0; d < 4; d++) if (nb[4 * i + d] < 0) sides.push(EDGE_NAME[d]);
        parts.push('no pipe may run off the ' + listAnd(sides) + ' edge' + (sides.length > 1 ? 's' : '') + ' of the board');
      }
      const byD = (list) => Array.from(new Set(list.map((r) => r.d))).sort();
      if (kinds.miss) parts.push(listAnd(byD(kinds.miss).map((d) => 'the locked ' + tname(nb[4 * i + d]) + ' ' + SIDE_OF[d] + ' it')) + ' point' + (byD(kinds.miss).length > 1 ? '' : 's') + ' a pipe at it, which must be met');
      if (kinds.into) parts.push(listAnd(byD(kinds.into).map((d) => 'the locked ' + tname(nb[4 * i + d]) + ' ' + SIDE_OF[d] + ' it')) + ' ha' + (byD(kinds.into).length > 1 ? 've' : 's') + ' no pipe facing it');
      if (kinds.ends) parts.push('an end piece must not point at the end piece ' + listOr(byD(kinds.ends).map((d) => SIDE_OF[d] + ' it')) + ' (the pair would be cut off from everything else)');
      if (kinds.loop) parts.push('some turns would close a loop through your locked tiles');
      if (kinds.shut) parts.push('some turns would shut a group of tiles off from the rest of the network');
      return parts;
    }
    const cands = [];
    for (const lvl of [1, 2]) {
      if (lvl > maxLevel) break;
      for (let i = 0; i < N; i++) {
        if (isLocked(i) || P.list[i].length < 2) continue;
        const live = [], rs = [];
        for (const m of P.list[i]) { const r = why(i, m, lvl); if (r) rs.push(r); else live.push(m); }
        if (live.length === 1) {
          let score = 0;
          for (let d = 0; d < 4; d++) { const j = nb[4 * i + d]; if (j < 0 || isLocked(j)) score--; }
          cands.push({ i, m: live[0], rs, score });
        }
      }
      if (cands.length) {
        cands.sort((a, b) => a.score - b.score || a.i - b.i);
        const c = cands[0];
        const parts = reasonText(c.i, c.rs);
        return { level: lvl, set: [[c.i, c.m]], focus: [c.i], text: 'The ' + tname(c.i) + ' at ' + cellName(c.i, w) + ' can sit only one way: ' + listAnd(parts) + '. So it points ' + armsText(c.m) + '.' };
      }
    }
    if (maxLevel < 3) return null;
    // work outwards: everything the rules give from the locked tiles
    const S = netStart(P, locked);
    if (netProp(P, S, 3)) return null;
    for (let i = 0; i < N; i++) {
      if (isLocked(i) || POP16[S.al[i]] !== 1 || P.list[i].length < 2) continue;
      const m = lowBit(S.al[i]);
      const parts = [];
      for (let d = 0; d < 4; d++) {
        const j = nb[4 * i + d], e = P.eid[4 * i + d];
        if (j < 0 || isLocked(j) || e < 0 || S.ed[e] < 0) continue;
        parts.push('the ' + tname(j) + ' ' + SIDE_OF[d] + ' it ' + (S.ed[e] ? 'must point at it' : 'cannot point at it'));
      }
      const tail = parts.length ? 'Work outwards from your locked tiles (and remember: no loops, nothing cut off): ' + listAnd(parts) + '.' : 'Work outwards from your locked tiles, remembering that there are no loops and nothing may be cut off.';
      return { level: 3, set: [[i, m]], focus: [i], text: tail + ' So the ' + tname(i) + ' at ' + cellName(i, w) + ' points ' + armsText(m) + '.' };
    }
    if (maxLevel >= 4) {
      for (let i = 0; i < N; i++) {
        if (isLocked(i) || POP16[S.al[i]] < 2) continue;
        const live = [], bad = [];
        for (const m of P.list[i]) {
          if (!(S.al[i] & (1 << m))) continue;
          const S2 = netClone(S);
          S2.al[i] = 1 << m;
          const c = netProp(P, S2, 3);
          if (c) bad.push({ m, c }); else live.push(m);
        }
        if (live.length !== 1) continue;
        const b = bad[0];
        const what = b.c.t === 'loop' ? 'a loop would close' : b.c.t === 'shut' ? 'a group of tiles would be shut off' : 'the tile at ' + cellName(b.c.i, w) + ' could not be turned to fit';
        return { level: 4, set: [[i, live[0]]], focus: [i], text: 'Suppose the ' + tname(i) + ' at ' + cellName(i, w) + ' pointed ' + armsText(b.m) + '. Follow the tiles around it and ' + what + '.' + (bad.length > 1 ? ' The other wrong turns fail the same way.' : '') + ' So it points ' + armsText(live[0]) + '.' };
      }
    }
    if (maxLevel < 5 || !sol) return null;
    for (let i = 0; i < N; i++) {
      if (isLocked(i) || P.list[i].length < 2) continue;
      return { level: 5, set: [[i, sol[i]]], focus: [i], text: 'This needs a long chain of reasoning. The ' + tname(i) + ' at ' + cellName(i, w) + ' points ' + armsText(sol[i]) + ' — can you see why?' };
    }
    return null;
  };

  /* ---- making a Net ---- */

  // a random spanning tree with no crosses, grown from the source
  function netTree(w, h, wrap, src, rng) {
    const P = L.netPrep(w, h, wrap, new Array(w * h).fill(0), src);
    const N = w * h, inT = new Uint8Array(N), deg = new Int8Array(N), on = new Uint8Array(2 * N);
    inT[src] = 1;
    let front = [];
    const addFront = (i) => { for (let d = 0; d < 4; d++) { const j = P.nb[4 * i + d]; if (j >= 0 && !inT[j]) front.push([i, d]); } };
    addFront(src);
    for (let added = 1; added < N;) {
      front = front.filter(([i, d]) => !inT[P.nb[4 * i + d]] && deg[i] < 3);
      if (!front.length) return null;
      const [i, d] = front[rng.int(front.length)];
      const j = P.nb[4 * i + d];
      on[P.eid[4 * i + d]] = 1; deg[i]++; deg[j]++; inT[j] = 1; added++;
      addFront(j);
    }
    return { P, on, deg };
  }
  function netMasks(P, on) {
    const m = new Array(P.N).fill(0);
    for (let i = 0; i < P.N; i++) for (let d = 0; d < 4; d++) { const e = P.eid[4 * i + d]; if (e >= 0 && on[e]) m[i] |= 1 << d; }
    return m;
  }

  /* A tree that logic up to maxLevel solves: grow one, then swap edges near
   * the tiles logic cannot settle until it can (or give up). */
  L.netMake = function (w, h, wrap, rng, maxLevel, opts) {
    opts = opts || {};
    const N = w * h;
    const src = wrap ? rng.int(N) : Math.floor(h / 2) * w + Math.floor(w / 2);
    const T = netTree(w, h, wrap, src, rng);
    if (!T) return null;
    const P0 = T.P, on = T.on, deg = T.deg;
    const judge = () => { const m = netMasks(P0, on); const g = L.netGrade(L.netPrep(w, h, wrap, m, src), maxLevel); return { m, g }; };
    let cur = judge();
    const t0 = now(), budget = opts.budget || 400;
    for (let it = 0; cur.g.open > 0 && it < (opts.iters || 300) && now() - t0 < budget; it++) {
      if (cur.g.open < 0) return null;
      const openCells = [];
      for (let i = 0; i < N; i++) if (POP16[cur.g.S.al[i]] > 1) openCells.push(i);
      const c = openCells[rng.int(openCells.length)];
      // a tree edge at or next to c
      const near = [];
      for (let d = 0; d < 4; d++) { const e = P0.eid[4 * c + d]; if (e >= 0 && on[e]) near.push(e); }
      if (!near.length) continue;
      const e1 = near[rng.int(near.length)];
      on[e1] = 0; deg[P0.ea[e1]]--; deg[P0.eb[e1]]--;
      // the side of the tree that holds ea[e1]
      const side = new Uint8Array(N), stack = [P0.ea[e1]];
      side[P0.ea[e1]] = 1;
      while (stack.length) {
        const i = stack.pop();
        for (let d = 0; d < 4; d++) { const e = P0.eid[4 * i + d], j = P0.nb[4 * i + d]; if (e >= 0 && on[e] && !side[j]) { side[j] = 1; stack.push(j); } }
      }
      const cr = Math.floor(c / w), cc = c % w;
      const dist = (i) => { let dr = Math.abs(Math.floor(i / w) - cr), dc = Math.abs(i % w - cc); if (wrap) { dr = Math.min(dr, h - dr); dc = Math.min(dc, w - dc); } return dr + dc; };
      const cand = [];
      for (let e = 0; e < 2 * N; e++) {
        if (e === e1 || on[e] || P0.ea[e] < 0) continue;
        const a = P0.ea[e], b = P0.eb[e];
        if (side[a] === side[b] || deg[a] >= 3 || deg[b] >= 3) continue;
        if (Math.min(dist(a), dist(b)) <= 2) cand.push(e);
      }
      if (!cand.length) { on[e1] = 1; deg[P0.ea[e1]]++; deg[P0.eb[e1]]++; continue; }
      const e2 = cand[rng.int(cand.length)];
      on[e2] = 1; deg[P0.ea[e2]]++; deg[P0.eb[e2]]++;
      const nxt = judge();
      if (nxt.g.open >= 0 && nxt.g.open <= cur.g.open) cur = nxt;
      else { on[e2] = 0; deg[P0.ea[e2]]--; deg[P0.eb[e2]]--; on[e1] = 1; deg[P0.ea[e1]]++; deg[P0.eb[e1]]++; }
    }
    if (cur.g.open !== 0) return null;
    const sol = cur.m;
    // scramble: every tile turned at random, none left the right way round if it can help it
    const tiles = sol.map((m) => {
      const o = orients(m);
      if (o.length < 2) return m;
      let x = m;
      for (let k = 1 + rng.int(3); k > 0; k--) x = rot1(x);
      return x === m ? rot1(m) : x;
    });
    return { w, h, wrap: !!wrap, src, sol, tiles, grade: cur.g };
  };

  L.netDiff = function (w, h, wrap, g) {
    const area = w * h;
    const size = area <= 25 ? 0.2 : area <= 49 ? 1.1 : area <= 81 ? 2 : area <= 121 ? 2.9 : 3.6;
    const logic = [0, 0, 0.3, 0.9, 1.6][g.top] + Math.min(0.6, (g.used[3] + 2 * g.used[4]) * 0.05);
    return clamp(Math.round(1 + size + logic + (wrap ? 0.9 : 0) - 0.2), 1, 5);
  };

  /* =====================================================================
   *  MAGNETS
   *  Dominoes cover the grid; each is a magnet (a + half and a − half) or
   *  blank. Like poles never touch side by side; the numbers count the +
   *  (top, left) and − (bottom, right) halves in each line.
   *  Cell values: bits 1 +, 2 −, 4 blank.
   * ===================================================================== */

  const SWAP = [0, 2, 1, 3, 4, 6, 5, 7];              // + and − exchanged, blank kept
  const POLE = ['', '**+**', '**−**'];
  L.magPrep = function (w, h, dom, clues) {
    const N = w * h, part = new Int32Array(N), domOf = new Int32Array(N), doms = [];
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const i = r * w + c, ch = dom[r][c];
      part[i] = ch === 'L' ? i - 1 : ch === 'R' ? i + 1 : ch === 'T' ? i - w : i + w;
    }
    for (let i = 0; i < N; i++) if (part[i] > i) { domOf[i] = domOf[part[i]] = doms.length; doms.push([i, part[i]]); }
    const adj = [];
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w, a = [];
      if (r > 0) a.push(i - w); if (r < h - 1) a.push(i + w); if (c > 0) a.push(i - 1); if (c < w - 1) a.push(i + 1);
      adj.push(a.filter((j) => j !== part[i]));
    }
    const lines = [];
    for (let r = 0; r < h; r++) { const a = []; for (let c = 0; c < w; c++) a.push(r * w + c); lines.push(a); }
    for (let c = 0; c < w; c++) { const a = []; for (let r = 0; r < h; r++) a.push(r * w + c); lines.push(a); }
    const need = [clues.rp.concat(clues.cp), clues.rm.concat(clues.cm)];
    return { w, h, N, part, domOf, doms, adj, lines, need };
  };
  const magLine = (P, li) => (li < P.h ? 'row ' + (li + 1) : 'column ' + (li - P.h + 1));
  const MagLine = (P, li) => { const s = magLine(P, li); return s[0].toUpperCase() + s.slice(1); };
  L.magLine = magLine;

  // every way to fill one line that fits its counts; null if too many to try
  function magLineEnum(P, D, li) {
    const cells = P.lines[li], n = cells.length, kp = P.need[0][li], km = P.need[1][li];
    const sufP = new Int32Array(n + 1), sufM = new Int32Array(n + 1);
    for (let t = n - 1; t >= 0; t--) { sufP[t] = sufP[t + 1] + (D[cells[t]] & 1 ? 1 : 0); sufM[t] = sufM[t + 1] + (D[cells[t]] & 2 ? 1 : 0); }
    const poss = new Uint8Array(n), cur = new Uint8Array(n);
    let found = 0, work = 0;
    const dfs = (t, np, nm) => {
      if (++work > 40000) return;
      if (kp >= 0 && (np > kp || np + sufP[t] < kp)) return;
      if (km >= 0 && (nm > km || nm + sufM[t] < km)) return;
      if (t === n) { found++; for (let s = 0; s < n; s++) poss[s] |= cur[s]; return; }
      const i = cells[t];
      for (const v of [1, 2, 4]) {
        if (!(D[i] & v)) continue;
        if (t > 0) {
          const pv = cur[t - 1];
          if (P.part[i] === cells[t - 1]) { if (v !== SWAP[pv]) continue; } else if (v !== 4 && pv === v) continue;
        }
        cur[t] = v;
        dfs(t + 1, np + (v === 1 ? 1 : 0), nm + (v === 2 ? 1 : 0));
      }
    };
    dfs(0, 0, 0);
    if (work > 40000) return null;
    return { found, poss };
  }

  /* The rules, in rounds (round 0 only looks for broken rules). Level 1:
   * dominoes, neighbours and counts; level 2: every way to fill a line.
   * Returns null or the contradiction { t, …, round }. */
  function magProp(P, D, level, maxRounds) {
    const { N, adj, lines, need } = P;
    const R = maxRounds == null ? 1e9 : maxRounds;
    for (let round = 0; round < 4 * N; round++) {
      for (let i = 0; i < N; i++) {
        if (!D[i]) return { t: 'cell', i, round };
        if (D[i] === 1 || D[i] === 2) for (const j of adj[i]) if (D[j] === D[i]) return { t: 'adj', i, j, pole: D[i], round };
      }
      for (let li = 0; li < lines.length; li++) {
        const kp = need[0][li], km = need[1][li];
        for (const pole of [1, 2]) {
          const k = need[pole - 1][li];
          if (k < 0) continue;
          let known = 0, poss = 0;
          for (const i of lines[li]) { if (D[i] === pole) known++; if (D[i] & pole) poss++; }
          if (known > k) return { t: 'over', li, pole, round };
          if (poss < k) return { t: 'under', li, pole, round };
        }
        if (kp >= 0 && km >= 0) {
          const kb = lines[li].length - kp - km;
          let known = 0, poss = 0;
          for (const i of lines[li]) { if (D[i] === 4) known++; if (D[i] & 4) poss++; }
          if (known > kb) return { t: 'blanks', li, more: true, kb, round };
          if (poss < kb) return { t: 'blanks', li, more: false, kb, round };
        }
      }
      if (round >= R) return null;
      let changed = false;
      for (const [a, b] of P.doms) {
        const na = D[a] & SWAP[D[b]], nb = D[b] & SWAP[D[a]];
        if (na !== D[a] || nb !== D[b]) { D[a] = na; D[b] = nb; changed = true; }
      }
      for (let i = 0; i < N; i++) {
        const v = D[i];
        if (v !== 1 && v !== 2) continue;
        for (const j of adj[i]) if (D[j] !== v && (D[j] & v)) { D[j] &= ~v; changed = true; }
      }
      for (let li = 0; li < lines.length; li++) {
        const kp = need[0][li], km = need[1][li];
        const todo = [[1, kp], [2, km]];
        if (kp >= 0 && km >= 0) todo.push([4, lines[li].length - kp - km]);
        for (const [v, k] of todo) {
          if (k < 0) continue;
          let known = 0, poss = 0;
          for (const i of lines[li]) { if (D[i] === v) known++; if (D[i] & v) poss++; }
          if (known === poss) continue;
          if (known === k) { for (const i of lines[li]) if (D[i] !== v && (D[i] & v)) { D[i] &= ~v; changed = true; } } else if (poss === k) { for (const i of lines[li]) if (D[i] & v && D[i] !== v) { D[i] = v; changed = true; } }
        }
      }
      if (!changed && level >= 2) {
        for (let li = 0; li < lines.length; li++) {
          const r = magLineEnum(P, D, li);
          if (!r) continue;
          if (!r.found) return { t: 'line', li, round };
          const cells = lines[li];
          for (let s = 0; s < cells.length; s++) { const nv = D[cells[s]] & r.poss[s]; if (nv !== D[cells[s]]) { D[cells[s]] = nv; changed = true; } }
          if (changed) break;
        }
      }
      if (!changed) return null;
    }
    return null;
  }
  L.magProp = magProp;

  const magOpen = (P, D) => { let k = 0; for (let i = 0; i < P.N; i++) if (POP16[D[i]] > 1) k++; return k; };
  const magMeasure = (P, D) => { let k = 0; for (let i = 0; i < P.N; i++) k += POP16[D[i]]; return k; };
  // the cell values that a user's domino marks give (0 none, 1 + on the first cell, 2 + on the second, 3 blank, 4 a magnet either way)
  L.magDomains = function (P, marks) {
    const D = new Uint8Array(P.N).fill(7);
    P.doms.forEach(([a, b], k) => {
      const m = marks ? marks[k] : 0;
      if (m === 1) { D[a] = 1; D[b] = 2; } else if (m === 2) { D[a] = 2; D[b] = 1; } else if (m === 3) { D[a] = D[b] = 4; } else if (m === 4) { D[a] = D[b] = 3; }
    });
    return D;
  };

  L.magCount = function (P, D0, limit, nodeCap) {
    limit = limit || 2;
    const cap = nodeCap || 100000;
    let count = 0, nodes = 0;
    const sols = [];
    const rec = (D) => {
      if (count >= limit || nodes > cap) return;
      nodes++;
      if (magProp(P, D, 1)) return;
      let best = -1, bc = 9;
      for (let k = 0; k < P.doms.length; k++) { const c = POP16[D[P.doms[k][0]]]; if (c > 1 && c < bc) { bc = c; best = k; if (c === 2) break; } }
      if (best < 0) { count++; sols.push(Uint8Array.from(D)); return; }
      const [a, b] = P.doms[best];
      for (const v of [1, 2, 4]) {
        if (!(D[a] & v)) continue;
        const D2 = Uint8Array.from(D);
        D2[a] = v; D2[b] = SWAP[v];
        rec(D2);
        if (count >= limit) return;
      }
    };
    rec(D0 ? Uint8Array.from(D0) : new Uint8Array(P.N).fill(7));
    return { count, sols, nodes, capped: nodes > cap };
  };

  L.magGrade = function (P, maxLevel, D0) {
    const D = D0 ? Uint8Array.from(D0) : new Uint8Array(P.N).fill(7);
    const used = [0, 0, 0, 0];
    for (let guard = 0; guard < 4 * P.N; guard++) {
      if (magProp(P, D, 1)) return { ok: false, open: -1, used, top: 0 };
      if (!magOpen(P, D)) break;
      let progressed = false;
      if (maxLevel >= 2) {
        const before = magMeasure(P, D);
        if (magProp(P, D, 2)) return { ok: false, open: -1, used, top: 0 };
        if (magMeasure(P, D) < before) { used[2]++; progressed = true; }
      }
      if (!progressed && maxLevel >= 3) {
        for (const [a, b] of P.doms) {
          if (POP16[D[a]] < 2) continue;
          for (const v of [1, 2, 4]) {
            if (!(D[a] & v)) continue;
            const D2 = Uint8Array.from(D);
            D2[a] = v; D2[b] = SWAP[v];
            if (magProp(P, D2, 2)) { D[a] &= ~v; D[b] &= ~SWAP[v]; progressed = true; }
          }
          if (progressed) break;
        }
        if (progressed) used[3]++;
      }
      if (!progressed) break;
    }
    let top = 1;
    for (let k = 3; k >= 2; k--) if (used[k]) { top = k; break; }
    return { ok: true, open: magOpen(P, D), used, top, D };
  };

  function magDomName(P, k) {
    const [a, b] = P.doms[k], w = P.w;
    return b === a + 1 ? 'the domino in row ' + (Math.floor(a / w) + 1) + ', columns ' + (a % w + 1) + '–' + (a % w + 2)
      : 'the domino in column ' + (a % w + 1) + ', rows ' + (Math.floor(a / w) + 1) + '–' + (Math.floor(a / w) + 2);
  }
  L.magDomName = magDomName;
  function magStateName(P, k, v) {
    if (v === 4) return 'blank';
    const [a, b] = P.doms[k], horiz = b === a + 1;
    const plusFirst = v === 1;
    return 'a magnet with its **+** ' + (horiz ? (plusFirst ? 'on the left' : 'on the right') : (plusFirst ? 'at the top' : 'at the bottom'));
  }
  function magWhy(P, c) {
    const w = P.w;
    if (c.t === 'adj') return 'two ' + POLE[c.pole] + ' halves would touch (' + cellName(c.i, w) + ' and ' + cellName(c.j, w) + ')';
    if (c.t === 'over') return P.need[c.pole - 1][c.li] === 0 ? magLine(P, c.li) + ' would get a ' + POLE[c.pole] + ', and it has none at all' : magLine(P, c.li) + ' would have more than ' + word(P.need[c.pole - 1][c.li]) + ' ' + POLE[c.pole] + (P.need[c.pole - 1][c.li] === 1 ? '' : 's');
    if (c.t === 'under') return magLine(P, c.li) + ' could not find room for its ' + word(P.need[c.pole - 1][c.li]) + ' ' + POLE[c.pole] + (P.need[c.pole - 1][c.li] === 1 ? '' : 's');
    if (c.t === 'blanks') return magLine(P, c.li) + ' (' + P.need[0][c.li] + ' **+** and ' + P.need[1][c.li] + ' **−**) must have exactly ' + word(c.kb) + ' blank cell' + (c.kb === 1 ? '' : 's') + ', and it would have ' + (c.more ? 'more' : 'fewer');
    if (c.t === 'line') return magLine(P, c.li) + ' could not be filled in at all';
    return 'the cell at ' + cellName(c.i, w) + ' could be neither **+**, **−** nor blank';
  }

  /* The next domino a person can settle. marks: per domino (see magDomains);
   * every mark right. Returns { level, set: [[domino, mark]], focus: [cells], text }. */
  L.magStep = function (P, marks, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const D0 = L.magDomains(P, marks);
    const base = Uint8Array.from(D0);
    if (magProp(P, base, 1, 0)) return null;
    for (const pl of [1, 2]) {
      if (pl === 2 && maxLevel < 3) break;
      let best = null;
      P.doms.forEach(([a, b], k) => {
        const mk = marks[k];
        if (mk >= 1 && mk <= 3) return;
        const live = [], dead = [];
        for (const v of [1, 2, 4]) {
          if (!(D0[a] & v)) continue;
          const D = Uint8Array.from(D0);
          D[a] = v; D[b] = SWAP[v];
          const c = magProp(P, D, pl, pl === 1 ? 3 : 2);
          if (c) dead.push({ v, c }); else live.push(v);
        }
        if (!dead.length) return;
        let res = null;
        if (live.length === 1) res = live[0] === 1 ? 1 : live[0] === 2 ? 2 : 3;
        else if (mk !== 4 && live.length === 2 && live.indexOf(4) < 0) res = 4;
        if (!res) return;
        const depth = Math.max.apply(null, dead.map((x) => x.c.round));
        const score = (pl - 1) * 10 + depth + (res === 4 ? 0.5 : 0);
        if (!best || score < best.score) best = { k, res, dead, depth, score, pl };
      });
      if (best) {
        const k = best.k, [a, b] = P.doms[k];
        let dead = best.dead;
        const says = [];
        const m1 = dead.find((x) => x.v === 1), m2 = dead.find((x) => x.v === 2);
        if (m1 && m2 && !m1.c.round && !m2.c.round && m1.c.t === m2.c.t && m1.c.li != null && m1.c.li === m2.c.li && m1.c.pole === m2.c.pole) {
          says.push('If it were a magnet, either way round, ' + magWhy(P, m1.c) + '.');
          dead = dead.filter((x) => x.v === 4);
        }
        dead.forEach((x) => says.push('If it were ' + magStateName(P, k, x.v) + ', ' + (x.c.round ? 'follow the rules from there and ' : '') + magWhy(P, x.c) + '.'));
        const res = best.res === 4 ? 'So it cannot be blank: it is a magnet, though which way round is not settled yet (mark it with **?**).'
          : 'So it is ' + magStateName(P, k, best.res === 1 ? 1 : best.res === 2 ? 2 : 4) + '.';
        const level = best.pl === 2 ? 3 : best.depth === 0 ? 1 : 2;
        return { level, set: [[k, best.res]], focus: [a, b], text: 'Look at ' + magDomName(P, k) + '. ' + says.join(' ') + ' ' + res };
      }
    }
    if (maxLevel < 4 || !sol) return null;
    for (let k = 0; k < P.doms.length; k++) {
      if (marks[k] >= 1 && marks[k] <= 3) continue;
      const [a, b] = P.doms[k];
      const v = sol[a] === '+' ? 1 : sol[a] === '-' ? 2 : 3;
      return { level: 4, set: [[k, v]], focus: [a, b], text: 'This needs a long chain of reasoning. ' + magDomName(P, k)[0].toUpperCase() + magDomName(P, k).slice(1) + ' is ' + magStateName(P, k, v === 3 ? 4 : v) + ' — can you see why?' };
    }
    return null;
  };

  /* ---- making Magnets ---- */

  function magTiling(w, h, rng) {
    const N = w * h, part = new Int32Array(N);
    if (w % 2 === 0) for (let i = 0; i < N; i++) part[i] = (i % w) % 2 ? i - 1 : i + 1;
    else for (let i = 0; i < N; i++) part[i] = Math.floor(i / w) % 2 ? i - w : i + w;
    for (let it = 0; it < N * 14; it++) {
      const i = rng.int(h - 1) * w + rng.int(w - 1);
      if (part[i] === i + 1 && part[i + w] === i + w + 1) { part[i] = i + w; part[i + w] = i; part[i + 1] = i + 1 + w; part[i + 1 + w] = i + 1; } else if (part[i] === i + w && part[i + 1] === i + 1 + w) { part[i] = i + 1; part[i + 1] = i; part[i + w] = i + w + 1; part[i + w + 1] = i + w; }
    }
    const rows = [];
    for (let r = 0; r < h; r++) {
      let s = '';
      for (let c = 0; c < w; c++) { const i = r * w + c, j = part[i]; s += j === i - 1 ? 'L' : j === i + 1 ? 'R' : j === i - w ? 'T' : 'B'; }
      rows.push(s);
    }
    return rows;
  }
  function magCluesOf(v, w, h) {
    const rp = [], rm = [], cp = [], cm = [];
    for (let r = 0; r < h; r++) { let p = 0, m = 0; for (let c = 0; c < w; c++) { if (v[r * w + c] === 1) p++; if (v[r * w + c] === 2) m++; } rp.push(p); rm.push(m); }
    for (let c = 0; c < w; c++) { let p = 0, m = 0; for (let r = 0; r < h; r++) { if (v[r * w + c] === 1) p++; if (v[r * w + c] === 2) m++; } cp.push(p); cm.push(m); }
    return { rp, rm, cp, cm };
  }
  L.magCluesOf = magCluesOf;
  // place one domino's contents at random (blank, or a magnet that fits its neighbours)
  function magPlace(P, v, k, rng, pBlank) {
    const [a, b] = P.doms[k];
    v[a] = v[b] = 0;
    if (rng() < pBlank) { v[a] = v[b] = 4; return; }
    const ok = (i, x) => P.adj[i].every((j) => v[j] !== x);
    const opts = [[1, 2], [2, 1]].filter(([x, y]) => ok(a, x) && ok(b, y));
    if (!opts.length) { v[a] = v[b] = 4; return; }
    const [x, y] = opts[rng.int(opts.length)];
    v[a] = x; v[b] = y;
  }

  /* A puzzle that logic up to maxLevel solves. hide: how many clues to try
   * taking away afterwards (they stay away only if logic still solves it). */
  L.magMake = function (w, h, rng, maxLevel, opts) {
    opts = opts || {};
    const dom = magTiling(w, h, rng);
    const P0 = L.magPrep(w, h, dom, { rp: new Array(h).fill(-1), rm: new Array(h).fill(-1), cp: new Array(w).fill(-1), cm: new Array(w).fill(-1) });
    const v = new Uint8Array(w * h);
    const pBlank = opts.pBlank == null ? 0.3 : opts.pBlank;
    rng.shuffle(P0.doms.map((_, k) => k)).forEach((k) => magPlace(P0, v, k, rng, pBlank));
    const judge = () => { const cl = magCluesOf(v, w, h); const P = L.magPrep(w, h, dom, cl); return { cl, P, g: L.magGrade(P, maxLevel) }; };
    let cur = judge();
    const t0 = now(), budget = opts.budget || 400;
    for (let it = 0; cur.g.open > 0 && it < 200 && now() - t0 < budget; it++) {
      const open = [];
      P0.doms.forEach(([a], k) => { if (POP16[cur.g.D[a]] > 1) open.push(k); });
      const k = open[rng.int(open.length)], [a, b] = P0.doms[k];
      const keep = [v[a], v[b]];
      magPlace(P0, v, k, rng, 0.5);
      if (v[a] === keep[0]) { if (v[a] === 4) magPlace(P0, v, k, rng, 0); else { v[a] = v[b] = 4; } }
      const nxt = judge();
      if (nxt.g.ok && nxt.g.open <= cur.g.open) cur = nxt; else { v[a] = keep[0]; v[b] = keep[1]; }
    }
    if (cur.g.open !== 0) return null;
    let cl = cur.cl, g = cur.g;
    const hide = opts.hide || 0;
    if (hide) {
      const slots = [];
      ['rp', 'rm', 'cp', 'cm'].forEach((key) => cl[key].forEach((_, j) => slots.push([key, j])));
      let hidden = 0;
      for (const [key, j] of rng.shuffle(slots)) {
        if (hidden >= hide) break;
        const keep = cl[key][j];
        cl[key][j] = -1;
        const g2 = L.magGrade(L.magPrep(w, h, dom, cl), maxLevel);
        if (g2.ok && g2.open === 0) { hidden++; g = g2; } else cl[key][j] = keep;
      }
    }
    const sol = toRows(v, w, (x) => (x === 1 ? '+' : x === 2 ? '-' : '.'));
    return { w, h, dom, sol, clues: cl, grade: g };
  };

  L.magDiff = function (w, h, g, hidden) {
    const area = w * h;
    const size = area <= 30 ? 0 : area <= 42 ? 0.5 : area <= 56 ? 1 : area <= 72 ? 1.5 : 2;
    return clamp(Math.round(1 + size + [0, 0, 1, 2][g.top] + Math.min(1, g.used[2] * 0.08 + g.used[3] * 0.25) + Math.min(0.8, (hidden || 0) * 0.06) - 0.3), 1, 5);
  };

  /* =====================================================================
   *  TRACKS
   *  A railway enters at A (the left side of row a) and leaves at B (the
   *  bottom of column b). Clues count the track squares of every row and
   *  column; the track never branches or crosses itself.
   *  Edges: 2i = right side of cell i, 2i+1 = bottom side; 2N = A, 2N+1 = B.
   * ===================================================================== */

  L.trkPrep = function (w, h, ra, cb, rows, cols, givens) {
    const N = w * h, E = 2 * N + 2;
    const nb = new Int32Array(4 * N).fill(-1), eid = new Int32Array(4 * N).fill(-1);
    const ea = new Int32Array(E).fill(-1), eb = new Int32Array(E).fill(-1);
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (r > 0) nb[4 * i] = i - w;
      if (c < w - 1) { nb[4 * i + 1] = i + 1; eid[4 * i + 1] = 2 * i; eid[4 * (i + 1) + 3] = 2 * i; ea[2 * i] = i; eb[2 * i] = i + 1; }
      if (r < h - 1) { nb[4 * i + 2] = i + w; eid[4 * i + 2] = 2 * i + 1; eid[4 * (i + w)] = 2 * i + 1; ea[2 * i + 1] = i; eb[2 * i + 1] = i + w; }
      if (c > 0) nb[4 * i + 3] = i - 1;
    }
    const A = ra * w, B = (h - 1) * w + cb;
    eid[4 * A + 3] = 2 * N; ea[2 * N] = A;
    eid[4 * B + 2] = 2 * N + 1; ea[2 * N + 1] = B;
    const lines = [];
    for (let r = 0; r < h; r++) { const a = []; for (let c = 0; c < w; c++) a.push(r * w + c); lines.push(a); }
    for (let c = 0; c < w; c++) { const a = []; for (let r = 0; r < h; r++) a.push(r * w + c); lines.push(a); }
    const cuts = [];
    for (let r = 0; r < h - 1; r++) { const es = []; for (let c = 0; c < w; c++) es.push(2 * (r * w + c) + 1); cuts.push({ es, odd: ra <= r, row: true, k: r }); }
    for (let c = 0; c < w - 1; c++) { const es = []; for (let r = 0; r < h; r++) es.push(2 * (r * w + c)); cuts.push({ es, odd: cb > c, row: false, k: c }); }
    const gmask = new Int8Array(N).fill(-1);
    (givens || []).forEach(([i, m]) => { gmask[i] = m; });
    const clue = rows.concat(cols);
    return { w, h, N, E, ra, cb, A, B, nb, eid, ea, eb, lines, clue, cuts, gmask, total: rows.reduce((s, x) => s + x, 0) };
  };
  const trkLine = (P, li) => (li < P.h ? 'row ' + (li + 1) : 'column ' + (li - P.h + 1));
  const TrkLine = (P, li) => { const s = trkLine(P, li); return s[0].toUpperCase() + s.slice(1); };
  L.trkLine = trkLine;

  // what is known at the start: the ends, the given pieces, the sides of the board
  L.trkStart = function (P) {
    const q = new Int8Array(P.N).fill(-1), ed = new Int8Array(P.E).fill(-1);
    for (let e = 0; e < 2 * P.N; e++) if (P.ea[e] < 0) ed[e] = 0;
    ed[2 * P.N] = ed[2 * P.N + 1] = 1;
    for (let i = 0; i < P.N; i++) {
      if (P.gmask[i] < 0) continue;
      q[i] = 1;
      for (let d = 0; d < 4; d++) { const e = P.eid[4 * i + d]; if (e >= 0) ed[e] = P.gmask[i] >> d & 1; }
    }
    return { q, ed };
  };
  const trkClone = (S) => ({ q: Int8Array.from(S.q), ed: Int8Array.from(S.ed) });

  /* Level 1: squares (two track sides or none) and the counts; 2: no loops,
   * and A may not join B while track is still missing; 3: crossing parity. */
  function trkProp(P, S, level) {
    const { N, eid, ea, eb, lines, clue } = P, q = S.q, ed = S.ed;
    for (let guard = 0; guard < 8 * N + 50; guard++) {
      let changed = false;
      for (let i = 0; i < N; i++) {
        let on = 0, unk = 0;
        for (let d = 0; d < 4; d++) { const e = eid[4 * i + d]; if (e < 0) continue; if (ed[e] === 1) on++; else if (ed[e] < 0) unk++; }
        if (on > 2) return { t: 'branch', i };
        if (on && q[i] === 0) return { t: 'emptyon', i };
        if (on && q[i] < 0) { q[i] = 1; changed = true; }
        if (q[i] === 1) {
          if (on + unk < 2) return { t: 'dead', i };
          if (unk && (on === 2 || on + unk === 2)) {
            const val = on === 2 ? 0 : 1;
            for (let d = 0; d < 4; d++) { const e = eid[4 * i + d]; if (e >= 0 && ed[e] < 0) ed[e] = val; }
            changed = true;
          }
        } else if (q[i] < 0 && on + unk < 2) { q[i] = 0; changed = true; }
        if (q[i] === 0 && unk) { for (let d = 0; d < 4; d++) { const e = eid[4 * i + d]; if (e >= 0 && ed[e] < 0) ed[e] = 0; } changed = true; }
      }
      for (let li = 0; li < lines.length; li++) {
        let known = 0, unk = 0;
        for (const i of lines[li]) { if (q[i] === 1) known++; else if (q[i] < 0) unk++; }
        if (known > clue[li]) return { t: 'over', li };
        if (known + unk < clue[li]) return { t: 'under', li };
        if (!unk) continue;
        if (known === clue[li]) { for (const i of lines[li]) if (q[i] < 0) q[i] = 0; changed = true; } else if (known + unk === clue[li]) { for (const i of lines[li]) if (q[i] < 0) q[i] = 1; changed = true; }
      }
      if (changed) continue;
      if (level < 2) return null;
      const U = dsu(N);
      for (let e = 0; e < 2 * N; e++) if (ed[e] === 1 && !U.union(ea[e], eb[e])) return { t: 'loop', e };
      const size = new Int32Array(N);
      for (let i = 0; i < N; i++) if (q[i] === 1) size[U.find(i)]++;
      const rA = U.find(P.A), rB = U.find(P.B);
      if (rA === rB) {
        for (let i = 0; i < N; i++) {
          if (U.find(i) === rA) continue;
          if (q[i] === 1) return { t: 'finish', i };
          if (q[i] < 0) { q[i] = 0; changed = true; }
        }
        if (changed) continue;
      }
      let outside = 0;
      for (let i = 0; i < N; i++) if (q[i] === 1 && U.find(i) !== rA && U.find(i) !== rB) outside++;
      for (let e = 0; e < 2 * N; e++) {
        if (ed[e] >= 0) continue;
        const a = U.find(ea[e]), b = U.find(eb[e]);
        if (a === b) { ed[e] = 0; changed = true; } else if ((a === rA && b === rB) || (a === rB && b === rA)) {
          if (outside || size[a] + size[b] < P.total) { ed[e] = 0; changed = true; }
        }
      }
      if (changed) continue;
      if (level < 3) return null;
      for (let k = 0; k < P.cuts.length; k++) {
        const cut = P.cuts[k];
        let on = 0, unk = 0, last = -1;
        for (const e of cut.es) { if (ed[e] === 1) on++; else if (ed[e] < 0) { unk++; last = e; } }
        const want = cut.odd ? 1 : 0;
        if (!unk) { if ((on & 1) !== want) return { t: 'parity', k }; } else if (unk === 1) { ed[last] = (on & 1) !== want ? 1 : 0; changed = true; }
      }
      if (!changed) return null;
    }
    return null;
  }
  L.trkProp = trkProp;

  const trkOpen = (P, S) => { let k = 0; for (let i = 0; i < P.N; i++) if (S.q[i] < 0) k++; for (let e = 0; e < 2 * P.N; e++) if (S.ed[e] < 0) k++; return k; };
  function trkMasks(P, S) {
    const m = new Array(P.N).fill(0);
    for (let i = 0; i < P.N; i++) for (let d = 0; d < 4; d++) { const e = P.eid[4 * i + d]; if (e >= 0 && S.ed[e] === 1) m[i] |= 1 << d; }
    return m;
  }
  L.trkMasks = trkMasks;

  L.trkCount = function (P, S0, limit, nodeCap) {
    limit = limit || 2;
    const cap = nodeCap || 100000;
    let count = 0, nodes = 0;
    const sols = [];
    const rec = (S) => {
      if (count >= limit || nodes > cap) return;
      nodes++;
      if (trkProp(P, S, 3)) return;
      let best = -1, bu = 9;
      for (let i = 0; i < P.N; i++) {
        if (S.q[i] !== 1) continue;
        let on = 0, unk = 0;
        for (let d = 0; d < 4; d++) { const e = P.eid[4 * i + d]; if (e < 0) continue; if (S.ed[e] === 1) on++; else if (S.ed[e] < 0) unk++; }
        if (on === 1 && unk >= 2 && unk < bu) { bu = unk; best = i; }
      }
      if (best >= 0) {
        for (let d = 0; d < 4; d++) {
          const e = P.eid[4 * best + d];
          if (e < 0 || S.ed[e] >= 0) continue;
          const S2 = trkClone(S);
          S2.ed[e] = 1;
          rec(S2);
          if (count >= limit) return;
        }
        return;
      }
      let cell = -1;
      for (let i = 0; i < P.N; i++) if (S.q[i] < 0) { cell = i; break; }
      if (cell >= 0) {
        for (const val of [1, 0]) { const S2 = trkClone(S); S2.q[cell] = val; rec(S2); if (count >= limit) return; }
        return;
      }
      let edge = -1;
      for (let e = 0; e < 2 * P.N; e++) if (S.ed[e] < 0) { edge = e; break; }
      if (edge >= 0) {
        for (const val of [1, 0]) { const S2 = trkClone(S); S2.ed[edge] = val; rec(S2); if (count >= limit) return; }
        return;
      }
      count++;
      sols.push(trkMasks(P, S));
    };
    rec(L.trkStart(P));
    return { count, sols, nodes, capped: nodes > cap };
  };

  L.trkGrade = function (P, maxLevel, S0) {
    const S = S0 ? trkClone(S0) : L.trkStart(P);
    const used = [0, 0, 0, 0, 0];
    const measure = () => trkOpen(P, S);
    for (let guard = 0; guard < 6 * P.N; guard++) {
      if (trkProp(P, S, 1)) return { ok: false, open: -1, used, top: 0 };
      if (!trkOpen(P, S)) break;
      let progressed = false;
      for (let lv = 2; lv <= Math.min(3, maxLevel) && !progressed; lv++) {
        const before = measure();
        if (trkProp(P, S, lv)) return { ok: false, open: -1, used, top: 0 };
        if (measure() < before) { used[lv]++; progressed = true; }
      }
      if (!progressed && maxLevel >= 4) {
        for (let e = 0; e < 2 * P.N && !progressed; e++) {
          if (S.ed[e] >= 0) continue;
          for (const val of [1, 0]) {
            const S2 = trkClone(S);
            S2.ed[e] = val;
            if (trkProp(P, S2, 3)) { S.ed[e] = 1 - val; progressed = true; break; }
          }
        }
        if (progressed) used[4]++;
      }
      if (!progressed) break;
    }
    let top = 1;
    for (let k = 4; k >= 2; k--) if (used[k]) { top = k; break; }
    return { ok: true, open: trkOpen(P, S), used, top, S };
  };

  function trkWhy(P, c) {
    const w = P.w;
    if (c.t === 'branch') return 'the track at ' + cellName(c.i, w) + ' would branch';
    if (c.t === 'emptyon') return 'track would run into the empty square at ' + cellName(c.i, w);
    if (c.t === 'dead') return 'the track at ' + cellName(c.i, w) + ' would come to a dead end';
    if (c.t === 'over') return trkLine(P, c.li) + ' would get more than its ' + P.clue[c.li] + ' track squares';
    if (c.t === 'under') return trkLine(P, c.li) + ' could not get its ' + P.clue[c.li] + ' track squares';
    if (c.t === 'loop') return 'the track would close into a loop';
    if (c.t === 'finish') return 'the track would reach B with a track square left over';
    if (c.t === 'parity') return 'the track would cross the line ' + trkCutName(P, P.cuts[c.k]) + ' an ' + (P.cuts[c.k].odd ? 'even' : 'odd') + ' number of times, which it cannot';
    return 'the rules would break';
  }
  function trkCutName(P, cut) { return cut.row ? 'between rows ' + (cut.k + 1) + ' and ' + (cut.k + 2) : 'between columns ' + (cut.k + 1) + ' and ' + (cut.k + 2); }
  function trkEdgeName(P, e) {
    const w = P.w, i = P.ea[e];
    if (e >= 2 * P.N) return e === 2 * P.N ? 'A' : 'B';
    return (e & 1) ? 'between ' + cellName(i, w) + ' and the square below it' : 'between ' + cellName(i, w) + ' and the square to its right';
  }
  L.trkEdgeName = trkEdgeName;

  /* The next step from a player's position. S0: { q, ed } with every mark
   * right. Returns { level, set: [['e', edge, 1 track | 0 none] | ['q', cell, 1 | 0]], focus, text }. */
  L.trkStep = function (P, S0, maxLevel, sol) {
    maxLevel = maxLevel || 5;
    const { N, w, eid, lines, clue } = P;
    const S = trkClone(S0);
    // what the marks say by themselves: a square with track in it is a track square, a full square takes nothing more
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < N; i++) {
        let on = 0;
        for (let d = 0; d < 4; d++) { const e = eid[4 * i + d]; if (e >= 0 && S.ed[e] === 1) on++; }
        if (on && S.q[i] < 0) S.q[i] = 1;
        if (on === 2 || S.q[i] === 0) for (let d = 0; d < 4; d++) { const e = eid[4 * i + d]; if (e >= 0 && S.ed[e] < 0) S.ed[e] = 0; }
      }
    }
    const info = (i) => {
      let on = 0, unk = 0;
      const open = [];
      for (let d = 0; d < 4; d++) { const e = eid[4 * i + d]; if (e < 0) continue; if (S.ed[e] === 1) on++; else if (S.ed[e] < 0) { unk++; open.push(d); } }
      return { on, unk, open };
    };
    // 1: the counts
    for (let li = 0; li < lines.length; li++) {
      let known = 0;
      const unk = [];
      for (const i of lines[li]) { if (S.q[i] === 1) known++; else if (S.q[i] < 0) unk.push(i); }
      if (!unk.length) continue;
      if (known === clue[li]) return { level: 1, set: unk.map((i) => ['q', i, 0]), focus: lines[li], text: TrkLine(P, li) + ' needs ' + plural(clue[li], 'track square') + ' and already has ' + (clue[li] === 1 ? 'it' : clue[li] === 0 ? 'none to find' : 'them all') + ': the rest of it stays empty.' };
      if (known + unk.length === clue[li]) return { level: 1, set: unk.map((i) => ['q', i, 1]), focus: lines[li], text: TrkLine(P, li) + ' needs ' + plural(clue[li], 'track square') + ', and only ' + word(clue[li]) + ' of its squares can still take track: every one of them does.' };
    }
    // 1: single squares
    for (let i = 0; i < N; i++) {
      const f = info(i);
      if (S.q[i] === 1 && f.on < 2 && f.on + f.unk === 2 && f.unk) {
        const set = f.open.map((d) => ['e', eid[4 * i + d], 1]);
        const dirs = f.open.map((d) => SIDE[d]);
        const text = f.on === 1 ? 'The track at ' + cellName(i, w) + ' must go on, and only one way is open: it continues ' + dirs[0] + '.'
          : 'The square at ' + cellName(i, w) + ' carries track, but only two of its sides are open: the track runs ' + dirs[0] + ' and ' + dirs[1] + '.';
        return { level: 1, set, focus: [i], text };
      }
      if (S.q[i] < 0 && f.on + f.unk < 2) return { level: 1, set: [['q', i, 0]], focus: [i], text: 'No track can pass through the square at ' + cellName(i, w) + ': it has ' + (f.unk ? 'only one open side' : 'no open side at all') + '.' };
    }
    if (maxLevel < 2) return null;
    // 2: loops and an early finish
    const U = dsu(N);
    for (let e = 0; e < 2 * N; e++) if (S.ed[e] === 1) U.union(P.ea[e], P.eb[e]);
    const size = new Int32Array(N);
    for (let i = 0; i < N; i++) if (S.q[i] === 1) size[U.find(i)]++;
    const rA = U.find(P.A), rB = U.find(P.B);
    let outside = 0;
    for (let i = 0; i < N; i++) if (S.q[i] === 1 && U.find(i) !== rA && U.find(i) !== rB) outside++;
    for (let e = 0; e < 2 * N; e++) {
      if (S.ed[e] >= 0) continue;
      const a = U.find(P.ea[e]), b = U.find(P.eb[e]);
      if (a === b && size[a] > 1) return { level: 2, set: [['e', e, 0]], focus: [P.ea[e], P.eb[e]], text: 'The squares at ' + cellName(P.ea[e], w) + ' and ' + cellName(P.eb[e], w) + ' are the two ends of one piece of track: joining them would close it into a loop. No track between them.' };
      if ((a === rA && b === rB) || (a === rB && b === rA)) {
        if (outside || size[a] + size[b] < P.total) return { level: 2, set: [['e', e, 0]], focus: [P.ea[e], P.eb[e]], text: 'Joining ' + cellName(P.ea[e], w) + ' to ' + cellName(P.eb[e], w) + ' would finish the line from A to B — but ' + (outside ? 'there is track elsewhere that would be left out' : 'the clues still want more track') + '. No track between them.' };
      }
    }
    if (maxLevel < 3) return null;
    // 3: parity of the crossings
    for (const cut of P.cuts) {
      let on = 0, unk = 0, last = -1;
      for (const e of cut.es) { if (S.ed[e] === 1) on++; else if (S.ed[e] < 0) { unk++; last = e; } }
      if (unk !== 1) continue;
      const val = (on & 1) !== (cut.odd ? 1 : 0) ? 1 : 0;
      const where = cut.row ? (cut.odd ? 'A is above the line ' + trkCutName(P, cut) + ' and B below it' : 'A and B are both below the line ' + trkCutName(P, cut))
        : (cut.odd ? 'A is left of the line ' + trkCutName(P, cut) + ' and B right of it' : 'A and B are both left of the line ' + trkCutName(P, cut));
      return { level: 3, set: [['e', last, val]], focus: [P.ea[last], P.eb[last]], text: 'Count crossings: ' + where + ', so the track crosses that line an ' + (cut.odd ? 'odd' : 'even') + ' number of times. Every crossing but one is settled (' + plural(on, 'crossing') + ' so far), so the last place, ' + trkEdgeName(P, last) + ', ' + (val ? 'must carry track.' : 'must stay empty.') };
    }
    if (maxLevel >= 4) {
      const T = trkClone(S);
      if (!trkProp(P, T, 3)) {
        // try the sides of the ends of the track first
        const order = [];
        for (let e = 0; e < 2 * N; e++) if (T.ed[e] < 0) order.push(e);
        const near = (e) => (S.q[P.ea[e]] === 1 || S.q[P.eb[e]] === 1 ? 0 : 1);
        order.sort((a, b) => near(a) - near(b) || a - b);
        for (const e of order) {
          for (const val of [1, 0]) {
            const S2 = trkClone(T);
            S2.ed[e] = val;
            const c = trkProp(P, S2, 3);
            if (!c) continue;
            return { level: 4, set: [['e', e, 1 - val]], focus: [P.ea[e], P.eb[e]], text: 'Suppose ' + (val ? 'the track ran ' : 'no track ran ') + trkEdgeName(P, e) + '. Follow the rules from there and ' + trkWhy(P, c) + '. So ' + (val ? 'there is no track there.' : 'the track does run there.') };
          }
        }
      }
    }
    if (maxLevel < 5 || !sol) return null;
    for (let e = 0; e < 2 * N; e++) {
      if (S.ed[e] >= 0 || P.ea[e] < 0) continue;
      const i = P.ea[e], d = e & 1 ? 2 : 1;
      const val = sol[i] >> d & 1;
      return { level: 5, set: [['e', e, val]], focus: [i, P.eb[e]], text: 'This needs a long chain of reasoning. ' + (val ? 'The track runs ' : 'No track runs ') + trkEdgeName(P, e) + ' — can you see why?' };
    }
    return null;
  };

  /* ---- making Tracks ---- */

  // a winding path from (ra, 0) to (h-1, cb): start with an L, then bend it with bumps and corner flips
  function trkPath(w, h, ra, cb, rng, fill) {
    let path = [];
    for (let c = 0; c <= cb; c++) path.push(ra * w + c);
    for (let r = ra + 1; r < h; r++) path.push(r * w + cb);
    const used = new Uint8Array(w * h);
    path.forEach((i) => { used[i] = 1; });
    const target = Math.round(w * h * fill);
    const inG = (r, c) => r >= 0 && r < h && c >= 0 && c < w;
    for (let it = 0; it < 60 * w * h && path.length < target; it++) {
      const t = rng.int(path.length - 1);
      const a = path[t], b = path[t + 1];
      const ar = Math.floor(a / w), ac = a % w, br = Math.floor(b / w), bc = b % w;
      if (rng() < 0.35 && t + 2 < path.length) {
        // flip a corner a-b-c to a-b'-c
        const c = path[t + 2], cr = Math.floor(c / w), cc = c % w;
        if (ar !== cr && ac !== cc) {
          const alt = ar === br ? cr * w + ac : ar * w + cc;
          if (!used[alt]) { used[b] = 0; used[alt] = 1; path[t + 1] = alt; }
        }
        continue;
      }
      const [pr, pc] = ar === br ? [rng() < 0.5 ? 1 : -1, 0] : [0, rng() < 0.5 ? 1 : -1];
      if (!inG(ar + pr, ac + pc) || !inG(br + pr, bc + pc)) continue;
      const c1 = (ar + pr) * w + ac + pc, c2 = (br + pr) * w + bc + pc;
      if (used[c1] || used[c2]) continue;
      used[c1] = used[c2] = 1;
      path.splice(t + 1, 0, c1, c2);
    }
    // the ends must stay where they are (a corner flip may not move them)
    if (path[0] !== ra * w || path[path.length - 1] !== (h - 1) * w + cb) return null;
    return path;
  }
  function trkPathMasks(w, h, path) {
    const m = new Array(w * h).fill(0);
    const dirOf = (a, b) => (b === a - w ? 0 : b === a + 1 ? 1 : b === a + w ? 2 : 3);
    for (let t = 0; t + 1 < path.length; t++) { const d = dirOf(path[t], path[t + 1]); m[path[t]] |= 1 << d; m[path[t + 1]] |= 1 << ((d + 2) & 3); }
    m[path[0]] |= 8;
    m[path[path.length - 1]] |= 4;
    return m;
  }

  L.trkMake = function (w, h, rng, maxLevel, opts) {
    opts = opts || {};
    const ra = rng.int(h - 1), cb = 1 + rng.int(w - 1);
    const path = trkPath(w, h, ra, cb, rng, opts.fill || 0.5);
    if (!path || path.length < w + h - 2) return null;
    const sol = trkPathMasks(w, h, path);
    const rows = [], cols = [];
    for (let r = 0; r < h; r++) { let k = 0; for (let c = 0; c < w; c++) if (sol[r * w + c]) k++; rows.push(k); }
    for (let c = 0; c < w; c++) { let k = 0; for (let r = 0; r < h; r++) if (sol[r * w + c]) k++; cols.push(k); }
    const givens = [];
    let P = null;
    const grade = () => { P = L.trkPrep(w, h, ra, cb, rows, cols, givens); return L.trkGrade(P, maxLevel); };
    let g = grade();
    if (!g.ok) return null;
    const t0 = now(), budget = opts.budget || 400;
    while (g.open > 0) {
      if (now() - t0 > budget || givens.length > path.length / 2) return null;
      // give a piece where logic is stuck
      const cand = [];
      for (const i of path) {
        if (givens.some((x) => x[0] === i)) continue;
        let unk = g.S.q[i] < 0 ? 1 : 0;
        for (let d = 0; d < 4; d++) { const e = P.eid[4 * i + d]; if (e >= 0 && g.S.ed[e] < 0) unk++; }
        if (unk) cand.push(i);
      }
      if (!cand.length) return null;
      const i = cand[rng.int(cand.length)];
      givens.push([i, sol[i]]);
      g = grade();
      if (!g.ok) return null;
    }
    // take back any piece that is not needed
    for (const gv of rng.shuffle(givens.slice())) {
      const k = givens.indexOf(gv);
      givens.splice(k, 1);
      const g2 = grade();
      if (g2.ok && g2.open === 0) g = g2; else givens.splice(k, 0, gv);
    }
    givens.sort((a, b) => a[0] - b[0]);
    return { w, h, ra, cb, rows, cols, givens, sol, grade: g, len: path.length };
  };

  L.trkDiff = function (w, h, g, ngiven) {
    const area = w * h;
    const size = area <= 36 ? 0 : area <= 64 ? 0.7 : area <= 80 ? 1.2 : area <= 100 ? 1.6 : 2.1;
    return clamp(Math.round(1 + size + [0, 0, 0.4, 1, 1.8][g.top] + Math.min(0.6, g.used[4] * 0.12) - Math.min(0.6, ngiven * 0.12)), 1, 5);
  };

  /* =====================================================================
   *  SIGNPOST
   *  Every square has an arrow (the last has none). Number the squares
   *  1 … n so that each arrow points, at any distance, to the next number.
   *  State: nx[i] = the square i leads to, pv[j] = the square leading to j.
   * ===================================================================== */

  const SDR = [-1, -1, 0, 1, 1, 1, 0, -1], SDC = [0, 1, 1, 1, 0, -1, -1, -1];
  const ARROW = ['up', 'up and right', 'right', 'down and right', 'down', 'down and left', 'left', 'up and left'];
  L.SDR = SDR; L.SDC = SDC; L.ARROW = ARROW;

  L.spPrep = function (w, h, dirs, nums) {
    const N = w * h, succ = [], pred = [];
    for (let i = 0; i < N; i++) pred.push([]);
    for (let i = 0; i < N; i++) {
      const a = [], d = dirs[i];
      if (d >= 0) {
        let r = Math.floor(i / w) + SDR[d], c = i % w + SDC[d];
        while (r >= 0 && r < h && c >= 0 && c < w) { a.push(r * w + c); r += SDR[d]; c += SDC[d]; }
      }
      succ.push(a);
      a.forEach((j) => pred[j].push(i));
    }
    const num = new Int32Array(N), numAt = new Int32Array(N + 2).fill(-1);
    for (let i = 0; i < N; i++) { num[i] = nums[i] || 0; if (num[i]) numAt[num[i]] = i; }
    return { w, h, N, dirs: Array.from(dirs), succ, pred, num, numAt, start: numAt[1], end: numAt[N] };
  };
  L.spStart = function (P, links) {
    const S = { nx: new Int32Array(P.N).fill(-1), pv: new Int32Array(P.N).fill(-1), ban: new Uint8Array(P.N * P.N) };
    if (links) for (let i = 0; i < P.N; i++) if (links[i] >= 0) { S.nx[i] = links[i]; S.pv[links[i]] = i; }
    return S;
  };
  const spClone = (S) => ({ nx: Int32Array.from(S.nx), pv: Int32Array.from(S.pv), ban: S.ban });

  // chains: head of every square, its place in the chain, lengths and (when a number is in it) the head's number
  function spChains(P, S) {
    const N = P.N, head = new Int32Array(N).fill(-1), idx = new Int32Array(N), len = new Int32Array(N), pos0 = new Int32Array(N);
    for (let hd = 0; hd < N; hd++) {
      if (S.pv[hd] >= 0) continue;
      let i = hd, k = 0, p0 = 0, from = -1;
      while (i >= 0) {
        head[i] = hd; idx[i] = k;
        if (P.num[i]) {
          const p = P.num[i] - k;
          if (p0 && p !== p0) return { contra: { t: 'numbers', i, j: from } };
          if (!p0) from = i;
          p0 = p;
        }
        k++;
        i = S.nx[i];
        if (k > N) return { contra: { t: 'cycle' } };
      }
      len[hd] = k; pos0[hd] = p0;
      if (p0 && (p0 < 1 || p0 + k - 1 > N)) return { contra: { t: 'range', i: hd } };
    }
    for (let i = 0; i < N; i++) if (head[i] < 0) return { contra: { t: 'cycle', i } };
    return { head, idx, len, pos0 };
  }
  L.spChains = spChains;

  // why the link i -> j cannot be (null if it can): level 1 the plain rules, 2 the numbers
  function spBad(P, S, I, i, j, level) {
    if (S.nx[i] >= 0 && S.nx[i] !== j) return { k: 'used' };
    if (S.pv[j] >= 0 && S.pv[j] !== i) return { k: 'taken', by: S.pv[j] };
    if (j === P.start) return { k: 'start' };
    if (S.ban[i * P.N + j]) return { k: 'ban' };
    const hi = I.head[i];
    if (hi === j) return { k: 'loop' };
    if (level < 2) return null;
    const ai = I.pos0[hi], aj = I.pos0[j], pi = ai ? ai + I.idx[i] : 0;
    if (ai && aj) { if (aj !== pi + 1) return { k: 'num', want: pi + 1, has: aj }; } else if (ai) {
      if (pi + I.len[j] > P.N) return { k: 'past' };
      for (let k = pi + 1; k <= pi + I.len[j]; k++) if (P.numAt[k] >= 0) return { k: 'clash', n: k };
    } else if (aj) {
      if (aj - I.len[hi] < 1) return { k: 'below' };
      for (let k = aj - I.len[hi]; k < aj; k++) if (P.numAt[k] >= 0) return { k: 'clash', n: k };
    }
    return null;
  }
  function spLink(S, i, j) { S.nx[i] = j; S.pv[j] = i; }

  function spProp(P, S, level) {
    const N = P.N;
    for (let guard = 0; guard < 2 * N + 5; guard++) {
      const I = spChains(P, S);
      if (I.contra) return I.contra;
      let did = false;
      for (let i = 0; i < N && !did; i++) {
        if (S.nx[i] >= 0 || i === P.end) continue;
        let one = -1, k = 0;
        for (const j of P.succ[i]) if (!spBad(P, S, I, i, j, level)) { k++; one = j; }
        if (!k) return { t: 'nosucc', i };
        if (k === 1) { spLink(S, i, one); did = true; }
      }
      for (let j = 0; j < N && !did; j++) {
        if (S.pv[j] >= 0 || j === P.start) continue;
        let one = -1, k = 0;
        for (const i of P.pred[j]) if (!spBad(P, S, I, i, j, level)) { k++; one = i; }
        if (!k) return { t: 'nopred', j };
        if (k === 1) { spLink(S, one, j); did = true; }
      }
      if (!did) return null;
    }
    return null;
  }
  L.spProp = spProp;
  const spOpen = (P, S) => { let k = 0; for (let i = 0; i < P.N; i++) if (S.nx[i] < 0 && i !== P.end) k++; return k; };

  L.spCount = function (P, links, limit, nodeCap) {
    limit = limit || 2;
    const cap = nodeCap || 60000;
    let count = 0, nodes = 0;
    const sols = [];
    const rec = (S) => {
      if (count >= limit || nodes > cap) return;
      nodes++;
      if (spProp(P, S, 2)) return;
      const I = spChains(P, S);
      if (I.contra) return;
      let best = -1, bc = 1e9, bl = null;
      for (let i = 0; i < P.N; i++) {
        if (S.nx[i] >= 0 || i === P.end) continue;
        const c = P.succ[i].filter((j) => !spBad(P, S, I, i, j, 2));
        if (c.length < bc) { bc = c.length; best = i; bl = c; }
      }
      if (best < 0) { count++; sols.push(Int32Array.from(S.nx)); return; }
      for (const j of bl) {
        const S2 = spClone(S);
        spLink(S2, best, j);
        rec(S2);
        if (count >= limit) return;
      }
    };
    rec(L.spStart(P));
    return { count, sols, nodes, capped: nodes > cap };
  };

  L.spGrade = function (P, maxLevel, S0) {
    const S = S0 ? spClone(S0) : L.spStart(P);
    S.ban = new Uint8Array(P.N * P.N);
    const used = [0, 0, 0, 0];
    for (let guard = 0; guard < 4 * P.N; guard++) {
      if (spProp(P, S, 1)) return { ok: false, open: -1, used, top: 0 };
      if (!spOpen(P, S)) break;
      let progressed = false;
      if (maxLevel >= 2) {
        const before = spOpen(P, S);
        if (spProp(P, S, 2)) return { ok: false, open: -1, used, top: 0 };
        if (spOpen(P, S) < before) { used[2]++; progressed = true; }
      }
      if (!progressed && maxLevel >= 3) {
        const I = spChains(P, S);
        for (let i = 0; i < P.N && !progressed; i++) {
          if (S.nx[i] >= 0 || i === P.end) continue;
          for (const j of P.succ[i]) {
            if (spBad(P, S, I, i, j, 2)) continue;
            const S2 = spClone(S);
            S2.ban = Uint8Array.from(S.ban);
            spLink(S2, i, j);
            if (spProp(P, S2, 2)) { S.ban[i * P.N + j] = 1; progressed = true; }
          }
        }
        if (progressed) used[3]++;
      }
      if (!progressed) break;
    }
    let top = 1;
    for (let k = 3; k >= 2; k--) if (used[k]) { top = k; break; }
    return { ok: true, open: spOpen(P, S), used, top, S };
  };

  function spWhyNot(P, I, i, j, r) {
    const w = P.w, at = cellName(j, w);
    if (r.k === 'taken') return at + ' already has an arrow leading into it';
    if (r.k === 'start') return at + ' is number 1, and nothing leads to the start';
    if (r.k === 'loop') return at + ' is where this very chain begins, so linking it would make a loop';
    if (r.k === 'num') return at + ' is ' + r.has + ', but the square after ' + cellName(i, w) + ' must be ' + r.want;
    if (r.k === 'past') return 'the chain from ' + at + ' would run past ' + P.N;
    if (r.k === 'below') return 'the chain ending at ' + cellName(i, w) + ' would need numbers below 1';
    if (r.k === 'clash') return at + ' cannot come next: its chain would then need a ' + r.n + ', and ' + r.n + ' is already elsewhere';
    return at + ' is ruled out';
  }
  // the same reasons for several squares, said once
  function spWhyGroups(P, I, i, why) {
    const w = P.w, groups = new Map();
    why.forEach(([j, r]) => { const key = r.k + ':' + (r.n || ''); if (!groups.has(key)) groups.set(key, []); groups.get(key).push([j, r]); });
    const out = [];
    groups.forEach((g) => {
      const r = g[0][1], names = g.map(([j]) => cellName(j, w));
      if (g.length === 1) out.push(spWhyNot(P, I, i, g[0][0], r));
      else if (r.k === 'taken') out.push(listAnd(names) + ' already have arrows leading into them');
      else if (r.k === 'clash') out.push(listOr(names) + ' cannot come next: the chain would then need a ' + r.n + ', and ' + r.n + ' is already elsewhere');
      else if (r.k === 'num') out.push(listAnd(g.map(([j, x]) => cellName(j, w) + ' is ' + x.has)) + ', but the square after ' + cellName(i, w) + ' must be ' + r.want);
      else g.forEach(([j, x]) => out.push(spWhyNot(P, I, i, j, x)));
    });
    return out;
  }
  function spContraText(P, c) {
    const w = P.w;
    if (c.t === 'nosucc') return 'the arrow at ' + cellName(c.i, w) + ' would have nowhere left to lead';
    if (c.t === 'nopred') return 'nothing could lead into ' + cellName(c.j, w);
    if (c.t === 'numbers') return 'two given numbers would end up in one chain the wrong distance apart';
    if (c.t === 'range') return 'a chain would need numbers outside 1 to ' + P.N;
    return 'the links would close a loop';
  }

  /* The next link a person can make. links[i] = the square i leads to or -1
   * (every link right). Returns { level, set: [[from, to]], focus, text }. */
  L.spStep = function (P, links, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const S = L.spStart(P, links), w = P.w;
    const I = spChains(P, S);
    if (I.contra) return null;
    for (const lvl of [1, 2]) {
      if (lvl > maxLevel) break;
      for (let i = 0; i < P.N; i++) {
        if (S.nx[i] >= 0 || i === P.end) continue;
        const ok = [], why = [];
        for (const j of P.succ[i]) { const r = spBad(P, S, I, i, j, lvl); if (r) why.push([j, r]); else ok.push(j); }
        if (ok.length !== 1) continue;
        const j = ok[0];
        const text = P.succ[i].length === 1 ? 'The arrow at ' + cellName(i, w) + ' points ' + ARROW[P.dirs[i]] + ' at a single square, ' + cellName(j, w) + ': link them.'
          : 'The arrow at ' + cellName(i, w) + ' points ' + ARROW[P.dirs[i]] + '. Of the squares that way, ' + listAnd(spWhyGroups(P, I, i, why)) + '. So it leads to ' + cellName(j, w) + '.';
        return { level: lvl, set: [[i, j]], focus: [i, j], text };
      }
      for (let j = 0; j < P.N; j++) {
        if (S.pv[j] >= 0 || j === P.start) continue;
        const ok = [], why = [];
        for (const i of P.pred[j]) { const r = spBad(P, S, I, i, j, lvl); if (r) why.push([i, r]); else ok.push(i); }
        if (ok.length !== 1) continue;
        const i = ok[0];
        const other = why.map(([ii, r]) => (r.k === 'used' ? cellName(ii, w) + ' already leads elsewhere' : r.k === 'loop' ? cellName(ii, w) + ' would close a loop' : r.k === 'num' ? cellName(ii, w) + ' has the wrong number (' + (r.want - 1) + ')' : cellName(ii, w) + ' cannot (' + spWhyNot(P, I, ii, j, r) + ')'));
        const text = P.pred[j].length === 1 ? 'Only one arrow in the grid points at ' + cellName(j, w) + ': the one at ' + cellName(i, w) + '. Something must lead into every square but the first, so link them.'
          : 'Something must lead into ' + cellName(j, w) + ', and of the arrows that point at it, ' + listAnd(other) + '. So the arrow at ' + cellName(i, w) + ' leads there.';
        return { level: lvl, set: [[i, j]], focus: [i, j], text };
      }
    }
    if (maxLevel >= 3) {
      const T = spClone(S);
      T.ban = new Uint8Array(P.N * P.N);
      if (!spProp(P, T, 2)) {
        const I2 = spChains(P, T);
        for (let i = 0; i < P.N; i++) {
          if (S.nx[i] >= 0 || i === P.end) continue;
          if (T.nx[i] >= 0) {
            const j = T.nx[i];
            return { level: 3, set: [[i, j]], focus: [i, j], text: 'Follow the links that are forced from your chains (squares with only one way out or one way in, and the given numbers): they end up linking ' + cellName(i, w) + ' to ' + cellName(j, w) + '.' };
          }
          const ok = [];
          let bad = null;
          for (const j of P.succ[i]) {
            if (spBad(P, T, I2, i, j, 2)) continue;
            const S2 = spClone(T);
            spLink(S2, i, j);
            const c = spProp(P, S2, 2);
            if (c) { if (!bad) bad = [j, c]; } else ok.push(j);
          }
          if (ok.length === 1 && bad) {
            return { level: 3, set: [[i, ok[0]]], focus: [i, ok[0]], text: 'Suppose the arrow at ' + cellName(i, w) + ' led to ' + cellName(bad[0], w) + '. Follow the forced links from there and ' + spContraText(P, bad[1]) + '. That leaves only ' + cellName(ok[0], w) + '.' };
          }
        }
      }
    }
    if (maxLevel < 4 || !sol) return null;
    for (let i = 0; i < P.N; i++) {
      if (S.nx[i] >= 0 || i === P.end) continue;
      return { level: 4, set: [[i, sol[i]]], focus: [i, sol[i]], text: 'This needs a long chain of reasoning. The arrow at ' + cellName(i, w) + ' leads to ' + cellName(sol[i], w) + ' — can you see why?' };
    }
    return null;
  };

  /* ---- making Signposts ---- */

  // a path through every square, each step a straight line in one of eight directions, from the top left to the bottom right
  function spPath(w, h, rng) {
    const N = w * h, start = 0, end = N - 1, used = new Uint8Array(N), path = [start];
    used[start] = 1;
    const reach = (i) => {
      const out = [], r0 = Math.floor(i / w), c0 = i % w;
      for (let d = 0; d < 8; d++) { let r = r0 + SDR[d], c = c0 + SDC[d]; while (r >= 0 && r < h && c >= 0 && c < w) { out.push(r * w + c); r += SDR[d]; c += SDC[d]; } }
      return out;
    };
    const R = [];
    for (let i = 0; i < N; i++) R.push(reach(i));
    const sees = (a, b) => R[a].indexOf(b) >= 0;
    let nodes = 0;
    const rec = () => {
      if (++nodes > 20000) return false;
      const cur = path[path.length - 1];
      if (path.length === N - 1) { if (sees(cur, end)) { path.push(end); return true; } return false; }
      const opts = R[cur].filter((j) => !used[j] && j !== end);
      if (!opts.length) return false;
      const deg = (j) => R[j].reduce((s, k) => s + (!used[k] && k !== j ? 1 : 0), 0);
      const scored = opts.map((j) => [j, deg(j) + rng() * 3]).sort((a, b) => a[1] - b[1]);
      for (let t = 0; t < Math.min(3, scored.length); t++) {
        const j = scored[t][0];
        used[j] = 1; path.push(j);
        if (rec()) return true;
        used[j] = 0; path.pop();
      }
      return false;
    };
    return rec() ? path : null;
  }
  function spDirOf(w, a, b) {
    const dr = Math.sign(Math.floor(b / w) - Math.floor(a / w)), dc = Math.sign(b % w - a % w);
    for (let d = 0; d < 8; d++) if (SDR[d] === dr && SDC[d] === dc) return d;
    return -1;
  }

  L.spMake = function (w, h, rng, maxLevel, opts) {
    opts = opts || {};
    const N = w * h, path = spPath(w, h, rng);
    if (!path) return null;
    const order = new Int32Array(N), dirs = new Array(N).fill(-1), next = new Int32Array(N).fill(-1);
    path.forEach((c, k) => { order[c] = k + 1; if (k + 1 < N) { dirs[c] = spDirOf(w, c, path[k + 1]); next[c] = path[k + 1]; } });
    const nums = new Array(N).fill(0);
    nums[path[0]] = 1; nums[path[N - 1]] = N;
    let P = null;
    const grade = () => { P = L.spPrep(w, h, dirs, nums); return L.spGrade(P, maxLevel); };
    let g = grade();
    const t0 = now(), budget = opts.budget || 400;
    while (g.open > 0) {
      if (!g.ok || now() - t0 > budget) return null;
      // give the number of a square that logic has not placed yet, the one that helps most among a few
      const cand = [];
      for (let i = 0; i < N; i++) if (!nums[i] && (g.S.nx[i] < 0 || g.S.pv[i] < 0)) cand.push(i);
      if (!cand.length) return null;
      let best = null;
      for (const i of rng.shuffle(cand).slice(0, opts.tryK || 4)) {
        nums[i] = order[i];
        const g2 = grade();
        nums[i] = 0;
        if (g2.ok && (!best || g2.open < best.g.open)) best = { i, g: g2 };
      }
      if (!best) return null;
      nums[best.i] = order[best.i];
      g = best.g;
    }
    for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) {
      if (!nums[i] || nums[i] === 1 || nums[i] === N) continue;
      const keep = nums[i];
      nums[i] = 0;
      const g2 = grade();
      if (g2.ok && g2.open === 0) g = g2; else nums[i] = keep;
    }
    return { w, h, dirs, nums, sol: Array.from(order), next: Array.from(next), grade: g, givens: nums.filter(Boolean).length };
  };

  L.spDiff = function (w, h, g, givens) {
    const N = w * h;
    const size = N <= 16 ? 0 : N <= 25 ? 0.7 : N <= 36 ? 1.4 : N <= 49 ? 2 : 2.4;
    const sparse = 1 - givens / N;
    return clamp(Math.round(0.6 + size + [0, 0, 0.6, 1.4][g.top] + Math.min(0.6, g.used[3] * 0.15) + (sparse - 0.7) * 1.5), 1, 5);
  };

  /* =====================================================================
   *  RANGE (Kurodoko)
   *  Shade some squares: every number counts the white squares it sees along
   *  its row and column (itself included) up to a black square or the edge;
   *  numbers stay white; black squares never touch side by side; all white
   *  squares form one connected region. Values: -1 unknown, 0 white, 1 black.
   * ===================================================================== */

  const RG_TOWARD = ['above it', 'to its right', 'below it', 'to its left'];
  const RG_WAY = ['upwards', 'to the right', 'downwards', 'to the left'];
  L.rgPrep = function (w, h, num) {
    const N = w * h, nb4 = [], clues = [], rays = {};
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w, a = [];
      if (r > 0) a.push(i - w); if (c < w - 1) a.push(i + 1); if (r < h - 1) a.push(i + w); if (c > 0) a.push(i - 1);
      nb4.push(a);
      if (num[i] > 0) {
        clues.push(i);
        rays[i] = [0, 1, 2, 3].map((d) => { const out = []; let rr = r + NDR[d], cc = c + NDC[d]; while (rr >= 0 && rr < h && cc >= 0 && cc < w) { out.push(rr * w + cc); rr += NDR[d]; cc += NDC[d]; } return out; });
      }
    }
    return { w, h, N, num: Int16Array.from(num), nb4, clues, rays };
  };
  L.rgStart = function (P, marks) {
    const v = new Int8Array(P.N).fill(-1);
    if (marks) for (let i = 0; i < P.N; i++) if (marks[i] >= 0) v[i] = marks[i];
    for (const c of P.clues) v[c] = 0;
    return v;
  };
  function rgView(P, v, c) {
    const sure = [0, 0, 0, 0], reach = [0, 0, 0, 0];
    let smin = 1, smax = 1;
    for (let d = 0; d < 4; d++) {
      const ray = P.rays[c][d];
      let s = 0; while (s < ray.length && v[ray[s]] === 0) s++;
      let r = s; while (r < ray.length && v[ray[r]] !== 1) r++;
      sure[d] = s; reach[d] = r; smin += s; smax += r;
    }
    return { sure, reach, min: smin, max: smax };
  }
  L.rgView = rgView;
  // squares that must stay white so that the white squares stay joined; or the contradiction that they are split
  function rgConnect(P, v) {
    const N = P.N, disc = new Int32Array(N).fill(-1), low = new Int32Array(N), wsub = new Int32Array(N);
    let total = 0, first = -1;
    for (let i = 0; i < N; i++) if (v[i] === 0) { total++; if (first < 0) first = i; }
    if (!total) return { force: [] };
    let time = 0, seenW = 0;
    const force = [];
    const dfs = (u, parent) => {
      disc[u] = low[u] = time++;
      wsub[u] = v[u] === 0 ? 1 : 0;
      if (v[u] === 0) seenW++;
      for (const x of P.nb4[u]) {
        if (v[x] === 1) continue;
        if (disc[x] < 0) {
          dfs(x, u);
          wsub[u] += wsub[x];
          if (low[x] < low[u]) low[u] = low[x];
          if (low[x] >= disc[u] && v[u] < 0 && wsub[x] > 0 && force.indexOf(u) < 0) force.push(u);
        } else if (x !== parent && disc[x] < low[u]) low[u] = disc[x];
      }
    };
    dfs(first, -1);
    if (seenW < total) return { contra: { t: 'split' } };
    return { force };
  }

  /* Level 1: black squares and the numbers' views; 2: the white squares stay joined. */
  function rgProp(P, v, level) {
    const N = P.N;
    for (let guard = 0; guard < 4 * N + 20; guard++) {
      let changed = false;
      for (let i = 0; i < N; i++) {
        if (v[i] !== 1) continue;
        for (const j of P.nb4[i]) { if (v[j] === 1) return { t: 'touch', i, j }; if (v[j] < 0) { v[j] = 0; changed = true; } }
      }
      for (const c of P.clues) {
        const k = P.num[c], V = rgView(P, v, c), rays = P.rays[c];
        if (V.max < k) return { t: 'few', c };
        if (V.min > k) return { t: 'many', c };
        if (V.max === V.min) continue;
        if (V.max === k) { for (let d = 0; d < 4; d++) for (let s = 0; s < V.reach[d]; s++) if (v[rays[d][s]] < 0) { v[rays[d][s]] = 0; changed = true; } } else if (V.min === k) { for (let d = 0; d < 4; d++) { const s = V.sure[d]; if (s < rays[d].length && v[rays[d][s]] < 0) { v[rays[d][s]] = 1; changed = true; } } } else {
          for (let d = 0; d < 4; d++) {
            const need = k - (V.max - V.reach[d]);
            for (let s = V.sure[d]; s < need; s++) if (v[rays[d][s]] < 0) { v[rays[d][s]] = 0; changed = true; }
          }
        }
      }
      if (changed) continue;
      if (level < 2) return null;
      const cn = rgConnect(P, v);
      if (cn.contra) return cn.contra;
      for (const i of cn.force) { v[i] = 0; changed = true; }
      if (!changed) return null;
    }
    return null;
  }
  L.rgProp = rgProp;
  const rgOpen = (P, v) => { let k = 0; for (let i = 0; i < P.N; i++) if (v[i] < 0) k++; return k; };

  L.rgCount = function (P, v0, limit, nodeCap) {
    limit = limit || 2;
    const cap = nodeCap || 80000;
    let count = 0, nodes = 0;
    const sols = [];
    const rec = (v) => {
      if (count >= limit || nodes > cap) return;
      nodes++;
      if (rgProp(P, v, 2)) return;
      let pick = -1, slack = 1e9;
      for (const c of P.clues) {
        const V = rgView(P, v, c);
        if (V.max === V.min) continue;
        const sl = V.max - P.num[c];
        if (sl >= slack) continue;
        for (let d = 0; d < 4; d++) { const s = V.sure[d]; if (s < P.rays[c][d].length && v[P.rays[c][d][s]] < 0) { pick = P.rays[c][d][s]; slack = sl; break; } }
      }
      if (pick < 0) for (let i = 0; i < P.N; i++) if (v[i] < 0) { pick = i; break; }
      if (pick < 0) { count++; sols.push(Int8Array.from(v)); return; }
      for (const val of [1, 0]) { const v2 = Int8Array.from(v); v2[pick] = val; rec(v2); if (count >= limit) return; }
    };
    rec(v0 ? Int8Array.from(v0) : L.rgStart(P));
    return { count, sols, nodes, capped: nodes > cap };
  };

  L.rgGrade = function (P, maxLevel, v0) {
    const v = v0 ? Int8Array.from(v0) : L.rgStart(P);
    const used = [0, 0, 0, 0];
    for (let guard = 0; guard < 4 * P.N; guard++) {
      if (rgProp(P, v, 1)) return { ok: false, open: -1, used, top: 0 };
      if (!rgOpen(P, v)) break;
      let progressed = false;
      if (maxLevel >= 2) {
        const before = rgOpen(P, v);
        if (rgProp(P, v, 2)) return { ok: false, open: -1, used, top: 0 };
        if (rgOpen(P, v) < before) { used[2]++; progressed = true; }
      }
      if (!progressed && maxLevel >= 3) {
        for (let i = 0; i < P.N && !progressed; i++) {
          if (v[i] >= 0) continue;
          for (const val of [1, 0]) {
            const v2 = Int8Array.from(v);
            v2[i] = val;
            if (rgProp(P, v2, 2)) { v[i] = 1 - val; progressed = true; break; }
          }
        }
        if (progressed) used[3]++;
      }
      if (!progressed) break;
    }
    let top = 1;
    for (let k = 3; k >= 2; k--) if (used[k]) { top = k; break; }
    return { ok: true, open: rgOpen(P, v), used, top, v };
  };

  function rgWhy(P, c) {
    const w = P.w;
    if (c.t === 'touch') return 'two black squares would touch';
    if (c.t === 'few') return 'the **' + P.num[c.c] + '** at ' + cellName(c.c, w) + ' could not see enough squares';
    if (c.t === 'many') return 'the **' + P.num[c.c] + '** at ' + cellName(c.c, w) + ' would see too many squares';
    return 'the white squares would be cut into separate groups';
  }

  /* The next step from a player's marks (v: -1 unknown, 0 white/dot, 1 black; every
   * mark right). Returns { level, set: [[cell, 1 black | 0 white]], focus, text }. */
  L.rgStep = function (P, v0, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const w = P.w, v = Int8Array.from(v0);
    for (const c of P.clues) v[c] = 0;
    // squares beside black ones are white: that is the picture, not a step
    for (let i = 0; i < P.N; i++) if (v[i] === 1) for (const j of P.nb4[i]) if (v[j] < 0) v[j] = 0;
    let best = null;
    for (const c of P.clues) {
      const k = P.num[c], V = rgView(P, v, c), rays = P.rays[c];
      if (V.max === V.min) continue;
      const K = '**' + k + '**';
      if (V.max === k) {
        const cells = [];
        for (let d = 0; d < 4; d++) for (let s = 0; s < V.reach[d]; s++) if (v[rays[d][s]] < 0) cells.push(rays[d][s]);
        const cand = { set: cells.map((i) => [i, 0]), focus: [c], text: 'The ' + K + ' at ' + cellName(c, w) + ' can see at most ' + word(k) + ' squares (itself included) before black squares and the edges stop it: it must see all of them, so they are all white.' };
        if (!best || cells.length > best.set.length) best = cand;
        continue;
      }
      if (V.min === k) {
        const cells = [];
        for (let d = 0; d < 4; d++) { const s = V.sure[d]; if (s < rays[d].length && v[rays[d][s]] < 0) cells.push(rays[d][s]); }
        return { level: 1, set: cells.map((i) => [i, 1]), focus: [c], text: 'The ' + K + ' at ' + cellName(c, w) + ' already sees ' + word(k) + ' squares (itself included), so every one of its views must stop right there: ' + (cells.length === 1 ? 'the square at ' + cellName(cells[0], w) + ' is black.' : 'the squares at ' + listAnd(cells.map((i) => cellName(i, w))) + ' are black.') };
      }
      for (let d = 0; d < 4; d++) {
        const need = k - (V.max - V.reach[d]);
        if (need <= V.sure[d]) continue;
        const cells = [];
        for (let s = V.sure[d]; s < need; s++) if (v[rays[d][s]] < 0) cells.push(rays[d][s]);
        if (!cells.length) continue;
        const others = V.max - V.reach[d];
        return { level: 1, set: cells.map((i) => [i, 0]), focus: [c], text: 'Without looking ' + RG_WAY[d] + ', the ' + K + ' at ' + cellName(c, w) + ' can see at most ' + word(others) + ' square' + (others === 1 ? '' : 's') + ' (itself included), so it must see at least ' + plural(need, 'square') + ' ' + RG_WAY[d] + ': the first ' + (need === 1 ? 'square' : word(need) + ' squares') + ' ' + RG_TOWARD[d] + ' ' + (need === 1 ? 'is' : 'are') + ' white.' };
      }
    }
    if (best) return Object.assign({ level: 1 }, best);
    if (maxLevel < 2) return null;
    const cn = rgConnect(P, v);
    if (!cn.contra && cn.force.length) {
      const i = cn.force[0];
      return { level: 2, set: [[i, 0]], focus: [i], text: 'If the square at ' + cellName(i, w) + ' were black, it would cut the white squares into two groups — and all the white squares must be joined. So it is white.' };
    }
    if (maxLevel >= 3) {
      const T = Int8Array.from(v);
      if (!rgProp(P, T, 2)) {
        // try squares next to what is known first
        const order = [];
        for (let i = 0; i < P.N; i++) if (T[i] < 0) order.push(i);
        const near = (i) => (P.nb4[i].some((j) => T[j] >= 0) ? 0 : 1);
        order.sort((a, b) => near(a) - near(b) || a - b);
        for (const i of order) {
          for (const val of [1, 0]) {
            const t2 = Int8Array.from(T);
            t2[i] = val;
            const c = rgProp(P, t2, 2);
            if (!c) continue;
            return { level: 3, set: [[i, 1 - val]], focus: [i], text: 'Suppose the square at ' + cellName(i, w) + ' were ' + (val ? 'black' : 'white') + '. Follow the rules from there and ' + rgWhy(P, c) + '. So it is ' + (val ? 'white' : 'black') + '.' };
          }
        }
      }
    }
    if (maxLevel < 4 || !sol) return null;
    for (let i = 0; i < P.N; i++) {
      if (v[i] >= 0) continue;
      return { level: 4, set: [[i, sol[i]]], focus: [i], text: 'This needs a long chain of reasoning. The square at ' + cellName(i, w) + ' is ' + (sol[i] ? 'black' : 'white') + ' — can you see why?' };
    }
    return null;
  };

  /* ---- making Range ---- */

  L.rgNumbers = function (w, h, black) {
    const N = w * h, num = new Int16Array(N).fill(-1);
    for (let i = 0; i < N; i++) {
      if (black[i]) continue;
      const r = Math.floor(i / w), c = i % w;
      let k = 1;
      for (let d = 0; d < 4; d++) { let rr = r + NDR[d], cc = c + NDC[d]; while (rr >= 0 && rr < h && cc >= 0 && cc < w && !black[rr * w + cc]) { k++; rr += NDR[d]; cc += NDC[d]; } }
      num[i] = k;
    }
    return num;
  };
  L.rgMake = function (w, h, rng, maxLevel, opts) {
    opts = opts || {};
    const N = w * h, black = new Uint8Array(N);
    const target = Math.round(N * (opts.black || 0.22));
    const joined = () => {
      let first = -1, whites = 0;
      for (let i = 0; i < N; i++) if (!black[i]) { whites++; if (first < 0) first = i; }
      const seen = new Uint8Array(N), st = [first];
      seen[first] = 1;
      let k = 1;
      while (st.length) { const i = st.pop(); const r = Math.floor(i / w), c = i % w; const nbs = []; if (r) nbs.push(i - w); if (r < h - 1) nbs.push(i + w); if (c) nbs.push(i - 1); if (c < w - 1) nbs.push(i + 1); for (const j of nbs) if (!black[j] && !seen[j]) { seen[j] = 1; k++; st.push(j); } }
      return k === whites;
    };
    let nb = 0;
    for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) {
      if (nb >= target) break;
      const r = Math.floor(i / w), c = i % w;
      if ((r && black[i - w]) || (r < h - 1 && black[i + w]) || (c && black[i - 1]) || (c < w - 1 && black[i + 1])) continue;
      black[i] = 1;
      if (joined()) nb++; else black[i] = 0;
    }
    const full = L.rgNumbers(w, h, black);
    const num = Int16Array.from(full);
    const lv1 = Math.min(2, maxLevel);
    const solves = (lv) => { const g = L.rgGrade(L.rgPrep(w, h, num), lv); return g.ok && g.open === 0 ? g : null; };
    if (!solves(lv1)) return null;
    const t0 = now(), budget = opts.budget || 600;
    for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) {
      if (num[i] < 0) continue;
      if (now() - t0 > budget) return null;
      num[i] = -1;
      if (!solves(lv1)) num[i] = full[i];
    }
    if (maxLevel >= 3 && opts.extra) {
      const left = [];
      for (let i = 0; i < N; i++) if (num[i] > 0) left.push(i);
      for (const i of rng.shuffle(left).slice(0, opts.extra)) {
        if (now() - t0 > budget * 2) break;
        num[i] = -1;
        if (!solves(3)) num[i] = full[i];
      }
    }
    const g = L.rgGrade(L.rgPrep(w, h, num), maxLevel);
    if (!g.ok || g.open) return null;
    return { w, h, num: Array.from(num), sol: Array.from(black), grade: g, clues: Array.from(num).filter((x) => x > 0).length };
  };

  L.rgDiff = function (w, h, g, clues) {
    const N = w * h;
    const size = N <= 49 ? 0 : N <= 64 ? 0.5 : N <= 100 ? 1.1 : N <= 130 ? 2 : 2.4;
    return clamp(Math.round(1 + size + [0, 0, 0.9, 1.4][g.top] + Math.min(0.8, g.used[2] * 0.06 + g.used[3] * 0.2) - 0.3), 1, 5);
  };

  /* @@END@@ */
})(typeof window !== 'undefined' ? window : globalThis);
