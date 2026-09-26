/* HYPER-CHEMISTRY · sims/analysis.js — instruments of analysis: a spectrophotometer with a
 * calibration line (Beer–Lambert), a mass spectrometer showing isotope patterns, an
 * infrared spectrum explorer, and chromatography on a plate and in a column. */
(function () {
  'use strict';

  const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = s => String(s).replace(/\d/g, d => SUB[d]);
  const sup = s => String(s).replace(/\d/g, d => SUP[d]).replace(/-/g, '⁻');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rgba = (q, a) => 'rgba(' + Math.round(q[0]) + ',' + Math.round(q[1]) + ',' + Math.round(q[2]) + ',' + (a == null ? 1 : a).toFixed(3) + ')';
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }
  // the colour of light of a given wavelength (ultraviolet is shown as violet)
  function wlColor(nm) {
    let r = 0, g = 0, b = 0;
    if (nm < 380) return [140, 70, 220];
    if (nm < 440) { r = (440 - nm) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
    else r = 1;
    return [r * 255, g * 255, b * 255];
  }
  const setLabel = (ctl, id, text) => {
    const r = ctl.rows[id], lab = r && r.row && r.row.querySelector && r.row.querySelector('.cl span');
    if (lab) lab.textContent = text;
  };

  /* ================================================================ Beer–Lambert */
  const SUBST = [
    { name: 'NADH at 340 nm (ultraviolet)', eps: 6220, lam: 340, tint: null, cmax: 250 },
    { name: 'Iron(II)–phenanthroline at 510 nm', eps: 11100, lam: 510, tint: [215, 70, 40], cmax: 150 },
    { name: 'Permanganate at 525 nm (ε ≈ 2400)', eps: 2400, lam: 525, tint: [130, 30, 150], cmax: 700 },
    { name: 'Crystal violet at 590 nm', eps: 87000, lam: 590, tint: [105, 40, 190], cmax: 20 }
  ];
  const STRAY = 0.005;

  Hyper.sim('lab-beer-lambert', {
    title: 'Spectrophotometer and calibration line',
    blurb: `Light of one wavelength passes through a cuvette of solution; the detector compares what arrives, $I$, with what went in, $I_0$. Measure a few **standards** of known concentration to build a calibration line, then measure the **unknown**.

- Measure four or five standards across the range: the points fall on a straight line, $A = \\varepsilon l c$.
- Switch to **the unknown, as received**: its absorbance is off the top of the line. Dilute it 1 : 10, measure, and multiply back by 10.
- Tick **Stray light** and measure standards at high concentration or with the 5 cm cell: the line bends over, because a little light always gets round the sample. That is why absorbances above about 1 are avoided.
- Double the path length and watch the transmittance: it is *squared*, while the absorbance only doubles.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const sample0 = params && params.sample != null ? +params.sample : 0;
      let S = SUBST[1];
      const ctl = kit.controls(box.side, [
        { id: 'sub', type: 'select', label: 'Absorbing substance', options: SUBST.map((q, i) => [q.name, i]), value: 1 },
        { id: 'sample', type: 'select', label: 'In the cuvette', options: [['A standard (use the slider)', 0], ['The unknown, as received', 1], ['The unknown, diluted 1 : 5', 5], ['The unknown, diluted 1 : 10', 10], ['The unknown, diluted 1 : 20', 20]], value: sample0 },
        { id: 'x', label: 'Concentration of the standard', min: 0, max: 100, step: 1, value: 40, fmt: p => kit.fmt(p / 100 * S.cmax, 3) + ' µM' },
        { id: 'l', type: 'select', label: 'Path length', options: [['0.10 cm', 0.1], ['0.50 cm', 0.5], ['1.00 cm (standard cuvette)', 1], ['2.00 cm', 2], ['5.00 cm', 5]], value: 1 },
        { id: 'stray', type: 'check', label: 'Stray light (0.5 % of the beam)', value: false },
        { id: 'reveal', type: 'check', label: 'Reveal the unknown', value: false },
        { type: 'buttons', items: [{ id: 'measure', label: 'Measure this standard', primary: true }, { id: 'clear', label: 'Clear the standards' }, { id: 'new', label: 'New unknown' }] }
      ], id => {
        if (id === 'sub') { S = SUBST[V.sub] || SUBST[1]; stds = []; unknown(); ctl.set('x', V.x); }
        if (id === 'l' || id === 'stray') stds = [];
        if (id === 'clear') stds = [];
        if (id === 'new') unknown();
        if (id === 'measure') {
          if (+V.sample !== 0) ctl.set('sample', 0);
          const m = measure();
          if (!stds.some(p => Math.abs(p[0] - m.c) < 1e-9)) stds.push([m.c, m.A]);
        }
        update(); loop.once();
      });
      const ro = kit.readout(box.side, [['c', 'In the cuvette'], ['T', 'Transmittance I/I₀'], ['A', 'Absorbance'], ['read', 'Read from the line'], ['truth', 'The unknown really is']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'concentration (µM)', min: 0 }, y: { label: 'absorbance A', min: 0 } }, 200);
      const V = ctl.values;
      let stds = [], cu = 100;
      function unknown() { cu = (1.8 + 1.2 * Math.random()) / S.eps * 1e6; }       // µM: A of 1.8–3 in a 1 cm cell
      const measured = A => { if (!V.stray) return A; const T = Math.pow(10, -A); return -Math.log10((T + STRAY) / (1 + STRAY)); };
      function measure() {
        const l = +V.l || 1, df = +V.sample;
        const c = df === 0 ? V.x / 100 * S.cmax : cu / df;
        const Atrue = S.eps * l * c * 1e-6;
        const A = Math.min(measured(Atrue), 6);
        return { c, l, df, Atrue, A, T: Math.pow(10, -A) };
      }
      // least-squares line A = m c + b through the standards
      function fit() {
        if (stds.length < 2) return null;
        const n = stds.length, sx = stds.reduce((s, p) => s + p[0], 0), sy = stds.reduce((s, p) => s + p[1], 0);
        const sxx = stds.reduce((s, p) => s + p[0] * p[0], 0), sxy = stds.reduce((s, p) => s + p[0] * p[1], 0);
        const d = n * sxx - sx * sx;
        if (Math.abs(d) < 1e-12) return null;
        const m = (n * sxy - sx * sy) / d;
        return { m, b: (sy - m * sx) / n };
      }
      function update() {
        const m = measure(), F = fit();
        const slope = F ? F.m : S.eps * m.l * 1e-6;
        const icpt = F ? F.b : 0;
        const xmax = Math.max(S.cmax, m.c) * 1.08;
        const Acap = 4;
        const line = (k, b) => { const xe = k > 0 ? Math.min(xmax, (Acap - b) / k) : xmax; return [[0, b], [xe, b + k * xe]]; };
        const series = [{ pts: line(S.eps * m.l * 1e-6, 0), label: 'theory, A = εlc', dash: [5, 4] }];
        if (V.stray) {
          const pts = [];
          for (let i = 0; i <= 80; i++) { const c = xmax * i / 80; pts.push([c, measured(S.eps * m.l * c * 1e-6)]); }
          series.push({ pts, label: 'what the instrument reads' });
        }
        if (stds.length) series.push({ pts: stds.slice(), label: 'standards', line: false, dots: 4.5 });
        if (F) series.push({ pts: line(F.m, F.b), label: 'calibration line' });
        const unk = +V.sample !== 0;
        const cRead = slope > 0 ? (m.A - icpt) / slope : NaN;
        plot.set({
          x: { label: 'concentration in the cuvette (µM)', min: 0, max: xmax },
          y: { label: 'absorbance A', min: 0, max: Math.min(Acap, Math.max(1.2, S.eps * m.l * xmax * 1e-6 * 1.05, m.A * 1.1)) },
          series,
          marks: [{ x: unk ? (Number.isFinite(cRead) ? clamp(cRead, 0, xmax) : 0) : m.c, y: m.A, label: unk ? 'unknown' : 'this sample' }],
          hlines: unk ? [{ y: m.A, label: 'A = ' + m.A.toFixed(3) }] : [],
          vlines: unk && Number.isFinite(cRead) && cRead <= xmax ? [{ x: cRead, label: 'read off' }] : []
        });
        ro.set('c', unk ? 'unknown' + (m.df > 1 ? ', diluted 1 : ' + m.df : '') : kit.fmt(m.c, 3) + ' µM');
        ro.set('T', (m.T * 100 < 0.1 ? m.T.toExponential(1) : kit.fmt(m.T * 100, 3)) + ' %');
        ro.set('A', m.A > 3 ? m.A.toFixed(2) + ' (too dark to trust)' : m.A.toFixed(3));
        if (unk && Number.isFinite(cRead)) {
          const orig = cRead * m.df;
          ro.set('read', kit.fmt(cRead, 3) + ' µM' + (m.df > 1 ? ' × ' + m.df + ' = ' + kit.fmt(orig, 3) + ' µM' : '') + (m.A > 1.5 || cRead > S.cmax ? ' — off the line: dilute' : '') + (F ? '' : ' (theory line: measure standards)'));
        } else ro.set('read', unk ? '—' : 'choose the unknown');
        ro.set('truth', V.reveal ? kit.fmt(cu, 4) + ' µM' : 'hidden');
      }

      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const m = measure();
        const lc = wlColor(S.lam), y = Hh * 0.5, bh = 16;
        const sx = W * 0.08;
        // lamp
        const g = c.createRadialGradient(sx, y, 2, sx, y, 34);
        g.addColorStop(0, rgba(lc, 1)); g.addColorStop(1, rgba(lc, 0));
        c.fillStyle = g; c.beginPath(); c.arc(sx, y, 34, 0, Math.PI * 2); c.fill();
        kit.dot(c, sx, y, 11, rgba(lc, 1), C.text);
        kit.label(c, S.lam + ' nm' + (S.lam < 380 ? ' (UV)' : ''), sx, y + 42, { size: 12, align: 'center', color: C.muted });
        // cuvette
        const cw = 18 + 26 * Math.sqrt(m.l * 5), cx = W * 0.45 - cw / 2, ch = Math.min(120, Hh * 0.6), cy = y - ch * 0.55;
        c.fillStyle = rgba(lc, 0.85); c.fillRect(sx + 12, y - bh / 2, cx - sx - 12, bh);
        kit.label(c, 'I₀', (sx + cx) / 2, y - 20, { size: 13, weight: 650, align: 'center' });
        const a1 = S.eps * m.c * 1e-6;                        // absorbance per cm: sets how deep the colour looks
        const tint = S.tint ? rgba(S.tint, Math.min(0.9, 1 - Math.pow(10, -a1 * 0.8)) + 0.05) : 'rgba(150,185,225,0.18)';
        c.fillStyle = tint; c.fillRect(cx, cy + ch * 0.12, cw, ch * 0.88);
        const N = 24;
        for (let i = 0; i < N; i++) {
          const f = (i + 0.5) / N;
          let I = Math.pow(10, -m.Atrue * f);
          if (V.stray) I = (I + STRAY) / (1 + STRAY);
          c.fillStyle = rgba(lc, 0.85 * I);
          c.fillRect(cx + cw * i / N, y - bh / 2, cw / N + 0.5, bh);
        }
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, cy + ch); c.lineTo(cx + cw, cy + ch); c.lineTo(cx + cw, cy); c.stroke();
        kit.label(c, 'l = ' + m.l.toFixed(2) + ' cm', cx + cw / 2, cy + ch + 14, { size: 12, align: 'center', color: C.muted });
        kit.label(c, +V.sample === 0 ? kit.fmt(m.c, 3) + ' µM' : 'unknown' + (m.df > 1 ? ' ÷ ' + m.df : ''), cx + cw / 2, cy - 12, { size: 12.5, weight: 600, align: 'center' });
        // transmitted beam and detector
        const dx = W * 0.8;
        c.fillStyle = rgba(lc, 0.85 * m.T); c.fillRect(cx + cw, y - bh / 2, dx - cx - cw, bh);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(cx + cw, y - bh / 2, dx - cx - cw, bh);
        kit.label(c, 'I', (cx + cw + dx) / 2, y - 20, { size: 13, weight: 650, align: 'center' });
        c.fillStyle = C.surface; roundRect(c, dx, y - 44, W * 0.18, 88, 8); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'detector', dx + W * 0.09, y - 30, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'T ' + (m.T * 100 < 0.1 ? '<0.1' : (m.T * 100).toFixed(1)) + ' %', dx + W * 0.09, y - 8, { size: 14, weight: 700, align: 'center' });
        kit.label(c, 'A ' + m.A.toFixed(3), dx + W * 0.09, y + 16, { size: 15, weight: 700, align: 'center', color: m.A > 1.5 ? C.warn : C.ok });
        kit.label(c, stds.length + (stds.length === 1 ? ' standard' : ' standards') + ' measured', 12, 14, { size: 12, color: C.muted });
      }
      unknown(); update();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ mass spectrometer */
  const ISO = {
    H: [[1.007825, 0.999885], [2.014102, 0.000115]],
    C: [[12, 0.9893], [13.003355, 0.0107]],
    Cl: [[34.968853, 0.7576], [36.965903, 0.2424]],
    Br: [[78.918338, 0.5069], [80.916291, 0.4931]],
    Hg: [[195.965833, 0.0015], [197.966769, 0.0997], [198.968280, 0.1687], [199.968326, 0.2310], [200.970302, 0.1318], [201.970643, 0.2986], [203.973494, 0.0687]]
  };
  const MSP = [
    ['Cl₂ (chlorine)', { Cl: 2 }], ['Br₂ (bromine)', { Br: 2 }], ['BrCl (bromine chloride)', { Br: 1, Cl: 1 }],
    ['CH₃Cl (chloromethane)', { C: 1, H: 3, Cl: 1 }], ['CH₃Br (bromomethane)', { C: 1, H: 3, Br: 1 }],
    ['CH₂Cl₂ (dichloromethane)', { C: 1, H: 2, Cl: 2 }], ['CHCl₃ (trichloromethane)', { C: 1, H: 1, Cl: 3 }],
    ['CCl₄ (tetrachloromethane)', { C: 1, Cl: 4 }], ['C₆H₆ (benzene)', { C: 6, H: 6 }], ['C₆₀ (buckminsterfullerene)', { C: 60 }],
    ['Hg (mercury atoms)', { Hg: 1 }]
  ];

  Hyper.sim('lab-mass-spec', {
    title: 'Isotope patterns in a mass spectrometer',
    blurb: `Molecular ions are accelerated into a magnetic field, which bends lighter ions more sharply, so each isotopic combination lands at its own place on the detector (the separation is exaggerated here). Below is the resulting mass spectrum, tallest peak set to 100 %.

- **Cl₂**: three peaks at 70, 72 and 74 in about 9 : 6 : 1 — the terms of $(3 + 1)^2$.
- **Br₂**: 1 : 2 : 1, because bromine's two isotopes are almost equally common.
- Slide the chlorine-37 abundance to 50 % and chlorine behaves like bromine; to 0 % and the pattern collapses to one peak.
- **C₆₀**: with sixty carbons the chance that at least one is carbon-13 is almost 50 %, so the M+1 peak is about two-thirds the height of M.
- **Mercury** has seven stable isotopes; the weighted average of their masses is the 200.59 in the periodic table.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 340 });
      const sp0 = params && params.sp != null ? +params.sp : 0;
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Molecule', options: MSP.map((q, i) => [q[0], i]), value: sp0 },
        { id: 'cl', label: 'Abundance of chlorine-37', min: 0, max: 100, step: 0.1, value: 24.24, unit: '%' },
        { id: 'br', label: 'Abundance of bromine-81', min: 0, max: 100, step: 0.1, value: 49.31, unit: '%' },
        { id: 'minor', type: 'check', label: 'Include carbon-13 and deuterium', value: true },
        { type: 'buttons', items: [{ id: 'nat', label: 'Natural abundances', primary: true }] }
      ], id => {
        if (id === 'nat') { ctl.set('cl', 24.24); ctl.set('br', 49.31); }
        shows(); calc(); loop.once();
      });
      const ro = kit.readout(box.side, [['peaks', 'Molecular-ion peaks (m/z: %)'], ['avg', 'Average molar mass'], ['mono', 'Most abundant ion'], ['why', 'Pattern']]);
      const V = ctl.values;
      let peaks = [], ions = [];
      function shows() {
        const f = (MSP[V.sp] || MSP[0])[1];
        ctl.show('cl', !!f.Cl); ctl.show('br', !!f.Br);
      }
      function isotopes(el) {
        if (el === 'Cl') { const b = clamp(V.cl / 100, 0, 1); return [[ISO.Cl[0][0], 1 - b], [ISO.Cl[1][0], b]]; }
        if (el === 'Br') { const b = clamp(V.br / 100, 0, 1); return [[ISO.Br[0][0], 1 - b], [ISO.Br[1][0], b]]; }
        if (!V.minor && (el === 'C' || el === 'H')) return [[ISO[el][0][0], 1]];
        return ISO[el];
      }
      // multiply out the isotope distributions atom by atom, grouping by nominal mass
      function calc() {
        const f = (MSP[V.sp] || MSP[0])[1];
        let dist = new Map([[0, { p: 1, m: 0 }]]);
        for (const [el, n] of Object.entries(f)) {
          const iso = isotopes(el).filter(q => q[1] > 0);
          for (let k = 0; k < n; k++) {
            const next = new Map();
            for (const [nom, q] of dist) for (const [mi, pi] of iso) {
              const key = nom + Math.round(mi), p = q.p * pi;
              if (p < 1e-9) continue;
              const cur = next.get(key) || { p: 0, m: 0 };
              cur.m = (cur.m * cur.p + (q.m + mi) * p) / (cur.p + p);
              cur.p += p;
              next.set(key, cur);
            }
            dist = next;
          }
        }
        const list = [...dist.entries()].map(([nom, q]) => ({ nom, p: q.p, m: q.m })).sort((a, b) => a.nom - b.nom);
        const top = Math.max(...list.map(q => q.p));
        peaks = list.map(q => Object.assign(q, { rel: 100 * q.p / top })).filter(q => q.rel >= 0.05);
        const avg = list.reduce((s, q) => s + q.p * q.m, 0) / list.reduce((s, q) => s + q.p, 0);
        const best = peaks.reduce((a, b) => (b.rel > a.rel ? b : a), peaks[0]);
        ro.set('peaks', peaks.filter(q => q.rel >= 0.5).slice(0, 7).map(q => q.nom + ': ' + q.rel.toFixed(q.rel < 10 ? 1 : 0)).join(' · '));
        ro.set('avg', avg.toFixed(3) + ' g/mol');
        ro.set('mono', 'm/z ' + best.nom + ' (exact ' + best.m.toFixed(4) + ')');
        const nCl = f.Cl || 0, nBr = f.Br || 0;
        ro.set('why', f.Hg ? 'seven isotopes of one atom' : nCl && nBr ? '(³⁵Cl + ³⁷Cl)(⁷⁹Br + ⁸¹Br) multiplied out' : nCl ? '(³⁵Cl + ³⁷Cl)' + (nCl > 1 ? sup(nCl) : '') + ': binomial' : nBr ? '(⁷⁹Br + ⁸¹Br)' + (nBr > 1 ? sup(nBr) : '') + ': binomial' : 'carbon-13: about 1.1 % per carbon atom');
        ions = [];
      }

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        // the instrument: source → accelerator → magnetic sector bending the beams upwards
        const yb = Hh * 0.42, xs = W * 0.06, xe = W * 0.4;
        const lo = peaks.length ? peaks[0].nom : 0, hi = peaks.length ? peaks[peaks.length - 1].nom : 1;
        const r0 = Hh * 0.22, spread = Math.min(W * 0.2, Hh * 0.16);
        const radius = nom => r0 + (hi > lo ? (nom - lo) / (hi - lo) - 0.5 : 0) * spread;
        c.fillStyle = C.surface; roundRect(c, xs - 20, yb - 20, 44, 40, 6); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'ion source', xs + 2, yb + 32, { size: 11, color: C.muted, align: 'center' });
        for (const gx of [xs + 40, xs + 56]) { c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(gx, yb - 18); c.lineTo(gx, yb - 5); c.moveTo(gx, yb + 5); c.lineTo(gx, yb + 18); c.stroke(); }
        kit.label(c, 'accelerate', xs + 48, yb - 28, { size: 11, color: C.muted, align: 'center' });
        // magnet region
        c.fillStyle = kit.hue(250, 0.1);
        c.beginPath(); c.moveTo(xe, yb + 14); c.arc(xe, yb - r0 - spread, r0 + spread + 14 + spread * 0.5, Math.PI / 2, 0, true); c.lineTo(xe, yb + 14); c.fill();
        kit.label(c, 'magnetic field (into the screen)', xe + 10, yb + 26, { size: 11, color: C.muted });
        const maxP = Math.max(1e-9, ...peaks.map(q => q.p));
        const detY = yb - r0 - spread / 2 - 40;
        peaks.forEach((q, i) => {
          if (q.rel < 0.5) return;
          const r = radius(q.nom), col = C.series[i % C.series.length];
          const w = 1 + 5 * q.p / maxP;
          c.strokeStyle = col; c.lineWidth = w; c.globalAlpha = 0.55;
          c.beginPath(); c.moveTo(xs + 24, yb); c.lineTo(xe, yb); c.arc(xe, yb - r, r, Math.PI / 2, 0, true); c.lineTo(xe + r, detY); c.stroke();
          c.globalAlpha = 1;
        });
        // the detector across the landing points
        const land = peaks.filter(q => q.rel >= 0.5).map(q => xe + radius(q.nom));
        if (land.length) {
          const xa = Math.min(...land) - 14, xb = Math.max(...land) + 14;
          c.fillStyle = C.surface; c.fillRect(xa, detY - 8, xb - xa, 8); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(xa, detY - 8, xb - xa, 8);
          kit.label(c, 'detector', xb + 6, detY - 4, { size: 11, color: C.muted });
        }
        // ions: spawned in proportion to abundance, flying along their beams
        if (dt) {
          for (const [i, q] of peaks.entries()) if (q.rel >= 0.5 && Math.random() < dt * 8 * q.p / maxP) ions.push({ i, s: 0 });
          for (const ion of ions) ion.s += dt * 0.45;
          ions = ions.filter(ion => ion.s < 1);
        }
        for (const ion of ions) {
          const q = peaks[ion.i];
          if (!q) continue;
          const r = radius(q.nom), L1 = xe - xs - 24, L2 = Math.PI / 2 * r, L3 = Math.max(0, yb - r - detY), s = ion.s * (L1 + L2 + L3);
          let x, y;
          if (s < L1) { x = xs + 24 + s; y = yb; }
          else if (s < L1 + L2) { const a = (s - L1) / r; x = xe + r * Math.sin(a); y = yb - r + r * Math.cos(a); }
          else { x = xe + r; y = yb - r - (s - L1 - L2); }
          kit.dot(c, x, y, 3, C.series[ion.i % C.series.length]);
        }
        // the spectrum
        const px0 = 56, px1 = W - 20, py0 = Hh * 0.62, py1 = Hh - 34;
        const span = Math.max(4, hi - lo + 4), m0 = lo - 2;
        const X = mz => px0 + (mz - m0) / span * (px1 - px0);
        const Y = rel => py1 - rel / 100 * (py1 - py0);
        c.strokeStyle = C.axis; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(px0, py0 - 6); c.lineTo(px0, py1); c.lineTo(px1, py1); c.stroke();
        for (const v of [0, 50, 100]) { kit.label(c, v + ' %', px0 - 6, Y(v), { size: 10.5, color: C.muted, align: 'right' }); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px0, Y(v)); c.lineTo(px1, Y(v)); c.stroke(); }
        const every = span > 30 ? 5 : span > 14 ? 2 : 1;
        for (let mz = Math.ceil(m0); mz <= m0 + span; mz++) if (mz % every === 0) kit.label(c, String(mz), X(mz), py1 + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'm/z', px1, py1 + 26, { size: 11, color: C.muted, align: 'right' });
        peaks.forEach((q, i) => {
          c.strokeStyle = q.rel >= 0.5 ? C.series[i % C.series.length] : C.faint;
          c.lineWidth = Math.max(2, Math.min(10, (px1 - px0) / span * 0.35));
          c.beginPath(); c.moveTo(X(q.nom), py1); c.lineTo(X(q.nom), Y(q.rel)); c.stroke();
          if (q.rel >= 1) kit.label(c, q.rel.toFixed(q.rel < 10 ? 1 : 0), X(q.nom), Y(q.rel) - 9, { size: 11, weight: 600, align: 'center' });
        });
        kit.label(c, (MSP[V.sp] || MSP[0])[0], 12, 16, { size: 15, weight: 650 });
        kit.label(c, 'beam separation exaggerated', W - 12, 16, { size: 11, color: C.faint, align: 'right' });
      }
      shows(); calc();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ infrared spectra */
  // bands: [wavenumber, half width, peak absorbance, description, bond for the spring model]
  const IR = [
    { name: 'Ethanol', f: 'C₂H₅OH', groups: 'alcohol O–H, C–O', bands: [
      [3340, 150, 1.0, 'O–H stretch, broadened by hydrogen bonding', ['O', 'H', 1]], [2975, 22, 0.9, 'C–H stretch', ['C', 'H', 1]], [2930, 18, 0.5, 'C–H stretch', ['C', 'H', 1]], [2885, 18, 0.45, 'C–H stretch', ['C', 'H', 1]],
      [1450, 18, 0.35, 'C–H bend'], [1380, 14, 0.3, 'C–H bend (CH₃)'], [1090, 16, 0.6, 'C–O stretch', ['C', 'O', 1]], [1050, 16, 1.1, 'C–O stretch', ['C', 'O', 1]], [880, 14, 0.5, 'C–C–O skeletal vibration']] },
    { name: 'Ethanoic acid', f: 'CH₃COOH', groups: 'carboxylic acid O–H, C=O, C–O', bands: [
      [3000, 420, 0.8, 'O–H stretch of the hydrogen-bonded acid dimer: very broad', ['O', 'H', 1]], [1712, 24, 1.4, 'C=O stretch', ['C', 'O', 2]], [1410, 20, 0.5, 'O–H bend and C–H bend'],
      [1290, 26, 0.9, 'C–O stretch', ['C', 'O', 1]], [940, 45, 0.5, 'O–H out-of-plane bend (broad)']] },
    { name: 'Propanone', f: 'CH₃COCH₃', groups: 'ketone C=O', bands: [
      [3005, 14, 0.15, 'C–H stretch', ['C', 'H', 1]], [2925, 14, 0.12, 'C–H stretch', ['C', 'H', 1]], [1715, 18, 1.5, 'C=O stretch of a ketone', ['C', 'O', 2]], [1420, 16, 0.5, 'C–H bend'],
      [1362, 14, 0.8, 'C–H bend (CH₃)'], [1220, 18, 1.0, 'C–C(=O)–C stretch'], [1092, 14, 0.2, 'skeletal vibration'], [530, 18, 0.5, 'C=O bend']] },
    { name: 'Ethyl ethanoate', f: 'CH₃COOC₂H₅', groups: 'ester C=O, C–O', bands: [
      [2985, 20, 0.4, 'C–H stretch', ['C', 'H', 1]], [1742, 20, 1.5, 'C=O stretch of an ester', ['C', 'O', 2]], [1375, 14, 0.6, 'C–H bend (CH₃)'],
      [1240, 26, 1.5, 'C–O stretch (acyl–oxygen)', ['C', 'O', 1]], [1048, 20, 0.9, 'C–O stretch (oxygen–alkyl)', ['C', 'O', 1]], [848, 14, 0.3, 'skeletal vibration']] },
    { name: 'Hexane', f: 'C₆H₁₄', groups: 'alkane C–H only', bands: [
      [2960, 18, 1.2, 'C–H stretch (CH₃)', ['C', 'H', 1]], [2928, 18, 1.3, 'C–H stretch (CH₂)', ['C', 'H', 1]], [2860, 16, 1.0, 'C–H stretch', ['C', 'H', 1]],
      [1465, 16, 0.6, 'C–H bend (CH₂ scissoring)'], [1380, 11, 0.35, 'C–H bend (CH₃)'], [725, 11, 0.3, 'CH₂ rocking of a chain of four or more']] },
    { name: 'Hex-1-ene', f: 'CH₂=CHC₄H₉', groups: 'alkene C=C, =C–H', bands: [
      [3080, 14, 0.3, '=C–H stretch (above 3000: an alkene)', ['C', 'H', 1]], [2960, 18, 1.0, 'C–H stretch', ['C', 'H', 1]], [2928, 18, 1.0, 'C–H stretch', ['C', 'H', 1]], [2860, 16, 0.7, 'C–H stretch', ['C', 'H', 1]],
      [1642, 14, 0.5, 'C=C stretch', ['C', 'C', 2]], [1465, 16, 0.45, 'C–H bend'], [990, 11, 0.6, '=C–H bend of a vinyl group'], [910, 11, 0.9, '=CH₂ wag of a vinyl group']] },
    { name: 'Ethanenitrile', f: 'CH₃CN', groups: 'nitrile C≡N', bands: [
      [3000, 14, 0.2, 'C–H stretch', ['C', 'H', 1]], [2942, 14, 0.25, 'C–H stretch', ['C', 'H', 1]], [2253, 11, 0.9, 'C≡N stretch', ['C', 'N', 3]], [1445, 14, 0.4, 'C–H bend'],
      [1375, 11, 0.5, 'C–H bend (CH₃)'], [1040, 11, 0.4, 'CH₃ rock'], [918, 10, 0.3, 'C–C stretch', ['C', 'C', 1]]] },
    { name: 'Propylamine', f: 'CH₃CH₂CH₂NH₂', groups: 'primary amine N–H', bands: [
      [3370, 35, 0.45, 'N–H stretch (asymmetric): two bands for NH₂', ['N', 'H', 1]], [3290, 35, 0.4, 'N–H stretch (symmetric)', ['N', 'H', 1]], [2960, 18, 1.0, 'C–H stretch', ['C', 'H', 1]], [2930, 18, 0.8, 'C–H stretch', ['C', 'H', 1]],
      [2875, 18, 0.7, 'C–H stretch', ['C', 'H', 1]], [1605, 28, 0.35, 'N–H bend (NH₂ scissoring)'], [1465, 16, 0.4, 'C–H bend'], [1072, 18, 0.3, 'C–N stretch', ['C', 'N', 1]], [800, 60, 0.6, 'N–H wag (broad)']] },
    { name: 'Benzaldehyde', f: 'C₆H₅CHO', groups: 'aromatic ring, aldehyde C=O and C–H', bands: [
      [3065, 14, 0.3, 'aromatic C–H stretch', ['C', 'H', 1]], [2820, 11, 0.35, 'aldehyde C–H stretch (one of a pair)', ['C', 'H', 1]], [2740, 11, 0.35, 'aldehyde C–H stretch (the other)', ['C', 'H', 1]],
      [1702, 18, 1.5, 'C=O stretch, lowered by conjugation with the ring', ['C', 'O', 2]], [1597, 9, 0.6, 'aromatic C=C stretch', ['C', 'C', 2]], [1584, 9, 0.4, 'aromatic C=C stretch', ['C', 'C', 2]], [1455, 11, 0.5, 'aromatic ring stretch'],
      [1310, 14, 0.4, 'C–H bend'], [1205, 14, 0.6, 'C–C(=O) stretch'], [828, 11, 0.5, 'ring vibration'], [746, 11, 0.9, 'aromatic C–H out-of-plane bend'], [688, 11, 0.8, 'ring bend']] },
    { name: 'Methylbenzene', f: 'C₆H₅CH₃', groups: 'aromatic ring', bands: [
      [3030, 14, 0.4, 'aromatic C–H stretch', ['C', 'H', 1]], [2920, 14, 0.4, 'C–H stretch of CH₃', ['C', 'H', 1]], [1605, 9, 0.35, 'aromatic C=C stretch', ['C', 'C', 2]], [1495, 9, 0.6, 'aromatic C=C stretch', ['C', 'C', 2]],
      [1460, 11, 0.4, 'C–H bend'], [1080, 9, 0.2, 'ring vibration'], [730, 11, 1.2, 'aromatic C–H out-of-plane bend'], [695, 9, 1.0, 'ring bend']] },
    { name: 'Carbon dioxide gas', f: 'CO₂', groups: 'IR-active stretch and bend only', inactive: [1388, 'symmetric stretch: IR-inactive'], bands: [
      [2349, 18, 1.5, 'asymmetric O=C=O stretch — the dipole changes', ['C', 'O', 2]], [667, 11, 1.0, 'O=C=O bend']] },
    { name: 'Methane gas', f: 'CH₄', groups: 'C–H only', bands: [
      [3019, 28, 0.8, 'C–H stretch', ['C', 'H', 1]], [1306, 18, 0.7, 'C–H bend']] }
  ];
  const CHART = [
    [3200, 3550, 'O–H alcohol', 210, 0], [2500, 3300, 'O–H acid', 190, 1], [3300, 3500, 'N–H', 280, 1], [2850, 3100, 'C–H', 30, 0],
    [2100, 2260, 'C≡N / C≡C', 130, 0], [1680, 1750, 'C=O', 350, 0], [1620, 1680, 'C=C', 90, 1], [1000, 1300, 'C–O', 50, 1], [400, 1500, 'fingerprint', 240, 2]
  ];

  Hyper.sim('lab-ir', {
    title: 'Infrared spectrum explorer',
    blurb: `The spectra of twelve compounds, drawn from their characteristic bands (the positions are typical values; real spectra carry more fine detail). Point at a dip to name it; click it to set that bond vibrating in the corner — slowed down by a factor of about $10^{13}$.

- Compare **ethanol**, **ethanoic acid** and **ethyl ethanoate**: O–H without C=O, a huge O–H *with* C=O, and C=O with no O–H at all.
- Bonds to hydrogen sit on the left, above about 2700 cm⁻¹; click a C–H stretch and then a C–O stretch and watch the difference in speed.
- **Hexane** and **hex-1-ene** differ by the weak C=C at 1640 and the =C–H just above 3000.
- **Carbon dioxide** shows only two bands: its symmetric stretch does not change the dipole, so it cannot absorb.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const m0 = params && params.mol != null ? +params.mol : 0;
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Compound', options: IR.map((q, i) => [q.name, i]), value: m0 },
        { id: 'chart', type: 'check', label: 'Correlation chart', value: true },
        { id: 'labels', type: 'check', label: 'Label the strong bands', value: true },
        { type: 'buttons', items: [{ id: 'next', label: 'Next band', primary: true }, { id: 'none', label: 'Clear selection' }] }
      ], id => {
        if (id === 'mol') sel = -1;
        if (id === 'next') { const n = mol().bands.length; sel = n ? (sel + 1) % n : -1; }
        if (id === 'none') sel = -1;
        describe(); loop.once();
      });
      const ro = kit.readout(box.side, [['mol', 'Compound'], ['groups', 'Groups it shows'], ['band', 'Selected band'], ['pos', 'Position']]);
      const V = ctl.values;
      let sel = -1, hover = null, phase = 0;
      const mol = () => IR[V.mol] || IR[0];
      const geo = () => { const W = st.W, Hh = st.H; return { x0: 50, x1: W - 16, y0: V.chart ? 74 : 34, y1: Hh - 40 }; };
      const X = (g, nu) => g.x0 + (4000 - nu) / 3600 * (g.x1 - g.x0);
      const absAt = nu => mol().bands.reduce((s, b) => s + b[2] * Math.exp(-Math.LN2 * Math.pow((nu - b[0]) / b[1], 2)), 0);
      function nearest(px) {
        const g = geo(), bs = mol().bands;
        let best = -1, bd = 26;
        bs.forEach((b, i) => { const d = Math.abs(X(g, b[0]) - px); if (d < bd && b[2] > 0.1) { bd = d; best = i; } });
        return best;
      }
      function describe() {
        const M = mol();
        ro.set('mol', M.name + ', ' + M.f);
        ro.set('groups', M.groups);
        const b = M.bands[sel];
        ro.set('band', b ? b[3] : 'click a dip');
        ro.set('pos', b ? b[0] + ' cm⁻¹ = ' + (1e4 / b[0]).toFixed(2) + ' µm' : '—');
      }

      function drawSpring(c, C, b, x, y, w) {
        const [e1, e2, order] = b[4];
        const A1 = kit.chem.el(e1), A2 = kit.chem.el(e2);
        const m1 = A1.mass, m2 = A2.mass;
        const f = b[0] / 1500;                                   // displayed oscillations per second
        const amp = 10, s = Math.sin(phase * 2 * Math.PI * f);
        const d1 = -amp * s * m2 / (m1 + m2), d2 = amp * s * m1 / (m1 + m2);
        const r1 = 7 + (A1.r || 70) / 12, r2 = 7 + (A2.r || 70) / 12;
        const xa = x + w * 0.28 + d1, xb = x + w * 0.72 + d2;
        c.fillStyle = C.surface; roundRect(c, x, y, w, 84, 8); c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath();
        const n = 7 + 3 * (order || 1);
        for (let i = 0; i <= n; i++) { const t = i / n, px = xa + r1 + (xb - r2 - xa - r1) * t, py = y + 38 + (i % 2 ? -6 : 6) * (i > 0 && i < n ? 1 : 0); if (i) c.lineTo(px, py); else c.moveTo(px, py); }
        c.stroke();
        for (const [xx, r, el] of [[xa, r1, A1], [xb, r2, A2]]) { c.beginPath(); c.arc(xx, y + 38, r, 0, Math.PI * 2); c.fillStyle = el.color; c.fill(); c.strokeStyle = 'rgba(0,0,0,.5)'; c.stroke(); }
        kit.label(c, e1, xa, y + 38, { size: 11, weight: 700, align: 'center', color: '#111' });
        kit.label(c, e2, xb, y + 38, { size: 11, weight: 700, align: 'center', color: '#111' });
        kit.label(c, 'real: ' + (b[0] * 2.998e10 / 1e13).toFixed(1) + ' × 10¹³ Hz', x + w / 2, y + 72, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, (order === 3 ? 'triple' : order === 2 ? 'double' : 'single') + ' bond', x + w / 2, y + 12, { size: 10.5, color: C.muted, align: 'center' });
      }

      function frame(dt) {
        phase += dt || 0;
        const C = kit.colors();
        const c = st.begin();
        const g = geo(), M = mol();
        // correlation chart lanes
        if (V.chart) {
          for (const [a, b, lab, hue, lane] of CHART) {
            const xa = X(g, b), xb = X(g, a), y = 8 + lane * 20;
            c.fillStyle = kit.hue(hue, 0.22); c.fillRect(xa, y, xb - xa, 16);
            c.fillStyle = kit.hue(hue, 0.07); c.fillRect(xa, g.y0, xb - xa, g.y1 - g.y0);
            kit.label(c, lab, (xa + xb) / 2, y + 8, { size: 10.5, weight: 600, align: 'center' });
          }
        }
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x0, g.y1); c.lineTo(g.x1, g.y1); c.stroke();
        for (let nu = 4000; nu >= 500; nu -= 500) {
          const x = X(g, nu);
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke();
          kit.label(c, String(nu), x, g.y1 + 12, { size: 10.5, color: C.muted, align: 'center' });
        }
        kit.label(c, 'wavenumber (cm⁻¹)', g.x1, g.y1 + 28, { size: 11, color: C.muted, align: 'right' });
        for (const t of [0, 50, 100]) kit.label(c, t + '%', g.x0 - 6, g.y1 - t / 100 * (g.y1 - g.y0), { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'T', g.x0 - 30, (g.y0 + g.y1) / 2, { size: 11, color: C.muted });
        // the spectrum
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        for (let px = g.x0; px <= g.x1; px += 1) {
          const nu = 4000 - (px - g.x0) / (g.x1 - g.x0) * 3600;
          const T = Math.pow(10, -absAt(nu));
          const y = g.y1 - T * (g.y1 - g.y0) * 0.96;
          if (px === g.x0) c.moveTo(px, y); else c.lineTo(px, y);
        }
        c.stroke();
        if (M.inactive) {
          const x = X(g, M.inactive[0]);
          c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x, g.y0 + 4); c.lineTo(x, g.y1); c.stroke(); c.setLineDash([]);
          kit.label(c, M.inactive[0] + ': ' + M.inactive[1], x + 6, g.y0 + 60, { size: 11, color: C.muted });
        }
        const yOf = nu => g.y1 - Math.pow(10, -absAt(nu)) * (g.y1 - g.y0) * 0.96;
        if (V.labels) {
          const shown = [];
          M.bands.filter(b => b[2] >= 0.8).forEach(b => {
            const x = X(g, b[0]);
            if (shown.some(s => Math.abs(s - x) < 34)) return;
            shown.push(x);
            kit.label(c, String(b[0]), x, Math.min(g.y1 - 8, yOf(b[0]) + 12), { size: 10.5, weight: 600, align: 'center', color: C.text, bg: C.bg2 });
          });
        }
        // hover and selection
        const hi = hover ? nearest(hover.x) : -1;
        if (hi >= 0 && hi !== sel) {
          const b = M.bands[hi], x = X(g, b[0]);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke();
          kit.label(c, b[0] + ' cm⁻¹: ' + b[3], clamp(x, g.x0 + 150, g.x1 - 150), g.y0 + 12, { size: 11.5, align: 'center', bg: C.surface });
        }
        const b = M.bands[sel];
        if (b) {
          const x = X(g, b[0]);
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke();
          kit.dot(c, x, yOf(b[0]), 5, C.warn);
          if (b[4]) drawSpring(c, C, b, g.x1 - 170, g.y1 - 100, 160);
        }
        kit.label(c, M.name + '  ' + M.f, g.x0 + 8, g.y0 + (V.chart ? -8 : -14), { size: 13, weight: 650 });
      }
      describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      kit.click(st, p => { sel = nearest(p.x); describe(); loop.once(); }, p => { hover = p; loop.once(); return nearest(p.x) >= 0; });
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ chromatography */
  // p: how strongly each component holds to the polar stationary phase (0 = not at all)
  const MIXES = [
    { name: 'Leaf pigments on silica', parts: [['β-carotene', 0.05, [242, 140, 28]], ['pheophytin', 0.3, [125, 127, 90]], ['chlorophyll a', 0.48, [47, 143, 91]], ['chlorophyll b', 0.58, [143, 184, 67]], ['xanthophylls', 0.72, [232, 201, 58]]] },
    { name: 'Black marker ink (three dyes)', parts: [['yellow dye', 0.25, [232, 192, 32]], ['magenta dye', 0.45, [216, 48, 138]], ['blue dye', 0.62, [47, 95, 208]]] },
    { name: 'Two very similar compounds', parts: [['compound A', 0.40, [106, 90, 205]], ['compound B', 0.445, [32, 160, 160]]] }
  ];
  const kOf = (p, P) => Math.pow(10, 2.5 * (p - P) - 0.3);      // retention factor: stationary / mobile time

  Hyper.sim('lab-chromatography', {
    title: 'Chromatography: plate and column',
    blurb: `Each component spends part of its time held by the polar stationary phase and part carried by the solvent; it only moves while it is carried. Its retention factor $k$ — time held over time carried — sets its speed: on a plate $R_f = 1/(1 + k)$, in a column $t_R = t_M(1 + k)$.

- **Develop** the leaf extract: orange carotene, which barely sticks, runs near the front; the chlorophylls and yellow xanthophylls stay behind.
- Make the solvent more polar and run again: everything moves further, because the solvent now competes for the silica.
- Switch to the **column** and run the two very similar compounds. With few plates the peaks merge; raise the plate number or change the solvent until $R_s$ passes 1.5.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Method', options: [['Thin-layer plate', 0], ['Column with a detector', 1]], value: params && params.mode != null ? +params.mode : 0 },
        { id: 'mix', type: 'select', label: 'Sample', options: MIXES.map((m, i) => [m.name, i]), value: 0 },
        { id: 'P', label: 'Solvent polarity', min: 0, max: 1, step: 0.01, value: 0.3, fmt: v => Math.round(v * 100) + ' % polar solvent' },
        { id: 'N', label: 'Column efficiency (plates)', min: 100, max: 20000, value: 1500, log: true, sig: 2 },
        { id: 'meas', type: 'check', label: 'Show the measurements', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Develop / run', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'run') { if (done()) reset(); running = true; }
        else if (id === 'reset' || id === 'mix' || id === 'mode' || id === 'P' || id === 'N') reset();
        ctl.show('N', V.mode === 1); ctl.show('meas', V.mode === 0);
        loop.once();
      });
      const ro = kit.readout(box.side, [['a', 'Component values'], ['sep', 'Separation']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'time (min)', min: 0 }, y: { label: 'detector signal', min: 0 } }, 150);
      const V = ctl.values;
      const tM = 1.0;                                                // column dead time, minutes
      let t = 0, running = false, trace = [], lastT = -1;
      const mix = () => MIXES[V.mix] || MIXES[0];
      const comps = () => mix().parts.map(([name, p, col]) => { const k = kOf(p, V.P); return { name, col, k, Rf: 1 / (1 + k), tR: tM * (1 + k) }; });
      const tEnd = () => Math.min(60, Math.max(...comps().map(q => q.tR)) * 1.15 + 0.5);
      const done = () => (V.mode === 0 ? t >= 1 : t >= tEnd());
      function reset() { t = 0; running = false; trace = []; lastT = -1; replot(); }
      // plate: how each component's Rf depends on the solvent; column: the chromatogram so far
      function replot() {
        if (V.mode === 0) {
          const series = mix().parts.map(([name, p, col]) => {
            const pts = [];
            for (let i = 0; i <= 50; i++) { const P = i / 50; pts.push([P * 100, 1 / (1 + kOf(p, P))]); }
            return { pts, label: name, color: rgba(col, 1) };
          });
          plot.set({ x: { label: 'polar solvent in the eluent (%)', min: 0, max: 100 }, y: { label: 'Rf', min: 0, max: 1 }, series, vlines: [{ x: V.P * 100, label: 'your solvent' }] });
        } else {
          plot.set({ x: { label: 'time (min)', min: 0, max: tEnd() }, y: { label: 'detector signal', min: 0 }, series: [{ pts: trace.slice(), label: 'chromatogram', fill: true }],
            vlines: comps().map(q => ({ x: q.tR, label: q.name })).filter(v => v.x <= t) });
        }
      }
      // the detector signal at time u: a Gaussian for each component, width from the plate number
      const signal = (u, cs) => cs.reduce((s, q) => { const sg = q.tR / Math.sqrt(Math.max(1, V.N)); return s + Math.exp(-0.5 * Math.pow((u - q.tR) / sg, 2)) / (sg * Math.sqrt(2 * Math.PI)); }, 0);

      function readouts(cs) {
        if (V.mode === 0) {
          ro.set('a', cs.map(q => q.name + ' ' + (t > 0.02 ? q.Rf.toFixed(2) : '—')).join(', ') + ' (Rf)');
          const rf = cs.map(q => q.Rf).sort((a, b) => a - b);
          let gap = 1;
          for (let i = 1; i < rf.length; i++) gap = Math.min(gap, rf[i] - rf[i - 1]);
          ro.set('sep', rf.length > 1 ? 'closest spots differ by ' + gap.toFixed(3) + ' in Rf' : '—');
        } else {
          ro.set('a', cs.map(q => q.name + ' k = ' + kit.fmt(q.k, 2) + ', t = ' + q.tR.toFixed(2) + ' min').join('; '));
          const s = cs.slice().sort((a, b) => a.tR - b.tR);
          let worst = Infinity;
          for (let i = 1; i < s.length; i++) {
            const s1 = s[i - 1].tR / Math.sqrt(V.N), s2 = s[i].tR / Math.sqrt(V.N);
            worst = Math.min(worst, (s[i].tR - s[i - 1].tR) / (2 * (s1 + s2)));
          }
          ro.set('sep', Number.isFinite(worst) ? 'worst pair Rs = ' + worst.toFixed(2) + (worst >= 1.5 ? ' (baseline separated)' : ' (overlapping)') : '—');
        }
      }

      function drawPlate(c, C, cs) {
        const W = st.W, Hh = st.H;
        const pw = Math.min(260, W * 0.36), ph = Hh - 40, px = W * 0.3 - pw / 2, py = 20;
        const base = py + ph - 36, top = py + 14, L = base - top;
        // solvent tank level
        c.fillStyle = kit.hue(200, 0.14); c.fillRect(px - 20, py + ph - 20, pw + 40, 20);
        c.fillStyle = C.surface; c.fillRect(px, py, pw, ph);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(px, py, pw, ph);
        const front = L * Math.sqrt(Math.min(1, t)) * 0.98;
        c.fillStyle = kit.hue(200, 0.1); c.fillRect(px + 1, base - front, pw - 2, py + ph - (base - front) - 1);
        c.strokeStyle = C.muted; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(px, base); c.lineTo(px + pw, base); c.stroke(); c.setLineDash([]);
        kit.label(c, 'start line (pencil)', px + pw + 8, base, { size: 11, color: C.muted });
        if (t > 0.02) { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(px, base - front); c.lineTo(px + pw, base - front); c.stroke(); kit.label(c, 'solvent front', px + pw + 8, base - front, { size: 11, color: C.accent }); }
        const xs = px + pw / 2;
        cs.forEach(q => {
          const d = q.Rf * front, sg = 4 + 2.2 * Math.sqrt(d / 10);
          const g = c.createRadialGradient(xs, base - d, 1, xs, base - d, sg * 2);
          g.addColorStop(0, rgba(q.col, 0.95)); g.addColorStop(1, rgba(q.col, 0));
          c.fillStyle = g; c.beginPath(); c.ellipse(xs, base - d, sg * 2.4, sg * 2, 0, 0, Math.PI * 2); c.fill();
        });
        if (V.meas && t > 0.05) {
          kit.arrow(c, px + 14, base, px + 14, base - front, C.accent, 1.3);
          cs.forEach((q, i) => {
            const y = base - q.Rf * front, x = px + pw - 16 - (i % 3) * 14;
            kit.arrow(c, x, base, x, y, rgba(q.col, 1), 1.3);
          });
        }
        // legend and values
        const lx = W * 0.58;
        kit.label(c, mix().name, lx, 30, { size: 14, weight: 650 });
        cs.slice().sort((a, b) => b.Rf - a.Rf).forEach((q, i) => {
          const y = 60 + i * 24;
          kit.dot(c, lx + 7, y, 7, rgba(q.col, 1), 'rgba(0,0,0,.4)');
          kit.label(c, q.name, lx + 20, y, { size: 12.5 });
          kit.label(c, t > 0.02 ? 'Rf ' + q.Rf.toFixed(2) : '', W - 16, y, { size: 12.5, weight: 650, align: 'right' });
        });
        kit.label(c, 'Rf = spot distance ÷ front distance', lx, 60 + cs.length * 24 + 16, { size: 11.5, color: C.muted });
      }

      function drawColumn(c, C, cs) {
        const W = st.W, Hh = st.H;
        const cx = W * 0.18, cw = 34, top = 30, bot = Hh - 50, L = bot - top;
        c.fillStyle = C.surface; c.fillRect(cx - cw / 2, top, cw, L);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(cx - cw / 2, top, cw, L);
        kit.label(c, 'solvent in', cx, top - 14, { size: 11, color: C.muted, align: 'center' });
        kit.arrow(c, cx, top - 6, cx, top + 6, C.muted, 1.5);
        cs.forEach(q => {
          const pos = t / q.tR;                                   // fraction of the column travelled
          if (pos <= 0 || pos >= 1.05) return;
          const y = top + L * Math.min(pos, 1), sg = Math.max(2, L * Math.sqrt(Math.max(pos, 0.01)) / Math.sqrt(V.N) * 1.2);
          const g = c.createLinearGradient(0, y - 2.5 * sg, 0, y + 2.5 * sg);
          g.addColorStop(0, rgba(q.col, 0)); g.addColorStop(0.5, rgba(q.col, 0.9)); g.addColorStop(1, rgba(q.col, 0));
          c.fillStyle = g; c.fillRect(cx - cw / 2 + 2, Math.max(top, y - 2.5 * sg), cw - 4, Math.min(bot, y + 2.5 * sg) - Math.max(top, y - 2.5 * sg));
        });
        c.fillStyle = C.bg2; c.strokeStyle = C.text; roundRect(c, cx - 26, bot + 6, 52, 22, 5); c.fill(); c.stroke();
        kit.label(c, 'detector', cx, bot + 17, { size: 10.5, align: 'center' });
        const lx = W * 0.34;
        kit.label(c, mix().name + ' — t = ' + t.toFixed(2) + ' min', lx, 30, { size: 14, weight: 650 });
        cs.slice().sort((a, b) => a.tR - b.tR).forEach((q, i) => {
          const y = 60 + i * 24;
          kit.dot(c, lx + 7, y, 7, rgba(q.col, 1), 'rgba(0,0,0,.4)');
          kit.label(c, q.name, lx + 20, y, { size: 12.5 });
          kit.label(c, 'k = ' + kit.fmt(q.k, 2) + '   t_R = ' + q.tR.toFixed(2) + ' min', W - 16, y, { size: 12.5, weight: 600, align: 'right' });
        });
        kit.label(c, 't_R = t_M (1 + k), with t_M = ' + tM.toFixed(1) + ' min', lx, 60 + cs.length * 24 + 16, { size: 11.5, color: C.muted });
      }

      function frame(dt) {
        const cs = comps();
        if (running && dt) {
          if (V.mode === 0) t = Math.min(1, t + dt / 9);
          else t = Math.min(tEnd(), t + dt * tEnd() / 12);
          if (done()) running = false;
        }
        if (V.mode === 1 && t - lastT > tEnd() / 300) {
          for (let u = Math.max(0, lastT); u <= t; u += tEnd() / 300) trace.push([u, signal(u, cs)]);
          lastT = t;
          replot();
        }
        const C = kit.colors();
        const c = st.begin();
        if (V.mode === 0) drawPlate(c, C, cs); else drawColumn(c, C, cs);
        readouts(cs);
      }
      ctl.show('N', V.mode === 1); ctl.show('meas', V.mode === 0);
      replot();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
