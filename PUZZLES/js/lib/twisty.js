/* The Puzzle Cabinet · js/lib/twisty.js
 *
 * Cabinet.Twisty: the Rubik's cube (3×3×3) and the pocket cube (2×2×2).
 *
 * The model is the list of stickers. Every turn — of a face, a middle slice
 * or the whole cube — is a permutation of the stickers worked out from the
 * geometry (turn each sticker's position about the axis), so no move table
 * is typed in by hand.
 *
 *   const K = Cabinet.Twisty.cube(3);
 *   let s = K.solved();                 // one colour per sticker: 0..5 = U R F D L B
 *   s = K.run(s, "R U R' U'");
 *   K.isSolved(s)                       // every face one colour, however the cube is held
 *
 * World axes as in view3d: x right, y up, z toward the viewer; so in the
 * reference position U = +y, R = +x, F = +z. Sticker positions are kept in
 * doubled integer coordinates (cubie centre × 2 + normal), so every turn is exact.
 *
 * Moves are counted in quarter turns (a half turn is two; a middle-slice
 * quarter turn is two as well, since it equals two outer quarter turns).
 *
 * Optimal solvers (quarter turns):
 *   3×3  IDA* guided by five pattern tables: the four U corners, the four D
 *        corners and three sets of four edges, each with their twists and
 *        flips (built on first use, about a third of a second).
 *   2×2  the whole table of 3,674,160 positions with one corner held still
 *        (built on first use).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};

  const FACES = 'URFDLB';
  const NRM = [[0, 1, 0], [1, 0, 0], [0, 0, 1], [0, -1, 0], [-1, 0, 0], [0, 0, -1]];
  // reading order of each face's stickers (the usual net: U on top of F, then L F R B, D below)
  const ROWD = [[0, 0, 1], [0, -1, 0], [0, -1, 0], [0, 0, -1], [0, -1, 0], [0, -1, 0]];
  const COLD = [[1, 0, 0], [0, 0, -1], [1, 0, 0], [1, 0, 0], [0, 0, 1], [-1, 0, 0]];
  const COLOURS = ['#f5f5f0', '#d8233a', '#12a150', '#ffd21f', '#ff7a12', '#1f5fd6'];
  const COLOUR_NAMES = ['white', 'red', 'green', 'yellow', 'orange', 'blue'];

  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const key3 = (v) => v[0] + ',' + v[1] + ',' + v[2];

  // +90° about axis a (right-hand rule)
  function rot1(v, a) {
    const x = v[0], y = v[1], z = v[2];
    if (a === 0) return [x, -z, y];
    if (a === 1) return [z, y, -x];
    return [-y, x, z];
  }
  function rotq(v, a, q) {
    q = ((q % 4) + 4) % 4;
    for (let i = 0; i < q; i++) v = rot1(v, a);
    return v;
  }
  const matVec = (m, v) => [
    m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
    m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
    m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
  ];
  const matMul = (a, b) => {
    const r = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
    return r;
  };
  const det3 = (a, b, c) => a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);

  // the 24 turns of the whole cube, as integer matrices (made from quarter turns about x and y)
  const ROTS = (function () {
    const ax = [1, 0, 0, 0, 0, -1, 0, 1, 0], ay = [0, 0, 1, 0, 1, 0, -1, 0, 0];
    const out = [[1, 0, 0, 0, 1, 0, 0, 0, 1]];
    const seen = new Set([out[0].join()]);
    for (let i = 0; i < out.length; i++) {
      [ax, ay].forEach((g) => {
        const m = matMul(g, out[i]);
        if (!seen.has(m.join())) { seen.add(m.join()); out.push(m); }
      });
    }
    return out;
  })();

  const CORNERS = [[1, 1, 1], [-1, 1, 1], [-1, 1, -1], [1, 1, -1], [1, -1, 1], [-1, -1, 1], [-1, -1, -1], [1, -1, -1]]; // URF UFL ULB UBR DFR DLF DBL DRB
  const CORNER_NAMES = ['URF', 'UFL', 'ULB', 'UBR', 'DFR', 'DLF', 'DBL', 'DRB'];
  const EDGES = [[1, 1, 0], [0, 1, 1], [-1, 1, 0], [0, 1, -1], [1, -1, 0], [0, -1, 1], [-1, -1, 0], [0, -1, -1], [1, 0, 1], [-1, 0, 1], [-1, 0, -1], [1, 0, -1]]; // UR UF UL UB DR DF DL DB FR FL BL BR
  const EDGE_NAMES = ['UR', 'UF', 'UL', 'UB', 'DR', 'DF', 'DL', 'DB', 'FR', 'FL', 'BL', 'BR'];

  const cache = {};

  function cube(N) {
    if (cache[N]) return cache[N];
    if (N !== 2 && N !== 3) throw new Error('Twisty: only 2 and 3');
    const h = N - 1, n2 = N * N, count = 6 * n2;
    const pos = [], nrm = [], face = [], cub = [];
    const index = new Map();
    for (let f = 0; f < 6; f++) {
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          const P = add(add(mul(NRM[f], N), mul(COLD[f], 2 * c - h)), mul(ROWD[f], 2 * r - h));
          index.set(key3(P), pos.length);
          pos.push(P);
          nrm.push(NRM[f]);
          face.push(f);
          cub.push([P[0] - NRM[f][0], P[1] - NRM[f][1], P[2] - NRM[f][2]]);
        }
      }
    }
    const layers = N === 3 ? [-2, 0, 2] : [-1, 1];

    /* ----- turns as sticker permutations: out[to[i]] = s[i] ----- */
    const permCache = {};
    function turnPerm(a, lays, q) {
      const k = a + ':' + lays.join('/') + ':' + (((q % 4) + 4) % 4);
      if (permCache[k]) return permCache[k];
      const to = new Int16Array(count);
      for (let i = 0; i < count; i++) {
        if (lays.indexOf(cub[i][a]) >= 0) to[i] = index.get(key3(rotq(pos[i], a, q)));
        else to[i] = i;
      }
      return (permCache[k] = to);
    }
    const rotPerm = ROTS.map((m) => {
      const to = new Int16Array(count);
      for (let i = 0; i < count; i++) to[i] = index.get(key3(matVec(m, pos[i])));
      return to;
    });
    function permute(s, to) {
      const out = new Array(count);
      for (let i = 0; i < count; i++) out[to[i]] = s[i];
      return out;
    }

    /* ----- notation ----- */
    // letter -> [axis, layers, quarter turns about +axis for the plain (clockwise) move, cost per quarter]
    const LET = {
      U: [1, [h], -1, 1], D: [1, [-h], 1, 1], R: [0, [h], -1, 1], L: [0, [-h], 1, 1], F: [2, [h], -1, 1], B: [2, [-h], 1, 1],
      x: [0, layers, -1, 0], y: [1, layers, -1, 0], z: [2, layers, -1, 0]
    };
    if (N === 3) { LET.M = [0, [0], 1, 2]; LET.E = [1, [0], 1, 2]; LET.S = [2, [0], -1, 2]; }

    // a move: { a, lays, q, cost } ; q in -2..2 (quarter turns about +a)
    function mv(a, lays, q) {
      q = ((q % 4) + 4) % 4; if (q === 3) q = -1;
      const cost = lays.length === layers.length ? 0 : lays.length === 1 && lays[0] === 0 ? 2 : 1;
      return { a, lays: lays.slice(), q, cost: cost * Math.abs(q) };
    }
    function parse(str) {
      const out = [];
      const re = /([URFDLBMESxyz])(\d?)(['’′]?)(\d?)/g;
      const s = String(str || '').replace(/\s+/g, ' ');
      let m;
      while ((m = re.exec(s))) {
        const L = LET[m[1]];
        if (!L) throw new Error('Twisty: no move ' + m[1] + ' on the ' + N + '×' + N);
        let times = parseInt(m[2] || m[4] || '1', 10);
        let q = L[2] * times;
        if (m[3]) q = -q;
        const x = mv(L[0], L[1], q);
        if (x.q) out.push(x);
      }
      return out;
    }
    // the name of a move in the reference position
    function name(m) {
      const q = ((m.q % 4) + 4) % 4;
      if (!q) return '';
      for (const l in LET) {
        const L = LET[l];
        if (L[0] !== m.a || L[1].join() !== m.lays.join()) continue;
        const cw = ((L[2] % 4) + 4) % 4;
        if (q === cw) return l;
        if (q === 2) return l + '2';
        return l + "'";
      }
      return '?';
    }
    const fmt = (list) => list.map(name).filter(Boolean).join(' ');
    const inverse = (list) => list.slice().reverse().map((m) => mv(m.a, m.lays, -m.q));
    const cost = (list) => list.reduce((s, m) => s + m.cost, 0);

    function apply(s, m) {
      const q = ((m.q % 4) + 4) % 4;
      if (!q) return s.slice();
      return permute(s, turnPerm(m.a, m.lays, q));
    }
    function applyAll(s, list) { list.forEach((m) => { s = apply(s, m); }); return s; }
    const solved = () => { const s = new Array(count); for (let i = 0; i < count; i++) s[i] = face[i]; return s; };
    function isSolved(s) {
      for (let f = 0; f < 6; f++) { const c = s[f * n2]; for (let i = 1; i < n2; i++) if (s[f * n2 + i] !== c) return false; }
      return true;
    }
    const same = (a, b) => { for (let i = 0; i < count; i++) if (a[i] !== b[i]) return false; return true; };
    // does s show the pattern g, however the cube is held?
    function matches(s, g) {
      for (const to of rotPerm) {
        let ok = true;
        for (let i = 0; i < count && ok; i++) if (s[to[i]] !== g[i]) ok = false;
        if (ok) return true;
      }
      return false;
    }

    /* ----- cubies: slots, their stickers, reading a state ----- */
    const fAt = (v) => index.get(key3(v));
    const cornerSlots = CORNERS.map((sg) => {
      const cc = mul(sg, h);
      const fy = fAt(add(cc, [0, sg[1], 0])), fx = fAt(add(cc, [sg[0], 0, 0])), fz = fAt(add(cc, [0, 0, sg[2]]));
      return det3(nrm[fy], nrm[fx], nrm[fz]) < 0 ? [fy, fx, fz] : [fy, fz, fx];
    });
    const edgeSlots = N === 3 ? EDGES.map((sg) => {
      const cc = mul(sg, h);
      const fl = [];
      if (sg[1]) fl.push(fAt(add(cc, [0, sg[1], 0])));
      if (sg[2]) fl.push(fAt(add(cc, [0, 0, sg[2]])));
      if (sg[0]) fl.push(fAt(add(cc, [sg[0], 0, 0])));
      return fl;
    }) : [];
    const sol0 = solved();
    const cornerKey = new Map(), edgeKey = new Map();
    cornerSlots.forEach((fl, j) => cornerKey.set(fl.map((i) => sol0[i]).join(''), j));
    edgeSlots.forEach((fl, j) => edgeKey.set(fl.map((i) => sol0[i]).join(''), j));
    const edgeRef = edgeSlots.map((fl) => sol0[fl[0]]);

    // colours -> cubies: cp[slot] = cubie, co[slot] = twist (0..2), ep/eo the same for edges. null if impossible
    function read(s) {
      const cp = new Array(8), co = new Array(8);
      for (let k = 0; k < 8; k++) {
        const fl = cornerSlots[k];
        const c = [s[fl[0]], s[fl[1]], s[fl[2]]];
        let o = c.findIndex((x) => x === 0 || x === 3);
        if (o < 0) return null;
        const j = cornerKey.get('' + c[o] + c[(o + 1) % 3] + c[(o + 2) % 3]);
        if (j == null) return null;
        cp[k] = j; co[k] = o;
      }
      if (N === 2) return { cp, co };
      const ep = new Array(12), eo = new Array(12);
      for (let k = 0; k < 12; k++) {
        const fl = edgeSlots[k];
        const a = s[fl[0]], b = s[fl[1]];
        let j = edgeKey.get('' + a + b), o = 0;
        if (j == null) { j = edgeKey.get('' + b + a); o = 1; }
        if (j == null) return null;
        if (o === 0 && edgeRef[j] !== a) return null;
        ep[k] = j; eo[k] = o;
      }
      return { cp, co, ep, eo };
    }
    function write(cs) {
      const s = sol0.slice();
      for (let k = 0; k < 8; k++) {
        const home = cornerSlots[cs.cp[k]].map((i) => sol0[i]);
        for (let t = 0; t < 3; t++) s[cornerSlots[k][(t + cs.co[k]) % 3]] = home[t];
      }
      if (N === 3) {
        for (let k = 0; k < 12; k++) {
          const home = edgeSlots[cs.ep[k]].map((i) => sol0[i]);
          for (let t = 0; t < 2; t++) s[edgeSlots[k][(t + cs.eo[k]) % 2]] = home[t];
        }
      }
      return s;
    }
    // a sticker permutation as a cubie move: the cubie now at slot s came from from[s], turned by tw[s]
    const fSlot = new Map();
    cornerSlots.forEach((fl, j) => fl.forEach((i, t) => fSlot.set(i, ['c', j, t])));
    edgeSlots.forEach((fl, j) => fl.forEach((i, t) => fSlot.set(i, ['e', j, t])));
    function cubieMove(to) {
      const cf = new Array(8), ct = new Array(8), ef = new Array(12), et = new Array(12);
      cornerSlots.forEach((fl, j) => { const x = fSlot.get(to[fl[0]]); cf[x[1]] = j; ct[x[1]] = x[2]; });
      edgeSlots.forEach((fl, j) => { const x = fSlot.get(to[fl[0]]); ef[x[1]] = j; et[x[1]] = x[2]; });
      return { cf, ct, ef, et };
    }

    // the whole-cube turn that brings the cube to its reference position:
    // 3×3 — the centres home; 2×2 — the D-B-L corner home and upright
    const invRot = rotPerm.map((to) => { const inv = new Int16Array(count); for (let i = 0; i < count; i++) inv[to[i]] = i; return inv; });
    const refCheck = N === 3
      ? [[fAt([0, 3, 0]), 0], [fAt([0, 0, 3]), 2]]
      : cornerSlots[6].map((i) => [i, sol0[i]]);
    function normalize(s) {
      for (let k = 0; k < ROTS.length; k++) {
        const inv = invRot[k];
        if (refCheck.every(([i, c]) => s[inv[i]] === c)) return { k, s: permute(s, rotPerm[k]) };
      }
      return null;
    }
    // map a face move found in the reference frame back to the cube as it is held (rotation k was applied)
    function unrotate(m, k) {
      const R = ROTS[k];
      // inverse of a rotation matrix is its transpose
      const Rt = [R[0], R[3], R[6], R[1], R[4], R[7], R[2], R[5], R[8]];
      const ax = [0, 0, 0]; ax[m.a] = 1;
      const v = matVec(Rt, ax);
      const a = v[0] ? 0 : v[1] ? 1 : 2, sg = v[a];
      return mv(a, m.lays.map((l) => l * sg).sort((p, q) => p - q), m.q * sg);
    }

    const K = {
      N, h, n2, count, pos, nrm, face, cub, layers, LET, ROTS, rotPerm, cornerSlots, edgeSlots,
      COLOURS, COLOUR_NAMES, FACES,
      mv, parse, name, fmt, inverse, cost, apply, applyAll, solved, isSolved, same, matches,
      read, write, cubieMove, normalize, unrotate, turnPerm, permute,
      run: (s, str) => applyAll(s, parse(str)),
      at: (P) => index.get(key3(P))
    };
    cache[N] = K;
    return K;
  }

  /* ---------- small helpers for coordinates ---------- */

  // all 4-tuples of distinct slots out of S, numbered densely
  function tuples4(S) {
    const sp2d = new Int32Array(S * S * S * S).fill(-1), d2sp = [];
    for (let a = 0; a < S; a++) for (let b = 0; b < S; b++) for (let c = 0; c < S; c++) for (let d = 0; d < S; d++) {
      if (a === b || a === c || a === d || b === c || b === d || c === d) continue;
      sp2d[((a * S + b) * S + c) * S + d] = d2sp.length;
      d2sp.push(((a * S + b) * S + c) * S + d);
    }
    return { sp2d, d2sp: Int32Array.from(d2sp), n: d2sp.length };
  }

  /* ---------- the 3×3 solver ---------- */

  const S3 = { ready: false, building: false };
  const MOVE12 = []; // quarter turns U U' R R' F F' D D' L L' B B'

  function build3Steps() {
    const K = cube(3);
    MOVE12.length = 0;
    for (let f = 0; f < 6; f++) {
      const L = K.LET[FACES[f]];
      MOVE12.push(K.mv(L[0], L[1], L[2]), K.mv(L[0], L[1], -L[2]));
    }
    const eff = MOVE12.map((m) => K.cubieMove(K.turnPerm(m.a, m.lays, ((m.q % 4) + 4) % 4)));
    const T8 = tuples4(8), T12 = tuples4(12);
    const steps = [];
    // one move table for each kind of group (corners: 8 slots, twist 3; edges: 12 slots, flip 2)
    function moveTable(T, S, M, fromKey, twKey) {
      const M4 = M * M * M * M, size = T.n * M4;
      const tab = new Uint32Array(size * 12);
      const inv = eff.map((e) => { const x = new Array(S); e[fromKey].forEach((q, s) => { x[q] = s; }); return x; });
      let c = 0;
      steps.push(() => {
        const end = Math.min(size, c + 24000);
        for (; c < end; c++) {
          const sp = T.d2sp[Math.floor(c / M4)];
          let o = c % M4;
          const p0 = Math.floor(sp / (S * S * S)), p1 = Math.floor(sp / (S * S)) % S, p2 = Math.floor(sp / S) % S, p3 = sp % S;
          const o0 = o % M; o = (o - o0) / M; const o1 = o % M; o = (o - o1) / M; const o2 = o % M; const o3 = (o - o2) / M;
          for (let m = 0; m < 12; m++) {
            const iv = inv[m], tw = eff[m][twKey];
            const q0 = iv[p0], q1 = iv[p1], q2 = iv[p2], q3 = iv[p3];
            const d = T.sp2d[((q0 * S + q1) * S + q2) * S + q3];
            const no = (o0 + tw[q0]) % M + M * ((o1 + tw[q1]) % M + M * ((o2 + tw[q2]) % M + M * ((o3 + tw[q3]) % M)));
            tab[c * 12 + m] = d * M4 + no;
          }
        }
        return c >= size;
      });
      return { tab, size, M4, T, S, M };
    }
    const CT = moveTable(T8, 8, 3, 'cf', 'ct');
    const ET = moveTable(T12, 12, 2, 'ef', 'et');
    function prune(G, tracked) {
      const t = tracked;
      const home = G.T.sp2d[((t[0] * G.S + t[1]) * G.S + t[2]) * G.S + t[3]] * G.M4;
      const dist = new Uint8Array(G.size).fill(255);
      steps.push(() => {
        const q = new Uint32Array(G.size);
        let head = 0, tail = 0;
        dist[home] = 0; q[tail++] = home;
        while (head < tail) {
          const x = q[head++], d = dist[x] + 1;
          for (let m = 0; m < 12; m++) {
            const y = G.tab[x * 12 + m];
            if (dist[y] === 255) { dist[y] = d; q[tail++] = y; }
          }
        }
        return true;
      });
      return { dist, home, G, tracked };
    }
    const groups = [
      prune(CT, [0, 1, 2, 3]), prune(CT, [4, 5, 6, 7]),
      prune(ET, [0, 1, 2, 3]), prune(ET, [4, 5, 6, 7]), prune(ET, [8, 9, 10, 11])
    ];
    S3.CT = CT; S3.ET = ET; S3.groups = groups;
    return steps;
  }

  function runSteps(steps) { for (const st of steps) while (!st()); }
  function ensure3() {
    if (S3.ready) return S3;
    if (!S3.pending) S3.pending = build3Steps();
    runSteps(S3.pending);
    S3.pending = null;
    S3.ready = true;
    return S3;
  }
  // build in slices without blocking the page; done() when ready
  function prepare(steps, onDone) {
    let i = 0;
    const tick = () => {
      const t0 = Date.now();
      while (i < steps.length && Date.now() - t0 < 30) { if (steps[i]()) i++; }
      if (i < steps.length) setTimeout(tick, 0); else onDone();
    };
    setTimeout(tick, 0);
  }
  function prepare3(onDone) {
    if (S3.ready) { if (onDone) onDone(); return; }
    (S3.waiters = S3.waiters || []).push(onDone || (() => {}));
    if (S3.building) return;
    S3.building = true;
    S3.pending = build3Steps();
    prepare(S3.pending, () => {
      S3.pending = null; S3.ready = true; S3.building = false;
      const w = S3.waiters; S3.waiters = [];
      w.forEach((f) => f());
    });
  }

  // a cubie state -> the five group coordinates
  function coords3(cs) {
    const out = [];
    S3.groups.forEach((g) => {
      const G = g.G, S = G.S, M = G.M;
      const isC = S === 8;
      const perm = isC ? cs.cp : cs.ep, ori = isC ? cs.co : cs.eo;
      const p = [0, 0, 0, 0], o = [0, 0, 0, 0];
      for (let s = 0; s < S; s++) { const k = g.tracked.indexOf(perm[s]); if (k >= 0) { p[k] = s; o[k] = ori[s]; } }
      out.push(G.T.sp2d[((p[0] * S + p[1]) * S + p[2]) * S + p[3]] * G.M4 + o[0] + M * (o[1] + M * (o[2] + M * o[3])));
    });
    return out;
  }

  /* IDA*: the fewest quarter turns from cubie state cs to solved.
   * opts: { max: deepest search, nodes: give up after this many, min: shortest length to try }
   * returns { moves: [index into MOVE12], nodes } or { fail: 'depth' | 'nodes', nodes } */
  function search3(cs, opts) {
    ensure3();
    opts = opts || {};
    const max = opts.max == null ? 14 : opts.max, limit = opts.nodes || 3e6;
    const G = S3.groups;
    const d0 = G[0].dist, d1 = G[1].dist, d2 = G[2].dist, d3 = G[3].dist, d4 = G[4].dist;
    const ct = S3.CT.tab, et = S3.ET.tab;
    const c = coords3(cs);
    const path = [];
    let nodes = 0, over = false;
    function hval(a, b, x, y, z) {
      let v = d0[a]; if (d1[b] > v) v = d1[b]; if (d2[x] > v) v = d2[x]; if (d3[y] > v) v = d3[y]; if (d4[z] > v) v = d4[z];
      return v;
    }
    function dfs(a, b, x, y, z, g, bound, prev, prev2) {
      const hv = hval(a, b, x, y, z);
      if (hv === 0) return true;
      if (g + hv > bound) return false;
      if (++nodes > limit) { over = true; return false; }
      for (let m = 0; m < 12; m++) {
        const f = m >> 1;
        if (prev >= 0) {
          const pf = prev >> 1;
          if (f === pf) {
            if (m !== prev || (m & 1) || prev2 === prev) continue;
          } else if (pf === f + 3) continue;
        }
        path.push(m);
        if (dfs(ct[a * 12 + m], ct[b * 12 + m], et[x * 12 + m], et[y * 12 + m], et[z * 12 + m], g + 1, bound, m, prev)) return true;
        path.pop();
        if (over) return false;
      }
      return false;
    }
    const h0 = hval(c[0], c[1], c[2], c[3], c[4]);
    for (let bound = Math.max(h0, opts.min || 0); bound <= max; bound++) {
      if (dfs(c[0], c[1], c[2], c[3], c[4], 0, bound, -1, -1)) return { moves: path.slice(), nodes, len: path.length };
      if (over) return { fail: 'nodes', nodes };
    }
    return { fail: 'depth', nodes };
  }

  /* ---------- the 2×2 table ---------- */

  const S2 = { ready: false, building: false };
  const SL7 = [0, 1, 2, 3, 4, 5, 7]; // every corner slot but D-B-L (6), which stays put
  const FACT = [1, 1, 2, 6, 24, 120, 720, 5040];
  function rank7(p) { // p: 7 distinct values 0..6
    let r = 0;
    for (let i = 0; i < 7; i++) {
      let smaller = 0;
      for (let j = i + 1; j < 7; j++) if (p[j] < p[i]) smaller++;
      r += smaller * FACT[6 - i];
    }
    return r;
  }
  function unrank7(r) {
    const left = [0, 1, 2, 3, 4, 5, 6], p = [];
    for (let i = 0; i < 7; i++) {
      const f = FACT[6 - i], k = Math.floor(r / f);
      r -= k * f;
      p.push(left.splice(k, 1)[0]);
    }
    return p;
  }
  const LOCAL = [0, 1, 2, 3, 4, 5, -1, 6]; // cubie id -> 0..6 (DBL has none)

  function build2Steps() {
    const K = cube(2);
    const mv6 = [];
    ['U', 'R', 'F'].forEach((l) => { const L = K.LET[l]; mv6.push(K.mv(L[0], L[1], L[2]), K.mv(L[0], L[1], -L[2])); });
    const eff = mv6.map((m) => K.cubieMove(K.turnPerm(m.a, m.lays, ((m.q % 4) + 4) % 4)));
    const pm = new Uint16Array(5040 * 6), om = new Uint16Array(729 * 6);
    for (let r = 0; r < 5040; r++) {
      const p = unrank7(r); // p[i] = local cubie at slot SL7[i]
      const cp = new Array(8); SL7.forEach((s, i) => { cp[s] = p[i] === 6 ? 7 : p[i]; }); cp[6] = 6;
      for (let m = 0; m < 6; m++) {
        const f = eff[m].cf;
        pm[r * 6 + m] = rank7(SL7.map((s) => LOCAL[cp[f[s]]]));
      }
    }
    for (let o = 0; o < 729; o++) {
      const co = new Array(8).fill(0);
      let x = o, sum = 0;
      for (let i = 0; i < 6; i++) { co[SL7[i]] = x % 3; sum += x % 3; x = Math.floor(x / 3); }
      co[7] = (3 - sum % 3) % 3;
      for (let m = 0; m < 6; m++) {
        const f = eff[m].cf, t = eff[m].ct;
        let v = 0, mulv = 1;
        for (let i = 0; i < 6; i++) { const s = SL7[i]; v += ((co[f[s]] + t[s]) % 3) * mulv; mulv *= 3; }
        om[o * 6 + m] = v;
      }
    }
    const SIZE = 5040 * 729;
    const dist = new Uint8Array(SIZE).fill(255);
    const q = new Uint32Array(SIZE);
    let head = 0, tail = 0;
    dist[0] = 0; q[tail++] = 0;
    const steps = [() => {
      const end = Math.min(tail, head + 400000);
      for (; head < end; head++) {
        const x = q[head], d = dist[x] + 1, pr = Math.floor(x / 729), or = x - pr * 729;
        for (let m = 0; m < 6; m++) {
          const y = pm[pr * 6 + m] * 729 + om[or * 6 + m];
          if (dist[y] === 255) { dist[y] = d; q[tail++] = y; }
        }
      }
      return head >= tail;
    }];
    S2.pm = pm; S2.om = om; S2.dist = dist; S2.mv6 = mv6;
    return steps;
  }
  function ensure2() {
    if (S2.ready) return S2;
    if (!S2.pending) S2.pending = build2Steps();
    runSteps(S2.pending);
    S2.pending = null; S2.ready = true;
    return S2;
  }
  function prepare2(onDone) {
    if (S2.ready) { if (onDone) onDone(); return; }
    (S2.waiters = S2.waiters || []).push(onDone || (() => {}));
    if (S2.building) return;
    S2.building = true;
    S2.pending = build2Steps();
    prepare(S2.pending, () => {
      S2.pending = null; S2.ready = true; S2.building = false;
      const w = S2.waiters; S2.waiters = [];
      w.forEach((f) => f());
    });
  }
  // cubie state with D-B-L home -> table index
  function index2(cs) {
    const p = SL7.map((s) => LOCAL[cs.cp[s]]);
    if (p.some((x) => x < 0)) return -1;
    let o = 0, mulv = 1;
    for (let i = 0; i < 6; i++) { o += cs.co[SL7[i]] * mulv; mulv *= 3; }
    return rank7(p) * 729 + o;
  }

  /* ---------- relative states (to reach a pattern instead of solved) ---------- */

  // the state that is "solved" exactly when cs equals the goal g (both cubie states)
  function relative(cs, g) {
    const gpInv = new Array(8); g.cp.forEach((c, s) => { gpInv[c] = s; });
    const out = { cp: new Array(8), co: new Array(8) };
    for (let s = 0; s < 8; s++) { const L = gpInv[cs.cp[s]]; out.cp[s] = L; out.co[s] = (cs.co[s] - g.co[L] + 3) % 3; }
    if (cs.ep) {
      const geInv = new Array(12); g.ep.forEach((c, s) => { geInv[c] = s; });
      out.ep = new Array(12); out.eo = new Array(12);
      for (let s = 0; s < 12; s++) { const L = geInv[cs.ep[s]]; out.ep[s] = L; out.eo[s] = (cs.eo[s] - g.eo[L] + 2) % 2; }
    }
    return out;
  }

  /* ---------- the public solvers, on sticker states as the cube is held ---------- */

  /* distance and a first move toward the goal (solved, or the pattern goal), as quarter turns.
   * 3×3: { len, moves: [physical moves] } or { fail }; 2×2 exact. */
  function solve(N, s, goal, opts) {
    const K = cube(N);
    const nz = K.normalize(s);
    if (!nz) return { fail: 'bad' };
    let cs = K.read(nz.s);
    if (!cs) return { fail: 'bad' };
    if (N === 3) {
      if (goal) { const gz = K.normalize(goal); cs = relative(cs, K.read(gz.s)); }
      const r = search3(cs, opts);
      if (r.fail) return r;
      return { len: r.len, nodes: r.nodes, moves: r.moves.map((i) => K.unrotate(MOVE12[i], nz.k)) };
    }
    // 2×2: walk down the exact table, trying every physical quarter turn
    ensure2();
    const dist2 = (st) => distance2(st, goal);
    const out = [];
    let cur = s, d = dist2(cur);
    if (d < 0) return { fail: 'bad' };
    const len = d;
    const phys = quarterTurns(K, true);
    let guard = 0;
    while (d > 0 && guard++ < 30) {
      let best = null, bd = d;
      for (const m of phys) {
        const t = K.apply(cur, m), dd = dist2(t);
        if (dd >= 0 && dd < bd) { bd = dd; best = m; if (dd === d - 1) break; }
      }
      if (!best) return { fail: 'bad' };
      out.push(best); cur = K.apply(cur, best); d = bd;
      if (opts && opts.first) break;
    }
    return { len, moves: out };
  }
  // exact quarter-turn distance of a 2×2 sticker state to solved (or to the goal pattern, held any way)
  function distance2(s, goal) {
    const K = cube(2);
    ensure2();
    const nz = K.normalize(s);
    if (!nz) return -1;
    const cs = K.read(nz.s);
    if (!cs) return -1;
    if (!goal) { const i = index2(cs); return i < 0 ? -1 : S2.dist[i]; }
    let best = 255;
    for (const g of goalViews(K, goal)) {
      const i = index2(relative(cs, g));
      if (i >= 0 && S2.dist[i] < best) best = S2.dist[i];
    }
    return best === 255 ? -1 : best;
  }
  // the goal pattern held in each of the 24 ways, as cubie states in the reference position
  const goalCache = new Map();
  function goalViews(K, goal) {
    const key = K.N + ':' + goal.join('');
    let v = goalCache.get(key);
    if (!v) {
      v = [];
      const seen = new Set();
      K.rotPerm.forEach((to) => {
        const gz = K.normalize(K.permute(goal, to));
        const k = gz.s.join('');
        if (!seen.has(k)) { seen.add(k); v.push(K.read(gz.s)); }
      });
      if (goalCache.size > 20) goalCache.clear();
      goalCache.set(key, v);
    }
    return v;
  }
  // every quarter turn of one layer (outer layers only if outerOnly)
  function quarterTurns(K, outerOnly) {
    const out = [];
    for (let a = 0; a < 3; a++) for (const l of K.layers) {
      if (outerOnly && l === 0) continue;
      out.push(K.mv(a, [l], 1), K.mv(a, [l], -1));
    }
    return out;
  }

  C.Twisty = {
    cube, ROTS, FACES, COLOURS, COLOUR_NAMES, CORNER_NAMES, EDGE_NAMES,
    solve, distance2, quarterTurns, relative, search3, coords3,
    ensure3, ensure2, prepare3, prepare2, index2,
    ready: (N) => (N === 3 ? S3.ready : S2.ready),
    MOVE12, S2, S3
  };
})(typeof window !== 'undefined' ? window : globalThis);
