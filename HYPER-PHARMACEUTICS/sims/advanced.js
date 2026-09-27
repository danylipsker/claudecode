/* HYPER-PHARMACEUTICS · sims/advanced.js — simulations for Advanced Drug Delivery (prefix adv-).
 *   adv-deposition  aerosol particles travelling down the airways, depositing by impaction,
 *                   sedimentation and diffusion as the aerodynamic diameter changes, with the
 *                   classic deposition curve and its minimum near 0.3 µm
 *   adv-impactor    a cascade impactor: stage cut-offs, the mass on each stage, MMAD, GSD and the
 *                   fine particle fraction below 5 µm
 *   adv-nanosize    nanoparticle size against circulation, renal loss, macrophage capture and what
 *                   reaches a tumour
 *   adv-lnp         a lipid nanoparticle and its four lipids; the ionisable lipid charging up as the
 *                   endosome acidifies, and escape
 *   adv-aggregation protein aggregation against temperature, shaking and surfactant
 *   adv-depot       a depot releasing over weeks, with the plasma level it produces
 *   adv-coldchain   a cold-chain excursion and what it costs in vaccine potency
 *   adv-printgeom   printed tablet geometry: surface-to-volume ratio, dose and release
 * All drugs are hypothetical teaching examples; nothing here is a dosing tool.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared aerosol physics */
  const KB = 1.380649e-23, LAMBDA = 0.068e-6, ETA_AIR = 1.89e-5, RHO0 = 1000, G = 9.80665, TBODY = 310;
  // Cunningham slip correction (matters below about 1 µm)
  function slip(d) {
    const Kn = 2 * LAMBDA / Math.max(d, 1e-10);
    return 1 + Kn * (1.257 + 0.4 * Math.exp(-1.1 / Kn));
  }
  const settling = d => RHO0 * d * d * G * slip(d) / (18 * ETA_AIR);
  const brownian = d => KB * TBODY * slip(d) / (3 * Math.PI * ETA_AIR * Math.max(d, 1e-10));
  const stokesNo = (d, U, D) => RHO0 * d * d * slip(d) * U / (9 * ETA_AIR * Math.max(D, 1e-6));

  /* A deliberately simple three-region lung model: each region is a tube with a diameter, a length
     and an air speed, and each of the three mechanisms gets its own efficiency. It reproduces the
     shape of the measured curves (throat impaction above 5 µm, alveolar deposition at 1–3 µm, the
     minimum near 0.3 µm and the rise again for ultrafine particles) without pretending to be a
     dosimetry model. */
  function deposition(dae, Qlpm, holdSec) {
    const d = Math.max(1e-9, dae), Q = Math.max(1e-5, Qlpm) / 60000;      // m³/s
    const out = { et: 0, tb: 0, al: 0, exhaled: 1 };
    let left = 1;
    // extrathoracic: one narrow, bent tube at the full flow
    const Det = 0.018, Uet = Q / (Math.PI * Det * Det / 4), tet = 0.15 / Math.max(Uet, 1e-6);
    const etImp = 1 - Math.exp(-12 * stokesNo(d, Uet, Det));
    const etDif = 1 - Math.exp(-60 * Math.sqrt(brownian(d) * tet / (Det * Det)));
    out.et = Math.min(0.98, 1 - (1 - etImp) * (1 - etDif));
    left -= out.et;
    // tracheobronchial: wider total cross-section, slower air, about a fifth of a second
    const Dtb = 0.005, Atb = 6e-4, Utb = Q / Atb, ttb = 0.16 / Math.max(Utb, 1e-6);
    const tbImp = 1 - Math.exp(-5 * stokesNo(d, Utb, Dtb));
    const tbSed = 1 - Math.exp(-4 * settling(d) * ttb / (Math.PI * Dtb));
    const tbDif = 1 - Math.exp(-25 * Math.sqrt(brownian(d) * ttb / (Dtb * Dtb)));
    const tbEff = Math.min(0.98, 1 - (1 - tbImp) * (1 - tbSed) * (1 - tbDif));
    out.tb = left * tbEff;
    left -= out.tb;
    // alveolar: tiny ducts, air almost at rest, residence time plus any breath-hold; only part of
    // each breath penetrates past the dead space, so a fraction never reaches the alveoli at all
    const Dal = 0.0005, tal = 1.0 + Math.max(0, holdSec), pen = 0.75;
    const alSed = 1 - Math.exp(-4 * settling(d) * tal / (Math.PI * Dal));
    const alDif = 1 - Math.exp(-5.5 * Math.sqrt(brownian(d) * tal / (Dal * Dal)));
    const alEff = Math.min(0.99, 1 - (1 - alSed) * (1 - alDif));
    out.al = left * pen * alEff;
    out.exhaled = Math.max(0, left - out.al);
    return out;
  }

  /* ---------------------------------------------------------------- 1. deposition in the airways */
  Hyper.sim('adv-deposition', {
    title: 'Where an inhaled particle lands',
    blurb: `Particles of one aerodynamic size are carried down the airways and deposit by the three mechanisms that matter: **impaction** where the air turns sharply, **sedimentation** where it is slow enough for gravity to win, and **Brownian diffusion** for the very smallest. The aerodynamic diameter is computed from the geometric size, the density and the shape factor with \`kit.pharma.aerodynamic\`, and the graph is the whole deposition curve, with your particle marked on it.

**Try this**
- Start at 10 µm and work down to 3 µm: the throat empties and the alveoli fill.
- Keep going to 0.3 µm: almost everything is breathed straight out again — the famous minimum of the deposition curve.
- Below 0.05 µm deposition rises again, now by diffusion, and moves back up towards the airways.
- Add a ten-second breath-hold at 2 µm, then take it away: sedimentation needs time.
- Raise the density from 1.0 to 2.5 g/cm³ at a fixed geometric size, or make the particle porous (0.1 g/cm³): the aerodynamic diameter, not the size you measured, decides everything.
- Switch on hygroscopic growth: a droplet that doubles in the warm, wet airway deposits like a much bigger particle.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Geometric diameter', min: 0.01, max: 20, step: 0.01, value: 4, unit: 'µm', log: true, sig: 3 },
        { id: 'rho', label: 'Particle density', min: 0.05, max: 3, step: 0.05, value: 1.2, unit: 'g/cm³' },
        { id: 'chi', label: 'Shape factor χ', min: 1, max: 1.6, step: 0.05, value: 1 },
        { id: 'Q', type: 'select', label: 'Inhalation', options: [['Slow and deep (20 L/min)', 20], ['Normal (30 L/min)', 30], ['Fast (60 L/min)', 60], ['Very fast (90 L/min)', 90]], value: 30 },
        { id: 'hold', label: 'Breath-hold', min: 0, max: 10, step: 1, value: 5, unit: 's' },
        { id: 'grow', type: 'check', label: 'Hygroscopic growth (×1.6 in the airways)', value: false }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dae', 'Aerodynamic diameter'], ['et', 'Mouth and throat'], ['tb', 'Conducting airways'], ['al', 'Alveolar region'], ['ex', 'Breathed out again'], ['vs', 'Settling speed'], ['stk', 'Stokes number in the throat']]);
      const plot = kit.plot(gb, { x: { label: 'aerodynamic diameter (µm)', log: true, min: 0.01, max: 20 }, y: { label: 'deposited (% of inhaled)', min: 0, max: 100 }, legend: true }, 190);

      const dae = () => {
        const base = P.aerodynamic({ d: V.d, rho: V.rho * 1000, chi: V.chi });
        return Math.max(0.005, base * (V.grow ? 1.6 : 1));
      };
      let dep = deposition(4, 30, 5), parts = [];
      // the path down the airways: [x, y, region] with region 0 = throat, 1 = bronchi, 2 = alveoli
      function path(W, H) {
        return [[W * 0.06, H * 0.18, 0], [W * 0.20, H * 0.18, 0], [W * 0.27, H * 0.34, 0], [W * 0.27, H * 0.52, 0],
                [W * 0.40, H * 0.52, 1], [W * 0.56, H * 0.40, 1], [W * 0.68, H * 0.36, 1],
                [W * 0.80, H * 0.34, 2], [W * 0.93, H * 0.32, 2]];
      }
      function recompute() {
        const x = dae();
        dep = deposition(x, V.Q, V.hold);
        const pts = { et: [], tb: [], al: [], lung: [] };
        for (let i = 0; i <= 80; i++) {
          const s = 0.01 * Math.pow(20 / 0.01, i / 80), r = deposition(s, V.Q, V.hold);
          pts.et.push([s, r.et * 100]); pts.tb.push([s, r.tb * 100]); pts.al.push([s, r.al * 100]);
          pts.lung.push([s, (r.tb + r.al) * 100]);
        }
        plot.set({
          series: [
            { pts: pts.et, label: 'mouth and throat' },
            { pts: pts.tb, label: 'conducting airways' },
            { pts: pts.al, label: 'alveolar' },
            { pts: pts.lung, label: 'total lung', width: 2.8, dash: [6, 4] }
          ],
          vlines: [{ x: x, label: kit.fmt(x, 3) + ' µm' }, { x: 5, label: '5 µm' }]
        });
        ro.set('dae', kit.fmt(x, 3) + ' µm' + (V.grow ? ' (after growth)' : ''));
        ro.set('et', (dep.et * 100).toFixed(1) + ' % — swallowed');
        ro.set('tb', (dep.tb * 100).toFixed(1) + ' %');
        ro.set('al', (dep.al * 100).toFixed(1) + ' %');
        ro.set('ex', (dep.exhaled * 100).toFixed(1) + ' %');
        ro.set('vs', (settling(x * 1e-6) * 1000).toFixed(3) + ' mm/s');
        const Uet = (V.Q / 60000) / (Math.PI * 0.018 * 0.018 / 4);
        ro.set('stk', kit.fmt(stokesNo(x * 1e-6, Uet, 0.018), 2));
        parts = [];
      }
      recompute();

      let emit = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const pp = path(W, H);
        // the airway tube, narrowing as it goes
        c.lineCap = 'round'; c.lineJoin = 'round';
        for (let i = 1; i < pp.length; i++) {
          const reg = pp[i][2];
          c.strokeStyle = C.faint; c.lineWidth = reg === 0 ? 30 : reg === 1 ? 20 : 12;
          c.beginPath(); c.moveTo(pp[i - 1][0], pp[i - 1][1]); c.lineTo(pp[i][0], pp[i][1]); c.stroke();
          c.strokeStyle = C.bg2; c.lineWidth = (reg === 0 ? 30 : reg === 1 ? 20 : 12) - 4;
          c.beginPath(); c.moveTo(pp[i - 1][0], pp[i - 1][1]); c.lineTo(pp[i][0], pp[i][1]); c.stroke();
        }
        // the alveolar sac at the end
        const last = pp[pp.length - 1];
        c.fillStyle = C.bg2; c.strokeStyle = C.faint; c.lineWidth = 2;
        for (const [ax, ay] of [[0, -14], [14, 4], [0, 18], [-12, -2]]) {
          c.beginPath(); c.arc(last[0] + ax, last[1] + ay, 12, 0, 6.283); c.fill(); c.stroke();
        }
        kit.label(c, 'mouth and throat', pp[0][0], H * 0.10, { size: 11.5, color: C.muted });
        kit.label(c, 'conducting airways', W * 0.45, H * 0.66, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'alveoli', W * 0.88, H * 0.62, { size: 11.5, color: C.muted, align: 'center' });

        // particles: born at the mouth, moving along the path, deposited region by region
        emit += dt * 14;
        while (emit >= 1 && parts.length < 90) { emit -= 1; parts.push({ s: 0, seg: 0, fate: null, x: 0, y: 0, age: 0, jit: Math.random() * 6.283 }); }
        const speed = 150;
        const segLen = [];
        for (let i = 1; i < pp.length; i++) segLen.push(Math.hypot(pp[i][0] - pp[i - 1][0], pp[i][1] - pp[i - 1][1]));
        const total = segLen.reduce((a, b) => a + b, 0);
        const region = s => { let acc = 0; for (let i = 0; i < segLen.length; i++) { acc += segLen[i]; if (s <= acc) return pp[i + 1][2]; } return 2; };
        const at = s => {
          let acc = 0;
          for (let i = 0; i < segLen.length; i++) {
            if (s <= acc + segLen[i]) { const f = segLen[i] ? (s - acc) / segLen[i] : 0; return [pp[i][0] + (pp[i + 1][0] - pp[i][0]) * f, pp[i][1] + (pp[i + 1][1] - pp[i][1]) * f]; }
            acc += segLen[i];
          }
          return [pp[pp.length - 1][0], pp[pp.length - 1][1]];
        };
        const pDep = [dep.et, dep.tb / Math.max(1e-6, 1 - dep.et), dep.al / Math.max(1e-6, 1 - dep.et - dep.tb)];
        for (const p of parts) {
          p.age += dt;
          if (p.fate) continue;
          const before = region(p.s);
          p.s += speed * dt;
          const now = region(p.s);
          if (now !== before || (p.s > total && !p.fate)) {
            const r = Math.min(2, before);
            if (Math.random() < Math.min(0.99, pDep[r])) { const [x, y] = at(p.s); p.fate = r; p.x = x + (Math.random() - 0.5) * 12; p.y = y + (Math.random() > 0.5 ? 1 : -1) * (r === 0 ? 13 : r === 1 ? 9 : 6); }
          }
          if (p.s > total + 40 && !p.fate) p.fate = 'out';
        }
        parts = parts.filter(p => p.fate !== 'out' && p.age < 14);
        const cols = [C.bad, C.warn, C.ok];
        for (const p of parts) {
          if (p.fate === null) {
            const [x, y] = at(p.s);
            kit.dot(c, x + Math.sin(p.age * 6 + p.jit) * 2, y + Math.cos(p.age * 5 + p.jit) * 3, 2.6, C.accent);
          } else kit.dot(c, p.x, p.y, 3, cols[p.fate]);
        }
        // a legend of fates
        const items = [['throat ' + (dep.et * 100).toFixed(0) + ' %', C.bad], ['airways ' + (dep.tb * 100).toFixed(0) + ' %', C.warn], ['alveoli ' + (dep.al * 100).toFixed(0) + ' %', C.ok], ['exhaled ' + (dep.exhaled * 100).toFixed(0) + ' %', C.muted]];
        items.forEach(([t, col], i) => { kit.dot(c, 16, H - 58 + i * 17, 4, col); kit.label(c, t, 26, H - 58 + i * 17, { size: 11.5, color: C.text2 }); });
        kit.label(c, kit.fmt(dae(), 3) + ' µm aerodynamic', W - 10, H * 0.08, { align: 'right', size: 13, weight: 700, color: C.text });
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- 2. cascade impactor */
  function erf(x) {
    const s = x < 0 ? -1 : 1; x = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * x);
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return s * y;
  }
  const lognormBelow = (x, mmad, gsd) => {
    const lg = Math.log(Math.max(1.02, gsd));
    return 0.5 * (1 + erf(Math.log(Math.max(1e-6, x) / Math.max(1e-6, mmad)) / (lg * Math.SQRT2)));
  };
  // inverse normal distribution (Acklam's rational approximation), so that a cumulative curve can be
  // read on a log-probability scale — the way an impactor result is worked up in a laboratory
  function probit(p) {
    p = Math.min(1 - 1e-9, Math.max(1e-9, p));
    const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.3577518672690, -30.66479806614716, 2.506628277459239];
    const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
    const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
    const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
    const pl = 0.02425;
    let q, r;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    if (p <= 1 - pl) { q = p - 0.5; r = q * q; return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  Hyper.sim('adv-impactor', {
    title: 'Cascade impactor and the fine particle fraction',
    blurb: `Every inhaler batch is fired into a cascade impactor: a stack of stages whose jets get faster and finer, so each stage collects particles above its own cut-off. The mass found on each plate builds the cumulative curve on the right, from which the **MMAD** (the 50 % point), the **GSD** (the spread) and the **fine particle fraction** below 5 µm are read. Stage cut-offs here are those of a common seven-stage impactor at 60 L/min, scaled with flow.

**Try this**
- Move the MMAD from 6 µm to 2 µm: the mass marches down the stack and the fine particle fraction rises.
- Widen the GSD from 1.4 to 2.5 at a fixed MMAD: the fine fraction changes even though the median has not.
- Raise the flow rate: the cut-offs all shift downwards (roughly as 1/√Q), so the same aerosol reports differently — which is why the test flow is fixed by the product.
- Increase the device and throat retention: it reduces the delivered dose without changing the size distribution at all.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mmad', label: 'MMAD of the aerosol', min: 0.5, max: 12, step: 0.1, value: 3.2, unit: 'µm', log: true, sig: 3 },
        { id: 'gsd', label: 'Geometric standard deviation', min: 1.1, max: 3, step: 0.05, value: 1.7 },
        { id: 'dose', label: 'Metered dose', min: 25, max: 500, step: 5, value: 200, unit: 'µg' },
        { id: 'Q', label: 'Test flow rate', min: 30, max: 100, step: 5, value: 60, unit: 'L/min' },
        { id: 'loss', label: 'Device + throat retention', min: 0, max: 60, step: 1, value: 20, unit: '%' }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['del', 'Delivered dose'], ['fpd', 'Fine particle dose (< 5 µm)'], ['fpf', 'Fine particle fraction'], ['mmadf', 'MMAD read from the stages'], ['gsdf', 'GSD read from the stages'], ['coarse', 'Above 5 µm (swallowed)']]);
      const plot = kit.plot(gb, { x: { label: 'cut-off diameter (µm)', log: true }, y: { label: 'cumulative mass below (%)', min: 0, max: 100 }, legend: true }, 180);
      const REF = [8.06, 4.46, 2.82, 1.66, 0.94, 0.55, 0.34];
      let stages = [], delivered = 0, fpd = 0, fit = { mmad: 0, gsd: 0 };

      function recompute() {
        const k = Math.sqrt(60 / Math.max(5, V.Q));
        const cuts = REF.map(c => c * k);
        delivered = V.dose * (1 - V.loss / 100);
        stages = [];
        let upper = 1e3;
        for (const c of cuts) {
          const m = delivered * (lognormBelow(upper, V.mmad, V.gsd) - lognormBelow(c, V.mmad, V.gsd));
          stages.push({ cut: c, upper, mass: Math.max(0, m) });
          upper = c;
        }
        stages.push({ cut: 0, upper, mass: Math.max(0, delivered * lognormBelow(upper, V.mmad, V.gsd)), moc: true });
        fpd = delivered * lognormBelow(5, V.mmad, V.gsd);
        // cumulative undersize at each cut-off, as a laboratory would build it
        const cum = [];
        let acc = 0;                                         // everything collected below this stage's cut-off
        for (let i = stages.length - 1; i >= 0; i--) {
          if (!stages[i].moc) cum.unshift([stages[i].cut, 100 * acc / Math.max(1e-9, delivered)]);
          acc += stages[i].mass;
        }
        // read the 50 % and 84 % sizes off a log-probability interpolation of the stage data
        const zs = cum.map(([d, p]) => [Math.log(d), probit(p / 100)]);
        const interp = target => {
          for (let i = 1; i < zs.length; i++) {
            const [l1, z1] = zs[i], [l0, z0] = zs[i - 1];
            if ((z0 - target) * (z1 - target) <= 0 && z1 !== z0) return Math.exp(l0 + (target - z0) / (z1 - z0) * (l1 - l0));
          }
          return NaN;
        };
        const d50 = interp(0), d84 = interp(1), d16 = interp(-1);
        fit = { mmad: d50, gsd: Number.isFinite(d84) && Number.isFinite(d16) && d16 > 0 ? Math.sqrt(d84 / d16) : Number.isFinite(d84) && d50 > 0 ? d84 / d50 : NaN };
        plot.set({
          series: [{ pts: cum, label: 'measured on the stages', dots: 4 },
                   { pts: Array.from({ length: 60 }, (_, i) => { const s = 0.2 * Math.pow(30 / 0.2, i / 59); return [s, 100 * lognormBelow(s, V.mmad, V.gsd)]; }), label: 'true distribution', dash: [5, 4] }],
          hlines: [{ y: 50, label: '50 % → MMAD' }], vlines: [{ x: 5, label: '5 µm' }]
        });
        ro.set('del', delivered.toFixed(1) + ' µg of ' + V.dose + ' µg metered');
        ro.set('fpd', fpd.toFixed(1) + ' µg');
        ro.set('fpf', (100 * fpd / Math.max(1e-9, delivered)).toFixed(1) + ' % of the delivered dose');
        ro.set('mmadf', Number.isFinite(fit.mmad) ? fit.mmad.toFixed(2) + ' µm (true ' + V.mmad.toFixed(2) + ')' : 'outside the stage range');
        ro.set('gsdf', Number.isFinite(fit.gsd) ? fit.gsd.toFixed(2) + ' (true ' + V.gsd.toFixed(2) + ')' : '—');
        ro.set('coarse', (delivered - fpd).toFixed(1) + ' µg');
      }
      recompute();

      let phase = 0;
      const loop = kit.loop((dt) => {
        phase += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const n = stages.length, top = 34, bot = H - 16, rows = (bot - top) / n;
        const x0 = W * 0.08, plateW = Math.min(230, W * 0.34);
        kit.label(c, 'throat and device: ' + (V.dose * V.loss / 100).toFixed(0) + ' µg', x0, 14, { size: 12, color: C.muted });
        const maxM = Math.max(1e-6, ...stages.map(s => s.mass));
        stages.forEach((s, i) => {
          const y = top + i * rows + rows / 2;
          c.strokeStyle = C.faint; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(x0, y + rows * 0.42); c.lineTo(x0 + plateW, y + rows * 0.42); c.stroke();
          // the jets of the stage
          c.strokeStyle = C.faint;
          for (let j = 0; j < 5; j++) { const jx = x0 + plateW * (0.15 + j * 0.175); c.beginPath(); c.moveTo(jx, y - rows * 0.42); c.lineTo(jx, y + rows * 0.18); c.stroke(); }
          // the mass collected, as a bar
          const w = plateW * 0.9 * s.mass / maxM;
          c.fillStyle = s.moc || s.cut < 5 ? kit.hue(150, 0.75) : kit.hue(25, 0.75);
          c.fillRect(x0 + plateW * 0.05, y + rows * 0.42 - 9, Math.max(0, w), 9);
          kit.label(c, s.moc ? 'final filter' : 'stage ' + (i + 1) + ': > ' + s.cut.toFixed(2) + ' µm', x0 + plateW + 12, y + rows * 0.2, { size: 11.5, color: C.text2 });
          kit.label(c, s.mass.toFixed(1) + ' µg', x0 + plateW + 12 + Math.min(150, W * 0.22), y + rows * 0.2, { size: 11.5, weight: 700, color: C.text, align: 'left' });
        });
        // aerosol drifting in at the top
        for (let i = 0; i < 18; i++) {
          const t = (phase * 0.45 + i / 18) % 1;
          kit.dot(c, x0 + plateW * (0.1 + 0.8 * ((i * 7) % 18) / 18), 18 + t * (top - 14), 2.2, C.accent);
        }
        kit.label(c, 'fine particle fraction ' + (100 * fpd / Math.max(1e-9, delivered)).toFixed(0) + ' %', W - 10, 16, { align: 'right', size: 13, weight: 700, color: C.ok });
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- 3. nanoparticle size and fate */
  Hyper.sim('adv-nanosize', {
    title: 'Size decides where a nanoparticle goes',
    blurb: `A hypothetical nanocarrier is injected into a vein. Three exits compete for it: the kidney, which filters anything below about 7 nm; the macrophages of liver and spleen, which take up large or uncoated particles; and the leaky vessels of a tumour, which admit particles smaller than their pores. The rate constants are simple, transparent functions of size and surface — the point is the trade-off, not a prediction.

**Try this**
- Start at 5 nm: the particle is gone in minutes, straight into the urine.
- Go to 100 nm with dense PEG: hours in circulation, and the tumour share is as good as it gets — under a per cent of the dose.
- Take the PEG away at the same size: macrophage capture multiplies and circulation collapses.
- Go to 300 nm: liver and spleen dominate again, and the particle can no longer be sterile-filtered through 0.22 µm.
- Switch the vessel pores from a mouse tumour (400–800 nm) to the far tighter human case: the same particle delivers several times less. That gap is the story of the EPR effect.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Particle diameter', min: 3, max: 400, step: 1, value: 100, unit: 'nm', log: true, sig: 3 },
        { id: 'peg', type: 'select', label: 'Surface', options: [['Bare (protein corona forms)', 1], ['PEGylated', 4], ['Dense PEG brush', 8]], value: 4 },
        { id: 'pore', type: 'select', label: 'Tumour vessel pores', options: [['Human, tight (60 nm)', 60], ['Human, leaky (200 nm)', 200], ['Mouse xenograft (500 nm)', 500]], value: 200 }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['half', 'Circulation half-life'], ['ren', 'Lost to the kidney'], ['mps', 'Taken up by liver and spleen'], ['tum', 'Delivered to the tumour'], ['auc', 'Blood exposure (% ID·h)'], ['filt', 'Sterile filtration at 0.22 µm']]);
      const pB = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 48 }, y: { label: 'in blood (% of dose)', min: 0, max: 100 } }, 175);
      const pT = kit.plot(g2, { x: { label: 'time (h)', min: 0, max: 48 }, y: { label: 'in the tumour (% of dose)', min: 0 } }, 175);
      let share = { ren: 0, mps: 0, tum: 0 }, ktot = 1, kt = 0;

      function rates(d, peg, pore) {
        const kRen = 6 / (1 + Math.exp((d - 7) / 1.2));
        const kMps = (0.05 + 0.9 * Math.pow(d / 120, 2)) / peg;
        const kTum = 0.0025 / (1 + Math.pow(d / pore, 3));
        return { kRen, kMps, kTum, tot: kRen + kMps + kTum };
      }
      function recompute() {
        const r = rates(V.d, V.peg, V.pore);
        ktot = Math.max(1e-6, r.tot); kt = r.kTum;
        share = { ren: r.kRen / ktot, mps: r.kMps / ktot, tum: r.kTum / ktot };
        const kOut = 0.012;                                  // slow loss from the tumour
        const blood = [], tum = [];
        for (let i = 0; i <= 96; i++) {
          const t = i * 0.5;
          blood.push([t, 100 * Math.exp(-ktot * t)]);
          const a = Math.abs(ktot - kOut) < 1e-6 ? 100 * kt * t * Math.exp(-ktot * t)
            : 100 * kt / (ktot - kOut) * (Math.exp(-kOut * t) - Math.exp(-ktot * t));
          tum.push([t, Math.max(0, a)]);
        }
        const ref = rates(100, 4, V.pore), refB = [];
        for (let i = 0; i <= 96; i++) refB.push([i * 0.5, 100 * Math.exp(-ref.tot * i * 0.5)]);
        pB.set({ series: [{ pts: blood, label: kit.fmt(V.d, 3) + ' nm' }, { pts: refB, label: '100 nm, PEGylated', dash: [5, 4] }], legend: true });
        pT.set({ series: [{ pts: tum, label: 'tumour' }] });
        const half = Math.LN2 / ktot;
        ro.set('half', half < 1 ? (half * 60).toFixed(0) + ' min' : half.toFixed(1) + ' h');
        ro.set('ren', (share.ren * 100).toFixed(1) + ' % of the dose');
        ro.set('mps', (share.mps * 100).toFixed(1) + ' % of the dose');
        ro.set('tum', (share.tum * 100).toFixed(2) + ' % of the dose');
        ro.set('auc', (100 / ktot).toFixed(0));
        ro.set('filt', V.d < 200 ? 'yes — below 200 nm' : 'no — must be made aseptically end to end');
      }
      recompute();

      let parts = [], emit = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const vy = H * 0.45, vh = Math.max(26, H * 0.16);
        // the vessel
        c.fillStyle = kit.hue(0, 0.10); c.fillRect(0, vy - vh / 2, W, vh);
        c.strokeStyle = C.faint; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(0, vy - vh / 2); c.lineTo(W, vy - vh / 2); c.moveTo(0, vy + vh / 2); c.lineTo(W, vy + vh / 2); c.stroke();
        // kidney slit above, tumour below, macrophage in the middle
        const xK = W * 0.27, xM = W * 0.54, xT = W * 0.80;
        c.strokeStyle = C.accent; c.lineWidth = 2;
        c.beginPath(); c.moveTo(xK - 9, vy - vh / 2); c.lineTo(xK - 9, vy - vh / 2 - 16); c.moveTo(xK + 9, vy - vh / 2); c.lineTo(xK + 9, vy - vh / 2 - 16); c.stroke();
        kit.label(c, 'kidney filter (~7 nm)', xK, vy - vh / 2 - 26, { align: 'center', size: 11.5, color: C.muted });
        c.fillStyle = kit.hue(275, 0.35); c.beginPath(); c.arc(xM, vy + vh / 2 + 22, 18, 0, 6.283); c.fill();
        kit.label(c, 'macrophage', xM, vy + vh / 2 + 48, { align: 'center', size: 11.5, color: C.muted });
        c.strokeStyle = C.ok; c.lineWidth = 2;
        for (const off of [-14, 0, 14]) { c.beginPath(); c.moveTo(xT + off - 4, vy + vh / 2); c.lineTo(xT + off - 4, vy + vh / 2 + 10); c.stroke(); }
        kit.label(c, 'tumour vessel pores (' + V.pore + ' nm)', xT, vy + vh / 2 + 26, { align: 'center', size: 11.5, color: C.muted });

        emit += dt * 10;
        while (emit >= 1 && parts.length < 70) {
          emit -= 1;
          const u = Math.random();
          const fate = u < share.ren ? 'ren' : u < share.ren + share.mps ? 'mps' : u < share.ren + share.mps + share.tum ? 'tum' : 'blood';
          parts.push({ x: -10, y: vy + (Math.random() - 0.5) * (vh - 10), fate, out: 0, age: 0 });
        }
        const rad = Math.max(2, Math.min(9, 2 + 6 * Math.log10(Math.max(3, V.d)) / 2.6));
        for (const p of parts) {
          p.age += dt;
          p.x += 70 * dt;
          const gate = p.fate === 'ren' ? xK : p.fate === 'mps' ? xM : p.fate === 'tum' ? xT : 1e9;
          if (p.x > gate && p.fate !== 'blood') { p.out += dt * 45; p.x = gate; }
          const dir = p.fate === 'ren' ? -1 : 1;
          const col = p.fate === 'ren' ? C.accent : p.fate === 'mps' ? kit.hue(275) : p.fate === 'tum' ? C.ok : C.text2;
          kit.dot(c, p.x, p.y + dir * p.out, rad, col);
        }
        parts = parts.filter(p => p.x < W + 20 && p.out < 70);
        kit.label(c, kit.fmt(V.d, 3) + ' nm  ·  half-life ' + (Math.LN2 / ktot < 1 ? (Math.LN2 / ktot * 60).toFixed(0) + ' min' : (Math.LN2 / ktot).toFixed(1) + ' h'), 10, 16, { size: 13, weight: 700, color: C.text });
        kit.label(c, 'to the tumour: ' + (share.tum * 100).toFixed(2) + ' % of the dose', W - 10, 16, { align: 'right', size: 12.5, weight: 700, color: C.ok });
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- 4. lipid nanoparticle */
  Hyper.sim('adv-lnp', {
    title: 'A lipid nanoparticle and its pH switch',
    blurb: `The four lipids of an RNA particle, and the trick that makes it work: the ionisable lipid is almost uncharged in blood and charges up as the endosome acidifies. The cycle runs continuously — binding, uptake, acidification, and then either escape into the cytosol or a dead end in the lysosome.

**Try this**
- Set the apparent pKa to 6.4 and watch the charge climb as the pH falls from 7.4 to 5.0; then set it to 8.0: the particle is now cationic in blood, which in a real body means rapid clearance and toxicity.
- Set it to 5.0 instead: the particle stays neutral even in the late endosome, and never escapes.
- Raise the PEG–lipid from 1.5 to 5 mole per cent: the particles get smaller but uptake falls.
- Change the N/P ratio and watch the encapsulation estimate: too little ionisable lipid and the RNA is not held.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'pKa', label: 'Apparent pKa of the ionisable lipid', min: 4.5, max: 8.5, step: 0.05, value: 6.4 },
        { id: 'floor', label: 'Late endosomal pH', min: 4.5, max: 6.5, step: 0.1, value: 5 },
        { id: 'peg', label: 'PEG–lipid', min: 0.5, max: 5, step: 0.1, value: 1.5, unit: 'mol %' },
        { id: 'np', label: 'N/P ratio', min: 1, max: 12, step: 0.5, value: 6 }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f74', 'Charged at pH 7.4 (blood)'], ['ffl', 'Charged in the late endosome'], ['size', 'Particle size (from the PEG–lipid)'], ['enc', 'RNA encapsulation'], ['copies', 'mRNA copies per particle'], ['verdict', 'Outcome']]);
      const plot = kit.plot(gb, { x: { label: 'pH', min: 4, max: 9 }, y: { label: 'fraction of the lipid protonated', min: 0, max: 1 }, legend: true }, 165);
      const frac = (pH, pKa) => 1 / (1 + Math.pow(10, pH - pKa));
      let size = 80, esc = false, enc = 0.9;

      function recompute() {
        size = 45 + 60 / Math.max(0.3, V.peg);                        // more PEG-lipid, smaller particles
        enc = Math.min(0.98, 1 - Math.exp(-0.55 * V.np));             // more ionisable lipid, tighter RNA binding
        const fFloor = frac(V.floor, V.pKa), f74 = frac(7.4, V.pKa);
        esc = fFloor > 0.5 && f74 < 0.25;
        const mk = pKa => Array.from({ length: 101 }, (_, i) => { const pH = 4 + i * 0.05; return [pH, frac(pH, pKa)]; });
        plot.set({
          series: [{ pts: mk(V.pKa), label: 'pKa ' + V.pKa.toFixed(2) }, { pts: mk(6.4), label: 'pKa 6.4 (typical)', dash: [5, 4] }],
          vlines: [{ x: 7.4, label: 'blood' }, { x: V.floor, label: 'endosome' }], hlines: [{ y: 0.5, label: 'half charged' }]
        });
        const vol = Math.PI / 6 * Math.pow(size * 1e-9, 3);            // m³
        const copies = 6.022e23 * vol * 1000 * 0.05 / 1300;            // 5 % RNA by mass, 1.3e6 g/mol
        ro.set('f74', (f74 * 100).toFixed(1) + ' %' + (f74 > 0.25 ? ' — cationic in blood: cleared fast' : ''));
        ro.set('ffl', (fFloor * 100).toFixed(1) + ' %');
        ro.set('size', size.toFixed(0) + ' nm');
        ro.set('enc', (enc * 100).toFixed(0) + ' %');
        ro.set('copies', copies.toFixed(1));
        ro.set('verdict', esc ? 'neutral outside, charged inside — escape' : f74 > 0.25 ? 'charged in blood — no circulation' : 'never charges enough — trapped in the lysosome');
      }
      recompute();

      let t = 0;
      const loop = kit.loop((dt) => {
        t = (t + dt * 0.5) % 1;                                        // one endocytosis cycle every 2 s of stage time
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const stageN = t < 0.2 ? 0 : t < 0.45 ? 1 : t < 0.8 ? 2 : 3;
        const pH = stageN <= 1 ? 7.4 : 7.4 - (7.4 - V.floor) * Math.min(1, (t - 0.45) / 0.35);
        const f = frac(pH, V.pKa);
        // --- left: the particle itself, in cross-section
        const cx = W * 0.26, cy = H * 0.52, R = Math.min(H * 0.34, W * 0.2);
        const core = kit.hue(275, 0.18);
        c.fillStyle = core; c.beginPath(); c.arc(cx, cy, R, 0, 6.283); c.fill();
        // RNA strands in the core
        c.strokeStyle = C.series[3]; c.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const a = i * 1.6 + 0.4;
          c.beginPath();
          for (let s = 0; s <= 12; s++) {
            const rr = R * 0.62 * (0.35 + 0.5 * Math.sin(s / 3 + i));
            const x = cx + Math.cos(a + s * 0.22) * rr, y = cy + Math.sin(a + s * 0.22) * rr;
            s ? c.lineTo(x, y) : c.moveTo(x, y);
          }
          c.stroke();
        }
        // the four lipids around the rim
        const nL = 30;
        for (let i = 0; i < nL; i++) {
          const a = i / nL * 6.283, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
          const kind = i % 10 === 0 ? 3 : i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 0;    // PEG, phospholipid, cholesterol, ionisable
          const col = kind === 3 ? C.series[4] : kind === 1 ? C.series[1] : kind === 2 ? C.series[2] : C.series[0];
          c.strokeStyle = col; c.lineWidth = 2.4;
          c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 9, y + Math.sin(a) * 9); c.stroke();
          if (kind === 3) {                                            // PEG chain
            c.strokeStyle = C.faint; c.lineWidth = 1.4;
            c.beginPath();
            for (let s = 0; s <= 8; s++) c.lineTo(x + Math.cos(a) * (9 + s * 2) + Math.sin(a) * Math.sin(s) * 3, y + Math.sin(a) * (9 + s * 2) - Math.cos(a) * Math.sin(s) * 3);
            c.stroke();
          }
          if (kind === 0 && Math.random() < f) kit.label(c, '+', x + Math.cos(a) * 15, y + Math.sin(a) * 15, { size: 12, weight: 700, color: C.bad, align: 'center' });
        }
        const key = [['ionisable lipid', C.series[0]], ['phospholipid', C.series[1]], ['cholesterol', C.series[2]], ['PEG–lipid', C.series[4]], ['mRNA', C.series[3]]];
        key.forEach(([txt, col], i) => { c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(10, H - 84 + i * 16); c.lineTo(24, H - 84 + i * 16); c.stroke(); kit.label(c, txt, 30, H - 84 + i * 16, { size: 11, color: C.text2 }); });

        // --- right: the endosome journey
        const bx = W * 0.56, bw = W * 0.4, by = H * 0.18, bh = H * 0.6;
        c.strokeStyle = C.faint; c.lineWidth = 1.5; c.strokeRect(bx, by, bw, bh);
        kit.label(c, 'inside a cell', bx + bw / 2, by - 12, { align: 'center', size: 12, color: C.muted });
        const labels = ['binding at the membrane', 'taken in by endocytosis', 'the endosome acidifies', esc ? 'escape into the cytosol' : 'on to the lysosome'];
        const px = bx + bw * (0.18 + 0.22 * stageN), py = by + bh * (stageN === 3 && esc ? 0.78 : 0.3 + 0.16 * stageN);
        if (stageN >= 1) { c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.arc(px, py, 22, 0, 6.283); c.stroke(); }
        c.fillStyle = kit.hue(275, 0.45); c.beginPath(); c.arc(px, py, 11, 0, 6.283); c.fill();
        if (stageN === 3 && esc) {
          c.strokeStyle = C.series[3]; c.lineWidth = 2;
          for (let i = 0; i < 5; i++) { const a = i * 1.25; c.beginPath(); c.moveTo(px, py); c.lineTo(px + Math.cos(a) * 28, py + Math.sin(a) * 20); c.stroke(); }
        }
        // a pH scale
        const sx = bx + bw - 26, sy0 = by + 16, sy1 = by + bh - 16;
        c.strokeStyle = C.faint; c.lineWidth = 8; c.lineCap = 'round';
        c.beginPath(); c.moveTo(sx, sy0); c.lineTo(sx, sy1); c.stroke(); c.lineCap = 'butt';
        const fy = sy0 + (sy1 - sy0) * (7.5 - pH) / 3.2;
        kit.dot(c, sx, Math.max(sy0, Math.min(sy1, fy)), 6, pH > 6.5 ? C.ok : C.bad);
        kit.label(c, 'pH ' + pH.toFixed(1), sx - 10, Math.max(sy0, Math.min(sy1, fy)), { align: 'right', size: 12, weight: 700, color: C.text });
        kit.label(c, labels[stageN], bx + 10, by + bh - 14, { size: 12, weight: 600, color: C.text2 });
        // the charge bar
        const cbx = bx + 10, cby = by + 12, cbw = bw * 0.5;
        c.fillStyle = C.faint; c.fillRect(cbx, cby, cbw, 10);
        c.fillStyle = f > 0.5 ? C.bad : C.accent; c.fillRect(cbx, cby, cbw * f, 10);
        kit.label(c, (f * 100).toFixed(0) + ' % charged', cbx + cbw + 8, cby + 5, { size: 11.5, color: C.text2 });
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- 5. protein aggregation */
  Hyper.sim('adv-aggregation', {
    title: 'What makes a protein aggregate',
    blurb: `A hypothetical antibody solution kept for two years. Two routes destroy monomer: the **thermal** route, which follows an Arrhenius law with a large activation energy, and the **interfacial** route, in which shaking spreads protein on air–water surfaces where it unfolds and comes back as aggregate. A little polysorbate occupies those surfaces instead. The vial on the left shows folded monomer, unfolded molecules at the interface, and the clumps they become.

**Try this**
- At 5 °C without shaking, almost nothing happens in two years — the design case.
- Move to 25 °C, then 40 °C: the thermal route takes over, and an accelerated study at 40 °C says very little about a refrigerator.
- Switch shaking to "transport" with no polysorbate: interfacial aggregation alone can fail the product in weeks.
- Add 0.02 % polysorbate and the same shaking becomes almost harmless — the single most valuable excipient in the vial.
- Raise the concentration to 150 mg/mL: everything gets faster, which is the price of a subcutaneous dose.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Storage temperature', min: 2, max: 45, step: 1, value: 5, unit: '°C' },
        { id: 'shake', type: 'select', label: 'Handling', options: [['Still, upright', 0], ['Transport vibration', 0.03], ['Vigorous shaking', 0.25]], value: 0 },
        { id: 'ps', label: 'Polysorbate', min: 0, max: 0.1, step: 0.005, value: 0.02, unit: '% w/v' },
        { id: 'conc', label: 'Protein concentration', min: 10, max: 180, step: 5, value: 50, unit: 'mg/mL' },
        { id: 'Ea', label: 'Activation energy of the thermal route', min: 60, max: 200, step: 5, value: 120, unit: 'kJ/mol' }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Monomer loss rate'], ['m6', 'Monomer after 6 months'], ['m24', 'Monomer after 24 months'], ['spec', 'Time to the 95 % monomer limit'], ['part', 'Subvisible particles (illustrative)'], ['split', 'Thermal : interfacial']]);
      const plot = kit.plot(gb, { x: { label: 'time (months)', min: 0, max: 24 }, y: { label: 'monomer (% of protein)', min: 80, max: 100.5 }, legend: true }, 175);
      const R = 8.314462618;
      let kTot = 0, kTh = 0, kIn = 0;

      function rates(TC, shake, ps, conc) {
        const kRef = 0.00065;                                        // per month at 5 °C, a well-behaved antibody
        const th = kRef * Math.exp(V.Ea * 1000 / R * (1 / 278.15 - 1 / (TC + 273.15)));
        const prot = 1 / (1 + ps / 0.002);                           // surfactant occupies the interface
        const inf = shake * prot * 4.3;                              // per month
        const cf = Math.sqrt(Math.max(10, conc) / 50);
        return { th: th * cf, inf: inf * cf };
      }
      function recompute() {
        const r = rates(V.T, V.shake, V.ps, V.conc);
        kTh = r.th; kIn = r.inf; kTot = kTh + kIn;
        const mk = k => Array.from({ length: 97 }, (_, i) => { const t = i / 4; return [t, 100 * Math.exp(-k * t)]; });
        const ref = rates(5, 0, V.ps, V.conc);
        plot.set({
          series: [{ pts: mk(kTot), label: 'your conditions' }, { pts: mk(ref.th + ref.inf), label: '5 °C, still', dash: [5, 4] }],
          hlines: [{ y: 95, label: '95 % specification' }]
        });
        const t95 = kTot > 0 ? Math.log(1 / 0.95) / kTot : Infinity;
        const m24 = 100 * Math.exp(-kTot * 24), agg = 100 - m24;
        ro.set('k', kit.fmt(kTot, 3) + ' per month');
        ro.set('m6', (100 * Math.exp(-kTot * 6)).toFixed(2) + ' %');
        ro.set('m24', m24.toFixed(2) + ' %');
        ro.set('spec', !Number.isFinite(t95) ? 'far beyond the shelf life' : t95 > 24 ? 'beyond 24 months' : t95 >= 1 ? t95.toFixed(1) + ' months' : (t95 * 30.4).toFixed(0) + ' days');
        ro.set('part', kit.fmt(Math.max(0, agg) * 4000 * V.conc / 50, 2) + ' per mL above 2 µm');
        ro.set('split', kTot > 0 ? (100 * kTh / kTot).toFixed(0) + ' % : ' + (100 * kIn / kTot).toFixed(0) + ' %' : '—');
      }
      recompute();

      let mols = [], t = 0;
      const loop = kit.loop((dt) => {
        t = (t + dt * 1.2) % 24;                                      // two years in twenty seconds
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const vx = W * 0.08, vw = Math.min(150, W * 0.2), vy = H * 0.12, vh = H * 0.76;
        const slosh = V.shake ? Math.sin(t * 9) * (V.shake > 0.1 ? 7 : 2.5) : 0;
        const surf = vy + vh * 0.22 + slosh;
        // the vial
        c.fillStyle = kit.hue(200, 0.10); c.fillRect(vx, surf, vw, vy + vh - surf);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(vx, vy, vw, vh);
        c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(vx, surf); c.lineTo(vx + vw, surf); c.stroke();
        kit.label(c, 'air', vx + vw / 2, vy + 14, { align: 'center', size: 11, color: C.muted });
        // surfactant at the interface
        if (V.ps > 0.001) {
          const n = Math.round(3 + V.ps / 0.1 * 14);
          for (let i = 0; i < n; i++) { const x = vx + 6 + (vw - 12) * (i + 0.5) / n; kit.dot(c, x, surf, 3, C.series[4]); c.strokeStyle = C.series[4]; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x, surf + 2); c.lineTo(x, surf + 9); c.stroke(); }
        }
        // molecules: folded, adsorbed at the interface, or aggregated
        if (!mols.length) mols = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), st: 0, ph: Math.random() * 6.283, r: 0 }));
        const fracAgg = 1 - Math.exp(-kTot * t);
        let want = Math.round(fracAgg * mols.length);
        mols.forEach((m, i) => { m.st = i < want ? (kIn > kTh && i % 3 === 0 ? 2 : 1) : 0; });
        for (const m of mols) {
          const x = vx + 8 + m.x * (vw - 16) + Math.sin(t * 4 + m.ph) * 2 + slosh * 0.4;
          const y = m.st === 2 ? surf + 6 : surf + 10 + m.y * (vy + vh - surf - 18);
          if (m.st === 0) kit.dot(c, x, y, 3.4, C.ok);
          else if (m.st === 2) { c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); for (let s = 0; s < 5; s++) c.lineTo(x - 5 + s * 2.5, y + (s % 2 ? 3 : -3)); c.stroke(); }
          else { c.fillStyle = C.bad; for (const [ox, oy] of [[0, 0], [4, 2], [-3, 3], [2, -4]]) { c.beginPath(); c.arc(x + ox, y + oy, 2.8, 0, 6.283); c.fill(); } }
        }
        // read-out panel
        const tx = vx + vw + 26, mono = 100 * Math.exp(-kTot * t);
        kit.label(c, 'after ' + t.toFixed(1) + ' months at ' + V.T + ' °C', tx, vy + 16, { size: 13, weight: 700, color: C.text });
        kit.label(c, 'monomer ' + mono.toFixed(2) + ' %', tx, vy + 38, { size: 13, weight: 700, color: mono >= 95 ? C.ok : C.bad });
        kit.label(c, mono >= 95 ? 'within specification' : 'below the 95 % monomer limit', tx, vy + 58, { size: 12, color: C.muted });
        const bw = Math.max(60, Math.min(260, W - tx - 20));
        c.fillStyle = C.faint; c.fillRect(tx, vy + 76, bw, 12);
        c.fillStyle = C.ok; c.fillRect(tx, vy + 76, bw * mono / 100, 12);
        c.fillStyle = C.bad; c.fillRect(tx + bw * mono / 100, vy + 76, bw * (100 - mono) / 100, 12);
        kit.label(c, 'monomer', tx, vy + 102, { size: 11, color: C.ok });
        kit.label(c, 'aggregate', tx + bw, vy + 102, { size: 11, color: C.bad, align: 'right' });
        const key = [['folded monomer', C.ok], ['unfolded at the interface', C.warn], ['aggregate', C.bad], ['polysorbate', C.series[4]]];
        key.forEach(([txt, col], i) => { kit.dot(c, tx + 4, vy + 130 + i * 17, 4, col); kit.label(c, txt, tx + 14, vy + 130 + i * 17, { size: 11.5, color: C.text2 }); });
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- 6. a depot and its plasma level */
  Hyper.sim('adv-depot', {
    title: 'A depot releasing over weeks',
    blurb: `A hypothetical long-acting injection. Choose how the depot releases — a reservoir implant at a constant rate, a matrix following root-time, or microspheres with a burst and then erosion — and watch the plasma level it produces. The drug itself has a half-life of hours, but the curve you see is governed by the release: **flip-flop kinetics**.

**Try this**
- Compare the three release types at the same load: the burst of a microsphere formulation is a dose taken from later weeks.
- Give repeat injections every 4 weeks and watch accumulation: steady state takes four or five *release* half-lives, not four elimination half-lives.
- Halve the release rate and double the duration: the same total drug gives half the plasma level for twice as long.
- Raise the clearance (a faster metaboliser) and the whole curve drops in proportion — Css = R/CL.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Depot type', options: [['Reservoir implant (zero order)', 'zero'], ['Matrix (root time)', 'higuchi'], ['Microspheres (burst then erosion)', 'micro']], value: 'zero' },
        { id: 'load', label: 'Drug in one depot', min: 20, max: 600, step: 10, value: 150, unit: 'mg' },
        { id: 'dur', label: 'Intended duration', min: 7, max: 180, step: 1, value: 84, unit: 'day' },
        { id: 'CL', label: 'Clearance', min: 5, max: 200, step: 5, value: 30, unit: 'L/day' },
        { id: 'Vd', label: 'Volume of distribution', min: 10, max: 400, step: 10, value: 100, unit: 'L' },
        { id: 'burst', label: 'Initial burst (microspheres)', min: 0, max: 30, step: 1, value: 12, unit: '%' },
        { id: 'rep', label: 'Injections (every intended duration)', min: 1, max: 5, step: 1, value: 3 }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['css', 'Average level at steady state'], ['peak', 'Peak level'], ['ratio', 'Peak : trough'], ['rel', 'Release rate (mean)'], ['tss', 'Time to steady state'], ['tail', 'Tail after the last injection']]);
      const plot = kit.plot(gb, { x: { label: 'time (days)', min: 0 }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 190);

      function released(kind, frac) {                                 // fraction released after a fraction of the duration
        if (frac <= 0) return 0;
        if (kind === 'zero') return Math.min(1, frac);
        if (kind === 'higuchi') return Math.min(1, P.release.higuchi(1, Math.min(1, frac)));
        const b = V.burst / 100;
        return Math.min(1, b + (1 - b) * P.release.weibull(Math.min(1, frac) + 1e-9, 0.55, 2.2));
      }
      function recompute() {
        const T = Math.max(1, V.dur), n = Math.max(1, Math.round(V.rep));
        const tEnd = T * (n + 1.2), dt = tEnd / 1200, k = V.CL / Math.max(1, V.Vd);
        const pts = [], rel = [];
        let C = 0, peak = 0, last = 0;
        for (let i = 0; i <= 1200; i++) {
          const t = i * dt;
          let rate = 0;                                               // mg/day from every depot injected so far
          for (let j = 0; j < n; j++) {
            const s = t - j * T;
            if (s <= 0 || s > T + dt) continue;
            const f1 = released(V.kind, s / T), f0 = released(V.kind, (s - dt) / T);
            rate += V.load * Math.max(0, f1 - f0) / dt;
          }
          // one-compartment: dC/dt = rate/Vd − k·C, in fixed sub-steps
          const sub = 4, h = dt / sub;
          for (let s2 = 0; s2 < sub; s2++) C += h * (rate / Math.max(1, V.Vd) - k * C);
          C = Math.max(0, C);
          if (t > T * 0.1) peak = Math.max(peak, C);
          pts.push([t, C]); rel.push([t, rate]);
          last = C;
        }
        const Rmean = V.load / T, css = Rmean / Math.max(1, V.CL);
        // trough: the level just before each new injection
        let trough = Infinity;
        for (let j = 1; j < n; j++) { const idx = Math.round(j * T / dt) - 1; if (pts[idx]) trough = Math.min(trough, pts[idx][1]); }
        if (!Number.isFinite(trough)) trough = css;
        plot.set({ series: [{ pts, label: 'plasma level' }], hlines: [{ y: css, label: 'R/CL = ' + kit.fmt(css, 3) + ' mg/L' }],
          vlines: Array.from({ length: n }, (_, j) => ({ x: j * T, label: j ? '' : 'injection' })) });
        ro.set('css', kit.fmt(css, 3) + ' mg/L');
        ro.set('peak', kit.fmt(peak, 3) + ' mg/L');
        ro.set('ratio', trough > 0 ? (peak / trough).toFixed(2) + ' : 1' : '—');
        ro.set('rel', kit.fmt(Rmean, 3) + ' mg/day for ' + T + ' days');
        const thalf = Math.LN2 / Math.max(1e-6, V.CL / Math.max(1, V.Vd));
        ro.set('tss', V.kind === 'zero' ? (5 * thalf).toFixed(1) + ' days — five drug half-lives of ' + thalf.toFixed(1) + ' days' : 'never flat: the release rate itself changes');
        ro.set('tail', kit.fmt(last, 3) + ' mg/L still present ' + (T * 0.2).toFixed(0) + ' days after the last depot is spent');
      }
      recompute();

      let t = 0;
      const loop = kit.loop((dt) => {
        const T = Math.max(1, V.dur);
        t = (t + dt * T / 6) % (T * 1.15);                             // one depot lifetime every six seconds
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const f = released(V.kind, t / T);
        // skin, depot and blood vessel
        const sy = H * 0.3;
        c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(0, sy); c.lineTo(W, sy); c.stroke();
        kit.label(c, 'skin', 8, sy - 12, { size: 11.5, color: C.muted });
        const dx = W * 0.22, dy = H * 0.6, dw = Math.min(150, W * 0.2), dh = 26;
        c.fillStyle = C.faint; c.fillRect(dx, dy - dh / 2, dw, dh);
        c.fillStyle = kit.hue(120, 0.6); c.fillRect(dx, dy - dh / 2, dw * Math.max(0, 1 - f), dh);
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(dx, dy - dh / 2, dw, dh);
        kit.label(c, V.kind === 'zero' ? 'reservoir implant' : V.kind === 'higuchi' ? 'matrix depot' : 'microspheres', dx, dy - dh / 2 - 12, { size: 11.5, color: C.muted });
        kit.label(c, (V.load * (1 - f)).toFixed(0) + ' mg left', dx + dw + 10, dy, { size: 12, weight: 700, color: C.text });
        // drug molecules leaving towards the vessel
        const vx = W * 0.72;
        c.fillStyle = kit.hue(0, 0.12); c.fillRect(vx, H * 0.15, W * 0.22, H * 0.7);
        c.strokeStyle = C.faint; c.strokeRect(vx, H * 0.15, W * 0.22, H * 0.7);
        kit.label(c, 'blood', vx + W * 0.11, H * 0.1, { align: 'center', size: 11.5, color: C.muted });
        const flux = V.kind === 'zero' ? 1 : V.kind === 'higuchi' ? 0.5 / Math.sqrt(Math.max(0.02, t / T)) : (t / T < 0.05 ? 4 : 1);
        const nDots = Math.max(0, Math.round(Math.min(22, 10 * flux * (f < 1 ? 1 : 0))));
        for (let i = 0; i < nDots; i++) {
          const ph = (t * 0.7 + i / nDots) % 1;
          kit.dot(c, dx + dw + 12 + ph * (vx - dx - dw - 6), dy + Math.sin(ph * 9 + i) * 16 - ph * (dy - H * 0.5), 3, C.accent);
        }
        kit.label(c, 'day ' + t.toFixed(0) + ' of ' + T + '  ·  ' + (f * 100).toFixed(0) + ' % released', 10, 18, { size: 13, weight: 700, color: C.text });
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- 7. the cold chain */
  Hyper.sim('adv-coldchain', {
    title: 'A cold-chain excursion and what it costs',
    blurb: `A carton of a hypothetical vaccine travels from the factory to a clinic. Potency is lost by a first-order reaction whose rate follows the Arrhenius equation (\`kit.pharma.arrhenius\`), so the damage is integrated over the whole temperature history. The vial monitor square on the right darkens with accumulated heat, exactly as the real ones do.

**Try this**
- Leave everything cold: after six months the vaccine has lost only a few per cent.
- Set the transport at 30 °C for three days, then 40 °C for one day: the shorter, hotter leg does more damage.
- Compare the mean kinetic temperature with the plain average of the journey — it is always higher, because the rate curve bends upwards.
- Raise the activation energy from 80 to 160 kJ/mol: a more heat-sensitive vaccine, for which the same excursion is far worse.
- Switch on "aluminium-adjuvanted" and take the storage below 0 °C: freezing is the one failure that no amount of care afterwards can repair.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 180 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'Tstore', label: 'Storage temperature', min: -25, max: 15, step: 1, value: 5, unit: '°C' },
        { id: 'Ttrans', label: 'Transport temperature', min: -5, max: 45, step: 1, value: 8, unit: '°C' },
        { id: 'dtrans', label: 'Days in transport', min: 0.5, max: 14, step: 0.5, value: 3, unit: 'day' },
        { id: 'Texc', label: 'Clinic excursion temperature', min: 0, max: 45, step: 1, value: 30, unit: '°C' },
        { id: 'hexc', label: 'Excursion length', min: 0, max: 72, step: 1, value: 8, unit: 'h' },
        { id: 'Ea', label: 'Activation energy', min: 60, max: 200, step: 5, value: 110, unit: 'kJ/mol' },
        { id: 'alum', type: 'check', label: 'Aluminium-adjuvanted (freeze sensitive)', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pot', 'Potency at the clinic'], ['mkt', 'Mean kinetic temperature'], ['avg', 'Arithmetic mean temperature'], ['exc', 'Cost of the excursion alone'], ['vvm', 'Vial monitor'], ['verdict', 'Verdict']]);
      const plot = kit.plot(gb, { x: { label: 'days since manufacture' }, y: { label: 'potency (% of release)', min: 60, max: 101 } }, 175);
      const kRef = 0.0012;                                            // per day at 5 °C
      const kAt = TC => P.arrhenius({ k1: kRef, T1: 278.15, T2: Math.max(200, TC + 273.15), Ea: V.Ea * 1000 });
      let profile = [], potency = 100, frozen = false, mkt = 5;

      function recompute() {
        // the journey: 60 days at the factory, the transport leg, then the clinic with one excursion
        const legs = [[60, V.Tstore], [Math.max(0.1, V.dtrans), V.Ttrans], [30, V.Tstore], [Math.max(0.01, V.hexc / 24), V.Texc], [60, V.Tstore]];
        profile = []; potency = 100;
        let t = 0, integral = 0, tTotal = 0, sumT = 0;
        const pts = [[0, 100]];
        for (const [days, TC] of legs) {
          const k = kAt(TC), steps = Math.max(4, Math.round(days * 4));
          for (let i = 0; i < steps; i++) {
            const h = days / steps;
            potency *= Math.exp(-k * h);
            t += h; integral += k * h; tTotal += h; sumT += TC * h;
            pts.push([t, potency]);
          }
          profile.push({ t, TC, days });
        }
        frozen = V.alum && Math.min(V.Tstore, V.Ttrans, V.Texc) < 0;
        if (frozen) potency = Math.min(potency, 25);
        // mean kinetic temperature from the integrated rate
        const kMean = integral / Math.max(1e-9, tTotal);
        mkt = V.Ea * 1000 / 8.314462618 / (Math.log(kRef / kMean) + V.Ea * 1000 / (8.314462618 * 278.15)) - 273.15;
        // what the excursion alone cost
        const kE = kAt(V.Texc), kS = kAt(V.Tstore), dExc = V.hexc / 24;
        const cost = 100 * (1 - Math.exp(-(kE - kS) * dExc));
        plot.set({ series: [{ pts, label: 'potency' }], hlines: [{ y: 80, label: 'minimum release potency' }],
          vlines: profile.slice(0, -1).map((p, i) => ({ x: p.t, label: ['transport', 'clinic', 'excursion', ''][i] || '' })) });
        ro.set('pot', potency.toFixed(1) + ' %');
        ro.set('mkt', Number.isFinite(mkt) ? mkt.toFixed(1) + ' °C' : '—');
        ro.set('avg', (sumT / Math.max(1e-9, tTotal)).toFixed(1) + ' °C');
        ro.set('exc', cost.toFixed(2) + ' % of potency in ' + V.hexc + ' h');
        const vvm = Math.min(1, integral / 0.35);
        ro.set('vvm', vvm < 0.45 ? 'square lighter than the ring — usable' : vvm < 0.8 ? 'darkening — use first' : 'past the discard point');
        ro.set('verdict', frozen ? 'frozen: an aluminium-adjuvanted vaccine is destroyed — discard' : potency >= 80 ? 'within specification' : 'below the minimum potency');
      }
      recompute();

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // the temperature profile of the journey
        const x0 = 46, x1 = W * 0.7, y0 = H * 0.18, y1 = H * 0.82;
        const tEnd = profile.length ? profile[profile.length - 1].t : 1;
        const tx = t => x0 + (x1 - x0) * t / Math.max(1e-9, tEnd);
        const ty = T => y1 - (y1 - y0) * (Math.max(-25, Math.min(45, T)) + 25) / 70;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const T of [-20, 0, 8, 25, 40]) { c.beginPath(); c.moveTo(x0, ty(T)); c.lineTo(x1, ty(T)); c.stroke(); kit.label(c, T + ' °C', x0 - 6, ty(T), { align: 'right', size: 10.5, color: C.muted }); }
        c.strokeStyle = C.ok; c.setLineDash([4, 3]); c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(x0, ty(2)); c.lineTo(x1, ty(2)); c.moveTo(x0, ty(8)); c.lineTo(x1, ty(8)); c.stroke(); c.setLineDash([]);
        let px = x0;
        c.lineWidth = 2.6;
        for (const leg of profile) {
          c.strokeStyle = leg.TC < 0 ? kit.hue(210) : leg.TC > 8 ? C.bad : C.ok;
          c.beginPath(); c.moveTo(px, ty(leg.TC)); c.lineTo(tx(leg.t), ty(leg.TC)); c.stroke();
          px = tx(leg.t);
        }
        kit.label(c, 'the journey, day by day', x0, y0 - 12, { size: 11.5, color: C.muted });
        if (Number.isFinite(mkt)) { c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(x0, ty(mkt)); c.lineTo(x1, ty(mkt)); c.stroke(); c.setLineDash([]); kit.label(c, 'MKT ' + mkt.toFixed(1) + ' °C', x1 - 4, ty(mkt) - 10, { align: 'right', size: 11, color: C.warn }); }
        // the vial and its monitor
        const bx = W * 0.8, by = H * 0.24, bw = Math.min(70, W * 0.1), bh = H * 0.5;
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(bx, by, bw, bh);
        c.fillStyle = frozen ? kit.hue(210, 0.4) : kit.hue(45, 0.3); c.fillRect(bx + 2, by + bh * 0.25, bw - 4, bh * 0.73);
        const lost = Math.max(0, Math.min(1, (100 - potency) / 100));
        const sq = Math.min(30, bw * 0.5), sx = bx + (bw - sq) / 2, sy = by + bh * 0.42;
        c.fillStyle = C.text; c.beginPath(); c.arc(sx + sq / 2, sy + sq / 2, sq * 0.72, 0, 6.283); c.fill();
        const dark = Math.min(1, lost * 3.2);
        c.fillStyle = 'hsl(0 0% ' + Math.round(96 - 86 * dark) + '%)';
        c.fillRect(sx, sy, sq, sq);
        kit.label(c, 'vial monitor', bx + bw / 2, by + bh + 16, { align: 'center', size: 11, color: C.muted });
        kit.label(c, potency.toFixed(1) + ' % potency', bx + bw / 2, by - 12, { align: 'center', size: 13, weight: 700, color: potency >= 80 && !frozen ? C.ok : C.bad });
        if (frozen) kit.label(c, 'frozen — discard', bx + bw / 2, by + bh + 34, { align: 'center', size: 12, weight: 700, color: C.bad });
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- 8. printed tablet geometry */
  Hyper.sim('adv-printgeom', {
    title: 'Printing a tablet: geometry sets the release',
    blurb: `The same paste, the same drug loading, four printed geometries. Volume fixes the **dose**; the surface-to-volume ratio fixes how fast it releases. The tablet is drawn in section as it is built layer by layer, with its numbers underneath.

**Try this**
- Compare a solid cylinder with a ring of the same outer size: more surface, faster release, less drug.
- Drop the lattice infill to 30 %: the dose falls with the solid volume while the internal surface rises — the fastest release of the four.
- Scale the whole design by 1.2: the dose goes up by 1.2³ = 1.73, but the surface-to-volume ratio falls by 1/1.2, so it also releases more slowly. Both effects at once are what makes personalising by resizing tricky.
- Make the layers thinner: better resolution, proportionally longer print.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Geometry', options: [['Solid cylinder', 'cyl'], ['Ring (central hole)', 'ring'], ['Lattice (open infill)', 'lat'], ['Hollow shell', 'shell']], value: 'cyl' },
        { id: 'D', label: 'Diameter', min: 4, max: 16, step: 0.5, value: 10, unit: 'mm' },
        { id: 'h', label: 'Height', min: 2, max: 10, step: 0.5, value: 5, unit: 'mm' },
        { id: 'infill', label: 'Lattice infill', min: 20, max: 100, step: 5, value: 55, unit: '%' },
        { id: 'w', label: 'Drug loading', min: 5, max: 60, step: 1, value: 25, unit: '% w/w' },
        { id: 'scale', label: 'Scale the whole design', min: 0.6, max: 1.6, step: 0.05, value: 1 },
        { id: 'lay', label: 'Layer height', min: 0.05, max: 0.5, step: 0.05, value: 0.2, unit: 'mm' }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vol', 'Solid volume'], ['area', 'Wetted surface'], ['sv', 'Surface-to-volume ratio'], ['dose', 'Dose'], ['t50', 'Time to 50 % released'], ['t80', 'Time to 80 % released'], ['print', 'Layers and print time']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0, max: 12 }, y: { label: 'released (% of dose)', min: 0, max: 100 }, legend: true }, 175);
      const RHO = 1.2;                                                // mg/mm³ of the dried print
      let geo = { V: 0, A: 0 };

      function geometry(shape) {
        const s = V.scale, D = V.D * s, h = V.h * s, r = D / 2;
        if (shape === 'ring') {
          const ri = r * 0.45;
          return { V: Math.PI * (r * r - ri * ri) * h, A: 2 * Math.PI * (r * r - ri * ri) + 2 * Math.PI * r * h + 2 * Math.PI * ri * h };
        }
        if (shape === 'lat') {
          const p = V.infill / 100, Vout = Math.PI * r * r * h, strut = 0.8 * s;
          return { V: Vout * p, A: 2 * Math.PI * r * r * p + 2 * Math.PI * r * h + 4 * Vout * (1 - p) / strut };
        }
        if (shape === 'shell') {
          const wall = 0.8 * s, ri = Math.max(0.5, r - wall), hi = Math.max(0.5, h - 2 * wall);
          return { V: Math.PI * r * r * h - Math.PI * ri * ri * hi, A: 2 * Math.PI * r * r + 2 * Math.PI * r * h + 2 * Math.PI * ri * ri + 2 * Math.PI * ri * hi };
        }
        return { V: Math.PI * r * r * h, A: 2 * Math.PI * r * r + 2 * Math.PI * r * h };
      }
      function recompute() {
        geo = geometry(V.shape);
        const sv = geo.A / Math.max(1e-6, geo.V);
        const dose = geo.V * RHO * V.w / 100;
        // diffusion-controlled matrix: the Higuchi constant scales with the wetted surface per volume
        const kRel = 0.115 * sv;
        const curve = Array.from({ length: 121 }, (_, i) => { const t = i * 0.1; return [t, 100 * P.release.higuchi(kRel, t)]; });
        const ref = geometry('cyl'), kRef = 0.115 * ref.A / Math.max(1e-6, ref.V);
        plot.set({ series: [{ pts: curve, label: V.shape === 'cyl' ? 'this tablet' : 'this geometry' },
          { pts: Array.from({ length: 121 }, (_, i) => { const t = i * 0.1; return [t, 100 * P.release.higuchi(kRef, t)]; }), label: 'solid cylinder', dash: [5, 4] }],
          hlines: [{ y: 80, label: '80 %' }] });
        const tAt = f => Math.pow(f / Math.max(1e-9, kRel), 2);
        const layers = Math.max(1, Math.round(V.h * V.scale / Math.max(0.01, V.lay))), tp = layers * 4;
        ro.set('vol', geo.V.toFixed(0) + ' mm³');
        ro.set('area', geo.A.toFixed(0) + ' mm²');
        ro.set('sv', sv.toFixed(2) + ' per mm');
        ro.set('dose', dose.toFixed(1) + ' mg');
        ro.set('t50', tAt(0.5).toFixed(2) + ' h');
        ro.set('t80', tAt(0.8).toFixed(2) + ' h');
        ro.set('print', layers + ' layers · ' + (tp < 90 ? tp.toFixed(0) + ' s' : (tp / 60).toFixed(1) + ' min') + ' at 4 s a layer');
      }
      recompute();

      let build = 0;
      const loop = kit.loop((dt) => {
        build = (build + dt * 0.35) % 1.25;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const s = V.scale, D = V.D * s, h = V.h * s;
        const px = Math.min(16, Math.min((W * 0.34) / Math.max(4, D), (H * 0.6) / Math.max(2, h)));
        const cx = W * 0.26, base = H * 0.8, wpx = D * px, hpx = h * px;
        const done = Math.min(1, build) * hpx;
        // the build plate
        c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - wpx * 0.8, base); c.lineTo(cx + wpx * 0.8, base); c.stroke();
        // the tablet in section, drawn layer by layer
        const layH = Math.max(2, V.lay * px);
        for (let y = 0; y < done; y += layH) {
          const yy = base - y - layH;
          const frac = y / Math.max(1e-6, hpx);
          c.fillStyle = kit.hue(200, 0.55);
          if (V.shape === 'ring') {
            const hole = wpx * 0.45;
            c.fillRect(cx - wpx / 2, yy, (wpx - hole) / 2, layH - 0.6);
            c.fillRect(cx + hole / 2, yy, (wpx - hole) / 2, layH - 0.6);
          } else if (V.shape === 'lat') {
            const nb = 7, bw = wpx / nb, fill = V.infill / 100;
            for (let i = 0; i < nb; i++) if (((i + Math.round(y / layH)) % 2 === 0) || Math.random() < fill - 0.5) c.fillRect(cx - wpx / 2 + i * bw, yy, bw * Math.max(0.3, fill) - 0.6, layH - 0.6);
          } else if (V.shape === 'shell') {
            const wall = Math.max(2, 0.8 * s * px);
            if (frac < 0.16 || frac > 0.84) c.fillRect(cx - wpx / 2, yy, wpx, layH - 0.6);
            else { c.fillRect(cx - wpx / 2, yy, wall, layH - 0.6); c.fillRect(cx + wpx / 2 - wall, yy, wall, layH - 0.6); }
          } else c.fillRect(cx - wpx / 2, yy, wpx, layH - 0.6);
        }
        // the nozzle
        const ny = base - done;
        c.fillStyle = C.muted;
        c.beginPath(); c.moveTo(cx - 8, ny - 26); c.lineTo(cx + 8, ny - 26); c.lineTo(cx + 3, ny - 6); c.lineTo(cx - 3, ny - 6); c.closePath(); c.fill();
        if (build < 1) kit.dot(c, cx, ny - 3, 2.5, kit.hue(200));
        kit.label(c, build < 1 ? 'printing layer ' + Math.min(Math.round(V.h * s / Math.max(0.01, V.lay)), Math.round(build * V.h * s / Math.max(0.01, V.lay))) : 'finished', cx, H * 0.1, { align: 'center', size: 12, weight: 700, color: C.text });
        // the numbers
        const tx = W * 0.5;
        const rows = [['volume', geo.V.toFixed(0) + ' mm³'], ['surface', geo.A.toFixed(0) + ' mm²'], ['A/V', (geo.A / Math.max(1e-6, geo.V)).toFixed(2) + ' per mm'],
          ['dose', (geo.V * RHO * V.w / 100).toFixed(1) + ' mg'], ['scale', '×' + V.scale.toFixed(2) + ' → dose ×' + Math.pow(V.scale, 3).toFixed(2)]];
        rows.forEach(([a, b], i) => {
          kit.label(c, a, tx, H * 0.26 + i * 22, { size: 12, color: C.muted });
          kit.label(c, b, Math.min(W - 10, tx + 150), H * 0.26 + i * 22, { size: 12.5, weight: 700, color: C.text, align: 'right' });
        });
      }, box.stage);
      loop.start();
    }
  });
})();
