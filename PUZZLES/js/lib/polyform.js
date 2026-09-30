/* The Puzzle Cabinet · js/lib/polyform.js
 *
 * Polyiamonds and polyhexes: shapes made of equilateral triangles or of
 * regular hexagons joined edge to edge. The twin of js/lib/polyo.js for the
 * two other regular grids. Shared by engines/polyform.js and its generator.
 *
 * Both grids live on one lattice: the points (k + Y/2, Y·H), H = √3/2, are the
 * corners of the triangles and the centres of the hexagons. Cells are [X, Y]
 * integer pairs with the centre at x = X/2:
 *   'tri'  row Y is the strip between the lines y = Y·H and (Y+1)·H; cell
 *          (X, Y) points up (apex at the top) when X + Y is even, else down.
 *   'hex'  pointy-top hexagons of width 1, centre (X/2, Y·H); only cells with
 *          X + Y even exist (doubled coordinates).
 * Turning by 60° about a lattice point, or mirroring left to right through
 * one, maps each grid onto itself, so a piece whose pivot sits on a lattice
 * point stays on the grid for every { rot: 60·k, flip } placement.
 *
 *   PF.G.tri / PF.G.hex          the grids: centre(c), poly(c), nb(c), at(p) …
 *   PF.parse(g, rows)            rows of text -> cells
 *   PF.grid(g, rows)             -> Map 'X,Y' -> the character there
 *   PF.norm(g, cells), key, canon, orient(g, cells, t), orients(g, cells, free)
 *                                symmetry t = flip·6 + rot/60: the same turn and mirror as
 *                                the workbench's { rot, flip } placement
 *   PF.outline(g, cells)         boundary loops in world coordinates (holes run the other way)
 *   PF.innerEdges(g, cells)      the edges between two cells of the shape
 *   PF.components / connected / holes / bbox
 *   PF.LIB.tri / PF.LIB.hex      the named pieces: name -> { cells, color, full, letter }
 *   PF.pack(spec)                exact cover of a region by pieces (js/lib/dlx.js)
 *   PF.grow(g, shapes, rng, o)   a compact board grown from pieces (the solution comes with it)
 *   PF.landscape(g, region, pls) turned so the board is wider than tall
 *   PF.solRows(g, region, pls)   the solution as rows of text
 *   PF.colour(g, c)              the classic colouring: up/down (0/1) or the three hexagon colours (0/1/2)
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};
  const H = Math.sqrt(3) / 2;
  const R = 1 / Math.sqrt(3);
  const K = (x, y) => x + ',' + y;
  const COS = [], SIN = [];
  for (let k = 0; k < 6; k++) { COS.push(Math.cos(k * Math.PI / 3)); SIN.push(Math.sin(k * Math.PI / 3)); }

  /* ---------- the two grids ---------- */

  const tri = {
    id: 'tri', cell: 'triangle', cells: 'triangles', piece: 'polyiamond',
    up(c) { return ((c[0] + c[1]) & 1) === 0; },
    valid() { return true; },
    centre(c) { return [c[0] / 2, (c[1] + (this.up(c) ? 2 / 3 : 1 / 3)) * H]; },
    // corners as integer pairs (2x, y/H), clockwise on screen
    vi(c) {
      const x = c[0], y = c[1];
      return this.up(c) ? [[x, y], [x + 1, y + 1], [x - 1, y + 1]] : [[x - 1, y], [x + 1, y], [x, y + 1]];
    },
    vr(v) { return [v[0] / 2, v[1] * H]; },
    nb(c) { const x = c[0], y = c[1]; return [[x - 1, y], [x + 1, y], this.up(c) ? [x, y + 1] : [x, y - 1]]; },
    // the cell whose centre is nearest to p
    at(p) {
      const X0 = Math.round(p[0] * 2), Y0 = Math.floor(p[1] / H);
      let best = null, bd = Infinity;
      for (let y = Y0 - 1; y <= Y0 + 1; y++) {
        for (let x = X0 - 1; x <= X0 + 1; x++) {
          const q = this.centre([x, y]), d = (q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]);
          if (d < bd) { bd = d; best = [x, y]; }
        }
      }
      return best;
    },
    inset: 0.09
  };

  const hex = {
    id: 'hex', cell: 'hexagon', cells: 'hexagons', piece: 'polyhex',
    valid(c) { return ((c[0] + c[1]) & 1) === 0; },
    centre(c) { return [c[0] / 2, c[1] * H]; },
    // corners as integer pairs (2x, 2y/R), clockwise on screen, starting at the top
    vi(c) {
      const x = c[0], y = 3 * c[1];
      return [[x, y - 2], [x + 1, y - 1], [x + 1, y + 1], [x, y + 2], [x - 1, y + 1], [x - 1, y - 1]];
    },
    vr(v) { return [v[0] / 2, v[1] * R / 2]; },
    nb(c) { const x = c[0], y = c[1]; return [[x + 2, y], [x + 1, y + 1], [x - 1, y + 1], [x - 2, y], [x - 1, y - 1], [x + 1, y - 1]]; },
    at(p) {
      const Y0 = Math.round(p[1] / H);
      let best = null, bd = Infinity;
      for (let y = Y0 - 1; y <= Y0 + 1; y++) {
        const X0 = Math.round(p[0] * 2);
        for (let x = X0 - 2; x <= X0 + 2; x++) {
          if (((x + y) & 1) !== 0) continue;
          const q = this.centre([x, y]), d = (q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1]);
          if (d < bd) { bd = d; best = [x, y]; }
        }
      }
      return best;
    },
    inset: 0.07
  };
  const G = { tri, hex };
  const gridOf = (g) => (typeof g === 'string' ? G[g] : g);

  // the lattice point nearest to p (triangle corners = hexagon centres)
  function latticePoint(p) {
    const y = Math.round(p[1] / H);
    const x = Math.round(p[0] - y / 2) + y / 2;
    // the rows above and below may hold a nearer point
    let best = [x, y * H], bd = dist2(best, p);
    [y - 1, y + 1].forEach((yy) => {
      const q = [Math.round(p[0] - yy / 2) + yy / 2, yy * H], d = dist2(q, p);
      if (d < bd) { bd = d; best = q; }
    });
    return best;
  }
  function dist2(a, b) { return (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]); }

  // a point under symmetry t about the origin (the workbench's flip-then-turn)
  function tpoint(p, t) {
    let x = p[0];
    const y = p[1];
    if (t >= 6) x = -x;
    const k = t % 6;
    return [x * COS[k] - y * SIN[k], x * SIN[k] + y * COS[k]];
  }

  /* ---------- reading and naming shapes ---------- */

  function parse(g, rows) {
    if (typeof rows === 'string') rows = rows.split('|');
    const out = [];
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) { const ch = r[x]; if (ch !== '.' && ch !== ' ') out.push([x, y]); }
    });
    return out;
  }
  function grid(g, rows) {
    if (typeof rows === 'string') rows = rows.split('|');
    const m = new Map();
    rows.forEach((r, y) => {
      for (let x = 0; x < r.length; x++) { const ch = r[x]; if (ch !== '.' && ch !== ' ') m.set(K(x, y), ch); }
    });
    return m;
  }

  // moved by a lattice step so the smallest Y is 0 and the smallest X is 0 or 1; sorted by row then column
  function shiftOf(cells) {
    let mx = Infinity, my = Infinity;
    for (const c of cells) { if (c[0] < mx) mx = c[0]; if (c[1] < my) my = c[1]; }
    const dy = -my;
    let dx = -mx;
    if (((dx - dy) & 1) !== 0) dx += 1;
    return [dx, dy];
  }
  function norm(g, cells) {
    const s = shiftOf(cells);
    return cells.map((c) => [c[0] + s[0], c[1] + s[1]]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  }
  function key(g, cells) { return norm(g, cells).map((c) => c[0] + '.' + c[1]).join(' '); }

  function orient(g, cells, t) {
    g = gridOf(g);
    return norm(g, cells.map((c) => g.at(tpoint(g.centre(c), t))));
  }
  function orients(g, cells, free) {
    const out = [], seen = new Set();
    const n = free === false ? 6 : 12;
    for (let t = 0; t < n; t++) {
      const o = orient(g, cells, t), k = key(g, o);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ cells: o, t, key: k });
    }
    return out;
  }
  function canon(g, cells, free) {
    let best = null;
    const n = free === false ? 6 : 12;
    for (let t = 0; t < n; t++) {
      const k = key(g, orient(g, cells, t));
      if (best === null || k < best) best = k;
    }
    return best;
  }
  // how many of the 12 placements (turns and mirror images) look the same
  function symmetryOrder(g, cells) { return 12 / orients(g, cells, true).length; }

  /* ---------- drawing ---------- */

  // the boundary as closed loops of corners in world coordinates: the outside
  // runs clockwise on screen (y down), holes the other way (even-odd fill)
  function outline(g, cells) {
    g = gridOf(g);
    const edges = [], have = new Set();
    cells.forEach((c) => {
      const v = g.vi(c);
      for (let i = 0; i < v.length; i++) { const a = v[i], b = v[(i + 1) % v.length]; have.add(K(a[0], a[1]) + '>' + K(b[0], b[1])); }
    });
    cells.forEach((c) => {
      const v = g.vi(c);
      for (let i = 0; i < v.length; i++) {
        const a = v[i], b = v[(i + 1) % v.length];
        if (!have.has(K(b[0], b[1]) + '>' + K(a[0], a[1]))) edges.push([a, b]);
      }
    });
    const from = new Map();
    edges.forEach((e, i) => { const k = K(e[0][0], e[0][1]); if (!from.has(k)) from.set(k, []); from.get(k).push(i); });
    const used = new Uint8Array(edges.length);
    const loops = [];
    for (let s = 0; s < edges.length; s++) {
      if (used[s]) continue;
      const pts = [];
      let i = s;
      while (i >= 0 && !used[i]) {
        used[i] = 1;
        const e = edges[i];
        pts.push(e[0]);
        const a = g.vr(e[0]), b = g.vr(e[1]);
        const d = [b[0] - a[0], b[1] - a[1]];
        let best = -1, bs = -Infinity;
        // where two cells touch only at a corner, turn right as sharply as possible: each keeps its own loop
        for (const j of (from.get(K(e[1][0], e[1][1])) || [])) {
          if (used[j]) continue;
          const f = edges[j], c = g.vr(f[1]);
          const d2 = [c[0] - b[0], c[1] - b[1]];
          const ang = Math.atan2(d[0] * d2[1] - d[1] * d2[0], d[0] * d2[0] + d[1] * d2[1]);
          if (ang > bs) { bs = ang; best = j; }
        }
        i = best;
      }
      loops.push(corners(pts).map((v) => g.vr(v)));
    }
    return loops;
  }
  function corners(pts) {
    const n = pts.length, out = [];
    for (let i = 0; i < n; i++) {
      const a = pts[(i + n - 1) % n], b = pts[i], c = pts[(i + 1) % n];
      if ((b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0]) !== 0) out.push(b);
    }
    return out.length ? out : pts;
  }

  // the edges between two cells of the shape: [[x0, y0, x1, y1], ...] in world coordinates
  function innerEdges(g, cells) {
    g = gridOf(g);
    const cnt = new Map();
    cells.forEach((c) => {
      const v = g.vi(c);
      for (let i = 0; i < v.length; i++) {
        const a = v[i], b = v[(i + 1) % v.length];
        const k = a[0] < b[0] || (a[0] === b[0] && a[1] < b[1]) ? K(a[0], a[1]) + '|' + K(b[0], b[1]) : K(b[0], b[1]) + '|' + K(a[0], a[1]);
        cnt.set(k, (cnt.get(k) || 0) + 1);
      }
    });
    const out = [];
    cnt.forEach((n, k) => {
      if (n < 2) return;
      const ab = k.split('|').map((s) => g.vr(s.split(',').map(Number)));
      out.push([ab[0][0], ab[0][1], ab[1][0], ab[1][1]]);
    });
    return out;
  }

  // a cell's polygon in world coordinates, shrunk towards its centre by d (0 = the cell itself)
  function poly(g, c, d) {
    g = gridOf(g);
    const cen = g.centre(c);
    return g.vi(c).map((v) => {
      const p = g.vr(v);
      if (!d) return p;
      const dx = p[0] - cen[0], dy = p[1] - cen[1], L = Math.hypot(dx, dy);
      return [p[0] - dx / L * d, p[1] - dy / L * d];
    });
  }

  function bbox(g, cells) {
    g = gridOf(g);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    cells.forEach((c) => g.vi(c).forEach((v) => {
      const p = g.vr(v);
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    }));
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  }
  // the bounds in cell coordinates
  function cbox(cells) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const c of cells) {
      if (c[0] < x0) x0 = c[0]; if (c[0] > x1) x1 = c[0];
      if (c[1] < y0) y0 = c[1]; if (c[1] > y1) y1 = c[1];
    }
    return { x0, y0, x1, y1 };
  }

  function components(g, cells) {
    g = gridOf(g);
    const set = new Map(cells.map((c) => [K(c[0], c[1]), c]));
    const seen = new Set(), out = [];
    for (const c of cells) {
      const k0 = K(c[0], c[1]);
      if (seen.has(k0)) continue;
      const comp = [], stack = [c];
      seen.add(k0);
      while (stack.length) {
        const q = stack.pop();
        comp.push(q);
        for (const n of g.nb(q)) {
          const k = K(n[0], n[1]);
          if (set.has(k) && !seen.has(k)) { seen.add(k); stack.push(set.get(k)); }
        }
      }
      out.push(comp);
    }
    return out;
  }
  function connected(g, cells) { return cells.length > 0 && components(g, cells).length === 1; }

  // true when the shape encloses empty cells
  function holes(g, cells) {
    g = gridOf(g);
    const b = cbox(cells);
    const set = new Set(cells.map((c) => K(c[0], c[1])));
    const inBox = (c) => c[0] >= b.x0 - 3 && c[0] <= b.x1 + 3 && c[1] >= b.y0 - 2 && c[1] <= b.y1 + 2;
    let empty = 0;
    for (let y = b.y0 - 2; y <= b.y1 + 2; y++) for (let x = b.x0 - 3; x <= b.x1 + 3; x++) if (g.valid([x, y]) && !set.has(K(x, y))) empty++;
    let start = [b.x0 - 3, b.y0 - 2];
    if (!g.valid(start)) start = [b.x0 - 2, b.y0 - 2];
    const seen = new Set([K(start[0], start[1])]), stack = [start];
    while (stack.length) {
      const q = stack.pop();
      for (const n of g.nb(q)) {
        const k = K(n[0], n[1]);
        if (!inBox(n) || seen.has(k) || set.has(k)) continue;
        seen.add(k);
        stack.push(n);
      }
    }
    return seen.size !== empty;
  }

  // the classic colouring: triangles up (0) and down (1); hexagons in three colours, neighbours always differ
  function colour(g, c) {
    g = gridOf(g);
    if (g.id === 'tri') return g.up(c) ? 0 : 1;
    const v = (c[0] - 3 * c[1]) / 2;
    return ((v % 3) + 3) % 3;
  }
  function colourCount(g, cells) {
    const n = gridOf(g).id === 'tri' ? [0, 0] : [0, 0, 0];
    cells.forEach((c) => { n[colour(g, c)]++; });
    return n;
  }

  /* ---------- the named pieces ---------- */

  function hsl(h, s, l) {
    s /= 100; l /= 100;
    const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const hx = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
    return '#' + hx(f(0)) + hx(f(8)) + hx(f(4));
  }

  // lay a piece down the way it rests in the box: as flat as possible, then as narrow
  function rest(g, cells) {
    let best = null, bs = Infinity;
    for (let t = 0; t < 12; t++) {
      const o = orient(g, cells, t), b = bbox(g, o);
      // (triangles: rather pointing up than down)
      const downs = gridOf(g).id === 'tri' ? o.filter((c) => !tri.up(c)).length : 0;
      const s = Math.round(b.h * 1000) * 1e4 + Math.round(b.w * 100) + downs * 0.01;
      if (s < bs - 1e-9) { bs = s; best = o; }
    }
    return best;
  }

  const LIB = { tri: {}, hex: {} };
  // triangles from the rhombus coordinates (x, y, z) used by David Goodger's Polyform Puzzler:
  // rhombus (x, y) of the slanted lattice holds triangle z = 0 and z = 1
  function fromRhombi(list) {
    const cells = [[0, 0, 0]].concat(list).map((q) => {
      const px = q[0] + q[1] / 2, py = q[1] * H;
      const cen = q[2] ? [px + 1, py + 2 * H / 3] : [px + 0.5, py + H / 3];
      return tri.at(cen);
    });
    return rest(tri, cells);
  }
  // hexagons from axial coordinates (a, b)
  function fromAxial(list) { return rest(hex, [[0, 0]].concat(list).map((q) => [2 * q[0] + q[1], q[1]])); }
  function libT(name, list, color, full, extra) { LIB.tri[name] = Object.assign({ name, grid: 'tri', cells: fromRhombi(list), color, full }, extra || {}); }
  function libH(name, list, color, full, extra) { LIB.hex[name] = Object.assign({ name, grid: 'hex', cells: fromAxial(list), color, full }, extra || {}); }

  libT('T1', [], '#e9ecef', 'moniamond', { short: 'triangle' });
  libT('D2', [[0, 0, 1]], '#ffd8a8', 'diamond');
  libT('I3', [[0, 0, 1], [1, 0, 0]], '#74c0fc', 'triamond');
  libT('I4', [[0, 0, 1], [1, 0, 0], [1, 0, 1]], '#66d9e8', 'straight tetriamond');
  libT('C4', [[0, 0, 1], [1, 0, 0], [1, -1, 1]], '#cc5de8', 'bent tetriamond');
  libT('T4', [[0, 0, 1], [1, 0, 0], [0, 1, 0]], '#ffe066', 'triangle tetriamond');
  libT('I5', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [2, 0, 0]], '#ff922b', 'straight pentiamond');
  libT('C5', [[0, 0, 1], [1, 0, 0], [1, -1, 1], [0, -1, 1]], '#69db7c', 'C pentiamond');
  libT('L5', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0]], '#4dabf7', 'L pentiamond');
  libT('P5', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [0, 1, 0]], '#f783ac', 'P pentiamond');
  // the twelve hexiamonds, with the names T. H. O'Beirne's circle gave them
  const HEXI = [
    ['I6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [2, 0, 0], [2, 0, 1]], '#ffa94d', 'bar'],
    ['P6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [2, 0, 0], [1, 1, 0]], '#ff6b6b', 'sphinx'],
    ['J6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [2, 0, 0], [0, -1, 1]], '#ffd43b', 'crook'],
    ['E6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [2, 0, 0], [1, -1, 1]], '#a9e34b', 'crown'],
    ['V6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [0, 1, 0], [0, 1, 1]], '#51cf66', 'lobster'],
    ['H6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [1, -1, 1], [2, -1, 0]], '#20c997', 'signpost'],
    ['S6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [0, -1, 1], [1, 1, 0]], '#3bc9db', 'snake'],
    ['X6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [0, 1, 0], [1, -1, 1]], '#4dabf7', 'butterfly'],
    ['C6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [1, 1, 1]], '#748ffc', 'chevron'],
    ['G6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [1, 1, 0], [0, 1, 1]], '#b197fc', 'hook'],
    ['F6', [[0, 0, 1], [1, 0, 0], [1, 0, 1], [0, 1, 0], [1, 1, 0]], '#f783ac', 'yacht'],
    ['O6', [[0, 0, 1], [1, 0, 0], [0, -1, 1], [1, -1, 0], [1, -1, 1]], '#e8a87c', 'hexagon']
  ];
  HEXI.forEach((h) => libT(h[0], h[1], h[2], h[3], { hexi: true }));
  const HEXIAMONDS = HEXI.map((h) => h[0]);

  libH('H1', [], '#e9ecef', 'monohex');
  libH('I2', [[1, 0]], '#ffd8a8', 'dihex');
  libH('I3', [[1, 0], [2, 0]], '#74c0fc', 'straight trihex');
  libH('V3', [[1, 0], [1, 1]], '#ff8787', 'bent trihex');
  libH('A3', [[1, 0], [0, 1]], '#ffd43b', 'triangle trihex');
  // the seven tetrahexes and their traditional names
  const TETRA = [
    ['I4', [[1, 0], [2, 0], [3, 0]], '#ffa94d', 'bar'],
    ['J4', [[1, 0], [2, 0], [2, 1]], '#a9e34b', 'worm'],
    ['P4', [[1, 0], [2, 0], [1, 1]], '#20c997', 'pistol'],
    ['S4', [[1, 0], [1, 1], [2, 1]], '#4dabf7', 'wave'],
    ['U4', [[-1, 1], [1, 0], [1, 1]], '#b197fc', 'arch'],
    ['Y4', [[1, 0], [2, -1], [1, 1]], '#f783ac', 'propeller'],
    ['O4', [[1, 0], [0, 1], [1, 1]], '#ffe066', 'bee']
  ];
  TETRA.forEach((h) => libH(h[0], h[1], h[2], h[3], { tetra: true }));
  const TETRAHEXES = TETRA.map((h) => h[0]);

  // the bigger sets, found by growing the smaller ones and numbered in a fixed order:
  // the 24 heptiamonds (h7-1 … h7-24) and the 22 pentahexes (p5-1 … p5-22)
  function growAll(g, base) {
    const seen = new Map();
    base.forEach((p) => {
      const set = new Set(p.map((c) => K(c[0], c[1])));
      p.forEach((c) => gridOf(g).nb(c).forEach((q) => {
        if (set.has(K(q[0], q[1]))) return;
        const s = p.concat([q]), k = canon(g, s);
        if (!seen.has(k)) seen.set(k, s);
      }));
    });
    return Array.from(seen.keys()).sort().map((k) => seen.get(k));
  }
  const HEPTA = [], PENTAHEX = [];
  growAll('tri', HEXIAMONDS.map((n) => LIB.tri[n].cells)).forEach((cells, i, all) => {
    const name = 'h7-' + (i + 1);
    LIB.tri[name] = { name, grid: 'tri', cells: rest(tri, cells), color: hsl(Math.round(i * 360 / all.length + 12) % 360, 70, 66), full: 'heptiamond ' + (i + 1), num: i + 1 };
    HEPTA.push(name);
  });
  growAll('hex', TETRAHEXES.map((n) => LIB.hex[n].cells)).forEach((cells, i, all) => {
    const name = 'p5-' + (i + 1);
    LIB.hex[name] = { name, grid: 'hex', cells: rest(hex, cells), color: hsl(Math.round(i * 360 / all.length + 20) % 360, 70, 66), full: 'pentahex ' + (i + 1), num: i + 1 };
    PENTAHEX.push(name);
  });
  const SETS = {
    tri: { tetri: ['I4', 'C4', 'T4'], penti: ['I5', 'C5', 'L5', 'P5'], hexi: HEXIAMONDS, hepta: HEPTA },
    hex: { tri: ['I3', 'V3', 'A3'], tetra: TETRAHEXES, penta: PENTAHEX }
  };

  // a piece given by name, or by its rows of text on the grid
  const EXTRA = ['#ff8787', '#ffa94d', '#ffd43b', '#a9e34b', '#51cf66', '#20c997', '#3bc9db', '#4dabf7', '#748ffc', '#b197fc', '#f783ac', '#e8a87c'];
  function piece(g, spec, i) {
    g = gridOf(g);
    const L = LIB[g.id][spec];
    if (L) return L;
    const cells = norm(g, parse(g, spec));
    return { name: spec, cells, color: EXTRA[(i || 0) % EXTRA.length], full: 'piece of ' + cells.length };
  }

  /* ---------- exact cover: pieces into a region ---------- */

  /* spec = {
   *   grid, region: cells, pieces: [cells, ...],
   *   fixed: [{ piece, cells }]  pieces already in place (their cells are taken)
   *   free: false                no turning over (default: allowed)
   *   max, nodeLimit, shuffle    passed to DLX
   * }
   * -> { sols: [[{ piece, cells, t }], ...], aborted, nodes }
   * If the pieces have more cells than the free region, pieces become optional.
   * When every piece left is the same shape and the areas agree, the pieces
   * need no columns of their own (so identical copies are not tried twice). */
  function pack(spec) {
    const DLX = C.DLX, g = gridOf(spec.grid);
    const taken = new Set(), fixedP = new Set();
    (spec.fixed || []).forEach((f) => { fixedP.add(f.piece); f.cells.forEach((c) => taken.add(K(c[0], c[1]))); });
    const col = new Map();
    let n = 0;
    spec.region.forEach((c) => { const k = K(c[0], c[1]); if (!taken.has(k) && !col.has(k)) col.set(k, n++); });
    const cellsN = n;
    let area = 0;
    const loose = [];
    spec.pieces.forEach((pc, i) => { if (!fixedP.has(i)) { loose.push(i); area += pc.length; } });
    if (area < cellsN) return { sols: [], aborted: false, nodes: 0 };
    const keys = loose.map((i) => canon(g, spec.pieces[i], spec.free));
    const same = loose.length > 1 && area === cellsN && keys.every((k) => k === keys[0]);
    const pcol = [];
    if (!same) loose.forEach((i) => { pcol[i] = n++; });
    const rows = [], meta = [];
    const shapes = new Map();
    loose.forEach((i, li) => {
      if (same && li > 0) return;
      const pc = spec.pieces[i];
      const ok = shapes.get(keys[li]) || orients(g, pc, spec.free);
      shapes.set(keys[li], ok);
      ok.forEach((o) => {
        const a = o.cells[0];
        col.forEach((ci, k) => {
          const xy = k.split(','), dx = +xy[0] - a[0], dy = +xy[1] - a[1];
          if (((dx + dy) & 1) !== 0) return;
          const r = [];
          for (const c of o.cells) {
            const cc = col.get(K(c[0] + dx, c[1] + dy));
            if (cc == null) return;
            r.push(cc);
          }
          if (!same) r.push(pcol[i]);
          rows.push(r);
          meta.push({ piece: i, t: o.t, cells: o.cells.map((c) => [c[0] + dx, c[1] + dy]) });
        });
      });
    });
    const exact = area === cellsN;
    const res = DLX.solve({
      primary: exact ? n : cellsN, secondary: exact ? 0 : n - cellsN,
      rows, max: spec.max || 1, nodeLimit: spec.nodeLimit || 2e6, shuffle: spec.shuffle
    });
    const sols = res.map((s) => {
      const out = s.map((ri) => Object.assign({}, meta[ri]));
      if (same) out.forEach((m, j) => { m.piece = loose[j]; });
      return out;
    });
    return { sols, aborted: !!res.aborted, nodes: res.nodes };
  }

  // how many ways (up to cap) to fill a region with a multiset of pieces, not counting swaps of identical ones
  function count(g, region, pieces, cap, nodeLimit) {
    const groups = new Map();
    pieces.forEach((pc) => { const k = canon(g, pc); if (!groups.has(k)) groups.set(k, { cells: pc, n: 0 }); groups.get(k).n++; });
    const types = Array.from(groups.values());
    if (types.length === pieces.length || types.length === 1) {
      const r = pack({ grid: g, region, pieces, max: cap, nodeLimit: nodeLimit || 3e6 });
      return { n: r.sols.length, capped: r.sols.length >= cap || r.aborted };
    }
    // pieces repeat: tile with the shapes freely, then keep the tilings with the right number of each
    g = gridOf(g);
    const col = new Map();
    region.forEach((c, i) => col.set(K(c[0], c[1]), i));
    const rows = [], type = [];
    types.forEach((t, ti) => {
      orients(g, t.cells).forEach((o) => {
        const a = o.cells[0];
        region.forEach((c) => {
          const dx = c[0] - a[0], dy = c[1] - a[1];
          if (((dx + dy) & 1) !== 0) return;
          const r = [];
          for (const q of o.cells) {
            const cc = col.get(K(q[0] + dx, q[1] + dy));
            if (cc == null) return;
            r.push(cc);
          }
          rows.push(r); type.push(ti);
        });
      });
    });
    const capAll = cap * 20;
    const res = C.DLX.solve({ primary: region.length, rows, max: capAll, nodeLimit: nodeLimit || 3e6 });
    let n = 0;
    res.forEach((sol) => {
      const cnt = types.map(() => 0);
      sol.forEach((ri) => cnt[type[ri]]++);
      if (types.every((t, ti) => cnt[ti] === t.n)) n++;
    });
    return { n: Math.min(n, cap), capped: n >= cap || res.length >= capAll || !!res.aborted };
  }

  /* ---------- growing a compact board from pieces ---------- */

  /* Lay the pieces down one after another, each touching the ones before,
   * preferring spots that share many edges and keep the bounding box small
   * and near the wanted aspect. The union is the board, the way the pieces
   * were laid is a solution.
   *   opts.aspect (width / height, default 1.3), opts.beta (greed, default 1.3), opts.boxW
   * -> { region, placements: [{ piece, cells }] }, or null */
  function grow(g, shapes, rng, opts) {
    g = gridOf(g);
    opts = opts || {};
    const occ = new Map();
    const placements = [];
    const order = rng.shuffle(shapes.map((s, i) => i));
    const aspect = opts.aspect || 1.3;
    let box = null;
    const boxOf = (cells) => bbox(g, cells);
    const union = (a, b) => ({ x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) });
    const put = (i, cells) => {
      cells.forEach((c) => occ.set(K(c[0], c[1]), i));
      placements.push({ piece: i, cells });
      const b = boxOf(cells);
      box = box ? union(box, b) : b;
    };
    for (let n = 0; n < order.length; n++) {
      const i = order[n];
      const ors = orients(g, shapes[i]);
      if (!n) { put(i, rng.pick(ors).cells); continue; }
      const frontier = new Map();
      occ.forEach((v, k) => {
        const xy = k.split(',').map(Number);
        g.nb(xy).forEach((q) => { const kq = K(q[0], q[1]); if (!occ.has(kq)) frontier.set(kq, q); });
      });
      const cands = [], seen = new Set();
      const bw = box.x1 - box.x0, bh = box.y1 - box.y0;
      frontier.forEach((e) => {
        ors.forEach((o) => o.cells.forEach((c) => {
          const dx = e[0] - c[0], dy = e[1] - c[1];
          if (((dx + dy) & 1) !== 0) return;
          const sk = o.key + '@' + dx + ',' + dy;
          if (seen.has(sk)) return;
          seen.add(sk);
          const cells = o.cells.map((q) => [q[0] + dx, q[1] + dy]);
          if (cells.some((q) => occ.has(K(q[0], q[1])))) return;
          let contact = 0;
          cells.forEach((q) => g.nb(q).forEach((d) => { if (occ.has(K(d[0], d[1]))) contact++; }));
          const b = union(box, boxOf(cells));
          const w = b.x1 - b.x0, h = b.y1 - b.y0;
          const grown = (w * h - bw * bh) / (g.id === 'tri' ? 0.433 : 0.866);
          const shapeBad = Math.abs(w - h * aspect) / Math.max(w, h);
          cands.push({ cells, score: contact * 2 - grown * (opts.boxW == null ? 0.3 : opts.boxW) - shapeBad * 4 });
        }));
      });
      if (!cands.length) return null;
      cands.sort((a, b) => b.score - a.score);
      const top = cands[0].score, beta = opts.beta || 1.3;
      const w = cands.map((c) => Math.exp(beta * (c.score - top)));
      let r = rng() * w.reduce((s, v) => s + v, 0);
      let pick = cands[0];
      for (let k = 0; k < cands.length; k++) { r -= w[k]; if (r <= 0) { pick = cands[k]; break; } }
      put(i, pick.cells);
    }
    const region = Array.from(occ.keys()).map((k) => k.split(',').map(Number));
    const s = shiftOf(region);
    const sh = (c) => [c[0] + s[0], c[1] + s[1]];
    return {
      region: region.map(sh),
      placements: placements.map((pl) => ({ piece: pl.piece, cells: pl.cells.map(sh) })).sort((a, c) => a.piece - c.piece)
    };
  }

  // the region and its placements under symmetry t, moved to the origin
  function transform(g, region, placements, t) {
    g = gridOf(g);
    const f = (c) => g.at(tpoint(g.centre(c), t));
    const reg = region.map(f);
    const s = shiftOf(reg);
    const sh = (c) => [c[0] + s[0], c[1] + s[1]];
    return { region: reg.map(sh), placements: (placements || []).map((pl) => Object.assign({}, pl, { cells: pl.cells.map((c) => sh(f(c))) })) };
  }
  // turned (and perhaps mirrored) so the board is as wide and flat as it can be: screens are landscape
  function landscape(g, region, placements, opts) {
    let best = null, bs = Infinity;
    const n = opts && opts.noMirror ? 6 : 12;
    for (let t = 0; t < n; t++) {
      const r = transform(g, region, null, t).region;
      const b = bbox(g, r);
      const s = b.h / b.w + (opts && opts.wide ? 0 : Math.abs(b.w / b.h - 1.6) * 0.05) + t * 1e-6;
      if (s < bs) { bs = s; best = t; }
    }
    return Object.assign(transform(g, region, placements, best), { t: best });
  }

  const MARK = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  // the rows of a solution: each cell marked with its piece's number; '.' an empty cell, ' ' no cell (hexagons)
  function solRows(g, region, placements, marks) {
    g = gridOf(g);
    marks = marks || MARK;
    const mark = new Map();
    region.forEach((c) => mark.set(K(c[0], c[1]), '#'));
    placements.forEach((pl) => pl.cells.forEach((c) => mark.set(K(c[0], c[1]), marks[pl.piece])));
    const b = cbox(region);
    const rows = [];
    for (let y = b.y0; y <= b.y1; y++) {
      let r = '';
      for (let x = Math.min(b.x0, 0); x <= b.x1; x++) r += mark.get(K(x, y)) || (g.valid([x, y]) ? '.' : ' ');
      rows.push(r.replace(/[ .]+$/, ''));
    }
    return rows;
  }

  /* ---------- words for a set of pieces ---------- */

  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one', 'twenty-two', 'twenty-three', 'twenty-four'];
  function joinAnd(list) { return list.length < 2 ? list.join('') : list.slice(0, -1).join(', ') + ' and ' + list[list.length - 1]; }
  function plural(word) { return /x$/.test(word) ? word + 'es' : word + 's'; }
  function describe(g, names) {
    g = gridOf(g);
    const L = LIB[g.id];
    const cnt = new Map();
    names.forEach((n) => cnt.set(n, (cnt.get(n) || 0) + 1));
    const parts = [];
    const whole = (set, label) => {
      if (!set.every((n) => cnt.get(n) && cnt.get(n) === cnt.get(set[0]))) return;
      const m = cnt.get(set[0]);
      parts.push(m === 1 ? label : NUMW[m] + ' sets of ' + label.replace(/^all /, 'the '));
      set.forEach((n) => cnt.delete(n));
    };
    if (g.id === 'tri') { whole(HEXIAMONDS, 'all twelve hexiamonds'); whole(SETS.tri.penti, 'all four pentiamonds'); whole(SETS.tri.tetri, 'all three tetriamonds'); }
    else { whole(TETRAHEXES, 'all seven tetrahexes'); whole(SETS.hex.tri, 'all three trihexes'); }
    const named = Array.from(cnt.keys()).filter((n) => L[n] && (L[n].hexi || L[n].tetra));
    if (named.length) {
      const one = named.filter((n) => cnt.get(n) === 1).map((n) => L[n].full);
      const many = named.filter((n) => cnt.get(n) > 1).map((n) => NUMW[cnt.get(n)] + ' ' + plural(L[n].full));
      const kind = g.id === 'tri' ? 'hexiamond' : 'tetrahex';
      const all = one.concat(many);
      const total = named.reduce((s, n) => s + cnt.get(n), 0);
      if (one.length && !many.length) parts.push('the ' + joinAnd(one) + ' ' + (total > 1 ? plural(kind) : kind));
      else parts.push(joinAnd(all.map((w) => (/^(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen)\b/.test(w) ? w : 'the ' + w))));
      named.forEach((n) => cnt.delete(n));
    }
    const nums = Array.from(cnt.keys()).filter((n) => L[n] && L[n].num);
    if (nums.length) {
      const kind = g.id === 'tri' ? 'heptiamond' : 'pentahex';
      const k = nums.reduce((s, n) => s + cnt.get(n), 0);
      parts.push(k === 1 ? 'this ' + kind : 'these ' + NUMW[k] + ' ' + plural(kind));
      nums.forEach((n) => cnt.delete(n));
    }
    cnt.forEach((m, n) => {
      const full = L[n] ? L[n].full : 'piece';
      // 'an L pentiamond', 'a C pentiamond', 'an octagon'
      const an = /^[aeiou]/.test(full) || /^[AEFHILMNORSX] /.test(full);
      parts.push(m === 1 ? (an ? 'an ' : 'a ') + full : NUMW[m] + ' ' + plural(full));
    });
    return joinAnd(parts);
  }

  C.Polyform = {
    H, R, K, G, gridOf, latticePoint, tpoint, parse, grid, shiftOf, norm, key, orient, orients, canon, symmetryOrder,
    outline, innerEdges, poly, bbox, cbox, components, connected, holes, colour, colourCount,
    LIB, SETS, HEXIAMONDS, TETRAHEXES, HEPTA, PENTAHEX, piece, hsl, pack, count, grow, transform, landscape, solRows, MARK,
    describe, joinAnd, NUMW
  };
})(typeof window !== 'undefined' ? window : globalThis);
