/* HYPER-PHARMACEUTICS · sims/drug-classes.js — simulations for Medicines by class (content/drug-classes.js).
 *   class-opioid        μ-opioid receptor occupancy, pain relief and breathing drive (operational model), tolerance,
 *                       and naloxone competing (Gaddum) — and wearing off before a long-acting opioid
 *   class-timekill      a time-kill study: Emax killing at multiples of the MIC, time- against concentration-dependent
 *                       killing, a resistant subpopulation growing out, counted by plating dilutions
 *   class-betalactamase a β-lactam in broth against β-lactamase-producing bacteria: hydrolysis (Michaelis–Menten,
 *                       proportional to the bacteria), the inoculum effect, and a suicide β-lactamase inhibitor
 *   class-insulin       insulin formulations as a subcutaneous depot: crystals and precipitates, hexamers, monomers,
 *                       plasma insulin and its action; daily injections of basal insulins reaching steady state
 *   class-statin        a statin's inhibition of HMG-CoA reductase against the circadian rhythm of cholesterol
 *                       synthesis; half-life, dosing time, the flat LDL dose–response and a CYP3A4 interaction
 *   class-logkill       chemotherapy cycles: log-kill with Gompertzian regrowth and a resistant clone, against the
 *                       neutrophil count (a Friberg-type transit model of the marrow) and G-CSF support
 *   class-fcrn          IgG half-life from FcRn recycling: an endothelial cell recycling antibodies, Fc variants,
 *                       Fab fragments, FcRn saturation by high IgG (IVIG) and an FcRn blocker
 *   class-depot         daily tablets against a long-acting depot (flip-flop kinetics): missed doses, D₂ occupancy
 *                       window or antiviral cover, and the tail after stopping
 * All drugs are hypothetical and most quantities relative: these are teaching models, never dosing tools.
 */
(function () {
  'use strict';
  const LN2 = Math.LN2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function plotGrid(box, n, min) {
    const gb = document.createElement('div');
    gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(' + (min || 280) + 'px,1fr));gap:10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // a small seeded generator (mulberry32), so pictures and missed doses are reproducible
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const pow10 = e => '10' + String(e).split('').map(c => SUP[c] || c).join('');
  function sci(v, d) {
    if (!(v > 0) || !Number.isFinite(v)) return '0';
    let e = Math.floor(Math.log10(v) + 1e-9), m = v / Math.pow(10, e);
    const dd = d == null ? 1 : d;
    if (+m.toFixed(dd) >= 10) { m /= 10; e++; }
    return (e === 0 ? m.toFixed(dd) : m.toFixed(dd) + ' × ' + pow10(e));
  }
  const pct = (f, d) => (100 * f).toFixed(d == null ? 0 : d) + ' %';
  const hrs = h => h < 1 ? Math.round(h * 60) + ' min' : h.toFixed(1) + ' h';

  /* ================================================================ opioid receptors and naloxone */
  Hyper.sim('class-opioid', {
    title: 'Opioid receptors, breathing and naloxone',
    blurb: `A conceptual model in relative units — nothing here is a dose. A μ-opioid agonist occupies receptors in proportion to its level ([A]/K_A). Pain relief needs only a small share of receptors (a large receptor reserve), while depressing the brainstem's breathing centre needs a much larger share, so it appears only at high levels. Naloxone competes for the same receptors (Gaddum's equation) and has a half-life of about an hour. Tolerance is modelled as less signal per occupied receptor. Time runs at one hour per second.

**Try this**
- Raise the opioid level until the breathing drive falls below 40 %, then give naloxone: breathing recovers within minutes — and pain relief goes with it.
- With a long-acting opioid (12 h), watch the breathing drive fall again a few hours after naloxone: its effect wears off first. Tick "repeat naloxone" to see why people are observed and may need more.
- Choose the short-acting opioid (2 h): now naloxone outlasts it.
- Set tolerance to 4×: the same level gives little relief and little respiratory depression. Then return tolerance to 1× at a high level — the danger when tolerance has been lost after a break.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const [g1, g2] = plotGrid(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'a0', label: 'Opioid level at time 0 (× level for half pain relief)', min: 0.5, max: 50, step: 0.1, value: 25, log: true },
        { id: 'tA', type: 'select', label: 'Opioid half-life', options: [['Short (2 h)', 2], ['Medium (4 h)', 4], ['Long (12 h)', 12], ['Very long (30 h)', 30]], value: 12 },
        { id: 'tol', label: 'Tolerance (less signal per receptor)', min: 1, max: 8, step: 0.5, value: 1, unit: '×' },
        { id: 'nal', type: 'check', label: 'Give naloxone', value: true },
        { id: 'tN', label: 'Naloxone given at', min: 0.25, max: 10, step: 0.25, value: 1, unit: 'h' },
        { id: 'nD', label: 'Naloxone peak (× its dissociation constant)', min: 1, max: 100, step: 1, value: 20, log: true },
        { id: 'rep', type: 'check', label: 'Repeat naloxone when the breathing drive falls below 40 %', value: false }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['now', 'Breathing drive · pain relief (now)'], ['occ', 'Receptors held: opioid · naloxone'], ['min0', 'Lowest breathing drive without naloxone'], ['relapse', 'After naloxone'], ['doses', 'Naloxone doses']]);
      const pOcc = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 12 }, y: { label: 'receptors occupied (%)', min: 0, max: 100 }, legend: true }, 190);
      const pEff = kit.plot(g2, { x: { label: 'time (h)', min: 0, max: 12 }, y: { label: 'effect (%)', min: 0, max: 100 }, legend: true }, 190);
      // pain relief: operational model with a large reserve; breathing: a steep transducer needing high occupancy
      const TAU_A = 6, TAU_R = 1.6, NR = 3, KA_PER_LEVEL = 0.2;      // level 1 → [A]/K_A = 0.2 → occupancy 1/6 → half relief
      const kN = LN2 / 1.0, kaN = 8;                                  // naloxone: half-life 1 h, peak after about 20 min
      const tpN = Math.log(kaN / kN) / (kaN - kN), normN = Math.exp(-kN * tpN) - Math.exp(-kaN * tpN);
      const nalAt = s => s <= 0 ? 0 : (Math.exp(-kN * s) - Math.exp(-kaN * s)) / normN;
      function effects(a, n, tol) {
        const p = a / (1 + a + n), q = n / (1 + a + n);
        const ta = TAU_A / tol, tr = TAU_R / tol;
        const relief = ta * p / (1 + ta * p);
        const x = Math.pow(tr * p, NR);
        return { p, q, relief, drive: 1 - x / (1 + x) };
      }
      const T = 12, DT = 0.02;
      let S = [], doses = [], info = {};
      function recompute() {
        const tA = Number(V.tA) || 12, tol = V.tol;
        doses = V.nal ? [V.tN] : [];
        S = [];
        let min0 = 1, tMin0 = 0, recovered = false, relapse = null, minAfter = 1;
        for (let i = 0; i <= Math.round(T / DT); i++) {
          const t = i * DT, a = KA_PER_LEVEL * V.a0 * Math.pow(2, -t / tA);
          let n = 0; for (const d of doses) n += V.nD * nalAt(t - d);
          const e = effects(a, n, tol), e0 = effects(a, 0, tol);
          S.push({ t, p: e.p, q: e.q, relief: e.relief, drive: e.drive, drive0: e0.drive });
          if (e0.drive < min0) { min0 = e0.drive; tMin0 = t; }
          if (doses.length && t > doses[0]) {
            if (e.drive >= 0.6) recovered = true;
            if (recovered && relapse == null && e.drive < 0.4) relapse = t;
            if (t > doses[0] + 0.3) minAfter = Math.min(minAfter, e.drive);
            if (V.rep && doses.length < 6 && e.drive < 0.4 && t > doses[doses.length - 1] + 0.5) doses.push(t);
          }
        }
        info = { min0, tMin0, relapse, minAfter };
        const ser = k => S.filter((_, i) => i % 2 === 0).map(s => [s.t, 100 * s[k]]);
        const dl = doses.map((d, i) => ({ x: d, label: i ? '' : 'naloxone' }));
        pOcc.set({ series: [{ pts: ser('p'), label: 'opioid-bound' }, { pts: ser('q'), label: 'naloxone-bound' }], vlines: dl });
        pEff.set({ series: [{ pts: ser('relief'), label: 'pain relief' }, { pts: ser('drive'), label: 'breathing drive' }, { pts: ser('drive0'), label: 'breathing, no naloxone', dash: [5, 4], width: 1.4 }],
          hlines: [{ y: 40, label: 'dangerously low' }], vlines: dl });
        ro.set('min0', pct(min0) + ' at ' + hrs(tMin0) + (min0 < 0.4 ? ' — dangerous' : ''));
        ro.set('relapse', !doses.length ? 'no naloxone given' : relapse != null ? 'breathing falls below 40 % again at ' + hrs(relapse) + ' — naloxone wore off first' + (doses.length > 1 ? '; repeat dose given' : '') : 'lowest drive afterwards ' + pct(minAfter));
        ro.set('doses', String(doses.length));
        loop.once();
      }
      const R = rng(7), perm = Array.from({ length: 24 }, (_, i) => i);
      for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const x = perm[i]; perm[i] = perm[j]; perm[j] = x; }
      const slot = new Array(24); perm.forEach((p, k) => { slot[p] = k; });
      let clock = 0, phase = 0, lastMark = -1;
      const loop = kit.loop((dt) => {
        clock = (clock + dt) % T;
        const i = clamp(Math.round(clock / DT), 0, S.length - 1), s = S[i] || { p: 0, q: 0, relief: 0, drive: 1 };
        phase += dt * 2 * Math.PI * (0.15 + 0.6 * s.drive);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the membrane and 24 receptors
        const mx0 = 16, mw = W * 0.46, my = Hh * 0.56, nA = Math.round(s.p * 24), nN = Math.round(s.q * 24);
        c.fillStyle = C.surface; c.fillRect(mx0, my - 9, mw, 18);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(mx0, my - 9, mw, 18);
        const gap = mw / 24;
        for (let k = 0; k < 24; k++) {
          const x = mx0 + gap * (k + 0.5), rank = slot[k], state = rank < nA ? 1 : rank < nA + nN ? 2 : 0;
          c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(x - gap * 0.32, my - 16); c.lineTo(x - gap * 0.32, my + 16); c.lineTo(x + gap * 0.32, my + 16); c.lineTo(x + gap * 0.32, my - 16); c.stroke();
          if (state) { c.fillStyle = state === 1 ? C.accent : C.ok; c.beginPath(); c.arc(x, my - 18, Math.max(2.5, gap * 0.26), 0, 2 * Math.PI); c.fill(); }
        }
        kit.label(c, 'μ-opioid receptors', mx0, my + 30, { align: 'left', size: 12, color: C.muted });
        kit.label(c, '● opioid ' + pct(s.p), mx0, 16, { align: 'left', size: 12, weight: 700, color: C.accent });
        kit.label(c, '● naloxone ' + pct(s.q), mx0 + 120, 16, { align: 'left', size: 12, weight: 700, color: C.ok });
        kit.label(c, 't = ' + clock.toFixed(1) + ' h', mx0, 36, { align: 'left', size: 12, color: C.text });
        // lungs breathing at a rate set by the drive
        const lx = W * 0.64, ly = Hh * 0.5, sc = Math.min(Hh * 0.3, W * 0.07) * (1 + 0.12 * s.drive * Math.sin(phase));
        const col = s.drive < 0.4 ? C.bad : s.drive < 0.6 ? C.warn : C.ok;
        c.fillStyle = col; c.globalAlpha = 0.35;
        c.beginPath(); c.ellipse(lx - sc * 0.55, ly, sc * 0.45, sc * 0.8, 0.12, 0, 2 * Math.PI); c.fill();
        c.beginPath(); c.ellipse(lx + sc * 0.55, ly, sc * 0.45, sc * 0.8, -0.12, 0, 2 * Math.PI); c.fill();
        c.globalAlpha = 1; c.strokeStyle = col; c.lineWidth = 2;
        c.beginPath(); c.moveTo(lx, ly - sc * 1.15); c.lineTo(lx, ly - sc * 0.5); c.stroke();
        kit.label(c, 'breathing drive ' + pct(s.drive), lx, ly + sc + 20, { size: 13, weight: 700, color: col });
        // pain relief bar
        const bx = W * 0.84, bh = Hh * 0.62, by = Hh * 0.16, bw = Math.min(26, W * 0.04);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(bx, by, bw, bh);
        c.fillStyle = C.series[0]; c.fillRect(bx, by + bh * (1 - s.relief), bw, bh * s.relief);
        kit.label(c, 'pain relief', bx + bw / 2, by + bh + 14, { size: 12, color: C.muted });
        kit.label(c, pct(s.relief), bx + bw / 2, by - 8, { size: 12, weight: 700, color: C.text });
        ro.set('now', pct(s.drive) + ' · ' + pct(s.relief));
        ro.set('occ', pct(s.p) + ' · ' + pct(s.q));
        if (Math.abs(clock - lastMark) > 0.25 || clock < lastMark) {
          lastMark = clock;
          pEff.set({ vlines: doses.map((d, k) => ({ x: d, label: k ? '' : 'naloxone' })).concat([{ x: clock, label: 'now', color: C.accent }]) });
        }
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ time-kill curves */
  Hyper.sim('class-timekill', {
    title: 'Time-kill curves and a resistant subpopulation',
    blurb: `A time-kill study as a microbiology laboratory runs it: a flask of 10 mL of broth inoculated with about 10⁶ bacteria per mL and an antibiotic held at a fixed multiple of the MIC, sampled over 24 hours and counted by plating dilutions (the dish on the left). Killing is an Emax (Hill) function of concentration, set so that growth and killing balance exactly at the MIC; growth slows as the flask fills. A resistant subpopulation has a higher MIC.

**Try this**
- For the time-dependent drug compare 4×, 16× and 64× the MIC: above about 4× the curves lie on top of each other — more drug does not kill faster.
- Switch to concentration-dependent killing: every step up in concentration now kills faster.
- Add resistant mutants at 1 in 10⁶ and keep the concentration between the two MICs (4×, with a resistant MIC of 16×): the count falls, then the resistant cells grow out — selection in a flask. Raise the concentration above the resistant MIC and they die too.
- Set mutants at 1 in 10⁸: with an inoculum of 10⁶ per mL the flask probably holds none; raise the inoculum to 10⁸ and they are certainly there.
- Tick drug degradation: once the level falls below the MIC, the survivors regrow.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const [g1] = plotGrid(box, 1, 320);
      const TYPES = { time: { Emax: 1.5, h: 3 }, conc: { Emax: 8, h: 1.3 }, stat: { Emax: 1.15, h: 2 } };   // kill rates in 1/h; growth 1/h
      const KG = 1.0, NMAX = 3e9, VOL = 10, DT = 0.02, TEND = 24;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Killing pattern', options: [['Time-dependent (β-lactam-like)', 'time'], ['Concentration-dependent (aminoglycoside-like)', 'conc'], ['Bacteriostatic (macrolide-like)', 'stat']], value: (params && params.type) || 'time' },
        { id: 'x', label: 'Concentration (× MIC)', min: 0.25, max: 64, step: 0.05, value: 4, log: true },
        { id: 'N0', label: 'Inoculum', min: 1e4, max: 1e8, step: 1, value: 1e6, log: true, fmt: v => sci(v) + ' CFU/mL' },
        { id: 'freq', type: 'select', label: 'Resistant mutants in the inoculum', options: [['None', 0], ['1 in 10⁸', 1e-8], ['1 in 10⁶', 1e-6]], value: 0 },
        { id: 'fold', label: 'MIC of the resistant cells (× MIC)', min: 2, max: 64, step: 1, value: 16, log: true },
        { id: 'deg', type: 'check', label: 'Drug degrades in the flask (half-life 12 h)', value: false }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Change at 6 h · 24 h'], ['cls', 'Verdict at 24 h'], ['res', 'Resistant cells'], ['rate', 'Net rate at the start']]);
      const plot = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 24 }, y: { label: 'log₁₀ CFU/mL', min: 0, max: 10 }, legend: true }, 230);
      const kill = (x) => { const T = TYPES[V.type] || TYPES.time; if (!(x > 0)) return 0; const xh = Math.pow(x, T.h); return T.Emax * xh / ((T.Emax / KG - 1) + xh); };
      let R0 = 0, cur = [];
      function run(x0, withR) {
        let S = V.N0, R = withR ? R0 : 0;
        const out = [];
        for (let i = 0; i <= Math.round(TEND / DT); i++) {
          const t = i * DT;
          if (i % 5 === 0) out.push([t, S, R]);
          const x = V.deg ? x0 * Math.pow(2, -t / 12) : x0;
          const g = KG * Math.max(0, 1 - (S + R) / NMAX);
          S *= Math.exp((g - kill(x)) * DT);
          R *= Math.exp((g - kill(x / V.fold)) * DT);
          if (S * VOL < 0.5) S = 0;                       // less than about one cell left in the flask
          if (R * VOL < 0.5) R = 0;
        }
        return out;
      }
      const lg = n => n > 0 ? Math.max(0, Math.log10(n)) : 0;
      function recompute() {
        const expected = (Number(V.freq) || 0) * V.N0 * VOL;
        R0 = expected >= 0.5 ? (Number(V.freq) || 0) * V.N0 : 0;
        cur = run(V.x, true);
        const series = [];
        [[0, 'growth control'], [0.5, '0.5× MIC'], [1, '1× MIC'], [4, '4× MIC'], [16, '16× MIC']].forEach(([x, lab]) => {
          const r = run(x, false);
          series.push({ pts: r.map(p => [p[0], lg(p[1] + p[2])]), label: lab, width: 1.2, dash: [3, 3] });
        });
        series.push({ pts: cur.map(p => [p[0], lg(p[1] + p[2])]), label: 'your flask: ' + (+V.x.toFixed(2)) + '× MIC', width: 3 });
        if (R0 > 0) series.push({ pts: cur.map(p => [p[0], lg(p[2])]), label: 'resistant cells', width: 2, dash: [6, 3], color: kit.colors().bad });
        plot.set({ series, hlines: [{ y: 2, label: 'limit of detection (100 CFU/mL)' }] });
        const at = h => { const p = cur[Math.min(cur.length - 1, Math.round(h / 0.1))]; return p[1] + p[2]; };
        const d6 = lg(at(6)) - lg(V.N0), d24 = lg(at(24)) - lg(V.N0), end = cur[cur.length - 1];
        const f = v => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1);
        ro.set('d', f(d6) + ' · ' + f(d24) + ' log₁₀');
        const took = end[2] > 0.5 * (end[1] + end[2]) && d24 > -3;
        ro.set('cls', end[1] + end[2] <= 0 ? 'no survivors in the flask' : took ? 'the resistant cells took over' : d24 <= -3 ? 'bactericidal (≥ 3 log kill)' : d24 < 0 ? 'bacteriostatic (< 3 log kill)' : 'growth — no useful effect');
        ro.set('res', R0 <= 0 ? (V.freq > 0 ? 'expected ' + expected.toFixed(2) + ' in the flask — probably none' : 'none') : end[2] > 0 ? pct(end[2] / (end[1] + end[2]), 1) + ' of survivors at 24 h' : 'killed as well');
        const r0 = KG * (1 - V.N0 / NMAX) - kill(V.x);
        ro.set('rate', (r0 / Math.LN10 >= 0 ? '+' : '−') + Math.abs(r0 / Math.LN10).toFixed(2) + ' log₁₀ per hour');
        loop.once();
      }
      const Rn = rng(11), spots = Array.from({ length: 300 }, () => { const r = Math.sqrt(Rn()) * 0.92, a = Rn() * 2 * Math.PI; return [r * Math.cos(a), r * Math.sin(a), 0.6 + 0.8 * Rn()]; });
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 3) % TEND;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const p = cur[Math.min(cur.length - 1, Math.round(clock / 0.1))] || [0, 0, 0], N = p[1] + p[2];
        let k = 0; while (N * 0.1 / Math.pow(10, k) > 300 && k < 12) k++;
        const cnt = Math.round(N * 0.1 / Math.pow(10, k)), nR = N > 0 ? Math.round(cnt * p[2] / N) : 0;
        const r = Math.min(Hh * 0.42, W * 0.16), cx = 20 + r, cy = Hh / 2;
        c.fillStyle = C.dark ? 'hsl(45 30% 22%)' : 'hsl(45 60% 88%)'; c.beginPath(); c.arc(cx, cy, r, 0, 2 * Math.PI); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 2; c.stroke();
        for (let i = 0; i < Math.min(cnt, 300); i++) {
          const sp = spots[i];
          c.fillStyle = i < nR ? C.bad : C.text; c.beginPath(); c.arc(cx + sp[0] * r, cy + sp[1] * r, Math.max(1.2, r * 0.018 * sp[2]), 0, 2 * Math.PI); c.fill();
        }
        const tx = cx + r + 22;
        kit.label(c, 't = ' + clock.toFixed(1) + ' h', tx, cy - 44, { align: 'left', size: 14, weight: 700, color: C.text });
        kit.label(c, N > 0 ? '0.1 mL of the ' + (k ? pow10(-k) + ' dilution' : 'undiluted sample') + ' → ' + cnt + ' colonies' : 'no bacteria left to plate', tx, cy - 20, { align: 'left', size: 12.5, color: C.text });
        kit.label(c, N > 0 ? 'count = ' + sci(N) + ' CFU/mL' + (k === 0 && cnt < 30 ? ' (below the countable 30–300)' : '') : 'below one cell in the flask', tx, cy + 2, { align: 'left', size: 12.5, color: C.muted });
        if (nR > 0 || p[2] > 0) kit.label(c, 'red: resistant colonies (' + pct(N > 0 ? p[2] / N : 0, 1) + ')', tx, cy + 24, { align: 'left', size: 12, color: C.bad });
        kit.label(c, 'antibiotic at ' + (+(V.deg ? V.x * Math.pow(2, -clock / 12) : V.x).toFixed(2)) + '× MIC', tx, cy + 46, { align: 'left', size: 12, color: C.accent });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ β-lactamase and an inhibitor */
  Hyper.sim('class-betalactamase', {
    title: 'β-lactamase, the inoculum effect and an inhibitor',
    blurb: `Many resistant bacteria make a **β-lactamase**, an enzyme that opens the β-lactam ring. Here a β-lactam at a fixed starting concentration meets a producing strain in broth. The enzyme works twice: inside each cell's periplasm it keeps the drug away from its target (the strain's MIC rises), and all the enzyme in the flask together destroys the drug (Michaelis–Menten, in proportion to the number of bacteria). A clavulanate-like inhibitor inactivates the enzyme irreversibly, while the cells slowly make new enzyme. Killing follows the time-dependent Emax model of the time-kill simulation; 24 hours run in 12 seconds.

**Try this**
- With the moderate producer, raise the inoculum from 5 × 10⁵ to 10⁸ CFU/mL: a drug that easily killed the small inoculum is destroyed within an hour or two by the large one — the **inoculum effect**, one reason infections with very many bacteria are hard to treat.
- Add 2–4 mg/L of inhibitor (laboratories test some combinations with a fixed 2 mg/L of clavulanate): enzyme activity falls to about a tenth, the drug survives and kills.
- Choose the strong producer: the β-lactam alone fails even at a small inoculum; the inhibitor rescues it.
- With no β-lactamase the inhibitor changes nothing — it has little antibacterial effect of its own.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const [g1, g2] = plotGrid(box, 2);
      const ENZ = { none: { v: 0, P: 0 }, mod: { v: 2e-7, P: 4 }, strong: { v: 2e-6, P: 16 } };   // v: mg/L per h per (CFU/mL) at saturation; P: periplasmic protection
      const KG = 1.0, NMAX = 3e9, MIC0 = 1, KM = 10, KDEG = LN2 / 24, KS = 0.5, KIN = 6, KI = 1, DT = 0.005, TEND = 24;
      const ctl = kit.controls(box.side, [
        { id: 'C0', label: 'β-lactam at the start', min: 1, max: 256, step: 1, value: 16, log: true, unit: 'mg/L' },
        { id: 'N0', label: 'Inoculum', min: 1e4, max: 1e9, step: 1, value: 5e5, log: true, fmt: v => sci(v) + ' CFU/mL' },
        { id: 'enz', type: 'select', label: 'β-lactamase', options: [['None', 'none'], ['Moderate producer', 'mod'], ['Strong producer', 'strong']], value: 'mod' },
        { id: 'I', label: 'Inhibitor (clavulanate-like)', min: 0, max: 16, step: 0.5, value: 0, unit: 'mg/L' },
        { id: 'cmp', type: 'check', label: 'Also show: no inhibitor', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['left', 'β-lactam left at 2 h · 6 h'], ['above', 'Time above the strain\'s MIC'], ['bact', 'Bacteria at 24 h'], ['enz', 'Enzyme still active'], ['msg', '']]);
      const pC = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 24 }, y: { label: 'β-lactam (mg/L)', log: true, min: 0.01, max: 300 }, legend: true }, 200);
      const pN = kit.plot(g2, { x: { label: 'time (h)', min: 0, max: 24 }, y: { label: 'log₁₀ CFU/mL', min: 0, max: 10 }, legend: true }, 200);
      const killAt = x => { if (!(x > 0)) return 0; const xh = x * x * x; return 1.5 * xh / (0.5 + xh); };
      function run(I) {
        const E = ENZ[V.enz] || ENZ.mod, inh = KIN * I / (KI + I);
        let N = V.N0, C = V.C0, a = 1, above = 0;
        const out = [];
        for (let i = 0; i <= Math.round(TEND / DT); i++) {
          const t = i * DT, mic = MIC0 * (1 + E.P * a);
          if (i % 20 === 0) out.push({ t, N, C, a });
          if (C > mic) above += DT;
          const g = KG * Math.max(0, 1 - N / NMAX);
          N *= Math.exp((g - killAt(C / mic)) * DT);
          if (N * 10 < 0.5) N = 0;
          C *= Math.exp(-(E.v * N * a / (KM + C) + KDEG) * DT);        // hydrolysis by all the enzyme in the flask
          a = (a + KS * DT) / (1 + (KS + inh) * DT);                      // new enzyme made; inhibitor inactivates it
        }
        return { out, above };
      }
      let A = { out: [{ t: 0, N: 0, C: 0, a: 1 }], above: 0 };
      const lg = n => n > 0 ? Math.max(0, Math.log10(n)) : 0;
      function recompute() {
        const E = ENZ[V.enz] || ENZ.mod;
        A = run(V.I);
        const B = V.I > 0 && V.cmp ? run(0) : null;
        const sC = [{ pts: A.out.map(p => [p.t, Math.max(0.004, p.C)]), label: V.I > 0 ? 'with inhibitor' : 'β-lactam', width: 2.6 }];
        const sN = [{ pts: A.out.map(p => [p.t, lg(p.N)]), label: V.I > 0 ? 'with inhibitor' : 'bacteria', width: 2.6 }];
        if (B) {
          sC.push({ pts: B.out.map(p => [p.t, Math.max(0.004, p.C)]), label: 'no inhibitor', dash: [5, 4], width: 1.6 });
          sN.push({ pts: B.out.map(p => [p.t, lg(p.N)]), label: 'no inhibitor', dash: [5, 4], width: 1.6 });
        }
        pC.set({ series: sC, hlines: [{ y: MIC0, label: 'MIC without enzyme' }].concat(E.P ? [{ y: MIC0 * (1 + E.P), label: 'MIC of the producer' }] : []) });
        pN.set({ series: sN, hlines: [{ y: 2, label: 'detection limit' }] });
        const at = h => A.out[Math.min(A.out.length - 1, Math.round(h / 0.1))];
        ro.set('left', pct(at(2).C / V.C0) + ' · ' + pct(at(6).C / V.C0));
        ro.set('above', hrs(A.above) + ' of 24 h');
        const end = A.out[A.out.length - 1], dl = lg(end.N) - lg(V.N0);
        ro.set('bact', end.N <= 0 ? 'none survive' : sci(end.N) + ' CFU/mL (' + (dl >= 0 ? '+' : '−') + Math.abs(dl).toFixed(1) + ' log)');
        ro.set('enz', E.v ? pct(end.a) : 'no enzyme');
        let msg = '';
        if (E.v && V.I <= 0 && V.N0 >= 1e7 && end.N > V.N0) msg = 'inoculum effect: this many bacteria destroy the drug';
        else if (B && B.out[B.out.length - 1].N > V.N0 && end.N < V.N0) msg = 'the inhibitor protects the β-lactam';
        else if (E.v && V.I <= 0 && end.N > V.N0) msg = 'the enzyme wins: the drug fails';
        ro.set('msg', msg);
        loop.once();
      }
      const Rn = rng(5), mols = Array.from({ length: 30 }, () => [Rn(), Rn(), Rn() * 6.28]);
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 2) % TEND;
        const p = A.out[Math.min(A.out.length - 1, Math.round(clock / 0.1))] || { N: 0, C: 0, a: 1 };
        const E = ENZ[V.enz] || ENZ.mod;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // a bacterium with its periplasm and β-lactamase
        const bx = 18, by = Hh * 0.18, bw = Math.min(W * 0.3, 240), bh = Hh * 0.64;
        c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 2;
        c.beginPath(); c.ellipse(bx + bw / 2, by + bh / 2, bw / 2, bh / 2, 0, 0, 2 * Math.PI); c.fill(); c.stroke();
        c.setLineDash([4, 3]); c.beginPath(); c.ellipse(bx + bw / 2, by + bh / 2, bw / 2 - 14, bh / 2 - 14, 0, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
        const nE = E.v ? 10 : 0, nOff = Math.round(nE * (1 - p.a));
        for (let k = 0; k < nE; k++) {
          const ang = k / nE * 2 * Math.PI + 0.3, ex = bx + bw / 2 + (bw / 2 - 7) * Math.cos(ang), ey = by + bh / 2 + (bh / 2 - 7) * Math.sin(ang);
          const off = k < nOff;
          c.fillStyle = off ? C.faint : C.warn;
          c.beginPath(); c.moveTo(ex, ey); c.arc(ex, ey, 6, ang + 0.5, ang + 2 * Math.PI - 0.5); c.closePath(); c.fill();
          if (off) { c.fillStyle = C.ok; c.beginPath(); c.arc(ex + 6 * Math.cos(ang), ey + 6 * Math.sin(ang), 2.5, 0, 2 * Math.PI); c.fill(); }
        }
        kit.label(c, p.N > 0 ? sci(p.N) + ' CFU/mL' : 'no bacteria', bx + bw / 2, by + bh / 2, { size: 12.5, weight: 700, color: C.text });
        kit.label(c, E.v ? 'β-lactamase ' + pct(p.a) + ' active' : 'no β-lactamase', bx + bw / 2, by + bh + 16, { size: 12, color: E.v ? C.warn : C.muted });
        // β-lactam molecules: intact squares, opened rings
        const fx = bx + bw + 30, fw = W - fx - 16, intact = Math.round(30 * clamp(p.C / V.C0, 0, 1));
        for (let k = 0; k < 30; k++) {
          const m = mols[k], x = fx + m[0] * fw + 3 * Math.sin(clock * 3 + m[2]), y = Hh * 0.2 + m[1] * Hh * 0.62 + 3 * Math.cos(clock * 2.3 + m[2]);
          c.strokeStyle = k < intact ? C.accent : C.faint; c.lineWidth = 2;
          c.beginPath();
          if (k < intact) c.rect(x - 5, y - 5, 10, 10);
          else { c.moveTo(x - 5, y - 5); c.lineTo(x - 5, y + 5); c.lineTo(x + 5, y + 5); }
          c.stroke();
        }
        kit.label(c, 't = ' + clock.toFixed(1) + ' h', fx, 14, { align: 'left', size: 13, weight: 700, color: C.text });
        kit.label(c, 'β-lactam ' + (p.C >= 0.1 ? p.C.toFixed(1) : p.C.toFixed(3)) + ' mg/L (□ intact, ⌞ opened)', fx + 80, 14, { align: 'left', size: 12, color: C.accent });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ insulin from a subcutaneous depot */
  Hyper.sim('class-insulin', {
    title: 'Insulin from a depot under the skin',
    blurb: `A subcutaneous injection is a depot. Soluble insulin sits there as zinc **hexamers**, which must dilute and fall apart into dimers and monomers before they can pass through capillary walls; crystals (NPH), a precipitate (glargine) or long multi-hexamer chains (degludec) add a slower first step. Insulin in plasma then acts after a delay (an effect compartment). Everything is relative — the dose is a multiple of a typical depot, not a number of units — and every formulation is shown with the same depot, so a basal insulin, spread over a day, looks low and flat beside a mealtime one.

**Try this**
- Compare the rapid-acting analogue with regular insulin: the same hormone, but faster dissociation moves the peak of action from about 2–3 h to about 1–1.5 h and shortens the tail.
- Make the regular-insulin depot four times larger: absorption slows. Warm skin (or exercise) speeds it up; cold skin slows it.
- Choose glargine or degludec with "Inject every 24 h": glargine's plateau repeats day by day, while degludec's slow release builds up over 3–4 days to a smooth steady state.
- Tick "Compare all" to see the classic action profiles side by side.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 190 });
      const [g1, g2] = plotGrid(box, 2);
      const FORMS = {
        rapid: { name: 'rapid-acting analogue', first: 'H', kH: 3.0 },
        regular: { name: 'regular (soluble) insulin', first: 'H', kH: 0.45, big: true },
        nph: { name: 'NPH (isophane suspension)', first: 'X', kX: 0.3, kH: 0.45, big: true },
        glargine: { name: 'glargine (precipitate)', first: 'X', k0: 1 / 22, Kp: 0.06, kH: 0.45 },
        degludec: { name: 'degludec (multi-hexamer chains)', first: 'X', kX: LN2 / 25, kH: 3.0 }
      };
      const KM = 1.0, KP = 8, KE0 = 1.2, EC50 = 0.5, DT = 0.01;
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'Formulation', options: [['Rapid-acting analogue', 'rapid'], ['Regular (soluble) human insulin', 'regular'], ['NPH (isophane)', 'nph'], ['Glargine', 'glargine'], ['Degludec', 'degludec']], value: 'regular' },
        { id: 'dose', label: 'Depot size (× typical)', min: 0.25, max: 4, step: 0.05, value: 1, log: true },
        { id: 'site', type: 'select', label: 'Skin blood flow', options: [['Normal', 1], ['Warm skin or exercise (+50 %)', 1.5], ['Cold skin (−30 %)', 0.7]], value: 1 },
        { id: 'rep', type: 'check', label: 'Inject every 24 h (5 days)', value: false },
        { id: 'all', type: 'check', label: 'Compare all', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['on', 'Onset of action (10 % of peak)'], ['pk', 'Peak action at'], ['dur', 'Duration (above 10 % of peak)'], ['ss', 'Trough before injection 2 · 5']]);
      const pP = kit.plot(g1, { x: { label: 'time (h)', min: 0 }, y: { label: 'plasma insulin (relative)', min: 0 }, legend: true }, 190);
      const pA = kit.plot(g2, { x: { label: 'time (h)', min: 0 }, y: { label: 'glucose-lowering action (% of max)', min: 0 }, legend: true }, 190);
      // one formulation, doses of size `dose` at the times given: [{ t, X, H, M, P, act }] every 0.1 h
      function run(key, dose, times, T) {
        const F = FORMS[key], flow = Number(V.site) || 1;
        const kH = F.kH * (F.big ? Math.pow(dose, -0.3) : 1), kM = KM * flow;
        let X = 0, H = 0, M = 0, P = 0, Ce = 0, next = 0;
        const out = [];
        for (let i = 0; i <= Math.round(T / DT); i++) {
          const t = i * DT;
          while (next < times.length && times[next] <= t + 1e-9) { if (F.first === 'X') X += dose; else H += dose; next++; }
          const plasma = KP * P;                                             // relative concentration (dose per hour cleared)
          if (i % 10 === 0) out.push({ t, X, H, M, plasma, act: 100 * Ce / (EC50 + Ce) });
          const rX = F.k0 ? F.k0 * dose * X / (F.Kp * dose + X) : (F.kX || 0) * X;
          const dX = -rX, dH = rX - kH * H, dM = kH * H - kM * M, dP = kM * M - KP * P;
          X = Math.max(0, X + dX * DT); H = Math.max(0, H + dH * DT); M = Math.max(0, M + dM * DT); P = Math.max(0, P + dP * DT);
          Ce += KE0 * (plasma - Ce) * DT;
        }
        return out;
      }
      let cur = [], T = 30;
      function stats(out) {
        const first = out.filter(p => p.t <= 24.05);
        let pk = 0, tp = 0; for (const p of first) if (p.act > pk) { pk = p.act; tp = p.t; }
        const on = first.find(p => p.act >= 0.1 * pk);
        let last = null; for (const p of first) if (p.act >= 0.1 * pk) last = p.t;
        return { pk, tp, on: on ? on.t : 0, dur: last };
      }
      function recompute() {
        T = V.rep ? 120 : 30;
        const times = V.rep ? [0, 24, 48, 72, 96] : [0];
        cur = run(V.f, V.dose, times, T);
        const C = kit.colors(), sP = [], sA = [];
        if (V.all) for (const k of Object.keys(FORMS)) if (k !== V.f) {
          const o = run(k, V.dose, times, T);
          sP.push({ pts: o.map(p => [p.t, p.plasma]), label: FORMS[k].name, width: 1.2, dash: [4, 3] });
          sA.push({ pts: o.map(p => [p.t, p.act]), label: FORMS[k].name, width: 1.2, dash: [4, 3] });
        }
        sP.push({ pts: cur.map(p => [p.t, p.plasma]), label: FORMS[V.f].name, width: 3, color: C.accent });
        sA.push({ pts: cur.map(p => [p.t, p.act]), label: FORMS[V.f].name, width: 3, color: C.accent });
        const vl = times.map((t, i) => ({ x: t, label: i ? '' : 'injection' }));
        pP.set({ x: { label: 'time (h)', min: 0, max: T }, series: sP, vlines: vl });
        pA.set({ x: { label: 'time (h)', min: 0, max: T }, series: sA, vlines: vl });
        const s = stats(run(V.f, V.dose, [0], 30));
        ro.set('on', hrs(s.on));
        ro.set('pk', hrs(s.tp) + (s.tp > 6 ? ' (a broad plateau)' : ''));
        ro.set('dur', s.dur == null ? '—' : s.dur >= 24 ? 'beyond 24 h' : hrs(s.dur));
        if (V.rep) {
          const tr = h => { const p = cur[Math.min(cur.length - 1, Math.round((h - 0.1) / 0.1))]; return p ? p.act : 0; };
          ro.set('ss', tr(24).toFixed(1) + ' % · ' + tr(96).toFixed(1) + ' % of max');
        } else ro.set('ss', 'tick "Inject every 24 h"');
        loop.once();
      }
      const Rn = rng(3), spots = Array.from({ length: 60 }, () => [Rn() * 2 - 1, Rn() * 2 - 1]);
      const drops = Array.from({ length: 24 }, () => ({ x: Rn(), y: Rn(), v: 0.5 + Rn() }));
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * (V.rep ? 8 : 2.5)) % T;
        const p = cur[Math.min(cur.length - 1, Math.round(clock / 0.1))] || { X: 0, H: 0, M: 0, plasma: 0, act: 0 };
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // skin layers
        c.fillStyle = C.dark ? 'hsl(20 25% 30%)' : 'hsl(20 45% 82%)'; c.fillRect(0, 0, W, Hh * 0.12);
        c.fillStyle = C.dark ? 'hsl(10 20% 22%)' : 'hsl(10 40% 90%)'; c.fillRect(0, Hh * 0.12, W, Hh * 0.18);
        c.fillStyle = C.dark ? 'hsl(48 30% 20%)' : 'hsl(48 70% 92%)'; c.fillRect(0, Hh * 0.3, W, Hh * 0.52);
        kit.label(c, 'epidermis', W - 8, Hh * 0.06, { align: 'right', size: 11, color: C.muted });
        kit.label(c, 'subcutaneous fat', W - 8, Hh * 0.36, { align: 'right', size: 11, color: C.muted });
        // capillary
        const cy = Hh * 0.88; c.fillStyle = C.dark ? 'hsl(0 45% 28%)' : 'hsl(0 70% 86%)'; c.fillRect(0, cy - 10, W, 20);
        kit.label(c, 'capillary: plasma insulin ' + p.plasma.toFixed(2), 10, cy, { align: 'left', size: 11.5, color: C.text });
        // the depot
        const dx = W * 0.38, dy = Hh * 0.56, rx = Math.min(W * 0.2, 150), ry = Hh * 0.2;
        c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.lineWidth = 1.5; c.beginPath(); c.ellipse(dx, dy, rx, ry, 0, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
        const scale = 1 / Math.max(0.25, V.dose), nX = Math.min(60, Math.round(24 * p.X * scale)), nH = Math.min(20, Math.round(10 * p.H * scale)), nM = Math.min(60, Math.round(40 * p.M * scale));
        c.fillStyle = C.series[1];
        for (let k = 0; k < nX; k++) { const s = spots[k]; c.fillRect(dx + s[0] * rx * 0.8 - 3, dy + s[1] * ry * 0.7 - 3, 6, 6); }
        c.fillStyle = C.accent;
        for (let k = 0; k < nH; k++) {
          const s = spots[59 - k], hx = dx + s[0] * rx * 0.75, hy = dy + s[1] * ry * 0.65;
          for (let j = 0; j < 6; j++) { c.beginPath(); c.arc(hx + 5 * Math.cos(j * Math.PI / 3), hy + 5 * Math.sin(j * Math.PI / 3), 1.8, 0, 2 * Math.PI); c.fill(); }
        }
        c.fillStyle = C.ok;
        for (let k = 0; k < nM; k++) { const s = spots[(k * 7) % 60]; c.beginPath(); c.arc(dx + s[1] * rx * 0.85, dy + s[0] * ry * 0.75, 2, 0, 2 * Math.PI); c.fill(); }
        // monomers leaving towards the capillary, in proportion to the absorption rate
        const flow = clamp(p.M * KM * scale, 0, 1.5);
        c.fillStyle = C.ok;
        for (const d of drops) {
          d.y += dt * d.v * 0.6; if (d.y > 1) { d.y = 0; d.x = Rn(); }
          if (d.x > flow / 1.5) continue;
          const x = dx - rx * 0.6 + d.x * rx * 1.2, y = dy + ry + d.y * (cy - dy - ry);
          c.beginPath(); c.arc(x, y, 2, 0, 2 * Math.PI); c.fill();
        }
        const lx = dx + rx + 18;
        kit.label(c, FORMS[V.f].name + ' — ' + clock.toFixed(1) + ' h', lx, Hh * 0.4, { align: 'left', size: 13, weight: 700, color: C.text });
        kit.label(c, '■ crystals / precipitate  ✿ hexamers  • monomers', lx, Hh * 0.4 + 18, { align: 'left', size: 11.5, color: C.muted });
        kit.label(c, 'action ' + p.act.toFixed(0) + ' % of max', lx, Hh * 0.4 + 36, { align: 'left', size: 12.5, weight: 700, color: C.accent });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ a statin against the daily rhythm of cholesterol synthesis */
  Hyper.sim('class-statin', {
    title: 'A statin and the night shift of cholesterol synthesis',
    blurb: `Statins inhibit HMG-CoA reductase in liver cells competitively. Cholesterol synthesis follows a daily rhythm, highest in the early hours of the morning. A hypothetical statin is taken once a day for a week (kit.med.pk, oral absorption; the plot shows days 7 and 8); at each hour its level in the liver gives an inhibition of level/(level + IC50), weighed against the synthesis rate at that hour. Less cholesterol made means more LDL receptors and lower blood LDL — here a simple feedback, so the LDL numbers are illustrative, not predictions for any product.

**Try this**
- With a short half-life (2 h), compare evening and morning dosing: taken in the morning, the drug has largely gone before the night-time peak of synthesis.
- Lengthen the half-life to 15–20 h: the time of day no longer matters.
- Double the dose again and again: each doubling adds only a few percentage points of LDL lowering — while the exposure doubles every time.
- Add a strong CYP3A4 inhibitor (relevant to statins metabolised by CYP3A4): exposure outside the liver rises tenfold for little extra LDL lowering — the reason for interaction warnings and muscle-toxicity concerns.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const [g1, g2] = plotGrid(box, 2);
      const AMP = 0.5, PEAK = 2, GAIN = 1.25, KA = 1.5;                  // synthesis 0.5–1.5 × mean, peak at 02:00; LDL feedback gain
      const ctl = kit.controls(box.side, [
        { id: 't12', label: 'Statin half-life', min: 1, max: 30, step: 0.5, value: 2, unit: 'h', log: true },
        { id: 'D', label: 'Dose (× the one averaging IC50 in the liver)', min: 0.25, max: 16, step: 0.05, value: 2, log: true },
        { id: 'at', type: 'select', label: 'Taken at', options: [['20:00 (evening)', 20], ['08:00 (morning)', 8]], value: 20 },
        { id: 'inter', type: 'select', label: 'Interacting drug', options: [['None', 1], ['Moderate CYP3A4 inhibitor (exposure ×3)', 3], ['Strong CYP3A4 inhibitor (exposure ×10)', 10]], value: 1 },
        { id: 'cmp', type: 'check', label: 'Also show the other dosing time', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['blk', 'Daily cholesterol synthesis blocked'], ['ldl', 'LDL-cholesterol (model)'], ['dbl', 'Extra fall from doubling the dose'], ['exp', 'Exposure outside the liver (relative)']]);
      const pDay = kit.plot(g1, { x: { label: 'clock time over two days (h)', min: 0, max: 48 }, y: { label: '% (synthesis: of its daily mean)', min: 0, max: 160 }, legend: true }, 200);
      const pDR = kit.plot(g2, { x: { label: 'dose (relative, log scale)', log: true, min: 0.25, max: 32 }, y: { label: 'LDL-cholesterol lowered (%)', min: 0, max: 70 }, legend: true }, 200);
      const synth = h => 1 + AMP * Math.cos(2 * Math.PI * (h - PEAK) / 24);
      // one week of once-daily doses at clock hour `at`; returns the last two days hour by hour
      function week(D, t12, at) {
        const k = LN2 / t12, amount = D * k * 24;                       // Vd = 1: this amount averages D (× IC50) at steady state
        const doses = Array.from({ length: 9 }, (_, d) => ({ t: at + 24 * d, amount, route: 'oral', ka: KA, F: 1 }));
        const m = kit.med.pk({ halfLife: t12, Vd: 1, doses });
        const out = [];
        for (let i = 0; i <= 192; i++) { const h = i * 0.25, lvl = m.at(144 + h); out.push({ h, lvl, inh: lvl / (lvl + 1), s: synth(h) }); }
        return out;
      }
      function blocked(o) {
        let a = 0, b = 0;
        for (const p of o) if (p.h >= 24 && p.h < 48) { a += p.s * (1 - p.inh); b += p.s; }
        return b > 0 ? 1 - a / b : 0;
      }
      const ldl = f => 1 - 1 / (1 + GAIN * f);
      let cur = [];
      function recompute() {
        const inter = Number(V.inter) || 1, at = Number(V.at) || 20, other = at === 20 ? 8 : 20;
        cur = week(V.D * inter, V.t12, at);
        const C = kit.colors(), f = blocked(cur);
        const series = [
          { pts: cur.map(p => [p.h, 100 * p.s]), label: 'synthesis, no statin', dash: [5, 4], width: 1.4, color: C.muted },
          { pts: cur.map(p => [p.h, 100 * p.s * (1 - p.inh)]), label: 'synthesis with the statin', width: 2.6, fill: true, color: C.accent },
          { pts: cur.map(p => [p.h, 100 * p.inh]), label: 'enzyme inhibited', width: 1.8, color: C.warn }
        ];
        if (V.cmp) { const o = week(V.D * inter, V.t12, other); series.push({ pts: o.map(p => [p.h, 100 * p.s * (1 - p.inh)]), label: 'synthesis, dosed at ' + other + ':00', dash: [2, 3], width: 1.6, color: C.series[3] }); }
        const dl = [at, at + 24].filter(h => h <= 48).map((h, i) => ({ x: h, label: i ? '' : 'dose' }));
        pDay.set({ series, vlines: dl });
        const grid = Array.from({ length: 25 }, (_, i) => 0.25 * Math.pow(2, i * 7 / 24));
        const dr = D => 100 * ldl(blocked(week(D, V.t12, at)));
        const s2 = [{ pts: grid.map(D => [D, dr(D)]), label: 'dosed at ' + at + ':00', width: 2.4 }];
        if (V.cmp) s2.push({ pts: grid.map(D => [D, 100 * ldl(blocked(week(D, V.t12, other)))]), label: 'dosed at ' + other + ':00', dash: [5, 4], width: 1.6 });
        const marks = [{ x: V.D, y: dr(V.D), label: 'dose' }];
        if (inter > 1) marks.push({ x: V.D * inter, y: 100 * ldl(f), label: 'with the inhibitor', color: C.bad });
        pDR.set({ series: s2, marks });
        ro.set('blk', pct(f));
        ro.set('ldl', '−' + (100 * ldl(f)).toFixed(0) + ' %');
        const f2 = blocked(week(2 * V.D * inter, V.t12, at));
        ro.set('dbl', (100 * (ldl(f2) - ldl(f))).toFixed(1) + ' percentage points (exposure ×2)');
        ro.set('exp', '×' + (V.D * inter).toFixed(V.D * inter < 10 ? 2 : 1) + (inter > 1 ? ' — muscle-toxicity risk rises with it' : ''));
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 2) % 48;
        const i = clamp(Math.round(clock / 0.25), 0, cur.length - 1), p = cur[i] || { lvl: 0, inh: 0, s: 1 };
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // a 24-hour clock
        const R = Math.min(Hh * 0.38, W * 0.12), cx = 20 + R, cy = Hh / 2, hr = clock % 24, night = hr < 6 || hr >= 21;
        c.fillStyle = night ? (C.dark ? 'hsl(230 30% 18%)' : 'hsl(230 40% 85%)') : (C.dark ? 'hsl(45 30% 22%)' : 'hsl(45 80% 90%)');
        c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 2; c.stroke();
        for (let h = 0; h < 24; h += 3) { const a = h / 24 * 2 * Math.PI - Math.PI / 2; kit.label(c, String(h), cx + (R - 11) * Math.cos(a), cy + (R - 11) * Math.sin(a), { size: 10, color: C.muted }); }
        const ah = hr / 24 * 2 * Math.PI - Math.PI / 2; kit.arrow(c, cx, cy, cx + (R - 20) * Math.cos(ah), cy + (R - 20) * Math.sin(ah), C.text, 2.5);
        const ad = (Number(V.at) || 20) / 24 * 2 * Math.PI - Math.PI / 2;
        c.fillStyle = C.series[1]; c.beginPath(); c.ellipse(cx + (R + 9) * Math.cos(ad), cy + (R + 9) * Math.sin(ad), 7, 4, ad, 0, 2 * Math.PI); c.fill();
        kit.label(c, (night ? 'night ' : 'day ') + String(Math.floor(hr)).padStart(2, '0') + ':' + String(Math.floor((hr % 1) * 60)).padStart(2, '0'), cx, cy + R + 16, { size: 12, weight: 700, color: C.text });
        // a liver cell: 12 reductase enzymes, inhibited ones grey
        const lx = cx + R + 40, lw = Math.min(W - lx - 16, 330), ly = Hh * 0.16, lh = Hh * 0.68;
        c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.rect(lx, ly, lw, lh); c.fill(); c.stroke();
        const nOff = Math.round(12 * p.inh);
        for (let k = 0; k < 12; k++) {
          const ex = lx + 24 + (k % 6) * Math.max(14, (lw * 0.5 - 30) / 5), ey = ly + lh * (k < 6 ? 0.35 : 0.62);
          c.fillStyle = k < nOff ? C.faint : C.warn; c.beginPath(); c.arc(ex, ey, 6, 0, 2 * Math.PI); c.fill();
          if (k < nOff) { c.fillStyle = C.accent; c.beginPath(); c.arc(ex + 5, ey - 5, 3, 0, 2 * Math.PI); c.fill(); }
        }
        kit.label(c, 'HMG-CoA reductase: ' + pct(p.inh) + ' inhibited', lx + 10, ly + 14, { align: 'left', size: 12, color: C.text });
        kit.label(c, 'synthesis now ' + pct(p.s * (1 - p.inh)) + ' of the daily mean (untreated ' + pct(p.s) + ')', lx + 10, ly + lh - 12, { align: 'left', size: 11.5, color: C.muted });
        kit.label(c, 'statin in the liver: ' + p.lvl.toFixed(2) + ' × IC50', lx + lw * 0.55, ly + lh * 0.5, { align: 'left', size: 12, weight: 700, color: C.accent });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ chemotherapy cycles, tumour and marrow */
  Hyper.sim('class-logkill', {
    title: 'Chemotherapy cycles: log-kill, regrowth and the marrow',
    blurb: `Each cycle of a cytotoxic drug kills a fixed fraction of tumour cells — a number of logs — and the tumour regrows between cycles (Gompertzian growth: faster when small). A resistant clone, present from the start, loses only a tenth as many logs. The same drug hits the dividing cells of the bone marrow: neutrophils fall to a nadir and recover through a chain of maturing cells with feedback (a Friberg-type model), and the next cycle should wait for recovery. Dose intensity scales both. Illustrative parameters, not a regimen.

**Try this**
- With the default settings, note when the tumour becomes undetectable (below about 10⁹ cells) and how many cells are still there.
- Shorten the interval from 21 to 14 days: the tumour is controlled better — but the neutrophils have not recovered before the next cycle. Add G-CSF support.
- Make the tumour grow fast (doubling 5–10 days): regrowth between cycles eats up much of each cycle's kill.
- Start with resistant cells at 1 in 10⁵: the sensitive cells vanish, and the resistant clone grows back — relapse with a tumour that no longer responds.
- Lower the dose intensity to 0.7: kinder to the marrow, but the tumour is not eradicated.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.22, minH: 150 });
      const [g1, g2] = plotGrid(box, 2);
      const K = 1e12, LM = 1.1, C0 = 5, DT = 0.05;                      // LM: logs of marrow progenitors killed at full dose
      const ctl = kit.controls(box.side, [
        { id: 'dose', label: 'Dose intensity (relative)', min: 0.25, max: 1.5, step: 0.05, value: 1 },
        { id: 'L', label: 'Tumour log-kill per cycle at full dose', min: 0.5, max: 4, step: 0.1, value: 2 },
        { id: 'tau', label: 'Interval between cycles', min: 7, max: 42, step: 1, value: 21, unit: 'days' },
        { id: 'n', label: 'Number of cycles', min: 1, max: 12, step: 1, value: 6 },
        { id: 'Td', label: 'Tumour doubling time (at 10⁹ cells)', min: 5, max: 200, step: 1, value: 30, unit: 'days', log: true },
        { id: 'N0', type: 'select', label: 'Tumour at the start', options: [['10⁹ cells (about 1 cm³)', 1e9], ['10¹⁰ cells', 1e10], ['10¹¹ cells (about 100 cm³)', 1e11]], value: 1e10 },
        { id: 'res', type: 'select', label: 'Resistant cells at the start', options: [['None', 0], ['1 in 10⁷', 1e-7], ['1 in 10⁵', 1e-5]], value: 0 },
        { id: 'gcsf', type: 'check', label: 'G-CSF support (faster marrow recovery)', value: false }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['end', 'Tumour after the last cycle'], ['nad', 'Neutrophil nadir (cycle 1)'], ['rec', 'Marrow recovered before each cycle?'], ['res', 'Resistant cells at the end'], ['out', 'Outcome in this model']]);
      const pT = kit.plot(g1, { x: { label: 'days', min: 0 }, y: { label: 'log₁₀ tumour cells', min: -2, max: 12.5 }, legend: true }, 200);
      const pM = kit.plot(g2, { x: { label: 'days', min: 0 }, y: { label: 'neutrophils (×10⁹/L)', min: 0, max: 8 }, legend: true }, 200);
      let out = [], Tend = 250, cycles = [], postKill = [];
      function recompute() {
        const n = Math.round(V.n), tau = V.tau, N0 = Number(V.N0) || 1e10, fr = Number(V.res) || 0;
        const b = LN2 / (V.Td * Math.log(K / 1e9));                           // Gompertz rate giving doubling time Td at 10⁹ cells
        const MTT = V.gcsf ? 4 : 6, ktr = 4 / MTT, gam = 0.17;              // mean transit time of maturing neutrophils (days)
        cycles = Array.from({ length: n }, (_, k) => k * tau);
        Tend = Math.min(420, (n - 1) * tau + 150);
        let S = N0 * (1 - fr), R = N0 * fr, P = C0, T1 = C0, T2 = C0, T3 = C0, Ci = C0, next = 0;
        out = [];
        const recov = [];
        postKill = [];
        for (let i = 0; i <= Math.round(Tend / DT); i++) {
          const t = i * DT;
          while (next < n && cycles[next] <= t + 1e-9) {
            if (next > 0) recov.push(Ci);
            S *= Math.pow(10, -V.L * V.dose); R *= Math.pow(10, -0.1 * V.L * V.dose); P *= Math.pow(10, -LM * V.dose);
            postKill.push(S + R);                                            // expected survivors (may be below one)
            if (S < 0.5) S = 0; if (R < 0.5) R = 0;                           // fewer than half a cell expected: taken as none left
            next++;
          }
          if (i % 10 === 0) out.push({ t, S, R, Ci });
          const Ntot = S + R, gr = Ntot > 0 ? b * Math.log(K / Math.max(1, Ntot)) : 0;
          S *= Math.exp(gr * DT); R *= Math.exp(gr * DT);
          const fb = Math.pow(C0 / Math.max(0.05, Ci), gam);
          const dP = ktr * P * fb - ktr * P, d1 = ktr * (P - T1), d2 = ktr * (T1 - T2), d3 = ktr * (T2 - T3), dC = ktr * (T3 - Ci);
          P += dP * DT; T1 += d1 * DT; T2 += d2 * DT; T3 += d3 * DT; Ci += dC * DT;
        }
        const C = kit.colors(), lg = x => x > 0 ? Math.max(-2, Math.log10(x)) : -2;
        const sT = [{ pts: out.map(p => [p.t, lg(p.S + p.R)]), label: 'all tumour cells', width: 2.6 }];
        if (fr > 0) sT.push({ pts: out.map(p => [p.t, lg(p.R)]), label: 'resistant clone', dash: [6, 3], width: 2, color: C.bad });
        const vl = cycles.map((t, k) => ({ x: t, label: k ? '' : 'cycle' }));
        pT.set({ x: { label: 'days', min: 0, max: Tend }, series: sT, vlines: vl, hlines: [{ y: 9, label: 'detectable (about 1 cm³)' }, { y: 0, label: 'one cell' }] });
        pM.set({ x: { label: 'days', min: 0, max: Tend }, series: [{ pts: out.map(p => [p.t, p.Ci]), label: 'neutrophils', width: 2.4 }], vlines: vl, hlines: [{ y: 1.5, label: 'usually needed for the next cycle' }, { y: 0.5, label: 'severe neutropenia' }] });
        // readouts
        const lastT = cycles[n - 1], minAfter = postKill.length ? postKill[postKill.length - 1] : N0;
        ro.set('end', minAfter <= 0 ? 'none left' : minAfter < 3 ? (minAfter >= 0.01 ? minAfter.toFixed(2) : sci(minAfter)) + ' cells on average — chance that none survives ' + pct(Math.exp(-minAfter)) : sci(minAfter) + ' cells' + (minAfter < 1e9 ? ' — undetectable' : ''));
        let nad = Infinity, tn = 0; for (const p of out) if (p.t < (n > 1 ? tau : Tend) && p.Ci < nad) { nad = p.Ci; tn = p.t; }
        ro.set('nad', nad.toFixed(2) + ' ×10⁹/L on day ' + Math.round(tn));
        const bad = recov.findIndex(v => v < 1.5);
        ro.set('rec', n < 2 ? 'one cycle only' : bad < 0 ? 'yes' : 'no — cycle ' + (bad + 2) + ' starts at ' + recov[bad].toFixed(2) + ' ×10⁹/L');
        const e = out[out.length - 1];
        ro.set('res', fr <= 0 ? 'none at the start' : e.R > 0 ? sci(e.R) + ' cells' : 'eradicated too');
        const relapse = out.find(p => p.t > lastT && p.S + p.R >= 1e9 && minAfter < 1e9);
        ro.set('out', e.S + e.R <= 0 ? 'no cells left: cure in this model' : relapse ? 'undetectable, then detectable again on day ' + Math.round(relapse.t) + (e.R > e.S ? ' (resistant)' : '') : minAfter < 1e9 ? (e.R > e.S ? 'undetectable, but the resistant clone is regrowing' : 'undetectable, but cells remain') : 'tumour not controlled');
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * Tend / 14) % Tend;
        const p = out[Math.min(out.length - 1, Math.round(clock / (10 * DT)))] || { S: 0, R: 0, Ci: C0 };
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // timeline with cycles and a cursor
        const x0 = 20, x1 = W - 20, y = Hh * 0.78, X = t => x0 + (x1 - x0) * t / Tend;
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
        c.fillStyle = C.accent; for (const t of cycles) { c.beginPath(); c.moveTo(X(t), y - 9); c.lineTo(X(t) - 5, y - 18); c.lineTo(X(t) + 5, y - 18); c.closePath(); c.fill(); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(clock), y - 26); c.lineTo(X(clock), y + 8); c.stroke();
        kit.label(c, 'day ' + Math.round(clock), X(clock), y + 18, { size: 12, weight: 700, color: C.text });
        // tumour and marrow gauges
        const N = p.S + p.R, lgN = N > 0 ? Math.log10(N) : -Infinity, r = N > 0 ? clamp(4 + 3.2 * lgN, 2, Hh * 0.28) : 0;
        const tx = W * 0.2, ty = Hh * 0.3;
        if (r > 0) { c.fillStyle = N >= 1e9 ? C.bad : C.warn; c.globalAlpha = 0.6; c.beginPath(); c.arc(tx, ty, r, 0, 2 * Math.PI); c.fill(); c.globalAlpha = 1; }
        kit.label(c, N > 0 ? 'tumour: ' + sci(N) + ' cells' + (N < 1e9 ? ' (below detection)' : '') : 'tumour: no cells left', tx + Hh * 0.3 + 10, ty, { align: 'left', size: 12.5, weight: 700, color: C.text });
        const mx = W * 0.62, mw = Math.min(W * 0.3, 220), frac = clamp(p.Ci / 8, 0, 1);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(mx, ty - 8, mw, 16);
        c.fillStyle = p.Ci < 0.5 ? C.bad : p.Ci < 1.5 ? C.warn : C.ok; c.fillRect(mx, ty - 8, mw * frac, 16);
        kit.label(c, 'neutrophils ' + p.Ci.toFixed(1) + ' ×10⁹/L', mx, ty - 18, { align: 'left', size: 12, color: C.text });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ FcRn recycling and antibody half-life */
  Hyper.sim('class-fcrn', {
    title: 'FcRn: why antibodies last three weeks',
    blurb: `Cells lining the blood vessels drink plasma all the time. In their acidic endosomes (pH 6) the neonatal Fc receptor, **FcRn**, binds IgG by its Fc part and carries it back to the surface, where at pH 7.4 it lets go; whatever is not bound goes on to the lysosome and is digested. The fraction rescued on each pass sets the half-life, $t_{1/2} = \\ln 2/[k_\\text{up}(1 - f_r)]$. A therapeutic antibody competes with the body's own IgG for a limited number of receptors. Illustrative parameters, calibrated to typical human half-lives (IgG1 about 21 days).

**Try this**
- Compare the IgG1 antibody with the Fc-engineered one: a few per cent more rescue per pass gives about three times the half-life.
- Choose the variant that also binds FcRn at pH 7.4: it is not released at the surface and much of it ends in lysosomes — tighter binding is not always better.
- The Fab fragment has no Fc and is small enough to be filtered by the kidney: its half-life is under a day.
- Raise the body's own IgG level, or give high-dose IVIG: FcRn saturates and every IgG, the drug included, is cleared faster.
- Tick the FcRn blocker: the patient's own IgG falls by about two-thirds over a few weeks — how such blockers treat antibody-driven diseases.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const [g1, g2] = plotGrid(box, 2);
      const VAR = {
        igg1: { name: 'IgG1 antibody', K: 10, eff: 0.97, ren: 0 },
        yte: { name: 'Fc-engineered IgG1', K: 1, eff: 0.97, ren: 0 },
        igg3: { name: 'IgG3-like (weak FcRn binding)', K: 50, eff: 0.97, ren: 0 },
        sticky: { name: 'binds FcRn at pH 7.4 too', K: 1, eff: 0.6, ren: 0 },
        fab: { name: 'Fab fragment (no Fc)', K: Infinity, eff: 0, ren: LN2 / 0.7 }
      };
      const KUP = LN2 / 3, KEND = 10, EFF = 0.97, MOLAR = 1e6 / 150000;   // uptake per day; own IgG (K in µM); g/L → µM for IgG
      const G_REF = 10 * MOLAR, F_REF = 0.884, R_REF = F_REF / (1 - F_REF) * KEND, RTOT = R_REF + G_REF * F_REF;
      const ctl = kit.controls(box.side, [
        { id: 'v', type: 'select', label: 'Molecule', options: [['IgG1 antibody', 'igg1'], ['Fc-engineered IgG1 (tighter at pH 6)', 'yte'], ['IgG3-like (weaker FcRn binding)', 'igg3'], ['Binds FcRn at pH 7.4 too', 'sticky'], ['Fab fragment (no Fc)', 'fab']], value: 'igg1' },
        { id: 'G0', label: 'The body\'s own IgG', min: 3, max: 30, step: 0.5, value: 10, unit: 'g/L' },
        { id: 'ivig', type: 'check', label: 'High-dose IVIG on day 0 (+25 g/L)', value: false },
        { id: 'blk', type: 'check', label: 'FcRn blocker from day 0 (80 % of receptors)', value: false }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Rescued per pass (day 0)'], ['half', 'Half-life at day 0 · day 60'], ['left', 'Antibody left at day 28 · 84'], ['igg', 'Own IgG at day 28']]);
      const pD = kit.plot(g1, { x: { label: 'days', min: 0, max: 120 }, y: { label: 'antibody (% of the level on day 0)', log: true, min: 0.1, max: 100 }, legend: true }, 200);
      const pG = kit.plot(g2, { x: { label: 'days', min: 0, max: 120 }, y: { label: 'own IgG (g/L)', min: 0 }, legend: true }, 200);
      // free FcRn when IgG (µM, affinity KEND) competes for RTOT receptors
      function freeR(G, Rt) {
        let lo = 0, hi = Rt;
        for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (m + G * m / (m + KEND) > Rt) hi = m; else lo = m; }
        return (lo + hi) / 2;
      }
      const kelG = f => KUP * (1 - EFF * f);
      function run(vk, G0gl, ivig, blk) {
        const M = VAR[vk] || VAR.igg1, G0 = G0gl * MOLAR, Rt0 = RTOT;
        const fG0 = (() => { const r = freeR(G0, Rt0); return r / (r + KEND); })();
        const syn = kelG(fG0) * G0;                                          // synthesis that holds the baseline level
        let G = G0 + (ivig ? 25 * MOLAR : 0), D = 100;
        const out = [], DT = 0.1;
        for (let i = 0; i <= 1200; i++) {
          const t = i * DT, Rt = blk ? Rt0 * 0.2 : Rt0, r = freeR(G, Rt);
          const fG = r / (r + KEND), fD = Number.isFinite(M.K) ? r / (r + M.K) : 0;
          const kD = KUP * (1 - M.eff * fD) + M.ren;
          if (i % 5 === 0) out.push({ t, D, G: G / MOLAR, fD: M.eff * fD, kD });
          D *= Math.exp(-kD * DT);
          G += (syn - kelG(fG) * G) * DT;
        }
        return out;
      }
      let cur = [], rescued = 0, digested = 0;
      function recompute() {
        rescued = 0; digested = 0;
        cur = run(V.v, V.G0, V.ivig, V.blk);
        const ref = run('igg1', 10, false, false), C = kit.colors();
        const sD = [{ pts: cur.map(p => [p.t, Math.max(0.05, p.D)]), label: VAR[V.v].name, width: 2.8, color: C.accent }];
        if (V.v !== 'igg1' || V.G0 !== 10 || V.ivig || V.blk) sD.push({ pts: ref.map(p => [p.t, Math.max(0.05, p.D)]), label: 'IgG1, normal IgG level', dash: [5, 4], width: 1.5, color: C.muted });
        pD.set({ series: sD, hlines: [{ y: 50, label: '50 %' }] });
        pG.set({ series: [{ pts: cur.map(p => [p.t, p.G]), label: 'own IgG', width: 2.4 }], hlines: [{ y: V.G0, label: 'baseline' }] });
        const at = d => cur[Math.min(cur.length - 1, Math.round(d / 0.5))];
        ro.set('f', pct(cur[0].fD, 1));
        const hl = k => { const h = LN2 / k; return h < 2 ? (h * 24).toFixed(0) + ' h' : h.toFixed(h < 10 ? 1 : 0) + ' days'; };
        ro.set('half', hl(cur[0].kD) + ' · ' + hl(at(60).kD));
        const fp = v => v >= 1 ? v.toFixed(0) + ' %' : v >= 0.01 ? v.toPrecision(2) + ' %' : 'under 0.01 %';
        ro.set('left', fp(at(28).D) + ' · ' + fp(at(84).D));
        ro.set('igg', at(28).G.toFixed(1) + ' g/L (baseline ' + V.G0 + ')');
        loop.once();
      }
      // the endothelial cell: antibodies taken up, sorted in the endosome, rescued or digested
      const Rn = rng(21);
      const parts = Array.from({ length: 16 }, (_, i) => ({ s: 'plasma', x: Rn(), y: Rn(), p: 0, wait: Rn() * 3, fate: 0 }));
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const top = Hh * 0.3, pitX = W * 0.22, exitX = W * 0.48, ex = W * 0.34, ey = Hh * 0.64, er = Hh * 0.17, lx = W * 0.72, ly = Hh * 0.68, lr = Hh * 0.13;
        const pr = cur.length ? cur[0].fD : 0.85;
        c.fillStyle = C.dark ? 'hsl(0 40% 22%)' : 'hsl(0 70% 92%)'; c.fillRect(0, 0, W, top);
        c.fillStyle = C.surface; c.fillRect(0, top, W, Hh - top);
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(0, top); c.lineTo(W, top); c.stroke();
        kit.label(c, 'blood plasma, pH 7.4', 10, 14, { align: 'left', size: 12, color: C.text });
        kit.label(c, 'endothelial cell', 10, Hh - 12, { align: 'left', size: 11.5, color: C.muted });
        c.fillStyle = C.dark ? 'hsl(200 40% 25%)' : 'hsl(200 70% 90%)'; c.beginPath(); c.arc(ex, ey, er, 0, 2 * Math.PI); c.fill(); c.strokeStyle = C.muted; c.stroke();
        kit.label(c, 'endosome, pH 6', ex, ey + er + 12, { size: 11.5, color: C.muted });
        c.fillStyle = C.dark ? 'hsl(30 40% 25%)' : 'hsl(30 80% 88%)'; c.beginPath(); c.arc(lx, ly, lr, 0, 2 * Math.PI); c.fill(); c.strokeStyle = C.muted; c.stroke();
        kit.label(c, 'lysosome', lx, ly + lr + 12, { size: 11.5, color: C.muted });
        // FcRn on the endosome membrane
        c.strokeStyle = C.ok; c.lineWidth = 2;
        for (let k = 0; k < 10; k++) { const a = -Math.PI * 0.9 + k * Math.PI * 0.2, x = ex + er * Math.cos(a), y = ey + er * Math.sin(a); c.beginPath(); c.arc(x, y, 3.5, 0, Math.PI); c.stroke(); }
        const drawY = (x, y, col, alpha) => {
          c.globalAlpha = alpha == null ? 1 : alpha; c.strokeStyle = col; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x, y + 6); c.lineTo(x, y); c.lineTo(x - 5, y - 6); c.moveTo(x, y); c.lineTo(x + 5, y - 6); c.stroke(); c.globalAlpha = 1;
        };
        const lerp = (a, b, f) => a + (b - a) * f;
        for (const q of parts) {
          if (q.s === 'plasma') {
            q.x = (q.x + dt * 0.03) % 1; q.wait -= dt;
            drawY(q.x * W, 20 + q.y * (top - 34), C.accent);
            if (q.wait <= 0 && Math.abs(q.x * W - pitX) < 30) { q.s = 'in'; q.p = 0; q.x0 = q.x * W; q.y0 = 20 + q.y * (top - 34); }
          } else if (q.s === 'in') {
            q.p += dt * 0.8; const f = Math.min(1, q.p);
            drawY(lerp(q.x0, ex + (Rn() - 0.5), f), lerp(q.y0, ey, f), C.accent);
            if (q.p >= 1) { q.s = 'endo'; q.p = 0; q.fate = Rn() < pr ? 1 : 0; q.a = -Math.PI * 0.9 + Math.floor(Rn() * 10) * Math.PI * 0.2; }
          } else if (q.s === 'endo') {
            q.p += dt * 0.9; const f = Math.min(1, q.p);
            const tx = q.fate ? ex + (er - 8) * Math.cos(q.a) : ex + 0.4 * er * Math.cos(q.a * 3), ty = q.fate ? ey + (er - 8) * Math.sin(q.a) : ey + 0.4 * er * Math.sin(q.a * 3);
            drawY(lerp(ex, tx, f), lerp(ey, ty, f), q.fate ? C.ok : C.accent);
            if (q.p >= 1) { q.s = q.fate ? 'out' : 'lyso'; q.p = 0; q.x0 = tx; q.y0 = ty; }
          } else if (q.s === 'out') {
            q.p += dt * 0.7; const f = Math.min(1, q.p);
            drawY(lerp(q.x0, exitX, f), lerp(q.y0, top - 10, f), C.ok);
            if (q.p >= 1) { q.s = 'plasma'; q.x = exitX / W; q.y = Rn(); q.wait = 1 + Rn() * 3; rescued++; }
          } else {
            q.p += dt * 0.6; const f = Math.min(1, q.p);
            drawY(lerp(q.x0, lx, f), lerp(q.y0, ly, f), C.bad, 1 - 0.8 * f);
            if (q.p >= 1) { q.s = 'plasma'; q.x = Rn(); q.y = Rn(); q.wait = 1 + Rn() * 3; digested++; }
          }
        }
        const tot = rescued + digested;
        kit.label(c, 'rescued ' + rescued + ' · digested ' + digested + (tot ? ' (' + pct(rescued / tot) + ' rescued)' : ''), W - 10, 14, { align: 'right', size: 12, weight: 700, color: C.text });
        kit.label(c, 'model: ' + pct(pr, 1) + ' per pass', W - 10, 32, { align: 'right', size: 11.5, color: C.ok });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ daily tablets against a long-acting depot */
  Hyper.sim('class-depot', {
    title: 'Daily tablets or a long-acting depot',
    blurb: `A hypothetical drug with an elimination half-life of one day, given either as daily tablets or as an injected depot that releases it slowly. From a depot, absorption is slower than elimination — **flip-flop kinetics** — so the level falls with the depot's half-life, not the drug's. Tablets are only as good as the days they are taken: missed doses come in runs. The effect is shown as dopamine D₂ occupancy with its 65–80 % window (an antipsychotic-like drug) or as inhibition of viral replication against the IC₉₀ (an antiviral-like drug). Relative units; illustrative, not a regimen. A year runs in twelve seconds.

**Try this**
- Tablets with 100 % of doses taken: occupancy swings through much of the window every day. Lower adherence to 70 %: runs of missed tablets drop it below 65 %.
- Switch to the monthly depot: no gaps, and a slow rise and fall within each month. Lengthen the depot half-life: flatter, but slower to reach steady state — which is why depots start with loading doses.
- In antiviral mode, tick "stop on day 180": after the last injection the level lingers for months in the zone between full suppression and nothing — the long tail that makes stopping a long-acting antiviral a planned step.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 130 });
      const [g1, g2] = plotGrid(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Drug', options: [['Antipsychotic-like: D₂ occupancy', 'd2'], ['Antiviral-like: cover above the IC₉₀', 'av']], value: (params && params.mode) || 'd2' },
        { id: 'reg', type: 'select', label: 'Regimen', options: [['Daily tablets', 'oral'], ['Depot every 4 weeks', 'm1'], ['Depot every 8 weeks', 'm2']], value: (params && params.reg) || 'oral' },
        { id: 'adh', label: 'Tablets taken', min: 50, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'tabs', label: 'Depot absorption half-life', min: 5, max: 60, step: 1, value: (params && params.tabs) || 25, unit: 'days' },
        { id: 'load', type: 'check', label: 'Loading dose at the first injection', value: true },
        { id: 'stop', type: 'check', label: 'Stop on day 180', value: !!(params && params.stop) }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['in', 'Days 28–180 on target'], ['lo', 'Days 28–180 too low'], ['hi', 'Days 28–180 too high · partly covered'], ['tail', 'Doses · after stopping']]);
      const pC = kit.plot(g1, { x: { label: 'day', min: 0, max: 365 }, y: { label: 'concentration (relative)', min: 0 }, legend: true }, 190);
      const pE = kit.plot(g2, { x: { label: 'day', min: 0, max: 365 }, y: { label: 'effect (%)', min: 0, max: 100 }, legend: true }, 190);
      const KE = LN2 / 1, KAO = 24, DT = 0.05, TEND = 365;
      let cur = [], events = [];
      function run(reg, adh, stopDay) {
        const d2 = V.mode !== 'av', Cavg = d2 ? 2.57 : 8;                       // relative to EC50 (D₂) or to the IC₉₀
        const kaD = LN2 / V.tabs, tau = reg === 'm2' ? 56 : 28;
        const R = rng(99), ev = [];
        let gut = 0, dep = 0, C = 0, missed = false, day = 0;
        const out = [];
        const pm = adh >= 100 ? 0 : 0.5 * (1 - adh / 100) / (adh / 100);          // Markov runs: miss after a taken day with pm, keep missing with 0.5
        for (let i = 0; i <= Math.round(TEND / DT); i++) {
          const t = i * DT;
          if (t >= day - 1e-9) {
            if (day < stopDay && day < TEND) {
              if (reg === 'oral') {
                missed = missed ? R() < 0.5 : R() < pm;
                if (!missed) gut += Cavg * KE * 1;                               // one day's worth (Vd = 1)
                ev.push({ t: day, kind: missed ? 'miss' : 'take' });
              } else if (day % tau === 0) {
                const amt = Cavg * KE * tau, load = V.load && day === 0 ? Math.min(3, 1 / (1 - Math.exp(-kaD * tau))) : 1;
                dep += amt * load; ev.push({ t: day, kind: 'inj' });
              }
            }
            day++;
          }
          if (i % 10 === 0) out.push({ t, C });
          const fromGut = gut * (1 - Math.exp(-KAO * DT)), fromDep = dep * (1 - Math.exp(-kaD * DT));
          gut -= fromGut; dep -= fromDep;
          C = C * Math.exp(-KE * DT) + fromGut + fromDep;
        }
        return { out, ev };
      }
      const effect = C => V.mode !== 'av' ? C / (C + 1) : C * C / (C * C + 1 / 9);    // antiviral: Hill slope 2, IC90 = 1 (IC50 = 1/3)
      function recompute() {
        const d2 = V.mode !== 'av', stopDay = V.stop ? 180 : Infinity;
        ctl.show && ctl.show('adh', V.reg === 'oral');
        ctl.show && ctl.show('tabs', V.reg !== 'oral');
        ctl.show && ctl.show('load', V.reg !== 'oral');
        const r = run(V.reg, V.adh, stopDay); cur = r.out; events = r.ev;
        const C = kit.colors();
        const ref = V.reg === 'oral' ? run('m1', 100, stopDay).out : run('oral', 100, stopDay).out;
        const refLab = V.reg === 'oral' ? 'depot every 4 weeks' : 'tablets, every dose taken';
        const sC = [{ pts: cur.map(p => [p.t, p.C]), label: V.reg === 'oral' ? 'tablets' : 'depot', width: 1.8, color: C.accent }, { pts: ref.map(p => [p.t, p.C]), label: refLab, dash: [4, 3], width: 1.2, color: C.muted }];
        const sE = [{ pts: cur.map(p => [p.t, 100 * effect(p.C)]), label: d2 ? 'D₂ occupancy' : 'viral replication inhibited', width: 1.8, color: C.accent }];
        pC.set({ y: d2 ? { label: 'concentration (× EC50)', min: 0 } : { label: 'concentration (× IC₉₀), log', log: true, min: 0.01, max: 40 }, series: d2 ? sC : sC.map(s => ({ ...s, pts: s.pts.map(p => [p[0], Math.max(0.005, p[1])]) })), hlines: d2 ? [] : [{ y: 4, label: '4 × IC₉₀ (target)' }, { y: 1, label: 'IC₉₀' }], vlines: V.stop ? [{ x: 180, label: 'stopped' }] : [] });
        pE.set({ series: sE, hlines: d2 ? [{ y: 80, label: '80 %: side effects' }, { y: 65, label: '65 %: response' }] : [{ y: 90, label: '90 %' }], vlines: V.stop ? [{ x: 180, label: 'stopped' }] : [] });
        // time in the window, from day 28 to day 180 (after the start, before any stop)
        const w = cur.filter(p => p.t >= 28 && p.t < 180);
        const frac = f => w.length ? w.filter(f).length / w.length : 0;
        if (d2) {
          ro.set('in', pct(frac(p => { const e = effect(p.C); return e >= 0.65 && e <= 0.8; })) + ' (occupancy 65–80 %)');
          ro.set('lo', pct(frac(p => effect(p.C) < 0.65)) + ' (below 65 %)');
          ro.set('hi', pct(frac(p => effect(p.C) > 0.8)) + ' (above 80 %)');
        } else {
          ro.set('in', pct(frac(p => p.C >= 4)) + ' (above 4 × IC₉₀)');
          ro.set('lo', pct(frac(p => p.C < 1)) + ' (below the IC₉₀)');
          ro.set('hi', pct(frac(p => p.C >= 1 && p.C < 4)) + ' (between IC₉₀ and 4 × IC₉₀)');
        }
        const doses = V.reg === 'oral' ? events.filter(e => e.kind === 'miss').length + ' of ' + events.length + ' tablets missed' : events.length + ' injections';
        if (V.stop) {
          const lo = d2 ? cur.find(p => p.t > 180 && effect(p.C) < 0.65) : cur.find(p => p.t > 180 && p.C < 4);
          const gone = d2 ? cur.find(p => p.t > 180 && effect(p.C) < 0.1) : cur.find(p => p.t > 180 && p.C < 0.1);
          ro.set('tail', doses + ' · ' + (d2 ? 'below 65 % from day ' : 'below 4 × IC₉₀ from day ') + (lo ? Math.round(lo.t) : '—') + ', ' + (d2 ? 'below 10 % ' : 'below a tenth of the IC₉₀ ') + (gone ? 'from day ' + Math.round(gone.t) : 'not within the year'));
        } else ro.set('tail', doses);
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 30) % TEND;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = 16, x1 = W - 16, X = t => x0 + (x1 - x0) * t / TEND, y = Hh * 0.62;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
        for (const e of events) {
          if (e.kind === 'inj') { c.fillStyle = C.accent; c.beginPath(); c.moveTo(X(e.t), y - 4); c.lineTo(X(e.t) - 5, y - 16); c.lineTo(X(e.t) + 5, y - 16); c.closePath(); c.fill(); }
          else { c.fillStyle = e.kind === 'take' ? C.ok : C.bad; c.fillRect(X(e.t), e.kind === 'take' ? y - 8 : y - 14, Math.max(1, (x1 - x0) / TEND), e.kind === 'take' ? 8 : 14); }
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(clock), y - 24); c.lineTo(X(clock), y + 8); c.stroke();
        const p = cur[Math.min(cur.length - 1, Math.round(clock / (10 * DT)))] || { C: 0 }, e = effect(p.C), d2 = V.mode !== 'av';
        const ok = d2 ? e >= 0.65 && e <= 0.8 : p.C >= 4;
        kit.label(c, 'day ' + Math.round(clock) + ': ' + (d2 ? 'D₂ occupancy ' + pct(e) + (ok ? ' — in the window' : e < 0.65 ? ' — below the window' : ' — above the window') : 'level ' + p.C.toFixed(2) + ' × IC₉₀' + (ok ? ' — fully covered' : p.C >= 1 ? ' — partly covered' : ' — not covered')), x0, 16, { align: 'left', size: 13, weight: 700, color: ok ? C.ok : C.warn });
        kit.label(c, V.reg === 'oral' ? 'green: tablet taken · red: missed' : '▼ injection', x0, y + 22, { align: 'left', size: 11.5, color: C.muted });
      }, box.stage);
      recompute();
      loop.start();
    }
  });
})();
