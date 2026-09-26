/* HYPER-PHYSICS · sims/quantum.js — simulations for the quantum branch:
 * blackbody spectrum, photoelectric effect, Compton scattering, electrons through
 * two slits, wave packets, the Bohr atom, quantum wells and tunnelling.
 * Everything sits inside one closure so helper names cannot clash with other files. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- constants (SI) */
  const PLANCK = 6.62607015e-34, HBAR = 1.054571817e-34, LIGHT = 299792458, QE = 1.602176634e-19;
  const ME = 9.1093837015e-31, MP = 1.67262192369e-27, KB = 1.380649e-23, SIGMA = 5.670374419e-8, WIEN = 2.897771955e-3;
  const HC_EVNM = PLANCK * LIGHT / QE * 1e9;          // 1239.84 eV·nm
  const LAMBDA_C = PLANCK / (ME * LIGHT);              // 2.426 pm
  const MEC2_KEV = ME * LIGHT * LIGHT / QE / 1e3;      // 511 keV
  const HBAR_EVFS = HBAR / QE * 1e15;                  // 0.6582 eV·fs
  const H2M_EVNM2 = HBAR * HBAR / (2 * ME) / QE * 1e18; // ħ²/2mₑ = 0.0381 eV·nm²

  const font = () => getComputedStyle(document.body).fontFamily;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const fmt = (v, s) => Hyper.util.fmt(v, s || 3);

  /* The colour of monochromatic light, as an hsla() string; null outside 380–780 nm. */
  const HUES = [[380, 272], [420, 258], [455, 235], [480, 205], [500, 175], [520, 130], [555, 85], [575, 58], [595, 38], [620, 16], [660, 2], [780, 0]];
  function specHue(nm) {
    let h = 0;
    for (let i = 1; i < HUES.length; i++) {
      if (nm <= HUES[i][0]) {
        const a = HUES[i - 1], b = HUES[i];
        h = a[1] + (b[1] - a[1]) * (nm - a[0]) / (b[0] - a[0]);
        break;
      }
    }
    return h;
  }
  function specColor(nm, alpha) {
    if (!(nm >= 380 && nm <= 780)) return null;
    const edge = nm < 420 ? (nm - 380) / 40 : nm > 680 ? (780 - nm) / 100 : 1;
    const L = 25 + 28 * clamp(edge, 0, 1);
    return 'hsla(' + specHue(nm).toFixed(0) + ',95%,' + L.toFixed(0) + '%,' + (alpha == null ? 1 : alpha) + ')';
  }
  /* a bright colour for drawing a photon or ray of wavelength nm, readable on the theme's background;
     ultraviolet is shown violet-grey and infrared dull red */
  function rayColor(nm, alpha, dark) {
    const a = alpha == null ? 1 : alpha;
    if (nm < 380) return 'hsla(282,55%,' + (dark ? 70 : 50) + '%,' + a + ')';
    if (nm > 780) return 'hsla(8,55%,' + (dark ? 58 : 42) + '%,' + a + ')';
    return 'hsla(' + specHue(nm).toFixed(0) + ',92%,' + (dark ? 62 : 44) + '%,' + a + ')';
  }

  /* Planck's law, W·m⁻²·sr⁻¹ per metre of wavelength */
  function planck(lm, T) {
    if (!(lm > 0) || !(T > 0)) return 0;
    const x = PLANCK * LIGHT / (lm * KB * T);
    if (x > 700) return 0;
    return 2 * PLANCK * LIGHT * LIGHT / Math.pow(lm, 5) / Math.expm1(x);
  }
  /* approximate colour of a blackbody (CIE matching functions as sums of Gaussians -> sRGB) */
  function bbColor(T) {
    const g = (l, m, s1, s2) => { const s = l < m ? s1 : s2; return Math.exp(-0.5 * ((l - m) / s) * ((l - m) / s)); };
    let X = 0, Y = 0, Z = 0;
    for (let l = 380; l <= 780; l += 5) {
      const B = planck(l * 1e-9, T);
      X += B * (1.056 * g(l, 599.8, 37.9, 31.0) + 0.362 * g(l, 442.0, 16.0, 26.7) - 0.065 * g(l, 501.1, 20.4, 26.2));
      Y += B * (0.821 * g(l, 568.8, 46.9, 40.5) + 0.286 * g(l, 530.9, 16.3, 31.1));
      Z += B * (1.217 * g(l, 437.0, 11.8, 36.0) + 0.681 * g(l, 459.0, 26.0, 13.8));
    }
    let r = 3.2406 * X - 1.5372 * Y - 0.4986 * Z, gg = -0.9689 * X + 1.8758 * Y + 0.0415 * Z, b = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
    r = Math.max(0, r); gg = Math.max(0, gg); b = Math.max(0, b);
    const mx = Math.max(r, gg, b);
    if (!(mx > 0) || !Number.isFinite(mx)) return 'rgb(120,0,0)';
    const gam = v => { v /= mx; return Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)); };
    return 'rgb(' + gam(r) + ',' + gam(gg) + ',' + gam(b) + ')';
  }

  /* axes with nice ticks inside a box; returns the mapping functions */
  function axes(c, C, box, xr, yr, o) {
    o = o || {};
    const X = x => box.x0 + (x - xr[0]) / (xr[1] - xr[0]) * (box.x1 - box.x0);
    const Y = y => box.y1 - (y - yr[0]) / (yr[1] - yr[0]) * (box.y1 - box.y0);
    c.save();
    c.font = '11px ' + font();
    c.lineWidth = 1;
    const sx = o.xstep || Hyper.niceStep(xr[1] - xr[0], o.nx || 6), sy = o.ystep || Hyper.niceStep(yr[1] - yr[0], o.ny || 5);
    c.strokeStyle = C.grid; c.fillStyle = C.muted;
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let v = Math.ceil(xr[0] / sx) * sx; v <= xr[1] + sx * 1e-6; v += sx) {
      const px = Math.round(X(v)) + 0.5;
      c.beginPath(); c.moveTo(px, box.y0); c.lineTo(px, box.y1); c.stroke();
      if (o.xticks !== false) c.fillText((o.fx || fmt)(Math.abs(v) < sx * 1e-6 ? 0 : v), px, box.y1 + 4);
    }
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(yr[0] / sy) * sy; v <= yr[1] + sy * 1e-6; v += sy) {
      const py = Math.round(Y(v)) + 0.5;
      c.beginPath(); c.moveTo(box.x0, py); c.lineTo(box.x1, py); c.stroke();
      c.fillText((o.fy || fmt)(Math.abs(v) < sy * 1e-6 ? 0 : v), box.x0 - 5, py);
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    const zy = yr[0] < 0 && yr[1] > 0 ? Y(0) : box.y1;
    c.beginPath(); c.moveTo(box.x0, zy); c.lineTo(box.x1, zy); c.moveTo(box.x0, box.y0); c.lineTo(box.x0, box.y1); c.stroke();
    c.fillStyle = C.text2 || C.text;
    c.font = '600 11.5px ' + font();
    if (o.xlabel) { c.textAlign = 'right'; c.textBaseline = 'bottom'; c.fillText(o.xlabel, box.x1, box.y1 + 32); }
    if (o.ylabel) { c.save(); c.translate(box.x0 - (o.ylabelGap || 46), box.y0); c.rotate(-Math.PI / 2); c.textAlign = 'right'; c.textBaseline = 'top'; c.fillText(o.ylabel, 0, 0); c.restore(); }
    c.restore();
    return { X, Y };
  }

  /* a wavy photon from (x1, y1) along angle a for length len, wavelength wl in px */
  function wiggle(c, x1, y1, a, len, wl, amp, color, width, phase) {
    if (!(len > 1) || !(wl > 0.5)) return;
    const ca = Math.cos(a), sa = Math.sin(a);
    c.save(); c.strokeStyle = color; c.lineWidth = width || 2; c.beginPath();
    const n = Math.max(8, Math.ceil(len / 2));
    for (let i = 0; i <= n; i++) {
      const s = len * i / n;
      const env = Math.sin(Math.PI * i / n);
      const w = amp * env * Math.sin(2 * Math.PI * s / wl + (phase || 0));
      const x = x1 + ca * s - sa * w, y = y1 + sa * s + ca * w;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke(); c.restore();
  }

  /* ================================================================ blackbody */
  Hyper.sim('qm-blackbody', {
    title: 'Blackbody spectrum',
    blurb: `The curve is Planck's law for the temperature you choose; the dashed line is the classical Rayleigh–Jeans prediction, which runs off to infinity at short wavelengths. The coloured band is visible light.

- Slide the temperature up: every wavelength gets brighter and the peak moves left (Wien's law).
- **Keep** the curve at 5772 K (the Sun), then look at 2800 K (a filament lamp): how much of the lamp's output is visible?
- Pick *Human body* and the widest range: the peak sits near 9 µm.
- Watch the ratio "classical ÷ Planck" at 500 nm — tiny for hot bodies, astronomical for cool ones.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6 });
      const PRESETS = [['— choose —', 0], ['Human body (310 K)', 310], ['Stove ring (900 K)', 900], ['Candle flame soot (1900 K)', 1900],
                       ['Filament lamp (2800 K)', 2800], ['Sun\'s surface (5772 K)', 5772], ['Sirius (9940 K)', 9940]];
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 250, max: 15000, value: 5772, unit: 'K', log: true, sig: 3 },
        { id: 'preset', type: 'select', label: 'Example', options: PRESETS, value: 0 },
        { id: 'range', type: 'select', label: 'Wavelength range', options: [['0 – 2.5 µm', 2500], ['0 – 10 µm', 10000], ['0 – 40 µm', 40000]], value: 2500 },
        { id: 'rj', type: 'check', label: 'Classical prediction (Rayleigh–Jeans)', value: true },
        { type: 'buttons', items: [{ id: 'keep', label: 'Keep this curve' }, { id: 'clear', label: 'Clear kept curves' }] }
      ], (id, v) => {
        if (id === 'preset' && v > 0) {
          ctl.set('T', v);
          ctl.set('range', v < 1000 ? 40000 : v < 2000 ? 10000 : 2500);
        }
        if (id === 'keep' && kept.length < 6 && !kept.some(k => Math.abs(k - V.T) < 0.5)) kept.push(V.T);
        if (id === 'clear') kept = [];
        dirty = true;
      });
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['peak', 'Peak wavelength'], ['j', 'Power per m² (σT⁴)'], ['vis', 'Visible share (380–750 nm)'], ['rj', 'Classical ÷ Planck at 500 nm']]);
      const V = ctl.values;
      let kept = [], dirty = true, lastTheme = '';
      st.onResize(() => { dirty = true; });

      function visibleShare(T) {
        let s = 0;
        const n = 200, a = 380e-9, b = 750e-9;
        for (let i = 0; i < n; i++) s += planck(a + (b - a) * (i + 0.5) / n, T);
        s *= (b - a) / n;
        return s / (SIGMA * Math.pow(T, 4) / Math.PI);
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const T = clamp(V.T, 100, 1e5);
        const range = V.range;                         // nm
        const box = { x0: 66, x1: st.W - 16, y0: 16, y1: st.H - 40 };
        const N = Math.max(100, Math.floor(box.x1 - box.x0));
        const Bnm = (nm, t) => planck(nm * 1e-9, t) * 1e-9;   // per nm of wavelength
        // vertical scale: highest point of any curve in range
        let ymax = 0;
        for (const t of kept.concat([T])) for (let i = 1; i <= N; i++) ymax = Math.max(ymax, Bnm(range * i / N, t));
        if (!(ymax > 0)) ymax = 1;
        ymax *= 1.12;
        const ax = axes(c, C, box, [0, range / 1000], [0, ymax], {
          xlabel: 'wavelength (µm)', ylabel: 'radiance (W m⁻² sr⁻¹ nm⁻¹)', ylabelGap: 58,
          fy: v => fmt(v, 2)
        });
        const X = nm => ax.X(nm / 1000), Y = ax.Y;
        c.save();
        c.beginPath(); c.rect(box.x0, box.y0 - 2, box.x1 - box.x0, box.y1 - box.y0 + 2); c.clip();
        // visible band: coloured fill under the curve
        for (let nm = 380; nm < 750; nm += 2) {
          const xa = X(nm), xb = X(nm + 2);
          if (xa > box.x1) break;
          const yb = Y(Bnm(nm + 1, T));
          c.fillStyle = specColor(nm + 1, 0.55);
          c.fillRect(xa, yb, Math.max(1, xb - xa + 0.4), box.y1 - yb);
          c.fillStyle = specColor(nm + 1, 0.9);
          c.fillRect(xa, box.y1 - 5, Math.max(1, xb - xa + 0.4), 5);
        }
        // kept curves
        kept.forEach((t, i) => {
          c.strokeStyle = C.series[(i + 1) % C.series.length]; c.lineWidth = 1.6; c.setLineDash([]);
          c.beginPath();
          for (let k = 1; k <= N; k++) { const nm = range * k / N; const px = X(nm), py = Y(Bnm(nm, t)); k > 1 ? c.lineTo(px, py) : c.moveTo(px, py); }
          c.stroke();
        });
        // classical curve
        if (V.rj) {
          c.strokeStyle = C.bad; c.lineWidth = 1.8; c.setLineDash([6, 5]);
          c.beginPath();
          let started = false;
          for (let k = 1; k <= N; k++) {
            const nm = range * k / N, lm = nm * 1e-9;
            const b = 2 * LIGHT * KB * T / Math.pow(lm, 4) * 1e-9;
            const py = Math.max(box.y0 - 50, Y(b));
            if (!started) { c.moveTo(X(nm), py); started = true; } else c.lineTo(X(nm), py);
          }
          c.stroke(); c.setLineDash([]);
        }
        // Planck curve
        c.strokeStyle = C.text; c.lineWidth = 2.4;
        c.beginPath();
        for (let k = 1; k <= N; k++) { const nm = range * k / N; const px = X(nm), py = Y(Bnm(nm, T)); k > 1 ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        c.restore();
        // Wien peak
        const peak = WIEN / T * 1e9;
        if (peak < range) {
          const px = X(peak), py = Y(Bnm(peak, T));
          c.save(); c.setLineDash([3, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(px, py); c.lineTo(px, box.y1); c.stroke(); c.restore();
          kit.dot(c, px, py, 4, C.accent);
          kit.label(c, 'peak ' + (peak < 1000 ? peak.toFixed(0) + ' nm' : fmt(peak / 1000, 3) + ' µm'), px + 8, Math.max(box.y0 + 10, py - 10), { size: 12, color: C.accent, weight: 600 });
        } else kit.label(c, 'peak at ' + fmt(peak / 1000, 3) + ' µm, off to the right →', box.x1 - 6, box.y0 + 12, { size: 12, align: 'right', color: C.accent });
        if (V.rj) {
          // where the classical curve leaves the top of the plot
          const lexit = Math.pow(2 * LIGHT * KB * T * 1e-9 / ymax, 0.25) * 1e9;
          const lx = Math.min(X(Math.max(lexit, range * 0.02)) + 8, box.x1 - 150);
          kit.label(c, '← classical, heading to ∞', lx, box.y0 + 12, { size: 11.5, color: C.bad });
        }
        kept.forEach((t, i) => kit.label(c, 'kept: ' + fmt(t, 4) + ' K', box.x1 - 6, box.y0 + 46 + 16 * i, { size: 11, align: 'right', color: C.series[(i + 1) % C.series.length] }));
        // the colour of the glow (below about 750 K there is none to speak of)
        const cx = box.x1 - 30, cy = box.y0 + 20, glow = T >= 750;
        const col = glow ? bbColor(T) : (C.dark ? '#1a0806' : '#2a1210');
        c.save(); if (glow) { c.shadowColor = col; c.shadowBlur = 14; }
        kit.dot(c, cx, cy, 13, col, C.border2);
        c.restore();
        kit.label(c, glow ? 'colour' : 'no visible glow', cx - 20, cy, { size: 11, align: 'right', color: C.muted });
        // numbers
        ro.set('T', fmt(T, 4) + ' K (' + fmt(T - 273.15, 4) + ' °C)');
        ro.set('peak', peak < 1000 ? peak.toFixed(0) + ' nm' : fmt(peak / 1000, 3) + ' µm');
        ro.set('j', fmt(SIGMA * Math.pow(T, 4), 3) + ' W/m²');
        const vs = visibleShare(T);
        ro.set('vis', vs < 1e-4 ? fmt(vs * 100, 2) + ' %' : (vs * 100).toFixed(vs < 0.01 ? 3 : 1) + ' %');
        const x = HC_EVNM / (500 * KB * T / QE);
        ro.set('rj', fmt(Math.expm1(x) / x, 3));
      }
      const loop = kit.loop(() => {
        const theme = kit.colors().bg2 + kit.colors().text;
        if (dirty || theme !== lastTheme) { lastTheme = theme; dirty = false; draw(); }
      }, box.stage).start();
      loop.once();
    }
  });

  /* ================================================================ photoelectric effect */
  Hyper.sim('qm-photoelectric', {
    title: 'Photoelectric effect',
    blurb: `Light falls on a metal plate in a vacuum tube. Each photon can free at most one electron; the collector voltage can speed the electrons up or turn them back. The graph below plots the maximum kinetic energy against frequency for each metal.

- Choose zinc and red light, then turn the intensity to 100 %: nothing happens. Now ultraviolet at 5 %.
- Above threshold, change the intensity: the current changes, the electrons' energy does not.
- Make the collector negative until the current just stops: that is the stopping voltage, equal to $K_{\\max}/e$.
- All the lines on the graph are parallel. Their slope is Planck's constant.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '6px 10px 10px';
      box.stage.appendChild(graphBox);
      const METALS = [['Caesium (φ = 2.1 eV)', 2.1], ['Sodium (φ = 2.28 eV)', 2.28], ['Calcium (φ = 2.87 eV)', 2.87], ['Zinc (φ = 4.3 eV)', 4.3], ['Copper (φ = 4.7 eV)', 4.7], ['Platinum (φ = 5.65 eV)', 5.65]];
      const ctl = kit.controls(box.side, [
        { id: 'lam', label: 'Wavelength', min: 150, max: 750, step: 1, value: 400, unit: 'nm' },
        { id: 'I', label: 'Intensity', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'phi', type: 'select', label: 'Metal', options: METALS, value: 2.28 },
        { id: 'V', label: 'Collector voltage', min: -4, max: 4, step: 0.05, value: 0, unit: 'V' }
      ], () => { updateGraph(); });
      const ro = kit.readout(box.side, [['E', 'Photon energy'], ['f', 'Frequency'], ['K', 'Max. kinetic energy'], ['Vs', 'Stopping voltage'], ['i', 'Current']]);
      const V = ctl.values;
      const plot = kit.plot(graphBox, { x: { label: 'frequency (THz)', min: 0, max: 2100 }, y: { label: 'K max (eV)', min: -6, max: 9 } }, 200);
      const PMAX = 1e-3, QEFF = 0.01;        // 1 mW of light at 100 %, 1 % quantum efficiency

      const physics = () => {
        const E = HC_EVNM / V.lam;                       // eV
        const K = E - V.phi;
        const Nph = PMAX * V.I / 100 / (E * QE);         // photons per second
        const isat = K > 0 ? QEFF * Nph * QE : 0;        // A
        const frac = K <= 0 ? 0 : V.V >= 0 ? 1 : clamp(1 + V.V / K, 0, 1);
        return { E, K, f: E * QE / PLANCK, isat, i: isat * frac, frac };
      };
      function updateGraph() {
        const C = kit.colors();
        const series = [];
        for (const [name, phi] of METALS) {
          const f0 = phi * QE / PLANCK / 1e12;
          const sel = Math.abs(phi - V.phi) < 1e-9;
          if (sel) {
            series.push({ pts: [[0, -phi], [f0, 0]], color: C.accent, width: 1.6, dash: [5, 4] });
            series.push({ pts: [[f0, 0], [2100, 2100e12 * PLANCK / QE - phi]], color: C.accent, width: 2.8, label: name.split(' (')[0] });
          } else series.push({ pts: [[f0, 0], [2100, 2100e12 * PLANCK / QE - phi]], color: C.faint, width: 1.2 });
        }
        const p = physics();
        plot.set({ series, marks: [{ x: p.f / 1e12, y: Math.max(0, p.K), color: rayColor(V.lam, 1, C.dark), label: p.K > 0 ? 'K = ' + p.K.toFixed(2) + ' eV' : 'no electrons' }],
                   vlines: [{ x: V.phi * QE / PLANCK / 1e12, color: C.muted }], hlines: [{ y: 0, color: C.axis, dash: [1, 0] }] });
      }
      updateGraph();

      let photons = [], electrons = [], acc = 0;
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const p = physics();
        // geometry of the tube (left 62 %) and the I–V graph (right)
        const tubeR = W * 0.6;
        const cath = { x: W * 0.2, y0: Hh * 0.24, y1: Hh * 0.7 };
        const anode = { x: W * 0.52 };
        const lamp = { x: W * 0.05, y: Hh * 0.12 };
        // glass envelope
        c.save();
        c.strokeStyle = C.border2; c.lineWidth = 2; c.fillStyle = C.dark ? 'rgba(140,170,255,.05)' : 'rgba(80,110,200,.05)';
        c.beginPath(); c.roundRect ? c.roundRect(W * 0.14, Hh * 0.17, W * 0.44, Hh * 0.6, 26) : c.rect(W * 0.14, Hh * 0.17, W * 0.44, Hh * 0.6); c.fill(); c.stroke();
        // plates
        c.fillStyle = C.text2 || C.text;
        c.fillRect(cath.x - 5, cath.y0, 8, cath.y1 - cath.y0);
        c.fillRect(anode.x - 3, cath.y0, 8, cath.y1 - cath.y0);
        c.restore();
        kit.label(c, 'metal', cath.x - 1, cath.y1 + 12, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'collector', anode.x, cath.y1 + 12, { align: 'center', size: 11, color: C.muted });
        // circuit: battery and ammeter under the tube
        const yb = Hh * 0.9;
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.5;
        const bx = W * 0.315;
        c.beginPath(); c.moveTo(cath.x, cath.y1); c.lineTo(cath.x, yb); c.lineTo(bx - 5, yb);
        c.moveTo(bx + 5, yb); c.lineTo(anode.x + 1, yb); c.lineTo(anode.x + 1, cath.y1); c.stroke();
        // battery: the long plate is +, on the collector's side when V > 0
        const plusRight = V.V >= 0;
        c.lineWidth = 2.5; c.strokeStyle = C.text;
        c.beginPath(); c.moveTo(bx - 5, yb - (plusRight ? 6 : 12)); c.lineTo(bx - 5, yb + (plusRight ? 6 : 12));
        c.moveTo(bx + 5, yb - (plusRight ? 12 : 6)); c.lineTo(bx + 5, yb + (plusRight ? 12 : 6)); c.stroke();
        c.restore();
        kit.label(c, (V.V >= 0 ? '+' : '−') + Math.abs(V.V).toFixed(2) + ' V', bx, yb - 20, { align: 'center', size: 11.5, color: C.text, weight: 600 });
        // ammeter
        const ax = W * 0.43;
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillStyle = C.surface || C.bg2;
        c.beginPath(); c.arc(ax, yb, 11, 0, Math.PI * 2); c.fill(); c.stroke(); c.restore();
        kit.label(c, 'A', ax, yb + 0.5, { align: 'center', size: 11, weight: 700, color: C.text });
        kit.label(c, fmt(p.i * 1e6, 3) + ' µA', ax, yb - 20, { align: 'center', size: 11.5, color: p.i > 0 ? C.ok : C.muted, weight: 600 });
        // the lamp and its beam
        const col = rayColor(V.lam, 1, C.dark);
        const target = { x: cath.x - 5, y: (cath.y0 + cath.y1) / 2 };
        c.save();
        c.fillStyle = rayColor(V.lam, 0.06 + 0.2 * V.I / 100, C.dark);
        c.beginPath(); c.moveTo(lamp.x + 10, lamp.y); c.lineTo(target.x, cath.y0 + 10); c.lineTo(target.x, cath.y1 - 10); c.lineTo(lamp.x + 10, lamp.y + 16); c.closePath(); c.fill();
        c.restore();
        kit.dot(c, lamp.x, lamp.y + 8, 11, col, C.border2);
        kit.label(c, V.lam < 380 ? 'UV' : V.lam + ' nm', lamp.x, lamp.y + 30, { align: 'center', size: 11, color: C.muted });
        // spawn photons (a visual rate, proportional to the photon flux)
        const rate = 45 * (V.I / 100) * (V.lam / 450);
        acc += rate * dt;
        while (acc >= 1) {
          acc -= 1;
          const yT = cath.y0 + 12 + Math.random() * (cath.y1 - cath.y0 - 24);
          photons.push({ s: 0, yT });
        }
        const flight = 0.55;
        for (const ph of photons) ph.s += dt / flight;
        for (const ph of photons) if (ph.s >= 1) {
          if (p.K > 0 && Math.random() < 0.45) {
            const K0 = p.K * Math.random();
            electrons.push({ s: 0, u: 0.9 * Math.sqrt(K0), y: ph.yT, age: 0, back: false });
          }
        }
        photons = photons.filter(ph => ph.s < 1);
        for (const ph of photons) {
          const x = lamp.x + 10 + (target.x - lamp.x - 10) * ph.s;
          const y = lamp.y + 8 + (ph.yT - lamp.y - 8) * ph.s;
          kit.dot(c, x, y, 2.6, col);
        }
        // electrons: s'' = A V with A = B²/2, B = 0.9, so that K(s) = K0 + V s (in eV)
        const A = 0.405;
        for (const e of electrons) {
          const n = 4, h = dt / n;
          for (let k = 0; k < n; k++) { e.u += A * V.V * h; e.s += e.u * h; }
          e.age += dt;
        }
        electrons = electrons.filter(e => e.s >= 0 && e.s <= 1 && e.age < 8);
        if (electrons.length > 400) electrons.splice(0, electrons.length - 400);
        for (const e of electrons) kit.dot(c, cath.x + 4 + (anode.x - cath.x - 8) * e.s, e.y, 3, C.accent);
        // I–V graph on the right
        const gb = { x0: tubeR + 40, x1: W - 12, y0: Hh * 0.12, y1: Hh * 0.78 };
        const imax = Math.max(1e-12, QEFF * (PMAX / ((HC_EVNM / V.lam) * QE)) * QE) * 1e6;   // µA at full intensity
        const g = axes(c, C, gb, [-4, 4], [0, imax * 1.15], { xlabel: 'collector voltage (V)', ylabel: 'current (µA)', ylabelGap: 34, nx: 4, ny: 4, fy: v => fmt(v, 2) });
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        for (let k = 0; k <= 80; k++) {
          const v = -4 + 8 * k / 80;
          const fr = p.K <= 0 ? 0 : v >= 0 ? 1 : clamp(1 + v / p.K, 0, 1);
          const px = g.X(v), py = g.Y(p.isat * fr * 1e6);
          k ? c.lineTo(px, py) : c.moveTo(px, py);
        }
        c.stroke(); c.restore();
        kit.dot(c, g.X(V.V), g.Y(p.i * 1e6), 5, C.bad, C.surface);
        if (p.K > 0 && p.K < 4) {
          kit.label(c, '−Vs', g.X(-p.K) - 5, gb.y1 - 12, { align: 'right', size: 11, color: C.bad, weight: 600 });
        }
        // readouts
        ro.set('E', p.E.toFixed(2) + ' eV');
        ro.set('f', fmt(p.f / 1e12, 4) + ' THz');
        ro.set('K', p.K > 0 ? p.K.toFixed(2) + ' eV' : 'none: hf < φ');
        ro.set('Vs', p.K > 0 ? p.K.toFixed(2) + ' V' : '—');
        ro.set('i', fmt(p.i * 1e6, 3) + ' µA');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Compton scattering */
  Hyper.sim('qm-compton', {
    title: 'Compton scattering',
    blurb: `A photon strikes a free electron at rest. The scattered photon leaves at the angle you set with a longer wavelength; the electron recoils. The triangle on the right shows momentum conservation, $\\vec p = \\vec p\\,' + \\vec p_e$.

- Sweep the angle from 0° to 180°: the shift follows $\\lambda_C(1 - \\cos\\theta)$, up to 4.85 pm.
- Compare molybdenum X-rays with caesium gamma rays at 180°: the same shift in picometres, but a huge change in energy for the gamma ray.
- Try visible light: the shift is still 2.4 pm at 90°, which is nothing next to 500 nm.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '6px 10px 10px';
      box.stage.appendChild(graphBox);
      const SRC = [['Mo Kα X-rays (71.1 pm)', 71.1], ['Cu Kα X-rays (154 pm)', 154.1], ['100 keV X-rays (12.4 pm)', 12.4], ['Cs-137 gamma rays (1.87 pm)', 1.873], ['Green light (500 nm)', 500000]];
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Scattering angle θ', min: 0, max: 180, step: 1, value: 90, unit: '°' },
        { id: 'lam', type: 'select', label: 'Incoming photons', options: SRC, value: 71.1 },
        { id: 'tri', type: 'check', label: 'Show momentum triangle', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Fire again', primary: true }] }
      ], id => { if (id === 'go') t = 0; updateGraph(); });
      const ro = kit.readout(box.side, [['l', 'λ in'], ['l2', 'λ out'], ['dl', 'Shift Δλ'], ['E', 'Energy in'], ['E2', 'Energy out'], ['K', 'Electron gets'], ['phi', 'Electron angle']]);
      const V = ctl.values;
      const plot = kit.plot(graphBox, { x: { label: 'scattering angle θ (°)', min: 0, max: 180 }, y: { label: 'Δλ (pm)', min: 0, max: 5.2 } }, 170);
      const curve = [];
      for (let k = 0; k <= 90; k++) { const a = 2 * k; curve.push([a, LAMBDA_C * 1e12 * (1 - Math.cos(a * Math.PI / 180))]); }
      function calc() {
        const th = V.th * Math.PI / 180;
        const l = V.lam * 1e-12, l2 = l + LAMBDA_C * (1 - Math.cos(th));
        const p = PLANCK / l, p2 = PLANCK / l2;
        const pex = p - p2 * Math.cos(th), pey = -p2 * Math.sin(th);
        return { th, l, l2, p, p2, pex, pey, pe: Math.hypot(pex, pey), phi: Math.atan2(-pey, pex), E: HC_EVNM / (l * 1e9), E2: HC_EVNM / (l2 * 1e9) };
      }
      function updateGraph() {
        const q = calc();
        plot.set({ series: [{ pts: curve, label: 'λ_C(1 − cos θ)' }], marks: [{ x: V.th, y: (q.l2 - q.l) * 1e12, label: fmt((q.l2 - q.l) * 1e12, 3) + ' pm' }] });
      }
      updateGraph();
      const eV = e => e >= 1e6 ? fmt(e / 1e6, 4) + ' MeV' : e >= 1e3 ? fmt(e / 1e3, 4) + ' keV' : fmt(e, 3) + ' eV';
      const len = m => m >= 1e-6 ? fmt(m * 1e9, 5) + ' nm' : fmt(m * 1e12, 4) + ' pm';
      let t = 0;
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const q = calc();
        t += dt;
        if (t > 3.2) t = 0;
        const ex = W * (V.tri ? 0.34 : 0.45), ey = Hh * 0.52;
        const wl = 16, wl2 = clamp(16 * q.l2 / q.l, 4, 80);
        const inLen = ex - 30;
        // guide lines
        c.save(); c.setLineDash([4, 5]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(20, ey); c.lineTo(Math.min(W - 20, ex + 170), ey); c.stroke();
        c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + 170 * Math.cos(q.th), ey - 170 * Math.sin(q.th)); c.stroke();
        if (q.pe > 0) { c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex + 150 * Math.cos(q.phi), ey + 150 * Math.sin(q.phi)); c.stroke(); }
        c.restore();
        // angle arcs
        c.save(); c.strokeStyle = C.series[1]; c.lineWidth = 1.5;
        c.beginPath(); c.arc(ex, ey, 34, -q.th, 0); c.stroke();
        c.strokeStyle = C.series[2];
        if (q.pe > 0) { c.beginPath(); c.arc(ex, ey, 26, 0, q.phi); c.stroke(); }
        c.restore();
        kit.label(c, 'θ', ex + 40 * Math.cos(q.th / 2), ey - 40 * Math.sin(q.th / 2), { size: 13, color: C.series[1], weight: 700, align: 'center' });
        if (q.pe > 0) kit.label(c, 'φ', ex + 34 * Math.cos(q.phi / 2), ey + 34 * Math.sin(q.phi / 2), { size: 13, color: C.series[2], weight: 700, align: 'center' });
        // the collision in three acts: in, hit, out
        if (t < 1) {
          const head = 20 + inLen * t;
          wiggle(c, Math.max(20, head - 90), ey, 0, Math.min(90, head - 20), wl, 7, C.accent, 2.2, 0);
          kit.dot(c, ex, ey, 7, C.series[2], C.surface);
        } else {
          const s = (t - 1) / 2;
          const r = 200 * s;
          wiggle(c, ex + r * Math.cos(q.th), ey - r * Math.sin(q.th), -q.th, 90, wl2, 7, C.series[1], 2.2, 0);
          const k = q.pe / q.p;
          kit.dot(c, ex + 150 * k * s * Math.cos(q.phi), ey + 150 * k * s * Math.sin(q.phi), 7, C.series[2], C.surface);
          if (t < 1.25) kit.dot(c, ex, ey, 14 * (1.25 - t) / 0.25 + 2, C.warn);
        }
        kit.label(c, 'incoming photon', 24, ey - 22, { size: 11.5, color: C.accent });
        kit.label(c, 'scattered photon', ex + 120 * Math.cos(q.th) + (q.th > 1.4 ? -60 : 0), ey - 120 * Math.sin(q.th) - 16, { size: 11.5, color: C.series[1], align: q.th > 1.4 ? 'center' : 'left' });
        if (q.pe > 0) kit.label(c, 'recoil electron', ex + 110 * Math.cos(q.phi), ey + 110 * Math.sin(q.phi) + 16, { size: 11.5, color: C.series[2] });
        // momentum triangle
        if (V.tri) {
          const ox = W * 0.66, oy = ey;
          const sc = Math.min(W * 0.28, Hh * 0.4) / q.p;
          const px = ox + q.p * sc, py = oy;
          const p2x = ox + q.p2 * Math.cos(q.th) * sc, p2y = oy - q.p2 * Math.sin(q.th) * sc;
          kit.arrow(c, ox, oy, px, py, C.accent, 2.4);
          kit.arrow(c, ox, oy, p2x, p2y, C.series[1], 2.4);
          if (q.pe * sc > 3) kit.arrow(c, p2x, p2y, px, py, C.series[2], 2.4);
          kit.label(c, 'p', (ox + px) / 2, oy + 14, { size: 13, weight: 700, color: C.accent, align: 'center' });
          kit.label(c, 'p′', (ox + p2x) / 2 - 12, (oy + p2y) / 2 - 8, { size: 13, weight: 700, color: C.series[1], align: 'center' });
          if (q.pe * sc > 3) kit.label(c, 'pₑ', (p2x + px) / 2 + 12, (p2y + py) / 2, { size: 13, weight: 700, color: C.series[2] });
          kit.label(c, 'momentum: p = p′ + pₑ', ox, Hh * 0.1, { size: 12, color: C.muted });
        }
        ro.set('l', len(q.l));
        ro.set('l2', len(q.l2));
        ro.set('dl', fmt((q.l2 - q.l) * 1e12, 4) + ' pm (' + fmt((q.l2 - q.l) / q.l * 100, 3) + ' %)');
        ro.set('E', eV(q.E));
        ro.set('E2', eV(q.E2));
        ro.set('K', eV(Math.max(0, q.E - q.E2)));
        ro.set('phi', q.pe > 0 ? (q.phi * 180 / Math.PI).toFixed(1) + '° below the axis' : '—');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ electrons through two slits */
  Hyper.sim('qm-double-slit', {
    title: 'Electrons through two slits, one at a time',
    blurb: `Electrons pass a pair of slits and land on a detector screen 1 m away. Each one makes a single dot; the histogram on the right counts them.

- Start with **one at a time**: the first dots look random. Speed up and watch fringes appear.
- Raise the electron energy: shorter de Broglie wavelength, closer fringes. Widen the slit separation: closer fringes too.
- Switch on the **which-path detector**: the fringes disappear, although every electron still gets through.
- Close one slit: no fringes, and some places that were dark now receive electrons.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const ctl = kit.controls(box.side, [
        { id: 'rate', type: 'select', label: 'Electrons', options: [['One at a time', 3], ['Faster (60 per second)', 60], ['Flood (1500 per second)', 1500]], value: 3 },
        { id: 'E', label: 'Electron energy', min: 20, max: 2000, value: 100, unit: 'eV', log: true, sig: 3 },
        { id: 'd', label: 'Slit separation', min: 0.4, max: 3, step: 0.05, value: 1, unit: 'µm' },
        { id: 'which', type: 'check', label: 'Which-path detector', value: false },
        { id: 'one', type: 'check', label: 'Close the lower slit', value: false },
        { id: 'wave', type: 'check', label: 'Show the wave prediction', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Pause', primary: true }, { id: 'clear', label: 'Clear screen' }] }
      ], id => {
        if (id === 'run') { running = !running; const b = ctl.rows.run; if (b) b.textContent = running ? 'Pause' : 'Resume'; return; }
        if (id === 'rate' || id === 'wave') return;
        clearScreen();
      });
      const ro = kit.readout(box.side, [['lam', 'de Broglie wavelength'], ['dy', 'Fringe spacing'], ['n', 'Electrons detected']]);
      const V = ctl.values;
      const L = 1, A = 0.2e-6, Y = 500e-6, NB = 200;   // screen distance, slit width, screen half-height, bins
      let hits = [], bins = new Float64Array(NB), total = 0, running = true, acc = 0, flying = [];
      function clearScreen() { hits = []; bins = new Float64Array(NB); total = 0; flying = []; }
      const lam = () => PLANCK / Math.sqrt(2 * ME * V.E * QE);
      function intensity(y) {
        const l = lam();
        const b = Math.PI * A * y / (l * L);
        const env = Math.abs(b) < 1e-9 ? 1 : Math.pow(Math.sin(b) / b, 2);
        if (V.which || V.one) return env;
        const g = Math.PI * V.d * 1e-6 * y / (l * L);
        return env * Math.pow(Math.cos(g), 2);
      }
      function sample() {
        for (let k = 0; k < 400; k++) {
          const y = (Math.random() * 2 - 1) * Y;
          if (Math.random() < intensity(y)) return y;
        }
        return 0;
      }
      function land(y) {
        hits.push({ y, x: Math.random() });
        if (hits.length > 30000) hits = hits.slice(-24000);
        const b = Math.floor((y + Y) / (2 * Y) * NB);
        if (b >= 0 && b < NB) bins[b]++;
        total++;
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const cy = Hh / 2, half = Hh / 2 - 18;
        const gunX = 34, slitX = W * 0.3, scrX = W * 0.6, scrW = W * 0.13, hisX = scrX + scrW + 10, hisW = W - hisX - 12;
        const sy = y => cy - y / Y * half;
        // emission
        if (running && V.rate < 10) {
          // one at a time: the next electron leaves only after the last one has landed
          if (!flying.length) { acc += dt; if (acc > 0.15) { acc = 0; flying.push({ s: 0, y: sample(), upper: V.one ? true : Math.random() < 0.5 }); } }
        } else if (running) {
          acc += V.rate * dt;
          let n = Math.min(Math.floor(acc), 400);
          acc -= Math.floor(acc);
          while (n-- > 0) land(sample());
        }
        // gun
        c.fillStyle = C.text2 || C.text;
        c.fillRect(gunX - 22, cy - 9, 22, 18);
        kit.label(c, 'e⁻ gun', gunX - 11, cy + 22, { align: 'center', size: 11, color: C.muted });
        // barrier with two slits (drawn larger than life)
        const sep = 14 + 12 * V.d, gap = 7;
        c.fillStyle = C.border2;
        c.fillRect(slitX - 4, 8, 8, cy - sep / 2 - gap / 2 - 8);
        c.fillRect(slitX - 4, cy - sep / 2 + gap / 2, 8, sep - gap);
        c.fillRect(slitX - 4, cy + sep / 2 + gap / 2, 8, Hh - 8 - (cy + sep / 2 + gap / 2));
        if (V.one) { c.fillStyle = C.bad; c.fillRect(slitX - 4, cy + sep / 2 - gap / 2, 8, gap); }
        if (V.which) {
          for (const s of V.one ? [-1] : [-1, 1]) {
            c.save(); c.shadowColor = C.warn; c.shadowBlur = 10;
            kit.dot(c, slitX + 14, cy + s * sep / 2, 4.5, C.warn);
            c.restore();
          }
          kit.label(c, 'detector', slitX + 22, cy - sep / 2 - 16, { size: 11, color: C.warn });
        }
        // flying electrons (slow mode)
        for (const f of flying) {
          f.s += dt / 0.8;
          const yS = cy + (f.upper ? -1 : 1) * sep / 2;
          let x, y;
          if (f.s < 0.5) { const u = f.s / 0.5; x = gunX + (slitX - gunX) * u; y = cy + (yS - cy) * u; }
          else { const u = (f.s - 0.5) / 0.5; x = slitX + (scrX - slitX) * u; y = yS + (sy(f.y) - yS) * u; }
          if (V.wave && !V.which && !V.one && f.s >= 0.5) {
            // the part that went through both slits: faint circular wavelets
            c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.25; c.lineWidth = 1;
            const r = (f.s - 0.5) / 0.5 * (scrX - slitX);
            for (const s of [-1, 1]) { c.beginPath(); c.arc(slitX, cy + s * sep / 2, r, -1.1, 1.1); c.stroke(); }
            c.restore();
          }
          kit.dot(c, x, y, 3.5, C.accent);
          if (f.s >= 1) land(f.y);
        }
        flying = flying.filter(f => f.s < 1);
        // the screen
        c.fillStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(20,30,60,.08)';
        c.fillRect(scrX, cy - half, scrW, 2 * half);
        c.strokeStyle = C.border2; c.lineWidth = 1; c.strokeRect(scrX + 0.5, cy - half + 0.5, scrW, 2 * half);
        c.fillStyle = C.accent;
        const from = Math.max(0, hits.length - 12000);
        const r = hits.length > 3000 ? 1.4 : hits.length > 300 ? 2 : 3;
        for (let i = from; i < hits.length; i++) { const h = hits[i]; c.fillRect(scrX + 3 + h.x * (scrW - 6) - r / 2, sy(h.y) - r / 2, r, r); }
        // histogram
        let bmax = 12;                                   // so the first few electrons make short bars
        for (let i = 0; i < NB; i++) bmax = Math.max(bmax, bins[i]);
        const bh = 2 * half / NB;
        if (bmax > 0) {
          c.fillStyle = C.series[1];
          for (let i = 0; i < NB; i++) if (bins[i]) {
            const w = bins[i] / bmax * hisW * 0.92;
            c.fillRect(hisX, cy + half - (i + 1) * bh, w, Math.max(1, bh - 0.3));
          }
        }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(hisX + 0.5, cy - half); c.lineTo(hisX + 0.5, cy + half); c.stroke();
        if (V.wave) {
          c.save(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath();
          for (let k = 0; k <= 300; k++) {
            const y = -Y + 2 * Y * k / 300;
            const px = hisX + intensity(y) * hisW * 0.92, py = sy(y);
            k ? c.lineTo(px, py) : c.moveTo(px, py);
          }
          c.stroke(); c.restore();
        }
        kit.label(c, '±' + (Y * 1e6).toFixed(0) + ' µm', scrX + scrW / 2, cy + half + 10, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'count', hisX + hisW / 2, cy + half + 10, { align: 'center', size: 10.5, color: C.faint });
        kit.label(c, 'two slits, ' + fmt(V.d, 3) + ' µm apart', slitX, Hh - 2, { align: 'center', size: 10.5, color: C.faint, baseline: 'bottom' });
        kit.label(c, 'detector, 1 m away', scrX + scrW / 2, cy - half - 8, { align: 'center', size: 10.5, color: C.faint });
        const l = lam();
        ro.set('lam', fmt(l * 1e9, 3) + ' nm');
        ro.set('dy', V.which || V.one ? 'no fringes' : fmt(l * L / (V.d * 1e-6) * 1e6, 3) + ' µm');
        ro.set('n', String(total));
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ wave packet */
  Hyper.sim('qm-wavepacket', {
    title: 'Wave packet: position against momentum',
    blurb: `Top: an electron's wave packet in space — its probability density $|\\psi|^2$ (filled) and the real part of $\\psi$. Bottom: how its momentum is spread. The packet is built by adding waves with a range of wavelengths.

- Make the packet narrower: the momentum distribution gets wider. The product $\\Delta x\\,\\Delta p$ never falls below $\\hbar/2$.
- Build it from only 3 or 7 waves: the sum repeats itself — a few wavelengths cannot make a single, isolated lump.
- Press **Let it move**. The packet travels and spreads; narrow packets spread fastest. The momentum distribution never changes.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sx', label: 'Packet width Δx', min: 0.05, max: 1, value: 0.3, unit: 'nm', log: true, sig: 2 },
        { id: 'lam', label: 'Central wavelength', min: 0.15, max: 1, value: 0.3, unit: 'nm', log: true, sig: 2 },
        { id: 'nw', type: 'select', label: 'Built from', options: [['a continuous spread of waves', 0], ['3 waves', 3], ['7 waves', 7], ['15 waves', 15]], value: 0 },
        { id: 're', type: 'check', label: 'Show the real part of ψ', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Let it move', primary: true }, { id: 'reset', label: 'Back to t = 0' }] }
      ], id => {
        if (id === 'play') { playing = !playing; if (playing && tau >= tauEnd()) tau = 0; label(); return; }
        if (id === 'reset' || id === 'sx' || id === 'lam' || id === 'nw') { tau = 0; playing = id === 'reset' ? false : playing; label(); }
      });
      const ro = kit.readout(box.side, [['dx', 'Δx now'], ['dp', 'Δp'], ['prod', 'Δx · Δp'], ['v', 'Packet speed'], ['t', 'Time']]);
      const V = ctl.values;
      let playing = false, tau = 0;           // tau = t / t_s, with t_s = 2mΔx²/ħ
      const label = () => { const b = ctl.rows.play; if (b) b.textContent = playing ? 'Pause' : 'Let it move'; };
      const WIN = 4;                           // nm either side of the packet centre
      const tauEnd = () => { const r = 1.6 / V.sx; return r > 1 ? Math.sqrt(r * r - 1) : 1; };
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const s0 = V.sx, k0 = 2 * Math.PI / V.lam;            // nm, 1/nm
        const ts = s0 * s0 * HBAR_EVFS / H2M_EVNM2;            // fs: 2mσ²/ħ = σ²·ħ/(ħ²/2m)
        const v = 2 * H2M_EVNM2 * k0 / HBAR_EVFS;              // nm/fs: ħk/m
        if (playing) { tau += dt * tauEnd() / 5; if (tau >= tauEnd()) { tau = tauEnd(); playing = false; label(); } }
        const t = tau * ts;
        const xc = v * t;
        const top = { x0: 50, x1: W - 14, y0: 16, y1: Hh * 0.56 };
        const bot = { x0: 50, x1: W - 14, y0: Hh * 0.68, y1: Hh - 34 };
        // position panel
        const axT = axes(c, C, top, [xc - WIN, xc + WIN], [-1.15, 1.15], { xlabel: 'position x (nm)', ny: 4, fy: v => fmt(v, 2) });
        const N = Math.max(200, Math.floor(top.x1 - top.x0));
        const re = new Float64Array(N + 1), pr = new Float64Array(N + 1);
        const sk = 1 / (2 * s0);                                // momentum spread in k (1/nm)
        let waves = null, norm = 1;
        if (V.nw > 0) {
          const n = V.nw, dk = 6 * sk / (n - 1);
          waves = [];
          for (let j = 0; j < n; j++) { const k = k0 + (j - (n - 1) / 2) * dk; waves.push({ k, a: Math.exp(-Math.pow(k - k0, 2) / (4 * sk * sk)) }); }
          norm = waves.reduce((s, w) => s + w.a, 0);
        }
        for (let i = 0; i <= N; i++) {
          const x = xc - WIN + 2 * WIN * i / N;
          if (!waves) {
            const u = x - v * t, d = 1 + tau * tau;
            const amp = Math.pow(d, -0.25) * Math.exp(-u * u / (4 * s0 * s0 * d));
            const ph = u * u * tau / (4 * s0 * s0 * d) + k0 * (x - v * t / 2) - Math.atan(tau) / 2;
            re[i] = amp * Math.cos(ph); pr[i] = amp * amp;
          } else {
            let a = 0, b = 0;
            for (const w of waves) { const ph = w.k * x - H2M_EVNM2 * w.k * w.k * t / HBAR_EVFS; a += w.a * Math.cos(ph); b += w.a * Math.sin(ph); }
            a /= norm; b /= norm;
            re[i] = a; pr[i] = a * a + b * b;
          }
        }
        c.save();
        c.beginPath(); c.rect(top.x0, top.y0, top.x1 - top.x0, top.y1 - top.y0); c.clip();
        c.fillStyle = C.dark ? 'rgba(123,140,255,.28)' : 'rgba(70,90,220,.2)';
        c.beginPath(); c.moveTo(top.x0, axT.Y(0));
        for (let i = 0; i <= N; i++) c.lineTo(top.x0 + (top.x1 - top.x0) * i / N, axT.Y(pr[i]));
        c.lineTo(top.x1, axT.Y(0)); c.closePath(); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= N; i++) { const px = top.x0 + (top.x1 - top.x0) * i / N, py = axT.Y(pr[i]); i ? c.lineTo(px, py) : c.moveTo(px, py); }
        c.stroke();
        if (V.re) {
          c.strokeStyle = C.series[1]; c.lineWidth = 1.2; c.beginPath();
          for (let i = 0; i <= N; i++) { const px = top.x0 + (top.x1 - top.x0) * i / N, py = axT.Y(re[i]); i ? c.lineTo(px, py) : c.moveTo(px, py); }
          c.stroke();
        }
        c.restore();
        kit.label(c, '|ψ|²', top.x0 + 8, top.y0 + 10, { size: 12, color: C.accent, weight: 700 });
        if (V.re) kit.label(c, 'Re ψ', top.x0 + 44, top.y0 + 10, { size: 12, color: C.series[1], weight: 700 });
        if (t > 0) kit.label(c, 'view follows the packet', top.x1 - 6, top.y0 + 10, { size: 11, color: C.muted, align: 'right' });
        // momentum panel (units of 10⁻²⁴ kg·m/s)
        const P = k => k * 1e9 * HBAR / 1e-24;
        const axB = axes(c, C, bot, [-4, 11], [0, 1.15], { xlabel: 'momentum p (10⁻²⁴ kg·m/s)', ny: 2, fy: v => fmt(v, 2) });
        c.save(); c.beginPath(); c.rect(bot.x0, bot.y0, bot.x1 - bot.x0, bot.y1 - bot.y0); c.clip();
        if (!waves) {
          c.fillStyle = C.dark ? 'rgba(255,153,0,.25)' : 'rgba(230,120,0,.2)';
          c.strokeStyle = C.series[1]; c.lineWidth = 2;
          c.beginPath(); c.moveTo(bot.x0, axB.Y(0));
          const M = 400;
          for (let i = 0; i <= M; i++) {
            const p = -4 + 15 * i / M;
            const k = p * 1e-24 / HBAR / 1e9;
            c.lineTo(axB.X(p), axB.Y(Math.exp(-Math.pow(k - k0, 2) / (2 * sk * sk))));
          }
          c.lineTo(bot.x1, axB.Y(0)); c.closePath(); c.fill(); c.stroke();
        } else {
          c.strokeStyle = C.series[1]; c.lineWidth = 3;
          for (const w of waves) { c.beginPath(); c.moveTo(axB.X(P(w.k)), axB.Y(0)); c.lineTo(axB.X(P(w.k)), axB.Y(w.a * w.a)); c.stroke(); }
        }
        c.restore();
        kit.label(c, 'momentum distribution (does not change in time)', bot.x0 + 8, bot.y0 - 8, { size: 11.5, color: C.muted });
        // numbers
        const dxNow = s0 * Math.sqrt(1 + tau * tau);
        const dp = HBAR / (2 * s0 * 1e-9);
        if (!waves) {
          ro.set('dx', fmt(dxNow, 3) + ' nm');
          ro.set('dp', fmt(dp, 3) + ' kg·m/s');
          ro.set('prod', fmt(dxNow * 1e-9 * dp / HBAR, 3) + ' ħ  (minimum 0.5 ħ)');
        } else {
          const period = 2 * Math.PI / (6 * sk / (V.nw - 1));
          let m = 0, m2 = 0, s = 0;
          for (const w of waves) { const q = w.a * w.a; s += q; m += q * w.k; m2 += q * w.k * w.k; }
          const dk = Math.sqrt(Math.max(0, m2 / s - (m / s) * (m / s)));
          ro.set('dx', '∞ — repeats every ' + fmt(period, 3) + ' nm');
          ro.set('dp', fmt(dk * 1e9 * HBAR, 3) + ' kg·m/s');
          ro.set('prod', 'unbounded (no single lump)');
        }
        ro.set('v', fmt(v * 1e6, 3) + ' m/s');
        ro.set('t', fmt(t, 3) + ' fs');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Bohr atom and spectrum */
  Hyper.sim('qm-bohr', {
    title: 'Bohr atom: energy levels and spectrum',
    blurb: `Left: the Bohr orbits, drawn to scale (radius ∝ n²). Middle: the energy levels. Below: every photon lands on the spectrum — the upper strip on a logarithmic wavelength scale, the lower one zoomed on visible light, with emission lines on black and absorption lines on a rainbow.

- Emit from 3 → 2, 4 → 2, 5 → 2, 6 → 2: the four visible Balmer lines. Now try jumps ending on 1: ultraviolet.
- **Absorb** 2 → 3: the dark line sits exactly where the bright one was.
- Tick **Hot gas** and let the spectrum build up by itself.
- Switch to He⁺: every energy is four times larger, every wavelength four times shorter.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'ni', label: 'Upper level', min: 2, max: 7, step: 1, value: 3 },
        { id: 'nf', label: 'Lower level', min: 1, max: 6, step: 1, value: 2 },
        { id: 'Z', type: 'select', label: 'Atom', options: [['Hydrogen (Z = 1)', 1], ['Helium ion He⁺ (Z = 2)', 2], ['Lithium ion Li²⁺ (Z = 3)', 3]], value: 1 },
        { id: 'hot', type: 'check', label: 'Hot gas: random jumps', value: false },
        { type: 'buttons', items: [{ id: 'emit', label: 'Emit (jump down)', primary: true }, { id: 'absorb', label: 'Absorb (jump up)' }, { id: 'clear', label: 'Clear spectrum' }] }
      ], id => {
        if (id === 'nf' && V.nf >= V.ni) ctl.set('ni', Math.min(7, V.nf + 1));
        if (id === 'ni' && V.ni <= V.nf) ctl.set('nf', Math.max(1, V.ni - 1));
        if (id === 'Z' || id === 'clear') { emitted = new Map(); absorbed = new Map(); arrows = []; photons = []; }
        if (id === 'emit' && !jump) { if (cur !== V.ni) cur = V.ni; startJump(V.ni, V.nf, 'emit'); }
        if (id === 'absorb' && !jump) { cur = V.nf; photons.push({ kind: 'in', from: V.nf, to: V.ni, t: 0 }); }
        if (!loop.running) loop.once();
      });
      const ro = kit.readout(box.side, [['up', 'Upper level'], ['lo', 'Lower level'], ['E', 'Photon energy'], ['lam', 'Wavelength'], ['series', 'Series']]);
      const V = ctl.values;
      const SERIES = ['Lyman', 'Balmer', 'Paschen', 'Brackett', 'Pfund', 'Humphreys'];
      const MNUC = [MP, 4.001506 * 1.66053906660e-27, 7.014358 * 1.66053906660e-27];
      const Ryd = () => 13.605693 / (1 + ME / MNUC[V.Z - 1]);             // eV, with the nucleus's recoil
      const En = n => -Ryd() * V.Z * V.Z / (n * n);
      const lamOf = (a, b) => HC_EVNM / (En(a) - En(b));                  // nm, a above b
      let cur = 1, jump = null, photons = [], arrows = [], emitted = new Map(), absorbed = new Map(), phase = 0, idle = 0;

      function startJump(from, to, kind) {
        jump = { from, to, t: 0, kind };
        if (kind === 'emit') photons.push({ kind: 'out', from, to, t: 0 });
        arrows.push({ from, to, kind });
        if (arrows.length > 10) arrows.shift();
      }
      function record(map, a, b) {
        const key = a + '-' + b;
        const r = map.get(key) || { a, b, n: 0 };
        r.n++;
        map.set(key, r);
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const topH = Hh * 0.62;
        // ------------------------------------------------ state updates
        phase += dt;
        if (jump) {
          jump.t += dt / 0.5;
          if (jump.t >= 1) { cur = jump.to; jump = null; }
        }
        for (const p of photons) p.t += dt / 0.9;
        for (const p of photons) if (p.t >= 1) {
          if (p.kind === 'out') record(emitted, p.from, p.to);
          else { record(absorbed, p.to, p.from); if (!jump) { cur = p.from; startJump(p.from, p.to, 'absorb'); } }
        }
        photons = photons.filter(p => p.t < 1);
        if (V.hot && !jump && !photons.some(p => p.kind === 'in')) {
          idle += dt;
          if (idle > 0.25) {
            idle = 0;
            if (cur === 1) { cur = 2 + Math.floor(Math.random() * 6); }
            else { const to = 1 + Math.floor(Math.random() * (cur - 1)); startJump(cur, to, 'emit'); }
          }
        }
        // ------------------------------------------------ orbits (radius ∝ n²)
        const ocx = W * 0.19, ocy = topH * 0.52;
        const nShow = Math.max(4, V.ni, cur, jump ? jump.from : 1);
        const rmax = Math.min(W * 0.17, topH * 0.44);
        const rad = n => rmax * n * n / (nShow * nShow);
        c.save(); c.lineWidth = 1;
        for (let n = 1; n <= nShow; n++) {
          c.strokeStyle = n === cur ? C.accent : C.grid; c.setLineDash(n === cur ? [] : [3, 3]);
          c.beginPath(); c.arc(ocx, ocy, rad(n), 0, Math.PI * 2); c.stroke();
        }
        c.restore();
        kit.dot(c, ocx, ocy, Math.max(3, 3 + V.Z), C.bad);
        let er = rad(cur);
        if (jump) { const u = jump.t * jump.t * (3 - 2 * jump.t); er = rad(jump.from) + (rad(jump.to) - rad(jump.from)) * u; }
        const nNow = jump ? (jump.t < 0.5 ? jump.from : jump.to) : cur;
        const ang = phase * 2.4 / Math.pow(nNow, 1.5);
        const ex = ocx + er * Math.cos(ang), ey = ocy - er * Math.sin(ang);
        kit.dot(c, ex, ey, 4.5, C.accent, C.surface);
        kit.label(c, 'orbits to scale: r = n²a₀/Z', ocx, topH * 0.05, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'n = ' + nShow, ocx + rad(nShow) * 0.71 + 6, ocy - rad(nShow) * 0.71 - 6, { size: 10.5, color: C.faint });
        // ------------------------------------------------ energy levels
        const lx0 = W * 0.42, lx1 = W - 16, ly0 = topH * 0.08, ly1 = topH * 0.95;
        const Emin = En(1), Emax = 0.06 * -Emin;
        const LY = E => ly1 - (E - Emin) / (Emax - Emin) * (ly1 - ly0);
        c.save(); c.lineWidth = 1.2;
        let lastY = Infinity;
        for (let n = 1; n <= 7; n++) {
          const y = LY(En(n));
          c.strokeStyle = n === cur ? C.accent : C.axis;
          c.beginPath(); c.moveTo(lx0 + 44, y); c.lineTo(lx1, y); c.stroke();
          if (lastY - y > 15 || n === 1) {
            kit.label(c, 'n = ' + n, lx0, y, { size: 11, color: n === cur ? C.accent : C.text2 || C.text });
            kit.label(c, fmt(En(n), 3) + ' eV', lx1, y - 7, { size: 10.5, align: 'right', color: C.muted });
            lastY = y;
          }
        }
        c.setLineDash([4, 4]); c.strokeStyle = C.faint;
        c.beginPath(); c.moveTo(lx0 + 44, LY(0)); c.lineTo(lx1, LY(0)); c.stroke();
        c.restore();
        kit.label(c, 'ionized (E = 0)', lx0 + 48, LY(0) - 8, { size: 10.5, color: C.faint });
        // transition arrows, placed by series
        arrows.forEach((a, i) => {
          const lo = Math.min(a.from, a.to), hi = Math.max(a.from, a.to);
          const x = lx0 + 58 + (lo - 1) * (lx1 - lx0 - 90) / 6 + (hi - lo) * 5;
          const lam = lamOf(hi, lo);
          const col = rayColor(lam, 1, C.dark);
          const alpha = 0.35 + 0.65 * (i + 1) / arrows.length;
          c.save(); c.globalAlpha = alpha;
          if (a.kind === 'emit') kit.arrow(c, x, LY(En(hi)), x, LY(En(lo)), col, 2);
          else kit.arrow(c, x, LY(En(lo)), x, LY(En(hi)), col, 2);
          c.restore();
        });
        // ------------------------------------------------ spectrum strips
        const sx0 = 16, sx1 = W - 16;
        const sA = { y0: topH + 18, y1: topH + (Hh - topH) * 0.4 };
        const sB = { y0: topH + (Hh - topH) * 0.56, y1: Hh - 22 };
        const lmin = 60 / (V.Z * V.Z), lmax = 15000 / (V.Z * V.Z);
        const XA = l => sx0 + Math.log(l / lmin) / Math.log(lmax / lmin) * (sx1 - sx0);
        const XB = l => sx0 + (l - 380) / (750 - 380) * (sx1 - sx0);
        // strip A: all wavelengths, log scale
        c.fillStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(20,30,60,.07)';
        c.fillRect(sx0, sA.y0, sx1 - sx0, sA.y1 - sA.y0);
        for (let l = 380; l < 750; l += 4) { c.fillStyle = specColor(l + 2, 0.5); c.fillRect(XA(l), sA.y1 - 4, Math.max(1, XA(l + 4) - XA(l) + 0.5), 4); }
        kit.label(c, 'ultraviolet', XA(Math.sqrt(lmin * 380)), sA.y0 - 8, { size: 10.5, align: 'center', color: C.faint });
        kit.label(c, 'visible', XA(530), sA.y0 - 8, { size: 10.5, align: 'center', color: C.faint });
        kit.label(c, 'infrared', XA(Math.sqrt(750 * lmax)), sA.y0 - 8, { size: 10.5, align: 'center', color: C.faint });
        c.save(); c.font = '10px ' + font(); c.fillStyle = C.faint; c.textAlign = 'center';
        for (const l of [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000]) if (l >= lmin && l <= lmax) {
          c.fillRect(XA(l), sA.y1, 1, 4);
          c.fillText(l >= 1000 ? l / 1000 + ' µm' : l + ' nm', XA(l), sA.y1 + 13);
        }
        c.restore();
        let maxN = 1;
        for (const r of emitted.values()) maxN = Math.max(maxN, r.n);
        for (const r of emitted.values()) {
          const l = lamOf(r.a, r.b), x = XA(l);
          c.fillStyle = specColor(l, 0.35 + 0.65 * Math.sqrt(r.n / maxN)) || C.muted;
          c.fillRect(x - 1, sA.y0 + 2, 2.4, (sA.y1 - sA.y0) * 0.5 - 2);
        }
        for (const r of absorbed.values()) {
          const l = lamOf(r.a, r.b), x = XA(l);
          c.fillStyle = C.text;
          c.fillRect(x - 1, sA.y0 + (sA.y1 - sA.y0) * 0.5 + 1, 2.4, (sA.y1 - sA.y0) * 0.5 - 6);
        }
        // strip B: the visible band, emission (top) and absorption (bottom)
        const midB = (sB.y0 + sB.y1) / 2;
        c.fillStyle = '#05060a';
        c.fillRect(sx0, sB.y0, sx1 - sx0, midB - sB.y0);
        for (let l = 380; l < 750; l += 2) { c.fillStyle = specColor(l + 1, 0.85); c.fillRect(XB(l), midB, Math.max(1, XB(l + 2) - XB(l) + 0.5), sB.y1 - midB); }
        for (const r of emitted.values()) {
          const l = lamOf(r.a, r.b);
          if (l < 380 || l > 750) continue;
          c.save(); c.shadowColor = specColor(l, 1); c.shadowBlur = 8;
          c.fillStyle = specColor(l, 0.4 + 0.6 * Math.sqrt(r.n / maxN));
          c.fillRect(XB(l) - 1.5, sB.y0 + 1, 3, midB - sB.y0 - 2);
          c.restore();
        }
        for (const r of absorbed.values()) {
          const l = lamOf(r.a, r.b);
          if (l < 380 || l > 750) continue;
          c.fillStyle = '#05060a';
          c.fillRect(XB(l) - 1.5, midB, 3, sB.y1 - midB);
        }
        c.save(); c.font = '10px ' + font(); c.fillStyle = C.faint; c.textAlign = 'center';
        for (let l = 400; l <= 750; l += 50) c.fillText(l + ' nm', XB(l), sB.y1 + 12);
        c.restore();
        kit.label(c, 'visible light — emission lines (top), absorption lines (bottom)', sx0, sB.y0 - 8, { size: 10.5, color: C.faint });
        // ------------------------------------------------ photons in flight
        for (const p of photons) {
          const hi = Math.max(p.from, p.to), lo = Math.min(p.from, p.to);
          const l = lamOf(hi, lo);
          const col = rayColor(l, 1, C.dark);
          const tx = XA(l), ty = sA.y0;
          let x, y;
          if (p.kind === 'out') { x = ex + (tx - ex) * p.t; y = ey + (ty - ey) * p.t; }
          else { x = 10 + (ex - 10) * p.t; y = ocy + (ey - ocy) * p.t; }
          const a = p.kind === 'out' ? Math.atan2(ty - ey, tx - ex) : Math.atan2(ey - ocy, ex - 10);
          const wl = clamp(6 + 10 * Math.log10(Math.max(10, l) / 50), 5, 30);
          wiggle(c, x - Math.cos(a) * 40, y - Math.sin(a) * 40, a, 40, wl, 5, col, 2, -p.t * 30);
        }
        // ------------------------------------------------ numbers
        const up = V.ni, lo = V.nf, l = lamOf(up, lo);
        ro.set('up', 'n = ' + up + ',  E = ' + fmt(En(up), 4) + ' eV');
        ro.set('lo', 'n = ' + lo + ',  E = ' + fmt(En(lo), 4) + ' eV');
        ro.set('E', fmt(En(up) - En(lo), 4) + ' eV');
        ro.set('lam', (l >= 1000 ? fmt(l / 1000, 4) + ' µm' : fmt(l, 4) + ' nm') + (l < 380 ? ' (UV)' : l > 750 ? ' (IR)' : ' (visible)'));
        ro.set('series', (SERIES[lo - 1] || '—') + (V.Z > 1 ? ' (of the ion)' : ''));
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ quantum wells: box and oscillator */
  Hyper.sim('qm-box', {
    title: 'Quantum wells: particle in a box and harmonic oscillator',
    blurb: `An electron in a well. Each horizontal line is an allowed energy; the chosen state is drawn on its own level. Stationary states only turn their phase (watch the real and imaginary parts trade places) while $|\\psi|^2$ stays put.

- Step through the levels: count the nodes, and compare the spacing of the box levels (n²) with the oscillator's (even).
- Mix a state with the next one up and show $|\\psi|^2$: the probability sloshes from side to side at $(E_2 - E_1)/h$.
- Shrink the box: every level rises as $1/L^2$.
- Tick the classical comparison and go to a high level: the quantum probability approaches the classical one.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'well', type: 'select', label: 'Potential', options: [['Box (infinite square well)', 'box'], ['Harmonic oscillator', 'ho']], value: params && params.well === 'ho' ? 'ho' : 'box' },
        { id: 'L', label: 'Box width', min: 0.2, max: 2, step: 0.05, value: 1, unit: 'nm' },
        { id: 'hw', label: 'Oscillator quantum ħω', min: 0.05, max: 1, step: 0.01, value: 0.3, unit: 'eV' },
        { id: 'k', label: 'Level (1 = ground state)', min: 1, max: 10, step: 1, value: 1 },
        { id: 'mix', type: 'select', label: 'Mix it with', options: [['nothing: one stationary state', 0], ['the next level up', 1], ['the level two up', 2]], value: 0 },
        { id: 'show', type: 'select', label: 'Show', options: [['ψ: real and imaginary parts', 'psi'], ['|ψ|²: probability density', 'prob']], value: 'psi' },
        { id: 'cl', type: 'check', label: 'Compare with a classical particle', value: false },
        { id: 'run', type: 'check', label: 'Let time run', value: true }
      ], id => { if (id === 'well') rows(); if (id !== 'run' && id !== 'cl' && id !== 'show') t = 0; });
      const ro = kit.readout(box.side, [['st', 'State'], ['E', 'Energy'], ['gap', 'Gap to next level'], ['T', 'Period'], ['t', 'Time']]);
      const V = ctl.values;
      function rows() {
        const r1 = ctl.rows.L, r2 = ctl.rows.hw;
        if (r1 && r1.row && r1.row.style) r1.row.style.display = V.well === 'box' ? '' : 'none';
        if (r2 && r2.row && r2.row.style) r2.row.style.display = V.well === 'ho' ? '' : 'none';
      }
      rows();
      let t = 0;                                   // fs
      const H_EVFS = 2 * Math.PI * HBAR_EVFS;      // h in eV·fs
      // quantum number, energy (eV) and wavefunction (1/√nm) of the j-th level (j = 1 is the ground state)
      const qn = j => V.well === 'box' ? j : j - 1;
      const x0 = () => Math.sqrt(2 * H2M_EVNM2 / V.hw);             // nm
      const energy = j => V.well === 'box' ? j * j * H2M_EVNM2 * Math.PI * Math.PI / (V.L * V.L) : (j - 0.5) * V.hw;
      function phi(j, x) {
        if (V.well === 'box') return x <= 0 || x >= V.L ? 0 : Math.sqrt(2 / V.L) * Math.sin(j * Math.PI * x / V.L);
        const s = x0(), xi = x / s;
        let p0 = Math.pow(Math.PI, -0.25) * Math.exp(-xi * xi / 2), p1 = Math.SQRT2 * xi * p0;
        const n = j - 1;
        if (n === 0) return p0 / Math.sqrt(s);
        for (let k = 1; k < n; k++) { const p2 = Math.sqrt(2 / (k + 1)) * xi * p1 - Math.sqrt(k / (k + 1)) * p0; p0 = p1; p1 = p2; }
        return p1 / Math.sqrt(s);
      }
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const j1 = V.k, j2 = V.mix ? V.k + V.mix : 0, jTop = Math.max(j1, j2);
        const E1 = energy(j1), E2 = j2 ? energy(j2) : 0;
        const period = j2 ? H_EVFS / (E2 - E1) : H_EVFS / E1;
        if (V.run) t += dt * period / 3;
        // ranges
        const isBox = V.well === 'box';
        const X = isBox ? [-0.18 * V.L, 1.18 * V.L] : (() => { const s = x0() * Math.max(3.2, 1.2 * Math.sqrt(2 * jTop + 1) + 0.8); return [-s, s]; })();
        const Etop = energy(jTop + 1) * (isBox ? 1.08 : 1.12);
        const bx = { x0: 58, x1: W - 14, y0: 14, y1: Hh - 36 };
        const ax = axes(c, C, bx, X, [0, Etop], { xlabel: 'position x (nm)', ylabel: 'energy (eV)', ylabelGap: 44, fy: v => fmt(v, 3), fx: v => fmt(v, 3) });
        const PX = ax.X, PY = ax.Y;
        c.save(); c.beginPath(); c.rect(bx.x0, bx.y0, bx.x1 - bx.x0, bx.y1 - bx.y0); c.clip();
        // the potential
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(20,30,60,.08)';
        c.strokeStyle = C.text2 || C.text; c.lineWidth = 2;
        if (isBox) {
          c.fillRect(PX(X[0]), bx.y0, PX(0) - PX(X[0]), bx.y1 - bx.y0);
          c.fillRect(PX(V.L), bx.y0, PX(X[1]) - PX(V.L), bx.y1 - bx.y0);
          c.beginPath(); c.moveTo(PX(0), bx.y0); c.lineTo(PX(0), PY(0)); c.lineTo(PX(V.L), PY(0)); c.lineTo(PX(V.L), bx.y0); c.stroke();
        } else {
          const w2 = V.hw * V.hw / (4 * H2M_EVNM2 * H2M_EVNM2);   // V = ½mω²x² = (ħω)²x²/(4·ħ²/2m) in eV
          const Vx = x => w2 * H2M_EVNM2 * x * x;
          // shade the forbidden side of the parabola (below it: V > E)
          c.beginPath(); c.moveTo(PX(X[0]), PY(0));
          for (let i = 0; i <= 200; i++) { const x = X[0] + (X[1] - X[0]) * i / 200; c.lineTo(PX(x), Math.max(bx.y0 - 2, PY(Vx(x)))); }
          c.lineTo(PX(X[1]), PY(0)); c.closePath(); c.fill();
          c.beginPath();
          for (let i = 0; i <= 200; i++) { const x = X[0] + (X[1] - X[0]) * i / 200; i ? c.lineTo(PX(x), PY(Vx(x))) : c.moveTo(PX(x), PY(Vx(x))); }
          c.stroke();
        }
        // all the levels
        const turn = j => isBox ? null : x0() * Math.sqrt(2 * qn(j) + 1);   // classical turning point
        for (let j = 1; energy(j) < Etop; j++) {
          const y = PY(energy(j));
          const on = j === j1 || j === j2;
          c.strokeStyle = on ? (j === j1 ? C.accent : C.series[1]) : C.grid;
          c.lineWidth = on ? 1.4 : 1;
          c.setLineDash(on ? [] : [4, 3]);
          const xa = isBox ? 0 : -turn(j), xb = isBox ? V.L : turn(j);
          c.beginPath(); c.moveTo(PX(xa), y); c.lineTo(PX(xb), y); c.stroke();
          c.setLineDash([]);
          if (j <= 12) kit.label(c, 'n = ' + qn(j), PX(xb) + 6, y, { size: 10, color: on ? C.text : C.faint });
        }
        // the wavefunction
        const N = Math.max(240, Math.floor(bx.x1 - bx.x0));
        const base = j2 ? (E1 + E2) / 2 : E1;
        const gapE = j2 ? Math.min(energy(j1 + 1) - E1, E2 - energy(j2 - 1)) : energy(j1 + 1) - E1;
        const w1 = E1 / (H_EVFS / (2 * Math.PI)), w2p = E2 / (H_EVFS / (2 * Math.PI));   // rad/fs
        const amp = j2 ? Math.SQRT1_2 : 1;
        const WX = isBox ? [0, V.L] : X;                                // where ψ is drawn
        const xAt = i => WX[0] + (WX[1] - WX[0]) * i / N;
        const re = new Float64Array(N + 1), im = new Float64Array(N + 1), pr = new Float64Array(N + 1);
        let fmax = 0;
        for (let i = 0; i <= N; i++) {
          const x = xAt(i);
          const a = phi(j1, x) * amp;
          let r = a * Math.cos(w1 * t), m = -a * Math.sin(w1 * t);
          if (j2) { const b = phi(j2, x) * amp; r += b * Math.cos(w2p * t); m -= b * Math.sin(w2p * t); }
          re[i] = r; im[i] = m; pr[i] = r * r + m * m;
          fmax = Math.max(fmax, Math.abs(phi(j1, x)) * amp + (j2 ? Math.abs(phi(j2, x)) * amp : 0));
        }
        const prob = V.show === 'prob';
        const hpx = Math.abs(PY(0) - PY(gapE)) * (prob ? 0.85 : 0.6);   // height of the drawn curve, in px
        const peakRef = Math.max(prob ? fmax * fmax : fmax, 1e-9);     // fixed in time, so sloshing shows
        const sc = hpx / peakRef;
        const yb = PY(base);
        if (prob) {
          c.fillStyle = C.dark ? 'rgba(123,140,255,.3)' : 'rgba(70,90,220,.22)';
          c.beginPath(); c.moveTo(PX(WX[0]), yb);
          for (let i = 0; i <= N; i++) c.lineTo(PX(xAt(i)), yb - pr[i] * sc);
          c.lineTo(PX(WX[1]), yb); c.closePath(); c.fill();
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= N; i++) { const px = PX(xAt(i)), py = yb - pr[i] * sc; i ? c.lineTo(px, py) : c.moveTo(px, py); }
          c.stroke();
        } else {
          c.strokeStyle = C.series[1]; c.lineWidth = 1.3; c.setLineDash([5, 4]); c.beginPath();
          for (let i = 0; i <= N; i++) { const px = PX(xAt(i)), py = yb - im[i] * sc; i ? c.lineTo(px, py) : c.moveTo(px, py); }
          c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
          for (let i = 0; i <= N; i++) { const px = PX(xAt(i)), py = yb - re[i] * sc; i ? c.lineTo(px, py) : c.moveTo(px, py); }
          c.stroke();
        }
        // classical comparison
        if (V.cl) {
          c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([6, 4]);
          if (isBox) {
            if (prob) { const y = yb - (1 / V.L) * sc; c.beginPath(); c.moveTo(PX(0), y); c.lineTo(PX(V.L), y); c.stroke(); }
          } else {
            const A = turn(j1);
            c.beginPath(); c.moveTo(PX(-A), bx.y0); c.lineTo(PX(-A), bx.y1); c.moveTo(PX(A), bx.y0); c.lineTo(PX(A), bx.y1); c.stroke();
            if (prob) {
              c.beginPath(); let pen = false;
              for (let i = 1; i < 400; i++) {
                const x = -A + 2 * A * i / 400;
                const pc = 1 / (Math.PI * Math.sqrt(Math.max(1e-12, A * A - x * x)));
                const py = Math.max(bx.y0, yb - pc * sc);
                pen ? c.lineTo(PX(x), py) : c.moveTo(PX(x), py); pen = true;
              }
              c.stroke();
            }
          }
          c.setLineDash([]);
        }
        // the average position, for a sloshing superposition
        if (j2) {
          let s0 = 0, s1 = 0;
          for (let i = 0; i <= N; i++) { const x = xAt(i); s0 += pr[i]; s1 += pr[i] * x; }
          const xm = s0 > 0 ? s1 / s0 : 0;
          c.fillStyle = C.bad;
          c.beginPath(); c.moveTo(PX(xm), bx.y1 - 1); c.lineTo(PX(xm) - 6, bx.y1 - 11); c.lineTo(PX(xm) + 6, bx.y1 - 11); c.closePath(); c.fill();
        }
        c.restore();
        kit.label(c, prob ? '|ψ|²' : 'Re ψ (solid), Im ψ (dashed)', bx.x0 + 8, bx.y0 + 10, { size: 11.5, color: C.accent, weight: 600 });
        if (V.cl) kit.label(c, isBox ? (prob ? 'dashed: a classical particle (uniform)' : 'show |ψ|² to compare with a classical particle') : (prob ? 'dashed: classical particle and its turning points' : 'dashed: classical turning points'), bx.x0 + 8, bx.y0 + 28, { size: 11, color: C.warn });
        if (j2) kit.label(c, '▲ average position', bx.x1 - 6, bx.y1 - 20, { size: 10.5, color: C.bad, align: 'right' });
        // numbers
        const nm = n => 'n = ' + qn(n);
        ro.set('st', j2 ? 'mix of ' + nm(j1) + ' and ' + nm(j2) : nm(j1) + ' (' + (qn(j1) - (isBox ? 1 : 0)) + ' nodes)');
        ro.set('E', j2 ? fmt(E1, 3) + ' and ' + fmt(E2, 3) + ' eV' : fmt(E1, 4) + ' eV');
        const g = energy(j1 + 1) - E1;
        ro.set('gap', fmt(g, 3) + ' eV  (photon ' + (HC_EVNM / g >= 1000 ? fmt(HC_EVNM / g / 1000, 3) + ' µm' : fmt(HC_EVNM / g, 3) + ' nm') + ')');
        ro.set('T', fmt(period, 3) + ' fs ' + (j2 ? '(sloshing)' : '(phase turn)'));
        ro.set('t', fmt(t, 3) + ' fs');
      }
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ tunnelling */
  Hyper.sim('qm-tunnel', {
    title: 'Quantum tunnelling through a barrier',
    blurb: `An electron meets a rectangular barrier. In **steady wave** mode you see the exact solution: incoming and reflected waves on the left, an exponential decay inside the barrier, and a weaker transmitted wave on the right. In **wave packet** mode a single electron's packet hits the barrier and splits.

- Make the barrier wider a step at a time: the transmission falls by a constant *factor* each time (it is exponential; see the graph, whose scale is logarithmic).
- Raise the energy above the barrier: transmission is still not 100 %, except at special energies where the barrier fits whole half-wavelengths.
- Compare the electron with a proton in the readout: same energy, same barrier, hopeless odds.
- Fire a packet and read off what fraction got through.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 250 });
      const graphBox = document.createElement('div');
      graphBox.style.padding = '6px 10px 10px';
      box.stage.appendChild(graphBox);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mode', options: [['Steady wave (exact)', 'wave'], ['Wave packet', 'packet']], value: 'wave' },
        { id: 'E', label: 'Electron energy E', min: 0.2, max: 8, step: 0.05, value: 2, unit: 'eV' },
        { id: 'V0', label: 'Barrier height V₀', min: 0.5, max: 10, step: 0.05, value: 4, unit: 'eV' },
        { id: 'a', label: 'Barrier width a', min: 0.05, max: 2, step: 0.01, value: 0.4, unit: 'nm' },
        { id: 'show', type: 'select', label: 'Show', options: [['Re ψ', 're'], ['|ψ|²', 'prob']], value: 're' },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire a packet', primary: true }] }
      ], id => {
        if (id === 'fire') { ctl.set('mode', 'packet'); startPacket(); }
        else if (id === 'mode' && V.mode === 'packet') startPacket();
        else if (id === 'E' || id === 'V0' || id === 'a') { if (V.mode === 'packet') startPacket(); }
        updateGraph();
      });
      const ro = kit.readout(box.side, [['T', 'Transmission T'], ['Ta', 'T (thick-barrier estimate)'], ['R', 'Reflection R'], ['k', 'Inside the barrier'], ['Tp', 'T for a proton'], ['pk', 'Packet']]);
      const V = ctl.values;
      const plot = kit.plot(graphBox, { x: { label: 'electron energy E (eV)', min: 0, max: 10 }, y: { label: 'T', log: true, min: 1e-12, max: 2 } }, 180);

      /* exact plane-wave solution; mass in electron masses. Returns amplitudes for incidence 1 and log10 T. */
      const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
      const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
      function solve(E, V0, a, mass) {
        mass = mass || 1;
        const h2m = H2M_EVNM2 / mass;
        const k = Math.sqrt(E / h2m);
        let d = E - V0;
        if (Math.abs(d) < 1e-7) d = 1e-7;
        const q = Math.sqrt(Math.abs(d) / h2m);
        const under = d < 0;
        const s = under ? Math.exp(-q * a) : 1;           // scale factor that keeps cosh/sinh finite
        // inside the barrier (scaled by s), as a function of u = x − a (from −a to 0): value and slope
        const inside = u => {
          if (under) {
            const ep = Math.exp(q * (u - a)), em = Math.exp(-q * (u + a));   // e^{q u}·s and e^{-q u}·s
            const ch = (ep + em) / 2, sh = (ep - em) / 2;
            return { v: [ch, k / q * sh], d: [q * sh, k * ch] };
          }
          const cs = Math.cos(q * u), sn = Math.sin(q * u);
          return { v: [cs, k / q * sn], d: [-q * sn, k * cs] };
        };
        const at0 = inside(-a);
        const dOverIk = cdiv(at0.d, [0, k]);
        const I = [(at0.v[0] + dOverIk[0]) / 2, (at0.v[1] + dOverIk[1]) / 2];
        const R = [(at0.v[0] - dOverIk[0]) / 2, (at0.v[1] - dOverIk[1]) / 2];
        const Imag2 = I[0] * I[0] + I[1] * I[1];
        const log10T = (under ? -2 * q * a / Math.LN10 : 0) - Math.log10(Imag2);
        return { k, q, under, s, I, R, inside, r: cdiv(R, I), log10T };
      }
      const fmtT = l => l > -4 ? fmt(Math.pow(10, l), 3) : (() => { const e = Math.floor(l), m = Math.pow(10, l - e); return m.toFixed(1) + ' × 10' + Hyper.util.sup(e); })();
      function updateGraph() {
        const pts = [];
        for (let i = 1; i <= 400; i++) {
          const E = 10 * i / 400;
          const r = solve(E, V.V0, V.a, 1);
          pts.push([E, Math.pow(10, Math.max(-300, Math.min(0, r.log10T)))]);
        }
        const cur = solve(V.E, V.V0, V.a, 1);
        plot.set({ series: [{ pts, label: 'exact T(E)' }], vlines: [{ x: V.V0, label: 'V₀' }], marks: [{ x: V.E, y: Math.pow(10, Math.min(0, cur.log10T)), label: 'T = ' + fmtT(Math.min(0, cur.log10T)) }] });
      }

      /* ---------------- wave packet: Crank–Nicolson on a grid (nm, fs, eV) */
      let pk = null;
      function startPacket() {
        // cells of about 0.03 nm (finer for fast electrons), with the barrier covering a whole number of them exactly
        const cell = Math.min(0.03, 0.25 / Math.sqrt(V.E / H2M_EVNM2));
        const m = Math.max(2, Math.round(V.a / cell)), dx = V.a / m;
        const mL = Math.round(24 / dx), NG = mL + Math.round((V.a + 24) / dx);
        const XL = (0.5 - mL) * dx, XR = XL + (NG - 1) * dx, dtp = 0.01;
        const beta = H2M_EVNM2 / (dx * dx), g = dtp / (2 * HBAR_EVFS);
        const Vg = new Float64Array(NG), re = new Float64Array(NG), im = new Float64Array(NG);
        const cpr = new Float64Array(NG), cpi = new Float64Array(NG), imr = new Float64Array(NG), imi = new Float64Array(NG);
        const k0 = Math.sqrt(V.E / H2M_EVNM2), sig = 1.5, xc = -10;
        let norm = 0;
        for (let j = 0; j < NG; j++) {
          const x = XL + j * dx;
          Vg[j] = x > 0 && x < V.a ? V.V0 : 0;
          const env = Math.exp(-(x - xc) * (x - xc) / (4 * sig * sig));
          re[j] = env * Math.cos(k0 * x); im[j] = env * Math.sin(k0 * x);
          norm += (re[j] * re[j] + im[j] * im[j]) * dx;
        }
        const nf = 1 / Math.sqrt(norm);
        for (let j = 0; j < NG; j++) { re[j] *= nf; im[j] *= nf; }
        // LU of the implicit matrix: diagonal 1 + i g (2β + V), off-diagonal o = −i g β
        const oi = -g * beta;
        for (let j = 0; j < NG; j++) {
          let mr = 1, mi = g * (2 * beta + Vg[j]);
          if (j > 0) { // m = d − o·c'_{j−1}
            const pr_ = -oi * cpi[j - 1], pi_ = oi * cpr[j - 1];      // o·c' with o = (0, oi)
            mr -= pr_; mi -= pi_;
          }
          const d2 = mr * mr + mi * mi;
          imr[j] = mr / d2; imi[j] = -mi / d2;
          cpr[j] = -oi * imi[j]; cpi[j] = oi * imr[j];                 // c' = o / m
        }
        const v = 2 * H2M_EVNM2 * k0 / HBAR_EVFS;
        pk = { NG, XL, XR, dx, dtp, beta, g, oi, Vg, re, im, cpr, cpi, imr, imi, t: 0, tEnd: (20 + V.a) / Math.max(v, 1e-3), v, done: false,
               rr: new Float64Array(NG), ri: new Float64Array(NG), dr: new Float64Array(NG), di: new Float64Array(NG) };
      }
      function stepPacket() {
        const p = pk, N = p.NG, g = p.g, b = p.beta, oi = p.oi;
        const { re, im, rr, ri, dr, di } = p;
        for (let j = 0; j < N; j++) {
          const l_r = j > 0 ? re[j - 1] : 0, l_i = j > 0 ? im[j - 1] : 0, u_r = j < N - 1 ? re[j + 1] : 0, u_i = j < N - 1 ? im[j + 1] : 0;
          const sr = (2 * b + p.Vg[j]) * re[j] - b * (l_r + u_r), si = (2 * b + p.Vg[j]) * im[j] - b * (l_i + u_i);
          rr[j] = re[j] + g * si; ri[j] = im[j] - g * sr;
        }
        for (let j = 0; j < N; j++) {
          let xr = rr[j], xi = ri[j];
          if (j > 0) { xr -= -oi * di[j - 1]; xi -= oi * dr[j - 1]; }   // subtract o·d'_{j−1}
          dr[j] = xr * p.imr[j] - xi * p.imi[j]; di[j] = xr * p.imi[j] + xi * p.imr[j];
        }
        re[N - 1] = dr[N - 1]; im[N - 1] = di[N - 1];
        for (let j = N - 2; j >= 0; j--) {
          re[j] = dr[j] - (p.cpr[j] * re[j + 1] - p.cpi[j] * im[j + 1]);
          im[j] = di[j] - (p.cpr[j] * im[j + 1] + p.cpi[j] * re[j + 1]);
        }
        p.t += p.dtp;
      }

      let phase = 0;
      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const sol = solve(V.E, V.V0, V.a, 1);
        const packet = V.mode === 'packet';
        if (packet && !pk) startPacket();
        const X = packet ? [-14, V.a + 14] : [-3, V.a + 3];
        const Etop = Math.max(V.V0, V.E) * 1.3 + 0.3;
        // top: the energy diagram; bottom: the wave
        const bE = { x0: 50, x1: W - 14, y0: 12, y1: Math.round(Hh * 0.34) };
        const bW = { x0: 50, x1: W - 14, y0: Math.round(Hh * 0.42), y1: Hh - 34 };
        const axE = axes(c, C, bE, X, [0, Etop], { xticks: false, ylabel: 'energy (eV)', ylabelGap: 38, ny: 3 });
        const PX = axE.X, PY = axE.Y;
        c.save(); c.beginPath(); c.rect(bE.x0, bE.y0, bE.x1 - bE.x0, bE.y1 - bE.y0); c.clip();
        c.fillStyle = C.dark ? 'rgba(229,72,77,.22)' : 'rgba(229,72,77,.16)';
        c.fillRect(PX(0), PY(V.V0), PX(V.a) - PX(0), PY(0) - PY(V.V0));
        c.strokeStyle = C.bad; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(PX(X[0]), PY(0)); c.lineTo(PX(0), PY(0)); c.lineTo(PX(0), PY(V.V0)); c.lineTo(PX(V.a), PY(V.V0)); c.lineTo(PX(V.a), PY(0)); c.lineTo(PX(X[1]), PY(0)); c.stroke();
        c.setLineDash([6, 5]); c.strokeStyle = C.accent; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(PX(X[0]), PY(V.E)); c.lineTo(PX(X[1]), PY(V.E)); c.stroke(); c.setLineDash([]);
        c.restore();
        kit.label(c, 'electron energy E', bE.x1 - 6, PY(V.E) - 9, { size: 11.5, color: C.accent, align: 'right' });
        kit.label(c, 'V₀ = ' + fmt(V.V0, 3) + ' eV', PX(V.a) + 6, Math.max(bE.y0 + 8, PY(V.V0) - 9), { size: 11.5, color: C.bad });
        // the wave panel
        const prob = V.show === 'prob';
        const A = packet ? Math.sqrt(1 / Math.sqrt(2 * Math.PI * 1.5 * 1.5)) : 1;   // incident amplitude
        const yr = prob ? [0, 4.4 * A * A] : [-2.2 * A, 2.2 * A];
        const axW = axes(c, C, bW, X, yr, { xlabel: 'position x (nm)', ny: 4, fy: () => '' });
        const QY = axW.Y;
        c.save(); c.beginPath(); c.rect(bW.x0, bW.y0, bW.x1 - bW.x0, bW.y1 - bW.y0); c.clip();
        c.fillStyle = C.dark ? 'rgba(229,72,77,.12)' : 'rgba(229,72,77,.09)';
        c.fillRect(PX(0), bW.y0, PX(V.a) - PX(0), bW.y1 - bW.y0);
        // sample ψ (complex) across the window
        let xs = [], wr = [], wi = [];
        if (!packet) {
          phase += dt * 2 * Math.PI / 1.4;
          const N = Math.max(300, Math.floor(bW.x1 - bW.x0) * 2);
          for (let i = 0; i <= N; i++) {
            const x = X[0] + (X[1] - X[0]) * i / N;
            let w;
            if (x < 0) {           // incident + reflected, incidence normalized to 1
              const kx = sol.k * x;
              w = [Math.cos(kx) + sol.r[0] * Math.cos(kx) + sol.r[1] * Math.sin(kx), Math.sin(kx) - sol.r[0] * Math.sin(kx) + sol.r[1] * Math.cos(kx)];
            } else if (x <= V.a) {
              w = cdiv(sol.inside(x - V.a).v, sol.I);
            } else {
              const kx = sol.k * (x - V.a);
              w = cdiv([sol.s * Math.cos(kx), sol.s * Math.sin(kx)], sol.I);
            }
            // the stationary state turns its phase as e^(−iωt)
            const cs = Math.cos(phase), sn = Math.sin(phase);
            xs.push(x); wr.push(w[0] * cs + w[1] * sn); wi.push(w[1] * cs - w[0] * sn);
          }
        } else if (pk) {
          if (!pk.done) {
            const steps = clamp(Math.round(pk.tEnd / pk.dtp / 330), 1, 60);
            for (let k = 0; k < steps && pk.t < pk.tEnd; k++) stepPacket();
            if (pk.t >= pk.tEnd) pk.done = true;
          }
          for (let j = 0; j < pk.NG; j++) { xs.push(pk.XL + j * pk.dx); wr.push(pk.re[j]); wi.push(pk.im[j]); }
        }
        const n = xs.length;
        if (n) {
          c.fillStyle = C.dark ? 'rgba(123,140,255,.26)' : 'rgba(70,90,220,.18)';
          c.beginPath();
          if (prob) {
            c.moveTo(PX(xs[0]), QY(0));
            for (let i = 0; i < n; i++) c.lineTo(PX(xs[i]), QY(wr[i] * wr[i] + wi[i] * wi[i]));
            c.lineTo(PX(xs[n - 1]), QY(0));
          } else {           // the envelope ±|ψ|
            for (let i = 0; i < n; i++) { const m = Math.hypot(wr[i], wi[i]); i ? c.lineTo(PX(xs[i]), QY(m)) : c.moveTo(PX(xs[i]), QY(m)); }
            for (let i = n - 1; i >= 0; i--) c.lineTo(PX(xs[i]), QY(-Math.hypot(wr[i], wi[i])));
          }
          c.closePath(); c.fill();
          c.strokeStyle = C.accent; c.lineWidth = packet ? 1.3 : 2; c.beginPath();
          for (let i = 0; i < n; i++) { const v = prob ? wr[i] * wr[i] + wi[i] * wi[i] : wr[i]; i ? c.lineTo(PX(xs[i]), QY(v)) : c.moveTo(PX(xs[i]), QY(v)); }
          c.stroke();
        }
        c.restore();
        kit.label(c, prob ? '|ψ|²' : 'Re ψ, inside the envelope |ψ|', bW.x0 + 8, bW.y0 + 10, { size: 11.5, color: C.accent, weight: 600 });
        kit.label(c, 'barrier', (PX(0) + PX(V.a)) / 2, bW.y1 - 10, { size: 10.5, color: C.bad, align: 'center' });
        // numbers
        const exactL = Math.min(0, sol.log10T);
        ro.set('T', fmtT(exactL));
        if (sol.under) {
          const x = V.E / V.V0, l = Math.log10(16 * x * (1 - x)) - 2 * sol.q * V.a / Math.LN10;
          ro.set('Ta', fmtT(Math.min(0.5, l)) + (sol.q * V.a < 1 ? ' (barrier too thin for it)' : ''));
          ro.set('k', 'κ = ' + fmt(sol.q, 3) + ' nm⁻¹, decays over ' + fmt(1 / sol.q, 3) + ' nm');
        } else {
          ro.set('Ta', '— (E above the barrier)');
          ro.set('k', 'oscillates, λ = ' + fmt(2 * Math.PI / sol.q, 3) + ' nm');
        }
        ro.set('R', fmt(1 - Math.pow(10, exactL), 4));
        ro.set('Tp', fmtT(Math.min(0, solve(V.E, V.V0, V.a, MP / ME).log10T)));
        if (packet && pk) {
          let pt = 0, ptot = 0;
          for (let j = 0; j < pk.NG; j++) { const q = pk.re[j] * pk.re[j] + pk.im[j] * pk.im[j]; ptot += q; if (pk.XL + j * pk.dx > V.a) pt += q; }
          ro.set('pk', (pk.done ? 'finished: ' : 't = ' + fmt(pk.t, 3) + ' fs, ') + fmt(ptot > 0 ? pt / ptot * 100 : 0, 3) + ' % transmitted');
        } else ro.set('pk', '—');
      }
      updateGraph();
      const loop = kit.loop(dt => draw(dt), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

})();
