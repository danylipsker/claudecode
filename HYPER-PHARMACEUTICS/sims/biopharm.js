/* HYPER-PHARMACEUTICS · sims/biopharm.js — simulations for biopharmaceutics (content/biopharm.js).
 *   bph-routes           one hypothetical drug by eight routes: absorption paths, first pass through the liver, blood levels (kit.med.pk)
 *   bph-ph-partition     a weak acid and a weak base along the gut: un-ionised fractions, where the pH-partition model puts absorption
 *   bph-first-pass       an oral dose through three filters (fa · fg · fh, well-stirred liver) against an injection; meals change it
 *   bph-bcs-map          the BCS map: dose number against permeability, hypothetical drugs, fraction absorbed and maximum absorbable dose
 *   bph-dissolution-test USP-style staged acceptance (S1, S2, S3) of tablets dissolving, and the chance a batch passes
 *   bph-f2               two dissolution profiles, the f2 similarity factor and its rules (85 %, CV limits, plateau points)
 *   bph-ivivc            a Level A IVIVC: three release rates, Wagner–Nelson, Levy plot, predicted vs observed and prediction errors
 *   bph-be-crossover     a 2×2 crossover bioequivalence study: 90 % CI of the geometric mean ratio against 80–125 % (kit.pharma.be)
 * All drugs are hypothetical; these are teaching models, not dosing tools.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- small helpers */
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const f1 = x => (Number.isFinite(x) ? x : 0).toFixed(1);
  const pctTxt = (f, d) => (Number.isFinite(f) ? (f * 100).toFixed(d == null ? 1 : d) : '—') + ' %';
  // a normal random number from a seeded uniform source (Box–Muller)
  const gauss = rng => { const u = Math.max(1e-12, rng()), v = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  // position along a polyline at distance s; returns [x, y] or null past the end
  function along(pts, s) {
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1], L = Math.hypot(dx, dy);
      if (s <= L) return [pts[i - 1][0] + dx * s / (L || 1), pts[i - 1][1] + dy * s / (L || 1)];
      s -= L;
    }
    return null;
  }
  const lenOf = pts => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  function rrect(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }

  /* ================================================================ bph-routes */
  Hyper.sim('bph-routes', {
    title: 'One drug, eight routes',
    blurb: `The same hypothetical drug — 100 mg, volume of distribution 70 L — given by eight routes. Each route has its own absorption speed and its own losses; the ones that drain into the portal vein must also pass the liver, which removes the fraction set by the hepatic-extraction slider. The diagram follows the highlighted route through a day (each dot is about 1 mg being absorbed; grey dots are destroyed in the liver), and the graph compares the blood levels. All numbers are illustrative, not those of a real medicine.

**Try this**
- Raise the hepatic extraction to 90 %: the oral curve collapses while the sublingual, patch and injected ones do not move — why glyceryl trinitrate is given under the tongue or as a patch.
- Set the extraction to zero: the tablet now reaches nearly the AUC of the injections, only later and lower.
- Compare the intramuscular and subcutaneous peaks with the intravenous bolus: similar amounts, different shapes.
- Shorten the half-life to 2 h: the patch still holds a steady level through the day while the bolus is gone in hours.
- Read the onset and the time above the illustrative effective level for each route.`,
    mount(box, kit, params) {
      params = params || {};
      const M = kit.med, D = 100, V = 70;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      // each route: absorption flows, either straight to the blood ('direct') or through gut wall and liver ('liver')
      const R = [
        { id: 'iv', name: 'Intravenous', flows: [{ path: 'direct', frac: 1, bolus: true }] },
        { id: 'im', name: 'Intramuscular', flows: [{ path: 'direct', frac: 0.95, ka: 3 }] },
        { id: 'sc', name: 'Subcutaneous', flows: [{ path: 'direct', frac: 0.85, ka: 1 }] },
        { id: 'sl', name: 'Sublingual', flows: [{ path: 'direct', frac: 0.7, ka: 4 }] },
        { id: 'inh', name: 'Inhaled', flows: [{ path: 'direct', frac: 0.3, ka: 10 }, { path: 'liver', frac: 0.54, ka: 0.8, lag: 0.1 }] },
        { id: 'po', name: 'Oral tablet', flows: [{ path: 'liver', frac: 0.9, ka: 0.8, lag: 0.25 }] },
        { id: 'pr', name: 'Rectal', flows: [{ path: 'direct', frac: 0.375, ka: 0.6 }, { path: 'liver', frac: 0.375, ka: 0.6 }] },
        { id: 'td', name: 'Patch (24 h)', flows: [{ path: 'direct', frac: 0.8, patch: 24, lag: 2 }] }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'route', type: 'select', label: 'Highlighted route', options: R.map(r => [r.name, r.id]), value: params.route || 'po' },
        { id: 'EH', label: 'Hepatic extraction of the drug', min: 0, max: 95, step: 1, value: 70, unit: '%' },
        { id: 'half', label: 'Elimination half-life', min: 1, max: 24, step: 0.5, value: 6, unit: 'h' },
        { id: 'thr', label: 'Illustrative effective level', min: 0.1, max: 1.2, step: 0.05, value: 0.3, unit: 'mg/L' },
        { id: 'all', type: 'check', label: 'Show every route on the graph', value: true }
      ], () => { recompute(); parts.length = 0; });
      const Vv = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Bioavailability F'], ['peak', 'Peak Cmax (tmax)'], ['auc', 'AUC'], ['on', 'Onset above the level'], ['dur', 'Time above the level']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0, max: 36 }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 220);

      const fh = () => 1 - Vv.EH / 100;
      const Fof = r => r.flows.reduce((s, f) => s + f.frac * (f.path === 'liver' ? fh() : 1), 0);
      const dosesOf = r => r.flows.map(f => f.bolus ? { t: 0, amount: D, route: 'iv' }
        : f.patch ? { t: f.lag || 0, amount: D * f.frac, route: 'infusion', duration: f.patch }
        : { t: f.lag || 0, amount: D, route: 'oral', F: f.frac * (f.path === 'liver' ? fh() : 1), ka: f.ka });
      // mg per hour leaving the site of absorption (before any first pass)
      const rateOf = (f, t) => {
        const s = t - (f.lag || 0);
        if (s < 0) return 0;
        if (f.bolus) return s < 0.08 ? D / 0.08 : 0;
        if (f.patch) return s < f.patch ? D * f.frac / f.patch : 0;
        return D * f.frac * f.ka * Math.exp(-f.ka * s);
      };
      let pks = {}, cur = R[5];
      function recompute() {
        cur = R.find(r => r.id === Vv.route) || R[5];
        pks = {};
        for (const r of R) pks[r.id] = M.pk({ halfLife: Vv.half, Vd: V, doses: dosesOf(r) });
        const C = kit.colors(), series = [];
        R.forEach((r, i) => {
          if (!Vv.all && r !== cur) return;
          const pk = pks[r.id], pts = [];
          for (let t = 0; t <= 36.001; t += 0.1) pts.push([t, pk.at(t)]);
          series.push({ pts, label: r.name, color: C.series[i % C.series.length], width: r === cur ? 3 : 1.3, dash: r === cur ? null : [4, 3] });
        });
        plot.set({ series, hlines: [{ y: Vv.thr, label: 'illustrative effective level' }] });
        // numbers for the highlighted route
        const pk = pks[cur.id], k = Math.LN2 / Vv.half, F = Fof(cur);
        let cmax = 0, tmax = 0, onset = null, above = 0;
        for (let t = 0; t <= 96; t += 0.02) {
          const c = pk.at(t);
          if (c > cmax) { cmax = c; tmax = t; }
          if (c >= Vv.thr) { above += 0.02; if (onset == null) onset = t; }
        }
        ro.set('F', pctTxt(F, 0));
        ro.set('peak', cmax.toFixed(2) + ' mg/L (' + (tmax < 0.05 ? 'at once' : tmax.toFixed(1) + ' h') + ')');
        ro.set('auc', (F * D / (k * V)).toFixed(1) + ' mg·h/L');
        ro.set('on', onset == null ? 'never reached' : onset < 0.05 ? 'at once' : onset < 1 ? (onset * 60).toFixed(0) + ' min' : onset.toFixed(1) + ' h');
        ro.set('dur', above.toFixed(1) + ' h');
      }
      recompute();

      // the diagram
      const parts = [];
      let clock = 0, acc = 0;
      const layout = () => {
        const W = st.W, Hh = st.H, top = 30, rowH = (Hh - top - 10) / R.length, xE = Math.min(170, W * 0.24);
        const rowY = i => top + rowH * (i + 0.5);
        const ly = (rowY(5) + rowY(6)) / 2, lw = Math.max(64, W * 0.12), lx = W * 0.47;
        const bx = W * 0.76, bw = W - bx - 12;
        return { W, Hh, top, rowH, xE, rowY, liver: { x0: lx - lw / 2, x1: lx + lw / 2, y: ly, h: Math.max(40, rowH * 2.4) }, bx, bw };
      };
      const pathOf = (L, i, kind) => kind === 'liver'
        ? [[L.xE + 44, L.rowY(i)], [L.liver.x0, L.liver.y], [L.liver.x1, L.liver.y], [L.bx + 6, L.liver.y]]
        : [[L.xE + 44, L.rowY(i)], [L.bx + 6, L.rowY(i)]];
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), L = layout();
        clock += dt * 2;                                             // two hours of body time per second
        if (clock > 24) { clock = 0; parts.length = 0; }
        const ci = R.indexOf(cur), col = C.series[ci % C.series.length];
        // spawn dots: one per mg absorbed
        cur.flows.forEach(f => {
          acc += rateOf(f, clock) * dt * 2;
          while (acc >= 1 && parts.length < 500) {
            acc -= 1;
            parts.push({ kind: f.path, s: 0, die: f.path === 'liver' && Math.random() < 1 - fh(), fade: 1 });
          }
          if (acc > 50) acc = 0;
        });
        // lines for every route
        c.lineWidth = 1;
        R.forEach((r, i) => {
          const on = r === cur, y = L.rowY(i);
          kit.label(c, r.name, 12, y, { size: 12, weight: on ? 700 : 500, color: on ? C.text : C.muted });
          kit.label(c, 'F ' + Math.round(Fof(r) * 100) + ' %', L.xE + 40, y - 8, { size: 10.5, align: 'right', color: C.muted });
          for (const kind of new Set(r.flows.map(f => f.path))) {
            const p = pathOf(L, i, kind);
            c.strokeStyle = on ? col : C.faint; c.lineWidth = on ? 2.4 : 1; c.setLineDash(on ? [] : [3, 4]);
            c.beginPath(); c.moveTo(p[0][0], p[0][1]); for (const q of p.slice(1)) c.lineTo(q[0], q[1]); c.stroke();
          }
          c.setLineDash([]);
        });
        // liver
        const lv = L.liver;
        c.fillStyle = kit.hue(10, C.dark ? 0.35 : 0.22); rrect(c, lv.x0, lv.y - lv.h / 2, lv.x1 - lv.x0, lv.h, 10); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'gut wall + liver', (lv.x0 + lv.x1) / 2, lv.y - 8, { align: 'center', size: 11.5, weight: 700, color: C.text });
        kit.label(c, 'removes ' + Math.round(Vv.EH) + ' %', (lv.x0 + lv.x1) / 2, lv.y + 9, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'portal vein', lv.x0 - 6, lv.y - lv.h / 2 - 8, { align: 'right', size: 10.5, color: C.muted });
        // blood
        const conc = pks[cur.id] ? pks[cur.id].at(clock) : 0, cref = 1.6;
        const bh = L.Hh - L.top - 14, by = L.top;
        c.fillStyle = kit.hue(0, C.dark ? 0.12 : 0.08); rrect(c, L.bx, by, L.bw, bh, 10); c.fill();
        c.fillStyle = kit.hue(0, C.dark ? 0.55 : 0.4);
        const fillH = bh * clamp(conc / cref, 0, 1); c.fillRect(L.bx + 2, by + bh - fillH, L.bw - 4, fillH);
        c.strokeStyle = C.text; c.lineWidth = 1.5; rrect(c, L.bx, by, L.bw, bh, 10); c.stroke();
        const ty = by + bh - bh * clamp(Vv.thr / cref, 0, 1);
        c.strokeStyle = C.warn; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(L.bx, ty); c.lineTo(L.bx + L.bw, ty); c.stroke(); c.setLineDash([]);
        kit.label(c, 'blood', L.bx + L.bw / 2, by + 12, { align: 'center', size: 12, weight: 700, color: C.text });
        kit.label(c, conc.toFixed(2) + ' mg/L', L.bx + L.bw / 2, by + 30, { align: 'center', size: 13, weight: 700, color: conc >= Vv.thr ? C.ok : C.muted });
        kit.label(c, 't = ' + clock.toFixed(1) + ' h', L.W / 2, 14, { align: 'center', size: 12.5, weight: 700, color: C.text });
        // the dots
        for (let k = parts.length - 1; k >= 0; k--) {
          const p = parts[k], path = pathOf(L, ci, p.kind);
          const stop = p.die ? lenOf(path.slice(0, 2)) + (lv.x1 - lv.x0) / 2 : Infinity;
          if (p.s < stop) p.s += dt * lenOf(path) / 0.9; else p.fade -= dt * 1.5;
          const q = along(path, Math.min(p.s, stop));
          if (!q || p.fade <= 0) { parts.splice(k, 1); continue; }
          c.globalAlpha = clamp(p.fade, 0, 1);
          kit.dot(c, q[0], q[1] + (p.die && p.s >= stop ? (1 - p.fade) * 18 : 0), 2.6, p.die && p.s >= stop ? C.muted : col);
          c.globalAlpha = 1;
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bph-ph-partition */
  Hyper.sim('bph-ph-partition', {
    title: 'pH-partition along the gut',
    blurb: `A weak acid (top half of the tube) and a weak base (bottom half) travel from the stomach through the duodenum, jejunum and ileum. Filled dots are un-ionised molecules, which cross the lipid membrane; rings are ionised ones (− for the acid, + for the base), which mostly cannot. Arrows into the blood show where the pH-partition model puts absorption once each segment's (illustrative) absorbing surface and transit time are counted. The graph shows the un-ionised fraction against pH on a log scale.

**Try this**
- With the acid's pKa at 4.4 (close to ibuprofen) almost every acid molecule in the stomach is un-ionised — yet most absorption still lands in the jejunum. Why?
- Move the base's pKa down from 9.5 to 5: a very weak base is un-ionised throughout the intestine.
- Raise the stomach pH to 5, as after a meal or with an acid-reducing medicine: the acid's advantage in the stomach disappears.
- Turn off "weight by surface and transit time": the pure pH-partition picture puts the acid in the stomach — the classic prediction that real guts overturn.
- Read the plasma-to-stomach ratio: an acid swallowed into a pH 1.5 stomach is pulled into plasma, where it becomes ionised and trapped.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'pKaA', label: 'Weak acid pKa', min: 1, max: 11, step: 0.1, value: 4.4 },
        { id: 'pKaB', label: 'Weak base pKa', min: 1, max: 11, step: 0.1, value: 9.5 },
        { id: 'pHs', label: 'Stomach pH', min: 1, max: 7, step: 0.1, value: 1.8 },
        { id: 'weigh', type: 'check', label: 'Weight by surface and transit time', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['acid', 'Acid un-ionised: stomach / jejunum'], ['base', 'Base un-ionised: stomach / jejunum'], ['sa', 'Acid absorbed in the small intestine'], ['sb', 'Base absorbed in the small intestine'], ['trap', 'Acid, plasma : stomach at equilibrium']]);
      const plot = kit.plot(gb, { x: { label: 'pH', min: 1, max: 8 }, y: { label: 'un-ionised (%)', log: true, min: 1e-4, max: 150 }, legend: true }, 190);
      // illustrative relative absorbing surface and hours spent in each segment
      const SEG = [{ name: 'Stomach', pH: 1.8, area: 1, time: 0.3, w: 0.22 }, { name: 'Duodenum', pH: 6.0, area: 4, time: 0.1, w: 0.14 },
                   { name: 'Jejunum', pH: 6.5, area: 60, time: 1.6, w: 0.34 }, { name: 'Ileum', pH: 7.4, area: 35, time: 1.8, w: 0.3 }];
      const unAcid = pH => 1 - P.ionised(V.pKaA, pH, true), unBase = pH => 1 - P.ionised(V.pKaB, pH, false);
      let shareA = [], shareB = [];
      function recompute() {
        SEG[0].pH = V.pHs;
        const wt = s => V.weigh ? s.area * s.time : 1;
        const a = SEG.map(s => unAcid(s.pH) * wt(s)), b = SEG.map(s => unBase(s.pH) * wt(s));
        const sa = a.reduce((x, y) => x + y, 0) || 1, sb = b.reduce((x, y) => x + y, 0) || 1;
        shareA = a.map(x => x / sa); shareB = b.map(x => x / sb);
        const curve = f => Array.from({ length: 141 }, (_, i) => { const pH = 1 + i * 0.05; return [pH, Math.max(1e-5, 100 * f(pH))]; });
        plot.set({ series: [{ pts: curve(unAcid), label: 'weak acid, pKa ' + V.pKaA.toFixed(1) }, { pts: curve(unBase), label: 'weak base, pKa ' + V.pKaB.toFixed(1) }],
          vlines: SEG.map(s => ({ x: s.pH, label: s.name })) });
        const sm = x => (x * 100 < 0.01 ? (x * 100).toExponential(1) : (x * 100).toPrecision(3)) + ' %';
        ro.set('acid', sm(unAcid(V.pHs)) + ' / ' + sm(unAcid(6.5)));
        ro.set('base', sm(unBase(V.pHs)) + ' / ' + sm(unBase(6.5)));
        ro.set('sa', pctTxt(1 - shareA[0], 0) + (V.weigh ? '' : ' (pH alone)'));
        ro.set('sb', pctTxt(1 - shareB[0], 0) + (V.weigh ? '' : ' (pH alone)'));
        const trap = (1 + Math.pow(10, 7.4 - V.pKaA)) / (1 + Math.pow(10, V.pHs - V.pKaA));
        ro.set('trap', (trap >= 1000 ? trap.toExponential(1) : trap.toPrecision(3)) + ' : 1');
        loop.once();
      }
      const N = 26;
      const mol = SEG.map(() => ({ a: Array.from({ length: N }, () => [Math.random(), Math.random(), Math.random() * 6.28]), b: Array.from({ length: N }, () => [Math.random(), Math.random(), Math.random() * 6.28]) }));
      const cross = [];
      let tt = 0;
      const pHcol = (pH, a) => 'hsl(' + clamp(Math.round((pH - 1) * 34), 0, 240) + ' 70% 55% / ' + a + ')';
      const loop = kit.loop((dt) => {
        tt += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = 14, x1 = W - 14, ty = Hh * 0.12, th = Hh * 0.5, by = Hh * 0.8, bh = Hh * 0.14;
        const colA = C.series[0], colB = C.series[1];
        let x = x0;
        SEG.forEach((s, i) => {
          const w = (x1 - x0) * s.w;
          c.fillStyle = pHcol(s.pH, C.dark ? 0.28 : 0.22); rrect(c, x + 2, ty, w - 4, th, i === 0 ? 22 : 8); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 1.4; rrect(c, x + 2, ty, w - 4, th, i === 0 ? 22 : 8); c.stroke();
          c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x + 6, ty + th / 2); c.lineTo(x + w - 6, ty + th / 2); c.stroke(); c.setLineDash([]);
          kit.label(c, s.name + ' · pH ' + s.pH.toFixed(1), x + w / 2, ty - 9, { align: 'center', size: 11.5, weight: 700, color: C.text });
          // molecules: filled = un-ionised, ring with a sign = ionised
          const fa = unAcid(s.pH), fb = unBase(s.pH), na = Math.round(N * fa), nb = Math.round(N * fb);
          const draw = (list, n, top, colr, sign) => list.forEach((m, j) => {
            const px = x + 10 + m[0] * (w - 20) + 3 * Math.sin(tt * 1.3 + m[2]), py = top + 8 + m[1] * (th / 2 - 16) + 2 * Math.cos(tt * 1.1 + m[2]);
            if (j < n) kit.dot(c, px, py, 3.2, colr);
            else { c.strokeStyle = colr; c.lineWidth = 1.2; c.beginPath(); c.arc(px, py, 3.4, 0, 6.283); c.stroke(); if (w > 90) kit.label(c, sign, px + 5, py - 4, { size: 8.5, color: colr }); }
          });
          draw(mol[i].a, na, ty, colA, '−'); draw(mol[i].b, nb, ty + th / 2, colB, '+');
          kit.label(c, 'acid ' + (fa * 100 < 0.1 ? '<0.1' : (fa * 100).toFixed(fa > 0.1 ? 0 : 1)) + ' %', x + w / 2, ty + th + 11, { align: 'center', size: 10.5, color: colA });
          kit.label(c, 'base ' + (fb * 100 < 0.1 ? '<0.1' : (fb * 100).toFixed(fb > 0.1 ? 0 : 1)) + ' %', x + w / 2, ty + th + 25, { align: 'center', size: 10.5, color: colB });
          // arrows into the blood, width by share of absorption
          const ax = x + w * 0.35, bx2 = x + w * 0.65, y0 = ty + th + 34, y1 = by - 2;
          if (shareA[i] > 0.005) kit.arrow(c, ax, y0, ax, y1, colA, 1 + 9 * shareA[i]);
          if (shareB[i] > 0.005) kit.arrow(c, bx2, y0, bx2, y1, colB, 1 + 9 * shareB[i]);
          // a molecule now and then crossing, in proportion to the share
          if (Math.random() < dt * 6 * shareA[i]) cross.push({ x: ax + (Math.random() - 0.5) * 10, y: y0, col: colA });
          if (Math.random() < dt * 6 * shareB[i]) cross.push({ x: bx2 + (Math.random() - 0.5) * 10, y: y0, col: colB });
          x += w;
        });
        c.fillStyle = kit.hue(0, C.dark ? 0.2 : 0.12); rrect(c, x0 + 2, by, x1 - x0 - 4, bh, 8); c.fill();
        kit.label(c, 'portal blood · pH 7.4', x0 + 12, by + bh / 2, { size: 11.5, weight: 700, color: C.text });
        for (let k = cross.length - 1; k >= 0; k--) {
          const p = cross[k]; p.y += dt * 60;
          if (p.y > by + bh - 4 || cross.length > 200) { cross.splice(k, 1); continue; }
          kit.dot(c, p.x, p.y, 2.6, p.col);
        }
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ bph-first-pass */
  Hyper.sim('bph-first-pass', {
    title: 'First pass: three filters',
    blurb: `A 100 mg oral dose of a hypothetical drug flows through three filters: absorption from the gut (fa), enzymes in the gut wall (fg), and the liver, whose extraction comes from the well-stirred model $E_H = f_u\\mathrm{CL}_{\\mathrm{int}}/(Q_H + f_u\\mathrm{CL}_{\\mathrm{int}})$. The band narrows at each filter; what reaches the right-hand end is the bioavailability. The graph compares the blood levels after the tablet with the same dose injected into a vein (volume of distribution 250 L, cleared only by the liver). The drug and numbers are illustrative.

**Try this**
- Push the liver enzymes up to 2000 L/h: extraction climbs past 90 %, oral bioavailability falls to a few per cent, and the intravenous curve barely changes shape — clearance is now limited by blood flow.
- At high extraction, halve the enzyme activity (as an inhibitor would): the oral AUC doubles, the intravenous AUC rises only a little.
- Set fa to 100 % and fg to 100 %: the bioavailability equals 1 − E_H exactly.
- Take it with a high-fat meal: absorption is later and slower but more complete, and extra liver blood flow lets a little more escape. With milk or an antacid, a chelating drug is absorbed far less.
- Slow the absorption (ka): the peak falls and moves later, but the AUC does not change.`,
    mount(box, kit, params) {
      params = params || {};
      const M = kit.med, D = 100, Vd = 250;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'fa', label: 'Fraction absorbed fa', min: 5, max: 100, step: 1, value: 90, unit: '%' },
        { id: 'fg', label: 'Fraction escaping the gut wall fg', min: 5, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'cl', label: 'Liver enzymes: fu·CLint', min: 5, max: 3000, value: 300, unit: 'L/h', log: true, sig: 3 },
        { id: 'QH', label: 'Liver blood flow Q_H', min: 45, max: 135, step: 5, value: 90, unit: 'L/h' },
        { id: 'ka', label: 'Absorption rate constant ka', min: 0.2, max: 5, value: 1.2, unit: '1/h', log: true, sig: 2 },
        { id: 'meal', type: 'select', label: 'Taken…', options: [['fasting', 'fast'], ['with a high-fat meal (lipophilic drug)', 'fed'], ['with milk or an antacid (chelating drug)', 'chel']], value: params.meal || 'fast' },
        { id: 'iv', type: 'check', label: 'Compare with 100 mg intravenously', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['F', 'Bioavailability F = fa·fg·fh'], ['EH', 'Hepatic extraction E_H'], ['cl', 'Clearance (t½)'], ['auc', 'AUC oral / intravenous'], ['cmax', 'Oral Cmax (tmax)']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0 }, y: { label: 'plasma concentration (mg/L)', min: 0 }, legend: true }, 200);
      let m = { fa: 0.9, fg: 0.8, EH: 0.5, F: 0.36 };
      function model() {
        const meal = V.meal;
        const fa = clamp(V.fa / 100 * (meal === 'fed' ? 1.5 : meal === 'chel' ? 0.35 : 1), 0, 1);
        const fg = V.fg / 100, QH = V.QH * (meal === 'fed' ? 1.25 : 1), ka = V.ka * (meal === 'fed' ? 0.5 : 1);
        const EH = V.cl / (QH + V.cl), CL = QH * EH, F = fa * fg * (1 - EH);
        return { fa, fg, QH, ka, EH, CL, F, k: CL / Vd, lag: meal === 'fed' ? 1 : 0.25 };
      }
      function recompute() {
        m = model();
        const half = Math.LN2 / m.k, T = clamp(6 * half, 12, 72);
        const po = M.pk({ halfLife: half, Vd, doses: [{ t: m.lag, amount: D, route: 'oral', F: m.F, ka: m.ka }] });
        const iv = M.pk({ halfLife: half, Vd, doses: [{ t: 0, amount: D, route: 'iv' }] });
        const pts = f => Array.from({ length: 241 }, (_, i) => { const t = T * i / 240; return [t, f.at(t)]; });
        let cmax = 0, tmax = 0;
        for (let t = 0; t <= T; t += T / 1200) { const c = po.at(t); if (c > cmax) { cmax = c; tmax = t; } }
        const series = [{ pts: pts(po), label: 'tablet (' + (V.meal === 'fast' ? 'fasting' : V.meal === 'fed' ? 'after a fatty meal' : 'with milk/antacid') + ')', fill: true }];
        if (V.iv) series.push({ pts: pts(iv), label: 'intravenous', dash: [5, 4] });
        plot.set({ series, x: { label: 'time (h)', min: 0, max: T }, y: { label: 'plasma concentration (mg/L)', min: 0, max: V.iv ? D / Vd * 1.05 : undefined } });
        ro.set('F', pctTxt(m.fa, 0) + ' × ' + pctTxt(m.fg, 0) + ' × ' + pctTxt(1 - m.EH, 0) + ' = ' + pctTxt(m.F, 1));
        ro.set('EH', pctTxt(m.EH, 1) + (m.EH > 0.7 ? ' — high' : m.EH < 0.3 ? ' — low' : ' — intermediate'));
        ro.set('cl', m.CL.toFixed(1) + ' L/h (' + half.toFixed(1) + ' h)');
        ro.set('auc', (m.F * D / m.CL).toFixed(1) + ' / ' + (D / m.CL).toFixed(1) + ' mg·h/L');
        ro.set('cmax', cmax.toFixed(2) + ' mg/L (' + tmax.toFixed(1) + ' h)');
        dots.length = 0;
      }
      const dots = [];
      recompute();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const labels = ['dose', 'gut lumen', 'gut wall', 'liver', 'circulation'];
        const xs = [W * 0.04, W * 0.2, W * 0.42, W * 0.64, W * 0.9], yT = Hh * 0.2, Hm = Hh * 0.36, rr = 8;
        const keep = [1, m.fa, m.fa * m.fg, m.F];             // thickness after each filter
        const band = kit.hue(200, C.dark ? 0.5 : 0.35), lost = kit.hue(10, C.dark ? 0.45 : 0.3);
        // the main band: segment k runs from station k to station k+1 with thickness keep[k-1]
        c.fillStyle = band;
        c.fillRect(xs[0], yT, xs[1] - rr - xs[0], Hm);
        for (let k = 1; k < 4; k++) c.fillRect(xs[k] - rr, yT, xs[k + 1] - xs[k] + (k === 3 ? rr : 0), Hm * keep[k]);
        // losses turning down at stations 1, 2, 3
        const lossTxt = ['not absorbed', 'gut-wall metabolism', 'liver metabolism'];
        for (let k = 1; k <= 3; k++) {
          const hp = Hm * keep[k - 1], hn = Hm * keep[k], d = hp - hn, xi = xs[k], xs0 = xi - rr, yb = yT + hp, yD = Hh * 0.86;
          if (d > 0.5) {
            c.fillStyle = lost; c.beginPath();
            c.moveTo(xs0, yb - d); c.quadraticCurveTo(xi + d, yb - d, xi + d, yb + rr); c.lineTo(xi + d, yD); c.lineTo(xi, yD); c.lineTo(xi, yb + rr); c.quadraticCurveTo(xi, yb, xs0, yb); c.closePath(); c.fill();
          }
          const lostMg = D * (keep[k - 1] - keep[k]);
          kit.label(c, lossTxt[k - 1], xi + 4, Hh * 0.92, { size: 10.5, color: C.muted });
          kit.label(c, lostMg.toFixed(0) + ' mg', xi + 4, Hh * 0.92 - 14, { size: 12, weight: 700, color: C.bad });
        }
        // station marks and names
        labels.forEach((s, i) => {
          kit.label(c, s, xs[i] + (i === 4 ? -4 : 2), yT - 12, { size: 11.5, weight: 700, align: i === 4 ? 'right' : 'left', color: C.text });
          if (i > 0 && i < 4) { c.strokeStyle = C.text; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(xs[i], yT - 4); c.lineTo(xs[i], yT + Hm + 4); c.stroke(); c.setLineDash([]); }
        });
        kit.arrow(c, xs[4], yT + Hm * m.F / 2, W - 6, yT + Hm * m.F / 2, C.ok, Math.max(2, Math.min(10, Hm * m.F * 0.4)));
        kit.label(c, (D * m.F).toFixed(1) + ' mg reach the blood (F = ' + (m.F * 100).toFixed(1) + ' %)', xs[4] - 4, yT + Hm + 18, { size: 12.5, weight: 700, align: 'right', color: C.ok });
        // dots flowing: uniform across the band, so the share that turns down equals each loss
        if (dots.length < 160 && Math.random() < dt * 40) dots.push({ x: xs[0], y: yT + Math.random() * Hm, down: false });
        for (let i = dots.length - 1; i >= 0; i--) {
          const p = dots[i];
          if (p.down) p.y += dt * 70; else {
            p.x += dt * W * 0.12;
            for (let k = 1; k <= 3; k++) if (p.x >= xs[k] && p.x - dt * W * 0.12 < xs[k] && p.y > yT + Hm * keep[k]) { p.down = true; p.x = xs[k] + (yT + Hm * keep[k - 1] - p.y); }
          }
          if (p.x > W - 8 || p.y > Hh * 0.86) { dots.splice(i, 1); continue; }
          kit.dot(c, p.x, p.y, 2.2, p.down ? C.bad : C.text);
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bph-bcs-map */
  Hyper.sim('bph-bcs-map', {
    title: 'The BCS map',
    blurb: `The Biopharmaceutics Classification System as a map: across, the dose number $D_0$ (how many 250 mL glasses the dose needs at its least favourable pH, so high solubility is on the left); up, the effective jejunal permeability. The lines at $D_0 = 1$ and at 85 % absorbed divide the four classes. The shading is a rough estimate of the fraction of the dose absorbed, combining Amidon's permeability model with the maximum absorbable dose. Letters A–H are hypothetical drugs — click one to read about it. The large dot is your drug, built from its type, pKa, intrinsic solubility, dose and permeability.

**Try this**
- Make your drug a weak acid of pKa 4.4 with an intrinsic solubility of 0.05 mg/mL: very soluble at pH 6.8, but judged at pH 1.2 — class II.
- Turn it into a weak base with the same numbers: now pH 6.8 is the worst case.
- Lower the dose from 400 mg to 10 mg: the same molecule moves into class I. The class belongs to the dose as well as the molecule.
- Drop the permeability below 1 × 10⁻⁴ cm/s and watch the estimated absorption fall, however soluble the drug.
- Find the combination where a highly permeable drug is still poorly absorbed: a very high dose number, where solubility caps the maximum absorbable dose.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 520 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Your drug is a…', options: [['weak acid', 'acid'], ['weak base', 'base'], ['neutral molecule', 'neutral']], value: 'acid' },
        { id: 'pKa', label: 'pKa', min: 2, max: 11, step: 0.1, value: 4.4 },
        { id: 'S0', label: 'Intrinsic solubility S₀', min: 0.001, max: 50, value: 0.05, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'dose', label: 'Highest dose', min: 1, max: 2000, value: 400, unit: 'mg', log: true, sig: 2 },
        { id: 'peff', label: 'Permeability P_eff (×10⁻⁴ cm/s)', min: 0.03, max: 10, value: 2, log: true, sig: 2 }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sol', 'Solubility at pH 1.2 / 4.5 / 6.8'], ['d0', 'Dose number D₀ (worst pH)'], ['cls', 'BCS class'], ['fa', 'Fraction absorbed if dissolved'], ['mad', 'Maximum absorbable dose'], ['est', 'Rough estimate absorbed'], ['sel', 'Selected drug']]);
      const plot = kit.plot(gb, { x: { label: 'pH', min: 1, max: 8 }, y: { label: 'solubility (mg/mL)', log: true }, legend: true }, 170);
      const TSI = 199 * 60, RAD = 1.75;
      const faOf = p => 1 - Math.exp(-2 * p * 1e-4 * TSI / RAD);                  // p in 10⁻⁴ cm/s
      const kaMin = p => 2 * p * 1e-4 / RAD * 60;                                 // 1/min
      const estAbs = (d0, p) => faOf(p) * Math.min(1, 270 * kaMin(p) / Math.max(1e-9, d0));
      const solAt = pH => V.type === 'neutral' ? V.S0 : Math.min(500, P.solubility({ S0: V.S0, pKa: V.pKa, pH, acid: V.type === 'acid' }));
      const DRUGS = [
        { k: 'A', d0: 0.05, p: 4, txt: 'A: small, neutral, very soluble and permeable — class I; behaves like a solution.' },
        { k: 'B', d0: 0.4, p: 1.8, txt: 'B: weak base, soluble at every pH, well absorbed — class I; a biowaiver candidate if it dissolves rapidly.' },
        { k: 'C', d0: 30, p: 3, txt: 'C: weak acid, poorly soluble at pH 1.2 but dissolves in the intestine — class II, often absorbed well in practice.' },
        { k: 'D', d0: 400, p: 2.5, txt: 'D: neutral "brick dust", high dose — class II and solubility-limited: formulation (nanoparticles, amorphous forms) decides.' },
        { k: 'E', d0: 0.1, p: 0.3, txt: 'E: polar, very soluble, poorly permeable — class III; absorption about 30 %, limited by the gut wall.' },
        { k: 'F', d0: 0.8, p: 0.08, txt: 'F: highly polar molecule — class III with very low absorption; a candidate for a prodrug or another route.' },
        { k: 'G', d0: 20, p: 0.4, txt: 'G: poorly soluble and poorly permeable — class IV; absorption low and variable.' },
        { k: 'H', d0: 3, p: 1.2, txt: 'H: close to both boundaries — its class could change with the dose or the data; a borderline case.' }
      ];
      let me = { d0: 1, p: 2 }, sel = null;
      const X0 = 0.01, X1 = 1000, Y0 = 0.03, Y1 = 10;
      const frame = () => { const W = st.W, Hh = st.H, l = 56, r = 20, t = 16, b = 40; return { l, t, w: W - l - r, h: Hh - t - b, W, Hh }; };
      const px = (F, d0) => F.l + F.w * (Math.log10(clamp(d0, X0, X1)) - Math.log10(X0)) / (Math.log10(X1) - Math.log10(X0));
      const py = (F, p) => F.t + F.h * (1 - (Math.log10(clamp(p, Y0, Y1)) - Math.log10(Y0)) / (Math.log10(Y1) - Math.log10(Y0)));
      function recompute() {
        const s12 = solAt(1.2), s45 = solAt(4.5), s68 = solAt(6.8), smin = Math.min(s12, s45, s68), sInt = solAt(6.5);
        const d0 = V.dose / (250 * smin), fa = faOf(V.peff), mad = sInt * kaMin(V.peff) * 250 * 270;
        me = { d0, p: V.peff };
        const hiS = d0 <= 1, hiP = fa >= 0.85, cls = hiS ? (hiP ? 'I' : 'III') : (hiP ? 'II' : 'IV');
        const lim = { I: 'gastric emptying; a biowaiver candidate if rapidly dissolving', II: 'dissolution and solubility', III: 'permeability; biowaiver only with very rapid dissolution', IV: 'both solubility and permeability' }[cls];
        const fs = x => x >= 100 ? x.toFixed(0) : x >= 1 ? x.toPrecision(3) : x.toPrecision(2);
        ro.set('sol', fs(s12) + ' / ' + fs(s45) + ' / ' + fs(s68) + ' mg/mL');
        ro.set('d0', fs(d0) + (hiS ? ' — highly soluble' : ' — needs ' + fs(V.dose / smin) + ' mL'));
        ro.set('cls', 'Class ' + cls + ': ' + lim);
        ro.set('fa', pctTxt(fa, 0) + (hiP ? ' — highly permeable' : ''));
        ro.set('mad', (mad >= 10 ? mad.toFixed(0) : mad.toPrecision(2)) + ' mg (at pH 6.5)');
        ro.set('est', pctTxt(faOf(V.peff) * Math.min(1, mad / V.dose), 0));
        const pHs = Array.from({ length: 71 }, (_, i) => 1 + i * 0.1);
        plot.set({ series: [{ pts: pHs.map(pH => [pH, solAt(pH)]), label: 'your drug' }],
          hlines: [{ y: V.dose / 250, label: 'needed: dose / 250 mL' }], vlines: [{ x: 1.2, label: '1.2' }, { x: 4.5, label: '4.5' }, { x: 6.8, label: '6.8' }] });
        loop.once();
      }
      kit.click(st, p => {
        const F = frame();
        const hit = DRUGS.find(d => Math.hypot(px(F, d.d0) - p.x, py(F, d.p) - p.y) < 14);
        sel = hit || null; ro.set('sel', sel ? sel.txt : 'click a letter'); loop.once();
      }, p => { const F = frame(); return DRUGS.some(d => Math.hypot(px(F, d.d0) - p.x, py(F, d.p) - p.y) < 14); });
      ro.set('sel', 'click a letter on the map');
      let tt = 0;
      const loop = kit.loop((dt) => {
        tt += dt;
        const c = st.begin(), C = kit.colors(), F = frame();
        // shading: rough fraction absorbed
        const nx = 60, ny = 36, cw = F.w / nx, ch = F.h / ny;
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const d0 = Math.pow(10, Math.log10(X0) + (i + 0.5) / nx * (Math.log10(X1) - Math.log10(X0)));
          const p = Math.pow(10, Math.log10(Y1) - (j + 0.5) / ny * (Math.log10(Y1) - Math.log10(Y0)));
          c.fillStyle = kit.hue(160, 0.05 + 0.45 * estAbs(d0, p));
          c.fillRect(F.l + i * cw, F.t + j * ch, cw + 0.6, ch + 0.6);
        }
        // grid and axes
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let e = -2; e <= 3; e++) { const x = px(F, Math.pow(10, e)); c.beginPath(); c.moveTo(x, F.t); c.lineTo(x, F.t + F.h); c.stroke(); kit.label(c, e < 0 ? String(Math.pow(10, e)) : String(Math.pow(10, e)), x, F.t + F.h + 12, { align: 'center', size: 11, color: C.muted }); }
        [0.03, 0.1, 0.3, 1, 3, 10].forEach(p => { const y = py(F, p); c.beginPath(); c.moveTo(F.l, y); c.lineTo(F.l + F.w, y); c.stroke(); kit.label(c, String(p), F.l - 6, y, { align: 'right', size: 11, color: C.muted }); });
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(F.l, F.t, F.w, F.h);
        kit.label(c, 'dose number D₀ (log) →  lower solubility', F.l + F.w, F.Hh - 6, { align: 'right', size: 11.5, weight: 600, color: C.text2 || C.text });
        c.save(); c.translate(14, F.t + F.h / 2); c.rotate(-Math.PI / 2); kit.label(c, 'P_eff (10⁻⁴ cm/s, log)', 0, 0, { align: 'center', size: 11.5, weight: 600, color: C.text }); c.restore();
        // class boundaries
        const xb = px(F, 1), yb = py(F, 1.39);
        c.strokeStyle = C.text; c.lineWidth = 2; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(xb, F.t); c.lineTo(xb, F.t + F.h); c.moveTo(F.l, yb); c.lineTo(F.l + F.w, yb); c.stroke(); c.setLineDash([]);
        kit.label(c, 'D₀ = 1', xb + 4, F.t + F.h - 10, { size: 10.5, color: C.muted });
        kit.label(c, '85 % absorbed', F.l + F.w - 4, yb - 9, { size: 10.5, align: 'right', color: C.muted });
        const big = { size: 22, weight: 800, align: 'center', color: C.muted };
        kit.label(c, 'I', (F.l + xb) / 2, F.t + 22, big); kit.label(c, 'II', (xb + F.l + F.w) / 2, F.t + 22, big);
        kit.label(c, 'III', (F.l + xb) / 2, F.t + F.h - 22, big); kit.label(c, 'IV', (xb + F.l + F.w) / 2, F.t + F.h - 22, big);
        // hypothetical drugs
        DRUGS.forEach(d => {
          const x = px(F, d.d0), y = py(F, d.p), on = sel === d;
          kit.dot(c, x, y, on ? 11 : 9, on ? C.accent : C.surface, C.text);
          kit.label(c, d.k, x, y + 0.5, { align: 'center', size: 11, weight: 800, color: on ? C.bg || C.surface : C.text });
        });
        // your drug
        const x = px(F, me.d0), y = py(F, me.p), pulse = 8 + 2 * Math.sin(tt * 4);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.arc(x, y, pulse + 4, 0, 6.283); c.stroke();
        kit.dot(c, x, y, 7, C.warn, C.text);
        kit.label(c, 'your drug' + (me.d0 > X1 ? ' →' : me.d0 < X0 ? ' ←' : ''), x + (x > F.l + F.w - 90 ? -14 : 14), y - 14, { size: 12, weight: 700, align: x > F.l + F.w - 90 ? 'right' : 'left', color: C.text, bg: C.surface });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ bph-dissolution-test */
  Hyper.sim('bph-dissolution-test', {
    title: 'Passing a dissolution test: S1, S2, S3',
    blurb: `A batch of a hypothetical tablet is tested the pharmacopoeial way (as in USP <711>): six units dissolve for 30 minutes, and the batch passes at stage S1 if every unit reaches Q + 5 %. If not, six more are tested (S2: mean of 12 at least Q, none below Q − 15 %), then twelve more (S3: mean of 24 at least Q, no more than two below Q − 15 %, none below Q − 25 %). Each unit's result varies around the batch mean with the spread you set. The graph shows the chance that a batch with a given true mean passes — the test's operating characteristic.

**Try this**
- Test a batch several times at the default settings: most pass at S1, some need S2.
- Move the batch mean down towards Q: S1 almost never passes, but S2 and S3 still accept batches whose mean is at or just above Q.
- Increase the unit-to-unit spread to 10 %: even a good batch starts failing, because single units fall below Q − 15 %. Consistency matters as much as the average.
- Run 1000 batches to see how often each stage is reached — every extra stage costs time and tablets.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Q (monograph, at 30 min)', min: 70, max: 90, step: 1, value: 80, unit: '%' },
        { id: 'mean', label: 'True batch mean at 30 min', min: 60, max: 104, step: 0.5, value: 92, unit: '%' },
        { id: 'sd', label: 'Unit-to-unit spread (SD)', min: 1, max: 12, step: 0.5, value: 4, unit: '%' },
        { type: 'buttons', items: [{ id: 'test', label: 'Test a batch', primary: true }, { id: 'many', label: 'Run 1000 batches' }] }
      ], (id) => { if (id === 'test') testBatch(); else if (id === 'many') runMany(); else { if (id !== 'mean') oc(); drawPlot(); testBatch(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['res', 'Result'], ['m', 'Mean of units tested'], ['low', 'Lowest unit'], ['pp', 'Chance of passing (this mean)'], ['many', '1000 batches: S1 / S2 / S3 / fail']]);
      const plot = kit.plot(gb, { x: { label: 'true batch mean at 30 min (%)', min: 60, max: 104 }, y: { label: 'probability', min: 0, max: 1 }, legend: true }, 180);
      const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
      function judge(u, Q) {
        const s1 = u.slice(0, 6), s2 = u.slice(0, 12), s3 = u;
        if (s1.every(x => x >= Q + 5)) return { stage: 1, pass: true, n: 6, why: 'every unit ≥ Q + 5 = ' + (Q + 5) + ' %' };
        const why1 = s1.filter(x => x < Q + 5).length + ' of 6 below ' + (Q + 5) + ' % → S2';
        if (mean(s2) >= Q && s2.every(x => x >= Q - 15)) return { stage: 2, pass: true, n: 12, why: why1 + '; mean of 12 = ' + f1(mean(s2)) + ' % ≥ Q, none below ' + (Q - 15) + ' %' };
        const why2 = mean(s2) < Q ? 'mean of 12 = ' + f1(mean(s2)) + ' % < Q' : 'a unit below ' + (Q - 15) + ' %';
        const lo15 = s3.filter(x => x < Q - 15).length, ok3 = mean(s3) >= Q && lo15 <= 2 && s3.every(x => x >= Q - 25);
        return { stage: 3, pass: ok3, n: 24, why: why1 + '; ' + why2 + ' → S3: mean of 24 = ' + f1(mean(s3)) + ' %, ' + lo15 + ' below ' + (Q - 15) + ' %' + (ok3 ? '' : ' — fails') };
      }
      const draw24 = rng => Array.from({ length: 24 }, () => clamp(V.mean + V.sd * gauss(rng), 0, 110));
      let seed = 11, units = [], res = null, anim = 1, ocPts = [], ocS1 = [];
      function oc() {
        const rng = B.rng(4242); ocPts = []; ocS1 = [];
        for (let m0 = 60; m0 <= 104; m0 += 1) {
          let pass = 0, s1 = 0;
          for (let r = 0; r < 300; r++) {
            const u = Array.from({ length: 24 }, () => clamp(m0 + V.sd * gauss(rng), 0, 110)), j = judge(u, V.Q);
            if (j.pass) pass++; if (j.pass && j.stage === 1) s1++;
          }
          ocPts.push([m0, pass / 300]); ocS1.push([m0, s1 / 300]);
        }
      }
      function drawPlot() {
        plot.set({ series: [{ pts: ocPts, label: 'passes (any stage)', fill: true }, { pts: ocS1, label: 'passes at S1', dash: [5, 4] }],
          vlines: [{ x: V.Q, label: 'Q' }, { x: V.mean, label: 'this batch' }] });
        const near = ocPts.reduce((b, p) => Math.abs(p[0] - V.mean) < Math.abs(b[0] - V.mean) ? p : b, ocPts[0] || [0, 0]);
        ro.set('pp', pctTxt(near[1], 0));
      }
      function testBatch() {
        units = draw24(B.rng(seed++)); res = judge(units, V.Q); anim = 0;
        const t = units.slice(0, res.n);
        ro.set('res', (res.pass ? 'PASSES at S' + res.stage : 'FAILS at S3') + ' — ' + res.why);
        ro.set('m', f1(mean(t)) + ' % (' + res.n + ' units)');
        ro.set('low', f1(Math.min(...t)) + ' %');
      }
      function runMany() {
        const rng = B.rng(seed++ * 7919), n = [0, 0, 0, 0];
        for (let r = 0; r < 1000; r++) { const j = judge(draw24(rng), V.Q); n[j.pass ? j.stage - 1 : 3]++; }
        ro.set('many', n.join(' / '));
      }
      oc(); drawPlot(); testBatch(); ro.set('many', 'press "Run 1000 batches"');
      const loop = kit.loop((dt) => {
        anim = Math.min(1, anim + dt / 3);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const top = 44, cols = 6, rows = 4, gx = 12, cw = (W - 2 * gx) / cols, rh = (Hh - top - 8) / rows;
        const minute = 30 * anim;
        kit.label(c, 'dissolution at ' + minute.toFixed(0) + ' min of 30', gx, 14, { size: 12.5, weight: 700, color: C.text });
        if (anim >= 1 && res) kit.label(c, res.pass ? 'PASSES at stage S' + res.stage : 'FAILS', W - gx, 14, { size: 14, weight: 800, align: 'right', color: res.pass ? C.ok : C.bad });
        kit.label(c, 'Q = ' + V.Q + ' %   ·   S1 needs every unit ≥ ' + (V.Q + 5) + ' %', gx, 32, { size: 11, color: C.muted });
        const stageOf = i => i < 6 ? 1 : i < 12 ? 2 : 3;
        for (let i = 0; i < 24; i++) {
          const r = Math.floor(i / cols), k = i % cols, x = gx + k * cw + cw * 0.18, w = cw * 0.64, y = top + r * rh + 16, h = rh - 30;
          const tested = res && i < res.n, target = units[i] || 0;
          // a Weibull-shaped rise (b = 1.3) that reaches the unit's result at 30 min
          const td = 30 / Math.pow(-Math.log(1 - clamp(target, 0.1, 99.5) / 100), 1 / 1.3);
          const now = tested ? 100 * (1 - Math.exp(-Math.pow(Math.max(0, minute) / td, 1.3))) * (target > 99.5 ? target / 99.5 : 1) : 0;
          const col = !tested ? C.faint : target < V.Q - 25 ? C.bad : target < V.Q - 15 ? C.warn : target >= V.Q + 5 ? C.ok : C.accent;
          if (k === 0) kit.label(c, 'S' + stageOf(i) + (r === 3 ? '' : ''), gx - 2, y + h / 2, { size: 10.5, weight: 700, color: tested ? C.text : C.faint });
          c.strokeStyle = tested ? C.text : C.faint; c.lineWidth = 1.3; rrect(c, x, y, w, h, 6); c.stroke();
          if (tested) {
            const fh2 = h * clamp(now / 110, 0, 1);
            c.globalAlpha = 0.55; c.fillStyle = col; c.fillRect(x + 1, y + h - fh2, w - 2, fh2); c.globalAlpha = 1;
            const qy = y + h - h * V.Q / 110; c.strokeStyle = C.muted; c.setLineDash([3, 2]); c.beginPath(); c.moveTo(x - 3, qy); c.lineTo(x + w + 3, qy); c.stroke(); c.setLineDash([]);
            kit.label(c, now.toFixed(0) + ' %', x + w / 2, y + h + 9, { align: 'center', size: 10.5, weight: 700, color: anim >= 1 ? col : C.text });
          }
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bph-f2 */
  Hyper.sim('bph-f2', {
    title: 'Comparing two dissolution profiles: f2',
    blurb: `Twelve tablets of a reference product and twelve of a test product dissolve; the dots are the mean percentages at 5, 10, 15, 20, 30, 45 and 60 minutes. Both follow Weibull curves: move the test product's time scale and shape to change how it differs. The similarity factor is computed the regulatory way — only the points up to the first where both products have passed 85 % (unless you switch the rule off), a coefficient-of-variation check on the units, and the shortcut for very rapid dissolution. The bars on the stage are the differences at each time; the gauge is f2.

**Try this**
- Make the test slower by a few minutes of $t_d$: how large a shift keeps f2 above 50?
- Change only the test's shape: an S-shaped curve (b > 1) that crosses the reference can still give f2 above 50 — f2 looks only at mean squared differences.
- Tick "use every time point": the plateau points push f2 up. That is why the rules allow only one point beyond 85 %.
- Raise the unit-to-unit variability: the CV check fails and f2 alone is no longer acceptable (a bootstrap is needed).
- Make both products fast (t_d below 7 min): at 85 % in 15 minutes they are similar without f2.`,
    mount(box, kit) {
      const P = kit.pharma, B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const TIMES = [5, 10, 15, 20, 30, 45, 60];
      const ctl = kit.controls(box.side, [
        { id: 'tdR', label: 'Reference: time to 63 % (t_d)', min: 3, max: 40, step: 0.5, value: 12, unit: 'min' },
        { id: 'tdT', label: 'Test: time to 63 % (t_d)', min: 3, max: 40, step: 0.5, value: 15, unit: 'min' },
        { id: 'bT', label: 'Test: shape b', min: 0.5, max: 2.5, step: 0.05, value: 1 },
        { id: 'var', label: 'Unit-to-unit variability', min: 0, max: 40, step: 1, value: 8, unit: '%' },
        { id: 'all', type: 'check', label: 'Use every time point (ignore the 85 % rule)', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Test 12 new units of each' }] }
      ], (id) => { if (id === 'again') seed++; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f2', 'f2 (≥ 50: similar)'], ['f1', 'f1 (≤ 15: similar)'], ['pts', 'Time points used'], ['cv', 'CV check (≤ 20 % early, ≤ 10 % later)'], ['v', 'Verdict']]);
      const plot = kit.plot(gb, { x: { label: 'time (min)', min: 0, max: 60 }, y: { label: 'dissolved (%)', min: 0, max: 105 }, legend: true }, 210);
      let seed = 3, R = [], T = [], used = [], f2v = 0;
      const weib = (t, td, b) => 100 * (1 - Math.exp(-Math.pow(t / td, b)));
      const units = (td, b, rng) => Array.from({ length: 12 }, () => { const tdu = td * Math.exp(V.var / 100 * gauss(rng)); return TIMES.map(t => weib(t, tdu, b)); });
      function recompute() {
        const rng = B.rng(seed * 97 + 5), uR = units(V.tdR, 1, rng), uT = units(V.tdT, V.bT, rng);
        const stats = u => TIMES.map((_, i) => { const xs = u.map(r => r[i]), m = xs.reduce((a, b) => a + b, 0) / xs.length, sd = Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1)); return { m, cv: m > 0 ? sd / m : 0 }; });
        const sR = stats(uR), sT = stats(uT);
        R = sR.map(s => s.m); T = sT.map(s => s.m);
        used = [];
        for (let i = 0; i < TIMES.length; i++) { used.push(i); if (!V.all && R[i] >= 85 && T[i] >= 85) break; }
        f2v = P.f2(used.map(i => R[i]), used.map(i => T[i]));
        const f1v = 100 * used.reduce((s, i) => s + Math.abs(R[i] - T[i]), 0) / used.reduce((s, i) => s + R[i], 0);
        const cvOK = used.every(i => { const lim = TIMES[i] <= 10 ? 0.2 : 0.1; return sR[i].cv <= lim && sT[i].cv <= lim; });
        const fast = R[2] >= 85 && T[2] >= 85;
        ro.set('f2', f2v.toFixed(1)); ro.set('f1', f1v.toFixed(1));
        ro.set('pts', used.map(i => TIMES[i]).join(', ') + ' min' + (V.all ? ' (rule ignored)' : ''));
        ro.set('cv', cvOK ? 'passes' : 'fails — use a bootstrap or another method');
        ro.set('v', fast ? 'similar without f2: both ≥ 85 % at 15 min'
          : used.length < 3 ? 'too few points before 85 %'
          : V.all ? 'not a valid comparison: too many plateau points'
          : !cvOK ? 'f2 not applicable: units too variable'
          : f2v >= 50 ? 'similar (f2 ≥ 50)' : 'not similar (f2 < 50)');
        const curve = (td, b) => Array.from({ length: 121 }, (_, i) => [i / 2, weib(i / 2, td, b)]);
        plot.set({ series: [
          { pts: curve(V.tdR, 1), label: 'reference', width: 1.4, dash: [4, 3] },
          { pts: curve(V.tdT, V.bT), label: 'test', width: 1.4, dash: [4, 3] },
          { pts: TIMES.map((t, i) => [t, R[i]]), label: 'reference, mean of 12', line: false, dots: 4.5 },
          { pts: TIMES.map((t, i) => [t, T[i]]), label: 'test, mean of 12', line: false, dots: 4.5 }
        ], hlines: [{ y: 85, label: '85 %' }], vlines: used.length ? [{ x: TIMES[used[used.length - 1]], label: 'last point used' }] : [] });
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // difference bars at each time point
        const x0 = 16, x1 = W * 0.58, bw = (x1 - x0) / TIMES.length, base = Hh - 26, top = 30, scale = (base - top) / 25;
        kit.label(c, '|R − T| at each time (percentage points)', x0, 14, { size: 11.5, weight: 700, color: C.text });
        TIMES.forEach((t, i) => {
          const d = Math.abs(R[i] - T[i]), h = Math.min(base - top, d * scale), on = used.includes(i), x = x0 + i * bw + bw * 0.2;
          c.fillStyle = on ? C.accent : C.faint; c.fillRect(x, base - h, bw * 0.6, h);
          kit.label(c, d.toFixed(1), x + bw * 0.3, base - h - 8, { align: 'center', size: 10.5, color: on ? C.text : C.muted });
          kit.label(c, t + '′', x + bw * 0.3, base + 11, { align: 'center', size: 10.5, color: C.muted });
        });
        const ty = base - 10 * scale; c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x0, ty); c.lineTo(x1, ty); c.stroke(); c.setLineDash([]);
        kit.label(c, '10', x0 - 2, ty, { align: 'right', size: 10, color: C.warn });
        // f2 gauge
        const gx0 = W * 0.64, gx1 = W - 20, gy = Hh * 0.55, gw = gx1 - gx0, v = clamp(f2v, 0, 100);
        c.fillStyle = kit.hue(0, 0.25); c.fillRect(gx0, gy - 9, gw * 0.5, 18);
        c.fillStyle = kit.hue(150, 0.3); c.fillRect(gx0 + gw * 0.5, gy - 9, gw * 0.5, 18);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(gx0, gy - 9, gw, 18);
        [0, 25, 50, 75, 100].forEach(k => kit.label(c, String(k), gx0 + gw * k / 100, gy + 20, { align: 'center', size: 10.5, color: C.muted }));
        const nx = gx0 + gw * v / 100;
        c.fillStyle = C.text; c.beginPath(); c.moveTo(nx, gy - 12); c.lineTo(nx - 7, gy - 24); c.lineTo(nx + 7, gy - 24); c.closePath(); c.fill();
        kit.label(c, 'f2 = ' + f2v.toFixed(1), nx, gy - 34, { align: 'center', size: 14, weight: 800, color: f2v >= 50 ? C.ok : C.bad });
        kit.label(c, 'not similar', gx0 + gw * 0.25, gy, { align: 'center', size: 10.5, color: C.text });
        kit.label(c, 'similar', gx0 + gw * 0.75, gy, { align: 'center', size: 10.5, color: C.text });
      }, box.stage);
      recompute();
      loop.start();
    }
  });

  /* ================================================================ bph-ivivc */
  Hyper.sim('bph-ivivc', {
    title: 'Building a Level A IVIVC',
    blurb: `Three extended-release versions of a hypothetical drug — fast, medium and slow — dissolve in the vessels (Weibull curves). In the body each is absorbed like its dissolution curve stretched by a common time-scaling factor, and the plasma levels follow a one-compartment model (100 mg, 50 L). After 6 hours the tablet reaches the colon, which absorbs less well than the small intestine. The solid "observed" curves come from that body; the dashed "predicted" curves come from the IVIVC model — dissolution → time scaling → convolution — which assumes absorption continues as long as release does. On the right, the Levy plot shows the fraction absorbed (Wagner–Nelson, from the observed plasma curves) against the fraction dissolved. Prediction errors of Cmax and AUC decide whether the correlation is validated.

**Try this**
- At the defaults the model predicts all three formulations within a few per cent, and the Levy points lie close to the line of identity.
- Untick "apply the time scaling": the Levy points bow away from the line — the body absorbs more slowly than the vessel dissolves.
- Lower the colon's absorption towards zero — an absorption window: the slow formulation, still releasing when it reaches the colon, loses exposure, its prediction error jumps and internal validation fails. IVIVC needs release, not physiology, to be the limit.
- Move the new formulation's release time: an external test of the model within, and outside, the range it was built on.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 170 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'In vivo time scaling (body ÷ vessel)', min: 0.6, max: 2.5, step: 0.05, value: 1.4 },
        { id: 'half', label: 'Elimination half-life', min: 2, max: 12, step: 0.5, value: 4, unit: 'h' },
        { id: 'b', label: 'Dissolution shape b', min: 0.6, max: 2, step: 0.05, value: 1 },
        { id: 'colon', label: 'Colon absorption (after 6 h), vs small intestine', min: 0, max: 100, step: 5, value: 85, unit: '%' },
        { id: 'tdN', label: 'New formulation: time to 63 % in vitro', min: 1, max: 12, step: 0.5, value: 4.5, unit: 'h' },
        { id: 'scale', type: 'check', label: 'Apply the time scaling on the Levy plot', value: true }
      ], () => recompute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f0', 'Fast: %PE Cmax / AUC'], ['f1', 'Medium: %PE Cmax / AUC'], ['f2', 'Slow: %PE Cmax / AUC'], ['mean', 'Mean |%PE| Cmax / AUC'], ['val', 'Internal validation'], ['new', 'New formulation: %PE Cmax / AUC']]);
      const pC = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 36 }, y: { label: 'plasma (mg/L)', min: 0 }, legend: true }, 220);
      const pL = kit.plot(g2, { x: { label: 'fraction dissolved in vitro (%)', min: 0, max: 100 }, y: { label: 'fraction absorbed in vivo (%)', min: 0, max: 105 }, legend: true }, 220);
      const D = 100, Vd = 50, T = 36, dt = 0.02, TW = 6;
      const FORMS = [{ name: 'fast', td: 1.5 }, { name: 'medium', td: 3 }, { name: 'slow', td: 6 }];
      const Fd = (t, td) => 1 - Math.exp(-Math.pow(Math.max(0, t) / td, V.b));
      const NS = Math.round(T / dt);
      // cumulative fraction of the dose absorbed on the time grid: release scaled by s, reduced by `colon` after TW hours
      function absorbed(td, s, colon) {
        const out = [0]; let F = 0;
        for (let i = 1; i <= NS; i++) { const t = i * dt; F += (Fd(t / s, td) - Fd((t - dt) / s, td)) * (t > TW ? colon : 1); out.push(F); }
        return out;
      }
      // plasma curve by convolution with one-compartment disposition (exact decay per step)
      function plasma(fab, k) {
        const out = [[0, 0]]; let A = 0;
        for (let i = 1; i <= NS; i++) { A = A * Math.exp(-k * dt) + D * (fab[i] - fab[i - 1]) * Math.exp(-k * dt / 2); out.push([i * dt, A / Vd]); }
        return out;
      }
      const metrics = (c, k) => { let cmax = 0, auc = 0; for (let i = 1; i < c.length; i++) { cmax = Math.max(cmax, c[i][1]); auc += (c[i][1] + c[i - 1][1]) / 2 * dt; } return { cmax, auc: auc + c[c.length - 1][1] / k }; };
      const pe = (o, p) => 100 * (o - p) / o;
      let res = [];
      function recompute() {
        const k = Math.LN2 / V.half, s = V.s;
        const all = FORMS.concat([{ name: 'new', td: V.tdN }]);
        res = all.map(f => {
          const obs = plasma(absorbed(f.td, s, V.colon / 100), k), pred = plasma(absorbed(f.td, s, 1), k), mo = metrics(obs, k), mp = metrics(pred, k);
          // Wagner–Nelson on the observed curve, and the matching fraction dissolved
          let auc = 0; const wn = [];
          for (let i = 1; i < obs.length; i++) {
            auc += (obs[i][1] + obs[i - 1][1]) / 2 * dt;
            if (i % 25 === 0 && obs[i][0] <= 24) wn.push([100 * Fd(V.scale ? obs[i][0] / s : obs[i][0], f.td), 100 * (obs[i][1] + k * auc) / (k * mo.auc)]);
          }
          return { f, obs, pred, peC: pe(mo.cmax, mp.cmax), peA: pe(mo.auc, mp.auc), wn };
        });
        const C = kit.colors(), cols = [C.series[0], C.series[1], C.series[2], C.series[3]];
        const thin = pts => pts.filter((_, i) => i % 10 === 0);
        const sC = [], sL = [{ pts: [[0, 0], [100, 100]], label: 'line of identity', color: C.faint, width: 1.2, dash: [4, 4] }];
        res.forEach((r, i) => {
          sC.push({ pts: thin(r.obs), label: r.f.name + ' observed', color: cols[i], width: i === 3 ? 1.6 : 2.2 });
          sC.push({ pts: thin(r.pred), color: cols[i], width: 1.4, dash: [5, 4] });
          sL.push({ pts: r.wn, label: r.f.name, color: cols[i], line: false, dots: 3.5 });
        });
        pC.set({ series: sC });
        pL.set({ series: sL });
        const fmt = r => (r.peC >= 0 ? '+' : '') + r.peC.toFixed(1) + ' % / ' + (r.peA >= 0 ? '+' : '') + r.peA.toFixed(1) + ' %';
        res.forEach((r, i) => ro.set(i < 3 ? 'f' + i : 'new', fmt(r)));
        const mC = res.slice(0, 3).reduce((a, r) => a + Math.abs(r.peC), 0) / 3, mA = res.slice(0, 3).reduce((a, r) => a + Math.abs(r.peA), 0) / 3;
        const each = res.slice(0, 3).every(r => Math.abs(r.peC) <= 15 && Math.abs(r.peA) <= 15);
        ro.set('mean', mC.toFixed(1) + ' % / ' + mA.toFixed(1) + ' %');
        ro.set('val', mC <= 10 && mA <= 10 && each ? 'passes (mean ≤ 10 %, each ≤ 15 %)' : 'fails — the correlation does not hold');
      }
      recompute();
      let clock = 0;
      const loop = kit.loop((dt2) => {
        clock = (clock + dt2 * 3) % 24;                          // three hours a second, looping over a day
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cols = [C.series[0], C.series[1], C.series[2]];
        kit.label(c, 't = ' + clock.toFixed(1) + ' h', 12, 14, { size: 12.5, weight: 700, color: C.text });
        const half = W * 0.55, vw = Math.min(70, half / 4), vh = Hh * 0.62, vy = Hh * 0.25;
        FORMS.forEach((f, i) => {
          const x = 20 + i * (half - 20) / 3 + 10, fr = Fd(clock, f.td);
          c.fillStyle = kit.hue(200, (C.dark ? 0.12 : 0.08) + 0.4 * fr); c.fillRect(x, vy + vh * 0.12, vw, vh * 0.88);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x, vy, vw, vh);
          const tr = 12 * Math.cbrt(Math.max(0, 1 - fr));
          if (tr > 0.5) { c.fillStyle = cols[i]; c.beginPath(); c.ellipse(x + vw / 2, vy + vh - tr - 2, tr * 1.4, tr, 0, 0, 6.283); c.fill(); }
          kit.label(c, f.name + ' ' + (fr * 100).toFixed(0) + ' %', x + vw / 2, vy - 8, { align: 'center', size: 11, weight: 700, color: cols[i] });
        });
        kit.label(c, 'in vitro: dissolved', 20 + (half - 20) / 2, Hh - 8, { align: 'center', size: 10.5, color: C.muted });
        // plasma now, observed, as bars
        const px0 = W * 0.62, bw = (W - px0 - 20) / 3, cmax = Math.max(0.01, ...res.slice(0, 3).map(r => Math.max(...r.obs.map(p => p[1]))));
        res.slice(0, 3).forEach((r, i) => {
          const cNow = r.obs[Math.min(r.obs.length - 1, Math.round(clock / 0.02))][1], h = vh * cNow / cmax, x = px0 + i * bw + bw * 0.25;
          c.fillStyle = cols[i]; c.globalAlpha = 0.7; c.fillRect(x, vy + vh - h, bw * 0.5, h); c.globalAlpha = 1;
          c.strokeStyle = C.faint; c.strokeRect(x, vy, bw * 0.5, vh);
          kit.label(c, cNow.toFixed(2), x + bw * 0.25, vy - 8, { align: 'center', size: 10.5, color: C.text });
        });
        kit.label(c, 'in vivo: plasma (mg/L)', px0 + (W - px0 - 20) / 2, Hh - 8, { align: 'center', size: 10.5, color: C.muted });
        if (clock > TW) kit.label(c, 'tablets now in the colon (' + V.colon + ' % absorption)', W - 12, 14, { align: 'right', size: 11, weight: 700, color: V.colon < 50 ? C.warn : C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bph-be-crossover */
  Hyper.sim('bph-be-crossover', {
    title: 'A bioequivalence study',
    blurb: `A randomised two-period crossover: each volunteer takes the test and the reference product (half in each order), and the AUCs are compared within each person. The analysis — on log-transformed data, as in kit.pharma.be — gives the geometric mean ratio and its 90 % confidence interval, which must lie inside the acceptance limits. The stage stacks the last twenty studies like a forest plot; the graph shows each volunteer's own test/reference ratio. The faint bar is what a parallel study of the same size (different people on each product) would have found. All values are simulated for a hypothetical drug.

**Try this**
- Run several studies at the defaults (true ratio 95 %, within-subject CV 20 %, 24 volunteers): most pass, a few do not — that is the study's power.
- Raise the within-subject CV to 35 %: the intervals widen and many studies fail although the products are the same as before. Increase the number of volunteers to win them back.
- Raise the between-subject CV to 80 %: the crossover interval hardly changes, but the parallel one explodes — why crossover designs are used.
- Set the true ratio to 100 % and the limits to the narrow-therapeutic-index range: good products need precise studies.
- Choose the widened limits for a highly variable drug (CV above 30 %): they grow with the variability, up to 69.84–143.19 % (using the true variability, for simplicity).`,
    mount(box, kit) {
      const P = kit.pharma, B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Volunteers', min: 12, max: 72, step: 2, value: 24 },
        { id: 'gmr', label: 'True test/reference ratio', min: 80, max: 125, step: 1, value: 95, unit: '%' },
        { id: 'cvw', label: 'Within-subject CV', min: 5, max: 60, step: 1, value: 20, unit: '%' },
        { id: 'cvb', label: 'Between-subject CV', min: 10, max: 80, step: 1, value: 40, unit: '%' },
        { id: 'lim', type: 'select', label: 'Acceptance limits', options: [['standard 80.00–125.00 %', 'std'], ['narrow therapeutic index 90.00–111.11 %', 'nti'], ['widened for a highly variable drug (EMA, Cmax)', 'hvd']], value: 'std' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run a study', primary: true }, { id: 'many', label: 'Run 500 studies' }] }
      ], (id) => { if (id === 'many') power(); else { if (id !== 'run') { hist.length = 0; ro.set('pow', 'press "Run 500 studies"'); } runOne(); } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ci', 'GMR (90 % CI)'], ['lim', 'Acceptance limits'], ['v', 'Verdict'], ['cv', 'Estimated within-subject CV'], ['par', 'Parallel design, same size'], ['pow', 'Power (500 studies)']]);
      const plot = kit.plot(gb, { x: { label: 'volunteer (sorted by ratio)', min: 0 }, y: { label: 'test / reference AUC (%)', log: true, min: 40, max: 250 }, legend: true }, 180);
      const limits = () => {
        if (V.lim === 'nti') return [0.9, 1.1111];
        if (V.lim === 'hvd' && V.cvw > 30) { const sw = Math.sqrt(Math.log(1 + Math.pow(Math.min(V.cvw, 50) / 100, 2))), u = Math.exp(0.76 * sw); return [1 / u, u]; }
        return [0.8, 1.25];
      };
      function study(rng) {
        const n = Math.round(V.n / 2) * 2, sw = Math.sqrt(Math.log(1 + Math.pow(V.cvw / 100, 2))), sb = Math.sqrt(Math.log(1 + Math.pow(V.cvb / 100, 2)));
        const test = [], ref = [];
        for (let i = 0; i < n; i++) { const mu = Math.log(100) + sb * gauss(rng); test.push(Math.exp(mu + Math.log(V.gmr / 100) + sw * gauss(rng))); ref.push(Math.exp(mu + sw * gauss(rng))); }
        const r = P.be(test, ref), L = limits();
        const pass = r.lo >= L[0] && r.hi <= L[1] && (V.lim !== 'hvd' || (r.gmr >= 0.8 && r.gmr <= 1.25));
        // the same numbers as a parallel study: half the people on test, the other half on reference
        const lt = test.slice(0, n / 2).map(Math.log), lr = ref.slice(n / 2).map(Math.log);
        const mt = lt.reduce((a, b) => a + b, 0) / lt.length, mr = lr.reduce((a, b) => a + b, 0) / lr.length;
        const ss = lt.reduce((a, x) => a + (x - mt) ** 2, 0) + lr.reduce((a, x) => a + (x - mr) ** 2, 0), sp = Math.sqrt(ss / (n - 2)), se = sp * Math.sqrt(4 / n), t = P.t95(n - 2);
        return { r, pass, test, ref, par: [Math.exp(mt - mr - t * se), Math.exp(mt - mr + t * se)] };
      }
      let seed = 1, cur = null;
      const hist = [];
      function runOne() {
        cur = study(B.rng(seed++ * 131 + 7));
        hist.unshift(cur); if (hist.length > 20) hist.pop();
        const r = cur.r, L = limits();
        ro.set('ci', (r.gmr * 100).toFixed(1) + ' % (' + (r.lo * 100).toFixed(1) + '–' + (r.hi * 100).toFixed(1) + ' %)');
        ro.set('lim', (L[0] * 100).toFixed(2) + '–' + (L[1] * 100).toFixed(2) + ' %');
        ro.set('v', cur.pass ? 'bioequivalent' : 'bioequivalence not shown');
        ro.set('cv', (r.cv * 100).toFixed(1) + ' % (true ' + V.cvw + ' %)');
        ro.set('par', (cur.par[0] * 100).toFixed(1) + '–' + (cur.par[1] * 100).toFixed(1) + ' %');
        const ratios = cur.test.map((x, i) => 100 * x / cur.ref[i]).sort((a, b) => a - b);
        plot.set({ series: [{ pts: ratios.map((y, i) => [i + 1, y]), label: 'each volunteer', line: false, dots: 3.5 }],
          x: { label: 'volunteer (sorted by ratio)', min: 0, max: ratios.length + 1 },
          hlines: [{ y: L[0] * 100, label: (L[0] * 100).toFixed(2) + ' %' }, { y: L[1] * 100, label: (L[1] * 100).toFixed(2) + ' %' }, { y: r.gmr * 100, label: 'GMR', color: C0().accent }] });
      }
      const C0 = () => kit.colors();
      function power() {
        const rng = B.rng(seed++ * 977 + 3); let ok = 0;
        for (let i = 0; i < 500; i++) if (study(rng).pass) ok++;
        ro.set('pow', (ok / 5).toFixed(1) + ' % of studies pass');
      }
      runOne(); ro.set('pow', 'press "Run 500 studies"');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, L = limits();
        const l = 20, r = W - 20, lo = Math.log(0.6), hi = Math.log(1.6), X = v => l + (r - l) * (Math.log(clamp(v, 0.6, 1.6)) - lo) / (hi - lo);
        const top = 28, bot = Hh - 30, rowH = (bot - top) / 21;
        c.fillStyle = kit.hue(150, C.dark ? 0.18 : 0.14); c.fillRect(X(L[0]), top - 6, X(L[1]) - X(L[0]), bot - top + 6);
        c.strokeStyle = C.axis; c.lineWidth = 1;
        [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.6].forEach(v => { c.beginPath(); c.moveTo(X(v), top - 6); c.lineTo(X(v), bot); c.strokeStyle = v === 1 ? C.axis : C.grid; c.stroke(); kit.label(c, Math.round(v * 100) + ' %', X(v), bot + 12, { align: 'center', size: 10.5, color: C.muted }); });
        kit.label(c, 'acceptance range ' + (L[0] * 100).toFixed(2) + '–' + (L[1] * 100).toFixed(2) + ' %', (X(L[0]) + X(L[1])) / 2, 12, { align: 'center', size: 11.5, weight: 700, color: C.text });
        hist.forEach((h, i) => {
          const y = top + rowH * (i + 0.5) + (i ? rowH : 0), col = h.pass ? C.ok : C.bad, w = i ? 1.6 : 3.2;
          if (i === 0) {
            c.strokeStyle = C.muted; c.globalAlpha = 0.6; c.lineWidth = 2; c.setLineDash([4, 3]);
            c.beginPath(); c.moveTo(X(h.par[0]), y + rowH * 0.8); c.lineTo(X(h.par[1]), y + rowH * 0.8); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
            if (h.par[1] > 1.6 || h.par[0] < 0.6) kit.label(c, 'parallel (off scale)', r, y + rowH * 0.8, { align: 'right', size: 10, color: C.muted });
          }
          c.strokeStyle = col; c.lineWidth = w; c.globalAlpha = i ? 0.75 : 1;
          c.beginPath(); c.moveTo(X(h.r.lo), y); c.lineTo(X(h.r.hi), y); c.stroke();
          kit.dot(c, X(h.r.gmr), y, i ? 2.5 : 4.5, col); c.globalAlpha = 1;
          if (i === 0) kit.label(c, 'this study', X(h.r.hi) + 8, y, { size: 11, weight: 700, color: col });
        });
      }, box.stage);
      loop.start();
    }
  });
})();
