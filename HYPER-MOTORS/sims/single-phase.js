/* HYPER-MOTORS · sims/single-phase.js — single-phase motors, their capacitors and start switches, the Steinmetz
 * connection, motors in explosive atmospheres and the life-cycle cost of a motor.
 *   sp-pulsating   one winding on AC: a pulsating field = two counter-rotating fields; the rotor hums at rest and runs
 *                  whichever way it is pushed; the forward, backward and net torque–speed curves
 *   sp-phasors     the motor at standstill: main and auxiliary currents as phasors, the phase split, the elliptical
 *                  field and the starting torque against the start capacitor (or the auxiliary winding's resistance)
 *   sp-lab         a 0.75 kW single-phase motor as split-phase, capacitor-start, capacitor-start-run or PSC: run-up,
 *                  the centrifugal switch, torque–speed curves, current, power factor and efficiency, a stuck switch
 *   sp-wiring      start switches (centrifugal, current relay, potential relay, PTC) and reversing, with the signals
 *                  that make each one act during a start
 *   sp-psc-fan     a PSC blower on speed taps: torque–speed curves against a fan, rotor loss, the run capacitor's
 *                  effect on current and 2f vibration, reversing by moving the capacitor
 *   sp-shaded      the shaded pole: the flux sweeping across the pole face, the weak torque–speed curve, efficiency
 *   sp-captest     capacitors on the bench: stored energy, safe discharge, measuring µF, what a weak run capacitor does
 *   sp-steinmetz   a three-phase motor on one phase with a capacitor: winding voltages and currents, balance, start
 *   sp-exzones     a plant with gas and dust zones: place a motor, check its Ex marking; the Ex e locked-rotor time tE
 *   sp-lifecost    purchase against energy over the years: IE classes, payback, a VFD on a variable-flow fan or pump
 *
 * The single-phase motor model is the double-revolving-field equivalent circuit with two windings in quadrature
 * (symmetrical components of an unsymmetrical two-phase machine), written here because kit.motor has the
 * three-phase circuit only; the Steinmetz model uses the positive- and negative-sequence circuits of a delta motor.
 */
(function () {
  'use strict';
  const TAU = 2 * Math.PI;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';

  /* ---------------------------------------------------------------- complex numbers */
  const cx = (re, im) => ({ re, im: im || 0 });
  const add = (a, b) => cx(a.re + b.re, a.im + b.im), sub = (a, b) => cx(a.re - b.re, a.im - b.im);
  const mul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const div = (a, b) => { const d = b.re * b.re + b.im * b.im || 1e-30; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cabs = a => Math.hypot(a.re, a.im), carg = a => Math.atan2(a.im, a.re), scl = (a, k) => cx(a.re * k, a.im * k);
  const par = (a, b) => div(mul(a, b), add(a, b)), expj = t => cx(Math.cos(t), Math.sin(t)), J = cx(0, 1);
  const capZ = (C, f) => cx(0, -1 / (TAU * f * Math.max(C, 1e-12)));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------------------------------------------------------- the single-phase induction motor */
  // o: { V, f, poles, R1m, X1m, R1a, X1a, a, R2, X2, Xm, Pfw, Pfe }   (per-phase values referred to the main winding)
  // at(s, Zs): Zs = the impedance in series with the auxiliary winding (a capacitor, cx(0,0) for a plain resistance-split
  // winding) or null when the auxiliary circuit is open. Speeds may be negative (s > 1): the model is symmetrical.
  function spMotor(o) {
    const ws = TAU * o.f / (o.poles / 2), ns = 120 * o.f / o.poles, V0 = o.Vn || o.V;
    const Zr = s => cx(o.R2 / (Math.abs(s) < 1e-6 ? (s < 0 ? -1e-6 : 1e-6) : s), o.X2);
    const ZF = s => par(cx(0, o.Xm), Zr(s));
    function at(s, Zs, Vs) {
      const V = cx(Vs == null ? o.V : Vs, 0), Vm = V.re;
      const F = ZF(s), B = ZF(2 - s), zf = scl(F, 0.5), zb = scl(B, 0.5);
      const Zmm = add(cx(o.R1m, o.X1m), add(zf, zb));
      let Im, Iap = cx(0, 0);
      if (!Zs) Im = div(V, Zmm);
      else {
        const a = o.a, Z1ap = scl(add(cx(o.R1a, o.X1a), Zs), 1 / (a * a));
        const M = mul(scl(J, -1), sub(zf, zb)), N = mul(J, sub(zf, zb)), Zaa = add(Z1ap, add(zf, zb)), Vap = scl(V, 1 / a);
        const det = sub(mul(Zmm, Zaa), mul(M, N));
        Im = div(sub(mul(V, Zaa), mul(M, Vap)), det);
        Iap = div(sub(mul(Zmm, Vap), mul(N, V)), det);
      }
      const If = scl(sub(Im, mul(J, Iap)), 0.5), Ib = scl(add(Im, mul(J, Iap)), 0.5);
      const Tf = 2 * Math.pow(cabs(If), 2) * F.re / ws, Tb = 2 * Math.pow(cabs(Ib), 2) * B.re / ws, T = Tf - Tb;
      // the core loss is taken as a resistive current in the main winding's supply, so it shows in the line current
      const Pfe = (o.Pfe || 0) * Math.pow(Vm / V0, 2), Ia = scl(Iap, 1 / o.a), I = add(add(Im, Ia), cx(Vm > 0 ? Pfe / Vm : 0, 0));
      const n = (1 - s) * ns, w = (1 - s) * ws, Pin = Vm * I.re, Pmech = T * w - (o.Pfw || 0) * Math.abs(n) / ns;
      const Vcap = Zs ? cabs(mul(Ia, Zs)) : 0;
      const Eaux = cabs(mul(scl(J, o.a), mul(sub(zf, zb), Im)));                   // voltage induced in the open auxiliary winding
      const Vaux = Zs ? cabs(sub(V, mul(Ia, Zs))) : Eaux;
      // an estimate of the double-frequency torque: forward flux on backward rotor current and backward flux on forward
      const Ef = mul(F, If), Eb = mul(B, Ib), I2f = div(Ef, Zr(s)), I2b = div(Eb, Zr(2 - s));
      const ripple = 2 * (cabs(Ef) * cabs(I2b) + cabs(Eb) * cabs(I2f)) / ws;
      return { s, n, w, T, Tf, Tb, Im: cabs(Im), Ia: cabs(Ia), I: cabs(I), ImC: Im, IaC: Ia, IC: I, IfC: If, IbC: Ib, If: cabs(If), Ib: cabs(Ib),
        Pin, Pmech, eff: Pin > 0 && Pmech > 0 ? Pmech / Pin : 0, pf: cabs(I) > 0 ? I.re / cabs(I) : 0,
        alpha: cabs(Ia) > 1e-9 ? carg(div(Ia, Im)) * 180 / Math.PI : 0, Vcap, Vaux, Eaux, ripple };
    }
    return { ns, ws, at, o };
  }

  // the 0.75 kW (1 hp), 230 V, 50 Hz, 4-pole motor of these pages; each type has its own auxiliary winding
  const BASE = { V: 230, Vn: 230, f: 50, poles: 4, R1m: 3.0, X1m: 3.2, R2: 4.0, X2: 2.8, Xm: 80, Pfw: 30, Pfe: 60 };
  const TYPES = {
    split: { name: 'Split-phase (resistance start)', aux: { a: 0.7, R1a: 8, X1a: 1.5 }, Cs: 0, Cr: 0, sw: true },
    cs: { name: 'Capacitor-start', aux: { a: 1.2, R1a: 4.5, X1a: 4.2 }, Cs: 120e-6, Cr: 0, sw: true },
    cscr: { name: 'Capacitor-start, capacitor-run', aux: { a: 1.4, R1a: 7, X1a: 6 }, Cs: 100e-6, Cr: 20e-6, sw: true },
    psc: { name: 'Permanent split capacitor (PSC)', aux: { a: 1.4, R1a: 7, X1a: 6 }, Cs: 0, Cr: 20e-6, sw: false }
  };
  const PRATED = 750, TRATED = 5.2;                     // ≈ 750 W at about 1430 rpm
  const motorOf = k => spMotor(Object.assign({}, BASE, TYPES[k].aux));
  // the impedance in the auxiliary branch: start circuit (switch closed) or running
  const auxZ = (k, starting, f) => {
    const t = TYPES[k];
    if (k === 'split') return starting ? cx(0, 0) : null;
    const C = (starting ? t.Cs : 0) + t.Cr;
    return C > 0 ? capZ(C, f || 50) : null;
  };

  /* ---------------------------------------------------------------- drawing helpers */
  // a fixed-size drawing space scaled into the stage; returns the context (restore it at the end)
  function frame(st, W0, H0) {
    const c = st.begin(), s = Math.min(st.W / W0, st.H / H0);
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    return c;
  }
  // two graphs side by side under the stage
  function graphs(box, n) {
    const gb = document.createElement('div'); gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px'; box.stage.appendChild(gb);
    const out = []; for (let i = 0; i < (n || 2); i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  function txt(c, s, x, y, color, align, size, weight) {
    c.fillStyle = color; c.textAlign = align || 'center'; c.font = (weight ? weight + ' ' : '') + (size || 12) + 'px ' + font(); c.fillText(s, x, y);
  }
  function arrowTo(c, x1, y1, x2, y2, color, w) {
    const L = Math.hypot(x2 - x1, y2 - y1); if (L < 0.5) return;
    const h = Math.min(10, 0.35 * L), a = Math.atan2(y2 - y1, x2 - x1);
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = w || 2;
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2 - h * 0.8 * Math.cos(a), y2 - h * 0.8 * Math.sin(a)); c.stroke();
    c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4)); c.lineTo(x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4)); c.closePath(); c.fill();
  }
  // a stator ring with main poles (left/right) and auxiliary poles (below/above), lit by their instantaneous currents,
  // and a cage rotor turned to angle rot; the main axis points right, the auxiliary axis down (−90°), so the forward
  // field turns anticlockwise on the screen
  function drawMachine(c, C, x, y, R, im, ia, rot, auxOn) {
    c.lineWidth = 2; c.strokeStyle = C.text;
    c.beginPath(); c.arc(x, y, R, 0, TAU); c.stroke(); c.beginPath(); c.arc(x, y, R * 0.78, 0, TAU); c.stroke();
    const pole = (ang, v, hue, lab, on) => {
      const px = x + R * 0.89 * Math.cos(ang), py = y + R * 0.89 * Math.sin(ang);
      c.fillStyle = on ? 'hsl(' + hue + ' 80% 55% / ' + (0.15 + 0.75 * Math.min(1, Math.abs(v))).toFixed(2) + ')' : C.faint;
      c.beginPath(); c.arc(px, py, R * 0.13, 0, TAU); c.fill();
      c.fillStyle = C.text; c.font = '11px ' + font(); c.textAlign = 'center'; c.fillText(on ? (v >= 0 ? lab : lab + '′') : '', px, py + 4);
    };
    pole(0, im, 215, 'M', true); pole(Math.PI, -im, 215, 'M', true);
    pole(Math.PI / 2, ia, 28, 'A', auxOn); pole(-Math.PI / 2, -ia, 28, 'A', auxOn);
    c.fillStyle = C.surface2; c.beginPath(); c.arc(x, y, R * 0.66, 0, TAU); c.fill();
    for (let k = 0; k < 14; k++) { const a = rot + k * TAU / 14; c.fillStyle = C.muted; c.beginPath(); c.arc(x + R * 0.57 * Math.cos(a), y + R * 0.57 * Math.sin(a), R * 0.045, 0, TAU); c.fill(); }
    c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + R * 0.45 * Math.cos(rot), y + R * 0.45 * Math.sin(rot)); c.stroke();
    c.fillStyle = C.text; c.beginPath(); c.arc(x, y, R * 0.07, 0, TAU); c.fill();
  }
  // the MMF space vector (main along +x, auxiliary along −90°) of the field components at electrical angle th
  const fieldVec = (If, Ib, th) => {
    const af = th + carg(If), ab = -(th + carg(Ib));
    return { fx: cabs(If) * Math.cos(af), fy: cabs(If) * Math.sin(af), bx: cabs(Ib) * Math.cos(ab), by: cabs(Ib) * Math.sin(ab) };
  };
  // mechanical dynamics with a load that cannot drive the shaft and static friction at rest
  function stepShaft(w, T, TL, Tfr, Jt, h) {
    const brake = TL + Tfr;
    if (w === 0 && Math.abs(T) <= brake) return 0;
    const dir = w !== 0 ? Math.sign(w) : Math.sign(T);
    const w2 = w + h * (T - dir * brake) / Jt;
    return (w !== 0 && Math.sign(w2) !== Math.sign(w)) ? 0 : w2;
  }

  /* ================================================================ sp-pulsating */
  Hyper.sim('sp-pulsating', {
    title: 'One winding: a field that pulses but does not turn',
    blurb: `A 0.75 kW, 230 V, 50 Hz, 4-pole cage motor with only its main winding connected. The main poles (M) push the field back and forth along one axis (the long orange arrow): it pulses, it does not turn. The two thinner arrows are the same field seen as two half-size fields turning in opposite directions — their sum is always the pulsating arrow. The graph shows the torque each half would give on its own (forward positive, backward negative) and their difference, the net torque, from full speed backwards to full speed forwards. Everything is drawn 100 times slower than it happens.

**Try this**
- Press *Switch on at rest*. Current flows (about 25 A, several times the running current), the rotor hums at 100 Hz — but the forward and backward torques are equal and the net torque is zero. It will stay there until the thermal protection trips.
- Press *Push forward*: once it turns, the forward field has the smaller slip and wins. The motor runs up to about 1430 rpm under rated load. Stop it and *Push backward*: it runs just as well the other way.
- Raise the load to 100 % and push again gently: at low speed the net torque is small, so a loaded single-phase motor may not accelerate even when pushed.
- Tick *Add an auxiliary winding with a start capacitor* and switch on at rest: the second winding, a quarter-period out of step, makes the field rotate, and the motor starts by itself — always forwards. A centrifugal switch cuts it out at 75 % speed.
- Watch the ripple read-out: even running, the backward field makes a torque that pulses at 100 Hz — the hum of every single-phase motor.`,
    mount(box, kit) {
      const mot = motorOf('cs'), ns = mot.ns, ws = mot.ws;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1] = graphs(box, 1);
      let V = null, on = false, w = 0, th = 0, rot = 0, swOpen = false, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'load', label: 'Load torque, % of rated (constant)', min: 0, max: 150, step: 5, value: 20, unit: '%' },
        { id: 'aux', type: 'check', label: 'Add an auxiliary winding with a start capacitor', value: false },
        { type: 'buttons', items: [{ id: 'on', label: 'Switch on at rest', primary: true }, { id: 'fwd', label: 'Push forward' }, { id: 'back', label: 'Push backward' }, { id: 'off', label: 'Switch off' }] }
      ], id => {
        if (id === 'on') { on = true; w = 0; swOpen = false; }
        if (id === 'fwd') { on = true; w = Math.max(w, 0.12 * ws); swOpen = false; }
        if (id === 'back') { on = true; w = Math.min(w, -0.12 * ws); swOpen = false; }
        if (id === 'off') on = false;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['s', 'Slip: forward · backward'], ['fr', 'Rotor current frequency: from forward · backward field'], ['T', 'Torque: forward − backward = net'], ['I', 'Line current'], ['rip', '100 Hz torque ripple (estimate)']]);
      const pl = kit.plot(g1, { x: { label: 'speed (rpm), negative = backwards', min: -ns, max: ns }, y: { label: 'torque (N·m)' }, legend: true }, 210);
      const Jt = 0.02, Tfr = BASE.Pfw / ws;
      const loop = kit.loop(dt => {
        t += dt;
        const TL = V.load / 100 * TRATED, sub = 40, h = dt / sub;
        let r = null;
        for (let k = 0; k < sub; k++) {
          const s = 1 - w / ws;
          const Zs = V.aux && !swOpen ? capZ(TYPES.cs.Cs, 50) : null;
          r = mot.at(s, Zs, on ? 230 : 0);
          w = stepShaft(w, on ? r.T : 0, TL, Tfr, Jt, h);
          if (V.aux && Math.abs(w) > 0.75 * ws) swOpen = true;
          if (Math.abs(w) < 0.55 * ws) swOpen = false;
        }
        const n = w * 60 / TAU, s = 1 - w / ws;
        ro.set('n', on ? n.toFixed(0) + ' rpm' + (Math.abs(n) < 1 ? ' — standing still, humming' : n > 0 ? ' forwards' : ' backwards') : n.toFixed(0) + ' rpm (switched off)');
        ro.set('s', (100 * s).toFixed(1) + ' % · ' + (100 * (2 - s)).toFixed(1) + ' %');
        ro.set('fr', (s * 50).toFixed(1) + ' Hz · ' + ((2 - s) * 50).toFixed(1) + ' Hz');
        ro.set('T', on ? r.Tf.toFixed(2) + ' − ' + r.Tb.toFixed(2) + ' = ' + r.T.toFixed(2) + ' N·m' : '—');
        ro.set('I', on ? r.I.toFixed(1) + ' A (about 6.9 A at rated load)' : '0 A');
        ro.set('rip', on ? '± ' + (r.ripple / 2).toFixed(1) + ' N·m around the mean' : '—');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const fw = [], bw = [], net = [], ld = [];
          const Zs = V.aux && !swOpen ? capZ(TYPES.cs.Cs, 50) : null;
          for (let i = 0; i <= 120; i++) { const nn = -ns * 0.995 + i * ns * 1.99 / 120, q = mot.at(1 - nn / ns, Zs); fw.push([nn, q.Tf]); bw.push([nn, -q.Tb]); net.push([nn, q.T]); }
          ld.push([-ns, -TL], [0, -TL], [0, TL], [ns, TL]);
          pl.set({ series: [{ pts: fw, label: 'forward field', dash: [4, 3] }, { pts: bw, label: 'backward field', dash: [4, 3] }, { pts: net, label: 'net torque' + (Zs ? ' (with the start winding)' : '') }, { pts: ld, label: 'load (opposes motion)', color: kit.colors().muted, dash: [6, 4] }],
            marks: on ? [{ x: n, y: r.T, label: 'now' }] : [], hlines: [{ y: 0 }] });
        }
        // drawing
        const C = kit.colors(), c = frame(st, 640, 260), slow = 100;
        th += TAU * 50 * dt / slow; rot += w * (dt / slow) * 2;          // drawn as a two-pole machine: rotor at twice its mechanical angle
        const Im = on ? r.ImC : cx(0, 0), Ia = on ? r.IaC : cx(0, 0);
        const im = cabs(Im) > 0 ? Math.cos(th + carg(Im)) * cabs(Im) / 30 : 0, ia = cabs(Ia) > 0 ? Math.cos(th + carg(Ia)) * cabs(Ia) * TYPES.cs.aux.a / 30 : 0;
        const X = 150, Y = 128, R = 100;
        drawMachine(c, C, X, Y, R, im, ia, rot, V.aux && !swOpen && on);
        if (on) {
          const f = fieldVec(r.IfC, r.IbC, th), k = 58 / 20;
          const B = { x: (f.fx + f.bx) * k, y: -(f.fy + f.by) * k };
          arrowTo(c, X, Y, X + f.fx * k, Y - f.fy * k, C.series[2], 2);
          arrowTo(c, X, Y, X + f.bx * k, Y - f.by * k, C.series[3], 2);
          arrowTo(c, X, Y, X + B.x, Y + B.y, 'hsl(22 90% 55%)', 4);
        }
        txt(c, 'main axis →', X + R + 30, Y + 4, C.muted, 'left', 11);
        txt(c, 'drawn as a two-pole machine, 100 × slower', X, 250, C.muted, 'center', 11);
        // the identity and torque bars
        const x0 = 330;
        txt(c, 'a pulsating field = two half fields turning opposite ways', x0, 28, C.text, 'left', 13, '600');
        txt(c, 'B cos θ cos ωt = ½B cos(θ − ωt) + ½B cos(θ + ωt)', x0, 50, C.text, 'left', 13);
        txt(c, '— forward half (anticlockwise)', x0, 72, C.series[2], 'left', 12);
        txt(c, '— backward half (clockwise)', x0, 90, C.series[3], 'left', 12);
        txt(c, '— their sum: the field itself', x0, 108, 'hsl(22 90% 55%)', 'left', 12);
        const bar = (y, v, col, lab) => {
          const sc = 12, x1 = x0 + 120;
          c.fillStyle = C.faint; c.fillRect(x1 - 110, y - 9, 220, 14);
          c.fillStyle = col; const L = clamp(v * sc, -110, 110); c.fillRect(L >= 0 ? x1 : x1 + L, y - 9, Math.abs(L), 14);
          c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(x1, y - 12); c.lineTo(x1, y + 8); c.stroke();
          txt(c, lab + (on ? ' ' + v.toFixed(2) + ' N·m' : ''), x1 + 118, y + 3, C.text, 'left', 11);
        };
        bar(145, on ? r.Tf : 0, C.series[2], 'forward');
        bar(170, on ? -r.Tb : 0, C.series[3], 'backward');
        bar(195, on ? r.T : 0, 'hsl(22 90% 55%)', 'net');
        txt(c, on ? (Math.abs(w) < 1e-6 ? 'At rest the two halves cancel: no starting torque.' : 'Turning: the half moving with the rotor wins.') : 'Switched off.', x0, 230, on && Math.abs(w) < 1e-6 ? C.bad : C.muted, 'left', 12);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-phasors */
  Hyper.sim('sp-phasors', {
    title: 'At standstill: the phase split and the starting torque',
    blurb: `The 0.75 kW motor held at standstill on 230 V, 50 Hz. Left: the phasors — the supply voltage V along the axis, the main-winding current I_m lagging it, the auxiliary current I_a, and the line current I, their sum. The angle α between the two winding currents is what makes the starting torque. Right: the field that the two windings make together, turning; the dotted curve is its path. The graphs show the starting torque and the currents against the start capacitor (or, for a split-phase motor, against the resistance of the auxiliary winding).

**Try this**
- Choose *Main winding only*: I_a is zero, the field just pulses on a line, and the starting torque is zero.
- Choose *Resistance split*: the thin auxiliary winding's current lags less than the main current — α is about 25°, the field path is a thin ellipse, and the torque is about 1.5 × rated at a line current of about 47 A (7 × rated).
- Choose *Capacitor*: with about 120 µF the auxiliary current leads, α passes 90°, the ellipse fattens towards a circle and the torque reaches about 3 × rated — at a line current of only about 25 A.
- Slide the capacitance: too little and the auxiliary current is small; too much and α shrinks while the capacitor voltage and the currents grow. Note the capacitor voltage: it is higher than the 230 V supply.`,
    params: { mode: 'cap' },
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let V = null, th = 0, lastKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Auxiliary circuit', options: [['Main winding only', 'none'], ['Resistance split (thin auxiliary winding)', 'split'], ['Capacitor in series with the auxiliary winding', 'cap']], value: params.mode || 'cap' },
        { id: 'C', label: 'Start capacitance', min: 20, max: 400, step: 5, value: 120, unit: 'µF' },
        { id: 'Ra', label: 'Auxiliary winding resistance', min: 2, max: 20, step: 0.5, value: 8, unit: 'Ω' }
      ], () => { ctl.show('C', V.mode === 'cap'); ctl.show('Ra', V.mode === 'split'); lastKey = ''; });
      V = ctl.values; ctl.show('C', V.mode === 'cap'); ctl.show('Ra', V.mode === 'split');
      const ro = kit.readout(box.side, [['Im', 'Main current I_m'], ['Ia', 'Auxiliary current I_a'], ['I', 'Line current I'], ['al', 'Phase split α (I_a ahead of I_m)'], ['T', 'Starting torque'], ['Vc', 'Capacitor voltage'], ['el', 'Field: forward · backward']]);
      const p1 = kit.plot(g1, { x: { label: 'start capacitance (µF)' }, y: { label: 'starting torque, % of rated', min: 0 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'start capacitance (µF)' }, y: { label: 'current (A) · voltage/10 (V)', min: 0 }, legend: true }, 190);
      const mSplit = R => spMotor(Object.assign({}, BASE, { a: 0.7, R1a: R, X1a: 1.5 }));
      const mCap = motorOf('cs');
      const point = () => {
        if (V.mode === 'none') return mCap.at(1, null);
        if (V.mode === 'split') return mSplit(V.Ra).at(1, cx(0, 0));
        return mCap.at(1, capZ(V.C * 1e-6, 50));
      };
      const loop = kit.loop(dt => {
        const r = point();
        const key = V.mode + '|' + V.C + '|' + V.Ra;
        if (key !== lastKey) {
          lastKey = key;
          const tq = [], cur = [], ia = [], vc = [], xs = [];
          const xl = V.mode === 'split' ? 'auxiliary winding resistance (Ω)' : 'start capacitance (µF)';
          for (let i = 0; i <= 80; i++) {
            let q, x;
            if (V.mode === 'split') { x = 2 + 18 * i / 80; q = mSplit(x).at(1, cx(0, 0)); }
            else { x = 20 + 380 * i / 80; q = mCap.at(1, capZ(x * 1e-6, 50)); }
            xs.push(x); tq.push([x, 100 * q.T / TRATED]); cur.push([x, q.I]); ia.push([x, q.Ia]); vc.push([x, q.Vcap / 10]);
          }
          const xNow = V.mode === 'split' ? V.Ra : V.C;
          const on = V.mode !== 'none';
          p1.set({ x: { label: xl }, series: on ? [{ pts: tq, label: 'starting torque' }] : [], marks: on ? [{ x: xNow, y: 100 * r.T / TRATED, label: 'now' }] : [], hlines: [{ y: 100, label: 'rated torque' }] });
          p2.set({ x: { label: xl }, series: on ? [{ pts: cur, label: 'line current' }, { pts: ia, label: 'auxiliary current' }].concat(V.mode === 'cap' ? [{ pts: vc, label: 'capacitor voltage ÷ 10', dash: [5, 4] }] : []) : [], marks: on ? [{ x: xNow, y: r.I }] : [] });
        }
        ro.set('Im', r.Im.toFixed(1) + ' A, lagging V by ' + (-carg(r.ImC) * 180 / Math.PI).toFixed(0) + '°');
        ro.set('Ia', V.mode === 'none' ? '0 (open)' : r.Ia.toFixed(1) + ' A, ' + (carg(r.IaC) >= 0 ? 'leading V by ' + (carg(r.IaC) * 180 / Math.PI).toFixed(0) : 'lagging V by ' + (-carg(r.IaC) * 180 / Math.PI).toFixed(0)) + '°');
        ro.set('I', r.I.toFixed(1) + ' A = ' + (r.I / 6.85).toFixed(1) + ' × the 6.9 A running current, pf ' + r.pf.toFixed(2));
        ro.set('al', V.mode === 'none' ? '—' : r.alpha.toFixed(0) + '°  (sin α = ' + Math.sin(r.alpha * Math.PI / 180).toFixed(2) + ')');
        ro.set('T', r.T.toFixed(2) + ' N·m = ' + (100 * r.T / TRATED).toFixed(0) + ' % of rated');
        ro.set('Vc', V.mode === 'cap' ? r.Vcap.toFixed(0) + ' V rms (' + (r.Vcap * Math.SQRT2).toFixed(0) + ' V peak)' : '—');
        ro.set('el', r.If.toFixed(1) + ' · ' + r.Ib.toFixed(1) + ' A (equal = pulsating, backward 0 = circular)');
        // drawing
        const C = kit.colors(), c = frame(st, 640, 280);
        th += TAU * 50 * dt / 100;
        // phasor diagram
        const ox = 150, oy = 150, S = 110 / 50, sc = z => [ox + z.re * S, oy - z.im * S];
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(ox - 120, oy); c.lineTo(ox + 140, oy); c.moveTo(ox, oy - 125); c.lineTo(ox, oy + 125); c.stroke();
        arrowTo(c, ox, oy, ox + 130, oy, C.text, 2); txt(c, 'V = 230 V', ox + 132, oy - 8, C.text, 'right', 12);
        const pm = sc(r.ImC), pa = sc(r.IaC), pi = sc(r.IC);
        if (V.mode !== 'none') {
          c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
          c.beginPath(); c.moveTo(pm[0], pm[1]); c.lineTo(pi[0], pi[1]); c.stroke(); c.setLineDash([]);
          arrowTo(c, ox, oy, pa[0], pa[1], C.series[1], 3); txt(c, 'I_a', pa[0] + 8, pa[1] - 6, C.series[1], 'left', 13, '600');
          // the angle α between the currents
          const a1 = -carg(r.ImC), a2 = -carg(r.IaC);
          c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.arc(ox, oy, 34, Math.min(a1, a2), Math.max(a1, a2)); c.stroke();
          const am = (a1 + a2) / 2; txt(c, 'α = ' + r.alpha.toFixed(0) + '°', ox + 50 * Math.cos(am), oy + 50 * Math.sin(am) + 4, C.warn, 'center', 12, '600');
        }
        arrowTo(c, ox, oy, pm[0], pm[1], 'hsl(215 80% 55%)', 3); txt(c, 'I_m', pm[0] + 8, pm[1] + 14, 'hsl(215 80% 55%)', 'left', 13, '600');
        arrowTo(c, ox, oy, pi[0], pi[1], C.accent, 2); txt(c, 'I', pi[0] + 8, pi[1] + 4, C.accent, 'left', 13, '600');
        txt(c, 'phasors (current scale 50 A = 110 px)', ox, 272, C.muted, 'center', 11);
        // the field: stator circle, axes, the locus and the moving vector
        const fx0 = 470, fy0 = 140, FR = 105, maxF = Math.max(1, r.If + r.Ib), k = 95 / maxF;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(fx0, fy0, FR, 0, TAU); c.stroke();
        c.strokeStyle = 'hsl(215 80% 55% / .5)'; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(fx0 - FR, fy0); c.lineTo(fx0 + FR, fy0); c.stroke();
        c.strokeStyle = 'hsl(28 90% 55% / .5)'; c.beginPath(); c.moveTo(fx0, fy0 - FR); c.lineTo(fx0, fy0 + FR); c.stroke(); c.setLineDash([]);
        txt(c, 'main axis', fx0 + FR - 2, fy0 - 6, 'hsl(215 80% 55%)', 'right', 11); txt(c, 'aux. axis', fx0 + 4, fy0 + FR - 6, 'hsl(28 90% 55%)', 'left', 11);
        c.strokeStyle = C.muted; c.setLineDash([2, 3]); c.lineWidth = 1.2; c.beginPath();
        for (let i = 0; i <= 90; i++) { const f = fieldVec(r.IfC, r.IbC, i * TAU / 90), x = fx0 + (f.fx + f.bx) * k, y = fy0 - (f.fy + f.by) * k; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke(); c.setLineDash([]);
        const f = fieldVec(r.IfC, r.IbC, th);
        arrowTo(c, fx0, fy0, fx0 + (f.fx + f.bx) * k, fy0 - (f.fy + f.by) * k, 'hsl(22 90% 55%)', 4);
        const ratio = r.If + r.Ib > 0 ? (r.If - r.Ib) / (r.If + r.Ib) : 0;
        txt(c, V.mode === 'none' ? 'pulsating: no rotation' : 'field path: minor/major axis = ' + Math.abs(ratio).toFixed(2) + (Math.abs(ratio) > 0.9 ? ' (nearly circular)' : ''), fx0, 272, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-lab */
  Hyper.sim('sp-lab', {
    title: 'A single-phase motor lab: start, run and compare',
    blurb: `The same 0.75 kW (1 hp), 230 V, 50 Hz, 4-pole motor built four ways — split-phase, capacitor-start, capacitor-start-capacitor-run and PSC — driving a load with some inertia (a compressor flywheel). On the left the motor with its main (M) and auxiliary (A) poles lit by their currents and the field arrow; on the right its circuit, with current flowing as dots. The left graph is torque against speed with the start circuit in (dashed) and running; the right one the line current and speed since switch-on.

**Try this**
- *Split-phase*, rated constant load: switch on. A big current (about 47 A), a modest start, and the centrifugal switch opening at 1125 rpm (75 %) — the curve jumps from the dashed to the solid line.
- *Capacitor-start*, same load: twice the starting torque at half the current. The start capacitor is in circuit for well under a second.
- *PSC* with the constant rated load: it cannot start (starting torque about 40 % of rated). Choose the fan load: now it starts gently. That is why PSC motors drive fans and blowers.
- *Capacitor-start-run*: compare the running current, power factor and efficiency with the capacitor-start motor at the same load (about 4.3 A at 0.96 and 80 % against 6.9 A at 0.70 and 68 %) and the 100 Hz ripple.
- Set the fault *Switch stuck closed* and start a capacitor-start motor: the start circuit stays in, the auxiliary winding heats fast and the thermal protector trips. *Start capacitor open*: it hums at standstill.`,
    params: { type: 'cs' },
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.43, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let V = null, mot = motorOf(params.type || 'cs'), on = false, w = 0, th = 0, rot = 0, startIn = true, tOn = 0, tStart = 0, auxT = 40, tripped = '', lastPlot = -1, t = 0, ph1 = 0, ph2 = 0;
      let trace = [];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Motor type', options: Object.entries(TYPES).map(([k, v]) => [v.name, k]), value: params.type || 'cs' },
        { id: 'loadType', type: 'select', label: 'Load', options: [['Constant torque (compressor, conveyor)', 'const'], ['Fan or centrifugal pump (torque ∝ speed²)', 'fan']], value: 'const' },
        { id: 'load', label: 'Load, % of rated torque (fan: at 1430 rpm)', min: 0, max: 150, step: 5, value: 100, unit: '%' },
        { id: 'fault', type: 'select', label: 'Fault', options: [['None', 'none'], ['Centrifugal switch stuck closed', 'stuck'], ['Start capacitor open (or switch open)', 'capopen'], ['Run capacitor lost 40 % of its µF', 'weak']], value: 'none' },
        { type: 'buttons', items: [{ id: 'on', label: 'Switch on', primary: true }, { id: 'off', label: 'Switch off' }, { id: 'cool', label: 'Cool down' }] }
      ], id => {
        if (id === 'type') { mot = motorOf(V.type); on = false; w = 0; }
        if (id === 'on') { on = true; startIn = true; tOn = 0; tStart = 0; tripped = ''; trace = []; }
        if (id === 'off') on = false;
        if (id === 'cool') { auxT = 40; tripped = ''; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed · slip'], ['T', 'Motor torque · load torque'], ['I', 'Line current (main · auxiliary)'], ['pf', 'Power factor · efficiency · input'], ['sw', 'Start circuit'], ['vc', 'Capacitor voltage'], ['aux', 'Auxiliary winding temperature'], ['rip', 'Field backward/forward · 100 Hz ripple']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'time since switch-on (s)', min: 0 }, y: { label: 'line current (A) · speed ÷ 50 (rpm)', min: 0 }, legend: true }, 200);
      const Jt = 0.03, ws = mot.ws;
      const Zfor = start => {
        const k = V.type, tp = TYPES[k], f = V.fault;
        if (start) {
          if (f === 'capopen') return tp.Cr ? capZ(tp.Cr * (f === 'weak' ? 0.6 : 1), 50) : null;
          if (k === 'split') return cx(0, 0);
          return capZ(tp.Cs + tp.Cr * (f === 'weak' ? 0.6 : 1), 50);
        }
        return tp.Cr ? capZ(tp.Cr * (f === 'weak' ? 0.6 : 1), 50) : null;
      };
      const loadT = ww => { const T0 = V.load / 100 * TRATED; return V.loadType === 'fan' ? T0 * Math.pow(Math.abs(ww) / (1430 * TAU / 60), 2) : T0; };
      const loop = kit.loop(dt => {
        t += dt;
        const tp = TYPES[V.type], hasSwitch = tp.sw, sub = 40, h = dt / sub;
        let r = null;
        for (let k = 0; k < sub; k++) {
          const inStart = hasSwitch && (startIn || V.fault === 'stuck');
          const Zs = inStart ? Zfor(true) : Zfor(false);
          r = mot.at(1 - w / ws, Zs, on ? 230 : 0);
          w = stepShaft(w, on ? r.T : 0, V.loadType === 'fan' ? loadT(w) : (Math.abs(w) > 0 ? loadT(w) : loadT(w)), BASE.Pfw / ws, Jt, h);
          if (w < 0) w = 0;
          if (hasSwitch) { if (w > 0.75 * ws) startIn = false; else if (w < 0.55 * ws) startIn = true; }
          // the auxiliary winding: about 16 K/s at 22 A for the thin split-phase winding, cooling with a 2-minute time constant
          const kH = V.type === 'split' ? 0.033 : 0.06;
          const heat = on && inStart ? kH * r.Ia * r.Ia : (on && tp.Cr ? 0.004 * r.Ia * r.Ia : 0);
          auxT += h * (heat - (auxT - 40) / 120);
          if (on && inStart) tStart += h;
        }
        if (on) tOn += dt;
        if (auxT > 180 && on) { on = false; tripped = 'thermal protector tripped at ' + auxT.toFixed(0) + ' °C'; }
        const inStart = hasSwitch && (startIn || V.fault === 'stuck'), n = w * 60 / TAU, s = 1 - w / ws;
        if (on && tOn < 6) trace.push([tOn, r.I, n / 50]);
        ro.set('n', n.toFixed(0) + ' rpm · ' + (100 * s).toFixed(1) + ' %' + (on && w === 0 && tOn > 0.3 ? ' — stalled' : ''));
        ro.set('T', (on ? r.T : 0).toFixed(2) + ' · ' + loadT(w).toFixed(2) + ' N·m');
        ro.set('I', on ? r.I.toFixed(1) + ' A (' + r.Im.toFixed(1) + ' · ' + r.Ia.toFixed(1) + ')' : '0 A');
        ro.set('pf', on ? r.pf.toFixed(2) + ' · ' + (100 * r.eff).toFixed(1) + ' % · ' + r.Pin.toFixed(0) + ' W' : '—');
        ro.set('sw', !hasSwitch ? 'none (PSC: the run capacitor stays in)' : (inStart ? 'IN' + (V.fault === 'stuck' ? ' — switch stuck!' : '') : 'out (switch opened at 75 % speed)') + (tStart > 0 ? ', in for ' + tStart.toFixed(2) + ' s' : ''));
        ro.set('vc', on && r.Vcap > 0 ? r.Vcap.toFixed(0) + ' V rms' : '—');
        ro.set('aux', auxT.toFixed(0) + ' °C' + (tripped ? ' — ' + tripped : auxT > 130 ? ' — overheating' : ''));
        ro.set('rip', on ? (r.If > 0 ? (r.Ib / r.If).toFixed(2) : '—') + ' · ± ' + (r.ripple / 2).toFixed(1) + ' N·m' : '—');
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          const run = [], strt = [], ld = [];
          const Zr = Zfor(false), Zst = Zfor(true);
          for (let i = 0; i <= 100; i++) {
            const nn = 1499 * i / 100, q = mot.at(1 - nn / 1500, Zr); run.push([nn, Math.max(0, q.T)]);
            if (hasSwitch) { const q2 = mot.at(1 - nn / 1500, Zst); strt.push([nn, Math.max(0, q2.T)]); }
            ld.push([nn, loadT(nn * TAU / 60)]);
          }
          const ser = [];
          if (hasSwitch) ser.push({ pts: strt, label: 'start circuit in', dash: [5, 4] });
          ser.push({ pts: run, label: hasSwitch ? 'running (start circuit out)' : 'with the run capacitor' });
          ser.push({ pts: ld, label: 'load', color: kit.colors().muted, dash: [2, 3] });
          p1.set({ series: ser, marks: on ? [{ x: n, y: Math.max(0, r.T), label: 'now' }] : [], vlines: hasSwitch ? [{ x: 1125, label: 'switch' }] : [], hlines: [{ y: TRATED, label: 'rated' }] });
          p2.set({ x: { label: 'time since switch-on (s)', min: 0, max: Math.max(1, trace.length ? trace[trace.length - 1][0] : 1) }, series: [{ pts: trace.map(p => [p[0], p[1]]), label: 'line current (A)' }, { pts: trace.map(p => [p[0], p[2]]), label: 'speed ÷ 50 (rpm)' }] });
        }
        // drawing
        const C = kit.colors(), c = frame(st, 640, 270), slow = 100;
        th += TAU * 50 * dt / slow; rot += w * 2 * dt / slow;
        const Im = on ? r.ImC : cx(0, 0), Ia = on ? r.IaC : cx(0, 0), a = tp.aux.a;
        const im = Math.cos(th + carg(Im)) * cabs(Im) / 25, ia = Math.cos(th + carg(Ia)) * cabs(Ia) * a / 25;
        const auxOn = on && (inStart || tp.Cr > 0) && cabs(Ia) > 0.01;
        drawMachine(c, C, 120, 128, 96, im, ia, rot, auxOn);
        if (on) { const f = fieldVec(r.IfC, r.IbC, th), k = 60 / 10; arrowTo(c, 120, 128, 120 + clamp((f.fx + f.bx) * k, -90, 90), 128 - clamp((f.fy + f.by) * k, -90, 90), 'hsl(22 90% 55%)', 4); }
        txt(c, TYPES[V.type].name, 120, 20, C.text, 'center', 13, '600');
        txt(c, 'drawn as two-pole, 100 × slower', 120, 258, C.muted, 'center', 11);
        // the circuit
        const xL = 250, xR = 620, yL = 42, yN = 238, xM = 290, xS = 410, xC = 480, xA = 445, yB = 160;
        S.wire(c, [[xL, yL], [xR, yL]]); S.wire(c, [[xL, yN], [xR, yN]]);
        txt(c, 'L  230 V', xL, yL - 10, C.text, 'left', 12, '600'); txt(c, 'N', xL, yN + 16, C.text, 'left', 12, '600');
        S.inductor(c, xM, yL, xM, yN, { label: 'main', value: 'U1–U2' });
        S.node(c, xM, yL); S.node(c, xM, yN);
        const hot = auxT > 130 ? C.bad : null;
        if (hasSwitch) {
          S.switch(c, xS, yL, xS, 100, { closed: inStart, label: 'centrifugal', value: inStart ? 'closed' : 'open', color: V.fault === 'stuck' ? C.bad : undefined });
          if (V.type === 'split') S.wire(c, [[xS, 100], [xS, yB], [xA, yB]]);
          else { S.capacitor(c, xS, 100, xS, yB - 6, { label: 'start', value: (tp.Cs * 1e6).toFixed(0) + ' µF', color: V.fault === 'capopen' ? C.faint : undefined }); S.wire(c, [[xS, yB - 6], [xS, yB], [xA, yB]]); }
          S.node(c, xS, yL);
        }
        if (tp.Cr) {
          S.capacitor(c, xC, yL, xC, yB - 6, { label: 'run', value: (tp.Cr * 1e6 * (V.fault === 'weak' ? 0.6 : 1)).toFixed(0) + ' µF' });
          S.wire(c, [[xC, yB - 6], [xC, yB], [xA, yB]]); S.node(c, xC, yL);
        }
        S.inductor(c, xA, yB, xA, yN, { label: 'aux.', value: 'Z1–Z2', color: hot || undefined }); S.node(c, xA, yB); S.node(c, xA, yN);
        // moving charges: speed ∝ current
        ph1 += dt * 6 * cabs(Im); ph2 += dt * 6 * cabs(Ia) * 1.5;
        if (on) {
          S.flow(c, [[xM, yL + 4], [xM, yN - 4]], ph1, { color: 'hsl(215 80% 60%)' });
          const pathA = inStart && hasSwitch ? [[xS, yL + 4], [xS, yB], [xA, yB], [xA, yN - 4]] : tp.Cr ? [[xC, yL + 4], [xC, yB], [xA, yB], [xA, yN - 4]] : null;
          if (pathA && cabs(Ia) > 0.05) S.flow(c, pathA, ph2, { color: 'hsl(28 90% 55%)' });
        }
        // auxiliary winding thermometer
        const tx = 600, tt = clamp((auxT - 20) / 180, 0, 1);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(tx - 5, 70, 10, 130); c.fillStyle = auxT > 130 ? C.bad : 'hsl(20 85% 55%)'; c.fillRect(tx - 4, 200 - 128 * tt, 8, 128 * tt);
        txt(c, 'aux.', tx, 62, C.muted, 'center', 10); txt(c, auxT.toFixed(0) + ' °C', tx, 214, C.muted, 'center', 10);
        if (tripped) txt(c, 'Thermal protector tripped — let it cool', 435, 262, C.bad, 'center', 12, '600');
        else if (on && w === 0 && tOn > 0.4) txt(c, 'Humming at standstill — not enough starting torque', 435, 262, C.bad, 'center', 12, '600');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-wiring */
  const DEVICES = {
    centrifugal: { name: 'Centrifugal switch (on the shaft)', sense: 'speed' },
    current: { name: 'Current relay (coil in series with the main winding)', sense: 'main current' },
    potential: { name: 'Potential relay (coil across the auxiliary winding)', sense: 'auxiliary-winding voltage' },
    ptc: { name: 'PTC thermistor starter', sense: 'its own temperature' }
  };
  const ptcR = T => Math.min(20000, 12 * Math.exp(Math.max(0, T - 100) / 4));   // a PTC starter: about 12 Ω cold, kilohms above about 120 °C
  Hyper.sim('sp-wiring', {
    title: 'Start switches, relays and reversing',
    blurb: `The 0.75 kW capacitor-start (or capacitor-start-run) motor with four ways of taking the start capacitor out, and a reversing connection. The circuit shows the terminals (IEC marking U1–U2 main, Z1–Z2 auxiliary; NEMA T1–T4 and T5–T8), the start device and the current flowing. The left graph shows speed and whether the start contact is closed; the right one the quantity the chosen device senses, with its operating levels.

**Try this**
- *Centrifugal switch*: it opens at 75 % of synchronous speed (1125 rpm) and would reclose below about 55 %.
- *Current relay* (as on small refrigeration compressors): its coil carries the main current. The 25 A starting current pulls the contact in; as the motor speeds up the current falls, and below 16 A it drops out.
- *Potential relay* (air-conditioning compressors): its normally closed contact opens when the voltage across the auxiliary winding — rising with speed well above the 230 V supply — passes 300 V; the running voltage holds it open.
- *PTC starter* (refrigerators): the thermistor heats in well under a second, jumps to kilohms and chokes the start current; a few watts keep it hot while the motor runs. Press *Stop* and *Start* again at once: it is still hot, so the motor only hums (a real one trips on its overload) — press *Wait 5 minutes* and it starts again.
- Set *Direction* to reversed: the auxiliary winding's ends swap (Z1 ↔ Z2, or T5 ↔ T8) and the motor starts the other way. Swapping L and N changes nothing.`,
    params: { type: 'cs', relay: 'centrifugal' },
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      let V = null, mot = motorOf(params.type || 'cs'), on = false, u = 0, th = 0, rot = 0, closed = true, t = 0, tOn = 0, tIn = 0, ptcT = 25, lastPlot = -1, ph1 = 0, ph2 = 0, trace = [];
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Motor', options: [['Capacitor-start', 'cs'], ['Capacitor-start, capacitor-run', 'cscr']], value: params.type || 'cs' },
        { id: 'dev', type: 'select', label: 'Start device', options: Object.entries(DEVICES).map(([k, d]) => [d.name, k]), value: params.relay || 'centrifugal' },
        { id: 'dir', type: 'select', label: 'Direction', options: [['Forward (Z1 to the capacitor)', 1], ['Reversed (auxiliary ends swapped)', -1]], value: 1 },
        { id: 'load', label: 'Load, % of rated torque (constant)', min: 0, max: 120, step: 5, value: 80, unit: '%' },
        { type: 'buttons', items: [{ id: 'on', label: 'Start', primary: true }, { id: 'off', label: 'Stop' }, { id: 'wait', label: 'Wait 5 minutes' }] }
      ], id => {
        if (id === 'wait') { ptcT = 25 + (ptcT - 25) * Math.exp(-300 / 90); if (!on) u = 0; }
        if (id === 'type') { mot = motorOf(V.type); on = false; u = 0; }
        if (id === 'on') { on = true; tOn = 0; tIn = 0; trace = []; }
        if (id === 'off') on = false;
        if (id === 'dir' && on) on = false;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed and direction'], ['c', 'Start contact'], ['sig', 'Sensed quantity'], ['tin', 'Start capacitor in circuit for'], ['I', 'Line current · main current']]);
      const p1 = kit.plot(g1, { x: { label: 'time since start (s)', min: 0 }, y: { label: '% ', min: 0, max: 110 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'time since start (s)', min: 0 }, y: { label: 'sensed quantity', min: 0 }, legend: true }, 190);
      const ws = mot.ws, Jt = 0.03;
      const PICK = { current: [20, 16], potential: [300, 120] };        // relay operating levels: current (A) pick-up/drop-out; voltage (V) pick-up/drop-out
      const loop = kit.loop(dt => {
        t += dt;
        const tp = TYPES[V.type], sub = 40, h = dt / sub;
        let r = null, sig = 0;
        for (let k = 0; k < sub; k++) {
          // the start branch: start capacitor (+ the PTC's resistance) in parallel with the run capacitor, if any
          const Rptc = V.dev === 'ptc' ? ptcR(ptcT) : 0;
          const Zst = add(capZ(tp.Cs, 50), cx(Rptc, 0));
          let Zs;
          if (closed) Zs = tp.Cr ? par(Zst, capZ(tp.Cr, 50)) : Zst;
          else Zs = tp.Cr ? capZ(tp.Cr, 50) : null;
          r = mot.at(1 - u / ws, Zs, on ? 230 : 0);
          u = stepShaft(u, on ? r.T : 0, V.load / 100 * TRATED, BASE.Pfw / ws, Jt, h);
          if (u < 0) u = 0;
          // the start devices
          if (V.dev === 'centrifugal') { sig = 100 * u / ws; if (closed && u > 0.75 * ws) closed = false; else if (!closed && u < 0.55 * ws) closed = true; }
          else if (V.dev === 'current') { sig = on ? r.Im : 0; if (!closed && sig > PICK.current[0]) closed = true; else if (closed && sig < PICK.current[1]) closed = false; }
          else if (V.dev === 'potential') { sig = on ? r.Vaux : 0; if (closed && sig > PICK.potential[0]) closed = false; else if (!closed && sig < PICK.potential[1]) closed = true; }
          else {
            // PTC pill (about 5 J/K, cooling time constant about 90 s): heated by the start-branch current, it
            // switches to a high resistance near 120 °C and holds itself there on a few watts while the motor runs
            closed = true;
            const Ist = on ? cabs(div(mul(r.IaC, Zs), Zst)) : 0;
            ptcT = clamp(ptcT + h * (Ist * Ist * Rptc / 5 - (ptcT - 25) / 90), 25, 200); sig = ptcT;
          }
          if (on && closed && (V.dev !== 'ptc' || ptcT < 110)) tIn += h;
        }
        if (V.dev === 'current' && !on) closed = false;
        if (V.dev === 'potential' && !on) closed = true;
        if (V.dev === 'centrifugal' && !on && u < 0.55 * ws) closed = true;
        if (on) tOn += dt;
        const n = u * 60 / TAU, effClosed = closed && (V.dev !== 'ptc' || ptcT < 110);
        if (on && tOn < 5) trace.push([tOn, 100 * u / ws, effClosed ? 100 : 0, sig]);
        ro.set('n', n.toFixed(0) + ' rpm ' + (u > 0 ? (V.dir > 0 ? '(forward ↺)' : '(reverse ↻)') : '') + (on && u === 0 && tOn > 0.4 ? ' — humming, not starting' : ''));
        ro.set('c', effClosed ? 'closed: start capacitor in' : 'open: start capacitor out');
        const sigTxt = V.dev === 'centrifugal' ? (100 * u / ws).toFixed(0) + ' % speed (opens at 75 %)' : V.dev === 'current' ? sig.toFixed(1) + ' A (in above 20 A, out below 16 A)' : V.dev === 'potential' ? sig.toFixed(0) + ' V (opens above 300 V)' : ptcT.toFixed(0) + ' °C (high resistance above about 120 °C)';
        ro.set('sig', sigTxt);
        ro.set('tin', tIn.toFixed(2) + ' s');
        ro.set('I', on ? r.I.toFixed(1) + ' A · ' + r.Im.toFixed(1) + ' A' : '0 A');
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          const tm = Math.max(1, trace.length ? trace[trace.length - 1][0] : 1);
          p1.set({ x: { label: 'time since start (s)', min: 0, max: tm }, series: [{ pts: trace.map(p => [p[0], p[1]]), label: 'speed, % of synchronous' }, { pts: trace.map(p => [p[0], p[2]]), label: 'start contact closed', dash: [5, 4] }] });
          const lab = V.dev === 'centrifugal' ? 'speed (%)' : V.dev === 'current' ? 'main current (A)' : V.dev === 'potential' ? 'auxiliary-winding voltage (V)' : 'PTC temperature (°C)';
          const hl = V.dev === 'centrifugal' ? [{ y: 75, label: 'opens' }, { y: 55, label: 'recloses' }] : V.dev === 'current' ? [{ y: 20, label: 'pick-up' }, { y: 16, label: 'drop-out' }] : V.dev === 'potential' ? [{ y: 300, label: 'pick-up (opens)' }, { y: 120, label: 'drop-out' }] : [{ y: 120, label: 'switching temperature' }];
          p2.set({ x: { label: 'time since start (s)', min: 0, max: tm }, y: { label: lab, min: 0 }, series: [{ pts: trace.map(p => [p[0], p[3]]), label: lab }], hlines: hl });
        }
        // drawing: supply, main winding with (current relay coil), start branch with the device, run capacitor, auxiliary winding with its terminals
        const C = kit.colors(), c = frame(st, 640, 280), slow = 100;
        th += TAU * 50 * dt / slow; rot += V.dir * u * 2 * dt / slow;
        const xL = 40, xR = 470, yL = 40, yN = 250, xM = 90, xS = 230, xC = 320, xA = 400, yB = 170;
        S.wire(c, [[xL, yL], [xR, yL]]); S.wire(c, [[xL, yN], [xR, yN]]);
        txt(c, 'L', xL - 12, yL + 4, C.text, 'center', 13, '600'); txt(c, 'N', xL - 12, yN + 4, C.text, 'center', 13, '600');
        const devCol = effClosed ? C.ok : C.muted;
        if (V.dev === 'current') {
          c.strokeStyle = devCol; c.lineWidth = 2; c.strokeRect(xM - 9, 62, 18, 30); txt(c, 'relay coil', xM + 14, 80, C.muted, 'left', 11);
          S.wire(c, [[xM, yL], [xM, 62]]); S.inductor(c, xM, 92, xM, yN, { label: 'main', value: 'U1–U2 · T1–T4' });
        } else S.inductor(c, xM, yL, xM, yN, { label: 'main', value: 'U1–U2 · T1–T4' });
        S.node(c, xM, yL); S.node(c, xM, yN);
        // the start branch
        if (V.dev === 'ptc') {
          S.resistor(c, xS, yL, xS, 105, { label: 'PTC', value: ptcT.toFixed(0) + ' °C', color: ptcT >= 110 ? C.bad : undefined });
        } else {
          S.switch(c, xS, yL, xS, 105, { closed: effClosed, label: V.dev === 'centrifugal' ? 'centrifugal' : V.dev === 'current' ? 'relay NO' : 'relay NC', color: devCol });
        }
        S.capacitor(c, xS, 110, xS, yB - 10, { label: 'start', value: (tp.Cs * 1e6).toFixed(0) + ' µF' });
        S.wire(c, [[xS, yB - 10], [xS, yB], [xA, yB]]); S.node(c, xS, yL);
        if (tp.Cr) { S.capacitor(c, xC, yL, xC, yB - 10, { label: 'run', value: (tp.Cr * 1e6).toFixed(0) + ' µF' }); S.wire(c, [[xC, yB - 10], [xC, yB]]); S.node(c, xC, yL); S.node(c, xC, yB); }
        // the auxiliary winding, drawn crossed when its ends are swapped
        const zTop = V.dir > 0 ? 'Z1 · T5' : 'Z2 · T8', zBot = V.dir > 0 ? 'Z2 · T8' : 'Z1 · T5';
        S.wire(c, [[xA, yB], [xA, yB + 8]]);
        if (V.dir < 0) { S.wire(c, [[xA, yB + 8], [xA + 24, yB + 20]]); S.wire(c, [[xA + 24, yN - 12], [xA, yN]]); S.inductor(c, xA + 24, yB + 20, xA + 24, yN - 12, { label: 'aux.', value: zTop + ' ↔ ' + zBot }); }
        else S.inductor(c, xA, yB + 8, xA, yN, { label: 'aux.', value: zTop + ' – ' + zBot });
        S.node(c, xA, yB); S.node(c, xA, yN);
        if (V.dev === 'potential') {
          c.strokeStyle = effClosed ? C.muted : C.ok; c.lineWidth = 2; c.strokeRect(xA + 50, yB + 25, 18, 30); txt(c, 'relay coil', xA + 59, yB + 70, C.muted, 'center', 11);
          S.wire(c, [[xA, yB], [xA + 59, yB], [xA + 59, yB + 25]]); S.wire(c, [[xA + 59, yB + 55], [xA + 59, yN]]); S.node(c, xA + 59, yN);
        }
        ph1 += dt * 6 * (on ? r.Im : 0); ph2 += dt * 9 * (on ? r.Ia : 0);
        if (on) {
          S.flow(c, [[xM, yL + 4], [xM, yN - 4]], ph1, { color: 'hsl(215 80% 60%)' });
          const pa = effClosed ? [[xS, yL + 4], [xS, yB], [xA, yB], [xA, yN - 4]] : tp.Cr ? [[xC, yL + 4], [xC, yB], [xA, yB], [xA, yN - 4]] : null;
          if (pa && r.Ia > 0.05) S.flow(c, pa, ph2, { color: 'hsl(28 90% 55%)' });
        }
        // the motor and its direction
        const Im = on ? r.ImC : cx(0, 0), Ia = on ? r.IaC : cx(0, 0);
        const im = Math.cos(th + carg(Im)) * cabs(Im) / 25, ia = V.dir * Math.cos(th + carg(Ia)) * cabs(Ia) * tp.aux.a / 25;
        drawMachine(c, C, 560, 130, 70, im, ia, rot, on && effClosed || (on && tp.Cr > 0));
        if (u > 1) { c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); const a0 = -2.2, a1 = -0.9; if (V.dir > 0) c.arc(560, 130, 84, a1, a0, true); else c.arc(560, 130, 84, a0, a1); c.stroke(); const ae = V.dir > 0 ? a0 : a1, ex = 560 + 84 * Math.cos(ae), ey = 130 + 84 * Math.sin(ae); kit.dot(c, ex, ey, 4, C.accent); }
        txt(c, V.dir > 0 ? 'forward' : 'reversed', 560, 232, C.text, 'center', 12, '600');
        txt(c, DEVICES[V.dev].name, 250, 272, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-psc-fan */
  // a reversible PSC blower motor (two identical windings), about 150 W at 1290 rpm on 230 V, 50 Hz, 4 poles, with a
  // high-resistance rotor for speed control by voltage; 6 µF run capacitor
  const PSCFAN = { V: 230, Vn: 230, f: 50, poles: 4, R1m: 25, X1m: 20, R2: 70, X2: 18, Xm: 450, a: 1, R1a: 25, X1a: 20, Pfw: 5, Pfe: 15 };
  const FAN_K = 6.213e-5;                                   // fan torque = k ω² (N·m with ω in rad/s): 150 W at 1290 rpm
  Hyper.sim('sp-psc-fan', {
    title: 'A PSC blower: speed taps, rotor loss and the run capacitor',
    blurb: `A reversible PSC blower motor (two identical windings, a 6 µF run capacitor) driving a centrifugal fan. The left graph shows the motor's torque against speed on each tap, with the fan's curve rising with the square of speed: the motor runs where they cross. The right graph shows, at the present voltage, how the currents and the 100 Hz torque ripple depend on the run capacitor's value.

**Try this**
- Switch between *High*, *Medium* and *Low*: the torque curve shrinks with the square of the voltage and the operating point slides down the fan curve (about 1290, 1190 and 1070 rpm). Air flow follows speed; the fan's power follows its cube.
- Watch the rotor loss and the efficiency: on the low tap the rotor turns almost 30 % of the air-gap power into heat and efficiency falls from about 69 % to about 53 %.
- Use the *Triac* setting and lower the voltage: the speed falls steadily (about 750 rpm at 110 V) while the rotor loss eats an ever larger share of the input.
- Turn the run capacitor down to 3 µF (an ageing capacitor): the speed drops, the backward field and the 100 Hz ripple grow, and the starting torque falls. At 0.5 µF it barely starts. Too large a capacitor also unbalances the field.
- Flip *Direction*: the capacitor moves to the other winding, which becomes the auxiliary one, and the fan turns the other way (a real blower would then move little air).`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      const mot = spMotor(PSCFAN), ws = mot.ws;
      let V = null, on = true, w = 0.85 * ws, th = 0, rot = 0, fanAng = 0, lastPlot = -1, lastKey = '', t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'tap', type: 'select', label: 'Speed', options: [['High (230 V)', 230], ['Medium tap (≈190 V)', 190], ['Low tap (≈160 V)', 160], ['Triac: set the voltage', 0]], value: 230 },
        { id: 'Vt', label: 'Triac output voltage (rms)', min: 80, max: 230, step: 5, value: 180, unit: 'V' },
        { id: 'C', label: 'Run capacitor', min: 0.5, max: 12, step: 0.5, value: 6, unit: 'µF' },
        { id: 'dir', type: 'select', label: 'Direction', options: [['Capacitor on winding B (forward)', 1], ['Capacitor on winding A (reverse)', -1]], value: 1 },
        { type: 'buttons', items: [{ id: 'on', label: 'Start from rest', primary: true }, { id: 'off', label: 'Stop' }] }
      ], id => {
        if (id === 'on') { on = true; w = 0; }
        if (id === 'off') on = false;
        if (id === 'dir') w = 0;
        ctl.show('Vt', +V.tap === 0); lastPlot = -1;
      });
      V = ctl.values; ctl.show('Vt', false);
      const ro = kit.readout(box.side, [['n', 'Fan speed · air flow'], ['P', 'Fan power · input power'], ['eff', 'Efficiency · power factor'], ['I', 'Line current (winding A · winding B)'], ['pr', 'Rotor loss (slip × air-gap power)'], ['vc', 'Capacitor voltage'], ['rip', 'Backward/forward field · 100 Hz ripple']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'run capacitor (µF)', min: 0.5, max: 12 }, y: { label: 'A  ·  N·m', min: 0 }, legend: true }, 200);
      const volts = () => +V.tap === 0 ? V.Vt : +V.tap;
      const Zc = C => capZ(C * 1e-6, 50);
      const opAt = (Vs, C) => { let a = 0, b = ws * 0.999; if (mot.at(1 - 1e-3, Zc(C), Vs).T <= 0) return 0; for (let j = 0; j < 50; j++) { const m = (a + b) / 2; if (mot.at(1 - m / ws, Zc(C), Vs).T > FAN_K * m * m) a = m; else b = m; } return a; };
      const loop = kit.loop(dt => {
        t += dt;
        const Vs = on ? volts() : 0, sub = 30, h = dt / sub;
        let r = null;
        for (let k = 0; k < sub; k++) { r = mot.at(1 - w / ws, Zc(V.C), Vs); w = stepShaft(w, on ? r.T : 0, FAN_K * w * w, 0.02, 0.004, h); if (w < 0) w = 0; }
        const n = w * 60 / TAU, s = 1 - w / ws, Pfan = FAN_K * w * w * w, Pag = r.T * ws, Prot = Math.max(0, s * Pag);
        ro.set('n', n.toFixed(0) + ' rpm · ' + (100 * n / 1290).toFixed(0) + ' % of full air flow' + (on && w < 1 && t > 0.5 ? ' — not starting' : ''));
        ro.set('P', Pfan.toFixed(0) + ' W · ' + (on ? r.Pin.toFixed(0) : '0') + ' W');
        ro.set('eff', on ? (100 * Math.max(0, Pfan) / Math.max(1e-6, r.Pin)).toFixed(0) + ' % · ' + r.pf.toFixed(2) : '—');
        ro.set('I', on ? r.I.toFixed(2) + ' A (' + (V.dir > 0 ? r.Im : r.Ia).toFixed(2) + ' · ' + (V.dir > 0 ? r.Ia : r.Im).toFixed(2) + ')' : '0');
        ro.set('pr', on ? Prot.toFixed(0) + ' W at ' + (100 * s).toFixed(0) + ' % slip' : '—');
        ro.set('vc', on ? r.Vcap.toFixed(0) + ' V rms' : '—');
        ro.set('rip', on ? (r.Ib / Math.max(1e-9, r.If)).toFixed(2) + ' · ± ' + (r.ripple / 2).toFixed(2) + ' N·m' : '—');
        const key = volts() + '|' + V.C;
        if (key !== lastKey || t - lastPlot > 0.3) {
          lastPlot = t;
          const ser = [], fan = [];
          for (const [Vx, lab] of [[230, 'high'], [190, 'medium'], [160, 'low']]) {
            const pts = []; for (let i = 0; i <= 90; i++) { const nn = 1499 * i / 90; pts.push([nn, Math.max(0, mot.at(1 - nn / 1500, Zc(V.C), Vx).T)]); }
            ser.push({ pts, label: lab + ' (' + Vx + ' V)', dash: Math.abs(Vx - volts()) < 1 ? null : [4, 4] });
          }
          if (+V.tap === 0) { const pts = []; for (let i = 0; i <= 90; i++) { const nn = 1499 * i / 90; pts.push([nn, Math.max(0, mot.at(1 - nn / 1500, Zc(V.C), volts()).T)]); } ser.push({ pts, label: 'triac ' + volts() + ' V' }); }
          for (let i = 0; i <= 40; i++) { const nn = 1500 * i / 40, ww = nn * TAU / 60; fan.push([nn, FAN_K * ww * ww]); }
          ser.push({ pts: fan, label: 'fan', color: kit.colors().muted, dash: [2, 3] });
          p1.set({ series: ser, marks: on ? [{ x: n, y: FAN_K * w * w, label: 'running' }] : [] });
          if (key !== lastKey) {
            lastKey = key;
            const cI = [], cA = [], cR = [];
            for (let i = 0; i <= 46; i++) { const C = 0.5 + 11.5 * i / 46, wo = opAt(volts(), C), q = mot.at(1 - wo / ws, Zc(C), volts()); cI.push([C, q.I]); cA.push([C, q.Ia]); cR.push([C, q.ripple / 2]); }
            p2.set({ series: [{ pts: cI, label: 'line current (A)' }, { pts: cA, label: 'capacitor winding current (A)' }, { pts: cR, label: '100 Hz ripple, ± N·m' }], vlines: [{ x: V.C, label: 'now' }, { x: 6, label: 'nameplate' }] });
          }
        }
        // drawing: the motor, the tap switch and the fan wheel
        const C = kit.colors(), c = frame(st, 640, 260), slow = 100;
        th += TAU * 50 * dt / slow; rot += V.dir * w * 2 * dt / slow; fanAng += V.dir * w * dt / 30;
        const Im = on ? r.ImC : cx(0, 0), Ia = on ? r.IaC : cx(0, 0);
        drawMachine(c, C, 110, 125, 85, Math.cos(th + carg(Im)) * cabs(Im), V.dir * Math.cos(th + carg(Ia)) * cabs(Ia), rot, on);
        if (on) { const f = fieldVec(r.IfC, r.IbC, th), k = 60; arrowTo(c, 110, 125, 110 + clamp((f.fx + f.bx) * k, -80, 80), 125 - clamp(V.dir * (f.fy + f.by) * k, -80, 80), 'hsl(22 90% 55%)', 3); }
        txt(c, 'winding A: M poles · winding B: A poles', 110, 232, C.muted, 'center', 11);
        // the tap selector
        const x0 = 250, taps = [[230, 'H'], [190, 'M'], [160, 'L']];
        txt(c, 'main winding taps', x0 + 40, 36, C.text, 'center', 12, '600');
        taps.forEach(([vv, lab], i) => { const y = 70 + i * 40, act = +V.tap === vv; kit.dot(c, x0, y, 6, act ? C.accent : C.faint); txt(c, lab + '  ' + vv + ' V', x0 + 14, y + 4, act ? C.text : C.muted, 'left', 12); });
        const tr = +V.tap === 0; kit.dot(c, x0, 190, 6, tr ? C.accent : C.faint); txt(c, 'triac  ' + (tr ? V.Vt + ' V' : ''), x0 + 14, 194, tr ? C.text : C.muted, 'left', 12);
        c.strokeStyle = C.series[2]; c.lineWidth = 2; c.strokeRect(x0 + 90, 100, 40, 22); txt(c, V.C.toFixed(1) + ' µF', x0 + 110, 140, C.series[2], 'center', 12, '600');
        txt(c, 'run capacitor', x0 + 110, 92, C.muted, 'center', 11);
        // the fan wheel with its air
        const fx = 520, fy = 125;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(fx, fy, 88, 0, TAU); c.stroke();
        c.fillStyle = 'hsl(200 60% 55% / .75)';
        for (let k = 0; k < 12; k++) { const a = fanAng + k * TAU / 12; c.save(); c.translate(fx + 62 * Math.cos(a), fy + 62 * Math.sin(a)); c.rotate(a + 0.6); c.fillRect(-3, -18, 6, 36); c.restore(); }
        c.fillStyle = C.surface2; c.beginPath(); c.arc(fx, fy, 30, 0, TAU); c.fill();
        const flow = Math.max(0, n / 1290);
        for (let k = 0; k < 3; k++) arrowTo(c, fx + 95, fy - 30 + k * 30, fx + 95 + 30 * flow + 2, fy - 30 + k * 30, C.series[6], 2);
        txt(c, 'air ' + (100 * flow).toFixed(0) + ' %', fx, fy + 112, C.muted, 'center', 12);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-shaded */
  // a shaded-pole motor as two windings: the main coil and the short-circuited shading ring, γ electrical degrees
  // further along the pole (referred values); the ring's current delays the flux under it
  function shadedMotor(o) {
    const ws = TAU * o.f / (o.poles / 2), ns = 120 * o.f / o.poles, g = o.gamma * Math.PI / 180;
    const Zr = s => cx(o.R2 / (Math.abs(s) < 1e-6 ? 1e-6 : s), o.X2), ZF = s => par(cx(0, o.Xm), Zr(s));
    return { ns, ws, at(s, Vs, ring) {
      const F = ZF(s), B = ZF(2 - s), zfb = scl(add(F, B), 0.5), V = cx(Vs, 0);
      const Mms = scl(add(mul(F, expj(g)), mul(B, expj(-g))), 0.5), Msm = scl(add(mul(F, expj(-g)), mul(B, expj(g))), 0.5);
      const Zmm = add(cx(o.R1, o.X1), zfb), Zss = add(cx(o.Rs, o.Xs), zfb);
      const Im = ring ? div(V, sub(Zmm, div(mul(Mms, Msm), Zss))) : div(V, Zmm);
      const Is = ring ? scl(div(mul(Msm, Im), Zss), -1) : cx(0, 0);
      const If = scl(add(Im, mul(Is, expj(g))), 0.5), Ib = scl(add(Im, mul(Is, expj(-g))), 0.5);
      const T = (2 * Math.pow(cabs(If), 2) * F.re - 2 * Math.pow(cabs(Ib), 2) * B.re) / ws;
      const Pfe = (o.Pfe || 0) * Math.pow(Vs / o.V, 2), I = add(Im, cx(Vs > 0 ? Pfe / Vs : 0, 0));
      const n = (1 - s) * ns, Pin = Vs * I.re, Pm = T * (1 - s) * ws - (o.Pfw || 0) * Math.abs(n) / ns;
      return { n, T, I: cabs(I), pf: cabs(I) > 0 ? I.re / cabs(I) : 0, Pin, Pm, eff: Pin > 0 && Pm > 0 ? Pm / Pin : 0, Ef: mul(F, If), Eb: mul(B, Ib), Is: cabs(Is), g };
    } };
  }
  const SHADED = { V: 230, f: 50, poles: 4, R1: 120, X1: 250, R2: 130, X2: 250, Xm: 3500, Rs: 500, Xs: 30, gamma: 60, Pfw: 1.5, Pfe: 6 };
  Hyper.sim('sp-shaded', {
    title: 'The shaded pole: a field that sweeps across the pole',
    blurb: `A small 4-pole shaded-pole fan motor on 230 V, 50 Hz. Left: one pole face seen from the rotor, with the main coil round the pole and the copper shading ring round its right-hand third; the bars show the flux crossing each part of the face (up = north), and the orange marker the position of the strongest flux. Right: the fan. The graphs show the torque–speed curve against the fan (with any bearing drag), and how speed, efficiency and input power change with the voltage.

**Try this**
- Watch the marker: the flux peak moves from the unshaded side to the shaded side, again and again — that sweep is the "rotating" field, and the rotor follows it towards the ring.
- Untick *Shading rings fitted*: the flux under the whole pole rises and falls together, the sweep stops, the starting torque is zero, and the stopped fan only hums.
- Read the efficiency: about 23 % — some 54 W in for 12 W of air moving. The stalled current is only about 1.3 times the running current.
- Lower the voltage (a speed controller): the fan slows, efficiency falls, and below about 150 V the speed falls away quickly.
- Add bearing drag (dry sleeve bearings): the weak starting torque (about a third of rated) is quickly used up — the fan starts slowly, or not at all, as real ones do.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = graphs(box, 2);
      const mot = shadedMotor(SHADED), ws = mot.ws, k = 4.12e-6;          // the fan: T = k ω² (86 mN·m at 1380 rpm)
      let V = null, on = true, w = 0.9 * ws, th = 0, fanAng = 0, lastPlot = -1, lastKey = '', t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Supply voltage (speed controller)', min: 90, max: 230, step: 5, value: 230, unit: 'V' },
        { id: 'ring', type: 'check', label: 'Shading rings fitted', value: true },
        { id: 'drag', label: 'Bearing drag (dry sleeve bearings)', min: 0, max: 60, step: 2, value: 0, unit: 'mN·m' },
        { type: 'buttons', items: [{ id: 'on', label: 'Start from rest', primary: true }, { id: 'off', label: 'Stop' }] }
      ], id => { if (id === 'on') { on = true; w = 0; } if (id === 'off') on = false; lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed · slip'], ['P', 'Fan power · input power'], ['eff', 'Efficiency · power factor'], ['I', 'Current (stalled current)'], ['T', 'Torque: at start · rated'], ['sh', 'Flux peak under the ring comes later by']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (mN·m)', min: 0 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'supply voltage (V)', min: 90, max: 230 }, y: { label: 'rpm ÷ 20 · % · W', min: 0 }, legend: true }, 200);
      const opAt = Vs => { let a = 0, b = ws * 0.999; if (mot.at(0.999, Vs, true).T <= V.drag / 1000) return 0; for (let j = 0; j < 50; j++) { const m = (a + b) / 2; if (mot.at(1 - m / ws, Vs, true).T > k * m * m + V.drag / 1000) a = m; else b = m; } return a; };
      const loop = kit.loop(dt => {
        t += dt;
        const Vs = on ? V.V : 0, sub = 30, h = dt / sub;
        let r = null;
        for (let i = 0; i < sub; i++) { r = mot.at(1 - w / ws, Vs, V.ring); w = stepShaft(w, on ? r.T : 0, k * w * w, 0.002 + V.drag / 1000, 2e-4, h); if (w < 0) w = 0; }
        const n = w * 60 / TAU, s = 1 - w / ws, Pfan = k * w * w * w, stall = mot.at(1, V.V, V.ring);
        ro.set('n', n.toFixed(0) + ' rpm · ' + (100 * s).toFixed(0) + ' %' + (on && w < 0.5 && t > 1 ? ' — humming, not turning' : ''));
        ro.set('P', Pfan.toFixed(1) + ' W · ' + (on ? r.Pin.toFixed(1) : '0') + ' W');
        ro.set('eff', on ? (100 * Pfan / Math.max(1e-6, r.Pin)).toFixed(0) + ' % · ' + r.pf.toFixed(2) : '—');
        ro.set('I', on ? r.I.toFixed(3) + ' A (' + stall.I.toFixed(3) + ' A)' : '0');
        ro.set('T', (stall.T * 1000).toFixed(0) + ' mN·m · 86 mN·m at 230 V, 1380 rpm');
        // flux phasor at an electrical position θ across the pole: the unshaded part is centred near −30°, the shaded near +60°
        const Bph = a => add(mul(r.Ef, expj(-a)), mul(r.Eb, expj(a)));
        let psi = (carg(Bph(-Math.PI / 6)) - carg(Bph(Math.PI / 3))) * 180 / Math.PI; psi = ((psi + 540) % 360) - 180;
        ro.set('sh', !on ? '—' : V.ring ? psi.toFixed(0) + '° behind the unshaded part' : '0° — no ring: the flux rises and falls together, no sweep');
        const key = V.V + '|' + V.ring + '|' + V.drag;
        if (key !== lastKey || t - lastPlot > 0.3) {
          lastPlot = t;
          const tc = [], ld = [];
          for (let i = 0; i <= 90; i++) { const nn = 1499 * i / 90; tc.push([nn, 1000 * Math.max(0, mot.at(1 - nn / 1500, V.V, V.ring).T)]); const ww = nn * TAU / 60; ld.push([nn, 1000 * (k * ww * ww + V.drag / 1000)]); }
          p1.set({ series: [{ pts: tc, label: 'motor at ' + V.V + ' V' }, { pts: ld, label: 'fan + bearing drag', color: kit.colors().muted, dash: [4, 4] }], marks: on ? [{ x: n, y: 1000 * k * w * w, label: 'running' }] : [] });
          if (key !== lastKey) {
            lastKey = key;
            const sp = [], ef = [], pin = [];
            if (V.ring) for (let vv = 90; vv <= 230; vv += 5) { const wo = opAt(vv), q = mot.at(1 - wo / ws, vv, true); sp.push([vv, wo * 60 / TAU / 20]); ef.push([vv, q.Pin > 0 ? 100 * k * wo ** 3 / q.Pin : 0]); pin.push([vv, q.Pin]); }
            p2.set({ series: [{ pts: sp, label: 'speed ÷ 20 (rpm)' }, { pts: ef, label: 'efficiency (%)' }, { pts: pin, label: 'input power (W)' }], vlines: [{ x: V.V, label: 'now' }] });
          }
        }
        // drawing: the pole face with coil and ring, the flux bars, the sweep marker; the fan
        const C = kit.colors(), c = frame(st, 640, 260);
        th += TAU * 50 * dt / 100; fanAng += w * dt / 30;
        const x0 = 40, x1 = 360, yF = 150, N = 24;
        c.fillStyle = C.surface2; c.fillRect(x0, yF, x1 - x0, 60); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0, yF, x1 - x0, 60);
        c.fillStyle = C.faint; c.fillRect(x0 + 90, yF + 60, 140, 40);
        c.strokeStyle = 'hsl(215 70% 55%)'; c.lineWidth = 3; for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(x0 + 80, yF + 66 + i * 6); c.lineTo(x0 + 240, yF + 66 + i * 6); c.stroke(); }
        txt(c, 'main coil', x0 + 160, yF + 116, 'hsl(215 70% 55%)', 'center', 11);
        const xr = x0 + (x1 - x0) * 2 / 3;
        if (V.ring) { c.strokeStyle = 'hsl(25 80% 50%)'; c.lineWidth = 5; c.strokeRect(xr, yF + 4, x1 - xr - 4, 52); txt(c, 'shading ring', (xr + x1) / 2, yF + 116, 'hsl(25 80% 50%)', 'center', 11); }
        txt(c, 'unshaded', (x0 + xr) / 2, yF + 36, C.muted, 'center', 11); txt(c, 'shaded', (xr + x1) / 2, yF + 36, C.muted, 'center', 11);
        // flux across the face: electrical angle from −90° (left edge) to +90° (right edge), ring centred near +60°
        let best = -1, bx = 0;
        const Ef = on ? r.Ef : cx(0, 0), Eb = on ? r.Eb : cx(0, 0), sc = 90 / Math.max(1, cabs(Ef) + cabs(Eb));
        for (let i = 0; i < N; i++) {
          const f = (i + 0.5) / N, thE = (-90 + 180 * f) * Math.PI / 180;
          const B = cabs(Ef) * Math.cos(th + carg(Ef) - thE) + cabs(Eb) * Math.cos(th + carg(Eb) + thE);
          const x = x0 + f * (x1 - x0), hgt = B * sc;
          c.fillStyle = B >= 0 ? 'hsl(0 70% 55% / .7)' : 'hsl(215 70% 55% / .7)';
          c.fillRect(x - 5, hgt >= 0 ? yF - hgt : yF, 10, Math.abs(hgt));
          if (Math.abs(B) > best) { best = Math.abs(B); bx = x; }
        }
        if (on && best > 0) { c.fillStyle = 'hsl(22 90% 55%)'; c.beginPath(); c.moveTo(bx, yF - 104); c.lineTo(bx - 7, yF - 116); c.lineTo(bx + 7, yF - 116); c.closePath(); c.fill(); }
        txt(c, 'flux across one pole face (drawn 100 × slower)', (x0 + x1) / 2, 20, C.muted, 'center', 11);
        // the fan
        const fx = 520, fy = 120;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(fx, fy, 80, 0, TAU); c.stroke();
        c.fillStyle = 'hsl(200 60% 55% / .75)';
        for (let i = 0; i < 5; i++) { c.save(); c.translate(fx, fy); c.rotate(fanAng + i * TAU / 5); c.beginPath(); c.ellipse(0, -44, 14, 30, 0.35, 0, TAU); c.fill(); c.restore(); }
        c.fillStyle = C.text; c.beginPath(); c.arc(fx, fy, 10, 0, TAU); c.fill();
        txt(c, n.toFixed(0) + ' rpm', fx, fy + 104, C.text, 'center', 13, '600');
        txt(c, 'turns towards the ring →', fx, fy + 122, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-captest */
  const CAPS = {
    fan: { name: 'Run capacitor 6 µF, 450 V film (PSC blower)', C: 6e-6, Vr: 450, film: true, work: 327, label: '6 µF ±5 %' },
    run: { name: 'Run capacitor 20 µF, 450 V film (0.75 kW motor)', C: 20e-6, Vr: 450, film: true, work: 398, label: '20 µF ±5 %' },
    start: { name: 'Start capacitor 120–144 µF, 330 V electrolytic', C: 130e-6, Vr: 330, film: false, work: 295, label: '120–144 µF' }
  };
  Hyper.sim('sp-captest', {
    title: 'Capacitors on the bench: charge, discharge, measure',
    blurb: `A motor capacitor on the bench. It was disconnected at the crest of the wave, so it may hold the peak of the voltage it worked at (√2 × its working voltage). Discharge it through the resistor, watch the voltage fall on the left graph, then measure its capacitance. The right graph shows what the capacitance you measured means for the motor it came from.

**Try this**
- Press *Disconnected at the crest*, then *Measure*: the meter refuses — first discharge. Press *Discharge through the resistor* and watch the exponential fall: after one time constant RC 37 % is left, after five less than 1 %.
- Change the resistor: 1 kΩ discharges fast but takes a big pulse of power; 100 kΩ is gentle but slow. The read-out gives the time to fall below 60 V.
- Choose *Aged* on the 20 µF run capacitor and measure: about 14 µF, 30 % low. On the right, the motor's current, auxiliary current and 100 Hz ripple at that value: replace it.
- *Open* (the internal disconnector has operated): it holds no charge and measures nearly nothing — the motor hums at standstill. *Shorted*: the meter reads a short — that one blows the fuse.
- Press *Short it with a screwdriver* on a charged start capacitor to see why you must not: the energy is dumped in microseconds into a spark.`,
    params: { cap: 'run' },
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      let V = null, v = 0, mode = 'idle', tDis = 0, trace = [], meter = '— —', spark = 0, sparkE = 0, lastKey = '', t = 0, msg = '';
      const ctl = kit.controls(box.side, [
        { id: 'cap', type: 'select', label: 'Capacitor', options: Object.entries(CAPS).map(([k, c]) => [c.name, k]), value: params.cap || 'run' },
        { id: 'cond', type: 'select', label: 'Condition', options: [['Good', 'good'], ['Aged: lost 30 % of its µF', 'aged'], ['Open (disconnector operated)', 'open'], ['Shorted', 'short']], value: 'good' },
        { id: 'R', label: 'Discharge resistor', min: 1, max: 100, step: 1, value: 20, unit: 'kΩ', log: true },
        { type: 'buttons', items: [{ id: 'charge', label: 'Disconnected at the crest', primary: true }, { id: 'dis', label: 'Discharge through the resistor' }, { id: 'meas', label: 'Measure' }, { id: 'short', label: 'Short it with a screwdriver' }] }
      ], id => {
        const cp = CAPS[V.cap];
        if (id === 'cap' || id === 'cond') { v = 0; mode = 'idle'; meter = '— —'; msg = ''; trace = []; }
        if (id === 'charge') { v = (V.cond === 'open' || V.cond === 'short') ? 0 : Math.SQRT2 * cp.work; mode = 'idle'; trace = [[0, v]]; tDis = 0; meter = '— —'; msg = V.cond === 'open' ? 'An open capacitor holds no charge.' : V.cond === 'short' ? 'A shorted capacitor holds no charge.' : 'Holding ' + v.toFixed(0) + ' V.'; }
        if (id === 'dis') { mode = 'dis'; tDis = 0; trace = [[0, v]]; msg = 'Discharging through ' + V.R + ' kΩ.'; }
        if (id === 'meas') {
          if (v > 60) { meter = v.toFixed(0) + ' V!'; msg = 'The meter will not measure µF on a charged capacitor — and neither should you touch it. Discharge first.'; }
          else { const Ca = capActual(); meter = V.cond === 'short' ? 'SHORT' : V.cond === 'open' ? '0.02 µF' : (Ca * 1e6).toFixed(1) + ' µF'; msg = verdict(Ca); }
        }
        if (id === 'short') { sparkE = 0.5 * capActual() * v * v; spark = v > 30 ? 0.6 : 0; msg = v > 30 ? 'Bang: ' + sparkE.toFixed(1) + ' J dumped in microseconds — pitted terminals, molten metal, a damaged capacitor. Never do this.' : 'Nothing much happens — but a resistor is still the right tool.'; v = 0; mode = 'idle'; }
      });
      V = ctl.values;
      const capActual = () => { const cp = CAPS[V.cap]; return V.cond === 'aged' ? cp.C * 0.7 : V.cond === 'open' ? 2e-8 : cp.C; };
      const verdict = Ca => {
        const cp = CAPS[V.cap];
        if (V.cond === 'short') return 'Shorted: replace it (and expect the fuse or breaker to have tripped).';
        if (V.cond === 'open') return 'Open: replace it; the motor hums at standstill without it.';
        if (cp.film) { const d = (Ca - cp.C) / cp.C; return Math.abs(d) <= 0.05 ? 'Within ±5 % of ' + (cp.C * 1e6).toFixed(0) + ' µF: good.' : (100 * d).toFixed(0) + ' % off the label: replace it with ' + (cp.C * 1e6).toFixed(0) + ' µF, ' + cp.Vr + ' V or higher.'; }
        return Ca * 1e6 >= 120 && Ca * 1e6 <= 144 ? 'Inside its printed range 120–144 µF: good.' : 'Below its printed range: replace it.';
      };
      const ro = kit.readout(box.side, [['C', 'Label · actual'], ['v', 'Voltage now'], ['E', 'Stored energy'], ['tau', 'Time constant RC · time to fall below 60 V'], ['P', 'Resistor power now'], ['msg', 'Bench notes']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'capacitor voltage (V)', min: 0 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'capacitance (µF)' }, y: { label: 'A · N·m', min: 0 }, legend: true }, 190);
      const mCS = motorOf('cscr'), mStart = motorOf('cs'), mFan = spMotor(PSCFAN);
      const opPoint = (m, Z, TL, Vs, fan) => { const ws = m.ws; let a = 0, b = ws * 0.9999; if (m.at(1 - 1e-4, Z, Vs).T <= 0) return m.at(1, Z, Vs); for (let j = 0; j < 45; j++) { const x = (a + b) / 2, L = fan ? FAN_K * x * x : TL; if (m.at(1 - x / ws, Z, Vs).T > L) a = x; else b = x; } return m.at(1 - a / ws, Z, Vs); };
      const loop = kit.loop(dt => {
        t += dt;
        const cp = CAPS[V.cap], Ca = capActual(), RC = V.R * 1e3 * Ca;
        if (mode === 'dis') { const sub = 20; for (let k = 0; k < sub; k++) v -= v * (dt / sub) / Math.max(1e-6, RC); tDis += dt; if (trace.length < 1500) trace.push([tDis, v]); if (v < 0.5) { v = 0; mode = 'idle'; msg = 'Discharged. Now measure it (and check with a voltmeter first in real life).'; } }
        const E = 0.5 * Ca * v * v, t60 = v > 60 ? RC * Math.log(v / 60) : 0;
        ro.set('C', cp.label + ' · ' + (V.cond === 'short' ? 'shorted' : (Ca * 1e6).toFixed(1) + ' µF'));
        ro.set('v', v.toFixed(0) + ' V' + (v > 60 ? ' — dangerous' : ''));
        ro.set('E', E.toFixed(2) + ' J');
        ro.set('tau', RC.toFixed(2) + ' s · ' + (v > 60 ? t60.toFixed(1) + ' s' : 'already below'));
        ro.set('P', mode === 'dis' ? (v * v / (V.R * 1e3)).toFixed(2) + ' W' : '0 W');
        ro.set('msg', msg || 'Press "Disconnected at the crest".');
        p1.set({ x: { label: 'time (s)', min: 0, max: Math.max(1, 5 * RC, trace.length ? trace[trace.length - 1][0] : 1) }, series: [{ pts: trace, label: 'voltage through ' + V.R + ' kΩ' }], hlines: [{ y: 60, label: '60 V' }], vlines: [{ x: RC, label: 'RC' }, { x: 5 * RC, label: '5 RC' }] });
        const key = V.cap + '|' + V.cond;
        if (key !== lastKey) {
          lastKey = key;
          const s1 = [], s2 = [], s3 = [], Cx = V.cond === 'short' ? null : Ca * 1e6;
          if (V.cap === 'run') for (let i = 0; i <= 40; i++) { const C = 4 + 36 * i / 40, r = opPoint(mCS, capZ(C * 1e-6, 50), 5.14, 230, false); s1.push([C, r.I]); s2.push([C, r.Ia]); s3.push([C, r.ripple / 2]); }
          else if (V.cap === 'fan') for (let i = 0; i <= 40; i++) { const C = 0.5 + 11.5 * i / 40, r = opPoint(mFan, capZ(C * 1e-6, 50), 0, 230, true); s1.push([C, r.I]); s2.push([C, r.Ia]); s3.push([C, r.ripple / 2]); }
          else for (let i = 0; i <= 40; i++) { const C = 20 + 280 * i / 40, r = mStart.at(1, capZ(C * 1e-6, 50)); s1.push([C, r.I / 10]); s2.push([C, r.T]); }
          const ser = V.cap === 'start' ? [{ pts: s1, label: 'starting line current ÷ 10 (A)' }, { pts: s2, label: 'starting torque (N·m)' }] : [{ pts: s1, label: 'line current (A)' }, { pts: s2, label: 'capacitor winding current (A)' }, { pts: s3, label: '100 Hz ripple, ± N·m' }];
          const vl = [{ x: cp.C * 1e6, label: 'label' }]; if (Cx != null && V.cond !== 'good') vl.push({ x: Cx, label: 'this one' });
          p2.set({ x: { label: V.cap === 'start' ? 'start capacitance (µF), motor at standstill' : 'run capacitance (µF), motor at full load' }, series: ser, vlines: vl });
        }
        // drawing: the can, the resistor on its leads, the meter
        const C = kit.colors(), c = frame(st, 640, 240);
        const x = 170, y = 60, w = 90, h = 130;
        const body = cp.film ? 'hsl(210 8% 62%)' : 'hsl(220 10% 18%)';
        c.fillStyle = body; c.fillRect(x - w / 2, y, w, h);
        c.beginPath(); c.ellipse(x, y + h, w / 2, 12, 0, 0, TAU); c.fill();
        const dome = V.cond === 'open' ? 14 : V.cond === 'aged' && !cp.film ? 6 : 0;
        c.fillStyle = cp.film ? 'hsl(210 8% 72%)' : 'hsl(220 10% 28%)'; c.beginPath(); c.ellipse(x, y - dome / 2, w / 2, 12 + dome / 2, 0, 0, TAU); c.fill();
        if (!cp.film) { c.strokeStyle = 'hsl(220 10% 45%)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 14, y); c.lineTo(x + 14, y); c.moveTo(x, y - 8); c.lineTo(x, y + 8); c.stroke(); }
        if (V.cond === 'short') { c.fillStyle = 'hsl(20 60% 20% / .8)'; c.beginPath(); c.arc(x + 10, y + 50, 16, 0, TAU); c.fill(); }
        txt(c, cp.label, x, y + 60, cp.film ? '#222' : '#ddd', 'center', 12, '600'); txt(c, cp.Vr + ' V~', x, y + 78, cp.film ? '#222' : '#ddd', 'center', 12);
        const tA = [x - 22, y - 16 - dome], tB = [x + 22, y - 16 - dome];
        for (const p of [tA, tB]) { c.fillStyle = 'hsl(45 30% 60%)'; c.fillRect(p[0] - 6, p[1] - 4, 12, 10); }
        // charge indicator
        const fr = clamp(v / (Math.SQRT2 * cp.Vr), 0, 1);
        c.fillStyle = C.faint; c.fillRect(x + 70, y, 14, h); c.fillStyle = v > 60 ? C.bad : C.ok; c.fillRect(x + 70, y + h * (1 - fr), 14, h * fr);
        txt(c, v.toFixed(0) + ' V', x + 77, y + h + 22, v > 60 ? C.bad : C.muted, 'center', 12, '600');
        // the resistor on insulated leads
        if (mode === 'dis') {
          const pw = v * v / (V.R * 1e3), glow = clamp(pw / 10, 0, 1);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(tA[0], tA[1]); c.lineTo(tA[0], 20); c.lineTo(330, 20); c.moveTo(tB[0], tB[1]); c.lineTo(tB[0], 34); c.lineTo(330, 34); c.stroke();
          c.fillStyle = 'hsl(15 90% ' + (30 + 30 * glow).toFixed(0) + '% / ' + (0.4 + 0.6 * glow).toFixed(2) + ')'; c.fillRect(330, 14, 60, 26);
          txt(c, V.R + ' kΩ', 360, 32, C.text, 'center', 11, '600');
        }
        if (spark > 0) {
          spark -= dt;
          c.strokeStyle = 'hsl(50 100% 70%)'; c.lineWidth = 2;
          for (let i = 0; i < 10; i++) { const a = Math.random() * TAU, L = 10 + 30 * Math.random(); c.beginPath(); c.moveTo(x, y - 20); c.lineTo(x + L * Math.cos(a), y - 20 + L * Math.sin(a)); c.stroke(); }
          c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(tA[0], tA[1] - 4); c.lineTo(tB[0], tB[1] - 4); c.stroke();
        }
        // the meter
        const mx = 470, my = 70;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(mx, my, 140, 110); c.strokeRect(mx, my, 140, 110);
        c.fillStyle = 'hsl(90 30% 70%)'; c.fillRect(mx + 12, my + 14, 116, 40);
        txt(c, meter, mx + 70, my + 42, '#1b2a10', 'center', 20, '700');
        txt(c, 'capacitance meter', mx + 70, my + 78, C.muted, 'center', 11);
        txt(c, 'measures only below 60 V', mx + 70, my + 96, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-steinmetz */
  // a delta-connected 230/400 V, 4-pole motor on 230 V single phase: per-winding values scaled from a 1.1 kW motor
  const H3 = cx(-0.5, Math.sqrt(3) / 2), H3b = cx(-0.5, -Math.sqrt(3) / 2);
  function steinModel(o) {
    const ws = TAU * o.f / (o.poles / 2), ns = 120 * o.f / o.poles;
    const Zr = s => cx(o.R2 / (Math.abs(s) < 1e-6 ? (s < 0 ? -1e-6 : 1e-6) : s), o.X2);
    return { ns, ws, at(s, C, capTo, Vs) {
      const Z1 = cx(o.R1, o.X1), Zm = cx(0, o.Xm), Zp = add(Z1, par(Zm, Zr(s))), Zn = add(Z1, par(Zm, Zr(2 - s)));
      const Yc = cx(0, TAU * o.f * C), U = cx(Vs, 0), N0 = cx(0, 0), node = capTo === 'V' ? N0 : U;
      const phase = Wn => {
        const vUV = U, vVW = sub(N0, Wn), vWU = sub(Wn, U);
        const Vp = scl(add(vUV, add(mul(H3, vVW), mul(H3b, vWU))), 1 / 3), Vn = scl(add(vUV, add(mul(H3b, vVW), mul(H3, vWU))), 1 / 3);
        const Ip = div(Vp, Zp), In = div(Vn, Zn);
        return { Vp, Vn, Ip, In, vUV, vVW, vWU, iUV: add(Ip, In), iVW: add(mul(H3b, Ip), mul(H3, In)), iWU: add(mul(H3, Ip), mul(H3b, In)) };
      };
      const f = Wn => { const p = phase(Wn); return sub(sub(mul(sub(node, Wn), Yc), p.iWU), scl(p.iVW, -1)); };
      const f0 = f(cx(0, 0)), k = sub(f(cx(1, 0)), f0), W = scl(div(f0, k), -1), p = phase(W);
      const I2p = div(sub(p.Vp, mul(p.Ip, Z1)), Zr(s)), I2n = div(sub(p.Vn, mul(p.In, Z1)), Zr(2 - s));
      const T = (3 * Math.pow(cabs(I2p), 2) * Zr(s).re - 3 * Math.pow(cabs(I2n), 2) * Zr(2 - s).re) / ws;
      const Icap = mul(sub(node, W), Yc), n = (1 - s) * ns;
      const IL = capTo === 'V' ? sub(p.iUV, p.iWU) : add(sub(p.iUV, p.iWU), Icap);
      const Pin = Vs * IL.re, Pm = T * (1 - s) * ws - (o.Pfw || 0) * Math.abs(n) / ns;
      const lead = [sub(p.iUV, p.iWU), sub(p.iVW, p.iUV), sub(p.iWU, p.iVW)];           // currents in the motor leads U1, V1, W1
      return { T, n, Vw: [p.vUV, p.vVW, p.vWU], Iw: [cabs(p.iUV), cabs(p.iVW), cabs(p.iWU)], lead: lead.map(cabs), Vc: cabs(sub(node, W)), Ic: cabs(Icap), IL: cabs(IL), unb: cabs(p.Vn) / Math.max(1e-9, cabs(p.Vp)), Pin, Pm, eff: Pin > 0 && Pm > 0 ? Pm / Pin : 0 };
    } };
  }
  const STEIN_SIZES = [0.37, 0.75, 1.1, 1.5, 2.2];
  const steinParams = P => { const q = 1.1 / P; return { f: 50, poles: 4, R1: 7 * q, X1: 8 * q, R2: 6 * q, X2: 11 * q, Xm: 150 * q, Pfw: 25 * P / 1.1 }; };
  Hyper.sim('sp-steinmetz', {
    title: 'A three-phase motor on one phase (Steinmetz)',
    blurb: `A 230/400 V, 4-pole three-phase motor connected in delta and fed from 230 V, 50 Hz single phase, with a run capacitor from terminal W1 to U1 (or to V1 to reverse). Left: the terminal box, with the three winding currents as bars against the rated current. Middle: the three winding voltages as phasors — for a true three-phase supply they would form the dashed equal star. The graphs show the torque–speed curves, and the three winding currents at the present load for any run capacitance.

**Try this**
- 1.1 kW, rule-of-thumb 77 µF, load 75 %, press *Start*: the motor starts only if the load is light — the starting torque is about a fifth of rated. Tick *Start capacitor* and start again: about 120 % of rated torque for the first second.
- Running at 75 % load with 77 µF: one winding carries about 3.8 A against its rated 2.5 A. Slide the capacitor down to about 50 µF (or press *Balancing value*): the voltage unbalance falls to about 5 %, the phasors form a nearly equal star and the hottest winding drops to its rated current.
- Set the load to zero with 77 µF: a winding is overloaded although the motor does no work — the capacitor must suit the load.
- Try 100 % load: even at the best capacitor one winding runs hot; about 75 % is the practical limit.
- Switch the capacitor to V1: the motor runs the other way.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let V = null, mdl = null, rated = null, w = 0, on = false, rot = 0, startIn = false, lastKey = '', lastPlot = -1, t = 0, tOn = 0, bestC = null;
      const setup = P => {
        const o = steinParams(P); mdl = steinModel(o);
        const im = M.induction(Object.assign({ V_LL: 400 }, o));
        let lo = 1e-4, hi = im.sMax; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (im.at(m).Pmech < P * 1000) lo = m; else hi = m; }
        const r = im.at(lo); rated = { Iw: r.I1, T: P * 1000 / (r.n * TAU / 60), n: r.n, im };
      };
      const ctl = kit.controls(box.side, [
        { id: 'P', type: 'select', label: 'Motor (230/400 V, delta)', options: STEIN_SIZES.map(p => [p + ' kW', p]), value: 1.1 },
        { id: 'C', label: 'Run capacitor', min: 10, max: 250, step: 1, value: 77, unit: 'µF' },
        { id: 'sc', type: 'check', label: 'Start capacitor (2 × run) until 75 % speed', value: false },
        { id: 'to', type: 'select', label: 'Capacitor from W1 to', options: [['U1 (forward)', 'U'], ['V1 (reverse)', 'V']], value: 'U' },
        { id: 'load', label: 'Load, % of rated torque (constant)', min: 0, max: 110, step: 5, value: 75, unit: '%' },
        { type: 'buttons', items: [{ id: 'on', label: 'Start', primary: true }, { id: 'off', label: 'Stop' }, { id: 'rule', label: 'Rule of thumb' }, { id: 'best', label: 'Balancing value' }] }
      ], id => {
        if (id === 'P') { setup(+V.P); ctl.set('C', Math.round(M.steinmetzC({ P: +V.P * 1000, V: 230, f: 50 }) * 1e6)); w = 0; on = false; }
        if (id === 'on') { on = true; w = 0; tOn = 0; }
        if (id === 'off') on = false;
        if (id === 'to') w = 0;
        if (id === 'rule') ctl.set('C', Math.round(M.steinmetzC({ P: +V.P * 1000, V: 230, f: 50 }) * 1e6));
        if (id === 'best' && bestC) ctl.set('C', Math.round(bestC));
        lastKey = '';
      });
      V = ctl.values; setup(1.1);
      const ro = kit.readout(box.side, [['n', 'Speed · output'], ['vw', 'Winding voltages U1–V1 · V1–W1 · W1–U1'], ['iw', 'Winding currents (rated)'], ['il', 'Motor-lead currents U1 · V1 · W1'], ['vc', 'Capacitor voltage · current'], ['unb', 'Voltage unbalance (backward/forward)'], ['cb', 'Best capacitor at this load (coolest hottest winding) · rule of thumb']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm), in the driven direction', min: 0, max: 1500 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'run capacitor (µF)', min: 10, max: 250 }, y: { label: 'winding current (A)', min: 0 }, legend: true }, 200);
      const dir = () => V.to === 'U' ? 1 : -1;
      const atDir = (u, C) => { const r = mdl.at(1 - dir() * u / mdl.ws, C, V.to, 230); return Object.assign({}, r, { Td: dir() * r.T }); };   // u ≥ 0: speed in the driven direction
      // the stable running point: walk down from synchronous speed to where the torque first exceeds the load, then refine
      const opAt = (C, TL) => {
        const ws = mdl.ws; let b = ws * 0.9999, a = null;
        for (let i = 1; i <= 80; i++) { const x = ws * (1 - i / 80 * 0.6); if (atDir(x, C).Td > TL) { a = x; break; } b = x; }
        if (a == null) return null;
        for (let j = 0; j < 40; j++) { const x = (a + b) / 2; if (atDir(x, C).Td > TL) a = x; else b = x; }
        return atDir(a, C);
      };
      const loop = kit.loop(dt => {
        t += dt;
        const ws = mdl.ws, TL = V.load / 100 * rated.T, C = V.C * 1e-6, sub = 30, h = dt / sub, Jt = 0.004 * +V.P / 1.1 + 0.01;
        let r = null;
        for (let k = 0; k < sub; k++) {
          startIn = V.sc && on && w < 0.75 * ws;
          r = atDir(w, startIn ? 3 * C : C);
          w = stepShaft(w, on ? r.Td : 0, TL, steinParams(+V.P).Pfw / ws, Jt, h);
          if (w < 0) w = 0;
        }
        if (on) tOn += dt;
        const n = w * 60 / TAU, Pout = on ? TL * w : 0;
        ro.set('n', n.toFixed(0) + ' rpm' + (V.to === 'V' ? ' (reverse)' : '') + ' · ' + Pout.toFixed(0) + ' W = ' + (100 * Pout / (+V.P * 1000)).toFixed(0) + ' % of rated' + (on && w === 0 && tOn > 0.4 ? ' — not starting' : ''));
        ro.set('vw', on ? r.Vw.map(z => cabs(z).toFixed(0)).join(' · ') + ' V' : '—');
        ro.set('iw', on ? r.Iw.map(x => x.toFixed(2)).join(' · ') + ' A (' + rated.Iw.toFixed(2) + ' A)' : '—');
        ro.set('il', on ? r.lead.map(x => x.toFixed(2)).join(' · ') + ' A' : '—');
        ro.set('vc', on ? r.Vc.toFixed(0) + ' V · ' + r.Ic.toFixed(2) + ' A' + (startIn ? ' (start capacitor in)' : '') : '—');
        ro.set('unb', on ? (100 * r.unb).toFixed(0) + ' %' : '—');
        const key = V.P + '|' + V.to + '|' + V.load;
        if (key !== lastKey) {
          lastKey = key;
          const i1 = [], i2 = [], i3 = [];
          let bu = 1e9; bestC = null;
          for (let i = 0; i <= 48; i++) {
            const Cx = 10 + 240 * i / 48, q = opAt(Cx * 1e-6, TL);
            if (!q) continue;
            i1.push([Cx, q.Iw[0]]); i2.push([Cx, q.Iw[1]]); i3.push([Cx, q.Iw[2]]);
            const spread = Math.max(...q.Iw);                                    // keep the hottest winding as cool as possible
            if (spread < bu) { bu = spread; bestC = Cx; }
          }
          const rule = M.steinmetzC({ P: +V.P * 1000, V: 230, f: 50 }) * 1e6;
          p2.set({ series: [{ pts: i1, label: 'U1–V1' }, { pts: i2, label: 'V1–W1' }, { pts: i3, label: 'W1–U1' }], hlines: [{ y: rated.Iw, label: 'rated' }], vlines: [{ x: V.C, label: 'now' }, { x: rule, label: 'rule' }].concat(bestC ? [{ x: bestC, label: 'best' }] : []) });
          ro.set('cb', (bestC ? bestC.toFixed(0) + ' µF' : 'will not run at this load') + ' · ' + rule.toFixed(0) + ' µF');
        }
        if (t - lastPlot > 0.3 || lastKey === '') {
          lastPlot = t;
          const run = [], strt = [], three = [], ld = [];
          for (let i = 0; i <= 80; i++) {
            const u = mdl.ws * i / 80 * 0.999, nn = u * 60 / TAU;
            run.push([nn, Math.max(0, atDir(u, C).Td)]); if (V.sc) strt.push([nn, Math.max(0, atDir(u, 3 * C).Td)]);
            three.push([nn, rated.im.at(Math.max(1e-4, 1 - nn / 1500)).T]); ld.push([nn, TL]);
          }
          const ser = [{ pts: run, label: 'run capacitor ' + V.C + ' µF' }];
          if (V.sc) ser.push({ pts: strt, label: 'with the start capacitor', dash: [5, 4] });
          ser.push({ pts: three, label: 'on a true 3-phase supply', color: kit.colors().faint, dash: [2, 3] }, { pts: ld, label: 'load', color: kit.colors().muted, dash: [6, 4] });
          p1.set({ series: ser, marks: on ? [{ x: n, y: Math.max(0, r.Td), label: 'now' }] : [], hlines: [{ y: rated.T, label: 'rated' }] });
        }
        // drawing: terminal box, phasors, motor
        const Cc = kit.colors(), c = frame(st, 640, 270);
        rot += dir() * w * dt / 25;
        const tx = [60, 130, 200], yTop = 60, yBot = 130, names = [['W2', 'U2', 'V2'], ['U1', 'V1', 'W1']];
        c.strokeStyle = Cc.text; c.lineWidth = 1.5; c.strokeRect(30, 30, 200, 130);
        for (let i = 0; i < 3; i++) {
          S3node(c, Cc, tx[i], yTop, names[0][i]); S3node(c, Cc, tx[i], yBot, names[1][i]);
          c.strokeStyle = 'hsl(45 60% 50%)'; c.lineWidth = 5; c.beginPath(); c.moveTo(tx[i], yTop + 8); c.lineTo(tx[i], yBot - 8); c.stroke();
        }
        txt(c, 'delta links', 130, 100, Cc.muted, 'center', 10);
        // supply and capacitor
        c.strokeStyle = Cc.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(tx[0], yBot + 8); c.lineTo(tx[0], 200); c.stroke(); txt(c, 'L', tx[0], 214, Cc.text, 'center', 12, '600');
        c.beginPath(); c.moveTo(tx[1], yBot + 8); c.lineTo(tx[1], 200); c.stroke(); txt(c, 'N', tx[1], 214, Cc.text, 'center', 12, '600');
        const cxTo = V.to === 'U' ? tx[0] : tx[1];
        c.beginPath(); c.moveTo(tx[2], yBot + 8); c.lineTo(tx[2], 172); c.stroke();
        kit.schem.capacitor(c, tx[2], 172, cxTo, 172, { label: '', color: startIn ? Cc.warn : Cc.series[2] });
        txt(c, V.C + ' µF' + (startIn ? ' + ' + 2 * V.C + ' µF' : ''), (tx[2] + cxTo) / 2 + 10, 196, startIn ? Cc.warn : Cc.series[2], 'center', 11, '600');
        // winding current bars
        const labels = ['U1–V1', 'V1–W1', 'W1–U1'];
        for (let i = 0; i < 3; i++) {
          const val = on ? r.Iw[i] / rated.Iw : 0, y = 232 + i * 13;
          c.fillStyle = Cc.faint; c.fillRect(70, y - 8, 150, 9); c.fillStyle = val > 1.05 ? Cc.bad : Cc.ok; c.fillRect(70, y - 8, 150 * clamp(val / 2, 0, 1), 9);
          c.strokeStyle = Cc.text; c.lineWidth = 1; c.beginPath(); c.moveTo(145, y - 10); c.lineTo(145, y + 3); c.stroke();
          txt(c, labels[i], 64, y, Cc.muted, 'right', 10); txt(c, on ? (100 * val).toFixed(0) + ' %' : '', 226, y, Cc.text, 'left', 10);
        }
        // phasors of the winding voltages
        const px = 360, py = 130, ks = 90 / 230;
        c.setLineDash([3, 4]); c.strokeStyle = Cc.faint; c.lineWidth = 1.5;
        for (let i = 0; i < 3; i++) { const a = -dir() * i * TAU / 3; c.beginPath(); c.moveTo(px, py); c.lineTo(px + 90 * Math.cos(a), py - 90 * Math.sin(a)); c.stroke(); }
        c.setLineDash([]);
        if (on) r.Vw.forEach((z, i) => { arrowTo(c, px, py, px + z.re * ks, py - z.im * ks, [Cc.series[0], Cc.series[1], Cc.series[2]][i], 3); txt(c, labels[i], px + z.re * ks * 1.12, py - z.im * ks * 1.12 + 4, [Cc.series[0], Cc.series[1], Cc.series[2]][i], 'center', 11, '600'); });
        txt(c, 'winding voltages (dashed: balanced 3-phase)', px, 262, Cc.muted, 'center', 11);
        // the motor
        const mx = 555, my = 115;
        c.strokeStyle = Cc.text; c.lineWidth = 2; c.beginPath(); c.arc(mx, my, 60, 0, TAU); c.stroke();
        c.fillStyle = Cc.surface2; c.beginPath(); c.arc(mx, my, 48, 0, TAU); c.fill();
        for (let k = 0; k < 12; k++) { const a = rot + k * TAU / 12; kit.dot(c, mx + 40 * Math.cos(a), my + 40 * Math.sin(a), 3.5, Cc.muted); }
        c.strokeStyle = Cc.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(mx, my); c.lineTo(mx + 34 * Math.cos(rot), my + 34 * Math.sin(rot)); c.stroke();
        txt(c, (+V.P) + ' kW, 230 V Δ', mx, my + 86, Cc.text, 'center', 12, '600');
        txt(c, w > 1 ? (dir() > 0 ? 'forward' : 'reverse') : 'stopped', mx, my + 104, Cc.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
  function S3node(c, C, x, y, name) {
    c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 8, 0, TAU); c.fill(); c.stroke();
    txt(c, name, x + 14, y - 8, C.text, 'left', 11, '600');
  }

  /* ================================================================ sp-exzones */
  // illustrative substances: gas group (1 = IIA, 2 = IIB, 3 = IIC) and approximate auto-ignition temperature (°C)
  const GASES = [['Methane (natural gas)', 1, 595], ['Propane', 1, 470], ['Petrol vapour', 1, 260], ['Ethylene', 2, 440], ['Diethyl ether', 2, 170], ['Hydrogen', 3, 560], ['Acetylene', 3, 305]];
  const GRP = ['', 'IIA', 'IIB', 'IIC'], DGRP = ['', 'IIIA', 'IIIB', 'IIIC'];
  // motors: EPL, group, highest surface temperature (°C), temperature rise of that surface at full load (K);
  // Ex e: temperature at rated load and heating rate with the rotor locked (illustrative), giving tE
  const EXMOTORS = [
    { name: 'Standard IP55 motor (no Ex marking)', ex: false, rise: 80 },
    { name: 'Ex ec IIC T3 Gc (non-sparking)', epl: 'Gc', grp: 3, T: 200, rise: 110 },
    { name: 'Ex eb IIC T3 Gb (increased safety)', epl: 'Gb', grp: 3, T: 200, rise: 105, eb: { Tr: 145, rate: 6 } },
    { name: 'Ex eb IIB T4 Gb (increased safety)', epl: 'Gb', grp: 2, T: 135, rise: 80, eb: { Tr: 105, rate: 6 } },
    { name: 'Ex db IIB T4 Gb (flameproof)', epl: 'Gb', grp: 2, T: 135, rise: 85 },
    { name: 'Ex db eb IIC T4 Gb (flameproof, Ex e terminal box)', epl: 'Gb', grp: 3, T: 135, rise: 85 },
    { name: 'Ex tb IIIC T135 °C Db (dust, IP6X)', epl: 'Db', grp: 3, T: 135, rise: 85, dust: true },
    { name: 'Ex tc IIIB T135 °C Dc (dust, IP5X)', epl: 'Dc', grp: 2, T: 135, rise: 85, dust: true }
  ];
  const ZONE_INFO = {
    safe: ['Outside the classified zones', null], z0: ['Zone 0: gas present continuously (inside the tank)', 'no motors'], z1: ['Zone 1: gas likely occasionally (round the vent)', 'Gb'],
    z2: ['Zone 2: gas only in abnormal conditions (round the vent and the pump seal)', 'Gc'], z20: ['Zone 20: dust cloud continuously (inside the silo)', 'no motors'],
    z21: ['Zone 21: dust cloud likely occasionally (round the filling spout)', 'Db'], z22: ['Zone 22: dust only in abnormal conditions', 'Dc']
  };
  Hyper.sim('sp-exzones', {
    title: 'Which motor may go where? Zones, Ex markings and tE',
    blurb: `A small plant: a solvent tank with a vent, a transfer pump with a shaft seal, and a flour silo with a filling spout. The coloured areas are its zones — red zone 0/20, orange zone 1/21, yellow zone 2/22 (dust zones hatched). Drag the motor anywhere; the read-outs say what the spot requires and whether the chosen motor meets it. The graph is an Ex e stall test.

**Try this**
- Put the standard IP55 motor by the pump seal (zone 2): not allowed, however well sealed. Choose *Ex ec IIC T3 Gc*: fine in zone 2 — but drag it to the vent (zone 1) and it is not.
- In zone 1 choose the gas *Diethyl ether* (ignites at about 170 °C): the T3 motors (up to 200 °C) are rejected; only T4 motors of group IIB or IIC pass.
- Choose *Hydrogen*: IIB motors are rejected — IIC is needed.
- Drag a dust motor (Ex tb) to the silo spout (zone 21): for this flour the surface limit is 225 °C (the lower of ⅔ × 420 °C and 300 − 75 °C). A gas-certified motor is not a dust motor.
- Pick an Ex eb motor and press *Stall test*: the locked rotor heats towards its limit; the overload must trip before tE. Lengthen the relay trip time past tE and see the limit exceeded.
- Raise the ambient above 40 °C: surface temperatures rise, and the certificate's ambient range (−20 to +40 °C unless marked) no longer covers it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.47, minH: 250 });
      const [g1] = graphs(box, 1);
      let V = null, mx = 370, my = 228, sc = 1, ox = 0, oy = 0, stall = null, lastPlot = -1, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'gas', type: 'select', label: 'Gas or vapour in the plant', options: GASES.map((g, i) => [g[0] + ' (' + GRP[g[1]] + ', ignites at about ' + g[2] + ' °C)', i]), value: 0 },
        { id: 'mot', type: 'select', label: 'Motor marking', options: EXMOTORS.map((m, i) => [m.name, i]), value: 1 },
        { id: 'amb', label: 'Ambient temperature', min: -20, max: 60, step: 5, value: 40, unit: '°C' },
        { id: 'trip', label: 'Overload trip time at locked-rotor current', min: 1, max: 30, step: 0.5, value: 6, unit: 's' },
        { type: 'buttons', items: [{ id: 'stall', label: 'Stall test (Ex e)', primary: true }] }
      ], id => {
        if (id === 'stall') { const m = EXMOTORS[+V.mot]; stall = m.eb ? { t: 0, T: m.eb.Tr, pts: [[0, m.eb.Tr]], tripped: false } : { none: true }; }
        if (id === 'mot') stall = null;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['z', 'Location'], ['req', 'The spot requires'], ['sub', 'The substance requires'], ['m', 'The motor offers'], ['v', 'Verdict'], ['st', 'Stall test']]);
      const pl = kit.plot(g1, { x: { label: 'time after the rotor locks (s)', min: 0, max: 20 }, y: { label: 'hottest part (°C)' }, legend: true }, 180);
      const VENT = [95, 52], SEAL = [300, 214], SPOUT = [515, 238];
      const d = (a, x, y) => Math.hypot(x - a[0], y - a[1]);
      const zoneAt = (x, y) => {
        if (x > 40 && x < 150 && y > 110 && y < 250) return 'z0';
        if (x > 470 && x < 560 && y > 60 && y < 220) return 'z20';
        if (d(VENT, x, y) < 40) return 'z1';
        if (d(SPOUT, x, y) < 35) return 'z21';
        if (d(VENT, x, y) < 95 || d(SEAL, x, y) < 60) return 'z2';
        if (d(SPOUT, x, y) < 80) return 'z22';
        return 'safe';
      };
      const toScene = p => ({ x: (p.x - ox) / sc, y: (p.y - oy) / sc });
      kit.drag(st, {
        hit: p => { const q = toScene(p); return Math.abs(q.x - mx) < 30 && Math.abs(q.y - my) < 22 ? 'motor' : null; },
        move: (k, p) => { const q = toScene(p); mx = clamp(q.x, 20, 620); my = clamp(q.y, 20, 285); },
        hover: true
      });
      const judge = () => {
        const z = zoneAt(mx, my), m = EXMOTORS[+V.mot], g = GASES[+V.gas], why = [];
        const Tsurf = V.amb + m.rise;
        if (z === 'safe') return { ok: true, why: ['no Ex requirement here'], z, Tsurf };
        if (z === 'z0' || z === 'z20') return { ok: false, why: ['keep motors out of zone ' + (z === 'z0' ? '0' : '20')], z, Tsurf };
        if (!m.ex && m.ex !== undefined) return { ok: false, why: ['no Ex certification — an IP rating is not an Ex rating'], z, Tsurf };
        const dustZone = z === 'z21' || z === 'z22';
        if (dustZone !== !!m.dust) why.push(dustZone ? 'a dust zone needs dust protection (D), not a gas marking' : 'a gas zone needs a gas marking (G), not a dust one');
        const need = ZONE_INFO[z][1];
        const eplOk = need === 'Gb' ? m.epl === 'Gb' : need === 'Gc' ? (m.epl === 'Gb' || m.epl === 'Gc') : need === 'Db' ? m.epl === 'Db' : need === 'Dc' ? (m.epl === 'Db' || m.epl === 'Dc') : false;
        if (!eplOk && dustZone === !!m.dust) why.push('protection level ' + m.epl + ' is not enough for this zone (needs ' + need + (need === 'Gc' ? ' or Gb' : need === 'Dc' ? ' or Db' : '') + ')');
        if (!dustZone && !m.dust) {
          if (m.grp < g[1]) why.push('group ' + GRP[m.grp] + ' does not cover ' + g[0].toLowerCase() + ' (' + GRP[g[1]] + ')');
          if (m.T >= g[2]) why.push('temperature class up to ' + m.T + ' °C is not below the ignition temperature of about ' + g[2] + ' °C');
        }
        if (dustZone && m.dust) { if (m.T > 225) why.push('surface ' + m.T + ' °C is above the 225 °C limit for this flour'); if (m.grp < 2) why.push('dust group too low'); }
        if (V.amb > 40 || V.amb < -20) why.push('ambient ' + V.amb + ' °C is outside −20 to +40 °C (unless the certificate marks a wider range)');
        return { ok: why.length === 0, why: why.length ? why : ['meets zone, group, temperature class and ambient'], z, Tsurf };
      };
      const loop = kit.loop(dt => {
        t += dt;
        const m = EXMOTORS[+V.mot], g = GASES[+V.gas], j = judge(), zi = ZONE_INFO[j.z];
        if (stall && !stall.none && m.eb) {
          const lim = m.T, tE = (lim - m.eb.Tr) / m.eb.rate;
          if (stall.t < 20) {
            const h = dt * 2;                                                         // the test runs twice as fast as real time
            stall.t += h;
            if (!stall.tripped && stall.t >= V.trip) stall.tripped = true;
            stall.T += stall.tripped ? -h * (stall.T - V.amb) / 60 : h * m.eb.rate;
            stall.pts.push([stall.t, stall.T]);
          }
          stall.tE = tE;
        }
        ro.set('z', zi[0]);
        ro.set('req', zi[1] == null ? 'nothing special' : zi[1] === 'no motors' ? 'no motors (relocate)' : 'EPL ' + zi[1] + ' or better (ATEX category ' + (zi[1][1] === 'b' ? '2' : '3') + (zi[1][0] === 'G' ? 'G' : 'D') + ')');
        ro.set('sub', j.z === 'z21' || j.z === 'z22' || j.z === 'z20' ? 'flour dust IIIB: surface at most 225 °C' : g[0] + ': group ' + GRP[g[1]] + ', surfaces below ' + g[2] + ' °C (' + (g[2] > 450 ? 'T1' : g[2] > 300 ? 'T2 or better' : g[2] > 200 ? 'T3 or better' : g[2] > 135 ? 'T4 or better' : 'T5 or better') + ')');
        ro.set('m', m.ex === false ? 'no Ex protection; surface about ' + j.Tsurf + ' °C' : m.epl + ', ' + (m.dust ? DGRP[m.grp] : GRP[m.grp]) + ', surfaces up to ' + m.T + ' °C (about ' + j.Tsurf + ' °C now)');
        ro.set('v', (j.ok ? '✓ acceptable: ' : '✗ not acceptable: ') + j.why.join('; '));
        if (stall && stall.none) ro.set('st', 'tE applies to Ex e (increased safety) motors — choose an Ex eb motor');
        else if (stall && m.eb) { const peak = Math.max(...stall.pts.map(p => p[1])); ro.set('st', 'tE = ' + stall.tE.toFixed(1) + ' s, relay trips at ' + V.trip + ' s: ' + (V.trip <= stall.tE ? 'tripped in time, peak ' + peak.toFixed(0) + ' °C' : 'too slow — the limit of ' + m.T + ' °C is exceeded (peak ' + peak.toFixed(0) + ' °C)')); }
        else ro.set('st', 'press "Stall test" with an Ex eb motor');
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          if (stall && !stall.none && m.eb) pl.set({ series: [{ pts: stall.pts, label: 'hottest part of the stalled motor' }], hlines: [{ y: m.T, label: 'limit ' + m.T + ' °C' }], vlines: [{ x: stall.tE, label: 'tE' }, { x: V.trip, label: 'trip' }] });
          else pl.set({ series: [], hlines: [], vlines: [] });
        }
        // drawing
        const C = kit.colors(), W0 = 640, H0 = 300;
        sc = Math.min(st.W / W0, st.H / H0); ox = (st.W - W0 * sc) / 2; oy = (st.H - H0 * sc) / 2;
        const c = frame(st, W0, H0);
        const zcol = { 0: 'hsl(0 80% 55% / .30)', 1: 'hsl(28 90% 55% / .28)', 2: 'hsl(50 95% 55% / .25)' };
        const circ = (p, r, col, hatch) => { c.fillStyle = col; c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.fill(); if (hatch) { c.save(); c.clip(); c.strokeStyle = 'hsl(30 40% 40% / .35)'; c.lineWidth = 1; for (let k = -r; k < r; k += 8) { c.beginPath(); c.moveTo(p[0] + k, p[1] - r); c.lineTo(p[0] + k + r, p[1] + r); c.stroke(); } c.restore(); } };
        circ(VENT, 95, zcol[2]); circ(SEAL, 60, zcol[2]); circ(VENT, 40, zcol[1]);
        circ(SPOUT, 80, zcol[2], true); circ(SPOUT, 35, zcol[1], true);
        c.fillStyle = C.faint; c.fillRect(0, 262, 640, 4);
        // tank with vent
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(40, 110, 110, 150); c.strokeRect(40, 110, 110, 150);
        c.fillStyle = zcol[0]; c.fillRect(42, 112, 106, 60); c.fillStyle = 'hsl(200 50% 50% / .35)'; c.fillRect(42, 172, 106, 86);
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(95, 110); c.lineTo(95, 58); c.stroke();
        txt(c, 'zone 0', 95, 150, C.bad, 'center', 11, '600'); txt(c, 'solvent tank', 95, 280, C.muted, 'center', 11); txt(c, 'vent', 110, 60, C.muted, 'left', 11);
        // pump and pipe
        c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(150, 240); c.lineTo(282, 240); c.stroke();
        c.fillStyle = C.muted; c.beginPath(); c.arc(300, 232, 20, 0, TAU); c.fill(); txt(c, 'pump', 300, 280, C.muted, 'center', 11); kit.dot(c, SEAL[0] + 22, SEAL[1] + 16, 4, C.warn);
        txt(c, 'seal', 318, 204, C.muted, 'left', 10);
        // silo
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(470, 60, 90, 160); c.strokeRect(470, 60, 90, 160);
        c.fillStyle = 'hsl(0 80% 55% / .25)'; c.fillRect(472, 62, 86, 156); txt(c, 'zone 20', 515, 120, C.bad, 'center', 11, '600'); txt(c, 'flour silo', 515, 50, C.muted, 'center', 11);
        c.beginPath(); c.moveTo(505, 220); c.lineTo(525, 220); c.lineTo(518, 234); c.lineTo(512, 234); c.closePath(); c.fillStyle = C.muted; c.fill();
        txt(c, 'zone 1', VENT[0] - 30, VENT[1] - 8, C.text, 'center', 10); txt(c, 'zone 2', VENT[0] + 64, VENT[1] + 60, C.text, 'center', 10);
        txt(c, 'zone 21', SPOUT[0] - 48, SPOUT[1] + 2, C.text, 'center', 10); txt(c, 'zone 22', SPOUT[0] + 58, SPOUT[1] - 44, C.text, 'center', 10);
        // the motor
        const j2 = judge(), col = j2.ok ? C.ok : C.bad;
        c.fillStyle = C.surface; c.strokeStyle = col; c.lineWidth = 3; c.fillRect(mx - 26, my - 16, 52, 32); c.strokeRect(mx - 26, my - 16, 52, 32);
        for (let k = -18; k <= 18; k += 6) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(mx + k, my - 16); c.lineTo(mx + k, my + 16); c.stroke(); }
        txt(c, 'M', mx, my + 5, C.text, 'center', 14, '700');
        txt(c, j2.ok ? '✓' : '✗', mx + 36, my - 12, col, 'center', 18, '700');
        txt(c, 'drag the motor', mx, my + 32, C.muted, 'center', 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sp-lifecost */
  // illustrative prices (in the reader's currency): a motor of P kW and its class premium; a VFD
  const motorPrice = (kW, cls) => (60 + 95 * Math.pow(kW, 0.85)) * ({ IE2: 1, IE3: 1.15, IE4: 1.4 })[cls];
  const vfdPrice = kW => 200 + 70 * kW;
  Hyper.sim('sp-lifecost', {
    title: 'Purchase against energy: the life-cycle cost',
    blurb: `A motor's cost over its life: its purchase price, then its electricity year after year. The left graph shows the cumulative cost of each option (undiscounted) — where the lines cross, the dearer option has paid for itself. The bars show the discounted life-cycle cost split into purchase and energy. Prices are illustrative round numbers in your currency; efficiencies are typical minimum values for 4-pole, 50 Hz motors of each IE class.

**Try this**
- 11 kW, 6000 h a year, 75 % load: the energy dwarfs the purchase (a thin sliver of each bar), and the IE4 motor repays its extra price over IE2 in about a year.
- Drop the hours to 500 a year: the payback stretches to decades — for a rarely used motor the cheaper class can make sense where rules allow.
- Try 0.75 kW: small motors differ more in efficiency between classes (80 % against 86 %), so the saving per kW is larger.
- Switch to *Throttled pump against a VFD* and set the average flow to 80 %: the drive saves far more than any motor class.
- Raise the discount rate: future savings count for less, and the life-cycle costs shrink — but the ranking rarely changes.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const [g1] = graphs(box, 1);
      let V = null, lastKey = '';
      const ctl = kit.controls(box.side, [
        { id: 'kW', type: 'select', label: 'Motor rating', options: [0.75, 2.2, 7.5, 11, 22, 55].map(k => [k + ' kW', k]), value: 11 },
        { id: 'h', label: 'Running hours per year', min: 250, max: 8760, step: 250, value: 6000, unit: 'h' },
        { id: 'load', label: 'Average load, % of rating', min: 25, max: 100, step: 5, value: 75, unit: '%' },
        { id: 'c', label: 'Electricity price (¤ per kWh)', min: 0.05, max: 0.4, step: 0.01, value: 0.15 },
        { id: 'N', label: 'Years of service', min: 5, max: 25, step: 1, value: 15, unit: 'yr' },
        { id: 'r', label: 'Discount rate', min: 0, max: 10, step: 0.5, value: 5, unit: '%' },
        { id: 'cmp', type: 'select', label: 'Compare', options: [['Efficiency classes IE2, IE3, IE4', 'ie'], ['Throttled pump against a VFD', 'vfd']], value: 'ie' },
        { id: 'flow', label: 'Average flow (VFD comparison)', min: 30, max: 100, step: 5, value: 80, unit: '%' }
      ], () => { ctl.show('flow', V.cmp === 'vfd'); lastKey = ''; });
      V = ctl.values; ctl.show('flow', false);
      const ro = kit.readout(box.side, [['o1', 'Option 1'], ['o2', 'Option 2'], ['o3', 'Option 3'], ['pb', 'Payback of the dearer option'], ['sh', 'Energy share of the life-cycle cost']]);
      const pl = kit.plot(g1, { x: { label: 'years in service', min: 0 }, y: { label: 'cumulative cost', min: 0, fmt: v => kit.money(v, 0, true) }, fmtY: v => kit.money(v, 0), legend: true }, 210);
      let opts = [];
      const loop = kit.loop(() => {
        const key = [V.kW, V.h, V.load, V.c, V.N, V.r, V.cmp, V.flow].join('|');
        if (key !== lastKey) {
          lastKey = key;
          const kW = +V.kW, P = kW * V.load / 100, r = V.r / 100, pv = r > 0 ? (1 - Math.pow(1 + r, -V.N)) / r : V.N;
          if (V.cmp === 'ie') {
            opts = ['IE2', 'IE3', 'IE4'].map(cls => { const eta = M.ieAt(cls, kW) / 100, kWh = P * V.h / eta; return { name: cls + ' (' + (100 * eta).toFixed(1) + ' %)', price: motorPrice(kW, cls), kWh, cost: kWh * V.c }; });
          } else {
            const eta = M.ieAt('IE3', kW) / 100, Pfull = P / eta, x = V.flow / 100;
            const thr = Pfull * (0.55 + 0.45 * x), vfd = Pfull * x * x * x / 0.97;
            opts = [{ name: 'IE3 motor, throttling valve', price: motorPrice(kW, 'IE3'), kWh: thr * V.h, cost: thr * V.h * V.c }, { name: 'IE3 motor + VFD', price: motorPrice(kW, 'IE3') + vfdPrice(kW), kWh: vfd * V.h, cost: vfd * V.h * V.c }];
          }
          opts.forEach(o => { o.lcc = o.price + o.cost * pv; });
          const ser = opts.map(o => { const pts = []; for (let y = 0; y <= V.N; y += 0.25) pts.push([y, o.price + o.cost * y]); return { pts, label: o.name }; });
          // payback of the most expensive option against the cheapest to buy
          const cheap = opts.reduce((a, b) => a.price < b.price ? a : b), dear = opts.reduce((a, b) => a.price > b.price ? a : b);
          const save = cheap.cost - dear.cost, pb = save > 0 ? (dear.price - cheap.price) / save : Infinity;
          pl.set({ x: { label: 'years in service', min: 0, max: V.N }, series: ser, vlines: Number.isFinite(pb) && pb < V.N ? [{ x: pb, label: 'payback' }] : [] });
          ['o1', 'o2', 'o3'].forEach((k, i) => { const o = opts[i]; ro.show(k, !!o); if (o) ro.set(k, o.name + ': buy ' + kit.money(o.price, 0) + ', ' + Math.round(o.kWh).toLocaleString('en-GB') + ' kWh = ' + kit.money(o.cost, 0) + ' a year; LCC ' + kit.money(o.lcc, 0)); });
          ro.set('pb', Number.isFinite(pb) ? pb.toFixed(1) + ' years (' + dear.name + ' against ' + cheap.name + ')' : 'never — it does not save energy here');
          ro.set('sh', (100 * (1 - cheap.price / cheap.lcc)).toFixed(1) + ' % (' + cheap.name + ')');
        }
        // the bars: discounted life-cycle cost, purchase and energy
        const C = kit.colors(), c = frame(st, 640, 230);
        const maxL = Math.max(1, ...opts.map(o => o.lcc)), x0 = 190, wBar = 400;
        txt(c, 'Life-cycle cost (present value over ' + V.N + ' years at ' + V.r + ' %)', 320, 22, C.text, 'center', 13, '600');
        opts.forEach((o, i) => {
          const y = 50 + i * 56, wp = wBar * o.price / maxL, we = wBar * (o.lcc - o.price) / maxL;
          txt(c, o.name, x0 - 10, y + 18, C.text, 'right', 12, '600');
          c.fillStyle = C.series[1]; c.fillRect(x0, y, Math.max(1, wp), 28);
          c.fillStyle = C.series[0]; c.fillRect(x0 + wp, y, we, 28);
          txt(c, kit.money(o.lcc, 0), x0 + wp + we + 6, y + 18, C.text, 'left', 12);
        });
        c.fillStyle = C.series[1]; c.fillRect(x0, 215, 12, 10); txt(c, 'purchase', x0 + 16, 224, C.muted, 'left', 11);
        c.fillStyle = C.series[0]; c.fillRect(x0 + 90, 215, 12, 10); txt(c, 'energy (discounted)', x0 + 106, 224, C.muted, 'left', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
