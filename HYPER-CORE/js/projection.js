/* HYPER-CORE · projection.js
 *
 * Projections for simulations, the tools and tests (kit.proj / Hyper.proj): the matrices of
 * parallel and central projection, the camera, vanishing points, curvilinear (fisheye,
 * cylindrical, spherical) mappings, the sphere and its geodesy, and a registry of map
 * projections with graticules, outlines, path clipping and Tissot's indicatrix. Nothing here
 * touches the DOM; tools/test-projection.js exercises it.
 *
 *   P.mat4   identity mul chain apply point dir translate scale rotX rotY rotZ rotAxis transpose inverse det toTex toText
 *   P.ortho() P.view('top'|'front'|'right'…) P.layout('first'|'third') P.axonometric(α, β) P.isometric() P.dimetric()
 *   P.axonAxes(R) P.oblique(angle, ratio) P.cavalier() P.cabinet() P.planometric(angle) P.perspective(d) P.lookAt(eye, at, up)
 *   P.perspectiveGL(fovy, aspect, n, f) P.orthoGL(l, r, b, t, n, f) P.vanishing(M, dir) P.boxVanishing(M) P.project(M, pts)
 *   P.fisheye(model, dir, f) P.cylindricalPersp(dir, f) P.equirectDir(dir) P.dirFromAngles(az, alt) P.CURVI
 *   P.sph (radians: toVec fromVec rotate angDist bearing destination greatCircle rhumb)   P.geo (degrees, km)
 *   P.maps  add get list project invert graticule path outline tissot distortion extent   (≈45 projections)
 *   P.models cube box house lbracket cylinder pyramid stairs   P.visibleFaces(M, model)
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const P = H.proj = {};
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, acos = Math.acos, atan = Math.atan, atan2 = Math.atan2;
  const sqrt = Math.sqrt, abs = Math.abs, ln = Math.log, hypot = Math.hypot;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const sgn = x => x < 0 ? -1 : 1;
  P.PI = PI; P.TAU = TAU; P.D2R = D2R; P.R2D = R2D;
  P.toRad = d => d * D2R; P.toDeg = r => r * R2D;

  /* ---------------------------------------------------------------- vectors */
  P.add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  P.sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  P.scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  P.dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  P.cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  P.len = a => hypot(a[0], a[1], a[2]);
  P.unit = a => { const l = P.len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  P.lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  /* ---------------------------------------------------------------- 4×4 matrices (row-major, flat) */
  const M4 = P.mat4 = {
    identity: () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    fromRows: rows => [].concat(...rows),
    rows: M => [M.slice(0, 4), M.slice(4, 8), M.slice(8, 12), M.slice(12, 16)],
    mul(A, B) {                                     // A·B
      const C = new Array(16);
      for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
        let s = 0; for (let k = 0; k < 4; k++) s += A[r * 4 + k] * B[k * 4 + c];
        C[r * 4 + c] = s;
      }
      return C;
    },
    chain() { let M = M4.identity(); for (const X of arguments) M = M4.mul(M, X); return M; },   // chain(A, B, C) = A·B·C: C acts first
    apply(M, v) {                                    // v = [x, y, z] or [x, y, z, w] -> [x', y', z', w']
      const x = v[0], y = v[1], z = v[2], w = v.length > 3 ? v[3] : 1;
      return [M[0] * x + M[1] * y + M[2] * z + M[3] * w, M[4] * x + M[5] * y + M[6] * z + M[7] * w,
        M[8] * x + M[9] * y + M[10] * z + M[11] * w, M[12] * x + M[13] * y + M[14] * z + M[15] * w];
    },
    point(M, p) {                                    // the projected point, divided by w; null when w ≈ 0 (at infinity or behind the eye)
      const q = M4.apply(M, [p[0], p[1], p[2], 1]);
      if (abs(q[3]) < 1e-12) return null;
      return [q[0] / q[3], q[1] / q[3], q[2] / q[3]];
    },
    dir(M, d) { return M4.apply(M, [d[0], d[1], d[2], 0]); },
    translate: (x, y, z) => [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1],
    scale: (x, y, z) => [x, 0, 0, 0, 0, y == null ? x : y, 0, 0, 0, 0, z == null ? x : z, 0, 0, 0, 0, 1],
    rotX: a => [1, 0, 0, 0, 0, cos(a), -sin(a), 0, 0, sin(a), cos(a), 0, 0, 0, 0, 1],
    rotY: a => [cos(a), 0, sin(a), 0, 0, 1, 0, 0, -sin(a), 0, cos(a), 0, 0, 0, 0, 1],
    rotZ: a => [cos(a), -sin(a), 0, 0, sin(a), cos(a), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    rotAxis(axis, a) {
      const u = P.unit(axis), c = cos(a), s = sin(a), t = 1 - c, x = u[0], y = u[1], z = u[2];
      return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, 0, t * x * y + s * z, t * y * y + c, t * y * z - s * x, 0, t * x * z - s * y, t * y * z + s * x, t * z * z + c, 0, 0, 0, 0, 1];
    },
    transpose: M => [M[0], M[4], M[8], M[12], M[1], M[5], M[9], M[13], M[2], M[6], M[10], M[14], M[3], M[7], M[11], M[15]],
    det(M) {
      const m = M;
      return m[3] * m[6] * m[9] * m[12] - m[2] * m[7] * m[9] * m[12] - m[3] * m[5] * m[10] * m[12] + m[1] * m[7] * m[10] * m[12] +
        m[2] * m[5] * m[11] * m[12] - m[1] * m[6] * m[11] * m[12] - m[3] * m[6] * m[8] * m[13] + m[2] * m[7] * m[8] * m[13] +
        m[3] * m[4] * m[10] * m[13] - m[0] * m[7] * m[10] * m[13] - m[2] * m[4] * m[11] * m[13] + m[0] * m[6] * m[11] * m[13] +
        m[3] * m[5] * m[8] * m[14] - m[1] * m[7] * m[8] * m[14] - m[3] * m[4] * m[9] * m[14] + m[0] * m[7] * m[9] * m[14] +
        m[1] * m[4] * m[11] * m[14] - m[0] * m[5] * m[11] * m[14] - m[2] * m[5] * m[8] * m[15] + m[1] * m[6] * m[8] * m[15] +
        m[2] * m[4] * m[9] * m[15] - m[0] * m[6] * m[9] * m[15] - m[1] * m[4] * m[10] * m[15] + m[0] * m[5] * m[10] * m[15];
    },
    inverse(M) {                                     // Gauss–Jordan; null when singular
      const a = M4.rows(M).map((r, i) => r.concat([0, 0, 0, 0].map((_, j) => i === j ? 1 : 0)));
      for (let c = 0; c < 4; c++) {
        let p = c; for (let r = c + 1; r < 4; r++) if (abs(a[r][c]) > abs(a[p][c])) p = r;
        if (abs(a[p][c]) < 1e-14) return null;
        [a[c], a[p]] = [a[p], a[c]];
        const d = a[c][c]; for (let j = 0; j < 8; j++) a[c][j] /= d;
        for (let r = 0; r < 4; r++) if (r !== c) { const f = a[r][c]; if (f) for (let j = 0; j < 8; j++) a[r][j] -= f * a[c][j]; }
      }
      return [].concat(...a.map(r => r.slice(4)));
    },
    /* the matrix as TeX (bmatrix) or plain text, numbers to `digits` decimals with trailing zeros trimmed */
    fmt(x, digits) {
      if (abs(x) < 1e-12) return '0';
      let s = Number(x.toFixed(digits == null ? 3 : digits)).toString();
      if (s === '-0') s = '0';
      return s;
    },
    toTex(M, digits) { return '\\begin{bmatrix}' + M4.rows(M).map(r => r.map(x => M4.fmt(x, digits)).join(' & ')).join(' \\\\ ') + '\\end{bmatrix}'; },
    toText(M, digits) { return M4.rows(M).map(r => r.map(x => M4.fmt(x, digits).padStart(7)).join(' ')).join('\n'); },
    equal(A, B, tol) { tol = tol || 1e-9; for (let i = 0; i < 16; i++) if (abs(A[i] - B[i]) > tol) return false; return true; }
  };

  /* ---------------------------------------------------------------- parallel projections */
  /* The picture plane is the xy-plane; the viewer looks along −z (so +z faces the viewer). A projection
     matrix maps object coordinates to paper coordinates (x', y'); the third row keeps a depth value for
     sorting faces and testing hidden lines. P.dropZ(M) zeroes it, which is what is written on paper. */
  P.ortho = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  P.dropZ = M => { const N = M.slice(); N[8] = N[9] = N[10] = N[11] = 0; return N; };
  /* the six principal views: the rotation that turns the chosen face towards the viewer */
  const VIEWS = {
    front: { R: M4.identity(), title: 'Front view', dir: [0, 0, 1] },
    back: { R: M4.rotY(PI), title: 'Rear view', dir: [0, 0, -1] },
    right: { R: M4.rotY(-PI / 2), title: 'Right side view', dir: [1, 0, 0] },
    left: { R: M4.rotY(PI / 2), title: 'Left side view', dir: [-1, 0, 0] },
    top: { R: M4.rotX(PI / 2), title: 'Top view (plan)', dir: [0, 1, 0] },
    bottom: { R: M4.rotX(-PI / 2), title: 'Bottom view', dir: [0, -1, 0] }
  };
  P.VIEWS = VIEWS;
  P.view = name => { const v = VIEWS[name]; if (!v) throw new Error('unknown view ' + name); return v.R.slice(); };
  /* where each view is placed around the front view on the sheet (in units of one view's pitch): first-angle
     (ISO, the object between the viewer and the plane) and third-angle (the plane between viewer and object) */
  P.layout = angle => angle === 'first'
    ? { front: [0, 0], top: [0, -1], bottom: [0, 1], right: [-1, 0], left: [1, 0], back: [2, 0] }
    : { front: [0, 0], top: [0, 1], bottom: [0, -1], right: [1, 0], left: [-1, 0], back: [2, 0] };

  /* axonometric: tilt the object by α about the horizontal axis after turning it by β about the vertical one.
     With β > 0 the x-axis recedes to the right and down, z to the left and down, y stays vertical. */
  P.axonometric = (alpha, beta) => M4.mul(M4.rotX(alpha), M4.rotY(-beta));
  P.ISO = { alpha: atan(1 / Math.SQRT2), beta: PI / 4, scale: sqrt(2 / 3), angle: PI / 6 };
  P.isometric = () => P.axonometric(P.ISO.alpha, P.ISO.beta);
  // the common 1 : 1 : ½ dimetric (axes at 7°10′ and 41°25′ on paper)
  P.DIMETRIC = { alpha: 19.4712 * D2R, beta: 20.7048 * D2R, scales: [0.9428, 0.9428, 0.4714], angles: [7.18 * D2R, PI / 2, 41.41 * D2R] };
  P.dimetric = () => P.axonometric(P.DIMETRIC.alpha, P.DIMETRIC.beta);
  P.trimetric = (alpha, beta) => P.axonometric(alpha, beta);
  /* the paper direction and foreshortening of the three object axes under a projection matrix */
  P.axonAxes = M => {
    const ax = (d, name) => { const v = M4.dir(M, d); const l = hypot(v[0], v[1]); return { name, scale: l, angle: atan2(v[1], v[0]), x: v[0], y: v[1] }; };
    return { x: ax([1, 0, 0], 'x'), y: ax([0, 1, 0], 'y'), z: ax([0, 0, 1], 'z') };
  };
  /* the rotation whose three foreshortenings are the given ones (any axonometric: the sum of the squares must be 2) */
  P.axonFromScales = (sx, sy, sz) => {
    // cos α = sy ; cos²β + sin²β sin²α = sx² -> sin²β = (1 − sx²) / (1 − sin²α)
    const ca = clamp(sy, 0, 1), sa2 = 1 - ca * ca;
    const sb2 = sa2 >= 1 ? 0 : clamp((1 - sx * sx) / (1 - sa2), 0, 1);
    return { alpha: acos(ca), beta: asin(sqrt(sb2)), check: abs(sx * sx + sy * sy + sz * sz - 2) < 1e-6 };
  };

  /* oblique: the front face true, depth lines at `angle` with `ratio` of their length (cavalier 1, cabinet ½) */
  P.oblique = (angle, ratio) => [1, 0, -ratio * cos(angle), 0, 0, 1, -ratio * sin(angle), 0, 0, 0, 1, 0, 0, 0, 0, 1];
  P.cavalier = angle => P.oblique(angle == null ? PI / 4 : angle, 1);
  P.cabinet = angle => P.oblique(angle == null ? PI / 4 : angle, 0.5);
  /* planometric (military): the plan is true, turned by `angle`, and the heights go straight up */
  P.planometric = angle => { const a = angle == null ? PI / 4 : angle; return [cos(a), 0, sin(a), 0, sin(a), 1, -cos(a), 0, 0, 0, 1, 0, 0, 0, 0, 1]; };

  /* ---------------------------------------------------------------- central projection */
  /* the eye at the origin looking along −z, the picture plane at z = −d: x' = d·x / (−z) */
  P.perspective = d => [d, 0, 0, 0, 0, d, 0, 0, 0, 0, 1, 0, 0, 0, -1, 0];
  /* a camera: world -> camera coordinates (camera at `eye`, looking at `at`, `up` roughly up) */
  P.lookAt = (eye, at, up) => {
    const f = P.unit(P.sub(at, eye)), s = P.unit(P.cross(f, up || [0, 1, 0])), u = P.cross(s, f);
    return [s[0], s[1], s[2], -P.dot(s, eye), u[0], u[1], u[2], -P.dot(u, eye), -f[0], -f[1], -f[2], P.dot(f, eye), 0, 0, 0, 1];
  };
  /* the OpenGL matrices: camera -> clip space (x, y, z in [−1, 1] after the division) */
  P.perspectiveGL = (fovy, aspect, n, f) => { const t = 1 / tan(fovy / 2); return [t / aspect, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), 2 * f * n / (n - f), 0, 0, -1, 0]; };
  P.frustumGL = (l, r, b, t, n, f) => [2 * n / (r - l), 0, (r + l) / (r - l), 0, 0, 2 * n / (t - b), (t + b) / (t - b), 0, 0, 0, -(f + n) / (f - n), -2 * f * n / (f - n), 0, 0, -1, 0];
  P.orthoGL = (l, r, b, t, n, f) => [2 / (r - l), 0, 0, -(r + l) / (r - l), 0, 2 / (t - b), 0, -(t + b) / (t - b), 0, 0, -2 / (f - n), -(f + n) / (f - n), 0, 0, 0, 1];
  P.viewportGL = (w, h) => [w / 2, 0, 0, w / 2, 0, -h / 2, 0, h / 2, 0, 0, 1, 0, 0, 0, 0, 1];   // NDC -> pixels, y down
  P.focalFromFov = (fov, width) => width / 2 / tan(fov / 2);
  P.fovFromFocal = (f, width) => 2 * atan(width / 2 / f);
  /* where a direction vanishes on the picture: the image of its point at infinity (null when it stays parallel) */
  P.vanishing = (M, dir) => {
    const q = M4.dir(M, dir);
    if (abs(q[3]) < 1e-9) return null;
    return [q[0] / q[3], q[1] / q[3]];
  };
  P.boxVanishing = M => ({ x: P.vanishing(M, [1, 0, 0]), y: P.vanishing(M, [0, 1, 0]), z: P.vanishing(M, [0, 0, 1]) });
  /* the vanishing line of all planes with the given normal (two points on it), e.g. the horizon for [0, 1, 0] */
  P.vanishingLine = (M, normal) => {
    const n = P.unit(normal), a = abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = P.unit(P.cross(n, a)), v = P.cross(n, u);
    const p = P.vanishing(M, u), q = P.vanishing(M, v), r = P.vanishing(M, P.unit(P.add(u, v)));
    const pts = [p, q, r].filter(Boolean);
    return pts.length >= 2 ? [pts[0], pts[1]] : null;
  };
  P.project = (M, pts) => pts.map(p => M4.point(M, p));
  /* the number of vanishing points a box has under M, and the classical name of the view */
  P.perspectiveKind = M => {
    const v = P.boxVanishing(M);
    const n = ['x', 'y', 'z'].filter(k => v[k]).length;
    return { n, name: ['Parallel (no vanishing point)', 'One-point perspective', 'Two-point perspective', 'Three-point perspective'][n], vps: v };
  };

  /* ---------------------------------------------------------------- curvilinear mappings */
  /* A direction (unit vector, z forward, x right, y up) to a point on the picture, for lenses and
     wide-angle perspectives: r = f·g(θ), θ the angle from the axis. */
  P.CURVI = {
    rectilinear: { name: 'Rectilinear (gnomonic)', r: t => tan(t), inv: r => atan(r), max: 89 * D2R, note: 'straight lines stay straight; blows up at 90°' },
    equidistant: { name: 'Equidistant (f·θ)', r: t => t, inv: r => r, max: PI, note: 'angles from the centre scale evenly: the fisheye of 5- and 6-point perspective' },
    equisolid: { name: 'Equisolid angle (2f·sin θ/2)', r: t => 2 * sin(t / 2), inv: r => 2 * asin(clamp(r / 2, -1, 1)), max: PI, note: 'areas kept: most fisheye lenses' },
    stereographic: { name: 'Stereographic (2f·tan θ/2)', r: t => 2 * tan(t / 2), inv: r => 2 * atan(r / 2), max: 175 * D2R, note: 'angles kept: circles stay circles' },
    orthographic: { name: 'Orthographic (f·sin θ)', r: t => sin(t), inv: r => asin(clamp(r, -1, 1)), max: PI / 2, note: 'the view of a mirrored ball; crowds the edge' }
  };
  P.fisheye = (model, dir, f) => {
    const m = typeof model === 'string' ? P.CURVI[model] : model;
    if (!m) throw new Error('unknown fisheye model ' + model);
    const d = P.unit(dir), t = acos(clamp(d[2], -1, 1));
    if (t > m.max) return null;
    const rho = hypot(d[0], d[1]);
    if (rho < 1e-12) return [0, 0];
    const r = (f == null ? 1 : f) * m.r(t);
    return [r * d[0] / rho, r * d[1] / rho];
  };
  P.fisheyeInverse = (model, xy, f) => {           // picture point -> direction
    const m = typeof model === 'string' ? P.CURVI[model] : model;
    const r = hypot(xy[0], xy[1]) / (f == null ? 1 : f);
    const t = m.inv(r); if (!isFinite(t) || t > m.max) return null;
    const rho = sin(t); return r < 1e-12 ? [0, 0, 1] : [rho * xy[0] / (r * (f == null ? 1 : f)), rho * xy[1] / (r * (f == null ? 1 : f)), cos(t)];
  };
  /* cylindrical perspective (a panorama): the horizontal angle on x, the vertical tangent on y */
  P.cylindricalPersp = (dir, f) => {
    const d = dir, h = hypot(d[0], d[2]); if (h < 1e-12) return null;
    return [(f == null ? 1 : f) * atan2(d[0], d[2]), (f == null ? 1 : f) * d[1] / h];
  };
  /* equirectangular: longitude and latitude of the direction (radians) */
  P.equirectDir = dir => { const d = P.unit(dir); return [atan2(d[0], d[2]), asin(clamp(d[1], -1, 1))]; };
  P.dirFromAngles = (az, alt) => [sin(az) * cos(alt), sin(alt), cos(az) * cos(alt)];
  P.anglesFromDir = dir => { const d = P.unit(dir); return { az: atan2(d[0], d[2]), alt: asin(clamp(d[1], -1, 1)) }; };

  /* ---------------------------------------------------------------- the sphere (radians) */
  const S = P.sph = {
    toVec: (lon, lat) => [cos(lat) * cos(lon), cos(lat) * sin(lon), sin(lat)],
    fromVec: v => [atan2(v[1], v[0]), asin(clamp(v[2] / (P.len(v) || 1), -1, 1))],
    wrap: lon => { lon = (lon + PI) % TAU; if (lon < 0) lon += TAU; return lon - PI; },
    /* rotate the sphere: first add λ0 to the longitudes, then bring the point (0, φ0) to (0, 0), then turn by γ about the new centre */
    rotate(lon, lat, rot) {
      const l0 = rot[0] || 0, f0 = rot[1] || 0, g = rot[2] || 0;
      let v = S.toVec(lon + l0, lat);
      if (f0) { const c = cos(f0), s = sin(f0); v = [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; }
      if (g) { const c = cos(g), s = sin(g); v = [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; }
      return S.fromVec(v);
    },
    unrotate(lon, lat, rot) {
      const l0 = rot[0] || 0, f0 = rot[1] || 0, g = rot[2] || 0;
      let v = S.toVec(lon, lat);
      if (g) { const c = cos(-g), s = sin(-g); v = [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]; }
      if (f0) { const c = cos(-f0), s = sin(-f0); v = [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]; }
      const r = S.fromVec(v); return [S.wrap(r[0] - l0), r[1]];
    },
    angDist: (a, b) => { const d = P.dot(S.toVec(a[0], a[1]), S.toVec(b[0], b[1])); return acos(clamp(d, -1, 1)); },
    bearing: (a, b) => {                              // initial bearing from a to b, clockwise from north
      const dl = b[0] - a[0];
      return atan2(sin(dl) * cos(b[1]), cos(a[1]) * sin(b[1]) - sin(a[1]) * cos(b[1]) * cos(dl));
    },
    destination: (a, brg, dist) => {
      const lat = asin(sin(a[1]) * cos(dist) + cos(a[1]) * sin(dist) * cos(brg));
      const lon = a[0] + atan2(sin(brg) * sin(dist) * cos(a[1]), cos(dist) - sin(a[1]) * sin(lat));
      return [S.wrap(lon), lat];
    },
    greatCircle: (a, b, n) => {                       // n + 1 points along the shorter arc
      n = n || 64; const va = S.toVec(a[0], a[1]), vb = S.toVec(b[0], b[1]), w = acos(clamp(P.dot(va, vb), -1, 1));
      const out = [];
      if (w < 1e-9) return [a.slice(), b.slice()];
      for (let i = 0; i <= n; i++) { const t = i / n, A = sin((1 - t) * w) / sin(w), B = sin(t * w) / sin(w); out.push(S.fromVec([A * va[0] + B * vb[0], A * va[1] + B * vb[1], A * va[2] + B * vb[2]])); }
      return out;
    },
    rhumbDistance: (a, b) => {
      const dPsi = ln(tan(PI / 4 + b[1] / 2) / tan(PI / 4 + a[1] / 2)), dLat = b[1] - a[1];
      let dLon = b[0] - a[0]; if (abs(dLon) > PI) dLon = dLon > 0 ? dLon - TAU : dLon + TAU;
      const q = abs(dPsi) > 1e-12 ? dLat / dPsi : cos(a[1]);
      return hypot(dLat, q * dLon);
    },
    rhumbBearing: (a, b) => {
      const dPsi = ln(tan(PI / 4 + b[1] / 2) / tan(PI / 4 + a[1] / 2));
      let dLon = b[0] - a[0]; if (abs(dLon) > PI) dLon = dLon > 0 ? dLon - TAU : dLon + TAU;
      return atan2(dLon, dPsi);
    },
    rhumb: (a, b, n) => {                            // points along the rhumb line: linear in the Mercator ordinate ψ, so straight on Mercator
      n = n || 64; const out = [];
      let dLon = b[0] - a[0]; if (abs(dLon) > PI) dLon = dLon > 0 ? dLon - TAU : dLon + TAU;
      const psi = f => ln(tan(PI / 4 + clamp(f, -89.9 * D2R, 89.9 * D2R) / 2)), pa = psi(a[1]), pb = psi(b[1]);
      for (let i = 0; i <= n; i++) { const t = i / n; const p = pa + (pb - pa) * t; out.push([S.wrap(a[0] + dLon * t), 2 * atan(Math.exp(p)) - PI / 2]); }
      return out;
    }
  };
  /* the same in degrees and kilometres, for content and tools */
  const G = P.geo = {
    R: 6371.0088,
    distance: (a, b) => S.angDist([a[0] * D2R, a[1] * D2R], [b[0] * D2R, b[1] * D2R]) * G.R,
    bearing: (a, b) => { let d = S.bearing([a[0] * D2R, a[1] * D2R], [b[0] * D2R, b[1] * D2R]) * R2D; return (d + 360) % 360; },
    destination: (a, brg, km) => { const p = S.destination([a[0] * D2R, a[1] * D2R], brg * D2R, km / G.R); return [p[0] * R2D, p[1] * R2D]; },
    greatCircle: (a, b, n) => S.greatCircle([a[0] * D2R, a[1] * D2R], [b[0] * D2R, b[1] * D2R], n).map(p => [p[0] * R2D, p[1] * R2D]),
    rhumbLine: (a, b, n) => S.rhumb([a[0] * D2R, a[1] * D2R], [b[0] * D2R, b[1] * D2R], n).map(p => [p[0] * R2D, p[1] * R2D]),
    rhumbDistance: (a, b) => S.rhumbDistance([a[0] * D2R, a[1] * D2R], [b[0] * D2R, b[1] * D2R]) * G.R,
    rhumbBearing: (a, b) => (S.rhumbBearing([a[0] * D2R, a[1] * D2R], [b[0] * D2R, b[1] * D2R]) * R2D + 360) % 360,
    midpoint: (a, b) => { const p = S.greatCircle([a[0] * D2R, a[1] * D2R], [b[0] * D2R, b[1] * D2R], 2)[1]; return [p[0] * R2D, p[1] * R2D]; },
    antipode: a => [S.wrap((a[0] + 180) * D2R) * R2D, -a[1]],
    fmt: (lon, lat) => abs(lat).toFixed(1) + '°' + (lat >= 0 ? 'N' : 'S') + ' ' + abs(lon).toFixed(1) + '°' + (lon >= 0 ? 'E' : 'W')
  };

  /* ---------------------------------------------------------------- map projections */
  const MAPS = P.maps = { defs: {}, order: [] };
  MAPS.add = def => { MAPS.defs[def.id] = def; MAPS.order.push(def.id); def.params = Object.assign({ lon0: 0, lat0: 0, rotLat: 0, rotGamma: 0 }, def.params || {}); return def; };
  MAPS.get = id => { const d = MAPS.defs[id]; if (!d) throw new Error('unknown map projection ' + id); return d; };
  MAPS.GROUPS = { azimuthal: 'Azimuthal (plane)', cylindrical: 'Cylindrical', conic: 'Conic', pseudocylindrical: 'Pseudocylindrical', compromise: 'Compromise and lenticular', polyhedral: 'Polyhedral', historical: 'Historical' };
  MAPS.list = group => MAPS.order.map(id => MAPS.defs[id]).filter(d => !group || d.group === group);
  const opt = (def, o) => Object.assign({}, def.params, o || {});
  const degOpts = o => ({ lon0: (o.lon0 || 0) * D2R, lat0: (o.lat0 || 0) * D2R, lat1: o.lat1 == null ? null : o.lat1 * D2R, lat2: o.lat2 == null ? null : o.lat2 * D2R, rotLat: (o.rotLat || 0) * D2R, rotGamma: (o.rotGamma || 0) * D2R, raw: o });
  /* forward in radians, with the longitude shift and the aspect rotation */
  function fwdFull(def, lon, lat, o) {
    let l = S.wrap(lon - o.lon0), f = lat;
    if (def.group === 'azimuthal') { const r = S.rotate(l, f, [0, o.lat0, o.rotGamma]); l = r[0]; f = r[1]; }
    // a cylinder or cone tilted about the centre point (λ0, 0): rotLat = 90° is the transverse aspect, the cylinder touching the meridian λ0
    else if (o.rotLat) { const r = S.rotate(l, f, [0, 0, o.rotLat]); l = r[0]; f = r[1]; }
    if (def.maxLat != null && abs(f) > def.maxLat) return null;
    return def.fwd(l, f, o);
  }
  MAPS.project = (id, lon, lat, o) => { const def = MAPS.get(id); return fwdFull(def, lon * D2R, lat * D2R, degOpts(opt(def, o))); };
  MAPS.projectRad = (id, lon, lat, o) => { const def = MAPS.get(id); return fwdFull(def, lon, lat, degOpts(opt(def, o))); };
  MAPS.invert = (id, x, y, o) => {
    const def = MAPS.get(id), oo = degOpts(opt(def, o));
    const back = r => {                              // undo the aspect and the shift
      if (!r) return null;
      let l = r[0], f = r[1];
      if (def.group === 'azimuthal') { const u = S.unrotate(l, f, [0, oo.lat0, oo.rotGamma]); l = u[0]; f = u[1]; }
      else if (oo.rotLat) { const u = S.unrotate(l, f, [0, 0, oo.rotLat]); l = u[0]; f = u[1]; }
      return [S.wrap(l + oo.lon0) * R2D, f * R2D];
    };
    if (def.inv) { const r = def.inv(x, y, oo); if (r && isFinite(r[0]) && isFinite(r[1])) return back(r); return null; }
    // numeric: the best of a few seeds, then Newton
    const f = (l, p) => def.fwd(l, p, oo);
    let best = null, bd = Infinity;
    for (let la = -75; la <= 75; la += 30) for (let lo = -165; lo <= 165; lo += 30) { const q = f(lo * D2R, la * D2R); if (!q) continue; const d = hypot(q[0] - x, q[1] - y); if (d < bd) { bd = d; best = [lo * D2R, la * D2R]; } }
    if (!best) return null;
    let [l, p] = best;
    for (let it = 0; it < 30; it++) {
      const q = f(l, p); if (!q) break;
      const rx = q[0] - x, ry = q[1] - y;
      if (hypot(rx, ry) < 1e-10) break;
      const h = 1e-6, ql = f(l + h, p), qp = f(l, p + h); if (!ql || !qp) break;
      const a = (ql[0] - q[0]) / h, b = (qp[0] - q[0]) / h, c = (ql[1] - q[1]) / h, d = (qp[1] - q[1]) / h, det = a * d - b * c;
      if (abs(det) < 1e-14) break;
      const dl = (d * rx - b * ry) / det, dp = (-c * rx + a * ry) / det;
      l -= dl; p -= dp;
      p = clamp(p, -PI / 2, PI / 2); l = S.wrap(l);
    }
    const q = f(l, p);
    if (!q || hypot(q[0] - x, q[1] - y) > 1e-5) return null;
    return back([l, p]);
  };
  /* a polyline of [lon, lat] (degrees) -> segments of [x, y], broken where the projection tears the sphere */
  MAPS.path = (id, line, o, jump) => {
    const def = MAPS.get(id), oo = degOpts(opt(def, o));
    const J = jump || def.jump || 0.25 * MAPS.size(id, o);
    const segs = []; let cur = [], prev = null, prevLL = null;
    for (const ll of line) {
      const p = fwdFull(def, ll[0] * D2R, ll[1] * D2R, oo);
      let brk = !p || !isFinite(p[0]) || !isFinite(p[1]);
      if (!brk && prev && hypot(p[0] - prev[0], p[1] - prev[1]) > J) brk = true;
      if (!brk && prevLL && def.cut && def.cut(prevLL, ll, oo)) brk = true;
      if (brk) { if (cur.length > 1) segs.push(cur); cur = []; prev = null; prevLL = null; if (!p || !isFinite(p[0]) || !isFinite(p[1])) continue; }
      cur.push(p); prev = p; prevLL = ll;
    }
    if (cur.length > 1) segs.push(cur);
    return segs;
  };
  const sizeCache = {};
  MAPS.size = (id, o) => {                           // the diagonal of the map's extent (for jump thresholds)
    const key = id + JSON.stringify(o || {});
    if (sizeCache[key]) return sizeCache[key];
    const e = MAPS.extent(id, o);
    return sizeCache[key] = hypot(e.x1 - e.x0, e.y1 - e.y0) || 1;
  };
  MAPS.extent = (id, o) => {
    const def = MAPS.get(id), oo = degOpts(opt(def, o));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const take = p => { if (!p || !isFinite(p[0]) || !isFinite(p[1])) return; if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; };
    // the edge of the map respects the projection's cut-offs (maxLat, the visible cap, the known world); where there is
    // no edge (the two-point equidistant), sample the graticule
    const segs = MAPS.outline(id, o);
    if (segs.length) segs.forEach(seg => seg.forEach(take));
    else { const maxLat = def.maxLat != null ? def.maxLat * R2D : 89.99; for (let la = -90; la <= 90; la += 5) for (let lo = -180; lo <= 180; lo += 5) take(fwdFull(def, lo * D2R, clamp(la, -maxLat, maxLat) * D2R, oo)); }
    if (!isFinite(x0)) { x0 = -1; x1 = 1; y0 = -1; y1 = 1; }
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0 };
  };
  /* meridians and parallels as segments, every stepLon / stepLat degrees */
  MAPS.graticule = (id, o, stepLon, stepLat, sample) => {
    stepLon = stepLon || 30; stepLat = stepLat || 30; sample = sample || 2;
    const def = MAPS.get(id), maxLat = def.maxLat != null ? def.maxLat * R2D : 90;
    const out = [];
    for (let lo = -180; lo <= 180 - 1e-9; lo += stepLon) {
      const line = []; for (let la = -maxLat; la <= maxLat + 1e-9; la += sample) line.push([lo, clamp(la, -maxLat, maxLat)]);
      MAPS.path(id, line, o).forEach(s => out.push({ kind: 'meridian', deg: lo, pts: s }));
    }
    for (let la = -90 + stepLat; la <= 90 - stepLat + 1e-9; la += stepLat) {
      if (abs(la) > maxLat) continue;
      const line = []; for (let lo = -180; lo <= 180 + 1e-9; lo += sample) line.push([lo, la]);
      MAPS.path(id, line, o).forEach(s => out.push({ kind: 'parallel', deg: la, pts: s }));
    }
    return out;
  };
  /* the edge of the map: the image of the sphere's boundary in the projection's own coordinates */
  MAPS.outline = (id, o) => {
    const def = MAPS.get(id), oo = degOpts(opt(def, o));
    if (def.outline) return def.outline(oo);
    if (def.domain === 'none') return [];
    const e = 1e-4, segs = [];
    if (def.domain === 'hemisphere' || def.domain === 'cap') {
      const c = def.maxDist(oo) - e, pts = [];
      for (let i = 0; i <= 180; i++) { const t = TAU * i / 180; const p = def.fwd(atan2(sin(c) * cos(t), cos(c)), asin(sin(c) * sin(t)), oo); if (p) pts.push(p); }
      return [pts];
    }
    const maxLat = def.maxLat != null ? def.maxLat : PI / 2 - e, loop = [];
    for (let i = 0; i <= 90; i++) loop.push([-PI + e + (TAU - 2 * e) * i / 90, -maxLat]);
    for (let i = 1; i <= 45; i++) loop.push([PI - e, -maxLat + 2 * maxLat * i / 45]);
    for (let i = 1; i <= 90; i++) loop.push([PI - e - (TAU - 2 * e) * i / 90, maxLat]);
    for (let i = 1; i <= 45; i++) loop.push([-PI + e, maxLat - 2 * maxLat * i / 45]);
    let cur = [], prev = null; const J = def.jump || 2;
    for (const ll of loop) { const p = def.fwd(ll[0], ll[1], oo); if (!p || (prev && hypot(p[0] - prev[0], p[1] - prev[1]) > J)) { if (cur.length > 1) segs.push(cur); cur = []; prev = null; if (!p) continue; } cur.push(p); prev = p; }
    if (cur.length > 1) segs.push(cur);
    return segs;
  };
  /* local distortion: the scale along the meridian (h) and parallel (k), the area scale, the largest angular change ω,
     and Tissot's indicatrix (an ellipse of semi-axes a, b at the angle `angle`) for a circle of radius r on the sphere */
  MAPS.tissot = (id, lon, lat, o, r) => {
    const def = MAPS.get(id), oo = degOpts(opt(def, o));
    const l = lon * D2R, f = clamp(lat * D2R, -PI / 2 + 1e-3, PI / 2 - 1e-3);
    const p = fwdFull(def, l, f, oo); if (!p) return null;
    const h = 1e-5, pl = fwdFull(def, l + h, f, oo), pf = fwdFull(def, l, f + h, oo);
    const ml = fwdFull(def, l - h, f, oo), mf = fwdFull(def, l, f - h, oo);
    if (!pl || !pf || !ml || !mf) return null;
    const cf = cos(f);
    const a11 = (pl[0] - ml[0]) / (2 * h * cf), a12 = (pf[0] - mf[0]) / (2 * h), a21 = (pl[1] - ml[1]) / (2 * h * cf), a22 = (pf[1] - mf[1]) / (2 * h);
    const kk = hypot(a11, a21), hh = hypot(a12, a22), s = abs(a11 * a22 - a12 * a21);
    // singular values of the 2×2
    const E = (a11 + a22) / 2, F = (a11 - a22) / 2, Gg = (a21 + a12) / 2, Hh = (a21 - a12) / 2;
    const Q = hypot(E, Hh), R = hypot(F, Gg), A = Q + R, B = abs(Q - R);
    const angle = (atan2(Hh, E) + atan2(Gg, F)) / 2;
    const omega = A + B > 0 ? 2 * asin(clamp((A - B) / (A + B), 0, 1)) : 0;
    const rr = r == null ? 0.05 : r;
    return { cx: p[0], cy: p[1], a: A * rr, b: B * rr, angle, h: hh, k: kk, s, omega, conformalErr: abs(hh - kk) / Math.max(hh, kk, 1e-12), theta: acos(clamp((a11 * a12 + a21 * a22) / (kk * hh || 1e-12), -1, 1)) };
  };
  MAPS.distortion = (id, lon, lat, o) => MAPS.tissot(id, lon, lat, o, 1);
  /* the ellipse of a Tissot result as points */
  MAPS.ellipsePts = (t, n) => { const out = []; n = n || 36; for (let i = 0; i <= n; i++) { const u = TAU * i / n, x = t.a * cos(u), y = t.b * sin(u); out.push([t.cx + x * cos(t.angle) - y * sin(t.angle), t.cy + x * sin(t.angle) + y * cos(t.angle)]); } return out; };

  /* ----- azimuthal (about the centre (0, 0) after the rotation) */
  const azi = (k) => (l, f, o) => { const cc = cos(f) * cos(l), c = acos(clamp(cc, -1, 1)); const kp = k(c, cc, o); if (kp == null) return null; return [kp * cos(f) * sin(l), kp * sin(f)]; };
  const aziInv = (cOf) => (x, y, o) => { const rho = hypot(x, y); if (rho < 1e-12) return [0, 0]; const c = cOf(rho, o); if (c == null) return null; return [atan2(x * sin(c), rho * cos(c)), asin(clamp(y * sin(c) / rho, -1, 1))]; };
  MAPS.add({ id: 'gnomonic', name: 'Gnomonic', group: 'azimuthal', props: ['great circles straight'], who: 'Thales (attributed)', year: '~580 BC', domain: 'cap', maxDist: () => 80 * D2R, jump: 3,
    fwd: azi((c, cc) => c < 80 * D2R ? 1 / cc : null), inv: aziInv(rho => atan(rho)), note: 'The light at the centre of the globe. Every great circle is a straight line, so it is the chart of shortest routes; it cannot reach the horizon.' });
  MAPS.add({ id: 'stereographic', name: 'Stereographic', group: 'azimuthal', props: ['conformal'], who: 'Hipparchus', year: '~150 BC', domain: 'cap', maxDist: () => 150 * D2R, jump: 4,
    fwd: azi((c, cc) => c < 150 * D2R ? 2 / (1 + cc) : null), inv: aziInv(rho => 2 * atan(rho / 2)), note: 'The light at the antipode of the centre. Angles are true and every circle on the sphere is a circle on the map: the projection of the astrolabe and of polar charts.' });
  MAPS.add({ id: 'orthographic', name: 'Orthographic', group: 'azimuthal', props: ['the globe as seen'], who: 'Hipparchus', year: '~150 BC', domain: 'hemisphere', maxDist: () => PI / 2, jump: 1,
    fwd: azi((c, cc) => cc >= 0 ? 1 : null), inv: aziInv(rho => rho <= 1 ? asin(rho) : null), note: 'The light at infinity: the Earth as it is seen from far away. One hemisphere, true in the middle, squashed at the edge.' });
  MAPS.add({ id: 'azimuthal-equidistant', name: 'Azimuthal equidistant', group: 'azimuthal', props: ['equidistant from the centre', 'true bearings from the centre'], who: "al-Biruni", year: '~1000', domain: 'world', jump: 2,
    fwd: azi((c, cc) => c < 1e-9 ? 1 : c < PI - 1e-6 ? c / sin(c) : null), inv: aziInv(rho => rho <= PI ? rho : null), outline: o => { const pts = []; for (let i = 0; i <= 180; i++) pts.push([(PI - 1e-6) * cos(TAU * i / 180), (PI - 1e-6) * sin(TAU * i / 180)]); return [pts]; },
    note: 'Distances and directions from the centre are true, so from one city it answers "how far and which way". The whole Earth fits in a disc; the antipode becomes the rim. The emblem of the United Nations.' });
  MAPS.add({ id: 'lambert-azimuthal', name: 'Lambert azimuthal equal-area', group: 'azimuthal', props: ['equal-area'], who: 'J. H. Lambert', year: 1772, domain: 'world', jump: 2,
    fwd: azi((c, cc) => cc > -1 + 1e-9 ? sqrt(2 / (1 + cc)) : null), inv: aziInv(rho => rho < 2 ? 2 * asin(rho / 2) : null), outline: o => { const pts = []; for (let i = 0; i <= 180; i++) pts.push([2 * cos(TAU * i / 180), 2 * sin(TAU * i / 180)]); return [pts]; },
    note: 'Areas are true everywhere and the whole Earth fits in a disc of radius 2R. Used for polar and continental maps and for the sky.' });
  MAPS.add({ id: 'vertical-perspective', name: 'Vertical perspective (from space)', group: 'azimuthal', props: ['the view from a satellite'], who: 'La Hire, Clarke', year: '1701 / 1862', domain: 'cap', maxDist: o => acos(1 / Math.max(1.01, o.raw.P || 6.6)), jump: 1, params: { P: 6.6 },
    fwd: (l, f, o) => { const Pp = Math.max(1.01, o.raw.P || 6.6), cc = cos(f) * cos(l); if (cc < 1 / Pp) return null; const kp = (Pp - 1) / (Pp - cc); return [kp * cos(f) * sin(l), kp * sin(f)]; },
    note: 'The Earth photographed from a height (P Earth radii from the centre; 6.6 is the geostationary orbit). Between the orthographic (from infinity) and the gnomonic (from the centre).' });
  MAPS.add({ id: 'two-point-equidistant', name: 'Two-point equidistant', group: 'azimuthal', props: ['true distances from two points'], who: 'H. Maurer', year: 1919, domain: 'world', jump: 2, params: { A: [-74, 40.7], B: [139.7, 35.7] },
    fwd: (l, f, o) => {
      const A = o.raw.A || [-74, 40.7], B = o.raw.B || [139.7, 35.7];
      const a = [A[0] * D2R + o.lon0, A[1] * D2R], b = [B[0] * D2R + o.lon0, B[1] * D2R];   // in the unshifted frame (fwd gets l already shifted)
      const p = [l + o.lon0, f], dAB = S.angDist(a, b), dA = S.angDist(a, p), dB = S.angDist(b, p);
      if (dAB < 1e-9) return [dA * cos(0), 0];
      const x = (dA * dA - dB * dB) / (2 * dAB), y2 = dA * dA - (x + dAB / 2) * (x + dAB / 2);
      const side = P.dot(P.cross(S.toVec(a[0], a[1]), S.toVec(b[0], b[1])), S.toVec(p[0], p[1]));
      return [x, sgn(side) * sqrt(Math.max(0, y2))];
    },
    domain: 'none', note: 'Distances from two chosen points are true (both cities sit on the map at their true distance from every place). The map is an oval; the great circle through the two points is its long axis.' });

  /* ----- cylindrical */
  MAPS.add({ id: 'equirectangular', name: 'Equirectangular (plate carrée)', group: 'cylindrical', props: ['equidistant along meridians'], who: 'Marinus of Tyre', year: '~100', jump: 2, params: { lat1: 0 },
    fwd: (l, f, o) => [l * cos(o.lat1 || 0), f], inv: (x, y, o) => [x / cos(o.lat1 || 0), y], note: 'Longitude and latitude used straight as x and y: the simplest map, the grid of a spreadsheet and of 360° photographs. With a standard parallel φ₁ it is the equidistant cylindrical.' });
  MAPS.add({ id: 'mercator', name: 'Mercator', group: 'cylindrical', props: ['conformal', 'rhumb lines straight'], who: 'G. Mercator', year: 1569, maxLat: 85 * D2R, jump: 2,
    fwd: (l, f) => [l, ln(tan(PI / 4 + f / 2))], inv: (x, y) => [x, 2 * atan(Math.exp(y)) - PI / 2], note: 'Meridians straight and parallels spread so that angles are true: a course of constant compass bearing is a straight line. The navigator\'s chart since 1569, and the web\'s map; it cannot show the poles.' });
  MAPS.add({ id: 'web-mercator', name: 'Web Mercator (tiles)', group: 'cylindrical', props: ['conformal (on the sphere)'], who: 'Google', year: 2005, maxLat: 85.0511 * D2R, jump: 2,
    fwd: (l, f) => [l, ln(tan(PI / 4 + f / 2))], inv: (x, y) => [x, 2 * atan(Math.exp(y)) - PI / 2], note: 'Mercator on a sphere, cut at ±85.05° so the world is a square that splits into tiles: the map of every phone.' });
  MAPS.add({ id: 'transverse-mercator', name: 'Transverse Mercator', group: 'cylindrical', props: ['conformal', 'the UTM and national grids'], who: 'Lambert, Gauss, Krüger', year: '1772 / 1822 / 1912', jump: 2,
    fwd: (l, f, o) => { if (abs(l) > 80 * D2R) return null; const B = cos(f) * sin(l); if (abs(B) > 0.9999) return null; return [0.5 * ln((1 + B) / (1 - B)), atan2(tan(f), cos(l)) - (o.lat0 || 0)]; },
    inv: (x, y, o) => { const D = y + (o.lat0 || 0); return [atan2(Math.sinh(x), cos(D)), asin(clamp(sin(D) / Math.cosh(x), -1, 1))]; },
    cut: (a, b) => abs(a[0] - b[0]) > 90, note: 'Mercator turned on its side: the cylinder touches a meridian, so a north–south strip is nearly true. In 6°-wide zones it is the UTM grid of surveyors and of most national maps.' });
  MAPS.add({ id: 'lambert-cylindrical', name: 'Lambert cylindrical equal-area', group: 'cylindrical', props: ['equal-area'], who: 'J. H. Lambert', year: 1772, jump: 2,
    fwd: (l, f) => [l, sin(f)], inv: (x, y) => [x, asin(clamp(y, -1, 1))], note: 'The sphere projected straight onto a cylinder wrapped round the equator (Archimedes\' theorem makes it equal-area). Shapes are stretched east–west near the poles.' });
  MAPS.add({ id: 'gall-peters', name: 'Gall–Peters', group: 'cylindrical', props: ['equal-area'], who: 'J. Gall / A. Peters', year: '1855 / 1973', jump: 2,
    fwd: (l, f) => [l / Math.SQRT2, Math.SQRT2 * sin(f)], inv: (x, y) => [x * Math.SQRT2, asin(clamp(y / Math.SQRT2, -1, 1))], note: 'Lambert\'s cylinder with standard parallels at 45°: areas true, shapes less stretched at mid-latitudes. The map of the "fair to the tropics" debate.' });
  MAPS.add({ id: 'behrmann', name: 'Behrmann', group: 'cylindrical', props: ['equal-area'], who: 'W. Behrmann', year: 1910, jump: 2,
    fwd: (l, f) => [l * cos(30 * D2R), sin(f) / cos(30 * D2R)], note: 'Equal-area cylindrical with standard parallels at 30°.' });
  MAPS.add({ id: 'miller', name: 'Miller cylindrical', group: 'cylindrical', props: ['compromise'], who: 'O. M. Miller', year: 1942, jump: 2,
    fwd: (l, f) => [l, 1.25 * ln(tan(PI / 4 + 0.4 * f))], inv: (x, y) => [x, 2.5 * atan(Math.exp(0.8 * y)) - 0.625 * PI], note: 'Mercator with the latitudes squeezed (×0.8 before, ×1.25 after) so the poles fit on the sheet. Neither conformal nor equal-area: a wall map.' });
  MAPS.add({ id: 'gall-stereographic', name: 'Gall stereographic', group: 'cylindrical', props: ['compromise'], who: 'J. Gall', year: 1855, jump: 2,
    fwd: (l, f) => [l / Math.SQRT2, (1 + Math.SQRT2 / 2) * tan(f / 2)], note: 'A perspective cylindrical: the light on the equator opposite each point, the cylinder cutting the sphere at 45°.' });
  MAPS.add({ id: 'central-cylindrical', name: 'Central cylindrical', group: 'cylindrical', props: ['perspective'], who: '—', year: '', maxLat: 70 * D2R, jump: 2,
    fwd: (l, f) => [l, tan(f)], inv: (x, y) => [x, atan(y)], note: 'The light at the centre, the cylinder round the equator: the "obvious" projection that Mercator is often mistaken for. It stretches far more than Mercator.' });
  MAPS.add({ id: 'cassini', name: 'Cassini', group: 'cylindrical', props: ['equidistant along the central meridian'], who: 'C. F. Cassini de Thury', year: 1745, jump: 2,
    fwd: (l, f, o) => { if (abs(l) > 85 * D2R) return null; return [asin(clamp(cos(f) * sin(l), -1, 1)), atan2(tan(f), cos(l)) - (o.lat0 || 0)]; },
    inv: (x, y, o) => { const D = y + (o.lat0 || 0); return [atan2(tan(x), cos(D)), asin(clamp(sin(D) * cos(x), -1, 1))]; }, cut: (a, b) => abs(a[0] - b[0]) > 90,
    note: 'The equirectangular turned on its side: distances along the central meridian and perpendicular to it are true. The projection of the survey of France and of the old Ordnance Survey.' });

  /* ----- conic */
  const conicN = o => { const f1 = o.lat1 == null ? 30 * D2R : o.lat1, f2 = o.lat2 == null ? f1 : o.lat2; return { f1, f2 }; };
  MAPS.add({ id: 'equidistant-conic', name: 'Equidistant conic', group: 'conic', props: ['equidistant along meridians'], who: 'Ptolemy, de l\'Isle', year: '~150 / 1745', jump: 2, params: { lat1: 20, lat2: 60 },
    fwd: (l, f, o) => { const { f1, f2 } = conicN(o); const n = abs(f2 - f1) < 1e-9 ? sin(f1) : (cos(f1) - cos(f2)) / (f2 - f1); if (abs(n) < 1e-9) return [l, f]; const Gg = cos(f1) / n + f1, rho0 = Gg - (o.lat0 || 0), rho = Gg - f; return [rho * sin(n * l), rho0 - rho * cos(n * l)]; },
    note: 'A cone touching (or cutting) the sphere along one or two parallels: parallels are concentric arcs spaced truly, meridians straight. Ptolemy\'s first projection was of this kind.' });
  MAPS.add({ id: 'lambert-conformal-conic', name: 'Lambert conformal conic', group: 'conic', props: ['conformal'], who: 'J. H. Lambert', year: 1772, jump: 2, params: { lat1: 33, lat2: 45 },
    fwd: (l, f, o) => { const { f1, f2 } = conicN(o); const n = abs(f2 - f1) < 1e-9 ? sin(f1) : ln(cos(f1) / cos(f2)) / ln(tan(PI / 4 + f2 / 2) / tan(PI / 4 + f1 / 2)); if (abs(n) < 1e-9) return null; const F = cos(f1) * Math.pow(tan(PI / 4 + f1 / 2), n) / n; if (abs(f) > 89.5 * D2R && sgn(f) === sgn(n)) return null; const rho = F * Math.pow(1 / tan(PI / 4 + f / 2), n), rho0 = F * Math.pow(1 / tan(PI / 4 + (o.lat0 || 0) / 2), n); if (!isFinite(rho) || rho > 4) return null; return [rho * sin(n * l), rho0 - rho * cos(n * l)]; },   // cut where the far hemisphere balloons (ρ > 4R, about 55° beyond the equator on the far side)
    note: 'The conformal cone: angles true, scale almost constant between the two standard parallels. Aeronautical charts and the state plane systems of wide countries.' });
  MAPS.add({ id: 'albers', name: 'Albers equal-area conic', group: 'conic', props: ['equal-area'], who: 'H. C. Albers', year: 1805, jump: 2, params: { lat1: 29.5, lat2: 45.5 },
    fwd: (l, f, o) => { const { f1, f2 } = conicN(o); const n = (sin(f1) + sin(f2)) / 2; if (abs(n) < 1e-9) return [l, sin(f)]; const C = cos(f1) * cos(f1) + 2 * n * sin(f1), rho = sqrt(Math.max(0, C - 2 * n * sin(f))) / n, rho0 = sqrt(Math.max(0, C - 2 * n * sin(o.lat0 || 0))) / n; return [rho * sin(n * l), rho0 - rho * cos(n * l)]; },
    note: 'The equal-area cone: the map of choice for a mid-latitude country whose areas must compare (the USA, Europe).' });
  MAPS.add({ id: 'polyconic', name: 'American polyconic', group: 'conic', props: ['compromise'], who: 'F. R. Hassler', year: 1820, jump: 2,
    fwd: (l, f) => { if (abs(f) < 1e-9) return [l, 0]; if (abs(l) > 150 * D2R) return null; const E = l * sin(f), ct = 1 / tan(f); return [ct * sin(E), f + ct * (1 - cos(E))]; },
    note: 'Every parallel is the arc of its own cone: true along the central meridian and along every parallel. The US Coast Survey\'s projection for a century.' });
  MAPS.add({ id: 'bonne', name: 'Bonne', group: 'conic', props: ['equal-area', 'pseudoconic'], who: 'Sylvanus, Bonne', year: '1511 / 1752', jump: 2, params: { lat1: 45 },
    fwd: (l, f, o) => { const f1 = o.lat1 == null ? 45 * D2R : o.lat1; if (abs(f1) < 1e-9) return [l * cos(f), f]; const ct = 1 / tan(f1), rho = ct + f1 - f, E = rho ? l * cos(f) / rho : 0; return [rho * sin(E), ct - rho * cos(E)]; },
    note: 'Parallels are concentric arcs spaced truly and each divided truly: equal-area, with the heart-shaped outline of the Renaissance world maps. Werner is the case with the pole as centre.' });
  MAPS.add({ id: 'werner', name: 'Werner (cordiform)', group: 'conic', props: ['equal-area', 'pseudoconic'], who: 'J. Stab, J. Werner', year: 1514, jump: 2,
    fwd: (l, f) => { const rho = PI / 2 - f, E = rho > 1e-9 ? l * cos(f) / rho : 0; return [rho * sin(E), -rho * cos(E)]; },
    note: 'Bonne\'s projection with the north pole as the centre of the parallels: the heart-shaped (cordiform) maps of the 16th century. Distances from the pole are true.' });

  /* ----- pseudocylindrical */
  MAPS.add({ id: 'sinusoidal', name: 'Sinusoidal (Sanson–Flamsteed)', group: 'pseudocylindrical', props: ['equal-area', 'equidistant along parallels'], who: 'Mercator, Sanson', year: '1570 / 1650', jump: 2,
    fwd: (l, f) => [l * cos(f), f], inv: (x, y) => [x / cos(y), y], note: 'Parallels straight and truly spaced, each divided truly: equal-area, with meridians that are sine curves. True scale along every parallel and the central meridian.' });
  MAPS.add({ id: 'mollweide', name: 'Mollweide', group: 'pseudocylindrical', props: ['equal-area'], who: 'K. B. Mollweide', year: 1805, jump: 2,
    fwd: (l, f) => { let t = f; if (abs(f) < PI / 2 - 1e-9) for (let i = 0; i < 12; i++) { const d = (2 * t + sin(2 * t) - PI * sin(f)) / (2 + 2 * cos(2 * t)); t -= d; if (abs(d) < 1e-12) break; } else t = f; return [2 * Math.SQRT2 / PI * l * cos(t), Math.SQRT2 * sin(t)]; },
    inv: (x, y) => { const t = asin(clamp(y / Math.SQRT2, -1, 1)); return [PI * x / (2 * Math.SQRT2 * cos(t)), asin(clamp((2 * t + sin(2 * t)) / PI, -1, 1))]; },
    note: 'The world in an ellipse twice as wide as high, equal-area: the parallels are placed by an auxiliary angle θ so that each band keeps its true area. Sky surveys and climate maps.' });
  MAPS.add({ id: 'hammer', name: 'Hammer (Hammer–Aitoff)', group: 'pseudocylindrical', props: ['equal-area'], who: 'E. Hammer', year: 1892, jump: 2,
    fwd: (l, f) => { const d = sqrt(1 + cos(f) * cos(l / 2)); return [2 * Math.SQRT2 * cos(f) * sin(l / 2) / d, Math.SQRT2 * sin(f) / d]; },
    inv: (x, y) => { const z = sqrt(Math.max(0, 1 - x * x / 16 - y * y / 4)); return [2 * atan2(z * x, 2 * (2 * z * z - 1)), asin(clamp(z * y, -1, 1))]; },
    note: 'Lambert\'s azimuthal equal-area of half the longitudes, stretched to twice the width: an equal-area ellipse with curved parallels. The all-sky map of astronomers.' });
  MAPS.add({ id: 'aitoff', name: 'Aitoff', group: 'compromise', props: ['compromise'], who: 'D. Aitoff', year: 1889, jump: 2,
    fwd: (l, f) => { const a = acos(clamp(cos(f) * cos(l / 2), -1, 1)); const k = a < 1e-9 ? 1 : a / sin(a); return [2 * cos(f) * sin(l / 2) * k, sin(f) * k]; },
    note: 'The azimuthal equidistant of half the longitudes, doubled in width: the model for Hammer and Winkel.' });
  MAPS.add({ id: 'winkel-tripel', name: 'Winkel tripel', group: 'compromise', props: ['compromise'], who: 'O. Winkel', year: 1921, jump: 2,
    fwd: (l, f) => { const f1 = acos(2 / PI), a = acos(clamp(cos(f) * cos(l / 2), -1, 1)), k = a < 1e-9 ? 1 : a / sin(a); return [0.5 * (l * cos(f1) + 2 * cos(f) * sin(l / 2) * k), 0.5 * (f + sin(f) * k)]; },
    note: 'The average of the equirectangular and the Aitoff: a three-way ("tripel") compromise of area, angle and distance. The National Geographic Society\'s world map since 1998.' });
  MAPS.add({ id: 'eckert4', name: 'Eckert IV', group: 'pseudocylindrical', props: ['equal-area'], who: 'M. Eckert', year: 1906, jump: 2,
    fwd: (l, f) => { let t = f / 2; const target = (2 + PI / 2) * sin(f); for (let i = 0; i < 15; i++) { const d = (t + sin(t) * cos(t) + 2 * sin(t) - target) / (2 * cos(t) * (1 + cos(t))); t -= d; if (abs(d) < 1e-12) break; } return [2 / sqrt(PI * (4 + PI)) * l * (1 + cos(t)), 2 * sqrt(PI / (4 + PI)) * sin(t)]; },
    note: 'Equal-area with elliptical meridians and flat poles half the length of the equator: a favourite for thematic world maps.' });
  MAPS.add({ id: 'eckert6', name: 'Eckert VI', group: 'pseudocylindrical', props: ['equal-area'], who: 'M. Eckert', year: 1906, jump: 2,
    fwd: (l, f) => { let t = f; const target = (1 + PI / 2) * sin(f); for (let i = 0; i < 15; i++) { const d = (t + sin(t) - target) / (1 + cos(t)); t -= d; if (abs(d) < 1e-12) break; } return [l * (1 + cos(t)) / sqrt(2 + PI), 2 * t / sqrt(2 + PI)]; },
    note: 'Equal-area with sinusoidal meridians and flat poles.' });
  MAPS.add({ id: 'kavrayskiy7', name: 'Kavrayskiy VII', group: 'compromise', props: ['compromise'], who: 'V. V. Kavrayskiy', year: 1939, jump: 2,
    fwd: (l, f) => [1.5 * l * sqrt(Math.max(0, 1 / 3 - (f / PI) * (f / PI))), f], note: 'A simple compromise used in Soviet atlases; low distortion overall.' });
  MAPS.add({ id: 'wagner6', name: 'Wagner VI', group: 'compromise', props: ['compromise'], who: 'K. H. Wagner', year: 1932, jump: 2,
    fwd: (l, f) => [l * sqrt(Math.max(0, 1 - 3 * (f / PI) * (f / PI))), f], note: 'Kavrayskiy VII\'s cousin, with the equator and central meridian in the ratio 2 : 1.' });
  const ROB = [[0, 1, 0], [5, 0.9986, 0.0620], [10, 0.9954, 0.1240], [15, 0.9900, 0.1860], [20, 0.9822, 0.2480], [25, 0.9730, 0.3100], [30, 0.9600, 0.3720], [35, 0.9427, 0.4340], [40, 0.9216, 0.4958], [45, 0.8962, 0.5571], [50, 0.8679, 0.6176], [55, 0.8350, 0.6769], [60, 0.7986, 0.7346], [65, 0.7597, 0.7903], [70, 0.7186, 0.8435], [75, 0.6732, 0.8936], [80, 0.6213, 0.9394], [85, 0.5722, 0.9761], [90, 0.5322, 1]];
  MAPS.add({ id: 'robinson', name: 'Robinson', group: 'compromise', props: ['compromise', 'from a table'], who: 'A. H. Robinson', year: 1963, jump: 2,
    fwd: (l, f) => { const d = abs(f) * R2D, i = Math.min(17, Math.floor(d / 5)), t = (d - 5 * i) / 5; const X = ROB[i][1] + (ROB[i + 1][1] - ROB[i][1]) * t, Y = ROB[i][2] + (ROB[i + 1][2] - ROB[i][2]) * t; return [0.8487 * X * l, 1.3523 * Y * sgn(f)]; },
    note: 'Designed by eye, from a table of 19 rows rather than a formula, to "look right": the National Geographic\'s world map from 1988 to 1998 and the model of the Natural Earth projection.' });
  MAPS.add({ id: 'natural-earth', name: 'Natural Earth', group: 'compromise', props: ['compromise'], who: 'T. Patterson', year: 2008, jump: 2,
    fwd: (l, f) => { const f2 = f * f, f4 = f2 * f2; return [l * (0.8707 - 0.131979 * f2 + f4 * (-0.013791 + f4 * (0.003971 * f2 - 0.001529 * f4))), f * (1.007226 + f2 * (0.015085 + f4 * (-0.044475 + 0.028874 * f2 - 0.005916 * f4)))]; },
    note: 'A polynomial fit to a pleasing shape with rounded corners: a Robinson for the 21st century.' });
  MAPS.add({ id: 'equal-earth', name: 'Equal Earth', group: 'pseudocylindrical', props: ['equal-area'], who: 'Šavrič, Patterson, Jenny', year: 2018, jump: 2,
    fwd: (l, f) => { const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = sqrt(3) / 2; const t = asin(M * sin(f)), t2 = t * t, t6 = t2 * t2 * t2; return [l * cos(t) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))]; },
    note: 'An equal-area projection shaped like the Robinson: the continents keep their true relative sizes and still look natural.' });
  MAPS.add({ id: 'van-der-grinten', name: 'Van der Grinten', group: 'compromise', props: ['compromise', 'the world in a circle'], who: 'A. J. van der Grinten', year: 1904, jump: 3,
    fwd: (l, f) => {
      if (abs(f) < 1e-9) return [l, 0];
      const th = asin(clamp(abs(2 * f / PI), 0, 1));
      if (abs(l) < 1e-9 || abs(abs(f) - PI / 2) < 1e-9) return [0, sgn(f) * PI * tan(th / 2)];
      const A = 0.5 * abs(PI / l - l / PI), Gg = cos(th) / (sin(th) + cos(th) - 1), Pp = Gg * (2 / sin(th) - 1), Q = A * A + Gg;
      const P2 = Pp * Pp, A2 = A * A;
      const x = sgn(l) * PI * (A * (Gg - P2) + sqrt(Math.max(0, A2 * (Gg - P2) * (Gg - P2) - (P2 + A2) * (Gg * Gg - P2)))) / (P2 + A2);
      const y = sgn(f) * PI * (Pp * Q - A * sqrt(Math.max(0, (A2 + 1) * (P2 + A2) - Q * Q))) / (P2 + A2);
      return [x, y];
    },
    note: 'The whole world inside a circle, meridians and parallels all circular arcs: National Geographic\'s world map from 1922 to 1988. Greenland and Antarctica balloon.' });
  /* Goode's homolosine: sinusoidal below 40°44′, Mollweide above, in six lobes */
  const GOODE = { lobes: [{ lat: 1, lon: [-180, -40], c: -100 }, { lat: 1, lon: [-40, 180], c: 30 }, { lat: -1, lon: [-180, -100], c: -160 }, { lat: -1, lon: [-100, -20], c: -60 }, { lat: -1, lon: [-20, 80], c: 20 }, { lat: -1, lon: [80, 180], c: 140 }], phi: 40.73666 * D2R };
  const goodeLobe = (l, f) => { const ld = l * R2D; for (const L of GOODE.lobes) if ((f >= 0) === (L.lat > 0) && ld >= L.lon[0] - 1e-9 && ld <= L.lon[1] + 1e-9) return L; return GOODE.lobes[f >= 0 ? 1 : 4]; };
  MAPS.add({ id: 'goode', name: 'Goode homolosine (interrupted)', group: 'pseudocylindrical', props: ['equal-area', 'interrupted'], who: 'J. P. Goode', year: 1923, domain: 'interrupted', jump: 0.6,
    fwd: (l, f) => { const L = goodeLobe(l, f), c = L.c * D2R, dl = l - c; if (abs(f) <= GOODE.phi) return [c + dl * cos(f), f]; const m = MAPS.defs.mollweide.fwd(dl, f, {}); return [c + m[0], m[1] - sgn(f) * 0.0528035]; },
    cut: (a, b) => goodeLobe(a[0] * D2R, a[1] * D2R) !== goodeLobe(b[0] * D2R, b[1] * D2R),
    outline: o => { const segs = []; for (const L of GOODE.lobes) { const pts = []; const push = (lo, la) => { const p = MAPS.defs.goode.fwd(lo * D2R, la * D2R, o); if (p) pts.push(p); }; const s = L.lat > 0 ? 1 : -1; for (let la = 0; la <= 89.99; la += 1) push(L.lon[0] + 1e-6, s * la); for (let lo = L.lon[0]; lo <= L.lon[1]; lo += 2) push(clamp(lo, L.lon[0] + 1e-6, L.lon[1] - 1e-6), s * 89.99); for (let la = 89.99; la >= 0; la -= 1) push(L.lon[1] - 1e-6, s * la); segs.push(pts); } return segs; },
    note: 'Equal-area and interrupted: the world is cut into lobes through the oceans so that every continent keeps its shape. Sinusoidal near the equator, Mollweide towards the poles.' });

  /* the data behind the table projections, for pages and constructions that lay them off by hand */
  MAPS.defs.robinson.table = ROB.map(r => ({ lat: r[0], plen: r[1], pdfe: r[2] }));
  MAPS.defs.goode.lobes = GOODE.lobes.map(L => ({ north: L.lat > 0, lon: L.lon.slice(), centre: L.c }));
  MAPS.defs.goode.phi = GOODE.phi * R2D;
  /* the constants of a conic projection for the given standard parallels (degrees): the cone constant n, the apex of the
     cone on the map at [0, rho0] above the origin latitude, the radius rho(φ) of a parallel and the sector angle 2πn */
  MAPS.conic = (id, o) => {
    const oo = degOpts(opt(MAPS.get(id), o)), { f1, f2 } = conicN(oo), f0 = oo.lat0 || 0;
    let n, rho;
    if (id === 'lambert-conformal-conic') { n = abs(f2 - f1) < 1e-9 ? sin(f1) : ln(cos(f1) / cos(f2)) / ln(tan(PI / 4 + f2 / 2) / tan(PI / 4 + f1 / 2)); const F = cos(f1) * Math.pow(tan(PI / 4 + f1 / 2), n) / n; rho = f => F * Math.pow(1 / tan(PI / 4 + f / 2), n); }
    else if (id === 'albers') { n = (sin(f1) + sin(f2)) / 2; const C = cos(f1) * cos(f1) + 2 * n * sin(f1); rho = f => sqrt(Math.max(0, C - 2 * n * sin(f))) / n; }
    else { n = abs(f2 - f1) < 1e-9 ? sin(f1) : (cos(f1) - cos(f2)) / (f2 - f1); const Gg = cos(f1) / n + f1; rho = f => Gg - f; }
    const rho0 = rho(f0);
    return { n, rho0, apex: [0, rho0], rho: fDeg => rho(fDeg * D2R), sector: TAU * n, lat1: f1 * R2D, lat2: f2 * R2D };
  };

  /* ----- polyhedral: gnomonic projection on each face, faces laid out in a net */
  function polyhedral(id, name, who, year, note, build) {
    const faces = build();                            // [{ verts: [v3...], net: [[X,Y]...] }]
    faces.forEach(F => {
      const n = P.unit(F.verts.reduce((a, v) => P.add(a, v), [0, 0, 0]));
      const e1 = P.unit(P.sub(F.verts[0], P.scale(n, P.dot(F.verts[0], n)))), e2 = P.cross(n, e1);
      const uv = F.verts.map(v => { const d = P.dot(v, n); return [P.dot(v, e1) / d, P.dot(v, e2) / d]; });
      // the affine map (u, v) -> net from the first three vertices
      const [u0, u1, u2] = uv, [N0, N1, N2] = F.net;
      const det = (u1[0] - u0[0]) * (u2[1] - u0[1]) - (u2[0] - u0[0]) * (u1[1] - u0[1]);
      const a = ((N1[0] - N0[0]) * (u2[1] - u0[1]) - (N2[0] - N0[0]) * (u1[1] - u0[1])) / det, b = ((N2[0] - N0[0]) * (u1[0] - u0[0]) - (N1[0] - N0[0]) * (u2[0] - u0[0])) / det;
      const c = ((N1[1] - N0[1]) * (u2[1] - u0[1]) - (N2[1] - N0[1]) * (u1[1] - u0[1])) / det, d = ((N2[1] - N0[1]) * (u1[0] - u0[0]) - (N1[1] - N0[1]) * (u2[0] - u0[0])) / det;
      F.n = n; F.e1 = e1; F.e2 = e2; F.map = (u, v) => [N0[0] + a * (u - u0[0]) + b * (v - u0[1]), N0[1] + c * (u - u0[0]) + d * (v - u0[1])];
    });
    const faceOf = v => { let best = null, bd = -2; for (const F of faces) { const d = P.dot(v, F.n); if (d > bd) { bd = d; best = F; } } return best; };
    MAPS.add({ id, name, group: 'polyhedral', props: ['gnomonic faces', 'interrupted'], who, year, domain: 'polyhedral', jump: 0.35, faces,
      faceOf: (lon, lat) => faces.indexOf(faceOf(S.toVec(lon * D2R, lat * D2R))),   // the index of the face a point (degrees) falls on
      fwd: (l, f) => { const v = S.toVec(l, f), F = faceOf(v), d = P.dot(v, F.n); return F.map(P.dot(v, F.e1) / d, P.dot(v, F.e2) / d); },
      cut: (a, b) => faceOf(S.toVec(a[0] * D2R, a[1] * D2R)) !== faceOf(S.toVec(b[0] * D2R, b[1] * D2R)),
      outline: () => faces.map(F => F.net.concat([F.net[0]])), note });
  }
  polyhedral('cube', 'Cube (cubemap net)', 'Dürer (nets), VR', '1525 / 1986', 'The sphere projected gnomonically onto the six faces of a cube and unfolded as a cross: the cube map of 360° video and of game skies. Each face is a rectilinear 90° view.', () => {
    const z = [0, 0, 1], faces = [];
    const side = (lon, X) => { const n = [cos(lon), sin(lon), 0], e = [-sin(lon), cos(lon), 0]; const v = (a, b) => P.add(P.add(n, P.scale(e, a)), P.scale(z, b)); faces.push({ verts: [v(-1, -1), v(1, -1), v(1, 1), v(-1, 1)], net: [[X - 1, -1], [X + 1, -1], [X + 1, 1], [X - 1, 1]] }); };
    side(-PI / 2, -2); side(0, 0); side(PI / 2, 2); side(PI, 4);
    faces.push({ verts: [[1, -1, 1], [1, 1, 1], [-1, 1, 1], [-1, -1, 1]], net: [[-1, 1], [1, 1], [1, 3], [-1, 3]] });
    faces.push({ verts: [[1, 1, -1], [1, -1, -1], [-1, -1, -1], [-1, 1, -1]], net: [[1, -1], [-1, -1], [-1, -3], [1, -3]] });
    return faces;
  });
  polyhedral('octahedron', 'Octahedron butterfly (Cahill)', 'B. J. S. Cahill', 1909, 'The sphere on the eight triangles of an octahedron, unfolded as a butterfly so that no continent is cut: Cahill\'s "butterfly map" of 1909, revived by Keyes and by Waterman.', () => {
    const faces = [], Np = [0, 0, 1], Sp = [0, 0, -1], h = sqrt(3) / 2;
    const E = k => [cos(k * PI / 2 + PI / 4), sin(k * PI / 2 + PI / 4), 0];   // equator vertices at 45°, 135°, …
    const centres = [[-1.5, 0], [-0.5, 0], [0.5, 0], [1.5, 0]];
    for (let k = 0; k < 4; k++) {
      const a = E(k), b = E(k + 1), c = centres[(k + 2) % 4][0];
      faces.push({ verts: [a, b, Np], net: [[c - 0.5, 0], [c + 0.5, 0], [c, h]] });
      faces.push({ verts: [b, a, Sp], net: [[c + 0.5, 0], [c - 0.5, 0], [c, -h]] });
    }
    return faces;
  });
  polyhedral('icosahedron', 'Icosahedron net (Dymaxion-style)', 'R. Buckminster Fuller', 1943, 'Twenty gnomonic triangles unfolded into a strip: the idea of Fuller\'s Dymaxion map (his orientation of the solid, chosen so that the land is one island, is different from this standard net).', () => {
    const faces = [], h = sqrt(3) / 2, up = atan(0.5);
    const Np = [0, 0, 1], Sp = [0, 0, -1];
    const U = k => S.toVec(k * 72 * D2R, up), L = k => S.toVec((k * 72 + 36) * D2R, -up);
    for (let k = 0; k < 5; k++) {
      faces.push({ verts: [Np, U(k), U(k + 1)], net: [[k + 0.5, 2 * h], [k, h], [k + 1, h]] });
      faces.push({ verts: [U(k), U(k + 1), L(k)], net: [[k, h], [k + 1, h], [k + 0.5, 0]] });
      faces.push({ verts: [L(k), L(k + 1), U(k + 1)], net: [[k + 0.5, 0], [k + 1.5, 0], [k + 1, h]] });
      faces.push({ verts: [Sp, L(k), L(k + 1)], net: [[k + 1, -h], [k + 0.5, 0], [k + 1.5, 0]] });
    }
    return faces;
  });

  /* ----- historical */
  MAPS.add({ id: 'ptolemy1', name: 'Ptolemy\'s first projection (conic)', group: 'historical', props: ['equidistant conic', 'the known world'], who: 'Claudius Ptolemy', year: '~150', jump: 2, params: { lat1: 36 },
    fwd: (l, f, o) => { const f1 = (o.lat1 == null ? 36 : o.lat1 * R2D) * D2R; if (abs(l) > 95 * D2R || f < -20 * D2R || f > 70 * D2R) return null; const n = sin(f1), Gg = cos(f1) / n + f1, rho = Gg - Math.max(f, 0), rho0 = Gg; if (f >= 0) return [rho * sin(n * l), rho0 - rho * cos(n * l)]; const E = n * l * (cos(f) / cos(0)); const rhoS = Gg - f; return [rhoS * sin(E), rho0 - rhoS * cos(E)]; },
    outline: o => { const segs = [], f = (lo, la) => MAPS.defs.ptolemy1.fwd(lo * D2R, la * D2R, o); const pts = []; for (let la = -16.4; la <= 63; la += 1) pts.push(f(-90, la)); for (let lo = -90; lo <= 90; lo += 2) pts.push(f(lo, 63)); for (let la = 63; la >= -16.4; la -= 1) pts.push(f(90, la)); for (let lo = 90; lo >= -90; lo -= 2) pts.push(f(lo, -16.4)); segs.push(pts.filter(Boolean)); return segs; },
    note: 'Ptolemy\'s simpler projection in the Geography: meridians straight from a point beyond the pole, parallels concentric arcs truly spaced, true along the parallel of Rhodes (36°). Below the equator he bent the meridians back so the southern parallel keeps its length. The known world only: 180° of longitude, from Thule to anti-Meroë.' });
  MAPS.add({ id: 'ptolemy2', name: 'Ptolemy\'s second projection (pseudoconic)', group: 'historical', props: ['curved meridians', 'the known world'], who: 'Claudius Ptolemy', year: '~150', jump: 2,
    fwd: (l, f) => {
      if (abs(l) > 95 * D2R || f < -20 * D2R || f > 70 * D2R) return null;
      // parallels: concentric arcs about a centre above the pole, spaced truly; the meridian through l is a circular
      // arc through its true points on the parallels of Thule (63°), Syene (23°50′) and anti-Meroë (−16°25′)
      const C = 181.83 * D2R;                         // Ptolemy's centre: 181 5/6 units above the equator (R = 1 → radians)
      const rho = p => C - p;
      const on = (p, lo) => { const r = rho(p), t = lo * cos(p) / r; return [r * sin(t), C - r * cos(t)]; };
      const p1 = on(63 * D2R, l), p2 = on(23.833 * D2R, l), p3 = on(-16.417 * D2R, l);
      if (abs(l) < 1e-9) return [0, f];
      // circle through p1, p2, p3
      const ax = p1[0], ay = p1[1], bx = p2[0], by = p2[1], cx = p3[0], cy = p3[1];
      const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
      if (abs(d) < 1e-12) return on(f, l);
      const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
      const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
      const rm = hypot(ax - ux, ay - uy);
      // intersect with the parallel circle (centre (0, C), radius rho(f)) and take the point on l's side
      const r = rho(f), dd = hypot(ux, uy - C); if (dd < 1e-12) return on(f, l);
      const a = (r * r - rm * rm + dd * dd) / (2 * dd), hh = sqrt(Math.max(0, r * r - a * a));
      const mx = ux * a / dd, my = C + (uy - C) * a / dd, nx = -(uy - C) / dd, ny = ux / dd;
      const q1 = [mx + nx * hh, my + ny * hh], q2 = [mx - nx * hh, my - ny * hh];
      return sgn(q1[0]) === sgn(l) ? q1 : q2;
    },
    outline: o => { const segs = [], f = (lo, la) => MAPS.defs.ptolemy2.fwd(lo * D2R, la * D2R, o); const pts = []; for (let la = -16.4; la <= 63; la += 1) pts.push(f(-90, la)); for (let lo = -90; lo <= 90; lo += 2) pts.push(f(lo, 63)); for (let la = 63; la >= -16.4; la -= 1) pts.push(f(90, la)); for (let lo = 90; lo >= -90; lo -= 2) pts.push(f(lo, -16.4)); segs.push(pts.filter(Boolean)); return segs; },
    note: 'Ptolemy\'s "better" projection: the parallels are concentric arcs and the meridians are curved, so the map looks like the globe seen from outside. It governed European world maps from 1409 to the age of Mercator.' });
  MAPS.add({ id: 'ptolemy-marinus', name: 'Marinus (plane chart)', group: 'historical', props: ['rectangular', 'true along one parallel'], who: 'Marinus of Tyre', year: '~100', jump: 2, params: { lat1: 36 },
    fwd: (l, f, o) => [l * cos(o.lat1 == null ? 36 * D2R : o.lat1), f], inv: (x, y, o) => [x / cos(o.lat1 == null ? 36 * D2R : o.lat1), y],
    note: 'The equirectangular with the parallel of Rhodes true: the first mathematical map projection we know of, criticised by Ptolemy and kept by the portolan "plane charts" of sailors.' });

  /* ---------------------------------------------------------------- models for the labs */
  const Mo = P.models = {};
  /* faces are listed counter-clockwise seen from outside; edges are derived */
  function model(pts, faces, name) {
    const es = new Set(), edges = [];
    faces.forEach(f => f.forEach((a, i) => { const b = f[(i + 1) % f.length], k = a < b ? a + '-' + b : b + '-' + a; if (!es.has(k)) { es.add(k); edges.push([a, b]); } }));
    return { name, pts, faces, edges };
  }
  Mo.box = (w, h, d, name) => { w = w == null ? 1 : w; h = h == null ? 1 : h; d = d == null ? 1 : d; const x = w / 2, y = h / 2, z = d / 2;
    return model([[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z], [-x, -y, -z], [x, -y, -z], [x, y, -z], [-x, y, -z]],
      [[0, 1, 2, 3], [5, 4, 7, 6], [1, 5, 6, 2], [4, 0, 3, 7], [3, 2, 6, 7], [4, 5, 1, 0]], name || 'Box'); };
  Mo.cube = s => Mo.box(s, s, s, 'Cube');
  Mo.house = () => model([[-1, -1, 1], [1, -1, 1], [1, 0.6, 1], [0, 1.4, 1], [-1, 0.6, 1], [-1, -1, -1.6], [1, -1, -1.6], [1, 0.6, -1.6], [0, 1.4, -1.6], [-1, 0.6, -1.6]],
    [[0, 1, 2, 3, 4], [6, 5, 9, 8, 7], [1, 6, 7, 2], [5, 0, 4, 9], [2, 7, 8, 3], [4, 3, 8, 9], [5, 6, 1, 0]], 'House');
  Mo.lbracket = () => model([[-1, -1, 0.6], [1, -1, 0.6], [1, -0.3, 0.6], [-0.3, -0.3, 0.6], [-0.3, 1, 0.6], [-1, 1, 0.6], [-1, -1, -0.6], [1, -1, -0.6], [1, -0.3, -0.6], [-0.3, -0.3, -0.6], [-0.3, 1, -0.6], [-1, 1, -0.6]],
    [[0, 1, 2, 3, 4, 5], [7, 6, 11, 10, 9, 8], [1, 7, 8, 2], [2, 8, 9, 3], [3, 9, 10, 4], [4, 10, 11, 5], [6, 0, 5, 11], [6, 7, 1, 0]], 'L-bracket');
  Mo.stairs = () => model([[-1, -1, 0.8], [1, -1, 0.8], [1, -0.3, 0.8], [0.3, -0.3, 0.8], [0.3, 0.4, 0.8], [-0.4, 0.4, 0.8], [-0.4, 1, 0.8], [-1, 1, 0.8],
    [-1, -1, -0.8], [1, -1, -0.8], [1, -0.3, -0.8], [0.3, -0.3, -0.8], [0.3, 0.4, -0.8], [-0.4, 0.4, -0.8], [-0.4, 1, -0.8], [-1, 1, -0.8]],
    [[0, 1, 2, 3, 4, 5, 6, 7], [9, 8, 15, 14, 13, 12, 11, 10], [1, 9, 10, 2], [2, 10, 11, 3], [3, 11, 12, 4], [4, 12, 13, 5], [5, 13, 14, 6], [6, 14, 15, 7], [8, 0, 7, 15], [8, 9, 1, 0]], 'Stairs');
  Mo.pyramid = (s, h) => { s = s == null ? 1 : s; h = h == null ? 1.2 : h; return model([[-s, -h / 2, s], [s, -h / 2, s], [s, -h / 2, -s], [-s, -h / 2, -s], [0, h / 2, 0]], [[3, 2, 1, 0], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]], 'Pyramid'); };
  Mo.cylinder = (r, h, n) => { r = r == null ? 0.7 : r; h = h == null ? 1.4 : h; n = n || 24; const pts = [], top = [], bot = [], faces = [];
    for (let i = 0; i < n; i++) { const a = TAU * i / n; pts.push([r * cos(a), h / 2, r * sin(a)]); }
    for (let i = 0; i < n; i++) { const a = TAU * i / n; pts.push([r * cos(a), -h / 2, r * sin(a)]); }
    for (let i = 0; i < n; i++) { top.push(n - 1 - i); bot.push(n + i); faces.push([i, n + i, n + (i + 1) % n, (i + 1) % n]); }
    const m = model(pts, [top, bot].concat(faces), 'Cylinder'); m.round = true; return m; };
  Mo.tetra = () => model([[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(v => P.scale(v, 0.7)), [[0, 2, 1], [0, 1, 3], [0, 3, 2], [1, 2, 3]], 'Tetrahedron');
  Mo.transform = (m, M) => Object.assign({}, m, { pts: m.pts.map(p => M4.point(M, p) || p) });
  Mo.grid = (n, s) => { n = n || 6; s = s || 1; const pts = [], edges = []; for (let i = 0; i <= n; i++) { pts.push([-n * s / 2 + i * s, 0, -n * s / 2], [-n * s / 2 + i * s, 0, n * s / 2], [-n * s / 2, 0, -n * s / 2 + i * s], [n * s / 2, 0, -n * s / 2 + i * s]); edges.push([4 * i, 4 * i + 1], [4 * i + 2, 4 * i + 3]); } return { name: 'Ground grid', pts, edges, faces: [] }; };
  /* faces that face the viewer under M (projected polygon counter-clockwise in paper coordinates, y up) */
  P.visibleFaces = (M, m) => {
    const pp = m.pts.map(p => M4.point(M, p));
    // a face seen exactly edge-on has a projected area of about ±1e-16: it is not a visible face
    return m.faces.filter(f => { let a = 0; for (let i = 0; i < f.length; i++) { const p = pp[f[i]], q = pp[f[(i + 1) % f.length]]; if (!p || !q) return false; a += p[0] * q[1] - q[0] * p[1]; } return a > 1e-9; });
  };
  /* every edge with whether it is on a visible face (for hidden lines dashed) */
  P.edgesWithVisibility = (M, m) => {
    const vis = new Set(); P.visibleFaces(M, m).forEach(f => f.forEach((a, i) => { const b = f[(i + 1) % f.length]; vis.add(a < b ? a + '-' + b : b + '-' + a); }));
    return m.edges.map(([a, b]) => ({ a, b, visible: vis.has(a < b ? a + '-' + b : b + '-' + a) }));
  };
  /* the mean depth of a face, larger = nearer the viewer: the z row for a parallel projection, the eye distance (−w) for a central one */
  P.depthOf = (M, m, f) => { const proj = !(M[12] === 0 && M[13] === 0 && M[14] === 0 && M[15] === 1); return f.reduce((s, i) => { const q = M4.apply(M, [m.pts[i][0], m.pts[i][1], m.pts[i][2], 1]); return s + (proj ? -q[3] : q[2]); }, 0) / f.length; };
})(typeof window !== 'undefined' ? window : globalThis);
