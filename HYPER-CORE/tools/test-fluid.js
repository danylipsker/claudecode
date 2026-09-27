/* Tests of the fluid module (aerodynamics, hydraulics, pneumatics) against published tables and
 * textbook values, and the fluid-power units.
 *   node HYPER-CORE/tools/test-fluid.js
 */
'use strict';
const { loadCore } = require('./load');
const H = loadCore();
const F = H.fluid, U = H.units;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');
const rel = (a, b, r, m) => ok(Math.abs(a - b) <= r * Math.abs(b), m + ' (got ' + a + ', want ' + b + ')');
const d = x => x * Math.PI / 180, deg = x => x * 180 / Math.PI;

// the standard atmosphere (ICAO tables)
let a = F.isa(0);
near(a.T, 288.15, 1e-9, 'ISA sea-level temperature'); near(a.p, 101325, 1e-6, 'ISA sea-level pressure');
near(a.rho, 1.2250, 1e-4, 'ISA sea-level density'); near(a.a, 340.29, 0.01, 'ISA sea-level speed of sound'); rel(a.mu, 1.7894e-5, 1e-3, 'ISA sea-level viscosity');
a = F.isa(5000); near(a.T, 255.65, 1e-9, 'ISA 5 km temperature'); rel(a.p, 54019.9, 1e-4, 'ISA 5 km pressure'); rel(a.rho, 0.73612, 1e-4, 'ISA 5 km density');
a = F.isa(11000); rel(a.p, 22632.1, 1e-4, 'ISA tropopause pressure'); rel(a.rho, 0.36392, 1e-4, 'ISA tropopause density');
a = F.isa(20000); rel(a.p, 5474.89, 1e-4, 'ISA 20 km pressure'); near(a.T, 216.65, 1e-9, 'ISA 20 km temperature');
a = F.isa(32000); rel(a.p, 868.02, 1e-4, 'ISA 32 km pressure');

// isentropic flow and shocks (NACA 1135 values)
let s = F.isentropic(1); near(s.T0T, 1.2, 1e-12, 'T0/T at M 1'); near(s.p0p, 1.8929, 1e-4, 'p0/p at M 1'); near(s.AAstar, 1, 1e-12, 'A/A* at M 1');
s = F.isentropic(2); near(s.p0p, 7.8244, 1e-4, 'p0/p at M 2'); near(s.AAstar, 1.6875, 1e-9, 'A/A* at M 2');
near(F.machFromArea(1.6875, 1.4, true), 2, 1e-9, 'supersonic Mach from A/A*'); near(F.machFromArea(1.6875, 1.4, false), 0.3722, 1e-4, 'subsonic Mach from A/A*');
s = F.normalShock(2); near(s.M2, 0.57735, 1e-5, 'normal shock M2'); near(s.p2p1, 4.5, 1e-12, 'normal shock p2/p1'); near(s.rho2rho1, 2.6667, 1e-4, 'normal shock ρ2/ρ1');
near(s.T2T1, 1.6875, 1e-9, 'normal shock T2/T1'); near(s.p02p01, 0.72087, 1e-5, 'normal shock total-pressure ratio');
s = F.obliqueShock(2, d(10)); near(deg(s.beta), 39.31, 0.01, 'oblique shock weak β, M 2, θ 10°'); near(s.M2, 1.6405, 1e-3, 'oblique shock M2'); near(s.p2p1, 1.7066, 1e-3, 'oblique shock p2/p1');
near(deg(s.thetaMax), 22.97, 0.02, 'maximum deflection at M 2');
s = F.obliqueShock(2, 0); near(deg(s.beta), 30, 1e-9, 'no deflection: a Mach wave'); near(s.p2p1, 1, 1e-12, 'a Mach wave changes nothing'); near(s.strong.p2p1, 4.5, 1e-9, 'strong solution at θ = 0 is the normal shock'); ok(F.obliqueShock(2, d(25)).detached, 'detached shock beyond θmax');
near(deg(F.prandtlMeyer(2)), 26.380, 1e-3, 'Prandtl–Meyer ν(2)'); near(deg(F.prandtlMeyer(3)), 49.757, 1e-3, 'Prandtl–Meyer ν(3)');
near(F.machFromNu(F.prandtlMeyer(2.5)), 2.5, 1e-9, 'Mach from ν');

// airfoils: panel method against inviscid values, thin-airfoil theory, lifting line
let p = F.panel(F.naca4(0, 0, 0.12, 80), 0); near(p.cl, 0, 1e-9, 'NACA 0012 no lift at 0°');
p = F.panel(F.naca4(0, 0, 0.12, 80), d(5)); near(p.cl, 0.605, 0.01, 'NACA 0012 cl at 5° (inviscid ≈ 0.60)'); near(p.cm, 0, 0.01, 'NACA 0012 cm about c/4 ≈ 0');
p = F.panel(F.naca4(0.02, 0.4, 0.12, 80), 0); near(p.cl, 0.26, 0.02, 'NACA 2412 cl at 0°'); near(p.cm, -0.054, 0.006, 'NACA 2412 cm c/4');
const le = p.cp.reduce((m, c) => c.cp > m.cp ? c : m); ok(le.x < 0.02 && le.cp > 0.9, 'stagnation near the leading edge (cp ≈ 1)');
const far = p.velAt(-5, 3); near(Math.hypot(far[0], far[1]), 1, 0.02, 'free stream far from the airfoil');
const ta = F.thinAirfoil(0.02, 0.4); near(deg(ta.alpha0), -2.077, 0.01, 'thin-airfoil zero-lift angle NACA 2412'); near(ta.cmc4, -0.0531, 5e-4, 'thin-airfoil cm c/4 NACA 2412');
let ll = F.liftingLine({ AR: 1000, alpha: d(5) }); near(ll.CL, 2 * Math.PI * d(5), 0.005, 'very long wing → 2πα');
ll = F.liftingLine({ AR: 8, taper: 1, alpha: d(5) }); near(ll.CL, 0.422, 0.005, 'rectangular AR 8 CL'); ok(ll.e > 0.9 && ll.e < 0.96, 'rectangular wing e ≈ 0.93 (' + ll.e + ')');
ll = F.liftingLine({ AR: 8, taper: 0.4, alpha: d(5) }); ok(ll.e > 0.98, 'taper 0.4 nearly elliptic (' + ll.e + ')');
near(ll.CDi, ll.CL * ll.CL / (Math.PI * 8 * ll.e), 1e-12, 'CDi = CL²/(π AR e)');

// boundary layers and pipes (Moody chart)
near(F.flatPlate(1e6).cfLam, 0.001328, 1e-9, 'Blasius skin friction'); near(F.flatPlate(1e6).cfTurb, 0.00447, 2e-5, 'Prandtl–Schlichting skin friction');
near(F.friction(1000, 0), 0.064, 1e-12, 'laminar f = 64/Re'); near(F.friction(1e5, 0), 0.0180, 2e-4, 'smooth pipe Re 1e5');
near(F.friction(1e6, 0.001), 0.0199, 2e-4, 'Moody, Re 1e6, ε/D 0.001'); rel(F.swameeJain(1e6, 0.001), F.colebrook(1e6, 0.001), 0.02, 'Swamee–Jain within 2 % of Colebrook');
ok(F.friction(3000, 0) > F.friction(1e5, 0), 'transition blend');
near(F.headLoss({ f: 0.02, L: 100, D: 0.1, V: 2 }), 4.0789, 1e-4, 'Darcy–Weisbach head loss');
const op = F.operatingPoint(q => 50 - 1e4 * q * q, q => 10 + 3e4 * q * q, 1); near(op.Q, 0.031623, 1e-6, 'pump operating point Q'); near(op.H, 40, 1e-6, 'pump operating point H');
const af = F.affinity({ Q: 1, H: 1, P: 1 }, 1000, 2000); ok(af.Q === 2 && af.H === 4 && af.P === 8, 'affinity laws');

// open channels
const yn = F.normalDepth({ Q: 4, b: 2, n: 0.013, S: 0.001 }); near(F.manningQ(yn, { b: 2, n: 0.013, S: 0.001 }), 4, 1e-9, 'normal depth satisfies Manning');
near(F.criticalDepth({ Q: 4, b: 2 }), Math.cbrt(4 / 9.80665), 1e-9, 'critical depth, rectangular');
near(F.hydraulicJump(0.5, 3).y2, 1.886, 1e-3, 'hydraulic jump conjugate depth');
near(F.weirRect(0.62, 1, 0.3), 0.300, 0.002, 'rectangular weir');

// water hammer, orifice, oil
near(F.waveSpeed({ K: 2.2e9, rho: 1000, D: 0.1, e: 0.005, E: 200e9 }), 1342.9, 0.5, 'wave speed in a steel pipe');
near(F.joukowsky(1000, 1343, 1), 1.343e6, 1, 'Joukowsky surge');
near(F.orifice(0.62, 1e-4, 1e6, 870), 0.62e-4 * Math.sqrt(2e6 / 870), 1e-12, 'orifice flow');
near(F.oilViscosity(46, 40) * 1e6, 46, 1e-6, 'ISO VG 46 at 40 °C'); near(F.oilViscosity(46, 100) * 1e6, 6.83, 1e-6, 'ISO VG 46 at 100 °C');
ok(F.oilViscosity(46, 0) > 400e-6 && F.oilViscosity(46, 60) < 25e-6, 'oil thins as it warms');

// compressed air
let c = F.iso6358({ C: 1e-8, b: 0.3, p1: 7e5, p2: 1e5 }); ok(c.choked, 'choked below b'); near(c.qANR * 60000, 420, 1e-9, 'ISO 6358 choked flow 420 L/min ANR');
c = F.iso6358({ C: 1e-8, b: 0.3, p1: 7e5, p2: 7e5 * 0.3 }); near(c.qANR * 60000, 420, 1e-9, 'continuous at b');
near(F.iso6358({ C: 1e-8, b: 0.3, p1: 7e5, p2: 5e5 }).qANR * 60000, 420 * Math.sqrt(1 - ((5 / 7 - 0.3) / 0.7) ** 2), 1e-9, 'subsonic ellipse'); ok(F.iso6358({ C: 1e-8, b: 0.3, p1: 7e5, p2: 6.9999e5 }).qANR < 0.01 * 7e-3, 'flow vanishes at equal pressures');
near(F.dewPoint(20, 0.5), 9.26, 0.05, 'dew point 20 °C 50 %');
const pd = F.pressureDewPoint(20, 0.5, 1e5, 8e5); ok(pd.condenses, 'compressing to 8 bar makes water'); near(pd.pdp, 44.5, 0.3, 'pressure dew point');
near(F.compressorWork(1e5, 8e5, 1, 1), 1e5 * Math.log(8), 1e-6, 'isothermal compression'); near(F.compressorWork(1e5, 8e5, 1, 1.4), 284007, 5, 'adiabatic compression');
const cyl = F.pneuCylinder({}); let t = 0;
while (cyl.state.x < cyl.params.stroke - 1e-6 && t < 3) { cyl.step(0.001, 1); t += 0.001; }
ok(t > 0.05 && t < 1, 'cylinder extends in ' + t.toFixed(3) + ' s');
for (let k = 0; k < 500; k++) cyl.step(0.001, 1);
near(cyl.state.pA, cyl.params.psupply, 2e3, 'cap side ends at supply pressure'); near(cyl.state.pB, cyl.params.patm, 2e3, 'rod side ends at atmosphere');
ok(cyl.airNl() > 0.9 && cyl.airNl() < 1.25, 'air per extend stroke ≈ A·s·p/p0 (' + cyl.airNl().toFixed(3) + ' L)');
const slow = F.pneuCylinder({ CthrottleB: 1.5e-9 }); t = 0;
while (slow.state.x < slow.params.stroke - 1e-6 && t < 5) { slow.step(0.001, 1); t += 0.001; }
ok(t > 0.4, 'meter-out throttle slows the stroke (' + t.toFixed(3) + ' s)');

// units
near(U.toSI(1, 'airflow', 'L/min ANR'), 1e-3 / 60, 1e-15, 'L/min ANR'); near(U.toSI(1, 'displacement', 'cc/rev'), 1e-6, 1e-18, 'cc/rev');
near(U.toSI(1, 'flowcond', 'dm³/(s·bar)'), 1e-8, 1e-20, 'dm³/(s·bar)'); near(U.toSI(29.92, 'pressure', 'inHg'), 101320, 5, 'inHg');
near(U.toSI(1, 'speed', 'kt'), 0.514444, 1e-6, 'knot'); near(U.toSI(1000, 'speed', 'ft/min'), 5.08, 1e-9, 'ft/min');

// the symbol library: every symbol draws with finite coordinates and returns its ports
require('./load').run(H._ctx, require('path').join(__dirname, '..', 'js', 'fluidsym.js'));
const S = H.fsym, badArgs = [];
const fake = new Proxy({ setLineDash() {}, measureText: t => ({ width: String(t).length * 7 }) }, { get(t, k) { if (k in t) return t[k]; return function () { for (const v of arguments) if (typeof v === 'number' && !Number.isFinite(v)) badArgs.push(k); }; }, set(t, k, v) { t[k] = v; return true; } });
for (const spec of Object.keys(S.SPEC)) for (const st of [0, 0.5, 1, S.SPEC[spec].boxes.length - 1]) {
  const v = S.valve(fake, 200, 100, { spec, state: st, left: 'solenoid+pilot', right: 'spring', labels: true, pneumatic: spec[0] === '5' || spec[0] === '3', exhaust: 'silencer' });
  ok(['P', 'A'].every(k => Array.isArray(v[k])), 'valve ' + spec + ' has P and A ports');
  if (st === S.SPEC[spec].normal) ok(v.P[1] > 100 && v.A[1] < 100, 'valve ' + spec + ': P below, A above');
}
for (const k of ['lever', 'pushbutton', 'roller', 'detent', 'manual', 'prop']) S.valve(fake, 0, 0, { spec: '4/2', left: k, right: k });
const ports = [S.pump(fake, 0, 0, { variable: true, motor: true }), S.compressor(fake, 0, 0), S.motor(fake, 0, 0, { bidir: true, angle: 1 }), S.emotor(fake, 0, 0),
  S.cylinder(fake, 0, 0, { pos: 0.5, fillA: '#f00', cushion: true }), S.cylinder(fake, 0, 0, { single: 'retract', rot: -90 }), S.cylinder(fake, 0, 0, { through: true }),
  S.check(fake, 0, 0, { open: true, spring: true, pilot: true, rot: 90 }), S.pressureValve(fake, 0, 0, { kind: 'relief' }), S.pressureValve(fake, 0, 0, { kind: 'reducing' }),
  S.pressureValve(fake, 0, 0, { kind: 'sequence' }), S.pressureValve(fake, 0, 0, { kind: 'regulator' }), S.throttle(fake, 0, 0, { adjustable: true }),
  S.flowControl(fake, 0, 0, { free: 'down', compensated: true }), S.accumulator(fake, 0, 0, { level: 0.3 }), S.tank(fake, 0, 0), S.filter(fake, 0, 0), S.cooler(fake, 0, 0),
  S.gauge(fake, 0, 0, { frac: 0.4, value: S.bar(6e5) }), S.source(fake, 0, 0, { pneumatic: true }), S.exhaust(fake, 0, 0, { silencer: true }), S.frl(fake, 0, 0),
  S.shuttle(fake, 0, 0, { side: 1 }), S.andValve(fake, 0, 0), S.quickExhaust(fake, 0, 0), S.ejector(fake, 0, 0), S.cup(fake, 0, 0)];
ok(ports.every(p => p && Object.values(p).some(Array.isArray)), 'every symbol returns ports');
S.line(fake, [[0, 0], [10, 0]], { state: 'pilot' }); S.flow(fake, [[0, 0], [100, 0], [100, 50]], 7, {});
ok(!badArgs.length, 'symbols draw with finite numbers ' + badArgs.slice(0, 3).join(','));
const cy = S.cylinder(fake, 0, 0, { rot: -90, len: 100 }); near(cy.end[1], -100, 1e-9, 'rotated cylinder points up');
ok(S.bar(6e5) === '6.0 bar', 'bar formatting');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
