/* Curves Workshop · figures/pursuit.js — Fig. 156 (page 170) */

/* Fig. 156, page 170 — the pursuit curve. The pursued particle (ξ, η) moves up the line x = a from rest at the
   x-axis; the pursuer starts at the same moment at the origin with k times the speed and always heads straight at
   the pursued, so the tangent to its path at (x, y) passes through (ξ, η). θ is the inclination of the tangent:
   tan θ = y′, and ξ = a, η = y + (a − x) y′. The path is sampled by k.curves.pursuit(k) (quarry up the y-axis from
   the pursuer's start at (1, 0)), turned over to the book's placement: x → a(1 − x), y → a y. */
Curves.figure({
  id: 'fig-156',
  section: 'pursuit',
  page: 170,
  title: 'The pursuit curve for a particle moving along a straight line',
  tags: ['pursuit', 'tangent', 'differential equation'],
  note: 'Drawn here for k = 1 (the pursuer as fast as the pursued), with the pursued at height 0.79 a; the book sketches the path freehand. The page puts the letter a under the foot of the tangent; here it stands under the line x = a, which it names.',
  build(k) {
    const g = k.g, a = 300, kk = 1;
    const n = 3000, dt = 1.5 / n, eta = 0.79 * a;
    const raw = k.curves.pursuit(kk, n);
    const last = Math.round((eta / a) / dt);                        // the sample where the pursued is at height η
    const path = raw.slice(0, last + 1).map(p => [a * (1 - p[0]), a * p[1]]);
    const P = k.pt(path[last][0], path[last][1]);
    const Q = k.pt(a, eta);
    const O = k.pt(0, 0);
    const T = g.lineLine(P, Q, O, k.pt(1, 0));                       // where the tangent meets the x-axis
    k.frame(-0.12 * a, -0.15 * a, 1.27 * a, 1.25 * a);

    k.given('The axes OX and OY. The pursued particle starts from rest at the point (a, 0) of the x-axis and travels along the line x = a; the pursuer starts from the origin at the same moment, with k times the speed.', () => {
      k.seg(k.pt(-0.06 * a, 0), k.pt(1.13 * a, 0), { cls: 'axis', arrow: 'end' });
      k.seg(k.pt(0, -0.06 * a), k.pt(0, 1.17 * a), { cls: 'axis', arrow: 'end' });
      k.label(k.pt(1.13 * a, 0), 'X', 'n', { cls: 'axis', dist: 1.3 });
      k.label(k.pt(0, 1.17 * a), 'Y', 'ne', { cls: 'axis', dist: 0.8 });
      k.seg(k.pt(a, 0), k.pt(a, 1.2 * a), { cls: 'given' });
      k.label(k.pt(a, 0), 'a', 's', { dist: 1.3 });
      k.point(O, null, { open: true, r: 1.3 });
    });
    k.step('pencil', 'The path of the pursuer. Because the pursued starts at (a, 0), the pursuer first heads along OX; as the pursued climbs, the path bends upward. (Pointwise: step the pursued up the line in equal times and move the pursuer k times as far, each time straight at the pursued.)', () => {
      k.curve(path, null, { cls: 'curve' });
    });
    k.step('straightedge', 'At the position (x, y) the pursuer is heading straight at the pursued (ξ, η): the tangent to the path at (x, y) passes through (ξ, η). It meets the x-axis at the angle θ, with tan θ = y′.', () => {
      k.seg(T, Q, { cls: 'given' });
      k.point(P, '(x, y)', { at: 'nw', open: true, r: 1.3 });
      k.point(Q, '(ξ, η)', { at: 'e', open: true, r: 1.3, lo: { dist: 1.3 } });
    });
    k.note('The angle θ of the tangent. In the book’s lettering the height of the pursued is η = y + (a − x) y′, because the tangent runs from (x, y) to (a, η).', () => {
      k.angle(T, k.pt(T.x + 1, 0), Q, { label: 'θ', r: 2.2, labelDist: 1.0 });
    });
  }
});
