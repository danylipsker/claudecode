/* Curves Workshop · figures/glissettes.js — Figs. 104–110 (pages 108–112)
 *
 * Glissettes: the locus of a point (or the envelope of a curve) carried by a curve that slides
 * between given curves. Everything is drawn in the coordinates of the scan (pixels of the
 * close-up, y turned upwards) where the book's proportions matter, and the exact geometry
 * (circles through three points, parallels, feet of perpendiculars, a conic with a given focus)
 * is computed from those few given points. */
(function () {
  'use strict';
  const S = (x, y) => ({ x: x, y: -y });                  // a point of the scan close-up -> maths coordinates
  const PI = Math.PI, TAU = 2 * Math.PI;

  /* a wide bar with round ends (the book draws its rods and the carpenter's square as hollow strips) */
  function stadium(k, A, B, w, o) {
    const g = k.g, th = g.angleOf(g.sub(B, A)), n = g.mul(g.perp(g.unit(g.sub(B, A))), w / 2);
    k.seg(g.add(A, n), g.add(B, n), o);
    k.seg(g.sub(A, n), g.sub(B, n), o);
    k.arc(B, w / 2, th - PI / 2, th + PI / 2, o);
    k.arc(A, w / 2, th + PI / 2, th + 3 * PI / 2, o);
  }

  /* short slanted strokes along a parametric curve: the book's mark for a fixed curve */
  function hatchAlong(k, f, t0, t1, n, len, side, o) {
    const g = k.g;
    for (let i = 0; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n, p = f(t), fr = g.frenet(f, t);
      const P = { x: p[0], y: p[1] };
      const d = g.unit(g.add(g.mul(fr.N, side), g.mul(fr.T, 0.7)));
      k.seg(P, g.add(P, g.mul(d, len)), o);
    }
  }

  /* a closed smooth curve through the given points (centripetal Catmull-Rom), as a polyline */
  function closedSpline(g, ctrl, per) {
    const n = ctrl.length, out = [];
    const seg = (P0, P1, P2, P3, t) => {
      const d = (p, q) => Math.sqrt(g.dist(p, q));
      const t0 = 0, t1 = t0 + d(P0, P1), t2 = t1 + d(P1, P2), t3 = t2 + d(P2, P3), tt = t1 + (t2 - t1) * t;
      const lin = (p, q, ta, tb) => g.add(g.mul(p, (tb - tt) / (tb - ta)), g.mul(q, (tt - ta) / (tb - ta)));
      const A1 = lin(P0, P1, t0, t1), A2 = lin(P1, P2, t1, t2), A3 = lin(P2, P3, t2, t3);
      return lin(lin(A1, A2, t0, t2), lin(A2, A3, t1, t3), t1, t2);
    };
    for (let i = 0; i < n; i++) for (let j = 0; j < per; j++) {
      const p = seg(ctrl[(i + n - 1) % n], ctrl[i], ctrl[(i + 1) % n], ctrl[(i + 2) % n], j / per);
      out.push([p.x, p.y]);
    }
    out.push(out[0]);
    return out;
  }

  const open = { open: true, r: 1.4 };

  /* ---------------------------------------------------------------- Fig. 104(a), page 108 */
  /* A rigid angle (the hatched triangle) slides with its two sides through the fixed points A and B.
     The angle APB is constant, so P stays on the circle through A, B and P: an arc of a circle. */
  Curves.figure({
    id: 'fig-104a',
    section: 'glissettes',
    page: 108,
    title: 'Glissette of the vertex of a rigid angle whose sides pass through two fixed points',
    tags: ['glissette', 'circle', 'rigid angle'],
    build(k) {
      const g = k.g;
      const A = S(128, 226), B = S(366, 220), P = S(284, 45);
      const L = g.along(P, A, g.dist(P, A) * 1.28), R = g.along(P, B, g.dist(P, B) * 1.64);
      const C = g.circumcenter(A, B, P), r = g.dist(C, P);
      k.given('The two fixed points A and B.', () => {
        k.dot(A, { r: 1.3 }); k.dot(B, { r: 1.3 });
        k.label(A, 'A', 'w'); k.label(B, 'B', 'e');
      });
      k.step('linkage', 'The rigid angle: a template (the hatched triangle) with its vertex at P and one side always through A, the other always through B. Slide it, keeping both sides on the points.', () => {
        k.hatch([P, L, R], { angle: g.deg(33), gap: 0.8, outline: true });
        k.label(P, 'P', 'n');
      });
      k.step('compass', 'The angle APB never changes, so P always lies on the circle through A, B and P (the inscribed angle on the chord AB is constant). Draw the arc APB: it is the glissette of P.', () => {
        k.arc3(C, B, A, { cls: 'curve' });
      });
      k.note('Any point Q of the side AP then describes a limacon, because Q moves on the circle of P by a fixed length along the line through A.', () => {});
    }
  });

  /* ---------------------------------------------------------------- Fig. 104(b), page 108 */
  /* The trammel of Archimedes. A on the x-axis, B on the y-axis, AB = a + b; P on the rod with
     PB = a and PA = b traces the ellipse x²/a² + y²/b² = 1. */
  Curves.figure({
    id: 'fig-104b',
    section: 'glissettes',
    page: 108,
    title: 'Trammel of Archimedes: the ellipse of a point of the rod',
    tags: ['glissette', 'ellipse', 'trammel'],
    build(k) {
      const g = k.g;
      const a = 85, b = 110, L = a + b, al = Math.asin(92 / L);
      const O = k.pt(0, 0), A = k.pt(L * Math.cos(al), 0), B = k.pt(0, L * Math.sin(al));
      const P = k.pt(a * Math.cos(al), b * Math.sin(al));
      k.given('Two fixed perpendicular lines, and a rod AB of fixed length with its end A on one line and its end B on the other.', () => {
        k.seg(k.pt(-134, 0), k.pt(179, 0), { cls: 'axis' });
        k.seg(k.pt(0, -146), k.pt(0, 144), { cls: 'axis' });
        k.seg(A, B, { cls: 'given' });
        k.dot(A, open); k.dot(B, open);
        k.label(B, 'B', 'w'); k.label(A, 'A', 'n');
      });
      k.step('dividers', 'Mark the carried point P on the rod: PB = a (it is the half-axis along OX) and PA = b (the half-axis along OY).', () => {
        k.dot(P, open); k.label(P, 'P', 'ne');
      });
      k.step('pencil', 'Slide the rod, keeping A on one line and B on the other, and mark P in many positions: the points lie on the ellipse with semi-axes a = PB and b = PA, whose centre is the crossing of the lines.', () => {
        k.curve(k.curves.ellipse(a, b), [0, TAU], { n: 240 });
      });
      k.note('Every point rigidly attached to the rod describes an ellipse; the case of the point at the end (a = 0 or b = 0) is the degenerate ellipse, the line.', () => {});
    }
  });

  /* ---------------------------------------------------------------- Fig. 104(c), page 108 */
  /* The envelope of the trammel rod AB (length L) is the astroid with a = L. */
  Curves.figure({
    id: 'fig-104c',
    section: 'glissettes',
    page: 108,
    title: 'The astroid as the envelope of the rod of the trammel',
    tags: ['glissette', 'astroid', 'envelope', 'trammel'],
    build(k) {
      const L = 158, al = Math.atan2(114, 110);
      const A = k.pt(L * Math.cos(al), 0), B = k.pt(0, L * Math.sin(al));
      k.given('Two fixed perpendicular lines, and the rod AB of fixed length L with A on one line and B on the other.', () => {
        k.seg(k.pt(-167, 0), k.pt(173, 0), { cls: 'axis' });
        k.seg(k.pt(0, -175), k.pt(0, 168), { cls: 'axis' });
        k.seg(A, B, { cls: 'given' });
        k.dot(A, open); k.dot(B, open);
        k.label(B, 'B', 'w', { dist: 1.6 }); k.label(A, 'A', 'sw');
      });
      k.step('pencil', 'Slide the rod and draw it in many positions; every position touches one curve, the envelope of the rod. It is the astroid x^(2/3) + y^(2/3) = L^(2/3), with its four cusps on the lines at distance L from the crossing.', () => {
        k.curve(k.curves.astroid(L), [0, TAU], { n: 360 });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 105, page 109 */
  /* The glissette of P, k units from A on a rod through the fixed point O while A runs on a given
     curve, is the curve r = f(θ) + k: a conchoid of the given curve. */
  Curves.figure({
    id: 'fig-105',
    section: 'glissettes',
    page: 109,
    title: 'The conchoid of a given curve as a glissette',
    tags: ['glissette', 'conchoid'],
    build(k) {
      const g = k.g;
      const O = k.pt(0, 0), kk = 282;
      const curve = t => [350 + t, 163 - 300 * Math.tanh(t / 250)];            // the given curve r = f(θ)
      const A = k.pt(curve(0)[0], curve(0)[1]);
      const dir = g.unit(A), P = g.add(A, g.mul(dir, kk));
      k.given('The fixed point O and the given curve r = f(θ).', () => {
        k.curve(curve, [-240, 275], { cls: 'given', n: 200 });
        k.dot(O, open); k.label(O, 'O', 'n');
      });
      k.step('straightedge', 'Draw a line from O; it meets the given curve at A. The rod is this line.', () => {
        k.seg(g.add(O, g.mul(dir, -133)), P, { cls: 'given' });
        k.dot(A, open); k.label(A, 'A', 'nw');
      });
      k.step('dividers', 'From A, along the line and away from O, lay off the constant length k: this gives P. (The distance k on the other side of A gives the second branch.)', () => {
        k.dot(P, open); k.label(P, 'P', 'n');
        k.label(g.mid(A, P), 'k', 'se', { dist: 0.8, upright: true });
      });
      k.step('pencil', 'Repeat from other lines through O: the points P make the conchoid r = f(θ) + k of the given curve (a piece is drawn).', () => {
        k.curve(t => { const p = curve(t), l = Math.hypot(p[0], p[1]); return [p[0] * (1 + kk / l), p[1] * (1 + kk / l)]; }, [-110, 110], { n: 200 });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 106, page 109 */
  /* A curve slides so that it always touches the x-axis and the y-axis. The book draws an arc of an
     oval touching both axes (here the ellipse (x/a + y/b − 1)² = κ xy/(ab), κ = 2.4, which touches the
     axes at (a, 0) and (0, b)) and a point P rigidly attached to it, with its distances x and y to the axes. */
  Curves.figure({
    id: 'fig-106',
    section: 'glissettes',
    page: 109,
    title: 'Point glissette of a curve sliding between two lines at right angles',
    tags: ['glissette', 'point glissette', 'tangent'],
    note: 'The book draws the curve freehand; here it is the ellipse that touches both axes at the open circles. Only the part the book shows is drawn.',
    build(k) {
      const g = k.g;
      const a = 335, b = 175, w = Math.sqrt(2.4) / 2;
      const E = t => { const D = (1 - t) * (1 - t) + 2 * w * t * (1 - t) + t * t; return [a * t * t / D, b * (1 - t) * (1 - t) / D]; };
      const Es = s => E(Math.tan(s));                                    // the same, parametrised so the far arm is sampled evenly
      const sL = Math.atan(-0.93), sR = Math.atan(6);
      const O = k.pt(0, 0), T1 = k.pt(a, 0), T2 = k.pt(0, b), P = k.pt(523, 310);
      const inside = k.pt(400, 200);
      const band = (t0, t1, wd, ang) => {                                 // a hatched band on the inner side of the curve
        const up = [], dn = [], n = 24;
        for (let i = 0; i <= n; i++) {
          const t = t0 + (t1 - t0) * i / n, p = E(t), fr = g.frenet(E, t);
          let nn = fr.N; const q = k.pt(p[0], p[1]);
          if (g.dot(nn, g.sub(inside, q)) < 0) nn = g.mul(nn, -1);
          up.push(q); dn.push(g.add(q, g.mul(nn, wd)));
        }
        k.hatch(up.concat(dn.reverse()), { angle: ang, gap: 0.8 });
      };
      k.given('The axes OX and OY, the curve touching OX and OY at the two open circles, and the point P carried with the curve.', () => {
        k.axes(O, { x: [-60, 650], y: [-60, 480] });
        k.dot(O, open);
        k.curve(Es, [sL, sR], { cls: 'curve', n: 300 });
        k.dot(T1, open); k.dot(T2, open);
        k.dot(P, open); k.label(P, 'P', 'e');
      });
      k.step('square', 'From P drop the perpendiculars to the two lines: the distance from P to OX is y and the distance from P to OY is x. When the curve is given by p = f(φ), referred to P, then y = p = f(φ) and x = f(φ + π/2), the coordinates of the glissette of P.', () => {
        k.seg(k.pt(0, P.y), P, { cls: 'cons', dash: true });
        k.seg(P, k.pt(P.x, 0), { cls: 'cons', dash: true });
        k.label(k.pt(P.x / 2, P.y), 'x', 'n', { upright: true });
        k.label(k.pt(P.x, P.y / 2), 'y', 'w', { upright: true });
      });
      k.note('Shading as in the book, along the inside of the curve.', () => {
        band(0.3, 0.62, 42, g.deg(-55));
        band(1.35, 2.4, 42, g.deg(70));
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 107, page 110 */
  /* A triangle ABC moves with side AB touching the fixed circle (centre X) and side AC touching the
     fixed circle (centre Y). The lines XA' ∥ AB and YA' ∥ AC are fixed in the triangle; A' is their
     meeting point, B' and C' their meeting points with BC. The circle through A', X, Y is fixed
     (the angle XA'Y = angle A is constant); D, where the parallel to BC through A' meets it again,
     is a fixed point of it; DP ⟂ BC is the altitude of the invariable triangle A'B'C', so BC touches
     the circle of centre D and radius DP. The normals to the sides at the points of contact meet at the
     instantaneous centre I, on that circle and on DP. */
  Curves.figure({
    id: 'fig-107',
    section: 'glissettes',
    page: 110,
    title: 'A triangle whose sides touch two fixed circles: the envelope of the third side',
    tags: ['glissette', 'envelope', 'instantaneous centre', 'limacon'],
    build(k) {
      const g = k.g;
      const B = k.pt(0, 0), C = k.pt(977, 0), A = k.pt(670, 612);
      const X = k.pt(415, 253), Y = k.pt(810, 162);
      const d1 = g.unit(g.sub(A, B)), d2 = g.unit(g.sub(C, A));
      const dist = (Pt, Q, R) => Math.abs(g.cross(g.sub(R, Q), g.sub(Pt, Q))) / g.dist(Q, R);
      const rX = dist(X, B, A), rY = dist(Y, A, C);
      const Ap = g.lineLine(X, g.add(X, d1), Y, g.add(Y, d2));
      const Bp = g.lineLine(X, g.add(X, d1), B, C), Cp = g.lineLine(Y, g.add(Y, d2), B, C);
      const O = g.circumcenter(Ap, X, Y), Rc = g.dist(O, Ap);
      const D = g.lineCircle(Ap, g.add(Ap, k.pt(1, 0)), O, Rc).reduce((p, q) => g.dist(p, Ap) > g.dist(q, Ap) ? p : q);
      const P = k.pt(D.x, 0);
      const I = g.lineCircle(D, P, O, Rc).reduce((p, q) => p.y < q.y ? p : q);
      const n1 = g.perp(d1), n2 = g.perp(d2);
      const TX = g.sub(X, g.mul(n1, Math.sign(g.dot(g.sub(X, B), n1)) * rX));
      const TY = g.sub(Y, g.mul(n2, Math.sign(g.dot(g.sub(Y, A), n2)) * rY));
      const disc = (Cn, r) => Array.from({ length: 64 }, (_, i) => g.polar(Cn, r, TAU * i / 64));

      k.given('The triangle ABC, with its side AB touching the fixed circle of centre X and its side AC touching the fixed circle of centre Y (the hatched discs). The triangle slides, keeping those contacts.', () => {
        k.poly([B, A, C, B], { cls: 'given' });
        k.hatch(disc(X, rX), { angle: g.deg(40), gap: 0.7 }); k.circle(X, rX, { cls: 'thick' });
        k.hatch(disc(Y, rY), { angle: g.deg(-40), gap: 0.7 }); k.circle(Y, rY, { cls: 'thick' });
        [B, A, C].forEach(p => k.dot(p, open));
        k.dot(X, open); k.dot(Y, open);
        k.label(A, 'A', 'e'); k.label(B, 'B', 'se'); k.label(C, 'C', 'se');
        k.label(X, 'X', 'w', { dist: 1.1 }); k.label(Y, 'Y', 'e', { dist: 1.1 });
      });
      k.step('square', 'Through X draw the parallel to AB and through Y the parallel to AC. They meet at A\' and cut BC at B\' and C\'. These two lines keep their place in the moving triangle, so A\'B\'C\' is an invariable triangle.', () => {
        k.seg(Bp, Ap, { cls: 'given' });
        k.seg(Ap, Cp, { cls: 'given' });
        k.dot(Bp, open); k.dot(Cp, open); k.dot(Ap, open);
        k.label(Bp, 'B\'', 'se'); k.label(Cp, 'C\'', 'sw'); k.label(Ap, 'A\'', 'n', { dist: 1.1 });
      });
      k.step('compass', 'Draw the circle through A\', X and Y. The angle XA\'Y equals the angle A of the triangle, always, and XY is fixed, so this circle is a fixed circle.', () => {
        k.circle(O, Rc, { cls: 'cons' });
      });
      k.step('square', 'Through A\' draw the parallel to BC; it meets the circle again at D. The angle DA\'X equals the angle A\'B\'C\' = angle ABC, which is constant, so D is a fixed point of the circle.', () => {
        k.seg(D, Ap, { cls: 'given' });
        k.dot(D, open); k.label(D, 'D', 'n', { dist: 1.3 });
        k.angle(Bp, C, Ap, { r: 1.0, n: 2, cls: 'cons' });
        k.angle(Ap, D, X, { r: 0.9, n: 2, cls: 'cons' });
      });
      k.step('square', 'From D drop the perpendicular DP to BC. DP is the altitude of the invariable triangle A\'B\'C\'.', () => {
        k.seg(D, P, { cls: 'given' });
        k.dot(P, open); k.label(P, 'P', 'se');
      });
      k.step('straightedge', 'The normals to the sides at the points of contact pass through X and through Y; they meet at the instantaneous centre of the triangle, which lies on the fixed circle and on DP.', () => {
        k.seg(TX, I, { cls: 'cons', dash: true });
        k.seg(TY, I, { cls: 'cons', dash: true });
      });
      k.step('pencil', 'BC is always at the same distance DP from the fixed point D, so it touches the circle of centre D and radius DP: that is the envelope of the third side (a piece of the circle is drawn).', () => {
        const t0 = g.angleOf(g.sub(P, D));
        k.arc(D, g.dist(D, P), t0 - 0.28, t0 + 0.28, { cls: 'curve', nobounds: true });
      });
      k.note('The point glissettes of the triangle (for example, any point F of A\'C\') are limacons.', () => {});
    }
  });

  /* ---------------------------------------------------------------- Fig. 108, page 110 */
  /* The trammel AB sliding on two perpendicular lines: its instantaneous centre I = the corner of the
     rectangle OAIB lies on the circle of centre O and radius AB, and on the circle with diameter AB. */
  Curves.figure({
    id: 'fig-108',
    section: 'glissettes',
    page: 110,
    title: 'The general theorem: a circle rolling inside a circle twice as large',
    tags: ['glissette', 'roulette', 'instantaneous centre', 'trammel'],
    build(k) {
      const g = k.g;
      const L = 334, O = k.pt(0, 0), A = k.pt(214, 0), B = k.pt(0, Math.sqrt(L * L - 214 * 214)), I = k.pt(A.x, B.y);
      const M = g.mid(A, B);
      k.given('The two perpendicular lines meeting at O, and the rod AB of fixed length with A on one line and B on the other (the trammel).', () => {
        k.seg(k.pt(-416, 0), k.pt(414, 0), { cls: 'axis' });
        k.seg(k.pt(0, -353), k.pt(0, 387), { cls: 'axis' });
        k.seg(A, B, { cls: 'thick' });
        k.dot(O, open); k.dot(A, open); k.dot(B, open);
        k.label(B, 'B', 'w'); k.label(A, 'A', 'se');
      });
      k.step('square', 'The perpendiculars to the two lines at A and B meet at I. A moves along OA, so IA is perpendicular to its motion; B moves along OB, so IB is perpendicular to its motion: I is the instantaneous centre of the rod.', () => {
        k.seg(B, I, { cls: 'cons', dash: true });
        k.seg(I, A, { cls: 'cons', dash: true });
        k.dot(I, open); k.label(I, 'I', 'e');
      });
      k.step('straightedge', 'Draw the diagonal OI of the rectangle OAIB. The diagonals of a rectangle are equal, so OI = AB.', () => {
        k.seg(O, I, { cls: 'cons', dash: true });
      });
      k.step('compass', 'Since OI = AB, the point I always lies on the circle about O with radius AB: the fixed circle.', () => {
        k.circle(O, L, { cls: 'given' });
      });
      k.step('compass', 'I also lies on the circle that has AB as diameter (the angle AIB is a right angle), a circle carried with the rod. Its radius is half that of the fixed circle: the motion is a circle rolling inside a circle twice as large.', () => {
        k.circle(M, L / 2, { cls: 'given' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 109, page 111 */
  /* The bar APB (PA = a, PB = b) with its ends on a simple closed curve. The book's outline is
     freehand; it is drawn here as a smooth closed curve through the same points. */
  Curves.figure({
    id: 'fig-109',
    section: 'glissettes',
    page: 111,
    title: 'A bar APB with its ends on a closed curve (Holditch\'s theorem)',
    tags: ['glissette', 'area', 'Holditch'],
    note: 'The book draws no locus: the ring between the curve and the locus of P has area πab (Holditch\'s theorem). The bar is as long as the curve is wide, as in the book.',
    build(k) {
      const g = k.g;
      const ctrl = [[290, 822], [215, 780], [165, 700], [148, 620], [158, 520], [178, 420], [190, 330], [190, 258], [215, 190], [260, 120], [330, 65], [420, 38], [500, 45], [575, 100], [625, 175], [643, 245], [680, 300], [760, 390], [860, 480], [940, 560], [985, 630], [993, 700], [960, 780], [890, 845], [800, 895], [700, 925], [620, 935], [520, 925], [430, 905], [360, 875]].map(p => S(p[0], p[1]));
      const A = ctrl[0], B = ctrl[15], P = g.lerp(A, B, 0.675);
      k.given('A simple closed curve.', () => {
        k.curve(closedSpline(g, ctrl, 30), null, { cls: 'given' });
      });
      k.step('linkage', 'The bar APB, with PA = a and PB = b, rests with its ends A and B on the curve. P is the point of the bar a from A.', () => {
        stadium(k, A, B, 56, { cls: 'given' });
        k.dot(A, { r: 2.2 }); k.dot(B, { r: 2.2 }); k.dot(P, { r: 2.2 }); k.circle(P, 28, { cls: 'given' });
        k.label(A, 'A', 'e', { dist: 2.4 }); k.label(B, 'B', 'e', { dist: 2.4 }); k.label(P, 'P', 'e', { dist: 2.4 });
      });
      k.note('Slide the bar round the curve, its ends always on it: P describes a second closed curve inside the first. The area between the two curves is πab.', () => {});
    }
  });

  /* ---------------------------------------------------------------- Fig. 110, page 112 */
  /* The vertex of a carpenter's square runs on a circle while the outer edge of one arm passes
     through the fixed point F. The outer edge of the other arm is the line through the vertex P
     perpendicular to FP; the foot of the perpendicular from F on it is on the circle, so the
     envelope has the circle as its auxiliary circle and F as a focus: a conic with centre C,
     semi-axis R (the radius), foci F and 2C − F: a hyperbola if F is outside the circle. */
  Curves.figure({
    id: 'fig-110',
    section: 'glissettes',
    page: 112,
    title: 'The carpenter\'s square: the envelope of an arm is a conic with focus F',
    tags: ['glissette', 'envelope', 'conic', 'focus'],
    build(k) {
      const g = k.g;
      const Cc = S(612, 412), R = 277, V = g.polar(Cc, R, g.deg(21.4));
      const u = g.unit(S(-195, 510)), w = g.mul(g.perp(u), -1);
      const t = 54, L1 = 856, L2 = 574;
      const F = g.add(V, g.mul(u, 546));
      const pt = (a, b) => g.add(V, g.add(g.mul(u, a), g.mul(w, b)));          // a along the long arm, b along the other arm
      const hatchAng = g.deg(40);
      k.given('The fixed circle (shaded where the book shades it) and the fixed point F.', () => {
        k.circle(Cc, R, { cls: 'given' });
        k.arc(Cc, R, g.deg(55), g.deg(76), { hatch: 'in', cls: 'given', nobounds: true });
        k.arc(Cc, R, g.deg(166), g.deg(198), { hatch: 'in', cls: 'given', nobounds: true });
        k.arc(Cc, R, g.deg(-18), g.deg(10), { hatch: 'in', cls: 'given', nobounds: true });
        k.dot(F, open); k.label(F, 'F', 'e', { dist: 1.3 });
      });
      k.step('linkage', 'The carpenter\'s square: its outer corner P stays on the circle, and the outer edge of one arm passes through F. The other arm is then perpendicular to FP.', () => {
        k.poly([pt(0, 0), pt(L1, 0), pt(L1, t), pt(t, t), pt(t, L2), pt(0, L2)], { cls: 'given', close: true });
        k.hatch([pt(t, 0), pt(L1, 0), pt(L1, t), pt(t, t)], { angle: hatchAng, gap: 0.7 });
        k.hatch([pt(0, 0), pt(0, L2), pt(t, L2), pt(t, 0)], { angle: g.deg(40), gap: 0.7 });
        k.dot(V, { r: 0.9 }); k.label(V, 'P', 'ne');
      });
      k.step('pencil', 'Draw the outer edge of the other arm in many positions of the square: the lines envelop a conic with focus F, whose centre is the centre of the circle and whose semi-axis is its radius. F is outside the circle, so the conic is a hyperbola.', () => {
        const e = g.unit(g.sub(F, Cc)), ep = g.perp(e), c = g.dist(F, Cc), bb = Math.sqrt(c * c - R * R);
        k.curve(s => { const p = g.add(Cc, g.add(g.mul(e, R * Math.cosh(s)), g.mul(ep, bb * Math.sinh(s)))); return [p.x, p.y]; }, [-1.2, 1.2], { n: 200, nobounds: true });
        k.curve(s => { const p = g.add(Cc, g.add(g.mul(e, -R * Math.cosh(s)), g.mul(ep, bb * Math.sinh(s)))); return [p.x, p.y]; }, [-0.7, 0.7], { n: 200, nobounds: true });
      });
    }
  });
})();
