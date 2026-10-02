/* HYPER-PROJECTIONS · constructions/reference.js — reference constructions for the writers.
 *
 *   isometric-cube      a cube in isometric drawing with T-square, 30° set square and dividers
 *   isometric-circle    the four-centre ellipse for a circle in an isometric face, with compass
 *   mercator-graticule  the Mercator graticule laid off from a table of meridional parts, and a rhumb line
 *   astrolabe-plate     the plate of an astrolabe (the stereographic sky for one latitude): tropics and horizon
 *                       found with straightedge and compass from the inscribed-angle construction
 * Read HYPER-PROJECTIONS/AUTHORING.md: every step names the tool it is made with, the geometry is computed
 * (k.g), never guessed, and the given data is drawn in the first step so that the board can check each stroke.
 */
Hyper.construction({
  id: 'isometric-cube',
  title: 'A cube in isometric drawing',
  tags: ['isometric', 'set square', 'dividers'],
  note: 'This is the full-scale *isometric drawing*: the true edge a is laid off along all three axes. The true isometric *projection* is the same picture at 0.8165 of the size. The far bottom corner falls exactly behind the near top corner, which is why only nine edges show.',
  build(k) {
    const g = k.g, a = 130, s30 = Math.sin(Math.PI / 6), c30 = Math.cos(Math.PI / 6);
    const O = k.pt(0, 0);
    const ux = k.pt(c30, s30), uz = k.pt(-c30, s30), uy = k.pt(0, 1);
    const X = g.add(O, g.mul(ux, a)), Z = g.add(O, g.mul(uz, a)), Y = g.add(O, g.mul(uy, a));
    const XY = g.add(X, g.mul(uy, a)), ZY = g.add(Z, g.mul(uy, a)), T = g.add(XY, g.mul(uz, a));
    k.given('The lowest corner O of the cube, the vertical through it, and the edge a (take it with the dividers).', () => {
      k.point(O, 'O', 's');
      k.line(O, k.pt(0, 1), { cls: 'cons' });
      const gA = k.pt(-a * 1.35, -a * 0.25), gB = k.pt(-a * 1.35 + a, -a * 0.25);
      k.seg(gA, gB, { cls: 'given' }); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, 'a', { dist: 1.1 });
      k.frame(-a * 1.5, -a * 0.45, a * 1.3, a * 2.25);
    });
    k.step('square', 'With the 30° set square against the T-square, draw the two isometric axes through O, at 30° to the horizontal, one to the right and one to the left.', () => {
      k.line(O, X, { cls: 'cons' }); k.line(O, Z, { cls: 'cons' });
      k.angle(O, k.pt(1, 0), X, { label: '30°', r: 1.3 });
      k.angle(O, Z, k.pt(-1, 0), { label: '30°', r: 1.3 });
    });
    k.step('dividers', 'Step the edge a from O along the three axes: X to the right, Z to the left, Y up.', () => {
      k.point(X, 'X', 'se'); k.point(Z, 'Z', 'sw'); k.point(Y, 'Y', 'e');
    });
    k.step('square', 'Through X and Z draw verticals; through Y draw the parallels to the two sloping axes.', () => {
      k.line(X, XY, { cls: 'cons' }); k.line(Z, ZY, { cls: 'cons' });
      k.line(Y, XY, { cls: 'cons' }); k.line(Y, ZY, { cls: 'cons' });
    });
    k.note('The verticals meet the parallels at the upper corners of the two front faces (the edge a is found again on each line).', () => {
      k.point(XY, 'X′', 'e'); k.point(ZY, 'Z′', 'w');
    });
    k.step('square', 'Through X′ draw the parallel to the left axis and through Z′ the parallel to the right axis: they meet at the far top corner T.', () => {
      k.line(XY, T, { cls: 'cons' }); k.line(ZY, T, { cls: 'cons' });
      k.point(T, 'T', 'n');
    });
    k.step('pencil', 'Line in the nine visible edges: the three from O, the two front faces and the top. The three hidden edges meet at the far bottom corner, behind Y.', () => {
      [[O, X], [O, Z], [O, Y], [X, XY], [Z, ZY], [Y, XY], [Y, ZY], [XY, T], [ZY, T]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
    });
    k.note('The hidden edges, dashed: from the far bottom corner (which projects onto Y) to X, to Z and to T.', () => {
      [[Y, X], [Y, Z], [Y, T]].forEach(([p, q]) => k.seg(p, q, { cls: 'cons', dash: true }));
    });
  }
});

Hyper.construction({
  id: 'isometric-circle',
  title: 'A circle in an isometric face: the four-centre ellipse',
  tags: ['isometric', 'ellipse', 'compass'],
  note: 'The four arcs meet the sides of the isometric square at their midpoints with the right tangents, so the drawing is tangent-smooth; it is an approximation — its long axis is about 1.155 D against the true 1.225 D (6 % short) and the curve strays up to 3 % of D from the true ellipse, shown dashed in the last step — good enough for a sketch, not for a template. Any circle in any of the three isometric faces is drawn the same way; only the rhombus turns.',
  build(k) {
    const g = k.g, D = 150, c30 = Math.cos(Math.PI / 6), s30 = Math.sin(Math.PI / 6);
    const Lf = k.pt(-D * c30, 0), Rt = k.pt(D * c30, 0), N = k.pt(0, -D * s30), F = k.pt(0, D * s30);
    const mLF = g.mid(Lf, F), mFR = g.mid(F, Rt), mRN = g.mid(Rt, N), mNL = g.mid(N, Lf);
    const cL = g.lineLine(N, mLF, F, mNL), cR = g.lineLine(N, mFR, F, mRN);
    k.given('The isometric square of side D (the rhombus with 30° sides) that circumscribes the circle, with its corners L, R, N, F.', () => {
      k.poly([Lf, F, Rt, N], { close: true, cls: 'given' });
      k.point(Lf, 'L', 'w'); k.point(Rt, 'R', 'e'); k.point(N, 'N', 's'); k.point(F, 'F', 'n');
      k.dim(N, Rt, 'D', { side: 'right', dist: 1.2 });
      k.frame(-D * 1.05, -D * 0.72, D * 1.05, D * 0.72);
    });
    k.step('dividers', 'Halve each side: the midpoints 1, 2, 3, 4 are where the ellipse will touch the sides.', () => {
      k.point(mLF, '1', 'nw'); k.point(mFR, '2', 'ne'); k.point(mRN, '3', 'se'); k.point(mNL, '4', 'sw');
    });
    k.step('straightedge', 'From the obtuse corner N draw lines to the midpoints 1 and 2 of the far sides; from F draw lines to 3 and 4. Each is perpendicular to the side it meets.', () => {
      k.seg(N, mLF, { cls: 'cons' }); k.seg(N, mFR, { cls: 'cons' }); k.seg(F, mRN, { cls: 'cons' }); k.seg(F, mNL, { cls: 'cons' });
      k.right(mLF, N, F, { r: 0.7 }); k.right(mRN, F, N, { r: 0.7 });
    });
    k.note('The lines cross on the long diagonal LR at the two small centres C₁ and C₂; N and F are the two large centres.', () => {
      k.point(cL, 'C_1', 'sw'); k.point(cR, 'C_2', 'se');
      k.seg(Lf, Rt, { cls: 'aux', dash: true });
    });
    k.step('compass', 'With centre N and radius N–1, draw the far arc from 1 to 2; with centre F and radius F–3, the near arc from 3 to 4.', () => {
      k.arc3(N, mFR, mLF, { cls: 'curve' });
      k.arc3(F, mNL, mRN, { cls: 'curve' });
    });
    k.step('compass', 'With centre C₁ and radius C₁–1, draw the small arc from 1 to 4; with centre C₂ and radius C₂–2, from 2 to 3.', () => {
      k.arc3(cL, mLF, mNL, { cls: 'curve' });
      k.arc3(cR, mRN, mFR, { cls: 'curve' });
    });
    k.note('The four arcs make the isometric ellipse. The true ellipse (major axis 1.2247 D along LR, minor 0.7071 D along NF) is shown dashed for comparison.', () => {
      k.ellipse(k.pt(0, 0), D * Math.sqrt(1.5) / 2, D * Math.SQRT1_2 / 2, { cls: 'aux', dash: true, n: 180 });
    });
  }
});

Hyper.construction({
  id: 'mercator-graticule',
  title: 'The Mercator graticule from a table, and a rhumb line',
  tags: ['map', 'Mercator', 'scale', 'T-square'],
  note: 'Mercator and Wright had no logarithms: they built the table of *meridional parts* by adding secants degree by degree. With the formula y = R ln tan(45° + φ/2) the table for R = 100 units is: 15° → 26.5, 30° → 54.9, 45° → 88.1, 60° → 131.7, 75° → 202.8. The rhumb line drawn in the last step crosses every meridian at the same angle: on the globe it spirals towards the pole.',
  build(k) {
    const g = k.g, R = 100, degW = R * Math.PI / 180;
    const Y = p => R * Math.log(Math.tan(Math.PI / 4 + p * Math.PI / 360));
    const lons = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
    const x0 = -180 * degW, x1 = 180 * degW, yTop = Y(75), yBot = -Y(75);
    const O = k.pt(0, 0);
    k.given('The equator, drawn as a horizontal line, with the central meridian through O and the scale: a degree of longitude is R·π/180 (here R = 100).', () => {
      k.seg(k.pt(x0, 0), k.pt(x1, 0), { cls: 'given' });
      k.point(O, 'O', 'se');
      k.label(k.pt(x1, 0), 'equator', 'ne', { upright: true, size: 0.8 });
      const gA = k.pt(x0, -yTop * 1.22), gB = k.pt(x0 + 30 * degW, -yTop * 1.22);
      k.seg(gA, gB); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, '30° of longitude', { dist: 1.1, size: 0.75 });
      k.frame(x0 - 20, -yTop * 1.4, x1 + 60, yTop * 1.22);
    });
    k.step('dividers', 'Step off the meridians along the equator every 30° of longitude, the same distance each time, from −180° to +180°.', () => {
      lons.forEach(lo => { if (lo !== 0) k.dot(k.pt(lo * degW, 0), { r: 0.7 }); });
    });
    k.step('tee', 'With the T-square and set square draw the meridians as verticals through the marks: on Mercator they are parallel, equally spaced lines.', () => {
      lons.forEach(lo => k.seg(k.pt(lo * degW, yBot), k.pt(lo * degW, yTop), { cls: 'cons' }));
      k.label(k.pt(x1, yTop), '180°', 'n', { upright: true, size: 0.75 }); k.label(k.pt(0, yTop), '0°', 'n', { upright: true, size: 0.75 }); k.label(k.pt(x0, yTop), '−180°', 'n', { upright: true, size: 0.75 });
    });
    k.step('ruler', 'On the central meridian lay off the parallels from the table of meridional parts, above and below the equator: 15° at 26.5, 30° at 54.9, 45° at 88.1, 60° at 131.7, 75° at 202.8 (for R = 100).', () => {
      [15, 30, 45, 60, 75].forEach(p => { k.dot(k.pt(0, Y(p)), { r: 0.7 }); k.dot(k.pt(0, -Y(p)), { r: 0.7 }); k.label(k.pt(0, Y(p)), p + '°', 'e', { upright: true, size: 0.75, dist: 0.8 }); });
    });
    k.step('tee', 'Draw the parallels as horizontals through those marks: the spacing grows with the latitude, by the secant.', () => {
      [15, 30, 45, 60, 75].forEach(p => { k.seg(k.pt(x0, Y(p)), k.pt(x1, Y(p)), { cls: 'cons' }); k.seg(k.pt(x0, -Y(p)), k.pt(x1, -Y(p)), { cls: 'cons' }); });
    });
    k.step('straightedge', 'A rhumb line: join London (0°, 51.5°) to New York (−74°, 40.7°) with a straight line. It crosses every meridian at the same angle, 258° from north — the course a ship steers.', () => {
      const A = k.pt(-0.13 * degW, Y(51.5)), B = k.pt(-74 * degW, Y(40.7));
      k.point(A, 'London', 'e', { lo: { upright: true, size: 0.75 } }); k.point(B, 'New York', 'sw', { lo: { upright: true, size: 0.75 } });
      k.seg(A, B, { cls: 'thick' });
      k.angle(A, k.pt(A.x, A.y + 40), B, { label: '258°', r: 1.1, labelDist: 1.3 });
    });
    k.note('The great circle between the same two cities, the shortest route, is the curve bowing north: a straight line only on the gnomonic chart.', () => {
      const pts = Hyper.proj.geo.greatCircle([-0.13, 51.5], [-74, 40.7], 64).map(p => [p[0] * degW, Y(p[1])]);
      k.curve(pts, null, { cls: 'curve', dash: true });
    });
  }
});

Hyper.construction({
  id: 'astrolabe-plate',
  title: 'The plate of an astrolabe: tropics and horizon for one latitude',
  tags: ['stereographic', 'astrolabe', 'compass', 'sky'],
  note: 'The astrolabe plate is the sky in stereographic projection from the south celestial pole onto the plane of the equator: every circle of the sky stays a circle, so the whole plate is made with a compass. The inscribed-angle construction gives the radius of any declination circle without a table: an arc of 90° − δ seen from the pole S on the rim subtends half that angle, so the line from S cuts the diameter at R tan((90° − δ)/2). The horizon for latitude φ passes through the points at declinations 90° − φ (north) and φ − 90° (south) on the meridian.',
  build(k) {
    const g = k.g, R = 110, phi = 32, eps = 23.44;
    const Pp = k.pt(0, 0), N = k.pt(0, R), Sp = k.pt(0, -R), E = k.pt(R, 0), Wp = k.pt(-R, 0);
    const rOf = dec => R * Math.tan((90 - dec) * Math.PI / 360);              // stereographic radius of a declination circle
    const onCircle = ang => g.polar(Pp, R, Math.PI / 2 - ang * Math.PI / 180); // the point of the equator circle at `ang` from north, clockwise
    const rCan = rOf(eps), rCap = rOf(-eps);
    const hN = rOf(90 - phi), hS = rOf(phi - 90);                                // horizon points: north at 90° − φ, south at φ − 90
    const HN = k.pt(0, hN), HS = k.pt(0, -hS), HC = g.mid(HN, HS), hR = g.dist(HC, HN);
    k.given('The pole P at the centre, the equator circle of radius R, the meridian NS and the line EW; the latitude φ = 32° and the obliquity ε = 23.44°.', () => {
      k.circle(Pp, R, { cls: 'given' });
      k.line(N, Sp, { cls: 'cons' }); k.line(E, Wp, { cls: 'cons' });
      k.point(Pp, 'P', 'ne'); k.point(N, 'N', 'n'); k.point(Sp, 'S', 's'); k.point(E, 'E', 'e'); k.point(Wp, 'W', 'w');
      k.label(k.pt(R * 0.72, R * 0.72), 'equator', 'ne', { upright: true, size: 0.8 });
      k.frame(-rCap * 1.08, -rCap * 1.08, rCap * 1.08, rCap * 1.08);
    });
    k.step('protractor', 'On the equator circle mark the points at 90° − ε = 66.56° and 90° + ε = 113.44° from N (measured at P): they stand for the tropics of Cancer (δ = +ε) and Capricorn (δ = −ε).', () => {
      const q1 = onCircle(90 - eps), q2 = onCircle(90 + eps);
      k.point(q1, 'Q_1', 'e'); k.point(q2, 'Q_2', 'e');
      k.angle(Pp, N, q1, { label: '66.6°', r: 0.9, labelDist: 1.6 });
    });
    k.step('straightedge', 'Join S to Q₁ and to Q₂; where the lines cross EW they cut off the radii of the two tropics (the angle at S is half the angle at P).', () => {
      const q1 = onCircle(90 - eps), q2 = onCircle(90 + eps);
      const t1 = g.lineLine(Sp, q1, E, Wp), t2 = g.lineLine(Sp, q2, E, Wp);
      k.seg(Sp, q1, { cls: 'cons' }); k.seg(Sp, q2, { cls: 'cons' });
      k.point(t1, '', 'n'); k.point(t2, '', 'n');
    });
    k.step('compass', 'With centre P draw the tropic of Cancer (radius P to the first cut) inside the equator and the tropic of Capricorn (radius to the second) outside: the outer limit of the plate.', () => {
      k.circle(Pp, rCan, { cls: 'given' }); k.circle(Pp, rCap, { cls: 'given' });
      k.label(k.pt(-rCan * 0.7, rCan * 0.72), 'Cancer', 'nw', { upright: true, size: 0.75 });
      k.label(k.pt(-rCap * 0.7, rCap * 0.72), 'Capricorn', 'nw', { upright: true, size: 0.75 });
    });
    k.step('protractor', 'For the horizon of latitude φ mark on the equator circle the points at φ = 32° from N (the north point of the horizon, δ = 90° − φ) and at 180° − φ = 148° (the south point, δ = φ − 90°).', () => {
      const q3 = onCircle(phi), q4 = onCircle(180 - phi);
      k.point(q3, 'Q_3', 'e'); k.point(q4, 'Q_4', 'e');
      k.angle(Pp, N, q3, { label: 'φ', r: 1.6, labelDist: 1.2 });
    });
    k.step('straightedge', 'Join S to Q₃ and to Q₄: the cuts on EW are the distances of the north and south points of the horizon from P.', () => {
      const q3 = onCircle(phi), q4 = onCircle(180 - phi);
      k.seg(Sp, q3, { cls: 'cons' }); k.seg(Sp, q4, { cls: 'cons' });
      const t3 = g.lineLine(Sp, q3, E, Wp), t4 = g.lineLine(Sp, q4, E, Wp);
      k.point(t3, '', 'n'); k.point(t4, '', 'n');
    });
    k.step('dividers', 'Carry the first distance up the meridian from P to H_N and the second down to H_S (it is longer than R: the south point lies outside the equator).', () => {
      k.point(HN, 'H_N', 'ne'); k.point(HS, 'H_S', 'se');
    });
    k.step('compass', 'Bisect H_N H_S for the centre C of the horizon and draw the horizon circle through H_N and H_S: everything inside it is above the horizon of latitude φ.', () => {
      k.point(HC, 'C', 'e');
      k.circle(HC, hR, { cls: 'curve' });
      k.label(k.pt(HC.x + hR * 0.7, HC.y - hR * 0.72), 'horizon', 'se', { upright: true, size: 0.8, fill: '#0b4fa0' });
    });
    k.note('The zenith Z lies on the meridian at δ = φ; the almucantars (circles of equal altitude) are drawn the same way between the horizon and Z. Lay the star map (the rete) over the plate and turn it: the astrolabe.', () => {
      const Z = k.pt(0, -rOf(phi)); k.point(Z, 'Z', 'ne');       // the zenith lies on the south side of the pole, inside the horizon
      [30, 60].forEach(alt => { const a1 = rOf(90 - phi + alt), a2 = rOf(phi - 90 + alt); const cA = k.pt(0, (a1 - a2) / 2), rA = (a1 + a2) / 2; k.circle(cA, rA, { cls: 'aux', dash: true }); });
    });
  }
});
