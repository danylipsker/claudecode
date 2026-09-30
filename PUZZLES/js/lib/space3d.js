/* The Puzzle Cabinet · js/lib/space3d.js
 *
 * Shared pieces for the Space & 3D shelf (engines/nets.js, engines/cubes.js):
 *
 *   rotations    the 24 turns of a cube as integer matrices; quaternions
 *   polycubes    canonical forms, "same or mirror", painted faces
 *   symbols      the pictures printed on faces (arrows, letters, pips …),
 *                drawn on a canvas decal or into SVG, with their symmetry
 *   labelled cubes   a cube whose six faces carry symbols; equal up to turning
 *   nets         squares or triangles joined edge to edge; folding them
 *                (a transform per face at any fold fraction), whether they
 *                close up into a cube / tetrahedron / octahedron, which face
 *                lands where; every hexomino and polyiamond
 *   svg          a small painter's renderer that turns 3D faces into SVG
 *                (the flat "printed page" view and the family thumbnails)
 *   raster       an exact software z-buffer, to know what a view hides
 *   Stage        (browser) the 3D scene on the workbench: several objects,
 *                each turned by dragging it, labels, zoom that keeps the
 *                perspective, locking, animation
 *
 * Everything but Stage is node-safe (the checking tools use it).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const S = C.space = C.space || {};

  /* ---------- small vectors ---------- */

  const vadd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const vmul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const vdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const vlen = (a) => Math.hypot(a[0], a[1], a[2]);
  const vnorm = (a) => { const l = vlen(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  S.v = { add: vadd, sub: vsub, mul: vmul, dot: vdot, cross: vcross, len: vlen, norm: vnorm };

  /* ---------- the 24 rotations of the cube ---------- */

  // the six axis directions; faces of a cube are named by their outward normal
  const DIR6 = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const FACE_KEYS = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  S.DIR6 = DIR6;
  S.FACE_KEYS = FACE_KEYS;
  S.dirIndex = function (v) {
    const x = Math.round(v[0]), y = Math.round(v[1]), z = Math.round(v[2]);
    if (x === 1) return 0; if (x === -1) return 1;
    if (y === 1) return 2; if (y === -1) return 3;
    if (z === 1) return 4; if (z === -1) return 5;
    return -1;
  };
  const opp = (i) => i ^ 1; // DIR6 pairs: 0/1, 2/3, 4/5
  S.oppDir = opp;

  const mv = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  const mm = (a, b) => {
    const r = new Array(9);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) r[i * 3 + j] = a[i * 3] * b[j] + a[i * 3 + 1] * b[3 + j] + a[i * 3 + 2] * b[6 + j];
    return r;
  };
  const det3 = (m) => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
  const transpose = (m) => [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]];
  S.mv = mv; S.mm = mm; S.transpose = transpose;

  const ROTS = [];
  [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].forEach((p) => {
    for (let s = 0; s < 8; s++) {
      const m = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let i = 0; i < 3; i++) m[i * 3 + p[i]] = (s >> i) & 1 ? -1 : 1;
      if (det3(m) === 1) ROTS.push(m);
    }
  });
  S.ROTS = ROTS; // ROTS[0] is the identity
  S.MIRROR = [-1, 0, 0, 0, 1, 0, 0, 0, 1];

  // the quarter turn about an axis (0 x, 1 y, 2 z), k times, right-hand rule
  S.quarter = function (axis, k) {
    let m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    const q = [
      [1, 0, 0, 0, 0, -1, 0, 1, 0],
      [0, 0, 1, 0, 1, 0, -1, 0, 0],
      [0, -1, 0, 1, 0, 0, 0, 0, 1]
    ][axis];
    for (let i = 0; i < ((k % 4) + 4) % 4; i++) m = mm(q, m);
    return m;
  };

  /* ---------- quaternions (for turning objects smoothly) ---------- */

  const Q = {
    id: () => [1, 0, 0, 0],
    axis(deg, a) { const h = deg * Math.PI / 360, s = Math.sin(h), n = vnorm(a); return [Math.cos(h), n[0] * s, n[1] * s, n[2] * s]; },
    mul(a, b) {
      return [
        a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
        a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
        a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
        a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]
      ];
    },
    norm(a) { const l = Math.hypot(a[0], a[1], a[2], a[3]) || 1; return [a[0] / l, a[1] / l, a[2] / l, a[3] / l]; },
    // 3x3 rotation matrix (row-major)
    mat(q) {
      const [w, x, y, z] = q;
      return [
        1 - 2 * (y * y + z * z), 2 * (x * y - w * z), 2 * (x * z + w * y),
        2 * (x * y + w * z), 1 - 2 * (x * x + z * z), 2 * (y * z - w * x),
        2 * (x * z - w * y), 2 * (y * z + w * x), 1 - 2 * (x * x + y * y)
      ];
    },
    fromMat(m) {
      const tr = m[0] + m[4] + m[8];
      let w, x, y, z;
      if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = s / 4; x = (m[7] - m[5]) / s; y = (m[2] - m[6]) / s; z = (m[3] - m[1]) / s; }
      else if (m[0] > m[4] && m[0] > m[8]) { const s = Math.sqrt(1 + m[0] - m[4] - m[8]) * 2; w = (m[7] - m[5]) / s; x = s / 4; y = (m[1] + m[3]) / s; z = (m[2] + m[6]) / s; }
      else if (m[4] > m[8]) { const s = Math.sqrt(1 + m[4] - m[0] - m[8]) * 2; w = (m[2] - m[6]) / s; x = (m[1] + m[3]) / s; y = s / 4; z = (m[5] + m[7]) / s; }
      else { const s = Math.sqrt(1 + m[8] - m[0] - m[4]) * 2; w = (m[3] - m[1]) / s; x = (m[2] + m[6]) / s; y = (m[5] + m[7]) / s; z = s / 4; }
      return Q.norm([w, x, y, z]);
    },
    slerp(a, b, t) {
      let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
      if (d < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; d = -d; }
      if (d > 0.9995) return Q.norm([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t]);
      const th = Math.acos(d), s = Math.sin(th), ka = Math.sin((1 - t) * th) / s, kb = Math.sin(t * th) / s;
      return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb, a[3] * ka + b[3] * kb];
    },
    // the turntable orientation used everywhere: yaw about the object's up, then pitch toward the viewer
    ypr(yaw, pitch) { return Q.mul(Q.axis(pitch, [1, 0, 0]), Q.axis(yaw, [0, 1, 0])); }
  };
  S.Q = Q;
  // a 3x3 matrix -> the 3x4 matrix of view3d.js
  S.m34 = (m, t) => [m[0], m[1], m[2], t ? t[0] : 0, m[3], m[4], m[5], t ? t[1] : 0, m[6], m[7], m[8], t ? t[2] : 0];
  // yaw / pitch -> 3x3
  S.ypMat = (yaw, pitch) => Q.mat(Q.ypr(yaw, pitch));

  /* ---------- polycubes ---------- */

  const cellKey = (c) => c[0] + ',' + c[1] + ',' + c[2];
  S.cellKey = cellKey;
  // translate so the smallest x, y, z are 0 and sort: a key that ignores position
  S.normCells = function (cells) {
    let x0 = Infinity, y0 = Infinity, z0 = Infinity;
    cells.forEach((c) => { x0 = Math.min(x0, c[0]); y0 = Math.min(y0, c[1]); z0 = Math.min(z0, c[2]); });
    return cells.map((c) => [c[0] - x0, c[1] - y0, c[2] - z0]).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  };
  S.shapeKey = (cells) => S.normCells(cells).map(cellKey).join(';');
  S.rotCells = (cells, m) => cells.map((c) => mv(m, c));
  // the same key for a shape however it is turned
  S.canonShape = function (cells) {
    let best = null;
    for (const R of ROTS) {
      const k = S.shapeKey(S.rotCells(cells, R));
      if (best === null || k < best) best = k;
    }
    return best;
  };
  S.mirrorCells = (cells) => cells.map((c) => [-c[0], c[1], c[2]]);
  S.isChiral = (cells) => S.canonShape(cells) !== S.canonShape(S.mirrorCells(cells));
  // which turn carries shape a onto shape b (after moving it): { R, t } with b = R·a + t, or null
  S.findTurn = function (a, b) {
    const kb = S.shapeKey(b);
    const nb = S.normCells(b);
    for (const R of ROTS) {
      const ra = S.rotCells(a, R);
      if (S.shapeKey(ra) !== kb) continue;
      const na = S.normCells(ra);
      // offset between the two normalisations
      let mx = Infinity, my = Infinity, mz = Infinity, bx = Infinity, by = Infinity, bz = Infinity;
      ra.forEach((c) => { mx = Math.min(mx, c[0]); my = Math.min(my, c[1]); mz = Math.min(mz, c[2]); });
      b.forEach((c) => { bx = Math.min(bx, c[0]); by = Math.min(by, c[1]); bz = Math.min(bz, c[2]); });
      if (na.length === nb.length) return { R, t: [bx - mx, by - my, bz - mz] };
    }
    return null;
  };
  // face-connected?
  S.connected = function (cells) {
    if (!cells.length) return false;
    const set = new Set(cells.map(cellKey));
    const seen = new Set([cellKey(cells[0])]);
    const stack = [cells[0]];
    while (stack.length) {
      const c = stack.pop();
      for (const d of DIR6) {
        const n = [c[0] + d[0], c[1] + d[1], c[2] + d[2]], k = cellKey(n);
        if (set.has(k) && !seen.has(k)) { seen.add(k); stack.push(n); }
      }
    }
    return seen.size === set.size;
  };
  // how many faces of each cube are on the outside (painted), optionally not the bottom (y = min)
  S.paintCounts = function (cells, opts) {
    opts = opts || {};
    const set = new Set(cells.map(cellKey));
    let y0 = Infinity;
    cells.forEach((c) => { y0 = Math.min(y0, c[1]); });
    return cells.map((c) => {
      let n = 0;
      DIR6.forEach((d, i) => {
        if (set.has(cellKey([c[0] + d[0], c[1] + d[1], c[2] + d[2]]))) return;
        if (opts.skip && opts.skip(c, i, y0)) return;
        n++;
      });
      return n;
    });
  };

  /* ---------- symbols printed on faces ---------- */

  // paths in a 100 × 100 box centred on 0, y down; order = how many quarter turns leave it unchanged-looking (1, 2 or 4)
  function starPath(r1, r2, n) {
    let d = '';
    for (let i = 0; i < n * 2; i++) {
      const a = -Math.PI / 2 + i * Math.PI / n, r = i % 2 ? r2 : r1;
      d += (i ? 'L' : 'M') + Math.round(Math.cos(a) * r * 10) / 10 + ' ' + Math.round(Math.sin(a) * r * 10) / 10;
    }
    return d + 'Z';
  }
  const circ = (x, y, r) => 'M' + (x - r) + ' ' + y + 'A' + r + ' ' + r + ' 0 1 0 ' + (x + r) + ' ' + y + 'A' + r + ' ' + r + ' 0 1 0 ' + (x - r) + ' ' + y + 'Z';
  const pips = (list) => list.map((p) => circ(p[0], p[1], 11)).join('');
  const P = 24;
  const SYM = {
    arrow: { d: 'M0-40L30-8H11V38H-11V-8H-30Z', o: 1, c: '#d9483f', name: 'an arrow' },
    tri: { d: 'M0-36L34 30H-34Z', o: 1, c: '#2f7fd0', name: 'a triangle' },
    heart: { d: 'M0 34C-26 14-42 0-42-15C-42-30-30-39-18-39C-8-39-2-33 0-27C2-33 8-39 18-39C30-39 42-30 42-15C42 0 26 14 0 34Z', o: 1, c: '#e0457b', name: 'a heart' },
    star: { d: starPath(40, 17, 5), o: 1, c: '#e0a100', name: 'a star' },
    moon: { d: 'M12-35A37 37 0 1 0 12 35A35 35 0 0 1 12-35Z', o: 1, c: '#6c5ce7', name: 'a moon' },
    half: { d: 'M-50-50H50V0H-50Z', o: 1, c: '#2f9e8f', name: 'a half-shaded face' },
    corner: { d: 'M-50-50H50L-50 50Z', o: 1, c: '#e07a2f', name: 'a shaded corner' },
    quarter: { d: 'M-50-50H14A64 64 0 0 1-50 14Z', o: 1, c: '#5b6bd6', name: 'a quarter circle' },
    flag: { d: 'M-24-38H-13V-32L30-14L-13 4V38H-24Z', o: 1, c: '#d0413b', name: 'a flag' },
    bolt: { d: 'M10-42L-26 6H-3L-12 42L26-8H3L16-42Z', o: 1, c: '#d99a00', name: 'a lightning bolt' },
    dot: { d: circ(0, 0, 17), o: 4, c: '#2d3561', name: 'a dot' },
    ring: { d: circ(0, 0, 29) + 'M-17 0A17 17 0 1 1 17 0A17 17 0 1 1-17 0Z', o: 4, c: '#2f9e8f', name: 'a ring' },
    plus: { d: 'M-10-34H10V-10H34V10H10V34H-10V10H-34V-10H-10Z', o: 4, c: '#d0413b', name: 'a plus sign' },
    times: { d: 'M-24-38L0-14L24-38L38-24L14 0L38 24L24 38L0 14L-24 38L-38 24L-14 0L-38-24Z', o: 4, c: '#7a4fd0', name: 'a cross' },
    square: { d: 'M-22-22H22V22H-22Z', o: 4, c: '#2f7fd0', name: 'a square' },
    bar: { d: 'M-38-10H38V10H-38Z', o: 2, c: '#2f7fd6', name: 'a bar' },
    diag: { d: 'M-50-50H-22L50 22V50H22L-50-22Z', o: 2, c: '#c07a10', name: 'a stripe' },
    d1: { d: pips([[0, 0]]), o: 4, c: '#c0392b', name: 'one pip' },
    d2: { d: pips([[-P, -P], [P, P]]), o: 2, c: '#20263f', name: 'two pips' },
    d3: { d: pips([[-P, -P], [0, 0], [P, P]]), o: 2, c: '#20263f', name: 'three pips' },
    d4: { d: pips([[-P, -P], [P, -P], [-P, P], [P, P]]), o: 4, c: '#20263f', name: 'four pips' },
    d5: { d: pips([[-P, -P], [P, -P], [0, 0], [-P, P], [P, P]]), o: 4, c: '#20263f', name: 'five pips' },
    d6: { d: pips([[-P, -26], [-P, 0], [-P, 26], [P, -26], [P, 0], [P, 26]]), o: 2, c: '#20263f', name: 'six pips' }
  };
  S.SYM = SYM;
  const LETTER_ORDER2 = 'HINOSXZ08';
  const LETTER_ORDER4 = '';
  S.symOrder = function (id) {
    if (id == null) return 4;
    if (SYM[id]) return SYM[id].o;
    if (id.length === 1) return LETTER_ORDER4.includes(id) ? 4 : LETTER_ORDER2.includes(id) ? 2 : 1;
    if (/^c:/.test(id)) return 4; // a plain colour
    return 1;
  };
  S.symName = function (id) {
    if (SYM[id]) return SYM[id].name;
    if (/^c:/.test(id)) return 'the ' + (S.COLOR_NAMES[id.slice(2)] || 'coloured') + ' face';
    return '“' + id + '”';
  };
  // face colours for puzzles about colours; paper for printed faces
  S.PAPER = '#f6f1e4';
  S.PAPER_BACK = '#cfc6b0';
  S.INK = '#27305c';
  S.COLORS = { r: '#ef6b63', o: '#f5a14a', y: '#f2d15a', g: '#5cc98a', b: '#5aa2ee', p: '#a684f2', k: '#f07fb5', t: '#4fcfc6' };
  S.COLOR_NAMES = { r: 'red', o: 'orange', y: 'yellow', g: 'green', b: 'blue', p: 'purple', k: 'pink', t: 'teal' };
  S.faceColor = (id) => (id && /^c:/.test(id) ? S.COLORS[id.slice(2)] || S.PAPER : S.PAPER);
  S.symColor = (id) => (SYM[id] ? SYM[id].c : S.INK);

  // draw a symbol on a canvas face decal (unit square, v up the face), turned rot quarter turns clockwise
  const pathCache = {};
  S.drawSym = function (ctx, id, rot, lit, color) {
    if (id == null || /^c:/.test(id)) return;
    ctx.save();
    ctx.translate(0.5, 0.5);
    ctx.scale(0.01, -0.01);
    ctx.rotate((rot || 0) * Math.PI / 2);
    const k = lit == null ? 1 : Math.min(1.1, 0.55 + lit * 0.55);
    ctx.fillStyle = shadeHex(color || S.symColor(id), k);
    if (SYM[id]) {
      const p = pathCache[id] || (pathCache[id] = new root.Path2D(SYM[id].d));
      ctx.fill(p, 'evenodd');
    } else {
      ctx.font = 'bold 66px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(id), 0, 4);
    }
    ctx.restore();
  };
  // the same symbol as SVG markup in its 100-box frame (y down), turned
  S.symSVG = function (id, rot, color) {
    if (id == null || /^c:/.test(id)) return '';
    const col = color || S.symColor(id);
    const t = rot ? ' transform="rotate(' + (rot * 90) + ')"' : '';
    if (SYM[id]) return '<path d="' + SYM[id].d + '" fill="' + col + '" fill-rule="evenodd"' + t + '/>';
    return '<text x="0" y="23" text-anchor="middle" font-size="66" font-weight="700" font-family="Segoe UI, system-ui, sans-serif" fill="' + col + '"' + t + '>' + C.esc(String(id)) + '</text>';
  };
  function shadeHex(c, k) {
    const n = parseInt(c.slice(1), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    return 'rgb(' + f((n >> 16) & 255) + ',' + f((n >> 8) & 255) + ',' + f(n & 255) + ')';
  }
  S.shadeHex = shadeHex;

  /* ---------- labelled cubes ----------
   * lab[f] = [symbol, up] for the face with normal DIR6[f]; up = index into DIR6
   * (the direction the top of the symbol points), perpendicular to the face. */

  S.rotLab = function (lab, R) {
    const out = new Array(6);
    lab.forEach((e, f) => {
      if (!e) return;
      const nf = S.dirIndex(mv(R, DIR6[f]));
      out[nf] = [e[0], e[1] == null ? null : S.dirIndex(mv(R, DIR6[e[1]]))];
    });
    return out;
  };
  // the up direction as far as the eye can tell (symmetric symbols forget some of it)
  function upKey(sym, up) {
    const o = S.symOrder(sym);
    if (o === 4 || up == null) return '*';
    if (o === 2) return String(Math.min(up, opp(up)));
    return String(up);
  }
  S.upKey = upKey;
  const labKey = (lab) => lab.map((e) => (e ? e[0] + ':' + upKey(e[0], e[1]) : '-')).join('|');
  S.labKey = labKey;
  S.canonLab = function (lab) {
    let best = null;
    for (const R of ROTS) {
      const k = labKey(S.rotLab(lab, R));
      if (best === null || k < best) best = k;
    }
    return best;
  };
  S.sameLab = (a, b) => S.canonLab(a) === S.canonLab(b);
  // the turn R with rotLab(a, R) looking exactly like b (or -1)
  S.labTurn = function (a, b) {
    const kb = labKey(b);
    for (let i = 0; i < ROTS.length; i++) if (labKey(S.rotLab(a, ROTS[i])) === kb) return i;
    return -1;
  };
  // could the cube `lab`, turned somehow, show exactly these faces? partial = { f: [sym, up] }
  S.partialPossible = function (lab, partial) {
    const fs = Object.keys(partial).map(Number);
    for (const R of ROTS) {
      const r = S.rotLab(lab, R);
      if (fs.every((f) => r[f] && r[f][0] === partial[f][0] && upKey(r[f][0], r[f][1]) === upKey(partial[f][0], partial[f][1]))) return true;
    }
    return false;
  };
  // the direction "up" on a face for a picture turned rot quarter turns, given the face's base up and normal
  S.turnUp = function (n, up, rot) {
    // turning the picture clockwise as seen from outside: up -> right -> down -> left, right = up × n
    let u = DIR6[up];
    const N = DIR6[n];
    for (let i = 0; i < ((rot % 4) + 4) % 4; i++) u = vcross(u, N);
    return S.dirIndex(u);
  };
  // how many quarter turns (clockwise, seen from outside) take base up b to up u on face n
  S.rotBetween = function (n, b, u) {
    for (let r = 0; r < 4; r++) if (S.turnUp(n, b, r) === u) return r;
    return 0;
  };
  // a natural "up" for each face when a cube is drawn: sides point up (+y); top and bottom point back (-z) / forward
  S.BASE_UP = [2, 2, 5, 4, 2, 2];

  /* ---------- nets ----------
   * net = { g: 's' | 't', c: [[x, y], …], l: [[symbol, rot] | symbol | null, …] }
   * Squares: cell (x, y) is the unit square with its top-left corner there (y down).
   * Triangles: cell (x, y) is in row y; it points up when x + y is even. */

  const H3 = Math.sqrt(3) / 2;
  S.H3 = H3;
  S.cellPoly = function (g, c) {
    const [x, y] = c;
    if (g !== 't') return [[x, y], [x + 1, y], [x + 1, y + 1], [x, y + 1]];
    if (((x + y) % 2 + 2) % 2 === 0) return [[x / 2 + 0.5, y * H3], [x / 2 + 1, (y + 1) * H3], [x / 2, (y + 1) * H3]];
    return [[x / 2, y * H3], [x / 2 + 1, y * H3], [x / 2 + 0.5, (y + 1) * H3]];
  };
  S.netPolys = (net) => net.c.map((c) => S.cellPoly(net.g, c));
  const pkey = (p) => Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000);
  const centroid2 = (poly) => { let x = 0, y = 0; poly.forEach((p) => { x += p[0]; y += p[1]; }); return [x / poly.length, y / poly.length]; };
  S.centroid2 = centroid2;
  // neighbours: [{ a, b, edge: [p, q] }] for every pair sharing an edge
  S.netAdj = function (net) {
    const polys = S.netPolys(net);
    const edges = new Map(), out = [];
    polys.forEach((poly, i) => {
      poly.forEach((p, k) => {
        const q = poly[(k + 1) % poly.length];
        const key = [pkey(p), pkey(q)].sort().join('|');
        if (edges.has(key)) out.push({ a: edges.get(key), b: i, edge: [p, q] });
        else edges.set(key, i);
      });
    });
    return out;
  };
  S.netConnected = function (net) {
    const n = net.c.length;
    if (!n) return false;
    const adj = S.netAdj(net), seen = new Set([0]), stack = [0];
    while (stack.length) {
      const i = stack.pop();
      adj.forEach((e) => {
        const j = e.a === i ? e.b : e.b === i ? e.a : -1;
        if (j >= 0 && !seen.has(j)) { seen.add(j); stack.push(j); }
      });
    }
    return seen.size === n;
  };

  const SOLIDS = {
    cube: { faces: 6, grid: 's', angle: 90, name: 'cube' },
    tetra: { faces: 4, grid: 't', angle: 180 - Math.acos(1 / 3) * 180 / Math.PI, name: 'tetrahedron' },
    octa: { faces: 8, grid: 't', angle: 180 - Math.acos(-1 / 3) * 180 / Math.PI, name: 'octahedron' }
  };
  S.SOLIDS = SOLIDS;
  S.solidOf = (net) => (net.g === 't' ? (net.c.length === 4 ? 'tetra' : 'octa') : 'cube');

  // the folding plan: a spanning tree from the root, each child hinged on the edge it shares with its parent
  S.foldPlan = function (net, root) {
    const polys = S.netPolys(net), n = polys.length;
    const adj = S.netAdj(net);
    if (root == null) {
      // the root is the face nearest the middle with the most neighbours: it becomes the top
      const deg = new Array(n).fill(0);
      adj.forEach((e) => { deg[e.a]++; deg[e.b]++; });
      const all = polys.map(centroid2);
      const mid = centroid2(all);
      root = 0;
      for (let i = 1; i < n; i++) {
        const di = Math.hypot(all[i][0] - mid[0], all[i][1] - mid[1]), dr = Math.hypot(all[root][0] - mid[0], all[root][1] - mid[1]);
        if (deg[i] > deg[root] || (deg[i] === deg[root] && di < dr - 1e-9)) root = i;
      }
    }
    const parent = new Array(n).fill(-1), hinge = new Array(n).fill(null), order = [root];
    const seen = new Set([root]);
    for (let k = 0; k < order.length; k++) {
      const i = order[k];
      adj.forEach((e) => {
        const j = e.a === i ? e.b : e.b === i ? e.a : -1;
        if (j < 0 || seen.has(j)) return;
        seen.add(j);
        parent[j] = i;
        hinge[j] = e.edge;
        order.push(j);
      });
    }
    return { root, parent, hinge, order, polys, n, solid: S.solidOf(net), complete: order.length === n };
  };

  // 3x4 transforms (view3d.js M4 layout) for every face at fold fraction t (0 flat … 1 closed).
  // The net lies on the plane y = 0 with its printed side up (+y); the flaps fold down and the
  // whole thing is lifted so it rests on y = 0, ending with the root face on top.
  S.foldMats = function (plan, t, angle) {
    const M4 = C.M4;
    const ang = (angle == null ? SOLIDS[plan.solid].angle : angle) * t;
    const mats = new Array(plan.n);
    mats[plan.root] = M4.id();
    for (let k = 1; k < plan.order.length; k++) {
      const j = plan.order[k], p = plan.parent[j];
      const [a, b] = plan.hinge[j];
      const A = [a[0], 0, a[1]], B = [b[0], 0, b[1]];
      const cj = centroid2(plan.polys[j]);
      const mid = [(a[0] + b[0]) / 2, 0, (a[1] + b[1]) / 2];
      const d = [cj[0] - mid[0], 0, cj[1] - mid[2]];
      const axis = vcross([0, 1, 0], d);
      // keep the axis along the edge (it is, for regular polygons; this makes it exact)
      const e = vnorm(vsub(B, A));
      const ax = vdot(axis, e) >= 0 ? e : vmul(e, -1);
      mats[j] = M4.mul(mats[p], M4.rotate(ang, ax, A));
    }
    // lift so the lowest corner rests on the table
    let lo = 0;
    plan.order.forEach((i) => plan.polys[i].forEach((q) => { lo = Math.min(lo, M4.apply(mats[i], [q[0], 0, q[1]])[1]); }));
    if (lo < 0) { const T = M4.translate(0, -lo, 0); plan.order.forEach((i) => { mats[i] = M4.mul(T, mats[i]); }); }
    return mats;
  };

  // fold the whole way: where does every face land? { ok, clash: [[i, j]…], lab (cubes), normals, opposite: [..] }
  S.foldNet = function (net, root) {
    const plan = S.foldPlan(net, root);
    const sol = SOLIDS[plan.solid];
    const out = { plan, solid: plan.solid, ok: false, clash: [], normals: [], cents: [] };
    if (!plan.complete) { out.why = 'apart'; return out; }
    if (net.c.length !== sol.faces) { out.why = 'count'; return out; }
    const mats = S.foldMats(plan, 1);
    const M4 = C.M4;
    const keys = [];
    plan.polys.forEach((poly, i) => {
      const m = mats[i];
      const c2 = centroid2(poly);
      const c3 = M4.apply(m, [c2[0], 0, c2[1]]);
      const n3 = M4.applyDir(m, [0, 1, 0]);
      out.cents[i] = c3;
      out.normals[i] = n3.map((v) => Math.round(v * 1e6) / 1e6);
      keys[i] = n3.map((v) => Math.round(v * 1000)).join(',');
    });
    for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) if (keys[i] === keys[j]) out.clash.push([i, j]);
    out.ok = out.clash.length === 0;
    if (!out.ok) out.why = 'clash';
    // opposite faces (cube and octahedron): normals pointing opposite ways
    out.opposite = keys.map((k, i) => {
      const n = out.normals[i];
      for (let j = 0; j < keys.length; j++) if (j !== i && Math.abs(n[0] + out.normals[j][0]) < 1e-3 && Math.abs(n[1] + out.normals[j][1]) < 1e-3 && Math.abs(n[2] + out.normals[j][2]) < 1e-3) return j;
      return -1;
    });
    if (plan.solid === 'cube') {
      // the labelled cube: which face each cell becomes, and where the top of its picture points
      out.face = [];
      const lab = new Array(6);
      plan.polys.forEach((poly, i) => {
        const m = mats[i];
        const f = S.dirIndex(M4.applyDir(m, [0, 1, 0]));
        out.face[i] = f;
        const l = labelOf(net, i);
        const up2 = [[0, 0, -1], [1, 0, 0], [0, 0, 1], [-1, 0, 0]][((l[1] % 4) + 4) % 4];
        const up = S.dirIndex(M4.applyDir(m, up2));
        if (f >= 0 && !lab[f]) lab[f] = [l[0], up];
      });
      out.lab = lab;
    }
    return out;
  };
  function labelOf(net, i) {
    const l = net.l ? net.l[i] : null;
    if (l == null) return [null, 0];
    if (Array.isArray(l)) return [l[0], l[1] || 0];
    return [l, 0];
  }
  S.labelOf = labelOf;

  // does it fold (and why not)?
  S.netFolds = (net) => S.foldNet(net).ok;

  // a sentence on why a net does not fold (for hints and explanations)
  S.whyNot = function (net) {
    const r = S.foldNet(net);
    if (r.ok) return '';
    const sol = SOLIDS[r.solid];
    if (r.why === 'count') return 'It has ' + net.c.length + ' faces, and a ' + sol.name + ' has ' + sol.faces + '.';
    if (r.why === 'apart') return 'Its pieces are not all joined.';
    if (net.g !== 't' && has2x2(net.c)) return 'Four squares meet at one corner in a 2 × 2 block — at a corner of a cube only three faces meet.';
    if (net.g !== 't' && longRow(net.c) >= 5) return 'It has ' + longRow(net.c) + ' squares in a row: going round a cube you meet the first face again after four.';
    const [i, j] = r.clash[0];
    return 'Two faces land on the same side when it is folded (they overlap), so another side is left open.' + (i != null && j != null ? '' : '');
  };
  function has2x2(cells) {
    const s = new Set(cells.map((c) => c[0] + ',' + c[1]));
    return cells.some(([x, y]) => s.has((x + 1) + ',' + y) && s.has(x + ',' + (y + 1)) && s.has((x + 1) + ',' + (y + 1)));
  }
  function longRow(cells) {
    const s = new Set(cells.map((c) => c[0] + ',' + c[1]));
    let best = 0;
    cells.forEach(([x, y]) => {
      let n = 0; while (s.has((x + n) + ',' + y)) n++; best = Math.max(best, n);
      n = 0; while (s.has(x + ',' + (y + n))) n++; best = Math.max(best, n);
    });
    return best;
  }
  S.has2x2 = has2x2;
  S.longRow = longRow;

  /* ---------- polyforms: every polyomino / polyiamond of a size ---------- */

  function neighbours(g, c) {
    const [x, y] = c;
    if (g !== 't') return [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    const up = ((x + y) % 2 + 2) % 2 === 0;
    return [[x + 1, y], [x - 1, y], up ? [x, y + 1] : [x, y - 1]];
  }
  S.neighbours = neighbours;
  // move to the origin (keeping the triangle parity) and sort
  S.normNet = function (g, cells) {
    let x0 = Infinity, y0 = Infinity;
    cells.forEach((c) => { x0 = Math.min(x0, c[0]); y0 = Math.min(y0, c[1]); });
    let dx = -x0;
    const dy = -y0;
    if (g === 't' && ((dx + dy) % 2 + 2) % 2) dx += 1;
    return cells.map((c) => [c[0] + dx, c[1] + dy]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  };
  const netKey = (cells) => cells.map((c) => c[0] + ',' + c[1]).join(';');
  S.netKey = netKey;
  // the symmetries of the grid applied to cells (8 for squares, 12 for triangles), each with the map of cells
  S.gridSyms = function (g, cells) {
    const out = [];
    if (g !== 't') {
      const T = [(x, y) => [x, y], (x, y) => [-y, x], (x, y) => [-x, -y], (x, y) => [y, -x], (x, y) => [-x, y], (x, y) => [y, x], (x, y) => [x, -y], (x, y) => [-y, -x]];
      T.forEach((f, k) => out.push({ k, cells: cells.map((c) => f(c[0], c[1])) }));
      return out;
    }
    const cen = cells.map((c) => {
      const up = ((c[0] + c[1]) % 2 + 2) % 2 === 0;
      return [c[0] / 2 + 0.5, (c[1] + (up ? 2 / 3 : 1 / 3)) * H3];
    });
    for (let m = 0; m < 2; m++) {
      for (let r = 0; r < 6; r++) {
        const a = r * Math.PI / 3, ca = Math.cos(a), sa = Math.sin(a);
        out.push({
          k: m * 6 + r,
          cells: cen.map(([px, py]) => {
            let x = px - 0.5, y = py;
            if (m) x = -x;
            const X = x * ca - y * sa + 0.5, Y = x * sa + y * ca;
            const row = Math.floor(Y / H3 + 1e-9);
            return [Math.round(2 * X - 1), row];
          })
        });
      }
    }
    return out;
  };
  S.freeKey = function (g, cells) {
    let best = null;
    S.gridSyms(g, cells).forEach((s) => { const k = netKey(S.normNet(g, s.cells)); if (best === null || k < best) best = k; });
    return best;
  };
  const polyCache = {};
  // every free polyform of n cells: [{ cells, key }]
  S.polyforms = function (g, n) {
    const ck = g + n;
    if (polyCache[ck]) return polyCache[ck];
    let level = new Map([[netKey([[0, 0]]), [[0, 0]]]]);
    for (let size = 1; size < n; size++) {
      const next = new Map();
      level.forEach((cells) => {
        const has = new Set(cells.map((c) => c[0] + ',' + c[1]));
        cells.forEach((c) => neighbours(g, c).forEach((nb) => {
          if (has.has(nb[0] + ',' + nb[1])) return;
          const nc = S.normNet(g, cells.concat([nb]));
          const k = netKey(nc);
          if (!next.has(k)) next.set(k, nc);
        }));
      });
      level = next;
    }
    const free = new Map();
    level.forEach((cells) => { const k = S.freeKey(g, cells); if (!free.has(k)) free.set(k, S.normNet(g, cells)); });
    const out = [];
    free.forEach((cells, key) => out.push({ cells, key }));
    out.sort((a, b) => (a.key < b.key ? -1 : 1));
    polyCache[ck] = out;
    return out;
  };
  // the nets of a solid: every polyform of the right size that folds
  S.solidNets = function (solid) {
    const s = SOLIDS[solid];
    return S.polyforms(s.grid, s.faces).filter((p) => S.netFolds({ g: s.grid, c: p.cells }));
  };
  // a net placed in a random orientation (rotated / turned over) with its cells in a random order
  S.randomPose = function (rng, g, cells) {
    const syms = S.gridSyms(g, cells);
    const s = syms[rng.int(syms.length)];
    return S.normNet(g, s.cells);
  };

  /* ---------- SVG: a painter's renderer for the printed page ----------
   * faces: [{ p: [[x,y,z]…], c: colour, sym: [id, rot] (quads: corner 0→1 is right, 0→3 is up),
   *           key, cls, stroke, sw, two (both sides), op (opacity) }]
   * view:  { R: 3x3 (object turn), pivot, persp: D or 0, scale } */

  const LW = vnorm([-0.45, 0.75, 0.6]), LL = vnorm([-0.45, 0.8, 0.55]);
  S.lit = (n) => 0.42 + 0.58 * Math.max(0, vdot(n, LW)) * 0.95 + 0.05 * Math.max(0, vdot(n, LL));
  S.shade = function (c, k, a) {
    if (!c || c[0] !== '#') return c;
    const n = parseInt(c.length === 4 ? c.slice(1).split('').map((x) => x + x).join('') : c.slice(1, 7), 16);
    const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
    const rgb = f((n >> 16) & 255) + ',' + f((n >> 8) & 255) + ',' + f(n & 255);
    return a == null || a >= 1 ? 'rgb(' + rgb + ')' : 'rgba(' + rgb + ',' + a + ')';
  };
  S.projector = function (view) {
    const R = view.R || [1, 0, 0, 0, 1, 0, 0, 0, 1], pv = view.pivot || [0, 0, 0], D = view.persp || 0, sc = view.scale || 1;
    const off = view.at || [0, 0];
    return (p) => {
      const q = mv(R, vsub(p, pv));
      const f = D ? D / (D - q[2]) : 1;
      return [off[0] + q[0] * f * sc, off[1] - q[1] * f * sc, q[2]];
    };
  };
  const f2 = (v) => Math.round(v * 100) / 100;
  S.svgFaces = function (faces, view) {
    const R = view.R || [1, 0, 0, 0, 1, 0, 0, 0, 1];
    const proj = S.projector(view);
    const items = [];
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    faces.forEach((F) => {
      const pts = F.p.map(proj);
      // Newell normal in view space
      let nx = 0, ny = 0, nz = 0;
      const w = F.p.map((p) => mv(R, p));
      for (let k = 0; k < w.length; k++) {
        const a = w[k], b = w[(k + 1) % w.length];
        nx += (a[1] - b[1]) * (a[2] + b[2]); ny += (a[2] - b[2]) * (a[0] + b[0]); nz += (a[0] - b[0]) * (a[1] + b[1]);
      }
      let n = vnorm([nx, ny, nz]);
      if (view.persp) {
        // facing test against the eye for perspective
        const c = w.reduce((s, p) => vadd(s, p), [0, 0, 0]).map((v) => v / w.length);
        const toEye = vsub([0, 0, view.persp], vsub(c, mv(R, view.pivot || [0, 0, 0])));
        if (vdot(n, toEye) <= 0) { if (!F.two) return; n = vmul(n, -1); }
      } else if (n[2] <= 1e-9) { if (!F.two) return; n = vmul(n, -1); }
      const z = pts.reduce((s, p) => s + p[2], 0) / pts.length + (F.bias || 0);
      pts.forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
      items.push({ F, pts, z, lit: F.flat ? 1 : S.lit(n) });
    });
    items.sort((a, b) => a.z - b.z);
    let s = '';
    items.forEach(({ F, pts, lit }) => {
      const d = 'M' + pts.map((p) => f2(p[0]) + ' ' + f2(p[1])).join('L') + 'Z';
      const fill = F.c ? S.shade(F.c, lit) : 'none';
      const stroke = F.stroke || (F.c ? S.shade(F.c, 0.45) : 'var(--ink-2)');
      s += '<path d="' + d + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + (F.sw || 0.035 * (view.scale || 1)) + '" stroke-linejoin="round"' +
        (F.key ? ' data-key="' + F.key + '"' : '') + (F.cls ? ' class="' + F.cls + '"' : '') + (F.op != null ? ' opacity="' + F.op + '"' : '') + '/>';
      if (F.sym && F.sym[0] != null && pts.length === 4) {
        const [p0, p1, , p3] = pts;
        s += '<g transform="matrix(' + [p1[0] - p0[0], p1[1] - p0[1], p3[0] - p0[0], p3[1] - p0[1], p0[0], p0[1]].map(f2).join(' ') + ') translate(.5 .5) scale(.01 -.01)" pointer-events="none">' +
          S.symSVG(F.sym[0], F.sym[1] || 0, F.symColor ? F.symColor : F.sym[0] && !SYM[F.sym[0]] ? S.shade(S.INK, Math.min(1.1, 0.55 + lit * 0.55)) : S.shade(S.symColor(F.sym[0]), Math.min(1.1, 0.55 + lit * 0.55))) + '</g>';
      }
    });
    return { svg: s, box: [x0, y0, x1, y1] };
  };

  // the faces of unit cubes (only those on the outside), each face keyed "cell:dir"
  S.cubeFaces = function (cells, opts) {
    opts = opts || {};
    const set = new Set(cells.map(cellKey));
    const out = [];
    cells.forEach((c, ci) => {
      const g = opts.gap || 0;
      const x0 = c[0] + g, y0 = c[1] + g, z0 = c[2] + g, x1 = c[0] + 1 - g, y1 = c[1] + 1 - g, z1 = c[2] + 1 - g;
      const quads = [
        [[x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]],
        [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]],
        [[x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]],
        [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]],
        [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]],
        [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]]
      ];
      DIR6.forEach((d, i) => {
        if (!opts.all && set.has(cellKey([c[0] + d[0], c[1] + d[1], c[2] + d[2]]))) return;
        const col = typeof opts.color === 'function' ? opts.color(c, ci, i) : (c[3] || opts.color || '#8f9bff');
        out.push({ p: quads[i], c: col, cell: ci, dir: i, key: opts.keyPrefix ? opts.keyPrefix + ci + '-' + i : null });
      });
    });
    return out;
  };
  // a labelled cube's six faces, pictures the right way up (corner 0→3 = the face's "up")
  S.labFaces = function (lab, opts) {
    opts = opts || {};
    const o = opts.at || [0, 0, 0], s = opts.size || 1;
    const out = [];
    DIR6.forEach((n, f) => {
      const e = lab[f] || [null, S.BASE_UP[f]];
      const up = e[1] == null ? S.BASE_UP[f] : e[1];
      const u = DIR6[up], r = vcross(u, n);
      const c = vadd(o, vmul(vadd([0.5, 0.5, 0.5], vmul(n, 0.5)), s));
      const h = (a, b) => vadd(c, vadd(vmul(r, a * s / 2), vmul(u, b * s / 2)));
      out.push({ p: [h(-1, -1), h(1, -1), h(1, 1), h(-1, 1)], c: S.faceColor(e[0]), sym: e[0] && !/^c:/.test(e[0]) ? [e[0], 0] : null, face: f });
    });
    return out;
  };

  /* ---------- raster: exactly what a view hides ----------
   * cam = { R (3x3), pivot, D } as in the Stage: the object is turned about its pivot and seen
   * from (0, 0, D) looking down -z. faces: [{ p: [[x,y,z]…] }]. ppu: pixels per unit near the pivot. */
  S.zbuffer = function (faces, cam, ppu) {
    ppu = ppu || 30;
    const R = cam.R, pv = cam.pivot, D = cam.D;
    const W = faces.map((F) => F.p.map((p) => mv(R, vsub(p, pv))));
    const scr = W.map((ws) => ws.map((q) => { const f = D / (D - q[2]); return [q[0] * f * ppu, -q[1] * f * ppu]; }));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    scr.forEach((ps) => ps.forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); }));
    x0 = Math.floor(x0) - 1; y0 = Math.floor(y0) - 1; x1 = Math.ceil(x1) + 1; y1 = Math.ceil(y1) + 1;
    const w = x1 - x0, h = y1 - y0;
    const depth = new Float64Array(w * h).fill(Infinity), id = new Int32Array(w * h).fill(-1);
    const zb = { w, h, x0, y0, depth, id, W, scr, ppu, D, faces };
    faces.forEach((F, fi) => rasterFace(zb, fi, (k, s) => { if (s < depth[k]) { depth[k] = s; id[k] = fi; } }));
    zb.visible = new Array(faces.length).fill(0);
    zb.area = new Array(faces.length).fill(0);
    faces.forEach((F, fi) => rasterFace(zb, fi, () => { zb.area[fi]++; }));
    for (let k = 0; k < id.length; k++) if (id[k] >= 0) zb.visible[id[k]]++;
    return zb;
  };
  // test extra faces against a z-buffer without drawing them: visible pixel counts and areas
  S.zbufferTest = function (zb, faces, cam) {
    const R = cam.R, pv = cam.pivot, D = cam.D, ppu = zb.ppu;
    const W = faces.map((F) => F.p.map((p) => mv(R, vsub(p, pv))));
    const scr = W.map((ws) => ws.map((q) => { const f = D / (D - q[2]); return [q[0] * f * ppu, -q[1] * f * ppu]; }));
    const z2 = Object.assign({}, zb, { W, scr });
    return faces.map((F, fi) => {
      let vis = 0, area = 0;
      rasterFace(z2, fi, (k, s) => { area++; if (k < 0 || s < zb.depth[k] - 1e-6) vis++; }, true);
      return { vis, area };
    });
  };
  function rasterFace(zb, fi, put, outside) {
    const ps = zb.scr[fi], ws = zb.W[fi];
    // facing the eye?
    const a = ws[0], b = ws[1], c = ws[2];
    const n = vcross(vsub(b, a), vsub(c, a));
    const eye = [0, 0, zb.D];
    if (vdot(n, vsub(eye, a)) <= 0) return;
    let bx0 = Infinity, by0 = Infinity, bx1 = -Infinity, by1 = -Infinity;
    ps.forEach((p) => { bx0 = Math.min(bx0, p[0]); by0 = Math.min(by0, p[1]); bx1 = Math.max(bx1, p[0]); by1 = Math.max(by1, p[1]); });
    const nn = ps.length;
    // winding of the projected polygon
    let area2 = 0;
    for (let k = 0; k < nn; k++) { const p = ps[k], q = ps[(k + 1) % nn]; area2 += p[0] * q[1] - q[0] * p[1]; }
    const sg = area2 > 0 ? 1 : -1;
    const nd = vdot(n, a);
    for (let py = Math.floor(by0); py <= Math.ceil(by1); py++) {
      const Y = py + 0.5;
      for (let px = Math.floor(bx0); px <= Math.ceil(bx1); px++) {
        const X = px + 0.5;
        let ins = true;
        for (let k = 0; k < nn; k++) {
          const p = ps[k], q = ps[(k + 1) % nn];
          if (sg * ((q[0] - p[0]) * (Y - p[1]) - (q[1] - p[1]) * (X - p[0])) < 0) { ins = false; break; }
        }
        if (!ins) continue;
        const gx = px - zb.x0, gy = py - zb.y0;
        if (gx < 0 || gy < 0 || gx >= zb.w || gy >= zb.h) { if (outside) put(-1, 0); continue; }
        // the ray from the eye through this pixel, and where it meets the face's plane
        const dir = [X / (zb.ppu * zb.D), -Y / (zb.ppu * zb.D), -1];
        const den = vdot(n, dir);
        if (Math.abs(den) < 1e-12) continue;
        const s = (nd - vdot(n, eye)) / den;
        put(gy * zb.w + gx, s);
      }
    }
  }

  /* ---------- Stage: the 3D scene on the workbench (browser only) ----------
   *   const st = new C.space.Stage(ctx, { onTap(hit, obj, ev), onTurn(objs), after(c2, view, st), spinAll })
   *   const o = st.add({ id, label, size, pivot, mode: 'table'|'free', yaw, pitch, q, spin, pmin, pmax });
   *   st.mesh(o, { verts, faces, colors, decals, lm, cc (cube centre: sort as a cube) … });
   *   st.layout(); st.frame(); st.render();
   * The camera never orbits: dragging an object turns that object (dragging the empty
   * table turns them all together), so several things can be compared side by side.
   * Zoom narrows the field of view, so the perspective — and what hides what — stays put. */

  function Stage(ctx, opts) {
    this.ctx = ctx;
    this.opts = opts || {};
    this.objs = [];
    this.zoomK = 1;
    this.dead = false;
    const self = this;
    const v = this.v = ctx.wb.use3D({
      down: (hit, ev, pt) => self._down(hit, ev, pt),
      move: (ev, pt) => self._move(ev, pt),
      up: (ev, pt, moved) => self._up(ev, pt, moved),
      onPick: (hit, ev) => self._tap(hit, ev),
      hover: (hit, ev) => self._hover(hit, ev),
      after: (c2, view) => self._after(c2, view)
    });
    v.cam = { yaw: 0, pitch: 0, dist: 30, target: [0, 0, 0], fov: 30 };
    // every render (also the workbench's own, on a resize or the 2D / 3D switch) places the objects first
    const baseRender = C.View3D.prototype.render;
    v.render = function () { if (!self.dead) self.update(); baseRender.call(v); };
    v.zoom = (k) => self.zoomBy(k);
    v.fit = () => self.frame();
    const box = this.box = v.canvas.parentNode;
    this._wheel = (ev) => {
      if (ev.target !== v.canvas) return;
      ev.preventDefault();
      ev.stopPropagation();
      self.zoomBy(Math.exp(-ev.deltaY * 0.0012));
    };
    box.addEventListener('wheel', this._wheel, { capture: true, passive: false });
    this.ro = root.ResizeObserver ? new root.ResizeObserver(() => { if (!self.dead && self.v.w > 20) { self.layout(); self.frame(); } }) : null;
    if (this.ro) this.ro.observe(box);
    this.readTheme();
  }
  S.Stage = Stage;
  const SP = Stage.prototype;

  SP.readTheme = function () {
    const cs = root.getComputedStyle ? root.getComputedStyle(root.document.documentElement) : null;
    const g = (k, d) => (cs && cs.getPropertyValue(k).trim()) || d;
    this.theme = {
      ink: g('--ink', '#e8eaf6'), muted: g('--muted', '#969db8'), gold: g('--gold', '#ffd166'), green: g('--green', '#4ecb8d'),
      red: g('--red', '#ff6b6b'), accent: g('--accent', '#6c7bff'), panel: g('--panel-2', '#222741'), line: g('--line', '#2e3455'),
      board: g('--board', '#1b2040'), board2: g('--board-2', '#20264a'), cell: g('--cell', '#232a52'), light: /light/.test(root.document.documentElement.getAttribute('data-theme') || '')
    };
    return this.theme;
  };

  SP.destroy = function () {
    this.dead = true;
    if (this.ro) this.ro.disconnect();
    if (this.box) this.box.removeEventListener('wheel', this._wheel, { capture: true });
  };

  SP.add = function (o) {
    o = Object.assign({ at: [0, 0, 0], pivot: [0, 0, 0], size: 1, mode: 'table', yaw: -35, pitch: 25, qi: Q.id(), mir: 1, spin: true, meshes: [] }, o);
    if (o.mode === 'free' && !o.q) o.q = Q.ypr(o.yaw, o.pitch);
    o.home = { yaw: o.yaw, pitch: o.pitch, q: o.q ? o.q.slice() : null };
    this.objs.push(o);
    return o;
  };
  SP.byId = function (id) { return this.objs.find((o) => o.id === id) || null; };
  SP.mesh = function (o, spec) {
    spec.lm = spec.lm || C.M4.id();
    spec._obj = o;
    this.v.add(spec);
    o.meshes.push(spec);
    return spec;
  };
  SP.clearObj = function (o) { o.meshes.forEach((m) => this.v.remove(m)); o.meshes = []; };
  SP.remove = function (o) { this.clearObj(o); this.objs = this.objs.filter((x) => x !== o); };
  SP.clear = function () { this.objs = []; this.v.meshes = []; };

  // the rotation of an object: the user's turn, then its own inner turn (animations), as 3x3
  SP.rotOf = function (o) {
    const q = o.mode === 'free' ? o.q : Q.ypr(o.yaw, o.pitch);
    return Q.mat(Q.mul(q, o.qi));
  };
  SP.update = function () {
    const M4 = C.M4;
    const cubes = [];
    this.objs.forEach((o) => {
      let R = this.rotOf(o);
      if (o.vs != null && o.vs !== 1) R = mm([o.vs, 0, 0, 0, 1, 0, 0, 0, 1], R); // a mirror in the plane of the screen
      let M = S.m34(R, o.at);
      if (o.mir !== 1) M = M4.mul(M, [o.mir, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0]);
      if (o.post) M = M4.mul(M, o.post);
      M = M4.mul(M, M4.translate(-o.pivot[0], -o.pivot[1], -o.pivot[2]));
      o.M = M;
      o.meshes.forEach((m) => {
        m.m = M4.mul(M, m.lm);
        if (m.cc) { m._z = M4.apply(m.m, m.cc)[2]; cubes.push(m); }
      });
    });
    // unit cubes are drawn far to near as whole cubes (their faces never tangle that way)
    cubes.sort((a, b) => a._z - b._z);
    cubes.forEach((m, k) => { m.bias = -k * 10 + (m.bias0 || 0); });
  };
  SP.render = function () {
    if (this.dead) return;
    this.v.render();
  };

  // arrange the objects in rows to suit the shape of the view
  SP.layout = function () {
    if (this.opts.layout) { this.opts.layout(this); return; }
    const objs = this.objs.filter((o) => !o.pinned && !o.hidden);
    if (!objs.length) return;
    const aspect = Math.max(0.25, (this.v.w || 600) / (this.v.h || 400));
    const pad = this.opts.pad == null ? 0.45 : this.opts.pad;
    let best = null;
    for (let rows = 1; rows <= objs.length; rows++) {
      const per = Math.ceil(objs.length / rows);
      const rr = [];
      for (let r = 0; r < rows; r++) { const row = objs.slice(r * per, (r + 1) * per); if (row.length) rr.push(row); }
      if (rr.length !== rows) continue;
      const widths = rr.map((row) => row.reduce((s, o) => s + 2 * o.size + pad, -pad));
      const heights = rr.map((row) => Math.max.apply(null, row.map((o) => 2 * o.size + (o.label ? 0.7 : 0))));
      const W = Math.max.apply(null, widths), H = heights.reduce((a, b) => a + b, 0) + pad * (rows - 1);
      const scale = Math.min(aspect / W, 1 / H);
      if (!best || scale > best.scale * 1.02) best = { rr, widths, heights, W, H, scale };
    }
    let y = best.H / 2;
    best.rr.forEach((row, r) => {
      const hg = best.heights[r];
      let x = -best.widths[r] / 2;
      row.forEach((o) => {
        const lab = o.label ? 0.35 : 0;
        o.at = [x + o.size, y - hg / 2 + lab, 0];
        x += 2 * o.size + pad;
      });
      y -= hg + pad;
    });
    this.extent = { W: best.W, H: best.H };
  };
  // the camera distance: far enough that the perspective stays gentle
  SP.distFor = function () {
    if (this.opts.D) return this.opts.D;
    const big = Math.max.apply(null, this.objs.map((o) => o.size).concat([1]));
    const e = this.extent || { W: 2 * big, H: 2 * big };
    return Math.max(6 * big, 1.8 * Math.max(e.W, e.H));
  };
  // frame everything: the field of view is chosen to fit, clear of the tool bar (left) and zoom bar (bottom)
  SP.frame = function (quiet) {
    if (!this.extent) this.layout();
    const e = this.extent || { W: 4, H: 4 };
    const v = this.v;
    const D = this.D = this.distFor();
    const W = v.w || 600, Hh = v.h || 400;
    const narrow = W < 560;
    const res = this.opts.centred ? { l: 0, t: 0, b: 0 } : narrow ? { l: 0, t: 40, b: 50 } : { l: 56, t: 0, b: 44 };
    const aw = Math.max(80, W - res.l), ah = Math.max(80, Hh - res.t - res.b);
    // half-height of the view (world units at the target) needed to fit the extent in the free area
    const need = Math.max(e.H / 2 * Hh / ah, e.W / 2 * Hh / aw) * 1.08 + 0.12;
    this.baseFov = 2 * Math.atan(need / D) * 180 / Math.PI;
    this.zoomK = 1;
    const upp = 2 * need / Hh; // world units per pixel
    v.cam = { yaw: 0, pitch: 0, dist: D, target: [-res.l / 2 * upp, -(res.b - res.t) / 2 * upp, 0], fov: this.baseFov };
    if (!quiet) this.render();
  };
  SP.zoomBy = function (k) {
    if (!this.baseFov) this.frame();
    this.zoomK = Math.max(0.35, Math.min(8, this.zoomK * k));
    const t = Math.tan(this.baseFov * Math.PI / 360) / this.zoomK;
    this.v.cam.fov = 2 * Math.atan(t) * 180 / Math.PI;
    this.render();
  };
  SP.lock = function (on) {
    this.locked = !!on;
    this.v.disabled = !!on;
    this.v.canvas.style.cursor = on ? 'default' : '';
    this.render();
  };
  SP.home = function (objs, ms) {
    objs = objs || this.objs;
    const from = objs.map((o) => ({ o, yaw: o.yaw, pitch: o.pitch, q: o.q ? o.q.slice() : null }));
    this.animate(ms == null ? 450 : ms, (t) => {
      from.forEach((f) => {
        const o = f.o;
        if (o.mode === 'free') o.q = Q.slerp(f.q, o.home.q, t);
        else { o.yaw = f.yaw + (o.home.yaw - f.yaw) * t; o.pitch = f.pitch + (o.home.pitch - f.pitch) * t; }
      });
    }, () => objs.forEach((o) => { o.touched = false; }));
  };

  // an animation (eased t from 0 to 1); a new one replaces the old
  SP.animate = function (ms, fn, done) {
    const tok = {};
    this.cur = tok;
    const t0 = root.performance.now(), dur = Math.max(1, C.anim(ms));
    const step = (now) => {
      if (this.dead || this.cur !== tok) return;
      const t = Math.min(1, (now - t0) / dur);
      fn(t < 1 ? 0.5 - Math.cos(t * Math.PI) / 2 : 1, t);
      this.render();
      if (t < 1) root.requestAnimationFrame(step);
      else { this.cur = null; if (done) done(); }
    };
    root.requestAnimationFrame(step);
  };
  SP.busy = function () { return !!this.cur; };

  SP.objOf = function (hit) { return (hit && hit.mesh && hit.mesh._obj) || null; };
  SP._down = function (hit, ev, pt) {
    this.drag = { obj: this.objOf(hit), hit, start: pt, last: pt, moved: false };
    return true;
  };
  SP._move = function (ev, pt) {
    const d = this.drag;
    if (!d) return;
    const dx = pt[0] - d.last[0], dy = pt[1] - d.last[1];
    d.last = pt;
    if (!d.moved && Math.hypot(pt[0] - d.start[0], pt[1] - d.start[1]) < 4) return;
    d.moved = true;
    let targets;
    if (d.obj && d.obj.spin) targets = [d.obj];
    else targets = this.objs.filter((o) => o.spin && !o.hidden);
    if (this.opts.turnTargets) targets = this.opts.turnTargets(d.obj, targets) || targets;
    targets.forEach((o) => this.turn(o, dx, dy));
    this.render();
    if (this.opts.onTurn) this.opts.onTurn(targets);
  };
  SP.turn = function (o, dx, dy) {
    const k = 0.5;
    if (o.mode === 'free') o.q = Q.norm(Q.mul(Q.mul(Q.axis(dx * k, [0, 1, 0]), Q.axis(dy * k, [1, 0, 0])), o.q));
    else {
      o.yaw += dx * k;
      o.pitch = Math.max(o.pmin == null ? -89 : o.pmin, Math.min(o.pmax == null ? 89 : o.pmax, o.pitch + dy * k));
    }
    o.touched = true;
  };
  SP._up = function (ev, pt, moved) {
    const d = this.drag;
    this.drag = null;
    if (!d) return;
    if (!moved && !d.moved) this._tap(this.v.pick(pt[0], pt[1]), ev);
  };
  SP._tap = function (hit, ev) {
    if (this.opts.onTap) this.opts.onTap(hit, this.objOf(hit), ev);
  };
  SP._hover = function (hit, ev) {
    const o = this.objOf(hit);
    if (this.opts.onHover) this.opts.onHover(hit, o, ev);
    const cur = this.opts.cursor ? this.opts.cursor(hit, o) : null;
    this.v.canvas.style.cursor = this.locked ? 'default' : (cur || '');
  };

  // labels under the objects, and whatever the engine draws on top
  SP._after = function (c2, view) {
    const th = this.theme;
    this.objs.forEach((o) => {
      if (!o.label || o.hidden) return;
      // under the lowest point of the object as drawn (a folding net shrinks as it closes)
      let p = view.project([o.at[0], o.at[1] - o.size - 0.12, o.at[2]]);
      if (o.meshes.length && o.meshes.length < 400) {
        let x0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        const B = view.basis();
        o.meshes.forEach((m) => {
          if (m.hidden || m.rim || !m.m) return;
          m.verts.forEach((q) => { const s = view.project(C.M4.apply(m.m, q), B); if (s[2] > 0) { x0 = Math.min(x0, s[0]); x1 = Math.max(x1, s[0]); y1 = Math.max(y1, s[1]); } });
        });
        if (y1 > -Infinity) p = [(x0 + x1) / 2, y1 + 18, 0];
      }
      const txt = String(o.label);
      c2.font = '700 14px "Segoe UI", system-ui, sans-serif';
      const w = Math.max(26, c2.measureText(txt).width + 16), h = 24;
      const x = p[0] - w / 2, y = p[1] - h / 2;
      const col = o.state === 'good' ? th.green : o.state === 'bad' ? th.red : o.state === 'sel' ? th.gold : null;
      c2.beginPath();
      roundRect(c2, x, y, w, h, 12);
      c2.fillStyle = col || th.panel;
      c2.globalAlpha = col ? 0.95 : 0.9;
      c2.fill();
      c2.globalAlpha = 1;
      c2.lineWidth = 1;
      c2.strokeStyle = col || th.line;
      c2.stroke();
      c2.fillStyle = col ? '#1b2140' : th.ink;
      c2.textAlign = 'center';
      c2.textBaseline = 'middle';
      c2.fillText(txt, p[0], p[1] + 1);
    });
    if (this.opts.after) this.opts.after(c2, view, this);
    if (this.locked && this.opts.lockText !== false) {
      const t = this.opts.lockText || 'Answer first — then you can turn it';
      c2.font = '600 12px "Segoe UI", system-ui, sans-serif';
      const w = c2.measureText(t).width + 30;
      const x = (view.w - w) / 2, y = 10;
      c2.beginPath();
      roundRect(c2, x, y, w, 24, 12);
      c2.fillStyle = th.panel;
      c2.globalAlpha = 0.88;
      c2.fill();
      c2.globalAlpha = 1;
      c2.fillStyle = th.muted;
      c2.textAlign = 'center';
      c2.textBaseline = 'middle';
      c2.fillText('🔒 ' + t, view.w / 2, y + 12.5);
    }
  };
  function roundRect(c2, x, y, w, h, r) {
    c2.moveTo(x + r, y);
    c2.arcTo(x + w, y, x + w, y + h, r);
    c2.arcTo(x + w, y + h, x, y + h, r);
    c2.arcTo(x, y + h, x, y, r);
    c2.arcTo(x, y, x + w, y, r);
    c2.closePath();
  }
  S.roundRect = roundRect;

  /* ---------- building meshes ---------- */

  // a board of w × d cells on the floor (y = 0), drawn first; each cell is pickable as { floor: [x, z] }
  S.floor = function (st, o, w, d, opts) {
    opts = opts || {};
    const th = st.theme || {};
    const cols = opts.colors || (th.light ? ['#e8e0cd', '#ded5c0'] : ['#323b6e', '#2b3363']);
    const verts = [], faces = [], colors = [], cellOf = [];
    const m = opts.margin == null ? 0.18 : opts.margin;
    // the rim, drawn before the cells
    st.mesh(o, { verts: [[-m, -0.02, d + m], [w + m, -0.02, d + m], [w + m, -0.02, -m], [-m, -0.02, -m]], faces: [[0, 1, 2, 3]], color: opts.rim || (th.light ? '#cfc4ab' : '#232a52'), bias: 2e5, stroke: false, pickable: false, rim: true });
    for (let z = 0; z < d; z++) for (let x = 0; x < w; x++) {
      const b = verts.length;
      verts.push([x, 0, z + 1], [x + 1, 0, z + 1], [x + 1, 0, z], [x, 0, z]);
      faces.push([b, b + 1, b + 2, b + 3]);
      colors.push(cols[(x + z) % 2]);
      cellOf.push([x, z]);
    }
    return st.mesh(o, { verts, faces, colors, cellOf, floor: true, bias: 1e5, lw: 0.8, stroke: th.light ? 'rgba(90,80,60,.35)' : 'rgba(0,0,0,.35)', pickable: opts.pickable !== false });
  };

  // unit cubes as one mesh each (outside faces only), sorted as whole cubes by the Stage
  S.cubeMeshes = function (st, o, cells, opts) {
    opts = opts || {};
    const set = new Set(cells.map(cellKey));
    return cells.map((c, ci) => {
      const g = opts.gap || 0;
      const faces = S.cubeFaces([c], { all: true, gap: g }).filter((F) => opts.all || !set.has(cellKey(vadd(c, DIR6[F.dir]))));
      const verts = [], fs = [], colors = [], faceDir = [];
      faces.forEach((F) => {
        const b = verts.length;
        F.p.forEach((p) => verts.push(p));
        fs.push([b, b + 1, b + 2, b + 3]);
        colors.push(typeof opts.color === 'function' ? opts.color(c, ci, F.dir) : (c[3] || opts.color || '#8f9bff'));
        faceDir.push(F.dir);
      });
      return st.mesh(o, Object.assign({ verts, faces: fs, colors, faceDir, cell: ci, cc: [c[0] + 0.5, c[1] + 0.5, c[2] + 0.5], lw: opts.lw || 1.1 }, opts.extra || {}));
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
