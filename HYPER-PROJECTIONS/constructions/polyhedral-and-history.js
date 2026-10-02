/* HYPER-PROJECTIONS · constructions/polyhedral-and-history.js
 *
 * Constructions for the topic "Polyhedral maps and the history of mapping".
 *
 *   hp-icosahedral-face   the gnomonic projection of one icosahedral face: meridians as straight lines from the pole
 *   hp-icosahedron-net    the net of the icosahedron (20 triangles) laid out with the T-square and the 60° set square
 *   hp-cahill-octant      one octant of the globe on an equilateral triangle, then the net of eight
 *   hp-cube-net           the Earth on a cube: one side face by tangents, the polar face by circles, the cross of six
 *   hp-eratosthenes       the measurement of the Earth: the well at Syene, the shadow at Alexandria, 1/50 of a circle
 *   hp-ptolemy-first      Ptolemy's first projection (an equidistant cone, true along the parallel of Rhodes)
 *   hp-ptolemy-second     Ptolemy's second projection (curved meridians through three points)
 *   hp-portolan-rhumbs    a portolan rhumb network: sixteen winds from a compass rose, two roses and the net between
 *   hp-mercator-secants   Mercator's parallels by adding secants with the dividers
 *   hp-lambert-four       four of Lambert's projections of 1772 side by side
 *   hp-triangulation      a survey triangulation net from one measured baseline
 *   hp-utm-zones          the layout of the UTM zones and bands, with the zone of Israel
 *
 * Every point is computed (k.g and the projection engine), never guessed; the figures are checked against
 * kit.proj.maps in HYPER-CORE/tools/test-projection.js and in the scratch tests that accompanied this file.
 * Step texts are instructions to the person drawing, in plain text.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, TAU = 2 * Math.PI, SQ3 = Math.sqrt(3);
  const f1 = (x, d) => (Math.round(x * Math.pow(10, d == null ? 1 : d)) / Math.pow(10, d == null ? 1 : d)).toFixed(d == null ? 1 : d);

  /* the gnomonic image of a sphere point on one face of a polyhedral map definition (net coordinates) */
  function faceProject(P, F, lon, lat) {
    const v = P.sph.toVec(lon * D2R, lat * D2R), d = P.dot(v, F.n);
    return F.map(P.dot(v, F.e1) / d, P.dot(v, F.e2) / d);
  }
  /* the shorter arc of the circle about o from p to q (arc3 runs counter-clockwise) */
  function shortArc(k, o, p, q, opts) {
    const g = k.g; let t = g.angleOf(g.sub(q, o)) - g.angleOf(g.sub(p, o));
    while (t < 0) t += TAU; while (t >= TAU) t -= TAU;
    return t > Math.PI ? k.arc3(o, q, p, opts) : k.arc3(o, p, q, opts);
  }
  /* an angle mark at v between the rays to p and q, drawn the short way round (k.angle runs counter-clockwise from p to q) */
  function ang(k, v, p, q, opts) {
    const g = k.g; let t = g.angleOf(g.sub(q, v)) - g.angleOf(g.sub(p, v));
    while (t < 0) t += TAU; while (t >= TAU) t -= TAU;
    return t > Math.PI ? k.angle(v, q, p, opts) : k.angle(v, p, q, opts);
  }
  /* an evenly spaced list */
  const range = (a, b, step) => { const out = []; for (let x = a; x <= b + 1e-9; x += step) out.push(Math.round(x * 1e9) / 1e9); return out; };

  /* ================================================================== the icosahedral face */
  Hyper.construction({
    id: 'hp-icosahedral-face',
    title: 'The gnomonic projection of one icosahedral face',
    tags: ['polyhedral', 'icosahedron', 'gnomonic', 'compass', 'ruler'],
    note: 'The face is the polar triangle of the icosahedron whose vertices are the pole N and the two points U₀ and U₁ on the parallel of 26.57° N at longitudes 0° and 72°. Every meridian is a great circle, so it is a *straight line* from N; the parallels are ellipses. The fractions in the tables come from the central projection itself (they are computed with the same engine as the Map lab), so the points fall exactly on the curves of the Map lab\'s icosahedron. The engine\'s icosahedron has a vertex at the pole; Fuller\'s Dymaxion map turns the solid so that no vertex lies in the middle of a continent.',
    build(k) {
      const g = k.g, P = k.proj, M = P.maps, def = M.defs.icosahedron, F = def.faces[0];
      const h = SQ3 / 2, E = 360;                                   // E: the edge of the face on paper, in drawing units
      const paper = net => k.pt((net[0] - 0.5) * E, (net[1] - h) * E);
      const N = paper(F.net[0]), U0 = paper(F.net[1]), U1 = paper(F.net[2]);
      const upLat = Math.atan(0.5);                                 // latitude of U0, U1 (radians)
      const u0 = [Math.cos(upLat), 0, Math.sin(upLat)], u1 = [Math.cos(upLat) * Math.cos(72 * D2R), Math.cos(upLat) * Math.sin(72 * D2R), Math.sin(upLat)];
      const lams = [0, 12, 24, 36, 48, 60, 72], phis = [75, 60, 45];
      // where the meridian of longitude λ meets the base U0U1: a fraction t of the way along (the base is a chord of the sphere)
      const tOf = lam => { if (lam <= 0) return 0; if (lam >= 72) return 1; const T = Math.tan(lam * D2R); return T / (Math.sin(72 * D2R) + T * (1 - Math.cos(72 * D2R))); };
      const edge3 = lam => { const t = tOf(lam); return [0, 1, 2].map(i => (1 - t) * u0[i] + t * u1[i]); };
      const base = lam => g.lerp(U0, U1, tOf(lam));
      // along the meridian from N to the base point, the fraction s at which the parallel φ crosses it
      const sOf = (lam, phi) => { const e = edge3(lam); return 1 / (1 - e[2] + Math.tan(phi * D2R) * Math.hypot(e[0], e[1])); };
      const mark = (lam, phi) => g.lerp(N, base(lam), sOf(lam, phi));

      k.given('The edge e of the face (the sphere of radius R is inscribed in an icosahedron of edge 1.3231 R, so that e = 360 units means R ≈ 272), and the pole N: the face is the triangle N U₀ U₁ of the globe\'s northern cap, with U₀ and U₁ on the parallel of 26.57° N at longitudes 0° and 72°.', () => {
        k.seg(U0, U1, { cls: 'given' }); k.tick(U0, k.pt(1, 0)); k.tick(U1, k.pt(1, 0));
        k.point(U0, 'U_0', 'sw'); k.point(U1, 'U_1', 'se');
        k.dim(U0, U1, 'e', { side: 'right', dist: 1.3 });
        k.frame(-E * 0.62, -E * 0.14, E * 0.62, h * E * 1.1);
      });
      k.step('compass', 'With the compass opened to e and the point on U₀, then on U₁, draw two arcs: they cross at the pole N and the face is equilateral.', () => {
        k.arc(U0, E, 50 * D2R, 70 * D2R, { cls: 'cons' });
        k.arc(U1, E, 110 * D2R, 130 * D2R, { cls: 'cons' });
        k.point(N, 'N', 'n');
      });
      k.step('straightedge', 'Join N to U₀ and to U₁. These two sides are themselves meridians (0° and 72°), and the base is part of the great circle through U₀ and U₁.', () => {
        k.seg(N, U0, { cls: 'given' }); k.seg(N, U1, { cls: 'given' });
        k.label(g.lerp(N, U0, 0.1), '0°', 'w', { upright: true, size: 0.85 }); k.label(g.lerp(N, U1, 0.1), '72°', 'e', { upright: true, size: 0.85 });
      });
      k.step('ruler', 'On the base, from U₀, lay off the distances t·e that cut it where the meridians of 12°, 24°, 36°, 48° and 60° meet it: ' +
        [12, 24, 36, 48, 60].map(l => f1(tOf(l) * E) + ' (' + l + '°)').join(', ') + '. (36° is the midpoint, by symmetry.)', () => {
        [12, 24, 36, 48, 60].forEach(l => { const b = base(l); k.point(b, '', 's'); k.label(b, l + '°', 's', { upright: true, size: 0.8, dist: 1.0 }); });
      });
      k.step('straightedge', 'Join N to each of the five marks. A meridian is a great circle, and a great circle is a straight line in the gnomonic projection: the whole graticule of meridians is five rulings from the pole.', () => {
        [12, 24, 36, 48, 60].forEach(l => k.seg(N, base(l), { cls: 'cons' }));
      });
      k.step('ruler', 'On every meridian measure from N the fraction s of the way to the base at which each parallel crosses it. On the central meridian (36°) the parallels of 75°, 60° and 45° lie at ' +
        phis.map(p => f1(sOf(36, p), 3)).join(', ') + ' of its length; on 12° and 60° at ' + phis.map(p => f1(sOf(12, p), 3)).join(', ') + '; on 24° and 48° at ' + phis.map(p => f1(sOf(24, p), 3)).join(', ') +
        '; on the two edges (0° and 72°) at ' + phis.map(p => f1(sOf(0, p), 3)).join(', ') + '.', () => {
        lams.forEach(l => phis.forEach(p => k.dot(mark(l, p), { r: 0.8 })));
        phis.forEach(p => k.label(mark(0, p), p + '°N', 'w', { upright: true, size: 0.8, dist: 0.8 }));
      });
      k.step('pencil', 'Trace each parallel through its seven marks with a French curve. They are arcs of ellipses, which is what a cone of directions about the pole (a parallel) becomes when the plane cuts it at a slant.', () => {
        phis.forEach(p => k.curve(range(0, 72, 1).map(l => { const q = faceProject(P, F, l, p); return paper(q); }), null, { cls: 'curve' }));
        k.curve([N, U0, U1, N].map(q => [q.x, q.y]), null, { cls: 'thick', target: false });
      });
      k.note('At the pole the sides meet at 60° on the face, but the meridians 0° and 72° meet at 72° on the globe: the distortion is the price of flat faces, and it is greatest at the corners (area 2.0 times too large there against the centre, for the icosahedron).', () => {
        ang(k, N, U0, U1, { label: '60°', r: 2.4, labelDist: 1.3 });
        const c = g.centroid([N, U0, U1]); k.label(c, 'face 1', 'c', { upright: true, size: 0.9, fill: '#555' });
        k.seg(N, g.mid(U0, U1), { cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================== the icosahedron net */
  Hyper.construction({
    id: 'hp-icosahedron-net',
    title: 'The net of the icosahedron with the T-square and the 60° set square',
    tags: ['polyhedral', 'icosahedron', 'net', 'set square', 'dividers'],
    note: 'Twenty equilateral triangles in four rows of five: five round the north pole, a band of ten, five round the south pole. This is the strip the Map lab draws for the icosahedron. Fuller\'s Dymaxion map uses the same twenty triangles but cuts the solid along different edges and turns it so that the cuts run through the oceans.',
    build(k) {
      const g = k.g, P = k.proj, M = P.maps, a = 100, h = a * SQ3 / 2;
      const X = (j, y) => k.pt(j * a, y);
      const row0 = range(0.5, 5.5, 1).map(j => X(j, 0)), rowH = range(0, 5, 1).map(j => X(j, h));
      k.given('The edge a of a face, and a horizontal line L along which the net will be built.', () => {
        const A = k.pt(-a * 0.35, -h * 1.5), B = k.pt(-a * 0.35 + a, -h * 1.5);
        k.seg(A, B, { cls: 'given' }); k.tick(A, k.pt(1, 0)); k.tick(B, k.pt(1, 0)); k.dim(A, B, 'a', { dist: 1.2 });
        k.seg(k.pt(0.5 * a, 0), k.pt(5.5 * a, 0), { cls: 'given' });
        k.label(k.pt(5.5 * a, 0), 'L', 'e', { upright: true, size: 0.9 });
        k.frame(-a * 0.5, -h * 1.75, a * 6.0, h * 2.35);
      });
      k.step('dividers', 'Set the dividers to a and step along L five times from the left: six marks 0.5a, 1.5a, … 5.5a.', () => {
        row0.forEach((p, i) => k.point(p, i === 0 ? 'P_0' : '', 'sw', { r: 0.9 }));
        row0.slice(1).forEach(p => k.dot(p, { r: 0.9 }));
      });
      k.step('compass', 'With centre P₀ and then P₁, radius a, strike two arcs: they cross at Q, the apex of the first triangle. The height of the row is h = 0.866 a.', () => {
        k.arc(row0[0], a, 50 * D2R, 70 * D2R, { cls: 'cons' }); k.arc(row0[1], a, 110 * D2R, 130 * D2R, { cls: 'cons' });
        k.point(rowH[1], 'Q', 'n', { r: 0.9 });
      });
      k.step('tee', 'Draw the T-square line through Q: the second line of the net, at the height h above L.', () => {
        k.seg(rowH[0], rowH[5], { cls: 'cons' });
      });
      k.step('dividers', 'Step a along it from Q in both directions: six marks 0, a, 2a, … 5a. They stand directly over the gaps between the marks of L.', () => {
        rowH.forEach((p, i) => { if (i !== 1) k.dot(p, { r: 0.9 }); });
      });
      k.step('square', 'With the 60° set square against the T-square draw the zigzag between the two lines: each mark of L is joined to the mark up to its left and the mark up to its right (eleven strokes). The band of ten triangles is done.', () => {
        for (let j = 0; j < 6; j++) { k.seg(row0[j], rowH[j], { cls: 'cons' }); if (j < 5) k.seg(row0[j], rowH[j + 1], { cls: 'cons' }); }
      });
      k.step('square', 'The five triangles of the north cap: from each pair of neighbouring marks on the upper line draw the two 60° strokes that meet above them, at height 2h. These apexes are the north pole, shown five times.', () => {
        for (let j = 0; j < 5; j++) { const t = k.pt((j + 0.5) * a, 2 * h); k.seg(rowH[j], t, { cls: 'cons' }); k.seg(rowH[j + 1], t, { cls: 'cons' }); k.dot(t, { r: 0.7 }); }
      });
      k.step('square', 'The south cap: from neighbouring marks of L draw the two strokes that meet below at the depth h. These apexes are the south pole, also shown five times.', () => {
        for (let j = 0; j < 5; j++) { const t = k.pt((j + 1) * a, -h); k.seg(row0[j], t, { cls: 'cons' }); k.seg(row0[j + 1], t, { cls: 'cons' }); k.dot(t, { r: 0.7 }); }
      });
      k.step('pencil', 'Line in the outline of the net heavy: a zigzag along the top, down the right-hand zigzag, along the bottom zigzag and up the left. Everything inside is a crease; the outline is where the paper is cut.', () => {
        // (0,h) (.5,2h) (1,h) … (4.5,2h) (5,h) (5.5,0), then back along the bottom zigzag (5,-h) (4.5,0) … (1,-h) (.5,0)
        const outline = [rowH[0]];
        for (let j = 0; j < 5; j++) { outline.push(k.pt((j + 0.5) * a, 2 * h)); outline.push(rowH[j + 1]); }
        outline.push(row0[5]);
        for (let j = 4; j >= 0; j--) { outline.push(k.pt((j + 1) * a, -h)); outline.push(row0[j]); }
        for (let i = 0; i < outline.length; i++) k.seg(outline[i], outline[(i + 1) % outline.length], { cls: 'thick' });
      });
      k.note('N marks the five copies of the north pole, S the five copies of the south pole. Cut round the outline, fold every crease and glue the free edges in pairs (the two edges that meet at each valley of the zigzag close a cap round a pole, and the left end of the strip joins the right end): the icosahedron. Printing the gnomonic graticule of the Map lab on these triangles gives the globe in twenty pieces.', () => {
        for (let j = 0; j < 5; j++) { k.label(k.pt((j + 0.5) * a, 2 * h), 'N', 'n', { upright: true, size: 0.9 }); k.label(k.pt((j + 1) * a, -h), 'S', 's', { upright: true, size: 0.9 }); }
        // number the faces
        let n = 1;
        for (let j = 0; j < 5; j++) { k.label(k.pt((j + 0.5) * a, h * 1.35), String(n++), 'c', { upright: true, size: 0.75, fill: '#555' }); }
        for (let j = 0; j < 5; j++) { k.label(k.pt((j + 0.5) * a, h * 0.65), String(n++), 'c', { upright: true, size: 0.75, fill: '#555' }); k.label(k.pt((j + 1) * a, h * 0.35), String(n++), 'c', { upright: true, size: 0.75, fill: '#555' }); }
        for (let j = 0; j < 5; j++) { k.label(k.pt((j + 1) * a, -h * 0.35), String(n++), 'c', { upright: true, size: 0.75, fill: '#555' }); }
      });
    }
  });

  /* ================================================================== Cahill's octant and the net of eight */
  Hyper.construction({
    id: 'hp-cahill-octant',
    title: 'Cahill\'s octant: one eighth of the globe on a triangle, and the net of eight',
    tags: ['polyhedral', 'octahedron', 'Cahill', 'gnomonic', 'protractor', 'set square'],
    note: 'One octant is a quarter of the northern hemisphere: it lies between the meridians 45° E and 135° E and between the equator and the pole. Projected from the centre of the globe onto the flat triangle with the same three corners it becomes an equilateral triangle: the equator is the base, the two bounding meridians the sides, and every meridian a straight line from the pole. The four northern octants are copies of each other, the southern ones their mirror images, so the whole net is one drawing stepped off four times. The Map lab lays the eight triangles in one row along the equator; Cahill\'s own butterfly joins them differently and fills each triangle with a mapping of his own, but the triangles are these.',
    build(k) {
      const g = k.g, P = k.proj, F = P.maps.defs.octahedron.faces[0];
      const a = 300, h = a * SQ3 / 2, a2 = a / 2, h2 = h / 2, yEq = -200;
      const E0 = k.pt(0, 0), E1 = k.pt(a, 0), N = k.pt(a / 2, h), M0 = k.pt(a / 2, 0);
      const mus = [-30, -15, 0, 15, 30];                                // offsets of the drawn meridians from the central one (90° E)
      const tOf = mu => (1 + Math.tan(mu * D2R)) / 2;                   // position along the base, as a fraction of a
      const base = mu => k.pt(a * tOf(mu), 0);
      const sOf = (mu, phi) => 1 / (1 + Math.tan(phi * D2R) / (Math.SQRT2 * Math.cos(mu * D2R)));
      const mark = (mu, phi) => g.lerp(N, base(mu), sOf(mu, phi));
      const phis = [60, 30];
      const octPt = (lon, lat) => { const q = faceProject(P, F, lon, lat); return k.pt(q[0] * a, q[1] * a); };
      const par = phi => range(45, 135, 1.5).map(l => octPt(l, phi));
      k.given('The edge a of the triangle (it is the image of the equator between 45° E and 135° E) with its ends E₀ and E₁.', () => {
        k.seg(E0, E1, { cls: 'given' });
        k.point(E0, 'E_0', 'sw'); k.point(E1, 'E_1', 'se');
        const A = k.pt(a + 40, h * 0.9), B = k.pt(a + 40 + a, h * 0.9);
        k.seg(A, B, { cls: 'given' }); k.tick(A, k.pt(1, 0)); k.tick(B, k.pt(1, 0)); k.dim(A, B, 'a', { dist: 1.2 });
        k.frame(-40, yEq - h2 - 40, a * 2.4, h + 50);
      });
      k.step('compass', 'With centre E₀ and then E₁, radius a, draw two arcs: they cross at N, the north pole. The octant is an equilateral triangle.', () => {
        k.arc(E0, a, 50 * D2R, 70 * D2R, { cls: 'cons' }); k.arc(E1, a, 110 * D2R, 130 * D2R, { cls: 'cons' });
        k.point(N, 'N', 'n');
      });
      k.step('straightedge', 'Join N to E₀ and E₁: the sides are the meridians of 45° E and 135° E; the base is the equator.', () => {
        k.seg(N, E0, { cls: 'given' }); k.seg(N, E1, { cls: 'given' });
        k.label(g.lerp(N, E0, 0.86), '45° E', 'w', { upright: true, size: 0.85 }); k.label(g.lerp(N, E1, 0.86), '135° E', 'e', { upright: true, size: 0.85 });
      });
      k.step('dividers', 'Bisect the base with the dividers: its midpoint M is where the central meridian (90° E) will meet the equator.', () => {
        k.point(M0, 'M', 's', { r: 0.9 });
      });
      k.step('ruler', 'The other meridians meet the base at distances (a/2)·tan μ from M, where μ is the longitude measured from 90° E. Lay off ' + f1(a / 2 * Math.tan(15 * D2R)) + ' (μ = 15°) and ' + f1(a / 2 * Math.tan(30 * D2R)) + ' (μ = 30°) on each side of M, to give the meridians 60°, 75°, 105° and 120° E.', () => {
        [-30, -15, 15, 30].forEach(mu => { const b = base(mu); k.point(b, '', 's'); k.label(b, (90 + mu) + '°', 's', { upright: true, size: 0.8 }); });
      });
      k.step('straightedge', 'Join N to each of the five points on the base. A meridian is a great circle and the gnomonic projection makes every great circle straight, so these five rulings are the meridians at 15° intervals.', () => {
        mus.forEach(mu => k.seg(N, base(mu), { cls: 'cons' }));
      });
      k.step('ruler', 'On each ruling measure from N the fraction at which the parallels of 60° N and 30° N cross it: 60° N at ' + [-45, -30, -15, 0].map(mu => f1(sOf(mu, 60), 3)).join(', ') + ' and 30° N at ' + [-45, -30, -15, 0].map(mu => f1(sOf(mu, 30), 3)).join(', ') +
        ' for the meridians at 45° (the side), 30°, 15° and 0° from the centre; the meridians on the other side of the centre mirror them.', () => {
        [-45, -30, -15, 0, 15, 30, 45].forEach(mu => phis.forEach(p => k.dot(mark(mu, p), { r: 0.8 })));
        phis.forEach(p => k.label(mark(-45, p), p + '°N', 'w', { upright: true, size: 0.8, dist: 0.8 }));
      });
      k.step('pencil', 'Draw each parallel through its seven points with a French curve: the 60° parallel is an arc of an ellipse, the 30° parallel an arc of a hyperbola (the parallel of 54.7° N, between them, would be a parabola).', () => {
        phis.forEach(p => k.curve(par(p).map(q => [q.x, q.y]), null, { cls: 'curve' }));
      });
      k.step('tee', 'The net: draw a horizontal line (the equator of the net) at the left of the sheet, below the octant, four times as long as the new triangle\'s edge a′ = a/2 (halve a with the dividers).', () => {
        k.seg(k.pt(0, yEq), k.pt(4 * a2, yEq), { cls: 'cons' });
      });
      k.step('dividers', 'Step a′ four times along it: five marks. In the Map lab the four northern triangles stand over the longitudes 135° W to 45° W, 45° W to 45° E, 45° E to 135° E and 135° E to 135° W, in turn; the octant above is the third.', () => {
        [0, 1, 2, 3, 4].forEach(j => k.dot(k.pt(j * a2, yEq), { r: 0.9 }));
      });
      k.step('square', 'With the 60° set square raise a triangle over each pair of marks: the northern four. Their apexes are the north pole, shown four times.', () => {
        for (let j = 0; j < 4; j++) { const t = k.pt((j + 0.5) * a2, yEq + h2); k.seg(k.pt(j * a2, yEq), t, { cls: 'cons' }); k.seg(k.pt((j + 1) * a2, yEq), t, { cls: 'cons' }); k.dot(t, { r: 0.8 }); }
      });
      k.step('square', 'The same below the line: four triangles pointing down for the southern octants, with the south pole at their apexes.', () => {
        for (let j = 0; j < 4; j++) { const t = k.pt((j + 0.5) * a2, yEq - h2); k.seg(k.pt(j * a2, yEq), t, { cls: 'cons' }); k.seg(k.pt((j + 1) * a2, yEq), t, { cls: 'cons' }); k.dot(t, { r: 0.8 }); }
      });
      k.step('pencil', 'Line in the outline heavy: along the top zigzag, then back along the bottom zigzag. Everything inside is a crease or an edge shared by two octants; the outline is where the sphere is cut.', () => {
        const out = [k.pt(0, yEq)];
        for (let j = 0; j < 4; j++) { out.push(k.pt((j + 0.5) * a2, yEq + h2)); out.push(k.pt((j + 1) * a2, yEq)); }
        for (let j = 3; j >= 0; j--) { out.push(k.pt((j + 0.5) * a2, yEq - h2)); out.push(k.pt(j * a2, yEq)); }
        for (let i = 0; i + 1 < out.length; i++) k.seg(out[i], out[i + 1], { cls: 'thick' });
      });
      k.note('Copy the octant\'s graticule at half size into the northern triangles (all four are identical) and, upside down, into the southern ones. The eight small graticules are the map; the Map lab draws the coastlines on them.', () => {
        const meridians = mus.map(mu => [N, base(mu)]);
        const curves = phis.map(p => par(p));
        for (let j = 0; j < 4; j++) for (const sgn of [1, -1]) {
          const T = q => k.pt(q.x / 2 + j * a2, sgn * q.y / 2 + yEq);
          meridians.forEach(([p, q]) => k.seg(T(p), T(q), { cls: 'aux', target: false }));
          curves.forEach(c => k.curve(c.map(q => { const r = T(q); return [r.x, r.y]; }), null, { cls: 'curve', target: false, width: 1.1 }));
        }
        ['135° W – 45° W', '45° W – 45° E', '45° E – 135° E', '135° E – 135° W'].forEach((t, j) => k.label(k.pt((j + 0.5) * a2, yEq + h2), t, 'n', { upright: true, size: 0.72, dist: 1.4 }));
        k.label(k.pt(1.5 * a2, yEq - h2), 'S', 's', { upright: true, size: 0.9 });
      });
    }
  });

  /* ================================================================== the Earth on a cube */
  Hyper.construction({
    id: 'hp-cube-net',
    title: 'The Earth on a cube: the gnomonic faces and the cross of six',
    tags: ['polyhedral', 'cube', 'cube map', 'gnomonic', 'protractor', 'compass'],
    note: 'The sphere of radius R sits inside a cube of edge 2R and is projected from its centre onto the six faces. A face is then a square of side 2R. On a side face the meridians are verticals at R·tan Δ from the middle (Δ is the longitude from the face centre) and the parallels are hyperbolas, at height R·tan φ / cos Δ. On the top face, which looks straight down the polar axis, the meridians are rays at their true angles and the parallels are circles of radius R·cot φ. This is exactly the cube map of a game engine and of a 360° video.',
    build(k) {
      const g = k.g, P = k.proj, M = P.maps, R = 80;
      const O = k.pt(0, 0), T0 = k.pt(0, 2 * R), C = k.pt(0, -R);
      const px = net => k.pt(net[0] * R, net[1] * R);
      const dels = [-30, -15, 0, 15, 30];
      const yOf = (phi, del) => R * Math.tan(phi * D2R) / Math.cos(del * D2R);
      k.given('The radius R of the sphere (the face is a square of side 2R). Take R = 80; here the faces are drawn so that their centres lie at (0, 0), (±2R, 0), (4R, 0) and the top face above the first.', () => {
        const A = k.pt(-3 * R, -3.35 * R), B = k.pt(-2 * R, -3.35 * R);
        k.seg(A, B, { cls: 'given' }); k.tick(A, k.pt(1, 0)); k.tick(B, k.pt(1, 0)); k.dim(A, B, 'R', { dist: 1.2 });
        k.frame(-3.4 * R, -3.7 * R, 5.4 * R, 3.4 * R);
      });
      k.step('tee', 'With the T-square draw four horizontals: y = ±R across the whole row of four faces (8R long) and y = ±3R across the top and the bottom faces (2R long).', () => {
        k.seg(k.pt(-3 * R, R), k.pt(5 * R, R), { cls: 'cons' }); k.seg(k.pt(-3 * R, -R), k.pt(5 * R, -R), { cls: 'cons' });
        k.seg(k.pt(-R, 3 * R), k.pt(R, 3 * R), { cls: 'cons' }); k.seg(k.pt(-R, -3 * R), k.pt(R, -3 * R), { cls: 'cons' });
      });
      k.step('square', 'With the set square against the T-square draw the verticals x = −3R, −R, R, 3R, 5R: the cross of six squares (a row of four, with a face above and a face below the second).', () => {
        k.seg(k.pt(-3 * R, -R), k.pt(-3 * R, R), { cls: 'cons' });
        k.seg(k.pt(-R, -3 * R), k.pt(-R, 3 * R), { cls: 'cons' }); k.seg(k.pt(R, -3 * R), k.pt(R, 3 * R), { cls: 'cons' });
        k.seg(k.pt(3 * R, -R), k.pt(3 * R, R), { cls: 'cons' }); k.seg(k.pt(5 * R, -R), k.pt(5 * R, R), { cls: 'cons' });
        ['−90°', '0°', '90°', '180°'].forEach((t, i) => k.label(k.pt((i * 2 - 2) * R, 0.82 * R), t, 'c', { upright: true, size: 0.8, fill: '#777' }));
        k.label(k.pt(0, 2.8 * R), 'N', 'c', { upright: true, size: 0.9, fill: '#777' }); k.label(k.pt(0, -2.8 * R), 'S', 'c', { upright: true, size: 0.9, fill: '#777' });
      });
      k.step('protractor', 'The meridians of the front face (centred on 0°). Mark C on the middle vertical of the face, a distance R below the equator y = 0 (C stands for the centre of the sphere, seen from above). From C draw rays at Δ = 15°, 30° and 45° to the left and right of the vertical: where they cut the equator is the position R·tan Δ of the meridian (' + [15, 30, 45].map(d => f1(R * Math.tan(d * D2R))).join(', ') + ').', () => {
        k.point(C, 'C', 'sw', { r: 0.9 });
        [-45, -30, -15, 15, 30, 45].forEach(d => { const X = k.pt(R * Math.tan(d * D2R), 0); k.seg(C, X, { cls: 'cons' }); k.dot(X, { r: 0.8 }); });
        k.seg(C, k.pt(0, 0), { cls: 'cons' });
        ang(k, C, k.pt(R * Math.tan(30 * D2R), 0), k.pt(0, 0), { label: '30°', r: 1.6, labelDist: 1.5 });
      });
      k.step('square', 'Through the marks draw the verticals (meridians 30° W, 15° W, 0°, 15° E, 30° E from the face centre): each is a straight line, a great circle seen from the centre.', () => {
        dels.forEach(d => k.seg(k.pt(R * Math.tan(d * D2R), -R), k.pt(R * Math.tan(d * D2R), R), { cls: 'cons' }));
      });
      k.step('ruler', 'On each meridian lay off the heights y = R·tan φ / cos Δ of the parallels: on the middle meridian ' + [15, 30, 45].map(p => f1(R * Math.tan(p * D2R))).join(', ') + ' for φ = 15°, 30°, 45°; on the others multiply by sec Δ (1.035 at 15°, 1.155 at 30°). The 45° parallel touches the top edge at the middle. Do the same below the equator.', () => {
        dels.forEach(d => [15, 30].forEach(p => { k.dot(k.pt(R * Math.tan(d * D2R), yOf(p, d)), { r: 0.8 }); k.dot(k.pt(R * Math.tan(d * D2R), -yOf(p, d)), { r: 0.8 }); }));
        k.dot(k.pt(0, R), { r: 0.8 }); k.dot(k.pt(0, -R), { r: 0.8 });
        [15, 30].forEach(p => k.label(k.pt(-R, yOf(p, 45)), p + '°', 'w', { upright: true, size: 0.75, dist: 0.8 }));
      });
      k.step('pencil', 'Join the marks of each parallel with a smooth curve: a hyperbola, lowest at the middle meridian and rising towards the edges. Draw the two above the equator and the two below.', () => {
        for (const sgn of [1, -1]) [15, 30].forEach(p => {
          const pts = range(-45, 45, 1.5).map(d => { const y = sgn * yOf(p, d); return Math.abs(y) <= R + 1e-9 ? [R * Math.tan(d * D2R), y] : null; });
          k.curve(pts, null, { cls: 'curve' });
        });
      });
      k.step('compass', 'The top face (the polar view). Its centre T = (0, 2R) is the pole. About T draw circles of radius R·cot φ: ' + [75, 60, 45].map(p => f1(R / Math.tan(p * D2R)) + ' for φ = ' + p + '°').join(', ') + '. The last touches the four sides: it is the 45° parallel seen continuing from the front face.', () => {
        k.point(T0, 'T', 'se', { r: 0.9 });
        [75, 60, 45].forEach(p => k.circle(T0, R / Math.tan(p * D2R), { cls: 'curve' }));
      });
      k.step('protractor', 'Draw the meridians as rays from T at their true angles, every 15° of longitude: the ray for 0° points straight down, towards the front face, and the longitude increases towards the right, so the ray for 90° E points right. The rays meet the circles at right angles and run out to the edges of the square.', () => {
        for (let lon = 0; lon < 360; lon += 15) {
          const dir = k.pt(Math.sin(lon * D2R), -Math.cos(lon * D2R)), s = R / Math.max(Math.abs(dir.x), Math.abs(dir.y));
          k.seg(T0, g.add(T0, g.mul(dir, s)), { cls: 'cons' });
        }
        k.label(k.pt(0, 2 * R - 0.5 * R), '0°', 's', { upright: true, size: 0.7, fill: '#777' }); k.label(k.pt(0.5 * R, 2 * R), '90°', 'e', { upright: true, size: 0.7, fill: '#777' });
      });
      k.note('The three other side faces are the front face again, turned to 90° E, 180° and 90° W, and the bottom face is the top face upside down. Together they are the Map lab\'s cube net; the worst stretch is at the corners of the cube, where an area is 5.2 times larger than at a face centre (against 2.0 for the icosahedron).', () => {
        const regions = [[-1, 1, -1, 1], [-1, 1, 1, 3]];
        const inside = (x, y) => regions.some(r => x >= r[0] - 1e-6 && x <= r[1] + 1e-6 && y >= r[2] - 1e-6 && y <= r[3] + 1e-6);
        M.graticule('cube', {}, 15, 15, 0.5).forEach(s => {
          const mid = s.pts[s.pts.length >> 1];
          if (!mid || inside(mid[0], mid[1])) return;
          k.curve(s.pts.map(q => [q[0] * R, q[1] * R]), null, { cls: 'aux', target: false });
        });
      });
    }
  });

  /* ================================================================== Eratosthenes */
  Hyper.construction({
    id: 'hp-eratosthenes',
    title: 'Eratosthenes measures the Earth: the well, the shadow and 1/50 of a circle',
    tags: ['history', 'Eratosthenes', 'protractor', 'set square', 'dividers', 'geodesy'],
    note: 'On the day of the summer solstice, so the story goes, the Sun at noon shone to the bottom of a well at Syene, so its rays ran along the vertical there. At Alexandria, some 5000 stadia to the north on nearly the same meridian, a vertical pointer cast a shadow, and the angle between the pointer and the Sun\'s ray came out at one fiftieth of a circle. The Sun is so far away that its rays arrive parallel; the verticals of the two cities point at the centre of the Earth; so the angle at the centre is the same fiftieth, and the distance between the cities is a fiftieth of the circumference. The main drawing is true to scale in the angles, which makes the pointer and the shadow tiny: a later step shows the top magnified eight times.',
    build(k) {
      const g = k.g, R = 150, alpha = 360 / 50, C = k.pt(0, 0), gl = 17, m = 8;
      const S = g.polar(C, R, 90 * D2R), A = g.polar(C, R, (90 + alpha) * D2R);
      const uA = g.unit(g.sub(A, C)), T = g.add(A, g.mul(uA, gl));
      const tang = g.add(A, g.perp(uA));
      const Q = g.lineLine(A, tang, T, g.add(T, k.pt(0, -1)));
      const wellDepth = 5;
      k.given('The Earth as a circle with centre C and radius R. Syene S is at the top, with the Sun straight overhead: its rays fall as parallel verticals, and one of them runs down the well at S to the water.', () => {
        k.circle(C, R, { cls: 'given' }); k.point(C, 'C', 'se');
        k.point(S, 'S', 'e', { r: 0.8, lo: { dist: 1.6 } });
        k.arrow(g.add(S, k.pt(0, 62)), g.add(S, k.pt(0, 6)), { cls: 'given' });
        k.seg(S, g.add(S, k.pt(0, -wellDepth)), { cls: 'given', width: 3 });
        k.label(g.add(S, k.pt(0, 62)), 'Sun\'s rays', 'e', { upright: true, size: 0.8, dist: 0.8 });
        k.frame(-R * 1.25, -R * 1.2, R * 3.45, R * 1.7);
      });
      k.step('protractor', 'At C lay off the angle of 7.2° (one fiftieth of 360°) from CS towards the north (the left). It cuts the circle at A, Alexandria (S is Syene).', () => {
        k.seg(C, S, { cls: 'cons' }); k.point(A, 'A', 'w', { r: 0.8, lo: { dist: 1.6 } });
        ang(k, C, S, A, { label: '7.2°', r: 3.0, labelDist: 1.2 });
      });
      k.step('straightedge', 'Draw the line from C through A and carry it on beyond A by the length of the pointer, to T: this is the plumb line at Alexandria, the direction of the pointer, which points away from the centre of the Earth.', () => {
        k.seg(C, A, { cls: 'cons' }); k.seg(A, T, { cls: 'thick' }); k.dot(T, { r: 0.8 });
      });
      k.step('square', 'With the set square on the T-square draw the Sun\'s ray through T, parallel to the ray at Syene. With the set square against CA draw the ground at Alexandria through A, perpendicular to the pointer. They meet at Q: the tip of the shadow.', () => {
        k.arrow(g.add(T, k.pt(0, 56)), T, { cls: 'given' }); k.seg(T, Q, { cls: 'given' });
        k.seg(g.sub(A, g.mul(g.unit(g.sub(tang, A)), 24)), g.add(A, g.mul(g.unit(g.sub(tang, A)), 24)), { cls: 'cons' });
        k.dot(Q, { r: 0.8 });
        k.seg(A, Q, { cls: 'thick' });
      });
      k.step('dividers', 'Set the dividers to the chord SA and step it round the circle. After 50 steps they close exactly on S: the circle is fifty times the arc SA. (The first five marks are shown heavy, the rest lighter.)', () => {
        for (let j = 2; j < 50; j++) k.dot(g.polar(C, R, (90 + alpha * j) * D2R), { r: 0.6, cls: j < 6 ? undefined : 'aux' });
      });
      k.note('Magnified eight times, the top of the Earth shows the pointer AT, its shadow AQ and the ray TQ. The angle at T between the pointer and the ray is 7.2°: the ray at T is parallel to CS and CA cuts both, so it equals the angle at C (corresponding angles). Its tangent is the shadow over the pointer: ' + f1(g.dist(A, Q), 2) + ' / ' + gl + ' = ' + f1(g.dist(A, Q) / gl, 3) + ' = tan 7.2°.', () => {
        const O = k.pt(R * 2.75, R * 0.35);                                    // where S lands in the detail
        const T2 = p => g.add(O, g.mul(g.sub(p, S), m));
        const arc = range(87, 99, 0.25).map(th => { const q = T2(g.polar(C, R, th * D2R)); return [q.x, q.y]; });
        k.curve(arc, null, { cls: 'given', nobounds: false });
        const dt = g.unit(g.sub(tang, A)), t1 = T2(g.sub(A, g.mul(dt, 12))), t2 = T2(g.add(A, g.mul(dt, 12)));
        k.arrow(g.add(T2(S), k.pt(0, 110)), T2(S), { cls: 'given' }); k.seg(T2(S), g.add(T2(S), k.pt(0, -wellDepth * m)), { cls: 'given', width: 3 });
        k.arrow(g.add(T2(T), k.pt(0, 80)), T2(T), { cls: 'given' }); k.seg(T2(T), T2(Q), { cls: 'given' });
        k.seg(t1, t2, { cls: 'cons' }); k.seg(T2(A), T2(T), { cls: 'thick' }); k.seg(T2(A), T2(Q), { cls: 'thick' });
        [['S', S, 'ne'], ['A', A, 'se'], ['T', T, 'nw'], ['Q', Q, 'sw']].forEach(([nm, p, at]) => k.point(T2(p), nm, at, { r: 0.8 }));
        ang(k, T2(T), T2(A), T2(Q), { r: 2.4 });
        k.text(T2(T).x - 40, T2(T).y - 62, '7.2°', { size: 0.85, upright: true, anchor: 'middle' });
        k.text(O.x - 60, O.y + 215, 'detail × 8', { size: 0.85, upright: true, anchor: 'middle' });
        k.arc(C, R + 12, 90 * D2R, (90 + alpha) * D2R, { cls: 'cons' });
        k.text(-95, R + 44, '5000 stadia', { size: 0.85, upright: true, anchor: 'middle' }); k.seg(k.pt(-62, R + 38), g.polar(C, R + 12, (90 + alpha / 2) * D2R), { cls: 'aux' });
      });
      k.note('The cities were reckoned to be 5000 stadia apart, so the whole circumference is 50 × 5000 = 250,000 stadia. With a stadion of about 157.5 m that is 39,400 km; with 185 m it would be 46,000 km. The modern length of a meridian circuit is 40,008 km.', () => {
        k.text(0, -R * 1.1, '50 × 5000 = 250 000 stadia', { size: 0.9, upright: true, anchor: 'middle' });
      });
    }
  });

  /* ================================================================== Ptolemy's first projection */
  Hyper.construction({
    id: 'hp-ptolemy-first',
    title: 'Ptolemy\'s first projection: a cone, true along the parallel of Rhodes',
    tags: ['history', 'Ptolemy', 'conic', 'protractor', 'compass', 'dividers'],
    note: 'The parallels are arcs of circles about a point V on the extension of the central meridian, spaced as on the globe (the arcs on the meridian are true lengths). The meridians are straight lines from V. The apex is placed so that the parallel of Rhodes (36° N) comes out its true length, the one most useful to a Mediterranean geographer: V lies R·cot 36° above the parallel of Rhodes, the length of the tangent from the Rhodes point of the globe to the polar axis. In the engine and in this drawing the lower fringe, south of the equator, has its meridians bent back so that the parallels do not keep widening; the longitudes are measured from the central meridian, 90° from each end of Ptolemy\'s world.',
    build(k) {
      const g = k.g, P = k.proj, M = P.maps, R = 100, f1d = 36, n = Math.sin(f1d * D2R);
      const Os = k.pt(-250, 0), E = k.pt(120, 0);
      const Thule = 63, Rhodes = 36, Meroe = -16.4167;
      const yAt = lat => E.y + R * lat * D2R;
      const P1 = g.add(Os, g.mul(g.dir(f1d * D2R), R)), V0 = g.add(Os, k.pt(0, R / n));
      const tang = g.dist(P1, V0);
      const V = k.pt(E.x, yAt(Rhodes) + tang);
      const onEq = lon => { const th = n * lon * D2R; return g.add(V, g.mul(k.pt(Math.sin(th), -Math.cos(th)), V.y - E.y)); };
      const south = (lon, lat) => { const q = M.project('ptolemy1', lon, lat); return k.pt(E.x + R * q[0], E.y + R * q[1]); };
      const arcOf = (lat, lonMax) => { const r = V.y - yAt(lat), th = lat >= 0 ? n * lonMax * D2R : n * lonMax * D2R * Math.cos(lat * D2R); return [r, -Math.PI / 2 - th, -Math.PI / 2 + th]; };
      k.given('The globe\'s meridian circle (centre O, radius R = 100) and the central meridian of the map at the right, with E on the equator. The standard parallel is Rhodes, 36° N; the frame runs from the parallel of Thule (63° N) to that of anti-Meroë (16°25′ S) and 90° of longitude either side of the centre.', () => {
        k.circle(Os, R, { cls: 'given' });
        k.seg(g.add(Os, k.pt(-R * 1.15, 0)), g.add(Os, k.pt(R * 1.15, 0)), { cls: 'given' });
        k.seg(g.add(Os, k.pt(0, -R * 1.15)), g.add(Os, k.pt(0, R * 1.75)), { cls: 'given' });
        k.point(Os, 'O', 'sw'); k.label(g.add(Os, k.pt(0, R * 1.75)), 'axis', 'e', { upright: true, size: 0.8 });
        k.seg(k.pt(E.x, yAt(Meroe) - 25), k.pt(E.x, yAt(Thule) + 25), { cls: 'given' });
        k.point(E, 'E', 'se'); k.label(k.pt(E.x, yAt(Meroe) - 25), 'central meridian', 's', { upright: true, size: 0.8 });
        k.frame(-380, -130, 330, 215);
      });
      k.step('protractor', 'At O lay off the latitude of Rhodes, 36°, from the equator: it gives the point P₁ on the circle.', () => {
        k.seg(Os, P1, { cls: 'cons' }); k.point(P1, 'P_1', 'e');
        ang(k, Os, k.pt(Os.x + R, 0), P1, { label: '36°', r: 1.8, labelDist: 1.5 });
      });
      k.step('square', 'Through P₁ draw the tangent to the circle, perpendicular to OP₁ (the set square against the radius). It meets the polar axis at V₀. The length P₁V₀ = R cot 36° = ' + f1(tang) + '.', () => {
        k.seg(P1, V0, { cls: 'cons' }); k.point(V0, 'V_0', 'w'); k.right(P1, Os, V0, { r: 0.8 });
      });
      k.step('ruler', 'On the map\'s central meridian lay off from E the true lengths of its arcs: R·φ (in radians) is ' + [Rhodes, Thule].map(p => f1(R * p * D2R) + ' for ' + p + '° (' + (p === 36 ? 'Rhodes' : 'Thule') + ')').join(' and ') + ' above E, and ' + f1(R * -Meroe * D2R) + ' below it for anti-Meroë.', () => {
        k.point(k.pt(E.x, yAt(Rhodes)), 'Rhodes', 'w', { r: 0.9, lo: { upright: true, size: 0.8, bg: true } }); k.point(k.pt(E.x, yAt(Thule)), 'Thule', 'w', { r: 0.9, lo: { upright: true, size: 0.8, bg: true } });
        k.point(k.pt(E.x, yAt(Meroe)), 'anti-Meroë', 'w', { r: 0.9, lo: { upright: true, size: 0.8, bg: true } });
      });
      k.step('dividers', 'Take the length P₁V₀ with the dividers and carry it up the central meridian from the Rhodes mark: the point reached is V, the centre of all the parallels (' + f1(V.y - E.y) + ' above E).', () => {
        k.point(V, 'V', 'ne');
      });
      k.step('compass', 'With centre V draw the arcs through the marks of Thule, Rhodes, the equator E and anti-Meroë. Each runs ' + f1(n * 90) + '° either side of the central meridian (the meridians converge by sin 36° of their longitude).', () => {
        [Thule, Rhodes, 0, Meroe].forEach(p => { const [r, a0, a1] = arcOf(p, 90); k.arc(V, r, a0, a1, { cls: 'curve' }); });
      });
      k.step('protractor', 'At V lay off the angles ' + [30, 60, 90].map(l => f1(n * l, 2) + '° (' + l + '° of longitude)').join(', ') + ' either side of the central meridian, and mark where each ray meets the equator\'s arc.', () => {
        [-90, -60, -30, 30, 60, 90].forEach(l => k.dot(onEq(l), { r: 0.8 }));
        ang(k, V, k.pt(V.x, V.y - 1), onEq(60), { label: f1(n * 60, 1) + '°', r: 1.5, labelDist: 1.2 });
      });
      k.step('straightedge', 'Draw the meridians, straight, from the arc of Thule down to the equator through those marks, and the central meridian. They converge on V, which is far beyond the pole of the map.', () => {
        [-90, -60, -30, 30, 60, 90].forEach(l => {
          const th = n * l * D2R, dir = k.pt(Math.sin(th), -Math.cos(th));
          k.seg(g.add(V, g.mul(dir, V.y - yAt(Thule))), g.add(V, g.mul(dir, V.y - E.y)), { cls: 'curve' });
        });
        k.seg(k.pt(E.x, yAt(Thule)), E, { cls: 'curve' });
      });
      k.step('pencil', 'South of the equator the meridians bend back: join the points on each meridian between the equator and anti-Meroë with a French curve (' + f1(-Meroe, 1) + '° S, the fringe of Ptolemy\'s Africa), then line the frame in heavy.', () => {
        [-90, -60, -30, 30, 60, 90].forEach(l => k.curve(range(0, -16.4167, -0.5).concat([-16.4167]).map(la => { const q = south(l, la); return [q.x, q.y]; }), null, { cls: 'curve' }));
        k.seg(k.pt(E.x, E.y), k.pt(E.x, yAt(Meroe)), { cls: 'curve' });
        const ring = [];
        for (let la = Meroe; la <= Thule + 1e-9; la += 1) { const q = south(-90, la); ring.push([q.x, q.y]); }
        for (let l = -90; l <= 90; l += 3) { const q = south(l, Thule); ring.push([q.x, q.y]); }
        for (let la = Thule; la >= Meroe - 1e-9; la -= 1) { const q = south(90, la); ring.push([q.x, q.y]); }
        for (let l = 90; l >= -90; l -= 3) { const q = south(l, Meroe); ring.push([q.x, q.y]); }
        k.curve(ring, null, { cls: 'thick', target: false });
      });
      k.note('Check against the engine: the corner (90° from the centre, 63° N) must lie ' + f1(R * M.project('ptolemy1', 90, 63)[0]) + ' to the right of and ' + f1(R * M.project('ptolemy1', 90, 63)[1]) + ' above E. The parallel of Rhodes comes out its true length (' + f1(R * Math.cos(36 * D2R) * Math.PI) + ' for 180°); the equator is 18 % too long.', () => {
        const c = south(90, 63); k.dot(c, { open: true, r: 1.4 }); k.label(c, 'Thule, 90°', 'ne', { upright: true, size: 0.75 });
      });
    }
  });

  /* ================================================================== Ptolemy's second projection */
  Hyper.construction({
    id: 'hp-ptolemy-second',
    title: 'Ptolemy\'s second projection: curved meridians through three points',
    tags: ['history', 'Ptolemy', 'pseudoconic', 'compass', 'dividers', 'bisector'],
    note: 'The parallels are arcs of circles about a point V that lies 181⅚ units above the equator when the central meridian is graduated in degrees. They are spaced as on the globe, and on each of three of them (Thule, Syene and anti-Meroë) the degrees of longitude are laid off in their true length, which shrinks as cos φ. A meridian is the circle through its three points. Because the arcs bulge outwards the map looks like the globe seen from outside, which is why Ptolemy preferred it and why the printers of 1477 onwards used it.',
    build(k) {
      const g = k.g, P = k.proj, M = P.maps, R = 100, Cap = 181.83, V = k.pt(0, R * Cap * D2R);
      const lat = { T: 63, S: 23.833, A: -16.417 };
      const yAt = p => R * p * D2R;
      const rho = p => V.y - yAt(p);
      const on = (p, lon) => { const r = rho(p), t = lon * D2R * Math.cos(p * D2R) * R / r; return k.pt(r * Math.sin(t), V.y - r * Math.cos(t)); };
      const eng = (lon, la) => { const q = M.project('ptolemy2', lon, la); return k.pt(R * q[0], R * q[1]); };
      const circ = lon => { const a = on(lat.T, lon), b = on(lat.S, lon), c = on(lat.A, lon), o = g.circumcenter(a, b, c); return { a, b, c, o, r: g.dist(o, a) }; };
      const arcPar = (p, lonMax) => { const r = rho(p), t = lonMax * D2R * Math.cos(p * D2R) * R / r; return [r, -Math.PI / 2 - t, -Math.PI / 2 + t]; };
      k.given('The central meridian, graduated in true degrees (1° = ' + f1(R * D2R, 2) + '): the parallels of Thule (63° N), Syene (23°50′ N), the equator and anti-Meroë (16°25′ S), and the point V, 181⅚° above the equator, which is the centre of all the parallels.', () => {
        k.seg(k.pt(0, yAt(lat.A) - 15), k.pt(0, V.y + 10), { cls: 'given' });
        [[lat.T, 'Thule'], [lat.S, 'Syene'], [0, 'E'], [lat.A, 'anti-Meroë']].forEach(([p, nm]) => k.point(k.pt(0, yAt(p)), nm, p === 0 ? 'se' : 'sw', { r: 0.9, lo: { upright: true, size: 0.75, bg: true } }));
        k.point(V, 'V', 'e');
        k.frame(-175, yAt(lat.A) - 40, 175, V.y + 25);
      });
      k.step('compass', 'With centre V draw the arcs of the four parallels through their marks, each as long as the true 180° of its parallel: Ptolemy\'s world runs 90° of longitude either side of the centre.', () => {
        [lat.T, lat.S, 0, lat.A].forEach(p => { const [r, a0, a1] = arcPar(p, 90); k.arc(V, r, a0, a1, { cls: 'curve' }); });
      });
      k.step('dividers', 'On the arcs of Thule, Syene and anti-Meroë step off the true length of 30° of longitude three times each way from the centre: ' + [lat.T, lat.S, lat.A].map(p => f1(R * 30 * D2R * Math.cos(p * D2R)) + ' on ' + (p === lat.T ? 'Thule' : p === lat.S ? 'Syene' : 'anti-Meroë')).join(', ') + ' (R·30°·cos φ). Mark the points 30°, 60° and 90°.', () => {
        [lat.T, lat.S, lat.A].forEach(p => [30, 60, 90].forEach(l => { k.dot(on(p, l), { r: 0.8 }); k.dot(on(p, -l), { r: 0.8, cls: 'aux' }); }));
        [30, 60, 90].forEach(l => k.label(on(lat.T, l), String(l), 'n', { upright: true, size: 0.7, dist: 1.1 }));
      });
      const c90 = circ(90);
      k.step('straightedge', 'For the meridian of 90° E join its three points: the Thule point to the Syene point, and the Syene point to the anti-Meroë point (two chords).', () => {
        k.seg(c90.a, c90.b, { cls: 'cons' }); k.seg(c90.b, c90.c, { cls: 'cons' });
      });
      k.step('square', 'Bisect each chord at right angles (set square, or arcs with the compass). The two bisectors meet at Z, the centre of the circle through the three points.', () => {
        const m1 = g.mid(c90.a, c90.b), m2 = g.mid(c90.b, c90.c);
        [m1, m2].forEach(m => { const d = g.unit(g.sub(c90.o, m)); k.seg(g.sub(m, g.mul(d, 25)), g.add(c90.o, g.mul(d, 25)), { cls: 'cons' }); });
        k.right(m1, c90.b, c90.o, { r: 0.7 }); k.point(c90.o, 'Z', 'ne', { r: 0.9 });
      });
      k.step('compass', 'With centre Z and radius ZT (' + f1(c90.r) + ') draw the arc from the Thule point to the anti-Meroë point: it passes through the Syene point and is the meridian of 90° E.', () => {
        shortArc(k, c90.o, c90.a, c90.c, { cls: 'curve' });
      });
      k.step('compass', 'Do the same for 60°, for 30° and for the west side. The centres move out along the horizontal as the meridian nears the centre: Z lies ' + [60, 30].map(l => f1(circ(l).o.x) + ' to the right (' + l + '°)').join(', ') + '. The central meridian is the limit, a straight line.', () => {
        [-90, -60, -30, 30, 60].forEach(l => { const c = circ(l); shortArc(k, c.o, c.a, c.c, { cls: 'curve' }); });
      });
      k.step('compass', 'Finally draw the other parallels, every 10°, as arcs about V stopped by the outermost meridians.', () => {
        [60, 50, 40, 30, 20, 10, -10].forEach(p => { const q = eng(90, p); const r = rho(p), t = Math.atan2(q.x, V.y - q.y); k.arc(V, r, -Math.PI / 2 - t, -Math.PI / 2 + t, { cls: 'cons' }); });
      });
      k.note('Check against the engine: the point (60° from the centre, on the equator) lies ' + f1(eng(60, 0).x) + ' to the right of the centre and ' + f1(eng(60, 0).y) + ' above E.', () => {
        const q = eng(60, 0); k.dot(q, { open: true, r: 1.4 }); k.label(q, '60°, 0°', 'se', { upright: true, size: 0.7 });
      });
    }
  });

  /* ================================================================== a portolan rhumb network */
  Hyper.construction({
    id: 'hp-portolan-rhumbs',
    title: 'The rhumb network of a portolan chart: sixteen winds from a compass rose',
    tags: ['history', 'portolan', 'rhumb lines', 'compass rose', 'set square', 'dividers'],
    note: 'The sailing charts of the Mediterranean were covered with a web of straight lines, each marking one of the sixteen winds (or, on finer charts, the thirty-two points of the compass). They radiate from compass roses placed on a hidden circle; a navigator laid a ruler between two ports, slid it parallel to the nearest line through a rose and read the wind. The lines are straight on the sheet and are correct bearings only because the chart is the plane chart of the region: the web is exact for the small, nearly flat Mediterranean and deceives far to the north or across an ocean. Here, two roses and the net between them.',
    build(k) {
      const g = k.g, r = 80, A = k.pt(0, 0), B = k.pt(380, 60);
      const names = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const dirOf = j => g.dir((90 - 22.5 * j) * D2R);            // wind j: compass bearing 22.5° × j, clockwise from north
      const pt = (C, j, rr) => g.add(C, g.mul(dirOf(j), rr == null ? r : rr));
      k.given('Two compass roses to be drawn: the first at A, the second at B (a few hundred sea miles to the east and a little north). Take the sheet with north up.', () => {
        k.point(A, 'A', 'sw', { r: 1.0 }); k.point(B, 'B', 'sw', { r: 1.0 });
        k.frame(-210, -170, 520, 175);
      });
      k.step('tee', 'With the T-square draw the east–west diameter through A; with the set square against it, the north–south diameter. They are the winds E–W and N–S.', () => {
        k.line(A, g.add(A, k.pt(1, 0)), { cls: 'cons' });
        k.line(A, g.add(A, k.pt(0, 1)), { cls: 'cons' });
      });
      k.step('compass', 'About A draw the circle of the rose, radius ' + r + ': it cuts the four diameters at N, E, S and W.', () => {
        k.circle(A, r, { cls: 'given' });
        [0, 4, 8, 12].forEach(j => k.dot(pt(A, j), { r: 0.8 }));
        [['N', 0], ['E', 4], ['S', 8], ['W', 12]].forEach(([n, j]) => k.label(pt(A, j), n, j === 0 ? 'n' : j === 4 ? 'e' : j === 8 ? 's' : 'w', { upright: true, size: 0.8 }));
      });
      k.step('square', 'With the 45° set square draw the two diagonals through A: they give the winds NE–SW and NW–SE. The eight principal winds now cut the circle.', () => {
        [2, 14].forEach(j => k.line(A, pt(A, j), { cls: 'cons' }));
        [2, 6, 10, 14].forEach(j => k.dot(pt(A, j), { r: 0.8 }));
      });
      const X = g.circleCircle(pt(A, 0), r * 0.9, pt(A, 2), r * 0.9).sort((a, b) => b.y - a.y)[0];
      k.step('compass', 'To halve the 45° between N and NE: with the compass open to about ' + f1(r * 0.9, 0) + ' and the point first on N, then on NE, strike two arcs; they cross at X.', () => {
        const aN = g.angleOf(g.sub(X, pt(A, 0))), aE = g.angleOf(g.sub(X, pt(A, 2)));
        k.arc(pt(A, 0), r * 0.9, aN - 0.28, aN + 0.28, { cls: 'cons' }); k.arc(pt(A, 2), r * 0.9, aE - 0.28, aE + 0.28, { cls: 'cons' });
        k.point(X, 'X', 'ne', { r: 0.8 });
      });
      k.step('straightedge', 'Draw the line from A through X: it cuts the circle at the point NNE, 22.5° from north.', () => {
        k.line(A, X, { cls: 'cons' }); k.dot(pt(A, 1), { r: 0.8 });
      });
      k.step('dividers', 'Set the dividers to the chord from N to NNE and step it right round the circle: sixteen equal arcs. The new marks are the eight half-winds NNE, ENE, ESE, SSE, SSW, WSW, WNW and NNW.', () => {
        [1, 3, 5, 7, 9, 11, 13, 15].forEach(j => k.dot(pt(A, j), { r: 0.8 }));
      });
      k.step('straightedge', 'Join the remaining opposite half-wind marks through A (the NNE–SSW line is already there): three more diameters. The rose of A now has eight diameters, the sixteen winds; extend each across the sheet.', () => {
        [3, 5, 7].forEach(j => k.line(A, pt(A, j), { cls: 'cons' }));
      });
      k.step('square', 'The second rose at B has the same sixteen winds: slide the set square along the straightedge, laid on each wind of A in turn, and draw through B the parallel to it (eight lines). Wind lines of the same name are parallel on the chart.', () => {
        for (let j = 0; j < 8; j++) k.line(B, pt(B, j), { cls: 'cons' });
      });
      k.step('compass', 'Draw the circle of the rose about B with the same radius, and ink the sixteen points in the same manner as at A.', () => {
        k.circle(B, r, { cls: 'given' }); for (let j = 0; j < 16; j++) k.dot(pt(B, j), { r: 0.6 });
        k.label(pt(B, 0), 'N', 'n', { upright: true, size: 0.8 });
      });
      k.step('pencil', 'Ink the web: where lines of the two roses cross, the mesh divides the sea into diamonds and triangles. On a full chart the sixteen roses of a ring would add their lines in the same way. The course from A to B (the red line) runs at ' + f1(Math.atan2(B.x - A.x, B.y - A.y) * R2D) + '° from north: between the winds E and ENE, nearest to "east by north" (78.75°) of the thirty-two-point rose. A navigator finds it by laying a ruler on AB and sliding it, parallel, to the nearest rose.', () => {
        for (let j = 0; j < 8; j++) { k.line(A, pt(A, j), { cls: 'curve', width: 1.0, target: false }); k.line(B, pt(B, j), { cls: 'curve', width: 1.0, target: false }); }
        k.seg(A, B, { cls: 'red' });
      });
      k.note('The Italian names of the eight principal winds that a portolan chart writes at the ends of its rays: Tramontana (N), Greco (NE), Levante (E), Scirocco (SE), Ostro (S), Libeccio (SW), Ponente (W), Maestro (NW).', () => {
        const nm = { 0: 'Tramontana', 2: 'Greco', 4: 'Levante', 6: 'Scirocco', 8: 'Ostro', 10: 'Libeccio', 12: 'Ponente', 14: 'Maestro' };
        Object.keys(nm).forEach(j => { const q = pt(A, +j, r + 50); k.text(q.x, q.y, nm[j], { size: 0.62, upright: true, anchor: 'middle', bg: true }); });
        for (let j = 0; j < 16; j++) { const q = pt(A, j, r + 15); k.text(q.x, q.y, names[j], { size: 0.5, upright: true, anchor: 'middle', bg: true, fill: '#666' }); }
      });
    }
  });

  /* ================================================================== Mercator's parallels by adding secants */
  Hyper.construction({
    id: 'hp-mercator-secants',
    title: 'Mercator\'s parallels by adding secants with the dividers',
    tags: ['history', 'Mercator', 'secant', 'meridional parts', 'dividers', 'protractor'],
    note: 'The distance of a Mercator parallel from the equator is the sum, band by band, of the length of a band of meridian multiplied by the secant of its middle latitude. The secant is read off a drawing: a circle of radius equal to the band\'s length on the map (here the length of 15° of longitude), the tangent at its end, and a ray at the middle latitude of the band; the length of the ray out to the tangent is exactly the band\'s length times sec φ. Carried with the dividers up the central meridian, the lengths build the Mercator scale. Mercator worked in bands of one degree; with bands of fifteen degrees the result is less than 1 % out at 60° (Wright, 1599, tabulated it to the minute).',
    build(k) {
      const g = k.g, u = 8, dB = 15 * u;                                    // 1° of longitude = 8 units, so a band of 15° is 120
      const O = k.pt(-250, 0), bands = [7.5, 22.5, 37.5, 52.5];
      const trueY = la => u * Math.log(Math.tan(Math.PI / 4 + la * D2R / 2)) * R2D;
      const rays = bands.map(m => ({ m, X: g.add(O, k.pt(dB, dB * Math.tan(m * D2R))), len: dB / Math.cos(m * D2R) }));
      const stack = []; let y = 0; rays.forEach(r => { y += r.len; stack.push(y); });
      const Eq = k.pt(0, 0), W = 45 * u, top = trueY(60);
      k.given('The scale of the map: 1° of longitude is ' + u + ' units, so a band of 15° of latitude is d = ' + dB + ' units long on the globe. The equator, with the central meridian rising from its left end E; and the circle of radius d about O, with its tangent at the right.', () => {
        k.seg(k.pt(0, 0), k.pt(W, 0), { cls: 'given' }); k.point(Eq, 'E', 'sw');
        k.circle(O, dB, { cls: 'given' }); k.point(O, 'O', 'sw');
        k.seg(k.pt(O.x + dB, -10), k.pt(O.x + dB, dB * Math.tan(58 * D2R)), { cls: 'given' });
        k.seg(O, k.pt(O.x + dB, 0), { cls: 'cons' }); k.point(k.pt(O.x + dB, 0), 'E′', 'se', { r: 0.8 });
        k.label(k.pt(O.x + dB, dB * Math.tan(58 * D2R)), 'tangent', 'n', { upright: true, size: 0.8 });
        k.frame(-410, -90, W + 80, top + 60);
      });
      k.step('protractor', 'At O lay off the middle latitudes of the four bands, ' + bands.map(m => m + '°').join(', ') + ', from the horizontal OE′.', () => {
        rays.forEach(r => { const q = g.add(O, g.mul(g.unit(g.sub(r.X, O)), dB * 0.55)); k.dot(q, { r: 0.7 }); });
        ang(k, O, k.pt(O.x + dB, 0), rays[1].X, { r: 2.2 });
      });
      k.step('straightedge', 'Draw the four rays from O to the tangent. The length of the ray at the middle latitude m is d·sec m: ' + rays.map(r => f1(r.len, 1)).join(', ') + '.', () => {
        rays.forEach(r => { k.seg(O, r.X, { cls: 'cons' }); k.dot(r.X, { r: 0.7 }); });
        rays.forEach(r => k.label(r.X, r.m + '°', 'e', { upright: true, size: 0.7, dist: 0.8 }));
      });
      k.step('dividers', 'Take the first ray with the dividers and lay it up the central meridian from E; from that mark lay off the second, from the next the third, and so on. The four marks, at ' + stack.map(v => f1(v, 1)).join(', ') + ', are the parallels of 15°, 30°, 45° and 60° from E.', () => {
        stack.forEach((v, i) => { k.dot(k.pt(0, v), { r: 0.8 }); k.label(k.pt(0, v), (15 * (i + 1)) + '°', 'w', { upright: true, size: 0.75, dist: 0.9 }); });
      });
      const deg = []; { let yy = 0; for (let j = 1; j <= 15; j++) { yy += u / Math.cos((j - 0.5) * D2R); deg.push(yy); } }
      k.step('dividers', 'Mercator worked in bands of one degree. To see how that goes, step the first band again, degree by degree: lay off ' + u + ' sec 0.5° = ' + f1(u / Math.cos(0.5 * D2R), 3) + ', then ' + u + ' sec 1.5°, and so on, fifteen lengths each a little longer than the last, all carried on from the one before. The fifteenth mark falls at ' + f1(deg[14], 2) + ': the true 15° parallel is at ' + f1(trueY(15), 2) + ', and the single ray gave ' + f1(stack[0], 2) + '. The ticks are drawn to the left of the meridian.', () => {
        deg.forEach((v, j) => { k.dot(k.pt(-14, v), { r: 0.45 }); if ((j + 1) % 5 === 0 && j < 14) k.label(k.pt(-14, v), (j + 1) + '°', 'w', { upright: true, size: 0.6 }); });
      });
      k.step('tee', 'With the T-square draw the parallels through the marks, as far as 45° of longitude to the east.', () => {
        stack.forEach(v => k.seg(k.pt(0, v), k.pt(W, v), { cls: 'cons' }));
      });
      k.step('dividers', 'Along the equator step off 15° of longitude three times, ' + dB + ' units each time: the meridians at 15°, 30° and 45° E.', () => {
        [1, 2, 3].forEach(j => { k.dot(k.pt(j * dB, 0), { r: 0.8 }); k.label(k.pt(j * dB, 0), (15 * j) + '°', 's', { upright: true, size: 0.75, dist: 0.9 }); });
      });
      k.step('square', 'With the set square on the T-square draw the meridians as verticals through those marks, up to the top parallel. The graticule is a grid of rectangles that grow taller with latitude.', () => {
        [0, 1, 2, 3].forEach(j => k.seg(k.pt(j * dB, 0), k.pt(j * dB, stack[3]), { cls: 'cons' }));
      });
      k.note('The true Mercator ordinates, R·ln tan(45° + φ/2) with R = ' + f1(u * R2D, 1) + ', are ' + [15, 30, 45, 60].map(l => f1(trueY(l), 1)).join(', ') + ': the sums above are ' + stack.map((v, i) => f1(100 * (v - trueY(15 * (i + 1))) / trueY(15 * (i + 1)), 2) + ' %').join(', ') + ' off. The red ticks at the right mark the true positions; with bands of 1° the difference would be invisible.', () => {
        [15, 30, 45, 60].forEach(l => { const v = trueY(l); k.seg(k.pt(W, v), k.pt(W + 12, v), { cls: 'red' }); });
        k.label(k.pt(W + 12, trueY(60)), 'true', 'e', { upright: true, size: 0.7, fill: '#b03a2e' });
      });
    }
  });

  /* ================================================================== Lambert's projections of 1772 */
  Hyper.construction({
    id: 'hp-lambert-four',
    title: 'Four of Lambert\'s projections of 1772, side by side',
    tags: ['history', 'Lambert', 'conformal conic', 'equal-area', 'transverse Mercator', 'compass'],
    note: 'One region of the Earth (Europe, North Africa and the Middle East, 0° to 60° E and 15° to 60° N) in four of the seven projections that Lambert described in 1772, drawn from the same graticule of meridians and parallels every 10°. The small circles are Tissot\'s indicatrices of 500 km radius: how each map would show a circle on the ground. The figures are given, computed with the engine of the Map lab; the notes say how each is made by hand.',
    build(k) {
      const g = k.g, P = k.proj, M = P.maps, box = 200, gap = 36;
      const lon0 = 0, lon1 = 60, lat0 = 15, lat1 = 60, cLon = 30, cLat = 37;
      const panels = [
        { id: 'lambert-conformal-conic', opt: { lat1: 25, lat2: 50, lon0: cLon, lat0: cLat }, name: 'A  Conformal conic', ox: 0, oy: box + gap },
        { id: 'lambert-azimuthal', opt: { lon0: cLon, lat0: cLat }, name: 'B  Azimuthal equal-area', ox: box + gap, oy: box + gap },
        { id: 'lambert-cylindrical', opt: { lon0: cLon }, name: 'C  Cylindrical equal-area', ox: 0, oy: 0 },
        { id: 'transverse-mercator', opt: { lon0: cLon }, name: 'D  Transverse Mercator', ox: box + gap, oy: 0 }
      ];
      // each panel: the projected region, fitted to the box
      panels.forEach(p => {
        const pts = [];
        for (let lo = lon0; lo <= lon1; lo += 2) for (let la = lat0; la <= lat1; la += 2) { const q = M.project(p.id, lo, la, p.opt); if (q) pts.push(q); }
        const x0 = Math.min(...pts.map(q => q[0])), x1 = Math.max(...pts.map(q => q[0])), y0 = Math.min(...pts.map(q => q[1])), y1 = Math.max(...pts.map(q => q[1]));
        p.s = Math.min((box - 22) / (x1 - x0), (box - 22) / (y1 - y0));
        p.cx = p.ox + box / 2 - (x0 + x1) / 2 * p.s; p.cy = p.oy + box / 2 - (y0 + y1) / 2 * p.s;
        p.at = q => k.pt(p.cx + q[0] * p.s, p.cy + q[1] * p.s);
      });
      const draw = p => {
        const line = (pts, cls) => M.path(p.id, pts, p.opt).forEach(seg => k.curve(seg.map(q => { const r = p.at(q); return [r.x, r.y]; }), null, { cls: cls || 'curve', target: false, width: 1.1 }));
        for (let lo = lon0; lo <= lon1; lo += 10) line(range(lat0, lat1, 1).map(la => [lo, la]));
        for (let la = 20; la <= lat1; la += 10) line(range(lon0, lon1, 1).map(lo => [lo, la]));
        for (let la = 20; la <= 50; la += 15) for (let lo = 10; lo <= 50; lo += 20) {
          const t = M.tissot(p.id, lo, la, p.opt, 500 / P.geo.R); if (!t) continue;
          k.curve(M.ellipsePts(t, 36).map(q => { const r = p.at(q); return [r.x, r.y]; }), null, { cls: 'red', target: false, width: 1.0 });
        }
        k.label(k.pt(p.ox + 2, p.oy + box + 3), p.name, 'ne', { upright: true, size: 0.85, dist: 0.5 });
      };
      k.given('Four empty frames, one for each projection, and the region to draw: 0° to 60° E, 15° N to 60° N, with the centre at 30° E, 37° N.', () => {
        panels.forEach(p => k.rect(p.ox, p.oy, p.ox + box, p.oy + box, { cls: 'given' }));
        k.frame(-8, -8, 2 * box + gap + 8, 2 * box + gap + 28);
      });
      k.step('pencil', 'A. Lambert\'s conformal conic: the cone cuts the sphere along 25° N and 50° N. Meridians are straight lines meeting at the apex of the cone, parallels are circles about it, and the radius of the parallel at latitude φ is proportional to [tan(45° − φ/2)]ⁿ with n = ' + f1(Math.log(Math.cos(25 * D2R) / Math.cos(50 * D2R)) / Math.log(Math.tan(Math.PI / 4 + 25 * D2R) / Math.tan(Math.PI / 4 + 12.5 * D2R)), 3) + ': a radius for each parallel from a table, then the compass about the apex.', () => draw(panels[0]));
      k.step('pencil', 'B. The azimuthal equal-area, centred on 30° E, 37° N: a point at angular distance c from the centre is drawn at the distance 2R sin(c/2) — the chord, which the compass takes straight from the sphere\'s section — in the direction of its bearing.', () => draw(panels[1]));
      k.step('pencil', 'C. The cylindrical equal-area: the meridians equally spaced, and the parallel at latitude φ at the height R sin φ (drop a perpendicular from the section of the sphere onto the axis). Areas are true, shapes are flattened towards the poles.', () => draw(panels[2]));
      k.step('pencil', 'D. The transverse Mercator, with the central meridian 30° E: the Mercator projection turned so that its cylinder touches a meridian instead of the equator. The central meridian is a straight line of true scale; the others bend away from it; angles are true everywhere.', () => draw(panels[3]));
      k.note('Read the circles: in A and D (conformal) every circle stays a circle, but its size changes (in A away from the two standard parallels, in D away from the central meridian); in B and C (equal-area) every ellipse has the same area, but the shape changes, most at the edge of B and towards the top of C.', () => {
        [['angles true', 0], ['areas true', 1], ['areas true', 2], ['angles true', 3]].forEach(([t, i]) => k.label(k.pt(panels[i].ox + box - 5, panels[i].oy + 5), t, 'nw', { upright: true, size: 0.75, fill: '#0b4fa0' }));
      });
    }
  });

  /* ================================================================== a survey triangulation */
  Hyper.construction({
    id: 'hp-triangulation',
    title: 'A triangulation net from one measured baseline',
    tags: ['history', 'survey', 'triangulation', 'Ordnance Survey', 'protractor', 'straightedge'],
    note: 'Measuring long distances on the ground is slow and inaccurate, measuring angles with a theodolite is fast and accurate. So a survey measures only one baseline with great care, then chains triangles from it: from the two ends of any known side the angles to a new station fix its position. The Cassinis did it across France from 1733, the Ordnance Survey from William Roy\'s baseline on Hounslow Heath (1784), the Survey of India from Lambton\'s base near Madras (1802). A second baseline measured at the far end checks the whole chain. Here the angles are in whole degrees and the scale is 1 unit = 50 m.',
    build(k) {
      const g = k.g, u = 50, A = k.pt(0, 0), B = k.pt(120, 0);
      const fix = (P1, Q, aP, aQ, prev) => {
        const side = -Math.sign(g.cross(g.sub(Q, P1), g.sub(prev, P1))) || 1;     // on the far side from the previous station
        const dP = g.rot(g.unit(g.sub(Q, P1)), side * aP * D2R), dQ = g.rot(g.unit(g.sub(P1, Q)), -side * aQ * D2R);
        return g.lineLine(P1, g.add(P1, dP), Q, g.add(Q, dQ));
      };
      const C = fix(A, B, 62, 55, k.pt(60, -100));
      const Dd = fix(B, C, 48, 58, A), E = fix(C, Dd, 52, 60, B), F = fix(Dd, E, 55, 50, C), G = fix(E, F, 45, 63, Dd);
      const st = [['A', A, 62, 'B', B, 55, 'C', C], ['B', B, 48, 'C', C, 58, 'D', Dd], ['C', C, 52, 'D', Dd, 60, 'E', E], ['D', Dd, 55, 'E', E, 50, 'F', F], ['E', E, 45, 'F', F, 63, 'G', G]];
      const cen = g.centroid([A, B, C, Dd, E, F, G]);
      const dirName = p => { const v = g.sub(p, cen), a = Math.atan2(v.y, v.x) * R2D, nm = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se']; return nm[((Math.round(a / 45) % 8) + 8) % 8]; };
      k.given('The baseline AB, measured on the ground with the greatest care: 6000 m, which at 1 unit = 50 m is ' + f1(120) + ' units. North is up.', () => {
        k.seg(A, B, { cls: 'given' }); k.point(A, 'A', 'sw'); k.point(B, 'B', 'se');
        k.dim(A, B, '6000 m', { side: 'right', dist: 1.1 });
        const pts = [A, B, C, Dd, E, F, G]; const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
        k.frame(Math.min(...xs) - 30, Math.min(...ys) - 40, Math.max(...xs) + 45, Math.max(...ys) + 30);
      });
      st.forEach((t, i) => {
        const [n1, P1, a1, n2, Q, a2, n3, R3] = t;
        k.step('protractor', 'At ' + n1 + ' the theodolite gave an angle of ' + a1 + '° between ' + (i === 0 ? 'AB' : n1 + n2) + ' and the new station ' + n3 + '; at ' + n2 + ' the angle between ' + n2 + n1 + ' and ' + n2 + n3 + ' was ' + a2 + '°. Lay both off with the protractor and mark a point on each ray.', () => {
          const dP = g.unit(g.sub(R3, P1)), dQ = g.unit(g.sub(R3, Q));
          k.dot(g.add(P1, g.mul(dP, 38)), { r: 0.7 }); k.dot(g.add(Q, g.mul(dQ, 38)), { r: 0.7 });
          ang(k, P1, Q, g.add(P1, g.mul(dP, 30)), { label: a1 + '°', r: 1.0, labelDist: 1.3, size: 0.7, bg: true }); ang(k, Q, P1, g.add(Q, g.mul(dQ, 30)), { label: a2 + '°', r: 1.0, labelDist: 1.3, size: 0.7, bg: true });
        });
        k.step('straightedge', 'Draw the two rays through the marks: they cross at the new station ' + n3 + ' (' + f1(g.dist(P1, R3), 1) + ' units from ' + n1 + ', ' + f1(g.dist(Q, R3), 1) + ' from ' + n2 + ' — by the sine rule).', () => {
          k.seg(P1, R3, { cls: i === 0 ? 'thick' : 'cons' }); k.seg(Q, R3, { cls: 'cons' }); k.point(R3, n3, dirName(R3), { r: 0.9, lo: { dist: 1.7 } });
          if (i > 0) k.seg(P1, Q, { cls: 'thick' });
        });
      });
      const d = g.dist(F, G);
      k.step('ruler', 'Measure the last side FG on the drawing: ' + f1(d, 1) + ' units, or ' + f1(d * u, 0) + ' m on the ground. A second baseline, measured at that end of the chain, should agree with it; the surveyors compared the two and spread the small difference over the whole net.', () => {
        k.seg(F, G, { cls: 'thick' }); k.dim(F, G, f1(d * u, 0) + ' m', { side: 'right', dist: 2.4, size: 0.8 });
      });
      k.note('Each new triangle needs only two measured angles, because the third follows from their sum (180° in a flat triangle). On a large survey the triangles lie on a curved Earth and their angles add up to a little more than 180° — the spherical excess, about one second of arc for every 200 km² — which the computers allowed for.', () => {
        const c = g.centroid([A, B, C]); k.text(c.x, c.y, '62° + 55° + 63° = 180°', { size: 0.6, upright: true, anchor: 'middle', bg: true });
      });
    }
  });

  /* ================================================================== the UTM zones */
  Hyper.construction({
    id: 'hp-utm-zones',
    title: 'The layout of the UTM zones and bands: from 12° W to 48° E',
    tags: ['UTM', 'transverse Mercator', 'zones', 'grid', 'T-square', 'dividers'],
    note: 'The Universal Transverse Mercator system cuts the world between 80° S and 84° N into sixty zones, each 6° of longitude wide, numbered from 1 at 180° W eastwards, and into twenty latitude bands lettered from C to X (omitting I and O), each 8° high except the last, X, which is 12°. In each zone the Earth is mapped by a transverse Mercator projection about the middle meridian of the zone with its scale reduced to 0.9996 there, and every point is given in metres: an easting measured from a false origin 500 000 m west of the middle meridian, and a northing measured from the equator (plus 10 000 000 m south of it). This drawing lays out ten zones, 29 to 38, which cover Western Europe, the Mediterranean and the Middle East, in plain longitude and latitude.',
    build(k) {
      const g = k.g, u = 7, lonW = -12, zones = range(29, 38, 1);
      const X = lon => (lon - lonW) * u, Y = lat => lat * u;
      const cm = z => 6 * z - 183, band = ['N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X'], lats = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 84];
      k.given('The equator and the meridian of 12° W, the left-hand edge, with the scale of 1° = ' + u + ' units. The window runs from 12° W to 48° E and from the equator to 84° N.', () => {
        k.seg(k.pt(0, 0), k.pt(X(48), 0), { cls: 'given' }); k.seg(k.pt(0, 0), k.pt(0, Y(84)), { cls: 'given' });
        k.point(k.pt(0, 0), '12° W', 'sw', { r: 0.9, lo: { upright: true, size: 0.7 } });
        k.frame(-40, -120, X(48) + 30, Y(84) + 30);
      });
      k.step('dividers', 'Set the dividers to 6° (' + 6 * u + ' units) and step along the equator from the left edge ten times: the eleven boundaries of the zones 29 to 38.', () => {
        for (let j = 1; j <= 10; j++) k.dot(k.pt(j * 6 * u, 0), { r: 0.8 });
      });
      k.step('square', 'With the set square on the T-square draw the boundaries as verticals from the equator to the top edge (84° N).', () => {
        for (let j = 1; j <= 10; j++) k.seg(k.pt(j * 6 * u, 0), k.pt(j * 6 * u, Y(84)), { cls: 'cons' });
      });
      k.step('ruler', 'On the left edge lay off the bands: 8° (' + 8 * u + ' units) each, then the last band X of 12°. The marks are at ' + lats.slice(1).map(l => l + '°').join(', ') + '.', () => {
        lats.slice(1).forEach(l => k.dot(k.pt(0, Y(l)), { r: 0.8 }));
      });
      k.step('tee', 'With the T-square draw the band boundaries across the window.', () => {
        lats.slice(1).forEach(l => k.seg(k.pt(0, Y(l)), k.pt(X(48), Y(l)), { cls: 'cons' }));
      });
      k.step('dividers', 'Halve each zone with the dividers: the middle meridian lies 3° from each boundary. Their longitudes are ' + zones.map(z => cm(z) + '°').join(', ') + ' (the formula 6 × zone − 183).', () => {
        zones.forEach(z => k.dot(k.pt(X(cm(z)), 0), { r: 0.8 }));
      });
      k.step('square', 'Draw the middle meridians, dashed, and write the zone numbers along the top and the band letters along the left.', () => {
        zones.forEach(z => { k.seg(k.pt(X(cm(z)), 0), k.pt(X(cm(z)), Y(84)), { cls: 'cons', dash: true }); k.label(k.pt(X(cm(z)), Y(84)), String(z), 'n', { upright: true, size: 0.8 }); });
        band.forEach((b, i) => k.label(k.pt(0, (Y(lats[i]) + Y(lats[i + 1])) / 2), b, 'w', { upright: true, size: 0.8 }));
      });
      const W = Hyper.world;
      k.step('pencil', 'Mark Israel: zone 36 (30° E to 36° E, middle meridian 33° E). Jerusalem (31.8° N) lies in band R and Tel Aviv (32.1° N), just across the 32° line, in band S: the grid squares 36R and 36S.', () => {
        const jer = W.city('Jerusalem'), tlv = W.city('Tel Aviv');
        k.hatch([k.pt(X(30), 0), k.pt(X(36), 0), k.pt(X(36), Y(84)), k.pt(X(30), Y(84))], { angle: Math.PI / 4, gap: 2.2, stroke: '#9bb7d6', outline: false });
        [[jer, 'Jerusalem', 'se'], [tlv, 'Tel Aviv', 'nw']].forEach(([c, nm, at]) => { k.point(k.pt(X(c.lon), Y(c.lat)), nm, at, { r: 0.9, lo: { upright: true, size: 0.7 } }); });
      });
      k.note('In the zone the scale along the middle meridian is 0.9996, rises to exactly 1 about 180 km to each side, and reaches 1.0010 at the edge of the zone on the equator: the cylinder cuts the sphere in two lines instead of touching it. An easting of 500 000 m is the middle meridian, so no coordinate is negative.', () => {
        k.text(X(33), Y(78), '36 = 30°–36° E', { size: 0.8, upright: true, anchor: 'middle', bg: true });
        // all sixty zones at a small scale (1° = 1 unit), with the window of this drawing marked
        const y0 = -95, y1 = -65, x0 = 20;
        for (let z = 0; z <= 60; z++) k.seg(k.pt(x0 + 6 * z, y0), k.pt(x0 + 6 * z, y1), { cls: 'aux' });
        k.seg(k.pt(x0, y0), k.pt(x0 + 360, y0), { cls: 'cons' }); k.seg(k.pt(x0, y1), k.pt(x0 + 360, y1), { cls: 'cons' });
        k.rect(x0 + 6 * 28, y0, x0 + 6 * 38, y1, { cls: 'curve', fill: 'rgba(11,79,160,0.12)' });
        [1, 10, 20, 30, 40, 50, 60].forEach(z => k.text(x0 + 6 * (z - 0.5), y1 + 8, String(z), { size: 0.6, upright: true, anchor: 'middle' }));
        k.text(x0 + 180, y0 - 12, 'all sixty zones, 180° W to 180° E (the window above is zones 29–38)', { size: 0.65, upright: true, anchor: 'middle' });
      });
    }
  });
})();
