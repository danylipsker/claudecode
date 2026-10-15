/* Tests of HYPER-CORE/js/water.js (kit.water) and watersym.js (kit.wsym).
 * Run: node HYPER-CORE/tools/test-water.js */
'use strict';
const path = require('path');
const L = require('./load.js');
const H = L.loadCore(), W = H.water;
L.run(H._ctx, path.join(__dirname, '..', 'js', 'watersym.js'));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), m + ' (got ' + a + ', want ' + b + ')');
const abs = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');

/* ---------------------------------------------------------------- density */
abs(W.density(0), 999.84, 0.02, 'density at 0 °C');
abs(W.density(4), 999.97, 0.02, 'density at 4 °C');
abs(W.density(20), 998.21, 0.02, 'density at 20 °C');
abs(W.density(25), 997.05, 0.03, 'density at 25 °C');
abs(W.density(100), 958.4, 0.3, 'density at 100 °C');
abs(W.density(-10), 998.1, 0.3, 'supercooled density at −10 °C');
abs(W.density(-30), 983.9, 0.6, 'supercooled density at −30 °C');
abs(W.TMAX, 3.98, 0.02, 'temperature of maximum density');
ok(W.density(3) > W.density(0) && W.density(5) < W.density(4), 'the maximum is a maximum');
abs(W.densityIce(0), 916.7, 0.1, 'ice at 0 °C');
ok(W.densityIce(0) < W.density(0), 'ice floats');
abs(W.densityD2O(11.2), 1105.3, 0.5, 'heavy water at its maximum');
abs(W.densityD2O(25), 1104.4, 1.0, 'heavy water at 25 °C');
ok(W.expansion(2) < 0 && W.expansion(6) > 0, 'negative expansion below 4 °C, positive above');
abs(W.expansion(20) * 1e6, 207, 6, 'expansion coefficient at 20 °C (ppm/K)');

/* ---------------------------------------------------------------- vapour, boiling, melting */
abs(W.vapourPressure(100), 101418, 20, 'vapour pressure at 100 °C (IAPWS: 1 atm is reached at 99.974 °C)');
abs(W.vapourPressure(20), 2339, 3, 'vapour pressure at 20 °C');
abs(W.vapourPressure(25), 3170, 3, 'vapour pressure at 25 °C');
abs(W.vapourPressure(0.01), 611.657, 0.5, 'the triple point pressure');
abs(W.vapourPressure(W.C(W.CRITICAL.T)), 22.064e6, 1e3, 'the critical pressure');
abs(W.sublimationPressure(0.01), 611.657, 0.1, 'sublimation meets the triple point');
abs(W.sublimationPressure(-20), 103.2, 0.5, 'vapour over ice at −20 °C');
ok(W.vapourPressure(-20) > W.sublimationPressure(-20), 'supercooled water has a higher vapour pressure than ice (why ice grows at its expense)');
abs(W.boilingPoint(101325), 99.974, 0.01, 'boiling point at 1 atm (99.974 °C on ITS-90)');
abs(W.boilingPoint(33700), 71.6, 0.5, 'boiling point on Everest (337 hPa)');
abs(W.boilingPoint(2 * 101325), 120.2, 0.5, 'boiling point in a pressure cooker (2 atm)');
abs(W.boilingPoint(100), -20.4, 0.5, 'sublimation at 100 Pa');
abs(W.meltingPoint(101325).T, 273.1525, 0.002, 'ice melts at 273.1525 K under 1 atm (7.5 mK below the triple point)');
abs((W.meltingPressure(273.15) - W.meltingPressure(273.16)) / 0.01 / 1e6, 13.5, 0.3, 'the melting curve steepens by 13.5 MPa per kelvin near the triple point');
abs(W.meltingPressure(251.165) / 1e6, 208.566, 0.5, 'the Ih–III–liquid triple point at 208.6 MPa');
abs(W.meltingPoint(100e6).T, 264.2, 0.4, 'ice melts at −9 °C under 1,000 bar');
abs(W.meltingPoint(1e8).T - 273.15, -8.9, 0.5, 'the same in °C');
ok(W.meltingPoint(300e6).ice === 'III' || W.meltingPoint(300e6).ice === 'V', 'ice III or V melts at 300 MPa');
abs(W.meltingPoint(632.4e6).T, 273.31, 0.1, 'the V–VI–liquid triple point');
abs(W.meltingPoint(2216e6).T, 355, 0.2, 'the VI–VII–liquid triple point');
ok(W.meltingPoint(10e9).T > 500 && W.meltingPoint(10e9).ice === 'VII', 'ice VII melts above 500 K at 10 GPa');
abs(W.meltingPoint(40e9).T, 1000, 60, 'ice VII melts near 1,000 K at 40 GPa');
ok(W.meltingPoint(60e9).T > W.meltingPoint(40e9).T && W.meltingPoint(40e9).T > W.meltingPoint(20e9).T, 'the melting curve keeps rising at high pressure');
ok(W.phaseAt(800, 30e9) === 'ice VII', 'ice VII at 30 GPa and 800 K');
ok(W.phaseAt(1000, 30e9) === 'supercritical', 'fluid at 30 GPa and 1,000 K');
ok(W.phaseAt(298.15, 101325) === 'liquid', 'liquid at room conditions');
ok(W.phaseAt(263.15, 101325) === 'ice Ih', 'ice Ih in the freezer');
ok(W.phaseAt(383.15, 101325) === 'vapour', 'steam at 110 °C');
ok(W.phaseAt(263.15, 10) === 'vapour', 'vapour at −10 °C and 10 Pa');
ok(W.phaseAt(700, 30e6) === 'supercritical', 'supercritical at 700 K, 30 MPa');
ok(W.phaseAt(300, 3e9) === 'ice VII', 'ice VII at 3 GPa and room temperature');
ok(W.phaseAt(300, 1e9) === 'ice VI', 'ice VI at 1 GPa and room temperature');
ok(W.phaseAt(200, 100e9) === 'ice X', 'ice X at 100 GPa');
ok(W.phaseAt(50, 1e5) === 'ice XI', 'ice XI at 50 K');

/* ---------------------------------------------------------------- properties */
abs(W.surfaceTension(20) * 1e3, 72.74, 0.1, 'surface tension at 20 °C (mN/m)');
abs(W.surfaceTension(100) * 1e3, 58.9, 0.2, 'surface tension at 100 °C');
abs(W.viscosity(20) * 1e3, 1.002, 0.01, 'viscosity at 20 °C (mPa·s)');
abs(W.viscosity(100) * 1e3, 0.282, 0.01, 'viscosity at 100 °C');
abs(W.heatCapacity(25), 4179.6, 1, 'specific heat at 25 °C');
abs(W.heatCapacity(0), 4217.4, 1, 'specific heat at 0 °C');
ok(W.heatCapacity(35) < W.heatCapacity(20) && W.heatCapacity(35) < W.heatCapacity(60), 'the heat capacity minimum near 35 °C');
abs(W.thermalConductivity(25), 0.607, 0.002, 'thermal conductivity at 25 °C');
abs(W.dielectric(25), 78.3, 0.2, 'dielectric constant at 25 °C');
abs(W.dielectric(0), 87.7, 0.2, 'dielectric constant at 0 °C');
abs(W.speedOfSound(20), 1482.3, 0.5, 'speed of sound at 20 °C');
{ let best = 0, bT = 0; for (let t = 0; t <= 100; t += 0.5) { const c = W.speedOfSound(t); if (c > best) { best = c; bT = t; } } abs(bT, 74, 1.5, 'speed of sound peaks near 74 °C'); abs(best, 1555, 2, 'at about 1555 m/s'); }
abs(W.compressibility(25) * 1e10, 4.52, 0.05, 'compressibility at 25 °C');
ok(W.compressibility(46) < W.compressibility(20) && W.compressibility(46) < W.compressibility(80), 'the compressibility minimum near 46 °C');
abs(W.bulkModulus(20) / 1e9, 2.18, 0.05, 'bulk modulus about 2.2 GPa');
abs(W.pKw(25), 14.0, 0.01, 'pKw at 25 °C');
abs(W.pHneutral(100), 6.13, 0.02, 'neutral pH at 100 °C');
abs(W.latentVaporisation(100) / 1e3, 2259, 4, 'latent heat at 100 °C (kJ/kg)');
abs(W.latentVaporisation(25) / 1e3, 2440.5, 3, 'latent heat at 25 °C');
abs(W.latentVaporisation(W.C(W.CRITICAL.T)), 0, 1e-6, 'latent heat vanishes at the critical point');
abs(W.latentVaporisation(200) / 1e3, 1941, 40, 'latent heat at 200 °C (steam tables 1,941 kJ/kg)');
abs(W.latentVaporisation(100.01) - W.latentVaporisation(99.99), 0, 200, 'no kink at 100 °C');
abs(W.ccSlope(100), 3620, 100, 'the Clausius–Clapeyron slope at 100 °C (Pa/K)');
abs(W.heatToWarm(1, -10, 110) / 1e3, 20.5 + 333.55 + 419 + 2257 + 20.1, 3, 'ice at −10 °C to steam at 110 °C (kJ)');

/* ---------------------------------------------------------------- solutions, surfaces, humidity */
abs(W.henry('O2', 25) * 1e3, 1.3, 0.01, 'Henry constant of oxygen at 25 °C');
abs(W.dissolvedOxygen(25), 8.26, 0.2, 'dissolved oxygen in fresh water at 25 °C (mg/L)');
abs(W.conductivityPure(25) * 1e4, 0.055, 0.003, 'pure water: 0.055 µS/cm at 25 °C');
abs(W.conductivityPure(0) * 1e4, 0.0115, 0.003, 'pure water: about 0.011 µS/cm at 0 °C');
abs(W.conductivityPure(100) * 1e4, 0.85, 0.2, 'pure water: about 0.8–0.9 µS/cm at 100 °C');
abs(W.densityBrine(35, 0), 1028, 1, 'sea water at 0 °C');
abs(W.densityBrine(35, 25), 1023.3, 1.5, 'sea water at 25 °C');
abs(W.dissolvedOxygen(0), 14.6, 1.2, 'dissolved oxygen at 0 °C');
ok(W.dissolvedOxygen(25, 35) < W.dissolvedOxygen(25), 'sea water holds less oxygen');
abs(W.freezingDepression(1, 2), 3.72, 1e-6, 'one molal NaCl lowers the freezing point by 3.72 K');
abs(W.osmoticPressure(1.1, 1, 298.15) / 1e5, 27.3, 0.2, 'sea water\'s osmotic pressure ≈ 27 bar (1.1 osmol/L)');
abs(W.laplace(1e-3) , 145.5, 1, 'Laplace pressure in a 1 mm drop (Pa)');
abs(W.jurin(0.5e-3) * 1e3, 29.7, 0.5, 'capillary rise in a 1 mm bore tube (mm)');
abs(W.capillaryLength(20) * 1e3, 2.72, 0.03, 'the capillary length (mm)');
abs(W.dewPoint(25, 0.5), 13.9, 0.2, 'dew point at 25 °C and 50 % (°C)');
abs(W.relativeHumidity(25, 13.9), 0.5, 0.01, 'and back to the relative humidity');
abs(W.absoluteHumidity(25, 1) * 1e3, 23.0, 0.3, 'saturated air at 25 °C holds 23 g/m³');
abs(W.wetBulb(35, 0.5), 26.2, 0.6, 'wet-bulb at 35 °C and 50 %');
ok(W.kelvinRatio(1e-8, 20) > 1.1 && W.kelvinRatio(1e-6, 20) < 1.002, 'the Kelvin effect on a 10 nm droplet');

/* ---------------------------------------------------------------- the network, molecules, data */
abs(W.hbondsPerMolecule(25), 3.7, 0.05, 'about 3.7 bonds per molecule at 25 °C');
abs(W.hbondLifetime(25) * 1e12, 1.2, 1e-3, '1.2 ps at 25 °C');
abs(W.molecules(1e-3) / 1e22, 3.34, 0.01, 'a gram of water is 3.34e22 molecules');
abs(W.molarVolume(25), 18.07, 0.02, 'molar volume 18.07 cm³');
abs(W.ionFraction(25) * 1e9, 1.8, 0.05, 'two molecules in a billion are ions at 25 °C');
ok(W.MOLECULES.find(m => m.id === 'H2O').bp === 100 && W.MOLECULES.find(m => m.id === 'CH4').bp < -150, 'the look-alikes table');
ok(W.DH.find(d => d.id === '67p').dh / W.VSMOW > 3 && W.DH.find(d => d.id === 'hartley').dh / W.VSMOW < 1.1, 'D/H: 67P is three times Earth, Hartley 2 is Earth-like');
ok(W.WORLDS.find(w => w.id === 'europa').ocean > 2 * W.WORLDS.find(w => w.id === 'earth').ocean, 'Europa holds more than twice Earth\'s ocean water');
abs(W.oceanLayerEqualToAtmosphere(), 3.5, 0.3, 'the top 3.5 m of the ocean match the atmosphere\'s heat capacity');
abs(W.oceanFractionOfEarth() * 100, 0.023, 0.002, 'the oceans are 0.023 % of the Earth\'s mass');
abs(W.EARTH.fresh / W.EARTH.totalWater, 0.025, 0.001, '2.5 % of the water is fresh');
abs(W.EARTH.icecaps / W.EARTH.fresh, 0.687, 0.01, '69 % of the fresh water is ice');
ok(W.ANOMALIES.length >= 20 && W.ICES.length >= 20, 'the anomalies and ices tables');
abs(W.habitableZone(1).inner, 0.95, 1e-6, 'the Sun\'s habitable zone starts at 0.95 AU');
abs(W.snowLine(1), 2.7, 1e-6, 'the snow line at 2.7 AU');
abs(W.equilibriumTemperature(1, 1), 255, 2, 'Earth\'s equilibrium temperature 255 K');
abs(W.suctionLimit(), 10.35, 0.05, 'a vacuum lifts water 10.3 m');
abs(W.hydrostaticHead(100) / 1e6, 0.979, 0.01, 'a 100 m column weighs 0.98 MPa');

/* ---------------------------------------------------------------- the drawing kit */
{
  const S = H.wsym;
  ok(S && typeof S.molecule === 'function' && typeof S.hbond === 'function' && typeof S.network === 'function', 'kit.wsym has molecule, hbond, network');
  const calls = [];
  const ctx = new Proxy({}, { get: (t, k) => (k === 'canvas' ? {} : (...a) => { calls.push(k); return 0; }), set: () => true });
  S.molecule(ctx, 100, 100, { angle: 0.3, scale: 20 });
  S.hbond(ctx, 0, 0, 50, 50);
  S.drop(ctx, 50, 50, 20);
  S.beaker(ctx, 10, 10, 80, 120, 0.5);
  S.thermometer(ctx, 200, 10, 100, 25, { min: -20, max: 100 });
  S.iceLattice(ctx, 100, 100, 20, 3);
  S.snowflake(ctx, 100, 100, 30, 0.5);
  const net = S.makeNetwork(30, 300, 200, 25);
  S.network(ctx, net, { T: 25 });
  ok(net.length === 30 && net.every(m => Number.isFinite(m.x) && Number.isFinite(m.y)), 'a random network of 30 molecules');
  S.stepNetwork(net, 0.02, { T: 25, W: 300, H: 200 });
  ok(net.every(m => m.x >= 0 && m.x <= 300 && m.y >= 0 && m.y <= 200), 'molecules stay in the box');
  const b = S.bondsOf(net, 25);
  ok(Array.isArray(b) && b.every(p => p.length === 3), 'bondsOf lists donor, acceptor and hydrogen');
  ok(calls.length > 20, 'drawing calls were made');
}

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
