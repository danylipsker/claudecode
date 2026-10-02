/* Curves Workshop · figures/astroid.js — Fig. 2(a) and 2(b) (page 2)
 *
 * Fig. 1(a) and 1(b) are in _reference.js. Both panels show the astroid as an envelope:
 * (a) of a rod of constant length a sliding with its ends on two perpendicular axes
 *     (the trammel of Archimedes), (b) of ellipses whose semi-axes have the constant sum a.
 */

/* Fig. 2(a) — the envelope of a sliding rod. A segment of length a with one end on OX and the
   other on OY: its ends are (a cos θ, 0) and (0, a sin θ). The book draws about a dozen
   positions in every quadrant; the heavy curve touching all of them is the astroid. */
Curves.figure({
  id: 'fig-002a',
  section: 'astroid',
  page: 2,
  title: 'The astroid as the envelope of a sliding rod',
  tags: ['envelope', 'trammel', 'glissette'],
  note: 'The book draws the rod in about a dozen positions per quadrant, equally spaced in the angle θ; the axes run a little past the cusps.',
  build(k) {
    const g = k.g, a = 150, N = 12;
    const O = k.pt(0, 0);
    const th = i => i * (Math.PI / 2) / N;
    const A = (i, sx) => k.pt(sx * a * Math.cos(th(i)), 0);
    const B = (i, sy) => k.pt(0, sy * a * Math.sin(th(i)));

    k.given('The two perpendicular axes through O, and the length a of the rod.', () => {
      k.axes(O, { x: [-a * 1.2, a * 1.2], y: [-a * 1.2, a * 1.2], arrows: false, labels: false });
      k.point(O, '', { open: true, r: 0.9 });
    });
    // the first position, found with the compass
    const i1 = 4;
    const A1 = A(i1, 1);
    const B1 = g.lineCircle(O, k.pt(0, 1), A1, a).filter(p => p.y > 0)[0];
    k.step('compass', 'Mark a point A on OX. With the compass opened to a and the needle at A, cut the other axis OY at B: the segment AB has the length a.', () => {
      const a0 = g.angleOf(g.sub(B1, A1));
      k.arc(A1, a, a0 - 0.18, a0 + 0.18, { cls: 'cons' });
      k.dot(A1, { open: true, r: 0.8 });
      k.dot(B1, { open: true, r: 0.8 });
    });
    k.step('straightedge', 'Draw AB: the rod in its first position. It will touch the astroid at one point.', () => {
      k.seg(A1, B1, { cls: 'cons', stroke: '#2a2a2a' });
    });
    k.step('straightedge', 'Slide the rod: repeat with other points A, about a dozen in each quadrant (equal steps of the angle OAB make them evenly spread), and do the same in the other three quadrants. Every line is a segment of length a with one end on each axis.', () => {
      for (const sx of [1, -1]) for (const sy of [1, -1]) {
        for (let i = 1; i < N; i++) {
          if (sx === 1 && sy === 1 && i === i1) continue;
          k.seg(A(i, sx), B(i, sy), { cls: 'cons', stroke: '#2a2a2a' });
        }
      }
    });
    k.step('pencil', 'The astroid: the curve that touches every position of the rod. Its four cusps lie on the axes at distance a from O.', () => {
      k.curve(k.curves.astroid(a), [0, k.TAU], { n: 360 });
    });
  }
});

/* Fig. 2(b) — the envelope of ellipses. The ellipse with semi-axes p (along OX) and q = a − p
   (along OY): the sum of the semi-axes is the constant a, and the family touches the astroid
   x^(2/3) + y^(2/3) = a^(2/3). The book draws five of them (the one with p = q is a circle). */
Curves.figure({
  id: 'fig-002b',
  section: 'astroid',
  page: 2,
  title: 'The astroid as the envelope of ellipses of constant axis sum',
  tags: ['envelope', 'ellipse'],
  note: 'Five ellipses, p = 0.3a, 0.4a, 0.5a, 0.6a, 0.7a: the first two are the others turned through 90°.',
  build(k) {
    const a = 150, ps = [0.3, 0.4, 0.5, 0.6, 0.7];
    const O = k.pt(0, 0);

    k.given('The axes through O, and the constant a, the sum of the two semi-axes of every ellipse.', () => {
      k.axes(O, { x: [-a * 1.2, a * 1.2], y: [-a * 1.2, a * 1.2], arrows: false, labels: false });
      k.point(O, '', { open: true, r: 0.9 });
    });
    k.step('ruler', 'For each ellipse choose a semi-axis p on OX and take q = a − p on OY (p + q = a). Mark the four vertices ±p on OX and ±q on OY.', () => {
      ps.forEach(f => {
        const p = f * a, q = a - p;
        [k.pt(p, 0), k.pt(-p, 0), k.pt(0, q), k.pt(0, -q)].forEach(v => k.dot(v, { r: 0.5 }));
      });
    });
    k.step('pencil', 'Through the four vertices of each pair draw the ellipse with its axes on OX and OY. Their sizes change by steps, from long and flat to tall and narrow.', () => {
      ps.forEach(f => k.ellipse(O, f * a, (1 - f) * a, { cls: 'given', width: 1.1 }));
    });
    k.step('pencil', 'The astroid touches every ellipse of the family: it is their envelope.', () => {
      k.curve(k.curves.astroid(a), [0, k.TAU], { n: 360 });
    });
  }
});
