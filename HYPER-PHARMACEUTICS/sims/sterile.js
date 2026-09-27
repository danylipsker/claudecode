/* HYPER-PHARMACEUTICS · sims/sterile.js — simulations for sterile products and parenterals.
 *   ster-survivor   an autoclave cycle as the load feels it: chamber and lagging load temperatures, lethal rate,
 *                   F₀, survivors of the bioburden and of a 10⁶-spore indicator on a log scale, SAL, steam pressure
 *   ster-filter     a sterilising-grade membrane challenged with bacteria, mycoplasma, viruses and particles (log reduction
 *                   from a pore-size distribution and any defect), and a bubble-point integrity test
 *   ster-cleanroom  a grade B room around a grade A zone: operators shedding particles, air changes, door openings and
 *                   interventions; counts by the well-mixed model against the EU GMP Annex 1 / ISO 14644 limits
 *   ster-lal        a kinetic chromogenic LAL test: standards, onset times, the log–log standard curve, a product's
 *                   endotoxin limit K/M, the maximum valid dilution and spike recovery with interference
 *   ster-lyo        a freeze-drying cycle: the phase diagram of water, the product temperature set by the heat and mass
 *                   balance, the receding ice front and collapse
 *   ster-eye        an eye drop in the tear film: overflow, washout, reflex tearing, pH and tonicity against the comfort window,
 *                   and the fraction that crosses the cornea
 *   ster-routes     a hypothetical drug by IV bolus, infusion, IM, SC and a depot: absorption, peaks and flip-flop kinetics
 *   ster-precip     a co-solvent injection diluted into flowing blood: concentration against solubility, supersaturation
 * All numbers are teaching models with hypothetical drugs, not instructions for preparing or giving anything.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  const sup = n => String(n).split('').map(ch => SUP[ch] || ch).join('');
  // 2.1 × 10⁻⁹ style, plain numbers for moderate values
  function sci(x, d) {
    if (!Number.isFinite(x)) return '—';
    if (x === 0) return '0';
    const a = Math.abs(x);
    if (a >= 0.01 && a < 1e5) return (+x.toPrecision(d || 3)).toLocaleString('en-GB');
    let e = Math.floor(Math.log10(a)), m = x / Math.pow(10, e);
    if (Math.abs(+m.toFixed(d == null ? 1 : d - 1)) >= 10) { m /= 10; e += 1; }
    return (Math.abs(m - 1) < 0.05 ? '' : m.toFixed(d == null ? 1 : d - 1) + ' × ') + '10' + sup(e);
  }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const plotRow = (stage, n) => {
    const gb = document.createElement('div');
    gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px';
    stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  };
  // saturated steam pressure (kPa) from Antoine's equation for water, 99–374 °C
  const steamKPa = T => 0.133322 * Math.pow(10, 8.14019 - 1810.94 / (244.485 + T));
  // a colour from cold (blue) to hot (red)
  const tempHue = (kit, T, lo, hi, a) => kit.hue(Math.round(220 - 220 * clamp((T - lo) / (hi - lo), 0, 1)), a);
  function roundRect(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r); c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }
  // a seeded random source, so a simulation looks the same each time it is opened
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  // standard normal distribution function (Abramowitz–Stegun 7.1.26 via erf)
  function ncdf(z) {
    const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-z * z / 2);
    return z >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
  }

  /* ================================================================ ster-survivor */
  Hyper.sim('ster-survivor', {
    title: 'Spores through a steam cycle',
    blurb: `An autoclave cycle as the load feels it. The chamber heats from 100 °C, holds and cools; the coldest container follows with its own lag. Every minute kills a fixed fraction of the microbes — one log per D-value at the temperature of that minute — so on a log scale the survivors fall along lines whose steepness follows the temperature (the z-value). F₀ adds the cycle up as equivalent minutes at 121.1 °C. A biological indicator of 10⁶ spores with D₁₂₁ = 2 min rides with the load. For cycles in numbers, use [the F₀ calculator](#/tools/pharmcalc/sterile).

**Try this**
- Run the reference cycle (121 °C, 15 min) with small vials, then with large bags. The load lags the chamber, F₀ falls — does the indicator still come out negative?
- Hold at 118 °C instead: three degrees halve the lethality. How much longer must you hold for the same F₀?
- Try 134 °C for 3 minutes, a short hot cycle, and compare F₀ with the reference.
- Raise the bioburden a hundredfold: the sterility assurance level worsens by exactly two logs.
- Set z to 6 °C and then 14 °C: with a small z nearly all the killing happens at the top of the cycle; with a large z the ramps count for more.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 200 });
      const [g1, g2] = plotRow(box.stage, 2);
      const ctl = kit.controls(box.side, [
        { id: 'Th', label: 'Hold temperature (chamber)', min: 110, max: 135, step: 0.5, value: 121, unit: '°C' },
        { id: 'th', label: 'Hold time', min: 0, max: 40, step: 0.5, value: 15, unit: 'min' },
        { id: 'tau', type: 'select', label: 'Load (how it lags the chamber)', options: [['Small vials (τ ≈ 1 min)', 1], ['1 L bottles (τ ≈ 4 min)', 4], ['Large bags (τ ≈ 8 min)', 8]], value: 1 },
        { id: 'N0', label: 'Bioburden per item', min: 1, max: 1e6, value: 100, unit: 'CFU', log: true, sig: 2 },
        { id: 'D', label: 'D₁₂₁ of the bioburden', min: 0.05, max: 3, value: 0.5, unit: 'min', log: true, sig: 2 },
        { id: 'z', label: 'z-value of the bioburden', min: 6, max: 14, step: 0.5, value: 10, unit: '°C' },
        { id: 'bi', type: 'check', label: 'Biological indicator (10⁶ spores, D₁₂₁ = 2 min)', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the cycle', primary: true }, { id: 'end', label: 'Show the whole cycle' }] }
      ], id => {
        if (id === 'run') tc = 0;
        else if (id === 'end') tc = cyc.total;
        else { compute(); tc = cyc.total; }
        plots(); loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F0', 'F₀ in the load (chamber)'], ['lr', 'Log reduction of the bioburden'], ['sal', 'Survivors per item (SAL)'], ['bi', 'Indicator: chance of growth'], ['p', 'Steam pressure at the hold']]);
      const pT = kit.plot(g1, { x: { label: 'time (min)', min: 0 }, y: { label: 'temperature (°C)', min: 95, max: 138 }, legend: true }, 200);
      const pN = kit.plot(g2, { x: { label: 'time (min)', min: 0 }, y: { label: 'log₁₀ survivors per item', min: -12, max: 7 }, legend: true }, 200);
      const DT = 0.02, TU = 8, TD = 8, TAIL = 6;
      let cyc = null, tc = 0;
      function compute() {
        const th = V.th, Th = V.Th, tau = V.tau, total = TU + th + TD + TAIL, n = Math.round(total / DT);
        const S = [];                                            // samples every 0.1 min: [t, Tch, TL, logN, logBI, F0]
        let TL = 100, lN = Math.log10(V.N0), lB = 6, F = 0, Fch = 0;
        for (let i = 0; i <= n; i++) {
          const t = i * DT;
          const Tch = t < TU ? 100 + (Th - 100) * t / TU : t < TU + th ? Th : t < TU + th + TD ? Th - (Th - 100) * (t - TU - th) / TD : 100 - 3 * (t - TU - th - TD);
          if (i % 5 === 0) S.push([t, Tch, TL, lN, lB, F]);
          TL += (Tch - TL) * DT / tau;                           // the load lags with time constant tau
          const L10 = Math.pow(10, (TL - 121.1) / 10);
          F += L10 * DT; Fch += Math.pow(10, (Tch - 121.1) / 10) * DT;
          lN -= Math.pow(10, (TL - 121.1) / V.z) * DT / V.D;       // one log per D(T) minutes
          lB -= L10 * DT / 2;                                     // indicator: D121 = 2 min, z = 10 °C
        }
        cyc = { total, S, F, Fch, lN, lB, lN0: Math.log10(V.N0) };
        const pk = steamKPa(Th), N = Math.pow(10, lN), pG = -Math.expm1(-Math.pow(10, Math.min(lB, 3)));
        ro.set('F0', F.toFixed(1) + ' min (' + Fch.toFixed(1) + ')');
        ro.set('lr', (cyc.lN0 - lN).toFixed(1) + ' logs');
        ro.set('sal', (lN < -99 ? '< 10⁻⁹⁹' : sci(N, 2)) + (N <= 1e-6 ? ' — SAL 10⁻⁶ met' : ' — not enough'));
        ro.set('bi', !V.bi ? 'not used' : lB > 1 ? '≈ 100 % — grows: the cycle fails' : pG < 1e-4 ? sci(pG * 100, 2) + ' % — negative' : (pG * 100).toFixed(2) + ' %' + (pG < 0.01 ? ' — negative' : ' — may grow'));
        ro.set('p', pk.toFixed(0) + ' kPa abs, ' + ((pk - 101.325) / 100).toFixed(2) + ' bar gauge');
      }
      const at = t => cyc.S[clamp(Math.round(t / 0.1), 0, cyc.S.length - 1)];
      function plots() {
        const upto = cyc.S.filter(s => s[0] <= tc + 1e-9);
        pT.set({ x: { label: 'time (min)', min: 0, max: cyc.total }, series: [
          { pts: cyc.S.map(s => [s[0], s[1]]), label: 'chamber', dash: [5, 4], width: 1.4 },
          { pts: upto.map(s => [s[0], s[2]]), label: 'coldest item' }],
          hlines: [{ y: 121.1, label: '121.1 °C' }], vlines: tc < cyc.total ? [{ x: tc }] : [] });
        const ser = [{ pts: upto.map(s => [s[0], Math.max(-12, s[3])]), label: 'bioburden' }];
        if (V.bi) ser.push({ pts: upto.map(s => [s[0], Math.max(-12, s[4])]), label: 'indicator, 10⁶ spores' });
        pN.set({ x: { label: 'time (min)', min: 0, max: cyc.total }, series: ser, hlines: [{ y: 0, label: 'one survivor' }, { y: -6, label: 'SAL 10⁻⁶' }] });
      }
      function drawStage() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const s = at(tc), Tch = s[1], TL = s[2];
        // the chamber, tinted by its temperature
        const cx = 12, cy = 14, cw = Math.max(150, W * 0.34), chh = H - 46;
        c.fillStyle = tempHue(kit, Tch, 95, 135, 0.18); roundRect(c, cx, cy, cw, chh, 12); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2; roundRect(c, cx, cy, cw, chh, 12); c.stroke();
        c.lineWidth = 4; c.beginPath(); c.moveTo(cx + cw, cy + 10); c.lineTo(cx + cw, cy + chh - 10); c.stroke();
        // steam wisps
        c.strokeStyle = C.muted; c.lineWidth = 1.2;
        for (let i = 0; i < 5; i++) { const x = cx + 20 + i * (cw - 40) / 4, ph = (tc * 2 + i) % 6.28; c.beginPath(); for (let k = 0; k <= 12; k++) { const y = cy + 14 + k * 3; c.lineTo(x + 4 * Math.sin(ph + k * 0.7), y); } c.stroke(); }
        // the load: a row of containers coloured by the load temperature
        const nv = 6, vw = Math.min(22, (cw - 30) / nv - 6), vh = chh * 0.38, vy = cy + chh - vh - 10;
        for (let i = 0; i < nv; i++) {
          const x = cx + 14 + i * ((cw - 28) / nv) + ((cw - 28) / nv - vw) / 2;
          c.fillStyle = tempHue(kit, TL, 95, 135, 0.85); c.fillRect(x, vy + vh * 0.2, vw, vh * 0.8);
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x, vy, vw, vh); c.fillStyle = C.muted; c.fillRect(x + vw * 0.2, vy - 5, vw * 0.6, 5);
        }
        kit.label(c, 'chamber ' + Tch.toFixed(1) + ' °C', cx + 10, cy + chh * 0.22, { size: 12.5, weight: 700 });
        kit.label(c, 'load ' + TL.toFixed(1) + ' °C', cx + 10, cy + chh * 0.22 + 17, { size: 12.5, weight: 700, color: tempHue(kit, TL, 95, 135) });
        kit.label(c, 't = ' + tc.toFixed(1) + ' min    F₀ so far ' + s[5].toFixed(1) + ' min    lethal rate ' + sci(Math.pow(10, (TL - 121.1) / 10), 2) + ' /min', cx, H - 16, { size: 12, color: C.muted });
        // the pressure gauge (absolute)
        const gx = cx + cw + 46, gy = cy + 44, gr = Math.min(34, H * 0.18), pk = steamKPa(Math.max(99, Tch));
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(gx, gy, gr, 0, 6.2832); c.stroke();
        for (let k = 0; k <= 4; k++) { const a = Math.PI * (0.75 + 1.5 * k / 4); c.beginPath(); c.moveTo(gx + (gr - 6) * Math.cos(a), gy + (gr - 6) * Math.sin(a)); c.lineTo(gx + gr * Math.cos(a), gy + gr * Math.sin(a)); c.stroke(); }
        const ang = Math.PI * (0.75 + 1.5 * clamp(pk / 400, 0, 1));
        kit.arrow(c, gx, gy, gx + (gr - 8) * Math.cos(ang), gy + (gr - 8) * Math.sin(ang), C.bad, 2);
        kit.label(c, (pk / 100).toFixed(2) + ' bar abs', gx, gy + gr + 12, { align: 'center', size: 11.5, weight: 700 });
        kit.label(c, '0 – 4 bar', gx, gy + gr + 26, { align: 'center', size: 10.5, color: C.muted });
        // the survivors on a log ladder
        const x0 = gx + gr + 34, x1 = W - 16, lo = -12, hi = 7;
        if (x1 - x0 > 120) {
          const X = v => x0 + (hi - clamp(v, lo, hi)) / (hi - lo) * (x1 - x0), rows = [[s[3], 'bioburden', C.series[0]]];
          if (V.bi) rows.push([s[4], 'indicator', C.series[1]]);
          kit.label(c, 'survivors per item (log scale)', x0, cy + 6, { size: 12, weight: 700 });
          const ay = cy + 30;
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, ay); c.lineTo(x1, ay); c.stroke();
          for (let e = 6; e >= -12; e -= 3) { c.beginPath(); c.moveTo(X(e), ay - 4); c.lineTo(X(e), ay + 4); c.stroke(); kit.label(c, e === 0 ? '1' : '10' + sup(e), X(e), ay - 11, { align: 'center', size: 10.5, color: C.muted }); }
          c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(-6), ay); c.lineTo(X(-6), H - 30); c.stroke(); c.setLineDash([]);
          kit.label(c, 'SAL', X(-6) + 3, H - 36, { size: 10.5, color: C.bad });
          rows.forEach(([v, name, col], i) => {
            const y = ay + 30 + i * 34;
            c.fillStyle = col; c.globalAlpha = 0.25; c.fillRect(x0, y - 7, X(v) - x0, 14); c.globalAlpha = 1;
            kit.dot(c, X(v), y, 7, col, C.text);
            kit.label(c, name + ': ' + (v < lo ? '< 10' + sup(lo) : sci(Math.pow(10, v), 2)), clamp(X(v) + 12, x0, x1 - 110), y + (v < -7 ? 16 : 0), { size: 11.5, weight: 700, color: col });
          });
        }
      }
      const loop = kit.loop(dt => {
        if (tc < cyc.total) { tc = Math.min(cyc.total, tc + dt * 4); plots(); }
        drawStage();
      }, box.stage);
      compute(); plots();
      loop.start();
    }
  });

  /* ================================================================ ster-filter */
  const ORGS = [
    ['Brevundimonas diminuta (0.3 × 0.8 µm)', 'bd'], ['Escherichia coli (0.8 × 2 µm)', 'ec'], ['Mycoplasma (≈ 0.15 µm, flexible)', 'my'],
    ['A small virus (0.05 µm)', 'vi'], ['Glass or rubber particle (5 µm)', 'pa']];
  const ORG = { bd: { w: 0.3, l: 0.8, rod: true }, ec: { w: 0.8, l: 2, rod: true }, my: { w: 0.15, l: 0.2 }, vi: { w: 0.05, l: 0.05 }, pa: { w: 5, l: 5 } };
  Hyper.sim('ster-filter', {
    title: 'A sterilising filter and its bubble point',
    blurb: `A membrane filter seen in cross-section (magnified, and much thinner than a real one): a sponge of pores with a spread of sizes. An organism gets through only by finding pores wider than itself all the way down, so the log reduction value (LRV) rises steeply as the organism gets bigger than the pores. A filter is "sterilising grade" when it retains a challenge of 10⁷ *Brevundimonas diminuta* per cm² — here a 47 mm disc, 1.4 × 10⁸ cells — with nothing in the filtrate. The bubble point test pushes air against the wetted membrane: nothing but slow diffusion until the pressure can empty the largest pore, then a rush of bubbles.

**Try this**
- Challenge the 0.22 µm filter with *B. diminuta*, then the 0.45 µm filter. Which one is sterilising grade?
- Try mycoplasma and a virus on the 0.22 µm filter: filtration is not a cure-all; a 0.1 µm filter holds mycoplasma, but not viruses.
- Add a 5 µm pinhole: the log reduction collapses. Now run the bubble-point test — it catches the pinhole at a fraction of the specified pressure.
- A 1 µm pinhole barely changes the bacterial count, yet the integrity test fails: the test is more sensitive than the challenge.
- Wet the membrane with 60 % isopropanol instead of water: the bubble point falls with the surface tension, so the specification must name the liquid.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const [g1] = plotRow(box.stage, 1);
      const ctl = kit.controls(box.side, [
        { id: 'r', type: 'select', label: 'Membrane rating', options: [['0.1 µm', 0.1], ['0.22 µm (sterilising grade)', 0.22], ['0.45 µm', 0.45], ['0.8 µm', 0.8]], value: 0.22 },
        { id: 'org', type: 'select', label: 'Challenge', options: ORGS, value: 'bd' },
        { id: 'def', type: 'select', label: 'Membrane integrity', options: [['Intact', 0], ['A 1 µm pinhole', 1], ['A 5 µm pinhole', 5], ['A 20 µm tear', 20]], value: 0 },
        { id: 'liq', type: 'select', label: 'Wetting liquid (bubble test)', options: [['Water (72 mN/m)', 72], ['60 % isopropanol (23 mN/m)', 23]], value: 72 },
        { type: 'buttons', items: [{ id: 'bp', label: 'Run a bubble-point test', primary: true }, { id: 'again', label: 'Challenge again' }] }
      ], id => {
        if (id === 'bp') { test = { P: 0, pts: [], done: false }; }
        else { if (id === 'r' || id === 'def') makePores(); test = null; parts.length = 0; }
        update();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lrv', 'Log reduction value (LRV)'], ['down', 'Expected in the filtrate'], ['bp', 'Bubble point'], ['ok', 'Verdict']]);
      const pl = kit.plot(g1, { x: { label: 'air pressure upstream (bar)', min: 0 }, y: { label: 'air flow through the wetted membrane (mL/min)', min: 0 }, legend: true }, 180);
      const K = 0.26, LAYERS = 6, SIG = 0.2, CHALLENGE = 1e7 * 13.8;
      const R = rng(7);
      let pores = [], parts = [], test = null, lastSpawn = 0;
      const dm = () => V.r * 0.6;                                                  // median pore diameter, µm
      function makePores() {
        pores = [];
        const n = 16;
        for (let i = 0; i < n; i++) {
          const u = Math.max(1e-6, R()), v = R(), z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
          pores.push({ x: (i + 0.2 + 0.6 * R()) / n, d: dm() * Math.exp(SIG * clamp(z, -2.5, 2.5)), ph: R() * 6.28 });
        }
        if (V.def > 0) pores.push({ x: 0.5 + 0.5 / 16, d: V.def, ph: 0, defect: true });
      }
      // probability that one organism crosses the membrane
      function pPass(w) {
        const p1 = 1 - ncdf(Math.log(w / dm()) / SIG), perfect = Math.pow(p1, LAYERS);
        const phi = V.def > 0 ? 2.5e-6 * Math.pow(V.def / 5, 4) * Math.pow(0.22 / V.r, 2) : 0;      // share of the flow through the defect
        return Math.min(1, (1 - phi) * perfect + phi * (w < V.def ? 1 : 0));
      }
      const bpIntact = () => 4 * K * V.liq * 1e-3 / (V.r * 1e-6) / 1e5;                // bar
      const bpMeasured = () => V.def > 0 ? Math.min(bpIntact(), 4 * K * V.liq * 1e-3 / (V.def * 1e-6) / 1e5) : bpIntact();
      const spec = () => Math.floor(bpIntact() * 0.9 * 10) / 10;
      const flow = P => 0.8 * P + (P > bpMeasured() ? 60 * Math.pow(P - bpMeasured(), 1.5) : 0);
      function update() {
        const o = ORG[V.org], pp = pPass(o.w), lrv = -Math.log10(Math.max(pp, 1e-300)), down = CHALLENGE * pp;
        ro.set('lrv', lrv > 12 ? '> 12' : lrv.toFixed(1));
        ro.set('down', down < 1e-3 ? 'none (' + sci(down, 2) + ' expected)' : down < 1 ? sci(down, 2) + ' organisms (usually none)' : sci(down, 2) + ' organisms');
        const bpm = bpMeasured();
        ro.set('bp', test && test.done ? bpm.toFixed(2) + ' bar (minimum ' + spec().toFixed(1) + ')' : 'specification ≥ ' + spec().toFixed(1) + ' bar — run the test');
        const retains = V.org === 'bd' ? (lrv >= 7 ? 'retains the B. diminuta challenge' : 'lets B. diminuta through') : lrv >= 7 ? 'retains this challenge' : 'does not retain this challenge';
        ro.set('ok', (test && test.done ? (bpm >= spec() ? 'integrity test passed; ' : 'integrity test FAILED; ') : '') + retains);
        const maxP = Math.max(1, bpIntact() * 1.4), curve = [];
        for (let i = 0; i <= 80; i++) { const P = maxP * i / 80; curve.push([P, flow(P)]); }
        const ser = [{ pts: curve, label: 'expected for this membrane', dash: [5, 4], width: 1.3 }];
        if (test) ser.push({ pts: test.pts, label: 'measured' });
        pl.set({ x: { label: 'air pressure upstream (bar)', min: 0, max: maxP }, y: { label: 'air flow (mL/min)', min: 0, max: Math.max(20, flow(maxP) * 0.6) }, series: ser, vlines: [{ x: spec(), label: 'minimum bubble point' }] });
        loop.once();
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const mx0 = 16, mx1 = Math.max(mx0 + 160, W * 0.64), my0 = H * 0.36, my1 = H * 0.64, px = 14;           // 14 px per µm across
        const o = ORG[V.org];
        // the membrane: a band with tortuous pores
        c.fillStyle = test ? kit.hue(210, 0.28) : C.surface || C.bg; c.fillRect(mx0, my0, mx1 - mx0, my1 - my0);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(mx0, my0, mx1 - mx0, my1 - my0);
        for (const p of pores) {
          const x = mx0 + p.x * (mx1 - mx0), w = clamp(p.d * px, 1.2, 40);
          c.strokeStyle = p.defect ? C.bad : C.bg2; c.lineWidth = w; c.beginPath();
          for (let k = 0; k <= 10; k++) { const y = my0 + (my1 - my0) * k / 10; c.lineTo(x + (p.defect ? 0 : 5 * Math.sin(p.ph + k * 1.3)), y); }
          c.stroke();
        }
        kit.label(c, 'membrane, ' + V.r + ' µm rated' + (V.def ? ' — with a ' + V.def + ' µm defect' : ''), mx0 + 4, my1 + 12, { size: 11.5, color: C.muted });
        kit.label(c, 'upstream: challenge', mx0 + 4, 12, { size: 11.5, color: C.muted });
        kit.label(c, 'filtrate', mx0 + 4, H - 10, { size: 11.5, color: C.muted });
        // organisms or particles falling onto it (the picture is qualitative; the numbers are in the read-out)
        if (!test) {
          if (t - lastSpawn > 0.08 && parts.length < 160) { lastSpawn = t; parts.push({ x: mx0 + 6 + R() * (mx1 - mx0 - 12), y: 18, a: R() * 3.14, state: 'fall' }); }
          for (const q of parts) {
            if (q.state === 'fall') {
              q.y += 60 * dt;
              if (q.y >= my0 - clamp(o.w * px, 1.5, 18) / 2) {
                // lands near the closest pore: through if that pore is wider than the organism
                let best = null, bd = 1e9;
                for (const p of pores) { const d = Math.abs(mx0 + p.x * (mx1 - mx0) - q.x); if (d < bd) { bd = d; best = p; } }
                if (best && bd < 14 && best.d > o.w) { q.state = 'through'; q.x = mx0 + best.x * (mx1 - mx0); }
                else q.state = 'held';
              }
            } else if (q.state === 'through') { q.y += 40 * dt; if (q.y > H - 14) q.state = 'out'; }
          }
          parts = parts.filter(q => q.state !== 'out');
          const held = parts.filter(q => q.state === 'held');
          if (held.length > 90) parts.splice(parts.indexOf(held[0]), 1);
          for (const q of parts) {
            const w = clamp(o.w * px, 1.5, 18), l = clamp(o.l * px, 1.5, 22);
            c.save(); c.translate(q.x, q.y); c.rotate(q.a);
            c.fillStyle = q.state === 'through' || q.state === 'out' ? C.bad : V.org === 'pa' ? C.muted : C.ok;
            c.beginPath(); if (o.rod) { c.ellipse(0, 0, l / 2, w / 2, 0, 0, 6.2832); } else c.arc(0, 0, w / 2, 0, 6.2832); c.fill();
            c.restore();
          }
        } else if (!test.done) {
          // the bubble-point test: pressure ramps up; bubbles appear once it exceeds the largest opening's bubble point
          test.P += dt * bpIntact() * 0.18;
          test.pts.push([test.P, flow(test.P)]);
          const maxP = bpIntact() * 1.4;
          if (test.P >= maxP || test.P > bpMeasured() * 1.15) { test.done = true; update(); }
          else if (Math.round(test.P * 50) % 5 === 0) pl.set({ series: [pl.o.series[0], { pts: test.pts, label: 'measured' }] });
        }
        if (test) {
          const bpm = bpMeasured(), over = test.P > bpm;
          const src = V.def > 0 && bpm < bpIntact() ? pores[pores.length - 1] : pores.reduce((a, b) => b.d > a.d ? b : a, pores[0]);
          kit.label(c, 'air at ' + test.P.toFixed(2) + ' bar', mx0 + 4, my0 - 16, { size: 13, weight: 700, color: kit.hue(210) });
          c.fillStyle = kit.hue(210, 0.12); c.fillRect(mx0, 22, mx1 - mx0, my0 - 44);
          if (over && src) {
            const x = mx0 + src.x * (mx1 - mx0);
            for (let k = 0; k < 7; k++) { const y = my1 + ((t * 60 + k * 18) % (H - my1 - 16)); kit.dot(c, x + 4 * Math.sin(t * 5 + k), y, 3 + (k % 3), kit.hue(210, 0.7), C.text); }
            kit.label(c, 'bubbles: bulk air flow', x + 12, my1 + 26, { size: 12, weight: 700, color: C.bad });
          } else kit.label(c, 'only slow diffusion through the liquid in the pores', mx0 + 4, my1 + 28, { size: 12, color: C.muted });
        }
        // the numbers beside the picture
        const tx = mx1 + 16;
        if (W - tx > 150) {
          const lrv = -Math.log10(Math.max(pPass(o.w), 1e-300));
          kit.label(c, 'challenge 10⁷ per cm²', tx, H * 0.22, { size: 12, color: C.muted });
          kit.label(c, '= 1.4 × 10⁸ on a 47 mm disc', tx, H * 0.22 + 16, { size: 12, color: C.muted });
          kit.label(c, 'LRV ' + (lrv > 12 ? '> 12' : lrv.toFixed(1)), tx, H * 0.5, { size: 18, weight: 700, color: lrv >= 7 ? C.ok : C.bad });
          kit.label(c, lrv >= 7 ? 'sterile filtrate' : 'organisms pass', tx, H * 0.5 + 22, { size: 12.5, weight: 700, color: lrv >= 7 ? C.ok : C.bad });
          kit.label(c, 'bubble point ≥ ' + spec().toFixed(1) + ' bar required', tx, H * 0.78, { size: 12, color: C.muted });
        }
      }, box.stage);
      makePores(); update();
      loop.start();
    }
  });

  /* ================================================================ ster-cleanroom */
  // ISO 14644-1 class for a count of particles ≥ 0.5 µm per m³ (to one decimal, rounded up)
  const isoClass = Cn => Math.max(1, Math.ceil((Math.log10(Math.max(Cn, 1)) + 2.08 * Math.log10(0.5 / 0.1)) * 10 - 1e-9) / 10);
  Hyper.sim('ster-cleanroom', {
    title: 'A cleanroom at work',
    blurb: `A 60 m³ grade B filling room seen from above, with a grade A zone of unidirectional air over the open vials. HEPA-filtered air enters through the ceiling and leaves low on the walls; the operators shed particles as they work. The room behaves as a well-mixed tank — the count climbs until the particles removed by the air changes balance those released — while the grade A zone is swept by its own stream and sees only what leaks in. One second is one minute. The limits are those of EU GMP Annex 1 (2022) for particles ≥ 0.5 µm per m³.

**Try this**
- Start with two gowned operators working: where does the room count settle, and which grade does it meet in operation? Now send them out (0 operators) and time the clean-up.
- Halve the air changes: the steady count doubles and the recovery takes twice as long.
- Let the operators walk about, or change their coveralls for lab coats: which matters more?
- Make an intervention in an open grade A zone, then repeat it with a RABS and with an isolator.
- Switch off the pressure cascade and open the door to the airlock.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const [g1] = plotRow(box.stage, 1);
      const ctl = kit.controls(box.side, [
        { id: 'ops', label: 'Operators in the room', min: 0, max: 5, step: 1, value: 2 },
        { id: 'act', type: 'select', label: 'What they are doing', options: [['Standing or sitting still', 1e5], ['Working at the line', 5e5], ['Walking about', 3e6]], value: 5e5 },
        { id: 'gown', type: 'select', label: 'Clothing', options: [['Cleanroom coveralls, hood, mask', 1], ['Lab coats over clothes', 4], ['Everyday clothes', 10]], value: 1 },
        { id: 'ach', label: 'Air changes per hour', min: 5, max: 80, step: 1, value: 40, unit: '/h' },
        { id: 'bar', type: 'select', label: 'Grade A zone', options: [['Open unidirectional airflow', 'open'], ['Restricted access barrier (RABS)', 'rabs'], ['Isolator', 'iso']], value: 'open' },
        { id: 'casc', type: 'check', label: 'Pressure cascade (+15 Pa to the airlock)', value: true },
        { type: 'buttons', items: [{ id: 'door', label: 'Open the door' }, { id: 'int', label: 'Intervene in grade A', primary: true }] }
      ], id => {
        if (id === 'door') doorT = 0.5;
        if (id === 'int') intT = 1;
        if (id === 'ops') placeOps();
        readout();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['room', 'Room (grade B)'], ['a', 'Grade A zone'], ['ss', 'Room at steady state'], ['rec', 'Clean-up, 100-fold'], ['grade', 'Meets']]);
      const pl = kit.plot(g1, { x: { label: 'time (min)' }, y: { label: 'particles ≥ 0.5 µm per m³', log: true, min: 10, max: 2e7 }, legend: true }, 190);
      const VOL = 60, QA = 0.45 * 1.5 * 60, R = rng(11);                   // room m³; grade A airflow m³/min over 1.5 m²
      const LEAK = { open: [0.002, 0.1, 1e5], rabs: [2e-4, 0.005, 0], iso: [1e-5, 0, 0] };   // background leak, leak during an intervention, local release
      let Croom = 50, CA = 20, clock = 0, doorT = 0, intT = 0, hist = [], ops = [], dots = [], dotsA = [], lastPlot = -1;
      function placeOps() {
        while (ops.length < V.ops) ops.push({ x: 0.2 + 0.6 * R(), y: 0.55 + 0.35 * R(), tx: R(), ty: R(), ph: R() * 6 });
        ops.length = V.ops;
      }
      const G = () => V.ops * V.act * V.gown;                                  // particles per minute released in the room
      function readout() {
        const Css = 60 * G() / (V.ach * VOL) + 20;
        ro.set('room', sci(Croom, 3) + ' /m³ (ISO ' + isoClass(Croom).toFixed(1) + ')');
        ro.set('a', sci(CA, 3) + ' /m³ (ISO ' + isoClass(CA).toFixed(1) + ')');
        ro.set('ss', sci(Css, 3) + ' /m³ — ' + (Css <= 3520 ? 'within the at-rest limit' : Css <= 352000 ? 'grade B in operation' : Css <= 3.52e6 ? 'only grade C in operation' : 'worse than grade C'));
        ro.set('rec', (60 * Math.log(100) / V.ach).toFixed(1) + ' min at ' + V.ach + ' air changes/h');
        ro.set('grade', (CA <= 3520 ? 'grade A zone OK' : 'grade A limit exceeded') + '; room ' + (Croom <= 3520 ? 'at-rest limit' : Croom <= 352000 ? 'in-operation limit' : 'over the grade B limit'));
      }
      function step(dm) {                                                      // dm: minutes
        const n = V.ach / 60, L = LEAK[V.bar];
        let gDoor = 0;
        if (doorT > 0) { gDoor = (V.casc ? 0.4 : 6) * 3.52e6 / 0.5; doorT -= dm; }   // m³ of grade C air carried in while the door is open
        Croom += dm * ((G() + gDoor) / VOL - n * (Croom - 20));
        const intervening = intT > 0; if (intervening) intT -= dm;
        const leak = intervening ? L[1] : L[0], local = intervening ? L[2] * V.gown : 0;
        const target = 10 + leak * Croom + local / QA;
        CA += dm * (target - CA) / 0.2;                                          // the zone is swept clean in about 0.2 min
      }
      function plotNow() {
        const room = hist.map(h => [h[0], h[1]]), za = hist.map(h => [h[0], h[2]]);
        pl.set({ x: { label: 'time (min)', min: Math.max(0, clock - 60), max: Math.max(60, clock) }, series: [{ pts: room, label: 'room (grade B)' }, { pts: za, label: 'grade A zone' }],
          hlines: [{ y: 3520, label: 'A, and B at rest: 3 520' }, { y: 352000, label: 'B in operation: 352 000' }, { y: 3.52e6, label: 'C in operation' }] });
      }
      const loop = kit.loop((dt, t) => {
        const sub = 20, dm = dt / sub;                                          // one second = one minute, fixed sub-steps
        for (let i = 0; i < sub; i++) step(dm);
        clock += dt;
        if (clock - lastPlot > 0.25) { lastPlot = clock; hist.push([clock, Croom, CA]); hist = hist.filter(h => h[0] > clock - 60); plotNow(); readout(); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // the room
        const rx = 16, ry = 26, rw = Math.min(W - 32, W * 0.72), rh = H - 52, X = u => rx + u * rw, Y = v => ry + v * rh;
        c.fillStyle = C.surface || C.bg; c.fillRect(rx, ry, rw, rh);
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.strokeRect(rx, ry, rw, rh);
        // ceiling HEPA grilles and low-level exhausts
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]);
        for (const [u, v] of [[0.12, 0.15], [0.12, 0.8], [0.88, 0.15], [0.88, 0.8]]) c.strokeRect(X(u) - 16, Y(v) - 12, 32, 24);
        c.setLineDash([]);
        kit.label(c, 'HEPA', X(0.12), Y(0.15), { align: 'center', size: 10, color: C.muted });
        c.fillStyle = C.muted; c.fillRect(X(0.35), ry + rh - 4, 40, 4); c.fillRect(X(0.6), ry + rh - 4, 40, 4);
        // the door to the airlock
        const dOpen = doorT > 0;
        c.strokeStyle = dOpen ? C.bad : C.bg2; c.lineWidth = 4; c.beginPath(); c.moveTo(rx + rw, Y(0.62)); c.lineTo(rx + rw, Y(0.86)); c.stroke();
        if (dOpen) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(rx + rw, Y(0.62)); c.lineTo(rx + rw + 22, Y(0.62) + 14); c.stroke(); }
        kit.label(c, 'airlock (grade C)' + (V.casc ? ' — air flows out' : ''), rx + rw + 6, Y(0.93), { size: 10.5, color: C.muted });
        // the grade A zone
        const ax0 = X(0.32), ay0 = Y(0.08), aw = rw * 0.36, ah = rh * 0.34;
        c.fillStyle = kit.hue(150, V.bar === 'iso' ? 0.22 : 0.12); c.fillRect(ax0, ay0, aw, ah);
        c.strokeStyle = kit.hue(150); c.lineWidth = V.bar === 'open' ? 1.5 : 3; if (V.bar === 'open') c.setLineDash([6, 4]); c.strokeRect(ax0, ay0, aw, ah); c.setLineDash([]);
        for (let i = 0; i < 6; i++) { c.fillStyle = C.muted; c.fillRect(ax0 + 10 + i * (aw - 20) / 6, ay0 + ah * 0.55, (aw - 20) / 8, ah * 0.25); }
        kit.label(c, 'grade A: ' + (V.bar === 'open' ? 'unidirectional air' : V.bar === 'rabs' ? 'RABS' : 'isolator'), ax0 + 6, ay0 + 11, { size: 11, weight: 700, color: kit.hue(150) });
        for (let i = 0; i < 4; i++) { const x = ax0 + 14 + i * (aw - 28) / 3, y0 = ay0 + 20 + ((t * 30 + i * 9) % 14); kit.arrow(c, x, y0, x, y0 + 10, kit.hue(150, 0.7), 1.3); }
        // operators: shedding dots into the room
        const speed = V.act >= 3e6 ? 0.25 : V.act >= 5e5 ? 0.04 : 0;
        for (const o of ops) {
          if (Math.hypot(o.tx - o.x, o.ty - o.y) < 0.03) { o.tx = 0.08 + 0.84 * R(); o.ty = 0.5 + 0.42 * R(); }
          const d = Math.hypot(o.tx - o.x, o.ty - o.y) || 1;
          o.x += (o.tx - o.x) / d * speed * dt; o.y += (o.ty - o.y) / d * speed * dt;
          o.x = clamp(o.x, 0.05, 0.95); o.y = clamp(o.y, 0.48, 0.95);
          const ox = X(o.x), oy = Y(o.y) + (speed ? 0 : 1.5 * Math.sin(t * 3 + o.ph));
          kit.dot(c, ox, oy, 10, V.gown === 1 ? kit.hue(200, 0.55) : V.gown === 4 ? 'hsl(0 0% 85%)' : kit.hue(30, 0.6), C.text);
          kit.dot(c, ox, oy - 3, 4, C.muted);
        }
        if (intT > 0 && ops.length) { const o = ops[0]; c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(X(o.x), Y(o.y)); c.lineTo(ax0 + aw * 0.5, ay0 + ah * 0.6); c.stroke(); }
        // particles in the room (one dot for every 15 000 particles) and in the zone (one for every 200)
        const want = clamp(Math.round(Croom * VOL / 15000), 0, 450), wantA = clamp(Math.round(CA / 200), 0, 60);
        while (dots.length < want) {
          const src = dOpen ? { x: 0.97, y: 0.74 } : ops.length ? ops[Math.floor(R() * ops.length)] : { x: R(), y: R() };
          dots.push({ x: src.x + (R() - 0.5) * 0.05, y: src.y + (R() - 0.5) * 0.05, vx: (R() - 0.5) * 0.08, vy: (R() - 0.5) * 0.08 });
        }
        if (dots.length > want) dots.splice(0, dots.length - want);
        while (dotsA.length < wantA) dotsA.push({ x: R(), y: R() * 0.3 });
        if (dotsA.length > wantA) dotsA.splice(0, dotsA.length - wantA);
        c.fillStyle = C.warn;
        for (const p of dots) {
          p.x = clamp(p.x + p.vx * dt + (R() - 0.5) * 0.01, 0.01, 0.99); p.y = clamp(p.y + p.vy * dt + (R() - 0.5) * 0.01, 0.01, 0.99);
          if (p.x > 0.32 && p.x < 0.68 && p.y > 0.08 && p.y < 0.42 && V.bar !== 'open') p.y = 0.44;
          c.fillRect(X(p.x) - 1, Y(p.y) - 1, 2.2, 2.2);
        }
        c.fillStyle = C.bad;
        for (const p of dotsA) { p.y += dt * 0.6; if (p.y > 1) p.y = 0; c.fillRect(ax0 + p.x * aw - 1, ay0 + p.y * ah - 1, 2.4, 2.4); }
        // counters
        const tx = rx + rw + 10;
        kit.label(c, 'particle counters (≥ 0.5 µm/m³)', rx, 12, { size: 11.5, color: C.muted });
        if (W - tx > 110) {
          kit.label(c, 'room', tx, Y(0.12), { size: 11.5, color: C.muted });
          kit.label(c, sci(Croom, 3), tx, Y(0.12) + 17, { size: 15, weight: 700, color: Croom <= 352000 ? C.ok : C.bad });
          kit.label(c, 'grade A', tx, Y(0.36), { size: 11.5, color: C.muted });
          kit.label(c, sci(CA, 3), tx, Y(0.36) + 17, { size: 15, weight: 700, color: CA <= 3520 ? C.ok : C.bad });
        }
      }, box.stage);
      placeOps(); readout();
      loop.start();
    }
  });

  /* ================================================================ ster-lal */
  Hyper.sim('ster-lal', {
    title: 'A kinetic LAL test for endotoxin',
    blurb: `A kinetic chromogenic test: each well holds horseshoe-crab lysate, a colourless substrate and a sample. Endotoxin sets off the clotting cascade, whose last enzyme releases a yellow dye, and the more endotoxin, the sooner the colour rises past the threshold — the **onset time**. The standards give a straight line of log onset time against log concentration; the sample is read from it. A positive product control (the sample spiked with 0.5 EU/mL) must recover 50–200 % of the spike, or the product is interfering. The limit is K/M for a hypothetical drug; the dilution may not exceed the maximum valid dilution.

**Try this**
- Test the product undiluted with strong interference: the spike is not recovered and the result is invalid. Dilute until the recovery lies within 50–200 %.
- Keep diluting past the maximum valid dilution: the test becomes blind to a product at its limit.
- Switch the route to intrathecal: the limit becomes 25 times stricter.
- Raise the maximum dose tenfold: the limit per mg falls tenfold — and a batch that passed may now fail.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.28, minH: 170 });
      const [g1, g2] = plotRow(box.stage, 2);
      const ctl = kit.controls(box.side, [
        { id: 'K', type: 'select', label: 'Route', options: [['Intravenous or intramuscular (K = 5 EU/kg)', 5], ['Intrathecal (K = 0.2 EU/kg)', 0.2]], value: 5 },
        { id: 'M', label: 'Largest dose within one hour', min: 0.01, max: 100, value: 10, unit: 'mg/kg', log: true, sig: 2 },
        { id: 'conc', label: 'Product concentration tested', min: 1, max: 100, value: 50, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'true', label: 'Endotoxin actually in the batch', min: 0.001, max: 10, value: 0.08, unit: 'EU/mg', log: true, sig: 2 },
        { id: 'dil', label: 'Dilution of the sample', min: 1, max: 10000, value: 10, unit: '×', log: true, sig: 2 },
        { id: 'ic', type: 'select', label: 'Product interference', options: [['None', 0], ['Mild', 5], ['Strong (e.g. chelating a cofactor)', 0.5]], value: 0.5 },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the plate', primary: true }] }
      ], () => { setup(); tt = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lim', 'Endotoxin limit K/M'], ['mvd', 'Maximum valid dilution'], ['res', 'Result'], ['ppc', 'Spike recovery (50–200 %)'], ['ok', 'Verdict']]);
      const pOD = kit.plot(g1, { x: { label: 'time (min)', min: 0, max: 90 }, y: { label: 'absorbance at 405 nm', min: 0, max: 1.7 }, legend: true }, 200);
      const pSC = kit.plot(g2, { x: { label: 'endotoxin (EU/mL)', log: true, min: 0.002, max: 100 }, y: { label: 'onset time (min)', log: true, min: 1, max: 150 }, legend: true }, 200);
      const STD = [50, 5, 0.5, 0.05, 0.005], LAMBDA = 0.005, SPIKE = 0.5, TEND = 5400;
      const onset = C => C > 0 ? 900 * Math.pow(C, -0.3) : Infinity;             // seconds; log T linear in log C
      const OD = (T, t) => { if (!Number.isFinite(T)) return 0.05; const w = 0.1 * T, tm = T + w * Math.log(6.5); return 0.05 + 1.5 / (1 + Math.exp(-(t - tm) / w)); };
      let wells = [], fit = null, tt = 0;
      function setup() {
        const R = rng(3), noise = () => 1 + 0.04 * (R() - 0.5);
        const cwell = V.conc / V.dil, rec = V.ic > 0 ? 1 / (1 + cwell / V.ic) : 1;       // fraction of endotoxin the lysate "sees"
        const trueWell = V.true * cwell;
        wells = STD.map(s => ({ name: s + ' EU/mL', C: s, T: onset(s) * noise(), kind: 'std' }));
        wells.push({ name: 'water (negative)', C: 0, T: Infinity, kind: 'neg' });
        wells.push({ name: 'sample', C: trueWell * rec, T: onset(trueWell * rec) * noise(), kind: 'sam' });
        wells.push({ name: 'sample + 0.5 EU/mL', C: (trueWell + SPIKE) * rec, T: onset((trueWell + SPIKE) * rec) * noise(), kind: 'ppc' });
        // least-squares line of log T against log C for the standards
        const xs = STD.map(Math.log10), ys = wells.slice(0, 5).map(w => Math.log10(w.T)), mx = xs.reduce((a, b) => a + b) / 5, my = ys.reduce((a, b) => a + b) / 5;
        let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < 5; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; }
        const b = sxy / sxx, a = my - b * mx, r = sxy / Math.sqrt(sxx * syy);
        fit = { a, b, r, read: T => Number.isFinite(T) ? Math.pow(10, (Math.log10(T) - a) / b) : 0 };
        report();
      }
      function report() {
        const lim = V.K / V.M, mvd = lim * V.conc / LAMBDA;
        ro.set('lim', sci(lim, 3) + ' EU/mg');
        ro.set('mvd', sci(mvd, 3) + ' × (now ' + sci(V.dil, 3) + ' ×' + (V.dil > mvd ? ', beyond it' : '') + ')');
        const s = wells[6], p = wells[7], done = tt >= TEND - 1;
        const cs = s.T <= tt ? fit.read(s.T) : 0, cp = p.T <= tt ? fit.read(p.T) : 0;
        const recov = (cp - (cs >= LAMBDA ? cs : 0)) / SPIKE;
        const valid = recov >= 0.5 && recov <= 2 && V.dil <= mvd;
        const content = cs >= LAMBDA ? cs * V.dil / V.conc : null, lod = LAMBDA * V.dil / V.conc;
        ro.set('res', !done && s.T > tt ? 'running…' : content != null ? sci(content, 3) + ' EU/mg' : '< ' + sci(lod, 2) + ' EU/mg (below the lowest standard)');
        ro.set('ppc', p.T > tt ? (done ? '0 % — spike not seen' : 'running…') : (recov * 100).toFixed(0) + ' %');
        if (!done) { ro.set('ok', 'reading… (r = ' + fit.r.toFixed(3) + ' for the standards)'); return; }
        ro.set('ok', V.dil > mvd ? 'invalid: diluted beyond the MVD' : !valid ? 'invalid: the product interferes — dilute further' : (content == null || content < lim) ? 'passes: below ' + sci(lim, 2) + ' EU/mg' : 'FAILS: above ' + sci(lim, 2) + ' EU/mg');
      }
      function plots() {
        const ser = [], m = tt / 60;
        wells.forEach((w, i) => {
          if (w.kind === 'neg') return;
          const pts = []; for (let k = 0; k <= 90; k++) { const t = k * TEND / 90; if (t > tt) break; pts.push([t / 60, OD(w.T, t)]); }
          ser.push({ pts, label: w.kind === 'std' ? (i === 0 ? 'standards 50 → 0.005 EU/mL' : undefined) : w.name, width: w.kind === 'std' ? 1.1 : 2.4, color: w.kind === 'std' ? kit.colors().muted : undefined, dash: w.kind === 'ppc' ? [5, 4] : undefined });
        });
        pOD.set({ series: ser, hlines: [{ y: 0.25, label: 'onset: +0.2' }], vlines: tt < TEND ? [{ x: m }] : [] });
        const stds = wells.slice(0, 5).filter(w => w.T <= tt).map(w => [w.C, w.T / 60]);
        const line = [[0.003, Math.pow(10, fit.a + fit.b * Math.log10(0.003)) / 60], [80, Math.pow(10, fit.a + fit.b * Math.log10(80)) / 60]];
        const marks = [];
        const s = wells[6], p = wells[7];
        if (s.T <= tt) marks.push({ x: Math.max(0.002, fit.read(s.T)), y: s.T / 60, label: 'sample' });
        if (p.T <= tt) marks.push({ x: Math.max(0.002, fit.read(p.T)), y: p.T / 60, label: 'spiked' });
        pSC.set({ series: [{ pts: line, label: 'standard curve', dash: [5, 4], width: 1.3 }, { pts: stds, label: 'standards', line: false, dots: 4 }], marks });
      }
      const loop = kit.loop(dt => {
        if (tt < TEND) { tt = Math.min(TEND, tt + dt * 450); plots(); report(); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const n = wells.length, gap = 8, ww = Math.min(62, (W - 32 - gap * (n - 1)) / n), x0 = (W - (ww * n + gap * (n - 1))) / 2, y0 = 30, hh = H - 78;
        kit.label(c, 'time ' + (tt / 60).toFixed(0) + ' min at 37 °C', 16, 14, { size: 12.5, weight: 700 });
        wells.forEach((w, i) => {
          const x = x0 + i * (ww + gap), od = OD(w.T, tt), a = clamp((od - 0.05) / 1.5, 0, 1);
          c.fillStyle = kit.hue(52, 0.08 + 0.85 * a); roundRect(c, x, y0, ww, hh, 8); c.fill();
          c.strokeStyle = w.kind === 'sam' || w.kind === 'ppc' ? C.accent : C.text; c.lineWidth = w.kind === 'sam' || w.kind === 'ppc' ? 2.5 : 1.3; roundRect(c, x, y0, ww, hh, 8); c.stroke();
          const lab = w.kind === 'std' ? String(w.C) : w.kind === 'neg' ? 'water' : w.kind === 'sam' ? 'sample' : '+spike';
          kit.label(c, lab, x + ww / 2, y0 + hh + 12, { align: 'center', size: ww < 48 ? 9.5 : 11 });
          kit.label(c, w.T <= tt ? (w.T / 60).toFixed(0) + ' min' : '—', x + ww / 2, y0 + hh + 27, { align: 'center', size: ww < 48 ? 9.5 : 11, color: C.muted });
        });
        kit.label(c, 'EU/mL →', x0 - 4, y0 + hh + 12, { align: 'right', size: 10.5, color: C.muted });
      }, box.stage);
      setup(); plots();
      loop.start();
    }
  });

  /* ================================================================ ster-lyo */
  const pIce = T => 3.597e12 * Math.exp(-6144.96 / (T + 273.15));                    // Pa, T in °C
  const pWater = T => 133.322 * Math.pow(10, 8.07131 - 1730.63 / (233.426 + T));        // Pa, liquid, 1–100 °C (Antoine)
  const FORMS = { suc: { name: 'sucrose', Tc: -32, w0: 5 }, tre: { name: 'trehalose', Tc: -29, w0: 5 }, man: { name: 'mannitol (crystalline)', Tc: -1.5, w0: 1.2 } };
  Hyper.sim('ster-lyo', {
    title: 'Freeze-drying a vial',
    blurb: `One vial through a whole freeze-drying cycle, 2 hours a second. The shelf freezes the solution (watch the supercooling and the jump when ice nucleates), then the chamber is evacuated and the shelf warmed. In primary drying the ice front sits at the temperature where the heat arriving from the shelf, $K_v A_v (T_s - T_p)$, equals the latent heat carried off by the vapour escaping through the dried cake. The phase diagram shows where the ice is: below the triple point, subliming towards a chamber pressure it must stay above. If the front warms past the collapse temperature, the cake above it slumps. Then secondary drying warms the cake to drive off bound water.

**Try this**
- Run the default sucrose cycle (shelf −20 °C, 10 Pa). Note how far the product runs below the shelf, and how it warms as the dried layer thickens.
- Raise the shelf to −10 °C: drying is faster — until the product crosses −32 °C near the end and the cake collapses.
- Lower the chamber pressure to 3 Pa: the vapour escapes more easily, but less heat reaches the vial. Is it faster?
- Set the chamber pressure above the ice's vapour pressure at the shelf temperature: nothing sublimes at all.
- Switch to crystalline mannitol: its eutectic at −1.5 °C allows a much warmer shelf and a far shorter cycle.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const [g1, g2] = plotRow(box.stage, 2);
      const ctl = kit.controls(box.side, [
        { id: 'Ts', label: 'Shelf temperature, primary drying', min: -40, max: 20, step: 1, value: -20, unit: '°C' },
        { id: 'Pc', label: 'Chamber pressure', min: 2, max: 40, value: 10, unit: 'Pa', log: true, sig: 2 },
        { id: 'form', type: 'select', label: 'Formulation', options: [['Protein in sucrose (collapse −32 °C)', 'suc'], ['Protein in trehalose (collapse −29 °C)', 'tre'], ['Mannitol, crystalline (eutectic −1.5 °C)', 'man']], value: 'suc' },
        { id: 'fill', label: 'Fill volume (vial of 3.8 cm² inside)', min: 1, max: 5, step: 0.5, value: 2, unit: 'mL' },
        { type: 'buttons', items: [{ id: 'run', label: 'Start the cycle again', primary: true }] }
      ], id => { if (id === 'run' || id === 'fill' || id === 'form') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['stage', 'Stage'], ['Tp', 'Product (ice front)'], ['rate', 'Sublimation'], ['ice', 'Ice left'], ['moist', 'Residual moisture'], ['time', 'Cycle time']]);
      const pPh = kit.plot(g1, { x: { label: 'temperature (°C)', min: -75, max: 30 }, y: { label: 'pressure (Pa)', log: true, min: 0.1, max: 2e5 }, legend: true }, 220);
      const pCy = kit.plot(g2, { x: { label: 'time (h)', min: 0 }, y: { label: 'temperature (°C)', min: -55, max: 35 }, legend: true }, 220);
      const AP = 3.8, AV = 3.8e-4, HS = 2840, DTH = 0.01;
      // the fixed curves of the phase diagram
      const iceLine = [], liqLine = [];
      for (let T = -75; T <= 0.01; T += 1) iceLine.push([T, pIce(T)]);
      for (let T = 0.01; T <= 30; T += 1) liqLine.push([T, pWater(T)]);
      let S = null;
      function reset() {
        const F = FORMS[V.form], L0 = V.fill / AP, m0 = V.fill * 0.95;
        S = { t: 0, stage: 'freezing', Tsh: 20, Tp: 20, frozen: 0, nucleated: false, L0, m0, m: m0, rate: 0, collapsed: 0, w: F.w0, hist: [], done: false, tPrim: 0, lastH: -1 };
      }
      const Kv = Pc => 6 + 1.2 * Pc / (1 + 0.03 * Pc);                                 // W/(m²·K): conduction through the gas rises with pressure
      const Rp = l => (1 + 12 * l / (1 + 1.5 * l)) * 133.32;                            // cm²·Pa·h/g, grows with the dried layer l (cm)
      // product temperature in primary drying: heat in = latent heat out
      function balance(Ts, Pc, l) {
        const kA = Kv(Pc) * AV, g = AP / Rp(l) * HS / 3600;
        if (pIce(Ts) <= Pc) return { Tp: Ts, rate: 0 };
        let lo = 6144.96 / Math.log(3.597e12 / Pc) - 273.15, hi = Ts;                   // the frost point of Pc, and the shelf
        for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (kA * (Ts - m) - g * (pIce(m) - Pc) > 0) lo = m; else hi = m; }
        const Tp = (lo + hi) / 2;
        return { Tp, rate: Math.max(0, AP * (pIce(Tp) - Pc) / Rp(l)) };             // g/h
      }
      function step(dh) {
        const F = FORMS[V.form];
        S.t += dh;
        if (S.stage === 'freezing') {
          S.Tsh = Math.max(-45, S.Tsh - 60 * dh);                                      // shelf cools at 1 °C/min
          if (!S.nucleated) { S.Tp += (S.Tsh - S.Tp) * dh / 0.25; if (S.Tp <= -9) { S.nucleated = true; S.Tp = -1.2; } }
          else if (S.frozen < 1) { S.frozen = Math.min(1, S.frozen + 30 * AV * Math.max(0, S.Tp - S.Tsh) * dh * 3600 / (S.m0 * 334)); if (S.frozen >= 1) S.Tp = -3; }
          else S.Tp += (S.Tsh - S.Tp) * dh / 0.25;
          if (S.frozen >= 1 && S.Tp < -40) { S.stage = 'primary'; S.tPrim = S.t; }
        } else if (S.stage === 'primary') {
          S.Tsh += clamp(V.Ts - S.Tsh, -60 * dh, 60 * dh);
          const l = S.L0 * (1 - S.m / S.m0), b = balance(S.Tsh, V.Pc, l);
          S.Tp = b.Tp; S.rate = b.rate;
          const dm = Math.min(S.m, b.rate * dh);
          if (S.Tp > F.Tc) S.collapsed += dm;                                           // cake dried above Tc slumps
          S.m -= dm;
          if (S.m <= 1e-6) { S.m = 0; S.stage = 'secondary'; S.rate = 0; S.tPrimEnd = S.t; }
        } else if (S.stage === 'secondary') {
          S.Tsh = Math.min(30, S.Tsh + 18 * dh);                                         // 0.3 °C/min to +30 °C
          S.Tp += (S.Tsh - S.Tp) * dh / 0.2;
          S.w = 0.3 + (S.w - 0.3) * Math.exp(-0.4 * Math.exp(0.05 * (S.Tp - 30)) * dh);
          if (S.w < 1.0 && S.Tsh >= 29.9) { S.stage = 'done'; S.done = true; }
        }
      }
      function plots() {
        const F = FORMS[V.form];
        const marks = [{ x: 0.01, y: 611.657, label: 'triple point' }, { x: -70, y: pIce(-70), label: 'condenser' }];
        const inVac = S.stage === 'primary' || S.stage === 'secondary' || S.stage === 'done';
        if (S.stage === 'primary') marks.push({ x: S.Tp, y: pIce(S.Tp), label: 'ice front' });
        else marks.push({ x: clamp(S.Tp, -74, 29), y: inVac ? V.Pc : 101325, label: 'product' });
        pPh.set({ series: [{ pts: iceLine, label: 'ice ⇌ vapour' }, { pts: liqLine, label: 'liquid ⇌ vapour' }, { pts: [[0.01, 611.657], [0, 1.5e5]], label: 'ice ⇌ liquid', width: 1.4 }],
          marks, hlines: [{ y: inVac ? V.Pc : 101325, label: inVac ? 'chamber ' + V.Pc.toFixed(1) + ' Pa' : 'atmosphere' }], vlines: [{ x: F.Tc, label: 'collapse' }] });
        pCy.set({ x: { label: 'time (h)', min: 0, max: Math.max(24, Math.ceil(S.t / 6) * 6) }, series: [{ pts: S.hist.map(h => [h[0], h[1]]), label: 'shelf', dash: [5, 4], width: 1.4 }, { pts: S.hist.map(h => [h[0], h[2]]), label: 'product' }],
          hlines: [{ y: F.Tc, label: 'collapse ' + F.Tc + ' °C' }] });
      }
      function report() {
        const F = FORMS[V.form];
        ro.set('stage', { freezing: 'freezing', primary: 'primary drying (sublimation)', secondary: 'secondary drying (desorption)', done: 'finished — stoppered under nitrogen' }[S.stage]);
        ro.set('Tp', S.Tp.toFixed(1) + ' °C (' + (S.Tp <= F.Tc ? (F.Tc - S.Tp).toFixed(1) + ' °C below' : (S.Tp - F.Tc).toFixed(1) + ' °C above') + ' collapse)');
        ro.set('rate', S.stage === 'primary' ? (S.rate > 0 ? S.rate.toFixed(3) + ' g/h per vial' : 'none: chamber pressure ≥ vapour pressure of the ice') : '—');
        ro.set('ice', (100 * S.m / S.m0).toFixed(0) + ' %' + (S.collapsed > 0.02 * S.m0 ? ' — ' + (100 * S.collapsed / S.m0).toFixed(0) + ' % of the cake collapsed' : ''));
        ro.set('moist', S.stage === 'secondary' || S.done ? S.w.toFixed(1) + ' %' : 'ice still present');
        ro.set('time', S.t.toFixed(1) + ' h' + (S.tPrimEnd ? ' (primary drying ' + (S.tPrimEnd - S.tPrim).toFixed(1) + ' h)' : ''));
      }
      const loop = kit.loop(dt => {
        if (!S.done) {
          const hours = dt * 2, n = Math.max(1, Math.ceil(hours / DTH));
          for (let i = 0; i < n && !S.done; i++) step(hours / n);
          if (S.t - S.lastH >= 0.1) { S.lastH = S.t; S.hist.push([S.t, S.Tsh, S.Tp]); plots(); report(); }
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, F = FORMS[V.form];
        // the shelf
        const vx = W * 0.2, vw = Math.min(110, W * 0.18), vb = H - 34, vh = H * 0.62;
        c.fillStyle = tempHue(kit, S.Tsh, -50, 30, 0.8); c.fillRect(vx - 60, vb, vw + 120, 12);
        kit.label(c, 'shelf ' + S.Tsh.toFixed(0) + ' °C', vx - 58, vb + 22, { size: 11.5, color: C.muted });
        // the vial, its ice and its cake
        const fillH = vh * 0.62 * (S.L0 / 1.32), iceH = S.stage === 'freezing' ? fillH : fillH * S.m / S.m0;
        const colH = fillH * S.collapsed / S.m0;
        if (S.stage === 'freezing') {
          c.fillStyle = S.nucleated ? kit.hue(200, 0.25 + 0.5 * S.frozen) : kit.hue(200, 0.15); c.fillRect(vx, vb - fillH, vw, fillH);
          if (S.nucleated && S.frozen < 1) kit.label(c, 'ice growing ' + (S.frozen * 100).toFixed(0) + ' %', vx + vw + 10, vb - fillH / 2, { size: 12, color: C.muted });
        } else {
          // dried cake above the ice front: porous; the part dried above Tc slumps
          const cakeTop = vb - fillH, front = vb - iceH;
          c.fillStyle = kit.hue(40, 0.25); c.fillRect(vx, cakeTop + colH * 0.6, vw, front - cakeTop - colH * 0.6);
          c.fillStyle = C.muted;
          for (let yy = cakeTop + colH * 0.6 + 3; yy < front - 2; yy += 6) for (let xx = vx + 3 + ((yy / 6) % 2) * 3; xx < vx + vw - 2; xx += 7) c.fillRect(xx, yy, 1.6, 1.6);
          if (colH > 0.5) { c.fillStyle = kit.hue(0, 0.45); c.fillRect(vx + 6, cakeTop + colH * 0.6, vw - 12, Math.min(colH * 0.5, front - cakeTop)); kit.label(c, 'collapsed', vx + vw + 10, cakeTop + colH * 0.6 + 8, { size: 12, weight: 700, color: C.bad }); }
          c.fillStyle = kit.hue(200, 0.6); c.fillRect(vx, front, vw, iceH);
          if (S.stage === 'primary' && S.rate > 0) for (let k = 0; k < 4; k++) { const x = vx + 14 + k * (vw - 28) / 3, y = cakeTop - 6 - ((S.t * 40 + k * 7) % 26); kit.arrow(c, x, y + 10, x + 3, y - 4, C.muted, 1.2); }
          if (iceH > 1) kit.label(c, 'ice ' + S.Tp.toFixed(1) + ' °C', vx + vw + 10, front + iceH / 2, { size: 12, weight: 700, color: S.Tp > F.Tc ? C.bad : kit.hue(200) });
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(vx, vb - vh); c.lineTo(vx, vb); c.lineTo(vx + vw, vb); c.lineTo(vx + vw, vb - vh); c.stroke();
        // the stopper, lifted until the end
        c.fillStyle = C.muted; const sy = S.done ? vb - vh - 4 : vb - vh - 16; c.fillRect(vx - 4, sy, vw + 8, 10);
        // chamber and condenser
        const cx = Math.max(vx + vw + 150, W * 0.62);
        if (W - cx > 120) {
          kit.label(c, S.stage === 'freezing' ? 'chamber at atmospheric pressure' : 'chamber ' + V.Pc.toFixed(1) + ' Pa', cx, H * 0.2, { size: 13, weight: 700 });
          kit.label(c, 'condenser −70 °C (ice there: ' + pIce(-70).toFixed(2) + ' Pa)', cx, H * 0.2 + 20, { size: 11.5, color: C.muted });
          const coilY = H * 0.5;
          c.strokeStyle = kit.hue(200); c.lineWidth = 2; c.beginPath();
          for (let k = 0; k <= 60; k++) { const x = cx + k * 2, y = coilY + 10 * Math.sin(k / 3); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
          const iced = clamp((S.m0 - S.m) / S.m0, 0, 1);
          c.strokeStyle = 'hsl(200 30% 92% / ' + (0.2 + 0.7 * iced) + ')'; c.lineWidth = 2 + 6 * iced; c.stroke();
          kit.label(c, 'water collected: ' + (S.m0 - S.m).toFixed(2) + ' g', cx, coilY + 30, { size: 11.5, color: C.muted });
        }
      }, box.stage);
      reset(); plots(); report();
      loop.start();
    }
  });

  /* ================================================================ ster-eye */
  Hyper.sim('ster-eye', {
    title: 'An eye drop in the tear film',
    blurb: `A drop meets an eye that holds about 7 µL of tears and at most about 30 µL in all. Whatever does not fit spills over the lid at once; the excess drains through the tear ducts within a couple of minutes, and fresh tears (about 1.2 µL a minute) keep diluting what is left. The drop's pH and tonicity move towards those of the tears (7.4, 300 mOsm/kg) — quickly if it is weakly buffered. Outside the comfort window the eye stings, and reflex tears wash the drug out many times faster. All the while a small fraction crosses the cornea. Ten minutes pass in about 20 seconds.

**Try this**
- Instil the default drop: how much overflows at once, and what fraction of the dose finally enters the eye?
- Make the drop pH 5 with a strong buffer, then with a weak one. Which stings longer, and what happens to the absorbed fraction?
- Try a 900 mOsm/kg drop, then a 150 mOsm/kg one.
- Tick the viscous vehicle: the drop drains more slowly and more of it is absorbed.
- Give a second drop straight after the first, then try again waiting five minutes: what happens to the first drug?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const [g1, g2] = plotRow(box.stage, 2);
      const ctl = kit.controls(box.side, [
        { id: 'vd', label: 'Drop volume', min: 20, max: 60, step: 1, value: 35, unit: 'µL' },
        { id: 'pH', label: 'pH of the drop', min: 3, max: 10, step: 0.1, value: 7, unit: '' },
        { id: 'beta', label: 'Buffer strength of the drop', min: 0.5, max: 50, value: 2, unit: 'mM/pH', log: true, sig: 2 },
        { id: 'osm', label: 'Tonicity of the drop', min: 100, max: 1200, step: 10, value: 300, unit: 'mOsm/kg' },
        { id: 'kc', type: 'select', label: 'Corneal permeability of the drug', options: [['Low (k_c = 0.001 /min)', 0.001], ['Typical (0.005 /min)', 0.005], ['High (0.02 /min)', 0.02]], value: 0.005 },
        { id: 'visc', type: 'check', label: 'Viscous vehicle (slower drainage)', value: false },
        { type: 'buttons', items: [{ id: 'drop', label: 'Instil a drop', primary: true }, { id: 'second', label: 'Second drop now (another medicine)' }] }
      ], id => { if (id === 'second') instil(true); else if (id === 'drop' || id === 'vd' || id === 'pH' || id === 'beta' || id === 'osm') { reset(); instil(false); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vol', 'Tear film now'], ['state', 'pH / tonicity now'], ['feel', 'How it feels'], ['left', 'Drug still in the tear film'], ['abs', 'Absorbed into the eye (so far)'], ['spill', 'Spilled at instillation']]);
      const pW = kit.plot(g1, { x: { label: 'pH of the tear film', min: 3, max: 10 }, y: { label: 'tonicity (mOsm/kg)', min: 0, max: 1250 }, legend: true }, 210);
      const pD = kit.plot(g2, { x: { label: 'time (min)', min: 0, max: 10 }, y: { label: '% of the dose', log: true, min: 0.01, max: 100 }, legend: true }, 210);
      const VT = 7, VMAX = 30, S0 = 1.2, BT = 5;                                    // µL, µL, µL/min, tears' buffer capacity (mM/pH, illustrative)
      let E = null;
      function reset() { E = { t: 0, V: VT, phi: 0, A: [], abs: [], spill: [], traj: [], hist: [], S: S0, stingT: 0, lastP: -1 }; }
      function instil(second) {
        const tot = E.V + V.vd, keep = Math.min(VMAX, tot), scale = keep / tot;
        E.A = E.A.map(a => a * scale);                                              // overflow carries earlier drugs away too
        E.phi = (E.phi * E.V + V.vd) / tot;
        E.A.push(100 * keep / tot); E.abs.push(0); E.spill.push(tot - keep);
        E.V = keep; E.dropAt = E.t;
        if (!second) E.traj = [];
      }
      const mix = () => {
        const bd = V.beta * E.phi, bt = BT * (1 - E.phi);
        return { pH: (bd * V.pH + bt * 7.4) / Math.max(1e-9, bd + bt), osm: E.phi * V.osm + (1 - E.phi) * 300 };
      };
      const sting = m => Math.max(0, (6.6 - m.pH) / 0.8, (m.pH - 7.8) / 0.8, (200 - m.osm) / 100, (m.osm - 640) / 250);
      function step(dm) {
        const m = mix(), s = sting(m);
        E.S = S0 * (1 + 12 * Math.min(1, s));                                      // reflex tearing
        const kex = V.visc ? 0.3 : 1.0, drain = E.S + kex * (E.V - VT);
        E.V += dm * (E.S - drain);
        E.phi += dm * (-E.S * E.phi / E.V);
        for (let i = 0; i < E.A.length; i++) { const a = E.A[i], da = drain / E.V * a + V.kc * a; E.abs[i] += dm * V.kc * a; E.A[i] = a - dm * da; }
        if (s > 0) E.stingT += dm;
        E.t += dm;
      }
      function plots() {
        const box = [[6.6, 200], [7.8, 200], [7.8, 640], [6.6, 640], [6.6, 200]];
        pW.set({ series: [{ pts: box, label: 'comfort window', dash: [5, 4], width: 1.5, color: kit.colors().ok }, { pts: E.traj, label: 'tear film' }],
          marks: [{ x: 7.4, y: 300, label: 'tears' }, { x: mix().pH, y: mix().osm, label: 'now' }] });
        const ser = [];
        E.A.forEach((_, i) => {
          ser.push({ pts: E.hist.map(h => [h[0], Math.max(0.01, h[1][i] || 0.01)]), label: (i ? 'second' : 'first') + ' drug in tears', dash: i ? [5, 4] : undefined });
          ser.push({ pts: E.hist.map(h => [h[0], Math.max(0.01, h[2][i] || 0.01)]), label: (i ? 'second' : 'first') + ' drug absorbed', dash: i ? [5, 4] : undefined });
        });
        pD.set({ series: ser });
      }
      function report() {
        const m = mix(), s = sting(m);
        ro.set('vol', E.V.toFixed(1) + ' µL (tears secreted ' + E.S.toFixed(1) + ' µL/min)');
        ro.set('state', 'pH ' + m.pH.toFixed(2) + ', ' + m.osm.toFixed(0) + ' mOsm/kg');
        ro.set('feel', s > 0 ? 'stinging — reflex tearing (' + E.stingT.toFixed(1) + ' min so far)' : 'comfortable' + (E.stingT > 0 ? ' now (stung for ' + E.stingT.toFixed(1) + ' min)' : ''));
        ro.set('left', E.A.map(a => a.toFixed(a < 1 ? 2 : 1) + ' %').join(' / '));
        ro.set('abs', E.abs.map(a => a.toFixed(2) + ' %').join(' / ') + ' of the dose');
        ro.set('spill', E.spill.map(v => v.toFixed(0) + ' µL').join(' / '));
      }
      const loop = kit.loop((dt, t) => {
        if (E.t < 10) {
          const mins = dt * 0.5, n = Math.max(1, Math.ceil(mins / 0.002));
          for (let i = 0; i < n; i++) step(mins / n);
          if (E.t - E.lastP > 0.05) { E.lastP = E.t; const m = mix(); E.traj.push([m.pH, m.osm]); E.hist.push([E.t, E.A.slice(), E.abs.slice()]); plots(); report(); }
        }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // the eye from the side: cornea, lids, tear film and the duct to the nose
        const ex = W * 0.28, ey = H * 0.5, R = Math.min(H * 0.36, W * 0.2);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(ex, ey, R, -1.2, 1.2); c.stroke();                       // the globe
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); c.arc(ex + R * 0.35, ey, R * 0.72, -0.75, 0.75); c.stroke();   // the cornea
        const m = mix(), s = sting(m), film = clamp(E.V / VMAX, 0.1, 1);
        c.strokeStyle = s > 0 ? kit.hue(0, 0.6) : kit.hue(190, 0.55); c.lineWidth = 3 + 12 * film;
        c.beginPath(); c.arc(ex + R * 0.35, ey, R * 0.72 + 3 + 6 * film, -0.72, 0.72); c.stroke();
        // lids
        c.fillStyle = kit.hue(20, 0.35); c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.ellipse(ex + R * 0.55, ey - R * 0.78, R * 0.42, R * 0.2, -0.5, 0, 6.2832); c.fill(); c.stroke();
        c.beginPath(); c.ellipse(ex + R * 0.55, ey + R * 0.78, R * 0.42, R * 0.2, 0.5, 0, 6.2832); c.fill(); c.stroke();
        // the duct: drainage flow as moving dots
        const dx = ex + R * 0.25, dy0 = ey + R * 0.95, drainRate = E.S + (V.visc ? 0.3 : 1) * (E.V - VT);
        c.strokeStyle = C.muted; c.lineWidth = 6; c.beginPath(); c.moveTo(dx, dy0); c.lineTo(dx - 10, H - 6); c.stroke();
        c.fillStyle = kit.hue(190, 0.8);
        for (let k = 0; k < 5; k++) { const f = ((t * (0.2 + drainRate / 10) + k / 5) % 1); c.beginPath(); c.arc(dx - 10 * f, dy0 + f * (H - 6 - dy0), 2.2, 0, 6.2832); c.fill(); }
        kit.label(c, 'to the nose: ' + drainRate.toFixed(1) + ' µL/min', dx + 10, H - 14, { size: 11, color: C.muted });
        // the falling drop, and the overflow down the cheek
        const since = E.t - (E.dropAt || 0);
        if (since < 0.15) { const y = ey - R * 1.3 + since / 0.15 * R * 0.9; kit.dot(c, ex + R * 1.05, y, 5 + V.vd / 10, kit.hue(190, 0.7), C.text); }
        const sp = E.spill.length ? E.spill[E.spill.length - 1] : 0;
        if (sp > 0 && since < 1.5) { c.strokeStyle = kit.hue(190, 0.6 * (1 - since / 1.5)); c.lineWidth = 2 + sp / 5; c.beginPath(); c.moveTo(ex + R * 0.95, ey + R * 0.8); c.quadraticCurveTo(ex + R * 1.1, ey + R * 1.1, ex + R * 1.0, H - 4); c.stroke(); kit.label(c, sp.toFixed(0) + ' µL spills over', ex + R * 1.15, ey + R * 1.05, { size: 11.5, color: C.muted }); }
        // gauges
        const tx = Math.max(ex + R * 1.6, W * 0.58);
        if (W - tx > 120) {
          kit.label(c, 't = ' + E.t.toFixed(1) + ' min', tx, H * 0.14, { size: 13, weight: 700 });
          kit.label(c, 'tear film ' + E.V.toFixed(1) + ' µL', tx, H * 0.3, { size: 12.5 });
          kit.label(c, 'pH ' + m.pH.toFixed(2) + '   ' + m.osm.toFixed(0) + ' mOsm/kg', tx, H * 0.44, { size: 12.5 });
          kit.label(c, s > 0 ? 'stinging: reflex tears ×' + (E.S / S0).toFixed(0) : 'comfortable', tx, H * 0.58, { size: 13, weight: 700, color: s > 0 ? C.bad : C.ok });
          kit.label(c, 'absorbed: ' + E.abs.map(a => a.toFixed(2) + ' %').join(' / '), tx, H * 0.74, { size: 12.5, color: C.muted });
        }
      }, box.stage);
      reset(); instil(false); plots(); report();
      loop.start();
    }
  });

  /* ================================================================ ster-routes */
  Hyper.sim('ster-routes', {
    title: 'One dose, five parenteral routes',
    blurb: `100 mg of a hypothetical drug (volume of distribution 50 L) given four ways — an intravenous bolus, a one-hour infusion, into a muscle and under the skin — and, for comparison, a long-acting depot holding ten times as much (1 g). Apart from the intravenous routes, each injection leaves a depot in the tissue that empties by first-order absorption — the blobs in the picture shrink as $e^{-k_a t}$ — while the body eliminates the drug with its own half-life. The dotted line is an illustrative effective level.

**Try this**
- Compare the peaks: which route gives the highest, which the latest? Read t_max against the formula on the page.
- Slow the subcutaneous absorption until k_a is below the elimination rate constant: the subcutaneous curve's tail now falls at the absorption rate (flip-flop).
- Switch to a log scale and a 14-day window: the depot's straight tail has the absorption half-life, not the drug's.
- Lengthen the elimination half-life: all curves rise and broaden, but the intravenous peak stays at dose/V.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1] = plotRow(box.stage, 1);
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Elimination half-life', min: 1, max: 24, step: 0.5, value: 4, unit: 'h' },
        { id: 'kasc', label: 'k_a under the skin', min: 0.02, max: 3, value: 0.35, unit: '1/h', log: true, sig: 2 },
        { id: 'kadep', label: 'k_a of the depot', min: 0.002, max: 0.1, value: 0.01, unit: '1/h', log: true, sig: 2 },
        { id: 'win', type: 'select', label: 'Time window', options: [['24 hours', 24], ['3 days', 72], ['14 days', 336]], value: 24 },
        { id: 'log', type: 'check', label: 'Logarithmic concentration axis', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Play the day again', primary: true }] }
      ], id => { if (id !== 'log') tc = 0; compute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['iv', 'IV bolus: peak'], ['inf', 'IV infusion (1 h)'], ['im', 'Intramuscular (k_a 2 /h)'], ['sc', 'Subcutaneous (F 80 %)'], ['dep', 'Depot'], ['tail', 'Tail half-life (SC / depot)']]);
      const pl = kit.plot(g1, { x: { label: 'time (h)', min: 0 }, y: { label: 'concentration (mg/L)', min: 0 }, legend: true }, 220);
      const DOSE = 100, VD = 50, CMIN = 0.3;
      const ROUTES = [
        { id: 'iv', name: 'IV bolus', dose: { route: 'iv' } }, { id: 'inf', name: 'IV infusion', dose: { route: 'infusion', duration: 1 } },
        { id: 'im', name: 'IM', ka: () => 2, F: 1 }, { id: 'sc', name: 'SC', ka: () => V.kasc, F: 0.8 }, { id: 'dep', name: 'depot (1 g)', ka: () => V.kadep, F: 1, amount: 10 * DOSE }];
      let curves = [], tc = 0;
      function compute() {
        const win = V.win, n = 240, k = Math.LN2 / V.th;
        curves = ROUTES.map(r => {
          const d = r.dose ? Object.assign({ t: 0, amount: DOSE }, r.dose) : { t: 0, amount: r.amount || DOSE, route: 'oral', ka: r.ka(), F: r.F };
          const pk = M.pk({ halfLife: V.th, Vd: VD, doses: [d] });
          const pts = []; for (let i = 0; i <= n; i++) { const t = win * i / n; pts.push([t, pk.at(t)]); }
          let best = pts[0]; for (const p of pts) if (p[1] > best[1]) best = p;
          return { r, pts, cmax: best[1], tmax: best[0], ka: r.ka ? r.ka() : null, k };
        });
        curves.forEach(cv => ro.set(cv.r.id, cv.cmax.toFixed(2) + ' mg/L at ' + (cv.tmax < 1 && cv.r.id !== 'iv' ? (cv.tmax * 60).toFixed(0) + ' min' : cv.tmax.toFixed(1) + ' h') + (cv.tmax >= V.win * 0.99 ? ' (still rising)' : '')));
        const tail = ka => (Math.LN2 / Math.min(ka, k)).toFixed(1) + ' h' + (ka < k ? ' — flip-flop' : '');
        ro.set('tail', tail(V.kasc) + ' / ' + tail(V.kadep) + ' (drug alone ' + V.th + ' h)');
        plot();
      }
      function plot() {
        const series = curves.map(cv => ({ pts: cv.pts.filter(p => p[0] <= tc + 1e-9).map(p => [p[0], V.log ? Math.max(1e-3, p[1]) : p[1]]), label: cv.r.name, dash: cv.r.id === 'dep' ? [6, 4] : undefined }));
        const top = Math.max(2.2, ...curves.map(cv => cv.cmax * 1.08));
        pl.set({ x: { label: 'time (h)', min: 0, max: V.win }, y: V.log ? { label: 'concentration (mg/L)', log: true, min: 0.005, max: top * 1.4 } : { label: 'concentration (mg/L)', min: 0, max: top },
          series, hlines: [{ y: CMIN, label: 'illustrative effective level' }], vlines: tc < V.win ? [{ x: tc }] : [] });
      }
      const loop = kit.loop((dt, t) => {
        if (tc < V.win) { tc = Math.min(V.win, tc + dt * V.win / 8); plot(); }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // a slice through skin and muscle, with a vein
        const x0 = 12, x1 = Math.max(x0 + 200, W * 0.66), y0 = 20, lay = [['epidermis', 0.06, 30], ['dermis', 0.16, 20], ['subcutaneous fat', 0.3, 48], ['muscle', 0.48, 5]];
        let y = y0; const Hs = H - 40;
        const band = {};
        for (const [name, f, hue] of lay) { const h = f * Hs; c.fillStyle = kit.hue(hue, 0.16); c.fillRect(x0, y, x1 - x0, h); kit.label(c, name, x1 - 6, y + h / 2, { align: 'right', size: 10.5, color: C.muted }); band[name] = [y, h]; y += h; }
        const vy = y0 + Hs * 0.84; c.strokeStyle = kit.hue(0, 0.55); c.lineWidth = 10; c.beginPath(); c.moveTo(x0, vy); c.lineTo(x1, vy); c.stroke();
        kit.label(c, 'vein', x0 + 6, vy, { size: 10.5, weight: 700, color: C.text });
        // depots, sized by what is still unabsorbed
        const k = Math.LN2 / V.th, sites = [['IM', 2, 1, 'muscle', 0.3], ['SC', V.kasc, 0.8, 'subcutaneous fat', 0.52], ['depot', V.kadep, 1, 'muscle', 0.72]];
        for (const [name, ka, F, where, fx] of sites) {
          const [by, bh] = band[where], left = Math.exp(-ka * tc), cx = x0 + fx * (x1 - x0), cy = by + bh / 2, r = 4 + 16 * Math.sqrt(left);
          c.fillStyle = kit.hue(265, 0.55); c.beginPath(); c.arc(cx, cy, r, 0, 6.2832); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 1; c.stroke();
          // drug leaving the depot towards the blood
          const flux = ka * left; c.fillStyle = kit.hue(265, 0.8);
          for (let i = 0; i < Math.min(6, Math.round(flux * 12) + (flux > 0.001 ? 1 : 0)); i++) { const f = (t * 0.6 + i / 6) % 1; c.beginPath(); c.arc(cx + 6 * Math.sin(i * 2), cy + r + f * (vy - cy - r), 2, 0, 6.2832); c.fill(); }
          kit.label(c, name + ': ' + (left * 100).toFixed(left < 0.1 ? 1 : 0) + ' % left', cx, cy - r - 8, { align: 'center', size: 11, weight: 700 });
        }
        // the blood level of each route now
        const tx = x1 + 14;
        if (W - tx > 120) {
          kit.label(c, 't = ' + tc.toFixed(1) + ' h', tx, 18, { size: 13, weight: 700 });
          curves.forEach((cv, i) => {
            const p = cv.pts[clamp(Math.round(tc / V.win * 240), 0, 240)][1], y = 40 + i * ((H - 50) / 5), w = Math.min(W - tx - 70, 120) * clamp(p / 2.2, 0, 1);
            c.fillStyle = C.series[i]; c.fillRect(tx, y, Math.max(1, w), 10);
            kit.label(c, cv.r.name + ' ' + p.toFixed(2), tx, y + 20, { size: 10.5, color: C.muted });
          });
        }
      }, box.stage);
      compute();
      loop.start();
    }
  });

  /* ================================================================ ster-precip */
  Hyper.sim('ster-precip', {
    title: 'A co-solvent injection meets the blood',
    blurb: `A hypothetical drug dissolved in a water–co-solvent mixture is injected into a vein. Downstream of the needle the injection mixes into the blood: its drug concentration falls in proportion to the dilution, but its solubility — which rises tenfold for every 1/σ of co-solvent fraction ($\\log S = \\log S_w + \\sigma f$) — falls much faster. Where the concentration exceeds the solubility the drug is supersaturated and may precipitate (red). The graph shows both against the dilution. This is a teaching model: real blood also binds drugs to proteins, and real products state how they may be diluted and given.

**Try this**
- Inject the default formulation into a hand vein: where does precipitation start, and does the fully mixed blood still exceed the solubility?
- Slow the injection, or choose a large central vein: the final dilution rises — but look at the region just past the needle.
- Dilute the product in a bag first: the precipitation can move into the bag itself.
- Raise σ (a more lipophilic drug): solubility in the vial soars, but the fall on dilution is steeper.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const [g1] = plotRow(box.stage, 1);
      const ctl = kit.controls(box.side, [
        { id: 'sw', label: 'Solubility in water', min: 0.001, max: 1, value: 0.02, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'sig', label: 'σ (solubilising power)', min: 1, max: 6, step: 0.1, value: 4 },
        { id: 'f0', label: 'Co-solvent in the vial', min: 0.1, max: 0.9, step: 0.05, value: 0.6, unit: '' },
        { id: 'c0', label: 'Drug concentration in the vial', min: 0.1, max: 20, value: 5, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'qi', label: 'Injection rate', min: 0.2, max: 20, value: 2, unit: 'mL/min', log: true, sig: 2 },
        { id: 'qb', type: 'select', label: 'Vein', options: [['Hand vein (≈ 20 mL/min)', 20], ['Forearm vein (≈ 60 mL/min)', 60], ['Central vein (≈ 2 L/min)', 2000]], value: 20 },
        { id: 'bag', type: 'select', label: 'Diluted in a bag first', options: [['No', 1], ['1 in 5', 5], ['1 in 20', 20], ['1 in 100', 100]], value: 1 }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['vial', 'In the vial'], ['bag', 'Injected solution'], ['mix', 'Fully mixed in the vein'], ['peak', 'Worst supersaturation'], ['msg', 'Verdict']]);
      const pl = kit.plot(g1, { x: { label: 'dilution of the vial (×)', log: true, min: 1, max: 1e4 }, y: { label: 'mg/mL', log: true, min: 1e-4, max: 100 }, legend: true }, 210);
      const S = f => V.sw * Math.pow(10, V.sig * f);
      const R = rng(5);
      let parts = [];
      const state = D => ({ C: V.c0 / D, S: S(V.f0 / D) });                        // D: dilution of the vial solution
      function update() {
        const pts = [], sol = [];
        for (let i = 0; i <= 120; i++) { const D = Math.pow(10, 4 * i / 120), s = state(D); pts.push([D, s.C]); sol.push([D, s.S]); }
        const Db = V.bag, Dv = Db * (V.qi + V.qb) / V.qi;
        const vial = state(1), bag = state(Db), mixd = state(Dv);
        let worst = 0, Dw = 1; for (let i = 0; i <= 400; i++) { const D = Db * Math.pow(Dv / Db, i / 400), s = state(D), r = s.C / s.S; if (r > worst) { worst = r; Dw = D; } }
        ro.set('vial', sci(vial.C, 3) + ' mg/mL, solubility ' + sci(vial.S, 3) + (vial.C > vial.S ? ' — cannot dissolve!' : ''));
        ro.set('bag', Db > 1 ? sci(bag.C, 3) + ' mg/mL, solubility ' + sci(bag.S, 3) + (bag.C > bag.S ? ' — precipitates in the bag' : '') : 'undiluted');
        ro.set('mix', '1 in ' + sci(Dv, 3) + ': ' + sci(mixd.C, 2) + ' mg/mL vs ' + sci(mixd.S, 2) + ' soluble');
        ro.set('peak', worst > 1 ? '×' + worst.toFixed(1) + ' over solubility (at 1 in ' + sci(Dw, 2) + ')' : 'never supersaturated');
        ro.set('msg', vial.C > vial.S ? 'reformulate: not soluble even in the vial' : bag.C > bag.S ? 'precipitates in the bag' : worst <= 1 ? 'stays in solution' : mixd.C > mixd.S ? 'precipitates in the vein' : 'transient supersaturation near the needle — risk of precipitation and phlebitis');
        pl.set({ series: [{ pts, label: 'drug concentration' }, { pts: sol, label: 'solubility' }], vlines: [{ x: Db, label: Db > 1 ? 'in the bag' : 'vial' }, { x: Dv, label: 'fully mixed' }],
          marks: worst > 1 ? [{ x: Dw, y: state(Dw).C, label: 'worst' }] : [] });
        parts = [];
        loop.once();
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 70, x1 = W - 20, yc = H * 0.55, hw = Math.min(34, H * 0.2);
        const Db = V.bag, Dv = Db * (V.qi + V.qb) / V.qi, L = x1 - x0;
        // the vein and the blood flowing through it
        c.fillStyle = kit.hue(0, 0.14); c.fillRect(x0 - 50, yc - hw, L + 50, 2 * hw);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0 - 50, yc - hw); c.lineTo(x1, yc - hw); c.moveTo(x0 - 50, yc + hw); c.lineTo(x1, yc + hw); c.stroke();
        c.fillStyle = kit.hue(0, 0.5);
        for (let i = 0; i < 18; i++) { const x = x0 - 50 + ((t * (20 + V.qb / 30) + i * 37) % (L + 50)), y = yc + ((i * 13) % (2 * hw - 10)) - hw + 5; c.beginPath(); c.ellipse(x, y, 4, 2.5, 0, 0, 6.2832); c.fill(); }
        // the needle and the plume: local dilution grows along the vein
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(x0 - 40, yc - hw - 30); c.lineTo(x0, yc); c.stroke();
        const Dx = u => Db * Math.pow(Dv / Db, 1 - Math.exp(-4 * u));                // mixing: dilution rises towards its final value
        for (let i = 0; i < 60; i++) {
          const u = i / 60, D = Dx(u), s = state(D), r = s.C / s.S, spread = hw * (0.2 + 0.8 * (1 - Math.exp(-4 * u)));
          c.fillStyle = r > 1 ? kit.hue(0, clamp(0.15 + 0.25 * Math.log10(r), 0.15, 0.8)) : kit.hue(265, 0.35 * Math.exp(-3 * u));
          c.fillRect(x0 + u * L, yc - spread, L / 60 + 1, 2 * spread);
        }
        // precipitate particles where the drug is supersaturated
        if (parts.length < 120 && R() < 0.8) {
          const u = R(), D = Dx(u), s = state(D), r = s.C / s.S;
          if (r > 1 && R() < clamp(Math.log10(r) / 1.5, 0.05, 1)) parts.push({ u, y: (R() - 0.5) * 1.6 * hw * (0.2 + 0.8 * (1 - Math.exp(-4 * u))), a: 0 });
        }
        c.fillStyle = C.text;
        for (const p of parts) { p.u += dt * 0.05; p.a += dt; const x = x0 + p.u * L; if (x < x1) c.fillRect(x - 1.5, yc + p.y - 1.5, 3, 3); }
        parts = parts.filter(p => p.u < 1 && p.a < 8);
        kit.label(c, 'injection ' + V.qi.toFixed(1) + ' mL/min', x0 - 44, yc - hw - 38, { size: 11.5, color: C.muted });
        kit.label(c, 'blood ' + (V.qb >= 1000 ? (V.qb / 1000).toFixed(0) + ' L/min' : V.qb + ' mL/min') + ' →', x0 - 46, yc + hw + 14, { size: 11.5, color: C.muted });
        kit.label(c, 'fully mixed: 1 in ' + sci(Dv, 2), x1 - 4, yc + hw + 14, { align: 'right', size: 11.5, color: C.muted });
        const s0 = state(Db), sm = state(Dv);
        kit.label(c, s0.C / s0.S > 1 || sm.C / sm.S > 1 || parts.length ? 'red: supersaturated — precipitate forming' : 'drug stays dissolved', x0, 16, { size: 12.5, weight: 700, color: parts.length ? C.bad : C.ok });
      }, box.stage);
      update();
      loop.start();
    }
  });

})();
