/* The Puzzle Cabinet · data/geometry-puzzles.js
 * Geometry with a twist: angle chases, lengths that come out whole, shaded areas, circles that touch,
 * solids, grids and the temple problems of old Japan. Every figure is computed from its coordinates and
 * drawn to scale; every answer is checked against the figure when the file loads.
 * Statements are written afresh: the results are classical, the numbers and drawings are ours. */
Cabinet.concepts([
  { id: 'angle-chasing', name: 'Angle chasing',
    text: 'Start with the angles you know and pass them on: angles on a line add to 180°, the angles of a triangle add to 180°, equal sides give equal angles, parallel lines give equal angles. Write each new angle on the figure the moment you find it. Most angle puzzles are a chain of two or three such steps, and the art is seeing which link comes first.' },
  { id: 'circle-angles', name: 'Angles in circles',
    text: 'An angle at the centre is twice the angle at the edge that looks at the same arc. It follows that every angle in a semicircle is a right angle (Thales), that opposite angles of a quadrilateral inscribed in a circle add to 180°, and that a chord and the tangent at its end make the same angle as the edge angle on the other side. Find the arc and half of it is the angle.' },
  { id: 'similarity', name: 'Similar triangles',
    text: 'Two shapes are **similar** if one is a scaled copy of the other: all angles agree and all lengths are in the same ratio. Thales used this about 600 BC to find the height of a pyramid from the length of its shadow; surveyors, painters and sailors have used it ever since. Whenever a figure has parallel lines, look for the small triangle that hides inside the big one.' },
  { id: 'pythagoras', name: 'The theorem of Pythagoras',
    text: 'In a right triangle the square on the longest side equals the sum of the squares on the other two: a² + b² = c². Whole-number triples such as 3-4-5, 5-12-13, 8-15-17 and 7-24-25 make puzzles come out even, and it is worth learning to spot them, alone or scaled: 6-8-10 and 9-12-15 are just 3-4-5 in disguise.' },
  { id: 'tangent-circles', name: 'Circles that touch',
    text: 'When two circles touch, their centres and the point of contact lie on one straight line, and the distance between the centres is the sum of the radii (or their difference, if one is inside the other). A tangent line is at right angles to the radius at the touching point. Most problems about circles that touch turn into a right triangle whose sides are sums and differences of radii.' },
  { id: 'lattice-geometry', name: 'Points on a grid',
    text: 'Polygons whose corners lie on the points of a square grid have a wonderful rule, found by Georg Pick in 1899: area = I + B/2 − 1, where I counts the grid points inside and B those on the boundary. No areas, no measuring, just counting.' },
  { id: 'solids', name: 'Volumes and surfaces',
    text: 'Scale a solid by 2 and its lengths double, its surfaces grow four times and its volume eight times. Archimedes asked to have a sphere in a cylinder carved on his tomb, because he had shown that the sphere takes exactly two thirds of the cylinder in both volume and surface. Slicing a solid into thin layers and comparing the areas of the layers is the oldest way to find a volume.' },
  { id: 'optimisation', name: 'The shortest and the biggest',
    text: 'Which road is shortest, which fence holds most, which fold is longest? Problems of the **best** are hard because there are endlessly many candidates, but the best answer is nearly always balanced: the shortest network meets at equal angles, the biggest rectangle is a square or a half of one, the shortest bent path is a straight line in a suitable picture. Look for the symmetry that the best answer must have.' },
  { id: 'reflection-trick', name: 'The mirror trick',
    text: 'A ball rebounding from a cushion, a ray from a mirror and a fly walking round the walls of a room all follow the shortest route when you unfold the picture: mirror the second point (or the next room, or the next face) and the bent route becomes a straight line. Straight lines are the shortest, so the answer is a distance you can measure with Pythagoras.' }
]);
(function () {
  'use strict';

  /* ---------- the drawing kit: figures are computed, so they are drawn to scale ---------- */
  const INK = '#3a3020', RED = '#b0472f', BLUE = '#3a6ea5', GREEN = '#5a8a3a', GOLD = '#b08a3e', GREY = '#9a8f74', CREAM = '#fbf8ef';
  const SR = '#f0cfc3', SB = '#d3e2f1', SG = '#d8e7c6', SY = '#f5e7b4', SN = '#ece5d1';
  const r2 = (n) => Math.round(n * 100) / 100;
  const RAD = Math.PI / 180, DEG = 180 / Math.PI;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1]], sub = (a, b) => [a[0] - b[0], a[1] - b[1]], mul = (a, t) => [a[0] * t, a[1] * t];
  const len = (a) => Math.hypot(a[0], a[1]), dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], mid = (a, b) => lerp(a, b, 0.5);
  const rot = (p, deg, c) => { c = c || [0, 0]; const s = Math.sin(deg * RAD), k = Math.cos(deg * RAD), x = p[0] - c[0], y = p[1] - c[1]; return [c[0] + x * k - y * s, c[1] + x * s + y * k]; };
  const polar = (c, r, deg) => [c[0] + r * Math.cos(deg * RAD), c[1] + r * Math.sin(deg * RAD)];
  const angOf = (a, v, b) => { const p = sub(a, v), q = sub(b, v); return Math.acos(Math.max(-1, Math.min(1, (p[0] * q[0] + p[1] * q[1]) / (len(p) * len(q))))) * DEG; };
  const polyArea = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return Math.abs(s) / 2; };
  const ccwP = (P) => { let t = 0; for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; t += p[0] * q[1] - q[0] * p[1]; } return t >= 0 ? P : P.slice().reverse(); };
  const inter = (p1, p2, p3, p4) => { const d1 = sub(p2, p1), d2 = sub(p4, p3), den = d1[0] * d2[1] - d1[1] * d2[0], t = ((p3[0] - p1[0]) * d2[1] - (p3[1] - p1[1]) * d2[0]) / den; return [p1[0] + d1[0] * t, p1[1] + d1[1] * t]; };
  const circum = (a, b, c) => { const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1])); const a2 = a[0] * a[0] + a[1] * a[1], b2 = b[0] * b[0] + b[1] * b[1], c2 = c[0] * c[0] + c[1] * c[1]; const x = (a2 * (b[1] - c[1]) + b2 * (c[1] - a[1]) + c2 * (a[1] - b[1])) / d, y = (a2 * (c[0] - b[0]) + b2 * (a[0] - c[0]) + c2 * (b[0] - a[0])) / d; return { c: [x, y], r: Math.hypot(a[0] - x, a[1] - y) }; };
  const cci = (c1, r1, c2, r2_) => { const d = dist(c1, c2), a = (r1 * r1 - r2_ * r2_ + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a)), u = unit(sub(c2, c1)), m = add(c1, mul(u, a)); return [[m[0] - u[1] * h, m[1] + u[0] * h], [m[0] + u[1] * h, m[1] - u[0] * h]]; };
  // the part of a polygon inside a convex polygon (both counter-clockwise)
  function clipPoly(subject, clip) {
    let out = subject;
    for (let i = 0; i < clip.length && out.length; i++) {
      const a = clip[i], b = clip[(i + 1) % clip.length], inp = out;
      const side = (p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
      out = [];
      for (let j = 0; j < inp.length; j++) {
        const p = inp[j], q = inp[(j + 1) % inp.length], sp = side(p), sq = side(q);
        if (sp >= 0) out.push(p);
        if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
      }
    }
    return out;
  }
  const regular = (n, r, c, start) => Array.from({ length: n }, (_, i) => polar(c || [0, 0], r, (start == null ? 90 : start) + i * 360 / n));
  const DEEP = typeof globalThis !== 'undefined' && globalThis.__GEO_DEEP;
  function chk(id, got, want, tol) {
    if (!(Math.abs(got - want) <= (tol == null ? 1e-6 : tol))) throw new Error(id + ': the figure gives ' + got + ' but the answer says ' + want);
  }
  // numeric area of a region by sampling (only while testing: set globalThis.__GEO_DEEP)
  function deep(id, inside, box, want, tolRel) {
    if (!DEEP) return;
    const n = 1400, dx = (box[2] - box[0]) / n, dy = (box[3] - box[1]) / n;
    let c = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (inside(box[0] + (i + 0.5) * dx, box[1] + (j + 0.5) * dy)) c++;
    const a = c * dx * dy;
    if (Math.abs(a - want) > (tolRel || 0.004) * Math.abs(want)) throw new Error(id + ': sampled area ' + a + ' but the answer says ' + want);
  }
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  let UID = 0;

  function scene(W, H, box, pad) {
    pad = pad == null ? 30 : pad;
    const bw = box[2] - box[0], bh = box[3] - box[1];
    const k = Math.min((W - 2 * pad) / bw, (H - 2 * pad) / bh);
    const ox = (W - k * bw) / 2 - k * box[0], oy = (H + k * bh) / 2 + k * box[1];
    let bx0 = 1e9, bx1 = -1e9, by0 = 1e9, by1 = -1e9, tracking = true;   // the extent of everything drawn, so that the figure can be cropped
    const tx = (v) => { if (tracking) { if (v < bx0) bx0 = v; if (v > bx1) bx1 = v; } return v; };
    const ty = (v) => { if (tracking) { if (v < by0) by0 = v; if (v > by1) by1 = v; } return v; };
    const X = (x) => tx(r2(ox + k * x)), Y = (y) => ty(r2(oy - k * y));
    const parts = [];
    const put = (s) => { parts.push(s); return S; };
    const sty = (o) => ' fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke === undefined ? INK : (o.stroke || 'none')) + '" stroke-width="' + (o.sw == null ? 2 : o.sw) + '"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + (o.op != null ? ' opacity="' + o.op + '"' : '') + (o.evenodd ? ' fill-rule="evenodd"' : '') + ' stroke-linejoin="round" stroke-linecap="round"';
    const sv = (a, b) => [X(b[0]) - X(a[0]), Y(b[1]) - Y(a[1])];           // a screen vector from a to b
    const scr = (p) => [X(p[0]), Y(p[1])];
    const hold = (fn) => { const at = parts.length; fn(); return parts.splice(at).join(''); };
    const px = (pts) => pts.map((p) => r2(p[0]) + ',' + r2(p[1])).join(' ');   // screen points
    const S = {
      W, H, k, X, Y, put, scr, sv,
      poly(pts, o) { return put('<polygon points="' + pts.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ') + '"' + sty(o || {}) + '/>'); },
      pl(pts, o) { return put('<polyline points="' + pts.map((p) => X(p[0]) + ',' + Y(p[1])).join(' ') + '"' + sty(o || {}) + '/>'); },
      line(a, b, o) { return put('<line x1="' + X(a[0]) + '" y1="' + Y(a[1]) + '" x2="' + X(b[0]) + '" y2="' + Y(b[1]) + '"' + sty(o || {}) + '/>'); },
      circ(c, r, o) { tx(X(c[0]) - k * r); tx(X(c[0]) + k * r); ty(Y(c[1]) - k * r); ty(Y(c[1]) + k * r); return put('<circle cx="' + X(c[0]) + '" cy="' + Y(c[1]) + '" r="' + r2(k * r) + '"' + sty(o || {}) + '/>'); },
      ell(c, rx, ry, o) { tx(X(c[0]) - k * rx); tx(X(c[0]) + k * rx); ty(Y(c[1]) - k * ry); ty(Y(c[1]) + k * ry); return put('<ellipse cx="' + X(c[0]) + '" cy="' + Y(c[1]) + '" rx="' + r2(k * rx) + '" ry="' + r2(k * ry) + '"' + sty(o || {}) + '/>'); },
      dot(p, o) { o = o || {}; tx(X(p[0]) - 6); tx(X(p[0]) + 6); ty(Y(p[1]) - 6); ty(Y(p[1]) + 6); return put('<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="' + (o.r || 3.6) + '" fill="' + (o.fill || INK) + '" stroke="' + (o.stroke || CREAM) + '" stroke-width="1.2"/>'); },
      M(p) { return 'M' + X(p[0]) + ' ' + Y(p[1]) + ' '; },
      L(p) { return 'L' + X(p[0]) + ' ' + Y(p[1]) + ' '; },
      A(r, p, large, ccw) { tx(X(p[0]) - k * r); tx(X(p[0]) + k * r); ty(Y(p[1]) - k * r); ty(Y(p[1]) + k * r); return 'A' + r2(k * r) + ' ' + r2(k * r) + ' 0 ' + (large ? 1 : 0) + ' ' + (ccw ? 0 : 1) + ' ' + X(p[0]) + ' ' + Y(p[1]) + ' '; },
      path(d, o) { return put('<path d="' + (Array.isArray(d) ? d.join('') : d) + '"' + sty(o || {}) + '/>'); },
      arc(c, r, a0, a1, o) {   // open arc, counter-clockwise from angle a0 to a1 (degrees)
        while (a1 <= a0) a1 += 360;
        return S.path(S.M(polar(c, r, a0)) + S.A(r, polar(c, r, a1), a1 - a0 > 180, true), o);
      },
      sector(c, r, a0, a1, o) {
        while (a1 <= a0) a1 += 360;
        return S.path(S.M(c) + S.L(polar(c, r, a0)) + S.A(r, polar(c, r, a1), a1 - a0 > 180, true) + 'Z', o);
      },
      clip(fn) { const save = tracking; tracking = false; const id = 'gc' + (++UID); parts.push('<clipPath id="' + id + '">' + hold(fn) + '</clipPath>'); tracking = save; return id; },
      clipped(id, fn) { const save = tracking; tracking = false; parts.push('<g clip-path="url(#' + id + ')">' + hold(fn) + '</g>'); tracking = save; return S; },
      text(p, s, o) {
        o = o || {};
        const size = o.size || 16, tw = String(s).length * size * 0.55 + 4, ax = X(p[0]) + (o.dx || 0), ay = Y(p[1]) + (o.dy || 0);
        const an = o.anchor || 'middle';
        tx(an === 'middle' ? ax - tw / 2 : an === 'end' ? ax - tw : ax); tx(an === 'middle' ? ax + tw / 2 : an === 'end' ? ax : ax + tw); ty(ay - size * 0.8); ty(ay + size * 0.6);
        return put('<text x="' + r2(X(p[0]) + (o.dx || 0)) + '" y="' + r2(Y(p[1]) + (o.dy || 0) + size * 0.34) + '" font-family="Georgia,serif" font-size="' + size + '"' + (o.it ? ' font-style="italic"' : '') + (o.bold ? ' font-weight="700"' : '') + ' text-anchor="' + (o.anchor || 'middle') + '" fill="' + (o.fill || INK) + '"' + (o.halo === false ? '' : ' paint-order="stroke" stroke="' + CREAM + '" stroke-width="3.6" stroke-linejoin="round"') + '>' + esc(s) + '</text>');
      },
      name(p, s, dx, dy, o) { return S.text(p, s, Object.assign({ dx: dx || 0, dy: dy || 0, it: true, size: 18 }, o || {})); },
      // vertex names pushed away from a centre point
      names(pts, labels, ctr, d, o) {
        const c = scr(ctr);
        pts.forEach((p, i) => {
          if (labels[i] == null || labels[i] === '') return;
          const q = scr(p), u = unit([q[0] - c[0], q[1] - c[1]]);
          S.name(p, labels[i], u[0] * (d || 15), u[1] * (d || 15), o);
        });
        return S;
      },
      // a label beside the middle of a segment (off pixels to the left of a -> b as seen on the page)
      dim(a, b, s, off, o) {
        const v = unit(sv(a, b)), m = mid(a, b);
        return S.text(m, s, Object.assign({ dx: v[1] * (off || 0), dy: -v[0] * (off || 0) }, o || {}));
      },
      // a dimension line with end stops, drawn beside a segment
      span(a, b, s, off, o) {
        o = o || {};
        const v = unit(sv(a, b)), nx = v[1], ny = -v[0], d = off || 16;
        const A = scr(a), B = scr(b), a2 = [A[0] + nx * d, A[1] + ny * d], b2 = [B[0] + nx * d, B[1] + ny * d];
        [a2, b2].forEach((q) => { tx(q[0] - 8); tx(q[0] + 8); ty(q[1] - 8); ty(q[1] + 8); });
        { const tw = String(s).length * (o.size || 15) * 0.55 + 6, mx = (a2[0] + b2[0]) / 2, my = (a2[1] + b2[1]) / 2; tx(mx - tw / 2); tx(mx + tw / 2); ty(my - 12); ty(my + 12); }
        put('<path d="M' + r2(a2[0]) + ' ' + r2(a2[1]) + ' L' + r2(b2[0]) + ' ' + r2(b2[1]) + ' M' + r2(a2[0] - nx * 5) + ' ' + r2(a2[1] - ny * 5) + ' L' + r2(a2[0] + nx * 5) + ' ' + r2(a2[1] + ny * 5) + ' M' + r2(b2[0] - nx * 5) + ' ' + r2(b2[1] - ny * 5) + ' L' + r2(b2[0] + nx * 5) + ' ' + r2(b2[1] + ny * 5) + '" fill="none" stroke="' + (o.stroke || GREY) + '" stroke-width="1.4"/>');
        const m = [(a2[0] + b2[0]) / 2, (a2[1] + b2[1]) / 2];
        return put('<text x="' + r2(m[0] + nx * (o.lo == null ? 0 : o.lo)) + '" y="' + r2(m[1] + ny * (o.lo == null ? 0 : o.lo) + 5.4) + '" font-family="Georgia,serif" font-size="' + (o.size || 15) + '" text-anchor="middle" fill="' + (o.fill || INK) + '" paint-order="stroke" stroke="' + CREAM + '" stroke-width="4" stroke-linejoin="round">' + esc(s) + '</text>');
      },
      par(a, b, n, t) {   // arrow chevrons that mark a line as parallel to another
        n = n || 1;
        const v = unit(sv(a, b)), M = scr(lerp(a, b, t == null ? 0.5 : t)), nx = -v[1], ny = v[0];
        let d = '';
        for (let i = 0; i < n; i++) {
          const s = (i - (n - 1) / 2) * 8, cx = M[0] + v[0] * s, cy = M[1] + v[1] * s;
          d += 'M' + r2(cx - v[0] * 4 + nx * 5) + ' ' + r2(cy - v[1] * 4 + ny * 5) + ' L' + r2(cx + v[0] * 3) + ' ' + r2(cy + v[1] * 3) + ' L' + r2(cx - v[0] * 4 - nx * 5) + ' ' + r2(cy - v[1] * 4 - ny * 5) + ' ';
        }
        return put('<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="1.8"/>');
      },
      right(v, a, b, sz) {   // the little square that marks a right angle
        sz = sz || 12;
        const ua = unit(sv(v, a)), ub = unit(sv(v, b)), V = scr(v);
        const p1 = [V[0] + ua[0] * sz, V[1] + ua[1] * sz], p2 = [p1[0] + ub[0] * sz, p1[1] + ub[1] * sz], p3 = [V[0] + ub[0] * sz, V[1] + ub[1] * sz];
        return put('<polyline points="' + px([p1, p2, p3]) + '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>');
      },
      tick(a, b, n, o) {   // equal-length marks
        n = n || 1; o = o || {};
        const v = unit(sv(a, b)), M = scr(mid(a, b)), nx = -v[1], ny = v[0];
        let d = '';
        for (let i = 0; i < n; i++) {
          const t = (i - (n - 1) / 2) * 5, cx = M[0] + v[0] * t, cy = M[1] + v[1] * t;
          d += 'M' + r2(cx - nx * 5.5) + ' ' + r2(cy - ny * 5.5) + ' L' + r2(cx + nx * 5.5) + ' ' + r2(cy + ny * 5.5) + ' ';
        }
        return put('<path d="' + d + '" fill="none" stroke="' + (o.stroke || INK) + '" stroke-width="1.8"/>');
      },
      ang(v, a, b, o) {   // an angle arc at v between the rays to a and b, with an optional label
        o = o || {};
        const r = o.r || 24, n = o.n || 1;
        const ua = unit(sv(v, a)), ub = unit(sv(v, b)), V = scr(v);
        { const ext = r + (o.label != null ? (o.ld == null ? 15 : o.ld) + 14 : 6) + n * 5; tx(V[0] - ext); tx(V[0] + ext); ty(V[1] - ext); ty(V[1] + ext); }
        const cr = ua[0] * ub[1] - ua[1] * ub[0];
        let sweep = cr > 0 ? 1 : 0, large = 0;
        if (o.reflex) { large = 1; sweep = 1 - sweep; }
        let d = '';
        for (let i = 0; i < n; i++) {
          const rr = r + i * 5;
          d += 'M' + r2(V[0] + ua[0] * rr) + ' ' + r2(V[1] + ua[1] * rr) + ' A' + rr + ' ' + rr + ' 0 ' + large + ' ' + sweep + ' ' + r2(V[0] + ub[0] * rr) + ' ' + r2(V[1] + ub[1] * rr) + ' ';
        }
        if (o.fill) put('<path d="M' + r2(V[0]) + ' ' + r2(V[1]) + ' L' + r2(V[0] + ua[0] * r) + ' ' + r2(V[1] + ua[1] * r) + ' A' + r + ' ' + r + ' 0 ' + large + ' ' + sweep + ' ' + r2(V[0] + ub[0] * r) + ' ' + r2(V[1] + ub[1] * r) + ' Z" fill="' + o.fill + '" stroke="none"/>');
        put('<path d="' + d + '" fill="none" stroke="' + (o.stroke || RED) + '" stroke-width="1.8"/>');
        if (o.label != null) {
          let bx = ua[0] + ub[0], by = ua[1] + ub[1];
          if (Math.hypot(bx, by) < 1e-6) { bx = -ua[1]; by = ua[0]; }
          const bl = Math.hypot(bx, by); bx /= bl; by /= bl;
          if (o.reflex) { bx = -bx; by = -by; }
          const dd = r + (o.ld == null ? 15 : o.ld);
          put('<text x="' + r2(V[0] + bx * dd) + '" y="' + r2(V[1] + by * dd + 5) + '" font-family="Georgia,serif" font-size="' + (o.size || 15) + '" text-anchor="middle" fill="' + (o.color || RED) + '" font-weight="700" paint-order="stroke" stroke="' + CREAM + '" stroke-width="3.6" stroke-linejoin="round">' + esc(o.label) + '</text>');
        }
        return S;
      },
      grid(x0, y0, x1, y1, step, o) {
        o = o || {}; step = step || 1;
        let d = '';
        for (let x = x0; x <= x1 + 1e-9; x += step) d += 'M' + X(x) + ' ' + Y(y0) + ' L' + X(x) + ' ' + Y(y1) + ' ';
        for (let y = y0; y <= y1 + 1e-9; y += step) d += 'M' + X(x0) + ' ' + Y(y) + ' L' + X(x1) + ' ' + Y(y) + ' ';
        return put('<path d="' + d + '" fill="none" stroke="' + (o.stroke || '#e0d6ba') + '" stroke-width="' + (o.sw || 1.2) + '"/>');
      },
      lattice(x0, y0, x1, y1, o) {
        o = o || {};
        let s = '';
        for (let x = x0; x <= x1; x++) for (let y = y0; y <= y1; y++) s += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="' + (o.r || 2.4) + '" fill="' + (o.fill || '#9a8f74') + '"/>';
        return put(s);
      },
      raw(s) { return put(s); },
      hold,
      out() {
        if (bx1 < bx0) return { svg: parts.join(''), w: W, h: H };
        const m = 12, x0 = Math.max(0, Math.floor(bx0 - m)), x1 = Math.min(W, Math.ceil(bx1 + m)), y0 = Math.max(0, Math.floor(by0 - m)), y1 = Math.min(H, Math.ceil(by1 + m));
        let w = x1 - x0, h = y1 - y0, dx = -x0;
        const MINW = 280, MINH = 110;
        if (w < MINW) { dx += (MINW - w) / 2; w = MINW; }
        let dy = -y0;
        if (h < MINH) { dy += (MINH - h) / 2; h = MINH; }
        return { svg: '<g transform="translate(' + dx + ' ' + dy + ')">' + parts.join('') + '</g>', w, h };
      }
    };
    return S;
  }


  const list = [];
  const puzzle = (p) => { list.push(p); };


  /* =====================  ANGLE CHASES  ===================== */

  puzzle({
    id: 'geo-gable', title: 'The Gable Roof', diff: 1,
    text: 'The two rafters of a gable roof are exactly the same length. At the ridge they meet at an angle of **100°**.\n\nWhat angle does each rafter make with the horizontal beam on which it rests?',
    hints: ['Two equal rafters and the beam make an isosceles triangle. What do you know about its two base angles?', 'The angles of a triangle add up to 180°, and in an isosceles triangle the two base angles are equal.'],
    explain: 'The triangle is isosceles, so the two base angles are equal. Together they make 180° − 100° = 80°, so each one is **40°**.',
    data: {
      answer: { num: 40, unit: '°' }, glyph: '⌂',
      traps: [{ match: 80, msg: '80° is the two base angles together. Each rafter makes half of that.' }],
      figure: (function () {
        const S = scene(460, 250, [-6, -0.7, 6, 5.5]);
        const B = [-5, 0], C = [5, 0], A = [0, 5 * Math.tan(40 * RAD)];
        chk('geo-gable', angOf(A, B, C), 40, 1e-9); chk('geo-gable', angOf(B, A, C), 100, 1e-9);
        S.poly([A, B, C], { fill: SY });
        S.tick(A, B, 1); S.tick(A, C, 1);
        S.ang(A, B, C, { r: 30, label: '100°' });
        S.ang(B, A, C, { r: 34, label: '?', ld: 16 });
        S.names([A, B, C], ['A', 'B', 'C'], [0, 1.4], 16);
        return S.out();
      })()
    },
    concepts: ['angle-chasing'], links: ['geo-exterior-angle', 'geo-chain-36']
  });

  puzzle({
    id: 'geo-exterior-angle', title: 'Outside the Triangle', diff: 1,
    text: 'In triangle ABC the angle at A is **55°** and the angle at B is **65°**. The side BC is extended beyond C to a point D.\n\nHow big is the **outside angle** ACD?',
    hints: ['First find the angle at C inside the triangle.', 'The angles ACB and ACD sit side by side on a straight line, so together they make 180°.'],
    explain: 'Inside the triangle, angle C = 180° − 55° − 65° = 60°. The outside angle is the rest of the straight line: 180° − 60° = **120°**. Notice that 120° = 55° + 65°: an outside angle of a triangle always equals the sum of the two inside angles that are not next to it.',
    data: {
      answer: { num: 120, unit: '°' }, glyph: '∠',
      traps: [{ match: 60, msg: '60° is the angle at C inside the triangle. The question asks for the angle outside, along the extended line.' }, { match: 180, msg: 'That is the whole straight line. Take away the angle inside the triangle.' }],
      figure: (function () {
        const S = scene(480, 270, [-0.5, -0.9, 10.5, 6.9]);
        const B = [0, 0], C = [6, 0], ba = 6 * Math.sin(60 * RAD) / Math.sin(55 * RAD), A = [ba * Math.cos(65 * RAD), ba * Math.sin(65 * RAD)], D = [9.6, 0];
        chk('geo-exterior-angle', angOf(B, A, C), 55, 1e-9); chk('geo-exterior-angle', angOf(A, C, D), 120, 1e-9);
        S.poly([A, B, C], { fill: SY });
        S.line(C, D);
        S.ang(A, B, C, { r: 30, label: '55°' });
        S.ang(B, A, C, { r: 34, label: '65°' });
        S.ang(C, A, D, { r: 26, label: '?', ld: 15 });
        S.name(A, 'A', 0, -15); S.name(B, 'B', -14, 12); S.name(C, 'C', 4, 16); S.name(D, 'D', 8, 16);
        return S.out();
      })()
    },
    concepts: ['angle-chasing'], links: ['geo-gable', 'geo-incentre-angle']
  });

  puzzle({
    id: 'geo-zigzag', title: 'The Bent Fence Rail', diff: 2,
    text: 'Two fence rails run **parallel** to each other. A bent wire runs from a point P on the upper rail to a point Q on the lower rail, with a kink at X in between.\n\nThe wire leaves the upper rail at **35°** and meets the lower rail at **50°**, both measured on the right-hand side, as in the picture.\n\nHow big is the angle PXQ at the kink?',
    hints: ['Draw a third line through X, parallel to the two rails.', 'The new line cuts the kink into two parts. Each part equals one of the given angles (alternate angles between parallel lines).'],
    explain: 'The line through X parallel to the rails splits the kink into two angles. The upper one is an alternate angle to the 35° at P, and the lower one is an alternate angle to the 50° at Q. So the kink is 35° + 50° = **85°**. In general a bent wire between two parallel lines has an angle equal to the sum of the two angles at the ends.',
    data: {
      answer: { num: 85, unit: '°' }, glyph: '⟋',
      traps: [{ match: 95, msg: '95° is 180° − 85°, the angle on the other side of the kink. Which of the two does the picture ask for?' }, { match: 15, msg: 'The angles are added, not subtracted: draw the parallel line through X.' }],
      figure: (function () {
        const S = scene(480, 240, [-0.6, -0.4, 9.6, 4.5]);
        const P = [1.5, 4], X = add(P, [3.4 * Math.cos(-35 * RAD), 3.4 * Math.sin(-35 * RAD)]);
        const Q = [X[0] - X[1] / Math.tan(50 * RAD), 0];
        chk('geo-zigzag', angOf(P, X, Q), 85, 1e-9);
        S.line([-0.3, 4], [9.3, 4], { sw: 2.6 }); S.line([-0.3, 0], [9.3, 0], { sw: 2.6 });
        S.par([-0.3, 4], [9.3, 4], 1, 0.9); S.par([-0.3, 0], [9.3, 0], 1, 0.9);
        S.pl([P, X, Q], { stroke: RED, sw: 3 });
        S.ang(P, add(P, [1, 0]), X, { r: 34, label: '35°', ld: 18 });
        S.ang(Q, add(Q, [1, 0]), X, { r: 34, label: '50°', ld: 18 });
        S.ang(X, P, Q, { r: 24, label: '?', ld: 16, fill: SR });
        S.dot(P); S.dot(Q); S.dot(X);
        S.name(P, 'P', -12, -14); S.name(Q, 'Q', -12, 16); S.name(X, 'X', 15, 0);
        return S.out();
      })()
    },
    concepts: ['angle-chasing'], links: ['geo-exterior-angle']
  });

  puzzle({
    id: 'geo-dodecagon', title: 'The Corner of the Clock', diff: 2,
    text: 'The twelve numbers on a clock face sit at the corners of a **regular twelve-sided figure**. Join each number to its neighbours and you get twelve equal sides.\n\nHow big is the angle **inside** the figure at one corner, between two neighbouring sides?',
    hints: ['Look at the centre: how far apart, as an angle, are two neighbouring numbers?', 'The centre and two neighbouring corners make an isosceles triangle whose top angle is 30°. Its base angles are half of the corner angle.'],
    explain: 'Two neighbouring corners are 360° ÷ 12 = 30° apart as seen from the centre. The triangle they make with the centre is isosceles with top angle 30°, so each base angle is (180° − 30°) ÷ 2 = 75°. The corner of the figure is made of two such base angles: 2 × 75° = **150°**. (Another way: walking round the figure you turn 30° at each corner, and 180° − 30° = 150°.)',
    data: {
      answer: { num: 150, unit: '°' }, glyph: '12',
      traps: [{ match: 30, msg: '30° is the angle at the centre, or the turn you make when walking round. The corner inside is the rest of a straight angle.' }, { match: 75, msg: '75° is half a corner. The corner is made of two of those.' }],
      figure: (function () {
        const S = scene(440, 300, [-5.6, -5.6, 5.6, 5.6], 18);
        const pts = regular(12, 5, [0, 0], 90 - 15), O = [0, 0];
        chk('geo-dodecagon', angOf(pts[11], pts[0], pts[1]), 150, 1e-9);
        S.poly(pts, { fill: SY });
        S.line(O, pts[0], { dash: '5 4', sw: 1.6 }); S.line(O, pts[1], { dash: '5 4', sw: 1.6 });
        S.ang(O, pts[0], pts[1], { r: 30, label: '30°', ld: 13 });
        S.ang(pts[0], pts[11], pts[1], { r: 22, label: '?', ld: 14, fill: SR });
        pts.forEach((p) => S.dot(p, { r: 3 }));
        S.dot(O);
        return S.out();
      })()
    },
    concepts: ['angle-chasing', 'symmetry'], links: ['geo-pentagram-tip']
  });

  puzzle({
    id: 'geo-clock-hands', title: 'Twenty to Four', diff: 2,
    text: 'It is exactly **3:40**. The minute hand points at the 8 and the hour hand has left the 3 behind.\n\nWhat is the (smaller) angle between the two hands?',
    hints: ['The minute hand moves 360° in 60 minutes: how many degrees is that per minute? And the hour hand moves 360° in 12 hours.', 'At 3:40 the hour hand is not on the 3: it has travelled two thirds of the way from the 3 to the 4.'],
    explain: 'Measure from the 12 clockwise. The minute hand at 40 minutes is at 40 × 6° = 240°. The hour hand moves 30° per hour and ½° per minute: 3 × 30° + 40 × ½° = 110°. The difference is 240° − 110° = **130°**. The trap is to leave the hour hand exactly on the 3 (90°), which gives 150°.',
    data: {
      answer: { num: 130, unit: '°' }, glyph: '🕞',
      traps: [{ match: 150, msg: 'That puts the hour hand exactly on the 3. At twenty to four it has crept two thirds of the way to the 4.' }, { match: 230, msg: 'That is the long way round. Take the smaller angle between the hands.' }],
      figure: (function () {
        const S = scene(360, 300, [-5.4, -5.4, 5.4, 5.4], 14);
        const O = [0, 0], at = (min, r) => polar(O, r, 90 - min * 6);
        S.circ(O, 5, { fill: '#fffdf6', sw: 3 });
        for (let i = 0; i < 60; i++) S.line(at(i, 5), at(i, i % 5 ? 4.75 : 4.45), { sw: i % 5 ? 1 : 2 });
        [12, 3, 6, 9, 1, 2, 4, 5, 7, 8, 10, 11].forEach((n) => S.text(at(n * 5, 3.7), String(n), { size: 17, halo: false }));
        const hourTip = polar(O, 2.7, 90 - 110), minTip = at(40, 4.2);
        chk('geo-clock-hands', angOf(hourTip, O, minTip), 130, 1e-9);
        S.ang(O, hourTip, minTip, { r: 30, label: '?', fill: SR, ld: 16 });
        S.line(O, hourTip, { stroke: INK, sw: 6 }); S.line(O, minTip, { stroke: RED, sw: 3.4 });
        S.dot(O, { r: 5 });
        return S.out();
      })()
    },
    concepts: ['angle-chasing', 'rates'], links: ['geo-dodecagon']
  });

  puzzle({
    id: 'geo-thales-semicircle', title: 'The Angle in the Semicircle', diff: 1,
    text: 'AB is a diameter of a circle and C is any other point on the circle. The angle CAB at A is **32°**.\n\nHow big is the angle CBA at B?',
    hints: ['Whatever the position of C, the angle ACB is always the same. What is it? (Thales knew.)', 'Then the angles of the triangle ABC must add up to 180°.'],
    explain: 'An angle in a semicircle is a right angle, wherever C sits on the arc: ACB = 90°. The other two angles of the triangle add up to 90°, so angle B = 90° − 32° = **58°**. The theorem is credited to Thales of Miletus, about 600 BC.',
    data: {
      answer: { num: 58, unit: '°' }, glyph: '◠',
      traps: [{ match: 32, msg: '32° is the angle at A. Angle B is a different one.' }, { match: 148, msg: 'That is 180° − 32°: you forgot the right angle at C.' }],
      figure: (function () {
        const S = scene(480, 260, [-5.6, -0.8, 5.6, 5.7]);
        const O = [0, 0], A = [-5, 0], B = [5, 0], C = polar(O, 5, 64);
        chk('geo-thales-semicircle', angOf(B, A, C), 32, 1e-9); chk('geo-thales-semicircle', angOf(A, C, B), 90, 1e-9);
        S.path(S.M(A) + S.A(5, B, 0, 0) + 'Z', { fill: SB });
        S.poly([A, B, C], { fill: SY });
        S.right(C, A, B, 11);
        S.ang(A, B, C, { r: 36, label: '32°', ld: 16 });
        S.ang(B, A, C, { r: 34, label: '?', ld: 16 });
        S.dot(O, { r: 2.6 });
        S.name(A, 'A', -13, 4); S.name(B, 'B', 13, 4); S.name(C, 'C', 4, -15);
        return S.out();
      })()
    },
    concepts: ['circle-angles'], links: ['geo-inscribed-angle', 'geo-rectangle-in-circle']
  });

  puzzle({
    id: 'geo-inscribed-angle', title: 'Twice as Wide at the Centre', diff: 2,
    text: 'A and B are two points on a circle with centre O, and the angle AOB at the centre is **100°**. C is another point on the circle, on the long arc from A round to B.\n\nHow big is the angle ACB?',
    hints: ['The angle at the centre and the angle at the edge look at the same arc AB.', 'Draw the radius OC. It splits the picture into two isosceles triangles.'],
    explain: 'The angle at the edge is **half** the angle at the centre when both look at the same arc: ACB = 100° ÷ 2 = **50°**, and it stays 50° wherever C sits on the long arc. To see why, draw the radius OC: the isosceles triangles OAC and OBC have equal base angles, and the outside angle of each triangle is twice a base angle.',
    data: {
      answer: { num: 50, unit: '°' }, glyph: '∡',
      traps: [{ match: 100, msg: '100° is the angle at the centre. The angle at the edge is smaller.' }, { match: 130, msg: '130° would be the angle if C sat on the short arc, on the other side of AB. Here C is on the long arc.' }],
      figure: (function () {
        const S = scene(460, 310, [-5.4, -6.1, 5.4, 5.4], 16);
        const O = [0, 0], A = polar(O, 5, 90 + 50), B = polar(O, 5, 90 - 50), C = polar(O, 5, -75);
        chk('geo-inscribed-angle', angOf(A, O, B), 100, 1e-9); chk('geo-inscribed-angle', angOf(A, C, B), 50, 1e-9);
        S.circ(O, 5, { fill: '#fffdf6' });
        S.poly([O, A, B], { fill: SY, sw: 2 });
        S.pl([A, C, B], { sw: 2 });
        S.ang(O, A, B, { r: 26, label: '100°', ld: 20, n: 1 });
        S.ang(C, A, B, { r: 42, label: '?', ld: 14 });
        S.dot(O);
        S.name(A, 'A', -15, -6); S.name(B, 'B', 15, -6); S.name(C, 'C', 0, 18); S.name(O, 'O', 15, 12);
        return S.out();
      })()
    },
    concepts: ['circle-angles'], links: ['geo-thales-semicircle', 'geo-cyclic-quadrilateral', 'geo-tangent-chord-angle']
  });

  puzzle({
    id: 'geo-cyclic-quadrilateral', title: 'Four Corners on a Circle', diff: 2,
    text: 'The four corners of a quadrilateral ABCD all lie on a circle. The angle at A is **78°** and the angle at B is **103°**.\n\nHow big is the angle at C?',
    hints: ['The corner A looks at one arc of the circle (the arc BCD), and the opposite corner C looks at the rest of the circle (the arc DAB).', 'Opposite angles of a quadrilateral on a circle add up to 180°.'],
    explain: 'The angle at A looks at the arc BCD and the angle at C looks at the arc DAB. Those two arcs make the whole circle, 360°, and each angle is half its arc; so A + C = 180°, and C = 180° − 78° = **102°**. The angle at B is not needed: it is there to tempt you into using it. (It tells you that D = 180° − 103° = 77°.)',
    data: {
      answer: { num: 102, unit: '°' }, glyph: '▱',
      traps: [{ match: 103, msg: '103° is the angle at B, not C.' }, { match: 77, msg: '77° is the angle at D (opposite B). The angle at C is opposite A.' }, { match: 78, msg: 'That is the angle at A. C is the corner opposite to it.' }],
      figure: (function () {
        const S = scene(440, 300, [-5.6, -5.6, 5.6, 5.6], 14);
        const O = [0, 0], A = polar(O, 5, 210), B = polar(O, 5, 304), C = polar(O, 5, 4), D = polar(O, 5, 100);
        chk('geo-cyclic-quadrilateral', angOf(D, A, B), 78, 1e-6); chk('geo-cyclic-quadrilateral', angOf(A, B, C), 103, 1e-6); chk('geo-cyclic-quadrilateral', angOf(B, C, D), 102, 1e-6);
        S.circ(O, 5, { fill: '#fffdf6', sw: 1.6 });
        S.poly([A, B, C, D], { fill: SY });
        S.ang(A, D, B, { r: 28, label: '78°', ld: 14 });
        S.ang(B, A, C, { r: 28, label: '103°', ld: 16 });
        S.ang(C, B, D, { r: 26, label: '?', ld: 14 });
        S.name(A, 'A', -15, 6); S.name(B, 'B', 4, 18); S.name(C, 'C', 15, 4); S.name(D, 'D', 2, -16);
        return S.out();
      })()
    },
    concepts: ['circle-angles'], links: ['geo-inscribed-angle', 'geo-square-inscribed-semicircle']
  });

  puzzle({
    id: 'geo-incentre-angle', title: 'Where the Bisectors Meet', diff: 3,
    text: 'In triangle ABC the angle at A is **50°**. The lines that cut the angles at B and at C exactly in half meet at a point I inside the triangle.\n\nHow big is the angle BIC?',
    hints: ['You are not told the angles at B and C. What do you know about their sum?', 'Half of B plus half of C is half of their sum. Use the triangle BIC.'],
    explain: 'The angles at B and C add up to 180° − 50° = 130°. The bisectors use half of each, together 65°. In triangle BIC the remaining angle is 180° − 65° = **115°**. In general, angle BIC = 90° + A/2, whatever the shape of the triangle: try it with a fatter or a thinner triangle.',
    data: {
      answer: { num: 115, unit: '°' }, glyph: 'I',
      traps: [{ match: 130, msg: '130° is B + C. The bisectors use only half of each of those.' }, { match: 65, msg: '65° is half of B + C. It is the two small angles at B and C inside triangle BIC; you need the third angle.' }],
      figure: (function () {
        const S = scene(480, 310, [-0.6, -1, 7.6, 8.8]);
        const B = [0, 0], C = [7, 0], ab = 7 * Math.sin(60 * RAD) / Math.sin(50 * RAD), A = [ab * Math.cos(70 * RAD), ab * Math.sin(70 * RAD)];
        const a = dist(B, C), b = dist(A, C), c = dist(A, B), I = [(a * A[0] + b * B[0] + c * C[0]) / (a + b + c), (a * A[1] + b * B[1] + c * C[1]) / (a + b + c)];
        chk('geo-incentre-angle', angOf(B, I, C), 115, 1e-9);
        S.poly([A, B, C], { fill: SY });
        S.poly([B, I, C], { fill: SR, stroke: null });
        S.line(B, I, { stroke: RED, sw: 2.2 }); S.line(C, I, { stroke: RED, sw: 2.2 }); S.line(A, I, { dash: '5 4', sw: 1.4 });
        S.poly([A, B, C], {});
        S.ang(A, B, C, { r: 30, label: '50°', ld: 14 });
        S.ang(B, C, I, { r: 30, n: 1 }); S.ang(B, I, A, { r: 30, n: 1 });
        S.ang(C, B, I, { r: 30, n: 2 }); S.ang(C, I, A, { r: 30, n: 2 });
        S.ang(I, B, C, { r: 22, label: '?', ld: 12 });
        S.dot(I);
        S.name(A, 'A', -2, -15); S.name(B, 'B', -14, 12); S.name(C, 'C', 14, 12); S.name(I, 'I', 0, -17);
        return S.out();
      })()
    },
    concepts: ['angle-chasing'], links: ['geo-exterior-angle', 'geo-incircle-right-triangle']
  });

  puzzle({
    id: 'geo-tangent-chord-angle', title: 'The Tangent and the Chord', diff: 3,
    text: 'A straight line touches a circle at A. From A a chord AB is drawn, and it makes an angle of **32°** with the touching line (the tangent). O is the centre of the circle.\n\nHow big is the angle AOB at the centre?',
    hints: ['A tangent is at right angles to the radius at the point where it touches. So what is the angle between OA and the chord?', 'Triangle OAB is isosceles: OA and OB are both radii.'],
    explain: 'The radius OA is perpendicular to the tangent, so the angle between OA and the chord AB is 90° − 32° = 58°. Triangle OAB is isosceles (OA = OB), so its angle at B is also 58° and the angle at the centre is 180° − 58° − 58° = **64°**. So the angle at the centre is exactly twice the angle between the tangent and the chord.',
    data: {
      answer: { num: 64, unit: '°' }, glyph: '⌒',
      traps: [{ match: 32, msg: '32° is the angle between the tangent and the chord. The angle at the centre is different.' }, { match: 58, msg: '58° is the angle at A and at B inside the isosceles triangle. The question asks for the angle at the centre O.' }],
      figure: (function () {
        const S = scene(480, 290, [-6.6, -5.9, 6.6, 5.9], 16);
        const O = [0, 0], A = [0, -5], B = polar(O, 5, -90 + 64);
        chk('geo-tangent-chord-angle', angOf(A, O, B), 64, 1e-9);
        S.circ(O, 5, { fill: '#fffdf6' });
        S.line([-6.2, -5], [6.2, -5], { sw: 2.4 });
        S.poly([O, A, B], { fill: SY });
        S.right(A, O, [1, -5], 11);
        S.ang(A, [3, -5], B, { r: 40, label: '32°', ld: 14 });
        S.ang(O, A, B, { r: 28, label: '?', ld: 13 });
        S.dot(O);
        S.name(A, 'A', -4, 19); S.name(B, 'B', 14, -8); S.name(O, 'O', -14, -4);
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'angle-chasing'], links: ['geo-inscribed-angle']
  });

  puzzle({
    id: 'geo-pentagram-tip', title: 'The Point of the Star', diff: 3,
    text: 'A five-pointed star is drawn by joining every second corner of a **regular pentagon**: five straight lines, the pentagram, which the Pythagoreans are said to have used as their badge.\n\nHow big is the angle at the tip of one point of the star?',
    hints: ['The five corners are equally spaced on a circle. How many degrees of arc lie between two neighbours?', 'The tip looks at one arc of the circle, the one between the two far corners. An angle at the edge is half of its arc.'],
    explain: 'The five corners cut the circle into arcs of 360° ÷ 5 = 72°. At a tip, the two lines go to the two corners that are furthest away, and between those corners (the side away from the tip) lies exactly **one** arc of 72°. An angle at the edge is half of the arc it looks at, so the tip is 72° ÷ 2 = **36°**. Five tips make 180°; that total is the same for every five-pointed star, regular or not.',
    data: {
      answer: { num: 36, unit: '°' }, glyph: '☆',
      traps: [{ match: 72, msg: '72° is the arc between two corners. The angle at the tip is half of it.' }, { match: 108, msg: '108° is the corner of the pentagon. The tip of the star is a different, much sharper angle.' }],
      figure: (function () {
        const S = scene(420, 320, [-5.5, -5.2, 5.5, 5.5], 12);
        const V = regular(5, 5, [0, 0], 90);
        chk('geo-pentagram-tip', angOf(V[2], V[0], V[3]), 36, 1e-9);
        S.circ([0, 0], 5, { fill: '#fffdf6', sw: 1.2, stroke: GREY });
        S.path(S.M(V[0]) + S.L(V[2]) + S.L(V[4]) + S.L(V[1]) + S.L(V[3]) + 'Z', { fill: SY });
        S.ang(V[0], V[2], V[3], { r: 34, label: '?', ld: 12, fill: SR });
        V.forEach((p) => S.dot(p, { r: 3 }));
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'symmetry'], links: ['geo-octagram-tip', 'geo-dodecagon']
  });

  puzzle({
    id: 'geo-square-equilateral', title: 'A Triangle Inside a Square', diff: 3,
    text: 'ABCD is a square. An **equilateral triangle** ABE is drawn on the side AB, pointing **into** the square, so that E lies inside it.\n\nHow big is the angle DEC?',
    hints: ['Look at triangle ADE: what do you know about its sides AD and AE, and about its angle at A?', 'Angle DAE is 90° − 60° = 30°, and ADE is isosceles. Find the angles AED and BEC, then use the full turn of 360° around E.'],
    explain: 'AD = AB = AE, so triangle ADE is isosceles with top angle DAE = 90° − 60° = 30°. Its base angles are (180° − 30°) ÷ 2 = 75°, so AED = 75°, and by symmetry BEC = 75°. Around E the angles add up to 360°: DEC = 360° − 60° (the triangle AEB) − 75° − 75° = **150°**.',
    data: {
      answer: { num: 150, unit: '°' }, glyph: '△',
      traps: [{ match: 30, msg: '30° is the angle DAE. The question asks for the angle at E between D and C.' }, { match: 75, msg: '75° is the angle AED. Angle DEC is the one that faces the top side of the square.' }],
      figure: (function () {
        const S = scene(380, 340, [-0.5, -0.5, 5.5, 5.5], 26);
        const s = 5, A = [0, 0], B = [s, 0], C = [s, s], D = [0, s], E = [s / 2, s * Math.sqrt(3) / 2];
        chk('geo-square-equilateral', angOf(D, E, C), 150, 1e-9);
        S.poly([A, B, C, D], { fill: SN });
        S.poly([A, B, E], { fill: SY });
        S.poly([D, E, C], { fill: SR, stroke: INK, sw: 1.6 });
        S.tick(A, B, 1); S.tick(B, E, 1); S.tick(A, E, 1);
        S.ang(E, D, C, { r: 24, label: '?', ld: -1, size: 17, stroke: RED });
        S.names([A, B, C, D], ['A', 'B', 'C', 'D'], [2.5, 2.5], 15); S.name(E, 'E', 0, 18);
        return S.out();
      })()
    },
    concepts: ['angle-chasing', 'symmetry'], links: ['geo-chain-36']
  });

  puzzle({
    id: 'geo-chain-36', title: 'Three Equal Sides', diff: 4,
    text: 'Triangle ABC has AB = AC. A point D on the side AC is chosen so that **AD = BD = BC**, as marked in the picture.\n\nHow big is the angle at A?',
    hints: ['Call the angle at A by a letter, x, and pass it on: which other angle in the picture is equal to x?', 'Triangle ABD is isosceles, so ABD = x. The angle BDC is an outside angle of that triangle, so BDC = 2x. Then BD = BC gives another equal pair.'],
    explain: 'Let the angle at A be x. Since AD = BD, angle ABD = x, so the outside angle BDC = 2x. Since BC = BD, angle BCD = BDC = 2x. Since AB = AC, angle ABC = ACB = 2x, so angle DBC = 2x − x = x. Now triangle BCD has angles x, 2x, 2x, which add up to 5x = 180°: **x = 36°**. This is the triangle of the regular pentagon and the golden ratio: AB : BC = 1.618… .',
    data: {
      answer: { num: 36, unit: '°' }, glyph: '36°',
      traps: [{ match: 20, msg: 'Something is off: try the chain of angles x, 2x, 2x in triangle BCD.' }, { match: 72, msg: '72° is the base angle. Ask for the angle at A.' }],
      figure: (function () {
        const S = scene(440, 330, [-3.7, -0.4, 3.7, 12.5], 22);
        const L = 12, w = L * Math.sin(18 * RAD), H = L * Math.cos(18 * RAD), A = [0, H], B = [-w, 0], C = [w, 0], D = lerp(A, C, (2 * w) / L);
        chk('geo-chain-36', angOf(B, A, C), 36, 1e-9); chk('geo-chain-36', dist(B, D), dist(B, C), 1e-9); chk('geo-chain-36', dist(A, D), dist(B, C), 1e-9);
        S.poly([A, B, C], { fill: SY });
        S.line(B, D, { sw: 2 });
        S.tick(A, D, 1); S.tick(B, D, 1); S.tick(B, C, 1); S.tick(A, B, 2); S.tick(A, C, 2, {});
        S.ang(A, B, C, { r: 42, label: '?', ld: 16 });
        S.names([A, B, C], ['A', 'B', 'C'], [0, 4], 16); S.name(D, 'D', 16, 0);
        return S.out();
      })()
    },
    concepts: ['angle-chasing'], links: ['geo-pentagram-tip', 'geo-langley']
  });

  puzzle({
    id: 'geo-octagram-tip', title: 'A Star with Eight Points', diff: 4,
    text: 'Put eight points evenly round a circle and join each one to the **third** point along, going the same way every time. The result is an eight-pointed star drawn in one stroke.\n\nHow big is the angle at the tip of each point?',
    hints: ['Each tip looks at an arc of the circle that lies on the far side of its two lines. How many steps of 45° does that arc contain?', 'From a point, the two lines go 3 steps to the left and 3 steps to the right. Out of 8 steps, how many are left over for the arc between them?'],
    explain: 'The points are 45° apart on the circle. From a tip, the lines go three steps one way and three steps the other, so the arc left between their far ends has 8 − 3 − 3 = 2 steps = 90°. The angle at the tip is an angle at the edge looking at that arc, so it is half: **45°**. (With five points and the second neighbour the same idea gives the 36° of the pentagram.)',
    data: {
      answer: { num: 45, unit: '°' }, glyph: '✷',
      traps: [{ match: 90, msg: '90° is the arc that the tip looks at. The angle at the edge is half of it.' }, { match: 135, msg: '135° is the corner of a regular octagon: a different, blunter angle.' }],
      figure: (function () {
        const S = scene(420, 330, [-5.4, -5.4, 5.4, 5.4], 12);
        const V = regular(8, 5, [0, 0], 90);
        chk('geo-octagram-tip', angOf(V[3], V[0], V[5]), 45, 1e-9);
        S.circ([0, 0], 5, { fill: '#fffdf6', sw: 1.2, stroke: GREY });
        const order = [0, 3, 6, 1, 4, 7, 2, 5];
        S.path(order.map((i, k) => (k ? S.L(V[i]) : S.M(V[i]))).join('') + 'Z', { fill: SY, sw: 1.8 });
        S.ang(V[0], V[3], V[5], { r: 30, label: '?', ld: 12, fill: SR });
        V.forEach((p) => S.dot(p, { r: 3 }));
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'symmetry'], links: ['geo-pentagram-tip']
  });

  puzzle({
    id: 'geo-langley', title: 'Langley’s Angles', diff: 5,
    source: 'E. M. Langley, a problem set in the Mathematical Gazette in 1922; it became famous because the answer is so tidy and the road to it so hidden.',
    text: 'Triangle ABC has AB = AC and an angle of **20°** at A, so its base angles at B and C are **80°** each.\n\nFrom B a line is drawn to a point D on AC so that the angle DBC is **60°**. From C a line is drawn to a point E on AB so that the angle ECB is **50°**. Join D and E.\n\nHow big is the angle BDE?',
    hints: ['Find the easy angles first: ABD, ACE, BEC. Two of the triangles in the picture turn out to be isosceles.', 'Put BC = 1. Then BE = 1 (triangle BCE has two equal angles), and the sine rule in triangle BCD gives BD.', 'In triangle EBD you know two sides and the angle between them (20°). The cosine rule gives ED; then the sine rule gives the angle at D.'],
    explain: 'The angles are 20° and 20° at A and B in triangle ABD, so AD = BD; and triangle BCE has angles 80° and 50°, so BEC = 50° and **BE = BC = 1**. In triangle BCD the angles are 60°, 80° and 40°, so the sine rule gives BD = sin 80° ÷ sin 40° = 2 cos 40°. Triangle EBD has sides 1 and 2 cos 40° around an angle of 20° (ABD). The cosine rule gives ED² = 1 + 4cos²40° − 4cos40°cos20°, which simplifies to 4 sin²20°, so **ED = 2 sin 20°**. Then the sine rule: sin(BDE) = sin 20° ÷ ED = ½, and the angle is acute, so BDE = **30°**. A proof without trigonometry exists too, but it needs extra lines that are hard to find, which is why the problem is famous.',
    data: {
      answer: { num: 30, unit: '°' }, glyph: '30°',
      traps: [{ match: 20, msg: '20° is the angle at A. Angle BDE is a different, hidden one.' }, { match: 40, msg: '40° is the angle BDC. Angle BDE is smaller than that.' }, { match: 50, msg: '50° is the angle at E in triangle BCE: not the angle at D.' }],
      figure: (function () {
        const S = scene(520, 250, [-1.2, -4.9, 23.6, 4.9], 16);
        // the triangle is long and thin, so it lies on its side: the base BC is on the left
        const k = 8, tr = (p) => [p[1], -p[0]];
        const B0 = [0, 0], C0 = [k, 0], A0 = [k / 2, (k / 2) * Math.tan(80 * RAD)];
        const D0 = inter(B0, [Math.cos(60 * RAD), Math.sin(60 * RAD)], A0, C0), E0 = inter(C0, [k + Math.cos(130 * RAD), Math.sin(130 * RAD)], A0, B0);
        chk('geo-langley', angOf(B0, D0, E0), 30, 1e-9);
        const off = [0, k / 2], B = add(tr(B0), off), C = add(tr(C0), off), A = add(tr(A0), off), D = add(tr(D0), off), E = add(tr(E0), off);
        S.poly([A, B, C], { fill: SY });
        S.line(B, D, { sw: 2 }); S.line(C, E, { sw: 2 }); S.line(D, E, { stroke: RED, sw: 2.6 });
        S.ang(A, B, C, { r: 44, label: '20°', ld: 15 });
        S.ang(B, C, D, { r: 34, label: '60°', ld: 15 });
        S.ang(C, B, E, { r: 34, label: '50°', ld: 15 });
        S.ang(D, B, E, { r: 22, label: '?', ld: 11, size: 16 });
        S.name(A, 'A', 14, 0); S.name(B, 'B', -14, -8); S.name(C, 'C', -14, 8); S.name(D, 'D', 6, -14); S.name(E, 'E', 6, 15);
        return S.out();
      })()
    },
    concepts: ['angle-chasing'], links: ['geo-chain-36']
  });


  /* =====================  LENGTHS AND PYTHAGORAS  ===================== */

  // a little oblique (cavalier) view of a box: x to the right, y up, z going back
  const OB = (x, y, z) => [x + 0.42 * z, y + 0.3 * z];
  function box3(S, w, h, d, o) {
    o = o || {};
    const a = OB(0, 0, 0), b = OB(w, 0, 0), c = OB(w, h, 0), dd = OB(0, h, 0), e = OB(0, 0, d), f = OB(w, 0, d), g = OB(w, h, d), hh = OB(0, h, d);
    const hid = { dash: '5 4', stroke: GREY, sw: 1.6 };
    const F = (k, dflt) => (o.clear ? null : (o[k] || dflt));
    if (o.left) S.poly([a, dd, hh, e], { fill: o.left, stroke: GREY, sw: 1.2 });
    S.line(e, f, hid); S.line(e, hh, hid); S.line(e, a, hid);
    S.poly([a, b, c, dd], { fill: F('front', SY) });
    S.poly([dd, c, g, hh], { fill: F('top', SN) });
    S.poly([b, f, g, c], { fill: F('side', '#e4d6a2') });
    return { a, b, c, d: dd, e, f, g, h: hh };
  }

  puzzle({
    id: 'geo-ladder-wall', title: 'The Ladder and the Wall', diff: 1,
    text: 'A ladder **13 m** long leans against a vertical wall. Its foot stands on level ground **5 m** from the wall.\n\nHow high up the wall does the ladder reach?',
    hints: ['The wall, the ground and the ladder make a right triangle. Which of its sides is the ladder?', 'Pythagoras: 5² + h² = 13².'],
    explain: 'The ladder is the longest side of a right triangle, so h² + 5² = 13², which gives h² = 169 − 25 = 144 and h = **12 m**. The triple 5-12-13 is the next after 3-4-5 in the family of whole-number right triangles.',
    data: {
      answer: { num: 12, unit: 'm' }, glyph: '🪜',
      traps: [{ match: 8, msg: 'Lengths do not subtract like that in a right triangle: it is the *squares* that add up.' }],
      figure: (function () {
        const S = scene(440, 320, [-3.6, -1.6, 8.2, 13.6]);
        const F = [5, 0], T = [0, 12];
        chk('geo-ladder-wall', dist(F, T), 13);
        S.poly([[-3.5, -1], [8, -1], [8, 0], [-3.5, 0]], { fill: '#d9c9a0', sw: 1.5 });
        S.poly([[-3.5, 0], [0, 0], [0, 13], [-3.5, 13]], { fill: '#cbb897', sw: 1.5 });
        S.line(F, T, { stroke: RED, sw: 4.5 });
        S.right([0, 0], [0, 6], [3, 0], 13);
        S.dim(F, T, '13 m', -22, { size: 17 });
        S.span([0, -1], [5, -1], '5 m', -20, {});
        S.text([-1.75, 6], 'h = ?', { size: 18, fill: RED, bold: true, halo: false });
        return S.out();
      })()
    },
    concepts: ['pythagoras'], links: ['geo-ladder-over-box', 'geo-crossed-ladders']
  });

  puzzle({
    id: 'geo-pyramid-shadow', title: 'The Pyramid and the Stick', diff: 2,
    source: 'Told of Thales of Miletus, who is said to have measured the Great Pyramid from its shadow around 600 BC.',
    text: 'A great pyramid has a square base **200 m** wide. Its shadow points straight away from one side, and the tip of the shadow lies **60 m** beyond the edge of the base.\n\nAt the same moment a vertical stick **1.5 m** tall casts a shadow **2 m** long.\n\nHow tall is the pyramid?',
    hints: ['Sun rays are parallel, so the pyramid and the stick make similar triangles: the same steepness of the sun.', 'The shadow of the top of the pyramid is measured from the point under it, in the middle of the base: half of 200 m plus 60 m.'],
    explain: 'The shadow of the top is cast from a point above the **centre** of the base, so its length is 100 + 60 = 160 m. The sun makes the same angle for the stick and the pyramid, so height ÷ shadow is the same: 1.5 ÷ 2 = 0.75. The pyramid is 160 × 0.75 = **120 m** tall. The trap is to forget the half base and use 60 m only, or 200 + 60.',
    data: {
      answer: { num: 120, unit: 'm' }, glyph: '🔺',
      traps: [{ match: 45, msg: 'That uses only the 60 m beyond the base. The shadow of the top starts under the top: in the middle of the pyramid.' }, { match: 195, msg: 'The shadow is measured from the point under the top of the pyramid, the centre of the base, not from the far edge.' }],
      figure: (function () {
        const S = scene(520, 260, [-30, -14, 310, 130], 14);
        // pyramid (left) and, at another scale, the stick (right)
        const hy = 120, pyr = [[0, 0], [200, 0], [100, hy]];
        S.poly([[-20, -12], [300, -12], [300, 0], [-20, 0]], { fill: '#e3d6ad', sw: 1.5 });
        S.poly(pyr, { fill: SY });
        S.line([100, 0], [100, hy], { dash: '5 4', sw: 1.4 });
        S.line([100, hy], [260, 0], { stroke: RED, sw: 2.2, dash: '7 5' });
        S.line([200, 0], [260, 0], { stroke: RED, sw: 5 });
        S.dot([100, 0], { r: 2.8 }); S.dot([260, 0], { r: 3.2, fill: RED });
        S.span([0, 0], [200, 0], '200 m', -22, {});
        S.span([200, 0], [260, 0], '60 m', -22, { fill: RED });
        S.text([100, 70], 'height?', { dx: -44, size: 16, fill: RED, bold: true, it: true });
        return S.out();
      })()
    },
    concepts: ['similarity'], links: ['geo-river-width', 'aar-thales-pyramid']
  });

  puzzle({
    id: 'geo-river-width', title: 'The Width of the River', diff: 2,
    text: 'You stand at A on one bank of a river, opposite a rock R on the far bank. You walk **40 m** along the bank to B and plant a stick, then **15 m** more to C. From C you walk away from the river at right angles until the stick at B and the rock R are in one line: this happens at D, **12 m** from C.\n\nHow wide is the river?',
    hints: ['Look for two similar triangles that share the sighting line through D, B and R.', 'Triangle ABR is similar to triangle CBD: AB corresponds to CB (which is 15 m, not 40 m).'],
    explain: 'The triangles ABR and CBD are similar (they have a right angle each, and equal angles where the lines cross at B). Their sides are in the ratio AB : CB = 40 : 15, so AR : CD = 40 : 15 as well. With CD = 12 m: AR = 12 × 40 ÷ 15 = **32 m**. Surveyors have measured rivers and gorges this way for thousands of years.',
    data: {
      answer: { num: 32, unit: 'm' }, glyph: '≈',
      traps: [{ match: 55, msg: 'That is the whole walk along the bank, AC. The river is across, not along.' }, { match: 4.5, msg: 'You divided by the wrong ratio: the far triangle is *bigger* (40 against 15), not smaller.' }],
      figure: (function () {
        const S = scene(520, 300, [-6, -20, 62, 40], 18);
        const A = [0, 0], B = [40, 0], C = [55, 0], R = [0, 32], D = [55, -12];
        // R, B and D are in one line, and the triangles ABR and CBD are similar
        chk('geo-river-width', (R[1] - B[1]) / (R[0] - B[0]), (B[1] - D[1]) / (B[0] - D[0]), 1e-9);
        S.poly([[-6, 0], [62, 0], [62, 32], [-6, 32]], { fill: SB, stroke: null, op: 0.7 });
        S.text([28, 20], 'river', { size: 17, it: true, fill: BLUE, halo: false });
        S.line([-6, 0], [62, 0], { sw: 2 }); S.line([-6, 32], [62, 32], { sw: 2 });
        S.line(R, D, { stroke: RED, sw: 2, dash: '7 5' });
        S.line(C, D, { sw: 2.4 });
        S.right(C, A, D, 10);
        S.right(A, C, R, 10);
        S.span(A, B, '40 m', 20, {}); S.span(B, C, '15 m', 20, {}); S.text(mid(C, D), '12 m', { dx: 26, size: 15 });
        [A, B, C, R, D].forEach((p) => S.dot(p, { r: 3.4 }));
        S.name(A, 'A', -13, -12); S.name(B, 'B', 0, -15); S.name(C, 'C', 13, -12); S.name(R, 'R', -13, -4); S.name(D, 'D', 14, 8);
        S.text([0, 16], 'width?', { dx: 30, size: 16, fill: RED, bold: true, it: true });
        return S.out();
      })()
    },
    concepts: ['similarity'], links: ['geo-pyramid-shadow', 'geo-crossed-poles']
  });

  puzzle({
    id: 'geo-hypotenuse-squares', title: 'Squares on the Sides', diff: 1,
    text: 'A right triangle has a square drawn on each of its three sides, as in the picture. The squares on the two shorter sides have areas **36** and **64**.\n\nHow long is the longest side of the triangle?',
    hints: ['The area of a square on a side is that side times itself.', 'Pythagoras says the two smaller squares together are exactly as big as the largest one.'],
    explain: 'The big square has the area of the two others together: 36 + 64 = 100. Its side, the longest side of the triangle, is √100 = **10**. The triangle has sides 6, 8 and 10: the 3-4-5 triangle doubled.',
    data: {
      answer: { num: 10 }, glyph: 'c²',
      traps: [{ match: 100, msg: '100 is the *area* of the square on the longest side. How long is its side?' }, { match: 14, msg: 'You added the two shorter sides (6 + 8). Add the *areas* instead, then take a square root.' }],
      figure: (function () {
        const S = scene(440, 400, [-6.6, -8.6, 14.6, 14.6], 10);
        const C = [0, 0], B = [8, 0], A = [0, 6], n = [0.6, 0.8], B2 = add(B, mul(n, 10)), A2 = add(A, mul(n, 10));
        chk('geo-hypotenuse-squares', dist(A, B), 10);
        S.poly([C, B, [8, -8], [0, -8]], { fill: SG });
        S.poly([C, A, [-6, 6], [-6, 0]], { fill: SB });
        S.poly([A, B, B2, A2], { fill: SR });
        S.poly([A, B, C], { fill: SY });
        S.right(C, A, B, 12);
        S.text([4, -4], '64', { size: 26, bold: true, fill: GREEN }); S.text([-3, 3], '36', { size: 26, bold: true, fill: BLUE });
        S.text(mid(A, B2), '?', { size: 34, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'area'], links: ['geo-ladder-wall', 'geo-heron-13-14-15']
  });

  puzzle({
    id: 'geo-heron-13-14-15', title: 'A Triangle of 13, 14 and 15', diff: 2,
    text: 'The sides of a triangle are **13**, **14** and **15** cm long.\n\nWhat is its **area**?',
    hints: ['Take the side of 14 as the base and let a height h fall on it from the opposite corner. It cuts the base into x and 14 − x.', 'Two right triangles share the height: x² + h² = 13² and (14 − x)² + h² = 15². Subtract one equation from the other.'],
    explain: 'With the 14 as the base, the height h splits it into x and 14 − x. Then x² + h² = 169 and (14 − x)² + h² = 225. Subtracting gives 196 − 28x = 56, so x = 5 and h² = 169 − 25 = 144, h = 12. The area is ½ × 14 × 12 = **84 cm²**. (Heron’s formula agrees: with s = 21, √(21 × 8 × 7 × 6) = 84.) It is the smallest triangle with consecutive whole sides and whole area, apart from 3, 4, 5.',
    data: {
      answer: { num: 84, unit: 'cm²' }, glyph: '△',
      traps: [{ match: 91, msg: '91 = ½ × 13 × 14, but 13 is a slanted side, not the height.' }, { match: 105, msg: '105 = ½ × 14 × 15: again 15 is a slanted side, not the height.' }],
      figure: (function () {
        const S = scene(480, 290, [-1, -1, 15, 13.8], 22);
        const B = [0, 0], C = [14, 0], A = [5, 12], H = [5, 0];
        chk('geo-heron-13-14-15', dist(A, B), 13); chk('geo-heron-13-14-15', dist(A, C), 15);
        S.poly([A, B, C], { fill: SY });
        S.line(A, H, { dash: '5 4', sw: 1.6 }); S.right(H, A, C, 10);
        S.dim(A, B, '13', 16, { size: 16 }); S.dim(C, A, '15', 16, { size: 16 }); S.text(mid(B, C), '14', { dy: 20, size: 16 });
        S.names([A, B, C], ['A', 'B', 'C'], [7, 4], 16);
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'area'], links: ['geo-hypotenuse-squares']
  });

  puzzle({
    id: 'geo-triangle-inequality', title: 'The Third Stick', diff: 2,
    text: 'You have a stick 10 cm long and a stick 7 cm long. A third stick is cut to a **whole number** of centimetres, and the three sticks are laid down to form a triangle (a flat, squashed triangle does not count).\n\nHow many different lengths can the third stick have?',
    hints: ['Swing the 7 cm stick round the end of the 10 cm one: how near and how far can its free end get from the other end?', 'The third stick must be shorter than 7 + 10 and longer than 10 − 7. Both extremes are flat triangles, and flat ones are not allowed.'],
    explain: 'Any side of a triangle must be shorter than the other two together, so the third stick is under 7 + 10 = 17 cm. It must also be longer than the difference, 10 − 7 = 3 cm (otherwise the shorter sticks cannot reach). The whole lengths **4, 5, 6, … 16** work: that is **13** lengths. At 3 and 17 the triangle is squashed flat.',
    data: {
      answer: { num: 13 }, glyph: '3',
      traps: [{ match: 15, msg: 'You counted 3 to 17. At exactly 3 or 17 the three sticks lie flat in a line, and that is no triangle.' }, { match: 14, msg: 'Count again: the lengths run from just over 3 to just under 17.' }],
      figure: (function () {
        const S = scene(500, 250, [-1, -1, 18.5, 8], 20);
        const A = [0, 0], B = [10, 0];
        S.arc(B, 7, 0, 180, { dash: '6 5', stroke: GREY, sw: 1.8 });
        [42, 78, 118, 150].forEach((deg) => { const P = polar(B, 7, deg); S.line(A, P, { stroke: GREY, sw: 1.2, dash: '3 4' }); S.line(B, P, { stroke: BLUE, sw: 2 }); S.dot(P, { r: 3, fill: BLUE }); });
        S.line(A, B, { sw: 4 }); S.dot(A); S.dot(B);
        S.text(mid(A, B), '10 cm', { dy: 20, size: 16 });
        S.dim(B, polar(B, 7, 78), '7 cm', 15, { fill: BLUE, size: 15 });
        S.text([3, 0], '3', { dy: -14, size: 14, fill: GREY, halo: false }); S.text([17, 0], '17', { dy: -14, size: 14, fill: GREY, halo: false });
        return S.out();
      })()
    },
    concepts: ['construction'], links: ['geo-heron-13-14-15']
  });

  puzzle({
    id: 'geo-box-diagonal', title: 'The Longest Rod in the Box', diff: 2,
    text: 'A closed wooden box is **12 cm** long, **4 cm** wide and **3 cm** high inside.\n\nHow long is the longest straight rod that fits in it?',
    hints: ['The longest rod runs from one bottom corner to the opposite top corner. First find the diagonal across the floor.', 'Then that diagonal and the height make another right triangle.'],
    explain: 'The floor diagonal is √(12² + 4²) = √160. The rod is the hypotenuse of a triangle whose legs are that diagonal and the height 3: √(160 + 9) = √169 = **13 cm**. In general the long diagonal of a box is √(a² + b² + c²), and here the numbers were chosen to give a whole answer.',
    data: {
      answer: { num: 13, unit: 'cm' }, glyph: '▭',
      traps: [{ match: 19, msg: 'That adds the three edges. A straight diagonal is much shorter than a path along the edges.' }, { match: 12.65, msg: 'That is the diagonal of the floor only, √160. The rod also rises 3 cm.' }],
      figure: (function () {
        const S = scene(480, 260, [-0.8, -1.2, 14.5, 5.3], 16);
        const w = 12, h = 3, d = 4, v = box3(S, w, h, d);
        S.line(v.a, v.g, { stroke: RED, sw: 3.4 });
        S.dot(v.a, { fill: RED }); S.dot(v.g, { fill: RED });
        S.text(mid(v.a, v.b), '12', { dy: 17, size: 16 }); S.text(mid(v.a, v.d), '3', { dx: -13, size: 16 }); S.text(mid(v.b, v.f), '4', { dx: 15, dy: 8, size: 16 });
        S.text(lerp(v.a, v.g, 0.32), '?', { dx: -14, dy: -7, size: 20, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'projection'], links: ['geo-ant-cube']
  });

  puzzle({
    id: 'geo-ladder-over-box', title: 'The Ladder Over the Box', diff: 3,
    text: 'A wooden box stands against a wall. It is **8 m** deep (from the wall) and **9 m** tall — a rather large box. A ladder rests on the ground, touches the top outer corner of the box, and leans on the wall. The foot of the ladder is **20 m** from the wall.\n\nHow long is the ladder?',
    hints: ['The ladder makes a big right triangle with the wall and the ground, and a small one above the box corner. They are similar (parallel lines: the box side and the wall).', 'The small triangle above the box has base 20 − 8 = 12 and height (something − 9). Compare it with the big triangle: base 20, height Y.'],
    explain: 'Let the ladder reach a height Y on the wall. Looking at the triangle between the foot and the box corner, and at the whole triangle, the slope is the same: 9 ÷ (20 − 8) = Y ÷ 20. So Y = 20 × 9 ÷ 12 = 15 m. The ladder is the hypotenuse of a right triangle with legs 20 and 15, and 20² + 15² = 625, so the ladder is **25 m** long. (3-4-5 again, multiplied by 5.)',
    data: {
      answer: { num: 25, unit: 'm' }, glyph: '⧉',
      traps: [{ match: 15, msg: '15 m is how high the ladder reaches up the wall (and, by coincidence, the distance from its foot to the corner of the box). The question asks for the length of the ladder itself.' }],
      figure: (function () {
        const S = scene(520, 330, [-2.6, -5.5, 23, 17.5], 16);
        const X = 20, Y = 15, corner = [8, 9], foot = [X, 0], top = [0, Y];
        chk('geo-ladder-over-box', (corner[1] - foot[1]) / (corner[0] - foot[0]), (top[1] - foot[1]) / (top[0] - foot[0]), 1e-9);
        S.poly([[-2.2, -1.5], [22, -1.5], [22, 0], [-2.2, 0]], { fill: '#d9c9a0', sw: 1.5 });
        S.poly([[-2.2, 0], [0, 0], [0, 17], [-2.2, 17]], { fill: '#cbb897', sw: 1.5 });
        S.poly([[0, 0], [8, 0], [8, 9], [0, 9]], { fill: '#e6d09a', sw: 2.2 });
        S.line(foot, top, { stroke: RED, sw: 4.2 });
        S.dot(corner, { r: 4 });
        S.span([0, -1.5], [8, -1.5], '8 m', -20, {}); S.span([0, -1.5], foot, '20 m from the wall', -46, {});
        S.text([4, 4.5], '9 m', { size: 17 });
        S.text([0, 12], '?', { dx: 20, size: 20, fill: RED, bold: true });
        return S.out();
      })()
    },
    concepts: ['similarity', 'pythagoras'], links: ['geo-ladder-wall', 'geo-crossed-ladders']
  });

  puzzle({
    id: 'geo-crossed-poles', title: 'Two Poles and Two Strings', diff: 3,
    text: 'Two vertical poles, **15 m** and **10 m** tall, stand on level ground some distance apart. A string is stretched from the top of each pole to the foot of the other. The strings cross at a point X.\n\nHow high above the ground is X?\n\nYou are not told how far apart the poles are. Does it matter?',
    hints: ['Call the distance between the poles d and look for two pairs of similar triangles: one pair with the ground, one pair with the crossing point.', 'The height h of X satisfies h ÷ 15 = (d − a) ÷ d and h ÷ 10 = a ÷ d, where a is the distance from the foot of the tall pole to the point under X. Add the two.'],
    explain: 'Let X be at height h, and let the point on the ground under X split the distance d into a (next to the tall pole) and d − a (next to the short one). The string from the top of the tall pole runs down to the foot of the short pole, and similar triangles give h ÷ 15 = (d − a) ÷ d. The other string gives h ÷ 10 = a ÷ d. Adding the two: h ÷ 15 + h ÷ 10 = 1, so h × (1/15 + 1/10) = 1 and h = 15 × 10 ÷ (15 + 10) = **6 m**. The distance d cancels out: the poles could be a metre or a mile apart, and the strings would still cross at 6 m.',
    data: {
      answer: { num: 6, unit: 'm' }, glyph: '✕',
      traps: [{ match: 12.5, msg: 'That is the average of the two heights. The strings cross much lower than that.' }, { match: 5, msg: 'That would be so if the poles were of equal height; here they are not, so the crossing lies at a height that depends on both.' }],
      figure: (function () {
        const S = scene(500, 300, [-2, -1.6, 17, 17.5], 14);
        const d = 14, A = [0, 0], B = [d, 0], TA = [0, 15], TB = [d, 10];
        const X = inter(TA, B, TB, A);
        chk('geo-crossed-poles', X[1], 6, 1e-9);
        S.poly([[-2, -1.2], [17, -1.2], [17, 0], [-2, 0]], { fill: '#d9c9a0', sw: 1.5 });
        S.line(A, TA, { sw: 5 }); S.line(B, TB, { sw: 5 });
        S.line(TA, B, { stroke: RED, sw: 2.2 }); S.line(TB, A, { stroke: BLUE, sw: 2.2 });
        S.line(X, [X[0], 0], { dash: '5 4', sw: 1.5 });
        S.dot(X, { r: 4 });
        S.text(A, '15 m', { dx: -6, dy: -100, size: 16, anchor: 'end' });
        S.text(B, '10 m', { dx: 10, dy: -70, size: 16, anchor: 'start' });
        S.text([X[0], 3], 'h = ?', { dx: 26, dy: 0, size: 17, fill: RED, bold: true });
        S.name(X, 'X', -14, -12);
        return S.out();
      })()
    },
    concepts: ['similarity'], links: ['geo-crossed-ladders', 'geo-river-width']
  });

  puzzle({
    id: 'geo-crossed-ladders', title: 'Two Ladders in an Alley', diff: 4,
    text: 'Two walls stand **20 ft** apart. A ladder **29 ft** long has its foot at the bottom of one wall and leans on the other. A second ladder, **25 ft** long, has its foot at the bottom of the other wall and leans against the first. The two ladders cross.\n\nHow high above the ground is the crossing point?',
    hints: ['First find how high each ladder reaches on its wall: the alley, the wall and the ladder make a right triangle.', 'With heights 21 and 15, use the crossed-strings idea: the crossing height is the product of the two heights divided by their sum.'],
    explain: 'The 29 ft ladder reaches √(29² − 20²) = √441 = 21 ft; the 25 ft ladder reaches √(25² − 20²) = √225 = 15 ft. Now use similar triangles as with two poles and two strings: the crossing height is 21 × 15 ÷ (21 + 15) = 315 ÷ 36 = **8.75 ft**. The distance between the walls does not matter for the crossing, only for finding how high the ladders reach.',
    data: {
      answer: { num: 8.75, unit: 'ft' }, glyph: '⚔',
      traps: [{ match: 18, msg: 'That is the average of the two heights, 21 and 15. The crossing is much lower than that.' }],
      figure: (function () {
        const S = scene(500, 320, [-3, -2, 24, 24], 14);
        const w = 20, h1 = 21, h2 = 15, A = [0, 0], B = [w, 0], T1 = [0, h1], T2 = [w, h2], X = inter(T1, B, T2, A);
        chk('geo-crossed-ladders', dist(T1, B), 29, 1e-9); chk('geo-crossed-ladders', dist(T2, A), 25, 1e-9); chk('geo-crossed-ladders', X[1], 8.75, 1e-9);
        S.poly([[-3, -1.6], [24, -1.6], [24, 0], [-3, 0]], { fill: '#d9c9a0', sw: 1.5 });
        S.poly([[-2, 0], [0, 0], [0, 23], [-2, 23]], { fill: '#cbb897', sw: 1.5 });
        S.poly([[w, 0], [w + 2, 0], [w + 2, 23], [w, 23]], { fill: '#cbb897', sw: 1.5 });
        S.line(B, T1, { stroke: RED, sw: 4 }); S.line(A, T2, { stroke: BLUE, sw: 4 });
        S.line(X, [X[0], 0], { dash: '5 4', sw: 1.5 }); S.dot(X, { r: 4 });
        S.text([13, 15], '29 ft', { size: 16, fill: RED, dx: 16, dy: -4 }); S.text([6, 11], '25 ft', { size: 16, fill: BLUE, dx: -26, dy: 0 });
        S.span(A, B, '20 ft', -22, {});
        S.text([X[0], 4], '?', { dx: 14, size: 20, fill: RED, bold: true });
        return S.out();
      })()
    },
    concepts: ['similarity', 'pythagoras'], links: ['geo-crossed-poles', 'geo-ladder-over-box']
  });

  puzzle({
    id: 'geo-spider-fly', title: 'The Spider and the Fly', diff: 4,
    source: 'Henry Dudeney’s famous puzzle of about 1903 (in The Canterbury Puzzles, 1907); the answer surprises almost everybody. Retold in our own words.',
    text: 'A room is **30 ft** long, **12 ft** wide and **12 ft** high. On one end wall, in the middle of the width and **1 ft** below the ceiling, sits a spider. On the opposite end wall, also in the middle and **1 ft** above the floor, sits a fly, too frightened to move.\n\nThe spider may only walk on the walls, the floor and the ceiling. How long is its **shortest** walk to the fly?',
    hints: ['The obvious walk is up to the ceiling, across, and down. Is it the shortest? (It is 1 + 30 + 11 = 42 ft.)', 'Unfold the room: cut along some edges and lay the walls flat like the net of a box. A straight line in the flat picture is a shortest path on the room. Try a route over the ceiling, a side wall and the floor.', 'In the flat picture the spider and the fly are 24 ft apart across and 32 ft apart along.'],
    explain: 'Unfold the ceiling, one side wall and the floor into one long strip, and hinge the two end walls on to its ends. In the flat picture the spider and the fly are 32 ft apart along the strip (1 ft down the end wall, 30 ft along, 1 ft up the far wall) and 24 ft apart across it (6 ft over the ceiling to the side wall, 12 ft down the side wall, 6 ft over the floor). Since 24² + 32² = 40², the straight line is **40 ft** long. It crosses five of the six faces, and beats the obvious walk of 42 ft over the ceiling alone.',
    data: {
      answer: { num: 40, unit: 'ft' }, glyph: '🕷',
      traps: [{ match: 42, msg: 'That is the walk over the ceiling and down the far wall. There is a shorter one that crosses more faces.' }, { match: 32, msg: '32 ft is only the length along the room in the flat picture; you also have to go across.' }],
      figure: (function () {
        const S = scene(540, 290, [-5.5, -2.5, 41.5, 16.5], 12);
        const w = 30, h = 12, d = 12, v = box3(S, w, h, d, { clear: true, left: SR });
        // the spider is on the left end wall (shaded), the fly on the right one
        const sp = OB(0, h - 1, d / 2), fy = OB(w, 1, d / 2);
        S.dot(fy, { r: 5, fill: GREEN }); S.text(fy, 'fly', { dx: 20, dy: 0, size: 15, it: true, fill: GREEN });
        S.dot(sp, { r: 5, fill: RED }); S.text(sp, 'spider', { dx: -3, dy: -14, size: 15, it: true, fill: RED });
        S.text(mid(v.a, v.b), '30 ft', { dy: 18, size: 15 }); S.text(mid(v.b, v.f), '12 ft', { dx: 26, dy: 10, size: 15 }); S.text(mid(v.a, v.d), '12 ft', { dx: -22, size: 15 });
        return S.out();
      })()
    },
    concepts: ['reflection-trick', 'pythagoras', 'projection'], links: ['geo-spider-flat', 'geo-ant-cube']
  });

  puzzle({
    id: 'geo-spider-flat', title: 'The Room Laid Flat', diff: 2,
    source: 'The unfolded room of Dudeney’s spider and fly puzzle.',
    text: 'The room of the spider and the fly (30 ft long, 12 ft wide, 12 ft high) has been cut along some of its edges and laid flat: the ceiling on top, one side wall in the middle, the floor below, and the two end walls hinged on at the sides. The spider S and the fly F are marked in this flat picture.\n\nWalking in a straight line across the flat picture, how long is the spider’s walk?',
    hints: ['Read the picture like a map: how far apart are S and F sideways, and how far up and down?', 'They form the two ends of the longest side of a right triangle: use Pythagoras.'],
    explain: 'S is 32 ft from F along the room (1 ft up the end wall, 30 ft along the strip, 1 ft along the far wall) and 24 ft across (the ceiling and the floor being 12 ft wide and the wall 12 ft high, S is 6 ft into the ceiling and F 6 ft into the floor: 6 + 12 + 6 = 24). So the walk is √(32² + 24²) = **40 ft**, a 3-4-5 triangle multiplied by 8. The straight line in the flat picture really is the shortest walk in the room.',
    data: {
      answer: { num: 40, unit: 'ft' }, glyph: '⊞',
      traps: [{ match: 56, msg: 'That is 32 + 24: the way round a corner. The straight line across the picture is shorter.' }],
      figure: (function () {
        const S = scene(540, 310, [-14, -13, 44, 25], 10);
        const Sp = [-1, 18], Fl = [31, -6];
        chk('geo-spider-flat', dist(Sp, Fl), 40, 1e-9);
        S.poly([[0, 12], [30, 12], [30, 24], [0, 24]], { fill: SN });
        S.poly([[0, 0], [30, 0], [30, 12], [0, 12]], { fill: SY });
        S.poly([[0, -12], [30, -12], [30, 0], [0, 0]], { fill: SN });
        S.poly([[-12, 12], [0, 12], [0, 24], [-12, 24]], { fill: '#e4d6a2' });
        S.poly([[30, -12], [42, -12], [42, 0], [30, 0]], { fill: '#e4d6a2' });
        S.text([15, 18], 'ceiling', { size: 14, it: true, fill: GREY, halo: false }); S.text([15, 6], 'side wall', { size: 14, it: true, fill: GREY, halo: false }); S.text([15, -6], 'floor', { size: 14, it: true, fill: GREY, halo: false });
        S.line(Sp, Fl, { stroke: RED, sw: 2.6, dash: '8 5' });
        S.dot(Sp, { r: 5, fill: RED }); S.dot(Fl, { r: 5, fill: GREEN });
        S.name(Sp, 'S', -13, -10, { fill: RED }); S.name(Fl, 'F', 13, 12, { fill: GREEN });
        S.span([-1, -12.6], [31, -12.6], '32 ft', 0, { lo: 0 });
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'reflection-trick'], links: ['geo-spider-fly']
  });

  puzzle({
    id: 'geo-ant-cube', title: 'The Ant on the Cube', diff: 3,
    text: 'An ant sits at one corner of a cube whose edges are **10 cm** long. It wants to reach the corner diagonally opposite, walking only on the surface of the cube.\n\nHow long is the shortest walk? Give it to the nearest hundredth of a centimetre.',
    hints: ['Straight through the cube is not allowed. Think of the shortest path as crossing exactly two faces.', 'Unfold two neighbouring faces into one rectangle 10 by 20. The shortest path is the diagonal of the rectangle.'],
    explain: 'Open the cube out so that two faces that share an edge lie side by side: a rectangle 10 cm by 20 cm. The ant’s corner and the opposite corner are opposite corners of that rectangle, and a straight line is the shortest way: √(10² + 20²) = √500 = 10√5 ≈ **22.36 cm**. Walking along three edges would need 30 cm, and the straight line through the inside, 10√3 ≈ 17.32 cm, is not allowed.',
    data: {
      answer: { num: 22.3607, tol: 0.006, unit: 'cm', show: '22.36' }, glyph: '⬛',
      traps: [{ match: 30, msg: 'That is the way along three edges. A path across the faces is shorter.' }, { match: 17.32, msg: 'That goes through the inside of the cube. The ant must stay on the surface.' }, { match: 28.28, msg: 'That is two face diagonals. Crossing just two faces along a straight line in the flat picture is shorter.' }],
      figure: (function () {
        const S = scene(440, 320, [-1.5, -2, 15.5, 14.5], 16);
        const s = 10, v = box3(S, s, s, s);
        S.dot(v.a, { r: 5, fill: RED }); S.dot(v.g, { r: 5, fill: GREEN });
        S.name(v.a, 'ant', -4, 18, { fill: RED, size: 16 }); S.name(v.g, 'goal', 4, -14, { fill: GREEN, size: 16 });
        S.text(mid(v.a, v.b), '10 cm', { dy: 18, size: 15 });
        return S.out();
      })()
    },
    concepts: ['reflection-trick', 'pythagoras', 'projection'], links: ['geo-spider-fly', 'geo-box-diagonal']
  });


  /* =====================  PATHS, MIRRORS AND FOLDS  ===================== */

  puzzle({
    id: 'geo-river-bridge', title: 'Where to Build the Bridge', diff: 4,
    text: 'A straight river, **2 km** wide, has village A on its north side, **7 km** from the north bank, and village B on its south side, **3 km** from the south bank. B lies **24 km** further east than A.\n\nA bridge will be built across the river at right angles to the banks, and a straight road will run from each village to the bridge. Where the bridge stands is up to you; you want the road from A over the bridge to B to be as **short** as possible.\n\nHow long is that shortest route, bridge included?',
    hints: ['Whatever the position of the bridge, its length is always 2 km. So only the two road pieces matter.', 'Slide the whole south side of the map 2 km north, so that the river is squeezed away. Then a straight line from A to the moved B is the shortest road.'],
    explain: 'The bridge always adds 2 km, wherever it stands. Slide B two kilometres north (as if the river were squeezed out). The two road pieces together are then as long as a path from A to the moved B, which is shortest when it is a straight line. Now A and the moved B are 7 + 3 = 10 km apart north to south and 24 km apart east to west, so the line is √(24² + 10²) = 26 km long. With the bridge, the route is 26 + 2 = **28 km**. The bridge belongs where that straight line meets the river.',
    data: {
      answer: { num: 28, unit: 'km' }, glyph: '🌉',
      traps: [{ match: 26, msg: 'That is the two roads together (in the best position). Do not forget the 2 km of the bridge itself.' }, { match: 26.83, msg: 'That would be a straight line across the river without a bridge, but you cannot walk on water.' }],
      figure: (function () {
        const S = scene(520, 270, [-3, -4.6, 27, 10.6], 14);
        const A = [0, 9], B = [24, -3];
        let best = 1e9;
        for (let x = 0; x <= 24; x += 0.001) best = Math.min(best, Math.hypot(x, 7) + 2 + Math.hypot(24 - x, 3));
        chk('geo-river-bridge', best, 28, 1e-3);
        S.poly([[-3, 0], [27, 0], [27, 2], [-3, 2]], { fill: SB, stroke: null });
        S.line([-3, 0], [27, 0], { sw: 2 }); S.line([-3, 2], [27, 2], { sw: 2 });
        S.text([12, 1], 'river, 2 km wide', { size: 15, it: true, fill: BLUE, halo: false });
        S.dot(A, { r: 5 }); S.dot(B, { r: 5 });
        S.name(A, 'A', 0, -16); S.name(B, 'B', 0, 18);
        S.span([-1.5, 2], [-1.5, 9], '7 km', -16, {}); S.span([25.5, 0], [25.5, -3], '3 km', 16, {});
        S.span([0, -3.8], [24, -3.8], '24 km', -14, {});
        return S.out();
      })()
    },
    concepts: ['reflection-trick', 'pythagoras'], links: ['geo-mirror-wall']
  });

  puzzle({
    id: 'geo-mirror-wall', title: 'Touch the Wall on the Way', diff: 3,
    text: 'You stand at A, **2 m** from a long straight wall. You must walk to the wall, touch it, and then go on to B, which is **4 m** from the wall and **8 m** further along it than A.\n\nWhat is the length of the shortest such walk?',
    hints: ['Walking 2 + 8 + 4 is not shortest, and neither is any route with a right-angle turn at the wall. Where would the shortest path touch the wall?', 'Reflect B in the wall to a point B′ on the other side. A path from A to the wall to B has the same length as one from A to the wall to B′.'],
    explain: 'When a path touches the wall at P, the piece PB has the same length as PB′, where B′ is the mirror image of B in the wall. So the length of the walk is the same as the length of a path from A to B′ that crosses the wall — shortest when it is a straight line. B′ is 2 + 4 = 6 m across the wall from A and 8 m along it: √(6² + 8²) = **10 m**. This is the same rule as the law of reflection of light and of a billiard ball off a cushion.',
    data: {
      answer: { num: 10, unit: 'm' }, glyph: '⟂',
      traps: [{ match: 14, msg: 'That is 2 + 8 + 4, going straight to the wall, along, then out again. A slanting route is shorter.' }, { match: 8.25, msg: 'That is the straight line from A to B, which does not touch the wall: √(8² + 2²).' }],
      figure: (function () {
        const S = scene(500, 280, [-2, -1.5, 10.5, 5.2], 14);
        const A = [0, 2], B = [8, 4], Bm = [8, -4];
        chk('geo-mirror-wall', dist(A, Bm), 10, 1e-9);
        S.poly([[-2, 0], [10.5, 0], [10.5, -1.2], [-2, -1.2]], { fill: '#d9c9a0', sw: 1.5 });
        S.text([5, -0.6], 'wall', { size: 15, it: true, halo: false });
        S.dot(A, { r: 5 }); S.dot(B, { r: 5 });
        S.name(A, 'A', -15, -4); S.name(B, 'B', 15, -4);
        S.span([-0.9, 0], [-0.9, 2], '2 m', -16, {}); S.span([9.5, 0], [9.5, 4], '4 m', 16, {}); S.span([0, 4.8], [8, 4.8], '8 m', -14, {});
        return S.out();
      })()
    },
    concepts: ['reflection-trick'], links: ['geo-river-bridge', 'geo-billiard-corner']
  });

  puzzle({
    id: 'geo-billiard-corner', title: 'The Ball That Finds a Pocket', diff: 3,
    text: 'A billiard table is 5 units long and 3 units wide, and has a pocket in every corner. A ball is struck from the bottom-left corner at exactly **45°** to the sides. It bounces off the cushions like light off a mirror (angle in = angle out).\n\nHow many times does it hit a cushion before it drops into a pocket?',
    hints: ['Do not follow the ball: unfold the table. Every time the ball hits a cushion, mirror the table and let the ball go straight on.', 'The straight line at 45° runs through the corners of the mirrored tables. Which is the first point where it passes through a corner of a table? (It has to be a multiple of 5 across and of 3 up.)'],
    explain: 'Unfold the table: instead of bouncing, the ball goes straight through a floor tiled with copies of the table. A straight line at 45° is the diagonal y = x. It first reaches a corner of a copy when x = y is a multiple of both 5 and 3: at 15. On the way it crosses the vertical cushion lines x = 5 and x = 10 (2 bounces) and the horizontal lines y = 3, 6, 9, 12 (4 bounces): **6 bounces** in all. Since 15 = 3 × 5 and 15 = 5 × 3 are both odd multiples, the ball ends in the top-right pocket.',
    data: {
      answer: { num: 6 }, glyph: '🎱',
      traps: [{ match: 5, msg: 'Nearly: count both the bounces off the long sides and off the short ends.' }, { match: 8, msg: 'You counted the pocket lines too: the corner itself is not a bounce.' }],
      figure: (function () {
        const S = scene(520, 300, [-0.8, -0.8, 5.8, 3.8], 18);
        const fold = (u, L) => { const m = ((u % (2 * L)) + 2 * L) % (2 * L); return m > L ? 2 * L - m : m; };
        const ts = [0, 3, 5, 6, 9, 10, 12, 15], pts = ts.map((t) => [fold(t, 5), fold(t, 3)]);
        chk('geo-billiard-corner', pts[7][0], 5); chk('geo-billiard-corner', pts[7][1], 3); chk('geo-billiard-corner', ts.length - 2, 6);
        S.poly([[0, 0], [5, 0], [5, 3], [0, 3]], { fill: '#cfe2c2', sw: 3 });
        S.pl(pts, { stroke: RED, sw: 2.6 });
        [[0, 0], [5, 0], [5, 3], [0, 3]].forEach((c) => S.circ(c, 0.16, { fill: INK, stroke: null }));
        S.dot(pts[0], { r: 5, fill: '#fff', stroke: INK });
        S.text([0.55, 0.32], '45°', { size: 14, fill: RED, bold: true });
        S.text([2.5, -0.55], '5', { size: 16 }); S.text([-0.5, 1.5], '3', { size: 16 });
        return S.out();
      })()
    },
    concepts: ['reflection-trick', 'symmetry'], links: ['geo-mirror-wall']
  });

  puzzle({
    id: 'geo-steiner-roads', title: 'Roads for Three Villages', diff: 4,
    text: 'Three villages stand at the corners of an **equilateral triangle** with sides of **10 km**. A road network must connect all three: from any village you can drive to any other, and roads may meet at junctions anywhere, not only in the villages.\n\nHow long is the **shortest** road network? Answer to two decimals.',
    hints: ['Two sides of the triangle give a network of 20 km. Can a junction in the middle do better?', 'At the best junction the three roads meet at equal angles of 120° (soap films do the same). By symmetry that point is the centre of the triangle.'],
    explain: 'Building two of the sides costs 20 km. A better network has a junction J in the middle, where the three roads meet at 120° to each other; by symmetry J is the centre of the triangle, at a distance 10 ÷ √3 ≈ 5.774 km from each village. Three roads of that length make 10 × √3 ≈ **17.32 km**. That is the network Jakob Steiner studied (and that a soap film makes between three pins). If one angle of the triangle were 120° or more, the junction would sit on that corner instead.',
    data: {
      answer: { num: 17.3205, tol: 0.005, unit: 'km', show: '17.32' }, glyph: 'Y',
      traps: [{ match: 20, msg: 'That is two sides of the triangle. A junction in the middle makes the network shorter.' }, { match: 15, msg: 'Close in spirit, but the roads from the centre are each 5.77 km, not 5. Work out the distance from the centre to a corner.' }],
      figure: (function () {
        const S = scene(440, 330, [-2, -2, 12, 10.5], 14);
        const A = [0, 0], B = [10, 0], C = [5, 5 * Math.sqrt(3)], J = [5, 5 / Math.sqrt(3)];
        chk('geo-steiner-roads', dist(A, J) + dist(B, J) + dist(C, J), 10 * Math.sqrt(3), 1e-9);
        S.poly([A, B, C], { fill: SN, stroke: GREY, sw: 1.6, dash: '6 5' });
        [A, B, C].forEach((p) => S.dot(p, { r: 6 }));
        S.names([A, B, C], ['A', 'B', 'C'], [5, 3], 18);
        S.text(mid(A, B), '10 km', { dy: 20, size: 15 });
        return S.out();
      })()
    },
    concepts: ['optimisation', 'symmetry'], links: ['geo-fence-wall']
  });

  puzzle({
    id: 'geo-fence-wall', title: 'Fencing Against a Wall', diff: 2,
    text: 'A farmer has **40 m** of fence and wants to enclose a rectangular pen. One side of the pen will be a long existing wall, so fence is needed on only three sides.\n\nWhat is the largest area, in square metres, that she can enclose?',
    hints: ['Call the two sides that stick out from the wall x. What is the length of the side parallel to the wall?', 'The area is x × (40 − 2x). A shape like this is biggest half-way between its two zeros, x = 0 and x = 20.'],
    explain: 'With two sides of length x sticking out from the wall, the side along the wall is 40 − 2x, so the area is x(40 − 2x) = 2x(20 − x). This is zero at x = 0 and at x = 20, and biggest half-way between, at x = 10. The pen is then 10 m by 20 m: **200 m²**. Notice that the best pen has its long side against the wall, twice as long as each short side. With four fenced sides the best pen would be the 10 m by 10 m square with only 100 m².',
    data: {
      answer: { num: 200, unit: 'm²' }, glyph: '▭',
      traps: [{ match: 100, msg: 'That is the best pen with fence on all four sides (a 10 by 10 square). Here the wall does one side for free.' }],
      figure: (function () {
        const S = scene(460, 250, [-1, -2.6, 13, 6.2], 16);
        chk('geo-fence-wall', 10 * (40 - 20), 200);
        S.poly([[-1, 4.2], [13, 4.2], [13, 5.4], [-1, 5.4]], { fill: '#cbb897', sw: 1.5 });
        S.text([6, 4.8], 'wall', { size: 14, it: true, halo: false });
        S.pl([[1, 4.2], [1, 0], [11, 0], [11, 4.2]], { stroke: RED, sw: 3.2 });
        S.text([1, 2], 'x', { dx: -13, size: 18, it: true }); S.text([11, 2], 'x', { dx: 13, size: 18, it: true });
        S.text([6, 0], '40 − 2x', { dy: 18, size: 16, it: true });
        S.text([6, 2.1], 'area = ?', { size: 17, fill: RED, bold: true });
        return S.out();
      })()
    },
    concepts: ['optimisation', 'area'], links: ['geo-steiner-roads']
  });

  puzzle({
    id: 'geo-belt-pipes', title: 'A Band Round Three Pipes', diff: 3,
    text: 'Three round pipes, each **10 cm** across, lie side by side, every pipe touching the other two. A thin band is stretched tight round all three.\n\nHow long is the band? Give it to two decimal places.',
    hints: ['The band has three straight parts and three curved parts. How long is a straight part, seen from the centres of the two pipes it runs between?', 'Each curved part is the arc of a pipe between two straight parts. The three arcs together make exactly one full circle.'],
    explain: 'The band touches each pipe along an arc and runs straight between neighbouring pipes. A straight part is as long as the distance between the centres of two pipes, which is one diameter: 10 cm, so the three straight parts make 30 cm. At each pipe the band turns through 120° (the exterior angle of the triangle of centres), so the three arcs together are 3 × 120° = 360°, which is one whole circumference, π × 10 ≈ 31.42 cm. In all: 30 + 10π ≈ **61.42 cm**.',
    data: {
      answer: { num: 61.4159, tol: 0.005, unit: 'cm', show: '61.42' }, glyph: '⌒',
      traps: [{ match: 30, msg: 'That is only the three straight parts. The band also bends round the pipes.' }, { match: 51.42, msg: 'That would be 20 + 10π: there are three straight parts of 10 cm, not two.' }],
      figure: (function () {
        const S = scene(440, 330, [-6.5, -6.2, 16.5, 14.8], 14);
        const r = 5, C = [[0, 0], [10, 0], [5, 5 * Math.sqrt(3)]];
        chk('geo-belt-pipes', 30 + 3 * (120 / 360) * 2 * Math.PI * r, 30 + 10 * Math.PI, 1e-9);
        C.forEach((c) => S.circ(c, r, { fill: '#e2e9ef', stroke: BLUE, sw: 2 }));
        // belt: arcs of 120 degrees on the outside, straight bits between
        const dirs = [-90, 30, 150];   // outward directions at the tangent points (start of each arc)
        let d = '';
        const outer = (i, deg) => polar(C[i], r, deg);
        // going anticlockwise: bottom straight (y = -5) from circle 0 to circle 1, then arc on circle 1 from -90 to 30, etc.
        d += S.M(outer(0, -90)) + S.L(outer(1, -90)) + S.A(r, outer(1, 30), 0, true) + S.L(outer(2, 30)) + S.A(r, outer(2, 150), 0, true) + S.L(outer(0, 150)) + S.A(r, outer(0, 270), 0, true) + 'Z';
        S.path(d, { stroke: RED, sw: 3.6 });
        C.forEach((c) => S.dot(c, { r: 2.6 }));
        S.text(mid(C[0], C[1]), '10 cm', { dy: 0, size: 14 });
        return S.out();
      })()
    },
    concepts: ['tangent-circles'], links: ['geo-coin-around']
  });

  puzzle({
    id: 'geo-coin-around', title: 'Two Coins, Two Turns', diff: 3,
    text: 'Two identical coins lie flat on a table. One is held still, and the other rolls once around the outside of it without slipping, until it is back where it started. (The picture shows the rolling coin at four moments, with a mark on its rim.)\n\nHow many times does the rolling coin turn round its own centre?',
    hints: ['Try it with two coins from your pocket: look at the mark on the rolling coin as it goes over the top.', 'The centre of the rolling coin travels round a circle whose radius is twice the coin’s radius. How does that distance compare with the coin’s own circumference?'],
    explain: 'The rolling coin’s centre goes round a circle of radius 2r, a path of length 4πr, which is twice the coin’s circumference 2πr. A rolling coin turns once for every circumference travelled by its centre, so it makes **2 turns**, not the 1 that you get by comparing the two rims. One turn comes from the rim rolling along the other rim, and one more from the coin circling the fixed one.',
    data: {
      answer: { num: 2 }, glyph: '◎◎',
      traps: [{ match: 1, msg: 'That is the famous first guess: the two rims are equal, so one turn. But the centre of the rolling coin walks twice as far as one rim.' }, { match: 4, msg: 'That is too many: the centre travels 4πr, which is two circumferences, not four.' }],
      figure: (function () {
        const S = scene(440, 360, [-3.6, -3.6, 3.6, 3.6], 12);
        const R = 1, r = 1, O = [0, 0];
        S.circ(O, R, { fill: '#e3e0d4', sw: 2.4 });
        S.text(O, 'fixed', { size: 15, it: true, halo: false });
        S.circ(O, R + r, { stroke: GREY, sw: 1.4, dash: '5 5' });
        [0, 90, 180, 270].forEach((th) => {
          const c = polar(O, R + r, th), phi = 180 + th * (1 + R / r), mk = polar(c, r, phi);
          S.circ(c, r, { fill: 'rgba(58,110,165,0.13)', stroke: BLUE, sw: 2 });
          S.line(c, mk, { stroke: RED, sw: 2 }); S.dot(mk, { r: 4.4, fill: RED });
        });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'symmetry'], links: ['geo-coin-big', 'geo-coin-inside', 'geo-belt-pipes']
  });

  puzzle({
    id: 'geo-coin-big', title: 'A Small Coin Round a Big One', diff: 4,
    text: 'A small coin of radius **1 cm** rolls, without slipping, once round the outside of a fixed coin of radius **3 cm**.\n\nHow many times does the small coin turn round its own centre?',
    hints: ['Compare the rims first: the fixed coin’s rim is 3 times as long as the small coin’s. That gives some turns.', 'The centre of the small coin goes round a circle of radius 3 + 1 = 4 cm. A rolling coin turns once for each circumference travelled by its centre.'],
    explain: 'The centre of the small coin travels along a circle of radius 3 + 1 = 4 cm, a distance 2π × 4 = 8π. The small coin has circumference 2π, so it makes 8π ÷ 2π = **4 turns**. In general a coin of radius r rolling round a fixed coin of radius R makes 1 + R ÷ r turns: the R ÷ r = 3 turns that the rims suggest, plus one more for going round.',
    data: {
      answer: { num: 4 }, glyph: '4',
      traps: [{ match: 3, msg: 'That counts the rims only: 3 cm of rim to 1 cm of rim. Going round adds one more turn.' }],
      figure: (function () {
        const S = scene(440, 360, [-4.8, -4.8, 4.8, 4.8], 12);
        const R = 3, r = 1, O = [0, 0];
        S.circ(O, R, { fill: '#e3e0d4', sw: 2.4 });
        S.text(O, '3 cm', { size: 16, halo: false });
        S.circ(O, R + r, { stroke: GREY, sw: 1.4, dash: '5 5' });
        [0, 45, 90, 135, 180, 225, 270, 315].forEach((th) => {
          const c = polar(O, R + r, th), phi = 180 + th * (1 + R / r), mk = polar(c, r, phi);
          S.circ(c, r, { fill: 'rgba(58,110,165,0.13)', stroke: BLUE, sw: 1.8 });
          S.line(c, mk, { stroke: RED, sw: 1.8 }); S.dot(mk, { r: 3.6, fill: RED });
        });
        return S.out();
      })()
    },
    concepts: ['tangent-circles'], links: ['geo-coin-around', 'geo-coin-inside']
  });

  puzzle({
    id: 'geo-coin-inside', title: 'A Coin Inside a Ring', diff: 4,
    text: 'A coin of radius **1 cm** rolls, without slipping, once round the **inside** of a fixed ring of radius **4 cm**. A mark on the coin’s rim draws the red curve in the picture (four cusps: an astroid).\n\nHow many times does the coin turn round its own centre during the trip?',
    hints: ['Compare with the outside case: now the centre of the coin travels on a circle of radius 4 − 1 = 3 cm.', 'The rim of the ring is 4 times as long as the coin’s, but the coin turns once fewer than that.'],
    explain: 'The coin’s centre travels along a circle of radius 4 − 1 = 3 cm, a distance 6π; the coin’s circumference is 2π, so it turns 6π ÷ 2π = **3 times**. (The rims alone suggest 4; rolling on the inside costs one turn, just as rolling on the outside gains one.) The mark returns to the ring exactly four times, at the four cusps.',
    data: {
      answer: { num: 3 }, glyph: '✧',
      traps: [{ match: 4, msg: 'That is the ratio of the rims. Inside a ring the coin turns one time fewer.' }],
      figure: (function () {
        const S = scene(440, 360, [-4.6, -4.6, 4.6, 4.6], 12);
        const R = 4, r = 1, O = [0, 0], N = 400;
        const pts = Array.from({ length: N + 1 }, (_, i) => { const th = (i / N) * 360, c = polar(O, R - r, th), phi = -th * (R - r) / r; return polar(c, r, phi); });
        chk('geo-coin-inside', pts[N][0], 4, 1e-6);
        S.circ(O, R, { fill: '#f1ece0', stroke: INK, sw: 3 });
        S.pl(pts, { stroke: RED, sw: 2.4 });
        [0, 40].forEach((th) => { const c = polar(O, R - r, th); S.circ(c, r, { fill: 'rgba(58,110,165,0.16)', stroke: BLUE, sw: 2 }); });
        const th0 = 40, c0 = polar(O, R - r, th0);
        S.dot(polar(c0, r, -th0 * 3), { r: 4.4, fill: RED });
        S.circ(O, 3, { stroke: GREY, sw: 1.2, dash: '4 5' });
        return S.out();
      })()
    },
    concepts: ['tangent-circles'], links: ['geo-coin-around', 'geo-coin-big', 'geo-tusi-couple']
  });

  puzzle({
    id: 'geo-tusi-couple', title: 'The Straight Line from Circles', diff: 4,
    source: 'The “Tusi couple”, described by the Persian astronomer Nasir al-Din al-Tusi in the 13th century.',
    text: 'A coin rolls without slipping round the inside of a ring exactly **twice as wide** as the coin. A tiny spot is painted on the coin’s rim, and it touches the ring at the start.\n\nWhat path does the spot follow as the coin rolls round?',
    hints: ['Try the astroid case of [[geo-coin-inside|the coin inside the ring]]: ring 4, coin 1. What changes if the ring is only twice as wide as the coin?', 'Write the position of the spot as the sum of two turning arrows: one of length r for the coin’s centre, one of length r for the spot, turning the opposite way at the same speed.'],
    explain: 'Let the ring have radius 2 and the coin radius 1. When the coin’s centre has gone through the angle θ, the centre is at (cos θ, sin θ), and the coin has turned through −θ, which puts the spot at (cos θ + cos θ, sin θ − sin θ) = (2 cos θ, 0). So the spot slides back and forth along a **straight line, a diameter of the ring**, although every part of the machine is turning. This was used by Islamic astronomers to make straight-line motion from circles.',
    data: {
      answer: { choice: 1, choices: ['a smaller circle inside the ring', 'a straight line: a diameter of the ring', 'an ellipse', 'a curve with three cusps'] },
      traps: [{ match: 2, msg: 'An ellipse needs two different sizes of motion. Try the sum of the two turning arrows: one of them undoes the other in the up-and-down direction.' }, { match: 3, msg: 'Three cusps come with a ring three times as wide as the coin. For a ring twice as wide the curve is much simpler.' }],
      glyph: '⟷',
      figure: (function () {
        const S = scene(440, 360, [-2.5, -2.5, 2.5, 2.5], 12);
        const R = 2, r = 1, O = [0, 0];
        S.circ(O, R, { fill: '#f1ece0', stroke: INK, sw: 3 });
        [30, 100, 200].forEach((th) => chk('geo-tusi-couple', polar(polar(O, R - r, th), r, -th)[1], 0, 1e-9));
        const c = polar(O, R - r, 0), mk = polar(c, r, 0);
        S.circ(c, r, { fill: 'rgba(58,110,165,0.13)', stroke: BLUE, sw: 2.4 });
        S.dot(c, { r: 3 }); S.dot(mk, { r: 5.4, fill: RED });
        S.text(mk, 'spot', { dx: -2, dy: -17, size: 16, it: true, fill: RED });
        S.text(O, 'ring', { size: 16, it: true, halo: false, fill: GREY });
        S.text(c, 'coin', { dx: -6, dy: 0, size: 15, it: true, halo: false, fill: BLUE });
        return S.out();
      })()
    },
    concepts: ['tangent-circles'], links: ['geo-coin-inside']
  });

  puzzle({
    id: 'geo-circle-three-points', title: 'A Circle Through Three Points', diff: 3,
    text: 'On squared paper, a circle passes through the three points A(−1, 5), B(6, 4) and C(−2, −2).\n\nWhat is the **radius** of the circle, in grid units?',
    hints: ['The centre is the same distance from A, B and C, so it lies on the perpendicular bisector of AB and also on that of AC. Where do those two lines cross?', 'The perpendicular bisector of AB is the line 7x − y = 13 and that of AC is x + 7y = 9. Solve them together, then measure the distance from the centre to A.'],
    explain: 'The perpendicular bisector of AB passes through the midpoint (2.5, 4.5) at right angles to AB, which has direction (7, −1): its equation is 7x − y = 13. The perpendicular bisector of AC passes through (−1.5, 1.5) at right angles to (−1, −7): x + 7y = 9. Solving: y = 7x − 13 gives x + 49x − 91 = 9, so x = 2 and y = 1. The centre is (2, 1), and its distance from A is √(3² + 4²) = **5**; B and C are at distance 5 too (√(4² + 3²) each).',
    data: {
      answer: { num: 5 }, glyph: '⌾',
      traps: [{ match: 7.07, msg: 'That is the distance between two of the points, not the radius.' }],
      figure: (function () {
        const S = scene(480, 400, [-5.6, -4.6, 8.6, 8.6], 10);
        const A = [-1, 5], B = [6, 4], C = [-2, -2], O = [2, 1];
        [A, B, C].forEach((p) => chk('geo-circle-three-points', dist(p, O), 5, 1e-9));
        S.grid(-5, -4, 8, 8, 1);
        S.line([-5.3, 0], [8.3, 0], { sw: 1.4, stroke: GREY }); S.line([0, -4.3], [0, 8.3], { sw: 1.4, stroke: GREY });
        [A, B, C].forEach((p) => S.dot(p, { r: 5, fill: RED }));
        S.text(A, 'A (−1, 5)', { dx: -8, dy: -14, size: 15 }); S.text(B, 'B (6, 4)', { dx: 6, dy: -14, size: 15 }); S.text(C, 'C (−2, −2)', { dx: 8, dy: 16, size: 15 });
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'construction'], links: ['geo-chord-distance', 'geo-broken-plate']
  });

  puzzle({
    id: 'geo-broken-plate', title: 'The Broken Plate', diff: 3,
    text: 'Only a piece of the rim of a broken round plate has been found. Its edge is a curved arc, and the chord that joins the two ends of the arc is **24 cm** long. At its highest, the arc rises **8 cm** above the middle of the chord.\n\nHow wide was the whole plate?',
    hints: ['Draw the radius that goes to the middle of the chord. It cuts the chord in half, at a right angle.', 'Let the radius be r. From the centre to the middle of the chord is r − 8. Then (r − 8)² + 12² = r².'],
    explain: 'The radius through the middle of the chord is perpendicular to it and cuts it in two halves of 12 cm. If the plate has radius r, the centre is r − 8 below the chord, and Pythagoras gives (r − 8)² + 12² = r². Expanding: r² − 16r + 64 + 144 = r², so 16r = 208 and r = 13. The plate was **26 cm** wide. (12, 5, 13 is a whole-number right triangle once more.)',
    data: {
      answer: { num: 26, unit: 'cm' }, glyph: '🍽',
      traps: [{ match: 13, msg: '13 cm is the radius. The plate’s width is its diameter.' }],
      figure: (function () {
        const S = scene(480, 280, [-14, -5.6, 14, 9.6], 16);
        const R = 13, O = [0, 8 - R], A = [-12, 0], B = [12, 0], T = [0, 8];
        chk('geo-broken-plate', dist(O, A), 13, 1e-9);
        // the shard: the rim is the arc on top, the other edge is ragged
        const ragged = [[-9.5, -1.8], [-6.5, -0.9], [-3, -2.2], [0, -1.2], [3.5, -2.1], [7, -0.6], [9.5, -1.4]];
        S.path(S.M(B) + S.A(R, A, 0, true) + ragged.map((p) => S.L(p)).join('') + 'Z', { fill: '#f1ece0', stroke: INK, sw: 2.6 });
        S.line(A, B, { dash: '6 5', sw: 1.6, stroke: RED }); S.line([0, 0], T, { dash: '4 4', sw: 1.6, stroke: RED });
        S.span(A, B, '24 cm', -46, {}); S.text([0, 4], '8 cm', { dx: 30, size: 15, fill: RED });
        S.dot(A, { r: 3.4 }); S.dot(B, { r: 3.4 }); S.dot(T, { r: 3.4 });
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'pythagoras'], links: ['geo-chord-distance', 'geo-circle-three-points']
  });

  puzzle({
    id: 'geo-chord-distance', title: 'How Far Is the Chord?', diff: 2,
    text: 'A circle has radius **10 cm**. A chord of length **16 cm** is drawn in it.\n\nHow far is the chord from the centre of the circle?',
    hints: ['The line from the centre at right angles to a chord cuts the chord exactly in half.', 'Now you have a right triangle: half the chord (8), the distance you want, and the radius (10).'],
    explain: 'The perpendicular from the centre to a chord bisects it, so it makes a right triangle with legs 8 (half the chord) and d (the distance), and hypotenuse 10 (the radius). d² = 100 − 64 = 36, so d = **6 cm**. It is the 6-8-10 triangle, 3-4-5 doubled.',
    data: {
      answer: { num: 6, unit: 'cm' }, glyph: '⌓',
      traps: [{ match: 2, msg: 'That is 10 − 8. The distance is measured at a right angle, and needs Pythagoras.' }, { match: 8, msg: '8 cm is half of the chord. The distance from the centre is a different leg of the triangle.' }],
      figure: (function () {
        const S = scene(440, 320, [-11, -11.5, 11, 11.5], 12);
        const O = [0, 0], A = [-8, 6], B = [8, 6], M = [0, 6];
        chk('geo-chord-distance', dist(O, A), 10);
        S.circ(O, 10, { fill: '#fffdf6' });
        S.poly([O, A, B], { fill: SY, sw: 1.4 });
        S.line(O, M, { sw: 2.4, stroke: RED }); S.right(M, O, B, 10);
        S.dot(O); S.dot(A, { r: 3.6 }); S.dot(B, { r: 3.6 });
        S.text(mid(O, M), 'd = ?', { dx: -32, size: 17, fill: RED, bold: true });
        S.text(mid(A, B), '16 cm', { dy: -17, size: 16 });
        S.dim(O, B, '10', 15, { size: 15 });
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'circle-angles'], links: ['geo-broken-plate']
  });

  puzzle({
    id: 'geo-chords-cross', title: 'Two Chords Cross', diff: 2,
    text: 'Two chords AB and CD of a circle cross at a point P inside it. The pieces of the first chord are PA = **6** and PB = **4**. On the second chord, PC = **3**.\n\nHow long is PD?',
    hints: ['Find two similar triangles, one with PA and PC, the other with PD and PB. (Use the equal angles on the circle.)', 'Similar triangles give PA ÷ PC = PD ÷ PB.'],
    explain: 'The triangles PAC and PDB are similar: the angles at P are equal (vertical angles), and the angles CAB and CDB look at the same arc. Matching the sides gives PA ÷ PD = PC ÷ PB, which rearranges into PA × PB = PC × PD. Here 6 × 4 = 24 = 3 × PD, so PD = **8**. This “crossing chords” rule holds for every point inside every circle: the two products are always equal.',
    data: {
      answer: { num: 8 }, glyph: '✕',
      traps: [{ match: 4.5, msg: 'Try the rule the other way up: the product of the two parts of one chord equals the product of the two parts of the other.' }, { match: 2, msg: 'That divides instead of multiplying: the products 6 × 4 and 3 × PD must be equal.' }],
      figure: (function () {
        const S = scene(440, 340, [-9, -9, 9, 9], 12);
        const P = [0, 0], A = [-6, 0], B = [4, 0], th = 65, u = [Math.cos(th * RAD), Math.sin(th * RAD)];
        const k = (15 + 6 * u[0]) / (6 * u[1]);   // centre (-1, k) puts C = -3u on the circle
        const O = [-1, k], Rr = Math.hypot(5, k), C = mul(u, -3), D = mul(u, 8);
        [A, B, C, D].forEach((p) => chk('geo-chords-cross', dist(p, O), Rr, 1e-9));
        S.circ(O, Rr, { fill: '#fffdf6' });
        S.line(A, B, { sw: 2.4 }); S.line(C, D, { sw: 2.4 });
        [A, B, C, D, P].forEach((p) => S.dot(p, { r: 3.6 }));
        S.name(A, 'A', -14, 2); S.name(B, 'B', 14, 4); S.name(C, 'C', -12, 10); S.name(D, 'D', 12, -10); S.name(P, 'P', 13, 12);
        S.dim(A, P, '6', 14, { size: 15 }); S.dim(P, B, '4', 14, { size: 15 }); S.dim(C, P, '3', -14, { size: 15 });
        return S.out();
      })()
    },
    concepts: ['similarity', 'circle-angles'], links: ['geo-tangent-secant']
  });

  puzzle({
    id: 'geo-tangent-secant', title: 'Tangent and Secant', diff: 3,
    text: 'From a point P outside a circle, a **tangent** PT of length **12** touches the circle at T. A second line from P, a **secant**, cuts the circle at A (nearer) and B (farther) with PA = **9**.\n\nHow long is the chord AB, the part of the secant inside the circle?',
    hints: ['Look for two similar triangles that share the angle at P: PTA and PBT.', 'That gives PA × PB = PT². Find PB, then subtract PA.'],
    explain: 'The triangles PTA and PBT are similar (they share the angle at P, and the tangent-chord angle equals the angle at the far edge), so PA ÷ PT = PT ÷ PB, i.e. PA × PB = PT² = 144. With PA = 9, PB = 16 and the chord AB = 16 − 9 = **7**. The rule works for every secant from P: the product of the two distances is always the square of the tangent.',
    data: {
      answer: { num: 7 }, glyph: 'T',
      traps: [{ match: 16, msg: '16 is the whole secant PB, from P right through the circle. The chord is only the part inside.' }, { match: 3, msg: 'That is 12 − 9: differences do not work here, but products do.' }],
      figure: (function () {
        const S = scene(520, 300, [-6.4, -6.4, 15, 7.6], 14);
        const O = [0, 0], R = 5, P = [13, 0], T = [25 / 13, 60 / 13];
        const A = cci(O, R, P, 9).sort((a, b) => b[1] - a[1])[0], u = unit(sub(A, P)), B = add(P, mul(u, 16));
        chk('geo-tangent-secant', Math.hypot(B[0], B[1]), R, 1e-9); chk('geo-tangent-secant', dist(P, T), 12, 1e-9);
        chk('geo-tangent-secant', dist(A, B), 7, 1e-9);
        S.circ(O, R, { fill: '#fffdf6' });
        S.line(P, T, { sw: 2.4 }); S.line(P, B, { sw: 2.4 }); S.line(O, T, { dash: '4 4', sw: 1.4, stroke: GREY }); S.right(T, O, P, 9);
        [T, A, B, P, O].forEach((p) => S.dot(p, { r: 3.4 }));
        S.name(T, 'T', -2, -16); S.name(A, 'A', 0, 18); S.name(B, 'B', -14, 4); S.name(P, 'P', 15, 0);
        S.dim(T, P, '12', -16, { size: 15 }); S.dim(P, A, '9', 12, { size: 15 });
        return S.out();
      })()
    },
    concepts: ['similarity', 'circle-angles'], links: ['geo-chords-cross']
  });

  puzzle({
    id: 'geo-fold-diagonal', title: 'Fold a Corner to the Opposite Corner', diff: 3,
    text: 'A rectangular sheet of paper is **8 cm** wide and **6 cm** high. It is folded flat so that one corner lands exactly on the opposite corner.\n\nHow long is the crease?',
    hints: ['When a corner is folded onto another point, the crease is the perpendicular bisector of the segment joining them. Here that segment is the diagonal of the sheet.', 'The diagonal is 10 cm long and has slope 6 ÷ 8. The crease has the negative reciprocal slope, and passes through the middle of the sheet.'],
    explain: 'The crease is the perpendicular bisector of the diagonal, so it passes through the centre of the sheet and is at right angles to the diagonal. The diagonal climbs 6 for every 8 across, so the crease slopes the other way, climbing 8 for every 6 across. Over the full height of 6 cm, the crease therefore moves 6 × 6 ÷ 8 = 4.5 cm sideways, and its length is √(6² + 4.5²) = **7.5 cm**. (In general the crease is the diagonal times the short side over the long side: 10 × 6 ÷ 8.)',
    data: {
      answer: { num: 7.5, unit: 'cm' }, glyph: '📄',
      traps: [{ match: 10, msg: '10 cm is the diagonal. The crease is at right angles to it, and shorter.' }, { match: 6, msg: 'The crease is slanted, so it is longer than the height of the sheet.' }],
      figure: (function () {
        const S = scene(480, 300, [-1, -1, 9, 7], 26);
        const A = [0, 0], C = [8, 6], c1 = [6.25, 0], c2 = [1.75, 6];
        chk('geo-fold-diagonal', dist(c1, c2), 7.5, 1e-9);
        chk('geo-fold-diagonal', dist(c1, A), dist(c1, C), 1e-9);
        S.poly([A, [8, 0], C, [0, 6]], { fill: SY });
        S.line(A, C, { dash: '3 5', stroke: GREY, sw: 1.6 });
        S.dot(A, { r: 5, fill: RED }); S.dot(C, { r: 5, fill: GREEN });
        S.text(A, 'fold this corner', { dx: 60, dy: -16, size: 14, it: true, fill: RED, halo: false }); S.text(C, 'onto this one', { dx: -46, dy: 18, size: 14, it: true, fill: GREEN, halo: false });
        S.text([4, 0], '8 cm', { dy: 18, size: 15 }); S.text([0, 3], '6 cm', { dx: -26, size: 15 });
        return S.out();
      })()
    },
    concepts: ['symmetry', 'pythagoras'], links: ['geo-fold-midpoint']
  });

  puzzle({
    id: 'geo-fold-midpoint', title: 'Fold to the Middle', diff: 4,
    text: 'A square sheet of paper ABCD has sides of **8 cm**, with A at the bottom-left, B bottom-right, C top-right, D top-left. The corner A is folded up so that it lands exactly on the **midpoint M of the top side DC**. The crease cuts the left side AD at a point E.\n\nHow far is E from A?',
    hints: ['When A lands on M, the points of the crease are equally far from A and from M. So EA = EM.', 'Let AE = x. Then ED = 8 − x, and DM = 4. Triangle EDM has a right angle at D.'],
    explain: 'The crease is the set of points equally far from A and from M, so EM = EA = x. On the left side, ED = 8 − x, and DM = 4 (half the top side), with a right angle at D. Pythagoras: (8 − x)² + 4² = x², so 64 − 16x + 16 = 0 and x = **5 cm**. Triangle EDM has sides 3, 4 and 5: a folded square always hides a 3-4-5 triangle when the corner goes to the midpoint of the opposite side.',
    data: {
      answer: { num: 5, unit: 'cm' }, glyph: '📐',
      traps: [{ match: 4, msg: 'Not quite: the crease is at equal distances from A and M, which is not the same as halving the side.' }, { match: 3, msg: '3 cm is ED, the part of the side above E. The question asks for AE.' }],
      figure: (function () {
        const S = scene(440, 350, [-1.2, -1.2, 9.2, 9.6], 22);
        const A = [0, 0], M = [4, 8], E = [0, 5];
        chk('geo-fold-midpoint', dist(E, A), dist(E, M), 1e-9); chk('geo-fold-midpoint', dist(E, A), 5, 1e-9);
        S.poly([A, [8, 0], [8, 8], [0, 8]], { fill: SY });
        S.dot(M, { r: 4.4, fill: GREEN }); S.dot(A, { r: 5, fill: RED });
        S.path(S.M([0.5, 1.2]) + 'Q' + S.X(0.6) + ' ' + S.Y(5.6) + ' ' + S.X(3.5) + ' ' + S.Y(7.3) + ' ', { stroke: RED, sw: 2, dash: '6 4' });
        S.names([A, [8, 0], [8, 8], [0, 8]], ['A', 'B', 'C', 'D'], [4, 4], 15); S.name(M, 'M', 0, 18, { fill: GREEN });
        S.text([4, 0], '8 cm', { dy: 18, size: 15 });
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'symmetry'], links: ['geo-fold-diagonal']
  });

  puzzle({
    id: 'geo-tower-elevation', title: 'The Height of the Tower', diff: 3,
    text: 'Standing on level ground, you see the top of a tall tower at an angle of elevation of **30°**. You walk **100 m** straight towards the tower, and now you see the top at **45°**.\n\nHow tall is the tower, to the nearest metre?',
    hints: ['Let the height be h. Use the right triangle at each of the two places: how far is the foot of the tower from you at 45°, and at 30°?', 'At 45° the distance to the foot equals h. At 30° it is h × √3 (the 30-60-90 triangle). The two distances differ by 100 m.'],
    explain: 'At 45° the ground distance to the tower is equal to its height h (the triangle is isosceles). At 30° the ground distance is h ÷ tan 30° = h√3 ≈ 1.732h. You walked the difference: h√3 − h = 100, so h = 100 ÷ (√3 − 1) = 50(√3 + 1) ≈ 136.6 m: **137 m**.',
    data: {
      answer: { num: 136.6, tol: 0.5, unit: 'm', show: '137' }, glyph: '🗼',
      traps: [{ match: 100, msg: '100 m is how far you walked, not the height.' }, { match: 173, msg: 'That is the ground distance from the first place, h√3 with h = 100. But h is what you are looking for.' }],
      figure: (function () {
        const S = scene(540, 270, [-27, -3.4, 4, 16], 12);
        const h = 100 / (Math.sqrt(3) - 1), k = 0.1;
        // scale: 1 unit of drawing = 10 m in the figure
        const Hh = h * k, x1 = -h * Math.sqrt(3) * k, x2 = -h * k;
        chk('geo-tower-elevation', h, 136.6, 0.05);
        S.poly([[-24, 0], [8, 0], [8, -1.2], [-24, -1.2]], { fill: '#e3d6ad', sw: 1.5 });
        S.poly([[-0.9, 0], [0.9, 0], [0.6, Hh], [-0.6, Hh]], { fill: '#d8c9a8', sw: 2 });
        S.line([x1, 0], [0, Hh], { dash: '5 4', stroke: GREY, sw: 1.4 }); S.line([x2, 0], [0, Hh], { dash: '5 4', stroke: GREY, sw: 1.4 });
        S.dot([x1, 0], { r: 4 }); S.dot([x2, 0], { r: 4 });
        S.ang([x1, 0], [1, 0], [0, Hh], { r: 40, label: '30°', ld: 16 }); S.ang([x2, 0], [1, 0], [0, Hh], { r: 38, label: '45°', ld: 15 });
        S.span([x1, -1.2], [x2, -1.2], '100 m', -12, {});
        S.text([0, Hh / 2], 'h = ?', { dx: 34, size: 17, fill: RED, bold: true });
        return S.out();
      })()
    },
    concepts: ['similarity', 'pythagoras'], links: ['geo-pyramid-shadow']
  });


  /* =====================  AREAS: CIRCLES AND SQUARES  ===================== */

  puzzle({
    id: 'geo-nested-squares', title: 'The Square Inside the Circle', diff: 1,
    text: 'A circle just fits inside a square of side **10 cm**, touching all four sides. A second, smaller square is drawn inside the circle, with its four corners on the circle.\n\nWhat is the area of the smaller square?',
    hints: ['Where do the corners of the small square sit, compared with the points where the circle touches the big square?', 'Join the four touching points: they are the corners of the small square, and its diagonals are the diameters of the circle.'],
    explain: 'The corners of the inner square are the four points where the circle touches the big square, so they are the midpoints of the big square’s sides. Joining them cuts four corner triangles off the big square, each with two sides of 5 cm, so each has area 12.5 and together they take 50. What is left is the tilted square: 100 − 50 = **50 cm²**, exactly half of the big square. (Its diagonal is 10 cm, the diameter of the circle, and its side is 5√2.)',
    data: {
      answer: { num: 50, unit: 'cm²' }, glyph: '◇',
      traps: [{ match: 25, msg: '25 is the area of a square of side 5, but the small square’s side is not 5: it slants.' }, { match: 78.5, msg: '78.5 is the area of the circle, not of the square inside it.' }],
      figure: (function () {
        const S = scene(400, 400, [-1, -1, 11, 11], 16);
        const P = [[0, 5], [5, 0], [10, 5], [5, 10]];
        chk('geo-nested-squares', polyArea(P), 50, 1e-9);
        S.poly([[0, 0], [10, 0], [10, 10], [0, 10]], { fill: SN });
        S.circ([5, 5], 5, { fill: SB });
        S.poly(P, { fill: SY });
        S.text([5, 5], '?', { size: 34, bold: true, fill: RED });
        S.text([5, 0], '10 cm', { dy: 20, size: 15 });
        P.forEach((p) => S.dot(p, { r: 3.4 }));
        return S.out();
      })()
    },
    concepts: ['area', 'symmetry'], links: ['geo-square-inscribed-semicircle', 'geo-hexagon-triangle']
  });

  puzzle({
    id: 'geo-square-inscribed-semicircle', title: 'The Square in the Semicircle', diff: 3,
    text: 'A semicircle has radius **10**. A square stands with its base on the diameter of the semicircle, and its two top corners touch the curved edge.\n\nWhat is the **area** of the square?',
    hints: ['Put the centre O of the semicircle in the middle of the square’s base. Let the side of the square be s: how far is a top corner from O, sideways and upwards?', 'Sideways it is s ÷ 2 and upwards s, and it lies on the circle: (s ÷ 2)² + s² = 10².'],
    explain: 'By symmetry the square is centred on the middle O of the diameter. A top corner is s ÷ 2 to the side of O and s above it, and it lies on the circle of radius 10, so (s ÷ 2)² + s² = 100, i.e. 5s² ÷ 4 = 100 and **s² = 80**. But s² is the area of the square, so we never need s itself: the area is **80** (the side is about 8.94). Try the same with any radius r: the area is always 4r² ÷ 5.',
    data: {
      answer: { num: 80 }, glyph: '⬒',
      traps: [{ match: 64, msg: 'Careful: the side is not 8. Use Pythagoras with the corner, the centre and the foot of the square’s side.' }, { match: 100, msg: '100 would be a square of side 10, far too big to fit under the arch: its top corners would be outside the circle.' }],
      figure: (function () {
        const S = scene(480, 290, [-11, -1.6, 11, 11.2], 12);
        const s = Math.sqrt(80), O = [0, 0], T = [s / 2, s];
        chk('geo-square-inscribed-semicircle', Math.hypot(T[0], T[1]), 10, 1e-9);
        S.path(S.M([-10, 0]) + S.A(10, [10, 0], 0, false) + 'Z', { fill: SB });
        S.poly([[-s / 2, 0], [s / 2, 0], [s / 2, s], [-s / 2, s]], { fill: SY });
        S.line(O, T, { dash: '5 4', sw: 1.8, stroke: RED });
        S.text(mid(O, T), '10', { dx: 14, dy: 4, size: 16, fill: RED }); S.dot(O, { r: 3.4 }); S.name(O, 'O', 0, 18);
        S.dot(T, { r: 3.4 }); S.dot([-s / 2, s], { r: 3.4 });
        S.text([0, s / 2], 'area?', { size: 17, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'area', 'circle-angles'], links: ['geo-nested-squares', 'geo-rectangle-in-circle']
  });

  puzzle({
    id: 'geo-overlapping-squares', title: 'The Turning Square', diff: 3,
    text: 'Two identical squares of side **10 cm** lie on a table. One corner of the second square sits exactly at the **centre** of the first, and the second square can be turned about that corner to any angle. In the picture it is turned by 25°.\n\nWhat is the area of the part where the two squares overlap? (Does the angle matter?)',
    hints: ['Try turning the second square by 0° and by 45°: what is the overlap in these easy cases?', 'Cut the first square into four equal pieces from its centre. The corner of the second square is a right angle.'],
    explain: 'The centre of the first square is a point of four-fold symmetry: turning the first square by 90° about its centre maps it onto itself. The second square’s right angle at the centre marks off a 90° wedge of the first square, and any 90° wedge from the centre holds exactly a quarter of it. So the overlap is always a quarter of the square, **25 cm²**, whatever the angle. (The second square is large enough to cover the whole wedge, because its side, 10, is more than the distance to a corner of the first, 7.07.)',
    data: {
      answer: { num: 25, unit: 'cm²' }, glyph: '⧉',
      traps: [{ match: 50, msg: 'The overlap is not half. Think about what the right angle at the centre cuts out of the first square.' }, { match: 100, msg: '100 is the area of one whole square. The squares only partly overlap.' }],
      figure: (function () {
        const S = scene(420, 450, [-1, -1, 15, 19.5], 14);
        const O = [5, 5], u = [Math.cos(25 * RAD), Math.sin(25 * RAD)], v = [-Math.sin(25 * RAD), Math.cos(25 * RAD)];
        const sq1 = [[0, 0], [10, 0], [10, 10], [0, 10]];
        const sq2 = [O, add(O, mul(u, 10)), add(add(O, mul(u, 10)), mul(v, 10)), add(O, mul(v, 10))];
        const ov = clipPoly(sq2, sq1);
        chk('geo-overlapping-squares', polyArea(ov), 25, 1e-9);
        S.poly(sq1, { fill: SB, op: 0.85 });
        S.poly(sq2, { fill: SR, op: 0.55 });
        S.poly(ov, { fill: SG, stroke: GREEN, sw: 2.6 });
        S.poly(sq1, { fill: null }); S.poly(sq2, { fill: null, stroke: RED });
        S.dot(O, { r: 4 });
        S.text(ov.reduce((a, p) => add(a, mul(p, 1 / ov.length)), [0, 0]), '?', { size: 30, bold: true, fill: GREEN });
        S.text([5, 0], '10 cm', { dy: 19, size: 15 });
        S.ang(O, add(O, [1, 0]), add(O, u), { r: 30, label: '25°', stroke: RED, ld: 14 });
        return S.out();
      })()
    },
    concepts: ['symmetry', 'area'], links: ['geo-nested-squares', 'geo-varignon']
  });

  puzzle({
    id: 'geo-lune-triangle', title: 'The Moons of Hippocrates', diff: 3,
    source: 'Hippocrates of Chios (5th century BC): the first curved figure whose area was ever found exactly.',
    text: 'A right triangle has legs **6** and **8** (and so a longest side of 10). A semicircle is drawn outwards on each leg. A larger semicircle is drawn on the longest side, on the same side as the right angle: it passes through the right-angle corner. The two crescent “moons” that stick out beyond the big curve are shaded green.\n\nWhat is the **total area of the two moons**?',
    hints: ['You do not need to know the area of a moon on its own. Add up the areas of some semicircles and see what cancels.', 'The three semicircles on the sides of a right triangle are related by Pythagoras: the two small ones together equal the big one.'],
    explain: 'Let the semicircles on the legs have areas L₁ and L₂ and the one on the hypotenuse H. Pythagoras makes the areas of similar figures on the three sides add up in the same way as the squares do: L₁ + L₂ = H. Now the two moons are made from the two small semicircles by taking away the two segments of the big semicircle that lie beyond the legs, and the big semicircle is the triangle plus those same two segments. So moons = L₁ + L₂ − segments = H − segments = triangle. The moons together have the area of the triangle: ½ × 6 × 8 = **24**. Hippocrates found this around 440 BC, long before anybody could square a circle (which cannot be done): a moon can be squared.',
    data: {
      answer: { num: 24 }, glyph: '☾',
      traps: [{ match: 48, msg: '48 is the area of the rectangle 6 × 8. The triangle is half of that.' }, { match: 75.4, msg: 'That is the area of a big semicircle. The moons are only what sticks out of it.' }],
      figure: (function () {
        const S = scene(500, 340, [-3.6, -4.6, 8.6, 6.8], 14);
        const C = [0, 0], B = [8, 0], A = [0, 6], O = [4, 3];
        deep('geo-lune-triangle', (x, y) => ((y < 0 && (x - 4) * (x - 4) + y * y <= 16) || (x < 0 && x * x + (y - 3) * (y - 3) <= 9)) && (x - 4) * (x - 4) + (y - 3) * (y - 3) > 25, [-3.1, -4.1, 8.1, 6.1], 24);
        const aA = Math.atan2(A[1] - O[1], A[0] - O[0]) * DEG;
        S.path(S.M(C) + S.A(4, B, 0, true) + 'Z', { fill: SG });
        S.path(S.M(A) + S.A(3, C, 0, true) + 'Z', { fill: SG });
        S.path(S.M(A) + S.A(5, B, 0, true) + 'Z', { fill: CREAM, stroke: null });
        S.poly([A, B, C], { fill: SY });
        S.arc(O, 5, aA, aA + 180, { sw: 2.2 });
        S.path(S.M(C) + S.A(4, B, 0, true), { sw: 2.2 }); S.path(S.M(A) + S.A(3, C, 0, true), { sw: 2.2 });
        S.line(A, B, { sw: 1.4 });
        S.right(C, A, B, 11);
        S.text([4, 0], '8', { dy: -14, size: 16 }); S.text([0, 3], '6', { dx: 14, size: 16 });
        S.text([4, -3.05], 'moon', { size: 16, it: true, fill: GREEN }); S.text([-2.1, 3], 'moon', { size: 16, it: true, fill: GREEN, dx: -2 });
        return S.out();
      })()
    },
    concepts: ['area', 'pythagoras'], links: ['geo-lens-quarter-circles', 'geo-hexagon-triangle']
  });

  puzzle({
    id: 'geo-lens-quarter-circles', title: 'The Lens in the Square', diff: 3,
    text: 'A square has sides of **10 cm**. Two quarter-circles of radius 10 cm are drawn inside it, one centred at the bottom-left corner and one at the top-right corner. They overlap in a lens-shaped region between the other two corners.\n\nWhat is the area of the lens? Give it to two decimal places.',
    hints: ['Find the areas of the two quarter-circles first. If you add them up, what have you counted twice?', 'Two quarter-circles together cover the whole square, and the lens is the part covered by both.'],
    explain: 'Each quarter-circle has area ¼ × π × 10² = 25π. Together they cover the whole square (every point of it is within 10 cm of one of the two corners), and the lens is the only part covered twice. So 25π + 25π = square + lens, and the lens is 50π − 100 = **57.08 cm²**. The trick is that it needs no integral, just subtraction of an area counted twice.',
    data: {
      answer: { num: 57.0796, tol: 0.005, unit: 'cm²', show: '57.08' }, glyph: '◖◗',
      traps: [{ match: 78.54, msg: '78.54 is the area of one quarter-circle: the lens is smaller than that.' }, { match: 157.08, msg: '157.08 is both quarter-circles together. That counts the lens twice and goes beyond the square: subtract the square’s 100.' }],
      figure: (function () {
        const S = scene(400, 400, [-1, -1, 11, 11], 16);
        const A = [0, 0], C = [10, 10];
        deep('geo-lens-quarter-circles', (x, y) => x * x + y * y <= 100 && (x - 10) * (x - 10) + (y - 10) * (y - 10) <= 100, [-0.5, -0.5, 10.5, 10.5], 50 * Math.PI - 100);
        S.poly([[0, 0], [10, 0], [10, 10], [0, 10]], { fill: SN });
        const id1 = S.clip(() => S.circ(A, 10));
        S.clipped(id1, () => S.circ(C, 10, { fill: SR, stroke: null }));
        S.arc(A, 10, 0, 90, { sw: 2.2, stroke: BLUE }); S.arc(C, 10, 180, 270, { sw: 2.2, stroke: BLUE });
        S.poly([[0, 0], [10, 0], [10, 10], [0, 10]], { fill: null, sw: 2.4 });
        S.text([5, 5], 'lens', { size: 18, it: true, fill: RED, bold: true });
        S.text([5, 0], '10 cm', { dy: 20, size: 15 });
        return S.out();
      })()
    },
    concepts: ['area', 'symmetry'], links: ['geo-lune-triangle', 'geo-annulus-chord']
  });

  puzzle({
    id: 'geo-annulus-chord', title: 'The Ring and the Chord', diff: 3,
    text: 'Two circles share a centre, so together they make a flat ring. A straight chord of the big circle just **touches** the small circle. The chord is **20 cm** long.\n\nThe radii of the two circles are not given. What is the area of the ring, as a multiple of π?',
    hints: ['The area of the ring is π R² − π r². You need R² − r², not R and r separately.', 'The line from the centre to the touching point is at right angles to the chord and cuts it in halves of 10 cm. Use the triangle centre, touching point, end of chord.'],
    explain: 'The chord touches the small circle, so the radius to the touching point is perpendicular to the chord and bisects it: it makes a right triangle with legs r and 10 and hypotenuse R. Then R² = r² + 10², i.e. **R² − r² = 100**. The ring has area π(R² − r²) = **100π** (about 314 cm²), whatever the two radii are: a ring with a 20 cm chord has the same area as a disc with a 20 cm diameter.',
    data: {
      answer: { num: 100 }, glyph: '◎', ask: 'Area = ? × π. Give the number in front of π.',
      traps: [{ match: 10, msg: '10 is half the chord. The area needs the difference of the squares of the radii.' }, { match: 400, msg: 'Nearly: the half chord is 10, not 20, when you square it: 10² = 100.' }],
      figure: (function () {
        const S = scene(440, 400, [-14, -14, 14, 14], 12);
        const R = 13, r = Math.sqrt(69);
        chk('geo-annulus-chord', R * R - r * r, 100, 1e-9);
        S.circ([0, 0], R, { fill: SB, sw: 2.4 });
        S.circ([0, 0], r, { fill: CREAM, sw: 2.4 });
        S.line([-10, r], [10, r], { stroke: RED, sw: 3 });
        S.dot([0, 0], { r: 3 }); S.dot([0, r], { r: 3.4, fill: RED });
        S.line([0, 0], [0, r], { dash: '4 4', sw: 1.4 }); S.right([0, r], [0, 0], [1, r], 9);
        S.text([0, r], '20 cm', { dy: -17, size: 16 });
        S.text([0, -4], 'ring', { size: 17, it: true, fill: GREY, halo: false, dy: 64 });
        return S.out();
      })()
    },
    concepts: ['area', 'pythagoras'], links: ['geo-lens-quarter-circles']
  });

  puzzle({
    id: 'geo-rectangle-in-circle', title: 'The Rectangle in the Circle', diff: 2,
    text: 'A rectangle is inscribed in a circle of radius **13 cm**: all four corners lie on the circle. One side of the rectangle is **10 cm** long.\n\nHow long is the other side?',
    hints: ['The corners of a rectangle on a circle: what is special about its diagonals?', 'The angle at a corner is 90°, and an angle of 90° at the edge of a circle looks at a diameter. So a diagonal is a diameter: 26 cm.'],
    explain: 'The angle in a semicircle is a right angle, and a rectangle has right angles at every corner, so each diagonal of the rectangle is a diameter of the circle: 2 × 13 = 26 cm. The diagonal, the 10 cm side and the unknown side form a right triangle: x² = 26² − 10² = 676 − 100 = 576, so x = **24 cm**. (5-12-13, doubled to 10-24-26.)',
    data: {
      answer: { num: 24, unit: 'cm' }, glyph: '▭',
      traps: [{ match: 16, msg: 'That is 26 − 10, the diameter minus the side. The two sides and the diagonal make a right triangle: use Pythagoras.' }, { match: 12, msg: '12 is half of the other side (the leg of the 5-12-13 triangle from the centre). The whole side is twice that.' }],
      figure: (function () {
        const S = scene(440, 400, [-14, -14, 14, 14], 12);
        const P = [[-5, -12], [5, -12], [5, 12], [-5, 12]];
        P.forEach((p) => chk('geo-rectangle-in-circle', Math.hypot(p[0], p[1]), 13, 1e-9));
        S.circ([0, 0], 13, { fill: '#fffdf6' });
        S.poly(P, { fill: SY });
        S.line(P[0], P[2], { dash: '5 4', sw: 1.6 });
        P.forEach((p) => S.dot(p, { r: 3.6 })); S.dot([0, 0], { r: 3 });
        S.text([0, 12], '10 cm', { dy: -16, size: 16 }); S.text([5, 0], '?', { dx: 20, size: 24, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'pythagoras'], links: ['geo-thales-semicircle', 'geo-quarter-circle-rectangle']
  });

  puzzle({
    id: 'geo-quarter-circle-rectangle', title: 'A Rectangle in the Quarter-Circle', diff: 2,
    text: 'OA and OC are two perpendicular radii of a quarter-circle of radius **13**. The rectangle OABC has O, A and C at the corners, and its fourth corner B on the curved edge. (Its sides are 12 and 5, but you need not use them.)\n\nHow long is the diagonal AC?',
    hints: ['A rectangle has two diagonals. One of them is OB. What is OB in the picture?', 'The two diagonals of a rectangle are equal.'],
    explain: 'The diagonals of a rectangle are equal in length. One diagonal is OB, which is a radius of the circle, since B is on the curved edge: 13. So the other diagonal AC is also **13**, without any computation at all. (Check: √(12² + 5²) = 13.)',
    data: {
      answer: { num: 13 }, glyph: '⌐',
      traps: [{ match: 17, msg: 'That adds the two sides, 12 + 5. A diagonal is shorter than the path along two sides.' }],
      figure: (function () {
        const S = scene(440, 400, [-1.5, -1.5, 14.5, 14.5], 14);
        const O = [0, 0], A = [12, 0], B = [12, 5], C = [0, 5];
        chk('geo-quarter-circle-rectangle', Math.hypot(B[0], B[1]), 13, 1e-9); chk('geo-quarter-circle-rectangle', dist(A, C), 13, 1e-9);
        S.path(S.M([13, 0]) + S.A(13, [0, 13], 0, true) + S.L(O) + 'Z', { fill: SB });
        S.poly([O, A, B, C], { fill: SY });
        S.line(O, B, { dash: '5 4', sw: 1.8, stroke: BLUE }); S.line(A, C, { sw: 2.6, stroke: RED });
        [O, A, B, C].forEach((p) => S.dot(p, { r: 3.6 }));
        S.text(mid(O, B), '13', { dx: 8, dy: 15, size: 16, fill: BLUE }); S.text(mid(A, C), '?', { dx: -4, dy: -15, size: 22, bold: true, fill: RED });
        S.names([O, A, B, C], ['O', 'A', 'B', 'C'], [4, 2.5], 15);
        return S.out();
      })()
    },
    concepts: ['symmetry', 'circle-angles'], links: ['geo-rectangle-in-circle']
  });


  /* =====================  AREAS: TRIANGLES AND POLYGONS  ===================== */

  puzzle({
    id: 'geo-hexagon-triangle', title: 'The Star of the Hexagon', diff: 2,
    text: 'The corners of a regular hexagon are numbered in order round the edge. A triangle is drawn by joining corners 1, 3 and 5. The hexagon has an area of **60 cm²**.\n\nWhat is the area of the triangle?',
    hints: ['Cut the hexagon into six equal pieces from its centre. How many of those pieces would you need to cover the triangle?', 'The triangle is the hexagon with three identical pieces cut off at the corners 2, 4 and 6. How big is each piece compared with the whole hexagon?'],
    explain: 'Joining every second corner cuts three identical little triangles off the hexagon (at corners 2, 4 and 6). Each has two sides of the hexagon, of length s, with an angle of 120° between them, so its area is ½ s² sin 120° = (√3 ÷ 4) s², which is also the area of an equilateral triangle of side s. The hexagon is made of six such equilateral triangles round its centre, so each cut-off piece is one sixth of the hexagon. Three of them take away half, and the triangle keeps the other half: **30 cm²**.',
    data: {
      answer: { num: 30, unit: 'cm²' }, glyph: '⬡',
      traps: [{ match: 20, msg: 'That would make the triangle a third of the hexagon. Count the corner pieces cut off: there are three of them, one sixth each.' }, { match: 15, msg: 'The triangle is bigger than a quarter: it covers most of the middle of the hexagon.' }],
      figure: (function () {
        const S = scene(420, 380, [-5.6, -5.4, 5.6, 5.4], 12);
        const H = regular(6, 5, [0, 0], 90);
        const T = [H[0], H[2], H[4]];
        chk('geo-hexagon-triangle', polyArea(T) * 2, polyArea(H), 1e-9);
        S.poly(H, { fill: SB });
        S.poly(T, { fill: SY });
        S.poly(H, { fill: null, sw: 2.4 });
        H.forEach((p) => S.dot(p, { r: 3.6 }));
        S.text([0, 0.2], '?', { size: 32, bold: true, fill: RED });
        S.text([0, -4.4], '60 cm²', { size: 15, dx: 0, halo: false, fill: GREY, dy: 0 });
        return S.out();
      })()
    },
    concepts: ['area', 'symmetry', 'dissection'], links: ['geo-nested-squares', 'geo-varignon']
  });

  puzzle({
    id: 'geo-varignon', title: 'The Quadrilateral of Midpoints', diff: 3,
    source: 'Pierre Varignon, a French mathematician, published this in 1731 (in a book that appeared after his death).',
    text: 'A four-sided figure ABCD (with no special shape at all) has an area of **90 cm²**. The midpoints of its four sides are joined in order to make a smaller four-sided figure.\n\nWhat is the area of the smaller figure?',
    hints: ['Draw a diagonal of ABCD. Each of the small figure’s sides is parallel to a diagonal.', 'Consider one corner, say B, with its two neighbouring midpoints: the little triangle cut off is similar to triangle ABC, with sides halved.'],
    explain: 'Each corner of ABCD is cut off by a triangle with the corner and the two neighbouring midpoints: for corner B it is similar to triangle ABC with ratio 1 : 2, so its area is a quarter of triangle ABC. Likewise the triangle at D is a quarter of ACD. Those two together are a quarter of ABCD. The triangles at A and C are, in the same way, a quarter of ABCD together (using the other diagonal). So the four corners cut away half of ABCD and the figure of midpoints has half the area: **45 cm²**. It is always a parallelogram, however lopsided ABCD is.',
    data: {
      answer: { num: 45, unit: 'cm²' }, glyph: '▱',
      traps: [{ match: 22.5, msg: 'That is a quarter. The four cut-off corners take half of the figure, and the figure of midpoints is the other half.' }, { match: 30, msg: 'There is no third here: the cut-off corners take exactly half of the area.' }],
      figure: (function () {
        const S = scene(480, 340, [-1.5, -1.5, 13.5, 11.5], 16);
        const A = [0, 0], B = [12, 0], C = [10, 8], D = [2, 10], Q = [A, B, C, D];
        const M = [mid(A, B), mid(B, C), mid(C, D), mid(D, A)];
        chk('geo-varignon', polyArea(Q), 90, 1e-9); chk('geo-varignon', polyArea(M), 45, 1e-9);
        S.poly(Q, { fill: SN });
        S.poly(M, { fill: SY, stroke: RED, sw: 2.6 });
        S.poly(Q, { fill: null });
        Q.forEach((p) => S.dot(p, { r: 3.6 })); M.forEach((p) => S.dot(p, { r: 3.2, fill: RED }));
        S.names(Q, ['A', 'B', 'C', 'D'], [6, 5], 16);
        S.text([6, 4.5], '?', { size: 30, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['area', 'similarity'], links: ['geo-hexagon-triangle', 'geo-centroid-medians']
  });

  puzzle({
    id: 'geo-centroid-medians', title: 'Three Medians Meet', diff: 2,
    text: 'In triangle ABC, the lines from each corner to the midpoint of the opposite side (the **medians**) all pass through one point G. Triangle ABC has an area of **90 cm²**.\n\nWhat is the area of triangle GBC?',
    hints: ['The three medians cut the triangle into six small triangles. Are they equal in area? (A median cuts a triangle into two of equal area, because the two halves have the same height and equal bases.)', 'Triangle GBC is made of two of those six pieces.'],
    explain: 'A median halves the area of a triangle, and G is the point where the medians meet, so the six small triangles round G all have equal area: 90 ÷ 6 = 15 cm². Triangle GBC is two of them: **30 cm²**, a third of the whole. So G, the centre of gravity of a flat triangle, is always a third of the way up from any side.',
    data: {
      answer: { num: 30, unit: 'cm²' }, glyph: 'G',
      traps: [{ match: 45, msg: '45 is half of the triangle: the area on one side of a single median. GBC is smaller.' }, { match: 15, msg: '15 is one of the six small triangles. GBC is made of two of them.' }],
      figure: (function () {
        const S = scene(480, 320, [-1.5, -1.5, 17, 13.5], 16);
        const A = [0, 0], B = [15, 0], C = [4, 12], G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
        chk('geo-centroid-medians', polyArea([A, B, C]), 90, 1e-9); chk('geo-centroid-medians', polyArea([G, B, C]), 30, 1e-9);
        S.poly([A, B, C], { fill: SN });
        S.poly([G, B, C], { fill: SY });
        [[A, mid(B, C)], [B, mid(A, C)], [C, mid(A, B)]].forEach(([p, q]) => S.line(p, q, { sw: 1.6 }));
        S.poly([A, B, C], { fill: null, sw: 2.4 });
        [mid(A, B), mid(B, C), mid(A, C)].forEach((p) => S.dot(p, { r: 3 }));
        S.dot(G, { r: 4.2, fill: RED });
        S.text([(G[0] + B[0] + C[0]) / 3, (G[1] + B[1] + C[1]) / 3], '?', { size: 26, bold: true, fill: RED });
        S.names([A, B, C], ['A', 'B', 'C'], [6, 4], 16); S.name(G, 'G', -14, 6, { fill: RED });
        return S.out();
      })()
    },
    concepts: ['area', 'symmetry'], links: ['geo-varignon', 'geo-similar-triangle-areas']
  });

  puzzle({
    id: 'geo-trapezoid-diagonals', title: 'A Trapezoid Cut by Its Diagonals', diff: 4,
    text: 'ABCD is a trapezoid whose top AB is parallel to its bottom DC. The two diagonals cross at O and cut the trapezoid into four triangles. The small triangle AOB at the top has an area of **9**, and the triangle DOC at the bottom has an area of **16**.\n\nWhat is the **area of the whole trapezoid**?',
    hints: ['Triangles AOB and COD are similar (AB is parallel to DC). What is the ratio of their sides, given the ratio of their areas?', 'The other two triangles, AOD and BOC, are equal in area. Find how they compare with 9 and 16 by looking at the ratio of the sides.'],
    explain: 'Triangles AOB and COD are similar, and their areas are in the ratio 9 : 16, so their sides are in the ratio 3 : 4. Then O divides each diagonal in the ratio 3 : 4. Triangles AOB and AOD have the same height from A to the diagonal BD and bases in the ratio 3 : 4, so AOD = 9 × 4 ÷ 3 = 12; in the same way BOC = 12. The whole trapezoid is 9 + 16 + 12 + 12 = **49**, which is (3 + 4)²: the square of the sum of the square roots of the two areas.',
    data: {
      answer: { num: 49 }, glyph: '⏢',
      traps: [{ match: 25, msg: '25 = 9 + 16. But the two side triangles have areas too, and they are not small.' }, { match: 37, msg: '37 = 9 + 16 + 12: you have found one of the two side triangles, but there are two.' }],
      figure: (function () {
        const S = scene(480, 320, [-1, -1, 9, 8], 22);
        const D = [0, 0], C = [8, 0], B = [7, 7], A = [1, 7], O = inter(A, C, B, D);
        chk('geo-trapezoid-diagonals', polyArea([A, B, O]), 9, 1e-9); chk('geo-trapezoid-diagonals', polyArea([D, C, O]), 16, 1e-9);
        chk('geo-trapezoid-diagonals', polyArea([A, B, C, D]), 49, 1e-9);
        S.poly([A, B, O], { fill: SB }); S.poly([D, C, O], { fill: SR }); S.poly([A, O, D], { fill: SN }); S.poly([B, C, O], { fill: SN });
        S.line(A, C, { sw: 1.8 }); S.line(B, D, { sw: 1.8 });
        S.poly([A, B, C, D], { fill: null, sw: 2.6 });
        S.text([4, 5.6], '9', { size: 22, bold: true, fill: BLUE }); S.text([4, 1.6], '16', { size: 22, bold: true, fill: RED });
        S.text([2, 3.5], '?', { size: 22, bold: true, fill: GREY }); S.text([6, 3.5], '?', { size: 22, bold: true, fill: GREY });
        S.dot(O, { r: 3.6 });
        S.names([A, B, C, D], ['A', 'B', 'C', 'D'], [4, 3.5], 16); S.name(O, 'O', 14, 2);
        return S.out();
      })()
    },
    concepts: ['similarity', 'area'], links: ['geo-similar-triangle-areas']
  });

  puzzle({
    id: 'geo-routh-seventh', title: 'The Triangle Inside Three Lines', diff: 5,
    source: 'A special case of Routh’s theorem (Edward Routh, 1891): the one-seventh triangle.',
    text: 'On each side of triangle ABC a point is marked a **third** of the way along: D on BC with BD = ⅓ BC, E on CA with CE = ⅓ CA, and F on AB with AF = ⅓ AB (going round the triangle the same way each time). The three lines AD, BE and CF are drawn. They enclose a small triangle in the middle.\n\nTriangle ABC has an area of **70**. What is the area of the small middle triangle?',
    hints: ['The three lines cut each other in the same way. Look at AD: the other two lines cut it into three pieces, in the ratio 3 : 3 : 1 (coordinates or Menelaus’ theorem will show it).', 'Let P be where AD meets BE. Menelaus’ theorem in triangle ADC, with the line through B, P and E, gives AP : PD = 6 : 1. Use it to find the area of triangle ABP.', 'The triangles ABP, BCQ and CAR are equal in area, and together with the middle triangle they make up the whole of ABC.'],
    explain: 'Let P be where AD meets BE. Menelaus’ theorem in triangle ADC with the line B–P–E gives (AP ÷ PD) × (DB ÷ BC) × (CE ÷ EA) = 1, that is (AP ÷ PD) × ⅓ × ½ = 1, so AP : PD = 6 : 1. Triangle ABD has a third of the area of ABC (its base BD is a third of BC): 70 ÷ 3. Triangle ABP has 6/7 of it, since AP is 6/7 of AD: 6/7 × 70/3 = 20. By the same argument, BCQ and CAR also have area 20. These three triangles fit round the middle one and fill the rest of ABC, so the middle triangle has 70 − 3 × 20 = **10**, exactly a seventh of the whole triangle.',
    data: {
      answer: { num: 10 }, glyph: '⅐',
      traps: [{ match: 70 / 3, msg: 'That would be a third of the triangle, the area of ABD. The middle triangle is much smaller than that.' }, { match: 7.78, msg: 'A ninth would be the answer if the lines met more evenly. In fact the middle triangle is a seventh.' }],
      figure: (function () {
        const S = scene(500, 340, [-1, -1, 15, 11.5], 16);
        const A = [0, 0], B = [14, 0], C = [4, 10], D = lerp(B, C, 1 / 3), E = lerp(C, A, 1 / 3), F = lerp(A, B, 1 / 3);
        const P = inter(A, D, B, E), Q = inter(B, E, C, F), R = inter(C, F, A, D);
        chk('geo-routh-seventh', polyArea([A, B, C]), 70, 1e-9); chk('geo-routh-seventh', polyArea([P, Q, R]), 10, 1e-9);
        S.poly([A, B, C], { fill: SN });
        S.poly([P, Q, R], { fill: SR, stroke: RED, sw: 2.4 });
        S.line(A, D, { sw: 1.8 }); S.line(B, E, { sw: 1.8 }); S.line(C, F, { sw: 1.8 });
        S.poly([A, B, C], { fill: null, sw: 2.6 });
        S.tick(A, F, 1); S.tick(F, B, 2); S.tick(B, D, 1); S.tick(D, C, 2); S.tick(C, E, 1); S.tick(E, A, 2);
        [D, E, F].forEach((p) => S.dot(p, { r: 3.2 }));
        S.text([(P[0] + Q[0] + R[0]) / 3, (P[1] + Q[1] + R[1]) / 3], '?', { size: 14, bold: true, fill: RED });
        S.names([A, B, C], ['A', 'B', 'C'], [6, 4], 16); S.name(D, 'D', 15, 3); S.name(E, 'E', -15, 3); S.name(F, 'F', 0, 17);
        S.text([7, 8.6], 'area 70', { size: 15, fill: GREY, halo: false, dx: 44, dy: 0 });
        return S.out();
      })()
    },
    concepts: ['area', 'similarity'], links: ['geo-centroid-medians', 'geo-trapezoid-diagonals']
  });

  puzzle({
    id: 'geo-rectangle-point', title: 'A Point in a Rectangle', diff: 3,
    text: 'P is a point somewhere inside the rectangle ABCD, and it is joined to the four corners. This cuts the rectangle into four triangles. Going round the rectangle, the triangles PAB, PBC and PCD have areas **21**, **33** and **39**.\n\nWhat is the area of the fourth triangle, PDA?',
    hints: ['The triangles PAB and PCD both have a side of the rectangle as a base. What are their heights, added together?', 'PAB and PCD together make exactly half of the rectangle, and so do PBC and PDA together.'],
    explain: 'The heights of PAB and PCD, measured from P to the sides AB and CD, add up to BC, the distance between those two sides, and both triangles have the base AB, so together they have area ½ × AB × BC = half the rectangle. In the same way PBC and PDA make up the other half. So PAB + PCD = PBC + PDA, that is 21 + 39 = 33 + PDA, and PDA = **27**. The rectangle has area 120 and P can be placed anywhere.',
    data: {
      answer: { num: 27 }, glyph: '⊡',
      traps: [{ match: 15, msg: 'Something went wrong with the opposite pairs: PAB is opposite PCD, and PBC is opposite PDA.' }, { match: 9, msg: 'Opposite triangles add up to half the rectangle; they do not have to be equal.' }],
      figure: (function () {
        const S = scene(480, 320, [-1, -1, 13, 11], 18);
        const A = [0, 0], B = [12, 0], C = [12, 10], D = [0, 10], P = [5.4, 3.5];
        chk('geo-rectangle-point', polyArea([P, A, B]), 21, 1e-9); chk('geo-rectangle-point', polyArea([P, B, C]), 33, 1e-9);
        chk('geo-rectangle-point', polyArea([P, C, D]), 39, 1e-9); chk('geo-rectangle-point', polyArea([P, D, A]), 27, 1e-9);
        S.poly([P, A, B], { fill: SB }); S.poly([P, B, C], { fill: SG }); S.poly([P, C, D], { fill: SR }); S.poly([P, D, A], { fill: SY });
        S.poly([A, B, C, D], { fill: null, sw: 2.6 });
        [A, B, C, D].forEach((p) => S.line(P, p, { sw: 1.8 }));
        S.dot(P, { r: 4 });
        S.text([(P[0] + A[0] + B[0]) / 3, (P[1] + A[1] + B[1]) / 3], '21', { size: 20, bold: true, fill: BLUE });
        S.text([(P[0] + B[0] + C[0]) / 3, (P[1] + B[1] + C[1]) / 3], '33', { size: 20, bold: true, fill: GREEN });
        S.text([(P[0] + C[0] + D[0]) / 3, (P[1] + C[1] + D[1]) / 3], '39', { size: 20, bold: true, fill: RED });
        S.text([(P[0] + D[0] + A[0]) / 3, (P[1] + D[1] + A[1]) / 3], '?', { size: 24, bold: true, fill: GOLD });
        S.names([A, B, C, D], ['A', 'B', 'C', 'D'], [6, 5], 15); S.name(P, 'P', 9, 12);
        return S.out();
      })()
    },
    concepts: ['area', 'symmetry'], links: ['geo-parallelogram-triangle']
  });

  puzzle({
    id: 'geo-similar-triangle-areas', title: 'The Small Triangle Under the Roof', diff: 2,
    text: 'In triangle ABC, a line DE parallel to the side BC cuts AB at D and AC at E, with AD = ⅓ AB. The whole triangle ABC has an area of **72 cm²**.\n\nWhat is the area of the small triangle ADE at the top?',
    hints: ['ADE is a small copy of ABC. By what factor are its lengths smaller?', 'When lengths shrink by a factor k, areas shrink by k².'],
    explain: 'Because DE is parallel to BC, triangle ADE is a copy of ABC with all lengths divided by 3. Areas are divided by 3 × 3 = 9: 72 ÷ 9 = **8 cm²**. (The trapezoid DBCE keeps the other 64.) The same holds for volumes with 3 × 3 × 3, which is why a cone filled to a third of its depth holds only 1/27 of its volume.',
    data: {
      answer: { num: 8, unit: 'cm²' }, glyph: '⌂',
      traps: [{ match: 24, msg: '24 is a third of 72, but areas shrink by the square of the ratio of the lengths.' }, { match: 64, msg: '64 is the area of the trapezoid DBCE left over. The question asks for the small triangle at the top.' }],
      figure: (function () {
        const S = scene(480, 300, [-1, -1, 13, 10.5], 20);
        const B = [0, 0], C = [12, 0], A = [5, 9], D = lerp(A, B, 1 / 3), E = lerp(A, C, 1 / 3);
        S.poly([A, B, C], { fill: SN });
        S.poly([A, D, E], { fill: SY });
        S.poly([A, B, C], { fill: null, sw: 2.6 }); S.line(D, E, { sw: 2.4 });
        S.dot(D, { r: 3.4 }); S.dot(E, { r: 3.4 });
        S.tick(A, D, 1); S.tick(D, B, 2);
        S.text([(A[0] + D[0] + E[0]) / 3, (A[1] + D[1] + E[1]) / 3], '?', { size: 22, bold: true, fill: RED });
        S.text([6, 1.4], '72 cm² in all', { size: 15, fill: GREY, halo: false });
        S.names([A, B, C], ['A', 'B', 'C'], [6, 3], 16); S.name(D, 'D', -15, 0); S.name(E, 'E', 15, 0);
        return S.out();
      })()
    },
    concepts: ['similarity', 'area'], links: ['geo-centroid-medians', 'geo-trapezoid-diagonals']
  });

  puzzle({
    id: 'geo-square-in-triangle', title: 'The Square in the Triangle', diff: 3,
    text: 'A triangle has a base of **30 cm** and a height of **20 cm**. A square is drawn inside it with one side lying along the base and the two top corners touching the other two sides.\n\nWhat is the side of the square?',
    hints: ['The part of the triangle above the square is a smaller copy of the whole triangle. Its base is the top side of the square.', 'Let the square have side s. The little triangle has height 20 − s and base s. Compare its height : base with the big one’s: 20 : 30.'],
    explain: 'The part of the triangle above the square is similar to the whole triangle (its base is parallel to the big base). Its height is 20 − s and its base is s, so (20 − s) ÷ s = 20 ÷ 30. Then 30(20 − s) = 20s, 600 = 50s and s = **12 cm**. Notice that the picture is not symmetrical: the result depends only on the base and the height, s = (base × height) ÷ (base + height).',
    data: {
      answer: { num: 12, unit: 'cm' }, glyph: '▣',
      traps: [{ match: 10, msg: 'That would be so if the triangle were 10 tall or 10 wide. Use the similar triangle above the square.' }, { match: 15, msg: '15 cm is half the base, but the square does not have to fit the middle of the base: it stops where its top corners touch the sides.' }],
      figure: (function () {
        const S = scene(500, 300, [-2, -3, 32, 22], 14);
        const B = [0, 0], C = [30, 0], A = [10, 20];
        const yy = 12, xl = A[0] * yy / A[1], xr = 30 - (30 - A[0]) * yy / A[1];
        chk('geo-square-in-triangle', xr - xl, 12, 1e-9); chk('geo-square-in-triangle', 30 * 20 / 50, 12);
        S.poly([A, B, C], { fill: SN });
        S.poly([[6, 0], [18, 0], [18, 12], [6, 12]], { fill: SY });
        S.poly([A, B, C], { fill: null, sw: 2.6 });
        S.line(A, [10, 0], { dash: '5 4', sw: 1.4 }); S.right([10, 0], A, C, 9);
        S.span(B, C, '30 cm', -18, {}); S.text([10, 12], '20 cm', { dx: 30, dy: 0, size: 15 });
        S.text([12, 6], '?', { size: 24, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['similarity'], links: ['geo-similar-triangle-areas']
  });

  puzzle({
    id: 'geo-incircle-right-triangle', title: 'The Circle in the Corner Triangle', diff: 2,
    text: 'A right triangle has legs **9 cm** and **12 cm**, and so a longest side of 15 cm. A circle is drawn inside it, touching all three sides.\n\nWhat is the radius of the circle?',
    hints: ['Look at the corner with the right angle. If the radius is r, how far is the circle’s touching point from the corner along each leg?', 'Two tangents from a point are equal. Along the longest side, the tangent lengths from the other two corners are 9 − r and 12 − r.'],
    explain: 'Near the right-angle corner the circle touches both legs, and the centre and the two touching points make a square of side r, so the touching points are r from the corner. The rest of the legs, 9 − r and 12 − r, are equal to the tangent lengths from the two other corners to the third touching point (two tangents from one point are equal), and those add up to the longest side: (9 − r) + (12 − r) = 15, so 21 − 2r = 15 and r = **3 cm**. In general r = (leg + leg − longest side) ÷ 2.',
    data: {
      answer: { num: 3, unit: 'cm' }, glyph: '⊙',
      traps: [{ match: 6, msg: 'That is the whole 21 − 15. The radius is half of it.' }, { match: 4.5, msg: 'That is half of the shorter leg. The circle touches the longest side too, which makes it smaller.' }],
      figure: (function () {
        const S = scene(480, 320, [-1.5, -1.5, 13.5, 10.5], 16);
        const C = [0, 0], B = [12, 0], A = [0, 9], I = [3, 3];
        chk('geo-incircle-right-triangle', polyArea([A, B, C]) * 2 / (9 + 12 + 15), 3, 1e-9);
        S.poly([A, B, C], { fill: SY });
        S.circ(I, 3, { fill: SB, sw: 2.2, stroke: BLUE });
        S.poly([A, B, C], { fill: null, sw: 2.6 });
        S.right(C, A, B, 11); S.dot(I, { r: 3 });
        S.text([6, 0], '12 cm', { dy: 18, size: 15 }); S.text([0, 4.5], '9 cm', { dx: -28, size: 15 }); S.dim(A, B, '15 cm', 20, { size: 15 });
        S.text(I, 'r = ?', { size: 15, fill: RED, bold: true, dx: 0, dy: 0 });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'pythagoras'], links: ['geo-tangential-quadrilateral', 'geo-incentre-angle']
  });

  puzzle({
    id: 'geo-tangential-quadrilateral', title: 'A Circle Inside a Four-Sided Field', diff: 3,
    source: 'Pitot’s theorem, published by the French engineer Henri Pitot in 1725.',
    text: 'A circle fits inside the four-sided figure ABCD and touches all four sides. The sides are AB = **7**, BC = **9** and CD = **11**.\n\nHow long is the fourth side DA?',
    hints: ['From each corner, the two tangents to the circle have equal lengths. Give them names: a from A, b from B, c from C and d from D.', 'Then AB = a + b, BC = b + c, CD = c + d and DA = d + a. Try adding two opposite sides.'],
    explain: 'Call the tangent lengths from the corners a, b, c and d (two tangents from one point are equal). Then AB + CD = (a + b) + (c + d) and BC + DA = (b + c) + (d + a): both sums are a + b + c + d. So in a figure with a circle inside, opposite sides add to the same total: 7 + 11 = 9 + DA, so DA = **9**.',
    data: {
      answer: { num: 9 }, glyph: '◈',
      traps: [{ match: 13, msg: 'Not quite: the circle makes the two pairs of opposite sides add up to the same total. What do 7 and 11 make together?' }, { match: 27, msg: 'That adds the three given sides. What the circle tells you is about *pairs* of opposite sides.' }],
      figure: (function () {
        const S = scene(480, 340, [-9, -9, 9, 9], 14);
        const t = [2, 5, 4, 7];   // tangent lengths from A, B, C, D
        const f = (r) => t.reduce((s, x) => s + Math.atan(x / r), 0) - Math.PI;
        let lo = 0.5, hi = 20; for (let i = 0; i < 100; i++) { const m = (lo + hi) / 2; if (f(m) > 0) lo = m; else hi = m; }
        const r = (lo + hi) / 2, half = t.map((x) => Math.atan(x / r) * DEG);
        // tangent points on AB at angle 0; B is at the angle half[1], C after the tangent point on BC ...
        const angB = half[1], angC = 2 * half[1] + half[2], angD = 2 * half[1] + 2 * half[2] + half[3], angA = -half[0];
        const V = [angA, angB, angC, angD].map((a, i) => polar([0, 0], Math.hypot(r, t[i]), a));
        const [A, B, C, D] = V;
        chk('geo-tangential-quadrilateral', dist(A, B), 7, 1e-6); chk('geo-tangential-quadrilateral', dist(B, C), 9, 1e-6);
        chk('geo-tangential-quadrilateral', dist(C, D), 11, 1e-6); chk('geo-tangential-quadrilateral', dist(D, A), 9, 1e-6);
        S.poly(V, { fill: SY });
        S.circ([0, 0], r, { fill: SB, stroke: BLUE, sw: 2.2 });
        S.poly(V, { fill: null, sw: 2.6 });
        V.forEach((p) => S.dot(p, { r: 3.6 }));
        S.names(V, ['A', 'B', 'C', 'D'], [0, 0], 16);
        S.dim(A, B, '7', 14, { size: 16 }); S.dim(B, C, '9', 14, { size: 16 }); S.dim(C, D, '11', 14, { size: 16 }); S.dim(D, A, '?', 14, { size: 20, fill: RED, bold: true });
        return S.out();
      })()
    },
    concepts: ['tangent-circles'], links: ['geo-incircle-right-triangle']
  });

  puzzle({
    id: 'geo-largest-triangle-square', title: 'The Biggest Triangle in a Square', diff: 3,
    text: 'What is the **largest area** that a triangle can have if it must fit completely inside a square of side **10 cm**?',
    hints: ['A good first try: put the base of the triangle along one side of the square. How tall can it be?', 'Could a triangle that is not lying on a side of the square do better? Think of the smallest rectangle, with sides parallel to the square, that contains the triangle.'],
    explain: 'Take a triangle with its base along a side of the square and its top corner anywhere on the opposite side: base 10, height 10, area ½ × 10 × 10 = 50. Can we beat that? Enclose the triangle in the smallest box with sides parallel to the square’s. The box touches the triangle on four sides, but the triangle has only three corners, so one corner of the triangle sits in a corner of the box. The rest of the box is then made of three right triangles whose total area is at least half of the box, so the triangle fills at most half of its box. The box lies inside the square, so the area cannot exceed half of 100. The maximum is **50 cm²**. An equilateral triangle, which people often try first, does worse: its area is at most about 46.4 cm² in the square.',
    data: {
      answer: { num: 50, unit: 'cm²' }, glyph: '◺',
      traps: [{ match: 43.3, msg: 'That is an equilateral triangle with side 10. A triangle does not have to be equilateral: a slimmer one does better.' }, { match: 100, msg: 'That is the area of the whole square, and a triangle covers only part of its box.' }, { match: 25, msg: 'You can do better than that: try a triangle with its base along one side of the square.' }],
      figure: (function () {
        const S = scene(400, 400, [-1, -1, 11, 11], 16);
        S.poly([[0, 0], [10, 0], [10, 10], [0, 10]], { fill: SN, sw: 2.6 });
        S.poly([[0, 0], [10, 0], [6, 10]], { fill: null, stroke: GREY, sw: 1.6, dash: '5 5' });
        S.text([5, 0], '10 cm', { dy: 20, size: 15 });
        S.text([5, 5], 'biggest triangle?', { size: 17, it: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['area', 'optimisation'], links: ['geo-fence-wall', 'geo-nested-squares']
  });

  puzzle({
    id: 'geo-parallelogram-triangle', title: 'A Triangle on a Parallelogram', diff: 2,
    text: 'ABCD is a parallelogram with an area of **48 cm²**. The point E can be anywhere on the side CD, and it is joined to A and B.\n\nWhat is the area of triangle ABE?',
    hints: ['Take AB as the base of the triangle. What is the height of E above AB?', 'The parallelogram has the same base AB and the same height. Compare them.'],
    explain: 'Take AB as base. E lies on the side CD, which is parallel to AB, so the height of the triangle is the same as the height of the whole parallelogram, wherever E is placed. A triangle with the same base and the same height as a parallelogram has half its area: **24 cm²**.',
    data: {
      answer: { num: 24, unit: 'cm²' }, glyph: '▱',
      traps: [{ match: 48, msg: '48 is the whole parallelogram. A triangle on the same base and height is only half of it.' }],
      figure: (function () {
        const S = scene(480, 260, [-1, -1.6, 14.5, 6.5], 20);
        const A = [0, 0], B = [10, 0], C = [13, 4.8], D = [3, 4.8], E = [8.5, 4.8];
        chk('geo-parallelogram-triangle', polyArea([A, B, E]), 24, 1e-9); chk('geo-parallelogram-triangle', polyArea([A, B, C, D]), 48, 1e-9);
        S.poly([A, B, C, D], { fill: SN });
        S.poly([A, B, E], { fill: SY });
        S.poly([A, B, C, D], { fill: null, sw: 2.6 });
        [5.5, 10.3].forEach((x) => S.dot([x, 4.8], { r: 3, fill: '#fff', stroke: INK }));
        S.dot(E, { r: 4.2, fill: RED });
        S.names([A, B, C, D], ['A', 'B', 'C', 'D'], [6.5, 2.4], 16); S.name(E, 'E', 0, -16, { fill: RED });
        S.text([6.5, 1.6], '?', { size: 24, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['area'], links: ['geo-rectangle-point']
  });


  /* =====================  SOLIDS  ===================== */

  // the flat cut n·p = d through the cube [0, s]³, as an ordered polygon of 3D points
  function cubeSection(n, d, s) {
    const C = [[0, 0, 0], [s, 0, 0], [s, s, 0], [0, s, 0], [0, 0, s], [s, 0, s], [s, s, s], [0, s, s]];
    const E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    const f = (p) => n[0] * p[0] + n[1] * p[1] + n[2] * p[2] - d;
    const V = [];
    E.forEach(([i, j]) => {
      const a = C[i], b = C[j], fa = f(a), fb = f(b);
      if (fa * fb < 0) { const t = fa / (fa - fb); V.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]); }
    });
    const c = V.reduce((q, p) => [q[0] + p[0] / V.length, q[1] + p[1] / V.length, q[2] + p[2] / V.length], [0, 0, 0]);
    const nn = Math.hypot(n[0], n[1], n[2]), nu = n.map((x) => x / nn);
    const e1 = Math.abs(nu[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    let u = [nu[1] * e1[2] - nu[2] * e1[1], nu[2] * e1[0] - nu[0] * e1[2], nu[0] * e1[1] - nu[1] * e1[0]];
    const ul = Math.hypot(u[0], u[1], u[2]); u = u.map((x) => x / ul);
    const w = [nu[1] * u[2] - nu[2] * u[1], nu[2] * u[0] - nu[0] * u[2], nu[0] * u[1] - nu[1] * u[0]];
    const ang = (p) => { const q = [p[0] - c[0], p[1] - c[1], p[2] - c[2]]; return Math.atan2(q[0] * w[0] + q[1] * w[1] + q[2] * w[2], q[0] * u[0] + q[1] * u[1] + q[2] * u[2]); };
    return V.sort((a, b) => ang(a) - ang(b));
  }
  const d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

  puzzle({
    id: 'geo-napkin-ring', title: 'The Napkin Ring', diff: 4,
    source: 'A classic puzzle of solid geometry, known as the “napkin ring problem”.',
    text: 'A round ball has a cylindrical hole drilled straight through its centre, and what is left is a ring, like a napkin ring. The finished ring is **6 cm tall** (the length of the hole).\n\nYou are **not told** how big the ball was. What is the volume of the ring, as a multiple of π (in cm³)?',
    hints: ['If the answer does not depend on the size of the ball, you may choose the size of the ball to suit yourself. What is the simplest ball that leaves a ring 6 cm tall?', 'Take a ball of radius exactly 3 cm and a hole so thin that it is a needle. Then the “ring” is the whole ball.'],
    explain: 'The puzzle only makes sense if the answer is the same for every ball, so try the easiest case: a ball of radius 3 cm and a hole with almost no width. The ring is then the whole ball, of volume 4/3 × π × 3³ = **36π ≈ 113 cm³**. And it is true in general: cut both solids into thin slices at height y above the middle. The slice of the ring is an annulus of area π(R² − y²) − π(R² − 9) = π(9 − y²), and a slice of a ball of radius 3 has area π(3² − y²): the same. Equal slices at every height mean equal volumes (Cavalieri’s principle). A fat ball with a wide hole and a small ball with a thin hole leave rings of equal volume, provided the rings are equally tall.',
    data: {
      answer: { num: 36 }, ask: 'Volume = ? × π. Give the number in front of π.', glyph: '💍',
      traps: [{ match: 288, msg: '288 = 4/3 × 216 is the volume of a ball of radius 6, but the ring is 6 cm tall, and the ball of the same volume has a *diameter* of 6.' }, { match: 27, msg: '27 is 3³. The volume of a ball needs the factor 4/3 as well.' }],
      figure: (function () {
        const S = scene(440, 340, [-6.4, -6.2, 6.4, 6.2], 12);
        const R = 5, h = 3, x = Math.sqrt(R * R - h * h);
        let vol = 0;   // the ring, slice by slice (a ring 6 tall): the same volume as a ball 6 across, whatever R is
        for (let i = 0; i < 6000; i++) { const y = -h + (i + 0.5) * (2 * h / 6000); vol += Math.PI * ((R * R - y * y) - x * x) * (2 * h / 6000); }
        chk('geo-napkin-ring', vol / Math.PI, 36, 1e-4);
        // the sphere (dashed), the ring (shaded), the hole
        S.circ([0, 0], R, { fill: '#f7f2e4', stroke: GREY, sw: 1.4, dash: '5 4' });
        S.path(S.M([x, -h]) + S.L([x, h]) + S.A(R, [x, -h], 0, false) + 'Z', { fill: SY, sw: 2.4 });
        S.path(S.M([-x, -h]) + S.L([-x, h]) + S.A(R, [-x, -h], 0, true) + 'Z', { fill: SY, sw: 2.4 });
        S.line([-6, h], [6, h], { stroke: GREY, sw: 1.2, dash: '3 4' }); S.line([-6, -h], [6, -h], { stroke: GREY, sw: 1.2, dash: '3 4' });
        S.span([5.9, -h], [5.9, h], '6 cm', -18, { });
        S.text([0, 0], 'hole', { size: 15, it: true, fill: GREY, halo: false });
        S.text([0, -5.7], 'section through the axis: not to scale', { size: 13, it: true, fill: GREY, halo: false });
        return S.out();
      })()
    },
    concepts: ['solids', 'symmetry'], links: ['geo-sphere-in-cylinder', 'geo-archimedes-solids']
  });

  puzzle({
    id: 'geo-sphere-in-cylinder', title: 'The Ball in the Can', diff: 2,
    source: 'Archimedes, On the Sphere and the Cylinder (about 225 BC): the result he wished to be carved on his tomb.',
    text: 'A ball fits snugly inside a can: it touches the sides, the lid and the bottom. The can holds **300 cm³** when full.\n\nWhat is the volume of the ball?',
    hints: ['If the ball has radius r, how tall is the can, and how wide?', 'The can has volume π r² × 2r = 2π r³. The ball has volume 4/3 π r³. Compare.'],
    explain: 'With radius r the can is 2r tall and has a base of area π r², so its volume is 2π r³. The ball’s volume is 4/3 π r³. So the ball is (4/3) ÷ 2 = **two thirds** of the can, whatever r is: 300 × 2/3 = **200 cm³**. Archimedes proved that the same ratio holds for the curved surfaces (ball against can without its lid and base), and asked for the picture of a ball in a can to be put on his gravestone.',
    data: {
      answer: { num: 200, unit: 'cm³' }, glyph: '🥫',
      traps: [{ match: 150, msg: 'The ball is more than half of the can. The exact fraction is a famous one: two thirds.' }, { match: 100, msg: 'The ball is more than a third of the can: a cone would be a third of it.' }],
      figure: (function () {
        const S = scene(360, 340, [-6.5, -1.6, 6.5, 12], 12);
        const r = 5;
        S.poly([[-r, 0], [r, 0], [r, 2 * r], [-r, 2 * r]], { fill: '#eee6cc' });
        S.ell([0, 0], r, 1.1, { fill: '#e3d9b8', sw: 1.8 }); S.poly([[-r, 0], [r, 0], [r, 2 * r], [-r, 2 * r]], { fill: null, sw: 2.4 });
        S.ell([0, 2 * r], r, 1.1, { fill: '#f3ecd3', sw: 2 });
        S.circ([0, r], r, { fill: SB, stroke: BLUE, sw: 2.4, op: 0.92 });
        S.text([0, r], 'ball', { size: 17, it: true, fill: BLUE, halo: false });
        S.text([r + 1.4, r], '2r', { size: 16, it: true, halo: false });
        return S.out();
      })()
    },
    concepts: ['solids'], links: ['geo-archimedes-solids', 'geo-napkin-ring']
  });

  puzzle({
    id: 'geo-archimedes-solids', title: 'Cone, Ball and Cylinder', diff: 3,
    source: 'Archimedes, third century BC.',
    text: 'A cone, a ball and a cylinder all have the same width and the same height, which is the width of the ball. The cone’s point is at the top, the cylinder is as wide as the ball and as tall as the ball is wide.\n\nThe cone has a volume of **12 cm³**. What is the volume of the cylinder?',
    hints: ['Take the radius as 1 and work out the three volumes: cone ⅓ π r² h, ball 4/3 π r³, cylinder π r² h, with h = 2r.', 'In units of 2π r³ ÷ 3, what are the three volumes?'],
    explain: 'With radius r and height 2r, the cone has ⅓ π r² × 2r = ⅔ π r³, the ball 4/3 π r³ and the cylinder π r² × 2r = 2π r³. In units of ⅔ π r³ they are **1 : 2 : 3**. So if the cone holds 12, the ball holds 24 and the cylinder **36 cm³**. Archimedes found ratios like these by imagining the solids cut into thin slices and balanced on a lever.',
    data: {
      answer: { num: 36, unit: 'cm³' }, glyph: '▲●▮',
      traps: [{ match: 24, msg: '24 is the volume of the ball, the middle one. The cylinder is the largest of the three.' }, { match: 48, msg: 'That is four times the cone: the cylinder has three times the cone’s volume.' }],
      figure: (function () {
        const S = scene(520, 260, [-3, -1.2, 12.5, 5.2], 14);
        const r = 1.5, y0 = 0;
        // cone
        S.ell([0, y0], r, 0.35, { fill: '#e6dcb9', sw: 1.6 });
        S.poly([[-r, y0], [r, y0], [0, y0 + 2 * r]], { fill: SR, sw: 2.2 });
        S.ell([0, y0], r, 0.35, { fill: null, sw: 1.6 });
        // ball
        S.circ([4.6, y0 + r], r, { fill: SB, stroke: BLUE, sw: 2.2 }); S.ell([4.6, y0 + r], r, 0.35, { fill: null, sw: 1.2, stroke: BLUE, dash: '4 3' });
        // cylinder
        const cx = 9.2;
        S.poly([[cx - r, y0], [cx + r, y0], [cx + r, y0 + 2 * r], [cx - r, y0 + 2 * r]], { fill: SG });
        S.ell([cx, y0], r, 0.35, { fill: '#cfe0b9', sw: 1.8 }); S.poly([[cx - r, y0], [cx + r, y0], [cx + r, y0 + 2 * r], [cx - r, y0 + 2 * r]], { fill: null, sw: 2.2 });
        S.ell([cx, y0 + 2 * r], r, 0.35, { fill: '#e7f1d6', sw: 2 });
        S.text([0, y0 - 0.9], 'cone 12 cm³', { size: 15, halo: false }); S.text([4.6, y0 - 0.9], 'ball', { size: 15, halo: false }); S.text([cx, y0 - 0.9], 'cylinder ?', { size: 15, fill: RED, bold: true, halo: false });
        return S.out();
      })()
    },
    concepts: ['solids'], links: ['geo-sphere-in-cylinder', 'geo-cone-half-water']
  });

  puzzle({
    id: 'geo-cone-half-water', title: 'A Glass Half Full', diff: 3,
    text: 'A conical glass stands on its point. It is filled with water up to **exactly half of its depth**.\n\nWhat fraction of the glass’s full capacity is the water?',
    hints: ['The water itself forms a cone, a smaller copy of the glass. By what factor are its lengths smaller?', 'When lengths shrink by a factor k, areas shrink by k² and volumes by k³.'],
    explain: 'The water is a cone that is a miniature copy of the glass, with every length halved. Volumes scale with the cube of the length, so the water holds (½)³ = **⅛** of the glass. A cone-shaped glass filled “halfway up” is only one-eighth full: the level is a poor guide to the amount.',
    data: {
      answer: { num: 0.125, show: '1/8' }, glyph: '🍸',
      traps: [{ match: 0.5, msg: 'It looks half full, but volume is not the same as depth. The water is a small cone.' }, { match: 0.25, msg: 'That would be so for areas. A cone’s volume scales with the cube of its size.' }],
      figure: (function () {
        const S = scene(380, 320, [-5.5, -1.6, 5.5, 9.4], 14);
        const H = 8, w = 4;
        S.poly([[0, 0], [w, H], [-w, H]], { fill: '#f4efe0', sw: 2.6 });
        S.poly([[0, 0], [w / 2, H / 2], [-w / 2, H / 2]], { fill: SB, sw: 1.8, stroke: BLUE });
        S.ell([0, H], w, 0.45, { fill: null, sw: 2.2 });
        S.line([w + 0.6, 0], [w + 0.6, H / 2], { stroke: GREY, sw: 1.2 });
        S.text([0, 2], 'water', { size: 15, it: true, fill: BLUE, halo: false });
        S.text([-1.7, H / 4], 'half the depth', { size: 13, it: true, fill: GREY, halo: false, anchor: 'end' });
        return S.out();
      })()
    },
    concepts: ['similarity', 'solids'], links: ['geo-archimedes-solids', 'geo-similar-triangle-areas']
  });

  puzzle({
    id: 'geo-cube-hexagon', title: 'The Six-Sided Cut', diff: 4,
    text: 'A cube of edge **10 cm** is sliced by a flat plane that passes through the midpoints of six of its edges (the plane goes through the centre of the cube, and the cut surface is a regular hexagon).\n\nHow long is one side of the hexagon? Give it to two decimal places.',
    hints: ['Look at one face of the cube. The cut crosses it along a straight line: between which two points?', 'On each face, the cut joins the midpoints of two neighbouring edges: it is the diagonal of a small square of side 5 cm.'],
    explain: 'On each face the cut runs from the midpoint of one edge to the midpoint of a neighbouring edge, cutting off a corner of the face. That is the hypotenuse of a right triangle with both legs 5 cm, so each side of the hexagon is 5√2 ≈ **7.07 cm**. All six sides are equal, and the plane cuts the cube symmetrically about its centre, so the hexagon is regular; its area is 3√3/2 × 50 ≈ 129.9 cm².',
    data: {
      answer: { num: 7.0711, tol: 0.005, unit: 'cm', show: '7.07' }, glyph: '⬡',
      traps: [{ match: 5, msg: '5 cm is the distance from a corner to the midpoint of an edge. The side of the cut runs across a face.' }, { match: 10, msg: '10 cm is the edge of the cube. The side of the cut is shorter than the diagonal of a face, which is 14.14.' }],
      figure: (function () {
        const S = scene(440, 380, [-8.2, -9, 8.2, 9], 12);
        const s = 10, HEX = cubeSection([1, 1, 1], 15, s);
        chk('geo-cube-hexagon', HEX.length, 6);
        HEX.forEach((p, i) => chk('geo-cube-hexagon', d3(p, HEX[(i + 1) % 6]), 5 * Math.SQRT2, 1e-9));
        // looking along the long diagonal of the cube: the cube shows as a hexagon and the cut as a regular hexagon
        const ISO = (p) => [(p[0] - p[2]) / Math.SQRT2, (-p[0] + 2 * p[1] - p[2]) / Math.sqrt(6)];
        const F = [[[s, 0, 0], [s, s, 0], [s, s, s], [s, 0, s]], [[0, s, 0], [s, s, 0], [s, s, s], [0, s, s]], [[0, 0, s], [s, 0, s], [s, s, s], [0, s, s]]];
        const hid = { dash: '5 4', stroke: GREY, sw: 1.6 };
        [[s, 0, 0], [0, s, 0], [0, 0, s]].forEach((p) => S.line(ISO([0, 0, 0]), ISO(p), hid));
        [SY, SN, '#e4d6a2'].forEach((c, i) => S.poly(F[i].map(ISO), { fill: c, sw: 2.2 }));
        S.poly(HEX.map(ISO), { fill: SR, stroke: RED, sw: 2.8, op: 0.92 });
        S.dim(ISO(HEX[0]), ISO(HEX[1]), '?', 14, { size: 22, fill: RED, bold: true });
        S.text(ISO([s, s, s]), 'edge 10 cm', { dy: 32, size: 15 });
        return S.out();
      })()
    },
    concepts: ['solids', 'symmetry', 'projection'], links: ['geo-cube-cuts', 'geo-ant-cube']
  });

  puzzle({
    id: 'geo-cube-cuts', title: 'How Many Sides Can a Cut Have?', diff: 3,
    text: 'You slice through a solid wooden cube with one flat cut, in any position and at any angle. The face of the cut, where the wood was sliced, is a polygon. The picture shows a cut with three sides (a corner sliced off) and one with five.\n\nWhat is the **largest number of sides** this polygon can have?',
    hints: ['Each side of the cut is where the plane crosses one face of the cube. How many faces does a cube have?', 'A plane crosses a face along one straight segment at most, so the number of sides is at most the number of faces. Can it really cross all six of them?'],
    explain: 'Every side of the cut lies in one face of the cube, and a plane meets a face in at most one segment, so the cut has at most **6** sides (a cube has six faces). And 6 is possible: a plane through the centre, perpendicular to a long diagonal of the cube, cuts all six faces and makes a regular hexagon. Slicing off a corner gives 3 sides, cutting parallel to a face gives 4, and slanting the cut a little more gives 5.',
    data: {
      answer: { choice: 3, choices: ['3', '4', '5', '6', '7', '8'] }, glyph: '⬢',
      traps: [{ match: 1, msg: 'Four is what you get by cutting parallel to a face. A slanted cut can cross more faces.' }, { match: 2, msg: 'The picture already shows five. Can the plane be tilted to cross the sixth face too?' }, { match: 4, msg: 'A cube has only six faces, and a flat cut crosses each face in at most one straight line.' }, { match: 5, msg: 'A cube has only six faces, and a flat cut crosses each face in at most one straight line.' }],
      figure: (function () {
        const S = scene(520, 260, [-1, -1, 31, 13], 12);
        const s = 10;
        const tri = cubeSection([1, 1, 1], 25, s), pent = cubeSection([1, 2, 3], 25, s);
        chk('geo-cube-cuts', tri.length, 3); chk('geo-cube-cuts', pent.length, 5);
        box3(S, s, s, s, { clear: true });
        S.poly(tri.map((p) => OB(p[0], p[1], p[2])), { fill: SR, stroke: RED, sw: 2.4, op: 0.9 });
        // second cube, moved to the right by 16 units (the drawing is shifted, not the numbers)
        const sh = (q) => [q[0] + 16, q[1]];
        const o = OB;
        const a = sh(o(0, 0, 0)), b = sh(o(s, 0, 0)), c = sh(o(s, s, 0)), dd = sh(o(0, s, 0)), e = sh(o(0, 0, s)), f = sh(o(s, 0, s)), g = sh(o(s, s, s)), hh = sh(o(0, s, s));
        const hid = { dash: '5 4', stroke: GREY, sw: 1.6 };
        S.line(e, f, hid); S.line(e, hh, hid); S.line(e, a, hid);
        S.poly([a, b, c, dd], { fill: null }); S.poly([dd, c, g, hh], { fill: null }); S.poly([b, f, g, c], { fill: null });
        S.poly(pent.map((p) => sh(o(p[0], p[1], p[2]))), { fill: SG, stroke: GREEN, sw: 2.4, op: 0.9 });
        S.text([5, -0.6], '3 sides', { dy: 14, size: 15, halo: false }); S.text([21, -0.6], '5 sides', { dy: 14, size: 15, halo: false });
        return S.out();
      })()
    },
    concepts: ['solids', 'projection'], links: ['geo-cube-hexagon']
  });

  puzzle({
    id: 'geo-ball-in-corner', title: 'The Ball in the Corner of the Room', diff: 4,
    text: 'A ball of radius **10 cm** rests in the corner of a room, where the floor meets two walls. It touches the floor and both walls.\n\nHow far is the **corner** of the room, the single point where floor and the two walls meet, from the nearest point of the ball? Give it to two decimal places.',
    hints: ['Put the corner at the origin, with the floor and walls along the three coordinate planes. Where is the centre of the ball?', 'The centre is 10 cm from each of the three surfaces: at (10, 10, 10). Its distance from the corner is then √(10² + 10² + 10²).'],
    explain: 'The centre of the ball is 10 cm from the floor and from each wall: it sits at (10, 10, 10) if the corner is the origin. Its distance from the corner is √300 = 10√3 ≈ 17.32 cm. The nearest point of the ball to the corner lies on the line to the centre, one radius before it: 17.32 − 10 = 10(√3 − 1) ≈ **7.32 cm**. (The ball touches the walls and floor at points that are 10 cm from the corner along each surface, but they are not the nearest points to the corner.)',
    data: {
      answer: { num: 7.3205, tol: 0.005, unit: 'cm', show: '7.32' }, glyph: '⚽',
      traps: [{ match: 17.32, msg: '17.32 is the distance to the centre of the ball. The nearest point of the ball is one radius nearer.' }, { match: 10, msg: '10 cm is how far the touching points are from the corner, along the surfaces, but the ball’s nearest point to the corner is elsewhere, inside the room.' }],
      figure: (function () {
        const S = scene(480, 400, [-2, -3, 44, 41], 10);
        const W = 30, H = 30, Z = 30, r = 10;
        const P = (x, y, z) => OB(x, y, z);
        const cen = [r, r, Z - r], cor = [0, 0, Z];
        chk('geo-ball-in-corner', d3(cen, cor) - r, 10 * (Math.sqrt(3) - 1), 1e-9);
        S.poly([P(0, 0, 0), P(W, 0, 0), P(W, 0, Z), P(0, 0, Z)], { fill: '#e9dfc0' });
        S.poly([P(0, 0, 0), P(0, H, 0), P(0, H, Z), P(0, 0, Z)], { fill: '#e4ebf2' });
        S.poly([P(0, 0, Z), P(W, 0, Z), P(W, H, Z), P(0, H, Z)], { fill: '#f1ead4' });
        S.circ(P(cen[0], cen[1], cen[2]), r, { fill: 'rgba(176,71,47,0.55)', stroke: RED, sw: 2.6 });
        S.line(P(cor[0], cor[1], cor[2]), P(cen[0], cen[1], cen[2]), { stroke: INK, sw: 1.8, dash: '5 4' });
        S.dot(P(cor[0], cor[1], cor[2]), { r: 4.6 });
        S.text(P(cor[0], cor[1], cor[2]), 'corner', { dx: -6, dy: 20, size: 16, it: true });
        S.text(P(cen[0], cen[1], cen[2]), 'r = 10 cm', { size: 15, fill: INK, bold: true, halo: false, dy: 5 });
        return S.out();
      })()
    },
    concepts: ['solids', 'pythagoras', 'projection'], links: ['geo-box-diagonal']
  });

  puzzle({
    id: 'geo-tube-balls', title: 'Three Balls in a Tube', diff: 2,
    text: 'Three tennis balls just fit, one above the other, in a tube that is as wide as a ball (they touch the sides, the base and the lid).\n\nWhich is longer: the **height** of the tube, or the **distance round** it, measured with a tape around the middle?',
    hints: ['Give the ball a diameter d. What is the height of the tube in terms of d?', 'The distance round is the circumference of a circle of diameter d. What is the value of π?'],
    explain: 'If a ball has diameter d, the tube is 3d tall. The distance round it is π × d, and π is about 3.14, so the distance round is a little **longer** than the height — by about 5 %. Most people, looking at the tall tube, are sure that the height wins: the eye is bad at comparing a vertical line with a curve.',
    data: {
      answer: { choice: 1, choices: ['the height of the tube', 'the distance round the tube', 'they are exactly equal'] }, glyph: '🎾',
      traps: [{ match: 0, msg: 'The tube looks taller, but count in ball-widths: 3d for the height, πd for the way round.' }, { match: 2, msg: 'They would be equal only if π were exactly 3.' }],
      figure: (function () {
        const S = scene(380, 400, [-4, -1.2, 4, 12.5], 12);
        const r = 2;
        S.poly([[-r, 0], [r, 0], [r, 12], [-r, 12]], { fill: '#eee6cc' });
        S.ell([0, 0], r, 0.5, { fill: '#e3d9b8', sw: 1.8 });
        S.poly([[-r, 0], [r, 0], [r, 12], [-r, 12]], { fill: null, sw: 2.4 });
        [1, 3, 5].forEach((k) => { S.circ([0, k * r * 1], r, { fill: '#e4ee9c', stroke: GREEN, sw: 2 }); });
        S.ell([0, 12], r, 0.5, { fill: '#f6f0dc', sw: 2 });
        S.span([r + 0.9, 0], [r + 0.9, 12], 'height', -6, { size: 14 });
        S.ell([0, 6], r, 0.5, { fill: null, stroke: RED, sw: 2.6 });
        S.text([0, 6], 'round?', { dy: 30, size: 14, fill: RED, it: true });
        return S.out();
      })()
    },
    concepts: ['solids', 'area'], links: ['geo-sphere-in-cylinder']
  });


  /* =====================  POINTS ON A GRID  ===================== */

  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  // the numbers of a lattice polygon: area, points on the boundary, points strictly inside (counted, not computed from Pick)
  function latticeCount(P) {
    let B = 0;
    for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; B += gcd(p[0] - q[0], p[1] - q[1]); }
    const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]);
    let I = 0;
    for (let x = Math.min.apply(null, xs); x <= Math.max.apply(null, xs); x++) for (let y = Math.min.apply(null, ys); y <= Math.max.apply(null, ys); y++) {
      let inside = false, onEdge = false;
      for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
        const a = P[i], b = P[j];
        if ((b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]) === 0 && x >= Math.min(a[0], b[0]) && x <= Math.max(a[0], b[0]) && y >= Math.min(a[1], b[1]) && y <= Math.max(a[1], b[1])) onEdge = true;
        if ((a[1] > y) !== (b[1] > y) && x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
      }
      if (inside && !onEdge) I++;
    }
    return { A: polyArea(P), B, I };
  }

  function boundaryPts(P) {
    const out = [];
    for (let i = 0; i < P.length; i++) {
      const p = P[i], q = P[(i + 1) % P.length], g = gcd(q[0] - p[0], q[1] - p[1]);
      for (let k = 0; k < g; k++) out.push([p[0] + (q[0] - p[0]) * k / g, p[1] + (q[1] - p[1]) * k / g]);
    }
    return out;
  }

  puzzle({
    id: 'geo-pick-area', title: 'Counting Instead of Measuring', diff: 2,
    source: 'Pick’s theorem, found by the Austrian mathematician Georg Pick in 1899.',
    text: 'The corners of this polygon are on the points of a square grid, each little square having area 1. Counting shows **27** grid points strictly inside the polygon and **6** on its edges (the corners included).\n\nWhat is the **area** of the polygon?',
    hints: ['You could split the polygon into triangles and rectangles on the grid, but there is a formula that only needs the two numbers you were given.', 'Pick’s formula: area = (points inside) + ½ × (points on the boundary) − 1. Try it first on a single grid square: 0 inside, 4 on the boundary.'],
    explain: 'Pick’s theorem: for a polygon with corners on grid points, area = I + B ÷ 2 − 1, where I counts the grid points inside and B those on the boundary. Here I = 27 and B = 6, so the area is 27 + 3 − 1 = **29**. (Check with a single unit square: 0 + 4 ÷ 2 − 1 = 1.) The formula also works the other way round: if you know the area and one count, you get the other.',
    data: {
      answer: { num: 29 }, glyph: '⣿',
      traps: [{ match: 30, msg: 'Nearly: the formula has a “−1” at the end.' }, { match: 33, msg: 'Points on the boundary count only half each, and there is a −1 at the end.' }, { match: 27, msg: '27 is the number of points inside. The boundary contributes a little area as well.' }],
      figure: (function () {
        const S = scene(480, 380, [-1, -1, 9.5, 7.6], 14);
        const P = [[1, 0], [6, 1], [8, 4], [4, 6], [0, 3]], c = latticeCount(P);
        chk('geo-pick-area', c.I, 27); chk('geo-pick-area', c.B, 6); chk('geo-pick-area', c.A, 29, 1e-9);
        S.grid(0, 0, 9, 7, 1);
        S.poly(P, { fill: SY, sw: 2.6 });
        S.lattice(0, 0, 9, 7, { r: 2.4 });
        boundaryPts(P).forEach((p) => S.dot(p, { r: 4.2, fill: RED }));
        return S.out();
      })()
    },
    concepts: ['lattice-geometry', 'area'], links: ['geo-pick-inside', 'geo-lattice-tilted-square']
  });

  puzzle({
    id: 'geo-pick-inside', title: 'How Many Points Inside?', diff: 3,
    source: 'Pick’s theorem (1899).',
    text: 'A polygon has its corners on the points of a square grid (each little square has area 1). Its area is **19.5** and exactly **9** grid points lie on its edges, corners included.\n\nHow many grid points lie **strictly inside** it?',
    hints: ['Pick’s formula connects the area A, the points inside I and the points on the boundary B.', 'A = I + B ÷ 2 − 1. Put in A = 19.5 and B = 9, and solve for I.'],
    explain: 'By Pick’s theorem A = I + B ÷ 2 − 1. With A = 19.5 and B = 9: 19.5 = I + 4.5 − 1, so I = 19.5 − 3.5 = **16**. You can check it in the picture: the polygon really has 16 grid points inside, and 9 on its edge. Counting 16 points directly is easy on a small polygon, and the formula makes it just as easy on a huge one.',
    data: {
      answer: { num: 16 }, glyph: '⣶',
      traps: [{ match: 15, msg: 'You may have forgotten the “−1” in the formula A = I + B ÷ 2 − 1.' }],
      figure: (function () {
        const S = scene(440, 400, [-1, -1, 8, 8], 14);
        const P = [[0, 5], [2, 0], [6, 4], [4, 6], [3, 6]], c = latticeCount(P);
        chk('geo-pick-inside', c.I, 16); chk('geo-pick-inside', c.B, 9); chk('geo-pick-inside', c.A, 19.5, 1e-9);
        S.grid(0, 0, 7, 7, 1);
        S.poly(P, { fill: SY, sw: 2.6 });
        S.lattice(0, 0, 7, 7, { r: 2.4 });
        return S.out();
      })()
    },
    concepts: ['lattice-geometry', 'area'], links: ['geo-pick-area', 'geo-empty-triangle']
  });

  puzzle({
    id: 'geo-lattice-tilted-square', title: 'The Tilted Square on the Grid', diff: 2,
    text: 'A square is drawn on a square grid with its corners on grid points, but its sides are not parallel to the grid lines: each side goes 3 squares across and 2 squares up (or the like), as in the picture.\n\nWhat is the area of the tilted square, in grid squares?',
    hints: ['Draw the smallest ordinary square around the tilted one. What is left in its four corners?', 'The big square has side 5, so area 25. The four corners are right triangles with legs 3 and 2.'],
    explain: 'The tilted square fits inside an ordinary square of side 3 + 2 = 5 (area 25) that touches its four corners. What is left over are four right triangles with legs 3 and 2, each of area ½ × 3 × 2 = 3, together 12. So the tilted square has area 25 − 12 = **13**. That is also 3² + 2², the square of its side by Pythagoras.',
    data: {
      answer: { num: 13 }, glyph: '◇',
      traps: [{ match: 25, msg: '25 is the area of the surrounding big square. Take away the four corner triangles.' }, { match: 12, msg: 'That is the total of the four corner triangles: what is *not* in the tilted square.' }],
      figure: (function () {
        const S = scene(420, 400, [-1, -1, 6, 6], 14);
        const P = [[2, 0], [5, 2], [3, 5], [0, 3]];
        chk('geo-lattice-tilted-square', polyArea(P), 13, 1e-9);
        S.grid(0, 0, 5, 5, 1);
        S.poly(P, { fill: SY, sw: 2.6 });
        S.lattice(0, 0, 5, 5, { r: 2.6 });
        P.forEach((p) => S.dot(p, { r: 4.4, fill: RED }));
        S.text([2.5, 2.5], '?', { size: 30, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['lattice-geometry', 'pythagoras', 'dissection'], links: ['geo-pick-area', 'geo-lattice-regular']
  });

  puzzle({
    id: 'geo-diagonal-squares', title: 'The Diagonal Across the Paper', diff: 3,
    text: 'A rectangle 9 squares wide and 6 squares high is drawn on squared paper, and its diagonal is drawn from one corner to the opposite one.\n\nHow many of the little squares does the diagonal pass through (crossing the inside of the square, not just touching a corner)?',
    hints: ['Count the vertical grid lines the diagonal crosses, and the horizontal ones. Each crossing takes the diagonal into a new square.', 'The diagonal crosses 8 vertical and 5 horizontal grid lines, but sometimes it crosses both at once: through a grid point. How many grid points does it pass through inside the rectangle?'],
    explain: 'Each time the diagonal crosses a grid line it enters a new square. It crosses 9 − 1 = 8 vertical lines and 6 − 1 = 5 horizontal lines, so 13 crossings, and it starts in one square: 14 squares — except that at a grid point it crosses two lines at once and enters only one new square. The diagonal goes through gcd(9, 6) − 1 = 2 such points inside the rectangle, so the count is 1 + 13 − 2 = **12**. In general a w × h rectangle has w + h − gcd(w, h) squares crossed.',
    data: {
      answer: { num: 12 }, glyph: '▨',
      traps: [{ match: 14, msg: 'That counts every crossing as a new square. At a grid point the diagonal crosses two lines at the same moment.' }, { match: 15, msg: 'Nearly, but 9 + 6 counts the corner squares twice and ignores the grid points on the way. Try w + h − gcd(w, h).' }],
      figure: (function () {
        const S = scene(520, 360, [-0.6, -0.6, 9.6, 6.6], 14);
        let n = 0;
        const f = (x, y) => 6 * x - 9 * y;
        for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) {
          const v = [f(i, j), f(i + 1, j), f(i, j + 1), f(i + 1, j + 1)];
          if (Math.min.apply(null, v) < 0 && Math.max.apply(null, v) > 0) { n++; S.poly([[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], { fill: SY, stroke: null }); }
        }
        chk('geo-diagonal-squares', n, 12);
        S.grid(0, 0, 9, 6, 1, { stroke: '#cbbf9f' });
        S.line([0, 0], [9, 6], { stroke: RED, sw: 3.2 });
        S.poly([[0, 0], [9, 0], [9, 6], [0, 6]], { fill: null, sw: 2.6 });
        return S.out();
      })()
    },
    concepts: ['lattice-geometry', 'gcd'], links: ['geo-pick-area']
  });

  puzzle({
    id: 'geo-lattice-midpoints', title: 'A Midpoint on the Grid', diff: 3,
    text: 'You pick some points on the corners of a big square grid (integer coordinates, as many rows and columns as you like). You want to be **certain** that at least two of your points have their midpoint on a grid point as well.\n\nWhat is the smallest number of points that guarantees it, however cleverly the points are chosen?',
    hints: ['The midpoint of (a, b) and (c, d) has coordinates ((a + c) ÷ 2, (b + d) ÷ 2). When are both of these whole numbers?', 'It happens exactly when a and c are both odd or both even, and the same for b and d. Sort points by (odd or even, odd or even): how many kinds are there?'],
    explain: 'The midpoint of two grid points is again a grid point exactly when their x-coordinates have the same parity (both odd or both even) and their y-coordinates have the same parity. There are only 2 × 2 = **4** kinds of point (even/odd, even/odd). Four points, one of each kind, can avoid the problem: (0, 0), (1, 0), (0, 1), (1, 1). But a fifth point must be of a kind that has already been used, and then those two have a grid midpoint. The answer is **5** — a pigeonhole argument with four pigeonholes.',
    data: {
      answer: { num: 5 }, glyph: '⦿',
      traps: [{ match: 4, msg: 'Four is not enough: the four corners of a unit square are four grid points, and no two of them have a grid point as their midpoint.' }, { match: 9, msg: 'You need far fewer. Think of the four kinds of point: (even/odd, even/odd).' }],
      figure: (function () {
        const S = scene(440, 320, [-1, -1, 7, 4.5], 16);
        S.grid(0, 0, 6, 3, 1); S.lattice(0, 0, 6, 3, { r: 2.6 });
        const P = [[1, 1], [2, 1], [1, 2], [2, 2]];
        S.poly(P, { fill: SY, sw: 1.8, dash: '5 4' });
        P.forEach((p) => S.dot(p, { r: 5, fill: RED }));
        S.dot([1.5, 1.5], { r: 3.6, fill: '#fff', stroke: INK });
        S.text([4.6, 1.5], 'four points with no grid midpoint', { size: 13, it: true, halo: false, fill: GREY, dx: 0 });
        return S.out();
      })()
    },
    concepts: ['lattice-geometry', 'pigeonhole', 'parity'], links: ['geo-lattice-regular']
  });

  puzzle({
    id: 'geo-empty-triangle', title: 'The Emptiest Triangle', diff: 2,
    text: 'A triangle has its corners on the points of a square grid (each little square has area 1). No other grid point lies inside it or on its edges: it is “empty”. Three examples are drawn.\n\nWhat is the area of every such triangle?',
    hints: ['Try a few examples and work out their areas by hand: the smallest is half a grid square.', 'Use Pick’s formula A = I + B ÷ 2 − 1 with no points inside (I = 0) and only the three corners on the boundary (B = 3).'],
    explain: 'By Pick’s theorem the area is I + B ÷ 2 − 1 = 0 + 3 ÷ 2 − 1 = **½**. Every empty grid triangle has the same area, half a grid square, however long and thin it is: the long triangle in the picture, which stretches over 2 by 5 squares, has area ½ just like the tiny one.',
    data: {
      answer: { num: 0.5, show: '1/2' }, glyph: '½',
      traps: [{ match: 1, msg: 'A whole square is bigger than any empty triangle: the smallest one is half a square.' }],
      figure: (function () {
        const S = scene(520, 300, [-1, -1, 11, 6], 16);
        const T = [[[0, 0], [1, 0], [0, 1]], [[2, 0], [5, 1], [4, 1]], [[7, 0], [8, 3], [9, 5]]];
        T.forEach((t) => { const c = latticeCount(t); chk('geo-empty-triangle', c.A, 0.5, 1e-9); chk('geo-empty-triangle', c.I + c.B, 3); });
        S.grid(0, 0, 10, 5, 1); S.lattice(0, 0, 10, 5, { r: 2.6 });
        S.poly(T[0], { fill: SR, sw: 2.2 }); S.poly(T[1], { fill: SB, sw: 2.2 }); S.poly(T[2], { fill: SG, sw: 2.2 });
        T.forEach((t) => t.forEach((p) => S.dot(p, { r: 3.8, fill: INK })));
        return S.out();
      })()
    },
    concepts: ['lattice-geometry', 'area'], links: ['geo-pick-inside', 'geo-pick-area']
  });

  puzzle({
    id: 'geo-lattice-regular', title: 'Regular Polygons on a Square Grid', diff: 4,
    text: 'Which of these regular polygons can be drawn so that **all of its corners are grid points** of a square grid? (The polygon may be tilted, and the grid may be as large as you like.)',
    goal: 'Choose every polygon that can be drawn on the grid.',
    hints: ['A square is easy. For the others, use Pick’s theorem or coordinates: what kind of number is the area of a polygon whose corners are grid points?', 'The area is always a whole number or a half (by Pick’s theorem). But the area of an equilateral triangle of side s is (√3 ÷ 4) s², and s² is a whole number when the corners are grid points.'],
    explain: 'Only the **square** can. The area of any polygon with grid corners is a multiple of ½ (Pick), so it is a rational number. An equilateral triangle of side s has area (√3 ÷ 4) s², and s² = a² + b² is a whole number for grid corners; so the area would be irrational: impossible. A regular hexagon is made of six such triangles, so it is impossible too. A regular octagon has area 2(1 + √2) s², also irrational. The regular pentagon involves √5 in its area and fails in the same way (and in fact no regular polygon with more than four sides is possible: this is a theorem, not a coincidence).',
    data: {
      answer: { multi: [1], choices: ['an equilateral triangle', 'a square', 'a regular pentagon', 'a regular hexagon', 'a regular octagon'] }, glyph: '⬡',
      traps: [],
      figure: (function () {
        const S = scene(440, 320, [-1, -1, 7, 6], 14);
        const P = [[2, 0], [5, 2], [3, 5], [0, 3]];
        S.grid(0, 0, 6, 5, 1); S.lattice(0, 0, 6, 5, { r: 2.6 });
        S.poly(P, { fill: SY, sw: 2.6 });
        P.forEach((p) => S.dot(p, { r: 4.4, fill: RED }));
        S.text([5.7, 4.8], 'a tilted square: corners on the grid', { size: 13, it: true, halo: false, fill: GREY, dx: 0, dy: -4, anchor: 'end' });
        return S.out();
      })()
    },
    concepts: ['lattice-geometry', 'symmetry'], links: ['geo-lattice-tilted-square', 'geo-pick-area']
  });


  /* =====================  SANGAKU: TEMPLE GEOMETRY  ===================== */

  const SANGAKU = 'A problem in the spirit of the sangaku, the wooden tablets of geometry that people in Edo-period Japan (1603–1868) hung in shrines and temples. Retold in our own words, with our own numbers.';

  puzzle({
    id: 'geo-sangaku-two-circles', title: 'Two Circles on a Shelf', diff: 3,
    source: SANGAKU,
    text: 'Two circles, of radii **9** and **4**, sit on a straight shelf. Each touches the shelf, and they touch each other.\n\nHow far apart are the two points where they touch the shelf?',
    hints: ['Join the two centres: the line passes through the point where the circles touch, so its length is 9 + 4 = 13.', 'Draw a horizontal line from the centre of the small circle to the vertical radius of the big one. You get a right triangle with hypotenuse 13 and one leg 9 − 4 = 5.'],
    explain: 'The centres are 9 + 4 = 13 apart. Their heights above the shelf are 9 and 4, differing by 5. So the horizontal distance between the centres, which is also the distance between the two touching points, is √(13² − 5²) = √144 = **12**. For radii R and r it is always 2√(R r): here 2√36 = 12. This little formula is the key to a whole family of sangaku problems.',
    data: {
      answer: { num: 12 }, glyph: '◯◯',
      traps: [{ match: 13, msg: '13 is the distance between the two centres, on a slant. The touching points are on the shelf, level with each other.' }, { match: 5, msg: '5 is the difference of the radii, the height of the small right triangle. The distance you want is the other leg.' }],
      figure: (function () {
        const S = scene(520, 320, [-10.5, -4.6, 16.5, 19.5], 14);
        chk('geo-sangaku-two-circles', dist([0, 9], [12, 4]), 13, 1e-9);
        S.poly([[-10, -1.4], [16, -1.4], [16, 0], [-10, 0]], { fill: '#d9c9a0', sw: 1.6 });
        S.circ([0, 9], 9, { fill: SB, stroke: BLUE, sw: 2.4 }); S.circ([12, 4], 4, { fill: SR, stroke: RED, sw: 2.4 });
        S.dot([0, 0], { r: 3.6 }); S.dot([12, 0], { r: 3.6 });
        S.text([0, 9], '9', { size: 20, bold: true, fill: BLUE, halo: false }); S.text([12, 4], '4', { size: 18, bold: true, fill: RED, halo: false });
        S.span([0, -1.4], [12, -1.4], '?', -20, { size: 22, fill: RED });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'pythagoras'], links: ['geo-sangaku-fill-gap']
  });

  puzzle({
    id: 'geo-sangaku-fill-gap', title: 'The Circle in the Gap', diff: 4,
    source: SANGAKU,
    text: 'Two circles of radii **9** and **4** sit on a straight shelf, touching it and each other. In the gap between them and the shelf a third, smaller circle is fitted: it touches both circles and the shelf.\n\nWhat is the radius of the small circle? Give it to two decimal places.',
    hints: ['Use the fact from [[geo-sangaku-two-circles|Two Circles on a Shelf]]: two circles of radii R and r touching a line and each other have touching points 2√(R r) apart.', 'Along the shelf, the distance between the touching points of the big and small circle, plus the distance from the small to the middle one, adds up to the whole distance between the big two: 2√(9r) + 2√(4r) = 2√(9 × 4).'],
    explain: 'Let the small circle have radius r. Along the shelf, the touching points are 2√(9 r) = 6√r from the big circle’s and 2√(4 r) = 4√r from the middle circle’s, and together these must make up the 12 between the big two touching points: 6√r + 4√r = 12, so √r = 1.2 and **r = 1.44**. In general, if the two big circles have radii R and S, the small one between them has radius r with 1 ÷ √r = 1 ÷ √R + 1 ÷ √S: for 9 and 4 that is 1/3 + 1/2 = 5/6, so r = 36/25. That the answer is a tidy fraction is why 9 and 4 make a good problem.',
    data: {
      answer: { num: 1.44, tol: 0.005, show: '1.44' }, glyph: '◉',
      traps: [{ match: 6.5, msg: 'That is the average of the two radii; the circle in the gap is far smaller than either.' }, { match: 2.25, msg: 'A circle of radius 2.25 is too big to touch all three: it would poke into the gap’s corners. Follow the distances along the shelf.' }],
      figure: (function () {
        const S = scene(520, 320, [-10.5, -4.6, 16.5, 19.5], 14);
        const r3 = 1.44, x3 = 2 * Math.sqrt(9 * r3);
        chk('geo-sangaku-fill-gap', dist([0, 9], [x3, r3]), 9 + r3, 1e-9); chk('geo-sangaku-fill-gap', dist([12, 4], [x3, r3]), 4 + r3, 1e-9);
        S.poly([[-10, -1.4], [16, -1.4], [16, 0], [-10, 0]], { fill: '#d9c9a0', sw: 1.6 });
        S.circ([0, 9], 9, { fill: SB, stroke: BLUE, sw: 2.4 }); S.circ([12, 4], 4, { fill: SR, stroke: RED, sw: 2.4 });
        S.circ([x3, r3], r3, { fill: SG, stroke: GREEN, sw: 2.4 });
        S.text([0, 9], '9', { size: 20, bold: true, fill: BLUE, halo: false }); S.text([12, 4], '4', { size: 18, bold: true, fill: RED, halo: false });
        S.text([x3, r3 + 4.6], 'r = ?', { size: 17, bold: true, fill: GREEN, it: true });
        S.line([x3, r3 + 3], [x3, r3 + 0.6], { stroke: GREEN, sw: 1.4 });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'pythagoras'], links: ['geo-sangaku-two-circles', 'geo-descartes-123']
  });

  puzzle({
    id: 'geo-sangaku-corner-arc', title: 'The Small Circle in the Corner', diff: 4,
    source: SANGAKU,
    text: 'A square has sides of **10**. A quarter circle of radius 10 is drawn inside it, centred on the top-right corner, so that its arc runs from the top-left corner to the bottom-right corner. In the bottom-left corner a small circle is fitted: it touches the two sides that meet there, and it touches the arc.\n\nWhat is the radius of the small circle? Give it to two decimal places.',
    hints: ['Put the bottom-left corner at the origin. Where is the centre of the small circle if its radius is r, and where is the centre of the arc?', 'The small circle’s centre is at (r, r) and the arc’s centre at (10, 10). The circles touch from outside, so the distance between the centres is 10 + r.'],
    explain: 'The centre of the small circle is (r, r), since it touches both axes. The arc has its centre at (10, 10) and radius 10; the two circles touch from outside, so the distance between the centres is 10 + r. That distance is also (10 − r)√2, the diagonal of a square of side 10 − r. So (10 − r)√2 = 10 + r, which gives r = 10(√2 − 1) ÷ (√2 + 1) = 10(3 − 2√2) ≈ **1.72**.',
    data: {
      answer: { num: 1.7157, tol: 0.005, show: '1.72' }, glyph: '◜',
      traps: [{ match: 2.93, msg: '2.93 is the radius of a circle that touches a *second* equal circle in the opposite corner, a related problem. Here the neighbour is the big arc.' }, { match: 4.14, msg: '4.14 would fit *inside* a quarter circle of radius 10. Here the small circle is outside the arc, in the corner.' }],
      figure: (function () {
        const S = scene(420, 400, [-1, -1, 11, 11], 14);
        const r = 10 * (3 - 2 * Math.SQRT2);
        chk('geo-sangaku-corner-arc', dist([r, r], [10, 10]), 10 + r, 1e-9);
        S.poly([[0, 0], [10, 0], [10, 10], [0, 10]], { fill: SN, sw: 2.6 });
        S.path(S.M([10, 10]) + S.L([0, 10]) + S.A(10, [10, 0], 0, true) + 'Z', { fill: SB, stroke: BLUE, sw: 2.4 });
        S.circ([r, r], r, { fill: SG, stroke: GREEN, sw: 2.4 });
        S.text([5.5, 7], '10', { size: 18, bold: true, fill: BLUE, halo: false, dx: 0 });
        S.text([r + 0.2, r + 2.0], 'r = ?', { size: 16, bold: true, fill: GREEN, it: true, dx: 20 });
        S.dot([10, 10], { r: 3.4 });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'pythagoras'], links: ['geo-sangaku-two-corners', 'geo-quadrant-circle']
  });

  puzzle({
    id: 'geo-sangaku-two-corners', title: 'Two Circles in a Square', diff: 3,
    source: SANGAKU,
    text: 'Two equal circles sit in opposite corners of a square of side **10**. Each touches the two sides that meet at its corner, and the two circles touch each other.\n\nWhat is the radius of the circles? Give it to two decimal places.',
    hints: ['The centres are at (r, r) and (10 − r, 10 − r). How far apart are they, in terms of r?', 'The centres are (10 − 2r)√2 apart, and this must equal r + r = 2r, because the circles touch.'],
    explain: 'The centres are at (r, r) and (10 − r, 10 − r), a distance (10 − 2r)√2 apart (the diagonal of a square of side 10 − 2r). The circles touch, so this distance is 2r: (10 − 2r)√2 = 2r, so 10√2 = 2r(1 + √2) and r = 5√2 ÷ (1 + √2) = 5√2(√2 − 1) = 10 − 5√2 ≈ **2.93**.',
    data: {
      answer: { num: 2.9289, tol: 0.005, show: '2.93' }, glyph: '◐◑',
      traps: [{ match: 2.5, msg: '2.5 would make the circles fit in a 5 by 5 corner square each, but they do not touch each other along the diagonal then.' }, { match: 5, msg: 'Radius 5 is a circle that fills the whole square. Two circles that touch must be smaller.' }],
      figure: (function () {
        const S = scene(420, 400, [-1, -1, 11, 11], 14);
        const r = 10 - 5 * Math.SQRT2;
        chk('geo-sangaku-two-corners', dist([r, r], [10 - r, 10 - r]), 2 * r, 1e-9);
        S.poly([[0, 0], [10, 0], [10, 10], [0, 10]], { fill: SN, sw: 2.6 });
        S.circ([r, r], r, { fill: SB, stroke: BLUE, sw: 2.4 }); S.circ([10 - r, 10 - r], r, { fill: SR, stroke: RED, sw: 2.4 });
        S.text([5, 0], '10', { dy: 20, size: 15 });
        S.text([r, r], 'r', { size: 20, it: true, bold: true, fill: BLUE, halo: false }); S.text([10 - r, 10 - r], 'r', { size: 20, it: true, bold: true, fill: RED, halo: false });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'pythagoras'], links: ['geo-sangaku-corner-arc']
  });

  puzzle({
    id: 'geo-quadrant-circle', title: 'A Circle in a Quarter-Circle', diff: 3,
    source: SANGAKU,
    text: 'A quarter-circle of radius **10** is cut from a sheet. A round coin is placed inside it so that it touches both straight edges and the curved edge.\n\nWhat is the radius of the largest such coin? Give it to two decimal places.',
    hints: ['Put the corner of the quarter-circle at the origin. If the coin has radius r, where is its centre?', 'The centre is at (r, r). Its distance from the origin is r√2, and the coin touches the arc from the inside, so that distance is 10 − r.'],
    explain: 'With the corner at the origin the coin’s centre is at (r, r), whose distance from the corner is r√2. The coin touches the arc from inside, so r√2 + r = 10 (the distance to the centre plus the radius reaches the arc). Then r = 10 ÷ (1 + √2) = 10(√2 − 1) ≈ **4.14**.',
    data: {
      answer: { num: 4.1421, tol: 0.005, show: '4.14' }, glyph: '◔',
      traps: [{ match: 5, msg: '5 would be half the radius, a coin that pokes out beyond the arc: check the distance from the corner to its far edge.' }, { match: 3.33, msg: 'That is a third: try the distance from the corner to the coin’s centre, r√2, and add r.' }],
      figure: (function () {
        const S = scene(420, 400, [-1, -1, 11, 11], 14);
        const r = 10 * (Math.SQRT2 - 1);
        chk('geo-quadrant-circle', Math.hypot(r, r) + r, 10, 1e-9);
        S.path(S.M([10, 0]) + S.A(10, [0, 10], 0, true) + S.L([0, 0]) + 'Z', { fill: SY, sw: 2.6 });
        S.circ([r, r], r, { fill: SB, stroke: BLUE, sw: 2.4 });
        S.text([r, r], 'r = ?', { size: 16, it: true, bold: true, fill: BLUE, halo: false });
        S.text([5, 0], '10', { dy: 20, size: 15 });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'pythagoras'], links: ['geo-sangaku-corner-arc', 'geo-three-equal-circles']
  });

  puzzle({
    id: 'geo-three-equal-circles', title: 'Three Coins in a Round Dish', diff: 3,
    source: SANGAKU,
    text: 'Three equal coins lie in a round dish of radius **10**. Each coin touches the other two and also touches the rim of the dish.\n\nWhat is the radius of one coin? Give it to two decimal places.',
    hints: ['The centres of the three coins form an equilateral triangle. How long is its side, if the coins have radius r?', 'The centre of the dish is the centre of that triangle, at a distance 2r ÷ √3 from each corner. That distance plus the coin radius reaches the rim.'],
    explain: 'The centres of the coins form an equilateral triangle of side 2r. Its centre (the centre of the dish) is at a distance 2r ÷ √3 from each corner. A coin touches the rim, so 2r ÷ √3 + r = 10, giving r = 10 ÷ (1 + 2/√3) = 10(2√3 − 3) ≈ **4.64**.',
    data: {
      answer: { num: 4.641, tol: 0.005, show: '4.64' }, glyph: '⁂',
      traps: [{ match: 3.33, msg: 'A third of the radius is too small: the coins would not touch each other.' }, { match: 5, msg: 'Two coins of radius 5 side by side already fill the diameter, with no room for a third. Smaller!' }],
      figure: (function () {
        const S = scene(420, 400, [-11, -11, 11, 11], 12);
        const r = 10 * (2 * Math.sqrt(3) - 3), c = regular(3, 2 * r / Math.sqrt(3), [0, 0], 90);
        chk('geo-three-equal-circles', dist(c[0], c[1]), 2 * r, 1e-9); chk('geo-three-equal-circles', Math.hypot(c[0][0], c[0][1]) + r, 10, 1e-9);
        S.circ([0, 0], 10, { fill: SN, sw: 3 });
        c.forEach((p, i) => S.circ(p, r, { fill: [SB, SR, SG][i], stroke: [BLUE, RED, GREEN][i], sw: 2.4 }));
        S.text([0, 0], '10', { size: 16, halo: false, fill: GREY, dx: 8, dy: -6 });
        S.line([0, 0], polar([0, 0], 10, -30), { stroke: GREY, sw: 1.4, dash: '4 4' });
        S.text(c[0], 'r', { size: 20, it: true, bold: true, halo: false });
        return S.out();
      })()
    },
    concepts: ['tangent-circles', 'symmetry'], links: ['geo-quadrant-circle', 'geo-descartes-123']
  });

  puzzle({
    id: 'geo-japanese-theorem', title: 'The Japanese Theorem', diff: 5,
    source: 'The “Japanese theorem” on cyclic polygons, named after the sangaku tradition in which it was found. Our own numbers.',
    text: 'A four-sided figure ABCD has all its corners on a circle. Cut it along the diagonal **AC**, and the circles inscribed in the two triangles ABC and ACD have radii **20** and **12**.\n\nNow cut the same figure along the other diagonal, **BD**. The circle inscribed in triangle BCD has radius **26**. What is the radius of the circle inscribed in the other triangle, ABD?',
    hints: ['Try the surprise first: does the total of the two radii depend on which diagonal you cut along?', 'For a figure with all corners on a circle, the two radii add to the same total whichever diagonal is used.'],
    explain: 'This is the **Japanese theorem**: however a polygon whose corners lie on a circle is cut into triangles by diagonals that do not cross, the radii of the inscribed circles of the triangles always add up to the same total. Here the diagonal AC gives 20 + 12 = 32, so the diagonal BD must give 26 + r = 32, and **r = 6**. (The figure is drawn to scale: the circle radius is 65, and all the numbers are exact.)',
    data: {
      answer: { num: 6 }, glyph: '⊚',
      traps: [{ match: 32, msg: '32 is the total of the two radii. The question asks for one of them.' }, { match: 8, msg: 'Not quite. The total is the same for the two ways of cutting, 20 + 12 = 32.' }],
      figure: (function () {
        const S = scene(540, 290, [-82, -70, 225, 70], 8);
        const A = [-63, -16], B = [-33, -56], C = [33, 56], D = [-63, 16];
        const inc = (P, Q, R) => { const a = dist(Q, R), b = dist(P, R), c = dist(P, Q), s = a + b + c; return { c: [(a * P[0] + b * Q[0] + c * R[0]) / s, (a * P[1] + b * Q[1] + c * R[1]) / s], r: polyArea([P, Q, R]) * 2 / s }; };
        const i1 = inc(A, B, C), i2 = inc(A, C, D), i3 = inc(B, C, D), i4 = inc(B, D, A);
        chk('geo-japanese-theorem', i1.r, 20, 1e-9); chk('geo-japanese-theorem', i2.r, 12, 1e-9); chk('geo-japanese-theorem', i3.r, 26, 1e-9); chk('geo-japanese-theorem', i4.r, 6, 1e-9);
        const sh = (p) => [p[0] + 150, p[1]];
        [0, 1].forEach((k) => {
          const f = k ? sh : (p) => p, q = [A, B, C, D].map(f);
          S.circ(f([0, 0]), 65, { fill: '#fffdf6', sw: 1.6, stroke: GREY });
          S.poly(q, { fill: SN });
          const pairs = k ? [[i3, SG, GREEN], [i4, SR, RED]] : [[i1, SB, BLUE], [i2, SY, GOLD]];
          pairs.forEach(([ic, fill, st]) => S.circ(f(ic.c), ic.r, { fill, stroke: st, sw: 2.2 }));
          S.poly(q, { fill: null, sw: 2.4 });
          S.line(k ? q[1] : q[0], k ? q[3] : q[2], { sw: 1.8, dash: '6 4' });
          q.forEach((p) => S.dot(p, { r: 3.4 }));
          S.names(q, ['A', 'B', 'C', 'D'], f([0, 0]), 15);
        });
        S.text(sh(i3.c), '26', { size: 18, bold: true, fill: GREEN, halo: false }); S.text(sh(i4.c), '?', { size: 15, bold: true, fill: RED, halo: false, dy: 0 });
        S.text(i1.c, '20', { size: 17, bold: true, fill: BLUE, halo: false }); S.text(i2.c, '12', { size: 15, bold: true, fill: GOLD, halo: false });
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'tangent-circles'], links: ['geo-cyclic-quadrilateral', 'geo-incircle-right-triangle']
  });

  puzzle({
    id: 'geo-arbelos', title: 'The Shoemaker’s Knife', diff: 4,
    source: 'The arbelos (“shoemaker’s knife”) was studied by Archimedes; the equal-area result below is in the Book of Lemmas attributed to him.',
    text: 'On a straight line take points A, C and B, with AC = **9** and CB = **4**. Draw three semicircles on the same side of the line: on AB, on AC and on CB. The curved shape between them (the “shoemaker’s knife”, shaded) is the **arbelos**.\n\nWhat is the area of the arbelos, as a multiple of π?',
    hints: ['The arbelos is the big semicircle with the two small semicircles taken away. The area of a semicircle is ½ π r².', 'The diameters are 13, 9 and 4, so the radii are 6.5, 4.5 and 2. Compute (6.5² − 4.5² − 2²) and multiply by ½π.'],
    explain: 'The big semicircle has radius 13/2 and the small ones 9/2 and 2, so the arbelos has area ½π((13/2)² − (9/2)² − 2²) = ½π(42.25 − 20.25 − 4) = ½π × 18 = **9π**. Archimedes noticed that this is exactly the area of the circle whose diameter is the perpendicular CD from C to the big semicircle: CD² = AC × CB = 36, so CD = 6 and the circle of diameter 6 has area 9π. Whatever the position of C, the knife has the area of that circle.',
    data: {
      answer: { num: 9 }, ask: 'Area = ? × π. Give the number in front of π.', glyph: '🗡',
      traps: [{ match: 18, msg: '18 is what is inside the brackets before multiplying by ½ π.' }, { match: 28.27, msg: '28.27 is 9π as a decimal: give the number in front of π.' }],
      figure: (function () {
        const S = scene(520, 260, [-1, -1.6, 14, 7.6], 12);
        const A = [0, 0], B = [13, 0], C = [9, 0], D = [9, 6];
        chk('geo-arbelos', Math.hypot(D[0] - 6.5, D[1]), 6.5, 1e-9);
        deep('geo-arbelos', (x, y) => y >= 0 && (x - 6.5) * (x - 6.5) + y * y <= 42.25 && (x - 4.5) * (x - 4.5) + y * y > 20.25 && (x - 11) * (x - 11) + y * y > 4, [0, 0, 13, 6.5], 9 * Math.PI, 0.005);
        S.path(S.M(A) + S.A(6.5, B, 0, false) + 'Z', { fill: SB });
        S.path(S.M(A) + S.A(4.5, C, 0, false) + 'Z', { fill: CREAM });
        S.path(S.M(C) + S.A(2, B, 0, false) + 'Z', { fill: CREAM });
        S.path(S.M(A) + S.A(6.5, B, 0, false) + 'Z', { fill: null, sw: 2.4 }); S.path(S.M(A) + S.A(4.5, C, 0, false) + 'Z', { fill: null, sw: 2.4 }); S.path(S.M(C) + S.A(2, B, 0, false) + 'Z', { fill: null, sw: 2.4 });
        S.line([-0.5, 0], [13.5, 0], { sw: 1.6 });
        [A, C, B].forEach((p) => S.dot(p, { r: 3.6 }));
        S.name(A, 'A', 0, 18); S.name(C, 'C', 0, 18); S.name(B, 'B', 0, 18);
        S.text([4.5, 0], '9', { dy: -12, size: 15, halo: false }); S.text([11, 0], '4', { dy: -10, size: 15, halo: false });
        S.text([9, 4.6], 'arbelos', { size: 16, it: true, fill: BLUE, halo: false, dx: 0 });
        return S.out();
      })()
    },
    concepts: ['area', 'tangent-circles'], links: ['geo-lune-triangle']
  });

  puzzle({
    id: 'geo-descartes-123', title: 'Four Circles That Kiss', diff: 5,
    source: 'René Descartes stated the rule in a letter of 1643; Frederick Soddy rediscovered it in 1936 and wrote it as a poem.',
    text: 'Three circles of radii **1**, **2** and **3** touch each other in pairs. In the gap between the three of them a fourth, smaller circle is fitted, touching all three.\n\nWhat is its radius? Give it to three decimal places.',
    hints: ['There is a formula for four circles that all touch each other: if the curvatures (1 ÷ radius) are k₁, k₂, k₃ and k₄, then (k₁ + k₂ + k₃ + k₄)² = 2 (k₁² + k₂² + k₃² + k₄²).', 'Solving for k₄: k₄ = k₁ + k₂ + k₃ + 2√(k₁k₂ + k₂k₃ + k₃k₁) for the small circle in the gap. Here k = 1, 1/2 and 1/3.'],
    explain: 'Descartes’ circle theorem, with the curvatures k = 1 ÷ radius: k₁ = 1, k₂ = ½, k₃ = ⅓. Then k₁ + k₂ + k₃ = 11/6 and k₁k₂ + k₂k₃ + k₃k₁ = ½ + 1/6 + ⅓ = 1, whose square root is 1. So k₄ = 11/6 + 2 × 1 = 23/6 and the radius is **6/23 ≈ 0.261**. (With the minus sign, k₄ = 11/6 − 2 = −1/6: the “radius −6”, meaning the big circle of radius 6 that surrounds all three, touching them from the outside.) The three given circles have centres at distances 3, 4, 5: a right triangle, which is why the numbers come out so cleanly.',
    data: {
      answer: { num: 0.26087, tol: 0.0006, show: '0.261' }, glyph: '⊛',
      traps: [{ match: 0.5, msg: 'That is the radius of a circle that is too large to fit in the gap: the gap is narrow.' }, { match: 6, msg: '6 is the radius of the big circle that encloses all three: the other solution of the same formula. You want the small one in the gap.' }],
      figure: (function () {
        const S = scene(460, 340, [-3.6, -3.8, 8.2, 5.8], 12);
        const C3 = [0, 0], C2 = [5, 0], C1 = [3.2, 2.4], rho = 6 / 23;
        const x = 3 + 0.2 * rho, y = Math.sqrt((3 + rho) * (3 + rho) - x * x), P = [x, y];
        chk('geo-descartes-123', dist(P, C3), 3 + rho, 1e-9); chk('geo-descartes-123', dist(P, C2), 2 + rho, 1e-9); chk('geo-descartes-123', dist(P, C1), 1 + rho, 1e-9);
        S.circ(C3, 3, { fill: SB, stroke: BLUE, sw: 2.4 }); S.circ(C2, 2, { fill: SR, stroke: RED, sw: 2.4 }); S.circ(C1, 1, { fill: SG, stroke: GREEN, sw: 2.4 });
        S.circ(P, rho, { fill: SY, stroke: GOLD, sw: 2 });
        S.text(C3, '3', { size: 24, bold: true, fill: BLUE, halo: false, dx: -18, dy: 10 }); S.text(C2, '2', { size: 22, bold: true, fill: RED, halo: false }); S.text(C1, '1', { size: 18, bold: true, fill: GREEN, halo: false });
        S.line(P, [P[0] + 1.2, P[1] + 1.6], { stroke: GOLD, sw: 1.4 }); S.text([P[0] + 1.2, P[1] + 1.6], 'r = ?', { size: 16, it: true, bold: true, fill: GOLD, dx: 20, dy: -6, halo: false });
        return S.out();
      })()
    },
    concepts: ['tangent-circles'], links: ['geo-sangaku-fill-gap', 'geo-three-equal-circles']
  });


  /* =====================  MORE: EASY WARM-UPS, TRICKS AND HARD ONES  ===================== */

  puzzle({
    id: 'geo-triangle-ratio-angles', title: 'Angles in the Ratio 2 : 3 : 4', diff: 1,
    text: 'The three angles of a triangle are in the ratio **2 : 3 : 4**.\n\nHow big is the largest angle?',
    hints: ['Call the angles 2x, 3x and 4x. What do the three of them add up to?', '2x + 3x + 4x = 180°, so 9x = 180°.'],
    explain: 'The angles are 2x, 3x and 4x, and they add up to 180°: 9x = 180°, so x = 20°. The angles are 40°, 60° and 80°, and the largest is **80°**. (Check the picture: it is drawn to scale, so you can measure with a protractor.)',
    data: {
      answer: { num: 80, unit: '°' }, glyph: '2:3:4',
      traps: [{ match: 60, msg: '60° is the middle angle, the 3 of the ratio. The largest goes with the 4.' }, { match: 40, msg: '40° is the smallest angle. Which part of the ratio is the biggest?' }],
      figure: (function () {
        const S = scene(420, 380, [-1.5, -1.2, 12.5, 15.2], 12);
        const B = [0, 0], C = [10, 0], bA = 10 * Math.sin(80 * RAD) / Math.sin(40 * RAD), A = [bA * Math.cos(60 * RAD), bA * Math.sin(60 * RAD)];
        // angle at B = 60, at C = 80... place: B = 60°, C = 80°, A = 40°
        chk('geo-triangle-ratio-angles', angOf(B, A, C), 40, 1e-9); chk('geo-triangle-ratio-angles', angOf(A, C, B), 80, 1e-9);
        S.poly([A, B, C], { fill: SY });
        S.ang(A, B, C, { r: 32, label: '2x', ld: 14 }); S.ang(B, A, C, { r: 30, label: '3x', ld: 14 }); S.ang(C, A, B, { r: 30, label: '4x', ld: 16 });
        S.names([A, B, C], ['A', 'B', 'C'], [5, 2], 16);
        return S.out();
      })()
    },
    concepts: ['angle-chasing'], links: ['geo-gable', 'geo-exterior-angle']
  });

  puzzle({
    id: 'geo-rhombus-diagonals', title: 'The Diamond and Its Diagonals', diff: 1,
    text: 'A rhombus (a diamond shape with four equal sides) has diagonals of **6 cm** and **8 cm**.\n\nWhat is its **perimeter**?',
    hints: ['The diagonals of a rhombus cross at right angles, and each cuts the other in half.', 'One of the four small right triangles has legs 3 and 4. Its hypotenuse is a side of the rhombus.'],
    explain: 'The diagonals cross at right angles and bisect each other, cutting the rhombus into four right triangles with legs 3 and 4. The hypotenuse of each is a side of the rhombus: √(3² + 4²) = 5 cm. Four sides make **20 cm**. (The area is also easy: ½ × 6 × 8 = 24 cm².)',
    data: {
      answer: { num: 20, unit: 'cm' }, glyph: '◊',
      traps: [{ match: 14, msg: '14 = 6 + 8. The sides of the rhombus are slanted, and longer than half of a diagonal each way.' }, { match: 5, msg: '5 cm is one side. The perimeter is all four.' }],
      figure: (function () {
        const S = scene(440, 300, [-5, -4, 5, 4], 20);
        const P = [[-4, 0], [0, -3], [4, 0], [0, 3]];
        chk('geo-rhombus-diagonals', dist(P[0], P[1]), 5, 1e-9);
        S.poly(P, { fill: SY, sw: 2.6 });
        S.line(P[0], P[2], { dash: '5 4', sw: 1.6 }); S.line(P[1], P[3], { dash: '5 4', sw: 1.6 });
        S.right([0, 0], P[2], P[3], 10);
        S.text([2, 0], '8 cm', { dy: -14, size: 15 }); S.text([0, 1.5], '6 cm', { dx: 30, size: 15 });
        P.forEach((p) => S.dot(p, { r: 3.4 }));
        return S.out();
      })()
    },
    concepts: ['pythagoras', 'symmetry'], links: ['geo-ladder-wall']
  });

  puzzle({
    id: 'geo-pizza-comparison', title: 'One Big Pizza or Two Small?', diff: 2,
    text: 'A pizzeria sells a **30 cm** pizza for the same price as **two 20 cm** pizzas. Both kinds are the same thickness. You want as much pizza as possible.\n\nWhich do you choose?',
    hints: ['The amount of pizza is its area. The area of a circle is π r², with r the radius.', 'Compare π × 15² with two lots of π × 10².'],
    explain: 'The area of a pizza is π r². The big one has radius 15: 225π ≈ 707 cm². Each small one has radius 10: 100π, so two make 200π ≈ 628 cm². The **single 30 cm pizza** gives about 12 % more. Areas grow with the square of the width, so 30 against 20 is (3/2)² = 2.25 small pizzas’ worth, not 1.5 or 2.',
    data: {
      answer: { choice: 0, choices: ['the one 30 cm pizza', 'the two 20 cm pizzas', 'they are exactly the same'] }, glyph: '🍕',
      traps: [{ match: 1, msg: 'Two pizzas sound like more, but area does not add like widths: 20 + 20 = 40 is more than 30, but 400 + 400 = 800 is less than 900 (compare the squares).' }, { match: 2, msg: 'They would be the same only if area grew in proportion to width. It grows with the square of the width.' }],
      figure: (function () {
        const S = scene(520, 240, [-16, -16.5, 42, 16.5], 12);
        S.circ([0, 0], 15, { fill: '#f0c987', stroke: '#b06b2a', sw: 3 }); S.circ([0, 0], 13.2, { fill: null, stroke: '#c9482f', sw: 1.4, dash: '4 4' });
        S.circ([25, 0], 10, { fill: '#f0c987', stroke: '#b06b2a', sw: 3 }); S.circ([25, 0], 8.6, { fill: null, stroke: '#c9482f', sw: 1.4, dash: '4 4' });
        S.text([0, 0], '30 cm', { size: 18, bold: true, halo: false }); S.text([25, 0], '20 cm', { size: 16, bold: true, halo: false });
        return S.out();
      })()
    },
    concepts: ['area', 'similarity'], links: ['geo-similar-triangle-areas', 'geo-tube-balls']
  });

  puzzle({
    id: 'geo-three-squares-angles', title: 'Three Squares, Three Angles', diff: 3,
    text: 'Three unit squares stand side by side. From the bottom-left corner A, three straight lines are drawn to the top corners of the first, second and third square. They make the angles α, β and γ with the bottom line, as in the picture.\n\nWhat is the value of **α + β + γ**?',
    hints: ['α is easy: the first line is the diagonal of a square. For β and γ, the tangent of the angle is height ÷ length: ½ and ⅓.', 'Add β and γ with the tangent addition formula: tan(β + γ) = (tan β + tan γ) ÷ (1 − tan β tan γ).'],
    explain: 'The line to the first square’s corner is a diagonal, so α = 45°. For the others, tan β = 1/2 and tan γ = 1/3. Then tan(β + γ) = (1/2 + 1/3) ÷ (1 − 1/6) = (5/6) ÷ (5/6) = 1, so β + γ = 45°. The total is **α + β + γ = 90°**. (There is also a purely geometric proof, using similar triangles.)',
    data: {
      answer: { num: 90, unit: '°' }, glyph: 'α+β+γ',
      traps: [{ match: 45, msg: '45° is α on its own (or β + γ). Add all three.' }, { match: 135, msg: '135° would be 45° three times. Only α is 45°; the others are smaller.' }],
      figure: (function () {
        const S = scene(520, 220, [-1, -1, 4.3, 1.8], 18);
        const A = [0, 0];
        chk('geo-three-squares-angles', Math.atan(1) * DEG + Math.atan(1 / 2) * DEG + Math.atan(1 / 3) * DEG, 90, 1e-9);
        [0, 1, 2].forEach((i) => S.poly([[i, 0], [i + 1, 0], [i + 1, 1], [i, 1]], { fill: [SB, SG, SR][i] }));
        [1, 2, 3].forEach((x) => S.line(A, [x, 1], { sw: 2, stroke: [RED, BLUE, GREEN][x - 1] }));
        S.ang(A, [1, 0], [1, 1], { r: 34, label: 'α', ld: 12, size: 17, stroke: RED, color: RED });
        S.ang(A, [1, 0], [2, 1], { r: 60, label: 'β', ld: 14, size: 17, stroke: BLUE, color: BLUE });
        S.ang(A, [1, 0], [3, 1], { r: 84, label: 'γ', ld: 12, size: 17, stroke: GREEN, color: GREEN });
        S.poly([[0, 0], [3, 0], [3, 1], [0, 1]], { fill: null, sw: 2.4 });
        [1, 2].forEach((x) => S.line([x, 0], [x, 1], { sw: 1.6 }));
        S.name(A, 'A', -14, 12);
        return S.out();
      })()
    },
    concepts: ['angle-chasing', 'similarity'], links: ['geo-square-equilateral']
  });

  puzzle({
    id: 'geo-ptolemy-equilateral', title: 'A Point on the Circle Round a Triangle', diff: 4,
    source: 'A consequence of Ptolemy’s theorem on quadrilaterals inscribed in a circle (Claudius Ptolemy, second century).',
    text: 'ABC is an **equilateral** triangle and P is a point on the circle through A, B and C, on the arc between A and B (the arc that does not contain C). The distances are PA = **5** and PB = **7**.\n\nHow far is P from C?',
    hints: ['A surprise: you can find PC from just PA and PB, without knowing the size of the triangle. Look at the four points A, P, B, C on the circle.', 'Ptolemy’s theorem for a four-sided figure on a circle: the product of the diagonals equals the sum of the products of opposite sides. Here the diagonals are PC and AB.'],
    explain: 'For the four points A, P, B, C on the circle (in this order round the circle) the diagonals are PC and AB, and Ptolemy’s theorem says PC × AB = PA × BC + PB × AC. In an equilateral triangle AB = BC = CA, so the common side divides out: PC = PA + PB = 5 + 7 = **12**. (The side of the triangle is √109 ≈ 10.4, which we never needed.)',
    data: {
      answer: { num: 12 }, glyph: 'P',
      traps: [{ match: 35, msg: '35 = 5 × 7. The rule has a sum, not a product, once the common side has cancelled.' }, { match: 8.6, msg: '8.6 is √74, the length you get if PA and PB made a right angle at P. The angle APB is 120° here.' }],
      figure: (function () {
        const S = scene(440, 400, [-7, -7.3, 7, 7], 12);
        const s = Math.sqrt(109), R = s / Math.sqrt(3);
        const A = polar([0, 0], R, 150), B = polar([0, 0], R, 30), C = polar([0, 0], R, 270);
        const th = 150 - 2 * Math.asin(5 / (2 * R)) * DEG, P = polar([0, 0], R, th);
        chk('geo-ptolemy-equilateral', dist(P, A), 5, 1e-9); chk('geo-ptolemy-equilateral', dist(P, B), 7, 1e-9); chk('geo-ptolemy-equilateral', dist(P, C), 12, 1e-9);
        S.circ([0, 0], R, { fill: '#fffdf6' });
        S.poly([A, B, C], { fill: SY });
        S.line(P, A, { sw: 2, stroke: BLUE }); S.line(P, B, { sw: 2, stroke: BLUE }); S.line(P, C, { sw: 2.4, stroke: RED, dash: '6 4' });
        [A, B, C, P].forEach((p) => S.dot(p, { r: 3.6 }));
        S.dim(P, A, '5', -12, { size: 16, fill: BLUE }); S.dim(P, B, '7', 12, { size: 16, fill: BLUE });
        S.names([A, B, C], ['A', 'B', 'C'], [0, 0], 16); S.name(P, 'P', 0, -15);
        S.text(mid(P, C), '?', { size: 22, bold: true, fill: RED, dx: 16 });
        return S.out();
      })()
    },
    concepts: ['circle-angles', 'similarity'], links: ['geo-cyclic-quadrilateral', 'geo-chords-cross']
  });

  puzzle({
    id: 'geo-pentagon-diagonal', title: 'The Diagonal of the Pentagon', diff: 4,
    text: 'A regular pentagon has sides of **10 cm**. Its diagonals (the lines joining corners that are not neighbours) are all equal.\n\nHow long is a diagonal? Give it to two decimal places.',
    hints: ['Take a diagonal and the two sides of the pentagon at either end: they make an isosceles triangle. What are its angles?', 'The interior angle of a regular pentagon is 108°. The diagonal makes an isosceles triangle with two sides of 10 and an angle of 108° between them, with base angles 36°.'],
    explain: 'The interior angle of a regular pentagon is 108°. Two neighbouring sides (10, 10) and the diagonal joining their far ends make an isosceles triangle with apex 108° and base angles 36°. Its base, the diagonal, is 2 × 10 × cos 36° = 20 cos 36° ≈ **16.18 cm**. That number is 10 × φ, where φ = (1 + √5) ÷ 2 ≈ 1.618 is the golden ratio: in every regular pentagon the diagonal is φ times the side.',
    data: {
      answer: { num: 16.1803, tol: 0.005, unit: 'cm', show: '16.18' }, glyph: '⬠',
      traps: [{ match: 14.14, msg: '14.14 is the diagonal of a square with side 10. The pentagon’s is longer, because its corners are more spread out.' }, { match: 20, msg: 'A diagonal is shorter than two sides together (a straight line beats a bend).' }],
      figure: (function () {
        const S = scene(440, 360, [-5.4, -5.4, 5.4, 5.4], 14);
        const Vr = regular(5, 5, [0, 0], 90), side = dist(Vr[0], Vr[1]), dia = dist(Vr[0], Vr[2]);
        chk('geo-pentagon-diagonal', dia / side, (1 + Math.sqrt(5)) / 2, 1e-9);
        S.poly(Vr, { fill: SY, sw: 2.6 });
        S.line(Vr[0], Vr[2], { stroke: RED, sw: 3 });
        Vr.forEach((p) => S.dot(p, { r: 3.6 }));
        S.text(mid(Vr[0], Vr[1]), '10 cm', { dx: 30, dy: -18, size: 15 });
        S.text(mid(Vr[0], Vr[2]), '?', { dx: -16, dy: 4, size: 22, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['angle-chasing', 'symmetry'], links: ['geo-chain-36', 'geo-pentagram-tip']
  });

  puzzle({
    id: 'geo-ladder-corner', title: 'Round the Corner with a Ladder', diff: 5,
    text: 'A ladder must be carried, held level, from a passage **8 m** wide into a passage **1 m** wide that meets it at a right angle (an L-shaped corridor, as in the picture). The walls are straight and the ladder has no thickness.\n\nWhat is the length of the **longest** ladder that can be carried round the corner? Give it to two decimal places.',
    hints: ['The ladder gets stuck in the position where it touches the inner corner and both outer walls. Let its angle with the wall be θ: how long is the part in each passage?', 'The length is L(θ) = 8 ÷ sin θ + 1 ÷ cos θ, and the longest ladder that can pass is the smallest L over all angles. It is smallest when tan³θ = 8, that is tan θ = 2.'],
    explain: 'When the ladder is touching the inner corner and both outer walls at angle θ to the wide passage’s wall, the part in the wide passage has length 8 ÷ sin θ and the part in the narrow one 1 ÷ cos θ, so L(θ) = 8 ÷ sin θ + 1 ÷ cos θ. A ladder can round the corner only if it is no longer than the **smallest** value of L(θ): at that angle it is stuck. Setting the derivative to zero, −8 cos θ ÷ sin²θ + sin θ ÷ cos²θ = 0, gives tan³θ = 8, so tan θ = 2 and sin θ = 2/√5, cos θ = 1/√5. Then L = 8√5 ÷ 2 + √5 = 5√5 ≈ **11.18 m**. (The general rule: for passages of widths a and b the limit is (a^(2/3) + b^(2/3))^(3/2).)',
    data: {
      answer: { num: 11.1803, tol: 0.005, unit: 'm', show: '11.18' }, glyph: '⌐',
      traps: [{ match: 9, msg: '9 m is 8 + 1, the two widths added. A ladder can be longer than that, because it goes round the corner on the slant.' }, { match: 12.73, msg: 'That is √(9² + 9²), a ladder across a 9 by 9 square. The tightest position is a slanting one touching the inner corner.' }],
      figure: (function () {
        const S = scene(480, 400, [-2, -2, 14, 13], 12);
        chk('geo-ladder-corner', dist([5, 0], [0, 10]), 5 * Math.sqrt(5), 1e-9);
        let best = 1e9;
        for (let t = 0.05; t < 1.5; t += 0.0001) best = Math.min(best, 8 / Math.sin(t) + 1 / Math.cos(t));
        chk('geo-ladder-corner', best, 5 * Math.sqrt(5), 1e-6);
        // the L-shaped passage
        S.poly([[0, 0], [1, 0], [1, 8], [12.5, 8], [12.5, 0]], { fill: '#f6f0dc', stroke: null });
        S.poly([[0, 0], [1, 0], [1, 12], [0, 12]], { fill: '#f6f0dc', stroke: null });
        S.poly([[-1, -1], [12.5, -1], [12.5, 0], [-1, 0]], { fill: '#cbb897', stroke: null });
        S.poly([[-1, 0], [0, 0], [0, 12], [-1, 12]], { fill: '#cbb897', stroke: null });
        S.poly([[1, 8], [12.5, 8], [12.5, 12], [1, 12]], { fill: '#cbb897', stroke: null });
        S.pl([[0, 12], [0, 0], [12.5, 0]], { sw: 2.8 }); S.pl([[1, 12], [1, 8], [12.5, 8]], { sw: 2.8 });
        S.line([5, 0], [0, 10], { stroke: RED, sw: 4.2 });
        S.dot([1, 8], { r: 4 });
        S.span([0, 12.5], [1, 12.5], '1 m', -14, { size: 14 }); S.span([13.2, 0], [13.2, 8], '8 m', -14, { size: 14 });
        S.text([7, 4], 'wide passage', { size: 15, it: true, fill: GREY, halo: false });
        S.text([5.2, 5.6], '?', { size: 24, bold: true, fill: RED, dx: -6 });
        return S.out();
      })()
    },
    concepts: ['optimisation', 'pythagoras'], links: ['geo-ladder-over-box', 'geo-fence-wall']
  });

  puzzle({
    id: 'geo-missing-square', title: 'Where Did the Square Go?', diff: 3,
    source: 'Curry’s triangle, described by the New York amateur magician Paul Curry in 1953.',
    text: 'Four pieces (a blue triangle, a red triangle and two staircase-shaped pieces of squares) are laid out to make what looks like a triangle 13 squares wide and 5 high. Then the **same four pieces** are swapped round to make what looks like the same triangle — but now a hole, one whole square, is left over!\n\nWhat is the explanation?',
    goal: 'Choose the correct explanation.',
    hints: ['Compare the slopes of the two triangles that make the long edge: blue is 8 across and 3 up, red is 5 across and 2 up.', 'Is 3 ÷ 8 the same as 2 ÷ 5? If not, the long edge is not a straight line.'],
    explain: 'The blue triangle climbs 3 for every 8 across (slope 0.375) and the red one 2 for every 5 across (slope 0.4). Those are not equal, so neither figure is really a triangle: the long edge has a very slight bend at the joint of the two small triangles. In the first figure the bend points inwards, so the figure has an area of 32 and is a little smaller than a real 13 × 5 triangle (32.5). In the second the bend points outwards, so it has an area of 33 and can hold the four pieces (32) with **one square to spare**. The area was never created: the two outlines differ by one whole square, spread thin along the bent edge.',
    data: {
      answer: { choice: 1, choices: ['One of the pieces was cut smaller in the second picture.', 'Neither outline is a true triangle: the long edge bends slightly, inwards in one picture and outwards in the other, so the areas differ by exactly one square.', 'The hole is an optical illusion: no space is left over.', 'Moving pieces around can change their total area.'] }, glyph: '▲',
      traps: [{ match: 0, msg: 'The four pieces are exactly the same in both pictures. Look at the long edge.' }, { match: 2, msg: 'The gap is real: one whole square is left over. Look for an area that changes between the two outlines.' }, { match: 3, msg: 'Area never changes when a piece is moved: that is what makes the paradox interesting.' }],
      figure: (function () {
        const S = scene(540, 210, [-1, -0.8, 32, 6.3], 12);
        const B = [[0, 0], [8, 0], [8, 3]], R = [[8, 3], [13, 3], [13, 5]];
        // arrangement 1: blue left, red on the right top, two staircase pieces in the 5 x 3 rectangle 8..13
        const cellsA = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [1, 1]];          // 7 squares
        const cellsB = [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [2, 1], [3, 1], [4, 1]];   // 8 squares
        const sq = (o, c) => [[o[0] + c[0], o[1] + c[1]], [o[0] + c[0] + 1, o[1] + c[1]], [o[0] + c[0] + 1, o[1] + c[1] + 1], [o[0] + c[0], o[1] + c[1] + 1]];
        const draw = (dx, tri, pieces) => {
          const sh = (p) => [p[0] + dx, p[1]];
          S.poly(tri[0].map(sh), { fill: tri[2], sw: 2 }); S.poly(tri[1].map(sh), { fill: tri[3], sw: 2 });
          pieces.forEach(([cells, o, fill]) => cells.forEach((c) => S.poly(sq(sh(o), c), { fill, sw: 1.2 })));
        };
        // 1: blue (0,0)-(8,0)-(8,3); red (8,3)-(13,3)-(13,5); staircases fill (8..13) x (0..3)
        draw(0, [B, R, SB, SR], [[cellsA, [8, 0], SG], [cellsB, [8, 0], SY]]);
        // 2: red (0,0)-(5,0)-(5,2); blue (5,2)-(13,2)-(13,5); staircases in (5..13) x (0..2) with a hole at column 2, row 1
        const R2 = [[0, 0], [5, 0], [5, 2]], B2 = [[5, 2], [13, 2], [13, 5]];
        const cA2 = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [4, 0]], cB2 = [[3, 1], [4, 1], [5, 0], [5, 1], [6, 0], [6, 1], [7, 0], [7, 1]];
        draw(17, [R2, B2, SR, SB], [[cA2, [5, 0], SG], [cB2, [5, 0], SY]]);
        chk('geo-missing-square', cellsA.length + cellsB.length, 15);
        chk('geo-missing-square', cA2.length + cB2.length, 15);
        // the outlines: the long edges are drawn bent, as they really are
        S.pl([[0, 0], [8, 3], [13, 5]].map((p) => p), { stroke: INK, sw: 2.2 });
        S.pl([[17, 0], [22, 2], [30, 5]], { stroke: INK, sw: 2.2 });
        S.line([0, 0], [13, 5], { stroke: GREY, sw: 1.2, dash: '3 4' }); S.line([17, 0], [30, 5], { stroke: GREY, sw: 1.2, dash: '3 4' });
        S.text([6.5, -0.4], 'first arrangement', { size: 13, it: true, dy: 15, halo: false }); S.text([23.5, -0.4], 'second arrangement', { size: 13, it: true, dy: 15, halo: false });
        return S.out();
      })()
    },
    concepts: ['area', 'dissection'], links: ['geo-ladder-over-box']
  });


  list.forEach((p) => { if (!p.tags) p.tags = p.id.split('-').slice(1).concat(['geometry']); });
  Cabinet.family({
    id: 'geometry-puzzles', engine: 'question', cat: 'shapes', name: 'Geometry with a twist', order: 20,
    blurb: 'Angles that chase each other round a figure, ladders and boxes, shaded moons, circles that touch and a sphere with a hole: drawn to scale, answered with a number.',
    origin: { year: -300, who: 'Euclid, Archimedes and the temple geometers of Japan', note: 'Greek geometers proved the results, Chinese and Indian mathematicians used them for building and surveying, and in the Edo period of Japan (1603–1868) farmers, samurai and merchants hung their favourite problems on wooden tablets in shrines and temples — the sangaku. The results in this drawer are classical; the numbers and the pictures are new.' },
    concepts: ['angle-chasing', 'circle-angles', 'similarity', 'pythagoras', 'area', 'tangent-circles', 'lattice-geometry', 'solids', 'reflection-trick']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
