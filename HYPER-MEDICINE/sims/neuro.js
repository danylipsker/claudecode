/* HYPER-MEDICINE · sims/neuro.js — Brain and Nerves simulations:
 *   neu-hh           the action potential (kit.med.hh, the Hodgkin–Huxley membrane)
 *   neu-synapse      a synapse: vesicles, transmitter, receptors, reuptake and enzymes
 *   neu-reflex       signals on the move: the knee jerk, fast and slow pain, and myelin
 * All pictures are schematic. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, f) => a + (b - a) * f;

  // a point a fraction f of the way along a polyline (by length); pts = [[x, y], ...]
  function along(pts, f) {
    let total = 0;
    const seg = [];
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); total += l; }
    if (!(total > 0)) return pts[0];
    let d = clamp(f, 0, 1) * total;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) { const g = seg[i] > 0 ? clamp(d / seg[i], 0, 1) : 0; return [lerp(pts[i][0], pts[i + 1][0], g), lerp(pts[i][1], pts[i + 1][1], g)]; }
      d -= seg[i];
    }
    return pts[pts.length - 1];
  }
  function polyline(c, pts, color, width, dash) {
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []);
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.setLineDash([]);
  }
  function glow(c, x, y, r, color) {
    c.save(); c.globalAlpha = 0.25; c.fillStyle = color; c.beginPath(); c.arc(x, y, r * 2.2, 0, Math.PI * 2); c.fill();
    c.globalAlpha = 1; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.restore();
  }
  const msOrS = s => s < 1 ? Math.round(s * 1000) + ' ms' : s.toFixed(2) + ' s';

  /* ================================================================ the action potential */
  // spikes: upward crossings of −20 mV carried by a real sodium current (a large stimulus can push a
  // passive membrane past −20 mV with every sodium channel blocked — that is not an action potential)
  function spikesOf(r) {
    const out = [];
    let armed = true, tUp = 0, ina = 0;
    for (let k = 1; k < r.V.length; k++) {
      if (armed && r.V[k - 1] < -20 && r.V[k] >= -20) { armed = false; tUp = r.t[k]; ina = 0; }
      if (!armed) {
        ina = Math.max(ina, -r.INa[k]);
        if (r.V[k] < -45 || k === r.V.length - 1) { if (ina > 100) out.push(tUp); armed = true; }
      }
    }
    return out;
  }
  Hyper.sim('neu-hh', {
    title: 'The action potential',
    blurb: `A patch of nerve membrane computed with Hodgkin and Huxley's equations (the squid giant axon, 1952: it rests at −65 mV and, at the squid's 6 °C, a spike lasts about 2 ms — human spikes at body temperature are faster). The top trace is the voltage, the middle one the stimulus, and the bottom panel the three gates: **m** opens the sodium channels, **h** shuts them (inactivation), **n** opens the potassium channels.

- With a 1 ms pulse, raise the strength slowly: nothing, nothing, then a full-size spike. **Find the threshold** does it for you. Stronger pulses do not make taller spikes — all or nothing.
- Shorten the pulse to 0.1 ms: the threshold rises about ninefold — a brief shock must be stronger.
- **Two pulses**: shrink the gap. Below about 5 ms the second pulse fails even at the strongest setting (absolute refractory period); up to about 15 ms it needs a stronger pulse (relative refractory period).
- **A steady current** makes the neuron fire again and again, faster for a stronger current — how nerves code intensity.
- Block sodium channels, as a local anaesthetic does: the threshold climbs, the spike shrinks, then fails. Block potassium channels: the spike widens and repeats.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      let loop = null, run = null, sweep = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Stimulus', options: [['One pulse', 'one'], ['Two pulses', 'two'], ['A steady current', 'steady']], value: params.mode || 'one' },
        { id: 'amp', label: 'Strength', min: 0.5, max: 200, value: params.amp || 10, unit: 'µA/cm²', log: true, sig: 3 },
        { id: 'dur', label: 'Pulse length', min: 0.1, max: 10, value: 1, unit: 'ms', log: true, sig: 2 },
        { id: 'gap', label: 'Gap between the pulses', min: 2, max: 30, step: 0.5, value: 12, unit: 'ms' },
        { id: 'na', label: 'Sodium channels blocked', min: 0, max: 100, step: 1, value: params.block || 0, unit: '%' },
        { id: 'k', label: 'Potassium channels blocked', min: 0, max: 90, step: 1, value: 0, unit: '%' },
        { id: 'gates', type: 'check', label: 'Show the gates m, h and n', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Stimulate', primary: true }, { id: 'thr', label: 'Find the threshold' }] }
      ], id => {
        if (id === 'gates') { if (loop) loop.once(); return; }
        if (id === 'thr') {
          const th = V.mode === 'steady' ? steadyThreshold() : threshold();
          if (th != null) ctl.set('amp', clamp(+(th * 1.02).toPrecision(3), 0.5, 200));
        }
        compute();
        sweep = 0;
      });
      const ro = kit.readout(box.side, [['res', 'Result'], ['peak', 'Highest voltage'], ['thr', 'Threshold'], ['rate', 'Firing rate']]);
      const V = ctl.values;
      const gNaOf = () => 120 * (1 - V.na / 100), gKOf = () => 36 * (1 - V.k / 100);
      const cache = new Map();
      // the smallest pulse of this length that fires (µA/cm²), or null
      function threshold() {
        const key = 'p' + V.dur + '|' + V.na + '|' + V.k;
        if (cache.has(key)) return cache.get(key);
        const gNa = gNaOf(), gK = gKOf(), d = V.dur;
        const fires = a => spikesOf(kit.med.hh({ I: t => (t >= 1 && t < 1 + d ? a : 0), tEnd: d + 14, dt: 0.01, gNa, gK })).length > 0;
        let res = null;
        if (fires(400)) { let lo = 0, hi = 400; for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (fires(m)) hi = m; else lo = m; } res = hi; }
        cache.set(key, res);
        return res;
      }
      // the smallest steady current that gives repeated firing, or null
      function steadyThreshold() {
        const key = 's|' + V.na + '|' + V.k;
        if (cache.has(key)) return cache.get(key);
        const gNa = gNaOf(), gK = gKOf();
        const fires = a => spikesOf(kit.med.hh({ I: t => (t >= 1 ? a : 0), tEnd: 60, dt: 0.02, gNa, gK })).length >= 3;
        let res = null, prev = 0;
        for (let a = 0.5; a <= 200; a *= 1.15) {
          if (fires(a)) { let lo = prev, hi = a; for (let i = 0; i < 10; i++) { const m = (lo + hi) / 2; if (fires(m)) hi = m; else lo = m; } res = hi; break; }
          prev = a;
        }
        cache.set(key, res);
        return res;
      }
      function stimulus() {
        const a = V.amp, d = V.dur, t0 = 5, t1 = t0 + V.gap;
        if (V.mode === 'steady') return t => (t >= t0 ? a : 0);
        if (V.mode === 'two') return t => ((t >= t0 && t < t0 + d) || (t >= t1 && t < t1 + d)) ? a : 0;
        return t => (t >= t0 && t < t0 + d ? a : 0);
      }
      function compute() {
        const T = V.mode === 'steady' ? 100 : V.mode === 'two' ? Math.max(40, 5 + V.gap + V.dur + 25) : Math.max(40, 5 + V.dur + 25);
        const I = stimulus();
        run = kit.med.hh({ I, tEnd: T, dt: 0.01, gNa: gNaOf(), gK: gKOf() });
        run.T = T; run.I = I; run.sp = spikesOf(run);
        run.peak = run.V.reduce((m, v) => Math.max(m, v), -Infinity);
        report();
      }
      function report() {
        const n = run.sp.length, steady = V.mode === 'steady';
        let res;
        if (steady) {
          const late = run.sp.filter(t => t > 30);
          const rate = late.length > 1 ? (late.length - 1) / ((late[late.length - 1] - late[0]) / 1000) : 0;
          res = n === 0 ? 'no action potential' : late.length > 1 ? 'repeated firing' : n === 1 ? 'one spike, then the membrane stays depolarised' : n + ' spikes, then silence';
          ro.set('rate', late.length > 1 ? Math.round(rate) + ' per second' : 'none');
          const th = cache.get('s|' + V.na + '|' + V.k);
          ro.set('thr', th === undefined ? 'press Find the threshold' : th == null ? 'no repeated firing on the slider' : th.toPrecision(3) + ' µA/cm² for repeated firing');
        } else {
          const th = threshold();
          if (V.mode === 'two') {
            const first = th != null && V.amp >= th;
            res = n >= 2 ? 'two action potentials' : n === 1 && first ? 'the second pulse fell in the refractory period' : n === 1 ? 'the two pulses added up to one spike' : 'no action potential';
          } else res = n === 0 ? 'no action potential (below threshold)' : n === 1 ? 'an action potential' : n + ' action potentials';
          ro.set('thr', th == null ? 'none: no spike at any strength' : th.toPrecision(3) + ' µA/cm² for a ' + kit.fmt(V.dur, 2) + ' ms pulse');
        }
        ro.show('rate', steady);
        ro.set('res', res);
        ro.set('peak', run.peak.toFixed(1) + ' mV');
      }
      function draw(dt) {
        if (!run) return;
        sweep = Math.min(run.T, sweep + (dt || 0) * run.T / 2.4);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const show = V.gates;
        const L = 46, R = W - 12;
        const vTop = 14, vBot = show ? Hh * 0.55 : Hh * 0.78;
        const iTop = vBot + 18, iBot = iTop + Math.max(20, Hh * 0.07);
        const gTop = iBot + 18, gBot = Hh - 34;
        const X = t => L + t / run.T * (R - L);
        const Yv = v => vBot - (clamp(v, -95, 60) + 95) / 155 * (vBot - vTop);
        c.font = '11px system-ui, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let v = -80; v <= 40; v += 20) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(L, Yv(v)); c.lineTo(R, Yv(v)); c.stroke();
          c.fillStyle = C.muted; c.fillText(String(v).replace('-', '−'), L - 6, Yv(v));
        }
        kit.label(c, 'mV', 6, vTop, { size: 11, color: C.muted });
        const refs = [[50, 'sodium equilibrium +50 mV', C.warn, -8], [-65, 'rest −65 mV', C.muted, -8], [-77, 'potassium equilibrium −77 mV', kit.hue(215), 8]];
        for (const [v, lab, col, off] of refs) {
          c.setLineDash([4, 4]); c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.moveTo(L, Yv(v)); c.lineTo(R, Yv(v)); c.stroke(); c.setLineDash([]);
          kit.label(c, lab, R - 4, Yv(v) + off, { size: 10.5, color: col, align: 'right' });
        }
        // the voltage, drawn up to the sweep
        let last = 0;
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        for (let k = 0; k < run.t.length && run.t[k] <= sweep; k++) { const x = X(run.t[k]), y = Yv(run.V[k]); if (k) c.lineTo(x, y); else c.moveTo(x, y); last = k; }
        c.stroke();
        kit.dot(c, X(run.t[last]), Yv(run.V[last]), 4, C.accent);
        for (const ts of run.sp) if (ts <= sweep) kit.label(c, 'spike', X(ts), vTop + 2, { size: 10.5, color: C.accent, align: 'center' });
        // the stimulus
        const Yi = a => iBot - clamp(a / Math.max(V.amp, 1e-9), 0, 1) * (iBot - iTop);
        c.strokeStyle = C.border2; c.lineWidth = 1; c.beginPath(); c.moveTo(L, iBot); c.lineTo(R, iBot); c.stroke();
        c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath();
        for (let k = 0; k < run.t.length && run.t[k] <= sweep; k++) { const x = X(run.t[k]), y = Yi(run.I(run.t[k])); if (k) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        kit.label(c, 'stimulus ' + kit.fmt(V.amp, 3) + ' µA/cm²', L + 4, iTop - 7, { size: 10.5, color: C.warn });
        // the gates
        if (show) {
          const Yg = g => gBot - clamp(g, 0, 1) * (gBot - gTop);
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (const g of [0, 0.5, 1]) { c.beginPath(); c.moveTo(L, Yg(g)); c.lineTo(R, Yg(g)); c.stroke(); c.fillStyle = C.muted; c.textAlign = 'right'; c.fillText(String(g), L - 6, Yg(g)); }
          const gs = [['m', 'm: Na⁺ gate opens', C.series[1]], ['h', 'h: Na⁺ not inactivated', C.bad], ['n', 'n: K⁺ gate opens', kit.hue(215)]];
          gs.forEach(([key, lab, col], i) => {
            c.strokeStyle = col; c.lineWidth = 1.8; c.beginPath();
            const arr = run[key];
            for (let k = 0; k < run.t.length && run.t[k] <= sweep; k++) { const x = X(run.t[k]), y = Yg(arr[k]); if (k) c.lineTo(x, y); else c.moveTo(x, y); }
            c.stroke();
            kit.label(c, lab, L + 6 + i * (R - L) / 3, gTop - 8, { size: 10.5, color: col });
          });
        }
        // time axis
        const step = run.T > 60 ? 10 : 5, yb = show ? gBot : iBot;
        c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top'; c.font = '11px system-ui, sans-serif';
        for (let tt = 0; tt <= run.T + 1e-9; tt += step) c.fillText(String(tt), X(tt), yb + 5);
        kit.label(c, 'time (ms)', R, Hh - 7, { size: 11, color: C.muted, align: 'right' });
      }
      compute();
      loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a synapse */
  Hyper.sim('neu-synapse', {
    title: 'A synapse at work',
    blurb: `A chemical synapse, drawn schematically and slowed down enormously (real synapses work in milliseconds). Each impulse makes a few vesicles release transmitter (dots) into the cleft; molecules that touch a free receptor switch it on (green) for a moment. Serotonin and dopamine are cleared mainly by **reuptake** transporters at the edge of the synapse; acetylcholine is split by an **enzyme** in the cleft. The graph shows transmitter in the cleft and the share of receptors switched on.

- **Block reuptake** (as an SSRI does for serotonin): each release lingers and the receptors stay on longer.
- **Block receptors** (as an antipsychotic does for dopamine, or a muscle relaxant for acetylcholine): the transmitter is there but the next cell barely responds.
- Switch to **acetylcholine** and **block the enzyme** (a cholinesterase inhibitor, used in Alzheimer's disease and myasthenia gravis — or an insecticide poisoning).
- Lower the **release** to 30 %, as in Parkinson's disease with fewer dopamine neurons; then raise the firing rate and watch the vesicles run out.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Transmitter', options: [['Serotonin or dopamine (cleared by reuptake)', 'mono'], ['Acetylcholine (split by an enzyme)', 'ach']], value: params.mode || 'mono' },
        { id: 'rate', label: 'Impulses arriving (slowed)', min: 0, max: 4, step: 0.1, value: params.rate != null ? params.rate : 0.5, unit: '/s' },
        { id: 'release', label: 'Transmitter released per impulse', min: 10, max: 200, step: 5, value: params.release || 100, unit: '%' },
        { id: 'reup', label: 'Reuptake blocked', min: 0, max: 100, step: 1, value: params.reup || 0, unit: '%' },
        { id: 'enz', label: 'Enzyme blocked', min: 0, max: 100, step: 1, value: params.enz || 0, unit: '%' },
        { id: 'rblock', label: 'Receptors blocked', min: 0, max: 100, step: 1, value: params.rblock || 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'fire', label: 'Send one impulse', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'fire') fire();
        else if (id === 'reset') reset();
        else if (id === 'rblock') assignBlocked();
        showModes();
      });
      const ro = kit.readout(box.side, [['cleft', 'Transmitter in the cleft'], ['occ', 'Receptors switched on'], ['resp', 'Response of the next cell'], ['life', 'Average time in the cleft'], ['fate', 'Where it went']]);
      const plot = kit.plot(box.stage, { x: { label: 'time (slowed, s)' }, y: { label: 'per cent', min: 0, max: 150 }, legend: true }, 150);
      const V = ctl.values;
      const U = kit.fin.uniforms(11), N = kit.fin.normals(12);
      const NR = 16, PER_VES = 25, NORMAL = 75, PB = params.pb || 0.25, DWELL = params.dwell || 0.12, KE = params.ke || 2, PUP = params.pup || 0.9, DU = params.du || 0.08, ESC = params.esc || 0.15;
      const rec = [], trans = [0.06, 0.1, 0.14, 0.18, 0.23, 0.77, 0.82, 0.86, 0.9, 0.94], enzymes = [[0.3, 0.45], [0.45, 0.62], [0.58, 0.38], [0.72, 0.55], [0.2, 0.6], [0.83, 0.42]];
      for (let i = 0; i < NR; i++) rec.push({ u: 0.27 + 0.46 * i / (NR - 1), until: 0, on: false, blocked: false });
      const order = rec.map((r, i) => i).sort(() => U() - 0.5);
      const ves = [];
      for (let i = 0; i < 9; i++) ves.push({ u: 0.32 + 0.36 * i / 8, full: true, refill: 0, fuse: 0 });
      let mol = [], t = 0, phase = 0, flash = 0, resp = 0, hist = [], lastRec = 0, lifeAvg = 0, lifeN = 0;
      let fate = { back: 0, split: 0, away: 0 }, frags = [];
      function assignBlocked() { const nb = Math.round(V.rblock / 100 * NR); order.forEach((idx, k) => { rec[idx].blocked = k < nb; if (rec[idx].blocked) rec[idx].on = false; }); }
      function showModes() { ctl.show('reup', V.mode === 'mono'); ctl.show('enz', V.mode === 'ach'); }
      function reset() { mol = []; hist = []; t = 0; resp = 0; lifeAvg = 0; lifeN = 0; fate = { back: 0, split: 0, away: 0 }; frags = []; rec.forEach(r => { r.on = false; }); ves.forEach(v => { v.full = true; v.refill = 0; }); }
      function fire() {
        flash = 0.35;
        const want = 3 * V.release / 100;
        let n = Math.floor(want + U());
        const full = ves.filter(v => v.full).sort(() => U() - 0.5);
        for (const v of full.slice(0, n)) {
          v.full = false; v.refill = 1.4; v.fuse = 0.3;
          for (let k = 0; k < PER_VES; k++) mol.push({ u: v.u + (U() - 0.5) * 0.02, v: 0.02 + U() * 0.04, born: t, rec: -1 });
        }
        if (mol.length > 1500) mol.splice(0, mol.length - 1500);
      }
      function gone(m, why) {
        fate[why]++;
        const life = t - m.born;
        lifeN = Math.min(lifeN + 1, 200); lifeAvg += (life - lifeAvg) / lifeN;
        if (why === 'split') frags.push({ u: m.u, v: m.v, a: 0.5 });
      }
      function step(h) {
        t += h;
        phase += V.rate * h;
        if (phase >= 1) { phase -= 1; fire(); }
        for (const v of ves) { v.fuse = Math.max(0, v.fuse - h); if (!v.full) { v.refill -= h; if (v.refill <= 0) v.full = true; } }
        const su = Math.sqrt(2 * DU * h), sv = Math.sqrt(2 * 1.6 * h);
        const kE = V.mode === 'ach' ? KE * (1 - V.enz / 100) : 0, pUp = V.mode === 'mono' ? PUP * (1 - V.reup / 100) : 0;
        const keep = [];
        for (const m of mol) {
          if (m.rec >= 0) {
            const r = rec[m.rec];
            if (t >= r.until) { r.on = false; m.rec = -1; m.v = 0.85; }
            else { keep.push(m); continue; }
          }
          m.u += su * N(); m.v += sv * N();
          if (m.v < 0) m.v = -m.v; if (m.v > 1) m.v = 2 - m.v;
          m.v = clamp(m.v, 0, 1);
          if (m.u < 0 || m.u > 1) {
            // glial cells wrap the synapse: most molecules bounce back, a few leak away
            if (U() < ESC) { gone(m, 'away'); continue; }
            m.u = m.u < 0 ? -m.u : 2 - m.u;
          }
          if (kE > 0 && U() < kE * h) { gone(m, 'split'); continue; }
          if (pUp > 0 && m.v < 0.12) {
            let near = false;
            for (const x of trans) if (Math.abs(m.u - x) < 0.028) { near = true; break; }
            if (near && U() < pUp) { gone(m, 'back'); continue; }
          }
          if (m.v > 0.9) {
            const i = Math.round((m.u - 0.27) / 0.46 * (NR - 1));
            if (i >= 0 && i < NR) {
              const r = rec[i];
              if (!r.on && !r.blocked && Math.abs(m.u - r.u) < 0.02 && U() < PB) { r.on = true; r.until = t - DWELL * Math.log(1 - U() * 0.999); m.rec = i; }
            }
          }
          keep.push(m);
        }
        mol = keep;
        const on = rec.filter(r => r.on).length;
        resp += (on / NR * 100 - resp) * h / 0.25;
        frags.forEach(f => { f.a -= h; }); frags = frags.filter(f => f.a > 0);
        flash = Math.max(0, flash - h);
        if (t - lastRec >= 0.1) {
          lastRec = t;
          hist.push([t, mol.filter(m => m.rec < 0).length / NORMAL * 100, on / NR * 100]);
          hist = hist.filter(p => p[0] > t - 12);
          plot.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'transmitter in the cleft (% of one normal release)', color: V.mode === 'ach' ? kit.hue(160) : kit.colors().accent }, { pts: hist.map(p => [p[0], p[2]]), label: 'receptors switched on (%)', color: kit.colors().ok }], x: { label: 'time (slowed, s)', min: Math.max(0, t - 12), max: Math.max(12, t) } });
        }
      }
      function report() {
        const free = mol.filter(m => m.rec < 0).length, on = rec.filter(r => r.on).length, tot = fate.back + fate.split + fate.away;
        ro.set('cleft', free + ' molecules');
        ro.set('occ', on + ' of ' + NR + ' (' + Math.round(on / NR * 100) + ' %)' + (V.rblock > 0 ? ', ' + rec.filter(r => r.blocked).length + ' blocked' : ''));
        ro.set('resp', Math.round(resp) + ' % of the maximum');
        ro.set('life', lifeN ? '≈ ' + lifeAvg.toFixed(2) + ' s (slowed)' : '—');
        ro.set('fate', tot ? (V.mode === 'mono' ? 'back into the terminal ' + Math.round(fate.back / tot * 100) + ' %' : 'split by the enzyme ' + Math.round(fate.split / tot * 100) + ' %') + ', drifted away ' + Math.round(fate.away / tot * 100) + ' %' : '—');
      }
      function draw(dt) {
        const h = 1 / 120;
        for (let s = 0; s < (dt || 0) - 1e-9; s += h) step(h);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const yPre = Hh * 0.47, yPost = Hh * 0.64, x0 = W * 0.05, x1 = W * 0.95;
        const X = u => x0 + u * (x1 - x0), Y = v => yPre + v * (yPost - yPre);
        const molCol = V.mode === 'ach' ? kit.hue(160) : C.accent;
        // the sending terminal
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath();
        c.moveTo(W * 0.43, 0); c.lineTo(W * 0.43, Hh * 0.08);
        c.quadraticCurveTo(W * 0.43, Hh * 0.14, W * 0.3, Hh * 0.15);
        c.lineTo(X(0.02) + 20, Hh * 0.15); c.quadraticCurveTo(X(0.02), Hh * 0.15, X(0.02), Hh * 0.15 + 20);
        c.lineTo(X(0.02), yPre - 16); c.quadraticCurveTo(X(0.02), yPre, X(0.02) + 16, yPre);
        c.lineTo(X(0.98) - 16, yPre); c.quadraticCurveTo(X(0.98), yPre, X(0.98), yPre - 16);
        c.lineTo(X(0.98), Hh * 0.15 + 20); c.quadraticCurveTo(X(0.98), Hh * 0.15, X(0.98) - 20, Hh * 0.15);
        c.lineTo(W * 0.7, Hh * 0.15); c.quadraticCurveTo(W * 0.57, Hh * 0.14, W * 0.57, Hh * 0.08); c.lineTo(W * 0.57, 0);
        c.fill(); c.stroke();
        if (flash > 0) { c.save(); c.globalAlpha = flash / 0.35 * 0.5; c.fillStyle = C.warn; c.fillRect(W * 0.43 + 2, 0, W * 0.14 - 4, Hh * 0.12); c.restore(); kit.label(c, 'impulse arrives: calcium enters', W * 0.6, Hh * 0.05, { size: 11, color: C.warn }); }
        kit.label(c, 'axon terminal (sending cell)', X(0.04), Hh * 0.2, { size: 11.5, color: C.muted });
        // vesicles
        for (const v of ves) {
          const vx = X(v.u), vy = yPre - 20 + (v.fuse > 0 ? (0.3 - v.fuse) / 0.3 * 12 : 0), r = Math.min(10, W * 0.014);
          c.beginPath(); c.arc(vx, vy, r, 0, Math.PI * 2);
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke();
          if (v.full) { c.fillStyle = molCol; for (let k = 0; k < 5; k++) { const a = k * 1.26; c.beginPath(); c.arc(vx + Math.cos(a) * r * 0.45, vy + Math.sin(a) * r * 0.45, 1.8, 0, Math.PI * 2); c.fill(); } }
        }
        // the cleft and the receiving cell
        c.fillStyle = C.bg2; c.fillRect(0, yPre + 1, W, yPost - yPre - 1);
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.moveTo(X(0), Hh); c.lineTo(X(0), yPost + 14); c.quadraticCurveTo(X(0), yPost, X(0) + 14, yPost); c.lineTo(X(1) - 14, yPost); c.quadraticCurveTo(X(1), yPost, X(1), yPost + 14); c.lineTo(X(1), Hh); c.fill(); c.stroke();
        kit.label(c, 'synaptic cleft (about 20–40 nm)', X(0.01), (yPre + yPost) / 2, { size: 10.5, color: C.faint });
        kit.label(c, 'receiving cell', X(0.04), yPost + 26, { size: 11.5, color: C.muted });
        // reuptake transporters
        if (V.mode === 'mono') {
          for (const u of trans) {
            const tx = X(u);
            c.fillStyle = kit.hue(200, 0.85); c.fillRect(tx - 6, yPre - 7, 12, 10);
            kit.arrow(c, tx, yPre - 2, tx, yPre - 16, C.text2, 1.5);
            if (V.reup > 0) { c.save(); c.globalAlpha = V.reup / 100; c.strokeStyle = C.bad; c.lineWidth = 2.2; c.beginPath(); c.moveTo(tx - 7, yPre - 9); c.lineTo(tx + 7, yPre + 5); c.moveTo(tx + 7, yPre - 9); c.lineTo(tx - 7, yPre + 5); c.stroke(); c.restore(); }
          }
          kit.label(c, 'reuptake transporters', X(0.08), yPre - 26, { size: 10.5, color: kit.hue(200) });
        } else {
          for (const [u, v] of enzymes) {
            const ex = X(u), ey = Y(v);
            c.fillStyle = kit.hue(40, V.enz >= 100 ? 0.25 : 0.9 - 0.6 * V.enz / 100);
            c.beginPath(); c.moveTo(ex, ey); c.arc(ex, ey, 7, 0.5, Math.PI * 2 - 0.5); c.closePath(); c.fill();
          }
          kit.label(c, 'enzyme (acetylcholinesterase)', X(0.62), yPre + 10, { size: 10.5, color: kit.hue(40) });
        }
        // receptors
        for (const r of rec) {
          const rx = X(r.u);
          c.fillStyle = r.on ? C.ok : C.surface2 || C.surface; c.strokeStyle = r.on ? C.ok : C.muted; c.lineWidth = 1.5;
          c.beginPath(); c.rect(rx - 5, yPost - 8, 10, 14); c.fill(); c.stroke();
          if (r.on) glow(c, rx, yPost - 10, 3, C.ok);
          if (r.blocked) { c.fillStyle = C.bad; c.beginPath(); c.arc(rx, yPost - 11, 4.5, 0, Math.PI * 2); c.fill(); }
        }
        kit.label(c, 'receptors', X(0.74), yPost + 16, { size: 10.5, color: C.muted });
        if (V.rblock > 0) kit.label(c, '● blocker', X(0.86), yPost + 16, { size: 10.5, color: C.bad });
        // transmitter
        c.fillStyle = molCol;
        for (const m of mol) { if (m.rec >= 0) continue; c.beginPath(); c.arc(X(m.u), Y(m.v), 2.3, 0, Math.PI * 2); c.fill(); }
        for (const f of frags) { c.save(); c.globalAlpha = clamp(f.a * 2, 0, 1); c.fillStyle = kit.hue(40); c.fillRect(X(f.u) - 3, Y(f.v) - 1, 2, 2); c.fillRect(X(f.u) + 2, Y(f.v) + 1, 2, 2); c.restore(); }
        // the next cell's response
        const bx = W * 0.3, bw = W * 0.4, by = Hh - 22;
        c.fillStyle = C.bg2; c.fillRect(bx, by, bw, 10);
        c.fillStyle = C.ok; c.fillRect(bx, by, bw * clamp(resp / 100, 0, 1), 10);
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(bx, by, bw, 10);
        kit.label(c, 'response of the next cell', bx, by - 9, { size: 10.5, color: C.muted });
        report();
      }
      assignBlocked(); showModes();
      fire();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ signals on the move */
  Hyper.sim('neu-reflex', {
    title: 'Signals on the move: reflexes and pain',
    blurb: `A seated person, drawn schematically, with real conduction speeds and a body height you choose. The action is shown in slow motion (the factor is in the corner), and the panel on the right shows what happens inside one nerve fibre.

- **Knee jerk**: the tap stretches the thigh muscle; a sensory fibre (about 65 m/s) carries the news to the spinal cord, one synapse passes it to a motor neuron (about 55 m/s), and the muscle contracts just over 20 ms after the tap — before the brain is involved at all.
- **Stepping on a pin**: sharp pain on thinly myelinated Aδ fibres (about 15 m/s) and dull pain on bare C fibres (about 1 m/s) set off together; the foot starts to pull away before even the sharp pain reaches the brain, and the dull ache arrives about a second later.
- **Damaged myelin** slows the signals and weakens the reflex; **badly damaged myelin** blocks them, and the reflex disappears — as in Guillain–Barré syndrome. (Multiple sclerosis damages myelin in the brain and spinal cord instead, but the physics is the same.)
- Change the height: a taller person has longer nerves and a slower reflex.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'scene', type: 'select', label: 'What happens', options: [['Knee-jerk reflex: tap the tendon', 'knee'], ['Stepping on a pin: fast and slow pain', 'pain']], value: params.scene || 'knee' },
        { id: 'height', label: 'Body height', min: 1.0, max: 2.1, step: 0.01, value: 1.75, unit: 'm' },
        { id: 'myelin', type: 'select', label: 'Myelin in the leg nerves', options: [['Healthy', 'ok'], ['Damaged: conduction slowed', 'slow'], ['Badly damaged: conduction blocked', 'block']], value: params.myelin || 'ok' },
        { type: 'buttons', items: [{ id: 'go', label: 'Go again', primary: true }] }
      ], () => { plan(); t = 0; hold = 0; });
      const ro = kit.readout(box.side, [['path', 'Path to the spinal cord'], ['speed', 'Conduction speed'], ['lat', 'Tap to muscle contracting'], ['sharp', 'Sharp pain reaches the brain'], ['pull', 'Foot starts to pull away'], ['dull', 'Dull pain reaches the brain'], ['now', 'Time since the stimulus']]);
      const V = ctl.values;
      let ev = null, t = 0, hold = 0;
      function plan() {
        const h = V.height, f = V.myelin === 'slow' ? 0.4 : 1, blocked = V.myelin === 'block';
        if (V.scene === 'knee') {
          const d = 0.34 * h, vs = 65 * f, vm = 55 * f;
          const tCord = d / vs, tSyn = tCord + 0.001, tMus = tSyn + d / vm, tEmg = tMus + 0.0015;
          ev = { scene: 'knee', d, vs, vm, tCord, tSyn, tMus, tEmg, blocked, stopF: 0.45 };
          ev.aEnd = blocked ? 0.45 * d / vs + 0.004 : tEmg + 0.004;
          ev.end = blocked ? ev.aEnd + 0.3 : tEmg + 0.5;
          ev.kick = blocked ? 0 : V.myelin === 'slow' ? 16 : 32;
        } else {
          const d = 0.62 * h, dm = 0.34 * h, da = 0.3 * h, va = 15 * f, vc = 1, vcns = 20, vm = 55 * f;
          const tA = d / va, tC = d / vc;
          ev = { scene: 'pain', d, dm, da, va, vc, vm, vcns, tA, tC, blocked, stopF: 0.45 };
          ev.sharp = blocked ? null : tA + 0.001 + da / vcns;
          ev.pull = blocked ? null : tA + 0.003 + dm / vm + 0.0015;
          ev.dull = tC + 0.001 + da / vcns;
          ev.aEnd = blocked ? 0.12 : Math.max(ev.sharp, ev.pull) + 0.01;
          ev.end = ev.dull + 0.5;
          ev.lift = blocked ? 0 : 1;
        }
        ev.rateA = ev.aEnd / 3.5; ev.rateB = (ev.end - ev.aEnd) / 3;
        report();
      }
      function report() {
        const knee = ev.scene === 'knee';
        ro.set('path', (knee ? ev.d : ev.d).toFixed(2) + ' m' + (knee ? ' (knee)' : ' (foot)'));
        ro.set('speed', knee ? Math.round(ev.vs) + ' m/s sensory, ' + Math.round(ev.vm) + ' m/s motor' : Math.round(ev.va) + ' m/s (Aδ), 1 m/s (C)');
        if (knee) ro.set('lat', ev.blocked ? 'no reflex: the signal is blocked' : Math.round(ev.tEmg * 1000) + ' ms');
        else {
          ro.set('sharp', ev.sharp == null ? 'never: blocked' : msOrS(ev.sharp));
          ro.set('pull', ev.pull == null ? 'no quick withdrawal' : msOrS(ev.pull));
          ro.set('dull', msOrS(ev.dull));
        }
        for (const k of ['lat']) ro.show(k, knee);
        for (const k of ['sharp', 'pull', 'dull']) ro.show(k, !knee);
      }
      const bump = (x, w) => x <= 0 || x >= w ? 0 : Math.sin(Math.PI * x / w) * Math.exp(-1.2 * x / w);
      function draw(dt) {
        if (!ev) return;
        if (t < ev.end) t = Math.min(ev.end, t + (dt || 0) * (t < ev.aEnd ? ev.rateA : ev.rateB));
        else { hold += dt || 0; if (hold > 2.5) { t = 0; hold = 0; } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const s = Math.min(W * 0.62, (Hh - 86) * 1.05), ox = 10, oy = 6;
        const P = (x, y) => [ox + x * s, oy + y * s];
        const knee = ev.scene === 'knee';
        // posture: thigh angle (up is positive) and lower-leg angle (forward is positive)
        let a1 = 0, a2 = 0;
        if (knee) a2 = ev.kick * Math.PI / 180 * bump(t - ev.tEmg - 0.02, 0.4);
        else if (ev.pull != null && t > ev.pull) { const g = clamp((t - ev.pull) / 0.25, 0, 1); a1 = 0.14 * g; a2 = -0.35 * g; }
        const hip = [0.24, 0.62], TL = 0.38, LL = 0.3;
        const kneeP = [hip[0] + TL * Math.cos(a1), hip[1] - TL * Math.sin(a1)];
        const ankle = [kneeP[0] + LL * Math.sin(a2), kneeP[1] + LL * Math.cos(a2)];
        const toe = [ankle[0] + 0.11 * Math.cos(a2), ankle[1] - 0.11 * Math.sin(a2)];
        const tv = [Math.cos(a1), -Math.sin(a1)], up = [-Math.sin(a1), -Math.cos(a1)];
        const onThigh = (f, o) => [hip[0] + TL * f * tv[0] + o * up[0], hip[1] + TL * f * tv[1] + o * up[1]];
        const cord = [0.205, 0.44], brain = [0.2, 0.1];
        // chair, body and leg
        c.fillStyle = C.bg2; c.strokeStyle = C.border2; c.lineWidth = 1.5;
        const seat = P(0.08, 0.665); c.fillRect(seat[0], seat[1], 0.46 * s, 0.03 * s); c.strokeRect(seat[0], seat[1], 0.46 * s, 0.03 * s);
        for (const x of [0.1, 0.5]) { const a = P(x, 0.695), b = P(x, 0.99); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        const body = C.surface2 || C.surface;
        c.fillStyle = body; c.strokeStyle = C.border2; c.lineWidth = 2;
        const tl = P(0.12, 0.2); c.beginPath(); c.rect(tl[0], tl[1], 0.18 * s, 0.44 * s); c.fill(); c.stroke();
        const hd = P(0.2, 0.1); c.beginPath(); c.arc(hd[0], hd[1], 0.075 * s, 0, Math.PI * 2); c.fill(); c.stroke();
        const limb = (a, b, w) => { const A = P(a[0], a[1]), B = P(b[0], b[1]); c.strokeStyle = C.border2; c.lineWidth = w * s + 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); c.strokeStyle = body; c.lineWidth = w * s; c.beginPath(); c.moveTo(A[0], A[1]); c.lineTo(B[0], B[1]); c.stroke(); c.lineCap = 'butt'; };
        limb(hip, kneeP, 0.085); limb(kneeP, ankle, 0.06); limb(ankle, toe, 0.04);
        // brain and spinal cord
        const B0 = P(brain[0], brain[1]); c.fillStyle = kit.hue(300, 0.35); c.beginPath(); c.ellipse(B0[0], B0[1] - 0.01 * s, 0.05 * s, 0.035 * s, 0, 0, Math.PI * 2); c.fill();
        polyline(c, [P(0.2, 0.14), P(0.203, 0.3), P(cord[0], cord[1] + 0.03)], kit.hue(300, 0.6), 4);
        kit.label(c, 'brain', B0[0] + 0.085 * s, B0[1] - 0.04 * s, { size: 11, color: C.muted });
        const Cd = P(cord[0], cord[1]); kit.label(c, 'spinal cord', Cd[0] + 0.11 * s, Cd[1] - 0.03 * s, { size: 11, color: C.muted, align: 'left' });
        // nerve paths (in canvas pixels)
        const map = pts => pts.map(p => P(p[0], p[1]));
        const colS = kit.hue(200), colM = C.ok, colA = C.warn, colC = kit.hue(330);
        const paths = {};
        if (knee) {
          const spindle = onThigh(0.72, 0.03), quad = onThigh(0.6, 0.042);
          paths.sens = map([spindle, onThigh(0.2, 0.025), [0.23, 0.57], cord]);
          paths.mot = map([cord, [0.225, 0.575], onThigh(0.22, 0.04), quad]);
          polyline(c, paths.sens, colS, 2, [5, 4]); polyline(c, paths.mot, colM, 2, [2, 3]);
          const Sp = P(spindle[0], spindle[1]); c.strokeStyle = colS; c.lineWidth = 2; c.beginPath(); c.ellipse(Sp[0], Sp[1], 9, 4, -a1, 0, Math.PI * 2); c.stroke();
          // the hammer
          const tend = [kneeP[0] + 0.035 * Math.sin(a2) + 0.03, kneeP[1] + 0.045 * Math.cos(a2)], T0 = P(tend[0], tend[1]);
          const touching = t < 0.004, swing = touching ? 0 : 0.5, reach = touching ? 9 : 0.08 * s;
          const hx = T0[0] + reach * Math.cos(swing), hy = T0[1] - reach * Math.sin(swing);
          c.strokeStyle = C.text2; c.lineWidth = 3; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx + 0.1 * s, hy - 0.05 * s); c.stroke();
          c.fillStyle = C.bad; c.beginPath(); c.ellipse(hx, hy, 7, 5, 0.4, 0, Math.PI * 2); c.fill();
          if (t < 0.006) kit.label(c, 'tap', T0[0] + 12, T0[1] + 14, { size: 12, weight: 700, color: C.bad });
          kit.label(c, 'stretch sensor (muscle spindle)', Sp[0] - 10, Sp[1] - 0.06 * s, { size: 10.5, color: colS, align: 'center' });
        } else {
          const sole = [ankle[0] + 0.05 * Math.cos(a2), ankle[1] - 0.05 * Math.sin(a2) + 0.02];
          paths.pain = map([sole, ankle, [kneeP[0] - 0.02, kneeP[1] + 0.03], onThigh(0.25, -0.035), [0.235, 0.58], cord]);
          paths.up = map([cord, [0.21, 0.3], brain]);
          paths.mot = map([cord, [0.235, 0.585], onThigh(0.5, -0.045)]);
          polyline(c, paths.pain, colA, 2, [5, 4]); polyline(c, paths.up, kit.hue(300), 2, [5, 4]); polyline(c, paths.mot, colM, 2, [2, 3]);
          const Pn = P(sole[0], sole[1] + 0.02);
          if (ev.lift === 0 || t < (ev.pull || 1e9)) { c.fillStyle = C.bad; c.beginPath(); c.moveTo(Pn[0] - 6, Pn[1] + 6); c.lineTo(Pn[0] + 6, Pn[1] + 6); c.lineTo(Pn[0], Pn[1] - 5); c.closePath(); c.fill(); }
          else { const floor = P(0.62, 1.0); c.fillStyle = C.bad; c.beginPath(); c.moveTo(floor[0] - 6, floor[1] - 2); c.lineTo(floor[0] + 6, floor[1] - 2); c.lineTo(floor[0], floor[1] - 13); c.closePath(); c.fill(); }
          kit.label(c, 'pin', Pn[0] + 10, Pn[1] + 2, { size: 11, color: C.bad });
        }
        // the moving impulses
        const imp = (pts, f, col) => { const p = along(pts, f); glow(c, p[0], p[1], 5, col); };
        const blockAt = ev.stopF;
        if (knee) {
          if (ev.blocked) { if (t < ev.aEnd) imp(paths.sens, Math.min(t / ev.tCord, blockAt), colS); const b = along(paths.sens, blockAt); kit.label(c, '✕ blocked', b[0] + 8, b[1] - 12, { size: 11, color: C.bad }); }
          else {
            if (t <= ev.tCord) imp(paths.sens, t / ev.tCord, colS);
            else if (t < ev.tSyn) { const p = P(cord[0], cord[1]); glow(c, p[0], p[1], 6, C.warn); }
            else if (t < ev.tMus) imp(paths.mot, (t - ev.tSyn) / (ev.tMus - ev.tSyn), colM);
            if (t >= ev.tMus && t < ev.tEmg + 0.3) { const q = P(onThigh(0.6, 0.042)[0], onThigh(0.6, 0.042)[1]); glow(c, q[0], q[1], 7, colM); kit.label(c, 'muscle contracts', q[0], q[1] - 18, { size: 11, color: colM, align: 'center' }); }
          }
        } else {
          if (ev.blocked) { if (t < ev.tA) imp(paths.pain, Math.min(t / ev.tA, blockAt), colA); const b = along(paths.pain, blockAt); kit.label(c, '✕ Aδ blocked', b[0] + 8, b[1] + 12, { size: 11, color: C.bad }); }
          else {
            if (t <= ev.tA) imp(paths.pain, t / ev.tA, colA);
            else if (t <= ev.sharp) imp(paths.up, (t - ev.tA) / (ev.sharp - ev.tA), colA);
            if (t > ev.tA + 0.003 && t < ev.pull) imp(paths.mot, (t - ev.tA - 0.003) / (ev.pull - ev.tA - 0.003), colM);
          }
          if (t <= ev.tC) imp(paths.pain, t / ev.tC, colC);
          else if (t <= ev.dull) imp(paths.up, (t - ev.tC) / (ev.dull - ev.tC), colC);
          if (ev.sharp != null && t >= ev.sharp) kit.label(c, 'sharp pain', B0[0] + 0.09 * s, B0[1] + 0.02 * s, { size: 11.5, weight: 650, color: colA });
          if (t >= ev.dull) kit.label(c, 'dull, burning pain', B0[0] + 0.09 * s, B0[1] + 0.055 * s, { size: 11.5, weight: 650, color: colC });
        }
        // inside one fibre (schematic)
        const ix0 = Math.max(ox + 0.72 * s, W * 0.66), ix1 = W - 14;
        if (ix1 - ix0 > 130) {
          const fibres = knee ? [['sensory fibre (Aα, myelinated)', colS, V.myelin, t <= ev.tCord || ev.blocked ? Math.min(t / ev.tCord, ev.blocked ? blockAt : 1) : t < ev.tSyn ? 1 : Math.min(1, (t - ev.tSyn) / (ev.tMus - ev.tSyn)), t > ev.tSyn && !ev.blocked ? 'motor fibre' : null]]
            : [['Aδ fibre (thin myelin)', colA, V.myelin, Math.min(1, t / ev.tA, ev.blocked ? blockAt : 1), null], ['C fibre (no myelin)', colC, 'bare', Math.min(1, t / ev.tC), null]];
          kit.label(c, 'inside a nerve fibre', ix0, 16, { size: 11.5, weight: 650, color: C.text2 });
          fibres.forEach(([lab, col, kind, f, alt], i) => {
            const y = 52 + i * 70, nn = 6, seg = (ix1 - ix0) / nn;
            kit.label(c, alt || lab, ix0, y - 24, { size: 10.5, color: col });
            c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); c.moveTo(ix0, y); c.lineTo(ix1, y); c.stroke();
            if (kind !== 'bare') {
              for (let k = 0; k < nn; k++) {
                if (kind === 'block' && k === 2) continue;
                const th = kind === 'slow' ? 4 : 8;
                c.fillStyle = kit.hue(45, kind === 'slow' ? 0.35 : 0.6);
                c.fillRect(ix0 + k * seg + 3, y - th - 1, seg - 6, th); c.fillRect(ix0 + k * seg + 3, y + 1, seg - 6, th);
              }
            }
            let x;
            if (kind === 'ok' && f < 1) x = ix0 + Math.floor(f * nn + 1e-9) * seg + 1.5;
            else x = ix0 + clamp(f, 0, 1) * (ix1 - ix0);
            if (f > 0 && f < 1) glow(c, x, y, 5, col);
            if (kind === 'block') kit.label(c, 'myelin lost here', ix0 + 2.5 * seg, y + 20, { size: 10, color: C.bad, align: 'center' });
          });
          kit.label(c, knee ? 'healthy myelin: the impulse jumps node to node' : 'C fibres have no myelin and crawl', ix0, knee ? 110 : 180, { size: 10, color: C.muted });
        }
        // the time line
        const tx0 = 16, tx1 = W - 16, ty = Hh - 40, tMax = knee ? Math.max(0.04, Math.ceil(((ev.blocked ? 0.03 : ev.tEmg) + 0.006) * 100) / 100) : Math.max(1.3, ev.dull + 0.1);
        const TX = tt => tx0 + clamp(tt / tMax, 0, 1) * (tx1 - tx0);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(tx0, ty); c.lineTo(tx1, ty); c.stroke();
        c.fillStyle = C.muted; c.font = '10.5px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
        const tick = knee ? 0.01 : 0.2;
        for (let k = 0; k * tick <= tMax + 1e-9; k++) { const x = TX(k * tick); c.fillRect(x, ty - 3, 1, 6); c.fillText(knee ? (k * 10) + ' ms' : (k * tick).toFixed(1) + ' s', x, ty + 5); }
        const marks = knee ? (ev.blocked ? [] : [[ev.tCord, 'at the spinal cord', colS], [ev.tEmg, 'muscle fires', colM]])
          : [[ev.pull, 'foot pulls away', colM], [ev.sharp, 'sharp pain', colA], [ev.dull, 'dull pain', colC]];
        marks.filter(m => m[0] != null).forEach(([tt, lab, col], i) => { const x = TX(tt); c.fillStyle = col; c.fillRect(x - 1, ty - 10, 2, 10); kit.label(c, lab, x, ty - 16 - (i % 2) * 13, { size: 10.5, color: col, align: x > tx1 - 60 ? 'right' : 'center' }); });
        kit.dot(c, TX(t), ty, 4.5, C.accent);
        const slow = t < ev.aEnd ? 1 / ev.rateA : 1 / ev.rateB;
        kit.label(c, 'slow motion ×' + Math.round(slow), W - 16, Hh - 8, { size: 10.5, color: C.muted, align: 'right' });
        ro.set('now', knee ? (t * 1000).toFixed(1) + ' ms' : t.toFixed(3) + ' s');
      }
      plan();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the eye focusing */
  // a reduced eye: relaxed power 60 D; the retina sits where an eye with
  // refractive error E (its correcting spectacle power) focuses: required vergence R = 60 + E
  const P0 = 60;
  const amplitudeAt = age => clamp(18.5 - 0.3 * age, 0.5, 16);      // Hofstetter's average, levelling off
  const snellen = mar => '6/' + Math.max(6, Math.round(6 * mar)) + ' (20/' + Math.max(20, Math.round(20 * mar / 5) * 5) + ')';
  Hyper.sim('neu-eye', {
    title: 'Focusing the eye',
    blurb: `A schematic eye looking at a point of light. The cornea and lens bend the rays; to see close, the lens adds power (accommodation), up to a limit that shrinks with age. If the rays meet in front of the retina or behind it, the point becomes a blur circle, shown in the letter at the top left.

- **Short sight** (a negative error): far things blur because the image falls in front of the retina. Bring the object closer — at the far point it snaps into focus. Then choose **distance glasses**.
- **Long sight** (a positive error): a young eye focuses through it by accommodating even for distance; raise the age and near objects blur first.
- Set a normal eye and raise the age past 45 with the object at 0.4 m: the menu moves out of reach. **Reading glasses** bring it back.
- Shrink the **pupil**: the blur circle shrinks too — why squinting, or bright light, sharpens vision.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'dist', label: 'Object distance', min: 0.1, max: 20, value: params.dist || 6, unit: 'm', log: true, sig: 2 },
        { id: 'rx', label: 'Refractive error (− short sight, + long sight)', min: -8, max: 6, step: 0.25, value: params.rx != null ? params.rx : -2, unit: 'D' },
        { id: 'age', label: 'Age', min: 10, max: 80, step: 1, value: params.age || 25, unit: 'years' },
        { id: 'pupil', label: 'Pupil diameter', min: 2, max: 8, step: 0.5, value: 4, unit: 'mm' },
        { id: 'glasses', type: 'select', label: 'Glasses', options: [['None', 'none'], ['Distance glasses', 'dist'], ['Reading glasses (for 40 cm)', 'read']], value: params.glasses || 'none' },
        { type: 'buttons', items: [{ id: 'p1', label: 'Short-sighted student' }, { id: 'p2', label: 'Long-sighted child' }, { id: 'p3', label: 'Reading at 55' }] }
      ], id => {
        if (id === 'p1') { ctl.set('rx', -2.5); ctl.set('age', 20); ctl.set('dist', 6); ctl.set('glasses', 'none'); }
        if (id === 'p2') { ctl.set('rx', 3); ctl.set('age', 8); ctl.set('dist', 0.4); ctl.set('glasses', 'none'); }
        if (id === 'p3') { ctl.set('rx', 0); ctl.set('age', 55); ctl.set('dist', 0.4); ctl.set('glasses', 'none'); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['focus', 'Image'], ['acc', 'Focusing used'], ['blur', 'Blur circle'], ['va', 'Rough visual acuity'], ['range', 'Sharp from … to'], ['lens', 'Glasses']]);
      const V = ctl.values;
      function optics() {
        const E = V.rx, amp = amplitudeAt(V.age), Vo = -1 / V.dist;
        const add = Math.max(0, Math.round((2.5 - amp / 2) * 4) / 4);
        const G = V.glasses === 'dist' ? E : V.glasses === 'read' ? E + add : 0;
        const acc = clamp(E - Vo - G, 0, amp);
        const D = Vo + G + acc - E;                                   // + : image in front of the retina
        const blur = V.pupil / 1000 * Math.abs(D) * 180 / Math.PI * 60;  // arcmin
        const mar = Math.sqrt(1 + (0.23 * blur) * (0.23 * blur));
        const nearV = E - G - amp, farV = E - G;
        return { E, amp, Vo, G, acc, D, blur, mar, add, near: nearV < 0 ? -1 / nearV : Infinity, far: farV < 0 ? -1 / farV : Infinity };
      }
      const dm = x => x === Infinity ? 'infinity' : x >= 1 ? x.toFixed(x >= 10 ? 0 : 1) + ' m' : Math.round(x * 100) + ' cm';
      function draw() {
        const o = optics();
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the eye: cornea at ex, retina at ex + ew (the length of this eye)
        const ex = W * 0.58, cy = Hh * 0.42, ew = W * 0.32 * (P0 / (P0 + o.E)), eh = Math.min(Hh * 0.62, ew * 1.05);
        const R = P0 + o.E, total = o.Vo + o.G + P0 + o.acc;
        const imgX = ex + ew * (R / Math.max(1, total));             // where the rays meet, on the same scale
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.ellipse(ex + ew / 2, cy, ew / 2, eh / 2, 0, 0, Math.PI * 2); c.fill(); c.stroke();
        // retina and fovea
        c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.ellipse(ex + ew / 2, cy, ew / 2, eh / 2, 0, -0.9, 0.9); c.stroke();
        kit.label(c, 'retina', ex + ew - 6, cy - eh * 0.5 - 8, { size: 11, color: C.bad, align: 'right' });
        // cornea bulge and lens (thicker when accommodating)
        c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); c.ellipse(ex + 2, cy, eh * 0.12, eh * 0.3, 0, Math.PI / 2, Math.PI * 1.5); c.stroke();
        const lx = ex + ew * 0.16, lt = 5 + o.acc * 1.1;
        c.fillStyle = kit.hue(200, 0.35); c.strokeStyle = kit.hue(200); c.beginPath(); c.ellipse(lx, cy, lt, eh * 0.2, 0, 0, Math.PI * 2); c.fill(); c.stroke();
        kit.label(c, 'lens', lx, cy - eh * 0.2 - 10, { size: 11, color: kit.hue(200), align: 'center' });
        // iris and pupil
        const pr = V.pupil / 8 * eh * 0.16;
        c.strokeStyle = C.text; c.lineWidth = 4;
        c.beginPath(); c.moveTo(ex + ew * 0.1, cy - eh * 0.3); c.lineTo(ex + ew * 0.1, cy - pr); c.moveTo(ex + ew * 0.1, cy + pr); c.lineTo(ex + ew * 0.1, cy + eh * 0.3); c.stroke();
        // the object: a point of light, placed on a log scale of distance
        const ax0 = 20, ax1 = ex - 70;
        const OX = d => ax0 + (Math.log(20) - Math.log(d)) / (Math.log(20) - Math.log(0.1)) * (ax1 - ax0);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(ax0, cy + eh * 0.5 + 18); c.lineTo(ax1, cy + eh * 0.5 + 18); c.stroke();
        c.fillStyle = C.muted; c.font = '10.5px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
        for (const d of [20, 6, 2, 1, 0.4, 0.25, 0.1]) { const x = OX(d); c.fillRect(x, cy + eh * 0.5 + 15, 1, 6); c.fillText(d >= 1 ? d + ' m' : Math.round(d * 100) + ' cm', x, cy + eh * 0.5 + 23); }
        kit.label(c, 'distance (log scale)', ax0, cy + eh * 0.5 + 44, { size: 10.5, color: C.muted });
        const ox = OX(V.dist);
        // the glasses
        if (o.G !== 0) {
          const gx = ex - 34, gh = eh * 0.34, bulge = clamp(o.G * 1.6, -9, 9);
          c.fillStyle = kit.hue(190, 0.25); c.strokeStyle = kit.hue(190); c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(gx - 4, cy - gh); c.quadraticCurveTo(gx - 4 - bulge, cy, gx - 4, cy + gh); c.lineTo(gx + 4, cy + gh); c.quadraticCurveTo(gx + 4 + bulge, cy, gx + 4, cy - gh); c.closePath(); c.fill(); c.stroke();
          kit.label(c, (o.G > 0 ? '+' : '') + o.G.toFixed(2) + ' D', gx, cy - gh - 10, { size: 11, color: kit.hue(190), align: 'center' });
        }
        // rays from the point to the pupil edges, then to where they meet
        const pupX = ex + ew * 0.1, retX = ex + ew;
        c.strokeStyle = C.warn; c.lineWidth = 1.4;
        for (const s of [-1, 1]) {
          c.beginPath(); c.moveTo(ox, cy); c.lineTo(pupX, cy + s * pr * 0.9);
          if (imgX <= retX) { c.lineTo(imgX, cy); c.lineTo(retX, cy - s * pr * 0.9 * (retX - imgX) / Math.max(1, imgX - pupX)); }
          else c.lineTo(retX, cy + s * pr * 0.9 * (imgX - retX) / Math.max(1, imgX - pupX));
          c.stroke();
          if (imgX > retX) { c.setLineDash([3, 4]); c.beginPath(); c.moveTo(retX, cy + s * pr * 0.9 * (imgX - retX) / Math.max(1, imgX - pupX)); c.lineTo(Math.min(imgX, W - 4), cy); c.stroke(); c.setLineDash([]); }
        }
        glow(c, ox, cy, 4, C.warn);
        kit.label(c, 'object at ' + dm(V.dist), ox, cy - 18, { size: 11, color: C.warn, align: ox < 60 ? 'left' : 'center' });
        if (Math.abs(o.D) > 0.12) kit.dot(c, Math.min(imgX, W - 6), cy, 3.5, C.bad);
        // what the eye sees: a letter blurred by the blur circle (a 6/12 letter is 10 arcmin tall)
        const bx = 16, by = 24, bs = 80;
        c.fillStyle = '#fff'; c.fillRect(bx, by, bs, bs); c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(bx, by, bs, bs);
        const rpx = Math.min(30, o.blur / 10 * 50 / 2), n = rpx < 0.6 ? 1 : 18;
        c.save(); c.beginPath(); c.rect(bx, by, bs, bs); c.clip();
        c.fillStyle = '#111'; c.font = '700 50px Georgia, serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.globalAlpha = n === 1 ? 1 : Math.min(1, 2.2 / n);
        for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, rr = n === 1 ? 0 : rpx * (k % 2 ? 1 : 0.55); c.fillText('E', bx + bs / 2 + Math.cos(a) * rr, by + bs / 2 + 2 + Math.sin(a) * rr); }
        c.restore();
        kit.label(c, 'what the eye sees', bx, by - 10, { size: 10.5, color: C.muted });
        // readouts
        const where = Math.abs(o.D) <= 0.12 ? 'sharp, on the retina' : o.D > 0 ? 'in front of the retina (' + o.D.toFixed(2) + ' D too strong)' : 'behind the retina (' + (-o.D).toFixed(2) + ' D too weak)';
        ro.set('focus', where);
        ro.set('acc', o.acc.toFixed(2) + ' D of ' + o.amp.toFixed(1) + ' D available' + (o.acc >= o.amp - 1e-9 && o.D < -0.12 ? ' — at the limit' : ''));
        ro.set('blur', Math.abs(o.D) <= 0.12 ? 'none' : o.blur.toFixed(1) + ' arcmin (a 6/6 letter is 5 arcmin)');
        ro.set('va', snellen(o.mar));
        ro.set('range', dm(o.near) + ' to ' + dm(o.far));
        ro.set('lens', o.G === 0 ? 'none' : (o.G > 0 ? '+' : '') + o.G.toFixed(2) + ' D' + (V.glasses === 'read' ? ' (distance ' + (o.E >= 0 ? '+' : '') + o.E.toFixed(2) + ', reading addition +' + o.add.toFixed(2) + ')' : ''));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ hearing: the audiogram */
  const FREQS = [250, 500, 1000, 2000, 3000, 4000, 6000, 8000];
  // approximate median age-related threshold shift, dB per (year − 18)², in the style of ISO 7029
  const AGE_M = [0.003, 0.0035, 0.004, 0.007, 0.0115, 0.016, 0.018, 0.022];
  const AGE_F = [0.003, 0.0035, 0.004, 0.006, 0.0075, 0.009, 0.012, 0.015];
  const NOISE_W = [0, 0.05, 0.12, 0.4, 0.85, 1, 0.8, 0.45];          // the shape of a noise notch (schematic)
  const COND = [35, 32, 30, 25, 25, 25, 25, 25];                      // a conductive loss (fluid behind the drum)
  const SPEECH = [['oo', 300, 40], ['m', 350, 30], ['a', 800, 50], ['e', 500, 44], ['p', 1500, 26], ['h', 1800, 22], ['sh', 2500, 34], ['k', 3000, 30], ['f', 4000, 18], ['s', 5000, 26], ['th', 5500, 14]];
  const whoGrade = pta => pta < 20 ? 'normal' : pta < 35 ? 'mild' : pta < 50 ? 'moderate' : pta < 65 ? 'moderately severe' : pta < 80 ? 'severe' : pta < 95 ? 'profound' : 'complete';
  Hyper.sim('neu-audiogram', {
    title: 'An audiogram: age, noise and blocked ears',
    blurb: `An audiogram plots the quietest tone heard at each pitch, in dB HL: 0 is the average young ear, and **lower on the chart means worse hearing**. The red circles are the air-conduction thresholds of one ear; the letters are where some speech sounds typically fall (approximate), faded when they are too quiet to hear. The age curves are approximate median values; individuals vary widely, and the noise model is schematic.

- Raise the **age**: the high frequencies go first — a man of 70 typically loses consonants such as s, f and th.
- Add **years of noise** at 95 dB(A): a notch appears near 4 kHz, the fingerprint of noise damage, and deepens mostly in the first 10–15 years.
- Tick **fluid behind the eardrum**: air conduction drops at all pitches, but bone conduction (the brackets) stays normal — a conductive loss, usually treatable.
- Tick **hearing aid**: amplification (here by the half-gain rule) lifts many speech sounds back into hearing.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 20, max: 90, step: 1, value: params.age || 60, unit: 'years' },
        { id: 'sex', type: 'select', label: 'Sex', options: [['Man', 'm'], ['Woman', 'f']], value: 'm' },
        { id: 'noise', type: 'select', label: 'Noise at work', options: [['No loud noise', 0], ['85 dB(A), 8 hours a day', 85], ['90 dB(A)', 90], ['95 dB(A)', 95], ['100 dB(A)', 100]], value: params.noise != null ? params.noise : 0 },
        { id: 'years', label: 'Years of noise', min: 0, max: 40, step: 1, value: 20, unit: 'years' },
        { id: 'cond', type: 'check', label: 'Fluid behind the eardrum (conductive loss)', value: false },
        { id: 'aid', type: 'check', label: 'Hearing aid (half-gain rule)', value: false },
        { id: 'speech', type: 'check', label: 'Show speech sounds', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pta', 'Average at 0.5–4 kHz'], ['grade', 'WHO grade'], ['hf', 'At 4 kHz'], ['kind', 'Type of loss'], ['lost', 'Speech sounds missed']]);
      const V = ctl.values;
      function thresholds() {
        const age = Math.max(0, V.age - 18), A = V.sex === 'f' ? AGE_F : AGE_M;
        const g = V.years > 0 ? Math.log10(1 + V.years) / Math.log10(11) : 0;
        const n4 = Math.max(0, V.noise - 80) * 1.9 * g;
        return FREQS.map((f, i) => {
          const H = A[i] * age * age, N = NOISE_W[i] * n4;
          const sn = clamp(H + N - H * N / 120, 0, 120);
          return { f, bone: sn, air: clamp(sn + (V.cond ? COND[i] : 0), 0, 120) };
        });
      }
      const interp = (th, f) => {
        const lf = Math.log(f);
        for (let i = 1; i < th.length; i++) if (f <= th[i].f) { const a = Math.log(th[i - 1].f), b = Math.log(th[i].f), u = (lf - a) / (b - a); return lerp(th[i - 1].air, th[i].air, u); }
        return th[th.length - 1].air;
      };
      function draw() {
        const th = thresholds(), C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const L = 50, R = W - 96, T = 36, B = Hh - 30;
        const X = f => L + (Math.log(f) - Math.log(180)) / (Math.log(11000) - Math.log(180)) * (R - L);
        const Y = db => T + (db + 10) / 130 * (B - T);
        // WHO bands
        const bands = [[-10, 20, 'normal'], [20, 35, 'mild'], [35, 50, 'moderate'], [50, 65, 'mod. severe'], [65, 80, 'severe'], [80, 95, 'profound'], [95, 120, 'complete']];
        bands.forEach(([a, b, lab], i) => { c.fillStyle = kit.hue(10 + i * 8, 0.04 + i * 0.025); c.fillRect(L, Y(a), R - L, Y(b) - Y(a)); kit.label(c, lab, R + 6, (Y(a) + Y(b)) / 2, { size: 10.5, color: C.muted }); });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.font = '10.5px system-ui, sans-serif';
        for (let db = -10; db <= 120; db += 10) { c.beginPath(); c.moveTo(L, Y(db)); c.lineTo(R, Y(db)); c.stroke(); c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(String(db).replace('-', '−'), L - 6, Y(db)); }
        for (const f of FREQS) { c.beginPath(); c.moveTo(X(f), T); c.lineTo(X(f), B); c.stroke(); c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillText(f >= 1000 ? f / 1000 + 'k' : String(f), X(f), T - 4); }
        kit.label(c, 'frequency (Hz)', L, 9, { size: 10.5, color: C.muted });
        kit.label(c, 'dB HL', 6, B + 16, { size: 10.5, color: C.muted });
        // speech sounds: audible when at or below the threshold line (louder than the threshold)
        const lost = [];
        if (V.speech) for (const [s, f, db] of SPEECH) {
          const thr = interp(th, f), aided = V.aid ? thr - Math.max(0, (thr - 15) / 2) : thr, heard = db >= aided;
          if (!heard) lost.push(s);
          kit.label(c, s, X(f), Y(db), { size: 13, weight: 700, color: heard ? kit.hue(160) : C.faint, align: 'center' });
        }
        // air conduction: circles joined by a line; bone conduction: brackets
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); th.forEach((p, i) => i ? c.lineTo(X(p.f), Y(p.air)) : c.moveTo(X(p.f), Y(p.air))); c.stroke();
        for (const p of th) { c.beginPath(); c.arc(X(p.f), Y(p.air), 5.5, 0, Math.PI * 2); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.bad; c.lineWidth = 2; c.stroke(); }
        if (V.cond) for (const p of th) kit.label(c, '[', X(p.f) - 12, Y(p.bone), { size: 16, weight: 700, color: C.bad, align: 'center' });
        if (V.aid) {
          c.setLineDash([5, 4]); c.strokeStyle = kit.hue(200); c.lineWidth = 2; c.beginPath();
          th.forEach((p, i) => { const a = p.air - Math.max(0, (p.air - 15) / 2); if (i) c.lineTo(X(p.f), Y(a)); else c.moveTo(X(p.f), Y(a)); });
          c.stroke(); c.setLineDash([]);
          kit.label(c, 'with the hearing aid', X(6000), Y(th[6].air - Math.max(0, (th[6].air - 15) / 2)) - 12, { size: 10.5, color: kit.hue(200), align: 'center' });
        }
        const pta = (th[1].air + th[2].air + th[3].air + th[5].air) / 4;
        ro.set('pta', pta.toFixed(0) + ' dB HL');
        ro.set('grade', whoGrade(pta));
        ro.set('hf', th[5].air.toFixed(0) + ' dB HL');
        const sn = th.some(p => p.bone >= 20);
        ro.set('kind', V.cond ? (sn ? 'mixed (conductive + sensorineural)' : 'conductive') : sn ? 'sensorineural' : 'none');
        ro.set('lost', !V.speech ? '—' : lost.length ? lost.join(', ') : 'none');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a night's sleep */
  const STAGE_Y = { W: 0, R: 1, N1: 2, N2: 3, N3: 4 };
  function makeNight(o, R) {
    const age = o.age, tib = Math.round(o.tib * 60), out = [];
    const deepBase = age <= 12 ? 55 : age <= 30 ? 40 : age <= 60 ? 24 : 12;
    const pWake = age <= 12 ? 0.05 : age <= 30 ? 0.15 : age <= 60 ? 0.3 : 0.55;
    const frag = age <= 12 ? 0 : age <= 30 ? 0.002 : age <= 60 ? 0.006 : 0.014;   // brief awakenings per minute of light or REM sleep
    const cyc = age <= 12 ? 80 : 90;
    let lat = (age >= 70 ? 20 : age >= 45 ? 15 : 12) + (o.coffee ? 20 : 0) - (o.alcohol ? 5 : 0) + (R() - 0.5) * 8;
    lat += Math.max(0, 22 - o.bed) * 12;                           // in bed before the clock is ready
    lat = Math.max(3, Math.round(lat));
    const push = (s, n) => { for (let i = 0; i < n && out.length < tib; i++) out.push(s); };
    push('W', lat);
    let k = 0;
    while (out.length < tib) {
      const len = cyc + Math.round((R() - 0.5) * 20);
      let n3 = deepBase * [1, 0.6, 0.25, 0.08, 0, 0, 0, 0][Math.min(k, 7)] * (o.coffee ? 0.8 : 1) * (o.apnea ? 0.5 : 1) * (0.85 + 0.3 * R());
      let rem = [8, 18, 25, 30, 34, 36, 36, 36][Math.min(k, 7)] * (age >= 65 ? 0.85 : age <= 12 ? 0.75 : 1) * (0.85 + 0.3 * R());
      if (o.alcohol) rem *= k < 2 ? 0.3 : 1.1;
      const n1 = k === 0 ? 5 : 2;
      n3 = Math.round(n3); rem = Math.round(rem);
      const n2 = Math.max(10, len - n1 - n3 - rem);
      const seq = [['N1', n1], ['N2', Math.round(n2 * 0.55)], ['N3', n3], ['N2', n2 - Math.round(n2 * 0.55)], ['R', rem]];
      for (const [s, n] of seq) {
        for (let i = 0; i < n && out.length < tib; i++) {
          // sleep apnoea: repeated brief arousals, worst in REM; age and alcohol (late in the night) fragment sleep too
          const late = o.alcohol && out.length > tib / 2 ? 0.015 : 0;
          if (o.apnea && s !== 'N3' && R() < (s === 'R' ? 0.12 : 0.06)) out.push('W');
          else if (s !== 'N3' && R() < frag + late) push('W', 1 + Math.round(R() * (age >= 65 ? 6 : 2)));
          else out.push(s);
        }
      }
      let pw = pWake + (o.alcohol && out.length > tib / 2 ? 0.3 : 0);
      if (R() < pw) push('W', 1 + Math.round(R() * (age >= 65 ? 8 : 3)));
      k++;
    }
    return out;
  }
  const clockOf = h => { const hh = ((Math.floor(h) % 24) + 24) % 24, mm = Math.round((h - Math.floor(h)) * 60); return String(hh).padStart(2, '0') + ':' + String(mm % 60).padStart(2, '0'); };
  Hyper.sim('neu-hypnogram', {
    title: 'A night\'s sleep: the hypnogram',
    blurb: `A hypnogram shows the stages of sleep through one night, as a sleep laboratory scores them from the EEG. This one is generated from typical patterns (not a recording): cycles of about 90 minutes, deep sleep (N3) early, REM sleep late. The faint line is sleep pressure (process S), falling while asleep and rising in each awakening.

- Compare a **child**, a **young adult** and an **older adult**: deep sleep shrinks with age and awakenings multiply — normal ageing, not in itself insomnia.
- Cut the **time in bed** from 8 to 6 hours: mostly REM sleep is lost, because it comes late.
- Add **alcohol**: REM is pushed out of the first cycles and the second half of the night breaks up.
- Add **sleep apnoea**: dozens of brief arousals fragment the night — the person may not remember any of them, but feels unrefreshed.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'age', type: 'select', label: 'Sleeper', options: [['A child of 8', 8], ['A young adult (25)', 25], ['Middle-aged (50)', 50], ['An older adult (75)', 75]], value: params.age || 25 },
        { id: 'bed', label: 'Bedtime', min: 20, max: 26, step: 0.25, value: 23, fmt: v => clockOf(v) },
        { id: 'tib', label: 'Time in bed', min: 4, max: 11, step: 0.25, value: params.tib || 8, unit: 'h' },
        { id: 'coffee', type: 'check', label: 'Coffee late in the afternoon', value: false },
        { id: 'alcohol', type: 'check', label: 'Two alcoholic drinks in the evening', value: false },
        { id: 'apnea', type: 'check', label: 'Obstructive sleep apnoea', value: !!params.apnea },
        { type: 'buttons', items: [{ id: 'again', label: 'Another night', primary: true }] }
      ], id => { if (id === 'again') seed++; build(); });
      const ro = kit.readout(box.side, [['tst', 'Total sleep'], ['eff', 'Sleep efficiency'], ['lat', 'Time to fall asleep'], ['n3', 'Deep sleep (N3)'], ['rem', 'REM sleep'], ['wake', 'Awakenings'], ['cyc', 'Sleep cycles']]);
      const V = ctl.values;
      let seed = 3, night = [], S = [];
      function build() {
        night = makeNight({ age: V.age, tib: V.tib, bed: V.bed, coffee: V.coffee, alcohol: V.alcohol, apnea: V.apnea }, kit.fin.uniforms(seed * 7919 + V.age));
        // sleep pressure: falls while asleep (τ 4.2 h), rises while awake (τ 18.2 h), from 0.67 at bedtime
        S = []; let s = 0.67;
        for (const x of night) { s = x === 'W' ? 1 - (1 - s) * Math.exp(-1 / 60 / 18.2) : s * Math.exp(-1 / 60 / 4.2); S.push(s); }
        const asleep = night.filter(x => x !== 'W').length, lat = night.indexOf(night.find(x => x !== 'W'));
        let wakes = 0, cycles = 0, lastR = -1e9;
        for (let i = 1; i < night.length; i++) {
          if (i > lat && night[i] === 'W' && night[i - 1] !== 'W') wakes++;
          if (night[i] === 'R') { if (i - lastR > 20) cycles++; lastR = i; }       // a new REM period ends a cycle
        }
        const cnt = st2 => night.filter(x => x === st2).length;
        ro.set('tst', Math.floor(asleep / 60) + ' h ' + String(asleep % 60).padStart(2, '0') + ' min');
        ro.set('eff', Math.round(asleep / Math.max(1, night.length) * 100) + ' %');
        ro.set('lat', Math.max(0, lat) + ' min');
        ro.set('n3', cnt('N3') + ' min (' + Math.round(cnt('N3') / Math.max(1, asleep) * 100) + ' %)');
        ro.set('rem', cnt('R') + ' min (' + Math.round(cnt('R') / Math.max(1, asleep) * 100) + ' %)');
        ro.set('wake', String(wakes));
        ro.set('cyc', String(cycles));
        if (loop) loop.once();
      }
      let loop = null;
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const L = 56, R = W - 16, T = 18, B = Hh - 70;
        const n = Math.max(1, night.length), X = i => L + i / n * (R - L), Y = k => T + k / 4 * (B - T);
        const names = ['Awake', 'REM', 'N1', 'N2', 'N3 (deep)'];
        c.font = '11px system-ui, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
        names.forEach((nm, k) => { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(L, Y(k)); c.lineTo(R, Y(k)); c.stroke(); c.fillStyle = k === 1 ? kit.hue(330) : k === 4 ? kit.hue(215) : C.muted; c.fillText(nm, L - 6, Y(k)); });
        // N3 shading and REM bars
        night.forEach((s, i) => {
          if (s === 'N3') { c.fillStyle = kit.hue(215, 0.25); c.fillRect(X(i), Y(3), X(i + 1) - X(i) + 0.5, Y(4) - Y(3)); }
          if (s === 'R') { c.fillStyle = kit.hue(330); c.fillRect(X(i), Y(1) - 4, X(i + 1) - X(i) + 0.5, 8); }
        });
        c.strokeStyle = C.text2; c.lineWidth = 1.6; c.beginPath();
        night.forEach((s, i) => { const y = Y(STAGE_Y[s]); if (i) { c.lineTo(X(i), y); } else c.moveTo(X(i), y); c.lineTo(X(i + 1), y); });
        c.stroke();
        // sleep pressure (right-hand scale 0–1, drawn across the chart)
        c.strokeStyle = C.warn; c.globalAlpha = 0.6; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath();
        S.forEach((v, i) => { const y = B - v * (B - T); if (i) c.lineTo(X(i + 1), y); else c.moveTo(X(i), y); });
        c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
        kit.label(c, 'sleep pressure', R - 4, B - (S.length ? S[S.length - 1] : 0) * (B - T) - 10, { size: 10.5, color: C.warn, align: 'right' });
        // clock times
        c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let h = Math.ceil(V.bed); h <= V.bed + V.tib + 1e-9; h++) { const x = X((h - V.bed) * 60); c.fillRect(x, B + 2, 1, 5); c.fillText(clockOf(h), x, B + 9); }
        // a bar of the time in each stage
        const counts = { W: 0, R: 0, N1: 0, N2: 0, N3: 0 }; night.forEach(s => counts[s]++);
        const cols = { W: C.faint, N1: kit.hue(180), N2: kit.hue(200), N3: kit.hue(215), R: kit.hue(330) };
        let x = L; const by = Hh - 30;
        for (const s of ['W', 'N1', 'N2', 'N3', 'R']) {
          const w = counts[s] / n * (R - L);
          c.fillStyle = cols[s]; c.fillRect(x, by, w, 14);
          if (w > 44) kit.label(c, (s === 'R' ? 'REM' : s === 'W' ? 'awake' : s) + ' ' + Math.round(counts[s] / n * 100) + '%', x + w / 2, by + 7, { size: 10, color: '#fff', align: 'center', weight: 650 });
          x += w;
        }
        kit.label(c, 'time in bed', L, by - 8, { size: 10.5, color: C.muted });
      }
      loop = kit.loop(() => draw(), box.stage);
      build();
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ time is brain */
  const RATE = 1.9e6, COMPLETE = 600;                       // neurons per minute (Saver 2006); the infarct is complete by about 10 h
  const bigNum = n => n >= 1e12 ? (n / 1e12).toFixed(1) + ' trillion' : n >= 1e9 ? (n / 1e9).toFixed(2) + ' billion' : n >= 1e6 ? Math.round(n / 1e6) + ' million' : n > 0 ? Math.round(n / 1e3) + ' thousand' : '0';
  const hm = m => { const r = Math.round(m); return Math.floor(r / 60) + ' h ' + String(r % 60).padStart(2, '0') + ' min'; };
  Hyper.sim('neu-stroke-clock', {
    title: 'Time is brain: the stroke clock',
    blurb: `A large ischaemic stroke — a clot in the middle cerebral artery — as the minutes pass. The **core** (red) is brain already lost; the **penumbra** (amber) is brain that is failing but can still be saved if the artery is reopened. Without treatment the core grows at about 1.9 million neurons a minute until, after about 10 hours, the whole territory is lost (Saver, 2006: an average for a typical large stroke — real strokes vary). Press **Run the clock**.

- Change **when help is called**: waiting an hour to "see if it passes" costs over a hundred million neurons, and can close the window for treatment.
- Clot-dissolving medicine must start within **4.5 hours**; clot removal within **6 hours**, or up to 24 hours in selected patients whose scans still show brain to save.
- The model assumes treatment reopens the artery. In reality clot-dissolving medicine often fails to open a large artery, which is why clot removal matters for these strokes.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'call', label: 'Symptoms start → call for help', min: 0, max: 240, step: 5, value: params.call != null ? params.call : 15, unit: 'min' },
        { id: 'travel', label: 'Call → arrival at a stroke centre', min: 15, max: 180, step: 5, value: 45, unit: 'min' },
        { id: 'door', label: 'Arrival → treatment starts', min: 15, max: 120, step: 5, value: 40, unit: 'min' },
        { id: 'treat', type: 'select', label: 'Treatment', options: [['Clot removal (thrombectomy)', 'ect'], ['Clot-dissolving medicine (thrombolysis)', 'lysis'], ['No treatment', 'none']], value: params.treat || 'ect' },
        { type: 'buttons', items: [{ id: 'go', label: 'Run the clock', primary: true }] }
      ], id => { plan(); if (id === 'go') t = 0; });
      const ro = kit.readout(box.side, [['clock', 'Time since symptoms began'], ['now', 'What is happening'], ['lost', 'Neurons lost so far'], ['more', 'Also lost'], ['age', 'Like normal brain ageing of'], ['end', 'Final loss with this timeline']]);
      const plot = kit.plot(box.stage, { x: { label: 'hours since the symptoms began', min: 0, max: 12 }, y: { label: 'neurons lost (billions)', min: 0, max: 1.2 }, legend: true }, 160);
      const V = ctl.values;
      let t = 0, P = null;
      function plan() {
        const tc = V.call, ta = tc + V.travel, tt = ta + V.door;
        let ok = false, note = '';
        if (V.treat === 'lysis') { ok = tt <= 270; note = ok ? 'within the 4.5-hour window' : 'too late for clot-dissolving medicine (over 4.5 h)'; }
        else if (V.treat === 'ect') { ok = tt <= 1440; note = tt <= 360 ? 'within the 6-hour window' : ok ? 'after 6 h: only if scans show brain still worth saving' : 'too late (over 24 h)'; }
        const tr = ok ? tt + (V.treat === 'ect' ? 25 : 35) : Infinity;
        P = { tc, ta, tt, tr, ok, note };
        const lostAt = m => RATE * Math.min(m, tr, COMPLETE);
        const pts = [], none = [];
        for (let m = 0; m <= 720; m += 5) { pts.push([m / 60, lostAt(m) / 1e9]); none.push([m / 60, RATE * Math.min(m, COMPLETE) / 1e9]); }
        const C = kit.colors();
        plot.set({
          series: [{ pts: none, label: 'no treatment', dash: [5, 4], color: C.faint }, { pts, label: 'this timeline', color: C.bad, fill: true }],
          vlines: [{ x: tc / 60, label: 'call', color: C.muted }, { x: ta / 60, label: 'arrive', color: C.muted }].concat(V.treat !== 'none' ? [{ x: tt / 60, label: ok ? 'treat' : 'no treatment', color: ok ? C.ok : C.bad }] : []),
          hlines: []
        });
        P.final = lostAt(720);
        ro.set('end', bigNum(P.final) + ' neurons' + (V.treat !== 'none' ? ' — ' + note : ''));
      }
      function blob(c, cx, cy, r, wob, seed) {
        c.beginPath();
        for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2, rr = r * (1 + wob * Math.sin(3 * a + seed) + wob * 0.6 * Math.sin(5 * a + 2 * seed)); const x = cx + Math.cos(a) * rr * 1.25, y = cy + Math.sin(a) * rr; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.closePath();
      }
      function draw(dt) {
        if (t < 720) t = Math.min(720, t + (dt || 0) * 36);      // 36 minutes per second
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const lost = RATE * Math.min(t, P.tr, COMPLETE), frac = Math.min(1, lost / (RATE * COMPLETE));
        const reperfused = t >= P.tr;
        // the brain, seen from the left
        const bx = W * 0.25, by = Hh * 0.45, br = Math.min(W * 0.2, Hh * 0.36);
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.ellipse(bx + br * 0.9, by + br * 0.62, br * 0.34, br * 0.22, 0.2, 0, Math.PI * 2); c.fill(); c.stroke();   // cerebellum
        c.beginPath(); c.moveTo(bx + br * 0.35, by + br * 0.55); c.lineTo(bx + br * 0.45, by + br * 1.05); c.lineTo(bx + br * 0.62, by + br * 1.05); c.lineTo(bx + br * 0.62, by + br * 0.5); c.fill(); c.stroke();   // brainstem
        c.beginPath(); c.ellipse(bx, by, br * 1.3, br * 0.82, 0, 0, Math.PI * 2); c.fill(); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1.2;
        for (let k = 0; k < 7; k++) { c.beginPath(); const x = bx - br * 1.0 + k * br * 0.32; c.moveTo(x, by - br * 0.7); c.quadraticCurveTo(x + br * 0.14, by - br * 0.2, x - br * 0.05, by + br * 0.35); c.stroke(); }
        // the territory, the penumbra and the core
        const tx = bx - br * 0.05, ty = by - br * 0.02, tr = br * 0.62;
        blob(c, tx, ty, tr, 0.08, 1.3); c.fillStyle = reperfused ? kit.hue(150, 0.35) : kit.hue(40, 0.45); c.fill();
        if (frac > 0) { blob(c, tx, ty, tr * Math.sqrt(frac), 0.1, 2.1); c.fillStyle = C.bad; c.fill(); }
        kit.label(c, reperfused ? 'penumbra saved' : 'penumbra at risk', tx, ty - tr - 12, { size: 11, color: reperfused ? kit.hue(150) : kit.hue(40), align: 'center', weight: 650 });
        kit.label(c, 'core (lost)', tx, ty + tr + 14, { size: 11, color: C.bad, align: 'center', weight: 650 });
        // the clot in the artery
        const ax = bx - br * 0.2, ay = by + br * 0.55;
        c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(bx - br * 0.9, by + br * 0.9); c.lineTo(ax, ay); c.lineTo(tx, ty); c.stroke();
        if (!reperfused) { kit.dot(c, ax, ay, 6, C.text, C.bg2); kit.label(c, 'clot', ax - 10, ay + 14, { size: 10.5, color: C.text2, align: 'right' }); }
        // the clock and the counters
        const cx0 = W * 0.56;
        kit.label(c, hm(t), cx0, Hh * 0.13, { size: 26, weight: 700, color: C.text });
        kit.label(c, 'since the symptoms began', cx0, Hh * 0.13 + 22, { size: 11, color: C.muted });
        kit.label(c, bigNum(lost), cx0, Hh * 0.38, { size: 22, weight: 700, color: C.bad });
        kit.label(c, 'neurons lost', cx0, Hh * 0.38 + 20, { size: 11, color: C.muted });
        // the treatment windows
        const wx0 = cx0, wx1 = W - 16, H24 = 12 * 60, X = m => wx0 + clamp(m / H24, 0, 1) * (wx1 - wx0);
        const bar = (y, m1, m2, lab, col) => { c.fillStyle = col; c.fillRect(X(0), y, X(m1) - X(0), 10); if (m2 > m1) { c.globalAlpha = 0.35; c.fillRect(X(m1), y, X(m2) - X(m1), 10); c.globalAlpha = 1; } kit.label(c, lab, X(0), y - 8, { size: 10.5, color: C.text2 }); };
        bar(Hh * 0.62, 270, 270, 'clot-dissolving medicine: 4.5 h', kit.hue(200));
        bar(Hh * 0.62 + 34, 360, H24, 'clot removal: 6 h (some up to 24 h)', kit.hue(260));
        c.fillStyle = C.muted; c.font = '10px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let h = 0; h <= 12; h += 2) c.fillText(h + ' h', X(h * 60), Hh * 0.62 + 50);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(t), Hh * 0.62 - 4); c.lineTo(X(t), Hh * 0.62 + 48); c.stroke();
        if (V.treat !== 'none') { const mx = X(P.tt); c.fillStyle = P.ok ? C.ok : C.bad; c.beginPath(); c.moveTo(mx, Hh * 0.62 + 46); c.lineTo(mx - 5, Hh * 0.62 + 56); c.lineTo(mx + 5, Hh * 0.62 + 56); c.closePath(); c.fill(); }
        // readouts
        const ev = t < P.tc ? 'symptoms — nobody has called yet' : t < P.ta ? 'help called; on the way to hospital' : V.treat === 'none' ? 'in hospital, no reperfusion treatment' : t < P.tt ? 'scan and checks before treatment' : !P.ok ? 'too late for this treatment' : !reperfused ? (V.treat === 'ect' ? 'clot removal under way' : 'clot-dissolving medicine running') : 'artery reopened: the penumbra is saved';
        ro.set('clock', hm(t));
        ro.set('now', frac >= 1 && !reperfused ? 'the whole territory is lost' : ev);
        ro.set('lost', bigNum(lost));
        const mins = Math.min(t, P.tr, COMPLETE);
        ro.set('more', bigNum(13.8e9 * mins) + ' synapses, ' + Math.round(12 * mins) + ' km of nerve fibre');
        ro.set('age', (3.6 * mins / 60).toFixed(1) + ' years');
        plot.set({ marks: [{ x: t / 60, y: lost / 1e9, color: C.bad }] });
      }
      plan();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the EEG */
  const CH = [['Fp1', -0.28, -0.8, 'F'], ['Fp2', 0.28, -0.8, 'F'], ['C3', -0.42, 0, 'C'], ['C4', 0.42, 0, 'C'], ['T3', -0.86, 0, 'T'], ['T4', 0.86, 0, 'T'], ['O1', -0.28, 0.8, 'O'], ['O2', 0.28, 0.8, 'O']];
  const EEG_STATES = [
    ['Awake, eyes open', 'open'], ['Awake, relaxed, eyes closed', 'closed'], ['Drowsy (N1)', 'drowsy'], ['Light sleep (N2)', 'n2'], ['Deep sleep (N3)', 'n3'], ['REM sleep', 'rem'],
    ['Absence seizure', 'absence'], ['Focal seizure, left temporal lobe', 'temporal'], ['Focal motor seizure, right motor cortex', 'motor'], ['Generalised tonic–clonic seizure', 'tonic']
  ];
  const EEG_TEXT = {
    open: ['beta, 13–30 Hz, low voltage', 'alert, eyes open', '—'],
    closed: ['alpha, 8–12 Hz, strongest at the back (occipital)', 'relaxed, eyes closed', '—'],
    drowsy: ['theta, 4–7 Hz; the alpha rhythm fades', 'drifting off', 'eyes rolling slowly'],
    n2: ['theta with sleep spindles (12–14 Hz bursts) and K-complexes', 'asleep, unaware', 'quiet, breathing slow and regular'],
    n3: ['delta, 0.5–2 Hz, large slow waves', 'deeply asleep, hard to wake', 'still, very slow breathing'],
    rem: ['low-voltage mixed waves, like waking; eye movements in the front channels', 'dreaming', 'eyes darting under the lids, body limp'],
    absence: ['3 per second spike-and-wave in every channel', 'a gap of about ten seconds, with no memory of it', 'a blank stare and fluttering eyelids; then carries on as before'],
    temporal: ['rhythmic theta building in the left temporal channels (T3) and spreading', 'first a rising feeling in the stomach or déjà vu; then unaware, with no memory of it', 'staring, lip-smacking, fumbling with the hands; confused afterwards'],
    motor: ['rhythmic spikes over the right motor strip (C4)', 'fully aware; cannot stop the jerking', 'jerking of the LEFT hand, which may spread up the arm to the face'],
    tonic: ['fast activity building in every channel, then bursts of spikes, then a flat, exhausted record', 'unconscious; no memory of it', 'falls, stiffens, then jerks all over; breathing irregular; drowsy and confused afterwards']
  };
  Hyper.sim('neu-eeg', {
    title: 'The EEG: brain rhythms and seizures',
    blurb: `The EEG records voltages of a few tens of microvolts from electrodes on the scalp — the summed activity of millions of cortical neurons below each one. Eight channels are shown with the position of each electrode on the head (seen from above, nose at the top). The traces are generated, not recorded, but follow the real rhythms and patterns; muscle and movement usually swamp a real EEG during a convulsion.

- Compare **eyes open** and **eyes closed**: the alpha rhythm appears, strongest over the occipital (visual) lobes.
- Step down through **N1, N2 and N3**: slower, larger waves; spindles and K-complexes mark N2.
- Choose a **focal seizure**: it starts under one electrode and spreads, and what the person experiences depends on where it starts.
- An **absence seizure** is generalised from the first moment: 3 spike-and-wave complexes a second everywhere, for about ten seconds.
- In a **tonic–clonic seizure**, watch the clock: if one lasts more than 5 minutes, call your local emergency number.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'state', type: 'select', label: 'Recording', options: EEG_STATES, value: params.state || 'closed' },
        { id: 'fast', type: 'check', label: 'Fast forward ×4', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Start again', primary: true }] }
      ], id => { if (id !== 'fast') { t = 10; onset = 13; } });
      const ro = kit.readout(box.side, [['rhythm', 'The EEG shows'], ['feel', 'The person'], ['seen', 'An onlooker sees'], ['clock', 'Seizure clock']]);
      const V = ctl.values;
      // random phases, per channel and component
      const U = kit.fin.uniforms(21), ph = CH.map(() => Array.from({ length: 24 }, () => U() * Math.PI * 2));
      const g = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) * ((x - m) / s));
      const band = (k, t, fs, i0) => { let v = 0; for (let j = 0; j < fs.length; j++) v += Math.sin(2 * Math.PI * fs[j] * t + ph[k][i0 + j]); return v / Math.sqrt(fs.length); };
      const DELTA = [0.8, 1.3, 1.9], THETA = [4.6, 5.8, 6.7], ALPHA = [9.6, 10.1, 10.7], BETA = [15, 18.5, 22, 26.5], EMG = [37, 43, 51, 58];
      const seizures = { absence: { dur: 10, every: 26 }, temporal: { dur: 60 }, motor: { dur: 40 }, tonic: { dur: 60 } };
      let t = 10, onset = 13;
      // the background rhythm of a state: amplitudes (µV) of delta, theta, alpha and beta at a channel
      function background(s, k, tt) {
        const reg = CH[k][3];
        let a = [4, 5, reg === 'O' ? 10 : 4, 9];
        if (s === 'closed') a = [4, 5, reg === 'O' ? 45 : reg === 'T' ? 25 : reg === 'C' ? 22 : 12, 5];
        if (s === 'drowsy') a = [8, 22, reg === 'O' ? 8 : 4, 5];
        if (s === 'n2') a = [22, 20, 3, 4];
        if (s === 'n3') a = [reg === 'F' ? 95 : 80, 14, 2, 3];
        if (s === 'rem') a = [6, 12, 4, 8];
        let v = a[0] * band(k, tt, DELTA, 0) + a[1] * band(k, tt, THETA, 3) + a[2] * band(k, tt, ALPHA, 6) * (0.75 + 0.25 * Math.sin(2 * Math.PI * 0.3 * tt + k)) + a[3] * band(k, tt, BETA, 9);
        if (s === 'n2') {
          const cyc = ((tt % 7) + 7) % 7;                             // a spindle every 7 s, a K-complex every 7 s offset
          v += (reg === 'C' ? 28 : 16) * g(cyc, 2, 0.35) * Math.sin(2 * Math.PI * 13 * tt);
          const kc = (((tt + 3.5) % 11) + 11) % 11;
          v += (reg === 'F' || reg === 'C' ? 1 : 0.5) * (-90 * g(kc, 1, 0.12) + 60 * g(kc, 1.35, 0.2));
        }
        if (s === 'drowsy' && reg === 'C') { const vx = (((tt + 1) % 6) + 6) % 6; v += -45 * g(vx, 1, 0.08) + 20 * g(vx, 1.2, 0.1); }
        if (s === 'rem') {
          const sw = (((tt) % 5) + 5) % 5;
          v += 18 * g(sw, 2, 0.6) * ((3 * tt) % 1 - 0.5) * 2;
          if (reg === 'F') { const em = (((tt + 0.7) % 3.3) + 3.3) % 3.3, sgn = k === 0 ? 1 : -1; v += sgn * 90 * (g(em, 1, 0.15) - g(em, 2.2, 0.18)); }
        }
        return v;
      }
      const sw = (x) => { const p = ((x % 1) + 1) % 1; return 1.0 * g(p, 0.12, 0.02) - 0.55 * g(p, 0.45, 0.1); };
      // the seizure component and a scale for the background (post-ictal suppression)
      function seizure(s, k, tt) {
        const reg = CH[k][3], left = CH[k][1] < 0;
        if (s === 'absence') {
          const T = ((tt - onset) % 26 + 26) % 26;
          if (tt < onset || T > 10) return [0, 1];
          return [(reg === 'F' ? 170 : reg === 'O' ? 100 : 140) * sw(3 * T), 0.3];
        }
        const tau = tt - onset;
        if (tau < 0) return [0, 1];
        if (s === 'temporal') {
          const inv = k === 4 ? 1 : k === 0 || k === 2 ? 0.55 * clamp((tau - 8) / 10, 0, 1) : k === 6 ? 0.3 * clamp((tau - 15) / 10, 0, 1) : 0.12 * clamp((tau - 30) / 10, 0, 1);
          if (tau < 60) { const amp = 110 * clamp(tau / 12, 0, 1) * inv; return [amp * Math.sin(2 * Math.PI * (6.5 * tau - 1.25 * tau * tau / 60)), 1 - 0.5 * inv]; }
          if (tau < 100 && left) return [45 * band(k, tt, DELTA, 0) * clamp((100 - tau) / 40, 0, 1) * (k === 4 ? 1 : 0.5), 0.6];
          return [0, 1];
        }
        if (s === 'motor') {
          const inv = k === 3 ? 1 : k === 5 || k === 1 ? 0.5 * clamp((tau - 10) / 10, 0, 1) : 0;
          if (tau < 40) return [150 * inv * clamp(tau / 6, 0, 1) * sw(2 * tau), 1 - 0.4 * inv];
          return [0, 1];
        }
        if (s === 'tonic') {
          if (tau < 15) { const amp = 20 + 130 * tau / 15; return [amp * Math.sin(2 * Math.PI * (20 * tau - tau * tau / 3)) + (reg === 'T' || reg === 'F' ? 55 * band(k, tt, EMG, 13) * clamp(tau / 3, 0, 1) : 0), 0.2]; }
          if (tau < 60) {
            const u = (tau - 15) / 45, iv = 0.25 + 0.75 * u, p = ((tau - 15) % iv) / iv;
            const burst = 170 * (g(p, 0.08, 0.02) + 0.8 * g(p, 0.16, 0.02) - 0.6 * g(p, 0.4, 0.09)) * (1 - 0.3 * u);
            return [burst + (reg === 'T' || reg === 'F' ? 50 * band(k, tt, EMG, 13) * g(p, 0.12, 0.08) : 0), 0.2];
          }
          if (tau < 85) return [0, 0.08];
          if (tau < 160) return [55 * band(k, tt, DELTA, 0) * clamp((160 - tau) / 75, 0, 1), 0.3];
          return [0, 1];
        }
        return [0, 1];
      }
      const baseState = s => (s === 'absence' || s === 'temporal' || s === 'motor' || s === 'tonic') ? 'open' : s;
      const signal = (k, tt) => { const s = V.state, [z, bg] = seizure(s, k, tt); return bg * background(baseState(s), k, tt) + z; };
      function involvement(k) {
        const s = V.state;
        if (!seizures[s]) return 0;
        let a = 0;
        for (let j = 0; j < 20; j++) { const [z] = seizure(s, k, t - j * 0.05); a = Math.max(a, Math.abs(z)); }
        return clamp(a / 120, 0, 1);
      }
      function draw(dt) {
        t += (dt || 0) * (V.fast ? 4 : 1);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the head from above
        const hr = Math.min(W * 0.14, Hh * 0.3), hx = hr + 18, hy = Hh * 0.5;
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.moveTo(hx - hr * 0.16, hy - hr * 0.98); c.lineTo(hx, hy - hr * 1.18); c.lineTo(hx + hr * 0.16, hy - hr * 0.98); c.stroke();
        for (const sgn of [-1, 1]) { c.beginPath(); c.ellipse(hx + sgn * hr * 1.02, hy, hr * 0.08, hr * 0.2, 0, 0, Math.PI * 2); c.fill(); c.stroke(); }
        c.beginPath(); c.arc(hx, hy, hr, 0, Math.PI * 2); c.fill(); c.stroke();
        // lobes, faintly
        const lobe = (y0, y1, col, lab, ly) => { c.save(); c.beginPath(); c.arc(hx, hy, hr - 2, 0, Math.PI * 2); c.clip(); c.fillStyle = col; c.fillRect(hx - hr, hy + y0 * hr, 2 * hr, (y1 - y0) * hr); c.restore(); kit.label(c, lab, hx, hy + ly * hr, { size: 9.5, color: C.muted, align: 'center' }); };
        lobe(-1, -0.2, kit.hue(30, 0.12), 'frontal', -0.5); lobe(-0.2, 0.15, kit.hue(120, 0.12), 'motor / sensory', -0.14); lobe(0.15, 0.55, kit.hue(200, 0.12), 'parietal', 0.3); lobe(0.55, 1, kit.hue(270, 0.14), 'occipital', 0.6);
        kit.label(c, 'temporal', hx - hr * 0.68, hy + hr * 0.3, { size: 9.5, color: C.muted, align: 'center' });
        kit.label(c, 'temporal', hx + hr * 0.68, hy + hr * 0.3, { size: 9.5, color: C.muted, align: 'center' });
        kit.label(c, 'L', hx - hr - 12, hy - hr * 0.5, { size: 11, weight: 700, color: C.muted, align: 'center' });
        kit.label(c, 'R', hx + hr + 12, hy - hr * 0.5, { size: 11, weight: 700, color: C.muted, align: 'center' });
        CH.forEach(([nm, x, y], k) => {
          const inv = involvement(k), px = hx + x * hr * 0.9, py = hy + y * hr * 0.9;
          if (inv > 0.05) { c.save(); c.globalAlpha = 0.35 * inv; c.fillStyle = C.bad; c.beginPath(); c.arc(px, py, 10 + 14 * inv, 0, Math.PI * 2); c.fill(); c.restore(); }
          kit.dot(c, px, py, 5, inv > 0.05 ? C.bad : C.text2, C.surface);
          kit.label(c, nm, px, py + 11, { size: 9.5, color: C.text2, align: 'center' });
        });
        // the traces: 10 s of each channel, newest on the right
        const x0 = hx + hr + 50, x1 = W - 10, secs = 10, rows = CH.length, top = 14, bot = Hh - 26, gap = (bot - top) / rows;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let s = 0; s <= secs; s++) { const x = x0 + s / secs * (x1 - x0); c.beginPath(); c.moveTo(x, top); c.lineTo(x, bot); c.stroke(); }
        const n = Math.max(50, Math.round((x1 - x0) * 1.5)), uv = gap * 0.5 / 100;   // 100 µV = half a row
        CH.forEach(([nm], k) => {
          const y0 = top + gap * (k + 0.5);
          kit.label(c, nm, x0 - 8, y0, { size: 10.5, color: C.muted, align: 'right' });
          c.strokeStyle = involvement(k) > 0.05 ? C.bad : C.text; c.lineWidth = 1.1; c.beginPath();
          for (let i = 0; i <= n; i++) {
            const tt = t - secs + i / n * secs, v = clamp(signal(k, tt), -260, 260);
            const x = x0 + i / n * (x1 - x0), y = y0 - v * uv;
            if (i) c.lineTo(x, y); else c.moveTo(x, y);
          }
          c.stroke();
        });
        // scale bar and time
        const sbx = x1 - 6, sby = bot + 4;
        kit.label(c, '1 s per division · bar = 100 µV · simulated', x0, Hh - 10, { size: 10.5, color: C.muted });
        c.strokeStyle = C.text2; c.lineWidth = 2; c.beginPath(); c.moveTo(sbx, sby); c.lineTo(sbx, sby - gap * 0.5); c.stroke();
        // readouts
        const tx = EEG_TEXT[V.state] || EEG_TEXT.open, sz = seizures[V.state];
        let phase = '', clock = '—';
        if (sz) {
          const tau = V.state === 'absence' ? (((t - onset) % 26) + 26) % 26 : t - onset;
          const on = t >= onset && tau < sz.dur;
          phase = t < onset ? 'before' : on ? 'during' : 'after';
          clock = t < onset ? 'starting in ' + (onset - t).toFixed(0) + ' s' : on ? Math.floor(tau) + ' s since it started' : V.state === 'absence' ? 'over after about 10 s' : 'over after ' + sz.dur + ' s' + (V.state === 'tonic' ? '; recovery takes minutes to hours' : '');
        }
        ro.set('rhythm', phase === 'before' || (phase === 'after' && V.state === 'absence') ? EEG_TEXT.open[0] : phase === 'after' ? 'slow waves as the brain recovers' : tx[0]);
        ro.set('feel', phase === 'before' ? 'normal' : phase === 'after' ? (V.state === 'absence' ? 'back to normal at once' : V.state === 'motor' ? 'the left hand may stay weak for a while' : 'drowsy, confused, recovering') : tx[1]);
        ro.set('seen', phase === 'before' ? 'nothing unusual' : phase === 'after' ? (V.state === 'tonic' ? 'deep, noisy breathing; slowly wakes — place in the recovery position' : V.state === 'absence' ? 'nothing — carries on' : 'confused for a few minutes') : tx[2]);
        ro.set('clock', clock);
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
