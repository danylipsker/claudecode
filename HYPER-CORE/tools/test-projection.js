/* Tests of HYPER-CORE/js/projection.js (kit.proj). Run: node HYPER-CORE/tools/test-projection.js */
'use strict';
const L = require('./load.js');
const H = L.loadCore(), P = H.proj, M = P.mat4;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');
const D = Math.PI / 180;

// matrices
const R = M.chain(M.translate(1, 2, 3), M.rotX(0.3), M.rotY(0.5), M.scale(2, 1, 0.5));
ok(M.equal(M.mul(R, M.inverse(R)), M.identity(), 1e-9), 'inverse of a chain');
near(M.det(M.rotY(0.5)), 1, 1e-12, 'a rotation has determinant 1');
ok(M.inverse(P.perspective(2)) === null, 'the textbook perspective matrix is singular (it drops a dimension)');
const p = M.point(M.rotZ(Math.PI / 2), [1, 0, 0]); near(p[0], 0, 1e-12, 'rotZ 90° x->0'); near(p[1], 1, 1e-12, 'rotZ 90° x->y');
ok(/begin\{bmatrix\}/.test(M.toTex(M.identity())) && M.toTex(M.identity()).split('&').length === 13, 'toTex writes a 4×4 bmatrix');

// views and axonometrics
const iso = P.axonAxes(P.isometric());
near(iso.x.scale, 0.8165, 1e-3, 'isometric foreshortening'); near(iso.x.angle / D, -30, 1e-6, 'isometric x axis at −30°'); near(iso.z.angle / D, -150, 1e-6, 'isometric z axis at 210°'); near(iso.y.angle / D, 90, 1e-9, 'isometric y vertical');
const dim = P.axonAxes(P.dimetric());
near(dim.z.scale, 0.4714, 1e-3, 'dimetric z half'); near(dim.x.angle / D, -7.18, 0.05, 'dimetric x axis at 7°10′'); near(180 + dim.z.angle / D, 41.41, 0.05, 'dimetric z axis at 41°25′');
const fs = P.axonFromScales(0.9428, 0.9428, 0.4714); near(fs.alpha / D, 19.47, 0.05, 'axonFromScales recovers α'); near(fs.beta / D, 20.70, 0.05, 'axonFromScales recovers β');
const top = M.point(P.view('top'), [0, 1, 0]); near(top[2], 1, 1e-12, 'top view: +y faces the viewer');
const right = M.point(P.view('right'), [1, 0, 0]); near(right[2], 1, 1e-12, 'right view: +x faces the viewer');
const cav = M.point(P.cavalier(), [0, 0, -1]); near(cav[0], Math.SQRT1_2, 1e-9, 'cavalier: depth 1 recedes 0.707 right'); near(cav[1], Math.SQRT1_2, 1e-9, 'cavalier: and 0.707 up');
const cab = M.point(P.cabinet(), [0, 0, -1]); near(cab[0], Math.SQRT1_2 / 2, 1e-9, 'cabinet: half depth');
ok(P.layout('first').top[1] === -1 && P.layout('third').top[1] === 1, 'first angle puts the top view below, third angle above');

// perspective and vanishing points
const V1 = M.chain(P.perspective(1), M.translate(0, 0, -5));
ok(P.perspectiveKind(V1).n === 1 && P.vanishing(V1, [1, 0, 0]) === null, 'facing the box squarely: one vanishing point');
const V2 = M.chain(P.perspective(1), M.translate(0, 0, -5), M.rotY(0.5));
const k2 = P.perspectiveKind(V2); ok(k2.n === 2, 'turned: two vanishing points'); near(k2.vps.x[1], 0, 1e-12, 'both on the horizon y = 0'); near(k2.vps.z[1], 0, 1e-12, 'both on the horizon (z)');
near(k2.vps.x[0] * k2.vps.z[0], -1, 1e-9, 'the two vanishing points of perpendicular directions: product −d²');
const V3 = M.chain(P.perspective(1), M.translate(0, 0, -5), M.rotX(0.3), M.rotY(0.5));
ok(P.perspectiveKind(V3).n === 3, 'tilted: three vanishing points');
const hz = P.vanishingLine(V3, [0, 1, 0]); near(hz[0][1], hz[1][1], 1e-9, 'the horizon is horizontal when the camera does not roll');
const q = M.point(V1, [1, 1, -1]); near(q[0], 1 / 6, 1e-12, 'perspective: x/(−z) with the eye 5 in front');
const gl = P.perspectiveGL(60 * D, 1, 0.1, 100); const ndc = M.point(gl, [0, 0, -0.1]); near(ndc[2], -1, 1e-9, 'OpenGL: the near plane maps to z = −1'); const ndf = M.point(gl, [0, 0, -100]); near(ndf[2], 1, 1e-9, 'OpenGL: the far plane maps to z = +1');
const la = P.lookAt([0, 0, 5], [0, 0, 0], [0, 1, 0]); const c0 = M.point(la, [0, 0, 0]); near(c0[2], -5, 1e-12, 'lookAt: the target is 5 in front (−z)');
near(P.focalFromFov(P.fovFromFocal(50, 36), 36), 50, 1e-9, 'focal length and field of view invert');

// curvilinear
near(P.fisheye('equidistant', [0, 1, 0], 1)[1], Math.PI / 2, 1e-12, 'equidistant fisheye: 90° up -> r = π/2');
near(P.fisheye('stereographic', [0, 0, 1], 3)[0], 0, 1e-12, 'fisheye: the axis maps to the centre');
ok(P.fisheye('orthographic', [0, 0.1, -1], 1) === null, 'orthographic fisheye sees only a hemisphere');
const cyl = P.cylindricalPersp([1, 0, 0], 1); near(cyl[0], Math.PI / 2, 1e-12, 'cylindrical: the right direction at 90°');
const er = P.equirectDir([0, 1, 0]); near(er[1], Math.PI / 2, 1e-12, 'equirectangular: up is latitude 90°');
const d = P.dirFromAngles(0.3, 0.2), aa = P.anglesFromDir(d); near(aa.az, 0.3, 1e-12, 'dirFromAngles/anglesFromDir az'); near(aa.alt, 0.2, 1e-12, '… alt');

// the sphere and geodesy
near(P.geo.distance([-0.13, 51.5], [-74, 40.7]), 5570, 10, 'London–New York great circle ≈ 5570 km');
near(P.geo.bearing([-0.13, 51.5], [-74, 40.7]), 288.3, 0.5, 'London–New York initial bearing');
ok(P.geo.rhumbDistance([-0.13, 51.5], [-74, 40.7]) > P.geo.distance([-0.13, 51.5], [-74, 40.7]), 'the rhumb line is longer than the great circle');
near(P.geo.rhumbBearing([0, 0], [10, 10]), 45, 0.5, 'rhumb bearing 45° from the origin to (10°, 10°)');
const dest = P.geo.destination([0, 0], 90, 10000); near(dest[0], 89.93, 0.2, 'destination 10 000 km east along the equator'); near(dest[1], 0, 1e-6, '… stays on the equator');
const gc = P.geo.greatCircle([0, 0], [90, 0], 2); near(gc[1][0], 45, 1e-9, 'great circle midpoint along the equator');
const rot = P.sph.rotate(0, 0.5, [0, 0.5, 0]); near(rot[1], 0, 1e-12, 'rotate: the point (0, φ0) goes to the equator');
const un = P.sph.unrotate(rot[0], rot[1], [0, 0.5, 0]); near(un[1], 0.5, 1e-12, 'unrotate inverts rotate');
near(P.geo.antipode([30, 40])[0], -150, 1e-9, 'antipode longitude'); near(P.geo.antipode([30, 40])[1], -40, 1e-9, 'antipode latitude');

// map projections: every one projects, inverts where it can, and keeps what it claims
const conformal = ['mercator', 'web-mercator', 'stereographic', 'transverse-mercator', 'lambert-conformal-conic'];
const equalArea = ['lambert-azimuthal', 'lambert-cylindrical', 'gall-peters', 'behrmann', 'albers', 'bonne', 'werner', 'sinusoidal', 'mollweide', 'hammer', 'eckert4', 'eckert6', 'equal-earth', 'goode'];
for (const def of P.maps.list()) {
  const pt = P.maps.project(def.id, 20, 35);
  ok(pt && isFinite(pt[0]) && isFinite(pt[1]), def.id + ' projects (20°, 35°)');
  const t = P.maps.tissot(def.id, 20, 35);
  ok(t && isFinite(t.h) && isFinite(t.k) && t.h > 0 && t.k > 0, def.id + ' has a finite indicatrix');
  if (conformal.includes(def.id)) { near(t.h, t.k, 1e-4 * Math.max(1, t.h), def.id + ' is conformal (h = k)'); near(t.omega, 0, 1e-3, def.id + ' has no angular distortion'); }
  if (equalArea.includes(def.id)) near(t.s, 1, 2e-3, def.id + ' is equal-area (scale factor product 1)');
  if (def.inv) { const back = P.maps.invert(def.id, pt[0], pt[1]); ok(back && Math.abs(back[0] - 20) < 1e-6 && Math.abs(back[1] - 35) < 1e-6, def.id + ' inverse round trip'); }
  const g = P.maps.graticule(def.id, {}, 30, 30);
  ok(g.length > 0 && g.every(s => s.pts.length > 1 && s.pts.every(p => isFinite(p[0]) && isFinite(p[1]))), def.id + ' graticule is finite');
  const e = P.maps.extent(def.id); ok(e.w > 0 && e.h > 0 && isFinite(e.w) && isFinite(e.h), def.id + ' has a finite extent');
}
near(P.maps.invert('robinson', ...P.maps.project('robinson', -100, -30))[0], -100, 1e-6, 'numeric inverse (Robinson) longitude');
near(P.maps.invert('winkel-tripel', ...P.maps.project('winkel-tripel', 77, 28))[1], 28, 1e-6, 'numeric inverse (Winkel) latitude');
// what the classics keep
const az = P.maps.project('azimuthal-equidistant', 0, 60); near(Math.hypot(az[0], az[1]), 60 * D, 1e-9, 'azimuthal equidistant: distance from the centre is the angle');
const gn = P.maps.project('gnomonic', 45, 0); near(gn[0], 1, 1e-9, 'gnomonic: 45° from the centre at tan 45° = 1');
const st = P.maps.project('stereographic', 90, 0); near(st[0], 2, 1e-9, 'stereographic: 90° away at 2R');
ok(P.maps.project('orthographic', 100, 0) === null, 'orthographic: nothing beyond the horizon');
near(P.maps.project('mercator', 0, 60)[1], Math.log(Math.tan(Math.PI / 4 + 30 * D)), 1e-12, 'Mercator y = ln tan(45° + φ/2)');
near(P.maps.project('sinusoidal', 60, 60)[0], 60 * D * 0.5, 1e-12, 'sinusoidal: parallels true (x = λ cos φ)');
const mw = P.maps.project('mollweide', 179.9999, 0); near(mw[0], 2 * Math.SQRT2, 1e-5, 'Mollweide: the equator is 2√2 R long on each side');
near(P.maps.project('mollweide', 180, 0)[0], -2 * Math.SQRT2, 1e-9, 'longitude 180 wraps to −180 (the same meridian)');
const mwp = P.maps.project('mollweide', 0, 90); near(mwp[1], Math.SQRT2, 1e-6, 'Mollweide: the pole at √2 R');
const tm = P.maps.project('transverse-mercator', 0, 45); near(tm[0], 0, 1e-12, 'transverse Mercator: the central meridian is straight');
const cass = P.maps.project('cassini', 0, 45); near(cass[1], 45 * D, 1e-12, 'Cassini: true along the central meridian');
const two = P.maps.project('two-point-equidistant', -74, 40.7, { A: [-74, 40.7], B: [139.7, 35.7] }); const twoB = P.maps.project('two-point-equidistant', 139.7, 35.7, { A: [-74, 40.7], B: [139.7, 35.7] });
near(Math.hypot(two[0] - twoB[0], two[1] - twoB[1]), P.sph.angDist([-74 * D, 40.7 * D], [139.7 * D, 35.7 * D]), 1e-9, 'two-point equidistant: A and B at their true distance');
const twoP = P.maps.project('two-point-equidistant', 0, 0, { A: [-74, 40.7], B: [139.7, 35.7] }); near(Math.hypot(twoP[0] - two[0], twoP[1] - two[1]), P.sph.angDist([-74 * D, 40.7 * D], [0, 0]), 1e-6, 'two-point: distance from A true everywhere');
const vp = P.maps.project('vertical-perspective', 0, 0, { P: 6.6 }); near(vp[0], 0, 1e-12, 'vertical perspective: the sub-satellite point at the centre');
ok(P.maps.project('vertical-perspective', 0, 85, { P: 6.6 }) === null, 'vertical perspective: beyond the visible cap');
const goode = P.maps.project('goode', 0, 0); near(goode[0], 0, 1e-12, 'Goode: the origin in the central lobe');
const ptol = P.maps.project('ptolemy1', 0, 36); near(ptol[0], 0, 1e-12, 'Ptolemy: the central meridian straight');
ok(P.maps.project('ptolemy1', 0, 80) === null, 'Ptolemy: the known world only');
const cube = P.maps.project('cube', 0, 0); near(cube[0], 0, 1e-9, 'cube: the face at lon 0 is centred'); const cubeN = P.maps.project('cube', 0, 89.9); ok(cubeN[1] > 1, 'cube: the north pole on the top face');
const ico = P.maps.graticule('icosahedron', {}, 30, 30); ok(ico.length > 50, 'icosahedron: the graticule is cut into many pieces');
const oct = P.maps.outline('octahedron'); ok(oct.length === 8, 'octahedron butterfly: eight faces');
// rotated aspects: transverse Mercator by rotation equals the direct formula
const rotTM = P.maps.project('mercator', 30, 20, { rotLat: 90 }), dirTM = P.maps.project('transverse-mercator', 30, 20);
near(Math.abs(rotTM[1]), Math.abs(dirTM[0]), 1e-9, 'Mercator tilted 90° is the transverse Mercator (turned on its side: x ↔ y)');
near(Math.abs(rotTM[0]), Math.abs(dirTM[1]), 1e-9, '… (|y| ↔ |x|)');
const rotBack = P.maps.invert('mercator', rotTM[0], rotTM[1], { rotLat: 90 }); near(rotBack[0], 30, 1e-6, 'the tilted aspect inverts (lon)'); near(rotBack[1], 20, 1e-6, '… (lat)');
// path breaking
const segs = P.maps.path('mercator', [[170, 10], [175, 10], [-175, 10], [-170, 10]]);
ok(segs.length === 2, 'a path crossing the antimeridian is broken in two');
const wrap = P.maps.path('mercator', [[170, 10], [175, 10], [-175, 10], [-170, 10]], { lon0: 180 });
ok(wrap.length === 1, '… and is whole when the map is centred there');

// models
const cubeM = P.models.cube(1); ok(cubeM.pts.length === 8 && cubeM.edges.length === 12 && cubeM.faces.length === 6, 'cube: 8 vertices, 12 edges, 6 faces');
ok(P.visibleFaces(P.isometric(), cubeM).length === 3, 'isometric: three faces of a cube are seen');
ok(P.visibleFaces(P.ortho(), cubeM).length === 1, 'front view: one face');
ok(P.edgesWithVisibility(P.isometric(), cubeM).filter(e => !e.visible).length === 3, 'isometric: three hidden edges');
for (const name of ['house', 'lbracket', 'stairs', 'pyramid', 'cylinder', 'tetra']) { const m = P.models[name](); ok(m.pts.length > 3 && m.edges.length >= m.pts.length - 1 && m.faces.length > 1, name + ' model is well formed'); }

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
