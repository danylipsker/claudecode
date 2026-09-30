/* The Puzzle Cabinet · js/lib/mazes-logic.js
 *
 * The rules, solvers and makers behind engines/mazes.js. Node-safe: no DOM.
 *
 *   Labyrinths   perfect mazes (one path between any two cells) grown by five
 *                algorithms on square, hexagonal and circular (theta) grids;
 *                optional loops ("braid"). Stored as a seed: the maze is grown
 *                again, the same, wherever it is opened.
 *   Unicursal    a classical labyrinth (one path, no choices) drawn from its
 *                circuit sequence, e.g. 3 2 1 4 7 6 5 for the Cretan labyrinth.
 *   Logic mazes  arrow, number, colour-alternating streets, one-way streets,
 *                the rolling die, the chase (a minotaur), ice and mirrors:
 *                each is a small state space searched breadth first.
 *
 * Cabinet.MazeLogic = { buildLabyrinth, pathIn, unicursal, model, bfs, gen*, … }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const M = C.MazeLogic = {};

  const TAU = Math.PI * 2;
  const SQ3 = Math.sqrt(3);
  // compass directions: N E S W (y grows downward)
  const D4 = [[0, -1], [1, 0], [0, 1], [-1, 0]];
  // eight directions, clockwise from north
  const D8 = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
  const ARROWS = '↑↗→↘↓↙←↖';
  M.D4 = D4; M.D8 = D8; M.ARROWS = ARROWS;

  /* ================= grids for labyrinths =================
   * A grid has n cells with centres pos[i] = [x, y] (one unit = one cell) and,
   * for each cell, its sides: { j, a, b } (a straight side from a to b) or
   * { j, arc: [r, a0, a1] } (an arc about the origin), j = the cell across,
   * -1 for the outside. nb[i] lists the cells next to i.
   */

  function finish(g) {
    g.nb = g.sides.map((ss) => {
      const out = [];
      ss.forEach((s) => { if (s.j >= 0 && out.indexOf(s.j) < 0) out.push(s.j); });
      return out;
    });
    return g;
  }

  function squareGrid(w, h) {
    const pos = [], sides = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = y * w + x;
        pos.push([x + 0.5, y + 0.5]);
        sides.push([
          { j: y > 0 ? i - w : -1, a: [x, y], b: [x + 1, y] },
          { j: x < w - 1 ? i + 1 : -1, a: [x + 1, y], b: [x + 1, y + 1] },
          { j: y < h - 1 ? i + w : -1, a: [x, y + 1], b: [x + 1, y + 1] },
          { j: x > 0 ? i - 1 : -1, a: [x, y], b: [x, y + 1] }
        ]);
      }
    }
    return finish({
      type: 'square', w, h, n: w * h, pos, sides, box: { x0: 0, y0: 0, x1: w, y1: h },
      cellAt(p) {
        const x = Math.floor(p[0]), y = Math.floor(p[1]);
        return x >= 0 && y >= 0 && x < w && y < h ? y * w + x : -1;
      },
      shape(i) { const x = i % w, y = (i - x) / w; return [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]]; }
    });
  }

  // pointy-top hexagons of radius 1; sides 0..5 face E, SE, SW, W, NW, NE
  const HEXD = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
  function hexGrid(shape, a, b) {
    const cells = [];
    if (shape === 'rect') {
      for (let r = 0; r < b; r++) { const q0 = -Math.floor(r / 2); for (let q = q0; q < q0 + a; q++) cells.push([q, r]); }
    } else {
      for (let r = -a; r <= a; r++) for (let q = -a; q <= a; q++) if (Math.abs(q + r) <= a) cells.push([q, r]);
    }
    const idx = new Map(cells.map((c, i) => [c[0] + ',' + c[1], i]));
    const px = (q, r) => [SQ3 * (q + r / 2), 1.5 * r];
    const corner = (c, k) => { const t = (60 * k - 30) * Math.PI / 180; return [c[0] + Math.cos(t), c[1] + Math.sin(t)]; };
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    cells.forEach(([q, r]) => { const p = px(q, r); x0 = Math.min(x0, p[0] - SQ3 / 2); x1 = Math.max(x1, p[0] + SQ3 / 2); y0 = Math.min(y0, p[1] - 1); y1 = Math.max(y1, p[1] + 1); });
    const ox = -x0, oy = -y0;
    const pos = [], sides = [];
    cells.forEach(([q, r]) => {
      const p0 = px(q, r), c = [p0[0] + ox, p0[1] + oy];
      pos.push(c);
      const ss = [];
      for (let k = 0; k < 6; k++) {
        const j = idx.get((q + HEXD[k][0]) + ',' + (r + HEXD[k][1]));
        ss.push({ j: j == null ? -1 : j, a: corner(c, k), b: corner(c, k + 1) });
      }
      sides.push(ss);
    });
    return finish({
      type: 'hex', shape, n: cells.length, pos, sides, box: { x0: 0, y0: 0, x1: x1 - x0, y1: y1 - y0 }, axial: cells,
      cellAt(p) {
        const x = p[0] - ox, y = p[1] - oy;
        const fq = SQ3 / 3 * x - y / 3, fr = 2 / 3 * y, fs = -fq - fr;
        let q = Math.round(fq), r = Math.round(fr);
        const s = Math.round(fs);
        const dq = Math.abs(q - fq), dr = Math.abs(r - fr), ds = Math.abs(s - fs);
        if (dq > dr && dq > ds) q = -r - s; else if (dr > ds) r = -q - s;
        const i = idx.get(q + ',' + r);
        return i == null ? -1 : i;
      },
      shape(i) { const c = pos[i], out = []; for (let k = 0; k < 6; k++) out.push(corner(c, k)); return out; }
    });
  }

  // rings about a centre cell; ring r (1 ≤ r < R) spans radii r..r+1 and is split
  // into more cells as it grows; ring 0 is the round centre (radius 1)
  function thetaGrid(R) {
    const counts = [1, 6];
    for (let r = 2; r < R; r++) { const prev = counts[r - 1]; counts.push(TAU * r / prev > 1.9 ? prev * 2 : prev); }
    const first = [0];
    for (let r = 1; r < R; r++) first.push(first[r - 1] + counts[r - 1]);
    const n = first[R - 1] + counts[R - 1];
    const phi = Math.PI / 2 - Math.PI / counts[R - 1]; // outer cell 0 is centred at the bottom
    const ang = (r, k) => phi + TAU * k / counts[r];
    const id = (r, k) => first[r] + ((k % counts[r]) + counts[r]) % counts[r];
    const pol = (rad, a) => [rad * Math.cos(a), rad * Math.sin(a)];
    const pos = [[0, 0]], sides = [[]], ring = [0], kk = [0];
    for (let k = 0; k < counts[1] && R > 1; k++) sides[0].push({ j: id(1, k), arc: [1, ang(1, k), ang(1, k + 1)] });
    for (let r = 1; r < R; r++) {
      for (let k = 0; k < counts[r]; k++) {
        const a0 = ang(r, k), a1 = ang(r, k + 1);
        pos.push(pol(r + 0.5, (a0 + a1) / 2));
        ring.push(r); kk.push(k);
        const ss = [];
        ss.push({ j: r === 1 ? 0 : id(r - 1, Math.floor(k * counts[r - 1] / counts[r])), arc: [r, a0, a1] });
        ss.push({ j: id(r, k + 1), a: pol(r, a1), b: pol(r + 1, a1) });
        if (r === R - 1) ss.push({ j: -1, arc: [r + 1, a0, a1] });
        else {
          const f = counts[r + 1] / counts[r];
          for (let s = 0; s < f; s++) ss.push({ j: id(r + 1, k * f + s), arc: [r + 1, a0 + (a1 - a0) * s / f, a0 + (a1 - a0) * (s + 1) / f] });
        }
        ss.push({ j: id(r, k - 1), a: pol(r, a0), b: pol(r + 1, a0) });
        sides.push(ss);
      }
    }
    return finish({
      type: 'theta', R, n, pos, sides, counts, ring, kk, phi, box: { x0: -R, y0: -R, x1: R, y1: R },
      cellAt(p) {
        const rho = Math.hypot(p[0], p[1]);
        if (rho < 1) return 0;
        const r = Math.floor(rho);
        if (r >= R) return -1;
        let a = Math.atan2(p[1], p[0]) - phi;
        a = ((a % TAU) + TAU) % TAU;
        return id(r, Math.floor(a / (TAU / counts[r])));
      },
      shape(i) {
        if (i === 0) { const out = []; for (let t = 0; t < 24; t++) out.push(pol(1, t * TAU / 24)); return out; }
        const r = ring[i], k = kk[i], a0 = ang(r, k), a1 = ang(r, k + 1), out = [];
        const steps = Math.max(2, Math.ceil((a1 - a0) / 0.12));
        for (let t = 0; t <= steps; t++) out.push(pol(r, a0 + (a1 - a0) * t / steps));
        for (let t = steps; t >= 0; t--) out.push(pol(r + 1, a0 + (a1 - a0) * t / steps));
        return out;
      }
    });
  }

  M.gridOf = function (d) {
    if (d.grid === 'hex') return d.shape === 'rect' ? hexGrid('rect', d.w, d.h) : hexGrid('hexagon', d.R);
    if (d.grid === 'theta') return thetaGrid(d.R);
    return squareGrid(d.w, d.h);
  };

  /* ---------- growing a perfect maze: every algorithm makes a spanning tree ---------- */

  function carve(g, algo, rng) {
    const n = g.n, open = Array.from({ length: n }, () => []);
    const link = (a, b) => { open[a].push(b); open[b].push(a); };
    if (algo === 'prim') {
      // grow from a seed: add a random cell on the frontier, joined to a random grown neighbour
      const inT = new Uint8Array(n), inF = new Uint8Array(n), front = [];
      const add = (c) => { inT[c] = 1; g.nb[c].forEach((j) => { if (!inT[j] && !inF[j]) { inF[j] = 1; front.push(j); } }); };
      add(rng.int(n));
      while (front.length) {
        const k = rng.int(front.length), c = front[k];
        front[k] = front[front.length - 1]; front.pop();
        link(c, rng.pick(g.nb[c].filter((j) => inT[j])));
        add(c);
      }
    } else if (algo === 'kruskal') {
      // knock down walls in random order, never between cells already joined
      const edges = [];
      for (let i = 0; i < n; i++) g.nb[i].forEach((j) => { if (j > i) edges.push([i, j]); });
      rng.shuffle(edges);
      const par = new Int32Array(n);
      for (let i = 0; i < n; i++) par[i] = i;
      const find = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
      edges.forEach(([a, b]) => { const ra = find(a), rb = find(b); if (ra !== rb) { par[ra] = rb; link(a, b); } });
    } else if (algo === 'wilson') {
      // loop-erased random walks: every spanning tree equally likely
      const inT = new Uint8Array(n), next = new Int32Array(n);
      inT[rng.int(n)] = 1;
      const order = rng.shuffle(Array.from({ length: n }, (_, i) => i));
      order.forEach((s) => {
        if (inT[s]) return;
        let c = s;
        while (!inT[c]) { const j = rng.pick(g.nb[c]); next[c] = j; c = j; }
        c = s;
        while (!inT[c]) { inT[c] = 1; link(c, next[c]); c = next[c]; }
      });
    } else if (algo === 'eller' && g.type === 'square') {
      // one row at a time, remembering only which cells of the row are joined
      const w = g.w, h = g.h;
      let set = new Int32Array(w), nextSet = 1;
      for (let x = 0; x < w; x++) set[x] = nextSet++;
      for (let y = 0; y < h; y++) {
        const last = y === h - 1;
        for (let x = 0; x < w - 1; x++) {
          if (set[x] !== set[x + 1] && (last || rng() < 0.5)) {
            link(y * w + x, y * w + x + 1);
            const old = set[x + 1], nw = set[x];
            for (let k = 0; k < w; k++) if (set[k] === old) set[k] = nw;
          }
        }
        if (last) break;
        const groups = new Map();
        for (let x = 0; x < w; x++) { if (!groups.has(set[x])) groups.set(set[x], []); groups.get(set[x]).push(x); }
        const ns = new Int32Array(w);
        groups.forEach((xs, s) => {
          rng.shuffle(xs);
          xs.forEach((x, t) => { if (t === 0 || rng() < 0.3) { link(y * w + x, (y + 1) * w + x); ns[x] = s; } });
        });
        for (let x = 0; x < w; x++) if (!ns[x]) ns[x] = nextSet++;
        set = ns;
      }
    } else {
      // the recursive backtracker (depth first): long winding corridors
      const seen = new Uint8Array(n), stack = [rng.int(n)];
      seen[stack[0]] = 1;
      while (stack.length) {
        const c = stack[stack.length - 1];
        const opts = g.nb[c].filter((j) => !seen[j]);
        if (!opts.length) { stack.pop(); continue; }
        const j = rng.pick(opts);
        link(c, j); seen[j] = 1; stack.push(j);
      }
    }
    return open;
  }

  // open up some dead ends: the maze gets loops
  function braid(g, open, rng, p) {
    const cells = rng.shuffle(Array.from({ length: g.n }, (_, i) => i));
    cells.forEach((c) => {
      if (open[c].length !== 1 || rng() >= p) return;
      const closed = g.nb[c].filter((j) => open[c].indexOf(j) < 0);
      if (!closed.length) return;
      const dead = closed.filter((j) => open[j].length === 1);
      const j = rng.pick(dead.length ? dead : closed);
      open[c].push(j); open[j].push(c);
    });
  }

  function sideTo(g, i, test) {
    const ss = g.sides[i];
    for (let k = 0; k < ss.length; k++) if (test(ss[k], k)) return k;
    return -1;
  }

  // where the walker starts and what counts as arriving; doors are gaps in the outer wall
  function endsOf(g, d) {
    const out = { doors: [] };
    const door = (cell, side) => { if (side >= 0) out.doors.push({ cell, side }); };
    if (g.type === 'square') {
      if (d.goal === 'centre') {
        out.start = (g.h - 1) * g.w + Math.floor(g.w / 2);
        door(out.start, 2);
        out.goal = Math.floor(g.h / 2) * g.w + Math.floor(g.w / 2);
      } else {
        out.start = 0; door(0, 0);
        out.goal = g.n - 1; door(g.n - 1, 2);
      }
    } else if (g.type === 'hex') {
      if (g.shape === 'rect') {
        out.start = 0; door(0, sideTo(g, 0, (s, k) => s.j < 0 && k === 4));
        out.goal = g.n - 1; door(g.n - 1, sideTo(g, g.n - 1, (s, k) => s.j < 0 && k === 1));
      } else {
        // the corner cells at the far left and far right
        let lo = 0, hi = 0;
        g.pos.forEach((p, i) => { if (p[0] < g.pos[lo][0] - 1e-9 || (Math.abs(p[0] - g.pos[lo][0]) < 1e-9 && p[1] < g.pos[lo][1])) lo = i; if (p[0] > g.pos[hi][0] + 1e-9 || (Math.abs(p[0] - g.pos[hi][0]) < 1e-9 && p[1] > g.pos[hi][1])) hi = i; });
        out.start = lo; door(lo, 3);
        if (d.goal === 'centre') out.goal = g.n >> 1;
        else { out.goal = hi; door(hi, 0); }
      }
    } else {
      out.start = g.n - g.counts[g.R - 1];
      door(out.start, sideTo(g, out.start, (s) => s.j < 0));
      out.goal = 0;
    }
    return out;
  }

  M.buildLabyrinth = function (d) {
    const g = M.gridOf(d);
    const rng = C.rng(d.seed >>> 0);
    const open = carve(g, d.algo, rng);
    if (d.braid) braid(g, open, rng, d.braid);
    const e = endsOf(g, d);
    return { g, open, start: e.start, goal: e.goal, doors: e.doors };
  };

  // the shortest way between two cells (a list of cells, both ends included)
  M.pathIn = function (L, a, b) {
    if (a === b) return [a];
    const prev = new Int32Array(L.g.n).fill(-1);
    prev[a] = a;
    let q = [a];
    while (q.length) {
      const nq = [];
      for (const c of q) {
        for (const j of L.open[c]) {
          if (prev[j] >= 0) continue;
          prev[j] = c;
          if (j === b) {
            const path = [b];
            let k = b;
            while (k !== a) { k = prev[k]; path.push(k); }
            return path.reverse();
          }
          nq.push(j);
        }
      }
      q = nq;
    }
    return null;
  };

  // statistics that describe a maze's texture
  M.labyrinthStats = function (L) {
    let dead = 0, junc = 0;
    L.open.forEach((o) => { if (o.length === 1) dead++; else if (o.length >= 3) junc++; });
    const path = M.pathIn(L, L.start, L.goal);
    return { cells: L.g.n, dead, junctions: junc, par: path ? path.length - 1 : null };
  };

  M.ALGOS = {
    backtrack: 'the recursive backtracker',
    prim: 'Prim\'s algorithm',
    kruskal: 'Kruskal\'s algorithm',
    eller: 'Eller\'s algorithm',
    wilson: 'Wilson\'s algorithm'
  };

  /* ================= the unicursal (classical) labyrinth =================
   * seq lists the circuits in the order the path walks them (1 = outermost).
   * Between two circuits the path turns on the axis, alternately on its two
   * sides; the turns on one side must nest without crossing (a "meander").
   * Turns that enclose others lie nearer the axis.
   */
  M.unicursal = function (d) {
    const seq = d.seq || [], n = seq.length;
    const sorted = seq.slice().sort((a, b) => a - b);
    if (!n || sorted.some((v, i) => v !== i + 1)) return { ok: false, err: 'the sequence must use each circuit 1..' + n + ' once' };
    const pts = [0].concat(seq, [n + 1]);
    const arcs = [];
    for (let i = 0; i + 1 < pts.length; i++) {
      arcs.push({ from: pts[i], to: pts[i + 1], lo: Math.min(pts[i], pts[i + 1]), hi: Math.max(pts[i], pts[i + 1]), side: i % 2 });
    }
    for (let i = 0; i < arcs.length; i++) {
      const A = arcs[i];
      A.depth = 0;
      for (let j = 0; j < arcs.length; j++) {
        const B = arcs[j];
        if (i === j || A.side !== B.side) continue;
        const crossA = A.lo < B.lo && B.lo < A.hi && A.hi < B.hi;
        const crossB = B.lo < A.lo && A.lo < B.hi && B.hi < A.hi;
        if (crossA || crossB) return { ok: false, err: 'the turns ' + A.from + '→' + A.to + ' and ' + B.from + '→' + B.to + ' would cross' };
        if (B.lo <= A.lo && A.hi <= B.hi) A.depth++;
      }
      A.col = A.depth + 1;
    }
    const K = Math.max.apply(null, arcs.map((a) => a.col));
    return { ok: true, n, arcs, K };
  };

  // the path of a unicursal labyrinth as a dense polyline (units: one circuit width)
  M.unicursalPath = function (d) {
    const U = M.unicursal(d);
    if (!U.ok) return null;
    const n = U.n, K = U.K;
    const rc = Math.max(1.6, K + 0.75);            // the centre's radius
    const rad = (c) => rc + (n - c) + 0.5;        // circuit c's radius
    const outR = rc + n;                           // the hedge's outer edge
    const pts = [], ringOf = [];
    const push = (p, r) => {
      const last = pts[pts.length - 1];
      if (last && Math.hypot(p[0] - last[0], p[1] - last[1]) < 1e-6) return;
      pts.push(p); ringOf.push(r);
    };
    const yOn = (r, x) => Math.sqrt(Math.max(0, r * r - x * x));
    const line = (a, b, r) => {
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]), steps = Math.max(1, Math.ceil(L / 0.25));
      for (let t = 1; t <= steps; t++) push([a[0] + (b[0] - a[0]) * t / steps, a[1] + (b[1] - a[1]) * t / steps], r);
    };
    let cur = null;
    U.arcs.forEach((A, i) => {
      const x = (A.side === 0 ? 1 : -1) * A.col;
      const yFrom = A.from === 0 ? outR + 1.3 : yOn(rad(A.from), x);
      const yTo = A.to === n + 1 ? yOn(rc, x) * 0.2 : yOn(rad(A.to), x);
      const p0 = [x, yFrom], p1 = [x, yTo];
      if (i === 0) push(p0, 0);
      else {
        // walk circuit A.from from where we came in round (the long way) to here
        const r = rad(A.from);
        let t0 = Math.atan2(cur[1], cur[0]), t1 = Math.atan2(p0[1], p0[0]);
        if (cur[0] > 0) { if (t1 > t0) t1 -= TAU; } else if (t1 < t0) t1 += TAU;
        const steps = Math.max(4, Math.ceil(Math.abs(t1 - t0) * r / 0.25));
        for (let t = 1; t <= steps; t++) { const a = t0 + (t1 - t0) * t / steps; push([r * Math.cos(a), r * Math.sin(a)], A.from); }
      }
      line(p0, p1, -1);
      cur = p1;
    });
    push([0, 0], n + 1);
    // cumulative length
    const len = [0];
    for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return { U, pts, ringOf, len, rc, outR, rad, n };
  };

  /* ================= logic mazes =================
   * M.model(d) turns a puzzle's data into { kind, w, h, start, moves(s), isGoal(s), cellOf(s) }
   * where a state s is a number. moves(s) lists { s: next state, dir, … }.
   */
  const KIND = {};
  M.KIND = KIND;

  function inB(w, h, x, y) { return x >= 0 && y >= 0 && x < w && y < h; }
  const rowsOf = (rows) => rows.map((r) => Array.from(r));

  // arrows: from a square you may move any distance in the direction of its arrow
  KIND.arrow = function (d) {
    const g = rowsOf(d.rows), h = g.length, w = g[0].length, n = w * h;
    const dir = new Int8Array(n).fill(-1);
    let goal = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const ch = g[y][x], k = ARROWS.indexOf(ch);
        if (k >= 0) dir[y * w + x] = k;
        else if (ch === '★' || ch === '*') goal = y * w + x;
      }
    }
    return {
      kind: 'arrow', d, w, h, n, dir, goal, start: d.start[1] * w + d.start[0],
      cellOf: (s) => s,
      moves(s) {
        const k = dir[s];
        if (k < 0) return [];
        const out = [], dx = D8[k][0], dy = D8[k][1];
        let x = s % w, y = (s - x) / w;
        for (let t = 1; ; t++) {
          x += dx; y += dy;
          if (!inB(w, h, x, y)) break;
          out.push({ s: y * w + x, dir: k, dist: t, vec: [dx, dy] });
        }
        return out;
      },
      isGoal: (s) => s === goal
    };
  };

  // numbers: jump exactly the number shown, in a straight line (four ways, or eight with diag)
  KIND.number = function (d) {
    const g = rowsOf(d.rows), h = g.length, w = g[0].length, n = w * h;
    const num = new Int8Array(n);
    let goal = -1;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const ch = g[y][x];
        if (ch === '*' || ch === '★') goal = y * w + x;
        else num[y * w + x] = parseInt(ch, 10) || 0;
      }
    }
    const dirs = d.diag ? [0, 1, 2, 3, 4, 5, 6, 7] : [0, 2, 4, 6];
    return {
      kind: 'number', d, w, h, n, num, goal, start: d.start[1] * w + d.start[0],
      cellOf: (s) => s,
      moves(s) {
        const k = num[s];
        if (!k) return [];
        const out = [], x = s % w, y = (s - x) / w;
        dirs.forEach((di) => {
          const nx = x + D8[di][0] * k, ny = y + D8[di][1] * k;
          if (inB(w, h, nx, ny)) out.push({ s: ny * w + nx, dir: di, dist: k, vec: D8[di] });
        });
        return out;
      },
      isGoal: (s) => s === goal
    };
  };

  // coloured streets between the dots of a town plan; the colours must come in turn
  // hs[y][x]: street from dot (x,y) to (x+1,y); vs[y][x]: from (x,y) to (x,y+1); '.' = none
  function streetOf(d, w, h, i, k) {
    const x = i % w, y = (i - x) / w;
    if (k === 0) return y > 0 ? d.vs[y - 1][x] : '.';
    if (k === 1) return x < w - 1 ? d.hs[y][x] : '.';
    if (k === 2) return y < h - 1 ? d.vs[y][x] : '.';
    return x > 0 ? d.hs[y][x - 1] : '.';
  }
  M.streetOf = streetOf;

  KIND.colour = function (d) {
    const w = d.w, h = d.h, n = w * h, order = d.order || 'rb', L = order.length, S = L + 1;
    const goal = d.goal[1] * w + d.goal[0];
    return {
      kind: 'colour', d, w, h, n, order, L, goal, start: (d.start[1] * w + d.start[0]) * S,
      cellOf: (s) => Math.floor(s / S),
      lastOf: (s) => s % S,
      moves(s) {
        const node = Math.floor(s / S), last = s % S, out = [];
        for (let k = 0; k < 4; k++) {
          const c = streetOf(d, w, h, node, k), ci = order.indexOf(c);
          if (ci < 0 || c === '.') continue;
          if (last && ci !== last % L) continue;
          const j = node + D4[k][0] + D4[k][1] * w;
          out.push({ s: j * S + ci + 1, dir: k, col: c });
        }
        return out;
      },
      isGoal: (s) => Math.floor(s / S) === goal
    };
  };

  // one-way streets; '=' and '|' are two-way, '>' '<' 'v' '^' one-way; no U-turns (and maybe no left turns)
  KIND.streets = function (d) {
    const w = d.w, h = d.h, n = w * h;
    const can = (i, k) => {
      const c = streetOf(d, w, h, i, k);
      if (k === 0) return c === '|' || c === '^';
      if (k === 1) return c === '=' || c === '>';
      if (k === 2) return c === '|' || c === 'v';
      return c === '=' || c === '<';
    };
    const goal = d.goal[1] * w + d.goal[0];
    return {
      kind: 'streets', d, w, h, n, goal, can, start: (d.start[1] * w + d.start[0]) * 5 + 4,
      cellOf: (s) => Math.floor(s / 5),
      headOf: (s) => s % 5,
      rule(hd, k) {
        if (hd >= 4) return '';
        if (k === (hd + 2) % 4 && !d.uturn) return 'uturn';
        if (d.noLeft && k === (hd + 3) % 4) return 'left';
        if (d.noRight && k === (hd + 1) % 4) return 'right';
        return '';
      },
      moves(s) {
        const node = Math.floor(s / 5), hd = s % 5, out = [];
        for (let k = 0; k < 4; k++) {
          if (!can(node, k) || this.rule(hd, k)) continue;
          const j = node + D4[k][0] + D4[k][1] * w;
          out.push({ s: j * 5 + k, dir: k });
        }
        return out;
      },
      isGoal: (s) => Math.floor(s / 5) === goal
    };
  };

  // the die: [top, north, east]; opposite faces add up to 7
  function roll(o, k) {
    const t = o[0], nn = o[1], e = o[2];
    if (k === 0) return [7 - nn, t, e];
    if (k === 2) return [nn, 7 - t, e];
    if (k === 1) return [7 - e, nn, t];
    return [e, nn, 7 - t];
  }
  M.roll = roll;

  KIND.die = function (d) {
    const g = rowsOf(d.rows), h = g.length, w = g[0].length, n = w * h;
    const startCell = d.start[1] * w + d.start[0], goal = d.goal[1] * w + d.goal[0];
    const o0 = d.die || [1, 2, 3];
    const enc = (c, o) => c * 1000 + o[0] * 100 + o[1] * 10 + o[2];
    const dec = (s) => { const c = Math.floor(s / 1000), r = s % 1000; return [c, [Math.floor(r / 100), Math.floor(r / 10) % 10, r % 10]]; };
    return {
      kind: 'die', d, w, h, n, g, goal, startCell, enc, dec, start: enc(startCell, o0),
      cellOf: (s) => Math.floor(s / 1000),
      // what a roll would do: { ok, o, cell, why }
      tryRoll(s, k) {
        const [c, o] = dec(s), x = c % w, y = (c - x) / w, nx = x + D4[k][0], ny = y + D4[k][1];
        if (!inB(w, h, nx, ny)) return { ok: false, why: 'edge' };
        const ch = g[ny][nx], j = ny * w + nx, o2 = roll(o, k);
        if (ch === '#') return { ok: false, why: 'hole', cell: j, o: o2 };
        if (j !== startCell && ch !== '*' && +ch !== o2[0]) return { ok: false, why: 'face', cell: j, o: o2, need: +ch };
        return { ok: true, cell: j, o: o2, s: enc(j, o2) };
      },
      moves(s) {
        const out = [];
        for (let k = 0; k < 4; k++) { const r = this.tryRoll(s, k); if (r.ok) out.push({ s: r.s, dir: k, o: r.o }); }
        return out;
      },
      isGoal: (s) => Math.floor(s / 1000) === goal
    };
  };

  // the chase: after each of your steps (or a wait) the minotaur takes two steps toward you,
  // across if that brings him nearer and no wall is in the way, else up or down; else he stands.
  // ew[y][x] = '|': a wall east of (x,y);  sw[y][x] = '-': a wall south of (x,y); exit: [x, y, 'N'|'E'|'S'|'W']
  KIND.chase = function (d) {
    const w = d.w, h = d.h, n = w * h;
    const exitCell = d.exit[1] * w + d.exit[0], exitSide = 'NESW'.indexOf(d.exit[2]);
    const wall = (i, k) => {
      const x = i % w, y = (i - x) / w;
      if (k === 1) return x === w - 1 || d.ew[y][x] === '|';
      if (k === 3) return x === 0 || d.ew[y][x - 1] === '|';
      if (k === 2) return y === h - 1 || d.sw[y][x] === '-';
      return y === 0 || d.sw[y - 1][x] === '-';
    };
    const step = (m, t) => {
      const mx = m % w, my = (m - mx) / w, tx = t % w, ty = (t - tx) / w;
      if (tx !== mx) { const k = tx > mx ? 1 : 3; if (!wall(m, k)) return m + (k === 1 ? 1 : -1); }
      if (ty !== my) { const k = ty > my ? 2 : 0; if (!wall(m, k)) return m + (k === 2 ? w : -w); }
      return m;
    };
    const t0 = d.t[1] * w + d.t[0], m0 = d.m[1] * w + d.m[0];
    return {
      kind: 'chase', d, w, h, n, wall, step, exitCell, exitSide, WIN: -1, start: t0 * n + m0,
      cellOf: (s) => (s < 0 ? exitCell : Math.floor(s / n)),
      minoOf: (s) => (s < 0 ? -1 : s % n),
      // what happens if Theseus does k (0-3 a step, 4 = wait): { ok, win, caught, blocked, t2, mp }
      tryMove(s, k) {
        const t = Math.floor(s / n), m = s % n;
        let t2 = t;
        if (k < 4) {
          if (t === exitCell && k === exitSide) return { ok: true, win: true, s: -1, t2: -1, mp: [m] };
          if (wall(t, k)) return { ok: false, blocked: true };
          t2 = t + D4[k][0] + D4[k][1] * w;
          if (t2 === m) return { ok: false, caught: true, t2, mp: [m], into: true };
        }
        const m1 = step(m, t2);
        if (m1 === t2) return { ok: false, caught: true, t2, mp: [m, m1] };
        const m2 = step(m1, t2);
        if (m2 === t2) return { ok: false, caught: true, t2, mp: [m, m1, m2] };
        return { ok: true, s: t2 * n + m2, t2, mp: [m, m1, m2] };
      },
      moves(s) {
        if (s < 0) return [];
        const out = [];
        for (let k = 0; k < 5; k++) { const r = this.tryMove(s, k); if (r.ok) out.push({ s: r.s, dir: k, mp: r.mp, win: r.win }); }
        return out;
      },
      isGoal: (s) => s === -1
    };
  };

  // ice: slide until something stops you — a rock or the edge (or a patch of snow, ':');
  // mirrors '/' and '\' turn you through a right angle
  const TURN_SL = [1, 0, 3, 2], TURN_BS = [3, 2, 1, 0];
  KIND.ice = function (d) {
    const g = rowsOf(d.rows), h = g.length, w = g[0].length, n = w * h;
    const start = d.start[1] * w + d.start[0], goal = d.goal[1] * w + d.goal[0];
    const slide = (s, k) => {
      let x = s % w, y = (s - x) / w, dir = k;
      const path = [s], dirs = [k], seen = new Set();
      for (;;) {
        const nx = x + D4[dir][0], ny = y + D4[dir][1];
        if (!inB(w, h, nx, ny) || g[ny][nx] === '#') break;
        x = nx; y = ny;
        const i = y * w + x, ch = g[y][x];
        path.push(i);
        if (ch === ':') break;
        if (ch === '/') dir = TURN_SL[dir];
        else if (ch === '\\') dir = TURN_BS[dir];
        dirs.push(dir);
        const key = i * 4 + dir;
        if (seen.has(key)) return { loop: true, path };
        seen.add(key);
      }
      const end = y * w + x;
      if (path.length < 2 || end === s) return null;
      return { s: end, dir: k, path };
    };
    return {
      kind: 'ice', d, w, h, n, g, goal, slide, start,
      cellOf: (s) => s,
      moves(s) {
        const out = [];
        for (let k = 0; k < 4; k++) { const r = slide(s, k); if (r && !r.loop) out.push(r); }
        return out;
      },
      isGoal: (s) => s === goal
    };
  };

  M.model = function (d) {
    const f = KIND[d.kind];
    if (!f) throw new Error('unknown maze kind ' + d.kind);
    return f(d);
  };

  // breadth first from a state: the fewest moves to a goal, one shortest path,
  // and how many different shortest paths there are
  M.bfs = function (m, from, opts) {
    opts = opts || {};
    const start = from == null ? m.start : from;
    if (m.isGoal(start)) return { par: 0, path: [], count: 1, seen: 1 };
    const dist = new Map([[start, 0]]), prev = new Map(), cnt = new Map([[start, 1]]);
    let frontier = [start], depth = 0;
    const limit = opts.limit || 400000;
    while (frontier.length) {
      depth++;
      const next = [];
      for (const s of frontier) {
        const c = cnt.get(s);
        const mv = m.moves(s);
        for (let i = 0; i < mv.length; i++) {
          const t = mv[i].s, dt = dist.get(t);
          if (dt === undefined) { dist.set(t, depth); cnt.set(t, c); prev.set(t, { from: s, mv: mv[i] }); next.push(t); }
          else if (dt === depth) cnt.set(t, Math.min(1e9, cnt.get(t) + c));
        }
      }
      let goals = null;
      for (const t of next) if (m.isGoal(t)) (goals = goals || []).push(t);
      if (goals) {
        const path = [];
        let k = goals[0];
        while (k !== start) { const e = prev.get(k); path.unshift(e.mv); k = e.from; }
        let count = 0;
        goals.forEach((gs) => { count += cnt.get(gs); });
        return { par: depth, path, count, seen: dist.size };
      }
      if (dist.size > limit) break;
      frontier = next;
    }
    return { par: null, path: null, count: 0, seen: dist.size };
  };

  // everything reachable from the start, and how much of it is a trap (no way on to the goal)
  M.explore = function (m, cap) {
    cap = cap || 200000;
    const index = new Map([[m.start, 0]]), order = [m.start], rev = new Map();
    for (let i = 0; i < order.length && order.length < cap; i++) {
      const s = order[i];
      if (m.isGoal(s)) continue;
      m.moves(s).forEach((mv) => {
        if (!rev.has(mv.s)) rev.set(mv.s, []);
        rev.get(mv.s).push(s);
        if (!index.has(mv.s)) { index.set(mv.s, order.length); order.push(mv.s); }
      });
    }
    const good = new Set(order.filter((s) => m.isGoal(s)));
    const q = Array.from(good);
    while (q.length) { const b = q.pop(); (rev.get(b) || []).forEach((a) => { if (!good.has(a)) { good.add(a); q.push(a); } }); }
    return { reach: order.length, good: good.size, traps: order.length - good.size };
  };

  /* ================= makers =================
   * Each maker climbs: start from a solvable maze, change one thing at a time,
   * keep the change when the shortest solution gets no shorter (and no less
   * unique), and stop once the par lies in the level's band with few shortest
   * solutions. All randomness comes from the rng passed in.
   */
  const BANDS = {
    arrow: [null, [4, 6], [7, 9], [10, 12], [13, 16], [17, 40]],
    number: [null, [4, 6], [7, 9], [10, 12], [13, 16], [17, 40]],
    colour: [null, [5, 8], [9, 12], [13, 17], [18, 22], [23, 60]],
    streets: [null, [5, 8], [9, 12], [13, 17], [18, 23], [24, 60]],
    die: [null, [4, 7], [8, 11], [12, 16], [17, 22], [23, 60]],
    chase: [null, [4, 7], [8, 11], [12, 16], [17, 23], [24, 80]],
    ice: [null, [3, 4], [5, 7], [8, 10], [11, 13], [14, 40]]
  };
  const LIM = [0, 4, 3, 2, 2, 2];
  M.BANDS = BANDS;

  function climb(rng, o) {
    const over = (inf) => inf.par > o.band[1];
    const good = (inf) => {
      if (!(inf.par >= o.band[0] && inf.par <= o.band[1] && inf.count <= o.lim)) return false;
      if (!o.extra) return true;
      if (inf.extraOk == null) inf.extraOk = !!o.extra(inf);
      return inf.extraOk;
    };
    const score = o.score || ((inf) => inf.par - 0.6 * Math.log2(Math.max(1, inf.count)));
    for (let round = 0; round < (o.restarts || 5); round++) {
      let cur = null, ci = null;
      for (let t = 0; t < 40 && !ci; t++) { cur = o.init(); ci = cur && o.evaluate(cur); if (ci && over(ci)) ci = null; }
      if (!ci) continue;
      let sc = score(ci);
      for (let it = 0; it < o.iters && !good(ci); it++) {
        const cand = o.mutate(cur);
        if (!cand) continue;
        const inf = o.evaluate(cand);
        if (!inf || over(inf)) continue;
        const s2 = score(inf);
        if (s2 >= sc) { cur = cand; ci = inf; sc = s2; }
      }
      if (good(ci)) return { d: cur, info: ci };
    }
    return null;
  }
  M.climb = climb;

  const grid2 = (w, h, f) => Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_2, x) => f(x, y)));
  const copy2 = (G) => G.map((r) => r.slice());
  const rows2 = (G) => G.map((r) => r.join(''));
  const cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
  const manh = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  const corners = (w, h) => [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
  function farCell(rng, w, h, from, dmin) {
    for (let t = 0; t < 200; t++) { const c = [rng.int(w), rng.int(h)]; if (manh(c, from) >= dmin) return c; }
    return [w - 1 - from[0], h - 1 - from[1]];
  }
  function randCell(rng, w, h, not) {
    for (let t = 0; t < 200; t++) { const c = [rng.int(w), rng.int(h)]; if (!not || !not(c)) return c; }
    return null;
  }

  // the search result plus how many reachable positions are traps (no way on to the goal)
  function withTraps(m) {
    const r = M.bfs(m);
    if (!r.par) return null;
    r.traps = M.explore(m).traps;
    return r;
  }
  const trapScore = (inf) => inf.par - 0.6 * Math.log2(Math.max(1, inf.count)) + 0.25 * Math.min(inf.traps || 0, 8);
  const needTraps = (n) => (inf) => (inf.traps || 0) >= n;

  /* ---------- labyrinths ---------- */
  const LAB_SIZES = {
    square: [null, [8, 7], [12, 10], [16, 13], [22, 17], [30, 22]],
    hex: [null, 3, 5, 7, 9, 12],
    theta: [null, 5, 7, 9, 12, 15]
  };
  M.LAB_SIZES = LAB_SIZES;
  M.genLabyrinth = function (rng, level, o) {
    o = o || {};
    const grid = o.grid || rng.pick(['square', 'square', 'hex', 'theta']);
    const algos = grid === 'square' ? ['backtrack', 'prim', 'kruskal', 'eller', 'wilson'] : ['backtrack', 'prim', 'kruskal', 'wilson'];
    const d = { kind: 'labyrinth', grid, algo: o.algo || rng.pick(algos), seed: 0 };
    if (grid === 'square') { const s = o.size || LAB_SIZES.square[level]; d.w = s[0]; d.h = s[1]; }
    else if (grid === 'hex' && o.shape === 'rect') { const s = o.size || [LAB_SIZES.hex[level] * 2, LAB_SIZES.hex[level] * 2]; d.shape = 'rect'; d.w = s[0]; d.h = s[1]; }
    else d.R = o.size || LAB_SIZES[grid][level];
    if (o.braid || (o.braid == null && grid !== 'theta' && rng() < 0.18)) { d.braid = o.braid || 0.35; d.goal = 'centre'; }
    // a way through that is not too direct: try seeds until the path is long enough
    const span = grid === 'square' ? (d.goal === 'centre' ? d.h : d.w + d.h) : grid === 'hex' ? (d.shape === 'rect' ? d.w + d.h : (d.goal === 'centre' ? 2 * d.R : 3 * d.R)) : 2.2 * d.R;
    const want = (o.minPar != null ? o.minPar : (d.braid ? 1.0 : 1.35)) * span;
    let best = null;
    for (let t = 0; t < 40; t++) {
      d.seed = rng.int(1e9);
      const st = M.labyrinthStats(M.buildLabyrinth(d));
      if (!best || st.par > best.st.par) best = { seed: d.seed, st };
      if (st.par >= want) break;
    }
    d.seed = best.seed;
    return { data: d, par: best.st.par, stats: best.st };
  };

  /* ---------- arrow mazes ---------- */
  M.genArrow = function (rng, level, o) {
    o = o || {};
    const w = o.w || [0, 5, 6, 7, 8, 9][level], h = o.h || w;
    const band = o.band || BANDS.arrow[level], lim = o.lim || LIM[level];
    const diag = o.diag != null ? o.diag : level >= 2;
    const allowed = grid2(w, h, (x, y) => {
      const out = [];
      for (let k = 0; k < 8; k++) if ((diag || k % 2 === 0) && inB(w, h, x + D8[k][0], y + D8[k][1])) out.push(k);
      return out;
    });
    const st = o.start || rng.pick(corners(w, h));
    const gl = farCell(rng, w, h, st, Math.ceil((w + h) / 2));
    const data = (G) => ({ kind: 'arrow', rows: rows2(G), start: st });
    const set = (G, x, y) => { G[y][x] = ARROWS[rng.pick(allowed[y][x])]; };
    const res = climb(rng, {
      band, lim, iters: o.iters || 2500, score: trapScore, extra: needTraps(o.traps != null ? o.traps : [0, 0, 1, 2, 2, 3][level]),
      init() { const G = grid2(w, h, () => ''); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) set(G, x, y); G[gl[1]][gl[0]] = '★'; return G; },
      mutate(G) {
        const H = copy2(G), times = rng() < 0.3 ? 2 : 1;
        for (let t = 0; t < times; t++) { const x = rng.int(w), y = rng.int(h); if (H[y][x] !== '★') set(H, x, y); }
        return H;
      },
      evaluate(G) { return withTraps(KIND.arrow(data(G))); }
    });
    return res && { data: data(res.d), par: res.info.par, count: res.info.count };
  };

  /* ---------- number (jumping) mazes ---------- */
  M.genNumber = function (rng, level, o) {
    o = o || {};
    const w = o.w || [0, 5, 6, 7, 8, 9][level], h = o.h || w;
    const band = o.band || BANDS.number[level], lim = o.lim || LIM[level];
    const maxN = o.maxN || [0, 3, 4, 5, 5, 6][level];
    const dirs = [0, 2, 4, 6];
    const allowed = grid2(w, h, (x, y) => {
      const out = [];
      for (let k = 1; k <= maxN; k++) if (dirs.some((di) => inB(w, h, x + D8[di][0] * k, y + D8[di][1] * k))) out.push(k);
      return out;
    });
    const st = o.start || rng.pick(corners(w, h));
    const gl = farCell(rng, w, h, st, Math.ceil((w + h) / 2));
    const data = (G) => ({ kind: 'number', rows: rows2(G), start: st });
    const set = (G, x, y) => { G[y][x] = String(rng.pick(allowed[y][x])); };
    const res = climb(rng, {
      band, lim, iters: o.iters || 2500, score: trapScore, extra: needTraps(o.traps != null ? o.traps : [0, 0, 1, 2, 2, 3][level]),
      init() { const G = grid2(w, h, () => ''); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) set(G, x, y); G[gl[1]][gl[0]] = '*'; return G; },
      mutate(G) {
        const H = copy2(G), times = rng() < 0.3 ? 2 : 1;
        for (let t = 0; t < times; t++) { const x = rng.int(w), y = rng.int(h); if (H[y][x] !== '*') set(H, x, y); }
        return H;
      },
      evaluate(G) { return withTraps(KIND.number(data(G))); }
    });
    return res && { data: data(res.d), par: res.info.par, count: res.info.count };
  };

  /* ---------- streets: coloured (alternating) and one-way ---------- */
  function genStreetsLike(rng, level, o, kind) {
    const w = o.w || [0, 5, 6, 6, 7, 7][level], h = o.h || [0, 4, 5, 6, 6, 7][level];
    const band = o.band || BANDS[kind][level], lim = o.lim || LIM[level];
    let hpool, vpool, extra = {};
    if (kind === 'colour') {
      const order = o.order || (level >= 4 && rng() < 0.5 ? 'ryb' : 'rb');
      extra.order = order;
      hpool = vpool = order.split('');
    } else {
      hpool = ['=', '=', '>', '<'];
      vpool = ['|', '|', 'v', '^'];
      if (o.noLeft || (o.noLeft == null && level >= 3 && rng() < 0.5)) extra.noLeft = true;
    }
    const hole = o.hole != null ? o.hole : 0.14;
    const pickH = () => (rng() < hole ? '.' : rng.pick(hpool));
    const pickV = () => (rng() < hole ? '.' : rng.pick(vpool));
    const st = o.start || rng.pick(corners(w, h));
    const gl = o.goal || farCell(rng, w, h, st, Math.ceil((w + h) * 0.6));
    const data = (E) => Object.assign({ kind, w, h, hs: rows2(E.hs), vs: rows2(E.vs), start: st, goal: gl }, extra);
    const res = climb(rng, {
      band, lim, iters: o.iters || 2500,
      init() { return { hs: grid2(w - 1, h, pickH), vs: grid2(w, h - 1, pickV) }; },
      mutate(E) {
        const F = { hs: copy2(E.hs), vs: copy2(E.vs) }, times = rng() < 0.3 ? 2 : 1;
        for (let t = 0; t < times; t++) {
          if (rng() < (w - 1) * h / ((w - 1) * h + w * (h - 1))) { const x = rng.int(w - 1), y = rng.int(h); F.hs[y][x] = pickH(); }
          else { const x = rng.int(w), y = rng.int(h - 1); F.vs[y][x] = pickV(); }
        }
        return F;
      },
      evaluate(E) { const r = M.bfs(KIND[kind](data(E))); return r.par ? r : null; }
    });
    return res && { data: data(res.d), par: res.info.par, count: res.info.count };
  }
  M.genColour = (rng, level, o) => genStreetsLike(rng, level, o || {}, 'colour');
  M.genStreets = (rng, level, o) => genStreetsLike(rng, level, o || {}, 'streets');

  /* ---------- the rolling die ---------- */
  M.genDie = function (rng, level, o) {
    o = o || {};
    const w = o.w || [0, 4, 5, 6, 6, 7][level], h = o.h || [0, 4, 5, 5, 6, 7][level];
    const band = o.band || BANDS.die[level], lim = o.lim || LIM[level];
    const o0 = o.die || [1, 2, 3];
    const holeP = o.holes != null ? o.holes : 0.1;
    const wildP = o.wild != null ? o.wild : [0, 0, 0.04, 0.05, 0.06, 0.06][level];
    const st = o.start || rng.pick(corners(w, h));
    const data = (S) => ({ kind: 'die', rows: rows2(S.G), start: st, goal: S.gl, die: o0.slice() });
    const digit = () => String(1 + rng.int(6));
    const res = climb(rng, {
      band, lim, iters: o.iters || 2500, restarts: 9,
      extra: (inf) => inf.par >= inf.manh + (level >= 2 ? 2 : 1) && inf.reach >= inf.par * (level >= 3 ? 1.6 : 1.2),
      // favour mazes with side turnings: more reachable positions
      score: (inf) => inf.par - 0.6 * Math.log2(Math.max(1, inf.count)) + 0.06 * Math.min(inf.reach, inf.par * 3),
      init() {
        // a random walk of the die writes the faces it shows, so the start is solvable
        const G = grid2(w, h, digit);
        G[st[1]][st[0]] = 'S';
        let c = st.slice(), or = o0.slice();
        const seen = new Set([c[0] + ',' + c[1]]);
        const want = rng.range(band[0], band[1] + 3);
        for (let k = 0; k < want; k++) {
          const opts = [0, 1, 2, 3].filter((di) => { const nx = c[0] + D4[di][0], ny = c[1] + D4[di][1]; return inB(w, h, nx, ny) && !seen.has(nx + ',' + ny); });
          if (!opts.length) break;
          const di = rng.pick(opts);
          or = roll(or, di);
          c = [c[0] + D4[di][0], c[1] + D4[di][1]];
          seen.add(c[0] + ',' + c[1]);
          G[c[1]][c[0]] = String(or[0]);
        }
        if (c[0] === st[0] && c[1] === st[1]) return null;
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!seen.has(x + ',' + y) && rng() < holeP) G[y][x] = '#';
        return { G, gl: c };
      },
      mutate(S) {
        const G = copy2(S.G), times = rng() < 0.3 ? 2 : 1;
        for (let t = 0; t < times; t++) {
          const x = rng.int(w), y = rng.int(h);
          if ((x === st[0] && y === st[1]) || (x === S.gl[0] && y === S.gl[1])) continue;
          const r = rng();
          G[y][x] = r < holeP ? '#' : r < holeP + wildP ? '*' : digit();
        }
        return { G, gl: S.gl };
      },
      evaluate(S) {
        const r = M.bfs(KIND.die(data(S)));
        if (!r.par) return null;
        r.manh = manh(st, S.gl);
        r.reach = M.explore(KIND.die(data(S))).reach;
        return r;
      }
    });
    return res && { data: data(res.d), par: res.info.par, count: res.info.count };
  };

  /* ---------- the chase ---------- */
  M.plainChase = function (m) {
    // Theseus alone: the fewest steps to the exit, ignoring the minotaur
    const t0 = Math.floor(m.start / m.n);
    const dist = new Int32Array(m.n).fill(-1);
    dist[t0] = 0;
    const q = [t0];
    for (let i = 0; i < q.length; i++) {
      const c = q[i];
      for (let k = 0; k < 4; k++) {
        if (m.wall(c, k)) continue;
        const j = c + D4[k][0] + D4[k][1] * m.w;
        if (dist[j] < 0) { dist[j] = dist[c] + 1; q.push(j); }
      }
    }
    return dist[m.exitCell] < 0 ? null : dist[m.exitCell] + 1;
  };
  M.genChase = function (rng, level, o) {
    o = o || {};
    const w = o.w || [0, 4, 5, 6, 6, 7][level], h = o.h || [0, 4, 5, 5, 6, 7][level];
    const band = o.band || BANDS.chase[level], lim = o.lim || LIM[level];
    const need = o.need != null ? o.need : [0, 1, 2, 3, 4, 5][level];
    const pw = o.walls || 0.3;
    const randExit = () => {
      const side = rng.int(4);
      if (side === 0) return [rng.int(w), 0, 'N'];
      if (side === 2) return [rng.int(w), h - 1, 'S'];
      if (side === 1) return [w - 1, rng.int(h), 'E'];
      return [0, rng.int(h), 'W'];
    };
    const data = (S) => ({ kind: 'chase', w, h, ew: rows2(S.ew), sw: rows2(S.sw), t: S.t, m: S.m, exit: S.exit });
    const res = climb(rng, {
      band, lim, iters: o.iters || 900,
      extra: (inf) => inf.plain != null && inf.par >= inf.plain + need,
      score: (inf) => inf.par + 0.5 * (inf.par - (inf.plain || 0)) - 0.6 * Math.log2(Math.max(1, inf.count)),
      init() {
        const t = randCell(rng, w, h), exit = randExit();
        const m = randCell(rng, w, h, (c) => manh(c, t) < 2);
        return { ew: grid2(w - 1, h, () => (rng() < pw ? '|' : '.')), sw: grid2(w, h - 1, () => (rng() < pw ? '-' : '.')), t, m, exit };
      },
      mutate(S) {
        const T = { ew: copy2(S.ew), sw: copy2(S.sw), t: S.t, m: S.m, exit: S.exit };
        const r = rng();
        if (r < 0.74) {
          if (rng() < 0.5) { const x = rng.int(w - 1), y = rng.int(h); T.ew[y][x] = T.ew[y][x] === '|' ? '.' : '|'; }
          else { const x = rng.int(w), y = rng.int(h - 1); T.sw[y][x] = T.sw[y][x] === '-' ? '.' : '-'; }
        } else if (r < 0.83) T.t = randCell(rng, w, h, (c) => c[0] === S.m[0] && c[1] === S.m[1]);
        else if (r < 0.92) T.m = randCell(rng, w, h, (c) => manh(c, S.t) < 2);
        else T.exit = randExit();
        return T;
      },
      evaluate(S) {
        const m = KIND.chase(data(S));
        const r = M.bfs(m);
        if (!r.par) return null;
        r.plain = M.plainChase(m);
        return r;
      }
    });
    return res && { data: data(res.d), par: res.info.par, count: res.info.count, plain: res.info.plain };
  };

  /* ---------- ice and mirrors ---------- */
  M.genIce = function (rng, level, o) {
    o = o || {};
    const w = o.w || [0, 6, 7, 8, 9, 10][level], h = o.h || w;
    const band = o.band || BANDS.ice[level], lim = o.lim || LIM[level];
    const sand = o.sand != null ? o.sand : level >= 3;
    const mirrors = o.mirrors != null ? o.mirrors : level >= 4;
    const pool = ['#', '#', '#', '#'];
    if (sand) pool.push(':');
    if (mirrors) pool.push('/', '\\', '/', '\\');
    const rockP = o.rocks || 0.16;
    const data = (S) => ({ kind: 'ice', rows: rows2(S.G), start: S.st, goal: S.gl });
    const free = (G, c) => G[c[1]][c[0]] === '.';
    const res = climb(rng, {
      band, lim, iters: o.iters || 2500, restarts: 8, score: trapScore, extra: needTraps(o.traps != null ? o.traps : [0, 0, 0, 1, 1, 1][level]),
      init() {
        const G = grid2(w, h, () => (rng() < rockP ? rng.pick(pool) : '.'));
        const st = randCell(rng, w, h, (c) => !free(G, c));
        const gl = st && randCell(rng, w, h, (c) => !free(G, c) || manh(c, st) < 3);
        return st && gl ? { G, st, gl } : null;
      },
      mutate(S) {
        const G = copy2(S.G);
        let st = S.st, gl = S.gl;
        const r = rng();
        if (r < 0.86) {
          const x = rng.int(w), y = rng.int(h);
          if ((x === st[0] && y === st[1]) || (x === gl[0] && y === gl[1])) return null;
          G[y][x] = G[y][x] === '.' ? rng.pick(pool) : (rng() < 0.6 ? '.' : rng.pick(pool));
        } else if (r < 0.93) gl = randCell(rng, w, h, (c) => !free(G, c) || (c[0] === st[0] && c[1] === st[1]));
        else st = randCell(rng, w, h, (c) => !free(G, c) || (c[0] === gl[0] && c[1] === gl[1]));
        return st && gl ? { G, st, gl } : null;
      },
      evaluate(S) { return withTraps(KIND.ice(data(S))); }
    });
    return res && { data: data(res.d), par: res.info.par, count: res.info.count };
  };

  M.GEN = { labyrinth: M.genLabyrinth, arrow: M.genArrow, number: M.genNumber, colour: M.genColour, streets: M.genStreets, die: M.genDie, chase: M.genChase, ice: M.genIce };
})(typeof window !== 'undefined' ? window : globalThis);
