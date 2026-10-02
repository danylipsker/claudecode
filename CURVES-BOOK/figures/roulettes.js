/* Curves Workshop · figures/roulettes.js — Figs. 159–169 (pages 175–184) */
(function () {
  'use strict';

  /* ---- shared helpers */
  /* Short hatch strokes along a parametric curve f(t) = [x, y], on the side away from the point `inside`
     (the book hatches the body that rolls, or the fixed body). */
  function hatchAlong(k, f, t0, t1, n, inside, len, w) {
    const g = k.g;
    for (let i = 0; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n, a = f(t - 1e-4), b = f(t + 1e-4), c = f(t);
      const T = g.unit(g.pt(b[0] - a[0], b[1] - a[1]));
      let N = g.perp(T);
      if (g.dot(N, g.sub(g.pt(c[0], c[1]), inside)) < 0) N = g.mul(N, -1);
      const d = g.unit(g.add(N, g.mul(T, 0.55)));
      k.seg(g.pt(c[0], c[1]), g.add(g.pt(c[0], c[1]), g.mul(d, len)), { cls: 'cons', width: w });
    }
  }
  /* A parabola η = ξ²/(4p) rolling on the x-axis without slipping; the point with parameter xi1 starts at the
     origin. rollTo(ξc) is the rigid motion (local → world) that puts the contact point ξc on the axis, with the
     tangent horizontal, at the abscissa (arc length from xi1). */
  function parabolaRoll(p, xi1) {
    const S = u => u * Math.sqrt(1 + u * u) + Math.asinh(u);
    const arc = xi => p * S(xi / (2 * p));
    const rollTo = xic => {
      const al = Math.atan(xic / (2 * p)), c = { x: xic, y: xic * xic / (4 * p) }, xc = arc(xic) - arc(xi1);
      const ca = Math.cos(-al), sa = Math.sin(-al);
      const f = v => ({ x: (v.x - c.x) * ca - (v.y - c.y) * sa + xc, y: (v.x - c.x) * sa + (v.y - c.y) * ca });
      f.inv = w => { const cb = Math.cos(al), sb = Math.sin(al), dx = w.x - xc, dy = w.y; return { x: dx * cb - dy * sb + c.x, y: dx * sb + dy * cb + c.y }; };
      return f;
    };
    return { arc, rollTo, local: xi => ({ x: xi, y: xi * xi / (4 * p) }) };
  }

  /* Fig. 159, page 175 — the general roulette. A curve R rolls on the fixed curve F; O is the point of R that
     touched F at O1 (the origin; the tangent and normal of F at O1 are the axes). When R touches F at T, the arc
     O1T of F equals the arc OT of R (both s). The normals at T and at O make the angles φ and φ + φ1 with the
     axis OX; (x1, y1) are the coordinates of T, (u, v) those of T referred to the tangent and normal at O.
     The page draws freehand curves; here F is a circle of radius ρF (centre on OX, tangent to OY at O1) and R a
     circle of radius ρR, so the roulette of O is an epicycloid, and the whole configuration is exact. */
  Curves.figure({
    id: 'fig-159',
    section: 'roulettes',
    page: 175,
    title: 'The roulette of a point attached to a rolling curve',
    tags: ['roulette', 'rolling', 'parametric'],
    note: 'The page sketches two general curves; here they are circles (radii 240 and 340 in the units of the drawing), which reproduces every angle and length of the sketch exactly and makes the roulette a true epicycloid.',
    build(k) {
      const g = k.g, rF = 240, rR = 340, phi = g.deg(72);
      const O1 = k.pt(0, 0);
      const CF = k.pt(-rF, 0);
      const T = g.polar(CF, rF, phi);
      const CR = g.add(T, g.mul(g.dir(phi), rR));
      const phi1 = rF * phi / rR;                              // the arc TO of R equals the arc O1T of F
      const O = g.polar(CR, rR, phi + Math.PI + phi1);
      const psi = phi + phi1;
      const Tx = k.pt(T.x, 0), Ox = k.pt(O.x, 0);
      const L1x = g.lineLine(CF, T, O1, k.pt(1, 0));           // = CF
      const L2x = g.lineLine(CR, O, O1, k.pt(1, 0));
      const n2 = g.dir(psi);                                   // normal at O, towards CR
      const N = g.add(O, g.mul(n2, g.dot(g.sub(T, O), n2)));   // foot of T on the normal at O
      const sF = g.polar(CF, rF, phi / 2), sR = g.polar(CR, rR, phi + Math.PI + phi1 / 2);
      const roul = k.curves.epicycloid(rF, rR);

      k.given('The fixed curve with its normal and tangent at O1 as axes: OX is the normal, OY the tangent. (Here the fixed curve is a circular arc through O1.)', () => {
        k.seg(k.pt(-1.2 * rF - 40, 0), k.pt(1.5 * rF + 120, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, -0.12 * rF), k.pt(0, 2.5 * rF), { cls: 'axis', arrow: 'end' });
        k.label(k.pt(1.5 * rF + 120, 0), 'X', 'n', { cls: 'axis', dist: 1.3 });
        k.label(k.pt(0, 2.5 * rF), 'Y', 'ne', { cls: 'axis', dist: 0.8 });
        k.arc(CF, rF, g.deg(-10), g.deg(110), { cls: 'given' });
        k.arc(CF, rF, g.deg(21), g.deg(51), { hatch: 'out' });
        k.point(O1, 'O_1', { at: 'sw', open: true });
      });
      k.step('compass', 'The rolling curve touches the fixed one at T, the point of the fixed curve at arc length s from O1. Its normal at T is the normal of the fixed curve there, which makes the angle φ with OX. (Here the rolling curve is a circle about a point CR on that normal.)', () => {
        k.arc(CR, rR, g.deg(216), g.deg(336), { cls: 'given' });
        k.arc(CR, rR, g.deg(224), g.deg(236), { hatch: 'out' });
        k.arc(CR, rR, g.deg(318), g.deg(334), { hatch: 'out' });
        k.point(T, 'T', { at: 'nw', open: true, lo: { dist: 0.8 } });
        k.label(sF, 's', 'w', { dist: 1.8 });
      });
      k.step('dividers', 'O is the point of the rolling curve that touched O1 when the motion began, so the arc TO of the rolling curve equals the arc O1T of the fixed curve: carry the length s from T along the rolling curve.', () => {
        k.point(O, 'O', { at: 'e', open: true });
        k.label(sR, 's', 'n', { dist: 1.2 });
      });
      k.step('straightedge', 'The normals of the two curves at T coincide; the normal of the rolling curve at O meets it at the angle φ1 (the angle through which the rolling curve has turned). That second normal makes the angle φ + φ1 with OX.', () => {
        k.seg(g.add(L1x, g.mul(g.dir(phi), -22)), g.add(CR, g.mul(g.dir(phi), 0.12 * rR)), { cls: 'given' });
        k.seg(g.add(L2x, g.mul(n2, -22)), g.add(CR, g.mul(n2, -0.12 * rR)), { cls: 'given' });
        k.angle(L1x, k.pt(L1x.x + 1, 0), T, { label: 'φ', r: 1.5, labelDist: 0.9 });
        k.angle(CR, T, O, { label: 'φ_1', r: 1.5, labelDist: 1.0 });
        k.angle(L2x, k.pt(L2x.x + 1, 0), CR, { r: 1.2 });
        k.label(g.add(L2x, k.pt(62, 26)), 'φ+φ_1', 'c', { size: 0.9 });
      });
      k.step('square', 'The coordinates (x1, y1) of T: drop the perpendicular from T on OX. The coordinates (u, v) of T referred to the tangent and normal at O: drop the perpendicular v from T on the normal at O; u is the piece from O to its foot.', () => {
        k.seg(T, Tx, { cls: 'given' });
        k.dot(Tx, { open: true });
        k.label(g.mid(T, Tx), 'y_1', 'e', { dist: 0.8 });
        k.label(g.mid(Tx, O1), 'x_1', 'n', { dist: 0.7 });
        k.seg(T, N, { cls: 'given' });
        k.label(g.mid(T, N), 'v', 'nw', { dist: 0.7 });
        k.label(g.mid(O, N), 'u', 'e', { dist: 0.7 });
      });
      k.step('pencil', 'The roulette of O: the path of O as the curve rolls, from O1 (where it starts with a cusp along OY) to the position shown. Its coordinates are x = v sin(φ+φ1) − u cos(φ+φ1) − x1 and y = −v cos(φ+φ1) − u sin(φ+φ1) + y1.', () => {
        k.curve(t => { const p = roul(t); return [p[0] + CF.x, p[1] + CF.y]; }, [0, phi], { cls: 'thick', n: 120 });
      });
      k.note('The coordinates of O: x measured along OX from O1, y the height of O. The thin line through O is the tangent of the rolling curve there.', () => {
        k.seg(O, Ox, { cls: 'given' });
        k.label(g.mid(O1, Ox), 'x', 'n', { dist: 0.7 });
        k.label(g.mid(O, Ox), 'y', 'e', { dist: 0.7 });
        const tn = g.perp(n2);
        k.seg(g.add(O, g.mul(tn, -90)), g.add(O, g.mul(tn, 170)), { cls: 'cons' });
      });
    }
  });

  /* Fig. 160, page 176 — the roulette of a point Q attached to a curve r = f(θ) (pole Q, initial line QO1) rolling
     on the x-axis. P is the point of contact and the instantaneous centre of rotation of Q, so the roulette has
     dy/dx = cot ψ, where ψ is the angle between PQ and the axis. The page sketches a general curve; here the rolling
     curve is a parabola, with the proportions of the sketch (the tangent point P and O1, Q and the angles all as drawn). */
  Curves.figure({
    id: 'fig-160',
    section: 'roulettes',
    page: 176,
    title: 'The roulette of a point carried by a curve rolling on a line',
    tags: ['roulette', 'rolling', 'instantaneous center', 'polar'],
    note: 'The page draws a freehand curve; here the rolling curve is a parabola placed so that the sketch\u2019s proportions come out (O1 above and left of P, Q above the curve, θ about 108°, ψ about 67°). The thick curves are the exact roulettes of Q and of O1.',
    build(k) {
      const g = k.g, sc = 176.4, p = sc;
      const xi1 = -2 * sc, xiP = 1.6 * sc;
      const R = parabolaRoll(p, xi1);
      const s0 = R.arc(xiP) - R.arc(xi1);                       // = OP
      const fP = R.rollTo(xiP);
      const O = k.pt(0, 0), P = k.pt(s0, 0);
      const O1 = fP(R.local(xi1));
      const Q = k.pt(s0 * 0.727, s0 * 0.648);
      const Ql = fP.inv(Q);
      const N = k.pt(Q.x, 0);
      const para = xi => { const w = fP(R.local(xi)); return [w.x, w.y]; };
      const inside = fP(k.pt(0, p));
      const roulQ = xic => { const w = R.rollTo(xic)(Ql); return [w.x, w.y]; };
      const roulO1 = xic => { const w = R.rollTo(xic)(R.local(xi1)); return [w.x, w.y]; };
      const sm = para(-1.0 * sc), sMid = k.pt(sm[0], sm[1]);

      k.given('The x-axis with the origin O, and the rolling curve resting on it at P. The point O1 of the curve touched the axis at O when the rolling began, so the arc O1P (length s) equals OP.', () => {
        k.seg(k.pt(-0.05 * s0, 0), k.pt(1.38 * s0, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, -0.06 * s0), k.pt(0, 1.1 * s0), { cls: 'axis', arrow: 'end' });
        k.label(k.pt(1.38 * s0, 0), 'X', 'n', { cls: 'axis', dist: 1.3 });
        k.label(k.pt(0, 1.1 * s0), 'Y', 'ne', { cls: 'axis', dist: 0.8 });
        k.curve(para, [-2.8 * sc, 2.6 * sc], { cls: 'given', n: 160 });
        hatchAlong(k, para, -2.8 * sc, -2.3 * sc, 8, inside, 28, 1.3);
        hatchAlong(k, para, 1.8 * sc, 2.5 * sc, 10, inside, 28, 1.3);
        k.point(O, 'O', { at: 'ne', open: true, lo: { dist: 1.2 } });
        k.point(P, 'P', { at: 'ne', open: true });
        k.point(O1, 'O_1', { at: 'nw', open: true });
        k.label(sMid, 's', 'ne', { dist: 1.2 });
      });
      k.step('dividers', 'Check the contact: the arc O1P of the rolling curve and the distance OP along the axis are the same length s, so the curve has rolled without slipping.', () => {
        k.dot(N, { open: true });
        k.label(N, 'N', 'nw', { dist: 1.0 });
        k.label(g.mid(O, N), 'x', 'n', { dist: 0.7 });
      });
      k.step('straightedge', 'Q is a point carried by the curve; its polar axis is QO1, and its radius vector to the contact point is r = QP. The angle θ at Q between QO1 and QP is the polar angle of the contact point: the curve is r = f(θ).', () => {
        k.pivot(Q);
        k.label(Q, 'Q', 'n', { dist: 2.2 });
        k.seg(Q, O1, { cls: 'given' });
        k.seg(Q, P, { cls: 'given' });
        k.label(g.mid(Q, P), 'r', 'e', { dist: 0.8 });
        k.angle(Q, O1, P, { label: 'θ', r: 1.7, labelDist: 0.9 });
      });
      k.step('square', 'The perpendicular QN from Q on the axis gives the coordinates of Q: x = ON and y = QN. The angle ψ between PQ and the axis at P satisfies y = r sin ψ.', () => {
        k.seg(Q, N, { cls: 'given' });
        k.label(g.mid(Q, N), 'y', 'w', { dist: 0.8 });
        k.angle(P, Q, O, { label: 'ψ', r: 1.7, labelDist: 0.9 });
      });
      k.step('pencil', 'P is the instantaneous centre of rotation of Q, so Q moves perpendicular to PQ: dy/dx = cot ψ. The path of Q (thick, with the wavy shape) is the roulette; the path of O1 itself is the thick curve rising from O.', () => {
        k.curve(roulQ, [xi1, 2.7 * sc], { cls: 'thick', n: 160 });
        k.curve(roulO1, [xi1, xiP], { cls: 'thick', n: 120 });
      });
    }
  });

  /* Fig. 161, page 177 — the locus of the focus of a parabola rolling on a line is a catenary. The parabola
     (drawn as the black band whose outer edge is the parabola and whose inner edge is its parallel at the
     distance p) has rolled so that it touches the x-axis; its focus F (the white dot) lies on the catenary
     y = p cosh(x/p), whose vertex is at the height p above the point where the parabola's vertex started. */
  function pointInPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < (b.x - a.x) * (pt.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  }
  Curves.figure({
    id: 'fig-161',
    section: 'roulettes',
    page: 177,
    title: 'The focus of a parabola rolling on a line traces a catenary',
    tags: ['roulette', 'catenary', 'parabola', 'rolling'],
    note: 'The page shows the rolling parabola as a black band; here the band lies between the parabola (its outer edge, which touches the line) and a parallel curve inside it. The focus is the white dot on the catenary.',
    build(k) {
      const g = k.g, p = 126, u = Math.sinh(1.06), xic = 2 * p * u;
      const Rl = parabolaRoll(p, 0), f = Rl.rollTo(xic);
      const w = 1.1 * p, N = 140, xa = -3 * p, xb = 3.5 * p;
      const outer = [], inner = [];
      for (let i = 0; i <= N; i++) {
        const xi = xa + (xb - xa) * i / N, loc = Rl.local(xi), sl = xi / (2 * p), q = Math.sqrt(1 + sl * sl);
        outer.push(f(loc));
        inner.push(f({ x: loc.x - w * sl / q, y: loc.y + w / q }));
      }
      const band = outer.concat(inner.reverse());
      const F = f(k.pt(0, p));
      const cat = k.curves.catenary(p);
      const catPts = [];
      for (let i = 0; i <= 240; i++) { const t = -2.15 * p + 4.3 * p * i / 240, c = cat(t), pt = k.pt(c[0], c[1]); catPts.push(pointInPoly(pt, band) ? null : c); }

      k.given('The line on which the parabola rolls (the x-axis) and the axis OY through the point where the parabola’s vertex started: the vertex touched the line at O, with the focus at the height p above it.', () => {
        k.seg(k.pt(-2.94 * p, 0), k.pt(4.4 * p, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, 0), k.pt(0, 4.1 * p), { cls: 'axis', arrow: 'end' });
        k.label(k.pt(4.4 * p, 0), 'X', 'se', { cls: 'axis', dist: 1.0 });
        k.label(k.pt(0, 4.1 * p), 'Y', 'nw', { cls: 'axis', dist: 0.8 });
        k.frame(-3.15 * p, -0.35 * p, 5.0 * p, 4.85 * p);
      });
      k.step('roll', 'Roll the parabola along the line without slipping. After rolling a length s it touches the line at the point of arc length s from its vertex; the band shows the parabola in this position, and the white dot is its focus F.', () => {
        k.poly(band, { close: true, fill: '#1b1b1b', cls: 'thick' });
        k.dot(F, { open: true, r: 1.5 });
      });
      k.step('pencil', 'The focus keeps the distance from the line that the parabola gives it: F is always at the height y = p cosh(x/p). The locus of F is the catenary (its vertex lies on the axis OY, at the height p).', () => {
        k.curve(catPts, null, { cls: 'curve' });
      });
      k.note('A property of this roulette (found from the pedal equation, see the text): a·ds = y dx, so a·s = ∫ y dx = A, the area under the catenary.', () => {
        k.label(g.pt(0.5 * p, 0), 'O', 'sw', { dist: 1.0 });
      });
    }
  });

  /* Fig. 162, page 178 — a cardioid rolling on a line. The pedal point (the centre of the fixed circle of the
     cardioid, the white dot) describes the ellipse x² + 9y² = 81a². The cardioid first rolls on the "top" of the
     line until the cusp touches, then on the "bottom" in the reverse direction. Two positions are drawn. */
  Curves.figure({
    id: 'fig-162',
    section: 'roulettes',
    page: 178,
    title: 'A cardioid rolling on a line: the roulette of its pedal point is an ellipse',
    tags: ['roulette', 'cardioid', 'ellipse', 'rolling'],
    note: 'The two black cardioids are two positions of the same one (above the line before the cusp touches, below it afterwards); the ellipse is the exact path of the white dots.',
    build(k) {
      const g = k.g, a = 60;
      const car = t => g.pt(a * (2 * Math.cos(t) - Math.cos(2 * t)), a * (2 * Math.sin(t) - Math.sin(2 * t)));
      const dcar = t => g.pt(a * (-2 * Math.sin(t) + 2 * Math.sin(2 * t)), a * (2 * Math.cos(t) - 2 * Math.cos(2 * t)));
      const place = t => {                                    // the cardioid with the contact point t on the x-axis, rolling on top
        const c = car(t), d = dcar(t), al = Math.atan2(d.y, d.x), xc = -8 * a * Math.cos(t / 2);
        const ca = Math.cos(-al), sa = Math.sin(-al);
        return v => g.pt((v.x - c.x) * ca - (v.y - c.y) * sa + xc, (v.x - c.x) * sa + (v.y - c.y) * ca);
      };
      const body = (t, flip) => { const f = place(t), pts = []; for (let i = 0; i <= 160; i++) { const w = f(car(2 * Math.PI * i / 160)); pts.push(g.pt(w.x, flip ? -w.y : w.y)); } return pts; };
      const ped = (t, flip) => { const w = place(t)(g.pt(0, 0)); return g.pt(w.x, flip ? -w.y : w.y); };
      const tUp = 2.15, tDn = 4.5;
      const topBody = body(tUp, false), botBody = body(tDn, true);

      k.given('The x-axis (the line on which the cardioid rolls) and the axis OY.', () => {
        k.seg(k.pt(-9.15 * a, 0), k.pt(9.25 * a, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, -4.0 * a), k.pt(0, 3.9 * a), { cls: 'axis', arrow: 'end' });
        k.label(k.pt(9.25 * a, 0), 'X', 'ne', { cls: 'axis', dist: 0.8 });
        k.label(k.pt(0, 3.9 * a), 'Y', 'ne', { cls: 'axis', dist: 0.8 });
      });
      k.step('roll', 'The cardioid (here with a = b, so the fixed circle has the same radius as the rolling one) rolls on the top of the line, touching it first at its cusp. The white dot is its pedal point, the centre of the fixed circle of the cycloidal family.', () => {
        k.poly(topBody, { close: true, fill: '#161616', cls: 'thick' });
        k.dot(ped(tUp, false), { open: true, r: 1.2 });
        k.arc(ped(tUp, false), 3.55 * a, g.deg(-10), g.deg(-44), { cw: true, arrow: true, cls: 'given', nobounds: true, width: 1.2 });
      });
      k.step('roll', 'After the cusp touches again, the cardioid rolls on the underside of the line in the reverse direction.', () => {
        k.poly(botBody, { close: true, fill: '#161616', cls: 'thick' });
        k.dot(ped(tDn, true), { open: true, r: 1.2 });
        k.arc(ped(tDn, true), 3.55 * a, g.deg(194), g.deg(162), { cw: true, arrow: true, cls: 'given', nobounds: true, width: 1.2 });
      });
      k.step('pencil', 'The pedal point (the white dot) describes the ellipse x² + 9y² = 81a², whose semi-axes are 9a and 3a.', () => {
        k.ellipse(g.pt(0, 0), 9 * a, 3 * a, { cls: 'curve' });
      });
    }
  });

  /* Fig. 163, page 180 — the locus of the centre of curvature of a curve, measured at the point of contact, as the
     curve rolls on a line. If the rolling curve has the Whewell equation s = f(φ), then the centre of curvature at
     the contact has x = s = f(φ) and y = R = f′(φ). The page sketches a general curve whose proportions (OP = s about
     1.15 R) are those of a circle that has rolled through 66°; here the rolling curve is that circle, so R is constant. */
  Curves.figure({
    id: 'fig-163',
    section: 'roulettes',
    page: 180,
    title: 'The locus of the centre of curvature of a rolling curve',
    tags: ['roulette', 'curvature', 'intrinsic', 'rolling'],
    note: 'The page draws a general curve; its proportions are those of a circle that has rolled through 66°, so the circle is used and the roulette of O1 is an exact cycloid. For a circle R is constant, so the locus of the centre of curvature is the line y = R; for a general curve s = f(φ) it is the curve x = f(φ), y = f′(φ), for the cycloidal family an ellipse (see the text).',
    build(k) {
      const g = k.g, R = 518, om = 1.149, s = R * om;
      const O = k.pt(0, 0), P = k.pt(s, 0), C = k.pt(s, R);
      const th1 = -Math.PI / 2 - om;                            // O1 on the circle: it has come round through the angle ω since the start
      const O1 = g.polar(C, R, th1);
      const roul = w => [R * w - R * Math.sin(w), R - R * Math.cos(w)];     // the path of O1: a cycloid
      const sMid = g.polar(C, R, th1 + om * 0.35);

      k.given('The x-axis and the axis OY. The rolling curve rests on the axis at P; the arc from its point O1 (the point that started at O) to P has length s, and OP = s.', () => {
        k.seg(k.pt(-0.12 * R, 0), k.pt(1.7 * R, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, -0.1 * R), k.pt(0, 1.78 * R), { cls: 'axis', arrow: 'end' });
        k.label(k.pt(1.7 * R, 0), 'X', 'se', { cls: 'axis', dist: 1.0 });
        k.label(k.pt(0, 1.78 * R), 'Y', 'ne', { cls: 'axis', dist: 0.8 });
        k.arc(C, R, g.deg(-204), g.deg(-52), { cls: 'given' });
        k.arc(C, R, g.deg(-203), g.deg(-190), { hatch: 'out' });
        k.arc(C, R, g.deg(-128), g.deg(-108), { hatch: 'out' });
        k.arc(C, R, g.deg(-70), g.deg(-55), { hatch: 'out' });
        k.point(O, 'O', { at: 'nw', open: true, lo: { dist: 1.4 } });
        k.point(P, null, { open: true });
        k.point(O1, 'O_1', { at: 'nw', open: true });
        k.label(sMid, 's', 'e', { dist: 1.4 });
        k.label(g.mid(O, P), 'x', 'n', { dist: 0.8 });
      });
      k.step('square', 'At the contact P erect the perpendicular to the line: the centre of curvature of the rolling curve lies on it, at the distance R (the radius of curvature) from P. Its coordinates are x = s and y = R.', () => {
        k.seg(P, C, { cls: 'given' });
        k.dot(C, { open: true });
        k.label(g.mid(P, C), 'y = R', 'e', { dist: 0.8 });
      });
      k.step('pencil', 'As the curve rolls, the point O1 describes its roulette (the thick curve rising from O; here a cycloid), and the centre of curvature moves along x = s = f(φ), y = R = f′(φ). For a circle R is constant, so this locus is the horizontal line y = R (dashed).', () => {
        k.curve(roul, [0, om], { cls: 'thick', n: 100 });
        k.seg(O, k.pt(0, -0.12 * R), { cls: 'thick' });
        k.seg(k.pt(0, R), C, { cls: 'curve', dash: true });
      });
    }
  });

  /* Fig. 164, page 180 — the envelope of a line carried by a curve rolling on a fixed line. P is the contact point
     and the centre of rotation of every point of the carried line ℓ, so the foot Q of the perpendicular PQ on ℓ is the
     point where ℓ touches its envelope. After rolling to a neighbouring point P1 (arc ds) the line has turned through
     dφ; dσ = QT + TQ1 = sin φ ds + z dφ. The rolling curve is a parabola, with the proportions of the page (OP = 485,
     ds = 150, dφ = 21°); the line is attached through the point O1 of the curve that touched the axis at O. */
  Curves.figure({
    id: 'fig-164',
    section: 'roulettes',
    page: 180,
    title: 'The envelope of a line carried by a curve rolling on a line',
    tags: ['roulette', 'envelope', 'rolling', 'instantaneous center'],
    note: 'The curve is drawn as a parabola; the neighbouring position is shown with a large dφ so that the small triangle can be seen. The perpendicular p from O on the carried line is the support-line distance of the page.',
    build(k) {
      const g = k.g, p = 194, xi1 = -493, xiP = -116, dxi = 144;
      const Rl = parabolaRoll(p, xi1);
      const s = Rl.arc(xiP) - Rl.arc(xi1);
      const fP = Rl.rollTo(xiP), f1 = Rl.rollTo(xi1);
      const al = xi => Math.atan(xi / (2 * p));
      const beta0 = g.deg(65);
      const O1l = Rl.local(xi1);
      const dLoc = g.rot(g.dir(beta0), al(xi1));                // direction of the carried line in the curve's own frame
      const lineAt = xic => { const f = Rl.rollTo(xic), a0 = f(O1l), d = g.rot(dLoc, -al(xic)); return { A: a0, d }; };
      const O = k.pt(0, 0), P = k.pt(s, 0);
      const L = lineAt(xiP);
      const Q = g.foot(P, L.A, g.add(L.A, L.d));
      const xi2 = xiP + dxi, P1 = fP(Rl.local(xi2));
      const T = g.foot(P1, L.A, g.add(L.A, L.d));
      const dphi = al(xi2) - al(xiP);
      const Q1 = g.rotAbout(T, P1, -dphi);
      const lam = (4 * p * Math.sin(Math.atan2(dLoc.y, dLoc.x)) - 2 * xi1 * dLoc.x) / (dLoc.x * dLoc.x);   // the second meeting of the line with the curve
      const Bl = g.add(O1l, g.mul(dLoc, lam)), Bw = fP(Bl);
      const para = xi => { const w = fP(Rl.local(xi)); return [w.x, w.y]; };
      const env = xic => { const f = Rl.rollTo(xic), a0 = f(O1l), d = g.rot(dLoc, -al(xic)), c = k.pt(Rl.arc(xic) - Rl.arc(xi1), 0), q = g.foot(c, a0, g.add(a0, d)); return [q.x, q.y]; };
      const Fp = g.foot(O, L.A, g.add(L.A, L.d));
      const inside = fP(k.pt(0, p));
      const dashEnd = g.lineLine(L.A, g.add(L.A, L.d), O, k.pt(1, 0));

      k.given('The fixed line (the x-axis) with the origin O, and the rolling curve resting on it at P. A line ℓ is carried by the curve; it passes through the point O1 of the curve that touched the axis at O.', () => {
        k.seg(k.pt(-255, 0), k.pt(755, 0), { cls: 'axis', arrow: 'end' });
        k.seg(k.pt(0, 0), k.pt(0, 625), { cls: 'axis', arrow: 'end' });
        k.curve(para, [-760, 400], { cls: 'given', n: 200 });
        hatchAlong(k, para, -270, -170, 8, inside, 26, 1.4);
        hatchAlong(k, para, 260, 380, 10, inside, 26, 1.4);
        k.seg(L.A, Bw, { cls: 'thick' });
        k.seg(dashEnd, L.A, { cls: 'given', dash: true });
        k.dot(Bw, { open: true });
        k.dot(L.A, { open: true });
        k.point(O, null, { open: true });
        k.point(P, 'P', { at: 'se', open: true, lo: { dist: 1.0 } });
      });
      k.step('square', 'Draw PQ perpendicular to the carried line ℓ; Q is its foot. Every point of ℓ turns about P (P is the instantaneous centre), so Q, whose motion is perpendicular to PQ, moves along ℓ itself: ℓ touches its envelope at Q.', () => {
        k.seg(P, Q, { cls: 'given' });
        k.point(Q, 'Q', { at: 'nw', open: true });
        k.label(g.mid(P, Q), 'z', 'e', { dist: 0.8 });
        k.angle(P, Q, k.pt(P.x - 1, 0), { label: 'φ', r: 1.7, labelDist: 0.9 });
      });
      k.step('roll', 'Let the curve roll on to a neighbouring point P1, at the arc ds from P. The line ℓ turns through dφ about P1: the perpendicular P1T falls on the old position of ℓ, and P1Q1 (equal to P1T) on the new one, so the new point of tangency is Q1.', () => {
        k.dot(P1, { open: true });
        k.label(P1, 'P_1', 'se', { dist: 0.9 });
        k.label(g.lerp(P, P1, 0.5), 'ds', 'n', { dist: 1.3 });
        k.seg(P1, T, { cls: 'given' });
        k.seg(P1, Q1, { cls: 'given' });
        k.point(T, 'T', { at: 'n', open: true });
        k.point(Q1, 'Q_1', { at: 'e', open: true });
        k.angle(P1, Q1, T, { label: 'dφ', r: 1.6, labelDist: 1.3 });
      });
      k.step('note', 'The element of the envelope is dσ = QT + TQ1 = sin φ · ds + z · dφ (QT is the projection of ds on ℓ; TQ1 is an arc about P1 of radius z). Hence dσ/dφ = sin φ (ds/dφ) + z.', () => {
        k.seg(O, Fp, { cls: 'cons' });
        k.dot(Fp, { open: true });
        k.label(g.mid(O, Fp), 'p', 'w', { dist: 1.0 });
      });
      k.step('pencil', 'The envelope of ℓ is the locus of the points Q: it starts at O, where the line passed through the point of contact, and touches ℓ at Q and Q1.', () => {
        k.curve(env, [xi1 - 40, xi2], { cls: 'curve', n: 160 });
      });
    }
  });

  /* Fig. 165, page 181 — the envelope of a diameter of a circle of radius a rolling on a line: z = a sin φ,
     ds/dφ = a, so dσ/dφ = 2a sin φ and σ = −2a cos φ, the intrinsic equation of an ordinary cycloid. The diameter was
     vertical when the circle touched the axis at O; it has now turned through φ = 72°. */
  Curves.figure({
    id: 'fig-165',
    section: 'roulettes',
    page: 181,
    title: 'The envelope of a diameter of a rolling circle is a cycloid',
    tags: ['roulette', 'envelope', 'cycloid', 'rolling'],
    note: 'Exact: the circle has rolled through φ = 72° from the position in which the carried diameter was perpendicular to the line.',
    build(k) {
      const g = k.g, a = 385, om = g.deg(72);
      const O = k.pt(0, 0), P = k.pt(a * om, 0), C = k.pt(a * om, a);
      const d = g.pt(Math.sin(om), Math.cos(om));                // the carried diameter has turned clockwise through φ
      const Q = g.add(C, g.mul(d, g.dot(g.sub(P, C), d)));
      const Ae = g.sub(C, g.mul(d, a)), Be = g.add(C, g.mul(d, a));
      const env = w => { const c = g.pt(a * w, a), dd = g.pt(Math.sin(w), Math.cos(w)), pp = g.pt(a * w, 0), q = g.add(c, g.mul(dd, g.dot(g.sub(pp, c), dd))); return [q.x, q.y]; };

      k.given('The fixed line, and the circle of radius a resting on it at P, rolled from O (the circle touched the line at O when it started; then the diameter drawn was perpendicular to the line).', () => {
        k.seg(k.pt(-0.46 * a, 0), k.pt(1.93 * a + a * om - 0.0, 0), { cls: 'given' });
        k.circle(C, a);
        k.arc(C, a, g.deg(76), g.deg(92), { hatch: 'in' });
        k.arc(C, a, g.deg(-56), g.deg(-42), { hatch: 'in' });
        k.dot(O, { open: true });
        k.dot(C, { open: true });
        k.seg(C, P, { cls: 'given' });
        k.label(g.mid(C, P), 'a', 'e', { dist: 0.9 });
      });
      k.step('straightedge', 'The carried line is a diameter of the circle (the thick line through its centre, turned through the angle φ since the start).', () => {
        k.seg(Ae, Be, { cls: 'thick' });
        k.dot(Ae, { open: true });
        k.dot(Be, { open: true });
      });
      k.step('square', 'From the contact point P drop the perpendicular PQ = z on the diameter. Q is the point where the diameter touches its envelope. Here z = a sin φ.', () => {
        k.seg(P, Q, { cls: 'given' });
        k.dot(Q, { open: true });
        k.label(g.mid(P, Q), 'z', 'w', { dist: 0.9 });
        k.angle(P, Q, k.pt(P.x - 1, 0), { label: 'φ', r: 2.4, labelDist: 0.8 });
      });
      k.step('pencil', 'The envelope is the locus of Q, an ordinary cycloid: from ds/dφ = a and z = a sin φ, dσ/dφ = 2a sin φ, that is σ = −2a cos φ. It starts with a cusp at O.', () => {
        k.curve(env, [-0.2, om], { cls: 'curve', n: 120 });
      });
    }
  });

  /* Fig. 166, page 181 — the envelope of a line carried by a curve rolling on a fixed curve: dσ/dφ = z + cos α ·
     R1 R2/(R1 + R2), where the normal to the line (the perpendicular z from the point of contact) makes the angle α
     with the common normal of the curves, and R1, R2 are the radii of curvature of the rolling and the fixed curve at
     the contact. Both curves are circles here, the carried line a chord AB of the rolling one. */
  Curves.figure({
    id: 'fig-166',
    section: 'roulettes',
    page: 181,
    title: 'The envelope of a line carried by a curve rolling on a curve',
    tags: ['roulette', 'envelope', 'curvature', 'rolling'],
    note: 'The curves are circles with the radii of the page (R1 = 310, R2 = 403), so the formula can be checked exactly; the chord AB is the carried line.',
    build(k) {
      const g = k.g, R1 = 310, R2 = 403, al = g.deg(19.7), z = 355;
      const T = k.pt(0, 0), C1 = k.pt(0, R1), C2 = k.pt(0, -R2);
      const nrm = g.pt(-Math.sin(al), Math.cos(al)), e = g.pt(Math.cos(al), Math.sin(al));
      const F = g.mul(nrm, z);
      const hits = g.lineCircle(F, g.add(F, e), C1, R1);
      const A = hits[0], B = hits[1];

      k.given('The fixed curve (lower) and the rolling curve (upper) touch at T. R1 and R2 are the radii of curvature at T; their centres lie on the common normal.', () => {
        k.arc(C1, R1, g.deg(172), g.deg(412), { cls: 'given' });
        k.arc(C2, R2, g.deg(30), g.deg(150), { cls: 'given' });
        k.arc(C1, R1, g.deg(-148), g.deg(-130), { hatch: 'in' });
        k.arc(C1, R1, g.deg(-54), g.deg(-38), { hatch: 'in' });
        k.arc(C2, R2, g.deg(128), g.deg(138), { hatch: 'in' });
        k.arc(C2, R2, g.deg(30), g.deg(54), { hatch: 'in' });
        k.seg(C1, C2, { cls: 'given' });
        k.dot(C1, { open: true });
        k.dot(C2, { open: true });
        k.point(T, null, { open: true });
        k.label(g.mid(T, C1), 'R_1', 'e', { dist: 1.1 });
        k.label(g.mid(T, C2), 'R_2', 'e', { dist: 1.1 });
      });
      k.step('straightedge', 'The carried line AB is a chord of the rolling curve (a line rigidly fixed to it).', () => {
        k.seg(A, B, { cls: 'thick' });
        k.point(A, 'A', { at: 'w', open: true });
        k.point(B, 'B', { at: 'e', open: true });
      });
      k.step('square', 'From the point of contact T drop the perpendicular z on the line. The normal to the line (the direction of z) makes the angle α with the common normal of the curves.', () => {
        k.seg(T, F, { cls: 'given' });
        k.dot(F, { open: true });
        k.label(g.mid(T, F), 'z', 'w', { dist: 0.9 });
        k.angle(T, C1, F, { label: 'α', r: 2.2, labelDist: 0.9 });
      });
      k.note('Then dσ/dφ = z + (cos α) · R1R2/(R1 + R2): the first term comes from the rotation about the point of contact, the second from the change of the point of contact along the curves.');
    }
  });

  /* Fig. 167, page 182 — a curve rolling on an equal curve with corresponding points in contact: the whole
     configuration is a reflection in the common tangent (Maclaurin, 1720). So the roulette of a carried point O is
     similar to the pedal of the fixed curve with respect to O1, the reflection of O, with twice its linear dimensions.
     The page draws two equal curves with the common tangent and two carried points with their reflections; here the
     curves are two equal parabolas, mirror images in the line. */
  Curves.figure({
    id: 'fig-167',
    section: 'roulettes',
    page: 182,
    title: 'A curve rolling on an equal curve: the reflection in the common tangent',
    tags: ['roulette', 'reflection', 'pedal', 'rolling'],
    note: 'The page shows the pairs of small circles as two carried points and their reflections; one pair is lettered O (carried by the rolling curve) and O1 (its reflection) here. The parabolas stand for the general curve.',
    build(k) {
      const g = k.g, p = 49, u = 4, xic = 2 * p * u;
      const W0 = k.pt(425, -142), d = g.unit(k.pt(420, -963)), ee = g.perp(d);
      const Rl = parabolaRoll(p, 0), fA = Rl.rollTo(xic);
      const toWorld = (v, flip) => g.add(W0, g.add(g.mul(d, v.x), g.mul(ee, flip ? -v.y : v.y)));
      const right = xi => { const w = toWorld(fA(Rl.local(xi)), false); return [w.x, w.y]; };
      const left = xi => { const w = toWorld(fA(Rl.local(xi)), true); return [w.x, w.y]; };
      const frameA = xi => fA(Rl.local(xi));
      let xa = 0; for (let xi = 0; xi > -40 * p; xi -= 1) { if (frameA(xi).y >= 520) { xa = xi; break; } }
      let xb = xic; for (let xi = xic; xi < 40 * p; xi += 1) { if (frameA(xi).x >= 1040) { xb = xi; break; } }
      const T = toWorld(g.pt(Rl.arc(xic), 0), false);
      const Lend0 = toWorld(g.pt(-60, 0), false), Lend1 = toWorld(g.pt(1050, 0), false);
      const refl = q => { const f = g.foot(q, W0, g.add(W0, d)); return g.add(f, g.sub(f, q)); };
      const Or = k.pt(738, -335), Or2 = k.pt(780, -372);
      const Ol = refl(Or), Ol2 = refl(Or2);
      const vtxR = toWorld(fA(Rl.local(0)), false), vtxL = toWorld(fA(Rl.local(0)), true);
      const focR = toWorld(fA(Rl.local(0) && g.pt(0, p)), false), focL = toWorld(fA(g.pt(0, p)), true);
      const farR = g.add(vtxR, g.mul(g.sub(vtxR, focR), 6)), farL = g.add(vtxL, g.mul(g.sub(vtxL, focL), 6));

      k.given('The fixed curve (on the left) and the line L that touches it at the point T of contact. L will also be the common tangent of the rolling curve.', () => {
        k.curve(left, [xa, xb], { cls: 'given', n: 240 });
        hatchAlong(k, left, -2.2 * p, 1.6 * p, 14, farL, 30, 1.4);
        k.seg(Lend0, Lend1, { cls: 'thick' });
        k.dot(T, { open: true });
        k.point(Ol, 'O_1', { at: 'w', open: true });
        k.dot(Ol2, { open: true });
      });
      k.step('fold', 'Fold the paper along the common tangent L: the rolling curve is the reflection of the fixed curve in L (an equal curve, touching it at corresponding points), and the carried point O is the reflection of the point O1 of the fixed curve.', () => {
        k.curve(right, [xa, xb], { cls: 'given', n: 240 });
        hatchAlong(k, right, -2.2 * p, 1.6 * p, 14, farR, 30, 1.4);
        k.point(Or, 'O', { at: 'e', open: true });
        k.dot(Or2, { open: true });
      });
      k.step('square', 'The roulette of O is therefore similar to the pedal of the fixed curve with respect to O1: if the perpendicular from O1 meets the tangent L at the foot N (a point of the pedal), then O lies at the double distance, O1O = 2·O1N. So the roulette is the pedal with twice its linear dimensions. (The cardioid is the simple example; see Caustics.)', () => {
        const N = g.foot(Ol, W0, g.add(W0, d));
        k.seg(Ol, Or, { cls: 'cons' });
        k.dot(N, { open: true, r: 0.8 });
      });
    }
  });

  /* Fig. 168, page 183 — the four-bar linkage of a crossed parallelogram (bars equal in pairs: AB = CD, AD = BC)
     acts as ellipses rolling on ellipses (a) or hyperbolas on hyperbolas (b). */
  const boxAround = (k, c, w, h) => k.poly([k.pt(c.x - w, c.y - h), k.pt(c.x + w, c.y - h), k.pt(c.x + w, c.y + h), k.pt(c.x - w, c.y + h)], { close: true, cls: 'given' });
  const conicAt = (g, M, om, a, b, kind, sign) => t => {            // a point of an ellipse (kind 'e') or of the branch `sign` of a hyperbola (kind 'h'); axis at the angle om
    const x = kind === 'e' ? a * Math.cos(t) : sign * a * Math.cosh(t), y = kind === 'e' ? b * Math.sin(t) : b * Math.sinh(t);
    const w = g.add(M, g.rot(g.pt(x, y), om)); return [w.x, w.y];
  };
  const nearestT = (f, t0, t1, target) => { let best = t0, bd = Infinity; for (let i = 0; i <= 4000; i++) { const t = t0 + (t1 - t0) * i / 4000, q = f(t), dd = Math.hypot(q[0] - target.x, q[1] - target.y); if (dd < bd) { bd = dd; best = t; } } return best; };

  Curves.figure({
    id: 'fig-168a',
    section: 'roulettes',
    page: 183,
    title: 'The crossed parallelogram: ellipses rolling on ellipses',
    tags: ['linkage', 'crossed parallelogram', 'ellipse', 'roulette'],
    note: 'With the short side AB fixed, the long bars meet at P on the ellipse with foci A and B; the equal ellipse with foci C and D touches it at P and rolls on it. The same linkage is used as a quick-return mechanism in machines.',
    build(k) {
      const g = k.g;
      const A = k.pt(150, -762), B = k.pt(572, -762), D = k.pt(695, -428), C = k.pt(373, -150);
      const P = g.lineLine(A, D, B, C);
      const a = g.dist(A, D) / 2, c = g.dist(A, B) / 2, b = Math.sqrt(a * a - c * c);
      const M1 = g.mid(A, B), M2 = g.mid(C, D), om2 = g.angleOf(g.sub(D, C));
      const e1 = conicAt(g, M1, 0, a, b, 'e'), e2 = conicAt(g, M2, om2, a, b, 'e');
      const inward = (M, f, t0, t1, n, len) => { const m = f((t0 + t1) / 2); hatchAlong(k, f, t0, t1, n, g.add(M, g.mul(g.sub(g.pt(m[0], m[1]), M), 5)), len, 1.5); };

      k.given('The short bar AB is fixed to the plane: the pivots A and B (in their slides) are the fixed points, the foci of the first ellipse.', () => {
        boxAround(k, A, 0.074 * 421, 0.066 * 421);
        boxAround(k, B, 0.074 * 421, 0.066 * 421);
        k.bar(A, B);
        k.pivot(A); k.pivot(B);
        k.label(A, 'A', 's', { dist: 3.0 });
        k.label(B, 'B', 's', { dist: 3.0 });
      });
      k.step('linkage', 'Add the other three bars, equal in pairs: AD = BC (the longer bars, which cross) and CD = AB. This is a crossed parallelogram. The longer bars meet at P.', () => {
        k.bar(A, D); k.bar(B, C); k.bar(C, D);
        k.pivot(C); k.pivot(D);
        k.label(C, 'C', 'e', { dist: 3.0 });
        k.label(D, 'D', 'n', { dist: 3.0 });
        k.point(P, 'P', { at: 'ne', r: 1.7, lo: { dist: 1.4 } });
      });
      k.step('pencil', 'Whatever the position of the bars, PA + PB = AD is constant: P moves on the ellipse with foci A and B and major axis AD.', () => {
        k.curve(e1, [0, k.TAU], { cls: 'given', n: 200 });
        inward(M1, e1, g.deg(107), g.deg(120), 6, 26);
        inward(M1, e1, g.deg(-78), g.deg(-55), 8, 26);
      });
      k.step('pencil', 'The points C and D are the foci of an equal ellipse that touches the first at P. As the linkage moves, this ellipse rolls on the fixed one (the action of rolling ellipses).', () => {
        k.curve(e2, [0, k.TAU], { cls: 'given', n: 200 });
        inward(M2, e2, g.deg(55), g.deg(75), 8, 26);
        inward(M2, e2, g.deg(-120), g.deg(-102), 8, 26);
      });
    }
  });

  Curves.figure({
    id: 'fig-168b',
    section: 'roulettes',
    page: 183,
    title: 'The crossed parallelogram: hyperbolas rolling on hyperbolas',
    tags: ['linkage', 'crossed parallelogram', 'hyperbola', 'roulette'],
    note: 'With the long bar BC fixed, the short bars (extended) meet at P on the hyperbola with foci B and C; an equal hyperbola with foci A and D rolls on it, touching it at P. The dashed ends of the curves continue them beyond the part the linkage reaches.',
    build(k) {
      const g = k.g;
      const B = k.pt(190, -487), C = k.pt(815, -487), A = k.pt(550, -277);
      const sShort = g.dist(A, B), Llong = g.dist(B, C);
      const cands = g.circleCircle(A, Llong, C, sShort);
      const D = cands.reduce((m, q) => (!m || q.y < m.y ? q : m), null);          // the crossed one, below the base line
      const P = g.lineLine(B, A, C, D);
      const a = sShort / 2;
      const M1 = g.mid(B, C), c1 = Llong / 2, b1 = Math.sqrt(c1 * c1 - a * a);
      const M2 = g.mid(A, D), om2 = g.angleOf(g.sub(D, A)), c2 = g.dist(A, D) / 2, b2 = Math.sqrt(c2 * c2 - a * a);
      const hR = conicAt(g, M1, 0, a, b1, 'h', 1), hL = conicAt(g, M1, 0, a, b1, 'h', -1);
      const hA = conicAt(g, M2, om2, a, b2, 'h', -1), hD = conicAt(g, M2, om2, a, b2, 'h', 1);     // the branch round A, the branch round D
      const tP = nearestT(hA, -3, 3, P);
      const tA1 = nearestT(hA, -3, 3, k.pt(310, -375)), tA2 = nearestT(hA, -3, 3, k.pt(85, -255));
      const tD1 = nearestT(hD, -3, 3, k.pt(410, -970)), tD2 = nearestT(hD, -3, 3, k.pt(850, -782)), tD3 = nearestT(hD, -3, 3, k.pt(1045, -845));
      const inwardTo = (f, t0, t1, n, len, toward) => hatchAlong(k, f, t0, t1, n, toward, len, 1.5);

      k.given('The long bar BC is fixed to the plane (the pivots B and C in their slides): B and C are the foci of the first hyperbola.', () => {
        boxAround(k, B, 0.07 * 625, 0.075 * 625);
        boxAround(k, C, 0.07 * 625, 0.075 * 625);
        k.bar(B, C);
        k.pivot(B); k.pivot(C);
        k.label(B, 'B', 's', { dist: 3.2 });
        k.label(C, 'C', 'se', { dist: 3.2 });
      });
      k.step('linkage', 'Add the bars BA and CD (equal, the short sides) and AD (equal to BC): a crossed parallelogram.', () => {
        k.bar(B, A); k.bar(A, D); k.bar(D, C);
        k.pivot(A); k.pivot(D);
        k.label(A, 'A', 'n', { dist: 3.0 });
        k.label(D, 'D', 'e', { dist: 3.0 });
      });
      k.step('straightedge', 'Extend the short bars BA and CD: they meet at P.', () => {
        k.seg(A, P, { cls: 'cons', dash: true });
        k.seg(C, P, { cls: 'cons', dash: true });
        k.point(P, 'P', { at: 'e', open: true, lo: { dist: 1.3 } });
      });
      k.step('pencil', 'P is on the hyperbola with foci B and C: PB − PC = AB, constant. Both branches are drawn.', () => {
        k.curve(hR, [-1.4, 1.58], { cls: 'given', n: 200 });
        k.curve(hL, [-1.36, 1.33], { cls: 'given', n: 200 });
        inwardTo(hL, -1.2, -0.85, 8, 28, g.add(M1, g.pt(-900, 0)));
        inwardTo(hR, 0.6, 0.95, 6, 28, g.add(M1, g.pt(900, 0)));
        inwardTo(hR, -0.95, -0.7, 5, 28, g.add(M1, g.pt(900, 0)));
      });
      k.step('pencil', 'An equal hyperbola with foci A and D touches the first at P (PD − PA = AB as well); it rolls on the fixed one as the linkage moves. The dashed pieces continue its branches.', () => {
        const tc = (t0, t1, dash) => k.curve(hA, [t0, t1], { cls: 'given', n: 120, dash });
        tc(Math.min(tA1, tP + 0.12), Math.max(tA1, tP + 0.12), false);
        tc(Math.min(tA2, tA1), Math.max(tA2, tA1), true);
        k.curve(hD, [Math.min(tD1, tD2), Math.max(tD1, tD2)], { cls: 'given', n: 120 });
        k.curve(hD, [Math.min(tD2, tD3), Math.max(tD2, tD3)], { cls: 'given', n: 60, dash: true });
        inwardTo(hA, tA1, tP - 0.2, 8, 26, g.add(M2, g.pt(0, 900)));
        inwardTo(hD, Math.min(tD1, tD2) + 0.2, Math.min(tD1, tD2) + 0.6, 6, 26, g.add(M2, g.pt(0, -900)));
      });
    }
  });

  /* Fig. 169, page 184 — the crossed parallelogram used to roll a conic on a straight line: P (where the long bars
     cross, or where the short bars extended meet) is moved along a line, and toothed wheels on the bars force the
     motion of the pivots to be perpendicular to the bars, so that P is the centre of rotation of every point of the
     bar CD (or AD): the action is that of an ellipse (a) or a hyperbola (b) rolling on the line, and the path of the
     pivot C (or D) is an elliptic (hyperbolic) catenary. */

  /* The roulette: the conic whose points are wc(t) (in its present position, touching the line through P with the
     unit direction e at the parameter tP) rolls on that line without slipping; the path of the carried point q. */
  function conicRoulette(g, wc, tP, P, e, q, t0, t1, n) {
    const tang = t => g.unit(g.sub(wc(t + 1e-4), wc(t - 1e-4)));
    const s0 = Math.sign(g.dot(tang(tP), e)) || 1;
    const arcTo = t => { let sum = 0, prev = wc(tP); const m = Math.max(4, Math.ceil(Math.abs(t - tP) * 300)); for (let i = 1; i <= m; i++) { const r = wc(tP + (t - tP) * i / m); sum += g.dist(prev, r); prev = r; } return t >= tP ? sum : -sum; };
    const ang = g.angleOf(e), pts = [];
    for (let i = 0; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n, c = wc(t), rho = ang - g.angleOf(g.mul(tang(t), s0));
      const Pn = g.add(P, g.mul(e, s0 * arcTo(t)));
      const w = g.add(Pn, g.rot(g.sub(q, c), rho));
      pts.push([w.x, w.y]);
    }
    return pts;
  }
  const lensAt = (g, c, dir, halfAcross, halfAlong) => { const n = g.perp(dir), pts = []; for (let i = 0; i < 24; i++) { const t = 2 * Math.PI * i / 24; pts.push(g.add(c, g.add(g.mul(n, halfAcross * Math.cos(t)), g.mul(dir, halfAlong * Math.sin(t))))); } return pts; };
  const sleeveAt = (g, c, dir, halfLen, halfWid) => { const n = g.perp(dir), u = g.mul(dir, halfLen), v = g.mul(n, halfWid); return [g.add(g.add(c, u), v), g.sub(g.add(c, u), v), g.sub(g.sub(c, u), v), g.add(g.sub(c, u), v)]; };

  Curves.figure({
    id: 'fig-169a',
    section: 'roulettes',
    page: 184,
    title: 'The crossed parallelogram rolling an ellipse on a line: the elliptic catenary',
    tags: ['linkage', 'crossed parallelogram', 'ellipse', 'catenary', 'roulette'],
    note: 'P, the crossing of the long bars, is moved along the horizontal line; the toothed wheels at the ends of the bars (small discs rolling on the paper) make the motion of C and D perpendicular to the bars, so that P is their centre of rotation. The thick curve is the exact roulette of C: an elliptic catenary.',
    build(k) {
      const g = k.g;
      const A = k.pt(320, -822), B = k.pt(897, -697), C = k.pt(327, -120), D = k.pt(903, -260);
      const P = g.lineLine(A, D, B, C);
      const e = k.pt(1, 0);
      const dAD = g.unit(g.sub(D, A)), dCB = g.unit(g.sub(B, C));
      const wD = g.add(D, g.mul(dAD, 133)), wB = g.add(B, g.mul(dCB, 139));
      const a = (g.dist(P, C) + g.dist(P, D)) / 2, c = g.dist(C, D) / 2, b = Math.sqrt(a * a - c * c);
      const M = g.mid(C, D), om = g.angleOf(g.sub(D, C));
      const wc = t => g.add(M, g.rot(g.pt(a * Math.cos(t), b * Math.sin(t)), om));
      const tP = nearestT0(wc, P);
      const path = conicRoulette(g, wc, tP, P, e, C, tP - 0.78, tP + 0.52, 160);

      k.given('The line along which P will be moved (it is the common tangent of the rolling ellipse, with foci C and D) and the fixed points: the crossed parallelogram ABCD with AB = CD (short) and AD = BC (long), the long bars crossing at P.', () => {
        k.seg(k.pt(120, -470), k.pt(505, -472), { cls: 'given' });
        k.seg(k.pt(706, -478), k.pt(1075, -482), { cls: 'given' });
        k.head(k.pt(878, -479.5), k.pt(1, 0), { cls: 'given' });
        k.label(k.pt(537, -470), 'P', 'c', { dist: 1.0 });
      });
      k.step('linkage', 'The four bars: AB and CD (equal), AD and BC (equal, longer); the long bars cross at P, where they pass through a sleeve that slides along the line. Beyond D and B the bars carry small toothed wheels that roll on the paper.', () => {
        k.bar(A, wD); k.bar(C, wB); k.bar(A, B); k.bar(C, D);
        k.poly(sleeveAt(g, P, dAD, 62, 24), { close: true, cls: 'given' });
        k.poly(sleeveAt(g, P, dCB, 62, 24), { close: true, cls: 'given' });
        k.poly(lensAt(g, wD, dAD, 38, 6), { close: true, cls: 'given' });
        k.poly(lensAt(g, wB, dCB, 38, 6), { close: true, cls: 'given' });
        k.pivot(A); k.pivot(B); k.pivot(C); k.pivot(D); k.pivot(P);
        k.label(A, 'A', 'n', { dist: 3.4 });
        k.label(B, 'B', 'ne', { dist: 3.0 });
        k.label(C, 'C', 'nw', { dist: 3.0 });
        k.label(D, 'D', 'nw', { dist: 3.2 });
      });
      k.step('pencil', 'Move P along the line. The wheels force C and D to move perpendicular to the bars, so P is the centre of rotation of any point of CD: the action is that of an ellipse (foci C and D) rolling on the line. The path of C (or D) is the elliptic catenary.', () => {
        k.curve(path, null, { cls: 'thick' });
      });
    }
  });

  /* the parameter of the point of the curve f(t) nearest to P */
  function nearestT0(f, P) { let best = 0, bd = Infinity; for (let i = 0; i <= 6000; i++) { const t = -3.2 + 12.7 * i / 6000, q = f(t), d = Math.hypot(q.x - P.x, q.y - P.y); if (d < bd) { bd = d; best = t; } } return best; }

  Curves.figure({
    id: 'fig-169b',
    section: 'roulettes',
    page: 184,
    title: 'The crossed parallelogram rolling a hyperbola on a line: the hyperbolic catenary',
    tags: ['linkage', 'crossed parallelogram', 'hyperbola', 'catenary', 'roulette'],
    note: 'Here P, the meeting point of the extended short bars, is moved along the line. The thick curve is the exact path of D for the position drawn (the page sketches a looped curve beside D, which this rolling does not produce for the drawn hyperbola).',
    build(k) {
      const g = k.g;
      const A = k.pt(517, -545), B = k.pt(857, -762), C = k.pt(517, -243), D = k.pt(867, -33);
      const P = g.lineLine(B, A, C, D);
      const e = k.pt(1, 0);
      const a = (g.dist(P, D) - g.dist(P, A)) / 2, c = g.dist(A, D) / 2, b = Math.sqrt(c * c - a * a);
      const M = g.mid(A, D), om = g.angleOf(g.sub(D, A));
      const wc = t => g.add(M, g.rot(g.pt(-a * Math.cosh(t), b * Math.sinh(t)), om));
      const tP = nearestT0b(wc, P);
      const path = conicRoulette(g, wc, tP, P, e, D, tP - 1.7, tP + 0.7, 300);
      const dDC = g.unit(g.sub(C, D)), dBA = g.unit(g.sub(A, B));        // along the short bars, towards P
      const endC = g.add(P, g.mul(dDC, 150)), endA = g.add(P, g.mul(dBA, 150));
      const zig = (E, dir) => { const n = g.perp(dir); return [g.add(E, g.mul(n, 22)), g.add(g.add(E, g.mul(n, 8)), g.mul(dir, -10)), g.add(g.add(E, g.mul(n, -6)), g.mul(dir, 8)), g.add(E, g.mul(n, -22))]; };

      k.given('The line along which P will be moved, and the crossed parallelogram ABCD: AB = CD (short) and AD = BC (long). The short bars, extended, meet at P.', () => {
        k.seg(k.pt(115, -388), k.pt(1125, -400), { cls: 'given' });
        k.head(k.pt(430, -393), k.pt(1, 0), { cls: 'given' });
      });
      k.step('linkage', 'The bars: the long bars AD and CB (they cross), and the short bars BA and DC, extended to the sleeve at P (where they cross, and slide on the line) and a little beyond. The small wheels on the short bars roll on the paper.', () => {
        k.bar(endA, B); k.bar(endC, D); k.bar(A, D); k.bar(C, B);
        k.poly(sleeveAt(g, P, g.unit(g.sub(A, P)), 52, 22), { close: true, cls: 'given' });
        k.poly(sleeveAt(g, P, g.unit(g.sub(C, P)), 52, 22), { close: true, cls: 'given' });
        k.poly(lensAt(g, g.lerp(C, D, 0.55), g.unit(g.sub(D, C)), 40, 6), { close: true, cls: 'given' });
        k.poly(lensAt(g, g.lerp(A, B, 0.55), g.unit(g.sub(B, A)), 40, 6), { close: true, cls: 'given' });
        k.poly(zig(endA, g.unit(g.sub(A, P))), { cls: 'given' });
        k.poly(zig(endC, g.unit(g.sub(C, P))), { cls: 'given' });
        k.pivot(A); k.pivot(B); k.pivot(C); k.pivot(D); k.pivot(P);
        k.label(A, 'A', 'sw', { dist: 3.2 });
        k.label(B, 'B', 'ne', { dist: 3.0 });
        k.label(C, 'C', 'nw', { dist: 3.2 });
        k.label(D, 'D', 'e', { dist: 3.0 });
        k.label(P, 'P', 'n', { dist: 3.4 });
      });
      k.step('pencil', 'Move P along the line. A and D are the foci of a hyperbola that touches the line at P; the wheels make P the centre of rotation, so the hyperbola rolls on the line, and D (or A) describes the hyperbolic catenary.', () => {
        k.curve(path, null, { cls: 'thick' });
      });
    }
  });
  function nearestT0b(f, P) { let best = 0, bd = Infinity; for (let i = 0; i <= 6000; i++) { const t = -3 + 6 * i / 6000, q = f(t), d = Math.hypot(q.x - P.x, q.y - P.y); if (d < bd) { bd = d; best = t; } } return best; }
})();
