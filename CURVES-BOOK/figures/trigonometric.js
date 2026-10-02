/* Curves Workshop · figures/trigonometric.js — Figs. 201–206 (pages 225–232)
 *
 * Trigonometric functions: the six graphs (Fig. 201a–c), the law of sines in the circumscribed circle
 * (202), the sine curve as the projection of a helix and as the development of an elliptic section of a
 * cylinder (203a, 203b), Mercator's map of a great-circle route (204), the composition of sounds from
 * sine waves (205a–d) and the Fourier development of the step function (206).
 */
(function () {
  const PI = Math.PI, TAU = 2 * Math.PI;
  const aux = { cls: 'cons', dash: true };
  const thin = { cls: 'cons' };
  const T = (k, x, y, s, o) => k.text(x, y, s, Object.assign({ upright: true, size: 0.85 }, o || {}));
  /* y = f(x) with x in real units, scaled by (ux, uy); null where undefined or beyond ±lim */
  const graph = (k, f, a, b, ux, uy, o, lim) => k.curve(x => {
    const y = f(x);
    if (y == null || !isFinite(y)) return null;
    if (lim && (y > lim[1] || y < lim[0])) return null;
    return [x * ux, y * uy];
  }, [a, b], o);
  const key = (k, x, y, name, dashed, off) => {
    off = off || 112;                  // "y = sin x ———" as in the panels of Fig. 201
    T(k, x, y, 'y = ' + name, { size: 0.8, anchor: 'start' });
    k.seg(k.pt(x + off, y), k.pt(x + off + (dashed ? 56 : 44), y), dashed ? { cls: 'given', dash: true, width: 1.4 } : { cls: 'given', width: 1.4 });
  };

  /* Fig. 201 (a), page 225 — y = sin x (solid) and y = csc x (dashed) on −π ≤ x ≤ π */
  Curves.figure({
    id: 'fig-201a',
    section: 'trigonometric',
    page: 225,
    title: 'y = sin x and y = csc x',
    tags: ['sine', 'cosecant', 'asymptote'],
    note: 'As in the book, the unit on the y-axis is twice the unit on the x-axis.',
    build(k) {
      const ux = 100, uy = 200, O = k.pt(0, 0), P = (x, y) => k.pt(x * ux, y * uy);
      k.given('The axes, the vertical asymptotes x = −π, 0, π of csc x (thin) and the horizontal lines y = 1, 0, −1 that carry the points where the two curves meet.', () => {
        k.seg(P(0, -2.05), P(0, 2.05), { cls: 'axis', arrow: 'end' });
        k.label(P(0, 2.05), 'Y', 'ne', { cls: 'axis' });
        [-PI, PI].forEach(x => k.seg(P(x, -2.05), P(x, 2.0), thin));
        [-1, 0, 1].forEach(y => k.seg(P(-PI, y), P(PI, y), thin));
      });
      k.step('pencil', 'y = sin x for −π ≤ x ≤ π: through the zeros at −π, 0, π, with its maximum 1 at π/2 and its minimum −1 at −π/2.', () => {
        graph(k, Math.sin, -PI, PI, ux, uy, { n: 200, width: 3 });
      });
      k.note('y = csc x = 1/sin x, dashed: it touches the sine curve at (π/2, 1) and (−π/2, −1) and runs to ±∞ at the asymptotes x = −π, 0, π. The open circles mark the points where the two graphs meet and the zeros of sin x.', () => {
        graph(k, x => 1 / Math.sin(x), 0.45, PI - 0.45, ux, uy, { dash: true, cls: 'given', n: 120 }, [-2.1, 2.1]);
        graph(k, x => 1 / Math.sin(x), -PI + 0.45, -0.45, ux, uy, { dash: true, cls: 'given', n: 120 }, [-2.1, 2.1]);
        [P(-PI, 0), P(PI, 0), P(PI / 2, 1), P(-PI / 2, -1)].forEach(p => k.dot(p, { open: true, r: 1.2 }));
        k.dot(O, { open: true, r: 1.7 }); k.dot(O, { open: true, r: 0.8 });
        key(k, 0.2 * ux, -1.6 * uy, 'sin x', false);
        key(k, 0.2 * ux, -1.85 * uy, 'csc x', true);
      });
    }
  });

  /* Fig. 201 (b), page 225 — y = tan x (solid) and y = cot x (dashed) on −π/2 ≤ x ≤ π/2 */
  Curves.figure({
    id: 'fig-201b',
    section: 'trigonometric',
    page: 225,
    title: 'y = tan x and y = cot x',
    tags: ['tangent', 'cotangent', 'asymptote'],
    build(k) {
      const u = 150, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes, the vertical asymptotes x = ±π/2 of tan x, the asymptote x = 0 of cot x, and the horizontal lines y = 1, 0, −1.', () => {
        k.seg(P(0, -2.05), P(0, 2.1), { cls: 'axis', arrow: 'end' });
        k.label(P(0, 2.1), 'Y', 'ne', { cls: 'axis' });
        [-PI / 2, PI / 2].forEach(x => k.seg(P(x, -2.05), P(x, 2.1), thin));
        [-1, 0, 1].forEach(y => k.seg(P(-PI / 2, y), P(PI / 2, y), thin));
      });
      k.step('pencil', 'y = tan x: increasing through the origin with slope 1, passing through (±π/4, ±1) and rising towards the asymptotes x = ±π/2 (cut off here at |y| = 2).', () => {
        graph(k, Math.tan, -1.1, 1.1, u, u, { n: 160, width: 3 });
      });
      k.note('y = cot x = 1/tan x, dashed: decreasing from +∞ at x = 0+ to 0 at x = π/2, and from 0 at −π/2 to −∞ at x = 0−; it crosses the tangent curve at (±π/4, ±1).', () => {
        graph(k, x => 1 / Math.tan(x), 0.46, PI / 2 - 0.0001, u, u, { dash: true, cls: 'given', n: 120 }, [-2.1, 2.1]);
        graph(k, x => 1 / Math.tan(x), -PI / 2 + 0.0001, -0.46, u, u, { dash: true, cls: 'given', n: 120 }, [-2.1, 2.1]);
        k.dot(O, { open: true, r: 1.7 }); k.dot(O, { open: true, r: 0.8 });
        key(k, 0.1 * u, -1.6 * u, 'tan x', false, 84);
        key(k, 0.1 * u, -1.85 * u, 'cot x', true, 84);
      });
    }
  });

  /* Fig. 201 (c), page 225 — y = cos x (solid) and y = sec x (dashed) on −π ≤ x ≤ π */
  Curves.figure({
    id: 'fig-201c',
    section: 'trigonometric',
    page: 225,
    title: 'y = cos x and y = sec x',
    tags: ['cosine', 'secant', 'asymptote'],
    note: 'As in the book, the unit on the y-axis is twice the unit on the x-axis.',
    build(k) {
      const ux = 100, uy = 200, O = k.pt(0, 0), P = (x, y) => k.pt(x * ux, y * uy);
      k.given('The axes, the vertical asymptotes x = ±π/2 of sec x (where they are needed, above y = 1 and below y = −1) and the horizontal lines y = 1, 0, −1.', () => {
        k.seg(P(-PI, 0), P(PI + 0.4, 0), { cls: 'axis', arrow: 'end' });
        k.seg(P(0, -2.05), P(0, 2.1), { cls: 'axis', arrow: 'end' });
        k.label(P(PI + 0.4, 0), 'X', 'se', { cls: 'axis' });
        k.label(P(0, 2.1), 'Y', 'ne', { cls: 'axis' });
        [-PI / 2, PI / 2].forEach(x => { k.seg(P(x, 1), P(x, 2.0), thin); k.seg(P(x, -1), P(x, -2.05), thin); });
        [-1, 1].forEach(y => k.seg(P(-PI - 0.1, y), P(PI + 0.2, y), thin));
      });
      k.step('pencil', 'y = cos x for −π ≤ x ≤ π: maximum 1 at x = 0, zeros at ±π/2, minimum −1 at ±π.', () => {
        graph(k, Math.cos, -PI, PI, ux, uy, { n: 200, width: 3 });
      });
      k.note('y = sec x = 1/cos x, dashed: it touches the cosine curve at (0, 1) and (±π, −1) and runs to ±∞ at the asymptotes x = ±π/2.', () => {
        graph(k, x => 1 / Math.cos(x), -1.07, 1.07, ux, uy, { dash: true, cls: 'given', n: 120 });
        graph(k, x => 1 / Math.cos(x), PI / 2 + 0.47, PI, ux, uy, { dash: true, cls: 'given', n: 100 }, [-2.1, 2.1]);
        graph(k, x => 1 / Math.cos(x), -PI, -PI / 2 - 0.47, ux, uy, { dash: true, cls: 'given', n: 100 }, [-2.1, 2.1]);
        [P(0, 1), P(-PI / 2, 0), P(PI / 2, 0), P(-PI, -1), P(PI, -1)].forEach(p => k.dot(p, { open: true, r: 1.2 }));
        k.dot(O, { open: true, r: 1.7 }); k.dot(O, { open: true, r: 0.8 });
        key(k, -1.55 * ux, -1.6 * uy, 'cos x', false);
        key(k, -1.55 * ux, -1.85 * uy, 'sec x', true);
      });
    }
  });

  /* Fig. 202, page 226 — the law of sines: a triangle in its circumscribed circle of radius R */
  Curves.figure({
    id: 'fig-202',
    section: 'trigonometric',
    page: 226,
    title: 'The law of sines: a = 2R sin A in the circumscribed circle',
    tags: ['triangle', 'circle', 'law of sines'],
    note: 'The book writes the side labels slanted along the sides; here they stand beside them, horizontal.',
    build(k) {
      const g = k.g, R = 160, d = g.deg;
      const A_ = 63, B_ = 68, C_ = 49;                                   // the angles of the triangle in degrees (sum 180)
      const O = k.pt(0, 0);
      const Bp = g.polar(O, R, d(-90 - A_)), Cp = g.polar(O, R, d(-90 + A_)), Ap = g.polar(O, R, d(-90 + A_ + 2 * B_));
      const D = k.pt(Ap.x, Bp.y);                                       // foot of the altitude from A on BC
      k.given('The circle of radius R about O and the triangle ABC inscribed in it; the angles are A, B, C (A + B + C = π), the sides a = BC, b = CA, c = AB.', () => {
        k.circle(O, R, { cls: 'given', width: 2 });
        k.dot(O, { open: true, r: 0.9 });
      });
      k.step('straightedge', 'The sides of the triangle. The chord a = BC subtends the angle 2A at the centre, so a = 2R sin A; in the same way b = 2R sin B and c = 2R sin C. Hence a / sin A = b / sin B = c / sin C = 2R.', () => {
        k.poly([Ap, Bp, Cp], { close: true, cls: 'given', width: 2 });
        k.point(Ap, 'A', { at: 'n', open: true });
        k.point(Bp, 'B', { at: 'w', open: true });
        k.point(Cp, 'C', { at: 'e', open: true });
        T(k, (Ap.x + Bp.x) / 2 - 10, (Ap.y + Bp.y) / 2 + 2, 'c = 2R sin C', { size: 0.68, anchor: 'end' });
        T(k, (Ap.x + Cp.x) / 2 + 10, (Ap.y + Cp.y) / 2 + 8, 'b = 2R sin B', { size: 0.68, anchor: 'start' });
        T(k, (Bp.x + Cp.x) / 2, Bp.y - 15, 'a = 2R sin A', { size: 0.8 });
      });
      k.step('straightedge', 'The radii OB and OC (dashed) enclose the angle 2A at the centre, twice the inscribed angle A at the circumference.', () => {
        k.seg(O, Bp, { cls: 'given', dash: true });
        k.seg(O, Cp, { cls: 'given', dash: true });
        k.angle(O, Bp, Cp, { label: '2A', r: 0.75, labelDist: 1.7, upright: true, cls: 'given' });
        T(k, (O.x + Bp.x) / 2 - 5, (O.y + Bp.y) / 2 + 16, 'R', { size: 0.85 });
        T(k, (O.x + Cp.x) / 2 + 16, (O.y + Cp.y) / 2 + 16, 'R', { size: 0.85 });
      });
      k.step('square', 'The altitude AD (dashed) meets BC at D. It splits a into BD = c cos B = 2R sin C cos B and DC = b cos C = 2R sin B cos C, and so sin A = sin(B + C) = sin B cos C + cos B sin C.', () => {
        k.seg(Ap, D, { cls: 'given', dash: true });
        k.dot(D, { open: true, r: 1 });
        T(k, D.x - 6, Bp.y + 10, '2R sin C cos B', { size: 0.6, anchor: 'end' });
        T(k, D.x + 8, Bp.y + 10, '2R sin B cos C', { size: 0.6, anchor: 'start' });
      });
    }
  });

  /* Fig. 203 (a), page 229 — the sine curve as the orthogonal projection of a cylindrical helix
     onto a plane parallel to the axis of the cylinder. An oblique sketch: x along the axis (to the right),
     y the depth (away from the viewer), z up; a point (x, y, z) is drawn at (x + 0.85·y, z + 0.35·y). */
  Curves.figure({
    id: 'fig-203a',
    section: 'trigonometric',
    page: 229,
    title: 'The sine curve as the projection of a helix on a cylinder',
    tags: ['helix', 'cylinder', 'projection', '3D sketch'],
    note: 'The book draws this as a freehand perspective sketch; here the helix, the box and the projected curve are computed in one oblique projection (the visible half of each turn solid, the hidden half dashed).',
    build(k) {
      const r = 100, p = 27, al = 0.85, be = 0.35, turns = 3, x0 = 0, x1 = TAU * turns * p;
      const S = (x, y, z) => k.pt(x + al * y, z + be * y);
      const edge = (a, b, o) => k.seg(S(a[0], a[1], a[2]), S(b[0], b[1], b[2]), Object.assign({ cls: 'aux' }, o || {}));
      k.given('The cylinder (its axis dash-dot) with the circumscribed box: the floor of the box is the plane onto which the helix will be projected, parallel to the axis.', () => {
        // floor and top rectangles, and the four vertical edges (the hidden back edges dashed)
        edge([x0, -r, -r], [x1, -r, -r]); edge([x0, r, -r], [x1, r, -r], { dash: true }); edge([x0, -r, -r], [x0, r, -r]); edge([x1, -r, -r], [x1, r, -r]);
        edge([x0, -r, r], [x1, -r, r]); edge([x0, r, r], [x1, r, r], { dash: true }); edge([x0, -r, r], [x0, r, r], { dash: true }); edge([x1, -r, r], [x1, r, r], { dash: true });
        edge([x0, -r, -r], [x0, -r, r]); edge([x1, -r, -r], [x1, -r, r]); edge([x0, r, -r], [x0, r, r], { dash: true }); edge([x1, r, -r], [x1, r, r], { dash: true });
        k.seg(S(x0 - 14, 0, 0), S(x1 + 14, 0, 0), { cls: 'cons', dash: '14 4 2 4' });
      });
      k.step('pencil', 'The helix x = p·t, y = r cos t, z = r sin t on the cylinder: it cuts every element of the cylinder at the same angle. The half of each turn nearest the viewer is drawn solid, the half behind the cylinder dashed.', () => {
        const hel = t => [p * t, r * Math.cos(t), r * Math.sin(t)];
        k.curve(t => { const h = hel(t); if (Math.cos(t) > 0.004) return null; const q = S(h[0], h[1], h[2]); return [q.x, q.y]; }, [0, TAU * turns], { n: 900, cls: 'given', width: 2.6 });
        k.curve(t => { const h = hel(t); if (Math.cos(t) < -0.004) return null; const q = S(h[0], h[1], h[2]); return [q.x, q.y]; }, [0, TAU * turns], { n: 900, cls: 'given', dash: true, width: 2.2 });
      });
      k.step('pencil', 'Drop perpendiculars from the helix to the floor (parallel to the axis): the feet make the thick curve y = r cos(x/p), a sine curve in the plane of the floor. One perpendicular is drawn dashed.', () => {
        const fl = t => S(p * t, r * Math.cos(t), -r);
        k.curve(t => { const q = fl(t); return [q.x, q.y]; }, [0, TAU * turns], { n: 600, cls: 'curve', width: 3 });
        const t1 = TAU + 3 * PI / 4, H = S(p * t1, r * Math.cos(t1), r * Math.sin(t1)), F = fl(t1);
        k.seg(H, F, { cls: 'cons', dash: true });
        k.dot(H, { open: true, r: 0.8 }); k.dot(F, { open: true, r: 0.8 });
        T(k, S(x1 + 30, 0, 0).x, S(x1 + 30, 0, 0).y, 'axis', { size: 0.75, anchor: 'start' });
        T(k, S(0.5 * x1, -r, -r).x, S(0.5 * x1, -r, -r).y - 24, 'sine curve (the projection)', { size: 0.8 });
        T(k, S(x1 + 26, 0, 0).x, S(x1 + 26, 0, 0).y + 52, 'helix', { size: 0.8, anchor: 'start' });
      });
    }
  });

  /* Fig. 203 (b), page 229 — the sine curve as the development of an elliptic section of a right circular
     cylinder: the plane z/2 + y/k = 1 cuts the cylinder (z − 1)² + x² = 1 (axis parallel to OY); rolling the
     cylinder on the XY plane carries the point P = (x, y, z) to P1 = (x = θ, y), and y = (k/2)(1 + cos x). */
  Curves.figure({
    id: 'fig-203b',
    section: 'trigonometric',
    page: 229,
    title: 'The sine curve as the development of an elliptical section of a cylinder',
    tags: ['cylinder', 'ellipse', 'development', '3D sketch'],
    note: 'An oblique sketch with k = 1 and θ = 0.97 rad: the point (x, y, z) is drawn at O + x·(310, −9) + y·(0, 345) + z·(−170, −111). The book writes the long labels along the lines; here they stand beside them.',
    build(k) {
      const g = k.g, th = 0.97;
      const ex = [310, -9], ey = [0, 345], ez = [-170, -111];
      const S = (x, y, z) => k.pt(x * ex[0] + y * ey[0] + z * ez[0], x * ex[1] + y * ey[1] + z * ez[1]);
      const O = S(0, 0, 0);
      const circ = t => S(Math.sin(t), 0, 1 - Math.cos(t));                      // the circle (z − 1)² + x² = 1 in the plane y = 0
      const sect = t => S(Math.sin(t), (1 + Math.cos(t)) / 2, 1 - Math.cos(t));   // the section by the plane z/2 + y/k = 1 (k = 1)
      const Zp = S(0, 0, 2), Yp = S(0, 1, 0), Cc = S(0, 0, 1);
      const Q = circ(th), Pt = sect(th);
      const Qx = S(0, 0, 1 - Math.cos(th));                                       // the point of the z-axis at the height of P
      const Ty = S(0, (1 + Math.cos(th)) / 2, 1 - Math.cos(th));                  // the point of the plane trace at the height of P
      const Xa = S(th, 0, 0), P1 = S(th, (1 + Math.cos(th)) / 2, 0);
      k.given('The axes OX, OY, OZ (drawn obliquely), the cylinder\'s base circle (z − 1)² + x² = 1 in the plane y = 0 with centre C = (0, 0, 1), and the trace z/2 + y/k = 1 of the cutting plane, which meets the axes at Z = (0, 0, 2) and Y = (0, k, 0).', () => {
        k.seg(O, S(2.28, 0, 0), { cls: 'axis', arrow: 'end' });
        k.seg(O, S(0, 1.02, 0), { cls: 'axis', arrow: 'end' });
        k.seg(O, S(0, 0, 2.28), { cls: 'axis', arrow: 'end' });
        k.label(S(2.28, 0, 0), 'X', 'se', { cls: 'axis' });
        k.label(S(0, 1.02, 0), 'Y', 'n', { cls: 'axis', dist: 0.8 });
        k.label(S(0, 0, 2.28), 'z', 'sw', { cls: 'axis', dist: 0.8 });
        k.dot(O, { open: true, r: 1.5 }); k.dot(O, { open: true, r: 0.7 });
        k.seg(Zp, Yp, { cls: 'given', width: 1.6 });
        k.point(Zp, 'Z', { at: 's', open: true, r: 0.9 });
        k.curve(t => { const q = circ(t); return [q.x, q.y]; }, [0, PI], { cls: 'given', width: 3, n: 120 });
        k.dot(Cc, { open: true, r: 0.9 });
        T(k, (Zp.x + Yp.x) / 2 - 40, (Zp.y + Yp.y) / 2 + 10, 'z/2 + y/k = 1', { size: 0.8, anchor: 'end' });
      });
      k.step('pencil', 'The elliptical section of the cylinder by the plane: the points (sin t, y, 1 − cos t) with y = (k/2)(1 + cos t), from Y at t = 0 to Z at t = π. Take the point P on it at the parameter θ.', () => {
        k.curve(t => { const q = sect(t); return [q.x, q.y]; }, [0, PI], { cls: 'given', width: 3, n: 120 });
        k.dot(Pt, { open: true, r: 0.9 });
        k.label(Pt, 'P', 'ne', { upright: true, dist: 0.9 });
      });
      k.step('straightedge', 'The numbers behind P: in the base circle the radius CQ makes the angle θ with CO, so Q = (sin θ, 0, 1 − cos θ), and the height of P above the XZ-plane is y = k(1 − z/2) = (k/2)(1 + cos θ).', () => {
        k.seg(Cc, Q, { cls: 'cons' });
        k.seg(Qx, Q, { cls: 'cons' });
        k.seg(Qx, Ty, { cls: 'cons' });
        k.seg(Ty, Pt, { cls: 'cons' });
        k.seg(Q, Pt, { cls: 'cons' });
        k.dot(Q, { open: true, r: 0.8 }); k.dot(Qx, { open: true, r: 0.8 }); k.dot(Ty, { open: true, r: 0.8 });
        k.angle(Cc, Q, O, { label: 'θ', r: 1.1, labelDist: 1.5, upright: true });
        T(k, (Qx.x + Q.x) / 2, (Qx.y + Q.y) / 2 + 12, 'sin θ', { size: 0.75 });
        T(k, (Cc.x + Q.x) / 2 + 12, (Cc.y + Q.y) / 2 - 14, '1', { size: 0.75 });
        T(k, (Cc.x + Zp.x) / 2 - 12, (Cc.y + Zp.y) / 2 - 2, '1', { size: 0.75 });
        T(k, Ty.x - 14, (Ty.y + Qx.y) / 2, 'y', { size: 0.8 });
        T(k, Pt.x + 10, (Pt.y + Q.y) / 2, 'y', { size: 0.8, anchor: 'start' });
      });
      k.step('roll', 'Roll the cylinder on the XY plane (the dashed arrows): the base point Q lands on the x-axis at x = θ (the arc length), and P lands at P1 = (x = θ, y), directly above it at the height y.', () => {
        const arrowArc = (a, b, bend) => {
          const m = g.mid(a, b), n = g.perp(g.unit(g.sub(b, a))), c = g.add(m, g.mul(n, bend));
          k.curve(s => { const u = 1 - s; return [u * u * a.x + 2 * u * s * c.x + s * s * b.x, u * u * a.y + 2 * u * s * c.y + s * s * b.y]; }, [0, 1], { cls: 'given', dash: true, width: 1.8, n: 40, arrow: 0.97 });
        };
        arrowArc(Q, Xa, 22);
        arrowArc(Pt, P1, 26);
        k.dot(Xa, { open: true, r: 0.8 }); k.dot(P1, { open: true, r: 0.8 });
        k.seg(Xa, P1, { cls: 'cons' });
        T(k, P1.x + 8, (Xa.y + P1.y) / 2, 'y', { size: 0.8, anchor: 'start' });
        k.label(P1, 'P_1', 'ne', { upright: true, dist: 0.9 });
        T(k, (O.x + Xa.x) / 2, O.y + 14, 'x = θ', { size: 0.75 });
        T(k, S(1.9, 0, 0).x, S(1.9, 0, 0).y - 62, 'z = 1 − cos θ', { size: 0.75 });
      });
      k.step('pencil', 'The developed cylinder: y = (k/2)(1 + cos x), the cosine (sine) curve, between the line y = k and the mean line y = k/2 (dash-dot), which it crosses at x = π/2. The line z = 2 through Z is the second edge of the strip.', () => {
        const dev = x => S(x, (1 + Math.cos(x)) / 2, 0);
        k.curve(x => { const q = dev(x); return [q.x, q.y]; }, [0, 2.32], { cls: 'curve', width: 3, n: 120 });
        k.seg(S(0, 1, 0), S(2.4, 1, 0), { cls: 'cons' });
        k.seg(S(0, 0, 2), S(3.4, 0, 2), { cls: 'cons' });
        k.seg(S(0, 0.5, 0), S(2.4, 0.5, 0), { cls: 'cons', dash: '14 4 2 4' });
        k.dot(S(0, 0.5, 0), { open: true, r: 0.8 }); k.dot(dev(PI / 2), { open: true, r: 0.8 });
        const hat = [];
        for (let i = 0; i <= 8; i++) hat.push(circ(PI - 0.9 + 0.9 * i / 8));
        for (let i = 8; i >= 0; i--) hat.push(sect(PI - 0.9 + 0.9 * i / 8));
        k.hatch(hat, { angle: PI / 2, gap: 0.5, cls: 'cons' });
      });
    }
  });

  /* Fig. 204, page 230 — Mercator's map of a great-circle route: a sphere, the circumscribing cylinder
     (axis the N–S line), the plane of the great circle (cutting the cylinder in an ellipse), the rays from the
     centre of the sphere through the route onto the cylinder, an aeroplane on the route. Hand-drawn sketch in the
     book; here an orthographic sketch built from circles and ellipses. */
  Curves.figure({
    id: 'fig-204',
    section: 'trigonometric',
    page: 230,
    title: "Mercator's map of a great-circle route: sphere, cylinder, plane and rays",
    tags: ['Mercator', 'sphere', 'cylinder', '3D sketch'],
    note: 'The book\'s sketch shows the Americas on the globe; here the globe carries a few meridians and parallels instead. The last step adds the developed cylinder with the route as one period of a sine curve, which the book describes in the text only.',
    build(k) {
      const g = k.g, R = 100, G = k.pt(0, 0);
      const ell = (a, b, phi, t) => [a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi), a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi)];
      const route = t => ell(R, 36, g.deg(20), t);                          // the great circle of the route, seen obliquely
      k.given('The earth as a sphere of radius R, with the centre G (the point from which the map is projected).', () => {
        k.circle(G, R, { cls: 'given', width: 2.4 });
        k.dot(G, { r: 1.3 });
        // a few meridians and parallels on the visible side
        [24, 66].forEach(a => { k.curve(t => [a * Math.cos(t), R * Math.sin(t)], [-PI / 2, PI / 2], { cls: 'aux', n: 80 }); });
        [-48, -12, 40].forEach(h => { const w = Math.sqrt(R * R - h * h); k.curve(t => [w * Math.cos(t), h + 0.22 * w * Math.sin(t)], [PI, TAU], { cls: 'aux', n: 80 }); });
      });
      k.step('straightedge', 'The cylinder that circumscribes the sphere along the equator, its axis the N–S line: two vertical walls tangent to the sphere, with the front edges of its top and bottom rims.', () => {
        k.seg(k.pt(-R, -135), k.pt(-R, 118), { cls: 'given', width: 1.8 });
        k.seg(k.pt(R, -135), k.pt(R, 118), { cls: 'given', width: 1.8 });
        k.curve(t => [R * Math.cos(t), 118 + 26 * Math.sin(t)], [PI, TAU], { cls: 'given', width: 1.8, n: 100 });
        k.curve(t => [R * Math.cos(t), -135 + 26 * Math.sin(t)], [PI, TAU], { cls: 'given', width: 1.8, n: 100 });
      });
      k.step('straightedge', 'The plane of the great-circle route, through the centre G (drawn as a parallelogram), and its section with the sphere: the route, an ellipse in this view, seen in full on the near side and dashed behind.', () => {
        const A = route(0.6), B = route(0.6 + PI / 2), s = 1.34;
        const c = (a, b) => k.pt(s * (a * A[0] + b * B[0]), s * (a * A[1] + b * B[1]));
        k.poly([c(1, 1), c(-1, 1), c(-1, -1), c(1, -1)], { close: true, cls: 'given', width: 1.6 });
        k.curve(t => route(t), [PI, TAU], { cls: 'given', width: 2.4, n: 140 });
        k.curve(t => route(t), [0, PI], { cls: 'given', dash: true, width: 1.6, n: 140 });
      });
      k.step('straightedge', 'Rays from G through points of the route (dashed) meet the wall of the cylinder: the points where they land are the Mercator map of the route on the cylinder.', () => {
        [-0.35, -0.12, 0.1, 0.32, 0.55, 0.78].forEach(t => {
          const q = route(PI + t);                                          // a point of the near arc of the route
          const dir = k.pt(q[0], q[1]), hit = k.pt(R, q[1] * R / q[0]);
          k.seg(G, hit, { cls: 'given', dash: true, width: 1.2 });
          k.dot(hit, { r: 0.6 });
        });
        const pl = route(PI + 0.92);                                         // an aeroplane on the route
        const ang = g.angleOf(g.sub(k.pt(route(PI + 0.98)[0], route(PI + 0.98)[1]), k.pt(route(PI + 0.86)[0], route(PI + 0.86)[1])));
        const body = [[-9, 0], [-3, 1.4], [6, 1.4], [10, 0], [6, -1.4], [-3, -1.4]], wing = [[-1, 1.4], [-4, 10], [0, 10], [4, 1.4]], wing2 = [[-1, -1.4], [-4, -10], [0, -10], [4, -1.4]], tail = [[-9, 0], [-12, 4], [-9, 4], [-6, 0]], tail2 = [[-9, 0], [-12, -4], [-9, -4], [-6, 0]];
        [body, wing, wing2, tail, tail2].forEach(sh => k.poly(sh.map(p => { const q = g.rot(k.pt(p[0], p[1]), ang); return k.pt(pl[0] + q.x, pl[1] + q.y); }), { close: true, fill: '#1b1b1b', cls: 'given', width: 0.8 }));
      });
      k.note('Cut the cylinder along an element and lay it flat (right): the route becomes one period of a sine curve, whose height above the equator is proportional to the tangent of the latitude (hence to sin of the longitude measured from the node).', () => {
        const x0 = 170, w = 190, top = 118, bot = -135;
        k.poly([k.pt(x0, bot), k.pt(x0 + w, bot), k.pt(x0 + w, top), k.pt(x0, top)], { close: true, cls: 'given', width: 1.6 });
        k.seg(k.pt(x0, -8), k.pt(x0 + w, -8), { cls: 'cons', dash: true });
        k.curve(t => [x0 + w * t / TAU, -8 + 82 * Math.sin(t)], [0, TAU], { cls: 'curve', width: 3, n: 120 });
        T(k, x0 + w / 2, bot - 14, 'developed cylinder', { size: 0.8 });
        T(k, x0 + w / 2, top + 14, 'one period of a sine curve', { size: 0.8 });
      });
    }
  });

  /* Fig. 205, page 231 — the plate of composed sounds, from Harkin's Fundamental Mathematics (as cited
     in the book): (a) sin x + sin 2x with its two components, (b) four tuning forks in the ratios 4 : 5 : 6 : 8,
     (c) a violin, (d) a French horn. (c) and (d) are drawn as sums of a few harmonics with amplitudes chosen so
     that the curves resemble the plate. */
  Curves.figure({
    id: 'fig-205a',
    section: 'trigonometric',
    page: 231,
    title: 'Composition of sounds: sin x + sin 2x',
    tags: ['harmonic analysis', 'sine', 'sum'],
    build(k) {
      const ux = 110, uy = 125, P = (x, y) => k.pt(x * ux, y * uy);
      k.given('The two components over one period 0 ≤ x ≤ 2π: the fundamental sin x and its octave overtone sin 2x (thin curves).', () => {
        graph(k, Math.sin, 0, TAU, ux, uy, { cls: 'given', width: 1.5, n: 200 });
        graph(k, x => Math.sin(2 * x), 0, TAU, ux, uy, { cls: 'given', width: 1.5, n: 200 });
        T(k, 2.62 * ux, 0.98 * uy, 'sin x', { size: 0.85 });
        T(k, 5.05 * ux, 0.93 * uy, 'sin 2x', { size: 0.85 });
      });
      k.step('pencil', 'Add the ordinates point by point: the heavy curve y = sin x + sin 2x, the form a tuning fork with an octave overtone would give.', () => {
        graph(k, x => Math.sin(x) + Math.sin(2 * x), 0, TAU, ux, uy, { n: 300, width: 3.2 });
        T(k, 0.95 * ux, 1.93 * uy, 'sin x + sin 2x', { size: 0.85 });
      });
      k.note('Composition of Sounds. A tuning fork with octave overtone would resemble the heavy curve.', () => {
        T(k, TAU / 2 * ux, -2.2 * uy, 'Composition of Sounds.  A tuning fork with octave overtone would resemble the', { size: 0.8 });
        T(k, TAU / 2 * ux, -2.5 * uy, 'heavy curve.', { size: 0.8 });
      });
    }
  });

  Curves.figure({
    id: 'fig-205b',
    section: 'trigonometric',
    page: 231,
    title: 'Four tuning forks in unison: Do – Mi – Sol – Do, ratios 4 : 5 : 6 : 8',
    tags: ['harmonic analysis', 'chord', 'sum'],
    note: 'The curve is the sum of four sine waves of equal amplitude, with the frequencies in the ratio 4 : 5 : 6 : 8 (drawn upside down, so that each tall spike is followed by the deep dip, as on the plate); the pattern repeats after t = 2π.',
    build(k) {
      const ux = 36, uy = 40;
      const f = t => -(Math.sin(4 * t) + Math.sin(5 * t) + Math.sin(6 * t) + Math.sin(8 * t));
      k.given('The four waves have the frequencies 4, 5, 6, 8 (Do, Mi, Sol, high Do) and the same amplitude.', () => {
        T(k, 14 * ux, -4.7 * uy, 'Four Tuning Forks in Unison—Do-Mi-Sol-Do in ratios 4 : 5 : 6 : 8.', { size: 0.85 });
      });
      k.step('pencil', 'The composite wave −(sin 4t + sin 5t + sin 6t + sin 8t) over four and a half periods of the common period 2π: the tall spikes mark the moments when the four waves reinforce each other.', () => {
        k.curve(t => [t * ux, f(t) * uy], [1.38, 1.38 + 4.5 * TAU], { n: 2600, width: 2.4 });
      });
    }
  });

  Curves.figure({
    id: 'fig-205c',
    section: 'trigonometric',
    page: 231,
    title: 'Violin',
    tags: ['harmonic analysis', 'violin', 'sum'],
    note: 'A synthetic violin-like wave: the sum of the first five harmonics with decreasing amplitudes and phases chosen to give the slow rise with shoulders and the quick fall of the recorded trace.',
    build(k) {
      const ux = 30, uy = 62;
      const a = [1, 0.45, 0.35, 0.15, 0.1], ph = [0, 2.2, 3.0, 4.4, 5.2];
      const f = t => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * Math.sin((i + 1) * t + ph[i]); return s; };
      k.given('The wave repeats every period 2π; five and a half periods are shown.', () => {
        T(k, 17.5 * ux, -2.6 * uy, 'Violin.', { size: 0.9 });
      });
      k.step('pencil', 'The sum of the harmonics sin(nt + φn), n = 1…5, with the amplitudes 1, 0.45, 0.35, 0.15, 0.10: each period rises with a shoulder to a peak and falls steeply.', () => {
        k.curve(t => [t * ux, f(t) * uy], [0, 5.6 * TAU], { n: 1800, width: 2.4 });
      });
    }
  });

  Curves.figure({
    id: 'fig-205d',
    section: 'trigonometric',
    page: 231,
    title: 'French horn',
    tags: ['harmonic analysis', 'horn', 'sum'],
    note: 'A synthetic horn-like wave: the 6th harmonic carrying a saw-tooth envelope, that is the sum of the harmonics 1 to 12 with the amplitudes of the product (0.45 + 0.55·saw)·(cos 6t + 0.35 sin 6t). It gives one tall spike per period followed by a deep dip and about six ripples that die away, as on the plate.',
    build(k) {
      const ux = 50, uy = 62;
      const saw = (M, t) => { let s = 0; for (let m = 1; m <= M; m++) s += Math.sin(m * t) / m; return 2 / PI * s; };   // (π − t)/π on (0, 2π)
      const f = t => (0.45 + 0.55 * saw(6, t + 0.12)) * (Math.cos(6 * t) + 0.35 * Math.sin(6 * t)) * 1.1;
      const t0 = 0.12, t1 = 3.3 * TAU;
      k.given('The mean level (the straight line); the wave swings about it.', () => {
        k.seg(k.pt(-10, 0), k.pt(t1 * ux + 10, -0.28 * uy), { cls: 'given', width: 1.4 });
        T(k, t1 * ux / 2, -2.6 * uy, 'French Horn.', { size: 0.9 });
      });
      k.step('pencil', 'The wave: the 6th harmonic whose amplitude jumps up once per period and then dies away — a sum of harmonics 1 to 12 — over three periods.', () => {
        k.curve(t => [t * ux, f(t) * uy], [t0, t1], { n: 1800, width: 2.4 });
      });
    }
  });

  /* Fig. 206, page 232 — the Fourier development of the step function y = 0 (−π < x < 0), y = π (0 < x < π):
     y = π/2 + 2 (sin x + sin 3x / 3 + sin 5x / 5 + …). The partial sums 2, 3, 4 (curves) and the levels of the first
     approximation (1) are drawn on the step. */
  Curves.figure({
    id: 'fig-206',
    section: 'trigonometric',
    page: 232,
    title: 'The Fourier development of the step function: the first four approximations',
    tags: ['Fourier', 'step function', 'partial sums'],
    note: 'Curve 2 is π/2 + 2 sin x, curve 3 adds (2/3) sin 3x, curve 4 adds (2/5) sin 5x. The book labels the pair of levels π/4 and 3π/4 as curve 1. The open circles are the points where the curves cross the step levels y = π (right) and y = 0 (left).',
    build(k) {
      const u = 100, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      const part = m => x => { let s = 0; for (let j = 0; j < m; j++) s += Math.sin((2 * j + 1) * x) / (2 * j + 1); return PI / 2 + 2 * s; };   // m sine terms
      const roots = (f, a, b) => { const out = []; let x = a, fx = f(a); const N = 4000; for (let i = 1; i <= N; i++) { const y = a + (b - a) * i / N, fy = f(y); if (fx * fy < 0) { let lo = x, hi = y; for (let j = 0; j < 50; j++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } out.push((lo + hi) / 2); } x = y; fx = fy; } return out; };
      k.given('The axes, the step function itself (thin lines: y = 0 for −π < x < 0 and y = π for 0 < x < π) and the level y = π/2 through the jump, where all the approximations pass.', () => {
        k.seg(P(-PI, 0), P(PI + 0.95, 0), { cls: 'axis', arrow: 'end' });
        k.seg(P(0, -0.2), P(0, 4.0), { cls: 'axis', arrow: 'end' });
        k.label(P(PI + 0.95, 0), 'X', 'se', { cls: 'axis' });
        k.label(P(0, 4.0), 'Y', 'nw', { cls: 'axis' });
        k.seg(P(0, PI), P(PI, PI), thin); k.seg(P(PI, PI), P(PI, PI / 2), thin);
        k.seg(P(-PI, 0), P(-PI, PI / 2), thin);
        k.seg(P(-PI, PI / 2), P(PI, PI / 2), thin);
        k.dot(O, { open: true, r: 1.7 }); k.dot(O, { open: true, r: 0.8 });
        [P(-PI, PI / 2), P(0, PI / 2), P(PI, PI / 2)].forEach(p => k.dot(p, { open: true, r: 1.0 }));
        T(k, -0.12 * u, PI * u, 'π', { size: 0.85, anchor: 'end' });
        T(k, PI * u + 6, 0.22 * u, 'π', { size: 0.85 });
        T(k, (-PI * u) - 12, 0, '−π', { size: 0.85, anchor: 'end' });
        T(k, 0.17 * u, -0.2 * u, 'O', { size: 0.85 });
        T(k, 1.9 * u, (PI / 2 - 0.22) * u, 'y = π/2', { size: 0.85 });
      });
      k.step('pencil', 'The partial sums π/2 + 2 sin x (2), then adding (2/3) sin 3x (3), then (2/5) sin 5x (4): each is an odd wave about the level π/2 that follows the step more and more closely; on each side of the jump they overshoot.', () => {
        [1, 2, 3].forEach(m => graph(k, part(m), -PI, PI, u, u, { n: 400, cls: 'given', width: 1.6 }));
      });
      k.note('The first approximation (1): the two constant levels π/4 on the left and 3π/4 on the right; and the circles where the curves cross the step levels.', () => {
        k.seg(P(0, 3 * PI / 4), P(PI, 3 * PI / 4), { cls: 'given', width: 1.6 });
        k.seg(P(-PI, PI / 4), P(0, PI / 4), { cls: 'given', width: 1.6 });
        [P(0, 3 * PI / 4), P(PI, 3 * PI / 4), P(0, PI / 4)].forEach(p => k.dot(p, { open: true, r: 1.0 }));
        T(k, 3.06 * u, (3 * PI / 4 + 0.5) * u, '1', { size: 0.85 });
        const sums = [part(1), part(2), part(3)];
        const xs = [];
        sums.forEach(f => roots(x => f(x) - PI, 0.001, PI - 0.001).forEach(r => { if (!xs.some(v => Math.abs(v - r) < 0.02)) xs.push(r); }));
        xs.forEach(r => { k.dot(P(r, PI), { open: true, r: 0.8 }); k.dot(P(-r, 0), { open: true, r: 0.8 }); });
        const lab = (txt, xc, f, dx, dy) => { const yc = f(xc); k.arrow(P(xc + dx, yc + dy), P(xc + 0.04, yc + 0.06), { cls: 'given', width: 1, headSize: 0.5 }); T(k, (xc + dx + 0.06) * u, (yc + dy + 0.08) * u, txt, { size: 0.85 }); };
        lab('2', 2.2, part(1), 0.35, 0.45);
        lab('3', 2.52, part(2), 0.38, 0.4);
        lab('4', 2.78, part(3), 0.4, 0.33);
        k.arrow(P(3.0, 3 * PI / 4 + 0.45), P(2.82, 3 * PI / 4 + 0.03), { cls: 'given', width: 1, headSize: 0.5 });
      });
    }
  });
})();
