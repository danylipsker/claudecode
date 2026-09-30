/* The Puzzle Cabinet · engines/cubes.js
 *
 * Unit cubes in stacks and shapes, seen in 3D.
 *
 * data.kind:
 *   'count'     { H, view: [yaw, pitch], ask: 'total'|'hidden'|'missing'|'least', block?: [w, d, h], answer }
 *               H = heights: H[z][x], z = 0 the back row … x = 0 the left column. No cube floats.
 *               The stack is seen from one fixed place until the question is answered.
 *   'paint'     { dims: [a, b, c] | H, rule: 'all'|'nobottom'|'two'|'three', ask: 'table'|{ k }|'reverse', answer }
 *   'views'     { H, goal: 'any'|'min'|'max', answer? }   build a stack whose front, top and side views match those of H
 *   'viewpick'  { stacks: [H…], answer }                  which stack has these three views (those of stacks[answer])?
 *   'whichview' { H, side: 'front'|'top'|'right', options: [grid…], answer }   which picture is that view of the stack?
 *   'rot'       { a: cells, b: cells, qa, qb, answer: 'same'|'mirror'|'different', choices }   same shape, mirror image or neither?
 *   'rotpick'   { a: cells, qa, options: [{ c: cells, q }…], answer }   which one is the same shape as the first?
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const sp = () => C.space;
  const PPU = 24;
  const LET = 'ABCDEFGH';

  /* ---------- stacks ---------- */

  function dims(H) {
    let h = 0;
    H.forEach((r) => r.forEach((v) => { h = Math.max(h, v); }));
    return { w: H[0].length, d: H.length, h };
  }
  function stackCells(H) {
    const out = [];
    H.forEach((row, z) => row.forEach((v, x) => { for (let y = 0; y < v; y++) out.push([x, y, z]); }));
    return out;
  }
  const total = (H) => H.reduce((s, r) => s + r.reduce((a, b) => a + b, 0), 0);
  // the camera for a stack: turned about the middle of its box, seen from 6 × its radius
  function stackGeom(H, hmin) {
    const { w, d, h } = dims(H);
    const hh = Math.max(h, hmin || 1);
    const size = 0.5 * Math.hypot(w + 0.4, hh, d + 0.4);
    return { w, d, h: hh, pivot: [w / 2, hh / 2, d / 2], size, D: 6 * size };
  }

  /* ---------- counting: what the fixed view shows and hides ---------- */

  function analyseCount(H, view, bh) {
    const S = sp();
    const cells = stackCells(H);
    const g = stackGeom(H, bh);
    const cam = { R: S.ypMat(view[0], view[1]), pivot: g.pivot, D: g.D };
    const faces = S.cubeFaces(cells);
    const zb = S.zbuffer(faces, cam, PPU);
    const vis = new Array(cells.length).fill(0);
    faces.forEach((F, fi) => { vis[F.cell] += zb.visible[fi]; });
    const unitA = Math.max(1, Math.max.apply(null, zb.area.concat([1])));
    const seen = vis.map((v) => v >= 0.2 * unitA);
    const hidden = vis.map((v) => v <= 2);
    const ambiguous = vis.some((v, i) => !seen[i] && !hidden[i]);
    const colMin = H.map((r) => r.map(() => 0));
    cells.forEach((c, i) => { if (seen[i]) colMin[c[2]][c[0]] = Math.max(colMin[c[2]][c[0]], c[1] + 1); });
    // would one more cube on top of each column (or on an empty square) be seen?
    const flat = [], owner = [];
    H.forEach((row, z) => row.forEach((v, x) => {
      S.cubeFaces([[x, v, z]], { all: true }).forEach((F) => { flat.push(F); owner.push(z * row.length + x); });
    }));
    const res = S.zbufferTest(zb, flat, cam);
    const pv = {};
    res.forEach((r, i) => { pv[owner[i]] = (pv[owner[i]] || 0) + r.vis; });
    const capped = Object.keys(pv).every((k) => pv[k] >= 0.25 * unitA);
    const tot = total(H), min = total(colMin);
    return { total: tot, seen, hidden, hiddenCount: hidden.filter(Boolean).length, ambiguous, min, colMin, capped, exact: !ambiguous && min === tot && capped, cells, g, cam };
  }

  /* ---------- views ---------- */

  // front view: the tallest column in each x (left to right); side view from the right: tallest in each z, front first
  const frontView = (H) => H[0].map((_, x) => Math.max.apply(null, H.map((r) => r[x])));
  const sideZ = (H) => H.map((r) => Math.max.apply(null, r));
  const sideView = (H) => sideZ(H).slice().reverse();
  const topView = (H) => H.map((r) => r.map((v) => (v > 0 ? 1 : 0)));
  const viewsKey = (H) => JSON.stringify([frontView(H), sideView(H), topView(H)]);
  function viewOf(H, side) { return side === 'front' ? frontView(H) : side === 'right' ? sideView(H) : topView(H); }

  // the fewest and the most cubes with the same three views as H (each is a stack)
  function extremes(H) {
    const fx = frontView(H), sz = sideZ(H);
    const mask = H.map((r) => r.map((v) => v > 0));
    const maxH = H.map((r, z) => r.map((v, x) => (mask[z][x] ? Math.min(fx[x], sz[z]) : 0)));
    const minH = H.map((r, z) => r.map((v, x) => (mask[z][x] ? 1 : 0)));
    const levels = Array.from(new Set(fx.concat(sz).filter((v) => v > 1)));
    for (const h of levels) {
      const R = [], Cc = [];
      fx.forEach((v, x) => { if (v === h) R.push(x); });
      sz.forEach((v, z) => { if (v === h) Cc.push(z); });
      // a cell whose row and column both reach exactly h covers both: match as many as possible
      const mZ = {}, mX = {};
      const aug = (x, seen) => {
        for (const z of Cc) {
          if (!mask[z][x] || seen.has(z)) continue;
          seen.add(z);
          if (mZ[z] == null || aug(mZ[z], seen)) { mZ[z] = x; mX[x] = z; return true; }
        }
        return false;
      };
      R.forEach((x) => aug(x, new Set()));
      Object.keys(mX).forEach((x) => { minH[mX[x]][+x] = h; });
      R.forEach((x) => {
        if (mX[x] != null) return;
        for (let z = 0; z < H.length; z++) if (mask[z][x] && sz[z] >= h && minH[z][x] === 1) { minH[z][x] = h; return; }
      });
      Cc.forEach((z) => {
        if (mZ[z] != null) return;
        for (let x = 0; x < fx.length; x++) if (mask[z][x] && fx[x] >= h && minH[z][x] === 1) { minH[z][x] = h; return; }
      });
    }
    return { min: total(minH), max: total(maxH), minH, maxH };
  }

  /* ---------- painted cubes ---------- */

  function paintCells(d) {
    if (d.dims) {
      const [a, b, c] = d.dims, out = [];
      for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) for (let x = 0; x < a; x++) out.push([x, y, z]);
      return out;
    }
    return stackCells(d.H);
  }
  // which outward faces get paint: rule 'all' (dipped), 'nobottom' (stands on the table), 'two' (top and bottom), 'three' (top, front, right)
  function paintedDirs(rule) {
    return rule === 'nobottom' ? [0, 1, 2, 4, 5] : rule === 'two' ? [2, 3] : rule === 'three' ? [0, 2, 4] : [0, 1, 2, 3, 4, 5];
  }
  // every little cube with its number of painted faces
  function paintCellCounts(d) {
    const S = sp();
    const cells = paintCells(d);
    const dirs = paintedDirs(d.rule);
    return { cells, counts: S.paintCounts(cells, { skip: (c, i) => !dirs.includes(i) }) };
  }
  function paintTally(d) {
    const tally = {};
    let n = 0, maxK = 0;
    if (d.dims) {
      // a block: a face of a little cube is painted when it lies on a painted side of the block
      const [a, b, c] = d.dims, P = paintedDirs(d.rule);
      const on = [0, 1, 2, 3, 4, 5].map((i) => P.includes(i));
      for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) for (let x = 0; x < a; x++) {
        const k = (on[0] && x === a - 1) + (on[1] && x === 0) + (on[2] && y === b - 1) + (on[3] && y === 0) + (on[4] && z === c - 1) + (on[5] && z === 0);
        tally[k] = (tally[k] || 0) + 1;
        if (k > maxK) maxK = k;
        n++;
      }
      return { tally, n, maxK };
    }
    paintCellCounts(d).counts.forEach((k) => { tally[k] = (tally[k] || 0) + 1; n++; if (k > maxK) maxK = k; });
    return { tally, n, maxK };
  }
  // the rows of the answer table: 0 … the most faces a small cube can have painted
  function tableKs(d) {
    const t = paintTally(d);
    const top = d.dims ? Math.max(t.maxK, Math.min(3, dirsMax(d))) : t.maxK;
    const ks = [];
    for (let k = top; k >= 0; k--) ks.push(k);
    return ks;
  }
  function dirsMax(d) { return d.rule === 'two' ? 2 : 3; }

  /* ---------- shapes for turning in the mind ---------- */

  function centroid(cells) { const s = [0, 0, 0]; cells.forEach((c) => { s[0] += c[0] + 0.5; s[1] += c[1] + 0.5; s[2] += c[2] + 0.5; }); return s.map((v) => v / cells.length); }
  function radius(cells) {
    const c = centroid(cells);
    let r = 0;
    cells.forEach((q) => { for (let i = 0; i < 8; i++) r = Math.max(r, Math.hypot(q[0] + (i & 1) - c[0], q[1] + ((i >> 1) & 1) - c[1], q[2] + ((i >> 2) & 1) - c[2])); });
    return r;
  }
  // a Shepard–Metzler arm: straight runs of cubes, each run at right angles to the last
  function armShape(rng, n, runs) {
    const S = sp();
    for (let tries = 0; tries < 200; tries++) {
      const cells = [[0, 0, 0]];
      const has = new Set(['0,0,0']);
      let dir = rng.pick(S.DIR6), prev = null, ok = true;
      const lens = [];
      let left = n - 1;
      for (let r = 0; r < runs; r++) {
        const rest = runs - r - 1;
        const len = r === runs - 1 ? left : Math.max(1, Math.min(left - rest, rng.range(2, 4)));
        lens.push(len);
        left -= len;
      }
      if (left !== 0 || lens.some((l) => l < 1)) continue;
      for (let r = 0; r < runs && ok; r++) {
        if (r > 0) {
          const opts2 = S.DIR6.filter((d) => S.v.dot(d, prev) === 0);
          dir = rng.pick(opts2);
        }
        for (let k = 0; k < lens[r]; k++) {
          const last = cells[cells.length - 1];
          const nc = [last[0] + dir[0], last[1] + dir[1], last[2] + dir[2]];
          const key = nc.join(',');
          if (has.has(key)) { ok = false; break; }
          has.add(key);
          cells.push(nc);
        }
        prev = dir;
      }
      if (!ok || cells.length !== n) continue;
      if (!S.isChiral(cells)) continue;
      // at least two runs must leave the plane of the others (a truly 3D arm)
      const xs = new Set(cells.map((c) => c[0])), ys = new Set(cells.map((c) => c[1])), zs = new Set(cells.map((c) => c[2]));
      if (xs.size < 2 || ys.size < 2 || zs.size < 2) continue;
      return S.normCells(cells);
    }
    return null;
  }
  // a random lump of n cubes that is not the same as its mirror image
  function blobShape(rng, n) {
    const S = sp();
    for (let tries = 0; tries < 300; tries++) {
      const cells = [[0, 0, 0]];
      const has = new Set(['0,0,0']);
      while (cells.length < n) {
        const c = rng.pick(cells), d = rng.pick(S.DIR6);
        const nc = [c[0] + d[0], c[1] + d[1], c[2] + d[2]];
        if (has.has(nc.join(','))) continue;
        has.add(nc.join(','));
        cells.push(nc);
      }
      if (!S.isChiral(cells)) continue;
      const xs = new Set(cells.map((c) => c[0])), ys = new Set(cells.map((c) => c[1])), zs = new Set(cells.map((c) => c[2]));
      if (xs.size < 2 || ys.size < 2 || zs.size < 2) continue;
      return S.normCells(cells);
    }
    return null;
  }
  // move one end cube of a shape somewhere else (a near miss: same count, different shape, not the mirror)
  function nearMiss(rng, cells) {
    const S = sp();
    const canon = S.canonShape(cells), canonM = S.canonShape(S.mirrorCells(cells));
    for (let tries = 0; tries < 200; tries++) {
      const i = rng.int(cells.length);
      const rest = cells.filter((_, k) => k !== i);
      if (!S.connected(rest)) continue;
      const c = rng.pick(rest), d = rng.pick(S.DIR6);
      const nc = [c[0] + d[0], c[1] + d[1], c[2] + d[2]];
      if (rest.some((q) => q[0] === nc[0] && q[1] === nc[1] && q[2] === nc[2]) || (nc[0] === cells[i][0] && nc[1] === cells[i][1] && nc[2] === cells[i][2])) continue;
      const out = rest.concat([nc]);
      const k = S.canonShape(out);
      if (k === canon || k === canonM) continue;
      return S.normCells(out);
    }
    return null;
  }
  function relation(a, b) {
    const S = sp();
    if (a.length !== b.length) return 'different';
    const kb = S.canonShape(b);
    if (S.canonShape(a) === kb) return 'same';
    if (S.canonShape(S.mirrorCells(a)) === kb) return 'mirror';
    return 'different';
  }
  // a random turn of the given size (degrees), about a random axis (or the vertical one)
  function turnQ(rng, deg, vertical) {
    const S = sp();
    let ax = vertical ? [0, 1, 0] : S.v.norm([rng() * 2 - 1, rng() * 2 - 1, rng() * 2 - 1]);
    if (!vertical && S.v.len(ax) < 1e-3) ax = [0, 1, 0];
    return S.Q.axis(deg * (rng() < 0.5 ? -1 : 1), ax);
  }
  const angleBetween = (qa, qb) => {
    const d = Math.abs(qa[0] * qb[0] + qa[1] * qb[1] + qa[2] * qb[2] + qa[3] * qb[3]);
    return 2 * Math.acos(Math.min(1, d)) * 180 / Math.PI;
  };
  const r4 = (q) => q.map((v) => Math.round(v * 10000) / 10000);

  /* ---------- checking ---------- */

  function okH(H) {
    return Array.isArray(H) && H.length > 0 && H.every((r) => Array.isArray(r) && r.length === H[0].length && r.every((v) => Number.isInteger(v) && v >= 0 && v <= 12)) && total(H) > 0;
  }
  const sameGrid = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  function verify(p) {
    const S = sp(), d = p.data;
    if (!S) return { ok: false, err: 'js/lib/space3d.js is not loaded' };
    if (!d || !d.kind) return { ok: false, err: 'no kind' };
    switch (d.kind) {
      case 'count': {
        if (!okH(d.H) || !Array.isArray(d.view)) return { ok: false, err: 'bad stack' };
        const dm = dims(d.H);
        if (d.ask === 'missing' && (!d.block || d.block[0] !== dm.w || d.block[1] !== dm.d || d.block[2] < dm.h)) return { ok: false, err: 'the block does not fit the stack' };
        const a = analyseCount(d.H, d.view, d.block ? d.block[2] : 0);
        if (a.ambiguous) return { ok: false, err: 'a cube is only partly in sight' };
        let want;
        if (d.ask === 'least') {
          if (a.min >= a.total) return { ok: false, err: 'no cube is hidden, so "least" is just the total' };
          want = a.min;
        } else {
          if (!a.exact) return { ok: false, err: 'the view does not settle how many cubes there are' };
          want = d.ask === 'total' ? a.total : d.ask === 'hidden' ? a.hiddenCount : d.block[0] * d.block[1] * d.block[2] - a.total;
          if (d.ask === 'hidden' && want < 1) return { ok: false, err: 'no cube is hidden' };
        }
        if (want !== d.answer) return { ok: false, err: 'the answer is ' + want + ', not ' + d.answer };
        return { ok: true };
      }
      case 'paint': {
        if (d.dims && (d.dims.length !== 3 || d.dims.some((v) => !(v >= 1 && v <= 12)))) return { ok: false, err: 'bad dims' };
        if (!d.dims && !okH(d.H)) return { ok: false, err: 'bad shape' };
        const t = paintTally(d);
        if (d.ask === 'table') {
          for (const k of tableKs(d)) if ((t.tally[k] || 0) !== (d.answer[k] || 0)) return { ok: false, err: k + ' painted faces: ' + (t.tally[k] || 0) + ', not ' + (d.answer[k] || 0) };
          return { ok: true };
        }
        if (d.ask === 'reverse') {
          if (!d.dims || d.dims[0] !== d.dims[1] || d.dims[1] !== d.dims[2]) return { ok: false, err: 'reverse needs a cube' };
          if ((t.tally[d.given.k] || 0) !== d.given.count) return { ok: false, err: 'the given count is wrong' };
          if (d.answer !== t.n) return { ok: false, err: 'the answer should be ' + t.n };
          // no other size gives the same count
          for (let n = 1; n <= 30; n++) {
            if (n === d.dims[0]) continue;
            const t2 = paintTally({ dims: [n, n, n], rule: d.rule });
            if ((t2.tally[d.given.k] || 0) === d.given.count) return { ok: false, err: 'a cube of ' + n + ' gives the same count' };
          }
          return { ok: true };
        }
        if (d.ask && d.ask.k != null) {
          if ((t.tally[d.ask.k] || 0) !== d.answer) return { ok: false, err: 'the answer should be ' + (t.tally[d.ask.k] || 0) };
          return { ok: true };
        }
        return { ok: false, err: 'unknown ask' };
      }
      case 'views': {
        if (!okH(d.H)) return { ok: false, err: 'bad stack' };
        if (d.goal === 'min' || d.goal === 'max') {
          const e = extremes(d.H);
          if (viewsKey(e.minH) !== viewsKey(d.H) || viewsKey(e.maxH) !== viewsKey(d.H)) return { ok: false, err: 'the extremes do not keep the views' };
          const want = d.goal === 'min' ? e.min : e.max;
          if (d.answer !== want) return { ok: false, err: d.goal + ' should be ' + want };
          if (total(d.H) !== want) return { ok: false, err: 'the stored stack is not a ' + d.goal + ' one' };
          if (e.min === e.max) return { ok: false, err: 'min and max agree' };
        }
        return { ok: true };
      }
      case 'viewpick': {
        if (!Array.isArray(d.stacks) || d.stacks.length < 2 || !d.stacks.every(okH)) return { ok: false, err: 'bad stacks' };
        const key = viewsKey(d.stacks[d.answer]);
        const hits = d.stacks.filter((H) => viewsKey(H) === key).length;
        if (hits !== 1) return { ok: false, err: hits + ' stacks have those views' };
        return { ok: true };
      }
      case 'whichview': {
        if (!okH(d.H)) return { ok: false, err: 'bad stack' };
        const v = viewOf(d.H, d.side);
        if (!sameGrid(d.options[d.answer], v)) return { ok: false, err: 'the right option is not the view' };
        const keys = d.options.map((o) => JSON.stringify(o));
        if (new Set(keys).size !== keys.length) return { ok: false, err: 'two options are the same' };
        return { ok: true };
      }
      case 'rot': {
        if (!S.connected(d.a) || !S.connected(d.b)) return { ok: false, err: 'a shape falls apart' };
        const r = relation(d.a, d.b);
        if (r !== d.answer) return { ok: false, err: 'the shapes are ' + r + ', not ' + d.answer };
        if (!S.isChiral(d.a)) return { ok: false, err: 'the shape is its own mirror image' };
        if (!(d.choices || ['same', 'mirror']).includes(d.answer)) return { ok: false, err: 'the answer is not offered' };
        return { ok: true };
      }
      case 'rotpick': {
        const rs = d.options.map((o) => relation(d.a, o.c));
        if (rs[d.answer] !== 'same') return { ok: false, err: 'the answer is not the same shape' };
        if (rs.filter((r) => r === 'same').length !== 1) return { ok: false, err: 'more than one option is the same shape' };
        if (!S.isChiral(d.a)) return { ok: false, err: 'the shape is its own mirror image' };
        return { ok: true };
      }
      default: return { ok: false, err: 'unknown kind ' + d.kind };
    }
  }

  /* ---------- making puzzles ---------- */

  function randomHeights(rng, w, d, hmax, style) {
    const H = [];
    for (let z = 0; z < d; z++) {
      const row = [];
      for (let x = 0; x < w; x++) {
        let v;
        const back = (d - 1 - z) / Math.max(1, d - 1), left = (w - 1 - x) / Math.max(1, w - 1);
        if (style === 'stairs') v = Math.round(1 + (hmax - 1) * (0.55 * back + 0.45 * left) + (rng() - 0.5) * 1.6);
        else if (style === 'corner') v = Math.round(1 + (hmax - 1) * Math.max(back, left) * (0.6 + rng() * 0.4));
        else if (style === 'wall') v = Math.round(hmax * (0.4 + 0.6 * (1 - back) * rng()) + (rng() < 0.25 ? -2 : 0));
        else v = rng.range(0, hmax);
        if (style !== 'wall' && rng() < 0.12) v = 0;
        row.push(Math.max(0, Math.min(hmax, v)));
      }
      H.push(row);
    }
    return H;
  }
  const COUNT_CFG = {
    1: { w: [2, 3], d: [2, 3], h: [2, 2], asks: ['total'], tot: [3, 8] },
    2: { w: [3, 3], d: [2, 3], h: [2, 3], asks: ['total'], tot: [8, 15] },
    3: { w: [3, 4], d: [3, 4], h: [3, 4], asks: ['total', 'total', 'hidden'], tot: [14, 30] },
    4: { w: [3, 4], d: [3, 4], h: [3, 4], asks: ['missing', 'least', 'hidden'], tot: [12, 40] },
    5: { w: [4, 5], d: [4, 5], h: [4, 5], asks: ['least', 'missing', 'total', 'hidden'], tot: [24, 80] }
  };
  function makeCount(rng, level, opts) {
    opts = opts || {};
    const cf = COUNT_CFG[level];
    const ask = opts.ask || rng.pick(cf.asks);
    for (let tries = 0; tries < 40; tries++) {
      const w = rng.range(cf.w[0], cf.w[1]), d = rng.range(cf.d[0], cf.d[1]), hmax = rng.range(cf.h[0], cf.h[1]);
      let H, block = null;
      if (ask === 'missing') {
        H = [];
        for (let z = 0; z < d; z++) H.push(new Array(w).fill(hmax));
        const bites = rng.range(2, 2 + level);
        for (let b = 0; b < bites; b++) {
          const x = w - 1 - Math.floor(Math.pow(rng(), 1.6) * w), z = d - 1 - Math.floor(Math.pow(rng(), 1.6) * d);
          H[z][x] = Math.max(0, H[z][x] - rng.range(1, 2));
        }
        block = [w, d, hmax];
        if (total(H) === w * d * hmax) continue;
      } else H = randomHeights(rng, w, d, hmax, ask === 'least' ? rng.pick(['random', 'wall']) : rng.pick(['stairs', 'stairs', 'corner', 'random']));
      if (!H.some((r) => r.some((v) => v > 0))) continue;
      const view = [-(28 + rng.int(34)), 24 + rng.int(15)];
      const tot = total(H);
      if (ask !== 'missing' && (tot < cf.tot[0] || tot > cf.tot[1])) continue;
      const a = analyseCount(H, view, block ? block[2] : 0);
      if (a.ambiguous) continue;
      let answer;
      if (ask === 'least') { if (a.min >= a.total) continue; answer = a.min; }
      else {
        if (!a.exact) continue;
        answer = ask === 'total' ? a.total : ask === 'hidden' ? a.hiddenCount : w * d * hmax - a.total;
        if (ask === 'hidden' && answer < 1) continue;
      }
      return { diff: level, data: { kind: 'count', H, view, ask, block: block || undefined, answer }, text: countText(ask, block), goal: countGoal(ask) };
    }
    return null;
  }
  function countText(ask, block) {
    const rule = 'The cubes stand on a board, and none of them floats: each one rests on the board or on another cube.';
    if (ask === 'total') return rule + ' Nothing is hidden that does not have to be — every cube you cannot see is holding up one you can. How many cubes are there?';
    if (ask === 'hidden') return rule + ' Every cube you cannot see is holding up one you can. How many of the cubes can you **not** see at all?';
    if (ask === 'missing') return 'This was a solid block of ' + block[0] + ' × ' + block[1] + ' × ' + block[2] + ' cubes. Some cubes have been lifted away from the corner you are looking at (and nothing else is missing). How many cubes are missing?';
    return rule + ' Some cubes may be hidden behind others. What is the **smallest** number of cubes there could be?';
  }
  function countGoal(ask) {
    return (ask === 'least' ? 'Type the fewest cubes the stack could have.' : ask === 'hidden' ? 'Type how many cubes are completely hidden.' : ask === 'missing' ? 'Type how many cubes are missing from the block.' : 'Type how many cubes there are.') + ' You can turn the stack once you have answered.';
  }

  // painted cubes
  function paintText(d) {
    const how = d.rule === 'nobottom' ? 'stood on the table and painted all over — except, of course, the bottom, which was on the table' : d.rule === 'two' ? 'painted on its top and bottom only' : d.rule === 'three' ? 'painted on three faces that meet at one corner (the top, the front and the right)' : 'dipped in paint, so every outside face is painted';
    let what;
    if (d.dims) {
      const [a, b, c] = d.dims;
      what = a === b && b === c ? 'A wooden cube was ' + how + '. Then it was sawn into ' + a + ' × ' + a + ' × ' + a + ' = ' + (a * a * a) + ' little cubes.' : 'A wooden block ' + a + ' × ' + b + ' × ' + c + ' was ' + how + ', then sawn into ' + (a * b * c) + ' little cubes.';
    } else what = 'This stack of ' + total(d.H) + ' glued cubes was ' + how + '. Then the glue gave way.';
    if (d.ask === 'table') return what + ' How many little cubes have paint on three faces, on two, on one, and on none?';
    if (d.ask === 'reverse') return 'A wooden cube was ' + how + ' and then sawn into equal little cubes. Exactly **' + d.given.count + '** of the little cubes have ' + (d.given.k === 0 ? 'no paint at all' : 'paint on exactly ' + C.plural(d.given.k, 'face')) + '. How many little cubes are there altogether?';
    return what + ' How many of the little cubes have paint on exactly **' + C.plural(d.ask.k, 'face') + '**?';
  }
  function makePaint(rng, level) {
    let d;
    const r = rng();
    if (level === 1) { const n = rng.range(2, 3); d = { dims: [n, n, n], rule: 'all', ask: 'table' }; }
    else if (level === 2) {
      if (r < 0.6) { const n = rng.range(4, 5); d = { dims: [n, n, n], rule: 'all', ask: 'table' }; }
      else d = { dims: [3, 3, 3], rule: rng.pick(['nobottom', 'two']), ask: 'table' };
    } else if (level === 3) {
      if (r < 0.45) { const a = rng.range(2, 4), b = rng.range(a, 5), c = rng.range(b, 6); if (a === c) return null; d = { dims: [a, b, c], rule: 'all', ask: 'table' }; }
      else { const n = rng.range(6, 10); d = { dims: [n, n, n], rule: 'all', ask: { k: rng.pick([0, 1, 2]) } }; }
    } else if (level === 4) {
      if (r < 0.35) { const n = rng.range(4, 6); d = { dims: [n, n, n], rule: rng.pick(['nobottom', 'three', 'two']), ask: 'table' }; }
      else if (r < 0.6) { const b = rng.range(2, 4), c = rng.range(3, 6); d = { dims: [1, b, c], rule: 'all', ask: 'table' }; }
      else if (r < 0.8) { const n = rng.range(3, 7); const k = rng.pick([0, 1, 2]); d = { dims: [n, n, n], rule: 'all', ask: 'reverse', given: { k } }; }
      else { const H = randomHeights(rng, rng.range(2, 3), rng.range(2, 3), 3, 'stairs'); d = { H, rule: 'all', ask: { k: rng.pick([1, 2, 3]) } }; }
    } else {
      if (r < 0.4) { const H = randomHeights(rng, rng.range(3, 4), rng.range(2, 3), rng.range(3, 4), rng.pick(['stairs', 'corner'])); d = { H, rule: rng.pick(['all', 'nobottom']), ask: rng() < 0.5 ? 'table' : { k: rng.pick([1, 2, 3]) } }; }
      else if (r < 0.7) { const n = rng.range(4, 9); d = { dims: [n, n, n], rule: rng.pick(['nobottom', 'three']), ask: 'reverse', given: { k: rng.pick([0, 1]) } }; }
      else { const a = rng.range(3, 5), b = rng.range(3, 6), c = rng.range(4, 7); d = { dims: [a, b, c], rule: rng.pick(['nobottom', 'three']), ask: 'table' }; }
    }
    d.kind = 'paint';
    const t = paintTally(d);
    if (d.H && t.n < 5) return null;
    if (d.ask === 'reverse') {
      d.given.count = t.tally[d.given.k] || 0;
      if (!d.given.count) return null;
      d.answer = t.n;
      for (let n = 1; n <= 30; n++) if (n !== d.dims[0] && (paintTally({ dims: [n, n, n], rule: d.rule }).tally[d.given.k] || 0) === d.given.count) return null;
    } else if (d.ask === 'table') {
      d.answer = {};
      tableKs(d).forEach((k) => { d.answer[k] = t.tally[k] || 0; });
    } else {
      d.answer = t.tally[d.ask.k] || 0;
    }
    return { diff: level, data: d, text: paintText(d), goal: d.ask === 'table' ? 'Fill in how many little cubes have paint on each number of faces.' : 'Type the number of little cubes.' };
  }

  // views
  function randStack(rng, w, d, hmax, holes) {
    for (let t = 0; t < 50; t++) {
      const H = [];
      for (let z = 0; z < d; z++) { const row = []; for (let x = 0; x < w; x++) row.push(rng() < holes ? 0 : rng.range(1, hmax)); H.push(row); }
      // every row and column of the board has something in it, and the stack is not a plain block
      if (frontView(H).some((v) => v === 0) || sideZ(H).some((v) => v === 0)) continue;
      if (H.every((r) => r.every((v) => v === hmax))) continue;
      return H;
    }
    return null;
  }
  const VIEW_CFG = {
    1: { w: [2, 3], d: [2, 2], h: 2, holes: 0.25, goals: ['any'] },
    2: { w: [3, 3], d: [2, 3], h: 3, holes: 0.25, goals: ['any'] },
    3: { w: [3, 4], d: [3, 3], h: 3, holes: 0.3, goals: ['any', 'any', 'max'] },
    4: { w: [3, 4], d: [3, 4], h: 4, holes: 0.25, goals: ['min', 'max'] },
    5: { w: [4, 4], d: [4, 4], h: 4, holes: 0.2, goals: ['min', 'min', 'max'] }
  };
  function makeViews(rng, level, opts) {
    opts = opts || {};
    const cf = VIEW_CFG[level];
    const goal = opts.goal || rng.pick(cf.goals);
    for (let tries = 0; tries < 40; tries++) {
      const H = randStack(rng, rng.range(cf.w[0], cf.w[1]), rng.range(cf.d[0], cf.d[1]), cf.h, cf.holes);
      if (!H) continue;
      const e = extremes(H);
      if (goal !== 'any' && e.max - e.min < (level >= 5 ? 4 : 2)) continue;
      if (goal === 'any' && e.max === e.min && level >= 2) continue;
      const data = { kind: 'views', H: goal === 'min' ? e.minH : goal === 'max' ? e.maxH : H, goal };
      if (goal !== 'any') data.answer = goal === 'min' ? e.min : e.max;
      return {
        diff: level, data,
        text: 'The drawings show a stack of cubes from the **front**, from the **top** and from the **right-hand side**. ' + (goal === 'any' ? 'Build a stack on the board that looks exactly like that from all three sides.' : 'Build a stack that matches all three views using as ' + (goal === 'min' ? '**few**' : '**many**') + ' cubes as possible.') + ' As always, no cube may float.',
        goal: goal === 'any' ? 'Build a stack whose three views match the drawings.' : 'Match the three views with the ' + (goal === 'min' ? 'fewest' : 'most') + ' cubes possible.'
      };
    }
    return null;
  }
  function tweak(rng, H, hmax) {
    const G = H.map((r) => r.slice());
    const d = G.length, w = G[0].length;
    const t = rng.int(3);
    if (t === 0) { const z = rng.int(d), x = rng.int(w); G[z][x] = Math.max(0, Math.min(hmax, G[z][x] + (rng() < 0.5 ? 1 : -1))); }
    else if (t === 1) { const z = rng.int(d), x = rng.int(w), z2 = rng.int(d), x2 = rng.int(w); if (G[z][x] > 0) { G[z][x]--; G[z2][x2] = Math.min(hmax, G[z2][x2] + 1); } }
    else { const x = rng.int(w), x2 = rng.int(w); G.forEach((r) => { const v = r[x]; r[x] = r[x2]; r[x2] = v; }); }
    return G;
  }
  function makeViewPick(rng, level) {
    const cf = VIEW_CFG[Math.min(5, level + 1)];
    const n = level <= 2 ? 3 : 4;
    for (let tries = 0; tries < 40; tries++) {
      const H = randStack(rng, rng.range(cf.w[0], cf.w[1]), rng.range(cf.d[0], cf.d[1]), cf.h, cf.holes);
      if (!H) continue;
      const key = viewsKey(H);
      const stacks = [H];
      for (let k = 0; k < 60 && stacks.length < n; k++) {
        let G = tweak(rng, H, cf.h);
        if (level >= 4 && rng() < 0.5) G = tweak(rng, G, cf.h);
        if (total(G) === 0 || viewsKey(G) === key) continue;
        if (stacks.some((s) => JSON.stringify(s) === JSON.stringify(G))) continue;
        stacks.push(G);
      }
      if (stacks.length < n) continue;
      rng.shuffle(stacks);
      const answer = stacks.indexOf(H);
      return { diff: level, data: { kind: 'viewpick', stacks, answer }, text: 'The drawings show a stack from the front, the top and the right-hand side. Which of the stacks is it? Turn them to check.', goal: 'Click the stack that matches all three views, then press **Answer**.' };
    }
    return null;
  }
  const SIDE_WORD = { front: 'front', top: 'top', right: 'right-hand side' };
  function makeWhichView(rng, level) {
    const cf = VIEW_CFG[Math.min(5, level + 1)];
    for (let tries = 0; tries < 40; tries++) {
      const H = randStack(rng, rng.range(cf.w[0], cf.w[1]), rng.range(Math.max(2, cf.d[0]), cf.d[1]), cf.h, cf.holes);
      if (!H) continue;
      const side = rng.pick(['front', 'top', 'right']);
      const right = viewOf(H, side);
      const opts = [right];
      const add = (v) => { if (v && !opts.some((o) => sameGrid(o, v))) opts.push(v); };
      if (side === 'top') {
        add(right.map((r) => r.slice().reverse()));
        add(right.slice().reverse());
        for (let k = 0; k < 20 && opts.length < 4; k++) { const g = right.map((r) => r.slice()); const z = rng.int(g.length), x = rng.int(g[0].length); g[z][x] = 1 - g[z][x]; if (g.some((r) => r.some((v) => v))) add(g); }
      } else {
        add(right.slice().reverse());
        add(viewOf(H, side === 'front' ? 'right' : 'front').length === right.length ? viewOf(H, side === 'front' ? 'right' : 'front') : null);
        for (let k = 0; k < 20 && opts.length < 4; k++) { const g = right.slice(); const i = rng.int(g.length); g[i] = Math.max(1, Math.min(cf.h, g[i] + (rng() < 0.5 ? 1 : -1))); add(g); }
      }
      if (opts.length < 3) continue;
      const list = rng.shuffle(opts.slice(0, 4));
      const answer = list.findIndex((o) => sameGrid(o, right));
      return { diff: level, data: { kind: 'whichview', H, side, options: list, answer }, text: 'Look at the stack. Which drawing shows it as seen from the **' + SIDE_WORD[side] + '**' + (side === 'top' ? ' (with the front at the bottom of the drawing)' : '') + '?', goal: 'Pick the drawing of the view from the ' + SIDE_WORD[side] + '.' };
    }
    return null;
  }

  // turning in the mind
  const ROT_CFG = {
    1: { shape: 'blob', n: [4, 5], ang: [50, 100], vertical: true, diff: false },
    2: { shape: 'blob', n: [5, 6], ang: [60, 120], vertical: false, diff: false },
    3: { shape: 'arm', n: [7, 8], runs: 3, ang: [70, 140], vertical: false, diff: false },
    4: { shape: 'arm', n: [9, 10], runs: 4, ang: [90, 160], vertical: false, diff: true },
    5: { shape: 'arm', n: [10, 10], runs: 4, ang: [110, 180], vertical: false, diff: true }
  };
  function makeShape(rng, cf) {
    const n = rng.range(cf.n[0], cf.n[1]);
    return cf.shape === 'arm' ? armShape(rng, n, cf.runs) : blobShape(rng, n);
  }
  function makeRot(rng, level) {
    const cf = ROT_CFG[level];
    const S = sp();
    const a = makeShape(rng, cf);
    if (!a) return null;
    const choices = cf.diff && rng() < 0.6 ? ['same', 'mirror', 'different'] : ['same', 'mirror'];
    const answer = rng.pick(choices);
    let b = answer === 'same' ? a.slice() : answer === 'mirror' ? S.normCells(S.mirrorCells(a)) : nearMiss(rng, rng() < 0.5 ? a : S.mirrorCells(a));
    if (!b) return null;
    b = S.normCells(S.rotCells(b, rng.pick(S.ROTS)));
    const qa = S.Q.ypr(-40 + rng.range(-30, 30), 18 + rng.range(0, 20));
    let qb = null;
    for (let k = 0; k < 20; k++) {
      const turn = turnQ(rng, rng.range(cf.ang[0], cf.ang[1]), cf.vertical);
      qb = S.Q.norm(S.Q.mul(turn, qa));
      if (angleBetween(qa, qb) >= cf.ang[0] - 1) break;
    }
    // b is shown turned so that (for same / mirror) it is the view of a turned by qb
    const R = answer === 'different' ? null : S.findTurn(answer === 'same' ? a : S.mirrorCells(a), b);
    const qbShow = R ? S.Q.norm(S.Q.mul(qb, S.Q.fromMat(S.transpose(R.R)))) : qb;
    return {
      diff: level,
      data: { kind: 'rot', a, b, qa: r4(qa), qb: r4(qbShow), answer, choices },
      text: 'Two shapes made of cubes, seen from different angles. Is the second the **same** shape as the first, turned round — or its **mirror image**' + (choices.length > 2 ? ' — or a **different** shape altogether' : '') + '?',
      goal: 'Answer **Same**, **Mirror**' + (choices.length > 2 ? ' or **Different**' : '') + '.'
    };
  }
  function makeRotPick(rng, level) {
    const cf = ROT_CFG[level];
    const S = sp();
    const a = makeShape(rng, cf);
    if (!a) return null;
    const qa = S.Q.ypr(-40 + rng.range(-30, 30), 18 + rng.range(0, 20));
    const n = level <= 3 ? 3 : 4;
    const kinds = ['same', 'mirror'];
    while (kinds.length < n) kinds.push(rng() < 0.5 && cf.diff ? 'different' : 'mirror');
    const options = [];
    for (const kd of kinds) {
      let c = kd === 'same' ? a.slice() : kd === 'mirror' ? S.mirrorCells(a) : nearMiss(rng, rng() < 0.5 ? a : S.mirrorCells(a));
      if (!c) return null;
      c = S.normCells(S.rotCells(c, rng.pick(S.ROTS)));
      if (options.some((o) => S.canonShape(o.c) === S.canonShape(c)) && kd !== 'mirror') return null;
      const q = S.Q.norm(S.Q.mul(turnQ(rng, rng.range(cf.ang[0], cf.ang[1]), cf.vertical), qa));
      options.push({ c, q: r4(q), kind: kd });
    }
    rng.shuffle(options);
    // two mirror images of the same shape are the same as each other: keep only different ones
    const seen = new Set();
    const opts = options.filter((o) => { const k = S.canonShape(o.c); if (seen.has(k)) return false; seen.add(k); return true; });
    if (opts.length < 3) return null;
    const answer = opts.findIndex((o) => o.kind === 'same');
    return {
      diff: level,
      data: { kind: 'rotpick', a, qa: r4(qa), options: opts.map((o) => ({ c: o.c, q: o.q })), answer },
      text: 'Which of the shapes on the right is the shape on the left, only turned round? The others are mirror images' + (cf.diff ? ' or slightly different shapes' : '') + '.',
      goal: 'Click the one that is the same shape, then press **Answer**.'
    };
  }

  function generate(rng, level, fam) {
    for (let k = 0; k < 8; k++) { const p = generate1(rng, level, fam); if (p) return p; }
    return null;
  }
  function generate1(rng, level, fam) {
    const id = fam && fam.id;
    let p = null;
    if (id === 'painted-cubes') p = makePaint(rng, level);
    else if (id === 'views') { const r = rng(); p = level <= 2 ? (r < 0.4 ? makeWhichView(rng, level) : r < 0.6 ? makeViewPick(rng, level) : makeViews(rng, level)) : (r < 0.2 ? makeWhichView(rng, level) : r < 0.45 ? makeViewPick(rng, level) : makeViews(rng, level)); }
    else if (id === 'mental-rotation') p = level >= 3 && rng() < 0.35 ? makeRotPick(rng, level) : makeRot(rng, level);
    else p = makeCount(rng, level);
    if (!p) return null;
    p.title = p.title || GEN_TITLE[p.data.kind];
    p.diff = level;
    return p;
  }
  const GEN_TITLE = { count: 'How Many Cubes?', paint: 'The Painted Block', views: 'Three Views', viewpick: 'Which Stack?', whichview: 'Which View?', rot: 'Same or Mirror?', rotpick: 'The Same Shape' };


  /* ---------- drawing (browser) ---------- */

  const WOOD = '#e2b57a', PAINT = '#d9483f', RAW = '#ecd2a2', HIDE = '#52cfc1', GHOST = '#8f9eff', SHAPE = '#9fb5ff';
  const CAT = ['#8e9ab8', '#4fcfc6', '#f5a14a', '#ef6b63', '#c77dff', '#ffd166', '#f4f1e8'];
  const f3 = (v) => Math.round(v * 1000) / 1000;

  function floorFaces(w, d) {
    const m = 0.18, out = [{ p: [[-m, -0.02, d + m], [w + m, -0.02, d + m], [w + m, -0.02, -m], [-m, -0.02, -m]], c: 'var(--board)', stroke: 'var(--line)', flat: true, bias: -2e5 }];
    for (let z = 0; z < d; z++) for (let x = 0; x < w; x++) out.push({ p: [[x, 0, z + 1], [x + 1, 0, z + 1], [x + 1, 0, z], [x, 0, z]], c: (x + z) % 2 ? 'var(--board-2)' : 'var(--cell)', stroke: 'var(--grid-2)', flat: true, bias: -1e5, floor: [x, z] });
    return out;
  }
  // unit cubes as SVG from a camera (whole cubes far to near), optionally on a board
  function cubesSVG(cells, cam, opts) {
    const S = sp();
    opts = opts || {};
    const faces = S.cubeFaces(cells, { color: opts.color || WOOD, keyPrefix: opts.key || null });
    const cz = cells.map((c) => S.mv(cam.R, S.v.sub([c[0] + 0.5, c[1] + 0.5, c[2] + 0.5], cam.pivot))[2]);
    const order = cells.map((_, i) => i).sort((a, b) => cz[a] - cz[b]);
    const rank = [];
    order.forEach((ci, r) => { rank[ci] = r; });
    faces.forEach((F) => { F.bias = rank[F.cell] * 10; if (opts.faceColor) F.c = opts.faceColor(F) || F.c; if (opts.sw) F.sw = opts.sw; });
    const extra = opts.floor ? floorFaces(opts.floor[0], opts.floor[1]) : [];
    return S.svgFaces(extra.concat(faces), { R: cam.R, pivot: cam.pivot, persp: cam.D || 0, scale: opts.scale || 1, at: opts.at || [0, 0] });
  }
  // a stack standing on its board, as a Stage object; o.build(H, colour) rebuilds the cubes
  function stackObject(st, H, opts) {
    const S = sp();
    opts = opts || {};
    const g = stackGeom(H, opts.hmin);
    const o = st.add(Object.assign({ mode: 'table', yaw: -35, pitch: 30, pmin: -8, pmax: 89, size: g.size, pivot: g.pivot }, opts.obj || {}));
    o.g = g;
    S.floor(st, o, g.w, g.d, { pickable: !!opts.pickFloor });
    o.cubes = [];
    o.build = (H2, color, all) => {
      o.cubes.forEach((m) => st.v.remove(m));
      o.meshes = o.meshes.filter((m) => !o.cubes.includes(m));
      o.H = H2;
      o.cubes = S.cubeMeshes(st, o, stackCells(H2), { color: color || opts.color || WOOD, all });
    };
    o.build(H);
    return o;
  }
  // a shape of cubes that turns freely
  function shapeObject(st, cells, q, opts) {
    const S = sp();
    const c = centroid(cells);
    const o = st.add(Object.assign({ mode: 'free', q: q.slice(), size: radius(cells) + 0.1, pivot: c }, opts || {}));
    o.cells = cells;
    o.home = { q: q.slice() };
    o.build = (cells2, color) => {
      o.meshes.forEach((m) => st.v.remove(m));
      o.meshes = [];
      o.cells = cells2;
      S.cubeMeshes(st, o, cells2, { color: color || SHAPE, lw: 1.2 });
    };
    o.build(cells, opts && opts.color);
    return o;
  }

  // the three views in the layout of a workshop drawing: top above front, the right side beside the front
  function viewsDrawing(target, cur, opts) {
    opts = opts || {};
    const tf = frontView(target), ts = sideView(target), tt = topView(target);
    const cf = cur ? frontView(cur) : null, cs = cur ? sideView(cur) : null, ct = cur ? topView(cur) : null;
    const W = tf.length, D = tt.length;
    const Hh = Math.max(Math.max.apply(null, tf), cur ? Math.max.apply(null, cf.concat(cs)) : 0, 1);
    const gap = 0.9, lab = 0.55;
    const ox = 0, oyTop = lab, oyFront = lab + D + gap + lab, oxSide = W + gap;
    let s = '';
    const cell = (x, y, cls, extra) => '<rect class="' + cls + '" x="' + f3(x) + '" y="' + f3(y) + '" width="1" height="1"' + (extra || '') + '/>';
    const ok = { top: cur && JSON.stringify(ct) === JSON.stringify(tt), front: cur && JSON.stringify(cf) === JSON.stringify(tf), right: cur && JSON.stringify(cs) === JSON.stringify(ts) };
    const title = (x, y, t, good) => '<text class="cb-vt' + (good ? ' ok' : '') + '" x="' + f3(x) + '" y="' + f3(y) + '">' + t + (good ? ' ✓' : '') + '</text>';
    // top view (rows: back at the top, front at the bottom)
    s += title(ox, oyTop - 0.15, 'Top', ok.top);
    for (let z = 0; z < D; z++) for (let x = 0; x < W; x++) {
      s += cell(ox + x, oyTop + z, 'cb-vg');
      if (tt[z][x]) s += cell(ox + x, oyTop + z, 'cb-vt-on');
      if (ct && ct[z][x]) s += cell(ox + x + 0.12, oyTop + z + 0.12, 'cb-vc', ' width="0.76" height="0.76"');
      if (opts.numbers && cur) s += '<text class="cb-vn" x="' + f3(ox + x + 0.5) + '" y="' + f3(oyTop + z + 0.52) + '">' + (cur[z][x] || '') + '</text>';
    }
    s += '<text class="cb-vside" x="' + f3(ox + W / 2) + '" y="' + f3(oyTop + D + 0.42) + '">front</text>';
    // front view
    s += title(ox, oyFront - 0.15, 'Front', ok.front);
    for (let x = 0; x < W; x++) for (let y = 0; y < Hh; y++) {
      const Y = oyFront + Hh - 1 - y;
      s += cell(ox + x, Y, 'cb-vg');
      if (tf[x] > y) s += cell(ox + x, Y, 'cb-vt-on');
      if (cf && cf[x] > y) s += cell(ox + x + 0.12, Y + 0.12, 'cb-vc', ' width="0.76" height="0.76"');
    }
    // right side view (front on the left)
    s += title(oxSide, oyFront - 0.15, 'Right side', ok.right);
    for (let i = 0; i < D; i++) for (let y = 0; y < Hh; y++) {
      const Y = oyFront + Hh - 1 - y;
      s += cell(oxSide + i, Y, 'cb-vg');
      if (ts[i] > y) s += cell(oxSide + i, Y, 'cb-vt-on');
      if (cs && cs[i] > y) s += cell(oxSide + i + 0.12, Y + 0.12, 'cb-vc', ' width="0.76" height="0.76"');
    }
    const w = oxSide + D, h = oyFront + Hh;
    return { svg: s, w, h, W, D, Hh, oyTop, oyFront, oxSide, ok: ok.top && ok.front && ok.right };
  }
  // a single view as a small picture (for choices)
  function viewSVG(v, side) {
    let s = '';
    if (side === 'top') {
      v.forEach((row, z) => row.forEach((on, x) => { s += '<rect class="cb-vg" x="' + x + '" y="' + z + '" width="1" height="1"/>' + (on ? '<rect class="cb-vt-on" x="' + x + '" y="' + z + '" width="1" height="1"/>' : ''); }));
      return { svg: s, w: v[0].length, h: v.length };
    }
    const Hh = Math.max.apply(null, v);
    v.forEach((hgt, i) => { for (let y = 0; y < Hh; y++) s += '<rect class="' + (hgt > y ? 'cb-vt-on' : 'cb-vg') + '" x="' + i + '" y="' + (Hh - 1 - y) + '" width="1" height="1"/>'; });
    return { svg: s, w: v.length, h: Hh };
  }
  const svgWrap = (inner, x0, y0, w, h, cls) => '<svg class="' + (cls || '') + '" viewBox="' + f3(x0) + ' ' + f3(y0) + ' ' + f3(w) + ' ' + f3(h) + '" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>';

  // answering by choosing: wrong answers cost stars
  function judge(ctx, opts) {
    const J = { done: false, tries: 0 };
    J.submit = () => {
      if (J.done) return { solved: true };
      const r = opts.evaluate();
      if (!r) return { solved: false, msg: opts.empty || 'Choose your answer first.' };
      if (r.ok) {
        J.done = true;
        const cap = opts.cap ? opts.cap(J.tries) : Math.max(1, 3 - J.tries);
        if (opts.onRight) setTimeout(() => opts.onRight(r), 60);
        return { solved: true, msg: r.msg, stars: cap < 3 ? cap : undefined };
      }
      J.tries++;
      if (opts.onWrong) opts.onWrong(r);
      return { solved: false, msg: (r.msg || 'Not that.') + (J.tries === 1 ? ' (A wrong answer costs a star.)' : '') };
    };
    J.click = () => { const r = J.submit(); if (r.solved) ctx.solved(r); else { ctx.say(r.msg, 'warn'); ctx.sfx('wrong'); } };
    return J;
  }
  // a slider in the panel ("take it apart", …)
  function slider(ctx, label, left, right, fn) {
    const inp = ctx.h('input.cb-slider', { type: 'range', min: 0, max: 100, value: 0 });
    inp.addEventListener('input', () => fn(inp.value / 100));
    const el = ctx.h('div.cb-sl', ctx.h('span.cb-sll', label), ctx.h('span.cb-end', left), inp, ctx.h('span.cb-end', right));
    return { el, inp, set(t) { inp.value = Math.round(t * 100); } };
  }

  /* ---------- count the cubes ---------- */

  const ASK_LABEL = { total: 'How many cubes are there?', hidden: 'How many cubes can you not see at all?', missing: 'How many cubes are missing?', least: 'What is the smallest number of cubes there could be?' };
  function mountCount(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb;
    const bh = d.block ? d.block[2] : 0;
    const a = analyseCount(d.H, d.view, bh);
    const g = a.g, cells = stackCells(d.H);
    let done = false, apart = 0;

    // the page: the picture from the fixed place, each face keyed so it can be painted
    const cam = { R: S.ypMat(d.view[0], d.view[1]), pivot: g.pivot, D: g.D };
    const pic = cubesSVG(cells, cam, { floor: [g.w, g.d], key: 'c', sw: 0.028 });
    const gp = ctx.s('g', { class: 'cb-pic' }, wb.layer('board'));
    gp.innerHTML = pic.svg;
    const gNum = ctx.s('g', { class: 'cb-num' }, wb.layer('top'));
    const b = pic.box, pad = 0.6;
    wb.setBounds({ x0: b[0] - pad, y0: b[1] - pad, x1: b[2] + pad, y1: b[3] + pad }, 0.06);
    wb.applyPaints();

    // 3D: the same view, locked until the answer is in
    let numbers = null;
    const st = new S.Stage(ctx, {
      centred: true, D: g.D, lockText: 'You can turn it once you have answered',
      after: (c2, view) => {
        if (!numbers || !o || !o.M) return;
        c2.font = '700 15px "Segoe UI", system-ui, sans-serif';
        c2.textAlign = 'center'; c2.textBaseline = 'middle';
        numbers.forEach(([x, z, n]) => {
          if (!n) return;
          const q = view.project(C.M4.apply(o.M, [x + 0.5, 0.02, z + 0.5]));
          c2.fillStyle = 'rgba(20,24,48,.82)';
          c2.beginPath(); c2.arc(q[0], q[1], 11, 0, Math.PI * 2); c2.fill();
          c2.fillStyle = '#ffd166';
          c2.fillText(String(n), q[0], q[1] + 1);
        });
      }
    });
    const o = stackObject(st, d.H, { hmin: bh, obj: { yaw: d.view[0], pitch: d.view[1] } });
    st.lock(true);
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); st.layout(); st.frame(); } else wb.fit(); });

    // the answer
    const box = ctx.answer({
      kind: 'number', label: ASK_LABEL[d.ask], placeholder: 'A number',
      check: (v) => {
        const n = C.answerTools ? C.answerTools.readNumber(v) : parseFloat(v);
        if (isNaN(n)) return { ok: false, msg: 'Type a number.' };
        if (n === d.answer) { setTimeout(() => reveal(false), 80); return { ok: true, msg: 'Yes: **' + d.answer + '**. Now turn it round and take it apart.' }; }
        return { ok: false, msg: wrongMsg(n) };
      }
    });
    function wrongMsg(n) {
      const more = n < d.answer;
      if (d.ask === 'total') return more ? 'More than that — count the cubes underneath too: each one holds up a cube above it.' : 'Fewer than that. Does every column really go all the way down?';
      if (d.ask === 'hidden') return more ? 'More are hidden than that: look under the top layer and behind the front row.' : 'Fewer than that — is each of those really covered on every side you could see?';
      if (d.ask === 'missing') return more ? 'More are missing than that.' : 'Not so many are missing.';
      return more ? 'Not so few: every cube you can see needs a whole column of cubes under it.' : 'It could be fewer: a column you cannot see at all might be empty.';
    }

    // after the answer: turn it and lift the layers apart, the hidden cubes picked out
    const colMin = a.colMin;
    const kinds = cells.map((c, i) => (d.ask === 'least' && c[1] >= colMin[c[2]][c[0]] ? 'extra' : a.hidden[i] ? 'hid' : 'vis'));
    let ghosts = [];
    function recolour() {
      o.build(d.H, (c, ci) => (kinds[ci] === 'hid' ? HIDE : kinds[ci] === 'extra' ? GHOST : WOOD), true);
      o.cubes.forEach((m, i) => { if (kinds[i] === 'extra') m.alpha = 0.5; });
      ghosts.forEach((m) => st.v.remove(m));
      o.meshes = o.meshes.filter((m) => !ghosts.includes(m));
      ghosts = [];
      if (d.ask === 'missing') {
        const miss = [];
        d.H.forEach((row, z) => row.forEach((v, x) => { for (let y = v; y < bh; y++) miss.push([x, y, z]); }));
        ghosts = S.cubeMeshes(st, o, miss, { color: GHOST, all: true });
        ghosts.forEach((m) => { m.alpha = 0.22; m.pickable = false; });
        o.meshes = o.meshes.filter((m) => !ghosts.includes(m)).concat(ghosts);
      }
    }
    function setApart(t) {
      apart = t;
      o.cubes.concat(ghosts).forEach((m) => { m.lm = C.M4.translate(0, (m.cc[1] - 0.5) * 0.6 * t, 0); });
      o.pivot = [g.pivot[0], g.pivot[1] * (1 + 0.6 * t), g.pivot[2]];
      o.size = g.size * (1 + 0.3 * t);
      sl.set(t);
    }
    function reveal(instant) {
      if (done && !instant) return;
      done = true;
      numbers = null;
      st.lock(false);
      recolour();
      legend.hidden = false;
      sl.el.classList.remove('off');
      if (instant) { setApart(0.6); st.layout(); st.frame(); return; }
      if (!wb.is3D) wb.set3D(true);
      const y0 = o.yaw;
      st.animate(2200, (t) => { setApart(0.6 * t); o.yaw = y0 + 55 * t; st.layout(); st.frame(true); });
      ctx.changed('reveal');
    }
    const sl = slider(ctx, 'Take it apart', 'stacked', 'apart', (t) => { if (!done) return; setApart(t); st.layout(); st.frame(true); st.render(); if (!wb.is3D) wb.set3D(true); });
    sl.el.classList.add('off');
    const legend = ctx.h('div.cb-legend', { html:
      (d.ask === 'least' ? '<span><i style="background:' + GHOST + ';opacity:.55"></i>hidden cubes that need not be there</span>' : '') +
      (d.ask === 'missing' ? '<span><i style="background:' + GHOST + ';opacity:.35"></i>the missing cubes</span>' : '') +
      '<span><i style="background:' + HIDE + '"></i>cubes you could not see</span>' });
    legend.hidden = true;
    ctx.panel.appendChild(ctx.h('div.cb-panel', ctx.h('div.cb-note', { html: 'Tip: in the flat view you can paint each cube as you count it.' }), sl.el, legend));

    function rowsText() {
      return d.H.map((r) => r.reduce((s2, v) => s2 + v, 0)).map((n, i) => (i === 0 ? 'back row ' : '') + n).join(', ');
    }
    function showNumbers(list) {
      numbers = list;
      gNum.innerHTML = list.map(([x, z, n]) => {
        if (!n) return '';
        const pt = S.projector({ R: cam.R, pivot: cam.pivot, persp: cam.D, scale: 1 })([x + 0.5, 0.02, z + 0.5]);
        return '<g><circle cx="' + f3(pt[0]) + '" cy="' + f3(pt[1]) + '" r="0.3"/><text x="' + f3(pt[0]) + '" y="' + f3(pt[1] + 0.01) + '">' + n + '</text></g>';
      }).join('');
      st.render();
      clearTimeout(showNumbers.t);
      showNumbers.t = setTimeout(() => { numbers = null; gNum.innerHTML = ''; st.render(); }, 6000);
    }
    return {
      noMoves: true,
      hint(n) {
        if (d.ask === 'total') {
          if (n === 0) return 'Count column by column: each column holds as many cubes as it is tall — including the ones underneath that you cannot see.';
          if (n === 1) return 'Row by row, from the back: ' + rowsText() + '.';
          return null;
        }
        if (d.ask === 'hidden') {
          if (n === 0) return 'A cube is hidden only when every face you might see is covered. Look under the top layer, and behind the front.';
          if (n === 1) return 'There are ' + a.total + ' cubes in all. How many of them show at least a bit of a face?';
          if (n === 2) return 'You can see ' + (a.total - a.hiddenCount) + ' of them.';
          return null;
        }
        if (d.ask === 'missing') {
          if (n === 0) return 'The whole block had ' + d.block.join(' × ') + ' = ' + (d.block[0] * d.block[1] * d.block[2]) + ' cubes. Count what is left, or count the gaps column by column.';
          if (n === 1) return { text: 'The numbers on the board show how many cubes are left in each column (for a few seconds).', show() { const L = []; d.H.forEach((r, z) => r.forEach((v, x) => L.push([x, z, v]))); showNumbers(L); } };
          return null;
        }
        if (n === 0) return 'Every cube you can see stands on a column of cubes reaching down to the board. A column you cannot see at all could be empty.';
        if (n === 1) return { text: 'The numbers on the board show the least each column must hold (for a few seconds).', show() { const L = []; colMin.forEach((r, z) => r.forEach((v, x) => L.push([x, z, v]))); showNumbers(L); } };
        return null;
      },
      solve() { box.feedback('The answer: <b>' + d.answer + '</b>', 'good'); reveal(false); },
      explain() {
        if (d.ask === 'total') return 'There are **' + a.total + '** cubes — ' + (a.hiddenCount ? a.hiddenCount + ' of them completely hidden (shown in teal when the stack is taken apart), each holding up a cube you can see.' : 'every one of them in sight.') + ' Row by row from the back: ' + rowsText() + '.';
        if (d.ask === 'hidden') return 'Of the ' + a.total + ' cubes, ' + (a.total - a.hiddenCount) + ' show at least part of a face and **' + a.hiddenCount + '** are completely hidden — they are the teal ones when the stack comes apart.';
        if (d.ask === 'missing') return 'The block had ' + (d.block[0] * d.block[1] * d.block[2]) + ' cubes and ' + a.total + ' are left, so **' + d.answer + '** are missing (the faint blue ones).';
        return 'The cubes you can see need at least **' + a.min + '**, counting the columns under them. The stack actually had ' + a.total + ': the faint ones were hidden, and a picture from this side cannot tell whether they are there.';
      },
      getState() { return { done }; },
      setState(s) { if (s && s.done && !done) reveal(true); },
      destroy() { st.destroy(); clearTimeout(showNumbers.t); }
    };
  }

  /* ---------- painted cubes ---------- */

  const KWORD = (k) => (k === 0 ? 'no paint' : k === 1 ? '1 painted face' : k + ' painted faces');
  // a little cube with k faces painted (top, front, right, then the others), as an icon
  function kIcon(k) {
    const S = sp();
    const order = [2, 4, 0, 5, 1, 3];
    const faces = S.cubeFaces([[0, 0, 0]], { all: true }).map((F) => { F.c = order.indexOf(F.dir) < k ? PAINT : RAW; F.sw = 0.05; return F; });
    const r = S.svgFaces(faces, { R: S.ypMat(-35, 28), pivot: [0.5, 0.5, 0.5], scale: 1 });
    return svgWrap(r.svg, -0.95, -0.95, 1.9, 1.9, 'cb-kicon');
  }
  function mountPaint(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb;
    const pc = paintCellCounts(d);
    const cells = pc.cells, dirs = paintedDirs(d.rule);
    const has = new Set(cells.map((c) => c.join(',')));
    let A = 0, B = 0, Cc = 0;
    cells.forEach((c) => { A = Math.max(A, c[0] + 1); B = Math.max(B, c[1] + 1); Cc = Math.max(Cc, c[2] + 1); });
    const pivot = [A / 2, B / 2, Cc / 2], size = 0.5 * Math.hypot(A, B, Cc) + 0.15;
    const outside = (c, dir) => !has.has([c[0] + S.DIR6[dir][0], c[1] + S.DIR6[dir][1], c[2] + S.DIR6[dir][2]].join(','));
    const painted = (c, dir) => outside(c, dir) && dirs.includes(dir);
    const hideCuts = d.ask === 'reverse';
    const layers = cells.length > 216;
    let done = false, apart = 0, coded = false;

    // the page
    const gp = ctx.s('g', { class: 'cb-pic' }, wb.layer('board'));
    function draw2() {
      let r;
      if (hideCuts && !done) {
        const F = S.cubeFaces([[0, 0, 0]], { all: true }).map((q) => { q.c = dirs.includes(q.dir) ? PAINT : RAW; q.p = q.p.map((v) => [v[0] * A, v[1] * B, v[2] * Cc]); q.sw = 0.04; return q; });
        r = S.svgFaces(F, { R: S.ypMat(-35, 28), pivot, scale: 1 });
      } else r = cubesSVG(cells, { R: S.ypMat(-35, 28), pivot, D: 0 }, { key: 'c', sw: 0.025, faceColor: (F) => (coded ? CAT[pc.counts[F.cell]] : painted(cells[F.cell], F.dir) ? PAINT : RAW) });
      gp.innerHTML = r.svg;
      wb.setBounds({ x0: r.box[0] - 0.6, y0: r.box[1] - 0.6, x1: r.box[2] + 0.6, y1: r.box[3] + 0.6 }, 0.06);
      wb.applyPaints();
    }

    // 3D
    const st = new S.Stage(ctx, {});
    const o = st.add({ mode: 'table', yaw: -35, pitch: 28, size, pivot });
    function build() {
      o.meshes.forEach((m) => st.v.remove(m));
      o.meshes = [];
      const col = (c, ci, dir) => (coded ? CAT[pc.counts[ci]] : painted(c, dir) ? PAINT : RAW);
      if (hideCuts && !done) {
        const F = S.cubeFaces([[0, 0, 0]], { all: true });
        st.mesh(o, { verts: [].concat.apply([], F.map((q) => q.p.map((v) => [v[0] * A, v[1] * B, v[2] * Cc]))), faces: F.map((q, i) => [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3]), colors: F.map((q) => (dirs.includes(q.dir) ? PAINT : RAW)), lw: 1.4 });
        return;
      }
      if (layers && apart > 0) {
        // a cut-away: the corner block nearest the eye slides out and shows the inside
        const hx = Math.floor(A / 2), hy = Math.floor(B / 2), hz = Math.floor(Cc / 2);
        const inCorner = (c) => c[0] >= hx && c[1] >= hy && c[2] >= hz;
        [false, true].forEach((corner) => {
          const idx = cells.map((c, i) => i).filter((i) => inCorner(cells[i]) === corner);
          const ms = S.cubeMeshes(st, o, idx.map((i) => cells[i]), { color: (c, k, dir) => col(c, idx[k], dir), lw: 0.9 });
          if (corner) ms.forEach((m) => { m.lm = C.M4.translate(A * 0.4 * apart, B * 1.25 * apart, 0); });
        });
      } else {
        const ms = S.cubeMeshes(st, o, cells, { color: col, all: apart > 0, lw: cells.length > 125 ? 0.9 : 1.1 });
        ms.forEach((m) => { const c = m.cc; m.lm = C.M4.translate((c[0] - pivot[0]) * 0.5 * apart, (c[1] - pivot[1]) * 0.5 * apart, (c[2] - pivot[2]) * 0.5 * apart); });
      }
    }
    function setApart(t) {
      const was = apart > 0;
      apart = t;
      if ((apart > 0) !== was) build();
      else if (layers) o.meshes.forEach((m) => { if (m.cc && m.cc[0] >= Math.floor(A / 2) && m.cc[1] >= Math.floor(B / 2) && m.cc[2] >= Math.floor(Cc / 2)) m.lm = C.M4.translate(A * 0.4 * t, B * 1.25 * t, 0); });
      else o.meshes.forEach((m) => { if (m.cc) { const c = m.cc; m.lm = C.M4.translate((c[0] - pivot[0]) * 0.5 * t, (c[1] - pivot[1]) * 0.5 * t, (c[2] - pivot[2]) * 0.5 * t); } });
      o.size = size * (1 + (layers ? 0.9 : 0.5) * t);
      if (layers) o.pivot = [pivot[0] * (1 + 0.4 * t), pivot[1] * (1 + 1.25 * t), pivot[2]];
      sl.set(t);
    }
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); st.layout(); st.frame(); } else wb.fit(); });

    // the answer
    const panel = ctx.h('div.cb-panel');
    ctx.panel.appendChild(panel);
    let box = null, J = null;
    const inputs = {};
    if (d.ask === 'table') {
      const tbl = ctx.h('div.cb-table');
      tableKs(d).forEach((k) => {
        const inp = ctx.h('input.ans-in.cb-kin', { type: 'text', inputmode: 'numeric', placeholder: '?', autocomplete: 'off', 'aria-label': KWORD(k) });
        inp.addEventListener('keydown', (e) => { e.stopPropagation(); if (e.key === 'Enter') J.click(); });
        inputs[k] = inp;
        tbl.appendChild(ctx.h('label.cb-row', { html: kIcon(k) + '<span>' + KWORD(k) + '</span>' }, inp));
      });
      J = judge(ctx, {
        cap: () => 3,
        empty: 'Fill in every row first.',
        evaluate() {
          const vals = {};
          for (const k of tableKs(d)) {
            const s = inputs[k].value.trim();
            if (!s) return null;
            vals[k] = C.answerTools ? C.answerTools.readNumber(s) : parseFloat(s);
          }
          const bad = tableKs(d).filter((k) => vals[k] !== d.answer[k]);
          if (!bad.length) return { ok: true, msg: 'All right: ' + tableKs(d).map((k) => d.answer[k]).join(' + ') + ' = ' + pc.cells.length + ' little cubes.' };
          const sum = tableKs(d).reduce((s2, k) => s2 + (vals[k] || 0), 0);
          return { ok: false, msg: (sum !== pc.cells.length ? 'Your numbers add up to ' + sum + ', but there are ' + pc.cells.length + ' little cubes. ' : '') + 'Check the row' + (bad.length > 1 ? 's' : '') + ' for ' + bad.map((k) => KWORD(k)).join(' and ') + '.' };
        },
        onRight: () => reveal(false)
      });
      panel.append(ctx.h('div.cb-note', 'How many little cubes have…'), tbl, ctx.h('button.btn.primary.cb-go', { type: 'button', onclick: () => J.click() }, 'Answer'));
    } else {
      box = ctx.answer({
        kind: 'number', placeholder: 'A number',
        label: d.ask === 'reverse' ? 'How many little cubes in all?' : 'How many little cubes have ' + KWORD(d.ask.k) + '?',
        check: (v) => {
          const n = C.answerTools ? C.answerTools.readNumber(v) : parseFloat(v);
          if (n === d.answer) { setTimeout(() => reveal(false), 80); return { ok: true, msg: 'Yes: **' + d.answer + '**.' }; }
          return { ok: false, msg: d.ask === 'reverse' ? 'Not that many — or not so few. Work out how many little cubes fit along one edge.' : n > d.answer ? 'Fewer than that.' : 'More than that.' };
        }
      });
    }
    const sl = slider(ctx, 'Take it apart', 'whole', 'apart', (t) => { if (!done) return; if (!wb.is3D) wb.set3D(true); setApart(t); st.layout(); st.frame(true); st.render(); });
    sl.el.classList.add('off');
    const codeBtn = ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => { coded = !coded; codeBtn.textContent = coded ? 'Show the paint' : 'Colour by painted faces'; build(); draw2(); st.render(); } }, 'Show the paint');
    const legend = ctx.h('div.cb-legend');
    function drawLegend() {
      const t = paintTally(d).tally;
      legend.innerHTML = tableKs(d).map((k) => '<span><i style="background:' + CAT[k] + '"></i>' + (t[k] || 0) + ' with ' + KWORD(k) + '</span>').join('');
    }
    const after = ctx.h('div.cb-after', sl.el, ctx.h('div.row', codeBtn), legend);
    after.hidden = true;
    panel.append(after);

    function reveal(instant) {
      if (done && !instant) return;
      done = true;
      coded = true;
      after.hidden = false;
      sl.el.classList.remove('off');
      drawLegend();
      codeBtn.textContent = 'Show the paint';
      if (J) { J.done = true; tableKs(d).forEach((k) => { inputs[k].value = String(d.answer[k]); inputs[k].disabled = true; }); }
      build();
      draw2();
      if (instant) { setApart(0.5); st.layout(); st.frame(); return; }
      if (!wb.is3D) wb.set3D(true);
      const y0 = o.yaw;
      st.animate(2000, (t) => { setApart(0.6 * t); o.yaw = y0 + 40 * t; st.layout(); st.frame(true); });
      ctx.changed('reveal');
    }

    build();
    draw2();
    wb.set3D(true);
    st.layout();
    st.frame();
    const n1 = A;
    return {
      noMoves: true,
      checkLabel: 'Answer',
      check: J ? (manual) => (J.done ? { solved: true } : manual ? J.submit() : { solved: false }) : undefined,
      hint(n) {
        const cube = d.dims && A === B && B === Cc;
        if (d.ask === 'reverse') {
          if (n === 0) return 'Call the number of little cubes along an edge *n*. The cubes with no paint make a smaller cube inside, ' + (d.rule === 'all' ? '(n − 2)' : 'a little less than n') + ' along each edge.';
          if (n === 1) return 'Try n = 3, 4, 5 … until the count comes out right.';
          return null;
        }
        if (n === 0) return 'Sort the little cubes by where they are: ' + (cube ? 'corners (8 of them), edges (12 edges, each with ' + Math.max(0, n1 - 2) + ' cubes that are not corners), faces, and the hidden core.' : 'corners, edges, faces and the inside.');
        if (n === 1) return d.rule === 'all' ? 'A corner cube has 3 painted faces, an edge cube 2, a cube in the middle of a face 1, and a cube inside none.' : 'Only the painted sides count: a little cube gets one painted face for each painted side of the big one that it touches.';
        if (n === 2 && cube && d.rule === 'all') return 'The unpainted core is a cube ' + Math.max(0, n1 - 2) + ' × ' + Math.max(0, n1 - 2) + ' × ' + Math.max(0, n1 - 2) + '.';
        return null;
      },
      solve() {
        if (box) box.feedback('The answer: <b>' + d.answer + '</b>', 'good');
        reveal(false);
        if (J) ctx.changed('solve');
      },
      explain() {
        const t = paintTally(d).tally;
        return 'Of the ' + pc.cells.length + ' little cubes: ' + tableKs(d).map((k) => '**' + (t[k] || 0) + '** with ' + KWORD(k)).join(', ') + '. Take it apart in 3D to see where each kind sits.';
      },
      getState() { return { done }; },
      setState(s) { if (s && s.done && !done) reveal(true); },
      destroy() { st.destroy(); }
    };
  }

  /* ---------- views: build the stack ---------- */

  const POS_ROW = (z, d) => { const k = d - 1 - z; return k === 0 ? 'the front row' : k === d - 1 ? 'the back row' : 'row ' + (k + 1) + ' from the front'; };
  const POS_COL = (x, w) => (x === 0 ? 'the left' : x === w - 1 ? 'the right' : 'column ' + (x + 1) + ' from the left');
  function mountViews(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb;
    const T = d.H, W = T[0].length, Dd = T.length;
    const HMAX = Math.max.apply(null, frontView(T)) + 1;
    let H = T.map((r) => r.map(() => 0));
    let removeMode = false, hoverKey = '', ghost = [];

    // 3D: a board to build on
    const st = new S.Stage(ctx, {
      onTap: (hit, obj, ev) => act(target3(hit, ev), true),
      onHover: (hit, obj, ev) => preview(target3(hit, ev)),
      cursor: (hit) => (hit && (hit.mesh.floor || hit.mesh.cc) ? (removeMode ? 'not-allowed' : 'copy') : null),
      after: (c2, view) => {
        if (!o || !o.M) return;
        const th = st.theme;
        c2.font = '700 11px "Segoe UI", system-ui, sans-serif';
        c2.textAlign = 'center'; c2.textBaseline = 'middle';
        c2.fillStyle = th.muted;
        const q1 = view.project(C.M4.apply(o.M, [W / 2, 0, Dd + 0.55])), q2 = view.project(C.M4.apply(o.M, [W + 0.55, 0, Dd / 2]));
        c2.fillText('FRONT', q1[0], q1[1]);
        c2.fillText('RIGHT', q2[0], q2[1]);
      }
    });
    const o = stackObject(st, H, { pickFloor: true, hmin: HMAX, obj: { yaw: -35, pitch: 32, pmin: 0 } });
    function cellsNow() { return stackCells(H); }
    // what a click would do: { x, z, h } (the new height of a column)
    function target3(hit, ev) {
      if (!hit) return null;
      const rem = removeMode || (ev && (ev.shiftKey || ev.altKey || ev.button === 2));
      const m = hit.mesh;
      if (m.floor) {
        const c = m.cellOf && m.cellOf[hit.face];
        if (!c || rem) return null;
        return { x: c[0], z: c[1], h: Math.min(HMAX, H[c[1]][c[0]] + 1) };
      }
      if (m.cc && m.cell != null) {
        const c = cellsNow()[m.cell];
        if (!c) return null;
        const [x, y, z] = c;
        if (rem) return { x, z, h: y, rem: true };
        const dir = m.faceDir[hit.face];
        if (dir === 2) return { x, z, h: Math.min(HMAX, H[z][x] + 1) };
        if (dir === 3) return null;
        const nx = x + S.DIR6[dir][0], nz = z + S.DIR6[dir][2];
        if (nx < 0 || nz < 0 || nx >= W || nz >= Dd) return null;
        return { x: nx, z: nz, h: Math.max(H[nz][nx], y + 1) };
      }
      return null;
    }
    function preview(t) {
      const key = t ? t.x + ',' + t.z + ',' + t.h + (t.rem ? 'r' : '') : '';
      if (key === hoverKey) return;
      hoverKey = key;
      ghost.forEach((m) => st.v.remove(m));
      o.meshes = o.meshes.filter((m) => !ghost.includes(m));
      ghost = [];
      o.cubes.forEach((m) => { m.colors = m.colors.map(() => WOOD); });
      if (t && !t.rem && t.h > H[t.z][t.x]) {
        const add = [];
        for (let y = H[t.z][t.x]; y < t.h; y++) add.push([t.x, y, t.z]);
        ghost = S.cubeMeshes(st, o, add, { color: GHOST, all: true });
        ghost.forEach((m) => { m.alpha = 0.4; m.pickable = false; });
      } else if (t && t.rem) {
        const cl = cellsNow();
        o.cubes.forEach((m) => { const c = cl[m.cell]; if (c && c[0] === t.x && c[2] === t.z && c[1] >= t.h) m.colors = m.colors.map(() => '#ff7b72'); });
      }
      st.render();
    }
    function act(t) {
      if (!t || t.h === H[t.z][t.x]) return;
      H[t.z][t.x] = Math.max(0, Math.min(HMAX, t.h));
      ctx.sfx(t.rem ? 'tap' : 'snap');
      hoverKey = '';
      rebuild();
      ctx.changed('build');
    }
    function rebuild() {
      ghost.forEach((m) => st.v.remove(m));
      o.meshes = o.meshes.filter((m) => !ghost.includes(m));
      ghost = [];
      o.build(H.map((r) => r.slice()));
      o.H = H;
      draw2();
      drawPanel();
      st.render();
    }

    // the page: the drawing, with the top view as a grid of heights to click
    const g2 = ctx.s('g', { class: 'cb-views cb-edit' }, wb.layer('board'));
    let L2 = null;
    function draw2() {
      L2 = viewsDrawing(T, H, { numbers: true });
      g2.innerHTML = L2.svg;
    }
    draw2();
    wb.setBounds({ x0: -0.4, y0: -0.2, x1: L2.w + 0.4, y1: L2.h + 0.4 }, 0.06);
    wb.handlers.board = {
      down(pt, ev) {
        const x = Math.floor(pt[0]), z = Math.floor(pt[1] - L2.oyTop);
        if (x < 0 || z < 0 || x >= W || z >= Dd) return false;
        const rem = removeMode || ev.shiftKey || ev.altKey;
        act({ x, z, h: Math.max(0, Math.min(HMAX, H[z][x] + (rem ? -1 : 1))), rem });
        return true;
      },
      hover(pt) { const x = Math.floor(pt[0]), z = Math.floor(pt[1] - (L2 ? L2.oyTop : 0)); wb.svg.style.cursor = x >= 0 && z >= 0 && x < W && z < Dd ? 'pointer' : ''; }
    };

    // the panel
    const pv = ctx.h('div.cb-pv');
    const status = ctx.h('div.cb-note');
    const addB = ctx.h('button.btn.small', { type: 'button', onclick: () => setMode(false) }, 'Add cubes');
    const remB = ctx.h('button.btn.small', { type: 'button', onclick: () => setMode(true) }, 'Take away');
    function setMode(r) { removeMode = r; addB.classList.toggle('primary', !r); remB.classList.toggle('primary', r); hoverKey = ''; preview(null); }
    const look = (name, yaw, pitch) => ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => { if (!wb.is3D) wb.set3D(true); const y0 = o.yaw, p0 = o.pitch; st.animate(600, (t) => { o.yaw = y0 + (yaw - y0) * t; o.pitch = p0 + (pitch - p0) * t; }); } }, name);
    ctx.panel.appendChild(ctx.h('div.cb-panel',
      pv, status,
      ctx.h('div.row', addB, remB, ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => { H = H.map((r) => r.map(() => 0)); rebuild(); ctx.changed('build'); } }, 'Clear')),
      ctx.h('div.cb-note', { html: 'Click the board or a cube to add a cube there; <b>Shift</b>-click (or <b>Take away</b>) removes a cube and everything on it. Look from:' }),
      ctx.h('div.row', look('Front', 0, 0), look('Top', 0, 89), look('Right', -90, 0), look('Corner', -35, 32))
    ));
    setMode(false);
    function drawPanel() {
      const dr = viewsDrawing(T, H, {});
      pv.innerHTML = svgWrap(dr.svg, -0.2, -0.1, dr.w + 0.4, dr.h + 0.3, 'cb-pvsvg');
      const n = total(H);
      status.innerHTML = 'Cubes used: <b>' + n + '</b>' + (d.goal === 'min' ? ' — use as few as you can.' : d.goal === 'max' ? ' — use as many as you can.' : '') + (dr.ok ? ' <span class="cb-ok">All three views match.</span>' : '');
    }
    drawPanel();
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); st.layout(); st.frame(); } else wb.fit(); });
    wb.set3D(true);
    st.layout();
    st.frame();

    function judgeNow() {
      const same = viewsKey(H) === viewsKey(T);
      if (!same) {
        const bad = [];
        if (JSON.stringify(frontView(H)) !== JSON.stringify(frontView(T))) bad.push('front');
        if (JSON.stringify(topView(H)) !== JSON.stringify(topView(T))) bad.push('top');
        if (JSON.stringify(sideView(H)) !== JSON.stringify(sideView(T))) bad.push('side');
        return { solved: false, msg: 'The ' + bad.join(' and the ') + ' view' + (bad.length > 1 ? 's do' : ' does') + ' not match yet.' };
      }
      const n = total(H);
      if (d.goal === 'min' && n > d.answer) return { solved: false, msg: 'All three views match with ' + n + ' cubes — but it can be done with fewer.' };
      if (d.goal === 'max' && n < d.answer) return { solved: false, msg: 'All three views match with ' + n + ' cubes — but there is room for more.' };
      return { solved: true, msg: 'All three views match' + (d.goal === 'any' ? '.' : ', with ' + n + ' cubes — the ' + (d.goal === 'min' ? 'fewest' : 'most') + ' possible.') };
    }
    return {
      noMoves: true,
      check(manual) { const r = judgeNow(); return r.solved ? r : { solved: false, msg: manual ? r.msg : '' }; },
      hint(n) {
        if (n === 0) return 'Start with the top view: it shows which squares of the board have any cubes at all.';
        if (n === 1) return 'The front view gives the tallest column in each line from left to right, and the side view the tallest in each line from front to back. A column can be no taller than both allow.' + (d.goal === 'min' ? ' To use few cubes, make a column tall only where a view needs it — one tall column can serve the front view and the side view at once.' : d.goal === 'max' ? ' To use many, make every column as tall as both views allow.' : '');
        const cellsT = [];
        T.forEach((r, z) => r.forEach((v, x) => { if (v && H[z][x] !== v) cellsT.push([x, z, v]); }));
        if (!cellsT.length) return null;
        const [x, z, v] = cellsT[(n - 2) % cellsT.length];
        return 'In ' + POS_ROW(z, Dd) + ', at ' + POS_COL(x, W) + ', build a column of ' + C.plural(v, 'cube') + '.';
      },
      solve() { H = T.map((r) => r.slice()); rebuild(); ctx.changed('solve'); },
      explain() {
        const e = extremes(T);
        if (e.min === e.max) return 'Only one stack has these three views, with **' + e.min + '** cubes: every column is as tall as both the front and the side view allow.';
        return 'Many stacks share these three views: they can hold anywhere from **' + e.min + '** to **' + e.max + '** cubes. The most: every column as tall as both the front and the side view allow. The fewest: one column of each height where a view needs it, placed where it serves the front and the side view at once.';
      },
      getState() { return { H: H.map((r) => r.slice()) }; },
      setState(s) { if (s && s.H) { H = s.H.map((r) => r.slice()); rebuild(); } },
      destroy() { st.destroy(); wb.handlers.board = null; }
    };
  }

  /* ---------- choosing: which stack, which view, same or mirror ---------- */

  function chipsRow(ctx, n, labels, onPick) {
    const row = ctx.h('div.cb-chips');
    const chips = [];
    for (let i = 0; i < n; i++) {
      const b = ctx.h('button.cb-chip', { type: 'button', onclick: () => onPick(i), html: labels ? labels(i) : LET[i] });
      chips.push(b);
      row.appendChild(b);
    }
    return { row, chips };
  }

  function mountViewPick(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb;
    let sel = -1;
    const wrong = new Set();
    const st = new S.Stage(ctx, { onTap: (hit, obj) => { if (obj && obj.k != null) pick(obj.k); }, cursor: (hit, obj) => (obj && !J.done ? 'pointer' : null) });
    const hmax = Math.max.apply(null, d.stacks.map((H) => dims(H).h));
    const objs = d.stacks.map((H, k) => { const o = stackObject(st, H, { hmin: hmax, obj: { label: LET[k], yaw: -35, pitch: 30 } }); o.k = k; return o; });
    // the page: each stack from the corner, and the drawing
    const gp = ctx.s('g', { class: 'cb-pic' }, wb.layer('board'));
    function draw2() {
      let s = '', x = 0, y1 = 0;
      d.stacks.forEach((H, k) => {
        const g = stackGeom(H, hmax);
        const r = cubesSVG(stackCells(H), { R: S.ypMat(-35, 30), pivot: g.pivot, D: 0 }, { floor: [g.w, g.d], sw: 0.03, at: [x + g.size, 0] });
        s += '<g class="cb-cand' + (sel === k ? ' sel' : '') + (J.done && k === d.answer ? ' good' : wrong.has(k) ? ' bad' : '') + '">' + r.svg + '</g>';
        s += '<text class="cb-lab" x="' + f3(x + g.size) + '" y="' + f3(g.size + 0.5) + '">' + LET[k] + '</text>';
        d.stacks[k]._x = [x, x + 2 * g.size];
        x += 2 * g.size + 0.5;
        y1 = Math.max(y1, g.size + 0.8);
      });
      const dr = viewsDrawing(d.stacks[d.answer], null, {});
      s += '<g transform="translate(' + f3(x + 0.4) + ' ' + f3(-y1 + 0.2) + ')" class="cb-views">' + dr.svg + '</g>';
      gp.innerHTML = s;
      wb.setBounds({ x0: -0.5, y0: -y1, x1: x + dr.w + 1, y1: Math.max(y1, -y1 + dr.h + 0.6) }, 0.05);
    }
    wb.handlers.board = { down(pt) { const k = d.stacks.findIndex((H) => H._x && pt[0] >= H._x[0] && pt[0] <= H._x[1]); if (k < 0 || J.done) return false; pick(k); return true; } };
    const J = judge(ctx, {
      empty: 'Click a stack first.',
      evaluate() {
        if (sel < 0) return null;
        if (sel === d.answer) return { ok: true, msg: 'Stack ' + LET[sel] + ' it is.' };
        const H = d.stacks[sel], T = d.stacks[d.answer];
        const bad = [];
        if (JSON.stringify(frontView(H)) !== JSON.stringify(frontView(T))) bad.push('front');
        if (JSON.stringify(topView(H)) !== JSON.stringify(topView(T))) bad.push('top');
        if (JSON.stringify(sideView(H)) !== JSON.stringify(sideView(T))) bad.push('right');
        return { ok: false, msg: 'Stack ' + LET[sel] + ' looks different from the ' + bad.join(' and from the ') + '.', wrong: sel };
      },
      onWrong(r) { wrong.add(r.wrong); sel = -1; sync(); },
      onRight() { sync(); tour(); }
    });
    const ch = chipsRow(ctx, d.stacks.length, null, (i) => pick(i));
    const dr0 = viewsDrawing(d.stacks[d.answer], null, {});
    ctx.panel.appendChild(ctx.h('div.cb-panel', ctx.h('div.cb-pv', { html: svgWrap(dr0.svg, -0.2, -0.1, dr0.w + 0.4, dr0.h + 0.3, 'cb-pvsvg') }), ch.row, ctx.h('button.btn.primary.cb-go', { type: 'button', onclick: () => J.click() }, 'Answer'), ctx.h('div.cb-note', 'Drag a stack to turn it; drag the empty table to turn them all together.')));
    function pick(k) { if (J.done || wrong.has(k)) return; sel = sel === k ? -1 : k; ctx.sfx('tap'); sync(); ctx.changed('select'); }
    function sync() {
      objs.forEach((o, k) => { o.state = J.done && k === d.answer ? 'good' : wrong.has(k) ? 'bad' : sel === k ? 'sel' : null; o.cubes.forEach((m) => { m.selected = sel === k && !J.done; }); });
      ch.chips.forEach((b, k) => { b.className = 'cb-chip' + (objs[k].state ? ' ' + objs[k].state : ''); });
      draw2();
      st.render();
    }
    // show all of them from the front, the top and the side in turn
    function tour() {
      if (!wb.is3D) wb.set3D(true);
      const steps = [[0, 0], [0, 89], [-90, 0], [-35, 30]];
      let i = 0;
      const next = () => {
        if (i >= steps.length || st.dead) return;
        const [yw, pt] = steps[i++];
        const from = objs.map((o) => [o.yaw, o.pitch]);
        st.animate(700, (t) => objs.forEach((o, k) => { o.yaw = from[k][0] + (yw - from[k][0]) * t; o.pitch = from[k][1] + (pt - from[k][1]) * t; }), () => setTimeout(next, C.anim(650)));
      };
      next();
    }
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); st.layout(); st.frame(); } else { draw2(); wb.fit(); } });
    wb.set3D(true);
    st.layout();
    st.frame();
    sync();
    return {
      noMoves: true,
      checkLabel: 'Answer',
      check(manual) { return J.done ? { solved: true } : manual ? J.submit() : { solved: false }; },
      hint(n) {
        if (n === 0) return 'Check one view at a time: turn all the stacks to face you (drag the empty table) and compare the front view first.';
        const left = d.stacks.map((_, k) => k).filter((k) => k !== d.answer && !wrong.has(k));
        if (!left.length || n > left.length) return null;
        const k = left[n - 1];
        wrong.add(k);
        sync();
        return 'Stack ' + LET[k] + ' is not it: it looks different from at least one side.';
      },
      solve() { sel = d.answer; J.done = true; sync(); ctx.changed('solve'); tour(); },
      explain() { return 'Only stack **' + LET[d.answer] + '** looks like the drawings from the front, from the top and from the right. Each of the others differs in at least one view — the tour after your answer shows them all from each side.'; },
      getState() { return { sel, done: J.done, wrong: Array.from(wrong) }; },
      setState(s) { if (!s) return; sel = s.sel; J.done = !!s.done; wrong.clear(); (s.wrong || []).forEach((k) => wrong.add(k)); sync(); },
      destroy() { st.destroy(); wb.handlers.board = null; }
    };
  }

  function mountWhichView(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb;
    let sel = -1;
    const wrong = new Set();
    const st = new S.Stage(ctx, {});
    const o = stackObject(st, d.H, { obj: { yaw: -35, pitch: 30 } });
    const g = o.g;
    const gp = ctx.s('g', { class: 'cb-pic' }, wb.layer('board'));
    const r0 = cubesSVG(stackCells(d.H), { R: S.ypMat(-35, 30), pivot: g.pivot, D: 0 }, { floor: [g.w, g.d], key: 'c', sw: 0.03 });
    gp.innerHTML = r0.svg;
    wb.setBounds({ x0: r0.box[0] - 0.6, y0: r0.box[1] - 0.6, x1: r0.box[2] + 0.6, y1: r0.box[3] + 0.6 }, 0.06);
    const J = judge(ctx, {
      empty: 'Pick a drawing first.',
      evaluate() {
        if (sel < 0) return null;
        if (sel === d.answer) return { ok: true, msg: 'Drawing ' + LET[sel] + ' is the view from the ' + SIDE_WORD[d.side] + '.' };
        const v = d.options[sel], right = viewOf(d.H, d.side);
        const flipped = d.side === 'top' ? JSON.stringify(v) === JSON.stringify(right.map((rr) => rr.slice().reverse())) : JSON.stringify(v) === JSON.stringify(right.slice().reverse());
        return { ok: false, msg: flipped ? 'Drawing ' + LET[sel] + ' is the right shape the wrong way round — that is the view from the opposite side, or a mirror image.' : 'Drawing ' + LET[sel] + ' is not it.', wrong: sel };
      },
      onWrong(r) { wrong.add(r.wrong); sel = -1; sync(); },
      onRight() { sync(); if (!wb.is3D) wb.set3D(true); const to = d.side === 'front' ? [0, 0] : d.side === 'top' ? [0, 89] : [-90, 0]; const y0 = o.yaw, p0 = o.pitch; st.animate(900, (t) => { o.yaw = y0 + (to[0] - y0) * t; o.pitch = p0 + (to[1] - p0) * t; }); }
    });
    const ch = chipsRow(ctx, d.options.length, (i) => { const v = viewSVG(d.options[i], d.side); return '<b>' + LET[i] + '</b>' + svgWrap('<g class="cb-views">' + v.svg + '</g>', -0.15, -0.15, v.w + 0.3, v.h + 0.3, 'cb-optsvg'); }, (i) => { if (J.done || wrong.has(i)) return; sel = sel === i ? -1 : i; ctx.sfx('tap'); sync(); ctx.changed('select'); });
    ch.row.classList.add('cb-opts');
    ctx.panel.appendChild(ctx.h('div.cb-panel', ch.row, ctx.h('button.btn.primary.cb-go', { type: 'button', onclick: () => J.click() }, 'Answer'), ctx.h('div.cb-note', 'Drag the stack to turn it. In the drawings of the side, the front of the stack is on the left; in the top view it is at the bottom.')));
    function sync() { ch.chips.forEach((b, k) => { b.className = 'cb-chip cb-opt' + (J.done && k === d.answer ? ' good' : wrong.has(k) ? ' bad' : sel === k ? ' sel' : ''); }); st.render(); }
    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); st.layout(); st.frame(); } else wb.fit(); });
    wb.set3D(true);
    st.layout();
    st.frame();
    sync();
    return {
      noMoves: true,
      checkLabel: 'Answer',
      check(manual) { return J.done ? { solved: true } : manual ? J.submit() : { solved: false }; },
      hint(n) {
        if (n === 0) return d.side === 'top' ? 'Imagine flying over the stack with the front towards you: every square with at least one cube is dark.' : 'Stand on the ' + (d.side === 'front' ? 'front' : 'right') + ' side and look straight at the stack: each column of the drawing is as tall as the tallest cubes in that line.';
        if (n === 1) return { text: 'The stack now faces you from that side.', show() { if (!wb.is3D) wb.set3D(true); const to = d.side === 'front' ? [0, 0] : d.side === 'top' ? [0, 89] : [-90, 0]; st.animate(800, (t) => { o.yaw = -35 + (to[0] + 35) * t; o.pitch = 30 + (to[1] - 30) * t; }); } };
        return null;
      },
      solve() { sel = d.answer; J.done = true; sync(); ctx.changed('solve'); },
      explain() { return 'Drawing **' + LET[d.answer] + '** is the view from the ' + SIDE_WORD[d.side] + '. The usual traps are the view from the opposite side (the same shape, reversed) and a column one cube too tall or too short.'; },
      getState() { return { sel, done: J.done, wrong: Array.from(wrong) }; },
      setState(s) { if (!s) return; sel = s.sel; J.done = !!s.done; wrong.clear(); (s.wrong || []).forEach((k) => wrong.add(k)); sync(); },
      destroy() { st.destroy(); }
    };
  }

  // the turn that lays shape a over shape b as well as possible: { R, t, overlap }
  function bestFit(a, b) {
    const S = sp();
    const kb = new Set(b.map((c) => c.join(',')));
    let best = { overlap: -1 };
    for (const R of S.ROTS) {
      const ra = S.rotCells(a, R);
      for (const p of ra) for (const q of b) {
        const t = [q[0] - p[0], q[1] - p[1], q[2] - p[2]];
        let n = 0;
        ra.forEach((c) => { if (kb.has((c[0] + t[0]) + ',' + (c[1] + t[1]) + ',' + (c[2] + t[2]))) n++; });
        if (n > best.overlap) best = { R, t, overlap: n };
      }
    }
    return best;
  }

  function mountRot(ctx, p) {
    const S = sp(), d = p.data, wb = ctx.wb, Q = S.Q;
    const pick = d.kind === 'rotpick';
    let sel = pick ? -1 : null;
    const wrong = new Set();
    const st = new S.Stage(ctx, { onTap: (hit, obj) => { if (pick && obj && obj.k != null) choose(obj.k); }, cursor: (hit, obj) => (pick && obj && obj.k != null && !J.done ? 'pointer' : null) });
    const A = shapeObject(st, d.a, d.qa, { label: pick ? 'This shape' : 'A' });
    const others = pick ? d.options.map((op, k) => { const o = shapeObject(st, op.c, op.q, { label: LET[k] }); o.k = k; return o; }) : [shapeObject(st, d.b, d.qb, { label: 'B' })];
    // the page: the same pictures, flat
    const gp = ctx.s('g', { class: 'cb-pic' }, wb.layer('board'));
    function draw2() {
      let s = '', x = 0, top = 0, bot = 0;
      const list = [{ c: d.a, q: d.qa, lab: pick ? 'This shape' : 'A' }].concat(pick ? d.options.map((op, k) => ({ c: op.c, q: op.q, lab: LET[k], k })) : [{ c: d.b, q: d.qb, lab: 'B' }]);
      list.forEach((it, i) => {
        const cen = centroid(it.c), rad = radius(it.c);
        const r = cubesSVG(it.c, { R: Q.mat(it.q), pivot: cen, D: 0 }, { color: SHAPE, sw: 0.03, at: [x + rad, 0], key: 's' + i + '-' });
        const stt = it.k == null ? '' : J.done && it.k === d.answer ? ' good' : wrong.has(it.k) ? ' bad' : sel === it.k ? ' sel' : '';
        s += '<g class="cb-cand' + stt + '">' + r.svg + '</g><text class="cb-lab" x="' + f3(x + rad) + '" y="' + f3(rad + 0.55) + '">' + it.lab + '</text>';
        it._x = [x, x + 2 * rad];
        x += 2 * rad + 0.8;
        top = Math.min(top, -rad); bot = Math.max(bot, rad + 0.9);
      });
      draw2.list = list;
      gp.innerHTML = s;
      wb.setBounds({ x0: -0.4, y0: top - 0.4, x1: x - 0.4, y1: bot }, 0.05);
      wb.applyPaints();
    }
    wb.handlers.board = { down(pt) { if (!pick || J.done) return false; const it = (draw2.list || []).find((q) => q.k != null && pt[0] >= q._x[0] && pt[0] <= q._x[1]); if (!it) return false; choose(it.k); return true; } };
    const WORD = { same: 'the same shape', mirror: 'its mirror image', different: 'a different shape' };
    const J = judge(ctx, {
      cap: (tries) => (pick ? Math.max(1, 3 - tries) : (d.choices || []).length > 2 ? Math.max(1, 3 - 2 * tries) : (tries ? 1 : 3)),
      empty: pick ? 'Click a shape first.' : 'Choose an answer.',
      evaluate() {
        if (pick) {
          if (sel < 0) return null;
          if (sel === d.answer) return { ok: true, msg: LET[sel] + ' is the same shape, turned.' };
          const rel = relation(d.a, d.options[sel].c);
          return { ok: false, msg: LET[sel] + ' is ' + (rel === 'mirror' ? 'the mirror image' : 'a different shape') + '.', wrong: sel };
        }
        if (sel == null) return null;
        if (sel === d.answer) return { ok: true, msg: 'Yes — B is ' + WORD[d.answer] + '.' };
        return { ok: false, msg: 'No — B is not ' + WORD[sel] + '.', wrong: sel };
      },
      onWrong(r) { wrong.add(r.wrong); if (pick) sel = -1; sync(); },
      onRight() { sync(); show(); }
    });
    const panel = ctx.h('div.cb-panel');
    let ch = null;
    const btns = {};
    if (pick) {
      ch = chipsRow(ctx, d.options.length, null, (i) => choose(i));
      panel.append(ch.row, ctx.h('button.btn.primary.cb-go', { type: 'button', onclick: () => J.click() }, 'Answer'));
    } else {
      const row = ctx.h('div.cb-chips');
      (d.choices || ['same', 'mirror']).forEach((c) => {
        btns[c] = ctx.h('button.btn', { type: 'button', onclick: () => { if (J.done || wrong.has(c)) return; sel = c; J.click(); } }, c === 'same' ? 'Same shape' : c === 'mirror' ? 'Mirror image' : 'Different');
        row.appendChild(btns[c]);
      });
      panel.append(row);
    }
    panel.append(ctx.h('div.cb-note', 'Drag a shape to turn it; drag the empty table to turn them all together. Answer in your head first — that is the real test.'));
    ctx.panel.appendChild(panel);
    function choose(k) { if (J.done || wrong.has(k)) return; sel = sel === k ? -1 : k; ctx.sfx('tap'); sync(); ctx.changed('select'); }
    function sync() {
      others.forEach((o) => {
        const k = pick ? o.k : null;
        o.state = pick ? (J.done && k === d.answer ? 'good' : wrong.has(k) ? 'bad' : sel === k ? 'sel' : null) : (J.done ? 'good' : null);
        o.meshes.forEach((m) => { m.selected = pick && sel === k && !J.done; });
      });
      if (ch) ch.chips.forEach((b, k) => { b.className = 'cb-chip' + (J.done && k === d.answer ? ' good' : wrong.has(k) ? ' bad' : sel === k ? ' sel' : ''); });
      Object.keys(btns).forEach((c) => { btns[c].className = 'btn' + (J.done && c === d.answer ? ' primary' : wrong.has(c) ? ' cb-bad' : ''); });
      draw2();
      st.render();
    }

    // after the answer: turn the second shape to face the same way as the first (and through a mirror if need be)
    function show() {
      if (!wb.is3D) wb.set3D(true);
      const target = pick ? others[d.answer] : others[0];
      const cells = pick ? d.options[d.answer].c : d.b;
      const rel = relation(d.a, cells);
      const qa = A.home.q;
      const f = { qa: A.q.slice(), qb: target.q.slice() };
      let qEnd, flip = false;
      if (rel === 'same') { const R = S.findTurn(d.a, cells).R; qEnd = Q.norm(Q.mul(qa, Q.fromMat(S.transpose(R)))); }
      else if (rel === 'mirror') {
        const R = S.findTurn(S.mirrorCells(d.a), cells).R;
        const X = S.mm(S.mm(S.mm([-1, 0, 0, 0, 1, 0, 0, 0, 1], Q.mat(qa)), S.MIRROR), S.transpose(R));
        qEnd = Q.fromMat(X);
        flip = true;
      } else {
        const bf = bestFit(d.a, cells);
        qEnd = Q.norm(Q.mul(qa, Q.fromMat(S.transpose(bf.R))));
        // mark the cubes that do not match
        const ka = new Set(S.rotCells(d.a, bf.R).map((c) => [c[0] + bf.t[0], c[1] + bf.t[1], c[2] + bf.t[2]].join(',')));
        const kb = new Set(cells.map((c) => c.join(',')));
        target.build(cells, (c) => (ka.has(c.join(',')) ? SHAPE : '#ff7b72'));
        const Ra = S.transpose(bf.R);
        A.build(d.a, (c) => { const q = S.mv(bf.R, c); return kb.has([q[0] + bf.t[0], q[1] + bf.t[1], q[2] + bf.t[2]].join(',')) ? SHAPE : '#ff7b72'; });
        void Ra;
      }
      st.animate(1400, (t) => { A.q = Q.slerp(f.qa, qa, t); target.q = Q.slerp(f.qb, qEnd, t); }, () => {
        if (!flip || st.dead) return;
        target.meshes.forEach((m) => { m.doubleSided = true; });
        st.animate(1100, (t) => { target.vs = 1 - 2 * t; });
      });
    }

    wb.allow3D(true);
    wb.on('view3d', (on) => { if (on) { st.readTheme(); st.layout(); st.frame(); } else { draw2(); wb.fit(); } });
    wb.set3D(true);
    st.layout();
    st.frame();
    sync();
    return {
      noMoves: true,
      checkLabel: 'Answer',
      check(manual) { return J.done ? { solved: true } : manual ? J.submit() : { solved: false }; },
      hint(n) {
        if (n === 0) return 'Find a distinctive feature — the longest arm, a corner where three arms meet — in both shapes, and match them up. Then look where the next arm goes: left or right?';
        if (!pick) {
          if (n === 1) return 'Turn B (drag it) until one arm lies exactly like the matching arm of A. Then follow the next arm along: if it turns the other way, B is a mirror image' + ((d.choices || []).length > 2 ? '; if it has a different length, the shapes are different.' : '.');
          return null;
        }
        const left = d.options.map((_, k) => k).filter((k) => k !== d.answer && !wrong.has(k));
        if (!left.length || n > left.length) return null;
        const k = left[0];
        wrong.add(k);
        sync();
        return LET[k] + ' is not it: it is ' + (relation(d.a, d.options[k].c) === 'mirror' ? 'the mirror image.' : 'a slightly different shape.');
      },
      solve() { sel = pick ? d.answer : d.answer; J.done = true; sync(); ctx.changed('solve'); show(); },
      explain() {
        const rel = relation(d.a, pick ? d.options[d.answer].c : d.b);
        if (pick) return 'Shape **' + LET[d.answer] + '** is the same shape, turned. The mirror images can be turned any way you like and never fit — you would have to pass them through a mirror.';
        return rel === 'same' ? 'They are the **same** shape: turned the right way, B lies exactly over A. Shepard and Metzler found that the bigger the turn between two such pictures, the longer people take to decide — as if the mind really turns the shape.'
          : rel === 'mirror' ? 'B is the **mirror image** of A: no turn will make them fit, as with a left and a right glove. Watch B turn to face the same way and then pass through the mirror.'
            : 'B is a **different** shape: one cube has moved (shown in red when the two are laid over each other).';
      },
      getState() { return { sel, done: J.done, wrong: Array.from(wrong) }; },
      setState(s) { if (!s) return; sel = s.sel; J.done = !!s.done; wrong.clear(); (s.wrong || []).forEach((k) => wrong.add(k)); sync(); },
      destroy() { st.destroy(); wb.handlers.board = null; }
    };
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'cubes',
    name: 'Cubes in space',
    deps: ['js/lib/space3d.js'],
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Cubes in stacks and shapes, in 3D. **Drag** a stack or a shape to turn it (drag the empty table to turn everything together), scroll to zoom, right-drag to slide the view; the button with the cube (or key 3) switches between the 3D view and the flat page, where you can paint faces and write. In counting puzzles the stack stays put until you answer — then you can turn it and take it apart. To build a stack, click the board or a face of a cube; **Shift**-click takes a cube away. No cube ever floats.',
    verify,
    generate,
    answerKey(p) {
      const d = p.data;
      if (d.kind === 'count') return String(d.answer);
      if (d.kind === 'paint' && d.ask !== 'table') return String(d.answer);
      return null;
    },
    mount(ctx, p) {
      const k = p.data.kind;
      if (k === 'count') return mountCount(ctx, p);
      if (k === 'paint') return mountPaint(ctx, p);
      if (k === 'views') return mountViews(ctx, p);
      if (k === 'viewpick') return mountViewPick(ctx, p);
      if (k === 'whichview') return mountWhichView(ctx, p);
      return mountRot(ctx, p);
    },
    thumb(p) {
      const S = sp();
      if (!S) return '';
      const d = p.data;
      let r;
      if (d.kind === 'count' || d.kind === 'whichview' || d.kind === 'views') {
        const H = d.H, g = stackGeom(H, d.block ? d.block[2] : 0);
        const view = d.view || [-35, 30];
        r = cubesSVG(stackCells(H), { R: S.ypMat(view[0], view[1]), pivot: g.pivot, D: d.kind === 'count' ? g.D : 0 }, { floor: [g.w, g.d], sw: 0.04 });
      } else if (d.kind === 'viewpick') {
        const H = d.stacks[d.answer], g = stackGeom(H);
        r = cubesSVG(stackCells(H), { R: S.ypMat(-35, 30), pivot: g.pivot, D: 0 }, { floor: [g.w, g.d], sw: 0.04 });
      } else if (d.kind === 'paint') {
        const pc = paintCellCounts(d), dirs = paintedDirs(d.rule);
        const has = new Set(pc.cells.map((c) => c.join(',')));
        let A = 0, B = 0, Cz = 0;
        pc.cells.forEach((c) => { A = Math.max(A, c[0] + 1); B = Math.max(B, c[1] + 1); Cz = Math.max(Cz, c[2] + 1); });
        r = cubesSVG(pc.cells, { R: S.ypMat(-35, 28), pivot: [A / 2, B / 2, Cz / 2], D: 0 }, { sw: pc.cells.length > 200 ? 0.02 : 0.035, faceColor: (F) => (dirs.includes(F.dir) && !has.has([pc.cells[F.cell][0] + S.DIR6[F.dir][0], pc.cells[F.cell][1] + S.DIR6[F.dir][1], pc.cells[F.cell][2] + S.DIR6[F.dir][2]].join(',')) ? PAINT : RAW) });
      } else {
        const a = d.a, b = d.kind === 'rot' ? d.b : d.options[0].c, qb = d.kind === 'rot' ? d.qb : d.options[0].q;
        const ra = radius(a), rb = radius(b);
        const r1 = cubesSVG(a, { R: S.Q.mat(d.qa), pivot: centroid(a), D: 0 }, { color: SHAPE, sw: 0.04 });
        const r2 = cubesSVG(b, { R: S.Q.mat(qb), pivot: centroid(b), D: 0 }, { color: SHAPE, sw: 0.04, at: [ra + rb + 0.6, 0] });
        r = { svg: r1.svg + r2.svg, box: [Math.min(r1.box[0], r2.box[0]), Math.min(r1.box[1], r2.box[1]), Math.max(r1.box[2], r2.box[2]), Math.max(r1.box[3], r2.box[3])] };
      }
      const b = r.box;
      return svgWrap(r.svg, b[0] - 0.3, b[1] - 0.3, b[2] - b[0] + 0.6, b[3] - b[1] + 0.6);
    }
  });

  C.css('cubes', `
    .cb-pic text.cb-lab { font: 700 .45px "Segoe UI", system-ui, sans-serif; fill: var(--muted); text-anchor: middle; }
    .cb-cand.sel path { stroke: var(--gold); }
    .cb-cand.good path { stroke: var(--green); }
    .cb-cand.bad { opacity: .45; }
    .cb-num circle { fill: rgba(20, 24, 48, .85); }
    .cb-num text { font: 700 .34px "Segoe UI", system-ui, sans-serif; fill: #ffd166; text-anchor: middle; dominant-baseline: central; }
    .cb-views .cb-vg, .cb-pvsvg .cb-vg, .cb-optsvg .cb-vg { fill: var(--cell); stroke: var(--grid-2); stroke-width: .04; }
    .cb-views .cb-vt-on, .cb-pvsvg .cb-vt-on, .cb-optsvg .cb-vt-on { fill: var(--ink-2); fill-opacity: .55; stroke: var(--ink-2); stroke-width: .04; }
    .cb-vc { fill: none; stroke: var(--gold); stroke-width: .09; }
    .cb-vt { font: 700 .42px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .cb-vt.ok { fill: var(--green); }
    .cb-vn { font: 800 .5px "Segoe UI", system-ui, sans-serif; fill: var(--gold); text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .cb-vside { font: 600 .3px "Segoe UI", system-ui, sans-serif; fill: var(--faint); text-anchor: middle; letter-spacing: .03em; }
    .cb-edit .cb-vg { cursor: pointer; }
    .cb-panel { width: 100%; display: flex; flex-direction: column; gap: 10px; }
    .cb-panel .row { display: flex; flex-wrap: wrap; gap: 6px; }
    .cb-note { font-size: .82rem; color: var(--muted); line-height: 1.45; }
    .cb-note b { color: var(--text); }
    .cb-ok { color: var(--green); font-weight: 600; }
    .cb-pv { background: var(--panel-2); border: 1px solid var(--line); border-radius: 12px; padding: 8px; }
    .cb-pvsvg { width: 100%; max-height: 260px; display: block; }
    .cb-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .cb-chip { min-width: 40px; height: 36px; padding: 0 10px; border-radius: 10px; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font: 700 .95rem "Segoe UI", system-ui, sans-serif; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; }
    .cb-chip:hover { border-color: var(--accent); }
    .cb-chip.sel { border-color: var(--gold); background: rgba(255, 209, 102, .2); }
    .cb-chip.good { border-color: var(--green); background: rgba(78, 203, 141, .2); }
    .cb-chip.bad { border-color: var(--red); color: var(--muted); opacity: .6; }
    .cb-opts { display: grid; grid-template-columns: repeat(2, 1fr); }
    .cb-opt { height: auto; min-height: 80px; padding: 6px 10px; }
    .cb-optsvg { width: 100%; max-height: 90px; }
    .btn.cb-bad { opacity: .5; text-decoration: line-through; }
    .cb-go { align-self: flex-end; }
    .cb-table { display: flex; flex-direction: column; gap: 6px; }
    .cb-row { display: flex; align-items: center; gap: 10px; font-size: .9rem; }
    .cb-row span { flex: 1; }
    .cb-kicon { width: 34px; height: 34px; flex: none; }
    .cb-kin { flex: 0 0 90px; padding: 7px 10px; }
    .cb-sl { display: flex; align-items: center; gap: 8px; background: var(--panel-2); border: 1px solid var(--line); border-radius: 12px; padding: 8px 10px; }
    .cb-sl.off { opacity: .45; pointer-events: none; }
    .cb-sll { font-size: .82rem; font-weight: 600; }
    .cb-end { font-size: .74rem; color: var(--muted); }
    .cb-slider { flex: 1; min-width: 50px; accent-color: var(--accent); }
    .cb-legend { display: flex; flex-direction: column; gap: 4px; font-size: .82rem; color: var(--muted); }
    .cb-legend i { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 7px; vertical-align: -1px; }
    .cb-after { display: flex; flex-direction: column; gap: 8px; }
  `);
  C.cubesLib = { dims, stackCells, total, stackGeom, analyseCount, frontView, sideView, sideZ, topView, viewsKey, viewOf, extremes, paintTally, paintCellCounts, tableKs, paintText, armShape, blobShape, nearMiss, relation, makeCount, makePaint, makeViews, makeViewPick, makeWhichView, makeRot, makeRotPick, countText, countGoal };
})(typeof window !== 'undefined' ? window : globalThis);
