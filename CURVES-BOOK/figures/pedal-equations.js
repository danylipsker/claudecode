/* Curves Workshop · figures/pedal-equations.js — Figs. 154–155 (pages 166–167) */
(function () {
  'use strict';

  /* Fig. 154, page 166 — from the rectangular to the pedal equation. The given curve f(x, y) = 0 has the
     tangent (f_y)0 (y − y0) + (f_x)0 (x − x0) = 0 at the point (x0, y0); the pedal point is the origin, r is the
     radius vector, p the perpendicular on the tangent, ψ the angle between r and the tangent. */
  Curves.figure({
    id: 'fig-154',
    section: 'pedal-equations',
    page: 166,
    title: 'From rectangular to pedal coordinates',
    tags: ['pedal equation', 'tangent', 'rectangular'],
    note: 'The given curve is an exact circular arc standing for f(x, y) = 0; r, p, ψ and θ are placed as on the page.',
    build(k) {
      const g = k.g;
      const O = k.pt(0, 0), X0 = k.pt(347, 760);
      const d = g.unit(k.pt(233, -438)), rho = 350;
      const Cc = g.add(X0, g.mul(g.perp(d), -rho));
      const phi0 = g.angleOf(g.sub(X0, Cc));
      const F = g.foot(O, X0, g.add(X0, d));

      k.given('The axes OX and OY with the pedal point at the origin O, and the curve f(x, y) = 0 through the point (x0, y0).', () => {
        k.seg(k.pt(-75, 0), k.pt(795, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, -70), k.pt(0, 798), { cls: 'axis', arrow: 'end' });
        k.label(k.pt(795, 0), 'X', 'n', { cls: 'axis', dist: 1.4 });
        k.label(k.pt(0, 798), 'Y', 'ne', { cls: 'axis', dist: 0.8 });
        k.curve(t => { const p = g.polar(Cc, rho, t); return [p.x, p.y]; }, [phi0 - 1.05, phi0 + 0.3], { cls: 'thick', n: 60 });
        k.pivot(O);
        k.point(X0, '(x_0, y_0)', { at: 'e', open: true });
      });
      k.step('straightedge', 'The tangent at (x0, y0): it passes through the point and is perpendicular to the gradient (f_x, f_y), that is (f_y)0 (y − y0) + (f_x)0 (x − x0) = 0.', () => {
        k.seg(g.add(X0, g.mul(d, -30)), g.add(X0, g.mul(d, 806)), { cls: 'given' });
      });
      k.step('straightedge', 'The radius vector r from the pedal point O to (x0, y0). The angle ψ lies between r and the tangent; θ is the angle of r from OX.', () => {
        k.seg(O, X0, { cls: 'given' });
        k.label(g.lerp(O, X0, 0.55), 'r', 'nw', { dist: 0.9 });
        k.angle(X0, O, F, { label: 'ψ', r: 2.2, labelDist: 1.0 });
        k.angle(O, k.pt(1, 0), X0, { r: 2.8 });
        k.label(g.polar(O, 128, g.deg(31)), 'θ', 'c');
      });
      k.step('square', 'From O drop the perpendicular p on the tangent. Its length is the distance from the origin to the tangent line: p² = [x0 (f_x)0 + y0 (f_y)0]² / [(f_x)0² + (f_y)0²].', () => {
        k.seg(O, F, { cls: 'given' });
        k.dot(F, { open: true });
        k.label(g.lerp(O, F, 0.5), 'p', 'nw', { dist: 0.9 });
      });
      k.note('Eliminating x0 and y0 among f(x0, y0) = 0, the tangent and the expression for p² leaves a relation between r and p: the pedal equation.', () => {
        const e = g.polar(Cc, rho, phi0 - 1.05);
        k.label(e, 'f(x, y) = 0', 'e', { upright: true, dist: 1.2 });
      });
    }
  });

  /* Fig. 155, page 167 — curvature in pedal coordinates. The pole O, the given curve with point X (here r is
     drawn vertical), the tangent at X making ψ with r, the normal at X with t, the perpendicular p to the tangent
     with foot F on the pedal curve, p1 the perpendicular on the pedal's tangent (φ = ψ), α = θ + φ the
     inclination of the tangent. At the right, the small triangle with ds, dr and r dθ. */
  Curves.figure({
    id: 'fig-155',
    section: 'pedal-equations',
    page: 167,
    title: 'Curvature in pedal coordinates',
    tags: ['pedal equation', 'curvature', 'pedal', 'tangent'],
    note: 'Drawn to the proportions of the page: r vertical (θ = 90°) and ψ = φ = 48.7°. The given curve is an exact circular arc; its pedal is computed from it.',
    build(k) {
      const g = k.g;
      const psi = g.deg(48.7), r = 405, rho = 300;
      k.pad(0.11); k.fontScale(0.6);                                           // the figure is wide (the triangle stands at the right): keep the lettering as small as in the book
      const O = k.pt(0, 0), X = k.pt(0, r);
      const d = k.pt(Math.sin(psi), -Math.cos(psi));            // the tangent at X, pointing down-right
      const n = k.pt(-Math.cos(psi), -Math.sin(psi));           // the normal at X, pointing down-left
      const Cc = g.add(X, g.mul(n, rho));
      const phiX = g.angleOf(g.sub(X, Cc));
      const F = g.foot(O, X, g.add(X, d));
      const Tn = g.foot(O, X, g.add(X, n));                      // foot of the perpendicular t on the normal
      const M = g.mid(O, X);
      let u = g.unit(g.perp(g.sub(F, M))); if (u.y > 0) u = g.mul(u, -1);   // the tangent of the pedal at F, downwards
      const F1 = g.foot(O, F, g.add(F, u));
      const T0 = g.lineLine(X, g.add(X, d), O, k.pt(1, 0));
      const foot = phi => { const x = g.polar(Cc, rho, phi); const T = k.pt(-Math.sin(phi), Math.cos(phi)); const f = g.foot(O, x, g.add(x, T)); return [f.x, f.y]; };

      k.given('The pole O with its axes, the given curve and a point X on it; r = OX (the page draws it vertical).', () => {
        k.seg(k.pt(-37, 0), k.pt(545, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, -35), X, { cls: 'axis' });
        k.curve(t => { const p = g.polar(Cc, rho, t); return [p.x, p.y]; }, [phiX - 0.5, phiX + 0.52], { cls: 'thick', n: 60 });
        k.point(O, null, { open: true });
        k.point(X, null, { open: true });
        k.label(g.lerp(O, X, 0.55), 'r', 'w', { dist: 1.4 });
        k.text(-170, 417, 'GIVEN', { upright: true, size: 0.85 });
        k.text(-130, 388, 'CURVE', { upright: true, size: 0.85 });
        k.angle(O, k.pt(1, 0), X, { r: 3.6 });
        k.label(g.polar(O, 100, g.deg(62)), 'θ', 'c');
      });
      k.step('straightedge', 'The tangent at X, meeting the axis at the angle α. ψ is the angle between r and the tangent.', () => {
        k.seg(g.add(X, g.mul(d, -69)), g.add(X, g.mul(d, 640)), { cls: 'given' });
        k.angle(X, O, F, { label: 'ψ', r: 2.0, labelDist: 1.1 });
      });
      k.step('straightedge', 'The normal at X (perpendicular to the tangent), and the perpendicular t on it from the pole: t = r cos ψ = r (dr/ds).', () => {
        k.seg(X, g.add(X, g.mul(n, 388)), { cls: 'given' });
        k.seg(O, Tn, { cls: 'given', dash: true });
        k.label(g.mid(O, Tn), 't', 'ne', { dist: 1.0 });
      });
      k.step('square', 'From O drop the perpendicular p on the tangent: p = r sin ψ. Its foot F is a point of the first positive pedal; p makes the angle α − π/2 with the axis.', () => {
        k.seg(O, F, { cls: 'given' });
        k.dot(F, { open: true });
        k.label(g.lerp(O, F, 0.62), 'p', 'nw', { dist: 1.0 });
      });
      k.step('pencil', 'The pedal curve of the given curve: the locus of F.', () => {
        k.curve(foot, [phiX - 0.4, phiX + 0.3], { n: 60 });
        k.text(333, 314, 'PEDAL', { upright: true, size: 0.85 });
        k.text(383, 277, 'CURVE', { upright: true, size: 0.85 });
        k.arrow(k.pt(285, 322), k.pt(176, 335), { headSize: 0.8 });
      });
      k.step('protractor', 'The tangent to the pedal at F makes with p the same angle ψ: φ = ψ. The perpendicular p1 from O on that tangent has the foot F1, and p² = r p1.', () => {
        k.seg(g.add(F, g.mul(u, -120)), g.add(F, g.mul(u, 330)), { cls: 'given' });
        k.seg(O, F1, { cls: 'given' });
        k.dot(F1, { open: true });
        k.label(g.lerp(O, F1, 0.5), 'p_1', 'n', { dist: 0.8 });
        k.angle(F, O, g.add(F, u), { label: 'φ', r: 1.8, labelDist: 1.1 });
        k.text(F1.x + 15, -45, 'ψ = φ', { upright: true, size: 0.85, anchor: 'start' });
      });
      k.step('note', 'The inclination of the tangent is α = θ + φ (α is measured at the point where the tangent meets the axis).', () => {
        k.angle(T0, g.add(T0, d), g.add(T0, k.pt(1, 0)), { r: 1.5 });
        k.label(g.add(T0, k.pt(-12, 62)), 'α', 'c');
        k.text(378, 164, 'α = θ + φ', { upright: true, size: 0.9 });
      });
      k.note('The small triangle: dr along the radius, r dθ across it and ds along the curve, with ds² = dr² + r² dθ² and tan ψ = r dθ/dr.', () => {
        const A = k.pt(760, 81), B = k.pt(1116, 84), Cc2 = k.pt(1112, 279);
        k.poly([A, B, Cc2], { close: true, cls: 'given' });
        k.angle(A, B, Cc2, { r: 2.2 });
        k.label(g.polar(A, 98, 0.13), 'ψ', 'c');
        k.text(g.mid(A, Cc2).x - 18, g.mid(A, Cc2).y + 28, 'ds', { upright: false, size: 0.95 });
        k.text(g.mid(A, B).x, g.mid(A, B).y + 28, 'dr', { upright: false, size: 0.95 });
        k.text(Cc2.x + 18, g.mid(B, Cc2).y, 'r·dθ', { upright: false, size: 0.95, anchor: 'start' });
      });
    }
  });
})();
