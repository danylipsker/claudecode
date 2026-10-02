/* Curves Workshop · figures/cones.js — Fig. 30 (page 34)
 *
 * A cone with vertex V = (a, b, c) through a plane curve, in oblique projection: the axes OX (drawn foreshortened,
 * towards the viewer), OY (to the right) and OZ (up). The curve lies in the plane x = 0 and is a closed curve given
 * by a polar equation; the cone is the surface of the lines VP1 through V and the points P1 of the curve. A point P of
 * the cone on the line VP1 has x − a = k(x1 − a), y − b = k(y1 − b), z − c = k(z1 − c).
 */
(function () {
  'use strict';
  const PI = Math.PI;

  Curves.figure({
    id: 'fig-030',
    section: 'cones',
    page: 34,
    title: 'A cone through a plane curve, with vertex V = (a, b, c)',
    tags: ['cone', 'oblique projection', '3D'],
    note: 'The closed curve of the book is a freehand rounded shape; here it is the curve ρ = 190.3 + 1.5 cos θ + 2.9 sin θ − 7.6 cos 2θ − 28.0 sin 2θ − 3.9 cos 3θ − 3.9 sin 3θ − 17.6 cos 4θ + 5.1 sin 4θ about the point (542, 546) of the plane x = 0, a similar rounded square with a slight dent. The oblique projection takes (x, y, z) to (y − 0.404x, z − 0.25x).',
    build(k) {
      const g = k.g;
      const kx = -0.404, ky = -0.25;
      const proj = (x, y, z) => k.pt(y + kx * x, z + ky * x);
      const O = proj(0, 0, 0);
      const blob = th => { const r = 190.34 + 1.5 * Math.cos(th) + 2.91 * Math.sin(th) - 7.55 * Math.cos(2 * th) - 27.98 * Math.sin(2 * th) - 3.94 * Math.cos(3 * th) - 3.85 * Math.sin(3 * th) - 17.58 * Math.cos(4 * th) + 5.09 * Math.sin(4 * th); return proj(0, 542 + r * Math.cos(th), 546 + r * Math.sin(th)); };
      const V3 = [380, 281.5, 368];
      const V = proj(V3[0], V3[1], V3[2]);
      const th1 = g.deg(-138.3);
      const P1 = blob(th1);
      const kk = 0.7;
      const P = g.lerp(V, P1, kk);                         // the projection of a point of the cone on VP1 is the point at the same ratio
      // the two generators that touch the curve: the extreme directions seen from V
      const centre = proj(0, 542, 546), dc = g.sub(centre, V), base = g.angleOf(dc);
      let tMin = 0, tMax = 0, aMin = Infinity, aMax = -Infinity;
      for (let i = 0; i < 6000; i++) {
        const t = 2 * PI * i / 6000, w = blob(t);
        let a = g.angleOf(g.sub(w, V)) - base; while (a > PI) a -= 2 * PI; while (a < -PI) a += 2 * PI;
        if (a < aMin) { aMin = a; tMin = t; } if (a > aMax) { aMax = a; tMax = t; }
      }
      const T1 = blob(tMin), T2 = blob(tMax);

      k.given('The axes in oblique projection: OZ up, OY to the right, OX towards the viewer (drawn foreshortened), with the origin O.', () => {
        k.arrow(O, proj(0, 655, 0), { cls: 'axis' });
        k.arrow(O, proj(0, 0, 668), { cls: 'axis' });
        k.arrow(O, proj(520, 0, 0), { cls: 'axis' });
        k.label(proj(0, 655, 0), 'Y', 'n', { cls: 'axis', dist: 1.3 });
        k.label(proj(0, 0, 668), 'Z', 'e', { cls: 'axis', dist: 1.2 });
        k.label(proj(520, 0, 0), 'X', 'sw', { cls: 'axis', dist: 1.2 });
        k.dot(O, { open: true, r: 1 });
      });
      k.given('The given plane curve, the common curve of the two surfaces f(x, y, z) = 0 and g(x, y, z) = 0 (here a closed curve in the plane x = 0).', () => {
        k.curve(blob, [0, 2 * PI], { n: 360, cls: 'thick' });
      });
      k.step('straightedge', 'Mark the vertex V = (a, b, c). The two straight lines from V that just touch the curve outline the cone; a third line from V cuts the curve at P1 = (x1, y1, z1).', () => {
        k.seg(V, T1, { cls: 'given' });
        k.seg(V, T2, { cls: 'given' });
        k.seg(V, P1, { cls: 'given' });
        k.dot(V, { open: true, r: 1 }); k.label(V, 'V', 'nw', { dist: 1.1, upright: true });
        k.label(V, '(a,b,c)', 's', { dist: 1.4, upright: true, size: 0.9 });
        k.dot(P1, { open: true, r: 1 }); k.label(P1, 'P_1', 'ne', { dist: 1.0, upright: true });
      });
      k.step('dividers', 'Mark P on the line VP1 with VP = k · VP1, so that x − a = k(x1 − a), y − b = k(y1 − b), z − c = k(z1 − c). For every value of k, P is a point of the cone.', () => {
        k.dot(P, { open: true, r: 1 }); k.label(P, 'P', 'nw', { dist: 1.1, upright: true });
      });
    }
  });
})();
