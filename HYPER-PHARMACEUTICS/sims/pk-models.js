/* HYPER-PHARMACEUTICS · sims/pk-models.js — simulations for Pharmacokinetics › Models and dosing.
 *   pkm-bolus     one compartment after an IV bolus: tank, clearance pump, linear/semilog curve, two samples back-extrapolated
 *   pkm-infusion  a constant-rate infusion rising to its plateau; loading bolus; double the rate or stop the pump on the fly
 *   pkm-oral      oral absorption (Bateman): gut → body → out, tmax and Cmax, IV comparison, flip-flop when kₐ < k
 *   pkm-multiple  repeated doses by superposition (kit.med.pk): accumulation, peaks and troughs, loading dose, a missed dose, a window
 *   pkm-twocomp   two compartments with animated flows (kit.pharma.twoComp): α and β phases, method of residuals, noisy samples stripped
 *   pkm-mm        Michaelis–Menten elimination (kit.pharma.mmPK): saturating enzymes, the steady-state "hockey stick", AUC against dose
 *   pkm-nca       non-compartmental analysis: trapezoids (linear or log-down), λz fit, AUC∞ and the extrapolated tail, sampling designs
 * All drugs are hypothetical; these are teaching models, not dosing tools.
 */
(function () {
  'use strict';
  const LN2 = Math.LN2;
  const DRUG = 285;                                   // hue of the drug in the diagrams
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const SPANS = [4, 6, 8, 12, 18, 24, 36, 48, 72, 96, 120, 168, 240, 336, 480, 720];
  const niceSpan = h => SPANS.find(s => s >= h) || 720;
  const num = (kit, v, n) => Number.isFinite(v) ? kit.fmt(v, n || 3) : '—';
  const hours = (kit, h) => !Number.isFinite(h) ? '—' : h < 1 ? Math.round(h * 60) + ' min' : h < 72 ? kit.fmt(h, 3) + ' h' : kit.fmt(h / 24, 3) + ' days';
  const gauss = rng => { const u = Math.max(1e-12, rng()), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };

  /* ---------------------------------------------------------------- drawing helpers */
  function rrect(c, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  // a compartment: a tank tinted by the concentration (frac 0..1), with a title above and a line below
  function tank(kit, c, C, x, y, w, h, frac, title, sub) {
    rrect(c, x, y, w, h, Math.min(12, w / 5));
    c.fillStyle = C.hue(DRUG, 0.05 + 0.7 * clamp(frac, 0, 1)); c.fill();
    c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
    if (title) kit.label(c, title, x + w / 2, y - 8, { size: 12, weight: 700, color: C.text });
    if (sub) kit.label(c, sub, x + w / 2, y + h + 12, { size: 11.5, color: C.muted });
  }
  function pathLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function pointAt(pts, s) {
    for (let i = 1; i < pts.length; i++) {
      const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (s <= L || i === pts.length - 1) { const f = L > 0 ? clamp(s / L, 0, 1) : 0; return [pts[i - 1][0] + f * (pts[i][0] - pts[i - 1][0]), pts[i - 1][1] + f * (pts[i][1] - pts[i - 1][1])]; }
      s -= L;
    }
    return pts[0];
  }
  // moving dots along a path: phase in pixels, gap between dots; the caller sets fillStyle
  function flow(c, pts, phase, gap, r) {
    const L = pathLen(pts);
    if (!(L > 0) || !Number.isFinite(phase)) return;
    for (let s = ((phase % gap) + gap) % gap; s < L; s += gap) { const p = pointAt(pts, s); c.beginPath(); c.arc(p[0], p[1], r, 0, 6.283); c.fill(); }
  }
  function pipe(c, C, pts, w) {
    c.strokeStyle = C.grid; c.lineWidth = w || 7; c.lineCap = 'round'; c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.lineCap = 'butt';
  }
  // the liver-and-kidneys box that clears drug
  function organ(kit, c, C, x, y, w, h, title, sub) {
    rrect(c, x, y, w, h, 8); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.4; c.stroke();
    kit.label(c, title, x + w / 2, y + h / 2 - 7, { size: 12, weight: 700, color: C.text });
    kit.label(c, sub, x + w / 2, y + h / 2 + 9, { size: 11, color: C.muted });
  }
  // fixed pseudo-random spots for drug molecules inside a tank
  const SPOTS = Array.from({ length: 80 }, (_, i) => [(i * 0.6180339 + 0.05) % 1, (i * 0.7548776 + 0.31) % 1]);
  function molecules(c, C, x, y, w, h, n) {
    c.fillStyle = C.hue(DRUG, 0.95);
    for (let i = 0; i < Math.min(n, SPOTS.length); i++) { const d = SPOTS[i]; c.beginPath(); c.arc(x + 7 + d[0] * (w - 14), y + 7 + d[1] * (h - 14), 2.3, 0, 6.283); c.fill(); }
  }
  function plotBox(box) { const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb); return gb; }

  /* ================================================================ pkm-bolus */
  Hyper.sim('pkm-bolus', {
    title: 'An IV bolus in one compartment',
    blurb: `A dose injected into a single well-stirred volume *V* — the tank — and removed by a clearance *CL*, the "pump" on the right that cleans so many litres of plasma an hour. The tint of the tank is the concentration and the dots are the drug still in the body. Below is the concentration–time curve; on a logarithmic axis it becomes a straight line of slope −*k* whose intercept is *C*₀.

**Try this**
- Double the volume at the same clearance: the start halves, the half-life doubles — and the AUC does not change.
- Halve the clearance instead: the same start, the same longer half-life, but twice the AUC. The selector overlays both cases.
- Tick the log axis and take two samples: the dashed line through them, extended back to time zero, gives *C*₀ and so *V* = *D*/*C*₀ — which is how a volume is measured in practice. New samples scatter the estimate a little (5 % assay noise).
- Make the volume large and the clearance small, like a drug stored in tissues: the level is low but lingers for days.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170, maxH: 250 });
      const gb = plotBox(box);
      let clock = 0, seed = 1, span = 36, m = null, tick = 0, phase = 0;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'IV dose', min: 50, max: 2000, step: 50, value: 500, unit: 'mg' },
        { id: 'V', label: 'Volume of distribution V', min: 5, max: 400, value: 40, unit: 'L', log: true, sig: 2 },
        { id: 'CL', label: 'Clearance CL', min: 0.5, max: 50, value: 4, unit: 'L/h', log: true, sig: 2 },
        { id: 'cmp', type: 'select', label: 'Compare with', options: [['nothing', 'none'], ['the same patient with V doubled', 'V2'], ['the same patient with CL halved', 'CL2']], value: 'none' },
        { id: 'log', type: 'check', label: 'Logarithmic concentration axis', value: false },
        { id: 'smp', type: 'check', label: 'Take two samples and back-extrapolate', value: false },
        { type: 'buttons', items: [{ id: 'dose', label: 'Give the dose again', primary: true }, { id: 'resample', label: 'New samples' }] }
      ], (id) => { if (id === 'dose') clock = 0; if (id === 'resample') seed++; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['c0', 'Initial level C₀ = D/V'], ['k', 'k = CL/V and half-life'], ['auc', 'Exposure AUC = D/CL'], ['now', 'Now'], ['fit', 'From the two samples'], ['cmp', 'The comparison']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0, max: 36 }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 220);
      const model = (D, Vd, CL) => { const k = CL / Vd; return { k, C0: D / Vd, th: LN2 / k, auc: D / CL, at: t => D / Vd * Math.exp(-k * t) }; };
      function recompute() {
        m = model(V.D, V.V, V.CL);
        span = niceSpan(clamp(5 * m.th, 4, 720));
        if (clock > span * 1.08) clock = 0;
        const N = 240, pts = [];
        for (let i = 0; i <= N; i++) { const t = span * i / N; pts.push([t, m.at(t)]); }
        const series = [{ pts, label: 'this patient' }];
        let cm = null, fit = null;
        if (V.cmp !== 'none') {
          cm = V.cmp === 'V2' ? model(V.D, 2 * V.V, V.CL) : model(V.D, V.V, V.CL / 2);
          series.push({ pts: pts.map(p => [p[0], cm.at(p[0])]), label: V.cmp === 'V2' ? 'volume doubled' : 'clearance halved', dash: [6, 4] });
        }
        if (V.smp) {
          const rng = kit.bio.rng(seed), t1 = Math.max(0.5, Math.round(span * 0.3) / 2), t2 = Math.max(t1 + 1, Math.round(span * 0.6));
          const c1 = m.at(t1) * Math.exp(0.05 * gauss(rng)), c2 = m.at(t2) * Math.exp(0.05 * gauss(rng));
          const k = Math.log(c1 / c2) / (t2 - t1), C0 = c1 * Math.exp(k * t1);
          fit = { k, C0, Vd: V.D / C0, CL: k * V.D / C0 };
          series.push({ pts: [[t1, c1], [t2, c2]], label: 'two samples', line: false, dots: 5 });
          series.push({ pts: Array.from({ length: 41 }, (_, i) => { const t = t2 * i / 40; return [t, C0 * Math.exp(-k * t)]; }), label: 'line through them, back to t = 0', dash: [3, 4], width: 1.6 });
        }
        plot.set({
          x: { label: 'time (h)', min: 0, max: span },
          y: V.log ? { label: 'concentration (mg/L), log scale', log: true } : { label: 'plasma concentration (mg/L)', min: 0 },
          series, vlines: m.th < span ? [{ x: m.th, label: 't½' }] : []
        });
        ro.set('c0', num(kit, m.C0) + ' mg/L');
        ro.set('k', num(kit, m.k) + ' /h · t½ = ' + hours(kit, m.th));
        ro.set('auc', num(kit, m.auc) + ' mg·h/L');
        ro.set('fit', fit ? 'k ' + num(kit, fit.k) + ' /h, C₀ ' + num(kit, fit.C0) + ' mg/L → V ' + num(kit, fit.Vd) + ' L, CL ' + num(kit, fit.CL) + ' L/h' : 'tick "take two samples"');
        ro.set('cmp', cm ? 'C₀ ' + num(kit, cm.C0) + ' mg/L, t½ ' + hours(kit, cm.th) + ', AUC ' + num(kit, cm.auc) + ' mg·h/L' : 'choose one above');
        now();
      }
      function now() {
        const t = Math.min(clock, span), cc = m.at(t);
        plot.set({ marks: [{ x: t, y: cc, label: num(kit, cc) + ' mg/L' }] });
        ro.set('now', 't = ' + hours(kit, t) + ': ' + num(kit, cc) + ' mg/L, ' + (100 * Math.exp(-m.k * t)).toFixed(0) + ' % of the dose left');
      }
      recompute();
      const loop = kit.loop((dt) => {
        clock += dt * span / 14;                                   // one run in 14 seconds
        if (clock > span * 1.08) clock = 0;
        if (++tick % 6 === 0) now();
        const t = Math.min(clock, span), conc = m.at(t), left = Math.exp(-m.k * t);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the syringe
        const sy = Hh / 2;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(14, sy - 9, 52, 18);
        c.fillStyle = C.hue(DRUG, clock < span * 0.03 ? 0.2 : 0.7); c.fillRect(15, sy - 8, clock < span * 0.03 ? 10 : 40, 16);
        c.beginPath(); c.moveTo(66, sy); c.lineTo(84, sy); c.stroke();
        kit.label(c, V.D + ' mg', 40, sy - 20, { size: 11.5, color: C.muted });
        // the body: one well-stirred tank, its width growing with V
        const tw = clamp(60 + 45 * Math.log10(V.V / 5), 60, Math.min(190, W * 0.3)), th = Hh * 0.64, tx = Math.max(92, W * 0.36 - tw / 2), ty = (Hh - th) / 2 + 4;
        tank(kit, c, C, tx, ty, tw, th, conc / 25, 'body, V = ' + num(kit, V.V, 2) + ' L', num(kit, conc) + ' mg/L');
        molecules(c, C, tx, ty, tw, th, Math.round(60 * left));
        if (clock < span * 0.03) { kit.arrow(c, 70, sy, tx - 4, sy, C.hue(DRUG, 0.9), 2.5); }
        // the clearance: a pump that cleans CL litres an hour
        const ow = Math.min(130, W * 0.22), oh = 48, ox = Math.min(W - ow - 8, tx + tw + Math.max(40, W * 0.12)), oy = sy - oh / 2;
        const p = [[tx + tw, sy], [ox, sy]];
        pipe(c, C, p);
        phase += dt * (15 + 45 * Math.log10(1 + V.CL));
        c.fillStyle = C.hue(DRUG, 0.12 + 0.88 * clamp(left, 0, 1));
        flow(c, p, phase, 13, 2.6);
        organ(kit, c, C, ox, oy, ow, oh, 'liver + kidneys', 'CL = ' + num(kit, V.CL, 2) + ' L/h');
        kit.label(c, 'removing ' + num(kit, V.CL * conc, 2) + ' mg/h', ox + ow / 2, oy + oh + 14, { size: 11.5, color: C.muted });
        kit.label(c, 't = ' + hours(kit, t), W - 10, 14, { align: 'right', size: 12.5, weight: 700, color: C.text });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkm-infusion */
  Hyper.sim('pkm-infusion', {
    title: 'An infusion rising to its plateau',
    blurb: `A pump runs drug into a vein at a constant rate *R*₀ (the drip on the left) while the body clears it (the pump on the right). The level climbs until clearance removes exactly what the drip delivers: the plateau *C*ss = *R*₀/CL. The dashed lines mark one half-life (50 %), 3.3 half-lives (90 %) and 4.3 half-lives (95 %).

**Try this**
- Double the infusion rate: the plateau doubles, but the time to reach it does not change.
- Double the volume instead: the plateau stays where it was and takes twice as long to reach.
- Press "Double the rate now" or "Stop the pump now" while it runs: any change of rate reaches its new level over the same four to five half-lives, and the fall after stopping mirrors the rise.
- Tick the loading bolus: *C*ss·*V* given at the start puts the level on the plateau at once (compare with the dashed curve without it).
- Choose a 1-hour infusion: the level peaks when the pump stops, far below the plateau, and then falls exactly as after a bolus — a short infusion.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170, maxH: 250 });
      const gb = plotBox(box);
      let clock = 0, span = 48, extra = [], curve = [], ref = [], k = 0.1, th = 7, Css = 8, tick = 0, phase = 0, drop = 0;
      const ctl = kit.controls(box.side, [
        { id: 'R', label: 'Infusion rate R₀', min: 1, max: 200, value: 24, unit: 'mg/h', log: true, sig: 2 },
        { id: 'CL', label: 'Clearance CL', min: 0.5, max: 30, value: 3, unit: 'L/h', log: true, sig: 2 },
        { id: 'V', label: 'Volume of distribution V', min: 5, max: 300, value: 45, unit: 'L', log: true, sig: 2 },
        { id: 'run', type: 'select', label: 'The pump runs for', options: [['the whole time', 0], ['1 hour (a short infusion)', 1], ['8 hours', 8], ['24 hours', 24], ['3 days', 72]], value: 0 },
        { id: 'load', type: 'check', label: 'Start with a loading bolus Css·V', value: !!(params && params.load) },
        { id: 'log', type: 'check', label: 'Logarithmic concentration axis', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'double', label: 'Double the rate now' }, { id: 'stop', label: 'Stop the pump now' }] }
      ], (id) => {
        if (id === 'restart') { clock = 0; extra = []; }
        else if (id === 'double') extra.push({ t: Math.min(clock, span), x: 2 });
        else if (id === 'stop') extra.push({ t: Math.min(clock, span), x: 0 });
        else if (id === 'R' || id === 'CL' || id === 'V' || id === 'run') extra = [];
        recompute();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['css', 'Plateau Css = R₀/CL'], ['th', 'Half-life 0.693·V/CL'], ['t95', 'Time to 90 % / 95 % of the plateau'], ['ld', 'Loading bolus Css·V'], ['now', 'Now']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0, max: 48 }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 220);
      const N = 600;
      const rateAt = t => {
        let r = (V.run === 0 || t < V.run) ? V.R : 0;
        for (const e of extra) if (t >= e.t) r = e.x === 0 ? 0 : r * e.x;
        return r;
      };
      function simulate(C0) {
        const out = [[0, C0]], dt = span / N, f = Math.exp(-k * dt);
        let C = C0;
        for (let i = 0; i < N; i++) { const r = rateAt((i + 0.5) * dt); C = C * f + r / V.CL * (1 - f); out.push([(i + 1) * dt, C]); }
        return out;
      }
      const levelAt = t => { const i = clamp(Math.round(t / span * N), 0, curve.length - 1); return curve.length ? curve[i][1] : 0; };
      function recompute() {
        k = V.CL / V.V; th = LN2 / k; Css = V.R / V.CL;
        span = niceSpan(clamp(Math.max(6 * th, V.run > 0 ? V.run + 4 * th : 0), 4, 720));
        if (clock > span * 1.08) { clock = 0; extra = []; }
        curve = simulate(V.load ? Css : 0);
        ref = V.load ? simulate(0) : [];
        const series = [{ pts: curve, label: V.load ? 'with the loading bolus' : 'level' }];
        if (V.load) series.push({ pts: ref, label: 'without it', dash: [6, 4] });
        const vl = [];
        if (!V.load && V.run === 0 && !extra.length) [[1, '50 %'], [Math.log2(10), '90 %'], [Math.log2(20), '95 %']].forEach(([n, lab]) => { if (n * th < span) vl.push({ x: n * th, label: lab }); });
        if (V.run > 0 && V.run < span) vl.push({ x: V.run, label: 'pump stops' });
        extra.forEach(e => vl.push({ x: e.t, label: e.x ? 'rate ×2' : 'stopped' }));
        plot.set({
          x: { label: 'time (h)', min: 0, max: span },
          y: V.log ? { label: 'concentration (mg/L), log scale', log: true } : { label: 'plasma concentration (mg/L)', min: 0 },
          series, hlines: [{ y: Css, label: 'Css = R₀/CL' }], vlines: vl
        });
        ro.set('css', num(kit, Css) + ' mg/L');
        ro.set('th', hours(kit, th));
        ro.set('t95', hours(kit, th * Math.log2(10)) + ' / ' + hours(kit, th * Math.log2(20)));
        ro.set('ld', num(kit, Css * V.V) + ' mg' + (V.load ? ' (given)' : ''));
        now();
      }
      function now() {
        const t = Math.min(clock, span), cc = levelAt(t);
        plot.set({ marks: [{ x: t, y: cc, label: num(kit, cc) + ' mg/L' }] });
        ro.set('now', 't = ' + hours(kit, t) + ': ' + num(kit, cc) + ' mg/L (' + (100 * cc / Css).toFixed(0) + ' % of the plateau), pump ' + (rateAt(t) > 0 ? num(kit, rateAt(t), 2) + ' mg/h' : 'off'));
      }
      recompute();
      const loop = kit.loop((dt) => {
        clock += dt * span / 16;
        if (clock > span * 1.08) { clock = 0; if (extra.length) { extra = []; recompute(); } }
        if (++tick % 6 === 0) now();
        const t = Math.min(clock, span), cc = levelAt(t), r = rateAt(t);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the drip: a bag, a chamber with falling drops, a line to the body
        const bx = 16, by = 10, bw = 42, bh = 50, mid = Hh * 0.56;
        rrect(c, bx, by, bw, bh, 7); c.fillStyle = C.hue(DRUG, 0.35); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        kit.label(c, r > 0 ? num(kit, r, 2) + ' mg/h' : 'pump off', bx + bw + 6, by + 12, { align: 'left', size: 11.5, weight: 700, color: r > 0 ? C.text : C.muted });
        const chY = by + bh + 8, chH = 30;
        c.strokeRect(bx + bw / 2 - 7, chY, 14, chH);
        c.beginPath(); c.moveTo(bx + bw / 2, by + bh); c.lineTo(bx + bw / 2, chY); c.stroke();
        if (r > 0) {
          drop += dt * (0.6 + 1.4 * Math.log10(1 + r));
          c.fillStyle = C.hue(DRUG, 0.9); c.beginPath(); c.arc(bx + bw / 2, chY + 4 + (drop % 1) * (chH - 8), 2.6, 0, 6.283); c.fill();
        }
        const line = [[bx + bw / 2, chY + chH], [bx + bw / 2, mid], [0, mid]];
        // the body
        const tw = clamp(60 + 45 * Math.log10(V.V / 5), 60, Math.min(180, W * 0.28)), tH = Hh * 0.62, tx = Math.max(90, W * 0.34 - tw / 2), ty = mid - tH / 2;
        line[2][0] = tx;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); line.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
        tank(kit, c, C, tx, ty, tw, tH, cc / 25, 'body, V = ' + num(kit, V.V, 2) + ' L', num(kit, cc) + ' mg/L');
        molecules(c, C, tx, ty, tw, tH, Math.round(60 * clamp(cc / Math.max(Css, 1e-9), 0, 1.3) / 1.3));
        // clearance
        const ow = Math.min(120, W * 0.2), oh = 46, ox = Math.min(W - ow - 70, tx + tw + Math.max(36, W * 0.1)), oy = mid - oh / 2;
        const p = [[tx + tw, mid], [ox, mid]];
        pipe(c, C, p);
        phase += dt * (15 + 45 * Math.log10(1 + V.CL));
        c.fillStyle = C.hue(DRUG, 0.12 + 0.88 * clamp(cc / Math.max(Css, 1e-9), 0, 1));
        flow(c, p, phase, 13, 2.6);
        organ(kit, c, C, ox, oy, ow, oh, 'liver + kidneys', 'out: ' + num(kit, V.CL * cc, 2) + ' mg/h');
        // a gauge: the level against the plateau
        const gx = W - 34, gy = 16, gh = Hh - 34, top = Math.max(Css, cc, 1e-9) * 1.25, Y = v => gy + gh * (1 - clamp(v / top, 0, 1));
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(gx, gy, 14, gh);
        c.fillStyle = C.hue(DRUG, 0.7); c.fillRect(gx + 1, Y(cc), 12, gy + gh - Y(cc));
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(gx - 6, Y(Css)); c.lineTo(gx + 20, Y(Css)); c.stroke();
        kit.label(c, 'Css', gx - 8, Y(Css), { align: 'right', size: 11, color: C.ok, weight: 700 });
        kit.label(c, 't = ' + hours(kit, t), W - 60, 14, { align: 'right', size: 12.5, weight: 700, color: C.text });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkm-oral */
  Hyper.sim('pkm-oral', {
    title: 'A tablet: absorption, peak and flip-flop',
    blurb: `A tablet's absorbable drug (*F* × dose) empties from the gut into the body with rate constant *k*ₐ, and the body eliminates it with *k* — two first-order steps in a chain, which give the rise-and-fall Bateman curve. The dots show the flows; the dashed curve is the same dose given IV.

**Try this**
- Raise and lower *k*ₐ: the peak comes earlier and higher or later and lower — but the AUC readout does not move. Only *F* and the clearance set the exposure.
- Double the dose: the peak time stays exactly where it was.
- Make absorption slower than elimination (*k*ₐ below 0.1 /h with a 6.9 h half-life) and tick the log axis: the tail now falls with the *absorption* rate — flip-flop kinetics — more slowly than the IV curve ever does.
- Add a lag time: the whole curve shifts right, as when a tablet waits in the stomach.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170, maxH: 250 });
      const gb = plotBox(box);
      let clock = 0, span = 36, m = null, tick = 0, ph1 = 0, ph2 = 0;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Oral dose', min: 25, max: 1000, step: 25, value: 400, unit: 'mg' },
        { id: 'F', label: 'Bioavailability F', min: 0.05, max: 1, step: 0.05, value: 0.75 },
        { id: 'ka', label: 'Absorption rate constant kₐ', min: 0.01, max: 5, value: 1.5, unit: '1/h', log: true, sig: 2 },
        { id: 'th', label: 'Elimination half-life', min: 0.5, max: 48, value: 6.9, unit: 'h', log: true, sig: 2 },
        { id: 'V', label: 'Volume of distribution V', min: 5, max: 300, value: 50, unit: 'L', log: true, sig: 2 },
        { id: 'lag', label: 'Lag time', min: 0, max: 2, step: 0.25, value: 0, unit: 'h' },
        { id: 'iv', type: 'check', label: 'Compare with the same dose given IV', value: true },
        { id: 'log', type: 'check', label: 'Logarithmic axis, with the terminal line', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Take the tablet again', primary: true }] }
      ], (id) => { if (id === 'go') clock = 0; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tmax', 'Peak time tmax'], ['cmax', 'Peak level Cmax'], ['auc', 'AUC = F·D/CL (any kₐ)'], ['half', 'Absorption / elimination half-life'], ['tail', 'The terminal slope shows'], ['now', 'Now']]);
      const plot = kit.plot(gb, { x: { label: 'time after the dose (h)', min: 0, max: 36 }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 220);
      function build() {
        const k = LN2 / V.th, ka = V.ka, FD = V.F * V.D, lag = V.lag, near = Math.abs(ka - k) < 1e-6 * k;
        const coef = near ? 0 : FD * ka / (V.V * (ka - k));
        const at = t => { const s = t - lag; if (s <= 0) return 0; return near ? FD / V.V * k * s * Math.exp(-k * s) : coef * (Math.exp(-k * s) - Math.exp(-ka * s)); };
        const tm = near ? 1 / k : Math.log(ka / k) / (ka - k);
        return {
          k, ka, FD, lag, at, near, coef, tmax: lag + tm, cmax: FD / V.V * Math.exp(-k * tm), auc: FD / (k * V.V), CL: k * V.V, lam: Math.min(ka, k),
          gut: t => { const s = t - lag; return s <= 0 ? FD : FD * Math.exp(-ka * s); }
        };
      }
      function recompute() {
        m = build();
        span = niceSpan(clamp(V.lag + 5 * Math.max(V.th, LN2 / V.ka), 4, 720));
        if (clock > span * 1.08) clock = 0;
        const N = 300, pts = [];
        for (let i = 0; i <= N; i++) { const t = span * i / N; pts.push([t, m.at(t)]); }
        const series = [{ pts, label: 'oral dose' }];
        if (V.iv) series.push({ pts: pts.map(p => [p[0], V.D / V.V * Math.exp(-m.k * p[0])]), label: 'the same dose IV', dash: [6, 4] });
        if (V.log && !m.near) {
          const A = Math.abs(m.coef), t0 = Math.min(span, m.tmax * 0.5);
          series.push({ pts: [[m.lag + t0, A * Math.exp(-m.lam * t0)], [span, A * Math.exp(-m.lam * (span - m.lag))]], label: m.ka < m.k ? 'terminal line: slope kₐ (flip-flop)' : 'terminal line: slope k', dash: [2, 4], width: 1.6 });
        }
        plot.set({
          x: { label: 'time after the dose (h)', min: 0, max: span },
          y: V.log ? { label: 'concentration (mg/L), log scale', log: true } : { label: 'plasma concentration (mg/L)', min: 0 },
          series, vlines: m.tmax < span ? [{ x: m.tmax, label: 'tmax' }] : []
        });
        ro.set('tmax', hours(kit, m.tmax) + (V.lag ? ' (with ' + V.lag + ' h lag)' : ''));
        ro.set('cmax', num(kit, m.cmax) + ' mg/L' + (V.iv ? ' (IV start ' + num(kit, V.D / V.V) + ')' : ''));
        ro.set('auc', num(kit, m.auc) + ' mg·h/L');
        ro.set('half', hours(kit, LN2 / V.ka) + ' / ' + hours(kit, V.th));
        ro.set('tail', m.ka < m.k ? 'absorption — flip-flop: apparent t½ ' + hours(kit, LN2 / m.ka) : 'elimination: t½ ' + hours(kit, V.th));
        now();
      }
      function now() {
        const t = Math.min(clock, span), cc = m.at(t), body = cc * V.V, gut = m.gut(t);
        plot.set({ marks: [{ x: m.tmax, y: m.cmax, label: 'Cmax', color: kit.colors().warn }, { x: t, y: Math.max(cc, 1e-9) }] });
        ro.set('now', hours(kit, t) + ': gut ' + num(kit, gut, 2) + ' mg, body ' + num(kit, body, 2) + ' mg, cleared ' + num(kit, Math.max(0, m.FD - gut - body), 2) + ' mg');
      }
      recompute();
      const loop = kit.loop((dt) => {
        clock += dt * span / 15;
        if (clock > span * 1.08) clock = 0;
        if (++tick % 6 === 0) now();
        const t = Math.min(clock, span), cc = m.at(t), body = cc * V.V, gut = m.gut(t), out = Math.max(0, m.FD - gut - body);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, mid = Hh * 0.52;
        const bw = Math.min(120, W * 0.2), bh = Hh * 0.58, gap = (W - 3 * bw) / 4;
        const gx = gap, bx = 2 * gap + bw, ox = 3 * gap + 2 * bw, ty = mid - bh / 2;
        tank(kit, c, C, gx, ty, bw, bh, gut / V.D, 'gut', num(kit, gut, 2) + ' mg to absorb');
        molecules(c, C, gx, ty, bw, bh, Math.round(40 * gut / Math.max(V.D, 1e-9)));
        tank(kit, c, C, bx, ty, bw, bh, cc / 12, 'body', num(kit, cc) + ' mg/L');
        molecules(c, C, bx, ty, bw, bh, Math.round(40 * body / Math.max(V.D, 1e-9)));
        rrect(c, ox, ty + bh * 0.25, bw, bh * 0.75, 8); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.4; c.stroke();
        kit.label(c, 'cleared', ox + bw / 2, ty + bh * 0.25 - 8, { size: 12, weight: 700, color: C.text });
        kit.label(c, num(kit, out, 2) + ' mg', ox + bw / 2, ty + bh * 0.62, { size: 12, color: C.muted });
        const p1 = [[gx + bw, mid], [bx, mid]], p2 = [[bx + bw, mid], [ox, mid]];
        pipe(c, C, p1, 6); pipe(c, C, p2, 6);
        ph1 += dt * 40; ph2 += dt * 40;
        const f1 = m.ka * gut / Math.max(m.ka * m.FD, 1e-12), f2 = m.k * body / Math.max(m.k * V.V * m.cmax, 1e-12);
        c.fillStyle = C.hue(DRUG, 0.1 + 0.9 * clamp(f1, 0, 1)); flow(c, p1, ph1, 12, 2.5);
        c.fillStyle = C.hue(DRUG, 0.1 + 0.9 * clamp(f2, 0, 1)); flow(c, p2, ph2, 12, 2.5);
        kit.label(c, 'kₐ = ' + num(kit, m.ka, 2) + ' /h', (gx + bw + bx) / 2, mid - 14, { size: 11.5, color: C.text, weight: 700 });
        kit.label(c, 'k = ' + num(kit, m.k, 2) + ' /h', (bx + bw + ox) / 2, mid - 14, { size: 11.5, color: C.text, weight: 700 });
        kit.label(c, 'never absorbed: ' + num(kit, (1 - V.F) * V.D, 2) + ' mg', gx + bw / 2, Hh - 6, { size: 11, color: C.muted });
        kit.label(c, 't = ' + hours(kit, t), W - 8, 14, { align: 'right', size: 12.5, weight: 700, color: C.text });
        if (m.ka < m.k) kit.label(c, 'flip-flop: absorption is the slow step', W / 2, 12, { size: 12, weight: 700, color: C.warn });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkm-multiple */
  Hyper.sim('pkm-multiple', {
    title: 'Repeated doses: accumulation and steady state',
    blurb: `Doses given at a fixed interval τ, each one landing on what is left of the earlier ones — the curves simply add (superposition). The levels climb until each interval clears exactly one dose — the steady state. The strip above shows the doses and how close the levels are to steady state.

**Try this**
- Keep the dose rate fixed (300 mg every 12 h, then 150 mg every 6 h, then 600 mg every 24 h): the average stays the same, the swing changes.
- Lengthen the half-life to 48 h: steady state now takes eight to ten days, however the doses are spaced. Tick the loading dose and it starts there.
- Miss the fourth dose: the level dips below the usual troughs and takes several half-lives to recover fully.
- Show a therapeutic window and find an interval that keeps both peaks and troughs inside it. Switch to oral dosing: the peaks are lower and later, the troughs higher.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.16, minH: 116, maxH: 150 });
      const gb = plotBox(box);
      let clock = 0, span = 96, doses = [], pk = null, ss = {}, tick = 0;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Dose', min: 25, max: 1000, step: 25, value: 300, unit: 'mg' },
        { id: 'tau', type: 'select', label: 'Dosing interval τ', options: [['every 4 h', 4], ['every 6 h', 6], ['every 8 h', 8], ['every 12 h', 12], ['every 24 h', 24], ['every 48 h', 48]], value: 12 },
        { id: 'th', label: 'Elimination half-life', min: 1, max: 96, value: 12, unit: 'h', log: true, sig: 2 },
        { id: 'V', label: 'Volume of distribution V', min: 5, max: 300, value: 60, unit: 'L', log: true, sig: 2 },
        { id: 'route', type: 'select', label: 'Route', options: [['IV bolus', 'iv'], ['by mouth (F = 0.8, kₐ = 1 /h)', 'oral']], value: 'iv' },
        { id: 'load', type: 'check', label: 'Begin with a loading dose D/(1 − e^(−kτ))', value: !!(params && params.load) },
        { id: 'miss', type: 'check', label: 'Miss the fourth dose', value: false },
        { id: 'win', type: 'check', label: 'Show a therapeutic window', value: false },
        { id: 'lo', label: 'Window: lower limit', min: 0.5, max: 40, step: 0.5, value: 5, unit: 'mg/L' },
        { id: 'hi', label: 'Window: upper limit', min: 1, max: 80, step: 0.5, value: 12, unit: 'mg/L' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }] }
      ], (id) => { if (id === 'go') clock = 0; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['R', 'Accumulation factor R'], ['ss', 'Steady-state peak / trough'], ['avg', 'Average F·D/(CL·τ)'], ['fl', 'Peak ÷ trough'], ['t90', 'Time to 90 % of steady state'], ['ld', 'Loading dose D·R'], ['win', 'Time inside the window at steady state'], ['now', 'Now']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0, max: 96 }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 230);
      function recompute() {
        ctl.show('lo', V.win); ctl.show('hi', V.win); ro.show('win', V.win);
        const k = LN2 / V.th, tau = V.tau, oral = V.route === 'oral', F = oral ? 0.8 : 1, ka = 1;
        const r = Math.exp(-k * tau), R = 1 / (1 - r), LD = V.D * R;
        span = niceSpan(clamp(Math.max(6 * V.th, 4 * tau), 24, 720));
        if (clock > span * 1.05) clock = 0;
        const make = load => { const out = []; for (let i = 0; i * tau < span && i < 400; i++) { if (V.miss && i === 3) continue; out.push({ t: i * tau, amount: i === 0 && load ? LD : V.D, route: oral ? 'oral' : 'iv', F, ka }); } return out; };
        doses = make(V.load);
        pk = kit.med.pk({ halfLife: V.th, Vd: V.V, doses });
        const grid = new Set();
        for (let i = 0; i <= 600; i++) grid.add(span * i / 600);
        for (const d of doses) { if (d.t > 0) grid.add(d.t - span * 1e-6); grid.add(d.t); }
        const ts = [...grid].filter(t => t >= 0 && t <= span).sort((a, b) => a - b);
        const series = [{ pts: ts.map(t => [t, pk.at(t)]), label: V.load ? 'with the loading dose' : 'levels' }];
        if (V.load) { const pr = kit.med.pk({ halfLife: V.th, Vd: V.V, doses: make(false) }); series.push({ pts: ts.map(t => [t, pr.at(t)]), label: 'without it', dash: [6, 4] }); }
        // steady state over one interval
        const css = oral
          ? (t => F * V.D * ka / (V.V * (ka - k)) * (Math.exp(-k * t) / (1 - r) - Math.exp(-ka * t) / (1 - Math.exp(-ka * tau))))
          : (t => V.D / V.V * R * Math.exp(-k * t));
        let hi = -Infinity, lo = Infinity, inside = 0;
        for (let i = 0; i <= 400; i++) { const v = css(tau * i / 400); hi = Math.max(hi, v); lo = Math.min(lo, v); if (v >= V.lo && v <= V.hi) inside++; }
        ss = { hi, lo, avg: F * V.D / (k * V.V * tau), R, LD, k };
        const hl = [{ y: ss.avg, label: 'steady-state average' }];
        if (V.win) { hl.push({ y: V.lo, label: 'window: lower', color: C0().ok }); hl.push({ y: V.hi, label: 'window: upper', color: C0().ok }); }
        plot.set({ x: { label: 'time (h)', min: 0, max: span }, y: { label: 'plasma concentration (mg/L)', min: 0 }, series, hlines: hl });
        ro.set('R', num(kit, R) + ' (r = e^(−kτ) = ' + num(kit, r, 2) + ')');
        ro.set('ss', num(kit, hi) + ' / ' + num(kit, lo) + ' mg/L');
        ro.set('avg', num(kit, ss.avg) + ' mg/L');
        ro.set('fl', num(kit, hi / Math.max(lo, 1e-12)));
        ro.set('t90', hours(kit, V.th * Math.log2(10)) + ' ≈ ' + num(kit, V.th * Math.log2(10) / tau, 2) + ' intervals');
        ro.set('ld', num(kit, LD) + ' mg' + (V.load ? ' (given)' : ''));
        ro.set('win', V.lo >= V.hi ? 'set the lower limit below the upper' : (100 * inside / 401).toFixed(0) + ' % of each interval');
        now();
      }
      const C0 = () => kit.colors();
      function now() {
        const t = Math.min(clock, span), cc = pk.at(t);
        plot.set({ marks: [{ x: t, y: cc }] });
        const given = doses.filter(d => d.t <= t).length;
        ro.set('now', hours(kit, t) + ': ' + num(kit, cc) + ' mg/L after ' + given + ' dose' + (given === 1 ? '' : 's'));
      }
      recompute();
      const loop = kit.loop((dt) => {
        clock += dt * span / 18;
        if (clock > span * 1.05) clock = 0;
        if (++tick % 6 === 0) now();
        const t = Math.min(clock, span);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = 24, x1 = W - 24, X = s => x0 + (x1 - x0) * s / span, y = Hh * 0.62;
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
        // every scheduled dose as a capsule; the missed one hollow
        const tau = V.tau;
        for (let i = 0; i * tau < span && i < 400; i++) {
          const x = X(i * tau), missed = V.miss && i === 3, big = i === 0 && V.load, given = i * tau <= t;
          const w = big ? 9 : 6, h = big ? 22 : 14;
          rrect(c, x - w / 2, y - h - 4, w, h, w / 2);
          if (missed) { c.strokeStyle = C.bad; c.lineWidth = 1.4; c.setLineDash([2, 2]); c.stroke(); c.setLineDash([]); }
          else { c.fillStyle = given ? C.hue(DRUG, 0.9) : C.hue(DRUG, 0.25); c.fill(); }
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(t), y - 32); c.lineTo(X(t), y + 6); c.stroke();
        for (let h = 0; h <= span + 1e-9; h += span / 6) kit.label(c, hours(kit, h), X(h), y + 16, { size: 10.5, color: C.muted });
        // how close to steady state (for the regimen without a loading dose)
        const f = V.load ? 1 : 1 - Math.exp(-ss.k * t), bw = Math.min(260, W * 0.4);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x0, 8, bw, 10);
        c.fillStyle = f >= 0.9 ? C.ok : C.warn; c.fillRect(x0 + 1, 9, (bw - 2) * clamp(f, 0, 1), 8);
        kit.label(c, (V.load ? 'started at steady state' : 'steady state reached: ' + (100 * f).toFixed(0) + ' %'), x0 + bw + 8, 13, { align: 'left', size: 11.5, weight: 700, color: C.text });
        kit.label(c, 'each dose adds ' + num(kit, (V.route === 'oral' ? 0.8 : 1) * V.D / V.V, 2) + ' mg/L', x1, 13, { align: 'right', size: 11.5, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkm-twocomp */
  const linfit = xy => {
    const n = xy.length; let mx = 0, my = 0; for (const p of xy) { mx += p[0] / n; my += p[1] / n; }
    let sxy = 0, sxx = 0; for (const p of xy) { sxy += (p[0] - mx) * (p[1] - my); sxx += (p[0] - mx) ** 2; }
    const b = sxx > 0 ? sxy / sxx : NaN; return { a: my - b * mx, b };
  };
  Hyper.sim('pkm-twocomp', {
    title: 'Two compartments and the method of residuals',
    blurb: `An IV dose enters the central compartment (blood and well-perfused organs), spreads into the tissues with *k*₁₂, comes back with *k*₂₁ and is eliminated with *k*₁₀. The dots show the three flows. On the semilog plot the curve bends — a fast distribution (α) phase, then a straight terminal (β) phase — and the method of residuals pulls the two exponentials apart: the dashed terminal line *B*e^(−βt), the residuals (curve minus that line) and the dotted line through them, *A*e^(−αt).

**Try this**
- Watch the tissue compartment fill while the plasma level drops steeply: that early fall is distribution, not elimination. Tick "tissue concentration": the two levels meet and then fall together.
- Make *k*₁₂ small: the bend almost disappears and one compartment is enough.
- Make *k*₂₁ small (a drug that leaves the tissues slowly): the terminal phase flattens and the terminal half-life grows far longer than 0.693/*k*₁₀.
- Take noisy samples and strip them, as a laboratory would: the fitted α, β, *A* and *B* land close to the true ones — unless the two phases are too alike to separate.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 190, maxH: 270 });
      const gb = plotBox(box);
      let clock = 0, span = 48, m = null, smp = null, seed = 1, tick = 0;
      const ph = [0, 0, 0];
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'IV dose', min: 10, max: 1000, step: 10, value: 100, unit: 'mg' },
        { id: 'V1', label: 'Central volume V₁', min: 2, max: 100, value: 10, unit: 'L', log: true, sig: 2 },
        { id: 'k10', label: 'Elimination k₁₀', min: 0.01, max: 2, value: 0.395, unit: '1/h', log: true },
        { id: 'k12', label: 'Into the tissues k₁₂', min: 0.01, max: 5, value: 0.825, unit: '1/h', log: true },
        { id: 'k21', label: 'Back to the blood k₂₁', min: 0.01, max: 5, value: 0.38, unit: '1/h', log: true },
        { id: 'log', type: 'check', label: 'Logarithmic axis (semilog plot)', value: true },
        { id: 'res', type: 'check', label: 'Show the method of residuals', value: true },
        { id: 'tis', type: 'check', label: 'Show the tissue concentration', value: false },
        { type: 'buttons', items: [{ id: 'dose', label: 'Give the dose again', primary: true }, { id: 'strip', label: 'Take noisy samples and strip them' }, { id: 'clear', label: 'Clear the samples' }] }
      ], (id) => {
        if (id === 'dose') clock = 0;
        if (id === 'strip') { seed++; smp = true; }
        if (id === 'clear') smp = null;
        recompute();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ab', 'α and β (half-lives)'], ['AB', 'A + B = C₀'], ['vol', 'Volumes V₁ < Vss < Vβ'], ['cl', 'CL = k₁₀·V₁ and AUC'], ['fit', 'Stripped from the samples'], ['now', 'Now']]);
      const plot = kit.plot(gb, { x: { label: 'time after the dose (h)', min: 0, max: 48 }, y: { label: 'concentration (mg/L)', log: true }, legend: true }, 240);
      function build() {
        const o = P.twoComp({ dose: V.D, V1: V.V1, k10: V.k10, k12: V.k12, k21: V.k21 });
        const V2 = V.V1 * V.k12 / V.k21, dab = o.alpha - o.beta, CL = V.k10 * V.V1;
        const A2 = t => V.D * V.k12 / dab * (Math.exp(-o.beta * t) - Math.exp(-o.alpha * t));
        return Object.assign(o, { V2, A2, CL, C0: V.D / V.V1, Vss: V.V1 + V2, Vb: CL / o.beta, tha: LN2 / o.alpha, thb: LN2 / o.beta });
      }
      function strip() {
        const rng = kit.bio.rng(seed);
        const set = new Set([0.25, 0.5, 1, 2, 3].map(f => +(f * m.tha).toPrecision(3)).concat([0.25, 0.4, 0.6, 0.8, 1].map(f => +(f * span).toPrecision(3))));
        const pts = [...set].filter(t => t > 0 && t <= span).sort((a, b) => a - b).map(t => [t, m.at(t) * Math.exp(0.04 * gauss(rng))]);
        const tf = linfit(pts.slice(-4).map(p => [p[0], Math.log(p[1])]));
        const beta = -tf.b, B = Math.exp(tf.a);
        const res = pts.slice(0, 4).map(p => [p[0], p[1] - B * Math.exp(-beta * p[0])]).filter(p => p[1] > 0);
        let alpha = NaN, A = NaN;
        if (res.length >= 2) { const rf = linfit(res.map(p => [p[0], Math.log(p[1])])); alpha = -rf.b; A = Math.exp(rf.a); }
        const ok = Number.isFinite(alpha) && Number.isFinite(beta) && alpha > 1.5 * beta && beta > 0;
        return { pts, res, alpha, beta, A, B, ok };
      }
      function recompute() {
        m = build();
        span = niceSpan(clamp(5 * m.thb, 2, 720));
        if (clock > span * 1.08) clock = 0;
        const ts = new Set();
        for (let i = 0; i <= 240; i++) ts.add(span * i / 240);
        for (let i = 0; i <= 60; i++) { const t = m.tha * 0.02 * Math.pow(300, i / 60); if (t < span) ts.add(t); }
        const T = [...ts].sort((a, b) => a - b), floor = m.at(span) / 4;
        const keep = p => !V.log || p[1] >= floor;
        const series = [{ pts: T.map(t => [t, m.at(t)]), label: 'plasma (central)' }];
        if (V.tis) series.push({ pts: T.map(t => [t, m.A2(t) / m.V2]).filter(keep), label: 'tissue (peripheral)', dash: [8, 3] });
        if (V.res) {
          series.push({ pts: T.map(t => [t, m.B * Math.exp(-m.beta * t)]).filter(keep), label: 'terminal line Be^(−βt)', dash: [6, 4], width: 1.6 });
          series.push({ pts: T.filter(t => t < 8 * m.tha).map(t => [t, m.A * Math.exp(-m.alpha * t)]).filter(keep), label: 'residual line Ae^(−αt)', dash: [2, 3], width: 1.6 });
          if (!smp) series.push({ pts: [0.25, 0.5, 1, 1.5, 2, 3].map(f => f * m.tha).filter(t => t < span).map(t => [t, m.at(t) - m.B * Math.exp(-m.beta * t)]).filter(keep), label: 'residuals', line: false, dots: 4 });
        }
        let s = null;
        if (smp) {
          s = strip();
          series.push({ pts: s.pts, label: 'samples (4 % noise)', line: false, dots: 4.5 });
          if (V.res) series.push({ pts: s.res.filter(keep), label: 'residuals of the samples', line: false, dots: 3.5 });
        }
        plot.set({
          x: { label: 'time after the dose (h)', min: 0, max: span },
          y: V.log ? { label: 'concentration (mg/L), log scale', log: true } : { label: 'concentration (mg/L)', min: 0 },
          series, vlines: 3 * m.tha < span ? [{ x: 3 * m.tha, label: 'distribution mostly over' }] : []
        });
        ro.set('ab', 'α ' + num(kit, m.alpha) + ' /h (' + hours(kit, m.tha) + ') · β ' + num(kit, m.beta) + ' /h (' + hours(kit, m.thb) + ')');
        ro.set('AB', num(kit, m.A) + ' + ' + num(kit, m.B) + ' = ' + num(kit, m.C0) + ' mg/L');
        ro.set('vol', num(kit, V.V1) + ' < ' + num(kit, m.Vss) + ' < ' + num(kit, m.Vb) + ' L');
        ro.set('cl', num(kit, m.CL) + ' L/h · ' + num(kit, m.auc) + ' mg·h/L');
        ro.set('fit', !s ? 'press "take noisy samples"' : s.ok ? 'α ' + num(kit, s.alpha) + ', β ' + num(kit, s.beta) + ' /h; A ' + num(kit, s.A) + ', B ' + num(kit, s.B) + ' mg/L' : 'the phases are too alike to strip apart');
        now();
      }
      function now() {
        const t = Math.min(clock, span);
        plot.set({ marks: [{ x: t, y: m.at(t) }] });
        ro.set('now', hours(kit, t) + ': plasma ' + num(kit, m.at(t)) + ', tissue ' + num(kit, m.A2(t) / m.V2) + ' mg/L');
      }
      recompute();
      const loop = kit.loop((dt) => {
        clock += dt * span / 16;
        if (clock > span * 1.08) clock = 0;
        if (++tick % 6 === 0) now();
        const t = Math.min(clock, span), A1 = m.at(t) * V.V1, A2 = m.A2(t), gone = Math.max(0, V.D - A1 - A2);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const wd = v => clamp(50 + 42 * Math.log10(v / 2), 50, Math.min(160, W * 0.24));
        const w1 = wd(V.V1), w2 = wd(m.V2), hh = Hh * 0.46, ty = Hh * 0.16;
        const cx = Math.max(70, W * 0.3 - w1 / 2), px = Math.min(W - w2 - 16, Math.max(cx + w1 + 70, W * 0.68 - w2 / 2));
        const f1 = Math.sqrt(clamp(A1 / V.V1 / m.C0, 0, 1)), f2 = Math.sqrt(clamp(A2 / m.V2 / m.C0, 0, 1));
        tank(kit, c, C, cx, ty, w1, hh, f1, 'central, V₁ = ' + num(kit, V.V1, 2) + ' L', num(kit, A1, 2) + ' mg · ' + num(kit, A1 / V.V1) + ' mg/L');
        molecules(c, C, cx, ty, w1, hh, Math.round(60 * A1 / V.D));
        tank(kit, c, C, px, ty, w2, hh, f2, 'tissues, V₂ = ' + num(kit, m.V2, 2) + ' L', num(kit, A2, 2) + ' mg · ' + num(kit, A2 / m.V2) + ' mg/L');
        molecules(c, C, px, ty, w2, hh, Math.round(60 * A2 / V.D));
        const top = [[cx + w1, ty + hh * 0.3], [px, ty + hh * 0.3]], bot = [[px, ty + hh * 0.72], [cx + w1, ty + hh * 0.72]];
        const ex = cx + w1 / 2, down = [[ex, ty + hh + 20], [ex, Hh - 8]];
        pipe(c, C, top, 5); pipe(c, C, bot, 5); pipe(c, C, down, 5);
        const fmax = V.D * Math.max(V.k12, V.k10, 1e-9);
        [[top, V.k12 * A1], [bot, V.k21 * A2], [down, V.k10 * A1]].forEach(([p, flux], i) => {
          ph[i] += dt * 36;
          c.fillStyle = C.hue(DRUG, 0.08 + 0.92 * clamp(flux / fmax, 0, 1)); flow(c, p, ph[i], 11, 2.4);
        });
        kit.label(c, 'k₁₂ = ' + num(kit, V.k12, 2) + ' →', (cx + w1 + px) / 2, ty + hh * 0.3 - 11, { size: 11.5, weight: 700, color: C.text });
        kit.label(c, '← k₂₁ = ' + num(kit, V.k21, 2), (cx + w1 + px) / 2, ty + hh * 0.72 + 13, { size: 11.5, weight: 700, color: C.text });
        kit.label(c, 'k₁₀ = ' + num(kit, V.k10, 2) + ' /h: eliminated ' + num(kit, gone, 2) + ' mg', ex + 10, Hh - 16, { align: 'left', size: 11.5, color: C.muted });
        if (clock < span * 0.03) kit.arrow(c, 8, ty + hh / 2, cx - 4, ty + hh / 2, C.hue(DRUG, 0.9), 2.5);
        kit.label(c, t < 3 * m.tha ? 'distribution phase' : 'terminal (β) phase', W - 8, 12, { align: 'right', size: 12, weight: 700, color: t < 3 * m.tha ? C.warn : C.ok });
        kit.label(c, 't = ' + hours(kit, t), 8, 12, { align: 'left', size: 12.5, weight: 700, color: C.text });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkm-mm */
  Hyper.sim('pkm-mm', {
    title: 'Saturable elimination: a little more dose, a lot more drug',
    blurb: `A hypothetical drug removed by an enzyme with limited capacity (Michaelis–Menten: rate = *V*max·*C*/(*K*m + *C*)), given every day for two months (computed with fixed Runge–Kutta steps). The enzymes on the left fill up as the level rises; the bars compare what goes in each day with what the enzymes remove now and with the most they could ever remove. The dashed curves assume the clearance stayed at its low-level value, *V*max/*K*m.

**Try this**
- Raise the daily dose from 300 to 400 mg/day (with *V*max = 500): a third more drug, nearly three times the level — and it takes weeks, not days, to get there.
- Push the dose past *V*max: there is no steady state any more; the level climbs for as long as dosing continues.
- Switch the second graph to single doses: doubling a dose more than doubles the AUC.
- Raise *K*m well above the levels reached: the enzymes never saturate and the drug behaves linearly again.`,
    mount(box, kit) {
      const P = kit.pharma, DAYS = 60, DT = 0.01;
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 160, maxH: 230 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      let clock = 0, run = [], tick = 0, cssNow = 0;
      const ctl = kit.controls(box.side, [
        { id: 'R', label: 'Daily dose reaching the blood R', min: 50, max: 800, step: 10, value: 350, unit: 'mg/day' },
        { id: 'Vmax', label: 'Vmax (enzyme capacity)', min: 100, max: 1000, step: 10, value: 500, unit: 'mg/day' },
        { id: 'Km', label: 'Km', min: 0.5, max: 20, value: 4, unit: 'mg/L', log: true, sig: 2 },
        { id: 'V', label: 'Volume of distribution V', min: 10, max: 150, step: 5, value: 50, unit: 'L' },
        { id: 'tau', type: 'select', label: 'Given', options: [['once a day', 1], ['twice a day (half each time)', 0.5]], value: 1 },
        { id: 'lin', type: 'check', label: 'Compare with linear kinetics (CL fixed at Vmax/Km)', value: true },
        { id: 'g2', type: 'select', label: 'Second graph', options: [['steady state against daily dose', 'ss'], ['AUC against a single IV dose', 'auc']], value: 'ss' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start again', primary: true }] }
      ], (id) => { if (id === 'go') clock = 0; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['css', 'Steady state ≈ Km·R/(Vmax − R)'], ['lin', 'If clearance stayed at Vmax/Km'], ['t90', 'Time to 90 % of steady state'], ['cl', 'Apparent clearance and half-life there'], ['auc', 'A single dose doubled: AUC ×'], ['now', 'Now']]);
      const p1 = kit.plot(g1, { x: { label: 'time (days)', min: 0, max: DAYS }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 220);
      const p2 = kit.plot(g2, { x: { label: 'daily dose (mg/day)', min: 0 }, y: { label: 'steady-state level (mg/L)', min: 0 }, legend: true }, 220);
      const cssOf = R => R < V.Vmax ? V.Km * R / (V.Vmax - R) : Infinity;
      const aucOf = D => D * (V.Km + D / (2 * V.V)) / (V.Vmax / 24);            // mg·h/L, Vmax per hour
      const levelAt = t => run.length ? run[clamp(Math.round(t / DT), 0, run.length - 1)][1] : 0;
      function recompute() {
        const tau = V.tau, n = Math.round(DAYS / tau);
        run = P.mmPK({ dose: V.R * tau, Vd: V.V, Vmax: V.Vmax, Km: V.Km, tau, n, dt: DT });
        const series = [{ pts: run.filter((_, i) => i % 5 === 0), label: 'saturable (Michaelis–Menten)' }];
        if (V.lin) {
          const kl = V.Vmax / V.Km / V.V, f = Math.exp(-kl * DT), pts = [];
          let C = 0, next = 0;
          for (let i = 0; i * DT <= DAYS + 1e-9; i++) { const t = i * DT; if (t >= next - 1e-9) { C += V.R * tau / V.V; next += tau; } if (i % 5 === 0) pts.push([t, C]); C *= f; }
          series.push({ pts, label: 'if linear', dash: [6, 4] });
        }
        cssNow = cssOf(V.R);
        p1.set({ series, hlines: Number.isFinite(cssNow) ? [{ y: cssNow, label: 'Css' }] : [] });
        if (V.g2 === 'ss') {
          const top = Math.max(5 * V.Km, Math.min(Number.isFinite(cssNow) ? 1.6 * cssNow : Infinity, 40 * V.Km));
          const mm = [], ln = [];
          for (let i = 0; i <= 200; i++) { const R = 1.25 * V.Vmax * i / 200, c = cssOf(R); if (c <= 1.5 * top) mm.push([R, c]); ln.push([R, V.Km * R / V.Vmax]); }
          p2.set({
            x: { label: 'daily dose reaching the blood (mg/day)', min: 0, max: 1.25 * V.Vmax }, y: { label: 'steady-state level (mg/L)', min: 0, max: top },
            series: [{ pts: mm, label: 'saturable' }].concat(V.lin ? [{ pts: ln, label: 'if linear', dash: [6, 4] }] : []),
            vlines: [{ x: V.Vmax, label: 'Vmax' }], marks: Number.isFinite(cssNow) && cssNow <= top ? [{ x: V.R, y: cssNow, label: 'your dose' }] : []
          });
        } else {
          const mm = [], ln = [], Dm = Math.max(2000, 2.2 * V.R);
          for (let i = 0; i <= 100; i++) { const D = Dm * i / 100; mm.push([D, aucOf(D)]); ln.push([D, D * V.Km / (V.Vmax / 24)]); }
          p2.set({
            x: { label: 'single IV dose (mg)', min: 0, max: Dm }, y: { label: 'AUC (mg·h/L)', min: 0 },
            series: [{ pts: mm, label: 'saturable' }].concat(V.lin ? [{ pts: ln, label: 'if linear', dash: [6, 4] }] : []),
            vlines: [], marks: [{ x: V.R, y: aucOf(V.R), label: 'D' }, { x: 2 * V.R, y: aucOf(2 * V.R), label: '2D' }]
          });
        }
        if (Number.isFinite(cssNow)) {
          const CLa = V.Vmax / (V.Km + cssNow);
          ro.set('css', num(kit, cssNow) + ' mg/L');
          ro.set('t90', num(kit, V.Km * V.V * (Math.log(10) * V.Vmax - 0.9 * V.R) / Math.pow(V.Vmax - V.R, 2)) + ' days');
          ro.set('cl', num(kit, CLa) + ' L/day (low-level ' + num(kit, V.Vmax / V.Km) + ') · t½ ' + num(kit, LN2 * V.V / CLa) + ' days');
        } else {
          ro.set('css', 'none: R ≥ Vmax, the level keeps rising');
          ro.set('t90', '—'); ro.set('cl', 'falling towards zero');
        }
        ro.set('lin', num(kit, V.Km * V.R / V.Vmax) + ' mg/L');
        ro.set('auc', num(kit, aucOf(2 * V.R) / aucOf(V.R)) + ' (for ' + V.R + ' → ' + 2 * V.R + ' mg)');
        now();
      }
      function now() {
        const t = Math.min(clock, DAYS), cc = levelAt(t);
        p1.set({ marks: [{ x: t, y: cc }] });
        ro.set('now', 'day ' + t.toFixed(0) + ': ' + num(kit, cc) + ' mg/L, enzymes ' + (100 * cc / (V.Km + cc)).toFixed(0) + ' % busy');
      }
      recompute();
      const loop = kit.loop((dt) => {
        clock += dt * DAYS / 15;
        if (clock > DAYS * 1.05) clock = 0;
        if (++tick % 6 === 0) now();
        const t = Math.min(clock, DAYS), cc = levelAt(t), sat = cc / (V.Km + cc), v = V.Vmax * sat;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the enzymes: filled ones are busy
        const cols = 6, rows = 4, r = Math.min(13, (Hh - 50) / (2 * rows + 1.5), W * 0.3 / (2.6 * cols)), x0 = 18, y0 = 34, busy = Math.round(cols * rows * sat);
        kit.label(c, 'liver enzymes: ' + (100 * sat).toFixed(0) + ' % busy', x0, 14, { align: 'left', size: 12, weight: 700, color: C.text });
        for (let i = 0; i < cols * rows; i++) {
          const x = x0 + r + (i % cols) * r * 2.6, y = y0 + r + Math.floor(i / cols) * r * 2.4, on = i < busy;
          c.beginPath(); c.arc(x, y, r, 0.35, 2 * Math.PI - 0.35); c.lineTo(x, y); c.closePath();
          c.fillStyle = on ? C.hue(DRUG, 0.55) : C.surface; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
          if (on) { c.fillStyle = C.hue(DRUG, 1); c.beginPath(); c.arc(x + r * 0.55, y, r * 0.3, 0, 6.283); c.fill(); }
        }
        // input against output against capacity
        const bx = Math.max(x0 + cols * r * 2.6 + 30, W * 0.42), bw = W - bx - 16, scale = bw / (1.1 * Math.max(V.R, V.Vmax)), rows3 = [['dose in: R = ' + V.R + ' mg/day', V.R, C.hue(DRUG, 0.8)], ['removed now: ' + num(kit, v, 3) + ' mg/day', v, C.ok], ['most the enzymes can remove: Vmax', V.Vmax, C.muted]];
        rows3.forEach(([lab, val, col], i) => {
          const y = 24 + i * (Hh - 40) / 3.2;
          c.fillStyle = col; c.fillRect(bx, y + 6, Math.max(1, val * scale), 12);
          kit.label(c, lab, bx, y, { align: 'left', size: 11.5, color: C.text });
        });
        c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(bx + V.Vmax * scale, 16); c.lineTo(bx + V.Vmax * scale, Hh - 18); c.stroke(); c.setLineDash([]);
        kit.label(c, V.R >= V.Vmax ? 'input exceeds capacity: no steady state' : 'day ' + t.toFixed(0) + ' · ' + num(kit, cc) + ' mg/L', bx, Hh - 8, { align: 'left', size: 12, weight: 700, color: V.R >= V.Vmax ? C.bad : C.text });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pkm-nca */
  Hyper.sim('pkm-nca', {
    title: 'Non-compartmental analysis: trapezoids and the tail',
    blurb: `Blood samples after a 500 mg tablet of a hypothetical drug (true AUC 80 mg·h/L, true half-life 6.93 h), with assay noise. The area is built up trapezoid by trapezoid — blue where the level rises (linear), orange where it falls (logarithmic, if ticked) — and the tail beyond the last sample is extrapolated as *C*last/λz, with λz fitted to the last points on the semilog plot below.

**Try this**
- Untick the log trapezoids: every falling segment's chord sits above the curve and the AUC comes out too high — most of all between 12 and 24 h.
- Choose the sparse schedule: the peak is missed and the late segments are long. Then "too short": the tail becomes a large, fragile share of the total (more than the 20 % regulators generally accept).
- Use only two points for λz, then five with a slow absorption: points still near the peak make the slope too shallow or too steep.
- Press "New samples" a few times at 20 % noise and watch AUC∞ and the half-life scatter.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220, maxH: 330 });
      const gb = plotBox(box);
      const DOSE = 500, FDV = 8, K = 0.1, AUCTRUE = FDV / K;     // F·D/V = 8 mg/L, k = 0.1 /h
      const SCHED = { rich: [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24], std: [0, 1, 2, 4, 8, 12, 24], sparse: [0, 2, 8, 24], short: [0, 0.5, 1, 2, 3, 4, 6, 8] };
      let seed = 1, a = null, grow = 0;
      const ctl = kit.controls(box.side, [
        { id: 'sched', type: 'select', label: 'Sampling schedule', options: [['rich: 13 samples over 24 h', 'rich'], ['standard: 0, 1, 2, 4, 8, 12, 24 h', 'std'], ['sparse: 0, 2, 8, 24 h', 'sparse'], ['too short: stops at 8 h', 'short']], value: 'std' },
        { id: 'ka', type: 'select', label: 'Absorption', options: [['fast (kₐ = 1.2 /h)', 1.2], ['slow (kₐ = 0.3 /h)', 0.3]], value: 1.2 },
        { id: 'cv', label: 'Assay noise (CV)', min: 0, max: 20, step: 1, value: 5, unit: '%' },
        { id: 'nz', label: 'Last points used for λz', min: 2, max: 5, step: 1, value: 3 },
        { id: 'logd', type: 'check', label: 'Log trapezoids on the way down', value: true },
        { id: 'tail', type: 'check', label: 'Show the extrapolated tail', value: true },
        { type: 'buttons', items: [{ id: 'new', label: 'New samples (new noise)', primary: true }] }
      ], (id) => { if (id === 'new') seed++; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cmax', 'Cmax at tmax (true)'], ['auct', 'AUC to the last sample'], ['inf', 'AUC∞ (extrapolated share)'], ['lz', 'λz and half-life (true 6.93 h)'], ['cl', 'CL/F = dose/AUC∞ (true 6.25 L/h)'], ['err', 'AUC∞ against the true 80 mg·h/L']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0, max: 26 }, y: { label: 'concentration (mg/L), log scale', log: true }, legend: true }, 200);
      const truth = t => t <= 0 ? 0 : FDV * V.ka / (V.ka - K) * (Math.exp(-K * t) - Math.exp(-V.ka * t));
      function analyse() {
        const rng = kit.bio.rng(seed * 7919 + 13), ts = SCHED[V.sched];
        const cs = ts.map(t => t === 0 ? 0 : truth(t) * Math.exp(V.cv / 100 * gauss(rng)));
        let im = 0; cs.forEach((c, i) => { if (c > cs[im]) im = i; });
        const segs = []; let auc = 0;
        for (let i = 1; i < ts.length; i++) {
          const dt = ts[i] - ts[i - 1], c1 = cs[i - 1], c2 = cs[i], log = V.logd && c2 < c1 && c2 > 0;
          const ar = log ? (c1 - c2) * dt / Math.log(c1 / c2) : dt * (c1 + c2) / 2;
          segs.push({ t1: ts[i - 1], t2: ts[i], c1, c2, log, a: ar }); auc += ar;
        }
        const cand = []; for (let i = im + 1; i < ts.length; i++) if (cs[i] > 0) cand.push(i);
        const use = cand.slice(-Math.min(V.nz, cand.length));
        let lz = NaN, icpt = NaN;
        if (use.length >= 2) { const f = linfit(use.map(i => [ts[i], Math.log(cs[i])])); lz = -f.b; icpt = f.a; }
        const tl = ts[ts.length - 1], cl = cs[cs.length - 1], ok = lz > 0 && Number.isFinite(lz);
        const tailA = ok ? cl / lz : NaN;
        return { ts, cs, im, segs, auc, lz, icpt, use, tl, cl, ok, tailA, inf: auc + tailA };
      }
      function recompute() {
        a = analyse(); grow = 0;
        const tm = Math.log(V.ka / K) / (V.ka - K), cm = FDV * Math.exp(-K * tm);
        const Xmax = a.tl + (V.tail ? Math.max(6, 0.5 * a.tl) : 1);
        const tru = Array.from({ length: 121 }, (_, i) => { const t = Xmax * i / 120; return [t, truth(t)]; }).filter(p => p[1] > 0);
        const series = [{ pts: tru, label: 'true curve', dash: [3, 3], width: 1.3 }, { pts: a.ts.map((t, i) => [t, a.cs[i]]).filter(p => p[1] > 0), label: 'samples', line: false, dots: 4 }];
        if (a.ok) {
          series.push({ pts: a.use.map(i => [a.ts[i], a.cs[i]]), label: 'used for λz', line: false, dots: 6.5 });
          const t0 = a.ts[a.use[0]];
          series.push({ pts: [[t0, Math.exp(a.icpt - a.lz * t0)], [Xmax, Math.exp(a.icpt - a.lz * Xmax)]], label: 'fitted terminal line', dash: [7, 4], width: 1.8 });
        }
        plot.set({ x: { label: 'time (h)', min: 0, max: Xmax }, y: { label: 'concentration (mg/L), log scale', log: true }, series, vlines: [{ x: a.tl, label: 'last sample' }] });
        ro.set('cmax', num(kit, a.cs[a.im]) + ' mg/L at ' + a.ts[a.im] + ' h (' + num(kit, cm) + ' at ' + hours(kit, tm) + ')');
        ro.set('auct', num(kit, a.auc) + ' mg·h/L (0–' + a.tl + ' h)');
        const pct = 100 * a.tailA / a.inf;
        ro.set('inf', a.ok ? num(kit, a.inf) + ' mg·h/L (' + pct.toFixed(0) + ' %' + (pct > 20 ? ': too much — sample for longer' : '') + ')' : 'needs a terminal slope');
        ro.set('lz', a.ok ? num(kit, a.lz) + ' /h, ' + hours(kit, LN2 / a.lz) : 'cannot be estimated from these points');
        ro.set('cl', a.ok ? num(kit, DOSE / a.inf) + ' L/h' : '—');
        ro.set('err', a.ok ? ((a.inf / AUCTRUE - 1) * 100 >= 0 ? '+' : '−') + Math.abs((a.inf / AUCTRUE - 1) * 100).toFixed(1) + ' %' : '—');
      }
      recompute();
      const loop = kit.loop((dt) => {
        grow = Math.min(a.segs.length + 1, grow + dt * 2.2);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Xmax = a.tl + (V.tail ? Math.max(6, 0.5 * a.tl) : 1), ymax = 1.15 * Math.max(Math.max(...a.cs), FDV * 0.8, 1e-6);
        const x0 = 50, x1 = W - 14, y0 = 26, y1 = Hh - 30;
        const X = t => x0 + (x1 - x0) * t / Xmax, Y = v => y1 - (y1 - y0) * clamp(v / ymax, 0, 1.05);
        // axes and ticks
        c.strokeStyle = C.grid; c.lineWidth = 1;
        const xs = Hyper.niceStep(Xmax, 7), ys = Hyper.niceStep(ymax, 5);
        for (let v = ys; v <= ymax + 1e-9; v += ys) { c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(x1, Y(v)); c.stroke(); kit.label(c, kit.fmt(v, 3), x0 - 6, Y(v), { align: 'right', size: 10.5, color: C.muted }); }
        for (let t = 0; t <= Xmax + 1e-9; t += xs) kit.label(c, kit.fmt(t, 3), X(t), y1 + 12, { size: 10.5, color: C.muted });
        c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x0, y0 - 6); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
        kit.label(c, 'time (h)', x1, y1 + 24, { align: 'right', size: 11, color: C.muted });
        kit.label(c, 'mg/L', x0 - 6, y0 - 12, { align: 'right', size: 11, color: C.muted });
        // the trapezoids, one after another
        let run = 0;
        a.segs.forEach((s, i) => {
          const p = clamp(grow - i, 0, 1);
          if (p <= 0) return;
          const te = s.t1 + p * (s.t2 - s.t1), n = s.log ? 16 : 1, pts = [];
          const cAt = t => s.log ? s.c1 * Math.pow(s.c2 / s.c1, (t - s.t1) / (s.t2 - s.t1)) : s.c1 + (s.c2 - s.c1) * (t - s.t1) / (s.t2 - s.t1);
          for (let j = 0; j <= n; j++) { const t = s.t1 + (te - s.t1) * j / n; pts.push([X(t), Y(cAt(t))]); }
          c.beginPath(); c.moveTo(X(s.t1), y1); pts.forEach(q => c.lineTo(q[0], q[1])); c.lineTo(X(te), y1); c.closePath();
          c.fillStyle = s.log ? C.hue(30, i % 2 ? 0.34 : 0.22) : C.hue(210, i % 2 ? 0.34 : 0.22); c.fill();
          c.strokeStyle = s.log ? C.hue(30, 0.9) : C.hue(210, 0.9); c.lineWidth = 1.3; c.beginPath(); pts.forEach((q, j) => j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
          run += p * s.a;
          if (p >= 1 && X(s.t2) - X(s.t1) > 30) kit.label(c, kit.fmt(s.a, 3), (X(s.t1) + X(s.t2)) / 2, y1 - 9, { size: 10.5, weight: 700, color: C.text });
        });
        // the tail: Clast·e^(−λz(t − tlast)), its area Clast/λz
        if (V.tail && a.ok && grow >= a.segs.length) {
          const pts = []; for (let j = 0; j <= 30; j++) { const t = a.tl + (Xmax - a.tl) * j / 30; pts.push([X(t), Y(a.cl * Math.exp(-a.lz * (t - a.tl)))]); }
          c.beginPath(); c.moveTo(X(a.tl), y1); pts.forEach(q => c.lineTo(q[0], q[1])); c.lineTo(X(Xmax), y1); c.closePath(); c.fillStyle = C.hue(330, 0.22); c.fill();
          c.setLineDash([5, 4]); c.strokeStyle = C.hue(330, 0.9); c.beginPath(); pts.forEach((q, j) => j ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.setLineDash([]);
          kit.label(c, 'tail Clast/λz = ' + kit.fmt(a.tailA, 3) + ' → ∞', X(a.tl) + 6, Y(a.cl) - 14, { align: 'left', size: 11, weight: 700, color: C.text });
        }
        // the true curve, faint, and the samples
        c.setLineDash([3, 3]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath();
        for (let j = 0; j <= 160; j++) { const t = Xmax * j / 160, px = X(t), py = Y(truth(t)); j ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke(); c.setLineDash([]);
        a.ts.forEach((t, i) => kit.dot(c, X(t), Y(a.cs[i]), a.use.includes(i) ? 5 : 3.8, i === a.im ? C.warn : C.text));
        kit.label(c, 'Cmax ' + kit.fmt(a.cs[a.im], 3), X(a.ts[a.im]) + 8, Y(a.cs[a.im]) - 8, { align: 'left', size: 11, weight: 700, color: C.warn });
        kit.label(c, 'AUC so far ' + kit.fmt(run, 3) + ' mg·h/L', x1, 12, { align: 'right', size: 12.5, weight: 700, color: C.text });
        kit.label(c, 'linear', x0 + 12, 12, { align: 'left', size: 11, color: C.hue(210, 1), weight: 700 });
        kit.label(c, 'log-down', x0 + 58, 12, { align: 'left', size: 11, color: C.hue(30, 1), weight: 700 });
        kit.label(c, 'tail', x0 + 124, 12, { align: 'left', size: 11, color: C.hue(330, 1), weight: 700 });
      }, box.stage);
      loop.start();
    }
  });
})();
