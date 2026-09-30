/* The Puzzle Cabinet · js/lib/polycube.js
 *
 * Polycubes: pieces made of unit cubes joined face to face (the Soma pieces,
 * the tetracubes and pentacubes, bricks and blocks) and the figures they
 * build. A cell is [x, y, z] with y pointing up.
 *
 *   Cabinet.Polycube.LIB.T                  a named piece { key, cells, label, name, color }
 *   Cabinet.Polycube.cellsOf('##|#./.#|..')  layers bottom first ('/'), rows back to front ('|')
 *   Cabinet.Polycube.orients(base)          the distinct orientations [{ ri, cells }]
 *   Cabinet.Polycube.solve(target, shapes, { max, nodeLimit, any, fixed })
 *                                           exact cover with Cabinet.DLX; identical pieces are not
 *                                           tried in every order (their count is forced instead)
 *   Cabinet.Polycube.grow(rng, shapes, opts) a random figure built from the pieces (a solution comes with it)
 *   Cabinet.Polycube.views(cells), hull(cells)   the three silhouettes, and every cell they allow
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};

  /* ---------- the 24 turns of space (integer 3x3 matrices, row-major) ---------- */

  function mmul(A, B) {
    const R = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) R[i * 3 + j] = A[i * 3] * B[j] + A[i * 3 + 1] * B[3 + j] + A[i * 3 + 2] * B[6 + j];
    return R;
  }
  const ROT = [], ROTK = {};
  (function () {
    const I3 = [1, 0, 0, 0, 1, 0, 0, 0, 1], RX = [1, 0, 0, 0, 0, -1, 0, 1, 0], RY = [0, 0, 1, 0, 1, 0, -1, 0, 0];
    const q = [I3];
    while (q.length) {
      const m = q.shift(), k = m.join();
      if (k in ROTK) continue;
      ROTK[k] = ROT.length;
      ROT.push(m);
      q.push(mmul(RX, m), mmul(RY, m));
    }
  })();
  const MUL = ROT.map((a) => ROT.map((b) => ROTK[mmul(a, b).join()]));
  const INV = ROT.map((a, i) => MUL[i].indexOf(0));

  // the quarter turn about axis 0 (x), 1 (y) or 2 (z); sign +1 = right-hand rule
  function turn(axis, sign) {
    const s = sign > 0 ? 1 : -1;
    const m = axis === 0 ? [1, 0, 0, 0, 0, -s, 0, s, 0] : axis === 1 ? [0, 0, s, 0, 1, 0, -s, 0, 0] : [0, -s, 0, s, 0, 0, 0, 0, 1];
    return ROTK[m.join()];
  }
  function rot(ri, c) {
    const m = ROT[ri];
    return [m[0] * c[0] + m[1] * c[1] + m[2] * c[2], m[3] * c[0] + m[4] * c[1] + m[5] * c[2], m[6] * c[0] + m[7] * c[1] + m[8] * c[2]];
  }
  // axis and angle (degrees) of a turn, for animating from one orientation to another
  function axisAngle(ri) {
    const m = ROT[ri];
    const tr = m[0] + m[4] + m[8];
    const ang = Math.acos(Math.max(-1, Math.min(1, (tr - 1) / 2)));
    if (ang < 1e-6) return { axis: [0, 1, 0], deg: 0 };
    if (Math.abs(ang - Math.PI) < 1e-6) {
      // half turn: the axis is a column of (M + I)
      const P = [m[0] + 1, m[1], m[2], m[3], m[4] + 1, m[5], m[6], m[7], m[8] + 1];
      let best = null, bl = 0;
      for (let j = 0; j < 3; j++) {
        const v = [P[j], P[3 + j], P[6 + j]], l = Math.hypot(v[0], v[1], v[2]);
        if (l > bl) { bl = l; best = [v[0] / l, v[1] / l, v[2] / l]; }
      }
      return { axis: best, deg: 180 };
    }
    const v = [m[7] - m[5], m[2] - m[6], m[3] - m[1]], l = Math.hypot(v[0], v[1], v[2]);
    return { axis: [v[0] / l, v[1] / l, v[2] / l], deg: ang * 180 / Math.PI };
  }

  /* ---------- cells ---------- */

  const K = (c) => c[0] + ',' + c[1] + ',' + c[2];
  const DIRS6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];

  // 'rows|rows/rows|rows': layers from the bottom up, rows from the back (z = 0) to the front, columns x
  function parse(str) {
    const out = [];
    String(str).split('/').forEach((layer, y) => {
      layer.split('|').forEach((row, z) => {
        for (let x = 0; x < row.length; x++) {
          const ch = row[x];
          if (ch !== '.' && ch !== ' ') out.push({ c: [x, y, z], ch });
        }
      });
    });
    return out;
  }
  function cellsOf(str) { return parse(str).map((e) => e.c); }

  function cmp(a, b) { return a[1] - b[1] || a[2] - b[2] || a[0] - b[0]; }
  function bbox(cells) {
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    cells.forEach((c) => { for (let i = 0; i < 3; i++) { if (c[i] < lo[i]) lo[i] = c[i]; if (c[i] > hi[i]) hi[i] = c[i]; } });
    return { lo, hi, size: [hi[0] - lo[0] + 1, hi[1] - lo[1] + 1, hi[2] - lo[2] + 1] };
  }
  function norm(cells) {
    const b = bbox(cells);
    return cells.map((c) => [c[0] - b.lo[0], c[1] - b.lo[1], c[2] - b.lo[2]]).sort(cmp);
  }
  const keyOf = (cells) => norm(cells).map(K).join(' ');
  const canonCache = new Map();
  function canon(cells) {
    const k0 = keyOf(cells);
    if (canonCache.has(k0)) return canonCache.get(k0);
    let best = null;
    for (let ri = 0; ri < 24; ri++) {
      const k = keyOf(cells.map((c) => rot(ri, c)));
      if (best === null || k < best) best = k;
    }
    canonCache.set(k0, best);
    return best;
  }
  function mirror(cells) { return cells.map((c) => [-c[0], c[1], c[2]]); }
  // how many of the 48 turnings and mirrorings map the figure onto itself
  function symmetries(cells) {
    const k0 = keyOf(cells);
    let n = 0;
    for (const mir of [false, true]) {
      const base = mir ? mirror(cells) : cells;
      for (let ri = 0; ri < 24; ri++) if (keyOf(base.map((c) => rot(ri, c))) === k0) n++;
    }
    return n;
  }
  function congruent(a, b) { return a.length === b.length && canon(a) === canon(b); }

  function connected(cells) {
    if (!cells.length) return false;
    const set = new Set(cells.map(K)), seen = new Set([K(cells[0])]), st = [cells[0]];
    while (st.length) {
      const c = st.pop();
      for (const d of DIRS6) {
        const k = K([c[0] + d[0], c[1] + d[1], c[2] + d[2]]);
        if (set.has(k) && !seen.has(k)) { seen.add(k); st.push(k.split(',').map(Number)); }
      }
    }
    return seen.size === set.size;
  }
  function planar(cells) {
    const b = bbox(cells);
    return b.size.some((s) => s === 1);
  }

  // the piece turned about its middle cell: that cell goes to [0,0,0], so quarter turns keep the piece in place
  function pivoted(cells) {
    const n = cells.length, sorted = cells.slice().sort(cmp);
    const m = [0, 1, 2].map((i) => cells.reduce((s, c) => s + c[i], 0) / n);
    let best = sorted[0], bd = Infinity;
    sorted.forEach((c) => {
      const d = (c[0] - m[0]) ** 2 + (c[1] - m[1]) ** 2 + (c[2] - m[2]) ** 2;
      if (d < bd - 1e-9) { bd = d; best = c; }
    });
    return sorted.map((c) => [c[0] - best[0], c[1] - best[1], c[2] - best[2]]);
  }

  // the distinct orientations of a piece: [{ ri, cells }] where cells = the turned base cells (not shifted)
  const orientCache = new Map();
  function orients(base) {
    const k0 = base.map(K).join(' ');
    if (orientCache.has(k0)) return orientCache.get(k0);
    const seen = new Set(), out = [];
    for (let ri = 0; ri < 24; ri++) {
      const cells = base.map((c) => rot(ri, c));
      const k = keyOf(cells);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({ ri, cells });
    }
    orientCache.set(k0, out);
    return out;
  }
  function place(base, ri, t) { return base.map((c) => { const r = rot(ri, c); return [r[0] + t[0], r[1] + t[1], r[2] + t[2]]; }); }

  // which (ri, t) puts the base on exactly these cells (null if none)
  function fit(base, cells) {
    const want = keyOf(cells);
    const lo = bbox(cells).lo;
    for (const o of orients(base)) {
      if (keyOf(o.cells) !== want) continue;
      const ol = bbox(o.cells).lo;
      return { ri: o.ri, t: [lo[0] - ol[0], lo[1] - ol[1], lo[2] - ol[2]] };
    }
    return null;
  }

  /* ---------- silhouettes ---------- */

  // front: seen from +z (x across, y up); side: seen from -x (z across, y up); top: from above (x across, z down)
  function views(cells) {
    const front = new Set(), side = new Set(), top = new Set();
    cells.forEach((c) => { front.add(c[0] + ',' + c[1]); side.add(c[2] + ',' + c[1]); top.add(c[0] + ',' + c[2]); });
    return { front, side, top };
  }
  // every cell whose three shadows fall inside the three silhouettes
  function hull(cells) {
    const v = views(cells), b = bbox(cells), out = [];
    for (let y = b.lo[1]; y <= b.hi[1]; y++) for (let z = b.lo[2]; z <= b.hi[2]; z++) for (let x = b.lo[0]; x <= b.hi[0]; x++) {
      if (v.front.has(x + ',' + y) && v.side.has(z + ',' + y) && v.top.has(x + ',' + z)) out.push([x, y, z]);
    }
    return out;
  }

  /* ---------- writing a figure (with a label per cell) ---------- */

  function toStr(cells, labels) {
    const b = bbox(cells), map = new Map();
    cells.forEach((c, i) => map.set(K(c), labels ? labels[i] : '#'));
    const layers = [];
    for (let y = b.lo[1]; y <= b.hi[1]; y++) {
      const rows = [];
      for (let z = b.lo[2]; z <= b.hi[2]; z++) {
        let r = '';
        for (let x = b.lo[0]; x <= b.hi[0]; x++) r += map.get(K([x, y, z])) || '.';
        rows.push(r);
      }
      layers.push(rows.join('|'));
    }
    return layers.join('/');
  }

  /* ---------- the pieces ---------- */

  const LIB = {};
  function def(key, str, label, name, color) {
    LIB[key] = { key, cells: cellsOf(str), label: label || key, name: name || key, color: color || null };
  }
  // the seven Soma pieces (Piet Hein): every irregular piece of three or four cubes
  def('V', '##|#.', 'V', 'V · three cubes in a corner', '#ff6b6b');
  def('L', '###|#..', 'L', 'L · four cubes, an L', '#ffb057');
  def('T', '###|.#.', 'T', 'T · four cubes, a T', '#ffd166');
  def('Z', '##.|.##', 'Z', 'Z · four cubes in a zigzag', '#4ecb8d');
  def('A', '##|#./.#|..', 'A', 'A · a twist', '#38d9d3');
  def('B', '##|#./..|#.', 'B', 'B · the mirror twist', '#6c9bff');
  def('P', '##|#./#.|..', 'P', 'P · three arms from one cube', '#b388ff');
  // small pieces and blocks
  def('M1', '#', '1', 'a single cube', '#ff7eb6');
  def('D2', '##', '2', 'two cubes', '#9be15d');
  def('I3', '###', 'I', 'three in a row', '#ffcf9e');
  def('I4', '####', 'I', 'I · four in a row', '#ff7eb6');
  def('O4', '##|##', 'O', 'O · a 2 × 2 square', '#e8d8b0');
  def('K8', '####|####', 'K', 'a 1 × 2 × 4 brick', '#d9a05b');
  def('C8', '##|##/##|##', 'C', 'a 2 × 2 × 2 cube', '#ff6b6b');
  // the twelve flat pentacubes (the pentominoes, given a thickness of one cube)
  def('F5', '.##|##.|.#.', 'F', 'F pentacube');
  def('I5', '#####', 'I', 'I pentacube');
  def('L5', '####|#...', 'L', 'L pentacube');
  def('N5', '##..|.###', 'N', 'N pentacube');
  def('P5', '##|##|#.', 'P', 'P pentacube');
  def('T5', '###|.#.|.#.', 'T', 'T pentacube');
  def('U5', '#.#|###', 'U', 'U pentacube');
  def('V5', '#..|#..|###', 'V', 'V pentacube');
  def('W5', '#..|##.|.##', 'W', 'W pentacube');
  def('X5', '.#.|###|.#.', 'X', 'X pentacube');
  def('Y5', '####|.#..', 'Y', 'Y pentacube');
  def('Z5', '##.|.#.|.##', 'Z', 'Z pentacube');
  // the seventeen pentacubes that do not lie flat (mirror twins counted apart), labelled with Greek letters
  const Q = [
    '...|###/#..|#..', '###|.../.#.|.#.', '###|.../#..|#..', '..#|###/...|#..', '.#.|###/...|#..',
    '###|#../#..|...', '##|#./##|..', '###|..#/#..|...', '###|.#./#..|...', '##|.#/#.|.#',
    '.#|.#/..|##/..|#.', '.#|##|#./..|#.|..', '.#|../.#|##/..|#.', '.#|.#/##|../#.|..', '###|.#./.#.|...',
    '.#|../##|#./#.|..', '..|.#/##|.#/#.|..'
  ];
  const GREEK = 'αβγδεζηθικλμνξπρσ';
  Q.forEach((s, i) => def('Q' + (i + 1), s, GREEK[i], GREEK[i] + ' pentacube'));

  const PALETTE = ['#ff6b6b', '#ffb057', '#ffd166', '#4ecb8d', '#38d9d3', '#6c9bff', '#b388ff', '#ff7eb6', '#9be15d', '#e8a07a',
    '#5fc9f0', '#e07cff', '#8fd3c1', '#ffcf9e', '#a0a8ff', '#d4d96a', '#f08a8a', '#c3b1e1', '#7fd6a0', '#f2c14e'];

  function pieceCells(spec) {
    if (LIB[spec]) return LIB[spec].cells;
    return cellsOf(spec);
  }

  /* ---------- exact cover ---------- */

  /* target: cells; shapes: base cells per piece (any translation);
   * opts: { max, nodeLimit, any: pieces optional, fixed: { index: cells } (already placed), shuffle: rng }
   * -> { sols: [[{ ri, t } per piece index (fixed pieces left out)]], aborted, nodes } */
  function solve(target, shapes, opts) {
    opts = opts || {};
    const idx = new Map();
    target.forEach((c, i) => idx.set(K(c), i));
    const fixed = opts.fixed || {};
    const used = new Uint8Array(target.length);
    for (const i in fixed) {
      for (const c of fixed[i]) {
        const j = idx.get(K(c));
        if (j == null || used[j]) return { sols: [], aborted: false, nodes: 0, bad: true };
        used[j] = 1;
      }
    }
    const col = new Int32Array(target.length).fill(-1);
    let P = 0;
    target.forEach((c, i) => { if (!used[i]) col[i] = P++; });
    const free = [];
    shapes.forEach((s, i) => { if (!(i in fixed)) free.push(i); });
    let total = 0;
    free.forEach((i) => { total += shapes[i].length; });
    if (!opts.any && total !== P) return { sols: [], aborted: false, nodes: 0 };
    if (opts.any && total < P) return { sols: [], aborted: false, nodes: 0 };
    const typeOf = {}, groups = new Map();
    free.forEach((i) => {
      const k = canon(shapes[i]);
      typeOf[i] = k;
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(i);
    });
    // the type with the most copies needs no piece columns: its count is forced by the cells left over
    let dropKey = null;
    if (!opts.any) {
      let best = 1;
      groups.forEach((g, k) => { if (g.length > best) { best = g.length; dropKey = k; } });
    }
    let primary = P, secondary = 0;
    const pcol = {};
    free.forEach((i) => {
      if (typeOf[i] === dropKey) return;
      if (opts.any) pcol[i] = 'S' + (secondary++);
      else pcol[i] = primary++;
    });
    if (opts.any) for (const i in pcol) pcol[i] = primary + Number(pcol[i].slice(1));
    const rows = [], meta = [];
    const doneDrop = { v: false };
    free.forEach((i) => {
      if (typeOf[i] === dropKey) { if (doneDrop.v) return; doneDrop.v = true; }
      for (const o of orients(shapes[i])) {
        const a = o.cells[0];
        for (let g = 0; g < target.length; g++) {
          if (used[g]) continue;
          const tg = target[g], t = [tg[0] - a[0], tg[1] - a[1], tg[2] - a[2]];
          const cols = [];
          let ok = true;
          for (const c of o.cells) {
            const j = idx.get((c[0] + t[0]) + ',' + (c[1] + t[1]) + ',' + (c[2] + t[2]));
            if (j == null || used[j]) { ok = false; break; }
            cols.push(col[j]);
          }
          if (!ok) continue;
          if (pcol[i] != null) cols.push(pcol[i]);
          rows.push(cols);
          meta.push({ i: typeOf[i] === dropKey ? -1 : i, ri: o.ri, t });
        }
      }
    });
    const res = C.DLX.solve({ primary, secondary, rows, max: opts.max || 1, nodeLimit: opts.nodeLimit || 2e6, shuffle: opts.shuffle });
    const dropList = dropKey ? groups.get(dropKey) : [];
    const sols = res.map((rs) => {
      const s = {};
      let d = 0;
      rs.forEach((r) => {
        const m = meta[r];
        const i = m.i >= 0 ? m.i : dropList[d++];
        s[i] = { ri: m.ri, t: m.t };
      });
      return s;
    });
    return { sols, aborted: !!res.aborted, nodes: res.nodes || 0 };
  }

  /* ---------- growing a random figure from the pieces ---------- */

  /* shapes: base cells per piece; opts: { maxH, maxW, maxD, spread (0 tidy .. 1 wild), order }
   * -> { cells, place: [{ ri, t }] } (a solution comes with the figure) or null */
  function grow(rng, shapes, opts) {
    opts = opts || {};
    const maxH = opts.maxH || 3, maxW = opts.maxW || 4, maxD = opts.maxD || 4, spread = opts.spread == null ? 0.3 : opts.spread;
    const occ = new Map();
    const place0 = [];
    const order = opts.order || rng.shuffle(shapes.map((s, i) => i)).sort((a, b) => shapes[b].length - shapes[a].length + (rng() - 0.5) * 0.1);
    let lo = null, hi = null;
    const within = (cells) => {
      const l = lo ? lo.slice() : [Infinity, Infinity, Infinity], h = hi ? hi.slice() : [-Infinity, -Infinity, -Infinity];
      for (const c of cells) for (let k = 0; k < 3; k++) { if (c[k] < l[k]) l[k] = c[k]; if (c[k] > h[k]) h[k] = c[k]; }
      if (l[1] < 0) return null;
      if (h[0] - l[0] + 1 > maxW || h[1] - l[1] + 1 > maxH || h[2] - l[2] + 1 > maxD) return null;
      return { l, h };
    };
    for (let n = 0; n < order.length; n++) {
      const i = order[n];
      const os = orients(shapes[i]);
      let best = null, bestScore = -Infinity;
      if (n === 0) {
        // the first piece: lying low if it can
        const fits = os.map((o) => {
          const b = bbox(o.cells), t = [-b.lo[0], -b.lo[1], -b.lo[2]];
          const cells = o.cells.map((c) => [c[0] + t[0], c[1] + t[1], c[2] + t[2]]);
          return { ri: o.ri, t, cells, w: within(cells), h: b.size[1] };
        }).filter((f) => f.w);
        if (!fits.length) return null;
        const low = Math.min.apply(null, fits.map((f) => f.h));
        const pool = rng() < 0.75 ? fits.filter((f) => f.h === low) : fits;
        best = pool[rng.int(pool.length)];
      } else {
        // empty cells next to the figure
        const front = new Map();
        occ.forEach((v, k) => {
          const c = k.split(',').map(Number);
          for (const d of DIRS6) {
            const e = [c[0] + d[0], c[1] + d[1], c[2] + d[2]];
            if (e[1] < 0) continue;
            const ek = K(e);
            if (!occ.has(ek)) front.set(ek, e);
          }
        });
        const seen = new Set();
        for (const o of os) {
          for (const f of front.values()) {
            for (const a of o.cells) {
              const t = [f[0] - a[0], f[1] - a[1], f[2] - a[2]];
              const sk = o.ri + ':' + t.join(',');
              if (seen.has(sk)) continue;
              seen.add(sk);
              const cells = o.cells.map((c) => [c[0] + t[0], c[1] + t[1], c[2] + t[2]]);
              if (cells.some((c) => occ.has(K(c)))) continue;
              const w = within(cells);
              if (!w) continue;
              let contact = 0, support = 0, hang = 0;
              const mine = new Set(cells.map(K));
              for (const c of cells) {
                for (const d of DIRS6) if (occ.has(K([c[0] + d[0], c[1] + d[1], c[2] + d[2]]))) contact++;
                const below = K([c[0], c[1] - 1, c[2]]);
                if (c[1] === 0 || occ.has(below)) support++;
                else if (!mine.has(below)) hang++;
              }
              const vol = (w.h[0] - w.l[0] + 1) * (w.h[1] - w.l[1] + 1) * (w.h[2] - w.l[2] + 1);
              const score = contact * (1.2 - spread) + support * 0.6 - hang * (1 - spread) * 0.9 - vol * 0.04 * (1 - spread) + rng() * (0.6 + spread * 4);
              if (score > bestScore) { bestScore = score; best = { ri: o.ri, t, cells, w }; }
            }
          }
        }
        if (!best) return null;
      }
      best.cells.forEach((c) => occ.set(K(c), i));
      lo = best.w.l; hi = best.w.h;
      place0[i] = { ri: best.ri, t: best.t };
    }
    // shift so the figure stands on the floor at the origin
    const sh = [-lo[0], -lo[1], -lo[2]];
    const place = place0.map((p) => ({ ri: p.ri, t: [p.t[0] + sh[0], p.t[1] + sh[1], p.t[2] + sh[2]] }));
    const cells = [];
    occ.forEach((v, k) => { const c = k.split(',').map(Number); cells.push([c[0] + sh[0], c[1] + sh[1], c[2] + sh[2]]); });
    cells.sort(cmp);
    return { cells, place };
  }

  // the figure string with each cell marked by the index of its piece
  const CH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function solString(shapes, place) {
    const cells = [], labels = [];
    place.forEach((pl, i) => {
      if (!pl) return;
      place1(shapes[i], pl).forEach((c) => { cells.push(c); labels.push(CH[i]); });
    });
    return toStr(cells, labels);
  }
  function place1(base, pl) { return place(base, pl.ri, pl.t); }

  C.Polycube = {
    ROT, MUL, INV, turn, rot, axisAngle, K, DIRS6, CH, PALETTE,
    parse, cellsOf, bbox, norm, keyOf, canon, mirror, symmetries, congruent, connected, planar, pivoted,
    orients, place, fit, views, hull, toStr, solString,
    LIB, pieceCells, solve, grow
  };
})(typeof window !== 'undefined' ? window : globalThis);
