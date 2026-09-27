/* HYPER-PHARMACEUTICS · sims/pk-basics.js — simulations for the basic pharmacokinetic parameters and special situations.
 *   pkb-adme          a dose followed as a mass balance: gut, first pass, body, urine, metabolites, faeces
 *   pkb-iv-bolus      a one-compartment intravenous bolus: noisy samples, the log-linear fit, fitted k, C0, V and CL
 *   pkb-nca           non-compartmental analysis of an oral profile: linear-up/log-down trapezoids, λz and the tail
 *   pkb-accumulation  repeated doses building to steady state, accumulation ratio, loading dose; TDM sampling times
 *   pkb-renal         Cockcroft–Gault for a hypothetical patient, the adjustment factor, smaller doses or longer intervals
 *   pkb-binding       drug and albumin as particles: bound and free, fu, saturation, displacement and the free-drug hypothesis
 *   pkb-hepatic       the liver as a filter (well-stirred model): extraction, flow- and enzyme-limited clearance, first pass
 *   pkb-scaling       clearance from birth to old age: allometry, maturation, and dose rules by weight and surface area
 * All drugs are hypothetical; the models come from kit.med (pk, steadyState, cockcroftGault, bsa) and kit.pharma (nca).
 */
(function () {
  'use strict';
  const LN2 = Math.LN2;

  /* ---------------------------------------------------------------- helpers */
  const fx = (v, d) => Number.isFinite(v) ? v.toFixed(d) : '—';
  const sg = (v, n) => {                                     // a number to n significant figures, as text
    if (!Number.isFinite(v)) return '—';
    if (Math.abs(v) >= 1e4) return Math.round(v).toLocaleString('en-GB');
    return String(Number(v.toPrecision(n || 3)));
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pm = (v, d) => Number.isFinite(v) ? (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d) : '—';   // a signed change, with a true minus
  function plotRow(box, n) {                                  // n plot holders side by side (stacking on narrow screens)
    const gb = document.createElement('div');
    gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  function linfit(xs, ys) {                                   // least-squares line y = icpt + slope·x
    const n = xs.length;
    if (n < 2) return { ok: false, slope: NaN, icpt: NaN };
    let mx = 0, my = 0;
    for (let i = 0; i < n; i++) { mx += xs[i]; my += ys[i]; }
    mx /= n; my /= n;
    let sxy = 0, sxx = 0;
    for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); }
    if (!(sxx > 0)) return { ok: false, slope: NaN, icpt: NaN };
    const slope = sxy / sxx;
    return { ok: Number.isFinite(slope), slope, icpt: my - slope * mx };
  }
  function gauss(rng) { const u = Math.max(1e-12, rng()), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function rrect(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h); c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r); c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }
  function polyline(c, pts, color, width, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = width || 1.5; c.setLineDash(dash || []);
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore();
  }
  function along(pts, s) {                                    // the point a fraction s of the way along a polyline
    const seg = []; let L = 0;
    for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
    let d = clamp(s, 0, 1) * L;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) {
        const u = seg[i] > 0 ? clamp(d / seg[i], 0, 1) : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u];
      }
      d -= seg[i];
    }
    return pts[pts.length - 1];
  }
  const hrs = h => h >= 72 ? fx(h / 24, 1) + ' days' : h >= 1 ? fx(h, 1) + ' h' : fx(h * 60, 0) + ' min';
  // a label shrunk (down to 8.5 px) until it fits maxW — for long lines on narrow screens
  function fitLabel(kit, c, text, x, y, o, maxW) {
    let size = o.size || 12.5;
    if (maxW > 0 && c.measureText) {
      c.save();
      for (; size > 8.5; size -= 0.5) {
        c.font = (o.weight || 500) + ' ' + size + 'px sans-serif';
        const m = c.measureText(text);
        if (!m || !(m.width > maxW)) break;
      }
      c.restore();
    }
    kit.label(c, text, x, y, Object.assign({}, o, { size }));
  }

  /* ================================================================ pkb-adme */
  Hyper.sim('pkb-adme', {
    title: 'Where the dose goes',
    blurb: `A dose of a hypothetical drug followed as a **mass balance**. By mouth, drug leaves the gut at the absorption rate: part is never absorbed and ends in the faeces, part crosses the gut wall and meets the liver, which removes a fraction $E_H$ on the first pass. What reaches the body is eliminated by first-order kinetics, split between the kidneys (unchanged drug in the urine, the fraction $f_e$) and metabolism. Each box fills with its share of the dose; the dots show the flows, denser where the flow is faster.

**Try this**
- Raise the first-pass extraction to 80 %: the bioavailability $F = f_a(1 - E_H)$ falls — then switch to an injection into a vein and it is 100 % again.
- Choose slow absorption (0.3 per hour) and a short half-life (2 h): the body empties faster than the gut can fill it, so absorption controls the whole curve — flip-flop kinetics.
- Set $f_e$ to 90 %: nearly everything that reaches the body leaves unchanged in the urine — a drug that will accumulate in kidney failure.
- Watch the last two read-outs: urine ÷ dose is $F f_e$, while urine ÷ systemic dose is $f_e$; and the five boxes always add up to 100 %.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250, maxH: 380 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'route', type: 'select', label: 'Route', options: [['A tablet by mouth', 'oral'], ['An injection into a vein', 'iv']], value: 'oral' },
        { id: 'fa', label: 'Fraction absorbed f_a', min: 10, max: 100, step: 1, value: 90, unit: '%' },
        { id: 'ka', label: 'Absorption rate constant k_a', min: 0.2, max: 5, value: 1.2, unit: '1/h', log: true, sig: 2 },
        { id: 'EH', label: 'First-pass liver extraction E_H', min: 0, max: 95, step: 1, value: 40, unit: '%' },
        { id: 'th', label: 'Elimination half-life', min: 1, max: 48, value: 6, unit: 'h', log: true, sig: 2 },
        { id: 'fe', label: 'Fraction excreted unchanged f_e', min: 0, max: 100, step: 1, value: 30, unit: '%' },
        { type: 'buttons', items: [{ id: 'go', label: 'Give the dose again', primary: true }] }
      ], () => { recompute(); clock = 0; hold = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time after the dose'], ['F', 'Bioavailability F = f_a(1 − E_H)'], ['body', 'In the body now'], ['uri', 'Unchanged in urine: now → in the end'], ['frac', 'In the end: urine ÷ dose | urine ÷ F·D'], ['sum', 'Mass balance (all boxes)']]);
      const plot = kit.plot(g1, { x: { label: 'time (h)', min: 0 }, y: { label: '% of the dose', min: 0, max: 100 }, legend: true }, 190);
      let traj = [], tEnd = 24, clock = 0, hold = 0, plotT = 0;
      const phase = [0, 0, 0, 0, 0, 0];

      function recompute() {
        const iv = V.route === 'iv', k = LN2 / V.th, ka = V.ka, fa = V.fa / 100, EH = V.EH / 100, fe = V.fe / 100;
        tEnd = Math.ceil(Math.min(240, Math.max(24, 5 * V.th + (iv ? 0 : 5 / ka))) / 12) * 12;
        const dt = 0.01, N = Math.round(tEnd / dt), every = Math.max(1, Math.round(N / 300));
        const eA = Math.exp(-ka * dt), eK = Math.exp(-k * dt);
        let g = iv ? 0 : 100, b = iv ? 100 : 0, m = 0, u = 0, fz = 0;
        traj = [];
        for (let i = 0; i <= N; i++) {
          if (i % every === 0 || i === N) traj.push({ t: i * dt, g, b, m, u, f: fz, abs: fa * ka * g * (1 - EH), pass: fa * ka * g * EH, ren: fe * k * b, met: (1 - fe) * k * b, fec: (1 - fa) * ka * g, gut: fa * ka * g });
          const a = g * (1 - eA);                             // leaves the gut this step (exact for the step)
          g -= a; fz += a * (1 - fa); m += a * fa * EH; b += a * fa * (1 - EH);
          const el = b * (1 - eK);
          b -= el; u += el * fe; m += el * (1 - fe);
        }
        const ser = (key) => traj.map(s => [s.t, s[key]]);
        const series = [];
        if (!iv) series.push({ pts: ser('g'), label: 'gut' });
        series.push({ pts: ser('b'), label: 'body', width: 2.8 });
        series.push({ pts: ser('m'), label: 'metabolised' });
        series.push({ pts: ser('u'), label: 'urine, unchanged' });
        if (!iv) series.push({ pts: ser('f'), label: 'faeces' });
        plot.set({ x: { label: 'time (h)', min: 0, max: tEnd }, series });
        const F = iv ? 1 : fa * (1 - EH);
        ro.set('F', iv ? '100 % (injection)' : fx(F * 100, 0) + ' %');
        ro.set('frac', fx(F * fe * 100, 1) + ' % | ' + fx(fe * 100, 0) + ' %');
      }
      const stateAt = t => traj[clamp(Math.round(t / tEnd * (traj.length - 1)), 0, traj.length - 1)];

      const loop = kit.loop((dt) => {
        if (clock < tEnd) clock = Math.min(tEnd, clock + dt * tEnd / 10);
        else { hold += dt; if (hold > 2.5) { clock = 0; hold = 0; } }
        const s = stateAt(clock), iv = V.route === 'iv';
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const bw = Math.min(150, W * 0.17), bh = Math.min(110, H * 0.32);
        const P = {
          gut: { x: W * 0.03, y: H * 0.12, w: bw, h: bh, label: 'gut', v: s.g, col: C.series[1] },
          fae: { x: W * 0.03, y: H * 0.6, w: bw, h: bh * 0.85, label: 'faeces (not absorbed)', v: s.f, col: C.series[4] },
          body: { x: W * 0.44, y: H * 0.1, w: bw * 1.15, h: bh * 1.15, label: 'body (blood and tissues)', v: s.b, col: C.accent },
          uri: { x: W * 0.79, y: H * 0.08, w: bw * 0.95, h: bh, label: 'urine, unchanged', v: s.u, col: C.series[3] },
          met: { x: W * 0.79, y: H * 0.58, w: bw * 0.95, h: bh, label: 'metabolised', v: s.m, col: C.series[2] }
        };
        const liv = { x: W * 0.265, y: H * 0.14, w: W * 0.11, h: bh * 0.75 };
        const mid = (b, side, f) => side === 'l' ? [b.x, b.y + b.h * (f == null ? 0.5 : f)] : side === 'r' ? [b.x + b.w, b.y + b.h * (f == null ? 0.5 : f)] : side === 't' ? [b.x + b.w * (f == null ? 0.5 : f), b.y] : [b.x + b.w * (f == null ? 0.5 : f), b.y + b.h];
        const links = [
          { pts: [mid(P.gut, 'r'), mid(liv, 'l')], flow: iv ? 0 : s.gut, col: C.series[1] },
          { pts: [mid(liv, 'r'), mid(P.body, 'l', 0.4)], flow: iv ? 0 : s.abs, col: C.accent },
          { pts: [mid(liv, 'b'), [liv.x + liv.w / 2, P.met.y + P.met.h * 0.75], mid(P.met, 'l', 0.75)], flow: iv ? 0 : s.pass, col: C.series[2] },
          { pts: [mid(P.body, 'r', 0.3), mid(P.uri, 'l')], flow: s.ren, col: C.series[3] },
          { pts: [mid(P.body, 'r', 0.8), [P.body.x + P.body.w + (P.met.x - P.body.x - P.body.w) * 0.5, P.body.y + P.body.h * 0.8], [P.body.x + P.body.w + (P.met.x - P.body.x - P.body.w) * 0.5, P.met.y + P.met.h * 0.35], mid(P.met, 'l', 0.35)], flow: s.met, col: C.series[2] },
          { pts: [mid(P.gut, 'b'), mid(P.fae, 't')], flow: iv ? 0 : s.fec, col: C.series[4] }
        ];
        links.forEach((L, i) => {
          polyline(c, L.pts, iv && (i === 0 || i === 1 || i === 2 || i === 5) ? C.grid : C.faint, 2);
          const n = L.flow > 0.03 ? Math.min(9, 1 + Math.floor(L.flow / 3)) : 0;
          phase[i] = (phase[i] + dt * 0.45) % 1;
          for (let j = 0; j < n; j++) { const p = along(L.pts, (phase[i] + j / n) % 1); kit.dot(c, p[0], p[1], 3.2, L.col); }
        });
        // the liver: a first-pass filter, not a pool
        rrect(c, liv.x, liv.y, liv.w, liv.h, 12); c.fillStyle = kit.hue(20, 0.18); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'liver', liv.x + liv.w / 2, liv.y - 10, { align: 'center', size: 12, weight: 700, color: C.text });
        kit.label(c, iv ? 'bypassed' : 'removes ' + V.EH + ' %', liv.x + liv.w / 2, liv.y + liv.h / 2, { align: 'center', size: 11.5, color: C.muted });
        for (const b of Object.values(P)) {
          const fill = clamp(b.v / 100, 0, 1);
          rrect(c, b.x, b.y, b.w, b.h, 8); c.fillStyle = C.surface; c.fill();
          c.save(); rrect(c, b.x, b.y, b.w, b.h, 8); c.clip();
          c.globalAlpha = 0.55; c.fillStyle = b.col; c.fillRect(b.x, b.y + b.h * (1 - fill), b.w, b.h * fill); c.restore();
          rrect(c, b.x, b.y, b.w, b.h, 8); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
          kit.label(c, b.label, b.x + b.w / 2, b.y - 10, { align: 'center', size: 12, weight: 700, color: C.text });
          kit.label(c, fx(b.v, 1) + ' %', b.x + b.w / 2, b.y + b.h / 2, { align: 'center', size: 14, weight: 700, color: C.text, bg: C.surface });
        }
        kit.label(c, 'kidneys', (P.body.x + P.body.w + P.uri.x) / 2, P.body.y + P.body.h * 0.3 - 12, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'enzymes', P.body.x + P.body.w + (P.met.x - P.body.x - P.body.w) * 0.5 + 6, (P.body.y + P.body.h + P.met.y) / 2, { align: 'left', size: 11, color: C.muted });
        if (iv) kit.arrow(c, P.body.x + P.body.w / 2, 4, P.body.x + P.body.w / 2, P.body.y - 20, C.accent, 2.5);
        kit.label(c, 't = ' + fx(clock, 1) + ' h', W - 10, H - 12, { align: 'right', size: 13, weight: 700, color: C.text });
        ro.set('t', fx(clock, 1) + ' h of ' + tEnd + ' h');
        ro.set('body', fx(s.b, 1) + ' % of the dose');
        const F = iv ? 1 : V.fa / 100 * (1 - V.EH / 100);
        ro.set('uri', fx(s.u, 1) + ' % → ' + fx(F * V.fe, 1) + ' %');
        ro.set('sum', fx(s.g + s.b + s.m + s.u + s.f, 2) + ' %');
        plotT += dt;
        if (plotT > 0.12 || dt === 0) { plotT = 0; plot.set({ vlines: [{ x: clock, label: fx(clock, 1) + ' h' }] }); }
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ pkb-iv-bolus */
  Hyper.sim('pkb-iv-bolus', {
    title: 'An intravenous bolus: fitting the log-linear line',
    blurb: `A hypothetical drug injected into a vein spreads at once through an apparent volume $V$ — drawn as a square tank whose **area** is proportional to $V$, beside the 3 L of plasma and 42 L of body water of a 70 kg adult — and drains through a clearance $CL$. Blood samples are drawn at the chosen times and measured with a realistic assay error; levels below the assay limit (0.05 mg/L) cannot be used. A straight line through $\\ln C$ against time gives the rate constant (its slope) and $C_0$ (its intercept), and from them $V = D/C_0$, $CL = kV$ and the half-life — compare them with the truth.

**Try this**
- Give a large volume (500 L) at the same clearance: the tank is huge, the level low, the half-life long — yet the average level on repeated dosing would not change.
- Choose the three samples from 4 to 10 h with a long half-life: the samples span a fraction of a half-life, and assay error tilts the fitted line — draw new samples several times and watch the fitted half-life scatter.
- Turn the assay error to 0: the points fall exactly on a straight line in the log plot and the fit is perfect.
- With a short half-life, the late samples fall below the assay limit and are lost.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.25, minH: 160, maxH: 230 });
      const [g1, g2] = plotRow(box, 2);
      const SCHED = { rich: [0.25, 0.5, 1, 2, 3, 4, 6, 8, 12, 24], long: [0.5, 1, 2, 4, 8, 12, 24, 48, 72, 96], short: [4, 7, 10], late: [24, 36, 48, 72] };
      const LLOQ = 0.05;
      let seed = 1, samples = [], fit = null, tMax = 26;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Dose injected', min: 50, max: 2000, value: 500, unit: 'mg', log: true, sig: 2 },
        { id: 'V', label: 'Volume of distribution V', min: 3, max: 1000, value: 40, unit: 'L', log: true, sig: 2 },
        { id: 'CL', label: 'Clearance CL', min: 0.3, max: 60, value: 5, unit: 'L/h', log: true, sig: 2 },
        { id: 'cv', label: 'Assay error (CV)', min: 0, max: 30, step: 1, value: 8, unit: '%' },
        { id: 'sch', type: 'select', label: 'Sampling times', options: [['10 samples, 15 min to 24 h', 'rich'], ['10 samples, 30 min to 96 h', 'long'], ['3 samples, 4 to 10 h', 'short'], ['4 late samples, 24 to 72 h', 'late']], value: 'rich' },
        { type: 'buttons', items: [{ id: 'new', label: 'Draw new samples', primary: true }] }
      ], (id) => { if (id === 'new') seed++; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['th', 'Half-life: true | fitted'], ['k', 'k = CL/V: true | fitted'], ['C0', 'C₀: true | fitted intercept'], ['V', 'V: true | fitted D/C₀'], ['CL', 'CL: true | fitted k·V'], ['span', 'Samples used span'], ['msg', '']]);
      const pLin = kit.plot(g1, { x: { label: 'time (h)', min: 0 }, y: { label: 'C (mg/L)', min: 0 }, legend: true }, 200);
      const pLog = kit.plot(g2, { x: { label: 'time (h)', min: 0 }, y: { label: 'C (mg/L), log scale', log: true }, legend: true }, 200);

      function recompute() {
        const k = V.CL / V.V, C0 = V.D / V.V, rng = B.rng(seed * 7919 + 13), th = LN2 / k;
        const times = SCHED[V.sch];
        samples = times.map(t => { const c = C0 * Math.exp(-k * t) * Math.exp(V.cv / 100 * gauss(rng)); return { t, c, ok: c >= LLOQ }; });
        const used = samples.filter(s => s.ok);
        fit = null;
        if (used.length >= 2) {
          const lf = linfit(used.map(s => s.t), used.map(s => Math.log(s.c)));
          if (lf.ok && lf.slope < 0) { const kf = -lf.slope, C0f = Math.exp(lf.icpt); fit = { k: kf, C0: C0f, V: V.D / C0f, CL: kf * V.D / C0f, th: LN2 / kf }; }
        }
        tMax = times[times.length - 1] * 1.08;
        const curve = Array.from({ length: 241 }, (_, i) => { const t = tMax * i / 240; return [t, C0 * Math.exp(-k * t)]; });
        const fitCurve = fit ? Array.from({ length: 121 }, (_, i) => { const t = tMax * i / 120; return [t, fit.C0 * Math.exp(-fit.k * t)]; }) : [];
        const floor = LLOQ / 5, above = p => p[1] >= floor;
        const dots = used.map(s => [s.t, s.c]), lost = samples.filter(s => !s.ok).map(s => [s.t, LLOQ]);
        const sLin = [{ pts: curve, label: 'true level', width: 1.4, dash: [4, 3] }, { pts: dots, label: 'samples', line: false, dots: 4 }];
        if (fit) sLin.push({ pts: fitCurve, label: 'fitted' });
        pLin.set({ x: { label: 'time (h)', min: 0, max: tMax }, series: sLin });
        const sLog = [{ pts: curve.filter(above), label: 'true level', width: 1.4, dash: [4, 3] }, { pts: dots, label: 'samples', line: false, dots: 4 }];
        if (fit) sLog.push({ pts: fitCurve.filter(above), label: 'fitted line' });
        if (lost.length) sLog.push({ pts: lost, label: 'below the assay limit', line: false, dots: 3 });
        pLog.set({ x: { label: 'time (h)', min: 0, max: tMax }, series: sLog, hlines: [{ y: LLOQ, label: 'assay limit' }], marks: fit ? [{ x: 0, y: fit.C0, label: 'C₀ = ' + sg(fit.C0, 3) }] : [] });
        ro.set('th', hrs(th) + ' | ' + (fit ? hrs(fit.th) : '—'));
        ro.set('k', sg(k, 3) + ' | ' + (fit ? sg(fit.k, 3) : '—') + ' per h');
        ro.set('C0', sg(C0, 3) + ' | ' + (fit ? sg(fit.C0, 3) : '—') + ' mg/L');
        ro.set('V', sg(V.V, 3) + ' | ' + (fit ? sg(fit.V, 3) : '—') + ' L');
        ro.set('CL', sg(V.CL, 3) + ' | ' + (fit ? sg(fit.CL, 3) : '—') + ' L/h');
        const span = used.length >= 2 ? (used[used.length - 1].t - used[0].t) / th : 0;
        ro.set('span', used.length + ' samples, ' + fx(span, 1) + ' half-lives');
        ro.set('msg', !fit ? 'cannot fit: fewer than two usable samples' : span < 1 ? 'less than one half-life: the slope is poorly defined' : span > 2 ? 'a well-defined slope' : 'an acceptable span');
        clock = 0;
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock += dt * tMax / 8; if (clock > tMax * 1.2) clock = 0;
        const t = Math.min(clock, tMax);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const k = V.CL / V.V, C0 = V.D / V.V, Ct = C0 * Math.exp(-k * t), frac = Ct / C0;
        const S = Math.min(H - 34, W * 0.3), x0 = 18, yb = H - 14, side = v => S * Math.sqrt(clamp(v, 0, 1000) / 1000);
        // reference volumes (dashed) and the tank of volume V
        const s = side(V.V);
        c.fillStyle = kit.hue(215, 0.12 + 0.6 * frac); c.fillRect(x0, yb - s, s, s);
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(x0, yb - s, s, s);
        for (const [v, lab] of [[3, 'plasma 3 L'], [42, 'body water 42 L']]) {
          const r = side(v); c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.strokeRect(x0, yb - r, r, r); c.restore();
          if (v === 42) kit.label(c, lab, x0 + r + 4, yb - r + 7, { size: 10.5, color: C.muted });
        }
        // the drain: clearance
        const dw = clamp(2 + 2.2 * Math.log(1 + V.CL), 2, 12);
        kit.arrow(c, x0 + s, yb - 3, x0 + s + 34, yb - 3, C.bad, dw);
        const tx = Math.max(x0 + S + 44, W * 0.36), mw = W - tx - 8;
        const kind = V.V < 6 ? 'about the plasma volume' : V.V < 22 ? 'about the extracellular water' : V.V < 65 ? 'about total body water' : 'more than body water: bound in tissues';
        fitLabel(kit, c, 't = ' + fx(t, 1) + ' h after the injection', tx, 20, { size: 13, weight: 700, color: C.text }, mw);
        fitLabel(kit, c, 'C = ' + sg(Ct, 3) + ' mg/L · in the body ' + sg(Ct * V.V, 3) + ' mg (' + fx(frac * 100, 0) + ' % of the dose)', tx, 44, { size: 12.5, color: C.text }, mw);
        fitLabel(kit, c, 'V = ' + sg(V.V, 3) + ' L (' + sg(V.V / 70, 2) + ' L/kg): ' + kind, tx, 68, { size: 12.5, color: C.muted }, mw);
        fitLabel(kit, c, 'CL = ' + sg(V.CL, 3) + ' L/h removes ' + fx(k * 100, 1) + ' % of the drug per hour', tx, 90, { size: 12.5, color: C.muted }, mw);
        fitLabel(kit, c, 'half-life 0.693·V/CL = ' + hrs(LN2 / k), tx, 112, { size: 12.5, weight: 700, color: C.accent }, mw);
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ pkb-nca */
  Hyper.sim('pkb-nca', {
    title: 'Non-compartmental analysis: trapezoids under the curve',
    blurb: `A hypothetical tablet is given and blood is sampled at the chosen times. Non-compartmental analysis needs no model: $C_\\text{max}$ and $t_\\text{max}$ are read off the data, the area is added up trapezoid by trapezoid — straight lines while the level rises, logarithmic curves while it falls (*linear-up/log-down*, as standard software does) — and the tail beyond the last sample is $C_\\text{last}/\\lambda_z$, with $\\lambda_z$ from a log-linear fit of the last three points (right-hand plot). The dashed chords show what straight lines would add on the falling limb.

**Try this**
- Switch to straight-line trapezoids throughout and compare the two AUCs: with sparse samples on the falling limb the linear rule overestimates by several per cent.
- Choose the schedule that stops at 6 h with a long half-life: the last three points are still near the peak, $\\lambda_z$ is wrong and more than 20 % of the area is extrapolated.
- Make absorption slow (0.3 per hour) and the half-life short (2 h): flip-flop — the terminal slope now measures absorption, and the "half-life" from $\\lambda_z$ is the absorption half-life.
- Add assay noise and draw new samples: $C_\\text{max}$ jumps around (it is a single sample), while the AUC is steadier.`,
    mount(box, kit) {
      const B = kit.bio, M = kit.med, P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240, maxH: 380 });
      const [g1] = plotRow(box, 1);
      const SCHED = { rich: [0, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24], std: [0, 0.5, 1, 2, 4, 6, 8, 12], sparse: [0, 1, 3, 6, 12], early: [0, 0.5, 1, 2, 3, 4, 6] };
      let seed = 1, data = null, anim = 0;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Dose', min: 100, max: 1000, step: 10, value: 400, unit: 'mg' },
        { id: 'ka', label: 'Absorption rate constant k_a', min: 0.2, max: 5, value: 1.2, unit: '1/h', log: true, sig: 2 },
        { id: 'th', label: 'Elimination half-life', min: 1, max: 24, value: 4, unit: 'h', log: true, sig: 2 },
        { id: 'V', label: 'Volume V/F', min: 10, max: 200, value: 50, unit: 'L', log: true, sig: 2 },
        { id: 'sch', type: 'select', label: 'Sampling times', options: [['12 samples to 24 h', 'rich'], ['8 samples to 12 h', 'std'], ['5 samples to 12 h', 'sparse'], ['7 samples, stopping at 6 h', 'early']], value: 'std' },
        { id: 'method', type: 'select', label: 'Trapezoids', options: [['Linear up, log down', 'linlog'], ['Straight lines throughout', 'lin']], value: 'linlog' },
        { id: 'cv', label: 'Assay error (CV)', min: 0, max: 20, step: 1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New samples', primary: true }] }
      ], (id) => { if (id === 'new') seed++; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cmax', 'Cmax at tmax'], ['auc', 'AUC₀₋ₜ, this method'], ['alt', 'AUC₀₋ₜ, the other method'], ['lz', 'λz from the last 3 points → t½'], ['inf', 'AUC₀₋∞ (share extrapolated)'], ['true', 'True AUC = D/(k·V)'], ['cl', 'CL/F = D/AUC₀₋∞: estimate | true'], ['msg', '']]);
      const pLog = kit.plot(g1, { x: { label: 'time (h)', min: 0 }, y: { label: 'C (mg/L), log scale', log: true }, legend: true }, 190);

      function recompute() {
        const k = LN2 / V.th, rng = B.rng(seed * 104729 + 7);
        const model = M.pk({ halfLife: V.th, Vd: V.V, doses: [{ t: 0, amount: V.D, route: 'oral', F: 1, ka: V.ka }] });
        const times = SCHED[V.sch];
        const concs = times.map(t => t === 0 ? 0 : model.at(t) * Math.exp(V.cv / 100 * gauss(rng)));
        const r = P.nca(times, concs);
        let aucLin = 0;
        for (let i = 1; i < times.length; i++) aucLin += (times[i] - times[i - 1]) * (concs[i] + concs[i - 1]) / 2;
        const lz = r.lambda, okL = Number.isFinite(lz) && lz > 0;
        const auc = V.method === 'lin' ? aucLin : r.auc, alt = V.method === 'lin' ? r.auc : aucLin;
        const cLast = concs[concs.length - 1], tail = okL ? cLast / lz : NaN, aucInf = auc + tail;
        const trueAuc = V.D / (k * V.V);
        const tLast = times[times.length - 1], xMax = tLast * 1.45;
        const curve = Array.from({ length: 201 }, (_, i) => { const t = xMax * i / 200; return [t, model.at(t)]; });
        data = { times, concs, r, auc, alt, aucLin, lz, okL, tail, aucInf, trueAuc, xMax, tLast, cLast, curve, model };
        // the semilog plot: samples, the three terminal points, and the λz line
        const n = times.length, last3 = times.slice(-3).map((t, i) => [t, concs[n - 3 + i]]);
        const series = [{ pts: curve.filter(p => p[1] > 1e-3), label: 'true curve', width: 1.3, dash: [4, 3] },
          { pts: times.map((t, i) => [t, concs[i]]).filter(p => p[1] > 0), label: 'samples', line: false, dots: 4 },
          { pts: last3.filter(p => p[1] > 0), label: 'last 3 (λz)', line: false, dots: 6 }];
        if (okL) {
          const lf = linfit(last3.map(p => p[0]), last3.map(p => Math.log(Math.max(p[1], 1e-12))));
          if (lf.ok) series.push({ pts: [[times[n - 3], Math.exp(lf.icpt + lf.slope * times[n - 3])], [xMax, Math.exp(lf.icpt + lf.slope * xMax)]], label: 'λz line', dash: [6, 4] });
        }
        pLog.set({ x: { label: 'time (h)', min: 0, max: xMax }, series });
        ro.set('cmax', sg(r.cmax, 3) + ' mg/L at ' + sg(r.tmax, 3) + ' h');
        ro.set('auc', sg(auc, 4) + ' mg·h/L');
        ro.set('alt', sg(alt, 4) + ' mg·h/L (' + pm((alt / auc - 1) * 100, 1) + ' %)');
        ro.set('lz', okL ? sg(lz, 3) + ' per h → ' + hrs(LN2 / lz) + ' (true elimination ' + hrs(V.th) + ')' : 'cannot be estimated');
        ro.set('inf', okL ? sg(aucInf, 4) + ' mg·h/L (' + fx(tail / aucInf * 100, 1) + ' %)' : '—');
        ro.set('true', sg(trueAuc, 4) + ' mg·h/L');
        ro.set('cl', (okL ? sg(V.D / aucInf, 3) : '—') + ' | ' + sg(V.D / trueAuc, 3) + ' L/h');
        const peakInLast = r.tmax >= times[n - 3];
        const notes = [];
        if (!okL) notes.push('the last three points are not falling: sample for longer');
        else {
          if (peakInLast) notes.push('the last three points include the peak: λz is not terminal');
          if (tail / aucInf > 0.2) notes.push('more than 20 % extrapolated: unreliable');
        }
        if (V.ka < LN2 / V.th) notes.push('ka < k: flip-flop, the tail reflects absorption');
        ro.set('msg', notes.length ? notes.join('; ') : 'a good profile');
        anim = 0;
      }

      const loop = kit.loop((dt) => {
        anim += dt;
        if (!data) return;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const d = data, n = d.times.length;
        const L = 56, Rm = 14, T = 18, Bm = 34, pw = W - L - Rm, ph = H - T - Bm;
        const yMax = Math.max(1e-6, ...d.concs, ...d.curve.map(p => p[1])) * 1.14;
        const X = t => L + t / d.xMax * pw, Y = v => T + ph * (1 - clamp(v / yMax, 0, 1.05));
        // axes, grid and ticks
        c.strokeStyle = C.grid; c.lineWidth = 1;
        const sx = Hyper.niceStep(d.xMax, Math.max(3, Math.floor(pw / 80))), sy = Hyper.niceStep(yMax, Math.max(3, Math.floor(ph / 45)));
        for (let v = 0; v <= d.xMax + 1e-9; v += sx) { c.beginPath(); c.moveTo(X(v), T); c.lineTo(X(v), T + ph); c.stroke(); kit.label(c, sg(v, 3), X(v), T + ph + 12, { align: 'center', size: 11, color: C.muted }); }
        for (let v = 0; v <= yMax + 1e-9; v += sy) { c.beginPath(); c.moveTo(L, Y(v)); c.lineTo(L + pw, Y(v)); c.stroke(); kit.label(c, sg(v, 3), L - 6, Y(v), { align: 'right', size: 11, color: C.muted }); }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(L, T); c.lineTo(L, T + ph); c.lineTo(L + pw, T + ph); c.stroke();
        kit.label(c, 'time (h)', L + pw, H - 6, { align: 'right', size: 11.5, color: C.muted });
        kit.label(c, 'C (mg/L)', L + 4, T - 8, { size: 11.5, color: C.muted });
        // trapezoids, revealed one by one
        const shown = Math.floor(anim / 0.35);
        const logDown = (i) => V.method !== 'lin' && d.concs[i + 1] < d.concs[i] && d.concs[i + 1] > 0;
        for (let i = 0; i < n - 1 && i < shown; i++) {
          const t1 = d.times[i], t2 = d.times[i + 1], c1 = d.concs[i], c2 = d.concs[i + 1], ld = logDown(i);
          c.beginPath(); c.moveTo(X(t1), Y(0));
          if (ld) for (let j = 0; j <= 24; j++) { const u = j / 24; c.lineTo(X(t1 + (t2 - t1) * u), Y(c1 * Math.pow(c2 / c1, u))); }
          else { c.lineTo(X(t1), Y(c1)); c.lineTo(X(t2), Y(c2)); }
          c.lineTo(X(t2), Y(0)); c.closePath();
          c.fillStyle = c2 >= c1 ? kit.hue(160, 0.32) : ld ? kit.hue(215, 0.32) : kit.hue(30, 0.32); c.fill();
          c.strokeStyle = C.faint; c.lineWidth = 1; c.stroke();
          if (c2 < c1) polyline(c, [[X(t1), Y(c1)], [X(t2), Y(c2)]], C.muted, 1.2, [4, 3]);
          const a = ld ? (c1 - c2) * (t2 - t1) / Math.log(c1 / c2) : (c1 + c2) / 2 * (t2 - t1);
          if (X(t2) - X(t1) > 34) kit.label(c, sg(a, 3), (X(t1) + X(t2)) / 2, Y(Math.min(c1, c2) / 2), { align: 'center', size: 10.5, color: C.text });
        }
        // the extrapolated tail
        if (shown >= n && d.okL) {
          c.beginPath(); c.moveTo(X(d.tLast), Y(0));
          for (let j = 0; j <= 30; j++) { const t = d.tLast + (d.xMax - d.tLast) * j / 30; c.lineTo(X(t), Y(d.cLast * Math.exp(-d.lz * (t - d.tLast)))); }
          c.lineTo(X(d.xMax), Y(0)); c.closePath(); c.fillStyle = kit.hue(330, 0.2); c.fill();
          c.save(); c.setLineDash([5, 4]); c.strokeStyle = kit.hue(330); c.stroke(); c.restore();
          kit.label(c, 'tail C_last/λz = ' + sg(d.tail, 3), X(d.tLast) + 6, Y(d.cLast) - 14, { size: 11, color: C.text, bg: C.surface });
        }
        // the true curve and the samples
        polyline(c, d.curve.map(p => [X(p[0]), Y(p[1])]), C.faint, 1.3, [3, 3]);
        d.times.forEach((t, i) => kit.dot(c, X(t), Y(d.concs[i]), i >= n - 3 ? 5 : 4, i >= n - 3 ? C.warn : C.accent, C.surface));
        kit.label(c, 'Cmax', X(d.r.tmax), Y(d.r.cmax) - 14, { align: 'center', size: 11.5, weight: 700, color: C.text });
        kit.label(c, 'AUC so far: ' + sg(shown >= n - 1 ? d.auc + (shown >= n && d.okL ? d.tail : 0) : partial(d, shown), 4) + ' mg·h/L', L + pw - 4, T + 6, { align: 'right', size: 12.5, weight: 700, color: C.text, bg: C.surface });
      }, box.stage);
      function partial(d, shown) {
        let a = 0;
        for (let i = 0; i < d.times.length - 1 && i < shown; i++) {
          const t1 = d.times[i], t2 = d.times[i + 1], c1 = d.concs[i], c2 = d.concs[i + 1];
          a += V.method !== 'lin' && c2 < c1 && c2 > 0 ? (c1 - c2) * (t2 - t1) / Math.log(c1 / c2) : (c1 + c2) / 2 * (t2 - t1);
        }
        return a;
      }
      recompute();
      loop.start();
    }
  });

  /* ================================================================ pkb-accumulation */
  Hyper.sim('pkb-accumulation', {
    title: 'Repeated doses: building to steady state',
    blurb: `Equal doses of a hypothetical drug at equal intervals. Each dose adds to what is left of the earlier ones, so the level climbs until the amount eliminated in an interval equals one dose — the **steady state**, 90 % reached after 3.3 half-lives whatever the dose. The plateau sits $R = 1/(1 - e^{-k\\tau})$ times above the first dose; its average is $F D/(CL\\,\\tau)$. A loading dose of $R$ times the maintenance dose gets there at once. With the therapeutic window shown, the sim also plays a **drug-monitoring** exercise: where and when is a level worth drawing?

**Try this**
- Keep the dose and halve the interval: the average doubles and the swings shrink. Keep the daily dose (halve the dose too): the average stays, only the swings change.
- Set the interval equal to the half-life: $R = 2$ exactly, and the steady-state peak is twice the first.
- Tick the loading dose: the level jumps to the plateau at once; untick it and count the doses needed.
- Monitoring: draw the trough before the 2nd dose — a proportional dose change based on it would overshoot badly, because steady state had not been reached.`,
    mount(box, kit, params) {
      params = params || {};
      const tdm = !!params.tdm, M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 130, maxH: 170 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'route', type: 'select', label: 'Route', options: [['Tablets by mouth', 'oral'], ['Injections into a vein', 'iv']], value: 'oral' },
        { id: 'D', label: 'Dose', min: 25, max: 2000, value: 250, unit: 'mg', log: true, sig: 2 },
        { id: 'tau', label: 'Dosing interval τ', min: 2, max: 48, step: 1, value: 12, unit: 'h' },
        { id: 'th', label: 'Half-life', min: 1, max: 96, value: tdm ? 10 : 12, unit: 'h', log: true, sig: 2 },
        { id: 'V', label: 'Volume of distribution', min: 5, max: 500, value: 50, unit: 'L', log: true, sig: 2 },
        { id: 'F', label: 'Bioavailability F', min: 10, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'ka', label: 'Absorption rate constant k_a', min: 0.3, max: 5, value: 1.5, unit: '1/h', log: true, sig: 2 },
        { id: 'load', type: 'check', label: 'Start with a loading dose (R × dose)', value: false },
        { id: 'win', type: 'check', label: 'Show a therapeutic window', value: tdm },
        { id: 'lo', label: 'Window: lowest effective level', min: 0.5, max: 50, value: 4, unit: 'mg/L', log: true, sig: 2 },
        { id: 'hi', label: 'Window: toxic level', min: 1, max: 100, value: 10, unit: 'mg/L', log: true, sig: 2 },
        { id: 'samp', type: 'select', label: 'Monitoring: draw a level', options: [['Trough before the 2nd dose', 'tr2'], ['Trough before the 4th dose', 'tr4'], ['Trough at steady state', 'trss'], ['Peak at steady state', 'pkss'], ['Mid-interval at steady state', 'midss']], value: 'tr2' }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['R', 'Accumulation R = 1/(1 − e^(−kτ))'], ['t90', 'Time to 90 % of steady state'], ['avg', 'Average at steady state F·D/(CL·τ)'], ['pt', 'Peak | trough at steady state'], ['LD', 'Loading dose R × D'], ['inwin', 'Time inside the window at steady state'], ['lvl', 'Level drawn | its steady-state value'], ['adj', 'Proportional dose for the window midpoint']]);
      const plot = kit.plot(g1, { x: { label: 'time (h)', min: 0 }, y: { label: 'C (mg/L)', min: 0 }, legend: true }, 220);
      let d = null, clock = 0, hold = 0, plotT = 0;

      function recompute() {
        const oral = V.route === 'oral', k = LN2 / V.th, F = oral ? V.F / 100 : 1, tau = V.tau;
        ctl.show('F', oral); ctl.show('ka', oral); ctl.show('lo', V.win); ctl.show('hi', V.win); ctl.show('samp', V.win);
        ro.show('inwin', V.win); ro.show('lvl', V.win); ro.show('adj', V.win);
        const Racc = 1 / (1 - Math.exp(-k * tau));
        const nd = Math.max(6, Math.ceil(Math.min(1500, Math.max(6 * tau, 7 * V.th)) / tau)), Tend = nd * tau;
        const mk = (first) => Array.from({ length: nd }, (_, i) => ({ t: i * tau, amount: i === 0 ? first : V.D, route: oral ? 'oral' : 'iv', F, ka: V.ka }));
        const pk = M.pk({ halfLife: V.th, Vd: V.V, doses: mk(V.load ? V.D * Racc : V.D) });
        const pkPlain = V.load ? M.pk({ halfLife: V.th, Vd: V.V, doses: mk(V.D) }) : null;
        const N = 600, pts = [], plain = [];
        for (let i = 0; i <= N; i++) { const t = Tend * i / N; pts.push([t, pk.at(t)]); if (pkPlain) plain.push([t, pkPlain.at(t)]); }
        // steady state from the last interval (sampled finely)
        let peak = 0, tpk = 0, inside = 0;
        const m = 240;
        for (let i = 0; i <= m; i++) {
          const s = tau * i / m, cc = pk.at(Tend - tau + s);
          if (cc > peak) { peak = cc; tpk = s; }
          if (i < m && cc >= V.lo && cc <= V.hi) inside++;
        }
        const trough = pk.at(Tend - 1e-6), avg = F * V.D / (k * V.V * tau);
        // monitoring: when the sample is drawn, and the true steady-state value at the same point of the interval
        const nss = Math.min(nd - 1, Math.ceil(5 * V.th / tau) + 1), eps = 1e-6;
        const plan = { tr2: [tau - eps, tau - eps], tr4: [3 * tau - eps, tau - eps], trss: [nss * tau - eps, tau - eps], pkss: [(nss - 1) * tau + tpk, tpk], midss: [(nss - 1) * tau + tau / 2, tau / 2] }[V.samp] || [tau - eps, tau - eps];
        const tSample = Math.min(Tend - eps, plan[0]), off = plan[1];
        const lvl = pk.at(tSample), ssv = pk.at(Tend - tau + off);
        const target = (V.lo + V.hi) / 2;
        d = { pts, Tend, tSample, lvl, ssv, target, peak, trough, avg, Racc };
        const series = [{ pts, label: V.load ? 'with a loading dose' : 'level', width: 2.4 }];
        if (pkPlain) series.push({ pts: plain, label: 'without', dash: [5, 4], width: 1.5 });
        const hl = [{ y: avg, label: 'average at steady state' }];
        if (V.win) { hl.push({ y: V.lo, label: 'lowest effective', color: C0().ok }); hl.push({ y: V.hi, label: 'toxic', color: C0().bad }); }
        plot.set({ x: { label: 'time (h)', min: 0, max: Tend }, series, hlines: hl, marks: V.win ? [{ x: tSample, y: lvl, label: 'sample ' + sg(lvl, 3) }] : [] });
        ro.set('R', sg(Racc, 3) + ' (peaks ' + sg(peak / Math.max(1e-12, firstPeak(oral, F, k)), 3) + '× the first)');
        ro.set('t90', hrs(3.32 * V.th) + ' (about ' + Math.ceil(3.32 * V.th / tau) + ' doses)');
        ro.set('avg', sg(avg, 3) + ' mg/L');
        ro.set('pt', sg(peak, 3) + ' | ' + sg(trough, 3) + ' mg/L (×' + sg(peak / Math.max(1e-12, trough), 3) + ')');
        ro.set('LD', sg(V.D * Racc, 3) + ' mg');
        ro.set('inwin', fx(inside / m * 100, 0) + ' % of each interval');
        ro.set('lvl', sg(lvl, 3) + ' | ' + sg(ssv, 3) + ' mg/L (' + fx(lvl / Math.max(1e-12, ssv) * 100, 0) + ' % of steady state)');
        const sugg = V.D * target / Math.max(1e-9, lvl), right = V.D * target / Math.max(1e-9, ssv);
        ro.set('adj', sg(sugg, 3) + ' mg' + (Math.abs(sugg / right - 1) > 0.05 ? ' — ' + pm((sugg / right - 1) * 100, 0) + ' % against ' + sg(right, 3) + ' mg at steady state' : ' — sound: the level is at steady state'));
        clock = 0; hold = 0;
      }
      function firstPeak(oral, F, k) {
        if (!oral) return F * V.D / V.V;
        const ka = V.ka;
        const tm = Math.abs(ka - k) < 1e-9 ? 1 / k : Math.log(ka / k) / (ka - k);
        return F * V.D / V.V * Math.exp(-k * Math.min(tm, V.tau));
      }
      const C0 = () => kit.colors();
      const loop = kit.loop((dt) => {
        if (!d) return;
        if (clock < d.Tend) clock = Math.min(d.Tend, clock + dt * d.Tend / 12);
        else { hold += dt; if (hold > 2) { clock = 0; hold = 0; } }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const i = clamp(Math.round(clock / d.Tend * (d.pts.length - 1)), 0, d.pts.length - 1), lvl = d.pts[i][1];
        const top = Math.max(d.peak, V.win ? V.hi : 0, ...d.pts.map(p => p[1])) * 1.1 || 1;
        const gx = 24, gy = 12, gw = 34, gh = H - 30, Yg = v => gy + gh * (1 - clamp(v / top, 0, 1));
        if (V.win) { c.fillStyle = kit.hue(150, 0.22); c.fillRect(gx - 8, Yg(V.hi), gw + 16, Yg(V.lo) - Yg(V.hi)); }
        c.fillStyle = kit.hue(215, 0.55); c.fillRect(gx, Yg(lvl), gw, gy + gh - Yg(lvl));
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(gx, gy, gw, gh);
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(gx - 10, Yg(d.avg)); c.lineTo(gx + gw + 10, Yg(d.avg)); c.stroke(); c.restore();
        const tx = gx + gw + 30, doseNo = Math.min(Math.floor(clock / V.tau) + 1, Math.round(d.Tend / V.tau));
        const state = !V.win ? '' : lvl > V.hi ? 'above the toxic level' : lvl < V.lo ? 'below the effective level' : 'inside the window';
        const mw = W - tx - 8;
        fitLabel(kit, c, 'day ' + fx(clock / 24, 1) + '  ·  dose ' + doseNo + '  ·  ' + fx(clock, 0) + ' h', tx, 22, { size: 13, weight: 700, color: C.text }, mw);
        fitLabel(kit, c, 'level ' + sg(lvl, 3) + ' mg/L = ' + fx(lvl / Math.max(1e-12, d.avg) * 100, 0) + ' % of the steady-state average', tx, 46, { size: 12.5, color: C.text }, mw);
        if (state) kit.label(c, state, tx, 68, { size: 12.5, weight: 700, color: state === 'inside the window' ? C.ok : C.bad });
        fitLabel(kit, c, 'steady state after about ' + hrs(5 * V.th) + ' (five half-lives)', tx, 90, { size: 12, color: C.muted }, mw);
        if (tdm || V.win) fitLabel(kit, c, 'the level is drawn at ' + fx(d.tSample, 1) + ' h (' + fx(d.tSample / V.th, 1) + ' half-lives after the first dose)', tx, 112, { size: 12, color: C.muted }, mw);
        plotT += dt;
        if (plotT > 0.12 || dt === 0) { plotT = 0; plot.set({ vlines: [{ x: clock }] }); }
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ pkb-renal */
  Hyper.sim('pkb-renal', {
    title: 'Kidney function and dose adjustment',
    blurb: `A hypothetical patient and a hypothetical drug normally given as 500 mg every 8 h (volume 20 L, injected). Kidney function is estimated with the Cockcroft–Gault equation; the drug's clearance then falls to $Q = 1 - f_e(1 - \\text{KF})$ of normal, where KF is the patient's creatinine clearance over a normal 120 mL/min. The plot compares three curves: normal kidneys on the usual regimen, the patient on the usual regimen, and the patient on the adjusted one. An illustration of the arithmetic, not a dosing tool.

**Try this**
- With no adjustment, watch the patient's curve climb for days to a plateau far above normal: the average rises by $1/Q$.
- Compare *smaller dose* with *longer interval*: both bring the average back to normal; the first flattens the curve, the second reproduces the normal peaks and troughs.
- Round the interval to 12, 24 or 48 h: practical, but the average is no longer exactly normal.
- Set $f_e$ to 10 %: even severe kidney failure hardly changes a mostly metabolised drug. Then try an 85-year-old of 50 kg with a "normal" creatinine of 1.0 mg/dL.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 140, maxH: 180 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 20, max: 95, step: 1, value: 78, unit: 'years' },
        { id: 'W', label: 'Weight', min: 40, max: 130, step: 1, value: 55, unit: 'kg' },
        { id: 'sex', type: 'select', label: 'Sex', options: [['Female (× 0.85)', 'f'], ['Male', 'm']], value: 'f' },
        { id: 'scr', label: 'Serum creatinine', min: 0.5, max: 8, value: 1.3, unit: 'mg/dL', log: true, sig: 2 },
        { id: 'fe', label: 'Drug: fraction excreted unchanged f_e', min: 0, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'th', label: 'Drug: half-life with normal kidneys', min: 1, max: 12, value: 2, unit: 'h', log: true, sig: 2 },
        { id: 'how', type: 'select', label: 'Adjustment', options: [['None: the usual 500 mg every 8 h', 'none'], ['Smaller dose, same interval', 'dose'], ['Same dose, longer interval', 'tau'], ['Same dose, interval rounded to 12, 24 or 48 h', 'round']], value: 'dose' }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['crcl', 'Creatinine clearance (Cockcroft–Gault)'], ['kf', 'Kidney function left, KF'], ['Q', 'Clearance vs normal, Q = 1 − f_e(1 − KF)'], ['th', 'Half-life: normal | patient'], ['reg', 'Regimen shown'], ['avg', 'Average level: normal | usual | adjusted'], ['sw', 'Peak ÷ trough: normal | adjusted']]);
      const plot = kit.plot(g1, { x: { label: 'time (h)', min: 0 }, y: { label: 'C (mg/L)', min: 0 }, legend: true }, 220);
      const Vd = 20, D = 500, TAU = 8;
      let crcl = 100, pulse = 0;

      function curve(CL, dose, tau, Tend) {
        const k = CL / Vd, n = Math.ceil(Tend / tau) + 1;
        const pk = M.pk({ halfLife: LN2 / k, Vd, doses: Array.from({ length: n }, (_, i) => ({ t: i * tau, amount: dose, route: 'iv' })) });
        return Array.from({ length: 481 }, (_, i) => { const t = Tend * i / 480; return [t, pk.at(t)]; });
      }
      function recompute() {
        crcl = M.cockcroftGault(V.age, V.W, V.scr, V.sex === 'f');
        const KF = clamp(crcl / 120, 0, 1.5), fe = V.fe / 100, Q = Math.max(0.02, 1 - fe * (1 - KF));
        const CLn = LN2 * Vd / V.th, CLp = CLn * Q, thp = V.th / Q;
        let dose = D, tau = TAU;
        if (V.how === 'dose') dose = D * Q;
        else if (V.how === 'tau') tau = TAU / Q;
        else if (V.how === 'round') { const ex = TAU / Q; tau = [8, 12, 24, 48].reduce((b, x) => Math.abs(Math.log(x / ex)) < Math.abs(Math.log(b / ex)) ? x : b, 8); }
        const Tend = clamp(Math.ceil(Math.max(72, 5 * thp + 2 * tau) / 24) * 24, 72, 336);
        const series = [{ pts: curve(CLn, D, TAU, Tend), label: 'normal kidneys, usual regimen', dash: [5, 4], width: 1.5 },
          { pts: curve(CLp, D, TAU, Tend), label: 'patient, usual regimen', color: kit.colors().bad, width: 1.8 }];
        if (V.how !== 'none') series.push({ pts: curve(CLp, dose, tau, Tend), label: 'patient, adjusted', color: kit.colors().accent, width: 2.6 });
        const avgN = D / (CLn * TAU), avgU = D / (CLp * TAU), avgA = dose / (CLp * tau);
        plot.set({ x: { label: 'time (h)', min: 0, max: Tend }, series, hlines: [{ y: avgN, label: 'normal average' }] });
        ro.set('crcl', fx(crcl, 0) + ' mL/min (creatinine ' + fx(V.scr * 88.4, 0) + ' µmol/L)');
        ro.set('kf', fx(KF * 100, 0) + ' %' + (KF > 1 ? ' (above normal)' : ''));
        ro.set('Q', fx(Q * 100, 0) + ' %');
        ro.set('th', hrs(V.th) + ' | ' + hrs(thp));
        ro.set('reg', V.how === 'none' ? '500 mg every 8 h' : sg(dose, 3) + ' mg every ' + sg(tau, 3) + ' h');
        ro.set('avg', sg(avgN, 3) + ' | ' + sg(avgU, 3) + ' | ' + (V.how === 'none' ? '—' : sg(avgA, 3)) + ' mg/L');
        ro.set('sw', sg(Math.exp(CLn / Vd * TAU), 3) + ' | ' + (V.how === 'none' ? '—' : sg(Math.exp(CLp / Vd * tau), 3)));
      }
      const loop = kit.loop((dt) => {
        pulse += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 20, x1 = W - 20, y = H * 0.42, bh = 22, max = 150, X = v => x0 + (x1 - x0) * clamp(v, 0, max) / max;
        const bands = [[0, 15, 'G5', 0], [15, 30, 'G4', 20], [30, 45, 'G3b', 35], [45, 60, 'G3a', 50], [60, 90, 'G2', 90], [90, 150, 'G1', 140]];
        fitLabel(kit, c, 'kidney function (mL/min) — the CKD categories G1–G5 are defined on GFR; creatinine clearance estimates it', x0, 14, { size: 11.5, color: C.muted }, x1 - x0);
        for (const [a, b, lab, hue] of bands) {
          c.fillStyle = kit.hue(hue, 0.35); c.fillRect(X(a), y - bh / 2, X(b) - X(a), bh);
          kit.label(c, lab, (X(a) + X(b)) / 2, y, { align: 'center', size: 11.5, weight: 700, color: C.text });
          kit.label(c, String(a), X(a), y + bh / 2 + 10, { align: 'center', size: 10.5, color: C.muted });
        }
        kit.label(c, '150+', X(150), y + bh / 2 + 10, { align: 'center', size: 10.5, color: C.muted });
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x0, y - bh / 2, x1 - x0, bh);
        const mx = X(crcl), r = 7 + 1.5 * Math.sin(pulse * 4);
        c.beginPath(); c.moveTo(mx, y - bh / 2 - 2); c.lineTo(mx - r, y - bh / 2 - 2 - r * 1.4); c.lineTo(mx + r, y - bh / 2 - 2 - r * 1.4); c.closePath(); c.fillStyle = C.accent; c.fill();
        kit.label(c, fx(crcl, 0) + ' mL/min', mx, y - bh / 2 - 26, { align: 'center', size: 12.5, weight: 700, color: C.text, bg: C.surface });
        kit.dot(c, X(120), y + bh / 2 + 24, 3, C.muted);
        kit.label(c, 'normal (120)', X(120), y + bh / 2 + 36, { align: 'center', size: 10.5, color: C.muted });
        fitLabel(kit, c, 'renal share of the drug\'s clearance: ' + V.fe + ' %  ·  hypothetical patient and drug', x0, H - 12, { size: 11.5, color: C.muted }, x1 - x0);
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ pkb-binding */
  Hyper.sim('pkb-binding', {
    title: 'Bound and free: plasma protein binding',
    blurb: `Albumin molecules (large circles) and drug molecules (dots) in plasma, next to the tissue fluid beyond a capillary wall. Drug binds and unbinds all the time; the proportions follow the equilibrium $\\ce{D + P <=> DP}$ with the dissociation constant $K_d$, solved exactly (including saturation of the sites). Only **free** drug (bright dots) crosses the wall — so at equilibrium the free concentration is the same on both sides, while the total in plasma can be many times higher. Each dot stands for many molecules. The plot shows how $f_u$ depends on the drug concentration: flat while the sites are plentiful, rising as they fill.

**Try this**
- Lower albumin from 40 to 20 g/L (as in nephrotic syndrome or severe illness): $f_u$ roughly doubles. The steady-state read-out shows what that means for a low-extraction drug — the total level falls, the free level does not.
- Raise the drug towards the albumin concentration (600 µM): the sites saturate and $f_u$ climbs steeply — binding is concentration-dependent for some drugs at high levels.
- Add a competing drug: more drug is free at once; watch the free dots spread into the tissue.
- Make $K_d$ large (weak binding, 300 µM): most drug is free, and albumin hardly matters.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 360 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'alb', label: 'Albumin', min: 10, max: 55, step: 1, value: 40, unit: 'g/L' },
        { id: 'Kd', label: 'Dissociation constant K_d', min: 0.5, max: 500, value: 10, unit: 'µM', log: true, sig: 2 },
        { id: 'Dt', label: 'Total drug in plasma', min: 1, max: 3000, value: 50, unit: 'µM', log: true, sig: 2 },
        { id: 'disp', type: 'check', label: 'Add a competing drug (apparent K_d × 4)', value: false }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Albumin binding sites'], ['fu', 'Fraction unbound fu (equilibrium)'], ['obs', 'fu counted in the picture (averaged)'], ['Cu', 'Free | bound drug'], ['ss', 'Low-extraction drug at steady state, vs 40 g/L and no competitor']]);
      const plot = kit.plot(g1, { x: { label: 'total drug (µM), log scale', log: true, min: 1, max: 3000 }, y: { label: 'fraction unbound (%), log scale', log: true, min: 0.05, max: 100 }, legend: true }, 200);
      const sites = alb => alb / 66500 * 1e6;                       // µM, one main site per albumin
      function fuOf(Dt, Pt, Kd) {                                    // exact single-site equilibrium, free drug / total
        const b = Dt - Pt - Kd, s = Math.sqrt(b * b + 4 * Kd * Dt);
        const Df = b >= 0 ? (b + s) / 2 : 2 * Kd * Dt / (s - b);
        return clamp(Df / Dt, 0, 1);
      }
      const rng = B.rng(20260927);
      let alb = [], drug = [], fu = 0.1, fuObs = 0.1, pOn = 0.1, pOff = 0.02, acc = 0;
      function update() {
        const Kd = V.Kd * (V.disp ? 4 : 1), Pt = sites(V.alb);
        fu = fuOf(V.Dt, Pt, Kd);
        pOff = 0.02; pOn = fu > 0 ? pOff * (1 - fu) / fu : 0.5;
        if (pOn > 0.5) { pOff *= 0.5 / pOn; pOn = 0.5; }
        // albumin particles in proportion to the albumin concentration
        const nA = Math.round(V.alb * 0.8);
        while (alb.length < nA) alb.push({ x: 0.04 + 0.58 * rng(), y: 0.1 + 0.82 * rng(), slots: [-1, -1, -1] });
        while (alb.length > nA) { const a = alb.pop(); a.slots.forEach(j => { if (j >= 0) drug[j].b = -1; }); }
        // the curve of fu against drug concentration
        const xs = Array.from({ length: 121 }, (_, i) => Math.pow(10, Math.log10(3000) * i / 120));
        const series = [{ pts: xs.map(x => [x, 100 * fuOf(x, Pt, Kd)]), label: 'albumin ' + V.alb + ' g/L' + (V.disp ? ', with competitor' : '') }];
        if (V.alb !== 40 || V.disp) series.push({ pts: xs.map(x => [x, 100 * fuOf(x, sites(40), V.Kd)]), label: 'albumin 40 g/L, no competitor', dash: [5, 4], width: 1.5 });
        plot.set({ series, marks: [{ x: V.Dt, y: 100 * fu, label: fx(100 * fu, 2) + ' %' }], vlines: [{ x: Pt, label: 'albumin sites' }] });
        const fuRef = fuOf(V.Dt, sites(40), V.Kd);
        ro.set('P', fx(Pt, 0) + ' µM (' + V.alb + ' g/L ÷ 66.5 kDa)');
        ro.set('fu', fx(fu * 100, fu < 0.1 ? 2 : 1) + ' %');
        ro.set('Cu', sg(fu * V.Dt, 3) + ' | ' + sg((1 - fu) * V.Dt, 3) + ' µM');
        ro.set('ss', 'total × ' + sg(fuRef / Math.max(1e-9, fu), 3) + ', free × 1');
      }
      for (let i = 0; i < 60; i++) drug.push({ x: 0.05 + 0.9 * rng(), y: 0.1 + 0.82 * rng(), b: -1, s: 0 });
      update();
      const WALL = 0.68;
      function step() {
        for (const a of alb) {
          a.x = clamp(a.x + 0.0035 * gauss(rng), 0.03, WALL - 0.04); a.y = clamp(a.y + 0.0035 * gauss(rng), 0.1, 0.92);
        }
        for (let j = 0; j < drug.length; j++) {
          const p = drug[j];
          if (p.b >= 0) {
            const a = alb[p.b];
            if (!a) { p.b = -1; continue; }
            if (rng() < pOff) { a.slots[p.s] = -1; p.x = a.x; p.y = a.y; p.b = -1; }
            continue;
          }
          p.x += 0.011 * gauss(rng); p.y += 0.011 * gauss(rng);
          if (p.x < 0.01) p.x = 0.02 - p.x; if (p.x > 0.99) p.x = 1.98 - p.x;
          if (p.y < 0.08) p.y = 0.16 - p.y; if (p.y > 0.94) p.y = 1.88 - p.y;
          p.x = clamp(p.x, 0.01, 0.99); p.y = clamp(p.y, 0.08, 0.94);
          if (p.x < WALL && rng() < pOn) {                          // bind to the nearest albumin with a free slot
            let best = -1, bd = Infinity;
            for (let i = 0; i < alb.length; i++) {
              if (alb[i].slots.indexOf(-1) < 0) continue;
              const dd = (alb[i].x - p.x) ** 2 + (alb[i].y - p.y) ** 2;
              if (dd < bd) { bd = dd; best = i; }
            }
            if (best >= 0) { const s = alb[best].slots.indexOf(-1); alb[best].slots[s] = j; p.b = best; p.s = s; }
          }
        }
      }
      const loop = kit.loop((dt) => {
        acc += dt;
        let n = 0;
        while (acc >= 1 / 60 && n < 4) { step(); acc -= 1 / 60; n++; }
        if (n === 4) acc = 0;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, wx = WALL * W;
        c.fillStyle = kit.hue(0, 0.07); c.fillRect(0, 0, wx, H);
        c.fillStyle = kit.hue(200, 0.07); c.fillRect(wx, 0, W - wx, H);
        polyline(c, [[wx, 20], [wx, H - 8]], C.muted, 2, [6, 5]);
        kit.label(c, 'plasma', 12, 14, { size: 12.5, weight: 700, color: C.text });
        kit.label(c, 'tissue fluid', wx + 10, 14, { size: 12.5, weight: 700, color: C.text });
        kit.label(c, 'capillary wall: only free drug crosses', wx - 6, H - 14, { align: 'right', size: 11, color: C.muted });
        const rA = clamp(Math.min(W, H) * 0.028, 7, 12);
        for (const a of alb) { kit.dot(c, a.x * W, a.y * H, rA, kit.hue(45, 0.5), C.faint); }
        let bound = 0, freeP = 0, freeT = 0;
        for (const p of drug) {
          if (p.b >= 0 && alb[p.b]) {
            const a = alb[p.b], ang = p.s * 2.094 + 0.5, px = a.x * W + Math.cos(ang) * (rA + 2), py = a.y * H + Math.sin(ang) * (rA + 2);
            kit.dot(c, px, py, 3, C.muted); bound++;
          } else {
            if (p.b >= 0) p.b = -1;
            kit.dot(c, p.x * W, p.y * H, 4, C.accent, C.surface);
            if (p.x < WALL) freeP++; else freeT++;
          }
        }
        const inst = freeP + bound > 0 ? freeP / (freeP + bound) : 0;
        fuObs += (inst - fuObs) * Math.min(1, dt / 3);
        kit.label(c, 'bound ' + bound + '  ·  free in plasma ' + freeP + '  ·  free in tissue ' + freeT, 12, H - 14, { size: 12, weight: 700, color: C.text, bg: C.surface });
        ro.set('obs', fx(fuObs * 100, 1) + ' %');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkb-hepatic */
  Hyper.sim('pkb-hepatic', {
    title: 'The liver as a filter: the well-stirred model',
    blurb: `Blood carries a hypothetical drug through the liver. Only unbound drug enters the liver cells, where enzymes with intrinsic clearance $CL_\\text{int}$ remove it; the well-stirred model gives the fraction removed on each pass, $E_H = f_u CL_\\text{int}/(Q_H + f_u CL_\\text{int})$, and the clearance $CL_H = Q_H E_H$. Drug molecules (bright dots) flow at a speed set by blood flow; those removed turn into metabolites (grey) and leave in the bile or back to the blood for the kidneys. The plot places the drug on the curve from low to high extraction.

**Try this**
- A low-extraction drug ($f_u$ 5 %, $CL_\\text{int}$ 100 L/h): halve the blood flow — the clearance hardly moves; halve $CL_\\text{int}$ — it halves. Enzymes and binding rule.
- A high-extraction drug ($f_u$ 90 %, $CL_\\text{int}$ 3000 L/h): now blood flow rules, as in heart failure, and enzyme changes barely register — for an injection.
- Switch the drug to arrive from the gut: $F_H = 1 - E_H$ of a tablet escapes the first pass. For the high-extraction drug halving $CL_\\text{int}$ now nearly doubles what gets through — the oral AUC doubles.
- Raise $f_u$ for the low-extraction drug: the clearance of total drug rises in step.`,
    mount(box, kit) {
      const B = kit.bio, rng = B.rng(90210);
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 210, maxH: 320 });
      const [g1] = plotRow(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Liver blood flow Q_H', min: 30, max: 150, step: 1, value: 90, unit: 'L/h' },
        { id: 'fu', label: 'Fraction unbound f_u', min: 1, max: 100, value: 10, unit: '%', log: true, sig: 2 },
        { id: 'CLint', label: 'Intrinsic clearance CL_int', min: 1, max: 10000, value: 300, unit: 'L/h', log: true, sig: 2 },
        { id: 'route', type: 'select', label: 'The drug arrives', options: [['from the circulation (an injection)', 'iv'], ['from the gut (a tablet: the first pass)', 'oral']], value: 'iv' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'f_u·CL_int'], ['E', 'Extraction ratio E_H'], ['CL', 'Hepatic clearance CL_H = Q_H·E_H'], ['F', 'Escaping the first pass F_H = 1 − E_H'], ['kind', 'Kind of drug'], ['sQ', 'Halve Q_H → CL_H'], ['sC', 'Halve CL_int → CL_H | oral AUC'], ['obs', 'Removed in the picture (counted)']]);
      const plot = kit.plot(g1, { x: { label: 'f_u · CL_int (L/h), log scale', log: true, min: 0.1, max: 10000 }, y: { label: 'extraction ratio E_H (%)', min: 0, max: 100 }, legend: true }, 200);
      const E = (a, Q) => a / (Q + a);
      let Eh = 0.25, dots = [], spawn = 0, inN = 0, outN = 0;
      function update() {
        const a = V.fu / 100 * V.CLint, Q = V.Q;
        Eh = E(a, Q);
        const CLH = Q * Eh, xs = Array.from({ length: 121 }, (_, i) => Math.pow(10, -1 + 5 * i / 120));
        plot.set({ series: [{ pts: xs.map(x => [x, 100 * E(x, Q)]), label: 'Q_H = ' + Q + ' L/h' }, { pts: xs.map(x => [x, 100 * E(x, Q / 2)]), label: 'blood flow halved', dash: [5, 4], width: 1.5 }],
          hlines: [{ y: 30, label: 'low extraction below 30 %' }, { y: 70, label: 'high above 70 %' }], marks: [{ x: clamp(a, 0.1, 10000), y: 100 * Eh, label: fx(100 * Eh, 0) + ' %' }] });
        const cQ = (Q / 2) * E(a, Q / 2), cC = Q * E(a / 2, Q);
        ro.set('a', sg(a, 3) + ' L/h');
        ro.set('E', fx(Eh * 100, 1) + ' %');
        ro.set('CL', sg(CLH, 3) + ' L/h (' + sg(CLH / 60 * 1000, 3) + ' mL/min)');
        ro.set('F', fx((1 - Eh) * 100, 1) + ' %');
        ro.set('kind', Eh < 0.3 ? 'low extraction: enzyme- and binding-limited' : Eh > 0.7 ? 'high extraction: flow-limited' : 'intermediate extraction');
        ro.set('sQ', sg(cQ, 3) + ' L/h (' + pm((cQ / CLH - 1) * 100, 0) + ' %)');
        ro.set('sC', sg(cC, 3) + ' L/h (' + pm((cC / CLH - 1) * 100, 0) + ' %) | oral AUC × 2');
        inN = 0; outN = 0;
      }
      update();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, oral = V.route === 'oral';
        const x1 = 0.3, x2 = 0.72, yv = H * 0.46, vh = Math.min(40, H * 0.16), speed = 0.1 * V.Q / 90;
        // spawn drug at the inlet in proportion to blood flow; move; remove inside the liver
        spawn += dt * 16 * V.Q / 90;
        while (spawn >= 1) { dots.push({ x: 0, o: rng() * 2 - 1, m: false, age: 0, seen: false }); spawn -= 1; }
        const surv = Math.pow(1 - Eh, speed * dt / (x2 - x1));
        for (const d of dots) {
          if (d.m) { d.age += dt; d.o += dt * 1.2; continue; }
          d.x += speed * dt;
          if (!d.seen && d.x >= x1) { d.seen = true; inN++; }
          if (d.x > x1 && d.x < x2 && rng() > surv) { d.m = true; outN++; }
        }
        dots = dots.filter(d => d.x < 1.02 && d.age < 1.6);
        const decay = Math.exp(-dt / 10); inN *= decay; outN *= decay;
        // the vessel and the liver
        c.fillStyle = kit.hue(0, 0.12); c.fillRect(0, yv - vh / 2, W, vh);
        c.strokeStyle = kit.hue(0, 0.5); c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, yv - vh / 2); c.lineTo(W, yv - vh / 2); c.moveTo(0, yv + vh / 2); c.lineTo(W, yv + vh / 2); c.stroke();
        rrect(c, x1 * W - 16, yv - vh * 1.9, (x2 - x1) * W + 32, vh * 3.8, 40); c.fillStyle = kit.hue(15, 0.22); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        for (let i = 1; i < 5; i++) polyline(c, [[x1 * W, yv - vh / 2 + vh * i / 5], [x2 * W, yv - vh / 2 + vh * i / 5]], kit.hue(0, 0.25), 1, [2, 6]);
        fitLabel(kit, c, 'liver: enzymes clear unbound drug', (x1 + x2) / 2 * W, yv - vh * 1.9 - 12, { align: 'center', size: 12.5, weight: 700, color: C.text }, W - 16);
        fitLabel(kit, c, oral ? 'from the gut (portal vein)' : 'blood arriving', 8, yv + vh / 2 + 44, { size: 12, color: C.muted }, x1 * W - 24);
        fitLabel(kit, c, oral ? 'to the body: F_H = ' + fx((1 - Eh) * 100, 0) + ' %' : 'hepatic vein, to the body', W - 8, yv + vh / 2 + 44, { align: 'right', size: 12, color: C.muted }, (1 - x2) * W - 24);
        if (oral) { rrect(c, 10, yv + vh / 2 + 14, 34, 16, 8); c.fillStyle = kit.hue(45, 0.7); c.fill(); kit.label(c, 'tablet', 50, yv + vh / 2 + 22, { size: 11, color: C.muted }); }
        for (const d of dots) {
          const x = d.x * W, y = yv + d.o * vh * 0.38;
          if (d.m) { c.globalAlpha = Math.max(0, 1 - d.age / 1.6); kit.dot(c, x, Math.min(H - 6, yv + vh * 0.5 + d.age * 60), 2.4, C.muted); c.globalAlpha = 1; }
          else kit.dot(c, x, y, 3.4, C.accent);
        }
        kit.label(c, 'metabolites → bile, or back to the blood for the kidneys', (x1 + x2) / 2 * W, H - 12, { align: 'center', size: 11.5, color: C.muted });
        ro.set('obs', inN > 3 ? fx(outN / inN * 100, 0) + ' % of the drug entering' : '…');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkb-scaling */
  Hyper.sim('pkb-scaling', {
    title: 'Clearance from birth to old age',
    blurb: `A hypothetical drug with an adult clearance of 6 L/h, followed from a newborn to a 90-year-old. Clearance is size × maturation × (in later life) decline: size scales as $(W/70)^{0.75}$ with typical weights for age; maturation follows a sigmoid in postmenstrual age (for kidney filtration $TM_{50}$ = 47.7 weeks and Hill 3.4); the decline after 40 is an average — many older people keep their function. The right-hand plot asks what exposure (AUC) each simple dosing rule would give, as a percentage of the adult's.

**Try this**
- Slide the age from 2 to 10 years: per kilogram, the child clears 30–60 % more than an adult — so the adult mg/kg dose gives too little exposure, while scaling by body surface area comes close.
- Go to the first weeks of life with kidney filtration: immaturity outweighs size, and the same mg/kg rule now **over**-exposes the baby.
- Choose "mature at birth": only size remains, and surface area is a good rule at every age.
- Turn on the decline with age and go to 85: clearance per kilogram falls and the adult dose gives more exposure — one reason for "start low, go slow" in older people.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190, maxH: 260 });
      const [g1, g2] = plotRow(box, 2);
      // approximate typical weight (kg) and height (cm) for age (years), sexes pooled
      const GROW = [[0, 3.4, 50], [0.25, 6, 61], [0.5, 7.6, 67], [1, 9.6, 75], [2, 12.2, 87], [3, 14.3, 96], [5, 18.3, 110], [8, 25.5, 128], [10, 32, 138], [12, 40, 150], [14, 50, 162], [16, 58, 170], [18, 65, 173], [25, 70, 174], [50, 74, 173], [70, 72, 171], [90, 66, 167]];
      const grow = age => {
        for (let i = 1; i < GROW.length; i++) if (age <= GROW[i][0]) { const [a0, w0, h0] = GROW[i - 1], [a1, w1, h1] = GROW[i], u = (age - a0) / (a1 - a0); return { W: w0 + (w1 - w0) * u, Hc: h0 + (h1 - h0) * u }; }
        return { W: GROW[GROW.length - 1][1], Hc: GROW[GROW.length - 1][2] };
      };
      const ageTxt = y => y < 1 / 12 ? Math.max(1, Math.round(y * 365.25)) + ' days' : y < 2 ? fx(y * 12, 0) + ' months' : fx(y, 0) + ' years';
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 0.01, max: 90, value: 4, log: true, fmt: ageTxt },
        { id: 'path', type: 'select', label: 'Clearance pathway', options: [['Kidney filtration (TM50 47.7 wk, Hill 3.4)', 'gfr'], ['A slowly maturing enzyme (hypothetical: TM50 70 wk, Hill 2.5)', 'slow'], ['Mature at birth', 'none']], value: 'gfr' },
        { id: 'dec', type: 'check', label: 'Include the average decline after 40', value: true },
        { id: 'Da', label: 'Adult daily dose', min: 100, max: 2000, step: 50, value: 600, unit: 'mg' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Age | weight | height'], ['bsa', 'Body surface area (Mosteller)'], ['size', 'Size factor (W/70)^0.75'], ['mf', 'Maturation | decline with age'], ['cl', 'Clearance | per kg vs adult'], ['dose', 'Daily dose for the adult AUC'], ['rules', 'Exposure with mg/kg | with BSA']]);
      const pCl = kit.plot(g1, { x: { label: 'age (years), log scale', log: true, min: 0.01, max: 90 }, y: { label: 'clearance per kg (% of adult)', min: 0 }, legend: true }, 200);
      const pEx = kit.plot(g2, { x: { label: 'age (years), log scale', log: true, min: 0.01, max: 90 }, y: { label: 'exposure, % of adult AUC', min: 0 }, legend: true }, 200);
      const CLa = 6;
      function model(age) {
        const g = grow(age), pma = 40 + age * 52.18;
        const P = { gfr: [47.7, 3.4, 1 / 120], slow: [70, 2.5, 0.004], none: [0, 1, 0.004] }[V.path] || [47.7, 3.4, 1 / 120];
        const mf = P[0] > 0 ? Math.pow(pma, P[1]) / (Math.pow(P[0], P[1]) + Math.pow(pma, P[1])) : 1;
        const dec = V.dec && age > 40 ? Math.max(0.3, 1 - P[2] * (age - 40)) : 1;
        const size = Math.pow(g.W / 70, 0.75), bsa = M.bsa(g.W, g.Hc);
        const rel = size * mf * dec;                                // CL ÷ adult CL
        return { W: g.W, Hc: g.Hc, pma, mf, dec, size, bsa, rel, CL: CLa * rel, perKg: rel / (g.W / 70), exKg: (g.W / 70) / rel, exBsa: (bsa / 1.73) / rel, exAllo: size / rel };
      }
      let cur = model(V.age);
      function update() {
        cur = model(V.age);
        const ages = Array.from({ length: 161 }, (_, i) => Math.pow(10, -2 + Math.log10(9000) * i / 160));
        const ms = ages.map(model);
        pCl.set({ series: [{ pts: ms.map((m, i) => [ages[i], 100 * m.perKg]), label: 'size × maturation' + (V.dec ? ' × decline' : '') }, { pts: ages.map(a => [a, 100 * Math.pow(grow(a).W / 70, -0.25)]), label: 'size alone', dash: [5, 4], width: 1.5 }],
          hlines: [{ y: 100, label: 'adult' }], marks: [{ x: V.age, y: 100 * cur.perKg, label: fx(100 * cur.perKg, 0) + ' %' }] });
        pEx.set({ series: [{ pts: ms.map((m, i) => [ages[i], 100 * m.exKg]), label: 'mg/kg rule' }, { pts: ms.map((m, i) => [ages[i], 100 * m.exBsa]), label: 'surface-area rule' }, { pts: ms.map((m, i) => [ages[i], 100 * m.exAllo]), label: 'allometry without maturation', dash: [5, 4], width: 1.5 }],
          hlines: [{ y: 100, label: 'same as adult' }], vlines: [{ x: V.age }] });
        ro.set('who', ageTxt(V.age) + ' | ' + fx(cur.W, 1) + ' kg | ' + fx(cur.Hc, 0) + ' cm');
        ro.set('bsa', fx(cur.bsa, 2) + ' m²');
        ro.set('size', fx(cur.size, 3));
        ro.set('mf', fx(cur.mf * 100, 0) + ' % (PMA ' + fx(cur.pma, 0) + ' wk) | ' + fx(cur.dec * 100, 0) + ' %');
        ro.set('cl', sg(cur.CL, 3) + ' L/h | ' + fx(cur.perKg * 100, 0) + ' %');
        ro.set('dose', sg(V.Da * cur.rel, 3) + ' mg a day');
        ro.set('rules', fx(cur.exKg * 100, 0) + ' % | ' + fx(cur.exBsa * 100, 0) + ' %');
      }
      update();
      function person(c, x, yb, hPx, headFrac, fill, stroke, dashed) {
        const hh = hPx * headFrac, r = hh / 2, body = hPx - hh, sh = body * 0.42, w = Math.max(6, hPx * 0.2);
        c.save(); c.lineWidth = 1.6; c.strokeStyle = stroke; c.fillStyle = fill; if (dashed) c.setLineDash([4, 3]);
        c.beginPath(); c.arc(x, yb - hPx + r, r, 0, 2 * Math.PI); if (!dashed) c.fill(); c.stroke();
        rrect(c, x - w / 2, yb - body, w, sh, w * 0.3); if (!dashed) c.fill(); c.stroke();
        c.beginPath(); c.moveTo(x - w * 0.25, yb - body + sh); c.lineTo(x - w * 0.3, yb); c.moveTo(x + w * 0.25, yb - body + sh); c.lineTo(x + w * 0.3, yb);
        c.moveTo(x - w / 2, yb - body + sh * 0.15); c.lineTo(x - w * 0.9, yb - body + sh * 0.95); c.moveTo(x + w / 2, yb - body + sh * 0.15); c.lineTo(x + w * 0.9, yb - body + sh * 0.95); c.stroke();
        c.restore();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const yb = H - 16, scale = (H - 34) / 180, narrow = W < 560, xa = narrow ? 30 : 60, xc = narrow ? 84 : 150;
        person(c, xa, yb, 170 * scale, 0.13, 'transparent', C.muted, true);
        kit.label(c, 'adult', xa, yb + 9, { align: 'center', size: 10.5, color: C.muted });
        const headFrac = 0.13 + 0.12 * Math.exp(-V.age / 3);
        person(c, xc, yb, cur.Hc * scale, headFrac, kit.hue(215, 0.45), C.text, false);
        kit.label(c, ageTxt(V.age), xc, yb + 9, { align: 'center', size: 10.5, weight: 700, color: C.text });
        const tx = narrow ? xc + 40 : Math.max(220, W * 0.3), mw = W - tx - 8;
        fitLabel(kit, c, fx(cur.W, 1) + ' kg · ' + fx(cur.Hc, 0) + ' cm · ' + fx(cur.bsa, 2) + ' m² (' + fx(cur.W / 70 * 100, 0) + ' % of 70 kg)', tx, 22, { size: 12.5, weight: 700, color: C.text }, mw);
        fitLabel(kit, c, 'clearance ' + sg(cur.CL, 3) + ' L/h = ' + fx(cur.rel * 100, 0) + ' % of the adult\'s', tx, 46, { size: 12, color: C.text }, mw);
        fitLabel(kit, c, '= size ' + fx(cur.size * 100, 0) + ' % × maturation ' + fx(cur.mf * 100, 0) + ' %' + (cur.dec < 1 ? ' × decline ' + fx(cur.dec * 100, 0) + ' %' : ''), tx, 66, { size: 12, color: C.muted }, mw);
        fitLabel(kit, c, 'per kilogram: ' + fx(cur.perKg * 100, 0) + ' % of the adult\'s', tx, 88, { size: 12, color: C.muted }, mw);
        fitLabel(kit, c, 'exposure with the adult mg/kg dose ' + fx(cur.exKg * 100, 0) + ' %; with the surface-area rule ' + fx(cur.exBsa * 100, 0) + ' %', tx, 112, { size: 12, color: Math.abs(cur.exKg - 1) > 0.25 ? C.bad : C.ok }, mw);
        fitLabel(kit, c, 'hypothetical drug — real doses come from paediatric and geriatric studies', tx, H - 16, { size: 11, color: C.muted }, mw);
      }, box.stage);
      loop.start();
    }
  });
})();
