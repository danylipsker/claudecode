/* Curves Workshop · figures/pedal-curves.js — Figs. 151–153 (pages 160–162) */
(function () {
  'use strict';

  /* The given curve of these figures is an arc of a circle (centre Cc, radius rho); the foot of the
     perpendicular from the pedal point P on the tangent at the point of angle φ is the pedal. */
  function circleCurve(g, Cc, rho, P) {
    const X = phi => g.polar(Cc, rho, phi);
    const tan = phi => g.pt(-Math.sin(phi), Math.cos(phi));
    const foot = phi => { const x = X(phi); return g.foot(P, x, g.add(x, tan(phi))); };
    return {
      X, tan, foot,
      curve: phi => { const p = X(phi); return [p.x, p.y]; },
      pedal: phi => { const p = foot(phi); return [p.x, p.y]; }
    };
  }

  /* Fig. 151(a), page 160 — the first positive pedal. The foot C1 of the perpendicular from the pedal point P
     on the tangent at a point of C describes the pedal curve. (Geometry read from the page; the given curve is
     drawn as an exact circular arc.) */
  Curves.figure({
    id: 'fig-151a',
    section: 'pedal-curves',
    page: 160,
    title: 'The first positive pedal of a curve',
    tags: ['pedal', 'construction', 'tangent'],
    note: 'The page shows one tangent and its foot; the pedal C1 is the locus of all such feet. Here C is a circular arc, so C1 is a piece of a limacon.',
    build(k) {
      const g = k.g;
      const P = k.pt(498, -745), X0 = k.pt(437, -92);
      const d = g.unit(k.pt(683, -454)), rho = 300;
      const Cc = g.add(X0, g.mul(g.perp(d), -rho));
      const c = circleCurve(g, Cc, rho, P);
      const phi0 = g.angleOf(g.sub(X0, Cc));
      const F = g.foot(P, X0, g.add(X0, d));

      k.given('The given curve C and the pedal point P.', () => {
        k.curve(c.curve, [0.344, 1.82], { cls: 'thick', n: 80 });
        k.pivot(P);
        k.label(P, 'P', 'nw', { dist: 2.2 });
        k.text(375, -225, 'C', { upright: true, size: 1.1 });
        k.arrow(k.pt(415, -230), k.pt(520, -242), { headSize: 0.8 });
      });
      k.step('straightedge', 'Draw the tangent to C at a point X of the curve (the open dot).', () => {
        k.dot(X0, { open: true });
        k.seg(g.add(X0, g.mul(d, -124)), g.add(X0, g.mul(d, 706)), { cls: 'given' });
      });
      k.step('square', 'From P drop the perpendicular on the tangent. Its foot is a point of the first positive pedal.', () => {
        k.seg(P, F, { cls: 'given' });
        k.dot(F, { open: true });
      });
      k.step('pencil', 'Repeat for other points of C: the locus of the feet is the first positive pedal C1 of C with respect to P. (C is the first negative pedal of C1.)', () => {
        k.curve(c.pedal, [phi0 - 0.29, phi0 + 0.3], { n: 60 });
        k.text(880, -150, 'C_1', { upright: true, size: 1.1 });
        k.arrow(k.pt(835, -172), k.pt(738, -170), { headSize: 0.8 });
      });
    }
  });

  /* Fig. 151(b), page 160 — the pedal of a curve and the circle on the radius vector r = PX as diameter.
     The angle ψ between r and the tangent at X equals the angle between p and the tangent to the pedal at
     the foot F; so the tangent to the pedal at F touches the circle on PX as diameter. */
  Curves.figure({
    id: 'fig-151b',
    section: 'pedal-curves',
    page: 160,
    title: 'The tangent to the pedal: the circle on r as diameter',
    tags: ['pedal', 'tangent', 'construction'],
    note: 'The book draws the given curve and the pedal freehand. Here the given curve is an exact circular arc; the tangent to the pedal is exact.',
    build(k) {
      const g = k.g;
      const P = k.pt(0, 0), X = k.pt(307, 498), F0 = k.pt(442, 308);
      const d = g.unit(g.sub(F0, X)), rho = 300;
      const Cc = g.add(X, g.mul(g.perp(d), rho));
      const c = circleCurve(g, Cc, rho, P);
      const phi0 = g.angleOf(g.sub(X, Cc));
      const F = g.foot(P, X, g.add(X, d));
      const M = g.mid(P, X);
      let u = g.unit(g.perp(g.sub(F, M))); if (u.y > 0) u = g.mul(u, -1);       // the tangent to the pedal at F, pointing down
      const Fdown = g.add(F, g.mul(u, 150));

      k.given('The pedal point P with the initial line and its perpendicular, and the given curve through a point X; r is the radius vector PX.', () => {
        k.seg(k.pt(-193, 0), k.pt(722, 0), { cls: 'given' });
        k.seg(k.pt(0, 0), k.pt(0, 523), { cls: 'given' });
        k.curve(c.curve, [phi0 - 0.1, phi0 + 0.72], { cls: 'thick', n: 60 });
        k.pivot(P);
        k.label(P, 'P', 'sw', { dist: 2.4 });
        k.seg(P, X, { cls: 'given' });
        k.dot(X, { open: true });
      });
      k.step('straightedge', 'Draw the tangent to the curve at X.', () => {
        k.seg(X, F, { cls: 'given' });
      });
      k.step('square', 'From P drop the perpendicular p on the tangent: its foot F is a point of the pedal.', () => {
        k.seg(P, F, { cls: 'given' });
        k.dot(F, { open: true });
        k.label(g.mid(P, F), 'p', 'se', { dist: 0.9, upright: false });
      });
      k.step('compass', 'The circle on r = PX as diameter (centre M, the midpoint of PX) passes through F, because the angle PFX is a right angle. The open dot is its centre.', () => {
        k.circle(M, g.dist(P, X) / 2, { cls: 'given' });
        k.dot(M, { open: true });
        k.label(g.lerp(M, X, 0.45), 'r', 'w', { dist: 1.4 });
      });
      k.step('note', 'The angle ψ between r and the tangent at X equals the angle between p and the tangent to the pedal at F (both are inscribed in the same circle on the same chord).', () => {
        k.angle(X, P, F, { label: 'ψ', r: 1.6, labelDist: 1.0 });
        k.angle(F, P, Fdown, { label: 'ψ', r: 1.6, labelDist: 1.0 });
      });
      k.step('straightedge', 'So the tangent to the pedal at F is the tangent to the circle on r as diameter: the line through F perpendicular to MF.', () => {
        k.seg(g.add(F, g.mul(u, -115)), g.add(F, g.mul(u, 362)), { cls: 'given' });
        k.text(580, 120, 'PEDAL', { anchor: 'start', upright: true, size: 0.9 });
        k.text(604, 78, 'TANGENT', { anchor: 'start', upright: true, size: 0.9 });
        k.arrow(k.pt(572, 117), k.pt(490, 117), { headSize: 0.8 });
      });
      k.step('pencil', 'The pedal itself: the locus of F as X runs along the curve. It touches the line just drawn at F.', () => {
        k.curve(c.pedal, [phi0 - 0.3, phi0 + 0.3], { n: 60 });
      });
    }
  });

  /* Fig. 152, page 161 — polar coordinates for the pedal. The tangent at X(r, θ) makes the angle ψ with the
     radius vector r; the foot of the perpendicular from the pole has polar coordinates (r0, θ0). */
  Curves.figure({
    id: 'fig-152',
    section: 'pedal-curves',
    page: 161,
    title: 'Polar coordinates of the pedal',
    tags: ['pedal', 'polar', 'angle'],
    note: 'The given curve is an exact circular arc; the drawing is read off the page.',
    build(k) {
      const g = k.g;
      const O = k.pt(0, 0), X = k.pt(40, 428);
      const d = g.unit(k.pt(633, -425)), rho = 300;
      const Cc = g.add(X, g.mul(g.perp(d), rho));
      const c = circleCurve(g, Cc, rho, O);
      const F = g.foot(O, X, g.add(X, d));
      const T0 = g.lineLine(X, g.add(X, d), O, k.pt(1, 0));
      const phi0 = g.angleOf(g.sub(X, Cc));

      k.given('The pole O with the initial line, and the given curve with a point X, whose radius vector r makes the angle θ with the initial line.', () => {
        k.seg(O, k.pt(713, 0), { cls: 'given', arrow: 'end' });
        k.curve(c.curve, [phi0 - 0.48, phi0 + 0.57], { cls: 'thick', n: 60 });
        k.pivot(O);
        k.seg(O, X, { cls: 'given' });
        k.dot(X, { open: true });
        k.label(g.mid(O, X), 'r', 'w', { dist: 1.3 });
        k.angle(O, k.pt(1, 0), X, { label: 'θ', r: 2.8, labelDist: 0.5 });
      });
      k.step('straightedge', 'Draw the tangent at X. It makes the angle ψ with the radius vector, where tan ψ = r dθ/dr.', () => {
        k.seg(g.add(X, g.mul(d, -71)), T0, { cls: 'given' });
        k.angle(X, O, F, { label: 'ψ', r: 2, labelDist: 1.1 });
      });
      k.step('square', 'From O drop the perpendicular on the tangent. Its foot has the polar coordinates (r0, θ0): r0 = r sin ψ.', () => {
        k.seg(O, F, { cls: 'given' });
        k.dot(F, { open: true });
        k.label(g.mid(O, F), 'r_0', 'nw', { dist: 1.0 });
      });
      k.step('protractor', 'The angle θ0 is the direction of the perpendicular from the initial line. In the triangle formed by r, the perpendicular and the tangent, ψ + (θ − θ0) = π/2.', () => {
        k.angle(O, k.pt(1, 0), F, { label: 'θ_0', r: 5.3, labelDist: 0.6 });
      });
    }
  });

  /* Fig. 153, page 162 — the pedal equation of a pedal. The given curve is r = f(p). The pedal's tangent at the
     foot F touches the circle on r as diameter; the perpendicular p1 from the pole on it satisfies
     p1 = p²/r, that is p² = r p1 = f(p) p1. */
  Curves.figure({
    id: 'fig-153',
    section: 'pedal-curves',
    page: 162,
    title: 'The pedal equation of the pedal',
    tags: ['pedal', 'pedal equation', 'tangent'],
    note: 'In the book only r, p and p1 are drawn; the circle on r as diameter (light dashes here) is the construction that gives the tangent to the pedal.',
    build(k) {
      const g = k.g;
      const O = k.pt(0, 0), X1 = k.pt(-195, 435);
      const d = g.unit(k.pt(805, -157)), rho = 255;
      const Cc = g.add(X1, g.mul(g.perp(d), rho));
      const c = circleCurve(g, Cc, rho, O);
      const phi0 = g.angleOf(g.sub(X1, Cc));
      const F = g.foot(O, X1, g.add(X1, d));
      const M = g.mid(O, X1);
      let u = g.unit(g.perp(g.sub(F, M))); if (u.y > 0) u = g.mul(u, -1);
      const F1 = g.foot(O, F, g.add(F, u));

      k.given('The pole O and the given curve r = f(p), with a point X1 and the radius vector r = OX1.', () => {
        k.curve(c.curve, [phi0 - 0.6, phi0 + 0.54], { cls: 'thick', n: 60 });
        k.pivot(O);
        k.seg(O, X1, { cls: 'given' });
        k.dot(X1, { open: true });
        k.label(g.lerp(O, X1, 0.55), 'r', 'w', { dist: 1.3 });
      });
      k.step('straightedge', 'Draw the tangent to the curve at X1.', () => {
        k.seg(k.pt(-297, 452), k.pt(508, 295), { cls: 'given' });
      });
      k.step('square', 'From O drop the perpendicular p on this tangent. Its foot F is a point of the pedal, and p is the distance from the pole to the tangent of the given curve.', () => {
        k.seg(O, F, { cls: 'given' });
        k.dot(F, { open: true });
        k.label(g.lerp(O, F, 0.55), 'p', 'w', { dist: 1.0 });
      });
      k.step('compass', 'The circle on r = OX1 as diameter passes through F. The tangent to the pedal at F is also tangent to this circle (the angle ψ is the same for both).', () => {
        k.circle(M, g.dist(O, X1) / 2, { cls: 'aux', dash: true });
        k.dot(M, { open: true, r: 0.7 });
        k.seg(M, F, { cls: 'aux', dash: true });
      });
      k.step('square', 'Draw the tangent to the pedal at F: the line through F perpendicular to MF.', () => {
        k.seg(g.add(F, g.mul(u, -125)), g.add(F, g.mul(u, 420)), { cls: 'given' });
      });
      k.step('square', 'From O drop the perpendicular p1 on the tangent to the pedal. The similar right triangles give p1 = p²/r, that is p² = r · p1 = f(p) · p1.', () => {
        k.seg(O, F1, { cls: 'given' });
        k.dot(F1, { open: true });
        k.label(g.lerp(O, F1, 0.55), 'p_1', 'se', { dist: 0.9 });
      });
      k.step('pencil', 'The pedal of the curve through F.', () => {
        k.curve(c.pedal, [phi0 - 0.35, phi0 + 0.25], { n: 60 });
      });
    }
  });
})();
