/* The Puzzle Cabinet · data/dissection-riddles.js
 * Area and perimeter paradoxes: the chessboard that grows a square, the triangle with a hole, staircases that never
 * reach the diagonal, snowflakes with an endless edge and pizzas that share fairly. Each riddle has a figure drawn to
 * scale from its coordinates, an answer that is checked against the figure when the file loads, and an explanation of
 * where the trick hides. Statements are written afresh. */
Cabinet.concepts([
  { id: 'fibonacci', name: 'Fibonacci numbers',
    text: 'Start with 1 and 1 and let each number be the sum of the two before: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55 … Neighbouring ratios (13/8, 21/13, 34/21 …) close in on the golden ratio 1.618…, and the numbers obey a curious rule found by Cassini in 1680: the product of the two neighbours of a Fibonacci number differs from its square by exactly one, plus or minus, alternately. That “off by one” is the secret behind the chessboard that changes from 64 squares to 65.' },
  { id: 'limits', name: 'When limits mislead',
    text: 'A staircase of a million tiny steps looks exactly like a straight slope, but its length is the same as that of a single big step. When shapes get closer and closer to a limit, their lengths need not approach the length of the limit: length depends on direction as well as position. The same warning applies to areas of shapes with rough edges, and it is why the perimeter of a fractal snowflake can be endless while its area is finite.' },
  { id: 'fractals', name: 'Fractals and self-similar shapes',
    text: 'Take a shape, replace each part of it by a smaller copy of the whole, and repeat for ever. The results (the snowflake curve of Helge von Koch, the Sierpinski triangle and carpet) are made of copies of themselves. Lengths, areas and counts grow or shrink by the same factor at every step, so a few lines of arithmetic tell you everything about an infinite process: a geometric series does the work.' },
  { id: 'isoperimetric', name: 'The same fence, a different field',
    text: 'Fix the length of the boundary and the enclosed area can still vary enormously: a long thin rectangle and a square may use the same fence. Among all shapes with one perimeter the circle encloses the most area (the isoperimetric theorem, known to the Greeks as Dido’s problem, after the queen who was allowed as much land as an ox-hide could surround); among rectangles it is the square, and among polygons with a given number of sides it is the regular one.' }
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


  /* =====================  THE CHESSBOARD THAT GAINS A SQUARE  ===================== */

  // the four pieces of the 8 x 8 board: two trapezoids and two triangles
  const P_SQUARE = [[[0, 0], [5, 0], [5, 5], [0, 3]], [[0, 3], [5, 5], [5, 8], [0, 8]], [[8, 0], [8, 8], [5, 8]], [[5, 8], [5, 0], [8, 0]]];
  const P_RECT = [[[8, 0], [13, 0], [13, 5], [8, 3]], [[0, 0], [5, 2], [5, 5], [0, 5]], [[0, 0], [8, 0], [8, 3]], [[5, 2], [13, 5], [5, 5]]];
  const PCOL = [SB, SG, SR, SY];

  puzzle({
    id: 'para-chessboard-65', title: 'The Chessboard That Gains a Square', diff: 2,
    source: 'A Victorian puzzle-book favourite, also linked with Lewis Carroll’s love of such tricks. The pieces here follow the Fibonacci numbers 3, 5, 8, 13.',
    text: 'A chessboard of 8 × 8 = **64** squares is cut along three straight lines into four pieces: two trapezoids and two triangles. The same four pieces are then laid out as a rectangle 5 × 13 = **65** squares. Both arrangements are shown in the picture.\n\nWhere does the extra square come from?',
    goal: 'Choose the correct explanation.',
    hints: ['Measure the slopes of the slanted edges. The triangles are 8 across and 3 up; the trapezoids’ slanted edges are 5 across and 2 up.', 'In the rectangle, are the slanted edges of the upper and lower pieces really in one straight line? Compare 3 ÷ 8 and 2 ÷ 5.'],
    explain: 'The four pieces have a total area of exactly 64. In the rectangle the pieces do not fit exactly: the slanted edges that meet along the long diagonal have slopes 3 ÷ 8 = 0.375 (the triangles) and 2 ÷ 5 = 0.4 (the trapezoids), which are not equal. So along the diagonal there is a very thin gap, a parallelogram with corners (0, 0), (5, 2), (13, 5) and (8, 3), whose area is exactly **one square**: 65 − 64. It is only about 0.12 of a square wide, less than a pencil line at normal size. Nothing is created; the missing area is spread out where you do not look.',
    data: {
      answer: { choice: 1, choices: ['One piece is a little bigger in the rectangle than in the square.', 'The pieces do not quite fit in the rectangle: a very thin gap along the diagonal has an area of exactly one square.', 'The squares of the rectangle are slightly smaller than the squares of the chessboard.', 'Cutting along slanting lines can create new area.'] }, glyph: '64=65',
      traps: [{ match: 0, msg: 'The pieces are exactly the same ones in both pictures. Look at the long diagonal of the rectangle.' }, { match: 2, msg: 'Nothing shrinks: a metre is a metre. The extra square has to come from somewhere else.' }, { match: 3, msg: 'Area is never created by cutting and moving: it is always conserved. The trick must be elsewhere.' }],
      figure: (function () {
        const S = scene(540, 250, [-1, -1.6, 24, 9], 10);
        const ov = (A, B) => { const c = clipPoly(ccwP(A), ccwP(B)); return c.length >= 3 ? polyArea(c) : 0; };
        P_SQUARE.forEach((p, i) => chk('para-chessboard-65', polyArea(p), [20, 20, 12, 12][i], 1e-9));
        P_RECT.forEach((p, i) => chk('para-chessboard-65', polyArea(p), [20, 20, 12, 12][i], 1e-9));
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) chk('para-chessboard-65', ov(P_RECT[i], P_RECT[j]), 0, 1e-9);
        P_SQUARE.forEach((p, i) => S.poly(p, { fill: PCOL[i], sw: 1.8 }));
        S.grid(0, 0, 8, 8, 1, { stroke: 'rgba(58,48,32,0.22)', sw: 1 });
        const sh = (p) => [p[0] + 10, p[1]];
        P_RECT.forEach((p, i) => S.poly(p.map(sh), { fill: PCOL[i], sw: 1.8 }));
        S.grid(10, 0, 23, 5, 1, { stroke: 'rgba(58,48,32,0.22)', sw: 1 });
        S.text([4, 0], '8 × 8 = 64', { dy: 20, size: 16 }); S.text([16.5, 0], '5 × 13 = 65', { dy: 20, size: 16 });
        return S.out();
      })()
    },
    concepts: ['fibonacci', 'area', 'dissection'], links: ['para-sliver-thickness', 'para-fib-13', 'para-curry-sliver']
  });

  puzzle({
    id: 'para-sliver-thickness', title: 'How Thin Is the Gap?', diff: 4,
    text: 'In the rectangle of the 64 = 65 chessboard, the four pieces leave a thin gap along the diagonal: a parallelogram with corners (0, 0), (5, 2), (13, 5) and (8, 3), measured in squares of the board. Its area is one whole square.\n\nHow **thick** is the gap, that is, the distance between its two long sides, in units of one square? Give it to three decimal places.',
    hints: ['For a parallelogram, area = long side × distance between the long sides. You know the area.', 'The long sides are the slanted edges from (0, 0) to (8, 3) and from (5, 2) to (13, 5). How long is one of them, by Pythagoras?'],
    explain: 'The long sides run along the vector (8, 3), which has length √(8² + 3²) = √73 ≈ 8.544 squares. The gap is a parallelogram of area 1, so its thickness is area ÷ length = 1 ÷ √73 ≈ **0.117** of a square. On a real chessboard with squares 5 cm wide the gap would be under 0.6 mm thick along a line of 43 cm: invisible, unless you know where to look.',
    data: {
      answer: { num: 0.11704, tol: 0.0006, show: '0.117' }, ask: 'Thickness in squares, to three decimals.', glyph: '▱',
      traps: [{ match: 1, msg: '1 is the area of the gap (in squares). The thickness is much smaller.' }, { match: 0.186, msg: 'That is 1 ÷ √29: the thickness measured against the other pair of sides (5, 2). The two long sides are the ones along (8, 3).' }],
      figure: (function () {
        const S = scene(540, 230, [-0.6, -0.8, 13.6, 5.8], 10);
        const A = [0, 0], B = [8, 3], C = [13, 5], D = [5, 2];
        chk('para-sliver-thickness', polyArea([A, D, C, B]), 1, 1e-9);
        chk('para-sliver-thickness', 1 / Math.hypot(8, 3), 0.11704, 1e-5);
        P_RECT.forEach((p, i) => S.poly(p, { fill: PCOL[i], sw: 1.4 }));
        S.poly([A, D, C, B], { fill: RED, stroke: RED, sw: 1.6 });
        S.text([6.5, 0], '13', { dy: 18, size: 15 }); S.text([0, 2.5], '5', { dx: -14, size: 15 });
        S.text([10, 2.4], 'the gap', { size: 16, it: true, fill: RED, dx: 0, dy: -8 });
        return S.out();
      })()
    },
    concepts: ['area', 'pythagoras', 'fibonacci'], links: ['para-chessboard-65']
  });

  puzzle({
    id: 'para-fib-13', title: 'The Same Trick with 13', diff: 2,
    text: 'The same trick is played on a bigger board of 13 × 13 = 169 squares. It is cut along lines like those of the 8 × 8 board (the numbers 5, 8 and 13 take the place of 3, 5 and 8), and the pieces are rearranged into a rectangle **8 squares high and 21 squares long**.\n\nHow many squares does this rectangle have?',
    hints: ['A rectangle 8 high and 21 long: multiply.', 'Compare with the 169 you started with: is it one more, as before, or one fewer?'],
    explain: 'The rectangle has 8 × 21 = **168** squares, one fewer than the 169 of the board. This time the pieces cannot fill the rectangle: the slanted edges (slopes 5 ÷ 13 and 3 ÷ 8) overlap along the diagonal by a very thin sliver whose area is exactly one square. The Fibonacci numbers alternate between “one more” and “one less”: 5 × 13 = 65 is above 8² = 64, but 8 × 21 = 168 is below 13² = 169.',
    data: {
      answer: { num: 168 }, glyph: '13²',
      traps: [{ match: 169, msg: '169 is the board you started with. The rectangle 8 × 21 has a different number of squares: multiply and see.' }, { match: 170, msg: 'Multiply 8 × 21 carefully: 8 × 20 = 160, plus 8.' }],
      figure: (function () {
        const S = scene(440, 400, [-1, -1, 14, 14], 12);
        chk('para-fib-13', 8 * 21, 168);
        const T1 = [[0, 0], [8, 0], [8, 8], [0, 5]], T2 = [[0, 5], [8, 8], [8, 13], [0, 13]], R1 = [[13, 0], [13, 13], [8, 13]], R2 = [[8, 13], [8, 0], [13, 0]];
        [[T1, SB], [T2, SG], [R1, SR], [R2, SY]].forEach(([p, f]) => S.poly(p, { fill: f, sw: 1.8 }));
        S.grid(0, 0, 13, 13, 1, { stroke: 'rgba(58,48,32,0.18)', sw: 1 });
        S.text([6.5, 0], '13', { dy: 18, size: 15 }); S.text([0, 6.5], '13', { dx: -16, size: 15 });
        return S.out();
      })()
    },
    concepts: ['fibonacci', 'area'], links: ['para-chessboard-65', 'para-fib-alternates']
  });

  puzzle({
    id: 'para-fib-alternates', title: 'Which Boards Gain a Square?', diff: 4,
    source: 'The rule behind it is Cassini’s identity for the Fibonacci numbers (Giovanni Cassini, 1680).',
    text: 'A Fibonacci board is cut like the 8 × 8 one and rearranged into a rectangle whose sides are the Fibonacci numbers just before and just after the side of the board (for the 8 × 8 board: 5 and 13). For some boards the rectangle has **one more** square than the board, for the others **one fewer**.\n\nWhich of these boards give a rectangle with **one more** square?',
    goal: 'Choose every board whose rectangle has one more square.',
    hints: ['Just work out the products: 5 × 5 against 3 × 8, and so on.', 'The Fibonacci numbers are 1, 1, 2, 3, 5, 8, 13, 21, 34. Compare F × F with the product of its two neighbours, for each board.'],
    explain: 'Just multiply. 5 × 5 = 25 against 3 × 8 = 24: one fewer. 8 × 8 = 64 against 5 × 13 = 65: **one more**. 13 × 13 = 169 against 8 × 21 = 168: one fewer. 21 × 21 = 441 against 13 × 34 = 442: **one more**. This is Cassini’s identity: for the Fibonacci numbers the product of the two neighbours of a number differs from its square by exactly 1, with the sign alternating: F<sub>n−1</sub> × F<sub>n+1</sub> − F<sub>n</sub>² = (−1)<sup>n</sup>. So boards of side 8, 21, 55 … give a rectangle with one square too many (a thin gap), and boards of side 5, 13, 34 … give one square too few (a thin overlap).',
    data: {
      answer: { multi: [1, 3], choices: ['5 × 5 → 3 × 8', '8 × 8 → 5 × 13', '13 × 13 → 8 × 21', '21 × 21 → 13 × 34'] }, glyph: '±1',
      traps: [],
      figure: (function () {
        const S = scene(540, 120, [0, 0, 54, 12], 8);
        const seq = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
        seq.forEach((f, i) => {
          const x = 2 + i * 5.2;
          chk('para-fib-alternates', i < 2 || seq[i] === seq[i - 1] + seq[i - 2] ? 0 : 1, 0);
          S.poly([[x, 3], [x + 4.4, 3], [x + 4.4, 8], [x, 8]], { fill: [SB, SG, SR, SY][i % 4], sw: 1.8 });
          S.text([x + 2.2, 5.5], String(f), { size: f > 9 ? 16 : 18, bold: true, halo: false });
        });
        S.text([27, 10.6], 'the Fibonacci numbers', { size: 14, it: true, fill: GREY, halo: false });
        return S.out();
      })()
    },
    concepts: ['fibonacci', 'invariant'], links: ['para-fib-13', 'para-chessboard-65']
  });

  puzzle({
    id: 'para-fib-squares-sum', title: 'Squares in a Spiral', diff: 3,
    text: 'Squares with sides **1, 1, 2, 3, 5, 8 and 13** are fitted together to make a rectangle, as in the picture: each new square is placed along the whole side of the rectangle built so far.\n\nWhat is the **total area** of the seven squares?',
    hints: ['Do not add the seven squares one by one. Look at the finished rectangle: how tall is it? How wide?', 'The height is the biggest square, 13. The width is 8 + 13, the last two squares.'],
    explain: 'The squares fit together into a rectangle 13 high and 8 + 13 = 21 wide, so the total area is 13 × 21 = **273**. Adding the squares one by one gives the same: 1 + 1 + 4 + 9 + 25 + 64 + 169 = 273. This is a general fact: the sum of the squares of the first n Fibonacci numbers is F<sub>n</sub> × F<sub>n+1</sub>. The curve through the corners of these squares is the famous Fibonacci spiral.',
    data: {
      answer: { num: 273 }, glyph: '🐚',
      traps: [{ match: 169, msg: '169 is the largest square only. All seven squares are inside the rectangle.' }, { match: 33, msg: '33 is the sum of the sides 1 + 1 + 2 + 3 + 5 + 8 + 13. We need the sum of the areas: the squares of the sides.' }],
      figure: (function () {
        const S = scene(540, 350, [-6, -4.6, 17, 11.6], 8);
        const sq = [[0, 1, 0, 1], [1, 2, 0, 1], [0, 2, 1, 3], [-3, 0, 0, 3], [-3, 2, -5, 0], [2, 10, -5, 3], [-3, 10, 3, 16]];   // x0, x1, y0, y1 in the tall version
        const sides = [1, 1, 2, 3, 5, 8, 13];
        let total = 0;
        sq.forEach((q, i) => {
          chk('para-fib-squares-sum', q[1] - q[0], sides[i]); chk('para-fib-squares-sum', q[3] - q[2], sides[i]);
          total += sides[i] * sides[i];
          // laid on its side: (x, y) -> (y, x)
          S.poly([[q[2], q[0]], [q[3], q[0]], [q[3], q[1]], [q[2], q[1]]], { fill: [SB, SG, SR, SY, SN, SB, SG][i], sw: 1.8 });
          S.text([(q[2] + q[3]) / 2, (q[0] + q[1]) / 2], String(sides[i]), { size: sides[i] > 3 ? 20 : 14, bold: true, halo: false, fill: INK });
        });
        chk('para-fib-squares-sum', total, 273);
        chk('para-fib-squares-sum', 13 * 21, 273);
        return S.out();
      })()
    },
    concepts: ['fibonacci', 'area'], links: ['para-golden-ratio']
  });

  puzzle({
    id: 'para-golden-ratio', title: 'Where the Ratios Are Heading', diff: 4,
    text: 'Divide each Fibonacci number by the one before it: 1 ÷ 1, 2 ÷ 1, 3 ÷ 2, 5 ÷ 3, 8 ÷ 5, 13 ÷ 8, 21 ÷ 13, 34 ÷ 21, … The results wobble up and down, but they settle towards one particular number. (In the picture, a rectangle whose long side is this number times its short side, when a square is cut from it, leaves a smaller rectangle of the same shape.)\n\nWhat is that number? Give it to three decimal places.',
    hints: ['Suppose the ratio of a long side to the short side is x. After removing the square the new rectangle has sides 1 (short) and x − 1 (long): its ratio is 1 ÷ (x − 1).', 'For the same shape, x = 1 ÷ (x − 1), that is x² − x − 1 = 0. Solve it for the positive root.'],
    explain: 'Let a rectangle have a short side 1 and a long side x. Cut a square off the short end. The piece that remains has sides 1 and x − 1, and it has the same shape as the whole exactly when x ÷ 1 = 1 ÷ (x − 1), so x(x − 1) = 1, x² − x − 1 = 0, and x = (1 + √5) ÷ 2 = **1.618…**, the golden ratio. The same equation appears in the Fibonacci numbers: since each is the sum of the two before, the ratio r of neighbours obeys r = 1 + 1 ÷ r in the limit, which is the same equation. The ratios 21/13 = 1.615 and 34/21 = 1.619 are already close.',
    data: {
      answer: { num: 1.618034, tol: 0.0006, show: '1.618' }, glyph: 'φ',
      traps: [{ match: 1.5, msg: '1.5 = 3/2 is one of the early ratios. The ratios keep changing: try 13/8 and 21/13.' }, { match: 2, msg: '2 is the second ratio, 2/1. The later ratios are much closer to each other.' }],
      figure: (function () {
        const S = scene(520, 220, [-0.4, -0.4, 4.4, 2.6], 12);
        const ph = (1 + Math.sqrt(5)) / 2;
        chk('para-golden-ratio', ph / 1, 1 / (ph - 1), 1e-12);
        const w = 2.6 * 0.72;
        S.poly([[0, 0], [1 * 2.4, 0], [1 * 2.4, 2.4], [0, 2.4]], { fill: SB, sw: 2 });
        S.poly([[2.4, 0], [ph * 2.4, 0], [ph * 2.4, 2.4], [2.4, 2.4]], { fill: SY, sw: 2 });
        S.text([1.2, 1.2], 'square', { size: 15, it: true, halo: false }); S.text([2.4 + (ph * 2.4 - 2.4) / 2, 1.2], 'same shape', { size: 13, it: true, halo: false });
        S.text([ph * 1.2, 0], '?', { dy: 20, size: 22, bold: true, fill: RED }); S.text([0, 1.2], '1', { dx: -14, size: 16 });
        return S.out();
      })()
    },
    concepts: ['fibonacci', 'similarity'], links: ['para-fib-squares-sum', 'geo-pentagon-diagonal']
  });

  puzzle({
    id: 'para-curry-sliver', title: 'The Bent Edge of Curry’s Triangle', diff: 3,
    source: 'From the missing-square puzzle of Paul Curry (1953).',
    text: 'A blue triangle (8 across, 3 up) and a red triangle (5 across, 2 up) are placed with their slanted sides end to end, as in the picture, so that the long edge looks like the straight side of a bigger triangle 13 across and 5 up (the dashed line). But the edge is not straight: it bends at the joint of the two triangles.\n\nWhat is the area of the thin triangle between the bent edge and the dashed straight line?',
    hints: ['The thin triangle has corners at (0, 0), (8, 3) and (13, 5). Its area from coordinates: ½ |x₁y₂ − x₂y₁| with the vectors from (0, 0).', 'The vectors are (8, 3) and (13, 5): 8 × 5 − 13 × 3 = 40 − 39.'],
    explain: 'With one corner at the origin, a triangle with the other corners at (8, 3) and (13, 5) has area ½ × |8 × 5 − 13 × 3| = ½ × |40 − 39| = **½**. (It is a “lattice triangle” with no grid point inside or on its edges other than its corners, so Pick’s theorem gives ½ too.) In Curry’s puzzle the bend is inward in one arrangement and outward in the other, so the two shapes differ by two of these slivers: 2 × ½ = one whole square.',
    data: {
      answer: { num: 0.5, show: '1/2' }, glyph: '½',
      traps: [{ match: 1, msg: '1 square is the difference between the two arrangements, that is, two slivers of this kind. One sliver is half of that.' }, { match: 0, msg: 'It is thin but not empty: 8 × 5 and 13 × 3 are 40 and 39, not equal.' }],
      figure: (function () {
        const S = scene(540, 210, [-0.8, -0.8, 14, 5.8], 10);
        const A = [0, 0], B = [8, 3], C = [13, 5];
        chk('para-curry-sliver', polyArea([A, B, C]), 0.5, 1e-12);
        S.poly([[0, 0], [8, 0], [8, 3]], { fill: SB, sw: 2 }); S.poly([[8, 3], [13, 3], [13, 5]], { fill: SR, sw: 2 });
        S.poly([A, B, C], { fill: '#c04a2a', stroke: null });
        S.line(A, C, { stroke: INK, sw: 1.4, dash: '5 4' }); S.pl([A, B, C], { sw: 2.2 });
        S.text([4, 0], '8', { dy: 16, size: 15 }); S.text([8, 1.5], '3', { dx: 12, size: 15 }); S.text([10.5, 3], '5', { dy: 15, size: 15 }); S.text([13, 4], '2', { dx: 12, size: 15 });
        return S.out();
      })()
    },
    concepts: ['area', 'lattice-geometry'], links: ['geo-missing-square', 'geo-empty-triangle']
  });


  /* =====================  STAIRCASES, SNOWFLAKES AND SIEVES  ===================== */

  // the Koch curve from a to b, as a list of points (b left out), turning the bumps to the right of the direction of travel
  function koch(a, b, depth) {
    if (!depth) return [a];
    const d = sub(b, a), p1 = add(a, mul(d, 1 / 3)), p2 = add(a, mul(d, 2 / 3)), pk = add(p1, rot(sub(p2, p1), -60));
    return [].concat(koch(a, p1, depth - 1), koch(p1, pk, depth - 1), koch(pk, p2, depth - 1), koch(p2, b, depth - 1));
  }
  const snowflake = (side, depth) => {
    const V = [[0, 0], [side, 0], [side / 2, side * Math.sqrt(3) / 2]];
    return [].concat(koch(V[0], V[1], depth), koch(V[1], V[2], depth), koch(V[2], V[0], depth));
  };
  const pathLen = (pts, closed) => { let s = 0; for (let i = 0; i < pts.length - (closed ? 0 : 1); i++) s += dist(pts[i], pts[(i + 1) % pts.length]); return s; };

  puzzle({
    id: 'para-staircase-length', title: 'A Staircase to the Corner', diff: 2,
    text: 'A path goes from the bottom-left corner to the top-right corner of a square field, **10 m** on each side. It goes in equal steps, always one step to the right and then one step up, and there are **100 steps** (each step is 0.1 m across and 0.1 m up). Seen from a distance it looks just like the diagonal of the field.\n\nHow long is the path?',
    hints: ['You do not need to count the steps one by one: add up all the distances gone to the right, and all those gone up.', 'Altogether the path goes 10 m to the right and 10 m up. The diagonal is much shorter (14.14 m), but the diagonal is not what we are walking on.'],
    explain: 'Every step goes 0.1 m right and 0.1 m up, so in all the path goes 100 × 0.1 = 10 m to the right and 10 m up: **20 m**. And the same is true with 10 steps, or 1000, or a million: however small the steps, the path is 20 m long, though it hugs the diagonal (which is only 14.14 m long) ever more closely. The lengths of the paths do not approach the length of their limit. That is the fallacy behind the famous “proof” that √2 = 2.',
    data: {
      answer: { num: 20, unit: 'm' }, glyph: '▟',
      traps: [{ match: 14.14, msg: '14.14 m is the diagonal, √(10² + 10²). But the path is made of steps that go only right or up, not along the diagonal.' }, { match: 10, msg: '10 m is only the way across. The path also goes 10 m up.' }],
      figure: (function () {
        const S = scene(480, 400, [-1, -1, 11, 11], 16);
        const stairs = (n) => { const pts = [[0, 0]]; for (let i = 0; i < n; i++) { pts.push([(i + 1) * 10 / n, i * 10 / n], [(i + 1) * 10 / n, (i + 1) * 10 / n]); } return pts; };
        [[2, BLUE], [4, GREEN], [8, RED]].forEach(([n, c]) => { const P = stairs(n); chk('para-staircase-length', pathLen(P), 20, 1e-9); S.pl(P, { stroke: c, sw: 2.4 }); });
        S.poly([[0, 0], [10, 0], [10, 10], [0, 10]], { fill: null, sw: 2.2 });
        S.line([0, 0], [10, 10], { stroke: INK, sw: 1.6, dash: '5 4' });
        S.text([5, 0], '10 m', { dy: 20, size: 15 });
        return S.out();
      })()
    },
    concepts: ['limits', 'pythagoras'], links: ['para-staircase-pi', 'para-koch-perimeter']
  });

  puzzle({
    id: 'para-staircase-pi', title: 'The Proof That π = 4', diff: 3,
    text: 'A circle of diameter **2** fits exactly inside a square of side 2, whose perimeter is 8. Now cut the corners of the square away with a staircase that touches the circle, then make the staircase finer, and finer, as in the picture (drawn for one quarter). Each staircase goes 2 across and 2 up in every quarter, so its length is always **8**, and the staircases get as close to the circle as you like. So, the “proof” concludes, the circle’s circumference, π × 2, is 8: π = 4.\n\nWhat is wrong with the argument?',
    goal: 'Choose the flaw in the reasoning.',
    hints: ['Is it true that the staircases get closer and closer to the circle? (In position, yes.) And do their lengths get closer and closer to its length?', 'A staircase, however fine, always goes in just two directions: right and up. It is nowhere near the circle in direction.'],
    explain: 'The staircases really do come as close to the circle as you like in **position**, but their **lengths** have nothing to do with the length of the circle: each step goes along a horizontal or vertical line, never in the direction of the curve, and however small the steps are, the total is still 8. The limit of the lengths (8) is not the length of the limit (2π ≈ 6.28). In the same way the staircases in the diagonal “proof” of √2 = 2 always have length 2. Length is not preserved when shapes get close in position only: you need the directions to get close too, and that happens for inscribed polygons, whose lengths do approach 2π.',
    data: {
      answer: { choice: 1, choices: ['The staircases never really get close to the circle.', 'The staircases get close to the circle in position but not in direction, so their lengths need not approach its length.', 'The perimeter of the square is not 8.', 'A circle has no length, so nothing can be said.'] }, glyph: 'π=4',
      traps: [{ match: 0, msg: 'They do get as close as you like (each step is smaller than any gap you choose). Look at how the length behaves instead.' }, { match: 2, msg: 'The square of side 2 does have perimeter 8. The staircases keep that length. Where does the argument then go wrong?' }, { match: 3, msg: 'A circle has a length: 2π for a diameter of 2. The flaw lies in what “getting closer” means for lengths.' }],
      figure: (function () {
        const S = scene(440, 420, [-1.2, -1.2, 1.2, 1.2], 14);
        const n = 6;
        S.poly([[-1, -1], [1, -1], [1, 1], [-1, 1]], { fill: SN, sw: 2.2 });
        S.circ([0, 0], 1, { fill: SB, stroke: BLUE, sw: 2.4 });
        const quarter = (rotDeg) => {
          const pts = [[1, 0]], th = (j) => (j * 90 / n) * RAD;
          let cur = [1, 0];
          for (let j = 1; j <= n; j++) { cur = [cur[0], Math.sin(th(j))]; pts.push(cur); cur = [Math.cos(th(j)), cur[1]]; pts.push(cur); }
          return pts.map((p) => rot(p, rotDeg));
        };
        const Q = quarter(0);
        chk('para-staircase-pi', pathLen(Q, false), 2, 1e-9);
        [0, 90, 180, 270].forEach((d) => S.pl(quarter(d), { stroke: RED, sw: 2.2 }));
        return S.out();
      })()
    },
    concepts: ['limits'], links: ['para-staircase-length']
  });

  puzzle({
    id: 'para-koch-perimeter', title: 'The Snowflake Curve', diff: 4,
    source: 'The snowflake curve of the Swedish mathematician Helge von Koch, described in 1904.',
    text: 'Start with an equilateral triangle with sides of **9 cm**. On the middle third of every side put a small equilateral triangle pointing outwards and remove the base of the small triangle (see the picture for two steps of this). Then do the same to every side of the new shape, and so on.\n\nHow long is the outline after **three** steps?',
    hints: ['Look at what one step does to one side: a piece of length 1 (thirds) is replaced by four pieces, each a third as long.', 'The outline’s length is multiplied by 4/3 in each step. Start: 3 × 9 = 27 cm.'],
    explain: 'One step replaces every straight piece by four pieces, each a third as long: the total length is multiplied by 4/3. Starting from 27 cm, after 3 steps it is 27 × (4/3)³ = 27 × 64/27 = **64 cm**. Since 4/3 is bigger than 1, the outline grows without limit as the steps go on: the snowflake curve has an infinitely long edge, though it encloses only a finite area ([[para-koch-area|another puzzle]] finds it).',
    data: {
      answer: { num: 64, unit: 'cm' }, glyph: '❄',
      traps: [{ match: 36, msg: '36 = 27 + 9 is not how it grows: every step multiplies the whole length by 4/3.' }, { match: 48, msg: '48 is the length after two steps (27 × 16/9). One step more.' }],
      figure: (function () {
        const S = scene(480, 420, [-2.6, -3.4, 11.6, 10.8], 10);
        chk('para-koch-perimeter', pathLen(snowflake(9, 3), true), 64, 1e-9);
        chk('para-koch-perimeter', pathLen(snowflake(9, 2), true), 48, 1e-9);
        S.poly(snowflake(9, 2), { fill: SB, sw: 1.8 });
        S.poly([[0, 0], [9, 0], [4.5, 9 * Math.sqrt(3) / 2]], { fill: null, stroke: GREY, sw: 1.4, dash: '5 4' });
        return S.out();
      })()
    },
    concepts: ['fractals', 'limits', 'geometric-series'], links: ['para-koch-area', 'para-coastline']
  });

  puzzle({
    id: 'para-koch-area', title: 'The Endless Edge Around a Finite Area', diff: 5,
    source: 'The snowflake curve of Helge von Koch (1904).',
    text: 'The snowflake curve is made from a triangle with an area of **15 cm²** by putting a smaller triangle on the middle third of every side, again and again for ever. Its outline becomes infinitely long.\n\nBut what is the **area** enclosed by the finished snowflake?',
    hints: ['First step: three little triangles are added, each with sides a third of the big one. What fraction of the original area is each?', 'In every later step there are four times as many new triangles as in the one before, and each has one ninth of the area of the previous ones. Add up the geometric series.'],
    explain: 'The first step adds 3 small triangles, each with area (1/3)² = 1/9 of the original: 3/9 = 1/3 of the original altogether. The next step adds 12 triangles of area 1/81, that is 12/81 = 4/27, and each following step multiplies the added area by 4/9. The total added is (1/3) × (1 + 4/9 + (4/9)² + …) = (1/3) × 1/(1 − 4/9) = (1/3) × 9/5 = 3/5 of the original. So the snowflake has area 1 + 3/5 = 8/5 of the triangle: 15 × 8/5 = **24 cm²**. A finite area bounded by an infinitely long line: length and area are not tied together.',
    data: {
      answer: { num: 24, unit: 'cm²' }, glyph: '8/5',
      traps: [{ match: 15, msg: '15 cm² is the area of the starting triangle. The bumps add to it.' }, { match: 20, msg: '20 would be 4/3 of the triangle (the first step + a third): the later steps add more.' }, { match: 60, msg: 'The area does not grow without bound. Each step adds only 4/9 of what the step before added.' }],
      figure: (function () {
        const S = scene(480, 420, [-2.6, -3.4, 11.6, 10.8], 10);
        const a0 = polyArea([[0, 0], [9, 0], [4.5, 9 * Math.sqrt(3) / 2]]);
        chk('para-koch-area', polyArea(snowflake(9, 6)) / a0, 1.6 - 0.6 * Math.pow(4 / 9, 6), 1e-9);
        chk('para-koch-area', polyArea(snowflake(9, 6)) / a0, 1.6, 0.01);
        S.poly(snowflake(9, 3), { fill: SB, sw: 1.4 });
        S.poly([[0, 0], [9, 0], [4.5, 9 * Math.sqrt(3) / 2]], { fill: SY, sw: 1.4 });
        S.text([4.5, 2.6], '15 cm²', { size: 16, halo: false });
        return S.out();
      })()
    },
    concepts: ['fractals', 'geometric-series', 'area'], links: ['para-koch-perimeter']
  });

  puzzle({
    id: 'para-coastline', title: 'The Coastline That Keeps Growing', diff: 3,
    text: 'A coast has a shape that repeats at every scale: a straight piece of length 1 is replaced by four pieces of length ⅓ (the snowflake rule), and every one of those is replaced in the same way, and so on. You measure the coast with a ruler and count how many rulers you need.\n\nWith a ruler of length **1/27** of the original straight piece, what length do you measure, in units of the original piece? Give it to two decimal places.',
    hints: ['A ruler of length 1/3 can only see the first step: four pieces of length 1/3. What does a ruler of length 1/9 see?', 'Each time the ruler is three times shorter, the number of pieces is multiplied by 4, but each piece is three times shorter: the length is multiplied by 4/3.'],
    explain: 'A ruler of length 1/3 measures 4 pieces: length 4/3. A ruler of 1/9 measures 16 pieces: 16/9. A ruler of 1/27 measures 64 pieces: 64/27 = **2.37**. Each time the ruler is made three times shorter, the measured length grows by a factor 4/3, and it never settles: there is no single “length of the coast”, only a length at each ruler size. Real coastlines behave like this over a wide range of scales, as the British scientist Lewis Fry Richardson noticed, and as Benoit Mandelbrot made famous in 1967 with the question “How long is the coast of Britain?”',
    data: {
      answer: { num: 2.37037, tol: 0.005, show: '2.37' }, glyph: '🏝',
      traps: [{ match: 1.78, msg: '1.78 is 16/9, the length seen by a ruler of 1/9. The ruler of 1/27 sees one more step.' }, { match: 1, msg: '1 is the distance in a straight line. A ruler that sees the bumps counts more.' }],
      figure: (function () {
        const S = scene(520, 170, [-0.05, -0.38, 1.05, 0.3], 14);
        const pts = koch([0, 0], [1, 0], 3).concat([[1, 0]]);
        chk('para-coastline', pathLen(koch([0, 0], [1, 0], 3).concat([[1, 0]]), false), 64 / 27, 1e-9);
        S.pl(pts, { stroke: BLUE, sw: 2.4 });
        S.line([0, -0.24], [1 / 3, -0.24], { stroke: RED, sw: 4 }); S.text([1 / 6, -0.24], 'a ruler of 1/3', { dy: 18, size: 14, it: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['fractals', 'limits'], links: ['para-koch-perimeter']
  });

  puzzle({
    id: 'para-sierpinski-area', title: 'Holes in the Triangle', diff: 3,
    source: 'The Sierpinski triangle, described by the Polish mathematician Wacław Sierpiński in 1915.',
    text: 'Start with a solid equilateral triangle of area **64 cm²**. Join the midpoints of its sides and remove the middle triangle (the one pointing down). Do the same to each of the three triangles that remain, then to each of the nine that remain, and so on. The picture shows the result of three rounds.\n\nHow much area is left after **three** rounds?',
    hints: ['One round: the middle triangle is a quarter of the area. What fraction is left?', 'Each round leaves 3/4 of what was there before. Do that three times.'],
    explain: 'The middle triangle is a quarter of the area, so each round leaves three quarters. After three rounds the area left is 64 × (3/4)³ = 64 × 27/64 = **27 cm²**: there are 27 little triangles, each 1/64 of the original. After many rounds the area left goes to zero, yet the shape does not vanish: what remains is the Sierpinski triangle, a lace of lines with no area at all.',
    data: {
      answer: { num: 27, unit: 'cm²' }, glyph: '🔺',
      traps: [{ match: 48, msg: '48 is what is left after one round (three quarters of 64). Two more rounds to go.' }, { match: 16, msg: '16 is a quarter. Each round removes a quarter of what is there and leaves three quarters.' }],
      figure: (function () {
        const S = scene(480, 400, [-0.5, -0.5, 16.5, 15], 12);
        const tris = [];
        const rec = (a, b, c, d) => { if (!d) { tris.push([a, b, c]); return; } const ab = mid(a, b), bc = mid(b, c), ca = mid(c, a); rec(a, ab, ca, d - 1); rec(ab, b, bc, d - 1); rec(ca, bc, c, d - 1); };
        const A = [0, 0], B = [16, 0], C = [8, 8 * Math.sqrt(3)];
        rec(A, B, C, 3);
        chk('para-sierpinski-area', tris.length, 27);
        chk('para-sierpinski-area', tris.reduce((s, t) => s + polyArea(t), 0) / polyArea([A, B, C]) * 64, 27, 1e-9);
        S.poly([A, B, C], { fill: '#efe7d0', stroke: GREY, sw: 1.2, dash: '4 4' });
        tris.forEach((t) => S.poly(t, { fill: SG, sw: 1.4 }));
        return S.out();
      })()
    },
    concepts: ['fractals', 'geometric-series', 'area'], links: ['para-carpet', 'para-koch-area']
  });

  puzzle({
    id: 'para-carpet', title: 'The Carpet with Holes in Holes', diff: 3,
    source: 'The Sierpinski carpet (Wacław Sierpiński, 1916).',
    text: 'A square carpet of 27 × 27 = 729 little squares has these holes made in it. First the middle 9 × 9 block is removed. Then, in each of the eight 9 × 9 blocks that are left, the middle 3 × 3 block is removed (that is what the picture shows). Finally, in each 3 × 3 block that is left, the single middle square is removed.\n\nHow many little squares are left in the carpet?',
    hints: ['Count the 3 × 3 blocks left in the picture: how many are there?', 'Each of those blocks has 9 little squares, and the last step removes the middle one from each.'],
    explain: 'After the first step 8/9 of the carpet remains, after the second (8/9)² and after the third (8/9)³. Of the 729 little squares that is 729 × 512/729 = **512** squares. In the picture there are 64 blocks of 3 × 3; the last step takes one square out of each, leaving 64 × 8 = 512. Continuing for ever, the fraction (8/9)ⁿ tends to zero: the carpet has no area left, but it is far from empty.',
    data: {
      answer: { num: 512 }, glyph: '▦',
      traps: [{ match: 576, msg: '576 is what is left before the last step (64 blocks of 9 squares). One more middle square has to go from each block.' }, { match: 648, msg: '648 is 729 − 81, one round only. Two more rounds are still to come.' }],
      figure: (function () {
        const S = scene(420, 420, [-1, -1, 28, 28], 10);
        let kept = 0;
        const dg = (n, k) => Math.floor(n / Math.pow(3, k)) % 3;
        for (let bx = 0; bx < 9; bx++) for (let by = 0; by < 9; by++) {
          if ((dg(bx, 0) === 1 && dg(by, 0) === 1) || (dg(bx, 1) === 1 && dg(by, 1) === 1)) continue;
          kept++;
          S.poly([[3 * bx, 3 * by], [3 * bx + 3, 3 * by], [3 * bx + 3, 3 * by + 3], [3 * bx, 3 * by + 3]], { fill: SB, stroke: 'rgba(58,48,32,0.5)', sw: 0.8 });
        }
        chk('para-carpet', kept, 64); chk('para-carpet', kept * 8, 512);
        S.poly([[0, 0], [27, 0], [27, 27], [0, 27]], { fill: null, sw: 2.4 });
        return S.out();
      })()
    },
    concepts: ['fractals', 'geometric-series'], links: ['para-sierpinski-area']
  });


  /* =====================  SAME PERIMETER, DIFFERENT AREA  ===================== */

  // the areas of the 2n slices of a disc of radius R cut by n lines through P, the lines 180/n degrees apart
  function pizzaAreas(R, P, nLines, phi0) {
    const N = 20000, slices = 2 * nLines, areas = new Array(slices).fill(0);
    for (let i = 0; i < N; i++) {
      const t = (i + 0.5) / N * 2 * Math.PI, dx = Math.cos(t), dy = Math.sin(t);
      const b = P[0] * dx + P[1] * dy, c = P[0] * P[0] + P[1] * P[1] - R * R, s = -b + Math.sqrt(b * b - c);
      const ang = ((t - phi0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
      areas[Math.floor(ang / (2 * Math.PI / slices))] += 0.5 * s * s * (2 * Math.PI / N);
    }
    return areas;
  }
  function drawPizza(S, R, P, nLines, phi0) {
    const slices = 2 * nLines, step = 2 * Math.PI / slices;
    const Q = Array.from({ length: slices }, (_, k) => {
      const t = phi0 + k * step, dx = Math.cos(t), dy = Math.sin(t), b = P[0] * dx + P[1] * dy, c = P[0] * P[0] + P[1] * P[1] - R * R, s = -b + Math.sqrt(b * b - c);
      return [P[0] + s * dx, P[1] + s * dy];
    });
    S.circ([0, 0], R, { fill: '#f3d9a4', stroke: '#b06b2a', sw: 3.2 });
    for (let k = 0; k < slices; k++) S.path(S.M(P) + S.L(Q[k]) + S.A(R, Q[(k + 1) % slices], 0, true) + 'Z', { fill: k % 2 ? '#f4c27a' : '#e58f6c', stroke: '#8a4a1c', sw: 1.6 });
    S.dot(P, { r: 4.2, fill: INK });
    S.circ([0, 0], 0.15, { fill: GREY, stroke: null });
  }
  const oddSum = (a) => a.filter((_, i) => i % 2).reduce((s, x) => s + x, 0), evenSum = (a) => a.filter((_, i) => i % 2 === 0).reduce((s, x) => s + x, 0);

  puzzle({
    id: 'para-pizza-8', title: 'The Pizza Theorem', diff: 3,
    source: 'The pizza theorem, posed as a problem by L. J. Upton in 1967.',
    text: 'A round pizza of radius **10 cm** is cut with four straight cuts through a point P that is **not** the centre, the cuts making equal angles of 45° with each other. That gives eight slices. Two friends take the slices alternately, one the darker ones and one the lighter ones (as in the picture).\n\nHow much pizza does each of them get, in cm²? Give the answer as a multiple of π.',
    hints: ['The whole pizza has area π × 10² = 100π. If P were the centre, how would it be shared?', 'It is a surprising theorem that it is still shared equally when P is anywhere inside, provided the cuts are eight equal angles.'],
    explain: 'The pizza has area π × 10² = 100π cm². The **pizza theorem** says that when you cut a disc by four lines through any point, at 45° to each other, the slices taken alternately add up to exactly half of the disc each: **50π cm²** ≈ 157 cm² apiece, wherever P is. (Numerical check for the pizza in the picture: the two shares are ' + (function () { const a = pizzaAreas(10, [4, 1], 4, 0.3); return evenSum(a).toFixed(3) + ' and ' + oddSum(a).toFixed(3); })() + ' cm².) It works for 8, 12, 16, … slices, but not for 4 or 6: see [[para-pizza-6|the six-slice pizza]].',
    data: {
      answer: { num: 50 }, ask: 'Each friend gets ? × π cm². Give the number in front of π.', glyph: '🍕',
      traps: [{ match: 100, msg: '100π is the whole pizza. Each friend gets half.' }, { match: 25, msg: 'That would be a quarter of the pizza each. There are only two friends, taking alternate slices.' }],
      figure: (function () {
        const S = scene(440, 400, [-11, -11, 11, 11], 10);
        const a = pizzaAreas(10, [4, 1], 4, 0.3);
        chk('para-pizza-8', evenSum(a), oddSum(a), 0.01); chk('para-pizza-8', evenSum(a), 50 * Math.PI, 0.01);
        drawPizza(S, 10, [4, 1], 4, 0.3);
        S.name([4, 1], 'P', 12, -12);
        return S.out();
      })()
    },
    concepts: ['area', 'symmetry'], links: ['para-pizza-6', 'para-lazy-caterer']
  });

  puzzle({
    id: 'para-pizza-6', title: 'Six Slices Are Not Fair', diff: 4,
    text: 'The pizza theorem works for eight slices. But what if the pizza (radius 10 cm) is cut into **six** slices by three cuts through the point P, 60° apart, and two friends again take the slices alternately? P is not the centre.\n\nWhich statement is true?',
    goal: 'Choose the true statement.',
    hints: ['Compute, or estimate, the areas of the slices for a point P that is near the edge: is there any reason for the alternating slices to balance?', 'Try the extreme case of P very close to the rim: three cuts through a point almost on the rim make some slices tiny and others huge. Do the alternate slices really balance?'],
    explain: 'The pizza theorem needs the number of slices to be a multiple of 4 and at least 8 (8, 12, 16, …). With **six** slices the two shares are generally different. For the pizza in the picture, with P off centre, the darker slices add up to ' + (function () { const a = pizzaAreas(10, [4, 1], 3, 0.3); return evenSum(a).toFixed(2) + ' cm² and the lighter ones to ' + oddSum(a).toFixed(2) + ' cm²: a difference of ' + (evenSum(a) - oddSum(a)).toFixed(2); })() + ' cm² out of 314: small, but real. The shares are equal for six slices only in special positions (for example, when P is the centre).',
    data: {
      answer: { choice: 1, choices: ['Whatever the number of slices, alternate slices always add up to the same amount.', 'With eight slices the shares are equal, but with six slices they can be different.', 'With eight slices the shares are different too, unless P is the centre.', 'With six slices the shares are equal, but not with eight.'] }, glyph: '6≠',
      traps: [{ match: 0, msg: 'Try the same idea with just two cuts at right angles and P near the rim: the alternate slices are far from equal.' }, { match: 2, msg: 'Eight slices are special: for any position of P the shares are equal (see [[para-pizza-8|the pizza theorem]]).' }, { match: 3, msg: 'It is the other way round: 8 slices are fair, and 6 are not.' }],
      figure: (function () {
        const S = scene(440, 400, [-11, -11, 11, 11], 10);
        const a = pizzaAreas(10, [4, 1], 3, 0.3);
        chk('para-pizza-6', Math.abs(evenSum(a) - oddSum(a)) > 0.3 ? 1 : 0, 1);
        chk('para-pizza-6', evenSum(a) + oddSum(a), 100 * Math.PI, 0.01);
        drawPizza(S, 10, [4, 1], 3, 0.3);
        S.name([4, 1], 'P', 12, -12);
        return S.out();
      })()
    },
    concepts: ['area', 'symmetry'], links: ['para-pizza-8']
  });

  puzzle({
    id: 'para-isoperimetric', title: 'The Best Shape for a Rope', diff: 2,
    text: 'You have a loop of rope **24 m** long and lay it flat on the ground as an equilateral triangle, a square, a regular hexagon or a circle (all four are drawn to scale in the picture). Whichever shape you choose, the ground inside it is yours.\n\nWhich shape gives you the most ground?',
    hints: ['Compute the area of each: triangle with side 8, square with side 6, hexagon with side 4, circle with circumference 24.', 'The circle has radius 24 ÷ (2π) ≈ 3.82, and area π r².'],
    explain: 'The areas are: equilateral triangle (side 8) √3 ÷ 4 × 64 ≈ 27.7 m²; square (side 6) 36 m²; regular hexagon (side 4) 3√3 ÷ 2 × 16 ≈ 41.6 m²; circle (radius 3.82) π r² ≈ **45.8 m²**. The more sides a regular shape has, the more ground it encloses, and the circle, which has “infinitely many” sides, is the best of all: this is the isoperimetric theorem, known in the legend of Queen Dido, who was allowed to keep as much land as an ox-hide could surround and cut it into a thin strip.',
    data: {
      answer: { choice: 3, choices: ['the triangle', 'the square', 'the hexagon', 'the circle'] }, glyph: '◯',
      traps: [{ match: 1, msg: 'The square is better than the triangle, but the hexagon does better still. Work out the areas.' }, { match: 0, msg: 'The triangle is the worst of the four. Compute its area: about 27.7 m².' }, { match: 2, msg: 'The hexagon is good (41.6 m²), but the circle is better.' }],
      figure: (function () {
        const S = scene(540, 150, [-1, -4.8, 38, 4.6], 8);
        const tri = regular(3, 8 / Math.sqrt(3), [4, 0.3], 90), sqr = [[10.5, -3], [16.5, -3], [16.5, 3], [10.5, 3]], hex = regular(6, 4, [24.2, 0], 0), cr = 24 / (2 * Math.PI);
        chk('para-isoperimetric', pathLen(tri, true), 24, 1e-9); chk('para-isoperimetric', pathLen(hex, true), 24, 1e-9);
        chk('para-isoperimetric', polyArea(tri) < polyArea(sqr) && polyArea(sqr) < polyArea(hex) && polyArea(hex) < Math.PI * cr * cr ? 1 : 0, 1);
        S.poly(tri, { fill: SR, sw: 2.4 }); S.poly(sqr, { fill: SB, sw: 2.4 }); S.poly(hex, { fill: SG, sw: 2.4 }); S.circ([33.6, 0], cr, { fill: SY, sw: 2.4 });
        S.text([4, -4.4], 'triangle', { size: 14, it: true, halo: false }); S.text([13.5, -4.4], 'square', { size: 14, it: true, halo: false }); S.text([24.2, -4.4], 'hexagon', { size: 14, it: true, halo: false }); S.text([33.6, -4.4], 'circle', { size: 14, it: true, halo: false });
        return S.out();
      })()
    },
    concepts: ['isoperimetric', 'area'], links: ['para-honeycomb', 'para-rect-perimeter']
  });

  puzzle({
    id: 'para-honeycomb', title: 'The Bees’ Choice', diff: 4,
    source: 'The honeycomb theorem (that hexagons are the best) was proved by Thomas Hales in 1999.',
    text: 'A bee builds cells of equal area with the least possible wall. A square cell and a regular hexagonal cell each have an area of **36** (in some unit). The square has side 6, so its walls are 24 long.\n\nHow long are the walls of the hexagonal cell (its perimeter)? Give it to two decimal places.',
    hints: ['The area of a regular hexagon of side s is 3√3 ÷ 2 × s². Put it equal to 36 and find s.', 's² = 72 ÷ (3√3) ≈ 13.86, so s ≈ 3.72. Then multiply by 6.'],
    explain: 'A regular hexagon of side s is six equilateral triangles: area 6 × (√3 ÷ 4) s² = (3√3 ÷ 2) s². Setting that equal to 36: s² = 72 ÷ (3√3) ≈ 13.856, so s ≈ 3.722 and the perimeter is 6s ≈ **22.33**. The hexagon needs 22.33 of wall where the square needs 24: about 7 % less. In a honeycomb each wall is shared by two cells, and no other way of dividing the plane into equal cells uses less wall (Hales’s proof, 1999): the bees are right.',
    data: {
      answer: { num: 22.3345, tol: 0.005, show: '22.33' }, glyph: '⬡',
      traps: [{ match: 24, msg: '24 is the perimeter of the square. The hexagon of the same area needs less.' }, { match: 21.6, msg: '21.6 = 6 × 3.6 would need a hexagon of side 3.6, which has an area of 33.7, too small. Work from the area formula.' }],
      figure: (function () {
        const S = scene(520, 240, [-1, -4.6, 15, 4.6], 10);
        const s = Math.sqrt(72 / (3 * Math.sqrt(3))), hex = regular(6, s, [10, 0], 0);
        chk('para-honeycomb', polyArea(hex), 36, 1e-9); chk('para-honeycomb', pathLen(hex, true), 22.3345, 1e-3);
        S.poly([[0, -3], [6, -3], [6, 3], [0, 3]], { fill: SB, sw: 2.4 }); S.poly(hex, { fill: SY, sw: 2.4 });
        S.text([3, 0], '36', { size: 22, bold: true, halo: false }); S.text([10, 0], '36', { size: 22, bold: true, halo: false });
        S.text([3, -3.8], 'walls 24', { size: 14, it: true, halo: false }); S.text([10, -3.8], 'walls ?', { size: 14, it: true, fill: RED, halo: false });
        return S.out();
      })()
    },
    concepts: ['isoperimetric', 'area'], links: ['para-isoperimetric']
  });

  puzzle({
    id: 'para-cylinder-paper', title: 'Two Ways to Roll a Sheet of Paper', diff: 3,
    text: 'A sheet of A4 paper is 21 cm by 29.7 cm. You can roll it into a tube in two ways, with no overlap: the **short** edges can be joined (a tube 21 cm tall and 29.7 cm round) or the **long** edges can be joined (a tube 29.7 cm tall and 21 cm round). Both tubes are closed at the ends by circles of card and filled with rice.\n\nHow many times more rice does the short, fat tube hold than the tall, thin one? Give it to two decimal places.',
    hints: ['The volume of a cylinder is π r² × h. The distance round is 2π r, so r = (distance round) ÷ 2π.', 'Volume = (distance round)² × height ÷ 4π. Write it down for both tubes and divide.'],
    explain: 'For a tube whose distance round is C and whose height is h, r = C ÷ 2π and V = π r² h = C² h ÷ 4π. The fat tube (C = 29.7, h = 21) holds 29.7² × 21 ÷ 4π ≈ 1474 cm³; the thin tube (C = 21, h = 29.7) holds 21² × 29.7 ÷ 4π ≈ 1042 cm³. The ratio is (29.7² × 21) ÷ (21² × 29.7) = 29.7 ÷ 21 ≈ **1.41**, which is √2: the sides of A4 paper are in that ratio. Same paper, same surface area, but the fat tube holds 41 % more.',
    data: {
      answer: { num: 29.7 / 21, tol: 0.005, show: '1.41' }, glyph: '🧻',
      traps: [{ match: 1, msg: 'They hold the same only if the sheet were square. The fatter tube holds more, because the volume grows with the *square* of the distance round.' }, { match: 2, msg: 'That would be so if the volume grew with the square of the distance round *and* the height did not change. Here both change: C² h.' }],
      figure: (function () {
        const S = scene(520, 320, [-2, -4.4, 46, 32], 10);
        const dFat = 29.7 / Math.PI, dThin = 21 / Math.PI;
        chk('para-cylinder-paper', (29.7 * 29.7 * 21) / (21 * 21 * 29.7), 29.7 / 21, 1e-12);
        // fat tube: 21 tall, 29.7 round
        S.poly([[4, 0], [4 + dFat, 0], [4 + dFat, 21], [4, 21]], { fill: '#eee6cc' });
        S.ell([4 + dFat / 2, 0], dFat / 2, 1.4, { fill: '#e3d9b8', sw: 1.8 }); S.poly([[4, 0], [4 + dFat, 0], [4 + dFat, 21], [4, 21]], { fill: null, sw: 2.4 });
        S.ell([4 + dFat / 2, 21], dFat / 2, 1.4, { fill: '#f6f0dc', sw: 2.2 });
        // thin tube: 29.7 tall, 21 round
        const x0 = 28;
        S.poly([[x0, 0], [x0 + dThin, 0], [x0 + dThin, 29.7], [x0, 29.7]], { fill: '#eee6cc' });
        S.ell([x0 + dThin / 2, 0], dThin / 2, 1.1, { fill: '#e3d9b8', sw: 1.8 }); S.poly([[x0, 0], [x0 + dThin, 0], [x0 + dThin, 29.7], [x0, 29.7]], { fill: null, sw: 2.4 });
        S.ell([x0 + dThin / 2, 29.7], dThin / 2, 1.1, { fill: '#f6f0dc', sw: 2.2 });
        S.text([4 + dFat / 2, 10.5], 'short, fat', { size: 15, it: true, halo: false }); S.text([x0 + dThin / 2, 14.8], 'tall, thin', { size: 15, it: true, halo: false, dy: 0 });
        S.text([4 + dFat / 2, -1.2], '21 cm tall', { size: 14, halo: false, dy: 10 }); S.text([x0 + dThin / 2, -1.2], '29.7 cm tall', { size: 14, halo: false, dy: 10 });
        return S.out();
      })()
    },
    concepts: ['solids', 'area'], links: ['para-cube-crumbs']
  });

  puzzle({
    id: 'para-cube-crumbs', title: 'A Cheese in a Thousand Pieces', diff: 2,
    text: 'A cube of cheese has edges of **10 cm**. It is cut into 1000 little cubes of 1 cm, by cutting nine times across in each of the three directions.\n\nWhat is the total surface area of all the little cubes together, in cm²?',
    hints: ['How many faces has each little cube, and how big is each face?', 'The original cube has a surface of 6 × 100 = 600 cm². What happens to the surface when you cut a piece in two?'],
    explain: 'Each little cube has 6 faces of 1 cm², so a surface of 6 cm²; there are 1000 of them: **6000 cm²**. The big cube had only 600 cm²: cutting has multiplied the surface by 10. Each of the 27 cuts adds two new faces of 100 cm², that is 200 cm², and 27 × 200 = 5400 cm², which together with the original 600 makes 6000. The volume is exactly the same, 1000 cm³, but the surface is ten times bigger, which is why chopped things cook faster and dissolve sooner.',
    data: {
      answer: { num: 6000, unit: 'cm²' }, glyph: '🧊',
      traps: [{ match: 600, msg: '600 cm² is the surface of the whole cube before cutting. The pieces have many more faces.' }, { match: 1000, msg: '1000 is the number of pieces. Each piece has 6 faces.' }],
      figure: (function () {
        const S = scene(440, 340, [-1, -1, 15, 12.5], 12);
        const OBx = (x, y, z) => [x + 0.42 * z, y + 0.3 * z], s = 10;
        const a = OBx(0, 0, 0), b = OBx(s, 0, 0), c = OBx(s, s, 0), d = OBx(0, s, 0), f = OBx(s, 0, s), g = OBx(s, s, s), h = OBx(0, s, s);
        S.poly([a, b, c, d], { fill: SY }); S.poly([d, c, g, h], { fill: SN }); S.poly([b, f, g, c], { fill: '#e4d6a2' });
        for (let i = 1; i < 10; i++) {
          S.line(OBx(i, 0, 0), OBx(i, s, 0), { stroke: 'rgba(58,48,32,0.35)', sw: 0.8 }); S.line(OBx(0, i, 0), OBx(s, i, 0), { stroke: 'rgba(58,48,32,0.35)', sw: 0.8 });
          S.line(OBx(i, s, 0), OBx(i, s, s), { stroke: 'rgba(58,48,32,0.35)', sw: 0.8 }); S.line(OBx(0, s, i), OBx(s, s, i), { stroke: 'rgba(58,48,32,0.35)', sw: 0.8 });
          S.line(OBx(s, i, 0), OBx(s, i, s), { stroke: 'rgba(58,48,32,0.35)', sw: 0.8 }); S.line(OBx(s, 0, i), OBx(s, s, i), { stroke: 'rgba(58,48,32,0.35)', sw: 0.8 });
        }
        [[a, b, c, d], [d, c, g, h], [b, f, g, c]].forEach((q) => S.poly(q, { fill: null, sw: 2.2 }));
        S.text(mid(a, b), '10 cm', { dy: 18, size: 15 });
        return S.out();
      })()
    },
    concepts: ['solids', 'area'], links: ['para-cylinder-paper', 'para-cheese-cuts']
  });

  puzzle({
    id: 'para-nine-squares', title: 'Nine Squares, Many Perimeters', diff: 2,
    text: 'Nine unit squares are joined edge to edge into a single piece (every square shares a whole edge with at least one other). Three such pieces are drawn. They all have the same area, 9, but their outlines are different.\n\nWhat are the **smallest** and the **largest** possible perimeters of such a piece?',
    hints: ['Each square has a perimeter of 4, but the perimeter of the piece is less, because two touching edges are hidden inside. How many joins are there at least, and at most?', 'To get the shortest outline make the piece as round as possible; to get the longest, make it as straggly as possible: what is the fewest number of joins for nine squares to hold together?'],
    explain: 'Nine separate squares have 36 units of edge; every shared edge hides 2 units of it. The most compact piece is the 3 × 3 block, with 12 joins and a perimeter of 36 − 24 = **12**. Any piece of nine squares that holds together needs at least 8 joins, and a piece with exactly 8 (no square-blocks of four, no loops: a “tree”) has perimeter 36 − 16 = **20**, for example a straight line of nine, or a cross, or a staircase. So the perimeter of a piece of nine squares is between 12 and 20 (and always an even number).',
    data: {
      answer: { nums: [12, 20], ordered: false }, ask: 'Write the smallest and the largest perimeter, separated by a comma.', glyph: '9▫',
      traps: [{ match: '12, 36', msg: '36 would be nine squares that do not touch at all. The squares must share edges to make one piece.' }, { match: '12, 14', msg: 'The 14 is the piece in the first picture, not the longest possible outline. What happens to the perimeter when the piece is a straight line?' }],
      figure: (function () {
        const S = scene(540, 160, [-1, -0.6, 27, 5.6], 8);
        const shapes = [
          { at: 0, cells: [[0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]], f: SB },
          { at: 8, cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [0, 2], [1, 2], [3, 2], [4, 2]], f: SG },
          { at: 15, cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2], [3, 3], [4, 3], [4, 4]], f: SR }
        ];
        const perim = (cells) => { const set = new Set(cells.map((c) => c.join())); let p = 0; cells.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!set.has((x + dx) + ',' + (y + dy))) p++; })); return p; };
        chk('para-nine-squares', perim(shapes[0].cells), 14); chk('para-nine-squares', perim(shapes[1].cells), 20); chk('para-nine-squares', perim(shapes[2].cells), 20);
        chk('para-nine-squares', perim([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]), 12);
        shapes.forEach((sh) => sh.cells.forEach(([x, y]) => S.poly([[sh.at + x, y], [sh.at + x + 1, y], [sh.at + x + 1, y + 1], [sh.at + x, y + 1]], { fill: sh.f, sw: 1.8 })));
        return S.out();
      })()
    },
    concepts: ['area', 'isoperimetric'], links: ['para-rect-perimeter', 'para-corner-cut']
  });

  puzzle({
    id: 'para-corner-cut', title: 'A Corner Cut Away', diff: 1,
    text: 'A square of card has sides of **10 cm**, so its perimeter is 40 cm. A smaller square, 3 cm by 3 cm, is cut out of one corner, as in the picture, leaving an L-shaped piece.\n\nWhat is the perimeter of the L-shaped piece?',
    hints: ['Walk round the outline of the L and add up the sides. Two of them are shorter than before: by how much?', 'The new piece has two new sides of 3 cm, but the two sides that met at the corner have each lost 3 cm.'],
    explain: 'Walking round the L, we cover the same distance across and the same distance up as round the full square: the two new edges of 3 cm each make up for the 3 cm lost from each of the two old sides. So the perimeter is still **40 cm**, although the area has dropped from 100 to 91 cm². Cutting a rectangular piece from a corner never changes the perimeter.',
    data: {
      answer: { num: 40, unit: 'cm' }, glyph: '⌐',
      traps: [{ match: 34, msg: '34 = 40 − 6 assumes the two sides lost 3 cm each and nothing came back. But the new edges are also part of the outline.' }, { match: 46, msg: '46 = 40 + 6 adds the new edges without removing the pieces of the old sides that are gone.' }],
      figure: (function () {
        const S = scene(440, 380, [-1.5, -1.5, 11.5, 11.5], 14);
        const L = [[3, 0], [10, 0], [10, 10], [0, 10], [0, 3], [3, 3]];
        chk('para-corner-cut', pathLen(L, true), 40, 1e-9);
        S.poly(L, { fill: SY, sw: 2.6 });
        S.poly([[0, 0], [3, 0], [3, 3], [0, 3]], { fill: null, stroke: GREY, sw: 1.4, dash: '4 4' });
        S.text([1.5, 1.5], '3 × 3', { size: 13, it: true, fill: GREY, halo: false });
        S.text([5, 10], '10 cm', { dy: -16, size: 15 });
        return S.out();
      })()
    },
    concepts: ['area', 'isoperimetric'], links: ['para-nine-squares']
  });

  puzzle({
    id: 'para-path-square', title: 'A Path Round the Lawn', diff: 1,
    text: 'A square lawn of any size has a path **1 m wide** laid all the way round it. A snail walks once round the outer edge of the path, and another snail once round the inner edge (the edge of the lawn).\n\nHow much further does the outer snail walk? (The answer does not depend on how big the lawn is.)',
    hints: ['Try a lawn that is 10 m on each side. How long is the outer square?', 'The outer square is 2 m wider than the lawn, one metre on each side: each of its four sides is 2 m longer.'],
    explain: 'Each side of the outer square is 1 + 1 = 2 m longer than the matching side of the lawn (one metre of path at each end), and there are four sides: 4 × 2 = **8 m**, whatever the size of the lawn. Try 10 m: the inner square has perimeter 40 m, the outer 12 × 4 = 48 m. For a round pond with a 1 m path the difference is 2π ≈ 6.28 m, also independent of the size: this is the rope-round-the-Earth puzzle in small.',
    data: {
      answer: { num: 8, unit: 'm' }, glyph: '⬜',
      traps: [{ match: 4, msg: 'The outer square is bigger by a metre at *each* end of each side: 2 m per side, and there are four sides.' }, { match: 2, msg: '2 m is the extra length of one side. There are four sides.' }],
      figure: (function () {
        const S = scene(420, 380, [-1.5, -1.5, 13.5, 13.5], 12);
        chk('para-path-square', 4 * 12 - 4 * 10, 8);
        S.poly([[0, 0], [12, 0], [12, 12], [0, 12]], { fill: '#d9c9a0', sw: 2.6 });
        S.poly([[1, 1], [11, 1], [11, 11], [1, 11]], { fill: SG, sw: 2.6 });
        S.text([6, 6], 'lawn', { size: 20, it: true, halo: false, fill: GREEN }); S.text([6, 0.5], 'path 1 m', { size: 13, it: true, halo: false });
        return S.out();
      })()
    },
    concepts: ['isoperimetric', 'area'], links: ['para-corner-cut']
  });

  puzzle({
    id: 'para-rect-perimeter', title: 'Same Area, Very Different Fences', diff: 1,
    text: 'Rectangles with whole-number sides can all have the same area. Four of the rectangles with an area of **24 m²** are drawn to scale.\n\nWhich of the possible rectangles (with whole-number sides) has the longest fence round it, and how long is that fence?',
    ask: 'The length of the longest possible fence.',
    hints: ['List every pair of whole numbers whose product is 24.', 'The pairs are 1 × 24, 2 × 12, 3 × 8 and 4 × 6. The perimeter of a rectangle is 2 × (length + width).'],
    explain: 'The rectangles are 1 × 24, 2 × 12, 3 × 8 and 4 × 6, with perimeters 2 × 25 = **50**, 2 × 14 = 28, 2 × 11 = 22 and 2 × 10 = 20. So the same area can be fenced with 20 m or with 50 m of fence: the long thin strip needs two and a half times as much. Among all rectangles of a given area the square (here 4.9 × 4.9, with a fence of 19.6 m) needs the least.',
    data: {
      answer: { num: 50, unit: 'm' }, glyph: '▬',
      traps: [{ match: 20, msg: '20 m is the *shortest* fence (the 4 × 6 rectangle). The question asks for the longest.' }, { match: 48, msg: '48 = 2 × 24 forgets the other two sides, of 1 m each.' }],
      figure: (function () {
        const S = scene(540, 260, [-1, -1, 32, 14], 10);
        const rs = [[24, 1], [12, 2], [8, 3], [6, 4]], cols = [SR, SB, SG, SY];
        let y = 0;
        rs.forEach(([w, h], i) => { chk('para-rect-perimeter', w * h, 24); S.poly([[0, y], [w, y], [w, y + h], [0, y + h]], { fill: cols[i], sw: 2 }); S.text([w + 1.5, y + h / 2], w + ' × ' + h, { size: 14, halo: false, anchor: 'start', dx: 0 }); y += h + 0.9; });
        return S.out();
      })()
    },
    concepts: ['isoperimetric', 'area'], links: ['para-isoperimetric', 'para-nine-squares']
  });

  puzzle({
    id: 'para-same-base-height', title: 'Four Triangles on One Base', diff: 2,
    text: 'Four triangles stand on the same base, 6 units long, and have their top corners on a line parallel to the base, 4 units above it. They are drawn on top of each other in the picture: a symmetrical one, a right-angled one and two leaning ones.\n\nWhich has the biggest area?',
    hints: ['Use the formula: area = ½ × base × height. What do the four triangles have in common?', 'Base 6 and height 4 for all of them: it does not matter where along the parallel line the top corner sits.'],
    explain: 'The area of a triangle is ½ × base × **height**, where the height is the distance from the top corner to the base, not the slant length of the sides. All four triangles have base 6 and height 4, so each has area ½ × 6 × 4 = 12: **they are all the same**, however lopsided they look. Sliding the top corner along the parallel line changes the shape but never the area.',
    data: {
      answer: { choice: 3, choices: ['the symmetrical one', 'the right-angled one', 'one of the two leaning ones', 'all four have the same area'] }, glyph: '△△',
      traps: [{ match: 0, msg: 'The symmetrical one looks tidy, but the area depends on the base and the height only, and those are the same for all four.' }, { match: 1, msg: 'Try the formula ½ × base × height for each: they have the same base and the same height.' }, { match: 2, msg: 'The leaning ones have longer sides, but the same base and the same height as the others: the same area.' }],
      figure: (function () {
        const S = scene(520, 240, [-4, -1, 12, 5.4], 12);
        const A = [0, 0], B = [6, 0], apex = [[-2.5, 4], [6, 4], [3, 4], [9.5, 4]], cols = [SR, SB, SG, SY], strokes = [RED, BLUE, GREEN, GOLD];
        apex.forEach((p, i) => chk('para-same-base-height', polyArea([A, B, p]), 12, 1e-9));
        S.line([-4, 4], [12, 4], { stroke: GREY, sw: 1.4, dash: '5 4' });
        apex.forEach((p, i) => S.poly([A, B, p], { fill: cols[i], stroke: strokes[i], sw: 2.2, op: 0.75 }));
        S.line(A, B, { sw: 4 });
        S.text([3, 0], 'base 6', { dy: 18, size: 15 }); S.text([-3.2, 2], 'height 4', { size: 14, it: true, halo: false, fill: GREY });
        return S.out();
      })()
    },
    concepts: ['area'], links: ['geo-parallelogram-triangle']
  });

  puzzle({
    id: 'para-all-triangles-isosceles', title: 'Every Triangle Is Isosceles', diff: 4,
    source: 'A classic false proof that appears in many puzzle books.',
    text: 'Here is a “proof” that every triangle is isosceles. Take any triangle ABC. Draw the bisector of the angle at A, and the perpendicular bisector of the side BC; they meet at a point O. From O drop perpendiculars OD to the line AB and OE to the line AC.\n\n(1) The triangles AOD and AOE are congruent, so **AD = AE**.\n(2) OB = OC (O is on the perpendicular bisector of BC) and OD = OE, so the right triangles ODB and OEC are congruent, and **DB = EC**.\n(3) Therefore AB = AD + DB = AE + EC = AC, and the triangle is isosceles!\n\nThe picture is drawn to scale for a triangle with AB = 5, AC = 7 and BC = 8, which is certainly not isosceles. Where does the proof go wrong?',
    goal: 'Choose the flaw in the proof.',
    hints: ['Read the picture with a ruler: does D lie between A and B? Does E lie between A and C?', 'In the picture AD = AE = 6 and DB = EC = 1. Is AB equal to 6 + 1 or to 6 − 1?'],
    explain: 'The bisector of the angle at A and the perpendicular bisector of BC meet at O, but O lies on the **circle through A, B and C**, outside the triangle (unless AB = AC). Steps (1) and (2) are correct: AD = AE = 6 and DB = EC = 1 in the picture. But one of the feet D and E falls outside its side: here D is beyond B on the extension of AB, so AB = AD **−** DB = 6 − 1 = 5, while E lies inside AC and AC = AE + EC = 6 + 1 = 7. The proof added where it should have subtracted, and the difference between AB and AC is exactly 2 × DB. A picture drawn with care would have shown it.',
    data: {
      answer: { choice: 2, choices: ['AD and AE are not equal.', 'The right triangles ODB and OEC are not congruent.', 'The point O lies outside the triangle, and one of the feet D, E falls beyond a vertex, so a sum should have been a difference.', 'The bisector of an angle and the perpendicular bisector of the opposite side never meet.'] }, glyph: '≡?',
      traps: [{ match: 0, msg: 'They are equal: AD = AE = 6 in the picture, and step (1) is sound. Look at where D and E lie.' }, { match: 1, msg: 'They are congruent (both have OD = OE and OB = OC). The flaw is in step (3).' }, { match: 3, msg: 'They do meet: there is a point O in the picture. The flaw lies in what is done with D and E.' }],
      figure: (function () {
        const S = scene(520, 360, [-2.8, -5.2, 10.8, 5.8], 12);
        const B = [0, 0], C = [8, 0], A = [2.5, Math.sqrt(18.75)];
        const ab = dist(A, B), ac = dist(A, C);
        const u = [(B[0] - A[0]) / ab + (C[0] - A[0]) / ac, (B[1] - A[1]) / ab + (C[1] - A[1]) / ac], t = (4 - A[0]) / u[0], O = [A[0] + u[0] * t, A[1] + u[1] * t];
        const foot = (P, Q, R) => { const v = sub(R, Q), tt = ((P[0] - Q[0]) * v[0] + (P[1] - Q[1]) * v[1]) / (v[0] * v[0] + v[1] * v[1]); return add(Q, mul(v, tt)); };
        const D = foot(O, A, B), E = foot(O, A, C);
        chk('para-all-triangles-isosceles', dist(A, D), 6, 1e-9); chk('para-all-triangles-isosceles', dist(A, E), 6, 1e-9);
        chk('para-all-triangles-isosceles', dist(D, B), 1, 1e-9); chk('para-all-triangles-isosceles', dist(E, C), 1, 1e-9);
        const cc = circum(A, B, C);
        S.circ(cc.c, cc.r, { fill: null, stroke: GREY, sw: 1.2, dash: '4 5' });
        S.poly([A, B, C], { fill: SY, sw: 2.6 });
        S.line(A, D, { sw: 1.8 }); S.line(D, B, { sw: 1.8, dash: '4 3' });
        S.line(A, O, { stroke: BLUE, sw: 2 }); S.line([4, 0], O, { stroke: GREEN, sw: 2, dash: '6 4' });
        S.line(O, D, { stroke: RED, sw: 1.8 }); S.line(O, E, { stroke: RED, sw: 1.8 });
        [A, B, C, O, D, E].forEach((p) => S.dot(p, { r: 3.6 }));
        S.name(A, 'A', -2, -15); S.name(B, 'B', -14, 4); S.name(C, 'C', 14, 4); S.name(O, 'O', 15, 8); S.name(D, 'D', -14, 8); S.name(E, 'E', 14, -8);
        S.text(mid(A, B), '5', { dx: -14, dy: -4, size: 14 }); S.text(mid(A, C), '7', { dx: 14, dy: -4, size: 14 }); S.text([4, 0], '8', { dy: -12, size: 14 });
        return S.out();
      })()
    },
    concepts: ['angle-chasing', 'circle-angles'], links: ['geo-chain-36']
  });

  puzzle({
    id: 'para-lazy-caterer', title: 'The Lazy Caterer’s Cake', diff: 3,
    text: 'A round cake is cut with straight cuts across the whole cake. The pieces may be of any size, and the cuts can be placed however you like, but you must not move the pieces between cuts. The picture shows four cuts making 11 pieces.\n\nWhat is the largest number of pieces that **six** straight cuts can make?',
    hints: ['To get the most pieces, every new cut must cross every earlier cut, and no three cuts may go through one point.', 'The first cut makes 2 pieces. The second, crossing the first, adds 2; the third adds 3; the k-th adds k, one for each of the pieces it passes through.'],
    explain: 'A new cut that crosses all k − 1 earlier cuts is split by them into k parts, and each part divides a piece into two, so the k-th cut adds k pieces. With no cuts there is 1 piece, and then 1 + 1 = 2, 2 + 2 = 4, 4 + 3 = 7, 7 + 4 = 11 (the four cuts of the picture), 11 + 5 = 16, and 16 + 6 = **22** pieces for six cuts. In general n cuts give at most 1 + (1 + 2 + … + n) = (n² + n + 2) ÷ 2 pieces: the “lazy caterer’s sequence” 1, 2, 4, 7, 11, 16, 22, 29 …',
    data: {
      answer: { num: 22 }, glyph: '🎂',
      traps: [{ match: 12, msg: '12 would be so if each cut just added two pieces. A cut that crosses earlier cuts adds more.' }, { match: 21, msg: 'Close. Count with care: the sixth cut adds 6 pieces to the 16 that five cuts make.' }, { match: 64, msg: '64 would be for doubling every time: cuts cannot double the pieces, since each cut is a straight line.' }],
      figure: (function () {
        const S = scene(420, 400, [-11, -11, 11, 11], 10);
        const R = 10;
        const lines = [[25, 0.7], [70, -1.2], [115, 1.9], [160, -0.5]];   // direction (degrees), offset from the centre
        const chords = lines.map(([a, off]) => { const nrm = [-Math.sin(a * RAD), Math.cos(a * RAD)], base = mul(nrm, off), h = Math.sqrt(R * R - off * off), d = [Math.cos(a * RAD), Math.sin(a * RAD)]; return [sub(base, mul(d, h)), add(base, mul(d, h))]; });
        let inside = 0;
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) { const p = inter(chords[i][0], chords[i][1], chords[j][0], chords[j][1]); if (Math.hypot(p[0], p[1]) < R) inside++; }
        chk('para-lazy-caterer', inside, 6); chk('para-lazy-caterer', 1 + 4 + inside, 11);
        S.circ([0, 0], R, { fill: '#f3d9a4', stroke: '#b06b2a', sw: 3.2 });
        chords.forEach(([p, q]) => S.line(p, q, { stroke: '#8a4a1c', sw: 2 }));
        return S.out();
      })()
    },
    concepts: ['combinatorics', 'sequence'], links: ['para-cheese-cuts', 'para-pizza-8']
  });

  puzzle({
    id: 'para-cheese-cuts', title: 'Cutting the Cheese', diff: 4,
    text: 'A block of cheese is cut with **flat** cuts, each cut going right through the block, and the pieces are never moved between cuts. Three cuts, one in each direction through the middle, can make 8 pieces (the picture).\n\nWhat is the largest number of pieces that **four** flat cuts can make?',
    hints: ['Think of how the cake problem grew: each new cut adds as many pieces as the regions it is divided into on its own flat surface.', 'The fourth cut is met by the other three planes in three straight lines on its surface. Three lines in general position divide a plane into 7 regions.'],
    explain: 'Each new plane cut meets the earlier cuts in lines drawn on the cut’s own surface, and the number of pieces it adds is the number of regions those lines make there. With the fourth cut, the three earlier planes make 3 lines on it, which (in general position) split the surface into 1 + 3 + 3 = 7 regions, so the fourth cut adds 7 pieces to the 8 already there: 8 + 7 = **15**. The sequence of the largest numbers of pieces, 1, 2, 4, 8, 15, 26, 42 …, has a formula (n³ + 5n + 6) ÷ 6, and the three-cut cube of 8 pieces is just the beginning: it does not double any more.',
    data: {
      answer: { num: 15 }, glyph: '🧀',
      traps: [{ match: 16, msg: 'Doubling stops after three cuts: the fourth adds only 7 pieces (the regions the other three planes make on its surface).' }, { match: 14, msg: 'Nearly: the fourth cut meets the others in 3 lines and adds 7 pieces, not 6.' }],
      figure: (function () {
        const S = scene(440, 340, [-1, -1, 15, 12.5], 12);
        const OBx = (x, y, z) => [x + 0.42 * z, y + 0.3 * z], s = 10;
        const a = OBx(0, 0, 0), b = OBx(s, 0, 0), c = OBx(s, s, 0), d = OBx(0, s, 0), f = OBx(s, 0, s), g = OBx(s, s, s), h = OBx(0, s, s);
        S.poly([a, b, c, d], { fill: SY }); S.poly([d, c, g, h], { fill: SN }); S.poly([b, f, g, c], { fill: '#e4d6a2' });
        const cut = { stroke: RED, sw: 2.4, dash: '6 4' };
        S.line(OBx(5, 0, 0), OBx(5, s, 0), cut); S.line(OBx(0, 5, 0), OBx(s, 5, 0), cut);
        S.line(OBx(5, s, 0), OBx(5, s, s), cut); S.line(OBx(0, s, 5), OBx(s, s, 5), cut);
        S.line(OBx(s, 5, 0), OBx(s, 5, s), cut); S.line(OBx(s, 0, 5), OBx(s, s, 5), cut);
        [[a, b, c, d], [d, c, g, h], [b, f, g, c]].forEach((q) => S.poly(q, { fill: null, sw: 2.2 }));
        return S.out();
      })()
    },
    concepts: ['combinatorics', 'solids'], links: ['para-lazy-caterer', 'para-cube-crumbs']
  });


  /* =====================  MORE LIMITS AND MORE BEST SHAPES  ===================== */

  puzzle({
    id: 'para-semicircle-chain', title: 'A Road of Little Semicircles', diff: 3,
    text: 'A straight road is **10 km** long. A pilgrim’s path along it is made of semicircles, each with its diameter on the road: one big semicircle of diameter 10 km, or two of 5 km, or four of 2.5 km, and so on (the picture shows 1, 2 and 4). The more semicircles there are, the closer the path hugs the road.\n\nHow long is the path made of **100** little semicircles, each with a diameter of 0.1 km? Give it to two decimal places.',
    hints: ['One semicircle of diameter d is half a circle: its length is ½ π d.', 'A hundred of them with d = 0.1: the total is 100 × ½ π × 0.1.'],
    explain: 'A semicircle of diameter d is half of a circle, of length ½ π d. Along a road of length L made of n semicircles, each has d = L ÷ n, so the whole path has length n × ½ π × (L ÷ n) = ½ π L, whatever n is. With L = 10 km that is 5π ≈ **15.71 km**, for one semicircle or a hundred or a million. The path gets as close as you like to the straight road, which is only 10 km long, yet its length does not change at all: another warning that the length of the limit is not the limit of the lengths.',
    data: {
      answer: { num: 15.70796, tol: 0.005, unit: 'km', show: '15.71' }, glyph: '⌒⌒',
      traps: [{ match: 10, msg: '10 km is the straight road. The path is made of little arcs, which are longer than the segments under them.' }, { match: 5, msg: '5 km would be so if the arcs were as long as their diameters: each arc is π ÷ 2 ≈ 1.57 times longer.' }],
      figure: (function () {
        const S = scene(520, 240, [-0.6, -0.8, 10.6, 5.8], 12);
        [[1, BLUE], [2, GREEN], [4, RED]].forEach(([n, c]) => {
          const d = 10 / n;
          for (let i = 0; i < n; i++) S.path(S.M([i * d, 0]) + S.A(d / 2, [(i + 1) * d, 0], 0, false), { stroke: c, sw: 2.4 });
          chk('para-semicircle-chain', n * Math.PI * d / 2, 5 * Math.PI, 1e-9);
        });
        S.line([-0.3, 0], [10.3, 0], { sw: 3 });
        S.text([5, 0], '10 km', { dy: 20, size: 15 });
        return S.out();
      })()
    },
    concepts: ['limits'], links: ['para-staircase-length', 'para-staircase-pi']
  });

  puzzle({
    id: 'para-dido', title: 'Dido’s Rope', diff: 4,
    source: 'The legend of Queen Dido founding Carthage, told in Virgil’s Aeneid, is an ancient story about the largest area for a given length of boundary.',
    text: 'The story goes that Dido, fleeing from Tyre, bargained for as much land on the coast of North Africa as an ox-hide could surround. She cut the hide into a very long thin strip. Suppose her rope is **100 m** long and the shore is a **straight line**, so the rope only has to run from one point of the shore, round the land, to another point of the shore.\n\nThe best shape for the enclosed land is known. What is its area? Give it to the nearest square metre.',
    hints: ['A closed loop of rope with no shore would be a circle. What does the straight shore do to the best shape?', 'The best shape is a half-circle standing on the shore (imagine the mirror image of the land in the shore: together they make a circle of a rope of 200 m). The half-circle’s curved edge is the whole rope: ½ × 2π r = 100.'],
    explain: 'Mirror the land in the straight shore: the land and its reflection together are a shape enclosed by a rope of 200 m, and the most area for 200 m of rope is a circle, so the best land is a **half-circle**. Its curved edge is the rope: π r = 100, so r = 100 ÷ π ≈ 31.83 m. Its area is ½ π r² = 100² ÷ (2π) ≈ 1591.5, that is **1592 m²**. For comparison, the best rectangle (25 m by 50 m) gives only 1250 m², a fifth less.',
    data: {
      answer: { num: 1591.55, tol: 0.5, unit: 'm²', show: '1592' }, glyph: '🐂',
      traps: [{ match: 1250, msg: '1250 is the best rectangle (25 m by 50 m). A semicircle does better.' }, { match: 3183, msg: '3183 m² is the area of the whole circle of radius 31.83 m. Only half of it, the half on land, is enclosed.' }],
      figure: (function () {
        const S = scene(520, 260, [-6, -9, 56, 36], 12);
        const r = 100 / Math.PI;
        chk('para-dido', Math.PI * r * r / 2, 1591.55, 0.01);
        S.poly([[-5, -6], [55, -6], [55, 0], [-5, 0]], { fill: SB, stroke: null }); S.line([-5, 0], [55, 0], { sw: 2.6 });
        S.text([0, -3], 'the sea', { size: 15, it: true, fill: BLUE, halo: false, dx: 20 });
        S.path(S.M([27.5 - r, 0]) + S.A(r, [27.5 + r, 0], 0, false) + 'Z', { fill: SY, sw: 2.8 });
        S.poly([[2.5, 0], [52.5, 0], [52.5, 25], [2.5, 25]], { fill: null, stroke: RED, sw: 1.8, dash: '6 5' });
        S.text([27.5, r / 2], 'land: area ?', { size: 16, bold: true, fill: RED });
        return S.out();
      })()
    },
    concepts: ['isoperimetric', 'area'], links: ['para-isoperimetric', 'geo-fence-wall']
  });


  list.forEach((p) => { if (!p.tags) p.tags = p.id.split('-').slice(1).concat(['paradox']); });
  Cabinet.family({
    id: 'dissection-riddles', engine: 'question', cat: 'shapes', name: 'Area and perimeter paradoxes', order: 21,
    blurb: 'A chessboard that gains a square, a triangle that grows a hole, staircases that never reach the diagonal, snowflakes with an endless edge: where does the trick hide?',
    origin: { who: 'Victorian puzzle books, Paul Curry and the fractal geometers', note: 'Cutting a shape into pieces and putting them together again as a shape of a different area is an old trick of the parlour and the stage. The riddles here range from the 64 = 65 chessboard of the Victorian puzzle books and Paul Curry’s triangle of 1953 to the staircases of the calculus lecture and the snowflake curve that Helge von Koch described in 1904: in each, a little arithmetic finds the hiding place.' },
    concepts: ['area', 'dissection', 'fibonacci', 'limits', 'fractals', 'isoperimetric']
  }, list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]));
})();
