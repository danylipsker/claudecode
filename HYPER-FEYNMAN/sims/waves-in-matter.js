/* HYPER-FEYNMAN · sims/waves-in-matter.js — simulations for Waves in matter (FLP III-13 to III-21).
 *   wim-chain        an electron hopping along a chain of atoms: amplitudes as arrows, the band E₀ − 2A cos kb,
 *                    wave packets, an impurity that reflects, transmits and traps
 *   wim-bands        a semiconductor's bands with real carrier numbers: temperature, gap, donors and acceptors
 *   wim-pn           a p–n junction: the step in the bands, flows over it and down it, the rectifier curve
 *   wim-schrodinger  the Schrödinger equation solved live: a packet in a box, at a step, a barrier, a harmonic well
 *   wim-stationary   stationary states of wells stacked at their energies; superpositions that slosh
 *   wim-tunnel       a packet at a barrier, the transmission against energy and width, compared with barrierT
 *   wim-orbitals     orbitals as clouds coloured by phase, and the vector model of L_z = mħ
 *   wim-hydrogen     hydrogen's levels, photons between them and the radial probability
 *   wim-shells       the periodic table filled electron by electron, with ionisation energies
 *   wim-operators    ψ, Âψ and the integrand of ⟨A⟩; averages in phase space and the uncertainty product
 *   wim-flux         flux trapped in a superconducting ring in quanta of h/2e; the phase winds n times
 *   wim-josephson    a Josephson junction (current bias, voltage bias) and a SQUID
 * Natural units in the wave simulations: ħ = mₑ = 1 with the length unit 0.1 nm, so the energy unit is 7.62 eV and
 * the time unit 0.0864 fs.
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const EU = 7.619964;            // eV per natural energy unit (ħ = mₑ = 1, length unit 0.1 nm)
  const TU = 0.08638;             // fs per natural time unit
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const SUP = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  // 1.07e10 -> "1.07 × 10¹⁰"
  function sci(v, d) {
    if (!Number.isFinite(v)) return '—';
    if (v === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(v)));
    if (e >= -2 && e <= 3) return String(+v.toPrecision(d || 3));
    const m = v / Math.pow(10, e);
    return m.toFixed((d || 3) - 1) + ' × 10' + String(e).split('').map(ch => SUP[ch] || ch).join('');
  }
  function plotBox(box) { const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb); return gb; }
  function polyline(c, pts) { c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); }

  /* ================================================================ wim-chain */
  Hyper.sim('wim-chain', {
    title: 'An electron hopping along a chain of atoms',
    blurb: `An electron on a line of 70 identical atoms. It can sit on any atom and has an amplitude A/ħ per unit time to hop to either neighbour; the equations iħ dCₙ/dt = E₀Cₙ − A(Cₙ₋₁ + Cₙ₊₁) are solved step by step as you watch. The top row is the [[?amplitude|amplitude]] Cₙ (real part solid, imaginary part dashed), the middle row the same amplitude drawn as an arrow at each atom, the bottom row the [[?probability]] |Cₙ|². The graph is the band E = E₀ − 2A cos kb with the packet's k marked and the slope that sets its speed. Speeds in m/s and masses in mₑ take A = 1 eV and b = 0.3 nm.

**Try this**
- Launch a packet at kb = 1.57 (π/2): the arrows turn a quarter-turn from atom to atom and the packet glides at top speed, where the band is steepest.
- Move kb towards 0 or towards ±3.14: the packet slows and mostly spreads — the band is flat there. Negative kb sends it the other way.
- Start the electron on one atom: it leaks out both ways at once, fastest at the two fronts, because it contains every k.
- Turn on the impurity with F = 1: a packet at kb = 1.57 is about 80 % transmitted, a slow one at kb = 0.4 mostly reflected. Compare "beyond the impurity" with the theory once the packet has passed.
- Set F = −2 and start the electron on one atom (the impurity): part of it stays trapped there, in a bound state below the band.
- Choose a stationary state: every arrow turns at the same rate and the probabilities never change.`,
    mount(box, kit) {
      const N = 70, IMP = 42, VMAX = 9.1156e5, MEFF = 0.4233;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 270 });
      const plot = kit.plot(plotBox(box), { x: { label: 'wave number k·b (rad)', min: -Math.PI, max: Math.PI }, y: { label: '(E − E₀)/A', min: -4, max: 4 }, legend: true }, 170);
      const re = new Float64Array(N), im = new Float64Array(N), V = new Float64Array(N);
      const K = [0, 1, 2, 3].map(() => [new Float64Array(N), new Float64Array(N)]), tr = new Float64Array(N), ti = new Float64Array(N);
      let t = 0, amp0 = 1, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Start with', options: [['A wave packet', 'packet'], ['The electron on one atom', 'atom'], ['A stationary state (standing wave)', 'wave']], value: 'packet' },
        { id: 'kb', label: 'Wave number k·b at the centre', min: -3.14, max: 3.14, step: 0.01, value: 1.57, unit: 'rad' },
        { id: 'w', label: 'Width of the packet', min: 2, max: 12, step: 0.5, value: 5, unit: 'atoms' },
        { id: 'imp', type: 'check', label: 'Impurity atom (number 42)', value: false },
        { id: 'F', label: 'Impurity energy shift F, in units of A', min: -3, max: 3, step: 0.1, value: 1 },
        { id: 'speed', label: 'Speed of time', min: 0.2, max: 3, step: 0.1, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart', primary: true }] }
      ], id => { if (id !== 'speed') reset(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Energy at k₀: E − E₀'], ['v', 'Group velocity (2Ab/ħ) sin kb'], ['m', 'Effective mass ħ²/(2Ab² cos kb)'], ['x', 'Centre and spread'], ['T', 'Impurity'], ['t', 'Time']]);
      const jOf = () => Math.max(1, Math.min(N, Math.round(Math.abs(P.kb) * (N + 1) / Math.PI)));
      const kEff = () => P.mode === 'wave' ? Math.PI * jOf() / (N + 1) : P.kb;
      function reset() {
        t = 0;
        for (let n = 0; n < N; n++) V[n] = (P.imp && n === IMP) ? P.F : 0;
        if (P.mode === 'packet') {
          const n0 = P.kb >= 0 ? 14 : N - 15;
          for (let n = 0; n < N; n++) { const u = (n - n0) / P.w, a = Math.exp(-u * u / 4); re[n] = a * Math.cos(P.kb * n); im[n] = a * Math.sin(P.kb * n); }
        } else if (P.mode === 'atom') {
          re.fill(0); im.fill(0); re[P.imp ? IMP : 35] = 1;
        } else {
          const j = jOf();
          for (let n = 0; n < N; n++) { re[n] = Math.sin(Math.PI * j * (n + 1) / (N + 1)); im[n] = 0; }
        }
        let s = 0; for (let n = 0; n < N; n++) s += re[n] * re[n] + im[n] * im[n];
        s = Math.sqrt(s) || 1; amp0 = 0;
        for (let n = 0; n < N; n++) { re[n] /= s; im[n] /= s; amp0 = Math.max(amp0, Math.hypot(re[n], im[n])); }
        amp0 = amp0 || 1; dirty = true;
      }
      // dC/dt = −i H C (ħ = A = 1): H C_n = V_n C_n − (C_{n−1} + C_{n+1}), open ends
      function deriv(r, i, dr, di) {
        for (let n = 0; n < N; n++) {
          const hr = V[n] * r[n] - ((n > 0 ? r[n - 1] : 0) + (n < N - 1 ? r[n + 1] : 0));
          const hi = V[n] * i[n] - ((n > 0 ? i[n - 1] : 0) + (n < N - 1 ? i[n + 1] : 0));
          dr[n] = hi; di[n] = -hr;
        }
      }
      function rk4(h) {
        deriv(re, im, K[0][0], K[0][1]);
        for (let n = 0; n < N; n++) { tr[n] = re[n] + h / 2 * K[0][0][n]; ti[n] = im[n] + h / 2 * K[0][1][n]; }
        deriv(tr, ti, K[1][0], K[1][1]);
        for (let n = 0; n < N; n++) { tr[n] = re[n] + h / 2 * K[1][0][n]; ti[n] = im[n] + h / 2 * K[1][1][n]; }
        deriv(tr, ti, K[2][0], K[2][1]);
        for (let n = 0; n < N; n++) { tr[n] = re[n] + h * K[2][0][n]; ti[n] = im[n] + h * K[2][1][n]; }
        deriv(tr, ti, K[3][0], K[3][1]);
        for (let n = 0; n < N; n++) {
          re[n] += h / 6 * (K[0][0][n] + 2 * K[1][0][n] + 2 * K[2][0][n] + K[3][0][n]);
          im[n] += h / 6 * (K[0][1][n] + 2 * K[1][1][n] + 2 * K[2][1][n] + K[3][1][n]);
        }
      }
      function updatePlot() {
        const band = [];
        for (let i = 0; i <= 120; i++) { const k = -Math.PI + TAU * i / 120; band.push([k, -2 * Math.cos(k)]); }
        const series = [{ pts: band, label: 'band E₀ − 2A cos kb' }], marks = [], hlines = [];
        if (P.mode !== 'atom') {
          const k0 = kEff(), E = -2 * Math.cos(k0), s = 2 * Math.sin(k0);
          if (P.mode === 'packet') series.push({ pts: [[k0 - 0.7, E - 0.7 * s], [k0 + 0.7, E + 0.7 * s]], label: 'slope = group velocity', dash: [5, 4], width: 1.5 });
          marks.push({ x: k0, y: E, label: P.mode === 'wave' ? '±k' : 'k₀' });
        }
        if (P.imp && Math.abs(P.F) > 0.05) hlines.push({ y: Math.sign(P.F) * Math.sqrt(4 + P.F * P.F), label: 'bound state of the impurity' });
        plot.set({ series, marks, hlines });
      }
      reset();
      const loop = kit.loop(dt => {
        const Tn = dt * 5 * P.speed, ns = Math.ceil(Tn / 0.02), h = Tn / Math.max(1, ns);
        for (let s = 0; s < ns; s++) rk4(h);
        t += Tn;
        // measures (and a guard against slow drift of the norm)
        let S = 0; for (let n = 0; n < N; n++) S += re[n] * re[n] + im[n] * im[n];
        const sq = Math.sqrt(S) || 1; for (let n = 0; n < N; n++) { re[n] /= sq; im[n] /= sq; }
        let mean = 0, m2 = 0, pmax = 1e-9, right = 0;
        for (let n = 0; n < N; n++) { const p = re[n] * re[n] + im[n] * im[n]; mean += n * p; m2 += n * n * p; pmax = Math.max(pmax, p); if (n > IMP) right += p; }
        const sd = Math.sqrt(Math.max(0, m2 - mean * mean));
        if (dirty) { updatePlot(); dirty = false; }
        const k0 = kEff(), cs = Math.cos(k0);
        ro.set('E', P.mode === 'atom' ? 'every k at once: the whole band' : (-2 * cs).toFixed(2) + ' A');
        ro.set('v', P.mode === 'atom' ? 'all speeds up to 2Ab/ħ' : P.mode === 'wave' ? '0: a standing wave is +k and −k together' : (2 * Math.sin(k0)).toFixed(2) + ' atoms per ħ/A = ' + sci(VMAX * Math.sin(k0)) + ' m/s');
        ro.set('m', P.mode === 'atom' ? '—' : Math.abs(cs) < 0.03 ? 'infinite: the band is flat here' : (MEFF / cs).toFixed(2) + ' mₑ');
        ro.set('x', 'atom ' + mean.toFixed(1) + ' ± ' + sd.toFixed(1));
        if (P.imp) {
          const s2 = Math.pow(Math.sin(k0), 2), Tth = 4 * s2 / (4 * s2 + P.F * P.F);
          const pi = re[IMP] * re[IMP] + im[IMP] * im[IMP];
          ro.set('T', P.mode === 'atom' ? 'on the impurity now: ' + pi.toFixed(2) : 'beyond it now: ' + right.toFixed(2) + ' · theory T(k₀) = ' + Tth.toFixed(2));
        } else ro.set('T', 'off');
        ro.set('t', (t).toFixed(1) + ' ħ/A = ' + (t * 0.6582).toFixed(1) + ' fs');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const x0 = 22, sx = (W - 44) / (N - 1), X = n => x0 + n * sx;
        const yRe = H * 0.2, yArr = H * 0.47, yBar = H - 44, yAt = H - 30, bh = H * 0.22;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0, yRe); c.lineTo(X(N - 1), yRe); c.moveTo(x0, yBar); c.lineTo(X(N - 1), yBar); c.stroke();
        if (P.imp) { c.strokeStyle = C.warn; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(IMP), 18); c.lineTo(X(IMP), yAt); c.stroke(); c.setLineDash([]); }
        const ar = H * 0.12 / amp0;
        c.lineWidth = 1.8; c.strokeStyle = C.series[0];
        polyline(c, Array.from(re, (v, n) => [X(n), yRe - ar * v]));
        c.setLineDash([4, 3]); c.strokeStyle = C.series[1];
        polyline(c, Array.from(im, (v, n) => [X(n), yRe - ar * v]));
        c.setLineDash([]);
        const La = Math.min(26, H * 0.1) / amp0;
        for (let n = 0; n < N; n++) {
          const a = Math.hypot(re[n], im[n]);
          if (a > 0.04 * amp0) kit.arrow(c, X(n), yArr, X(n) + La * re[n], yArr - La * im[n], C.accent, 1.4, 5);
          else kit.dot(c, X(n), yArr, 1, C.faint);
        }
        for (let n = 0; n < N; n++) {
          const p = re[n] * re[n] + im[n] * im[n], hgt = bh * p / pmax;
          c.fillStyle = n === IMP && P.imp ? C.warn : C.ok; c.fillRect(X(n) - sx * 0.35, yBar - hgt, sx * 0.7, hgt);
        }
        const rA = Math.max(1.5, Math.min(4, sx * 0.33));
        for (let n = 0; n < N; n++) kit.dot(c, X(n), yAt, rA, n === IMP && P.imp ? C.warn : C.muted);
        for (let n = 0; n < N; n += 10) kit.label(c, String(n), X(n), yAt + 14, { size: 10, color: C.faint, align: 'center' });
        kit.label(c, 'amplitude Cₙ: real (solid), imaginary (dashed)', 8, 11, { size: 11, color: C.muted });
        kit.label(c, 'Cₙ as an arrow at each atom', 8, yArr - H * 0.13, { size: 11, color: C.muted });
        kit.label(c, 'probability |Cₙ|² (peak ' + pmax.toFixed(3) + ')', 8, yBar - bh - 8, { size: 11, color: C.muted });
        if (P.imp) kit.label(c, 'impurity', X(IMP), yAt + 14, { size: 10, color: C.warn, align: 'center', weight: 700 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-bands */
  const SEMI = {
    Si: { name: 'Silicon', Eg: 1.12, Nc: 2.8e19, Nv: 2.65e19, Ed: 0.045, Ea: 0.045, mun: 1400, mup: 450, don: 'phosphorus', acc: 'boron' },
    Ge: { name: 'Germanium', Eg: 0.66, Nc: 1.04e19, Nv: 6.0e18, Ed: 0.012, Ea: 0.010, mun: 3900, mup: 1900, don: 'phosphorus', acc: 'boron' },
    GaAs: { name: 'Gallium arsenide', Eg: 1.42, Nc: 4.7e17, Nv: 9.0e18, Ed: 0.006, Ea: 0.030, mun: 8500, mup: 400, don: 'silicon', acc: 'zinc' }
  };
  const KB_EV = 8.617333e-5;
  // equilibrium carriers (per cm³) from charge neutrality: n + N_A⁻ = p + N_D⁺, Boltzmann statistics; energies from E_v
  function carriers(m, dop, Nd, T) {
    const kT = KB_EV * T, sc = Math.pow(T / 300, 1.5), Nc = m.Nc * sc, Nv = m.Nv * sc;
    const ND = dop === 'n' ? Nd : 0, NA = dop === 'p' ? Nd : 0;
    const f = EF => {
      const n = Nc * Math.exp((EF - m.Eg) / kT), p = Nv * Math.exp(-EF / kT);
      const Dp = ND / (1 + 2 * Math.exp((EF - (m.Eg - m.Ed)) / kT)), Am = NA / (1 + 4 * Math.exp((m.Ea - EF) / kT));
      return { n, p, Dp, Am, g: p + Dp - n - Am };
    };
    let lo = -0.5, hi = m.Eg + 0.5;
    for (let i = 0; i < 90; i++) { const mid = (lo + hi) / 2; if (f(mid).g > 0) lo = mid; else hi = mid; }
    const EF = (lo + hi) / 2, r = f(EF);
    return { EF, n: r.n, p: r.p, ion: ND ? r.Dp / ND : NA ? r.Am / NA : 0, ni: Math.sqrt(Nc * Nv) * Math.exp(-m.Eg / (2 * kT)), kT };
  }

  Hyper.sim('wim-bands', {
    title: 'Bands, gaps and doping',
    blurb: `A semiconductor drawn as its bands: the full valence band below, the empty conduction band above and the gap between. Electrons in the conduction band are dots, holes in the valence band are rings, and impurity levels are the short dashes just inside the gap. The numbers are real: the densities come from the statistics of the bands and impurities (each state weighted by the [[?boltzmann-factor]]), solved for overall charge neutrality. The picture shows a volume that holds exactly 16 impurity atoms, so the carriers you see are the ones really there. The graph shows electrons and holes against temperature on a [[?logarithm|logarithmic]] scale. (The gap and the mobilities are taken as fixed.)

**Try this**
- Pure silicon at 300 K: not one carrier in the picture — 10¹⁰ per cm³ is one for every 5 × 10¹² atoms. Heat it to 700 K and pairs appear, an electron and a hole each time.
- Switch to germanium (gap 0.66 eV): far more carriers at the same temperature. Gallium arsenide (1.42 eV) has far fewer.
- Dope with donors: at 300 K nearly all 16 give up their electrons (the dashes turn to +), and the holes all but vanish, since n p = nᵢ².
- Cool the doped crystal to 50 K: the electrons fall back onto their donors — freeze-out. Heat it to 800 K: thermal pairs outnumber the donors and the crystal behaves as if it were pure.
- Watch the Fermi level: near the conduction band for n-type, near the valence band for p-type, near the middle of the gap for pure material.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const plot = kit.plot(plotBox(box), { x: { label: 'temperature (K)', min: 40, max: 800 }, y: { label: 'carriers per cm³', log: true, min: 1e3, max: 1e21 }, legend: true }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', options: [['Silicon (1.12 eV)', 'Si'], ['Germanium (0.66 eV)', 'Ge'], ['Gallium arsenide (1.42 eV)', 'GaAs']], value: 'Si' },
        { id: 'dop', type: 'select', label: 'Doping', options: [['Pure (intrinsic)', 'i'], ['n-type: donors', 'n'], ['p-type: acceptors', 'p']], value: 'i' },
        { id: 'N', label: 'Impurity density (per cm³)', min: 1e13, max: 1e18, value: 1e16, log: true, sig: 2, fmt: v => sci(v, 2) },
        { id: 'T', label: 'Temperature', min: 40, max: 800, step: 5, value: 300, unit: 'K' }
      ], () => { recompute(); curves(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Electrons n (per cm³)'], ['p', 'Holes p (per cm³)'], ['ni', 'Pure material nᵢ'], ['ion', 'Impurities ionised'], ['EF', 'Fermi level above E_v'], ['rho', 'Resistivity'], ['pic', 'In the picture']]);
      const MAXD = 150;
      const mk = () => Array.from({ length: MAXD }, () => ({ x: Math.random(), u: Math.random(), vx: (Math.random() - 0.5) * 0.2, age: 9 }));
      const els = mk(), hol = mk();
      let res = null, shownE = 0, shownH = 0, tick = 0;
      function recompute() { res = carriers(SEMI[P.mat], P.dop, P.N, P.T); }
      function curves() {
        const m = SEMI[P.mat], nP = [], pP = [], iP = [];
        for (let T = 40; T <= 800; T += 10) { const r = carriers(m, P.dop, P.N, T); nP.push([T, Math.max(1e3, r.n)]); pP.push([T, Math.max(1e3, r.p)]); iP.push([T, Math.max(1e3, r.ni)]); }
        const series = [{ pts: nP, label: 'electrons n' }, { pts: pP, label: 'holes p' }, { pts: iP, label: 'nᵢ of pure material', dash: [5, 4], width: 1.4 }];
        plot.set({ series, vlines: [{ x: P.T, label: P.T.toFixed(0) + ' K' }], hlines: P.dop === 'i' ? [] : [{ y: P.N, label: P.dop === 'n' ? 'donors N_D' : 'acceptors N_A' }] });
      }
      recompute(); curves();
      const draws = (x, prev) => { const f = Math.floor(x), r = x - f; return Math.min(MAXD, f + (Math.random() < r ? 1 : 0)); };
      const loop = kit.loop(dt => {
        const m = SEMI[P.mat], vol = 16 / P.N, eN = res.n * vol, hN = res.p * vol;
        tick += dt;
        if (tick > 0.4 || dt === 0) {
          tick = 0;
          const ne = draws(eN), nh = draws(hN);
          for (let i = shownE; i < ne; i++) els[i].age = 0;
          for (let i = shownH; i < nh; i++) hol[i].age = 0;
          shownE = ne; shownH = nh;
        }
        for (const q of els.concat(hol)) { q.vx += (Math.random() - 0.5) * 0.6 * dt; q.vx = clamp(q.vx, -0.12, 0.12); q.x = (q.x + q.vx * dt + 1) % 1; q.age += dt; if (Math.random() < dt * 0.5) q.u = Math.random(); }
        const ionised = P.dop === 'i' ? 0 : Math.round(16 * res.ion);
        ro.set('n', sci(res.n)); ro.set('p', sci(res.p)); ro.set('ni', sci(res.ni));
        ro.set('ion', P.dop === 'i' ? 'no impurities' : (100 * res.ion).toFixed(res.ion > 0.995 || res.ion < 0.005 ? 1 : 0) + ' % (' + ionised + ' of 16 drawn)');
        ro.set('EF', res.EF.toFixed(3) + ' eV (gap ' + m.Eg.toFixed(2) + ' eV)');
        const sigma = 1.602e-19 * (res.n * m.mun + res.p * m.mup);
        ro.set('rho', sigma > 0 ? sci(1 / sigma) + ' Ω·cm' : '—');
        ro.set('pic', sci(vol, 2) + ' cm³: ' + (eN < 0.01 ? sci(eN, 2) : eN.toFixed(eN < 10 ? 2 : 0)) + ' electrons, ' + (hN < 0.01 ? sci(hN, 2) : hN.toFixed(hN < 10 ? 2 : 0)) + ' holes on average');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const s = H * 0.42 / 1.42, yV = H * 0.74, yC = yV - m.Eg * s, th = H * 0.15, xl = 70, xr = W - 24, bw = xr - xl;
        c.fillStyle = C.hue(210, 0.18); c.fillRect(xl, yV, bw, th);
        c.fillStyle = C.hue(30, 0.08); c.fillRect(xl, yC - th, bw, th);
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(xl, yV); c.lineTo(xr, yV); c.moveTo(xl, yC); c.lineTo(xr, yC); c.stroke();
        // the sea of bonding electrons in the full band
        c.fillStyle = C.hue(210, 0.45);
        for (let i = 0; i < 44; i++) for (let j = 0; j < 4; j++) { const x = xl + (i + 0.5 + (j % 2) * 0.5) * bw / 44.5, y = yV + 7 + j * (th - 12) / 3; c.fillRect(x - 1, y - 1, 2.2, 2.2); }
        kit.label(c, 'conduction band', xl + 6, yC - th + 10, { size: 11, color: C.muted });
        kit.label(c, 'valence band (full)', xl + 6, yV + th - 8, { size: 11, color: C.muted });
        // the gap
        kit.arrow(c, 40, yV, 40, yC, C.muted, 1.2, 6); kit.arrow(c, 40, yC, 40, yV, C.muted, 1.2, 6);
        kit.label(c, 'E_g', 46, (yV + yC) / 2 - 8, { size: 12, weight: 700 });
        kit.label(c, m.Eg.toFixed(2) + ' eV', 46, (yV + yC) / 2 + 8, { size: 11, color: C.muted });
        // impurity levels
        if (P.dop !== 'i') {
          const yL = P.dop === 'n' ? yC + m.Ed * s + 4 : yV - m.Ea * s - 4;
          for (let i = 0; i < 16; i++) {
            const x = xl + (i + 0.5) * bw / 16, ion = i < ionised;
            c.strokeStyle = P.dop === 'n' ? C.series[1] : C.series[2]; c.lineWidth = 2;
            c.beginPath(); c.moveTo(x - 7, yL); c.lineTo(x + 7, yL); c.stroke();
            if (P.dop === 'n') { if (ion) kit.label(c, '+', x, yL + 9, { size: 12, weight: 700, color: C.series[1], align: 'center' }); else kit.dot(c, x, yL - 4, 3.2, C.accent); }
            else { if (ion) { kit.dot(c, x, yL - 4, 3.2, C.accent); kit.label(c, '−', x, yL - 13, { size: 12, weight: 700, color: C.series[2], align: 'center' }); } }
          }
          kit.label(c, (P.dop === 'n' ? 'donor levels (' + m.don + ')' : 'acceptor levels (' + m.acc + ')'), xr, yL + (P.dop === 'n' ? 20 : -22), { size: 11, color: C.muted, align: 'right' });
        }
        // carriers: energies above the band edge spread over about kT
        const kTs = res.kT * s;
        for (let i = 0; i < shownE; i++) { const q = els[i], y = yC - clamp(-Math.log(1 - 0.98 * q.u) * kTs, 2, th - 4); kit.dot(c, xl + q.x * bw, y, 3.4, C.accent); if (q.age < 0.6) { c.globalAlpha = 1 - q.age / 0.6; kit.dot(c, xl + q.x * bw, y, 9, C.hue(48, 0.6)); c.globalAlpha = 1; } }
        for (let i = 0; i < shownH; i++) { const q = hol[i], y = yV + clamp(-Math.log(1 - 0.98 * q.u) * kTs, 3, th - 4); c.strokeStyle = C.series[2]; c.lineWidth = 1.8; c.beginPath(); c.arc(xl + q.x * bw, y, 3.4, 0, TAU); c.stroke(); }
        // the Fermi level
        const yF = yV - res.EF * s;
        if (yF > 4 && yF < H - 4) { c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(xl, yF); c.lineTo(xr, yF); c.stroke(); c.setLineDash([]); kit.label(c, 'E_F', xl - 6, yF, { size: 12, weight: 700, color: C.warn, align: 'right' }); }
        kit.label(c, m.name + ' at ' + P.T.toFixed(0) + ' K  ·  kT = ' + (res.kT * 1000).toFixed(1) + ' meV', xl, 14, { size: 12, weight: 700 });
        if (res.n * vol > MAXD || res.p * vol > MAXD) kit.label(c, '(only ' + MAXD + ' of each drawn)', xr, 14, { size: 11, color: C.muted, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-pn */
  Hyper.sim('wim-pn', {
    title: 'A p–n junction: the step and the rectifier',
    blurb: `A silicon p–n junction drawn as its band edges across the crystal: p-type on the left, n-type on the right, and between them the depletion region, where the ionised impurities (− and +) make the [[?field]] that bends the bands into a step of height e(V_bi − V). Dots are electrons in the conduction band (the upper edge); rings are holes in the valence band (the lower edge — holes float upwards). Two flows cross the junction each way: carriers with enough thermal energy to get over the step (diffusion), and the rare minority carriers made near the junction that slide down it (drift). The dashed lines are the Fermi levels on the two sides; the graph is the current–voltage curve.

**Try this**
- At 0 V the flows balance: the few electrons that climb the step are matched by the few that slide down. No net current.
- Forward bias to 0.4, 0.5, 0.6 V: the step shrinks and the flow over it grows as e^{eV/kT} — each dot then stands for more and more carriers. Every 60 mV multiplies the current by ten; tick the log scale to see a straight line.
- Reverse bias: the step grows, nothing climbs it, and only the small sliding current −I₀ is left.
- Warm the junction: I₀ grows steeply (as nᵢ²), and the same forward voltage drives far more current.
- Change the doping: heavier doping gives a thinner depletion region and a larger built-in voltage.`,
    mount(box, kit) {
      const Si = SEMI.Si, EPS = 11.7 * 8.8541878128e-12, QE = 1.602176634e-19;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const plot = kit.plot(plotBox(box), { x: { label: 'applied voltage V (forward +)', min: -1, max: 0.8 }, y: { label: 'current I (mA)', min: -5, max: 60 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Applied voltage (forward +)', min: -1, max: 0.75, step: 0.01, value: 0, unit: 'V' },
        { id: 'N', type: 'select', label: 'Doping on each side', options: [['10¹⁵ per cm³', 1e15], ['10¹⁶ per cm³', 1e16], ['10¹⁷ per cm³', 1e17]], value: 1e16 },
        { id: 'T', label: 'Temperature', min: 250, max: 400, step: 5, value: 300, unit: 'K' },
        { id: 'log', type: 'check', label: 'Log scale for |I|', value: false }
      ], () => { calc(); curve(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['vbi', 'Built-in voltage V_bi'], ['bar', 'Step for electrons e(V_bi − V)'], ['w', 'Depletion width'], ['I', 'Current I₀(e^{eV/kT} − 1)'], ['I0', 'Saturation current I₀'], ['flow', 'Over the step : down the step'], ['dot', 'Each moving dot stands for']]);
      let S = null;
      const niOf = T => { const kT = KB_EV * T, sc = Math.pow(T / 300, 1.5); return Math.sqrt(Si.Nc * Si.Nv) * sc * Math.exp(-Si.Eg / (2 * kT)); };
      function calc() {
        const T = P.T, kT = KB_EV * T, ni = niOf(T), N = +P.N;
        const Vbi = kT * Math.log(N * N / (ni * ni)), I0 = 1e-12 * (1e16 / N) * Math.pow(ni / niOf(300), 2);
        const drop = Math.max(0.02, Vbi - P.V);
        const Wd = Math.sqrt(2 * EPS * drop * 2 / (QE * N * 1e6));
        S = { kT, ni, Vbi, I0, bar: drop, Wd, I: I0 * (Math.exp(P.V / kT) - 1), ECn: kT * Math.log(Si.Nc * Math.pow(T / 300, 1.5) / N), boost: Math.exp(P.V / kT) };
      }
      function curve() {
        const pts = [];
        for (let i = 0; i <= 175; i++) { const v = -1 + i * 0.01, I = S.I0 * (Math.exp(v / S.kT) - 1); pts.push([v, P.log ? Math.max(1e-18, Math.abs(I)) : clamp(I * 1e3, -5, 80)]); }
        const yNow = P.log ? clamp(Math.abs(S.I), 1e-16, 10) : clamp(S.I * 1e3, -5, 60);
        plot.set({ y: P.log ? { label: '|I| (A)', log: true, min: 1e-16, max: 10 } : { label: 'current I (mA)', min: -5, max: 60 },
          series: [{ pts, label: 'I = I₀(exp(eV/kT) − 1)' }], marks: [{ x: P.V, y: yNow, label: 'now' }] });
      }
      calc(); curve();
      // majority carriers, and the carriers crossing the junction
      const seaE = Array.from({ length: 26 }, () => ({ u: Math.random(), e: -Math.log(1 - 0.95 * Math.random()), v: 0 }));
      const seaH = Array.from({ length: 26 }, () => ({ u: Math.random(), e: -Math.log(1 - 0.95 * Math.random()), v: 0 }));
      let movers = [], acc = { ed: 0, eg: 0, hd: 0, hg: 0 };
      const G0 = 1.6;   // drawn events per second for each sliding flow at the unit scale
      const geo = () => {
        const W = st.W, H = st.H, s = H * 0.2, yCn = H * 0.45, yCp = yCn - S.bar * s, Eg = Si.Eg * s;
        const wd = clamp(S.Wd * 1e6 * 110, 16, W * 0.5), xJ = W / 2, xa = xJ - wd / 2, xb = xJ + wd / 2;
        const Ec = x => x <= xa ? yCp : x >= xb ? yCn : (u => yCp + (yCn - yCp) * (u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u)))((x - xa) / wd);
        return { W, H, s, yCn, yCp, Eg, wd, xJ, xa, xb, Ec, Ev: x => Ec(x) + Eg };
      };
      const loop = kit.loop(dt => {
        const g = geo(), C = kit.colors();
        const over = G0 * S.boost, scaleK = Math.max(0, Math.ceil(Math.log10(Math.max(1, (over + G0) / 25)))), unit = Math.pow(10, scaleK);
        // spawn the four flows
        const rate = { ed: over / unit, hd: over / unit, eg: G0 / unit, hg: G0 / unit };
        for (const k in rate) {
          acc[k] += rate[k] * dt;
          let made = 0;
          while (acc[k] >= 1 && made < 6) {
            acc[k] -= 1; made++;
            const R = Math.random();
            if (k === 'ed') movers.push({ k, xs: g.xb + 8 + R * Math.max(10, g.W - 20 - g.xb - 8), xe: g.xa - 8 - Math.random() * Math.min(90, g.xa - 30), f: 0 });
            if (k === 'eg') movers.push({ k, xs: g.xa - 4 - R * 40, xe: g.xb + 16 + Math.random() * 60, f: 0 });
            if (k === 'hd') movers.push({ k, xs: 20 + R * Math.max(10, g.xa - 28), xe: g.xb + 8 + Math.random() * Math.min(90, g.W - g.xb - 30), f: 0 });
            if (k === 'hg') movers.push({ k, xs: g.xb + 4 + R * 40, xe: g.xa - 16 - Math.random() * 60, f: 0 });
          }
          if (acc[k] > 3) acc[k] = 0;
        }
        if (movers.length > 160) movers = movers.slice(-160);
        for (const m of movers) m.f += dt / 1.8;
        movers = movers.filter(m => m.f < 1.3);
        for (const q of seaE.concat(seaH)) { q.v = clamp(q.v + (Math.random() - 0.5) * 0.8 * dt, -0.15, 0.15); q.u = (q.u + q.v * dt + 1) % 1; if (Math.random() < dt * 0.4) q.e = -Math.log(1 - 0.95 * Math.random()); }
        // read-outs
        ro.set('vbi', S.Vbi.toFixed(3) + ' V');
        ro.set('bar', S.Vbi - P.V < 0.02 ? 'almost gone: the bands are flat' : (S.Vbi - P.V).toFixed(3) + ' eV = ' + ((S.Vbi - P.V) / S.kT).toFixed(1) + ' kT');
        ro.set('w', (S.Wd * 1e6).toFixed(3) + ' µm');
        ro.set('I', kit.eng(S.I, 'A'));
        ro.set('I0', kit.eng(S.I0, 'A'));
        ro.set('flow', sci(S.boost, 3) + ' : 1');
        ro.set('dot', unit === 1 ? 'one unit of flow' : sci(unit) + ' units of flow');
        // drawing
        const c = st.begin(), W = g.W, H = g.H;
        c.fillStyle = C.hue(0, 0.06); c.fillRect(0, 0, g.xa, H);
        c.fillStyle = C.hue(210, 0.06); c.fillRect(g.xb, 0, W - g.xb, H);
        c.fillStyle = C.hue(48, 0.12); c.fillRect(g.xa, 0, g.wd, H);
        kit.label(c, 'p-type', 12, 14, { size: 12, weight: 700 }); kit.label(c, 'n-type', W - 12, 14, { size: 12, weight: 700, align: 'right' });
        kit.label(c, 'depletion region', g.xJ, H - 8, { size: 11, color: C.muted, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 2.2;
        const edge = f => { c.beginPath(); for (let x = 6; x <= W - 6; x += 3) { const y = f(x); if (x === 6) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); };
        edge(g.Ec); edge(g.Ev);
        kit.label(c, 'E_c', 8, g.yCp - 10, { size: 11, color: C.muted }); kit.label(c, 'E_v', 8, g.yCp + g.Eg + 12, { size: 11, color: C.muted });
        // the step and the Fermi levels
        const yFn = g.yCn + S.ECn * g.s, yFp = yFn + P.V * g.s;
        c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(g.xb, yFn); c.lineTo(W - 6, yFn); c.moveTo(6, yFp); c.lineTo(g.xa, yFp); c.stroke(); c.setLineDash([]);
        kit.label(c, 'E_F', W - 8, yFn + 10, { size: 11, color: C.warn, align: 'right', weight: 700 }); kit.label(c, 'E_F', 8, yFp + 10, { size: 11, color: C.warn, weight: 700 });
        if (Math.abs(P.V) > 0.03) { const xq = g.xJ, y1 = Math.min(yFn, yFp), y2 = Math.max(yFn, yFp); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(xq, y1); c.lineTo(xq, y2); c.stroke(); kit.label(c, 'eV', xq + 5, (y1 + y2) / 2, { size: 11, color: C.warn }); }
        if (S.Vbi - P.V > 0.05) { const xs = g.xb + 30; kit.arrow(c, xs, g.yCn, xs, g.yCp + 2, C.muted, 1.2, 6); kit.label(c, 'step ' + (S.Vbi - P.V).toFixed(2) + ' eV', xs + 6, (g.yCn + g.yCp) / 2, { size: 11, color: C.muted }); }
        // fixed ions in the depletion region
        const nI = Math.max(1, Math.floor(g.wd / 12)), yI = H * 0.86;
        for (let i = 0; i < nI; i++) { const x = g.xa + (i + 0.5) * g.wd / nI; kit.label(c, x < g.xJ ? '−' : '+', x, yI, { size: 13, weight: 700, color: x < g.xJ ? C.series[2] : C.series[1], align: 'center' }); }
        // the seas of majority carriers
        const kTs = S.kT * g.s;
        for (const q of seaE) { const x = g.xb + 6 + q.u * (W - 12 - g.xb - 6); kit.dot(c, x, g.yCn - 3 - Math.min(5, q.e) * kTs, 3, C.accent); }
        for (const q of seaH) { const x = 6 + q.u * (g.xa - 12); c.strokeStyle = C.series[2]; c.lineWidth = 1.6; c.beginPath(); c.arc(x, g.Ev(x) + 3 + Math.min(5, q.e) * kTs, 3, 0, TAU); c.stroke(); }
        // carriers crossing
        for (const m of movers) {
          const f = Math.min(1, m.f), x = m.xs + (m.xe - m.xs) * f, fade = m.f > 1 ? 1 - (m.f - 1) / 0.3 : 1;
          let y;
          if (m.k === 'ed') y = g.yCp - 3; else if (m.k === 'eg') y = g.Ec(x) - 3; else if (m.k === 'hd') y = g.yCn + g.Eg + 3; else y = g.Ev(x) + 3;
          c.globalAlpha = clamp(fade, 0, 1);
          if (m.k[0] === 'e') kit.dot(c, x, y, 3.4, m.k === 'ed' ? C.accent : C.ok);
          else { c.strokeStyle = m.k === 'hd' ? C.series[2] : C.ok; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 3.4, 0, TAU); c.stroke(); }
          if (m.f > 1 && m.k[1] === 'd') kit.dot(c, x, y, 3 + 10 * (m.f - 1), C.hue(48, 0.35));
          c.globalAlpha = 1;
        }
        kit.label(c, '● electrons  ○ holes  (green: made near the junction, sliding down the step)', W / 2, H * 0.94 - 14, { size: 10.5, color: C.muted, align: 'center' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-schrodinger */
  Hyper.sim('wim-schrodinger', {
    title: 'The Schrödinger equation, solved live',
    blurb: `The Schrödinger equation iħ ∂ψ/∂t = −(ħ²/2m) ∂²ψ/∂x² + Vψ solved on a line of 600 points as you watch, for an electron in a box 12 nm wide (the Crank–Nicolson method, which keeps the total [[?probability]] exactly 1). The grey shape is the potential V(x) and the dashed line the packet's average energy. On that line sit the [[?wave-function|wave function]]'s real part (solid) and imaginary part (dashed), and the [[?probability-density|probability density]] |ψ|² (filled).

**Try this**
- Free packet: the real and imaginary parts chase each other inside the smooth hump of |ψ|² — the wiggles move at half the speed of the hump. The packet spreads as it goes, and bounces off the wall.
- A step lower than the packet's energy (1.5 eV under 2 eV): part of the packet is reflected all the same. Raise the step above the energy: all of it returns, but ψ pokes a little way into the step first.
- A barrier 0.3 nm wide and higher than the energy: part of the packet tunnels through. Widen it and the transmitted part collapses.
- A harmonic well: the packet swings like a ball on a spring. Set its width σ to the ground-state width in the readout and it keeps its shape as it swings; make it narrower and it breathes.
- Raise the energy and count the wiggles: shorter wavelength, more kinetic energy.`,
    mount(box, kit) {
      const Q = kit.qm, N = 600, L = 120, XM = 60;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'pot', type: 'select', label: 'Potential', options: [['Free (a box 12 nm wide)', 'box'], ['A step', 'step'], ['A barrier', 'barrier'], ['A harmonic well', 'harm']], value: 'step' },
        { id: 'E', label: 'Energy of the packet', min: 0.2, max: 8, step: 0.1, value: 2, unit: 'eV' },
        { id: 'V0', label: 'Height of the step or barrier', min: 0, max: 8, step: 0.1, value: 1.5, unit: 'eV' },
        { id: 'a', label: 'Width of the barrier', min: 0.1, max: 1.5, step: 0.05, value: 0.3, unit: 'nm' },
        { id: 'hw', label: 'Harmonic well: ħω', min: 0.1, max: 1, step: 0.05, value: 0.3, unit: 'eV' },
        { id: 'sig', label: 'Width of the packet σ', min: 0.2, max: 1.5, step: 0.02, value: 0.6, unit: 'nm' },
        { id: 'parts', type: 'check', label: 'Show the real and imaginary parts', value: true },
        { id: 'speed', label: 'Speed', min: 0.2, max: 3, step: 0.1, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], id => { if (id === 'pause') { run = !run; return; } if (id !== 'speed' && id !== 'parts') reset(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['x', 'Average position ⟨x⟩'], ['E', 'Average energy ⟨E⟩'], ['lam', 'Wavelength 2π/k₀'], ['n', 'Total probability'], ['b', 'Probability beyond x = 6 nm'], ['t', 'Time']]);
      let w = null, t = 0, run = true, amp0 = 1, p0 = 1, rate = 10, omega = 0;
      const Vf = x => {
        if (P.pot === 'step') return x > XM ? P.V0 / EU : 0;
        if (P.pot === 'barrier') return x >= XM && x < XM + P.a * 10 ? P.V0 / EU : 0;
        if (P.pot === 'harm') return 0.5 * omega * omega * (x - XM) * (x - XM);
        return 0;
      };
      function reset() {
        omega = P.hw / EU;
        const harm = P.pot === 'harm', k0 = harm ? 0 : Math.sqrt(2 * P.E / EU);
        const x0 = harm ? XM - Math.min(45, Math.sqrt(2 * P.E / EU) / omega) : 30;
        let vmax = P.E / EU; for (let i = 0; i <= 60; i++) vmax = Math.max(vmax, Vf(L * i / 60));
        const dt = clamp(0.25 / Math.max(vmax, 0.05), 0.005, 0.1);
        w = Q.wave1d({ N, L, V: Vf, dt }).setGaussian({ x0, sigma: P.sig * 10, k0 });
        rate = harm ? (TAU / omega) / 4 : 22 / Math.max(k0, 0.4);
        t = 0; amp0 = 1e-9; p0 = 1e-9;
        for (let j = 0; j < N; j++) { amp0 = Math.max(amp0, Math.abs(w.re[j]), Math.abs(w.im[j])); p0 = Math.max(p0, w.re[j] * w.re[j] + w.im[j] * w.im[j]); }
        ctl.show('V0', P.pot === 'step' || P.pot === 'barrier'); ctl.show('a', P.pot === 'barrier'); ctl.show('hw', harm);
      }
      reset();
      const energy = () => {
        let T = 0, U = 0; const dx = w.dx;
        for (let j = 0; j < N; j++) {
          const pr = j + 1 < N ? w.re[j + 1] : 0, pi = j + 1 < N ? w.im[j + 1] : 0;
          T += ((pr - w.re[j]) * (pr - w.re[j]) + (pi - w.im[j]) * (pi - w.im[j])) / dx;
          U += w.V[j] * (w.re[j] * w.re[j] + w.im[j] * w.im[j]) * dx;
        }
        return 0.5 * T + U;
      };
      const loop = kit.loop(dt => {
        if (run && dt > 0) { const adv = dt * rate * P.speed, n = Math.max(1, Math.round(adv / w.dt)); w.step(Math.min(n, 400)); t += Math.min(n, 400) * w.dt; }
        const nrm = w.norm(), xm = w.mean(), E = energy() * EU;
        let beyond = 0; for (let j = 0; j < N; j++) if (w.x[j] > XM) beyond += (w.re[j] * w.re[j] + w.im[j] * w.im[j]) * w.dx;
        ro.set('x', (xm / 10).toFixed(2) + ' nm'); ro.set('E', E.toFixed(2) + ' eV');
        ro.set('lam', P.pot === 'harm' ? 'starts at rest · ground-state width ' + (Math.sqrt(1 / (2 * omega)) / 10).toFixed(2) + ' nm' : (TAU / Math.sqrt(2 * P.E / EU) / 10).toFixed(2) + ' nm');
        ro.set('n', nrm.toFixed(4)); ro.set('b', P.pot === 'box' || P.pot === 'harm' ? '—' : beyond.toFixed(3)); ro.set('t', (t * TU).toFixed(1) + ' fs');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, xl = 26, xr = W - 16, yB = H - 28, X = x => xl + (xr - xl) * x / L;
        const eTop = Math.max(P.E, P.pot === 'step' || P.pot === 'barrier' ? P.V0 : 0, 0.5) * 1.35, sE = (H - 60) / eTop, yE = yB - E * sE;
        c.fillStyle = C.hue(220, 0.16); c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(X(0), yB);
        for (let i = 0; i <= 300; i++) { const x = L * i / 300; c.lineTo(X(x), Math.max(8, yB - Vf(x) * EU * sE)); }
        c.lineTo(X(L), yB); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.text; c.fillRect(xl - 4, 8, 4, yB - 8); c.fillRect(xr, 8, 4, yB - 8);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xl, yB); c.lineTo(xr, yB); c.stroke();
        for (let nm = 0; nm <= 12; nm += 2) kit.label(c, nm + ' nm', X(nm * 10), yB + 12, { size: 10, color: C.faint, align: 'center' });
        c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(xl, yE); c.lineTo(xr, yE); c.stroke(); c.setLineDash([]);
        kit.label(c, '⟨E⟩ = ' + E.toFixed(2) + ' eV', xr - 4, yE - 9, { size: 11, color: C.warn, align: 'right' });
        const sp = Math.min(H * 0.34, yE - 12) / p0, sa = Math.min(H * 0.2, yE - 12) / amp0, step = Math.max(1, Math.floor(N / 400));
        c.fillStyle = C.hue(160, 0.28); c.beginPath(); c.moveTo(X(w.x[0]), yE);
        for (let j = 0; j < N; j += step) c.lineTo(X(w.x[j]), yE - sp * (w.re[j] * w.re[j] + w.im[j] * w.im[j]));
        c.lineTo(X(w.x[N - 1]), yE); c.closePath(); c.fill();
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath();
        for (let j = 0; j < N; j += step) { const y = yE - sp * (w.re[j] * w.re[j] + w.im[j] * w.im[j]); if (j === 0) c.moveTo(X(w.x[j]), y); else c.lineTo(X(w.x[j]), y); }
        c.stroke();
        if (P.parts) {
          c.lineWidth = 1.4; c.strokeStyle = C.series[0]; c.beginPath();
          for (let j = 0; j < N; j++) { const y = yE - sa * w.re[j]; if (j === 0) c.moveTo(X(w.x[j]), y); else c.lineTo(X(w.x[j]), y); }
          c.stroke(); c.setLineDash([4, 3]); c.strokeStyle = C.series[1]; c.beginPath();
          for (let j = 0; j < N; j++) { const y = yE - sa * w.im[j]; if (j === 0) c.moveTo(X(w.x[j]), y); else c.lineTo(X(w.x[j]), y); }
          c.stroke(); c.setLineDash([]);
        }
        kit.label(c, 'V(x)', X(P.pot === 'harm' ? 100 : 110), Math.max(18, yB - Vf(L * 0.92) * EU * sE - 10), { size: 11, color: C.muted, align: 'center' });
        kit.label(c, '|ψ|²' + (P.parts ? '  ·  Re ψ (solid), Im ψ (dashed)' : ''), xl + 6, 16, { size: 11, color: C.muted });
        if (!run) kit.label(c, 'paused', xr - 4, 16, { size: 11, color: C.warn, align: 'right', weight: 700 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-stationary */
  Hyper.sim('wim-stationary', {
    title: 'Stationary states: the energies that fit',
    blurb: `The stationary states of an electron in four kinds of well, found by solving −(ħ²/2m)φ″ + Vφ = Eφ numerically (the energies are its [[?eigenvalue|eigenvalues]]). Each level is drawn at its energy, across the region where the electron is classically allowed; the chosen state's wave function sits on its level. Tick the superposition and the density |ψ|² of states n and n + 1 together sloshes back and forth with the period h/ΔE.

**Try this**
- The 2 nm box: the energies grow as n², and each state has one more node than the one below. Compare with h²n²/8mL² (dashed curves, exact).
- The harmonic well: the levels are equally spaced by ħω, starting at ħω/2 above the bottom. The dashed curves are the exact Hermite functions.
- The finite well: only a few states are bound, and each wave function leaks into the walls — the lower the level, the less it leaks. Make the well shallower and count the bound states.
- The double well: the levels come in close pairs. Superpose the lowest two and the electron moves from one well to the other and back — the ammonia molecule's flip. Widen the barrier and the pairs close up and the flip slows dramatically.`,
    mount(box, kit) {
      const Q = kit.qm, NP = 500, COUNT = 9;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'pot', type: 'select', label: 'Well', options: [['Infinite square well, 2 nm wide', 'box'], ['Harmonic well', 'harm'], ['Finite square well, 1 nm wide', 'finite'], ['Double well: two 1 nm wells', 'double']], value: 'box' },
        { id: 'V0', label: 'Depth of the finite wells', min: 0.5, max: 5, step: 0.1, value: 2, unit: 'eV' },
        { id: 'hw', label: 'Harmonic well: ħω', min: 0.1, max: 0.8, step: 0.05, value: 0.3, unit: 'eV' },
        { id: 'gap', label: 'Double well: barrier between', min: 0.1, max: 1, step: 0.05, value: 0.3, unit: 'nm' },
        { id: 'n', label: 'State n (0 = the lowest)', min: 0, max: 7, step: 1, value: 0 },
        { id: 'mix', type: 'check', label: 'Superpose with state n + 1', value: false },
        { id: 'exact', type: 'check', label: 'Show the exact formula (box, harmonic)', value: true }
      ], id => { if (id === 'pot' || id === 'V0' || id === 'hw' || id === 'gap') solve(); t = 0; });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Energy of state n'], ['ex', 'Exact formula'], ['nodes', 'Nodes'], ['dE', 'Gap to state n + 1'], ['T', 'Sloshing period h/ΔE'], ['b', 'Bound states']]);
      let S = null, t = 0;
      function solve() {
        const pot = P.pot, V0 = P.V0 / EU, om = P.hw / EU;
        let L = 20, V = () => 0, xc = 10;
        if (pot === 'harm') { L = clamp(2.6 * Math.sqrt(17 / om), 40, 200); xc = L / 2; V = x => 0.5 * om * om * (x - xc) * (x - xc); }
        if (pot === 'finite') { L = 60; xc = 30; V = x => Math.abs(x - xc) <= 5 ? 0 : V0; }
        if (pot === 'double') { L = 60; xc = 30; const g = P.gap * 10, inW = x => { const d = Math.abs(x - xc); return d >= g / 2 && d <= g / 2 + 10; }; V = x => inW(x) ? 0 : V0; }
        const r = Q.eigen1d(V, { N: NP, L, count: COUNT });
        let bound = r.E.length;
        if (pot === 'finite' || pot === 'double') bound = r.E.filter(e => e < V0).length;
        S = { r, V, L, xc, om, V0, bound, pot };
        ctl.show('V0', pot === 'finite' || pot === 'double'); ctl.show('hw', pot === 'harm'); ctl.show('gap', pot === 'double');
      }
      solve();
      const exactE = i => S.pot === 'box' ? (i + 1) * (i + 1) * Math.PI * Math.PI / (2 * S.L * S.L) : S.pot === 'harm' ? (i + 0.5) * S.om : NaN;
      const exactPsi = (i, x) => {
        if (S.pot === 'box') return Math.sqrt(2 / S.L) * Math.sin((i + 1) * Math.PI * x / S.L);
        const q = Math.pow(S.om, 0.25), xi = Math.sqrt(S.om) * (x - S.xc);
        return (i % 2 ? -1 : 1) * q * Q.oscillatorPsi(i, xi);
      };
      const loop = kit.loop(dt => {
        const { r, V, L } = S, top = S.pot === 'finite' || S.pot === 'double' ? Math.max(0, S.bound - 1) : COUNT - 2;
        const n = Math.min(P.n, top), m = n + 1, mix = P.mix && m < r.E.length;
        const En = r.E[n], Em = r.E[Math.min(m, r.E.length - 1)], dE = Em - En;
        const period = dE > 1e-12 ? TAU / dE : Infinity;   // natural time units
        t += dt;
        const phase = Number.isFinite(period) ? TAU * t / 3 : 0;   // one slosh every 3 s on the screen
        ro.set('E', (En * EU).toFixed(3) + ' eV' + (P.n > top ? ' (only ' + (top + 1) + ' available)' : ''));
        const ex = exactE(n); ro.set('ex', Number.isFinite(ex) ? (ex * EU).toFixed(3) + ' eV' : 'no simple formula');
        ro.set('nodes', String(n)); ro.set('dE', m < r.E.length ? (dE * EU).toFixed(4) + ' eV' : '—');
        ro.set('T', Number.isFinite(period) && m < r.E.length ? sci(period * TU) + ' fs (shown as 3 s)' : '—');
        ro.set('b', S.pot === 'finite' || S.pot === 'double' ? S.bound + ' below the rim at ' + P.V0.toFixed(1) + ' eV' : 'all of them (walls with no top)');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, xl = 30, xr = W - 20, yB = H - 26;
        const X = x => xl + (xr - xl) * x / L;
        const Etop = S.pot === 'finite' || S.pot === 'double' ? S.V0 * 1.25 : r.E[Math.min(COUNT - 1, r.E.length - 1)] * 1.08;
        const sE = (yB - 20) / Etop, Y = e => yB - e * sE;
        c.fillStyle = C.hue(220, 0.14); c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(X(0), yB);
        for (let i = 0; i <= 400; i++) { const x = L * i / 400; c.lineTo(X(x), Math.max(6, Y(V(x)))); }
        c.lineTo(X(L), yB); c.closePath(); c.fill(); c.stroke();
        if (S.pot === 'box') { c.fillStyle = C.text; c.fillRect(xl - 5, 6, 5, yB - 6); c.fillRect(xr, 6, 5, yB - 6); }
        const levels = S.pot === 'finite' || S.pot === 'double' ? S.bound : COUNT - 1;
        let minGap = Infinity; for (let i = 0; i + 1 < levels; i++) minGap = Math.min(minGap, r.E[i + 1] - r.E[i]);
        if (!Number.isFinite(minGap)) minGap = Etop * 0.3;
        const ampPx = clamp(Math.max(minGap * sE * 0.45, 14), 14, H * 0.18);
        for (let i = 0; i < levels; i++) {
          const y = Y(r.E[i]); let a = -1, b = -1;
          for (let j = 0; j < NP; j++) if (V(r.x[j]) <= r.E[i]) { if (a < 0) a = j; b = j; }
          c.strokeStyle = i === n || (mix && i === m) ? C.warn : C.faint; c.lineWidth = i === n ? 1.8 : 1;
          c.beginPath(); c.moveTo(X(a >= 0 ? r.x[a] : 0), y); c.lineTo(X(b >= 0 ? r.x[b] : L), y); c.stroke();
          kit.label(c, 'n = ' + i, xl + 4, y - 7, { size: 10, color: i === n ? C.warn : C.faint });
        }
        const pmax = r.psi[n].reduce((s, v) => Math.max(s, Math.abs(v)), 1e-9);
        if (!mix) {
          const y0 = Y(En), k = ampPx / pmax;
          c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
          for (let j = 0; j < NP; j++) { const y = y0 - k * r.psi[n][j]; if (j === 0) c.moveTo(X(r.x[j]), y); else c.lineTo(X(r.x[j]), y); }
          c.stroke();
          if (P.exact && (S.pot === 'box' || S.pot === 'harm')) {
            c.strokeStyle = C.series[1]; c.setLineDash([5, 4]); c.lineWidth = 1.5; c.beginPath();
            for (let j = 0; j < NP; j += 3) { const y = y0 - k * exactPsi(n, r.x[j]); if (j === 0) c.moveTo(X(r.x[j]), y); else c.lineTo(X(r.x[j]), y); }
            c.stroke(); c.setLineDash([]);
          }
          kit.label(c, 'φ' + '₀₁₂₃₄₅₆₇₈'[n] + '(x)', X(r.x[NP - 1]) - 4, y0 - 12, { size: 12, color: C.accent, align: 'right', weight: 700 });
        } else {
          const y0 = Y((En + Em) / 2), pm = r.psi[m], ps = r.psi[n];
          let top2 = 1e-12; const dens = new Float64Array(NP);
          for (let j = 0; j < NP; j++) { dens[j] = 0.5 * (ps[j] * ps[j] + pm[j] * pm[j] + 2 * ps[j] * pm[j] * Math.cos(phase)); }
          for (let j = 0; j < NP; j++) top2 = Math.max(top2, 0.5 * Math.pow(Math.abs(ps[j]) + Math.abs(pm[j]), 2));
          const k2 = ampPx * 1.8 / top2;
          c.fillStyle = C.hue(160, 0.3); c.beginPath(); c.moveTo(X(r.x[0]), y0);
          for (let j = 0; j < NP; j++) c.lineTo(X(r.x[j]), y0 - k2 * dens[j]);
          c.lineTo(X(r.x[NP - 1]), y0); c.closePath(); c.fill();
          c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath();
          for (let j = 0; j < NP; j++) { const y = y0 - k2 * dens[j]; if (j === 0) c.moveTo(X(r.x[j]), y); else c.lineTo(X(r.x[j]), y); }
          c.stroke();
          kit.label(c, '|ψ|² of states ' + n + ' and ' + m + ' together', X(r.x[NP - 1]) - 4, y0 - k2 * 0.1 * top2 - 14, { size: 11, color: C.ok, align: 'right' });
        }
        kit.label(c, 'V(x)', xr - 6, Math.max(14, Y(V(L * 0.98)) + 12), { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'energy ↑', 6, 12, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-tunnel */
  Hyper.sim('wim-tunnel', {
    title: 'Tunnelling: a packet at a barrier',
    blurb: `An electron wave packet (solved with the Schrödinger equation, as in the previous simulation) is sent at a square barrier. It splits into a reflected and a transmitted packet; when they have separated, the probability found beyond the barrier is the chance that a detector there would click. The graph shows the exact transmission T(E) of a plane wave through this barrier (from the formula on this page), the spread of energies in the packet, and three numbers to compare: T at the packet's central energy, T averaged over the packet's energies, and what the packet actually did. Where the transmitted part is too faint to see it is magnified, and the factor is shown.

**Try this**
- Energy 2 eV, barrier 3 eV high and 0.3 nm wide: about a sixth gets through. Make the barrier 0.5 nm, then 0.7 nm: each extra step in width divides T at the central energy by the same factor — an [[?exponential]] fall. Tick the log scale to see the straight line.
- Make the barrier wide (1.5 nm): now the few fast components of the packet that pass *over* the top outnumber those that tunnel, and the packet average rises far above T(E₀).
- Raise the energy above the top of the barrier: the transmission is high but not 1, and it wobbles — resonances where a whole number of half-wavelengths fits across the barrier.
- Make the packet narrow (0.3 nm): its energies spread widely, so the measured T follows the packet average, not T at the centre.
- Compare "measured" with "averaged over the packet": they agree — the packet is just a superposition of plane waves, each tunnelling on its own.`,
    mount(box, kit) {
      const Q = kit.qm, N = 1000, L = 200, XB = 100;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const plot = kit.plot(plotBox(box), { x: { label: 'energy E (eV)', min: 0, max: 10 }, y: { label: 'transmission T', min: 0, max: 1.05 }, legend: true }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'V0', label: 'Height of the barrier', min: 0.5, max: 8, step: 0.1, value: 3, unit: 'eV' },
        { id: 'a', label: 'Width of the barrier', min: 0.1, max: 1.5, step: 0.05, value: 0.3, unit: 'nm' },
        { id: 'E', label: 'Central energy of the packet', min: 0.2, max: 10, step: 0.1, value: 2, unit: 'eV' },
        { id: 'sig', label: 'Width of the packet σ', min: 0.3, max: 0.75, step: 0.05, value: 0.6, unit: 'nm' },
        { id: 'log', type: 'check', label: 'Log scale for T', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Send a packet', primary: true }] }
      ], id => { if (id === 'log') { curve(); return; } reset(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['kap', 'Decay length 1/κ in the barrier'], ['T0', 'T at the central energy'], ['Tav', 'T averaged over the packet'], ['Tm', 'Measured: probability beyond'], ['R', 'Reflected'], ['s', 'Status']]);
      let w = null, t = 0, tEnd = 0, done = false, Tm = NaN, rate = 20, x0 = 30, k0 = 1;
      const Tof = Eev => Q.barrierT({ E: Eev / EU, V0: P.V0 / EU, a: P.a * 10 });
      function packetAverage() {
        const sk = 1 / (2 * P.sig * 10); let s = 0, sw = 0;
        for (let i = -60; i <= 60; i++) { const k = k0 + sk * 5 * i / 60; if (k <= 0) continue; const wt = Math.exp(-Math.pow(k - k0, 2) / (2 * sk * sk)); s += wt * Q.barrierT({ E: k * k / 2, V0: P.V0 / EU, a: P.a * 10 }); sw += wt; }
        return sw > 0 ? s / sw : 0;
      }
      function curve() {
        const pts = [], dist = [], sk = 1 / (2 * P.sig * 10);
        for (let i = 1; i <= 300; i++) { const Ev = 10 * i / 300, T = Tof(Ev); pts.push([Ev, P.log ? Math.max(1e-12, T) : T]); }
        for (let i = 1; i <= 200; i++) { const Ev = 10 * i / 200, k = Math.sqrt(2 * Ev / EU), wt = Math.exp(-Math.pow(k - k0, 2) / (2 * sk * sk)); dist.push([Ev, P.log ? Math.max(1e-12, wt) : wt]); }
        const Tc = Tof(P.E), Ta = packetAverage(), marks = [{ x: P.E, y: P.log ? Math.max(1e-12, Tc) : Tc, label: 'T(E₀)' }];
        if (done && Number.isFinite(Tm)) marks.push({ x: P.E, y: P.log ? Math.max(1e-12, Tm) : Tm, label: 'measured' });
        plot.set({ y: P.log ? { label: 'transmission T', log: true, min: 1e-10, max: 2 } : { label: 'transmission T', min: 0, max: 1.05 },
          series: [{ pts, label: 'T(E) for a plane wave' }, { pts: dist, label: 'energies in the packet (relative)', dash: [4, 3], width: 1.4, fill: !P.log }],
          vlines: [{ x: P.V0, label: 'top of the barrier' }], hlines: [{ y: P.log ? Math.max(1e-12, Ta) : Ta, label: 'packet average ' + (Ta < 1e-3 ? sci(Ta, 2) : Ta.toFixed(3)) }], marks });
      }
      function reset() {
        const sg = P.sig * 10; k0 = Math.sqrt(2 * P.E / EU); x0 = XB - 6.3 * sg - 3;   // tails clear of the barrier and the wall
        const Vf = x => x >= XB && x < XB + P.a * 10 ? P.V0 / EU : 0;
        const dt = clamp(0.25 / Math.max(P.E / EU, P.V0 / EU), 0.004, 0.08);
        w = Q.wave1d({ N, L, V: Vf, dt }).setGaussian({ x0, sigma: sg, k0 });
        rate = 30 / Math.max(k0, 0.3); t = 0; done = false; Tm = NaN;
        tEnd = (XB + P.a * 10 + 3 * sg + 18 - x0) / Math.max(k0, 0.05);
        curve();
      }
      reset();
      const loop = kit.loop(dt => {
        if (!done && dt > 0) {
          const n = clamp(Math.round(dt * rate / w.dt), 1, 400); w.step(n); t += n * w.dt;
        }
        const xb2 = XB + P.a * 10;
        let pT = 0, pR = 0, pB = 0, pmL = 1e-12, pmR = 1e-15;
        for (let j = 0; j < N; j++) { const p = w.re[j] * w.re[j] + w.im[j] * w.im[j], x = w.x[j]; if (x >= xb2) { pT += p * w.dx; pmR = Math.max(pmR, p); } else if (x < XB) { pR += p * w.dx; pmL = Math.max(pmL, p); } else pB += p * w.dx; }
        // measure once the packet has passed and (almost) nothing is left inside the barrier
        if (!done && t >= tEnd && (pB <= 0.01 * pT + 1e-14 || t >= 1.8 * tEnd)) { done = true; Tm = pT; curve(); }
        const kap = P.E < P.V0 ? Math.sqrt(2 * (P.V0 - P.E) / EU) : 0;
        ro.set('kap', kap > 0 ? (0.1 / kap).toFixed(3) + ' nm (κ = ' + (10 * kap).toFixed(2) + ' nm⁻¹)' : 'above the top: no decay');
        const Tc = Tof(P.E), Ta = packetAverage();
        ro.set('T0', Tc < 1e-3 ? sci(Tc, 3) : Tc.toFixed(4)); ro.set('Tav', Ta < 1e-3 ? sci(Ta, 3) : Ta.toFixed(4));
        ro.set('Tm', done ? (Tm < 1e-3 ? sci(Tm, 3) : Tm.toFixed(4)) : 'now ' + (pT < 1e-3 ? sci(pT, 2) : pT.toFixed(4)));
        ro.set('R', pR.toFixed(4));
        ro.set('s', done ? 'done — press Send again' : (t >= tEnd ? 'waiting for the slow part still in the barrier' : 'packet on its way') + ' (' + (t * TU).toFixed(1) + ' fs)');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, xl = 20, xr = W - 20, yB = H - 24, X = x => xl + (xr - xl) * x / L;
        const eTop = Math.max(P.E, P.V0) * 1.3, sE = (H - 50) / eTop, yE = yB - P.E * sE;
        c.fillStyle = C.hue(220, 0.2); c.fillRect(X(XB), yB - P.V0 * sE, Math.max(2, X(xb2) - X(XB)), P.V0 * sE);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(X(XB), yB - P.V0 * sE, Math.max(2, X(xb2) - X(XB)), P.V0 * sE);
        c.strokeStyle = C.axis || C.muted; c.beginPath(); c.moveTo(xl, yB); c.lineTo(xr, yB); c.stroke();
        c.strokeStyle = C.warn; c.setLineDash([6, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(xl, yE); c.lineTo(xr, yE); c.stroke(); c.setLineDash([]);
        kit.label(c, 'E₀ = ' + P.E.toFixed(1) + ' eV', xl + 4, yE - 9, { size: 11, color: C.warn });
        kit.label(c, 'V₀ = ' + P.V0.toFixed(1) + ' eV', X(xb2) + 6, yB - P.V0 * sE + 10, { size: 11, color: C.muted });
        const sp = Math.min(H * 0.4, yE - 10) / pmL;
        let mag = 1; if (pmR * 1e3 < pmL) mag = Math.pow(10, Math.floor(Math.log10(0.4 * pmL / pmR)));
        mag = clamp(mag, 1, 1e10);
        const drawPart = (from, to, k, col, fill) => {
          c.beginPath(); let first = true;
          for (let j = 0; j < N; j += 2) { const x = w.x[j]; if (x < from || x >= to) continue; const y = yE - Math.min(yE - 4, k * (w.re[j] * w.re[j] + w.im[j] * w.im[j])); if (first) { c.moveTo(X(x), yE); c.lineTo(X(x), y); first = false; } else c.lineTo(X(x), y); }
          if (!first) { c.lineTo(X(Math.min(to, L)), yE); c.fillStyle = fill; c.fill(); c.strokeStyle = col; c.lineWidth = 1.8; c.stroke(); }
        };
        drawPart(0, xb2, sp, C.ok, C.hue(160, 0.25));
        drawPart(xb2, L, sp * mag, C.accent, C.hue(28, 0.22));
        if (mag > 1) kit.label(c, 'transmitted part × ' + sci(mag, 1), X(xb2) + 8, 16, { size: 11, color: C.accent, weight: 700 });
        kit.label(c, 'source', X(4), yB + 12, { size: 10, color: C.faint }); kit.label(c, 'detector →', xr, yB + 12, { size: 10, color: C.faint, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ angular momentum and hydrogen helpers */
  // associated Legendre function P_l^m(x) for m ≥ 0 (Condon–Shortley phase), by the standard recurrence
  function legendre(l, m, x) {
    let pmm = 1;
    if (m > 0) { const s = Math.sqrt(Math.max(0, 1 - x * x)); let f = 1; for (let i = 1; i <= m; i++) { pmm *= -f * s; f += 2; } }
    if (l === m) return pmm;
    let pm1 = x * (2 * m + 1) * pmm;
    if (l === m + 1) return pm1;
    let pl = 0;
    for (let ll = m + 2; ll <= l; ll++) { pl = ((2 * ll - 1) * x * pm1 - (ll + m - 1) * pmm) / (ll - m); pmm = pm1; pm1 = pl; }
    return pl;
  }
  // a table for drawing samples from a non-negative function on [lo, hi]
  function cdf(f, lo, hi, n) {
    const xs = [], cs = []; let s = 0;
    for (let i = 0; i <= n; i++) { const x = lo + (hi - lo) * i / n; s += Math.max(0, f(x)); xs.push(x); cs.push(s); }
    return { xs, cs, s, draw(u) { const v = u * s; let a = 0, b = n; while (a < b) { const m = (a + b) >> 1; if (cs[m] < v) a = m + 1; else b = m; } const x0 = xs[Math.max(0, a - 1)], x1 = xs[a]; return x0 + (x1 - x0) * Math.random(); } };
  }
  const LNAME = 'spdfgh';
  const REALNAME = { '1,0': 'p_z', '1,1': 'p_x', '1,-1': 'p_y', '2,0': 'd_z²', '2,1': 'd_xz', '2,-1': 'd_yz', '2,2': 'd_x²−y²', '2,-2': 'd_xy' };

  /* ================================================================ wim-orbitals */
  Hyper.sim('wim-orbitals', {
    title: 'Orbitals and the ladder of L_z',
    blurb: `An electron's orbital in hydrogen drawn as a cloud of 2600 points, each put where the electron might be found, so the density of dots is the [[?probability-density|probability density]] |ψ|². Drag to turn it. On the right is the vector model: the angular momentum has size √(l(l + 1)) ħ and lies on a cone whose height is L_z = mħ — one of the 2l + 1 rungs of the ladder.

**Try this**
- With "definite m" the colours show the [[?phase]] of ψ: it turns m times as you go once round the z-axis (the factor e^{imφ}), while the cloud itself is the same all the way round — a doughnut for m = ±l.
- Take l = 2 and step m from −2 to 2: five states, five rungs. The arrow never reaches the top of the circle, because |L| is always larger than the largest L_z.
- Switch to real orbitals: m = +1 and −1 combine into the dumbbells p_x and p_y, with lobes of opposite sign (two colours) — no longer states of definite L_z.
- Raise n with l fixed: spheres of zero density appear inside the cloud, n − l − 1 of them (the colour flips across each).`,
    mount(box, kit) {
      const Q = kit.qm, M = 2600;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'n (principal quantum number)', min: 1, max: 4, step: 1, value: 2 },
        { id: 'l', label: 'l (angular momentum)', min: 0, max: 3, step: 1, value: 1 },
        { id: 'm', label: 'm (L_z in units of ħ)', min: -3, max: 3, step: 1, value: 1 },
        { id: 'form', type: 'select', label: 'Show', options: [['States of definite m (complex)', 'c'], ['Real orbitals (p_x, d_xy …)', 'r']], value: 'c' },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true }
      ], id => { fix(id); build(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Orbital'], ['L', 'Size |L| = √(l(l + 1)) ħ'], ['Lz', 'L_z'], ['ang', 'Angle of the cone'], ['st', 'States with this l'], ['nod', 'Nodes']]);
      let pts = [], buckets = [], rScale = 10, yaw = 0.6, pitch = 0.35, t = 0;
      function fix(id) {
        if (P.l > P.n - 1) { if (id === 'l') ctl.set('n', Math.min(4, P.l + 1)); else ctl.set('l', P.n - 1); }
        if (Math.abs(P.m) > P.l) ctl.set('m', Math.sign(P.m) * P.l);
      }
      function build() {
        const n = P.n, l = P.l, m = P.m, am = Math.abs(m), real = P.form === 'r';
        const rmax = 2.2 * n * n + 6 * n + 4;
        const R = cdf(r => r * r * Math.pow(Q.hydrogenR(n, l, r), 2), 0, rmax, 800);
        const T = cdf(th => Math.pow(legendre(l, am, Math.cos(th)), 2) * Math.sin(th), 0, Math.PI, 400);
        // the radius holding 95 % of the probability sets the scale
        let k95 = R.cs.findIndex(v => v >= 0.95 * R.s); rScale = R.xs[Math.max(1, k95)];
        pts = []; const NB = 12; buckets = Array.from({ length: real ? 2 : NB }, () => []);
        for (let i = 0; i < M; i++) {
          const r = R.draw(Math.random()), th = T.draw(Math.random());
          let ph = TAU * Math.random();
          if (real && am > 0) { for (let k = 0; k < 50; k++) { const f = m > 0 ? Math.cos(am * ph) : Math.sin(am * ph); if (Math.random() < f * f) break; ph = TAU * Math.random(); } }
          const sgn = Math.sign(Q.hydrogenR(n, l, r) * legendre(l, am, Math.cos(th)) * (real && am > 0 ? (m > 0 ? Math.cos(am * ph) : Math.sin(am * ph)) : 1)) || 1;
          const p = { x: r * Math.sin(th) * Math.cos(ph), y: r * Math.sin(th) * Math.sin(ph), z: r * Math.cos(th) };
          if (real) buckets[sgn > 0 ? 0 : 1].push(p);
          else { let a = m * ph + (sgn < 0 ? Math.PI : 0); a = ((a % TAU) + TAU) % TAU; buckets[Math.floor(a / TAU * NB) % NB].push(p); }
          pts.push(p);
        }
      }
      fix('n'); build();
      kit.drag(st, { hit: () => ({}), move: (_, p) => { if (last) { yaw += (p.x - last.x) * 0.01; pitch = clamp(pitch + (p.y - last.y) * 0.01, -1.4, 1.4); } last = p; }, end: () => { last = null; } });
      let last = null;
      const loop = kit.loop(dt => {
        t += dt; if (P.spin && !last) yaw += 0.3 * dt;
        const n = P.n, l = P.l, m = P.m, real = P.form === 'r', am = Math.abs(m);
        const Lsz = Math.sqrt(l * (l + 1));
        const nm = n + LNAME[l];
        ro.set('name', real ? nm + (REALNAME[l + ',' + m] ? ' (' + REALNAME[l + ',' + m] + ')' : ', ' + (m >= 0 ? 'cos' : 'sin') + ' ' + am + 'φ') : nm + ', m = ' + (m > 0 ? '+' : '') + m);
        ro.set('L', l === 0 ? '0' : Lsz.toFixed(3) + ' ħ');
        ro.set('Lz', real && am > 0 ? 'not definite: ±' + am + 'ħ equally likely' : m + ' ħ');
        ro.set('ang', l === 0 ? '—' : real && am > 0 ? '±' + (Math.acos(am / Lsz) * 180 / Math.PI).toFixed(1) + '° cones' : (Math.acos(m / Lsz) * 180 / Math.PI).toFixed(1) + '°');
        ro.set('st', String(2 * l + 1) + ' (m = ' + (-l) + ' … ' + l + ')');
        ro.set('nod', (n - l - 1) + ' radial, ' + l + ' angular');
        // drawing: the cloud
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, wc = W * 0.62, cx = wc / 2, cy = H / 2, s = Math.min(wc, H) * 0.43 / rScale;
        const cyaw = Math.cos(yaw), syaw = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
        const proj = (x, y, z) => { const xr = x * cyaw - y * syaw, yr = x * syaw + y * cyaw; return [cx + s * xr, cy - s * (yr * sp + z * cp)]; };
        // axes
        const ax = rScale * 1.1;
        [[ax, 0, 0, 'x'], [0, ax, 0, 'y'], [0, 0, ax, 'z']].forEach(([x, y, z, lb]) => { const a = proj(-x, -y, -z), b = proj(x, y, z); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); kit.label(c, lb, b[0] + 4, b[1], { size: 12, weight: 700, color: C.muted }); });
        c.globalAlpha = 0.75;
        buckets.forEach((bk, i) => {
          c.fillStyle = real ? (i === 0 ? C.series[0] : C.series[3]) : 'hsl(' + Math.round(i * 30) + ' 80% 55%)';
          for (const p of bk) { const q = proj(p.x, p.y, p.z); c.fillRect(q[0] - 1, q[1] - 1, 2.2, 2.2); }
        });
        c.globalAlpha = 1;
        kit.label(c, (real ? 'colour: sign of ψ' : 'colour: phase of ψ') + ' · scale ' + rScale.toFixed(0) + ' a₀ = ' + (rScale * 0.0529).toFixed(2) + ' nm', 8, H - 10, { size: 11, color: C.muted });
        // the vector model
        const vx = wc + (W - wc) / 2, vy = H * 0.52, u = Math.min((W - wc) * 0.36, H * 0.4) / Math.max(1, Math.sqrt(12));
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(vx, vy + u * 3.8); c.lineTo(vx, vy - u * 3.8); c.stroke();
        kit.label(c, 'z', vx + 5, vy - u * 3.8 + 4, { size: 12, weight: 700, color: C.muted });
        if (l > 0) {
          c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.beginPath(); c.arc(vx, vy, u * Lsz, 0, TAU); c.stroke(); c.setLineDash([]);
          for (let mm = -l; mm <= l; mm++) {
            const y = vy - u * mm, half = u * Math.sqrt(Math.max(0, Lsz * Lsz - mm * mm));
            c.strokeStyle = mm === m ? C.warn : C.grid; c.lineWidth = mm === m ? 1.8 : 1;
            c.beginPath(); c.moveTo(vx - half, y); c.lineTo(vx + half, y); c.stroke();
            kit.label(c, (mm > 0 ? '+' : '') + mm + 'ħ', vx + u * Lsz + 8, y, { size: 10, color: mm === m ? C.warn : C.faint });
          }
          // the precessing arrow on its cone
          const rho = u * Math.sqrt(Math.max(0, Lsz * Lsz - m * m)), ph = 1.3 * t;
          const ex = vx + rho * Math.cos(ph), ey = vy - u * m + rho * 0.28 * Math.sin(ph);
          c.strokeStyle = C.accent; c.globalAlpha = 0.5; c.beginPath(); c.ellipse(vx, vy - u * m, Math.max(0.5, rho), Math.max(0.5, rho * 0.28), 0, 0, TAU); c.stroke(); c.globalAlpha = 1;
          kit.arrow(c, vx, vy, ex, ey, C.accent, 2.4, 9);
          if (real && am > 0) { const ey2 = vy + u * m + rho * 0.28 * Math.sin(ph + 1); kit.arrow(c, vx, vy, vx - rho * Math.cos(ph + 1), ey2, C.series[3], 1.6, 7); }
          kit.label(c, '|L| = ' + Lsz.toFixed(2) + ' ħ', vx, vy + u * Lsz + 16, { size: 11, align: 'center', color: C.muted });
        } else kit.label(c, 'l = 0: no orbital angular momentum', vx, vy, { size: 11, align: 'center', color: C.muted });
        kit.label(c, 'vector model', vx, 14, { size: 12, weight: 700, align: 'center' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-hydrogen */
  const SERIES = { 1: 'Lyman (ultraviolet)', 2: 'Balmer (visible)', 3: 'Paschen (infrared)', 4: 'Brackett (infrared)' };
  function lamColor(nm) {
    if (nm < 380) return 'hsl(275 45% 62%)';
    if (nm > 750) return 'hsl(0 45% 42%)';
    const hue = nm < 440 ? 270 - (nm - 380) / 60 * 30 : nm < 490 ? 240 - (nm - 440) / 50 * 60 : nm < 510 ? 180 - (nm - 490) / 20 * 60 : nm < 580 ? 120 - (nm - 510) / 70 * 60 : nm < 645 ? 60 - (nm - 580) / 65 * 60 : 0;
    return 'hsl(' + hue.toFixed(0) + ' 90% 55%)';
  }
  const RINF = 10973731.568160;
  const lineNm = (ni, nf) => 1e9 / (RINF * (1 / (nf * nf) - 1 / (ni * ni)));

  Hyper.sim('wim-hydrogen', {
    title: 'The hydrogen atom: levels, lines and where the electron is',
    blurb: `Left: hydrogen's energy levels, E = −13.6 eV/n², in columns for l = 0, 1, 2, 3 (s, p, d, f) — in hydrogen all the l of one n have the same energy. Arrows are the jumps of the chosen series, coloured as the light they emit; below, the same lines on a spectrum. Right: the chosen orbital's density, averaged over directions, and the graph of the radial [[?probability]] P(r) = r²R², with its peak and its average ⟨r⟩. Click a level to choose an orbital.

**Try this**
- Balmer series (to n = 2): the red 656 nm line, then 486, 434 and 410 nm, crowding towards 365 nm. Press *Emit* to watch the electron drop and the photon leave.
- Lyman series: every line is ultraviolet, because the gap to n = 1 is so large; Paschen and Brackett are infrared.
- Choose 1s: P(r) peaks at exactly one Bohr radius, 0.053 nm, while ⟨r⟩ = 1.5 a₀. Compare 2s with 2p (the dashed curves are the other l of the same n): 2s has a node and an inner bump that reaches close to the nucleus.
- Climb to n = 5 or 6: the atom swells as n², to dozens of Bohr radii.`,
    mount(box, kit) {
      const Q = kit.qm;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const plot = kit.plot(plotBox(box), { x: { label: 'distance from the nucleus r (Bohr radii a₀ = 0.0529 nm)', min: 0 }, y: { label: 'P(r) per a₀', min: 0 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'nf', type: 'select', label: 'Series (lower level)', options: [['Lyman: to n = 1', 1], ['Balmer: to n = 2', 2], ['Paschen: to n = 3', 3], ['Brackett: to n = 4', 4]], value: 2 },
        { id: 'ni', label: 'Upper level of the photon shown', min: 2, max: 7, step: 1, value: 3 },
        { id: 'n', label: 'Orbital: n', min: 1, max: 6, step: 1, value: 2 },
        { id: 'l', label: 'Orbital: l', min: 0, max: 5, step: 1, value: 0 },
        { type: 'buttons', items: [{ id: 'emit', label: 'Emit a photon', primary: true }] }
      ], id => { fix(id); if (id === 'emit' || id === 'ni' || id === 'nf') anim = 0; if (id === 'n' || id === 'l') curve(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['line', 'Photon'], ['E', 'Its energy'], ['lam', 'Wavelength'], ['orb', 'Orbital'], ['En', 'Energy of the orbital'], ['rp', 'Most probable r'], ['rm', 'Average ⟨r⟩']]);
      let anim = 0, geo = null, peak = 1;
      function fix(id) {
        if (P.ni <= P.nf) ctl.set('ni', Math.min(7, +P.nf + 1));
        if (P.l > P.n - 1) { if (id === 'l') ctl.set('n', Math.min(6, P.l + 1)); else ctl.set('l', P.n - 1); }
      }
      function curve() {
        const n = P.n, l = P.l, rmax = 2 * n * n + 8 * n + 4, series = [];
        let best = 0; peak = 0;
        for (let ll = 0; ll < n; ll++) {
          const pts = [];
          for (let i = 0; i <= 400; i++) { const r = rmax * i / 400, v = r * r * Math.pow(Q.hydrogenR(n, ll, r), 2); pts.push([r, v]); if (ll === l && v > best) { best = v; peak = r; } }
          series.push(ll === l ? { pts, label: n + LNAME[ll], width: 2.6 } : { pts, label: n + LNAME[ll], dash: [4, 3], width: 1.2 });
        }
        series.sort((a, b) => (a.dash ? 0 : 1) - (b.dash ? 0 : 1));
        const rm = (3 * n * n - l * (l + 1)) / 2;
        plot.set({ x: { label: 'distance from the nucleus r (Bohr radii a₀ = 0.0529 nm)', min: 0, max: rmax }, series, vlines: [{ x: peak, label: 'peak' }, { x: rm, label: '⟨r⟩' }] });
      }
      fix('n'); curve();
      kit.click(st, p => { const h = geo && geo.hit(p); if (h) { ctl.set('n', h[0]); ctl.set('l', h[1]); curve(); } }, p => !!(geo && geo.hit(p)));
      const loop = kit.loop(dt => {
        anim += dt;
        const nf = +P.nf, ni = P.ni, lam = lineNm(ni, nf), dE = Q.hydrogenE(ni) - Q.hydrogenE(nf);
        ro.set('line', ni + ' → ' + nf + ' · ' + SERIES[nf]);
        ro.set('E', dE.toFixed(3) + ' eV');
        ro.set('lam', lam.toFixed(1) + ' nm' + (lam < 380 ? ' (ultraviolet)' : lam > 750 ? ' (infrared)' : ' (visible)'));
        const n = P.n, l = P.l;
        ro.set('orb', n + LNAME[l] + ' (' + (n - l - 1) + ' radial node' + (n - l - 1 === 1 ? '' : 's') + ')');
        ro.set('En', Q.hydrogenE(n).toFixed(3) + ' eV');
        ro.set('rp', peak.toFixed(2) + ' a₀ = ' + (peak * 0.0529).toFixed(3) + ' nm');
        ro.set('rm', ((3 * n * n - l * (l + 1)) / 2).toFixed(1) + ' a₀');
        // drawing: levels
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const lx = 58, lw = W * 0.5 - lx, yT = 20, yBt = H * 0.74, col = lw / 4.4, Y = E => yT + (E / Q.hydrogenE(1)) * (yBt - yT);
        const segs = [];
        c.strokeStyle = C.faint; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(lx, yT); c.lineTo(lx + lw, yT); c.stroke(); c.setLineDash([]);
        kit.label(c, '0 eV (free)', lx - 6, yT, { size: 10, color: C.faint, align: 'right' });
        for (let k = 0; k < 4; k++) kit.label(c, LNAME[k], lx + (k + 0.5) * col, yBt + 14, { size: 12, weight: 700, color: C.muted, align: 'center' });
        for (let nn = 1; nn <= 7; nn++) {
          const y = Y(Q.hydrogenE(nn));
          if (nn <= 4) kit.label(c, 'n = ' + nn + '  ' + (Q.hydrogenE(nn)).toFixed(2), lx - 6, y, { size: 10, color: C.muted, align: 'right' });
          for (let ll = 0; ll < Math.min(nn, 4); ll++) {
            const x0 = lx + ll * col + 6, x1 = x0 + col - 12, sel = nn === P.n && ll === P.l;
            c.strokeStyle = sel ? C.warn : C.text; c.lineWidth = sel ? 3 : 1.5; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
            segs.push([x0, x1, y, nn, ll]);
          }
        }
        geo = { hit: p => { const s = segs.find(q => p.x >= q[0] - 3 && p.x <= q[1] + 3 && Math.abs(p.y - q[2]) < 5); return s ? [s[3], s[4]] : null; } };
        // the whole series as arrows, in a column beside the levels
        const xa = lx + lw + 6;
        for (let u = nf + 1; u <= 7; u++) {
          const x = xa + (u - nf - 1) * 7, y1 = Y(Q.hydrogenE(u)), y2 = Y(Q.hydrogenE(nf)), cl = lamColor(lineNm(u, nf));
          c.globalAlpha = u === ni ? 1 : 0.5;
          kit.arrow(c, x, y1, x, y2, cl, u === ni ? 2.4 : 1.1, u === ni ? 8 : 5);
          c.globalAlpha = 1;
        }
        kit.label(c, SERIES[nf].split(' ')[0], xa, Y(Q.hydrogenE(nf)) + 12, { size: 10, color: C.muted });
        // the jump being emitted: an electron dropping from np to (nf)s — a photon takes one unit of angular
        // momentum, so l must change by one — then the photon leaving
        const f = Math.min(1, anim / 0.9), yi = Y(Q.hydrogenE(ni)), yf = Y(Q.hydrogenE(nf)), xp = lx + col * 1.5, xs = lx + col * 0.5;
        c.strokeStyle = C.accent; c.globalAlpha = 0.4; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(xp, yi); c.lineTo(xs, yf); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
        kit.dot(c, xp + (xs - xp) * f, yi + (yf - yi) * f, 4.5, C.accent);
        if (anim > 0.9 && anim < 3.2) {
          const g = (anim - 0.9) / 2.3, px = xs + g * (W * 0.5), py = yf, cl = lamColor(lam);
          c.strokeStyle = cl; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 40; i++) { const xx = px - 60 + i * 1.5; c.lineTo(xx, py - 7 * Math.sin((xx - px) * 0.35 + anim * 12) * Math.exp(-Math.pow((i - 20) / 12, 2))); }
          c.stroke();
          kit.label(c, lam.toFixed(0) + ' nm', px, py - 16, { size: 11, color: cl, align: 'center', weight: 700 });
        }
        // the spectrum strip
        const sx0 = 20, sx1 = W - 20, sy = H * 0.88, lmin = Math.log(90), lmax = Math.log(4100), SX = nm => sx0 + (sx1 - sx0) * (Math.log(nm) - lmin) / (lmax - lmin);
        for (let nm = 380; nm < 750; nm += 4) { c.fillStyle = lamColor(nm); c.globalAlpha = 0.35; c.fillRect(SX(nm), sy - 8, SX(nm + 4) - SX(nm) + 0.5, 16); }
        c.globalAlpha = 1; c.strokeStyle = C.faint; c.strokeRect(sx0, sy - 8, sx1 - sx0, 16);
        for (let u = nf + 1; u <= 12; u++) { const nm = lineNm(u, nf), x = SX(nm); c.strokeStyle = lamColor(nm); c.lineWidth = u === ni ? 3 : 1.5; c.beginPath(); c.moveTo(x, sy - 10); c.lineTo(x, sy + 10); c.stroke(); }
        [100, 200, 400, 700, 1000, 2000, 4000].forEach(nm => kit.label(c, nm + ' nm', SX(nm), sy + 20, { size: 9.5, color: C.faint, align: 'center' }));
        // the density, averaged over directions
        const dx = W * 0.78, dy = H * 0.38, RD = Math.min(W * 0.2, H * 0.34), rmax = 2 * n * n + 8 * n + 4;
        let dmax = 1e-12; for (let i = 1; i <= 80; i++) dmax = Math.max(dmax, Math.pow(Q.hydrogenR(n, l, rmax * i / 80 * 0.8), 2));
        for (let i = 80; i >= 1; i--) { const r = rmax * 0.8 * i / 80, d = Math.pow(Q.hydrogenR(n, l, r), 2) / dmax; c.fillStyle = C.hue(200, clamp(Math.sqrt(d), 0, 1) * 0.9); c.beginPath(); c.arc(dx, dy, RD * i / 80, 0, TAU); c.fill(); }
        c.fillStyle = C.bg2; c.beginPath(); c.arc(dx, dy, RD * 0.2 / 80, 0, TAU); c.fill();
        kit.dot(c, dx, dy, 2, C.bad);
        c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.arc(dx, dy, Math.max(0.5, RD * peak / (rmax * 0.8)), 0, TAU); c.stroke(); c.setLineDash([]);
        kit.label(c, n + LNAME[l] + ' density (dashed: most probable r)', dx, dy + RD + 12, { size: 11, color: C.muted, align: 'center' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-shells */
  const ROWS = [['1s'], ['2s', '2p'], ['3s', '3p'], ['4s', '3d', '4p'], ['5s', '4d', '5p'], ['6s', '4f', '5d', '6p'], ['7s', '5f', '6d', '7p']];
  const SUPD = s => String(s).split('').map(ch => SUP[ch] || ch).join('');
  Hyper.sim('wim-shells', {
    title: 'Building the periodic table, electron by electron',
    blurb: `Add electrons one at a time. Each goes into the lowest free orbital (a box), and each orbital holds two — spin up and spin down — because of the exclusion principle. The rows of boxes are the subshells in the order they fill: s (1 box), p (3), d (5), f (7). On the right, the periodic table fills in step, coloured by block; below, the measured first ionisation energy of every element, with the noble gases marked. The configurations come from the chemistry engine and include the real exceptions (chromium, copper …).

**Try this**
- Press *Add electrons one by one* from hydrogen: 1s fills at helium, the n = 2 shell at neon, and each row of the table ends with a noble gas, where the ionisation energy peaks.
- Go from neon (Z = 10) to sodium (11): the new electron starts the 3s shell alone, and the ionisation energy falls from 21.6 eV to 5.1 eV.
- At potassium (19) the electron goes into 4s, not 3d — 4s is lower, because it reaches in close to the nucleus. The 3d boxes fill only from scandium (21) to zinc (30): the transition metals.
- Nitrogen (7): the three 2p electrons sit in separate boxes with parallel spins (Hund's rule); oxygen's fourth p electron must pair up, and its ionisation energy dips.
- Look at chromium (24) and copper (29): one 4s electron moves into 3d to make a half-full or full d subshell.`,
    mount(box, kit) {
      const Ch = kit.chem, NOBLE = [2, 10, 18, 36, 54, 86, 118];
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const plot = kit.plot(plotBox(box), { x: { label: 'atomic number Z', min: 1, max: 104 }, y: { label: 'first ionisation energy (eV)', min: 0, max: 26 } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'Z', label: 'Atomic number Z (electrons)', min: 1, max: 118, step: 1, value: 11 },
        { type: 'buttons', items: [{ id: 'play', label: 'Add electrons one by one', primary: true }, { id: 'stop', label: 'Stop' }, { id: 'h', label: 'Back to hydrogen' }] }
      ], id => { if (id === 'play') { playing = true; acc = 0; } if (id === 'stop') playing = false; if (id === 'h') { playing = false; ctl.set('Z', 1); } mark(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['el', 'Element'], ['cfg', 'Configuration'], ['val', 'Outer shell'], ['ie', 'First ionisation energy'], ['pos', 'Period, group, block']]);
      const iePts = []; for (let z = 1; z <= 104; z++) { const e = Ch.el(z); if (e && e.ie) iePts.push([z, e.ie]); }
      function mark() {
        const e = Ch.el(P.Z);
        plot.set({ series: [{ pts: iePts, label: 'first ionisation energy', dots: 1.8, width: 1.4 }], vlines: NOBLE.filter(z => z <= 104).map(z => ({ x: z, label: Ch.el(z).sym })), marks: e && e.ie && P.Z <= 104 ? [{ x: P.Z, y: e.ie, label: e.sym }] : [] });
      }
      mark();
      let playing = false, acc = 0;
      const parse = z => { const m = {}; if (z < 1) return m; for (const tok of Ch.fullConfig(z).split(' ')) { const r = /^(\d)([spdf])(\d+)$/.exec(tok); if (r) m[r[1] + r[2]] = +r[3]; } return m; };
      const pos = e => {
        if ((e.z >= 58 && e.z <= 71) || (e.z >= 90 && e.z <= 103)) return [e.z - (e.z <= 71 ? 57 : 89) + 3, e.period + 2.4];
        return [e.group || 3, e.period];
      };
      const BH = { s: 0, p: 45, d: 205, f: 130 };
      const loop = kit.loop(dt => {
        if (playing) { acc += dt; if (acc > 0.7) { acc = 0; if (P.Z < 118) { ctl.set('Z', P.Z + 1); mark(); } else playing = false; } }
        const Z = P.Z, e = Ch.el(Z), cfg = parse(Z), prev = parse(Z - 1);
        let outerN = 0; for (const k in cfg) outerN = Math.max(outerN, +k[0]);
        let outerE = 0; for (const k in cfg) if (+k[0] === outerN) outerE += cfg[k];
        ro.set('el', e.name + ' (' + e.sym + '), Z = ' + Z);
        ro.set('cfg', String(e.config || '').split(' ').map(tk => { const r = /^(\d[spdf])(\d+)$/.exec(tk); return r ? r[1] + SUPD(r[2]) : tk; }).join(' '));
        ro.set('val', 'n = ' + outerN + ', ' + outerE + ' electron' + (outerE === 1 ? '' : 's'));
        ro.set('ie', e.ie ? e.ie.toFixed(2) + ' eV' : 'not measured');
        ro.set('pos', 'period ' + e.period + ', group ' + (e.group || '—') + ', ' + e.block + '-block');
        // drawing: the boxes
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, lw = W * 0.52;
        const bs = clamp(Math.min((lw - 30) / 21, (H - 40) / 7.6), 8, 18), rowH = (H - 30) / 7;
        kit.label(c, 'energy of the subshells rises → and ↓ (filling order)', 8, 10, { size: 10.5, color: C.muted });
        ROWS.forEach((row, ri) => {
          let x = 8; const y = 22 + ri * rowH + (rowH - bs) / 2;
          for (const sub of row) {
            const l = 'spdf'.indexOf(sub[1]), nb = 2 * l + 1, k = cfg[sub] || 0, fresh = (cfg[sub] || 0) > (prev[sub] || 0);
            kit.label(c, sub, x, y + bs / 2, { size: 11, weight: 700, color: fresh ? C.warn : k ? C.text : C.faint });
            x += 22;
            for (let b = 0; b < nb; b++) {
              c.strokeStyle = fresh ? C.warn : C.muted; c.lineWidth = fresh ? 1.8 : 1; c.strokeRect(x + b * bs, y, bs - 1, bs);
              const up = b < Math.min(k, nb), dn = b < k - nb;
              c.fillStyle = C.hue(BH[sub[1]], 0.18); if (k) c.fillRect(x + b * bs + 1, y + 1, bs - 3, bs - 2);
              if (up) kit.label(c, '↑', x + b * bs + bs * 0.32, y + bs / 2, { size: bs * 0.75, weight: 700, color: C.accent, align: 'center' });
              if (dn) kit.label(c, '↓', x + b * bs + bs * 0.68, y + bs / 2, { size: bs * 0.75, weight: 700, color: C.series[3], align: 'center' });
            }
            x += nb * bs + 10;
          }
          kit.label(c, 'period ' + (ri + 1), lw - 4, y + bs / 2, { size: 9.5, color: C.faint, align: 'right' });
        });
        // the periodic table
        const tx = lw + 8, cw = (W - tx - 8) / 18, ch = Math.min(cw, (H - 30) / 10), ty = 22;
        for (let z = 1; z <= 118; z++) {
          const el = Ch.el(z); if (!el) continue;
          const [cx, cy] = pos(el), x = tx + (cx - 1) * cw, y = ty + (cy - 1) * ch;
          c.fillStyle = C.hue(BH[el.block] != null ? BH[el.block] : 0, z <= Z ? 0.55 : 0.1); c.fillRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
          if (NOBLE.includes(z)) { c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1); }
          if (z === Z) { c.strokeStyle = C.warn; c.lineWidth = 2.4; c.strokeRect(x, y, cw, ch); }
          if (cw > 15) kit.label(c, el.sym, x + cw / 2, y + ch / 2, { size: Math.min(10, cw * 0.45), color: z <= Z ? C.text : C.faint, align: 'center' });
        }
        kit.label(c, 'lanthanides and actinides', tx + 3 * cw, ty + 8.4 * ch - 8, { size: 9.5, color: C.faint });
        kit.label(c, e.sym + ' — ' + e.name, tx + (W - tx) / 2, H - 10, { size: 13, weight: 700, align: 'center', color: C.warn });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-operators */
  Hyper.sim('wim-operators', {
    title: 'Operators and averages',
    blurb: `A wave function on a line 4 nm long, evolving by the Schrödinger equation. Choose an operator Â. The top panel is ψ (real part solid, imaginary part dashed, |ψ|² filled); the middle panel is the new function Âψ that the operator makes; the bottom panel is Re(ψ*·Âψ), whose area is the [[?expectation-value|average]] ⟨A⟩ = ∫ψ*Âψ dx — the mean of many measurements. The graph plots the averages ⟨x⟩ and ⟨p⟩ as a point moving in "phase space", with a box of half-widths Δx and Δp round it (the [[?standard-deviation|standard deviations]]).

**Try this**
- Momentum p̂ = −iħ ∂/∂x on a packet with k = 5 nm⁻¹: Âψ looks like ψ turned a quarter-turn and multiplied by ħk — the packet is nearly an [[?eigenvalue|eigenstate]] of momentum, and the integrand is positive everywhere.
- The packet in the harmonic well: ⟨x⟩ and ⟨p⟩ go round an ellipse exactly as a classical particle would (Ehrenfest). Set σ to 0.28 nm, the ground-state width, and ΔxΔp stays at ħ/2; change σ and the box breathes.
- A free packet: ⟨p⟩ stays fixed, Δp stays fixed, but Δx grows — so ΔxΔp climbs above ħ/2 as the packet spreads.
- The box's two lowest states: the density sloshes, ⟨x⟩ oscillates, but ⟨E⟩ stays constant — a weighted average of E₁ and E₂. With the share at 0 or 1 it is a stationary state and nothing moves.`,
    mount(box, kit) {
      const Q = kit.qm, N = 400, L = 40, XC = 20;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const plot = kit.plot(plotBox(box), { x: { label: '⟨x⟩ (nm)', min: 0, max: 4 }, y: { label: '⟨p⟩ (ħ per nm)', min: -12, max: 12 }, legend: true }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'st', type: 'select', label: 'State', options: [['A packet in a harmonic well', 'harm'], ['A free packet (walls 4 nm apart)', 'free'], ['The two lowest states of the box', 'box2']], value: 'harm' },
        { id: 'op', type: 'select', label: 'Operator Â', options: [['Position x̂: multiply by x', 'x'], ['Momentum p̂ = −iħ ∂/∂x', 'p'], ['Energy Ĥ = p̂²/2m + V', 'H']], value: 'p' },
        { id: 'k', label: 'Starting wave number k (momentum ħk)', min: -10, max: 10, step: 0.5, value: 0, unit: 'nm⁻¹' },
        { id: 'sig', label: 'Starting width σ', min: 0.1, max: 0.6, step: 0.01, value: 0.28, unit: 'nm' },
        { id: 'P2', label: 'Box: share of the second state', min: 0, max: 1, step: 0.05, value: 0.5 },
        { id: 'speed', label: 'Speed', min: 0.2, max: 3, step: 0.1, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart', primary: true }] }
      ], id => { if (id !== 'op' && id !== 'speed') reset(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['A', '⟨A⟩ = ∫ψ*Âψ dx'], ['x', '⟨x⟩ and Δx'], ['p', '⟨p⟩ and Δp'], ['E', '⟨E⟩'], ['u', 'Δx·Δp'], ['t', 'Time']]);
      const OM = 0.5 / EU;       // ħω = 0.5 eV
      let w = null, t = 0, rate = 20, trail = [], a0 = 1;
      const Ar = new Float64Array(N), Ai = new Float64Array(N), G = new Float64Array(N);
      function reset() {
        const Vf = P.st === 'harm' ? (x => 0.5 * OM * OM * (x - XC) * (x - XC)) : (() => 0);
        w = Q.wave1d({ N, L, V: Vf, dt: 0.05 });
        if (P.st === 'box2') {
          const s1 = Math.sqrt(1 - P.P2), s2 = Math.sqrt(P.P2);
          for (let j = 0; j < N; j++) { const x = w.x[j]; w.re[j] = Math.sqrt(2 / L) * (s1 * Math.sin(Math.PI * x / L) + s2 * Math.sin(2 * Math.PI * x / L)); w.im[j] = 0; }
          const s = Math.sqrt(w.norm()) || 1; for (let j = 0; j < N; j++) w.re[j] /= s;
          rate = 170;
        } else {
          w.setGaussian({ x0: P.st === 'harm' ? XC - 6 : 12, sigma: P.sig * 10, k0: P.k / 10 });
          rate = P.st === 'harm' ? (TAU / OM) / 5 : 12;
        }
        t = 0; trail = []; a0 = 1e-9;
        for (let j = 0; j < N; j++) a0 = Math.max(a0, Math.abs(w.re[j]), Math.abs(w.im[j]));
        ctl.show('k', P.st !== 'box2'); ctl.show('sig', P.st !== 'box2'); ctl.show('P2', P.st === 'box2');
      }
      reset();
      const d1 = (f, j) => ((j + 1 < N ? f[j + 1] : 0) - (j > 0 ? f[j - 1] : 0)) / (2 * w.dx);
      const d2 = (f, j) => ((j + 1 < N ? f[j + 1] : 0) - 2 * f[j] + (j > 0 ? f[j - 1] : 0)) / (w.dx * w.dx);
      const loop = kit.loop(dt => {
        if (dt > 0) { const n = clamp(Math.round(dt * rate * P.speed / w.dt), 1, 300); w.step(n); t += n * w.dt; }
        const re = w.re, im = w.im, dx = w.dx;
        let sx = 0, sx2 = 0, sp = 0, sp2 = 0, sE = 0, sA = 0;
        for (let j = 0; j < N; j++) {
          const p = re[j] * re[j] + im[j] * im[j], x = w.x[j], rr = d1(re, j), ri = d1(im, j);
          sx += x * p * dx; sx2 += x * x * p * dx;
          sp += (re[j] * ri - im[j] * rr) * dx;               // Re ψ*(−i ψ′)
          sp2 += (rr * rr + ri * ri) * dx;                    // ∫|ψ′|²
          if (P.op === 'x') { Ar[j] = x * re[j]; Ai[j] = x * im[j]; }
          else if (P.op === 'p') { Ar[j] = ri; Ai[j] = -rr; }
          else { Ar[j] = -0.5 * d2(re, j) + w.V[j] * re[j]; Ai[j] = -0.5 * d2(im, j) + w.V[j] * im[j]; }
          G[j] = re[j] * Ar[j] + im[j] * Ai[j]; sA += G[j] * dx;
          sE += (0.5 * (rr * rr + ri * ri) + w.V[j] * p) * dx;
        }
        const Dx = Math.sqrt(Math.max(0, sx2 - sx * sx)), Dp = Math.sqrt(Math.max(0, sp2 - sp * sp));
        trail.push([sx / 10, sp * 10]); if (trail.length > 500) trail.shift();
        const unitA = P.op === 'x' ? ' nm' : P.op === 'p' ? ' ħ/nm' : ' eV', valA = P.op === 'x' ? sA / 10 : P.op === 'p' ? sA * 10 : sA * EU;
        ro.set('A', valA.toFixed(3) + unitA);
        ro.set('x', (sx / 10).toFixed(3) + ' nm, Δx = ' + (Dx / 10).toFixed(3) + ' nm');
        ro.set('p', (sp * 10).toFixed(2) + ' ħ/nm, Δp = ' + (Dp * 10).toFixed(2) + ' ħ/nm');
        ro.set('E', (sE * EU).toFixed(3) + ' eV');
        ro.set('u', (Dx * Dp).toFixed(3) + ' ħ  ' + (Dx * Dp >= 0.495 ? '≥ ħ/2 ✓' : '(grid limit)'));
        ro.set('t', (t * TU).toFixed(1) + ' fs');
        if (Math.floor(t * 7) % 2 === 0 || dt === 0) {
          const bx = sx / 10, by = sp * 10, hx = Dx / 10, hy = Dp * 10;
          plot.set({ series: [{ pts: trail.slice(), label: '(⟨x⟩, ⟨p⟩)' }, { pts: [[bx - hx, by - hy], [bx + hx, by - hy], [bx + hx, by + hy], [bx - hx, by + hy], [bx - hx, by - hy]], label: '±Δx, ±Δp', dash: [4, 3], width: 1.4 }], marks: [{ x: bx, y: clamp(by, -12, 12), label: 'now' }] });
        }
        // drawing: three panels
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, xl = 34, xr = W - 12, X = x => xl + (xr - xl) * x / L;
        const ph = (H - 30) / 3, mids = [12 + ph * 0.62, 18 + ph * 1.5, 24 + ph * 2.5];
        let aA = 1e-12, gA = 1e-12; for (let j = 0; j < N; j++) { aA = Math.max(aA, Math.abs(Ar[j]), Math.abs(Ai[j])); gA = Math.max(gA, Math.abs(G[j])); }
        const line = (f, y0, k, col, dash) => { c.strokeStyle = col; c.lineWidth = 1.6; c.setLineDash(dash || []); c.beginPath(); for (let j = 0; j < N; j++) { const y = y0 - k * f[j]; if (j === 0) c.moveTo(X(w.x[j]), y); else c.lineTo(X(w.x[j]), y); } c.stroke(); c.setLineDash([]); };
        mids.forEach(y => { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(xl, y); c.lineTo(xr, y); c.stroke(); });
        if (P.st === 'harm') { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); for (let j = 0; j < N; j += 4) { const y = mids[0] + ph * 0.3 - clamp(w.V[j] / (0.5 * OM * OM * 400), 0, 1.4) * ph * 0.6; if (j === 0) c.moveTo(X(w.x[j]), y); else c.lineTo(X(w.x[j]), y); } c.stroke(); }
        const kp = ph * 0.42 / (a0 * a0);
        c.fillStyle = C.hue(160, 0.25); c.beginPath(); c.moveTo(X(w.x[0]), mids[0]);
        for (let j = 0; j < N; j++) c.lineTo(X(w.x[j]), mids[0] - kp * (re[j] * re[j] + im[j] * im[j]));
        c.lineTo(X(w.x[N - 1]), mids[0]); c.closePath(); c.fill();
        line(re, mids[0], ph * 0.42 / a0, C.series[0]); line(im, mids[0], ph * 0.42 / a0, C.series[1], [4, 3]);
        line(Ar, mids[1], ph * 0.42 / aA, C.series[0]); line(Ai, mids[1], ph * 0.42 / aA, C.series[1], [4, 3]);
        for (let j = 0; j < N; j++) { const v = G[j] * ph * 0.42 / gA; c.fillStyle = v >= 0 ? C.hue(150, 0.55) : C.hue(0, 0.55); c.fillRect(X(w.x[j]), v >= 0 ? mids[2] - v : mids[2], Math.max(1, (xr - xl) / N + 0.4), Math.abs(v)); }
        const opName = P.op === 'x' ? 'x̂ψ = xψ' : P.op === 'p' ? 'p̂ψ = −iħ ∂ψ/∂x' : 'Ĥψ = −(ħ²/2m)ψ″ + Vψ';
        kit.label(c, 'ψ (Re solid, Im dashed) and |ψ|²', xl, 10, { size: 11, color: C.muted });
        kit.label(c, opName, xl, 18 + ph + 2, { size: 11, color: C.muted });
        kit.label(c, 'Re(ψ*·Âψ): its area is ⟨A⟩ = ' + valA.toFixed(3) + unitA, xl, 24 + ph * 2 + 4, { size: 11, color: C.muted });
        for (let nm = 0; nm <= 4; nm++) kit.label(c, nm + ' nm', X(nm * 10), H - 6, { size: 9.5, color: C.faint, align: 'center' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-flux */
  const PHI0 = 2.0678338e-15;
  Hyper.sim('wim-flux', {
    title: 'Flux trapped in a superconducting ring',
    blurb: `A superconducting ring 20 µm across, seen from above, in a magnetic field pointing out of the screen (the dots). All the electron pairs share one wave function √ρ e^{iθ}; the arrows round the ring show its [[?phase]] θ. Going once round, the phase must come back to itself, so it turns a whole number of times n — and then the flux inside the ring is exactly n h/2e. The ring makes up any difference from the applied flux with a screening current, drawn as the moving dots; if that current would exceed the critical current, the phase slips by one turn and one flux quantum jumps in or out. The graph records the flux inside against the applied flux.

**Try this**
- Start at 0.3 flux quanta, superconducting: n = 0, the phase arrows all point one way, and the ring's current cancels the applied flux inside — the field is kept out.
- Raise the applied flux slowly: the current grows until, near L·I_c, the phase slips and n jumps to 1. The flux inside climbs in steps: a staircase, h/2e = 2.07 × 10⁻¹⁵ Wb per step.
- Press *Sweep*: the steps going down happen at different places from those going up — hysteresis, set by the critical current. Lower L·I_c and the steps move closer to the half-integers.
- Warm the ring (untick superconducting): the field passes freely and the phases scatter. Cool it again at 1.0 flux quantum, then turn the applied field down to zero: the flux stays trapped, held by a current that flows with nothing driving it — a persistent current.`,
    mount(box, kit) {
      const LR = 3.0e-11, AREA = Math.PI * 1e-10, I0 = PHI0 / LR;   // a ring of radius 10 µm: L ≈ 30 pH, Φ₀/L = 69 µA
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 290 });
      const plot = kit.plot(plotBox(box), { x: { label: 'applied flux Φ_ext (in flux quanta h/2e)', min: 0, max: 4 }, y: { label: 'flux inside the ring (flux quanta)', min: -0.3, max: 4.4 }, legend: true }, 170);
      let n = 0, slip = 0, sweep = null, hist = [], t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Applied flux Φ_ext, in flux quanta', min: 0, max: 4, step: 0.01, value: 0.3 },
        { id: 'sc', type: 'check', label: 'Superconducting (cooled below T_c)', value: true },
        { id: 'beta', label: 'Critical current, as L·I_c in flux quanta', min: 0.6, max: 3, step: 0.05, value: 1.2 },
        { type: 'buttons', items: [{ id: 'cool', label: 'Warm up, then cool here', primary: true }, { id: 'sweep', label: 'Sweep the field up and down' }, { id: 'clear', label: 'Clear the graph' }] }
      ], id => {
        if (id === 'cool') { n = Math.round(P.phi); ctl.set('sc', true); hist = []; }
        if (id === 'sc' && P.sc) n = Math.round(P.phi);
        if (id === 'sweep') { sweep = 0; hist = []; }
        if (id === 'clear') hist = [];
        if (id === 'phi') sweep = null;
        update();
      });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['phi', 'Applied flux'], ['n', 'Flux quanta trapped (turns of phase)'], ['tot', 'Flux inside the ring'], ['I', 'Screening current'], ['ev', 'Event']]);
      function update() {
        if (P.sc) { let k = 0; while (Math.abs(n - P.phi) > P.beta && k < 20) { n += Math.sign(P.phi - n); slip = 1.2; k++; } }
        hist.push([P.phi, P.sc ? n : P.phi]); if (hist.length > 3000) hist.shift();
        plot.set({ series: [{ pts: hist.slice(), label: 'flux inside (history)', line: false, dots: 2.2 }, { pts: [[0, 0], [4, 4]], label: 'normal metal: all of it', dash: [5, 4], width: 1.2 }], marks: [{ x: P.phi, y: P.sc ? n : P.phi, label: 'now' }] });
      }
      update();
      const rnd = kit.qm.rng(11), ph0 = Array.from({ length: 24 }, () => TAU * rnd());
      let spin = 0;
      const loop = kit.loop(dt => {
        t += dt; slip = Math.max(0, slip - dt);
        if (sweep != null && dt > 0) { sweep += dt / 9; const s = sweep < 1 ? sweep : 2 - sweep; ctl.set('phi', +(4 * clamp(s, 0, 1)).toFixed(3)); update(); if (sweep >= 2) sweep = null; }
        const iRel = P.sc ? (n - P.phi) / P.beta : 0, I = P.sc ? (n - P.phi) * I0 : 0;
        spin += dt * 1.6 * iRel;
        ro.set('phi', P.phi.toFixed(2) + ' Φ₀ = ' + sci(P.phi * PHI0) + ' Wb (B = ' + (P.phi * PHI0 / AREA * 1e6).toFixed(2) + ' µT)');
        ro.set('n', P.sc ? String(n) : 'none: a normal metal lets the field through');
        ro.set('tot', P.sc ? n + ' × h/2e = ' + sci(n * PHI0) + ' Wb' : P.phi.toFixed(2) + ' Φ₀ (whatever is applied)');
        ro.set('I', P.sc ? (I * 1e6).toFixed(1) + ' µA (' + (100 * Math.abs(iRel)).toFixed(0) + ' % of I_c = ' + (P.beta * I0 * 1e6).toFixed(0) + ' µA)' : '0');
        ro.set('ev', slip > 0 ? 'the phase slipped: one flux quantum moved' : P.sc ? 'phase winds ' + n + (n === 1 ? ' turn' : ' turns') + ' round the ring' : 'warm: no single phase');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, cx = W * 0.4, cy = H * 0.5, R2 = Math.min(W * 0.34, H * 0.44), R1 = R2 * 0.62, Rm = (R1 + R2) / 2;
        // the applied field outside, the trapped flux inside
        const sp = 30 / Math.sqrt(Math.max(P.phi, 0.04));
        c.fillStyle = C.muted;
        for (let x = sp / 2; x < W; x += sp) for (let y = sp / 2; y < H; y += sp) { const r = Math.hypot(x - cx, y - cy); if (r < R2 + 3) continue; c.beginPath(); c.arc(x, y, 1.6, 0, TAU); c.fill(); }
        const inside = P.sc ? Math.max(0, n) : P.phi, dots = Math.round(inside * 9);
        for (let k = 0; k < dots; k++) { const r = R1 * 0.85 * Math.sqrt((k + 0.5) / Math.max(dots, 1)), a = k * 2.39996; kit.dot(c, cx + r * Math.cos(a), cy + r * Math.sin(a), 2.2, C.accent); }
        if (P.sc && n < 0) kit.label(c, 'reversed flux', cx, cy, { size: 11, align: 'center', color: C.warn });
        if (!P.sc) for (let x = sp / 2; x < W; x += sp) for (let y = sp / 2; y < H; y += sp) { const r = Math.hypot(x - cx, y - cy); if (r >= R2 + 3) continue; kit.dot(c, x, y, 1.6, C.muted); }
        // the ring
        c.fillStyle = P.sc ? C.hue(200, 0.35) : C.hue(30, 0.22);
        c.beginPath(); c.arc(cx, cy, R2, 0, TAU); c.arc(cx, cy, R1, 0, TAU, true); c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, R2, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, R1, 0, TAU); c.stroke();
        // the phase of the wave function round the ring
        const hand = (R2 - R1) * 0.38;
        for (let k = 0; k < 24; k++) {
          const a = TAU * k / 24, x = cx + Rm * Math.cos(a), y = cy - Rm * Math.sin(a);
          const th = P.sc ? n * a + 0.7 * t : ph0[k] + 0.3 * Math.sin(3 * t + k);
          kit.arrow(c, x - hand * Math.cos(th) * 0.3, y + hand * Math.sin(th) * 0.3, x + hand * Math.cos(th), y - hand * Math.sin(th), P.sc ? C.warn : C.faint, 1.6, 5);
        }
        // the screening current near the inner surface
        if (P.sc && Math.abs(iRel) > 0.01) for (let k = 0; k < 18; k++) { const a = TAU * k / 18 + spin, r = R1 + (R2 - R1) * 0.12; kit.dot(c, cx + r * Math.cos(a), cy - r * Math.sin(a), 2.4, C.ok); }
        if (slip > 0) { c.strokeStyle = C.hue(48, slip / 1.2); c.lineWidth = 5; c.beginPath(); c.arc(cx, cy, R2 + 6, 0, TAU); c.stroke(); }
        kit.label(c, P.sc ? 'phase turns ' + n + '× round the ring' : 'normal metal', cx, cy + R2 + 16, { size: 12, weight: 700, align: 'center', color: P.sc ? C.warn : C.muted });
        kit.label(c, '· field out of the screen', W - 10, 12, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'inside: ' + (P.sc ? n : P.phi.toFixed(2)) + ' Φ₀', W - 10, 30, { size: 11, color: C.accent, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ wim-josephson */
  Hyper.sim('wim-josephson', {
    title: 'The Josephson junction and the SQUID',
    blurb: `Two superconductors separated by an insulating layer about a nanometre thick. Each side has one [[?phase]] θ, drawn as the arrows that point the same way throughout a block; electron pairs tunnel through the gap with a current I_s = I_c sin δ, where δ = θ₂ − θ₁, and a voltage V across the gap makes δ run on at 2eV/ħ. The model is the standard one for a real junction — an ideal Josephson element with a 1 Ω resistance beside it — with I_c = 100 µA. The animation is slowed about ten billion times; the real frequencies are in the readout.

**Try this**
- Current bias below I_c (0.6 I_c): the phase difference settles where sin δ = 0.6 and a steady supercurrent flows with no voltage at all — the DC Josephson effect.
- Raise the bias above I_c: the phase starts to slip, a voltage appears and the current through the barrier oscillates at 2e⟨V⟩/h. Far above I_c the I–V curve joins Ohm's law.
- Voltage bias: δ runs steadily and the supercurrent swings at 483.6 MHz per microvolt — the AC Josephson effect. At 10 µV that is 4.8 GHz.
- SQUID: two junctions on a ring. Change the flux through the ring: the largest current without voltage swings between 2I_c and zero once per flux quantum, like two-slit fringes. Set the bias between the extremes and the ring switches in and out of the voltage state as the flux changes.`,
    mount(box, kit) {
      const IC = 100e-6, RN = 1, KJ = 483597.8484e9;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 290 });
      const plot = kit.plot(plotBox(box), { x: { label: 'bias current I / I_c', min: 0, max: 3 }, y: { label: 'average voltage (µV)', min: 0, max: 320 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Drive', options: [['Current bias (a real junction)', 'dc'], ['Voltage bias', 'ac'], ['Two junctions in a ring (SQUID)', 'squid']], value: 'dc' },
        { id: 'i', label: 'Bias current I / I_c', min: 0, max: 3, step: 0.01, value: 0.6 },
        { id: 'V', label: 'Voltage across the junction', min: 0, max: 100, step: 1, value: 10, unit: 'µV' },
        { id: 'phi', label: 'SQUID: flux through the ring (flux quanta)', min: 0, max: 3, step: 0.01, value: 0.2 }
      ], id => { if (id === 'mode') { vAvg = 0; } show(); curve(); });
      const P = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Phase difference δ'], ['Is', 'Supercurrent I_c sin δ'], ['V', 'Average voltage'], ['f', 'Josephson frequency 2eV/h'], ['s', 'State']]);
      let delta = 0, th1 = 0, t = 0, vAvg = 0, trace = [], pairs = [], pacc = 0;
      function show() { ctl.show('i', P.mode !== 'ac'); ctl.show('V', P.mode === 'ac'); ctl.show('phi', P.mode === 'squid'); }
      const icEff = () => P.mode === 'squid' ? 2 * Math.abs(Math.cos(Math.PI * P.phi)) : 1;    // in units of I_c
      const rEff = () => P.mode === 'squid' ? 0.5 : 1;                                            // in units of R
      function curve() {
        if (P.mode === 'ac') {
          plot.set({ x: { label: 'voltage V (µV)', min: 0, max: 100 }, y: { label: 'Josephson frequency (GHz)', min: 0, max: 50 }, series: [{ pts: [[0, 0], [100, KJ * 100e-6 / 1e9]], label: 'f = 2eV/h = 483.6 MHz per µV' }], hlines: [], marks: [{ x: P.V, y: KJ * P.V * 1e-6 / 1e9, label: 'now' }] });
        } else if (P.mode === 'squid') {
          const pts = []; for (let k = 0; k <= 300; k++) { const f = 3 * k / 300; pts.push([f, 2 * Math.abs(Math.cos(Math.PI * f))]); }
          plot.set({ x: { label: 'flux through the ring (flux quanta)', min: 0, max: 3 }, y: { label: 'largest zero-voltage current / I_c', min: 0, max: 3.1 }, series: [{ pts, label: 'I_max = 2I_c |cos(πΦ/Φ₀)|' }], hlines: [{ y: P.i, label: 'bias' }], marks: [{ x: P.phi, y: icEff(), label: 'now' }] });
        } else {
          const pts = [], ohm = [];
          for (let k = 0; k <= 300; k++) { const i = 3 * k / 300; pts.push([i, i > 1 ? 100 * Math.sqrt(i * i - 1) : 0]); ohm.push([i, 100 * i]); }
          plot.set({ x: { label: 'bias current I / I_c', min: 0, max: 3 }, y: { label: 'average voltage (µV)', min: 0, max: 320 }, series: [{ pts, label: 'junction: V = R√(I² − I_c²)' }, { pts: ohm, label: 'Ohm\'s law V = IR', dash: [5, 4], width: 1.2 }], hlines: [], marks: [{ x: P.i, y: P.i > 1 ? 100 * Math.sqrt(P.i * P.i - 1) : 0, label: 'now' }] });
        }
      }
      show(); curve();
      const loop = kit.loop(dt => {
        t += dt;
        let dd = 0;                                  // dδ per display second
        if (P.mode === 'ac') { dd = TAU * P.V / 20; delta += dd * dt; }   // one turn per second for every 20 µV (slowed down)
        else {
          // resistively shunted junction: V = R_eff (I − I_c,eff sin δ) and dδ/dt = 2eV/ħ. With u = V/(I_c R) and
          // τ = t·2eI_cR/ħ this is dδ/dτ = u = r_eff (i − i_c,eff sin δ); four units of τ per displayed second
          const ie = icEff(), re_ = rEff(), sub = 20, h = dt * 4 / sub;
          for (let k = 0; k < sub; k++) { const u = re_ * (P.i - ie * Math.sin(delta)); delta += h * u; dd += u * 4 / sub; }
        }
        delta = ((delta % TAU) + TAU) % TAU;
        th1 -= 0.6 * dt;
        const vNow = P.mode === 'ac' ? P.V : 100 * dd / 4;     // µV this frame, since I_c R = 100 µV
        const ie0 = icEff();                                    // the time average of the RSJ voltage is R_eff √(I² − I_c,eff²)
        vAvg = P.mode === 'ac' ? P.V : P.i > ie0 ? 100 * rEff() * Math.sqrt(P.i * P.i - ie0 * ie0) : 0;
        const Is = (P.mode === 'squid' ? icEff() : 1) * Math.sin(delta);
        trace.push([t, Is]); while (trace.length && trace[0][0] < t - 4) trace.shift();
        pacc += dt * 10 * Math.abs(Is); while (pacc >= 1) { pacc -= 1; pairs.push({ f: 0, dir: Is >= 0 ? 1 : -1, y: Math.random() }); }
        for (const p of pairs) p.f += dt * 1.4; pairs = pairs.filter(p => p.f < 1);
        const zeroV = P.mode !== 'ac' && P.i <= icEff() + 1e-9;
        ro.set('d', (delta * 180 / Math.PI).toFixed(0) + '°' + (zeroV ? ' (steady)' : ' (running)'));
        ro.set('Is', (Is * IC * 1e6).toFixed(1) + ' µA');
        ro.set('V', (zeroV ? 0 : vAvg).toFixed(1) + ' µV' + (P.mode === 'ac' || zeroV ? '' : ' (now ' + vNow.toFixed(0) + ' µV)'));
        ro.set('f', zeroV ? '0: no voltage, a steady supercurrent' : sci(KJ * vAvg * 1e-6 / 1e9, 3) + ' GHz');
        ro.set('s', P.mode === 'squid' ? 'I_max = ' + (icEff() * 100).toFixed(1) + ' µA; bias ' + (P.i * 100).toFixed(0) + ' µA → ' + (zeroV ? 'no voltage' : 'voltage state') : zeroV ? 'zero voltage: pairs tunnel with no push at all' : 'voltage state: the phase slips and the current oscillates');
        // drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, topH = H * 0.66;
        const th2 = th1 + delta;
        const block = (x0, x1, y0, y1, th, label) => {
          c.fillStyle = C.hue(200, 0.28); c.fillRect(x0, y0, x1 - x0, y1 - y0);
          const cols = 3, rows = 3;
          for (let a = 0; a < cols; a++) for (let b = 0; b < rows; b++) {
            const x = x0 + (a + 0.5) * (x1 - x0) / cols, y = y0 + (b + 0.5) * (y1 - y0) / rows, L = Math.min((x1 - x0) / cols, (y1 - y0) / rows) * 0.36;
            kit.arrow(c, x - L * 0.3 * Math.cos(th), y + L * 0.3 * Math.sin(th), x + L * Math.cos(th), y - L * Math.sin(th), C.warn, 1.8, 6);
          }
          kit.label(c, label, (x0 + x1) / 2, y1 + 12, { size: 11, color: C.muted, align: 'center' });
        };
        if (P.mode !== 'squid') {
          const gx = W / 2, gw = 10, y0 = 24, y1 = topH - 20;
          block(24, gx - gw / 2, y0, y1, th1, 'superconductor 1: θ₁');
          block(gx + gw / 2, W - 24, y0, y1, th2, 'superconductor 2: θ₂');
          c.fillStyle = C.faint; c.fillRect(gx - gw / 2, y0, gw, y1 - y0);
          for (const p of pairs) { const x = gx + p.dir * (p.f - 0.5) * 60, y = y0 + 10 + p.y * (y1 - y0 - 20); kit.dot(c, x - 2.5, y, 2.2, C.accent); kit.dot(c, x + 2.5, y, 2.2, C.accent); }
          kit.label(c, 'δ = ' + (delta * 180 / Math.PI).toFixed(0) + '°', gx, 12, { size: 12, weight: 700, align: 'center', color: C.warn });
          kit.label(c, 'insulating gap', gx, y1 + 12, { size: 10, color: C.faint, align: 'center' });
        } else {
          const x0 = W * 0.2, x1 = W * 0.8, y0 = 30, y1 = topH - 24, tk = 18;
          c.fillStyle = C.hue(200, 0.28);
          c.fillRect(x0, y0, x1 - x0, tk); c.fillRect(x0, y1 - tk, x1 - x0, tk); c.fillRect(x0, y0, tk, y1 - y0); c.fillRect(x1 - tk, y0, tk, y1 - y0);
          const jy = (y0 + y1) / 2;
          c.fillStyle = C.bg2; c.fillRect(x0 - 2, jy - 4, tk + 4, 8); c.fillRect(x1 - tk - 2, jy - 4, tk + 4, 8);
          c.fillStyle = C.faint; c.fillRect(x0, jy - 2, tk, 4); c.fillRect(x1 - tk, jy - 2, tk, 4);
          kit.label(c, 'junction A', x0 - 6, jy, { size: 10.5, color: C.muted, align: 'right' }); kit.label(c, 'junction B', x1 + 6, jy, { size: 10.5, color: C.muted });
          const nd = Math.round(P.phi * 10);
          for (let k = 0; k < nd; k++) { const r = Math.min(x1 - x0, y1 - y0) * 0.3 * Math.sqrt((k + 0.5) / Math.max(1, nd)), a = k * 2.39996; kit.dot(c, (x0 + x1) / 2 + r * Math.cos(a), jy + r * Math.sin(a), 2, C.accent); }
          const ia = Math.cos(Math.PI * P.phi) >= 0 ? 1 : -1;
          kit.arrow(c, x0 + tk / 2, y1 - tk - 6, x0 + tk / 2, y0 + tk + 6, C.ok, 2, 7);
          kit.arrow(c, x1 - tk / 2, y1 - tk - 6, x1 - tk / 2, y0 + tk + 6, ia > 0 ? C.ok : C.bad, 2, 7);
          kit.label(c, 'flux ' + P.phi.toFixed(2) + ' Φ₀', (x0 + x1) / 2, y0 - 12, { size: 11, weight: 700, align: 'center', color: C.accent });
          kit.label(c, 'I_max = ' + icEff().toFixed(2) + ' I_c', (x0 + x1) / 2, y1 + 12, { size: 11, align: 'center', color: C.warn, weight: 700 });
        }
        // an oscilloscope of the supercurrent over the last 4 seconds (slowed)
        const sx0 = 24, sx1 = W - 24, sy0 = topH + 8, sy1 = H - 10, my = (sy0 + sy1) / 2, amp = (sy1 - sy0) / 2 - 4;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(sx0, sy0, sx1 - sx0, sy1 - sy0); c.beginPath(); c.moveTo(sx0, my); c.lineTo(sx1, my); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        trace.forEach((p, k) => { const x = sx1 - (t - p[0]) / 4 * (sx1 - sx0), y = my - amp * p[1] / (P.mode === 'squid' ? 2 : 1); if (k === 0) c.moveTo(x, y); else c.lineTo(x, y); });
        c.stroke();
        kit.label(c, 'supercurrent I_c sin δ, last few seconds (slowed)', sx0 + 6, sy0 + 10, { size: 10.5, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

})();
