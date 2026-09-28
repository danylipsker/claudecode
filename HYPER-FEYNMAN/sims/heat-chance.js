/* HYPER-FEYNMAN · sims/heat-chance.js — simulations for Heat, Chance and the Arrow of Time.
 *   heat-coins        many players toss coins: heads − tails spreads like √N, the fraction of heads settles to ½
 *   heat-gas-box      molecules in a box with a piston: pressure from impacts against nkT, compression heats
 *   heat-atmosphere   molecules hopping up from warm ground settle into the Boltzmann exponential
 *   heat-hydrogen-cv  rotations and vibrations freeze out: C_V of H₂ and other gases, level ladders, spinning molecules
 *   heat-kicks        a big grain kicked by small molecules: a random walk, and equipartition of kinetic energy
 *   heat-brownian     beads in water under a microscope, in real time: ⟨r²⟩ grows as 4Dt with D = kT/6πηa
 *   heat-ink          a drop of dye spreads by random walks into a widening Gaussian
 *   heat-carnot       Carnot's engine: cylinder, reservoirs, heat arrows and the cycle on a P–V diagram
 *   heat-mixing       two gases mix; entropy as the logarithm of the number of arrangements
 *   heat-ratchet      Feynman's paddle wheel and ratchet in two boxes at T₁ and T₂
 *   heat-film         a film of molecules run forwards and backwards (exactly reversible dynamics)
 */
(function () {
  'use strict';

  const kB = 1.380649e-23, AMU = 1.66053906660e-27, EV = 1.602176634e-19, NA = 6.02214076e23;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // fit a W0 × H0 drawing into the stage
  const fit = (st, W0, H0) => { const s = Math.min(st.W / W0, st.H / H0); return { s, ox: (st.W - W0 * s) / 2, oy: (st.H - H0 * s) / 2 }; };
  // a div under the stage for a graph
  const graphBox = box => { const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb); return gb; };
  // reproducible uniform [0, 1) numbers (sfc32: no correlations at the strides used when many players toss in turn)
  function rng(seed) {
    let a = 0x9E3779B9, b = 0x243F6A88, c = 0xB7E15162, d = seed | 0;
    const f = () => { a |= 0; b |= 0; c |= 0; d |= 0; const t = (a + b | 0) + d | 0; d = d + 1 | 0; a = b ^ b >>> 9; b = c + (c << 3) | 0; c = c << 21 | c >>> 11; c = c + t | 0; return (t >>> 0) / 4294967296; };
    for (let i = 0; i < 15; i++) f();
    return f;
  }
  const gauss = R => { const u = Math.max(1e-12, R()), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  // ln(n!) by summing logs (exact enough for the counts used here)
  const LNF = [0]; for (let i = 1; i <= 5000; i++) LNF.push(LNF[i - 1] + Math.log(i));
  const lnC = (n, k) => (k < 0 || k > n) ? -Infinity : LNF[n] - LNF[k] - LNF[n - k];
  const fmtTime = s => s < 1e-3 ? (s * 1e6).toFixed(0) + ' µs' : s < 1 ? (s * 1e3).toFixed(0) + ' ms' : s < 120 ? s.toFixed(1) + ' s' : s < 7200 ? (s / 60).toFixed(1) + ' min' : s < 2 * 86400 ? (s / 3600).toFixed(1) + ' h' : (s / 86400).toFixed(1) + ' days';

  /* ================================================================ heat-coins */
  Hyper.sim('heat-coins', {
    title: 'Tossing coins: the √N law',
    blurb: `Hundreds of players toss coins at the same time. Each thin line is one player's score D = heads − tails, a [[?random-walk]]; the dashed curves are one and two [[?standard-deviation|standard deviations]], ±√N for a fair coin. On the right, on the same scale, the histogram of everybody's D fills out a [[?gaussian]] bell. The graph below follows the *fraction* of heads of a few players, homing in on ½ inside a funnel ±1/(2√N).

**Try this**
- Let a thousand tosses run: the spread of D keeps growing (to about ±32), yet each player's fraction of heads is squeezed towards ½.
- Count: about 68 % of the players stay within ±1σ, about 95 % within ±2σ.
- Take 20 players: individual walks look like trends and streaks, but they are pure chance.
- Bias the coin (p = 0.6): the whole fan drifts at N(2p − 1) while it still spreads like √N.
- Press *Toss again*: every run is different in detail and identical in its statistics.`,
    mount(box, kit) {
      const R = rng(1961);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = graphBox(box);
      let paused = false;
      const ctl = kit.controls(box.side, [
        { id: 'players', type: 'select', label: 'Players tossing together', options: [['20', 20], ['100', 100], ['400', 400], ['2000', 2000]], value: 400 },
        { id: 'nmax', type: 'select', label: 'Tosses per player', options: [['100', 100], ['1 000', 1000], ['10 000', 10000]], value: 1000 },
        { id: 'rate', label: 'Tosses per second (each player)', min: 5, max: 5000, value: 150, log: true, sig: 2 },
        { id: 'p', label: 'Chance of heads, p', min: 0.1, max: 0.9, step: 0.01, value: 0.5 },
        { type: 'buttons', items: [{ id: 'again', label: 'Toss again', primary: true }, { id: 'pause', label: 'Pause / go on' }] }
      ], id => { if (id === 'pause') { paused = !paused; return; } if (id !== 'rate') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Tosses so far, N'], ['sd', 'Spread of D (measured)'], ['th', 'Predicted 2√(Np(1 − p))'], ['in1', 'Players within ±1σ'], ['f1', 'Player 1: fraction of heads']]);
      const plot = kit.plot(gb, { x: { label: 'number of tosses N (logarithmic)', log: true, min: 1, max: 1000 }, y: { label: 'fraction of heads', min: 0, max: 1 }, legend: true }, 170);
      const SHOW = 30, TRACK = 5;
      let M = 0, heads = null, N = 0, paths = [], every = 1, fr = [], nextLog = 1, acc = 0, plotT = 0;
      function reset() {
        M = V.players; heads = new Int32Array(M); N = 0; acc = 0;
        every = Math.max(1, Math.round(V.nmax / 400));
        paths = []; for (let i = 0; i < Math.min(SHOW, M); i++) paths.push([[0, 0]]);
        fr = []; for (let i = 0; i < Math.min(TRACK, M); i++) fr.push([]);
        nextLog = 1;
        plot.set({ x: { label: 'number of tosses N (logarithmic)', log: true, min: 1, max: V.nmax } });
        updatePlot();
      }
      function updatePlot() {
        const p = V.p, band = [], series = [];
        for (let i = 0; i < fr.length; i++) series.push({ pts: fr[i], label: i === 0 ? 'players 1–' + fr.length : undefined, width: i === 0 ? 2 : 1.2 });
        const up1 = [], dn1 = [], up2 = [], dn2 = [];
        for (let k = 0; k <= 60; k++) { const n = Math.pow(V.nmax, k / 60), s = Math.sqrt(p * (1 - p) / n); up1.push([n, Math.min(1, p + s)]); dn1.push([n, Math.max(0, p - s)]); up2.push([n, Math.min(1, p + 2 * s)]); dn2.push([n, Math.max(0, p - 2 * s)]); band.push([n, p]); }
        series.push({ pts: up1, label: 'p ± σ', dash: [5, 4], width: 1.2, color: kit.colors().muted }, { pts: dn1, dash: [5, 4], width: 1.2, color: kit.colors().muted },
          { pts: up2, label: 'p ± 2σ', dash: [2, 4], width: 1.2, color: kit.colors().faint }, { pts: dn2, dash: [2, 4], width: 1.2, color: kit.colors().faint });
        plot.set({ series });
      }
      reset();
      const loop = kit.loop(dt => {
        if (!paused && N < V.nmax) {
          acc += dt * V.rate;
          let steps = Math.min(Math.floor(acc), V.nmax - N, Math.max(1, Math.floor(200000 / M)));
          acc -= Math.floor(acc); if (acc > 1) acc = 0;
          const p = V.p;
          for (let s = 0; s < steps; s++) {
            for (let i = 0; i < M; i++) if (R() < p) heads[i]++;
            N++;
            if (N % every === 0 || N === V.nmax) for (let i = 0; i < paths.length; i++) paths[i].push([N, 2 * heads[i] - N]);
            if (N >= nextLog) { for (let i = 0; i < fr.length; i++) fr[i].push([N, heads[i] / N]); nextLog = Math.max(N + 1, Math.ceil(nextLog * 1.08)); }
          }
        }
        plotT += dt; if (plotT > 0.25) { plotT = 0; updatePlot(); }
        // statistics of D over all players
        const p = V.p, mu = N * (2 * p - 1), sig = 2 * Math.sqrt(N * p * (1 - p));
        let s1 = 0, s2 = 0, in1 = 0;
        for (let i = 0; i < M; i++) { const d = 2 * heads[i] - N; s1 += d; s2 += d * d; if (Math.abs(d - mu) <= sig + 1e-9) in1++; }
        const mean = s1 / M, sd = Math.sqrt(Math.max(0, s2 / M - mean * mean));
        ro.set('n', String(N) + (N >= V.nmax ? ' (done)' : ''));
        ro.set('sd', sd.toFixed(2));
        ro.set('th', sig.toFixed(2));
        ro.set('in1', N ? (100 * in1 / M).toFixed(0) + ' %' : '—');
        ro.set('f1', N ? (heads[0] / N).toFixed(4) : '—');
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 380, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        const X0 = 56, X1 = 520, YM = 190, HH = 165, HX = 548, HW = 190;
        const nmax = V.nmax, sigMax = 2 * Math.sqrt(nmax * p * (1 - p)), ymax = Math.max(4, Math.abs(nmax * (2 * p - 1)) + 3.2 * sigMax);
        const tx = n => X0 + (X1 - X0) * n / nmax, ty = d => YM - HH * d / ymax;
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, YM - HH - 6); c.lineTo(X0, YM + HH + 6); c.moveTo(X0, YM); c.lineTo(X1, YM); c.stroke();
        kit.label(c, 'heads − tails, D', X0 - 6, 12, { size: 12, color: C.muted, align: 'left' });
        kit.label(c, 'tosses N →', X1, YM + HH + 14, { size: 12, color: C.muted, align: 'right' });
        kit.label(c, '0', X0 - 6, YM, { size: 11, color: C.muted, align: 'right' });
        const tick = Hyper.niceStep ? Hyper.niceStep(ymax, 3) : Math.pow(10, Math.floor(Math.log10(ymax)));
        for (let v = tick; v < ymax; v += tick) { kit.label(c, '+' + v, X0 - 6, ty(v), { size: 11, color: C.muted, align: 'right' }); kit.label(c, '−' + v, X0 - 6, ty(-v), { size: 11, color: C.muted, align: 'right' }); }
        // the envelopes: mean, ±σ, ±2σ
        const env = (k, dash, col) => { c.strokeStyle = col; c.setLineDash(dash); c.lineWidth = 1.5; for (const sgn of k ? [-1, 1] : [0]) { c.beginPath(); for (let j = 0; j <= 80; j++) { const n = nmax * j / 80, y = n * (2 * p - 1) + sgn * k * 2 * Math.sqrt(n * p * (1 - p)); if (j === 0) c.moveTo(tx(n), ty(y)); else c.lineTo(tx(n), ty(y)); } c.stroke(); } c.setLineDash([]); };
        env(0, [2, 3], C.faint); env(1, [6, 4], C.text); env(2, [2, 4], C.muted);
        kit.label(c, '±σ', tx(nmax) + 4, ty(nmax * (2 * p - 1) + sigMax), { size: 11, color: C.text });
        kit.label(c, '±2σ', tx(nmax) + 4, ty(nmax * (2 * p - 1) + 2 * sigMax), { size: 11, color: C.muted });
        // the walks
        for (let i = paths.length - 1; i >= 0; i--) {
          const P = paths[i]; if (P.length < 2) continue;
          c.strokeStyle = i === 0 ? C.accent : C.hue ? C.hue(200 + 7 * i, 0.35) : C.faint; c.lineWidth = i === 0 ? 2.2 : 1;
          c.beginPath(); c.moveTo(tx(P[0][0]), ty(P[0][1])); for (let j = 1; j < P.length; j++) c.lineTo(tx(P[j][0]), ty(P[j][1])); c.stroke();
        }
        if (paths.length && N > 0) { const last = paths[0][paths[0].length - 1]; kit.dot(c, tx(last[0]), ty(last[1]), 4, C.accent); kit.label(c, 'player 1', tx(last[0]) + 6, ty(last[1]) - 10, { size: 11, color: C.accent }); }
        // the histogram of D, sideways on the same scale
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(HX, YM - HH - 6); c.lineTo(HX, YM + HH + 6); c.stroke();
        kit.label(c, 'all ' + M + ' players', HX + 4, 12, { size: 12, color: C.muted });
        if (N > 0) {
          const s0 = Math.max(1, sig), bw = Math.max(2, 2 * Math.round(s0 / 5)), nb = Math.ceil(2 * ymax / bw) + 1, cnt = new Float64Array(nb);
          // bins aligned with the parity of D (it changes in steps of 2)
          const base = -ymax - ((-ymax - N) % 2 + 2) % 2 - bw / 2;
          for (let i = 0; i < M; i++) { const d = 2 * heads[i] - N, k = Math.floor((d - base) / bw); if (k >= 0 && k < nb) cnt[k]++; }
          const peak = M * bw / (s0 * Math.sqrt(2 * Math.PI)), top = Math.max(peak, ...cnt, 1), sc = HW / top;
          c.fillStyle = C.hue ? C.hue(28, 0.75) : C.warn;
          for (let k = 0; k < nb; k++) if (cnt[k]) { const y0 = ty(base + (k + 1) * bw), y1 = ty(base + k * bw); c.fillRect(HX, y0, cnt[k] * sc, Math.max(1, y1 - y0 - 0.5)); }
          c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath();
          for (let j = 0; j <= 120; j++) { const d = -ymax + 2 * ymax * j / 120, g = peak * Math.exp(-0.5 * Math.pow((d - mu) / s0, 2)); if (j === 0) c.moveTo(HX + g * sc, ty(d)); else c.lineTo(HX + g * sc, ty(d)); }
          c.stroke();
          kit.label(c, 'bell: σ = ' + sig.toFixed(1), HX + 8, YM + HH + 14, { size: 11, color: C.text });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-gas-box */
  const GASES = { He: { m: 4.0026, name: 'helium' }, Ar: { m: 39.948, name: 'argon' }, Xe: { m: 131.29, name: 'xenon' } };
  Hyper.sim('heat-gas-box', {
    title: 'A gas of molecules pushing on a piston',
    blurb: `Real molecules in a box a few tens of nanometres wide, in extreme slow motion (the box is drawn in perspective; bigger dots are nearer). Every flash on the piston is an impact delivering momentum 2mvₓ. Adding up the impacts gives the **measured pressure**; the kinetic theory predicts $p = Nk_BT/V$, with $T$ read from the molecules' mean kinetic energy, ½m⟨v²⟩ = ³⁄₂k_BT. Colours show speed, blue slow to orange fast.

**Try this**
- Watch the measured pressure jitter and then settle on Nk_BT/V: with a hundred molecules, fluctuations of ten per cent are normal (see the √N law).
- Drag the piston handle (or use the slider) to halve the volume: the pressure doubles *and more*, because the insulated gas warms — each molecule rebounds faster from the approaching piston.
- Choose the slow piston (and more slow motion) and halve the volume again: T·V^(2/3) stays constant, the adiabatic law for atoms (γ = 5/3), and argon goes from 300 K to about 476 K. A sudden shove heats the gas more than that: the extra is the price of doing it irreversibly.
- Pull the piston out: molecules bouncing off the retreating piston come back slower, and the gas cools.
- Untick *insulated walls*: the walls now hold the temperature, so compression leaves T unchanged and p ∝ 1/V (Boyle's law).
- Change helium to xenon at the same temperature: the atoms are 33 times heavier and move 5.7 times slower, but the pressure is the same.`,
    mount(box, kit) {
      const R = rng(1939);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'gas', type: 'select', label: 'Gas', options: [['Helium (4 u)', 'He'], ['Argon (40 u)', 'Ar'], ['Xenon (131 u)', 'Xe']], value: 'Ar' },
        { id: 'N', label: 'Number of molecules', min: 20, max: 400, step: 10, value: 150 },
        { id: 'T', label: 'Heat or cool the gas to', min: 50, max: 1500, step: 10, value: 300, unit: 'K' },
        { id: 'X', label: 'Piston position (length of the box)', min: 6, max: 30, step: 0.5, value: 20, unit: 'nm' },
        { id: 'pspeed', type: 'select', label: 'Piston speed', options: [['Slow, 5 m/s (reversible)', 5], ['Brisk, 50 m/s', 50], ['Sudden, 400 m/s (a shove)', 400]], value: 50 },
        { id: 'ins', type: 'check', label: 'Insulated walls (no heat in or out)', value: true },
        { id: 'slow', label: 'Slow motion: picoseconds shown per second', min: 5, max: 500, value: 80, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }] }
      ], (id, v) => {
        if (id === 'gas' || id === 'N' || id === 'restart') build();
        else if (id === 'T') { setTemp(v); resetAvg(); }
        else if (id === 'X') { target = v; }
        else if (id === 'ins') resetAvg();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['N', 'Molecules N'], ['V', 'Volume V'], ['T', 'Temperature from ½m⟨v²⟩'], ['pm', 'Measured pressure (average)'], ['pt', 'Kinetic theory Nk_BT/V'], ['vr', 'rms speed'], ['tv', 'T·V^(2/3) (constant if insulated)']]);
      const plot = kit.plot(gb, { x: { label: 'time (ns)' }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 160);
      const LY = 20, LZ = 20;      // nm
      let m = 0, n = 0, x, y, z, vx, vy, vz, X = 20, target = 20, tps = 0, imp = 0, sumImp = 0, sumT = 0, pEma = 0, hist = [], histT = 0, hits = [];
      function sig(T) { return Math.sqrt(kB * T / m) / 1000; }     // nm/ps
      function build() {
        m = GASES[V.gas].m * AMU; n = V.N | 0;
        x = new Float64Array(n); y = new Float64Array(n); z = new Float64Array(n); vx = new Float64Array(n); vy = new Float64Array(n); vz = new Float64Array(n);
        X = target = V.X;
        const s = sig(V.T);
        for (let i = 0; i < n; i++) { x[i] = R() * X; y[i] = R() * LY; z[i] = R() * LZ; vx[i] = s * gauss(R); vy[i] = s * gauss(R); vz[i] = s * gauss(R); }
        setTemp(V.T); tps = 0; hist = []; histT = 0; hits = []; resetAvg(); pEma = pTheory();
      }
      function kinT() { let s = 0; for (let i = 0; i < n; i++) s += vx[i] * vx[i] + vy[i] * vy[i] + vz[i] * vz[i]; return n ? m * (s / n) * 1e6 / (3 * kB) : 0; }
      function setTemp(T) { const t0 = kinT(); if (t0 <= 0) return; const f = Math.sqrt(T / t0); for (let i = 0; i < n; i++) { vx[i] *= f; vy[i] *= f; vz[i] *= f; } }
      function resetAvg() { sumImp = 0; sumT = 0; }
      function pTheory() { return n * kB * kinT() / (X * LY * LZ * 1e-27); }
      build();
      // drag the piston by its handle
      let geo = { s: 1, ox: 0, oy: 0, k: 12, bx: 60, by: 40 }, grab = 0, plotT = 0;
      const local = p => [(p.x - geo.ox) / geo.s, (p.y - geo.oy) / geo.s];
      kit.drag(st, {
        // anywhere from the piston plate to its handle
        hit: p => { const [px, py] = local(p), hx = geo.bx + X * geo.k; return px > hx - 10 && px < hx + 0.42 * LZ * geo.k + 130 && py > geo.by - 0.3 * LZ * geo.k - 20 && py < geo.by + LY * geo.k + 20 ? 1 : null; },
        start: (t, p) => { grab = local(p)[0] - (geo.bx + X * geo.k); },
        move: (t, p) => { target = clamp(Math.round(2 * (local(p)[0] - grab - geo.bx) / geo.k) / 2, 6, 30); ctl.set('X', target); },
        hover: true
      });
      const loop = kit.loop(dt => {
        // ---- physics, in nm, ps
        const span = dt * V.slow, sub = Math.max(1, Math.ceil(span / 0.25)), h = span / sub, s0 = sig(V.T);
        let impFrame = 0;
        for (let k = 0; k < sub; k++) {
          // the piston moves towards its target at the chosen speed (nm/ps = km/s)
          const up = V.pspeed / 1000, Xold = X, dx = clamp(target - X, -up * h, up * h); X += dx; const u = (X - Xold) / h;
          for (let i = 0; i < n; i++) {
            x[i] += vx[i] * h; y[i] += vy[i] * h; z[i] += vz[i] * h;
            if (x[i] > X) { const v0 = vx[i]; x[i] = 2 * X - x[i]; vx[i] = 2 * u - v0; impFrame += m * (v0 - vx[i]) * 1000; if (hits.length < 60) hits.push({ y: y[i], z: z[i], a: 1 }); if (x[i] < 0) x[i] = 0.01; }
            if (x[i] < 0) { x[i] = -x[i]; if (V.ins) vx[i] = -vx[i]; else { vx[i] = s0 * Math.sqrt(-2 * Math.log(Math.max(1e-12, R()))); vy[i] = s0 * gauss(R); vz[i] = s0 * gauss(R); } }
            if (y[i] < 0) { y[i] = -y[i]; vy[i] = -vy[i]; } else if (y[i] > LY) { y[i] = 2 * LY - y[i]; vy[i] = -vy[i]; }
            if (z[i] < 0) { z[i] = -z[i]; vz[i] = -vz[i]; } else if (z[i] > LZ) { z[i] = 2 * LZ - z[i]; vz[i] = -vz[i]; }
          }
          // collisions between molecules, as random elastic scatterings (about one per molecule every 25 ps)
          let nc = n * h / 50; while (nc > 0) { if (nc < 1 && R() > nc) break; nc--; const i = (R() * n) | 0, j = (R() * n) | 0; if (i === j) continue;
            const gx = vx[i] - vx[j], gy = vy[i] - vy[j], gz = vz[i] - vz[j], g = Math.hypot(gx, gy, gz), cx = (vx[i] + vx[j]) / 2, cy = (vy[i] + vy[j]) / 2, cz = (vz[i] + vz[j]) / 2;
            const ct = 2 * R() - 1, st_ = Math.sqrt(1 - ct * ct), ph = 2 * Math.PI * R(), ex = st_ * Math.cos(ph) * g / 2, ey = st_ * Math.sin(ph) * g / 2, ez = ct * g / 2;
            vx[i] = cx + ex; vy[i] = cy + ey; vz[i] = cz + ez; vx[j] = cx - ex; vy[j] = cy - ey; vz[j] = cz - ez; }
          if (dx !== 0) resetAvg();
        }
        tps += span;
        const A = LY * LZ * 1e-18, pInst = span > 0 ? impFrame / (span * 1e-12 * A) : 0;
        if (span > 0) { pEma += (pInst - pEma) * (1 - Math.exp(-span / 150)); sumImp += impFrame; sumT += span; }
        const T = kinT(), Vol = X * LY * LZ, pT = n * kB * T / (Vol * 1e-27), pAvg = sumT > 20 ? sumImp / (sumT * 1e-12 * A) : pEma;
        histT += span; if (histT >= 10) { histT = 0; hist.push([tps / 1000, pEma / 1e5, pT / 1e5]); if (hist.length > 400) hist.shift(); }
        plotT += dt; if (plotT > 0.25) { plotT = 0; plot.set({ series: [{ pts: hist.map(q => [q[0], q[1]]), label: 'measured from impacts (running average)', width: 1.6 }, { pts: hist.map(q => [q[0], q[2]]), label: 'Nk_BT/V', dash: [6, 4], width: 2 }] }); }
        ro.set('N', String(n)); ro.set('V', Vol.toFixed(0) + ' nm³');
        ro.set('T', T.toFixed(0) + ' K'); ro.set('pm', (pAvg / 1e5).toFixed(2) + ' bar'); ro.set('pt', (pT / 1e5).toFixed(2) + ' bar');
        ro.set('vr', (Math.sqrt(3 * kB * T / m)).toFixed(0) + ' m/s'); ro.set('tv', (T * Math.pow(Vol, 2 / 3)).toExponential(3) + ' K·nm²');
        // ---- drawing: oblique projection, x to the right, y down, z into the page (up and right)
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 380, f = fit(st, W0, H0), K = 11.5, bx = 40, by = 40 + 0.3 * LZ * K;
        geo = { s: f.s, ox: f.ox, oy: f.oy, k: K, bx, by };
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        const P = (px, py, pz) => [bx + px * K + 0.42 * pz * K, by + py * K - 0.3 * pz * K];
        const line = (a, b) => { c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); };
        // back faces
        c.strokeStyle = C.faint; c.lineWidth = 1;
        const L = 30;
        line(P(0, 0, LZ), P(L, 0, LZ)); line(P(0, LY, LZ), P(L, LY, LZ)); line(P(0, 0, LZ), P(0, LY, LZ)); line(P(0, 0, 0), P(0, 0, LZ)); line(P(0, LY, 0), P(0, LY, LZ));
        c.fillStyle = C.hue ? C.hue(210, 0.06) : 'rgba(120,140,255,.06)'; c.beginPath(); const q = [P(0, 0, 0), P(0, 0, LZ), P(0, LY, LZ), P(0, LY, 0)]; c.moveTo(q[0][0], q[0][1]); for (const pt of q) c.lineTo(pt[0], pt[1]); c.fill();
        if (!V.ins) { c.strokeStyle = C.warn; c.lineWidth = 3; line(P(0, 0, 0), P(0, LY, 0)); kit.label(c, 'walls at ' + V.T + ' K', P(0, LY, 0)[0], P(0, LY, 0)[1] + 16, { size: 11, color: C.warn }); }
        // molecules, far ones first
        const vr = Math.sqrt(3 * kB * Math.max(T, 1) / m) / 1000, order = Array.from({ length: n }, (_, i) => i).sort((a, b) => z[b] - z[a]);
        for (const i of order) {
          const sp = Math.hypot(vx[i], vy[i], vz[i]) / (vr || 1), pt = P(x[i], y[i], z[i]);
          c.fillStyle = 'hsl(' + (215 - 185 * clamp(sp / 1.8, 0, 1)) + ' 80% ' + (C.dark ? 62 : 48) + '%)';
          c.beginPath(); c.arc(pt[0], pt[1], 2.2 + 1.6 * (1 - z[i] / LZ), 0, 6.283); c.fill();
        }
        // front edges of the box
        c.strokeStyle = C.text; c.lineWidth = 1.5; line(P(0, 0, 0), P(L, 0, 0)); line(P(0, LY, 0), P(L, LY, 0)); line(P(0, 0, 0), P(0, LY, 0));
        // the piston: a plate at x = X, with impact flashes, a rod and a handle
        const pa = P(X, 0, 0), pb = P(X, 0, LZ), pc = P(X, LY, LZ), pd = P(X, LY, 0);
        c.fillStyle = C.hue ? C.hue(28, 0.28) : 'rgba(255,150,50,.3)'; c.strokeStyle = C.hue ? C.hue(28) : C.warn; c.lineWidth = 2;
        c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.lineTo(pc[0], pc[1]); c.lineTo(pd[0], pd[1]); c.closePath(); c.fill(); c.stroke();
        for (const hh of hits) { const pt = P(X, hh.y, hh.z); c.fillStyle = 'hsl(48 100% 60% / ' + hh.a.toFixed(2) + ')'; c.beginPath(); c.arc(pt[0], pt[1], 2 + 5 * hh.a, 0, 6.283); c.fill(); hh.a -= dt * 3; }
        hits = hits.filter(hh => hh.a > 0);
        if (Math.abs(target - X) > 0.05) { const ta = P(target, 0, 0), td = P(target, LY, 0); c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.lineWidth = 1.2; line(ta, td); c.setLineDash([]); kit.label(c, 'moving to ' + target.toFixed(1) + ' nm', ta[0], ta[1] - 24, { size: 11, color: C.muted, align: 'center' }); }
        const mid = P(X, LY / 2, LZ / 2);
        c.strokeStyle = C.muted; c.lineWidth = 5; c.beginPath(); c.moveTo(mid[0], mid[1]); c.lineTo(mid[0] + 110, mid[1]); c.stroke();
        c.fillStyle = C.muted; c.fillRect(mid[0] + 100, mid[1] - 24, 16, 48);
        kit.label(c, 'drag', mid[0] + 108, mid[1] + 36, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'piston', pa[0], pa[1] - 10, { size: 12, color: C.text, align: 'center' });
        kit.label(c, 'box ' + LY + ' nm high, ' + LZ + ' nm deep, ' + X.toFixed(1) + ' nm long', bx, H0 - 12, { size: 12, color: C.muted });
        kit.label(c, 'time ' + (tps / 1000).toFixed(2) + ' ns', W0 - 12, 16, { size: 12, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-atmosphere */
  const MOLS = { N2: [28.013, 'N₂'], O2: [31.998, 'O₂'], He: [4.0026, 'He'], H2: [2.016, 'H₂'], CO2: [44.009, 'CO₂'], Ar: [39.948, 'Ar'] };
  Hyper.sim('heat-atmosphere', {
    title: 'An atmosphere settling into Boltzmann\'s law',
    blurb: `Molecules are shot upwards by the warm ground, each with a random thermal speed, and fly freely under gravity until they fall back (collisions between molecules are left out — they would not change the result). Time runs many times faster than life. At the side, the histogram of heights is compared with the [[?boltzmann-factor|Boltzmann]] prediction $n \\propto e^{-mgh/k_BT}$; below, on a logarithmic scale, the exponential becomes a straight line.

**Try this**
- *Drop them all from the top* and watch the column settle into the exponential within a few hops.
- Read the scale height $k_BT/mg$: about 8.7 km for nitrogen on Earth. Everest is marked.
- Mix in helium: each gas takes its own scale height — helium's is seven times nitrogen's.
- Compare the rms vertical speed low down and high up: they are the same. Molecules slow as they climb, but only the fast ones get high, and the survivors have the ground's distribution.
- Warm the ground to 600 K and watch the atmosphere swell; cool it and it shrinks. Try carbon dioxide on Mars.`,
    mount(box, kit) {
      const R = rng(1868);
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'planet', type: 'select', label: 'Gravity', options: [['Earth, g = 9.81 m/s²', 9.81], ['Mars, 3.71 m/s²', 3.71], ['Venus, 8.87 m/s²', 8.87], ['Titan, 1.35 m/s²', 1.35]], value: 9.81 },
        { id: 'A', type: 'select', label: 'Gas', options: [['Nitrogen N₂ (28 u)', 'N2'], ['Oxygen O₂ (32 u)', 'O2'], ['Carbon dioxide CO₂ (44 u)', 'CO2'], ['Argon (40 u)', 'Ar'], ['Helium (4 u)', 'He'], ['Hydrogen H₂ (2 u)', 'H2']], value: 'N2' },
        { id: 'B', type: 'select', label: 'Mixed with', options: [['nothing', 'none'], ['helium (4 u)', 'He'], ['hydrogen H₂ (2 u)', 'H2'], ['carbon dioxide (44 u)', 'CO2'], ['nitrogen (28 u)', 'N2']], value: 'none' },
        { id: 'T', label: 'Temperature of the ground and the gas', min: 50, max: 800, step: 1, value: 288, unit: 'K' },
        { id: 'n', label: 'Molecules drawn', min: 200, max: 2000, step: 100, value: 900 },
        { type: 'buttons', items: [{ id: 'drop', label: 'Drop them all from the top', primary: true }, { id: 'stir', label: 'Stir evenly' }] }
      ], id => { if (id === 'drop') init('top'); else if (id === 'T') { /* the ground re-emits at the new temperature */ } else init('uniform'); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['HA', 'Scale height k_BT/mg'], ['HB', 'Scale height, second gas'], ['mh', 'Mean height of the gas (theory: H)'], ['half', 'Density halves every H ln 2'], ['v1', 'rms vertical speed below H'], ['v2', 'rms vertical speed above H'], ['up', 'Molecules above the picture'], ['ts', 'Time runs faster by']]);
      const plot = kit.plot(gb, { x: { label: 'height (km)', min: 0 }, y: { label: 'density ÷ density at the ground', log: true, min: 0.003, max: 1.5 }, legend: true }, 170);
      const NB = 30;
      let N = 0, h, vz, xh, vxh, sp, mass = [1, 1], nsp = 1, hmax = 40000, tsc = 30, plotT = 0, cnt = [new Float64Array(NB), new Float64Array(NB)];
      const g = () => V.planet;
      const sig = s => Math.sqrt(kB * V.T / mass[s]);
      const Hof = s => kB * V.T / (mass[s] * g());
      function init(mode) {
        mass[0] = MOLS[V.A][0] * AMU; nsp = V.B === 'none' || V.B === V.A ? 1 : 2; mass[1] = nsp > 1 ? MOLS[V.B][0] * AMU : mass[0];
        N = V.n | 0; h = new Float64Array(N); vz = new Float64Array(N); xh = new Float64Array(N); vxh = new Float64Array(N); sp = new Uint8Array(N);
        hmax = 4.5 * Math.max(Hof(0), nsp > 1 ? Hof(1) : 0);
        tsc = (Math.max(sig(0), nsp > 1 ? sig(1) : 0) / g()) / 1.2;
        for (let i = 0; i < N; i++) {
          sp[i] = nsp > 1 && (i % 2) ? 1 : 0; xh[i] = R(); vxh[i] = (R() - 0.5) * 0.3;
          if (mode === 'top') { h[i] = hmax * (0.8 + 0.2 * R()); vz[i] = 0; } else { h[i] = R() * hmax; vz[i] = sig(sp[i]) * gauss(R); }
        }
      }
      function advance(i, t) {
        const G = g();
        for (let k = 0; k < 8 && t > 0; k++) {
          const hn = h[i] + vz[i] * t - 0.5 * G * t * t;
          if (hn >= 0) { h[i] = hn; vz[i] -= G * t; return; }
          const th = (vz[i] + Math.sqrt(vz[i] * vz[i] + 2 * G * Math.max(0, h[i]))) / G;   // time to reach the ground
          t -= th; h[i] = 0;
          vz[i] = sig(sp[i]) * Math.sqrt(-2 * Math.log(Math.max(1e-12, R())));           // re-emitted upwards by the warm ground
        }
        if (h[i] < 0) h[i] = 0;
      }
      init('top');
      const loop = kit.loop(dt => {
        const ds = dt * tsc;
        for (let i = 0; i < N; i++) { advance(i, ds); xh[i] += vxh[i] * dt; if (xh[i] < 0) { xh[i] = -xh[i]; vxh[i] = -vxh[i]; } else if (xh[i] > 1) { xh[i] = 2 - xh[i]; vxh[i] = -vxh[i]; } }
        // statistics
        cnt[0].fill(0); cnt[1].fill(0);
        const ns = [0, 0], sh = [0, 0], HA = Hof(0), HB = nsp > 1 ? Hof(1) : 0;
        let up = 0, s1 = 0, n1 = 0, s2 = 0, n2 = 0;
        for (let i = 0; i < N; i++) {
          const s = sp[i], k = Math.floor(h[i] / hmax * NB); ns[s]++; sh[s] += h[i];
          if (k >= NB) up++; else cnt[s][k]++;
          if (s === 0) { if (h[i] < HA) { s1 += vz[i] * vz[i]; n1++; } else if (h[i] < 4 * HA) { s2 += vz[i] * vz[i]; n2++; } }
        }
        ro.set('HA', (HA / 1000).toFixed(2) + ' km (' + MOLS[V.A][1] + ')');
        ro.set('HB', nsp > 1 ? (HB / 1000).toFixed(2) + ' km (' + MOLS[V.B][1] + ')' : '—');
        ro.set('mh', ns[0] ? (sh[0] / ns[0] / 1000).toFixed(2) + ' km' : '—');
        ro.set('half', (HA * Math.LN2 / 1000).toFixed(2) + ' km');
        ro.set('v1', n1 ? Math.sqrt(s1 / n1).toFixed(0) + ' m/s' : '—');
        ro.set('v2', n2 ? Math.sqrt(s2 / n2).toFixed(0) + ' m/s' : '—');
        ro.set('up', String(up));
        ro.set('ts', '× ' + tsc.toFixed(0));
        plotT += dt;
        if (plotT > 0.3) {
          plotT = 0;
          const dh = hmax / NB, series = [];
          for (let s = 0; s < nsp; s++) {
            const H = s ? HB : HA, name = MOLS[s ? V.B : V.A][1], th = [], ms = [];
            for (let j = 0; j <= 60; j++) { const hh = hmax * j / 60; th.push([hh / 1000, Math.exp(-hh / H)]); }
            for (let k = 0; k < NB; k++) if (cnt[s][k] > 0 && ns[s]) ms.push([(k + 0.5) * dh / 1000, cnt[s][k] / ns[s] * H / dh]);
            series.push({ pts: th, label: name + ': e^(−h/H)', width: 2, color: s ? kit.colors().series[1] : kit.colors().accent }, { pts: ms, label: name + ': counted', line: false, dots: 3, color: s ? kit.colors().series[1] : kit.colors().accent });
          }
          plot.set({ x: { label: 'height (km)', min: 0, max: hmax / 1000 }, series });
        }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 390, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        const X0 = 60, X1 = 350, Y0 = 350, Y1 = 30, ty = hh => Y0 - (Y0 - Y1) * hh / hmax, col = [C.accent, C.series[1]];
        // the sky gets darker with height
        for (let j = 0; j < 20; j++) { c.fillStyle = 'hsl(210 60% ' + (C.dark ? 12 + 10 * (1 - j / 20) : 96 - 14 * (1 - j / 20)) + '%)'; c.fillRect(X0, Y1 + (Y0 - Y1) * j / 20, X1 - X0, (Y0 - Y1) / 20 + 1); }
        // height scale
        const step = (Hyper.niceStep ? Hyper.niceStep(hmax / 1000, 5) : 10) * 1000;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let hh = 0; hh <= hmax + 1; hh += step) { c.beginPath(); c.moveTo(X0 - 5, ty(hh)); c.lineTo(X1, ty(hh)); c.stroke(); kit.label(c, (hh / 1000).toFixed(0) + ' km', X0 - 8, ty(hh), { size: 11, color: C.muted, align: 'right' }); }
        // landmarks on Earth
        if (V.planet === 9.81 && 8849 < hmax) {
          c.fillStyle = C.hue(30, 0.35); c.beginPath(); c.moveTo(X0 + 10, Y0); c.lineTo(X0 + 60, ty(8849)); c.lineTo(X0 + 115, Y0); c.closePath(); c.fill();
          kit.label(c, 'Everest', X0 + 60, ty(8849) - 9, { size: 11, color: C.muted, align: 'center' });
        }
        if (V.planet === 9.81 && 11000 < hmax) { kit.label(c, '✈ 11 km', X1 - 6, ty(11000), { size: 11, color: C.muted, align: 'right' }); }
        // molecules
        for (let i = 0; i < N; i++) { if (h[i] > hmax) continue; c.fillStyle = col[sp[i]]; c.fillRect(X0 + 4 + xh[i] * (X1 - X0 - 8) - 1.5, ty(h[i]) - 1.5, 3, 3); }
        // the warm ground
        c.fillStyle = 'hsl(' + (220 - 200 * clamp((V.T - 50) / 750, 0, 1)) + ' 70% 50%)'; c.fillRect(X0, Y0, X1 - X0, 12);
        kit.label(c, 'ground at ' + V.T + ' K', (X0 + X1) / 2, Y0 + 24, { size: 12, color: C.text, align: 'center' });
        if (up) kit.label(c, '↑ ' + up + ' above', X1 - 6, Y1 - 12, { size: 11, color: C.muted, align: 'right' });
        // the histogram, sideways on the same height scale, with the Boltzmann prediction
        const HX = 380, HW = 330, dh = hmax / NB;
        let top = 1; const exp0 = [];
        for (let s = 0; s < nsp; s++) { const H = s ? Hof(1) : Hof(0); exp0.push(ns[s] * (1 - Math.exp(-dh / H))); top = Math.max(top, exp0[s], ...cnt[s]); }
        const sc = HW / top;
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(HX, Y1); c.lineTo(HX, Y0); c.lineTo(HX + HW, Y0); c.stroke();
        for (let s = 0; s < nsp; s++) {
          c.fillStyle = s ? C.hue(28, 0.45) : C.hue(230, 0.45);
          for (let k = 0; k < NB; k++) if (cnt[s][k]) c.fillRect(HX, ty((k + 1) * dh) + 0.5, cnt[s][k] * sc, (Y0 - Y1) / NB - 1);
          const H = s ? Hof(1) : Hof(0);
          c.strokeStyle = col[s]; c.lineWidth = 2.2; c.beginPath();
          for (let j = 0; j <= 80; j++) { const hh = hmax * j / 80, v = ns[s] * (1 - Math.exp(-dh / H)) * Math.exp(-hh / H) * Math.exp(dh / H / 2); if (j === 0) c.moveTo(HX + v * sc, ty(hh)); else c.lineTo(HX + v * sc, ty(hh)); }
          c.stroke();
          const lh = Math.min(hmax * 0.9, H);
          c.setLineDash([4, 4]); c.strokeStyle = col[s]; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, ty(H)); c.lineTo(HX + HW, ty(H)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'H = ' + (H / 1000).toFixed(1) + ' km (' + MOLS[s ? V.B : V.A][1] + ')', HX + HW, ty(lh) - 9, { size: 11, color: col[s], align: 'right' });
        }
        kit.label(c, 'molecules per height band', HX + 4, Y1 - 12, { size: 12, color: C.muted });
        kit.label(c, 'curve: e^(−mgh/k_BT)', HX + HW, Y0 + 14, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-hydrogen-cv */
  const DIATOMIC = {
    H2: { rot: 85.3, vib: 6332, name: 'H₂', col: ['hsl(0 0% 88%)', 'hsl(0 0% 88%)'] },
    H2n: { rot: 85.3, vib: 6332, name: 'H₂ (¾ ortho, ¼ para)', normal: true, col: ['hsl(0 0% 88%)', 'hsl(0 0% 88%)'] },
    N2: { rot: 2.88, vib: 3374, name: 'N₂', col: ['hsl(225 70% 60%)', 'hsl(225 70% 60%)'] },
    O2: { rot: 2.07, vib: 2256, name: 'O₂', col: ['hsl(0 75% 58%)', 'hsl(0 75% 58%)'] },
    Cl2: { rot: 0.351, vib: 808, name: 'Cl₂', col: ['hsl(120 55% 45%)', 'hsl(120 55% 45%)'] },
    HCl: { rot: 15.02, vib: 4227, name: 'HCl', col: ['hsl(0 0% 88%)', 'hsl(120 55% 45%)'] }
  };
  // heat capacity (per R) of a rigid rotor with levels θ·J(J+1), each (2J+1)-fold; parity 0: all J, 1: even J only, 2: odd J only
  function cRot(T, th, parity) {
    const jmax = Math.min(3000, Math.ceil(Math.sqrt(40 * T / th)) + 4);
    let Z = 0, E1 = 0, E2 = 0, e0 = null;
    for (let J = 0; J <= jmax; J++) {
      if ((parity === 1 && J % 2) || (parity === 2 && !(J % 2))) continue;
      const e = th * J * (J + 1); if (e0 === null) e0 = e;
      const w = (2 * J + 1) * Math.exp(-(e - e0) / T);
      Z += w; E1 += w * (e - e0); E2 += w * (e - e0) * (e - e0);
    }
    if (!(Z > 0)) return 0;
    E1 /= Z; E2 /= Z;
    return Math.max(0, (E2 - E1 * E1) / (T * T));
  }
  const cVib = (T, th) => { const x = th / T; if (x > 600) return 0; if (x < 1e-6) return 1; const ex = Math.exp(x); return x * x * ex / ((ex - 1) * (ex - 1)); };
  const cvParts = (gs, T) => ({ tr: 1.5, rot: gs.normal ? 0.75 * cRot(T, gs.rot, 2) + 0.25 * cRot(T, gs.rot, 1) : cRot(T, gs.rot, 0), vib: cVib(T, gs.vib) });
  // populations of the rotational levels J = 0 … jcap, for one parity
  function rotPop(T, th, parity, jcap) {
    const w = []; let Z = 0;
    for (let J = 0; J <= jcap; J++) { const ok = !((parity === 1 && J % 2) || (parity === 2 && !(J % 2))); const v = ok ? (2 * J + 1) * Math.exp(-th * J * (J + 1) / T) : 0; w.push(v); Z += v; }
    return w.map(v => Z > 0 ? v / Z : 0);
  }
  Hyper.sim('heat-hydrogen-cv', {
    title: 'Frozen motions: the heat capacity of hydrogen',
    blurb: `Sixteen molecules, each in a quantum state drawn from the [[?boltzmann-factor|Boltzmann distribution]] at the chosen temperature: a molecule in its lowest rotational level (J = 0) does not turn; one with J = 1, 2, … turns faster for higher J. The bond always keeps a small zero-point quiver and swings wider only when an excited vibrational level is occupied. The ladders show the levels, how full each one is, and how far $k_BT$ reaches. The graph is the molar heat capacity $C_V/R$: 3/2 from moving about, +1 when rotation wakes, +1 more when vibration does.

**Try this**
- Sweep the temperature from 10 K: below about 50 K hydrogen's molecules stop turning and $C_V \\to \\tfrac32R$; around room temperature rotation is fully awake ($\\tfrac52R$); vibration wakes only above 2000 K or so.
- Compare with nitrogen: its rotational levels are so close that it rotates at any temperature where it is a gas; its vibration, like hydrogen's, is frozen at 300 K.
- Try chlorine: heavy and softly bonded, its vibration is already half awake at room temperature.
- Choose *H₂ (¾ ortho, ¼ para)*: in ordinary hydrogen three molecules in four can only have odd J, so they never stop turning — yet they stop taking up heat. This curve is the one measured.
- The curves pretend the gas stays a gas and does not dissociate; real hydrogen liquefies at 20 K and splits apart above about 3000 K.`,
    mount(box, kit) {
      const R = rng(1912);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = graphBox(box);
      let sweep = false;
      const ctl = kit.controls(box.side, [
        { id: 'gas', type: 'select', label: 'Gas', options: [['Hydrogen H₂ (simple rotor)', 'H2'], ['Hydrogen as normally prepared (¾ ortho, ¼ para)', 'H2n'], ['Nitrogen N₂', 'N2'], ['Oxygen O₂', 'O2'], ['Chlorine Cl₂', 'Cl2'], ['Hydrogen chloride HCl', 'HCl']], value: 'H2' },
        { id: 'T', label: 'Temperature', min: 10, max: 10000, value: 300, log: true, sig: 3, unit: 'K' },
        { id: 'parts', type: 'check', label: 'Show the parts (translation, rotation, vibration)', value: true },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep 10 K → 10 000 K', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], id => { if (id === 'sweep') { sweep = true; ctl.set('T', 10); } else if (id === 'stop') sweep = false; else if (id === 'T') sweep = false; tables(); curve(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kT', 'Thermal energy k_BT'], ['rot', 'First rotational step'], ['vib', 'Vibrational quantum hν'], ['fr', 'Molecules turning (J ≥ 1)'], ['fv', 'Molecules vibrating (v ≥ 1)'], ['cv', 'C_V / R'], ['gam', 'γ = C_p / C_V']]);
      const plot = kit.plot(gb, { x: { label: 'temperature (K, logarithmic)', log: true, min: 10, max: 10000 }, y: { label: 'C_V / R', min: 0, max: 4 }, legend: true }, 180);
      const JCAP = 60, KM = 0.0861733;     // meV per kelvin
      let gs = DIATOMIC.H2, cum = { 0: [], 1: [], 2: [] }, mols = [];
      function tables() {
        gs = DIATOMIC[V.gas];
        for (const par of [0, 1, 2]) { const p = rotPop(V.T, gs.rot, par, JCAP); let s = 0; cum[par] = p.map(v => (s += v)); }
      }
      const drawJ = par => { const cc = cum[par], u = R() * (cc[cc.length - 1] || 1); let J = 0; while (J < cc.length - 1 && cc[J] < u) J++; return J; };
      const drawV = () => { const q = Math.exp(-gs.vib / V.T); if (q < 1e-12) return 0; return Math.min(6, Math.floor(Math.log(Math.max(1e-12, R())) / Math.log(q))); };
      const parityOf = i => gs.normal ? (i % 4 ? 2 : 1) : 0;
      function curve() {
        const tot = [], tr = [], trr = [];
        for (let j = 0; j <= 160; j++) { const T = 10 * Math.pow(1000, j / 160), c = cvParts(gs, T); tot.push([T, c.tr + c.rot + c.vib]); tr.push([T, 1.5]); trr.push([T, 1.5 + c.rot]); }
        const series = [{ pts: tot, label: 'C_V / R, ' + gs.name, width: 2.6 }];
        if (V.parts) series.push({ pts: trr, label: 'translation + rotation', dash: [6, 4], width: 1.4 }, { pts: tr, label: 'translation only', dash: [2, 4], width: 1.4 });
        const now = cvParts(gs, V.T), vl = [];
        if (gs.rot >= 10) vl.push({ x: gs.rot, label: 'Θ_rot' }); if (gs.vib <= 10000) vl.push({ x: gs.vib, label: 'Θ_vib' });
        plot.set({ series, marks: [{ x: V.T, y: now.tr + now.rot + now.vib, label: V.T.toFixed(0) + ' K' }], hlines: [{ y: 1.5, label: '3/2' }, { y: 2.5, label: '5/2' }, { y: 3.5, label: '7/2' }], vlines: vl });
      }
      function build() { tables(); mols = []; for (let i = 0; i < 16; i++) { const par = parityOf(i); mols.push({ par, J: drawJ(par), v: drawV(), phi: R() * 6.283, psi: R() * 6.283, dx: 0, dy: 0 }); } }
      build(); curve();
      let lastGas = V.gas;
      const loop = kit.loop(dt => {
        if (V.gas !== lastGas) { lastGas = V.gas; build(); curve(); }
        if (sweep) { const T = Math.min(10000, V.T * Math.pow(1000, dt / 12)); ctl.set('T', T); tables(); curve(); if (T >= 10000) sweep = false; }
        // molecules collide now and then and land in new states
        for (const m of mols) {
          if (R() < dt * 0.7) { m.J = drawJ(m.par); m.v = drawV(); }
          m.phi += dt * Math.min(30, 1.3 * Math.sqrt(m.J * (m.J + 1)));
          m.psi += dt * 2 * Math.PI * 4;
          const jig = 2 * Math.sqrt(Math.min(V.T, 3000) / 3000);
          m.dx = clamp(m.dx + jig * gauss(R) * dt * 8, -6, 6); m.dy = clamp(m.dy + jig * gauss(R) * dt * 8, -6, 6);
        }
        const T = V.T, cp = cvParts(gs, T), cv = cp.tr + cp.rot + cp.vib, kT = KM * T;
        let pr = rotPop(T, gs.rot, 0, JCAP);
        if (gs.normal) { const po = rotPop(T, gs.rot, 2, JCAP), pe = rotPop(T, gs.rot, 1, JCAP); pr = po.map((v, J) => 0.75 * v + 0.25 * pe[J]); }
        const q = Math.exp(-gs.vib / T), pv = [0, 1, 2, 3, 4].map(v => (1 - q) * Math.pow(q, v));
        ro.set('kT', kT.toFixed(kT < 10 ? 2 : 1) + ' meV');
        ro.set('rot', (2 * gs.rot * KM).toFixed(gs.rot < 5 ? 3 : 1) + ' meV (J = 0 → 1)');
        ro.set('vib', (gs.vib * KM).toFixed(0) + ' meV');
        ro.set('fr', (100 * (1 - pr[0])).toFixed(1) + ' %');
        ro.set('fv', (100 * q).toPrecision(2) + ' %');
        ro.set('cv', cv.toFixed(3));
        ro.set('gam', ((cv + 1) / cv).toFixed(3));
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 380, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        kit.label(c, gs.name + ' at ' + T.toFixed(0) + ' K', 170, 16, { size: 13, color: C.text, align: 'center', weight: 600 });
        mols.forEach((m, i) => {
          const cx = 50 + (i % 4) * 80 + m.dx, cy = 70 + Math.floor(i / 4) * 82 + m.dy, L = 13 * (1 + 0.05 * Math.sqrt(2 * m.v + 1) * Math.sin(m.psi)), ca = Math.cos(m.phi), sa = Math.sin(m.phi);
          if (m.J === 0) { c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, 24, 0, 6.283); c.stroke(); c.setLineDash([]); }
          else { c.strokeStyle = C.hue(200, 0.5); c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, 22, m.phi + 0.3, m.phi + 0.3 + Math.min(2.6, 0.5 + 0.35 * m.J)); c.stroke(); }
          c.strokeStyle = m.v > 0 ? C.warn : C.muted; c.lineWidth = m.v > 0 ? 4 : 3; c.beginPath(); c.moveTo(cx - L * ca, cy - L * sa); c.lineTo(cx + L * ca, cy + L * sa); c.stroke();
          kit.dot(c, cx - L * ca, cy - L * sa, 7.5, gs.col[0], C.text); kit.dot(c, cx + L * ca, cy + L * sa, 7.5, gs.col[1], C.text);
          kit.label(c, 'J=' + m.J + (m.v ? ' v=' + m.v : ''), cx, cy + 34, { size: 10, color: m.J ? C.text : C.muted, align: 'center' });
        });
        // the ladders: energies above the lowest level, each on its own scale, with k_BT shaded
        const ladder = (x0, w, title, levels, pops, Emax) => {
          const Yb = 345, Yt = 50, ty = E => Yb - (Yb - Yt) * E / Emax;
          kit.label(c, title, x0 + w / 2, 30, { size: 12, color: C.text, align: 'center', weight: 600 });
          c.fillStyle = C.hue(28, 0.16); const kTop = Math.min(kT, Emax); c.fillRect(x0, ty(kTop), w, Yb - ty(kTop));
          c.strokeStyle = C.hue(28, 0.9); c.lineWidth = 1.5; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(x0, ty(kTop)); c.lineTo(x0 + w, ty(kTop)); c.stroke(); c.setLineDash([]);
          kit.label(c, kT > Emax ? 'k_BT ↑ (' + kT.toFixed(0) + ' meV)' : 'k_BT', x0 + w - 2, ty(kTop) - 8, { size: 11, color: C.hue(28, 1), align: 'right' });
          levels.forEach((L, k) => {
            if (L.E > Emax) return;
            const y = ty(L.E);
            c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w * 0.42, y); c.stroke();
            c.fillStyle = C.accent; c.fillRect(x0 + w * 0.45, y - 5, Math.max(0.5, pops[k] * w * 0.5), 10);
            kit.label(c, L.name, x0 - 4, y, { size: 10.5, color: C.muted, align: 'right' });
            if (pops[k] > 0.001) kit.label(c, (100 * pops[k]).toFixed(pops[k] < 0.1 ? 1 : 0) + ' %', x0 + w * 0.47 + pops[k] * w * 0.5, y - 9, { size: 10, color: C.text });
          });
          kit.label(c, (Emax).toFixed(Emax < 10 ? 2 : 0) + ' meV', x0 + w / 2, Yt - 10, { size: 10, color: C.faint, align: 'center' });
        };
        const rl = [], rp = [];
        for (let J = 0; J <= 6; J++) { rl.push({ E: gs.rot * KM * J * (J + 1), name: 'J = ' + J }); rp.push(pr[J]); }
        ladder(400, 150, 'rotation', rl, rp, gs.rot * KM * 42 * 1.05);
        const vl = [0, 1, 2, 3, 4].map(v => ({ E: gs.vib * KM * v, name: 'v = ' + v }));
        ladder(610, 130, 'vibration', vl, pv, gs.vib * KM * 4.2);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-kicks */
  Hyper.sim('heat-kicks', {
    title: 'Kicked by molecules',
    blurb: `A toy in two dimensions: a big grain among small, fast molecules that bounce off the walls and off the grain (elastic collisions, momentum and energy conserved). Every collision gives the grain a tiny kick, drawn as an arrow; the kicks never balance exactly, so the grain wanders — a [[?random-walk]]. The bars at the right compare the grain's average kinetic energy with a single molecule's.

**Try this**
- Start again and watch the grain, at first at rest, pick up energy until its average kinetic energy equals that of one molecule: **equipartition**, although it is 60 times heavier.
- Make the grain heavier: it moves more slowly (its speed goes as 1/√M), but its average energy still comes out the same.
- Untick *Show the molecules*: this is what Brown saw — a particle dancing for no visible reason.
- Raise the molecule speed (heat the gas): the kicks get harder and the dance livelier.
- Watch the trail: no straight runs, only a tangle that slowly spreads.`,
    mount(box, kit) {
      const R = rng(1827);
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'M', type: 'select', label: 'Mass of the grain', options: [['20 molecule masses', 20], ['60 molecule masses', 60], ['200 molecule masses', 200]], value: 60 },
        { id: 'n', label: 'Number of molecules', min: 100, max: 1200, step: 50, value: 700 },
        { id: 'v', label: 'Molecule speed, rms (temperature)', min: 80, max: 400, step: 10, value: 220, unit: 'px/s' },
        { id: 'show', type: 'check', label: 'Show the molecules (untick: the microscope view)', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'clear', label: 'Clear the trail' }] }
      ], id => { if (id === 'restart' || id === 'n' || id === 'M') build(); else if (id === 'clear') trail = []; else if (id === 'v') rescale(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Kicks per second'], ['eg', 'Grain ½MV², average'], ['em', 'One molecule ½mv², average'], ['ratio', 'Ratio (equipartition: 1)'], ['vg', 'Grain rms speed: expected √(m/M)·v']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'grain energy ÷ molecule energy', min: 0 }, legend: true }, 150);
      const BX0 = 20, BY0 = 20, BX1 = 580, BY1 = 360, RG = 22, RM = 2;
      let n = 0, x, y, vx, vy, fl, X, Y, VX, VY, M = 60, kicks = [], trail = [], egA = 0, emA = 0, kr = 0, t = 0, hist = [], histT = 0, plotT = 0;
      function build() {
        n = V.n | 0; M = V.M; x = new Float64Array(n); y = new Float64Array(n); vx = new Float64Array(n); vy = new Float64Array(n); fl = new Float32Array(n);
        X = (BX0 + BX1) / 2; Y = (BY0 + BY1) / 2; VX = 0; VY = 0;
        const s = V.v / Math.SQRT2;
        for (let i = 0; i < n; i++) { do { x[i] = BX0 + RM + R() * (BX1 - BX0 - 2 * RM); y[i] = BY0 + RM + R() * (BY1 - BY0 - 2 * RM); } while (Math.hypot(x[i] - X, y[i] - Y) < RG + 4); vx[i] = s * gauss(R); vy[i] = s * gauss(R); }
        rescale(); kicks = []; trail = []; egA = 0; emA = 0.5 * V.v * V.v; kr = 0; t = 0; hist = []; histT = 0;
      }
      function rescale() { let s2 = 0; for (let i = 0; i < n; i++) s2 += vx[i] * vx[i] + vy[i] * vy[i]; const f = s2 > 0 ? V.v / Math.sqrt(s2 / n) : 1; for (let i = 0; i < n; i++) { vx[i] *= f; vy[i] *= f; } }
      build();
      const loop = kit.loop(dt => {
        const sub = 4, h = dt / sub; let hits = 0;
        for (let k = 0; k < sub; k++) {
          X += VX * h; Y += VY * h;
          if (X < BX0 + RG) { X = 2 * (BX0 + RG) - X; VX = -VX; } else if (X > BX1 - RG) { X = 2 * (BX1 - RG) - X; VX = -VX; }
          if (Y < BY0 + RG) { Y = 2 * (BY0 + RG) - Y; VY = -VY; } else if (Y > BY1 - RG) { Y = 2 * (BY1 - RG) - Y; VY = -VY; }
          for (let i = 0; i < n; i++) {
            x[i] += vx[i] * h; y[i] += vy[i] * h;
            if (x[i] < BX0 + RM) { x[i] = 2 * (BX0 + RM) - x[i]; vx[i] = -vx[i]; } else if (x[i] > BX1 - RM) { x[i] = 2 * (BX1 - RM) - x[i]; vx[i] = -vx[i]; }
            if (y[i] < BY0 + RM) { y[i] = 2 * (BY0 + RM) - y[i]; vy[i] = -vy[i]; } else if (y[i] > BY1 - RM) { y[i] = 2 * (BY1 - RM) - y[i]; vy[i] = -vy[i]; }
            const dx = x[i] - X, dy = y[i] - Y, d2 = dx * dx + dy * dy, rr = RG + RM;
            if (d2 < rr * rr) {
              const d = Math.sqrt(d2) || 1e-6, nx = dx / d, ny = dy / d, vn = (vx[i] - VX) * nx + (vy[i] - VY) * ny;
              if (vn < 0) {
                const J = 2 * M / (1 + M) * vn;             // impulse along the line of centres (molecule mass 1)
                vx[i] -= J * nx; vy[i] -= J * ny; VX += J / M * nx; VY += J / M * ny;
                hits++; fl[i] = 0.35;
                if (kicks.length < 80) kicks.push({ x: X + nx * RG, y: Y + ny * RG, dx: nx * J / M, dy: ny * J / M, a: 1 });
              }
              x[i] = X + nx * rr; y[i] = Y + ny * rr;
            }
          }
        }
        t += dt;
        // averages over the time since the start, up to the last 25 s
        let s2 = 0; for (let i = 0; i < n; i++) s2 += vx[i] * vx[i] + vy[i] * vy[i];
        const em = 0.5 * s2 / n, eg = 0.5 * M * (VX * VX + VY * VY), a = 1 - Math.exp(-dt / clamp(t, 1, 25));
        egA += (eg - egA) * a; emA += (em - emA) * a; kr += (hits / Math.max(dt, 1e-6) - kr) * (1 - Math.exp(-dt / 1.5));
        ro.set('k', kr.toFixed(0)); ro.set('eg', egA.toFixed(0) + ' (sim units)'); ro.set('em', emA.toFixed(0) + ' (sim units)');
        ro.set('ratio', emA > 0 ? (egA / emA).toFixed(2) : '—'); ro.set('vg', (V.v / Math.sqrt(M)).toFixed(1) + ' px/s');
        trail.push([X, Y]); if (trail.length > 2400) trail.shift();
        histT += dt; if (histT > 0.25) { histT = 0; hist.push([t, emA > 0 ? egA / emA : 0]); if (hist.length > 600) hist.shift(); }
        plotT += dt; if (plotT > 0.5) { plotT = 0; plot.set({ series: [{ pts: hist, label: 'grain ⟨½MV²⟩ ÷ molecule ⟨½mv²⟩', width: 2 }], hlines: [{ y: 1, label: 'equipartition' }] }); }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 380, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(BX0, BY0, BX1 - BX0, BY1 - BY0);
        if (V.show) {
          c.fillStyle = C.faint; for (let i = 0; i < n; i++) if (fl[i] <= 0) c.fillRect(x[i] - 1.5, y[i] - 1.5, 3, 3);
          c.fillStyle = C.accent; for (let i = 0; i < n; i++) if (fl[i] > 0) { c.beginPath(); c.arc(x[i], y[i], 3, 0, 6.283); c.fill(); fl[i] -= dt; }
        } else for (let i = 0; i < n; i++) if (fl[i] > 0) fl[i] -= dt;
        // the trail
        if (trail.length > 1) { c.strokeStyle = C.hue(200, 0.55); c.lineWidth = 1.4; c.beginPath(); c.moveTo(trail[0][0], trail[0][1]); for (let i = 1; i < trail.length; i++) c.lineTo(trail[i][0], trail[i][1]); c.stroke(); }
        // the grain and its kicks
        c.fillStyle = 'hsl(45 70% ' + (C.dark ? 55 : 60) + '%)'; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(X, Y, RG, 0, 6.283); c.fill(); c.stroke();
        for (const kk of kicks) { const L = clamp(Math.hypot(kk.dx, kk.dy) * 6, 6, 40), ang = Math.atan2(kk.dy, kk.dx); kit.arrow(c, kk.x - L * Math.cos(ang) * 0.2, kk.y - L * Math.sin(ang) * 0.2, kk.x + L * Math.cos(ang), kk.y + L * Math.sin(ang), 'hsl(28 95% 55% / ' + kk.a.toFixed(2) + ')', 2); kk.a -= dt * 3; }
        kicks = kicks.filter(kk => kk.a > 0);
        kit.label(c, 'grain: ' + M + ' × molecule mass', X, Y - RG - 10, { size: 11, color: C.text, align: 'center' });
        // energy bars
        const top = Math.max(egA, emA, 1) * 1.25, bh = 250, by = 330;
        const bar = (bx, v, col, name) => { const hgt = bh * v / top; c.fillStyle = col; c.fillRect(bx, by - hgt, 44, hgt); kit.label(c, name, bx + 22, by + 14, { size: 11, color: C.text, align: 'center' }); };
        kit.label(c, 'average energy', 668, 40, { size: 12, color: C.muted, align: 'center' });
        bar(612, egA, 'hsl(45 70% 55%)', 'grain'); bar(676, emA, C.accent, 'molecule');
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(605, by); c.lineTo(730, by); c.stroke();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-brownian */
  const etaWater = T => 2.414e-5 * Math.pow(10, 247.8 / (T - 140));   // Pa·s for water, T in K (Vogel fit, good over 0–100 °C)
  Hyper.sim('heat-brownian', {
    title: 'Brownian motion under the microscope',
    blurb: `Plastic beads (density 1050 kg/m³) in water, seen through a microscope and moving **in real time**. Each bead takes random steps whose size follows from Einstein's diffusion coefficient $D = k_BT/6\\pi\\eta a$; the viscosity of water falls steeply as it warms. The graph shows the measured mean-square distance from the starting points, averaged over the beads, against the prediction $\\langle r^2\\rangle = 4Dt$ (in the plane of the microscope; $6Dt$ in space): a straight line, not a parabola — the mark of a [[?random-walk]].

**Try this**
- Watch for a minute: the points scatter about the straight line and hug it more closely with more beads.
- Make the beads ten times smaller: they dance visibly faster, D is ten times larger.
- Heat the water from 20 °C to 80 °C: T rises by only 20 %, but the viscosity drops almost threefold, so D more than triples.
- Tick *Perrin's way*: marking the position every 2 seconds and joining the dots gives the famous zigzag drawings of 1909 — and each straight segment hides another zigzag just as tangled.
- Read the thermal speed (millimetres per second) and the time over which a bead keeps it (tens of nanoseconds): invisible, which is why the path looks like a walk, not flights.`,
    mount(box, kit) {
      const R = rng(1905);
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Bead radius', min: 0.1, max: 3, value: 0.5, log: true, sig: 2, unit: 'µm' },
        { id: 'tc', label: 'Water temperature', min: 0, max: 95, step: 1, value: 20, unit: '°C' },
        { id: 'n', label: 'Number of beads', min: 5, max: 60, step: 1, value: 25 },
        { id: 'speed', type: 'select', label: 'Clock', options: [['real time', 1], ['5 × faster', 5], ['20 × faster', 20]], value: 1 },
        { id: 'perrin', type: 'check', label: 'Perrin\'s way: mark every 2 s and join the marks', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }] }
      ], id => { if (id !== 'perrin' && id !== 'speed') build(); else if (id === 'perrin') { for (const b of beads) b.trail = [[b.x, b.y]]; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eta', 'Viscosity of the water η'], ['D', 'D = k_BT/6πηa'], ['r1', 'rms distance in 1 s (in the plane)'], ['Dm', 'Measured ⟨r²⟩ ÷ 4t'], ['tau', 'Velocity forgotten after τ = m/6πηa'], ['vth', 'Thermal speed √(3k_BT/m)'], ['t', 'Time watched']]);
      const plot = kit.plot(gb, { x: { label: 'time t (s)', min: 0 }, y: { label: '⟨r²⟩ (µm²)', min: 0 }, legend: true }, 160);
      const FW = 100, FH = 55, K = 6.8, FX = 40, FY = 6;       // field of view in µm, pixels per µm
      let beads = [], D = 0, t = 0, msd = [], sampT = 0, plotT = 0, markT = 0;
      const physics = () => { const T = V.tc + 273.15, eta = etaWater(T), a = V.a * 1e-6, m = 1050 * 4 / 3 * Math.PI * a * a * a; return { T, eta, a, m, D: kB * T / (6 * Math.PI * eta * a) * 1e12 }; };
      function build() {
        beads = []; t = 0; msd = []; sampT = 0; markT = 0;
        for (let i = 0; i < (V.n | 0); i++) { const x = R() * FW, y = R() * FH; beads.push({ x, y, xu: x, yu: y, x0: x, y0: y, trail: [[x, y]] }); }
        D = physics().D;
      }
      build();
      const loop = kit.loop(dt => {
        const P = physics(); D = P.D;
        const ds = dt * V.speed, s = Math.sqrt(2 * D * ds);
        for (const b of beads) {
          const dx = s * gauss(R), dy = s * gauss(R);
          b.xu += dx; b.yu += dy; b.x += dx; b.y += dy;
          let wrapped = false;
          if (b.x < 0) { b.x += FW; wrapped = true; } else if (b.x > FW) { b.x -= FW; wrapped = true; }
          if (b.y < 0) { b.y += FH; wrapped = true; } else if (b.y > FH) { b.y -= FH; wrapped = true; }
          if (wrapped) b.trail.push(null);
          if (!V.perrin) { b.trail.push([b.x, b.y]); if (b.trail.length > 900) b.trail.shift(); }
        }
        t += ds; markT += ds;
        if (V.perrin && markT >= 2) { markT = 0; for (const b of beads) { b.trail.push([b.x, b.y]); if (b.trail.length > 200) b.trail.shift(); } }
        sampT += ds;
        if (sampT >= Math.max(0.25, t / 60)) { sampT = 0; let s2 = 0; for (const b of beads) s2 += (b.xu - b.x0) ** 2 + (b.yu - b.y0) ** 2; msd.push([t, s2 / beads.length]); if (msd.length > 400) msd.splice(0, 1); }
        const last = msd.length ? msd[msd.length - 1] : null;
        ro.set('eta', (P.eta * 1000).toFixed(3) + ' mPa·s');
        ro.set('D', D.toPrecision(3) + ' µm²/s');
        ro.set('r1', Math.sqrt(4 * D).toFixed(2) + ' µm');
        ro.set('Dm', last && last[0] > 0 ? (last[1] / (4 * last[0])).toPrecision(3) + ' µm²/s' : '—');
        ro.set('tau', (P.m / (6 * Math.PI * P.eta * P.a) * 1e9).toPrecision(2) + ' ns');
        ro.set('vth', (Math.sqrt(3 * kB * P.T / P.m) * 1000).toPrecision(2) + ' mm/s');
        ro.set('t', t.toFixed(1) + ' s');
        plotT += dt;
        if (plotT > 0.5) { plotT = 0; const tm = Math.max(1, t); plot.set({ x: { label: 'time t (s)', min: 0, max: tm }, series: [{ pts: msd, label: 'measured ⟨r²⟩', line: false, dots: 2.5 }, { pts: [[0, 0], [tm, 4 * D * tm]], label: '4Dt', dash: [6, 4], width: 2 }] }); }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 390, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        c.fillStyle = C.dark ? 'hsl(45 12% 16%)' : 'hsl(45 35% 92%)'; c.fillRect(FX, FY, FW * K, FH * K);
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(FX, FY, FW * K, FH * K);
        const px = b => FX + b[0] * K, py = b => FY + b[1] * K;
        for (const b of beads) {
          c.strokeStyle = C.hue(200, 0.55); c.lineWidth = V.perrin ? 1.4 : 1; c.beginPath(); let pen = false;
          for (const q of b.trail) { if (!q) { pen = false; continue; } if (!pen) { c.moveTo(px(q), py(q)); pen = true; } else c.lineTo(px(q), py(q)); }
          c.stroke();
          if (V.perrin) { c.fillStyle = C.hue(200, 0.9); for (const q of b.trail) if (q) c.fillRect(px(q) - 1.5, py(q) - 1.5, 3, 3); }
        }
        const rr = Math.max(2.2, V.a * K);
        for (const b of beads) { c.fillStyle = C.dark ? 'hsl(40 25% 75%)' : 'hsl(30 20% 35%)'; c.beginPath(); c.arc(FX + b.x * K, FY + b.y * K, rr, 0, 6.283); c.fill(); c.strokeStyle = C.dark ? 'hsl(40 30% 90% / .5)' : 'hsl(30 20% 20% / .5)'; c.lineWidth = 1; c.beginPath(); c.arc(FX + b.x * K, FY + b.y * K, rr + 1.5, 0, 6.283); c.stroke(); }
        // scale bar
        c.fillStyle = C.text; c.fillRect(FX + 14, FY + FH * K - 16, 10 * K, 4);
        kit.label(c, '10 µm', FX + 14 + 5 * K, FY + FH * K - 26, { size: 11, color: C.text, align: 'center' });
        kit.label(c, (V.tc).toFixed(0) + ' °C water, beads of radius ' + V.a.toFixed(2) + ' µm', FX + FW * K - 8, FY + 14, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-ink */
  const INKS = [['Dye in water (D = 4 × 10⁻¹⁰ m²/s)', 4e-10], ['Salt in water (1.5 × 10⁻⁹ m²/s)', 1.5e-9], ['Sugar in water (5 × 10⁻¹⁰ m²/s)', 5e-10], ['A protein in water (6 × 10⁻¹¹ m²/s)', 6e-11], ['Dye in glycerol (3 × 10⁻¹³ m²/s)', 3e-13]];
  Hyper.sim('heat-ink', {
    title: 'A drop of ink spreading',
    blurb: `A drop of dye in a thin cell of still water, seen from above, 8 mm across. Every dye molecule makes its own [[?random-walk]] — the real molecules take about a trillion tiny steps a second; here each frame lumps them into one step of the right size, $\\sqrt{2D\\,\\Delta t}$ in each direction. Nothing pushes the dye outwards, yet the cloud spreads. The graph compares the counted profile across the cell with the solution of the diffusion equation, a [[?gaussian]] whose width grows as $\\sqrt{\\sigma_0^2 + 2Dt}$ (with mirror images once the dye reaches the walls).

**Try this**
- Read the clock: spreading about a millimetre takes the dye some 20 minutes; two millimetres take four times as long.
- Follow one molecule: its path is a tangle, but the tangles of thousands of molecules add up to a smooth, predictable bell.
- Compare substances: salt ions are quick, proteins slow, and dye in glycerol would need weeks — push the clock speed-up to a million.
- Watch the measured D (from the growth of the spread) settle on the value you chose.
- Let it run until the dye fills the cell: the profile flattens and stays flat. No film of it ever runs backwards.`,
    mount(box, kit) {
      const R = rng(1855);
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 260 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'D', type: 'select', label: 'What diffuses', options: INKS, value: 4e-10 },
        { id: 'speed', label: 'Clock runs faster by', min: 1, max: 1e6, value: 300, log: true, sig: 2 },
        { id: 'n', label: 'Molecules drawn', min: 500, max: 5000, step: 250, value: 2500 },
        { id: 'follow', type: 'check', label: 'Follow one molecule', value: true },
        { id: 'ring', type: 'check', label: 'Show the rms circle', value: true },
        { type: 'buttons', items: [{ id: 'drop', label: 'New drop', primary: true }] }
      ], id => { if (id === 'drop' || id === 'n' || id === 'D') build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time since the drop'], ['sm', 'Spread along the cell (rms), counted'], ['st', 'Predicted √(σ₀² + 2Dt)'], ['Dm', 'D from the spread, (σ² − σ₀²)/2t'], ['walk', 'Followed molecule: distance from start']]);
      const plot = kit.plot(gb, { x: { label: 'position across the cell (mm)', min: -4, max: 4 }, y: { label: 'share of the dye per mm', min: 0 }, legend: true }, 160);
      const A = 4, B = 2.25, S0 = 0.12, NB = 64, K = 84, CX = 40 + A * K, CY = 10 + B * K;   // cell half-sizes (mm), drop size, pixels per mm
      let n = 0, x, y, t = 0, path = [], plotT = 0;
      function build() {
        n = V.n | 0; x = new Float64Array(n); y = new Float64Array(n); t = 0; path = [];
        for (let i = 0; i < n; i++) { x[i] = S0 * gauss(R); y[i] = S0 * gauss(R); }
        path.push([x[0], y[0]]);
      }
      const refl = (v, L) => { for (let k = 0; k < 6 && (v < -L || v > L); k++) v = v < -L ? -2 * L - v : 2 * L - v; return clamp(v, -L, L); };
      build();
      const loop = kit.loop(dt => {
        const ds = dt * V.speed, s = Math.sqrt(2 * V.D * ds) * 1000;      // mm per step, each direction
        for (let i = 0; i < n; i++) { x[i] = refl(x[i] + s * gauss(R), A); y[i] = refl(y[i] + s * gauss(R), B); }
        t += ds; path.push([x[0], y[0]]); if (path.length > 4000) path.shift();
        let sx = 0, sxx = 0; for (let i = 0; i < n; i++) { sx += x[i]; sxx += x[i] * x[i]; }
        const sm = Math.sqrt(Math.max(0, sxx / n - (sx / n) ** 2)), sth = Math.sqrt(S0 * S0 + 2 * V.D * t * 1e6);
        ro.set('t', fmtTime(t)); ro.set('sm', sm.toFixed(3) + ' mm'); ro.set('st', sth.toFixed(3) + ' mm' + (sth > 1.2 ? ' (walls matter)' : ''));
        ro.set('Dm', t > 0 && sth < 1.2 ? ((sm * sm - S0 * S0) / (2 * t) * 1e-6).toExponential(2) + ' m²/s' : '—');
        ro.set('walk', Math.hypot(x[0] - path[0][0], y[0] - path[0][1]).toFixed(3) + ' mm');
        plotT += dt;
        if (plotT > 0.25) {
          plotT = 0;
          const cnt = new Float64Array(NB), bw = 2 * A / NB; for (let i = 0; i < n; i++) cnt[clamp(Math.floor((x[i] + A) / bw), 0, NB - 1)]++;
          const meas = Array.from(cnt, (v, k) => [-A + (k + 0.5) * bw, v / (n * bw)]), th = [];
          // the Gaussian plus its mirror images in the two walls (at 2Ak), so that no dye crosses them
          for (let j = 0; j <= 200; j++) { const xx = -A + 2 * A * j / 200; let g = 0; for (let k = -3; k <= 3; k++) g += Math.exp(-((xx - 2 * A * k) ** 2) / (2 * sth * sth)); th.push([xx, g / (sth * Math.sqrt(2 * Math.PI))]); }
          plot.set({ series: [{ pts: meas, label: 'counted', line: false, dots: 2.6 }, { pts: th, label: 'diffusion equation (Gaussian)', width: 2 }] });
        }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 400, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        c.fillStyle = C.dark ? 'hsl(200 35% 14%)' : 'hsl(195 60% 95%)'; c.fillRect(CX - A * K, CY - B * K, 2 * A * K, 2 * B * K);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(CX - A * K, CY - B * K, 2 * A * K, 2 * B * K);
        c.fillStyle = C.dark ? 'hsl(265 80% 72% / 0.45)' : 'hsl(250 70% 35% / 0.35)';
        for (let i = 0; i < n; i++) c.fillRect(CX + x[i] * K - 1.2, CY + y[i] * K - 1.2, 2.4, 2.4);
        if (V.ring) { const r = Math.SQRT2 * sth * K; c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.lineWidth = 1.5; c.beginPath(); c.arc(CX, CY, r, 0, 6.283); c.stroke(); c.setLineDash([]); kit.label(c, 'rms distance √(2σ²)', CX + r * 0.72, CY - r * 0.72 - 8, { size: 11, color: C.warn }); }
        if (V.follow && path.length > 1) {
          c.strokeStyle = C.hue(28, 0.9); c.lineWidth = 1.3; c.beginPath(); c.moveTo(CX + path[0][0] * K, CY + path[0][1] * K);
          for (let i = 1; i < path.length; i++) c.lineTo(CX + path[i][0] * K, CY + path[i][1] * K);
          c.stroke(); kit.dot(c, CX + x[0] * K, CY + y[0] * K, 4, C.hue(28, 1), C.text);
        }
        c.fillStyle = C.text; c.fillRect(CX - A * K + 12, CY + B * K - 14, K, 4);
        kit.label(c, '1 mm', CX - A * K + 12 + K / 2, CY + B * K - 24, { size: 11, color: C.text, align: 'center' });
        kit.label(c, fmtTime(t), CX + A * K - 10, CY - B * K + 16, { size: 13, color: C.text, align: 'right', weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-carnot */
  Hyper.sim('heat-carnot', {
    title: 'Carnot\'s engine',
    blurb: `One mole of ideal gas in a cylinder runs Carnot's reversible cycle. It sits on the **hot** block while it expands at $T_1$ (heat $Q_1$ flows in), on the **insulating** stand while it expands further and cools to $T_2$, on the **cold** block while it is squeezed at $T_2$ (heat $Q_2$ flows out), and on the stand again while it is squeezed back up to $T_1$. On the pressure–volume diagram the enclosed area is the net work, $W = \\oint p\\,dV$ (an [[?integral]] round the loop).

**Try this**
- Compare the measured efficiency W/Q₁ with 1 − T₂/T₁: they agree for every setting — the size of the stroke, the gas, anything.
- Check that Q₁/T₁ = Q₂/T₂: the entropy taken from the hot block is exactly what the cold block receives.
- Make the expansion longer: more work per cycle, the same efficiency.
- Bring T₂ close to T₁: the loop becomes a thin sliver and hardly any work comes out.
- Switch to *refrigerator*: the same cycle run backwards takes heat from the cold block and, with work put in, delivers it to the hot one.`,
    mount(box, kit) {
      const R = rng(1824);
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'T1', label: 'Hot block T₁', min: 300, max: 1000, step: 10, value: 500, unit: 'K' },
        { id: 'T2', label: 'Cold block T₂', min: 150, max: 700, step: 10, value: 300, unit: 'K' },
        { id: 'r', label: 'Expansion on the hot block, V₂/V₁', min: 1.2, max: 4, step: 0.1, value: 2 },
        { id: 'gas', type: 'select', label: 'Gas', options: [['atoms, like argon (γ = 5/3)', 5 / 3], ['diatomic, like air (γ = 7/5)', 1.4]], value: 5 / 3 },
        { id: 'dir', type: 'select', label: 'Run it as', options: [['an engine', 1], ['a refrigerator (backwards)', -1]], value: 1 },
        { id: 'dur', label: 'Seconds per cycle', min: 4, max: 24, step: 1, value: 12 }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['Q1', 'Heat at the hot block Q₁'], ['Q2', 'Heat at the cold block Q₂'], ['W', 'Net work ∮p dV (the area)'], ['eta', 'Efficiency W/Q₁'], ['car', 'Carnot 1 − T₂/T₁'], ['s1', 'Q₁/T₁'], ['s2', 'Q₂/T₂']]);
      const n = 1, RG = 8.314462618, V1 = 10;       // mol, J/(mol·K), litres
      let s = 0, tt = 0;
      const dots = Array.from({ length: 36 }, () => ({ x: R(), y: R(), a: R() * 6.283 }));
      // the cycle for the current settings; Q₁, Q₂ and W are measured by adding up p dV along the four strokes
      let key = '', cache = null;
      function cyc() {
        const k0 = [V.T1, V.T2, V.r, V.gas].join();
        if (k0 === key) return cache;
        const T1 = V.T1, T2 = Math.min(V.T2, V.T1 - 20), g = V.gas, k = Math.pow(T1 / T2, 1 / (g - 1)), V2 = V1 * V.r, V3 = V2 * k, V4 = V1 * k;
        const C = { T1, T2, g, V2, V3, V4 }, work = [0, 0, 0, 0];
        for (let b = 0; b < 4; b++) { let prev = state(C, b); for (let j = 1; j <= 400; j++) { const q = state(C, b + j / 400.0001), pa = n * RG * prev.T / prev.v, pb = n * RG * q.T / q.v; work[b] += 0.5 * (pa + pb) * (q.v - prev.v); prev = q; } }
        // on an isotherm the internal energy of an ideal gas is unchanged, so the heat equals the work; the adiabats exchange no heat
        C.Q1 = work[0]; C.Q2 = -work[2]; C.W = work[0] + work[1] + work[2] + work[3];
        key = k0; cache = C; return C;
      }
      // the state at cycle position q in [0, 4): stroke b, fraction u
      function state(C, q) {
        const b = Math.floor(q) % 4, u = q - Math.floor(q), lerp = (a, z) => a * Math.pow(z / a, u);
        if (b === 0) { const v = lerp(V1, C.V2); return { b, v, T: C.T1 }; }
        if (b === 1) { const v = lerp(C.V2, C.V3); return { b, v, T: C.T1 * Math.pow(C.V2 / v, C.g - 1) }; }
        if (b === 2) { const v = lerp(C.V3, C.V4); return { b, v, T: C.T2 }; }
        const v = lerp(C.V4, V1); return { b, v, T: C.T2 * Math.pow(C.V4 / v, C.g - 1) };
      }
      const loop = kit.loop(dt => {
        const C = cyc(), dir = V.dir;
        s = (s + dir * 4 * dt / V.dur + 8) % 4; tt += dt;
        const S = state(C, s), p = n * RG * S.T / (S.v * 1e-3);        // Pa
        const W = C.W;
        ro.set('Q1', (dir > 0 ? 'in: ' : 'out: ') + C.Q1.toFixed(0) + ' J'); ro.set('Q2', (dir > 0 ? 'out: ' : 'in: ') + C.Q2.toFixed(0) + ' J');
        ro.set('W', (dir > 0 ? 'done by the gas: ' : 'put in: ') + W.toFixed(0) + ' J');
        ro.set('eta', dir > 0 ? (100 * W / C.Q1).toFixed(1) + ' %' : 'as a refrigerator Q₂/W = ' + (C.Q2 / W).toFixed(2));
        ro.set('car', (100 * (1 - C.T2 / C.T1)).toFixed(1) + ' %' + (dir < 0 ? '; ideal T₂/(T₁ − T₂) = ' + (C.T2 / (C.T1 - C.T2)).toFixed(2) : ''));
        ro.set('s1', (C.Q1 / C.T1).toFixed(3) + ' J/K'); ro.set('s2', (C.Q2 / C.T2).toFixed(3) + ' J/K');
        // ---- drawing
        const c = st.begin(), Cl = kit.colors(), W0 = 760, H0 = 380, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        // reservoirs
        const blocks = [{ x: 20, col: 'hsl(8 80% 55%)', name: 'hot, T₁ = ' + C.T1 + ' K' }, { x: 125, col: Cl.faint, name: 'insulation' }, { x: 230, col: 'hsl(210 80% 55%)', name: 'cold, T₂ = ' + C.T2 + ' K' }];
        for (const bl of blocks) { c.fillStyle = bl.col; c.fillRect(bl.x, 310, 95, 40); kit.label(c, bl.name, bl.x + 47, 362, { size: 11, color: Cl.text, align: 'center' }); }
        // where the cylinder stands: hot, stand, cold, stand; it slides during the first 12 % of a stroke
        const at = [0, 1, 2, 1], b = S.b, u = s - Math.floor(s), prev = dir > 0 ? at[(b + 3) % 4] : at[(b + 1) % 4], slide = dir > 0 ? clamp(u / 0.12, 0, 1) : clamp((1 - u) / 0.12, 0, 1);
        const cxp = 20 + 105 * (prev + (at[b] - prev) * slide) + 47, onBlock = slide >= 1;
        const hmax = 240, hp = 16 + (hmax - 16) * S.v / C.V3, cyl = { x0: cxp - 38, x1: cxp + 38, y1: 308, y0: 308 - hp };
        c.strokeStyle = Cl.text; c.lineWidth = 3; c.beginPath(); c.moveTo(cyl.x0, 308 - hmax - 14); c.lineTo(cyl.x0, 308); c.lineTo(cyl.x1, 308); c.lineTo(cyl.x1, 308 - hmax - 14); c.stroke();
        const hue = 220 - 210 * clamp((S.T - 150) / 850, 0, 1);
        c.fillStyle = 'hsl(' + hue + ' 70% 55% / 0.18)'; c.fillRect(cyl.x0 + 2, cyl.y0, 72, hp - 2);
        const spd = 0.25 * Math.sqrt(S.T / 300);
        c.fillStyle = 'hsl(' + hue + ' 80% 55%)';
        for (const d of dots) { d.a += (R() - 0.5) * 0.6; d.x += spd * Math.cos(d.a) * dt * 3; d.y += spd * Math.sin(d.a) * dt * 3; if (d.x < 0 || d.x > 1) { d.x = clamp(d.x, 0, 1); d.a = Math.PI - d.a; } if (d.y < 0 || d.y > 1) { d.y = clamp(d.y, 0, 1); d.a = -d.a; } c.beginPath(); c.arc(cyl.x0 + 6 + d.x * 64, cyl.y0 + 5 + d.y * Math.max(2, hp - 12), 2.4, 0, 6.283); c.fill(); }
        // the piston and its load
        c.fillStyle = Cl.muted; c.fillRect(cyl.x0 + 2, cyl.y0 - 10, 72, 10); c.fillRect(cxp - 4, cyl.y0 - 40, 8, 30);
        const expanding = (b === 0 || b === 1) === (dir > 0);
        kit.arrow(c, cxp + 50, cyl.y0 - 10, cxp + 50, cyl.y0 - 10 + (expanding ? -30 : 30), expanding ? Cl.ok : Cl.bad, 2.5);
        kit.label(c, expanding ? 'work out' : 'work in', cxp + 58, cyl.y0 - 26, { size: 11, color: expanding ? Cl.ok : Cl.bad });
        // heat flowing through the base, on the isotherms
        if (onBlock && (b === 0 || b === 2)) {
          const into = (b === 0) === (dir > 0), col = b === 0 ? 'hsl(8 85% 55%)' : 'hsl(210 85% 55%)';
          for (let k = 0; k < 3; k++) {
            const ph = (tt * 0.8 + k / 3) % 1, y0 = into ? 336 - 34 * ph : 290 + 34 * ph;
            kit.arrow(c, cxp - 20 + 20 * k, y0, cxp - 20 + 20 * k, y0 + (into ? -14 : 14), col, 2.4);
          }
          kit.label(c, (b === 0 ? 'Q₁ ' : 'Q₂ ') + (into ? 'in' : 'out'), cxp + 46, 296, { size: 12, color: col, weight: 600 });
        }
        kit.label(c, 'T = ' + S.T.toFixed(0) + ' K, V = ' + S.v.toFixed(1) + ' L', cxp, 20, { size: 12, color: Cl.text, align: 'center' });
        // P–V diagram
        const PX0 = 400, PX1 = 740, PY0 = 330, PY1 = 30, vmax = C.V3 * 1.06, pmax = n * RG * C.T1 / (V1 * 1e-3) * 1.1 / 1000;
        const tx = v => PX0 + (PX1 - PX0) * v / vmax, ty = pk => PY0 - (PY0 - PY1) * pk / pmax;
        c.strokeStyle = Cl.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(PX0, PY1); c.lineTo(PX0, PY0); c.lineTo(PX1, PY0); c.stroke();
        kit.label(c, 'p (kPa)', PX0 - 6, PY1 - 12, { size: 11, color: Cl.muted, align: 'right' });
        kit.label(c, 'volume (L)', PX1, PY0 + 14, { size: 11, color: Cl.muted, align: 'right' });
        const vst = Hyper.niceStep ? Hyper.niceStep(vmax, 5) : 10, pst = Hyper.niceStep ? Hyper.niceStep(pmax, 5) : 100;
        for (let v = vst; v < vmax; v += vst) kit.label(c, v.toFixed(0), tx(v), PY0 + 12, { size: 10, color: Cl.muted, align: 'center' });
        for (let pk = pst; pk < pmax; pk += pst) kit.label(c, pk.toFixed(0), PX0 - 5, ty(pk), { size: 10, color: Cl.muted, align: 'right' });
        const pts = [];
        for (let k = 0; k < 4; k++) for (let j = 0; j <= 40; j++) { const q = state(C, k + j / 40.0001); pts.push([tx(q.v), ty(n * RG * q.T / (q.v * 1e-3) / 1000), k]); }
        c.fillStyle = Cl.hue(140, 0.18); c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill();
        const bcol = ['hsl(8 80% 55%)', Cl.muted, 'hsl(210 80% 55%)', Cl.muted];
        for (let k = 0; k < 4; k++) { c.strokeStyle = bcol[k]; c.lineWidth = k === b ? 3.2 : 2; c.beginPath(); let first = true; for (const q of pts) if (q[2] === k) { if (first) { c.moveTo(q[0], q[1]); first = false; } else c.lineTo(q[0], q[1]); } c.stroke(); }
        const corner = [[V1, C.T1], [C.V2, C.T1], [C.V3, C.T2], [C.V4, C.T2]];
        corner.forEach((q, i) => kit.label(c, String(i + 1), tx(q[0]) + (i === 0 ? -10 : 8), ty(n * RG * q[1] / (q[0] * 1e-3) / 1000) - 8, { size: 12, color: Cl.text, weight: 700 }));
        kit.dot(c, tx(S.v), ty(p / 1000), 6, Cl.accent, Cl.text);
        const names = dir > 0 ? ['1 → 2: isothermal expansion at T₁', '2 → 3: adiabatic expansion, cooling', '3 → 4: isothermal compression at T₂', '4 → 1: adiabatic compression, warming']
          : ['2 → 1: isothermal compression at T₁', '3 → 2: adiabatic compression, warming', '4 → 3: isothermal expansion at T₂', '1 → 4: adiabatic expansion, cooling'];
        kit.label(c, names[b], (PX0 + PX1) / 2, PY1 - 12, { size: 12, color: Cl.text, align: 'center', weight: 600 });
        kit.label(c, 'shaded area = W = ' + W.toFixed(0) + ' J', tx(C.V2) + 6, ty(n * RG * C.T2 / (C.V4 * 1e-3) / 1000) + 30, { size: 11, color: Cl.text });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-mixing */
  Hyper.sim('heat-mixing', {
    title: 'Mixing and the number of ways',
    blurb: `Dark molecules start on the left, light ones on the right, kept apart by a partition. Remove it and let them fly. The state is summed up by two numbers: how many dark ones and how many light ones are in the left half. The number of arrangements with those counts is $W = \\binom{n}{k_{\\rm dark}}\\binom{n}{k_{\\rm light}}$, and the entropy is $S = k_B\\ln W$ (a [[?logarithm]], so that the ways multiply while entropies add). The bars show the chance of each possible count of dark molecules on the left, $\\binom{n}{k}/2^n$ — see where the current state sits.

**Try this**
- Remove the partition: the count of dark molecules on the left falls to about half and then only jitters. The entropy climbs and levels off near its greatest value.
- Put the partition back: nothing unmixes. The entropy stays where it is.
- Choose 4 molecules of each colour, remove the partition and wait: about once a minute the gas "unmixes" by itself for a moment — with so few molecules the unmixed state is one arrangement in 256.
- Choose 100 of each: the unmixed state is one arrangement in $2^{200} \\approx 10^{60}$. It will not come back.`,
    mount(box, kit) {
      const R = rng(1877);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = graphBox(box);
      let wall = true;
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Molecules of each colour', options: [['4', 4], ['10', 10], ['25', 25], ['50', 50], ['100', 100]], value: 50 },
        { id: 'v', label: 'Speed', min: 40, max: 300, step: 10, value: 140, unit: 'px/s' },
        { type: 'buttons', items: [{ id: 'wall', label: 'Remove / put back the partition', primary: true }, { id: 'restart', label: 'Start again' }] }
      ], id => { if (id === 'wall') { wall = !wall; if (!wall) { tOpen = t; seen = 0; } } else if (id === 'restart' || id === 'n') build(); else if (id === 'v') speed(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['kd', 'Dark molecules on the left'], ['kl', 'Light molecules on the left'], ['W', 'Number of ways W'], ['S', 'Entropy S/k_B = ln W'], ['Smax', 'Largest possible ln W'], ['un', 'Times found unmixed since opening'], ['p', 'Chance per look of full unmixing']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'S / k_B = ln W', min: 0 }, legend: true }, 150);
      const X0 = 20, X1 = 440, Y0 = 30, Y1 = 330, MID = (X0 + X1) / 2, RM = 3.2;
      let n = 0, x, y, vx, vy, t = 0, tOpen = 0, seen = 0, wasUnmixed = true, hist = [], histT = 0, plotT = 0;
      function build() {
        n = V.n; x = new Float64Array(2 * n); y = new Float64Array(2 * n); vx = new Float64Array(2 * n); vy = new Float64Array(2 * n);
        for (let i = 0; i < 2 * n; i++) { const left = i < n; x[i] = left ? X0 + RM + R() * (MID - X0 - 2 * RM - 2) : MID + 2 + RM + R() * (X1 - MID - 2 * RM - 2); y[i] = Y0 + RM + R() * (Y1 - Y0 - 2 * RM); const a = R() * 6.283; vx[i] = Math.cos(a); vy[i] = Math.sin(a); }
        speed(); wall = true; t = 0; tOpen = 0; seen = 0; wasUnmixed = true; hist = []; histT = 0;
      }
      function speed() { for (let i = 0; i < 2 * n; i++) { const s = Math.hypot(vx[i], vy[i]) || 1, v = V.v * (0.6 + 0.8 * ((i * 7919) % 97) / 97); vx[i] *= v / s; vy[i] *= v / s; } }
      build();
      const loop = kit.loop(dt => {
        const sub = 3, h = dt / sub;
        for (let k = 0; k < sub; k++) for (let i = 0; i < 2 * n; i++) {
          const ox = x[i]; x[i] += vx[i] * h; y[i] += vy[i] * h;
          if (x[i] < X0 + RM) { x[i] = 2 * (X0 + RM) - x[i]; vx[i] = -vx[i]; } else if (x[i] > X1 - RM) { x[i] = 2 * (X1 - RM) - x[i]; vx[i] = -vx[i]; }
          if (y[i] < Y0 + RM) { y[i] = 2 * (Y0 + RM) - y[i]; vy[i] = -vy[i]; } else if (y[i] > Y1 - RM) { y[i] = 2 * (Y1 - RM) - y[i]; vy[i] = -vy[i]; }
          if (wall) { const L = MID - 2 - RM, Rr = MID + 2 + RM; if (ox <= MID && x[i] > L) { x[i] = 2 * L - x[i]; vx[i] = -Math.abs(vx[i]); } else if (ox >= MID && x[i] < Rr) { x[i] = 2 * Rr - x[i]; vx[i] = Math.abs(vx[i]); } }
          // a gentle random turn now and then stands in for collisions, so paths do not repeat
          if (R() < h * 0.5) { const a = (R() - 0.5) * 1.2, cs = Math.cos(a), sn = Math.sin(a), ux = vx[i]; vx[i] = ux * cs - vy[i] * sn; vy[i] = ux * sn + vy[i] * cs; }
        }
        t += dt;
        let kd = 0, kl = 0; for (let i = 0; i < 2 * n; i++) if (x[i] < MID) { if (i < n) kd++; else kl++; }
        const lnW = lnC(n, kd) + lnC(n, kl), lnMax = 2 * lnC(n, Math.floor(n / 2)), unmixed = kd === n && kl === 0;
        if (!wall && unmixed && !wasUnmixed) seen++;
        wasUnmixed = unmixed;
        ro.set('kd', kd + ' of ' + n); ro.set('kl', kl + ' of ' + n);
        ro.set('W', lnW < 30 ? Math.round(Math.exp(lnW)).toLocaleString('en-GB') : Math.exp(lnW - Math.floor(lnW / Math.LN10) * Math.LN10).toFixed(2) + ' × 10^' + Math.floor(lnW / Math.LN10));
        ro.set('S', lnW.toFixed(2)); ro.set('Smax', lnMax.toFixed(2) + ' (2n ln 2 = ' + (2 * n * Math.LN2).toFixed(1) + ' counts every arrangement)');
        ro.set('un', wall ? '— (partition in)' : String(seen) + ' in ' + (t - tOpen).toFixed(0) + ' s');
        ro.set('p', '1 in 2^' + (2 * n) + (2 * n <= 40 ? ' = ' + Math.pow(2, 2 * n).toLocaleString('en-GB') : ' ≈ 10^' + (2 * n * Math.log10(2)).toFixed(0)));
        histT += dt; if (histT > 0.1) { histT = 0; hist.push([t, lnW]); if (hist.length > 900) hist.shift(); }
        plotT += dt; if (plotT > 0.3) { plotT = 0; plot.set({ series: [{ pts: hist, label: 'ln W now', width: 2 }], hlines: [{ y: lnMax, label: 'largest ln W' }] }); }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 370, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        c.fillStyle = C.hue(210, 0.05); c.fillRect(X0, Y0, MID - X0, Y1 - Y0);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(X0, Y0, X1 - X0, Y1 - Y0);
        if (wall) { c.fillStyle = C.muted; c.fillRect(MID - 2, Y0, 4, Y1 - Y0); } else { c.strokeStyle = C.faint; c.setLineDash([4, 5]); c.lineWidth = 1; c.beginPath(); c.moveTo(MID, Y0); c.lineTo(MID, Y1); c.stroke(); c.setLineDash([]); }
        const dark = C.dark ? 'hsl(265 70% 60%)' : 'hsl(250 60% 30%)', light = C.dark ? 'hsl(45 90% 80%)' : 'hsl(40 95% 60%)';
        for (let i = 0; i < 2 * n; i++) { c.fillStyle = i < n ? dark : light; c.beginPath(); c.arc(x[i], y[i], RM, 0, 6.283); c.fill(); if (i >= n) { c.strokeStyle = C.muted; c.lineWidth = 0.8; c.stroke(); } }
        kit.label(c, 'left half', (X0 + MID) / 2, Y0 - 12, { size: 12, color: C.muted, align: 'center' }); kit.label(c, 'right half', (MID + X1) / 2, Y0 - 12, { size: 12, color: C.muted, align: 'center' });
        // the binomial bars for the dark molecules
        const BX0 = 470, BX1 = 745, BY = 320, BH = 240, bw = (BX1 - BX0) / (n + 1), pk = k => Math.exp(lnC(n, k) - n * Math.LN2), top = pk(Math.floor(n / 2));
        for (let k = 0; k <= n; k++) { const hgt = BH * pk(k) / top; c.fillStyle = k === kd ? C.accent : C.hue(210, 0.35); c.fillRect(BX0 + k * bw + 0.5, BY - Math.max(hgt, k === kd ? 2 : 0), Math.max(1, bw - 1), Math.max(hgt, k === kd ? 2 : 0)); }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(BX0, BY); c.lineTo(BX1, BY); c.stroke();
        kit.label(c, 'chance of k dark molecules on the left', (BX0 + BX1) / 2, Y0 - 12, { size: 12, color: C.muted, align: 'center' });
        kit.label(c, '0', BX0 + bw / 2, BY + 12, { size: 10, color: C.muted, align: 'center' }); kit.label(c, String(n), BX1 - bw / 2, BY + 12, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'k = ' + kd + ' now', BX0 + (kd + 0.5) * bw, BY - BH * pk(kd) / top - 12, { size: 11, color: C.accent, align: 'center', weight: 600 });
        kit.label(c, 'all on the left: 1 way', BX1, BY + 28, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-ratchet */
  Hyper.sim('heat-ratchet', {
    title: 'Feynman\'s ratchet and pawl',
    blurb: `Two boxes of gas joined by one axle. In box 1, at $T_1$, the axle carries vanes that the molecules kick at random. In box 2, at $T_2$, it carries a ratchet wheel held by a spring-loaded pawl; between the boxes a thread on the axle can lift a small weight. A **forward** step needs the vanes to collect $\\varepsilon + W$ in one lucky fluctuation (ε lifts the pawl over a tooth, $W = L\\theta$ lifts the weight); a **backward** step happens when the pawl's own thermal jiggling lifts it by ε and the wheel slips back. The steps happen at Feynman's rates, $f_0e^{-(\\varepsilon+W)/k_BT_1}$ and $f_0e^{-\\varepsilon/k_BT_2}$ (the [[?boltzmann-factor]]), with $f_0$ scaled down so that you can watch each step; the molecules are drawn for the picture.

**Try this**
- Equal temperatures, no load: the wheel clicks forwards and backwards equally often and makes no progress. No perpetual motion.
- Warm box 1 to 450 K: the wheel creeps forward and the weight rises. The device is a heat engine.
- Add load until the wheel stalls. Compare the load with ε(T₁ − T₂)/T₂ and the efficiency W/(ε + W) with the Carnot 1 − T₂/T₁.
- Make box 2 the hotter one: the wheel turns *backwards*, even with no load.
- Lower ε: the steps come fast — but the forward and backward rates still balance at equal temperatures.`,
    mount(box, kit) {
      const R = rng(1912);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'T1', label: 'Box 1 (vanes) T₁', min: 100, max: 600, step: 5, value: 300, unit: 'K' },
        { id: 'T2', label: 'Box 2 (ratchet and pawl) T₂', min: 100, max: 600, step: 5, value: 300, unit: 'K' },
        { id: 'eps', label: 'Energy to lift the pawl over a tooth, ε', min: 10, max: 150, step: 1, value: 60, unit: 'meV' },
        { id: 'W', label: 'Load: work to lift the weight one tooth, W = Lθ', min: 0, max: 60, step: 0.5, value: 0, unit: 'meV' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the counters', primary: true }] }
      ], id => { if (id === 'reset') reset(); else resetRate(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rf', 'Forward steps per second'], ['rb', 'Backward steps per second'], ['net', 'Net teeth turned (forward − backward)'], ['work', 'Work done on the weight'], ['eff', 'Efficiency W/(ε + W)'], ['car', 'Carnot 1 − T₂/T₁'], ['stall', 'Load that stalls it, ε(T₁ − T₂)/T₂']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'net teeth turned' }, legend: true }, 150);
      const F0 = 40, KM = 0.0861733, NT = 12, STEP = 2 * Math.PI / NT;     // attempts per second (scaled), meV per K, teeth
      let fw = 0, bw = 0, t = 0, tRate = 0, net0 = 0, queue = [], anim = null, phi = 0, lift = 0, weightY = 0, hist = [], histT = 0, plotT = 0, flashV = 0, flashP = 0, nextF = 0, nextB = 0;
      const rates = () => ({ f: F0 * Math.exp(-(V.eps + V.W) / (KM * V.T1)), b: F0 * Math.exp(-V.eps / (KM * V.T2)) });
      const expo = r => r > 0 ? -Math.log(Math.max(1e-12, R())) / r : Infinity;
      function reset() { fw = 0; bw = 0; t = 0; tRate = 0; net0 = 0; queue = []; anim = null; hist = []; histT = 0; resetRate(); }
      function resetRate() { const r = rates(); nextF = t + expo(r.f); nextB = t + expo(r.b); tRate = t; net0 = fw - bw; }
      const gasA = Array.from({ length: 26 }, () => ({ x: R(), y: R(), a: R() * 6.283 })), gasB = Array.from({ length: 26 }, () => ({ x: R(), y: R(), a: R() * 6.283 }));
      reset();
      const loop = kit.loop(dt => {
        t += dt;
        const r = rates();
        // events of the two independent random processes during this frame
        let guard = 0;
        while ((nextF <= t || nextB <= t) && guard++ < 400) { if (nextF <= nextB) { queue.push(1); fw++; nextF += expo(r.f); } else { queue.push(-1); bw++; nextB += expo(r.b); } }
        if (queue.length > 400) queue.splice(0, queue.length - 400);
        // animate the steps one after another (faster when many are waiting)
        const dur = 0.3 / Math.max(1, queue.length / 4);
        if (!anim && queue.length) anim = { d: queue.shift(), u: 0, phi0: phi };
        if (anim) {
          anim.u += dt / dur;
          const u = Math.min(1, anim.u);
          if (anim.d > 0) { phi = anim.phi0 + STEP * u; lift = u; if (u < 0.3) flashV = 1; }
          else { if (u < 0.3) { lift = u / 0.3; phi = anim.phi0; flashP = 1; } else { const w = (u - 0.3) / 0.7; phi = anim.phi0 - STEP * w; lift = 1 - w; } }
          if (anim.u >= 1) { phi = anim.phi0 + anim.d * STEP; lift = 0; weightY += anim.d; anim = null; }
        }
        flashV = Math.max(0, flashV - dt * 3); flashP = Math.max(0, flashP - dt * 3);
        const net = fw - bw, eff = V.W / (V.eps + V.W), car = 1 - V.T2 / V.T1, stall = V.eps * (V.T1 - V.T2) / V.T2;
        ro.set('rf', r.f.toFixed(2) + ' (counted ' + fw + ')'); ro.set('rb', r.b.toFixed(2) + ' (counted ' + bw + ')');
        ro.set('net', String(net)); ro.set('work', (net * V.W).toFixed(0) + ' meV');
        ro.set('eff', V.W > 0 ? (100 * eff).toFixed(1) + ' %' + (r.f < r.b ? ' (runs backwards)' : '') : '0 (no load)');
        ro.set('car', V.T1 > V.T2 ? (100 * car).toFixed(1) + ' %' : 'none: box 1 is not the hotter');
        ro.set('stall', V.T1 > V.T2 ? stall.toFixed(1) + ' meV' : '—');
        histT += dt; if (histT > 0.2) { histT = 0; hist.push([t, net]); if (hist.length > 1500) hist.shift(); }
        plotT += dt; if (plotT > 0.4) { plotT = 0; plot.set({ series: [{ pts: hist, label: 'counted', width: 2 }, { pts: [[tRate, net0], [t, net0 + (r.f - r.b) * (t - tRate)]], label: 'expected (R_f − R_b)·t', dash: [6, 4], width: 1.6 }] }); }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 760, H0 = 370, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        const boxDraw = (x0, T, gas, name) => {
          const hue = 220 - 200 * clamp((T - 100) / 500, 0, 1);
          c.fillStyle = 'hsl(' + hue + ' 70% 50% / 0.10)'; c.fillRect(x0, 40, 270, 280); c.strokeStyle = 'hsl(' + hue + ' 70% 50%)'; c.lineWidth = 2; c.strokeRect(x0, 40, 270, 280);
          kit.label(c, name + ', T = ' + T + ' K', x0 + 135, 28, { size: 12, color: C.text, align: 'center', weight: 600 });
          const sp = 0.22 * Math.sqrt(T / 300);
          c.fillStyle = 'hsl(' + hue + ' 75% 55%)';
          for (const g of gas) { g.x += sp * Math.cos(g.a) * dt; g.y += sp * Math.sin(g.a) * dt * 1.4; if (g.x < 0 || g.x > 1) { g.x = clamp(g.x, 0, 1); g.a = Math.PI - g.a; } if (g.y < 0 || g.y > 1) { g.y = clamp(g.y, 0, 1); g.a = -g.a; } if (R() < dt) g.a += (R() - 0.5) * 2; c.beginPath(); c.arc(x0 + 8 + g.x * 254, 48 + g.y * 264, 2.6, 0, 6.283); c.fill(); }
        };
        boxDraw(10, V.T1, gasA, 'box 1: vanes'); boxDraw(480, V.T2, gasB, 'box 2: ratchet and pawl');
        // the vanes (four paddles), turning with the axle
        const vx0 = 145, vy0 = 180;
        c.strokeStyle = flashV > 0 ? 'hsl(28 95% 55%)' : C.text; c.lineWidth = 7; c.lineCap = 'round';
        for (let k = 0; k < 4; k++) { const a = phi + k * Math.PI / 2; c.beginPath(); c.moveTo(vx0 + 10 * Math.cos(a), vy0 + 10 * Math.sin(a)); c.lineTo(vx0 + 72 * Math.cos(a), vy0 + 72 * Math.sin(a)); c.stroke(); }
        c.lineCap = 'butt'; kit.dot(c, vx0, vy0, 8, C.muted, C.text);
        if (flashV > 0) kit.label(c, 'a lucky kick: ε + W', vx0, vy0 + 110, { size: 12, color: 'hsl(28 95% 55%)', align: 'center', weight: 600 });
        // the ratchet wheel: sawtooth teeth, each rising slowly (forward) and dropping sharply
        const rx0 = 615, ry0 = 180, Ri = 52, Ro = 72;
        c.fillStyle = C.hue(210, 0.25); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath();
        for (let k = 0; k < NT; k++) {
          const a0 = phi + k * STEP;
          for (let j = 0; j <= 8; j++) { const a = a0 + STEP * j / 8, rr = Ri + (Ro - Ri) * j / 8; if (k === 0 && j === 0) c.moveTo(rx0 + rr * Math.cos(a), ry0 + rr * Math.sin(a)); else c.lineTo(rx0 + rr * Math.cos(a), ry0 + rr * Math.sin(a)); }
          c.lineTo(rx0 + Ri * Math.cos(a0 + STEP), ry0 + Ri * Math.sin(a0 + STEP));
        }
        c.closePath(); c.fill(); c.stroke(); kit.dot(c, rx0, ry0, 8, C.muted, C.text);
        // the pawl: pivoted above, its tip resting on the teeth at the top of the wheel, lifted by `lift`
        const tipR = Ri + (Ro - Ri) * lift, tipX = rx0 - 8, tipY = ry0 - tipR, pvX = rx0 - 70, pvY = ry0 - 108;
        c.strokeStyle = flashP > 0 ? 'hsl(0 85% 58%)' : C.text; c.lineWidth = 5; c.beginPath(); c.moveTo(pvX, pvY); c.lineTo(tipX, tipY); c.stroke(); kit.dot(c, pvX, pvY, 5, C.muted, C.text);
        // its spring, pressing it down
        const sx0 = (pvX + tipX) / 2, sy0 = (pvY + tipY) / 2; c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(sx0, sy0);
        for (let k = 1; k <= 8; k++) { const yy = sy0 + (52 - sy0) * k / 8; c.lineTo(sx0 + (k % 2 ? 7 : -7), yy); } c.lineTo(sx0, 42); c.stroke();
        kit.label(c, 'pawl', pvX - 6, pvY - 12, { size: 11, color: C.text, align: 'right' });
        if (flashP > 0) kit.label(c, 'pawl jiggled up: slip back', rx0, ry0 + 110, { size: 12, color: 'hsl(0 85% 58%)', align: 'center', weight: 600 });
        // the axle between the boxes, with a drum and a weight on a thread
        c.strokeStyle = C.muted; c.lineWidth = 3; c.setLineDash([8, 5]); c.beginPath(); c.moveTo(vx0, vy0); c.lineTo(rx0, ry0); c.stroke(); c.setLineDash([]);
        const dx = 380, wy = clamp(250 - 2.2 * (weightY % 60), 190, 330);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(dx + 14, vy0); c.lineTo(dx + 14, wy); c.stroke();
        c.fillStyle = C.muted; c.beginPath(); c.arc(dx, vy0, 14, 0, 6.283); c.fill();
        c.fillStyle = C.hue(28, 0.9); c.fillRect(dx + 4, wy, 20, 16); kit.label(c, 'weight', dx + 14, wy + 28, { size: 11, color: C.text, align: 'center' });
        kit.label(c, 'one axle', dx, vy0 - 26, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'forward ' + fw + '   back ' + bw, dx, 352, { size: 12, color: C.text, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat-film */
  Hyper.sim('heat-film', {
    title: 'The film run backwards',
    blurb: `Soft round molecules start packed in the left quarter of a box and fly apart, bouncing off each other and the walls. The motion is computed so that it is **exactly** reversible: positions are whole numbers of tiny units and the forces are rounded the same way going forwards and backwards, so reversing every velocity makes each molecule retrace its path to the last digit — the laws of mechanics, run backwards. The colours only help you follow them. The graph shows the share of molecules in the left quarter and the entropy of the arrangement ($\\ln W$ over 32 cells, as a fraction of its largest value).

**Try this**
- Let the gas spread for a few seconds, then press *Reverse every velocity*: the molecules gather back into the corner, then spread again on the other side of the moment they started.
- Tick *Nudge one molecule*, let it spread for 10 seconds or more, and reverse: a shift of 1/4096 of a pixel grows at every collision, and the gas never gathers again. Ordered states are not only rare but fragile.
- Press *Mystery clip* and guess whether a stretch of the recorded film runs forwards or backwards. Early clips, while the gas spreads, are easy; once it has filled the box, you are reduced to guessing.
- With 20 molecules, watch the share in the left quarter: it often jumps well above ¼ by chance. With 150 it hardly moves.`,
    mount(box, kit) {
      const R = rng(1964);
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = graphBox(box);
      let paused = false, msg = '';
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Molecules', options: [['20', 20], ['60', 60], ['150', 150]], value: 60 },
        { id: 'nudge', type: 'check', label: 'Nudge one molecule by 1/4096 of a pixel when reversing', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'rev', label: 'Reverse every velocity' }, { id: 'pause', label: 'Pause / go on' }] },
        { type: 'buttons', items: [{ id: 'clip', label: 'Mystery clip' }, { id: 'gf', label: 'It runs forwards' }, { id: 'gb', label: 'It runs backwards' }] }
      ], id => {
        if (id === 'restart' || id === 'n') build();
        else if (id === 'rev') reverse();
        else if (id === 'pause') paused = !paused;
        else if (id === 'clip') startClip();
        else if (id === 'gf' || id === 'gb') guess(id === 'gf' ? 1 : -1);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['clock', 'Clock (from the start)'], ['dir', 'Velocities'], ['left', 'Share in the left quarter'], ['S', 'Entropy of the arrangement, S/S_max'], ['clip', 'Mystery clip'], ['score', 'Your guesses']]);
      const plot = kit.plot(gb, { x: { label: 'seconds since you pressed Start', min: 0 }, y: { label: 'share', min: 0, max: 1 }, legend: true }, 150);
      const BW = 600, BH = 340, RAD = 5, SIG = 2 * RAD, SIG2 = SIG * SIG, KP = 0.1, KW = 0.2, Q = 4096, SPF = 4, CX = 16, CY = 18, NC = 8, NR = 4;
      let N = 0, xp, yp, xc, yc, fx, fy, k = 0, dirn = 1, rev = 0, real = 0, rec = [], recording = true, frame = 0, clip = null, right = 0, tries = 0, hist = [], histT = 0, plotT = 0, marks = [], nudged = -1;
      function build() {
        N = V.n; xp = new Float64Array(N); yp = new Float64Array(N); xc = new Float64Array(N); yc = new Float64Array(N); fx = new Float64Array(N); fy = new Float64Array(N);
        const cols = Math.max(1, Math.round(Math.sqrt(N * (BW / 4 - 2 * RAD) / (BH - 2 * RAD)))), rows = Math.ceil(N / cols), gx = (BW / 4 - 2 * RAD) / cols, gy = (BH - 2 * RAD) / rows;
        for (let i = 0; i < N; i++) {
          const px = RAD + (i % cols + 0.5) * gx + (R() - 0.5) * Math.max(0, gx - SIG) * 0.8, py = RAD + (Math.floor(i / cols) + 0.5) * gy + (R() - 0.5) * Math.max(0, gy - SIG) * 0.8;
          xc[i] = Math.round(px * Q); yc[i] = Math.round(py * Q);
          xp[i] = xc[i] - Math.round(0.3 * gauss(R) * Q); yp[i] = yc[i] - Math.round(0.3 * gauss(R) * Q);
        }
        k = 0; dirn = 1; rev = 0; real = 0; rec = []; recording = true; frame = 0; clip = null; hist = []; histT = 0; marks = []; nudged = -1; msg = '';
      }
      // forces: soft repulsion between overlapping molecules and from the walls; rounded to whole units, so they
      // depend only on the (integer) positions and are exactly the same going forwards and backwards
      function step() {
        fx.fill(0); fy.fill(0);
        for (let i = 0; i < N; i++) {
          const xi = xc[i] / Q, yi = yc[i] / Q;
          if (xi < RAD) fx[i] += KW * (RAD - xi); else if (xi > BW - RAD) fx[i] -= KW * (xi - BW + RAD);
          if (yi < RAD) fy[i] += KW * (RAD - yi); else if (yi > BH - RAD) fy[i] -= KW * (yi - BH + RAD);
          for (let j = i + 1; j < N; j++) {
            const dx = xi - xc[j] / Q; if (dx >= SIG || dx <= -SIG) continue;
            const dy = yi - yc[j] / Q; if (dy >= SIG || dy <= -SIG) continue;
            const d2 = dx * dx + dy * dy;
            if (d2 < SIG2 && d2 > 1e-12) { const d = Math.sqrt(d2), f = KP * (SIG - d) / d; fx[i] += f * dx; fy[i] += f * dy; fx[j] -= f * dx; fy[j] -= f * dy; }
          }
        }
        for (let i = 0; i < N; i++) {
          const nx = 2 * xc[i] - xp[i] + Math.round(fx[i] * Q), ny = 2 * yc[i] - yp[i] + Math.round(fy[i] * Q);
          xp[i] = xc[i]; yp[i] = yc[i]; xc[i] = nx; yc[i] = ny;
        }
        k += dirn;
      }
      function reverse() {
        if (clip) return;
        if (V.nudge) { const i = N >> 1; xp[i] += 1; xc[i] += 1; nudged = i; }
        let t = xp; xp = xc; xc = t; t = yp; yp = yc; yc = t;
        dirn = -dirn; rev++; recording = false; marks.push({ x: real, label: V.nudge ? 'reversed (nudged)' : 'reversed' });
      }
      function startClip() {
        if (rec.length < 80) { msg = 'let the film run a few seconds first'; return; }
        const len = 60, i0 = Math.floor(R() * (rec.length - len));
        clip = { i0, len, j: 0, dir: R() < 0.5 ? 1 : -1 }; msg = 'forwards or backwards?';
      }
      function guess(d) {
        if (!clip) { msg = 'press Mystery clip first'; return; }
        tries++; if (d === clip.dir) right++;
        msg = (d === clip.dir ? 'right' : 'wrong') + ': it ran ' + (clip.dir > 0 ? 'forwards' : 'backwards') + ', from ' + (clip.i0 * 3 / 60).toFixed(1) + ' s into the film';
        clip = null;
      }
      function stats(X, Y, scale) {
        let left = 0; const cnt = new Int32Array(NC * NR);
        for (let i = 0; i < N; i++) { const x = X(i) / scale, y = Y(i) / scale; if (x < BW / 4) left++; cnt[clamp(Math.floor(x / BW * NC), 0, NC - 1) + NC * clamp(Math.floor(y / BH * NR), 0, NR - 1)]++; }
        let lnW = LNF[N]; for (const v of cnt) lnW -= LNF[v];
        const q = Math.floor(N / (NC * NR)), r = N % (NC * NR), lnMax = LNF[N] - (NC * NR - r) * LNF[q] - r * LNF[q + 1];
        return { left: left / N, S: lnMax > 0 ? lnW / lnMax : 0 };
      }
      build();
      const loop = kit.loop(dt => {
        let X, Y, scale;
        if (clip) {
          clip.j += dt * 20; if (clip.j >= clip.len) clip.j = 0;
          const idx = clip.i0 + (clip.dir > 0 ? Math.floor(clip.j) : clip.len - 1 - Math.floor(clip.j)), snap = rec[idx];
          X = i => snap[2 * i]; Y = i => snap[2 * i + 1]; scale = 1;
        } else {
          if (!paused) {
            for (let s = 0; s < SPF; s++) step();
            real += dt; frame++;
            if (recording && frame % 3 === 0 && rec.length < 900) { const snap = new Float32Array(2 * N); for (let i = 0; i < N; i++) { snap[2 * i] = xc[i] / Q; snap[2 * i + 1] = yc[i] / Q; } rec.push(snap); }
          }
          X = i => xc[i]; Y = i => yc[i]; scale = Q;
        }
        const S = stats(X, Y, scale);
        if (!clip && !paused) { histT += dt; if (histT > 0.1) { histT = 0; hist.push([real, S.left, S.S]); if (hist.length > 1200) hist.shift(); } }
        plotT += dt;
        if (plotT > 0.3) { plotT = 0; plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'share in the left quarter', width: 2 }, { pts: hist.map(h => [h[0], h[2]]), label: 'S / S_max', width: 2 }], vlines: marks.slice(-4), hlines: [{ y: 0.25, label: '¼' }] }); }
        ro.set('clock', clip ? '(film)' : (k / (SPF * 60)).toFixed(2) + ' s');
        ro.set('dir', rev === 0 ? 'as started' : (rev % 2 ? 'reversed' : 'reversed twice') + (nudged >= 0 ? ', one nudged' : ''));
        ro.set('left', (100 * S.left).toFixed(0) + ' %'); ro.set('S', S.S.toFixed(3));
        ro.set('clip', clip ? 'playing — forwards or backwards?' : msg || '—');
        ro.set('score', tries ? right + ' right of ' + tries : '—');
        // ---- drawing
        const c = st.begin(), C = kit.colors(), W0 = 632, H0 = 376, f = fit(st, W0, H0);
        c.save(); c.translate(f.ox, f.oy); c.scale(f.s, f.s);
        if (clip) { c.fillStyle = C.dark ? 'hsl(30 15% 12%)' : 'hsl(35 30% 88%)'; c.fillRect(CX - 12, CY - 14, BW + 24, BH + 28); c.fillStyle = C.bg2 || C.faint; for (let xx = CX - 4; xx < CX + BW; xx += 22) { c.fillRect(xx, CY - 11, 10, 6); c.fillRect(xx, CY + BH + 5, 10, 6); } }
        c.fillStyle = C.hue(210, 0.07); c.fillRect(CX, CY, BW / 4, BH);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(CX, CY, BW, BH);
        c.strokeStyle = C.faint; c.setLineDash([3, 5]); c.lineWidth = 1; c.beginPath(); c.moveTo(CX + BW / 4, CY); c.lineTo(CX + BW / 4, CY + BH); c.stroke(); c.setLineDash([]);
        for (let i = 0; i < N; i++) {
          const x = X(i) / scale, y = Y(i) / scale;
          c.fillStyle = 'hsl(' + Math.round(360 * i / N) + ' 70% ' + (C.dark ? 62 : 48) + '%)'; c.beginPath(); c.arc(CX + x, CY + y, RAD, 0, 6.283); c.fill();
          if (i === nudged && !clip) { c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(CX + x, CY + y, RAD + 4, 0, 6.283); c.stroke(); }
        }
        kit.label(c, clip ? 'mystery clip: forwards or backwards?' : (dirn > 0 ? 'time →' : '← time running backwards'), CX + BW / 2, CY + BH + 12, { size: 12, color: clip ? C.warn : C.muted, align: 'center', weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
