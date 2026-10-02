/* Curves Workshop · figures/tractrix.js — Figs. 199–200 (pages 221–223)
 *
 * Fig. 199: the tractrix with the string AP of length a, the circle of radius a, and the
 *           construction of the centre of curvature C of P, which runs on the catenary.
 * Fig. 200: the family of positions of the string (tangents of constant length) and the
 *           solid of revolution (the pseudosphere) shaded as an engraver's section.
 */

/* Fig. 199, page 221 — the tractrix y' = y / ±sqrt(a² − y²) with asymptote the x-axis.
   The particle P is pulled by the string AP = a, whose end A runs along the x-axis. The book also draws
   the mirror image below the axis, the circle of radius a about O (through the cusps), the dashed
   catenary (the evolute: the centres of curvature lie on it) and the construction of the centre
   of curvature C of P: the tangent to the circle at L, the point of the circle at the height of P,
   cuts the y-axis at U with OU = a²/y; the normal CP at P meets the horizontal through U at C. */
Curves.figure({
  id: 'fig-199',
  section: 'tractrix',
  page: 221,
  title: 'The tractrix, its tangent AP = a, and the catenary as its evolute',
  tags: ['tangent', 'evolute', 'catenary', 'construction'],
  note: 'The book draws the whole figure with the tractrix and its mirror image in heavy line, the catenary dashed, and the lengths y and √(a² − y²) of the right triangle whose hypotenuse is the string.',
  build(k) {
    const g = k.g;
    const a = 200;
    const tr = k.curves.tractrix(a);
    const t0 = 0.94;                                       // the string makes the angle π/2 − t0 with the axis here
    const [px, py] = tr(t0);
    const O = k.pt(0, 0);
    const P = k.pt(px, py);
    const A = k.pt(px + a * Math.sin(t0), 0);              // AP = a
    const F = k.pt(px, 0);                                 // the foot of P on the asymptote
    const L = k.pt(-a * Math.sin(t0), py);                 // the point of the circle at the height of P (far side)
    const U = k.pt(0, a * a / py);                         // OU = a²/y, from the tangent at L
    const C = k.pt(A.x, a * a / py);                       // centre of curvature of P, a point of the catenary
    const top = a * a / py;
    const cusp1 = k.pt(0, a), cusp2 = k.pt(0, -a);
    k.fontScale(0.8);

    k.given('The asymptote: the x-axis, with the origin O and the y-axis. The length of the string is a.', () => {
      k.arrow(k.pt(-a * 2.4, 0), k.pt(a * 2.55, 0), { cls: 'axis' });
      k.label(k.pt(a * 2.55, 0), 'X', 'se', { cls: 'axis' });
      k.seg(k.pt(0, -a * 1.08), k.pt(0, top + 12), { cls: 'cons' });
      k.dot(O, { open: true, r: 0.8 });
    });
    k.step('compass', 'With the radius a draw the circle about O. It meets the y-axis at (0, a) and (0, −a): the cusps of the tractrix and of its mirror image.', () => {
      k.circle(O, a, { cls: 'given' });
      k.point(cusp1, '', { open: true, r: 0.8 });
      k.point(cusp2, '', { open: true, r: 0.8 });
      k.dim(k.pt(0, -a), O, 'a', { dist: 1.1 });
    });
    k.step('compass', 'Take P on the curve. With centre P and radius a cut the asymptote at A: AP is the tangent at P, and the string is the tangent segment of constant length a.', () => {
      const a0 = g.angleOf(g.sub(A, P));
      k.arc(P, a, a0 - 0.22, a0 + 0.18, { cls: 'cons' });
      k.point(P, 'P', { at: 'e', open: true, r: 0.8, lo: { dist: 1.1 } });
      k.pivot(A);
      k.label(A, 'A', 's', { dist: 1.5 });
    });
    k.step('straightedge', 'Join A to P (heavy). The foot F of P on the axis gives the right triangle PFA: PF = y and FA = √(a² − y²), because the hypotenuse AP = a. The tangent makes the angle φ with the axis at A.', () => {
      k.seg(A, P, { cls: 'thick' });
      k.seg(P, F, { cls: 'cons', dash: true });
      k.point(F, '', { open: true, r: 0.8 });
      k.label(g.mid(P, F), 'y', 'w', { dist: 0.9, upright: false });
      k.text(F.x + (A.x - F.x) * 0.47, 9, '√(a² − y²)', { size: 0.62, upright: true });
      k.label(g.mid(A, P), 'a', 'w', { dist: 1.2 });
      k.angle(A, k.pt(A.x + 60, 0), P, { label: 'φ', r: 0.9, labelDist: 1.3 });
      k.arrow(k.pt(A.x + 14, -14), k.pt(A.x + 58, -14), { cls: 'given' });
    });
    k.step('straightedge', 'The centre of curvature of P. Draw the horizontal through P to the circle at L, and the tangent to the circle at L (LU ⟂ OL) to cut the y-axis at U. In the right triangle OLU the leg OL = a is a mean proportional: OU · y = a², so U is at the height a²/y.', () => {
      k.seg(P, L, { cls: 'cons', dash: true });
      k.seg(O, L, { cls: 'cons' });
      k.right(L, O, U);
      k.seg(L, U, { cls: 'cons' });
      k.point(L, '', { open: true, r: 0.8 });
      k.point(U, '', { open: true, r: 0.8 });
    });
    k.step('straightedge', 'Draw the horizontal through U, and at P the normal to AP. They meet at C, the centre of curvature of the tractrix at P; C is at the height a²/y, above the abscissa of A.', () => {
      k.seg(U, C, { cls: 'cons' });
      k.seg(P, C, { cls: 'cons' });
      k.right(P, A, C, { r: 0.6 });
      k.point(C, '', { open: true, r: 0.8 });
    });
    k.step('pencil', 'The tractrix: the path of P as A runs along the axis (both branches meet at the cusp (0, a)), and its mirror image below the axis.', () => {
      const lim = 1.49;
      k.curve(tr, [-lim, lim], { n: 500 });
      k.curve(t => { const q = tr(t); return [q[0], -q[1]]; }, [-lim, lim], { n: 500 });
    });
    k.note('The evolute of the tractrix is the catenary y = a cosh(x/a) (dashed): C lies on it, so the tractrix is the involute of the catenary whose vertex is the cusp.', () => {
      const xm = a * Math.log(top / a + Math.sqrt(top * top / (a * a) - 1));       // abscissa of C
      k.curve(x => [x, a * Math.cosh(x / a)], [-xm, xm], { n: 200, cls: 'thick', dash: true });
    });
  }
});

/* Fig. 200, page 223 — as the book prints it, turned a quarter turn: the directrix ("axis") is the
   vertical line, the cusp of the tractrix is at the top right, a fan of strings of length a runs from
   points of the directrix to the curve. On the left the solid of revolution is cut: a hatched block
   with a hollow bounded by the mirror image of the tractrix, and the black band of the many
   tractrices of smaller a that the engraver used to shade the horn. */
Curves.figure({
  id: 'fig-200',
  section: 'tractrix',
  page: 223,
  title: 'The tractrix as the envelope of its strings; the pseudosphere in section',
  tags: ['envelope', 'pseudosphere', 'surface of revolution'],
  note: 'The book prints this drawing turned on its side. On the page the directrix is lettered "axis" or directrix, and the first two positions of the string end are lettered b and d.',
  build(k) {
    const g = k.g;
    const a = 200;
    // standard tractrix coordinates (x along the directrix from the cusp, y the distance from it) → drawing
    // coordinates: X = y (to the right), Y = −x (downwards)
    const trs = k.curves.tractrix(a);
    const book = t => { const q = trs(t); return [q[1], -q[0]]; };
    const bookA = (aa, t) => { const q = k.curves.tractrix(aa)(t); return [q[1], -q[0]]; };
    const gd = s => 2 * Math.atan(Math.tanh(s / 2));                       // the angle t of the string whose end is at s below the cusp
    const step = 0.11;                                                      // the string end moves by 0.11 a each time
    const nStr = 19;

    const topY = 0, ymax = -2.1 * a;
    const sectionBottom = -1.09 * a;                                        // the level of the hatched base of the hollow
    const blockBottom = -1.29 * a;
    const blockLeft = -1.3 * a;

    // depth (standard x) of a tractrix of parameter aa at the angle t
    const depth = (aa, t) => aa * (Math.log(1 / Math.cos(t) + Math.tan(t)) - Math.sin(t));
    const tAtDepth = (aa, d) => {                                           // t such that depth(aa, t) = d, by bisection
      let lo = 0, hi = 1.5700;
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (depth(aa, m) < d) lo = m; else hi = m; }
      return (lo + hi) / 2;
    };

    k.given('The directrix (the asymptote, drawn vertically) and the line through the cusp at right angles to it. The length of the string is a, the distance from the directrix to the cusp.', () => {
      k.seg(k.pt(0, ymax), k.pt(0, topY), { cls: 'given' });
      k.seg(k.pt(blockLeft, topY), k.pt(a * 1.04, topY), { cls: 'given' });
      k.point(k.pt(a, 0), '', { open: true, r: 0.6 });
      k.text(-a * 0.05, ymax * 0.87, 'directrix', { anchor: 'end', size: 0.8, upright: false });
      k.text(-a * 0.05, ymax * 0.77, '"axis" or', { anchor: 'end', size: 0.8, upright: false });
    });
    k.step('dividers', 'With the dividers step off equal distances along the directrix from the cusp level: the positions A1, A2, … of the end of the string.', () => {
      for (let i = 1; i <= nStr; i++) k.dot(k.pt(0, -i * step * a), { open: true, r: 0.45 });
      k.label(k.pt(0, -1 * step * a), 'b', 'ne', { dist: 0.7 });
      k.label(k.pt(0, -2 * step * a), 'd', 'ne', { dist: 0.7 });
    });
    k.step('linkage', 'At each position of A lay the string of length a on the particle: it is the line from A to the curve, and the particle stays on the string as A is drawn downwards. The strings are the tangents of the path.', () => {
      for (let i = 1; i <= nStr; i++) {
        const t = gd(i * step);
        const Pp = book(t);
        k.seg(k.pt(0, -i * step * a), k.pt(Pp[0], Pp[1]), { cls: 'cons' });
      }
    });
    k.step('pencil', 'The tractrix: the curve touched by all the strings. It starts at the cusp, at the distance a from the directrix, and runs into the directrix without reaching it.', () => {
      k.curve(book, [0, gd(nStr * step)], { n: 500 });
    });
    k.note('The solid of revolution. Hatch the block, hollowed by the mirror image of the tractrix, and shade the horn with the many tractrices of smaller a that share the directrix: this is the pseudosphere.', () => {
      // the mirror image of the tractrix (a) is the edge of the hollow
      const tEnd = tAtDepth(a, -sectionBottom);
      const edge = [];
      const nEdge = 120;
      for (let i = 0; i <= nEdge; i++) { const t = tEnd * i / nEdge; const q = book(t); edge.push(k.pt(-q[0], q[1])); }
      const poly = [k.pt(blockLeft, topY), k.pt(-a, 0)].concat(edge.slice(1), [k.pt(0, sectionBottom), k.pt(0, blockBottom), k.pt(blockLeft, blockBottom)]);
      k.hatch(poly, { angle: 1.1, gap: 0.55, outline: false });
      k.seg(k.pt(blockLeft, topY), k.pt(blockLeft, blockBottom), { cls: 'given' });
      k.seg(k.pt(blockLeft, blockBottom), k.pt(0, blockBottom), { cls: 'given' });
      k.seg(k.pt(0, sectionBottom), edge[edge.length - 1], { cls: 'given' });
      // the shading tractrices, nearest the edge the closest together
      const nS = 18;
      for (let j = 1; j <= nS; j++) {
        const w = j / nS;
        const aa = a * (0.16 + 0.84 * (1 - w * w));
        const te = tAtDepth(aa, -sectionBottom);
        k.curve(t => { const q = bookA(aa, t); return [-q[0], q[1]]; }, [0, te], { n: 120, cls: 'given', width: 1.5 + (1 - w) * 1.4 });
      }
      k.curve(t => { const q = book(t); return [-q[0], q[1]]; }, [0, tEnd], { n: 160, cls: 'given', width: 2.4 });
    });
  }
});
