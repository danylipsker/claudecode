/* HYPER-PHARMACEUTICS · sims/solubility-stability.js — simulations for solubility, ionisation and stability.
 *   sol-ph-profile   the pH–solubility profile of a weak acid or base with its salt and pHmax (kit.pharma.solubility),
 *                    and a dose followed down the gut: dissolving, supersaturating, precipitating, absorbed
 *   sol-partition    a shake flask of octanol and water: neutral molecules partition, ions stay in water (log P, log D)
 *   sol-buffer       a buffer titrated drop by drop: pH, species, and the capacity curve (charge balance, Van Slyke)
 *   sol-solubilisers a cosolvent (log-linear) or cyclodextrin (1 : 1) formulation diluted as on injection
 *   sol-polymorph    stable, metastable and amorphous forms dissolving side by side: spring and parachute
 *   sol-order        a noisy stability study fitted as zero, first and second order, and extrapolated
 *   sol-ph-rate      the V-shaped pH–rate profile of a hydrolysis, with buffer catalysis and temperature
 *   sol-light        light, container and drug spectra in a photostability cabinet (ICH Q1B doses)
 * All drugs are hypothetical teaching examples; none of this is a dosing or formulation tool.
 */
(function () {
  'use strict';
  const K0 = 273.15, RGAS = 8.314462618;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, f) => a + (b - a) * f;
  // a concentration given in mg/mL, written in a readable unit
  function conc(v) {
    if (!(v > 0)) return '0 mg/mL';
    if (v > 1000) return 'over 1 g/mL';
    if (v >= 0.1) return Number(v.toPrecision(3)) + ' mg/mL';
    if (v >= 1e-4) return Number((v * 1000).toPrecision(3)) + ' µg/mL';
    return Number((v * 1e6).toPrecision(3)) + ' ng/mL';
  }
  // universal-indicator colour for a pH (red at 1, green at 7, violet at 11)
  const phColor = (pH, a) => 'hsl(' + (clamp((pH - 1) / 10, 0, 1) * 275).toFixed(0) + ' 70% 52% / ' + a + ')';
  // least squares y = a + b x -> { a, b, r2 }
  function lsq(xs, ys) {
    const n = xs.length, mx = xs.reduce((s, v) => s + v, 0) / n, my = ys.reduce((s, v) => s + v, 0) / n;
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
    const b = sxx > 0 ? sxy / sxx : 0, a = my - b * mx;
    return { a, b, r2: syy > 0 && sxx > 0 ? (sxy * sxy) / (sxx * syy) : 1 };
  }
  // fixed pseudo-random numbers so that drawings do not flicker
  function scatter(n, seed) {
    let s = seed || 7;
    const r = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    return Array.from({ length: n }, () => ({ x: r(), y: r(), w: r() * 6.283, u: r() }));
  }
  function months(x) {
    if (!Number.isFinite(x) || x > 1200) return 'over 100 years';
    if (x >= 24) return (x / 12).toFixed(1) + ' years';
    if (x >= 1) return x.toFixed(1) + ' months';
    if (x * 30.44 >= 1) return (x * 30.44).toFixed(1) + ' days';
    return (x * 730.5).toFixed(1) + ' hours';
  }

  /* ================================================================ sol-ph-profile */
  Hyper.sim('sol-ph-profile', {
    title: 'pH–solubility profile and a dose down the gut',
    blurb: `The solubility of a weak acid or base: flat at the intrinsic solubility S₀ where the drug is un-ionised, rising tenfold per pH unit where it ionises, and capped by the salt's own solubility beyond **pHmax**. The dashed curves are the free-form and salt branches; the drug follows whichever is lower. Below, a dose is swallowed with a glass of water (250 mL) and followed for four hours — stomach, duodenum, jejunum, ileum — in a simple model: it dissolves up to the local solubility, may stay supersaturated for a while and then precipitate, and is absorbed from the intestine.

**Try this**
- With the weak base, swallow the dose with a fasting stomach, then again "on an acid-reducing medicine". How much less is absorbed?
- Watch the base leave the stomach: the dissolved line rises above what the intestine can hold. How long does the supersaturation last?
- Switch to the weak acid: now the stomach is the poor place and the intestine the good one.
- Raise the salt solubility: pHmax moves further from the pKa. Lower it below the dose line and even the stomach cannot dissolve the dose.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Drug', options: [['Weak base', 'base'], ['Weak acid', 'acid']], value: 'base' },
        { id: 'pKa', label: 'pKa', min: 1, max: 12, step: 0.1, value: 6.5 },
        { id: 'S0', label: 'Intrinsic solubility S₀', min: 0.0001, max: 1, value: 0.005, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'Ss', label: 'Solubility of the salt', min: 0.1, max: 200, value: 5, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'dose', label: 'Dose (with 250 mL)', min: 1, max: 1000, value: 200, unit: 'mg', log: true, sig: 2 },
        { id: 'pH', label: 'pH of a beaker', min: 1, max: 10, step: 0.05, value: 1.5 },
        { id: 'stomach', type: 'select', label: 'Stomach', options: [['Fasting (pH 1.5)', 1.5], ['After a meal (pH 4.5)', 4.5], ['On an acid-reducing medicine (pH 5.5)', 5.5]], value: 1.5 },
        { type: 'buttons', items: [{ id: 'go', label: 'Swallow the dose', primary: true }, { id: 'stop', label: 'Pause' }] }
      ], (id) => {
        if (id === 'kind') { ctl.set('pKa', V.kind === 'acid' ? 4.4 : 6.5); ctl.set('S0', V.kind === 'acid' ? 0.02 : 0.005); }
        if (id === 'go') { mode = 'journey'; jt = 0; playing = true; }
        else if (id === 'stop') playing = !playing && mode === 'journey' && jt < 240;
        else if (id === 'pH') mode = 'beaker';
        recompute();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Solubility at this pH'], ['ion', 'Ionised (dissolved drug)'], ['solid', 'Solid in equilibrium'], ['pHmax', 'pHmax'], ['d0', 'Dose number here'], ['abs', 'Absorbed after 4 h']]);
      const pS = kit.plot(g1, { x: { label: 'pH', min: 1, max: 10 }, y: { label: 'solubility (mg/mL)', log: true }, legend: true, fmtY: v => conc(v) }, 220);
      const pJ = kit.plot(g2, { x: { label: 'time after swallowing (min)', min: 0, max: 240 }, y: { label: '% of dose', min: 0, max: 100 }, legend: true }, 220);
      const acid = () => V.kind === 'acid';
      const freeS = pH => P.solubility({ S0: V.S0, pKa: V.pKa, pH, acid: acid() });
      const saltS = pH => V.Ss * (1 + Math.pow(10, acid() ? V.pKa - pH : pH - V.pKa));
      const Stot = pH => Math.min(freeS(pH), saltS(pH));
      const pHmax = () => acid() ? V.pKa + Math.log10(V.Ss / V.S0) : V.pKa - Math.log10(V.Ss / V.S0);
      // the pH along the gut (min -> pH), a typical fasting or fed pattern
      const pHat = t => {
        const p = [[0, V.stomach], [30, V.stomach], [40, 6.0], [60, 6.5], [150, 6.8], [200, 7.4], [240, 7.4]];
        for (let i = 1; i < p.length; i++) if (t <= p[i][0]) return lerp(p[i - 1][1], p[i][1], (t - p[i - 1][0]) / (p[i][0] - p[i - 1][0]));
        return 7.4;
      };
      const region = t => t < 30 ? 'stomach' : t < 45 ? 'duodenum' : t < 150 ? 'jejunum' : 'ileum';
      let mode = 'journey', jt = 0, playing = true, path = [];
      // a dose in 250 mL: dissolution to the local solubility, slow precipitation of any excess, absorption beyond the stomach
      function simulate() {
        const Vm = 250, kd = 0.4, kp = 0.04, ka = 0.02, dt = 0.25;   // 1/min: dissolution, precipitation, absorption
        let ms = V.dose, md = 0, ma = 0;
        const out = [];
        for (let i = 0; i <= 960; i++) {
          const t = i * dt, pH = pHat(t);
          if (i % 4 === 0) out.push({ t, ms, md, ma, pH });
          const cap = Stot(pH) * Vm;
          if (md < cap && ms > 0) { const d = Math.min(ms, kd * (cap - md) * dt); ms -= d; md += d; }
          else if (md > cap) { const p = kp * (md - cap) * dt; md -= p; ms += p; }
          if (t >= 30) { const a = ka * md * dt; md -= a; ma += a; }
        }
        return out;
      }
      function recompute() {
        path = simulate();
        const pts = [], fr = [], sl = [];
        const top = Math.max(V.Ss * 4, V.dose / 250 * 4, V.S0 * 20), bot = Math.min(V.S0, V.dose / 250) / 4;
        for (let i = 0; i <= 180; i++) {
          const pH = 1 + i * 0.05, a = freeS(pH), b = saltS(pH);
          pts.push([pH, Math.min(a, b)]); fr.push([pH, Math.min(a, top * 3)]); sl.push([pH, Math.min(b, top * 3)]);
        }
        const pm = pHmax(), vl = [{ x: V.pKa, label: 'pKa' }];
        if (pm > 1 && pm < 10) vl.push({ x: pm, label: 'pHmax' });
        pS.set({
          series: [{ pts, label: 'solubility', width: 2.8 }, { pts: fr, label: acid() ? 'free acid' : 'free base', dash: [5, 4], width: 1.3 }, { pts: sl, label: 'salt', dash: [2, 3], width: 1.3 }],
          y: { label: 'solubility (mg/mL)', log: true, min: bot, max: top },
          hlines: [{ y: V.dose / 250, label: 'dose in 250 mL' }, { y: V.S0, label: 'S₀' }], vlines: vl
        });
        const every = path.filter((_, i) => i % 2 === 0);
        pJ.set({
          series: [{ pts: every.map(s => [s.t, 100 * s.md / V.dose]), label: 'dissolved' }, { pts: every.map(s => [s.t, 100 * s.ma / V.dose]), label: 'absorbed' },
            { pts: every.map(s => [s.t, 100 * s.ms / V.dose]), label: 'solid (undissolved or precipitated)', dash: [5, 4] }],
          vlines: [{ x: 30, label: 'leaves the stomach' }, { x: 150, label: 'ileum' }]
        });
        ro.set('pHmax', pm.toFixed(2) + (pm < 1 || pm > 10 ? ' (off the scale)' : ''));
        ro.set('abs', (100 * path[path.length - 1].ma / V.dose).toFixed(0) + ' % of the dose');
        loop.once();
      }
      const dots = scatter(90, 11), grains = scatter(40, 23);
      let lastMark = -1;
      const loop = kit.loop((dt) => {
        if (playing && mode === 'journey') { jt = Math.min(240, jt + dt * 20); if (jt >= 240) playing = false; }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const s = mode === 'journey' ? path[Math.min(path.length - 1, Math.round(jt))] : null;
        const pH = s ? s.pH : V.pH, S = Stot(pH);
        const ms = s ? s.ms : Math.max(0, V.dose - S * 250), md = s ? s.md : Math.min(V.dose, S * 250), ma = s ? s.ma : 0;
        const fi = P.ionised(V.pKa, pH, acid());
        // the beaker: 250 mL of the local fluid
        const bx = 18, by = 12, bw = Math.min(170, W * 0.24), bh = Hh * 0.62;
        c.fillStyle = phColor(pH, 0.22); c.fillRect(bx, by + bh * 0.1, bw, bh * 0.9);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.lineTo(bx + bw, by); c.stroke();
        const nd = Math.round(90 * clamp(md / V.dose, 0, 1)), ns = Math.round(40 * clamp(ms / V.dose, 0, 1));
        for (let i = 0; i < nd; i++) {
          const d = dots[i], x = bx + 6 + d.x * (bw - 12) + 2 * Math.sin(loop.t * 2 + d.w), y = by + bh * 0.14 + d.y * bh * 0.72 + 2 * Math.cos(loop.t * 1.7 + d.w);
          c.fillStyle = d.u < fi ? C.series[0] : C.series[1]; c.beginPath(); c.arc(x, y, 2.6, 0, 6.283); c.fill();
        }
        c.fillStyle = C.text;
        for (let i = 0; i < ns; i++) { const g = grains[i]; c.fillRect(bx + 6 + g.x * (bw - 16), by + bh - 7 - g.y * 12, 5, 5); }
        kit.label(c, '250 mL, pH ' + pH.toFixed(1), bx + bw / 2, by + bh + 12, { align: 'center', size: 12, color: C.muted });
        // the journey strip
        const sx0 = bx + bw + 30, sx1 = W - 16, sy = Hh * 0.8, segs = [[0, 30, 'stomach'], [30, 45, 'duod.'], [45, 150, 'jejunum'], [150, 240, 'ileum']];
        for (const [a, b, name] of segs) {
          const x0 = sx0 + (sx1 - sx0) * a / 240, x1 = sx0 + (sx1 - sx0) * b / 240;
          c.fillStyle = phColor(pHat((a + b) / 2), 0.45); c.fillRect(x0, sy - 9, x1 - x0 - 2, 18);
          kit.label(c, name, (x0 + x1) / 2, sy + 20, { align: 'center', size: 11, color: C.muted });
        }
        if (s) { const mx = sx0 + (sx1 - sx0) * jt / 240; kit.dot(c, mx, sy, 7, C.accent, C.surface); }
        // what is happening
        const tx = sx0, ty0 = 20;
        kit.label(c, s ? region(jt) + ', ' + jt.toFixed(0) + ' min after swallowing' : 'a beaker at pH ' + pH.toFixed(2), tx, ty0, { size: 14, weight: 700, color: C.text });
        kit.label(c, 'solubility ' + conc(S) + ' — the dose needs ' + conc(V.dose / 250), tx, ty0 + 22, { size: 12.5, color: C.text2 || C.text });
        kit.label(c, 'dissolved ' + (100 * md / V.dose).toFixed(0) + ' %   solid ' + (100 * ms / V.dose).toFixed(0) + ' %' + (s ? '   absorbed ' + (100 * ma / V.dose).toFixed(0) + ' %' : ''), tx, ty0 + 42, { size: 12.5, color: C.text });
        const sup = md / Math.max(1e-12, S * 250);
        kit.label(c, sup > 1.05 ? 'supersaturated ×' + sup.toFixed(1) + ' — precipitating' : ms > 0.01 * V.dose ? 'saturated: the rest stays solid' : 'all of it dissolved', tx, ty0 + 62, { size: 12.5, weight: 600, color: sup > 1.05 ? C.bad : ms > 0.01 * V.dose ? C.warn : C.ok });
        kit.label(c, '● ionised', tx, ty0 + 84, { size: 12, color: C.series[0] });
        kit.label(c, '● neutral', tx + 80, ty0 + 84, { size: 12, color: C.series[1] });
        kit.label(c, '■ solid', tx + 160, ty0 + 84, { size: 12, color: C.text });
        ro.set('S', conc(S)); ro.set('ion', (fi * 100).toFixed(fi > 0.999 || fi < 0.001 ? 3 : 1) + ' %');
        ro.set('solid', (acid() ? pH > pHmax() : pH < pHmax()) ? 'the salt' : acid() ? 'the free acid' : 'the free base');
        ro.set('d0', kit.fmt(V.dose / (250 * S), 3));
        // the time cursor on the journey plot, a few times a second
        const mark = s ? Math.round(jt / 3) : -2;
        if (mark !== lastMark) {
          lastMark = mark;
          pJ.set({ vlines: [{ x: 30, label: 'leaves the stomach' }, { x: 150, label: 'ileum' }].concat(s ? [{ x: jt, label: 'now', color: C.accent }] : []) });
          pS.set({ marks: [{ x: pH, y: S, label: 'pH ' + pH.toFixed(1) }] });
        }
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ sol-partition */
  Hyper.sim('sol-partition', {
    title: 'Octanol and water: log P, log D and ionisation',
    blurb: `A shake flask: octanol on top, buffered water below, and a drug that shares itself between them. The neutral molecules (orange) move freely between the layers in the ratio P; the ions (blue, with their charge) stay in the water. So the pH decides how much ends up in the octanol: that is log D. The graphs show log D and the ionised fraction across the pH scale.

**Try this**
- Take the weak acid (log P 4.0, pKa 4.4) from the stomach (pH 1.5) to blood (pH 7.4): log D falls by three units, and the octanol empties.
- Switch to the weak base: the pattern reverses — it hides in the water at low pH and crosses into the oil at high pH.
- Put the pH exactly at the pKa: half the drug in the water is ionised, and log D is log P − 0.3.
- Make the drug neutral: log D = log P at every pH.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Drug', options: [['Weak acid', 'acid'], ['Weak base', 'base'], ['Neutral (not ionisable)', 'neutral']], value: 'acid' },
        { id: 'logP', label: 'log P of the neutral form', min: -2, max: 6, step: 0.1, value: 4.0 },
        { id: 'pKa', label: 'pKa', min: 1, max: 12, step: 0.1, value: 4.4 },
        { id: 'pH', label: 'pH of the water', min: 1, max: 12, step: 0.1, value: 7.4 },
        { id: 'where', type: 'select', label: 'Jump to…', options: [['—', 0], ['stomach, pH 1.5', 1.5], ['acidic urine, pH 5.5', 5.5], ['jejunum, pH 6.5', 6.5], ['blood, pH 7.4', 7.4], ['alkaline urine, pH 8.0', 8.0]], value: 0 },
        { type: 'buttons', items: [{ id: 'shake', label: 'Shake the flask', primary: true }] }
      ], (id, v) => {
        if (id === 'kind' && V.kind !== 'neutral') ctl.set('pKa', V.kind === 'acid' ? 4.4 : 9.5);
        if (id === 'where' && v) ctl.set('pH', v);
        if (id === 'shake') for (const m of mols) { m.x = Math.random(); m.y = Math.random(); }
        assign(); draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fi', 'Ionised in the water'], ['logD', 'log D at this pH'], ['oct', 'Drug in the octanol'], ['D', 'Distribution ratio D']]);
      const pD = kit.plot(g1, { x: { label: 'pH', min: 1, max: 12 }, y: { label: 'log D' }, legend: true }, 190);
      const pI = kit.plot(g2, { x: { label: 'pH', min: 1, max: 12 }, y: { label: '% ionised', min: 0, max: 100 } }, 190);
      const fiAt = pH => V.kind === 'neutral' ? 0 : P.ionised(V.pKa, pH, V.kind === 'acid');
      const logDAt = pH => V.kind === 'neutral' ? V.logP : P.logD(V.logP, V.pKa, pH, V.kind === 'acid');
      const mols = scatter(150, 5).map(m => ({ u: m.u, px: m.x, py: m.y, x: m.x, y: m.y, w: m.w, oct: false, ion: false }));
      let F = 0, fi = 0;
      function assign() {
        fi = fiAt(V.pH);
        const D = Math.pow(10, logDAt(V.pH));
        F = D / (1 + D);                                   // equal volumes: fraction of all drug in the octanol
        for (const m of mols) {
          m.oct = m.u < F;
          m.ion = !m.oct && F < 1 - 1e-9 && (m.u - F) / (1 - F) < fi;
        }
      }
      function draw() {
        const lo = Math.max(-6, Math.min(-1, V.logP - 7)), hi = V.logP + 0.6;
        const pts = [], ions = [];
        for (let i = 0; i <= 110; i++) { const pH = 1 + i * 0.1; pts.push([pH, Math.max(lo, logDAt(pH))]); ions.push([pH, 100 * fiAt(pH)]); }
        pD.set({ series: [{ pts, label: 'log D' }], y: { label: 'log D', min: lo, max: hi }, hlines: [{ y: V.logP, label: 'log P' }],
          vlines: (V.kind === 'neutral' ? [] : [{ x: V.pKa, label: 'pKa' }]).concat([{ x: V.pH, label: 'pH ' + V.pH.toFixed(1), color: kit.colors().accent }]),
          marks: [{ x: V.pH, y: Math.max(lo, logDAt(V.pH)) }] });
        pI.set({ series: [{ pts: ions, label: '% ionised', fill: true }], hlines: [{ y: 50, label: '50 %' }], vlines: [{ x: V.pH, color: kit.colors().accent }], marks: [{ x: V.pH, y: 100 * fi }] });
        const lD = logDAt(V.pH);
        ro.set('fi', (fi * 100).toFixed(fi > 0.999 || fi < 0.001 ? 3 : 1) + ' %');
        ro.set('logD', lD.toFixed(2) + (Math.abs(lD - V.logP) < 0.005 ? ' (= log P)' : ''));
        ro.set('oct', (F * 100).toFixed(F > 0.999 || F < 0.001 ? 3 : 1) + ' % (equal volumes)');
        ro.set('D', kit.fmt(Math.pow(10, lD), 3));
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const vx = W * 0.06, vw = Math.min(260, W * 0.38), vy = 14, vh = Hh - 34, mid = vy + vh / 2;
        c.fillStyle = 'hsl(45 90% 58% / .18)'; c.fillRect(vx, vy, vw, vh / 2);
        c.fillStyle = 'hsl(205 85% 58% / .18)'; c.fillRect(vx, mid, vw, vh / 2);
        c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.lineWidth = 1; c.beginPath(); c.moveTo(vx, mid); c.lineTo(vx + vw, mid); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(vx, vy, vw, vh);
        kit.label(c, 'octanol', vx + 6, vy + 10, { size: 12, weight: 700, color: C.muted });
        kit.label(c, 'water, pH ' + V.pH.toFixed(1), vx + 6, mid + 10, { size: 12, weight: 700, color: C.muted });
        // molecules settle into their layer in fixed small steps
        const h = Math.min(dt, 0.05), n = Math.max(1, Math.ceil(h / 0.01)), k = 1.8;
        c.font = '700 9px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
        let nOct = 0, nIon = 0;
        for (const m of mols) {
          const ty = m.oct ? 0.05 + 0.4 * m.py : 0.55 + 0.4 * m.py, tx = 0.04 + 0.92 * m.px;
          for (let i = 0; i < n; i++) { m.x += (tx - m.x) * k * h / n; m.y += (ty - m.y) * k * h / n; }
          const x = vx + m.x * vw + 1.5 * Math.sin(loop.t * 3 + m.w), y = vy + m.y * vh + 1.5 * Math.cos(loop.t * 2.6 + m.w);
          if (m.oct) nOct++;
          if (m.ion) {
            nIon++;
            c.fillStyle = C.series[0]; c.beginPath(); c.arc(x, y, 4.5, 0, 6.283); c.fill();
            c.fillStyle = C.surface || '#fff'; c.fillText(V.kind === 'acid' ? '−' : '+', x, y + 0.5);
          } else { c.fillStyle = C.series[1]; c.beginPath(); c.arc(x, y, 3.8, 0, 6.283); c.fill(); }
        }
        const tx0 = vx + vw + 24;
        kit.label(c, V.kind === 'neutral' ? 'a neutral drug' : 'a weak ' + V.kind + ', pKa ' + V.pKa.toFixed(1), tx0, 24, { size: 14, weight: 700, color: C.text });
        kit.label(c, 'in the octanol: ' + nOct + ' of ' + mols.length + ' molecules — all neutral', tx0, 50, { size: 12.5, color: C.text });
        kit.label(c, 'in the water: ' + (mols.length - nOct - nIon) + ' neutral, ' + nIon + ' ionised', tx0, 70, { size: 12.5, color: C.text });
        kit.label(c, 'log P = ' + V.logP.toFixed(1) + '    log D = ' + logDAt(V.pH).toFixed(2), tx0, 96, { size: 13, weight: 700, color: C.accent });
        kit.label(c, 'only the neutral form partitions: D = P × (fraction un-ionised)', tx0, 118, { size: 12, color: C.muted });
        kit.label(c, '● neutral', tx0, 144, { size: 12, color: C.series[1] });
        kit.label(c, '● ion', tx0 + 76, 144, { size: 12, color: C.series[0] });
      }, box.stage);
      assign(); draw();
      loop.start();
    }
  });

  /* ================================================================ sol-buffer */
  const BUFFERS = {
    acetate: { pKa: [4.76], sp: ['CH₃COOH', 'CH₃COO⁻'] },
    citrate: { pKa: [3.13, 4.76, 6.40], sp: ['H₃Cit', 'H₂Cit⁻', 'HCit²⁻', 'Cit³⁻'] },
    histidine: { pKa: [1.8, 6.0, 9.2], sp: ['His²⁺', 'His⁺', 'His', 'His⁻'] },
    phosphate: { pKa: [2.15, 7.20, 12.35], sp: ['H₃PO₄', 'H₂PO₄⁻', 'HPO₄²⁻', 'PO₄³⁻'] },
    tris: { pKa: [8.07], sp: ['Tris-H⁺', 'Tris'] },
    borate: { pKa: [9.24], sp: ['B(OH)₃', 'B(OH)₄⁻'] }
  };
  Hyper.sim('sol-buffer', {
    title: 'Buffer capacity: adding acid and alkali',
    blurb: `A litre of buffer, made up to the pH you choose, with strong acid or alkali added a little at a time. The pH comes from the full charge balance of the buffer species and of water, so it stays right far from the pKa too. The left graph is the titration curve (pH against acid or base added, compared with plain water starting at the same pH); the right one the buffer capacity β at each pH — the exact curve and, dashed, the Van Slyke formula for the buffer alone.

**Try this**
- Make up 50 mM phosphate at pH 7.2, then at 9.0. How many additions does it take to move the pH by one unit in each case?
- Compare phosphate with water: the same acid that barely moves the buffer sends water from 7.4 to 2.7.
- Dilute tenfold: the pH hardly changes, but the capacity falls tenfold.
- Choose citrate: three overlapping pKa values give a broad plateau of capacity from pH 2.5 to 7.
- Look at the capacity of acetate or Tris below pH 3 and above pH 11: it rises again, but the gap between the two curves shows that it is water's own H⁺ and OH⁻ doing the buffering, not the buffer.`,
    mount(box, kit) {
      const P = kit.pharma, Kw = 1e-14;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'buf', type: 'select', label: 'Buffer', options: [['Acetate (pKa 4.76)', 'acetate'], ['Citrate (3.13, 4.76, 6.40)', 'citrate'], ['Histidine (6.0)', 'histidine'], ['Phosphate (7.20)', 'phosphate'], ['Tromethamine, Tris (8.07)', 'tris'], ['Borate (9.24)', 'borate']], value: 'phosphate' },
        { id: 'C', label: 'Buffer concentration', min: 1, max: 200, value: 50, unit: 'mM', log: true, sig: 2 },
        { id: 'pH0', label: 'Made up to pH', min: 2, max: 12, step: 0.05, value: 7.4 },
        { id: 'step', type: 'select', label: 'Each addition', options: [['0.5 mmol per litre', 0.5], ['2 mmol per litre', 2], ['10 mmol per litre', 10]], value: 2 },
        { type: 'buttons', items: [{ id: 'acid', label: 'Add strong acid' }, { id: 'base', label: 'Add strong base' }] },
        { type: 'buttons', items: [{ id: 'dilute', label: 'Dilute tenfold' }, { id: 'reset', label: 'Make up again', primary: true }] }
      ], (id) => {
        if (id === 'acid' || id === 'base') { const s = (id === 'acid' ? -1 : 1) * V.step; b += s / 1000; added += s; drops.push({ y: 0, x: 0.3 + 0.4 * Math.random(), kind: id }); }
        else if (id === 'dilute') { Cm /= 10; b /= 10; b0 /= 10; added /= 10; }
        else makeUp();
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pH', 'pH now'], ['beta', 'Buffer capacity β'], ['added', 'Acid (−) or base (+) added'], ['pair', 'Main species'], ['C', 'Buffer concentration now']]);
      const pT = kit.plot(g1, { x: { label: 'strong base added (mmol/L; negative = acid)' }, y: { label: 'pH', min: 1, max: 13 }, legend: true }, 200);
      const pB = kit.plot(g2, { x: { label: 'pH', min: 1, max: 13 }, y: { label: 'β (mmol/L per pH unit)', min: 0 }, legend: true }, 200);
      const buf = () => BUFFERS[V.buf] || BUFFERS.phosphate;
      // mean number of protons removed from the fully protonated form, and the species fractions
      function weights(pKas, H) { const w = [1]; for (let j = 0; j < pKas.length; j++) w.push(w[j] * Math.pow(10, -pKas[j]) / H); const s = w.reduce((a, x) => a + x, 0); return w.map(x => x / s); }
      const nbar = (pKas, H) => weights(pKas, H).reduce((s, f, j) => s + j * f, 0);
      // charge balance: net strong base (mol/L) that brings the fully protonated buffer to this pH
      const bOf = (pH, C, pKas) => { const H = Math.pow(10, -pH); return Kw / H - H + C * nbar(pKas, H); };
      function pHof(bb, C, pKas) { let lo = -1, hi = 15; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (bOf(m, C, pKas) < bb) lo = m; else hi = m; } return (lo + hi) / 2; }
      const betaAt = (pH, C, pKas) => (bOf(pH + 0.002, C, pKas) - bOf(pH - 0.002, C, pKas)) / 0.004;
      let Cm = 0.05, b = 0, b0 = 0, added = 0, pHnow = 7.4;
      const drops = [];
      function makeUp() { Cm = V.C / 1000; b0 = bOf(V.pH0, Cm, buf().pKa); b = b0; added = 0; }
      function draw() {
        const pKas = buf().pKa;
        pHnow = pHof(b, Cm, pKas);
        const tit = [], wat = [], bet = [], vs = [];
        const w0 = bOf(V.pH0, 0, []);
        for (let i = 0; i <= 230; i++) {
          const pH = 1.5 + i * 0.05;
          tit.push([(bOf(pH, Cm, pKas) - b0) * 1000, pH]);
          wat.push([(bOf(pH, 0, []) - w0) * 1000, pH]);
        }
        for (let i = 0; i <= 240; i++) {
          const pH = 1 + i * 0.05;
          bet.push([pH, betaAt(pH, Cm, pKas) * 1000]);
          vs.push([pH, pKas.reduce((s, pk) => s + P.bufferCapacity(Cm, pk, pH), 0) * 1000]);
        }
        const span = Math.max(3 * Cm * 1000, 3 * Math.abs(added), 2);
        pT.set({ series: [{ pts: tit, label: 'buffer' }, { pts: wat.filter(p => Math.abs(p[0]) <= span * 1.05), label: 'water, same start', dash: [5, 4] }],
          x: { label: 'strong base added (mmol/L; negative = acid)', min: -span, max: span }, marks: [{ x: added, y: pHnow }], hlines: [{ y: V.pH0, label: 'made up' }] });
        const bmax = Math.max(1e-6, ...bet.filter(p => p[0] > 2.5 && p[0] < 11.5).map(p => p[1])) * 1.25;
        pB.set({ series: [{ pts: bet, label: 'exact (with water)' }, { pts: vs, label: 'Van Slyke, buffer only', dash: [5, 4] }], y: { label: 'β (mmol/L per pH unit)', min: 0, max: bmax },
          vlines: pKas.filter(pk => pk > 1 && pk < 13).map(pk => ({ x: pk, label: 'pKa ' + pk })).concat([{ x: pHnow, color: kit.colors().accent }]), marks: [{ x: pHnow, y: betaAt(pHnow, Cm, pKas) * 1000 }] });
        const fr = weights(pKas, Math.pow(10, -pHnow)), sp = buf().sp, idx = fr.map((f, j) => [f, j]).sort((a, c) => c[0] - a[0]);
        const [f1, j1] = idx[0], [f2, j2] = idx[1] || [0, 0];
        ro.set('pH', pHnow.toFixed(2));
        ro.set('beta', kit.fmt(betaAt(pHnow, Cm, pKas) * 1000, 3) + ' mmol/L per pH');
        ro.set('added', (added >= 0 ? '+' : '') + kit.fmt(added, 3) + ' mmol/L');
        ro.set('pair', sp[j1] + ' ' + (100 * f1).toFixed(0) + ' %, ' + sp[j2] + ' ' + (100 * f2).toFixed(0) + ' %');
        ro.set('C', kit.fmt(Cm * 1000, 3) + ' mM');
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // falling drops, in fixed steps
        const h = Math.min(dt, 0.05);
        for (let i = drops.length - 1; i >= 0; i--) { drops[i].y += h * 1.6; if (drops[i].y > 1) drops.splice(i, 1); }
        const bx = 24, by = 26, bw = Math.min(170, W * 0.24), bh = Hh - 44, ly = by + bh * 0.25;
        c.fillStyle = phColor(pHnow, 0.35); c.fillRect(bx, ly, bw, by + bh - ly);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.lineTo(bx + bw, by); c.stroke();
        for (const d of drops) { c.fillStyle = d.kind === 'acid' ? C.bad : C.series[0]; c.beginPath(); c.arc(bx + d.x * bw, 4 + d.y * (ly - 4), 4, 0, 6.283); c.fill(); }
        // the pH meter
        const mx = bx + bw + 24, mw = Math.min(150, W * 0.2);
        c.fillStyle = C.surface || C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.fillRect(mx, by, mw, 58); c.strokeRect(mx, by, mw, 58);
        kit.label(c, 'pH ' + pHnow.toFixed(2), mx + mw / 2, by + 24, { align: 'center', size: 22, weight: 700, color: C.text });
        kit.label(c, 'β ' + kit.fmt(betaAt(pHnow, Cm, buf().pKa) * 1000, 2) + ' mM/pH', mx + mw / 2, by + 46, { align: 'center', size: 12, color: C.muted });
        // the species as a stacked bar
        const fr = weights(buf().pKa, Math.pow(10, -pHnow)), sx = mx, sw = W - sx - 16, sy = by + 80;
        let x = sx;
        kit.label(c, 'buffer species', sx, sy - 10, { size: 12, color: C.muted });
        fr.forEach((f, j) => {
          const w = f * sw;
          c.fillStyle = C.series[j % C.series.length]; c.fillRect(x, sy, Math.max(0, w), 20);
          if (f > 0.12) kit.label(c, buf().sp[j] + ' ' + (100 * f).toFixed(0) + ' %', x + w / 2, sy + 34, { align: 'center', size: 11.5, color: C.text });
          x += w;
        });
        kit.label(c, 'added so far: ' + (added >= 0 ? '+' : '') + kit.fmt(added, 3) + ' mmol/L of ' + (added >= 0 ? 'strong base' : 'strong acid'), sx, sy + 58, { size: 12.5, color: C.text });
      }, box.stage);
      makeUp(); draw();
      loop.start();
    }
  });

  /* ================================================================ sol-solubilisers */
  Hyper.sim('sol-solubilisers', {
    title: 'Solubilising a drug: cosolvent or cyclodextrin',
    blurb: `A poorly soluble drug (molar mass 400 g/mol, hypothetical) is dissolved for an injection either in a water–cosolvent mixture or with a cyclodextrin, then "injected": diluted a hundredfold, as by blood or an infusion. With a cosolvent the solubility falls exponentially as the cosolvent is diluted (log-linear model), faster than the drug concentration falls — the solution becomes supersaturated at intermediate dilutions and the drug may precipitate. With a 1 : 1 cyclodextrin complex the solubility falls in proportion to the dilution, so the solution stays below saturation all the way.

**Try this**
- Cosolvent mode: press Inject and watch the supersaturation curve rise above 1 near a twofold to threefold dilution. Lower the drug loading until it never crosses 1.
- Raise σ (a more lipophilic drug or a less polar cosolvent): more drug fits in the vial, but the precipitation risk on dilution grows too.
- Cyclodextrin mode: even a vial loaded at 100 % of saturation stays unsaturated on dilution. Raise K: the solubility gain grows, but so does the cyclodextrin needed.`,
    mount(box, kit, params) {
      const MW = 400;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Solubiliser', options: [['Cosolvent (log-linear)', 'cos'], ['Cyclodextrin (1 : 1 complex)', 'cd']], value: (params && params.mode) === 'cd' ? 'cd' : 'cos' },
        { id: 'Sw', label: 'Solubility in water, S₀', min: 0.001, max: 1, value: 0.01, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'sigma', label: 'Solubilising power σ', min: 0.5, max: 6, step: 0.1, value: 3 },
        { id: 'f0', label: 'Cosolvent in the formulation', min: 5, max: 80, step: 1, value: 40, unit: '%' },
        { id: 'K', label: 'Binding constant K', min: 50, max: 20000, value: 2500, unit: 'L/mol', log: true, sig: 2 },
        { id: 'L0', label: 'Cyclodextrin in the formulation', min: 5, max: 300, value: 50, unit: 'mM', log: true, sig: 2 },
        { id: 'fill', label: 'Drug loading (% of saturation)', min: 10, max: 100, step: 1, value: 75, unit: '%' },
        { type: 'buttons', items: [{ id: 'inject', label: 'Inject: dilute ×1 → ×100', primary: true }] }
      ], (id) => { if (id === 'inject') { dl = 0; running = true; crystals = 0; } showMode(); recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Sf', 'Solubility in the formulation'], ['C0', 'Drug in the formulation'], ['gain', 'Gain over water'], ['worst', 'Worst supersaturation on dilution'], ['now', 'At the current dilution']]);
      const pS = kit.plot(g1, { x: { label: '' }, y: { label: '' }, legend: true }, 200);
      const pR = kit.plot(g2, { x: { label: 'dilution factor', min: 1, max: 1000, log: true }, y: { label: 'drug concentration ÷ solubility', min: 0 }, legend: true }, 200);
      const cos = () => V.mode !== 'cd';
      function showMode() { for (const k of ['sigma', 'f0']) ctl.show(k, cos()); for (const k of ['K', 'L0']) ctl.show(k, !cos()); }
      // solubility (mg/mL) after diluting the formulation d-fold with water
      const S0m = () => V.Sw / MW, slope = () => V.K * S0m() / (1 + V.K * S0m());
      const Sd = d => cos() ? V.Sw * Math.pow(10, V.sigma * (V.f0 / 100) / d) : (S0m() + slope() * V.L0 / 1000 / d) * MW;
      const C0 = () => V.fill / 100 * Sd(1);
      const ratio = d => C0() / d / Sd(d);
      let dl = 0, running = false, crystals = 0, worst = { r: 0, d: 1 };
      function recompute() {
        worst = { r: 0, d: 1 };
        const rr = [];
        for (let i = 0; i <= 150; i++) { const d = Math.pow(10, i * 0.02), r = ratio(d); rr.push([d, r]); if (r > worst.r) worst = { r, d }; }
        const C = kit.colors();
        if (cos()) {
          const sol = [], path = [];
          for (let i = 0; i <= 100; i++) sol.push([i, V.Sw * Math.pow(10, V.sigma * i / 100)]);
          for (let i = 0; i <= 150; i++) { const d = Math.pow(10, i * 0.02); path.push([V.f0 / d, C0() / d]); }
          pS.set({ series: [{ pts: sol, label: 'solubility' }, { pts: path, label: 'dilution path', dash: [5, 4] }], x: { label: 'cosolvent (% v/v)', min: 0, max: 100 },
            y: { label: 'drug (mg/mL)', log: true, min: V.Sw / 20, max: Math.max(V.Sw * Math.pow(10, V.sigma) * 1.3, C0() * 2) }, hlines: [] });
        } else {
          const sol = [], path = [], Lmax = V.L0 * 1.1;
          for (let i = 0; i <= 50; i++) { const L = Lmax * i / 50; sol.push([L, (S0m() + slope() * L / 1000) * MW]); }
          for (let i = 0; i <= 50; i++) { const f = i / 50; path.push([V.L0 * f, C0() * f]); }
          pS.set({ series: [{ pts: sol, label: 'solubility (A_L line)' }, { pts: path, label: 'dilution path', dash: [5, 4] }], x: { label: 'cyclodextrin (mM)', min: 0, max: Lmax },
            y: { label: 'drug (mg/mL)', log: false, min: 0, max: Sd(1) * 1.15 }, hlines: [{ y: V.Sw, label: 'S₀' }] });
        }
        pR.set({ series: [{ pts: rr, label: 'C ÷ S', fill: true }], hlines: [{ y: 1, label: 'saturated', color: C.bad }], y: { label: 'drug concentration ÷ solubility', min: 0, max: Math.max(1.3, worst.r * 1.15) } });
        ro.set('Sf', conc(Sd(1)));
        ro.set('C0', conc(C0()));
        ro.set('gain', '×' + kit.fmt(Sd(1) / V.Sw, 3));
        ro.set('worst', worst.r > 1 ? '×' + worst.r.toFixed(2) + ' at a ' + worst.d.toFixed(1) + '-fold dilution — may precipitate' : 'never saturated (max ' + (100 * worst.r).toFixed(0) + ' % of saturation)');
        mark();
      }
      function mark() {
        const d = Math.pow(10, dl), C = kit.colors();
        pR.set({ vlines: [{ x: d, label: '×' + d.toFixed(d < 10 ? 1 : 0), color: C.accent }], marks: [{ x: d, y: ratio(d) }] });
        pS.set({ marks: [{ x: cos() ? V.f0 / d : V.L0 / d, y: C0() / d }] });
        const r = ratio(d);
        ro.set('now', '×' + d.toFixed(d < 10 ? 1 : 0) + ': ' + conc(C0() / d) + ' vs solubility ' + conc(Sd(d)) + (r > 1 ? ' (supersaturated)' : ''));
        loop.once();
      }
      const specks = scatter(60, 3);
      let lastD = -1;
      const loop = kit.loop((dt) => {
        const h = Math.min(dt, 0.05);
        if (running) { dl = Math.min(2, dl + h / 3); if (dl >= 2) running = false; }
        const d = Math.pow(10, dl), r = ratio(d);
        // crystals grow while the solution is supersaturated and redissolve slowly when it is not
        crystals = clamp(crystals + (r > 1 ? (r - 1) * 40 : -3) * h, 0, 60);
        if (Math.abs(d - lastD) > 0.02 * d) { lastD = d; mark(); }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const vx = 26, vw = Math.min(90, W * 0.12), vy = 22, vh = Hh - 48;
        c.fillStyle = cos() ? 'hsl(280 60% 60% / .25)' : 'hsl(170 60% 50% / .25)'; c.fillRect(vx, vy + vh * 0.2, vw, vh * 0.8);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(vx, vy, vw, vh);
        kit.label(c, 'vial', vx + vw / 2, vy + vh + 14, { align: 'center', size: 12, color: C.muted });
        const ax = vx + vw + 16, bx = Math.max(ax + 110, W * 0.36), bw = Math.min(200, W * 0.28);
        kit.arrow(c, ax, vy + vh / 2, bx - 10, vy + vh / 2, C.accent, 2.5);
        kit.label(c, 'diluted ×' + d.toFixed(d < 10 ? 1 : 0), (ax + bx) / 2, vy + vh / 2 - 14, { align: 'center', size: 12.5, weight: 700, color: C.text });
        c.fillStyle = 'hsl(0 70% 60% / .12)'; c.fillRect(bx, vy + vh * 0.1, bw, vh * 0.9);
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(bx, vy); c.lineTo(bx, vy + vh); c.lineTo(bx + bw, vy + vh); c.lineTo(bx + bw, vy); c.stroke();
        c.fillStyle = C.text;
        for (let i = 0; i < Math.round(crystals); i++) { const s = specks[i]; const x = bx + 8 + s.x * (bw - 16), y = vy + vh * 0.2 + s.y * vh * 0.72; c.save(); c.translate(x, y); c.rotate(s.w); c.fillRect(-4, -1.2, 8, 2.4); c.restore(); }
        const tx = bx + bw + 20;
        kit.label(c, cos() ? (V.f0 / d).toFixed(1) + ' % cosolvent' : kit.fmt(V.L0 / d, 3) + ' mM cyclodextrin', tx, 30, { size: 13, weight: 700, color: C.text });
        kit.label(c, 'drug ' + conc(C0() / d), tx, 52, { size: 12.5, color: C.text });
        kit.label(c, 'solubility ' + conc(Sd(d)), tx, 72, { size: 12.5, color: C.text });
        kit.label(c, r > 1 ? 'supersaturated ×' + r.toFixed(2) + ' — crystals may form' : (100 * r).toFixed(0) + ' % of saturation — stays dissolved', tx, 96, { size: 12.5, weight: 700, color: r > 1 ? C.bad : C.ok });
      }, box.stage);
      showMode(); recompute();
      loop.start();
    }
  });

  /* ================================================================ sol-polymorph */
  Hyper.sim('sol-polymorph', {
    title: 'Spring and parachute: three solid forms dissolving',
    blurb: `The same dose of one hypothetical drug — 100 mg in 250 mL, twenty times more than the stable crystal can dissolve — added as three solid forms: the stable crystal, a metastable polymorph and an amorphous solid. Each dissolves towards its own solubility. Whenever the solution is supersaturated with respect to the stable crystal, crystals of the stable form can nucleate and grow, pulling the concentration back down — and the rest of a metastable solid then dissolves only to crystallise again. A precipitation-inhibiting polymer slows nucleation and growth: the "parachute" that holds up the amorphous form's "spring".

**Try this**
- Watch the amorphous form overshoot and then crash as crystals appear. Tick the polymer: how much longer does the supersaturation last, and how much larger is the area under the curve?
- Raise the amorphous advantage to 25: the spring rises towards the whole dose (400 µg/mL) — and crashes sooner, because a higher supersaturation nucleates crystals faster.
- Make crystallisation fast: the amorphous advantage nearly vanishes, and even the metastable polymorph starts to convert within three hours.
- Make it slow: the amorphous form keeps its advantage for the whole three hours, with or without polymer.`,
    mount(box, kit) {
      const Cs = 0.02, dose = 100, Vm = 250, T = 180, dt = 0.05, kd = 0.15;   // mg/mL, mg, mL, min, min, 1/min
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 190 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'adv', label: 'Amorphous solubility ÷ crystal', min: 2, max: 30, step: 0.5, value: 10 },
        { id: 'meta', label: 'Metastable polymorph ÷ crystal', min: 1.1, max: 3, step: 0.05, value: 1.6 },
        { id: 'kc', type: 'select', label: 'Crystallisation tendency', options: [['Slow', 0.2], ['Medium', 1], ['Fast', 5]], value: 1 },
        { id: 'poly', type: 'check', label: 'Precipitation inhibitor (polymer)', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Add the powders again', primary: true }] }
      ], (id) => { if (id === 'again') tc = 0; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['time', 'Time'], ['peak', 'Amorphous: peak'], ['auc', 'Area under the curve, 0–3 h (× crystal)'], ['xtal', 'Stable crystals appear (amorphous)']]);
      const plot = kit.plot(gb, { x: { label: 'time (min)', min: 0, max: T }, y: { label: 'dissolved drug (µg/mL)', min: 0 }, legend: true }, 210);
      // one form: its undissolved solid ms (mg), stable crystals mx (mg), concentration C (mg/mL), nucleation clock z
      function run(Sform, stableSolid) {
        const kn = 0.1 * V.kc * (V.poly ? 0.05 : 1), kg = 0.05 * V.kc * (V.poly ? 0.1 : 1);
        let ms = dose, mx = 0, C = 0, z = 0, tx = null;
        const out = [];
        for (let i = 0; i <= T / dt; i++) {
          const t = i * dt;
          if (i % 20 === 0) out.push({ t, C, ms, mx });
          if (ms > 0 && C < Sform) { const d = Math.min(ms, kd * Math.pow(ms / dose, 2 / 3) * (Sform - C) * Vm * dt); ms -= d; C += d / Vm; }
          if (stableSolid) continue;
          const sig = C / Cs - 1;
          if (mx <= 0 && sig > 0) { z += kn * sig * sig * dt / 10; if (z >= 1) { mx = 0.002 * dose; tx = t; } }
          if (mx > 0) {
            const g = kg * Math.pow(mx / dose + 0.01, 2 / 3) * (C - Cs) * Vm * dt;       // + grows from solution, − dissolves
            const gg = g > 0 ? Math.min(g, (C - Cs) * Vm) : Math.max(g, -mx);
            mx += gg; C -= gg / Vm;
          }
        }
        return { out, tx };
      }
      const auc = r => r.out.reduce((s, p, i) => i ? s + (p.C + r.out[i - 1].C) / 2 * (p.t - r.out[i - 1].t) : 0, 0);
      let runs = [], tc = 0, hold = 0;
      const names = ['Stable crystal', 'Metastable polymorph', 'Amorphous'];
      function recompute() {
        runs = [run(Cs, true), run(Cs * V.meta, false), run(Cs * V.adv, false)];
        const a0 = Math.max(1e-9, auc(runs[0]));
        plot.set({ series: runs.map((r, i) => ({ pts: r.out.map(p => [p.t, p.C * 1000]), label: names[i] + (i === 2 && V.poly ? ' + polymer' : ''), width: i === 2 ? 2.8 : 2 })),
          y: { label: 'dissolved drug (µg/mL)', min: 0, max: Math.min(dose / Vm, Cs * V.adv) * 1000 * 1.12 },
          hlines: [{ y: Cs * 1000, label: 'crystal solubility' }, { y: Math.min(dose / Vm, Cs * V.adv) * 1000, label: Cs * V.adv > dose / Vm ? 'whole dose dissolved' : 'amorphous solubility' }] });
        const pk = runs[2].out.reduce((m, p) => Math.max(m, p.C), 0);
        ro.set('peak', (pk * 1000).toFixed(0) + ' µg/mL (×' + (pk / Cs).toFixed(1) + ')');
        ro.set('auc', 'metastable ×' + (auc(runs[1]) / a0).toFixed(2) + ', amorphous ×' + (auc(runs[2]) / a0).toFixed(1));
        ro.set('xtal', runs[2].tx == null ? 'not within 3 h' : 'after ' + runs[2].tx.toFixed(0) + ' min');
        loop.once();
      }
      const bits = scatter(30, 17), needles = scatter(30, 29);
      let lastMark = -1;
      const loop = kit.loop((dtf) => {
        if (tc >= T) { hold += dtf; if (hold > 2) { tc = 0; hold = 0; } } else tc = Math.min(T, tc + dtf * 15);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const idx = Math.min(T, Math.round(tc)), cmax = Math.min(dose / Vm, Cs * V.adv);
        const bw = Math.min(150, (W - 60) / 3 - 20), gap = (W - 3 * bw) / 4, by = 30, bh = Hh - 76;
        const cols = [C.muted, C.series[1], C.series[4] || C.warn];
        runs.forEach((r, k) => {
          const s = r.out[Math.min(r.out.length - 1, idx)], bx = gap + k * (bw + gap);
          c.fillStyle = 'hsl(280 60% ' + (C.dark ? 45 : 60) + '% / ' + (0.05 + 0.5 * clamp(s.C / cmax, 0, 1)).toFixed(3) + ')';
          c.fillRect(bx, by + bh * 0.12, bw, bh * 0.88);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.lineTo(bx + bw, by); c.stroke();
          // the added form: square crystals, or round amorphous grains
          c.fillStyle = cols[k];
          for (let i = 0; i < Math.round(30 * s.ms / dose); i++) {
            const g = bits[i], x = bx + 8 + g.x * (bw - 16), y = by + bh - 8 - g.y * bh * 0.25;
            if (k === 2) { c.beginPath(); c.arc(x, y, 3.5, 0, 6.283); c.fill(); } else c.fillRect(x - 3, y - 3, 6, 6);
          }
          // new crystals of the stable form: needles
          c.strokeStyle = C.text; c.lineWidth = 1.6;
          for (let i = 0; i < Math.round(30 * s.mx / dose); i++) {
            const g = needles[i], x = bx + 8 + g.x * (bw - 16), y = by + bh * 0.35 + g.y * bh * 0.55;
            c.beginPath(); c.moveTo(x - 4 * Math.cos(g.w), y - 4 * Math.sin(g.w)); c.lineTo(x + 4 * Math.cos(g.w), y + 4 * Math.sin(g.w)); c.stroke();
          }
          kit.label(c, names[k], bx + bw / 2, 14, { align: 'center', size: 12.5, weight: 700, color: C.text });
          kit.label(c, (s.C * 1000).toFixed(0) + ' µg/mL  (×' + (s.C / Cs).toFixed(1) + ')', bx + bw / 2, by + bh + 16, { align: 'center', size: 12, color: s.C > Cs * 1.05 ? C.warn : C.text });
          kit.label(c, s.mx > 0.01 ? 'stable crystals growing' : ' ', bx + bw / 2, by + bh + 32, { align: 'center', size: 11, color: C.muted });
        });
        ro.set('time', tc.toFixed(0) + ' min');
        const mark = Math.round(tc / 3);
        if (mark !== lastMark) { lastMark = mark; plot.set({ vlines: [{ x: tc, color: C.accent }] }); }
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ sol-order */
  Hyper.sim('sol-order', {
    title: 'Which order? Fitting a stability study',
    blurb: `A drug is assayed at 0, 1, 2, 3, 4, 6, 8, 10 and 12 months with the scatter of a real HPLC assay. You choose how it truly degrades and how much it loses in the year; the data are then fitted three ways — zero order ($C$ against $t$), first order ($\\ln C$ against $t$) and second order ($1/C$ against $t$) — and each fit is extrapolated to three years to predict the shelf life.

**Try this**
- With 10 % loss in a year and 0.6 % assay noise, run several studies: the three fits are almost equally straight, and the order cannot be told.
- Raise the loss to 50 % or more: now only the right transformation is straight.
- Compare the predicted t90 values: they agree while little has degraded; it is the extrapolation to 36 months where the models part.
- Set the noise to zero with 10 % loss: now the right model wins, though the three R² values differ only in the fourth decimal. The difficulty is the assay's scatter (0.5–1 % in real life), not the mathematics.`,
    mount(box, kit) {
      const P = kit.pharma, B = kit.bio, TT = [0, 1, 2, 3, 4, 6, 8, 10, 12];
      const st = kit.stage(box.stage, { aspect: 0.14, minH: 96 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 0'; box.stage.appendChild(gb);
      const g3 = document.createElement('div'); g3.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px'; box.stage.appendChild(g3);
      const gz = document.createElement('div'), g1 = document.createElement('div'), g2 = document.createElement('div'); g3.appendChild(gz); g3.appendChild(g1); g3.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'order', type: 'select', label: 'The drug truly degrades by', options: [['Zero order (a suspension)', 0], ['First order (a solution)', 1], ['Second order (dimerisation)', 2]], value: 1 },
        { id: 'loss', label: 'Loss after 12 months', min: 2, max: 80, step: 1, value: 15, unit: '%' },
        { id: 'noise', label: 'Assay noise (SD)', min: 0, max: 2, step: 0.1, value: 0.6, unit: '%' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run a new study', primary: true }] }
      ], (id) => { if (id === 'run') seed++; compute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r2', 'R² zero / first / second'], ['best', 'Straightest plot'], ['t90', 'Predicted t90: zero / first / second'], ['true', 'True t90']]);
      const pM = kit.plot(gb, { x: { label: 'time (months)', min: 0, max: 36 }, y: { label: 'content (% of label)' }, legend: true }, 210);
      const small = (el, lab) => kit.plot(el, { x: { label: 'months', min: 0, max: 12 }, y: { label: lab, noZero: true } }, 140);
      const pZ = small(gz, 'C (%)'), p1 = small(g1, 'ln C'), p2 = small(g2, '1000 / C');
      let seed = 1, data = [];
      const kTrue = () => { const L = V.loss / 100; return V.order === 0 ? V.loss / 12 : V.order === 2 ? (1 / (100 - V.loss) - 1 / 100) / 12 : -Math.log(1 - L) / 12; };
      function compute() {
        const k = kTrue(), rng = B.rng(seed * 7919 + 13);
        const gauss = () => { const u = Math.max(1e-9, rng()), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
        data = TT.map(t => [t, Math.max(1, P.degrade({ order: V.order, k, C0: 100, t }) + V.noise * gauss())]);
        const ts = data.map(d => d[0]), cs = data.map(d => d[1]);
        const fz = lsq(ts, cs), f1 = lsq(ts, cs.map(Math.log)), f2 = lsq(ts, cs.map(x => 1 / x));
        const k0 = -fz.b, k1 = -f1.b, k2 = f2.b, C0z = fz.a, C01 = Math.exp(f1.a), C02 = 1 / f2.a;
        const t90 = [k0 > 0 ? 0.1 * C0z / k0 : Infinity, k1 > 0 ? Math.log(10 / 9) / k1 : Infinity, k2 > 0 ? 1 / (9 * k2 * C02) : Infinity];
        const model = [t => C0z - k0 * t, t => C01 * Math.exp(-k1 * t), t => 1 / Math.max(1e-9, f2.a + f2.b * t)];
        const names = ['zero order', 'first order', 'second order'];
        const series = model.map((m, i) => ({ pts: Array.from({ length: 73 }, (_, j) => [j / 2, clamp(m(j / 2), -50, 150)]), label: names[i] + ' fit', width: i === V.order ? 2.6 : 1.6, dash: i === V.order ? [] : [5, 4] }));
        series.push({ pts: data, label: 'assays', line: false, dots: 4 });
        const lowest = Math.min(...series.slice(0, 3).map(s => s.pts[s.pts.length - 1][1]), ...cs);
        pM.set({ series, y: { label: 'content (% of label)', min: Math.max(0, Math.floor(lowest / 10) * 10 - 5), max: 104 }, hlines: [{ y: 90, label: '90 % limit' }], vlines: [{ x: 12, label: 'end of study' }] });
        const lin = (f, ys, tf) => [{ pts: ts.map((t, i) => [t, tf(ys[i])]), line: false, dots: 3.5 }, { pts: [[0, tf(f(0))], [12, tf(f(12))]], width: 1.6 }];
        pZ.set({ series: lin(t => fz.a + fz.b * t, cs, x => x), y: { label: 'C (%)  R² ' + fz.r2.toFixed(4), noZero: true } });
        p1.set({ series: [{ pts: ts.map((t, i) => [t, Math.log(cs[i])]), line: false, dots: 3.5 }, { pts: [[0, f1.a], [12, f1.a + 12 * f1.b]], width: 1.6 }], y: { label: 'ln C  R² ' + f1.r2.toFixed(4), noZero: true } });
        p2.set({ series: [{ pts: ts.map((t, i) => [t, 1000 / cs[i]]), line: false, dots: 3.5 }, { pts: [[0, 1000 * f2.a], [12, 1000 * (f2.a + 12 * f2.b)]], width: 1.6 }], y: { label: '1000/C  R² ' + f2.r2.toFixed(4), noZero: true } });
        const r2 = [fz.r2, f1.r2, f2.r2], best = r2.indexOf(Math.max(...r2));
        // clear only if the next-best fit leaves at least twice the unexplained scatter
        const miss = r2.map(x => Math.max(1e-12, 1 - x)).sort((a, b) => a - b);
        ro.set('r2', r2.map(x => x.toFixed(4)).join(' / '));
        ro.set('best', names[best] + (miss[1] / miss[0] < 2 ? ' — but barely: undecided' : ' — clearly'));
        ro.set('t90', t90.map(months).join(' / '));
        ro.set('true', months(P.t90({ order: V.order, k: kTrue(), C0: 100 })));
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n = data.length, w = Math.min(46, (W - 40) / n - 10), gap = (W - n * w) / (n + 1), top = 12, h = Hh - 40;
        data.forEach((d, i) => {
          const x = gap + i * (w + gap), f = clamp(d[1] / 100, 0, 1);
          c.fillStyle = d[1] >= 90 ? 'hsl(150 55% 45% / .55)' : 'hsl(0 70% 55% / .5)'; c.fillRect(x, top + h * (1 - f), w, h * f);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x, top, w, h);
          kit.label(c, d[0] + ' mo', x + w / 2, top + h + 12, { align: 'center', size: 11, color: C.muted });
          kit.label(c, d[1].toFixed(1), x + w / 2, top + h * (1 - f) - 8 < top + 8 ? top + 10 : top + h * (1 - f) - 8, { align: 'center', size: 10.5, color: C.text });
        });
      }, box.stage);
      compute();
      loop.start();
    }
  });

  /* ================================================================ sol-ph-rate */
  Hyper.sim('sol-ph-rate', {
    title: 'pH–rate profile: where is the drug most stable?',
    blurb: `The hydrolysis of a hypothetical ester in solution, catalysed by hydrogen ions, by water and by hydroxide ions — and, if you add it, by a phosphate buffer. On a log scale the observed first-order rate constant forms a V (with a flat floor where the water reaction dominates); its lowest point is the pH of maximum stability. The vials hold the solution at pH 1 to 12 and show what is left as the months pass; green ones are still within 90 % of the label. All rate constants rise with temperature (Ea = 85 kJ/mol), and water ionises more when warm.

**Try this**
- Find the pH of maximum stability, then move one and two units away from it. How fast does the shelf life fall?
- Raise log k(H⁺) by one: the minimum moves up by half a pH unit. Why half?
- Add 50 mM phosphate: the buffer's own catalysis (general base catalysis by HPO₄²⁻) lifts the curve around pH 6–8 — the buffer that holds the pH also speeds the loss.
- Warm the solution from 25 to 40 °C: every rate constant rises about fivefold, and the base branch about three times more again, because water ionises more when warm (pKw falls from 14.0 to 13.5).`,
    mount(box, kit) {
      const P = kit.pharma, Ea = 85000, kB = 1e-3;          // J/mol; L/(mol·h) for HPO₄²⁻ at 25 °C (hypothetical)
      const st = kit.stage(box.stage, { aspect: 0.24, minH: 150 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'lkH', label: 'log k(H⁺), L/(mol·h)', min: -3, max: 2, step: 0.1, value: -1 },
        { id: 'lk0', label: 'log k₀ (water), 1/h', min: -8, max: -4, step: 0.1, value: -6 },
        { id: 'lkOH', label: 'log k(OH⁻), L/(mol·h)', min: 0, max: 5, step: 0.1, value: 2 },
        { id: 'buf', label: 'Phosphate buffer', min: 0, max: 100, step: 1, value: 0, unit: 'mM' },
        { id: 'T', label: 'Temperature', min: 5, max: 60, step: 1, value: 25, unit: '°C' },
        { id: 'pH', label: 'pH of the formulation', min: 1, max: 12, step: 0.1, value: 5.5 }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Rate constant here'], ['t90', 'Shelf life here (t90)'], ['best', 'Most stable at'], ['dom', 'Main pathway here']]);
      const plot = kit.plot(gb, { x: { label: 'pH', min: 1, max: 12 }, y: { label: 'log k (k in 1/h)' }, legend: true }, 230);
      const pKw = TK => 4470.99 / TK - 6.0875 + 0.01706 * TK;      // ionisation of water with temperature
      function parts(pH) {
        const TK = V.T + K0, f = Math.exp(Ea / RGAS * (1 / 298.15 - 1 / TK));
        const hpo4 = V.buf / 1000 * P.ionised(7.2, pH, true);
        return [f * Math.pow(10, V.lkH - pH), f * Math.pow(10, V.lk0), f * Math.pow(10, V.lkOH + pH - pKw(TK)), f * kB * hpo4];
      }
      const kAt = pH => parts(pH).reduce((s, x) => s + x, 0);
      let best = 7;
      function draw() {
        const tot = [], comp = [[], [], [], []];
        let kmin = Infinity;
        for (let i = 0; i <= 220; i++) {
          const pH = 1 + i * 0.05, p = parts(pH), k = p.reduce((s, x) => s + x, 0);
          tot.push([pH, Math.log10(k)]); p.forEach((x, j) => comp[j].push([pH, x > 0 ? Math.log10(x) : NaN]));
          if (k < kmin) { kmin = k; best = pH; }
        }
        const ylo = Math.floor(Math.log10(kmin)) - 1.5, yhi = Math.max(...tot.map(p => p[1])) + 0.3;
        const clip = pts => pts.map(p => [p[0], Number.isFinite(p[1]) ? Math.max(ylo, p[1]) : ylo]);
        const names = ['acid (H⁺)', 'water', 'base (OH⁻)', 'buffer (HPO₄²⁻)'];
        const series = [{ pts: tot, label: 'observed k', width: 2.8 }];
        comp.forEach((c, j) => { if (j < 3 || V.buf > 0) series.push({ pts: clip(c), label: names[j], dash: [4, 4], width: 1.3 }); });
        const kHere = kAt(V.pH);
        plot.set({ series, y: { label: 'log k (k in 1/h)', min: ylo, max: yhi }, vlines: [{ x: best, label: 'most stable' }, { x: V.pH, color: kit.colors().accent }],
          marks: [{ x: V.pH, y: Math.log10(kHere), label: 'pH ' + V.pH.toFixed(1) }] });
        const p = parts(V.pH), j = p.indexOf(Math.max(...p));
        ro.set('k', kit.fmt(kHere, 3) + ' per hour');
        ro.set('t90', months(Math.log(10 / 9) / kHere / 730.5));
        ro.set('best', 'pH ' + best.toFixed(2) + ' (t90 ' + months(Math.log(10 / 9) / kmin / 730.5) + ')');
        ro.set('dom', names[j] + ' — ' + (100 * p[j] / kHere).toFixed(0) + ' % of the rate');
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 3) % 36;                              // three months a second, over three years
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const n = 12, w = Math.min(40, (W - 30) / n - 10), gap = (W - n * w) / (n + 1), top = 30, h = Hh - 62;
        kit.label(c, 'after ' + clock.toFixed(1) + ' months at ' + V.T + ' °C', 12, 13, { size: 13, weight: 700, color: C.text });
        for (let i = 0; i < n; i++) {
          const pH = i + 1, left = 100 * Math.exp(-kAt(pH) * clock * 730.5), f = clamp(left / 100, 0, 1), x = gap + i * (w + gap);
          c.fillStyle = left >= 90 ? 'hsl(150 55% 45% / .6)' : 'hsl(0 70% 55% / .5)'; c.fillRect(x, top + h * (1 - f), w, h * f);
          const near = Math.abs(pH - V.pH) < 0.5;
          c.strokeStyle = near ? C.accent : C.text; c.lineWidth = near ? 3 : 1.5; c.strokeRect(x, top, w, h);
          kit.label(c, 'pH ' + pH, x + w / 2, top + h + 12, { align: 'center', size: 11, color: near ? C.accent : C.muted });
          kit.label(c, left >= 99.5 ? '100' : left.toFixed(0), x + w / 2, top + h + 26, { align: 'center', size: 10.5, color: left >= 90 ? C.ok : C.bad });
        }
      }, box.stage);
      draw();
      loop.start();
    }
  });

  /* ================================================================ sol-light */
  const LAM = Array.from({ length: 83 }, (_, i) => 290 + 5 * i);          // nm
  const gauss = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) * ((x - m) / s));
  const sig = x => 1 / (1 + Math.exp(-x));
  const Vlum = l => gauss(l, 557, 44);                                      // photopic eye response (approximation)
  const LIGHT = {
    ich: { vis: l => 0.25 * gauss(l, 405, 5) + 0.7 * gauss(l, 436, 6) + gauss(l, 546, 6) + 0.2 * gauss(l, 578, 8) + 0.7 * gauss(l, 611, 9) + 0.22 * gauss(l, 575, 70) * sig((l - 400) / 8),
           uv: l => gauss(l, 355, 18), lux: 8000, uva: 1.5 },
    // daylight as a 5800 K black body, less the UV that the air and the window glass take out
    window: { vis: l => { const T = 5800, x = l * 1e-9; return (1 / Math.pow(x, 5)) / (Math.exp(0.014388 / (x * T)) - 1) * 0.88 * sig((l - 345) / 10); }, lux: 10000 },
    led: { vis: l => (gauss(l, 450, 10) + 0.8 * gauss(l, 565, 50)) * sig((l - 410) / 6), lux: 500 }
  };
  const PACK = {
    clear: l => 0.9 * sig((l - 295) / 6),
    amber: l => 0.85 * sig((l - 515) / 16) + 0.002,
    opaque: l => 0.03 * sig((l - 380) / 15),
    carton: () => 1e-4
  };
  const DRUG = {
    uv: l => 2.5 * sig((325 - l) / 7),
    yellow: l => 1.2 * gauss(l, 360, 30) + 0.9 * gauss(l, 440, 30),
    blue: l => 1.2 * gauss(l, 620, 35) + 0.3 * gauss(l, 330, 25)
  };
  const uvaOf = E => E.reduce((s, e, i) => s + (LAM[i] >= 320 && LAM[i] <= 400 ? e * 5 : 0), 0);     // W/m², 320–400 nm
  // spectral irradiance (W/m² per nm) of a source, scaled to its illuminance and (for the cabinet) its total near-UV
  function spectrum(src) {
    const d = LIGHT[src], vis = LAM.map(d.vis), lum = 683 * vis.reduce((s, e, i) => s + e * Vlum(LAM[i]) * 5, 0), kv = d.lux / Math.max(1e-30, lum);
    const E = vis.map(e => e * kv);
    if (d.uv) { const u = LAM.map(d.uv), need = Math.max(0, d.uva - uvaOf(E)), uu = Math.max(1e-30, uvaOf(u)); u.forEach((e, i) => { E[i] += e * need / uu; }); }
    return E;
  }
  const SPEC = { ich: spectrum('ich'), window: spectrum('window'), led: spectrum('led') };
  // photons absorbed by the drug (arbitrary units): irradiance × transmission × absorptance × wavelength
  const absorbed = (src, pack, drug) => SPEC[src].reduce((s, e, i) => s + e * PACK[pack](LAM[i]) * (1 - Math.pow(10, -DRUG[drug](LAM[i]))) * LAM[i] * 5, 0);
  Hyper.sim('sol-light', {
    title: 'Light, the pack and the drug',
    blurb: `Photodegradation needs three spectra to overlap: the light source, the transmission of the container and the absorption of the drug. Their product (shaded) is the light that does the damage. Each hypothetical drug is set to lose 30 % in clear glass during the ICH Q1B confirmatory exposure in a cabinet — 8000 lux of cool-white light plus 1.5 W/m² of near-UV, which reaches 200 W·h/m² after 133 hours and 1.2 million lux·hours after 150 — so packs and light sources can be compared on the same footing.

**Try this**
- The colourless drug absorbs only UV: amber glass protects it almost completely, and under indoor LED lighting (no UV) it hardly degrades even in clear glass.
- The yellow drug also absorbs violet and blue light, up to about 500 nm: amber glass protects it well but not completely (try the window), and the carton completely.
- The blue dye absorbs orange-red light, which amber glass lets through: here amber is little better than clear glass, and only an opaque pack helps.
- Move the clear vial to a bright window: window glass removes UV-B, but a few days of daylight do more harm than the whole ICH exposure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'drug', type: 'select', label: 'Drug', options: [['Colourless (absorbs below 340 nm)', 'uv'], ['Yellow (absorbs up to about 500 nm)', 'yellow'], ['Blue dye (absorbs orange-red light)', 'blue']], value: 'yellow' },
        { id: 'pack', type: 'select', label: 'Container', options: [['Clear glass', 'clear'], ['Amber glass', 'amber'], ['Opaque white plastic', 'opaque'], ['Clear glass in its carton', 'carton']], value: 'amber' },
        { id: 'src', type: 'select', label: 'Light', options: [['ICH Q1B cabinet (option 2)', 'ich'], ['Bright window, indirect daylight', 'window'], ['Indoor LED lighting', 'led']], value: 'ich' },
        { type: 'buttons', items: [{ id: 'again', label: 'Start the exposure again', primary: true }] }
      ], (id) => { if (id === 'again') { th = 0; hold = 0; } draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vis', 'Visible exposure'], ['uva', 'Near-UV exposure'], ['left', 'Drug remaining'], ['rel', 'Damaging light vs clear glass']]);
      const pS = kit.plot(g1, { x: { label: 'wavelength (nm)', min: 290, max: 700 }, y: { label: 'relative', min: 0, max: 1.05 }, legend: true }, 200);
      const pC = kit.plot(g2, { x: { label: 'hours of exposure', min: 0, max: 200 }, y: { label: 'drug left (% of label)', max: 101 }, legend: true }, 200);
      const kOf = pack => { const ref = absorbed('ich', 'clear', V.drug); return ref > 0 ? -Math.log(0.7) / 150 * absorbed(V.src, pack, V.drug) / ref : 0; };   // 1/h
      let th = 0, hold = 0;
      function draw() {
        const E = SPEC[V.src], emax = Math.max(...E), prod = LAM.map((l, i) => E[i] * PACK[V.pack](l) * (1 - Math.pow(10, -DRUG[V.drug](l))));
        const pmax = Math.max(...LAM.map((l, i) => E[i] * (1 - Math.pow(10, -DRUG[V.drug](l)))), 1e-30);
        pS.set({ series: [
          { pts: LAM.map((l, i) => [l, E[i] / emax]), label: 'light source', width: 1.6 },
          { pts: LAM.map(l => [l, PACK[V.pack](l)]), label: 'container transmits', width: 1.6, dash: [6, 3] },
          { pts: LAM.map(l => [l, 1 - Math.pow(10, -DRUG[V.drug](l))]), label: 'drug absorbs', width: 1.6, dash: [2, 3] },
          { pts: LAM.map((l, i) => [l, prod[i] / pmax]), label: 'damaging light (vs clear glass)', fill: true, width: 2 }] });
        const packs = ['clear', 'amber', 'opaque', 'carton'], names = { clear: 'clear glass', amber: 'amber glass', opaque: 'opaque plastic', carton: 'in carton' };
        const series = packs.map(pk => { const k = kOf(pk); return { pts: Array.from({ length: 41 }, (_, i) => [i * 5, 100 * Math.exp(-k * i * 5)]), label: names[pk], width: pk === V.pack ? 2.8 : 1.3, dash: pk === V.pack ? [] : [4, 4] }; });
        const lo = Math.min(...series.map(s => s.pts[s.pts.length - 1][1]));
        const vl = [];
        const lux = LIGHT[V.src].lux, uva = uvaOf(E);
        if (uva > 1e-6 && 200 / uva <= 200) vl.push({ x: 200 / uva, label: '200 W·h/m² UV' });
        if (1.2e6 / lux <= 200) vl.push({ x: 1.2e6 / lux, label: '1.2 Mlux·h' });
        pC.set({ series, y: { label: 'drug left (% of label)', min: Math.max(0, Math.floor(lo / 10) * 10 - 5), max: 101 }, hlines: [{ y: 90, label: '90 %' }], vlines: vl });
        const rel = absorbed(V.src, V.pack, V.drug) / Math.max(1e-30, absorbed(V.src, 'clear', V.drug));
        ro.set('rel', rel >= 0.01 ? (100 * rel).toFixed(1) + ' %' : '< 1 %');
        loop.once();
      }
      const loop = kit.loop((dt) => {
        if (th >= 200) { hold += dt; if (hold > 1.5) { th = 0; hold = 0; } } else th = Math.min(200, th + dt * 20);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const E = SPEC[V.src], lux = LIGHT[V.src].lux, uva = uvaOf(E), left = 100 * Math.exp(-kOf(V.pack) * th);
        // the lamp and its rays
        const lx = W * 0.08, lw = Math.min(260, W * 0.36), vx = lx + lw / 2 - 26, vy = 58, vw = 52, vh = Hh - 80;
        c.fillStyle = V.src === 'ich' ? 'hsl(220 90% 85%)' : V.src === 'window' ? 'hsl(50 90% 80%)' : 'hsl(35 90% 80%)'; c.fillRect(lx, 10, lw, 14);
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(lx, 10, lw, 14);
        c.strokeStyle = V.src === 'ich' ? 'hsl(260 80% 65% / .5)' : 'hsl(45 90% 55% / .5)'; c.lineWidth = 1.5;
        for (let i = 0; i < 7; i++) { const x = lx + 12 + i * (lw - 24) / 6; c.beginPath(); c.moveTo(x, 26); c.lineTo(lerp(x, vx + vw / 2, 0.5), vy - 4); c.stroke(); }
        // the container and its contents
        const drugCol = V.drug === 'yellow' ? [48, 95] : V.drug === 'blue' ? [215, 85] : [200, 10];
        c.fillStyle = 'hsl(' + drugCol[0] + ' ' + drugCol[1] + '% 55% / ' + (0.1 + 0.55 * left / 100).toFixed(3) + ')'; c.fillRect(vx, vy + vh * 0.25, vw, vh * 0.75);
        if (V.pack === 'amber') { c.fillStyle = 'hsl(28 80% 35% / .45)'; c.fillRect(vx, vy, vw, vh); }
        if (V.pack === 'opaque') { c.fillStyle = C.dark ? 'hsl(0 0% 80% / .85)' : 'hsl(0 0% 96% / .92)'; c.fillRect(vx, vy, vw, vh); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(vx, vy, vw, vh); c.strokeRect(vx + vw * 0.3, vy - 8, vw * 0.4, 8);
        if (V.pack === 'carton') { c.fillStyle = 'hsl(30 35% 60% / .92)'; c.fillRect(vx - 12, vy - 16, vw + 24, vh + 18); c.strokeRect(vx - 12, vy - 16, vw + 24, vh + 18); kit.label(c, 'carton', vx + vw / 2, vy + vh / 2, { align: 'center', size: 12, weight: 700, color: '#333' }); }
        const tx = lx + lw + 26;
        kit.label(c, th.toFixed(0) + ' hours of exposure', tx, 22, { size: 14, weight: 700, color: C.text });
        kit.label(c, 'visible: ' + kit.fmt(lux * th / 1e6, 3) + ' million lux·h' + (lux * th >= 1.2e6 ? '  ✓ Q1B' : ''), tx, 46, { size: 12.5, color: C.text });
        kit.label(c, 'near-UV: ' + (uva * th).toFixed(0) + ' W·h/m²' + (uva * th >= 200 ? '  ✓ Q1B' : ''), tx, 66, { size: 12.5, color: C.text });
        kit.label(c, 'drug left: ' + left.toFixed(1) + ' % of label', tx, 92, { size: 13.5, weight: 700, color: left >= 90 ? C.ok : C.bad });
        kit.label(c, left >= 90 ? 'within a 90 % limit' : 'below 90 % — needs better protection', tx, 112, { size: 12, color: C.muted });
        ro.set('vis', kit.fmt(lux * th / 1e6, 3) + ' Mlux·h (' + kit.fmt(lux, 3) + ' lux)');
        ro.set('uva', (uva * th).toFixed(0) + ' W·h/m² (' + uva.toFixed(2) + ' W/m²)');
        ro.set('left', left.toFixed(1) + ' %');
      }, box.stage);
      draw();
      loop.start();
    }
  });
})();
