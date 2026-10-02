/* Curves Workshop · figures/epi-hypo-cycloids.js — Figs. 78(a), 78(b), 79(a), 79(b) (pages 81–82)
 *
 * Fig. 78  (p. 81)  the epicycloid (a) and the hypocycloid (b): the rolling circle at one position, the tangent through N
 * Fig. 79  (p. 82)  the double generation theorem, for the hypocycloid (a) and for the epicycloid (b)
 */
(function () {
  const PI = Math.PI;

  /* ---------------------------------------------------------------------------------------------
     Fig. 78(a), page 81 — the epicycloid. Fixed circle (O, a); rolling circle (A', b) touching it
     externally at T, with OT making the angle t with the axis; N is the end of the diameter TN of the
     rolling circle, P the tracing point. T is the instantaneous centre, so TP is the normal and the
     tangent is the chord through N: the angle φ it makes with OX is (a + 2b)t / 2b.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-078a',
    section: 'epi-hypo-cycloids',
    page: 81,
    title: 'The epicycloid: the rolling circle at one position, with the tangent',
    tags: ['roulette', 'epicycloid', 'tangent', 'instantaneous centre'],
    note: 'The book draws b a little under 0.7a and t of about 58°; the same values are used here (a = 150, b = 100, t = 58°).',
    build(k) {
      const g = k.g, a = 150, b = 100, t = g.deg(58);
      const O = k.pt(0, 0), u = g.dir(t), ex = k.pt(1, 0);
      const T = g.mul(u, a), A = g.mul(u, a + b), N = g.mul(u, a + 2 * b);
      const f = k.curves.epicycloid(a, b), p = f(t), P = k.pt(p[0], p[1]);
      const Q = g.lineLine(N, P, O, ex);                          // the tangent meets the axis here

      k.given('The fixed circle of radius a with its centre O, and the axis OX through the cusp (a, 0), where the tracing point starts.', () => {
        k.seg(k.pt(-1.12 * a, 0), k.pt(2.45 * a, 0), { cls: 'axis' });
        k.circle(O, a);
        k.arc(O, a, g.deg(84), g.deg(123), { cls: 'aux', hatch: 'in', nobounds: true });
        k.arc(O, a, g.deg(212), g.deg(253), { cls: 'aux', hatch: 'in', nobounds: true });
        k.point(O, 'O', { at: 'nw', open: true });
      });
      k.step('compass', 'Draw the radius OT at the angle t and the rolling circle of radius b outside the fixed circle: its centre A\' is on OT, a + b from O, so it touches the fixed circle at T. N is the end of the diameter TN.', () => {
        k.seg(O, N, { cls: 'given' });
        k.circle(A, b);
        k.dot(A, { open: true, r: 0.7 });
        k.point(T, 'T', { at: 'sw', open: true });
        k.point(N, 'N', { at: 'ne', open: true });
        k.dim(O, T, 'a', { dist: 1.1 });
        k.dim(T, A, 'b', { side: 'right', dist: 1.1 });
        k.dim(A, N, 'b', { side: 'right', dist: 1.1 });
        k.angle(O, ex, T, { label: 't', r: 1.1, labelDist: 1.45 });
      });
      k.step('roll', 'P is the point of the rolling circle that touched the fixed circle at the cusp (a, 0): the arc TP of the rolling circle equals the arc of the fixed circle from (a, 0) to T. Join T to P.', () => {
        k.seg(T, P, { cls: 'given' });
        k.point(P, 'P', { at: 'e', open: true });
      });
      k.step('straightedge', 'T is the instantaneous centre of rotation of P, so TP is the normal. The angle TPN is in a semicircle, a right angle, so the tangent at P is the line PN: draw it as far as the axis. It makes the angle φ = (a + 2b)t / 2b with OX.', () => {
        k.seg(N, g.along(N, Q, g.dist(N, Q) + 26), { cls: 'given' });
        k.angle(Q, g.add(Q, ex), N, { label: 'φ', r: 1.5, labelDist: 1.3 });
        k.text(165, -72, 'φ = (a+2b) t / 2b', { anchor: 'start', size: 0.95 });
      });
      k.step('pencil', 'The epicycloid: the path of P, with its cusp at (a, 0).', () => {
        k.curve(f, [-0.45, t], { n: 120 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 78(b), page 81 — the hypocycloid. The rolling circle (A', b) touches the fixed circle (O, a)
     from inside at T; N, the other end of the diameter TN, is on OT at the distance a − 2b from O.
     The tangent at P is the chord PN; it makes the angle φ = π − (a − 2b)t / 2b with OX, and the angle
     TNP of the rolling circle is a·t / 2b.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-078b',
    section: 'epi-hypo-cycloids',
    page: 81,
    title: 'The hypocycloid: the rolling circle at one position, with the tangent',
    tags: ['roulette', 'hypocycloid', 'tangent', 'instantaneous centre'],
    note: 'The book takes a/b of about 3.4 and t of about 48°; the same values are used here (a = 170, b = 50).',
    build(k) {
      const g = k.g, a = 170, b = 50, t = g.deg(48);
      const O = k.pt(0, 0), u = g.dir(t), ex = k.pt(1, 0);
      const T = g.mul(u, a), A = g.mul(u, a - b), N = g.mul(u, a - 2 * b);
      const f = k.curves.hypocycloid(a, b), p = f(t), P = k.pt(p[0], p[1]);
      const Q = g.lineLine(N, P, O, ex);

      k.given('The fixed circle of radius a (only the arc near the cusp is needed), its centre O and the axis OX through the cusp (a, 0).', () => {
        k.seg(k.pt(-0.25 * a, 0), k.pt(1.12 * a, 0), { cls: 'axis' });
        k.arc(O, a, g.deg(-33), g.deg(108), { cls: 'given' });
        k.arc(O, a, g.deg(80), g.deg(108), { cls: 'aux', hatch: 'out', nobounds: true });
        k.arc(O, a, g.deg(-27), g.deg(-12), { cls: 'aux', hatch: 'out', nobounds: true });
        k.point(O, 'O', { at: 'nw', open: true });
      });
      k.step('compass', 'Draw the radius OT at the angle t and the rolling circle of radius b inside the fixed circle: its centre is on OT, a − b from O. N is the other end of the diameter TN, so ON = a − 2b.', () => {
        k.seg(O, T, { cls: 'given' });
        k.circle(A, b);
        k.dot(A, { open: true, r: 0.7 });
        k.point(T, 'T', { at: 'ne', open: true });
        k.point(N, 'N', { at: 'w', open: true });
        k.dim(T, A, 'b', { side: 'right', dist: 1.1 });
        k.dim(A, N, 'b', { side: 'right', dist: 1.1 });
        k.angle(O, ex, T, { label: 't', r: 1.1, labelDist: 1.45 });
      });
      k.step('roll', 'P is the point of the rolling circle that touched the fixed circle at the cusp (a, 0): the arc TP equals the arc of the fixed circle from (a, 0) to T. Join T to P.', () => {
        k.seg(T, P, { cls: 'given' });
        k.point(P, 'P', { at: 'sw', open: true });
      });
      k.step('straightedge', 'T is the instantaneous centre of rotation of P, so TP is the normal and the tangent is the chord PN. The angle TNP of the rolling circle is a·t / 2b, and the tangent, drawn as far as the axis, makes the angle φ = π − (a − 2b)t / 2b with OX.', () => {
        k.seg(N, Q, { cls: 'given' });
        k.angle(N, P, T, { label: 'at/2b', r: 1.1, labelDist: 2.1, size: 0.7 });
        k.angle(Q, g.add(Q, ex), N, { label: 'φ', r: 1.5, labelDist: 1.35 });
        k.text(30, -52, 'φ = π − (a−2b) t / 2b', { anchor: 'start', size: 0.95 });
      });
      k.step('pencil', 'The hypocycloid: the path of P, with its cusp at (a, 0) on the fixed circle.', () => {
        k.curve(f, [-0.4, t + 0.1], { n: 120 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 79 — the double generation theorem. Fixed circle (O, a); T and E are the ends of the vertical
     diameter. Rolling circle (A', b) touches the fixed circle at T', with ∠TOT' = θ (central angle),
     and F is the other end of its diameter T'F. T, T' and P are in line (P is where the chord TT' meets
     the small circle again), and P is on the line FD, D on the axis TO with OD = OF. The circle on
     T, P, D has its centre A on the axis and radius a − b (hypocycloid) or a + b (epicycloid): it
     touches the fixed circle at T and passes through P. X is the cusp of the curve on the fixed circle,
     with arc T'X = bθ and arc TX = (a ∓ b)θ.
  --------------------------------------------------------------------------------------------- */
  function doubleGeneration(epi) {
    const letter = epi ? 'b' : 'a';
    Curves.figure({
      id: 'fig-079' + letter,
      section: 'epi-hypo-cycloids',
      page: 82,
      title: epi ? 'Double generation of the epicycloid: rolling circles of radii b and a + b' : 'Double generation of the hypocycloid: rolling circles of radii b and a − b',
      tags: ['double generation', epi ? 'epicycloid' : 'hypocycloid', 'roulette'],
      note: 'The book letters the angle at E and at D with θ. It is the angle at the circumference on the arc TT\', half the central angle TOT\' (called θ in the arcs aθ, bθ of the text); the proportions of the book are kept.',
      build(k) {
        const g = k.g;
        const a = epi ? 150 : 160, b = epi ? 53 : 45, th = g.deg(epi ? 108 : 123);
        const sg = epi ? 1 : -1;                                  // the rolling circle is outside (+) or inside (−)
        const e = x => k.pt(Math.sin(x), -Math.cos(x));
        const O = k.pt(0, 0), T = k.pt(0, -a), E = k.pt(0, a);
        const Tp = g.mul(e(th), a), Ap = g.mul(e(th), a + sg * b), F = g.mul(e(th), a + sg * 2 * b);
        const A = k.pt(0, sg * b), R2 = epi ? a + b : a - b;      // centre and radius of the second generating circle
        const Dpt = epi ? k.pt(0, a + 2 * b) : k.pt(0, a - 2 * b);
        const P = g.lineCircle(T, Tp, Ap, b).find(q => g.dist(q, Tp) > 1e-6);
        const angX = Math.atan2(Tp.y, Tp.x) + (epi ? 1 : -1) * b * th / a;
        const X = g.polar(O, a, angX);
        const hyp = (t) => { const q = k.curves.hypocycloid(a, b)(t), c = Math.cos(angX), s = Math.sin(angX); return [q[0] * c - q[1] * s, q[0] * s + q[1] * c]; };
        const epiC = (t) => { const q = k.curves.epicycloid(a, b)(t), x = q[0], y = -q[1], c = Math.cos(angX), s = Math.sin(angX); return [x * c - y * s, x * s + y * c]; };
        const curve = epi ? epiC : hyp;
        const sP = b * th / a;
        const mark = (V, p1, p2, o) => { const d = g.angle(p1, V, p2); return d >= 0 ? k.angle(V, p1, p2, o) : k.angle(V, p2, p1, o); };

        k.given('The fixed circle of radius a with centre O, and its vertical diameter ET through O. T is the lower end, where the larger generating circle will touch it.', () => {
          k.circle(O, a);
          const hs = epi ? [[104, 136], [200, 232], [-65, -23]] : [[105, 146], [190, 215], [-56, -23]];
          hs.forEach(h => k.arc(O, a, g.deg(h[0]), g.deg(h[1]), { cls: 'aux', hatch: 'in', nobounds: true }));
          k.seg(k.pt(0, -a - (epi ? 0 : 28)), k.pt(0, epi ? Dpt.y + 12 : a + 28), { cls: 'given' });
          k.point(O, 'O', { at: 'w', open: true });
          k.point(T, 'T', { at: epi ? 'w' : 'nw', open: true });
          k.point(E, 'E', { at: 'nw', open: true });
        });
        k.step('compass', 'Choose T\' on the fixed circle (the angle TOT\' is the angle the rolling has gone through) and draw the generating circle of radius b touching the fixed circle at T\', ' + (epi ? 'outside it' : 'inside it') + ': its centre A\' is on OT\'. Mark the other end F of the diameter T\'F, by carrying the line OT\' on.', () => {
          k.seg(O, epi ? F : Tp, { cls: 'given' });
          k.circle(Ap, b);
          k.point(Tp, 'T\'', { at: epi ? 'se' : 'ne', open: true });
          k.point(Ap, 'A\'', { at: epi ? 'sw' : 'n', open: true });
          k.point(F, 'F', { at: epi ? 'ne' : 'sw', open: true });
        });
        k.step('straightedge', 'Join T to T\'. The chord cuts the small circle again at P, the tracing point: the angle T\'PF is in a semicircle, so PF is perpendicular to TP.', () => {
          k.seg(T, epi ? P : Tp, { cls: 'given' });
          k.point(P, 'P', { at: epi ? 'ne' : 'e', open: true });
        });
        k.step('straightedge', 'Draw FP and carry it to meet the axis at D: OD = OF, so the triangle OFD is isosceles. Join E to T\': ET\' is parallel to DP, and DE = 2b.', () => {
          k.seg(Dpt, epi ? F : P, { cls: 'given' });
          k.seg(E, Tp, { cls: 'given' });
          k.point(Dpt, 'D', { at: epi ? 'nw' : 'nw', open: true });
          mark(Dpt, O, P, { label: 'θ', r: 1.1, labelDist: 1.6 });
          mark(E, O, Tp, { label: 'θ', r: 1.1, labelDist: 1.6 });
          mark(F, epi ? P : Dpt, epi ? Ap : O, { r: 0.9 });
          if (!epi) mark(Tp, E, O, { r: 0.9 });
        });
        k.step('compass', 'The circle through T, P and D (the angle DPT is a right angle, so DT is its diameter) touches the fixed circle at T: it is the second generating circle, of radius ' + (epi ? 'a + b' : 'a − b') + ', with its centre A on the axis, b ' + (epi ? 'above' : 'below') + ' O.', () => {
          k.circle(A, R2, { cls: 'given' });
          k.point(A, 'A', { at: 'w', open: true });
        });
        k.step('dividers', 'Mark X on the fixed circle so that the arc T\'X is bθ (the arc of the small circle from T\' to P): X is the cusp, where the curve meets the fixed circle. Then arc TX = ' + (epi ? '(a + b)' : '(a − b)') + 'θ, the arc of the large circle from T to P: the same point P is obtained by both circles.', () => {
          k.point(X, 'X', { at: epi ? 's' : 'e', open: true });
        });
        k.step('pencil', 'The ' + (epi ? 'epicycloid' : 'hypocycloid') + ' near the cusp X, drawn through P: the same curve is generated by the circle of radius b and by the circle of radius ' + (epi ? 'a + b' : 'a − b') + '.', () => {
          k.curve(curve, [epi ? -0.3 : -0.4, sP], { n: 80 });
        });
      }
    });
  }
  doubleGeneration(false);
  doubleGeneration(true);
})();
