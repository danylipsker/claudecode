/* HYPER-PROJECTIONS · constructions/pseudocylindrical-and-compromise.js
 *
 *   ps-skeleton           the skeleton of any pseudocylindrical map: parallels at tabulated heights and lengths, each divided equally
 *   ps-sinusoidal         the sinusoidal: parallels truly spaced, lengths by an auxiliary circle, meridians traced as sine curves
 *   ps-mollweide          Mollweide: the auxiliary angle θ from a table, the ellipse and the parallels by two concentric circles
 *   ps-goode-lobes        Goode's interrupted homolosine: the lobes with their central meridians, sinusoidal below 40°44′, Mollweide above
 *   ps-eckert4            Eckert IV: a stadium outline, parallels from an auxiliary circle, meridians as half-ellipses
 *   ps-robinson           Robinson from his table of 19 rows
 *   ps-winkel-tripel      the Winkel tripel as the average of the equirectangular and the Aitoff graticules, node by node
 *   ps-aitoff-hammer      Hammer's ellipse: concentric-circle outline, the equator and central meridian by the chord of a circle, nodes plotted
 *   ps-van-der-grinten    Van der Grinten's circle with compass and straightedge: meridian circles through the poles, parallel circles through three points
 *   ps-equal-earth        Equal Earth from a short table
 *   ps-wagner-ellipse     Wagner VI (and Kavrayskiy VII) from one ellipse by the concentric-circle method
 *
 * The points are computed with the formulas of the pages; the final traced curves come from the engine (kit.proj.maps), so the
 * hand method and the formula are on the screen together.
 */
(function () {
  'use strict';
  const PI = Math.PI, D = PI / 180, sin = Math.sin, cos = Math.cos, tan = Math.tan, sqrt = Math.sqrt, SQ2 = Math.SQRT2;
  const MAPS = () => Hyper.proj.maps;
  const lab = (k, p, text, at, o) => k.label(p, text, at, Object.assign({ upright: true, size: 0.72 }, o || {}));
  const dot = (k, p, show) => k.dot(p, { r: 0.6, target: show !== false });
  const range = (a, b, s) => { const r = []; for (let x = a; x <= b + 1e-9; x += s) r.push(x); return r; };
  /* the engine's point for (lon, lat) scaled by R and shifted; lon 180 is taken just inside the edge so that it stays on the right */
  const eng = (id, lon, lat, R, o, ox, oy) => { const p = MAPS().project(id, Math.min(lon, 179.9999), lat, o); return { x: (ox || 0) + p[0] * R, y: (oy || 0) + p[1] * R }; };
  const meridian = (id, lon, R, o, la0, la1, step, ox, oy) => range(la0, la1, step || 3).map(la => { const p = eng(id, lon, la, R, o, ox, oy); return [p.x, p.y]; });
  const parallel = (id, lat, R, o, lo0, lo1, step, ox, oy) => range(lo0, lo1, step || 5).map(lo => { const p = eng(id, lo, lat, R, o, ox, oy); return [p.x, p.y]; });
  const mollTheta = ph => { let t = ph * D; if (Math.abs(ph) >= 90) return Math.sign(ph) * PI / 2; for (let i = 0; i < 40; i++) { const d = (2 * t + sin(2 * t) - PI * sin(ph * D)) / (2 + 2 * cos(2 * t)); t -= d; } return t; };
  const LONS30 = range(-180, 180, 30);

  /* ------------------------------------------------------------------------------------------------ the skeleton */
  Hyper.construction({
    id: 'ps-skeleton',
    title: 'The skeleton of a pseudocylindrical map: a table, a ruler and dividers',
    tags: ['pseudocylindrical', 'table', 'dividers', 'Kavrayskiy VII'],
    note: 'Every pseudocylindrical map is drawn the same way: the parallels are **straight horizontals** at heights y(φ), each of a length L(φ), and each is **divided into equal parts** for equal steps of longitude; the meridians are the curves joining the corresponding points. A projection is nothing but the two columns y(φ) and L(φ). Here they are for **Kavrayskiy VII** (for R = 70, with φ in degrees and half-lengths in units of R): **0° → y = 0, half-length 2.721 · 15° → 0.262, 2.692 · 30° → 0.524, 2.605 · 45° → 0.785, 2.452 · 60° → 1.047, 2.221 · 75° → 1.309, 1.883 · 90° → 1.571, 1.360**. The heights are simply R φ (the parallels are equally spaced), and the half-length is 1.5 π √(1/3 − (φ/π)²). Replace the columns by those of the sinusoidal, Mollweide or Robinson page and the same steps draw those maps.',
    build(k) {
      const R = 70, lats = [15, 30, 45, 60, 75, 90], half = ph => 1.5 * PI * R * sqrt(1 / 3 - (ph * D / PI) ** 2), y = ph => R * ph * D;
      const all = lats.flatMap(p => [p, -p]).concat([0]);
      const pt = (ph, lo) => k.pt(half(Math.abs(ph)) * lo / 180, y(ph));
      k.fontScale(0.85);
      k.given('The central meridian, drawn at its true length πR for the globe\'s radius R = 70, and the equator through O. Both are given by the table in the note: the equator has the length 2 × 2.721 R = 381.', () => {
        k.seg(k.pt(0, -y(90) - 14), k.pt(0, y(90) + 14), { cls: 'given' }); k.seg(k.pt(-half(0), 0), k.pt(half(0), 0), { cls: 'given' });
        k.point(k.pt(0, 0), 'O', 'se'); lab(k, k.pt(half(0), 0), 'equator', 'ne'); lab(k, k.pt(0, y(90) + 14), 'central meridian', 'ne');
        k.frame(-half(0) - 20, -y(90) - 30, half(0) + 20, y(90) + 30);
      });
      k.step('dividers', 'Step off the true length of 15° of a meridian, R × 15° = 18.3, up and down the central meridian from O: the heights y = Rφ of the parallels, twelve marks.', () => {
        lats.forEach(p => { dot(k, k.pt(0, y(p))); dot(k, k.pt(0, -y(p))); lab(k, k.pt(0, y(p)), p + '°', 'e', { dist: 0.9, size: 0.6 }); });
      });
      k.step('ruler', 'On each horizontal through a mark lay off the half-length of the table, to the right and to the left of the central meridian: 188.5 at 15°, 182.3 at 30°, 171.7 at 45°, 155.5 at 60°, 131.8 at 75° and 95.2 at the pole.', () => {
        all.forEach(p => { if (p !== 0) { dot(k, pt(p, 180), p === 45); dot(k, pt(p, -180), false); } });
      });
      k.step('tee', 'Rule each parallel between its two end marks, with the T-square. The poles are lines, 190 long, not points: that is the mark of a pseudocylindrical map with a flat pole.', () => {
        all.forEach(p => k.seg(pt(p, -180), pt(p, 180), { cls: p === 0 ? 'given' : 'cons', target: p !== 0 }));
      });
      k.step('dividers', 'Divide every parallel into twelve equal parts, one for each 30° of longitude (set the dividers by trial, or divide with an oblique ruler and parallel lines).', () => {
        all.forEach(p => LONS30.forEach(lo => { if (Math.abs(lo) < 180 && lo !== 0) dot(k, pt(p, lo), p === 45); }));
      });
      k.step('pencil', 'Join the points of equal longitude, with a French curve, from pole to pole: the meridians are curves, all of the same family; the two outermost ones, ±180°, are the outline.', () => {
        LONS30.forEach(lo => { if (lo === 0) return; k.smooth(range(-90, 90, 15).map(p => pt(p, lo)), { cls: Math.abs(lo) === 180 ? 'thick' : 'curve' }); });
      });
      k.note('Nothing in the method depends on the projection; the table does. A flat pole, straight parallels at the true or a chosen spacing, and equal division along each parallel: the sinusoidal, Mollweide, Eckert, Robinson, Equal Earth and Kavrayskiy maps differ only in the columns.', () => {
        k.text(0, -y(90) - 22, 'Kavrayskiy VII, 12 parallels, 12 meridians', { upright: true, size: 0.75 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ sinusoidal */
  Hyper.construction({
    id: 'ps-sinusoidal',
    title: 'The sinusoidal projection: parallels truly spaced, lengths by a circle',
    tags: ['sinusoidal', 'Sanson–Flamsteed', 'equal-area', 'dividers', 'compass'],
    note: 'The sinusoidal (Sanson–Flamsteed) map needs no table. The parallels are horizontals at the true distance **y = Rφ**, and the parallel of latitude φ has the length **2πR cos φ**, the length it has on the globe. A circle of radius πR about O, with the points Q_φ at the angle φ, supplies all the cosines at once: the vertical through Q_φ is πR cos φ from the central meridian, so it cuts the parallel of the same latitude exactly at its end. Dividing each parallel equally gives the meridians x = Rλ cos φ, which are **sine curves**. The map is equal-area, because the strips have the true height and each is stretched to its true length; shapes are sheared away from the central meridian, severely near the edges. Only the right half of the upper hemisphere is constructed here; the rest is its mirror image.',
    build(k) {
      const R = 50, U = PI * R, lats = [15, 30, 45, 60, 75, 90], y = ph => R * ph * D;
      const O = k.pt(0, 0), Q = ph => k.pt(U * cos(ph * D), U * sin(ph * D)), E = ph => k.pt(U * cos(ph * D), y(ph));
      const pts = (ph, lo) => k.pt(R * lo * D * cos(ph * D), y(ph));
      k.fontScale(0.85);
      k.given('The central meridian and the equator through O, with the equator drawn from −πR to +πR = 157 (R = 50). The upper right quarter is constructed; the other quarters are mirror images.', () => {
        k.seg(k.pt(0, -y(90) - 10), k.pt(0, U + 12), { cls: 'given' }); k.seg(k.pt(-U - 10, 0), k.pt(U + 10, 0), { cls: 'given' });
        k.point(O, 'O', 'sw'); lab(k, k.pt(U, 0), 'equator', 'se');
        k.frame(-U - 25, -30, U + 25, U + 22);
      });
      k.step('dividers', 'Step the true length of 15° of a meridian, R × 15° = 13.1, up the central meridian from O: the heights Y of the parallels 15°, 30°, … 90° (the last mark is the pole).', () => {
        lats.forEach(p => { dot(k, k.pt(0, y(p))); lab(k, k.pt(0, y(p)), p + '°', 'sw', { dist: 0.9, size: 0.6 }); });
      });
      k.step('compass', 'With centre O and radius πR (to the end of the equator) draw the quarter circle up to the central meridian. It will lend its cosines.', () => {
        k.arc(O, U, 0, PI / 2, { cls: 'cons' });
      });
      k.step('protractor', 'On the circle mark the points Q at 15°, 30°, … 90° measured from the equator radius.', () => {
        lats.forEach(p => { k.seg(O, Q(p), { cls: 'cons', target: false }); dot(k, Q(p)); });
      });
      k.step('square', 'From each point Q draw a vertical (set square on the T-square) down to the horizontal through the mark of the same latitude: the foot E is the end of that parallel, at πR cos φ from the central meridian.', () => {
        lats.forEach(p => { if (p < 90) { k.seg(Q(p), E(p), { cls: 'cons' }); dot(k, E(p)); lab(k, E(p), p + '°', 'se', { dist: 0.9, size: 0.6 }); } });
      });
      k.step('tee', 'Rule the parallels from the central meridian to the points E (the pole is the point on the central meridian itself). Each is the true length of its parallel on the globe.', () => {
        lats.forEach(p => { if (p < 90) k.seg(k.pt(0, y(p)), E(p), { cls: 'cons' }); });
      });
      k.step('dividers', 'Divide each half-parallel into six equal parts, one for every 30° of longitude from the central meridian: the points (Rλ cos φ, Rφ).', () => {
        lats.forEach(p => { if (p < 90) range(30, 180, 30).forEach(lo => dot(k, pts(p, lo), p === 45)); });
        range(30, 180, 30).forEach(lo => dot(k, pts(0, lo), false));
      });
      k.step('pencil', 'Join the points of equal longitude with a smooth curve from the equator up to the pole: the sine curves x = Rλ cos φ. The meridian ±180° is the outline.', () => {
        range(30, 180, 30).forEach(lo => k.curve(meridian('sinusoidal', lo, R, {}, 0, 90, 3), null, { cls: lo === 180 ? 'thick' : 'curve' }));
      });
      k.note('The left half and the southern hemisphere are the mirror images. Because each parallel has its true length, the scale along every parallel and along the central meridian is exactly 1; the area of every region is exact; but the shear is severe towards the corners: at 90° of longitude and 60° of latitude a right angle of the globe becomes an angle of only 36°.', () => {
        range(30, 180, 30).forEach(lo => k.curve(meridian('sinusoidal', -lo, R, {}, 0, 90, 3), null, { cls: 'aux', target: false }));
        k.text(U * 0.55, -22, 'x = Rλ cos φ', { upright: true, size: 0.8 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Mollweide */
  Hyper.construction({
    id: 'ps-mollweide',
    title: 'The Mollweide projection: the auxiliary angle, the ellipse and the parallels',
    tags: ['Mollweide', 'equal-area', 'ellipse', 'auxiliary angle', 'protractor'],
    note: 'The Mollweide map is an ellipse 2 : 1, semi-axes **2√2 R** and **√2 R**, drawn by two concentric circles of those radii. The parallel of latitude φ is a horizontal at the height **y = √2 R sin θ**, where the auxiliary angle θ satisfies **2θ + sin 2θ = π sin φ**; it ends on the ellipse at x = 2√2 R cos θ. There is no formula for θ, only a table (or a few steps of Newton\'s method): **φ = 15° → θ = 11.81°, 30° → 23.83°, 45° → 36.30°, 60° → 49.68°, 75° → 64.97°, 90° → 90°**. Each parallel is then divided into equal parts: the meridians are half-ellipses with the horizontal semi-axis (2√2/π) R λ. The construction shows the right half of the upper hemisphere; the rest is its mirror image.',
    build(k) {
      const R = 60, a = 2 * SQ2 * R, b = SQ2 * R, lats = [15, 30, 45, 60, 75, 90], th = ph => mollTheta(ph);
      const O = k.pt(0, 0), A = ph => k.pt(b * cos(th(ph)), b * sin(th(ph))), B = ph => k.pt(a * cos(th(ph)), a * sin(th(ph))), E = ph => k.pt(a * cos(th(ph)), b * sin(th(ph)));
      const Y = ph => b * sin(th(ph)), pt = (ph, lo) => k.pt(E(ph).x * lo / 180, Y(ph));
      k.fontScale(0.85);
      k.given('The central meridian and the equator through O. R = 60: the ellipse will be 2 × 170 wide and 2 × 85 high. The upper right quarter is constructed.', () => {
        k.seg(k.pt(0, -b - 12), k.pt(0, b + 14), { cls: 'given' }); k.seg(k.pt(-a - 12, 0), k.pt(a + 12, 0), { cls: 'given' });
        k.point(O, 'O', 'sw'); lab(k, k.pt(a, 0), 'equator', 'se');
        k.frame(-a - 25, -30, a + 25, a + 14);
      });
      k.step('compass', 'With centre O draw the two quarter circles of radius √2 R = 84.9 (inner) and 2√2 R = 169.7 (outer, to the end of the equator).', () => {
        k.arc(O, b, 0, PI / 2, { cls: 'cons' }); k.arc(O, a, 0, PI / 2, { cls: 'cons' });
      });
      k.step('protractor', 'For each parallel read its auxiliary angle θ from the table (11.8° for 15°, 23.8° for 30°, 36.3° for 45°, 49.7° for 60°, 65.0° for 75°, 90° for the pole) and lay it off from the equator radius: the ray cuts the inner circle at A and the outer one at B.', () => {
        lats.forEach(p => { k.seg(O, B(p), { cls: 'cons', target: false }); dot(k, A(p)); dot(k, B(p), false); });
        lab(k, A(30), '30°', 'nw', { size: 0.6 }); lab(k, A(60), '60°', 'nw', { size: 0.6 });
      });
      k.step('tee', 'Through each A draw the horizontal: it is the parallel of that latitude, at the height √2 R sin θ above the equator (the top one, at the top of the inner circle, is the pole).', () => {
        lats.forEach(p => k.seg(k.pt(0, Y(p)), k.pt(a * cos(th(p)), Y(p)), { cls: 'cons' }));
      });
      k.step('square', 'Through each B draw the vertical (set square on the T-square) down to the horizontal of the same latitude. Where they meet, E, the parallel ends on the ellipse.', () => {
        lats.forEach(p => { if (p < 90) { k.seg(B(p), E(p), { cls: 'cons' }); dot(k, E(p)); lab(k, E(p), p + '°', 'se', { dist: 0.9, size: 0.6 }); } });
      });
      k.step('pencil', 'Draw the outline through the points E and the end of the equator: the ellipse, which is the meridian of ±180°. The concentric circles have given it exactly; no trammel is needed.', () => {
        k.curve(range(0, 90, 3).map(t => [a * cos(t * D), b * sin(t * D)]), null, { cls: 'thick' });
      });
      k.step('dividers', 'Divide each half-parallel into six equal parts (one for every 30° of longitude from the central meridian).', () => {
        lats.forEach(p => { if (p < 90) range(30, 150, 30).forEach(lo => dot(k, pt(p, lo), p === 45)); });
        range(30, 150, 30).forEach(lo => dot(k, k.pt(a * lo / 180, 0), false));
      });
      k.step('pencil', 'Join the points of equal longitude. Each meridian is half an ellipse with the centre O, the vertical semi-axis √2 R and the horizontal semi-axis (2√2/π) R λ, so it can be drawn with the same method (concentric circles of radius √2 R and (2√2/π) R λ).', () => {
        range(30, 150, 30).forEach(lo => k.curve(range(0, 90, 3).map(t => [(a * lo / 180) * cos(t * D), b * sin(t * D)]), null, { cls: 'curve' }));
      });
      k.note('The lower half and the left half are mirror images. The map is equal-area: the strip between the parallels φ and φ + dφ is made to have the right area by the choice of θ. The parallels are most closely spaced near the poles, the meridians meet the parallels at less and less square angles towards the edges, and the corners at the pole are very sharp.', () => {
        range(30, 150, 30).forEach(lo => k.curve(range(0, 90, 3).map(t => [-(a * lo / 180) * cos(t * D), b * sin(t * D)]), null, { cls: 'aux', target: false }));
        k.curve(range(0, 90, 3).map(t => [-a * cos(t * D), b * sin(t * D)]), null, { cls: 'aux', target: false });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Goode */
  const GOODE = [{ n: 1, e: [-180, -40], c: -100 }, { n: 1, e: [-40, 180], c: 30 }, { n: -1, e: [-180, -100], c: -160 }, { n: -1, e: [-100, -20], c: -60 }, { n: -1, e: [-20, 80], c: 20 }, { n: -1, e: [80, 180], c: 140 }];
  const PHIJ = 40.73666, OFFJ = 0.0528035;
  /* Goode's point (R = 1) on the edge L of the lobe with central meridian c, at latitude phi (degrees) */
  const goodePt = (c, L, ph) => {
    const a = Math.abs(ph);
    if (a <= PHIJ) return [c * D + (L - c) * D * cos(ph * D), ph * D];
    const t = mollTheta(a);
    return [c * D + 2 * SQ2 / PI * (L - c) * D * cos(t), Math.sign(ph) * (SQ2 * sin(t) - OFFJ)];
  };
  Hyper.construction({
    id: 'ps-goode-lobes',
    title: 'Goode\'s interrupted homolosine: the lobes',
    tags: ['Goode', 'homolosine', 'interrupted', 'equal-area', 'sinusoidal', 'Mollweide'],
    note: 'Goode\'s map is **two maps in one**: the sinusoidal below the parallel **40°44′** (where the two have the same width) and the Mollweide above it, the Mollweide being shifted down by 0.0528 R so that the parallels fit. Neither is good over the whole world; together they are fair, and the **interruptions** — cuts through the oceans — let each continent lie near a central meridian of its own. The standard version has six lobes: in the north, central meridians **−100°** (the Americas, cut at −180° and −40°) and **+30°** (Europe, Africa and Asia, cut at −40° and 180°); in the south **−160°, −60°, +20° and +140°** (cut at −180°, −100°, −20°, 80°, 180°). Every lobe is drawn like a small sinusoidal map with a Mollweide cap. The R is 60 here, the equator 377 long.',
    build(k) {
      const R = 60, U = PI * R, yP = (SQ2 - OFFJ) * R, yJ = PHIJ * D * R;
      const gp = (c, L, ph) => { const q = goodePt(c, L, ph); return k.pt(q[0] * R, q[1] * R); };
      k.fontScale(0.8);
      k.given('The equator drawn at its true length 2πR = 377 (R = 60), with O at longitude 0° and a mark every 30° of longitude.', () => {
        k.seg(k.pt(-U, 0), k.pt(U, 0), { cls: 'given' }); k.point(k.pt(0, 0), 'O', 'sw');
        range(-180, 180, 30).forEach(lo => k.tick(k.pt(lo * D * R, 0), k.pt(0, 1), { cls: 'cons' }));
        lab(k, k.pt(-U, 0), '−180°', 'sw', { size: 0.6 }); lab(k, k.pt(U, 0), '180°', 'se', { size: 0.6 });
        k.frame(-U - 25, -yP - 30, U + 25, yP + 35);
      });
      k.step('dividers', 'Mark on the equator the central meridians of the six lobes (−100° and 30° for the northern lobes, drawn above; −160°, −60°, 20° and 140° for the southern, drawn below), each at x = R × longitude.', () => {
        GOODE.forEach((g, i) => { const p = k.pt(g.c * D * R, 0); dot(k, p); lab(k, p, g.c + '°', g.n > 0 ? 'nw' : 'sw', { size: 0.62, dist: 1.0 }); });
      });
      k.step('square', 'Erect the central meridians as verticals: up from the equator to the pole at (√2 − 0.0528) R = 82 for the northern lobes, down to −82 for the southern ones.', () => {
        GOODE.forEach(g => { k.seg(k.pt(g.c * D * R, 0), k.pt(g.c * D * R, g.n * yP), { cls: 'cons' }); });
      });
      k.step('tee', 'Draw the two parallels where the maps join, ±40°44′, at the height ±R × 0.7110 = 42.7, across each lobe from its left edge to its right edge. Where the edges are: x = R [c + (L − c) cos φ].', () => {
        GOODE.forEach(g => k.seg(gp(g.c, g.e[0], g.n * PHIJ), gp(g.c, g.e[1], g.n * PHIJ), { cls: 'cons' }));
      });
      k.step('pencil', 'Below the join, draw the edges of the lobes as sine curves: from each cut on the equator up (or down) to the join, x = R [c + (L − c) cos φ] — twelve curves, two for each lobe.', () => {
        GOODE.forEach(g => g.e.forEach(L => k.curve(range(0, PHIJ, 2.5).concat([PHIJ]).map(p => { const q = gp(g.c, L, g.n * p); return [q.x, q.y]; }), null, { cls: 'curve' })));
      });
      k.step('pencil', 'Above the join the edges are Mollweide arcs, half-ellipses: continue each edge from the join to the pole, where all the edges of a lobe meet on its central meridian.', () => {
        GOODE.forEach(g => g.e.forEach(L => k.curve(range(PHIJ, 90, 3).map(p => { const q = gp(g.c, L, g.n * Math.min(p, 89.99)); return [q.x, q.y]; }), null, { cls: 'curve' })));
      });
      k.note('The finished map is the six lobes joined along the equator and the north and south cuts left open. Add the parallels (sinusoidal below the join, Mollweide arcs above) and the meridians of each lobe with the dividers as on the sinusoidal and Mollweide pages: every lobe is a small map of its own. The area is exact everywhere; the cuts fall in the oceans.', () => {
        GOODE.forEach(g => [20, 40, 60, 80].forEach(p => k.curve(range(g.e[0], g.e[1], 5).map(lo => { const q = gp(g.c, lo, g.n * p); return [q.x, q.y]; }), null, { cls: 'aux', target: false })));
        k.text(-120, yJ + 18, 'Mollweide', { upright: true, size: 0.7 }); k.text(-120, yJ - 14, 'sinusoidal', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Eckert IV */
  const eckThetaIV = ph => { if (Math.abs(ph) >= 90) return Math.sign(ph) * PI / 2; let t = ph * D / 2; const target = (2 + PI / 2) * sin(ph * D); for (let i = 0; i < 40; i++) { const d = (t + sin(t) * cos(t) + 2 * sin(t) - target) / (2 * cos(t) * (1 + cos(t))); t -= d; } return t; };
  Hyper.construction({
    id: 'ps-eckert4',
    title: 'Eckert IV: a stadium outline and elliptical meridians',
    tags: ['Eckert IV', 'equal-area', 'ellipse', 'auxiliary angle', 'protractor'],
    note: 'Eckert IV has the equator twice as long as the central meridian, **flat poles** half the length of the equator, and an outline made of **two semicircles** of radius **c₂ R = 1.3265 R** joined by the straight pole lines. The parallel of latitude φ is at the height **y = c₂ R sin θ**, with the auxiliary angle θ given by **θ + sin θ cos θ + 2 sin θ = (2 + π/2) sin φ**: **φ = 15° → θ = 13.42°, 30° → 27.03°, 45° → 41.05°, 60° → 55.78°, 75° → 71.75°, 90° → 90°**. Its half-length is c₂ R (1 + cos θ), and it is divided equally, so the meridian of longitude λ is a **half-ellipse** centred on the equator at x = c₁ R λ, with horizontal semi-axis c₁ R λ and vertical semi-axis c₂ R. The construction shows the upper right quarter.',
    build(k) {
      const R = 60, c1 = 2 / sqrt(PI * (4 + PI)), c2 = 2 * sqrt(PI / (4 + PI)), rr = c2 * R, lats = [15, 30, 45, 60, 75, 90], th = eckThetaIV;
      const O = k.pt(0, 0), Cr = k.pt(rr, 0), A = ph => k.pt(rr * cos(th(ph)), rr * sin(th(ph))), E = ph => k.pt(rr * (1 + cos(th(ph))), rr * sin(th(ph)));
      const Y = ph => rr * sin(th(ph)), pt = (ph, lo) => k.pt(E(ph).x * lo / 180, Y(ph));
      k.fontScale(0.85);
      k.given('The central meridian and the equator through O. R = 60, so c₂R = 79.6: the equator will be 4 × 79.6 = 318 long and the central meridian 159. The upper right quarter is constructed.', () => {
        k.seg(k.pt(0, -rr - 12), k.pt(0, rr + 14), { cls: 'given' }); k.seg(k.pt(-2 * rr - 12, 0), k.pt(2 * rr + 12, 0), { cls: 'given' });
        k.point(O, 'O', 'sw'); lab(k, k.pt(2 * rr, 0), 'equator', 'se');
        k.frame(-2 * rr - 25, -30, 2 * rr + 25, rr + 30);
      });
      k.step('compass', 'With centre O and radius c₂R = 79.6 draw the quarter circle from the equator up to the central meridian. It carries the auxiliary angles.', () => {
        k.arc(O, rr, 0, PI / 2, { cls: 'cons' });
      });
      k.step('compass', 'With centre C on the equator, a distance c₂R to the right of O, and the same radius draw the quarter circle from the end of the equator up to the pole line: the right-hand end of the outline (the meridian of 180°).', () => {
        dot(k, Cr); lab(k, Cr, 'C', 'sw', { size: 0.65 }); k.arc(Cr, rr, 0, PI / 2, { cls: 'curve' });
      });
      k.step('protractor', 'Lay off the auxiliary angle θ of each parallel from the equator radius of the first circle (13.4° for 15°, 27.0° for 30°, 41.1° for 45°, 55.8° for 60°, 71.8° for 75°, 90° for the pole): the points A.', () => {
        lats.forEach(p => { k.seg(O, A(p), { cls: 'cons', target: false }); dot(k, A(p)); });
      });
      k.step('tee', 'Through each point A draw the horizontal, from the central meridian to the right-hand outline: it is the parallel of that latitude. The top one, through the top of the circle, is the pole line.', () => {
        lats.forEach(p => { k.seg(k.pt(0, Y(p)), E(p), { cls: 'cons' }); if (p < 90) { dot(k, E(p), false); lab(k, E(p), p + '°', 'se', { dist: 0.9, size: 0.6 }); } });
      });
      k.step('dividers', 'Divide each half-parallel into six equal parts, one for each 30° of longitude from the central meridian.', () => {
        lats.forEach(p => range(30, 150, 30).forEach(lo => dot(k, pt(p, lo), p === 45)));
        range(30, 150, 30).forEach(lo => dot(k, k.pt(2 * rr * lo / 180, 0), false));
      });
      k.step('pencil', 'Join the points of equal longitude. Each meridian is half an ellipse: its centre is on the equator at c₁Rλ, its vertical semi-axis is the same c₂R for all of them and its horizontal semi-axis is c₁Rλ, so it runs from the equator point to the pole line.', () => {
        range(30, 150, 30).forEach(lo => k.curve(range(0, 90, 3).map(t => [c1 * R * lo * D * (1 + cos(t * D)), c2 * R * sin(t * D)]), null, { cls: 'curve' }));
      });
      k.note('The dashed curve is the meridian of 90° on Eckert VI, the same family with sinusoidal meridians: the poles and parallels are placed by a different auxiliary angle. On both maps the meridians are drawn from the same recipe: equal division of each parallel.', () => {
        k.curve(meridian('eckert6', 90, R, {}, 0, 90, 3), null, { cls: 'aux', dash: true, target: false });
        range(30, 150, 30).forEach(lo => k.curve(range(0, 90, 3).map(t => [-c1 * R * lo * D * (1 + cos(t * D)), c2 * R * sin(t * D)]), null, { cls: 'aux', target: false }));
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Robinson */
  const ROB = [[0, 1, 0], [5, 0.9986, 0.0620], [10, 0.9954, 0.1240], [15, 0.9900, 0.1860], [20, 0.9822, 0.2480], [25, 0.9730, 0.3100], [30, 0.9600, 0.3720], [35, 0.9427, 0.4340], [40, 0.9216, 0.4958], [45, 0.8962, 0.5571], [50, 0.8679, 0.6176], [55, 0.8350, 0.6769], [60, 0.7986, 0.7346], [65, 0.7597, 0.7903], [70, 0.7186, 0.8435], [75, 0.6732, 0.8936], [80, 0.6213, 0.9394], [85, 0.5722, 0.9761], [90, 0.5322, 1]];
  Hyper.construction({
    id: 'ps-robinson',
    title: 'The Robinson projection from its table',
    tags: ['Robinson', 'table', 'compromise', 'ruler', 'dividers'],
    note: 'Robinson gave no formula, only a **table of 19 rows**: for every 5° of latitude, the length X of the parallel (the equator = 1) and the distance Y of the parallel from the equator (the pole = 1). The map has x = 0.8487 R X λ and y = 1.3523 R Y. **φ: X, Y** — **0°: 1.0000, 0.0000 · 5°: 0.9986, 0.0620 · 10°: 0.9954, 0.1240 · 15°: 0.9900, 0.1860 · 20°: 0.9822, 0.2480 · 25°: 0.9730, 0.3100 · 30°: 0.9600, 0.3720 · 35°: 0.9427, 0.4340 · 40°: 0.9216, 0.4958 · 45°: 0.8962, 0.5571 · 50°: 0.8679, 0.6176 · 55°: 0.8350, 0.6769 · 60°: 0.7986, 0.7346 · 65°: 0.7597, 0.7903 · 70°: 0.7186, 0.8435 · 75°: 0.6732, 0.8936 · 80°: 0.6213, 0.9394 · 85°: 0.5722, 0.9761 · 90°: 0.5322, 1.0000**. Between rows the values were read from a smooth curve; this construction uses the rows at every 10°, enough to guide a French curve. R = 60: the equator half-length is 160.0, the half-height 81.1.',
    build(k) {
      const R = 60, rows = ROB.filter(r => r[0] > 0 && r[0] % 10 === 0), Lq = 0.8487 * PI * R, Hq = 1.3523 * R;
      const yy = r => Hq * r[2], hl = r => Lq * r[1];
      const pt = (r, lo) => k.pt(hl(r) * lo / 180, yy(r));
      const all = rows.concat(rows.map(r => [-r[0], r[1], -r[2]]));
      k.fontScale(0.85);
      k.given('The central meridian, 2 × 81.1 long, and the equator through O, 2 × 160.0 long (R = 60). The table of the note is the only other data.', () => {
        k.seg(k.pt(0, -Hq - 10), k.pt(0, Hq + 12), { cls: 'given' }); k.seg(k.pt(-Lq, 0), k.pt(Lq, 0), { cls: 'given' });
        k.point(k.pt(0, 0), 'O', 'se'); lab(k, k.pt(Lq, 0), 'equator', 'ne');
        k.frame(-Lq - 20, -Hq - 25, Lq + 20, Hq + 28);
      });
      k.step('ruler', 'Up and down the central meridian lay off the distances y = 81.1 × Y of the table: for 10°, 20°, … 90° they are 10.1, 20.1, 30.2, 40.2, 50.1, 59.6, 68.4, 76.2 and 81.1.', () => {
        all.forEach(r => { dot(k, k.pt(0, yy(r)), r[0] > 0); if (r[0] > 0 && r[0] % 20 === 0) lab(k, k.pt(0, yy(r)), r[0] + '°', 'sw', { size: 0.6, dist: 0.9 }); });
      });
      k.step('ruler', 'Along the horizontal through each mark lay off, to the right and left, the half-length 160 × X: 159.2 for 10°, 157.1, 153.6, 147.4, 138.8, 127.8, 114.9, 99.4 and 85.1 for the pole.', () => {
        all.forEach(r => { dot(k, pt(r, 180), r[0] === 40); dot(k, pt(r, -180), false); });
      });
      k.step('tee', 'Rule each parallel between its end marks. The pole is a line, 170 long: the Robinson map has flat poles, 0.53 of the equator.', () => {
        all.forEach(r => k.seg(pt(r, -180), pt(r, 180), { cls: 'cons', target: r[0] > 0 }));
      });
      k.step('dividers', 'Divide every parallel into twelve equal parts for the meridians every 30° (or into 36 for every 10°).', () => {
        all.forEach(r => range(-150, 150, 30).forEach(lo => { if (lo !== 0) dot(k, pt(r, lo), r[0] === 40); }));
        range(-150, 150, 30).forEach(lo => { if (lo !== 0) dot(k, k.pt(Lq * lo / 180, 0), false); });
      });
      k.step('pencil', 'Join the points of equal longitude with a French curve, pole to pole. The curves have no formula; they bend smoothly, a little more at the corners where the table\'s differences change most.', () => {
        LONS30.forEach(lo => { if (lo === 0) return; k.curve(range(-90, 90, 5).map(p => { const q = eng('robinson', lo, p, R); return [q.x, q.y]; }), null, { cls: Math.abs(lo) === 180 ? 'thick' : 'curve' }); });
      });
      k.note('Robinson called his map "orthophanic", right-looking. The scale along the parallels of 38° N and S is exactly 1; elsewhere area, angle and distance are all a little wrong, none of them disastrously. That is the compromise.', () => {
        k.text(0, Hq + 20, 'orthophanic: right-looking', { upright: true, size: 0.75 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Winkel tripel */
  Hyper.construction({
    id: 'ps-winkel-tripel',
    title: 'The Winkel tripel as the average of two graticules',
    tags: ['Winkel tripel', 'Aitoff', 'equirectangular', 'compromise', 'dividers'],
    note: 'Oswald Winkel\'s **tripel** (1921) is the **average** of two maps, point by point: the equirectangular map with its standard parallel at **φ₁ = arccos(2/π) = 50.46°** (x = R λ cos φ₁, y = R φ) and the Aitoff map (the azimuthal equidistant map of the half-longitudes, with its widths doubled). A point of longitude λ and latitude φ falls midway between its two images: **x = ½ (R λ cos φ₁ + x_Aitoff), y = ½ (R φ + y_Aitoff)**. By hand, join each node of one graticule to the same node of the other with the straightedge, and bisect the segment with the dividers. With R = 100 the equator is 2 × 257 long and the pole line 2 × 100, 39 % of the equator. Only the upper right quadrant is drawn.',
    build(k) {
      const R = 100, f1 = Math.acos(2 / PI), lons = [60, 120, 180], lats = [0, 30, 60, 90];
      const Eg = (lo, la) => k.pt(R * lo * D * cos(f1), R * la * D), Ag = (lo, la) => eng('aitoff', lo, la, R), Wg = (lo, la) => eng('winkel-tripel', lo, la, R);
      k.fontScale(0.8);
      k.given('The Aitoff graticule of the quadrant (drawn as on the Aitoff–Hammer page): meridians of 0°, 60°, 120°, 180° and parallels of 0°, 30°, 60°, 90°, with the twelve nodes A. R = 100.', () => {
        lons.concat([0]).forEach(lo => k.curve(meridian('aitoff', lo, R, {}, 0, 90, 3), null, { cls: 'cons', target: false }));
        lats.forEach(la => k.curve(parallel('aitoff', la, R, {}, 0, 180, 5), null, { cls: 'cons', target: false }));
        lons.forEach(lo => lats.forEach(la => dot(k, Ag(lo, la), false)));
        k.text(Ag(180, 0).x + 14, Ag(180, 0).y - 6, 'Aitoff', { anchor: 'start', upright: true, size: 0.75 });
        k.frame(-30, -25, Ag(180, 0).x + 45, R * PI / 2 + 30);
      });
      k.step('ruler', 'Mark on the equator the positions R λ cos φ₁ = 63.7 per radian of longitude: 66.7, 133.3 and 200.0 for 60°, 120°, 180°; and on the central meridian R φ: 52.4, 104.7 and 157.1 for 30°, 60° and the pole.', () => {
        lons.forEach(lo => dot(k, k.pt(R * lo * D * cos(f1), 0))); lats.forEach(la => { if (la > 0) dot(k, k.pt(0, R * la * D)); });
      });
      k.step('square', 'Through the marks on the equator draw verticals up to the pole height 157: the meridians of the equirectangular map (they are equally spaced, 0.64 as far apart as the true longitude).', () => {
        lons.forEach(lo => k.seg(k.pt(R * lo * D * cos(f1), 0), k.pt(R * lo * D * cos(f1), R * PI / 2), { cls: 'cons' }));
      });
      k.step('tee', 'Through the marks on the central meridian draw horizontals out to the 180° meridian: the parallels of the equirectangular map, equally spaced, nodes E at the crossings.', () => {
        lats.forEach(la => { if (la > 0) k.seg(k.pt(0, R * la * D), k.pt(R * PI * cos(f1), R * la * D), { cls: 'cons' }); });
        lons.forEach(lo => lats.forEach(la => dot(k, Eg(lo, la), false)));
      });
      k.step('straightedge', 'Join each node E to the node A of the Aitoff graticule with the same longitude and latitude.', () => {
        lons.forEach(lo => lats.forEach(la => { const a = Ag(lo, la), e = Eg(lo, la); if (Math.hypot(a.x - e.x, a.y - e.y) > 0.5) k.seg(e, a, { cls: 'red' }); }));
        lab(k, Eg(120, 30), 'E', 'sw', { size: 0.75 }); lab(k, Ag(120, 30), 'A', 'ne', { size: 0.75 });
      });
      k.step('dividers', 'Bisect each of these segments with the dividers: the midpoints W are the nodes of the Winkel tripel.', () => {
        lons.forEach(lo => lats.forEach(la => { const w = Wg(lo, la); dot(k, w, lo === 120); }));
        lab(k, Wg(120, 30), 'W', 'se', { size: 0.75 });
      });
      k.step('pencil', 'Draw the meridians and parallels of the Winkel map through the midpoints, with a French curve. Compare with the Aitoff graticule: the parallels are now curved less, the pole is a line, the meridians bend less.', () => {
        lons.forEach(lo => k.curve(meridian('winkel-tripel', lo, R, {}, 0, 90, 3), null, { cls: lo === 180 ? 'thick' : 'curve' }));
        [30, 60, 90].forEach(la => k.curve(parallel('winkel-tripel', la, R, {}, 0, 180, 5), null, { cls: 'curve' }));
        k.seg(k.pt(0, 0), eng('winkel-tripel', 180, 0, R), { cls: 'curve' });
      });
      k.note('Winkel chose the two ingredients so that the average keeps a little of each virtue: Aitoff gives the shape of the continents near the edges, the equirectangular keeps the poles from being points. The map is neither equal-area nor conformal, but its three errors (of area, angle and distance) are all small — which is what "tripel" means.', () => {
        k.text(Wg(180, 0).x + 14, Wg(180, 0).y + 14, 'Winkel', { anchor: 'start', upright: true, size: 0.75 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Hammer */
  Hyper.construction({
    id: 'ps-aitoff-hammer',
    title: 'Hammer\'s equal-area ellipse: the hemisphere doubled',
    tags: ['Hammer', 'Aitoff', 'Lambert', 'chord', 'ellipse', 'compass', 'dividers'],
    note: 'Hammer\'s map is the **Lambert azimuthal equal-area map of the hemisphere with half the longitudes** (a point of longitude λ treated as if it were λ/2), **with every width doubled**: x = 2√2 R cos φ sin(λ/2)/d, y = √2 R sin φ/d, d = √(1 + cos φ cos(λ/2)). The azimuthal map puts a point at the **chord** 2R sin(c/2) from the centre, c being its angular distance, and this gives most of the figure with a compass alone: the outline is the 2 : 1 ellipse with semi-axes 2√2 R and √2 R; the equator is marked at **4R sin(λ/4)**, the chord of a circle of radius 2R for the angle λ/2; the central meridian at **2R sin(φ/2)**, half the chord for the angle φ. The interior points of the graticule are plotted from a table (below). **Aitoff\'s map** is the same plan with the **arc** c in place of the chord (equator marks equally spaced, outline ellipse πR × πR/2, dashed in the last step): it is not equal-area. Table of Hammer nodes for R = 60 (x, y): 60°/30° → 55.5, 32.1 · 120°/30° → 106.3, 35.4 · 60°/60° → 35.4, 61.4 · 120°/60° → 65.7, 65.7.',
    build(k) {
      const R = 60, a = 2 * SQ2 * R, b = SQ2 * R, lats = [15, 30, 45, 60, 75, 90], betas = [15, 30, 45, 60, 75, 90];
      const O = k.pt(0, 0), r = 2 * R, Ce = k.pt(-330, r - 10), B0 = k.pt(Ce.x, Ce.y + r);
      const P = be => k.pt(Ce.x + r * sin(be * D), Ce.y + r * cos(be * D)), chord = be => 2 * r * sin(be * D / 2);
      const A_ = ph => k.pt(b * cos(ph * D), b * sin(ph * D)), B_ = ph => k.pt(a * cos(ph * D), a * sin(ph * D)), E_ = ph => k.pt(a * cos(ph * D), b * sin(ph * D));
      const H = (lo, la) => eng('hammer', lo, la, R);
      k.fontScale(0.7);
      k.given('The central meridian and the equator through O; R = 60. On the left, empty space for a circle of radius 2R that will lend its chords. The upper right quarter of the map is constructed.', () => {
        k.seg(k.pt(0, -b - 14), k.pt(0, b + 16), { cls: 'given' }); k.seg(k.pt(-a - 14, 0), k.pt(a + 14, 0), { cls: 'given' });
        k.point(O, 'O', 'sw'); lab(k, k.pt(a, 0), 'equator', 'se');
        k.frame(Ce.x - r - 25, -30, a + 25, Math.max(Ce.y + r, a) + 14);
      });
      k.step('compass', 'With centre O draw two quarter circles from the equator upwards: radius √2 R = 84.9 (inner) and 2√2 R = 169.7 (outer, to the end of the equator).', () => {
        k.arc(O, b, 0, PI / 2, { cls: 'cons' }); k.arc(O, a, 0, PI / 2, { cls: 'cons' });
      });
      k.step('protractor', 'Lay off the latitudes 15°, 30°, … 90° from the equator radius on both circles: the points A on the inner circle and B on the outer one.', () => {
        lats.forEach(p => { k.seg(O, B_(p), { cls: 'cons', target: false }); dot(k, A_(p)); dot(k, B_(p), false); });
      });
      k.step('tee', 'Through each A draw the horizontal (the parallel of that latitude, at √2 R sin φ).', () => {
        lats.forEach(p => k.seg(k.pt(0, b * sin(p * D)), k.pt(a * cos(p * D), b * sin(p * D)), { cls: 'cons' }));
      });
      k.step('square', 'Through each B draw the vertical down to the horizontal of the same latitude: the crossing E is the end of the parallel on the outline.', () => {
        lats.forEach(p => { if (p < 90) { k.seg(B_(p), E_(p), { cls: 'cons' }); dot(k, E_(p)); } });
      });
      k.step('pencil', 'Draw the outline through the points E: the ellipse, the meridian of ±180°.', () => {
        k.curve(range(0, 90, 3).map(t => [a * cos(t * D), b * sin(t * D)]), null, { cls: 'thick' });
      });
      k.step('compass', 'In the empty space draw a circle of radius 2R = 120 about a centre C; mark the top point B₀. Its chords will give the spacing of the equator and the central meridian.', () => {
        k.circle(Ce, r, { cls: 'cons' }); dot(k, Ce); lab(k, Ce, 'C', 'sw', { size: 0.65 }); dot(k, B0); lab(k, B0, 'B_{0}', 'n', { size: 0.65 });
      });
      k.step('protractor', 'From B₀ go round the circle by 15°, 30°, … 90° (central angle at C) and join B₀ to each point: the chords 2·2R sin(β/2) = 31.3, 62.1, 91.8, 120, 146.2 and 169.7.', () => {
        betas.forEach(be => { dot(k, P(be), false); k.seg(B0, P(be), { cls: 'cons' }); });
      });
      k.step('dividers', 'Take each chord with the dividers and lay it along the equator from O: the meridians of 30°, 60°, … 180° cut it at x = 4R sin(λ/4) (the chord for β = λ/2).', () => {
        betas.forEach(be => { dot(k, k.pt(chord(be), 0)); });
        lab(k, k.pt(chord(30), 0), '60°', 'sw', { size: 0.6, dist: 1.0 }); lab(k, k.pt(chord(60), 0), '120°', 'sw', { size: 0.6, dist: 1.0 });
      });
      k.step('dividers', 'Halve each chord (bisect with the dividers) and lay the half up the central meridian from O: the parallels 15°, 30°, … 90° cut it at y = 2R sin(φ/2) (the last is the pole, at √2 R).', () => {
        betas.forEach(be => { dot(k, k.pt(0, chord(be) / 2)); });
      });
      const NODES = [[60, 30], [120, 30], [60, 60], [120, 60]], Hs = (lo, la) => { const p = H(lo, la); return k.pt(p.x / 2, p.y); };
      k.step('ruler', 'Four interior nodes remain, where the 60° and 120° meridians meet the 30° and 60° parallels. First plot them on the hemisphere map of the half-longitudes (Lambert\'s azimuthal map, a disc of radius √2 R) from the table: (27.8, 32.1), (53.2, 35.4), (17.7, 61.4) and (32.9, 65.7), measured from the central meridian and the equator.', () => {
        NODES.forEach(q => dot(k, Hs(q[0], q[1])));
      });
      k.step('dividers', 'Now double every width: set the dividers from the central meridian to a node and step the same distance once more along the horizontal. The nodes move out to (55.5, 32.1), (106.3, 35.4), (35.4, 61.4) and (65.7, 65.7).', () => {
        NODES.forEach(q => { k.seg(Hs(q[0], q[1]), H(q[0], q[1]), { cls: 'cons', target: false }); dot(k, H(q[0], q[1])); });
      });
      k.step('pencil', 'Draw with a French curve the parallels of 30° and 60° (from the central meridian through the nodes to the outline) and the meridians of 60° and 120° (from the equator marks up through the nodes to the pole).', () => {
        [30, 60].forEach(la => k.curve(parallel('hammer', la, R, {}, 0, 180, 5), null, { cls: 'curve' }));
        [60, 120].forEach(lo => k.curve(meridian('hammer', lo, R, {}, 0, 90, 3), null, { cls: 'curve' }));
      });
      k.note('Aitoff\'s map follows the same plan with the arc in place of the chord: the equator is marked at equal intervals R λ (the outline ellipse, dashed here, has semi-axes πR and πR/2), the central meridian at R φ. The two maps look alike, but only Hammer\'s keeps the area: its chord is exactly what makes the azimuthal map equal-area.', () => {
        k.ellipse(O, PI * R, PI * R / 2, { cls: 'aux', dash: true, target: false });
        k.text(a + 6, b - 34, 'Aitoff outline', { anchor: 'start', upright: true, size: 0.65 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Van der Grinten */
  Hyper.construction({
    id: 'ps-van-der-grinten',
    title: 'Van der Grinten\'s circle, with compass and straightedge',
    tags: ['Van der Grinten', 'circles', 'compass', 'straightedge', 'compromise'],
    note: 'The whole world is a **circle**; the **equator** is a straight diameter divided equally; every **meridian** is a circular arc through the two poles and the corresponding point of the equator (its centre is on the equator, extended); every **parallel** is a circular arc with its centre on the **central meridian extended**. The parallels need a little more: the vertical radius is divided into equal parts, and the horizontal through the mark meets the outline at B; the line from the left end A of the equator through B cuts the central meridian at C, a point of the parallel; and the parallel meets the outline at the height D = U φ/(π − φ) (in units where the outline radius is U and φ in radians: 13.6, 30.0, 50.0, 75.0 and 107.1 for 15°, 30°, 45°, 60°, 75° and U = 150). The circle through C and the two points D is the parallel. Its centre, on the central meridian extended, is 2.0 U above the equator for 75°, 3.6 U for 60°, 7.1 U for 45°, 17 U for 30° and 71 U for 15°: far off the sheet, so use a flexible curve through the three points.',
    build(k) {
      const g = k.g, U = 150, lats = [15, 30, 45, 60, 75], O = k.pt(0, 0), N = k.pt(0, U), S = k.pt(0, -U), A = k.pt(-U, 0), A2 = k.pt(U, 0);
      const lons = [30, 60, 90, 120, 150];
      const xE = lo => U * lo / 180, hh = ph => U * ph / 90, th = ph => Math.asin(ph / 90);
      const Bp = ph => k.pt(sqrt(U * U - hh(ph) ** 2), hh(ph)), Cp = ph => k.pt(0, U * tan(th(ph) / 2)), yD = ph => U * (ph / 90) / (2 - ph / 90);
      const Dp = ph => k.pt(sqrt(U * U - yD(ph) ** 2), yD(ph));
      k.fontScale(0.9);
      k.given('The outline circle of radius U = 150 about O, its horizontal diameter (the equator) A A′ and its vertical diameter (the central meridian) N S, extended beyond both.', () => {
        k.circle(O, U, { cls: 'given' }); k.seg(A, A2, { cls: 'given' }); k.line(k.pt(0, -U * 1.12), k.pt(0, U * 1.12), { cls: 'cons' });
        k.point(O, 'O', 'se'); k.point(N, 'N', 'ne'); k.point(S, 'S', 'se'); k.point(A, 'A', 'sw'); k.point(A2, 'A′', 'se');
        k.frame(-U - 25, -U - 25, U + 25, U + 25);
      });
      k.step('dividers', 'Divide the equator into twelve equal parts, one for each 30° of longitude (25 each): the marks E on the right and left of O.', () => {
        lons.forEach(lo => { dot(k, k.pt(xE(lo), 0)); dot(k, k.pt(-xE(lo), 0), false); lab(k, k.pt(xE(lo), 0), lo + '°', 'sw', { size: 0.55, dist: 1.0 }); });
      });
      k.step('compass', 'For each mark E the meridian is the circle through N, S and E: its centre is where the perpendicular bisector of N E meets the equator. Draw the arcs of 60°, 90°, 120° and 150° (their centres are 1.33 U, 0.75 U, 0.42 U and 0.18 U to the left of O); the centre of the 30° one is 2.9 U away.', () => {
        [60, 90, 120, 150].forEach(lo => { const x = xE(lo), c = (x * x - U * U) / (2 * x), C = k.pt(c, 0), rr = x - c, aN = Math.atan2(U, -c); k.arc(C, rr, -aN, aN, { cls: 'curve' }); k.arc(k.pt(-c, 0), rr, PI - aN, PI + aN, { cls: 'curve', target: false }); });
      });
      k.step('pencil', 'The 30° meridian has its centre off the sheet: draw it with a flexible curve through N, E and S (and its mirror on the left).', () => {
        const x = xE(30), c = (x * x - U * U) / (2 * x), rr = x - c;
        const pts = range(-U, U, 5).map(y => [c + sqrt(rr * rr - y * y), y]); k.curve(pts, null, { cls: 'curve' });
        k.curve(pts.map(p => [-p[0], p[1]]), null, { cls: 'curve', target: false });
      });
      k.step('dividers', 'Divide the vertical radius O N into six equal parts (25 each): the heights U φ/90° for the parallels 15°, 30°, … 75° (and N for the pole).', () => {
        lats.forEach(p => { dot(k, k.pt(0, hh(p))); });
      });
      k.step('tee', 'Through each mark draw a horizontal to the outline circle on the right: the point B.', () => {
        lats.forEach(p => { k.seg(k.pt(0, hh(p)), Bp(p), { cls: 'cons' }); dot(k, Bp(p), false); });
      });
      k.step('straightedge', 'Draw the line from A, the left end of the equator, through each B until it cuts the central meridian: that point C (at U tan(θ/2), θ = arcsin(φ/90°)) is where the parallel crosses the central meridian.', () => {
        lats.forEach(p => { k.seg(A, Cp(p), { cls: 'cons' }); dot(k, Cp(p)); lab(k, Cp(p), p + '°', 'sw', { size: 0.55, dist: 1.0 }); });
      });
      k.step('ruler', 'On the outline lay off the heights of the table, 13.6, 30.0, 50.0, 75.0 and 107.1 for 15°, 30°, 45°, 60°, 75°, on the circle both sides (D and D′), and join D D′ with the T-square: the chord of the parallel.', () => {
        lats.forEach(p => { k.seg(Dp(p), k.pt(-Dp(p).x, Dp(p).y), { cls: 'cons' }); dot(k, Dp(p)); dot(k, k.pt(-Dp(p).x, Dp(p).y), false); });
      });
      k.step('pencil', 'Draw each parallel through the three points D, C, D′ with a flexible curve (the circle through them has its centre far above the sheet): the arcs bend gently at low latitudes and sharply near the pole.', () => {
        lats.forEach(p => { const C = Cp(p), Dd = Dp(p), Dl = k.pt(-Dd.x, Dd.y), M = g.circumcenter(Dl, C, Dd), rr = g.dist(M, C); const a0 = Math.atan2(Dl.y - M.y, Dl.x - M.x), a1 = Math.atan2(Dd.y - M.y, Dd.x - M.x); const pts = []; const n = 60; for (let i = 0; i <= n; i++) { const t = a0 + (a1 - a0) * i / n; pts.push([M.x + rr * cos(t), M.y + rr * sin(t)]); } k.curve(pts, null, { cls: 'curve' }); });
        k.seg(A, A2, { cls: 'curve', target: false });
      });
      k.note('The southern hemisphere is the mirror image. Everything here is straightedge and compass except the three-point curves for the flattest arcs, which in the drawing office used a beam compass or a flexible rule. The map is a compromise: the poles are pulled out to a point on the circle and Greenland and Antarctica balloon.', () => {
        lats.forEach(p => { const C = Cp(p), Dd = Dp(p), Dl = k.pt(-Dd.x, Dd.y); const M = g.circumcenter(Dl, C, Dd); if (g.dist(M, O) < 3.3 * U) { dot(k, M, false); lab(k, M, 'M_{' + p + '}', 'e', { size: 0.55 }); } });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Equal Earth */
  const EE = { A1: 1.340264, A2: -0.081106, A3: 0.000893, A4: 0.003796, M: sqrt(3) / 2 };
  const eeY = ph => { const t = Math.asin(EE.M * sin(ph * D)), t2 = t * t, t6 = t2 * t2 * t2; return t * (EE.A1 + EE.A2 * t2 + t6 * (EE.A3 + EE.A4 * t2)); };
  const eeHalf = ph => { const t = Math.asin(EE.M * sin(ph * D)), t2 = t * t, t6 = t2 * t2 * t2; return PI * cos(t) / (EE.M * (EE.A1 + 3 * EE.A2 * t2 + t6 * (7 * EE.A3 + 9 * EE.A4 * t2))); };
  Hyper.construction({
    id: 'ps-equal-earth',
    title: 'Equal Earth from a short table',
    tags: ['Equal Earth', 'equal-area', 'polynomial', 'table', 'Natural Earth'],
    note: 'Equal Earth (Šavrič, Patterson and Jenny, 2018) is an **equal-area** map with a **polynomial**: with θ = arcsin(√3/2 · sin φ), the height of the parallel is **y = R θ (A₁ + A₂θ² + θ⁶(A₃ + A₄θ²))** and the half-length of the parallel is **π R cos θ / [M (A₁ + 3A₂θ² + θ⁶(7A₃ + 9A₄θ²))]**, with A₁ = 1.340264, A₂ = −0.081106, A₃ = 0.000893, A₄ = 0.003796, M = √3/2. The table for R = 60 (**φ: y, half-length**): **0°: 0, 162.4 · 15°: 18.1, 159.8 · 30°: 35.6, 151.9 · 45°: 51.6, 139.2 · 60°: 65.3, 122.3 · 75°: 75.2, 104.7 · 90°: 79.0, 96.2**. The poles are flat lines, 0.59 of the equator; the width : height of the map is 2.05 : 1.',
    build(k) {
      const R = 60, lats = [15, 30, 45, 60, 75, 90], yy = ph => R * eeY(ph), hl = ph => R * eeHalf(ph);
      const pt = (ph, lo) => k.pt(hl(Math.abs(ph)) * lo / 180, yy(ph));
      const all = lats.flatMap(p => [p, -p]).concat([0]);
      k.fontScale(0.85);
      k.given('The central meridian, 2 × 79.0 long, and the equator, 2 × 162.4 long, through O (R = 60). The only other data is the table in the note.', () => {
        k.seg(k.pt(0, -yy(90) - 10), k.pt(0, yy(90) + 12), { cls: 'given' }); k.seg(k.pt(-hl(0), 0), k.pt(hl(0), 0), { cls: 'given' });
        k.point(k.pt(0, 0), 'O', 'se'); lab(k, k.pt(hl(0), 0), 'equator', 'ne');
        k.frame(-hl(0) - 20, -yy(90) - 25, hl(0) + 20, yy(90) + 28);
      });
      k.step('ruler', 'Up and down the central meridian lay off the heights of the table: 18.1, 35.6, 51.6, 65.3, 75.2 and 79.0 for 15°, 30°, … 90°.', () => {
        all.forEach(p => { if (p !== 0) { dot(k, k.pt(0, yy(p)), p > 0); if (p > 0 && p % 30 === 0) lab(k, k.pt(0, yy(p)), p + '°', 'sw', { size: 0.6, dist: 0.9 }); } });
      });
      k.step('ruler', 'Along each horizontal lay off the half-lengths: 159.8, 151.9, 139.2, 122.3, 104.7 and 96.2 (the pole line).', () => {
        all.forEach(p => { if (p !== 0) { dot(k, pt(p, 180), p === 45); dot(k, pt(p, -180), false); } });
      });
      k.step('tee', 'Rule the parallels between the end marks. The poles are flat lines, 192 long (0.59 of the equator).', () => {
        all.forEach(p => k.seg(pt(p, -180), pt(p, 180), { cls: p === 0 ? 'given' : 'cons', target: p !== 0 }));
      });
      k.step('dividers', 'Divide each parallel into twelve equal parts for the meridians every 30°.', () => {
        all.forEach(p => range(-150, 150, 30).forEach(lo => { if (lo !== 0) dot(k, pt(p, lo), p === 45); }));
      });
      k.step('pencil', 'Join the points of equal longitude from pole to pole with a French curve: gently curved meridians that bunch at the poles, and the ±180° meridians close an outline like a rounded barrel.', () => {
        LONS30.forEach(lo => { if (lo === 0) return; k.curve(range(-90, 90, 5).map(p => { const q = eng('equal-earth', lo, p, R); return [q.x, q.y]; }), null, { cls: Math.abs(lo) === 180 ? 'thick' : 'curve' }); });
      });
      k.note('Natural Earth, a compromise (not equal-area) designed by Tom Patterson in 2008, is drawn dashed: it is a little wider at the poles and a little taller. Equal Earth keeps the Robinson look but also keeps every area exact: Africa is still 14 times Greenland.', () => {
        k.curve(meridian('natural-earth', 180, R, {}, -90, 90, 5), null, { cls: 'aux', dash: true, target: false });
        k.curve(meridian('natural-earth', -180, R, {}, -90, 90, 5), null, { cls: 'aux', dash: true, target: false });
        k.text(0, yy(90) + 20, 'dashed: Natural Earth', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ Wagner VI */
  Hyper.construction({
    id: 'ps-wagner-ellipse',
    title: 'Wagner VI (and Kavrayskiy VII) from one ellipse',
    tags: ['Wagner VI', 'Kavrayskiy VII', 'ellipse', 'concentric circles', 'compromise'],
    note: 'In **Wagner VI** the parallels are equally spaced, y = R φ, and the half-length of the parallel is **πR √(1 − 3(φ/π)²)**: these are the points of an **ellipse** with semi-axes **a = πR** (horizontal) and **b = πR/√3** (vertical), cut by the pole lines at y = ±πR/2. The ellipse is drawn by the method of **two concentric circles**: radius a and radius b. For a parallel at the height y, the ray from O through the point of the inner circle at that height meets the outer circle at B, and the vertical from B gives the end of the parallel at x = a cos θ, where sin θ = y/b. The radius b = a/√3 = a tan 30° is found with a 30° set square. The meridian of longitude λ is the same ellipse with its horizontal axis shrunk in the ratio λ/π. **Kavrayskiy VII** is the same figure squeezed east–west by √3/2 = 0.866 (dashed in the last step): equator 5.44 R rather than 2π R = 6.28 R, in the ratio √3 : 1.',
    build(k) {
      const R = 50, a = PI * R, b = a * tan(30 * D), lats = [15, 30, 45, 60, 75, 90], O = k.pt(0, 0);
      const Y = ph => R * ph * D, A_ = ph => k.pt(sqrt(b * b - Y(ph) ** 2), Y(ph)), th = ph => Math.asin(Y(ph) / b), Bq = ph => k.pt(a * cos(th(ph)), a * sin(th(ph))), E_ = ph => k.pt(a * cos(th(ph)), Y(ph));
      const pt = (ph, lo) => k.pt(E_(ph).x * lo / 180, Y(ph));
      k.fontScale(0.8);
      k.given('The central meridian and the equator through O, R = 50. The equator will have half-length a = πR = 157.1. The upper right quarter is constructed.', () => {
        k.seg(k.pt(0, -Y(90) - 12), k.pt(0, b + 20), { cls: 'given' }); k.seg(k.pt(-a - 12, 0), k.pt(a + 12, 0), { cls: 'given' });
        k.point(O, 'O', 'sw'); lab(k, k.pt(a, 0), 'equator', 'se');
        k.frame(-a - 25, -30, a + 25, a + 14);
      });
      k.step('compass', 'With centre O and radius a = πR = 157.1 (to the end of the equator) draw the outer quarter circle.', () => {
        k.arc(O, a, 0, PI / 2, { cls: 'cons' });
      });
      k.step('square', 'At the end of the equator, E, draw the vertical tangent to the circle (set square on the T-square).', () => {
        k.seg(k.pt(a, 0), k.pt(a, a * tan(30 * D) + 10), { cls: 'cons' });
      });
      k.step('protractor', 'Lay off 30° from the equator at O and draw the ray until it meets the tangent at P. The height E P = a tan 30° = a/√3 = 90.7 is the vertical semi-axis b of the ellipse.', () => {
        k.angle(O, k.pt(1, 0), k.pt(a, b), { label: '30°', r: 2.2, labelDist: 1.1 }); k.seg(O, k.pt(a, b), { cls: 'cons' }); dot(k, k.pt(a, b)); lab(k, k.pt(a, b), 'P', 'ne', { size: 0.65 });
      });
      k.step('dividers', 'Carry the height E P with the dividers to the central meridian: the point T at the height b above O.', () => {
        dot(k, k.pt(0, b)); lab(k, k.pt(0, b), 'b', 'nw', { size: 0.65 });
      });
      k.step('compass', 'With centre O and radius b = 90.7 draw the inner quarter circle.', () => {
        k.arc(O, b, 0, PI / 2, { cls: 'cons' });
      });
      k.step('dividers', 'Step the true length of 15° of a meridian, R × 15° = 13.1, up the central meridian: the heights y = Rφ of the parallels 15°, 30°, … 90° (the last, at 78.5, is the pole line).', () => {
        lats.forEach(p => { dot(k, k.pt(0, Y(p))); lab(k, k.pt(0, Y(p)), p + '°', 'sw', { size: 0.58, dist: 0.9 }); });
      });
      k.step('tee', 'Through each mark draw a horizontal to the inner circle: the point A at that height.', () => {
        lats.forEach(p => { k.seg(k.pt(0, Y(p)), A_(p), { cls: 'cons' }); dot(k, A_(p), false); });
      });
      k.step('straightedge', 'Draw the ray from O through each A and extend it to the outer circle: the point B (its angle θ has sin θ = y/b).', () => {
        lats.forEach(p => { k.seg(A_(p), Bq(p), { cls: 'cons' }); dot(k, Bq(p), false); });
      });
      k.step('square', 'From each B drop the vertical to the horizontal of the same latitude. Where they meet, the point E on the ellipse is the end of that parallel; extend each parallel to it.', () => {
        lats.forEach(p => { k.seg(Bq(p), E_(p), { cls: 'cons' }); k.seg(A_(p), E_(p), { cls: 'cons' }); dot(k, E_(p)); });
      });
      k.step('dividers', 'Divide each half-parallel into six equal parts for the meridians every 30°.', () => {
        lats.forEach(p => range(30, 150, 30).forEach(lo => dot(k, pt(p, lo), p === 45)));
      });
      k.step('pencil', 'Join the points of equal longitude, pole to pole (and the outline ±180°, which is the ellipse itself): each meridian is the same ellipse shrunk in the ratio λ/π.', () => {
        range(30, 180, 30).forEach(lo => k.curve(range(0, 90, 2).map(p => { const q = eng('wagner6', lo, p, R); return [q.x, q.y]; }), null, { cls: lo === 180 ? 'thick' : 'curve' }));
      });
      k.note('The dashed outline is Kavrayskiy VII: the same drawing with every x multiplied by √3/2. Wagner VI has an equator exactly twice the central meridian; Kavrayskiy VII has the proportions √3 : 1, a little more compact, and the pole line is 0.87 of the half-length of Wagner\'s.', () => {
        k.curve(range(0, 90, 2).map(p => { const q = eng('kavrayskiy7', 180, p, R); return [q.x, q.y]; }), null, { cls: 'aux', dash: true, target: false });
      });
    }
  });
})();
