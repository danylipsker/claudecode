/* Curves Workshop · figures/catenary.js — Figs. 10, 11(a), 11(b) (pages 12–13)
 *
 * Fig. 10:   the catenary y = a cosh(x/a) with the horizontal tension ka at the vertex, the weight ks of the arc s,
 *            the tangent at P, which also touches the circle of radius a about the foot C of P, and the involute (tractrix).
 * Fig. 11(a): the catenoid, the soap film between two coaxial rings, whose section is a catenary.
 * Fig. 11(b): a sail between two rods in a wind, pressure normal to the sail and proportional to v²: its section is a catenary.
 */

/* Fig. 10, page 12. Vertex V = (0, a), P = (x, a cosh(x/a)) with x = 1.8a, arc VP = s = a sinh(x/a) = a tan φ,
   tangent at P with slope tan φ = sinh(x/a). C = (x, 0): the tangent touches the circle (C, a) at B and B is the foot of the
   perpendicular from C to the tangent; CB = a, PB = s. B = (x − a tanh(x/a), a sech(x/a)) runs on a tractrix. */
Curves.figure({
  id: 'fig-010',
  section: 'catenary',
  page: 12,
  title: 'The catenary, its tension, its tangent and the circle of radius a',
  tags: ['catenary', 'tangent', 'tractrix', 'forces'],
  note: 'The book prints T sin φ = ka in the equations on page 12; the figure shows the vertical force ks, so T sin φ = ks.',
  build(k) {
    const g = k.g, a = 100, x = 1.8 * a;
    const O = k.pt(0, 0), V = k.pt(0, a);
    const cat = k.curves.catenary(a);
    const P = k.pt(...cat(x)), C = k.pt(x, 0);
    const B = k.pt(x - a * Math.tanh(x / a), a / Math.cosh(x / a));
    const sl = Math.sinh(x / a);                                  // slope of the tangent at P
    const d = g.unit(k.pt(1, sl));
    const lowEnd = g.add(P, g.mul(d, (-0.27 * a - P.y) / d.y));
    const topEnd = g.add(P, g.mul(d, (4.13 * a - P.y) / d.y));
    const Xc = g.add(P, g.mul(d, -P.y / d.y));                    // where the tangent crosses OX
    const trac = t => [t - a * Math.tanh(t / a), a / Math.cosh(t / a)];
    k.frame(-2.6 * a, -0.4 * a, 4.65 * a, 4.25 * a);

    k.given('The axes OX and OY, the vertex V of the catenary at the height a on OY, and its foot O.', () => {
      k.axes(O, { x: [-2.49 * a, 4.29 * a], y: [-0.26 * a, 4.1 * a] });
      k.seg(O, V, { cls: 'given' });
      k.dot(O, { open: true, r: 1.2 }); k.dot(V, { open: true, r: 1.2 });
      k.label(k.pt(0, 0.45 * a), 'a', 'w', { dist: 0.9 });
    });
    k.step('pencil', 'The catenary y = a cosh(x/a), through V with its lowest point at V. Compute points from the formula and join them. The heavy arc from V to P has the length s.', () => {
      k.curve(cat, [-2.06 * a, 0], { n: 120 });
      k.curve(cat, [0, x], { n: 120, width: 6 });
    });
    k.step('square', 'Choose P on the curve, here at x = 1.8a, and drop the perpendicular PC to OX (C is the foot).', () => {
      k.seg(P, C, { cls: 'cons' });
      k.dot(P, { open: true, r: 1.2 }); k.dot(C, { open: true, r: 1.2 });
      k.label(P, 'P', 'nw', { dist: 1.3 });
      k.label(C, 'C', 'se', { dist: 1.3 });
      k.label(k.pt(x, 0.55 * a), 'a', 'e', { dist: 0.9 });
    });
    k.step('compass', 'The circle about C with radius a.', () => {
      k.circle(C, a);
    });
    k.step('straightedge', 'The tangent to the catenary at P is also the tangent from P to this circle (item a of the general items). It touches the circle at B; CB is perpendicular to it, and its length from P to B equals the arc s. It cuts OX at the angle φ.', () => {
      k.seg(lowEnd, P, { cls: 'cons' });
      k.arrow(P, topEnd, { cls: 'given', width: 4.5 });
      k.seg(C, B, { cls: 'cons' });
      k.dot(B, { open: true, r: 1.2 });
      k.label(B, 'B', 'ne', { dist: 1.3 });
      k.label(topEnd, 'T', 'nw', { dist: 1.2, upright: true });
      k.angle(Xc, k.pt(Xc.x + 1, 0), k.pt(Xc.x + 1, sl), { label: 'φ', r: 1.2, labelDist: 1.3 });
      k.label(k.pt(1.28 * a, 1.58 * a), 's', 'e', { dist: 0.8 });
    });
    k.note('The forces on the arc VP of the chain (k = weight per unit length): the horizontal pull ka at V, the weight ks of the arc (a downward arrow) and the tension T at P along the tangent, with T cos φ = ka and T sin φ = ks.', () => {
      k.arrow(V, k.pt(-1.37 * a, a), { cls: 'thick', width: 4.5 });
      k.label(k.pt(-1.05 * a, 0.78 * a), 'ka', 'c', { upright: true });
      k.arrow(k.pt(0.94 * a, 1.49 * a), k.pt(0.94 * a, 1.2 * a), { cls: 'given' });
      k.label(k.pt(0.8 * a, 1.1 * a), 'ks', 'c', { upright: true });
      k.label(k.pt(1.06 * a, 1.99 * a), 's', 'c');
    });
    k.step('pencil', 'The path of B as the taut line PB unwinds from the catenary: an involute of the catenary, which is the tractrix (its cusp is at V, the axis OX is its asymptote). The line BC is its tangent.', () => {
      k.curve(trac, [-0.85 * a, x], { n: 160, cls: 'given', width: 1.6 });
    });
  }
});

/* Fig. 11(a), page 13 — the catenoid, a surface of revolution about a horizontal axis whose meridian is the catenary
   r = c cosh(s/c): the minimal surface that a soap film forms between two coaxial rings. Oblique projection: the rings are ellipses
   of ratio 3/4, the axis direction is stretched. Drawn on the scale of the scan (pixels, y downwards). */
Curves.figure({
  id: 'fig-011a',
  section: 'catenary',
  page: 13,
  title: 'The catenoid: a soap film spanning two rings',
  tags: ['3D', 'catenoid', 'minimal surface'],
  note: 'The book\'s neck is only a sketch; here the meridians are true catenaries r = c cosh(s/c).',
  build(k) {
    const S = (x, y) => k.pt(x, -y);
    const c1 = { x: 310, y: 410, R: 315 }, c2 = { x: 896, y: 422.5, R: 212.5 }, m = 0.746, cn = 28;
    const kz = (c2.x - c1.x) / (cn * (Math.acosh(c1.R / cn) + Math.acosh(c2.R / cn)));
    const x0 = c1.x + kz * cn * Math.acosh(c1.R / cn);                 // the neck
    const yc = x => c1.y + (c2.y - c1.y) * (x - c1.x) / (c2.x - c1.x);  // the axis
    const rad = x => cn * Math.cosh((x - x0) / (kz * cn));
    const inside2 = (x, y) => Math.pow((x - c2.x) / (m * c2.R), 2) + Math.pow((y - c2.y) / c2.R, 2) < 1;
    const mer = sg => (x, part) => { const y = yc(x) + sg * rad(x); return (inside2(x, y) === part) ? [x, -y] : null; };

    k.given('The two coaxial rings, drawn as ellipses: the large one on the left, the smaller one on the right, and the horizontal axis through their centres.', () => {
      [c1, c2].forEach(c => k.curve(t => [c.x + m * c.R * Math.cos(t), -(c.y + c.R * Math.sin(t))], [0, k.TAU], { n: 180, cls: 'given', width: 1.8 }));
    });
    k.step('pencil', 'The soap film between the rings is the catenoid: its outline is a catenary r = c cosh(s/c), which is wide at the rings and narrow at the neck. The two meridians start at the top and bottom of the large ring.', () => {
      [-1, 1].forEach(sg => k.curve(x => mer(sg)(x, false), [c1.x, c2.x], { n: 300, cls: 'given', width: 4 }));
    });
    k.note('Where the meridians pass behind the right ring they are dashed, up to the top and bottom of that ring.', () => {
      [-1, 1].forEach(sg => k.curve(x => mer(sg)(x, true), [c1.x, c2.x], { n: 300, cls: 'given', dash: true, width: 2.4 }));
    });
  }
});

/* Fig. 11(b), page 13 — a sail between two rods, with the wind perpendicular to the plane of the rods: the pressure on an
   element is normal to it and proportional to the square of the velocity. The free edges are catenaries "hanging" in the direction
   of the wind (a catenary in the frame turned so that its axis is the wind direction). Scan pixels, y downwards. */
Curves.figure({
  id: 'fig-011b',
  section: 'catenary',
  page: 13,
  title: 'A sail in the wind: another catenary',
  tags: ['sail', 'catenary', 'pressure'],
  build(k) {
    const g = k.g, S = (x, y) => k.pt(x, -y);
    const wd = g.unit(k.pt(-95, -62)), uw = g.perp(wd);              // the wind direction (math coordinates) and the direction across it
    const hang = (P0, P1, c) => {                                    // the catenary with axis along the wind through P0 and P1
      const U0 = g.dot(P0, uw), W0 = g.dot(P0, wd), U1 = g.dot(P1, uw), W1 = g.dot(P1, wd);
      const f = Uc => c * (Math.cosh((U1 - Uc) / c) - Math.cosh((U0 - Uc) / c)) - (W0 - W1);
      let lo = Math.min(U0, U1) - 20 * c, hi = Math.max(U0, U1) + 20 * c, flo = f(lo);
      for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2, fm = f(mid); if ((fm > 0) === (flo > 0)) { lo = mid; flo = fm; } else hi = mid; }
      const Uc = (lo + hi) / 2, K = W0 + c * Math.cosh((U0 - Uc) / c);
      return t => { const U = U0 + (U1 - U0) * t, W = K - c * Math.cosh((U - Uc) / c); return [U * uw.x + W * wd.x, U * uw.y + W * wd.y]; };
    };
    const L = S(100, 402), T = S(548, 48), R = S(870, 265), B = S(597, 885);
    const bez = (p, q, ctl) => t => [(1 - t) * (1 - t) * p[0] + 2 * (1 - t) * t * ctl[0] + t * t * q[0], -((1 - t) * (1 - t) * p[1] + 2 * (1 - t) * t * ctl[1] + t * t * q[1])];

    k.given('The two rods LT and RB, held apart, with the wind blowing perpendicular to their plane (the three arrows).', () => {
      k.seg(L, T, { cls: 'thick', width: 14 });
      k.seg(R, B, { cls: 'thick', width: 14 });
      [L, T, R, B].forEach(p => k.point(p, null, { r: 3.6 }));
      [[840, 25, 748, 90], [888, 30, 765, 113], [878, 65, 783, 130]].forEach(([x0, y0, x1, y1]) => k.arrow(S(x0, y0), S(x1, y1), { cls: 'given', width: 2.5 }));
    });
    k.step('pencil', 'The free edges of the sail: each is a catenary whose axis points along the wind, because the pressure on a piece of the cloth is normal to it and proportional to the square of the velocity. Fit it through the end points of the rods.', () => {
      k.curve(hang(L, B, 275), [0, 1], { n: 200, cls: 'given', width: 3 });
      k.curve(hang(T, R, 175), [0, 1], { n: 200, cls: 'given', width: 3 });
    });
    k.note('A few lines show the cloth between the rods: the pressure is normal to them.', () => {
      [[[173, 362], [192, 538], [150, 445]], [[273, 285], [302, 422], [262, 360]], [[380, 200], [398, 300], [372, 250]], [[483, 120], [495, 190], [478, 150]],
        [[810, 360], [768, 355], [790, 358]], [[770, 452], [724, 450], [748, 452]], [[730, 545], [650, 545], [690, 547]],
        [[688, 655], [562, 666], [620, 662]], [[630, 770], [480, 783], [555, 778]]].forEach(([p, q, ctl]) => k.curve(bez(p, q, ctl), [0, 1], { n: 40, cls: 'given', width: 1.5 }));
    });
  }
});
