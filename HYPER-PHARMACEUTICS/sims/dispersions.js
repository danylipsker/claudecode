/* HYPER-PHARMACEUTICS · sims/dispersions.js — particles, surfaces and flow; liquids; skin.
 *   disp-stokes     a flocculated and a deflocculated suspension settling side by side (Stokes' law, kit.pharma.stokes)
 *   disp-hlb        blending two emulsifiers to an oil's required HLB (kit.pharma.hlbMix): emulsion type, droplets, creaming
 *   disp-rheogram   rheograms: Newtonian, plastic, pseudoplastic, dilatant and a thixotropic loop, with a rotating viscometer
 *   disp-cmc        surface tension against log concentration, the CMC, micelles and micellar solubilisation
 *   disp-skin       a drug diffusing through the stratum corneum from a patch (Fick's second law, implicit finite differences):
 *                   concentration profile, cumulative amount, steady flux (kit.pharma.fickFlux) and lag time; patch removal
 *   disp-dlvo       DLVO interaction energy of two particles (van der Waals + double layer) and Brownian aggregation
 *   disp-tonicity   red blood cells in solutions of different osmolarity and tonicity (kit.pharma.osmolarity)
 *   disp-psd        a log-normal particle size distribution by number and by volume: D10/D50/D90, span, surface area
 */
(function () {
  'use strict';
  const K0 = 273.15, KB = 1.380649e-23, NA = 6.02214076e23, E0 = 8.8541878128e-12, QE = 1.602176634e-19;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // a small seeded generator and standard normal numbers, so every run looks the same
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const gauss = r => { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  // the standard normal cumulative distribution (Abramowitz–Stegun 7.1.26 on erf)
  function ncdf(z) {
    const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
  }
  // readable times and lengths
  function fmtT(s) {
    if (!Number.isFinite(s)) return 'forever';
    if (s < 90) return s.toFixed(s < 10 ? 1 : 0) + ' s';
    if (s < 5400) return (s / 60).toFixed(s < 600 ? 1 : 0) + ' min';
    if (s < 172800) return (s / 3600).toFixed(s < 36000 ? 1 : 0) + ' h';
    if (s < 3.15576e7) return (s / 86400).toFixed(s < 864000 ? 1 : 0) + ' days';
    const y = s / 3.15576e7;
    return (y < 1e4 ? y.toFixed(y < 10 ? 1 : 0) : y.toExponential(1)) + ' years';
  }
  function fmtL(m) {
    if (!Number.isFinite(m)) return '—';
    if (m >= 0.01) return (m * 100).toFixed(1) + ' cm';
    if (m >= 1e-3) return (m * 1e3).toFixed(m >= 0.01 ? 0 : 1) + ' mm';
    if (m >= 1e-6) return (m * 1e6).toFixed(m >= 1e-5 ? 0 : 1) + ' µm';
    return (m * 1e9).toFixed(0) + ' nm';
  }
  function fmtV(v) {
    if (!Number.isFinite(v)) return '—';
    const cmh = v * 360000;
    const main = v >= 1e-3 ? (v * 1e3).toPrecision(3) + ' mm/s' : v >= 1e-6 ? (v * 1e6).toPrecision(3) + ' µm/s' : (v * 1e9).toPrecision(3) + ' nm/s';
    return main + ' (' + (cmh >= 1 ? cmh.toPrecision(3) + ' cm/h' : (cmh * 24 * 10).toPrecision(3) + ' mm/day') + ')';
  }
  const div = (parent, css) => { const d = document.createElement('div'); if (css) d.style.cssText = css; parent.appendChild(d); return d; };

  /* ================================================================ disp-stokes */
  Hyper.sim('disp-stokes', {
    title: 'Settling: deflocculated against flocculated',
    blurb: `Two bottles of the same suspension, just shaken. On the left the particles repel one another (**deflocculated**) and settle one by one, each at its own Stokes velocity $v = d^2\\Delta\\rho\\,g/18\\eta$ — the big ones first — so the liquid clears slowly from the top while a thin, dense sediment builds up that can cake. On the right the particles cling together in loose **flocs** (six particle diameters across, a quarter solid, the rest trapped liquid): they fall much faster behind a sharp boundary and stop in a loose sediment that fills most of the bottle and redisperses with one shake. Particle sizes are spread log-normally around the median you choose; the graph follows the boundaries.

**Try this**
- Halve the particle size: everything settles four times more slowly. How small must particles be to stay up for a day in water?
- Raise the viscosity from 1 to 100 mPa·s, as a suspending agent would: settling slows a hundredfold.
- Make the density difference small (0.02–0.05 g/cm³): matching the vehicle's density is another lever.
- Compare the two sediments: a thin, packed layer (risk of caking) against a loose floc bed with clear liquid above.
- Go below about 1 µm and compare the Brownian drift with the settling distance per hour: diffusion starts to rival gravity.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = div(box.stage, 'padding:4px 10px 10px');
      const H0 = 0.10, FD = 0.12, FF = 0.7, FLOC = 6, PHI = 0.25, SG = 1.6, NP = 240;
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Particle diameter (median)', min: 0.3, max: 50, value: 5, unit: 'µm', log: true, sig: 2 },
        { id: 'drho', label: 'Density difference Δρ', min: 0.02, max: 1.5, value: 0.3, unit: 'g/cm³', log: true, sig: 2 },
        { id: 'eta', label: 'Vehicle viscosity at rest', min: 1, max: 1000, value: 1, unit: 'mPa·s', log: true, sig: 2 },
        { id: 'speed', type: 'select', label: 'Time runs at', options: [['auto (about 15 s to settle)', 0], ['1 minute per second', 60], ['10 minutes per second', 600], ['1 hour per second', 3600], ['1 day per second', 86400]], value: 0 },
        { type: 'buttons', items: [{ id: 'shake', label: 'Shake the bottles', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'shake') { t = 0; if (!loop.running) loop.start(); }
        else if (id === 'pause') loop.toggle();
        else { recompute(); t = Math.min(t, tEnd); }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'Stokes velocity, median particle'], ['t10', 'It falls 10 cm in'], ['vf', 'Flocs settle at'], ['now', 'Time since shaking'], ['F', 'Sediment volume F (defloc. / floc.)'], ['br', 'Per hour: Brownian drift / settling'], ['re', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0 }, y: { label: 'height in the bottle (cm)', min: 0, max: 10.5 }, legend: true }, 180);
      const r = rng(11);
      const parts = [];
      for (let i = 0; i < NP; i++) {
        const z = clamp(gauss(r), -2.5, 2.5);
        parts.push({ z0: r(), x: r(), s: Math.exp(Math.log(SG) * z), u: r(), ox: r() - 0.5, oy: r() - 0.5 });
      }
      for (let i = 0; i < NP; i++) { const b = parts[i - (i % 6)]; parts[i].fz = b.z0; parts[i].fx = b.x; }
      // 41-point quadrature over the log-normal size spread, for smooth curves
      const quad = Array.from({ length: 41 }, (_, k) => { const z = -3 + k * 0.15; return { s: Math.exp(Math.log(SG) * z), w: Math.exp(-z * z / 2) }; });
      const wsum = quad.reduce((a, q) => a + q.w, 0);
      const vs = (dUm, drho) => P.stokes({ d: dUm * 1e-6, rhoP: 1000 + drho * 1000, rhoF: 1000, eta: V.eta * 1e-3 });
      let t = 0, vMed = 1, v10 = 1, vFloc = 1, tEnd = 60, tu = 3600, tuName = 'h';
      const settled = tt => quad.reduce((a, q) => a + q.w * Math.min(1, vMed * q.s * q.s * tt / H0), 0) / wsum;
      const flocDepth = tt => Math.min(1 - FF, vFloc * tt / H0);
      function recompute() {
        vMed = vs(V.d, V.drho);
        v10 = vMed / Math.pow(SG, 2 * 1.2816);
        vFloc = 0.5 * vs(V.d * FLOC, V.drho * PHI);              // hindered settling roughly halves a floc's free speed
        const tFloc = H0 * (1 - FF) / vFloc;
        tEnd = clamp(1.15 * Math.max(tFloc, H0 / v10), 60, 120 * 86400);
        tu = tEnd <= 2 * 3600 ? 60 : tEnd <= 96 * 3600 ? 3600 : 86400;
        tuName = tu === 60 ? 'min' : tu === 3600 ? 'h' : 'days';
        const n = 120, dS = [], cake = [], flo = [];
        for (let k = 0; k <= n; k++) {
          const tt = tEnd * k / n, fs = settled(tt), hc = FD * H0 * fs;
          dS.push([tt / tu, 100 * Math.max(hc, H0 - v10 * tt)]);
          cake.push([tt / tu, 100 * hc]);
          flo.push([tt / tu, 100 * H0 * (1 - flocDepth(tt))]);
        }
        plot.set({ x: { label: 'time (' + tuName + ')', min: 0, max: tEnd / tu }, series: [{ pts: flo, label: 'flocculated: top of the flocs' }, { pts: dS, label: 'deflocculated: top of the cloudy layer', dash: [6, 4] }, { pts: cake, label: 'deflocculated: dense sediment' }] });
        const Dm = KB * 298.15 / (3 * Math.PI * V.eta * 1e-3 * V.d * 1e-6);
        ro.set('v', fmtV(vMed)); ro.set('t10', fmtT(H0 / vMed)); ro.set('vf', fmtV(vFloc));
        ro.set('br', fmtL(Math.sqrt(2 * Dm * 3600)) + ' / ' + fmtL(vMed * 3600));
        const Re = 1000 * vMed * V.d * 1e-6 / (V.eta * 1e-3);
        ro.set('re', Re > 0.3 ? 'Reynolds number ' + Re.toPrecision(2) + ': too fast for Stokes\' law — it overestimates' : '');
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const cw = clamp(W * 0.15, 60, 120), top = 40, bot = Hh - 18, ch = bot - top;
        const cols = [{ x: W * 0.12, floc: false, name: 'deflocculated' }, { x: W * 0.12 + cw + Math.max(40, W * 0.08), floc: true, name: 'flocculated' }];
        const fs = settled(t), hcFrac = FD * fs, bF = flocDepth(t);
        const part = kit.hue(28), partA = kit.hue(28, 0.55);
        for (const col of cols) {
          const x0 = col.x;
          c.fillStyle = kit.hue(205, C.dark ? 0.10 : 0.07); c.fillRect(x0, top, cw, ch);
          if (!col.floc) {
            // turbidity of the liquid above the sediment, by height band
            const nb = 20, cnt = new Array(nb).fill(0);
            for (const p of parts) { const zz = p.z0 + vMed * p.s * p.s * t / H0; if (zz < 1) cnt[Math.min(nb - 1, Math.floor(zz * nb))]++; }
            for (let b = 0; b < nb; b++) { const a = clamp(0.04 + 0.5 * cnt[b] / (NP / nb), 0, 0.6); c.fillStyle = kit.hue(28, a * 0.5); c.fillRect(x0, top + ch * b / nb, cw, ch / nb + 0.5); }
            const hcPx = ch * hcFrac;
            c.fillStyle = kit.hue(28, 0.7); c.fillRect(x0, bot - hcPx, cw, hcPx);
            if (hcPx > 1) {                                  // hatching: a packed bed
              c.save(); c.beginPath(); c.rect(x0, bot - hcPx, cw, hcPx); c.clip();
              c.strokeStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.2)'; c.lineWidth = 1; c.beginPath();
              for (let k = -hcPx; k < cw; k += 6) { c.moveTo(x0 + k, bot); c.lineTo(x0 + k + hcPx, bot - hcPx); }
              c.stroke(); c.restore();
            }
            for (const p of parts) {
              const zz = p.z0 + vMed * p.s * p.s * t / H0, rr = clamp(1 + 0.9 * Math.log10(1 + V.d * p.s), 1, 4);
              if (zz >= 1 - hcFrac) continue;
              kit.dot(c, x0 + 5 + p.x * (cw - 10), top + ch * zz, rr, part);
            }
            kit.label(c, 'F = ' + hcFrac.toFixed(2) + (fs > 0.98 ? ' (packed)' : ''), x0 + cw / 2, bot + 10, { align: 'center', size: 11.5, color: C.muted });
          } else {
            const yb = top + ch * bF;
            c.fillStyle = kit.hue(28, 0.12 + 0.25 * bF / (1 - FF)); c.fillRect(x0, yb, cw, bot - yb);
            for (const p of parts) {
              const zz = bF + p.fz * (1 - bF) * 0.97 + 0.015, rr = clamp(1 + 0.9 * Math.log10(1 + V.d * p.s), 1, 4);
              kit.dot(c, x0 + 7 + p.fx * (cw - 14) + p.ox * 7, top + ch * zz + p.oy * 7, rr, partA);
            }
            c.strokeStyle = C.text; c.setLineDash([5, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x0 + cw, yb); c.stroke(); c.setLineDash([]);
            kit.label(c, 'F = ' + (1 - bF).toFixed(2), x0 + cw / 2, bot + 10, { align: 'center', size: 11.5, color: C.muted });
          }
          // the glass and its scale
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, top - 12); c.lineTo(x0, bot); c.lineTo(x0 + cw, bot); c.lineTo(x0 + cw, top - 12); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath();
          for (let k = 0; k <= 10; k++) { const y = bot - ch * k / 10; c.moveTo(x0, y); c.lineTo(x0 + (k % 5 ? 5 : 10), y); }
          c.stroke();
          kit.label(c, col.name, x0 + cw / 2, top - 24, { align: 'center', size: 12.5, weight: 700, color: C.text });
        }
        for (let k = 0; k <= 10; k += 5) kit.label(c, k + ' cm', cols[0].x - 6, bot - ch * k / 10, { align: 'right', size: 10.5, color: C.muted });
        const tx = cols[1].x + cw + 24;
        if (tx < W - 60) {
          kit.label(c, fmtT(t) + ' after shaking', tx, top + 6, { size: 14, weight: 700, color: C.text });
          kit.label(c, 'deflocculated: ' + (100 * fs).toFixed(0) + ' % of the drug has settled', tx, top + 30, { size: 12, color: C.muted });
          kit.label(c, 'flocculated: boundary ' + (100 * bF / (1 - FF)).toFixed(0) + ' % of the way down', tx, top + 48, { size: 12, color: C.muted });
          kit.label(c, fs > 0.98 ? 'left bottle: a dense layer — shake hard, it may have caked' : 'left bottle: still cloudy, but settling', tx, top + 74, { size: 12, color: fs > 0.98 ? C.bad : C.text2 || C.text });
          kit.label(c, 'right bottle: loose flocs — one shake redisperses them', tx, top + 92, { size: 12, color: C.ok });
        }
        ro.set('now', fmtT(t));
        ro.set('F', hcFrac.toFixed(2) + ' / ' + (1 - bF).toFixed(2));
      }
      const loop = kit.loop((dt) => {
        const rate = V.speed || tEnd / 15;
        if (dt > 0 && t < tEnd) t = Math.min(tEnd, t + dt * rate);
        draw();
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ disp-hlb */
  Hyper.sim('disp-hlb', {
    title: 'Blending emulsifiers to the required HLB',
    blurb: `Two emulsifiers — one oil-loving (low HLB), one water-loving (high HLB) — are blended by weight, and the blend's HLB is the weighted average. The oil you choose has a **required HLB**; the closer the blend matches it, the smaller the droplets and the longer the emulsion lasts. By Bancroft's rule a blend below about 7 makes a water-in-oil emulsion and above about 8 an oil-in-water one. The beaker then ages the emulsion over a month: droplets cream (reversible), and a poorly matched emulsion coalesces and cracks (irreversible). The stability here is a teaching model built on the HLB match, not a prediction for a real product.

**Try this**
- For light liquid paraffin (required 10.5), find the fraction of polysorbate 80 that gives the most stable emulsion. Check it against the readout "fraction needed".
- Switch the oil to cetyl alcohol (15) with the same blend: the emulsion now creams and cracks.
- Choose "liquid paraffin, w/o": now the blend must be mostly the low-HLB surfactant, and the droplets are water in oil.
- Pair sorbitan monolaurate (8.6) with polysorbate 20 (16.7): can this pair reach an HLB of 4? The readout says when a pair cannot do the job.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 250 });
      const gb = div(box.stage, 'padding:4px 10px 10px');
      const LOW = [['sorbitan trioleate (HLB 1.8)', 1.8], ['glyceryl monostearate (HLB 3.8)', 3.8], ['sorbitan monooleate (HLB 4.3)', 4.3], ['sorbitan monostearate (HLB 4.7)', 4.7], ['sorbitan monolaurate (HLB 8.6)', 8.6]];
      const HIGH = [['polysorbate 60 (HLB 14.9)', 14.9], ['polysorbate 80 (HLB 15.0)', 15.0], ['polysorbate 20 (HLB 16.7)', 16.7], ['macrogol 40 stearate (HLB 16.9)', 16.9], ['sodium lauryl sulfate (HLB 40)', 40]];
      const OILS = [['light liquid paraffin, o/w (about 10.5)', 10.5], ['isopropyl myristate, o/w (about 11.5)', 11.5], ['castor oil, o/w (about 14)', 14], ['cetyl alcohol, o/w (about 15)', 15], ['liquid paraffin, w/o (about 4)', 4]];
      const ctl = kit.controls(box.side, [
        { id: 'A', type: 'select', label: 'Low-HLB emulsifier (A)', options: LOW, value: 4.3 },
        { id: 'B', type: 'select', label: 'High-HLB emulsifier (B)', options: HIGH, value: 15.0 },
        { id: 'f', label: 'Share of B in the blend', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'oil', type: 'select', label: 'Oil phase (its required HLB)', options: OILS, value: 10.5 },
        { id: 'g', label: 'Emulsifier per 100 g of emulsion', min: 1, max: 10, step: 0.5, value: 5, unit: 'g' },
        { type: 'buttons', items: [{ id: 'mix', label: 'Homogenise again', primary: true }] }
      ], (id) => { if (id === 'mix') age = 0; update(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['hlb', 'HLB of the blend'], ['req', 'Required HLB of the oil'], ['need', 'Share of B needed'], ['mass', 'Weigh (A / B)'], ['type', 'Emulsion type'], ['drop', 'Mean droplet size'], ['fate', 'After a month']]);
      const plot = kit.plot(gb, { x: { label: 'share of B in the blend (%)', min: 0, max: 100 }, y: { label: 'predicted stability (%)', min: 0, max: 105 }, legend: true }, 170);
      const r = rng(5), drops = Array.from({ length: 150 }, () => ({ x: r(), y: r(), k: r(), j: r() * 6.28 }));
      let age = 0;                                         // days since homogenising
      const model = f => {
        const hlb = P.hlbMix([[1 - f, V.A], [f, V.B]]), ow = hlb >= 7.5, reqOW = V.oil >= 8;
        const miss = Math.abs(hlb - V.oil) + (ow !== reqOW ? 3 : 0);
        const s = Math.exp(-Math.pow(miss / 2.2, 2));
        return { hlb, ow, s, d: Math.min(40, 0.5 + 0.45 * miss * miss) };
      };
      let M = model(0.4);
      function update() {
        M = model(V.f / 100);
        const need = (V.oil - V.A) / (V.B - V.A);
        ro.set('hlb', M.hlb.toFixed(1));
        ro.set('req', V.oil.toFixed(1));
        ro.set('need', need >= 0 && need <= 1 ? (100 * need).toFixed(0) + ' % of B' : 'out of reach: choose another pair');
        ro.set('mass', (V.g * (1 - V.f / 100)).toFixed(2) + ' g / ' + (V.g * V.f / 100).toFixed(2) + ' g');
        ro.set('type', (M.ow ? 'oil-in-water' : 'water-in-oil') + (Math.abs(M.hlb - 7.5) < 1 ? ' (borderline)' : ''));
        ro.set('drop', M.d < 1 ? (M.d * 1000).toFixed(0) + ' nm' : M.d.toFixed(1) + ' µm');
        ro.set('fate', M.s > 0.8 ? 'stable: only slight creaming' : M.s > 0.45 ? 'creams — shake before use' : M.s > 0.15 ? 'coalesces: droplets grow' : 'cracks: a separate layer forms');
        const pts = Array.from({ length: 101 }, (_, i) => [i, 100 * model(i / 100).s]);
        plot.set({ series: [{ pts, label: 'stability of the blend with this oil', fill: true }], marks: [{ x: V.f, y: 100 * M.s, label: M.hlb.toFixed(1) }],
          vlines: need >= 0 && need <= 1 ? [{ x: 100 * need, label: 'required HLB' }] : [] });
      }
      update();
      const loop = kit.loop((dt) => {
        age = Math.min(30, age + dt * 3);                  // three days a second, up to a month
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const bx = W * 0.08, bw = Math.min(W * 0.36, 260), by = 22, bh = Hh - 44;
        const water = kit.hue(205, C.dark ? 0.28 : 0.18), oil = kit.hue(45, C.dark ? 0.55 : 0.45);
        // cracking only when the match is poor; creaming at a rate growing with droplet size squared (Stokes)
        const s = M.s, sep = clamp((0.45 - s) / 0.45, 0, 1) * (1 - Math.exp(-age / 6)), cream = 1 - Math.exp(-age * 0.01 * M.d * M.d);
        const phi = 0.3;                                   // dispersed-phase volume fraction
        c.fillStyle = M.ow ? water : oil; c.fillRect(bx, by, bw, bh);
        // a separated layer of the dispersed phase: oil on top (o/w cracks) or water at the bottom (w/o breaks)
        const layer = bh * phi * sep;
        c.fillStyle = M.ow ? oil : water;
        if (M.ow) c.fillRect(bx, by, bw, layer); else c.fillRect(bx, by + bh - layer, bw, layer);
        const rpx = clamp(1.5 + 2.2 * Math.log2(1 + M.d), 1.5, 12);
        const creamZone = bh * clamp(phi / 0.62, 0.2, 1);  // droplets pack to about 62 % in the cream
        for (const d of drops) {
          if (d.k < sep) continue;                          // coalesced into the separate layer
          const frac = d.y;                                 // starting height fraction (0 top)
          let y;
          if (M.ow) { const yTarget = layer + creamZone * frac; y = by + (frac * bh) * (1 - cream) + yTarget * cream; }
          else { const yTarget = bh - layer - creamZone * (1 - frac); y = by + (frac * bh) * (1 - cream) + yTarget * cream; }
          const x = bx + rpx + d.x * (bw - 2 * rpx) + Math.sin(age * 2 + d.j) * 1.5;
          c.beginPath(); c.arc(x, clamp(y, by + rpx, by + bh - rpx), rpx * (1 + 0.8 * sep * d.k), 0, 6.283);
          c.fillStyle = M.ow ? oil : water; c.fill(); c.strokeStyle = C.dark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.18)'; c.lineWidth = 0.8; c.stroke();
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by - 6); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.lineTo(bx + bw, by - 6); c.stroke();
        const tx = bx + bw + 24;
        kit.label(c, 'day ' + age.toFixed(0), tx, by + 10, { size: 14, weight: 700, color: C.text });
        kit.label(c, (M.ow ? 'oil droplets in water (o/w)' : 'water droplets in oil (w/o)'), tx, by + 34, { size: 12.5, color: C.text });
        kit.label(c, 'blend HLB ' + M.hlb.toFixed(1) + ' against required ' + V.oil.toFixed(1), tx, by + 54, { size: 12, color: C.muted });
        kit.label(c, sep > 0.05 ? (M.ow ? 'cracked: free oil on top — cannot be shaken back' : 'broken: free water at the bottom') : cream > 0.3 && s < 0.8 ? 'creamed: droplets crowded ' + (M.ow ? 'at the top' : 'at the bottom') + ' — shake' : 'uniform', tx, by + 78, { size: 12.5, weight: 600, color: sep > 0.05 ? C.bad : cream > 0.3 && s < 0.8 ? C.warn : C.ok });
        // an HLB scale with the blend and the target
        const sx = tx, sw = Math.max(80, W - tx - 20), sy = by + bh - 26;
        if (sw > 100) {
          const X = h => sx + sw * clamp(h, 0, 20) / 20;
          [[0, 3, 'antifoam'], [3, 6, 'w/o'], [7, 9, 'wetting'], [8, 18, 'o/w'], [15, 18, 'solubiliser']].forEach(([a, b, lab], i) => {
            const yy = sy - 14 - (i % 2) * 14; c.fillStyle = kit.hue(40 + i * 60, 0.35); c.fillRect(X(a), yy - 5, X(b) - X(a), 8);
            kit.label(c, lab, (X(a) + X(b)) / 2, yy - 11, { align: 'center', size: 10, color: C.muted });
          });
          c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + sw, sy); c.stroke();
          for (let h = 0; h <= 20; h += 5) kit.label(c, String(h), X(h), sy + 10, { align: 'center', size: 10, color: C.muted });
          kit.arrow(c, X(M.hlb), sy + 24, X(M.hlb), sy + 3, C.accent, 2);
          kit.dot(c, X(V.oil), sy, 5, 'transparent', C.ok);
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ disp-rheogram */
  Hyper.sim('disp-rheogram', {
    title: 'Rheograms in a rotational viscometer',
    blurb: `A sample sits in the gap between a cup and a rotating bob. The instrument sweeps the **shear rate** up to a maximum and back down again and records the **shear stress** needed — the rheogram — and from the two the apparent viscosity, stress ÷ rate. A Newtonian liquid gives a straight line through the origin; a plastic one needs a yield stress before it flows; a pseudoplastic one bends over (thins), a dilatant one bends up (thickens); a thixotropic one breaks its structure down under shear and rebuilds it only slowly at rest, so its down-curve lies below its up-curve. (Pharmacy textbooks often plot the same curves with the axes swapped.)

**Try this**
- Compare Newtonian and pseudoplastic at the same K: at low shear rates the pseudoplastic is far thicker, at high rates far thinner — see the viscosity plot.
- Give a plastic material a yield stress of 100 Pa: at rest it holds its shape like an ointment in its jar.
- Choose thixotropic and make the rebuilding time long, then short: the loop's area — the structure broken and not yet rebuilt — shrinks as recovery speeds up.
- Tick "compare" to see the four time-independent types together, scaled to the same stress at the top shear rate.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const gb = div(box.stage, 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px');
      const g1 = div(gb), g2 = div(gb);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Material', options: [['Newtonian (water, syrup, glycerol)', 'newt'], ['Plastic / Bingham (ointment, paste)', 'plas'], ['Pseudoplastic (cellulose-ether gel)', 'pseu'], ['Dilatant (concentrated deflocculated suspension)', 'dila'], ['Thixotropic (structured suspension, cream)', 'thix']], value: 'pseu' },
        { id: 'K', label: 'Viscosity or consistency K', min: 0.01, max: 100, value: 2, unit: 'Pa·sⁿ', log: true, sig: 2 },
        { id: 'nt', label: 'Flow index n (thinning)', min: 0.2, max: 0.95, step: 0.05, value: 0.5 },
        { id: 'nd', label: 'Flow index n (thickening)', min: 1.05, max: 2, step: 0.05, value: 1.5 },
        { id: 'tau0', label: 'Yield stress', min: 0, max: 200, step: 1, value: 50, unit: 'Pa' },
        { id: 'tr', label: 'Rebuilding time at rest', min: 5, max: 600, value: 60, unit: 's', log: true, sig: 2 },
        { id: 'gmax', label: 'Top shear rate', min: 10, max: 1000, value: 200, unit: '1/s', log: true, sig: 2 },
        { id: 'all', type: 'check', label: 'Compare the four time-independent types', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the sweep again', primary: true }] }
      ], (id) => { modes(); reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rate', 'Shear rate now'], ['tau', 'Shear stress'], ['eta', 'Apparent viscosity'], ['lam', 'Structure left'], ['area', 'Area of the loop']]);
      const pR = kit.plot(g1, { x: { label: 'shear rate (1/s)', min: 0 }, y: { label: 'shear stress (Pa)', min: 0 }, legend: true }, 200);
      const pV = kit.plot(g2, { x: { label: 'shear rate (1/s)', log: true }, y: { label: 'apparent viscosity (Pa·s)', log: true }, legend: true }, 200);
      const TR = 20;                                        // seconds of instrument time up, and again down
      const KB2 = 0.0015;                                   // fraction of structure broken per unit of strain
      let t = 0, lam = 1, up = [], down = [], phase = 0;
      const nOf = () => V.type === 'dila' ? V.nd : V.type === 'newt' || V.type === 'plas' ? 1 : V.nt;
      // stress for a shear rate (and, when thixotropic, a structure level 0..1)
      function stress(type, gd, l) {
        if (type === 'newt') return V.K * gd;
        if (type === 'plas') return V.tau0 + V.K * gd;
        if (type === 'pseu') return V.K * Math.pow(gd, V.nt);
        if (type === 'dila') return V.K * Math.pow(gd, V.nd);
        return V.K * Math.pow(gd, V.nt) * (1 + 4 * l);  // thixotropic: up to five times thicker with full structure
      }
      function modes() {
        const ty = V.type;
        ctl.show('nt', ty === 'pseu' || ty === 'thix'); ctl.show('nd', ty === 'dila'); ctl.show('tau0', ty === 'plas'); ctl.show('tr', ty === 'thix');
        ro.show('lam', ty === 'thix' || ty === 'plas'); ro.show('area', ty === 'thix');
      }
      function reset() { t = 0; lam = 1; up = []; down = []; replot(); }
      const rateAt = tt => tt <= TR ? V.gmax * tt / TR : Math.max(0, V.gmax * (2 - tt / TR));
      function loopArea() {
        // ∫ τ dγ̇ along the up-curve minus along the down-curve (trapezoids), Pa/s
        const integ = pts => { let s = 0; for (let i = 1; i < pts.length; i++) s += (pts[i][0] - pts[i - 1][0]) * (pts[i][1] + pts[i - 1][1]) / 2; return s; };
        return integ(up) + integ(down);                   // the down list runs backwards in rate, so its integral is negative
      }
      function replot() {
        const C = kit.colors(), g = V.gmax, series = [], vis = [];
        const ln = Array.from({ length: 81 }, (_, i) => Math.max(1e-3, g * i / 80));
        if (V.all) {
          const ref = V.K * g;
          const defs = [['Newtonian', x => ref * x / g], ['plastic', x => 0.35 * ref + 0.65 * ref * x / g], ['pseudoplastic (n = 0.4)', x => ref * Math.pow(x / g, 0.4)], ['dilatant (n = 1.6)', x => ref * Math.pow(x / g, 1.6)]];
          for (const [lab, f] of defs) { series.push({ pts: ln.map(x => [x, f(x)]), label: lab }); vis.push({ pts: ln.filter(x => x >= g / 200).map(x => [x, f(x) / x]), label: lab }); }
        } else if (V.type !== 'thix') {
          series.push({ pts: ln.map(x => [x, stress(V.type, x, 0)]), label: 'the flow curve', dash: [5, 4], width: 1.4 });
          vis.push({ pts: ln.filter(x => x >= g / 200).map(x => [x, stress(V.type, x, 0) / x]), label: 'apparent viscosity' });
        }
        if (!V.all) {
          if (up.length > 1) series.push({ pts: up, label: 'up-curve', width: 2.6 });
          if (down.length > 1) series.push({ pts: down, label: 'down-curve', width: 2.6, color: C.series[1] });
          if (V.type === 'thix') {
            if (up.length > 1) vis.push({ pts: up.filter(p => p[0] > g / 200).map(p => [p[0], p[1] / p[0]]), label: 'going up' });
            if (down.length > 1) vis.push({ pts: down.filter(p => p[0] > g / 200).map(p => [p[0], p[1] / p[0]]), label: 'coming down', color: C.series[1] });
          }
        }
        const gd = rateAt(t);
        pR.set({ x: { label: 'shear rate (1/s)', min: 0, max: g }, series, marks: V.all ? [] : [{ x: gd, y: stress(V.type, gd, lam) }] });
        pV.set({ x: { label: 'shear rate (1/s)', log: true, min: g / 200, max: g }, series: vis });
      }
      modes();
      let frame = 0;
      const loop = kit.loop((dt) => {
        // instrument time runs at 2 s per second; the structure is integrated implicitly in fixed sub-steps
        if (dt > 0 && t < 2 * TR) {
          const T = dt * 2, n = 10, h = T / n;
          for (let i = 0; i < n && t < 2 * TR; i++) {
            t = Math.min(2 * TR, t + h);
            const gd = rateAt(t);
            if (V.type === 'thix') lam = (lam + h / V.tr) / (1 + h / V.tr + h * KB2 * gd);
            const p = [gd, stress(V.type, gd, lam)];
            (t <= TR ? up : down).push(p);
          }
          if (++frame % 3 === 0 || t >= 2 * TR) replot();
        }
        const gd = rateAt(t), tau = stress(V.type, gd, lam);
        phase += dt * gd * 0.05;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // cup and bob, seen from the side, with the velocity profile in the gap
        const cx = W * 0.2, cupW = Math.min(W * 0.26, 180), cupH = Hh - 50, top = 30, gap = cupW * 0.14;
        const bobW = cupW - 2 * gap;
        c.fillStyle = kit.hue(28, 0.25 + 0.3 * (V.type === 'thix' ? lam : 0.5)); c.fillRect(cx - cupW / 2, top + 20, cupW, cupH - 20);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - cupW / 2, top + 10); c.lineTo(cx - cupW / 2, top + cupH); c.lineTo(cx + cupW / 2, top + cupH); c.lineTo(cx + cupW / 2, top + 10); c.stroke();
        c.fillStyle = C.bg2; c.fillRect(cx - bobW / 2, top + 30, bobW, cupH - 50);
        c.strokeStyle = C.text; c.strokeRect(cx - bobW / 2, top + 30, bobW, cupH - 50);
        c.beginPath(); c.moveTo(cx, top - 12); c.lineTo(cx, top + 30); c.stroke();
        // stripes on the bob show its rotation
        c.save(); c.beginPath(); c.rect(cx - bobW / 2, top + 30, bobW, cupH - 50); c.clip();
        c.strokeStyle = C.muted; c.lineWidth = 2;
        for (let k = 0; k < 6; k++) { const x = cx - bobW / 2 + ((k / 6 + phase) % 1) * bobW; c.beginPath(); c.moveTo(x, top + 30); c.lineTo(x, top + cupH - 20); c.stroke(); }
        c.restore();
        // velocity arrows in the right-hand gap: fastest at the bob, zero at the cup wall
        const gx0 = cx + bobW / 2, gy = top + cupH * 0.55, alen = Math.min(26, 4 + gd / V.gmax * 26);
        for (let k = 0; k < 3; k++) { const fr = 1 - k / 3; kit.arrow(c, gx0 + gap * (k + 0.5) / 3, gy + 20 * k - 20, gx0 + gap * (k + 0.5) / 3, gy + 20 * k - 20 - alen * fr, C.accent, 1.5); }
        // structure: links of a network, fewer as it breaks down
        if (V.type === 'thix' || V.type === 'plas') {
          const nL = Math.round(18 * (V.type === 'thix' ? lam : gd > 0 ? 0.3 : 1));
          c.strokeStyle = kit.hue(28, 0.9); c.lineWidth = 1.2;
          for (let k = 0; k < nL; k++) { const y = top + 40 + (k * 37 % (cupH - 60)), x = cx - cupW / 2 + 2 + (k % 2) * 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + gap - 6, y + 6); c.stroke(); }
        }
        // a stress dial
        const dx = cx + cupW / 2 + 70, dy = top + cupH * 0.45, R = Math.min(52, Hh * 0.28);
        const tmax = Math.max(1e-9, V.all ? V.K * V.gmax : Math.max(stress(V.type, V.gmax, 1), stress(V.type, V.gmax, 0)) * 1.05);
        if (dx + R < W - 10) {
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.arc(dx, dy, R, Math.PI, 2 * Math.PI); c.stroke();
          const a = Math.PI + Math.PI * clamp(tau / tmax, 0, 1);
          kit.arrow(c, dx, dy, dx + R * 0.9 * Math.cos(a), dy + R * 0.9 * Math.sin(a), C.accent, 2.5);
          kit.label(c, 'stress', dx, dy + 14, { align: 'center', size: 11.5, color: C.muted });
          kit.label(c, kit.fmt(tau, 3) + ' Pa', dx, dy + 30, { align: 'center', size: 13, weight: 700, color: C.text });
          const tx = dx + R + 26;
          if (tx < W - 120) {
            kit.label(c, t < TR ? 'sweeping up' : t < 2 * TR ? 'sweeping down' : 'sweep finished', tx, top + 16, { size: 13, weight: 700, color: C.text });
            kit.label(c, 'shear rate ' + kit.fmt(gd, 3) + ' 1/s', tx, top + 38, { size: 12, color: C.muted });
            kit.label(c, 'viscosity ' + (gd > 1e-6 ? kit.fmt(tau / gd, 3) + ' Pa·s' : (V.type === 'plas' ? 'solid below the yield stress' : '—')), tx, top + 56, { size: 12, color: C.muted });
            if (V.type === 'thix') kit.label(c, 'structure ' + (100 * lam).toFixed(0) + ' %', tx, top + 74, { size: 12, color: C.muted });
          }
        }
        ro.set('rate', kit.fmt(gd, 3) + ' 1/s');
        ro.set('tau', kit.fmt(tau, 3) + ' Pa');
        ro.set('eta', gd > 1e-6 ? kit.fmt(tau / gd, 3) + ' Pa·s' : '—');
        ro.set('lam', V.type === 'thix' ? (100 * lam).toFixed(0) + ' % of the structure at rest' : 'yield stress ' + V.tau0 + ' Pa');
        ro.set('area', V.type === 'thix' && down.length > 1 ? kit.fmt(Math.abs(loopArea()), 3) + ' Pa/s' : '—');
      }, box.stage);
      replot();
      loop.start();
    }
  });

  /* ================================================================ disp-cmc */
  Hyper.sim('disp-cmc', {
    title: 'Surface tension, the CMC and micelles',
    blurb: `Surfactant added to water crowds to the surface first, heads in the water and tails in the air, and the surface tension falls (the Szyszkowski–Langmuir curve). When the surface is full — at the **critical micelle concentration** — extra molecules gather into micelles in the bulk instead, and the surface tension levels off. Salt shields the charged heads of ionic surfactants and lowers their CMC (the Corrin–Harkins relation); non-ionics hardly notice it. A poorly soluble drug dissolves in the micelles' oily cores, so its solubility climbs in a straight line above the CMC. The surfactant data are typical literature values; the drug is hypothetical.

**Try this**
- With sodium lauryl sulfate, sweep the concentration through about 8 mM and watch the surface fill and the first micelles appear.
- Add 100 mM sodium chloride: the CMC of this anionic surfactant falls about fivefold. Then try polysorbate 80.
- Compare polysorbate 80 with sodium lauryl sulfate: its CMC is almost a thousand times lower, so it solubilises at tiny concentrations.
- Read the drug's solubility at 1 %, 2 % and 4 % w/v surfactant: it grows in proportion to the surfactant in micelles.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gb = div(box.stage, 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px');
      const g1 = div(gb), g2 = div(gb);
      const S = {
        sls: { name: 'sodium lauryl sulfate', cmc: 8.2, gc: 38, n: 2, G: 3.2e-6, N: 62, MW: 288.4, ionic: true, msr: 0.02 },
        ctab: { name: 'cetrimonium bromide', cmc: 0.92, gc: 36, n: 2, G: 2.7e-6, N: 90, MW: 364.4, ionic: true, msr: 0.03 },
        ps80: { name: 'polysorbate 80', cmc: 0.012, gc: 42, n: 1, G: 1.66e-6, N: 60, MW: 1310, ionic: false, msr: 0.05 }
      };
      const SW = 0.002, G0 = 72.0, RT = 8.314462618 * 298.15;
      const ctl = kit.controls(box.side, [
        { id: 's', type: 'select', label: 'Surfactant', options: [['sodium lauryl sulfate (anionic)', 'sls'], ['cetrimonium bromide (cationic)', 'ctab'], ['polysorbate 80 (non-ionic)', 'ps80']], value: 'sls' },
        { id: 'c', label: 'Surfactant concentration', min: 0.0001, max: 200, value: 2, unit: 'mM', log: true, sig: 3 },
        { id: 'salt', label: 'Added sodium chloride', min: 0, max: 200, step: 5, value: 0, unit: 'mM' },
        { id: 'drug', type: 'check', label: 'Add a poorly soluble drug', value: true }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cmc', 'Critical micelle concentration'], ['cw', 'Your concentration'], ['g', 'Surface tension'], ['cov', 'Surface covered'], ['mic', 'Micelles'], ['sol', 'Drug solubility']]);
      const pG = kit.plot(g1, { x: { label: 'surfactant (mM)', log: true, min: 1e-4, max: 200 }, y: { label: 'surface tension (mN/m)', min: 25, max: 75 }, legend: true }, 190);
      const pC = kit.plot(g2, { x: { label: 'surfactant (mM)', log: true, min: 1e-4, max: 200 }, y: { label: 'concentration (mM)', log: true, min: 1e-5, max: 300 }, legend: true }, 190);
      // the CMC with salt: log CMC falls with log(counter-ions), Corrin–Harkins slope 0.6 for ionic surfactants
      function cmcOf(s) {
        if (!s.ionic || V.salt <= 0) return s.cmc;
        let x = s.cmc;
        for (let i = 0; i < 60; i++) x = s.cmc * Math.pow((x + V.salt) / s.cmc, -0.6);
        return x;
      }
      let M = null;
      function state(c) {
        const s = S[V.s], cmc = cmcOf(s), nEff = s.ionic ? 1 + cmc / (cmc + V.salt) : 1;
        const a = cmc / (Math.exp((G0 - s.gc) * 1e-3 / (nEff * RT * s.G)) - 1);   // Langmuir constant, so γ(CMC) = γc
        const mono = Math.min(c, cmc);
        const gamma = G0 - nEff * RT * s.G * Math.log(1 + mono / a) * 1e3;
        return { s, cmc, a, mono, mic: Math.max(0, c - cmc), gamma, cov: mono / (mono + a), sol: SW + s.msr * Math.max(0, c - cmc) };
      }
      function update() {
        M = state(V.c);
        const s = M.s, pct = c => c * s.MW * 1e-4;
        ro.set('cmc', kit.fmt(M.cmc, 3) + ' mM (' + kit.fmt(pct(M.cmc), 2) + ' % w/v)');
        ro.set('cw', kit.fmt(V.c, 3) + ' mM = ' + kit.fmt(pct(V.c), 3) + ' % w/v');
        ro.set('g', M.gamma.toFixed(1) + ' mN/m (water 72.0)');
        ro.set('cov', (100 * M.cov).toFixed(0) + ' %');
        ro.set('mic', M.mic > 0 ? kit.fmt(M.mic / s.N * 1000, 3) + ' µM of micelles, about ' + s.N + ' molecules each' : 'none — below the CMC');
        ro.set('sol', V.drug ? kit.fmt(M.sol * 1000, 3) + ' µM (' + (M.sol / SW).toFixed(1) + ' × water)' : '—');
        const xs = Array.from({ length: 121 }, (_, i) => Math.pow(10, -4 + i * (Math.log10(200) + 4) / 120));
        const sts = xs.map(state);
        pG.set({ series: [{ pts: xs.map((x, i) => [x, sts[i].gamma]), label: s.name }], marks: [{ x: V.c, y: M.gamma }], vlines: [{ x: M.cmc, label: 'CMC' }] });
        const ser = [{ pts: xs.map((x, i) => [x, sts[i].mono]), label: 'free molecules' }, { pts: xs.map((x, i) => [x, sts[i].mic]).filter(p => p[1] > 1e-6), label: 'in micelles' }];
        if (V.drug) ser.push({ pts: xs.map((x, i) => [x, sts[i].sol]), label: 'drug dissolved', dash: [5, 4] });
        pC.set({ series: ser, vlines: [{ x: M.cmc, label: 'CMC' }] });
      }
      update();
      const r = rng(3), spots = Array.from({ length: 60 }, () => ({ x: r(), y: r(), a: r() * 6.283, w: r() }));
      const loop = kit.loop((dt, time) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const bx = W * 0.06, bw = Math.min(W * 0.5, 380), sy = 40, by = Hh - 16;
        const head = kit.hue(M.s.ionic ? 350 : 200), tail = C.muted;
        c.fillStyle = kit.hue(205, C.dark ? 0.12 : 0.08); c.fillRect(bx, sy, bw, by - sy);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, sy - 18); c.lineTo(bx, by); c.lineTo(bx + bw, by); c.lineTo(bx + bw, sy - 18); c.stroke();
        c.strokeStyle = kit.hue(205, 0.8); c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx, sy); c.lineTo(bx + bw, sy); c.stroke();
        // molecules at the surface: heads in the water, tails up into the air
        const nS = Math.round(M.cov * Math.floor(bw / 9));
        for (let k = 0; k < nS; k++) {
          const x = bx + 6 + (k + 0.5) * (bw - 12) / Math.max(1, nS) + Math.sin(time * 2 + k) * 0.6;
          c.strokeStyle = tail; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, sy - 1); c.lineTo(x + Math.sin(k) * 2, sy - 14); c.stroke();
          kit.dot(c, x, sy + 2, 3, head);
        }
        // free molecules in the bulk
        const nM = Math.round(14 * M.mono / M.cmc);
        for (let k = 0; k < nM && k < spots.length; k++) {
          const p = spots[k], x = bx + 12 + p.x * (bw - 24) + Math.sin(time * 0.9 + p.a) * 4, y = sy + 24 + p.y * (by - sy - 40) + Math.cos(time * 0.7 + p.a) * 4;
          c.strokeStyle = tail; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 10 * Math.cos(p.a + time * 0.3), y + 10 * Math.sin(p.a + time * 0.3)); c.stroke();
          kit.dot(c, x, y, 2.6, head);
        }
        // micelles: tails in, heads out; a drug molecule in the core
        const nMic = M.mic > 0 ? clamp(Math.round(2 + 4 * Math.log10(1 + M.mic / M.cmc * 3)), 1, 14) : 0;
        for (let k = 0; k < nMic; k++) {
          const p = spots[59 - k], R = 12, x = bx + 24 + p.x * (bw - 48), y = sy + 34 + p.y * (by - sy - 60), rot = time * 0.4 + p.a;
          c.strokeStyle = tail; c.lineWidth = 1.4;
          for (let j = 0; j < 12; j++) { const a = rot + j * Math.PI / 6; c.beginPath(); c.moveTo(x + 3 * Math.cos(a), y + 3 * Math.sin(a)); c.lineTo(x + R * Math.cos(a), y + R * Math.sin(a)); c.stroke(); }
          for (let j = 0; j < 12; j++) { const a = rot + j * Math.PI / 6; kit.dot(c, x + (R + 2.5) * Math.cos(a), y + (R + 2.5) * Math.sin(a), 2.6, head); }
          if (V.drug) kit.dot(c, x, y, 3, kit.hue(130));
        }
        // undissolved drug at the bottom, shrinking as more of it dissolves
        if (V.drug) {
          const left = clamp(1 - Math.log10(M.sol / SW) / 2, 0.05, 1), pw = bw * 0.5 * left;
          c.fillStyle = kit.hue(130, 0.7); c.beginPath(); c.moveTo(bx + bw / 2 - pw / 2, by); c.lineTo(bx + bw / 2, by - 14 * left - 2); c.lineTo(bx + bw / 2 + pw / 2, by); c.fill();
        }
        const tx = bx + bw + 24;
        if (tx < W - 100) {
          kit.label(c, M.gamma.toFixed(1) + ' mN/m', tx, sy + 4, { size: 15, weight: 700, color: C.text });
          kit.label(c, 'surface tension', tx, sy + 24, { size: 12, color: C.muted });
          kit.label(c, V.c < M.cmc ? 'below the CMC: the surface is filling' : 'above the CMC: surface full, micelles forming', tx, sy + 50, { size: 12.5, weight: 600, color: V.c < M.cmc ? C.text : C.ok });
          kit.label(c, 'CMC ' + kit.fmt(M.cmc, 3) + ' mM' + (M.s.ionic && V.salt > 0 ? ' (with ' + V.salt + ' mM NaCl)' : ''), tx, sy + 70, { size: 12, color: C.muted });
          if (V.drug) kit.label(c, 'drug solubility ' + (M.sol / SW).toFixed(1) + ' × its solubility in water', tx, sy + 94, { size: 12, color: kit.hue(130) });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ disp-skin */
  Hyper.sim('disp-skin', {
    title: 'A drug crossing the skin from a patch',
    blurb: `A patch holds a drug at a fixed concentration against the **stratum corneum**. The drug partitions into the skin's lipids (partition coefficient $K$), diffuses across the layer by Fick's second law — solved here step by step across 40 slices — and is carried away by the capillaries below, which act as a sink. At first nothing comes through; the concentration profile fills and straightens, and the cumulative amount bends into a straight line whose slope is the steady flux $J = DKC_v/h$ and whose intercept on the time axis is the **lag time** $h^2/6D$. When the patch comes off, the drug already in the skin keeps flowing for hours.

**Try this**
- Double the thickness: the flux halves and the lag time quadruples.
- Raise the partition coefficient tenfold: the flux rises tenfold, but the lag time does not change.
- Slow the diffusion (10⁻¹¹ cm²/s): in 72 hours steady state is never reached.
- Remove the patch at 24 h and watch the flux decay rather than stop — the skin reservoir.
- Find the patch area that delivers 25 µg/h for the default drug.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const gb = div(box.stage, 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px');
      const g1 = div(gb), g2 = div(gb);
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Diffusion coefficient in the stratum corneum', min: 1e-11, max: 1e-8, value: 1e-10, unit: 'cm²/s', log: true, sig: 2 },
        { id: 'h', label: 'Stratum corneum thickness', min: 5, max: 40, step: 1, value: 15, unit: 'µm' },
        { id: 'K', label: 'Partition coefficient, skin/vehicle', min: 0.01, max: 100, value: 10, log: true, sig: 2 },
        { id: 'Cv', label: 'Drug concentration in the patch', min: 0.1, max: 50, value: 2, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'A', label: 'Patch area', min: 1, max: 40, step: 1, value: 10, unit: 'cm²' },
        { id: 'off', type: 'select', label: 'Patch removed', options: [['never', 0], ['after 24 h', 24], ['after 48 h', 48]], value: 24 },
        { type: 'buttons', items: [{ id: 'go', label: 'Apply a new patch', primary: true }] }
      ], () => reset());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['jss', 'Steady flux J = DKCv/h'], ['kp', 'Permeability coefficient Kp'], ['tl', 'Lag time h²/6D'], ['rate', 'Delivery at steady state'], ['now', 'Now'], ['q', 'Delivered so far']]);
      const pQ = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 72 }, y: { label: 'amount through skin (µg/cm²)', min: 0 }, legend: true }, 190);
      const pJ = kit.plot(g2, { x: { label: 'time (h)', min: 0, max: 72 }, y: { label: 'flux (µg/(cm²·h))', min: 0 }, legend: true }, 190);
      const N = 40, TEND = 72 * 3600, SPEED = 4 * 3600;   // four hours a second
      const Cm = new Float64Array(N + 1), aa = new Float64Array(N), bb = new Float64Array(N), cc = new Float64Array(N), dd = new Float64Array(N);
      let t = 0, Q = 0, J = 0, hq = [], hj = [], nextRec = 0, Jss = 0, tL = 0;
      function statics() {
        Jss = P.fickFlux({ D: V.D, K: V.K, h: V.h * 1e-4, dC: V.Cv * 1000 }) * 3600;     // µg/(cm²·h)
        tL = Math.pow(V.h * 1e-4, 2) / (6 * V.D);                                         // s
        ro.set('jss', kit.fmt(Jss, 3) + ' µg/(cm²·h)');
        ro.set('kp', kit.fmt(V.D * V.K / (V.h * 1e-4) * 3600, 3) + ' cm/h');
        ro.set('tl', fmtT(tL));
        ro.set('rate', kit.fmt(Jss * V.A, 3) + ' µg/h = ' + kit.fmt(Jss * V.A * 24 / 1000, 3) + ' mg/day');
      }
      function reset() { Cm.fill(0); t = 0; Q = 0; J = 0; hq = [[0, 0]]; hj = [[0, 0]]; nextRec = 0; statics(); replot(); }
      // one backward-Euler step of dC/dt = D d²C/dx² over the membrane (Thomas algorithm): stable for any step
      function step(dt) {
        const dx = V.h * 1e-4 / N, r = V.D * dt / (dx * dx), on = !V.off || t < V.off * 3600, C0 = V.K * V.Cv * 1000;
        for (let i = 0; i < N; i++) { aa[i] = -r; bb[i] = 1 + 2 * r; cc[i] = -r; dd[i] = Cm[i]; }
        if (on) { bb[0] = 1; cc[0] = 0; dd[0] = C0; } else { bb[0] = 1 + 2 * r; cc[0] = -2 * r; }   // held by the patch, or sealed after removal
        for (let i = 1; i < N; i++) { const m = aa[i] / bb[i - 1]; bb[i] -= m * cc[i - 1]; dd[i] -= m * dd[i - 1]; }
        Cm[N - 1] = dd[N - 1] / bb[N - 1];
        for (let i = N - 2; i >= 0; i--) Cm[i] = (dd[i] - cc[i] * Cm[i + 1]) / bb[i];
        Cm[N] = 0;                                                                         // the capillaries are a sink
        J = Math.max(0, V.D * (4 * Cm[N - 1] - Cm[N - 2]) / (2 * dx));                      // µg/(cm²·s), second-order gradient
        Q += J * dt; t += dt;
      }
      function replot() {
        const series = [{ pts: hq, label: 'amount through the skin' }];
        if (tL < TEND) series.push({ pts: [[tL / 3600, 0], [72, Jss * (72 - tL / 3600)]], label: 'steady state, J(t − lag)', dash: [5, 4], width: 1.4 });
        const vl = [{ x: Math.min(72, tL / 3600), label: 'lag time' }];
        if (V.off) vl.push({ x: V.off, label: 'patch off' });
        pQ.set({ series, vlines: vl });
        pJ.set({ series: [{ pts: hj, label: 'flux into the blood' }], hlines: [{ y: Jss, label: 'steady flux' }], vlines: V.off ? [{ x: V.off, label: 'patch off' }] : [] });
      }
      reset();
      const r = rng(9), mols = Array.from({ length: 36 }, () => ({ x: r(), y: r(), k: r() }));
      let frame = 0;
      const loop = kit.loop((dt) => {
        if (dt > 0 && t < TEND) {
          const T = Math.min(TEND - t, dt * SPEED), n = 12;
          for (let i = 0; i < n; i++) step(T / n);
          if (t >= nextRec) { hq.push([t / 3600, Q]); hj.push([t / 3600, J * 3600]); nextRec += 900; }
          if (++frame % 4 === 0 || t >= TEND) replot();
        }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, on = !V.off || t < V.off * 3600, C0 = Math.max(1e-12, V.K * V.Cv * 1000);
        const x0 = 16, w = Math.min(W * 0.58, 460), yP = 16, hP = 26, ySC = yP + hP + 6, hSC = Math.max(60, (Hh - ySC) * 0.42), yV = ySC + hSC, hV = Hh - yV - 8;
        // the patch: backing and drug reservoir
        if (on) {
          c.fillStyle = C.muted; c.fillRect(x0, yP, w, 5);
          c.fillStyle = kit.hue(275, 0.25 + 0.4 * clamp(Math.log10(V.Cv * 10) / 2.7, 0, 1)); c.fillRect(x0, yP + 5, w, hP - 5);
          kit.label(c, 'patch: ' + kit.fmt(V.Cv, 2) + ' mg/mL', x0 + 8, yP + 16, { size: 11.5, color: C.text });
        } else kit.label(c, 'patch removed', x0 + 8, yP + 14, { size: 11.5, color: C.muted });
        // stratum corneum: concentration by depth, with corneocytes (bricks) in lipid (mortar)
        for (let i = 0; i < N; i++) { c.fillStyle = kit.hue(275, clamp(0.06 + 0.8 * (Cm[i] + Cm[i + 1]) / (2 * C0), 0, 0.86)); c.fillRect(x0, ySC + hSC * i / N, w, hSC / N + 0.6); }
        const rows = 6, bh = hSC / rows;
        c.fillStyle = C.dark ? 'rgba(40,40,48,.55)' : 'rgba(255,255,255,.55)';
        for (let j = 0; j < rows; j++) { const off = (j % 2) * 26; for (let x = x0 - 26 + off; x < x0 + w; x += 52) { const bx = Math.max(x0, x + 3), bw2 = Math.min(x0 + w, x + 49) - bx; if (bw2 > 2) c.fillRect(bx, ySC + j * bh + 2, bw2, bh - 4); } }
        c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x0, ySC, w, hSC);
        kit.label(c, 'stratum corneum ' + V.h + ' µm', x0 + w + 8, ySC + 10, { size: 11.5, color: C.text });
        // viable epidermis and dermis, with capillaries taking the drug away
        c.fillStyle = kit.hue(10, C.dark ? 0.10 : 0.07); c.fillRect(x0, yV, w, hV);
        for (let k = 0; k < 4; k++) { const cx = x0 + w * (k + 0.5) / 4; c.strokeStyle = kit.hue(0, 0.8); c.lineWidth = 3; c.beginPath(); c.moveTo(cx - 14, yV + hV); c.lineTo(cx - 14, yV + hV * 0.45); c.arc(cx, yV + hV * 0.45, 14, Math.PI, 0); c.lineTo(cx + 14, yV + hV); c.stroke(); }
        const frac = clamp(J * 3600 / Math.max(1e-12, Jss), 0, 1.2), shown = Math.round(mols.length * Math.min(1, frac));
        for (let k = 0; k < shown; k++) { const m = mols[k]; m.y = (m.y + dt * (0.25 + 0.3 * m.k)) % 1; kit.dot(c, x0 + 6 + m.x * (w - 12), yV + 4 + m.y * (hV - 10), 2.2, kit.hue(275)); }
        kit.label(c, 'viable skin and capillaries (sink)', x0 + w + 8, yV + 12, { size: 11.5, color: C.muted });
        // the concentration profile across the layer
        const px = x0 + w + 30, pw = W - px - 16;
        if (pw > 90) {
          const py = ySC + 26, ph = Math.max(40, Hh - py - 26);
          c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + ph); c.lineTo(px + pw, py + ph); c.stroke();
          c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(px + pw * 0.95, py); c.lineTo(px, py + ph); c.stroke(); c.setLineDash([]);
          c.strokeStyle = kit.hue(275); c.lineWidth = 2.2; c.beginPath();
          for (let i = 0; i <= N; i++) { const X = px + pw * 0.95 * Cm[i] / C0, Y = py + ph * i / N; if (i) c.lineTo(X, Y); else c.moveTo(X, Y); }
          c.stroke();
          kit.label(c, 'concentration →', px + pw, py + ph + 12, { align: 'right', size: 10.5, color: C.muted });
          kit.label(c, 'depth ↓ (dashed: steady state)', px + 4, py - 10, { size: 10.5, color: C.muted });
        }
        ro.set('now', (t / 3600).toFixed(1) + ' h: flux ' + kit.fmt(J * 3600, 3) + ' µg/(cm²·h)');
        const tot = Q * V.A;
        ro.set('q', tot >= 1000 ? kit.fmt(tot / 1000, 3) + ' mg' : kit.fmt(tot, 3) + ' µg');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ disp-dlvo */
  Hyper.sim('disp-dlvo', {
    title: 'DLVO: why particles stick or stay apart',
    blurb: `Two particles in water feel a van der Waals attraction, $-Aa/12H$, and — if they are charged — a repulsion from their overlapping double layers, which dies away over the **Debye length**. The sum (DLVO theory) usually has a deep **primary minimum** at contact, an energy **barrier**, and a shallow **secondary minimum** a few nanometres out. The box shows particles in Brownian motion: a collision sticks for good with a probability of about 1/W, where the stability ratio W grows exponentially with the barrier; a deep enough secondary minimum holds particles in loose flocs that can break apart again. The repulsion uses the linear-superposition approximation for spheres with a symmetric salt of the counter-ion's charge; it is a teaching model.

**Try this**
- Raise the sodium chloride from 1 mM to 500 mM: the double layer thins, the barrier vanishes and the particles coagulate.
- Keep 10 mM but switch to calcium chloride, then aluminium chloride: the barrier falls much further. Real multivalent counter-ions also bind to the surface and cut the zeta potential — lower the zeta slider as well, and the particles coagulate at a small fraction of the sodium chloride concentration (the Schulze–Hardy rule).
- At 10 mM sodium chloride, lower the zeta potential below about 15 mV: the barrier collapses.
- Make the particles large (1–2 µm) at about 50 mM: the secondary minimum deepens and loose flocs form — the controlled flocculation used in suspensions.
- Tick the polymer coat at 150 mM (like blood): steric repulsion keeps the particles apart where charge alone cannot.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const gb = div(box.stage, 'padding:4px 10px 10px');
      const ctl = kit.controls(box.side, [
        { id: 'zeta', label: 'Zeta potential (magnitude)', min: 0, max: 70, step: 1, value: 35, unit: 'mV' },
        { id: 'salt', type: 'select', label: 'Salt', options: [['sodium chloride (Na⁺)', 1], ['calcium chloride (Ca²⁺)', 2], ['aluminium chloride (Al³⁺)', 3]], value: 1 },
        { id: 'c', label: 'Salt concentration', min: 0.1, max: 1000, value: 10, unit: 'mM', log: true, sig: 2 },
        { id: 'a', label: 'Particle radius', min: 20, max: 3000, value: 200, unit: 'nm', log: true, sig: 2 },
        { id: 'A', label: 'Hamaker constant', min: 0.3, max: 5, step: 0.1, value: 1, unit: '×10⁻²⁰ J' },
        { id: 'peg', type: 'check', label: 'Polymer coat (steric layer, 5 nm)', value: false },
        { type: 'buttons', items: [{ id: 'mix', label: 'Disperse again', primary: true }] }
      ], (id) => { if (id === 'mix') scatter(); update(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['I', 'Ionic strength'], ['k', 'Debye length'], ['bar', 'Energy barrier'], ['sec', 'Secondary minimum'], ['W', 'Stability ratio W'], ['v', 'Verdict'], ['cl', 'Particles per cluster']]);
      const plot = kit.plot(gb, { x: { label: 'separation between surfaces (nm)', min: 0 }, y: { label: 'interaction energy (kT)' }, legend: true }, 200);
      const T = 298.15, kT = KB * T, EPS = 78.5 * E0;
      let E = null;
      function energy(H) {                                  // H in m, result in kT
        const a = V.a * 1e-9, z = V.salt, I = V.c * 1e-3 * (z === 1 ? 1 : z === 2 ? 3 : 6), kap = Math.sqrt(I) / (0.304e-9);
        const gam = Math.tanh(z * QE * V.zeta * 1e-3 / (4 * kT));
        const VR = 32 * Math.PI * EPS * a * Math.pow(kT / (z * QE), 2) * gam * gam * Math.exp(-kap * H) / kT;
        const VA = -V.A * 1e-20 * a / (12 * H) / kT;
        // a schematic steric wall: grows steeply once the two 5 nm polymer layers overlap
        const d = 5e-9, VS = V.peg ? 400 * Math.pow(Math.max(0, 1 - H / (2 * d)), 2) * (a / 200e-9) : 0;
        return { VR, VA, VS, tot: VR + VA + VS, I, kap };
      }
      function update() {
        const e0 = energy(1e-9), kinv = 1 / e0.kap * 1e9, Hmax = clamp(8 * kinv, 10, 60);
        const Hs = Array.from({ length: 240 }, (_, i) => 0.25 * Math.pow(Hmax / 0.25, i / 239));
        const es = Hs.map(h => energy(h * 1e-9));
        let iMax = 0; for (let i = 1; i < es.length; i++) if (es[i].tot > es[iMax].tot) iMax = i;
        const bar = es[iMax].tot, hasBar = bar > 0 && iMax < es.length - 1;
        let iMin = -1; if (hasBar) for (let i = iMax + 1; i < es.length; i++) if (iMin < 0 || es[i].tot < es[iMin].tot) iMin = i;
        const secDepth = iMin >= 0 ? Math.max(0, -es[iMin].tot) : 0;
        const W = hasBar ? Math.max(1, Math.exp(Math.min(700, bar)) / (2 * e0.kap * V.a * 1e-9)) : 1;
        E = { W, bar: hasBar ? bar : 0, sec: secDepth, pStick: 1 / W, pFloc: secDepth > 1.5 ? 1 - Math.exp(-(secDepth - 1.5)) : 0, pBreak: 0.25 * Math.exp(-secDepth) };
        const clip = v => clamp(v, -60, 250);
        const series = [{ pts: Hs.map((h, i) => [h, clip(es[i].tot)]), label: 'total (DLVO)', width: 2.8 }, { pts: Hs.map((h, i) => [h, clip(es[i].VR + es[i].VS)]), label: V.peg ? 'double layer + steric repulsion' : 'double-layer repulsion', dash: [5, 4], width: 1.4 }, { pts: Hs.map((h, i) => [h, clip(es[i].VA)]), label: 'van der Waals attraction', dash: [2, 3], width: 1.4 }];
        const marks = [];
        if (hasBar) marks.push({ x: Hs[iMax], y: clip(bar), label: 'barrier' });
        if (iMin >= 0 && secDepth > 0.3) marks.push({ x: Hs[iMin], y: clip(-secDepth), label: 'secondary minimum' });
        plot.set({ x: { label: 'separation between surfaces (nm)', min: 0, max: Hmax }, series, marks, hlines: [{ y: 0 }] });
        ro.set('I', kit.fmt(e0.I * 1000, 3) + ' mM');
        ro.set('k', kinv.toFixed(2) + ' nm');
        ro.set('bar', hasBar ? kit.fmt(bar, 3) + ' kT' : 'none');
        ro.set('sec', secDepth > 0.05 ? kit.fmt(secDepth, 2) + ' kT deep' : 'negligible');
        ro.set('W', W > 1e12 ? '> 10¹²' : kit.fmt(W, 2));
        ro.set('v', W < 100 ? 'coagulates: particles stick in the primary minimum' : W < 1e6 ? 'slow coagulation' : secDepth > 2 ? 'loose flocs in the secondary minimum (redispersible)' : 'stable: particles stay apart');
      }
      // Brownian particles that aggregate into clusters
      const NPp = 60, RP = 5, parts = [];
      let rr = rng(21), nextId = NPp, runs = 0;
      function scatter() {
        rr = rng(21 + 7 * runs++);
        parts.length = 0; nextId = NPp;
        for (let i = 0; i < NPp; i++) parts.push({ x: 0.05 + 0.9 * rr(), y: 0.08 + 0.84 * rr(), cl: i, hard: false });
      }
      scatter(); update();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const bx = 12, bw = Math.min(W * 0.62, 520), by = 12, bh = Hh - 24;
        c.fillStyle = kit.hue(205, C.dark ? 0.10 : 0.06); c.fillRect(bx, by, bw, bh);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        if (dt > 0) {
          const step = clamp(2.2 * Math.sqrt(200 / V.a), 0.4, 4);
          // move each cluster as a whole, more slowly the bigger it is
          const groups = new Map();
          for (const p of parts) { if (!groups.has(p.cl)) groups.set(p.cl, []); groups.get(p.cl).push(p); }
          for (const g of groups.values()) {
            const s = step / Math.sqrt(g.length), ddx = gauss(rr) * s / bw, ddy = gauss(rr) * s / bh;
            let fx = ddx, fy = ddy;
            for (const p of g) { if (p.x + fx < 0.01 || p.x + fx > 0.99) fx = -fx * 0.5; if (p.y + fy < 0.02 || p.y + fy > 0.98) fy = -fy * 0.5; }
            for (const p of g) { p.x = clamp(p.x + fx, 0.005, 0.995); p.y = clamp(p.y + fy, 0.01, 0.99); }
            if (g.length > 1 && !g[0].hard && rr() < E.pBreak) { const q = g[Math.floor(rr() * g.length)]; q.cl = nextId++; q.hard = false; q.x = clamp(q.x + 0.02 * (rr() - 0.5), 0.01, 0.99); }
          }
          // collisions between different clusters
          for (let i = 0; i < NPp; i++) for (let j = i + 1; j < NPp; j++) {
            const p = parts[i], q = parts[j];
            if (p.cl === q.cl) continue;
            const dx = (p.x - q.x) * bw, dy = (p.y - q.y) * bh, d2 = dx * dx + dy * dy;
            if (d2 > 4 * RP * RP) continue;
            const u = rr();
            if (u < E.pStick || u < E.pFloc) {
              // a cluster is "hard" once any of its bonds is in the primary minimum; otherwise its bonds can break
              const from = q.cl, to = p.cl, hard = p.hard || q.hard || u < E.pStick;
              for (const o of parts) if (o.cl === from || o.cl === to) { o.cl = to; o.hard = hard; }
            } else {
              const d = Math.sqrt(d2) || 1, push = (2 * RP - d) / 2 + 0.3;
              q.x = clamp(q.x - dx / d * push / bw, 0.005, 0.995); q.y = clamp(q.y - dy / d * push / bh, 0.01, 0.99);
            }
          }
        }
        const sizes = new Map(); for (const p of parts) sizes.set(p.cl, (sizes.get(p.cl) || 0) + 1);
        for (const p of parts) {
          const n = sizes.get(p.cl), col = n === 1 ? kit.hue(205) : !p.hard ? kit.hue(45) : kit.hue(0);
          kit.dot(c, bx + p.x * bw, by + p.y * bh, RP, col, C.dark ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.7)');
        }
        const tx = bx + bw + 20;
        if (tx < W - 120) {
          kit.label(c, 'single particles', tx + 14, by + 14, { size: 12, color: C.text }); kit.dot(c, tx + 4, by + 14, 5, kit.hue(205));
          kit.label(c, 'loose flocs (secondary minimum)', tx + 14, by + 34, { size: 12, color: C.text }); kit.dot(c, tx + 4, by + 34, 5, kit.hue(45));
          kit.label(c, 'coagulated (primary minimum)', tx + 14, by + 54, { size: 12, color: C.text }); kit.dot(c, tx + 4, by + 54, 5, kit.hue(0));
          kit.label(c, 'barrier ' + (E.bar > 0 ? kit.fmt(E.bar, 3) + ' kT' : 'none'), tx, by + 84, { size: 13, weight: 700, color: E.W < 100 ? C.bad : C.ok });
        }
        ro.set('cl', (NPp / sizes.size).toFixed(1));
      }, box.stage);
      loop.start();
    }
  });

  // the inverse of the standard normal distribution, by bisection (quantiles for samples)
  function ninv(p) { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (ncdf(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; }

  /* ================================================================ disp-tonicity */
  Hyper.sim('disp-tonicity', {
    title: 'Red blood cells in solutions',
    blurb: `Fresh red cells are added to the solution you make. Water crosses their membrane freely, so their volume follows the **effective** osmolarity outside — the solutes that cannot get in — by the Boyle–van 't Hoff relation $V/V_0 = b + (1-b)\\,\\text{Osm}_0/\\text{Osm}$ with $b \\approx 0.4$. In hypotonic solutions they swell towards spheres (and look slightly *smaller* across, as their dimple fills) and burst when they pass about 1.5 times their volume, each cell at its own limit: the osmotic fragility curve. In hypertonic solutions they shrink and crenate. Solutes that enter the cells — urea, glycerol, boric acid — pull water out at first, then follow it in: they count in the osmolarity but not in the tonicity. Each change adds fresh blood; the time-lapse is not to scale.

**Try this**
- Lower sodium chloride from 0.9 % to 0.6 %, 0.5 %, 0.45 % and 0.3 %: where does haemolysis begin, reach half, and finish?
- Make 5 % glucose: isotonic. Then 1.8 % urea — about the same osmolarity — and watch the cells shrink, then swell and burst.
- Add 0.9 % sodium chloride to the urea: the cells are now safe, however much urea there is.
- Compare the freezing point of 0.9 % sodium chloride (about −0.53 °C) with that of 1.9 % boric acid, which the eye tolerates but red cells do not.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gb = div(box.stage, 'padding:4px 10px 10px');
      const SOL = {
        nacl: { name: 'sodium chloride', MW: 58.44, n: 2, phi: 0.93, tau: 0 },
        glu: { name: 'glucose (anhydrous)', MW: 180.16, n: 1, phi: 1.0, tau: 0 },
        man: { name: 'mannitol', MW: 182.17, n: 1, phi: 1.0, tau: 0 },
        urea: { name: 'urea', MW: 60.06, n: 1, phi: 1.0, tau: 1.5 },
        gly: { name: 'glycerol', MW: 92.09, n: 1, phi: 1.0, tau: 4 },
        bor: { name: 'boric acid', MW: 61.83, n: 1, phi: 1.0, tau: 2 }
      };
      const ctl = kit.controls(box.side, [
        { id: 'sol', type: 'select', label: 'Solute', options: [['sodium chloride', 'nacl'], ['glucose', 'glu'], ['mannitol', 'man'], ['urea (enters cells)', 'urea'], ['glycerol (enters cells)', 'gly'], ['boric acid (enters red cells)', 'bor']], value: 'nacl' },
        { id: 'pct', label: 'Its concentration', min: 0, max: 5, step: 0.05, value: 0.9, unit: '% w/v' },
        { id: 'nacl', label: 'Plus sodium chloride', min: 0, max: 1, step: 0.05, value: 0, unit: '% w/v' }
      ], () => fresh());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['osm', 'Osmolarity (ideal)'], ['meas', 'Osmolality (measured, about)'], ['fp', 'Freezing point'], ['eff', 'Effective (tonic) osmolarity'], ['tone', 'The solution is'], ['vol', 'Cell volume now'], ['lys', 'Cells burst']]);
      const plot = kit.plot(gb, { x: { label: 'effective osmolarity outside (mOsm/L)', min: 0, max: 600 }, y: { label: '%', min: 0, max: 200 }, legend: true }, 180);
      // fragility: half the cells burst near 0.45 % NaCl (about 143 mOsm/kg), the first near 0.5 %, nearly all by 0.35 %
      const B0 = 0.4, OSM0 = 290, VCRIT = 1.61, VSD = 0.09, NC = 15;
      const crit = Array.from({ length: NC }, (_, i) => VCRIT + VSD * ninv((i + 0.5) / NC));
      const order = Array.from({ length: NC }, (_, i) => i).sort((a, b) => ((a * 7) % NC) - ((b * 7) % NC));
      const volAt = eff => B0 + (1 - B0) * OSM0 / Math.max(5, eff);
      let S = null, tp = 0, vShow = 1;
      const lysed = new Array(NC).fill(false);
      function calc() {
        const s = SOL[V.sol];
        const ideal = P.osmolarity({ gPerL: V.pct * 10, MW: s.MW, n: s.n }), idealNa = P.osmolarity({ gPerL: V.nacl * 10, MW: 58.44, n: 2 });
        const meas = ideal * s.phi + idealNa * 0.93;
        const imp = (s.tau ? 0 : ideal * s.phi) + idealNa * 0.93, perm = s.tau ? ideal : 0;
        return { s, ideal: ideal + idealNa, meas, imp, perm };
      }
      function fresh() {
        S = calc(); tp = 0; vShow = 1; lysed.fill(false);
        ro.set('osm', S.ideal.toFixed(0) + ' mOsm/L');
        ro.set('meas', S.meas.toFixed(0) + ' mOsm/kg');
        ro.set('fp', (-1.86 * S.meas / 1000).toFixed(3) + ' °C');
        ro.set('eff', S.imp.toFixed(0) + ' mOsm/L');
        const cat = x => x < 270 ? -1 : x > 310 ? 1 : 0, oc = cat(S.meas), tc = cat(S.imp);
        ro.set('tone', ['hyposmotic', 'isosmotic', 'hyperosmotic'][oc + 1] + (oc === tc ? ' and ' : ' but ') + ['hypotonic', 'isotonic', 'hypertonic'][tc + 1]);
        const xs = Array.from({ length: 121 }, (_, i) => 5 + i * 595 / 120);
        plot.set({ series: [{ pts: xs.map(x => [x, Math.min(200, 100 * volAt(x))]), label: 'cell volume (% of normal)' }, { pts: xs.map(x => [x, 100 * ncdf((volAt(x) - VCRIT) / VSD)]), label: 'cells burst (%)', fill: true }],
          marks: [{ x: Math.min(600, S.imp), y: Math.min(200, 100 * volAt(S.imp)) }], vlines: [{ x: 290, label: 'plasma' }] });
      }
      fresh();
      const loop = kit.loop((dt) => {
        tp += dt;
        // a solute that enters the cells counts at first, then fades from the effective osmolarity as it equilibrates
        const eff = S.imp + (S.s.tau ? S.perm * Math.exp(-tp / S.s.tau) : 0), target = volAt(eff);
        vShow += (target - vShow) * (1 - Math.exp(-dt / 0.35));
        for (let i = 0; i < NC; i++) if (vShow > crit[i]) lysed[i] = true;
        const nLys = lysed.filter(Boolean).length;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const fx = 10, fw = Math.min(W * 0.62, 520), fy = 10, fh = Hh - 20;
        c.fillStyle = 'hsl(0 70% 50% / ' + (0.03 + 0.25 * nLys / NC) + ')'; c.fillRect(fx, fy, fw, fh);  // released haemoglobin
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(fx, fy, fw, fh);
        const cols = 5, rows = 3, cellW = fw / cols, cellH = fh / rows, scale = Math.min(cellW, cellH) / 11;   // px per µm
        for (let k = 0; k < NC; k++) {
          const i = order[k], cx = fx + cellW * (k % cols + 0.5), cy = fy + cellH * (Math.floor(k / cols) + 0.5);
          if (lysed[i]) {
            c.strokeStyle = 'hsl(0 50% 60% / .45)'; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.arc(cx, cy, 3.3 * scale, 0, 6.283); c.stroke(); c.setLineDash([]);
            continue;
          }
          const v = vShow, sw = clamp((v - 1) / (VCRIT - 1), 0, 1), sh = clamp((1 - v) / 0.4, 0, 1);
          const R = scale * (v >= 1 ? 3.9 - 0.7 * sw : 3.9 * (0.82 + 0.18 * (1 - sh)));
          c.fillStyle = 'hsl(0 72% ' + (C.dark ? 48 : 52) + '%)';
          c.beginPath();
          if (sh > 0.02) { const nS = 12, amp = R * 0.22 * sh; for (let j = 0; j <= 96; j++) { const a = j / 96 * 6.283, rr2 = R + amp * Math.max(0, Math.cos(a * nS)) ** 3; const X = cx + rr2 * Math.cos(a), Y = cy + rr2 * Math.sin(a); if (j) c.lineTo(X, Y); else c.moveTo(X, Y); } }
          else c.arc(cx, cy, R, 0, 6.283);
          c.fill();
          const pal = R * 0.42 * (1 - sw) * (1 - 0.6 * sh);                // the central pallor of the biconcave disc
          if (pal > 0.5) { c.fillStyle = 'hsl(0 70% ' + (C.dark ? 62 : 72) + '% / .8)'; c.beginPath(); c.arc(cx, cy, pal, 0, 6.283); c.fill(); }
        }
        const tx = fx + fw + 20;
        if (tx < W - 110) {
          kit.label(c, (100 * vShow).toFixed(0) + ' % of normal volume', tx, fy + 14, { size: 14, weight: 700, color: C.text });
          kit.label(c, vShow > 1.05 ? 'swelling towards spheres' : vShow < 0.95 ? 'shrinking and crenating' : 'normal biconcave discs', tx, fy + 36, { size: 12, color: C.muted });
          kit.label(c, nLys + ' of ' + NC + ' cells burst', tx, fy + 60, { size: 13, weight: 600, color: nLys ? C.bad : C.ok });
          if (S.s.tau && V.pct > 0) kit.label(c, S.s.name + ' is entering the cells', tx, fy + 84, { size: 12, color: C.warn });
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(tx, fy + fh - 12); c.lineTo(tx + 5 * scale, fy + fh - 12); c.stroke();
          kit.label(c, '5 µm', tx + 5 * scale + 6, fy + fh - 12, { size: 11, color: C.muted });
        }
        ro.set('vol', (100 * vShow).toFixed(0) + ' % of normal');
        ro.set('lys', (100 * nLys / NC).toFixed(0) + ' % (' + nLys + ' of ' + NC + ')');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ disp-psd */
  Hyper.sim('disp-psd', {
    title: 'A particle size distribution, by number and by volume',
    blurb: `A milled powder under the microscope: its particle diameters follow a **log-normal** distribution, set by the median by number and the geometric spread σg. Counted by number, small particles dominate; weighed by volume (mass), a few big particles carry most of the drug — the distribution shifts right by the factor $\\exp(3\\ln^2\\sigma_g)$ (Hatch–Choate). Laser diffraction reports the volume distribution, so its D10, D50 and D90 describe where the mass is. The specific surface area uses the Sauter mean diameter, the one that has the same volume-to-surface ratio as the whole powder.

**Try this**
- Widen the spread from 1.2 to 2.5 with the same number median: the volume median runs away to large sizes.
- Find how much of the mass is held by the largest 5 % of the particles (orange) at σg = 1.8.
- Press "Mill" three times: each halving doubles the surface area per gram and multiplies the particles per milligram by eight.
- Compare the D50 by number and by volume: which one would a laser-diffraction certificate quote?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 220 });
      const gb = div(box.stage, 'padding:4px 10px 10px');
      const ctl = kit.controls(box.side, [
        { id: 'dg', label: 'Median diameter by number', min: 0.2, max: 100, value: 5, unit: 'µm', log: true, sig: 2 },
        { id: 'sg', label: 'Geometric spread σg', min: 1.1, max: 3, step: 0.05, value: 1.8 },
        { id: 'rho', label: 'True density', min: 0.8, max: 3, step: 0.05, value: 1.3, unit: 'g/cm³' },
        { type: 'buttons', items: [{ id: 'mill', label: 'Mill: halve the size', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'mill') ctl.set('dg', Math.max(0.2, V.dg / 2));
        if (id === 'reset') { ctl.set('dg', 5); ctl.set('sg', 1.8); ctl.set('rho', 1.3); }
        update();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vol', 'D10 / D50 / D90 by volume'], ['num', 'D10 / D50 / D90 by number'], ['span', 'Span (by volume)'], ['d32', 'Sauter mean diameter d₃₂'], ['sw', 'Specific surface area'], ['np', 'Particles in 1 mg'], ['big', 'Mass in the largest 5 %']]);
      const plot = kit.plot(gb, { x: { label: 'particle diameter (µm)', log: true }, y: { label: 'share per decade of size (%)', min: 0 }, legend: true }, 190);
      const NS = 220, r = rng(17), zs = Array.from({ length: NS }, (_, i) => ninv((i + 0.5) / NS));
      const pos = zs.map(() => ({ x: r(), y: r() }));
      let D = null;
      function update() {
        const L = Math.log(V.sg), dv = V.dg * Math.exp(3 * L * L), d32 = V.dg * Math.exp(2.5 * L * L), z = 1.2816;
        const vol = V.dg * V.dg * V.dg * Math.PI / 6 * Math.exp(4.5 * L * L);            // mean particle volume, µm³
        D = { L, dv, d32, D10: dv * Math.exp(-z * L), D90: dv * Math.exp(z * L), big: 1 - ncdf(1.6449 - 3 * L) };
        ro.set('vol', [D.D10, dv, D.D90].map(x => kit.fmt(x, 3)).join(' / ') + ' µm');
        ro.set('num', [V.dg * Math.exp(-z * L), V.dg, V.dg * Math.exp(z * L)].map(x => kit.fmt(x, 3)).join(' / ') + ' µm');
        ro.set('span', ((D.D90 - D.D10) / dv).toFixed(2));
        ro.set('d32', kit.fmt(d32, 3) + ' µm');
        ro.set('sw', kit.fmt(6 / (V.rho * d32), 3) + ' m²/g');
        ro.set('np', kit.fmt(1e-3 / (V.rho * vol * 1e-12), 3));
        ro.set('big', (100 * D.big).toFixed(0) + ' %');
        const s10 = Math.log10(V.sg), lo = Math.log10(V.dg) - 4 * s10, hi = Math.log10(dv) + 4 * s10;
        const dens = (x, m) => 100 / (Math.sqrt(2 * Math.PI) * s10) * Math.exp(-Math.pow(Math.log10(x) - Math.log10(m), 2) / (2 * s10 * s10));
        const xs = Array.from({ length: 161 }, (_, i) => Math.pow(10, lo + (hi - lo) * i / 160));
        plot.set({ x: { label: 'particle diameter (µm)', log: true, min: xs[0], max: xs[160] },
          series: [{ pts: xs.map(x => [x, dens(x, V.dg)]), label: 'by number', fill: true }, { pts: xs.map(x => [x, dens(x, dv)]), label: 'by volume (mass)', fill: true }],
          vlines: [{ x: D.D10, label: 'D10' }, { x: dv, label: 'D50' }, { x: D.D90, label: 'D90' }] });
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const fx = 10, fw = Math.min(W * 0.62, 520), fy = 10, fh = Hh - 20, field = 30 * V.dg, pxu = fw / field;   // the field is 30 number-medians wide
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'; c.fillRect(fx, fy, fw, fh);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(fx, fy, fw, fh);
        c.save(); c.beginPath(); c.rect(fx, fy, fw, fh); c.clip();
        const cut = V.dg * Math.exp(1.6449 * D.L);
        for (let i = NS - 1; i >= 0; i--) {
          const d = V.dg * Math.exp(D.L * zs[i]), R = Math.max(0.8, d * pxu / 2);
          kit.dot(c, fx + pos[i].x * fw, fy + pos[i].y * fh, R, d >= cut ? kit.hue(28, 0.85) : kit.hue(205, 0.75));
        }
        c.restore();
        const bar = Math.pow(10, Math.floor(Math.log10(field / 4)));
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(fx + 10, fy + fh - 10); c.lineTo(fx + 10 + bar * pxu, fy + fh - 10); c.stroke();
        kit.label(c, kit.fmt(bar, 2) + ' µm', fx + 14 + bar * pxu, fy + fh - 10, { size: 11, color: C.text, bg: C.bg2 });
        const tx = fx + fw + 20;
        if (tx < W - 110) {
          kit.label(c, NS + ' particles in view', tx, fy + 14, { size: 13, weight: 700, color: C.text });
          kit.label(c, 'the largest 5 % (orange)', tx, fy + 38, { size: 12, color: C.muted });
          kit.label(c, 'hold ' + (100 * D.big).toFixed(0) + ' % of the mass', tx, fy + 56, { size: 13, weight: 600, color: kit.hue(28) });
          kit.label(c, 'surface ' + kit.fmt(6 / (V.rho * D.d32), 3) + ' m²/g', tx, fy + 82, { size: 12, color: C.muted });
        }
      }, box.stage);
      update();
      loop.start();
    }
  });

})();
