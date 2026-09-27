/* HYPER-PHARMACEUTICS · sims/reference.js — reference simulations for pharmaceutics authors.
 *   ref-stability    a drug losing potency at several storage temperatures (first order, or zero order in a suspension);
 *                    run an accelerated study with assay noise, fit the rate constants and the Arrhenius line,
 *                    and compare the predicted shelf life at 25 °C with the truth
 *   ref-dissolution  a powder dissolving in a USP vessel by Noyes–Whitney (kit.pharma.dissolve): particle size,
 *                    solubility, dose, volume and stirring against % dissolved, sink conditions and the 85 %-in-30-minutes mark
 */
(function () {
  'use strict';
  const R = 8.314462618, K0 = 273.15;

  Hyper.sim('ref-stability', {
    title: 'Shelf life at different temperatures',
    blurb: `A drug that degrades by first-order kinetics — or, as a suspension, by apparent zero order — stored at four temperatures and at the one you choose. The dashed line is the 90 % limit: where each curve crosses it is that temperature's shelf life. Then run an accelerated study, as a stability laboratory would: assays at 40, 50 and 60 °C over six months, with realistic measurement noise, fitted and extrapolated back to 25 °C with the Arrhenius equation.

**Try this**
- Move the storage temperature from 25 °C to 30 °C, then to 5 °C. With Ea = 80 kJ/mol, what happens to the shelf life each time?
- Lower the activation energy to 50 kJ/mol: temperature matters less — and an accelerated study says less about room temperature.
- Run the accelerated study several times: the prediction scatters around the true shelf life because of assay noise. Which temperatures pin it down best?
- Switch to a suspension: the loss becomes a straight line, much slower than the same drug in solution.`,
    mount(box, kit) {
      const P = kit.pharma, B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.22, minH: 110 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'k25', label: 'Rate constant at 25 °C', min: 0.001, max: 0.05, step: 0.0005, value: 0.004, unit: '1/month', log: true },
        { id: 'Ea', label: 'Activation energy E_a', min: 40, max: 130, step: 1, value: 80, unit: 'kJ/mol' },
        { id: 'T', label: 'Your storage temperature', min: 2, max: 60, step: 1, value: 25, unit: '°C' },
        { id: 'form', type: 'select', label: 'Form', options: [['Solution (first order)', 'sol'], ['Suspension, 10 % dissolved (zero order)', 'susp']], value: 'sol' },
        { type: 'buttons', items: [{ id: 'study', label: 'Run an accelerated study', primary: true }, { id: 'clear', label: 'Clear the study' }] }
      ], (id) => { if (id === 'study') runStudy(); if (id === 'clear') study = null; draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t90', 'Shelf life at your temperature'], ['t25', 'Shelf life at 25 °C (true)'], ['pred', 'Predicted from the accelerated study'], ['ea', 'Fitted activation energy']]);
      const pC = kit.plot(g1, { x: { label: 'time (months)', min: 0, max: 48 }, y: { label: 'content (% of label)', min: 70, max: 101 }, legend: true }, 210);
      const pA = kit.plot(g2, { x: { label: '1000 / T (1/K)' }, y: { label: 'ln k (k per month)' }, legend: true }, 210);
      const kAt = TC => P.arrhenius({ k1: V.k25, T1: 298.15, T2: TC + K0, Ea: V.Ea * 1000 });
      const content = (TC, t) => V.form === 'sol' ? 100 * Math.exp(-kAt(TC) * t) : Math.max(0, 100 - 100 * 0.1 * kAt(TC) * t);
      const t90 = TC => V.form === 'sol' ? Math.log(10 / 9) / kAt(TC) : 10 / (10 * kAt(TC));
      let study = null, seed = 1;
      function runStudy() {
        const rng = B.rng(seed++), noise = () => { const u = Math.max(1e-9, rng()), v = rng(); return 0.8 * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
        const temps = [40, 50, 60], times = [0, 1, 2, 3, 6], data = [], fits = [];
        for (const TC of temps) {
          const pts = times.map(t => [t, content(TC, t) + noise()]);
          data.push({ TC, pts });
          // least-squares slope of ln C (solution) or C (suspension) against time
          const ys = pts.map(p => V.form === 'sol' ? Math.log(Math.max(1, p[1])) : p[1]), n = pts.length, mx = times.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
          let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (times[i] - mx) * (ys[i] - my); sxx += (times[i] - mx) ** 2; }
          const k = V.form === 'sol' ? -sxy / sxx : -sxy / sxx / 10;
          fits.push({ TC, k: Math.max(1e-6, k) });
        }
        const xs = fits.map(f => 1 / (f.TC + K0)), ys = fits.map(f => Math.log(f.k)), n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n;
        let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
        const slope = sxy / sxx, Ea = -slope * R, k25 = Math.exp(my + slope * (1 / 298.15 - mx));
        study = { data, fits, Ea, k25, t90: V.form === 'sol' ? Math.log(10 / 9) / k25 : 1 / k25, slope, icpt: my - slope * mx };
      }
      function draw() {
        const temps = [[5, '5 °C'], [25, '25 °C'], [30, '30 °C'], [40, '40 °C']];
        const series = temps.map(([TC, lab]) => ({ pts: Array.from({ length: 97 }, (_, i) => [i / 2, content(TC, i / 2)]), label: lab, width: 1.2, dash: [4, 3] }));
        series.push({ pts: Array.from({ length: 97 }, (_, i) => [i / 2, content(V.T, i / 2)]), label: 'yours: ' + V.T + ' °C', width: 2.6 });
        if (study) study.data.forEach((d, i) => series.push({ pts: d.pts, label: i ? undefined : 'assays at 40–60 °C', line: false, dots: 3.5 }));
        const tt = t90(V.T);
        pC.set({ series, hlines: [{ y: 90, label: '90 % limit' }], vlines: tt < 48 ? [{ x: tt, label: 't90' }] : [] });
        const line = Array.from({ length: 30 }, (_, i) => { const TC = i * 2.5; return [1000 / (TC + K0), Math.log(kAt(TC))]; });
        const aSeries = [{ pts: line, label: 'true Arrhenius line' }];
        if (study) {
          aSeries.push({ pts: study.fits.map(f => [1000 / (f.TC + K0), Math.log(f.k)]), label: 'fitted k', line: false, dots: 4 });
          aSeries.push({ pts: [[1000 / (60 + K0), study.icpt + study.slope / (60 + K0)], [1000 / 298.15, study.icpt + study.slope / 298.15]], label: 'extrapolated to 25 °C', dash: [5, 4] });
        }
        pA.set({ series: aSeries, vlines: [{ x: 1000 / 298.15, label: '25 °C' }] });
        const months = x => x >= 24 ? (x / 12).toFixed(1) + ' years' : x >= 1 ? x.toFixed(1) + ' months' : (x * 30.4).toFixed(0) + ' days';
        ro.set('t90', months(tt)); ro.set('t25', months(t90(25)));
        ro.set('pred', study ? months(study.t90) + ' (' + ((study.t90 / t90(25) - 1) * 100 >= 0 ? '+' : '') + ((study.t90 / t90(25) - 1) * 100).toFixed(0) + ' %)' : 'run a study');
        ro.set('ea', study ? (study.Ea / 1000).toFixed(1) + ' kJ/mol (true ' + V.Ea + ')' : '—');
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 4) % 48;                         // four months a second, looping over four years
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // a thermometer and a bottle whose fill shows the content left at your temperature
        const x0 = 30, top = 12, h = Hh - 24, frac = Math.max(0, Math.min(1, (V.T + 10) / 80));
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0 - 5, top, 10, h);
        c.fillStyle = V.T > 30 ? C.bad : V.T < 10 ? 'hsl(210 80% 60%)' : C.warn; c.fillRect(x0 - 4, top + h * (1 - frac), 8, h * frac);
        kit.label(c, V.T + ' °C', x0 + 12, top + h * (1 - frac), { align: 'left', size: 12, weight: 700, color: C.text });
        const bx = W * 0.35, bw = Math.min(90, W * 0.12), bh = h * 0.85, by = top + h - bh, pct = content(V.T, clock);
        c.fillStyle = pct >= 90 ? 'hsl(150 55% 45% / .6)' : 'hsl(0 70% 55% / .55)'; c.fillRect(bx, by + bh * (1 - pct / 100), bw, bh * pct / 100);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(bx, by, bw, bh); c.strokeRect(bx + bw * 0.3, by - 10, bw * 0.4, 10);
        c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(bx - 8, by + bh * 0.1); c.lineTo(bx + bw + 8, by + bh * 0.1); c.stroke(); c.setLineDash([]);
        kit.label(c, 'after ' + clock.toFixed(1) + ' months: ' + pct.toFixed(1) + ' % of label', bx + bw + 16, by + bh / 2, { align: 'left', size: 13, weight: 700, color: pct >= 90 ? C.ok : C.bad });
        kit.label(c, pct >= 90 ? 'within specification' : 'out of specification — past its shelf life', bx + bw + 16, by + bh / 2 + 18, { align: 'left', size: 12, color: C.muted });
      }, box.stage);
      draw();
      loop.start();
    }
  });

  Hyper.sim('ref-dissolution', {
    title: 'A powder dissolving',
    blurb: `A dose of drug powder dropped into a dissolution vessel, as in the USP paddle test: each particle dissolves by the Noyes–Whitney equation — the rate proportional to its surface area and to how far the medium is from saturation — so the particles shrink and the medium fills with drug. The test runs 60 minutes in 12 seconds.

**Try this**
- Halve the particle size: the surface area doubles and dissolution speeds up. How small must they be to reach 85 % in 30 minutes?
- Lower the solubility until the dose can no longer dissolve in the volume: the curve flattens below 100 % — the vessel is not under *sink conditions* (volume × solubility at least three times the dose).
- Compare gentle and vigorous stirring: a thinner diffusion layer speeds everything up, which is why the test fixes the paddle speed.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 200 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Particle radius', min: 1, max: 100, step: 0.5, value: 20, unit: 'µm', log: true },
        { id: 'Cs', label: 'Solubility', min: 0.01, max: 10, step: 0.01, value: 0.5, unit: 'mg/mL', log: true },
        { id: 'dose', label: 'Dose', min: 10, max: 1000, step: 10, value: 250, unit: 'mg' },
        { id: 'V', label: 'Medium volume', min: 500, max: 1000, step: 50, value: 900, unit: 'mL' },
        { id: 'h', type: 'select', label: 'Stirring (diffusion layer)', options: [['Gentle (50 µm)', 50], ['Paddle 50 rpm (30 µm)', 30], ['Vigorous (15 µm)', 15]], value: 30 },
        { id: 'cmp', type: 'check', label: 'Compare with a micronised powder (2 µm)', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['at', 'Dissolved at 15 / 30 / 60 min'], ['sink', 'Sink factor V·Cs / dose'], ['t85', 'Time to 85 %'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (min)', min: 0, max: 60 }, y: { label: 'dissolved (% of dose)', min: 0, max: 100 }, legend: true }, 170);
      let curve = [], fine = [], t = 0;
      const run = r => P.dissolve({ dose: V.dose * 1e-6, r0: r * 1e-6, rho: 1300, Cs: V.Cs, D: 7e-10, h: Math.min(V.h * 1e-6, r * 1e-6 + 1e-6), V: V.V * 1e-6, T: 3600, dt: 2 });
      function recompute() {
        curve = run(V.r); fine = V.cmp ? run(2) : [];
        const at = m => curve[Math.min(curve.length - 1, Math.round(m * 60 / 2))][1] * 100;
        const i85 = curve.findIndex(p => p[1] >= 0.85), sink = V.V * V.Cs / V.dose;
        ro.set('at', at(15).toFixed(0) + ' / ' + at(30).toFixed(0) + ' / ' + at(60).toFixed(0) + ' %');
        ro.set('sink', sink.toFixed(2) + (sink >= 3 ? ' — sink conditions' : sink >= 1 ? ' — not sink: slows as it saturates' : ' — the dose cannot all dissolve'));
        ro.set('t85', i85 >= 0 ? (curve[i85][0] / 60).toFixed(1) + ' min' : 'not within 60 min');
        ro.set('msg', i85 >= 0 && curve[i85][0] <= 1800 ? 'rapidly dissolving (≥ 85 % in 30 min)' : '');
        plot.set({ series: [{ pts: curve.filter((_, i) => i % 5 === 0).map(p => [p[0] / 60, p[1] * 100]), label: V.r + ' µm powder' }]
          .concat(fine.length ? [{ pts: fine.filter((_, i) => i % 5 === 0).map(p => [p[0] / 60, p[1] * 100]), label: 'micronised 2 µm', dash: [5, 4] }] : []),
          hlines: [{ y: 85, label: '85 %' }], vlines: [{ x: 30, label: '30 min' }] });
        t = 0;
      }
      recompute();
      const dots = Array.from({ length: 90 }, (_, i) => ({ x: Math.random(), y: 0.55 + 0.4 * Math.random(), w: Math.random() * 6.28 }));
      const loop = kit.loop((dt) => {
        t = Math.min(3600, t + dt * 300);                              // 5 minutes of test per second
        const f = curve.length ? curve[Math.min(curve.length - 1, Math.round(t / 2))][1] : 0;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const vx = W * 0.3, vw = W * 0.4, vy = Hh * 0.1, vh = Hh * 0.8;
        // the medium, tinted by how saturated it is
        const sat = Math.min(1, f * V.dose / (V.V * V.Cs));
        c.fillStyle = 'hsl(280 60% ' + (C.dark ? 45 : 70) + '% / ' + (0.08 + 0.4 * sat) + ')'; c.fillRect(vx, vy + vh * 0.12, vw, vh * 0.88);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(vx, vy); c.lineTo(vx, vy + vh - 20); c.quadraticCurveTo(vx, vy + vh, vx + 20, vy + vh); c.lineTo(vx + vw - 20, vy + vh); c.quadraticCurveTo(vx + vw, vy + vh, vx + vw, vy + vh - 20); c.lineTo(vx + vw, vy); c.stroke();
        // the paddle
        const ang = t / 60 * 2 * Math.PI * 0.8, px = vx + vw / 2, py = vy + vh * 0.72;
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(px, vy - 8); c.lineTo(px, py); c.stroke();
        c.fillStyle = C.muted; const pw = vw * 0.3 * Math.abs(Math.cos(ang)) + 4; c.fillRect(px - pw / 2, py - 6, pw, 12);
        // the particles, shrinking as the powder dissolves
        const rNow = V.r * Math.cbrt(Math.max(0, 1 - f)), rr = Math.max(0, Math.min(9, 1.5 + 2.2 * Math.log10(1 + rNow)));
        if (rr > 0.2 && f < 0.999) {
          c.fillStyle = C.text;
          for (const d of dots) { const x = vx + 8 + d.x * (vw - 16) + 3 * Math.sin(t / 30 + d.w), y = vy + vh * (0.3 + 0.62 * d.y) + 2 * Math.cos(t / 25 + d.w); c.beginPath(); c.arc(x, y, rr, 0, 6.283); c.fill(); }
        }
        kit.label(c, (t / 60).toFixed(0) + ' min', vx - 12, vy + 10, { align: 'right', size: 13, weight: 700, color: C.text });
        kit.label(c, (f * 100).toFixed(0) + ' % dissolved', vx + vw + 14, vy + vh * 0.4, { align: 'left', size: 14, weight: 700, color: C.text });
        kit.label(c, 'particle radius now ' + rNow.toFixed(1) + ' µm', vx + vw + 14, vy + vh * 0.4 + 20, { align: 'left', size: 12, color: C.muted });
        kit.label(c, 'medium ' + (sat * 100).toFixed(0) + ' % saturated', vx + vw + 14, vy + vh * 0.4 + 38, { align: 'left', size: 12, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });
})();
