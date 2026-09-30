/* The Puzzle Cabinet · engines/rubik.js
 *
 * Rubik's cube (3×3×3) and the pocket cube (2×2×2) in 3D. Drag a sticker
 * across the cube to turn its layer (the layer follows your finger and
 * snaps to the nearest quarter turn), drag the table to look around, or use
 * the move pad and the keys U D L R F B (Shift for the anticlockwise turn),
 * M E S for the middle slices and x y z to turn the whole cube. The letters
 * always mean the faces as you see them: F is the face toward you.
 *
 * Moves are counted in quarter turns: a half turn counts two, and so does a
 * middle-slice quarter turn (it is the same as two outer quarter turns).
 *
 * data: {
 *   n: 3 | 2,
 *   mode: 'solve'   scramble: "R U' F"   solution: "F' U R'"   (p.par = the fewest quarter turns)
 *       | 'pattern' pattern: "U2 D2 F2 B2 L2 R2"   start solved; make the picture (held any way)
 *       | 'free'    scramble: "…"   a scrambled cube to solve against the clock; "New scramble" makes another
 * }
 * The model and the optimal solvers live in js/lib/twisty.js.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const T = () => C.Twisty;

  const WORD = { U: 'top', D: 'bottom', L: 'left', R: 'right', F: 'front', B: 'back' };
  const SLICE = { M: ['middle slice between left and right', 'L'], E: ['middle layer between top and bottom', 'D'], S: ['middle slice between front and back', 'F'] };
  const ROT = { x: 'R', y: 'U', z: 'F' };

  /* ---------- the cube as you see it: which physical face is F, U, R … ---------- */

  const AX = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const neg = (a) => [-a[0], -a[1], -a[2]];
  const axisOf = (d) => (d[0] ? 0 : d[1] ? 1 : 2);
  const signOf = (d) => d[0] + d[1] + d[2];

  // the reference frame: U = +y, R = +x, F = +z
  const REF = { F: [0, 0, 1], U: [0, 1, 0], R: [1, 0, 0] };
  function frameFrom(front, up) {
    const right = cross(up, front);
    return { F: front, B: neg(front), U: up, D: neg(up), R: right, L: neg(right) };
  }
  function viewFrame(B) {
    const toEye = neg(B.f);
    let front = AX[0], bd = -9;
    AX.forEach((d) => { const x = dot(d, toEye); if (x > bd) { bd = x; front = d; } });
    let up = null; bd = -9;
    AX.forEach((d) => { if (dot(d, front) !== 0) return; const x = dot(d, B.u); if (x > bd) { bd = x; up = d; } });
    return frameFrom(front, up);
  }
  const REF_FRAME = frameFrom(REF.F, REF.U);

  // a letter (U D L R F B M E S x y z) as the cube is seen -> a physical move
  function letterMove(K, letter, prime, fr, twice) {
    let dir, lays;
    if ('UDLRFB'.includes(letter)) { dir = fr[letter]; lays = [signOf(dir) * K.h]; }
    else if (letter === 'M') { dir = fr.L; lays = [0]; }
    else if (letter === 'E') { dir = fr.D; lays = [0]; }
    else if (letter === 'S') { dir = fr.F; lays = [0]; }
    else if (letter === 'x') { dir = fr.R; lays = K.layers; }
    else if (letter === 'y') { dir = fr.U; lays = K.layers; }
    else if (letter === 'z') { dir = fr.F; lays = K.layers; }
    else return null;
    const a = axisOf(dir), s = signOf(dir);
    let q = -s * (twice ? 2 : 1);
    if (prime) q = -q;
    return K.mv(a, lays, q);
  }
  // a physical move -> its letter as the cube is seen ("R'", "U2", "M", "y'")
  function moveName(K, m, fr) {
    const q = ((m.q % 4) + 4) % 4;
    if (!q) return '';
    let letter = null, dir = null;
    const all = m.lays.length === K.layers.length;
    const cands = all ? ['x', 'y', 'z'] : m.lays[0] === 0 ? ['M', 'E', 'S'] : ['U', 'D', 'L', 'R', 'F', 'B'];
    const dirOf = { x: 'R', y: 'U', z: 'F', M: 'L', E: 'D', S: 'F' };
    for (const l of cands) {
      const d = fr[dirOf[l] || l];
      if (axisOf(d) !== m.a) continue;
      if (!all && m.lays[0] !== 0 && signOf(d) * K.h !== m.lays[0]) continue;
      letter = l; dir = d; break;
    }
    if (!letter) return '?';
    const cw = ((-signOf(dir) % 4) + 4) % 4;
    return letter + (q === 2 ? '2' : q === cw ? '' : '′');
  }
  const pretty = (s) => String(s).replace(/'/g, '′');
  function describe(name) {
    const l = name[0], mod = name.slice(1);
    const how = mod === '2' ? 'half a turn' : mod ? 'a quarter turn anticlockwise' : 'a quarter turn clockwise';
    if (WORD[l]) return 'turn the ' + WORD[l] + ' face ' + how + (l === 'B' ? ' (as seen from behind)' : l === 'D' ? ' (as seen from below)' : '');
    const like = (x) => (mod === '2' ? 'half a turn' : 'a quarter turn the way ' + x + (mod ? '′' : '') + ' turns');
    if (SLICE[l]) return 'turn the ' + SLICE[l][0] + ' ' + like(SLICE[l][1]);
    if (ROT[l]) return 'turn the whole cube ' + like(ROT[l]);
    return name;
  }

  // shorten a list of physical moves: merge turns of the same layer, drop what cancels
  function simplify(K, list) {
    const out = [];
    list.forEach((m) => {
      const last = out[out.length - 1];
      if (last && last.a === m.a && last.lays.join() === m.lays.join()) {
        out.pop();
        const x = K.mv(m.a, m.lays, last.q + m.q);
        if (x.q) out.push(x);
      } else out.push(m);
    });
    return out;
  }

  /* ---------- checking ---------- */

  function startOf(K, d) {
    const s0 = K.solved();
    return d.mode === 'pattern' ? s0 : K.run(s0, d.scramble || '');
  }
  function goalOf(K, d) { return d.mode === 'pattern' ? K.run(K.solved(), d.pattern) : null; }

  function verify(p) {
    const d = p.data;
    if (!d || (d.n !== 2 && d.n !== 3)) return { ok: false, err: 'data.n must be 2 or 3' };
    if (!C.Twisty) return { ok: false, err: 'js/lib/twisty.js is not loaded' };
    const K = T().cube(d.n);
    let moves;
    try {
      if (d.mode === 'solve') {
        const start = startOf(K, d);
        if (K.isSolved(start)) return { ok: false, err: 'the scramble leaves the cube solved' };
        moves = K.parse(d.solution);
        if (!K.isSolved(K.applyAll(start, moves))) return { ok: false, err: 'the stored solution does not solve the scramble' };
        const len = K.cost(moves);
        if (p.par != null && p.par !== len) return { ok: false, err: 'par ' + p.par + ' but the stored solution takes ' + len };
        // prove that nothing shorter exists
        if (d.n === 2) {
          const dist = T().distance2(start);
          if (dist !== len) return { ok: false, err: 'the stored solution takes ' + len + ' but the fewest is ' + dist };
        } else if (len <= 9) {
          const r = T().solve(3, start, null, { max: len, nodes: 4e6 });
          if (r.fail === 'nodes') return { ok: true, par: len, warn: 'optimality not proved (search too long)' };
          if (r.fail || r.len !== len) return { ok: false, err: 'the stored solution takes ' + len + ' but the fewest is ' + (r.len == null ? '?' : r.len) };
        }
        return { ok: true, par: len };
      }
      if (d.mode === 'pattern') {
        moves = K.parse(d.pattern);
        const g = goalOf(K, d);
        if (K.isSolved(g)) return { ok: false, err: 'the pattern is the solved cube' };
        const len = K.cost(moves);
        if (p.par != null) {
          if (p.par > len) return { ok: false, err: 'par ' + p.par + ' is more than the known route ' + len };
          if (d.n === 2) {
            const dist = T().distance2(K.solved(), g);
            if (dist !== p.par) return { ok: false, err: 'par ' + p.par + ' but the fewest is ' + dist };
          } else if (p.par <= 12) {
            const r = T().solve(3, K.solved(), g, { max: p.par, nodes: 4e6 });
            if (r.fail === 'nodes') return { ok: true, warn: 'par not proved (search too long)' };
            if (r.fail || r.len !== p.par) return { ok: false, err: 'par ' + p.par + ' but the fewest is ' + (r.len == null ? '?' : r.len) };
          }
        }
        return { ok: true };
      }
      if (d.mode === 'free') {
        const start = startOf(K, d);
        if (K.isSolved(start)) return { ok: false, err: 'the scramble leaves the cube solved' };
        if (!K.isSolved(K.applyAll(start, K.inverse(K.parse(d.scramble))))) return { ok: false, err: 'bad scramble' };
        return { ok: true };
      }
    } catch (e) {
      return { ok: false, err: e.message };
    }
    return { ok: false, err: 'unknown mode ' + d.mode };
  }

  /* ---------- endless: scrambles of a known depth ---------- */

  const NAMES6 = ['U', 'R', 'F', 'D', 'L', 'B'];
  // a scramble of d quarter turns with no turn undoing the last, no three alike, opposite faces in one order
  function randomWalk(rng, d, faces) {
    faces = faces || NAMES6;
    const out = [];
    let pf = -1, pm = null, run = 0;
    while (out.length < d) {
      const fi = rng.int(faces.length), f = faces[fi], pr = rng() < 0.5;
      const m = f + (pr ? "'" : '');
      if (pf === fi) {
        if (m !== pm || run >= 2) continue;
        run++;
      } else {
        // opposite faces (U/D, R/L, F/B) only in one order
        if (faces.length === 6 && pf >= 0 && pf === (fi + 3) % 6 && fi < pf) continue;
        run = 1;
      }
      out.push(m); pf = fi; pm = m;
    }
    return out;
  }

  const TITLES3 = ['Quarter Past', 'A Nudge Away', 'Turn, Turn', 'Three Steps Out', 'The Wandering Face', 'Five Knots', 'Six Twists Deep', 'Seven Seas', 'Eight Winds'];
  const TITLES2 = ['A Pocket Twist', 'Two in the Pocket', 'Small Change', 'Pocket Puzzle', 'Loose Corners', 'Corner Dance', 'Eight Corners Astray', 'Deep Pocket', 'Pocket Labyrinth'];

  function generate(rng, level) {
    const K3 = T().cube(3), K2 = T().cube(2);
    const use2 = rng() < 0.4;
    if (use2) {
      const band = [null, [2, 4], [5, 6], [7, 8], [9, 10], [11, 14]][level];
      T().ensure2();
      const dist = T().S2.dist;
      for (let tries = 0; tries < 40000; tries++) {
        const want = band[0] + rng.int(band[1] - band[0] + 1);
        const idx = rng.int(dist.length);
        if (dist[idx] !== want && !(want >= 13 && dist[idx] >= 13)) continue;
        const start = state2FromIndex(K2, idx);
        const r = T().solve(2, start);
        if (r.fail) continue;
        const sol = r.moves;
        const scr = K2.inverse(sol);
        const par = K2.cost(sol);
        return {
          title: TITLES2[Math.min(TITLES2.length - 1, Math.floor(par * TITLES2.length / 15))] + ' · ' + par,
          text: 'A pocket cube, ' + C.plural(par, 'quarter turn') + ' from solved. Turn it back so that every face is one colour.',
          par, diff: level,
          data: { n: 2, mode: 'solve', scramble: K2.fmt(scr), solution: K2.fmt(sol) }
        };
      }
      return null;
    }
    const depth = [null, 2 + rng.int(2), 4, 5, 6, 7][level];
    for (let tries = 0; tries < 30; tries++) {
      const w = randomWalk(rng, depth);
      const start = K3.run(K3.solved(), w.join(' '));
      const r = T().solve(3, start, null, { max: depth, nodes: 3e6 });
      if (r.fail || r.len !== depth) continue;
      const sol = r.moves;
      return {
        title: TITLES3[Math.min(TITLES3.length - 1, depth)] + ' · ' + depth,
        text: 'This Rubik\'s cube is ' + C.plural(depth, 'quarter turn') + ' from solved. Find the way back.',
        par: depth, diff: level,
        data: { n: 3, mode: 'solve', scramble: w.join(' '), solution: K3.fmt(sol) }
      };
    }
    return null;
  }
  // a 2×2 position from its table index (D-B-L corner at home)
  function state2FromIndex(K, idx) {
    const pr = Math.floor(idx / 729);
    let o = idx % 729;
    const SL = [0, 1, 2, 3, 4, 5, 7];
    const fact = [720, 120, 24, 6, 2, 1, 1];
    const left = [0, 1, 2, 3, 4, 5, 6], perm = [];
    let r = pr;
    for (let i = 0; i < 7; i++) { const k = Math.floor(r / fact[i]); r -= k * fact[i]; perm.push(left.splice(k, 1)[0]); }
    const cp = new Array(8), co = new Array(8).fill(0);
    let sum = 0;
    SL.forEach((s, i) => { cp[s] = perm[i] === 6 ? 7 : perm[i]; });
    cp[6] = 6;
    for (let i = 0; i < 6; i++) { co[SL[i]] = o % 3; sum += o % 3; o = Math.floor(o / 3); }
    co[7] = (3 - sum % 3) % 3;
    return K.write({ cp, co });
  }

  /* ---------- the 3D cube ---------- */

  const BODY = '#18181f', BEVEL = '#2a2a34';

  // one cubie: a box with chamfered edges, and rounded stickers on its outer faces
  function cubieMesh(K, cc, stickers) {
    const e = 0.47, b = 0.075, verts = [], faces = [], colors = [], fsticker = [], fdir = {};
    const c = [cc[0] / 2, cc[1] / 2, cc[2] / 2];
    const P = (x, y, z) => { verts.push([c[0] + x, c[1] + y, c[2] + z]); return verts.length - 1; };
    // for each corner (sx, sy, sz): three points, one on each face
    const cv = {};
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      cv[sx + ',' + sy + ',' + sz] = {
        x: P(sx * e, sy * (e - b), sz * (e - b)),
        y: P(sx * (e - b), sy * e, sz * (e - b)),
        z: P(sx * (e - b), sy * (e - b), sz * e)
      };
    }
    const at = (sx, sy, sz) => cv[sx + ',' + sy + ',' + sz];
    const outward = (f, dir) => {
      // make the face wind counter-clockwise seen from outside (Newell normal along dir)
      let nx = 0, ny = 0, nz = 0;
      for (let k = 0; k < f.length; k++) {
        const p = verts[f[k]], q = verts[f[(k + 1) % f.length]];
        nx += (p[1] - q[1]) * (p[2] + q[2]); ny += (p[2] - q[2]) * (p[0] + q[0]); nz += (p[0] - q[0]) * (p[1] + q[1]);
      }
      return nx * dir[0] + ny * dir[1] + nz * dir[2] < 0 ? f.slice().reverse() : f;
    };
    const faceOf = {}; // direction key -> sticker facelet on this cubie
    stickers.forEach((i) => { faceOf[K.nrm[i].join()] = i; });
    // the six flat faces
    const dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
    dirs.forEach((d) => {
      const a = axisOf(d), s = signOf(d), key = ['x', 'y', 'z'][a];
      const o1 = (a + 1) % 3, o2 = (a + 2) % 3;
      const quad = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, w]) => {
        const sg = [0, 0, 0]; sg[a] = s; sg[o1] = u; sg[o2] = w;
        return at(sg[0], sg[1], sg[2])[key];
      });
      faces.push(outward(quad, d)); colors.push(BODY);
      const fl = faceOf[d.join()];
      fsticker.push(fl == null ? -1 : fl);
    });
    // twelve bevels along the edges
    for (let a = 0; a < 3; a++) {
      const o1 = (a + 1) % 3, o2 = (a + 2) % 3, k1 = ['x', 'y', 'z'][o1], k2 = ['x', 'y', 'z'][o2];
      for (const u of [-1, 1]) for (const w of [-1, 1]) {
        const sgA = [0, 0, 0], sgB = [0, 0, 0];
        sgA[a] = -1; sgA[o1] = u; sgA[o2] = w;
        sgB[a] = 1; sgB[o1] = u; sgB[o2] = w;
        const A = at(sgA[0], sgA[1], sgA[2]), B2 = at(sgB[0], sgB[1], sgB[2]);
        const d = [0, 0, 0]; d[o1] = u; d[o2] = w;
        faces.push(outward([A[k1], B2[k1], B2[k2], A[k2]], d)); colors.push(BEVEL); fsticker.push(-1); fdir[faces.length - 1] = d;
      }
    }
    // eight corner triangles
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
      const q = at(sx, sy, sz);
      faces.push(outward([q.x, q.y, q.z], [sx, sy, sz])); colors.push(BEVEL); fsticker.push(-1); fdir[faces.length - 1] = [sx, sy, sz];
    }
    // stickers: rounded squares a hair above the faces
    const half = 0.405, rad = 0.1, lift = e + 0.006;
    stickers.forEach((i) => {
      const n = K.nrm[i], a = axisOf(n);
      const u = [0, 0, 0], w = [0, 0, 0]; u[(a + 1) % 3] = 1; w[(a + 2) % 3] = 1;
      const f = [];
      [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([su, sw], k) => {
        const start = k * 90;
        for (let t = 0; t <= 3; t++) {
          const ang = (start + t * 30) * Math.PI / 180;
          const pu = su * (half - rad) + Math.cos(ang) * rad, pw = sw * (half - rad) + Math.sin(ang) * rad;
          f.push(P(n[0] * lift + u[0] * pu + w[0] * pw, n[1] * lift + u[1] * pu + w[1] * pw, n[2] * lift + u[2] * pu + w[2] * pw));
        }
      });
      faces.push(outward(f, n)); colors.push('#888'); fsticker.push(i);
    });
    return { verts, faces, colors, fsticker, fdir, lw: 1, stroke: 'rgba(0,0,0,.55)' };
  }

  function buildScene(v, K) {
    v.clear();
    // a soft shadow on the table
    const r = K.N * 0.62, sh = [], y = -K.N / 2 - 0.42;
    for (let k = 0; k < 32; k++) { const a = k / 32 * Math.PI * 2; sh.push([Math.cos(a) * r, y, Math.sin(a) * r]); }
    v.add({ verts: sh, faces: [sh.map((p, i) => i)], color: '#000000', alpha: 0.2, stroke: false, doubleSided: true, pickable: false, bias: 1e4, id: 'shadow' });
    const byCubie = new Map();
    for (let i = 0; i < K.count; i++) {
      const k = K.cub[i].join();
      if (!byCubie.has(k)) byCubie.set(k, []);
      byCubie.get(k).push(i);
    }
    const lim = K.h;
    const meshes = [];
    for (let x = -lim; x <= lim; x += 2) for (let y2 = -lim; y2 <= lim; y2 += 2) for (let z = -lim; z <= lim; z += 2) {
      const cc = [x, y2, z];
      const st = byCubie.get(cc.join()) || [];
      const m = v.add(Object.assign(cubieMesh(K, cc, st), { id: 'c' + cc.join('_'), cc }));
      meshes.push(m);
    }
    return meshes;
  }

  function isoSvg(K, s, size) {
    // an isometric picture of the U, F and R faces
    const N = K.N, sc = size / (N * 2.1);
    const pr = (p) => [(p[0] - p[2]) * 0.866 * sc, (-p[1] + (p[0] + p[2]) * 0.5) * sc];
    let out = '';
    const hex = [[1, 1, -1], [1, -1, -1], [1, -1, 1], [-1, -1, 1], [-1, 1, 1], [-1, 1, -1]].map((q) => pr(q.map((x) => x * N / 2 * 1.02)));
    out += '<polygon points="' + hex.map((q) => q.map((x) => x.toFixed(1)).join(',')).join(' ') + '" fill="#18181f" stroke="#000" stroke-width="' + (sc * 0.06).toFixed(2) + '" stroke-linejoin="round"/>';
    [0, 2, 1].forEach((f) => {
      for (let k = 0; k < K.n2; k++) {
        const i = f * K.n2 + k, P = K.pos[i].map((x) => x / 2), n = K.nrm[i], a = axisOf(n);
        const u = [0, 0, 0], w = [0, 0, 0]; u[(a + 1) % 3] = 0.43; w[(a + 2) % 3] = 0.43;
        const q = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(([su, sw]) => pr([P[0] + u[0] * su + w[0] * sw, P[1] + u[1] * su + w[1] * sw, P[2] + u[2] * su + w[2] * sw]));
        out += '<polygon points="' + q.map((x) => x.map((y) => y.toFixed(1)).join(',')).join(' ') + '" fill="' + K.COLOURS[s[i]] + '" stroke="rgba(0,0,0,.35)" stroke-width="' + (sc * 0.03).toFixed(2) + '" stroke-linejoin="round"/>';
      }
    });
    return out;
  }
  // the flat net (U on top; L F R B; D below)
  function netSvg(K, s, cell) {
    const N = K.N, fw = N * cell + 13, fh = N * cell + 4;
    const at = [[1, 0], [2, 1], [1, 1], [1, 2], [0, 1], [3, 1]];
    let out = '<svg class="rk-net" viewBox="-2 -2 ' + (4 * fw + 4) + ' ' + (3 * fh + 4) + '">';
    for (let f = 0; f < 6; f++) {
      const x0 = at[f][0] * fw + 11, y0 = at[f][1] * fh;
      out += '<rect x="' + x0 + '" y="' + y0 + '" width="' + (N * cell + 2) + '" height="' + (N * cell + 2) + '" rx="3" fill="#18181f"/>';
      for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
        out += '<rect x="' + (x0 + 1.5 + c * cell) + '" y="' + (y0 + 1.5 + r * cell) + '" width="' + (cell - 1.5) + '" height="' + (cell - 1.5) + '" rx="' + (cell * 0.18).toFixed(1) + '" fill="' + K.COLOURS[s[f * N * N + r * N + c]] + '"/>';
      }
      out += '<text x="' + (x0 - 3) + '" y="' + (y0 + N * cell / 2 + 4) + '" class="rk-netl" text-anchor="end">' + K.FACES[f] + '</text>';
    }
    return out + '</svg>';
  }

  /* ---------- playing ---------- */

  const DEF_CAM = { yaw: 32, pitch: 27 };

  function mount(ctx, p) {
    const d = p.data, N = d.n, Tw = T(), K = Tw.cube(N), wb = ctx.wb, mode = d.mode;
    const S0 = K.solved();
    const goal = goalOf(K, d);
    let s = startOf(K, d);
    let hist = [];                                   // turns since the start: move objects with .nm (their name when made)
    let base = mode === 'pattern' ? [] : K.parse(d.scramble || '');   // from solved to the start
    let solving = false, scrambling = false, drag = null, hintOn = null, hintT = 0, runId = 0;
    let labels = C.store.get('rubik-labels', true);
    const timers = [];
    const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };

    if (N === 3) Tw.prepare3(); else Tw.prepare2();

    ctx.setGoal(mode === 'pattern'
      ? 'Make the pattern in the picture (it may face any way).'
      : mode === 'free' ? 'Scramble it and solve it: every face one colour, against the clock.'
        : 'Solve the cube: every face one colour. Par ' + C.plural(p.par, 'quarter turn') + '.');

    /* ----- the stage ----- */
    wb.host.classList.add('rk-stage');
    const v = wb.use3D({ down: onDown, move: onMove, up: onUp, hover: onHover, after: overlay });
    wb.set3D(true);
    v.cam.minPitch = -80; v.cam.maxPitch = 80;
    const meshes = buildScene(v, K);
    meshes.forEach((m) => {
      m.stickerFaces = [];
      m.fsticker.forEach((i, fi) => { if (i >= 0 && m.faces[fi].length > 4) m.stickerFaces.push([fi, i]); });
    });
    function resetView() {
      v.margins = { b: wb.isNarrow() ? 118 : 104, t: mode === 'free' ? 40 : 0 };
      v.cam.yaw = DEF_CAM.yaw; v.cam.pitch = DEF_CAM.pitch;
      v.fit(1.12);
      v.cam.target = [0, -0.12, 0];
      v.render();
    }
    function recolour() {
      meshes.forEach((m) => m.stickerFaces.forEach(([fi, i]) => { m.colors[fi] = K.COLOURS[s[i]]; }));
    }
    function setAngle(a, lays, deg) {
      const ax = [0, 0, 0]; ax[a] = 1;
      const R = C.M4.rotate(deg, ax), I = C.M4.id();
      meshes.forEach((x) => { x.m = lays.indexOf(x.cc[a]) >= 0 ? R : I; });
    }
    function resetAngles() { meshes.forEach((x) => { x.m = C.M4.id(); }); }
    function frame() { return viewFrame(v.basis()); }

    /* ----- turning: a queue of animated quarter turns ----- */
    const queue = [];
    let anim = null;
    function enqueue(m, how, extra) { queue.push(Object.assign({ m, how }, extra || {})); next(); }
    function next() {
      if (anim || !queue.length) return;
      const it = queue.shift();
      const target = it.target != null ? it.target : it.m.q * 90, from = it.from || 0;
      const fast = it.how === 'silent' || queue.length > 1;
      const ms = C.anim(Math.max(70, Math.min(320, Math.abs(target - from) * (fast ? 0.8 : 1.9))));
      const rec = { it };
      anim = rec;
      rec.stop = C.tween(ms, (t) => { setAngle(it.m.a, it.m.lays, from + (target - from) * t); v.render(); }, () => {
        if (anim === rec) anim = null;
        if (it.m.q) commit(it.m, it.how); else { resetAngles(); v.render(); }
        if (it.after) it.after(); else next();
      });
    }
    // finish every pending turn at once (before a drag starts, a hint …)
    function flush() {
      if (anim) { const it = anim.it; anim.stop(); anim = null; if (it.m.q) commit(it.m, it.how); }
      while (queue.length) { const it = queue.shift(); if (it.m.q) commit(it.m, it.how); }
      resetAngles(); recolour(); v.render();
    }
    // forget pending turns (the state is being replaced)
    function drop() {
      runId++;
      if (anim) { anim.stop(); anim = null; }
      queue.length = 0;
      drag = null; solving = false; scrambling = false;
      resetAngles();
    }
    function commit(m, how) {
      s = K.apply(s, m);
      resetAngles(); recolour();
      if (how === 'silent') { v.render(); return; }
      hist.push(m);
      ctx.move(K.cost(hist));
      drawLog();
      if (hintOn) clearHint();
      if (how === 'solve') { v.render(); return; }
      ctx.sfx('tap');
      if (mode === 'free') startClock();
      v.render();
      ctx.changed('turn');
    }
    function press(letter, prime, twice) {
      if (solving || scrambling || drag) return;
      const m = letterMove(K, letter, prime, frame(), twice);
      if (!m) return;
      m.nm = letter + (twice ? '2' : prime ? '′' : '');
      enqueue(m, 'user');
    }

    /* ----- dragging a sticker ----- */
    // the sticker under a pick; a press on a bevel counts for the nearest sticker of that cubie that faces you
    function stickerAt(hit) {
      if (!hit || !hit.mesh || !hit.mesh.fsticker) return -1;
      const m = hit.mesh, i = m.fsticker[hit.face];
      if (i >= 0) return i;
      const d = m.fdir && m.fdir[hit.face];
      if (!d) return -1;
      const e = v.basis().e;
      let best = -1, bs = 0.05;
      m.stickerFaces.forEach(([, j]) => {
        const n = K.nrm[j];
        if (dot(n, d) <= 0) return;
        const P = K.pos[j].map((x) => x / 2), to = [e[0] - P[0], e[1] - P[1], e[2] - P[2]];
        const sc = dot(n, to) / Math.hypot(to[0], to[1], to[2]);
        if (sc > bs) { bs = sc; best = j; }
      });
      return best;
    }
    let tapTold = 0;
    function onDown(hit, ev, pt) {
      if (solving || scrambling) return true;
      const i = stickerAt(hit);
      if (i == null || i < 0) return false; // the table: look around
      flush();
      drag = { i, start: pt, a: -1, angle: 0 };
      v.canvas.style.cursor = 'grabbing';
      return true;
    }
    function onMove(ev, pt) {
      if (!drag) return;
      const dx = pt[0] - drag.start[0], dy = pt[1] - drag.start[1];
      if (drag.a < 0) {
        if (Math.hypot(dx, dy) < 7) return;
        const i = drag.i, P = K.pos[i].map((x) => x / 2), na = axisOf(K.nrm[i]);
        const B = v.basis(), p0 = v.project(P, B);
        let best = null;
        for (let a = 0; a < 3; a++) {
          if (a === na) continue;
          const ax = [0, 0, 0]; ax[a] = 1;
          const vel = cross(ax, P);
          const p1 = v.project([P[0] + vel[0] * 0.05, P[1] + vel[1] * 0.05, P[2] + vel[2] * 0.05], B);
          const sx = (p1[0] - p0[0]) / 0.05, sy = (p1[1] - p0[1]) / 0.05, len = Math.hypot(sx, sy);
          if (len < 1e-6) continue;
          const score = Math.abs(dx * sx + dy * sy) / len;
          if (!best || score > best.score) best = { a, sx, sy, len, score };
        }
        if (!best) return;
        drag.a = best.a; drag.sx = best.sx; drag.sy = best.sy; drag.len2 = best.len * best.len;
        drag.lays = [K.cub[i][best.a]];
      }
      const rad = (dx * drag.sx + dy * drag.sy) / drag.len2;
      drag.angle = Math.max(-200, Math.min(200, rad * 180 / Math.PI));
      setAngle(drag.a, drag.lays, drag.angle);
      v.render();
    }
    function onUp() {
      const dr = drag;
      drag = null;
      v.canvas.style.cursor = '';
      if (!dr) return;
      if (dr.a < 0) {
        if (tapTold++ < 2) ctx.toast('Drag the sticker across the cube to turn its layer.');
        return;
      }
      let k = Math.round(dr.angle / 90);
      if (k === 0 && Math.abs(dr.angle) > 16) k = Math.sign(dr.angle);
      k = Math.max(-2, Math.min(2, k));
      const m = K.mv(dr.a, dr.lays, k);
      if (k) m.nm = moveName(K, m, frame());
      queue.unshift({ m, how: 'user', from: dr.angle, target: k * 90 });
      next();
    }
    function onHover(hit) {
      if (drag) return;
      v.canvas.style.cursor = !solving && stickerAt(hit) >= 0 ? 'grab' : '';
    }
    // a second finger means a pinch: let go of the layer
    const onSecond = () => {
      if (drag && v.pointers.size >= 1) {
        const dr = drag; drag = null;
        if (dr.a >= 0) { queue.unshift({ m: K.mv(dr.a, dr.lays, 0), how: 'user', from: dr.angle, target: 0 }); next(); }
      }
    };
    v.canvas.addEventListener('pointerdown', onSecond, true);

    /* ----- drawing over the cube: face letters and the hint arrow ----- */
    function overlay(g, view) {
      const B = view.basis();
      if (labels && !drag) {
        const fr = frame();
        g.save();
        g.font = '700 12px "Segoe UI", system-ui, sans-serif';
        g.textAlign = 'center'; g.textBaseline = 'middle';
        ['U', 'D', 'L', 'R', 'F', 'B'].forEach((l) => {
          const dir = fr[l], c = [dir[0] * N / 2, dir[1] * N / 2, dir[2] * N / 2];
          const toEye = [B.e[0] - c[0], B.e[1] - c[1], B.e[2] - c[2]];
          const k = dot(dir, toEye) / Math.hypot(toEye[0], toEye[1], toEye[2]);
          if (k < 0.2) return;
          const q = view.project(c, B);
          g.globalAlpha = Math.min(1, (k - 0.2) * 3);
          g.fillStyle = 'rgba(12,14,24,.62)';
          g.beginPath(); g.arc(q[0], q[1], 10, 0, Math.PI * 2); g.fill();
          g.fillStyle = '#fff';
          g.fillText(l, q[0], q[1] + 0.5);
        });
        g.restore();
      }
      if (hintOn) drawArrow(g, view, B, hintOn.m);
    }
    function drawArrow(g, view, B, m) {
      const a = m.a, u = [0, 0, 0], w = [0, 0, 0], ax = [0, 0, 0];
      u[(a + 1) % 3] = 1; w[(a + 2) % 3] = 1; ax[a] = 1;
      const lw = m.lays.length === K.layers.length ? 0 : m.lays[0] / 2;
      const r = N / 2 * 1.3;
      const mid = Math.atan2(dot(B.e, w), dot(B.e, u));
      const sweep = Math.PI / 2 * Math.min(2, Math.abs(m.q)) * 0.85, sg = Math.sign(m.q);
      const pts = [];
      for (let k = 0; k <= 24; k++) {
        const ph = mid - sg * sweep / 2 + sg * sweep * k / 24;
        const cs = Math.cos(ph) * r, sn = Math.sin(ph) * r;
        pts.push(view.project([ax[0] * lw + u[0] * cs + w[0] * sn, ax[1] * lw + u[1] * cs + w[1] * sn, ax[2] * lw + u[2] * cs + w[2] * sn], B));
      }
      g.save();
      g.lineCap = 'round'; g.lineJoin = 'round';
      const path = () => { g.beginPath(); pts.forEach((q, k) => (k ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]))); };
      path(); g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 9; g.stroke();
      path(); g.strokeStyle = '#ffd166'; g.lineWidth = 5; g.stroke();
      const e = pts[pts.length - 1], f = pts[pts.length - 3];
      const ang = Math.atan2(e[1] - f[1], e[0] - f[0]);
      g.beginPath();
      g.moveTo(e[0] + Math.cos(ang) * 12, e[1] + Math.sin(ang) * 12);
      g.lineTo(e[0] + Math.cos(ang + 2.4) * 12, e[1] + Math.sin(ang + 2.4) * 12);
      g.lineTo(e[0] + Math.cos(ang - 2.4) * 12, e[1] + Math.sin(ang - 2.4) * 12);
      g.closePath();
      g.fillStyle = '#ffd166'; g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 2;
      g.stroke(); g.fill();
      g.restore();
    }
    function showHint(m) {
      clearHint();
      hintOn = { m };
      meshes.forEach((x) => {
        if (m.lays.indexOf(x.cc[m.a]) < 0) return;
        x.selFaces = {};
        x.stickerFaces.forEach(([fi]) => { x.selFaces[fi] = true; });
        x.selColor = '#ffd166';
      });
      v.render();
      clearTimeout(hintT);
      hintT = later(clearHint, 4200);
    }
    function clearHint() {
      if (!hintOn) return;
      hintOn = null;
      meshes.forEach((x) => { x.selFaces = null; });
      v.render();
    }
    /* ----- the move pad (letters as you see the cube) ----- */
    const letters = N === 3 ? ['U', 'D', 'L', 'R', 'F', 'B', 'M', 'E', 'S'] : ['U', 'D', 'L', 'R', 'F', 'B'];
    const pad = ctx.h('div.rk-pad');
    const grid = ctx.h('div.rk-grid');
    grid.style.setProperty('--cols', letters.length);
    [false, true].forEach((prime) => letters.forEach((l) => {
      const nm = l + (prime ? '′' : '');
      grid.appendChild(ctx.h('button.rk-btn' + ('MES'.includes(l) ? '.sl' : ''), {
        type: 'button', title: nm + ': ' + describe(prime ? l + "'" : l) + ' (key ' + (prime ? 'Shift+' : '') + l + ')',
        onclick: () => press(l, prime)
      }, nm));
    }));
    const foldBtn = ctx.h('button.rk-fold', { type: 'button', title: 'Hide or show the move pad', onclick: () => { pad.classList.toggle('folded'); foldBtn.textContent = pad.classList.contains('folded') ? '▴' : '▾'; } }, '▾');
    pad.append(ctx.h('div.rk-pad-head', ctx.h('span', 'Drag a sticker to turn its layer · drag the table to look around'), foldBtn), grid);
    const clockEl = ctx.h('div.rk-clock');
    wb.host.append(pad, clockEl);
    clockEl.hidden = mode !== 'free';

    /* ----- the side panel ----- */
    const logEl = ctx.h('div.rk-log');
    if (mode === 'pattern') {
      ctx.panel.appendChild(ctx.h('div.rk-goalpic', ctx.h('div.rk-cap', 'The pattern to make'), ctx.h('div', { html: netSvg(K, goal, N === 3 ? 12 : 16) })));
    }
    if (mode === 'free') {
      ctx.button('New scramble', () => newScramble(), 'gold');
    }
    const lblBtn = ctx.button(labels ? 'Hide face letters' : 'Show face letters', () => {
      labels = !labels; C.store.set('rubik-labels', labels);
      lblBtn.textContent = labels ? 'Hide face letters' : 'Show face letters';
      v.render();
    }, 'small ghost');
    ctx.button('Reset the view', () => resetView(), 'small ghost');
    ctx.panel.appendChild(ctx.h('div.rk-cap', 'Your turns'));
    ctx.panel.appendChild(logEl);
    function drawLog() {
      const names = hist.map((m) => m.nm || '?');
      logEl.textContent = names.length ? (names.length > 40 ? '… ' : '') + names.slice(-40).join(' ') : '—';
    }

    /* ----- the clock (free play) ----- */
    const clock = { t0: 0, run: false, done: false, took: 0 };
    let clockT = 0;
    const best = () => C.store.get('rubik-best-' + N, null);
    function fmtT(ms) { const t = ms / 1000, m = Math.floor(t / 60); return (m ? m + ':' + String(Math.floor(t % 60)).padStart(2, '0') : Math.floor(t)) + '.' + Math.floor((t * 10) % 10); }
    function drawClock() {
      if (mode !== 'free') return;
      const b = best();
      const t = clock.run ? Date.now() - clock.t0 : clock.took;
      clockEl.innerHTML = '<b>' + (clock.run || clock.done ? fmtT(t) : 'Ready') + '</b>' +
        (clock.run || clock.done ? '' : '<small>the clock starts with your first turn</small>') +
        (b ? '<small>best ' + fmtT(b) + '</small>' : '');
      clockEl.classList.toggle('done', clock.done);
    }
    function startClock() {
      if (clock.run || clock.done) return;
      clock.run = true; clock.t0 = Date.now();
      clearInterval(clockT);
      clockT = setInterval(drawClock, 100);
    }
    function stopClock() {
      if (!clock.run) return;
      clock.run = false; clock.done = true; clock.took = Date.now() - clock.t0;
      clearInterval(clockT);
      if (!ctx.isRevealed() && !(best() <= clock.took)) C.store.set('rubik-best-' + N, clock.took);
      drawClock();
    }
    function resetClock() { clearInterval(clockT); clock.run = false; clock.done = false; clock.took = 0; drawClock(); }
    drawClock();

    function newScramble() {
      if (solving || scrambling) return;
      drop(); clearHint();
      const rng = C.rng((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0);
      const scr = scrambleText(rng, N);
      s = S0.slice(); hist = []; base = K.parse(scr);
      recolour(); v.render();
      ctx.move(0); drawLog(); resetClock();
      scrambling = true;
      const list = base.slice(), id = runId;
      let k = 0;
      const step = () => {
        if (id !== runId) return;
        if (k >= list.length) { scrambling = false; ctx.say('Scrambled: ' + pretty(scr)); ctx.changed('scramble'); return; }
        const m = list[k++];
        queue.push({ m, how: 'silent', after: step });
        next();
      };
      step();
    }

    /* ----- a plan: the shortest way (bounded search), else the way back we know ----- */
    function makePlan(nodes) {
      const r = Tw.solve(N, s, goal, { max: 14, nodes });
      if (!r.fail) return { moves: r.moves, optimal: true, len: r.len };
      let list;
      if (mode === 'free') list = K.inverse(base.concat(hist));
      else if (mode === 'solve') list = K.inverse(hist).concat(K.parse(d.solution));
      else list = K.inverse(hist).concat(K.parse(d.pattern));
      return { moves: simplify(K, list), optimal: false, undo: hist.length > 0 };
    }

    resetView();
    recolour();
    drawLog();
    v.render();
    const ro = root.ResizeObserver ? new root.ResizeObserver(() => { v.margins = { b: wb.isNarrow() ? 118 : 104, t: mode === 'free' ? 40 : 0 }; v.render(); }) : null;
    if (ro) ro.observe(wb.host);

    return {
      check() {
        const ok = goal ? K.matches(s, goal) : K.isSolved(s);
        if (ok) {
          if (mode === 'free') stopClock();
          return { solved: true, msg: goal ? 'That is the pattern!' : mode === 'free' && clock.took ? 'Solved in ' + fmtT(clock.took) + '.' : 'Solved!' };
        }
        let faces = 0;
        for (let f = 0; f < 6; f++) { let one = true; for (let i = 1; i < K.n2; i++) if (s[f * K.n2 + i] !== s[f * K.n2]) one = false; if (one) faces++; }
        return { solved: false, msg: goal ? 'Not the pattern yet.' : C.plural(faces, 'face') + ' of 6 ' + (faces === 1 ? 'is' : 'are') + ' one colour so far.' };
      },
      hint() {
        if (solving || scrambling) return null;
        flush();
        const pl = makePlan(mode === 'free' ? 3e5 : 6e5);
        if (!pl.moves.length) return 'It is already there — look again!';
        const m = pl.moves[0], nm = moveName(K, m, frame());
        let text;
        if (pl.optimal) text = 'Try **' + nm + '**: ' + describe(nm.replace('′', "'")) + '. From here the shortest way takes ' + C.plural(pl.len, 'quarter turn') + '.';
        else if (mode === 'free') text = 'This is too far for a quick search (a whole cube can need 20 face turns). One sure way home is to retrace everything backwards, starting with **' + nm + '**: ' + describe(nm.replace('′', "'")) + '. Ask again when you are closer — within about ten quarter turns the hint finds the shortest way.';
        else if (pl.undo) text = 'The cube has wandered a long way from the goal. Take back your last turn: **' + nm + '** (' + describe(nm.replace('′', "'")) + ').';
        else text = 'Start with **' + nm + '**: ' + describe(nm.replace('′', "'")) + '.';
        return { text, show() { showHint(m); } };
      },
      solve() {
        if (scrambling) drop();
        flush();
        clearHint();
        const pl = makePlan(1e6);
        solving = true;
        const id = runId;
        let k = 0;
        const step = () => {
          if (id !== runId) return;
          if (k >= pl.moves.length) { solving = false; ctx.changed('solve'); return; }
          const m = pl.moves[k++];
          m.nm = moveName(K, m, frame());
          queue.push({ m, how: 'solve', after: () => later(step, C.anim(40)) });
          next();
        };
        step();
      },
      explain() {
        if (mode === 'solve') return 'One shortest way back: **' + pretty(d.solution) + '** (' + C.plural(p.par, 'quarter turn') + ', in the notation of the cube as first shown: white on top, green in front). The scramble was ' + pretty(d.scramble) + '.';
        if (mode === 'pattern') return 'One way to make it from a solved cube: **' + pretty(d.pattern) + '**.';
        return '';
      },
      getState() {
        return { s: s.join(''), h: hist.map((m) => [m.a, m.lays, m.q, m.nm || '']), b: mode === 'free' ? K.fmt(base) : undefined };
      },
      setState(st) {
        if (!st || !st.s) return;
        drop(); clearHint();
        s = st.s.split('').map(Number);
        hist = (st.h || []).map((x) => { const m = K.mv(x[0], x[1], x[2]); m.nm = x[3]; return m; });
        if (mode === 'free' && st.b != null) base = K.parse(st.b);
        recolour(); drawLog();
        v.render();
      },
      reset() { if (mode === 'free') resetClock(); },
      key(ev) {
        if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        if (k && k.length === 1) {
          const up = k.toUpperCase(), low = k.toLowerCase();
          if ('UDLRFB'.includes(up) || (N === 3 && 'MES'.includes(up))) { press(up, ev.shiftKey); return true; }
          if ('xyz'.includes(low)) { press(low, ev.shiftKey); return true; }
        }
        const turn = { ArrowLeft: [30, 0], ArrowRight: [-30, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[k];
        if (turn) {
          const y0 = v.cam.yaw, p0 = v.cam.pitch, p1 = Math.max(-80, Math.min(80, p0 + turn[1]));
          v.animate(C.anim(220), (t) => { v.cam.yaw = y0 + turn[0] * t; v.cam.pitch = p0 + (p1 - p0) * t; });
          return true;
        }
        return false;
      },
      destroy() {
        drop();
        timers.forEach((t) => clearTimeout(t));
        clearInterval(clockT);
        if (ro) ro.disconnect();
        v.canvas.removeEventListener('pointerdown', onSecond, true);
        pad.remove(); clockEl.remove();
        wb.host.classList.remove('rk-stage');
      }
    };
  }

  // a random scramble for free play: face turns, no face twice running, opposite faces in one order
  function scrambleText(rng, N) {
    const faces = N === 3 ? NAMES6 : ['U', 'R', 'F'];
    const len = N === 3 ? 25 : 11, out = [];
    let pf = -1, pp = -1;
    while (out.length < len) {
      const fi = rng.int(faces.length);
      if (fi === pf) continue;
      if (N === 3 && pf >= 0 && fi % 3 === pf % 3 && (pp === fi || fi < pf)) continue;
      out.push(faces[fi] + rng.pick(['', "'", '2']));
      pp = pf; pf = fi;
    }
    return out.join(' ');
  }

  function thumb(p) {
    const d = p.data;
    if (!C.Twisty) return '';
    const K = T().cube(d.n);
    const s = d.mode === 'pattern' ? goalOf(K, d) : startOf(K, d);
    return '<svg viewBox="-60 -60 120 120" preserveAspectRatio="xMidYMid meet">' + isoSvg(K, s, 104) + '</svg>';
  }

  C.engine({
    id: 'rubik',
    name: 'Rubik\'s cube',
    tools: [],
    deps: ['js/lib/twisty.js'],
    stateVersion: 1,
    about: '**Drag a sticker** across the cube to turn its layer: the layer follows your finger and settles on the nearest quarter turn. **Drag the table** around the cube to look at it from another side; the wheel or two fingers zoom, and 0 fits the view again.\n\n' +
      'Or use the **move pad** and the keys, in the usual notation: **U D L R F B** turn the top, bottom, left, right, front and back faces a quarter turn clockwise (as you look at that face); **Shift** turns the other way (U′). ' +
      'On the 3×3, **M E S** turn the middle slices, and **x y z** turn the whole cube. The letters always mean the cube as you see it now: F is the face toward you. The arrow keys walk around the cube.\n\n' +
      'Moves are counted in **quarter turns**: a half turn counts two, and so does a middle-slice turn (it does the work of two outer turns). A hint shows the next turn of a shortest way from where you are, with an arrow on the cube.',
    verify,
    generate,
    mount,
    thumb
  });

  C.rubik = { verify, generate, letterMove, moveName, viewFrame, REF_FRAME, simplify, randomWalk, scrambleText, isoSvg, netSvg, state2FromIndex };

  C.css('rubik', `
    .rk-stage .wb-tools { display: none; }
    .rk-stage .wb-toast { bottom: 120px; }
    .rk-pad {
      position: absolute; left: 50%; transform: translateX(-50%); bottom: 10px; z-index: 5; padding: 5px 8px 8px; border-radius: 13px;
      background: color-mix(in srgb, var(--panel) 93%, transparent); border: 1px solid var(--line); box-shadow: 0 8px 22px var(--shadow);
    }
    .rk-pad-head { display: flex; align-items: center; gap: 8px; margin: 0 0 5px; font-size: .74rem; color: var(--muted); white-space: nowrap; }
    .rk-pad-head span { overflow: hidden; text-overflow: ellipsis; }
    .rk-pad.folded .rk-grid { display: none; }
    .rk-pad.folded .rk-pad-head { margin: 0; }
    .rk-fold { margin-left: auto; width: 22px; height: 20px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel-2); color: var(--muted); font: 700 13px/1 "Segoe UI", system-ui, sans-serif; cursor: pointer; padding: 0; flex: 0 0 auto; }
    .rk-grid { display: grid; grid-template-columns: repeat(var(--cols), 40px); gap: 4px; }
    .rk-btn {
      height: 34px; padding: 0; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); border-radius: 9px;
      font: 700 15px "Segoe UI", system-ui, sans-serif; cursor: pointer; touch-action: manipulation; transition: background .1s, border-color .1s, transform .06s;
    }
    .rk-btn.sl { color: var(--muted); }
    .rk-btn:hover { border-color: var(--accent); }
    .rk-btn:active { transform: translateY(1px); background: var(--accent); color: #fff; }
    .rk-clock {
      position: absolute; left: 50%; transform: translateX(-50%); top: 10px; z-index: 5; display: flex; align-items: baseline; gap: 10px;
      padding: 4px 14px; border-radius: 11px; background: color-mix(in srgb, var(--panel) 90%, transparent); border: 1px solid var(--line);
    }
    .rk-clock b { font: 800 20px ui-monospace, "Cascadia Mono", Consolas, monospace; color: var(--text); }
    .rk-clock small { color: var(--muted); font-size: .74rem; }
    .rk-clock.done b { color: var(--green); }
    .rk-cap { font-size: .78rem; color: var(--muted); margin: 6px 0 3px; width: 100%; }
    .rk-log { font: 600 .84rem ui-monospace, "Cascadia Mono", Consolas, monospace; color: var(--text); word-spacing: .2em; line-height: 1.5; width: 100%; max-height: 7.5em; overflow: auto; }
    .rk-goalpic { width: 100%; }
    .rk-net { width: 100%; max-width: 240px; display: block; }
    .rk-netl { font: 700 9px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    @media (max-width: 640px) {
      .rk-pad { left: 4px; right: 4px; transform: none; bottom: 4px; padding: 4px 5px 5px; }
      .rk-grid { grid-template-columns: repeat(var(--cols), 1fr); gap: 3px; }
      .rk-btn { height: 34px; font-size: 14px; }
      .rk-stage .wb-toast { bottom: 110px; }
    }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
