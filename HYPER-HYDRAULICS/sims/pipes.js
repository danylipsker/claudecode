/* HYPER-HYDRAULICS · sims/pipes.js — simulations for the Pipe Flow branch (content/pipes.js).
 *   pipe-moody        an interactive Moody chart: drag the point; f, zone, Swamee–Jain and Haaland errors
 *   pipe-designer     a pumped pipeline: flow, bore, length, material and age, fittings → EGL/HGL,
 *                     pump head and power, and the system curve
 *   pipe-profile      laminar and turbulent velocity profiles, with tracer particles
 *   pipe-parallel     two pipes in parallel (or in series): the flow split, the head loss, the combined curves
 *   pipe-hardy-cross  Hardy Cross, one iteration at a time, on the two-loop network of the worked example
 *   pipe-economic     the economic diameter: capital charge against pumping energy
 *   pipe-siphon       a siphon: crest height, fall, bore, temperature, altitude → flow, crest pressure,
 *                     vapour-pressure limit and column separation
 * Friction factors come from kit.fluid (64/Re, Colebrook, blended through the critical zone).
 * Water properties from two small fits below (viscosity to about 1 %, density to about 0.1 %, 0–100 °C).
 */
(function () {
  'use strict';
  const G = 9.80665;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const muW = T => 2.414e-5 * Math.pow(10, 247.8 / (T + 133.15));          // water viscosity, Pa·s
  const rhoW = T => 1000 - 0.0178 * Math.pow(Math.abs(T - 4), 1.7);        // water density, kg/m³
  const nuW = T => muW(T) / rhoW(T);
  // pipe materials: equivalent roughness when new (mm) and an illustrative growth rate (mm a year, moderately aggressive water)
  const MATS = {
    pvc: { name: 'PVC / PE', eps: 0.0015, grow: 0.001 },
    steel: { name: 'Commercial steel', eps: 0.045, grow: 0.03 },
    galv: { name: 'Galvanised steel', eps: 0.15, grow: 0.03 },
    ci: { name: 'Cast iron, unlined', eps: 0.26, grow: 0.08 },
    conc: { name: 'Concrete', eps: 1.0, grow: 0.01 }
  };
  const matOptions = Object.keys(MATS).map(k => [MATS[k].name + ' (ε ' + MATS[k].eps + ' mm new)', k]);
  const SUP = '⁻⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = n => String(n).replace(/[-0-9]/g, ch => SUP['-0123456789'.indexOf(ch)]);
  const sci = (v, d) => {
    if (!(v > 0) || !Number.isFinite(v)) return '0';
    if (v >= 0.01 && v < 1e4) return String(+v.toPrecision(d + 1));
    const e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e);
    return m.toFixed(d) + '×10' + sup(e);
  };
  const fmtRe = v => (!(v > 0) || !Number.isFinite(v)) ? '0' : v < 1e4 ? String(Math.round(v)) : sci(v, 2);
  const bisect = (fn, lo, hi, n) => {           // fn increasing, fn(lo) < 0 < fn(hi)
    for (let k = 0; k < (n || 60); k++) { const m = (lo + hi) / 2; if (fn(m) > 0) hi = m; else lo = m; }
    return (lo + hi) / 2;
  };
  const designFrame = (st, W, H) => {             // a fixed W × H design grid, scaled and centred on the stage
    const k = Math.min(st.W / W, st.H / H);
    const c = st.ctx;
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return k;
  };
  // a valve in section, the familiar bow tie; fill 0..1 shades it as it closes
  function bowtie(c, x, y, s, color, fill, shade) {
    c.save();
    c.beginPath(); c.moveTo(x - s, y - s * 0.75); c.lineTo(x + s, y + s * 0.75); c.lineTo(x + s, y - s * 0.75); c.lineTo(x - s, y + s * 0.75); c.closePath();
    c.fillStyle = fill; c.fill();
    if (shade > 0) { c.globalAlpha = clamp(shade, 0, 1) * 0.85; c.fillStyle = color; c.fill(); c.globalAlpha = 1; }
    c.strokeStyle = color; c.lineWidth = 1.6; c.stroke();
    c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - s * 1.3); c.moveTo(x - s * 0.6, y - s * 1.3); c.lineTo(x + s * 0.6, y - s * 1.3); c.stroke();
    c.restore();
  }

  /* ================================================================ the Moody chart */
  Hyper.sim('pipe-moody', {
    title: 'The Moody chart, interactive',
    blurb: `The friction factor of every pipe on one chart, with logarithmic scales: the laminar line $f = 64/Re$ on the left, the critical zone (shaded), and Colebrook's turbulent curves for relative roughnesses $\\varepsilon/D$ from 10⁻⁶ to 0.05, with the smooth-pipe curve at the bottom. The dashed line bounds the fully rough zone. **Drag the point** anywhere on the chart: left and right set the Reynolds number; in turbulent flow, up and down pick the roughness curve that passes through the point.

**Try this**
- Start in laminar flow and drag to the right: $f$ falls along $64/Re$, crosses the critical zone and lands on a turbulent curve several times higher than the laminar line would give.
- Follow a rough curve to the right until it goes flat. The read-out $n$ (head loss ∝ $V^n$) climbs from 1 in laminar flow through about 1.75 for smooth pipes to 2 in the fully rough zone.
- At $Re = 5000$, compare a smooth wall with $\\varepsilon/D = 10^{-3}$: hardly any difference — the roughness is hidden in the viscous sublayer. Repeat at $Re = 10^7$.
- Choose a real pipe from the list and read the Swamee–Jain and Haaland errors: about 1–2 % against Colebrook.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const P = Object.assign({ Re: 2e5, rr: 4.5e-4 }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320, maxH: 560 });
      let Re = clamp(P.Re, 500, 1e8), rr = clamp(P.rr || 1e-6, 1e-6, 0.05), smooth = !(P.rr > 0), dirty = true, acc = 0;
      const LX0 = Math.log10(500), LX1 = 8, LY0 = Math.log10(0.006), LY1 = Math.log10(0.1), L23 = Math.log10(2300), L40 = Math.log10(4000);
      // the family of curves, computed once, in log–log coordinates
      const RR = [0, 1e-6, 5e-6, 1e-5, 5e-5, 1e-4, 2e-4, 5e-4, 1e-3, 2e-3, 5e-3, 0.01, 0.02, 0.03, 0.05];
      const N = 150, lre = [];
      for (let i = 0; i <= N; i++) lre.push(L23 + (LX1 - L23) * i / N);
      const curveOf = r => lre.map(l => [l, Math.log10(F.colebrook(Math.pow(10, l), r))]);
      const curves = RR.map(r => ({ r, pts: curveOf(r) }));
      const rough = [];                                       // boundary of the fully rough zone: (ε/D)·Re·√f = 200
      for (let l = -5; l <= Math.log10(0.05) + 1e-9; l += 0.05) {
        const r = Math.pow(10, l), fr = F.colebrook(1e12, r), R = 200 / (r * Math.sqrt(fr));
        if (R <= 1e8) rough.push([Math.log10(R), Math.log10(F.colebrook(R, r))]);
      }
      let cur = curveOf(smooth ? 0 : rr);
      const ctl = kit.controls(box.side, [
        { id: 'Re', label: 'Reynolds number Re', min: 500, max: 1e8, value: Re, log: true, sig: 3, fmt: fmtRe },
        { id: 'rr', label: 'Relative roughness ε/D', min: 1e-6, max: 0.05, value: rr, log: true, sig: 2, fmt: v => sci(v, 1) },
        { id: 'smooth', type: 'check', label: 'Hydraulically smooth wall (ε = 0)', value: smooth },
        { id: 'pipe', type: 'select', label: 'Set ε/D for a 100 mm bore of…', value: 'keep',
          options: [['(keep the slider)', 'keep'], ['drawn tubing or PVC, ε 0.0015 mm', 0.0015], ['commercial steel, ε 0.045 mm', 0.045], ['galvanised steel, ε 0.15 mm', 0.15], ['cast iron, ε 0.26 mm', 0.26], ['concrete, ε 1 mm', 1], ['riveted steel, ε 3 mm', 3]] }
      ], (id, v) => {
        if (id === 'Re') Re = v;
        if (id === 'rr') { rr = v; smooth = false; ctl.set('smooth', false); }
        if (id === 'smooth') smooth = !!v;
        if (id === 'pipe' && typeof v === 'number') { rr = clamp(v / 100, 1e-6, 0.05); smooth = false; ctl.set('rr', rr); ctl.set('smooth', false); }
        cur = curveOf(smooth ? 0 : rr);
        dirty = true;
      });
      const ro = kit.readout(box.side, [['re', 'Reynolds number'], ['rr', 'Relative roughness ε/D'], ['zone', 'Zone'], ['f', 'Friction factor f'], ['alt', 'Swamee–Jain / Haaland'], ['rk', 'Roughness Reynolds number'], ['n', 'Head loss ∝ Vⁿ, n =']]);
      const geo = () => ({ x0: 58, x1: st.W - 60, y0: 24, y1: st.H - 40 });
      const X = (g, l) => g.x0 + (l - LX0) / (LX1 - LX0) * (g.x1 - g.x0);
      const Y = (g, l) => g.y1 - (l - LY0) / (LY1 - LY0) * (g.y1 - g.y0);
      function path(c, g, pts, from, to) {
        c.beginPath(); let pen = false;
        for (const p of pts) { if (p[0] < from - 1e-9 || p[0] > to + 1e-9) continue; const x = X(g, p[0]), y = Y(g, p[1]); if (pen) c.lineTo(x, y); else { c.moveTo(x, y); pen = true; } }
        c.stroke();
      }
      function readouts(r, f) {
        ro.set('re', fmtRe(Re));
        ro.set('rr', r > 0 ? sci(r, 2) : '0 (smooth)');
        let zone;
        if (Re < 2300) zone = 'laminar';
        else if (Re < 4000) zone = 'critical zone: laminar or turbulent, unpredictable';
        else {
          const fs = F.colebrook(Re, 0), fr = r > 0 ? 1 / Math.pow(2 * Math.log10(3.7 / r), 2) : 0;
          zone = f < fs * 1.03 ? 'turbulent, hydraulically smooth' : (fr > 0 && f < fr * 1.03) ? 'turbulent, fully rough' : 'turbulent, transitional';
        }
        ro.set('zone', zone);
        ro.set('f', f.toFixed(4) + (Re < 2300 ? '  (64/Re)' : Re < 4000 ? '  (blended, uncertain)' : '  (Colebrook)'));
        if (Re >= 4000) {
          const sj = F.swameeJain(Re, r), ha = 1 / Math.pow(-1.8 * Math.log10(Math.pow(r / 3.7, 1.11) + 6.9 / Re), 2);
          const pc = x => (x >= 0 ? '+' : '−') + Math.abs(x * 100).toFixed(1) + ' %';
          ro.set('alt', sj.toFixed(4) + ' (' + pc(sj / f - 1) + ') / ' + ha.toFixed(4) + ' (' + pc(ha / f - 1) + ')');
          ro.set('rk', r > 0 ? (r * Re * Math.sqrt(f / 8)).toFixed(1) + '  (sand grains: smooth < 5, rough > 70)' : '0');
        } else { ro.set('alt', 'not for laminar or critical flow'); ro.set('rk', '—'); }
        const h = 1.02, n = 2 + (Math.log(F.friction(Re * h, r)) - Math.log(F.friction(Re / h, r))) / (2 * Math.log(h));
        ro.set('n', Re > 2100 && Re < 4400 ? '— (critical zone)' : n.toFixed(2));
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), g = geo(), r = smooth ? 0 : rr;
        const lRe = Math.log10(Re), f = F.friction(Re, r);
        readouts(r, f);
        // critical zone
        c.fillStyle = kit.hue(40, 0.13);
        c.fillRect(X(g, L23), g.y0, X(g, L40) - X(g, L23), g.y1 - g.y0);
        // grid and axes
        c.lineWidth = 1;
        for (let e = 2; e <= 8; e++) for (let k = 1; k <= 9; k++) {
          const l = e + Math.log10(k);
          if (l < LX0 - 1e-9 || l > LX1 + 1e-9) continue;
          const x = Math.round(X(g, l)) + 0.5;
          c.strokeStyle = C.grid; c.globalAlpha = k === 1 ? 1 : 0.55;
          c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke(); c.globalAlpha = 1;
          if (k === 1) kit.label(c, '10' + sup(e), x, g.y1 + 13, { color: C.muted, size: 11, align: 'center' });
        }
        const fl = [0.006, 0.007, 0.008, 0.009, 0.01, 0.015, 0.02, 0.025, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1];
        const fLab = [0.008, 0.01, 0.015, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.1];
        for (const fv of fl) {
          const y = Math.round(Y(g, Math.log10(fv))) + 0.5;
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x1, y); c.stroke();
          if (fLab.indexOf(fv) >= 0) kit.label(c, String(fv), g.x0 - 5, y, { color: C.muted, size: 10.5, align: 'right' });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(g.x0, g.y0, g.x1 - g.x0, g.y1 - g.y0);
        c.save(); c.beginPath(); c.rect(g.x0, g.y0, g.x1 - g.x0, g.y1 - g.y0); c.clip();
        // laminar line
        const lam = [[LX0, Math.log10(64) - LX0], [L23, Math.log10(64) - L23], [L40, Math.log10(64) - L40]];
        c.strokeStyle = C.text; c.lineWidth = 1.8; path(c, g, lam, LX0, L23);
        c.setLineDash([4, 4]); c.lineWidth = 1.2; path(c, g, lam, L23, L40); c.setLineDash([]);
        // turbulent curves
        for (const cv of curves) {
          c.strokeStyle = cv.r === 0 ? C.text : C.muted; c.lineWidth = cv.r === 0 ? 1.6 : 1.1;
          path(c, g, cv.pts, L40, LX1);
          c.setLineDash([3, 4]); path(c, g, cv.pts, L23, L40); c.setLineDash([]);
        }
        // fully rough boundary
        c.strokeStyle = C.warn; c.lineWidth = 1.3; c.setLineDash([7, 5]); path(c, g, rough, LX0, LX1); c.setLineDash([]);
        // the curve of the current roughness
        if (Re >= 2300) { c.strokeStyle = C.accent; c.lineWidth = 2.6; path(c, g, cur, L23, LX1); }
        else { c.strokeStyle = C.accent; c.lineWidth = 2.6; path(c, g, lam, LX0, L23); }
        // zone names
        kit.label(c, 'laminar', X(g, Math.log10(900)), Y(g, Math.log10(0.09)), { color: C.text2 || C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'f = 64/Re', X(g, Math.log10(900)), Y(g, Math.log10(0.09)) + 15, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'critical', X(g, (L23 + L40) / 2), g.y0 + 12, { color: C.warn, size: 10.5, weight: 700, align: 'center' });
        kit.label(c, 'fully rough', X(g, 7.1), Y(g, Math.log10(0.085)), { color: C.warn, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'smooth pipe', X(g, 6.3), Y(g, Math.log10(F.colebrook(Math.pow(10, 6.3), 0))) + 13, { color: C.text, size: 11, weight: 700, align: 'center' });
        // the point
        const px = X(g, lRe), py = Y(g, Math.log10(f));
        c.strokeStyle = C.accent; c.globalAlpha = 0.6; c.lineWidth = 1; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(px, g.y1); c.lineTo(px, py); c.lineTo(g.x0, py); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
        c.restore();
        kit.dot(c, px, py, 6.5, C.accent, C.surface);
        kit.label(c, 'f = ' + f.toFixed(4), px + (px > (g.x0 + g.x1) / 2 ? -12 : 12), py - 16, { color: C.text, size: 12, weight: 700, align: px > (g.x0 + g.x1) / 2 ? 'right' : 'left', bg: C.surface });
        // curve labels at the right edge
        let lastY = -1e9;
        const labs = curves.map(cv => ({ r: cv.r, y: Y(g, cv.pts[cv.pts.length - 1][1]) })).sort((a, b) => a.y - b.y);
        for (const L of labs) {
          if (L.y - lastY < 11) continue;
          lastY = L.y;
          kit.label(c, L.r === 0 ? 'smooth' : sci(L.r, 0), g.x1 + 4, L.y, { color: C.muted, size: 9.5, align: 'left' });
        }
        kit.label(c, 'ε/D', g.x1 + 4, g.y0 - 12, { color: C.text, size: 11, weight: 700, align: 'left' });
        kit.label(c, 'Reynolds number  Re = VD/ν', g.x1, st.H - 9, { color: C.text, size: 11.5, weight: 600, align: 'right' });
        c.save(); c.translate(13, (g.y0 + g.y1) / 2); c.rotate(-Math.PI / 2);
        kit.label(c, 'friction factor f', 0, 0, { color: C.text, size: 11.5, weight: 600, align: 'center' });
        c.restore();
      }
      kit.drag(st, {
        hit: p => { const g = geo(); return (p.x >= g.x0 - 8 && p.x <= g.x1 + 8 && p.y >= g.y0 - 8 && p.y <= g.y1 + 8) ? 'pt' : null; },
        move: (k, p) => {
          const g = geo();
          Re = Math.pow(10, clamp(LX0 + (p.x - g.x0) / (g.x1 - g.x0) * (LX1 - LX0), LX0, LX1));
          ctl.set('Re', Re);
          if (Re > 4000) {
            const f = Math.pow(10, clamp(LY0 + (g.y1 - p.y) / (g.y1 - g.y0) * (LY1 - LY0), LY0, LY1));
            const s = Math.sqrt(f), r = 3.7 * (Math.pow(10, -1 / (2 * s)) - 2.51 / (Re * s));   // Colebrook solved for ε/D
            if (r < 1e-6) { smooth = true; ctl.set('smooth', true); }
            else { smooth = false; rr = Math.min(0.05, r); ctl.set('rr', rr); ctl.set('smooth', false); }
            cur = curveOf(smooth ? 0 : rr);
          }
          dirty = true;
        },
        hover: true
      });
      st.onResize(() => { dirty = true; });
      const loop = kit.loop(dt => {
        acc += dt;
        if (dirty || acc > 0.5) { draw(); dirty = false; acc = 0; }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the pipeline designer */
  const VALVES = {
    gate: { name: 'gate valve + swing check', K: [0.2, 2], tags: ['gate', 'check'] },
    half: { name: 'gate valve half shut + swing check', K: [4, 2], tags: ['gate ½', 'check'] },
    globe: { name: 'globe valve + swing check', K: [10, 2], tags: ['globe', 'check'] },
    fly: { name: 'butterfly valve + swing check', K: [0.4, 2], tags: ['butterfly', 'check'] },
    ball: { name: 'ball valve only', K: [0.05], tags: ['ball'] }
  };
  Hyper.sim('pipe-designer', {
    title: 'A pumped pipeline',
    blurb: `A pump lifts water (20 °C) from a supply tank into a higher tank through a pipe with elbows (K = 0.5 each) and valves. The drawing shows the **energy grade line** (EGL, solid) and the **hydraulic grade line** (HGL, dashed; the pressure head above the pipe): the pump raises them by its head $H$, pipe friction makes them slope down, every fitting drops them by a step, and the exit into the upper tank costs one velocity head. Below, the **system curve** — the head this pipeline needs at every flow — with the present design marked. The pump and motor are taken as 70 % efficient.

**Try this**
- Halve the bore at the same flow: the friction slope steepens about thirty-fold and the pump head soars.
- Make the pipe short (20–40 m) and add a dozen elbows and a globe valve: now the fittings, not the pipe, eat most of the head (see the equivalent length).
- Choose unlined cast iron and let it age 40 years (illustrative roughening of 0.08 mm a year): the friction factor about doubles.
- Set the static lift to zero: the system curve starts at the origin, and all the pump's power goes into friction.
- Watch the velocity: above about 3 m/s the line is noisy and surges are violent; below about 0.5 m/s sediment settles.`,
    mount(box, kit, params) {
      const F = kit.fluid, S = kit.fsym;
      const P = Object.assign({ Q: 36, D: 100, L: 500, lift: 20, mat: 'steel', age: 0, elbows: 6, valve: 'gate', bell: false }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 290 });
      const gdiv = document.createElement('div');
      gdiv.style.padding = '4px 10px 10px';
      box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'flow (m³/h)', min: 0 }, y: { label: 'head (m)', min: 0 }, legend: true }, 170);
      let dirty = true, m = null, ph = 0, ph2 = 0;
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Flow', min: 1, max: 1000, value: P.Q, unit: 'm³/h', log: true, sig: 3 },
        { id: 'D', label: 'Pipe bore', min: 15, max: 600, value: P.D, unit: 'mm', log: true, sig: 3 },
        { id: 'L', label: 'Pipe length', min: 5, max: 5000, value: P.L, unit: 'm', log: true, sig: 3 },
        { id: 'lift', label: 'Static lift, surface to surface', min: 0, max: 60, step: 0.5, value: P.lift, unit: 'm' },
        { id: 'mat', type: 'select', label: 'Pipe material', options: matOptions, value: MATS[P.mat] ? P.mat : 'steel' },
        { id: 'age', label: 'Age of the pipe', min: 0, max: 60, step: 1, value: P.age, unit: 'yr' },
        { id: 'elbows', label: '90° elbows (K = 0.5 each)', min: 0, max: 20, step: 1, value: P.elbows },
        { id: 'valve', type: 'select', label: 'Valves', options: Object.keys(VALVES).map(k => [VALVES[k].name, k]), value: VALVES[P.valve] ? P.valve : 'gate' },
        { id: 'bell', type: 'check', label: 'Bellmouth entrance (K 0.04 instead of 0.5)', value: !!P.bell }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['v', 'Velocity / Reynolds number'], ['f', 'Roughness ε / friction factor f'], ['hf', 'Pipe friction h_f'], ['hm', 'Fittings ΣK → h_m'], ['le', 'Fittings as pipe length'], ['H', 'Pump head H = lift + losses'], ['p', 'Pump outlet pressure (gauge)'], ['P', 'Hydraulic / shaft power'], ['share', 'Share of power lost to friction']]);
      const V_ = ctl.values;
      const rho = rhoW(20), nu = nuW(20), eta = 0.7;
      function model(Qh) {
        const Q = Math.max(0, Qh) / 3600, D = V_.D / 1000, L = V_.L, mat = MATS[V_.mat] || MATS.steel;
        const eps = (mat.eps + mat.grow * V_.age) / 1000;
        const A = Math.PI * D * D / 4, V = Q / A, Re = V * D / nu;
        const f = Re > 0 ? F.friction(Re, eps / D) : 0;
        const hv = V * V / (2 * G), hf = f * L / D * hv;
        const Kent = V_.bell ? 0.04 : 0.5, Kv = (VALVES[V_.valve] || VALVES.gate).K, Kel = 0.5;
        const sumK = Kent + Kv.reduce((a, b) => a + b, 0) + V_.elbows * Kel + 1;
        const hm = sumK * hv;
        return { Q, D, L, eps, A, V, Re, f, hv, hf, Kent, Kv, Kel, sumK, hm, H: V_.lift + hf + hm };
      }
      function update() {
        m = model(V_.Q);
        const qmax = Math.max(2 * V_.Q, 1), pts = [];
        for (let i = 0; i <= 50; i++) { const q = qmax * i / 50; pts.push([q, model(q).H]); }
        plot.set({ series: [{ pts, label: 'system curve: lift + friction + fittings' }], marks: [{ x: V_.Q, y: m.H, label: 'this design: ' + m.H.toFixed(1) + ' m' }], hlines: [{ y: V_.lift, label: 'static lift' }] });
        const fm = (x, u) => kit.fmt(x, 3) + ' ' + u;
        ro.set('v', m.V.toFixed(2) + ' m/s  /  ' + fmtRe(m.Re) + (m.Re < 2300 ? ' (laminar)' : m.Re < 4000 ? ' (critical zone)' : ''));
        ro.set('f', kit.fmt(m.eps * 1000, 2) + ' mm  /  ' + m.f.toFixed(4));
        ro.set('hf', fm(m.hf, 'm'));
        ro.set('hm', m.sumK.toFixed(2) + ' → ' + fm(m.hm, 'm'));
        ro.set('le', m.f > 0 ? kit.fmt(m.sumK * m.D / m.f, 3) + ' m (L_e = ΣK·D/f)' : '—');
        ro.set('H', fm(m.H, 'm'));
        const Ph = rho * G * m.Q * m.H;
        ro.set('P', kit.fmt(Ph / 1000, 3) + ' kW  /  ' + kit.fmt(Ph / eta / 1000, 3) + ' kW');
        ro.set('share', m.H > 0 ? ((m.hf + m.hm) / m.H * 100).toFixed(0) + ' % of the pump head' : '—');
      }
      const loop = kit.loop(dt => {
        if (dirty) { update(); dirty = false; }
        const C = kit.colors(), c = st.begin();
        designFrame(st, 760, 420);
        // vertical scale: heads in metres
        const hTop = Math.max(m.H + m.hv + 3, V_.lift + 6, 12), hBot = -Math.max(6, 0.12 * hTop);
        const sc = 330 / (hTop - hBot), yOf = h => 385 - (h - hBot) * sc;
        const dT = Math.max(3, 34 / sc);                               // tank depth, m (at least 34 px)
        const zS = -0.7 * dT, zD = V_.lift - 0.7 * dT;                // pipe elevations at the two tanks
        const yS = yOf(zS), yD = yOf(zD);
        // tanks
        const water = kit.hue(205, 0.22);
        c.fillStyle = water; c.fillRect(20, yOf(0), 80, yOf(-dT) - yOf(0)); c.fillRect(660, yOf(V_.lift), 80, yOf(V_.lift - dT) - yOf(V_.lift));
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(20, yOf(0) - 14); c.lineTo(20, yOf(-dT)); c.lineTo(100, yOf(-dT)); c.lineTo(100, yOf(0) - 14); c.stroke();
        c.beginPath(); c.moveTo(660, yOf(V_.lift) - 14); c.lineTo(660, yOf(V_.lift - dT)); c.lineTo(740, yOf(V_.lift - dT)); c.lineTo(740, yOf(V_.lift) - 14); c.stroke();
        c.strokeStyle = kit.hue(205, 0.9); c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(22, yOf(0)); c.lineTo(98, yOf(0)); c.moveTo(662, yOf(V_.lift)); c.lineTo(738, yOf(V_.lift)); c.stroke();
        // datum and static lift
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
        c.beginPath(); c.moveTo(100, yOf(0)); c.lineTo(752, yOf(0)); c.stroke(); c.setLineDash([]);
        if (V_.lift > 0.5) { kit.arrow(c, 750, yOf(0), 750, yOf(V_.lift), C.muted, 1.4); kit.label(c, 'lift ' + V_.lift.toFixed(1) + ' m', 744, (yOf(0) + yOf(V_.lift)) / 2, { color: C.muted, size: 11, align: 'right', bg: C.surface }); }
        // the pipe
        const pw = clamp(1.5 + 3.5 * Math.log10(V_.D / 10), 2, 8);
        const suction = [[100, yS], [114, yS]], discharge = [[166, yS], [200, yS], [640, yD], [660, yD]];
        const yPipe = x => x <= 200 ? yS : x >= 640 ? yD : yS + (yD - yS) * (x - 200) / 440;
        S.line(c, suction, { state: 'suction', width: pw });
        S.line(c, discharge, { state: 'pressure', width: pw });
        const spd = clamp(28 * m.V, 6, 170);
        ph += dt * spd; ph2 += dt * spd;
        S.flow(c, suction, ph2, { color: C.surface, r: Math.max(1.6, pw / 3.2) });
        S.flow(c, discharge, ph, { color: C.surface, r: Math.max(1.6, pw / 3.2) });
        S.pump(c, 140, yS, { rot: 90, motor: true });
        // fittings along the route
        const events = [];
        const vt = (VALVES[V_.valve] || VALVES.gate);
        m.Kv.forEach((K, i) => events.push({ x: 180 + i * 17, K, kind: vt.tags[i] }));
        const nE = V_.elbows;
        for (let i = 0; i < nE; i++) events.push({ x: 236 + (i + 0.5) * 390 / Math.max(1, nE), K: m.Kel, kind: 'elbow' });
        events.sort((a, b) => a.x - b.x);
        for (const ev of events) {
          const y = yPipe(ev.x);
          if (ev.kind === 'elbow') kit.dot(c, ev.x, y, 3.2, C.warn, C.text);
          else if (ev.kind === 'check') S.check(c, ev.x, y, { rot: 90, open: m.Q > 0 });
          else bowtie(c, ev.x, y, 6, C.text, C.surface, ev.K > 3 ? 0.8 : ev.K > 1 ? 0.45 : 0);
        }
        vt.tags.forEach((t, i) => kit.label(c, t, 180 + i * 17, yS + 16 + i * 11, { color: C.muted, size: 9.5, align: 'center' }));
        if (nE > 0) kit.label(c, nE + ' elbow' + (nE > 1 ? 's' : ''), 430, yPipe(430) + 18, { color: C.muted, size: 10.5, align: 'center' });
        // grade lines
        const Eh = [], Hh = [];
        const push = (x, e, inPipe) => { Eh.push([x, e]); Hh.push([x, inPipe ? e - m.hv : e]); };
        push(20, 0, false); push(100, 0, false);
        const e1 = -m.Kent * m.hv, E2 = m.H - m.Kent * m.hv;
        push(100, e1, true); push(140, e1, true); push(140, E2, true); push(166, E2, true);
        let e = E2, xp = 166;
        const slope = m.hf / (660 - 166);
        for (const ev of events) { e -= slope * (ev.x - xp); push(ev.x, e, true); e -= ev.K * m.hv; push(ev.x, e, true); xp = ev.x; }
        e -= slope * (660 - xp); push(660, e, true);
        Eh.push([660, V_.lift]); Hh.push([660, V_.lift]); Eh.push([740, V_.lift]); Hh.push([740, V_.lift]);
        const line = (pts, col, w, dash) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); pts.forEach((p, i) => { const y = yOf(p[1]); if (i) c.lineTo(p[0], y); else c.moveTo(p[0], y); }); c.stroke(); c.setLineDash([]); };
        line(Hh, C.series[1], 1.6, [6, 4]);
        line(Eh, C.series[0], 2.2);
        kit.label(c, 'EGL', 172, yOf(E2) - 11, { color: C.series[0], size: 11.5, weight: 700, align: 'left' });
        kit.label(c, 'HGL', 172, yOf(E2 - m.hv) + 12, { color: C.series[1], size: 11.5, weight: 700, align: 'left' });
        // pump head arrow and gauge
        if (m.H > 0.2) { kit.arrow(c, 128, yOf(e1), 128, yOf(E2), C.accent, 1.6); kit.label(c, 'H = ' + kit.fmt(m.H, 3) + ' m', 122, yOf((e1 + E2) / 2), { color: C.accent, size: 12, weight: 700, align: 'right', bg: C.surface }); }
        const pOut = rho * G * (E2 - m.hv - zS);
        const gp = S.gauge(c, 208, yS - 44, { frac: pOut / Math.max(4e5, pOut * 1.4), value: kit.fmt(pOut / 1e5, 3) + ' bar' });
        S.line(c, [gp.P, [208, yPipe(208)]], { state: 'pressure' });
        kit.label(c, 'friction ' + kit.fmt(m.hf, 3) + ' m,  fittings ' + kit.fmt(m.hm, 3) + ' m', 420, Math.min(yOf((E2 + V_.lift) / 2) - 14, 400), { color: C.text, size: 11.5, align: 'center', bg: C.surface });
        const msg = m.V > 3 ? 'velocity above 3 m/s: noisy, erosive, violent surges' : m.V < 0.5 ? 'velocity below 0.5 m/s: sediment settles, water ages' : m.Re < 2300 ? 'laminar flow' : '';
        if (msg) kit.label(c, msg, 740, 412, { color: m.V > 3 ? C.bad : C.warn, size: 11.5, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ velocity profiles */
  Hyper.sim('pipe-profile', {
    title: 'Laminar and turbulent velocity profiles',
    blurb: `A pipe seen from the side, with dye particles carried by the flow (the animation speed is compressed, not to scale). The graph on the right is the velocity across the bore, $u(r)/V$: in **laminar** flow a parabola with the centre at twice the mean speed and the layers never mixing; in **turbulent** flow a blunt profile (a power law whose exponent grows with $Re$), steep at the wall, with eddies that stir the colours together. Between $Re \\approx 2300$ and 4000 the flow flickers between the two.

**Try this**
- Start with hydraulic oil at 40 °C in a 16 mm line at 3 m/s: laminar, $Re \\approx 1000$. Switch to water at the same speed and size: turbulent, $Re \\approx 48\\,000$, with a blunt profile and about a third of the oil's friction factor.
- Cool the oil to 0 °C: the Reynolds number drops to under 100 and the pressure drop per metre rises more than tenfold.
- With water, slow the flow until $Re$ is near 3000 and watch the puffs of turbulence come and go.
- Compare the centre velocity: 2.00 × V in laminar flow, about 1.2 × V in turbulent flow.`,
    mount(box, kit) {
      const F = kit.fluid;
      const FL = {
        w20: { nu: nuW(20), rho: rhoW(20) },
        o40: { nu: F.oilViscosity(46, 40), rho: 870 },
        o0: { nu: F.oilViscosity(46, 0), rho: 885 },
        gly: { nu: 1.41 / 1261, rho: 1261 }
      };
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'fl', type: 'select', label: 'Liquid', value: 'o40', options: [['Water, 20 °C (ν 1.0 mm²/s)', 'w20'], ['Hydraulic oil ISO VG 46, 40 °C (ν 46 mm²/s)', 'o40'], ['The same oil at 0 °C (ν ≈ 570 mm²/s)', 'o0'], ['Glycerol, 20 °C (ν ≈ 1100 mm²/s)', 'gly']] },
        { id: 'D', label: 'Bore', min: 2, max: 200, value: 16, unit: 'mm', log: true, sig: 3 },
        { id: 'V', label: 'Mean velocity', min: 0.01, max: 10, value: 3, unit: 'm/s', log: true, sig: 2 }
      ], () => {});
      const ro = kit.readout(box.side, [['re', 'Reynolds number'], ['zone', 'Regime'], ['f', 'Friction factor f'], ['dp', 'Pressure drop per metre'], ['um', 'Centre velocity'], ['tw', 'Wall shear stress'], ['le', 'Entrance length'], ['q', 'Flow']]);
      const V_ = ctl.values;
      let seed = 20260927;
      const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
      const parts = [];
      for (let i = 0; i < 90; i++) { const r0 = -0.96 + 1.92 * (i % 18) / 17; parts.push({ x: rnd(), r: r0, r0 }); }
      let turbNow = false, timer = 0;
      const nOf = Re => clamp(-1.7 + 1.8 * Math.log10(Math.max(Re, 4000)), 4.5, 11);
      const umaxT = n => (n + 1) * (2 * n + 1) / (2 * n * n);
      const loop = kit.loop(dt => {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const fl = FL[V_.fl] || FL.o40, D = V_.D / 1000, V = V_.V;
        const Re = V * D / fl.nu, n = nOf(Re);
        // regime, with intermittent puffs in the critical zone
        timer -= dt;
        if (Re < 2300) turbNow = false;
        else if (Re > 4000) turbNow = true;
        else if (timer <= 0) { turbNow = rnd() < (Re - 2300) / 1700; timer = 0.4 + 1.1 * rnd(); }
        const um = turbNow ? umaxT(n) : 2;                     // centre velocity / V
        const prof = rn => { rn = clamp(Math.abs(rn), 0, 1); return turbNow ? umaxT(n) * Math.pow(1 - rn, 1 / n) : 2 * (1 - rn * rn); };
        const f = F.friction(Re, 1.5e-6 / D), dpdx = f * fl.rho * V * V / (2 * D), tw = f * fl.rho * V * V / 8;
        // readouts
        ro.set('re', fmtRe(Re));
        ro.set('zone', Re < 2300 ? 'laminar' : Re < 4000 ? 'critical zone: puffs of turbulence' + (turbNow ? ' (turbulent now)' : ' (laminar now)') : 'turbulent (profile exponent 1/' + n.toFixed(1) + ')');
        ro.set('f', f.toFixed(4) + (Re < 2300 ? ' (64/Re)' : ''));
        ro.set('dp', dpdx >= 1e4 ? kit.fmt(dpdx / 1e5, 3) + ' bar/m' : kit.fmt(dpdx / 1000, 3) + ' kPa/m');
        ro.set('um', kit.fmt(um * V, 3) + ' m/s  (' + um.toFixed(2) + ' × V)');
        ro.set('tw', kit.fmt(tw, 3) + ' Pa');
        const Le = Re < 2300 ? 0.06 * Re * D : 4.4 * Math.pow(Math.max(Re, 1), 1 / 6) * D;
        ro.set('le', kit.fmt(Le, 3) + ' m (' + kit.fmt(Le / D, 3) + ' diameters)');
        ro.set('q', kit.fmt(V * Math.PI * D * D / 4 * 60000, 3) + ' L/min');
        // the pipe
        const x0 = 16, x1 = W * 0.62, yc = H / 2, R = Math.min(H * 0.36, 110);
        c.fillStyle = kit.hue(205, 0.08); c.fillRect(x0, yc - R, x1 - x0, 2 * R);
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x0, yc - R); c.lineTo(x1, yc - R); c.moveTo(x0, yc + R); c.lineTo(x1, yc + R); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(x0, yc); c.lineTo(x1, yc); c.stroke(); c.setLineDash([]);
        // particles: centre speed on screen compressed logarithmically
        const cpx = clamp(40 + 45 * Math.log10(Math.max(um * V, 1e-4) / 0.01), 25, 200);
        for (const p of parts) {
          if (turbNow) {
            p.r += (rnd() - 0.5) * 3.2 * dt * (1 - 0.6 * Math.abs(p.r));
            if (p.r > 0.97) p.r = 1.94 - p.r;
            if (p.r < -0.97) p.r = -1.94 - p.r;
          }
          p.x += dt * cpx * prof(p.r) / um / (x1 - x0) * (turbNow ? 1 + 0.25 * (rnd() - 0.5) : 1);
          if (p.x > 1) p.x -= 1;
          kit.dot(c, x0 + p.x * (x1 - x0), yc + p.r * R, 2.6, kit.hue(200 + 130 * p.r0));
        }
        // a velocity-profile station
        const xs = x0 + 0.1 * (x1 - x0), sL = 0.32 * (x1 - x0) / 2;
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xs, yc - R); c.lineTo(xs, yc + R); c.stroke();
        for (let i = -4; i <= 4; i++) { const rn = i / 4.6, L = sL * prof(rn); if (L > 2) kit.arrow(c, xs, yc + rn * R, xs + L, yc + rn * R, C.warn, 1.5, 6); }
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 40; i++) { const rn = -1 + i / 20, x = xs + sL * prof(rn), y = yc + rn * R; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        // the profile graph
        const gx0 = W * 0.68, gx1 = W - 16, ux = u => gx0 + u / 2.2 * (gx1 - gx0);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(gx0, yc - R); c.lineTo(gx0, yc + R); c.moveTo(gx0, yc + R); c.lineTo(gx1, yc + R); c.stroke();
        for (const u of [1, 2]) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(ux(u), yc - R); c.lineTo(ux(u), yc + R); c.stroke(); kit.label(c, String(u), ux(u), yc + R + 12, { color: C.muted, size: 10.5, align: 'center' }); }
        kit.label(c, '0', gx0, yc + R + 12, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, 'u / V', gx1, yc + R + 26, { color: C.text, size: 11, align: 'right' });
        kit.label(c, 'wall', gx0 - 4, yc - R, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'axis', gx0 - 4, yc, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, 'wall', gx0 - 4, yc + R, { color: C.muted, size: 10, align: 'right' });
        const curve = (fn, col, w, dash) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); for (let i = 0; i <= 60; i++) { const rn = -1 + i / 30, x = ux(fn(rn)), y = yc + rn * R; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke(); c.setLineDash([]); };
        curve(rn => 2 * (1 - rn * rn), C.muted, 1.4, [5, 4]);
        curve(rn => umaxT(n) * Math.pow(1 - clamp(Math.abs(rn), 0, 1), 1 / n), C.faint, 1.2, [2, 4]);
        curve(prof, C.accent, 2.6);
        kit.label(c, turbNow ? 'turbulent: u_max = ' + um.toFixed(2) + ' V' : 'laminar: u_max = 2 V', (gx0 + gx1) / 2, yc - R - 12, { color: C.accent, size: 11.5, weight: 700, align: 'center' });
        kit.label(c, 'Re = ' + fmtRe(Re), x0 + 6, yc - R - 12, { color: C.text, size: 12, weight: 700, align: 'left' });
        kit.label(c, Re < 2300 ? 'laminar: the layers slide, the colours stay apart' : Re < 4000 ? 'critical zone: turbulence comes and goes' : 'turbulent: eddies mix the colours across the bore', x1, yc + R + 14, { color: C.muted, size: 11, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ two pipes, parallel or series */
  Hyper.sim('pipe-parallel', {
    title: 'Two pipes: in parallel or in series',
    blurb: `Two water pipes (20 °C) between junctions A and B. **In parallel** the flow divides until both branches lose the same head; **in series** the same flow passes both and the losses add. Friction factors come from the Moody chart for each pipe's own Reynolds number; a valve on pipe 2 can be closed. The graph shows each pipe's head-loss curve and the combined curve — added sideways (flows) in parallel, upwards (heads) in series — with the operating points marked.

**Try this**
- Make both pipes identical: each takes half the flow, and the head loss is a quarter of what one pipe alone would lose.
- Give pipe 2 twice the bore of pipe 1 at the same length: it takes about 85 % of the flow (Q ∝ D^2.5).
- Close the valve on pipe 2 gradually: its flow moves to pipe 1 and the head loss rises towards the "pipe 1 alone" value.
- Switch to series: now the narrow pipe dominates the head loss, and the combined curve is the vertical sum.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const gdiv = document.createElement('div');
      gdiv.style.padding = '4px 10px 10px';
      box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'flow (L/s)', min: 0 }, y: { label: 'head loss (m)', min: 0 }, legend: true }, 190);
      let dirty = true, s = null;
      const ph = [0, 0, 0, 0];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Arrangement', value: 'par', options: [['Parallel: both pipes from A to B', 'par'], ['Series: pipe 1, then pipe 2', 'ser']] },
        { id: 'Q', label: 'Total flow', min: 1, max: 300, value: 80, unit: 'L/s', log: true, sig: 3 },
        { id: 'D1', label: 'Pipe 1 bore', min: 50, max: 500, value: 200, unit: 'mm', log: true, sig: 3 },
        { id: 'L1', label: 'Pipe 1 length', min: 50, max: 3000, value: 500, unit: 'm', log: true, sig: 3 },
        { id: 'D2', label: 'Pipe 2 bore', min: 50, max: 500, value: 150, unit: 'mm', log: true, sig: 3 },
        { id: 'L2', label: 'Pipe 2 length', min: 50, max: 3000, value: 400, unit: 'm', log: true, sig: 3 },
        { id: 'valve', label: 'Valve on pipe 2, closed by', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'mat', type: 'select', label: 'Material (both pipes)', options: matOptions, value: 'steel' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['q1', 'Pipe 1: flow (share)'], ['q2', 'Pipe 2: flow (share)'], ['v', 'Velocities V₁ / V₂'], ['f', 'Friction factors f₁ / f₂'], ['h', 'Head loss A → B'], ['cmp', 'For comparison']]);
      const V_ = ctl.values, nu = nuW(20);
      const pipe = i => {
        const D = (i === 1 ? V_.D1 : V_.D2) / 1000, L = i === 1 ? V_.L1 : V_.L2, eps = (MATS[V_.mat] || MATS.steel).eps / 1000;
        const closed = i === 2 && V_.valve >= 100;
        const K = i === 2 ? 0.2 * Math.pow(1e4, V_.valve / 100) : 0;
        return { D, L, eps, K, closed, A: Math.PI * D * D / 4 };
      };
      const hOf = (p, q) => {
        if (q <= 0) return 0;
        if (p.closed) return 1e9;
        const V = q / p.A, Re = V * p.D / nu, f = F.friction(Re, p.eps / p.D);
        return (f * p.L / p.D + p.K) * V * V / (2 * G);
      };
      const fOf = (p, q) => q > 0 ? F.friction(q / p.A * p.D / nu, p.eps / p.D) : 0;
      const qOf = (p, h) => {                              // the flow a pipe passes with head loss h
        if (h <= 0 || p.closed) return 0;
        let hi = 1e-3; while (hOf(p, hi) < h && hi < 50) hi *= 2;
        return bisect(q => hOf(p, q) - h, 0, hi, 50);
      };
      const split = (p1, p2, Q) => {
        if (p2.closed) return { q1: Q, q2: 0, h: hOf(p1, Q) };
        const q1 = bisect(q => hOf(p1, q) - hOf(p2, Q - q), 0, Q, 60);
        return { q1, q2: Q - q1, h: hOf(p1, q1) };
      };
      function update() {
        const p1 = pipe(1), p2 = pipe(2), Q = V_.Q / 1000, par = V_.mode === 'par';
        let q1, q2, h, h1, h2;
        if (par) { const r = split(p1, p2, Q); q1 = r.q1; q2 = r.q2; h = r.h; h1 = h; h2 = h; }
        else { q1 = Q; q2 = p2.closed ? 0 : Q; h1 = hOf(p1, Q); h2 = p2.closed ? Infinity : hOf(p2, Q); h = h1 + h2; }
        s = { p1, p2, Q, q1, q2, h, h1, h2, par, V1: q1 / p1.A, V2: q2 / p2.A };
        const pct = q => (q / Q * 100).toFixed(0) + ' %';
        ro.set('q1', kit.fmt(q1 * 1000, 3) + ' L/s' + (par ? ' (' + pct(q1) + ')' : ''));
        ro.set('q2', p2.closed ? '0 (valve shut)' : kit.fmt(q2 * 1000, 3) + ' L/s' + (par ? ' (' + pct(q2) + ')' : ''));
        ro.set('v', s.V1.toFixed(2) + ' / ' + s.V2.toFixed(2) + ' m/s');
        ro.set('f', fOf(p1, q1).toFixed(4) + ' / ' + (q2 > 0 ? fOf(p2, q2).toFixed(4) : '—'));
        if (par) ro.set('h', kit.fmt(h, 3) + ' m, the same in both');
        else ro.set('h', p2.closed ? 'no flow: pipe 2 is shut' : kit.fmt(h1, 3) + ' + ' + kit.fmt(h2, 3) + ' = ' + kit.fmt(h, 3) + ' m');
        ro.set('cmp', par ? 'pipe 1 alone would lose ' + kit.fmt(hOf(p1, Q), 3) + ' m' : 'pipe 2 = ' + kit.fmt(p2.L * Math.pow(p1.D / p2.D, 5), 3) + ' m of pipe 1 (equal f)');
        // curves
        const qmax = 1.3 * Q, series = [], marks = [];
        const c1 = [], c2 = [], cc = [];
        for (let i = 0; i <= 40; i++) { const q = qmax * i / 40; c1.push([q * 1000, hOf(p1, q)]); if (!p2.closed) c2.push([q * 1000, hOf(p2, q)]); }
        if (par) {
          const hm = split(p1, p2, qmax).h;
          for (let i = 0; i <= 40; i++) { const hh = hm * i / 40; cc.push([(qOf(p1, hh) + qOf(p2, hh)) * 1000, hh]); }
          marks.push({ x: q1 * 1000, y: h, label: 'pipe 1' }, { x: Q * 1000, y: h, label: 'both' });
          if (q2 > 0) marks.push({ x: q2 * 1000, y: h, label: 'pipe 2' });
        } else if (!p2.closed) {
          for (let i = 0; i <= 40; i++) { const q = qmax * i / 40; cc.push([q * 1000, hOf(p1, q) + hOf(p2, q)]); }
          marks.push({ x: Q * 1000, y: h1, label: 'pipe 1' }, { x: Q * 1000, y: h2, label: 'pipe 2' }, { x: Q * 1000, y: h, label: 'total' });
        }
        series.push({ pts: c1, label: 'pipe 1' });
        if (c2.length) series.push({ pts: c2, label: 'pipe 2' });
        if (cc.length) series.push({ pts: cc, label: par ? 'together (flows add)' : 'together (heads add)', width: 3 });
        // scale to pipe 1 and the combined curve; a nearly shut pipe 2 may run off the top
        const ys = c1.concat(cc).map(p => p[1]).filter(Number.isFinite);
        plot.set({ series, marks, y: { label: 'head loss (m)', min: 0, max: Math.max(1e-3, ys.length ? 1.05 * Math.max(...ys) : 1) } });
      }
      const loop = kit.loop(dt => {
        if (dirty) { update(); dirty = false; }
        const C = kit.colors(), c = st.begin();
        designFrame(st, 760, 350);
        const w1 = clamp(2 + 12 * Math.pow(s.p1.D / 0.5, 0.8), 2.5, 14), w2 = clamp(2 + 12 * Math.pow(s.p2.D / 0.5, 0.8), 2.5, 14);
        const sp = v => clamp(30 * v, 4, 200);
        const lab = (t, x, y, col, bold) => kit.label(c, t, x, y, { color: col || C.text, size: 11.5, weight: bold ? 700 : 500, align: 'center' });
        const node = (x, y, t) => { kit.dot(c, x, y, 6, C.text); lab(t, x, y - 16, C.text, true); };
        if (s.par) {
          const A = [100, 175], B = [660, 175];
          const b1 = [A, [160, 70], [600, 70], B], b2 = [A, [160, 280], [600, 280], B];
          S.line(c, [[20, 175], A], { state: 'pressure', width: 6 }); S.line(c, [B, [740, 175]], { state: 'pressure', width: 6 });
          S.line(c, b1, { state: 'pressure', width: w1 });
          S.line(c, b2, { state: s.q2 > 0 ? 'pressure' : 'idle', width: w2 });
          ph[0] += dt * sp(1.2); ph[1] += dt * sp(s.V1); ph[2] += dt * sp(s.V2);
          S.flow(c, [[20, 175], A], ph[0], { color: C.surface }); S.flow(c, [B, [740, 175]], ph[0], { color: C.surface });
          if (s.q1 > 0) S.flow(c, b1, ph[1], { color: C.surface });
          if (s.q2 > 0) S.flow(c, b2, ph[2], { color: C.surface });
          bowtie(c, 380, 280, 9, C.text, C.surface, V_.valve / 100);
          node(A[0], A[1], 'A'); node(B[0], B[1], 'B');
          lab('pipe 1: ' + V_.L1.toFixed(0) + ' m × ' + V_.D1.toFixed(0) + ' mm', 380, 70 - 20, C.muted);
          lab('Q₁ = ' + kit.fmt(s.q1 * 1000, 3) + ' L/s (' + (s.q1 / s.Q * 100).toFixed(0) + ' %),  V₁ = ' + s.V1.toFixed(2) + ' m/s', 380, 70 + 22, C.text, true);
          lab('pipe 2: ' + V_.L2.toFixed(0) + ' m × ' + V_.D2.toFixed(0) + ' mm', 380, 280 + 26, C.muted);
          lab(s.p2.closed ? 'valve shut: no flow' : 'Q₂ = ' + kit.fmt(s.q2 * 1000, 3) + ' L/s (' + (s.q2 / s.Q * 100).toFixed(0) + ' %),  V₂ = ' + s.V2.toFixed(2) + ' m/s', 380, 280 - 24, C.text, true);
          if (V_.valve > 0) lab('valve ' + (s.p2.closed ? 'shut' : 'K = ' + kit.fmt(s.p2.K, 2)), 470, 280 + 12, C.warn);
          lab(kit.fmt(s.Q * 1000, 3) + ' L/s', 50, 160, C.text, true);
          kit.label(c, 'the same head loss on both routes: h = ' + kit.fmt(s.h, 3) + ' m', 380, 175, { color: C.accent, size: 12.5, weight: 700, align: 'center', bg: C.surface });
        } else {
          const A = [60, 175], M = [380, 175], B = [700, 175];
          S.line(c, [[10, 175], A], { state: 'pressure', width: 6 });
          S.line(c, [A, M], { state: 'pressure', width: w1 });
          S.line(c, [M, B], { state: s.q2 > 0 ? 'pressure' : 'idle', width: w2 });
          S.line(c, [B, [750, 175]], { state: s.q2 > 0 ? 'pressure' : 'idle', width: 6 });
          ph[1] += dt * sp(s.q2 > 0 ? s.V1 : 0); ph[2] += dt * sp(s.q2 > 0 ? s.V2 : 0);
          if (s.q2 > 0) { S.flow(c, [A, M], ph[1], { color: C.surface }); S.flow(c, [M, B], ph[2], { color: C.surface }); }
          bowtie(c, 560, 175, 9, C.text, C.surface, V_.valve / 100);
          node(A[0], A[1], 'A'); node(M[0], M[1], ''); node(B[0], B[1], 'B');
          lab('pipe 1: ' + V_.L1.toFixed(0) + ' m × ' + V_.D1.toFixed(0) + ' mm', 220, 135, C.muted);
          lab('pipe 2: ' + V_.L2.toFixed(0) + ' m × ' + V_.D2.toFixed(0) + ' mm', 540, 135, C.muted);
          if (s.q2 > 0) {
            lab('h₁ = ' + kit.fmt(s.h1, 3) + ' m,  V₁ = ' + s.V1.toFixed(2) + ' m/s', 220, 215, C.text, true);
            lab('h₂ = ' + kit.fmt(s.h2, 3) + ' m,  V₂ = ' + s.V2.toFixed(2) + ' m/s', 540, 215, C.text, true);
            kit.label(c, 'the same ' + kit.fmt(s.Q * 1000, 3) + ' L/s in both: total h = ' + kit.fmt(s.h, 3) + ' m', 380, 290, { color: C.accent, size: 12.5, weight: 700, align: 'center', bg: C.surface });
          } else kit.label(c, 'the valve on pipe 2 is shut: nothing flows', 380, 290, { color: C.bad, size: 12.5, weight: 700, align: 'center' });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Hardy Cross */
  Hyper.sim('pipe-hardy-cross', {
    title: 'Hardy Cross, step by step',
    blurb: `The two-loop network of the worked example: water enters at A and is drawn off at B, C, D and F. The first guess of flows satisfies continuity at every junction but not the energy balance round the loops. Each **Step** computes, for each loop, the sum of head losses (clockwise positive) and the correction $\\Delta Q = -\\Sigma h/(2\\Sigma|h/Q|)$, and adds it round the loop — pipe 4, shared by both loops, gets both corrections. With the constant $f = 0.02$ and the rounded resistances the numbers match the worked example exactly. The graph shows how quickly the corrections shrink.

**Try this**
- Step once and check the first corrections against the example: +6.27 L/s for loop I and −4.31 L/s for loop II.
- Run to convergence: the corrections fall roughly tenfold per iteration, and the head drop from A to D becomes the same along every route.
- Raise the demand at D: more water swings through the right-hand loop. Widen pipe 5 and watch it take flow from pipe 7.
- Switch to Colebrook friction factors: each pipe's f now depends on its own flow, and the result shifts by a few per cent.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const gdiv = document.createElement('div');
      gdiv.style.padding = '4px 10px 6px';
      box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'iteration', min: 0 }, y: { label: '|ΔQ| (L/s)', log: true }, legend: true }, 150);
      const tdiv = document.createElement('div');
      tdiv.style.padding = '0 10px 10px';
      box.stage.appendChild(tdiv);
      const table = kit.table(tdiv, [
        { label: 'Pipe', key: 'n', align: 'left' }, { label: 'From → to', key: 'ft', align: 'left' }, { label: 'L (m)', key: 'L' }, { label: 'D (mm)', key: 'D' },
        { label: 'r (s²/m⁵)', key: 'r', fmt: v => kit.fmt(v, 4) }, { label: 'Q (L/s)', key: 'q', fmt: v => v.toFixed(2) }, { label: 'h (m)', key: 'h', fmt: v => v.toFixed(3) }
      ]);
      const NODES = { A: [150, 90], B: [390, 90], C: [630, 90], F: [150, 270], E: [390, 270], D: [630, 270] };
      const PIPES = [
        { n: 1, a: 'A', b: 'B', L: 300, D: 300 }, { n: 2, a: 'B', b: 'C', L: 400, D: 200 }, { n: 3, a: 'A', b: 'F', L: 400, D: 250 },
        { n: 4, a: 'B', b: 'E', L: 300, D: 200 }, { n: 5, a: 'C', b: 'D', L: 300, D: 150 }, { n: 6, a: 'F', b: 'E', L: 300, D: 200 },
        { n: 7, a: 'E', b: 'D', L: 400, D: 200 }
      ];
      const LOOPS = [[[0, 1], [3, 1], [5, -1], [2, -1]], [[1, 1], [4, 1], [6, -1], [3, -1]]];   // [pipe index, +1 if the pipe runs clockwise]
      const CIRC = '①②③④⑤⑥⑦';
      const nu = nuW(20);
      let Q = [], k = 0, hist = [], auto = false, timer = 0, last = null, phase = PIPES.map(() => 0);
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'step', label: 'Step', primary: true }, { id: 'run', label: 'Run / pause' }, { id: 'reset', label: 'Back to the guess' }] },
        { id: 'fr', type: 'select', label: 'Friction factors', value: 'const', options: [['Constant f = 0.02, rounded r (as in the example)', 'const'], ['Colebrook, ε = 0.1 mm, water 20 °C', 'cole']] },
        { id: 'dD', label: 'Demand at D', min: 10, max: 80, step: 1, value: 40, unit: 'L/s' },
        { id: 'D5', label: 'Bore of pipe 5 (C–D)', min: 100, max: 300, step: 10, value: 150, unit: 'mm' }
      ], (id) => {
        if (id === 'step') { auto = false; step(); }
        else if (id === 'run') { auto = !auto; timer = 0; }
        else { auto = false; restart(); }
      });
      const ro = kit.readout(box.side, [['k', 'Iteration'], ['c1', 'Loop I: Σh / ΔQ'], ['c2', 'Loop II: Σh / ΔQ'], ['in', 'Inflow at A'], ['st', 'Status']]);
      const V_ = ctl.values;
      const dem = () => ({ B: 0.020, C: 0.030, D: V_.dD / 1000, F: 0.030 });
      const bore = i => (i === 4 ? V_.D5 : PIPES[i].D) / 1000;
      function rOf(i, q) {
        const D = bore(i), L = PIPES[i].L;
        if (V_.fr === 'const') return Math.round(8 * 0.02 * L / (Math.PI * Math.PI * G * Math.pow(D, 5)) / 10) * 10;
        const A = Math.PI * D * D / 4, Re = Math.max(1, Math.abs(q) / A * D / nu);
        return 8 * F.friction(Re, 1e-4 / D) * L / (Math.PI * Math.PI * G * Math.pow(D, 5));
      }
      const hOf = i => rOf(i, Q[i]) * Q[i] * Math.abs(Q[i]);
      function corrections() {
        return LOOPS.map(loop => {
          let s1 = 0, s2 = 0;
          for (const [i, sg] of loop) { const q = sg * Q[i], r = rOf(i, Q[i]); s1 += r * q * Math.abs(q); s2 += 2 * r * Math.abs(q); }
          return { sum: s1, dq: s2 > 0 ? -s1 / s2 : 0 };
        });
      }
      function restart() {
        const d = dem(), q4 = 0.010, q5 = 0.010;            // chords guessed; the tree follows from continuity
        const q2 = d.C + q5, q1 = d.B + q2 + q4, q7 = d.D - q5, q6 = q7 - q4, q3 = d.F + q6;
        Q = [q1, q2, q3, q4, q5, q6, q7];
        k = 0; last = corrections(); hist = [[0, Math.abs(last[0].dq) * 1000, Math.abs(last[1].dq) * 1000]];
        refresh();
      }
      function step() {
        const cs = corrections();
        LOOPS.forEach((loop, li) => loop.forEach(([i, sg]) => { Q[i] += sg * cs[li].dq; }));
        k++; last = corrections();
        hist.push([k, Math.abs(last[0].dq) * 1000, Math.abs(last[1].dq) * 1000]);
        if (hist.length > 60) hist.shift();
        refresh();
      }
      const balanced = () => last && Math.abs(last[0].dq) < 5e-5 && Math.abs(last[1].dq) < 5e-5;
      function refresh() {
        const lg = v => Math.max(v, 1e-4);
        plot.set({ series: [{ pts: hist.map(h => [h[0], lg(h[1])]), label: 'loop I', dots: 3.5 }, { pts: hist.map(h => [h[0], lg(h[2])]), label: 'loop II', dots: 3.5, dash: [5, 4] }],
          hlines: [{ y: 0.05, label: 'balanced (< 0.05 L/s)' }], x: { label: 'iteration', min: 0, max: Math.max(4, k) } });
        table.set(PIPES.map((p, i) => ({ n: p.n, ft: p.a + ' → ' + p.b, L: p.L, D: Math.round(bore(i) * 1000), r: rOf(i, Q[i]), q: Q[i] * 1000, h: hOf(i) })));
        const sgn = (v, d) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(d);
        ro.set('k', String(k));
        ro.set('c1', sgn(last[0].sum, 3) + ' m / ' + sgn(last[0].dq * 1000, 2) + ' L/s');
        ro.set('c2', sgn(last[1].sum, 3) + ' m / ' + sgn(last[1].dq * 1000, 2) + ' L/s');
        const d = dem();
        ro.set('in', ((d.B + d.C + d.D + d.F) * 1000).toFixed(0) + ' L/s');
        ro.set('st', balanced() ? 'balanced: the head drop A → D is ' + headAt('D').toFixed(2) + ' m on every route' : k === 0 ? 'first guess: continuity only' : 'still correcting');
      }
      // head below A at a node, walking along pipes 1, 2, 5 (A-B-C-D) and 3, 6 (A-F-E)
      function headAt(n) {
        const h = i => hOf(i);
        return { A: 0, B: h(0), C: h(0) + h(1), D: h(0) + h(1) + h(4), F: h(2), E: h(2) + h(5) }[n];
      }
      restart();
      const loop = kit.loop(dt => {
        if (auto) { timer += dt; if (timer > 0.7) { timer = 0; step(); if (balanced() || k > 40) auto = false; } }
        const C = kit.colors(), c = st.begin();
        designFrame(st, 780, 360);
        // pipes
        PIPES.forEach((p, i) => {
          const a = NODES[p.a], b = NODES[p.b], q = Q[i], D = bore(i);
          const w = clamp(1.5 + D * 1000 / 45, 3, 9);
          c.strokeStyle = C.accent; c.globalAlpha = 0.85; c.lineWidth = w; c.lineCap = 'round';
          c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.globalAlpha = 1;
          const pts = q >= 0 ? [a, b] : [b, a], V = Math.abs(q) / (Math.PI * D * D / 4);
          phase[i] += dt * clamp(40 * V, 5, 120);
          kit.fsym.flow(c, pts, phase[i], { color: C.surface, r: 2 });
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ux = (pts[1][0] - pts[0][0]), uy = (pts[1][1] - pts[0][1]), L = Math.hypot(ux, uy) || 1;
          const horiz = Math.abs(a[1] - b[1]) < 1;
          kit.arrow(c, mx - 14 * ux / L, my - 14 * uy / L + (horiz ? -16 : 0), mx + 14 * ux / L, my + 14 * uy / L + (horiz ? -16 : 0), C.warn, 2.2, 8);
          const t = CIRC[i] + ' ' + (Math.abs(q) * 1000).toFixed(1) + ' L/s';
          if (horiz) kit.label(c, t, mx, my + 18, { color: C.text, size: 12, weight: 700, align: 'center' });
          else kit.label(c, t, mx + 12, my - 30, { color: C.text, size: 12, weight: 700, align: 'left' });
        });
        // nodes and demands
        const d = dem();
        const out = { B: [[390, 77], [390, 38]], C: [[643, 90], [700, 90]], D: [[643, 270], [700, 270]], F: [[137, 270], [80, 270]] };
        for (const n of ['B', 'C', 'D', 'F']) { const o = out[n]; kit.arrow(c, o[0][0], o[0][1], o[1][0], o[1][1], C.bad, 2.4); kit.label(c, (d[n] * 1000).toFixed(0), o[1][0] + (o[1][0] > o[0][0] ? 6 : o[1][0] < o[0][0] ? -6 : 0), o[1][1] + (o[1][1] < o[0][1] ? -9 : 0), { color: C.bad, size: 11.5, weight: 700, align: o[1][0] > o[0][0] ? 'left' : o[1][0] < o[0][0] ? 'right' : 'center' }); }
        kit.arrow(c, 70, 90, 136, 90, C.ok, 2.8);
        kit.label(c, ((d.B + d.C + d.D + d.F) * 1000).toFixed(0) + ' L/s', 66, 76, { color: C.ok, size: 11.5, weight: 700, align: 'left' });
        const bal = balanced();
        for (const n of Object.keys(NODES)) {
          const [x, y] = NODES[n];
          kit.dot(c, x, y, 13, C.surface, C.text);
          kit.label(c, n, x, y + 0.5, { color: C.text, size: 13, weight: 700, align: 'center' });
          if (bal && n !== 'A') kit.label(c, '−' + headAt(n).toFixed(2) + ' m', x + (n === 'F' || n === 'E' ? -8 : 8), y + (y > 180 ? 26 : -24), { color: C.muted, size: 10.5, align: n === 'F' || n === 'E' ? 'right' : 'left' });
        }
        // loops: clockwise arrows and their corrections
        [[270, 180, 'I'], [510, 180, 'II']].forEach(([x, y, name], li) => {
          const col = li ? C.series[2] : C.series[1];
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.arc(x, y - 6, 20, -Math.PI * 0.9, Math.PI * 0.55); c.stroke();
          const ea = Math.PI * 0.55, ex = x + 20 * Math.cos(ea), ey = y - 6 + 20 * Math.sin(ea);
          kit.arrow(c, ex + 6, ey - 5, ex - 1, ey + 1, col, 2, 7);
          kit.label(c, name, x, y - 6, { color: col, size: 13, weight: 700, align: 'center' });
          const L = last[li];
          kit.label(c, 'Σh = ' + (L.sum >= 0 ? '+' : '−') + Math.abs(L.sum).toFixed(3) + ' m', x, y + 28, { color: C.text, size: 11, align: 'center' });
          kit.label(c, 'ΔQ = ' + (L.dq >= 0 ? '+' : '−') + Math.abs(L.dq * 1000).toFixed(2) + ' L/s', x, y + 43, { color: col, size: 11.5, weight: 700, align: 'center' });
        });
        kit.label(c, 'iteration ' + k + (bal ? ' — balanced' : ''), 10, 16, { color: bal ? C.ok : C.text, size: 12.5, weight: 700, align: 'left' });
        if (bal) kit.label(c, 'head below A at each node', 770, 350, { color: C.muted, size: 10.5, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the economic diameter */
  const BORES = [25, 32, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600, 700, 800, 900, 1000, 1200];
  Hyper.sim('pipe-economic', {
    title: 'The economic diameter',
    blurb: `The yearly cost of one kilometre of pumped water main (20 °C, commercial steel), against its bore. The **capital charge** — the installed cost of the pipe, spread over its life at an interest rate — grows as the bore to the power 1.3; the **energy** to push the water through it falls roughly as $D^{-5}$ (pump and motor 70 % efficient). Their sum has a flat minimum: the economic diameter. The dashed verticals show where the velocity is 1 and 2 m/s. Prices are illustrative, in your currency.

**Try this**
- Double the price of energy: the optimum moves to a bigger pipe and a lower velocity.
- Run the pump only 1000 h a year instead of 4000: a smaller pipe is now cheaper overall.
- Raise the interest rate: capital becomes dearer, and the optimum shrinks.
- Check Bresse's rule $D = k\\sqrt{Q}$: the read-out gives the $k$ that the optimum implies — usually near 1.`,
    mount(box, kit) {
      const F = kit.fluid;
      const gdiv = document.createElement('div');
      gdiv.style.padding = '6px 10px 10px';
      box.stage.appendChild(gdiv);
      const plot = kit.plot(gdiv, { x: { label: 'inside diameter (mm)', log: true, min: 25, max: 1200 }, y: { label: 'cost per km per year', min: 0, fmt: v => kit.money(v, 0, true) }, fmtX: v => v.toFixed(0) + ' mm', fmtY: v => kit.money(v, 0), legend: true }, 320);
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Flow', min: 1, max: 1000, value: 20, unit: 'L/s', log: true, sig: 3 },
        { id: 'hours', label: 'Pumping hours per year', min: 500, max: 8760, step: 100, value: 6000, unit: 'h' },
        { id: 'price', label: 'Price of electricity (per kWh)', min: 0.02, max: 0.5, step: 0.01, value: 0.2, fmt: v => kit.money(v, 2) },
        { id: 'c100', label: 'Installed pipe cost, 100 mm bore (per m)', min: 30, max: 600, step: 5, value: 150, fmt: v => kit.money(v, 0) },
        { id: 'rate', label: 'Interest rate', min: 0, max: 12, step: 0.5, value: 5, unit: '%' },
        { id: 'life', label: 'Life of the pipe', min: 10, max: 80, step: 5, value: 40, unit: 'yr' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['opt', 'Economic bore'], ['v', 'Velocity there'], ['hf', 'Friction loss there, per km'], ['cost', 'Capital + energy, per km per year'], ['std', 'Nearest standard bores'], ['k', 'Bresse k = D/√Q (SI)']]);
      const V_ = ctl.values, nu = nuW(20), rho = rhoW(20), eta = 0.7;
      let dirty = true;
      function cost(D, crf) {
        const Q = V_.Q / 1000, A = Math.PI * D * D / 4, V = Q / A, Re = V * D / nu;
        const f = F.friction(Re, 0.045e-3 / D), hf = f * 1000 / D * V * V / (2 * G);
        const kWh = rho * G * Q * hf / eta * V_.hours / 1000;
        const en = kWh * V_.price, cap = 1000 * V_.c100 * Math.pow(D / 0.1, 1.3) * crf;
        return { cap, en, tot: cap + en, V, hf, kWh };
      }
      function update() {
        const i = V_.rate / 100, n = V_.life;
        const crf = i > 0 ? i / (1 - Math.pow(1 + i, -n)) : 1 / n;
        const cap = [], en = [], tot = [];
        for (let j = 0; j <= 120; j++) {
          const D = 0.025 * Math.pow(1200 / 25, j / 120), r = cost(D, crf);
          cap.push([D * 1000, r.cap]); en.push([D * 1000, r.en]); tot.push([D * 1000, r.tot]);
        }
        // golden-section search on log D
        let a = Math.log(0.02), b = Math.log(2.0);
        const gr = (Math.sqrt(5) - 1) / 2, tf = x => cost(Math.exp(x), crf).tot;
        let x1 = b - gr * (b - a), x2 = a + gr * (b - a), f1 = tf(x1), f2 = tf(x2);
        for (let it = 0; it < 80; it++) {
          if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = b - gr * (b - a); f1 = tf(x1); }
          else { a = x1; x1 = x2; f1 = f2; x2 = a + gr * (b - a); f2 = tf(x2); }
        }
        const Dopt = Math.exp((a + b) / 2), o = cost(Dopt, crf);
        const below = BORES.filter(d => d <= Dopt * 1000).pop(), above = BORES.find(d => d > Dopt * 1000);
        const marks = [{ x: Dopt * 1000, y: o.tot, label: 'optimum ' + Math.round(Dopt * 1000) + ' mm' }];
        const stdTxt = [];
        for (const d of [below, above]) if (d) { const r = cost(d / 1000, crf); marks.push({ x: d, y: r.tot, color: kit.colors().muted }); stdTxt.push(d + ' mm: ' + kit.money(r.tot, 0)); }
        const Dv = v => Math.sqrt(4 * V_.Q / 1000 / (Math.PI * v)) * 1000;
        plot.set({
          series: [{ pts: tot, label: 'total', width: 3 }, { pts: cap, label: 'capital charge', dash: [6, 4] }, { pts: en, label: 'pumping energy', dash: [2, 4] }],
          marks, vlines: [{ x: Dv(2), label: '2 m/s' }, { x: Dv(1), label: '1 m/s' }],
          y: { label: 'cost per km per year', min: 0, max: 3.5 * o.tot, fmt: v => kit.money(v, 0, true) }
        });
        ro.set('opt', Math.round(Dopt * 1000) + ' mm');
        ro.set('v', o.V.toFixed(2) + ' m/s');
        ro.set('hf', kit.fmt(o.hf, 3) + ' m (' + kit.fmt(o.kWh, 3) + ' kWh a year)');
        ro.set('cost', kit.money(o.cap, 0) + ' + ' + kit.money(o.en, 0) + ' = ' + kit.money(o.tot, 0));
        ro.set('std', stdTxt.join(';  ') || '—');
        ro.set('k', (Dopt / Math.sqrt(V_.Q / 1000)).toFixed(2));
      }
      const loop = kit.loop(() => { if (dirty) { update(); dirty = false; } }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the siphon */
  const RUN = 3, P_AIR = 25e3;                              // crest run (m); pressure where dissolved air comes out (typical, Pa)
  Hyper.sim('pipe-siphon', {
    title: 'A siphon and its crest limit',
    blurb: `A hose siphons water out of a tank over a crest and down to an outlet below the water surface. The tube is coloured by its **absolute pressure**: red above atmospheric, blue near atmospheric, through yellow to red again as it approaches the vapour pressure. The bar on the right is the pressure at the crest, where it is lowest. If the crest pressure would fall below the vapour pressure, the water boils there and the column separates: the flow is then limited by the crest. Above the barometric limit the atmosphere cannot hold the water up at all. (Entrance K = 0.5, two bends K = 0.4, a 3 m crest run, smooth hose.)

**Try this**
- Raise the crest step by step: the flow hardly changes — until the crest pressure nears the vapour pressure and the siphon starts to choke.
- Lower the outlet: more flow, and a lower crest pressure, because the faster water carries more velocity head and loss past the crest.
- Heat the water to 70–80 °C: the vapour pressure climbs to 30–50 kPa and a crest that worked with cold water now boils.
- Go up to 2000 m: the thinner atmosphere lowers every limit by about 2 m.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'zc', label: 'Crest height above the water surface', min: 0.5, max: 12, step: 0.1, value: 2, unit: 'm' },
        { id: 'H', label: 'Outlet below the water surface', min: 0.5, max: 10, step: 0.1, value: 3, unit: 'm' },
        { id: 'D', label: 'Hose bore', min: 10, max: 100, value: 40, unit: 'mm', log: true, sig: 2 },
        { id: 'T', label: 'Water temperature', min: 5, max: 95, step: 1, value: 20, unit: '°C' },
        { id: 'alt', label: 'Altitude', min: 0, max: 3000, step: 50, value: 0, unit: 'm' }
      ], () => {});
      const ro = kit.readout(box.side, [['q', 'Flow'], ['v', 'Velocity in the hose'], ['pc', 'Crest pressure: absolute / gauge'], ['pv', 'Vapour pressure / atmosphere'], ['zmax', 'Highest crest at this flow'], ['st', 'State']]);
      const V_ = ctl.values, Kent = 0.5, Kb = 0.4;
      let ph = 0;
      function solve() {
        const T = V_.T, rho = rhoW(T), nu = nuW(T), pv = F.magnus(T), pa = F.isa(V_.alt).p;
        const D = V_.D / 1000, zc = V_.zc, H = V_.H, rr = 0.0015e-3 / D;
        const L1 = 1.5 + zc + RUN, L = L1 + zc + H;
        const zs = (pa - pv) / (rho * G);
        const fr = V => F.friction(Math.max(1, V * D / nu), rr);
        let V = 0, f = 0.02, state = 'run', pc = pa - rho * G * zc, K1 = Kent + Kb;
        if (zc >= zs) { state = 'nohold'; pc = pv; }
        else {
          for (let k = 0; k < 40; k++) { V = Math.sqrt(2 * G * H / (1 + Kent + 2 * Kb + f * L / D)); f = fr(V); }
          K1 = Kent + Kb + f * L1 / D;
          pc = pa - rho * G * (zc + (1 + K1) * V * V / (2 * G));
          if (pc < pv) {                                     // the crest boils: the flow is limited there
            state = 'limited';
            for (let k = 0; k < 40; k++) { K1 = Kent + Kb + f * L1 / D; V = Math.sqrt(2 * G * Math.max(0, zs - zc) / (1 + K1)); f = fr(V); }
            pc = pv;
          } else if (pc < P_AIR) state = 'air';
        }
        return { T, rho, nu, pv, pa, D, zc, H, L1, L, zs, V, f, K1, pc, state, Q: V * Math.PI * D * D / 4, hv: V * V / (2 * G) };
      }
      const loop = kit.loop(dt => {
        const s = solve(), C = kit.colors(), c = st.begin();
        // readouts
        ro.set('q', s.state === 'nohold' ? '0' : kit.fmt(s.Q * 1000, 3) + ' L/s');
        ro.set('v', s.V.toFixed(2) + ' m/s');
        ro.set('pc', (s.pc / 1000).toFixed(1) + ' kPa / ' + ((s.pc - s.pa) / 1000).toFixed(1).replace('-', '−') + ' kPa');
        ro.set('pv', (s.pv / 1000).toFixed(2) + ' kPa / ' + (s.pa / 1000).toFixed(1) + ' kPa');
        ro.set('zmax', s.state === 'nohold' ? kit.fmt(s.zs, 3) + ' m (static limit)' : kit.fmt(s.zs - (1 + s.K1) * s.hv, 3) + ' m (static limit ' + kit.fmt(s.zs, 3) + ' m)');
        ro.set('st', { run: 'running normally', air: 'running, but dissolved air is coming out at the crest', limited: 'crest at vapour pressure: column separation, flow limited', nohold: 'cannot run: the crest is above the barometric limit' }[s.state]);
        // drawing on a 760 × 440 grid; heights from −12 m to +13 m
        designFrame(st, 760, 440);
        const yOf = z => 406 - (z + 12) * 15.2, X_IN = 150, X_OUT = 410;
        const pw = clamp(3 + s.D * 1000 / 9, 4, 14);
        // reference lines
        const hline = (z, t, col) => { if (z > 13 || z < -12) return; c.strokeStyle = col; c.lineWidth = 1; c.setLineDash([6, 5]); c.beginPath(); c.moveTo(20, yOf(z)); c.lineTo(500, yOf(z)); c.stroke(); c.setLineDash([]); kit.label(c, t, 496, yOf(z) - 8, { color: col, size: 10.5, align: 'right' }); };
        hline(s.zs, 'barometric limit, p = p_v: ' + s.zs.toFixed(1) + ' m', C.bad);
        hline((s.pa - P_AIR) / (s.rho * G), 'air comes out of solution (typical): ' + ((s.pa - P_AIR) / (s.rho * G)).toFixed(1) + ' m', C.warn);
        // the supply tank and the lower basin
        const water = kit.hue(205, 0.25);
        c.fillStyle = water; c.fillRect(40, yOf(0), 190, yOf(-3) - yOf(0));
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(40, yOf(1)); c.lineTo(40, yOf(-3)); c.lineTo(230, yOf(-3)); c.lineTo(230, yOf(1)); c.stroke();
        c.strokeStyle = kit.hue(205, 0.9); c.lineWidth = 1.5; c.beginPath(); c.moveTo(42, yOf(0)); c.lineTo(228, yOf(0)); c.stroke();
        const zb = -s.H - 0.4;
        c.fillStyle = water; c.fillRect(X_OUT - 45, yOf(zb - 0.5), 90, yOf(zb - 1.4) - yOf(zb - 0.5));
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X_OUT - 45, yOf(zb)); c.lineTo(X_OUT - 45, yOf(zb - 1.4)); c.lineTo(X_OUT + 45, yOf(zb - 1.4)); c.lineTo(X_OUT + 45, yOf(zb)); c.stroke();
        // the hose, coloured by absolute pressure
        const zc = s.zc, runX = X_OUT - X_IN;
        const pts = [], sOf = [];                               // path points and their distance along the hose (m)
        const seg = (x0, z0, x1, z1, s0, len, n) => { for (let i = 0; i <= n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t, z0 + (z1 - z0) * t]); sOf.push(s0 + len * t); } };
        seg(X_IN, -1.5, X_IN, zc, 0, 1.5 + zc, 24);
        seg(X_IN, zc, X_OUT, zc, 1.5 + zc, RUN, 16);
        seg(X_OUT, zc, X_OUT, -s.H, s.L1, zc + s.H, 24);
        const pAt = i => {
          const sd = sOf[i], z = pts[i][1];
          const bends = sd >= 1.5 + zc + RUN - 1e-9 ? 2 * Kb : sd >= 1.5 + zc - 1e-9 ? Kb : 0;
          return s.pa - s.rho * G * (z + (1 + Kent + bends + s.f * sd / s.D) * s.hv);
        };
        const colP = p => p >= s.pa ? kit.fsym.col('pressure') : kit.hue(Math.round(210 * Math.pow(clamp((p - s.pv) / (s.pa - s.pv), 0, 1), 0.7)));
        const sEnd = 1.5 + zc + RUN;                            // end of the crest run, where the pressure is lowest
        c.lineCap = 'round';
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i];
          let col = colP(pAt(i));
          if (s.state === 'nohold') col = (b[1] > s.zs || a[0] > X_IN + 1) ? C.faint : colP(s.pa - s.rho * G * b[1]);
          else if (s.state === 'limited' && sOf[i] > sEnd - 1 && sOf[i] < sEnd + 1.5) col = C.faint;   // a pocket of vapour and air
          c.strokeStyle = col; c.lineWidth = pw; c.beginPath(); c.moveTo(a[0], yOf(a[1])); c.lineTo(b[0], yOf(b[1])); c.stroke();
        }
        // hose walls
        c.strokeStyle = C.text; c.lineWidth = 1; c.globalAlpha = 0.6;
        c.beginPath(); c.moveTo(X_IN - pw / 2 - 1, yOf(-1.5)); c.lineTo(X_IN - pw / 2 - 1, yOf(zc) - pw / 2 - 1); c.lineTo(X_OUT + pw / 2 + 1, yOf(zc) - pw / 2 - 1); c.lineTo(X_OUT + pw / 2 + 1, yOf(-s.H));
        c.moveTo(X_IN + pw / 2 + 1, yOf(-1.5)); c.lineTo(X_IN + pw / 2 + 1, yOf(zc) + pw / 2 + 1); c.lineTo(X_OUT - pw / 2 - 1, yOf(zc) + pw / 2 + 1); c.lineTo(X_OUT - pw / 2 - 1, yOf(-s.H)); c.stroke();
        c.globalAlpha = 1;
        // flow dots and the jet
        const path = pts.map(p => [p[0], yOf(p[1])]);
        if (s.V > 0 && s.state !== 'nohold') {
          ph += dt * clamp(25 * s.V, 5, 160);
          kit.fsym.flow(c, path, ph, { color: C.surface, r: Math.max(1.6, pw / 4) });
          for (let j = 0; j < 6; j++) { const t = ((ph / 30 + j / 6) % 1); kit.dot(c, X_OUT, yOf(-s.H) + t * (yOf(zb - 0.5) - yOf(-s.H)), Math.max(1.5, pw / 4), kit.hue(205, 0.8)); }
        }
        if (s.state === 'limited') kit.label(c, 'vapour and air: the column has separated', X_OUT - 8, yOf(zc) - pw - 12, { color: C.bad, size: 11.5, weight: 700, align: 'right', bg: C.surface });
        if (s.state === 'nohold') kit.label(c, 'the atmosphere holds the water up only to ' + s.zs.toFixed(1) + ' m', X_IN + 12, yOf(Math.min(s.zs, zc)) + 20, { color: C.bad, size: 11.5, weight: 700, align: 'left', bg: C.surface });
        // dimensions
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(230, yOf(0)); c.lineTo(X_OUT + 70, yOf(0)); c.stroke(); c.setLineDash([]);
        kit.arrow(c, X_IN - 30, yOf(0), X_IN - 30, yOf(zc), C.muted, 1.4); kit.label(c, 'z = ' + zc.toFixed(1) + ' m', X_IN - 36, yOf(zc / 2), { color: C.muted, size: 11, align: 'right' });
        kit.arrow(c, X_OUT + 60, yOf(0), X_OUT + 60, yOf(-s.H), C.muted, 1.4); kit.label(c, 'H = ' + s.H.toFixed(1) + ' m', X_OUT + 66, yOf(-s.H / 2), { color: C.muted, size: 11, align: 'left' });
        // the crest-pressure bar
        const bx = 610, bw = 36, by0 = 380, by1 = 50, pMax = 110e3, yP = p => by0 - clamp(p / pMax, 0, 1) * (by0 - by1);
        const zone = (p0, p1, col) => { c.fillStyle = col; c.fillRect(bx, yP(p1), bw, yP(p0) - yP(p1)); };
        zone(0, s.pv, kit.hue(0, 0.55)); zone(s.pv, P_AIR, kit.hue(45, 0.45)); zone(P_AIR, s.pa, kit.hue(205, 0.3)); zone(s.pa, pMax, kit.hue(0, 0.15));
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(bx, by1, bw, by0 - by1);
        const tick = (p, t, col) => { const y = yP(p); c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 4, y); c.lineTo(bx + bw + 4, y); c.stroke(); kit.label(c, t, bx + bw + 8, y, { color: col, size: 10.5, align: 'left' }); };
        tick(s.pa, 'atmosphere ' + (s.pa / 1000).toFixed(1), C.text);
        tick(P_AIR, 'air release ≈ 25', C.warn);
        tick(s.pv, 'vapour ' + (s.pv / 1000).toFixed(1), C.bad);
        const yc = yP(s.pc);
        kit.arrow(c, bx - 30, yc, bx - 2, yc, C.accent, 2.6);
        kit.label(c, (s.pc / 1000).toFixed(1) + ' kPa', bx - 34, yc, { color: C.accent, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'crest pressure', bx + bw / 2, by1 - 26, { color: C.text, size: 11.5, weight: 700, align: 'center' });
        kit.label(c, '(absolute, kPa)', bx + bw / 2, by1 - 12, { color: C.muted, size: 10.5, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
