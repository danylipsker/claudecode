/* Curves Workshop · figures/cycloid.js — Figs. 62–68 (pages 65–70)
 *
 * Fig. 62  (p. 65)  (a) the generating circle at one position, the tangent through N; (b) the point-by-point construction
 * Fig. 63  (p. 66)  the evolute of a cycloid is an equal cycloid
 * Fig. 64  (p. 67)  (a) the force on a particle held to a curve; (b) the tautochrone, two balls on a cycloidal arch
 * Fig. 65  (p. 68)  the cycloidal pendulum: a string unwrapping from two cycloidal cheeks
 * Fig. 66  (p. 68)  the brachistochrone: a layered medium and the broken path
 * Fig. 67  (p. 69)  the path at depth y: the angles α and θ
 * Fig. 68  (p. 70)  cycloidal teeth of a rack: face and flank
 */
(function () {
  const PI = Math.PI;

  /* ---------------------------------------------------------------------------------------------
     Fig. 62(a), page 65 — the cycloid OPN of a circle of radius a rolling on the line OH.
     The circle touches the line at H, N is the top of the circle (HN is a diameter), P the tracing
     point. H is the instantaneous centre of rotation, so PH is the normal, and since the angle HPN is
     in a semicircle PN is the tangent. Angle HCP = t, so the inscribed angles at N and at H are t/2.
     The tangent PN meets the line at the angle φ = (π − t)/2.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-062a',
    section: 'cycloid',
    page: 65,
    title: 'The cycloid: the generating circle at one position, with its tangent',
    tags: ['roulette', 'tangent', 'instantaneous centre'],
    note: 'The book draws the circle after it has rolled through t of about 73°. The tangent at P passes through the top N of the circle; its angle with OH is φ = (π − t)/2.',
    build(k) {
      const g = k.g, a = 100, t = g.deg(73);
      const O = k.pt(0, 0), H = k.pt(a * t, 0), C = k.pt(a * t, a), N = k.pt(a * t, 2 * a);
      const f = k.curves.cycloid(a), p = f(t), P = k.pt(p[0], p[1]);
      const Fv = g.lineLine(N, P, O, H);                       // where the tangent PN meets the line

      k.given('The straight line on which the circle rolls, with the starting point O (the cusp of the curve).', () => {
        k.seg(k.pt(-75, 0), k.pt(H.x + 130, 0), { cls: 'given' });
        k.point(O, 'O', { at: 's', open: true });
      });
      k.step('compass', 'Draw the generating circle of radius a, touching the line at H, where OH = a·t is the length of the arc the circle has rolled over. Its centre C is a above H; N is the top of the diameter HN.', () => {
        k.circle(C, a);
        k.seg(H, N, { cls: 'given' });
        k.dot(C, { open: true, r: 0.7 });
        k.point(H, 'H', { at: 's', open: true });
        k.point(N, 'N', { at: 'n', open: true });
      });
      k.step('roll', 'P is the point of the circle that was on the line at O. The arc HP of the circle is equal to OH, so the angle HCP is t. Draw the radius CP.', () => {
        k.seg(C, P, { cls: 'given' });
        k.point(P, 'P', { at: 'w', open: true });
        k.dim(C, P, 'a', { side: 'right', dist: 1.1 });
        k.angle(C, P, H, { label: 't', r: 0.9, labelDist: 1.2 });
      });
      k.step('straightedge', 'Join P to H and to N. H is the instantaneous centre of rotation of P, so PH is the normal; the angle HPN is in a semicircle, hence a right angle, so PN is the tangent at P. Produce it to meet the line.', () => {
        k.seg(P, H, { cls: 'given' });
        k.seg(g.along(Fv, N, -35), N, { cls: 'given' });
        k.point(P, null, { open: true });
      });
      k.note('The marked angles: HNP = t/2 and PHO = t/2 (angles of the same arc HP at the circumference), and the tangent leans at φ = (π − t)/2 to the line.', () => {
        k.angle(N, P, H, { label: 't/2', r: 1.2, labelDist: 1.7 });
        k.angle(H, P, k.pt(H.x - 1, 0), { label: 't/2', r: 1.5, labelDist: 1.45 });
        k.angle(Fv, k.pt(Fv.x + 1, 0), N, { label: 'φ', r: 1.5, labelDist: 1.25 });
      });
      k.step('pencil', 'The cycloid: the path of P from the cusp O. The little V at O is the cusp, where the curve leaves the line at right angles.', () => {
        k.curve(f, [-0.8, t], { n: 120 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 62(b), page 65 — the point-by-point construction of one half arch of the cycloid.
     OH = πa; the circle is drawn in its highest position, with diameter HN = 2a on the line x = πa; the
     semicircle NH and the line OH are divided into the same number n of parts (the book takes n = 4:
     points 1, 2, 3). Through the point i of the semicircle draw the horizontal and lay off to the left
     the length H–i of the base: P_i is a point of the arch. (The arc N–i is πa·i/n, the same as H–i.)
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-062b',
    section: 'cycloid',
    page: 65,
    title: 'Point-by-point construction of the cycloid',
    tags: ['construction', 'dividers', 'compass', 'roulette'],
    note: 'The book divides the semicircle into four parts; the more parts, the smoother the curve.',
    build(k) {
      const g = k.g, a = 100, n = 4, L = PI * a;
      const O = k.pt(0, 0), H = k.pt(L, 0), N = k.pt(L, 2 * a), C = k.pt(L, a);
      const Q = i => g.polar(C, a, PI / 2 + i * PI / n);               // i-th point of the semicircle, 0 = N, n = H
      const B = i => k.pt(L - i * L / n, 0);                           // i-th point of the base, counted from H
      const Pc = i => k.pt(Q(i).x - i * L / n, Q(i).y);                // the point P_i of the cycloid
      const idx = [1, 2, 3];

      k.given('The base line with the starting point O and the point H, where OH = πa is the half circumference of the generating circle of radius a.', () => {
        k.seg(k.pt(-70, 0), k.pt(L + 30, 0), { cls: 'given' });
        k.point(O, 'O', { at: 's', open: true });
        k.point(H, 'H', { at: 's', open: true });
      });
      k.step('square', 'At H raise the perpendicular HN = 2a, the diameter of the generating circle in its highest position.', () => {
        k.seg(H, N, { cls: 'given' });
        k.point(N, 'N', { at: 'n', open: true });
      });
      k.step('compass', 'About the middle C of HN draw the semicircle NH on the side of O, with radius a.', () => {
        k.arc(C, a, PI / 2, 3 * PI / 2, { cls: 'given' });
      });
      k.step('dividers', 'Divide the semicircle NH into equal parts (four here): the division points 1, 2, 3, counted from N. Join them to the centre C.', () => {
        idx.forEach(i => { k.seg(C, Q(i), { cls: 'cons' }); k.point(Q(i), String(i), { at: 'ne', open: true, lo: { upright: true, size: 0.8 } }); });
      });
      k.step('dividers', 'Divide the base OH into the same number of equal parts and number the points 1, 2, 3 from H towards O.', () => {
        idx.forEach(i => k.point(B(i), String(i), { at: 's', open: true, lo: { upright: true, size: 0.8 } }));
      });
      k.step('square', 'Through the points 1, 2, 3 of the semicircle draw the horizontals, running to the left.', () => {
        idx.forEach(i => k.seg(Q(i), k.pt(i === 3 ? Pc(i).x + 34 : Pc(i).x, Q(i).y), { cls: 'given' }));
      });
      k.step('compass', 'Open the compass to H1 (the distance from H to the point 1 of the base) and strike an arc about the point 1 of the semicircle: it cuts the horizontal at P1. Likewise 2P2 = H2 and 3P3 = H3.', () => {
        idx.forEach(i => {
          const r = i * L / n, w = 16 / r;
          k.arc(Q(i), r, PI - w, PI + w, { cls: 'cons' });
          k.point(Pc(i), 'P_' + i, { at: i === 3 ? 'e' : 'nw', open: true });
        });
      });
      k.step('pencil', 'Draw the curve through O, P3, P2, P1 and N with a French curve: half an arch of the cycloid, with its top at N. The mirror image gives the other half.', () => {
        k.curve(k.curves.cycloid(a), [-0.8, PI], { n: 160 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 63, page 66 — the evolute of a cycloid is an equal cycloid. P' is the reflection of P in the
     tangent H of the circle's line; PP' = 2·PH = R is the radius of curvature, so P' is the centre of
     curvature. The reflected circle rolls along the line through O' and P' traces the evolute, a cycloid
     with the cusp below the top N of the arch.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-063',
    section: 'cycloid',
    page: 66,
    title: 'The evolute of a cycloid is an equal cycloid',
    tags: ['evolute', 'roulette', 'radius of curvature'],
    note: 'The book places the generating circle after a rolling of about 83°; here t = 1.45 rad.',
    build(k) {
      const g = k.g, a = 100, L = PI * a, t = 1.45;
      const f = k.curves.cycloid(a), p = f(t);
      const P = k.pt(p[0], p[1]), H = k.pt(a * t, 0);
      const C1 = k.pt(a * t, a), C2 = k.pt(a * t, -a);
      const P2 = k.pt(2 * H.x - P.x, -P.y);                         // P', the reflection of P in H
      const O = k.pt(0, 0), O2 = k.pt(0, -2 * a);
      const evo = s => [a * (s + Math.sin(s)), -a * (1 - Math.cos(s))];   // the evolute, from O to the cusp below N

      k.given('The arch of the cycloid from the cusp O to its top N, and the generating circle in the position where it touches the line through O at H, carrying P.', () => {
        k.seg(O, k.pt(345, 0), { cls: 'given' });
        k.seg(k.pt(0, -2 * a), k.pt(0, 217), { cls: 'given' });
        k.seg(k.pt(L, -2 * a), k.pt(L, 212), { cls: 'given' });
        k.circle(C1, a);
        k.seg(P, k.pt(2 * C1.x - P.x, 2 * C1.y - P.y), { cls: 'given' });
        k.seg(k.pt(H.x, -2 * a), k.pt(H.x, 2 * a), { cls: 'given' });
        k.curve(f, [-0.7, PI], { n: 160, cls: 'thick' });
        k.point(P, 'P', { at: 'nw', open: true });
        k.point(H, 'H', { at: 'ne', open: true });
        k.point(O, 'O', { at: 'se', open: true });
        k.arrow(k.pt(215, 9), k.pt(263, 9), { cls: 'given' });
        k.text(L - 17, a, '2a', { upright: true, size: 0.85 });
      });
      k.step('compass', 'Reflect the circle in the line: draw the circle of the same radius a on the other side, touching the line at H too, and the line through O\' that it rolls along, 2a below. The reflected circle carries the point P\' that belongs to P.', () => {
        k.seg(k.pt(0, -2 * a), k.pt(345, -2 * a), { cls: 'given' });
        k.circle(C2, a);
        k.seg(P2, k.pt(2 * C2.x - P2.x, 2 * C2.y - P2.y), { cls: 'given' });
        k.point(O2, 'O\'', { at: 'ne', open: true });
        k.arrow(k.pt(202, -194), k.pt(250, -194), { cls: 'given' });
        k.text(L - 17, -a, '2a', { upright: true, size: 0.85 });
      });
      k.step('straightedge', 'Join P to H and carry the line on beyond H by the same length: it ends at P\'. PP\' is the normal at P, and PP\' = 2·PH = R, the radius of curvature, so P\' is the centre of curvature of the arch at P.', () => {
        k.seg(P, P2, { cls: 'given' });
        k.point(P2, 'P\'', { at: 'e', open: true });
      });
      k.step('pencil', 'As the lower circle rolls along its line, P\' draws the evolute of the arch: a cycloid equal to the first, starting at O with a horizontal tangent and ending in the cusp below N. Each curve is thus the evolute of the other.', () => {
        k.curve(evo, [0, PI + 1.1], { n: 180 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 64(a), page 67 — a particle P held to a curve s = f(φ) under gravity: the weight −mg is resolved
     into a component m·s̈ along the tangent (tangent at the angle φ to the horizontal) and a component
     along the normal; m s̈ = −mg sin φ. Drawn in the book's own proportions (units: the printed size).
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-064a',
    section: 'cycloid',
    page: 67,
    title: 'A particle on a curve under gravity: the force along the tangent',
    tags: ['tautochrone', 'forces'],
    note: 'The curve s = f(φ) is a sketch in the book (a circular arc here); only the tangent at P matters.',
    build(k) {
      const g = k.g, phi = g.deg(51.5);
      const P = k.pt(0, 0), td = g.dir(phi), nd = g.dir(phi - PI / 2);
      const W = 285;                                           // length of the weight arrow
      const tipG = k.pt(0, -W), tipT = g.add(P, g.mul(g.mul(td, -1), W * Math.sin(phi))), tipN = g.add(P, g.mul(nd, W * Math.cos(phi)));
      const gy = -470;                                         // the horizontal ground line
      const Fg = k.pt(gy / Math.tan(phi), gy);
      const rho = 720, Cc = g.add(P, g.mul(g.perp(td), rho));  // centre of the arc, on the left of the tangent

      k.given('The curve of restraint s = f(φ), the particle P on it, and a horizontal line to measure angles from.', () => {
        k.arc(Cc, rho, phi - PI / 2 - g.deg(37), phi - PI / 2 + g.deg(33), { cls: 'thick' });
        k.seg(k.pt(-510, gy), k.pt(545, gy), { cls: 'given' });
        k.point(P, 'P', { at: 'nw', open: true });
        k.text(-258, -20, 's = f(φ)', { upright: true, size: 0.85 });
      });
      k.step('straightedge', 'Draw the tangent at P. It rises at the angle φ to the horizontal.', () => {
        k.seg(g.along(Fg, P, -45), g.add(P, g.mul(td, 270)), { cls: 'given' });
        k.angle(Fg, k.pt(Fg.x + 1, gy), P, { label: 'φ', r: 1.9, labelDist: 1.25 });
      });
      k.step('ruler', 'From P draw the weight −mg straight down (the particle falls under gravity).', () => {
        k.arrow(P, tipG);
        k.text(tipG.x, tipG.y - 38, '−m g', { upright: true, size: 0.85 });
      });
      k.step('straightedge', 'Resolve the weight into a component along the tangent, m s̈ = mg sin φ, and a component along the normal, mg cos φ: complete the rectangle with the dashed and the thin line.', () => {
        k.arrow(P, tipT);
        k.arrow(P, tipN);
        k.seg(tipT, tipG, { cls: 'cons', dash: true });
        k.seg(tipG, tipN, { cls: 'cons' });
        k.text(-214, -238, 'm', { upright: true, size: 0.85 });
        k.text(-163, -238, 's', { upright: true, size: 0.85 });
        k.dot(k.pt(-168, -225), { r: 0.32 });
        k.dot(k.pt(-158, -225), { r: 0.32 });
      });
      k.note('The angle between the weight and the normal component is also φ, which is why the tangential force is mg sin φ.', () => {
        k.angle(P, g.add(P, k.pt(0, -1)), g.add(P, nd), { label: 'φ', r: 2.4, labelDist: 1.6 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 64(b), page 67 — two balls released at different heights on a cycloidal arch with the cusps
     up reach the lowest point (marked by the tick) at the same instant.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-064b',
    section: 'cycloid',
    page: 67,
    title: 'The tautochrone: two balls on a cycloidal arch',
    tags: ['tautochrone', 'roulette'],
    build(k) {
      const g = k.g, a = 100;
      const f = t => [a * (t - Math.sin(t)), -a * (1 - Math.cos(t))];      // an arch with its cusps uppermost
      const at = t => { const p = f(t); return k.pt(p[0], p[1]); };
      const t1 = 1.1, t2 = 3.94, Pb = at(PI);

      k.given('A cycloidal arch with its cusps upwards: the curve of restraint. The small V at each end shows the cusp, where the next arch begins.', () => {
        k.curve(f, [-1.0, 2 * PI + 1.0], { n: 240, cls: 'thick' });
        k.tick(Pb, k.pt(1, 0), { size: 1.7 });
      });
      k.step('note', 'Two balls of the same mass are let go from different heights on the arch. Each is pulled along the tangent by the component of its weight and runs down towards the lowest point.', () => {
        [t1, t2].forEach(t => k.dot(at(t), { r: 2.4 }));
        const fr1 = g.frenet(f, t1), p1 = at(t1), o1 = g.mul(fr1.N, 9);
        k.arrow(g.add(g.add(p1, o1), g.mul(fr1.T, 18)), g.add(g.add(p1, o1), g.mul(fr1.T, 58)), { cls: 'given' });
        const fr2 = g.frenet(f, t2), p2 = at(t2), o2 = g.mul(fr2.N, 9);
        k.arrow(g.add(g.add(p2, o2), g.mul(fr2.T, -18)), g.add(g.add(p2, o2), g.mul(fr2.T, -62)), { cls: 'given' });
      });
      k.note('Because the arch is a cycloid, the force along the curve is proportional to the arc s measured from the lowest point (m s̈ = −k²s), so the motion is harmonic and the time to reach the lowest point does not depend on where the ball starts.', () => {
        k.label(Pb, 'lowest point', 'n', { dist: 3.2, size: 0.8, upright: true });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 65, page 68 — the cycloidal pendulum. A string of length 4a is fixed at the cusp O of two
     cycloidal cheeks (half arches of a cycloid of radius a). Wrapped on a cheek and unwrapped, it
     carries the bob along the involute of the cheek, which is a cycloid equal to it. Coordinates: the
     cusp level of the bob's path is y = 0; the bob's lowest point is (πa, −2a); O is (πa, 2a).
     The 15 positions are equal steps of the arc of the bob's path (the string gets 4a/7 longer
     each time).
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-065',
    section: 'cycloid',
    page: 68,
    title: 'The cycloidal pendulum',
    tags: ['evolute', 'involute', 'pendulum'],
    note: 'The bob\'s path is the involute of the cheeks and an equal cycloid; its period is the same for every amplitude.',
    build(k) {
      const g = k.g, a = 100, L = PI * a;
      const O = k.pt(L, 2 * a);
      const cheek = s => [a * (s + Math.sin(s)), a * (1 - Math.cos(s))];      // the cheeks: cycloid with its cusp at O (s = π)
      const bob = s => [a * (s - Math.sin(s)), -a * (1 - Math.cos(s))];       // the bob's path: an equal cycloid
      const ts = []; for (let i = 0; i <= 14; i++) ts.push(2 * Math.acos(1 - i / 7));
      ts[14] = 2 * PI;

      k.given('The two cheeks: halves of a cycloidal arch of radius a that meet in a cusp at O, and end 2a below it. Draw the line through the ends of the cheeks and the line touching the bob\'s path from below.', () => {
        k.seg(k.pt(-120, 0), k.pt(2 * L + 120, 0), { cls: 'given' });
        k.seg(k.pt(-175, -2 * a), k.pt(2 * L + 175, -2 * a), { cls: 'given' });
        k.seg(O, k.pt(O.x, O.y + 1.35 * a), { cls: 'given' });
        k.curve(cheek, [0, 2 * PI], { n: 200, cls: 'thick' });
        k.point(O, 'O', { at: 'e', open: true });
      });
      k.step('linkage', 'A string of length 4a is tied at O and laid along one cheek. Unwind it: the part already free is straight and touches the cheek where it leaves it. Draw these straight pieces for the successive positions.', () => {
        for (let i = 1; i <= 13; i++) {
          const T = cheek(ts[i]), B = bob(ts[i]);
          k.seg(k.pt(T[0], T[1]), k.pt(B[0], B[1]), { cls: 'given', width: 1.2 });
        }
      });
      k.step('dividers', 'The end of the string, the bob, is at a distance 4a from O along the string. Step off the positions with the dividers at equal arcs of the path (fourteen equal parts here): they are the black dots.', () => {
        ts.forEach(t => { const B = bob(t); k.dot(k.pt(B[0], B[1]), { r: 1.35 }); });
      });
      k.step('pencil', 'The path of the bob is a cycloid equal to the cheeks, with its cusps at the ends of the cheeks and its lowest point 4a below O: the pendulum swings along a cycloid.', () => {
        k.curve(bob, [0, 2 * PI], { n: 240 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 66, page 68 — the brachistochrone. The medium is cut into layers of equal depth h; the speed in
     the i-th layer is v_i = sqrt(2·g·i·h) (that at the depth of its lower face). The law of refraction
     sin α_1 / v_1 = sin α_2 / v_2 = … gives the broken path P0 P1 P2 P3 P4, α_i being the angle between
     the path and the vertical in the i-th layer.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-066',
    section: 'cycloid',
    page: 68,
    title: 'The brachistochrone: refraction through layers',
    tags: ['brachistochrone', 'refraction'],
    note: 'Here sin α_i = 0.45·√i, so sin² α_i grows in the proportion 1 : 2 : 3 : 4, as the speeds √(2gh), √(4gh), √(6gh) … require.',
    build(k) {
      const g = k.g, h = 100, nL = 4;
      const c = Math.sin(g.deg(27));
      const alpha = []; for (let i = 1; i <= nL; i++) alpha.push(Math.asin(c * Math.sqrt(i)));
      const P = [k.pt(330, 0)];
      for (let i = 1; i <= nL; i++) P.push(k.pt(P[i - 1].x - h * Math.tan(alpha[i - 1]), -i * h));
      const x0 = P[nL].x - 190, x1 = P[0].x + 90;

      k.given('Five horizontal lines at equal distances h: the layers of the medium. The particle starts at P0 on the top line and must reach the bottom line in the shortest time.', () => {
        for (let i = 0; i <= nL; i++) k.seg(k.pt(x0, -i * h), k.pt(i === 0 || i === nL ? x1 + 20 : x1, -i * h), { cls: 'given' });
        k.point(P[0], 'P_0', { at: 'ne', open: true });
        for (let i = 0; i < nL; i++) {
          k.seg(k.pt(x0 + 12, -i * h - 5), k.pt(x0 + 12, -(i + 1) * h + 5), { cls: 'given', arrow: 'both', headSize: 0.7 });
          k.text(x0 + 30, -i * h - h / 2, 'h', { upright: true, size: 0.85 });
        }
        k.seg(k.pt(x1, -4), k.pt(x1, -nL * h + 4), { cls: 'given', arrow: 'both', headSize: 0.7 });
        k.text(x1 + 16, -nL * h / 2, 'y', { upright: true, size: 0.85 });
      });
      for (let i = 1; i <= nL; i++) {
        const A = P[i - 1], B = P[i];
        k.step('protractor', 'Layer ' + i + ': from P' + (i - 1) + ' lay off the angle α' + i + ' with the vertical, where sin α' + i + ' is proportional to √' + (2 * i) + ' (the speed there is √(' + (2 * i) + 'gh)); the line meets the next line at P' + i + '.', () => {
          k.seg(A, B, { cls: 'curve' });
          k.seg(k.pt(B.x, B.y - 0.5 * h), k.pt(B.x, B.y + 0.45 * h), { cls: 'given' });
          k.point(B, i <= 2 ? 'P_' + i : null, { at: 'se', open: true });
          k.angle(B, A, k.pt(B.x, B.y + 1), { label: 'α_' + i, r: 1.5, labelDist: 1.45 });
        });
      }
      k.note('As the layers get thinner (h → 0) the broken line becomes the curve of quickest descent: sin α = k·√y, which is the cycloid.');
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 67, page 69 — the path at the depth y below the top line: the tangent at P makes the angle α with
     the vertical and θ with the horizontal; cos θ = sin α = k·√y is the equation of the curve of descent.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-067',
    section: 'cycloid',
    page: 69,
    title: 'The limit of the layers: the angles α and θ at the depth y',
    tags: ['brachistochrone'],
    note: 'On the page this little drawing stands beside the paragraph on the helix, but it belongs to the brachistochrone: it shows the angles of the limiting curve at the depth y.',
    build(k) {
      const g = k.g, th = g.deg(29.5);
      const x0 = -430, x1 = 480, yTop = 0, yBot = -472;
      const P = k.pt(0, -290);
      const F = k.pt(P.x - (P.y - yBot) / Math.tan(th), yBot);       // where the path meets the lower line

      k.given('Two horizontal lines. On the upper line the particle starts; P is at the depth y below it, on the vertical through P.', () => {
        k.seg(k.pt(x0, yTop), k.pt(x1, yTop), { cls: 'given' });
        k.seg(k.pt(x0 - 20, yBot), k.pt(x1 - 30, yBot), { cls: 'given' });
        k.seg(k.pt(P.x, yTop), P, { cls: 'given' });
        k.point(P, 'P', { at: 'se', open: true });
        k.text(P.x - 38, -150, 'y', { size: 0.9 });
      });
      k.step('protractor', 'Draw the path through P, making the angle θ with the horizontal; it is the tangent of the curve at P.', () => {
        k.seg(g.along(F, P, -35), g.add(P, g.mul(g.dir(th), 330)), { cls: 'curve' });
        k.angle(F, k.pt(F.x + 1, yBot), P, { label: 'θ', r: 2.6, labelDist: 1.3 });
      });
      k.note('At P the path makes the angle α = 90° − θ with the vertical. The law of refraction becomes sin α = k·√y, that is cos θ = k·√y.', () => {
        k.angle(P, g.add(P, g.dir(th)), k.pt(P.x, P.y + 1), { label: 'α', r: 2.6, labelDist: 1.5 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 68, page 70 — cycloidal teeth of a rack. The pitch line is the straight line on which two
     generating circles of radius a roll, one below it and one above. A point of the lower circle draws
     the arch below the line (the flank of the tooth), a point of the upper circle the arch above (the
     face); the two arches meet on the pitch line, with a vertical tangent, in an S-shaped profile.
     Units: a = 97 (the printed size); the pitch line is y = 0; the left cusp is the origin.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-068',
    section: 'cycloid',
    page: 70,
    title: 'Cycloidal teeth of a rack: face and flank',
    tags: ['gear', 'rack', 'roulette'],
    note: 'The generating circles have the same radius for face and flank, a choice the book shows; real gears may use two different circles.',
    build(k) {
      const g = k.g, a = 97, hL = 1.05 * a;
      const pitch = 2 * PI * a;                                   // the lower arch ends on the pitch line here
      const tH = Math.acos(1 - hL / a);                            // the lands are reached at this parameter
      const lower = t => [a * (t - Math.sin(t)), -a * (1 - Math.cos(t))];
      const upper = t => [pitch + a * (t - Math.sin(t)), a * (1 - Math.cos(t))];
      const S = (c, rising, n) => {                                // an S-shaped flank through the pitch point c
        const pts = [];
        for (let i = 0; i <= n; i++) {
          const t = -tH + 2 * tH * i / n, s = Math.sign(t), u = Math.abs(t);
          const dx = a * (u - Math.sin(u)) * s, dy = a * (1 - Math.cos(u)) * s;
          pts.push(k.pt(c + (rising ? dx : -dx), dy));
        }
        return rising ? pts : pts.reverse();
      };
      const xl = 95, xr = 868;
      const prof = [];
      const addS = (c, rising) => { prof.push(...S(c, rising, 40)); };
      const first = pitch - 408;
      prof.push(k.pt(xl, -hL));
      addS(first, true); addS(first + 204, false); addS(first + 408, true); addS(first + 612, false);
      const cut = prof.filter(p => p.x <= xr);                     // cut the right edge through the last flank
      const edgeY = cut[cut.length - 1].y;
      const zig = (x, y0, y1, dir) => {                            // a zigzag break line
        const pts = [], m = 12; for (let i = 0; i <= m; i++) pts.push(k.pt(x + (i % 2 ? 6 : -2), y0 + (y1 - y0) * i / m));
        return dir > 0 ? pts : pts.slice().reverse();
      };
      const bottom = -266;
      const body = cut.concat(zig(xr, edgeY, bottom, 1), zig(xl, bottom, -hL, 1));
      const Lc = k.pt(460, -a), Uc = k.pt(pitch + 160, a);          // centres of the two rolling circles
      
      k.given('The pitch line of the rack: the straight line on which the generating circles roll. The lower arch will start on it at O (left) and come back to it one circumference later.', () => {
        k.seg(k.pt(-25, 0), k.pt(985, 0), { cls: 'given' });
      });
      k.step('compass', 'Draw the two generating circles, of equal radius a, touching the pitch line: one below it, one above it.', () => {
        k.circle(Lc, a, { width: 1.1 });
        k.circle(Uc, a, { width: 1.1 });
        k.arc(Uc, a + 24, g.deg(138), g.deg(98), { cls: 'given', cw: true, arrow: true, nobounds: true });
      });
      k.step('pencil', 'A point of the lower circle, rolling along the line from O, draws the arch under the line (the flank of the tooth); a point of the upper circle draws the arch above the line (the face). The two meet on the pitch line in one smooth S-shaped curve.', () => {
        k.curve(lower, [-0.6, 2 * PI], { n: 220 });
        k.curve(upper, [0, 2.8], { n: 100 });
      });
      k.note('Cut the teeth with the root line below and the top line above: the hatched rack has teeth made of these cycloid arcs. The part below the pitch line is the flank, the part above the face.', () => {
        k.hatch(body, { angle: 0.95, gap: 1.6, outline: false });
        k.poly(body, { close: true, cls: 'thick' });
        k.text(305, 150, 'face', { upright: true, size: 0.85 });
        k.text(128, 55, 'flank', { upright: true, size: 0.85 });
        k.curve(t => { const u = t; return [233 - 12 * Math.sin(u * PI / 2) , 129 - 60 * u - 6 * Math.sin(u * PI)]; }, [0, 1], { n: 12, cls: 'given', arrow: 1, nobounds: true });
        k.curve(t => [380 + 14 * Math.sin(t * PI / 2), 118 - 52 * t], [0, 1], { n: 12, cls: 'given', arrow: 1, nobounds: true });
        k.curve(t => [115 + 48 * t, 32 - 82 * t + 25 * Math.sin(t * PI)], [0, 1], { n: 12, cls: 'given', arrow: 1, nobounds: true });
      });
    }
  });
})();
