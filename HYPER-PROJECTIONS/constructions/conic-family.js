/* HYPER-PROJECTIONS · constructions/conic-family.js
 *
 *   co-cone-unrolled      the cone tangent along a parallel, its apex found with a set square, and the cone cut and unrolled
 *                         into a fan of angle 360° sin φ₁: the simple conic graticule
 *   co-equidistant-conic  the secant (two-parallel) equidistant conic: the apex by similar triangles from the radii of the two
 *                         parallels, the parallels stepped off with dividers
 *   co-lambert-conic      Lambert's conformal conic from a table of ρ(φ), laid off with the scale
 *   co-albers-conic       Albers' equal-area conic from its table of ρ(φ)
 *   co-polyconic          the polyconic: every parallel an arc of its own cone, the centres found in the side view
 *   co-bonne-graticule    Bonne: the cone's apex, concentric arcs spaced truly, each arc divided truly, meridians traced
 *   co-werner-heart       Werner: the pole as centre, the heart
 *
 * Every point is computed (k.g and the formulas of the page); the final traced curves are the engine's own (kit.proj.maps),
 * so the hand method and the formula can be compared on the screen.
 */
(function () {
  'use strict';
  const PI = Math.PI, D = PI / 180, R = 100;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan;
  const MAPS = () => Hyper.proj.maps;

  /* a point of the fan about the apex A: distance rho, turned by ang (radians) east of the downward central meridian */
  const fanPt = (A, rho, ang) => ({ x: A.x + rho * sin(ang), y: A.y - rho * cos(ang) });
  /* the arc about A between two such angles (west to east, through the central meridian when a < 0 < b) */
  const fanArc = (k, A, rho, a, b, o) => k.arc(A, rho, -PI / 2 + a, -PI / 2 + b, o);
  const lab = (k, p, text, at, o) => k.label(p, text, at, Object.assign({ upright: true, size: 0.72 }, o || {}));
  const dot = (k, p, show) => k.dot(p, { r: 0.6, target: show !== false });

  /* ------------------------------------------------------------------------------------------------ cone unrolled */
  Hyper.construction({
    id: 'co-cone-unrolled',
    title: 'The cone tangent at a parallel, unrolled into a fan: the simple conic graticule',
    tags: ['conic', 'cone', 'sector', 'dividers', 'set square'],
    note: 'The sphere is touched by a cone along the parallel of latitude **φ₁ = 40°**. A tangent to a circle is perpendicular to the radius at the point of contact, so the set square gives the apex A at once: **OA = R / sin φ₁** and the slant height **AT = R cot φ₁**. Cut the cone along a generator and lay it flat: it becomes a fan of radius AT. Its arc must be as long as the circle of contact, 2πR cos φ₁, so the fan opens through **360° × (R cos φ₁)/(R cot φ₁) = 360° sin φ₁ = 231.4°**. The constant **n = sin φ₁** is the fraction of a full turn that the fan opens through: a meridian λ degrees from the central one is drawn **nλ** degrees from it on the fan. The parallels are arcs about A; the simple (one standard parallel) conic spaces them at the true distance, R times the difference in latitude in radians (17.45 for 10°), from the parallel of contact. The same drawing with φ₁ changed shows the whole family: φ₁ → 90° gives a flat disc (n = 1, the azimuthal equidistant map), φ₁ → 0° a strip (the cylinder, n = 0).',
    build(k) {
      const g = k.g, f1 = 40 * D, n = sin(f1);
      const O = k.pt(0, 0), T = k.pt(R * cos(f1), R * sin(f1)), T2 = k.pt(-T.x, T.y);
      const Ay = R / sin(f1), A = k.pt(0, Ay), rho1 = R / tan(f1);
      const A2 = k.pt(380, Ay);                                   // the apex of the fan
      const rho = ph => rho1 + R * (f1 - ph * D);                  // distance of the parallel of latitude ph from the apex
      const E = n * PI;                                           // half the opening of the fan (to the meridian ±180°)
      const lats = [80, 60, 40, 20, 0, -20], lons = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
      const rEnd = rho(-20);
      k.fontScale(0.9);
      k.given('The globe seen from the side as a circle of radius R = 100 about O, its polar axis and its equator, and the latitude φ₁ = 40° of the parallel along which the cone will touch it.', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(k.pt(0, -R * 1.15), k.pt(0, Ay + 30), { cls: 'cons' });
        k.seg(k.pt(-R * 1.15, 0), k.pt(R * 1.15, 0), { cls: 'cons' });
        k.point(O, 'O', 'sw'); lab(k, k.pt(0, R), 'N', 'se'); lab(k, k.pt(R * 1.15, 0), 'equator', 'se');
        k.text(0, -R * 0.55, 'φ₁ = 40°', { anchor: 'middle', upright: true, size: 0.95 });
        k.frame(-R * 1.4, -R * 1.2, A2.x + 240, Ay + 100);
      });
      k.step('protractor', 'Lay off the latitude φ₁ = 40° from the equator radius: the radius OT makes 40° with it, and T is the point of the circle where the cone will touch.', () => {
        k.seg(O, T, { cls: 'cons' }); dot(k, T); lab(k, T, 'T', 'ne');
        k.angle(O, k.pt(1, 0), T, { label: '40°', r: 1.5, labelDist: 1.1 });
      });
      k.step('square', 'Through T draw the tangent to the circle: with the set square put its right angle on T and one leg along OT, then draw along the other leg. Where the tangent meets the polar axis is the apex A of the cone.', () => {
        k.right(T, O, A, { r: 0.6 });
        k.seg(T, A, { cls: 'cons' }); dot(k, A); lab(k, A, 'A', 'ne');
      });
      k.step('dividers', 'Swing T across the axis for its mirror image T′ (same height, same distance from the axis), and join A to T′ and T to T′: the two generators of the cone and the circle of contact.', () => {
        dot(k, T2); lab(k, T2, 'T′', 'nw');
        k.seg(A, T2, { cls: 'given' }); k.seg(A, T, { cls: 'given' }); k.seg(T2, T, { cls: 'given' });
      });
      k.note('AT = R cot φ₁ = 119.2 is the slant height of the cone and TT′ = 2R cos φ₁ the diameter of the circle of contact. Every point of the parallel of latitude 40° is at the distance AT from the apex, measured along the cone.', () => {
        k.text(T.x + 14, (T.y + A.y) / 2 + 6, 'AT = R cot φ₁', { anchor: 'start', upright: true, size: 0.85 });
      });
      k.step('dividers', 'Take the slant height AT with the dividers and set it down from the new apex A′ of the flat map, straight down the sheet: the point P₁ is the central meridian\'s crossing with the standard parallel.', () => {
        dot(k, A2); lab(k, A2, 'A′', 'n');
        const P1 = fanPt(A2, rho1, 0); dot(k, P1); lab(k, P1, 'P_{1}', 'w');
      });
      k.step('compass', 'With centre A′ and radius A′P₁ draw the arc of the standard parallel through 231.4°: the cone cut along a generator and laid flat. Its length is the whole circle of contact, 2πR cos φ₁ = 481.', () => {
        fanArc(k, A2, rho1, -E, E, { cls: 'curve' });
        k.angle(A2, fanPt(A2, 1, -E), fanPt(A2, 1, E), { r: 1.0 });
        k.text(A2.x, A2.y + 100, 'the fan opens through', { upright: true, size: 0.75 });
        k.text(A2.x, A2.y + 76, '360° sin φ₁ = 231.4°', { upright: true, size: 0.9 });
      });
      k.step('protractor', 'Lay off the meridians: 30° of longitude is n × 30° = 19.3° on the fan (n = sin 40° = 0.643). Draw the rays from A′ at ±19.3°, ±38.6°, … up to ±115.7°, the two edges of the fan. The meridians are straight lines all through A′.', () => {
        lons.forEach(lo => { if (lo !== 0) k.seg(A2, fanPt(A2, rEnd, n * lo * D), { cls: 'cons' }); });
        k.seg(A2, fanPt(A2, rEnd, 0), { cls: 'cons' });
      });
      k.step('dividers', 'Step the true length of 20° of a meridian, R × 20° = 34.9, down the central meridian from P₁ and up from it: the radii of the parallels of 20°, 0°, −20° and of 60°, 80°.', () => {
        lats.forEach(p => { if (p !== 40) { const q = fanPt(A2, rho(p), 0); dot(k, q, p === 0); if (p !== 80) lab(k, q, p + '°', 'e', { dist: 1.2, size: 0.62 }); } });
        dot(k, fanPt(A2, rho(90), 0), false);
      });
      k.step('compass', 'With centre A′ draw the parallels as arcs through those marks, each from one edge of the fan to the other. The pole is the small arc of radius 31.9.', () => {
        lats.forEach(p => { if (p !== 40) fanArc(k, A2, rho(p), -E, E, { cls: 'cons' }); });
        fanArc(k, A2, rho(90), -E, E, { cls: 'cons' });
      });
      k.note('Close the fan by bringing the two edges together and you have the cone again, wrapped round the globe along the 40° parallel. On the map the scale is exactly 1 along that parallel and grows away from it; along every meridian it is 1 everywhere.', () => {
        k.seg(A2, fanPt(A2, rEnd, -E), { cls: 'thick' }); k.seg(A2, fanPt(A2, rEnd, E), { cls: 'thick' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ equidistant conic */
  Hyper.construction({
    id: 'co-equidistant-conic',
    title: 'The equidistant conic with two standard parallels (20° and 60°)',
    tags: ['conic', 'equidistant', 'similar triangles', 'dividers', 'de l\'Isle'],
    note: 'The cone cuts the globe along two parallels, φ₁ = 20° and φ₂ = 60°, and both must come out at their true length. If n is the fraction of a full turn the fan opens through, a parallel at distance ρ from the apex has, per radian of longitude, the length nρ; so n ρ₁ = R cos φ₁ and n ρ₂ = R cos φ₂. Hence **ρ₁ : ρ₂ = cos φ₁ : cos φ₂**, while the two parallels are R(φ₂ − φ₁) = 69.8 apart on the central meridian (the meridians are true to scale). The apex is the point that cuts the central meridian in that ratio, and **similar triangles** find it without arithmetic. The numbers: n = (cos φ₁ − cos φ₂)/(φ₂ − φ₁) = 0.6298, ρ₁ = 149.2, ρ₂ = 79.4, and the parallel of latitude φ lies at ρ = 184.1 − R φ (φ in radians). Joseph-Nicolas Delisle proposed this scheme for the maps of Russia in 1745.',
    build(k) {
      const g = k.g, f1 = 20 * D, f2 = 60 * D;
      const n = (cos(f1) - cos(f2)) / (f2 - f1), G = cos(f1) / n + f1;
      const r1 = R * cos(f1), r2 = R * cos(f2);
      const O = k.pt(0, 0), T1 = k.pt(r1, R * sin(f1)), T2 = k.pt(r2, R * sin(f2));
      const cx = 360, E0 = k.pt(cx, 0), P1 = k.pt(cx, R * f1), P2 = k.pt(cx, R * f2);
      const A = k.pt(cx, R * G);
      const rho = ph => R * (G - ph * D);
      const Bp = k.pt(cx + r1, P1.y), Cp = k.pt(cx + r2, P2.y);
      const E = n * PI / 2;                                        // the map runs to the meridians ±90°
      const lats = [80, 40, 0, -20], lons = [-90, -60, -30, 0, 30, 60, 90];
      const rEnd = rho(-20);
      k.fontScale(0.9);
      k.given('The globe seen from the side (radius R = 100 about O) with its polar axis and equator; on the right the central meridian of the map with the point E₀ where it crosses the equator. The standard parallels are φ₁ = 20° and φ₂ = 60°.', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(k.pt(0, -R * 1.1), k.pt(0, R * 1.2), { cls: 'cons' });
        k.seg(k.pt(-R * 1.1, 0), k.pt(R * 1.1, 0), { cls: 'cons' });
        k.point(O, 'O', 'sw');
        k.line(k.pt(cx, -R * 0.6), k.pt(cx, A.y + 40), { cls: 'cons' });
        k.point(E0, 'E_{0}', 'se');
        k.frame(-R * 1.3, -R * 1.0, cx + rEnd * sin(E) + 30, A.y + 60);
      });
      k.step('protractor', 'On the side view mark the points T₁ and T₂ of the circle at 20° and 60° from the equator radius.', () => {
        k.seg(O, T1, { cls: 'cons' }); k.seg(O, T2, { cls: 'cons' });
        dot(k, T1); lab(k, T1, 'T_{1}', 'se'); dot(k, T2); lab(k, T2, 'T_{2}', 'ne');
        k.angle(O, k.pt(1, 0), T1, { label: '20°', r: 2.6, labelDist: 0.9 }); k.angle(O, k.pt(1, 0), T2, { label: '60°', r: 1.0, labelDist: 1.5 });
      });
      k.step('tee', 'Draw horizontals from T₁ and T₂ to the axis. Their lengths r₁ = R cos 20° = 94.0 and r₂ = R cos 60° = 50.0 are the radii of the two parallels on the globe.', () => {
        k.seg(T1, k.pt(0, T1.y), { cls: 'cons' }); k.seg(T2, k.pt(0, T2.y), { cls: 'cons' });
        k.dim(k.pt(0, T1.y), T1, 'r_{1}', { side: 'right', dist: 1.0, size: 0.8 }); k.dim(k.pt(0, T2.y), T2, 'r_{2}', { side: 'left', dist: 1.0, size: 0.8 });
      });
      k.step('ruler', 'On the central meridian lay off the true arc lengths from E₀: R φ₁ = 34.9 for the parallel P₁ and R φ₂ = 104.7 for P₂. They are R(φ₂ − φ₁) = 69.8 apart, whatever the cone.', () => {
        dot(k, P1); lab(k, P1, 'P_{1}', 'sw'); dot(k, P2); lab(k, P2, 'P_{2}', 'sw');
      });
      k.step('tee', 'Through P₁ and P₂ draw short horizontals to the right.', () => {
        k.seg(P1, k.pt(cx + r1 + 20, P1.y), { cls: 'cons' }); k.seg(P2, k.pt(cx + r1 + 20, P2.y), { cls: 'cons' });
      });
      k.step('dividers', 'Carry r₁ from the side view onto the lower horizontal, from P₁ to B, and r₂ onto the upper one, from P₂ to C.', () => {
        dot(k, Bp); lab(k, Bp, 'B', 'se'); dot(k, Cp); lab(k, Cp, 'C', 'se');
      });
      k.step('straightedge', 'Draw the line B C and extend it until it meets the central meridian. That point is the apex A: the triangles A P₂ C and A P₁ B are similar, so AP₂ : AP₁ = r₂ : r₁ = cos 60° : cos 20°.', () => {
        k.seg(Bp, A, { cls: 'cons' }); dot(k, A); lab(k, A, 'A', 'ne');
      });
      k.step('compass', 'With centre A draw the two standard parallels: the arc through P₁ (radius 149.2) and the arc through P₂ (radius 79.4), each about 113° wide. Both are of true length.', () => {
        fanArc(k, A, rho(20), -E, E, { cls: 'curve' }); fanArc(k, A, rho(60), -E, E, { cls: 'curve' });
      });
      k.step('protractor', 'Lay off the meridians: n = 0.6298, so 30° of longitude is 18.9° at A. Draw the rays at 0°, ±18.9°, ±37.8° and ±56.7° from the vertical.', () => {
        lons.forEach(lo => k.seg(A, fanPt(A, rEnd, n * lo * D), { cls: 'cons' }));
      });
      k.step('dividers', 'Step the true length of 20° of a meridian, 34.9, along the central meridian beyond P₁ and P₂: the parallels 80°, 40°, 0° (the equator) and −20°.', () => {
        lats.forEach(p => { const q = fanPt(A, rho(p), 0); dot(k, q, false); lab(k, q, p + '°', 'e', { dist: 1.3, size: 0.62 }); });
      });
      k.step('compass', 'With centre A draw the arcs through those marks. The map is finished: meridians straight and equally spaced in angle, parallels concentric and equally spaced in distance.', () => {
        lats.forEach(p => fanArc(k, A, rho(p), -E, E, { cls: 'cons' }));
      });
      k.note('Check with the dividers: the arc of the 20° parallel between the central meridian and the 30° one must be R cos 20° × 30° (in radians) = 49.2 long, and the same on the 60° parallel it must be 26.2. Between the standard parallels the parallels are a little too short, outside them too long.', () => {
        k.dim(fanPt(A, rho(20), 0), fanPt(A, rho(20), n * 30 * D), '49.2', { side: 'right', dist: 2.2, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Lambert conformal conic */
  Hyper.construction({
    id: 'co-lambert-conic',
    title: 'Lambert\'s conformal conic (standard parallels 33° and 45°) from a table',
    tags: ['conic', 'conformal', 'Lambert', 'table', 'protractor'],
    note: 'The parallels of the conformal cone are not equally spaced, so they are laid off from a table: ρ = R F / tan^n(45° + φ/2), with n = ln(cos φ₁/cos φ₂) / ln[tan(45° + φ₂/2)/tan(45° + φ₁/2)] = **0.6305** and R F = 195.50 (R = 100). Distance from the apex: **80° → 42.1 · 70° → 65.5 · 60° → 85.2 · 50° → 103.4 · 45° → 112.2 · 40° → 120.9 · 33° → 133.0 · 30° → 138.3 · 20° → 156.2 · 10° → 175.0 · 0° → 195.5 · −10° → 218.4 · −20° → 244.8**. The pole is the apex itself (ρ = 0); the south pole is infinitely far away. Between 33° and 45° the parallels are a little too short (scale 0.98 at worst), outside they are too long, and the scale is the same in every direction at a point: the map is conformal.',
    build(k) {
      const f1 = 33 * D, f2 = 45 * D;
      const n = Math.log(cos(f1) / cos(f2)) / Math.log(tan(PI / 4 + f2 / 2) / tan(PI / 4 + f1 / 2));
      const F = cos(f1) * Math.pow(tan(PI / 4 + f1 / 2), n) / n;
      const rho = ph => R * F * Math.pow(1 / tan(PI / 4 + ph * D / 2), n);
      const A = k.pt(0, 0), E = n * PI / 2;
      const lats = [80, 70, 60, 45, 33, 20, 0, -20], lons = [-90, -60, -30, 0, 30, 60, 90];
      const rEnd = rho(-20);
      k.fontScale(0.85);
      k.given('The apex A at the top of the sheet and the central meridian running straight down from it. The scale of the sheet: R = 100 units for the globe\'s radius. Standard parallels 33° and 45°; n = 0.6305.', () => {
        k.point(A, 'A', 'ne'); k.seg(A, k.pt(0, -rEnd - 14), { cls: 'given' });
        k.frame(-rEnd * sin(E) - 10, -rEnd - 30, rEnd * sin(E) + 10, 24);
      });
      k.step('ruler', 'Lay off from A down the central meridian the distances ρ of the table: 42.1 for 80°, 65.5 for 70°, 85.2 for 60°, 112.2 for 45°, 133.0 for 33°, 156.2 for 20°, 195.5 for 0° and 244.8 for −20°.', () => {
        lats.forEach(p => { const q = fanPt(A, rho(p), 0); dot(k, q, p === 45 || p === 33); lab(k, q, p + '°', 'e', { dist: 1.4, size: 0.62 }); });
      });
      k.step('compass', 'With centre A draw the parallels as arcs through the marks, each about 113° wide (to the meridians ±90°). The 45° and 33° arcs are the standard parallels.', () => {
        lats.forEach(p => fanArc(k, A, rho(p), -E, E, { cls: (p === 45 || p === 33) ? 'curve' : 'cons' }));
      });
      k.step('protractor', 'Lay off the meridians: 30° of longitude is n × 30° = 18.9° at A. Draw rays at 0°, ±18.9°, ±37.8°, ±56.7° from the central meridian, down to the last parallel. They are straight lines through A.', () => {
        lons.forEach(lo => { if (lo !== 0) k.seg(A, fanPt(A, rEnd, n * lo * D), { cls: 'cons' }); });
      });
      k.step('dividers', 'Check the standard parallel of 45°: the arc between the central meridian and the 30° meridian must be the true 30° of that parallel, R cos 45° × π/6 = 37.0 long. Set the dividers to 37.0 and step it along the arc.', () => {
        const a = fanPt(A, rho(45), 0), b = fanPt(A, rho(45), n * 30 * D);
        dot(k, a, false); dot(k, b, false); k.dim(a, b, '37.0', { side: 'left', dist: 2.4, size: 0.75 });
      });
      k.step('pencil', 'Ink the finished graticule: the meridians and the parallels as continuous lines, the standard parallels heavy. A small square on the globe is a small square on the map, at every point.', () => {
        [-90, 90].forEach(lo => k.seg(A, fanPt(A, rEnd, n * lo * D), { cls: 'thick', target: false }));
        k.seg(A, fanPt(A, rEnd, 0), { cls: 'thick', target: false });
      });
      k.note('Along the central meridian the scale is 1 at 33° and 45°; between them it drops to about 0.98. The cost of the conformal property is that the parallels bunch towards the apex, the pole being a point and the whole southern hemisphere ever more stretched.', () => {
        k.text(0, -rEnd - 22, 'the south pole is infinitely far away', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Albers equal-area conic */
  Hyper.construction({
    id: 'co-albers-conic',
    title: 'Albers\' equal-area conic (standard parallels 29.5° and 45.5°) from a table',
    tags: ['conic', 'equal-area', 'Albers', 'table', 'protractor'],
    note: 'The parallels of the equal-area cone are laid off from a table, ρ = (R/n) √(C − 2n sin φ), where n = (sin φ₁ + sin φ₂)/2 = **0.6028** and C = cos² φ₁ + 2n sin φ₁ = 1.3512 (R = 100). Distance from the apex: **90° → 63.3 · 80° → 67.2 · 70° → 77.5 · 60° → 91.9 · 50° → 108.5 · 45.5° → 116.3 · 40° → 125.9 · 30° → 143.5 · 29.5° → 144.4 · 20° → 160.7 · 10° → 177.3 · 0° → 192.8 · −10° → 207.2 · −20° → 220.3**. The squares of these numbers fall by equal steps for equal steps of sin φ, which is exactly what makes every zone between two parallels keep its true area. The pole is an arc, not a point.',
    build(k) {
      const f1 = 29.5 * D, f2 = 45.5 * D;
      const n = (sin(f1) + sin(f2)) / 2, C = cos(f1) * cos(f1) + 2 * n * sin(f1);
      const rho = ph => R * Math.sqrt(C - 2 * n * sin(ph * D)) / n;
      const A = k.pt(0, 0), E = n * PI / 2;
      const lats = [90, 80, 70, 60, 45.5, 29.5, 20, 0, -20], lons = [-90, -60, -30, 0, 30, 60, 90];
      const rEnd = rho(-20);
      k.fontScale(0.85);
      k.given('The apex A at the top of the sheet and the central meridian running straight down from it; R = 100 units. Standard parallels 29.5° and 45.5°; n = 0.6028.', () => {
        k.point(A, 'A', 'ne'); k.seg(A, k.pt(0, -rEnd - 14), { cls: 'given' });
        k.frame(-rEnd * sin(E) - 10, -rEnd - 30, rEnd * sin(E) + 10, 24);
      });
      k.step('ruler', 'Lay off from A down the central meridian the distances ρ of the table: 63.3 for the pole, 67.2 for 80°, 77.5 for 70°, 91.9 for 60°, 116.3 for 45.5°, 144.4 for 29.5°, 160.7 for 20°, 192.8 for 0° and 220.3 for −20°.', () => {
        lats.forEach(p => { const q = fanPt(A, rho(p), 0); dot(k, q, p === 45.5 || p === 29.5); if (p < 80) lab(k, q, p + '°', 'e', { dist: 1.4, size: 0.62 }); });
      });
      k.step('compass', 'With centre A draw the parallels as arcs through the marks, each about 108° wide (to the meridians ±90°). The arcs of 45.5° and 29.5° are the standard parallels.', () => {
        lats.forEach(p => fanArc(k, A, rho(p), -E, E, { cls: (p === 45.5 || p === 29.5) ? 'curve' : 'cons' }));
      });
      k.step('protractor', 'Lay off the meridians: 30° of longitude is n × 30° = 18.1° at A. Draw the rays at 0°, ±18.1°, ±36.2°, ±54.3°, from the pole arc down to the last parallel.', () => {
        lons.forEach(lo => { if (lo !== 0) k.seg(fanPt(A, rho(90), n * lo * D), fanPt(A, rEnd, n * lo * D), { cls: 'cons' }); });
        k.seg(fanPt(A, rho(90), 0), fanPt(A, rEnd, 0), { cls: 'cons' });
      });
      k.note('Check an area. The patch of the globe between 29.5° and 45.5° and between the meridians 0° and 30° has the area R² × (π/6) × (sin 45.5° − sin 29.5°) = 1 156 square units. On the map it is a piece of a fan: ½ n (π/6)(ρ₂₉.₅² − ρ₄₅.₅²) = ½ × 0.6028 × 0.5236 × (144.4² − 116.3²) = 1 156. Equal, as they must be.', () => {
        const a = fanPt(A, rho(45.5), 0), b = fanPt(A, rho(45.5), n * 30 * D), c = fanPt(A, rho(29.5), n * 30 * D), d = fanPt(A, rho(29.5), 0);
        k.poly([a, b, c, d], { close: true, cls: 'red', width: 0.9 });
      });
      k.note('The shapes are not preserved: meridians and parallels still cross at right angles (the cone is symmetric about the axis), but a patch is more squashed away from the standard parallels, and the pole, a point on the globe, is stretched into an arc.', () => {
        k.text(0, -rEnd - 22, 'equal area, neither conformal nor equidistant', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ polyconic */
  Hyper.construction({
    id: 'co-polyconic',
    title: 'The polyconic: every parallel the arc of its own cone',
    tags: ['polyconic', 'Hassler', 'cones', 'dividers', 'compass'],
    note: 'On the globe, a cone tangent along the parallel of latitude φ touches the sphere along that parallel only. Unroll it and the parallel is an arc of radius **R cot φ**, centred on the polar axis at the apex. The polyconic uses a separate cone for every parallel: the arc of radius R cot φ, centred on the central meridian at the height **R φ + R cot φ**, and on it the parallel keeps its **true length** (R cos φ per radian of longitude). A point of longitude λ then lies at the angle **E = λ sin φ** from the vertical through the centre: x = R cot φ sin E, y = R φ + R cot φ (1 − cos E). The equator is a straight line (a cone with the apex at infinity), the central meridian is straight and true to scale, and the others are curves. The southern half is the mirror image about the equator.',
    build(k) {
      const g = k.g;
      const O = k.pt(-300, 0), cx = 130, lats = [20, 40, 60], E0 = k.pt(cx, 0);
      const T = p => k.pt(O.x + R * cos(p * D), R * sin(p * D));
      const Ap = p => k.pt(O.x, R / sin(p * D));
      const Py = p => R * p * D;                                    // the parallel's height on the central meridian
      const Cy = p => R * p * D + R / tan(p * D);                   // the centre of its arc
      const mapPt = (p, lo) => { const E = lo * D * sin(p * D); return k.pt(cx + R / tan(p * D) * sin(E), Py(p) + R / tan(p * D) * (1 - cos(E))); };
      const lons = [30, 60, 90];
      k.fontScale(0.75);
      k.given('The globe seen from the side (radius R = 100 about O) with its polar axis and equator, and on the right the central meridian of the map with the point E₀ where it crosses the equator. The parallels to be drawn: 20°, 40° and 60° (and, by symmetry, the same in the south).', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(k.pt(O.x, -R * 1.15), k.pt(O.x, 330), { cls: 'cons' });
        k.seg(k.pt(O.x - R * 1.15, 0), k.pt(O.x + R * 1.15, 0), { cls: 'cons' });
        k.point(O, 'O', 'sw');
        k.line(k.pt(cx, -Py(60) - 40), k.pt(cx, 330), { cls: 'cons' });
        k.point(E0, 'E_{0}', 'se');
        k.frame(O.x - R * 1.25, -125, cx + 190, 335);
      });
      k.step('protractor', 'On the side view mark the points of the circle at 20°, 40° and 60° from the equator radius: T₂₀, T₄₀, T₆₀.', () => {
        lats.forEach(p => { k.seg(O, T(p), { cls: 'cons' }); dot(k, T(p)); lab(k, T(p), 'T_{' + p + '}', 'e', { dist: 1.2 }); });
      });
      k.step('square', 'At each T draw the tangent to the circle (set square on the radius). Each tangent meets the polar axis at the apex of its own cone: A₂₀, A₄₀, A₆₀. The tangent length T A is the radius R cot φ of the parallel on the map.', () => {
        lats.forEach(p => { k.seg(T(p), Ap(p), { cls: 'cons' }); dot(k, Ap(p)); lab(k, Ap(p), 'A_{' + p + '}', 'w'); });
      });
      k.step('ruler', 'On the map\'s central meridian lay off the true arc lengths from E₀: R φ = 34.9, 69.8 and 104.7 for 20°, 40° and 60°. These are the points P₂₀, P₄₀, P₆₀ where each parallel crosses the central meridian.', () => {
        lats.forEach(p => { const q = k.pt(cx, Py(p)); dot(k, q); lab(k, q, 'P_{' + p + '}', 'sw'); });
      });
      k.step('dividers', 'Carry each tangent length T A from the side view up the central meridian from its P: the centres C₂₀, C₄₀, C₆₀ of the three arcs (274.7, 119.2 and 57.7 above their parallels).', () => {
        lats.forEach(p => { const q = k.pt(cx, Cy(p)); dot(k, q); lab(k, q, 'C_{' + p + '}', 'w'); });
      });
      k.step('compass', 'With centre C₂₀ and radius C₂₀P₂₀ draw the arc of the 20° parallel, and in the same way the arcs of 40° and 60°, each over the longitudes −90° to +90°.', () => {
        lats.forEach(p => { const C = k.pt(cx, Cy(p)), r = R / tan(p * D), Em = 90 * D * sin(p * D); k.arc(C, r, -PI / 2 - Em, -PI / 2 + Em, { cls: 'cons' }); });
      });
      k.step('tee', 'The equator is a straight line, the cone with its apex at infinity: draw it through E₀ from −90° to +90° of longitude, a length of πR = 314.', () => {
        k.seg(k.pt(cx - PI * R / 2, 0), k.pt(cx + PI * R / 2, 0), { cls: 'cons' });
      });
      k.step('dividers', 'Along every parallel step off the true length of 30° of longitude on that parallel: 52.4 on the equator, 49.2 at 20°, 40.1 at 40° and 26.2 at 60°, to the right and to the left of the central meridian.', () => {
        lons.forEach(lo => { const q = k.pt(cx + R * lo * D, 0); dot(k, q, false); dot(k, k.pt(cx - R * lo * D, 0), false); });
        lats.forEach(p => lons.forEach(lo => { const q = mapPt(p, lo); dot(k, q, p === 40); dot(k, k.pt(2 * cx - q.x, q.y), false); }));
      });
      k.step('pencil', 'Draw each meridian through its points with a French curve: the curves bend away from the central meridian and cross the parallels obliquely.', () => {
        [30, 60, 90, -30, -60, -90].forEach(lo => {
          const pts = []; for (let p = 0; p <= 60.01; p += 3) { const q = p === 0 ? k.pt(cx + R * lo * D, 0) : mapPt(p, lo); pts.push([q.x, q.y]); }
          k.curve(pts, null, { cls: 'curve' });
        });
        k.seg(E0, k.pt(cx, Py(60)), { cls: 'thick', target: false });
      });
      k.note('The southern hemisphere is the mirror image in the equator, with the arcs centred below it. The 20° arc is nearly straight (its radius is 2.7 R); the 60° arc bends sharply. Away from the central meridian the angle between meridian and parallel departs from 90°: the map is neither conformal nor equal-area, and is good only near the central meridian.', () => {
        k.text(cx, -Py(60) * 0.4 - 10, 'mirror image below the equator', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Bonne */
  Hyper.construction({
    id: 'co-bonne-graticule',
    title: 'The Bonne projection with standard parallel 45°',
    tags: ['Bonne', 'pseudoconic', 'equal-area', 'dividers', 'compass'],
    note: 'Bonne\'s map takes the cone tangent along the standard parallel φ₁ (here 45°) and uses it only for the **apex A** and the **central meridian**. The parallels are concentric arcs about A, spaced at the true meridian distance (R times the latitude difference in radians), and **each is divided into its true lengths**: 30° of longitude on the parallel φ is R cos φ × π/6, and the arcs there are therefore bent more or less as the arc radius changes. Joining the points of equal longitude gives curved meridians. The mapping is x = ρ sin E, y = R cot φ₁ − ρ cos E with ρ = R(cot φ₁ + φ₁ − φ) and E = R λ cos φ/ρ. Every patch keeps its area (the rows are equal-height strips with equal widths), and the standard parallel and the central meridian are the only places without shear.',
    build(k) {
      const f1 = 45 * D, ct = R / tan(f1);
      const O = k.pt(-330, 0), T = k.pt(O.x + R * cos(f1), R * sin(f1)), As = k.pt(O.x, R / sin(f1));
      const A = k.pt(0, ct), P1 = k.pt(0, 0);
      const rho = ph => R * (1 / tan(f1) + f1 - ph * D);
      const yCM = ph => R * (ph * D - f1);
      const lats = [90, 75, 60, 45, 30, 15, 0, -15, -30, -45, -60], lons = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
      const Eof = (ph, lo) => R * lo * D * cos(ph * D) / rho(ph);
      const pt = (ph, lo) => { const r = rho(ph), E = Eof(ph, lo); return k.pt(r * sin(E), ct - r * cos(E)); };
      k.fontScale(0.8);
      k.given('On the left the globe seen from the side (radius R = 100 about O) with its polar axis and equator; on the right the central meridian of the map and the point P₁ where the standard parallel of 45° crosses it.', () => {
        k.circle(O, R, { cls: 'given' });
        k.line(k.pt(O.x, -R * 1.15), k.pt(O.x, As.y + 25), { cls: 'cons' });
        k.seg(k.pt(O.x - R * 1.15, 0), k.pt(O.x + R * 1.15, 0), { cls: 'cons' });
        k.point(O, 'O', 'sw');
        k.line(k.pt(0, yCM(-60) - 20), k.pt(0, ct + 25), { cls: 'cons' });
        k.point(P1, 'P_{1}', 'nw');
        k.frame(O.x - R * 1.3, yCM(-60) - 30, 240, ct + 85);
      });
      k.step('protractor', 'Mark the point T of the circle at 45° from the equator radius.', () => {
        k.seg(O, T, { cls: 'cons' }); dot(k, T); lab(k, T, 'T', 'ne'); k.angle(O, k.pt(O.x + 1, 0), T, { label: '45°', r: 1.5, labelDist: 1.1 });
      });
      k.step('square', 'Draw the tangent to the circle at T (set square on the radius); it meets the polar axis at A_s. The length A_s T = R cot 45° = 100 is the radius of the standard parallel.', () => {
        k.right(T, O, As, { r: 0.6 }); k.seg(T, As, { cls: 'cons' }); dot(k, As); lab(k, As, 'A_{s}', 'nw');
      });
      k.step('dividers', 'Carry A_s T up the central meridian from P₁: the point A is the common centre of all the parallels.', () => {
        dot(k, A); lab(k, A, 'A', 'ne');
      });
      k.step('ruler', 'Starting at P₁ step the true length of 15° of a meridian, R × 15° = 26.2, up and down the central meridian: the parallels of 60°, 75° and the pole (at 21.5 below A), and of 30°, 15°, 0°, −15°, −30°, −45°, −60° below.', () => {
        lats.forEach(p => { if (p !== 45) { const q = k.pt(0, yCM(p)); dot(k, q, false); if (p !== 90 && p % 30 === 0) lab(k, q, p + '°', 'e', { dist: 1.4, size: 0.62 }); } });
      });
      k.step('compass', 'With centre A draw the parallels as arcs through those marks, each a little wider than the map will be (the pole is only a point).', () => {
        lats.forEach(p => { if (p === 90) return; const r = rho(p), Em = Eof(p, 180); fanArc(k, A, r, -Em, Em, { cls: p === 45 ? 'curve' : 'cons' }); });
      });
      k.step('dividers', 'On each arc step off the true length of 30° of longitude for that parallel: R cos φ × π/6 = 52.4 on the equator, 45.3 at 30°, 37.0 at 45°, 26.2 at 60°, 13.5 at 75°. Do it to the right and to the left of the central meridian, six times each.', () => {
        lats.forEach(p => { if (p === 90) return; lons.forEach(lo => { if (lo !== 0) dot(k, pt(p, lo), p === 45); }); });
      });
      k.step('pencil', 'Trace the meridians through the points of equal longitude. They are curves, all meeting at the pole; the outermost ones (±180°) make the heart-shaped outline.', () => {
        lons.forEach(lo => {
          const pts = []; for (let p = -60; p <= 90.001; p += 3) { const q = lo === 0 ? k.pt(0, yCM(p)) : pt(p, lo); pts.push([q.x, q.y]); }
          k.curve(pts, null, { cls: Math.abs(lo) === 180 ? 'thick' : 'curve' });
        });
      });
      k.note('Move the standard parallel to the equator and the arcs straighten into the sinusoidal map; move it to the pole and the pole becomes the centre of everything, Werner\'s heart. The map shears away from P₁ in both directions: look at the corners at 60° S.', () => {
        k.text(0, ct + 70, 'equal-area, heart-shaped', { upright: true, size: 0.75 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Werner */
  Hyper.construction({
    id: 'co-werner-heart',
    title: 'Werner\'s heart: the pole as the centre of the parallels',
    tags: ['Werner', 'cordiform', 'equal-area', 'dividers', 'compass'],
    note: 'Werner\'s map (1514) is Bonne\'s with the standard parallel moved to the pole. The parallels are circles about the **pole N**, at the true distance **ρ = R(90° − φ)** from it (26.2 for each 15°), so the equator is 157.1 from N and the south pole 314.2. On each circle the points are spaced at the true length, 30° of longitude on the parallel φ being R cos φ × π/6; angles at the centre are therefore **E = λ cos φ/(π/2 − φ)** (in radians). The meridians are curves from the north pole, and the outermost ones form a heart. The south pole is a single point on the central meridian. The map is equal-area; shapes are badly sheared away from the central meridian and towards the south.',
    build(k) {
      const N = k.pt(0, 0);
      const rho = ph => R * (PI / 2 - ph * D);
      const lats = [75, 60, 45, 30, 15, 0, -15, -30, -45, -60, -75, -90], lons = [-180, -150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
      const Eof = (ph, lo) => ph === 90 ? 0 : lo * D * cos(ph * D) / (PI / 2 - ph * D);
      const pt = (ph, lo) => { const r = rho(ph), E = Eof(ph, lo); return k.pt(r * sin(E), -r * cos(E)); };
      k.fontScale(0.85);
      k.given('The north pole N at the top of the sheet and the central meridian running straight down from it. R = 100 units for the radius of the globe.', () => {
        k.point(N, 'N', 'nw'); k.seg(N, k.pt(0, -rho(-90)), { cls: 'given' });
        k.frame(-215, -rho(-90) - 20, 215, 100);
      });
      k.step('ruler', 'Step the true length of 15° of a meridian, R × 15° = 26.2, down the central meridian from N, twelve times: the marks are the parallels 75°, 60°, … 0°, … −75° and the south pole (ρ = 314.2).', () => {
        lats.forEach(p => { const q = k.pt(0, -rho(p)); dot(k, q, false); if (p % 30 === 0) lab(k, q, p + '°', 'e', { dist: 1.4, size: 0.62 }); });
      });
      k.step('compass', 'With centre N draw the parallels as arcs through the marks, each long enough to include its longitudes −180° to +180° (the equator reaches 115° to either side of the central meridian).', () => {
        lats.forEach(p => { if (p === -90) return; const Em = Eof(p, 180); fanArc(k, N, rho(p), -Em, Em, { cls: p === 0 ? 'curve' : 'cons' }); });
      });
      k.step('dividers', 'On each arc step off the true length of 30° of longitude for that parallel (R cos φ × π/6: 52.4 on the equator, 45.3 at 30°, 26.2 at 60°, 13.5 at 75°), six times to the right and six to the left of the central meridian.', () => {
        lats.forEach(p => { if (p === -90) return; lons.forEach(lo => { if (lo !== 0) dot(k, pt(p, lo), p === 0); }); });
      });
      k.step('pencil', 'Trace the meridians through the points of equal longitude, from the north pole to the south pole. The two outermost, ±180°, enclose the heart.', () => {
        lons.forEach(lo => {
          const pts = []; for (let p = 90; p >= -90.001; p -= 3) { const q = lo === 0 ? k.pt(0, -rho(p)) : pt(p, lo); pts.push([q.x, q.y]); }
          k.curve(pts, null, { cls: Math.abs(lo) === 180 ? 'thick' : 'curve' });
        });
      });
      k.note('The cusp at N is the north pole, where all the meridians meet at an angle; the point at the bottom is the south pole. The map is exact for areas, for distances from the north pole (the circles) and along the central meridian, and for nothing else. Johannes Werner (1514), then Dürer\'s world map of 1515, Oronce Finé and Mercator\'s double heart of 1538 all used it.', () => {
        k.text(0, -rho(-90) - 14, 'south pole', { upright: true, size: 0.75 });
      });
    }
  });
})();
