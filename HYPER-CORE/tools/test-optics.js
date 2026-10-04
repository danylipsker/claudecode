/* Tests of HYPER-CORE/js/optics.js, optics-wave.js, optics-vision.js and opticsym.js (kit.optics, kit.osym).
 * Run: node HYPER-CORE/tools/test-optics.js */
'use strict';
const path = require('path');
const L = require('./load.js');
const H = L.loadCore(), O = H.optics;
L.run(H._ctx, path.join(__dirname, '..', 'js', 'opticsym.js'));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), m + ' (got ' + a + ', want ' + b + ')');
const abs = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');
const deg = O.deg, rad = O.rad;

/* ---------------------------------------------------------------- materials */
{
  const cat = { 'N-BK7': [1.5168, 64.17], 'N-K5': [1.52249, 59.48], 'N-BAK4': [1.56883, 55.98], 'N-SK16': [1.62041, 60.32], 'N-LAK9': [1.69100, 54.71], 'N-FK51A': [1.48656, 84.47],
    'N-BAF10': [1.67003, 47.11], 'F2': [1.62004, 36.37], 'N-SF5': [1.67271, 32.25], 'N-SF10': [1.72828, 28.53], 'N-SF11': [1.78472, 25.68], 'N-SF6': [1.80518, 25.36],
    'fused-silica': [1.45846, 67.82], 'CaF2': [1.43384, 95.0], 'sapphire': [1.7682, 72.2], 'MgF2': [1.3777, 106.2], 'water': [1.3330, 55.8], 'PMMA': [1.4918, 57.4], 'PC': [1.5855, 29.9] };
  for (const [id, [nd, vd]] of Object.entries(cat)) {
    const a = O.abbe(id);
    abs(a.nd, nd, 3e-4, id + ': nd');
    abs(a.vd, vd, Math.max(0.4, 0.012 * vd), id + ': Abbe number');
  }
  ok(O.index('N-BK7', 450) > O.index('N-BK7', 650), 'normal dispersion: blue is bent more');
  abs(O.index('N-BK7', 632.8), 1.51509, 2e-4, 'N-BK7 at the HeNe line');
  abs(O.index('fused-silica', 1064), 1.44963, 2e-4, 'fused silica at 1064 nm');
  ok(O.glassCode('N-BK7') === '517642', 'glass code of N-BK7 is 517642 (got ' + O.glassCode('N-BK7') + ')');
  ok(O.groupIndex('N-BK7', 800) > O.index('N-BK7', 800), 'group index exceeds the phase index in glass');
  for (const id of Object.keys(O.MATERIALS)) { const n = O.index(id, 550); ok(Number.isFinite(n) && n >= 1 && n < 4.5, 'material ' + id + ' has a sensible index (' + n + ')'); }
  near(O.photonEnergy(555), 2.234, 1e-3, 'a 555 nm photon carries 2.23 eV');
  near(O.frequency(500), 5.996e14, 1e-3, '500 nm is 600 THz');
  ok(O.colourName(532) === 'green' && O.colourName(650) === 'red' && O.colourName(300) === 'UV-B' && O.colourName(1550) === 'short-wave infrared (IR-B)', 'colour names');
}

/* ---------------------------------------------------------------- one surface */
{
  near(deg(O.snell(1, 1.5, rad(30))), 19.471, 1e-4, 'Snell: 30° into n = 1.5');
  ok(Number.isNaN(O.snell(1.5, 1, rad(45))), 'beyond the critical angle there is no refracted ray');
  near(deg(O.criticalAngle(1.5, 1)), 41.810, 1e-4, 'critical angle of glass');
  near(deg(O.criticalAngle(1.333, 1)), 48.607, 1e-4, 'critical angle of water');
  near(deg(O.brewster(1, 1.5)), 56.310, 1e-4, 'Brewster angle of glass');
  const f0 = O.fresnel(1, 1.5, 0);
  near(f0.R, 0.04, 1e-9, 'glass reflects 4 % at normal incidence');
  near(O.fresnel(1, 1.5, O.brewster(1, 1.5)).Rp, 0, 1e-12, 'no p reflection at Brewster\'s angle');
  near(O.fresnel(1, 1.5, rad(45)).Rs, 0.0920, 2e-3, 'Rs at 45° on glass');
  near(O.fresnel(1, 1.5, rad(45)).Rp, 0.00846, 2e-2, 'Rp at 45° on glass = Rs²');
  const tir = O.fresnel(1.5, 1, rad(60));
  ok(tir.tir && Math.abs(tir.Rs - 1) < 1e-12 && Math.abs(tir.Rp - 1) < 1e-12, 'total internal reflection reflects everything');
  ok(Math.abs(tir.phaseS) > 0.1 && Math.abs(tir.phaseP) > 0.1 && Math.abs(tir.phaseS - tir.phaseP) > 0.1, 'TIR shifts the phases of s and p differently (the Fresnel rhomb)');
  const g = O.fresnel(1, 1.5, rad(89.9)); ok(g.Rs > 0.98 && g.Rp > 0.98, 'grazing incidence reflects almost everything');
  // metals
  const al = O.normalR(1, O.metalIndex('aluminium', 550)), ag = O.normalR(1, O.metalIndex('silver', 550)), au5 = O.normalR(1, O.metalIndex('gold', 480)), au7 = O.normalR(1, O.metalIndex('gold', 700));
  ok(al > 0.89 && al < 0.93, 'aluminium reflects about 91 % in the green (got ' + al + ')');
  ok(ag > 0.96 && ag < 0.995, 'silver reflects about 98 % in the green (got ' + ag + ')');
  ok(au5 < 0.45 && au7 > 0.94, 'gold is poor in the blue, excellent in the red (got ' + au5 + ', ' + au7 + ')');
  near(O.normalR(1, 4.0), 0.36, 1e-9, 'germanium reflects 36 % per surface');
  // prism
  near(deg(O.minDeviation(1.5, rad(60))), 37.181, 1e-4, 'minimum deviation of a 60° prism, n = 1.5');
  near(O.prismIndex(rad(60), O.minDeviation(1.62, rad(60))), 1.62, 1e-9, 'index from the minimum deviation');
  const p = O.prism(1.5, rad(60), Math.asin(1.5 * Math.sin(rad(30))));
  near(p.delta, O.minDeviation(1.5, rad(60)), 1e-9, 'the symmetric ray is the one of minimum deviation');
  ok(O.prism(1.5, rad(60), rad(10)).tir, 'a steep ray is totally reflected at the second face');
  near(deg(O.rainbow(1.333, 1).angle), 42.08, 2e-3, 'primary rainbow at 42°');
  near(deg(O.rainbow(1.333, 2).angle), 50.9, 5e-3, 'secondary rainbow at 51°');
  ok(O.rainbow(O.index('water', 420), 1).angle < O.rainbow(O.index('water', 680), 1).angle, 'red is on the outside of the primary bow');
  near(O.apparentDepth(1, 1.333), 0.750, 1e-3, 'a pool looks three quarters as deep');
}

/* ---------------------------------------------------------------- thin lenses and matrices */
{
  const im = O.thinLens(100, 300);
  near(im.si, 150, 1e-12, 'thin lens: 300 → 150'); near(im.m, -0.5, 1e-12, 'magnification −½');
  const v = O.thinLens(100, 50); near(v.si, -100, 1e-12, 'inside the focus: a virtual image'); ok(!v.real && v.upright && v.m === 2, 'magnifier: upright, twice the size');
  near(O.lensmaker(1.5, 100, -100, 0), 100, 1e-12, 'lensmaker, thin biconvex');
  near(O.lensmaker(1.5, 100, -100, 10), 101.695, 1e-5, 'lensmaker, thick biconvex');
  near(O.lensmaker(1.5, 50, 0, 0), 100, 1e-12, 'plano-convex: f = R/(n − 1)');
  near(O.twoLenses(100, 100, 50).f, 66.667, 1e-5, 'two lenses 50 apart');
  ok(O.twoLenses(200, -50, 150).afocal, 'a Galilean telescope is afocal');
  near(O.bestFormShape(1.5), 0.7143, 1e-4, 'best-form shape factor for n = 1.5');
  const A = O.abcd;
  // a thick lens by matrices against the lensmaker's equation
  const Mx = A.mul(A.surface(1, 1.5, 100), A.free(10), A.surface(1.5, 1, -100)), c = A.cardinal(Mx);
  near(c.efl, 101.695, 1e-5, 'ABCD thick lens focal length');
  near(c.bfd, 98.305, 1e-5, 'ABCD back focal distance');
  near(A.det(Mx), 1, 1e-12, 'determinant 1 in air');
  near(A.image(A.lens(100), 300).si, 150, 1e-12, 'ABCD imaging'); near(A.image(A.lens(100), 300).m, -0.5, 1e-12, 'ABCD magnification');
  near(A.cardinal(A.mirror(-200)).efl, 100, 1e-12, 'a concave mirror of radius 200 focuses at 100');
}

/* ---------------------------------------------------------------- lens systems */
{
  const S = O.sys;
  const thick = { surfaces: [{ R: 100, t: 10, n: 1.5, sd: 10, stop: true }, { R: -100, n: 1, sd: 10 }] };
  const p = S.paraxial(thick);
  near(p.efl, 101.695, 1e-5, 'system: thick lens focal length'); near(p.bfd, 98.305, 1e-5, 'system: back focal distance'); near(p.ffd, 98.305, 1e-5, 'system: front focal distance (symmetric lens)');
  near(p.epd, 20, 1e-12, 'pupil = the stop at the first surface'); near(p.fno, 101.695 / 20, 1e-5, 'f-number');
  near(p.Hrear - 10, -(101.695 - 98.305), 1e-4, 'rear principal plane inside the lens'); near(p.Hfront, 101.695 - 98.305, 1e-4, 'front principal plane');
  // a paraxial ray traced exactly lands at the paraxial focus
  const tr = S.trace(thick, { p: [0, 1e-4, -5], d: [0, 0, 1] });
  near(S.axisCrossing(tr), p.zImage, 1e-6, 'a ray close to the axis crosses at the paraxial focus');
  // finite conjugates
  const fin = Object.assign({}, thick, { object: 300 }), pf = S.paraxial(fin);
  const A = O.abcd, im = A.image(A.mul(A.surface(1, 1.5, 100), A.free(10), A.surface(1.5, 1, -100)), 300);
  near(pf.zImage - 10, im.si, 1e-9, 'finite object: image distance agrees with the matrix'); near(pf.m, im.m, 1e-9, 'and so does the magnification');
  // library lenses have the focal lengths they claim
  near(S.paraxial(O.lens('biconvex')).efl, 100, 1e-6, 'library biconvex f = 100');
  near(S.paraxial(O.lens('plano-convex')).efl, 100, 1e-6, 'library plano-convex f = 100');
  near(S.paraxial(O.lens('biconcave')).efl, -100, 1e-6, 'library biconcave f = −100');
  near(S.paraxial(O.lens('achromat')).efl, 100, 6e-3, 'catalogue achromat f ≈ 100');
  near(S.paraxial(O.lens('cooke-triplet')).efl, 50, 1e-2, 'Cooke triplet f ≈ 50');
  near(S.paraxial(O.lens('double-gauss')).efl, 100, 1.5e-2, 'double Gauss f ≈ 100');
  near(S.paraxial(O.lens('parabolic-mirror')).efl, 1000, 1e-9, 'parabolic mirror f = 1000');
  near(S.paraxial(O.lens('cassegrain')).efl, 3200, 1e-6, 'Cassegrain f = m·f1');
  const eye = S.paraxial(O.lens('eye'));
  near(1000 / eye.efl, 60, 1.5e-2, 'the schematic eye has about 60 dioptres (got ' + 1000 / eye.efl + ')');
  near(eye.bfd, 16.6, 4e-2, 'and focuses a distant object near its retina (got ' + eye.bfd + ')');
  // spherical aberration: marginal rays of a positive singlet focus short; the right way round is better
  const lsaA = S.lsa(O.lens('plano-convex'), 587.56, 10).pop()[1], lsaB = S.lsa(O.lens('convex-plano-reversed'), 587.56, 10).pop()[1], lsaC = S.lsa(O.lens('best-form'), 587.56, 10).pop()[1];
  ok(lsaA < 0 && lsaB < 0, 'undercorrected spherical aberration: the marginal focus is short');
  ok(Math.abs(lsaB) > 3 * Math.abs(lsaA), 'a plano-convex lens the wrong way round has about four times the spherical aberration (' + lsaA.toFixed(3) + ' vs ' + lsaB.toFixed(3) + ')');
  ok(Math.abs(lsaC) <= Math.abs(lsaA) * 1.001, 'the best-form lens is at least as good as plano-convex');
  // Seidel against the exact trace: at f/10 third order dominates
  for (const id of ['biconvex', 'plano-convex', 'convex-plano-reversed']) {
    const sys = O.lens(id); sys.surfaces.forEach(s => { s.sd = 5; });
    const sd = S.seidel(sys), real = S.lsa(sys, 587.56, 10).pop()[1];
    near(sd.lsa, real, 0.04, id + ': third-order LSA matches the traced marginal ray at f/10');
  }
  // a paraboloid is free of spherical aberration for a distant object; a sphere is not
  const para = S.spot(O.lens('parabolic-mirror'), { rings: 5 }), sph = S.spot(O.lens('spherical-mirror'), { rings: 5 });
  ok(para.rms < 1e-9, 'paraboloid: a perfect point on axis (rms ' + para.rms + ')'); ok(sph.rms > 1e-3, 'spherical mirror: a blur');
  near(S.seidel(O.lens('parabolic-mirror')).S1, 0, 1e-12, 'Seidel S1 of a paraboloid is zero');
  ok(Math.abs(S.seidel(O.lens('spherical-mirror')).S1) > 1e-6, 'Seidel S1 of a spherical mirror is not');
  near(S.seidel(O.lens('spherical-mirror')).lsa, S.lsa(O.lens('spherical-mirror'), 587.56, 10).pop()[1], 0.02, 'spherical mirror: Seidel LSA = h²/(8f) matches the trace');
  { const cs = S.spot(O.lens('cassegrain'), { rings: 5 }); ok(cs.rms < 1e-7 && cs.n === 91 && cs.lost === 0, 'classical Cassegrain: a perfect point on axis, every ray through (' + cs.n + ' rays, rms ' + cs.rms + ')'); }
  { const cs = S.spot(O.lens('cassegrain'), { rings: 5, field: rad(0.25) }); ok(cs.lost === 0 && cs.rms > 1e-4, 'Cassegrain a quarter of a degree off axis: all rays through, coma appears'); }
  // rays start far in front of a concave first surface and still meet it next to its vertex
  { const bc = O.lens('biconcave'), fan = S.fan2d(bc, { n: 5, zStart: -200 }); ok(fan.every(r => r.ok && Math.abs(r.pts[1][0]) < 2), 'a concave first surface is met near its vertex from far away'); ok(S.spot(bc, { rings: 5 }).lost === 0, 'no rim rays lost in a diverging singlet'); }
  // rays are aimed at the real stop: an off-axis bundle fills it exactly
  { const tp = O.lens('cooke-triplet'), par = S.paraxial(tp), si = par.stop; let worst = 0; for (const [px, py] of [[0, 1], [0, -1], [1, 0], [0.7, 0.7]]) { const tr = S.trace(tp, S.aim(tp, px, py, tp.field, par), 587.56, { clip: false }), hpt = tr.pts[si + 1], rS = par.epd / 2 / par.magE; worst = Math.max(worst, Math.hypot(hpt[0] - px * rS, hpt[1] - py * rS)); } ok(worst < 1e-5, 'aimed rays cross the stop where they were asked to (worst miss ' + worst + ' mm)'); }
  ok(S.spot(O.lens('eye'), { rings: 5, field: rad(10) }).lost === 0, 'the schematic eye passes a full bundle 10° off axis');
  // a glass ball: the ray leaves the front of the sphere and must find its back, not the front again
  { const ball = { surfaces: [{ R: 10, t: 20, n: 1.5, sd: 9.9, stop: true }, { R: -10, n: 1, sd: 9.9 }] }, pb = S.paraxial(ball), tb = S.trace(ball, { p: [0, 0.01, -5], d: [0, 0, 1] });
    near(pb.efl, 1.5 * 20 / (4 * 0.5), 1e-9, 'a ball lens: EFL = nD/(4(n − 1))'); near(pb.bfd, 5, 1e-9, 'its focus is a quarter of a diameter behind it'); ok(tb.ok && Math.abs(tb.pts[2][2] - 20) < 0.01 && Math.abs(S.axisCrossing(tb) - 25) < 0.01, 'a ray through the ball reaches the far surface and the focus'); }
  { const fm = O.mirrorImage(Infinity, 300); ok(fm.si === -300 && fm.m === 1 && !fm.real, 'a flat mirror: a virtual image as far behind as the object is in front'); }
  // the library's stops give the apertures the names promise
  near(S.paraxial(O.lens('cooke-triplet')).fno, 5, 0.01, 'the triplet works at f/5'); near(S.paraxial(O.lens('double-gauss')).fno, 3, 0.012, 'the double Gauss at f/3');
  // a stop at the back focus of a lens: the entrance pupil is at infinity and the chief rays leave the object parallel to the axis
  { const th = O.design.thin(50, 12); th[1].t = 50; const tele = { object: 100, surfaces: th.concat([{ R: 0, n: 1, sd: 2, stop: true }]) }, pt = S.paraxial(tele);
    ok(pt.telecentricObject && !Number.isFinite(pt.zEP), 'a stop at the rear focal plane makes the system object-space telecentric');
    const chief = S.aim(tele, 0, 0, 5, pt), edge = S.aim(tele, 0, 1, 5, pt), tr = S.trace(tele, edge, 587.56, { clip: false });
    ok(Math.abs(chief.d[1]) < 2e-3 && Math.abs(chief.p[1] - 5) < 1e-12, 'its chief ray leaves the object parallel to the axis (slope ' + chief.d[1] + ')'); near(tr.pts[3][1], 2, 1e-6, 'and the marginal ray grazes the stop');
    ok(S.fan2d(tele, { n: 5, field: 5 }).every(r => r.pts.every(q => Number.isFinite(q[0]) && Number.isFinite(q[1]))), 'a telecentric fan is finite'); near(pt.fnoWorking, 100 / (2 * 2) / 2, 0.02, 'working f-number of the telecentric lens at 1:1'); }
  near(S.paraxial(S.withFocal(O.lens('biconcave'), 35)).efl, -35, 1e-9, 'scaling a diverging lens keeps it diverging');
  { const bad = O.design.achromat({ f: 100, D: 25, crown: 'N-SF6', flint: 'N-SF11' }); ok(bad.feasible === false && Number.isFinite(S.paraxial(bad).efl), 'two glasses of the same dispersion: no achromat, and the designer says so'); }
  { const g = O.design.achromat({ f: 100, D: 25, crown: 'N-BAK4', flint: 'F2' }); ok(g.feasible && Math.abs(S.paraxial(g).efl - 100) < 1e-6 && g.surfaces.every(s => s.t == null || s.t > 0), 'another glass pair designs cleanly'); }
  ok(S.spot(O.lens('parabolic-mirror'), { rings: 5, field: rad(0.5) }).rms > 1e-3, 'a paraboloid has coma off axis');
  // chromatic aberration and the achromat
  const cs = S.chromaticShift(O.lens('biconvex'), [486.13, 656.27]);
  near(cs[1][1] - cs[0][1], 100 / 64.17, 0.03, 'singlet: F–C focal shift = f/V');
  const ca = S.chromaticShift(O.lens('achromat'), [486.13, 656.27]);
  ok(Math.abs(ca[1][1] - ca[0][1]) < 0.15, 'achromat: F and C focus within a tenth of the 1.5 mm of a singlet (' + (ca[1][1] - ca[0][1]).toFixed(4) + ' mm apart)');
  const des = O.design.achromat({ f: 200, D: 40 }), pd = S.paraxial(des), cd = S.chromaticShift(des, [486.13, 656.27]);
  near(pd.efl, 200, 1e-6, 'designed achromat has the focal length asked for'); ok(Math.abs(cd[1][1] - cd[0][1]) < 2e-4, 'and F and C focus together (' + (cd[1][1] - cd[0][1]) + ' mm apart)');
  { const ed = O.design.achromat({ f: 100, D: 25, crown: 'N-FK51A', flint: 'N-LAK9' }), ce = S.chromaticShift(ed, [486.13, 656.27]); ok(ed.feasible && Math.abs(ce[1][1] - ce[0][1]) < 2e-4 && Math.abs(S.paraxial(ed).efl - 100) < 1e-6, 'a low-dispersion pair is brought to one focus too'); }
  near(S.seidel(O.lens('biconvex')).petzvalRadius, -100 * 1.5168, 0.02, 'the Petzval radius needs no field angle');
  // a sphere plus the r⁴ term −c³/8 is a paraboloid to fourth order: no third-order spherical aberration, and a far smaller spot
  { const sph = O.design.newtonian({ f: 1000, D: 200, k: 0 }), asp = O.design.newtonian({ f: 1000, D: 200, k: 0 }); asp.surfaces[0].A = [-Math.pow(1 / -2000, 3) / 8];
    ok(Math.abs(S.seidel(asp).S1) < 1e-6 * Math.abs(S.seidel(sph).S1), 'the r⁴ term of an asphere enters the Seidel sum (' + S.seidel(asp).S1 + ' against ' + S.seidel(sph).S1 + ')');
    ok(S.spot(asp, { rings: 5 }).rms < S.spot(sph, { rings: 5 }).rms / 100, 'and the traced spot agrees'); }
  ok(Math.abs(S.seidel(des).S1) < 0.1 * Math.abs(S.seidel(O.design.singlet({ f: 200, D: 40, q: 0 })).S1), 'and has far less spherical aberration than a singlet');
  ok(S.spot(des).rms < S.spot(O.design.singlet({ f: 200, D: 40, q: 0 })).rms / 5, 'designed achromat: a much smaller spot');
  // the triplet and the double Gauss image sharply on axis and decently off axis
  for (const [id, lim] of [['cooke-triplet', 0.02], ['double-gauss', 0.03]]) {
    const sys = O.lens(id), bf = S.bestFocus(sys, { rings: 4 });
    ok(bf.rms < lim, id + ': on-axis rms spot ' + bf.rms.toFixed(4) + ' mm');
    const off = S.spot(sys, { field: sys.field * 0.7, z: bf.z, rings: 4 });
    ok(off.rms < 0.12 && off.n > 30, id + ': off-axis rms spot ' + off.rms.toFixed(4) + ' mm, ' + off.n + ' rays through');
  }
  const pz = S.seidel(O.lens('biconvex'), { field: rad(10) });
  near(pz.petzvalRadius, -100 * 1.5168, 0.02, 'Petzval radius of a thin lens is −n f');
  ok(pz.S3 !== 0 && pz.S2 !== 0 && pz.C1 !== 0, 'off-axis Seidel terms are computed');
  // drawing helpers
  const fan = S.fan2d(O.lens('cooke-triplet'), { n: 5, field: rad(10) });
  ok(fan.length === 5 && fan.every(r => r.pts.length >= 7 && r.pts.every(q => Number.isFinite(q[0]) && Number.isFinite(q[1]))), 'fan2d gives finite polylines');
  ok(S.elements(O.lens('double-gauss')).length === 4 + 0 || S.elements(O.lens('double-gauss')).length === 6, 'double Gauss elements grouped (' + S.elements(O.lens('double-gauss')).length + ')');
  ok(S.elements(O.lens('achromat')).length === 1, 'a cemented doublet is one element');
  near(S.paraxial(S.withFocal(O.lens('cooke-triplet'), 35)).efl, 35, 1e-9, 'scaling a design to another focal length');
  const two = O.design.twoLens({ f1: 100, f2: -50, d: 60 }); near(S.paraxial(two).efl, O.twoLenses(100, -50, 60).f, 1e-3, 'two thin lenses as a system');
  const z = O.design.zoom2(100, -40, 150); near(O.twoLenses(100, -40, z.d).f, 150, 1e-9, 'two-group zoom spacing gives the focal length asked for');
  // vignetting and total reflection are reported
  ok(S.trace(thick, { p: [0, 20, -5], d: [0, 0, 1] }).why === 'vignetted', 'a ray outside the aperture is vignetted');
}

/* ---------------------------------------------------------------- thin films */
{
  const F = O.film;
  near(F.stack({ ns: 1.52, layers: [] }, 550).R, Math.pow(0.52 / 2.52, 2), 1e-9, 'bare glass');
  const q = F.stack({ ns: 1.52, layers: [{ n: 1.38, d: F.quarterWave(1.38, 550) }] }, 550);
  near(q.R, Math.pow((1.52 - 1.38 * 1.38) / (1.52 + 1.38 * 1.38), 2), 1e-9, 'quarter wave of MgF₂: R = ((ns − n²)/(ns + n²))²');
  near(q.R + q.T, 1, 1e-12, 'no absorption: R + T = 1');
  near(F.stack({ ns: 1.52, layers: [{ n: 1.38, d: F.quarterWave(1.38, 550, 0.5) }] }, 550).R, Math.pow(0.52 / 2.52, 2), 1e-9, 'a half-wave layer is absent');
  near(F.stack({ ns: 1.52, layers: [{ n: Math.sqrt(1.52), d: F.quarterWave(Math.sqrt(1.52), 550) }] }, 550).R, 0, 1e-12, 'the ideal quarter-wave layer n = √ns reflects nothing');
  const v = F.design('vcoat', 550, 1.52); ok(F.stack(v, 550).R < 1e-5, 'V-coat: zero at the design wavelength (' + F.stack(v, 550).R + ')'); ok(F.stack(v, 450).R > 0.005, 'and a narrow V');
  const bb = F.design('bbar', 520, 1.52); ok(Math.max(...F.spectrum(bb, 430, 650, 40).map(r => r.R)) < 0.012, 'broadband AR below about 1 % from 430 to 650 nm');
  const hr = F.design('hr', 600, 1.52); ok(F.stack(hr, 600).R > 0.999, 'a 17-layer quarter-wave stack reflects > 99.9 %'); ok(F.stack(hr, 450).R < 0.5, 'and has a finite band');
  const bp = F.design('bandpass', 550, 1.52); ok(F.stack(bp, 550).T > 0.9 && F.stack(bp, 520).T < 0.1 && F.stack(bp, 580).T < 0.1, 'band-pass filter: a narrow line at the design wavelength');
  const lp = F.design('longpass', 550, 1.52), sp = F.design('shortpass', 550, 1.52);
  ok(F.stack(lp, 480).T < 0.05 && F.stack(lp, 620).T > 0.8, 'long-pass: blocks 480, passes 620 (' + F.stack(lp, 480).T.toFixed(3) + ', ' + F.stack(lp, 620).T.toFixed(3) + ')');
  ok(F.stack(sp, 620).T < 0.05 && F.stack(sp, 480).T > 0.8, 'short-pass: passes 480, blocks 620 (' + F.stack(sp, 480).T.toFixed(3) + ', ' + F.stack(sp, 620).T.toFixed(3) + ')');
  const al = F.stack(F.design('aluminium'), 550); ok(al.R > 0.86 && al.R < 0.93 && al.T === 0 && Math.abs(al.R + al.A - 1) < 1e-9, 'protected aluminium about 90 %; a metal transmits nothing and absorbs the rest (' + al.R + ')');
  ok(O.glassCode('diamond') === '' && O.glassCode('MgF2') === '' && O.glassCode('germanium') === '' && O.glassCode('F2') === '620364', 'glass codes only where the six-digit scheme applies');
  ok(F.stack(F.design('enhancedAl'), 550).R > al.R + 0.02, 'enhanced aluminium beats it');
  // angle of incidence: the band shifts to the blue, and s and p split
  const hr45 = F.stack(hr, 600, rad(45)); ok(hr45.Rs > hr45.Rp, 'at 45° a mirror reflects s better than p');
  const edge = (th) => { let e = 0; for (let nm = 620; nm < 800; nm += 1) if (F.stack(hr, nm, th).R < 0.5) { e = nm; break; } return e; };
  ok(edge(rad(45)) < edge(0) - 15, 'the reflection band moves to shorter wavelengths at 45° (' + edge(0) + ' → ' + edge(rad(45)) + ' nm)');
  // bare interface by the matrix method agrees with Fresnel at an angle, both polarisations
  const fr = O.fresnel(1, 1.52, rad(50)), st = F.stack({ ns: 1.52, layers: [] }, 550, rad(50));
  near(st.Rs, fr.Rs, 1e-9, 'film code = Fresnel, s'); near(st.Rp, fr.Rp, 1e-9, 'film code = Fresnel, p');
  // etalon
  const e = O.etalon({ R: 0.9, d: 1e-3, nm: 500 }); near(e.finesse, 29.8, 1e-2, 'finesse of R = 0.9'); near(e.fsrNm, 0.125, 1e-9, 'free spectral range λ²/2d');
  near(O.etalon({ R: 0.9, d: 1e-3, nm: 500, n: 1 }).T, 1, 1e-6, 'resonant when 2d is a whole number of wavelengths');
}

/* ---------------------------------------------------------------- diffraction, MTF */
{
  const D = O.diff;
  near(O.besselJ0(2.404826), 0, 1e-6, 'first zero of J0'); near(O.besselJ1(3.831706), 0, 1e-6, 'first zero of J1'); near(O.besselJ1(1.84118), 0.581865, 1e-5, 'maximum of J1');
  near(O.besselJ0(20), 0.167025, 1e-4, 'J0(20) by the asymptotic form'); near(O.besselJ1(15), 0.205104, 1e-4, 'J1(15)');
  near(D.airy(3.8317), 0, 1e-6, 'first dark ring'); near(D.airy(5.1356), 0.0175, 2e-2, 'first bright ring is 1.75 % of the peak');
  near(D.encircled(3.8317), 0.838, 2e-3, '84 % of the light is in the Airy disc');
  near(D.airyRadius(550, 8) * 1e6, 5.37, 2e-3, 'Airy radius at f/8 is 5.4 µm');
  near(D.rayleighAngle(550, 0.1) * 206265, 1.384, 2e-3, 'a 100 mm telescope resolves 1.4″');
  near(D.singleSlit(1e-4, 500, Math.asin(500e-9 / 1e-4)), 0, 1e-12, 'single slit: first minimum at sin θ = λ/a');
  near(D.doubleSlit(1e-5, 1e-4, 500, Math.asin(250e-9 / 1e-4)), 0, 1e-12, 'double slit: dark at half a wavelength path difference');
  near(D.nSlits(5, 0, 1e-5, 500, Math.asin(500e-9 / 1e-5)), 1, 1e-9, 'grating: principal maximum');
  near(deg(D.grating({ linesPerMm: 600, nm: 532, m: 1 })), 18.61, 1e-3, '600 lines/mm sends green to 18.6°');
  ok(Number.isNaN(D.grating({ linesPerMm: 1800, nm: 650, m: 1 })), 'no first order when λ > d');
  ok(D.gratingOrders({ linesPerMm: 300, nm: 633 }).length === 11, '300 lines/mm, 633 nm: orders −5 … 5');
  ok(D.resolvingPower(1, 1000) === 1000, 'resolving power m N');
  near(deg(D.littrow({ linesPerMm: 1200, nm: 500 })), 17.458, 1e-3, 'Littrow angle');
  near(D.knifeEdge(0), 0.25, 1e-2, 'at the geometric edge the intensity is one quarter'); near(D.knifeEdge(1.2172), 1.37, 2e-2, 'the first fringe overshoots to 1.37'); { let s = 0, n = 0; for (let u = 5; u <= 9; u += 0.01) { s += D.knifeEdge(u); n++; } near(s / n, 1, 1e-2, 'far into the light the fringes average to 1'); }
  near(D.coherenceLength(632.8, 0.002), 0.2002, 1e-3, 'coherence length λ²/Δλ');
  near(D.fringeSpacing(600, 0.5e-3, 1) * 1e3, 1.2, 1e-9, 'Young\'s fringes');
  const M = O.mtf;
  near(M.cutoff(550, 8), 227.3, 1e-3, 'cut-off 1/(λN)'); near(M.diffraction(0, 550, 8), 1, 1e-12, 'MTF(0) = 1'); near(M.diffraction(M.cutoff(550, 8) / 2, 550, 8), 0.391, 2e-3, 'half the cut-off: 39 %'); ok(M.diffraction(300, 550, 8) === 0, 'nothing beyond the cut-off');
  near(M.nyquist(5), 100, 1e-12, 'Nyquist of 5 µm pixels'); near(M.pixel(100, 5), 2 / Math.PI, 1e-9, 'pixel MTF at Nyquist is 2/π'); near(M.pixel(200, 5), 0, 1e-9, 'and zero at the sampling frequency');
  near(M.usaf(2, 3), 5.04, 2e-3, 'USAF group 2, element 3');
  near(M.mtf50(nu => M.diffraction(nu, 550, 8), 227), 0.404 * 227.27, 1e-2, 'MTF50 of a perfect lens');
}

/* ---------------------------------------------------------------- beams, lasers, polarisation */
{
  const B = O.beam;
  near(B.rayleigh(1e-3, 632.8), 4.965, 1e-3, 'Rayleigh range of a 1 mm waist'); near(B.w(4.965, 1e-3, 632.8), Math.SQRT2 * 1e-3, 1e-3, '√2 w0 at the Rayleigh range');
  near(B.divergence(1e-3, 632.8) * 1e3, 0.2014, 1e-3, 'divergence λ/πw0'); near(B.divergence(1e-3, 632.8, 2), 2 * B.divergence(1e-3, 632.8), 1e-12, 'M² doubles it');
  near(B.focus({ w: 2e-3, f: 0.1, nm: 1064 }).w0 * 1e6, 16.93, 1e-3, 'focused spot λf/πw');
  const l = B.lens({ w0: 1e-3, s: 0.1, f: 0.1, nm: 632.8 }); near(l.s, 0.1, 1e-12, 'waist at the front focus → waist at the back focus'); near(l.w0, 632.8e-9 * 0.1 / (Math.PI * 1e-3), 1e-9, 'and w0′ = λf/πw0');
  const t = B.train({ w0: 1e-3, z0: 0, nm: 632.8 }, [{ z: 0.1, f: 0.1 }]);
  near(t.segments[1].waistZ, 0.2, 1e-9, 'beam train agrees with Self\'s formula (position)'); near(t.segments[1].w0, l.w0, 1e-9, 'and waist'); near(t.w(0), 1e-3, 1e-12, 'w at the first waist');
  // a telescope of 50 and 200 mm expands a collimated beam four times
  const ex = B.train({ w0: 1e-3, z0: 0, nm: 632.8 }, [{ z: 0.05, f: 0.05 }, { z: 0.30, f: 0.2 }]); near(ex.segments[2].w0, 4e-3, 2e-3, 'a 4× beam expander');
  near(B.throughAperture(1, 1), 0.8647, 1e-4, '86.5 % of the power within the 1/e² radius');
  const Ls = O.laser;
  ok(Ls.stable(Ls.g(0.3, Infinity), Ls.g(0.3, 0.5)) && !Ls.stable(Ls.g(0.6, Infinity), Ls.g(0.6, 0.5)), 'plano-concave cavity is stable only while L < R');
  near(Ls.modeSpacing(0.3) / 1e6, 499.65, 1e-4, 'mode spacing c/2L of a 30 cm cavity');
  const cw = Ls.cavityWaist(0.3, Infinity, 0.5, 632.8); near(cw.w0 * 1e3, Math.sqrt(632.8e-9 / Math.PI * Math.sqrt(0.3 * 0.2)) * 1e3, 1e-6, 'half-symmetric cavity waist'); near(cw.z1, 0, 1e-12, 'on the flat mirror');
  { const cf = Ls.cavityWaist(0.5, 0.5, 0.5, 632.8), nearCf = Ls.cavityWaist(0.5, 0.5005, 0.5005, 632.8); near(cf.w0, Math.sqrt(632.8e-9 * 0.5 / (2 * Math.PI)), 1e-9, 'confocal cavity waist √(λL/2π)'); near(cf.w0, nearCf.w0, 2e-3, 'and it joins the general formula smoothly'); near(cf.z1, 0.25, 1e-12, 'at the centre'); }
  near(Ls.mpe(0.25).E * 38.48e-6 * 1e3, 0.98, 2e-2, 'the 0.25 s MPE through a 7 mm pupil is about 1 mW: the class 2 limit');
  ok(Ls.classOf(0.0008) === '2' && Ls.classOf(0.003) === '3R' && Ls.classOf(0.1) === '3B' && Ls.classOf(5) === '4' && Ls.classOf(0.0002) === '1', 'classes of visible continuous lasers');
  near(Ls.od(1, 1e-3), 3, 1e-12, 'OD 3 brings 1 W down to 1 mW');
  ok(O.LASERS.length >= 18 && O.laserById('hene').nm[0] === 632.8 && O.laserById('ndyag').nm.includes(532), 'laser table');
  const P = O.pol;
  near(P.intensity(P.chain(P.vec('H'), [P.polarizer(rad(30))])), Math.pow(Math.cos(rad(30)), 2), 1e-12, 'Malus\'s law');
  near(P.intensity(P.chain(P.vec('H'), [P.polarizer(rad(90))])), 0, 1e-12, 'crossed polarisers');
  near(P.intensity(P.chain(P.vec('H'), [P.polarizer(rad(45)), P.polarizer(rad(90))])), 0.25, 1e-12, 'a third polariser between crossed ones lets a quarter through');
  near(P.stokes(P.vec('R'))[3], 1, 1e-12, 'right-circular has S3 = +1'); near(P.stokes(P.vec('L'))[3], -1, 1e-12, 'left-circular −1');
  const circ = P.ellipse(P.apply(P.qwp(rad(45)), P.vec('H'))); near(Math.abs(circ.ellipticity), Math.PI / 4, 1e-9, 'a quarter-wave plate at 45° makes circular light');
  const rot = P.stokes(P.apply(P.hwp(rad(22.5)), P.vec('H'))); near(rot[2], 1, 1e-9, 'a half-wave plate at 22.5° turns H into +45°');
  near(P.stokes(P.apply(P.rotator(rad(45)), P.vec('H')))[2], 1, 1e-9, 'a 45° rotator does the same');
  // Jones and Mueller agree
  for (const [v, d, th] of [['D', Math.PI / 2, 0], ['H', Math.PI / 2, rad(45)], ['H', 1.1, rad(20)], ['R', Math.PI, rad(70)]]) {
    const a = P.stokes(P.apply(P.retarder(d, th), P.vec(v))), b = P.mueller.apply(P.mueller.retarder(d, th), P.stokes(P.vec(v)));
    ok(a.every((x, i) => Math.abs(x - b[i]) < 1e-9), 'Jones and Mueller retarders agree for ' + v + ' ' + d.toFixed(2) + ' ' + th.toFixed(2));
  }
  const mp = P.mueller.apply(P.mueller.polarizer(rad(30)), [1, 0, 0, 0]); near(mp[0], 0.5, 1e-12, 'a polariser passes half of unpolarised light'); near(P.dop(mp), 1, 1e-12, 'and polarises it completely');
  near(P.byReflection(1, 1.5, O.brewster(1, 1.5)), 1, 1e-9, 'reflection at Brewster\'s angle is fully polarised');
  near(P.waveplateThickness(0.25, 0.0091, 550) * 1e6, 15.1, 1e-2, 'a zero-order quartz quarter-wave plate is 15 µm thick');
}

/* ---------------------------------------------------------------- colour, light */
{
  const Cl = O.colour, Ph = O.photo;
  near(Ph.V(555), 1, 1.5e-2, 'V(555) = 1'); near(Ph.V(510), 0.503, 5e-2, 'V(510) ≈ 0.50'); near(Ph.V(610), 0.503, 5e-2, 'V(610) ≈ 0.50'); ok(Ph.V(400) < 0.005 && Ph.V(720) < 0.005, 'the ends of the visible');
  near(Ph.Vscotopic(507), 0.99, 2e-2, 'night vision peaks near 507 nm');
  const ee = Cl.xy(Cl.xyz(() => 1)); abs(ee[0], 0.3333, 0.006, 'equal-energy white x'); abs(ee[1], 0.3333, 0.006, 'equal-energy white y');
  const g = Cl.xy(Cl.cmf(550)); abs(g[0], 0.3016, 0.012, '550 nm: x'); abs(g[1], 0.6923, 0.012, '550 nm: y');
  const r = Cl.xy(Cl.cmf(620)); abs(r[0], 0.6915, 0.012, '620 nm: x'); abs(r[1], 0.3083, 0.012, '620 nm: y');
  // the spectral locus is right to its ends (the standard observer's table, not a fit)
  for (const [nm, x, y] of [[400, 0.1733, 0.0048], [460, 0.1440, 0.0297], [480, 0.0913, 0.1327], [500, 0.0082, 0.5384], [520, 0.0743, 0.8338], [580, 0.5125, 0.4866], [600, 0.6270, 0.3725], [660, 0.7300, 0.2700], [700, 0.7347, 0.2653]]) {
    const p = Cl.locus(nm); abs(p[0], x, 0.002, 'spectral locus x at ' + nm + ' nm'); abs(p[1], y, 0.002, 'spectral locus y at ' + nm + ' nm');
  }
  near(Cl.cmf(555)[1], 1, 2e-3, 'ȳ(555) = 1'); ok(Cl.cmf(370).every(v => v === 0) && Cl.cmf(800).every(v => v === 0), 'no response outside 380–780 nm');
  for (const T of [2000, 3000, 5000, 6500, 10000]) { const xy = Cl.planckXY(T), c = Cl.cctDuv(xy[0], xy[1]); near(c.cct, T, 0.01, 'cctDuv finds a ' + T + ' K black body'); ok(Math.abs(c.duv) < 5e-4 && c.white, 'on the curve, a white'); }
  ok(!Cl.cctDuv(0.148, 0.766).white && !Cl.cctDuv(0.711, 0.289).white, 'a green LED and a red laser are not whites');
  ok(Cl.cctDuv(0.3127, 0.3290).white && Math.abs(Cl.cctDuv(0.3127, 0.3290).cct - 6504) < 120 && Cl.cctDuv(0.3127, 0.3290).duv > 0, 'D65 is a white of about 6500 K, slightly on the green side of the curve');
  for (const T of [2700, 4000, 6500]) { const xy = Cl.planckXY(T); near(Cl.cct(xy[0], xy[1]), T, 0.02, 'CCT of a ' + T + ' K black body'); }
  const d65 = Cl.planckXY(6500); abs(d65[0], 0.3135, 0.004, 'black body 6500 K: x'); abs(d65[1], 0.3237, 0.004, 'y');
  const w = Cl.srgb(Cl.toRgb(Cl.white)); ok(w.every(v => v >= 254), 'D65 is display white');
  ok(Cl.wavelength(650)[0] > 200 && Cl.wavelength(650)[2] < 60, '650 nm is red'); ok(Cl.wavelength(532)[1] > 200 && Cl.wavelength(532)[0] < 120, '532 nm is green'); ok(Cl.wavelength(460)[2] > 200, '460 nm is blue');
  ok(Cl.wavelength(580)[0] > 200 && Cl.wavelength(580)[1] > 150 && Cl.wavelength(580)[2] < 80, '580 nm is yellow');
  const lab = Cl.lab(Cl.white); near(lab[0], 100, 1e-9, 'white is L* = 100'); abs(lab[1], 0, 1e-9, 'a* = 0'); abs(lab[2], 0, 1e-9, 'b* = 0');
  const back = Cl.fromLab(Cl.lab([0.3, 0.4, 0.2])); ok(Math.abs(back[0] - 0.3) < 1e-9 && Math.abs(back[1] - 0.4) < 1e-9 && Math.abs(back[2] - 0.2) < 1e-9, 'Lab round trip');
  near(Cl.labOfRgb([255, 0, 0])[0], 53.24, 1e-2, 'sRGB red has L* = 53');
  near(Cl.munsellValueY(5), 0.1927, 2e-3, 'Munsell value 5 reflects 19.3 %'); near(Cl.munsellValueY(10), 1, 1e-3, 'value 10 is the perfect white');
  const m5r = Cl.munsell(5, 5, 10).rgb; ok(m5r[0] > m5r[1] + 60 && m5r[0] > m5r[2] + 60, '5R 5/10 is red (' + m5r + ')');
  const m5g = Cl.munsell(45, 5, 8).rgb; ok(m5g[1] > m5g[0] + 30, '5G 5/8 is green (' + m5g + ')');
  const m5b = Cl.munsell(65, 5, 6).rgb; ok(m5b[2] > m5b[0] + 30, '5B 5/6 is blue (' + m5b + ')');
  const m5y = Cl.munsell(25, 8, 10).rgb; ok(m5y[0] > 180 && m5y[1] > 160 && m5y[2] < 110, '5Y 8/10 is yellow (' + m5y + ')');
  ok(Cl.munsell(5, 5, 0).rgb.every((v, i, a) => Math.abs(v - a[0]) <= 1), 'chroma 0 is grey'); ok(!Cl.munsell(45, 5, 30).inGamut, 'a chroma beyond the display is flagged');
  const mp = Cl.munsellParse('2.5YR 6/8'); ok(mp && mp.h === 12.5 && mp.V === 6 && mp.C === 8, 'parse 2.5YR 6/8'); ok(Cl.munsellParse('N 5/').C === 0, 'parse a neutral');
  ok(Cl.munsellName(12.5, 6, 8) === '2.5YR 6/8' && Cl.munsellName(10, 5, 4) === '10R 5/4', 'Munsell notation written back (' + Cl.munsellName(12.5, 6, 8) + ', ' + Cl.munsellName(10, 5, 4) + ')');
  // colour-vision deficiency: a protanope confuses red and green of the right lightness; white stays white
  ok(Cl.cvd([255, 255, 255], 'protan').every(v => v >= 254), 'white is unchanged'); const pr = Cl.cvd([255, 0, 0], 'protan'), dg = Cl.cvd([0, 160, 0], 'deutan');
  ok(Math.abs(pr[0] - pr[1]) < 80, 'red loses its redness for a protanope (' + pr + ')'); ok(Math.abs(dg[0] - dg[1]) < 80, 'green its greenness for a deuteranope (' + dg + ')');
  ok(Cl.cvd([200, 30, 40], 'protan', 0).join() === '200,30,40', 'severity 0 changes nothing');
  ok(Cl.mix([[255, 0, 0], [0, 255, 0]]).join() === '255,255,0', 'red + green light = yellow');
  // light
  near(Ph.wien(5800), 499.6, 1e-3, 'the Sun peaks near 500 nm'); near(Ph.efficacy(555), 683, 1.5e-2, '683 lm/W at 555 nm');
  const lerInc = Ph.ler(Ph.spectrum('incandescent'), 250, 20000); ok(lerInc > 9 && lerInc < 17, 'a 2700 K filament gives about 12 lm per radiated watt (' + lerInc.toFixed(1) + ')');
  const lerLed = Ph.ler(Ph.spectrum('led-neutral')); ok(lerLed > 280 && lerLed < 380, 'a white LED spectrum gives about 300–350 lm per optical watt (' + lerLed.toFixed(0) + ')');
  for (const [id, lo, hi] of [['led-warm', 2500, 3300], ['led-neutral', 3600, 4600], ['led-cool', 5600, 7600], ['incandescent', 2600, 2800], ['daylight', 6300, 6700], ['fluorescent', 3300, 4800], ['cfl', 2400, 3300], ['sodium-hp', 1800, 2400]]) {
    const xy = Cl.xy(Cl.xyz(Ph.spectrum(id))), T = Cl.cct(xy[0], xy[1]); ok(T > lo && T < hi, id + ' has a colour temperature of ' + Math.round(T) + ' K (want ' + lo + '–' + hi + ')');
  }
  for (const id of Object.keys(Ph.SOURCES)) { const f = Ph.spectrum(id); let good = true; for (let nm = 300; nm <= 1000; nm += 7) if (!(f(nm) >= 0) || !Number.isFinite(f(nm))) good = false; ok(good, 'spectrum ' + id + ' is finite and non-negative'); }
  ok(O.LAMPS.every(l => Ph.SOURCES[l.spectrum] && l.efficacy[0] <= l.efficacy[1] && l.life[0] <= l.life[1]), 'lamp table is consistent');
  near(Ph.illuminance(100, 2, 0), 25, 1e-12, 'inverse square: 100 cd at 2 m gives 25 lx'); near(Ph.solidAngle(Math.PI / 2), 2 * Math.PI, 1e-12, 'a hemisphere is 2π sr');
  near(Ph.imageIlluminance(1000, 8), Math.PI * 1000 / 256, 1e-12, 'sensor illuminance πL/4N²');
  near(O.od(0.01), 2, 1e-12, 'OD 2 is 1 %'); near(O.transmittance(0.3), 0.501, 1e-3, 'OD 0.3 halves the light');
}

/* ---------------------------------------------------------------- cameras, eye, scanning, fibres */
{
  const Cm = O.cam;
  near(Cm.sensor('Full frame').diag, 43.27, 1e-3, 'full-frame diagonal'); near(Cm.sensor('APS-C').crop, 1.526, 2e-3, 'APS-C crop factor'); near(Cm.sensor('1/2"').diag, 8.0, 1e-9, 'a 1/2" sensor is 8 mm across');
  near(Cm.sensor('2/3"').diag, 11.0, 1e-9, '2/3" is 11 mm'); near(Cm.sensor('1"').diag, 16.0, 1e-9, '1" is 16 mm');
  near(Cm.mount('C').ffd - Cm.mount('CS').ffd, 5, 1e-9, 'C and CS differ by 5 mm'); near(Cm.mount('C').ffd, 17.526, 1e-9, 'C-mount flange distance'); near(Cm.mount('F').ffd, 46.5, 1e-9, 'F-mount flange distance');
  ok(Cm.adapter('C', 'CS').ok && Math.abs(Cm.adapter('C', 'CS').ring - 5) < 1e-9 && !Cm.adapter('CS', 'C').ok, 'a C lens fits a CS camera with a 5 mm ring; not the reverse');
  ok(Cm.adapter('F', 'E').ok && !Cm.adapter('E', 'F').ok, 'an SLR lens adapts to a mirrorless body; not the reverse');
  near(deg(Cm.fov({ f: 50, sensor: 'Full frame' }).d), 46.79, 1e-3, 'a 50 mm lens on full frame sees 46.8° on the diagonal'); near(deg(Cm.fov({ f: 50, sensor: 'Full frame' }).h), 39.6, 1e-3, 'and 39.6° across');
  const fv = Cm.fov({ f: 25, sensor: '2/3"', distance: 500 }); near(fv.W, 8.8 / (25 / 475), 1e-9, 'scene width at 500 mm');
  near(Cm.focalFor(8.8, 167.2, 500), 25, 1e-9, 'the focal length for a field of view');
  near(Cm.hyperfocal(50, 8, 0.03), 10466.7, 1e-4, 'hyperfocal distance'); const d = Cm.dof({ f: 50, N: 8, s: 3000, c: 0.03 }); near(d.near, 2337.4, 1e-3, 'near limit'); near(d.far, 4185.3, 1e-4, 'far limit');
  ok(!Number.isFinite(Cm.dof({ f: 50, N: 8, s: 12000, c: 0.03 }).far), 'beyond the hyperfocal distance the far limit is infinity');
  near(Cm.ev(16, 1 / 100), 14.64, 1e-3, 'sunny 16 is EV 14.6'); near(Cm.exposureTime(8, 12), 1 / 64, 1e-9, 'time from EV'); near(Cm.workingFNumber(4, 1), 8, 1e-12, 'at 1:1 an f/4 lens works at f/8');
  const ph = Cm.photons({ lux: 1, t: 1, pitch: 1 }); near(ph, 4093, 2e-2, 'one lux of green light is about 4100 photons per µm² per second');
  const sn = Cm.snr({ photons: 10000, qe: 0.6, read: 3 }); near(sn.snr, 6000 / Math.sqrt(6009), 1e-9, 'shot-noise-limited SNR'); near(Cm.dynamicRange(20000, 2.5).db, 78.06, 1e-3, 'dynamic range in dB'); near(Cm.dynamicRange(20000, 2.5).stops, 12.97, 1e-3, 'and in stops');
  near(Cm.motionBlur(1000, 1e-4, 0.1, 5), 2, 1e-12, 'motion blur in pixels'); near(Cm.cos4(rad(30)), 0.5625, 1e-9, 'cos⁴ fall-off at 30°');
  ok(Cm.digitalZoom(4000, 3000, 2, 24).megapixels === 3 && Cm.digitalZoom(4000, 3000, 2, 24).fEquivalent === 48, '2× digital zoom keeps a quarter of the pixels');
  const rs = Cm.resample([0, 10], 4, 'linear'); ok(rs.length === 4 && rs[0] === 0 && rs[3] === 10 && rs[1] > 0 && rs[1] < rs[2], 'resampling interpolates'); ok(Cm.resample([0, 10], 4, 'nearest').join() === '0,0,10,10', 'nearest neighbour repeats pixels');
  const E = O.eye;
  near(E.accommodation(40).avg, 6.5, 1e-12, 'Hofstetter: 6.5 D at forty'); near(E.nearPoint(0, 2.5), 0.4, 1e-12, 'near point with 2.5 D left'); near(E.farPoint(-2), 0.5, 1e-12, 'a −2 D myope sees clearly to half a metre');
  near(E.vertex(-8, 0.012, 0), -7.30, 1e-3, '−8 D glasses at 12 mm = −7.3 D contact lens'); near(E.vertex(8, 0.012, 0), 8.85, 1e-3, '+8 D glasses = +8.85 D contact lens');
  const tp = E.transpose({ sph: -2, cyl: -1.5, axis: 90 }); ok(tp.sph === -3.5 && tp.cyl === 1.5 && tp.axis === 180, 'transposition'); ok(E.transpose({ sph: 1, cyl: 0.5, axis: 10 }).axis === 100, 'axis turns by 90°');
  near(E.sphericalEquivalent({ sph: -2, cyl: -1.5 }), -2.75, 1e-12, 'spherical equivalent'); near(E.meridian({ sph: -2, cyl: -1.5, axis: 90 }, 180), -3.5, 1e-9, 'power across the axis'); near(E.meridian({ sph: -2, cyl: -1.5, axis: 90 }, 90), -2, 1e-9, 'power along the axis');
  near(E.prentice(4, 0.5), 2, 1e-12, 'Prentice\'s rule'); near(E.letterHeight(6, 20) * 1e3, 8.73, 1e-3, 'a 6/6 letter at 6 m is 8.7 mm tall'); near(E.logmar(40), 0.301, 1e-3, '20/40 is logMAR 0.3');
  ok(E.pupil(100) > 2.3 && E.pupil(100) < 3.3 && E.pupil(0.01) > 5.2 && E.pupil(0.01) < 6.6, 'pupil: about 2.8 mm in an office, 6 mm at dusk (' + E.pupil(100).toFixed(2) + ', ' + E.pupil(0.01).toFixed(2) + ')');
  let peak = 0, at = 0; for (let f = 0.5; f < 40; f += 0.25) if (E.csf(f) > peak) { peak = E.csf(f); at = f; } ok(at > 6 && at < 10 && Math.abs(peak - 1) < 0.01, 'contrast sensitivity peaks near 8 cycles per degree (' + at + ')');
  near(E.diffractionLimitCpd(3, 555), 94.3, 1e-2, 'a 3 mm pupil cuts off at 94 cycles per degree');
  const pal = E.pal(0, -20, { add: 2 }); near(pal.add, 2, 1e-9, 'full addition at the near zone'); ok(E.pal(0, 5, { add: 2 }).add === 0 && E.pal(0, 5, { add: 2 }).cyl === 0, 'distance zone is clear'); ok(E.pal(8, -9, { add: 2 }).cyl > E.pal(2, -9, { add: 2 }).cyl, 'astigmatism grows away from the corridor');
  const Sc = O.scan;
  near(deg(Sc.polygon({ facets: 8, rpm: 30000 }).scanAngle), 90, 1e-9, 'an octagon scans 90° per facet'); near(Sc.polygon({ facets: 8, rpm: 30000 }).lineRate, 4000, 1e-9, 'and 4000 lines a second at 30 000 rpm');
  near(Sc.resolvableSpots(rad(40), 10e-3, 633), 8684, 2e-3, 'resolvable spots θD/1.27λ'); near(Sc.tof(66.7e-9), 10, 1e-3, '66.7 ns there and back is 10 m'); near(Sc.tofResolution(1e-9), 0.15, 1e-3, '1 ns is 15 cm');
  near(Sc.triangulation({ z: 0.5, p: 5e-6, f: 0.025, b: 0.1 }).dz * 1e3, 0.5, 1e-9, 'triangulation depth resolution z²p/fb'); near(Sc.dpiPitch(600) * 1e6, 42.33, 1e-3, '600 dpi is 42 µm');
  const ao = Sc.aod({ df: 50e6, v: 650, D: 5e-3, nm: 633 }); near(ao.spots, 384.6, 1e-3, 'AOD: time–bandwidth product'); near(ao.angle * 1e3, 48.7, 1e-2, 'AOD scan angle');
  const Sh = O.shape;
  const ax = Sh.axicon({ alpha: rad(5), n: 1.5, w: 5e-3, nm: 633 }); near(deg(ax.beta), 2.52, 1e-2, 'axicon deflection ≈ (n − 1)α'); ok(ax.zmax > 0.1 && ax.zmax < 0.13, 'Bessel zone about 11 cm'); ok(ax.core > 3e-6 && ax.core < 8e-6, 'core radius a few µm');
  near(Sh.maxConcentration(rad(0.267), 1), 46050, 5e-3, 'sunlight can be concentrated 46 000 times in air'); near(Sh.homogenizer(0.3e-3, 5e-3, 0.1), 6e-3, 1e-12, 'homogeniser flat-top size');
  const cp = Sh.cpc(1, rad(30)); near(cp[cp.length - 1][0], 1, 1e-9, 'CPC ends at the exit rim'); near(cp[cp.length - 1][1], 0, 1e-9, 'on the exit plane'); near(cp[0][0], 2, 1e-9, 'entrance half-width a/sin θ'); near(cp[0][1], Sh.cpcLength(1, rad(30)), 1e-9, 'CPC length');
  near(deg(Sh.fanAngle(10, 10)), 53.13, 1e-3, 'fan angle of a cylinder lens'); ok(Sh.lineProfile(0.9, 'powell') > 0.8 && Sh.lineProfile(0.9, 'gaussian') < 0.1, 'a Powell lens keeps the ends of the line bright');
  near(deg(Sh.doeAngle(1, 10e-6, 650)), 3.727, 1e-3, 'DOE first order'); ok(Sh.expander(-25, 100).m === 4 && Sh.expander(-25, 100).length === 75 && Sh.expander(-25, 100).kind === 'Galilean', 'Galilean expander');
  const Fb = O.fibre;
  near(Fb.na(1.4682, 1.4629), 0.1246, 2e-3, 'NA of single-mode fibre'); near(deg(Fb.acceptance(0.22)), 12.71, 1e-3, 'acceptance half-angle of NA 0.22');
  near(Fb.V(4.1e-6, 1550, 0.125), 2.078, 2e-3, 'V number'); ok(Fb.modes(2.0) === 1 && Fb.modes(30) === 450, 'mode counts'); near(Fb.cutoff(4.1e-6, 0.125), 1339, 2e-3, 'cut-off wavelength');
  near(Fb.mfd(4.1e-6, 2.078) * 1e6, 10.05, 2e-2, 'mode-field diameter about 10 µm'); near(Fb.loss(0.2, 50), 0.1, 1e-9, '50 km at 0.2 dB/km leaves 10 %'); near(Fb.fresnelLossDb(1.468), 0.159, 1e-2, 'a fibre end face loses 0.16 dB');
  ok(Fb.CONNECTORS.find(c => c.id === 'LC').ferrule === 1.25 && Fb.CONNECTORS.find(c => c.id === 'SC').ferrule === 2.5, 'ferrule diameters');
}

/* ---------------------------------------------------------------- the drawing kit runs on a recording context */
{
  const S = H.osym; let calls = 0, badNum = 0;
  const ctx = new Proxy({ canvas: {}, measureText: s => ({ width: String(s).length * 7 }) }, { get(t, k) { if (k in t) return t[k]; return function () { calls++; for (const a of arguments) if (typeof a === 'number' && !Number.isFinite(a)) badNum++; }; }, set(t, k, v) { t[k] = v; return true; } });
  const st = { W: 760, H: 420 };
  for (const id of Object.keys(O.LENSES)) {
    const sys = O.lens(id), par = O.sys.paraxial(sys), zs = par.zs;
    const zMin = Math.min(-10, ...zs), zMax = Math.max(Number.isFinite(par.zImage) ? par.zImage : 100, ...zs), yH = Math.max(...sys.surfaces.map(s => s.sd || 5)) * 1.3;
    const m = S.map(st, zMin, zMax, yH);
    S.system(ctx, sys, m); S.rays(ctx, O.sys.fan2d(sys, { n: 5 }), m, { nm: 550 });
  }
  S.axis(ctx, 0, 100, 500); S.ray(ctx, [[0, 0], [100, 50], [300, 60]], { nm: 532 }); S.virtual(ctx, 0, 0, 50, 50); S.normal(ctx, 10, 10, 0.3); S.angle(ctx, 100, 100, 30, 0, 1, 'θ'); S.dim(ctx, 0, 0, 100, 0, 'f');
  S.lens(ctx, 100, 200, 60, { f: 100 }); S.lens(ctx, 100, 200, 60, { f: -100 }); S.lens(ctx, 100, 200, 60, { R1: 120, R2: 0, t: 14 }); S.thinLens(ctx, 200, 200, 60, 50, { foci: 50 }); S.thinLens(ctx, 200, 200, 60, -50);
  S.mirror(ctx, 300, 200, 60, { R: -200 }); S.flatMirror(ctx, 0, 0, 100, 100); S.stop(ctx, 100, 200, 60, 20); S.screen(ctx, 500, 200, 60); S.sensor(ctx, 500, 200, 40); S.object(ctx, 50, 200, 40); S.object(ctx, 50, 200, -40, { dash: true });
  S.eye(ctx, 600, 200, 40); for (const kind of ['point', 'bulb', 'led', 'laser', 'sun', 'candle']) S.source(ctx, 30, 30, { kind });
  S.prism(ctx, 300, 200, 100, Math.PI / 3); S.block(ctx, 0, 0, 100, 40); S.splitter(ctx, 300, 200, 60); S.plate(ctx, 300, 200, 80, 0.5); S.polarizer(ctx, 300, 200, 40, 0.4); S.grating(ctx, 300, 200, 50); S.slits(ctx, 300, 200, 80, [[190, 195], [205, 210]]);
  S.fibre(ctx, [[0, 0], [100, 20], [200, 0]]); S.beam(ctx, 0, 300, 200, x => 5 + x / 30, { nm: 633 }); S.wave(ctx, 0, 0, 300, 100, { nm: 500 }); S.wavefronts(ctx, 100, 100, 10, 12, 6, -0.5, 0.5); S.wavefronts(ctx, 0, 0, 10, 12, 4, 0, 0, { plane: { x: 0, y: 100, dir: 0, width: 80 } });
  S.spectrum(ctx, 0, 0, 400, 20, 380, 780, { ticks: true }); S.fringes(ctx, 0, 0, 300, 40, u => Math.pow(Math.cos(20 * u), 2), { nm: 633 }); S.cells(ctx, 0, 0, 100, 100, 10, 10, (u, v) => u * v); S.cells(ctx, 0, 0, 100, 100, 4, 4, (u, v) => [255 * u, 255 * v, 0]);
  S.spot(ctx, O.sys.spot(O.lens('biconvex')), 100, 100, 50, 2000, { airy: 0.003 });
  ok(calls > 500 && badNum === 0, 'the drawing kit draws every symbol and every library lens with finite numbers (' + calls + ' calls, ' + badNum + ' bad)');
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
