/* HYPER-PHYSICS · sims/sound.js — simulations for the Sound & Hearing branch:
 * travelling waves, superposition, reflection at a boundary, standing waves,
 * the Doppler effect and the Mach cone, beats, resonating pipes and Fourier synthesis.
 *
 * Several sims have a Play button. Sound comes from the Web Audio API: the audio
 * context is created on the first click (never on load), volumes are kept low, sound
 * stops when the sim is reset or left, and every sim works silently where there is
 * no audio (the headless tester, old browsers). */
(function () {
  'use strict';

  /* ================================================================ shared helpers */

  let AUDIO = null;                         // one context for the whole page, made on a click
  function audio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      if (!AUDIO) AUDIO = new AC();
      if (AUDIO.state === 'suspended' && AUDIO.resume) AUDIO.resume();
      return AUDIO;
    } catch (e) { return null; }
  }

  /* Steady tones: parts = [{ f, type | wave, gain }], faded in and out to avoid clicks.
     Returns { freq(i, f), level(v), wave(i, w), stop() }. */
  function tones(ac, parts, level) {
    const t0 = ac.currentTime;
    const out = ac.createGain();
    out.gain.setValueAtTime(0, t0);
    out.gain.linearRampToValueAtTime(level, t0 + 0.06);
    out.connect(ac.destination);
    const osc = parts.map(p => {
      const o = ac.createOscillator();
      if (p.wave) o.setPeriodicWave(p.wave); else o.type = p.type || 'sine';
      o.frequency.setValueAtTime(p.f, t0);
      const g = ac.createGain();
      g.gain.setValueAtTime(p.gain == null ? 1 : p.gain, t0);
      o.connect(g); g.connect(out);
      o.start(t0);
      return o;
    });
    let done = false;
    return {
      freq(i, f) { if (!done && osc[i] && f > 0 && isFinite(f)) osc[i].frequency.setTargetAtTime(f, ac.currentTime, 0.015); },
      level(v) { if (!done) out.gain.setTargetAtTime(v, ac.currentTime, 0.03); },
      wave(i, w) { if (!done && osc[i] && w) osc[i].setPeriodicWave(w); },
      stop() {
        if (done) return;
        done = true;
        const t = ac.currentTime;
        try {
          out.gain.cancelScheduledValues(t);
          out.gain.setValueAtTime(out.gain.value, t);
          out.gain.linearRampToValueAtTime(0, t + 0.08);
          osc.forEach(o => o.stop(t + 0.1));
        } catch (e) { /* already stopped */ }
      }
    };
  }

  /* A Play/Stop button. start(ac) returns an object with stop(), or null. */
  function player(ctl, id, labels, start, say) {
    let cur = null;
    const btn = ctl.rows[id];
    const show = on => { if (btn) btn.textContent = on ? labels[1] : labels[0]; };
    const api = {
      get on() { return !!cur; },
      get cur() { return cur; },
      toggle() { if (cur) api.stop(); else api.play(); },
      play() {
        const ac = audio();
        if (!ac) { say('not available in this browser'); return; }
        try { cur = start(ac); } catch (e) { cur = null; say('could not start'); }
        show(!!cur);
      },
      stop() {
        if (cur) { try { cur.stop(); } catch (e) { /* ignore */ } cur = null; }
        show(false);
      }
    };
    return api;
  }

  /* 261.6 Hz -> "C4", 445 Hz -> "A4 +20¢" (equal temperament, A4 = 440 Hz) */
  const NOTES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  function noteName(f) {
    if (!(f > 0) || !isFinite(f)) return '—';
    const m = 69 + 12 * Math.log2(f / 440);
    const r = Math.round(m), cents = Math.round((m - r) * 100);
    const name = NOTES[((r % 12) + 12) % 12] + (Math.floor(r / 12) - 1);
    return cents ? name + (cents > 0 ? ' +' : ' −') + Math.abs(cents) + '¢' : name;
  }

  const TAU = Math.PI * 2;
  const font = () => getComputedStyle(document.body).fontFamily;

  /* faint metre marks along the bottom of a stage */
  function metreMarks(c, kit, C, X, from, to, yTop, yBot) {
    c.save();
    c.font = '11px ' + font();
    c.textAlign = 'center';
    for (let m = Math.ceil(from); m <= to + 1e-9; m++) {
      const x = Math.round(X(m)) + 0.5;
      c.strokeStyle = C.grid; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x, yTop); c.lineTo(x, yBot); c.stroke();
      c.fillStyle = C.faint;
      c.fillText(m + (m === Math.ceil(from) ? ' m' : ''), x, yBot + 13);
    }
    c.restore();
  }

  function polyline(c, pts, color, width, dash) {
    if (pts.length < 2) return;
    c.save();
    c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round';
    c.setLineDash(dash || []);
    c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]));
    c.stroke();
    c.restore();
  }

  /* a double-headed bracket with a label, for wavelengths */
  function bracket(c, kit, x1, x2, y, text, color, below) {
    if (!(Math.abs(x2 - x1) > 6)) return;
    kit.arrow(c, (x1 + x2) / 2, y, x1, y, color, 1.4, 7);
    kit.arrow(c, (x1 + x2) / 2, y, x2, y, color, 1.4, 7);
    kit.label(c, text, (x1 + x2) / 2, below ? y + 11 : y - 10, { align: 'center', size: 12, color, bg: kit.colors().bg2 });
  }

  /* ================================================================ 1. travelling wave */

  Hyper.sim('sound-travelling-wave', {
    title: 'Travelling wave: transverse and longitudinal',
    blurb: `A source at the left end shakes the medium and the wave carries the pattern to the right. The red particles show what the medium itself does.

- Follow a red particle: it only oscillates about its own place while the crests (▼) or compressions (C) sweep past it.
- Change the **wave speed** with the frequency fixed: the wavelength follows, $\\lambda = v/f$. Change the frequency: the speed stays, the wavelength shrinks.
- Switch to **Longitudinal**: the particles now move along the direction of travel. The graph underneath plots each particle's displacement upwards — that is the sine curve usually drawn for sound.
- Compare the particles' top speed $A\\omega$ with the wave speed: two unrelated speeds.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      let running = true, t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Kind of wave', options: [['Transverse (a string)', 'T'], ['Longitudinal (sound in air)', 'L']], value: params.mode === 'L' ? 'L' : 'T' },
        { id: 'v', label: 'Wave speed (set by the medium)', min: 0.5, max: 4, step: 0.1, value: 2, unit: 'm/s' },
        { id: 'f', label: 'Frequency (set by the source)', min: 0.2, max: 1.5, step: 0.05, value: 0.5, unit: 'Hz' },
        { id: 'A', label: 'Amplitude', min: 0.05, max: 0.4, step: 0.01, value: 0.25, unit: 'm' },
        { id: 'mark', type: 'check', label: 'Mark two particles', value: true },
        { id: 'graph', type: 'check', label: 'Displacement graph (longitudinal)', value: true },
        { type: 'buttons', items: [{ id: 'pause', label: 'Pause' }] }
      ], id => {
        if (id === 'pause') { running = !running; if (ctl.rows.pause) ctl.rows.pause.textContent = running ? 'Pause' : 'Run'; }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['lam', 'Wavelength λ = v/f'], ['T', 'Period T = 1/f'], ['u', 'Top particle speed Aω'], ['amp', 'Amplitude drawn']]);
      const V = ctl.values;
      const XL = 8;                                           // metres of medium on screen
      const MARKS = [2, 5];

      function frame(dt) {
        if (running) t += dt;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, padL = 30, padR = 18;
        const sx = (W - padL - padR) / XL;
        const X = x => padL + x * sx;
        const w = TAU * V.f, k = w / V.v, lam = V.v / V.f;
        const phase = x => k * x - w * t;
        let Aeff = V.A;

        if (V.mode === 'T') {
          const y0 = H * 0.52, sy = H * 0.3 / 0.4;           // px per metre of displacement
          metreMarks(c, kit, C, X, 0, XL, H * 0.1, H - 22);
          c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 5]);
          c.beginPath(); c.moveTo(X(0), y0); c.lineTo(X(XL), y0); c.stroke(); c.restore();
          if (V.mark) for (const xm of MARKS) {
            c.save(); c.strokeStyle = C.bad; c.globalAlpha = 0.35; c.lineWidth = 6; c.lineCap = 'round';
            c.beginPath(); c.moveTo(X(xm), y0 - V.A * sy); c.lineTo(X(xm), y0 + V.A * sy); c.stroke(); c.restore();
          }
          const pts = [];
          for (let px = X(0); px <= X(XL) + 0.5; px += 2) { const x = (px - padL) / sx; pts.push([px, y0 - V.A * Math.sin(phase(x)) * sy]); }
          polyline(c, pts, C.accent, 2.4);
          for (let i = 0; i <= 48; i++) {
            const x = i * XL / 48;
            kit.dot(c, X(x), y0 - V.A * Math.sin(phase(x)) * sy, 3, C.text2 || C.muted);
          }
          if (V.mark) for (const xm of MARKS) kit.dot(c, X(xm), y0 - V.A * Math.sin(phase(xm)) * sy, 6, C.bad, C.bg2);
          // crests: phase = π/2 + 2πm
          const crests = [];
          const m0 = Math.ceil(-(Math.PI / 2 + w * t) / TAU) - 1;
          for (let m = m0; m < m0 + 60; m++) {
            const x = (Math.PI / 2 + w * t + TAU * m) / k;
            if (x > XL) break;
            if (x >= 0) crests.push(x);
          }
          for (const x of crests) kit.label(c, '▼', X(x), y0 - V.A * sy - 12, { align: 'center', size: 13, color: C.warn });
          if (crests.length >= 2) bracket(c, kit, X(crests[0]), X(crests[1]), y0 - V.A * sy - 34, 'λ = ' + kit.fmt(lam, 3) + ' m', C.muted);
          else kit.label(c, 'λ = ' + kit.fmt(lam, 3) + ' m (longer than the screen)', X(XL / 2), H * 0.08, { align: 'center', size: 12, color: C.muted });
          // the source
          kit.label(c, 'source', X(0), y0 + V.A * sy + 26, { align: 'center', size: 11, color: C.faint });
        } else {
          Aeff = Math.min(V.A, 0.55 / k);                     // keep neighbouring layers from crossing
          const top = H * 0.12, bandH = V.graph ? H * 0.4 : H * 0.72, rows = 9, cols = 64, dx = XL / cols;
          c.save(); c.beginPath(); c.rect(X(0) - 8, 0, X(XL) - X(0) + 16, H); c.clip();
          // density: darker where compressed, -ds/dx = -A k cos(phase)
          c.fillStyle = C.accent;
          for (let px = X(0); px < X(XL); px += 3) {
            const comp = -Aeff * k * Math.cos(phase((px - padL) / sx));
            if (comp > 0) { c.globalAlpha = Math.min(0.4, comp * 0.7); c.fillRect(px, top, 3, bandH); }
          }
          c.globalAlpha = 1;
          for (let i = 0; i <= cols; i++) {
            for (let r = 0; r < rows; r++) {
              const x = (i + (r % 2) * 0.5) * dx;
              if (x > XL) continue;
              const marked = V.mark && r % 2 === 0 && MARKS.some(xm => Math.abs(xm - x) < 1e-6);
              kit.dot(c, X(x + Aeff * Math.sin(phase(x))), top + (r + 0.5) * bandH / rows, marked ? 4.5 : 2.3, marked ? C.bad : (C.text2 || C.muted));
            }
          }
          c.restore();
          if (V.mark) for (const xm of MARKS) {
            c.save(); c.strokeStyle = C.bad; c.lineWidth = 2;
            c.beginPath(); c.moveTo(X(xm - Aeff), top + bandH + 6); c.lineTo(X(xm + Aeff), top + bandH + 6); c.stroke(); c.restore();
          }
          // compressions (phase = π) and rarefactions (phase = 0)
          const labels = [];
          const m0 = Math.floor(-(Math.PI + w * t) / TAU) - 1;
          for (let m = m0; m < m0 + 80; m++) {
            const xc = (Math.PI + w * t + TAU * m) / k, xr = (w * t + TAU * m) / k;
            if (xr > XL && xc > XL) break;
            if (xc >= 0 && xc <= XL) labels.push([xc, 'C']);
            if (xr >= 0 && xr <= XL) labels.push([xr, 'R']);
          }
          for (const [x, s] of labels) kit.label(c, s, X(x), top - 11, { align: 'center', size: 12, weight: 700, color: s === 'C' ? C.accent : C.faint });
          if (V.graph) {
            const g0 = top + bandH + 42, gh = H - g0 - 20, gy = g0 + gh / 2, gs = (gh / 2 - 4) / 0.4;
            c.save(); c.strokeStyle = C.axis; c.lineWidth = 1;
            c.beginPath(); c.moveTo(X(0), gy); c.lineTo(X(XL), gy); c.stroke(); c.restore();
            for (const [x, s] of labels) if (s === 'C') {
              c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.35; c.setLineDash([3, 4]);
              c.beginPath(); c.moveTo(X(x), top); c.lineTo(X(x), g0 + gh); c.stroke(); c.restore();
            }
            const pts = [];
            for (let px = X(0); px <= X(XL) + 0.5; px += 2) { const x = (px - padL) / sx; pts.push([px, gy - Aeff * Math.sin(phase(x)) * gs]); }
            polyline(c, pts, C.series[1], 2);
            if (V.mark) for (const xm of MARKS) kit.dot(c, X(xm), gy - Aeff * Math.sin(phase(xm)) * gs, 4.5, C.bad);
            kit.label(c, 'displacement s (to the right drawn upwards)', X(0) + 4, g0 + 2, { size: 11, color: C.muted });
          }
          const cs = labels.filter(l => l[1] === 'C').map(l => l[0]).sort((a, b) => a - b);
          if (cs.length >= 2) bracket(c, kit, X(cs[0]), X(cs[1]), top + bandH + 16, 'λ = ' + kit.fmt(lam, 3) + ' m', C.muted, true);
        }
        ro.set('lam', kit.fmt(lam, 3) + ' m');
        ro.set('T', kit.fmt(1 / V.f, 3) + ' s');
        ro.set('u', kit.fmt(Aeff * w, 3) + ' m/s (wave: ' + kit.fmt(V.v, 3) + ' m/s)');
        ro.set('amp', kit.fmt(Aeff, 2) + ' m' + (Aeff < V.A - 1e-9 ? ' (limited so layers never cross)' : ''));
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. superposition */

  Hyper.sim('sound-superposition', {
    title: 'Superposition of pulses and waves',
    blurb: `The thick line is the medium. At every point its displacement is the **sum** of what each wave alone would give (the thin lines).

- Send two upright pulses, then make the second amplitude negative: for an instant the string is flat — yet it is moving, and both pulses reappear.
- The pulses are lopsided, steep at the front. After they meet each still has its steep side in front: they passed **through** each other, they did not bounce.
- Switch to **Two waves** and turn the phase difference: 0° doubles the amplitude, 180° cancels it, 120° leaves exactly one wave's amplitude.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52 });
      let t = 0, running = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What meets', options: [['Two pulses, opposite directions', 'pulses'], ['Two waves, same direction', 'waves']], value: 'pulses' },
        { id: 'a2', label: 'Amplitude of the second (− = inverted)', min: -1, max: 1, step: 0.05, value: 1 },
        { id: 'w', label: 'Pulse width', min: 0.2, max: 1.2, step: 0.05, value: 0.5, unit: 'm' },
        { id: 'phi', label: 'Phase difference (waves)', min: 0, max: 360, step: 5, value: 0, unit: '°' },
        { id: 'parts', type: 'check', label: 'Show the separate waves', value: true },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Send pulses', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], id => {
        if (id === 'go' || id === 'mode' || id === 'w') t = 0;
        if (id === 'pause') { running = !running; if (ctl.rows.pause) ctl.rows.pause.textContent = running ? 'Pause' : 'Run'; }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['res', 'Resultant amplitude'], ['kind', 'Interference'], ['t', 'Time']]);
      const V = ctl.values;
      const L = 10, v = 2, X1 = 1.5, X2 = 8.5, lamW = 2.5;
      // a lopsided pulse: steep on the side it is heading towards
      const pulse = (u, w, dir) => { const s = (u * dir > 0 ? 0.55 : 1.3) * w; return Math.exp(-(u / s) * (u / s)); };

      function frame(dt) {
        if (running) t += dt * (V.slow ? 0.3 : 1);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, padL = 30, padR = 18;
        const sx = (W - padL - padR) / L, X = x => padL + x * sx;
        const y0 = H * 0.55, sy = H * 0.2;
        metreMarks(c, kit, C, X, 0, L, H * 0.08, H - 22);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 5]);
        c.beginPath(); c.moveTo(X(0), y0); c.lineTo(X(L), y0); c.stroke(); c.restore();
        let f1, f2;
        if (V.mode === 'pulses') {
          const tOut = (L - X1 + 3 * V.w) / v;
          if (t > tOut + 0.8) t = 0;
          const c1 = X1 + v * t, c2 = X2 - v * t;
          f1 = x => pulse(x - c1, V.w, 1);
          f2 = x => V.a2 * pulse(x - c2, V.w, -1);
        } else {
          const k = TAU / lamW, om = k * v, ph = V.phi * Math.PI / 180;
          f1 = x => Math.sin(k * x - om * t);
          f2 = x => V.a2 * Math.sin(k * x - om * t + ph);
        }
        const p1 = [], p2 = [], ps = [];
        let big = 0;
        for (let px = X(0); px <= X(L) + 0.5; px += 2) {
          const x = (px - padL) / sx, a = f1(x), b = f2(x);
          p1.push([px, y0 - a * sy]); p2.push([px, y0 - b * sy]); ps.push([px, y0 - (a + b) * sy]);
          big = Math.max(big, Math.abs(a + b));
        }
        if (V.parts) {
          polyline(c, p1, C.series[1], 1.5, [6, 4]);
          polyline(c, p2, C.series[2], 1.5, [6, 4]);
          kit.label(c, V.mode === 'pulses' ? 'pulse 1 →' : 'wave 1', X(0) + 4, H * 0.06, { size: 11.5, color: C.series[1] });
          kit.label(c, V.mode === 'pulses' ? '← pulse 2' : 'wave 2', X(0) + 110, H * 0.06, { size: 11.5, color: C.series[2] });
        }
        polyline(c, ps, C.accent, 3);
        kit.label(c, 'sum', X(0) + 200, H * 0.06, { size: 11.5, color: C.accent, weight: 700 });
        if (V.mode === 'pulses') {
          const c1 = X1 + v * t, c2 = X2 - v * t;
          const apart = Math.abs(c1 - c2) > 3.5 * V.w;
          ro.set('res', 'largest now ' + kit.fmt(big, 2) + ' (one pulse = 1)');
          ro.set('kind', apart ? 'pulses apart' : 'overlapping: y = y₁ + y₂');
          ro.set('t', kit.fmt(t, 3) + ' s');
        } else {
          const ph = V.phi * Math.PI / 180;
          const R = Math.sqrt(Math.max(0, 1 + V.a2 * V.a2 + 2 * V.a2 * Math.cos(ph)));
          ro.set('res', kit.fmt(R, 3) + ' (wave 1 = 1)');
          ro.set('kind', R > Math.max(1, Math.abs(V.a2)) + 0.02 ? 'constructive' : R < Math.abs(1 - Math.abs(V.a2)) + 0.02 ? 'destructive' : 'partial');
          ro.set('t', kit.fmt(t, 3) + ' s');
        }
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. reflection */

  Hyper.sim('sound-reflection', {
    title: 'A pulse meets a boundary',
    blurb: `A pulse runs along a string towards its end, or towards a knot joining it to a second string under the same tension. The second string's thickness shows its mass per metre.

- **Fixed end**: the pulse comes back upside down. **Free end** (a ring sliding on a pole): it comes back upright, and the end briefly jumps to twice the height.
- **Heavier second string**: part of the pulse goes on, slower and shorter; the reflection is inverted, as at a fixed end.
- **Lighter second string**: the reflection is upright, as at a free end, and the transmitted pulse is *taller* than the incoming one — yet it carries less energy.
- Make the two strings nearly equal: the reflection fades away (matched impedance).`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5 });
      let t = 0;
      const B0 = ['fixed', 'free', 'heavy', 'light'].includes(params.boundary) ? params.boundary : 'fixed';
      const ctl = kit.controls(box.side, [
        { id: 'b', type: 'select', label: 'Boundary', options: [['Fixed end (a wall)', 'fixed'], ['Free end (a ring on a pole)', 'free'], ['Knot to a heavier string', 'heavy'], ['Knot to a lighter string', 'light']], value: B0 },
        { id: 'q', label: 'Mass per metre, one string ÷ the other', min: 1, max: 25, value: 4, log: true, sig: 2 },
        { id: 'parts', type: 'check', label: 'Show incident and reflected parts', value: true },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Send pulse', primary: true }] }
      ], id => {
        if (id === 'go' || id === 'b') t = 0;
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['r', 'Reflected amplitude r'], ['tt', 'Transmitted amplitude t'], ['v2', 'Speed in second string'], ['R', 'Energy reflected'], ['T', 'Energy transmitted']]);
      const V = ctl.values;
      const v1 = 2, x0 = -4.2, w = 0.45, XM = 6;
      const g = u => Math.exp(-(u / w) * (u / w));

      function coeffs() {
        const b = V.b;
        if (b === 'fixed') return { r: -1, tt: 0, v2: 0, z: Infinity, joint: false };
        if (b === 'free') return { r: 1, tt: 0, v2: 0, z: 0, joint: false };
        const q = b === 'heavy' ? V.q : 1 / V.q;                   // mu2 / mu1
        const z = Math.sqrt(q);                                   // Z2 / Z1 at equal tension
        return { r: (1 - z) / (1 + z), tt: 2 / (1 + z), v2: v1 / z, z, q, joint: true };
      }

      function frame(dt) {
        const K = coeffs();
        const tEnd = (-x0 + XM + 4 * w) / v1;
        if (t < tEnd) t = Math.min(tEnd, t + dt * (V.slow ? 0.3 : 1));
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, padL = 24, padR = 24;
        const sx = (W - padL - padR) / (2 * XM), X = x => padL + (x + XM) * sx;
        const y0 = H * 0.56, sy = H * 0.2;
        metreMarks(c, kit, C, x => X(x), -XM, K.joint ? XM : 0, H * 0.08, H - 22);
        const inc = x => g(x - x0 - v1 * t);
        const ref = x => K.r * g(-x - x0 - v1 * t);
        const tra = x => K.tt * g(x * v1 / K.v2 - x0 - v1 * t);
        // string 1
        const p1 = [], pi = [], pr = [];
        for (let px = X(-XM); px <= X(0) + 0.5; px += 2) {
          const x = Math.min(0, (px - padL) / sx - XM);
          p1.push([px, y0 - (inc(x) + ref(x)) * sy]); pi.push([px, y0 - inc(x) * sy]); pr.push([px, y0 - ref(x) * sy]);
        }
        if (V.parts) { polyline(c, pi, C.series[1], 1.4, [6, 4]); polyline(c, pr, C.series[2], 1.4, [6, 4]); }
        polyline(c, p1, C.accent, 2.2);
        const yEnd = y0 - (inc(0) + ref(0)) * sy;
        if (K.joint) {
          const p2 = [];
          for (let px = X(0); px <= X(XM) + 0.5; px += 2) { const x = Math.max(0, (px - padL) / sx - XM); p2.push([px, y0 - tra(x) * sy]); }
          polyline(c, p2, C.accent, Math.max(1, Math.min(7, 2.2 * Math.pow(K.q, 0.35))));
          kit.dot(c, X(0), yEnd, 4.5, C.warn);
          kit.label(c, K.q > 1 ? 'heavier string' : 'lighter string', X(XM / 2), H * 0.1, { align: 'center', size: 11.5, color: C.muted });
        } else if (V.b === 'fixed') {
          c.save(); c.fillStyle = C.border2 || C.faint; c.fillRect(X(0), H * 0.12, 14, H * 0.76); c.restore();
          kit.dot(c, X(0), y0, 4, C.warn);
        } else {
          c.save(); c.strokeStyle = C.border2 || C.faint; c.lineWidth = 3;
          c.beginPath(); c.moveTo(X(0), H * 0.08); c.lineTo(X(0), H * 0.92); c.stroke(); c.restore();
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 2.5;
          c.beginPath(); c.ellipse ? c.ellipse(X(0), yEnd, 5, 9, 0, 0, TAU) : c.arc(X(0), yEnd, 7, 0, TAU); c.stroke(); c.restore();
        }
        if (V.parts) {
          kit.label(c, 'incident', X(-XM) + 4, H * 0.06, { size: 11.5, color: C.series[1] });
          kit.label(c, 'reflected', X(-XM) + 70, H * 0.06, { size: 11.5, color: C.series[2] });
        }
        if (t >= tEnd) kit.label(c, 'press Send pulse to go again', X(-XM / 2), H - 40, { align: 'center', size: 11.5, color: C.faint });
        ro.set('r', (K.r > 0 ? '+' : '') + kit.fmt(K.r, 3) + (K.r < 0 ? ' (inverted)' : ' (upright)'));
        ro.set('tt', K.joint ? kit.fmt(K.tt, 3) : '— (nothing beyond the end)');
        ro.set('v2', K.joint ? kit.fmt(K.v2 / v1, 3) + ' × the first' : '—');
        ro.set('R', kit.fmt(100 * K.r * K.r, 3) + ' %');
        ro.set('T', K.joint ? kit.fmt(100 * K.z * K.tt * K.tt, 3) + ' %' : '0 %');
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4. standing waves */

  Hyper.sim('sound-standing-waves', {
    title: 'Standing waves on a string',
    blurb: `A string fixed at both ends, vibrating in one of its normal modes. The motion is slowed down enormously so you can watch it; **Play** lets you hear the real frequency.

- Step through the harmonics: $n$ loops, $n + 1$ nodes (N), and $f_n = n f_1$.
- Tick **Show the two travelling waves**: two equal waves running in opposite directions add up to the standing pattern.
- Quadruple the tension: every frequency doubles. Make the string heavier or longer: the pitch drops.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5 });
      let t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Harmonic n', min: 1, max: 8, step: 1, value: params.n || 3 },
        { id: 'L', label: 'String length', min: 0.3, max: 1, step: 0.01, value: 0.65, unit: 'm' },
        { id: 'T', label: 'Tension', min: 20, max: 150, step: 1, value: 70, unit: 'N' },
        { id: 'mu', label: 'Mass per metre', min: 0.3, max: 10, value: 0.4, log: true, sig: 2, unit: 'g/m' },
        { id: 'env', type: 'check', label: 'Show the envelope', value: true },
        { id: 'trav', type: 'check', label: 'Show the two travelling waves', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Play ♪', primary: true }] }
      ], id => {
        if (id === 'play') snd.toggle();
        else if (snd.on && snd.cur) snd.cur.freq(0, calc().fn);
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['v', 'Wave speed √(T/μ)'], ['lam', 'Wavelength 2L/n'], ['fn', 'Frequency fₙ'], ['f1', 'Fundamental f₁'], ['nodes', 'Nodes'], ['snd', 'Sound']]);
      const V = ctl.values;
      const calc = () => {
        const v = Math.sqrt(V.T / (V.mu / 1000));
        return { v, f1: v / (2 * V.L), fn: V.n * v / (2 * V.L), lam: 2 * V.L / V.n };
      };
      const snd = player(ctl, 'play', ['Play ♪', 'Stop'], ac => { ro.set('snd', 'playing fₙ'); return tones(ac, [{ f: calc().fn }], 0.08); }, s => ro.set('snd', s));

      function frame(dt) {
        t += dt;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const xa = 46, xb = W - 46, y0 = H * 0.48, amp = H * 0.26;
        const n = Math.round(V.n), om = TAU * 0.35 * n;       // slowed-down display frequency
        const K = calc();
        const S = u => Math.sin(n * Math.PI * u);              // u from 0 to 1 along the string
        // clamps
        c.fillStyle = C.border2 || C.faint;
        c.fillRect(xa - 14, y0 - 40, 12, 80); c.fillRect(xb + 2, y0 - 40, 12, 80);
        c.save(); c.strokeStyle = C.faint; c.setLineDash([4, 5]);
        c.beginPath(); c.moveTo(xa, y0); c.lineTo(xb, y0); c.stroke(); c.restore();
        const N = Math.max(60, Math.round((xb - xa) / 2));
        if (V.env) {
          const up = [], dn = [];
          for (let i = 0; i <= N; i++) { const u = i / N, x = xa + u * (xb - xa); up.push([x, y0 - amp * S(u)]); dn.push([x, y0 + amp * S(u)]); }
          polyline(c, up, C.faint, 1, [3, 4]); polyline(c, dn, C.faint, 1, [3, 4]);
        }
        if (V.trav) {
          const a = [], b = [];
          for (let i = 0; i <= N; i++) {
            const u = i / N, x = xa + u * (xb - xa), kx = n * Math.PI * u;
            a.push([x, y0 - amp / 2 * Math.sin(kx - om * t)]); b.push([x, y0 - amp / 2 * Math.sin(kx + om * t)]);
          }
          polyline(c, a, C.series[1], 1.5, [6, 4]); polyline(c, b, C.series[2], 1.5, [6, 4]);
          kit.label(c, 'wave going right', xa, H * 0.05, { size: 11.5, color: C.series[1] });
          kit.label(c, 'wave going left', xa + 130, H * 0.05, { size: 11.5, color: C.series[2] });
        }
        const s = [];
        for (let i = 0; i <= N; i++) { const u = i / N; s.push([xa + u * (xb - xa), y0 - amp * S(u) * Math.cos(om * t)]); }
        polyline(c, s, C.accent, 3);
        for (let j = 0; j <= n; j++) {
          const x = xa + j * (xb - xa) / n;
          kit.dot(c, x, y0, 4.5, C.bad);
          kit.label(c, 'N', x, y0 + 16, { align: 'center', size: 11.5, weight: 700, color: C.bad });
        }
        for (let j = 0; j < n; j++) kit.label(c, 'A', xa + (j + 0.5) * (xb - xa) / n, y0 - amp - 12, { align: 'center', size: 11.5, weight: 700, color: C.ok });
        const yb = y0 + amp + 26;
        if (n >= 2) bracket(c, kit, xa, xa + 2 * (xb - xa) / n, yb, 'λ = ' + kit.fmt(K.lam, 3) + ' m', C.muted);
        else bracket(c, kit, xa, xb, yb, 'L = λ/2', C.muted);
        ro.set('v', kit.fmt(K.v, 3) + ' m/s');
        ro.set('lam', kit.fmt(K.lam, 3) + ' m');
        ro.set('fn', kit.fmt(K.fn, 4) + ' Hz (' + noteName(K.fn) + ')');
        ro.set('f1', kit.fmt(K.f1, 4) + ' Hz');
        ro.set('nodes', (n + 1) + ' (counting both ends)');
        if (!snd.on) ro.set('snd', 'press Play to hear fₙ');
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
      return () => snd.stop();
    }
  });

  /* ================================================================ 5. Doppler effect and Mach cone */

  Hyper.sim('sound-doppler', {
    title: 'Doppler effect and the Mach cone',
    blurb: `A source moves to the right through still air, sending out a wavefront at regular intervals (drawn greatly slowed down). Each ring stays centred where it was emitted.

- Below Mach 1 the rings crowd together ahead of the source (higher frequency) and spread out behind (lower).
- At Mach 1 they pile up into a single front: the "sound barrier".
- Above Mach 1 the source outruns its own sound and the rings are enclosed by a cone with $\\sin\\theta = 1/M$. Nobody ahead hears anything until the cone arrives.
- **Play pass-by** lets you hear the source go past you at 15 m, with the real speed of sound (below Mach 1).`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      let ts = 0, lastEmit = -1, xs = null, pass = 0, fronts = [];
      const M0 = typeof params.M === 'number' ? Math.min(2, Math.max(0, params.M)) : 0.6;
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Source speed (Mach number)', min: 0, max: 2, step: 0.01, value: M0 },
        { id: 'f', label: 'Source frequency', min: 200, max: 1000, step: 10, value: 440, unit: 'Hz' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart' }, { id: 'play', label: 'Play pass-by ♪', primary: true }] }
      ], id => {
        if (id === 'restart') { fronts = []; xs = null; ts = 0; lastEmit = -1; }
        if (id === 'play') { if (snd.on) snd.stop(); else if (V.M >= 0.95) ro.set('snd', 'below Mach 0.95 only: faster, you would hear a boom, not a pitch'); else snd.play(); }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['u', 'Source speed (air at 20 °C)'], ['ahead', 'Heard ahead'], ['behind', 'Heard behind'], ['cone', 'Mach cone half-angle'], ['snd', 'Sound']]);
      const V = ctl.values;
      let passEnd = 0;
      /* The pitch a listener 15 m from the path hears: emission time te -> arrival time ta,
         f = f0 / (1 + M xs/r), where xs is the source position along the road. */
      const snd = player(ctl, 'play', ['Play pass-by ♪', 'Stop'], ac => {
        const c0 = 343, M = V.M, u = M * c0, d = 15, f0 = V.f;
        const o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle';
        o.connect(g); g.connect(ac.destination);
        const start = ac.currentTime + 0.05;
        if (u < 0.5) {
          o.frequency.setValueAtTime(f0, start);
          g.gain.setValueAtTime(0, start); g.gain.linearRampToValueAtTime(0.12, start + 0.1);
          g.gain.setValueAtTime(0.12, start + 2.5); g.gain.linearRampToValueAtTime(0, start + 3);
          passEnd = start + 3;
        } else {
          const half = Math.max(40, u * 2.6), n = 160;
          let ta0 = null;
          for (let i = 0; i <= n; i++) {
            const te = (-half + 2 * half * i / n) / u, x = u * te, r = Math.hypot(x, d);
            const ta = te + r / c0;
            if (ta0 == null) ta0 = ta;
            const f = f0 / (1 + M * x / r), amp = 0.16 * d / r, at = start + ta - ta0;
            if (i === 0) { o.frequency.setValueAtTime(f, at); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(amp, at + 0.05); }
            else { o.frequency.linearRampToValueAtTime(f, at); g.gain.linearRampToValueAtTime(amp, at); }
            if (i === n) { g.gain.linearRampToValueAtTime(0, at + 0.08); passEnd = at + 0.1; }
          }
        }
        o.start(start); o.stop(passEnd + 0.05);
        ro.set('snd', 'passing at ' + kit.fmt(u, 3) + ' m/s, 15 m away');
        return { stop() { try { g.gain.cancelScheduledValues(ac.currentTime); g.gain.setValueAtTime(0, ac.currentTime); o.stop(ac.currentTime + 0.02); } catch (e) { /* ended */ } } };
      }, s => ro.set('snd', s));

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, y = H * 0.5;
        const cv = W / 9, u = V.M * cv, Temit = 0.3;
        ts += dt;
        if (xs == null) xs = V.M > 0.01 ? 0.08 * W : 0.5 * W;
        xs += u * dt;
        if (xs > 0.94 * W) { xs = 0.06 * W; pass++; lastEmit = -1; }
        if (lastEmit < 0 || ts - lastEmit >= Temit) { fronts.push({ x: xs, t0: ts, pass }); lastEmit = ts; }
        const rMax = 1.6 * Math.max(W, H);
        fronts = fronts.filter(f => cv * (ts - f.t0) < rMax).slice(-240);
        c.save();
        for (const f of fronts) {
          const r = cv * (ts - f.t0);
          c.globalAlpha = Math.max(0.08, 0.9 * (1 - r / rMax)) * (f.pass === pass ? 1 : 0.5);
          c.strokeStyle = C.accent; c.lineWidth = 1.4;
          c.beginPath(); c.arc(f.x, y, Math.max(0.5, r), 0, TAU); c.stroke();
        }
        c.restore();
        // the Mach cone, tangent to the oldest ring of this pass
        const M = V.M;
        if (M > 1.001) {
          const th = Math.asin(1 / M);
          const old = fronts.find(f => f.pass === pass);
          if (old) {
            const age = ts - old.t0, len = age * Math.sqrt(Math.max(0, u * u - cv * cv));
            c.save(); c.strokeStyle = C.bad; c.lineWidth = 2.5;
            c.beginPath();
            c.moveTo(xs - len * Math.cos(th), y - len * Math.sin(th)); c.lineTo(xs, y); c.lineTo(xs - len * Math.cos(th), y + len * Math.sin(th));
            c.stroke(); c.restore();
            if (len > 60) kit.label(c, 'θ = ' + kit.fmt(th * 180 / Math.PI, 3) + '°', xs - 0.55 * len * Math.cos(th), y - 0.55 * len * Math.sin(th) - 14, { align: 'center', size: 12, color: C.bad, bg: C.bg2 });
          }
        }
        kit.arrow(c, xs, y, xs + Math.min(60, 25 + u * 0.3), y, C.warn, 2);
        kit.dot(c, xs, y, 7, C.warn, C.bg2);
        const fA = M < 0.999 ? V.f / (1 - M) : null, fB = V.f / (1 + M);
        kit.label(c, 'ahead: ' + (fA ? kit.fmt(fA, 4) + ' Hz' : 'silence until the cone arrives'), W - 10, 16, { align: 'right', size: 12, color: C.text, bg: C.bg2 });
        kit.label(c, 'behind: ' + kit.fmt(fB, 4) + ' Hz', 10, 16, { size: 12, color: C.text, bg: C.bg2 });
        kit.label(c, 'Mach ' + kit.fmt(M, 3), 10, H - 14, { size: 12, color: C.muted });
        ro.set('u', kit.fmt(M * 343, 3) + ' m/s (' + kit.fmt(M * 343 * 3.6, 4) + ' km/h)');
        ro.set('ahead', fA ? kit.fmt(fA, 4) + ' Hz (' + noteName(fA) + ')' : 'no sound until the cone passes');
        ro.set('behind', kit.fmt(fB, 4) + ' Hz (' + noteName(fB) + ')');
        ro.set('cone', M > 1.001 ? kit.fmt(Math.asin(1 / M) * 180 / Math.PI, 3) + '°' : '— (below Mach 1)');
        if (snd.on && AUDIO && AUDIO.currentTime > passEnd) { snd.stop(); ro.set('snd', 'gone by — press Play pass-by again'); }
        if (!snd.on && ts < 0.1) ro.set('snd', 'press Play pass-by');
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
      return () => snd.stop();
    }
  });

  /* ================================================================ 6. beats */

  Hyper.sim('sound-beats', {
    title: 'Beats between two tones',
    blurb: `Two tones of nearly the same frequency, and their sum. The top panel zooms in on a few cycles at the moving red line; the bottom panel shows the whole time window.

- Where the two waves are in step the sum is large (loud); half a beat later they are opposite and cancel (quiet).
- The loudness swells $|f_1 - f_2|$ times a second. Press **Play** and count the beats.
- Bring the detuning towards zero: the beats slow down and stop. That is how instruments are tuned by ear.
- Push the detuning past about 15 Hz: the throb turns into roughness, and then into two separate notes.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6 });
      let tp = 0;
      const ctl = kit.controls(box.side, [
        { id: 'f1', label: 'First tone f₁', min: 100, max: 1500, step: 1, value: typeof params.f1 === 'number' ? params.f1 : 440, unit: 'Hz' },
        { id: 'df', label: 'Detuning f₂ − f₁', min: -20, max: 20, step: 0.1, value: typeof params.df === 'number' ? params.df : 3, unit: 'Hz' },
        { id: 'win', type: 'select', label: 'Time window', options: [['0.5 s', 0.5], ['1 s', 1], ['2 s', 2]], value: 1 },
        { id: 'env', type: 'check', label: 'Show the envelope', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Play ♪', primary: true }] }
      ], id => {
        if (id === 'play') { snd.toggle(); tp = 0; }
        else if (snd.on && snd.cur) { snd.cur.freq(0, V.f1); snd.cur.freq(1, V.f1 + V.df); }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['f2', 'Second tone f₂'], ['fb', 'Beats per second |f₁ − f₂|'], ['Tb', 'Time between loud moments'], ['avg', 'Pitch heard (f₁ + f₂)/2'], ['snd', 'Sound']]);
      const V = ctl.values;
      const snd = player(ctl, 'play', ['Play ♪', 'Stop'], ac => {
        ro.set('snd', 'playing both tones');
        return tones(ac, [{ f: V.f1, gain: 0.5 }, { f: Math.max(1, V.f1 + V.df), gain: 0.5 }], 0.14);
      }, s => ro.set('snd', s));

      function frame(dt) {
        const win = V.win || 1;
        tp = (tp + dt) % win;
        const f1 = V.f1, f2 = Math.max(1, V.f1 + V.df), fb = Math.abs(f2 - f1);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, padL = 40, padR = 14;
        const pw = W - padL - padR;
        const sum = t => Math.sin(TAU * f1 * t) + Math.sin(TAU * f2 * t);
        const env = t => Math.abs(2 * Math.cos(Math.PI * (f2 - f1) * t));
        // ---- top: a few cycles around the playhead
        const tH = H * 0.4, ty = 12 + tH / 2, ts = (tH / 2 - 8) / 2;
        const span = 5 / f1;
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1;
        c.beginPath(); c.moveTo(padL, ty); c.lineTo(padL + pw, ty); c.stroke(); c.restore();
        const a = [], b = [], s = [];
        for (let i = 0; i <= pw; i += 1.5) {
          const t = tp + span * i / pw;
          const y1 = Math.sin(TAU * f1 * t), y2 = Math.sin(TAU * f2 * t);
          a.push([padL + i, ty - y1 * ts]); b.push([padL + i, ty - y2 * ts]); s.push([padL + i, ty - (y1 + y2) * ts]);
        }
        polyline(c, a, C.series[1], 1.3); polyline(c, b, C.series[2], 1.3); polyline(c, s, C.accent, 2.4);
        kit.label(c, 'zoom: 5 cycles from t = ' + kit.fmt(tp, 3) + ' s', padL, 12, { size: 11, color: C.muted });
        kit.label(c, 'f₁', padL + pw - 60, 12, { size: 11.5, color: C.series[1] });
        kit.label(c, 'f₂', padL + pw - 40, 12, { size: 11.5, color: C.series[2] });
        kit.label(c, 'sum', padL + pw - 20, 12, { size: 11.5, color: C.accent, align: 'center' });
        // ---- bottom: the whole window
        const bTop = H * 0.52, bH = H - bTop - 26, by = bTop + bH / 2, bs = (bH / 2 - 4) / 2;
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1;
        c.beginPath(); c.moveTo(padL, by); c.lineTo(padL + pw, by); c.stroke(); c.restore();
        const pxPerCycle = pw / (win * f1);
        if (pxPerCycle > 4) {
          const pts = [];
          for (let i = 0; i <= pw; i += 0.5) { const t = win * i / pw; pts.push([padL + i, by - sum(t) * bs]); }
          polyline(c, pts, C.accent, 1.2);
        } else {
          // too many cycles to draw one by one: fill the band the carrier sweeps out
          c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.55;
          c.beginPath();
          for (let i = 0; i <= pw; i += 1) { const e = env(win * i / pw); i ? c.lineTo(padL + i, by - e * bs) : c.moveTo(padL + i, by - e * bs); }
          for (let i = pw; i >= 0; i -= 1) { const e = env(win * i / pw); c.lineTo(padL + i, by + e * bs); }
          c.closePath(); c.fill(); c.restore();
        }
        if (V.env) {
          const up = [], dn = [];
          for (let i = 0; i <= pw; i += 1) { const e = env(win * i / pw); up.push([padL + i, by - e * bs]); dn.push([padL + i, by + e * bs]); }
          polyline(c, up, C.warn, 1.6, [5, 4]); polyline(c, dn, C.warn, 1.6, [5, 4]);
        }
        const xp = padL + pw * tp / win;
        c.save(); c.strokeStyle = C.bad; c.lineWidth = 2;
        c.beginPath(); c.moveTo(xp, bTop); c.lineTo(xp, bTop + bH); c.stroke(); c.restore();
        c.save(); c.font = '11px ' + font(); c.fillStyle = C.faint; c.textAlign = 'center';
        const step = win / 5;
        for (let k = 0; k <= 5; k++) c.fillText(kit.fmt(k * step, 2) + (k === 5 ? ' s' : ''), padL + pw * k / 5, H - 8);
        c.restore();
        kit.label(c, 'sum over ' + win + ' s', padL, bTop - 8, { size: 11, color: C.muted });
        ro.set('f2', kit.fmt(f2, 4) + ' Hz');
        ro.set('fb', kit.fmt(fb, 3) + ' Hz');
        ro.set('Tb', fb > 0.05 ? kit.fmt(1 / fb, 3) + ' s' : '— (no beats: in tune)');
        ro.set('avg', kit.fmt((f1 + f2) / 2, 4) + ' Hz (' + noteName((f1 + f2) / 2) + ')');
        if (!snd.on) ro.set('snd', 'press Play to listen');
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
      return () => snd.stop();
    }
  });

  /* ================================================================ 7. pipes */

  Hyper.sim('sound-pipes', {
    title: 'Resonances of open and closed pipes',
    blurb: `Air in a pipe vibrating in one of its resonances, slowed down enormously (**Play** gives the real frequency). The dots are layers of air; the graph below shows how far they swing, or how much the pressure changes, along the pipe.

- An open end is a displacement antinode (A) and a pressure node; a closed end is the opposite.
- Open pipe: modes 1, 2, 3 … are harmonics 1, 2, 3 … of $v/2L$. Closed pipe: only harmonics 1, 3, 5 … of $v/4L$.
- Close one end of a pipe: its fundamental drops an octave.
- Warm the air: every resonance goes up, because the speed of sound rises.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      let t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Pipe', options: [['Open at both ends (flute)', 'open'], ['Closed at one end (clarinet)', 'closed']], value: params.type === 'closed' ? 'closed' : 'open' },
        { id: 'm', label: 'Mode (1 = fundamental)', min: 1, max: 6, step: 1, value: 1 },
        { id: 'L', label: 'Length', min: 0.1, max: 2, step: 0.01, value: 0.6, unit: 'm' },
        { id: 'T', label: 'Air temperature', min: -10, max: 40, step: 1, value: 20, unit: '°C' },
        { id: 'show', type: 'select', label: 'Graph', options: [['Air displacement', 'disp'], ['Pressure change', 'pres']], value: 'disp' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play ♪', primary: true }] }
      ], id => {
        if (id === 'play') snd.toggle();
        else if (snd.on && snd.cur) snd.cur.freq(0, calc().f);
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['v', 'Speed of sound'], ['h', 'Harmonic'], ['f', 'Frequency'], ['lam', 'Wavelength'], ['f1', 'Fundamental'], ['snd', 'Sound']]);
      const V = ctl.values;
      const calc = () => {
        const v = 331.3 * Math.sqrt((V.T + 273.15) / 273.15);
        const m = Math.round(V.m), closed = V.type === 'closed';
        const h = closed ? 2 * m - 1 : m;
        const f = closed ? h * v / (4 * V.L) : h * v / (2 * V.L);
        return { v, h, f, lam: v / f, f1: closed ? v / (4 * V.L) : v / (2 * V.L), closed };
      };
      const snd = player(ctl, 'play', ['Play ♪', 'Stop'], ac => { ro.set('snd', 'playing this resonance'); return tones(ac, [{ f: calc().f }], 0.08); }, s => ro.set('snd', s));
      const ord = h => h + (h % 10 === 1 && h !== 11 ? 'st' : h % 10 === 2 && h !== 12 ? 'nd' : h % 10 === 3 && h !== 13 ? 'rd' : 'th');

      function frame(dt) {
        const K = calc();
        t += dt;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const x0 = 50, x1 = W - 40, pTop = H * 0.1, pBot = H * 0.44, len = x1 - x0;
        const kL = K.closed ? K.h * Math.PI / 2 : K.h * Math.PI;       // k L
        // displacement shape (x measured from the left end, u = x/L)
        const disp = u => K.closed ? Math.sin(kL * u) : Math.cos(kL * u);
        const pres = u => K.closed ? -Math.cos(kL * u) : Math.sin(kL * u);
        const om = TAU * 0.4 * K.h, ct = Math.cos(om * t);
        // pipe walls
        c.save(); c.strokeStyle = C.text2 || C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x0, pTop); c.lineTo(x1, pTop); c.moveTo(x0, pBot); c.lineTo(x1, pBot); c.stroke();
        if (K.closed) { c.fillStyle = C.text2 || C.text; c.fillRect(x0 - 10, pTop - 1.5, 10, pBot - pTop + 3); }
        c.restore();
        // air layers: shading for pressure, dots for motion
        const cols = 44, rows = 6, dxp = len / cols;
        const kpx = kL / len;
        const S0 = Math.min(dxp * 0.9, 0.55 / kpx);
        c.save(); c.fillStyle = C.accent;
        for (let px = x0; px < x1; px += 3) {
          const p = pres((px - x0) / len) * ct;
          if (p > 0) { c.globalAlpha = 0.35 * p; c.fillRect(px, pTop + 2, 3, pBot - pTop - 4); }
        }
        c.restore();
        for (let i = 0; i <= cols; i++) {
          for (let r = 0; r < rows; r++) {
            const u = Math.min(1, (i + (r % 2) * 0.5) / cols);
            const x = x0 + u * len + S0 * disp(u) * ct;
            kit.dot(c, x, pTop + (r + 0.5) * (pBot - pTop) / rows, 2.2, C.text2 || C.muted);
          }
        }
        kit.label(c, K.closed ? 'closed' : 'open', x0, pTop - 12, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'open', x1, pTop - 12, { align: 'center', size: 11, color: C.muted });
        // graph of the amplitude along the pipe
        const gTop = H * 0.56, gBot = H - 26, gy = (gTop + gBot) / 2, gs = (gBot - gTop) / 2 - 6;
        const shape = V.show === 'pres' ? pres : disp;
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0, gy); c.lineTo(x1, gy); c.stroke(); c.restore();
        const up = [], dn = [], now = [];
        for (let i = 0; i <= 200; i++) { const u = i / 200, x = x0 + u * len, a = shape(u); up.push([x, gy - Math.abs(a) * gs]); dn.push([x, gy + Math.abs(a) * gs]); now.push([x, gy - a * ct * gs]); }
        polyline(c, up, C.faint, 1, [3, 4]); polyline(c, dn, C.faint, 1, [3, 4]);
        polyline(c, now, V.show === 'pres' ? C.series[3] : C.series[1], 2.4);
        kit.label(c, V.show === 'pres' ? 'pressure change along the pipe' : 'air displacement along the pipe', x0, gTop - 10, { size: 11, color: C.muted });
        // displacement nodes (N) and antinodes (A)
        const marks = [];
        for (let j = 0; j <= 2 * K.h; j++) {
          const u = j / (2 * (kL / Math.PI));                   // where kL u is a multiple of π/2
          if (u > 1 + 1e-9) break;
          const d = Math.abs(disp(u));
          marks.push([u, d > 0.5 ? 'A' : 'N']);
        }
        for (const [u, s] of marks) kit.label(c, s, x0 + u * len, pBot + 12, { align: 'center', size: 11.5, weight: 700, color: s === 'N' ? C.bad : C.ok });
        kit.label(c, 'N, A: displacement node, antinode', x1, gTop - 10, { align: 'right', size: 11, color: C.faint });
        ro.set('v', kit.fmt(K.v, 4) + ' m/s');
        ro.set('h', ord(K.h) + ' harmonic');
        ro.set('f', kit.fmt(K.f, 4) + ' Hz (' + noteName(K.f) + ')');
        ro.set('lam', kit.fmt(K.lam, 3) + ' m');
        ro.set('f1', kit.fmt(K.f1, 4) + ' Hz');
        if (!snd.on) ro.set('snd', 'press Play to hear it');
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
      return () => snd.stop();
    }
  });

  /* ================================================================ 8. Fourier synthesis */

  const PRESETS = {
    sine:    [1, 0, 0, 0, 0, 0, 0, 0],
    square:  [1, 0, 1 / 3, 0, 1 / 5, 0, 1 / 7, 0],
    saw:     [1, -1 / 2, 1 / 3, -1 / 4, 1 / 5, -1 / 6, 1 / 7, -1 / 8],
    tri:     [1, 0, -1 / 9, 0, 1 / 25, 0, -1 / 49, 0],
    clar:    [1, 0.04, 0.75, 0.05, 0.5, 0.06, 0.3, 0.04],
    missing: [0, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
    even:    [0, 1, 0, 0.5, 0, 0.33, 0, 0.25]
  };

  Hyper.sim('sound-fourier', {
    title: 'Fourier synthesis: building a timbre',
    blurb: `Eight harmonics of one fundamental, each with its own amplitude (negative means flipped over). The top graph adds them up over two periods; the bars are the spectrum. **Play** to hear the mix.

- Build a square wave from odd harmonics alone, with amplitudes $1, \\tfrac13, \\tfrac15, \\tfrac17$. It sounds hollow, like a clarinet.
- Try the sawtooth (all harmonics): bright and buzzy. The triangle (odd harmonics, falling as $1/n^2$) is soft, like a flute.
- Choose **Missing fundamental**: harmonic 1 is gone, yet the wave still repeats at $f_1$ and the pitch you hear does not change.
- Change only the signs: the shape changes a lot, the sound hardly at all.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const p0 = PRESETS[params.preset] ? params.preset : 'square';
      const defs = [
        { id: 'preset', type: 'select', label: 'Recipe', value: p0, options: [['Pure tone (sine)', 'sine'], ['Square: odd harmonics, 1/n', 'square'], ['Sawtooth: all harmonics, 1/n', 'saw'], ['Triangle: odd harmonics, 1/n²', 'tri'],
          ['Clarinet-like: strong odd harmonics', 'clar'], ['Missing fundamental', 'missing'], ['Even harmonics only', 'even'], ['Your own mix', 'custom']] },
        { id: 'f1', label: 'Fundamental f₁', min: 80, max: 800, value: 220, log: true, sig: 3, unit: 'Hz' }
      ];
      for (let n = 1; n <= 8; n++) defs.push({ id: 'h' + n, label: 'Harmonic ' + n, min: -1, max: 1, step: 0.01, value: PRESETS[p0][n - 1], fmt: v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2) });
      defs.push({ id: 'parts', type: 'check', label: 'Show the separate harmonics', value: true });
      defs.push({ type: 'buttons', items: [{ id: 'play', label: 'Play ♪', primary: true }] });
      const ctl = kit.controls(box.side, defs, (id, val) => {
        if (id === 'play') snd.toggle();
        else if (id === 'preset' && PRESETS[val]) { for (let n = 1; n <= 8; n++) ctl.set('h' + n, PRESETS[val][n - 1]); refresh(); }
        else if (/^h\d$/.test(id)) { if (V.preset !== 'custom') ctl.set('preset', 'custom'); refresh(); }
        else refresh();
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['f1', 'Fundamental'], ['present', 'Harmonics present'], ['pitch', 'Repeats at (pitch heard)'], ['snd', 'Sound']]);
      const V = ctl.values;
      const amps = () => { const a = []; for (let n = 1; n <= 8; n++) a.push(+V['h' + n] || 0); return a; };
      const silent = () => amps().every(a => Math.abs(a) < 0.005);
      const makeWave = ac => {
        const re = new Float32Array(9), im = new Float32Array(9);
        amps().forEach((a, i) => { im[i + 1] = a; });
        return ac.createPeriodicWave(re, im);
      };
      const snd = player(ctl, 'play', ['Play ♪', 'Stop'], ac => {
        ro.set('snd', 'playing');
        const v = tones(ac, [silent() ? { f: V.f1, type: 'sine' } : { f: V.f1, wave: makeWave(ac) }], 0.12);
        if (silent()) v.level(0);
        return v;
      }, s => ro.set('snd', s));
      function refresh() {
        if (!snd.on || !snd.cur || !AUDIO) return;
        snd.cur.freq(0, V.f1);
        if (silent()) snd.cur.level(0);
        else { snd.cur.wave(0, makeWave(AUDIO)); snd.cur.level(0.12); }
      }
      const gcd = (a, b) => b ? gcd(b, a % b) : a;

      function frame() {
        const A = amps();
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, padL = 40, padR = 14, pw = W - padL - padR;
        // ---- waveform over two periods
        const gTop = 18, gH = H * 0.56, gy = gTop + gH / 2;
        const N = Math.round(pw / 1.5);
        const sum = [];
        let peak = 0;
        for (let i = 0; i <= N; i++) {
          const th = 2 * TAU * i / N;
          let y = 0;
          for (let n = 1; n <= 8; n++) y += A[n - 1] * Math.sin(n * th);
          sum.push(y); peak = Math.max(peak, Math.abs(y));
        }
        const sc = (gH / 2 - 6) / Math.max(1, peak);
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1;
        c.beginPath(); c.moveTo(padL, gy); c.lineTo(padL + pw, gy); c.moveTo(padL + pw / 2, gTop); c.lineTo(padL + pw / 2, gTop + gH); c.stroke(); c.restore();
        if (V.parts) {
          for (let n = 1; n <= 8; n++) {
            if (Math.abs(A[n - 1]) < 0.005) continue;
            const pts = [];
            for (let i = 0; i <= N; i++) pts.push([padL + pw * i / N, gy - A[n - 1] * Math.sin(n * 2 * TAU * i / N) * sc]);
            c.save(); c.globalAlpha = 0.45; polyline(c, pts, C.series[(n - 1) % C.series.length], 1); c.restore();
          }
        }
        polyline(c, sum.map((y, i) => [padL + pw * i / N, gy - y * sc]), C.accent, 2.6);
        kit.label(c, 'two periods, 2/f₁ = ' + kit.fmt(2000 / V.f1, 3) + ' ms', padL, 10, { size: 11, color: C.muted });
        // ---- spectrum
        const sTop = gTop + gH + 26, sBot = H - 22, sH = sBot - sTop;
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1;
        c.beginPath(); c.moveTo(padL, sBot); c.lineTo(padL + pw, sBot); c.stroke(); c.restore();
        const bw = pw / 8;
        for (let n = 1; n <= 8; n++) {
          const a = A[n - 1], h = Math.abs(a) * (sH - 14), x = padL + (n - 0.5) * bw;
          c.save(); c.fillStyle = a >= 0 ? C.accent : C.warn; c.globalAlpha = 0.8;
          c.fillRect(x - bw * 0.28, sBot - h, bw * 0.56, h); c.restore();
          kit.label(c, kit.fmt(n * V.f1, 3), x, sBot + 11, { align: 'center', size: 10.5, color: C.faint });
        }
        kit.label(c, 'spectrum (Hz); orange bars are inverted harmonics', padL, sTop - 10, { size: 11, color: C.muted });
        // ---- readouts
        const present = [];
        A.forEach((a, i) => { if (Math.abs(a) >= 0.02) present.push(i + 1); });
        const g = present.reduce((p, n) => gcd(p, n), 0);
        ro.set('f1', kit.fmt(V.f1, 3) + ' Hz (' + noteName(V.f1) + ')');
        ro.set('present', present.length ? present.join(', ') : 'none');
        ro.set('pitch', g ? kit.fmt(g * V.f1, 3) + ' Hz (' + noteName(g * V.f1) + ')' + (g > 1 ? ' — ' + g + ' × f₁' : '') : 'silence');
        if (!snd.on) ro.set('snd', 'press Play to listen');
      }
      const loop = kit.loop(frame, box.stage);
      loop.start();
      st.onResize(() => loop.once());
      return () => snd.stop();
    }
  });
})();
