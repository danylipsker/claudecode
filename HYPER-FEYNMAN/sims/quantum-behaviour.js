/* HYPER-FEYNMAN · sims/quantum-behaviour.js — simulations of the Quantum Behaviour branch (content/quantum-behaviour.js).
 *   qb-watch              watching the electrons with light of a chosen wavelength: short waves see the slit but kick the
 *                         electron and wash out the fringes; long waves cannot tell the slits apart and the fringes return
 *   qb-slit-spread        the uncertainty principle as a slit narrowing: the fan of sideways momenta widens as h/B
 *   qb-packet             a wave packet and its momentum distribution (Fourier): Δx·Δk ≥ ½, reached only by a Gaussian
 *   qb-wave-particle      the wave and the particle pictures side by side: a Schrödinger packet and a cloud of classical
 *                         particles with the same spreads; detections as single clicks
 *   qb-arrow-rules        the rules of amplitudes with arrows: multiply along a route, add alternatives, square at the end
 *   qb-crystal            scattering from a row of atoms: amplitudes add into sharp peaks, spin-flip events add as probabilities
 *   qb-identical-scatter  two identical particles colliding: bosons twice the classical rate at 90°, fermions zero
 *   qb-laser              photons crowding into one state (n + 1): a laser growing from spontaneous emission
 *   qb-fill               filling energy levels two electrons at a time: bosons, fermions, and the shells of atoms
 *   qb-bell               the quantum cos² correlation against "hidden instructions": a Bell (CHSH) test
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const sinc = x => Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // a design frame W0 × H0 fitted into the stage
  const fit = (st, W0, H0) => { const s = Math.min(st.W / W0, st.H / H0); return { s, ox: (st.W - W0 * s) / 2, oy: (st.H - H0 * s) / 2 }; };
  const ff = () => (typeof getComputedStyle === 'function' && getComputedStyle(document.body).fontFamily) || 'sans-serif';
  const font = (c, size, weight) => { c.font = (weight || 500) + ' ' + (size || 12) + 'px ' + ff(); };
  const text = (c, s, x, y, o) => { o = o || {}; font(c, o.size || 12, o.weight); c.textAlign = o.align || 'center'; c.textBaseline = o.base || 'middle'; c.fillStyle = o.color; c.fillText(s, x, y); };
  // the colour of light of wavelength nm: the visible band as hues, ultraviolet violet, infrared a deep red
  function lightColor(nm, a) {
    const al = a == null ? 1 : a;
    if (nm < 380) return 'hsl(275 85% 64% / ' + al + ')';
    if (nm > 750) return 'hsl(0 70% 45% / ' + al + ')';
    const P = [[380, 270], [440, 240], [490, 185], [510, 125], [580, 58], [645, 5], [750, 0]];
    let h = 0;
    for (let i = 0; i + 1 < P.length; i++) if (nm <= P[i + 1][0]) { const f = (nm - P[i][0]) / (P[i + 1][0] - P[i][0]); h = P[i][1] + f * (P[i + 1][1] - P[i][1]); break; }
    return 'hsl(' + h.toFixed(0) + ' 90% 58% / ' + al + ')';
  }
  // a Poisson draw (Knuth for small means, a rounded normal for large ones)
  function poisson(mu, R, Q) {
    if (!(mu > 0)) return 0;
    if (mu > 40) return Math.max(0, Math.round(mu + Math.sqrt(mu) * Q.gauss(R)));
    const L = Math.exp(-mu); let k = 0, p = 1;
    do { k++; p *= R(); } while (p > L && k < 200);
    return k - 1;
  }
  const sci = (v, sig) => {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(v))), m = v / Math.pow(10, e);
    if (e >= -2 && e <= 3) return v.toPrecision(sig || 3);
    return m.toFixed((sig || 3) - 1) + '×10' + String(e).replace('-', '⁻').replace(/[0-9]/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
  };

  /* ================================================================ qb-watch */
  Hyper.sim('qb-watch', {
    title: 'Watching the electrons',
    blurb: `Electrons go one at a time through two slits 1 µm apart. A lamp shines light of the wavelength you choose just behind the wall. When an electron scatters a photon, a **flash** appears at the slit — sharp if the wavelength is short, a blur about λ/2 across if it is long — and the photon flies off with a random direction. Its up-and-down kick (the little arrow at the slit) shifts that electron's fringes by up to d/λ spacings. The graph compares what is counted with the fringes of unwatched electrons and with P₁ + P₂.

**Try this**
- Light at 0.5 µm, full brightness: every electron is seen at one slit, and after a few hundred arrivals the counted pattern follows P₁ + P₂ — no fringes.
- Turn the light off: the fringes build up again.
- Slide the wavelength up past 2 µm: the flash grows wider than the slits' spacing, so it can no longer tell which slit — and the fringes come back. There is no wavelength that does both.
- Dim the light to 0.5: half the electrons pass unseen and the fringe contrast is about half.
- Short wavelength, then tick *Keep only electrons whose photon gave no up–down kick*: for that selection the fringes return, even though the light is still on. What matters is what the photon could reveal, not whether the light is on.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1961);
      const W0 = 660, H0 = 360, GUN = 40, WALL = 230, SCREEN = 540, MID = 180, D = 80, SW = 10;
      const U = 6.5, NB = 104, NCONE = 0.1, AD = 0.2;          // screen ±6.5 fringe spacings; slit width = d/5
      const env = u => { const x = Math.PI * AD * u; return Math.abs(x) < 1e-9 ? 1 : Math.pow(Math.sin(x) / x, 2); };
      const yOf = u => MID + u * (H0 / 2 - 8) / U;
      // integrals of the envelope over the screen: E0 = ∫env, E1 = ∫env·cos 2πu, E2 = ∫env·cos² 2πu
      let E0 = 0, E1 = 0, E2 = 0;
      for (let i = 0; i < 4000; i++) { const u = -U + 2 * U * (i + 0.5) / 4000, e = env(u), c = Math.cos(TAU * u), du = 2 * U / 4000; E0 += e * du; E1 += e * c * du; E2 += e * c * c * du; }
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'light', type: 'check', label: 'Light on (watch the slits)', value: true },
        { id: 'lam', label: 'Wavelength of the light', min: 0.1, max: 20, value: 0.5, unit: 'µm', log: true, sig: 2 },
        { id: 'bright', label: 'Brightness: share of electrons that scatter a photon', min: 0, max: 1, step: 0.05, value: 1 },
        { id: 'cone', type: 'check', label: 'Keep only electrons whose photon gave no up–down kick', value: false },
        { id: 'rate', label: 'Electrons per second', min: 5, max: 400, step: 5, value: 120 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the screen', primary: true }] }
      ], id => { if (id !== 'rate') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Electrons counted'], ['blur', 'Blur of each flash (≈ λ/2)'], ['tell', 'Can the flash tell the slit?'], ['kick', 'One kick shifts the fringes by up to'], ['V', 'Fringe contrast expected'], ['Vm', 'Fringe contrast counted']]);
      const plot = kit.plot(gb, { x: { label: 'position on the screen (fringe spacings from the centre)', min: -U, max: U }, y: { label: 'probability (relative)', min: 0, max: 2.15 }, legend: true }, 170);
      let hits = [], bins = new Float64Array(NB), count = 0, dropped = 0, sumCos = 0, flashes = [], arrivals = [], acc = 0, tPlot = 0;
      const xk = () => TAU / V.lam;                            // 2π d/λ with d = 1 µm
      function expected() {
        const b = V.light ? V.bright : 0, w0 = 1 - b;
        const ws = V.cone ? b * NCONE : b, vs = V.cone ? sinc(xk() * NCONE) : sinc(xk());
        return (w0 + ws * vs) / Math.max(1e-9, w0 + ws);
      }
      function reset() {
        hits = []; bins = new Float64Array(NB); count = 0; dropped = 0; sumCos = 0; flashes = []; arrivals = []; acc = 0;
        updatePlot();
      }
      function updatePlot() {
        const Ve = expected(), pts0 = [], pts1 = [], pts2 = [];
        for (let i = 0; i <= 520; i++) { const u = -U + 2 * U * i / 520, e = env(u), c = Math.cos(TAU * u); pts0.push([u, e * (1 + c)]); pts1.push([u, e]); pts2.push([u, e * (1 + Ve * c)]); }
        const series = [{ pts: pts0, label: 'unwatched: |φ₁ + φ₂|²', dash: [4, 3], width: 1.3 }, { pts: pts1, label: 'P₁ + P₂ (bullets\' rule)', dash: [1, 3], width: 1.5 }, { pts: pts2, label: 'expected with this light', width: 2.2 }];
        if (count > 20) {
          const w = 2 * U / NB, Z = E0 + Ve * E1;
          series.push({ pts: Array.from(bins, (c, i) => [-U + (i + 0.5) * w, c / (count * w) * Z]), label: 'counted', line: false, dots: 2.4 });
        }
        plot.set({ series });
      }
      reset();
      function emit() {
        const seen = V.light && R() < V.bright;
        let n = 0, keep = true;
        if (seen) { n = 2 * R() - 1; keep = !V.cone || Math.abs(n) < NCONE; }   // n: up–down part of the photon's direction, uniform for isotropic scattering
        const shift = seen ? xk() * n : 0;
        let u = 0;
        for (let k = 0; k < 3000; k++) { u = (2 * R() - 1) * U; if (2 * R() <= env(u) * (1 + Math.cos(TAU * u + shift))) break; }
        if (seen) flashes.push({ slit: R() < 0.5 ? 1 : 2, t: 0, n, side: R() < 0.5 ? -1 : 1, keep });
        if (keep) {
          hits.push(u); if (hits.length > 5000) hits.shift();
          bins[clamp(Math.floor((u + U) / (2 * U) * NB), 0, NB - 1)]++; count++; sumCos += Math.cos(TAU * u);
        } else dropped++;
        arrivals.push({ u, t: 0, keep });
      }
      const loop = kit.loop(dt => {
        acc += dt * V.rate;
        let k = 0; while (acc >= 1 && k < 60) { emit(); acc -= 1; k++; }
        if (acc > 3) acc = 0;
        for (const f of flashes) f.t += dt; flashes = flashes.filter(f => f.t < 0.8);
        for (const a of arrivals) a.t += dt; arrivals = arrivals.filter(a => a.t < 0.5);
        tPlot += dt; if (tPlot > 0.3) { tPlot = 0; updatePlot(); }
        // read-outs
        const lam = V.lam, Ve = expected();
        ro.set('n', count + (dropped ? ' (' + dropped + ' left out)' : ''));
        ro.set('blur', V.light ? (lam / 2).toPrecision(2) + ' µm (slits 1 µm apart)' : '— (light off)');
        ro.set('tell', !V.light || V.bright === 0 ? 'nothing is seen' : lam / 2 < 0.6 ? 'yes' : lam / 2 < 1.2 ? 'barely' : 'no — the blur covers both slits');
        ro.set('kick', V.light ? (1 / lam).toPrecision(2) + ' fringe spacings' : '—');
        ro.set('V', (100 * Ve).toFixed(0) + ' %' + (Ve < -0.02 ? ' (shifted)' : ''));
        if (count > 60) {
          const m = sumCos / count, den = m * E1 - E2, Vm = Math.abs(den) > 1e-9 ? (E1 - m * E0) / den : 0;
          ro.set('Vm', (100 * clamp(Vm, -1.5, 1.5)).toFixed(0) + ' % ± ' + (100 * Math.sqrt(0.5 / count) * E0 / Math.max(0.05, E2)).toFixed(0));
        } else ro.set('Vm', 'counting…');
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        const y1 = MID - D / 2, y2 = MID + D / 2, lamNm = lam * 1000;
        // the electron beam up to the wall
        c.fillStyle = C.dark ? 'hsl(210 60% 60% / .10)' : 'hsl(210 60% 45% / .10)'; c.fillRect(GUN + 2, MID - 62, WALL - GUN - 2, 124);
        c.fillStyle = C.muted; c.fillRect(GUN - 28, MID - 10, 30, 20);
        text(c, 'electron gun', GUN - 12, MID + 26, { color: C.text, size: 11 });
        // the lamp and its light, drawn with the real ratio of wavelength to slit spacing
        const lx = WALL + 70, ly = H0 - 28, tx = WALL + 12, ty = MID;
        if (V.light) {
          const wl = D * lam, len = Math.hypot(tx - lx, ty - ly), ux = (tx - lx) / len, uy = (ty - ly) / len;
          c.strokeStyle = lightColor(lamNm, 0.5 + 0.5 * V.bright); c.lineWidth = 2;
          c.beginPath();
          if (wl < 5) { c.moveTo(lx, ly); c.lineTo(tx, ty); }
          else for (let s = 0; s <= len; s += 1.5) { const w = 6 * Math.sin(TAU * (s / wl) - 8 * loop.t); const px = lx + ux * s - uy * w, py = ly + uy * s + ux * w; if (s === 0) c.moveTo(px, py); else c.lineTo(px, py); }
          c.stroke();
          kit.dot(c, lx, ly, 10, lightColor(lamNm, 0.35 + 0.6 * V.bright), C.muted);
          text(c, 'λ = ' + (lam < 1 ? (lamNm).toFixed(0) + ' nm' : lam.toPrecision(2) + ' µm'), lx + 16, ly, { color: C.text, size: 11, align: 'left' });
          text(c, lamNm < 380 ? 'ultraviolet' : lamNm > 750 ? 'infrared' : 'visible', lx + 16, ly + 14, { color: C.muted, size: 10, align: 'left' });
        } else { kit.dot(c, lx, ly, 10, C.bg2, C.faint); text(c, 'light off', lx + 16, ly, { color: C.muted, size: 11, align: 'left' }); }
        // flashes at the slits, the kicks and the photons flying off
        for (const f of flashes) {
          const a = 1 - f.t / 0.8, sy = f.slit === 1 ? y1 : y2, r = clamp(D * lam / 4, 2.5, 170);
          c.fillStyle = lightColor(lamNm, 0.28 * a); c.beginPath(); c.arc(WALL + 4, sy, r, 0, TAU); c.fill();
          if (r < 20) { c.fillStyle = lightColor(lamNm, 0.8 * a); c.beginPath(); c.arc(WALL + 4, sy, Math.min(r, 4), 0, TAU); c.fill(); }
          const s = Math.sqrt(Math.max(0, 1 - f.n * f.n)), d = 14 + 110 * f.t;
          const col = f.keep ? lightColor(lamNm, 0.9 * a) : 'hsl(0 0% 55% / ' + (0.6 * a) + ')';
          kit.arrow(c, WALL + 4 + f.side * s * (d - 12), sy - f.n * (d - 12), WALL + 4 + f.side * s * d, sy - f.n * d, col, 1.6, 6);
          if (Math.abs(f.n) > 0.05) kit.arrow(c, WALL + 4, sy, WALL + 4, sy + f.n * 18, 'hsl(210 80% 60% / ' + a + ')', 2, 6);
        }
        // the wall and its slits
        c.fillStyle = C.text;
        c.fillRect(WALL - 3, 0, 6, y1 - SW / 2); c.fillRect(WALL - 3, y1 + SW / 2, 6, D - SW); c.fillRect(WALL - 3, y2 + SW / 2, 6, H0 - y2 - SW / 2);
        text(c, '1', WALL - 14, y1, { color: C.text, size: 12, weight: 600 }); text(c, '2', WALL - 14, y2, { color: C.text, size: 12, weight: 600 });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(WALL - 30, y1); c.lineTo(WALL - 30, y2); c.stroke();
        text(c, 'd = 1 µm', WALL - 58, MID, { color: C.muted, size: 10 });
        // the screen: every arrival a dot, recent ones as flashes, and the histogram of counts
        c.fillStyle = C.surface2 || C.bg2; c.fillRect(SCREEN, 0, 14, H0);
        c.fillStyle = C.text; for (let i = 0; i < hits.length; i++) c.fillRect(SCREEN + 2 + ((i * 7919) % 10), yOf(hits[i]) - 0.6, 1.4, 1.4);
        for (const a of arrivals) { const al = 1 - a.t / 0.5; c.fillStyle = a.keep ? 'hsl(48 100% 60% / ' + al + ')' : 'hsl(0 0% 55% / ' + (0.6 * al) + ')'; c.beginPath(); c.arc(SCREEN + 7, yOf(a.u), 2 + 5 * al, 0, TAU); c.fill(); }
        let mx = 1; for (let i = 0; i < NB; i++) mx = Math.max(mx, bins[i]);
        c.fillStyle = 'hsl(22 85% 55% / .8)';
        for (let i = 0; i < NB; i++) { const ya = yOf(-U + 2 * U * i / NB), yb = yOf(-U + 2 * U * (i + 1) / NB); c.fillRect(SCREEN + 18, ya, 90 * bins[i] / mx, Math.max(0.5, yb - ya - 0.4)); }
        text(c, 'screen', SCREEN + 7, H0 - 6, { color: C.muted, size: 10 }); text(c, 'counted', SCREEN + 62, H0 - 6, { color: C.muted, size: 10 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-slit-spread */
  Hyper.sim('qb-slit-spread', {
    title: 'A slit spreads the momenta',
    blurb: `Electrons of one momentum p arrive from the left, spread over a broad beam. Only those that hit the slit get through, so just behind it their sideways position y is known to within the slit width B. Each one then flies off in a direction drawn from the diffraction pattern: its sideways momentum p_y is spread over about h/B (the grey wedge is the central bright band, out to the first dark direction). Angles are drawn 1000 times larger than they really are. The graph shows the distribution of p_y: the curve is the prediction, the dots are the electrons counted.

**Try this**
- Narrow the slit from 1 µm to 0.2 µm: fewer electrons get through, and those that do fan out five times wider. Position known better, momentum worse.
- Widen it to 8 µm: a narrow beam of almost parallel electrons — but their y is only known to within 8 µm.
- Change the energy: faster electrons fan through smaller angles, but the spread of p_y, and the product B × h/B = h, stay the same.
- Read the product in the panel: whatever the slit, position spread × momentum spread is about h.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1927);
      const W0 = 660, H0 = 330, SRC = 20, WALL = 250, SC = 590, MID = 165, BEAM = 70, SPEED = 420, K = 1000, PX = 14;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'B', label: 'Width of the slit', min: 0.2, max: 8, value: 1, unit: 'µm', log: true, sig: 2 },
        { id: 'E', label: 'Energy of the electrons', min: 10, max: 1000, value: 50, unit: 'eV', log: true, sig: 2 },
        { id: 'rate', label: 'Electrons per second', min: 20, max: 500, step: 10, value: 200 },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear', primary: true }] }
      ], id => { if (id !== 'rate') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['lam', 'Electron wavelength λ = h/p'], ['th', 'First dark direction λ/B'], ['py', 'Sideways momentum there, h/B'], ['prod', 'B × h/B'], ['n', 'Through the slit / sent']]);
      const PU = 1e-28, XR = 40, NB = 80;                       // the graph's p_y axis in units of 10⁻²⁸ kg·m/s
      const plot = kit.plot(gb, { x: { label: 'sideways momentum p_y (10⁻²⁸ kg·m/s)', min: -XR, max: XR }, y: { label: 'probability (relative)', min: 0, max: 1.15 }, legend: true }, 160);
      let parts = [], hits = [], bins = new Float64Array(NB), through = 0, sent = 0, acc = 0, tp = 0, Z = 1, wallFlash = [];
      const pOf = () => Math.sqrt(2 * Q.me * V.E * Q.e);
      const f = (py) => { const x = Math.PI * py * V.B * 1e-6 / Q.h; return Math.abs(x) < 1e-9 ? 1 : Math.pow(Math.sin(x) / x, 2); };
      function reset() {
        parts = []; hits = []; bins = new Float64Array(NB); through = 0; sent = 0; acc = 0; wallFlash = [];
        // ∫ f dp_y over the sampled range (5 lobes each side), in graph units
        const P1 = Q.h / (V.B * 1e-6); Z = 0;
        for (let i = 0; i < 2000; i++) { const py = -5 * P1 + 10 * P1 * (i + 0.5) / 2000; Z += f(py) * 10 * P1 / 2000 / PU; }
        updatePlot();
      }
      function updatePlot() {
        const pts = [];
        for (let i = 0; i <= 600; i++) { const x = -XR + 2 * XR * i / 600; pts.push([x, f(x * PU)]); }
        const P1 = Q.h / (V.B * 1e-6) / PU, series = [{ pts, label: 'predicted: sinc²(π p_y B/h)' }];
        if (through > 20) { const w = 2 * XR / NB; series.push({ pts: Array.from(bins, (c, i) => [-XR + (i + 0.5) * w, c / (through * w) * Z]), label: 'counted', line: false, dots: 2.4 }); }
        plot.set({ series, vlines: P1 < XR ? [{ x: -P1, label: '−h/B' }, { x: P1, label: 'h/B' }] : [] });
      }
      reset();
      const loop = kit.loop(dt => {
        const p = pOf(), lam = Q.h / p, P1 = Q.h / (V.B * 1e-6), Bpx = clamp(PX * V.B, 3, 2 * BEAM - 4);
        acc += dt * V.rate;
        let k = 0;
        while (acc >= 1 && k < 40) { acc -= 1; k++; sent++; parts.push({ x: SRC, y: MID + (2 * R() - 1) * BEAM, through: false, vx: SPEED, vy: 0, py: 0 }); }
        if (acc > 3) acc = 0;
        for (const q of parts) {
          const nx = q.x + q.vx * dt;
          if (!q.through && nx >= WALL) {
            if (Math.abs(q.y - MID) < Bpx / 2) {
              let py = 0;
              for (let j = 0; j < 2000; j++) { py = (2 * R() - 1) * 5 * P1; if (R() <= f(py)) break; }
              const ang = Math.atan(K * py / p);
              q.through = true; q.py = py; q.vx = SPEED * Math.cos(ang); q.vy = SPEED * Math.sin(ang); through++;
            } else { q.dead = true; wallFlash.push({ y: q.y, t: 0 }); }
          }
          q.x = nx; q.y += q.vy * dt;
          if (q.through && q.x >= SC) {
            q.dead = true; hits.push(q.y); if (hits.length > 3000) hits.shift();
            const b = Math.floor((q.py / PU + XR) / (2 * XR) * NB); if (b >= 0 && b < NB) bins[b]++;
          }
          if (q.y < -20 || q.y > H0 + 20) q.dead = true;
        }
        parts = parts.filter(q => !q.dead);
        for (const w of wallFlash) w.t += dt; wallFlash = wallFlash.filter(w => w.t < 0.3);
        tp += dt; if (tp > 0.3) { tp = 0; updatePlot(); }
        ro.set('lam', (lam * 1e9).toPrecision(3) + ' nm');
        ro.set('th', (lam / (V.B * 1e-6) * 1e3).toPrecision(3) + ' mrad');
        ro.set('py', sci(P1, 3) + ' kg·m/s');
        ro.set('prod', sci(V.B * 1e-6 * P1, 3) + ' J·s = h');
        ro.set('n', through + ' / ' + sent);
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        // the central bright band out to the first dark direction, and the first side bands
        const th1 = Math.atan(K * P1 / p), L = SC - WALL;
        const wedge = (a0, a1, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(WALL, MID); c.lineTo(WALL + L, MID + L * Math.tan(clamp(a0, -1.5, 1.5))); c.lineTo(WALL + L, MID + L * Math.tan(clamp(a1, -1.5, 1.5))); c.closePath(); c.fill(); };
        wedge(-th1, th1, C.dark ? 'hsl(0 0% 100% / .08)' : 'hsl(0 0% 0% / .07)');
        const th2 = Math.atan(2 * K * P1 / p);
        wedge(th1, th2, C.dark ? 'hsl(0 0% 100% / .03)' : 'hsl(0 0% 0% / .025)'); wedge(-th2, -th1, C.dark ? 'hsl(0 0% 100% / .03)' : 'hsl(0 0% 0% / .025)');
        // the beam and the electrons
        c.fillStyle = C.dark ? 'hsl(210 60% 60% / .08)' : 'hsl(210 60% 45% / .08)'; c.fillRect(SRC, MID - BEAM, WALL - SRC, 2 * BEAM);
        for (const q of parts) kit.dot(c, q.x, q.y, 2.2, q.through ? C.accent : C.muted);
        for (const w of wallFlash) { c.fillStyle = 'hsl(0 70% 55% / ' + (0.6 * (1 - w.t / 0.3)) + ')'; c.fillRect(WALL - 5, w.y - 1, 4, 2); }
        // the wall and the slit
        c.fillStyle = C.text; c.fillRect(WALL - 3, 0, 6, MID - Bpx / 2); c.fillRect(WALL - 3, MID + Bpx / 2, 6, H0 - MID - Bpx / 2);
        text(c, 'B = ' + V.B.toPrecision(2) + ' µm', WALL, MID - Bpx / 2 - 12, { color: C.text, size: 11 });
        // momentum arrows at the slit: p forward, the fan ±h/B sideways (enlarged like the angles)
        const ax = WALL + 30, al = 80, sp = clamp(al * K * P1 / p, 0, 150);
        kit.arrow(c, ax, MID, ax + al, MID, C.text, 2); kit.arrow(c, ax, MID, ax + al, MID - sp, C.warn, 1.6); kit.arrow(c, ax, MID, ax + al, MID + sp, C.warn, 1.6);
        text(c, 'p', ax + al + 10, MID, { color: C.text, size: 12, weight: 600 });
        text(c, '± h/B', ax + al + 22, MID - sp - 2, { color: C.warn, size: 11, align: 'left' });
        // the screen
        c.fillStyle = C.surface2 || C.bg2; c.fillRect(SC, 0, 12, H0);
        c.fillStyle = C.text; for (let i = 0; i < hits.length; i++) c.fillRect(SC + 2 + ((i * 7919) % 8), hits[i] - 0.6, 1.4, 1.4);
        text(c, 'screen', SC + 6, H0 - 6, { color: C.muted, size: 10 });
        text(c, 'angles drawn ×1000', (WALL + SC) / 2, H0 - 8, { color: C.muted, size: 10 });
        text(c, 'beam of momentum p', (SRC + WALL) / 2, MID + BEAM + 14, { color: C.muted, size: 10 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-packet */
  Hyper.sim('qb-packet', {
    title: 'A packet and its momenta',
    blurb: `On the left, a wave packet ψ(x): the thin line is its real part, the filled curve the [[?probability-density|probability density]] |ψ|². On the right, the same state described by its wave numbers: |φ(k)|², the [[?fourier|Fourier]] content of the packet, which gives the momentum p = ħk. Δx and Δk are the [[?standard-deviation|standard deviations]] of the two curves. However you shape the packet, Δx·Δk never falls below ½ — Heisenberg's Δx·Δp ≥ ħ/2.

**Try this**
- Gaussian: make it narrower and watch |φ(k)|² grow wider in step. The product stays at exactly 0.50, the smallest possible.
- Change k₀: the momentum curve slides sideways and the wiggles of Re ψ get shorter, but Δx·Δk does not change.
- Two humps: the momentum curve grows fringes, like the two-slit pattern turned round — and the product jumps up.
- A box with sharp edges: the momentum curve has long tails, and Δk grows without limit as the edges get sharper (here it is cut off by the grid).
- A chirped Gaussian has the same |ψ|² as the plain one, but its wave number changes along the packet: more momenta, a larger product.
- The rotating wiggles are the arrow turning at every point (a global [[?phase]]): |ψ|² does not change, and no experiment can see this rotation.`,
    mount(box, kit) {
      const W0 = 680, H0 = 320, NX = 480, XL = 15, NK = 400, KL = 25, dxg = 2 * XL / NX, dkg = 2 * KL / NK;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Shape of the packet', options: [['Gaussian', 'gauss'], ['Flat top, soft edges', 'flat'], ['Box with sharp edges', 'box'], ['Two humps', 'two'], ['Chirped Gaussian', 'chirp']], value: 'gauss' },
        { id: 'w', label: 'Width parameter', min: 0.3, max: 5, value: 1.5, unit: 'nm', log: true, sig: 2 },
        { id: 'k0', label: 'Mean wave number k₀', min: -10, max: 10, step: 0.1, value: 5, unit: '1/nm' },
        { id: 'chirp', label: 'Chirp (for the chirped packet)', min: 0, max: 3, step: 0.05, value: 1 }
      ], () => build());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dx', 'Δx (spread of |ψ|²)'], ['dk', 'Δk (spread of |φ|²)'], ['prod', 'Δx·Δk (never below ½)'], ['dp', 'Δp = ħΔk'], ['lam', 'Wavelength 2π/k₀']]);
      const re = new Float64Array(NX), im = new Float64Array(NX), P = new Float64Array(NX), F2 = new Float64Array(NK);
      let mx = 0, sx = 1, mk = 0, sk = 1, maxP = 1, maxF = 1;
      function build() {
        const w = V.w, k0 = V.k0, sh = V.shape, h2 = Math.max(0.15, w / 3);
        let norm = 0;
        for (let j = 0; j < NX; j++) {
          const x = -XL + dxg * (j + 0.5);
          let a = 0, ph = k0 * x;
          if (sh === 'gauss' || sh === 'chirp') a = Math.exp(-x * x / (4 * w * w));
          else if (sh === 'flat') a = Math.exp(-0.5 * Math.pow(x / w, 8));
          else if (sh === 'box') a = Math.abs(x) < w * Math.sqrt(3) ? 1 : 0;
          else a = Math.exp(-(x - w) * (x - w) / (4 * h2 * h2)) + Math.exp(-(x + w) * (x + w) / (4 * h2 * h2));
          if (sh === 'chirp') ph += V.chirp * x * x / (2 * w * w);
          re[j] = a * Math.cos(ph); im[j] = a * Math.sin(ph); norm += a * a * dxg;
        }
        const s = Math.sqrt(Math.max(norm, 1e-300));
        let m1 = 0, m2 = 0; maxP = 1e-12;
        for (let j = 0; j < NX; j++) { re[j] /= s; im[j] /= s; P[j] = re[j] * re[j] + im[j] * im[j]; const x = -XL + dxg * (j + 0.5); m1 += P[j] * x * dxg; m2 += P[j] * x * x * dxg; maxP = Math.max(maxP, P[j]); }
        mx = m1; sx = Math.sqrt(Math.max(0, m2 - m1 * m1));
        // φ(k) = (1/√2π) Σ ψ(x) e^{−ikx} dx, the phase factor advanced by a rotation from one grid point to the next
        let n1 = 0, k1 = 0, k2 = 0; maxF = 1e-12;
        const x0 = -XL + dxg / 2;
        for (let i = 0; i < NK; i++) {
          const k = -KL + dkg * (i + 0.5), cd = Math.cos(-k * dxg), sd = Math.sin(-k * dxg);
          let cr = Math.cos(-k * x0), ci = Math.sin(-k * x0), sr = 0, si = 0;
          for (let j = 0; j < NX; j++) { sr += re[j] * cr - im[j] * ci; si += re[j] * ci + im[j] * cr; const t = cr * cd - ci * sd; ci = cr * sd + ci * cd; cr = t; }
          F2[i] = (sr * sr + si * si) * dxg * dxg / TAU;
          n1 += F2[i] * dkg; k1 += F2[i] * k * dkg; k2 += F2[i] * k * k * dkg; maxF = Math.max(maxF, F2[i]);
        }
        mk = k1 / Math.max(n1, 1e-300); sk = Math.sqrt(Math.max(0, k2 / Math.max(n1, 1e-300) - mk * mk));
        const hbar = kit.qm.hbar;
        ro.set('dx', sx.toFixed(3) + ' nm');
        ro.set('dk', sk.toFixed(3) + ' nm⁻¹' + (V.shape === 'box' ? ' (grows as edges sharpen)' : ''));
        ro.set('prod', (sx * sk).toFixed(3));
        ro.set('dp', sci(hbar * sk * 1e9, 3) + ' kg·m/s');
        ro.set('lam', Math.abs(V.k0) > 0.05 ? (TAU / Math.abs(V.k0)).toFixed(2) + ' nm' : '∞ (k₀ = 0)');
      }
      build();
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Fr = fit(st, W0, H0);
        c.save(); c.translate(Fr.ox, Fr.oy); c.scale(Fr.s, Fr.s);
        const LX0 = 20, LX1 = 330, RX0 = 350, RX1 = 660, WM = 88, WA = 52, PB = 292, PH = 118;
        const X = x => LX0 + (x + XL) / (2 * XL) * (LX1 - LX0), K = k => RX0 + (k + KL) / (2 * KL) * (RX1 - RX0);
        // frames
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(LX0, 16, LX1 - LX0, PB - 16); c.strokeRect(RX0, 16, RX1 - RX0, PB - 16);
        text(c, 'position: ψ(x) and |ψ|²', (LX0 + LX1) / 2, 8, { color: C.text, size: 12, weight: 600 });
        text(c, 'wave number: |φ(k)|²,  p = ħk', (RX0 + RX1) / 2, 8, { color: C.text, size: 12, weight: 600 });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(LX0, WM); c.lineTo(LX1, WM); c.moveTo(LX0, PB); c.lineTo(LX1, PB); c.moveTo(RX0, PB); c.lineTo(RX1, PB); c.stroke();
        // the wave, turning as a whole (a global phase)
        const g = 3 * t, cg = Math.cos(g), sg = Math.sin(g), aS = WA / Math.sqrt(maxP);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath();
        for (let j = 0; j < NX; j++) { const y = WM - aS * (im[j] * cg - re[j] * sg); if (j) c.lineTo(X(-XL + dxg * (j + 0.5)), y); else c.moveTo(X(-XL + dxg * (j + 0.5)), y); }
        c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath();
        for (let j = 0; j < NX; j++) { const y = WM - aS * (re[j] * cg + im[j] * sg); if (j) c.lineTo(X(-XL + dxg * (j + 0.5)), y); else c.moveTo(X(-XL + dxg * (j + 0.5)), y); }
        c.stroke();
        text(c, 'Re ψ', LX0 + 6, 26, { color: C.accent, size: 11, align: 'left' }); text(c, 'Im ψ', LX0 + 44, 26, { color: C.muted, size: 11, align: 'left' });
        // |ψ|² and |φ|² filled
        const fill = (arr, n, xOf, top, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(xOf(0), PB); for (let i = 0; i < n; i++) c.lineTo(xOf(i), PB - PH * arr[i] / top); c.lineTo(xOf(n - 1), PB); c.closePath(); c.fill(); };
        fill(P, NX, j => X(-XL + dxg * (j + 0.5)), maxP, 'hsl(28 90% 55% / .55)');
        fill(F2, NK, i => K(-KL + dkg * (i + 0.5)), maxF, 'hsl(265 75% 60% / .55)');
        // the spreads as bars: mean ± one standard deviation
        const bar = (xa, xb, y, col, lab) => { kit.arrow(c, (xa + xb) / 2, y, xa, y, col, 1.6, 6); kit.arrow(c, (xa + xb) / 2, y, xb, y, col, 1.6, 6); text(c, lab, (xa + xb) / 2, y - 9, { color: col, size: 11, weight: 600 }); };
        bar(X(mx - sx), X(mx + sx), PB - PH - 14, C.text, 'Δx = ' + sx.toFixed(2) + ' nm');
        bar(K(mk - sk), K(mk + sk), PB - PH - 14, C.text, 'Δk = ' + sk.toFixed(2) + ' nm⁻¹');
        // axes
        for (let x = -15; x <= 15; x += 5) { c.fillStyle = C.axis; c.fillRect(X(x) - 0.5, PB, 1, 4); text(c, String(x), X(x), PB + 12, { color: C.muted, size: 10 }); }
        for (let k = -20; k <= 20; k += 10) { c.fillStyle = C.axis; c.fillRect(K(k) - 0.5, PB, 1, 4); text(c, String(k), K(k), PB + 12, { color: C.muted, size: 10 }); }
        text(c, 'x (nm)', LX1 - 4, PB + 24, { color: C.muted, size: 10, align: 'right' }); text(c, 'k (nm⁻¹)', RX1 - 4, PB + 24, { color: C.muted, size: 10, align: 'right' });
        const pr = sx * sk;
        text(c, 'Δx·Δk = ' + pr.toFixed(2) + (pr < 0.505 ? '  — the minimum, ½' : '  > ½'), (RX0 + RX1) / 2, 34, { color: pr < 0.505 ? C.ok : C.warn, size: 13, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-wave-particle */
  Hyper.sim('qb-wave-particle', {
    title: 'Wave and particle, side by side',
    blurb: `The same electron described twice. **Top:** the wave — the real part of ψ (thin line) inside its envelope |ψ|, computed from the Schrödinger equation. **Middle:** the [[?probability-density|probability density]] |ψ|² (filled), with the positions of the classical cloud as a dashed outline. **Bottom:** the particle picture — a cloud of classical particles given the same spread of starting positions and speeds (Δx = σ₀, Δp = ħ/2σ₀), each moving in a straight line and bouncing off the walls. The dot rides the packet (group velocity); the triangle rides one crest (phase velocity). Units: ħ = m = 1 — for an electron with lengths in nanometres, one time unit is 8.6 fs and one speed unit 116 km/s.

**Try this**
- Press *Restart* and watch the triangle: the crests drift backwards through the packet at half its speed.
- Compare the widths in the panel and the graph: the wave and the cloud spread at exactly the same rate, as the formula σ₀√(1 + (t/2σ₀²)²) says.
- Let the packet hit the right-hand wall: where it overlaps its own reflection, |ψ|² breaks into fringes with gaps where the electron is never found. The cloud stays smooth. That is the difference between the pictures.
- *Detect 200 times* asks where the electron would be found in 200 repeats of the experiment at this instant: single clicks that pile up into |ψ|².
- *Look (collapse)* finds the electron once, with a resolution of about 1.5 units: the wave shrinks to the place found. Then compare: the wave now spreads fast (a narrower packet has more momenta), while the classical cloud, merely sorted by where it was seen, stays compact.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1924);
      const W0 = 680, H0 = 330, LB = 150, NP = 2000, M = 500, DT = 0.05, X0 = 40, RES = 1.5;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'k0', label: 'Wave number k₀ (momentum ħk₀)', min: 0.3, max: 2, step: 0.05, value: 1.2 },
        { id: 's0', label: 'Starting width σ₀', min: 1, max: 8, step: 0.1, value: 2.5 },
        { id: 'speed', label: 'Time steps per frame', min: 1, max: 30, step: 1, value: 8 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'det1', label: 'Detect once' }, { id: 'det200', label: 'Detect 200 times' }, { id: 'look', label: 'Look (collapse)' }] }
      ], id => {
        if (id === 'restart' || id === 'k0' || id === 's0') restart();
        else if (id === 'det1') detect(1); else if (id === 'det200') detect(200); else if (id === 'look') look();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['x', 'Mean position: wave / cloud'], ['s', 'Width σ: wave / cloud / free formula'], ['lam', 'Wavelength 2π/k₀'], ['v', 'Speed of packet / of crests'], ['det', 'Detections shown']]);
      const plot = kit.plot(gb, { x: { label: 'time (ħ = m = 1)', min: 0 }, y: { label: 'width σ', min: 0 }, legend: true }, 150);
      let w = null, cloud = [], t = 0, peak0 = 1, dets = [], flashes = [], crest = 0, collapsed = false, hist = { q: [], c: [], f: [] }, tRec = 0, sig0 = 2.5, x0now = X0;
      function stats() {
        const p = w.prob(); let s = 0, s1 = 0, s2 = 0;
        for (let j = 0; j < NP; j++) { s += p[j]; s1 += p[j] * w.x[j]; s2 += p[j] * w.x[j] * w.x[j]; }
        const mq = s1 / s; let c1 = 0, c2 = 0;
        for (const q of cloud) { c1 += q.x; c2 += q.x * q.x; }
        const mc = c1 / cloud.length;
        return { p, mq, sq: Math.sqrt(Math.max(0, s2 / s - mq * mq)), mc, sc: Math.sqrt(Math.max(0, c2 / cloud.length - mc * mc)) };
      }
      function restart() {
        sig0 = V.s0; x0now = X0; t = 0; dets = []; flashes = []; collapsed = false; hist = { q: [], c: [], f: [] }; tRec = 0;
        w = Q.wave1d({ N: NP, L: LB, m: 1, hbar: 1, dt: DT }).setGaussian({ x0: X0, sigma: sig0, k0: V.k0 });
        cloud = [];
        for (let i = 0; i < M; i++) cloud.push({ x: X0 + sig0 * Q.gauss(R), v: V.k0 + Q.gauss(R) / (2 * sig0) });
        let mp = 0; const p = w.prob(); for (let j = 0; j < NP; j++) mp = Math.max(mp, p[j]); peak0 = mp;
        const lam = TAU / V.k0; crest = Math.round(X0 / lam) * lam;
        record(); updatePlot();
      }
      function record() {
        const S = stats();
        hist.q.push([t, S.sq]); hist.c.push([t, S.sc]);
        if (!collapsed) hist.f.push([t, sig0 * Math.sqrt(1 + Math.pow(t / (2 * sig0 * sig0), 2))]);
        if (hist.q.length > 400) { hist.q.shift(); hist.c.shift(); if (hist.f.length > 400) hist.f.shift(); }
      }
      function updatePlot() {
        const tHit = (LB - X0 - 2 * sig0) / Math.max(0.05, V.k0);
        plot.set({ series: [{ pts: hist.q, label: 'wave (std of |ψ|²)' }, { pts: hist.c, label: 'classical cloud', dash: [5, 4] }, { pts: hist.f, label: 'free formula', dash: [1, 3], width: 1.5 }],
          vlines: !collapsed && tHit > 0 ? [{ x: tHit, label: 'reaches the wall' }] : [] });
      }
      function sample() { const p = w.prob(); let s = 0; for (let j = 0; j < NP; j++) s += p[j]; let u = R() * s; for (let j = 0; j < NP; j++) { u -= p[j]; if (u <= 0) return w.x[j]; } return w.x[NP - 1]; }
      function detect(n) { for (let i = 0; i < n; i++) dets.push(sample()); if (dets.length > 1200) dets = dets.slice(-1200); if (n === 1) flashes.push({ x: dets[dets.length - 1], t: 0 }); }
      function look() {
        const xf = sample(); flashes.push({ x: xf, t: 0 }); dets = [];
        // the wave: multiplied by the detector's window and renormalised
        for (let j = 0; j < NP; j++) { const f = Math.exp(-Math.pow(w.x[j] - xf, 2) / (4 * RES * RES)); w.re[j] *= f; w.im[j] *= f; }
        const s = Math.sqrt(w.norm()); for (let j = 0; j < NP; j++) { w.re[j] /= s; w.im[j] /= s; }
        // the cloud: sorted by where it was seen (the same window as a likelihood), then redrawn from the survivors
        const wt = cloud.map(q => Math.exp(-Math.pow(q.x - xf, 2) / (2 * RES * RES))), tot = wt.reduce((a, b) => a + b, 0);
        if (tot > 1e-12) {
          const old = cloud; cloud = [];
          for (let i = 0; i < M; i++) { let u = R() * tot, k = 0; while (k < old.length - 1 && (u -= wt[k]) > 0) k++; cloud.push({ x: old[k].x + 0.2 * Q.gauss(R), v: old[k].v }); }
        } else cloud = cloud.map(() => ({ x: xf + RES * Q.gauss(R), v: V.k0 }));
        collapsed = true; updatePlot();
      }
      restart();
      const loop = kit.loop(dt => {
        const n = dt > 0 ? V.speed : 0;
        if (n) {
          w.step(n);
          for (let s = 0; s < n; s++) for (const q of cloud) { q.x += q.v * DT; if (q.x < 0) { q.x = -q.x; q.v = -q.v; } if (q.x > LB) { q.x = 2 * LB - q.x; q.v = -q.v; } }
          t += n * DT; crest += (V.k0 / 2) * n * DT;
          tRec += n * DT; if (tRec >= 1) { tRec = 0; record(); updatePlot(); }
        }
        for (const f of flashes) f.t += dt; flashes = flashes.filter(f => f.t < 1.2);
        const S = stats(), lam = TAU / V.k0;
        // keep the marked crest inside the packet: when it falls behind, move to a crest near the front
        if (crest < S.mq - 1.5 * S.sq) crest += Math.ceil((S.mq + 0.5 * S.sq - crest) / lam) * lam;
        if (crest > S.mq + 2 * S.sq) crest -= Math.ceil((crest - S.mq) / lam) * lam;
        ro.set('t', t.toFixed(1) + ' (' + (t * 8.64).toFixed(0) + ' fs for an electron in nm)');
        ro.set('x', S.mq.toFixed(1) + ' / ' + S.mc.toFixed(1));
        ro.set('s', S.sq.toFixed(2) + ' / ' + S.sc.toFixed(2) + ' / ' + (collapsed ? '—' : (sig0 * Math.sqrt(1 + Math.pow(t / (2 * sig0 * sig0), 2))).toFixed(2)));
        ro.set('lam', lam.toFixed(2));
        ro.set('v', V.k0.toFixed(2) + ' / ' + (V.k0 / 2).toFixed(2));
        ro.set('det', String(dets.length));
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        const XA = 20, XB = 660, X = x => XA + x / LB * (XB - XA), WM = 62, WA = 40, PB = 205, PH = 95, CB0 = 232, CB1 = 312;
        const aS = WA / Math.sqrt(peak0);
        // walls
        c.fillStyle = C.text; c.fillRect(XA - 4, 10, 4, H0 - 20); c.fillRect(XB, 10, 4, H0 - 20);
        // the wave: envelope and real part
        c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); for (let j = 0; j < NP; j++) { const a = Math.sqrt(S.p[j]); j ? c.lineTo(X(w.x[j]), WM - aS * a) : c.moveTo(X(w.x[j]), WM - aS * a); } c.stroke();
        c.beginPath(); for (let j = 0; j < NP; j++) { const a = Math.sqrt(S.p[j]); j ? c.lineTo(X(w.x[j]), WM + aS * a) : c.moveTo(X(w.x[j]), WM + aS * a); } c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 1.3; c.beginPath();
        for (let j = 0; j < NP; j++) { const y = WM - clamp(aS * w.re[j], -58, 58); j ? c.lineTo(X(w.x[j]), y) : c.moveTo(X(w.x[j]), y); }
        c.stroke();
        text(c, 'the wave: Re ψ inside its envelope |ψ|', XA + 8, 12, { color: C.muted, size: 11, align: 'left' });
        // markers: the packet (group velocity) and one crest (phase velocity)
        kit.dot(c, X(S.mq), WM - WA - 12, 4.5, C.warn);
        c.fillStyle = C.ok; c.beginPath(); c.moveTo(X(crest), WM - WA - 4); c.lineTo(X(crest) - 5, WM - WA - 14); c.lineTo(X(crest) + 5, WM - WA - 14); c.closePath(); c.fill();
        // probability density and the cloud's histogram
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(XA, PB); c.lineTo(XB, PB); c.stroke();
        c.fillStyle = 'hsl(28 90% 55% / .55)'; c.beginPath(); c.moveTo(X(w.x[0]), PB);
        for (let j = 0; j < NP; j++) c.lineTo(X(w.x[j]), PB - Math.min(PH + 8, PH * S.p[j] / peak0));
        c.lineTo(X(w.x[NP - 1]), PB); c.closePath(); c.fill();
        const NBC = 100, hc = new Float64Array(NBC); for (const q of cloud) hc[clamp(Math.floor(q.x / LB * NBC), 0, NBC - 1)]++;
        const cs = PH / (peak0 * M * LB / NBC);
        c.strokeStyle = C.text; c.lineWidth = 1.3; c.setLineDash([4, 3]); c.beginPath();
        for (let i = 0; i < NBC; i++) { const y = PB - Math.min(PH + 8, hc[i] * cs); if (i) c.lineTo(X(i * LB / NBC), y); else c.moveTo(X(0), y); c.lineTo(X((i + 1) * LB / NBC), y); }
        c.stroke(); c.setLineDash([]);
        text(c, '|ψ|² (filled) and the classical cloud (dashed)', XA + 8, PB - PH - 6, { color: C.muted, size: 11, align: 'left' });
        // detections as ticks under the axis, recent ones as flashes
        c.fillStyle = C.text; for (const x of dets) c.fillRect(X(x) - 0.5, PB + 2, 1, 8);
        for (const f of flashes) { const a = 1 - f.t / 1.2; c.fillStyle = 'hsl(48 100% 60% / ' + a + ')'; c.beginPath(); c.arc(X(f.x), PB, 4 + 10 * a, 0, TAU); c.fill(); c.fillRect(X(f.x) - 1, CB0, 2, CB1 - CB0); }
        // the particle picture
        c.fillStyle = C.dark ? 'hsl(0 0% 100% / .03)' : 'hsl(0 0% 0% / .03)'; c.fillRect(XA, CB0, XB - XA, CB1 - CB0);
        for (let i = 0; i < cloud.length; i++) kit.dot(c, X(cloud[i].x), CB0 + 6 + ((i * 7919) % 97) / 97 * (CB1 - CB0 - 12), 1.7, 'hsl(210 80% 60%)');
        text(c, 'the particle picture: classical particles with the same Δx and Δp', XA + 8, CB1 + 10, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-arrow-rules */
  const deg = r => ((r * 180 / Math.PI) % 360 + 360) % 360;
  Hyper.sim('qb-arrow-rules', {
    title: 'The rules of the arrows',
    blurb: `A particle goes from the source s to a point x on a screen, by way of slit 1 or slit 2. Each step has an [[?amplitude]] — an arrow — shown on the four dials; **drag the tips** to change their lengths and directions. Along each route the arrows **multiply**: lengths multiply, angles add (middle). The two routes are alternatives, so their products **add**, head to tail (right). The probability is the **square** of the length of the total (bars) — compare it with P₁ + P₂, what adding probabilities would give.

**Try this**
- Press *Dark fringe*: the two route arrows point opposite ways and cancel, though each route alone is possible.
- Press *Scan the screen*: the point x moves along the screen, the arrows ⟨x|1⟩ and ⟨x|2⟩ turn by 360° per wavelength of path, and the graph draws the fringes.
- Lower the marker overlap g (a which-way mark left behind, like a scattered photon): the interference term shrinks by g and the bars approach P₁ + P₂. At g = 0 the arrows are squared separately.
- Make one arrow of a route very short: that route hardly contributes, and the fringes fade.`,
    mount(box, kit) {
      const W0 = 700, H0 = 380, RD = 40;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 280 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'Which-way marker overlap g (1 = no marker)', min: 0, max: 1, step: 0.05, value: 1 },
        { type: 'buttons', items: [{ id: 'dark', label: 'Dark fringe' }, { id: 'bright', label: 'Bright fringe' }, { id: 'rand', label: 'Random arrows' }, { id: 'scan', label: 'Scan the screen', primary: true }] }
      ], id => {
        if (id === 'dark' || id === 'bright') { const p1 = prod(0), p2 = prod(1); A[3].th += (id === 'dark' ? Math.PI : 0) + (p1.th - p2.th); scan = null; }
        if (id === 'rand') { for (const a of A) { a.r = 0.3 + 0.7 * Math.random(); a.th = TAU * Math.random(); } scan = null; }
        if (id === 'scan') { scan = 0; trace = []; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r1', 'Route 1: ⟨x|1⟩⟨1|s⟩'], ['r2', 'Route 2: ⟨x|2⟩⟨2|s⟩'], ['sum', 'Sum of the routes'], ['P', 'Probability, with the marker'], ['Pc', 'P₁ + P₂ (adding probabilities)']]);
      const plot = kit.plot(gb, { x: { label: 'point x on the screen (wavelengths from the centre)', min: -6, max: 6 }, y: { label: 'probability', min: 0 }, legend: true }, 150);
      // the four step arrows: ⟨1|s⟩, ⟨x|1⟩, ⟨2|s⟩, ⟨x|2⟩, each on its dial
      const A = [{ r: 0.7, th: 0.5, name: '⟨1|s⟩', cx: 70, cy: 235 }, { r: 0.8, th: 1.8, name: '⟨x|1⟩', cx: 190, cy: 235 },
                 { r: 0.7, th: 0.5, name: '⟨2|s⟩', cx: 70, cy: 330 }, { r: 0.8, th: 2.6, name: '⟨x|2⟩', cx: 190, cy: 330 }];
      const prod = i => ({ r: A[2 * i].r * A[2 * i + 1].r, th: A[2 * i].th + A[2 * i + 1].th });
      let scan = null, trace = [], F = { s: 1, ox: 0, oy: 0 };
      // the scan: slits ±1.5 λ apart from the centre line, screen 10 λ away; ⟨x|k⟩ turns by 2π per wavelength of path
      const pathTo = (xs, k) => Math.hypot(10, xs - (k ? 1.5 : -1.5));
      kit.drag(st, {
        hit(p) { const x = (p.x - F.ox) / F.s, y = (p.y - F.oy) / F.s; for (let i = 0; i < 4; i++) if (Math.hypot(x - A[i].cx, y - A[i].cy) < RD + 8) return i; return null; },
        move(i, p) { const x = (p.x - F.ox) / F.s - A[i].cx, y = (p.y - F.oy) / F.s - A[i].cy; A[i].r = clamp(Math.hypot(x, y) / RD, 0, 1); A[i].th = Math.atan2(-y, x); scan = null; },
        hover: true
      });
      const loop = kit.loop(dt => {
        if (scan != null) {
          scan += dt / 7; const xs = -6 + 12 * Math.min(1, scan);
          A[1].th = TAU * pathTo(xs, 0) + 0.3; A[3].th = TAU * pathTo(xs, 1) + 0.3; A[1].r = A[3].r = 0.8; A[0].r = A[2].r = 0.7; A[0].th = A[2].th = 0.5;
          const p1 = prod(0), p2 = prod(1), re = p1.r * Math.cos(p1.th) + p2.r * Math.cos(p2.th), im = p1.r * Math.sin(p1.th) + p2.r * Math.sin(p2.th);
          const Pc = p1.r * p1.r + p2.r * p2.r, P = Pc + V.g * (re * re + im * im - Pc);
          trace.push([xs, P, Pc]);
          plot.set({ series: [{ pts: trace.map(q => [q[0], q[1]]), label: '|φ₁ + φ₂|² with the marker' }, { pts: trace.map(q => [q[0], q[2]]), label: 'P₁ + P₂', dash: [5, 4] }] });
          if (scan >= 1) scan = null;
        }
        const p1 = prod(0), p2 = prod(1);
        const z1 = { re: p1.r * Math.cos(p1.th), im: p1.r * Math.sin(p1.th) }, z2 = { re: p2.r * Math.cos(p2.th), im: p2.r * Math.sin(p2.th) };
        const tre = z1.re + z2.re, tim = z1.im + z2.im, P1 = p1.r * p1.r, P2 = p2.r * p2.r, Pc = P1 + P2, Pcoh = tre * tre + tim * tim, P = Pc + V.g * (Pcoh - Pc);
        ro.set('r1', p1.r.toFixed(2) + ' at ' + deg(p1.th).toFixed(0) + '°'); ro.set('r2', p2.r.toFixed(2) + ' at ' + deg(p2.th).toFixed(0) + '°');
        ro.set('sum', Math.sqrt(Pcoh).toFixed(3) + ' at ' + deg(Math.atan2(tim, tre)).toFixed(0) + '°');
        ro.set('P', P.toFixed(3)); ro.set('Pc', Pc.toFixed(3));
        // drawing
        const c = st.begin(), C = kit.colors(); F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        const c1 = 'hsl(210 85% 58%)', c2 = 'hsl(22 90% 56%)';
        // the routes
        const S = [40, 95], N1 = [150, 50], N2 = [150, 140], X = [270, 95];
        c.lineWidth = 2; c.strokeStyle = c1; c.beginPath(); c.moveTo(S[0], S[1]); c.lineTo(N1[0], N1[1]); c.lineTo(X[0], X[1]); c.stroke();
        c.strokeStyle = c2; c.beginPath(); c.moveTo(S[0], S[1]); c.lineTo(N2[0], N2[1]); c.lineTo(X[0], X[1]); c.stroke();
        c.fillStyle = C.text; c.fillRect(146, 10, 8, 34); c.fillRect(146, 56, 8, 78); c.fillRect(146, 146, 8, 30);
        for (const [p, l] of [[S, 's'], [X, 'x']]) { kit.dot(c, p[0], p[1], 6, C.text); text(c, l, p[0], p[1] - 14, { color: C.text, size: 13, weight: 600 }); }
        text(c, 'slit 1', 124, 50, { color: c1, size: 11 }); text(c, 'slit 2', 124, 140, { color: c2, size: 11 });
        text(c, 'two routes from s to x', 150, 190, { color: C.muted, size: 11 });
        // the dials of the four steps
        const dial = (cx, cy, r, th, col, lab, sub) => {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, RD, 0, TAU); c.stroke();
          c.beginPath(); c.moveTo(cx - RD, cy); c.lineTo(cx + RD, cy); c.moveTo(cx, cy - RD); c.lineTo(cx, cy + RD); c.stroke();
          kit.arrow(c, cx, cy, cx + RD * r * Math.cos(th), cy - RD * r * Math.sin(th), col, 2.4, 8);
          if (r > 0.02) kit.dot(c, cx + RD * r * Math.cos(th), cy - RD * r * Math.sin(th), 4, col);
          text(c, lab, cx, cy - RD - 10, { color: C.text, size: 12, weight: 600 });
          text(c, sub, cx, cy + RD + 10, { color: C.muted, size: 10 });
        };
        A.forEach((a, i) => dial(a.cx, a.cy, a.r, a.th, i < 2 ? c1 : c2, a.name, a.r.toFixed(2) + ' ∠ ' + deg(a.th).toFixed(0) + '°'));
        text(c, '×', 130, 235, { color: C.text, size: 18, weight: 600 }); text(c, '×', 130, 330, { color: C.text, size: 18, weight: 600 });
        // the products
        const P0 = [[320, 235], [320, 330]];
        text(c, '=', 258, 235, { color: C.text, size: 18, weight: 600 }); text(c, '=', 258, 330, { color: C.text, size: 18, weight: 600 });
        dial(P0[0][0], P0[0][1], p1.r, p1.th, c1, 'route 1', p1.r.toFixed(2) + ' ∠ ' + deg(p1.th).toFixed(0) + '°');
        dial(P0[1][0], P0[1][1], p2.r, p2.th, c2, 'route 2', p2.r.toFixed(2) + ' ∠ ' + deg(p2.th).toFixed(0) + '°');
        text(c, 'multiply: lengths ×, angles +', 320, 190, { color: C.muted, size: 11 });
        // add head to tail
        const bx = 470, by = 120, sc = 110 / Math.max(0.15, p1.r + p2.r);
        c.strokeStyle = C.grid; c.strokeRect(bx - 115, by - 110, 230, 220);
        text(c, 'add the routes, head to tail', bx, by - 120, { color: C.muted, size: 11 });
        const ax = bx + sc * z1.re, ay = by - sc * z1.im, tx = ax + sc * z2.re, ty = ay - sc * z2.im;
        kit.arrow(c, bx, by, ax, ay, c1, 2.4, 8); kit.arrow(c, ax, ay, tx, ty, c2, 2.4, 8);
        if (Math.hypot(tx - bx, ty - by) > 2) kit.arrow(c, bx, by, tx, ty, C.text, 3.2, 10); else kit.dot(c, bx, by, 4, C.bad);
        text(c, Pcoh < 1e-4 ? 'the arrows cancel' : 'total ' + Math.sqrt(Pcoh).toFixed(3), bx, by + 98, { color: C.text, size: 11, weight: 600 });
        // square: bars
        const BX = 610, BY = 350, BH = 250, top = Math.pow(p1.r + p2.r, 2) || 1;
        const bar = (x, v, col, lab) => { const h = BH * v / top; c.fillStyle = col; c.fillRect(x - 14, BY - h, 28, h); text(c, lab, x, BY + 12, { color: C.text, size: 11 }); text(c, v.toFixed(3), x, BY - h - 9, { color: C.text, size: 10 }); };
        bar(BX - 36, P, C.accent, 'P'); bar(BX + 30, Pc, C.faint, 'P₁ + P₂');
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(BX - 70, BY); c.lineTo(BX + 70, BY); c.stroke();
        text(c, 'square the total', BX, BY - BH - 22, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-crystal */
  Hyper.sim('qb-crystal', {
    title: 'Scattering from a row of atoms',
    blurb: `A beam comes down onto a row of atoms and a detector waits in the direction θ. Each atom scatters with an [[?amplitude|arrow]] of the same length; from one atom to the next the arrow turns by the extra path a·sin θ, measured in wavelengths. **If the atom is left unchanged**, nothing tells which atom scattered, so the arrows add head to tail (right): in some directions they line up into a long arrow — a sharp peak, N² times one atom — and elsewhere they curl up and cancel. **If the scattering flips an atom's spin**, that atom is marked: those events add as probabilities, a smooth background only N times one atom. The graph (per atom, on a logarithmic scale) shows both.

**Try this**
- Press *Scan*: watch the chain of arrows straighten at every peak and curl into a closed polygon in between.
- Add atoms: the peaks grow as N and narrow as 1/N, while the background per atom stays put.
- Set the spacing below one wavelength: only the straight-through peak survives.
- Raise the spin-flip share: the peaks shrink by (1 − f) and the floor rises to f.`,
    mount(box, kit) {
      const W0 = 700, H0 = 330;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 260 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Number of atoms N', min: 2, max: 40, step: 1, value: 12 },
        { id: 'a', label: 'Spacing of the atoms (wavelengths)', min: 0.5, max: 4, step: 0.05, value: 1.5 },
        { id: 'f', label: 'Share of scatterings that flip a spin', min: 0, max: 0.5, step: 0.01, value: 0.2 },
        { id: 'th', label: 'Direction of the detector θ', min: -70, max: 70, step: 0.5, value: 0, unit: '°' },
        { type: 'buttons', items: [{ id: 'scan', label: 'Scan', primary: true }] }
      ], id => { if (id === 'scan') scan = -70; else if (id !== 'th') curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ph', 'Turn from one atom\'s arrow to the next'], ['coh', 'Coherent part |Σ arrows|² (per atom)'], ['bg', 'Spin-flip background (per atom)'], ['ratio', 'Peak / background, N(1 − f)/f']]);
      const plot = kit.plot(gb, { x: { label: 'direction of the detector θ (°)', min: -70, max: 70 }, y: { label: 'intensity per atom', log: true, min: 0.005 }, legend: true }, 160);
      let scan = null, t = 0;
      const coherent = (th, N, a) => { const ph = TAU * a * Math.sin(th * Math.PI / 180); let re = 0, im = 0; for (let j = 0; j < N; j++) { re += Math.cos(j * ph); im += Math.sin(j * ph); } return (re * re + im * im) / N; };
      function curve() {
        const N = Math.round(V.N), f = V.f, co = [], bg = [], tot = [];
        for (let i = 0; i <= 700; i++) { const th = -70 + 140 * i / 700, ch = (1 - f) * coherent(th, N, V.a); co.push([th, Math.max(0.005, ch)]); bg.push([th, Math.max(0.005, f)]); tot.push([th, Math.max(0.005, ch + f)]); }
        plot.set({ series: [{ pts: tot, label: 'total' }, { pts: co, label: 'coherent (arrows added)', dash: [4, 3], width: 1.4 }, { pts: bg, label: 'spin flip (probabilities added)', dash: [1, 3], width: 1.6 }], y: { label: 'intensity per atom', log: true, min: 0.005, max: 1.3 * Math.max(1, N) } });
      }
      curve();
      const loop = kit.loop(dt => {
        t += dt;
        if (scan != null) { scan += 14 * dt; ctl.set('th', Math.min(70, Math.round(scan * 2) / 2)); if (scan >= 70) scan = null; }
        const N = Math.round(V.N), f = V.f, a = V.a, th = V.th * Math.PI / 180, ph = TAU * a * Math.sin(th);
        const coh = (1 - f) * coherent(V.th, N, a);
        ro.set('ph', deg(ph).toFixed(0) + '° (' + (a * Math.sin(th)).toFixed(2) + ' λ of path)');
        ro.set('coh', coh.toFixed(3)); ro.set('bg', f.toFixed(3));
        ro.set('ratio', f > 0 ? (N * (1 - f) / f).toFixed(0) : 'no background');
        plot.set({ vlines: [{ x: V.th, label: 'detector' }] });
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        const RY = 110, sp = Math.min(26, 330 / Math.max(1, N - 1)), x0 = 210 - sp * (N - 1) / 2;
        // incoming wavefronts moving down
        c.strokeStyle = C.dark ? 'hsl(200 70% 65% / .35)' : 'hsl(200 70% 40% / .35)'; c.lineWidth = 1.5;
        for (let k = 0; k < 5; k++) { const y = 10 + ((t * 30 + k * 18) % 90); c.beginPath(); c.moveTo(x0 - 20, y); c.lineTo(x0 + sp * (N - 1) + 20, y); c.stroke(); }
        kit.arrow(c, 30, 20, 30, 80, C.muted, 2); text(c, 'beam', 30, 12, { color: C.muted, size: 10 });
        // rays towards the detector, with moving dashes
        const ux = Math.sin(th), uy = Math.cos(th);
        c.strokeStyle = C.dark ? 'hsl(48 90% 60% / .5)' : 'hsl(40 90% 40% / .5)'; c.lineWidth = 1; c.setLineDash([6, 6]); c.lineDashOffset = -t * 30;
        for (let j = 0; j < N; j++) { const ax = x0 + j * sp; c.beginPath(); c.moveTo(ax, RY); c.lineTo(ax + 190 * ux, RY + 190 * uy); c.stroke(); }
        c.setLineDash([]); c.lineDashOffset = 0;
        // the atoms (a few marked as flipped, in proportion f)
        for (let j = 0; j < N; j++) { const flip = ((j * 7 + 3) % 10) < Math.round(10 * f); kit.dot(c, x0 + j * sp, RY, 5, flip ? C.bad : C.accent, C.text); if (flip) { c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0 + j * sp, RY - 7); c.lineTo(x0 + j * sp, RY - 14); c.stroke(); } }
        text(c, 'N = ' + N + ' atoms, spacing ' + a.toFixed(2) + ' λ', 210, RY - 26, { color: C.text, size: 11 });
        // the detector
        const dx = 210 + 200 * ux, dy = RY + 200 * uy;
        c.fillStyle = C.warn; c.save(); c.translate(dx, dy); c.rotate(-th); c.fillRect(-14, -5, 28, 10); c.restore();
        text(c, 'θ = ' + V.th.toFixed(1) + '°', dx, dy + 18, { color: C.text, size: 11 });
        text(c, 'red atoms: spin flipped (share f)', 210, H0 - 8, { color: C.muted, size: 10 });
        // the arrows added head to tail
        const bx = 560, by = 150, L = Math.min(22, 230 / Math.max(1, N)) * Math.sqrt(1 - f);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(bx - 125, by - 130, 250, 260);
        text(c, 'arrows of the unflipped scatterings', bx, by - 140, { color: C.muted, size: 11 });
        // centre the chain in the box
        let sx = 0, sy = 0, minx = 0, maxx = 0, miny = 0, maxy = 0;
        for (let j = 0; j < N; j++) { sx += Math.cos(j * ph); sy += Math.sin(j * ph); minx = Math.min(minx, sx); maxx = Math.max(maxx, sx); miny = Math.min(miny, sy); maxy = Math.max(maxy, sy); }
        const ox = bx - L * (minx + maxx) / 2, oy = by + L * (miny + maxy) / 2;
        let px = ox, py = oy;
        for (let j = 0; j < N; j++) { const qx = px + L * Math.cos(j * ph), qy = py - L * Math.sin(j * ph); kit.arrow(c, px, py, qx, qy, 'hsl(' + (200 + 120 * j / Math.max(1, N - 1)).toFixed(0) + ' 70% 55%)', 1.6, 6); px = qx; py = qy; }
        if (Math.hypot(px - ox, py - oy) > 3) kit.arrow(c, ox, oy, px, py, C.text, 2.6, 9); else kit.dot(c, ox, oy, 4, C.bad);
        text(c, coh > 0.8 * (1 - f) * N ? 'lined up: a peak' : coh < 0.05 ? 'closed polygon: they cancel' : 'partly curled', bx, by + 118, { color: C.text, size: 11, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-identical-scatter */
  // the Coulomb (Rutherford) amplitude with its angle-dependent phase, up to a constant: f(θ) = e^{−iη ln sin²(θ/2)} / sin²(θ/2)
  const coulombF = (th, eta) => { const s2 = Math.pow(Math.sin(th / 2), 2); return { re: Math.cos(-eta * Math.log(s2)) / s2, im: Math.sin(-eta * Math.log(s2)) / s2 }; };
  function mottRates(th, eta) {
    const f = coulombF(th, eta), g = coulombF(Math.PI - th, eta);
    const F = f.re * f.re + f.im * f.im, G = g.re * g.re + g.im * g.im, X = f.re * g.re + f.im * g.im;   // X = Re(f*·g)
    return { f, g, dist: F + G, boson: F + G + 2 * X, fermion: F + G - 2 * X, unpol: F + G - X };
  }
  Hyper.sim('qb-identical-scatter', {
    title: 'Two identical particles collide',
    blurb: `Two particles meet head-on (seen from their centre of mass) and fly apart back to back. Detector D1 waits at the angle θ, D2 opposite. There are two ways to get one particle in each detector: **a to D1 and b to D2** (amplitude f(θ)), or **a to D2 and b to D1** (amplitude f(π − θ)); both are drawn. For different particles the two ways can be told apart and their probabilities add. For identical particles they end in the same state, so the arrows combine: added for bosons, subtracted for fermions with the same spin. For charged particles the arrows also turn with the angle (the Coulomb phase, set by η). The graph shows each rate divided by the rate for distinguishable particles.

**Try this**
- θ = 90°: the two arrows are equal. Bosons give exactly twice the classical rate; same-spin fermions give nothing; electrons with random spins give half.
- Move θ away from 90° with η = 0: the enhancement and the suppression fade smoothly towards small and large angles, where one way dominates.
- Raise η: the Coulomb phase makes the arrows turn against each other, and the interference swings up and down as θ changes — Mott's oscillations, seen in collisions of α-particles with helium and of carbon nuclei with carbon.`,
    mount(box, kit) {
      const W0 = 700, H0 = 330;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Particles', options: [['Different (or labelled) particles', 'dist'], ['Identical bosons (spin 0, α on α)', 'boson'], ['Identical fermions, same spin', 'fermion'], ['Electrons with random spins', 'unpol']], value: 'boson' },
        { id: 'th', label: 'Angle of detector D1, θ', min: 5, max: 175, step: 1, value: 90, unit: '°' },
        { id: 'eta', label: 'Coulomb phase η (0 = off)', min: 0, max: 5, step: 0.05, value: 0 }
      ], () => curves());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', '|f(θ)|², a to D1'], ['g', '|f(π − θ)|², a to D2'], ['P', 'Rate for these particles'], ['Pd', 'Rate if distinguishable'], ['r', 'Ratio']]);
      const plot = kit.plot(gb, { x: { label: 'angle θ in the centre-of-mass frame (°)', min: 5, max: 175 }, y: { label: 'rate ÷ rate for different particles', min: 0, max: 2.6 }, legend: true }, 160);
      function curves() {
        const b = [], fe = [], u = [], one = [];
        for (let d = 5; d <= 175; d += 0.5) { const m = mottRates(d * Math.PI / 180, V.eta); b.push([d, m.boson / m.dist]); fe.push([d, m.fermion / m.dist]); u.push([d, m.unpol / m.dist]); one.push([d, 1]); }
        plot.set({ series: [{ pts: b, label: 'bosons' }, { pts: fe, label: 'fermions, same spin' }, { pts: u, label: 'random spins' }, { pts: one, label: 'different particles', dash: [5, 4], width: 1.4 }], vlines: [{ x: V.th, label: 'θ' }] });
      }
      curves();
      let t = 0, flash = 0;
      const loop = kit.loop(dt => {
        t += dt;
        const th = V.th * Math.PI / 180, m = mottRates(th, V.eta), P = m[V.kind] != null ? m[V.kind] : m.dist, ratio = P / m.dist;
        plot.set({ vlines: [{ x: V.th, label: 'θ' }] });
        ro.set('f', kit.fmt(m.f.re * m.f.re + m.f.im * m.f.im, 3)); ro.set('g', kit.fmt(m.g.re * m.g.re + m.g.im * m.g.im, 3));
        ro.set('P', kit.fmt(P, 3)); ro.set('Pd', kit.fmt(m.dist, 3)); ro.set('r', ratio.toFixed(3) + (Math.abs(V.th - 90) < 0.5 && V.eta === 0 ? ' (exactly ' + { dist: '1', boson: '2', fermion: '0', unpol: '½' }[V.kind] + ' at 90°)' : ''));
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        const cx = 175, cy = 165, Rr = 125, same = V.kind !== 'dist';
        const ca = same ? C.accent : 'hsl(210 85% 58%)', cb = same ? C.accent : 'hsl(22 90% 56%)';
        const d1 = [cx + Rr * Math.cos(th), cy - Rr * Math.sin(th)], d2 = [cx - Rr * Math.cos(th), cy + Rr * Math.sin(th)];
        // the two detectors
        const det = (p, lab, glow) => { c.save(); c.translate(p[0], p[1]); c.rotate(-Math.atan2(cy - p[1], p[0] - cx)); c.fillStyle = C.muted; c.fillRect(-6, -14, 12, 28); c.restore(); if (glow > 0) { c.fillStyle = 'hsl(48 100% 60% / ' + glow + ')'; c.beginPath(); c.arc(p[0], p[1], 18, 0, TAU); c.fill(); } text(c, lab, p[0] + (p[0] > cx ? 22 : -22), p[1], { color: C.text, size: 12, weight: 600 }); };
        // the cycle: approach, then leave along both alternatives
        const T = 2.4, ph = (t % T) / T;
        if (ph < 0.35) {
          const u = ph / 0.35, x = (1 - u) * 140;
          kit.dot(c, cx - x, cy, 7, ca, C.text); kit.dot(c, cx + x, cy, 7, cb, C.text);
          if (!same) { text(c, 'a', cx - x, cy - 16, { color: ca, size: 12, weight: 600 }); text(c, 'b', cx + x, cy - 16, { color: cb, size: 12, weight: 600 }); }
        } else {
          const u = Math.min(1, (ph - 0.35) / 0.5), r = u * (Rr - 18);
          const ex = Math.cos(th), ey = -Math.sin(th);
          c.globalAlpha = 0.9; kit.dot(c, cx + r * ex, cy + r * ey, 6, ca, C.text); kit.dot(c, cx - r * ex, cy - r * ey, 6, cb, C.text);
          c.globalAlpha = 0.45; kit.dot(c, cx - r * ex, cy - r * ey, 6, ca); kit.dot(c, cx + r * ex, cy + r * ey, 6, cb); c.globalAlpha = 1;
          if (u >= 1) flash = 1;
        }
        flash = Math.max(0, flash - dt * 1.5);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx - 150, cy); c.lineTo(cx + 150, cy); c.moveTo(d2[0], d2[1]); c.lineTo(d1[0], d1[1]); c.stroke(); c.setLineDash([]);
        det(d1, 'D1', flash * clamp(ratio / 2, 0, 1)); det(d2, 'D2', flash * clamp(ratio / 2, 0, 1));
        c.strokeStyle = C.muted; c.beginPath(); c.arc(cx, cy, 34, -th, 0); c.stroke();
        text(c, 'θ', cx + 44 * Math.cos(th / 2), cy - 44 * Math.sin(th / 2), { color: C.text, size: 12 });
        text(c, same ? 'identical: the two ways end in the same state' : 'different: the detectors can tell a from b', cx, H0 - 12, { color: C.muted, size: 11 });
        // the two amplitudes and how they combine
        const bx = 470, by = 150, sc = 80 / Math.max(Math.hypot(m.f.re, m.f.im), Math.hypot(m.g.re, m.g.im));
        c.strokeStyle = C.grid; c.strokeRect(bx - 115, by - 125, 230, 250);
        text(c, V.kind === 'dist' ? 'square each arrow, then add' : V.kind === 'boson' ? 'add the arrows' : V.kind === 'fermion' ? 'subtract the arrows' : 'same spins subtract; others add as probabilities', bx, by - 135, { color: C.muted, size: 11 });
        const fx = sc * m.f.re, fy = -sc * m.f.im, gx = sc * m.g.re, gy = -sc * m.g.im, sgn = V.kind === 'boson' ? 1 : -1;
        const x0 = bx - (fx + sgn * gx) / 2, y0 = by - (fy + sgn * gy) / 2;
        if (V.kind === 'dist') {
          kit.arrow(c, bx - 60, by + 10, bx - 60 + fx * 0.6, by + 10 + fy * 0.6, 'hsl(210 85% 58%)', 2.4, 8); kit.arrow(c, bx + 50, by + 10, bx + 50 + gx * 0.6, by + 10 + gy * 0.6, 'hsl(22 90% 56%)', 2.4, 8);
        } else {
          kit.arrow(c, x0, y0, x0 + fx, y0 + fy, 'hsl(210 85% 58%)', 2.4, 8);
          kit.arrow(c, x0 + fx, y0 + fy, x0 + fx + sgn * gx, y0 + fy + sgn * gy, 'hsl(22 90% 56%)', 2.4, 8);
          if (Math.hypot(fx + sgn * gx, fy + sgn * gy) > 3) kit.arrow(c, x0, y0, x0 + fx + sgn * gx, y0 + fy + sgn * gy, C.text, 3, 10); else kit.dot(c, x0, y0, 4, C.bad);
        }
        text(c, 'f(θ)', bx - 80, by + 100, { color: 'hsl(210 85% 58%)', size: 11, weight: 600 }); text(c, V.kind === 'fermion' || V.kind === 'unpol' ? '− f(π − θ)' : 'f(π − θ)', bx + 60, by + 100, { color: 'hsl(22 90% 56%)', size: 11, weight: 600 });
        // bars: this rate against the distinguishable rate
        const BX = 640, BY = 290, top = 2.2 * m.dist, bh = v => 200 * v / top;
        c.fillStyle = C.accent; c.fillRect(BX - 40, BY - bh(P), 26, bh(P)); c.fillStyle = C.faint; c.fillRect(BX + 4, BY - bh(m.dist), 26, bh(m.dist));
        text(c, 'rate', BX - 27, BY + 12, { color: C.text, size: 10 }); text(c, 'different', BX + 17, BY + 12, { color: C.text, size: 10 });
        text(c, '× ' + ratio.toFixed(2), BX - 27, BY - bh(P) - 9, { color: C.text, size: 11, weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-laser */
  Hyper.sim('qb-laser', {
    title: 'A laser: photons crowding into one mode',
    blurb: `Ten thousand atoms (a sample is drawn) sit between two mirrors; the right-hand mirror lets a little light out. A pump lifts atoms to the upper level (yellow). An excited atom can emit sideways in any direction (lost), or into the one **mode** between the mirrors — and the rate into the mode is **n + 1** times the rate into an empty mode, where n is the number of photons already there. Atoms in the lower level absorb from the mode at a rate proportional to n. The mirror lets photons out at a rate proportional to n. The graph (logarithmic) shows the photons in the mode and the excited atoms; the dashed line is the inversion at which gain equals loss. Time is counted in lifetimes of the upper level.

**Try this**
- Pump at 2 (below threshold, 3 here): a few photons flicker in the mode, from spontaneous emission alone; most light leaves sideways.
- Pump at 5: the mode photons grow exponentially from a single spontaneous photon, overshoot in spikes, and settle to a steady beam — the excited population is pinned at threshold.
- Untick *Stimulated emission*: without the n in n + 1 there is no laser at any pump rate.
- Increase the mirror loss: the threshold rises; beyond a loss of 10 no inversion can beat it.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1960);
      const W0 = 700, H0 = 300, NAT = 10000, BETA = 0.001, GAM = 1, DTS = 0.002, NDRAW = 210;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Pump rate (per atom, per lifetime)', min: 0, max: 10, step: 0.1, value: 5 },
        { id: 'k', label: 'Loss through the output mirror (per lifetime)', min: 1, max: 12, step: 0.1, value: 5 },
        { id: 'stim', type: 'check', label: 'Stimulated emission (the n in n + 1)', value: true },
        { id: 'speed', label: 'Speed of time (lifetimes per second)', min: 0.1, max: 3, value: 0.6, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart: all atoms down', primary: true }] }
      ], id => { if (id === 'restart') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Photons in the laser mode'], ['Ne', 'Excited atoms'], ['th', 'Threshold pump rate'], ['st', 'Share of mode emission that is stimulated'], ['state', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (lifetimes of the upper level)' }, y: { label: 'number', log: true, min: 0.3, max: 3e4 }, legend: true }, 160);
      let Ne = 0, n = 0, t = 0, rec = [], tRec = 0, sponts = [], mode = [], order = [];
      for (let i = 0; i < NDRAW; i++) order.push(i);
      for (let i = NDRAW - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const tmp = order[i]; order[i] = order[j]; order[j] = tmp; }
      function restart() { Ne = 0; n = 0; t = 0; rec = []; tRec = 0; sponts = []; mode = []; }
      restart();
      const pois = mu => poisson(mu, R, Q);
      function step() {
        const Ng = NAT - Ne;
        const ex = Math.min(Ng, pois(V.P * Ng * DTS)); Ne += ex;
        const sp = Math.min(Ne, pois(GAM * Ne * DTS)); Ne -= sp;
        const em = Math.min(Ne, pois(BETA * Ne * ((V.stim ? n : 0) + 1) * DTS)); Ne -= em; n += em;
        const ab = Math.min(n, NAT - Ne, pois(BETA * (NAT - Ne) * n * DTS)); n -= ab; Ne += ab;
        const out = Math.min(n, pois(V.k * n * DTS)); n -= out;
        return sp;
      }
      const loop = kit.loop(dt => {
        const steps = Math.min(400, Math.round(V.speed * dt / DTS));
        let sp = 0;
        for (let i = 0; i < steps; i++) { sp += step(); t += DTS; }
        tRec += steps * DTS;
        if (tRec >= 0.04) { tRec = 0; rec.push([t, n + 0.5, Ne + 0.5]); if (rec.length > 600) rec.shift(); }
        const thInv = (NAT + V.k / BETA) / 2, thP = V.k / BETA < NAT ? (NAT + V.k / BETA) / (NAT - V.k / BETA) : Infinity;
        if (dt > 0) plot.set({ series: [{ pts: rec.map(q => [q[0], q[1]]), label: 'photons in the mode' }, { pts: rec.map(q => [q[0], q[2]]), label: 'excited atoms' }],
          hlines: thInv < NAT ? [{ y: thInv, label: 'threshold inversion' }] : [], x: { label: 'time (lifetimes of the upper level)', min: rec.length ? rec[0][0] : 0, max: Math.max(1, t) } });
        const lasing = n > 50 && V.stim;
        ro.set('n', String(n)); ro.set('Ne', Ne + ' of ' + NAT + ' (' + (100 * Ne / NAT).toFixed(0) + ' %)');
        ro.set('th', Number.isFinite(thP) ? thP.toFixed(2) : 'none — the loss is too high');
        ro.set('st', V.stim ? (100 * n / (n + 1)).toFixed(1) + ' %' : '0 % (switched off)');
        ro.set('state', lasing ? 'Lasing: a beam in one mode' : V.P < thP || !V.stim ? 'Below threshold: a weak glow in all directions' : 'Building up…');
        // spontaneous photons flying out sideways (a sample)
        for (let i = 0; i < Math.min(3, Math.ceil(sp / 40)); i++) { const a = TAU * R(); sponts.push({ x: 130 + 360 * R(), y: 95 + 90 * R(), vx: Math.cos(a), vy: Math.sin(a), t: 0 }); }
        for (const s of sponts) s.t += dt; sponts = sponts.filter(s => s.t < 0.6);
        // the mode photons, drawn one by one while few
        const want = Math.min(40, n);
        while (mode.length < want) mode.push({ x: 80 + 460 * R(), d: R() < 0.5 ? -1 : 1 });
        while (mode.length > want) mode.pop();
        for (const m of mode) { m.x += m.d * 320 * dt; if (m.x > 548) { m.x = 548; m.d = -1; } if (m.x < 72) { m.x = 72; m.d = 1; } }
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        const AX = 140, frac = Ne / NAT, bright = n > 0 ? clamp(Math.log10(n + 1) / 4, 0, 1) : 0;
        // the beam in the cavity and the output beam
        if (bright > 0) { c.fillStyle = 'hsl(0 90% 55% / ' + (0.08 + 0.5 * bright) + ')'; c.fillRect(64, AX - 10, 490, 20); }
        const outW = V.k * n; if (outW > 0) { c.fillStyle = 'hsl(0 90% 55% / ' + clamp(0.1 + Math.log10(outW + 1) / 5, 0, 0.9) + ')'; c.fillRect(566, AX - 7, 130, 14); }
        // the gain medium and its atoms
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(120, 88, 380, 104);
        for (let i = 0; i < NDRAW; i++) { const col = i % 30, row = Math.floor(i / 30), up = order[i] < frac * NDRAW; kit.dot(c, 130 + col * 12.6, 96 + row * 14.5, up ? 3.2 : 2.4, up ? 'hsl(48 100% 55%)' : (C.dark ? 'hsl(215 40% 45%)' : 'hsl(215 40% 65%)')); }
        // mode photons as short wave packets
        c.strokeStyle = 'hsl(0 90% 60%)'; c.lineWidth = 1.6;
        for (const m of mode) { c.beginPath(); for (let s = -7; s <= 7; s++) { const x = m.x + s, y = AX + 4 * Math.sin(s * 1.2 + m.x * 0.2); if (s === -7) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); }
        for (const s of sponts) { const a = 1 - s.t / 0.6; kit.arrow(c, s.x + s.vx * 60 * s.t, s.y + s.vy * 60 * s.t, s.x + s.vx * (60 * s.t + 12), s.y + s.vy * (60 * s.t + 12), 'hsl(48 100% 60% / ' + a + ')', 1.4, 5); }
        // mirrors
        c.fillStyle = C.text; c.fillRect(54, AX - 60, 8, 120);
        c.fillStyle = C.muted; c.fillRect(556, AX - 60, 8, 120);
        text(c, 'mirror', 58, AX + 74, { color: C.muted, size: 10 }); text(c, 'output mirror', 560, AX + 74, { color: C.muted, size: 10 });
        text(c, 'pump ↑ ' + V.P.toFixed(1), 310, 72, { color: C.text, size: 11 });
        text(c, 'n = ' + n + (V.stim ? '   emission into the mode ∝ n + 1 = ' + (n + 1) : '   (no stimulated emission)'), 310, 214, { color: C.text, size: 12, weight: 600 });
        text(c, 'yellow: excited atoms (' + (100 * frac).toFixed(0) + ' %)', 310, 232, { color: C.muted, size: 10 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-fill */
  Hyper.sim('qb-fill', {
    title: 'Filling the levels',
    blurb: `**Particles in a well:** a harmonic well has energy levels ħω apart. Put N particles in it and let them settle. Spin-½ fermions go two to a level (↑ and ↓); fermions that all have the same spin go one to a level; bosons pile into the lowest level. Raise the temperature and particles hop between levels (a Monte Carlo simulation that respects the exclusion principle); the graph shows the average number in each level. **Electrons in an atom:** the shells and subshells of an atom, filled element by element (Hund's rule: one ↑ in every box before any ↓), with the energy needed to remove one electron.

**Try this**
- Spin-½ fermions, add particles one at a time: each pair opens a new level, and the total energy (bars) grows as N²/4 instead of N/2 for bosons.
- Switch to bosons at the same N: everything collapses into the lowest level.
- Raise the temperature to about 1: the fermions' top level blurs (only particles near the top can move — the rest have nowhere to go), while bosons spread out and, cooled again, crowd back into the ground level.
- Atom mode: step through Z = 2, 10, 18, 36, 54 (the noble gases: full shells, hard to ionise) and Z + 1 (the alkali metals: one lonely electron in a new shell, easily removed). Watch 4s fill before 3d, and chromium (24) and copper (29) break the simple order.`,
    mount(box, kit, params) {
      const R = kit.qm.rng(1925), CH = kit.chem;
      const W0 = 700, H0 = 330, NL = 40;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Particles in a well', 'well'], ['Electrons in an atom', 'atom']], value: params && params.mode === 'atom' ? 'atom' : 'well' },
        { id: 'kind', type: 'select', label: 'Particles', options: [['Spin-½ fermions: two per level', 'f2'], ['Fermions all with spin up: one per level', 'f1'], ['Bosons (spin 0)', 'b']], value: 'f2' },
        { id: 'N', label: 'Number of particles N', min: 1, max: 20, step: 1, value: 7 },
        { id: 'T', label: 'Temperature k_BT (in units of ħω)', min: 0, max: 3, step: 0.05, value: 0 },
        { id: 'Z', label: 'Atomic number Z', min: 1, max: 54, step: 1, value: 11 },
        { type: 'buttons', items: [{ id: 'add', label: 'Add one', primary: true }, { id: 'rem', label: 'Remove one' }] }
      ], id => {
        if (id === 'add' || id === 'rem') { const d = id === 'add' ? 1 : -1; if (V.mode === 'well') ctl.set('N', clamp(Math.round(V.N) + d, 1, 20)); else ctl.set('Z', clamp(Math.round(V.Z) + d, 1, 54)); }
        if (id === 'T') resetAvg(); else if (id !== 'Z') ground();
        modeUI();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Total energy: now / average'], ['top', 'Highest occupied level'], ['g0', 'Particles in the lowest level'], ['el', 'Element'], ['cfg', 'Configuration'], ['ie', 'Energy to remove one electron']]);
      const plot = kit.plot(gb, { x: {}, y: {}, legend: true }, 160);
      let up, dn, cnt, sum, frames, tPlot = 0, t = 0;
      const occ = k => V.kind === 'b' ? cnt[k] : up[k] + dn[k];
      function ground() {
        const N = Math.round(V.N); up = new Uint8Array(NL); dn = new Uint8Array(NL); cnt = new Int32Array(NL);
        if (V.kind === 'b') cnt[0] = N;
        else if (V.kind === 'f1') for (let k = 0; k < N; k++) up[k] = 1;
        else for (let i = 0; i < N; i++) { if (i % 2 === 0) up[i >> 1] = 1; else dn[i >> 1] = 1; }
        resetAvg();
      }
      function resetAvg() { sum = new Float64Array(NL); frames = 0; }
      // Metropolis moves on occupation numbers: pick a level and a direction at random (a symmetric proposal),
      // refuse a move into a full place, accept a climb of ħω with probability e^{−ħω/kT}
      function mc(n) {
        const T = V.T;
        for (let i = 0; i < n; i++) {
          const k = Math.floor(R() * NL), d = R() < 0.5 ? -1 : 1, k2 = k + d;
          if (k2 < 0 || k2 >= NL) continue;
          const acc = d < 0 || (T > 0 && R() < Math.exp(-1 / T));
          if (V.kind === 'b') { if (cnt[k] > 0 && acc) { cnt[k]--; cnt[k2]++; } }
          else { const L = V.kind === 'f2' && R() < 0.5 ? dn : up; if (L[k] && !L[k2] && acc) { L[k] = 0; L[k2] = 1; } }
        }
      }
      const groundE = (kind, N) => { if (kind === 'b') return N / 2; if (kind === 'f1') return N * N / 2; let e = 0; for (let i = 0; i < N; i++) e += (i >> 1) + 0.5; return e; };
      function modeUI() {
        const w = V.mode === 'well';
        ['kind', 'N', 'T'].forEach(id => ctl.show(id, w)); ctl.show('Z', !w);
        ['E', 'top', 'g0'].forEach(k => ro.show(k, w)); ['el', 'cfg', 'ie'].forEach(k => ro.show(k, !w));
        if (w) plot.set({ series: [], x: { label: 'level k (energy (k + ½) ħω)', min: -0.5, max: 19.5 }, y: { label: 'average number in the level', min: 0, max: V.kind === 'b' ? Math.max(2.2, Math.round(V.N) + 0.5) : 2.2 }, marks: [], vlines: [] });
        else {
          const pts = [], marks = [];
          if (CH) for (let z = 1; z <= 54; z++) { const e = CH.el(z); if (e && e.ie) pts.push([z, e.ie]); }
          for (const z of [2, 10, 18, 36, 54]) if (CH) marks.push({ x: z, y: CH.el(z).ie, label: CH.el(z).sym });
          plot.set({ x: { label: 'atomic number Z', min: 0, max: 55 }, y: { label: 'energy to remove one electron (eV)', min: 0, max: 26 }, series: [{ pts, label: 'first ionisation energy', dots: 2.2 }], marks, vlines: [{ x: Math.round(V.Z), label: 'Z' }] });
        }
      }
      function config(Z) {
        const m = {}; if (!CH) return m;
        CH.fullConfig(Z).split(' ').forEach(s => { const q = /^(\d)([spdf])(\d+)$/.exec(s); if (q) m[q[1] + q[2]] = +q[3]; });
        return m;
      }
      ground(); modeUI();
      const loop = kit.loop(dt => {
        t += dt;
        const C = kit.colors();
        if (V.mode === 'well') {
          mc(dt > 0 ? 300 : 0);
          frames++; for (let k = 0; k < NL; k++) sum[k] += occ(k);
          let E = 0, top = 0; for (let k = 0; k < NL; k++) { const o = occ(k); E += o * (k + 0.5); if (o > 0) top = k; }
          let Ea = 0; for (let k = 0; k < NL; k++) Ea += sum[k] / frames * (k + 0.5);
          ro.set('E', E.toFixed(1) + ' / ' + Ea.toFixed(1) + ' ħω (lowest possible ' + groundE(V.kind, Math.round(V.N)).toFixed(1) + ')');
          ro.set('top', 'k = ' + top); ro.set('g0', String(occ(0)));
          tPlot += dt;
          if (tPlot > 0.25) {
            tPlot = 0;
            const avg = [], g0 = []; const N = Math.round(V.N);
            for (let k = 0; k < 20; k++) { avg.push([k, sum[k] / frames]); const cap = V.kind === 'f2' ? 2 : 1; g0.push([k, V.kind === 'b' ? (k === 0 ? N : 0) : clamp(N - cap * k, 0, cap)]); }
            plot.set({ series: [{ pts: avg, label: 'average over time', dots: 3 }, { pts: g0, label: 'at T = 0', dash: [4, 3], width: 1.4 }] });
          }
        } else {
          const Z = Math.round(V.Z), e = CH ? CH.el(Z) : null;
          ro.set('el', e ? e.sym + ' — ' + e.name + ' (Z = ' + Z + ')' : 'Z = ' + Z);
          ro.set('cfg', CH ? CH.fullConfig(Z) : '—');
          ro.set('ie', e && e.ie ? e.ie.toFixed(2) + ' eV' : '—');
          if (tPlot !== Z) { tPlot = Z; plot.set({ vlines: [{ x: Z, label: e ? e.sym : 'Z' }] }); }
        }
        // drawing
        const c = st.begin(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        if (V.mode === 'well') {
          const N = Math.round(V.N);
          let hi = 11; for (let k = 0; k < NL; k++) if (occ(k) > 0) hi = Math.max(hi, k + 1);
          const base = 318, sp = Math.min(24, 290 / (hi + 1)), cx = 220, yk = k => base - (k + 0.5) * sp;
          // the well (drawn to the same energy scale) and its levels
          c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath();
          for (let x = -190; x <= 190; x += 4) { const e = 0.5 * Math.pow(x / 190, 2) * (hi + 1) * 1.05, y = base - e * sp; if (x === -190) c.moveTo(cx + x, y); else c.lineTo(cx + x, y); }
          c.stroke();
          for (let k = 0; k <= hi; k++) {
            const y = yk(k);
            c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(60, y); c.lineTo(380, y); c.stroke();
            if (k < 10 || k % 2 === 0) text(c, 'k = ' + k, 40, y, { color: C.muted, size: 10 });
            const o = occ(k);
            if (V.kind === 'b') {
              for (let j = 0; j < o; j++) kit.dot(c, cx - (o - 1) * 6.5 + j * 13, y - 6, Math.min(5.5, sp / 2.4), C.accent, C.text);
            } else {
              const r = Math.min(6, sp / 2.3);
              if (up[k]) { kit.dot(c, cx - 14, y - r, r, 'hsl(210 85% 58%)', C.text); if (V.kind === 'f2' && r > 4) text(c, '↑', cx - 14, y - r, { color: '#fff', size: 9, weight: 700 }); }
              if (dn[k]) { kit.dot(c, cx + 14, y - r, r, 'hsl(22 90% 56%)', C.text); if (r > 4) text(c, '↓', cx + 14, y - r, { color: '#fff', size: 9, weight: 700 }); }
            }
          }
          text(c, V.kind === 'b' ? 'bosons: any number per level' : V.kind === 'f1' ? 'same-spin fermions: one per level' : 'spin-½ fermions: two per level (↑ ↓)', cx, 12, { color: C.text, size: 12, weight: 600 });
          text(c, 'T = ' + V.T.toFixed(2) + ' ħω/k_B', cx, 28, { color: C.muted, size: 11 });
          // the lowest total energies of the three kinds, for this N
          const kinds = [['b', 'bosons'], ['f2', 'spin-½'], ['f1', 'same spin']], mx = groundE('f1', N) || 1, BX = 470, BY = 300;
          text(c, 'lowest total energy for N = ' + N + ' (ħω)', 570, 40, { color: C.text, size: 12, weight: 600 });
          kinds.forEach(([k, lab], i) => {
            const v = groundE(k, N), h = 220 * v / mx, x = BX + i * 70;
            c.fillStyle = k === V.kind ? C.accent : C.faint; c.fillRect(x, BY - h, 40, h);
            text(c, v.toFixed(1), x + 20, BY - h - 9, { color: C.text, size: 11 }); text(c, lab, x + 20, BY + 12, { color: C.text, size: 11 });
          });
        } else {
          const Z = Math.round(V.Z), cfg = config(Z), L = ['s', 'p', 'd', 'f'], X0 = [70, 140, 250, 390], BW = 21;
          const ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p'];
          let last = ''; for (const s of ORDER) if (cfg[s]) last = s;
          const pulse = 0.5 + 0.5 * Math.sin(4 * t);
          for (let n = 1; n <= 5; n++) {
            const y = 26 + (n - 1) * 54;
            text(c, 'n = ' + n, 26, y + 10, { color: C.muted, size: 11 });
            for (let l = 0; l < Math.min(n, 4); l++) {
              const name = n + L[l], e = cfg[name] || 0, m = 2 * l + 1, x0 = X0[l];
              c.strokeStyle = name === last ? 'hsl(48 100% 55% / ' + (0.5 + 0.5 * pulse) + ')' : C.grid; c.lineWidth = name === last ? 2.5 : 1;
              for (let b = 0; b < m; b++) c.strokeRect(x0 + b * BW, y, BW, BW);
              for (let b = 0; b < m; b++) {
                const hasUp = e > b, hasDn = e > m + b;
                if (hasUp) text(c, '↑', x0 + b * BW + 6, y + 11, { color: 'hsl(210 85% 58%)', size: 14, weight: 700 });
                if (hasDn) text(c, '↓', x0 + b * BW + 15, y + 11, { color: 'hsl(22 90% 56%)', size: 14, weight: 700 });
              }
              text(c, name + (e ? '  ' + e + '/' + 2 * m : ''), x0 + m * BW / 2, y + BW + 9, { color: e ? C.text : C.faint, size: 10 });
            }
          }
          // the element card
          const el = CH ? CH.el(Z) : null;
          c.strokeStyle = C.border || C.grid; c.lineWidth = 1.5; c.strokeRect(575, 30, 110, 120);
          text(c, String(Z), 585, 44, { color: C.muted, size: 11, align: 'left' });
          text(c, el ? el.sym : '?', 630, 84, { color: C.text, size: 34, weight: 700 });
          text(c, el ? el.name : '', 630, 118, { color: C.text, size: 12 });
          text(c, el && el.ie ? el.ie.toFixed(1) + ' eV' : '', 630, 136, { color: C.muted, size: 11 });
          const noble = [2, 10, 18, 36, 54].includes(Z), alkali = [3, 11, 19, 37].includes(Z);
          text(c, noble ? 'full shells: a noble gas' : alkali ? 'one electron in a new shell' : '', 630, 166, { color: noble ? C.ok : C.warn, size: 11, weight: 600 });
          text(c, 'filling order: ' + ORDER.join(' '), 350, H0 - 8, { color: C.muted, size: 10 });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ qb-bell */
  Hyper.sim('qb-bell', {
    title: 'A Bell test: the quantum rule against hidden instructions',
    blurb: `A source sends out pairs of photons, one to polariser A on the left and one to polariser B on the right. Behind each, a photon is counted as **+** (it passed) or **−** (it did not). Choose what nature follows. **Quantum mechanics:** each side alone is 50/50 at random, but the two results agree with probability cos²θ, θ being the angle between the polarisers. **Hidden instructions:** each pair carries a shared polarisation (the little bar on the photons) and each photon decides by it alone — by a sharp rule (pass if its polariser is within 45° of the bar) or by chance (pass with probability cos² of the angle to the bar). The graph compares the agreement rates; *Run a Bell test* measures the Clauser–Horne–Shimony–Holt value S at the four standard settings (0°, 45° for A; 22.5°, 67.5° for B).

**Try this**
- Set the polarisers 22.5° apart: quantum mechanics agrees 85 % of the time, the sharp instructions only 75 %.
- Run the Bell test on each model: every instruction model stays at S ≤ 2 (the sharp one reaches exactly 2, the chance one about 1.4), while quantum mechanics gives 2.83 ± a few hundredths — what the experiments of 1972, 1982 and 2015 found.
- Look at one side only (cover the other with your hand): whatever the settings, it is a fair coin. No message can pass.
- Note how this program makes the quantum pairs: it has to use *both* settings at once. That is exactly what instructions carried by each photon separately cannot do.`,
    mount(box, kit) {
      const Q = kit.qm, R = Q.rng(1964);
      const W0 = 700, H0 = 300, SX = 350, SY = 110, AX = 170, BX = 530, FLY = 0.7;
      const st = kit.stage(box.stage, { aspect: H0 / W0, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Nature follows', options: [['Quantum mechanics (an entangled pair)', 'qm'], ['Hidden instructions, sharp rule', 'sharp'], ['Hidden instructions, chance rule', 'malus']], value: 'qm' },
        { id: 'a', label: 'Polariser A', min: 0, max: 180, step: 0.5, value: 0, unit: '°' },
        { id: 'b', label: 'Polariser B', min: 0, max: 180, step: 0.5, value: 22.5, unit: '°' },
        { id: 'rate', label: 'Pairs per second', min: 1, max: 60, step: 1, value: 12 },
        { type: 'buttons', items: [{ id: 'bell', label: 'Run a Bell test (CHSH)', primary: true }, { id: 'clear', label: 'Clear the tally' }] }
      ], id => { if (id === 'bell') bell(); else if (id !== 'rate') clearTally(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Pairs counted'], ['agree', 'Agreements: counted'], ['pred', 'Agreements: this model predicts'], ['S', 'Bell–CHSH value S (instructions: ≤ 2)']]);
      const plot = kit.plot(gb, { x: { label: 'angle between the polarisers θ (°)', min: 0, max: 90 }, y: { label: 'probability the results agree', min: 0, max: 1.05 }, legend: true }, 160);
      const rad = d => d * Math.PI / 180;
      const pred = (m, d) => m === 'qm' ? Math.pow(Math.cos(rad(d)), 2) : m === 'sharp' ? 1 - d / 90 : 0.5 + 0.25 * Math.cos(2 * rad(d));
      function outcome(m, a, b) {
        if (m === 'qm') { const A = R() < 0.5 ? 1 : -1; return { A, B: R() < Math.pow(Math.cos(rad(a - b)), 2) ? A : -A, lam: null }; }
        const lam = 180 * R();
        if (m === 'sharp') return { A: Math.cos(2 * rad(a - lam)) >= 0 ? 1 : -1, B: Math.cos(2 * rad(b - lam)) >= 0 ? 1 : -1, lam };
        return { A: R() < Math.pow(Math.cos(rad(a - lam)), 2) ? 1 : -1, B: R() < Math.pow(Math.cos(rad(b - lam)), 2) ? 1 : -1, lam };
      }
      let pairs = [], n = 0, same = 0, acc = 0, lastS = null, lampA = { v: 0, t: 9 }, lampB = { v: 0, t: 9 }, onesA = 0;
      function clearTally() { n = 0; same = 0; onesA = 0; pairs = []; updatePlot(); }
      const delta = () => { let d = Math.abs(V.a - V.b) % 180; if (d > 90) d = 180 - d; return d; };
      function updatePlot() {
        const q = [], s = [], m = [];
        for (let d = 0; d <= 90; d += 1) { q.push([d, pred('qm', d)]); s.push([d, pred('sharp', d)]); m.push([d, pred('malus', d)]); }
        const marks = n > 0 ? [{ x: delta(), y: same / n, label: 'counted' }] : [];
        plot.set({ series: [{ pts: q, label: 'quantum: cos²θ' }, { pts: s, label: 'sharp instructions', dash: [5, 4] }, { pts: m, label: 'chance instructions', dash: [1, 3] }], marks, vlines: [{ x: delta(), label: 'θ' }] });
      }
      function bell() {
        const M = 2500, E = {};
        for (const [a, b] of [[0, 22.5], [0, 67.5], [45, 22.5], [45, 67.5]]) { let s = 0; for (let i = 0; i < M; i++) { const o = outcome(V.model, a, b); s += o.A * o.B; } E[a + '/' + b] = s / M; }
        const S = E['0/22.5'] - E['0/67.5'] + E['45/22.5'] + E['45/67.5'];
        let v = 0; for (const k in E) v += (1 - E[k] * E[k]) / M;
        lastS = { S, err: Math.sqrt(v), model: V.model };
      }
      updatePlot();
      const loop = kit.loop(dt => {
        acc += dt * V.rate;
        let k = 0; while (acc >= 1 && k < 20) { acc -= 1; k++; const o = outcome(V.model, V.a, V.b); pairs.push(Object.assign(o, { t: 0 })); }
        if (acc > 3) acc = 0;
        for (const p of pairs) {
          p.t += dt;
          if (p.t >= FLY && !p.done) { p.done = true; n++; if (p.A === p.B) same++; if (p.A > 0) onesA++; lampA = { v: p.A, t: 0 }; lampB = { v: p.B, t: 0 }; if (n % 5 === 0) updatePlot(); }
        }
        pairs = pairs.filter(p => p.t < FLY + 0.05);
        lampA.t += dt; lampB.t += dt;
        const d = delta();
        ro.set('n', n + (n ? ' (A passed ' + (100 * onesA / n).toFixed(0) + ' %)' : ''));
        ro.set('agree', n ? (100 * same / n).toFixed(1) + ' %' : '—');
        ro.set('pred', (100 * pred(V.model, d)).toFixed(1) + ' % at θ = ' + d.toFixed(1) + '°');
        ro.set('S', lastS ? lastS.S.toFixed(2) + ' ± ' + lastS.err.toFixed(2) + ' (' + { qm: 'quantum', sharp: 'sharp instructions', malus: 'chance instructions' }[lastS.model] + ')' : 'press Run a Bell test');
        // drawing
        const c = st.begin(), C = kit.colors(), F = fit(st, W0, H0);
        c.save(); c.translate(F.ox, F.oy); c.scale(F.s, F.s);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(AX, SY); c.lineTo(BX, SY); c.stroke(); c.setLineDash([]);
        kit.dot(c, SX, SY, 12, C.surface2 || C.bg2, C.text); text(c, 'source', SX, SY + 26, { color: C.muted, size: 11 });
        // photons in flight, with their instructions (if any)
        for (const p of pairs) {
          if (p.done) continue;
          const u = Math.min(1, p.t / FLY);
          for (const [x, lamOK] of [[SX - u * (SX - AX), 1], [SX + u * (BX - SX), 1]]) {
            kit.dot(c, x, SY, 4, 'hsl(48 100% 55%)');
            if (p.lam != null && lamOK) { const r = rad(p.lam); c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x - 9 * Math.cos(r), SY + 9 * Math.sin(r)); c.lineTo(x + 9 * Math.cos(r), SY - 9 * Math.sin(r)); c.stroke(); }
          }
        }
        // polarisers and detectors
        const polar = (x, ang, lab) => {
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(x, SY, 26, 0, TAU); c.stroke();
          const r = rad(ang); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 24 * Math.cos(r), SY + 24 * Math.sin(r)); c.lineTo(x + 24 * Math.cos(r), SY - 24 * Math.sin(r)); c.stroke();
          text(c, lab + ' ' + ang.toFixed(1) + '°', x, SY - 40, { color: C.text, size: 12, weight: 600 });
        };
        polar(AX, V.a, 'A'); polar(BX, V.b, 'B');
        const lamp = (x, sign, L) => { const on = L.v === sign && L.t < 0.35; kit.dot(c, x, SY + sign * -28, 10, on ? (sign > 0 ? C.ok : C.bad) : C.bg2, C.muted); text(c, sign > 0 ? '+' : '−', x, SY + sign * -28, { color: on ? '#fff' : C.muted, size: 13, weight: 700 }); };
        lamp(AX - 70, 1, lampA); lamp(AX - 70, -1, lampA); lamp(BX + 70, 1, lampB); lamp(BX + 70, -1, lampB);
        // the gauge for S
        const GX0 = 140, GX1 = 560, GY = 230, gx = v => GX0 + (GX1 - GX0) * clamp(v, 0, 3) / 3;
        c.fillStyle = C.dark ? 'hsl(140 50% 45% / .25)' : 'hsl(140 50% 45% / .2)'; c.fillRect(GX0, GY - 8, gx(2) - GX0, 16);
        c.fillStyle = C.dark ? 'hsl(0 60% 55% / .25)' : 'hsl(0 60% 50% / .18)'; c.fillRect(gx(2), GY - 8, GX1 - gx(2), 16);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(GX0, GY - 8, GX1 - GX0, 16);
        for (const [v, lab] of [[0, '0'], [1, '1'], [2, '2: the most any instructions can give'], [2 * Math.SQRT2, '2√2']]) { c.fillStyle = C.text; c.fillRect(gx(v) - 0.5, GY - 12, 1, 24); text(c, lab, gx(v), GY + 22, { color: C.muted, size: 10 }); }
        if (lastS) { const x = gx(lastS.S); c.fillStyle = C.accent; c.beginPath(); c.moveTo(x, GY - 10); c.lineTo(x - 7, GY - 22); c.lineTo(x + 7, GY - 22); c.closePath(); c.fill(); c.fillRect(gx(lastS.S - lastS.err), GY - 2, Math.max(1, gx(lastS.S + lastS.err) - gx(lastS.S - lastS.err)), 4); text(c, 'S = ' + lastS.S.toFixed(2), x, GY - 32, { color: C.text, size: 12, weight: 600 }); }
        text(c, 'Bell–CHSH value S', GX0 - 8, GY, { color: C.text, size: 11, align: 'right' });
        text(c, V.model === 'qm' ? 'no instructions: to make these pairs the program must use both settings at once' : 'each photon carries its instructions (the bar) and consults only its own polariser', SX, H0 - 10, { color: C.muted, size: 11 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
