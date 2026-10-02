/* HYPER-PROJECTIONS · constructions/azimuthal-family.js — the azimuthal projections drawn by hand.
 *
 *   az-azimuthal-radii           the five radii of one point, taken from a single side view
 *   az-gnomonic-graticule        the polar gnomonic graticule from the tangent construction, and a great circle as a straight line
 *   az-stereographic-polar       the polar stereographic graticule by the inscribed-angle construction, compass only for the circles
 *   az-stereographic-equatorial  the equatorial stereographic graticule: meridians and parallels as circles
 *   az-orthographic-equatorial   the orthographic globe from two views (side view and plan), meridians as ellipses
 *   az-orthographic-oblique      the globe tilted towards the viewer: parallels as ellipses by the auxiliary-circle method
 *   az-equidistant-polar         the polar azimuthal equidistant graticule: equal rings with the dividers
 *   az-equidistant-oblique       an azimuthal equidistant map centred on a city: bearings and distances plotted
 *   az-lambert-polar             Lambert's azimuthal equal-area rings from the chords of a side view
 *   az-vertical-perspective      the view from a satellite: projectors from the eye in a side view
 *   az-two-point-equidistant     the two-point equidistant map: every place as the crossing of two compass arcs
 * Every point is computed (k.g and the engine's own map projections); the hand method is the construction, and the
 * engine's answer is used only to check or to draw the true curve for comparison.
 */
(function () {
  'use strict';
  const D = Math.PI / 180, SQ2 = Math.SQRT2;
  const f1 = x => x.toFixed(1);
  /* a point of a plan view whose pole is C: radius r, longitude lon (0 towards the bottom of the sheet, east anticlockwise) */
  const planPt = (C, r, lon) => ({ x: C.x + r * Math.sin(lon * D), y: C.y - r * Math.cos(lon * D) });

  /* ---------------------------------------------------------------------------------------------------------- 1 */
  Hyper.construction({
    id: 'az-azimuthal-radii',
    title: 'The five azimuthal radii of one point, from a single side view',
    tags: ['azimuthal', 'gnomonic', 'stereographic', 'orthographic', 'equidistant', 'Lambert'],
    note: 'Every azimuthal projection puts a place at a distance ρ from the centre of the map that depends only on its angular distance c from the centre point, and in the direction of its bearing. So one side view of the globe, cut through the centre point and the place, gives the distance for all of them at once. Here c = 60° and R = 100: gnomonic R tan c = 173.2, stereographic 2R tan(c/2) = 115.5, equidistant R c = 104.7, Lambert 2R sin(c/2) = 100.0, orthographic R sin c = 86.6. The dividers cannot straighten an arc, so the equidistant radius is stepped off with small chords (six chords of 10° give 104.6 instead of 104.7).',
    build(k) {
      const g = k.g, R = 100, c = 60;
      const O = k.pt(0, 0), N = k.pt(0, R), S = k.pt(0, -R), one = k.pt(1, R);
      const Q = k.pt(R * Math.sin(c * D), R * Math.cos(c * D));
      const Gp = g.lineLine(O, Q, N, one), T = g.lineLine(S, Q, N, one), U = k.pt(Q.x, R);
      const chord = g.dist(N, Q), L = k.pt(chord, R);
      const ch10 = 2 * R * Math.sin(5 * D), E = k.pt(6 * ch10, R);
      k.given('The globe seen from the side with the centre point N at the top: a circle of radius R about O, the antipode S at the bottom, and the map plane, a horizontal line touching the globe at N.', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(S, N, { cls: 'cons' });
        k.line(N, one, { cls: 'given' });
        k.point(O, 'O', 'w'); k.point(N, 'N', 'nw'); k.point(S, 'S', 's');
        k.label(k.pt(-R * 0.55, R), 'map plane', 'n', { upright: true, size: 0.8 });
        k.frame(-R * 1.2, -R * 1.2, R * 2.05, R * 1.35);
      });
      k.step('protractor', 'At O lay off the angle c = 60° from ON. It marks on the globe the place Q that lies 60° from the centre point. The five projections put Q at five different distances from N on the map plane.', () => {
        k.seg(O, Q, { cls: 'cons' });
        k.point(Q, 'Q', 'e');
        k.angle(O, Q, N, { label: 'c', r: 1.6 });
      });
      k.step('straightedge', 'Gnomonic, with the light at the centre O: extend the line OQ until it meets the map plane at G. Its distance from N is R tan c.', () => {
        k.seg(Q, Gp, { cls: 'cons' });
        k.point(Gp, 'G', { at: 's', cls: 'red' });
      });
      k.step('straightedge', 'Stereographic, with the light at the antipode S: draw the line SQ and extend it to the map plane at T. Its distance from N is 2R tan(c/2).', () => {
        k.seg(S, Q, { cls: 'cons' }); k.seg(Q, T, { cls: 'cons' });
        k.point(T, 'T', { at: 'n', cls: 'red' });
      });
      k.step('square', 'Orthographic, with the light at infinity: with the set square against the T-square draw the vertical through Q to the map plane at U. Its distance from N is R sin c.', () => {
        k.seg(Q, U, { cls: 'cons' });
        k.point(U, 'U', { at: 's', cls: 'red' });
      });
      k.step('straightedge', 'Lambert: join N to Q. This chord has length 2R sin(c/2).', () => {
        k.seg(N, Q, { cls: 'cons' });
      });
      k.step('compass', 'With centre N and radius NQ swing an arc down to the map plane. It lands at L, and NL is the Lambert radius.', () => {
        k.arc3(N, Q, L, { cls: 'cons' });
        k.point(L, 'L', { at: 'n', cls: 'red' });
      });
      k.step('dividers', 'Equidistant: set the dividers to a chord of 10° and step six times along the arc from N to Q, then six times along the map plane from N. The last step lands at E: the arc NQ laid straight.', () => {
        for (let i = 1; i <= 6; i++) { k.dot(k.pt(R * Math.sin(10 * i * D), R * Math.cos(10 * i * D)), { r: 0.55 }); k.dot(k.pt(i * ch10, R), { r: 0.55 }); }
        k.point(E, 'E', { at: 's', cls: 'red' });
      });
      k.note('Read off the five distances from N with the scale: orthographic 86.6, Lambert 100.0, equidistant 104.7, stereographic 115.5, gnomonic 173.2 (R = 100). Beyond c = 90° the gnomonic radius is infinite and the orthographic radius turns back: those two projections show only a hemisphere.', () => {
        k.dim(k.pt(0, R * 1.14), k.pt(Gp.x, R * 1.14), 'ρ, measured from N along the map plane', { ticks: true, size: 0.7 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 2 */
  const GN_R = 60, GN_C = [10, 20, 30, 40, 50, 60];
  const gnRho = c => GN_R * Math.tan(c * D);
  Hyper.construction({
    id: 'az-gnomonic-graticule',
    title: 'The polar gnomonic graticule from the tangent construction',
    tags: ['gnomonic', 'azimuthal', 'great circle', 'polar aspect'],
    note: 'The light is at the centre O of the globe and the map plane touches the globe at the pole. A parallel of latitude φ is a circle of colatitude c = 90° − φ, and the ray from O through it meets the plane at the distance R tan c from the pole: so the side view gives the radius of every ring, and the plan is a set of concentric circles with the meridians as straight radii. With R = 60 the rings for the parallels 80°, 70°, 60°, 50°, 40° and 30° N are at ' + GN_C.map(c => gnRho(c).toFixed(1)).join(', ') + '. The equator would be at infinity: the map never reaches it. A great circle is the intersection of the globe with a plane through O, so it appears as the intersection of that plane with the map plane: a straight line.',
    build(k) {
      const g = k.g, R = GN_R, P0 = k.pt(0, -196);
      const O = k.pt(0, 0), N = k.pt(0, R), one = k.pt(1, R);
      const cs = GN_C, rho = gnRho;
      const rim = c => k.pt(R * Math.sin(c * D), R * Math.cos(c * D));
      const Tc = c => k.pt(rho(c), R), Mc = c => k.pt(P0.x + rho(c), P0.y);
      const rOut = rho(60);
      k.given('The side view: a circle of radius R = 60 about O, the pole N at the top and the map plane touching the globe at N. Below it, the plan of the map with the pole P.', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(k.pt(0, -R), N, { cls: 'cons' });
        k.line(N, one, { cls: 'given' });
        k.point(O, 'O', 'w'); k.point(N, 'N', 'nw');
        k.point(P0, 'P', 'se');
        k.label(k.pt(-R * 1.1, R), 'map plane', 'nw', { upright: true, size: 0.8 });
        k.frame(-rOut - 16, P0.y - rOut - 22, rOut + 16, R + 30);
      });
      k.step('protractor', 'At O lay off the colatitudes 10°, 20°, 30°, 40°, 50° and 60° from ON. They mark the parallels 80°, 70°, 60°, 50°, 40° and 30° N on the side view of the globe.', () => {
        cs.forEach(c => { const q = rim(c); k.seg(O, q, { cls: 'aux' }); k.point(q, '', 'e'); });
      });
      k.step('straightedge', 'From O draw a ray through each mark and extend it to the map plane. The cuts T₁ … T₆ are the radii of the rings: NT = R tan c.', () => {
        cs.forEach((c, i) => { k.seg(rim(c), Tc(c), { cls: 'cons' }); k.point(Tc(c), 'T_' + (i + 1), { at: 'n', cls: 'red', lo: { size: 0.6, dist: i % 2 ? 1.5 : 0.8 } }); });
      });
      k.step('dividers', 'Carry each distance NT with the dividers to the plan: lay it off from P along the horizontal to the right.', () => {
        cs.forEach(c => k.point(Mc(c), '', 's'));
      });
      k.step('compass', 'With centre P draw a circle through each mark: the parallels of 80° to 30° N.', () => {
        cs.forEach(c => k.circle(P0, rho(c), { cls: 'curve' }));
        cs.slice(2).forEach(c => k.label(Mc(c), String(90 - c) + '°', 'se', { upright: true, size: 0.6, dist: 0.4 }));
      });
      k.step('protractor', 'From P draw the meridians every 30° with the protractor. They are straight radii, because every meridian plane passes through O and meets the map plane in a line through the pole. Greenwich runs down the sheet.', () => {
        for (let lon = 0; lon < 360; lon += 30) { const e = planPt(P0, rOut + 6, lon); k.seg(P0, e, { cls: 'cons' }); }
        [['0°', 0, 's'], ['90°E', 90, 'e'], ['180°', 180, 'n'], ['90°W', 270, 'w']].forEach(([t, lon, at]) => k.label(planPt(P0, rOut + 6, lon), t, at, { upright: true, size: 0.7 }));
      });
      const A = planPt(P0, rho(50), -60), B = planPt(P0, rho(50), 60);
      const dm = rho(50) * Math.cos(60 * D), latm = Math.atan(Math.tan(40 * D) / Math.cos(60 * D)) / D;
      k.step('straightedge', 'A great circle: mark A (40° N, 60° W) and B (40° N, 60° E) at ' + rho(50).toFixed(1) + ' from P and join them with the straightedge. The straight line is the shortest route between them.', () => {
        k.point(A, 'A', 'nw'); k.point(B, 'B', 'ne');
        k.seg(A, B, { cls: 'thick' });
        k.label(g.mid(A, B), 'great circle', 's', { upright: true, size: 0.7, dist: 0.9 });
      });
      k.note('The line AB passes ' + dm.toFixed(1) + ' from P: on the globe that is the point at latitude ' + latm.toFixed(1) + '° N. The shortest route between two places at 40° N climbs to 59° N, and only on this map is it straight.', () => {
        k.point(planPt(P0, dm, 0), '', { at: 's', open: true });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 3 */
  Hyper.construction({
    id: 'az-stereographic-polar',
    title: 'The polar stereographic graticule: the inscribed angle and compass-only circles',
    tags: ['stereographic', 'azimuthal', 'compass', 'inscribed angle', 'polar aspect'],
    note: 'The plan is drawn on the plane of the equator with the light at the south pole S, as on an astrolabe, so the equator is the circle of radius R. A parallel at colatitude c seen from S subtends half the angle that it subtends at the centre P (the inscribed-angle theorem), so the ray from S through the point at c on the rim cuts the diameter at R tan(c/2). In this projection every circle of the sphere is a circle on the map: the last steps find the image of a small circle from just two points, with the compass alone. (The tangent-plane version of the map is the same figure at twice the size.)',
    build(k) {
      const g = k.g, R = 100;
      const Pc = k.pt(0, 0), N = k.pt(0, R), S = k.pt(0, -R), E = k.pt(R, 0), W = k.pt(-R, 0);
      const onRim = c => g.polar(Pc, R, (90 - c) * D);
      const rho = c => R * Math.tan(c * D / 2);
      const cs = [15, 30, 45, 60, 75];
      const cut = c => k.pt(rho(c), 0);
      k.given('The rim circle of radius R about P (the equator seen from above), its horizontal diameter WE, the vertical NS and the light S at the bottom of the rim.', () => {
        k.circle(Pc, R, { cls: 'given' });
        k.line(W, E, { cls: 'cons' }); k.line(S, N, { cls: 'cons' });
        k.point(Pc, 'P', 'sw'); k.point(S, 'S', 's'); k.point(N, 'N', 'n'); k.point(E, 'E', 'e'); k.point(W, 'W', 'w');
        k.label(k.pt(-R * 0.707, R * 0.707), 'equator (the rim)', 'nw', { upright: true, size: 0.7 });
        k.frame(-R * 1.1, -R * 1.12, R * 1.1, R * 1.12);
      });
      k.step('protractor', 'At P lay off the colatitudes 15°, 30°, 45°, 60° and 75° from PN, to the right. The marks on the rim stand for the parallels 75° to 15° N.', () => {
        cs.forEach(c => k.point(onRim(c), '', 'ne'));
        k.angle(Pc, onRim(30), N, { label: 'c', r: 1.2 });
      });
      k.step('straightedge', 'Join S to each mark. The line cuts the diameter at the distance R tan(c/2) from P.', () => {
        cs.forEach(c => { k.seg(S, onRim(c), { cls: 'cons' }); });
        cs.forEach(c => k.point(cut(c), '', { at: 'n', r: 0.8 }));
      });
      k.step('compass', 'With centre P draw a circle through each cut: the parallels of 75°, 60°, 45°, 30° and 15° N. The rim itself is the equator.', () => {
        cs.forEach(c => k.circle(Pc, rho(c), { cls: 'curve' }));
      });
      k.step('protractor', 'Draw the meridians every 30° from P to the rim: straight radii at equal angles.', () => {
        for (let a = 0; a < 360; a += 30) k.seg(Pc, g.polar(Pc, R, a * D), { cls: 'cons' });
      });
      // a small circle of 20° radius about M (45° N, 90° E): the extreme points lie on the meridian 90° E, here along PE
      const cA = 25, cB = 65;
      const D1 = cut(cA), D2 = cut(cB), Cm = g.mid(D1, D2), rm = g.dist(D1, D2) / 2;
      k.step('straightedge', 'A small circle of angular radius 20° about the place M (45° N, 90° E): its extreme points on the meridian of M lie at colatitudes 25° and 65°. Mark them on the rim and join S to them: the cuts D₁ and D₂ are their images.', () => {
        k.seg(S, onRim(cA), { cls: 'cons' }); k.seg(S, onRim(cB), { cls: 'cons' });
        k.point(D1, 'D_1', 'nw'); k.point(D2, 'D_2', 'ne');
      });
      k.step('compass', 'The image of a circle is a circle, and this one is symmetrical about the meridian: so D₁D₂ is a diameter. Bisect it for the centre and draw the circle with the compass.', () => {
        k.point(Cm, 'C', 'n');
        k.circle(Cm, rm, { cls: 'curve' });
      });
      k.note('The true image, found by projecting 72 points of the small circle one by one, lies exactly on the compass circle (dashed). Note that the centre C of the image circle is not the image of the centre M of the small circle: M itself is at 41.4, while C is at 42.9.', () => {
        const a0 = [90 * D, 45 * D], pts = [];
        for (let i = 0; i <= 72; i++) {
          const p = Hyper.proj.sph.destination(a0, i * 5 * D, 20 * D);
          const lon = p[0] / D, c = 90 - p[1] / D, r = rho(c), q = planPt(Pc, r, lon);
          pts.push([q.x, q.y]);
        }
        k.curve(pts, null, { cls: 'aux', dash: true });
        k.point(cut(45), 'M', { at: 's', open: true });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 4 */
  Hyper.construction({
    id: 'az-stereographic-equatorial',
    title: 'The equatorial stereographic graticule: meridians and parallels as circles',
    tags: ['stereographic', 'azimuthal', 'compass', 'equatorial aspect', 'conformal'],
    note: 'The map is the hemisphere facing us, drawn inside its rim. The equator is the horizontal diameter, graduated at R tan(λ/2) by the inscribed-angle construction. Every meridian is a circle through the poles N and S, so its centre lies on the horizontal diameter, where the line from N at the angle λ to the horizontal cuts it (the centre is at R cot λ from P, on the side away from the meridian). Every parallel is a circle orthogonal to the rim: its centre lies where the tangent to the rim at the point of latitude φ cuts the vertical diameter, at R/ sin φ above P. Parallels near the equator have centres off the sheet; the last step shows how to draw those through three points.',
    build(k) {
      const g = k.g, R = 100;
      const Pc = k.pt(0, 0), N = k.pt(0, R), S = k.pt(0, -R), E = k.pt(R, 0), W = k.pt(-R, 0);
      const rimN = lam => g.polar(Pc, R, (90 - lam) * D);       // λ from N, clockwise
      const X = lam => k.pt(R * Math.tan(lam * D / 2), 0);       // the equator at longitude λ
      const Cm = lam => k.pt(-R / Math.tan(lam * D), 0);         // centre of the meridian circle (for λ east, on the left)
      const lams = [45, 60, 75];
      k.given('The rim circle of radius R about P, the horizontal diameter WE (the equator), the vertical NS (the central meridian) and the poles N and S.', () => {
        k.circle(Pc, R, { cls: 'given' });
        k.line(W, E, { cls: 'cons' }); k.line(S, N, { cls: 'cons' });
        k.point(Pc, 'P', 'sw'); k.point(S, 'S', 's'); k.point(N, 'N', 'n'); k.point(E, 'E', 'e'); k.point(W, 'W', 'w');
        k.frame(-R * 1.12, -R * 1.5, R * 1.12, R * 1.5);
      });
      k.step('protractor', 'To graduate the equator, lay off at P the angles 45°, 60° and 75° from PN, to the right, and mark them on the rim.', () => {
        lams.forEach(l => k.point(rimN(l), '', 'ne'));
        k.angle(Pc, rimN(60), N, { label: 'λ', r: 1.2 });
      });
      k.step('straightedge', 'Join S to the marks. The lines cut the equator at X₄₅, X₆₀ and X₇₅, at R tan(λ/2) from P; mirror them to the left of P. These are where the meridians of 45°, 60° and 75° E and W cross the equator.', () => {
        lams.forEach(l => { k.seg(S, rimN(l), { cls: 'cons' }); k.point(X(l), 'X_{' + l + '}', { at: 'n', cls: 'red', lo: { size: 0.65 } }); k.point(k.pt(-X(l).x, 0), '', { at: 'n', r: 0.8 }); });
      });
      k.step('square', 'The centre of the meridian of longitude λ: from N draw the line at the angle λ below the horizontal (the tangent to the rim at N). It cuts the equator at C, at R cot λ to the side of P away from the meridian. Do this for 45°, 60° and 75°.', () => {
        lams.forEach(l => { k.line(N, Cm(l), { cls: 'cons' }); k.point(Cm(l), 'C_{' + l + '}', { at: 'se', cls: 'red', lo: { size: 0.65 } }); });
      });
      k.step('compass', 'With centre C₄₅ and radius C₄₅N draw the arc from N to S through X₄₅; the same with C₆₀ and C₇₅. Repeat to the left of P, with the centres mirrored: the meridians of 45°, 60° and 75° E and W. The rim is the meridian of 90°.', () => {
        lams.forEach(l => { const C = Cm(l); k.arc3(C, S, N, { cls: 'curve' }); const Cl = k.pt(-C.x, 0); k.arc3(Cl, N, S, { cls: 'curve' }); });
      });
      const phis = [45, 60, 75];
      const Lp = ph => k.pt(R * Math.cos(ph * D), R * Math.sin(ph * D));
      const Cp = ph => k.pt(0, R / Math.sin(ph * D));
      k.step('protractor', 'For the parallels mark on the rim the latitudes 45°, 60° and 75° N, measured at P upwards from PE, on the right.', () => {
        phis.forEach(ph => k.point(Lp(ph), String(ph) + '°', { at: 'e' }));
        k.angle(Pc, E, Lp(60), { label: 'φ', r: 1.2 });
      });
      k.step('square', 'A parallel meets the rim at right angles, so its centre lies on the tangent to the rim at that point. With the set square draw each tangent (perpendicular to the radius) up to the vertical diameter: it cuts it at R / sin φ above P.', () => {
        phis.forEach(ph => { k.seg(Lp(ph), Cp(ph), { cls: 'cons' }); k.point(Cp(ph), 'C_{' + ph + '}', { at: 'e', cls: 'red', lo: { size: 0.65 } }); });
      });
      k.step('compass', 'With each centre and the radius to the rim point draw the arc across the disc, from the left rim point to the right one: the parallels of 45°, 60° and 75° N. The parallels south of the equator are the mirror images.', () => {
        phis.forEach(ph => { const C = Cp(ph), Lr = Lp(ph), Ll = k.pt(-Lr.x, Lr.y); k.arc3(C, Ll, Lr, { cls: 'curve' }); const C2 = k.pt(0, -C.y), a = k.pt(Lr.x, -Lr.y), b = k.pt(-Lr.x, -Lr.y); k.arc3(C2, a, b, { cls: 'curve' }); });
      });
      const ph = 30, tt = R * Math.tan(ph * D / 2), Lr30 = Lp(ph), Ll30 = k.pt(-Lr30.x, Lr30.y);
      k.note('Parallels near the equator have their centres far off the sheet (the 30° parallel: 200 above P). Draw them through three points: the rim points L and L′ at latitude 30°, and the point where the parallel crosses the central meridian, at R tan(φ/2) from P (26.8 for 30°), joining them with a French curve or a long beam compass.', () => {
        const C = Cp(ph);
        k.point(k.pt(0, tt), '', { at: 'n', open: true }); k.point(Lr30, '', { at: 'e', open: true }); k.point(Ll30, '', { at: 'w', open: true });
        k.arc3(C, Ll30, Lr30, { cls: 'aux', dash: true });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 5 */
  Hyper.construction({
    id: 'az-orthographic-equatorial',
    title: 'The orthographic globe from two views: side view and plan',
    tags: ['orthographic', 'azimuthal', 'equatorial aspect', 'descriptive geometry', 'ellipse'],
    note: 'The orthographic map is the globe seen from far away, which is exactly Monge’s method: the side view gives the heights and the plan gives the widths. In the equatorial aspect the globe is seen with its axis vertical, so a parallel of latitude φ is a horizontal chord at the height R sin φ, and a point of longitude λ on it lies at R cos φ sin λ from the central meridian, the distance that the plan view gives. The meridians are therefore ellipses with the semi-axes R sin λ and R. R = 80 in the drawing.',
    build(k) {
      const g = k.g, R = 80;
      const O = k.pt(0, 0), Pp = k.pt(0, 2.35 * R);
      const phis = [-60, -30, 0, 30, 60], lams = [30, 60];
      const hy = ph => R * Math.sin(ph * D), hx = ph => R * Math.cos(ph * D);
      const rimR = ph => k.pt(hx(ph), hy(ph));
      k.given('Below, the globe seen from the side with the axis vertical (its outline is the rim of the map), with the equator and the central meridian. Above it, the plan: the globe seen from the north pole, a circle of radius R about the pole Pp, with the line to the viewer pointing down the sheet.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(-R, 0), k.pt(R, 0), { cls: 'given' }); k.seg(k.pt(0, -R), k.pt(0, R), { cls: 'given' });
        k.circle(Pp, R, { cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(Pp, 'Pp', 'ne');
        k.point(k.pt(0, R), 'N', 'ne'); k.point(k.pt(0, -R), 'S', 's');
        k.label(k.pt(R, 0), 'equator', 'e', { upright: true, size: 0.75 });
        k.frame(-R * 1.2, -R * 1.34, R * 1.2, Pp.y + R * 1.12);
      });
      k.step('protractor', 'On the rim of the map mark the latitudes 30° and 60°, north and south, measured at O from the equator. They fix the heights R sin φ and the half-widths R cos φ.', () => {
        phis.filter(p => p !== 0).forEach(p => { k.point(rimR(p), '', 'e'); k.point(k.pt(-hx(p), hy(p)), '', 'w'); });
        k.angle(O, k.pt(R, 0), rimR(30), { label: 'φ', r: 1.5 });
      });
      k.step('tee', 'With the T-square draw the parallels as horizontal chords through the marks. In the equatorial aspect the parallels are straight lines.', () => {
        phis.filter(p => p !== 0).forEach(p => k.seg(k.pt(-hx(p), hy(p)), rimR(p), { cls: 'curve' }));
      });
      k.step('compass', 'In the plan draw the circles of radius R cos φ about Pp: take each radius with the compass from the middle of a chord to its end (R, 69.3, 40.0 for 0°, 30°, 60°). They are the parallels seen from above.', () => {
        [30, 60].forEach(p => k.circle(Pp, hx(p), { cls: 'cons' }));
      });
      k.step('protractor', 'In the plan draw the meridians as radii from Pp: 30° and 60° east of the central meridian, measured from the line towards the viewer (down the sheet).', () => {
        lams.concat([0, 90]).forEach(l => k.seg(Pp, planPt(Pp, R, l), { cls: 'cons' }));
        k.angle(Pp, k.pt(Pp.x, Pp.y - R), planPt(Pp, R, 30), { label: 'λ', r: 1.6 });
      });
      k.step('square', 'Where a meridian cuts each circle of the plan, drop a vertical with the set square onto the map. Its distance from the central meridian is R cos φ sin λ.', () => {
        lams.forEach(l => [0, 30, 60].forEach(p => { const q = planPt(Pp, hx(p), l); k.seg(q, k.pt(q.x, -hy(60)), { cls: 'cons' }); }));
      });
      k.step('pencil', 'Mark where each vertical meets the parallel of the same latitude (the equator and the chords at ±30° and ±60°) and draw the meridians of 30° and 60° E through the points and the poles, with a French curve: halves of ellipses, each with semi-axes R sin λ and R. Mirror them for the west.', () => {
        lams.forEach(l => {
          [-60, -30, 0, 30, 60].forEach(p => k.point(k.pt(hx(p) * Math.sin(l * D), hy(p)), '', { at: 'e', r: 0.8 }));
          const f = t => [R * Math.sin(l * D) * Math.cos(t), R * Math.sin(t)];
          k.curve(f, [-Math.PI / 2, Math.PI / 2], { cls: 'curve', n: 90 });
          k.curve(t => [-f(t)[0], f(t)[1]], [-Math.PI / 2, Math.PI / 2], { cls: 'curve', n: 90 });
          k.label(k.pt(R * Math.sin(l * D), R * 0.04), l + '°E', 'se', { upright: true, size: 0.6 });
        });
      });
      k.note('The meridians crowd towards the rim, where the globe turns away from the viewer: this is the foreshortening of the orthographic map. At the rim a degree of longitude is squeezed to nothing.', () => {
        k.label(k.pt(0, -R * 1.22), 'the globe turns away from the viewer towards the rim', 's', { upright: true, size: 0.65 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 6 */
  Hyper.construction({
    id: 'az-orthographic-oblique',
    title: 'The globe tilted towards the viewer: parallels as ellipses by the auxiliary-circle method',
    tags: ['orthographic', 'azimuthal', 'oblique aspect', 'ellipse', 'auxiliary circles'],
    note: 'Here the map is centred on latitude φ₀ = 30° N, so the north pole is tilted 30° towards the viewer. The polar axis stays on the vertical diameter, foreshortened by cos φ₀. A parallel of latitude φ is an ellipse with its centre on the axis at the height R sin φ cos φ₀, its semi-axes R cos φ (across) and R cos φ sin φ₀ (up); the equator is the largest of them, with semi-axes R and R sin φ₀. The meridians are ellipses too, through both poles, with the conjugate semi-diameters OE and ON′. Only the half of each curve on the near side of the globe is visible; the parallels of 60° and more (90° − φ₀) are seen whole. R = 90.',
    build(k) {
      const g = k.g, R = 90, f0 = 30;
      const sf = Math.sin(f0 * D), cf = Math.cos(f0 * D);
      const O = k.pt(0, 0), Np = k.pt(0, R * cf), Sp = k.pt(0, -R * cf), b0 = R * sf;
      /* an exact point of the oblique orthographic map; v is true when the point is on the near side */
      const pr = (ph, la) => { const p = ph * D, l = la * D; return { x: R * Math.cos(p) * Math.sin(l), y: R * (cf * Math.sin(p) - sf * Math.cos(p) * Math.cos(l)), v: sf * Math.sin(p) + cf * Math.cos(p) * Math.cos(l) >= -1e-9 }; };
      const A1 = g.polar(O, R, f0 * D), A2 = g.polar(O, R, (90 - f0) * D);
      k.given('The rim circle of radius R about O, the horizontal diameter and the vertical diameter (the central meridian, on which the polar axis also lies). The centre of the map is at latitude 30° N: the north pole is tilted 30° towards us.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(-R, 0), k.pt(R, 0), { cls: 'given' }); k.seg(k.pt(0, -R), k.pt(0, R), { cls: 'given' });
        k.point(O, 'O', 'sw');
        k.frame(-R * 1.18, -R * 1.18, R * 1.18, R * 1.18);
      });
      k.step('protractor', 'At O lay off 30° above the horizontal diameter (mark A₁) and 30° from the vertical diameter (mark A₂), on the right of the rim.', () => {
        k.seg(O, A1, { cls: 'cons' }); k.seg(O, A2, { cls: 'cons' });
        k.point(A1, 'A_1', 'e'); k.point(A2, 'A_2', 'e');
        k.angle(O, k.pt(1, 0), A1, { label: '30°', r: 2.2 });
      });
      k.step('tee', 'With the T-square carry the marks horizontally to the vertical diameter: A₂ gives the pole N′ at the height R cos 30° = 77.9, and A₁ the height R sin 30° = 45.0, the semi-minor axis of the equator ellipse. Mirror N′ below O for the south pole S′.', () => {
        k.seg(A1, k.pt(0, A1.y), { cls: 'cons' }); k.seg(A2, Np, { cls: 'cons' });
        k.point(Np, "N′", { at: 'nw', cls: 'red' }); k.point(Sp, "S′", { at: 'sw', cls: 'red' }); k.point(k.pt(0, b0), 'B', { at: 'nw', cls: 'red' });
      });
      k.step('compass', 'The equator is an ellipse with the semi-axes R and 45.0. Draw its two auxiliary circles about O: the rim (radius R) and the circle of radius 45.0.', () => {
        k.circle(O, b0, { cls: 'cons' });
      });
      const ts = [15, 30, 45, 60, 75];
      const Eq = t => k.pt(R * Math.cos(t * D), -b0 * Math.sin(t * D));
      k.step('protractor', 'In the lower right quadrant draw rays from O at 15°, 30°, 45°, 60° and 75° below the horizontal diameter, out to the rim. Each ray cuts both auxiliary circles.', () => {
        ts.forEach(t => k.seg(O, g.polar(O, R, -t * D), { cls: 'cons' }));
      });
      k.step('square', 'From the point where each ray cuts the rim, draw a vertical (set square on the T-square) down to the height of the point where the same ray cuts the small circle.', () => {
        ts.forEach(t => k.seg(g.polar(O, R, -t * D), Eq(t), { cls: 'cons' }));
      });
      k.step('tee', 'From the point where each ray cuts the small circle draw a horizontal with the T-square. It crosses the vertical at a point E of the equator ellipse. The 30° and 60° rays give the points where the meridians of 60° and 30° E cross the equator.', () => {
        ts.forEach(t => { const m = g.polar(O, b0, -t * D); k.seg(m, Eq(t), { cls: 'cons' }); k.point(Eq(t), '', { at: 'se', r: 0.8 }); });
      });
      const eq = [], eqBack = [];
      for (let la = -180; la <= 180; la += 3) { const p = pr(0, la); (p.v ? eq : eqBack).push([p.x, p.y]); }
      k.step('pencil', 'Trace the equator through the points, mirrored to the left: the near half is the lower half of the ellipse. The far half (dashed) is hidden behind the globe.', () => {
        k.curve(t => { const p = pr(0, t); return p.v ? [p.x, p.y] : null; }, [-180, 180], { cls: 'curve', n: 180 });
        k.curve(t => { const p = pr(0, t); return p.v ? null : [p.x, p.y]; }, [-180, 180], { cls: 'cons', dash: true, n: 180 });
      });
      const phis = [30, 60, -30];
      const cen = ph => k.pt(0, R * Math.sin(ph * D) * cf), semA = ph => R * Math.cos(ph * D);
      k.step('ruler', 'The parallels: take the half-width a = R cos φ from the side view of the globe (or a table: 77.9, 45.0, 77.9) and lay off the centre on the axis at R sin φ cos 30° (39.0, 67.5, −39.0 from O). The semi-minor axis is a sin 30°, half of a.', () => {
        phis.forEach(ph => { const c = cen(ph); k.point(c, String(ph) + '°', { at: 'e' }); k.point(k.pt(semA(ph), c.y), '', { at: 'e', r: 0.8 }); k.point(k.pt(-semA(ph), c.y), '', { at: 'w', r: 0.8 }); });
      });
      k.step('pencil', 'Draw the parallels of 30° N, 60° N and 30° S as ellipses through their extremities (the auxiliary-circle method, or a trammel). Each shows its near half as a heavy curve; the 60° parallel is seen whole, because it is exactly 90° − φ₀.', () => {
        phis.forEach(ph => { k.curve(t => { const p = pr(ph, t); return p.v ? [p.x, p.y] : null; }, [-180, 180], { cls: 'curve', n: 180 }); });
      });
      k.step('pencil', 'The meridians: each is an ellipse through N′, S′ and the point E where it crosses the equator. Draw those of 30° and 60° E and W through the points already found, with a French curve or an ellipse template.', () => {
        [30, 60, -30, -60].forEach(la => { k.curve(t => { const p = pr(t, la); return p.v ? [p.x, p.y] : null; }, [-90, 90], { cls: 'curve', n: 120 }); });
        [30, 60].forEach(la => { const p = pr(0, la); k.label(k.pt(p.x, p.y), la + '°E', 'se', { upright: true, size: 0.55 }); });
      });
      k.note('The graticule bunches towards the rim, where the globe turns away. Compare the equatorial aspect (parallels straight) and the polar aspect (parallels circles): the oblique aspect is the general case and the others are its limits, φ₀ = 0° and φ₀ = 90°.', () => {
        k.point(O, '', 'se');
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 7 */
  Hyper.construction({
    id: 'az-equidistant-polar',
    title: 'The polar azimuthal equidistant graticule: equal rings with the dividers',
    tags: ['azimuthal equidistant', 'azimuthal', 'dividers', 'polar aspect'],
    note: 'Distance from the centre is true: the ring for colatitude c is at R·c (c in radians), so 15° of latitude is always the same length, R π/12, and the rings are equally spaced. With R = 50 the spacing is 13.09 and the south pole, a single point on the globe, is the outer circle of radius 157.1. Every meridian is a straight radius with its true length, but a parallel in the southern hemisphere is stretched: the parallel of 45° S is drawn with the circumference 2π·R·3π/4 = 14.8 R, against 2π R cos 45° = 4.44 R on the globe: 3.3 times too long.',
    build(k) {
      const g = k.g, R = 50, Pc = k.pt(0, 0), r15 = R * Math.PI / 12;
      const rings = []; for (let i = 1; i <= 12; i++) rings.push(i);
      const mark = i => k.pt(0, -i * r15);
      k.given('The pole P and the ray PA straight down the sheet (the Greenwich meridian). The length r = Rπ/12 = 13.09 is the arc of 15° on a globe of radius R = 50; draw it as a ticked segment so that the dividers can carry it.', () => {
        k.point(Pc, 'P', 'ne');
        k.ray(Pc, k.pt(0, -1), { cls: 'cons' });
        const a = k.pt(-R * 3.4, -R * 3.1), b = k.pt(-R * 3.4 + r15, -R * 3.1);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, 'r = 15° of arc', { dist: 1.2, size: 0.7 });
        k.frame(-R * 3.35, -R * 3.35, R * 3.35, R * 3.35);
      });
      k.step('dividers', 'Set the dividers to r and step along the ray from P: twelve steps. The marks are the parallels 75° N, 60°, 45°, 30°, 15° N, the equator (sixth step), then 15° S … 75° S, and the south pole at the twelfth step.', () => {
        rings.forEach(i => k.point(mark(i), '', { at: 'e', r: 0.7 }));
        [[1, '75°N'], [3, '45°N'], [6, 'equator'], [9, '45°S'], [12, '90°S']].forEach(([i, t]) => k.label(mark(i), t, 'e', { upright: true, size: 0.6, dist: 1.5 }));
      });
      k.step('compass', 'With centre P draw a circle through each mark. The eleventh is the parallel 75° S, and the twelfth, the outer circle, is the south pole.', () => {
        rings.forEach(i => k.circle(Pc, i * r15, { cls: i === 6 ? 'thick' : i === 12 ? 'curve' : 'curve' }));
      });
      k.step('protractor', 'Draw the meridians every 30° with the protractor, from P to the outer circle. They are straight, and true in length from the pole to the pole.', () => {
        for (let a = 0; a < 360; a += 30) k.seg(Pc, g.polar(Pc, 12 * r15, (-90 + a) * D), { cls: 'cons' });
      });
      k.note('Compare this with the gnomonic and stereographic maps of the same hemisphere: here the rings are equally spaced. Straight lines through P are great circles and show true distances, but a straight line that misses P is not a great circle.', () => {
        k.label(planPt(Pc, 12 * r15 + 4, 0), '0°', 's', { upright: true, size: 0.7 }); k.label(planPt(Pc, 12 * r15 + 4, 90), '90°E', 'e', { upright: true, size: 0.7 });
        k.label(planPt(Pc, 12 * r15 + 4, 180), '180°', 'n', { upright: true, size: 0.7 }); k.label(planPt(Pc, 12 * r15 + 4, 270), '90°W', 'w', { upright: true, size: 0.7 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 8 */
  Hyper.construction({
    id: 'az-equidistant-oblique',
    title: 'An azimuthal equidistant map centred on a city: bearings and distances',
    tags: ['azimuthal equidistant', 'azimuthal', 'protractor', 'oblique aspect', 'bearing'],
    note: 'Centred on any place, the azimuthal equidistant map is a polar plot: each place is at its true distance from the centre, in the direction of its true bearing. So the oblique map needs no graticule to be made: take each place’s bearing and great-circle distance (from the spherical triangle formula, a table or a globe), lay off the bearing with the protractor from the north line and the distance with the scale. Here the centre is London and the scale is 5000 km = 39.2 units (R = 50). The faint coastlines are the engine’s, for comparison.',
    build(k) {
      const g = k.g, Rm = 50, P = Hyper.proj, W = Hyper.world, geo = P.geo;
      const C0 = W.city('London'), a = [C0.lon, C0.lat];
      const names = ['New York', 'Reykjavik', 'Rio de Janeiro', 'Cape Town', 'Cairo', 'Delhi', 'Tokyo', 'Sydney'];
      const pl = names.map(n => { const c = W.city(n), b = [c.lon, c.lat]; return { n, brg: geo.bearing(a, b), d: geo.distance(a, b) }; });
      const sc = d => d / geo.R * Rm;
      const at = (brg, r) => k.pt(r * Math.sin(brg * D), r * Math.cos(brg * D));
      const O = k.pt(0, 0), rimR = Math.PI * Rm;
      k.given('The centre London at O, the line to north straight up the sheet, and the scale: 5000 km is 39.2 units. Every place will be put at its bearing from north (clockwise) and its distance in kilometres.', () => {
        k.point(O, 'London', { at: 'nw', lo: { upright: true, size: 0.75 } });
        k.line(k.pt(0, -1), k.pt(0, 1), { cls: 'cons' });
        k.label(k.pt(0, rimR), 'N', 'n', { upright: true, size: 0.8 });
        const s0 = k.pt(-rimR * 1.1, -rimR * 1.12), s1 = k.pt(-rimR * 1.1 + sc(5000), -rimR * 1.12);
        k.seg(s0, s1, { cls: 'given' }); k.tick(s0, k.pt(1, 0)); k.tick(s1, k.pt(1, 0)); k.dim(s0, s1, '5000 km', { dist: 1.1, size: 0.7 });
        k.frame(-rimR * 1.18, -rimR * 1.22, rimR * 1.18, rimR * 1.18);
      });
      k.step('compass', 'Draw the distance circles about O with radii for 5000, 10000 and 15000 km (39.2, 78.5, 117.8) and the outer circle for 20015 km, half the circumference of the Earth: the rim is the antipode of London, a single point stretched into a circle.', () => {
        [5000, 10000, 15000].forEach(d => k.circle(O, sc(d), { cls: 'cons' }));
        k.circle(O, rimR, { cls: 'curve' });
        [5000, 10000, 15000].forEach(d => k.label(k.pt(0, sc(d)), String(d), 'ne', { upright: true, size: 0.55, dist: 0.4 }));
      });
      k.step('protractor', 'From the north line lay off the bearing of each place, clockwise, and draw the ray out to the rim. The bearings from London: ' + pl.map(p => p.n + ' ' + Math.round(p.brg) + '°').join(', ') + '.', () => {
        pl.forEach(p => k.seg(O, at(p.brg, rimR * 1.02), { cls: 'cons' }));
        k.angle(O, at(pl[0].brg, 1), k.pt(0, 1), { label: Math.round(pl[0].brg) + '°', r: 3.2, cls: 'aux' });
      });
      k.step('ruler', 'Lay off the distance on each ray with the scale: ' + pl.map(p => p.n + ' ' + (Math.round(p.d / 10) * 10) + ' km').join(', ') + '.', () => {
        pl.forEach(p => { const q = at(p.brg, sc(p.d)); k.point(q, p.n, { at: p.brg > 180 ? 'w' : 'e', lo: { upright: true, size: 0.6 } }); });
      });
      k.note('Each place is now where the azimuthal equidistant map puts it; the coastlines (hairlines) were drawn by the engine for comparison. A straight line from O to any place is the great circle, at true length; a line between two other places is not.', () => {
        W.lines().forEach(l => P.maps.path('azimuthal-equidistant', l.pts, { lon0: a[0], lat0: a[1] }, 0.6).forEach(seg => k.curve(seg.map(p => [p[0] * Rm, p[1] * Rm]), null, { cls: 'aux', nobounds: true })));
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 9 */
  Hyper.construction({
    id: 'az-lambert-polar',
    title: 'Lambert’s azimuthal equal-area rings from the chords of a side view',
    tags: ['Lambert', 'azimuthal', 'equal-area', 'compass', 'polar aspect'],
    note: 'The radius of the ring for colatitude c is the chord from the pole to the parallel, 2R sin(c/2): swing the chord down to the map plane with the compass. The hemisphere (c = 90°) fills the disc of radius R√2, whose area 2πR² is exactly that of the hemisphere, and the whole globe fills the disc of radius 2R (the diameter of the globe). Each ring has the area of the zone of the sphere that it represents, so the map is equal-area; the price is that shapes shear towards the rim. R = 60 here.',
    build(k) {
      const g = k.g, R = 60, O = k.pt(0, 0), N = k.pt(0, R), one = k.pt(1, R), P0 = k.pt(0, -235);
      const cs = [30, 60, 90, 120, 150, 180];
      const rim = c => k.pt(R * Math.sin(c * D), R * Math.cos(c * D));
      const rho = c => 2 * R * Math.sin(c * D / 2);
      const Lc = c => k.pt(rho(c), R);
      k.given('The side view: a circle of radius R = 60 about O, the pole N at the top and the map plane touching the globe at N. Below it, the plan of the map with the pole P.', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(k.pt(0, -R), N, { cls: 'cons' });
        k.line(N, one, { cls: 'given' });
        k.point(O, 'O', 'w'); k.point(N, 'N', 'nw'); k.point(P0, 'P', 'se');
        k.label(k.pt(-R * 1.4, R), 'map plane', 'n', { upright: true, size: 0.75 });
        k.frame(-2 * R - 12, P0.y - 2 * R - 20, 2 * R + 12, R + 25);
      });
      k.step('protractor', 'At O lay off the colatitudes 30°, 60°, 90°, 120°, 150° from ON, on the right of the rim. They are the parallels 60° N, 30° N, the equator, 30° S, 60° S, and the last mark is the south pole.', () => {
        cs.forEach(c => { k.seg(O, rim(c), { cls: 'aux' }); k.point(rim(c), '', 'e'); });
      });
      k.step('straightedge', 'Join N to each mark: these chords have the lengths 2R sin(c/2) (31.1, 60.0, 84.9, 103.9, 115.9 and 120.0).', () => {
        cs.forEach(c => k.seg(N, rim(c), { cls: 'cons' }));
      });
      k.step('compass', 'With centre N and the chord as radius, swing an arc from each mark down to the map plane. The cuts L₁ … L₆ are the radii of the rings.', () => {
        cs.forEach((c, i) => { k.arc3(N, rim(c), Lc(c), { cls: 'cons' }); k.point(Lc(c), 'L_' + (i + 1), { at: 'n', cls: 'red', lo: { size: 0.6, dist: i % 2 ? 1.7 : 0.8 } }); });
      });
      k.step('dividers', 'Carry each distance NL to the plan, from P along the horizontal to the right.', () => {
        cs.forEach(c => k.point(k.pt(P0.x + rho(c), P0.y), '', 's'));
      });
      k.step('compass', 'With centre P draw a circle through each mark. The third is the equator, of radius R√2 = 84.9; the sixth, the outer circle, is the south pole.', () => {
        cs.forEach((c, i) => k.circle(P0, rho(c), { cls: c === 90 ? 'thick' : 'curve' }));
      });
      k.step('protractor', 'Draw the meridians every 30° from P to the outer circle: straight radii, spaced equally.', () => {
        for (let a = 0; a < 360; a += 30) k.seg(P0, g.polar(P0, 2 * R, (-90 + a) * D), { cls: 'cons' });
      });
      k.note('Check the areas: the disc inside the equator ring has area π (R√2)² = 2πR², the hemisphere’s. The band between the rings for colatitude 60° and 90° (the zone between the parallels 30° N and the equator) has area π (2R² − R²) = π R², which is 2πR² × (sin 30° − 0) — the zone of the sphere, by Archimedes.', () => {
        k.label(planPt(P0, 2 * R + 4, 0), '0°', 's', { upright: true, size: 0.7 }); k.label(planPt(P0, 2 * R + 4, 90), '90°E', 'e', { upright: true, size: 0.7 });
        k.label(planPt(P0, 2 * R + 4, 180), '180°', 'n', { upright: true, size: 0.7 }); k.label(planPt(P0, 2 * R + 4, 270), '90°W', 'w', { upright: true, size: 0.7 });
      });
    }
  });

  /* --------------------------------------------------------------------------------------------------------- 10 */
  Hyper.construction({
    id: 'az-vertical-perspective',
    title: 'The view from a satellite: projectors from the eye in a side view',
    tags: ['vertical perspective', 'azimuthal', 'perspective', 'satellite', 'horizon'],
    note: 'The eye V is on the axis at P = 2 Earth radii from the centre O (one radius above the surface), and the map plane touches the globe at the sub-satellite point N. A place at angular distance c from N is projected along the line from V to the map plane, ρ = R (P − 1) sin c / (P − cos c). The horizon is where the line from V touches the globe: at cos c = 1/P, here c = 60°, a quarter of the sphere. The tangent point is found with Thales’ circle on the diameter OV. For a geostationary satellite P = 6.6 and the horizon is at c = 81°.',
    build(k) {
      const g = k.g, R = 70, Pv = 2;
      const O = k.pt(0, 0), N = k.pt(0, R), V = k.pt(0, Pv * R), one = k.pt(1, R);
      const rim = c => k.pt(R * Math.sin(c * D), R * Math.cos(c * D));
      const rho = c => (Pv - 1) * R * Math.sin(c * D) / (Pv - Math.cos(c * D));
      const cH = Math.acos(1 / Pv) / D;
      const th = g.mid(O, V);
      const H = g.circleCircle(O, R, th, g.dist(O, V) / 2).reduce((a, b) => (b.x > a.x ? b : a));
      const Pl = k.pt(R * 2.9, R * 0.1), pk = 2;
      const cs = [15, 30, 45];
      const T = c => g.lineLine(V, rim(c), N, one);
      k.given('The globe from the side: a circle of radius R = 70 about O, the sub-satellite point N at the top and the map plane touching the globe at N. The eye V is on the axis at 2R from O, one radius above the surface. To the right, the plan of the map with its centre Pl.', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(k.pt(0, -R), V, { cls: 'cons' });
        k.line(N, one, { cls: 'given' });
        k.point(O, 'O', 'w'); k.point(N, 'N', 'nw'); k.point(V, 'V', 'ne'); k.point(Pl, 'Pl', 'se');
        k.label(k.pt(R * 1.3, R), 'map plane', 'ne', { upright: true, size: 0.75 });
        k.frame(-R * 1.15, -R * 1.2, R * 4.35, R * 2.25);
      });
      k.step('compass', 'The horizon: draw the circle on OV as a diameter (Thales). It meets the globe at the points of tangency H, where VH touches the globe.', () => {
        k.circle(th, g.dist(O, V) / 2, { cls: 'cons' });
        k.point(H, 'H', { at: 'e', cls: 'red' });
        k.seg(V, H, { cls: 'cons' }); k.seg(O, H, { cls: 'cons' });
        k.right(H, O, V, { r: 0.8 });
      });
      k.step('protractor', 'On the globe mark the colatitudes 15°, 30° and 45° from ON, to the right.', () => {
        cs.forEach(c => k.point(rim(c), '', { at: 'e', r: 0.8 }));
        k.angle(O, H, N, { label: 'c_h', r: 1.8 });
      });
      k.step('straightedge', 'Draw the projectors from V through the marks and through H, until they meet the map plane. The cuts are the radii of the rings; the cut of VH is the radius of the horizon, 0.577 R, the edge of the picture.', () => {
        cs.forEach((c, i) => { k.seg(V, rim(c), { cls: 'cons' }); k.point(T(c), 'T_' + (i + 1), { at: 'n', cls: 'red', lo: { size: 0.55, dist: i % 2 ? 2.2 : 1 } }); });
        const Th = g.lineLine(V, H, N, one);
        k.point(Th, 'T_h', { at: 'ne', cls: 'red', lo: { size: 0.55, dist: 1.6 } });
      });
      k.step('dividers', 'Carry the distances NT to the plan and double each one (the plan is drawn at twice the scale of the side view, to be easier to read): lay them off from Pl along the horizontal to the right.', () => {
        cs.forEach(c => k.point(k.pt(Pl.x + pk * rho(c), Pl.y), '', 's'));
        k.point(k.pt(Pl.x + pk * rho(cH), Pl.y), '', 's');
      });
      k.step('compass', 'With centre Pl draw the circles of the parallels 75°, 60° and 45° N (colatitudes 15°, 30°, 45°) and the horizon circle: everything beyond it is hidden behind the globe.', () => {
        cs.forEach(c => k.circle(Pl, pk * rho(c), { cls: 'curve' }));
        k.circle(Pl, pk * rho(cH), { cls: 'thick' });
        k.label(k.pt(Pl.x, Pl.y - pk * rho(cH) - 3), 'horizon', 's', { upright: true, size: 0.7 });
      });
      k.step('protractor', 'Draw the meridians every 30° from Pl to the horizon circle.', () => {
        for (let a = 0; a < 360; a += 30) k.seg(Pl, g.polar(Pl, pk * rho(cH), a * D), { cls: 'cons' });
      });
      k.note('Moving V up the axis (P larger) pushes the horizon towards 90° and the picture towards the orthographic; moving it down towards the surface shrinks the visible cap. From the International Space Station (P = 1.07) the horizon is at c = 20°, 2250 km from the point below.', () => {
        k.dim(V, N, 'height above the plane (P − 1) R', { ticks: true, size: 0.65, dist: 1.4 });
      });
    }
  });

  /* --------------------------------------------------------------------------------------------------------- 11 */
  Hyper.construction({
    id: 'az-two-point-equidistant',
    title: 'The two-point equidistant map: every place as the crossing of two compass arcs',
    tags: ['two-point equidistant', 'azimuthal', 'compass', 'triangulation'],
    note: 'Fix two places A and B on the sheet at their true distance apart. Any other place is then fixed by its two distances, one from A and one from B, which are both true on this map: it is where the arc about A and the arc about B cross. There are two crossings, one on each side of the line AB; the place lies on the side where it actually is. The scale here is 100 units per radian of arc (1° = 1.745). A is London and B is Tokyo; the distances are the great-circle distances in degrees of arc.',
    build(k) {
      const g = k.g, Rm = 100, P = Hyper.proj, W = Hyper.world, geo = P.geo;
      const Ac = W.city('London'), Bc = W.city('Tokyo'), a = [Ac.lon, Ac.lat], b = [Bc.lon, Bc.lat];
      const dAB = geo.distance(a, b) / geo.R;
      const Ak = k.pt(-dAB * Rm / 2, 0), Bk = k.pt(dAB * Rm / 2, 0);
      const names = ['Cairo', 'Delhi', 'Singapore', 'Moscow', 'Cape Town', 'Anchorage'];
      const pl = names.map(n => {
        const c = W.city(n), p = [c.lon, c.lat];
        const dA = geo.distance(a, p) / geo.R, dB = geo.distance(b, p) / geo.R;
        const q = P.maps.project('two-point-equidistant', c.lon, c.lat, { A: a, B: b });
        const cand = g.circleCircle(Ak, dA * Rm, Bk, dB * Rm);
        const pt = cand.length ? cand.reduce((u, v) => (Math.abs(v.y - q[1] * Rm) < Math.abs(u.y - q[1] * Rm) ? v : u)) : k.pt(q[0] * Rm, q[1] * Rm);
        return { n, dA, dB, pt };
      });
      const deg = r => Math.round(r / D);
      const ext = pl.reduce((m, p) => Math.max(m, Math.abs(p.pt.x), Math.abs(p.pt.y)), dAB * Rm / 2);
      k.given('The two chosen places A (London) and B (Tokyo), set on a horizontal line at their true distance apart: ' + deg(dAB) + '° of arc, which is ' + (dAB * Rm).toFixed(1) + ' units at 100 units per radian. Mark the distance with the dividers.', () => {
        k.point(Ak, 'A', { at: 'sw' }); k.point(Bk, 'B', { at: 'se' });
        k.seg(Ak, Bk, { cls: 'given' });
        k.label(g.mid(Ak, Bk), 'great circle AB', 'n', { upright: true, size: 0.65, dist: 0.8 });
        k.frame(-ext * 1.2, -ext * 1.12, ext * 1.2, ext * 1.12);
      });
      k.step('compass', 'For each place take its distance from A (in degrees of arc: ' + pl.map(p => p.n + ' ' + deg(p.dA) + '°').join(', ') + ') and draw a short arc about A near where the place should be.', () => {
        pl.forEach(p => { const a0 = g.angleOf(g.sub(p.pt, Ak)); k.arc(Ak, p.dA * Rm, a0 - 0.1, a0 + 0.1, { cls: 'cons' }); });
      });
      k.step('compass', 'Take the distances from B (' + pl.map(p => p.n + ' ' + deg(p.dB) + '°').join(', ') + ') and draw the second arc about B for each place. The two arcs cross at the place.', () => {
        pl.forEach(p => { const a0 = g.angleOf(g.sub(p.pt, Bk)); k.arc(Bk, p.dB * Rm, a0 - 0.1, a0 + 0.1, { cls: 'cons' }); });
      });
      k.step('pencil', 'Mark the crossings and name them. Places on the north side of the great circle AB go above the line, those on the south side below: ' + (() => { const nn = pl.filter(p => p.pt.y > 0).map(p => p.n); return nn.length ? nn.join(' and ') + (nn.length > 1 ? ' lie' : ' lies') + ' north of the route from London to Tokyo, the others south of it.' : 'all of them lie south of the route from London to Tokyo.'; })(), () => {
        pl.forEach(p => k.point(p.pt, p.n, { at: p.pt.x > 0 ? 'e' : 'w', lo: { upright: true, size: 0.6 } }));
      });
      k.note('The coastlines (hairlines), drawn by the engine’s own formula, pass through the crossings. The map is not conformal and not equal-area; it is a compromise whose merit is that two chosen distances are right everywhere. Each place in the world is exactly the right distance from London and from Tokyo.', () => {
        W.lines().forEach(l => P.maps.path('two-point-equidistant', l.pts, { A: a, B: b }).forEach(seg => k.curve(seg.map(p => [p[0] * Rm, p[1] * Rm]), null, { cls: 'aux', nobounds: true })));
      });
    }
  });
})();
