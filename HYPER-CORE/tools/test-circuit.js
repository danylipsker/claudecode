/* Tests of the circuit simulator against textbook results.
 *   node HYPER-CORE/tools/test-circuit.js
 */
'use strict';
const { makeContext, run } = require('./load');
const path = require('path');
const ctx = makeContext();
run(ctx, path.join(__dirname, '..', 'js', 'hyper.js'));
run(ctx, path.join(__dirname, '..', 'js', 'circuit.js'));
const H = ctx.Hyper;
let pass = 0, fail = 0;
const near = (a, b, tol, msg) => { if (Math.abs(a - b) <= tol) pass++; else { fail++; console.log('FAIL', msg, 'got', a, 'want', b, '±', tol); } };
const ok = (c, msg) => { if (c) pass++; else { fail++; console.log('FAIL', msg); } };

// divider
{ const c = new H.Circuit(); const V = c.V('in', 'gnd', 12); const R1 = c.R('in', 'out', 10e3); c.R('out', 'gnd', 20e3); c.dc();
  near(c.v('out'), 8, 1e-6, 'divider'); near(R1.i, 0.4e-3, 1e-9, 'divider current'); near(V.i, 0.4e-3, 1e-9, 'source current out of +'); near(V.p, 4.8e-3, 1e-9, 'source power'); }
// loaded divider / source resistance
{ const c = new H.Circuit(); c.V('in', 'gnd', 9, { r: 1 }); c.R('in', 'gnd', 8); c.dc(); near(c.v('in'), 8, 1e-6, 'internal resistance'); }
// current source
{ const c = new H.Circuit(); c.I('gnd', 'a', 2e-3); c.R('a', 'gnd', 1e3); c.dc(); near(c.v('a'), 2, 1e-6, 'current source into a'); }
// RC charging: v = V(1 − e^{−t/RC})
{ const c = new H.Circuit(); c.V('in', 'gnd', 5); c.R('in', 'out', 1e3); const C = c.C('out', 'gnd', 1e-6);
  c.reset(); const dt = 1e-6; for (let k = 0; k < 1000; k++) c.step(dt);
  near(c.v('out'), 5 * (1 - Math.exp(-1)), 0.01, 'RC after one time constant'); near(C.i, 5 / 1e3 * Math.exp(-1), 2e-5, 'capacitor current'); }
// RL: i = V/R (1 − e^{−tR/L})
{ const c = new H.Circuit(); c.V('in', 'gnd', 10); c.R('in', 'x', 100); const L = c.L('x', 'gnd', 0.1);
  c.reset(); for (let k = 0; k < 1000; k++) c.step(1e-6);
  near(L.i, 0.1 * (1 - Math.exp(-1)), 5e-4, 'RL after one time constant'); }
// diode forward drop with 1 mA
{ const c = new H.Circuit(); c.V('in', 'gnd', 5); c.R('in', 'a', 4.3e3); const D = c.D('a', 'gnd'); c.dc();
  ok(c.ok, 'diode converges'); ok(c.v('a') > 0.55 && c.v('a') < 0.75, 'silicon diode ~0.6-0.7 V (got ' + c.v('a').toFixed(3) + ')'); near(D.i, (5 - c.v('a')) / 4.3e3, 1e-8, 'diode current = resistor current'); }
// reverse biased diode blocks
{ const c = new H.Circuit(); c.V('in', 'gnd', -5); c.R('in', 'a', 1e3); c.D('a', 'gnd'); c.dc(); near(c.v('a'), -5, 1e-3, 'reverse diode blocks'); }
// zener regulator: 12 V, 1 kΩ, 5.1 V zener
{ const c = new H.Circuit(); c.V('in', 'gnd', 12); c.R('in', 'z', 1e3); c.D('gnd', 'z', { vz: 5.1 }); c.dc();
  ok(c.ok && c.v('z') > 5.0 && c.v('z') < 5.6, 'zener holds ~5.1 V (got ' + c.v('z').toFixed(3) + ')'); }
// LED ~1.8–2.1 V at 10 mA
{ const c = new H.Circuit(); c.V('in', 'gnd', 5); c.R('in', 'a', 300); c.D('a', 'gnd', { is: 1e-18, n: 2 }); c.dc();
  ok(c.v('a') > 1.6 && c.v('a') < 2.4, 'LED drop (got ' + c.v('a').toFixed(3) + ')'); }
// BJT switch: 5 V through 1 kΩ base, 1 kΩ collector load from 12 V -> saturated
{ const c = new H.Circuit(); c.V('vcc', 'gnd', 12); c.V('in', 'gnd', 5); c.R('in', 'b', 1e3); c.R('vcc', 'c', 1e3); const Q = c.NPN('c', 'b', 'gnd', { beta: 100 }); c.dc();
  ok(c.ok, 'bjt converges'); ok(c.v('c') < 0.3, 'saturated switch Vce (got ' + c.v('c').toFixed(3) + ')'); ok(Q.ic > 11e-3, 'collector current ~12 mA'); }
// BJT active region: Ic ≈ β Ib
{ const c = new H.Circuit(); c.V('vcc', 'gnd', 12); c.V('vb', 'gnd', 2); c.R('vb', 'b', 100e3); c.R('vcc', 'c', 1e3); const Q = c.NPN('c', 'b', 'gnd', { beta: 100 }); c.dc();
  near(Q.ic / Q.ib, 100, 2, 'active: Ic/Ib ≈ β'); ok(c.v('c') > 1 && c.v('c') < 11, 'active region Vce'); }
// PNP high-side switch
{ const c = new H.Circuit(); c.V('vcc', 'gnd', 12); c.V('b0', 'gnd', 0); c.R('b0', 'b', 2e3); c.R('c', 'gnd', 1e3); const Q = c.PNP('c', 'b', 'vcc'); c.dc();
  ok(c.v('c') > 11.6, 'PNP switch on (Vc = ' + c.v('c').toFixed(3) + ')'); ok(Q.ic < 0, 'PNP collector current flows out'); }
// NMOS switch
{ const c = new H.Circuit(); c.V('vdd', 'gnd', 12); c.V('g', 'gnd', 10); c.R('vdd', 'd', 100); const M = c.NMOS('d', 'g', 'gnd', { vt: 2, k: 0.5 }); c.dc();
  ok(c.v('d') < 0.1, 'NMOS on (Vds = ' + c.v('d').toFixed(4) + ')');
  const c2 = new H.Circuit(); c2.V('vdd', 'gnd', 12); c2.V('g', 'gnd', 0); c2.R('vdd', 'd', 100); c2.NMOS('d', 'g', 'gnd', { vt: 2, k: 0.5 }); c2.dc();
  ok(c2.v('d') > 11.9, 'NMOS off'); void M; }
// NMOS saturation current: k/2 (Vgs − Vt)^2
{ const c = new H.Circuit(); c.V('vdd', 'gnd', 12); c.V('g', 'gnd', 3); c.R('vdd', 'd', 10); const M = c.NMOS('d', 'g', 'gnd', { vt: 2, k: 0.5, lambda: 0 }); c.dc();
  near(M.id, 0.25, 0.01, 'NMOS square law'); }
// inverting amplifier gain −10
{ const c = new H.Circuit(); c.V('in', 'gnd', 0.5); c.R('in', 'n', 10e3); c.R('n', 'out', 100e3); c.OPAMP('gnd', 'n', 'out'); c.dc();
  near(c.v('out'), -5, 1e-3, 'inverting amp'); near(c.v('n'), 0, 1e-3, 'virtual ground'); }
// non-inverting and saturation at the rails
{ const c = new H.Circuit(); c.V('in', 'gnd', 2); c.R('out', 'n', 90e3); c.R('n', 'gnd', 10e3); c.OPAMP('in', 'n', 'out', { vpos: 12, vneg: -12 }); c.dc();
  ok(c.v('out') > 11.5 && c.v('out') <= 12.001, 'saturates at the rail (got ' + c.v('out').toFixed(3) + ')'); }
// comparator
{ const c = new H.Circuit(); c.V('a', 'gnd', 1.01); c.V('b', 'gnd', 1); c.OPAMP('a', 'b', 'out', { vpos: 5, vneg: 0 }); c.dc(); ok(c.v('out') > 4.9, 'comparator high'); }
// AC: RC low-pass at its corner: |H| = 1/√2, phase −45°
{ const c = new H.Circuit(); c.V('in', 'gnd', 0, { ac: 1 }); c.R('in', 'out', 1e3); c.C('out', 'gnd', 1e-6);
  const fc = 1 / (2 * Math.PI * 1e3 * 1e-6); const r = c.ac(fc).v('out');
  near(r.mag, Math.SQRT1_2, 1e-4, 'RC corner magnitude'); near(r.phase, -45, 0.05, 'RC corner phase'); }
// AC: series RLC at resonance, current = V/R
{ const c = new H.Circuit(); const V = c.V('in', 'gnd', 0, { ac: 1 }); c.R('in', 'a', 10); c.L('a', 'b', 1e-3); c.C('b', 'gnd', 1e-6);
  const f0 = 1 / (2 * Math.PI * Math.sqrt(1e-3 * 1e-6)); const r = c.ac(f0); near(r.i(V).mag, 0.1, 1e-4, 'RLC resonance current'); }
// AC: op-amp with GBW 1 MHz, gain −10 -> corner about 91 kHz
{ const c = new H.Circuit(); c.V('in', 'gnd', 0, { ac: 1 }); c.R('in', 'n', 10e3); c.R('n', 'out', 100e3); c.OPAMP('gnd', 'n', 'out', { gbw: 1e6 });
  c.dc(); near(c.ac(100).v('out').mag, 10, 0.01, 'op-amp low-frequency gain'); const g = c.ac(1e6 / 11).v('out').mag; near(g, 10 / Math.SQRT2, 0.2, 'op-amp closed-loop bandwidth GBW/(1+|G|)'); }
// half-wave rectifier with smoothing: output near peak minus a diode drop
{ const c = new H.Circuit(); c.V('ac', 'gnd', t => 10 * Math.sin(2 * Math.PI * 50 * t)); c.D('ac', 'out'); c.R('out', 'gnd', 1e3); c.C('out', 'gnd', 1000e-6);
  c.reset(); for (let k = 0; k < 4000; k++) c.step(1e-5);
  ok(c.v('out') > 8.3 && c.v('out') < 9.6, 'rectifier + smoothing (got ' + c.v('out').toFixed(3) + ')'); }
// diode series resistance: at 100 mA the drop rises by rs × I
{ const c = new H.Circuit(); c.V('in', 'gnd', 5); c.R('in', 'a', 43); c.D('a', 'gnd'); c.dc(); const v0 = c.v('a');
  const c2 = new H.Circuit(); c2.V('in', 'gnd', 5); c2.R('in', 'a', 43); c2.D('a', 'gnd', { rs: 2 }); c2.dc();
  ok(c2.v('a') - v0 > 0.15 && c2.v('a') - v0 < 0.25, 'diode rs adds ~0.2 V at 0.1 A (got ' + (c2.v('a') - v0).toFixed(3) + ')'); }
// ideal transformer 10:1 with a 10 Ω load: 230 V -> 23 V, primary current = secondary / 10
{ const c = new H.Circuit(); c.V('p', 'gnd', 230); const T = c.XFMR('p', 'gnd', 's', 'sg', 0.1); c.R('s', 'sg', 10); c.R('sg', 'gnd', 1e9); c.dc();
  near(c.v('s') - c.v('sg'), 23, 1e-6, 'transformer ratio'); near(T.i, 2.3, 1e-6, 'secondary current'); near(T.i1, 0.23, 1e-6, 'primary current'); }
// transformer + bridge rectifier on AC
{ const c = new H.Circuit(); c.V('p', 'gnd', t => 325 * Math.sin(2 * Math.PI * 50 * t)); c.XFMR('p', 'gnd', 'a', 'b', 12 * Math.SQRT2 / 325);
  c.D('a', 'pos'); c.D('b', 'pos'); c.D('neg', 'a'); c.D('neg', 'b'); c.R('pos', 'neg', 100); c.C('pos', 'neg', 2200e-6); c.R('neg', 'gnd', 1e6);
  c.reset(); for (let k = 0; k < 4000; k++) c.step(1e-5);
  const v = c.v('pos') - c.v('neg'); ok(v > 14.5 && v < 16.5, 'transformer + bridge gives ~12√2 − 2 drops (got ' + v.toFixed(2) + ')'); }
// trapezoidal integration: an ideal LC tank keeps its amplitude; backward Euler loses it
{ const run = method => { const c = new H.Circuit({ method }); c.C('a', 'gnd', 1e-6, 1); c.L('a', 'gnd', 1e-3, 0); c.reset();
    const T = 2 * Math.PI * Math.sqrt(1e-3 * 1e-6), dt = T / 200; let peak = 0;
    for (let k = 0; k < 200 * 10; k++) { c.step(dt); if (k > 200 * 9) peak = Math.max(peak, Math.abs(c.v('a'))); } return peak; };
  near(run('trap'), 1, 0.01, 'trapezoidal LC keeps its amplitude'); ok(run('euler') < 0.9, 'backward Euler damps the LC tank'); }
// trapezoidal RC still matches the exponential
{ const c = new H.Circuit({ method: 'trap' }); c.V('in', 'gnd', 5); c.R('in', 'out', 1e3); c.C('out', 'gnd', 1e-6); c.reset();
  for (let k = 0; k < 100; k++) c.step(1e-5); near(c.v('out'), 5 * (1 - Math.exp(-1)), 0.005, 'trapezoidal RC'); }
// AC element currents: capacitor current leads its voltage by 90°, inductor current lags; directions as in DC
{ const c = new H.Circuit(); c.V('in', 'gnd', 0, { ac: 1 }); const Cc = c.C('in', 'gnd', 1e-6); const Ll = c.L('in', 'gnd', 1e-3); const Rr = c.R('in', 'gnd', 100);
  const r = c.ac(1000);
  near(r.i(Cc).phase, 90, 0.01, 'capacitor current leads by 90°'); near(r.i(Cc).mag, 2 * Math.PI * 1000 * 1e-6, 1e-9, 'capacitor current size');
  near(r.i(Ll).phase, -90, 0.01, 'inductor current lags by 90°'); near(r.i(Ll).mag, 1 / (2 * Math.PI * 1000 * 1e-3), 1e-6, 'inductor current size');
  near(r.i(Rr).phase, 0, 1e-6, 'resistor current in phase'); }
// op-amp driven in and out of saturation in a transient: recovers every cycle, never stuck at a rail
{ const c = new H.Circuit(); c.V('in', 'gnd', t => 2 * Math.sin(2 * Math.PI * 100 * t)); c.R('in', 'n', 1e3); c.R('n', 'out', 20e3);
  c.OPAMP('gnd', 'n', 'out', { vpos: 12, vneg: -12 }); c.reset();
  let fails = 0, maxErr = 0;
  for (let k = 0; k < 2000; k++) {
    c.step(1e-5); if (!c.ok) fails++;
    const want = Math.max(-12, Math.min(12, -20 * 2 * Math.sin(2 * Math.PI * 100 * c.t)));
    maxErr = Math.max(maxErr, Math.abs(c.v('out') - want));
  }
  ok(fails === 0, 'saturating op-amp converges every step (' + fails + ' failures)'); ok(maxErr < 0.05, 'clips at the rails and recovers (max error ' + maxErr.toFixed(4) + ' V)'); }
// slew-rate model: a follower given a 10 V step rises at sr = 0.5 V/µs
{ const c = new H.Circuit(); c.V('in', 'gnd', t => t > 1e-6 ? 5 : -5); c.OPAMP('in', 'out', 'out', { gbw: 1e6, sr: 0.5e6, vpos: 12, vneg: -12 }); c.R('out', 'gnd', 10e3);
  c.dc(); let t10 = 0, t90 = 0;          // start from the operating point (dc), not from reset()
  for (let k = 0; k < 4000; k++) { c.step(1e-8); const v = c.v('out'); if (!t10 && v > -4) t10 = c.t; if (!t90 && v > 4) t90 = c.t; }
  near((t90 - t10), 8 / 0.5e6, 1.5e-6, 'slew-limited rise at 0.5 V/µs'); ok(Math.abs(c.v('out') - 5) < 0.01, 'follower settles at the input'); }
// slew model small signal: unity-gain bandwidth close to GBW in AC is unchanged
// E-series
near(H.circuit.eSeries(4700, 'E12'), 4700, 0, 'E12 exact'); near(H.circuit.eSeries(5000, 'E24'), 5100, 0, 'E24 nearest'); near(H.circuit.eSeries(9500, 'E12'), 10000, 0, 'rounds up a decade');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
