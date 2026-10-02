/* Curves Workshop · figures/spirals.js — Figs. 183–194 (pages 206–215)
 *
 * 183 the equiangular spiral, 184 the loxodrome and its stereographic image, 185 the septa of the
 * Nautilus, 186 and 187 the spiral of Archimedes (points, carpenter's square, heart cam), 188 the
 * conical helix, 189 the reciprocal spiral, 190 Fermat's parabolic spiral, 191 the lituus, 192 the
 * Ionic volute, 193 Euler's spiral, 194 the Cotes spiral r sin 4θ = a and its inverse rose.
 */
(function () {
'use strict';
const PI = Math.PI, TAU = 2 * Math.PI;

/* Fig. 183, page 206 — r = a·e^{θ cot α}. Every radius vector meets the curve at the constant angle α.
   P is the point at the polar angle θ; the tangent at P makes the angle φ = θ + α with the initial line.
   The perpendicular to OP at O meets the tangent at T (PT = r sec α, the polar tangent, equal to the arc
   length from the pole) and the normal at C (PC = r csc α = R, the polar normal, equal to the radius of
   curvature). N is the foot of the perpendicular from O on the tangent (ON = p = r sin α). The small drawing
   at the right is a spiral-drawing instrument: a bar turning about a pin at the pole, with a small cutting
   wheel fixed at the end of the bar at the angle α. */
Curves.figure({
  id: 'fig-183',
  section: 'spirals',
  page: 206,
  title: 'The equiangular spiral: the constant angle α, the polar tangent PT and the polar normal PC',
  tags: ['tangent', 'polar', 'instrument'],
  note: 'The book draws α = 45° and θ = 60°. The small sketch at the right is an instrument that cuts the spiral with a wheel set at the angle α to the bar.',
  build(k) {
    const g = k.g;
    const alpha = g.deg(45), cot = 1 / Math.tan(alpha), th = g.deg(60), rP = 150;
    const a0 = rP * Math.exp(-th * cot);
    const sp = k.curves.equiangularSpiral(a0, cot);
    const O = k.pt(0, 0);
    const P = g.polar(O, rP, th);
    const T = g.polar(O, rP * Math.tan(alpha), th - PI / 2);        // the perpendicular to OP at O meets the tangent here
    const C = g.polar(O, rP * cot, th + PI / 2);                    // ... and the normal here
    const N = g.foot(O, P, T);
    const Q = g.lineLine(P, T, O, k.pt(1, 0));                      // the tangent meets the initial line
    const dTan = g.unit(g.sub(T, P));
    const dPerp = g.unit(g.sub(T, O));

    k.given('The initial line, the pole O, and the point P of the spiral at the polar angle θ; OP = r is the radius vector.', () => {
      k.arrow(k.pt(-125, 0), k.pt(170, 0), { cls: 'given' });
      k.seg(O, P, { cls: 'cons' });
      k.point(O, 'O', { at: 'sw', open: true, r: 0.8 });
      k.point(P, 'P', { at: 'ne', open: true, r: 0.8 });
      k.label(g.mid(O, P), 'r', 'nw', { dist: 1.0 });
      k.angle(O, k.pt(60, 0), P, { label: 'θ', r: 1.5, labelDist: 1.25 });
    });
    k.step('square', 'At O draw the perpendicular to OP (the polar line). The polar tangent and the polar normal of P end on it.', () => {
      k.seg(g.along(C, O, -12), g.along(T, O, -12), { cls: 'cons', nobounds: true });
      k.seg(g.add(C, g.mul(g.unit(g.sub(C, O)), 12)), g.add(T, g.mul(dPerp, 12)), { cls: 'cons' });
    });
    k.step('protractor', 'The tangent at P is the line that meets the radius vector at the constant angle α. At P lay off the angle α from PO; the line meets the perpendicular at T. PT = r sec α is the polar tangent, and by Descartes its length equals the arc of the spiral from the pole to P.', () => {
      k.seg(g.add(P, g.mul(dTan, -22)), g.add(T, g.mul(dTan, 12)), { cls: 'cons' });
      k.point(T, 'T', { at: 'se', open: true, r: 0.8 });
      k.angle(P, O, T, { label: 'α', r: 1.6, labelDist: 1.3 });
    });
    k.step('square', 'At P draw the perpendicular to the tangent: the normal, which meets the perpendicular to OP at C. PC = r csc α = R is the polar normal, and it is also the radius of curvature at P (R = s cot α). The angle at C is α as well.', () => {
      k.seg(C, P, { cls: 'cons' });
      k.right(P, T, C, { r: 0.9 });
      k.point(C, 'C', { at: 'n', open: true, r: 0.8 });
      k.label(g.mid(C, P), 'R', 'n', { dist: 1.0 });
      k.angle(C, O, P, { label: 'α', r: 1.4, labelDist: 1.3 });
    });
    k.step('square', 'From O drop the perpendicular ON on the tangent: ON = p = r sin α, the pedal length. The tangent makes the angle φ = θ + α with the initial line.', () => {
      k.seg(O, N, { cls: 'cons' });
      k.point(N, 'N', { at: 'ne', open: true, r: 0.8 });
      k.angle(Q, k.pt(Q.x + 40, 0), P, { r: 1.0, n: 1 });
      k.text(Q.x + 24, Q.y + 20, 'φ = θ + α', { anchor: 'start', size: 0.85, upright: true });
    });
    k.step('pencil', 'The spiral r = a·e^{θ cot α}, which leaves the pole in ever wider turns and meets every radius vector at the angle α. P is on it, and its tangent at P is PT.', () => {
      k.curve(sp, [-4.3, 1.34], { n: 500 });
    });
    k.note('The small sketch of the book: an instrument for the spiral. A bar turns about a pin at the pole; at the far end of the bar a small cutting wheel is fixed with its plane at the constant angle α to the bar. The wheel can only roll along its own plane, so it cuts a curve that meets every radius at α.', () => {
      const Q0 = k.pt(285, -25), al = g.deg(58), cc = 1 / Math.tan(al), thW = g.deg(24), rW = 135;
      const aw = rW * Math.exp(-thW * cc);
      const W = g.polar(Q0, rW, thW);
      k.curve(t => { const r = aw * Math.exp(cc * t); return [Q0.x + r * Math.cos(t), Q0.y + r * Math.sin(t)]; }, [thW - 3.7, thW + 0.1], { n: 260, cls: 'given', width: 2.4 });
      const d = g.dir(thW), nrm = g.perp(d);
      k.bar(g.add(Q0, g.mul(d, -14)), g.add(W, g.mul(d, 12)), { cls: 'given' });
      k.poly([g.add(Q0, g.mul(nrm, -9)), g.add(Q0, g.mul(d, 12)), g.add(Q0, g.mul(nrm, 9)), g.add(Q0, g.mul(d, -10))], { close: true, cls: 'given' });
      k.dot(Q0, { r: 0.6 });
      const Wc = g.add(W, g.mul(g.dir(thW + al - PI / 2 + PI), -0));
      k.circle(g.add(W, g.mul(nrm, -4)), 8, { cls: 'given', hatch: 'out', hatchLen: 0.5 });
      k.seg(g.add(Q0, g.mul(d, 0.55 * rW)), g.add(g.add(Q0, g.mul(d, 0.55 * rW)), g.mul(nrm, 10)), { cls: 'given' });
    });
  }
});

/* Fig. 186, page 209 — r = aθ with both branches (θ > 0 and θ < 0) from θ = −3π/2 to 3π/2. The two branches
   are mirror images in OY; they meet at O (tangent to OX... both leave the pole in directions ±x), cross at
   (0, aπ/2) and at (0, −3πa/2); they meet OX at (−aπ, 0) and (aπ, 0). Arrows show θ increasing. */
Curves.figure({
  id: 'fig-186',
  section: 'spirals',
  page: 209,
  title: 'The spiral of Archimedes r = aθ: points by dividing the circle and the radius',
  tags: ['construction', 'archimedes', 'polar', 'dividers'],
  build(k) {
    const g = k.g;
    const a = 50, u = a * PI / 6;                        // u: the radius that belongs to a turn of 30°
    const O = k.pt(0, 0);
    const R = j => j * u;                                // r = a θ, θ = j·30°
    const arch = k.curves.archimedes(a);
    const mir = t => { const q = arch(t); return [-q[0], q[1]]; };

    k.given('The pole O and the axes. The spiral r = aθ has equal steps in the radius for equal steps in the angle: 30° of turning adds the length u = aπ/6 to the radius.', () => {
      k.arrow(k.pt(-a * PI * 1.18, 0), k.pt(a * PI * 1.62, 0), { cls: 'axis' });
      k.seg(k.pt(0, -a * PI * 1.62), k.pt(0, a * PI * 0.95), { cls: 'axis' });
      k.point(O, 'O', { at: 'sw', open: true, r: 0.8 });
    });
    k.step('dividers', 'On the initial line mark off the equal lengths u, 2u, 3u, … 9u from O: the radii that belong to the angles 30°, 60°, … 270°.', () => {
      for (let j = 1; j <= 9; j++) { k.dot(k.pt(R(j), 0), { open: true, r: 0.5 }); }
      for (let j = 1; j <= 9; j += 1) k.label(k.pt(R(j), 0), String(j), 'se', { size: 0.55, dist: 0.9, upright: true });
    });
    k.step('protractor', 'Draw the rays from O at 30°, 60°, … 270° to the initial line.', () => {
      for (let j = 1; j <= 9; j++) k.seg(O, g.polar(O, R(j) * 1.08, g.deg(30 * j)), { cls: 'cons' });
    });
    k.step('compass', 'With centre O and radius j·u (taken from the initial line with the compass) swing an arc round to the j-th ray. It cuts that ray at P_j, the point with r = aθ.', () => {
      for (let j = 1; j <= 9; j++) { const t = g.deg(30 * j); k.arc(O, R(j), t - 0.34, t + 0.1, { cls: 'cons' }); k.dot(g.polar(O, R(j), t), { r: 0.7 }); }
    });
    k.step('pencil', 'Draw the curve through the points P_j with a French curve: the branch for θ > 0. It leaves O along the initial line and crosses OY at (0, aπ/2) and (0, −3πa/2).', () => {
      k.curve(arch, [0, 1.5 * PI + 0.12], { n: 300, arrow: [2.5] });
    });
    k.step('pencil', 'The branch for θ < 0 (r = aθ with θ negative, that is r < 0) is the mirror image of the first in the axis OY. The two branches meet again at the bottom, and cross there.', () => {
      k.curve(mir, [0, 1.5 * PI + 0.12], { n: 300, arrow: [2.5], cw: true });
    });
    k.note('The book marks the points where the two branches meet the axes: (0, aπ/2) and (0, −3πa/2) on OY, and (−aπ, 0), (aπ, 0) on OX.', () => {
      k.point(k.pt(0, a * PI / 2), '', { open: true, r: 0.9 });
      k.point(k.pt(-a * PI, 0), '', { open: true, r: 0.9 });
      k.point(k.pt(a * PI, 0), '', { open: true, r: 0.9 });
      k.point(k.pt(0, -a * 1.5 * PI), '', { open: true, r: 0.9 });
    });
  }
});

/* Fig. 189, page 211 — the reciprocal (hyperbolic) spiral rθ = a. It has the horizontal asymptote y = a (the
   limit of r sin θ is a); both branches wind into the pole. For every circle about the pole the arc between the
   curve and the initial line has the length a (the arc a on the figure). Branches: θ > 0 on the right, θ < 0
   its mirror image in OY. */
Curves.figure({
  id: 'fig-189',
  section: 'spirals',
  page: 211,
  title: 'The reciprocal spiral rθ = a with its asymptote at distance a from the initial line',
  tags: ['asymptote', 'polar'],
  build(k) {
    const g = k.g;
    const a = 150;
    const hs = k.curves.hyperbolicSpiral(a);
    const mir = t => { const q = hs(t); return [-q[0], q[1]]; };
    const O = k.pt(0, 0);
    const thP = 0.8, rP = a / thP;
    const P = g.polar(O, rP, thP);
    const xr = 1.3 * a;

    k.given('The pole O, the initial line, and the asymptote: the line parallel to the initial line at the distance a (the limit of r·sin θ as θ → 0 is a).', () => {
      k.seg(k.pt(-xr, 0), k.pt(xr, 0), { cls: 'given' });
      k.arrow(k.pt(0, -a * 0.45), k.pt(0, a * 1.32), { cls: 'axis' });
      k.line(k.pt(0, a), k.pt(1, a), { cls: 'given' });
      k.point(O, 'O', { at: 'sw', open: true, r: 0.8, lo: { dist: 1.7 } });
    });
    k.step('protractor', 'Take an angle θ and draw the ray OP at that angle from the initial line.', () => {
      k.seg(O, P, { cls: 'cons' });
      k.angle(O, k.pt(60, 0), P, { label: 'θ', r: 1.2, labelDist: 1.25 });
    });
    k.step('ruler', 'On the ray lay off r = a/θ (θ in radians). Then the arc of the circle about O from the initial line to P has the length r·θ = a, the same for every point of the curve.', () => {
      k.point(P, '', { open: true, r: 0.9 });
      k.label(g.mid(O, P), 'r', 'se', { dist: 1.0 });
    });
    k.step('compass', 'Draw the circle about O through P, from the initial line to P: this arc has the length a.', () => {
      k.arc(O, rP, 0, thP, { cls: 'cons' });
      k.label(g.polar(O, rP, thP / 2), 'a', 'e', { dist: 1.2 });
    });
    k.step('pencil', 'Repeat for other angles and join the points: the branch for θ > 0 comes from the right along the asymptote, crosses OY at (0, 2a/π), passes (−a/π, 0) and winds into O.', () => {
      k.curve(hs, [0.62, 4.4 * PI], { n: 700, arrow: [0.92] });
    });
    k.step('pencil', 'The branch for θ < 0 is the mirror image in the axis OY: it comes from the left along the asymptote, crosses at the same point on OY and winds into O the other way.', () => {
      k.curve(mir, [0.62, 4.4 * PI], { n: 700, arrow: [0.97], cw: false });
    });
    k.note('The book marks the points where the branches meet the axes.', () => {
      const pts = [[0, 2 * a / PI], [-a / PI, 0], [a / PI, 0], [0, -2 * a / (3 * PI)], [0, 2 * a / (5 * PI)]];
      pts.forEach(p => k.point(k.pt(p[0], p[1]), '', { open: true, r: 0.7 }));
    });
  }
});

/* Fig. 190, page 212 — Fermat's parabolic spiral r² = a²θ, both branches (r = ±a√θ), which are images of each other
   in the pole. Points on the axes: (0, ±a√(π/2)), (∓a√π, 0) ... */
Curves.figure({
  id: 'fig-190',
  section: 'spirals',
  page: 212,
  title: "Fermat's parabolic spiral r² = a²θ, both branches through the pole",
  tags: ['polar', 'point reflection'],
  build(k) {
    const g = k.g;
    const a = 150;
    const f = k.curves.fermat(a);
    const neg = t => { const q = f(t); return [-q[0], -q[1]]; };
    const O = k.pt(0, 0);
    const N = 5, step = PI / 4;                          // five points of each branch, every 45° (the book draws the curve to θ ≈ 4.4)
    const r = j => a * Math.sqrt(j * step);

    k.given('The pole O and the axes. For the angle θ the radius is r = a√θ (r² = a²θ): the radius grows like the square root of the angle.', () => {
      k.arrow(k.pt(-a * 2.5, 0), k.pt(a * 2.9, 0), { cls: 'axis' });
      k.arrow(k.pt(0, -a * 2.4), k.pt(0, a * 2.9), { cls: 'axis' });
      k.point(O, 'O', { at: 'nw', open: true, r: 0.8 });
    });
    k.step('protractor', 'Draw the lines through O at 45° to one another. Each carries a point of the branch r > 0 on one side of O and a point of the other branch on the other side.', () => {
      for (let j = 1; j < 4; j++) k.line(O, g.polar(O, 1, step * j), { cls: 'aux' });
    });
    k.step('ruler', 'Lay off the radii r_j = a√(jπ/4) from O on the j-th line (the angle jπ/4), and the same distances on the other side of O.', () => {
      for (let j = 1; j <= N; j++) {
        const P = g.polar(O, r(j), step * j);
        k.dot(P, { r: 0.7 });
        k.dot(g.polar(O, -r(j), step * j), { r: 0.7, open: true });
      }
    });
    k.step('pencil', 'The branch r > 0: it leaves O along the initial line, crosses OY at (0, a√(π/2)), meets OX at (−a√π, 0) and goes on, winding outwards.', () => {
      k.curve(f, [0, 4.4], { n: 400, arrow: [2.4] });
    });
    k.step('pencil', 'The branch r < 0: the reflection of the first in the pole O (r = −a√θ).', () => {
      k.curve(neg, [0, 4.4], { n: 400, arrow: [2.5] });
    });
    k.note('The book marks the points where the branches meet the axes.', () => {
      const m = a * Math.sqrt(PI / 2), l = a * Math.sqrt(PI);
      [[0, m], [-l, 0], [0, -m], [l, 0]].forEach(p => k.point(k.pt(p[0], p[1]), '', { open: true, r: 0.9 }));
    });
  }
});

/* Fig. 191, page 213 — the lituus r²θ = a². The initial line is its asymptote; both branches (r = ±a/√θ) wind into
   the pole. P is a point at the polar angle θ; A is where the circle about O through P meets the initial line:
   the circular sector OPA has the constant area a²/2. */
Curves.figure({
  id: 'fig-191',
  section: 'spirals',
  page: 213,
  title: 'The lituus r²θ = a²: the asymptote is the initial line; the sector OPA has constant area',
  tags: ['asymptote', 'polar', 'area'],
  build(k) {
    const g = k.g;
    const a = 120;
    const lt = k.curves.lituus(a);
    const neg = t => { const q = lt(t); return [-q[0], -q[1]]; };
    const O = k.pt(0, 0);
    const thP = 0.58, rP = a / Math.sqrt(thP);
    const P = g.polar(O, rP, thP), A = k.pt(rP, 0);

    k.given('The pole O, the axes, and the asymptote, which is the initial line itself: as θ → 0 the curve runs out along it.', () => {
      k.arrow(k.pt(-a * 2.5, 0), k.pt(a * 2.85, 0), { cls: 'axis' });
      k.arrow(k.pt(0, -a * 1.45), k.pt(0, a * 1.65), { cls: 'axis' });
      k.point(O, 'O', { at: 'se', open: true, r: 0.8, lo: { dist: 1.7 } });
    });
    k.step('protractor', 'Take the angle θ and draw the ray OP at that angle from the initial line.', () => {
      k.seg(O, P, { cls: 'cons', dash: true });
    });
    k.step('ruler', 'On the ray lay off r = a/√θ (θ in radians) to find P.', () => {
      k.point(P, 'P', { at: 'ne', open: true, r: 0.9 });
    });
    k.step('compass', 'The circle about O through P meets the initial line at A. The sector OPA has the area r²θ/2 = a²/2, the same for every θ.', () => {
      k.arc(O, rP, 0, thP, { cls: 'cons', dash: true });
      k.point(A, 'A', { at: 'se', open: true, r: 0.9 });
    });
    k.step('pencil', 'The branch r > 0: it comes in along the initial line from the right, and winds into the pole counter-clockwise.', () => {
      k.curve(lt, [0.1, 12], { n: 800, arrow: [0.33] });
    });
    k.step('pencil', 'The branch r < 0: the reflection of the first in the pole; it comes from the left along the initial line.', () => {
      k.curve(neg, [0.1, 12], { n: 800, arrow: [0.33] });
    });
    k.note('The book marks every place where the branches meet the axes.', () => {
      for (let j = 1; j <= 7; j++) {
        const t = j * PI / 2, rr = a / Math.sqrt(t);
        k.point(g.polar(O, rr, t), '', { open: true, r: 0.6 });
        k.point(g.polar(O, -rr, t), '', { open: true, r: 0.6 });
      }
    });
  }
});

/* Fig. 185, page 208 — the photograph of two sections of a Nautilus shell. The wall of the shell is an equiangular spiral
   (each whorl a constant multiple of the one inside it); the septa that divide the chambers are equiangular spirals too,
   running from the inner whorl to the outer one. Drawn here: the wall r = a·g^{θ/2π} (g = 3 per turn) with the septa. */
Curves.figure({
  id: 'fig-185',
  section: 'spirals',
  page: 208,
  title: 'The septa of the Nautilus are equiangular spirals',
  tags: ['nature', 'nautilus', 'photograph'],
  note: 'The book prints a photograph of two halves of a Nautilus shell. This is a drawing of the section: the wall is an equiangular spiral and each septum is an equiangular spiral of a steeper angle.',
  build(k) {
    const g = k.g;
    const grow = 3.0, kk = Math.log(grow) / TAU, a0 = 5;            // the whorl grows by the factor 3 in a turn
    const wall = k.curves.equiangularSpiral(a0, kk);
    const turns = 3.3, th1 = turns * TAU;
    const O = k.pt(0, 0);
    const rw = th => a0 * Math.exp(kk * th);
    const per = 12, dth = TAU / per;                                // chambers every 30°
    const q = Math.pow(grow, 1 / per);

    k.given('The pole O of the spiral. A whorl of the shell is the same shape as the whorl inside it, only larger: every turn multiplies the radius by the same factor (here 3).', () => {
      k.point(O, '', { r: 0.8 });
      k.label(O, 'O', 'sw', { dist: 1.2 });
    });
    k.step('dividers', 'Draw the radii at equal angles of 30° to each other. With the dividers lay off on them the lengths r, qr, q²r, … in geometric progression with q = 3^{1/12}: twelve steps of 30° multiply the radius by 3.', () => {
      for (let j = 0; j < 6; j++) k.line(O, g.polar(O, 1, j * PI / 6), { cls: 'aux' });
      for (let j = 0; j <= Math.floor(turns * per); j++) k.dot(g.polar(O, a0 * Math.pow(q, j), j * dth), { r: 0.45, target: j <= 2 * per ? undefined : false });   // the practice asks for the first two turns
    });
    k.step('pencil', 'Join the points with a French curve: the wall of the shell, the equiangular spiral r = a·e^{kθ} with k = ln 3 / 2π.', () => {
      k.curve(wall, [0, th1], { n: 800 });
    });
    k.step('pencil', 'Each septum is an arc of an equiangular spiral about O, steeper than the wall: it runs from a point of the inner whorl to the point of the outer whorl that lies 100° further round. Draw one every 30°.', () => {
      const D = g.deg(100);
      for (let phi0 = TAU; phi0 + D <= th1 + 1e-6; phi0 += dth) {
        const rin = rw(phi0 - TAU), rout = rw(phi0 + D);
        const kap = Math.log(rout / rin) / D;
        k.curve(t => { const r = rin * Math.exp(kap * (t - phi0)); return [r * Math.cos(t), r * Math.sin(t)]; }, [phi0, phi0 + D], { n: 40, cls: 'given', width: 1.6, target: phi0 < TAU + 3 * dth + 1e-6 ? undefined : false });   // the practice asks for the first four septa
      }
    });
  }
});

/* Fig. 187(a), page 210 — the carpenter's square rolling without slipping on a circle of radius a about O. The long
   arm touches the circle at T and the arc A'T is unwound along it: TA = arc A'T = aθ. The short arm AB = a is
   perpendicular to the long arm, on the side of the circle. Then OB = aθ is parallel to the long arm, so B describes the
   spiral of Archimedes (in the book OB turns θ − 90° from the initial line); A describes the involute of the circle. */
Curves.figure({
  id: 'fig-187a',
  section: 'spirals',
  page: 210,
  title: "The spiral of Archimedes drawn by a carpenter's square rolling on a circle",
  tags: ['roll', 'archimedes', 'involute', 'carpenter'],
  note: 'T is the centre of rotation of the square, so TA and TB are the normals to the paths of A and B.',
  build(k) {
    const g = k.g;
    const a = 100, th = 2.38;
    const O = k.pt(0, 0), A1 = k.pt(a, 0);
    const T = g.polar(O, a, th);
    const d = k.pt(Math.sin(th), -Math.cos(th));                    // along the tangent, in the direction of unwinding
    const nout = g.unit(T);                                         // away from O
    const A = g.add(T, g.mul(d, a * th));
    const B = g.sub(A, T);                                          // A + a·(−T/a): the end of the short arm, OB = aθ
    const w = 16;                                                   // the width of the arms
    const E = g.sub(T, g.mul(d, 1.05 * a));
    const arch = k.curves.archimedes(a);
    const spiralB = t => { const q = arch(t); return [q[1], -q[0]]; };      // r = aθ turned by −90°

    k.given('The circle of radius a about O, the initial line, and the point A′ where the initial line meets the circle. At the start A is at A′ and B is at O.', () => {
      k.seg(k.pt(-1.6 * a, 0), k.pt(2.15 * a, 0), { cls: 'cons' });
      k.circle(O, a, { cls: 'given' });
      k.point(O, 'O', { at: 'sw', open: true, r: 0.9 });
      k.point(A1, "A′", { at: 'se', open: true, r: 0.9 });
    });
    k.step('protractor', 'Take the angle θ from OA′: the radius OT meets the circle at T, the point where the square now touches. The arc A′T is aθ long.', () => {
      k.seg(O, T, { cls: 'cons' });
      k.point(T, 'T', { at: 'e', open: true, r: 0.9, lo: { dist: 1.2 } });
      k.angle(O, A1, T, { label: 'θ', r: 1.0, labelDist: 1.3 });
      k.label(g.mid(O, T), 'a', 'sw', { dist: 1.1 });
    });
    k.step('square', 'The long arm of the square lies along the tangent at T: draw the perpendicular to OT at T.', () => {
      k.seg(E, g.add(A, g.mul(d, 24)), { cls: 'cons' });
    });
    k.step('dividers', 'The square rolls without slipping, so the arc A′T unwinds along the tangent: lay off TA = arc A′T = aθ from T in the direction away from A′. A is a point of the involute of the circle.', () => {
      k.point(A, 'A', { at: 'nw', open: true, r: 0.9, lo: { dist: 1.4 } });
    });
    k.step('square', 'At A draw the perpendicular to the tangent, toward the circle, and lay off AB = a. Then OB is parallel to TA and OB = TA = aθ = r: B is a point of the spiral of Archimedes.', () => {
      k.seg(A, B, { cls: 'cons' });
      k.right(A, T, B, { r: 0.8 });
      k.seg(O, B, { cls: 'cons', dash: true });
      k.point(B, 'B', { at: 'e', open: true, r: 0.9 });
      k.label(g.mid(O, B), 'r', 'nw', { dist: 1.0 });
    });
    k.note('The square itself: a long arm and a short arm AB = a, shown hatched. T is the centre of rotation of the rolling square, so TA and TB are the normals to the paths of A and B.', () => {
      const L1 = [E, g.add(A, g.mul(d, w)), g.add(g.add(A, g.mul(d, w)), g.mul(nout, w)), g.add(E, g.mul(nout, w))];
      k.hatch(L1, { angle: 1.05, gap: 0.7, outline: true });
      const L2 = [A, B, g.add(B, g.mul(d, w)), g.add(A, g.mul(d, w))];
      k.hatch(L2, { angle: 1.05, gap: 0.7, outline: true });
      k.label(g.add(g.mid(T, A), g.mul(nout, w + 10)), 'aθ', 'c', { size: 0.9 });
    });
    k.step('pencil', 'The curve described by B as the square rolls on: the spiral r = aθ (the pole at O, the initial line turned by 90° from the starting direction of B).', () => {
      k.curve(spiralB, [0, th + 0.25], { n: 300 });
    });
  }
});

/* Fig. 187(b), page 210 — the heart cam: the profile is the spiral of Archimedes (r changes by equal amounts for equal
   angles, over half a turn, and the other half is its mirror image), so the follower rises and falls with uniform
   velocity as the cam turns at constant angular velocity. The cam is a groove cam: the roller P of the follower runs in the
   groove; the follower is a rod in a fixed guide, with a spring. θ is the angle of turning from the vertical. */
Curves.figure({
  id: 'fig-187b',
  section: 'spirals',
  page: 210,
  title: 'A heart-shaped cam with the spiral of Archimedes as profile, and its follower',
  tags: ['cam', 'archimedes', 'mechanism'],
  note: 'The profile of the heart is r = R1 − bψ on each half (ψ measured from the axis of symmetry), two arcs of the spiral of Archimedes.',
  build(k) {
    const g = k.g;
    const R1 = 175, r0 = 14, b = (R1 - r0) / PI;
    const psiAxis = g.deg(-34);                                      // the axis of symmetry (the tip of the heart)
    const O = k.pt(0, 0);
    const eps = 0.12, sm = u => Math.hypot(u, eps) - eps;                // |u|, with the tip of the heart very slightly rounded
    const prof = u => { const r = R1 - b * sm(u); const t = psiAxis + u; return [r * Math.cos(t), r * Math.sin(t)]; };
    const rF = R1 - b * sm(g.deg(90) - psiAxis);                        // the roller sits on the vertical through O
    const Pc = k.pt(0, rF);
    const off = (u, h) => {                                          // the profile moved by h along the normal (outward for h > 0)
      const e = 1e-4, p0 = prof(u - e), p1 = prof(u + e), p = prof(u);
      const tx = p1[0] - p0[0], ty = p1[1] - p0[1], l = Math.hypot(tx, ty) || 1;
      return [p[0] + h * ty / l, p[1] - h * tx / l];
    };

    k.given('The pole O, where the cam is pivoted, and the line of the follower through O. The cam turns about O at constant angular velocity.', () => {
      k.seg(k.pt(0, -0.2 * R1), k.pt(0, 1.5 * R1), { cls: 'aux', dash: true });
      k.point(O, 'O', { at: 's', r: 1.1, lo: { dist: 1.5 } });
      k.poly([k.pt(-14, -14), k.pt(14, -14), k.pt(14, 14), k.pt(-14, 14)], { close: true, cls: 'aux', dash: true });
    });
    k.step('protractor', 'From the axis of the heart (the direction of its tip, at the angle θ = 124° from the follower line) draw the radii at 30° to one another on both sides, over a half turn each.', () => {
      for (let j = 0; j <= 6; j++) {
        k.seg(O, g.polar(O, R1 * 1.04, psiAxis + j * PI / 6), { cls: 'cons' });
        if (j > 0 && j < 6) k.seg(O, g.polar(O, R1 * 1.04, psiAxis - j * PI / 6), { cls: 'cons' });
      }
    });
    k.step('dividers', 'On the j-th radius on either side lay off r = R1 − j·Δ, where Δ is the same step each time: the radius falls by equal amounts for equal angles, from R1 at the axis to r0 at the opposite direction.', () => {
      for (let j = 0; j <= 6; j++) {
        const u = j * PI / 6;
        k.dot(g.polar(O, R1 - b * u, psiAxis + u), { r: 0.7 });
        if (j > 0 && j < 6) k.dot(g.polar(O, R1 - b * u, psiAxis - u), { r: 0.7 });
      }
    });
    k.step('pencil', 'Draw the spiral of Archimedes through the points on each side: together they make the heart. This is the path of the roller centre, the pitch curve of the cam.', () => {
      k.curve(prof, [-PI, PI], { n: 300 });
    });
    k.note('The mechanism of the book: the groove is the double outline round the pitch curve; the roller P of the follower runs in it. The follower is a rod guided by a fixed block (hatched) and pressed on the cam by a spring. As the cam turns by the angle θ the roller moves up and down with uniform velocity.', () => {
      const edge = h => k.curve(u => off(u, h), [-PI + 0.45, PI - 0.45], { n: 320, cls: 'given', width: 2.8 });
      edge(9); edge(-9);
      k.circle(Pc, 12, { cls: 'given' });
      k.dot(Pc, { r: 0.7 });
      k.label(Pc, 'P', 'w', { dist: 1.9 });
      const top = rF + 96;
      k.seg(k.pt(0, rF + 12), k.pt(0, rF + 50), { cls: 'thick' });
      const zig = [k.pt(0, rF + 50)];
      for (let i = 0; i < 6; i++) zig.push(k.pt(i % 2 ? -6 : 6, rF + 56 + i * 4));
      zig.push(k.pt(0, rF + 82));
      k.poly(zig, { cls: 'given', width: 2.0 });
      k.seg(k.pt(0, rF + 82), k.pt(0, top + 10), { cls: 'thick' });
      k.hatch([k.pt(-52, top - 16), k.pt(52, top - 16), k.pt(52, top + 18), k.pt(-52, top + 18)], { angle: 0.8, gap: 0.7, outline: true });
      k.angle(O, g.polar(O, 1, psiAxis), k.pt(0, 1), { label: 'θ', r: 2.4, labelDist: 1.2, arrow: true });
      k.seg(O, g.polar(O, 0.95 * R1, psiAxis), { cls: 'cons' });
    });
  }
});

/* Fig. 193, page 215 — Euler's spiral (clothoid, Cornu's spiral): the radius of curvature R is inversely proportional to the
   arc length s from O (R·s = a²). It passes through O along the x-axis and winds round the two asymptotic points
   ±(x0, y0). */
Curves.figure({
  id: 'fig-193',
  section: 'spirals',
  page: 215,
  title: "Euler's spiral (the clothoid) with its two asymptotic points",
  tags: ['clothoid', 'cornu', 'asymptotic point'],
  note: 'Here R·s = a² and the asymptotic point is at x0 = y0 = a√π/2. (The book prints a√π/√8, which fits R·s = a²/2.)',
  build(k) {
    const a = 230;
    const eu = k.curves.euler(a, 600);
    const x0 = a * Math.sqrt(PI) / 2;
    const S = a * Math.sqrt(2 * 25);                                // four turns round each asymptotic point
    const O = k.pt(0, 0);
    k.given('The axes and the origin O. The spiral passes through O and the x-axis is its tangent there.', () => {
      k.seg(k.pt(-1.4 * x0, 0), k.pt(1.65 * x0, 0), { cls: 'axis' });
      k.seg(k.pt(0, -0.75 * x0), k.pt(0, 0.7 * x0), { cls: 'axis' });
      k.label(O, 'O', 'ne', { dist: 0.9 });
    });
    k.step('pencil', "Euler's spiral: from O the curvature grows in proportion to the arc length s (R·s = a²), so the curve bends more and more, and winds round the point (x0, y0) in the upper right and round (−x0, −y0) in the lower left.", () => {
      k.curve(eu, [-S, S], { n: 2400, cls: 'curve', width: 2.4 });
    });
    k.note('The centres of the two spirals are the asymptotic points (x0, y0) and (−x0, −y0), x0 = y0 = a√π/2: the curve never reaches them but winds in towards them.', () => {
      k.seg(k.pt(x0, 0), k.pt(x0, x0), { cls: 'cons', dash: true });
      k.dot(k.pt(x0, x0), { r: 0.5 });
      k.text(x0 * 0.55, -x0 * 0.1, 'x_0', { size: 0.8 });
      k.text(x0 * 1.1, x0 * 0.5, 'y_0', { size: 0.8 });
    });
  }
});

/* Fig. 194, page 215 — the page prints the Cotes spiral r·sin 4θ = a (eight branches, asymptotes at distance a/4 from the
   lines through O at 0°, 45°, 90°, 135°) together with its inverse in the circle of radius a: the rose r = a sin 4θ (eight
   petals). The eight points numbered 1–8 are the tips of the petals, on the circle, where the curve meets its inverse. */
Curves.figure({
  id: 'fig-194',
  section: 'spirals',
  page: 215,
  title: 'The Cotes spiral r·sin 4θ = a and its inverse, the eight-petalled rose',
  tags: ['cotes', 'inverse', 'rose', 'asymptote'],
  note: 'The text (p. 216) says: the figure is that of the spiral r·sin 4θ = a and its inverse, the rose.',
  build(k) {
    const g = k.g;
    const a = 185;
    const O = k.pt(0, 0);
    const rose = t => [a * Math.sin(4 * t) * Math.cos(t), a * Math.sin(4 * t) * Math.sin(t)];
    const tip = j => { const th = (2 * j - 1) * PI / 8; return g.polar(O, (j % 2 ? 1 : -1) * a, th); };   // j = 1..8: where r = ±a
    const cap = 2.05 * a;

    k.given('The pole O, the axes, and the circle of radius a: the circle of inversion. The curve and its inverse in this circle meet on it.', () => {
      k.seg(k.pt(-a * 1.05, 0), k.pt(a * 1.05, 0), { cls: 'aux' });
      k.seg(k.pt(0, -a * 1.05), k.pt(0, a * 1.05), { cls: 'aux' });
      k.line(O, g.polar(O, 1, PI / 4), { cls: 'aux' });
      k.line(O, g.polar(O, 1, 3 * PI / 4), { cls: 'aux' });
      k.circle(O, a, { cls: 'cons' });
      k.label(k.pt(a, 0), 'x', 'ne', { size: 0.65, dist: 0.7 });
      k.point(O, '', { r: 0.7 });
    });
    k.step('protractor', 'The axes of the eight petals of the rose r = a sin 4θ are the radii at 22.5° + k·45°: draw them from O to the circle.', () => {
      for (let j = 0; j < 8; j++) k.seg(O, g.polar(O, a, g.deg(22.5 + 45 * j)), { cls: 'aux' });
    });
    k.step('compass', 'On each petal axis the petal reaches the circle (r = ±a): the eight tips 1–8, met in the order of increasing θ.', () => {
      for (let j = 1; j <= 8; j++) {
        const P = tip(j), ang = Math.atan2(P.y, P.x);
        const at = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'][((Math.round(ang / (PI / 4)) % 8) + 8) % 8];
        k.dot(P, { r: 0.55 });
        k.label(P, String(j), at, { size: 0.6, dist: 0.8, upright: false });
      }
    });
    k.step('pencil', 'The rose r = a sin 4θ: eight petals, every one starting and ending at O and reaching the circle at its tip.', () => {
      k.curve(rose, [0, TAU], { n: 720 });
    });
    k.step('straightedge', 'The asymptotes of the spiral: lines parallel to the four lines 0°, 45°, 90°, 135° through O, at the distance a/4 on each side (r sin(4θ) = a: near θ = 0 the height r·sin θ tends to a/4).', () => {
      for (let j = 0; j < 4; j++) {
        const d = g.dir(j * PI / 4), n = g.perp(d);
        [1, -1].forEach(s => { const P = g.add(O, g.mul(n, s * a / 4)); k.line(P, g.add(P, d), { cls: 'cons', dash: true }); });
      }
    });
    k.step('pencil', 'The spiral r = a / sin 4θ: eight branches. Each lies between two neighbouring directions kπ/4 and (k+1)π/4, comes in along an asymptote, passes through a numbered point on the circle (r = ±a) and leaves along the next asymptote. It is the inverse of the rose.', () => {
      for (let j = 0; j < 8; j++) {
        const d0 = 0.1275, th0 = j * PI / 4 + d0, th1 = (j + 1) * PI / 4 - d0;
        k.curve(t => { const r = a / Math.sin(4 * t); return Math.abs(r) > cap ? null : [r * Math.cos(t), r * Math.sin(t)]; }, [th0, th1], { n: 160 });
      }
    });
  }
});

/* Fig. 184, page 207 — the loxodrome on the sphere and its stereographic projection from the south pole S onto the
   equatorial plane. A loxodrome cuts all meridians at one angle; its image is an equiangular spiral about the centre of the plane
   (x = k tan(φ/2) cos θ, y = k tan(φ/2) sin θ, φ the colatitude, θ the longitude). The book's drawing is an oblique view of the
   sphere with its meridians, the plane through the equator, the loxodrome with arrows, the projecting lines from S, and the
   spiral in the plane. Drawn here as a true orthographic view from a little above the equator. */
Curves.figure({
  id: 'fig-184',
  section: 'spirals',
  page: 207,
  title: 'The loxodrome on the sphere and its stereographic image, an equiangular spiral',
  tags: ['3d', 'sphere', 'stereographic projection', 'loxodrome'],
  note: 'A sketch in orthographic projection, seen from 17° above the equator. The south pole S, the centre of projection, is the double circle at the bottom.',
  build(k) {
    const g = k.g;
    const R = 150, e = g.deg(17), se = Math.sin(e), ce = Math.cos(e);
    const c = 0.2;                                                    // the spiral: u = tan(φ/2) = e^{−cθ}
    const proj = (x, y, z) => [x, z * ce + y * se];                   // y runs into the picture, z up
    const front = (x, y, z) => (-y * ce + z * se) > -1e-9;            // on the side of the sphere facing the viewer
    const plane = [[-1.42 * R, -1.45 * R], [0.87 * R, -1.45 * R], [1.33 * R, 1.45 * R], [-0.9 * R, 1.45 * R]];
    const planeS = plane.map(p => proj(p[0], p[1], 0));
    const inPlane = (X, Y) => {                                       // is the screen point inside the drawn plane?
      let ins = false;
      for (let i = 0, j = planeS.length - 1; i < planeS.length; j = i++) {
        const a = planeS[i], b = planeS[j];
        if (((a[1] > Y) !== (b[1] > Y)) && (X < (b[0] - a[0]) * (Y - a[1]) / (b[1] - a[1]) + a[0])) ins = !ins;
      }
      return ins;
    };
    const sph = (th) => {                                             // the loxodrome point of longitude th on the sphere
      const u = Math.exp(-c * th), d = 1 + u * u;
      const rh = R * 2 * u / d, z = R * (1 - u * u) / d;
      return [rh * Math.cos(th), rh * Math.sin(th), z];
    };
    const planeP = th => { const u = Math.exp(-c * th); return [R * u * Math.cos(th), R * u * Math.sin(th), 0]; };
    const S = [0, 0, -R], N = [0, 0, R];
    const thEnd = 17;

    k.given('The sphere with its meridians, the north pole N at the top and the south pole S at the bottom (the double circle: the centre of projection), and the plane through the equator.', () => {
      // the silhouette: the part of the lower circle behind the plane is hidden
      k.curve(t => { const X = R * Math.cos(t), Y = R * Math.sin(t); return (Y < 0 && inPlane(X, Y)) ? null : [X, Y]; }, [0, TAU], { n: 360, cls: 'given', width: 1.6 });
      // the meridians, every 30°: only the parts facing the viewer; the lower ones only below the plane
      for (let j = 0; j < 12; j++) {
        const lam = j * PI / 6;
        k.curve(t => {
          const x = R * Math.sin(t) * Math.cos(lam), y = R * Math.sin(t) * Math.sin(lam), z = R * Math.cos(t);
          if (!front(x, y, z)) return null;
          const p = proj(x, y, z);
          if (z < 0 && inPlane(p[0], p[1])) return null;
          return p;
        }, [0, PI], { n: 180, cls: 'cons', width: 1.2 });
      }
      // the equator: its front half
      k.curve(t => proj(R * Math.cos(t), R * Math.sin(t), 0), [PI, TAU], { n: 120, cls: 'given', width: 1.6 });
      // the equatorial plane
      k.poly(planeS.map(p => k.pt(p[0], p[1])), { close: true, cls: 'given', width: 2.4 });
      const pN = proj(N[0], N[1], N[2]), pS = proj(S[0], S[1], S[2]);
      k.point(k.pt(pN[0], pN[1]), 'N', { open: true, r: 1.0, at: 'ne' });
      k.pivot(k.pt(pS[0], pS[1]));
      k.label(k.pt(pS[0], pS[1]), 'S', 'se', { dist: 1.5 });
      k.point(k.pt(0, 0), 'O', { open: true, r: 0.8, at: 'sw', lo: { dist: 1.0 } });
    });
    k.step('pencil', 'The loxodrome: the curve that cuts every meridian at the same angle (the course of a ship holding a fixed compass heading). From the equator it winds round the sphere, climbing toward the pole N, which it approaches but never reaches.', () => {
      k.curve(th => { const q = sph(th); if (!front(q[0], q[1], q[2])) return null; return proj(q[0], q[1], q[2]); }, [0, thEnd], { n: 900, cls: 'given', width: 3.4, arrow: [4.3, 6.0] });
    });
    k.step('straightedge', 'The stereographic projection from S: the straight line from S through a point Q of the loxodrome meets the plane of the equator at the point q. Do this for several points.', () => {
      [3.9, 4.9, 5.6].forEach(th => {
        const Q = sph(th), q = planeP(th);
        const pQ = proj(Q[0], Q[1], Q[2]), pq = proj(q[0], q[1], q[2]), pS = proj(S[0], S[1], S[2]);
        k.seg(k.pt(pS[0], pS[1]), k.pt(pQ[0], pQ[1]), { cls: 'cons', width: 1.3 });
        k.dot(k.pt(pq[0], pq[1]), { open: true, r: 0.9 });
        k.dot(k.pt(pQ[0], pQ[1]), { open: true, r: 0.9 });
        if (th === 4.9) { k.label(k.pt(pq[0], pq[1]), 'q', 's', { dist: 1.1 }); k.label(k.pt(pQ[0], pQ[1]), 'Q', 'ne', { dist: 1.1 }); }
      });
    });
    k.step('pencil', 'The images q fill the equiangular spiral about the centre of the plane: the stereographic image of a loxodrome. Where the loxodrome meets the equator, its image meets the equator circle of the plane.', () => {
      k.curve(th => { const q = planeP(th); return proj(q[0], q[1], q[2]); }, [0, thEnd], { n: 900, cls: 'curve' });
    });
  }
});

/* Fig. 188, page 211 — a conical helix in three views. Right circular cone, apex O′. The helix rises from A′ to the apex in one turn
   with equal rise for equal turning. Elevation: the triangle O′A′G′ and the helix (full line on the front, dashed behind);
   plan: the base circle with the points A…L and the plan of the helix, a spiral of Archimedes; development: the sector of the
   unrolled cone with the developed helix. */
Curves.figure({
  id: 'fig-188',
  section: 'spirals',
  page: 211,
  title: 'The orthographic projection of a conical helix is a spiral of Archimedes; the development of the cone',
  tags: ['3d', 'conical helix', 'development', 'descriptive geometry'],
  note: 'The book states that the development of this helix is an equiangular spiral. For the uniform helix drawn here (equal rise for equal turning) the development comes out as an Archimedean spiral as well; the equiangular spiral is the development of the helix that cuts all generators at a constant angle. The drawing follows the geometry.',
  build(k) {
    const g = k.g;
    const Rb = 145, H = 552, L = Math.hypot(Rb, H), nn = 12;
    const apex = k.pt(0, H);
    const yp = -(Rb + 95);                                             // the centre of the plan circle
    const Op = k.pt(0, yp);
    const dAng = TAU * Rb / L / nn;                                     // the sector angle per division
    const a0 = Math.atan2(-H, -Rb);                                     // direction apex → A′ (down-left)
    const planPt = (t, kk) => { const rr = Rb * (1 - t / nn), an = PI + t * PI / 6; return k.pt(rr * Math.cos(an), yp + rr * Math.sin(an)); };
    const elevPt = t => { const rr = Rb * (1 - t / nn), an = PI + t * PI / 6; return [rr * Math.cos(an), H * t / nn]; };
    const devPt = t => { const s = L * (1 - t / nn), an = a0 - t * dAng; return [apex.x + s * Math.cos(an), apex.y + s * Math.sin(an)]; };
    const letters = 'ABCDEFGHIJKL';
    const lower = 'bcdefghij';
    k.frame(-650, yp - Rb - 115, 450, apex.y + L * Math.sin(a0 - 12 * dAng) + 60);

    k.given('The cone: its axis is vertical. In elevation it is the triangle O′A′G′; in plan its base is the circle about O. The helix leaves A′ and rises to the apex O′ in one turn, turning by equal angles for equal rise.', () => {
      k.seg(k.pt(-Rb, 0), apex, { cls: 'given' });
      k.seg(k.pt(Rb, 0), apex, { cls: 'given' });
      k.seg(k.pt(-Rb * 1.12, 0), k.pt(Rb * 1.12, 0), { cls: 'given' });
      k.circle(Op, Rb, { cls: 'given' });
      k.point(apex, "O′", { at: 'ne', open: true, r: 0.8 });
      k.point(Op, 'O', { at: 'ne', open: true, r: 0.7, lo: { dist: 0.8 } });
      k.label(k.pt(-Rb, 0), "A′", 'se', { size: 0.8, dist: 1.4 });
      k.label(k.pt(Rb, 0), "G′", 'se', { size: 0.8 });
    });
    k.step('protractor', 'Divide the base circle of the plan into 12 equal parts of 30°: A, B, C, … L. Draw the radii OA, OB, … and carry the points up to the base line of the elevation with the vertical projectors: A′, B′, … G′ (the points of the front half).', () => {
      for (let j = 0; j < nn; j++) {
        const an = PI + j * PI / 6, P = g.polar(Op, Rb, an);
        k.seg(Op, P, { cls: 'cons' });
        k.dot(P, { r: 0.55 });
        const dirAt = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'][((Math.round(an / (PI / 4)) % 8) + 8) % 8];
        k.label(P, letters[j], dirAt, { size: 0.7, dist: 0.9, upright: true });
        if (j <= 6) {
          const Bp = k.pt(P.x, 0);
          k.seg(P, Bp, { cls: 'aux', dash: true });
          if (j > 0 && j < 6) { k.dot(Bp, { r: 0.55 }); k.label(Bp, letters[j] + '′', 'nw', { size: 0.65, dist: 0.8 }); }
        }
      }
    });
    k.step('straightedge', 'Join the points B′ … F′ of the base line to the apex O′: the generators of the cone in elevation.', () => {
      for (let j = 1; j <= 5; j++) k.seg(k.pt(Rb * Math.cos(PI + j * PI / 6), 0), apex, { cls: 'cons' });
    });
    k.step('dividers', 'The helix rises by equal steps as it turns: on the j-th generator it stands j/12 of the height above the base, and in plan it stands j/12 of the way in from the base circle along the radius. Mark these points in plan and in elevation.', () => {
      for (let j = 1; j <= 9; j++) {
        const P = planPt(j), E = elevPt(j);
        k.dot(P, { r: 0.55 });
        k.label(P, lower[j - 1], 'ne', { size: 0.6, dist: 0.7 });
        if (j <= 6) { k.dot(k.pt(E[0], E[1]), { r: 0.55 }); k.label(k.pt(E[0], E[1]), lower[j - 1], 'nw', { size: 0.6, dist: 0.7 }); }
      }
    });
    k.step('pencil', 'The plan of the helix: draw a smooth curve through the points of the plan. The radius falls by equal amounts for equal angles: this is the spiral of Archimedes, from A to the centre O in one turn.', () => {
      k.curve(t => { const p = planPt(t); return [p.x, p.y]; }, [0, nn], { n: 240 });
      k.text(0, yp - Rb - 66, 'Archimedean Spiral as Plan', { size: 0.72, upright: true });
      k.text(0, yp - Rb - 96, 'of Conical Helix', { size: 0.72, upright: true });
    });
    k.step('pencil', 'The elevation of the helix: through the points of the elevation. The front half, from A′ up to the right, is drawn full; the half behind the cone is dashed.', () => {
      k.curve(t => elevPt(t), [0, 6], { n: 160 });
      k.curve(t => elevPt(t), [6, nn], { n: 160, dash: true });
      k.text(Rb * 1.25, H * 0.28, 'Elevation of', { size: 0.72, upright: true, anchor: 'start' });
      k.text(Rb * 1.25, H * 0.28 - 30, 'Conical Helix', { size: 0.72, upright: true, anchor: 'start' });
    });
    k.step('compass', 'The development of the cone: with centre O′ and the slant height O′A′ as radius draw an arc. The base circle unrolls into it, so the sector has the angle 360°·R/O′A′ (about 91°). Divide the arc into the same 12 equal parts A, B, … L, A′ and join them to O′.', () => {
      k.arc(apex, L, a0 - 12 * dAng, a0, { cls: 'given', dash: true });
      for (let j = 0; j <= nn; j++) {
        const an = a0 - j * dAng, P = g.polar(apex, L, an);
        k.seg(apex, P, { cls: 'aux', dotted: true });
        k.dot(P, { r: 0.45 });
        const dirAt = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'][((Math.round(an / (PI / 4)) % 8) + 8) % 8];
        k.label(P, j === nn ? "A′" : letters[j], dirAt, { size: 0.7, dist: 0.9, upright: true });
      }
    });
    k.step('compass', 'The parallels of the cone, where the helix has risen by j/12 of the height, develop into arcs about O′ of radius (1 − j/12)·O′A′: draw them dashed.', () => {
      for (let j = 1; j < nn; j++) k.arc(apex, L * (1 - j / nn), a0 - nn * dAng, a0, { cls: 'aux', dash: true });
    });
    k.step('pencil', 'The development of the helix: on the j-th generator mark the point on the j-th parallel and join the points. For the uniform helix drawn here the radius falls by equal steps for equal angles in the development too.', () => {
      k.curve(t => devPt(t), [0, nn], { n: 200 });
      k.text(-560, -20, 'Development of', { size: 0.72, upright: true, anchor: 'start' });
      k.text(-560, -50, 'Conical Helix', { size: 0.72, upright: true, anchor: 'start' });
    });
  }
});

/* Fig. 192, page 213 — the Ionic capital. The book prints an engraving of the capital; the volute is the lituus, which begins on the
   eye circle drawn about the pole. Here: the two volutes as lituus spirals r²θ = a² winding into their eyes, and a few lines
   to suggest the capital (abacus, canalis between the volutes, egg-and-dart, shaft). */
Curves.figure({
  id: 'fig-192',
  section: 'spirals',
  page: 213,
  title: 'The Ionic volute: the lituus winding into the eye circle',
  tags: ['architecture', 'volute', 'lituus'],
  note: 'The book prints an engraving of an Ionic capital. The drawing here keeps the volutes (a lituus about each eye) and suggests the rest of the capital with a few lines.',
  build(k) {
    const g = k.g;
    const D = 215, R1 = 105, re = 26, ts = 1.5;
    const CL = k.pt(-D, 0), CR = k.pt(D, 0);
    const dphi = ts * ((R1 / re) * (R1 / re) - 1);                    // r = R1·√(ts/(ts + φ')), r = re when φ' = ts·((R1/re)² − 1)
    // left volute: counter-clockwise from the top; right volute: clockwise from the top (the mirror image)
    const vL = t => { const r = R1 * Math.sqrt(ts / (ts + t)), an = PI / 2 + t; return [CL.x + r * Math.cos(an), r * Math.sin(an)]; };
    const vR = t => { const r = R1 * Math.sqrt(ts / (ts + t)), an = PI / 2 - t; return [CR.x + r * Math.cos(an), r * Math.sin(an)]; };

    k.given('The pole of each volute: the eye, a small circle. The two eyes are on a horizontal line and the two volutes are mirror images of each other.', () => {
      k.circle(CL, re, { cls: 'given' });
      k.circle(CR, re, { cls: 'given' });
      k.dot(CL, { r: 0.6 }); k.dot(CR, { r: 0.6 });
      k.label(CL, 'O_1', 's', { dist: 2.2 }); k.label(CR, 'O_2', 's', { dist: 2.2 });
      k.seg(k.pt(-D - R1 * 1.25, 0), k.pt(D + R1 * 1.25, 0), { cls: 'aux', dash: true });
    });
    k.step('pencil', 'The left volute is the lituus r²θ = a², which comes out of the eye circle: starting at the top of the volute, at the distance R1 from the pole, it winds counter-clockwise into the eye, the whorls closing in as the radius shrinks like 1/√θ.', () => {
      k.curve(vL, [0, dphi], { n: 900, cls: 'curve', width: 2.6 });
      k.dot(k.pt(CL.x, R1), { open: true, r: 0.8 });
    });
    k.step('pencil', 'The right volute is its mirror image, winding clockwise.', () => {
      k.curve(vR, [0, dphi], { n: 900, cls: 'curve', width: 2.6 });
      k.dot(k.pt(CR.x, R1), { open: true, r: 0.8 });
    });
    k.note('A suggestion of the capital: the abacus, the channel (canalis) joining the two volutes and sagging between them, a row of eggs below it, and the fluted shaft.', () => {
      const x1 = D + R1 * 1.1;
      // the abacus
      k.poly([k.pt(-x1 - 12, R1 + 82), k.pt(x1 + 12, R1 + 82), k.pt(x1, R1 + 40), k.pt(-x1, R1 + 40)], { close: true, cls: 'given' });
      // the top of the cushion, under the abacus, and the rounded outer ends
      k.seg(k.pt(-D, R1 + 22), k.pt(D, R1 + 22), { cls: 'given' });
      k.arc(CL, R1 + 22, PI / 2, 3 * PI / 2, { cls: 'given' });
      k.arc(CR, R1 + 22, -PI / 2, PI / 2, { cls: 'given' });
      // the canalis: sagging between the tops of the volutes
      k.curve(x => [x, R1 - 0.6 * R1 * (1 - (x / D) * (x / D))], [-D, D], { n: 80, cls: 'given', width: 2.4 });
      // the eggs
      for (let i = -2; i <= 2; i++) k.ellipse(k.pt(i * 46, -8), 17, 24, { cls: 'given', width: 1.6 });
      k.seg(k.pt(-D * 0.55, -52), k.pt(D * 0.55, -52), { cls: 'given' });
      // the shaft, with seven flutes
      const x0 = D * 0.5;
      k.seg(k.pt(-x0, -52), k.pt(-x0, -R1 * 3.1), { cls: 'given' });
      k.seg(k.pt(x0, -52), k.pt(x0, -R1 * 3.1), { cls: 'given' });
      for (let i = -3; i <= 3; i++) {
        const x = i * x0 / 3.5;
        k.seg(k.pt(x - 5, -62), k.pt(x - 5, -R1 * 3.1), { cls: 'cons' });
        k.seg(k.pt(x + 5, -62), k.pt(x + 5, -R1 * 3.1), { cls: 'cons' });
      }
    });
  }
});

})();
